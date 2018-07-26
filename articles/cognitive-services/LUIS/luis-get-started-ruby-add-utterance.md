---
title: Quickstart learning how to add utterances to a LUIS app using Ruby | Microsoft Docs
description: In this quickstart, you learn to call a LUIS app using Ruby.
services: cognitive-services
author: diberry
manager: cjgronlund
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: quickstart
ms.date: 06/27/2018
ms.author: diberry
#Customer intent: As a developer new to LUIS, I want to add an utterance to the LUIS app model using Ruby.
---

# Quickstart: Add utterances to app using Ruby 
In this quickstart, write a program to add an utterance to an intent using the Authoring APIs in Ruby.

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

* [Ruby](http://rubyinstaller.org/) 
* Your LUIS **[authoring key](luis-concept-keys.md#authoring-key)**. You can find this key under Account Settings in the [LUIS](luis-reference-regions.md) website.
* Your existing LUIS [**application ID**](./luis-get-started-create-app.md). The application ID is shown in the application dashboard. The LUIS application with the intents and entities used in the `utterances.json` file must exist prior to running the code in `add-utterances.rb`. The code in this article does not create the intents and entities. It only adds the utterances for existing intents and entities. 
* The **version ID** within the application that receives the utterances. The default ID is "0.1"
* Create a new file named `add-utterances.rb` project in VSCode.

> [!NOTE] 
> The complete `add-utterances.cs` file and an example `utterances.json` file are available from the [**LUIS-Samples** Github repository](https://github.com/Microsoft/LUIS-Samples/blob/master/documentation-samples/authoring-api-samples/ruby/).


## Write the Ruby code

Add the dependencies to the file.

   [!code-ruby[Ruby and LUIS Dependencies](~/samples-luis/documentation-samples/authoring-api-samples/ruby/add-utterances.rb?range=1-28 "Ruby and LUIS Dependencies")]

Add the GET request used for training status.

   [!code-ruby[SendGet](~/samples-luis/documentation-samples/authoring-api-samples/ruby/add-utterances.rb?range=30-40 "SendGet")]

Add the POST request used to create utterances or start training. 

   [!code-ruby[SendPost](~/samples-luis/documentation-samples/authoring-api-samples/ruby/add-utterances.rb?range=42-54 "SendPost")]

Add the `AddUtterances` function.

   [!code-ruby[AddUtterances method](~/samples-luis/documentation-samples/authoring-api-samples/ruby/add-utterances.rb?range=56-61 "AddUtterances method")]


Add the `Train` function. 

   [!code-ruby[Train](~/samples-luis/documentation-samples/authoring-api-samples/ruby/add-utterances.rb?range=63-69 "Train")]

Add the `Status` function.

   [!code-ruby[Status](~/samples-luis/documentation-samples/authoring-api-samples/ruby/add-utterances.rb?range=71-75 "Status")]

To manage arguments, add the main code.

   [!code-ruby[Main code](~/samples-luis/documentation-samples/authoring-api-samples/ruby/add-utterances.rb?range=77-93 "Main code")]

## Specify utterances to add
Create and edit the file `utterances.json` to specify the **array of utterances** you want to add to the LUIS app. The intent and entities **must** already be in the LUIS app.

> [!NOTE]
> The LUIS application with the intents and entities used in the `utterances.json` file must exist prior to running the code in `add-utterances.rb`. The code in this article does not create the intents and entities. It only adds the utterances for existing intents and entities.

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

## Add an utterance from the command line

Run the application from a command line with Ruby.

Calling `add-utterances.rb` with only the utterance.json as an argument adds but does not train LUIS on the new utterances.
````
> ruby add-utterances.rb ./utterances.json
````

This result displays the results from calling the add utterances API. The `response` field is in this format for utterances that was added. The `hasError` is false, indicating the utterance was added.  

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

## Add an utterance and train from the command line
Call add-utterance with the `-train` argument to send a request to train.

````
> ruby add-utterances.rb ./utterances.json -train
````

> [!NOTE]
> Duplicate utterances aren't added again, but don't cause an error. The `response` contains the ID of the original utterance.

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
Call the sample with the `-status` argument to check the training status.

````
> ruby add-utterances.rb ./utterances.json -status
````

```
Requested training status.
[
   {
      "modelId": "eb2f117c-e10a-463e-90ea-1a0176660acc",
      "details": {
         "statusId": 0,
         "status": "Success",
         "exampleCount": 33,
         "trainingDateTime": "2017-11-20T18:09:11Z"
      }
   },
   {
      "modelId": "c1bdfbfc-e110-402e-b0cc-2af4112289fb",
      "details": {
         "statusId": 0,
         "status": "Success",
         "exampleCount": 33,
         "trainingDateTime": "2017-11-20T18:09:11Z"
      }
   },
   {
      "modelId": "863023ec-2c96-4d68-9c44-34c1cbde8bc9",
      "details": {
         "statusId": 0,
         "status": "Success",
         "exampleCount": 33,
         "trainingDateTime": "2017-11-20T18:09:11Z"
      }
   },
   {
      "modelId": "82702162-73ba-4ae9-a6f6-517b5244c555",
      "details": {
         "statusId": 0,
         "status": "Success",
         "exampleCount": 33,
         "trainingDateTime": "2017-11-20T18:09:11Z"
      }
   },
   {
      "modelId": "37121f4c-4853-467f-a9f3-6dfc8cad2763",
      "details": {
         "statusId": 0,
         "status": "Success",
         "exampleCount": 33,
         "trainingDateTime": "2017-11-20T18:09:11Z"
      }
   },
   {
      "modelId": "de421482-753e-42f5-a765-ad0a60f50d69",
      "details": {
         "statusId": 0,
         "status": "Success",
         "exampleCount": 33,
         "trainingDateTime": "2017-11-20T18:09:11Z"
      }
   },
   {
      "modelId": "80f58a45-86f2-4e18-be3d-b60a2c88312e",
      "details": {
         "statusId": 0,
         "status": "Success",
         "exampleCount": 33,
         "trainingDateTime": "2017-11-20T18:09:11Z"
      }
   },
   {
      "modelId": "c9eb9772-3b18-4d5f-a1e6-e0c31f91b390",
      "details": {
         "statusId": 0,
         "status": "Success",
         "exampleCount": 33,
         "trainingDateTime": "2017-11-20T18:09:11Z"
      }
   },
   {
      "modelId": "2afec2ff-7c01-4423-bb0e-e5f6935afae8",
      "details": {
         "statusId": 0,
         "status": "Success",
         "exampleCount": 33,
         "trainingDateTime": "2017-11-20T18:09:11Z"
      }
   },
   {
      "modelId": "95a81c87-0d7b-4251-8e07-f28d180886a1",
      "details": {
         "statusId": 0,
         "status": "Success",
         "exampleCount": 33,
         "trainingDateTime": "2017-11-20T18:09:11Z"
      }
   }
]
```

## Clean up resources
When you are done with the tutorial, remove Visual Studio and the console application if you don't need them anymore.

## Next steps
> [!div class="nextstepaction"] 
> [Build a LUIS app programmatically](luis-tutorial-node-import-utterances-csv.md)