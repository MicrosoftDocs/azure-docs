---
title: "Quickstart: Detect and frame faces in an image with the Python SDK"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you will create a Python script that uses the Face API to detect and frame faces in a remote image. 
services: cognitive-services
author: SteveMSFT
manager: nitinme

ms.service: cognitive-services
ms.subservice: face-api
ms.topic: quickstart
ms.date: 07/03/2018
ms.author: sbowles
#Customer intent: As a Python developer, I want to implement a Face detection scenario with the Python SDK, so that I can build more complex scenarios later on.
---

# Quickstart: Create a Python script to detect and frame faces in an image

In this quickstart, you will create a Python script that uses the Azure Face API, through the Python SDK, to detect human faces in a remote image. The application displays a selected image and draws a frame around each detected face.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 

## Prerequisites

- A Face API subscription key. You can get a free trial subscription key from [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=face-api). Or, follow the instructions in [Create a Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) to subscribe to the Face API service and get your key.
- [Python 2.7+ or 3.5+](https://www.python.org/downloads/)
- [pip](https://pip.pypa.io/en/stable/installing/) tool

## Get the Face SDK

Install the Face Python SDK by opening the command prompt and running the following command:

```shell
pip install cognitive_face
```

## Detect Faces in an image

Create a new Python script named _FaceQuickstart.py_ and add the following code. This code handles the core functionality of face detection. You will need to replace `<Subscription Key>` with the value of your key. You may also need to change the value of `BASE_URL` to use the correct region identifier for your key (see the [Face API docs](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) for a list of all region endpoints). Free trial subscription keys are generated in the **westus** region. Optionally, set `img_url` to the URL of any image you'd like to use.

The script will detect faces by calling the **cognitive_face.face.detect** method, which wraps the [Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) REST API and returns a list of faces.

```python
import cognitive_face as CF

# Replace with a valid subscription key (keeping the quotes in place).
KEY = '<Subscription Key>'
CF.Key.set(KEY)

# Replace with your regional Base URL
BASE_URL = 'https://westus.api.cognitive.microsoft.com/face/v1.0/'
CF.BaseUrl.set(BASE_URL)

# You can use this example JPG or replace the URL below with your own URL to a JPEG image.
img_url = 'https://raw.githubusercontent.com/Microsoft/Cognitive-Face-Windows/master/Data/detection1.jpg'
faces = CF.face.detect(img_url)
print(faces)
```

### Try the app

Run the app with the command `python FaceQuickstart.py`. You should get a text response in the console window, like the following:

```console
[{'faceId': '26d8face-9714-4f3e-bfa1-f19a7a7aa240', 'faceRectangle': {'top': 124, 'left': 459, 'width': 227, 'height': 227}}]
```

The output represents a list of detected faces. Each item in the list is a **dict** instance where `faceId` is a unique ID for the detected face and `faceRectangle` describes the position of the detected face. 

> [!NOTE]
> Face IDs expire after 24 hours; you will need to store face data explicitly if you wish to keep it long-term.

## Draw face rectangles

Using the coordinates that you received from the previous command, you can draw rectangles on the image to visually represent each face. You will need to install Pillow (`pip install pillow`) to use the Pillow Image Module. At the top of *FaceQuickstart.py*, add the following code:

```python
import requests
from io import BytesIO
from PIL import Image, ImageDraw
```

Then, at the bottom of your script, add the following code. This code creates a simple function for parsing the rectangle coordinates, and uses Pillow to draw rectangles on the original image. Then, it displays the image in your default image viewer.

```python
# Convert width height to a point in a rectangle


def getRectangle(faceDictionary):
    rect = faceDictionary['faceRectangle']
    left = rect['left']
    top = rect['top']
    bottom = left + rect['height']
    right = top + rect['width']
    return ((left, top), (bottom, right))


# Download the image from the url
response = requests.get(img_url)
img = Image.open(BytesIO(response.content))

# For each face returned use the face rectangle and draw a red box.
draw = ImageDraw.Draw(img)
for face in faces:
    draw.rectangle(getRectangle(face), outline='red')

# Display the image in the users default image browser.
img.show()
```

## Run the app

You may be prompted to select a default image viewer first. Then, you should see an image like the following. You should also see the rectangle data printed in the console window.

![A young woman with a red rectangle drawn around the face](../images/face-rectangle-result.png)

## Next steps

In this quickstart, you learned the basic process for using the Face API Python SDK and created a script to detect and frame faces in an image. Next, explore the use of the Python SDK in a more complex example. Go to the Cognitive Face Python sample on GitHub, clone it to your project folder, and follow the instructions in the _README.md_ file.

> [!div class="nextstepaction"]
> [Cognitive Face Python sample](https://github.com/Microsoft/Cognitive-Face-Python)
