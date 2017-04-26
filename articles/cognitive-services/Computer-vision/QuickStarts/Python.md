--- 
title: Computer Vision API Python quick start | Microsoft Docs 
description: Get information and code samples to help you quickly get started using Python and the Computer Vision API in Microsoft Cognitive Services. 
services: cognitive-services
author: JuliaNik 
manager: ytkuo

ms.service: cognitive-services 
ms.technology: computer-vision 
ms.topic: article 
ms.date: 02/22/2017 
ms.author: juliakuz 
--- 

# Computer Vision Python Quick Starts
This article provides information and code samples to help you quickly get started using the Computer Vision API with Python to accomplish the following tasks:
* [Analyze an image](#AnalyzeImage)
* [Use a Domain-Specific Model](#DomainSpecificModel)
* [Intelligently generate a thumbnail](#GetThumbnail)
* [Detect and extract printed text from an image](#OCR)
* [Detect and extract handwritten text from an image](#RecognizeText)

To use the Computer Vision API, you need a subscription key. You can get free subscription keys [here](https://www.microsoft.com/cognitive-services/en-us/Computer-Vision-API/documentation/vision-api-how-to-topics/HowToSubscribe).

## Analyze an Image With Computer Vision API Using Python <a name="AnalyzeImage"> </a>
With the [Analyze Image method](https://westus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fa), you can extract visual features based on image content. You can upload an image or specify an image URL and choose which features to return, including:
* The category defined in this [taxonomy](https://www.microsoft.com/cognitive-services/en-us/Computer-Vision-API/documentation/Category-Taxonomy).
* A detailed list of tags related to the image content.
* A description of image content in a complete sentence.
* The coordinates, gender, and age of any faces contained in the image.
* The ImageType (clip art or a line drawing).
* The dominant color, the accent color, or whether an image is black & white.
* Does the image contains adult or sexually suggestive content?

### Analyze an Image Python Example Request

```Python
########### Python 2.7 #############
import httplib, urllib, base64

headers = {
    # Request headers. Replace the key below with your subscription key.
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '13hc77781f7e4b19b5fcdd72a8df7156',
}

params = urllib.urlencode({
    # Request parameters. All of them are optional.
    'visualFeatures': 'Categories',
    'details': 'Celebrities',
    'language': 'en',
})

# Replace the three dots below with the URL of a JPEG image of a celebrity.
body = "{'url':'...'}"

try:
    conn = httplib.HTTPSConnection('westus.api.cognitive.microsoft.com')
    conn.request("POST", "/vision/v1.0/analyze?%s" % params, body, headers)
    response = conn.getresponse()
    data = response.read()
    print(data)
    conn.close()
except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))

####################################

########### Python 3.2 #############
import http.client, urllib.request, urllib.parse, urllib.error, base64

headers = {
    # Request headers. Replace the key below with your subscription key.
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '13hc77781f7e4b19b5fcdd72a8df7156',
}

params = urllib.parse.urlencode({
    # Request parameters. All of them are optional.
    'visualFeatures': 'Categories',
    'details': 'Celebrities',
    'language': 'en',
})

# Replace the three dots below with the URL of a JPEG image of a celebrity.
body = "{'url':'...'}"

try:
    conn = http.client.HTTPSConnection('westus.api.cognitive.microsoft.com')
    conn.request("POST", "/vision/v1.0/analyze?%s" % params, body, headers)
    response = conn.getresponse()
    data = response.read()
    print(data)
    conn.close()
except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))
####################################

```

### Analyze an Image Response
A successful response is returned in JSON. Following is an example of a successful response:

```json
{
  "categories": [
    {
      "name": "abstract_",
      "score": 0.00390625
    },
    {
      "name": "people_",
      "score": 0.83984375,
      "detail": {
        "celebrities": [
          {
            "name": "Satya Nadella",
            "faceRectangle": {
              "left": 597,
              "top": 162,
              "width": 248,
              "height": 248
            },
            "confidence": 0.999028444
          }
        ]
      }
    }
  ],
  "adult": {
    "isAdultContent": false,
    "isRacyContent": false,
    "adultScore": 0.0934349000453949,
    "racyScore": 0.068613491952419281
  },
    "tags": [
    {
      "name": "person",
      "confidence": 0.98979085683822632
    },
    {
      "name": "man",
      "confidence": 0.94493889808654785
    },
    {
      "name": "outdoor",
      "confidence": 0.938492476940155
    },
    {
      "name": "window",
      "confidence": 0.89513939619064331
    }
  ],
  "description": {
    "tags": [
      "person",
      "man",
      "outdoor",
      "window",
      "glasses"
    ],
    "captions": [
      {
        "text": "Satya Nadella sitting on a bench",
        "confidence": 0.48293603002174407
      }
    ]
  },
  "requestId": "0dbec5ad-a3d3-4f7e-96b4-dfd57efe967d",
    "metadata": {
    "width": 1500,
    "height": 1000,
    "format": "Jpeg"
  },
  "faces": [
    {
      "age": 44,
      "gender": "Male",
      "faceRectangle": {
        "left": 593,
        "top": 160,
        "width": 250,
        "height": 250
      }
    }
  ],
  "color": {
    "dominantColorForeground": "Brown",
    "dominantColorBackground": "Brown",
    "dominantColors": [
      "Brown",
      "Black"
    ],
    "accentColor": "873B59",
    "isBWImg": false
  },
  "imageType": {
    "clipArtType": 0,
    "lineDrawingType": 0
  }
}

```

## Use a Domain-Specific Model <a name="DomainSpecificModel"> </a>
The Domain-Specific Model is a model trained to identify a specific set of objects in an image. The two domain-specific models that are currently available are celebrities and landmarks. The following example identifies a landmark in an image.

### Landmark Python Example Request

```Python
########### Python 2.7 #############
import httplib, urllib, base64, json

headers = {
    # Request headers. Replace the key below with your subscription key.
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '13hc77781f7e4b19b5fcdd72a8df7156',
}

params = urllib.urlencode({
    # Request parameters. Use "model": "celebrities" to use the Celebrity model.
    'model': 'landmarks',
})

# The URL of a JEPG image containing text.
body = "{'url':'https://upload.wikimedia.org/wikipedia/commons/2/23/Space_Needle_2011-07-04.jpg'}"

try:
    conn = httplib.HTTPSConnection('westus.api.cognitive.microsoft.com')
    # Change "landmarks" to "celebrities" in the url to use the Celebrity model.
    conn.request("POST", "/vision/v1.0/models/landmarks/analyze?%s" % params, body, headers)
    response = conn.getresponse()
    data = response.read()
    # 'data' contains the JSON data. The following formats the JSON data for display.
    parsed = json.loads(data)
    print ("REST Response:")
    print (json.dumps(parsed, sort_keys=True, indent=2))
    conn.close()
except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))

####################################

########### Python 3.2 #############
import http.client, urllib.request, urllib.parse, urllib.error, base64, json

headers = {
    # Request headers. Replace the key below with your subscription key.
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '13hc77781f7e4b19b5fcdd72a8df7156',
}

params = urllib.parse.urlencode({
    # Request parameters. Use "model": "celebrities" to use the Celebrity model.
    'model': 'landmarks',
})

# The URL of a JEPG image containing text.
body = "{'url':'https://upload.wikimedia.org/wikipedia/commons/2/23/Space_Needle_2011-07-04.jpg'}"

try:
    conn = http.client.HTTPSConnection('westus.api.cognitive.microsoft.com')
    conn.request("POST", "/vision/v1.0/models/landmarks/analyze?%s" % params, body, headers)
    response = conn.getresponse()
    data = response.read()
    # 'data' contains the JSON data. The following formats the JSON data for display.
    encoding = response.headers.get_content_charset()
    parsed = json.loads(data.decode(encoding))
    print ("REST Response:")
    print (json.dumps(parsed, sort_keys=True, indent=2))
    conn.close()
except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))

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
Use the [Get Thumbnail method](https://westus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fb) to crop an image based on its region of interest (ROI) to the height and width you desire. The aspect ratio you set for the thumbnail can be different from the aspect ratio of the input image.

### Get a Thumbnail Python Example Request

```Python
########### Python 2.7 #############
import httplib, urllib, base64

headers = {
    # Request headers. Replace the key below with your subscription key.
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '13hc77781f7e4b19b5fcdd72a8df7156',
}

params = urllib.urlencode({
    # Request parameters. The smartCropping flag is optional.
    'width': '150',
    'height': '100',
    'smartCropping': 'true',
})

# Replace the three dots below with the URL of the JPEG image for which you want a thumbnail.
body = "{'url':'...'}"

try:
    conn = httplib.HTTPSConnection('westus.api.cognitive.microsoft.com')
    conn.request("POST", "/vision/v1.0/generateThumbnail?%s" % params, body, headers)
    response = conn.getresponse()
    data = response.read()
    print(data)
    conn.close()
except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))

####################################

########### Python 3.2 #############
import http.client, urllib.request, urllib.parse, urllib.error, base64

headers = {
    # Request headers. Replace the key below with your subscription key.
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '13hc77781f7e4b19b5fcdd72a8df7156',
}

params = urllib.parse.urlencode({
    # Request parameters. The smartCropping flag is optional.
    'width': '150',
    'height': '100',
    'smartCropping': 'true',
})

# Replace the three dots below with the URL of the JPEG image for which you want a thumbnail.
body = "{'url':'...'}"

try:
    conn = http.client.HTTPSConnection('westus.api.cognitive.microsoft.com')
    conn.request("POST", "/vision/v1.0/generateThumbnail?%s" % params, body, headers)
    response = conn.getresponse()
    data = response.read()
    print(data)
    conn.close()
except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))
####################################
```

### Get a Thumbnail Response
A successful response contains the thumbnail image binary. If the request fails, the response contains an error code and a message to help determine what went wrong.


## Optical Character Recognition (OCR) with Computer Vision API Using Python <a name="OCR"> </a>
Use the [Optical Character Recognition (OCR) method](https://westus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fc) to detect text in an image and extract recognized characters into a machine-usable character stream.

### OCR Python Example Request
```Python
########### Python 2.7 #############
import httplib, urllib, base64

headers = {
    # Request headers. Replace the key below with your subscription key.
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '13hc77781f7e4b19b5fcdd72a8df7156',
}

params = urllib.urlencode({
    # Request parameters. The language setting "unk" means automatically detect the language.
    'language': 'unk',
    'detectOrientation ': 'true',
})

# Replace the three dots below with the URL of a JPEG image containing text.
body = "{'url':'...'}"

try:
    conn = httplib.HTTPSConnection('westus.api.cognitive.microsoft.com')
    conn.request("POST", "/vision/v1.0/ocr?%s" % params, body, headers)
    response = conn.getresponse()
    data = response.read()
    print(data)
    conn.close()
except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))

####################################

########### Python 3.2 #############
import http.client, urllib.request, urllib.parse, urllib.error, base64

headers = {
    # Request headers. Replace the key below with your subscription key.
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '13hc77781f7e4b19b5fcdd72a8df7156',
}

params = urllib.parse.urlencode({
    # Request parameters. The language setting "unk" means automatically detect the language.
    'language': 'unk',
    'detectOrientation ': 'true',
})

# Replace the three dots below with the URL of a JPEG image containing text.
body = "{'url':'...'}"

try:
    conn = http.client.HTTPSConnection('westus.api.cognitive.microsoft.com')
    conn.request("POST", "/vision/v1.0/ocr?%s" % params, body, headers)
    response = conn.getresponse()
    data = response.read()
    print(data)
    conn.close()
except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))
####################################

```

### OCR Example Response
Upon success, the OCR results include the text from the image. They also include bounding boxes for regions, lines, and words.

```json
{
  "language": "en",
  "textAngle": -2.0000000000000338,
  "orientation": "Up",
  "regions": [
    {
      "boundingBox": "462,379,497,258",
      "lines": [
        {
          "boundingBox": "462,379,497,74",
          "words": [
            {
              "boundingBox": "462,379,41,73",
              "text": "A"
            },
            {
              "boundingBox": "523,379,153,73",
              "text": "GOAL"
            },
            {
              "boundingBox": "694,379,265,74",
              "text": "WITHOUT"
            }
          ]
        },
        {
          "boundingBox": "565,471,289,74",
          "words": [
            {
              "boundingBox": "565,471,41,73",
              "text": "A"
            },
            {
              "boundingBox": "626,471,150,73",
              "text": "PLAN"
            },
            {
              "boundingBox": "801,472,53,73",
              "text": "IS"
            }
          ]
        },
        {
          "boundingBox": "519,563,375,74",
          "words": [
            {
              "boundingBox": "519,563,149,74",
              "text": "JUST"
            },
            {
              "boundingBox": "683,564,41,72",
              "text": "A"
            },
            {
              "boundingBox": "741,564,153,73",
              "text": "WISH"
            }
          ]
        }
      ]
    }
  ]
}

```

## Text recognition with Computer Vision API Using Python <a name="RecognizeText"> </a>
Use the [RecognizeText method](https://ocr.portal.azure-api.net/docs/services/56f91f2d778daf23d8ec6739/operations/587f2c6a154055056008f200) to detect handwritten or printed text in an image and extract recognized characters into a machine-usable character stream.

### Handwriting Recognition Python Example

```Python
########### Python 2.7 #############
import httplib, urllib, base64, time

headers = {
    # Request headers - replace this example key with your valid subscription key.
    # Another valid content type is "application/octet-stream".
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '13hc77781f7e4b19b5fcdd72a8df7156',
}

# Replace the three dots below with the URL of a JPEG image containing text.
body = "{'url':'...'}"

serviceUrl = 'westus.api.cognitive.microsoft.com'

# For printed text, set "handwriting" to false.
params = urllib.urlencode({'handwriting' : 'true'})


try:
	conn = httplib.HTTPSConnection(serviceUrl)
	conn.request("POST", "/vision/v1.0/RecognizeText?%s" % params, body, headers)
	response = conn.getresponse()

	# This is the URI where you can get the text recognition operation result.
	operationLocation = response.getheader('Operation-Location')
	print "Operation-Location:", operationLocation

	parsedLocation = operationLocation.split(serviceUrl)
	answerURL = parsedLocation[1]
	print "AnswerURL:", answerURL

	# Note: The response may not be immediately available. Handwriting recognition is an
	# async operation that can take a variable amount of time depending on the length
	# of the text you want to recognize. You may need to wait or retry this GET operation.

	time.sleep(10)
	conn = httplib.HTTPSConnection(serviceUrl)
	conn.request("GET", answerURL, '', headers)
	response = conn.getresponse()
	print response.status, response.reason
	print response.read()
except Exception as e:
	print e

####################################

########### Python 3.2 #############
import http.client, urllib.request, urllib.parse, urllib.error, base64, requests, time

requestHeaders = {
    # Request headers - replace this example key with your valid subscription key.
    # Another valid content type is "application/octet-stream".
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '13hc77781f7e4b19b5fcdd72a8df7156',
}

# Replace the three dots below with the URL of a JPEG image containing text.
body = {'url':'...'}

serviceUrl = 'https://westus.api.cognitive.microsoft.com/vision/v1.0/RecognizeText'

# For printed text, set "handwriting" to false.
params = {'handwriting' : 'true'}


try:
	response = requests.request('post', serviceUrl, json=body, data=None, headers=requestHeaders, params=params)
	print(response.status_code)

	# This is the URI where you can get the text recognition operation result.
	operationLocation = response.headers['Operation-Location']

	# Note: The response may not be immediately available. Handwriting recognition is an
	# async operation that can take a variable amount of time depending on the length
	# of the text you want to recognize. You may need to wait or retry this GET operation.

	time.sleep(10)
	response = requests.request('get', operationLocation, json=None, data=None, headers=requestHeaders, params=None)
	data = response.json()
	print(data)
except Exception as e:
	print(e)

####################################

```