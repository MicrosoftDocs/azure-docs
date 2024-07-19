---
title: Best practices for using Azure OpenAI On Your Data
titleSuffix: Azure OpenAI Service
description: Learn about the best practices for using Azure OpenAI On Your Data, along with how to fix common problems.
ms.service: azure-ai-openai
ms.topic: conceptual
ms.date: 04/08/2024
ms.custom: references_regions, build-2023, build-2023-dataai, refefences_regions
manager: nitinme
author: aahill
ms.author: aahi
recommendations: false
---

# Troubleshooting and best practices for Azure OpenAI On Your Data

This article can help guide you through common problems in developing a solution by using Azure OpenAI Service On Your Data, a feature that allows you to use the power of OpenAI models with your own data. By following the best practices and tips in this article, you can optimize your output with Azure OpenAI On Your Data and achieve the best AI quality possible.

## Azure OpenAI On Your Data: Workflow

The workflow for Azure OpenAI On Your Data has two major parts:

* **Data ingestion**: This is the stage where you connect your data with Azure OpenAI On Your Data. In this stage, user documents are processed and broken down into smaller chunks and then indexed. The chunks are 1,024 tokens by default, but more chunking options are available.

  Also in this stage, you can choose an embedding model to use for creation of embeddings or preferred search type. Embeddings are representations of values or objects (like text, images, and audio) that are designed to be consumed by machine learning models and semantic search algorithms.
  
  The output of this process is an index that will later be used for retrieving documents during inferencing.

* **Inferencing**: This is the stage where users chat with their data by using a studio, a deployed web app, or direct API calls. In this stage, users can set various model parameters (such as `temperature` and `top_P` ) and system parameters (such as `strictness` and `topNDocuments`).

Think of ingestion as a separate process before inferencing. After the index is created, Azure OpenAI On Your Data goes through the following steps to generate a good response to user questions:

1. **Intent generation**: Azure OpenAI On Your Data generates multiple search intents by using user questions and conversation history. It generates multiple search intents to address any ambiguity in users' questions, add more context by using the conversation history to retrieve holistic information in the retrieval stage, and provide any additional information to make the final response thorough and useful.
2. **Retrieval**: By using the search type provided during the ingestion, Azure OpenAI On Your Data retrieves a list of relevant document chunks that correspond to each of the search intents.
3. **Filtration**: Azure OpenAI On Your Data uses the strictness setting to filter out the retrieved documents that are considered irrelevant according to the strictness threshold. The `strictness` parameter controls how aggressive the filtration is.
4. **Reranking**: Azure OpenAI On Your Data reranks the remaining document chunks retrieved for each of the search intents. The purpose of reranking is to produce a combined list of the most relevant documents retrieved for all search intents.
5. **Parameter inclusion**: The `topNDocuments` parameter from the reranked list is included in the prompt sent to the model, along with the question, the conversation history, and the role information or system message.
6. **Response generation**: The model uses the provided context to generate the final response along with citations.

## How to structure debugging investigation

When you see an unfavorable response to a query, it might be the result of outputs from various components not working as expected. You can debug the outputs of each component by using the following steps.

### Step 1: Check for retrieval problems

Use the REST API to check if the correct document chunks are present in the retrieved documents. In the API response, check the citations in the `tool` message.

### Step 2: Check for generation problems

If the correct document chunks appear in the retrieved documents, you're likely encountering a problem with content generation. Consider using a more powerful model through one of these methods:

* Upgrade the model. For example, if you're using `gpt-35-turbo`, consider using `gpt-4`.
* Switch the model version. For example, if you're using `gpt-35-turbo-1106`, consider using `gpt-35-turbo-16k` (0613).

You can also tune the finer aspects of the response by changing the role information or system message.

### Step 3: Check the rest of the funnel

If the correct document chunks don't appear in the retrieved documents, you need to dig farther down the funnel:

* It's possible that a correct document chunk was retrieved but was filtered out based on strictness. In this case, try reducing the `strictness` parameter.

* It's possible that a correct document chunk wasn't part of the `topNDocuments` parameter. In this case, increase the parameter.

* It's possible that your index fields are incorrectly mapped, so retrieval might not work well. This mapping is particularly relevant if you're using a pre-existing data source. (That is, you didn't create the index by using the studio or offline scripts available on [GitHub](https://github.com/microsoft/sample-app-aoai-chatGPT/tree/main/scripts).) For more information on mapping index fields, see the [how-to article](../concepts/use-your-data.md?tabs=ai-search#index-field-mapping).

* It's possible that the intent generation step isn't working well. In the API response, check the `intents` fields in the `tool` message.

   Some models don't work well for intent generation. For example, if you're using the `GPT-35-turbo-1106` model version, consider using a later model, such as `gpt-35-turbo` (0125) or `GPT-4-1106-preview`.

* Do you have semistructured data in your documents, such as numerous tables? There might be an ingestion problem. Your data might need special handling during ingestion.

  * If the file format is PDF, we offer optimized ingestion for tables by using the offline scripts available on [GitHub](https://github.com/microsoft/sample-app-aoai-chatGPT/tree/main/scripts). To use the scripts, you need to have a [Document Intelligence](../../document-intelligence/overview.md) resource and use the [layout model](../../document-intelligence/concept-layout.md).
  
  * You can adjust your [chunk size](../concepts/use-your-data.md#chunk-size-preview) to make sure your largest table fits within it.

* Are you converting a semistructured data type, such as JSON or XML, to a PDF document? This conversion might cause an ingestion problem because structured information needs a chunking strategy that's different from purely text content.

* If none of the preceding items apply, you might be encountering a retrieval problem. Consider using a more powerful `query_type` value. Based on our benchmarking, `semantic` and `vectorSemanticHybrid` are preferred.

## Common problems

The following sections list possible solutions to problems that you might encounter when you're developing a solution by using Azure OpenAI Service On Your Data.

### The information is correct, but the model responds with "The requested information isn't present in the retrieved documents. Please try a different query or topic."

See [step 3](#step-3-check-the-rest-of-the-funnel) in the preceding debugging process.

### A response is from your data, but it isn't relevant or correct in the context of the question

See the preceding debugging process, starting at [step 1](#step-1-check-for-retrieval-problems).

### The model isn't following the role information or system message

* Make sure that instructions in the role information are consistent with the [Responsible AI guidelines](/legal/cognitive-services/openai/overview?context=%2Fazure%2Fai-services%2Fopenai%2Fcontext%2Fcontext). The model likely won't follow role information if it contradicts those guidelines.

* Ensure that your role information follows the [established limits](../concepts/use-your-data.md#token-usage-estimation-for-azure-openai-on-your-data) for it. Each model has an implicit token limit for the role information. Beyond that limit, the information is truncated.

* Use the prompt engineering technique of repeating an important instruction at the end of the prompt. Putting a double asterisk (`**`) on both sides of the important information can also help.

* Upgrade to a newer GPT-4 model, because it's likely to follow your instructions better than GPT-3.5.

### Responses have inconsistencies

* Ensure that you're using a low `temperature` value. We recommend setting it to `0`.

* By using the REST API, check if the generated search intents are the same both times. If the intents are different, try a more powerful model such as GPT-4 to see if the chosen model affects the problem. If the intents are the same or similar, try reducing `strictness` or increasing `topNDocuments`.

> [!NOTE]
> Although the question is the same, the conversation history is added to the context and affects how the model responds to the same question over a long session.

### Intents are empty or wrong

* See [Step 3](#step-3-check-the-rest-of-the-funnel) in the preceding debugging process.

* If intents are irrelevant, the problem might be that the intent generation step lacks context. Intent generation considers only the user question and conversation history. It doesn't consider the role information or the document chunks. You might consider adding a prefix to each user question with a short context string to help the intent generation step.

### You set inScope=true or selected the checkbox for restricting responses to data, but the model still responds to out-of-domain questions

* Consider increasing `strictness`.

* Add the following instruction in your role information or system message:

  `You are also allowed to respond to questions based on the retrieved documents.`
* Set the `inScope` parameter to `true`. The parameter isn't a hard switch, but setting it to `true` encourages the model to stay restricted.

### A response is correct but is occasionally missing document references or citations

* Consider upgrading to a GPT-4 model if you're already not using it. GPT-4 is generally more consistent with citation generation.

* Try to emphasize citation generation in the response by adding `You must generate citation based on the retrieved documents in the response` in the role information.

* Try adding a prefix in the user query `You must generate citation to the retrieved documents in the response to the user question \n User Question: {actual user question}`.
