---
title: "Quickstart: Recognize digital ink with the Ink Recognizer REST API and Node.js"
description: Use the Ink Recognizer API to start recognizing digital ink strokes.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: ink-recognizer
ms.topic: article
ms.date: 03/26/2019
ms.author: aahi
---

# Quickstart: Recognize digital ink with the Ink Recognizer REST API and Node.js

Use this quickstart to begin using the Ink Recognizer API on digital ink strokes. This Node.js application sends an API request containing JSON-formatted ink stroke data, and gets the response.

 While this application is written in Javascript and runs on Node.js, the API is a RESTful web service compatible with most programming languages.

## Prerequisites


Usually you would call the API from an app that accepts digital inking. This quickstart simulates sending ink stroke data by using a JSON file with the ink strokes for the following drawn square. 

![an image of a drawn square](../media/drawn-square.png)

The example data for this quickstart can be found on [GitHub](https://github.com/Azure-Samples/anomalydetector/blob/master/example-data/request-data.json).

[!INCLUDE [cognitive-services-ink-recognizer-signup-requirements](../../../../includes/cognitive-services-ink-recognizer-signup-requirements.md)]

## Create a new Node.js application

