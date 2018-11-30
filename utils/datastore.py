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


# # save_image_data()
# get_all_images()
