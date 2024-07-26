---
title: Explore model benchmarks in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article introduces benchmarking capabilities and the model benchmarks experience in Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom:
  - build-2024
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: jcioffi
ms.author: eur
author: eric-urban
---

# Model benchmarks in Azure AI Studio

[!INCLUDE [Feature preview](~/reusable-content/ce-skilling/azure/includes/ai-studio/includes/feature-preview.md)]

In Azure AI Studio, you can compare benchmarks across models and datasets available in the industry to decide which one meets your business scenario. You can find model benchmarks under **Get started** on the left menu in Azure AI Studio.

:::image type="content" source="../media/explore/model-benchmarks-dashboard-view.png" alt-text="Screenshot of a dashboard view graph of model accuracy." lightbox="../media/explore/model-benchmarks-dashboard-view.png":::

Model benchmarks help you make informed decisions about the sustainability of models and datasets before you initiate any job. The benchmarks are a curated list of the best-performing models for a task, based on a comprehensive comparison of benchmarking metrics. Currently, Azure AI Studio provides the following benchmarks for models based on model catalog collections:

- Benchmarks across large language models (LLMs) and small language models (SLMs)  
- Benchmarks across embeddings models

You can switch between the **Quality benchmarks** and **Embeddings benchmarks** views by selecting the corresponding tabs within the model benchmarks experience in AI Studio.

## Benchmarking of LLMs and SLMs

Model benchmarks assess the quality of LLMs and SLMs across the following metrics:  

| Metric | Description |
|--------|-------|
| Accuracy | Accuracy scores are available at the dataset and model levels.<br><br>At the dataset level, the score is the average value of an accuracy metric computed over all examples in the dataset. The accuracy metric used is *exact match* in all cases except for the *HumanEval* dataset, which uses a `pass@1` metric. *Exact match* simply compares model-generated text with the correct answer according to the dataset. It reports a value of 1 if the generated text matches the answer exactly. Otherwise, it reports a value of 0. The `pass@1` metric measures the proportion of model solutions that pass a set of unit tests in a code generation task. <br><br>At the model level, the accuracy score is the average of the dataset-level accuracies for each model. |
| Coherence | Coherence evaluates how well the language model can produce output that flows smoothly, reads naturally, and resembles human language. |
| Fluency | Fluency evaluates the language proficiency of a generative AI model's predicted answer. It assesses how well the generated text adheres to grammatical rules, syntactic structures, and appropriate usage of vocabulary to produce linguistically correct and natural-sounding responses. |
| GPT similarity | GPT similarity is a measure that quantifies the similarity between a ground-truth sentence (or document) and the prediction sentence that an AI model generates. It's calculated by first computing sentence-level embeddings by using the embeddings API for both the ground truth and the model's prediction. These embeddings represent high-dimensional vector representations of the sentences to capture their semantic meaning and context. |
|Groundedness | Groundedness measures how well the language model's generated answers align with information from the input source. |
|Relevance | Relevance measures the extent to which the language model's generated responses are pertinent and directly related to the questions. |

The benchmarks are updated regularly as new metrics and datasets are added to existing models, and as new models are added to the model catalog.

## Benchmarking of embedding models

Model benchmarks assess embeddings models across the following metrics:  

|Metric | Description |
|-------|---------|
|Accuracy | Accuracy is the proportion of correct predictions among the total number of processed predictions. |
|F1 score | F1 score is the weighted mean of the precision and recall. The best value is 1 (perfect precision and recall), and the worst is 0. |
|Mean average precision (mAP) |Mean average precision evaluates the quality of ranking and recommender systems. It measures both the relevance of suggested items and how good the system is at placing more relevant items at the top. Values can range from 0 to 1. The higher the mAP, the better the system can place relevant items high in the list. |
|Normalized discounted cumulative gain (NDCG) |Normalized discounted cumulative gain evaluates a machine learning algorithm's ability to sort items based on relevance. It compares rankings to an ideal order where all relevant items are at the top of the list. In the evaluation of ranking quality, *k* is the list length. In our benchmarks, *k*=10, as indicated by a metric of `ndcg_at_10`. This metric means that we look at the top 10 items. |
|Precision |Precision measures the model's ability to identify instances of a particular class correctly. Precision shows how often a machine learning model is correct when it's predicting the target class. |
|Spearman correlation | Spearman correlation is based on cosine similarity. It's calculated by computing the cosine similarity between variables, ranking these scores, and then using the ranks for the computation. |
|V-measure | V-measure is a metric for evaluating the quality of clustering. It's calculated as a harmonic mean of homogeneity and completeness. It ensures a balance between the two for a meaningful score. Possible scores lie between 0 and 1, where 1 is perfectly complete labeling. |

## How the scores are calculated

The benchmark results originate from public datasets that are commonly used for language model evaluation. In most cases, the data is hosted in GitHub repositories that the creators or curators of the data maintain. Azure AI evaluation pipelines download data from their original sources, extract prompts from each example row, generate model responses, and then compute relevant accuracy metrics.

Prompt construction follows best practices for each dataset, as defined in the paper that introduces the dataset and industry standard. In most cases, each prompt contains several examples of complete questions and answers, or *shots*, to prime the model for the task. The evaluation pipelines create shots by sampling questions and answers from a portion of the data that's held out from evaluation.

## View options in the model benchmarks

Model benchmarks encompass both a dashboard view and a list view of the data, for ease of comparison. They also show helpful information that explains what the calculated metrics mean.

You can use the dashboard view to compare the scores of multiple models across datasets and tasks. You can view models side by side (horizontally along the x-axis) and compare their scores (vertically along the y-axis) for each metric. You can also filter the dashboard view by task, model collection, model name, dataset, and metric.

To switch from the dashboard view to the list view:

1. Select the models that you want to compare.
2. Select **List** on the right side of the page.

    :::image type="content" source="../media/explore/model-benchmarks-dashboard-filtered.png" alt-text="Screenshot of a dashboard view graph with a question-answering filter applied and the List button identified." lightbox="../media/explore/model-benchmarks-dashboard-filtered.png":::

In the list view, you can find the following information:

- Model name, description, version, and aggregate scores.
- Benchmark datasets (such as AGIEval) and tasks (such as question answering) that were used to evaluate the model.
- Model scores per dataset.

You can also filter the list view by task, model collection, model name, dataset, and metric.

:::image type="content" source="../media/explore/model-benchmarks-list-view.png" alt-text="Screenshot of a list view table that displays accuracy metrics in an ordered list." lightbox="../media/explore/model-benchmarks-list-view.png":::

## Related content

- [Explore foundation models in Azure AI Studio](models-foundation-azure-ai.md)
- [View and compare benchmarks in Azure AI Studio](https://ai.azure.com/explore/benchmarks)
