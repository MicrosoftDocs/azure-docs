---
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 09/28/2022
ms.author: aahi
ms.custom: language-service-custom-classification, ignite-fall-2021, event-tier1-build-2022
---

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services).

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Custom-text-classification&Page=quickstart&Section=Trigger-import-project-job" target="_target">I ran into an issue</a>

## Create a new Azure Language resource and Azure storage account

Before you can use custom text classification, you'll need to create an Azure Language resource, which will give you the credentials that you need to create a project and start training a model. You'll also need an Azure storage account, where you can upload your dataset that will be used in building your model.

> [!IMPORTANT]
> To get started quickly, we recommend creating a new Azure Language resource using the steps provided in this article, which will let you create the Language resource, and create and/or connect a storage account at the same time, which is easier than doing it later.
>
> If you have a [pre-existing resource](../../how-to/create-project.md#using-a-pre-existing-language-resource) that you'd like to use, you will need to connect it to storage account.

[!INCLUDE [create a new resource from the Azure portal](../resource-creation-azure-portal.md)]
    
> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Custom-text-classification&Page=quickstart&Section=Create-new-resource" target="_target">I ran into an issue</a>

## Upload sample data to blob container

[!INCLUDE [Uploading sample data for custom tex classification](blob-storage-upload.md)]
    
> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Custom-text-classification&Page=quickstart&Section=Upload-sample-data-to-blob-container" target="_target">I ran into an issue</a>

### Get your resource keys and endpoint

[!INCLUDE [Get keys and endpoint Azure Portal](../get-keys-endpoint-azure.md)]
    
> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Custom-text-classification&Page=quickstart&Section=Get-resource-keys-and-endpoint" target="_target">I ran into an issue</a>

## Create a custom text classification project

Once your resource and storage container are configured, create a new custom text classification project. A project is a work area for building your custom ML models based on your data. Your project can only be accessed by you and others who have access to the Language resource being used.

### Trigger import project job 

[!INCLUDE [Import a project using the REST API](../rest-api/import-project.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Custom-text-classification&Page=quickstart&Section=Trigger-import-project-job" target="_target">I ran into an issue</a>

### Get import job Status

 [!INCLUDE [get import project status](../rest-api/get-import-status.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Custom-text-classification&Page=quickstart&Section=Get-import-job-status" target="_target">I ran into an issue</a>

## Train your model

Typically after you create a project, you go ahead and start [tagging the documents](../../how-to/tag-data.md) you have in the container connected to your project. For this quickstart, you have imported a sample tagged dataset and initialized your project with the sample JSON tags file.

### Start training your model

After your project has been imported, you can start training your model. 

[!INCLUDE [train model](../rest-api/train-model.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Custom-text-classification&Page=quickstart&Section=Start-training-your-model" target="_target">I ran into an issue</a>

### Get training job status

Training could take sometime between 10 and 30 minutes. You can use the following request to keep polling the status of the training job until it's successfully completed.

[!INCLUDE [get training model status](../rest-api/get-training-status.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Custom-text-classification&Page=quickstart&Section=Get-training-job-status" target="_target">I ran into an issue</a>

## Deploy your model

Generally after training a model you would review it's [evaluation details](../../how-to/view-model-evaluation.md) and [make improvements](../../how-to/view-model-evaluation.md) if necessary. In this quickstart, you will just deploy your model, and make it available for you to try in Language Studio, or you can call the [prediction API](https://aka.ms/ct-runtime-swagger).

### Submit deployment job

[!INCLUDE [deploy model](../rest-api/deploy-model.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Custom-text-classification&Page=quickstart&Section=Submit-deployment-job" target="_target">I ran into an issue</a>

### Get deployment job status

[!INCLUDE [get deployment status](../rest-api/get-deployment-status.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Custom-text-classification&Page=quickstart&Section=Get-deployment-job-status" target="_target">I ran into an issue</a>

## Classify text

After your model is deployed successfully, you can start using it to classify your text via [Prediction API](https://aka.ms/ct-runtime-swagger). In the sample dataset you downloaded earlier you can find some test documents that you can use in this step.

### Submit a custom text classification task

[!INCLUDE [submit a text classification task using the REST API](../rest-api/submit-task.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Custom-text-classification&Page=quickstart&Section=Submit-custom-text-classification-task" target="_target">I ran into an issue</a>

### Get task results

[!INCLUDE [get text classification task results](../rest-api/get-results.md)]


> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Custom-text-classification&Page=quickstart&Section=Get-task-results" target="_target">I ran into an issue</a>

## Clean up resources

[!INCLUDE [Delete project using the REST API](../rest-api/delete-project.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Custom-text-classification&Page=quickstart&Section=Clean-up-resources" target="_target">I ran into an issue</a>
