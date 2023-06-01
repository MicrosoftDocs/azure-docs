---
title: Testing and evaluating models in custom summarization
titleSuffix: Azure Cognitive Services
description: Learn about how to test and evaluate custom summarization models.
services: cognitive-services
author: jboback
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 06/01/2022
ms.author: jboback
---

# Test and evaluate your custom summarization models

As you create your custom summarization model, you want to be sure to ensure that you'll end up with a quality model. You'll need to test and evaluate your custom summarization model to ensure it performs well.

## Guidance on split test and training sets

An important stage of creating a customized summarization model is validating that the created model is satisfactory in terms of quality and generated summaries as expected. That validation process has to be performed with a separate set of examples (called test examples) than those used for training. There are three important guidelines we recommend following when splitting the available data into training and testing:

1. **Size**: To establish enough confidence about the model's quality, the test set should be of a reasonable size. Testing the model on just a handful of examples can give misleading outcome evaluation times. We recommend evaluating on 100s of examples. When a large number of documents/conversations is available, we recommend reserving at least 10% of them for testing.
2. **No Overlap**: It is crucial to make sure that the same document is not used for training and testing at the same time. Testing should be performed on documents that were never used for training at any stage, otherwise the quality of the model will be highly overestimated.
3. **Diversity**: The test set should cover as many possible input characteristics as possible. For example, it is always better to include documents of different lengths, topics, styles, .. etc. when applicable. Similarly for conversation summarization, it is always a good idea to include conversations of different number of turns and number of speakers.

## Guidance to evaluate a custom summarization model

When evaluating a custom model, we recommend using both automatic and manual evaluation together. Automatic evaluation helps quickly judge the quality of summaries produced for the entire test set, hence covering a wide range of input variations. However, automatic evaluation gives an approximation of the quality and is not enough by itself to establish confidence in the model quality. So, we also recommend inspecting the summaries produced for as many test documents as possible.

### Automatic evaluation

Currently, we use a metric called ROUGE (Recall-Oriented Understudy for Gisting Evaluation). This technique includes measures for automatically determining the quality of a summary by comparing it to ideal summaries created by humans. The measures count the number of overlapping units, like n-gram, word sequences, and word pairs, between the computer-generated summary being evaluated and the ideal summaries. To learn more about Rouge, see the [ROUGE wikipedia entry](https://en.wikipedia.org/wiki/ROUGE_(metric)) and the [paper on the ROUGE package](https://aclanthology.org/W04-1013.pdf).

### Manual evaluation

When manually inspecting the quality of a summary, there are general qualities of a summary that we recommend checking for besides any desired expections that the custom model was trained to adhere to such as style, format, or length. The general qualities we recommend checking are:

1. **Fluency**: The summary should have no formatting problems, capitalization errors or obviously ungrammatical sentences.
2. **Coherence**: The summary should be well-structured and well-organized. The summary should not just be a heap of related information, but should build from sentence to sentence to a coherent body of information about a topic.
3. **Coverage**: The summary should cover all important information in the document/conversation.
4. **Relevance**: The summary should include only important information from the source document/conversation without redundancies.
5. **Hallucinations**: The summary does not contain wrong information that is not supported by the source document/conversation.

To learn more about summarization evaluation, see the [MIT Press article on SummEval](https://direct.mit.edu/tacl/article/doi/10.1162/tacl_a_00373/100686/SummEval-Re-evaluating-Summarization-Evaluation).
