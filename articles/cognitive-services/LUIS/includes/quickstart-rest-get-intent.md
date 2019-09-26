---
title: include file
description: include file 
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.subservice: luis
ms.topic: include
ms.custom: include file
ms.date: 08/16/2018
ms.author: diberry
---

To understand what a LUIS prediction endpoint returns, view a prediction result in a web browser. In order to query a public app, you need your own key and the app ID. The public IoT app ID, `df67dcdb-c37d-46af-88e1-8b97951ca1c2`, is provided as part of the URL in step one.

#### [V2 prediction endpoint request](#tab/V2)

The format of the V2 URL for a **GET** endpoint request is:

```JSON
https://{region}.api.cognitive.microsoft.com/luis/v2.0/apps/{appID}?subscription-key={your-key}&q={user-utterance}
```

1. The endpoint of the public IoT app is in this format: `https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/df67dcdb-c37d-46af-88e1-8b97951ca1c2?q=turn on all lights&subscription-key={your-key}`

    Copy the URL and substitute your key for the value of `{your-key}`.

1. Paste the URL into a browser window and press Enter. The browser displays a JSON result that indicates that LUIS detects the `HomeAutomation.TurnOn` intent as the top intent and the `HomeAutomation.Operation` entity with the value `on`.

    ```JSON
    {
      "query": "turn on all lights",
      "topScoringIntent": {
        "intent": "HomeAutomation.TurnOn",
        "score": 0.5375382
      },
      "entities": [
        {
          "entity": "on",
          "type": "HomeAutomation.Operation",
          "startIndex": 5,
          "endIndex": 6,
          "score": 0.724984169
        }
      ]
    }
    ```

1. Add the **verbose** flag to the end of the querystring to **show all intents**:

    ```text
    https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/df67dcdb-c37d-46af-88e1-8b97951ca1c2?q=turn on all lights&subscription-key={your-key}&verbose=true
    ```

    ```json
    {
      "query": "turn on all lights",
      "topScoringIntent": {
        "intent": "HomeAutomation.TurnOn",
        "score": 0.5375382
      },
      "intents": [
        {
          "intent": "HomeAutomation.TurnOn",
          "score": 0.5375382
        },
        {
          "intent": "None",
          "score": 0.08687421
        },
        {
          "intent": "HomeAutomation.TurnOff",
          "score": 0.0207554
        }
      ],
      "entities": [
        {
          "entity": "on",
          "type": "HomeAutomation.Operation",
          "startIndex": 5,
          "endIndex": 6,
          "score": 0.724984169
        }
      ]
    }
    ```

#### [V3 prediction endpoint request](#tab/V3)


The format of the V3 URL for a **GET** endpoint (by slots) request is:

```JSON
https://{region}.api.cognitive.microsoft.com/luis/v3.0-preview/apps/{appID}/slots/{slotName}/predict?query={user-utterance}&subscription-key={your-key}
```

1. The endpoint of the public IoT app is in this format: `https://westus.api.cognitive.microsoft.com/luis/v3.0-preview/apps/df67dcdb-c37d-46af-88e1-8b97951ca1c2/slots/production/predict?query=turn on all lights&subscription-key={your-key}`

    Copy the URL and substitute your key for the value of `{your-key}`.


1. Paste the URL into a browser window and press Enter. The browser displays a JSON result that indicates that LUIS detects the `HomeAutomation.TurnOn` intent as the top intent and the `HomeAutomation.Operation` entity with the value `on`.

    ```JSON
    {
        "query": "turn on all lights",
        "prediction": {
            "normalizedQuery": "turn on all lights",
            "topIntent": "HomeAutomation.TurnOn",
            "intents": {
                "HomeAutomation.TurnOn": {
                    "score": 0.5375382
                }
            },
            "entities": {
                "HomeAutomation.Operation": [
                    "on"
                ]
            }
        }
    }
    ```

1. Add the **verbose** flag to the end of the querystring to show **entity metadata details**:

    ```text
    https://westus.api.cognitive.microsoft.com/luis/v3.0-preview/apps/df67dcdb-c37d-46af-88e1-8b97951ca1c2/slots/production/predict?query=turn on the bedroom light&subscription-key={your-key}&verbose=true
    ```

    ```JSON
    {
        "query": "turn on all lights",
        "prediction": {
            "normalizedQuery": "turn on all lights",
            "topIntent": "HomeAutomation.TurnOn",
            "intents": {
                "HomeAutomation.TurnOn": {
                    "score": 0.5375382
                }
            },
            "entities": {
                "HomeAutomation.Operation": [
                    "on"
                ],
                "$instance": {
                    "HomeAutomation.Operation": [
                        {
                            "type": "HomeAutomation.Operation",
                            "text": "on",
                            "startIndex": 5,
                            "length": 2,
                            "score": 0.724984169,
                            "modelTypeId": -1,
                            "modelType": "Unknown",
                            "recognitionSources": [
                                "model"
                            ]
                        }
                    ]
                }
            }
        }
    }
    ```

* * * 