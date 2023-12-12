---
author: eric-urban
ms.service: azure-ai-speech
ms.date: 02/17/2023
ms.topic: include
ms.author: eur
---

Once you have a Language resource created, create a conversational language understanding project in [Language Studio](https://aka.ms/languageStudio). A project is a work area for building your custom ML models based on your data. Your project can only be accessed by you and others who have access to the Language resource being used. 

Go to the [Language Studio](https://aka.ms/languageStudio) and sign in with your Azure account.

### Create a conversational language understanding project

For this quickstart, you can download [this sample home automation project](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/language-service/CLU/HomeAutomationDemo.json) and import it. This project can predict the intended commands from user input, such as turning lights on and off. 

[!INCLUDE [Import project](../../../../language-service/conversational-language-understanding/includes/language-studio/import-project.md)]

Once the upload is complete, you will land on **Schema definition** page. For this quickstart, the schema is already built, and utterances are already labeled with intents and entities.

### Train your model

Typically, after you create a project, you should [build a schema](../../../../language-service/conversational-language-understanding/how-to/build-schema.md) and [label utterances](../../../../language-service/conversational-language-understanding/how-to/tag-utterances.md). For this quickstart, we already imported a ready project with built schema and labeled utterances. 
 
To train a model, you need to start a training job. The output of a successful training job is your trained model.

[!INCLUDE [Train model](../../../../language-service/conversational-language-understanding/includes/language-studio/train-model.md)]

### Deploy your model

Generally after training a model you would review its evaluation details. In this quickstart, you will just deploy your model, and make it available for you to try in Language studio, or you can call the [prediction API](https://aka.ms/clu-apis).

[!INCLUDE [Deploy model](../../../../language-service/conversational-language-understanding/includes/language-studio/deploy-model.md)]


