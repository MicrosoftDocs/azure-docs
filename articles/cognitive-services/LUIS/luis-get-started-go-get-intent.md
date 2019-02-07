---
title: Get intent, Go
titleSuffix: Language Understanding - Azure Cognitive Services
description: In this Go quickstart, use an available public LUIS app to determine a user's intention from conversational text.  
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: quickstart
ms.date: 01/23/2019
ms.author: diberry
#Customer intent: As an API or REST developer new to the LUIS service, I want to query the LUIS endpoint of a published model using GO so that I can see the JSON prediction response. 
---

# Quickstart: Get intent using Go

In this quickstart, pass utterances to a LUIS endpoint and get intent and entities back.

[!INCLUDE [Quickstart introduction for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-intro-para.md)]

## Prerequisites

* [Go](https://golang.org/) programming language  
* [Visual Studio Code](https://code.visualstudio.com/)
* Public app ID: df67dcdb-c37d-46af-88e1-8b97951ca1c2

[!INCLUDE [Use authoring key for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-luis-repo-note.md)]

## Get LUIS key

[!INCLUDE [Use authoring key for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-get-key-para.md)]

## Get intent with browser

[!INCLUDE [Use authoring key for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-browser-para.md)]

## Get intent programmatically

You can use Go to access the same results you saw in the browser window in the previous step. 

1. Create a new file named `endpoint.go`. Add the following code:
    
   [!code-go[Go code that calls a LUIS endpoint](~/samples-luis/documentation-samples/quickstarts/analyze-text/go/endpoint.go?range=36-98)]

2. With a command prompt in the same directory as where you created the file, enter `go build endpoint.go` to compile the Go file. The command prompt does not return any information for a successful build.

3. Run the Go application from the command line by entering the following text in the command prompt: 

    ```CMD
    go run endpoint.go -appID df67dcdb-c37d-46af-88e1-8b97951ca1c2 -endpointKey <add-your-key> -region westus
    ```
    
    Replace `<add-your-key>` with the value of your key.  
    
    The command prompt response is: 
    
    ```CMD
    appID has value df67dcdb-c37d-46af-88e1-8b97951ca1c2
    endpointKey has value xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    region has value westus
    utterance has value turn on the bedroom light
    response
    {
        "query": "turn on the bedroom light",
        "topScoringIntent": {
            "intent": "HomeAutomation.TurnOn",
            "score": 0.809439957
        },
        "entities": [
            {
            "entity": "bedroom",
            "type": "HomeAutomation.Room",
            "startIndex": 12,
            "endIndex": 18,
            "score": 0.8065475
            }
        ]
    }
    ```
    
## LUIS keys

[!INCLUDE [Use authoring key for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-key-usage-para.md)]

## Clean up resources
Close the Go file and remove it from the file system. 

## Next steps
> [!div class="nextstepaction"]
> [Add utterances](luis-get-started-go-add-utterance.md)
