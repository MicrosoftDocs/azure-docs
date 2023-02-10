---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 06/07/2022
ms.author: aahi
ms.custom: ignite-fall-2021
---

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services).

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Conversational-language-understanding&Page=quickstart&Section=Prerequisites" target="_target">I ran into an issue</a>

[!INCLUDE [create a new resource from the Azure portal](../resource-creation-azure-portal.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Conversational-language-understanding&Page=quickstart&Section=Create-new-resource" target="_target">I ran into an issue</a>

## Get your resource keys and endpoint

1. Go to your resource overview page in the [Azure portal](https://portal.azure.com/#home).
2. From the menu on the left side, select **Keys and Endpoint**. You will use the endpoint and key for the API requests 

    :::image type="content" source="../../../media/azure-portal-resource-credentials.png" alt-text="A screenshot showing the key and endpoint page in the Azure portal" lightbox="../../../media/azure-portal-resource-credentials.png":::

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Conversational-language-understanding&Page=quickstart&Section=Get-resource-keys-and-endpoint" target="_target">I ran into an issue</a>

## Create a CLU project 

Once you have a Language resource created, create a conversational language understanding project. A project is a work area for building your custom ML models based on your data. Your project can only be accessed by you and others who have access to the Language resource being used.

For this quickstart, you can download [this sample project](https://go.microsoft.com/fwlink/?linkid=2196152) and import it. This project can predict the intended commands from user input, such as: reading emails, deleting emails, and attaching a document to an email. 

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=RESTAPI&Pillar=Language&Product=Conversational-language-understanding&Page=quickstart&Section=Create-a-conversational-language-understanding-project" target="_target">I ran into an issue</a>

### Trigger import project job 

[!INCLUDE [create and import project](../rest-api/import-project.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Conversational-language-understanding&Page=quickstart&Section=Trigger-import-project-job" target="_target">I ran into an issue</a>

### Get import job Status

[!INCLUDE [get import project status](../rest-api/get-import-status.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Conversational-language-understanding&Page=quickstart&Section=Get-import-job-status" target="_target">I ran into an issue</a>

## Train your model

Typically, after you create a project, you should [build schema](../../how-to/build-schema.md) and [tag utterances](../../how-to/tag-utterances.md). For this quickstart, we already imported a ready project with built schema and tagged utterances. 

### Start training your model

After your project has been imported, you can start training your model. 

[!INCLUDE [train model](../rest-api/train-model.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Conversational-language-understanding&Page=quickstart&Section=Train-model" target="_target">I ran into an issue</a>

### Get Training Status

Training could take sometime between 10 and 30 minutes. You can use the following request to keep polling the status of the training job until it is successfully completed.

 [!INCLUDE [get training model status](../rest-api/get-training-status.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Conversational-language-understanding&Page=quickstart&Section=Get-training-job-status" target="_target">I ran into an issue</a>

## Deploy your model

Generally after training a model you would review its evaluation details. In this quickstart, you will just deploy your model, and call the [prediction API](https://aka.ms/clu-apis) to query the results.

### Submit deployment job

[!INCLUDE [deploy model](../rest-api/deploy-model.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Conversational-language-understanding&Page=quickstart&Section=Submit-deployment-job" target="_target">I ran into an issue</a>

### Get deployment job status

[!INCLUDE [get deployment status](../rest-api/get-deployment-status.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Conversational-language-understanding&Page=quickstart&Section=Get-deployment-job-status" target="_target">I ran into an issue</a>

## Query model 

After your model is deployed, you can start using it to make predictions through the [prediction API](https://aka.ms/clu-apis). 

Once deployment succeeds, you can begin querying your deployed model for predictions. 

[!INCLUDE [test model](../rest-api/query-model.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Conversational-language-understanding&Page=quickstart&Section=Query-model" target="_target">I ran into an issue</a>

## Clean up resources

When you don't need your project anymore, you can delete your project using the APIs.

[!INCLUDE [Delete project](../rest-api/delete-project.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Conversational-language-understanding&Page=quickstart&Section=Clean-up-resources" target="_target">I ran into an issue</a>
