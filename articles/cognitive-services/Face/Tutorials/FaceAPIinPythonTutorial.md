---
title: "Tutorial: Detect and frame faces in an image - Face API, Python"
titleSuffix: Azure Cognitive Services
description: Learn how to use the Face API with the Python SDK to detect human faces in an image.
services: cognitive-services
author: SteveMSFT
manager: cgronlun

ms.service: cognitive-services
ms.component: face-api
ms.topic: tutorial
ms.date: 03/01/2018
ms.author: sbowles
---

# Tutorial: Detect and frame faces with the Face API and Python 

In this tutorial, you will learn to invoke the Face API via the Python SDK to detect human faces in an image.

## Prerequisites

To use the tutorial, you will need to do the following:

- Install either Python 2.7+ or Python 3.5+.
- Install pip.
- Install the Python SDK for the Face API as follows:

```bash
pip install cognitive_face
```

- Obtain a [subscription key](https://azure.microsoft.com/try/cognitive-services/) for Microsoft Cognitive Services. You can use either your primary or your secondary key in this tutorial. (Note that to use any Face API, you must have a valid subscription key.)

## Detect a Face in an Image

```python
import cognitive_face as CF

KEY = '<Subscription Key>'  # Replace with a valid subscription key (keeping the quotes in place).
CF.Key.set(KEY)

BASE_URL = 'https://westus.api.cognitive.microsoft.com/face/v1.0/'  # Replace with your regional Base URL
CF.BaseUrl.set(BASE_URL)

# You can use this example JPG or replace the URL below with your own URL to a JPEG image.
img_url = 'https://raw.githubusercontent.com/Microsoft/Cognitive-Face-Windows/master/Data/detection1.jpg'
faces = CF.face.detect(img_url)
print(faces)
```

Below is an example result. It's a `list` of detected faces. Each item in the list is a `dict` instance where `faceId` is a unique ID for the detected face and `faceRectangle` describes the position of the detected face. A face ID expires in 24 hours.

```python
[{u'faceId': u'68a0f8cf-9dba-4a25-afb3-f9cdf57cca51', u'faceRectangle': {u'width': 89, u'top': 66, u'height': 89, u'left': 446}}]
```

## Draw rectangles around the faces

Using the json coordinates that you received from the previous command, you can draw rectangles on the image to visually represent each face. You will need to `pip install Pillow` to use the `PIL` imaging module.  At the top of the file, add the following:

```python
import requests
from io import BytesIO
from PIL import Image, ImageDraw
```

Then, after `print(faces)`, include the following in your script:

```python
#Convert width height to a point in a rectangle
def getRectangle(faceDictionary):
    rect = faceDictionary['faceRectangle']
    left = rect['left']
    top = rect['top']
    bottom = left + rect['height']
    right = top + rect['width']
    return ((left, top), (bottom, right))

#Download the image from the url
response = requests.get(img_url)
img = Image.open(BytesIO(response.content))

#For each face returned use the face rectangle and draw a red box.
draw = ImageDraw.Draw(img)
for face in faces:
    draw.rectangle(getRectangle(face), outline='red')

#Display the image in the users default image browser.
img.show()
```

## Further Exploration

To help you further explore the Face API, this tutorial provides a GUI sample. To run it, first install [wxPython](https://wxpython.org/pages/downloads/) then run the commands below.

```bash
git clone https://github.com/Microsoft/Cognitive-Face-Python.git
cd Cognitive-Face-Python
python sample
```

## Summary

In this tutorial, you have learned the basic process for using the Face API via invoking the Python SDK. For more information on API details, please refer to the How-To and [API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236).

## Related Topics

- [Getting Started with Face API in CSharp](FaceAPIinCSharpTutorial.md)
- [Getting Started with Face API in Java for Android](FaceAPIinJavaForAndroidTutorial.md)
