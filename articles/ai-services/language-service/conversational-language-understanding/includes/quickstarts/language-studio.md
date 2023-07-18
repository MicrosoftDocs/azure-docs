---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 05/09/2023
ms.author: aahi
ms.custom: ignite-fall-2021
---

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services).

## Sign in to Language Studio

[!INCLUDE [Sign in to Language studio](../language-studio/sign-in-studio.md)]


## Create a conversational language understanding project

Once you have a Language resource selected, create a conversational language understanding project. A project is a work area for building your custom ML models based on your data. Your project can only be accessed by you and others who have access to the Language resource being used.

For this quickstart, you can download [this sample project file](https://go.microsoft.com/fwlink/?linkid=2196152) and import it. This project can predict the intended commands from user input, such as: reading emails, deleting emails, and attaching a document to an email. 

[!INCLUDE [Import project](../language-studio/import-project.md)]

Once the upload is complete, you will land on **Schema definition** page. For this quickstart, the schema is already built, and utterances are already labeled with intents and entities.

## Train your model

Typically, after you create a project, you should [build a schema](../../how-to/build-schema.md) and [label utterances](../../how-to/tag-utterances.md). For this quickstart, we already imported a ready project with built schema and labeled utterances. 
 
To train a model, you need to start a training job. The output of a successful training job is your trained model.

[!INCLUDE [Train model](../language-studio/train-model.md)]

## Deploy your model

Generally after training a model you would review its evaluation details. In this quickstart, you will just deploy your model, and make it available for you to try in Language studio, or you can call the [prediction API](https://aka.ms/clu-apis).

[!INCLUDE [Deploy model](../language-studio/deploy-model.md)]

## Test deployed model

[!INCLUDE [Test model](../language-studio/test-model.md)]

## Clean up resources

[!INCLUDE [Delete project using Language studio](../language-studio/delete-project.md)]
 
