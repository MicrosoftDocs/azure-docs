---
title: Quickstart change model and train LUIS app using Java - Azure Cognitive Services | Microsoft Docs
description: In this Java quickstart, add example utterances to a Home Automation app and train the app. Example utterances are conversational user text mapped to an intent. By providing example utterances for intents, you teach LUIS what kinds of user-supplied text belongs to which intent.
services: cognitive-services
author: diberry
manager: cjgronlund
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: quickstart
ms.date: 08/16/2018
ms.author: diberry
#Customer intent: As an API or REST developer new to the LUIS service, I want to programmatically add an example utterance to an intent and train the model using Java.
---

# Quickstart: Change model using Java 

[!include[Quickstart introduction for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-intro-para.md)]

## Prerequisites

[!include[Quickstart prerequisites for endpoint](../../../includes/cognitive-services-luis-qs-change-model-prereq.md)]
* [JDK SE)](http://www.oracle.com/technetwork/java/javase/downloads/index.html)  (Java Development Kit, Standard Edition)
* [Google's GSON JSON library](https://github.com/google/gson).

[!include[Quickstart note about code repository](../../../includes/cognitive-services-luis-qs-change-model-luis-repo-note.md)]

## Example utterances JSON file

[!include[Quickstart explanation of example utterance JSON file](../../../includes/cognitive-services-luis-qs-change-model-json-ex-utt.md)]

## Create quickstart code

1. Add the Java dependencies to the file.

   [!code-java[Java Dependencies](~/samples-luis/documentation-samples/quickstarts/change-model/java/AddUtterances.java?range=31-34 "Java Dependencies")]

2. Create `AddUtterances` class. This class contains all code snippets that follow.

    ```Java
    public class AddUtterances {
        // Insert code here
    }
    ```

3. Add the LUIS constants to the class. Copy the following code and change to your authoring key, application ID, and version ID.

   [!code-java[LUIS-based IDs](~/samples-luis/documentation-samples/quickstarts/change-model/java/AddUtterances.java?range=41-53 "LUIS-based IDs")]

4. Add the method to call into the LUIS API. 

   [!code-java[HTTP request to LUIS](~/samples-luis/documentation-samples/quickstarts/change-model/java/AddUtterances.java?range=55-178 "HTTP request to LUIS")]

5. Add the method for the HTTP response from the LUIS API.

   [!code-java[HTTP response from LUIS](~/samples-luis/documentation-samples/quickstarts/change-model/java/AddUtterances.java?range=180-226 "HTTP response from LUIS")]

6. Add exception handling. 

   [!code-java[Exception Handling](~/samples-luis/documentation-samples/quickstarts/change-model/java/AddUtterances.java?range=228-256 "Exception Handling")]

7. Add output/print handling.

   [!code-java[Add output handling](~/samples-luis/documentation-samples/quickstarts/change-model/java/AddUtterances.java?range=258-267 "Add configuration information for adding utterance")]

8. Add the main function.

   [!code-java[Add main function](~/samples-luis/documentation-samples/quickstarts/change-model/java/AddUtterances.java?range=269-345 "Add main function")]

## Build code

Compile AddUtterance with the dependencies

```
> javac -classpath gson-2.8.2.jar AddUtterances.java
```

## Run code
Calling `AddUtterance` with no arguments adds the LUIS utterances to the app, without training it.
````
> java -classpath .;gson-2.8.2.jar AddUtterances
````

This command-line displays the results of calling the add utterances API. 

[!include[Quickstart response from API calls](../../../includes/cognitive-services-luis-qs-change-model-json-results.md)]

## Clean up resources
When you are done with the quickstart, remove all the files created in this quickstart. 

## Next steps
> [!div class="nextstepaction"] 
> [Build a LUIS app programmatically](luis-tutorial-node-import-utterances-csv.md) 