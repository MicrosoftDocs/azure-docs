---
title: Computer Vision Python quickstart summary | Microsoft Docs
titleSuffix: "Microsoft Cognitive Services"
description: In these quickstarts, you analyze an image, create a thumbnail, and extract printed and handwritten text using Computer Vision with Python in Cognitive Services.
services: cognitive-services
author: noellelacharite
manager: nolachar

ms.service: cognitive-services
ms.component: computer-vision
ms.topic: quickstart
ms.date: 05/17/2018
ms.author: nolachar
---
# Quickstart: Summary

These quickstarts provide information and code samples to help you quickly get started using the Computer Vision API with Python to accomplish the following tasks:

* [Analyze an image](python-analyze.md)
* [Detect celebrities and landmarks](python-domain.md)
* [Intelligently generate a thumbnail](python-thumb.md)
* [Detect and extract printed text from an image](python-print-text.md)
* [Detect and extract handwritten text from an image](python-hand-text.md)
* [Analyze an image from disk](python-disk.md)

You can run these quickstarts as a Jupyter notebook on [MyBinder](https://mybinder.org). To launch Binder, select the following button:

[![Binder](https://mybinder.org/badge.svg)](https://mybinder.org/v2/gh/Microsoft/cognitive-services-notebooks/master?filepath=VisionAPI.ipynb)

The code in these samples is similar. However, they highlight different Computer Vision features along with different techniques for exchanging data with the service, as summarized in the following table:

| Quickstart               | Request Parameters                          | Response          |
| ------------------------ | ------------------------------------------- | ----------------  |
| Analyze an image         | visualFeatures=Categories,Description,Color | JSON string       |
| Detect celebrities       | model=celebrities                           | JSON string       |
| Generate a thumbnail     | width=200&height=150&smartCropping=true     | byte array        |
| Extract printed text     | language=unk&detectOrientation=true         | JSON string       |
| Extract handwritten text | handwriting=true                            | URL, JSON string* |
| Analyze a disk image     | data=image_data (byte array)                | JSON string       |

&ast; Two API calls are required. The first call returns a URL, which is used by the second call to get the text.
