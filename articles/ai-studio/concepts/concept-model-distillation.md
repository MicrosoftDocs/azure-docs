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

In this article
  - [Distillation](#distillation)
  - [Next Steps](#next-steps)

In Azure AI Studio, you can leverage Distillation to efficiently train the student model.

## Distillation

In machine learning, distillation is a technique used to transfer knowledge from a large, complex model (often called the “teacher model”) to a smaller, simpler model (the “student model”). This process helps the smaller model achieve similar performance to the larger one while being more efficient in terms of computation and memory usage.

The main steps in knowledge distillation involve:

- **Using the teacher model** to generate predictions for the dataset.

- **Training the student model** using these predictions, along with the original dataset, to mimic the teacher model’s behavior.
 
You can use the sample notebook available at this [link](https://aka.ms/meta-llama-3.1-distillation) to see how to perform distillation. In this sample notebook, the teacher model used the Meta Llama 3.1 405B Instruct model, and the student model used the Meta Llama 3.1 8B Instruct.

We used an advanced prompt during synthetic data generation, which incorporates Chain of thought (COT) reasoning, resulting in higher accuracy data labels in the synthetic data. This further improves the accuracy of the distilled model.

## Next steps
- [What is Azure AI Studio?](../what-is-ai-studio.md)
- [Learn more about deploying Meta Llama models](../how-to/deploy-models-llama.md)

- [Azure AI FAQ article](../faq.yml)
