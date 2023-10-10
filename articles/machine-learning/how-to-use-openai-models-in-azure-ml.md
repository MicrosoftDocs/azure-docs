---
title: How to use Azure OpenAI models in Azure Machine Learning
titleSuffix: Azure Machine Learning
description:  Use Azure OpenAI models in Azure Machine Learning
ms.author: swatig
author: swatig007
ms.reviewer: ssalgado
ms.date: 10/12/2023
ms.service: machine-learning
ms.subservice: training
ms.topic: how-to
---

# How to use Azure OpenAI models in Azure Machine Learning (Preview)

> [!IMPORTANT]
> Items marked (preview) in this article are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this article, you learn how to discover, finetune and deploy Azure OpenAI models at scale, using Azure Machine Learning. 

## Prerequisites
- [You must have access](../ai-services/openai/overview.md#how-do-i-get-access-to-azure-openai) to the Azure OpenAI Service
- You must be in an Azure OpenAI service [supported region](../ai-services/openai/concepts/models.md#model-summary-table-and-region-availability)

## What is OpenAI Models in Azure Machine Learning?
In recent years, advancements in AI have led to the rise of large foundation models that are trained on a vast quantity of data. These models can be easily adapted to a wide variety of applications across various industries. This emerging trend gives rise to a unique opportunity for enterprises to build and use these foundation models in their deep learning workloads.

**OpenAI Models in AzureML** provides Azure Machine Learning native capabilities that enable customers to build and operationalize OpenAI models at scale:

- Accessing [Azure OpenAI](../ai-services/openai/overview.md) in Azure Machine Learning, made available in the Azure Machine Learning Model catalog
- Make connection with the Azure OpenAI service
- Finetuning Azure OpenAI Models with Azure Machine Learning
- Deploying Azure OpenAI Models with Azure Machine Learning to the Azure OpenAI service

## Access Azure OpenAI models in Azure Machine Learning
The model catalog (preview) in Azure Machine Learning studio is your starting point to explore various collections of foundation models. The Azure OpenAI models collection is a collection of models, exclusively available on Azure. These models enable customers to access prompt engineering, finetuning, evaluation, and deployment capabilities for large language models available in Azure OpenAI Service. You can view the complete list of supported OpenAI models in the [model catalog](https://ml.azure.com/model/catalog), under the `Azure OpenAI Service` collection.

> [!TIP] 
>Supported OpenAI models are published to the AzureML Model Catalog. View a complete list of [Azure OpenAI models](../ai-services/openai/concepts/models.md).

:::image type="content" source="./media/how-to-use-openai-models-in-azure-ml/model-catalog.png" lightbox="./media/how-to-use-openai-models-in-azure-ml/model-catalog.png" alt-text="Screenshot showing the Azure OpenAI models collection in the model catalog.":::

You can filter the list of models in the model catalog by inference task, or by finetuning task. Select a specific model name and see the model card for the selected model, which lists detailed information about the model. For example:

:::image type="content" source="./media/how-to-use-openai-models-in-azure-ml/model-card-turbo.png" lightbox="./media/how-to-use-openai-models-in-azure-ml/model-card-turbo.png" alt-text="Screenshot showing the Azure OpenAI model card in the Azure Machine Learning model catalog.":::



### Connect to Azure OpenAI service
In order to deploy an Azure OpenAI model, you need to have an [Azure OpenAI resource](https://azure.microsoft.com/products/cognitive-services/openai-service/). You can create an Azure OpenAI resource following the instructions [here](../ai-services/openai/how-to/create-resource.md).

### Deploying Azure OpenAI models
To deploy an Azure Open Model from Azure Machine Learning, in order to deploy an Azure OpenAI model: 

1. Select on **Model Catalog** in the left pane.
1. Select a model to deploy
1. Select `Deploy` to deploy the model to the Azure OpenAI service.

    :::image type="content" source="./media/how-to-use-openai-models-in-azure-ml/deploy-to-azure-open-ai-turbo.png" lightbox="./media/how-to-use-openai-models-in-azure-ml/deploy-to-azure-open-ai-turbo.png" alt-text="Screenshot showing the deploy to Azure OpenAI.":::

1. Select on **Azure OpenAI resource** from the options
1. Provide a name for your deployment in **Deployment Name** and select **Deploy**.
1. The find the models deployed to Azure OpenAI service, go to the **Endpoint** section in your workspace.
1. Select the **Azure OpenAI** tab and find the deployment you created. When you select the deployment, you'll be redirect to the OpenAI resource that is linked to the deployment.

> [!NOTE]  
> Azure Machine Learning will automatically deploy [all base Azure OpenAI models](../ai-services/openai/concepts/models.md) for you so you can using interact with the models when getting started.

## Finetune Azure OpenAI models using your own training data

In order to improve model performance in your workload, you might want to fine tune the model using your own training data. You can easily finetune these models by using either the finetune settings in the studio or by using the code based samples in this tutorial.
		
### Finetune using the studio
You can invoke the finetune settings form by selecting on the **Finetune** button on the model card for any foundation model. 

**Finetune Settings:**

:::image type="content" source="./media/how-to-use-openai-models-in-azure-ml/finetune-turbo.png" lightbox="./media/how-to-use-openai-models-in-azure-ml/finetune-turbo.png" alt-text="Screenshot showing the finetune settings options in the OpenAI models finetune settings form.":::


**Training Data**
    
1. Pass in the training data you would like to use to finetune your model. You can choose to either upload a local file (in JSONL format) or select an existing registered dataset from your workspace. 
For models with completion task type, the training data you use must be formatted as a JSON Lines (JSONL) document in which each line represents a single prompt-completion pair. 

:::image type="content" source="./media/how-to-use-openai-models-in-azure-ml/finetune-training-data.png" lightbox="./media/how-to-use-openai-models-in-azure-ml/finetune-training-data.png" alt-text="Screenshot showing the training data in the finetune UI section.":::

For models with chat task type, each row in the dataset should be a list of JSON objects. Each row corresponds to a conversation and each object in the row is a turn/utterance in the conversation.

:::image type="content" source="./media/how-to-use-openai-models-in-azure-ml/finetune-training-data-chat.png" lightbox="./media/how-to-use-openai-models-in-azure-ml/finetune-training-data-chat.png" alt-text="Screenshot showing the training data after the data is uploaded into Azure.":::

* Validation data: Pass in the data you would like to use to validate your model. Selecting **Automatic split** reserves an automatic split of training data for validation. Alternatively, you can provide a different validation dataset.

1. Select **Finish** in the finetune form to submit your finetuning job. Once the job completes, you can view evaluation metrics for the finetuned model. You can then deploy this finetuned model to an endpoint for inferencing.

**Customizing finetuning parameters:**

If you would like to customize the finetuning parameters, you can select on the Customize button in the Finetune wizard to configure parameters such as batch size, number of epochs and learning rate multiplier. Each of these settings has default values, but can be customized via code based samples, if needed.

:::image type="content" source="./media/how-to-use-openai-models-in-azure-ml/finetune-parameters.png" alt-text="Screenshot showing the finetune parameters in the finetune ui section.":::

**Deploying finetuned models:**
To run a deploy fine-tuned model job from Azure Machine Learning, in order to deploy finetuned an Azure OpenAI model:

1. After you have finished finetuning an Azure OpenAI model
1. Find the registered model in **Models** list with the name provided during finetuning and select the model you want to deploy.
1. Select the **Deploy** button and give the deployment name. The model is deployed to the default Azure OpenAI resource linked to your workspace.

### Finetuning using code based samples
To enable users to quickly get started with code based finetuning, we have published samples (both Python notebooks and CLI examples) to the azureml-examples gut repo - 
* [SDK example](https://github.com/Azure/azureml-examples/tree/main/sdk/python/foundation-models/azure_openai)
* [CLI example](https://github.com/Azure/azureml-examples/tree/main/cli/foundation-models/azure_openai)

### Troubleshooting
Here are some steps to help you resolve any of the following issues with your Azure OpenAI in Azure Machine Learning experience.

You might receive any of the following errors when you try to deploy an Azure OpenAI model.

- **Only one deployment can be made per model name and version**
    - **Fix**: You'll need to go to the [Azure OpenAI Studio](https://oai.azure.com/portal) and delete the deployments of the model you're trying to deploy.  

- **Failed to create deployment**
    - **Fix**: Azure OpenAI failed to create. This is due to Quota issues, make sure you have enough quota for the deployment.

- **Failed to fetch Azure OpenAI deployments**
    - **Fix**: Unable to create the resource. Due to one of, the following reasons. You aren't in correct region, or you have exceeded the maximum limit of three Azure OpenAI resources. You need to delete an existing Azure OpenAI resource or you need to make sure you created a workspace in one of the [supported regions](../ai-services/openai/concepts/models.md#model-summary-table-and-region-availability).

- **Failed to get Azure OpenAI resource**
    - **Fix**: Unable to create the resource. Due to one of, the following reasons. You aren't in correct region, or you have exceeded the maximum limit of three Azure OpenAI resources. You need to delete an existing Azure OpenAI resource or you need to make sure you created a workspace in one of the [supported regions](../ai-services/openai/concepts/models.md#model-summary-table-and-region-availability).

- **Failed to get Azure OpenAI resource**
    - **Fix**: Unable to create the resource. Due to one of, the following reasons. You aren't in correct region, or you have exceeded the maximum limit of three Azure OpenAI resources. You need to delete an existing Azure OpenAI resource or you need to make sure you created a workspace in one of the [supported regions](../ai-services/openai/concepts/models.md#model-summary-table-and-region-availability).

- **Model Not Deployable**
    - **Fix**: This usually happens while trying to deploy a GPT-4 model. Due to high demand you need to [apply for access to use GPT-4 models](/azure/ai-services/openai/concepts/models#gpt-4-models).

- **Resource Create Failed**
    - **Fix**: We tried to automatically create the Azure OpenAI resource but the operation failed. Try again on a new workspace.

## Next steps

[How to use foundation models](how-to-use-foundation-models.md)
