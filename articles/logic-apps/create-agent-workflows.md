---
title: Create Workflows with AI Agents and Models
description: Build workflows that use AI agents and models in Azure OpenAI Service to complete tasks by using Azure Logic Apps.
service: ecfan
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, divswa, karansin, krmitta, kewear, azla
ms.topic: how-to
ms.collection: ce-skilling-ai-copilot
ms.date: 05/19/2025
ms.update-cycle: 180-days
# Customer intent: As a logic app workflow developer, I want to automate workflows that complete tasks with AI agents and other AI capabilities for my integration scenarios by using Azure Logic Apps.
ms.custom:
  - build-2025
---

# Create workflows that use AI agents and models to complete tasks in Azure Logic Apps (Preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!IMPORTANT]
>
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In Azure Logic Apps, you can create workflows that handle questions and then run interactively or autonomously to complete tasks by using *agents* connected to *large language models (LLMs)* in Azure OpenAI Service. An agent uses an iterative looped process to solve complex, multi-step problems. A large language model is a program that's trained to recognize patterns and perform jobs without human interaction.

In workflows, an agent provides the following capabilities and benefits when connected to a model in Azure OpenAI Service:

- Accept instructions about the agent's role, how to operate, and how to respond.
- Receive and respond to requests (prompts) autonomously or interactively through chat.
- Process inputs, analyze data, and make choices, based on available information.
- Choose tools to complete the tasks necessary to fulfill requests. A *tool* is a sequence with one or more actions that complete a task.
- Adapt to environments that require flexibility and are fluid, dynamic, unpredictable, or unstable.

With [1,400+ connectors](/connectors/connector-reference/connector-reference-logicapps-connectors) that provide actions that you can use to create tools in an agent, agent workflows support a vast range of scenarios that can greatly benefit from agent and model capabilities. Based on your use cases, the agent can perform work with or without human interaction.

The following diagram shows an example agent workflow that you create in this guide. The workflow uses an agent to get the weather forecast and send that forecast in email. The diagram shows the agent information pane where you set up the agent and provide instructions about what the agent does:

:::image type="content" source="media/create-agent-workflows/weather-example.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, and example for agent workflow type." lightbox="media/create-agent-workflows/weather-example.png":::

For the high-level steps that describe how the agent works and more overview information about agent workflows, see [AI agent workflows in Azure Logic Apps](/azure/logic-apps/agent-workflows-concepts).

This guide shows how to create an example Standard workflow with the **Agent** type that initially interacts with you through a chat interface. To fulfill requests, the agent uses tools that you create to complete the necessary tasks. Later, the guide provides instructions for how you can convert the agent to work autonomously without human interaction.

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A new or existing Standard logic app resource or project. You can work in either development environment:

  - Azure portal: A Standard logic app resource.

    If you don't have this resource, see [Create an example Standard workflow in the Azure portal](/azure/logic-apps/create-single-tenant-workflows-azure-portal).

  - Visual Studio Code: A Standard logic app project.

    Make sure that you have the latest **Azure Logic Apps (Standard) extension for Visual Studio Code**. If you don't have this project, see [Create Standard workflows in Visual Studio Code](/azure/logic-apps/create-standard-workflows-visual-studio-code).

  The examples in this guide use the Azure portal. However, after you open the workflow designer, the steps to use the designer are mostly similar for the portal and Visual Studio Code. Some interactions have minor differences along the way.

- An [Azure OpenAI Service](/azure/ai-services/openai/overview) resource.

  You need the resource name when you create a connection to your deployed model in Azure OpenAI Service from an agent in your workflow.

  If you don't have this resource, see [Create and deploy an Azure OpenAI Service resource](/azure/ai-services/openai/how-to/create-resource?pivots=web-portal).

- A deployed [Azure OpenAI Service model](/azure/ai-services/openai/concepts/models) for your Azure OpenAI Service resource.

  Agent workflows support only specific models. For more information, see [Supported models in Azure OpenAI Service](#supported-models-for-agent-workflows).

  If you don't have a model, see [Deploy a model](/azure/ai-services/openai/how-to/create-resource?pivots=web-portal#deploy-a-model).

  > [!IMPORTANT]
  >
  > Although agent workflows don't incur extra charges in Azure Logic Apps, 
  > model usage in Azure OpenAI Service incurs charges. For more information, see 
  > [Azure OpenAI Service pricing](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/#pricing).

- The authentication details to use when you create a new connection between an agent and your deployed model in Azure OpenAI Service.

  - Managed identity authentication

    This connection supports authentication by using Microsoft Entra ID with a [managed identity](/entra/identity/managed-identities-azure-resources/overview). In production scenarios, Microsoft strongly recommends that you use a managed identity when possible because this option provides optimal and superior security at no extra cost. Azure manages this identity for you, so you don't have to provide or manage sensitive information such as credentials or secrets. This information isn't even accessible to individual users. You can use managed identities to authenticate access for any resource that supports Microsoft Entra authentication.

    To use managed identity authentication, your Standard logic app resource must enable the system-assigned managed identity. By default, the system-assigned managed identity is enabled on a Standard logic app. This release currently doesn't support using the user-assigned managed identity.

    > [!NOTE]
    >
    > If the system-assigned identity is disabled, [reenable the identity](/azure/logic-apps/authenticate-with-managed-identity?tabs=standard#enable-system-assigned-identity-in-the-azure-portal). 

    The system-assigned identity requires one of the following roles for Microsoft Entra role-based access (RBAC), based on the [principle of least privilege](/entra/identity-platform/secure-least-privileged-access):

    - **Cognitive Services OpenAI User** (least privileged)

    - **Cognitive Services OpenAI Contributor** 

    For more information about managed identity setup, see the following resources:

    - [Authenticate access and connections with managed identities in Azure Logic Apps](/azure/logic-apps/authenticate-with-managed-identity?tabs=standard)
    - [Role-based access control for Azure OpenAI Service](/azure/ai-services/openai/how-to/role-based-access-control)
    - [Training: Azure OpenAI RBAC roles](/training/modules/intro-azure-openai-managed-identity-auth-dotnet/2-azure-openai-rbac-roles)
    - [Best practices for Microsoft Entra roles](/entra/identity/role-based-access-control/best-practices)
    - [Connect the agent to your deployed model](#connect-the-agent-to-your-deployed-model)

  - URL and key-based authentication

    This connection supports authentication by using the endpoint URL and API key for your deployed model in Azure OpenAI Service. However, you don't have to manually find these values before you create the connection. The values automatically appear when you select your Azure OpenAI Service resource.

    > [!IMPORTANT]
    >
    > Use this option only for the examples in this guide, exploratory scenarios, 
    > non-production scenarios, or if your organization's policy specifies that you 
    > can't use managed identity authentication.
    >
    > In general, make sure that you secure and protect sensitive data and personal 
    > data, such as credentials, secrets, access keys, connection strings, certificates, 
    > thumbprints, and similar information with the highest available or supported level 
    > of security. Don't hardcode sensitive data, share with other users, or save in plain 
    > text anywhere that others can access. Set up a plan to rotate or revoke secrets in 
    > the case they become compromised. For more information, see the following resources:
    >
    > - [Best practices for protecting secrets](/azure/security/fundamentals/secrets-best-practices)
    > - [Secrets in Azure Key Vault](/azure/key-vault/secrets/) 
    > - [Automate secrets rotation in Azure Key Vault](/azure/key-vault/secrets/tutorial-rotation)

    For more information, see [Connect the agent to your deployed model](#connect-the-agent-to-your-deployed-model).

- To follow along with the examples, you need an email account to send email.

  The examples in this guide use an Outlook.com account. For your own scenarios, you can use any supported email service or messaging app in Azure Logic Apps, such as Office 365 Outlook, Microsoft Teams, Slack, and so on. The setup for other email services or apps are generally similar to the examples, but have minor differences.

## Supported models for agent workflows

Agent workflows support only specific models in Azure OpenAI Service. The following list identifies these models that you can use for agent workflows:

- **gpt-4.1**
- **gpt-4.1-mini**
- **gpt-4.1-nano**
- **gpt-4o**
- **gpt-4o-mini**
- **gpt-4**
- **gpt-35-turbo**

For more information, such as model capabilities and region availability or how to deploy a model, see the following documentation:

- [Azure OpenAI Service models](/azure/ai-services/openai/concepts/models)
- [Deploy a model](/azure/ai-services/openai/how-to/create-resource?pivots=web-portal#deploy-a-model)

## Limitations and known issues

The following table describes the current limitations and any known issues in this release.

| Limitation | Description |
|------------|-------------|
| Supported workflow types | To create an agent workflow, you must select the **Agent** workflow type. You can't start with the **Stateful** or **Stateless** workflow type, and then add an agent. |
| Authentication | For managed identity authentication, you can use only the system-assigned managed identity at this time. Support is currently unavailable for the user-assigned managed identity. |
| Agent tools | - To create tools, you can use only actions, not triggers. <br><br>- A tool starts with action and always contains at least one action. <br><br>- A tool works only inside the agent where that tool exists. |
| Agent chat interface - **Channels** tab | On an agent's information pane, the **Channels** tab controls whether you can use the chat interface to exchange messages with the agent. <br><br>- If your agent workflow has multiple agents, only one agent can have channels enabled at any one time. <br><br>- Chat interactions are scoped to a single agent. |
| Chat history context length (token limit) | For chat conversations, an agent has a default limit on the number of [tokens](/azure/ai-services/openai/overview#tokens) to keep in chat history and to pass into the model as context for the next chat interaction. This limit is called the *context length* and can differ across models. For more information, see the following documentation: <br><br>- [Azure OpenAI Service models](/azure/ai-services/openai/concepts/models) <br>- [Manage chat history context length](create-agent-workflows.md#manage-chat-history-context-length) <br>- [Model maximum context length exceeded](create-agent-workflows.md#model-maximum-context-length-exceeded) |
| General limits | For general information about the limits in Azure Logic Apps and Azure OpenAI Service, see the following documentation: <br><br>- [Azure OpenAI Service quotas and limits](/azure/ai-services/openai/quotas-limits) <br>- [Azure OpenAI Service models](/azure/ai-services/openai/concepts/models) <br>- [Azure Logic Apps limits and configuration](/azure/logic-apps/logic-apps-limits-and-config) |

## Create an agent workflow

Follow these steps to create a partial workflow with an empty **Default Agent**. By default, the chat interface on this agent isn't interactive. In a later section, you can make this agent interactive by changing the default *channels* settings. For guidance about making an interactive agent into a non-interactive agent, see [Set up an autonomous agent](#set-up-an-autonomous-agent).

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the logic app menu, under **Workflows**, select **Workflows**.

1. On the **Workflows** page toolbar, select **Add** > **Add**.

1. On the **Create Workflow** pane, complete the following steps:

   1. For **Workflow name**, provide a name for your workflow to use.

   1. Select **Agent** > **Create**.

   :::image type="content" source="media/create-agent-workflows/create-agent-workflow.png" alt-text="Screenshot shows Standard logic app resource with open Workflows page and Create workflow pane with workflow name, selected Agent option, and Create button." lightbox="media/create-agent-workflows/create-agent-workflow.png":::

   The designer opens and shows a partial workflow, which includes an empty **Default Agent** that you need to set up when you're ready. Before you can save your workflow, you must complete the following setup tasks for the agent:

   - Create a connection to your deployed model in Azure OpenAI Service. You complete this task in a later section.

   - Provide system instructions that describe the roles that the agent plays, the tasks that the agent can perform, and other information to help the agent better understand how to operate. You also complete this task in a later section.

   :::image type="content" source="media/create-agent-workflows/agent-workflow-start.png" alt-text="Screenshot shows workflow designer with Add a trigger and empty Default Agent." lightbox="media/create-agent-workflows/agent-workflow-start.png":::

1. Continue to the next section for adding a trigger.

## Add a trigger

Your workflow requires a trigger to control when to start running. You can use any trigger that fits your scenario. For more information, see [Triggers](/azure/connectors/introduction#triggers).

To add a trigger, follow these steps:

1. On the designer, select **Add trigger**.

1. On the **Add a trigger** pane, follow these [general steps to add a trigger for your scenario](/azure/logic-apps/create-workflow-with-trigger-or-action?tabs=standard#add-trigger).

   This example uses the **Request** trigger named **When a HTTP request is received**.

   :::image type="content" source="media/create-agent-workflows/request-trigger.png" alt-text="Screenshot shows workflow designer with Request trigger and Default Agent." lightbox="media/create-agent-workflows/request-trigger.png":::

   This particular trigger waits to receive HTTPS requests sent from callers outside the workflow. You can use these requests to include data that the trigger accepts as workflow inputs. The trigger passes along this data as outputs, which subsequent actions can use in the workflow. For more information, see [Receive and respond to inbound HTTPS calls](/azure/connectors/connectors-native-reqres).

   For the examples in this guide, you don't have to do anything else for this trigger. The examples show other ways that you can provide inputs for the agent and other actions to use.

1. Continue to [Rename the agent](#rename-the-agent).

   > [!NOTE]
   >
   > If you try to save the workflow now, the designer toolbar shows a red dot on the **Errors** 
   > button. The designer alerts you to this error condition because the agent requires setup 
   > before you can save any changes. However, you don't have to set up the agent now. You can 
   > continue to create your workflow. Just remember to set up the agent before you save your workflow.
   >
   > :::image type="content" source="media/create-agent-workflows/error-missing-default-agent-settings.png" alt-text="Screenshot shows workflow designer toolbar with Errors button with red dot and error in default agent information pane." lightbox="media/create-agent-workflows/error-missing-default-agent-settings.png":::

## Rename the agent

Clearly identify the agent's purpose by updating the agent name in following steps:

1. On the designer, select the agent title bar to open the agent information pane.

1. In the information pane, select the agent name, and enter the new name, for example, **Weather agent**.

   :::image type="content" source="media/create-agent-workflows/rename-agent.png" alt-text="Screenshot shows workflow designer, workflow trigger, and renamed agent." lightbox="media/create-agent-workflows/rename-agent.png":::

1. Continue to [Connect the agent to your deployed model](#connect-the-agent-to-your-deployed-model).

## Connect the agent to your deployed model

Create a connection between the agent and your deployed model in Azure OpenAI Service by following these steps:

1. On the designer, select the title bar on the **Default Agent** to open the agent information pane.

1. On the **Parameters** tab, for **Deployment Model Name**, provide the name that you gave to your deployed model.

   This example uses **gpt-40-test**.

1. Above the **Deployment Model Name** box, select the ellipses (**...**) button, and then select **Create**.

1. In the **Create a new connection** section that appears, provide the following information:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Connection Name** | Yes | <*connection-name*> | A name to use for the connection to your deployed model in Azure OpenAI Service. <br><br>This example uses **fabrikam-azureopenai-connection**. |
   | **Authentication Type** | Yes | <br><br>- **URL and key-based authentication** <br><br>- **Managed identity** | The authentication type to use when validating and authorizing an identity for access to your deployed model. <br><br>- The **URL and key-based authentication** type requires the endpoint URL and API key for your deployed model. These values automatically appear when you select your Azure OpenAI Service resource. <br><br>- The **Managed identity** type requires that your Standard logic app have a managed identity enabled and set up with the required roles for role-based access. For more information, see [Prerequisites](#prerequisites). <br><br>**Important**: For the examples and exploration only, use **URL and key-based authentication**. For production scenarios, use **Managed identity**. |
   | **Subscription** | Yes | <*Azure-subscripton*> | The Azure subscription associated with your Azure OpenAI Service resource. |
   | **Azure OpenAI Resource** | Yes | <*Azure-OpenAI-Service-resource-name*> | The name for your Azure OpenAI Service resource. |
   | **API Endpoint** | Yes | Automatically populated | The endpoint URL for your deployed model in Azure OpenAI Service. <br><br>This example uses **`https://fabrikam-azureopenai.openai.azure.com/`**. |
   | **API Key** | Yes | Automatically populated | The API key for your deployed model in Azure OpenAI Service. |

   The following example shows the connection information for a deployed model in Azure OpenAI Service:

   :::image type="content" source="media/create-agent-workflows/model-connection.png" alt-text="Screenshot shows example connection details for a deployed model in Azure OpenAI Service." lightbox="media/create-agent-workflows/model-connection.png":::

1. When you're done, select **Create new**.

   After you successfully create the connection, the connection name replaces the **Create a new connection** section.

   Whenever you want to create another connection, on the **Parameters** tab, above the **Deployment Model Name** box, select the ellipses (**...**) button, and then select **Create**.

1. Continue to the next section.

## Set up chat interactions for the agent

By default, an agent operates autonomously and doesn't accept prompts in the agent chat interface during a workflow run. This behavior means that the agent uses only the following data:

- System instructions about the roles and tasks that the agent can perform.
- Predefined prompts, questions, or requests.
- Outputs from tools in the agent.
- Outputs from the trigger and actions that precede the agent in the workflow.
- Outputs generated from the model.

However, you can make the agent accept prompts by changing the agent's channels settings. For example, if you have both active input and output channels when the workflow runs, you can enter prompts in the agent chat box, and the agent responds in the agent chat pane.

[If your workflow has a trigger that receives requests or an action that sends requests, you can use the URL in the response header to integrate a separate front-end chat interface or chat widget.]:#

The following table describes the channels options:

| Channels option | Description |
|-----------------|-------------|
| **Allow both input and output channels** | Turn on both input and output channels. While the workflow runs, you and the agent can exchange messages by using the **Agent chat** pane. You can manually enter prompts in the chat box, and the agent responds in the **Agent chat** pane. |
| **Allow only input channels** | Turn on only the input channel. While the workflow runs, you can manually enter prompts in the chat box, but the agent doesn't show the responses in the **Agent chat** pane. |
| **Do not allow channels** (Default) | By default, disable all channels. While the workflow runs, you and the agent can't exchange messages in the **Agent chat** pane. |

> [!NOTE]
>
> If an agent workflow has multiple agents, you can activate channels settings only on one agent at a time.

For the weather agent example, turn on both input and output channels by following these steps:

1. On the designer, select the title bar on the agent to open the agent information pane.

1. On the **Channels** tab, select **Allow both input and output channels**.

1. Return to the **Parameters** tab, and continue with the next section.

## Set up system instructions for the agent

The agent requires *system instructions* that describe the roles that the agent can play and the tasks that the agent can perform. To help the agent learn and understand these responsibilities, you can also include the following information:

- Workflow structure
- Available actions
- Any restrictions or limitations
- Interactions for specific scenarios or special cases

To get the best results, make sure that your system instructions are prescriptive and that you're willing to refine these instructions over multiple iterations.

1. Under **Instructions for Agent**, in the **System instructions** box, enter the information that the agent needs to operate.

   The weather agent example uses the following sample instructions:

   **You're an AI agent that answers questions about the weather. You can also send weather information in email to a provided email address. If you're asked to send the weather in email, ask for an email address, if not provided.**

   **Format your response with bullet lists when appropriate. Make your responses concise and useful, but use a conversational and friendly tone. You can include suggestions like "Carry an umbrella" or "Dress in layers".**

   The following example shows the system instructions for the agent:

   :::image type="content" source="media/create-agent-workflows/system-instructions-weather-agent.png" alt-text="Screenshot shows workflow designer, and agent with system instructions." lightbox="media/create-agent-workflows/system-instructions-weather-agent.png":::

1. Now, you can save your workflow. On the designer toolbar, select **Save**.

1. To test your workflow at this stage, follow these steps:

   1. On the designer toolbar, select **Run** > **Run**.

   1. On the workflow menu, under **Tools**, select **Run history**.

   1. On the **Run history** page, on the **Run history** tab, in the **Identifier** column, select the latest workflow run.

      > [!NOTE]
      >
      > If the page doesn't show any runs, on the toolbar, select **Refresh**. 
      >
      > The **Status** column shows a **Running** status because the agent chat 
      > pane is currently interactive and waiting for you to enter a prompt.

      The monitoring view opens and shows the workflow operations with their status. The **Agent chat** pane is open and shows the system instructions that you provided earlier. The pane also shows the agent's response to the system instructions. The chat box is open and ready for the next request.

      However, the agent doesn't have any tools to use at this time. So, even if you enter a prompt, the agent can't take any actions until you create tools for the agent.

      :::image type="content" source="media/create-agent-workflows/agent-only-test.png" alt-text="Screenshot shows monitoring view, operation status, and agent chat pane." lightbox="media/create-agent-workflows/agent-only-test.png":::

1. Return to the designer. On the monitoring view toolbar, select **Edit**.

## Create a tool to get weather forecast

For an agent to run prebuilt actions available in Azure Logic Apps, you must create one or more tools for the agent to use. A tool must contain at least one action and only actions. The agent invokes the tool by using specific arguments.

In this example, the agent needs a tool that gets the weather forecast. Build this tool by following these steps:

1. On the designer, inside the agent and under **Add tool**, select the plus sign (**+**) to open the pane where you can browse available actions.

1. On the **Add an action** pane, follow these [general steps to add an action for your scenario](/azure/logic-apps/create-workflow-with-trigger-or-action?tabs=standard#add-action).

   This example uses the **MSN Weather** action named **Get forecast for today**.

   After you select the action, both the **Tool** and the action appear inside the agent on the designer at the same time. Both information panes also open at the same time.

   :::image type="content" source="media/create-agent-workflows/added-tool-get-forecast.png" alt-text="Screenshot shows workflow designer with the Default Agent, which contains a Tool that includes the action named Get forecast for today." lightbox="media/create-agent-workflows/added-tool-get-forecast.png":::

1. On the tool information pane, change the tool name to make the purpose obvious.

   This example uses **Get weather**.

1. On the **Details** tab, for **Description**, enter the tool description.

   This example uses **Get the weather for the specified location.**

   Under **Description**, the **Agent Parameters** section applies only for specific use cases. For more information, see [Create agent parameters](#create-agent-parameters-for-the-get-forecast-action).

1. Continue to the next section so you can learn more about agent parameters, their use cases, and how to create them, based on these use cases.

## Create agent parameters for the 'Get forecast' action

Actions usually have parameters that require you to specify the values to use. Actions in tools are almost the same except for one difference. You can create agent parameters that the agent uses to specify the parameter values for actions in tools. You can specify model-generated outputs, values from non-model sources, or a mix with both. For more information, see [Agent parameters](agent-workflows-concepts.md#key-concepts).

The following table describes the use cases for creating agent parameters and where to create them, based on the use case.

| To | Where to create agent parameter |
|----|---------------------------------|
| Use model-generated outputs only. <br>Share with other actions in the same tool. | Start from the action parameter. For detailed steps, see [Use model-generated outputs only](#use-model-generated-outputs-only). |
| Use non-model values. | No agent parameters needed. <br><br>This experience is the same as the usual action setup experience in Azure Logic Apps but is repeated for convenience in [Use values from non-model sources](#use-values-from-non-model-sources). |
| Use model-generated outputs with non-model values. <br>Share with other actions in the same tool. | Start from the tool, in the **Agent Parameters** section. For detailed steps, see [Use model outputs and non-model values](#use-model-outputs-and-non-model-values).|

##### Use model-generated outputs only

For an action parameter that uses only model-generated outputs, create an agent parameter by following these steps:

1. In the tool, select the action to open the information pane.

   For this example, the action is **Get forecast for today**.

1. On the **Parameters** tab, select inside the parameter box to show the parameter options.

1. On the right edge of the **Location** box, select the stars button.

   This button has the following tooltip: **Select to generate the agent parameter**.

   :::image type="content" source="media/create-agent-workflows/generate-agent-parameter.png" alt-text="Screenshot shows an action with the mouse cursor inside a parameter box, parameter options, and the selected option to generate an agent parameter." lightbox="media/create-agent-workflows/generate-agent-parameter.png":::

   The **Create agent parameter** window shows the **Name**, **Type**, and **Location** fields, which are prepopulated from the source action parameter.

   The following table describes the fields that define the agent parameter:

   | Parameter | Value | Description |
   |-----------|-------|-------------|
   | **Name** | <*agent-parameter-name*> | The agent parameter name. |
   | **Type** | <*agent-parameter-data-type*> | The agent parameter data type. |
   | **Description** | <*agent-parameter-description*> | The agent parameter description that easily identifies the parameter's purpose. |

   > [!NOTE]
   >
   > Microsoft recommends that you follow the action's Swagger definition. For example, 
   > for the **Get forecast for today** action, which is from the **MSN Weather** "shared" 
   > connector hosted and managed by global, multitenant Azure, see the 
   > [**MSN Weather** connector technical reference article](/connectors/msnweather/#get-forecast-for-today).

1. When you're ready, select **Create**.

   The following diagram shows the example **Get weather forecast for today** action with the **Location** agent parameter:

   :::image type="content" source="media/create-agent-workflows/get-forecast-today-action.png" alt-text="Screenshot shows the Weather agent, Get weather tool, and selected action named Get forecast for today. The Location action parameter includes the created agent parameter." lightbox="media/create-agent-workflows/get-forecast-today-action.png":::

1. Save your workflow.

##### Use values from non-model sources

For an action parameter value that uses only non-model values, choose the option that best fits your use case:

**Use outputs from earlier operations in the workflow**

To browse and select from these outputs, follow these steps:

1. Select inside the parameter box, and then select the lightning icon to open the dynamic content list.

1. From the list, in the trigger or action section, select the output that you want. 

1. Save your workflow.

**Use results from expressions**

To create an expression, follow these steps:

1. Select inside the parameter box, and then select the function icon to open the expression editor.

1. Select from available functions to create the expression.

1. Save your workflow.

For more information, see [Reference guide to workflow expression functions in Azure Logic Apps](/azure/logic-apps/workflow-definition-language-functions-reference).

##### Use model outputs and non-model values

Some scenarios might need to specify an action parameter value that uses both model-generated outputs with non-model values. For example, you might want to create an email body that uses static text, non-model outputs from earlier operations in the workflow, and model-generated outputs.

For these scenarios, create the agent parameter on the tool by following these steps:

1. On the designer, select the tool where you want to create the agent parameter.

1. On the **Details** tab, under **Agent Parameters**, select **Create Parameter**.

1. Expand **New agent parameter**, and provide the following information but match the action parameter details.

   For this example, the example action is **Get forecast for today**.

   > [!NOTE]
   >
   > Microsoft recommends that you follow the action's Swagger definition. For example, 
   > to find this information for the **Get forecast for today** action, see the 
   > [**MSN Weather** connector technical reference article](/connectors/msnweather/#get-forecast-for-today). 
   > The example action is provided by the **MSN Weather** managed "shared" connector, 
   > which is hosted and run in global, multitenant Azure.
  
   | Parameter | Value | Description |
   |-----------|-------|-------------|
   | **Name** | <*agent-parameter-name*> | The agent parameter name. |
   | **Type** | <*agent-parameter-data-type*> | The agent parameter data type. |
   | **Description** | <*agent-parameter-description*> | The agent parameter description that easily identifies the parameter's purpose. You can choose from the following options or combine them to provide a description: <br><br>- Plain literal text with details such as the parameter's purpose, permitted values, restrictions, or limits. <br><br>- Outputs from earlier operations in the workflow. To browse and choose these outputs, select inside the **Description** box, and then select the lightning icon to open the dynamic content list. From the list, select the output that you want. <br><br>- Results from expressions. To create an expression, select inside the **Description** box, and then select the function icon to open the expression editor. Select from available functions to create the expression. |

   When you're done, under **Agent Parameters**, the new agent parameter appears.

1. On the designer, in the tool, select the action to open the action information pane.

1. On the **Parameters** tab, select inside the parameter box to show the parameter options, and then select the robot icon.

1. From the **Agent parameters** list, select the agent parameter that you defined earlier.

   For example, the finished **Get weather** tool looks like the following example:

   :::image type="content" source="media/create-agent-workflows/get-weather-tool.png" alt-text="Screenshot shows workflow designer with the agent and selected tool now named Get weather." lightbox="media/create-agent-workflows/get-weather-tool.png":::

1. Save your workflow.

#### Test the agent after action setup

Now that the **Get forecast for today** action is set up, test the agent by following these steps:

1. From the designer toolbar, run the workflow.

1. Open the workflow's **Run history** page.

   > [!TIP]
   >
   > If the previous workflow run still shows **Running** status, 
   > cancel that run because you just started a new workflow run.

1. Select the latest workflow run.

1. After monitoring view opens, in the agent chat box, enter an appropriate prompt. The chat box might take a few moments to activate.

   This example uses the prompt **What's the weather in Seattle?**. The agent replies with an answer that might look like the following example:

   :::image type="content" source="media/create-agent-workflows/agent-weather-response.png" alt-text="Screenshot shows monitoring view, operation status, agent chat pane, and response with weather forecast."lightbox="media/create-agent-workflows/agent-weather-response.png":::

   Although the agent offers to send this forecast in email, the agent doesn't have a tool yet for this task. So, let's build that tool.

1. Return to the designer. On the monitoring view toolbar, select **Edit**.

1. Continue to the next section.

## Create a tool to send email

For many scenarios, an agent usually needs more than one tool. In this example, the agent needs a tool that sends the weather report in email.

Build this tool by following these steps:

1. On the designer, inside the agent, next to the existing tool, select the plus sign (**+**) to add an action.

1. On the **Add an action** pane, follow these [general steps to add another action for your scenario](/azure/logic-apps/create-workflow-with-trigger-or-action?tabs=standard#add-action).

   The examples use the **Outlook.com** action named **Send an email (V2)**.

   Like before, after you select the action, both the new **Tool** and action appear inside the agent on the designer at the same time. Both information panes open at the same time.

   :::image type="content" source="media/create-agent-workflows/added-tool-send-email.png" alt-text="Screenshot shows workflow designer with Weather agent, Get weather tool, and new tool with action named Send an email (V2)." lightbox="media/create-agent-workflows/added-tool-send-email.png":::

1. On the tool information pane, make the tool's purpose obvious by updating the tool name.

   The examples use **Send email**.

1. On the **Details** tab, provide the following information:

   1. For **Description**, enter the tool description.

      This example uses **Send weather forecast in email.**

## Create agent parameters for the 'Send an email (V2)' action

The steps in this section are nearly the same as [Create agent parameters for the 'Get forecast' action](#create-agent-parameters-for-the-get-forecast-action), except for the different parameters in the **Send an email (V2)** action. 

1. Follow the earlier steps to create the following agent parameters for the action parameter values in the action named **Send an email (V2)**.

   The action needs three agent parameters named **To**, **Subject**, and **Body**. For the action's Swagger definition, see [**Send an meal (V2)**](/connectors/outlook/#send-an-email-(v2)).

   For example, the **Send an email (V2)** action looks like the following example:

   When you're done, the example action uses the previously defined agent parameters as shown here:

   :::image type="content" source="media/create-agent-workflows/send-email-action.png" alt-text="Screenshot shows the information pane for the action named Send an email V2, plus the previously defined agent parameters named To, Subject, and Body." lightbox="media/create-agent-workflows/send-email-action.png":::

   The second example tool is now complete and looks like the following example:

   :::image type="content" source="media/create-agent-workflows/send-email-tool-complete.png" alt-text="Screenshot shows the finished second tool inside the agent." lightbox="media/create-agent-workflows/send-email-tool-complete.png":::

1. Save your workflow.

1. Now, test the agent behavior by following these steps:

   1. From the designer toolbar, run the workflow.

   1. Open the workflow's **Run history** page.

   1. Select the latest workflow run.

   1. After monitoring view opens, in the agent chat box, enter an appropriate prompt.

      This example uses the prompt **What's the weather in Seattle?**. The agent replies with the Seattle weather forecast.

   1. In the agent chat box, enter a prompt to test the new tool.

      This example uses the prompt **Send me the weather forecast in email?**.

   1. When the agent asks for an email address, provide the email address to use for testing.

      The agent confirms that the weather forecast was sent to the specified email address:

      :::image type="content" source="media/create-agent-workflows/sent-email.png" alt-text="Screenshot shows workflow designer with Default Agent, tool named Get weather for today, and selected action Get forecast for today." lightbox="media/create-agent-workflows/send-email-action.png":::

   1. Confirm that the provided email address received the email with the weather forecast, for example:

      :::image type="content" source="media/create-agent-workflows/email-received.png" alt-text="Screenshot shows email with Seattle weather forecast received in Outlook." lightbox="media/create-agent-workflows/email-received.png":::

1. On the monitoring view toolbar, select **Cancel run**.

1. Return to the designer. On the monitoring view toolbar, select **Edit**.

1. Next, reconfigure your agent to operate without human interactions. Continue to [Set up an autogenous agent](#set-up-an-autonomous-agent).

## Set up an autonomous agent

By default, all agents are autonomous. To change an interactive agent to an autonomous agent, complete the following tasks:

1. On an agent that has the active **Channels** settings, select **Do not allow channels**.

   For more information, see [Set up chat interactions](#set-up-chat-interactions-for-the-agent).

1. In the agent, update the system instructions to describe the autonomous behavior.

   For the **Weather agent** example, the new system instructions use the following text:

   ```
   You're an AI agent that generates a weather report, which you send in email to each subscriber on a list. This list includes each subscriber's name, location, and email address to use. Format the weather report with bullet lists where appropriate.

   Make your response concise and useful, but also use a friendly and conversational tone. You can include suggestions like "Carry an umbrella" or "Dress in layers". 
   ```

1. Create a tool that provides the agent parameter values to use.

   For example, you might create a tool named **Get subscribers**, which uses the **Compose** action to supply the subscriber name, email address, and location. Or, you might source these inputs from blob storage or a database. Azure Logic Apps offers many options that you can use as data sources.

   The following example uses a **Recurrence** trigger that is set up to run the workflow every day. The agent uses the **Get subscribers** tool to execute a **Compose** action that contains the subscriber information:

   :::image type="content" source="media/create-agent-workflows/add-tool-get-subscribers.png" alt-text="Screenshot shows agent with new tool named Get subscribers that contains a Compose action with subscriber information." lightbox="media/create-agent-workflows/add-tool-get-subscribers.png":::

1. Optionally, on the agent, provide *user instructions* that the agent can use as prompts or requests.

   For better results, make each user instruction focus on a specific task, for example:

   1. On the agent information pane, in the **User instructions** section, select **Add new item**.

   1. In the **User instructions Item - 1** box, enter the question to ask the agent.

   1. To add another item, select **Add new item** again.

   1. In the **User instructions item - 2** box, enter another question to ask the agent.

   1. Repeat until you finish adding all the questions to ask the agent.

1. When you're done, test your workflow.

## Best practices for agents and tools

The following sections provide recommendations, best practices, and other guidance that can help you build better agents and tools.

### Agents

The following guidance provides best practices for agents.

##### Prototype agents and tools with 'Compose' actions

Rather than use actual actions and live connections to prototype your agent and tools, use [**Compose** actions](/azure/logic-apps/logic-apps-perform-data-operations#compose-action) to "mock" or simulate the actual actions. This approach provides the following benefits:

- **Compose** actions don't produce side effects, which make these actions useful for ideation, design, and testing.

- You can draft and refine system instructions, prompts, tool names and descriptions plus agent parameters and descriptions - all without having to set up and use live connections.

- When you confirm that your agent and tools work with only the **Compose** actions, you're ready to swap in the actual actions.

- When you switch over to the actual actions, you have to reroute or recreate your agent parameters to work with the actual actions, which might take some time.

##### Manage chat history context length

The workflow agent maintains the chat history or *context*, including tool invocations, based on the current limit on the number of [tokens](/azure/ai-services/openai/overview#tokens) or messages to keep and pass into the model for the next chat interaction. Over time, the agent's chat history grows and eventually exceeds your model's *context length* limit, or the maximum number of input tokens. Models differ in their context lengths.

For example, **gpt-4o** supports 128,000 input tokens where each token has 3-4 characters. When the chat history approaches the model's context length, consider dropping stale or irrelevant messages to stay below the limit.

Here are some approaches to reduce your agent's chat history:

- Reduce the size of results from tools by using the [**Compose** action](/azure/logic-apps/logic-apps-perform-data-operations#compose-action). For more information, see [Tools - Best practices](#tools).

- Carefully craft your system instructions and prompts to control the model's behavior.

- **Experimental capability**: You have the option to try chat reduction so you can reduce the maximum number of tokens or messages to keep in chat history and pass into the model.

  A workflow agent has almost the same advanced parameters as the [Azure OpenAI built-in, service provider connector](/azure/logic-apps/connectors/built-in/reference/openai/), except for the **Agent History Reduction Type** advanced parameter, which exists only in the agent. This parameter controls the chat history that the agent maintains, based on the maximum number of tokens or messages.

  This capability is in active development and might not work for all scenarios. You can change the **Agent History Reduction Type** option to reduce the limit on tokens or messages. You then specify the numerical limit that you want.
  
  To try the capability, follow these steps:

  1. On the designer, select the agent's title bar to open the information pane.
  1. On the **Parameters** tab, find the **Advanced parameters** section.
  1. Check whether the parameter named **Agent History Reduction Type** exists. If not, open the **Advanced parameters** list, and select that parameter.
  1. From the **Agent History Reduction Type** list, select one of the following options:

     | Option | Description |
     |--------|-------------|
     | **Token count reduction** | Shows the parameter named **Maximum Token Count**. Specifies the maximum number of tokens in chat history to keep and pass into the model for the next chat interaction. The default differs based on the currently used model in Azure OpenAI Service. The default limit is **128,000**. |
     | **Message count reduction** | Shows the parameter named **Message Count Limit**. Specifies the maximum number of messages in chat history to keep and pass into the model for the next chat interaction. No default limit exists. |

### Tools

The following guidance provides best practices for tools.

- The name is the most important value for a tool. Make sure the name is succinct and descriptive.

- The tool description provides useful and helpful context for the tool.

- Both the tool name and description have character limits.

  Some limits are enforced by the model in Azure OpenAI Service at run time, rather than when you save the changes in the agent in the workflow.

- Too many tools in the same agent can have a negative effect on agent quality.

  A good general guideline recommends that an agent includes no more than 10 tools. However, this guidance varies based on the model that you use from Azure OpenAI Service.

- In tools, actions don't need to have all their inputs come from the model.

  You can finely control which action inputs come from non-model sources and which inputs come from the model. For example, suppose a tool has an action that sends email. You can provide a plain and mostly static email body but use model-generated outputs for part of that email body.

- Customize or transform tool results before you pass them to the model.

  You can change the results from a tool before they pass into the model by using the [**Compose** action](/azure/logic-apps/logic-apps-perform-data-operations#compose-action). This approach provides the following benefits:

  - Improve response quality by reducing irrelevant [context](agent-workflows-concepts.md#key-concepts) that passes into the model. You send only the fields that you need from a large response.

  - Reduce billing charges for tokens that pass into the model and avoid exceeding the model's limit on *context length*, the maximum number of tokens that pass into the model. You send only the fields that you need.

  - Combine the results from multiple actions in the tool.

  - You can mock the tool results to simulate the expected results from actual actions. Mock actions leave data unchanged at the source and don't incur charges for resource usage outside Azure Logic Apps.

### Agent parameters

The following guidance provides best practices for agent parameters.

- The name is the most important value for an agent parameter. Make sure the name is succinct and descriptive.

- The agent parameter description provides useful and helpful context for the tool.

## Troubleshoot problems

This section describes guidance to help troubleshoot errors or problems that you might encounter when you build or run agent workflows.

#### Review tool execution data

The workflow run history provides useful information that helps you learn what happened during a specific run. For an agent workflow, you can find tool execution inputs and outputs for a specific agent loop iteration.

1. On the workflow menu, under **Tools**, select **Run history** to open the **Run history** page.

1. On the **Run history** tab, in the **Identifier** column, select the workflow run that you want.

   The monitoring view opens to show the status for each step.

1. Select the agent that you want to inspect. To the right side, the **Agent chat** pane appears.

   This pane shows the chat history, including tool executions during the chat.

1. To get tool execution data at a specific point in the chat, find that point in the chat history, and select the tool execution reference, for example:

   :::image type="content" source="media/create-agent-workflows/tool-reference-links.png" alt-text="Screenshot shows chat history and selected tool execution link." lightbox="media/create-agent-workflows/tool-reference-links.png":::

   This action moves you to the matching tool in monitoring view. The agent shows the current iteration count.

1. In monitoring view, select the agent or the action with the inputs, outputs, and properties that you want to review.

   The following example shows a selected action for the previously selected tool execution:

   :::image type="content" source="media/create-agent-workflows/tool-execution-data.png" alt-text="Screenshot shows monitoring view, current agent loop iteration, and selected action with inputs and outputs at this point in time." lightbox="media/create-agent-workflows/tool-execution-data.png":::

   If you select the agent, you can review the following information that passes into the model and returns from the model, for example:

   - Input messages passed into the model.
   - Output messages returned from the model.
   - Tools that the model asked the agent to call.
   - Tool results that passed back into the model.
   - Number of tokens that each request used.

1. To review a different agent loop iteration, in the agent, select the left or right arrow.

#### Logs in Application Insights

If you set up Application Insights or advanced telemetry for your workflow, you can review the logs for agent events, like any other action. For more information, see [Enable and view enhanced telemetry in Application Insights for Standard workflows in Azure Logic Apps](/azure/logic-apps/enable-enhanced-telemetry-standard-workflows).

#### Model maximum context length exceeded

If your agent's chat history exceeds the model's *context length*, or the maximum number of input tokens, you get an error that looks like the following example:

**This model's maximum context length is 4097 tokens. However, you requested 4927 tokens (3927 in the messages, 1000 in the completion). Please reduce the length of the messages or completion.**

Try reducing the limit on the number of tokens or messages that your agent keeps in chat history and passes into the model for the next chat interaction. For this example, you might select **Token count reduction** and set **Maximum Token Count** to a number below the error's stated maximum context length, which is **4097**.

For more information, see [Manage chat history context length](#manage-chat-history-context-length).

## Clean up example resources

If you don't need the resources that you created for the examples, make sure to delete the resources so that you don't continue to get charged. You can either follow these steps to delete the resource group that contains these resources, or you can delete each resource individually.

1. In the Azure search box, enter **resource groups**, and select **Resource groups**.

1. Find and select the resource groups that contain the resources for this example.

1. On the **Overview** page, select **Delete resource group**.

1. When the confirmation pane appears, enter the resource group name, and select **Delete**.

## Related content

- [AI agent workflows in Azure Logic Apps](/azure/logic-apps/agent-workflows-concepts)
- [Azure Logic Apps limits and configuration](/azure/logic-apps/logic-apps-limits-and-config)
- [Azure OpenAI Service quotas and limits](/azure/ai-services/openai/quotas-limits)
