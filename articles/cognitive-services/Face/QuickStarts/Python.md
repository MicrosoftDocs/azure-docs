---
title: Face API Python quick start | Microsoft Docs
description: Get information and code samples to help you quickly get started using the Face API with Python in Cognitive Services.
services: cognitive-services
author: v-royhar
manager: yutkuo

ms.service: cognitive-services
ms.technology: face
ms.topic: article
ms.date: 06/21/2017
ms.author: anroth
---

# Face API Python Quick Starts
This article provides information and code samples to help you quickly get started using the Face API with Python to accomplish the following tasks: 
* [Detect Faces in Images](#Detect) 
* [Create a Person Group](#Create)

Learn more about obtaining free Subscription Keys [here](../../Computer-vision/Vision-API-How-to-Topics/HowToSubscribe.md)

## Detect faces in images with Face API using Python <a name="Detect"> </a>
Use the [Face - Detect method](https://westcentralus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) 
to detect faces in an image and return face attributes including:
* Face ID: Unique ID used in several Face API scenarios. 
* Face Rectangle: The left, top, width, and height indicating the location of the face in the image.
* Landmarks: An array of 27-point face landmarks pointing to the important positions of face components.
* Facial attributes including age, gender, smile intensity, head pose, and facial hair. 

#### Face Detect python example request

1. Copy the appropriate section for your version of Python and save it to a file such as `detect_faces.py`.
1. Replace the `subscriptionKey` value with your valid subscription key.
1. Change the `uri_base` value to use the location where you obtained your subscription keys.
1. Run the sample.

```python
import httplib, urllib, base64, json

###############################################
#### Update or verify the following values. ###
###############################################

# Replace the subscription_key string value with your valid subscription key.
subscription_key = '13hc77781f7e4b19b5fcdd72a8df7156'

# Replace or verify the region.
#
# You must use the same region in your REST API call as you used to obtain your subscription keys.
# For example, if you obtained your subscription keys from the westus region, replace 
# "westcentralus" in the URI below with "westus".
#
# NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
# a free trial subscription key, you should not need to change this region.
uri_base = 'westcentralus.api.cognitive.microsoft.com'

# Request headers.
headers = {
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': subscription_key,
}

# Request parameters.
params = urllib.urlencode({
    'returnFaceId': 'true',
    'returnFaceLandmarks': 'false',
    'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise',
})

# The URL of a JPEG image to analyze.
body = "{'url':'https://upload.wikimedia.org/wikipedia/commons/c/c3/RH_Louise_Lillian_Gish.jpg'}"

try:
    # Execute the REST API call and get the response.
    conn = httplib.HTTPSConnection('westcentralus.api.cognitive.microsoft.com')
    conn.request("POST", "/face/v1.0/detect?%s" % params, body, headers)
    response = conn.getresponse()
    data = response.read()

    # 'data' contains the JSON data. The following formats the JSON data for display.
    parsed = json.loads(data)
    print ("Response:")
    print (json.dumps(parsed, sort_keys=True, indent=2))
    conn.close()

except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))

####################################

########### Python 3.6 #############
import http.client, urllib.request, urllib.parse, urllib.error, base64, requests, json

###############################################
#### Update or verify the following values. ###
###############################################

# Replace the subscription_key string value with your valid subscription key.
subscription_key = '13hc77781f7e4b19b5fcdd72a8df7156'

# Replace or verify the region.
#
# You must use the same region in your REST API call as you used to obtain your subscription keys.
# For example, if you obtained your subscription keys from the westus region, replace 
# "westcentralus" in the URI below with "westus".
#
# NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
# a free trial subscription key, you should not need to change this region.
uri_base = 'https://westcentralus.api.cognitive.microsoft.com'

# Request headers.
headers = {
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': subscription_key,
}

# Request parameters.
params = {
    'returnFaceId': 'true',
    'returnFaceLandmarks': 'false',
    'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise',
}

# Body. The URL of a JPEG image to analyze.
body = {'url': 'https://upload.wikimedia.org/wikipedia/commons/c/c3/RH_Louise_Lillian_Gish.jpg'}

try:
    # Execute the REST API call and get the response.
    response = requests.request('POST', uri_base + '/face/v1.0/detect', json=body, data=None, headers=headers, params=params)

    print ('Response:')
    parsed = json.loads(response.text)
    print (json.dumps(parsed, sort_keys=True, indent=2))

except Exception as e:
    print('Error:')
    print(e)

####################################	

```
#### Face Detect response

A successful response is returned in JSON. Following is an example of a successful response: 

```json
Response:
[
  {
    "faceAttributes": {
      "accessories": [],
      "age": 22.9,
      "blur": {
        "blurLevel": "low",
        "value": 0.06
      },
      "emotion": {
        "anger": 0.0,
        "contempt": 0.0,
        "disgust": 0.0,
        "fear": 0.0,
        "happiness": 0.0,
        "neutral": 0.986,
        "sadness": 0.009,
        "surprise": 0.005
      },
      "exposure": {
        "exposureLevel": "goodExposure",
        "value": 0.67
      },
      "facialHair": {
        "beard": 0.0,
        "moustache": 0.0,
        "sideburns": 0.0
      },
      "gender": "female",
      "glasses": "NoGlasses",
      "hair": {
        "bald": 0.0,
        "hairColor": [
          {
            "color": "brown",
            "confidence": 1.0
          },
          {
            "color": "black",
            "confidence": 0.87
          },
          {
            "color": "other",
            "confidence": 0.51
          },
          {
            "color": "blond",
            "confidence": 0.08
          },
          {
            "color": "red",
            "confidence": 0.08
          },
          {
            "color": "gray",
            "confidence": 0.02
          }
        ],
        "invisible": false
      },
      "headPose": {
        "pitch": 0.0,
        "roll": 0.1,
        "yaw": -32.9
      },
      "makeup": {
        "eyeMakeup": true,
        "lipMakeup": true
      },
      "noise": {
        "noiseLevel": "low",
        "value": 0.0
      },
      "occlusion": {
        "eyeOccluded": false,
        "foreheadOccluded": false,
        "mouthOccluded": false
      },
      "smile": 0.0
    },
    "faceId": "49d55c17-e018-4a42-ba7b-8cbbdfae7c6f",
    "faceRectangle": {
      "height": 162,
      "left": 177,
      "top": 131,
      "width": 162
    }
  }
]
```
## Create a Person Group with Face API using Python <a name="Create"> </a>
Use the [Person Group - Create a Person Group method](https://westcentralus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244) 
to create a person group with specified personGroupId, name, and user-provided userData. A person group is one of the most important parameters for the Face - Identify API. The Identify API searches for persons' faces in a specified person group. 

#### Person Group - create a Person Group example

Copy the appropriate section for your version of Python and save it to a file such as `test.py`. Replace the "Ocp-Apim-Subscription-Key" value with your valid subscription key, and change the REST URL to use the region where you obtained your subscription keys.

```python
########### Python 2.7 #############
import httplib, urllib, base64

headers = {
    # Request headers.
    'Content-Type': 'application/json',

    # NOTE: Replace the "Ocp-Apim-Subscription-Key" value with a valid subscription key.
    'Ocp-Apim-Subscription-Key': '13hc77781f7e4b19b5fcdd72a8df7156',
}

# Replace 'examplegroupid' with an ID you haven't used for creating a group before.
# The valid characters for the ID include numbers, English letters in lower case, '-' and '_'. 
# The maximum length of the ID is 64.
personGroupId = 'examplegroupid'

# The userData field is optional. The size limit for it is 16KB.
body = "{ 'name':'group1', 'userData':'user-provided data attached to the person group' }"

try:
    # NOTE: You must use the same region in your REST call as you used to obtain your subscription keys.
    #   For example, if you obtained your subscription keys from westus, replace "westcentralus" in the 
    #   URL below with "westus".
    conn = httplib.HTTPSConnection('westcentralus.api.cognitive.microsoft.com')
    conn.request("POST", "/face/v1.0/persongroups/%s" % personGroupId, body, headers)
    response = conn.getresponse()

	# 'OK' indicates success. 'Conflict' means a group with this ID already exists.
	# If you get 'Conflict', change the value of personGroupId above and try again.
	# If you get 'Access Denied', verify the validity of the subscription key above and try again.
    print(response.reason)

    conn.close()
except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))
####################################

########### Python 3.2 #############
import http.client, urllib.request, urllib.parse, urllib.error, base64, sys

headers = {
    # Request headers.
    'Content-Type': 'application/json',

    # NOTE: Replace the "Ocp-Apim-Subscription-Key" value with a valid subscription key.
    'Ocp-Apim-Subscription-Key': '13hc77781f7e4b19b5fcdd72a8df7156',
}

# Replace 'examplegroupid' with an ID you haven't used for creating a group before.
# The valid characters for the ID include numbers, English letters in lower case, '-' and '_'. 
# The maximum length of the ID is 64.
personGroupId = 'examplegroupid'

# The userData field is optional. The size limit for it is 16KB.
body = "{ 'name':'group1', 'userData':'user-provided data attached to the person group' }"

try:
    # NOTE: You must use the same location in your REST call as you used to obtain your subscription keys.
    #   For example, if you obtained your subscription keys from westus, replace "westcentralus" in the 
    #   URL below with "westus".
    conn = http.client.HTTPSConnection('westcentralus.api.cognitive.microsoft.com')
    conn.request("PUT", "/face/v1.0/persongroups/%s" % personGroupId, body, headers)
    response = conn.getresponse()

	# 'OK' indicates success. 'Conflict' means a group with this ID already exists.
	# If you get 'Conflict', change the value of personGroupId above and try again.
	# If you get 'Access Denied', verify the validity of the subscription key above and try again.
    print(response.reason)

    conn.close()
except Exception as e:
    print(e.args)
####################################
```