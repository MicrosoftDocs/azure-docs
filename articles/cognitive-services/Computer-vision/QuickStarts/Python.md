---
title: Computer Vision API Python quickstart | Microsoft Docs
description: Get information and code samples to help you quickly get started using Python and the Computer Vision API in Microsoft Cognitive Services.
services: cognitive-services
author: KellyDF
manager: corncar
ms.service: cognitive-services
ms.technology: computer-vision
ms.topic: article
ms.date: 02/02/2018
ms.author: kefre
---

# Computer Vision API Python quickstart

This article provides information and code samples to help you quickly get started using the Microsoft Cognitive Services Computer Vision API with Python. Use the API to accomplish the following tasks:
* [Analyze an image](#AnalyzeImage).
* [Use a domain-specific model](#DomainSpecificModel).
* [Generate a thumbnail](#GetThumbnail).
* [Detect and extract printed text from an image](#OCR).
* [Detect and extract handwritten text from an image](#RecognizeText).

To use the Computer Vision API, you need a subscription key. To get a free subscription key, see [Obtain subscription keys](https://docs.microsoft.com/azure/cognitive-services/Computer-vision/Vision-API-How-to-Topics/HowToSubscribe).

You can run this example as a Jupyter notebook on [MyBinder](https://mybinder.org). To launch Binder, select the following button: 


[![Binder](https://mybinder.org/badge.svg)](https://mybinder.org/v2/gh/Microsoft/cognitive-services-notebooks/master?filepath=VisionAPI.ipynb)


## Analyze an image
<a name="AnalyzeImage"> </a>

You can use the [Analyze Image method](https://westcentralus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fa) to extract visual features based on image content. Either upload an image or specify an image URL, and then select which features to return:
* A detailed list of tags related to the image content.
* A description of image content as a complete sentence.
* The coordinates, gender, and age of any faces that are in the image.
* The **ImageType** value (clip art or a line drawing).
* The dominant color of the image, the accent color, or whether an image is black and white.
* The [category taxonomy](https://docs.microsoft.com/azure/cognitive-services/computer-vision/category-taxonomy).
* Whether the image contains adult or sexually suggestive content.

To begin analyzing images, in the following code, replace `subscription_key` with a valid API key:


```python
subscription_key = None
assert subscription_key
```

Ensure that region in `vision_base_url` corresponds to the URL where you generated the API key (`westus`, `westcentralus`, and so on). If you're using a free trial subscription key, you don't need to make any changes here.


```python
vision_base_url = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/"
```

The image analysis URL looks like the following code examples. For more information, see the [REST API documentation](https://westus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fa).

`https://[location].api.cognitive.microsoft.com/vision/v1.0/<b>analyze</b>[?visualFeatures][&details][&language]`


```python
vision_analyze_url = vision_base_url + "analyze"
```

To begin analyzing an image, set `image_url` to the URL of any image that you want to analyze:


```python
image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Broadway_and_Times_Square_by_night.jpg/450px-Broadway_and_Times_Square_by_night.jpg"
```

The following code uses the Python `requests` library to call out to the Computer Vision Analyze Image API. It returns the results as a JSON object. The API key is passed in via the `headers` dictionary. The types of features to recognize is passed in via the `params` dictionary. 

To see the full list of options that you can use, see the [REST API documentation](https://westus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fa).


```python
import requests
headers  = {'Ocp-Apim-Subscription-Key': subscription_key }
params   = {'visualFeatures': 'Categories,Description,Color'}
data     = {'url': image_url}
response = requests.post(vision_analyze_url, headers=headers, params=params, json=data)
response.raise_for_status()
analysis = response.json()
```

The `analysis` object contains various fields that describe the image. The most relevant caption for the image can be obtained from the `descriptions` property.


```python
image_caption = analysis["description"]["captions"][0]["text"].capitalize()
print(image_caption)
```

    A group of people on a city street at night


The following code displays the image, and overlays it with the inferred caption:


```python
%matplotlib inline
from PIL import Image
from io import BytesIO
import matplotlib.pyplot as plt
image = Image.open(BytesIO(requests.get(image_url).content))
plt.imshow(image)
plt.axis("off")
_ = plt.title(image_caption, size="x-large", y=-0.1)
```

## <a name="DomainSpecificModel"></a>Use a domain-specific model


A [domain-specific model](https://westus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fd)  is trained to identify a specific set of objects in an image. The two domain-specific models that are currently available are _celebrities_ and _landmarks_. 

To view the list of domain-specific models that are supported, make the following request against the service:


```python
model_url = vision_base_url + "models"
headers   = {'Ocp-Apim-Subscription-Key': subscription_key}
models    = requests.get(model_url, headers=headers).json()
[model["name"] for model in models["models"]]
```




    ['celebrities', 'landmarks']



### Landmark identification
To begin using the domain-specific model for landmarks, set `image_url` to point to an image to analyze:


```python
image_url = "https://upload.wikimedia.org/wikipedia/commons/f/f6/Bunker_Hill_Monument_2005.jpg"
```

To construct the service endpoint to use to analyze images for landmarks:


```python
landmark_analyze_url = vision_base_url + "models/landmarks/analyze"
print(landmark_analyze_url)
```

    https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/models/landmarks/analyze


Now, the image in `image_url` can be analyzed for any landmarks. Identified landmarks are stored in `landmark_name`.


```python
headers  = {'Ocp-Apim-Subscription-Key': subscription_key}
params   = {'model': 'landmarks'}
data     = {'url': image_url}
response = requests.post(landmark_analyze_url, headers=headers, params=params, json=data)
response.raise_for_status()

analysis      = response.json()
assert analysis["result"]["landmarks"] is not []

landmark_name = analysis["result"]["landmarks"][0]["name"].capitalize()
```


```python
image = Image.open(BytesIO(requests.get(image_url).content))
plt.imshow(image)
plt.axis("off")
_ = plt.title(landmark_name, size="x-large", y=-0.1)
```

### Celebrity identification
Similar to landmark identification, you can invoke the domain-specific model for identifying celebrities as shown in the following code. First, set `image_url` to point to the image of a celebrity:


```python
image_url = "https://upload.wikimedia.org/wikipedia/commons/d/d9/Bill_gates_portrait.jpg"
```

To construct the service endpoint to use to detect celebrity images:


```python
celebrity_analyze_url = vision_base_url + "models/celebrities/analyze"
print(celebrity_analyze_url)
```

    https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/models/celebrities/analyze


Next, the image in `image_url` can be analyzed for celebrities:


```python
headers  = {'Ocp-Apim-Subscription-Key': subscription_key}
params   = {'model': 'celebrities'}
data     = {'url': image_url}
response = requests.post(celebrity_analyze_url, headers=headers, params=params, json=data)
response.raise_for_status()

analysis = response.json()
```


```python
print(analysis)
```

    {'result': {'celebrities': [{'faceRectangle': {'top': 123, 'left': 156, 'width': 187, 'height': 187}, 'name': 'Bill Gates', 'confidence': 0.9993845224380493}]}, 'requestId': 'd3eca546-0112-4574-817e-b6c5f43719bf', 'metadata': {'height': 521, 'width': 550, 'format': 'Jpeg'}}


The following code extracts the name and bounding box for a celebrity that's found:


```python
assert analysis["result"]["celebrities"] is not []
celebrity_info = analysis["result"]["celebrities"][0]
celebrity_name = celebrity_info["name"]
celebrity_face = celebrity_info["faceRectangle"]
```

To overlay this information on top of the original image:


```python
from matplotlib.patches import Rectangle
plt.figure(figsize=(5,5))

image  = Image.open(BytesIO(requests.get(image_url).content))
ax     = plt.imshow(image, alpha=0.6)
origin = (celebrity_face["left"], celebrity_face["top"])
p      = Rectangle(origin, celebrity_face["width"], celebrity_face["height"], 
                   fill=False, linewidth=2, color='b')
ax.axes.add_patch(p)
plt.text(origin[0], origin[1], celebrity_name, fontsize=20, weight="bold", va="bottom")
_ = plt.axis("off")
```

## <a name="GetThumbnail"></a>Get a thumbnail


Use the [Get Thumbnail method](https://westcentralus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fb) to crop an image to the height and width that you want based on the image's region of interest (ROI). The aspect ratio that you set for the thumbnail can be different from the aspect ratio of the input image.

To generate a thumbnail for an image, first set `image_url` to point to the image location:


```python
image_url = "https://upload.wikimedia.org/wikipedia/commons/9/94/Bloodhound_Puppy.jpg"
```

To construct the service endpoint to use to generate the thumbnail:


```python
thumbnail_url = vision_base_url + "generateThumbnail"
print(thumbnail_url)
```

    https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/generateThumbnail


To generate a 50&times;50-pixel thumbnail for the image, call this service endpoint:


```python
headers  = {'Ocp-Apim-Subscription-Key': subscription_key}
params   = {'width': '50', 'height': '50','smartCropping': 'true'}
data     = {'url': image_url}
response = requests.post(thumbnail_url, headers=headers, params=params, json=data)
response.raise_for_status()
```

You can use the Python Image Library to verify that the thumbnail is 50&times;50 pixels:


```python
thumbnail = Image.open(BytesIO(response.content))
print("Thumbnail is {0}-by-{1}".format(*thumbnail.size))
thumbnail
```

## <a name="OCR"></a>Use OCR to detext text in an image


Use the [Optical Character Recognition (OCR) method](https://westcentralus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fc) to detect text in an image, and then extract recognized characters into a machine-usable character stream.

To illustrate the OCR API, set `image_url` to point to the text to be recognized:


```python
image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Atomist_quote_from_Democritus.png/338px-Atomist_quote_from_Democritus.png"
```

To construct the service endpoint to use for OCR for your region:


```python
ocr_url = vision_base_url + "ocr"
print(ocr_url)
```

    https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/ocr


Next, call into the OCR service to get the text that was recognized, and associated bounding boxes. In the following parameters, `"language": "unk"` automatically detects the language in the text. `"detectOrientation": "true"` automatically aligns the image. For more information, see the [REST API documentation](https://westus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fc).


```python
headers  = {'Ocp-Apim-Subscription-Key': subscription_key}
params   = {'language': 'unk', 'detectOrientation ': 'true'}
data     = {'url': image_url}
response = requests.post(ocr_url, headers=headers, params=params, json=data)
response.raise_for_status()

analysis = response.json()
```

To extract the word bounding boxes and text from the results of analysis:


```python
line_infos = [region["lines"] for region in analysis["regions"]]
word_infos = []
for line in line_infos:
    for word_metadata in line:
        for word_info in word_metadata["words"]:
            word_infos.append(word_info)
word_infos
```




    [{'boundingBox': '28,16,288,41', 'text': 'NOTHING'},
     {'boundingBox': '27,66,283,52', 'text': 'EXISTS'},
     {'boundingBox': '27,128,292,49', 'text': 'EXCEPT'},
     {'boundingBox': '24,188,292,54', 'text': 'ATOMS'},
     {'boundingBox': '22,253,105,32', 'text': 'AND'},
     {'boundingBox': '144,253,175,32', 'text': 'EMPTY'},
     {'boundingBox': '21,298,304,60', 'text': 'SPACE.'},
     {'boundingBox': '26,387,210,37', 'text': 'Everything'},
     {'boundingBox': '249,389,71,27', 'text': 'else'},
     {'boundingBox': '127,431,31,29', 'text': 'is'},
     {'boundingBox': '172,431,153,36', 'text': 'opinion.'}]



Use the `matplotlib` library to overlay the recognized text on top of the original image:


```python
plt.figure(figsize=(5,5))

image  = Image.open(BytesIO(requests.get(image_url).content))
ax     = plt.imshow(image, alpha=0.5)
for word in word_infos:
    bbox = [int(num) for num in word["boundingBox"].split(",")]
    text = word["text"]
    origin = (bbox[0], bbox[1])
    patch  = Rectangle(origin, bbox[2], bbox[3], fill=False, linewidth=2, color='y')
    ax.axes.add_patch(patch)
    plt.text(origin[0], origin[1], text, fontsize=20, weight="bold", va="top")
_ = plt.axis("off")
```

## <a name="RecognizeText"></a>Use text recognition to detect handwriting in an image

Use the [RecognizeText method](https://westcentralus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/587f2c6a154055056008f200) to detect handwritten or printed text in an image, and then extract recognized characters into a machine-usable character stream.

Set `image_url` to point to the image to recognize:


```python
image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Cursive_Writing_on_Notebook_paper.jpg/800px-Cursive_Writing_on_Notebook_paper.jpg"
```

To construct the service endpoint to use for the text recognition service:


```python
text_recognition_url = vision_base_url + "RecognizeText"
print(text_recognition_url)
```

    https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/RecognizeText


You can use the handwritten text recognition service to recognize the text in the image. To recognize only printed text, in the `params` dictionary, set `handwriting` to `false`.


```python
headers  = {'Ocp-Apim-Subscription-Key': subscription_key}
params   = {'handwriting' : True}
data     = {'url': image_url}
response = requests.post(text_recognition_url, headers=headers, params=params, json=data)
response.raise_for_status()
```

The text recognition service doesn't directly return the recognized text. Instead, it returns immediately with an "Operation Location" URL in the response header. You must poll the URL to get the result of the operation:


```python
operation_url = response.headers["Operation-Location"]
```

After you obtain the `operation_url`, you can query the URL for the analyzed text. The following code implements a polling loop to wait for the operation to complete. Polling is done by using an HTTP `GET` method instead of `POST`.


```python
import time

analysis = {}
while not "recognitionResult" in analysis:
    response_final = requests.get(response.headers["Operation-Location"], headers=headers)
    analysis       = response_final.json()
    time.sleep(1)
```

Next, extract the recognized text, with bounding boxes: 

```python
polygons = [(line["boundingBox"], line["text"]) for line in analysis["recognitionResult"]["lines"]]
```

The handwritten text recognition API returns bounding boxes as **polygons** instead of as **rectangles**. Each polygon is _p_ and is defined by its vertices. Specify vertices by using the following form:  
<i>p</i> = [<i>x</i><sub>1</sub>, <i>y</i><sub>1</sub>, <i>x</i><sub>2</sub>, <i>y</i><sub>2</sub>, ..., <i>x</i><sub>N</sub>, <i>y</i><sub>N</sub>]


You can overlay the recognized text on top of the original image by using the extracted polygon information. Notice that `matplotlib` requires the vertices to be specified as a list of tuples in this form:  
<i>p</i> = [(<i>x</i><sub>1</sub>, <i>y</i><sub>1</sub>), (<i>x</i><sub>2</sub>, <i>y</i><sub>2</sub>), ..., (<i>x</i><sub>N</sub>, <i>y</i><sub>N</sub>)]

The post-processing code transforms the polygon data that's returned by the service into the form that `matplotlib` requires:


```python
from matplotlib.patches import Polygon

plt.figure(figsize=(15,15))

image  = Image.open(BytesIO(requests.get(image_url).content))
ax     = plt.imshow(image)
for polygon in polygons:
    vertices = [(polygon[0][i], polygon[0][i+1]) for i in range(0,len(polygon[0]),2)]
    text     = polygon[1]
    patch    = Polygon(vertices, closed=True,fill=False, linewidth=2, color='y')
    ax.axes.add_patch(patch)
    plt.text(vertices[0][0], vertices[0][1], text, fontsize=20, va="top")
_ = plt.axis("off")
```

## Analyze an image stored on disk
In addition to publically accessible images, the Computer Vision REST APIs can analyze images that are stored on disk. Provide the image to be analyzed as part of the HTTP body. For more information about this feature, see the [Computer Vision API documentation](https://westus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fa). 

The code in this section analyzes a sample image on disk. The primary difference between passing in an image URL and passing in image data is that, for image data, the header to the request must contain an entry that looks like this:

```py
{"Content-Type": "application/octet-stream"}
```

The binary image data also must be passed in via the `data` parameter to `requests.post` instead of to the `json` parameter.

First, download a sample image from the [Computer Vision API](https://azure.microsoft.com/services/cognitive-services/computer-vision/) page to your local file system. Set `image_path` to point to the downloaded image:


```bash
%%bash
mkdir -p images
curl -Ls https://aka.ms/csnb-house-yard -o images/house_yard.jpg
```


```python
image_path = "images/house_yard.jpg"
```

Next, read the image into a byte array, and then send it to the Computer Vision service to be analyzed:


```python
image_data = open(image_path, "rb").read()
headers    = {'Ocp-Apim-Subscription-Key': subscription_key, 
              "Content-Type": "application/octet-stream" }
params     = {'visualFeatures': 'Categories,Description,Color'}
response   = requests.post(vision_analyze_url, 
                           headers=headers, 
                           params=params, 
                           data=image_data)

response.raise_for_status()

analysis      = response.json()
image_caption = analysis["description"]["captions"][0]["text"].capitalize()
image_caption
```




    A large lawn in front of a house



As in earlier examples, you can easily overlay the caption on the image:


```python
image = Image.open(image_path)
plt.imshow(image)
plt.axis("off")
_ = plt.title(image_caption, size="x-large", y=-0.1)
```

Because the image is already available locally, the process is slightly shorter.
