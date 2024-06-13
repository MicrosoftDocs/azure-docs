---
title: Best practices for using Azure OpenAI On Your Data
titleSuffix: Azure OpenAI
description: Learn about the best practices when using Azure OpenAI On Your data.
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

Use this article to help you guide through the common issues you might run into while developing a solution using Azure OpenAI On Your Data, a service that allows you to use the power of OpenAI models with your own data. By following the best practices and tips in this article, you can optimize your output with Azure OpenAI On Your Data and achieve the best AI quality possible.

This document covers:

* High level workflow of the Azure OpenAI On Your Data
* How to structure your debugging investigation
* Common issues and their respective solutions

## Azure OpenAI On Your Data: workflow

Azure OpenAI On Your Data's workflow can be divided into two major parts:

* Data ingestion
* Inferencing

## Data ingestion

This is the stage where you connect your data with the Azure OpenAI On Your Data service. In this stage, user documents are processed and broken down into smaller chunks (1,024 tokens by default, however there are more chunking options available) and then indexed. This is the stage where you can choose an embedding model (embeddings are representations of values or objects like text, images, and audio that are designed to be consumed by machine learning models and semantic search algorithms) to use for embeddings creation or preferred search type. The output of this process is an index that will later be used to retrieve documents from during inference.

## Inferencing

This is the stage where users chat with their data using a studio, deployed webapp, or direct API calls. In this stage users are able to set various model parameters (such as `temperature`, or `top_P` ) and system parameters such as `strictness`, and `topNDocuments`.

## Inner workings

Ingestion should be thought of as a separate process before inference. After the index has been created, Azure OpenAI On Your Data has many steps it goes through to generate a good response to user questions.

1. **Intent generation**: Multiple search intents are generated using user question and conversation history. We generate multiple search intents to address any ambiguity in the user's question, add more context using the conversation history to retrieve holistic information in the retrieval stage, and to provide any additional information to make the final response thorough and useful.
2. **Retrieval**: Using the search type provided during the ingestion, a list of relevant document chunks are retrieved corresponding to each of the search intents.
3. **Filtration**: The strictness setting is used to filter out the retrieved documents that are considered irrelevant per the strictness threshold. `strictness` controls how aggressive the filtration is. 
4. **Re-ranking**: The remaining document chunks retrieved for each of the search intents are reranked. Reranking is done to come up with a combined list of most relevant documents retrieved for all search intents.
5. **TopNDocuments**: The `topNDocuments` from this reranked list is included in the prompt sent to the model, along with the question, the conversation history, and the role information/system message.
1. **Response Generation**: The model uses the provided context to generate the final response along with citations. 

## How to structure debugging investigation

When you see an unfavorable response to a query, it could be the result of different outputs from various components not working as expected. It's advisable to debug the outputs of each component using the following steps.
 
### Step 1: Check for Retrieval issues

Check if the correct document chunks are present in the retrieved documents. This is straight forward to check using the REST API. In the API response, check the citations in the `tool` message.

### Step 2: Check for Generation issues

If you're seeing the correct document chunks in the retrieved documents, then you're likely encountering a **generation issue**. Consider using a more powerful model. If you aren't, go to [step 3](#step-3-check-the-rest-of-the-funnel).

1. **Upgrade the model**: For example, if you're using gpt-35-turbo, consider using gpt-4. 
1. **Switch the model version**: If you're using gpt-35-turbo-1106, consider using gpt-35-turbo-16k (0613).
    1. You can also tune the finer aspects of the response by changing the role information / system message.

### Step 3: Check the rest of the funnel

If you aren't seeing the correct document chunks in step 1, then you need to dig further down the funnel.

1. It's possible that the correct document chunk was retrieved but was filtered out based on `strictness`. In this case, try reducing the `strictness` parameter.

1. It's possible that the correct document chunk wasn't part of the `topNDocuments`. In this case, increase the `topNDocuments` parameter. 

1. It's possible that your index fields are not correctly mapped, meaning retrieval might not work well. This is particularly relevant if you're using a pre-existing data source (you did not create the index using the Studio or offline scripts available on [GitHub](https://github.com/microsoft/sample-app-aoai-chatGPT/tree/main/scripts). For more information on mapping index fields, see the [how-to article](../concepts/use-your-data.md?tabs=ai-search#index-field-mapping). 

1. It's possible that the intent generation step isn't working well. In the API response, check the `intents` fields in the `tool` message.

   - Some models are known to not work well for intent generation. For example, if you're using the GPT-35-turbo-1106 model version, consider using a later model, such as gpt-35-turbo (0125) or GPT-4-1106-preview.

1. Do you have semi-structured data in your documents, such as numerous tables? There might be an **ingestion issue**. Your data might need special handling during ingestion.
   - If the file format is PDF, we offer optimized ingestion for tables using the offline scripts available on [GitHub](https://github.com/microsoft/sample-app-aoai-chatGPT/tree/main/scripts). to use the scripts, you need to have a [Document Intelligence](../../document-intelligence/overview.md) resource and use the `Layout` [model](../../document-intelligence/concept-layout.md). You can also:
   - Adjust your chunk size to make sure your largest table fits within the specified [chunk size](../concepts/use-your-data.md#chunk-size-preview).

1. Are you converting a semi-structured data type such as json/xml to a PDF document? This might cause an **ingestion issue** because structured information needs a chunking strategy that is different from purely text content.

1. If none of the above apply, you might be encountering a **retrieval issue**. Consider using a more powerful `query_type`. Based on our benchmarking, `semantic` and `vectorSemanticHybrid` are preferred. 

## Frequently encountered issues

**Issue 1**: _The model responds with "The requested information isn't present in the retrieved documents. Please try a different query or topic" even though that's not the case._

See [Step 3](#step-3-check-the-rest-of-the-funnel) in the above debugging process.

**Issue 2**: _The response is from my data, but it isn't relevant/correct in the context of the question._

See the debugging process starting at [Step 1](#step-1-check-for-retrieval-issues).

**Issue 3**: _The role information / system message isn't being followed by the model._
 
- Instructions in the role information might contradict with our [Responsible AI guidelines](/legal/cognitive-services/openai/overview?context=%2Fazure%2Fai-services%2Fopenai%2Fcontext%2Fcontext), in which case it won't likely be followed.

- For each model, there is an implicit token limit for the role information, beyond which it is truncated. Ensure your role information follows the established [limits](../concepts/use-your-data.md#token-usage-estimation-for-azure-openai-on-your-data).

- A prompt engineering technique you can use is to repeat an important instruction at the end of the prompt. Surrounding the important instruction with `**` on both side of it can also help.
- Upgrade to a newer GPT-4 model as it's likely to follow your instructions better than GPT-35.
 
**Issue 4**: _There are inconsistencies in responses._

- Ensure you're using a low `temperature`. We recommend setting it to `0`. 

- Although the question is the same, the conversation history gets added to the context and affects how the model responds to same question over a long session.

- Using the REST API, check if the search intents generated are the same both times or not. If they are very different, try a more powerful model such as GPT-4 to see if the problem is affected by the chosen model. 

- If the intents are same or similar, try reducing `strictness` or increasing `topNDocuments`.

**Issue 5**: _Intents are empty or wrong._

- Refer to [Step 3](#step-3-check-the-rest-of-the-funnel) in the above debugging process. 

- If intents are irrelevant, the issue might be that the intent generation step lacks context. It only considers the user question and conversation history. It does not look at the role information or the document chunks. You might want to consider adding a prefix to each user question with a short context string to help the intent generation step.

**Issue 6**: _I have set inScope=true or checked "Restrict responses to my data" but it still responds to Out-Of-Domain questions._

- Consider increasing `strictness`.
- Add the following instruction in your role information / system message: 
   - _"You are also allowed to respond to questions based on the retrieved documents."_
- The `inscope` parameter isn't a hard switch, but setting it to `true` encourages the model to stay restricted.

**Issue 7**: _The response is correct but occasionally missing document references/citations._
- Consider upgrading to a GPT-4 model if you're already not using it. GPT-4 is generally more consistent with citation generation.
- You can try to emphasize citation generation in the response by adding `**You must generate citation based on the retrieved documents in the response**` in the role information. 
- Or you can add a prefix in the user query `**You must generate citation to the retrieved documents in the response to the user question \n User Question: {actual user question}**`