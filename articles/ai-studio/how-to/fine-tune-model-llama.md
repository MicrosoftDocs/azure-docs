---
title: Fine-tune a Llama 2 model in Azure AI Studio
titleSuffix: Azure AI Studio
description: Learn how to fine-tune a Llama 2 model in Azure AI Studio.
manager: nitinme
ms.service: azure-ai-studio
ms.topic: how-to
ms.date: 12/11/2023
ms.reviewer: eur
ms.author: mopeakande
author: msakande
ms.custom: references_regions
---

# Fine-tune a Llama 2 model in Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

Azure AI Studio lets you tailor large language models to your personal datasets by using a process known as *fine-tuning*. 

Fine-tuning provides significant value by enabling customization and optimization for specific tasks and applications. It leads to improved performance, cost efficiency, reduced latency, and tailored outputs.

In this article, you learn how to fine-tune Llama 2 models in [Azure AI Studio](https://ai.azure.com).

The [Llama 2 family of large language models (LLMs)](./deploy-models-llama.md) is a collection of pretrained and fine-tuned generative text models ranging in scale from 7 billion to 70 billion parameters. The model family also includes fine-tuned versions optimized for dialogue use cases with Reinforcement Learning from Human Feedback (RLHF), called Llama-2-chat.

## Models

The following Llama 2 family models are supported in Azure AI Studio for fine-tuning:

- `Llama-2-70b`
- `Llama-2-7b`
- `Llama-2-13b`

Fine-tuning of Llama 2 models is currently supported in projects located in West US 3.

## Prerequisites

### Subscription provider registration

Verify the subscription is registered to the `Microsoft.Network` resource provider.
1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Subscriptions** from the left menu.
1. Select the subscription you want to use.
1. Select **Settings** > **Resource providers** from the left menu.
1. Confirm that **Microsoft.Network** is in the list of resource providers. Otherwise add it.

    :::image type="content" source="../media/how-to/fine-tune/llama/subscription-resource-providers.png" alt-text="Screenshot of subscription resource providers in Azure portal." lightbox="../media/how-to/fine-tune/llama/subscription-resource-providers.png":::

### Data preparation

Prepare your training and validation data to fine-tune your model. Your training data and validation data sets consist of input and output examples for how you would like the model to perform.

Make sure all your training examples follow the expected format for inference. To fine-tune models effectively, ensure a balanced and diverse dataset.

This involves maintaining data balance, including various scenarios, and periodically refining training data to align with real-world expectations, ultimately leading to more accurate and balanced
model responses.

Here are some example datasets on Hugging Face that you can use to fine-tune your model:
- [dair-ai/emotion](https://huggingface.co/datasets/dair-ai/emotion)

    :::image type="content" source="../media/how-to/fine-tune/dataset-dair-ai-emotion.png" alt-text="Screenshot of example emotion data on Hugging Face." lightbox="../media/how-to/fine-tune/dataset-dair-ai-emotion.png":::

- [SetFit/mrpc](https://huggingface.co/datasets/SetFit/mrpc)

    :::image type="content" source="../media/how-to/fine-tune/dataset-setfit-mrpc.png" alt-text="Screenshot of example Microsoft Research Paraphrase Corpus (MRPC) data on Hugging Face." lightbox="../media/how-to/fine-tune/dataset-setfit-mrpc.png":::

Single text classification requires the training data to include at least two fields such as `text1` and `label`. Text pair classification requires the training data to include at least three fields such as `text1`, `text2`, and `label`. 

The supported file types are csv, tsv, and JSON Lines. Files are uploaded to the default datastore and made available in your project.

## Fine-tune a Llama 2 model

You can fine-tune a Llama 2 model in Azure AI Studio via the [model catalog](./model-catalog.md) or from your existing project. 

To fine-tune a Llama 2 model in an existing Azure AI Studio project, follow these steps:

1. Sign in to [Azure AI Studio](https://ai.azure.com) and select your project from the **Build** page. If you don't have a project already, first create a project.

1. From the collapsible left menu, select **Fine-tuning**.
1. If this is the first time you deployed the model in the project, you have to sign up your project for the particular offering from the Azure Marketplace. Each project has its own connection to the marketplace's offering, which, allows you to control and monitor spending per project. Select **Continue to fine-tune**.

    > [!NOTE]
    > Subscribing a project to a particular offering from the Azure Marketplace requires **Contributor** or **Owner** access at the subscription level where the project is created. 

    :::image type="content" source="../media/how-to/fine-tune/llama/llama-pay-as-you-go-overview.png" alt-text="Screenshot of pay-as-you-go marketplace overview." lightbox="../media/how-to/fine-tune/llama/llama-pay-as-you-go-overview.png":::

1. Choose a base model to fine-tune and select **Confirm**. Your choice influences both the performance and the cost of your model.

    :::image type="content" source="../media/how-to/fine-tune/llama/fine-tune-select-model.png" alt-text="Screenshot of option to select a model to fine-tune." lightbox="../media/how-to/fine-tune/llama/fine-tune-select-model.png":::

1. Enter a name for your fine-tuned model and the optional tags and description.
1. Select training data to fine-tune your model. See [data preparation](#data-preparation) for more information.

    Make sure all your training examples follow the expected format for inference. To fine-tune models effectively, ensure a balanced and diverse dataset. This involves maintaining data balance, including various scenarios, and periodically refining training data to align with real-world expectations, ultimately leading to more accurate and balanced model responses.
    - The batch size to use for training. When set to -1, batch_size is calculated as 0.2% of examples in training set and the max is 256.
    - The fine-tuning learning rate is the original learning rate used for pretraining multiplied by this multiplier. We recommend experimenting with values between 0.5 and 2. Empirically, we've found that larger learning rates often perform better with larger batch sizes. Must be between 0.0 and 5.0.
    - Number of training epochs. An epoch refers to one full cycle through the data set. If set to -1, number of epochs will be determined dynamically based on the input data.

1. Task parameters are an optional step and an advanced option- Tuning hyperparameter is essential for optimizing large language models (LLMs) in real-world applications. It allows for improved performance and efficient resource usage. The default settings can be used or advanced users can customize parameters like epochs or learning rate.

1. Review your selections and proceed to train your model.

Check the status of your model in "Fine-tuning" page under the "Build" tab. In the Fine-tuning page you can find your fine-tuned models, the status and more information about your fine-tuned model.

Once your model is fine-tuned, you can deploy the model and can use it in your own application, in the playground, or in prompt flow. For more information, see [How to deploy Llama 2 family of large language models with Azure AI Studio](./deploy-models-llama.md).

## Cleaning up your fine-tuned models 

You can delete a fine-tuned model from the fine-tuning model list in [Azure AI Studio](https://ai.azure.com) or from the model details page. Select the fine-tuned model to delete from the Fine-tuning page, and then select the Delete button to delete the fine-tuned model.

>[!NOTE]
> You can't delete a custom model if it has an existing deployment. You must first delete your model deployment before you can delete your custom model.

## Next steps

- [Learn more about Azure AI Studio](../what-is-ai-studio.md)
