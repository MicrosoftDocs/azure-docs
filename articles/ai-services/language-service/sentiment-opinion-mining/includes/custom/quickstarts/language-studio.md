---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 12/19/2023
ms.author: aahi
---

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services).



## Create a new Azure Language resource and Azure storage account

Before you can use Custom sentiment analysis, you'll need to create an Azure Language resource, which will give you the credentials that you need to create a project and start training a model. You'll also need an Azure storage account, where you can upload your dataset that will be used to build your model.

> [!IMPORTANT]
> To quickly get started, we recommend creating a new Azure Language resource using the steps provided in this article. Using the steps in this article will let you create the Language resource and storage account at the same time, which is easier than doing it later.
<!--
> If you have a [pre-existing resource](../../../custom/how-to/create-project.md#using-a-pre-existing-language-resource) that you'd like to use, you will need to connect it to storage account.
-->

[!INCLUDE [create a new resource from the Azure portal](../../../../includes/custom/resource-creation-azure-portal.md)]
    


## Upload sample data to blob container

After you have created an Azure storage account and connected it to your Language resource, you will need to upload the documents from the sample dataset to the root directory of your container. These documents will later be used to train your model.

Start by [downloading the sample dataset for Custom sentiment analysis projects](https://github.com/Azure-Samples/cognitive-services-sample-data-files/blob/master/language-service/Custom%20sentiment%20analysis/example_data.zip). Open the .zip file, and extract the folder containing the documents. The provided sample dataset contains documents, each of which is a short example of a customer review.

[!INCLUDE [Uploading sample data for Custom sentiment analysis](../../../../includes/custom/language-studio/upload-data-to-storage.md)]

## Create a Custom sentiment analysis project

Once your resource and storage container are configured, create a new Custom sentiment analysis project. A project is a work area for building your custom ML models based on your data. Your project can only be accessed by you and others who have access to the Language resource being used.

[!INCLUDE [Create a project using Language Studio](../../../../includes/custom/language-studio/create-project.md)]
    


## Train your model

Typically after you create a project, you start labeling the documents you have in the container connected to your project. For this quickstart, you have imported a sample labeled dataset and initialized your project with the sample JSON labels file.

[!INCLUDE [Train a model using Language Studio](../../../../includes/custom/language-studio/train-your-model.md)]



## Deploy your model

Generally after training a model you would review its evaluation details and make improvements if necessary. In this quickstart, you will just deploy your model, and make it available for you to try in Language Studio, or you can call the [prediction API](https://aka.ms/ct-runtime-swagger).

[!INCLUDE [Deploy a model using Language Studio](../../../../includes/custom/language-studio/deployment.md)]



## Test your model

After your model is deployed, you can start using it to classify your text via [Prediction API](https://aka.ms/ct-runtime-swagger). For this quickstart, you will use the [Language Studio](https://aka.ms/LanguageStudio) to submit the Custom sentiment analysis task and visualize the results. In the sample dataset you downloaded earlier you can find some test documents that you can use in this step.

[!INCLUDE [Test a model using Language Studio](../../../../includes/custom/language-studio/test-model.md)]



## Clean up projects

[!INCLUDE [Delete project using Language Studio](../../../../includes/custom/language-studio/delete-project.md)]


