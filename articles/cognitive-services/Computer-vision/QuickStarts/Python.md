--- 
title: Computer Vision API Python quick start | Microsoft Docs
description: Get information and code samples to help you quickly get started using Python and the Computer Vision API in Microsoft Cognitive Services.
services: cognitive-services
author: JuliaNik
manager: ytkuo

ms.service: cognitive-services
ms.technology: computer-vision
ms.topic: article
ms.date: 06/12/2017
ms.author: juliakuz
--- 

# Computer Vision Python Quick Starts

This article provides information and code samples to help you quickly get started using the Computer Vision API with Python to accomplish the following tasks:
* [Analyze an image](#AnalyzeImage)
* [Use a Domain-Specific Model](#DomainSpecificModel)
* [Intelligently generate a thumbnail](#GetThumbnail)
* [Detect and extract printed text from an image](#OCR)
* [Detect and extract handwritten text from an image](#RecognizeText)

To use the Computer Vision API, you need a subscription key. You can get free subscription keys [here](https://docs.microsoft.com/en-us/azure/cognitive-services/Computer-vision/Vision-API-How-to-Topics/HowToSubscribe).

## Analyze an Image With Computer Vision API Using Python <a name="AnalyzeImage"> </a>

With the [Analyze Image method](https://westcentralus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fa), you can extract visual features based on image content. You can upload an image or specify an image URL and choose which features to return, including:
* A detailed list of tags related to the image content.
* A description of image content in a complete sentence.
* The coordinates, gender, and age of any faces contained in the image.
* The ImageType (clip art or a line drawing).
* The dominant color, the accent color, or whether an image is black & white.
* The category defined in this [taxonomy](https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/category-taxonomy).
* Does the image contain adult or sexually suggestive content?

### Analyze an Image Python Example Request

Copy the appropriate section for your version of Python and save it to a file such as `analyze.py`. Replace the `subscription_key` value with your valid subscription key, and change the `uri_base` to use the location where you obtained your subscription keys. Then execute the script.

```python
########### Python 2.7 #############
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

headers = {
    # Request headers.
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': subscription_key,
}

params = urllib.urlencode({
    # Request parameters. All of them are optional.
    'visualFeatures': 'Categories,Description,Color',
    'language': 'en',
})

# The URL of a JPEG image to analyze.
body = "{'url':'https://upload.wikimedia.org/wikipedia/commons/1/12/Broadway_and_Times_Square_by_night.jpg'}"

try:
    # Execute the REST API call and get the response.
    conn = httplib.HTTPSConnection('westcentralus.api.cognitive.microsoft.com')
    conn.request("POST", "/vision/v1.0/analyze?%s" % params, body, headers)
    response = conn.getresponse()
    data = response.read()

    # 'data' contains the JSON data. The following formats the JSON data for display.
    parsed = json.loads(data)
    print ("Response:")
    print (json.dumps(parsed, sort_keys=True, indent=2))
    conn.close()

except Exception as e:
    print('Error:')
    print(e)

####################################

########### Python 3.6 #############
import http.client, urllib.request, urllib.parse, urllib.error, base64, json

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

headers = {
    # Request headers.
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': subscription_key,
}

params = urllib.parse.urlencode({
    # Request parameters. All of them are optional.
    'visualFeatures': 'Categories,Description,Color',
    'language': 'en',
})

# Replace the three dots below with the URL of a JPEG image of a celebrity.
body = "{'url':'https://upload.wikimedia.org/wikipedia/commons/1/12/Broadway_and_Times_Square_by_night.jpg'}"

try:
    # Execute the REST API call and get the response.
    conn = http.client.HTTPSConnection('westcentralus.api.cognitive.microsoft.com')
    conn.request("POST", "/vision/v1.0/analyze?%s" % params, body, headers)
    response = conn.getresponse()
    data = response.read()

    # 'data' contains the JSON data. The following formats the JSON data for display.
    parsed = json.loads(data)
    print ("Response:")
    print (json.dumps(parsed, sort_keys=True, indent=2))
    conn.close()

except Exception as e:
    print('Error:')
    print(e)

####################################
```

### Analyze an Image Response

A successful response is returned in JSON. Following is an example of a successful response:

```json
Response:
{
  "categories": [
    {
      "name": "outdoor_street",
      "score": 0.625
    }
  ],
  "color": {
    "accentColor": "B74314",
    "dominantColorBackground": "Brown",
    "dominantColorForeground": "Brown",
    "dominantColors": [
      "Brown"
    ],
    "isBWImg": false
  },
  "description": {
    "captions": [
      {
        "confidence": 0.8241403656347864,
        "text": "a group of people on a city street filled with traffic at night"
      }
    ],
    "tags": [
      "outdoor",
      "building",
      "street",
      "city",
      "busy",
      "people",
      "filled",
      "traffic",
      "many",
      "table",
      "car",
      "group",
      "walking",
      "bunch",
      "crowded",
      "large",
      "night",
      "light",
      "standing",
      "man",
      "tall",
      "umbrella",
      "riding",
      "sign",
      "crowd"
    ]
  },
  "metadata": {
    "format": "Jpeg",
    "height": 2436,
    "width": 1826
  },
  "requestId": "92525ac4-fda0-47c3-876c-6457851fdb08"
}
```

## Use a Domain-Specific Model <a name="DomainSpecificModel"> </a>

The Domain-Specific Model is a model trained to identify a specific set of objects in an image. The two domain-specific models that are currently available are celebrities and landmarks. The following example identifies a landmark in an image.

### Landmark Python Example Request

Copy the appropriate section for your version of Python and save it to a file such as `landmark.py`. Replace the `subscription_key` value with your valid subscription key, and change the `uri_base` to use the location where you obtained your subscription keys. Then execute the script.

```python
########### Python 2.7 #############
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

headers = {
    # Request headers.
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': subscription_key,
}

params = urllib.urlencode({
    # Request parameters. Use 'model': 'celebrities' to use the Celebrities model.
    'model': 'landmarks',
})

# The URL of a JPEG image containing a landmark.
body = "{'url':'https://upload.wikimedia.org/wikipedia/commons/2/23/Space_Needle_2011-07-04.jpg'}"

try:
    # Execute the REST API call and get the response.
    conn = httplib.HTTPSConnection(uri_base)

    # Change "landmarks" to "celebrities" in the url to use the Celebrities model.
    conn.request("POST", "/vision/v1.0/models/landmarks/analyze?%s" % params, body, headers)
    response = conn.getresponse()
    data = response.read()

    # 'data' contains the JSON data. The following formats the JSON data for display.
    parsed = json.loads(data)
    print ("Response:")
    print (json.dumps(parsed, sort_keys=True, indent=2))
    conn.close()

except Exception as e:
    print('Error:')
    print(e)

####################################

########### Python 3.6 #############
import http.client, urllib.request, urllib.parse, urllib.error, base64, json

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

headers = {
    # Request headers.
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': subscription_key,
}

params = urllib.parse.urlencode({
    # Request parameters. Use "model": "celebrities" to use the Celebrity model.
    'model': 'landmarks',
})

# The URL of a JEPG image containing text.
body = "{'url':'https://upload.wikimedia.org/wikipedia/commons/2/23/Space_Needle_2011-07-04.jpg'}"

try:
    # Execute the REST API call and get the response.
    conn = http.client.HTTPSConnection(uri_base)
    conn.request("POST", "/vision/v1.0/models/landmarks/analyze?%s" % params, body, headers)
    response = conn.getresponse()
    data = response.read()

    # 'data' contains the JSON data. The following formats the JSON data for display.
    parsed = json.loads(data)
    print ("Response:")
    print (json.dumps(parsed, sort_keys=True, indent=2))
    conn.close()

except Exception as e:
    print('Error:')
    print(e)

####################################
```

### Landmark Example Response

A successful response is returned in JSON. Following is an example of a successful response:  

```json
{
  "metadata": {
    "format": "Jpeg",
    "height": 4132,
    "width": 2096
  },
  "requestId": "d08a914a-0fbb-4695-9a2e-c93791865436",
  "result": {
    "landmarks": [
      {
        "confidence": 0.9998178,
        "name": "Space Needle"
      }
    ]
  }
}
```

## Get a Thumbnail with Computer Vision API Using Python <a name="GetThumbnail"> </a>

Use the [Get Thumbnail method](https://westcentralus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fb) to crop an image based on its region of interest (ROI) to the height and width you desire. The aspect ratio you set for the thumbnail can be different from the aspect ratio of the input image.

### Get a Thumbnail Python Example Request

Copy the appropriate section for your version of Python and save it to a file such as `thumbnail.py`. Replace the `subscription_key` value with your valid subscription key, and change the `uri_base` to use the location where you obtained your subscription keys. Then execute the script.

```python
########### Python 2.7 #############
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

headers = {
    # Request headers.
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': subscription_key,
}

params = urllib.urlencode({
    # Request parameters. The smartCropping flag is optional.
    'width': '150',
    'height': '100',
    'smartCropping': 'true',
})

# The URL of a JPEG image to use to create a thumbnail image.
body = "{'url':'https://upload.wikimedia.org/wikipedia/commons/9/94/Bloodhound_Puppy.jpg'}"

try:
    # Execute the REST API call and get the response.
    conn = httplib.HTTPSConnection('westcentralus.api.cognitive.microsoft.com')
    conn.request("POST", "/vision/v1.0/generateThumbnail?%s" % params, body, headers)
    response = conn.getresponse()
    
    # Check for success.
    if response.status == 200:
        # Success. Use 'response.read()' to return the image data. 
        # Display the response headers.
        print ('Success.')
        print ('Response headers:')
        headers = response.getheaders()
        for field, value in headers:
            print ('  ' + field + ': ' + value)
    else:
        # Error. 'data' contains the JSON error data. Display the error data.
        data = response.read()
        parsed = json.loads(data)
        print ('Error:')
        print (json.dumps(parsed, sort_keys=True, indent=2))
    
    conn.close()

except Exception as e:
    print('Error:')
    print(e)

####################################

########### Python 3.6 #############
import http.client, urllib.request, urllib.parse, urllib.error, base64, json

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

headers = {
    # Request headers.
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': subscription_key,
}

params = urllib.parse.urlencode({
    # Request parameters. The smartCropping flag is optional.
    'width': '150',
    'height': '100',
    'smartCropping': 'true',
})

# Replace the three dots below with the URL of the JPEG image for which you want a thumbnail.
body = "{'url':'https://upload.wikimedia.org/wikipedia/commons/9/94/Bloodhound_Puppy.jpg'}"

try:
    # Execute the REST API call and get the response.
    conn = http.client.HTTPSConnection('westcentralus.api.cognitive.microsoft.com')
    conn.request("POST", "/vision/v1.0/generateThumbnail?%s" % params, body, headers)
    response = conn.getresponse()
    
    # Check for success.
    if response.status == 200:
        # Success. Use 'response.read()' to return the image data. 
        # Display the response headers.
        print ('Success.')
        print ('Response headers:')
        headers = response.getheaders()
        for field, value in headers:
            print ('  ' + field + ': ' + value)
    else:
        # Error. 'data' contains the JSON error data. Display the error data.
        data = response.read()
        parsed = json.loads(data)
        print ('Error:')
        print (json.dumps(parsed, sort_keys=True, indent=2))
    
    conn.close()

except Exception as e:
    print('Error:')
    print(e)

####################################
```

### Get a Thumbnail Response

A successful response contains the thumbnail image binary. If the request fails, the response contains an error code and a message to help determine what went wrong. Following is an example of a successful response:

```text
Success.
Response headers:
  Cache-Control: no-cache
  Pragma: no-cache
  Content-Length: 4025
  Content-Type: image/jpeg
  Expires: -1
  X-AspNet-Version: 4.0.30319
  X-Powered-By: ASP.NET
  apim-request-id: e2533391-44a9-4265-a681-91b07aaab6dd
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  x-content-type-options: nosniff
  Date: Thu, 08 Jun 2017 22:51:16 GMT
```

## Optical Character Recognition (OCR) with Computer Vision API Using Python <a name="OCR"> </a>

Use the [Optical Character Recognition (OCR) method](https://westcentralus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fc) to detect text in an image and extract recognized characters into a machine-usable character stream.

### OCR Python Example Request

Copy the appropriate section for your version of Python and save it to a file such as `ocr.py`. Replace the `subscription_key` value with your valid subscription key, and change the `uri_base` to use the location where you obtained your subscription keys. Then execute the script.

```python
########### Python 2.7 #############
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

headers = {
    # Request headers.
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': subscription_key,
}

params = urllib.urlencode({
    # Request parameters. The language setting "unk" means automatically detect the language.
    'language': 'unk',
    'detectOrientation ': 'true',
})

# The URL of a JPEG image containing text.
body = "{'url':'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Atomist_quote_from_Democritus.png/338px-Atomist_quote_from_Democritus.png'}"

try:
    # Execute the REST API call and get the response.
    conn = httplib.HTTPSConnection('westcentralus.api.cognitive.microsoft.com')
    conn.request("POST", "/vision/v1.0/ocr?%s" % params, body, headers)
    response = conn.getresponse()
    data = response.read()

    # 'data' contains the JSON data. The following formats the JSON data for display.
    parsed = json.loads(data)
    print ("Response:")
    print (json.dumps(parsed, sort_keys=True, indent=2))
    conn.close()

except Exception as e:
    print('Error:')
    print(e)

####################################

########### Python 3.6 #############
import http.client, urllib.request, urllib.parse, urllib.error, base64, json

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

headers = {
    # Request headers.
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': subscription_key,
}

params = urllib.parse.urlencode({
    # Request parameters. The language setting "unk" means automatically detect the language.
    'language': 'unk',
    'detectOrientation ': 'true',
})

# The URL of a JPEG image containing text.
body = "{'url':'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Atomist_quote_from_Democritus.png/338px-Atomist_quote_from_Democritus.png'}"

try:
    # Execute the REST API call and get the response.
    conn = http.client.HTTPSConnection('westcentralus.api.cognitive.microsoft.com')
    conn.request("POST", "/vision/v1.0/ocr?%s" % params, body, headers)
    response = conn.getresponse()
    data = response.read()

    # 'data' contains the JSON data. The following formats the JSON data for display.
    parsed = json.loads(data)
    print ("Response:")
    print (json.dumps(parsed, sort_keys=True, indent=2))
    conn.close()

except Exception as e:
    print('Error:')
    print(e)

####################################
```

### OCR Example Response

Upon success, the OCR results include the text from the image. They also include bounding boxes for regions, lines, and words. Following is an example of a successful response:

```json
Response:
{
  "language": "en",
  "orientation": "Up",
  "regions": [
    {
      "boundingBox": "21,16,304,451",
      "lines": [
        {
          "boundingBox": "28,16,288,41",
          "words": [
            {
              "boundingBox": "28,16,288,41",
              "text": "NOTHING"
            }
          ]
        },
        {
          "boundingBox": "27,66,283,52",
          "words": [
            {
              "boundingBox": "27,66,283,52",
              "text": "EXISTS"
            }
          ]
        },
        {
          "boundingBox": "27,128,292,49",
          "words": [
            {
              "boundingBox": "27,128,292,49",
              "text": "EXCEPT"
            }
          ]
        },
        {
          "boundingBox": "24,188,292,54",
          "words": [
            {
              "boundingBox": "24,188,292,54",
              "text": "ATOMS"
            }
          ]
        },
        {
          "boundingBox": "22,253,297,32",
          "words": [
            {
              "boundingBox": "22,253,105,32",
              "text": "AND"
            },
            {
              "boundingBox": "144,253,175,32",
              "text": "EMPTY"
            }
          ]
        },
        {
          "boundingBox": "21,298,304,60",
          "words": [
            {
              "boundingBox": "21,298,304,60",
              "text": "SPACE."
            }
          ]
        },
        {
          "boundingBox": "26,387,294,37",
          "words": [
            {
              "boundingBox": "26,387,210,37",
              "text": "Everything"
            },
            {
              "boundingBox": "249,389,71,27",
              "text": "else"
            }
          ]
        },
        {
          "boundingBox": "127,431,198,36",
          "words": [
            {
              "boundingBox": "127,431,31,29",
              "text": "is"
            },
            {
              "boundingBox": "172,431,153,36",
              "text": "opinion."
            }
          ]
        }
      ]
    }
  ],
  "textAngle": 0.0
}
```

## Text recognition with Computer Vision API Using Python <a name="RecognizeText"> </a>

Use the [RecognizeText method](https://ocr.portal.azure-api.net/docs/services/56f91f2d778daf23d8ec6739/operations/587f2c6a154055056008f200) to detect handwritten or printed text in an image and extract recognized characters into a machine-usable character stream.

### Handwriting Recognition Python Example

Copy the appropriate section for your version of Python and save it to a file such as `handwriting.py`. Replace the `subscription_key` value with your valid subscription key, and change the `uri_base` to use the location where you obtained your subscription keys. Then execute the script.

```python
########### Python 2.7 #############
import httplib, urllib, base64, time, json

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

headers = {
    # Request headers.
    # Another valid content type is "application/octet-stream".
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': subscription_key,
}

# The URL of a JPEG image containing handwritten text.
body = "{'url':'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Cursive_Writing_on_Notebook_paper.jpg/800px-Cursive_Writing_on_Notebook_paper.jpg'}"

# For printed text, set "handwriting" to false.
params = urllib.urlencode({'handwriting' : 'true'})

try:
    # This operation requrires two REST API calls. One to submit the image for processing,
    # the other to retrieve the text found in the image. 
    #
    # This executes the first REST API call and gets the response.
    conn = httplib.HTTPSConnection(uri_base)
    conn.request("POST", "/vision/v1.0/RecognizeText?%s" % params, body, headers)
    response = conn.getresponse()
    
    # Success is indicated by a status of 202.
    if response.status != 202:
        # Display JSON data and exit if the first REST API call was not successful.
        parsed = json.loads(response.read())
        print ("Error:")
        print (json.dumps(parsed, sort_keys=True, indent=2))
        conn.close()
        exit()

    # The 'Operation-Location' in the response contains the URI to retrieve the recognized text.
    operationLocation = response.getheader('Operation-Location')
    parsedLocation = operationLocation.split(uri_base)
    answerURL = parsedLocation[1]

    # NOTE: The response may not be immediately available. Handwriting recognition is an
    # async operation that can take a variable amount of time depending on the length
    # of the text you want to recognize. You may need to wait or retry this GET operation.

    print('\nHandwritten text submitted. Waiting 10 seconds to retrieve the recognized text.\n')
    time.sleep(10)
    
    # Execute the second REST API call and get the response.
    conn = httplib.HTTPSConnection(uri_base)
    conn.request("GET", answerURL, '', headers)
    response = conn.getresponse()
    data = response.read()

    # 'data' contains the JSON data. The following formats the JSON data for display.
    parsed = json.loads(data)
    print ("Response:")
    print (json.dumps(parsed, sort_keys=True, indent=2))
    conn.close()

except Exception as e:
    print('Error:')
    print(e)

####################################

########### Python 3.6 #############
import http.client, urllib.request, urllib.parse, urllib.error, base64, requests, time, json

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

requestHeaders = {
    # Request headers.
    # Another valid content type is "application/octet-stream".
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': subscription_key,
}

# The URL of a JPEG image containing handwritten text.
body = {'url' : 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Cursive_Writing_on_Notebook_paper.jpg/800px-Cursive_Writing_on_Notebook_paper.jpg'}

# For printed text, set "handwriting" to false.
params = {'handwriting' : 'true'}

try:
    # This operation requrires two REST API calls. One to submit the image for processing,
    # the other to retrieve the text found in the image. 
    #
    # This executes the first REST API call and gets the response.
    response = requests.request('POST', uri_base + '/vision/v1.0/RecognizeText', json=body, data=None, headers=requestHeaders, params=params)
    
    # Success is indicated by a status of 202.
    if response.status_code != 202:
        # if the first REST API call was not successful, display JSON data and exit.
        parsed = json.loads(response.text)
        print ("Error:")
        print (json.dumps(parsed, sort_keys=True, indent=2))
        exit()

    # The 'Operation-Location' in the response contains the URI to retrieve the recognized text.
    operationLocation = response.headers['Operation-Location']

    # Note: The response may not be immediately available. Handwriting recognition is an
    # async operation that can take a variable amount of time depending on the length
    # of the text you want to recognize. You may need to wait or retry this GET operation.

    print('\nHandwritten text submitted. Waiting 10 seconds to retrieve the recognized text.\n')
    time.sleep(10)
    
    # Execute the second REST API call and get the response.
    response = requests.request('GET', operationLocation, json=None, data=None, headers=requestHeaders, params=None)

    # 'data' contains the JSON data. The following formats the JSON data for display.
    parsed = json.loads(response.text)
    print ("Response:")
    print (json.dumps(parsed, sort_keys=True, indent=2))

except Exception as e:
    print('Error:')
    print(e)

####################################
```

A successful response is returned in JSON. Following is an example of a successful response:

```json
Response:
{
  "recognitionResult": {
    "lines": [
      {
        "boundingBox": [
          2,
          84,
          783,
          96,
          782,
          154,
          1,
          148
        ],
        "text": "Pack my box with five dozen liquor jugs",
        "words": [
          {
            "boundingBox": [
              6,
              86,
              92,
              87,
              71,
              151,
              0,
              150
            ],
            "text": "Pack"
          },
          {
            "boundingBox": [
              86,
              87,
              172,
              88,
              150,
              152,
              64,
              151
            ],
            "text": "my"
          },
          {
            "boundingBox": [
              165,
              88,
              241,
              89,
              219,
              152,
              144,
              152
            ],
            "text": "box"
          },
          {
            "boundingBox": [
              234,
              89,
              343,
              90,
              322,
              154,
              213,
              152
            ],
            "text": "with"
          },
          {
            "boundingBox": [
              347,
              90,
              432,
              91,
              411,
              154,
              325,
              154
            ],
            "text": "five"
          },
          {
            "boundingBox": [
              432,
              91,
              538,
              92,
              516,
              154,
              411,
              154
            ],
            "text": "dozen"
          },
          {
            "boundingBox": [
              554,
              92,
              696,
              94,
              675,
              154,
              533,
              154
            ],
            "text": "liquor"
          },
          {
            "boundingBox": [
              710,
              94,
              800,
              96,
              800,
              154,
              688,
              154
            ],
            "text": "jugs"
          }
        ]
      },
      {
        "boundingBox": [
          2,
          52,
          65,
          46,
          69,
          89,
          7,
          95
        ],
        "text": "dog",
        "words": [
          {
            "boundingBox": [
              0,
              62,
              79,
              39,
              94,
              82,
              0,
              105
            ],
            "text": "dog"
          }
        ]
      },
      {
        "boundingBox": [
          6,
          2,
          771,
          13,
          770,
          75,
          5,
          64
        ],
        "text": "The quick brown fox jumps over the lazy",
        "words": [
          {
            "boundingBox": [
              8,
              4,
              92,
              5,
              77,
              71,
              0,
              71
            ],
            "text": "The"
          },
          {
            "boundingBox": [
              89,
              5,
              188,
              5,
              173,
              72,
              74,
              71
            ],
            "text": "quick"
          },
          {
            "boundingBox": [
              188,
              5,
              323,
              6,
              308,
              73,
              173,
              72
            ],
            "text": "brown"
          },
          {
            "boundingBox": [
              316,
              6,
              386,
              6,
              371,
              73,
              302,
              73
            ],
            "text": "fox"
          },
          {
            "boundingBox": [
              396,
              7,
              508,
              7,
              493,
              74,
              381,
              73
            ],
            "text": "jumps"
          },
          {
            "boundingBox": [
              501,
              7,
              604,
              8,
              589,
              75,
              487,
              74
            ],
            "text": "over"
          },
          {
            "boundingBox": [
              600,
              8,
              673,
              8,
              658,
              75,
              586,
              75
            ],
            "text": "the"
          },
          {
            "boundingBox": [
              670,
              8,
              800,
              9,
              787,
              76,
              655,
              75
            ],
            "text": "lazy"
          }
        ]
      }
    ]
  },
  "status": "Succeeded"
}
```