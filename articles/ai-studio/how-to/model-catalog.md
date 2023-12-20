---
title: Explore the model catalog in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article introduces foundation model capabilities and the model catalog in Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 11/15/2023
ms.author: eur
---

# Explore the model catalog in Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

The model catalog in AI Studio is a hub for discovering foundation models. The catalog includes some of the most popular large language and vision foundation models curated by Microsoft, Hugging Face, and Meta. These models are packaged for out-of-the-box usage and are optimized for use in Azure AI Studio. 

> [!NOTE]
> Models from Hugging Face and Meta are subject to third-party license terms available on the Hugging Face and Meta's model details page respectively. It is your responsibility to comply with the model's license terms.

You can quickly try out any pre-trained model using the Sample Inference widget on the model card, providing your own sample input to test the result. Additionally, the model card for each model includes a brief description of the model and links to samples for code-based inferencing, fine-tuning, and evaluation of the model.

## Filter by collection or task

You can filter the model catalog by collection, model name, or task to find the model that best suits your needs. 
- **Collection**: Collection refers to the source of the model. You can filter the model catalog by collection to find models from Microsoft, Hugging Face, or Meta. 
- **Model name**: You can filter the model catalog by model name (such as GPT) to find a specific model. 
- **Task**: The task filter allows you to filter models by the task they're best suited for, such as chat, question answering, or text generation.


## Model benchmarks

You might prefer to use a model that has been evaluated on a specific dataset or task. In Azure AI Studio, you can compare benchmarks across models and datasets available in the industry to assess which one meets your business scenario. You can find models to benchmark on the **Explore** page in Azure AI Studio. 

:::image type="content" source="../media/explore/model-benchmarks-find-model-task.png" alt-text="Screenshot of models and tasks that can be selected to benchmark." lightbox="../media/explore/model-benchmarks-find-model-task.png":::

Select the models and tasks you want to benchmark, and then select **Compare**.

:::image type="content" source="../media/explore/model-benchmarks-compare-chart.png" alt-text="Screenshot of accuracy metrics of two models compared by task in a chart." lightbox="../media/explore/model-benchmarks-compare-chart.png":::

The model benchmarks help you make informed decisions about the suitability of models and datasets prior to initiating any job. The benchmarks are a curated list of the best-performing models for a given task, based on a comprehensive comparison of benchmarking metrics. Currently, Azure AI Studio only provides benchmarks based on accuracy.

| Metric       | Description |
|--------------|-------|
| Accuracy     |Accuracy scores are available at the dataset and the model levels. At the dataset level, the score is the average value of an accuracy metric computed over all examples in the dataset. The accuracy metric used is exact-match in all cases except for the *HumanEval* dataset that uses a `pass@1` metric. Exact match simply compares model generated text with the correct answer according to the dataset, reporting one if the generated text matches the answer exactly and zero otherwise. `Pass@1` measures the proportion of model solutions that pass a set of unit tests in a code generation task. At the model level, the accuracy score is the average of the dataset-level accuracies for each model.|

The benchmarks are updated regularly as new metrics and datasets are added to existing models, and as new models are added to the model catalog.

### How the scores are calculated

The benchmark results originate from public datasets that are commonly used for language model evaluation. In most cases, the data is hosted in GitHub repositories maintained by the creators or curators of the data. Azure AI evaluation pipelines download data from their original sources, extract prompts from each example row, generate model responses, and then compute relevant accuracy metrics.

Prompt construction follows best practice for each dataset, set forth by the paper introducing the dataset and industry standard. In most cases, each prompt contains several examples of complete questions and answers, or "shots," to prime the model for the task. The evaluation pipelines create shots by sampling questions and answers from a portion of the data that is held out from evaluation.

### View options in the model benchmarks

These benchmarks encompass both a list view and a dashboard view of the data for ease of comparison, and helpful information that explains what the calculated metrics mean.

In list view you can find the following information:
- Model name, description, version, and aggregate scores.
- Benchmark datasets (such as AGIEval) and tasks (such as question answering) that were used to evaluate the model.
- Model scores per dataset.

You can also filter the list view by model name, dataset, and task.

:::image type="content" source="../media/explore/model-benchmarks-compare-list.png" alt-text="Screenshot of accuracy metrics of two models compared by task in a list." lightbox="../media/explore/model-benchmarks-compare-list.png":::

Dashboard view allows you to compare the scores of multiple models across datasets and tasks. You can view models side by side (horizontally along the x-axis) and compare their scores (vertically along the y-axis) for each metric. 

You can switch to dashboard view from list view by following these quick steps:
1. Select the models you want to compare.
1. Select **Switch to dashboard view** on the right side of the page.


## Next steps

- [Explore Azure AI foundation models in Azure AI Studio](models-foundation-azure-ai.md)
