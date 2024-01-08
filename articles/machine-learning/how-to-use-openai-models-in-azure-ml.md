---
title: Use Azure OpenAI models in Azure Machine Learning
titleSuffix: Azure Machine Learning
description: Learn how to use Azure OpenAI models in Azure Machine Learning.
ms.author: marouzba
author: MahsaRouzbahman
ms.reviewer: ssalgado
ms.date: 12/12/2023
ms.service: machine-learning
ms.subservice: training
ms.topic: how-to
---

# Use Azure OpenAI models in Azure Machine Learning (preview)

> [!IMPORTANT]
> Items marked (preview) in this article are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this article, you learn how to discover, fine-tune, and deploy Azure OpenAI models at scale by using Azure Machine Learning.

## Prerequisites

- [You must have access](../ai-services/openai/overview.md#how-do-i-get-access-to-azure-openai) to Azure OpenAI Service.
- You must be in an Azure OpenAI [supported region](../ai-services/openai/concepts/models.md#model-summary-table-and-region-availability).

## What are OpenAI models in Azure Machine Learning?

OpenAI models in Machine Learning provide Machine Learning native capabilities that enable customers to build and use Azure OpenAI models at scale by:

- Accessing [Azure OpenAI](../ai-services/openai/overview.md) in Machine Learning, which is made available in the Machine Learning model catalog.
- Making a connection with Azure OpenAI.
- Fine-tuning Azure OpenAI models with Machine Learning.
- Deploying Azure OpenAI models with Machine Learning to Azure OpenAI.

## Access Azure OpenAI models in Machine Learning

The model catalog in Azure Machine Learning studio is your starting point to explore various collections of foundation models. The Azure OpenAI models collection consists of models that are exclusively available on Azure. These models enable customers to access prompt engineering, fine-tuning, evaluation, and deployment capabilities for large language models that are available in Azure OpenAI. You can view the complete list of supported Azure OpenAI models in the [model catalog](https://ml.azure.com/model/catalog) under the **Azure OpenAI Service** collection.

> [!TIP]
>Supported Azure OpenAI models are published to the Machine Learning model catalog. You can view a complete list of [Azure OpenAI models](../ai-services/openai/concepts/models.md).

:::image type="content" source="./media/how-to-use-openai-models-in-azure-ml/model-catalog.png" lightbox="./media/how-to-use-openai-models-in-azure-ml/model-catalog.png" alt-text="Screenshot that shows the Azure OpenAI models collection in the model catalog.":::

You can filter the list of models in the model catalog by inference task or by fine-tuning task. Select a specific model name and see the model card for the selected model, which lists detailed information about the model.

:::image type="content" source="./media/how-to-use-openai-models-in-azure-ml/model-card-turbo.png" lightbox="./media/how-to-use-openai-models-in-azure-ml/model-card-turbo.png" alt-text="Screenshot that shows the Azure OpenAI model card in the Machine Learning model catalog.":::

### Connect to Azure OpenAI

To deploy an Azure OpenAI model, you need to have an [Azure OpenAI resource](https://azure.microsoft.com/products/cognitive-services/openai-service/). To create an Azure OpenAI resource, follow the instructions in [Create and deploy an Azure OpenAI Service resource](../ai-services/openai/how-to/create-resource.md).

### Deploy Azure OpenAI models

To deploy an Azure OpenAI model from Machine Learning:

1. Select **Model catalog** on the left pane.
1. Select **View Models** under **Azure OpenAI language models**. Then select a model to deploy.
1. Select **Deploy** to deploy the model to Azure OpenAI.

    :::image type="content" source="./media/how-to-use-openai-models-in-azure-ml/deploy-to-azure-open-ai-turbo.png" lightbox="./media/how-to-use-openai-models-in-azure-ml/deploy-to-azure-open-ai-turbo.png" alt-text="Screenshot that shows deploying to Azure OpenAI.":::

1. Select **Azure OpenAI resource** from the options.
1. Enter a name for your deployment in **Deployment Name** and select **Deploy**.
1. To find the models deployed to Azure OpenAI, go to the **Endpoint** section in your workspace.
1. Select the **Azure OpenAI** tab and find the deployment you created. When you select the deployment, you're redirected to the OpenAI resource that's linked to the deployment.

> [!NOTE]
> Machine Learning automatically deploys [all base Azure OpenAI models](../ai-services/openai/concepts/models.md) so that you can interact with the models when you get started.

## Fine-tune Azure OpenAI models by using your own training data

To improve model performance in your workload, you might want to fine-tune the model by using your own training data. You can easily fine-tune these models by using either the fine-tune settings in the studio or the code-based samples in this tutorial.

### Fine-tune by using the studio

To invoke the **Finetune** settings form, select **Finetune** on the model card for any foundation model.

### Finetune settings

:::image type="content" source="./media/how-to-use-openai-models-in-azure-ml/finetune-turbo.png" lightbox="./media/how-to-use-openai-models-in-azure-ml/finetune-turbo.png" alt-text="Screenshot that shows the Finetune settings options on the OpenAI models Finetune settings form.":::

#### Training data

1. Pass in the training data you want to use to fine-tune your model. You can choose to upload a local file in JSON Lines (JSONL) format. Or you can select an existing registered dataset from your workspace.

   - **Models with a completion task type**: The training data you use must be formatted as a JSONL document in which each line represents a single prompt-completion pair.

	  :::image type="content" source="./media/how-to-use-openai-models-in-azure-ml/finetune-training-data.png" lightbox="./media/how-to-use-openai-models-in-azure-ml/finetune-training-data.png" alt-text="Screenshot that shows the training data in the fine-tune UI section.":::

	- **Models with a chat task type**: Each row in the dataset should be a list of JSON objects. Each row corresponds to a conversation. Each object in the row is a turn or utterance in the conversation.

      :::image type="content" source="./media/how-to-use-openai-models-in-azure-ml/finetune-training-data-chat.png" lightbox="./media/how-to-use-openai-models-in-azure-ml/finetune-training-data-chat.png" alt-text="Screenshot that shows the training data after the data is uploaded into Azure.":::

	- **Validation data**: Pass in the data you want to use to validate your model.

1. Select **Finish** on the fine-tune form to submit your fine-tuning job. After the job finishes, you can view evaluation metrics for the fine-tuned model. You can then deploy this fine-tuned model to an endpoint for inferencing.

#### Customize fine-tuning parameters

If you want to customize the fine-tuning parameters, you can select **Customize** in the **Finetune** wizard to configure parameters such as batch size, number of epochs, and learning rate multiplier. Each of these settings has default values but can be customized via code-based samples, if needed.

:::image type="content" source="./media/how-to-use-openai-models-in-azure-ml/finetune-parameters.png" alt-text="Screenshot that shows the fine-tune parameters in the Finetune UI section.":::

#### Deploy fine-tuned models

To run a fine-tuned model job from Machine Learning, in order to deploy an Azure OpenAI model:

1. After you've finished fine-tuning an Azure OpenAI model, find the registered model in the **Models** list with the name provided during fine-tuning and select the model you want to deploy.
1. Select **Deploy** and name the deployment. The model is deployed to the default Azure OpenAI resource linked to your workspace.

### Fine-tuning by using code-based samples

To enable users to quickly get started with code-based fine-tuning, we've published samples (both Python notebooks and Azure CLI examples) to the *azureml-examples* GitHub repo:

* [SDK example](https://github.com/Azure/azureml-examples/tree/main/sdk/python/foundation-models/azure_openai)
* [CLI example](https://github.com/Azure/azureml-examples/tree/main/cli/foundation-models/azure_openai)

### Troubleshooting

Here are some steps to help you resolve any of the following issues with Azure OpenAI in Machine Learning.

You might receive any of the following errors when you try to deploy an Azure OpenAI model:

- **Only one deployment can be made per model name and version**
    - **Fix:** Go to [Azure OpenAI Studio](https://oai.azure.com/portal) and delete the deployments of the model you're trying to deploy.

- **Failed to create deployment**
    - **Fix:** Azure OpenAI failed to create. This error occurs because of quota issues. Make sure you have enough quota for the deployment. The default quota for fine-tuned models is two deployments per customer.

- **Failed to get Azure OpenAI resource**
    - **Fix:** Unable to create the resource. You either aren't in the correct region or you've exceeded the maximum limit of three Azure OpenAI resources. You need to delete an existing Azure OpenAI resource, or you need to make sure you created a workspace in one of the [supported regions](../ai-services/openai/concepts/models.md#model-summary-table-and-region-availability).

- **Model not deployable**
    - **Fix:** This error usually happens while trying to deploy a GPT-4 model. Because of high demand, you need to [apply for access to use GPT-4 models](/azure/ai-services/openai/concepts/models#gpt-4-models).

- **Fine-tuning job failed**
    - **Fix:** Currently, only a maximum of 10 workspaces can be designated for a particular subscription for new fine-tunable models. If a user creates more workspaces, they get access to the models, but their jobs fail. Try to limit the number of workspaces per subscription to 10.

## Learn more

* Explore the [Model Catalog in Azure Machine Learning studio](https://ml.azure.com/model/catalog). You need an [Azure Machine Learning workspace](./quickstart-create-resources.md) to explore the catalog.
* [Evaluate, fine-tune and deploy models](./how-to-use-foundation-models.md) curated by Azure Machine Learning.
