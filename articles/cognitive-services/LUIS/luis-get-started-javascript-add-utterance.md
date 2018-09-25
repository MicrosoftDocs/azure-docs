---
title: JavaScript Quickstart - change model and train LUIS app
titleSuffix: Azure Cognitive Services
description: In this quickstart, you learn to call a LUIS app using JavaScript.
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: quickstart
ms.date: 09/10/2018
ms.author: diberry
#Customer intent: As an API or REST developer new to the LUIS service, I want to programmatically add an example utterance to an intent and train the model using Java.
---
# Quickstart: Change model using JavaScript

[!INCLUDE [Quickstart introduction for change model](../../../includes/cognitive-services-luis-qs-endpoint-intro-para.md)]

## Prerequisites

[!INCLUDE [Quickstart prerequisites for changing model](../../../includes/cognitive-services-luis-qs-change-model-prereq.md)]
* [Visual Studio Code](https://code.visualstudio.com/).

[!INCLUDE [Code is available in LUIS-Samples Github repo](../../../includes/cognitive-services-luis-qs-change-model-luis-repo-note.md)]

## Example utterances JSON file

[!INCLUDE [Quickstart explanation of example utterance JSON file](../../../includes/cognitive-services-luis-qs-change-model-json-ex-utt.md)]


## Create quickstart code

Create `add-utterances.html` and add the following code:

   [!code-html[Html code](~/samples-luis/documentation-samples/quickstarts/change-model/javascript/add-utterance.html "Javascript code")]

## Run code

1. Open the file in a browser.

2. Add your LUIS authoring ID, your LUIS application ID.

3. Modify the **array of utterances** to add to your application. They are stored in the utteranceJSON variable. Change these values for your own domain and utterance needs. 

    ```json
    // example batch utterances
    var utteranceJSON = [
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
        }
    ,
        {
            "text": "book a flight",
            "intentName": "BookFlight",
            "entityLabels": []
        }
    ];
    ```

4. Select the `Upload utterance` button. The LUIS results are displayed below the buttons.

5. Select the `Train model` button to train your application with these new utterances.

6. Select the `Train Status` button to see the training status. 

    ![Add-utterances.html](./media/luis-quickstart-javascript-add-utterance/add-utterance.png)

## Clean up resources
When you are done with the quickstart, remove all the files created in this quickstart. 

## Next steps
> [!div class="nextstepaction"]
> [Integrate LUIS with a bot](luis-csharp-tutorial-build-bot-framework-sample.md)
