# Utils to connect to Google Datastore
# Imports the Google Cloud client library
from google.cloud import datastore
import json
import os
import datetime
import urllib.request
# Instantiates a client
client = datastore.Client()

# The kind for the new entity
imagedata_kind = 'imagedata'


def get_images():
    query = client.query(kind=imagedata_kind)
    query_results = list(query.fetch())
    return query_results


def delete_image_data():
    print("df")


def save_image_data(curated_data):
    # Prepares the new entity
    for image_info in curated_data["imageids"]:
        imagedata = datastore.Entity(client.key(imagedata_kind))
        imagedata['title'] = image_info["title"]
        imagedata['url'] = image_info["url"]
        # imagedata['url'] = "https://farm" + str(image_info["photo"]["farm"]) + ".staticflickr.com/" + \
        #     image_info["photo"]["server"] + "/"+image_info["photo"]["id"] + \
        #     "_" + image_info["photo"]["secret"] + "_c.jpg"
        imagedata['searchsource'] = curated_data["searchsource"]
        imagedata['sourceid'] = image_info["id"]
        imagedata['searchtags'] = curated_data["searchtags"]
        imagedata['searchterm'] = curated_data["searchterm"]

        # Saves the entity
        # print(imagedata)
        # client.put(imagedata)
        # break
    return "data saved"

def mkdir(directory_path):
  if not os.path.exists(directory_path):
      os.makedirs(directory_path)
      print("  >> Directory created at " +  directory_path)
    
def download_image(url, save_path):
    urllib.request.urlretrieve(url,save_path)     

def save_image_data_to_folder(curated_data):
    imagedata = {}
    print(curated_data)
    imagedata['searchsource'] = curated_data["searchsource"] 
    imagedata['searchtags'] = curated_data["searchtags"]
    imagedata['searchterm'] = curated_data["searchterm"]
    imagedata["imagemetadata"] = curated_data["imageids"]

    now = datetime.datetime.now()     
    base_save_path = curated_data["searchterm"].replace(" ","") 
    full_save_path = now.strftime("%Y_%m%_d%_H_%M")
    mkdir(os.path.join("datasets",base_save_path))

    # download the image
    mkdir(os.path.join("datasets", base_save_path, "images"))
    for image_info in curated_data["imageids"]:
        save_path =  os.path.join("datasets", base_save_path, "images", image_info["id"] + ".jpg")
        download_image(image_info["url"], save_path)
        print(image_info["url"])
    
    # mkdir(os.path.join("datasets",full_save_path))

    with open( os.path.join("datasets",base_save_path,full_save_path) + ".json", 'w') as outfile:  
        json.dump(imagedata, outfile)

    return "data saved"


# # save_image_data()
# get_all_images()
