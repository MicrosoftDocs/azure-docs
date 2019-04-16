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

The Ink Recognizer API is a cloud-based service that analyzes and recognizes digital ink content. Unlike some ink recognition services that interpret ink strokes using Optical Character Recognition(OCR), the Ink Recognizer API accepts the strokes themselves as a time-ordered set of 2D points (X,Y coordinates) to achieve detailed recognition for shapes and handwritten text. These ink stroke data points capture the motion of input tools like digital pens, fingers or styluses.

![A flowchart describing sending an ink stroke input to the API](media/ink-recognizer-pen-graph.png)

## Features

With the Ink Recognizer API, you can easily recognize handwritten content in your applications. 

|Feature  |Description  |
|---------|---------|
| Handwriting recognition | Recognize handwritten content in 67 core languages, and several locales. | 
| Layout recognition | Get structural information about the digital ink content. Break the content into writing regions, paragraphs, lines, words, bulleted lists. Your applications can then utilize the layout information to build additional features like automatic spacing between words, shape alignment, and text interpretation. |
| Shape recognition | Recognize the most commonly used geometric shapes when taking notes. |
| Combined shapes and text recognition | Recognize ink content with shapes and handwritten text. Separately classify which strokes belong to shapes or handwritten content, and recognize them.|

## Workflow

The Ink Recognizer API is a RESTful web service, making it easy to call from any programming language that can make HTTP requests and parse JSON.

[!INCLUDE [cognitive-services-ink-recognizer-signup-requirements](../../../includes/cognitive-services-ink-recognizer-signup-requirements.md)]

After signing up:

1. Take your time series data and convert it into a valid JSON format. Use [best practices](concepts/recommended-calling-patterns.md) when preparing your data to get the best results.
1. Send a request to the Ink Recognizer API with your data.
1. Process the API response by parsing the returned JSON message.

## Next steps

Try a [quickstart](quickstarts/csharp.md) to begin making calls to the Ink Recognizer API.