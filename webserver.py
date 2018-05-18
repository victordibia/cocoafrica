## Author: Victor Dibia
## Serves up the Coco-Africa Web Interface

from flask import Flask, render_template, request, jsonify
from utils import credentials
from utils import flickr
from utils import datastore as ds
from utils import auth
app = Flask(__name__, )


flickr.init(credentials)

@app.route("/")
def hello():
    return render_template('index.html')

@app.route("/verifytoken",methods=['POST'])
def verifytoken():
    input_data = request.json 
    response_payload = {"status": auth.verify_token(input_data["token"], credentials.google_app_clientid)}
    return jsonify(response_payload)

@app.route("/coco")
def test():
    return render_template('index.html')

@app.route("/search",methods=['POST'])
def search():
    input_data = request.json 
    print(input_data)
    response_payload = {"searchresults": flickr.search_photos_text(input_data["searchtext"], input_data["numresults"], input_data["page"], input_data["sort"] )}
    # print(response_payload)
    return jsonify(response_payload)


@app.route("/curateimage",methods=['POST'])
def curate():
    input_data = request.json 
    print(input_data)  # print(response_payload) 
    save_status = ds.save_image_data(flickr.get_image_info(input_data["id"]), input_data)
    response_payload = {"status": save_status}
    return jsonify(response_payload)
 

#  Allow external access using host 0.0.0.0 address.
if __name__ == '__main__':
    app.config['APPLICATION_ROOT'] = "/static"
    app.run(host='0.0.0.0', debug=True, port=5025)
