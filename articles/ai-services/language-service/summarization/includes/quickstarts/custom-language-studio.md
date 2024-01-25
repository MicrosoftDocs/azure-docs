---
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 12/19/2023
ms.author: jboback
---

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)

## Create a new Azure AI Language resource and Azure storage account

Before you can use custom Summarization, you'll need to create an Azure AI Language resource, which will give you the credentials that you need to create a project and start training a model. You'll also need an Azure storage account, where you can upload your dataset that will be used to build your model.

> [!IMPORTANT]
> To get started quickly, we recommend creating a new Azure AI Language resource using the steps provided in this article. Using the steps in this article will let you create the Language resource and storage account at the same time, which is easier than doing it later.
>
<!--- > If you have a pre-existing resource that you'd like to use, you will need to connect it to storage account. See [guidance to using a pre-existing resource](../../../includes/custom/use-pre-existing-resource.md) for information. --->

[!INCLUDE [create a new resource from the Azure portal](../../../includes/custom/resource-creation-azure-portal.md)]

## Download sample data

If you need sample data, we've provided some for [document summarization](https://github.com/Azure-Samples/cognitive-services-sample-data-files/tree/master/language-service/Custom%20summarization/abstractive-document-samples) and [conversation summarization](https://github.com/Azure-Samples/cognitive-services-sample-data-files/tree/master/language-service/Custom%20summarization/abstractive-conversation-samples) scenarios for the purpose of this quickstart.

## Upload sample data to blob container

[!INCLUDE [Uploading sample data for custom Summarization](../../../includes/custom/language-studio/upload-data-to-storage.md)]

## Create a custom summarization project

Once your resource and storage account are configured, create a new custom Summarization project. A project is a work area for building your custom ML models based on your data. Your project can only be accessed by you and others who have access to the Language resource being used.

[!INCLUDE [Create custom Summarization project](../../../includes/custom/language-studio/create-project.md)]

## Train your model

After you create a project, you go ahead and start training your model.

[!INCLUDE [Train a model using Language Studio](../../../includes/custom/language-studio/train-your-model.md)]

## Deploy your model

Generally after training a model you would review its [evaluation details](../../custom/how-to/test-evaluate.md) and make improvements if necessary. In this quickstart, you will just deploy your model, and make it available for you to try in Language studio.

[!INCLUDE [Deploy a model using Language Studio](../../../includes/custom/language-studio/deployment.md)]

## Test your model

 For this quickstart, you will use the [Language Studio](https://aka.ms/LanguageStudio) to submit the custom summarization task and visualize the results. In the sample dataset you downloaded earlier, you can find some test documents that you can use in this step.

[!INCLUDE [Test a model using Language Studio](../../../includes/custom/language-studio/test-model.md)]

:::image type="content" source="../../../media/custom/language-studio/test-model-results.png" alt-text="A screenshot showing the model test results." lightbox="../../../media/custom/language-studio/test-model-results.png":::

## Clean up resources

[!INCLUDE [Delete project using Language Studio](../../../includes/custom/language-studio/delete-project.md)]
