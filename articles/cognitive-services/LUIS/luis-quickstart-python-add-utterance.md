---
title: Add utterances to a LUIS app using Python | Microsoft Docs 
description: Learn to call a LUIS app using Python. 
services: cognitive-services
author: v-geberr
manager: Kaiqb

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 11/09/2017
ms.author: v-geberr
---

# Add utterances to a LUIS app using Python

This quickstart shows you how to programmatically add utterances to your Language Understanding Intelligent Service (LUIS) app and train LUIS. 

Using the command line is a quick way to enter many utterances and train LUIS. You can also automate this task into a larger pipeline.

Refer to the [Authoring API definitions][authoring-apis] for technical documentation for the [add utterance](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c45), [train](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c45), and [training status](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c46) APIs.

## Prerequisites

* [Python 3.6](https://www.python.org/downloads/) or later.
* **[Recommended]** [Visual Studio Code](https://code.visualstudio.com/) for IntelliSense and debugging.
* Your LUIS **programmatic key**. You can find this key under Account Settings in [https://www.luis.ai](https://www.luis.ai).
* Your existing LUIS [**application ID**](./luis-get-started-create-app.md). The application ID is shown in the application dashboard. The LUIS application with the intents and entities used in the `utterances.json` file must exist prior to running the code in `add-utterances.js`. The code in this article does not create the intents and entities. It only adds the utterances for existing intents and entities. 
* The **version ID** within the application that receives the utterances. The default ID is "0.1"
* Create a new file named `add-utterances-3-6.py` project in VSCode.

> [!NOTE] 
> The complete `add-utterances-3-6.py` file is available from the [**LUIS-Samples** Github repository](https://github.com/Microsoft/LUIS-Samples/tree/master/documentation-samples/authoring-api-samples/python).


## Write the Python code

1. Copy one of the following code snippets:

   [!code-python[Console app code that adds an utterance Python 3.6](~/samples-luis/documentation-samples/authoring-api-samples/python/add-utterances-3-6.py)]

## Specify utterances to add
Create and edit the file `utterances.json` to specify the entities you want to add to the LUIS app. The intent and entities **must** already be in the LUIS app.

> [!NOTE]
> The LUIS application with the intents and entities used in the `utterances.json` file must exist prior to running the code in `add-utterances.js`. The code in this article does not create the intents and entities. It only adds the utterances for existing intents and entities.

The `text` field contains the text of the utterance. The `intentName` field must correspond to the name of an intent in the LUIS app. The `entityLabels` field is required. If you don't want to label any entities, provide an empty list as shown in the following example:

If the entityLabels list is not empty, the `startCharIndex` and `endCharIndex` need to mark the entity referred to in the `entityName` field. Both indexes are zero-based counts meaning 6 in the top example refers to the "S" of Seattle and not the space before the capital S.

```json
[
    {
        "text": "go to Seattle",
        "intentName": "BookFlight",
        "entityLabels": [
            {
                "entityName": "Location::LocationTo",
                "startCharIndex": 6,
                "endCharIndex": 12
            }
        ]
    },
    {
        "text": "book a flight",
        "intentName": "BookFlight",
        "entityLabels": []
    }
]
```

## Add an utterance from the command-line

Run the application from a command-line with Python 3.6.

Calling add-utterance with no arguments adds an utterance to the app, without training it.

````
> python add-utterances-3-6.py
````

This sample creates a file with the `results.json` that contains the results from calling the add utterances API. The `response` field is in this format for utterances that was added. The `hasError` is false, indicating the utterance was added.  

```json
    "response": [
        {
            "value": {
                "UtteranceText": "go to seattle",
                "ExampleId": -5123383
            },
            "hasError": false
        },
        {
            "value": {
                "UtteranceText": "book a flight",
                "ExampleId": -169157
            },
            "hasError": false
        }
    ]
```

## Add an utterance and train from the command-line
Call add-utterance with the `-train` argument to send a request to train, and subsequently request training status. The status is queued immediately after training begins. Status details are written to a file.

````
> python add-utterances-3-6.py -train
````

> [!NOTE]
> Duplicate utterances aren't added again, but don't cause an error. The `response` contains the ID of the original utterance.

When you call the sample with the `-train` argument, it creates a `training-results.json` file indicating the request to train the LUIS app was successfully queued. 

The following shows the result of a successful request to train:
```json
{
    "request": null,
    "response": {
        "statusId": 9,
        "status": "Queued"
    }
}
```

After the request to train is queued, it can take a moment to complete training.

## Get training status from the command line
Call the sample with the `-status` argument to check the training status and write status details to a file.

````
> python add-utterances-3-6.py -status
````

## Next steps

 
> [!div class="nextstepaction"] 
> [Integrate LUIS with a bot](luis-nodejs-tutorial-build-bot-framework-sample.md)


[authoring-apis]:https://aka.ms/luis-authoring-api