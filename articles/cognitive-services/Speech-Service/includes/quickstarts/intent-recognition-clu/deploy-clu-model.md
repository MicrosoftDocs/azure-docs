---
author: eric-urban
ms.service: cognitive-services
ms.subservice: speech-service
ms.date: 02/17/2023
ms.topic: include
ms.author: eur
---

To complete the intent recognition quickstart, you'll need to create a LUIS account and a project using the LUIS preview portal. This quickstart requires a LUIS subscription [in a region where intent recognition is available](../../../regions.md#intent-recognition). A Speech service subscription *isn't* required.

The first thing you'll need to do is create a LUIS account and app using the LUIS preview portal. The LUIS app that you create will use a prebuilt domain for home automation, which provides  intents, entities, and example utterances. When you're finished, you'll have a LUIS endpoint running in the cloud that you can call using the Speech SDK. 

---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 10/26/2022
ms.author: aahi
ms.custom: ignite-fall-2021
---

## Sign in to Language Studio

[!INCLUDE [Sign in to Language studio](../../../../language-service/conversational-language-understanding/includes/language-studio/sign-in-studio.md)]

## Create a conversational language understanding project

Once you have a Language resource created, create a conversational language understanding project. A project is a work area for building your custom ML models based on your data. Your project can only be accessed by you and others who have access to the Language resource being used.

For this quickstart, you can download [this sample project](https://go.microsoft.com/fwlink/?linkid=2196152) and import it. This project can predict the intended commands from user input, such as: reading emails, deleting emails, and attaching a document to an email. 

[!INCLUDE [Import project](../../../../language-service/conversational-language-understanding/includes/language-studio/import-project.md)]

Once the upload is complete, you will land on **Schema definition** page. For this quickstart, the schema is already built, and utterances are already labeled with intents and entities.


## Train your model

Typically, after you create a project, you should [build a schema](../../how-to/build-schema.md) and [label utterances](../../how-to/tag-utterances.md). For this quickstart, we already imported a ready project with built schema and labeled utterances. 
 
To train a model, you need to start a training job. The output of a successful training job is your trained model.

[!INCLUDE [Train model](../../../../language-service/conversational-language-understanding/includes/language-studio/train-model.md)]


## Deploy your model

Generally after training a model you would review its evaluation details. In this quickstart, you will just deploy your model, and make it available for you to try in Language studio, or you can call the [prediction API](https://aka.ms/clu-apis).

[!INCLUDE [Deploy model](../../../../language-service/conversational-language-understanding/includes/language-studio/deploy-model.md)]


[!INCLUDE [Test model](../../../../language-service/conversational-language-understanding/includes/language-studio/test-model.md)]

## Clean up resources

[!INCLUDE [Delete project using Language studio](../../../../language-service/conversational-language-understanding/includes/language-studio/delete-project.md)]


