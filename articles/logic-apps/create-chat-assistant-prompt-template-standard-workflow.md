---
title: Create AI chat assistants with prompt templates
description: Build an AI chat assistant that answers questions using your own data with Standard workflows in Azure Logic Apps and Azure OpenAI prompt templates.
services: logic-apps
ms.suite: integration
ms.reviewers: estfan, shahparth, azla
ms.topic: how-to

ms.collection: ce-skilling-ai-copilot
ms.date: 04/21/2025

# CustomerIntent: I want to learn how to create an AI-powered chat assistant by using a prompt template that makes answering questions easier. I want to know how to complete this task by building a Standard workflow that connects to an Azure OpenAI resource and uses the Azure OpenAI built-in chat completions operation with a prompt template in Azure Logic Apps.
---

# Create an AI chat assistant by using prompt templates with Standard workflows in Azure Logic Apps (Preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!NOTE]
>
> This capability is in preview and is subject to the
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Suppose you want to automate the way that your enterprise or organization answers questions from various groups of people, such as employees, customers, investors, or the media. You can build a chat assistant that responds to questions by using data available from your enterprise or organization.

When you use your own data with the models in Azure OpenAI Service, you create a powerful AI-powered conversational platform that provides faster communication and draws context from specific domain knowledge. To build the process that handles questions, accesses your data, and returns responses, you can create a Standard workflow in Azure Logic Apps to automate and perform the necessary steps - all without writing code.

This guide shows how to build a chat assistant by using a *prompt template* as your starting point. This template is a prebuilt reusable text-based structure that guides the interactions between the AI model and questioners.

The following diagram shows the example workflow that this guide creates:

:::image type="content" source="media/create-chat-assistant-prompt-template-standard-workflow/overview.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, and operations that create an example chat assistant." lightbox="media/create-chat-assistant-prompt-template-standard-workflow/overview.png":::

For more information about the operations in this workflow, see [Review the example scenario](#review-the-example-scenario).

Templates provide the following benefits for creating effective, useful, and clear prompts that align with specific use cases:

| Benefit | Description |
|---------|-------------|
| **Consistency** | Centralize prompt logic, rather than embed prompt text in each action. |
| **Reusability** | Apply the same prompt across multiple workflows. |
| **Maintainability** | Tweak prompt logic in a single place without editing the entire flow. |
| **Dynamic control** | Workflow inputs directly pass into the template, for example, values from a form, database, or API. |

All these benefits help you create adaptable AI-driven flows that are suitable for scalable enterprise automation - without duplicating effort.

For more information, see the following documentation:

- [What is Azure Logic Apps](/azure/logic-apps/logic-apps-overview)?
- [What is Azure OpenAI Service](/azure/ai-services/openai/overview)?

## Review the example scenario

This guide uses an example scenario that creates a chat assistant for an IT team. Among other responsibilities, the team procures hardware such as laptops for the company's employees. The requirements for this assistant include the following tasks:

- Accept a question that uses natural language and understands context.
- Read and search structured data such as past orders and catalog details.
- Pass the results into a prompt template by using Jinja2 syntax to dynamically inject data at runtime.
- Generate a polished and professional response.

The example workflow uses the following operations:

| Operation | Description |
|-----------|-------------|
| Built-in trigger named **When an HTTP request is available** | Waits for a external caller to send an HTTPS request. This request fires the trigger to start the workflow and passes in a serialized token string with the inputs for the workflow actions. |
| Several **Compose** built-in actions | These actions store the following test data: <br><br>- **Question**: The question asked. <br><br>- **Product catalog**: Internal product catalog entries. <br><br>- **Employee**: Employee profile and past procurement orders. |
| Built-in action named **Get chat completions using Prompt Template** | |

> [!TIP]
>
> When you have the choice, always choose the built-in ("in app") operation over the managed ("shared") version. 
> The built-in version runs inside the Azure Logic Apps runtime to reduce latency and provides better performance  
> and control over authentication.

This example creates and uses a prompt template that lets your workflow complete the following tasks:

- Define a prompt with placeholders such as **`{{ customer.orders }}`**.
- Automatically populate the template with outputs from earlier actions in the workflow.
- Generate consistent and structured prompts with minimal effort.

To following along with the example, get the [sample prompt template and inputs](https://github.com/Azure/logicapps/tree/shahparth-lab-patch-2/AI-sample-demo) from the Azure Logic Apps GitHub repo. The example assumes that you're simulating procurement data with test inputs.

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A Standard logic app resource with a blank *stateful* workflow, which stores run history and the values for variables, inputs, and outputs that you can use for testing.

  To create this resource and workflow, see [Create an example Standard logic app workflow using the Azure portal](/azure/logic-apps/create-single-tenant-workflows-azure-portal).

- An [Azure OpenAI Service resource](/azure/ai-services/openai/how-to/create-resource?pivots=web-portal) with a deployed GPT model such as GPT-3.5 or GP-4.

  - To chat with your own data by using the Azure OpenAI Service models, you have to create an Azure AI Foundry project and add your own data source. For more information, see the following documentation:

    - [Quickstart: Chat with Azure OpenAI models using your own data](/azure/ai-services/openai/use-your-data-quickstart)

    - [Getting started with customizing a large language model (LLM)](/azure/ai-services/openai/concepts/customizing-llms)

  - When you add the **Azure OpenAI** action to your workflow, you can create a connection to your Azure OpenAI Service resource. You'll need the endpoint URL for your **Azure OpenAI Service** resource and the following information, based on the authentication type that you choose:

    | Authentication type | Requirements |
    |---------------------|--------------|
    | **URL and key-based authentication** | 1. Go to your **Azure OpenAI Service** resource. <br><br>2. On the resource menu, under **Resource Management**, select **Keys and Endpoint**. <br><br>3. Copy the **Endpoint** URL and either **Key** value. Store these values somewhere safe. |
    | **Active Directory OAuth** | Set up your logic app resource for [OAuth 2.0 with Microsoft Entra ID authentication](/entra/architecture/auth-oauth2). |
    | **Managed identity** | 1. Follow [these steps to set up the managed identity for your logic app and access to your Azure OpenAI resource](/azure/logic-apps/authenticate-with-managed-identity?tabs=standard). <br><br>2. Go to your **Azure OpenAI Service** resource. <br><br>3. On the resource menu, under **Resource Management**, select **Keys and Endpoint**. <br><br>4. Copy the **Endpoint** URL. Store this value somewhere safe. |

## Add a trigger

1. Sign in to the [Azure portal](https://portal.azure.com) with your Azure account credentials.

1. Open your Standard logic app resource and blank workflow in the designer.



## Add the Azure OpenAI action

1. 


## Related content

