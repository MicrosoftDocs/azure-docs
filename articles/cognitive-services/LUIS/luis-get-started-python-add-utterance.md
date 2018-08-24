---
title: Quickstart change model and train LUIS app using Python - Azure Cognitive Services | Microsoft Docs
description: In this Node.js quickstart, add example utterances to a Home Automation app and train the app. Example utterances are conversational user text mapped to an intent. By providing example utterances for intents, you teach LUIS what kinds of user-supplied text belongs to which intent.
services: cognitive-services
author: diberry
manager: cjgronlund
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: quickstart
ms.date: 08/16/2018
ms.author: diberry
#Customer intent: As an API or REST developer new to the LUIS service, I want to programmatically add an example utterance to an intent and train the model using Python. 
---

# Quickstart: Change model using Python

[!include[Quickstart introduction for change model](../../../includes/cognitive-services-luis-qs-endpoint-intro-para.md)]

## Prerequisites

[!include[Quickstart prerequisites for changing model](../../../includes/cognitive-services-luis-qs-change-model-prereq.md)]
* [Python 3.6](https://www.python.org/downloads/) or later.
* [Visual Studio Code](https://code.visualstudio.com/)

[!include[Code is available in LUIS-Samples Github repo](../../../includes/cognitive-services-luis-qs-change-model-luis-repo-note.md)]

## Example utterances JSON file

[!include[Quickstart explanation of example utterance JSON file](../../../includes/cognitive-services-luis-qs-change-model-json-ex-utt.md)]

## Create quickstart code

1. Copy the following code snippet into file named `add-utterances-3-6.py`:

   [!code-python[Console app code that adds an utterance Python 3.6](~/samples-luis/documentation-samples/quickstarts/change-model/python/add-utterances-3-6.py)]

## Run code
Run the application from a command-line with Python 3.6.

### Add an utterance from the command-line

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

### Add an utterance and train from the command-line
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

### Get training status from the command line
Call the sample with the `-status` argument to check the training status and write status details to a file.

````
> python add-utterances-3-6.py -status
````

## Clean up resources
When you are done with the quickstart, remove all the files created in this quickstart. 

## Next steps
> [!div class="nextstepaction"] 
> [Build a LUIS app programmatically](luis-tutorial-node-import-utterances-csv.md)