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

- **Retrieval Augmented Generation (RAG)**: RAG is a technique for augmenting LLM knowledge with additional data. LLMs can reason about wide-ranging topics, but their knowledge is limited to the public data up to a specific point in time that they were trained on. If you want to build AI applications that can reason about private data or data introduced after a model’s cutoff date, you need to augment the knowledge of the model with the specific information it needs. The process of bringing the appropriate information and inserting it into the model prompt is known as Retrieval Augmented Generation (RAG). For more information, see [Retrieval-augmented generation (RAG)](https://python.langchain.com/docs/use_cases/question_answering/).

- **Groundedness and Ungroundedness in LLMs**: This refers to the extent to which the model’s outputs are based on provided information or reflect reliable sources accurately. A grounded response adheres closely to the given information, avoiding speculation or fabrication. In groundedness measures, source information is crucial and serves as the grounding source. 

- **Hallucination in LLMs**: Hallucination involves generating text that contains fabricated, false, or misleading information. Hallucination in LLMs is a broader concept that generally includes ungroundedness. It refers to the generation of text that is not only ungrounded, but also fabricated, false, or misleading. Hallucination encompasses a wider range of inaccuracies, including completely made-up information that may not have any basis in the provided data or known facts.
    - While all hallucinated content is ungrounded, not all ungrounded content is a hallucination. Hallucination is a broader term that includes any kind of fabricated or false information, whereas ungroundedness specifically refers to deviations from provided information or known facts.

## Groundedness detection features

- **Domain Selection**: You can select predefined domains: either `medical` or `generic`. Users can choose an established domain to ensure more tailored detection that aligns with the specific needs of their field.
- **Task Specification**: This feature lets you select the task you're doing, such as QnA (questioning & answering) and Summarization, with adjustable settings according to the task types.
- **Speed vs Interpretability**: There are two modes that trade off speed with performance.
   - Non-Reasoning mode: Offers fast detection capability, easy to embed into online applications.
   - Reasoning mode: Offers detailed explanation for detected ungrounded segments easy for understanding and mitigation.

##  Use cases

Groundedness detection supports text-based Summarization and QnA tasks to ensure that the generated summaries or answers are accurate and reliable. Here are some examples of each use case:

**Summarization tasks**:
- Medical summarization: In the context of medical news articles, Groundedness detection can be used to ensure that the summary does not contain fabricated or misleading information, guaranteeing that readers obtain accurate and reliable medical information.
- Academic paper summarization: When generating summaries of academic papers or research articles, the function can help ensure that the summarized content accurately represents the key findings and contributions without introducing false claims.
- Legal document summarization: In legal environments, where summarizing lengthy legal documents is common, the function can confirm that the summary does not contain any erroneous statements or omissions that could lead to legal disputes.

**QnA tasks**:
- Customer support chatbots: In customer support, the function can be used to validate the answers provided by AI chatbots, ensuring that customers receive accurate and trustworthy information when they ask questions about products or services.
- Medical QnA: For medical QnA, the function assists in verifying the accuracy of medical answers and advice provided by AI systems to healthcare professionals and patients, reducing the risk of medical errors.
- Educational QnA: In educational settings, the function can be applied to QnA tasks to confirm that answers to academic questions or test prep queries are factually accurate, supporting the learning process.
- Financial and investment queries: For financial and investment-related questions, the function can validate the answers given by AI systems, helping users make informed financial decisions based on accurate information.

## Limitations

**Language availability**
Currently, the Groundedness detection API supports English language content. While our API does not restrict the submission of non-English content, we cannot guarantee the same level of quality and accuracy in the analysis of other language content. We recommend that users submit content primarily in English to ensure the most reliable and accurate results from the API.

**Text length limitations**
Please note that the maximum character limit for the grounding sources is 55K characters, and for the text and query, it is 7.5K characters for each API call. If your input (either text or grounding sources) exceeds these character limitations per API call, you will encounter an error.

**Regions**
To use this API, you must create your Azure AI Content Safety resource in the supported regions. Currently, it is available in the following Azure regions:
- East US 2
- East US (only for non-reasoning)
- West US
- Sweden Central

**TPS limitations**

| Pricing Tier | Requests per 10 second (RPS) |
| :----------- | :--------------------------- |
| F0           | 10                           |
| S0           | 10                           |

If you need a higher RPS, please [contact us](mailto:contentsafetysupport@microsoft.com) to request.

