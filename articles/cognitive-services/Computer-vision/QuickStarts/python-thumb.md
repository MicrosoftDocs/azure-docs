---
title: "Quickstart: Generate a thumbnail - REST, Python"
titleSuffix: "Azure Cognitive Services"
description: In this quickstart, you generate a thumbnail from an image using the Computer Vision API with Python.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: quickstart
ms.date: 05/20/2020
ms.author: pafarley
ms.custom: seodec18, tracking-python
---
# Quickstart: Generate a thumbnail using the Computer Vision REST API and Python

In this quickstart, you'll generate a thumbnail from an image using the Computer Vision REST API. With the [Get Thumbnail](https://westcentralus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-ga/operations/56f91f2e778daf14a499f20c) method, you can specify the desired height and width, and Computer Vision uses smart cropping to intelligently identify the area of interest and generate cropping coordinates based on that region.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/try/cognitive-services/) before you begin.

## Prerequisites

- You must have a subscription key for Computer Vision. You can get a free trial key from [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=computer-vision). Or, follow the instructions in [Create a Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) to subscribe to Computer Vision and get your key. Then, [create environment variables](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for the key and service endpoint string, named `COMPUTER_VISION_SUBSCRIPTION_KEY` and `COMPUTER_VISION_ENDPOINT`, respectively.
- A code editor such as [Visual Studio Code](https://code.visualstudio.com/download).

## Create and run the sample

To create and run the sample, copy the following code into the code editor. 

```python
import os
import sys
import requests
# If you are using a Jupyter notebook, uncomment the following lines.
# %matplotlib inline
# import matplotlib.pyplot as plt
from PIL import Image
from io import BytesIO

# Add your Computer Vision subscription key and endpoint to your environment variables.
subscription_key = os.environ['COMPUTER_VISION_SUBSCRIPTION_KEY']
endpoint = os.environ['COMPUTER_VISION_ENDPOINT']

thumbnail_url = endpoint + "vision/v3.0/generateThumbnail"

# Set image_url to the URL of an image that you want to analyze.
image_url = "https://upload.wikimedia.org/wikipedia/commons/9/94/Bloodhound_Puppy.jpg"

# Construct URL
headers = {'Ocp-Apim-Subscription-Key': subscription_key}
params = {'width': '50', 'height': '50', 'smartCropping': 'true'}
data = {'url': image_url}
# Call API
response = requests.post(thumbnail_url, headers=headers, params=params, json=data)
response.raise_for_status()

# Open the image from bytes
thumbnail = Image.open(BytesIO(response.content))

# Verify the thumbnail size.
print("Thumbnail is {0}-by-{1}".format(*thumbnail.size))

# Save thumbnail to file
thumbnail.save('thumbnail.png')

# Display image
thumbnail.show()

# Optional. Display the thumbnail from Jupyter.
# plt.imshow(thumbnail)
# plt.axis("off")
```

Next, do the following:

1. (Optional) Replace the value of `image_url` with the URL of your own image.
1. Save the code as a file with an `.py` extension. For example, `get-thumbnail.py`.
1. Open a command prompt window.
1. At the prompt, use the `python` command to run the sample. For example, `python get-thumbnail.py`.

## Examine the response

A successful response is returned as binary data which represents the image data for the thumbnail. The sample should display this image. If the request fails, the response is displayed in the command prompt window and should contain an error code.

## Run in Jupyter (optional)

You can optionally run this quickstart in a step-by step fashion using a Jupyter notebook on [MyBinder](https://mybinder.org). To launch Binder, select the following button:

[![Binder](https://mybinder.org/badge.svg)](https://mybinder.org/v2/gh/Microsoft/cognitive-services-notebooks/master?filepath=VisionAPI.ipynb)

## Next steps

Next, explore a Python application that uses Computer Vision to perform optical character recognition (OCR); create smart-cropped thumbnails; and detect, categorize, tag, and describe visual features in images.

> [!div class="nextstepaction"]
> [Computer Vision API Python Tutorial](../Tutorials/PythonTutorial.md)

* To rapidly experiment with the Computer Vision API, try the [Open API testing console](https://westcentralus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-ga/operations/56f91f2e778daf14a499f20c).
