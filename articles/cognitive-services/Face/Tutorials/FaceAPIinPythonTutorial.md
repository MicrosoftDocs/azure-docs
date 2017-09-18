---
title: Face API Python tutorial | Microsoft Docs
description: Learn how to use the Face API with the Python SDK to detect human faces in an image in Cognitive Services.
services: cognitive-services
author: v-royhar
manager: yutkuo

ms.service: cognitive-services
ms.technology: face
ms.topic: article
ms.date: 02/24/2017
ms.author: anroth
---

# Getting Started with Face API in Python Tutorial

In this tutorial, you will learn to invoke the Face API via the Python SDK to detect human faces in an image.

## <a name="prerequisites"></a> Prerequisites

To use the tutorial, you will need to do the following:

- Install either Python 2.7+ or Python 3.5+.
- Install pip.
- Install the Python SDK for the Face API as follows:

```bash
pip install cognitive_face
```

- Obtain a [subscription key](https://azure.microsoft.com/en-us/try/cognitive-services/) for Microsoft Cognitive Services. You can use either your primary or your secondary key in this tutorial. (Note that to use any Face API, you must have a valid subscription key.)

## <a name="sdk-example"></a> Detect a Face in an Image

```python
import cognitive_face as CF

KEY = 'subscription key'  # Replace with a valid subscription key (keeping the quotes in place).
CF.Key.set(KEY)

# You can use this example JPG or replace the URL below with your own URL to a JPEG image.
img_url = 'https://raw.githubusercontent.com/Microsoft/Cognitive-Face-Windows/master/Data/detection1.jpg'
result = CF.face.detect(img_url)
print result
```

Below is an example result. It's a `list` of detected faces. Each item in the list is a `dict` instance where `faceId` is a unique ID for the detected face and `faceRectangle` describes the postion of the detected face. A face ID expires in 24 hours.

```python
[{u'faceId': u'68a0f8cf-9dba-4a25-afb3-f9cdf57cca51', u'faceRectangle': {u'width': 89, u'top': 66, u'height': 89, u'left': 446}}]
```

## <a name='further'></a> Further Exploration

To help you further explore the Face API, this tutorial provides a GUI sample. To run it, first install [wxPython](https://wxpython.org/) then run the commands below.

```bash
git clone https://github.com/Microsoft/Cognitive-Face-Python.git
cd Cognitive-Face-Python
python sample
```

## <a name="summary"></a> Summary

In this tutorial, you have learned the basic process for using the Face API via invoking the Python SDK. For more information on API details, please refer to the How-To and [API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236).

## <a name="related"></a> Related Topics

- [Getting Started with Face API in CSharp](FaceAPIinCSharpTutorial.md)
- [Getting Started with Face API in Java for Android](FaceAPIinJavaForAndroidTutorial.md)
