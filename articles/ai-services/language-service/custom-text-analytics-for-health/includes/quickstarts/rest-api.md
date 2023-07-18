---
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 04/14/2023
ms.author: aahi
---

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Custom-text-analytics-for-health&Page=quickstart&Section=Trigger-import-project-job" target="_target">I ran into an issue</a>

## Create a new Azure AI Language resource and Azure storage account

Before you can use custom Text Analytics for health, you'll need to create an Azure AI Language resource, which will give you the credentials that you need to create a project and start training a model. You'll also need an Azure storage account, where you can upload your dataset that will be used in building your model.

> [!IMPORTANT]
> To get started quickly, we recommend creating a new Azure AI Language resource using the steps provided in this article, which will let you create the Language resource, and create and/or connect a storage account at the same time, which is easier than doing it later.
>
> If you have a pre-existing resource that you'd like to use, you will need to connect it to storage account. See [create project](../../how-to/create-project.md#using-a-pre-existing-language-resource) for more information.

[!INCLUDE [create a new resource from the Azure portal](../resource-creation-azure-portal.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Custom-text-analytics-for-health&Page=quickstart&Section=Create-new-resource" target="_target">I ran into an issue</a>

## Upload sample data to blob container

[!INCLUDE [Uploading sample data for custom Text Analytics for health](blob-storage-upload.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Custom-text-analytics-for-health&Page=quickstart&Section=Upload-sample-data-to-blob-container" target="_target">I ran into an issue</a>

### Get your resource keys and endpoint

[!INCLUDE [Get keys and endpoint Azure Portal](../get-keys-endpoint-azure.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Custom-text-analytics-for-health&Page=quickstart&Section=Get-resource-keys-and-endpoint" target="_target">I ran into an issue</a>

## Create a custom Text Analytics for health project

Once your resource and storage account are configured, create a new custom Text Analytics for health project. A project is a work area for building your custom ML models based on your data. Your project can only be accessed by you and others who have access to the Language resource being used.

Use the labels file you downloaded from the sample data in the previous step and add it to the body of the following request. 

### Trigger import project job 

[!INCLUDE [Import a project using the REST API](../rest-api/import-project.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Custom-text-analytics-for-health&Page=quickstart&Section=Trigger-import-project-job" target="_target">I ran into an issue</a>

### Get import job status

 [!INCLUDE [get import project status](../rest-api/get-import-status.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Custom-text-analytics-for-health&Page=quickstart&Section=Get-import-job-status" target="_target">I ran into an issue</a>

## Train your model

Typically after you create a project, you go ahead and start labeling the documents you have in the container connected to your project. For this quickstart, you have imported a sample tagged dataset and initialized your project with the sample JSON tags file.

### Start training job

After your project has been imported, you can start training your model. 

[!INCLUDE [train model](../rest-api/train-model.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Custom-text-analytics-for-health&Page=quickstart&Section=Start-training-your-job" target="_target">I ran into an issue</a>

### Get training job status

Training could take sometime between 10 and 30 minutes for this sample dataset. You can use the following request to keep polling the status of the training job until it is successfully completed.

[!INCLUDE [get training model status](../rest-api/get-training-status.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Custom-text-analytics-for-health&Page=quickstart&Section=Get-training-job-status" target="_target">I ran into an issue</a>

## Deploy your model

Generally after training a model you would review its evaluation details and make improvements if necessary. In this quickstart, you will just deploy your model, and make it available for you to try in Language Studio, or you can call the [prediction API](https://aka.ms/ct-runtime-swagger).

### Start deployment job

[!INCLUDE [deploy model](../rest-api/deploy-model.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Custom-text-analytics-for-health&Page=quickstart&Section=Submit-deployment-job" target="_target">I ran into an issue</a>

### Get deployment job status

[!INCLUDE [get deployment status](../rest-api/get-deployment-status.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Custom-text-analytics-for-health&Page=quickstart&Section=Get-deployment-job-status" target="_target">I ran into an issue</a>

## Make predictions with your trained model

After your model is deployed, you can start using it to extract entities from your text using the [prediction API](https://aka.ms/ct-runtime-swagger). In the sample dataset you downloaded earlier you can find some test documents that you can use in this step.

### Submit a custom Text Analytics for health task

[!INCLUDE [submit a custom Text Analytics for health task using the REST API](../rest-api/submit-task.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Custom-text-analytics-for-health&Page=quickstart&Section=Submit-custom-text-analytics-for-health-task" target="_target">I ran into an issue</a>

### Get task results

[!INCLUDE [get custom Text Analytics for health task results](../rest-api/get-results.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Custom-text-analytics-for-health&Page=quickstart&Section=Get-task-results" target="_target">I ran into an issue</a>

## Clean up resources

[!INCLUDE [Delete project using the REST API](../rest-api/delete-project.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=REST API&Pillar=Language&Product=Custom-text-analytics-for-health&Page=quickstart&Section=Clean-up-resources" target="_target">I ran into an issue</a>
