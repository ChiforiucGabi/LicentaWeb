from asyncio.windows_events import NULL
from typing import final
from certifi import contents
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS, cross_origin
from pymongo import MongoClient
import json
from re import sub
from utils import *
from flask import send_file

class Dependency:
    def __init__(self, name, content):
        self.name = name
        self.content = content

def obj_dict(obj):
    return obj.__dict__

CONNECTION_STRING = 'mongodb+srv://gchiforiuc:Licenta12345@licentacluster.mnebb.mongodb.net/Licenta'

app = Flask(__name__)

client = MongoClient(CONNECTION_STRING)
db = client['Licenta']
collection_name = db["Services"]

cors = CORS(app)

@app.route("/")
@cross_origin()
def index():
    return '<h1>Hello people :) </h1>'

@app.route("/load-services", methods=['POST'])
def loadServices():
    folder = './Licenta/'
    folders = [name for name in os.listdir(folder) if os.path.isdir(os.path.join(folder, name))]

    for sub_folder in folders:
        dependencies=[name for name in os.listdir("./Licenta/" + sub_folder)]
        dp=[]

        for dependency in dependencies:
            with open("./Licenta/" + sub_folder+"/"+dependency) as f:
                file_content = f.read()

            sample_string_bytes = file_content.encode("ascii")
  
            base64_bytes = base64.b64encode(sample_string_bytes)
            base64_string = base64_bytes.decode("ascii")

            dp.append(Dependency(dependency,base64_string))
        
        json_string = json.dumps(dp, default=obj_dict)
        collection_name.insert_one({
            "name": sub_folder,
            "dependencies": json.loads(json_string)
        })

    return jsonify({'message':"All files are updated successfully"})

@app.route("/get-services", methods=['GET'])
def getServices():
    final = []
    services = collection_name.find({})
    
    for service in services:
        service_name = (service['name'])

        final.append({
            '_id': str(ObjectId(service['_id'])),
            'name': service_name
        })

    return jsonify(final)

@app.route("/generate-playbook", methods=['POST'])
def generatePlaybook():
    requestedServices = request.json

    service_names_list_txt = ""
    dependencies = []
    yml_list = []

    clearDirectory()
    os.mkdir("Dependencies")

    copyInstallSh()

    for service_name in requestedServices:
        service_names_list_txt += " - " + service_name
        cursor = collection_name.find({'name': service_name})

        for service in cursor:
            obj = service['dependencies']
            for o in obj:
                content = decContent(o['content'])

                if  o['name'] != ( service_name + ".yml"):
                    dependencies.append(Dependency(o['name'], content))

                makeServicesFiles(content, o['name'])
            
            yml_list.append(getServiceYmlData(service_name))


    json_dependencies_string = json.dumps(dependencies, default=obj_dict)
    content_to_display = getPlaybookContent(yml_list,service_names_list_txt)
    encoded_zip_content = makeFinalZip()

    resp_final = { 'playbook': content_to_display, 'zip': encoded_zip_content.decode(encoding="utf-8"), 'dependencies' : json.loads(json_dependencies_string) }
    clearDirectory()

    return jsonify(resp_final)


@app.route('/download', methods=['GET'])
def download():
    print("aici")
    path = "D:/AN4/web_licenta/backend/src/dependencies.zip"
    return send_file(path, as_attachment=True)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)