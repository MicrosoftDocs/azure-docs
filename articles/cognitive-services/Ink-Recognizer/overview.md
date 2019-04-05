---
title: What is Ink Recognizer? - Ink Recognizer API
titlesuffix: Azure Cognitive Services
description: Integrate the Ink Recognizer into your applications, websites, tools, and other solutions to provide...
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: ink-recognizer
ms.topic: tutorial
ms.date: 06/06/2019
ms.author: erhopf
---

# What is the Ink Recognizer API?

The Ink Recognizer Cognitive Service provides cloud-based REST APIs to analyze and recognize digital ink content. Digital ink data is represented by strokes consisting of a time-ordered set of 2D points (X,Y coordinates). These points capture the motion of the input tool like a digital pen, finger or stylus, on a writing surface. It essentially captures the starting, ending and all the intermediate points along the path of one continuous stroke. Digital ink data consists of time ordered set of multiple such strokes. The service accepts the digital ink strokes data as input and generates recognition results that contain the cognitive information about the strokes and much more. 

![A flowchart describing sending an ink stroke input to the API](media/ink-recognizer-pen-graph.png)

## Features

With the Anomaly Detector, you can automatically detect anomalies throughout your time series data, or as they occur in real-time. 

|Feature  |Description  |
|---------|---------|
| Handwriting recognition | Recognize handwritten content in 67 core languages, and several locales. | 
| Layout recognition | Get structural information about the digital ink content. Break the content into writing regions, paragraphs, lines, words, bulleted lists. Your applications can then utilize the layout information to build additional features like adjusting the spacing between lines and words, aligning ink properly and so on. |
| Shape recognition | Recognize most basic geometrical shapes that are commonly used when taking notes. |
| Combined shapes and text recognition | Recognize ink content with shapes and handwriting. It can classify the strokes that belong to shapes and the ones that represent handwritten content and then recognize them.|

## Workflow

The Ink Recognizer API is a RESTful web service, making it easy to call from any programming language that can make HTTP requests and parse JSON.

[!INCLUDE [cognitive-services-anomaly-detector-signup-requirements](../../../includes/cognitive-services-ink-recognizer-signup-requirements.md)]

After signing up:

1. Take your time series data and convert it into a valid JSON format. Use [best practices](concepts/anomaly-detection-best-practices.md) when preparing your data to get the best results.
1. Send a request to the Anomaly Detector API with your data.
1. Process the API response by parsing the returned JSON message.

## Next steps