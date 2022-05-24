import os
import json
from re import sub

class Dependency:
    def __init__(self, name, content):
        self.name = name
        self.content = content

    

folder = '../Licenta/'

folders = [name for name in os.listdir(folder) if os.path.isdir(os.path.join(folder, name))]

def obj_dict(obj):
        return obj.__dict__

for sub_folder in folders:
    dependencies=[name for name in os.listdir(sub_folder)]
    dp=[]
    i = 0
    for dependency in dependencies:

        with open("../Licenta/" +sub_folder+"\\"+dependency) as f:
            lines = f.readlines()

        dp.append(Dependency(dependency,lines))




