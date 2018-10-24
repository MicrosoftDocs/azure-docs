---
title: "Quickstart: Use a domain model - REST, Python - Computer Vision"
titleSuffix: "Azure Cognitive Services"
description: In this quickstart, you use domain models to identify celebrities and landmarks in  an image using the Computer Vision API with Python.
services: cognitive-services
author: PatrickFarley
manager: cgronlun

ms.service: cognitive-services
ms.component: computer-vision
ms.topic: quickstart
ms.date: 08/28/2018
ms.author: pafarley
---
# Quickstart: Use a domain model using the REST API and Python in Computer Vision

In this quickstart, you use a domain model to identify landmarks or, optionally, celebrities in a remotely stored image by using Computer Vision's REST API. With the [Recognize Domain Specific Content](https://westcentralus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e200) method, you can apply a domain-specific model to recognize content within an image.

You can run this quickstart in a step-by step fashion using a Jupyter notebook on [MyBinder](https://mybinder.org). To launch Binder, select the following button:

[![Binder](https://mybinder.org/badge.svg)](https://mybinder.org/v2/gh/Microsoft/cognitive-services-notebooks/master?filepath=VisionAPI.ipynb)

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/ai/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=cognitive-services) before you begin.

## Prerequisites

- You must have [Python](https://www.python.org/downloads/) installed if you want to run the sample locally.
- You must have a subscription key for Computer Vision. To get a subscription key, see [Obtaining Subscription Keys](../Vision-API-How-to-Topics/HowToSubscribe.md).

## Create and run the landmarks sample

To create and run the landmark sample, do the following steps:

1. Copy the following code into a text editor.
1. Make the following changes in code where needed:
    1. Replace the value of `subscription_key` with your subscription key.
    1. Replace the value of `vision_base_url` with the endpoint URL for the Computer Vision resource in the Azure region where you obtained your subscription keys, if necessary.
    1. Optionally, replace the value of `image_url` with the URL of a different image in which you want to detect landmarks.
1. Save the code as a file with an `.py` extension. For example, `get-landmarks.py`.
1. Open a command prompt window.
1. At the prompt, use the `python` command to run the sample. For example, `python get-landmarks.py`.

```python
import requests
# If you are using a Jupyter notebook, uncomment the following line.
#%matplotlib inline
import matplotlib.pyplot as plt
from PIL import Image
from io import BytesIO

# Replace <Subscription Key> with your valid subscription key.
subscription_key = "<Subscription Key>"
assert subscription_key

# You must use the same region in your REST call as you used to get your
# subscription keys. For example, if you got your subscription keys from
# westus, replace "westcentralus" in the URI below with "westus".
#
# Free trial subscription keys are generated in the westcentralus region.
# If you use a free trial subscription key, you shouldn't need to change
# this region.
vision_base_url = "https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/"

landmark_analyze_url = vision_base_url + "models/landmarks/analyze"

# Set image_url to the URL of an image that you want to analyze.
image_url = "https://upload.wikimedia.org/wikipedia/commons/f/f6/" + \
    "Bunker_Hill_Monument_2005.jpg"

headers = {'Ocp-Apim-Subscription-Key': subscription_key}
params  = {'model': 'landmarks'}
data    = {'url': image_url}
response = requests.post(
    landmark_analyze_url, headers=headers, params=params, json=data)
response.raise_for_status()

# The 'analysis' object contains various fields that describe the image. The
# most relevant landmark for the image is obtained from the 'result' property.
analysis = response.json()
assert analysis["result"]["landmarks"] is not []
print(analysis)
landmark_name = analysis["result"]["landmarks"][0]["name"].capitalize()

# Display the image and overlay it with the landmark name.
image = Image.open(BytesIO(requests.get(image_url).content))
plt.imshow(image)
plt.axis("off")
_ = plt.title(landmark_name, size="x-large", y=-0.1)
```

## Examine the response for the landmarks sample

A successful response is returned in JSON. The sample webpage parses and displays a successful response in the command prompt window, similar to the following example:

```json
{
  "result": {
    "landmarks": [
      {
        "name": "Bunker Hill Monument",
        "confidence": 0.9768505096435547
      }
    ]
  },
  "requestId": "659a10cd-44bb-44db-9147-a295b853b2b8",
  "metadata": {
    "height": 1600,
    "width": 1200,
    "format": "Jpeg"
  }
}
```

## Create and run the celebrities sample

To create and run the landmark sample, do the following steps:

1. Copy the following code into a text editor.
1. Make the following changes in code where needed:
    1. Replace the value of `subscription_key` with your subscription key.
    1. Replace the value of `vision_base_url` with the endpoint URL for the Computer Vision resource in the Azure region where you obtained your subscription keys, if necessary.
    1. Optionally, replace the value of `image_url` with the URL of a different image in which you want to detect celebrities.
1. Save the code as a file with an `.py` extension. For example, `get-celebrities.py`.
1. Open a command prompt window.
1. At the prompt, use the `python` command to run the sample. For example, `python get-celebrities.py`.

```python
import requests
# If you are using a Jupyter notebook, uncomment the following line.
#%matplotlib inline
import matplotlib.pyplot as plt
from PIL import Image
from io import BytesIO

# Replace <Subscription Key> with your valid subscription key.
subscription_key = "<Subscription Key>"
assert subscription_key

vision_base_url = "https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/"

celebrity_analyze_url = vision_base_url + "models/celebrities/analyze"

# Set image_url to the URL of an image that you want to analyze.
image_url = "https://upload.wikimedia.org/wikipedia/commons/d/d9/" + \
    "Bill_gates_portrait.jpg"

headers = {'Ocp-Apim-Subscription-Key': subscription_key}
params  = {'model': 'celebrities'}
data    = {'url': image_url}
response = requests.post(
    celebrity_analyze_url, headers=headers, params=params, json=data)
response.raise_for_status()

# The 'analysis' object contains various fields that describe the image. The
# most relevant celebrity for the image is obtained from the 'result' property.
analysis = response.json()
assert analysis["result"]["celebrities"] is not []
print(analysis)
celebrity_name = analysis["result"]["celebrities"][0]["name"].capitalize()

# Display the image and overlay it with the celebrity name.
image = Image.open(BytesIO(requests.get(image_url).content))
plt.imshow(image)
plt.axis("off")
_ = plt.title(celebrity_name, size="x-large", y=-0.1)
```

## Examine the response for the celebrities sample

A successful response is returned in JSON. The sample webpage parses and displays a successful response in the command prompt window, similar to the following example:


```json
{
  "result": {
    "celebrities": [
      {
        "faceRectangle": {
          "top": 123,
          "left": 156,
          "width": 187,
          "height": 187
        },
        "name": "Bill Gates",
        "confidence": 0.9993845224380493
      }
    ]
  },
  "requestId": "f14ec1d0-62d4-4296-9ceb-6b5776dc2020",
  "metadata": {
    "height": 521,
    "width": 550,
    "format": "Jpeg"
  }
}
```

## Clean up resources

When no longer needed, delete the files for both samples.

## Next steps

Explore a Python application that uses Computer Vision to perform optical character recognition (OCR); create smart-cropped thumbnails; plus detect, categorize, tag, and describe visual features, including faces, in an image. To rapidly experiment with the Computer Vision API, try the [Open API testing console](https://westcentralus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fa/console).

> [!div class="nextstepaction"]
> [Computer Vision API Python Tutorial](../Tutorials/PythonTutorial.md)
