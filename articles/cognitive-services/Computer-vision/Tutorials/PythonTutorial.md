---
title: "Tutorial: Computer Vision API Python"
titlesuffix: Azure Cognitive Services
description: Learn how to use the Computer Vision API with Python by using Jupyter notebooks. Visualize your results using popular libraries.
services: cognitive-services
author: KellyDF
manager: cgronlun

ms.service: cognitive-services
ms.component: computer-vision
ms.topic: tutorial
ms.date: 02/25/2017
ms.author: kefre
---

# Tutorial: Computer Vision API Python

This tutorial shows you how to use the Computer Vision API in Python and how to visualize your results using some popular libraries. Use Jupyter to run the tutorial. To learn how to get started with interactive Jupyter notebooks, refer to: [Jupyter Documementation](http://jupyter.readthedocs.io/en/latest/index.html). 

## Open the Tutorial Notebook in Jupyter 

1. Navigate to the [tutorial notebook in GitHub](https://github.com/Microsoft/Cognitive-Vision-Python). 
2. Click on the green button to clone or download the tutorial. 
3. Open a command prompt and go to the folder _Cognitive-Vision-Python-master\Jupyter Notebook_. 
4. Run the command **jupyter notebook** from the command prompt. This will start Jupyter.
5. In the Jupyter window, click on _Computer Vision API Example.ipynb_ to open the tutorial notebook 

## Run the Tutorial

To use this notebook, you will need a subscription key for the Computer Vision API. Visit the [Subscription page](https://azure.microsoft.com/try/cognitive-services/) to sign up. On the “Sign in” page, use your Microsoft account to sign in and you will be able to subscribe and get free keys. After completing the sign-up process, paste your key into the variables section of the notebook (reproduced below). Either the primary or the secondary key works. Make sure to enclose the key in quotes to make it a string.

```python
# Variables

_url = 'https://westcentralus.api.cognitive.microsoft.com/vision/v1/analyses'
_key = None #Here you have to paste your primary key
_maxNumRetries = 10
```
