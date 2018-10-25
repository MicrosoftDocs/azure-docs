---
title: "Tutorial: Anomaly Detection, Python"
titlesuffix: Azure Cognitive Services
description: Explore a Python notebook that uses the Anomaly Detection API. Send original data points to API and get the expected value and anomaly points.
services: cognitive-services
author: chliang
manager: bix

ms.service: cognitive-services
ms.component: anomaly-detection
ms.topic: tutorial
ms.date: 05/01/2018
ms.author:  chliang
---

# Tutorial: Anomaly Detection with Python application

[!INCLUDE [PrivatePreviewNote](../../../../../includes/cognitive-services-anomaly-finder-private-preview-note.md)]

The tutorial shows how to use the Anomaly Detection API in Python and how to visualize your results using popular libraries. Using Jupyter to run the tutorial and trying your own data with your subscription key. To learn how to get started
with interactive Jupyter notebooks, refer to [Jupyter Documentation](http://jupyter.readthedocs.io/en/latest/index.html). 

## Prerequisites

### Subscribe to Anomaly Detection and get a subscription key 

[!INCLUDE [GetSubscriptionKey](../includes/get-subscription-key.md)]

## Download the example code

1. Navigate to the [tutorial notebook in Github](https://github.com/MicrosoftAnomalyDetection/python-sample).
2. Click on the green button to clone or download the tutorial. 

## Opening the tutorial notebook in Jupyter

1. Open a command prompt and go to the folder python-sample.
2. Run the command Jupyter notebook from the command prompt, which will start Jupyter.
3. In the Jupyter window, click on <em>Anomaly Detection API Example.ipynb</em> to open the tutorial notebook.   

## Running the tutorial

To use this notebook, you will need a subscription key for the Anomaly Detection API. Visit the Subscription page to sign up. On the “Sign in” page, use your Microsoft account to sign in and you will be able to subscribe and get your keys. After completing the sign-up process, paste your key into the variables section of the notebook (reproduced below). Either the primary or the secondary key works. 
Make sure to enclose the key in quotes to make it a string.

```Python

            # Variables
            endpoint = 'https://api.labs.cognitive.microsoft.com/anomalyfinder/v1.0/anomalydetection'
            subscription_key = None #Here you have to paste your primary key

```

## Next steps

> [!div class="nextstepaction"]
> [REST API reference](https://dev.labs.cognitive.microsoft.com/docs/services/anomaly-detection/operations/post-anomalydetection)
