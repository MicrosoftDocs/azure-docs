---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 06/29/2022
ms.author: aahi
---

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services).
* A [conversational language understanding](../../../conversational-language-understanding/quickstart.md) project.



## Sign in to Language Studio

[!INCLUDE [Sign in to Language studio](../language-studio/sign-in-studio.md)]



## Create an orchestration workflow project

Once you have a Language resource created, create an orchestration workflow project. A project is a work area for building your custom ML models based on your data. Your project can only be accessed by you and others who have access to the Language resource being used.

For this quickstart, complete the [conversational language understanding](../../../conversational-language-understanding/quickstart.md) quickstart to create a conversational language understanding project that will be used later.

[!INCLUDE [Sign in to Language studio](../language-studio/create-project.md)]



## Build schema

After you complete the conversational language understanding quickstart and create an orchestration project, the next step is to add intents.

To connect to the previously created conversational language understanding project:

* In the **build schema** page in your orchestration project, select **Add**, to add an intent.
* In the window that appears, give your intent a name.
* Select **Yes, I want to connect it to an existing project**.
* From the connected services dropdown, select **Conversational Language Understanding**.
* From the project name dropdown, select your conversational language understanding project.
* Select **Add intent** to create your intent.




## Train your model
 
To train a model, you need to start a training job. The output of a successful training job is your trained model.

[!INCLUDE [Train model](../language-studio/train-model.md)]




## Deploy your model

Generally after training a model you would review its evaluation details. In this quickstart, you will just deploy your model, and make it available for you to try in Language Studio, or you can call the [prediction API](https://aka.ms/clu-apis).

[!INCLUDE [Deploy model](../language-studio/deploy-model.md)]





## Test model

After your model is deployed, you can start using it to make predictions through [Prediction API](https://aka.ms/clu-apis). For this quickstart, you will use the [Language Studio](https://aka.ms/LanguageStudio) to submit an utterance, get predictions and visualize the results.


[!INCLUDE [Test model](../language-studio/test-model.md)]



## Clean up resources

[!INCLUDE [Delete project using Language studio](../language-studio/delete-project.md)]


