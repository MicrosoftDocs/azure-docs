---
title: "Quickstart: Recognize digital ink with the Ink Recognizer REST API and Node.js"
description: Use the Ink Recognizer API to start recognizing digital ink strokes.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: ink-recognizer
ms.topic: article
ms.date: 05/02/2019
ms.author: aahi
---

# Quickstart: Recognize digital ink with the Ink Recognizer REST API and JavaScript

Use this quickstart to begin using the Ink Recognizer API on digital ink strokes. This JavaScript application sends an API request containing JSON-formatted ink stroke data, and displays the response.

While this application is written in Javascript and runs in your browser, the API is a RESTful web service compatible with most programming languages.

## Prerequisites

Usually you would call the API from an app that accepts digital inking. This quickstart simulates sending ink stroke data by using a JSON file with the ink strokes for the following drawn square. 

![an image of handwritten text](../media/handwriting-sample.jpg)

The example data for this quickstart can be found on [GitHub](https://github.com/Azure-Samples/anomalydetector/blob/master/example-data/request-data.json).

[!INCLUDE [cognitive-services-ink-recognizer-signup-requirements](../../../../includes/cognitive-services-ink-recognizer-signup-requirements.md)]

## Create a new JavaScript application

1. In your favorite IDE or editor, create a new `.html` file. Then add basic HTML to it.
    
    ```html
    <!DOCTYPE html>
    <html>
    
        <head>
            <script type="text/javascript" src="jsSampleData.json">
            </script>
        </head>
        
        <body>
        </body>
    
    </html>
    ```

2. Within the `<body>` tag, add the following html:
    1. Two text areas for displaying the JSON response.
    2. A button for calling the `recognizeInk()` function that will be created later.
    
    ```HTML
    <body>
        <h2>Send a request to the Ink Recognition API</h2>
        <p>Request:</p>
        <textarea id="request" style="width:800px;height:300px"></textarea>
        <p>Response:</p>
        <textarea id="response" style="width:800px;height:300px"></textarea>
        <br>
        <button type="button" onclick="recognizeInk()">Recognize Ink</button>
    </body>
    ```

3. Within the `<script>` tag, create a JavaScript function.
    
    ```javascript
    function recognizeInk() {
    // add the below code within this function.
    }
    ```

4. Create variables for y

```javascript
var SERVER_ADDRESS = "https://input.microsoft.com";
var ENDPOINT_URL = SERVER_ADDRESS + "/Ink/Analysis/?api-version=1.0";
var SUBSCRIPTION_KEY = "7294f5ba13be41ae9704dd944f31ba33";
var second_url = "https://cii-ppe.azure-api.net/Ink/Analysis/?api-version=1.0";
var sampleJson = JSON.parse(JSON.stringify(jsSampleData));
document.getElementById('request').innerHTML = sampleJson, null, 2;
```