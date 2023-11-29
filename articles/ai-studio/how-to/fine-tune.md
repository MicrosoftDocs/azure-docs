---
title: Fine-tuning Models in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article introduces foundation model capabilities and the model catalog in Azure AI Studio.
author: shwinne
manager: nbabar
ms.service: azure-ai-services
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 11/29/2023
ms.author: eur
---

# Fine-tuning Models in Azure AI Studio

Fine-tuning in machine learning is a technique that involves adjusting a pre-trained model's parameters to adapt it to a specific task. This process is particularly useful because it leverages the knowledge and representations learned by the pre-trained model from a more extensive and diverse dataset.
By fine-tuning, the model can be specialized or adapted to perform better on a task-specific problem thus significantly boosting the performance of machine learning models, making them more accurate and efficient.

## Why fine-tune a model?
Fine-tuning provides significant value by enabling customization and optimization for specific tasks and applications. It leads to improved performance, cost efficiency, reduced latency, and tailored outputs.

## In this article we will talk about:
-	Models supported for fine-tuning
-	How to fine-tune Llama and Azure OpenAI models from the model library in AI Studio
-	Prepping your data for fine-tuning
-	How to deploy the fine-tuned models and leverage it in the playground and prompt flow
-	Pricing for fine-tuning Azure OpenAI and Llama models
-	Fine-tuning best practices
-	Cleaning up fine-tuned models

## Prerequisites for fine-tuning Azure OpenAI models 

1. An Azure subscription. [Create one for free](https://azure.microsoft.com/free/cognitive-services).
2. Access granted to Azure OpenAI in the desired Azure subscription.
An Azure OpenAI resource that's located in a region that supports fine-tuning of the Azure OpenAI model.
Check the [Model summary table and region availability](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models#fine-tuning-models-preview) for the list of available models by region and supported functionality.
For more information, see [Create a resource and deploy a model with Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/create-resource).
4. Fine-tuning access requires Cognitive Services OpenAI Contributor.
5. If you do not already have access to view quota, and deploy models in Azure OpenAI Studio you will require [additional permissions](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/role-based-access-control).
6. Additional information: [Customize a model with Azure OpenAI Service - Azure OpenAI | Microsoft Learn](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/fine-tuning?tabs=turbo&pivots=programming-language-studio#prerequisites)

## Models

The following models will be supported from AI Studio for fine-tuning:

**Llama models supported**: Llama-2-70b, Llama-2-7b and Llama-2-13b

**Open AI models supported**: Babbage-002, Davinci-002, and GPT-35-Turbo
> **_NOTE:_**
Fine-tuning of Open AI models (Babbage-002, Davinci-002, and gpt-35-turbo-0613) are currently supported in projects located in **North Central US or Sweden Central regions**.  Consult the [models page](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models#fine-tuning-models-preview) to check which regions currently support fine-tuning.
Fine-tuning of Llama models (Llama-2-70b, Llama-2-7b and Llama-2-13b) are currently supported in projects located in **WestUS3**.

# Fine-tune a Model from the Model Library in AI Studio 

## Steps:
1.	Ensure you are signed in with your credentials
2.	In the AI Studio, navigate to the Explore tab. Select “Catalog” from the Models tab.
   ![Model Catalog!](../media/finetune/modelcatalog.png)
3. Choose the base model that you will like to fine-tune and select the "Fine-tune" button. Your choice influences both the performance and the cost of your model.
    ![Base Model!](../media/finetune/basemodel.png)
5. Create a new project or select an existing project to fine-tune your model. Ensure that you select a project in a supported region for the model you would like to fine-tune.
6. Input the fine-tune model name and the optional tags and description.
7. Prepare your training and validation data to fine-tune your model.  Your training data and validation data sets consist of input and output examples for how you would like the model to perform.
Make sure all your training examples follow the expected format for inference. To fine-tune models effectively, ensure a balanced and diverse dataset.
This involves maintaining data balance, including various scenarios, and periodically refining training data to align with real-world expectations, ultimately leading to more accurate and balanced
model responses.
    ![Training Data!](../media/finetune/trainingdata.png)

### Data Preparation

# [gpt-35-turbo 0613](#tab/turbo)

The training and validation data you use **must** be formatted as a JSON Lines (JSONL) document. For `gpt-35-turbo-0613` the fine-tuning dataset must be formatted in the conversational format that is used by the [Chat completions](../how-to/chatgpt.md) API.

If you would like a step-by-step walk-through of fine-tuning a `gpt-35-turbo-0613` please refer to the [Azure OpenAI fine-tuning tutorial](../tutorials/fine-tune.md)

### Example file format

```json
{"messages": [{"role": "system", "content": "You are an Xbox customer support agent whose primary goal is to help users with issues they are experiencing with their Xbox devices. You are friendly and concise. You only provide factual answers to queries, and do not provide answers that are not related to Xbox."}, {"role": "user", "content": "Is Xbox better than PlayStation?"}, {"role": "assistant", "content": "I apologize, but I cannot provide personal opinions. My primary job is to assist you with any issues related to your Xbox device. Do you have any Xbox-related issues that need addressing?"}]}
{"messages": [{"role": "system", "content": "You are an Xbox customer support agent whose primary goal is to help users with issues they are experiencing with their Xbox devices. You are friendly and concise. You only provide factual answers to queries, and do not provide answers that are not related to Xbox."}, {"role": "user", "content": "Can I play PC games on my Xbox?"}, {"role": "assistant", "content": "While Xbox consoles don't natively support PC games, they can play an array of Xbox games, many of which are also available on PC. Can I assist you with finding games compatible with your Xbox device?"}]}
{"messages": [{"role": "system", "content": "You are an Xbox customer support agent whose primary goal is to help users with issues they are experiencing with their Xbox devices. You are friendly and concise. You only provide factual answers to queries, and do not provide answers that are not related to Xbox."}, {"role": "user", "content": "I'm having trouble connecting my Xbox to the Wi-Fi."}, {"role": "assistant", "content": "No worries, let's go through the network settings on your Xbox. Can you please tell me what happens when you try to connect it to the Wi-Fi?"}]}
```

In addition to the JSONL format, training and validation data files must be encoded in UTF-8 and include a byte-order mark (BOM). The file must be less than 100 MB in size.

### Create your training and validation datasets

The more training examples you have, the better. The minimum number of training examples is 10, but such a small number of examples is often not enough to noticeably influence model responses. OpenAI states it's best practice to have at least 50 high quality training examples. However, it is entirely possible to have a use case that might require 1,000's of high quality training examples to be successful.

In general, doubling the dataset size can lead to a linear increase in model quality. But keep in mind, low quality examples can negatively impact performance. If you train the model on a large amount of internal data, without first pruning the dataset for only the highest quality examples you could end up with a model that performs much worse than expected.

See here to learn how to prep your training and validation data when fine-tuning Azure OpenAI models 
•	Customize a model with Azure OpenAI Service - Azure OpenAI | Microsoft Learn
•	How to use Azure OpenAI models in Azure Machine Learning - Azure Machine Learning | Microsoft Learn


# [babbage-002/davinci-002](#tab/completionfinetuning)

The training and validation data you use **must** be formatted as a JSON Lines (JSONL) document in which each line represents a single prompt-completion pair. The OpenAI command-line interface (CLI) includes [a data preparation tool](#openai-cli-data-preparation-tool) that validates, gives suggestions, and reformats your training data into a JSONL file ready for fine-tuning.

```json
{"prompt": "<prompt text>", "completion": "<ideal generated text>"}
{"prompt": "<prompt text>", "completion": "<ideal generated text>"}
{"prompt": "<prompt text>", "completion": "<ideal generated text>"}
```

In addition to the JSONL format, training and validation data files must be encoded in UTF-8 and include a byte-order mark (BOM). The file must be less than 100 MB in size. 

### Create your training and validation datasets

Designing your prompts and completions for fine-tuning is different from designing your prompts for use with any of [our GPT-3 base models](../concepts/legacy-models.md#gpt-3-models). Prompts for completion calls often use either detailed instructions or few-shot learning techniques, and consist of multiple examples. For fine-tuning, each training example should consist of a single input prompt and its desired completion output. You don't need to give detailed instructions or multiple completion examples for the same prompt.

The more training examples you have, the better. The minimum number of training examples is 10, but such a small number of examples is often not enough to noticeably influence model responses. OpenAI states it's best practice to have at least 50 high quality training examples. However, it is entirely possible to have a use case that might require 1,000's of high quality training examples to be successful.

In general, doubling the dataset size can lead to a linear increase in model quality. But keep in mind, low quality examples can negatively impact performance. If you train the model on a large amount of internal data, without first pruning the dataset for only the highest quality examples you could end up with a model that performs much worse than expected.

See here to learn how to prep your training and validation data when fine-tuning Azure OpenAI models 
•	Customize a model with Azure OpenAI Service - Azure OpenAI | Microsoft Learn
•	How to use Azure OpenAI models in Azure Machine Learning - Azure Machine Learning | Microsoft Learn


# [Llama-2-70b, Llama-2-7b and Llama-2-13b](#tab/Llamamodelfinetuning)

Single text classification requires the training data to include at least 2 fields – one for ‘Sentence1’ and ‘Label’ like in this example. Sentence 2 can be left blank in this case. Text pair classification, where you have two sentences to be classified (e.g., sentence entailment) will need the training data to have 3 fields – for ‘Sentence1’, ‘Sentence2’ and ‘Label’. The supported file types are csv, tsv, and JSON Lines. Files will be uploaded to the default datastore and made available in your project.

8. Task parameters is an optional step and an advanced option- Tuning hyperparameters is essential for optimizing Large Language Models (LLMs) in real-world applications. It allows for improved performance and efficient resource usage. 
The default settings can be used or advanced users can customize parameters like epochs or learning rate.

9.Review your selections and train your model.

10.Check the status of your model in “Fine-tuning” page under the “Build” tab. In the Fine-tuning page you can find your fine-tuned models, the status and more information about your fine-tuned model.

 ![Finetuning page!](../media/finetune/finetuningpage.png)

 11. You can also fine-tune models from the “Fine-tuning” page. Select the “Fine-tune model” button and select the base model that you would like to fine-tune.

## Deploying Fine-Tuned Models
Once your model is finetuned, you can deploy the model and can use it in your own application, in the playground or in prompt flow. When you deploy the model,
you make the model available for inferencing, but that incurs an hourly hosting charge. Fine-tuned models, however, can be stored in the project until you're ready to use them (at no cost for Azure OpenAI models)

## Steps
1. When the fine-tuning is complete, select your model to see the metrics and more details about your model’s performance. Once the model’s performance is satisfactory, you can then deploy this model.
2. In the model details page, select “Deploy” to deploy your fine-tuned model.
    ![Deploy Model!](../media/finetune/deploymodel.png)
3. Fill out the deployment requirements to deploy the model. For Azure OpenAI fine-tuned models, content safety is on by default and requires review/approval to turn it off:  [How to use content filters (preview) with Azure OpenAI Service - Azure OpenAI | Microsoft Learn](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/content-filters)
4. For more information on AOAI limits on the number of deployments or tokens per minute see [here](https://learn.microsoft.com/en-us/azure/ai-services/openai/quotas-limits)

## Pricing
For more information on Azure OpenAI pricing, see [Azure OpenAI Service - Pricing](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/)

## Fine-tuning Best Practices
-	[Introducing GPT 3.5 Turbo, Babbage-002 and Davinci-002 Fine-tuning in AzureML Model Library - Microsoft Community Hub](https://techcommunity.microsoft.com/t5/ai-machine-learning-blog/introducing-gpt-3-5-turbo-babbage-002-and-davinci-002-fine/ba-p/3954478)
-	[Fine Tuning: now available with Azure OpenAI Service - Microsoft Community Hub](https://techcommunity.microsoft.com/t5/ai-machine-learning-blog/introducing-gpt-3-5-turbo-babbage-002-and-davinci-002-fine/ba-p/3954478)

## Cleaning up your fine-tuned models 
You can delete a fine-tuned model from the Fine-tuning model list in AI Studio or from the model details page. Select the fine-tuned model to delete from the Fine-tuning page, and then select the Delete button to delete the fine-tuned model.
**Note:** You can't delete a custom model if it has an existing deployment. You must first **delete your model deployment** before you can delete your custom model.
![Delete Model!](../media/finetune/deletemodel.png)

