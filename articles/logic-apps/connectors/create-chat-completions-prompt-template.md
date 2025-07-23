---
title: Create chat completions in workflows with prompt templates
description: Build workflows with chat interactions by using Azure Logic Apps and Azure OpenAI prompt templates.
services: logic-apps
author: ecfan
ms.suite: integration
ms.reviewers: estfan, shahparth, azla
ms.topic: how-to
ms.collection: ce-skilling-ai-copilot
ms.date: 05/06/2025
ms.update-cycle: 180-days
# Customer intent: I want to create chat completions in Standard workflows by using a prompt template to make answering questions easier. I want to connect to an Azure OpenAI resource and use built-in chat completions operation with the prompt template in Azure Logic Apps.
---

# Create chat completions with prompt templates in Standard workflows for Azure Logic Apps (Preview)

[!INCLUDE [logic-apps-sku-standard](../../../includes/logic-apps-sku-standard.md)]

> [!NOTE]
>
> This capability is in preview and is subject to the
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Suppose you want to automate the way that your enterprise or organization answers questions from various groups of people, such as employees, customers, investors, or the media. You can add chat interactions that respond to questions by using the **Azure OpenAI Service** action named **Get chat completions using Prompt Template** and data from your enterprise or organization.

When you use your own data with the models in Azure OpenAI Service, you create an AI-powered conversation platform that provides faster communication and draws context from specific domain knowledge. To build a process that handles each question, accesses your data source, and returns a response, create a Standard workflow in Azure Logic Apps to automate the necessary steps - all without writing code.

This guide shows how to add chat interactions to a Standard workflow by using a *prompt template* as the starting point. This template is a prebuilt reusable text-based structure that guides the interactions between the AI model and the questioners.

The following diagram shows the example workflow that this guide creates:

:::image type="content" source="media/create-chat-completions-prompt-template/overview.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, and operations that create an example chat assistant." lightbox="media/create-chat-completions-prompt-template/overview.png":::

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
| Built-in trigger named **When an HTTP request is available** | Waits for an HTTPS request to arrive from external caller. This request causes the trigger to fire, start the workflow, and pass in a serialized token string with inputs for the workflow actions to use. |
| Three **Compose** built-in actions | These actions store the following test data: <br><br>- **Employee**: Employee profile and past procurement orders. <br><br>- **Question**: The question asked. <br><br>- **Products**: Internal product catalog entries. |
| Built-in action named **Get chat completions using Prompt Template** | Gets [chat completions](/azure/ai-services/openai/how-to/chatgpt) for the specified prompt template. For more information, see [Get chat completions using prompt template](/azure/logic-apps/connectors/built-in/reference/openai/#get-chat-completions-using-prompt-template-(preview)).

> [!TIP]
>
> When you have the choice, always choose the built-in ("in app") operation over the 
> managed ("shared") version. The built-in version runs inside the Azure Logic Apps 
> runtime to reduce latency and provides better performance and control over authentication.

This example creates and uses a prompt template that lets your workflow complete the following tasks:

- Define a prompt with placeholders such as **`{{ Employee.orders }}`**.
- Automatically populate the template with outputs from earlier actions in the workflow.
- Generate consistent and structured prompts with minimal effort.

To follow the example, download the [sample prompt template and inputs](https://github.com/Azure/logicapps/tree/shahparth-lab-patch-2/AI-sample-demo) from the Azure Logic Apps GitHub repo. The example assumes that you're simulating procurement data with test inputs.

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A Standard logic app resource with a blank *stateful* workflow, which stores run history and the values for variables, inputs, and outputs that you can use for testing.

  To create this resource and workflow, see [Create an example Standard logic app workflow using the Azure portal](/azure/logic-apps/create-single-tenant-workflows-azure-portal).

- An [Azure OpenAI Service resource](/azure/ai-services/openai/how-to/create-resource?pivots=web-portal) with a deployed model such as GPT-3.5 or GPT-4.

  - The example in this how-to guide provides test data that you can use to try out the workflow. To chat with your own data by using the Azure OpenAI Service models, you have to create an Azure AI Foundry project and add your own data source. For more information, see the following documentation:

    - [Quickstart: Chat with Azure OpenAI models using your own data](/azure/ai-services/openai/use-your-data-quickstart)

    - [Getting started with customizing a large language model (LLM)](/azure/ai-services/openai/concepts/customizing-llms)

  - When you add the **Azure OpenAI** action to your workflow, you can create a connection to your Azure OpenAI Service resource. You need the endpoint URL from your **Azure OpenAI Service** resource and the following information, based on the selected [authentication type](/azure/logic-apps/connectors/built-in/reference/openai/#authentication):

    | Authentication type | Required values to find |
    |---------------------|-------------------------|
    | **URL and key-based authentication** | 1. Go to your **Azure OpenAI Service** resource. <br><br>2. On the resource menu, under **Resource Management**, select **Keys and Endpoint**. <br><br>3. Copy the **Endpoint** URL and either **Key** value. Store these values somewhere safe. |
    | **Active Directory OAuth** | 1. Set up your logic app resource for [OAuth 2.0 with Microsoft Entra ID authentication](/entra/architecture/auth-oauth2). <br><br>2. Go to your **Azure OpenAI Service** resource. <br><br>3. On the resource menu, under **Resource Management**, select **Keys and Endpoint**. <br><br>4. Copy the **Endpoint** URL. Store this value somewhere safe. |
    | **Managed identity** <br>(Recommended) | 1. Follow the [general steps to set up the managed identity with Microsoft Entra ID for your logic app](/azure/logic-apps/authenticate-with-managed-identity?tabs=standard). <br><br>2. Go to your **Azure OpenAI Service** resource. <br><br>3. On the resource menu, under **Resource Management**, select **Keys and Endpoint**. <br><br>4. Copy the **Endpoint** URL. Store this value somewhere safe. |

    [!INCLUDE [highest-security-level-guidance](../includes/highest-security-level-guidance.md)]

[!INCLUDE [api-test-http-request-tools-bullet](../../../includes/api-test-http-request-tools-bullet.md)]

## Add a trigger

Your workflow requires a trigger to control when to start running. You can use any trigger that fits your scenario. For more information, see [Triggers](/azure/connectors/introduction#triggers).

Add the trigger by following these steps:

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource and blank workflow in the designer.

1. Follow the [general steps to add the trigger that you want](/azure/logic-apps/create-workflow-with-trigger-or-action?tabs=standard#add-trigger).

   This example uses the **Request** trigger named **When an HTTP request is available**. For more information about this trigger, see [Receive and respond to inbound HTTPS calls](/azure/connectors/connectors-native-reqres?tabs=standard).

1. Save the workflow. On the designer toolbar, select **Save**.

   After you save the workflow, a URL appears in the **HTTP URL** parameter for the **Request** trigger. This URL belongs to an endpoint that is created for the **Request** trigger. To fire the trigger and start the workflow, callers outside the workflow can send HTTPS requests to the URL and include inputs for the trigger to pass along into the workflow.

   > [!WARNING]
   >
   > The endpoint URL includes a Shared Access Signature (SAS) key that gives anyone with the URL 
   > the capability to trigger the workflow and pass along any data they want. For information about 
   > protecting and securing the workflow, see [Secure access and data in workflows](/azure/logic-apps/logic-apps-securing-a-logic-app?tabs=azure-portal#generate-a-shared-access-signature-sas-key-or-token).

When you're done, your workflow looks like the following example:

:::image type="content" source="media/create-chat-completions-prompt-template/request-trigger.png" alt-text="Screenshot shows the Standard workflow designer and the Request trigger." lightbox="media/create-chat-completions-prompt-template/request-trigger.png":::

## Add the Compose actions

To add operations that store the trigger outputs for subsequent actions to use as inputs, follow these steps:

1. Under the trigger, follow the [general steps to add the data operation named **Compose** action](/azure/logic-apps/create-workflow-with-trigger-or-action?tabs=standard#add-action).

   The example adds three **Compose** actions and uses the following test data as inputs:

   1. Rename the first **Compose** action as **Employee**, and enter the following data in the **Inputs** box:

      ```json
      {
          "firstName": "Alex",
          "lastName": "Taylor",
          "department": "IT",
          "employeeId": "E12345",
          "orders": [
              { 
                  "name": "Adatum Streamline 5540 Laptop",
                  "description": "Ordered 15 units for Q1 IT onboarding",
                  "date": "2024/02/20"
              },
              {
                  "name": "Docking Station",
                  "description": "Bulk purchase of 20 Adatum AB99Z docking stations",
                  "date": "2024/01/10"
              }
          ]
      }
      ```

   1. Rename the next **Compose** action as **Question**, and enter the following data in the **Inputs** box:

      ```json
      [
          {
              "role": "user",
              "content": "When did we last order laptops for new hires in IT?"
          }
      ]
      ```

   1. Rename the next **Compose** action as **Products**, and enter the following data in the **Inputs** box:

      ```json
      [
          {
              "id": "1",
              "title": "Adatum Streamline 5540 Laptop",
              "content": "i7, 16GB RAM, 512GB SSD, standard issue for IT new hire onboarding" 
          },
          {
              "id": "2",
              "title": "Docking Station",
              "content": "Adatum AB99Z docking stations for dual monitor setup"
          }
      ]
      ```

When you're done, your workflow looks like the following example:

:::image type="content" source="media/create-chat-completions-prompt-template/compose-actions.png" alt-text="Screenshot shows the Standard workflow designer, Request trigger, and three renamed Compose actions." lightbox="media/create-chat-completions-prompt-template/compose-actions.png":::

Now, add the Azure OpenAI action to the workflow.

## Add the Azure OpenAI action

1. Under the last **Compose** action, follow the [general steps to add the **Azure OpenAI** action named **Get chat completions using Prompt Template**](/azure/logic-apps/create-workflow-with-trigger-or-action?tabs=standard#add-action).

1. After the action appears on the designer surface, the connection pane opens so that you can provide the following information:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Connection Name** | Yes | <*connection-name*> | The name for the connection to your Azure OpenAI resource. |
   | **Authentication Type** | Yes | See the following sections: <br><br>- [Prerequisites](#prerequisites) <br>- [Azure OpenAI built-in connector authentication](/azure/logic-apps/connectors/built-in/reference/openai/#authentication) | The authentication type to use with the connection. |
   | **Azure OpenAI Endpoint URL** | Yes | <*endpoint-URL-Azure-OpenAI-resource*> | The endpoint URL for your Azure OpenAI resource. For more information, see [Prerequisites](#prerequisites). |
   | **Authentication Key** | Required only for **URL and key-based authentication** | <*access-key*> | See the following sections: <br><br>- [Prerequisites](#prerequisites) <br>- [Azure OpenAI built-in connector authentication](/azure/logic-apps/connectors/built-in/reference/openai/#authentication) |

1. When you're done, select **Create new**.

1. After the action pane opens, on the **Parameters** tab, provide the following information to use for the prompt template:

   | Parameter | Value | Description |
   |-----------|-------|-------------|
   | **Deployment Identifier** | - **gpt-4o** <br>- **gpt-35** | The name for the Azure OpenAI deployed model, which should match the one that you used for your Azure OpenAI resource. |
   | **Prompt Template** | <*template-text*> | The prompt template. For more information, see [Get chat completions using Prompt Template](/azure/logic-apps/connectors/built-in/reference/openai/#get-chat-completions-using-prompt-template-(preview)). |

   For this example, replace the example template text with the following sample text:

   ```
   system:
   You are an AI assistant for Contoso's internal procurement team. You help employees get quick answers about previous orders and product catalog details. Be brief, professional, and use markdown formatting when appropriate. Include the employee’s name in your response for a personal touch.

   # Employee info
   Name: {{Employee.firstName}} {{Employee.lastName}}
   Department: {{Employee.department}}
   Employee ID: {{Employee.employeeId}}

   # Question
   The employee asked the following:

   {% for item in question %}
   {{item.role}}:
   {{item.content}}
   {% endfor %}

   # Product catalog
   Use this documentation to guide your response. Include specific item names and any relevant descriptions.

   {% for item in Products %}
   Catalog item ID: {{item.id}}
   Name: {{item.title}}
   Description: {{item.content}}
   {% endfor %}

   # Order history
   Here is the employee's procurement history to use as context when answering their question.

   {% for item in Employee.orders %}
   Order Item: {{item.name}}
   Details: {{item.description}} — Ordered on {{item.date}}
   {% endfor %}
   
   Based on the product documentation and order history above, provide a concise and helpful answer to their question. Don't fabricate information beyond the provided inputs.
   ```

   The following table describes how the example template works:

   | Template element	| Task |
   |------------------|------|
   | **`{{ Employee.firstName }} {{ Employee.lastName }}`** |	Displays the employee name. |
   | **`{{ Employee.department }}`** | Adds department context. |
   | **`{{ Question[0].content }}`** | Injects the employee's question from the **Compose** action named **Question**. |
   | **`{% for doc in Products %}`** | Loops through catalog data from the **Compose** action named **Products**. |
   | **`{% for order in Employee.orders %}`** | Loops through the employee's order history from the **Compose** action named **Employee**. |

   Each element value is dynamically pulled from the workflow's **Compose** actions - all without any code or external services needed. You can apply the same approach to reference data output from other operations, for example, a SharePoint list, SQL Server row, email body, or even AI Search results. You only have to map the outputs into the prompt template and let your workflow do the rest.

1. From the **Advanced parameters** list, select **Prompt Template Variable**, which now appears on the **Parameters** tab.

1. In the key-value table that appears on the **Parameters** tab, enter the following template variable names and outputs selected from the preceding **Compose** actions in the workflow, for example:

   1. On the first row, in the first column, enter **Employee** as the variable name.

   1. On the same row, in the next column, select inside the edit box, and then select the lightning icon to open the dynamic content list.

   1. From the dynamic content list, under **Employee**, select **Outputs**.

      :::image type="content" source="media/create-chat-completions-prompt-template/template-variable.png" alt-text="Screenshot shows an action named Get chat completions using Prompt Template, Prompt Template Variable table, open dynamic content list, and selected Outputs value in the Question section." lightbox="media/create-chat-completions-prompt-template/template-variable.png":::

   1. Repeat the same steps on the next row and following row for **Question** and **Products**.

   When you're done, the table looks like the following example:

   :::image type="content" source="media/create-chat-completions-prompt-template/template-variables-complete.png" alt-text="Screenshot shows completed Prompt Template Variable table with Question, Product catalog, and Employee outputs." lightbox="media/create-chat-completions-prompt-template/template-variables-complete.png":::

1. For other parameters, see [Get chat completions using Prompt Template](/azure/logic-apps/connectors/built-in/reference/openai/#get-chat-completions-using-prompt-template-(preview)).

When you're done, your workflow looks like the following example:

:::image type="content" source="media/create-chat-completions-prompt-template/chat-completions-prompt-template.png" alt-text="Screenshot shows the Standard workflow designer, Request trigger, three renamed Compose actions, and the Azure OpenAI built-in action, Get chat completions using Prompt Template." lightbox="media/create-chat-completions-prompt-template/chat-completions-prompt-template.png":::

## Test your workflow

1. To trigger your workflow, send an HTTPS request to the callback URL for the **Request** trigger, including the method that the **Request** trigger expects, by using your HTTP request tool, based on the instructions.

   For more information about the trigger's underlying JSON definition and how to call this trigger, see the following documentation:

   - [**Request** trigger type](/azure/logic-apps/logic-apps-workflow-actions-triggers#request-trigger)

   - [Receive and respond to inbound HTTPS calls to workflows in Azure Logic Apps](/azure/connectors/connectors-native-reqres?tabs=standard)

   After workflow execution completes, the run history page opens to show the status for each action.

   :::image type="content" source="media/create-chat-completions-prompt-template/run-history.png" alt-text="Screenshot shows run history for most recently complete workflow with status for each operation." lightbox="media/create-chat-completions-prompt-template/run-history.png":::

   1. To find the run history page for a specific workflow run at a later time, follow these steps:

      1. On the workflow menu, under **Tools**, select **Run history**.

      1. On the **Run history** tab, select the workflow run to inspect.

1. To find the chat response, on the run history page, select the Azure OpenAI action.

   A pane opens to show the inputs and outputs for the selected action.

1. On the opened pane, scroll to the **Outputs** section.

   :::image type="content" source="media/create-chat-completions-prompt-template/chat-response.png" alt-text="Screenshot shows the run history for most recently complete workflow with status for each operation and selected Azure OpenAI action with inputs and outputs." lightbox="media/create-chat-completions-prompt-template/chat-response.png":::

   The response is entirely based on the structured context that is passed into your workflow—no extra fine-tuning needed.

## Clean up resources

If you don't need the resources that you created for this guide, make sure to delete the resources so that you don't continue to get charged. You can either follow these steps to delete the resource group that contains these resources, or you can delete each resource individually.

1. In the Azure search box, enter **resource groups**, and select **Resource groups**.

1. Find and select the resource groups that contain the resources for this example.

1. On the **Overview** page, select **Delete resource group**.

1. When the confirmation pane appears, enter the resource group name, and select **Delete**.

## Related content

- [Connect to Azure AI services from workflows in Azure Logic Apps](/azure/logic-apps/connectors/azure-ai)
