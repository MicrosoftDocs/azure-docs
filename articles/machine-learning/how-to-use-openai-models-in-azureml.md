---
title: How to use Azure OpenAI models in Azure Machine Learning
titleSuffix: Azure Machine Learning
description:  Use Azure OpenAI models in Azure Machine Learning
ms.author: swatig
author: swatig007
ms.reviewer: ssalgado
ms.date: 06/30/2023
ms.service: machine-learning
ms.subservice: training
ms.topic: how-to
ms.custom: 
ms.devlang: 
---

# How to use Azure OpenAI models in Azure Machine Learning (Preview)

> [!IMPORTANT]
> Items marked (preview) in this article are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this article, you learn how to discover, finetune and deploy Azure Open AI models at scale, using Azure Machine Learning. 

## How to access Azure OpenAI models in Azure Machine Learning
The model catalog (preview) in Azure Machine learning Studio is your starting point to explore various collections of foundation models. The Azure Open AI models collection is a collection of models, exclusively available on Azure, that enables customers to access prompt engineering, finetuning, evaluation, and deployment capabilities for large language models available in Azure OpenAI Service. You can view the complete list of supported OpenAI models in the [model catalog](https://ml.azure.com/model/catalog), under the `Azure OpenAI Service` collection.

:::image type="content" source="./media/how-to-use-openai-models-in-azureml/aoaiModelCatalog.png" alt-text="Screenshot showing the Azure OpenAI models collection in the model catalog.":::

You can filter the list of models in the model catalog by inference task, or by finetuning task. Select a specific model name and see the model card for the selected model, which lists detailed information about the model. For example:

:::image type="content" source="./media/how-to-use-openai-models-in-azureml/aoaiModelCard.png" alt-text="Screenshot showing the Azure OpenAI model card in the AzureML model catalog.":::

> [!NOTE] 
>Use of Azure OpenAI models in Azure Machine Learning requires Azure OpenAI services resources. You can request access to Azure OpenAI service [here](https://go.microsoft.com/fwlink/?linkid=2222006&clcid=0x409).

## How to finetune Azure OpenAI models using your own training data

In order to improve model performance in your workload, you might want to fine tune the model using your own training data. You can easily finetune these models by using either the finetune settings in the studio or by using the code based samples linked below.
		
### Finetune using the studio
You can invoke the finetune settings form by selecting on the **Finetune** button on the model card for any foundation model. 

**Finetune Settings:**

:::image type="content" source="./media/how-to-use-openai-models-in-azureml/aoaiFinetune.png" alt-text="Screenshot showing the finetune settings options in the OpenAI models finetune settings form.":::


**Training Data**
    
1. Pass in the training data you would like to use to finetune your model. You can choose to either upload a local file (in JSONL format) or select an existing registered dataset from your workspace. The dataset needs to have two fields - prompt and completion.

:::image type="content" source="./media/how-to-use-openai-models-in-azureml/aoaiFinetuneTrainingData.png" alt-text="Screenshot showing the training data in the finetune wizard.":::


* Validation data: Pass in the data you would like to use to validate your model. Selecting **Automatic split** reserves an automatic split of training data for validation. Alternatively, you can provide a different validation dataset.
* Test data: Pass in the test data you would like to use to evaluate your finetuned model. Selecting **Automatic split** reserves an automatic split of training data for test. 

3. Select **Finish** in the finetune form to submit your finetuning job. Once the job completes, you can view evaluation metrics for the finetuned model. You can then deploy this finetuned model to an endpoint for inferencing.

**Customizing finetuning parameters:**

If you would like to customize the finetuning parameters, you can click on the Customize button in the Finetune wizard to configure parameters such as batch size, number of epochs, learning rate multiplier, etc. Each of these settings has default values, but can be customized via code based samples, if needed.

:::image type="content" source="./media/how-to-use-openai-models-in-azureml/aoaiFinetuneParameters.png" alt-text="Screenshot showing the finetune parameters in the finetune wizard.":::

**Deploying finetuned models:**

### Finetuning using code based samples


## How to deploy Azure OpenAI models to endpoints for inferencing

## Next steps
