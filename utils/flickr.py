# Utils and functions for connecting to the flickrapi

from flickrapi import FlickrAPI

flickr_api = None
extras = 'license,url_c,url_o,geo, tags, machine_tags, o_dims, views,description, date_taken, owner_name'
extras = "url_t, url_s, url_n"
sort_params = "relevance"

# more info on extra field meanings - http://joequery.me/code/flickr-api-image-search-python/


# setup twitter credentions
def init(credentials):
    global flickr_api
    flickr_api = FlickrAPI(
        credentials.flickr_key,
        credentials.flickr_secret,
        format='parsed-json')


# search flickr api for image
def search_photos_text(search_text, num_max_results, page_num, sort_param):
    search_results = flickr_api.photos.search(
        text=search_text,
        per_page=num_max_results,
        page=page_num,
        extras=extras,
        sort=sort_param)
    result_photo_array = search_results['photos']
    # print(result_photo_array)
    return result_photo_array
    # for row in :
    #     print(row["url_c"])


# Save information on a image to datastore
def save_image_info(image_info, search_tag):
    print(image_result["photo"]["urls"])
    return image_result


def get_image_info(image_id):
    image_result = flickr_api.photos.getinfo(photo_id=image_id, extras=extras)
    print(image_result["photo"]["title"]["_content"])
    return image_result


def get_images_info(image_ids):
    image_results = []
    for image_id in image_ids:
        image_result = flickr_api.photos.getinfo(
            photo_id=image_id, extras=extras)
        print(image_result)
        image_results.append(image_result)
    print(image_results)
    return image_results

# search_photos_text("lagos nigeria", 5)
