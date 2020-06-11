---
title: "Quickstart: Recognize digital ink with the Ink Recognizer REST API and Node.js"
titleSuffix: Azure Cognitive Services
description: Use the Ink Recognizer API to start recognizing digital ink strokes in this quickstart.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: ink-recognizer
ms.topic: quickstart
ms.date: 12/17/2019
ms.author: aahi
---

# Quickstart: Recognize digital ink with the Ink Recognizer REST API and JavaScript

Use this quickstart to begin using the Ink Recognizer API on digital ink strokes. This JavaScript application sends an API request containing JSON-formatted ink stroke data, and displays the response.

While this application is written in Javascript and runs in your web browser, the API is a RESTful web service compatible with most programming languages.

Typically you would call the API from a digital inking app. This quickstart sends ink stroke data for the following handwritten sample from a JSON file.

![an image of handwritten text](../media/handwriting-sample.jpg)

The source code for this quickstart can be found on [GitHub](https://go.microsoft.com/fwlink/?linkid=2089905).

## Prerequisites

- A web browser
- The example ink stroke data for this quickstart can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/javascript/InkRecognition/quickstart/example-ink-strokes.json).

### Create an Ink Recognizer resource

[!INCLUDE [creating an ink recognizer resource](../includes/setup-instructions.md)]

## Create a new application

1. In your favorite IDE or editor, create a new `.html` file. Then add basic HTML to it for the code we'll add later.
    
    ```html
    <!DOCTYPE html>
    <html>
    
        <head>
            <script type="text/javascript">
            </script>
        </head>
        
        <body>
        </body>
    
    </html>
    ```

2. Within the `<body>` tag, add the following html:
    1. Two text areas for displaying the JSON request and response.
    2. A button for calling the `recognizeInk()` function that will be created later.
    
    ```HTML
    <!-- <body>-->
        <h2>Send a request to the Ink Recognition API</h2>
        <p>Request:</p>
        <textarea id="request" style="width:800px;height:300px"></textarea>
        <p>Response:</p>
        <textarea id="response" style="width:800px;height:300px"></textarea>
        <br>
        <button type="button" onclick="recognizeInk()">Recognize Ink</button>
    <!--</body>-->
    ```

## Load the example JSON data

1. Within the `<script>` tag, create a variable for the sampleJson. Then create a JavaScript function named `openFile()` that opens a file explorer so you can select your JSON file. When the `Recognize ink` button is clicked, it will call this function and begin reading the file.
2. Use a `FileReader` object's `onload()` function to process the file asynchronously. 
    1. Replace any `\n` or `\r` characters in the file with an empty string. 
    2. Use `JSON.parse()` to convert the text to valid JSON
    3. Update the `request` text box in the application. Use `JSON.stringify()` to format the JSON string. 
    
    ```javascript
    var sampleJson = "";
    function openFile(event) {
        var input = event.target;
    
        var reader = new FileReader();
        reader.onload = function(){
            sampleJson = reader.result.replace(/(\\r\\n|\\n|\\r)/gm, "");
            sampleJson = JSON.parse(sampleJson);
            document.getElementById('request').innerHTML = JSON.stringify(sampleJson, null, 2);
        };
        reader.readAsText(input.files[0]);
    };
    ```

## Send a request to the Ink Recognizer API

1. Within the `<script>` tag, create a function called `recognizeInk()`. This function will later call the API and update the page with the response. Add the code from the  following steps within this function. 
        
    ```javascript
    function recognizeInk() {
    // add the code from the below steps here 
    }
    ```

    1. Create variables for your endpoint URL, subscription key, and the sample JSON. Then create an `XMLHttpRequest` object to send the API request. 
        
        ```javascript
        // Replace the below URL with the correct one for your subscription. 
        // Your endpoint can be found in the Azure portal. For example: "https://<your-custom-subdomain>.cognitiveservices.azure.com";
        var SERVER_ADDRESS = process.env["INK_RECOGNITION_ENDPOINT"];
        var ENDPOINT_URL = SERVER_ADDRESS + "/inkrecognizer/v1.0-preview/recognize";
        var SUBSCRIPTION_KEY = process.env["INK_RECOGNITION_SUBSCRIPTION_KEY"];
        var xhttp = new XMLHttpRequest();
        ```
    2. Create the return function for the `XMLHttpRequest` object. This function will parse the API response from a successful request, and display it in the application. 
            
        ```javascript
        function returnFunction(xhttp) {
            var response = JSON.parse(xhttp.responseText);
            console.log("Response: %s ", response);
            document.getElementById('response').innerHTML = JSON.stringify(response, null, 2);
        }
        ```
    3. Create the error function for the request object. This function logs the error to the console. 
            
        ```javascript
        function errorFunction() {
            console.log("Error: %s, Detail: %s", xhttp.status, xhttp.responseText);
        }
        ```

    4. Create a function for the request object's `onreadystatechange` property. When the request object's readiness state changes, the above return and error functions will be applied.
            
        ```javascript
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    returnFunction(xhttp);
                } else {
                    errorFunction(xhttp);
                }
            }
        };
        ```
    
    5. Send the API request. Add your subscription key to the `Ocp-Apim-Subscription-Key` header, and set the `content-type` to `application/json`
    
        ```javascript
        xhttp.open("PUT", ENDPOINT_URL, true);
        xhttp.setRequestHeader("Ocp-Apim-Subscription-Key", SUBSCRIPTION_KEY);
        xhttp.setRequestHeader("content-type", "application/json");
        xhttp.send(JSON.stringify(sampleJson));
        };
        ```

## Run the application and view the response

This application can be run within your web browser. A successful response is returned in JSON format. You can also find the JSON response on [GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/javascript/InkRecognition/quickstart/example-response.json):

## Next steps

> [!div class="nextstepaction"]
> [REST API reference](https://go.microsoft.com/fwlink/?linkid=2089907)

To see how the Ink Recognition API works in a digital inking app, take a look at the following sample applications on GitHub:
* [C# and Universal Windows Platform(UWP)](https://go.microsoft.com/fwlink/?linkid=2089803)  
* [C# and Windows Presentation Foundation(WPF)](https://go.microsoft.com/fwlink/?linkid=2089804)
* [Javascript web-browser app](https://go.microsoft.com/fwlink/?linkid=2089908)       
* [Java and Android mobile app](https://go.microsoft.com/fwlink/?linkid=2089906)
* [Swift and iOS mobile app](https://go.microsoft.com/fwlink/?linkid=2089805)
