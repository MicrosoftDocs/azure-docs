---
title: "Groundedness detection in Azure AI Content Safety"
titleSuffix: Azure AI services
description: Learn about groundedness in large language model (LLM) responses, and how to detect outputs that deviate from source material.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.topic: conceptual
ms.date: 03/15/2024
ms.author: pafarley
---

#  Groundedness detection

The Groundedness detection API detects whether the text responses of large language models (LLMs) are grounded in the source materials provided by the users. Ungroundedness refers to instances where the LLMs produce information that is non-factual or inaccurate from what was present in the source materials.


## Key terms

- **Retrieval Augmented Generation (RAG)**: RAG is a technique for augmenting LLM knowledge with other data. LLMs can reason about wide-ranging topics, but their knowledge is limited to the public data that was available at the time they were trained. If you want to build AI applications that can reason about private data or data introduced after a model’s cutoff date, you need to provide the model with that specific information. The process of bringing the appropriate information and inserting it into the model prompt is known as Retrieval Augmented Generation (RAG). For more information, see [Retrieval-augmented generation (RAG)](https://python.langchain.com/docs/use_cases/question_answering/).

- **Groundedness and Ungroundedness in LLMs**: This refers to the extent to which the model’s outputs are based on provided information or reflect reliable sources accurately. A grounded response adheres closely to the given information, avoiding speculation or fabrication. In groundedness measurements, source information is crucial and serves as the grounding source.

## Groundedness detection features

- **Domain Selection**: Users can choose an established domain to ensure more tailored detection that aligns with the specific needs of their field. Currently the available domains are `MEDICAL` and `GENERIC`.
- **Task Specification**: This feature lets you select the task you're doing, such as QnA (question & answering) and Summarization, with adjustable settings according to the task type.
- **Speed vs Interpretability**: There are two modes that trade off speed with result interpretability.
   - Non-Reasoning mode: Offers fast detection capability; easy to embed into online applications.
   - Reasoning mode: Offers detailed explanations for detected ungrounded segments; better for understanding and mitigation.

##  Use cases

Groundedness detection supports text-based Summarization and QnA tasks to ensure that the generated summaries or answers are accurate and reliable. Here are some examples of each use case:

**Summarization tasks**:
- Medical summarization: In the context of medical news articles, Groundedness detection can be used to ensure that the summary doesn't contain fabricated or misleading information, guaranteeing that readers obtain accurate and reliable medical information.
- Academic paper summarization: When the model generates summaries of academic papers or research articles, the function can help ensure that the summarized content accurately represents the key findings and contributions without introducing false claims.

**QnA tasks**:
- Customer support chatbots: In customer support, the function can be used to validate the answers provided by AI chatbots, ensuring that customers receive accurate and trustworthy information when they ask questions about products or services.
- Medical QnA: For medical QnA, the function helps verify the accuracy of medical answers and advice provided by AI systems to healthcare professionals and patients, reducing the risk of medical errors.
- Educational QnA: In educational settings, the function can be applied to QnA tasks to confirm that answers to academic questions or test prep queries are factually accurate, supporting the learning process.

## Limitations

### Language availability

Currently, the Groundedness detection API supports English language content. While our API doesn't restrict the submission of non-English content, we can't guarantee the same level of quality and accuracy in the analysis of other language content. We recommend that users submit content primarily in English to ensure the most reliable and accurate results from the API.

### Text length limitations

The maximum character limit for the grounding sources is 55,000 characters per API call, and for the text and query, it's 7,500 characters per API call. If your input (either text or grounding sources) exceeds these character limitations, you'll encounter an error.

### Regions

To use this API, you must create your Azure AI Content Safety resource in the supported regions. See [Region availability](/azure/ai-services/content-safety/overview#region-availability).

### TPS limitations

See [Query rates](/azure/ai-services/content-safety/overview#query-rates).

If you need a higher rate, [contact us](mailto:contentsafetysupport@microsoft.com) to request it.

## Next steps

Follow the quickstart to get started using Azure AI Content Safety to detect groundedness.

> [!div class="nextstepaction"]
> [Groundedness detection quickstart](../quickstart-groundedness.md)
