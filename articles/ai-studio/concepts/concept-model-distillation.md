---
title: Distillation in AI Studio
titleSuffix: Azure AI Studio
description: Learn how to do distillation in Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.topic: how-to
ms.date: 07/23/2024
ms.reviewer: vkann
reviewer: anshirga
ms.author: ssalgado
author: ssalgadodev
ms.custom: references_regions
---

# Distillation in Azure AI Studio

In Azure AI Studio, you can use distillation to efficiently train a student model.

## What is distillation?

In machine learning, distillation is a technique for transferring knowledge from a large, complex model (often called the *teacher model*) to a smaller, simpler model (the *student model*). This process helps the smaller model achieve similar performance to the larger one while being more efficient in terms of computation and memory usage.

## Distillation steps

The main steps in knowledge distillation are:

1. Use the teacher model to generate predictions for the dataset.

1. Train the student model by using these predictions, along with the original dataset, to mimic the teacher model's behavior.

## Sample notebook

You can use the [sample notebook](https://aka.ms/meta-llama-3.1-distillation) to see how to perform distillation. In this sample notebook, the teacher model uses the Meta Llama 3.1 405B instruction model, and the student model uses the Meta Llama 3.1 8B instruction model.

We used an advanced prompt during synthetic data generation. The advanced prompt incorporates chain-of-thought (CoT) reasoning, which results in higher-accuracy data labels in the synthetic data. This labeling further improves the accuracy of the distilled model.

## Related content

- [What is Azure AI Studio?](../what-is-ai-studio.md)
- [Deploy Meta Llama 3.1 models with Azure AI Studio](../how-to/deploy-models-llama.md)
- [Azure AI Studio FAQ](../faq.yml)
