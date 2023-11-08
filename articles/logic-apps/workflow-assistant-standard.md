---
title: Workflow assistant for Standard logic app workflows
description: Learn about the workflow assistant for Standard workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 11/15/2023
---

# About the workflow assistant for Standard workflows in Azure Logic Apps (preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!IMPORTANT]
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The workflow assistant provides a chat interface that helps you answer questions about Standard workflows in Azure Logic Apps. You can use the assistant to describe an existing workflow or ask for specific answers from within your workflow's context. Available directly within the Standard workflow designer, the workflow assistant provides access to Azure Logic Apps documentation and best practices so that you don't have to separately browse the documentation or search online.

## Open the workflow assistant (Standard workflows)

Only Standard workflows include the workflow assistant. You can open the workflow assistant from an existing workflow or a new workflow. 

1. In the [Azure portal](https://azure.portal.com), open your Standard logic app and a workflow in the designer.

1. On the workflow menu, select **Assistant**, which opens the **Workflow assistant** pane.

1. In the chat box, enter your request or question about Azure Logic Apps capabilities, or enter a specific question about the current workflow.

1. At any time, feel free to close the workflow assistant. Your chat history isn't saved or preserved. 

## How does the workflow assistant work?

When you ask a question or request information in the workflow assistant's chat interface, the assistant queries diverse knowledge sources related to Azure Logic Apps and delivers curated information using the [Azure Open AI Service](../ai-services/openai/overview.md) and [ChatGPT](https://openai.com/blog/chatgpt), which is built by [Open AI](https://openai.com).

These systems use Azure Logic Apps documentation from reputable sources, such as Microsoft Learn, connector schemas, tech community blogs, along with internet data that's used to train GPT 3.5-Turbo. This content is processed into a vectorized format, which is then accessible through a backend system built on Azure App Service. Queries are triggered based on interactions with the workflow designer.

When you enter your query or *prompt* in the chat interface, the Azure Logic Apps backend performs preprocessing and forwards the results to a large language model in Azure Open AI Service. This model generates responses based on the current context in the form of the workflow definition's JSON code and your prompt. 

With the assistant helping you during workflow development, the assistant's goal is to make sure that all the information that you need is readily available, presented in a curated manner, and doesn't require you to switch context.

## Example use cases 

The workflow assistant is useful for various use cases, for example:

- Describe the current workflow.

  This prompt is useful when you're using or updating workflows built by other developers or collaborating with other developers on shared workflows.

- Provide help with connectors.

  Azure Logic Apps has 1,000+ connectors, so this much choice can feel overwhelming. The workflow assistant can provide recommendations on connectors or operations, provide best practices about how to use a connector, provide comparisons between connectors, and so on.

- Recommend patterns.

  Like code, well-built workflows and integration applications can follow standard patterns. The workflow assistant can provide guidance that you can use to apply best practices for error handling, testing, and other optimizations.

- Suggest guidance based on scenarios.

  The workflow assistant can recommend step-by-step information about how to build workflows based on your scenarios, for example, the connectors to use, how to configure them, and how to process the data.

- Provide contextual responses.

  The workflow assistant builds its responses based on your opened workflow in the designer. You can ask very specific questions about how to perform tasks in the context of a workflow operation. For example, you can learn the configuration for specific actions and get more help about how to configure them. You can get recommendations about the data input or output for an operation, how to test that data, and so on.

This list includes only some examples, so please share your feedback with the Azure Logic Apps team about how you use the workflow assistant to improve your productivity.

## Limitations

- Inaccurate responses

  The workflow assistant can generate valid responses that might not be semantically correct or capture the intent behind your prompt. As the language model trains with more data over time, the responses will improve. Always make sure to carefully review the assistant's recommendations before you apply them to your workflows.

- Workflow size

  You might experience different performance levels in the workflow assistant, based on factors such as the number of workflow operations or complexity. The assistant is trained on workflows with different complexity levels but still has limited scope and might not be able to handle very large workflows. These limitations are primarily related to token constraints in the queries sent to Azure Open AI Service. The Azure Logic Apps team is committed to continuous improvement and enhancing these limitations through iterative updates.

## Provide feedback

The Azure Logic Apps team values your feedback and encourages you to share your experiences, especially if you encounter unexpected responses or have any concerns about the workflow assistant.

1. In the chat pane, under the workflow assistant's response, select the thumbs-down icon.

1. Include information about your workflow, your specific question, and the response that you received from the assistant. 

## Frequently asked questions (FAQ)

**Q**: Is the workflow assistant available for all developers?

**A**: The workflow assistant is available only for Standard workflows in Azure Logic Apps and is currently available only in the Azure portal, not Visual Studio Code.

**Q**: Is the workflow assistant available in all Azure regions and languages?

**A**: The workflow assistant is available in all Azure regions where Standard workflows and single-tenant Azure Logic Apps are available. However, the assistant currently supports only English for queries, prompts, and responses.

**Q**: Can the workflow assistant answer questions about any topic?

**A**: The workflow assistant is trained to answer only questions about Azure Logic Apps. To make sure that responses are grounded and relevant to Azure Logic Apps, the assistant was evaluated using valid and harmful prompts from various sources. The assistant is trained to not answer any harmful questions. If you ask questions about Azure that are unrelated to Azure Logic Apps, the assistant gracefully hands off processing to Azure Copilot.

**Q**: Where can I learn about responsible and ethical AI practices at Microsoft?

**A**: The workflow assistant follows responsible and ethical AI practices in accordance with the [Microsoft responsible AI principles and approach](https://www.microsoft.com/ai/principles-and-approach).

**Q**: Where can I learn about privacy and data protection for Azure?

**A**: The workflow assistant follows responsible practices in accordance with the [Azure Privacy policy](https://azure.microsoft.com/explore/trusted-cloud/privacy). For more information, see [Azure customer data protection](../security/fundamentals/protection-customer-data.md) and [Microsoft data protection and privacy](https://www.microsoft.com/trust-center/privacy).

**Q**: What data does the workflow assistant collect?

**A**: To provide contextual responses, the workflow assistant relies on your workflow's sanitized JSON definition, which is used only to scope the responses and isn't stored anywhere. The workflow definition is sanitized to make sure that no customer data or secrets are passed as context. For troubleshooting purposes, the assistant collects some telemetry about UI interactions, but omits any customer or personal data.

**Q**: What happens to any personal or customer data entered in the workflow assistant? 

**A**: The workflow assistant doesn't collect, store, or share any personal or customer data, including any data provided in workflow assistant's questions or responses.

**Q**: Does Azure Logic Apps own the workflows suggested by the workflow assistant? 

**A**: The workflow assistant doesn't own the workflow suggestions that the assistant provides to you nor the workflows that you build based on these suggestions. You own and manage the workflows that you create using the workflow assistant's help.

**Q**: What's the difference between Azure OpenAI Service and ChatGPT?

**A**: [Azure Open AI Service](../ai-services/openai/overview.md) is an enterprise-ready AI technology powered that's for your business processes and your business data to meet security and privacy requirements.

[ChatGPT](https://openai.com/blog/chatgpt) is built by [Open AI](https://openai.com) and is a general-purpose large language model (LLM) trained by OpenAI on a massive dataset of text, designed to engage in human-like conversations and answer a wide range of questions on several topics.

## Next steps

[Create an example Standard workflow in single-tenant Azure Logic Apps](create-single-tenant-workflows-azure-portal.md)
