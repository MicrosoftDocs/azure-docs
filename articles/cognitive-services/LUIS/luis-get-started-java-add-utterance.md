---
title: Java Quickstart - change model and train LUIS app
titleSuffix: Azure Cognitive Services
description: In this Java quickstart, add example utterances to a Home Automation app and train the app. Example utterances are conversational user text mapped to an intent. By providing example utterances for intents, you teach LUIS what kinds of user-supplied text belongs to which intent.
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

# Quickstart: Change model using Java 

[!INCLUDE [Quickstart introduction for endpoint](../../../includes/cognitive-services-luis-qs-endpoint-intro-para.md)]

## Prerequisites

[!INCLUDE [Quickstart prerequisites for endpoint](../../../includes/cognitive-services-luis-qs-change-model-prereq.md)]
* [JDK SE](http://www.oracle.com/technetwork/java/javase/downloads/index.html)  (Java Development Kit, Standard Edition)
* [Google's GSON JSON library](https://github.com/google/gson).

[!INCLUDE [Quickstart note about code repository](../../../includes/cognitive-services-luis-qs-change-model-luis-repo-note.md)]

## Example utterances JSON file

[!INCLUDE [Quickstart explanation of example utterance JSON file](../../../includes/cognitive-services-luis-qs-change-model-json-ex-utt.md)]

## Create quickstart code

1. Add the Java dependencies to the file named `AddUtterances.java`.

   [!code-java[Java Dependencies](~/samples-luis/documentation-samples/quickstarts/change-model/java/AddUtterances.java?range=23-26 "Java Dependencies")]

2. Create `AddUtterances` class. This class contains all code snippets that follow.

    ```Java
    public class AddUtterances {
        // Insert code here
    }
    ```

3. Add the LUIS constants to the class. Copy the following code and change to your authoring key, application ID, and version ID.

   [!code-java[LUIS-based IDs](~/samples-luis/documentation-samples/quickstarts/change-model/java/AddUtterances.java?range=33-44 "LUIS-based IDs")]

4. Add the method to call into the LUIS API to the AddUtterances class. 

   [!code-java[HTTP request to LUIS](~/samples-luis/documentation-samples/quickstarts/change-model/java/AddUtterances.java?range=46-168 "HTTP request to LUIS")]

5. Add the method for the HTTP response from the LUIS API to the AddUtterances class.

   [!code-java[HTTP response from LUIS](~/samples-luis/documentation-samples/quickstarts/change-model/java/AddUtterances.java?range=170-202 "HTTP response from LUIS")]

6. Add exception handling to the AddUtterances class. 

   [!code-java[Exception Handling](~/samples-luis/documentation-samples/quickstarts/change-model/java/AddUtterances.java?range=205-243 "Exception Handling")]

7. Add the main function to the AddUtterances class.

   [!code-java[Add main function](~/samples-luis/documentation-samples/quickstarts/change-model/java/AddUtterances.java?range=245-278 "Add main function")]

## Build code

Compile AddUtterance with the dependencies

```CMD
> javac -classpath gson-2.8.2.jar AddUtterances.java
```

## Run code
Calling `AddUtterance` with no arguments adds the LUIS utterances to the app, without training it.

```CMD
> java -classpath .;gson-2.8.2.jar AddUtterances
```

This command-line displays the results of calling the add utterances API. 

[!INCLUDE [Quickstart response from API calls](../../../includes/cognitive-services-luis-qs-change-model-json-results.md)]

## Clean up resources
When you are done with the quickstart, remove all the files created in this quickstart. 

## Next steps
> [!div class="nextstepaction"] 
> [Build a LUIS app programmatically](luis-tutorial-node-import-utterances-csv.md) 