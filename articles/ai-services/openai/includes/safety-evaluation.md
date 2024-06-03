---
title: 'Safety evaluation - GPT-4 fine tuning only public preview'
titleSuffix: Azure OpenAI
description: Learn about how to perform fine-tuning with GPT-4 models.
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
ms.date: 05/21/2024
author: mrbullwinkle
ms.author: mbullwin
---

GPT-4 is our most advanced model that can be fine-tuned to your needs. As with Azure OpenAI models generally, the advanced capabilities of fine-tuned models come with increased responsible AI challenges related to harmful content, manipulation, human-like behavior, privacy issues, and more. Learn more about risks, capabilities, and limitations in the [Overview of Responsible AI practices](/legal/cognitive-services/openai/overview?context=%2Fazure%2Fai-services%2Fopenai%2Fcontext%2Fcontext) and [Transparency Note](/legal/cognitive-services/openai/transparency-note?context=%2Fazure%2Fcognitive-services%2Fopenai%2Fcontext%2Fcontext&tabs=text). To help mitigate the risks associated with GPT-4 fine-tuned models, we have implemented additional evaluation steps to help detect and prevent harmful content in the training and outputs of fine-tuned models. These steps are grounded in the [Microsoft Responsible AI Standard](https://www.microsoft.com/ai/responsible-ai) and [Azure OpenAI Service content filtering](/azure/ai-services/openai/concepts/content-filter?tabs=warning%2Cpython-new).

- Evaluations are conducted in dedicated, customer specific, private workspaces;
- Evaluation endpoints are in the same geography as the Azure OpenAI resource;
- Training data is not stored in connection with performing evaluations; only the final model assessment (deployable or not deployable) is persisted; and

GPT-4 fine-tuned model evaluation filters are set to predefined thresholds and cannot be modified by customers; they aren't tied to any custom content filtering configuration you may have created.

### Data evaluation

Before training starts, your data is evaluated for potentially harmful content (violence, sexual, hate, and fairness, self-harm – see category definitions [here](/azure/ai-services/openai/concepts/content-filter?tabs=warning%2Cpython-new#risk-categories)). If harmful content is detected above the specified severity level, your training job will fail, and you'll receive a message informing you of the categories of failure.

**Sample message:**

```output
The provided training data failed RAI checks for harm types: [hate_fairness, self_harm, violence]. Please fix the data and try again.
```

Your training data is evaluated automatically within your data import job as part of providing the fine-tuning capability.

If the fine-tuning job fails due to the detection of harmful content in training data, you won't be charged.

### Model evaluation

After training completes but before the fine-tuned model is available for deployment, the resulting model is evaluated for potentially harmful responses using Azure’s built-in [risk and safety metrics](/azure/ai-studio/concepts/evaluation-metrics-built-in?tabs=warning#risk-and-safety-metrics). Using the same approach to testing that we use for the base large language models, our evaluation capability simulates a conversation with your fine-tuned model to assess the potential to output harmful content, again using specified harmful content [categories](/azure/ai-services/openai/concepts/content-filter?tabs=warning%2Cpython-new#risk-categories) (violence, sexual, hate, and fairness, self-harm).  

If a model is found to generate output containing content detected as harmful at above an acceptable rate, you'll be informed that your model isn't available for deployment, with information about the specific categories of harm detected:

**Sample Message**:

```output
This model is unable to be deployed. Model evaluation identified that this fine tuned model scores above acceptable thresholds for [Violence, Self Harm]. Please review your training data set and resubmit the job.
```

   :::image type="content" source="../media/fine-tuning/failure.png" alt-text="Screenshot of a failed fine-tuning job due to safety evaluation" lightbox="../media/fine-tuning/failure.png":::

As with data evaluation, the model is evaluated automatically within your fine-tuning job as part of providing the fine-tuning capability. Only the resulting assessment (deployable or not deployable) is logged by the service. If deployment of the fine-tuned model fails due to the detection of harmful content in model outputs, you won't be charged for the training run.