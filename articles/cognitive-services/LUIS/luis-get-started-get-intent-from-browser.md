---
title: "Quickstart: Get intent with browser - LUIS"
titleSuffix: Azure Cognitive Services
description: In this quickstart, use an available public LUIS app to determine a user's intention from conversational text in a browser.  
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: quickstart
ms.date: 10/14/2019
ms.author: diberry
#Customer intent: As an developer familiar with how to use a browser but new to the LUIS service, I want to query the LUIS endpoint of a published model so that I can see the JSON prediction response.
---

# Quickstart: Get intent with a browser

To understand what a LUIS prediction endpoint returns, view a prediction result in a web browser. 

## Prerequisites

In order to query a public app, you need:

* Your own Language Understanding (LUIS) key. If you do not already have a subscription to create a key, you can register for a [free account](https://azure.microsoft.com/free/). The LUIS authoring key will not work. 
* The public app's ID: `df67dcdb-c37d-46af-88e1-8b97951ca1c2`. 

## Use the browser to see predictions

1. Open a web browser. 
1. Use the complete URLs below, replacing `{your-key}` with your own LUIS key. The requests are GET requests and include the authorization, with your LUIS key, as a query string parameter.

    The format of the V3 URL for a **GET** endpoint (by slots) request is:
    
    `
    https://westus.api.cognitive.microsoft.com/luis/prediction/v3.0/apps/df67dcdb-c37d-46af-88e1-8b97951ca1c2/slots/production/predict?show-all-intents=true&verbose=true&query=turn off the living room light&subscription-key={your-key}
    `

1. Paste the URL into a browser window and press Enter. The browser displays a JSON result that indicates that LUIS detects the `HomeAutomation.TurnOn` intent as the top intent and the `HomeAutomation.Operation` entity with the value `on`.

    ```JSON
    {
        "query": "turn off the living room light",
        "prediction": {
            "topIntent": "HomeAutomation.TurnOff",
            "intents": {
                "HomeAutomation.TurnOff": {
                    "score": 0.173280165
                },
                "HomeAutomation.TurnOn": {
                    "score": 0.0881227553
                },
                "None": {
                    "score": 0.07255802
                }
            },
            "entities": {}
        }
    }
    ```

<!-- FIX - is the public app getting updated for the new prebuilt domain with entities? -->   

## Next steps

Learn more about the [V3 prediction endpoint](luis-migration-api-v3.md).

> [!div class="nextstepaction"]
> [Create an app in the LUIS portal](get-started-portal-build-app.md)