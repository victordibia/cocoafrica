from utils import credentials
from utils import flickr 
from utils import datastore as ds

flickr.init(credentials)

# results = flickr.search_photos_text("games",6,10)
# for row in results["photo"]:
#     print(row["id"])
#     print ("=========")

# photo_find = flickr.get_image_info("15779193446")
# ds.save_image_data(photo_find,"lagos nigeria")

results  = ds.get_images()
for row in results:
    result_payload = {"url": row["url"], "title": "", "source": row["source"], "description":row["description"]}
    print(result_payload)

    print("=========")