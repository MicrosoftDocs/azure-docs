---
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 06/07/2022
ms.author: aahi
---

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)



## Create a new Azure AI Language resource and Azure storage account

Before you can use custom NER, you'll need to create an Azure AI Language resource, which will give you the credentials that you need to create a project and start training a model. You'll also need an Azure storage account, where you can upload your dataset that will be used in building your model.

> [!IMPORTANT]
> To get started quickly, we recommend creating a new Azure AI Language resource using the steps provided in this article, which will let you create the Language resource, and create and/or connect a storage account at the same time, which is easier than doing it later.
>
> If you have a pre-existing resource that you'd like to use, you will need to connect it to storage account. See [create project](../../how-to/create-project.md#using-a-pre-existing-language-resource)  for information.

[!INCLUDE [create a new resource from the Azure portal](../resource-creation-azure-portal.md)]



## Upload sample data to blob container

[!INCLUDE [Uploading sample data for custom NER](blob-storage-upload.md)]



### Get your resource keys and endpoint

[!INCLUDE [Get keys and endpoint Azure Portal](../get-keys-endpoint-azure.md)]



## Create a custom NER project

Once your resource and storage account are configured, create a new custom NER project. A project is a work area for building your custom ML models based on your data. Your project can only be accessed by you and others who have access to the Language resource being used.

Use the tags file you downloaded from the [sample data](https://github.com/Azure-Samples/cognitive-services-sample-data-files) in the previous step and add it to the body of the following request. 

### Trigger import project job 

[!INCLUDE [Import a project using the REST API](../rest-api/import-project.md)]



### Get import job status

 [!INCLUDE [get import project status](../rest-api/get-import-status.md)]



## Train your model

Typically after you create a project, you go ahead and start [tagging the documents](../../how-to/tag-data.md) you have in the container connected to your project. For this quickstart, you have imported a sample tagged dataset and initialized your project with the sample JSON tags file.

### Start training job

After your project has been imported, you can start training your model. 

[!INCLUDE [train model](../rest-api/train-model.md)]



### Get training job status

Training could take sometime between 10 and 30 minutes for this sample dataset. You can use the following request to keep polling the status of the training job until it is successfully completed.

[!INCLUDE [get training model status](../rest-api/get-training-status.md)]



## Deploy your model

Generally after training a model you would review it's [evaluation details](../../how-to/view-model-evaluation.md) and [make improvements](../../how-to/view-model-evaluation.md) if necessary. In this quickstart, you will just deploy your model, and make it available for you to try in Language Studio, or you can call the [prediction API](https://aka.ms/ct-runtime-swagger).

### Start deployment job

[!INCLUDE [deploy model](../rest-api/deploy-model.md)]



### Get deployment job status

[!INCLUDE [get deployment status](../rest-api/get-deployment-status.md)]



## Extract custom entities

After your model is deployed, you can start using it to extract entities from your text using the [prediction API](https://aka.ms/ct-runtime-swagger). In the sample dataset you downloaded earlier you can find some test documents that you can use in this step.

### Submit a custom NER task

[!INCLUDE [submit a custom NER task using the REST API](../rest-api/submit-task.md)]



### Get task results

[!INCLUDE [get custom NER task results](../rest-api/get-results.md)]



## Clean up resources

[!INCLUDE [Delete project using the REST API](../rest-api/delete-project.md)]


