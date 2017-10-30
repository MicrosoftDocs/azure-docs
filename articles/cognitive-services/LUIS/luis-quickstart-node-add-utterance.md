---
title: Add an utterance to a LUIS app using Node.js | Microsoft Docs 
description: Learn to call a LUIS app using Node.js. 
services: cognitive-services
author: DeniseMak
manager: rstand

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 09/29/2017
ms.author: v-demak
---

# Add an utterance to a LUIS app using Node.js 

This quickstart shows you how to programmatically add utterances to your Language Understanding Intelligent Service (LUIS) app in just a few minutes. When you're finished, you'll be able to use Node.js code to add an utterance to a LUIS app.

## Before you begin
You need a Cognitive Services API key to make calls to the sample LUIS app we use in this walkthrough. 
To get an API key follow these steps: 

  1. You first need to create a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) in the Azure portal. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
  2. Log in to the Azure portal at https://portal.azure.com. 
  3. Follow the steps in [Creating Subscription Keys using Azure](./AzureIbizaSubscription.md) to get a key.

## Get the ID and version of your LUIS app

You can find your app ID and version number by logging into https://www.luis.ai and go to App Settings. 

## Add an utterance by calling the Authoring API with Node.js

1. Copy the following code snippet:

   [!code-nodejs[Console app code that calls a LUIS endpoint for Node.js](~/samples-luis/documentation-samples/authoring-api-samples/node/add-single-utterance.js)]
2. Set the `LUIS_APP_ID` environment variable as described in the code comments. 

3. Set the `LUIS_SUBSCRIPTION_KEY` environment variable to your Cognitive Services programmatic key.

4. Save the JSON description of the utterance you want to add. The JSON has the following format:

   ```json
[
    {
        "text": "go to Seattle",
        "intentName": "BookFlight",
        "entityLabels": [
            {
                "entityName": "Location",
                "startCharIndex": 6,
                "endCharIndex": 12
            }
        ]
    }
]
   ```
5. Edit the `uploadFile` constant to match the name of the file you created with the utterance:

```javascript
    const uploadFile = "./utterance-to-upload.json"
```

6. Run the code.
<!-- 
![Console window displays JSON result from LUIS](./media/luis-get-started-Node.js-get-intent/console-turn-on.png)
-->

## Verify that the utterance has been added to your intent

If you log into www.luis.ai and look at the intents page of your app, you should be able to see the utterance there. You can also call the [API](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c0a) for returning a list of utterances in your LUIS app.
<!-- Add image -->

## Next steps

* After adding an utterance, you may want to [train](https://docs.microsoft.com/en-us/azure/cognitive-services/LUIS/train-test) your LUIS app.
* See the [LUIS Endpoint API reference](https://westus.dev.cognitive.microsoft.com/docs/services/5819c76f40a6350ce09de1ac/operations/5819c77140a63516d81aee78) to learn more about the parameters for calling your LUIS endpoint.
