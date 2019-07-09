---
title: "Perform image operations - Python"
titlesuffix: Azure Cognitive Services
description: Learn how to use the Computer Vision API with Python by using Jupyter notebooks. Visualize your results using popular libraries.
services: cognitive-services
author: KellyDF
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 07/03/2019
ms.author: kefre
ms.custom: seodec18
---

# Computer Vision API Jupyter notebook

This guide shows you how to use the Computer Vision API in Python and how to visualize your results using popular libraries. You will use Jupyter to run the tutorial. To learn how to get started with interactive Jupyter notebooks, refer to the [Jupyter Documentation](https://jupyter.readthedocs.io/en/latest/index.html).

## Prerequisites

- [Python 2.7+ or 3.5+](https://www.python.org/downloads/)
- [pip](https://pip.pypa.io/en/stable/installing/) tool
- [Jupyter Notebook](https://jupyter.org/install) installed

## Open the notebook in Jupyter 

1. Go to the [Cognitive Vision Python](https://github.com/Microsoft/Cognitive-Vision-Python) GitHub repo. 
2. Click on the green button to clone or download the repo. 
3. Open a command prompt and navigate to the folder **Cognitive-Vision-Python\Jupyter Notebook**.
1. Ensure you have all the required libraries by running the command `pip install requests opencv-python numpy matplotlib` from the command prompt.
1. Start Jupyter by running the command `jupyter notebook` from the command prompt.
1. In the Jupyter window, click on _Computer Vision API Example.ipynb_ to open the tutorial notebook.

## Run the notebook

To use this notebook, you will need a subscription key for the Computer Vision API. Visit the [Subscription page](https://azure.microsoft.com/try/cognitive-services/) to sign up. On the **Sign in** page, use your Microsoft account to sign in and you will be able to subscribe and get free keys. After completing the sign-up process, paste your key into the `Variables` section of the notebook (reproduced below). Either the primary or the secondary key will work. Be sure to enclose the key in quotes to make it a string.

You will also need to make sure the `_region` field matches the region that corresponds to your subscription.

```python
# Variables
_region = 'westcentralus'  # Here you enter the region of your subscription
_url = 'https://{}.api.cognitive.microsoft.com/vision/v2.0/analyze'.format(
    _region)
_key = None  # Here you have to paste your primary key
_maxNumRetries = 10
```

When you run the tutorial, you will be able to add images to analyze, both from a URL and from local storage. The script will display the images and analysis information in the notebook.
