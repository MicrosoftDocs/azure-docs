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

The Ink Recognizer Cognitive Service provides cloud-based REST APIs to analyze and recognize digital ink content. Unlike services that provide Optical Character Recognition (OCR), this service requires digital ink stroke data as input. Digital ink strokes are time-ordered sets of 2D points (X,Y coordinates) that represent the motion of input tools such as digital pen, fingers or stylus. It then recognizes the shapes and handwritten content from the input and provides a document structure with all recognized entities as the output.

![A flowchart describing sending an ink stroke input to the API](media/ink-recognizer-pen-graph.png)

## Features

With the Ink Recognizer API, you can easily recognize handwritten content in your applications. 

|Feature  |Description  |
|---------|---------|
| Handwriting recognition | Recognize handwritten content in 63 core languages, and several locales. | 
| Layout recognition | Get structural information about the digital ink content. Break the content into writing regions, paragraphs, lines, words, bulleted lists. Your applications can then utilize the layout information to build additional features like automatic spacing between words, shape alignment, and text interpretation. |
| Shape recognition | Recognize the most commonly used geometric shapes when taking notes. |
| Combined shapes and text recognition | Recognize ink content with shapes and handwritten text. Separately classify which strokes belong to shapes or handwritten content, and recognize them.|

## Workflow

The Ink Recognizer API is a RESTful web service, making it easy to call from any programming language that can make HTTP requests and parse JSON.

[!INCLUDE [cognitive-services-anomaly-detector-signup-requirements](../../../includes/cognitive-services-ink-recognizer-signup-requirements.md)]

After signing up:

1. Take your time series data and convert it into a valid JSON format. Use [best practices](concepts/anomaly-detection-best-practices.md) when preparing your data to get the best results.
1. Send a request to the Anomaly Detector API with your data.
1. Process the API response by parsing the returned JSON message.

## Next steps
