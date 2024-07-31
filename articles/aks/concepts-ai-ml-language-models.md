---
title: Concepts - Small and large language models
description: Learn about small and large language models, including when to use them and how you can onboard them to your AI and machine learning workflows on Azure Kubernetes Service (AKS).
ms.topic: conceptual
ms.date: 06/24/2024
author: schaffererin
ms.author: schaffererin
---

# Concepts - Small and large language models

In this article, you learn about small and large language models, including when to use them and how you can use them with your AI and machine learning workflows on Azure Kubernetes Service (AKS).

## What are language models?

Language models are powerful machine learning models used for natural language processing (NLP) tasks, such as text generation and sentiment analysis. These models represent natural language based on the probability of words or sequences of words occurring in a given context.

*Conventional language models* have been used in supervised settings for research purposes where the models are trained on well-labeled text datasets for specific tasks. *Pre-trained language models* offer an accessible way to get started with AI and have become more widely used in recent years. These models are trained on large-scale text corpora from the internet using deep neural networks and can be fine-tuned on smaller datasets for specific tasks.

The size of a language model is determined by its number of parameters, or *weights*, that determine how the model processes input data and generates output. Parameters are learned during the training process by adjusting the weights within layers of the model to minimize the difference between the model's predictions and the actual data. The more parameters a model has, the more complex and expressive it is, but also the more computationally expensive it is to train and use.

In general, **small language models** have *fewer than 10 billion parameters*, and **large language models** have *more than 10 billion parameters*. For example, the new Microsoft Phi-3 model family has three versions with different sizes: mini (3.8 billion parameters), small (7 billion parameters), and medium (14 billion parameters).

## When to use small language models

### Advantages

Small language models are a good choice if you want models that are:

* **Faster and more cost-effective to train and run**: They require less data and compute power.
* **Easy to deploy and maintain**: They have smaller storage and memory footprints.
* **Less prone to *overfitting***, which is when a model learns the noise or specific patterns of the training data and fails to generalize new data.
* **Interpretable and explainable**: They have fewer parameters and components to understand and analyze.

### Use cases

Small language models are suitable for use cases that require:

* **Limited data or resources**, and you need a quick and simple solution.
* **Well-defined or narrow tasks**, and you don't need much creativity in the output.
* **High-precision and low-recall tasks**, and you value accuracy and quality over coverage and quantity.
* **Sensitive or regulated tasks**, and you need to ensure the transparency and accountability of the model.

The following table lists some popular, high-performance small language models:

| Model family | Model sizes (Number of parameters) | Software license |
|--------------|------------------------------------|------------------|
| Microsoft Phi-3 | Phi-3-mini (3.8 billion), Phi-3-small (7 billion) | MIT license |
| Microsoft Phi-2 | Phi-2 (2.7 billion) | MIT license |
| Falcon | Falcon-7B (7 billion) | Apache 2.0 license |

## When to use large language models

### Advantages

Large language models are a good choice if you want models that are:

* **Powerful and expressive**: They can capture more complex patterns and relationships in the data.
* **General and adaptable**: They can handle a wider range of tasks and transfer knowledge across domains.
* **Robust and consistent**: They can handle noisy or incomplete inputs and avoid common errors and biases.

### Use cases

Large language models are suitable for use cases that require:

* **Abundant data and resources**, and you have the budget to build and maintain a complex solution.
* **Low-precision and high-recall tasks**, and you value coverage and quantity over accuracy and quality.
* **Challenging or exploratory tasks**, and you want to leverage the model's capacity to learn and adapt.

The following table lists some popular, high-performance large language models:

| Model family | Model sizes (Number of parameters) | Software license |
|--------------|------------------------------------|------------------|
| Microsoft Phi-3 | Phi-3-medium (14 billion) | MIT license |
| Falcon | Falcon-40B (40 billion) | Apache 2.0 license |

## Experiment with small and large language models on AKS

Kubernetes AI Toolchain Operator (KAITO) is an open-source operator that automates small and large language model deployments in Kubernetes clusters. The KAITO add-on for AKS simplifies onboarding and reduces the time-to-inference for open-source models on your AKS clusters. The add-on automatically provisions right-sized GPU nodes and sets up the associated interference server as an endpoint server to your chosen model.

For more information, see [Deploy an AI model on AKS with the AI toolchain operator][ai-toolchain-operator]. To get started with a range of supported small and large language models for your inference workflows, see the [KAITO model GitHub repository][kaito-repo].

[!INCLUDE [open source disclaimer](./includes/open-source-disclaimer.md)]

## Next steps

To learn more about containerized AI and machine learning workloads on AKS, see the following articles:

* [Use KAITO to forecast energy usage with intelligent apps][forecast-energy-usage]
* [Concepts - Fine-tuning language models][fine-tune-language-models]
* [Build and deploy data and machine learning pipelines with Flyte on AKS][flyte-aks]

<!-- LINKS -->
[ai-toolchain-operator]: ./ai-toolchain-operator.md
[forecast-energy-usage]: https://azure.github.io/Cloud-Native/60DaysOfIA/forecasting-energy-usage-with-intelligent-apps-1/
[flyte-aks]: ./use-flyte.md
[kaito-repo]: https://github.com/Azure/kaito/tree/main/presets
[fine-tune-language-models]: ./concepts-fine-tune-language-models.md
