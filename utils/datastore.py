# Utils to connect to Google Datastore
# Imports the Google Cloud client library
from google.cloud import datastore

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

def save_image_data(image_info, search_tags):
    # Prepares the new entity
    imagedata = datastore.Entity(client.key(imagedata_kind))
    imagedata['description'] = image_info["photo"]["title"]["_content"]
    imagedata['url'] = "https://farm" + str(image_info["photo"]["farm"]) + ".staticflickr.com/" + image_info["photo"]["server"] +"/"+image_info["photo"]["id"] + "_" + image_info["photo"]["secret"] + "_c.jpg"   
    imagedata['source'] = 'flickr'
    imagedata['sourceid'] = image_info["photo"]["id"]
    imagedata['searchtags'] = search_tags
    imagedata['imageinfo'] = image_info
    # Saves the entity 
    client.put(imagedata)
    return "data saved"
 

# # save_image_data()
# get_all_images()