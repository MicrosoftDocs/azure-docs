---
title: Add utterances to a LUIS app using JavaScript | Microsoft Docs
description: Learn to call a LUIS app using JavaScript.
services: cognitive-services
author: v-geberr
manager: kaiqb
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 12/18/2017
ms.author: v-geberr
---
# Add utterances to a LUIS app using JavaScript
Programmatically add labeled utterances to your LUIS app and train it. 

For more information, see the technical documentation for the [add utterance](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c08), [train](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c45), and [training status](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c46) APIs.

## Prerequisites
> [!div class="checklist"]
> * Your LUIS [**authoring key**](luis-concept-keys.md#authoring-key). 
> * Your existing LUIS **application ID** and **version ID**. 
> * A new file named `add-utterances.html` project in VSCode.

> [!NOTE] 
> The complete `add-utterances.html` file is available from the [**LUIS-Samples** Github repository](https://github.com/Microsoft/LUIS-Samples/blob/master/documentation-samples/authoring-api-samples/javascript/add-utterance.html).


## Write the code
Create `add-utterances.html` and add the following code:

   [!code-javascript[Java Dependencies](~/samples-luis/documentation-samples/authoring-api-samples/javascript/add-utterance.html "Java Dependencies")]

## View in browser
1. Open the file in a browser.

2. Add your LUIS authoring ID, your LUIS application ID, and change the version if it is not `0.1`

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

## Next steps
> [!div class="nextstepaction"]
> [Integrate LUIS with a bot](luis-csharp-tutorial-build-bot-framework-sample.md)

