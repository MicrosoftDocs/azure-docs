---
title: Concepts - Fine-tuning language models for AI and machine learning workflows
description: Learn about how you can customize language models to use in your AI and machine learning workflows on Azure Kubernetes Service (AKS).
ms.topic: conceptual
ms.date: 07/15/2024
author: schaffererin
ms.author: schaffererin
---

# Concepts - Fine-tuning language models for AI and machine learning workflows

In this article, you learn about fine-tuning [language models][language-models], including some common methods and how applying the tuning results can improve the performance of your AI and machine learning workflows on Azure Kubernetes Service (AKS).

## Pre-trained language models

*Pre-trained language models (PLMs)* offer an accessible way to get started with AI inferencing and are widely used in natural language processing (NLP). PLMs are trained on large-scale text corpora from the internet using deep neural networks and can be fine-tuned on smaller datasets for specific tasks. These models typically consist of billions of parameters, or *weights*, that are learned during the pre-training process.

PLMs can learn universal language representations that capture the statistical properties of natural language, such as the probability of words or sequences of words occurring in a given context. These representations can be transferred to downstream tasks, such as text classification, named entity recognition, and question answering, by fine-tuning the model on task-specific datasets.

### Pros and cons

The following table lists some pros and cons of using PLMs in your AI and machine learning workflows:

| Pros | Cons |
|------|------|
| • Get started quickly with deployment in your machine learning lifecycle. <br> • Avoid heavy compute costs associated with model training. <br> • Reduces the need to store large, labeled datasets. | • Might provide generalized or outdated responses based on pre-training data sources. <br> • Might not be suitable for all tasks or domains. <br> • Performance can vary depending on inferencing context. |

## Fine-tuning methods

### Parameter efficient fine-tuning

*Parameter efficient fine-tuning (PEFT)* is a method for fine-tuning PLMs on relatively small datasets with limited compute resources. PEFT uses a combination of techniques, like additive and selective methods to update weights, to improve the performance of the model on specific tasks. PEFT requires minimal compute resources and flexible quantities of data, making it suitable for low-resource settings. This method retains most of the weights of the original pre-trained model and updates the remaining weights to fit context-specific, labeled data.

### Low rank adaptation

*Low rank adaptation (LoRA)* is a PEFT method commonly used to customize large language models for new tasks. This method tracks changes to model weights and efficiently stores smaller weight matrices that represent only the model's trainable parameters, reducing memory usage and the compute power needed for fine-tuning. LoRA creates fine-tuning results, known as *adapter layers*, that can be temporarily stored and pulled into the model's architecture for new inferencing jobs.

*Quantized low rank adaptation (QLoRA)* is an extension of LoRA that further reduces memory usage by introducing quantization to the adapter layers. For more information, see [Making LLMs even more accessible with bitsandbites, 4-bit quantization, and QLoRA][qlora].

## Experiment with fine-tuning language models on AKS

Kubernetes AI Toolchain Operator (KAITO) is an open-source operator that automates small and large language model deployments in Kubernetes clusters. The AI toolchain operator add-on leverages KAITO to simplify onboarding, save on infrastructure costs, and reduce the time-to-inference for open-source models on an AKS cluster. The add-on automatically provisions right-sized GPU nodes and sets up the associated inference server as an endpoint server to your chosen model.

With KAITO version 0.3.0 or later, you can efficiently fine-tune supported MIT and Apache 2.0 licensed models with the following features:

* Store your retraining data as a container image in a private container registry.
* Host the new adapter layer image in a private container registry.
* Efficiently pull the image for inferencing with adapter layers in new scenarios.

For guidance on getting started with fine-tuning on KAITO, see the [Kaito Tuning Workspace API documentation][kaito-fine-tuning]. To learn more about deploying language models with KAITO in your AKS clusters, see the [KAITO model GitHub repository][kaito-repo].

[!INCLUDE [open source disclaimer](./includes/open-source-disclaimer.md)]

## Next steps

To learn more about containerized AI and machine learning workloads on AKS, see the following articles:

* [Concepts - Small and large language models][language-models]
* [Build and deploy data and machine learning pipelines with Flyte on AKS][flyte-aks]

<!-- LINKS -->
[flyte-aks]: ./use-flyte.md
[kaito-repo]: https://github.com/Azure/kaito/tree/main/presets
[language-models]: ./concepts-ai-ml-language-models.md
[qlora]: https://huggingface.co/blog/4bit-transformers-bitsandbytes#:~:text=We%20present%20QLoRA%2C%20an%20efficient%20finetuning%20approach%20that,pretrained%20language%20model%20into%20Low%20Rank%20Adapters~%20%28LoRA%29.
[kaito-fine-tuning]: https://github.com/Azure/kaito/tree/main/docs/tuning
