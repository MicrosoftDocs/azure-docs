---
title: Quickstart learning how to add utterances to a LUIS app using Go | Microsoft Docs
description: In this quickstart, you learn to call a LUIS app using Go.
services: cognitive-services
titleSuffix: Microsoft Cognitive Services
author: diberry
manager: cjgronlund
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: quickstart
ms.date: 07/17/2018
ms.author: diberry
#Customer intent: As a developer new to LUIS, I want to add an utterance to the LUIS app model using Go. 
---

# Quickstart: Add utterances to a LUIS app using Go 
In this quickstart, write a program to add an utterance to an intent in an app, train the app, and get training status using the Authoring APIs with Go.

<!-- green checkmark -->
<!--
> [!div class="checklist"]
> * Create Visual Studio console project 
> * Add method to call LUIS API to add utterance and train app
> * Add JSON file with example utterances for BookFlight intent
> * Run console and see training status for utterances
-->

For more information, see the technical documentation for the [add example utterance to intent](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c08), [train](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c45), and [training status](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c46) APIs.

For this article, you need a free [LUIS](luis-reference-regions.md#luis-website) account in order to author your LUIS application.

## Prerequisites

* [Go](https://golang.org/) installed. 
* Your LUIS **[authoring key](luis-concept-keys.md#authoring-key)**. You can find this key under Account Settings in the [LUIS](luis-reference-regions.md) website.
* Import [TravelAgent - Sample 1
](https://github.com/Microsoft/LUIS-Samples/blob/master/documentation-samples/Examples-BookFlight/travel-agent-sample-01.json) app from Github repository. Get the new app ID from **Settings** page in LUIS website. 
* The **version ID** within the application that receives the utterances. The default ID is `0.1`.
* Create a new file named `add-utterances.go` project in VSCode.

> [!NOTE] 
> The complete Go solution including an example `utterances.json` file are available from the [**LUIS-Samples** Github repository](https://github.com/Microsoft/LUIS-Samples/blob/master/documentation-samples/authoring-api-samples/go).

## Add utterances and train using the Authoring API with Go
You can add example utterances to an existing intent and train the app with Go. Create a new file named `add-utterances.go`. Add the following code:

   [!code-go[Go code that adds utterance and trains app](~/samples-luis/documentation-samples/authoring-api-samples/go/add-utterances.go?range=35-136)]

## Specify utterances to add
Create and edit the file `utterances.json` to specify the **array of utterances** you want to add to the LUIS app. The intent and entities **must** already be in the LUIS app.

> [!NOTE]
> The LUIS `TravelAgent - Sample 1` application with the intents and entities used in the `utterances.json` file must exist prior to running the code in `add-utterances.go`. The code in this article does not create the intents and entities. It only adds the utterances for existing intents and entities.

The `text` field contains the text of the utterance. The `intentName` field must correspond to the name of an intent in the LUIS app. The `entityLabels` field is required. If you don't want to label any entities, provide an empty list as shown in the following example:

If the entityLabels list is not empty, the `startCharIndex` and `endCharIndex` need to mark the entity referred to in the `entityName` field. Both indexes are zero-based counts meaning 6 in the top example refers to the "S" of Seattle and not the space before the capital S.

```JSON
[
    {
        "text": "go lang 1",
        "intentName": "None",
        "entityLabels": []
    }
,
    {
        "text": "go lang 2",
        "intentName": "None",
        "entityLabels": []
    }
]
```

## Add an utterance from the command line, train, and get status
Run the Go code from a command prompt to add an utterance, train the app, and get the training status.

1. From a command prompt in the directory where you created the Go file, enter `go build add-utterances.go` to compile the Go file. The command prompt does not return any information for a successful build.

3. Run the Go application from the command line by entering the following in the command prompt: 

    ```CMD
    add-utterances -appID <your-app-id> -authoringKey <add-your-authoring-key> -version <your-version-id> -region westus -utteranceFile utterances.json

    ```

    Replace `<add-your-authoring-key>` with the value of your authoring key (also known as the starter key). Replace `<your-app-id>` with the value of your app ID. Replace `<your-version-id>` with the value of your version. Default version is `0.1`.

    This command-prompt displays the results:

    ```CMD
    add example utterances requested
    [
        {
            "text": "go lang 1",
            "intentName": "None",
            "entityLabels": []
        }
    ,
        {
            "text": "go lang 2",
            "intentName": "None",
            "entityLabels": []
        }
    ]
        201
    [{"value":{"ExampleId":77783998,"UtteranceText":"go lang 1"},"hasError":false},{"value":{"ExampleId":77783999,"UtteranceText":"go lang 2"},"hasError":false}]
    training selected
        202
    {"statusId":9,"status":"Queued"}
    training status selected
        200
    [{"modelId":"c52d6509-9261-459e-90bc-b3c872ee4a4b","details":{"statusId":3,"status":"InProgress","exampleCount":24}},{"modelId":"5119cbe8-97a1-4c1f-85e6-6449f3a38d77","details":{"statusId":3,"status":"InProgress","exampleCount":24}},{"modelId":"01e6b6bc-9872-47f9-8a52-da510cddfafe","details":{"statusId":3,"status":"InProgress","exampleCount":24}},{"modelId":"33b409b2-32b0-4b0c-9e91-31c6cfaf93fb","details":{"statusId":3,"status":"InProgress","exampleCount":24}},{"modelId":"1fb210be-2a19-496d-bb72-e0c2dd35cbc1","details":{"statusId":3,"status":"InProgress","exampleCount":24}},{"modelId":"3d098beb-a1aa-423f-a0ae-ce08ced216d6","details":{"statusId":3,"status":"InProgress","exampleCount":24}},{"modelId":"cce854f8-8f8f-4ed9-a7df-44dfea562f62","details":{"statusId":3,"status":"InProgress","exampleCount":24}},{"modelId":"4d97bf0d-5213-4502-9712-2d6e77c96045","details":{"statusId":3,"status":"InProgress","exampleCount":24}}]
    ```

    This response includes the HTTP status code for each of the three HTTP calls as well as any JSON response returned in the body of the response. 

    You can verify the example utterances were added by refreshing the LUIS website for the **None** intent. 

## Clean up resources
When you are done with the quickstart, remove the files created in this quickstart and the LUIS application. 

## Next steps
> [!div class="nextstepaction"] 
> [Build an app with a custom domain](luis-quickstart-intents-only.md) 