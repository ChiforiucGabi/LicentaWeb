import base64
from cgitb import handler
from multiprocessing import connection
import os
import shutil
import zipfile
import yaml

def decContent(cont_enc):
    base64_bytes = cont_enc.encode('ascii')
    content_bytes = base64.b64decode(base64_bytes)
    return content_bytes.decode('ascii')

def makeServicesFiles(content, file_name):
    new_file=open("Dependencies" + "/" + file_name ,mode="w", encoding="utf-8")
    new_file.write(content)
    new_file.close()

def makeServicesFilesCR(content, file_name, dir_name, isDependency):
    if isDependency:
        if os.path.exists("DependenciesCR" + "/" + dir_name)==False:
            os.mkdir("DependenciesCR" + "/" + dir_name)
        
        new_file=open("DependenciesCR" + "/" + dir_name + "/" + file_name ,mode="w", encoding="utf-8")
    else:
        new_file=open("DependenciesCR" + "/" + file_name ,mode="w", encoding="utf-8")

    new_file.write(content)
    new_file.close()

def copyInstallSh():
    with open('install.sh') as f:
        contents = f.read()

    makeServicesFiles(contents,"install.sh")

def clearDirectory():
    if os.path.exists("Dependencies")==True:
         shutil.rmtree("Dependencies")

    if os.path.exists("final.yml")==True:
        os.remove("final.yml")

def clearDirectoryCR():
    if os.path.exists("DependenciesCR")==True:
         shutil.rmtree("DependenciesCR")

    if os.path.exists("finalCR.yml")==True:
        os.remove("finalCR.yml")

def zipdir(path, ziph):
    # ziph is zipfile handle
    for root, dirs, files in os.walk(path):
        for file in files:
            ziph.write(os.path.join(root, file), 
                       os.path.relpath(os.path.join(root, file), 
                                       os.path.join(path, '..')))

def makeFinalZip():
    with zipfile.ZipFile('Dependencies.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipdir('Dependencies/', zipf)

    with open('Dependencies.zip', "rb") as f:
        bytes = f.read()
        encoded_zip_content = base64.b64encode(bytes)

    return encoded_zip_content

def makeFinalZipCR():
    with zipfile.ZipFile('DependenciesCR.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipdir('DependenciesCR/', zipf)

    with open('DependenciesCR.zip', "rb") as f:
        bytes = f.read()
        encoded_zip_content = base64.b64encode(bytes)

    return encoded_zip_content

def getServiceYmlData(service_name):
    path = "Dependencies" + "/" + service_name + ".yml"

    with open(path) as f:
        data = yaml.load(f, Loader=yaml.FullLoader)

    os.remove(path)
    return data

def getServiceYmlDataCR(service_name):
    path = "DependenciesCR" + "/" + service_name + ".yml"

    with open(path) as f:
        data = yaml.load(f, Loader=yaml.FullLoader)

    os.remove(path)
    return data

def combineDict(yml_list, service_names_list_txt):
    model ={}
    model['connection'] = ''
    model['vars'] = ''
    model['tasks'] = ''
    model['handlers'] = ''

    aux = {}
    for single_yml in yml_list:
        for dict in single_yml:
            for list in dict:
                if list in aux:
                    aux[list] += (dict[list])
                else:
                    aux[list] = dict[list]

    final = {}    
    final['name'] = "Installing" + service_names_list_txt
    final['hosts'] = 'all'
    final['become'] = 'true'

    for key in model:
        if key in aux:
            final[key] = aux[key]

    return [final]

def combineDictCR(yml_list, service_names_list_txt, VMId):
    model ={}
    model['tasks'] = ''
    model['handlers'] = ''
 
    aux = {}
    for single_yml in yml_list:
        for dict in single_yml:
            for list in dict:
                continueID = False
                if list == "vars":
                    for vars in dict[list]:
                        continueID = False
                        if vars == "vm_id":
                            dict[list][vars] = VMId
                            saved = dict[list]
                            continueID = True
                            continue
                if continueID == True:
                    continue
                if list in aux:
                    aux[list] += (dict[list])
                    # aux[list].update(dict[list])                    
                else:
                    aux[list] = dict[list]

    final = {}    
    final['name'] = "Installing" + service_names_list_txt
    final['hosts'] = 'localhost'
    final['connection'] = 'local'
    final['become'] = 'True'
    final['vars'] = saved

    varsKey = 'vars'
    if varsKey in aux:
        final['vars'].update(aux[varsKey])

    for key in model:
        if key in aux:
            final[key] = aux[key]

    return [final]

def getPlaybookContent(yml_list, service_names_list_txt):
    combined_playbook = combineDict(yml_list, service_names_list_txt)

    with open("Dependencies" + "/" + "final.yml", 'w') as f:
        dump = yaml.dump(combined_playbook, f, sort_keys=False)
        
    with open("Dependencies" + "/" + "final.yml") as f:
        content_to_display = f.read()
    
    return content_to_display

def getPlaybookContentCR(yml_list, service_names_list_txt, VMId):
    combined_playbook = combineDictCR(yml_list, service_names_list_txt, VMId)

    with open("DependenciesCR" + "/" + "final.yml", 'w') as f:
        dump = yaml.dump(combined_playbook, f, sort_keys=False)
        
    with open("DependenciesCR" + "/" + "final.yml") as f:
        content_to_display = f.read()
    
    return content_to_display

def copyDependenciesInSharedDir():
    source_folder = "DependenciesCR/"
    destination_folder = "../var/www/html/scripts/DependenciesCR"

    cmd = 'rm -rf /var/www/html/scripts/DependenciesCR'
    os.system(cmd)

    cmd = 'cp -R DependenciesCR /var/www/html/scripts/DependenciesCR'
    os.system(cmd)

    # os.mkdir(destination_folder)

    # shutil.copytree(source_dir, destination_dir)