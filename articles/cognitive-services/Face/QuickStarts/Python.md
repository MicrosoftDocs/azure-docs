---
title: "Quickstart: Detect faces in an image with the Azure REST API and Python"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you will use the Azure Face REST API with Python to detect faces in an image.
services: cognitive-services
author: PatrickFarley
manager: cgronlun

ms.service: cognitive-services
ms.component: face-api
ms.topic: quickstart
ms.date: 11/09/2018
ms.author: pafarley
#Customer intent: As a Python developer, I want to implement a simple Face detection scenario with REST calls, so that I can build more complex scenarios later on.
---

# Quickstart: Detect faces in an image using the Face REST API and Python

In this quickstart, you will use the Azure Face REST API with Python to detect human faces in an image. The script will draw frames around the faces and superimpose gender and age information on the image.

![A man and a woman, each with a rectangle drawn around their faces and age and sex displayed on the image](../images/labelled-faces-python.png)

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 


## Prerequisites

- A Face API subscription key. You can get a free trial subscription key from [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=face-api). Or, follow the instructions in [Create a Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) to subscribe to the Face API service and get your key.

## Run the Jupyter notebook

You can run this quickstart as a Jupyter notebook on [MyBinder](https://mybinder.org). To launch Binder, select the button below. Then follow the instructions in the notebook.

[![Binder](https://mybinder.org/badge.svg)](https://mybinder.org/v2/gh/Microsoft/cognitive-services-notebooks/master?filepath=FaceAPI.ipynb)

## Next steps

Next, explore the Face API reference documentation to learn more about the supported scenarios.

> [!div class="nextstepaction"]
> [Face API](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236)
