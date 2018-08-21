---
title: Quickstart learning how to add utterances to a LUIS app using Java | Microsoft Docs
description: In this quickstart, you learn to call a LUIS app using Java.
services: cognitive-services
author: diberry
manager: cjgronlund
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: quickstart
ms.date: 06/27/2018
ms.author: diberry
#Customer intent: As a developer new to LUIS, I want to add an utterance to the LUIS app model using Java. 
---

# Quickstart: Add utterances to app using Java 
In this quickstart, write a program to add an utterance to an intent using the Authoring APIs in Java.

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

* Latest Oracle [**Java/JDK**](http://www.oracle.com/technetwork/java/javase/downloads/index.html).
* [Google's GSON JSON library](https://github.com/google/gson).
* Your LUIS **[authoring key](luis-concept-keys.md#authoring-key)**. You can find this key under Account Settings in the [LUIS](luis-reference-regions.md) website.
* Your existing LUIS [**application ID**](./luis-get-started-create-app.md). The application ID is shown in the application dashboard. The LUIS application with the intents and entities used in the `utterances.json` file must exist prior to running the code in `AddUtterances.java`. The code in this article will not create the intents and entities. It will only add the utterances for existing intents and entities. 
* The **version ID** within the application that receives the utterances. The default ID is "0.1"
* Create a new text file named `AddUtterances.java`.

> [!NOTE] 
> The complete `add-utterances.cs` file and an example `utterances.json` file are available from the [**LUIS-Samples** Github repository](https://github.com/Microsoft/LUIS-Samples/tree/master/documentation-samples/authoring-api-samples/java).


## Write the Java code

Add the Java dependencies to the file.

   [!code-java[Java Dependencies](~/samples-luis/documentation-samples/authoring-api-samples/java/AddUtterances.java?range=31-34 "Java Dependencies")]

Create `AddUtterances` class

```Java
public class AddUtterances {
    // Insert code here
}
```

This class contains all code snippets that follow.

Add the LUIS constants to the class. Copy the following code and change to your authoring key, application ID, and version ID.

   [!code-java[LUIS-based IDs](~/samples-luis/documentation-samples/authoring-api-samples/java/AddUtterances.java?range=41-53 "LUIS-based IDs")]

Add the method to call into the LUIS API. 

   [!code-java[HTTP request to LUIS](~/samples-luis/documentation-samples/authoring-api-samples/java/AddUtterances.java?range=55-178 "HTTP request to LUIS")]

Add the method for the HTTP response from the LUIS API.

   [!code-java[HTTP response from LUIS](~/samples-luis/documentation-samples/authoring-api-samples/java/AddUtterances.java?range=180-226 "HTTP response from LUIS")]


Add exception handling. 

   [!code-java[Exception Handling](~/samples-luis/documentation-samples/authoring-api-samples/java/AddUtterances.java?range=228-256 "Exception Handling")]

Add output/print handling.

   [!code-java[Add output handling](~/samples-luis/documentation-samples/authoring-api-samples/java/AddUtterances.java?range=258-267 "Add configuration information for adding utterance")]

Add the main function.

   [!code-java[Add main function](~/samples-luis/documentation-samples/authoring-api-samples/java/AddUtterances.java?range=269-345 "Add main function")]


## Specify utterances to add
Create and edit the file `utterances.json` to specify the **array of utterances** you want to add to the LUIS app. The intent and entities **must** already be in the LUIS app.

> [!NOTE]
> The LUIS application with the intents and entities used in the `utterances.json` file must exist prior to running the code in `AddUtterances.java`. The code in this article will not create the intents and entities. It will only add the utterances for existing intents and entities.

The `text` field contains the text of the utterance. The `intentName` field must correspond to the name of an intent in the LUIS app. The `entityLabels` field is required. If you don't want to label any entities, provide an empty list as shown in the following example.

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

Compile AddUtterance with the dependencies

```
> javac -classpath gson-2.8.2.jar AddUtterances.java
```

Calling `AddUtterance` with no arguments adds the LUIS utterances to the app, without training it.
````
> java -classpath .;gson-2.8.2.jar AddUtterances
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
Call `add-utterance` with the `-train` argument to send a request to train. 

````
> java -classpath .;gson-2.8.2.jar AddUtterances -train
````

> [!NOTE]
> Duplicate utterances aren't added again, but don't cause an error. The `response` contains the ID of the original utterance.

When you call the app with the `-train` argument, it creates a `training-results.json` file indicating the request to train the LUIS app was successfully queued. 

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
Call the app with the `-status` argument to check the training status and write status details to a file.

````
> java -classpath .;gson-2.8.2.jar AddUtterances -status
````

## Clean up resources
When you are done with the tutorial, remove Visual Studio and the console application if you don't need them anymore. 

## Next steps
> [!div class="nextstepaction"] 
> [Build a LUIS app programmatically](luis-tutorial-node-import-utterances-csv.md) 