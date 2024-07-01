---
title: Use Language service in prompt flow
description: Learn how to use Azure AI Language in prompt flow.
author: jboback
ms.author: jboback
ms.service: azure-ai-language
ms.topic: how-to
ms.date: 06/14/2024
---

# Use Language service in prompt flow

[Prompt flow in Azure AI Studio](https://learn.microsoft.com/en-us/azure/ai-studio/how-to/prompt-flow) is a development tool designed to streamline the entire development cycle of AI applications powered by Large Language Models (LLMs). You can explore and quickly start to use and fine-tune various natural language processing capabilities from Azure AI Language, reducing your time to value and deploying solutions with reliable evaluation.

The Prompt flow tool is a wrapper for various Azure AI Language APIs. The current list of supported capabilities is as follows:

| Name                                  | Description                                         |
|---------------------------------------|-----------------------------------------------------|
| Abstractive Summarization             | Generate abstractive summaries from documents.      |
| Extractive Summarization              | Extract summaries from documents.                   |
| Conversation Summarization            | Summarize conversations.                            |
| Entity Recognition                    | Recognize and categorize entities in documents.     |
| Key Phrase Extraction                 | Extract key phrases from documents.                 |
| Language Detection                    | Detect the language of documents.                   |
| PII Entity Recognition                | Recognize and redact PII entities in documents.      |
| Conversational PII                    | Recognize and redact PII entities in conversations. |
| Sentiment Analysis                    | Analyze the sentiment of documents.                 |
| Conversational Language Understanding | Predict intents and entities from user's utterances.|
| Translator                            | Translate documents.                                |

## Prerequisites

- Install the [prompt flow Azure AI Language PyPl package](https://pypi.org/project/promptflow-azure-ai-language/)
    - For local users: `pip install promptflow-azure-ai-language`, You may also want to install the [prompt flow for VS Code extension](https://marketplace.visualstudio.com/items?itemName=prompt-flow.prompt-flow).

The tool calls APIs from Azure AI Language. To use it, you must create a connection to an [Azure AI Language resource](https://learn.microsoft.com/en-us/azure/ai-services/language-service/). [Create a Language Resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) first, if necessary.
- In prompt flow, add a new `CustomConnection`
    - Under the `secrets` field, specify the resource's APi key: `api_key: <Azure AI Language Resource api key>`
    - Under the `configs` field, specify te resource's endpoint: `endpoint: <Azure AI Language Resource endpoint>`

To use the `Translator` tool, you must set up an additional connection to an [Azure AI Language resource](https://learn.microsoft.com/en-us/azure/ai-services/language-service/). [Create a Language Resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) first, if necessary.
- In prompt flow, add a new `CustomConnection`
    - Under the `secrets` field, specify the resource's APi key: `api_key: <Azure AI Translator Resource api key>`
    - Under the `configs` field, specify te resource's endpoint: `endpoint: <Azure AI Translator Resource endpoint>`
    - If your Translator Resource is regional and non-global, specify its region under `configs` as well: `region: <Azure AI Translator Resource region>`

## Using Azure AI Language via the prompt flow gallery

[Introduce the procedure.]

1. Procedure step
1. Procedure step
1. Procedure step

<!-- Required: Steps to complete the task - H2

In one or more H2 sections, organize procedures. A section
contains a major grouping of steps that help the user complete
a task.

Begin each section with a brief explanation for context, and
provide an ordered list of steps to complete the procedure.

If it applies, provide sections that describe alternative tasks or
procedures.

-->

## Next step -or- Related content

> [!div class="nextstepaction"]
> [Next sequential article title](link.md)

-or-

* [Related article title](link.md)
* [Related article title](link.md)
* [Related article title](link.md)

<!-- Optional: Next step or Related content - H2

Consider adding one of these H2 sections (not both):

A "Next step" section that uses 1 link in a blue box 
to point to a next, consecutive article in a sequence.

-or- 

A "Related content" section that lists links to 
1 to 3 articles the user might find helpful.

-->