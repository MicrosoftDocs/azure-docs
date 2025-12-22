---
title: Create Conversational AI Agent Workflows
description: Learn to build conversational automation workflows with AI agent loops and LLMs that support human chat interactions in Azure Logic Apps.
service: ecfan
services: logic-apps
ms.suite: integration
ms.reviewers: estfan, divswa, krmitta, azla
ms.topic: how-to
ms.collection: ce-skilling-ai-copilot
ms.date: 12/12/2025
ms.update-cycle: 180-days
# Customer intent: As an AI integration developer who uses Azure Logic Apps, I want to build workflows that complete tasks by using AI agent loops, large language models (LLMs), natural language, and chat capabilities in my integration solutions.
---

# Create conversational agent workflows with chat interactions in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

When you need AI-powered automation that interacts with humans, create *conversational agent* workflows in Azure Logic Apps. These workflows use natural language, agent *loops*, and *large language models* (LLMs) to make decisions and complete tasks based on human-provided inputs and questions, known as *prompts*. These workflows work best for automation that's user-driven, short-lived, or session-based.

The following example workflow uses a conversational agent to get the current weather and send email notifications:

:::image type="content" source="media/create-conversational-agent-workflows/weather-example.png" alt-text="Screenshot shows Azure portal, workflow designer, and example conversational agent workflow." lightbox="media/create-conversational-agent-workflows/weather-example.png":::

This guide shows how to create a Consumption or Standard logic app using the **Conversational Agents** workflow type. This workflow runs using human-provided prompts and tools that you build to complete tasks. For a high-level overview about agent workflows, see [AI agent workflows in Azure Logic Apps](/azure/logic-apps/agent-workflows-concepts).

> [!IMPORTANT]
>
> Consumption conversational agent workflows are in preview and subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

Based on whether you want to create a Consumption or Standard logic app, the following prerequisites apply:

### [Consumption (preview)](#tab/consumption)

- A Consumption logic app resource that uses the workflow type named **Conversational Agents**. See [Create Consumption logic app workflows in the Azure portal](quickstart-create-example-consumption-workflow.md).

  Consumption conversational agent workflows don't require that you manually set up a separate AI model. Your workflow automatically includes an agent action that uses an Azure OpenAI Service model hosted in Azure AI Foundry. Agent workflows support only specific models. See [Supported models](#supported-models).

  > [!NOTE]
  >
  > You can use only the Azure portal to build conversational agent workflows, not Visual Studio Code.

For external chat authentication and authorization, Consumption conversational agent workflows use [OAuth 2.0 with Microsoft Entra ID](/entra/architecture/auth-oauth2).

### [Standard](#tab/standard)

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- A Standard logic app resource or project, based on your development experience:

  | Experience | Requirement |
  |------------|-------------|
  | Azure portal | A Standard logic app resource. See [Create Standard workflows in the Azure portal](create-single-tenant-workflows-azure-portal.md). |
  | Visual Studio Code | A Standard logic app project. See [Create Standard workflows in Visual Studio Code](/azure/logic-apps/create-standard-workflows-visual-studio-code). Make sure you have the latest Azure Logic Apps extension. |

  > [!NOTE]
  >
  > The steps to set up conversational chat are mostly the same for both Azure portal and Visual Studio Code. The examples in this guide show the instructions for each experience where the process differs.

- One of the following AI model sources:

  > [!NOTE]
  >
  > Agent workflows support only specific models. See [Supported models](#supported-models).

  | Model source | Description |
  |--------------|-------------|
  | **Azure OpenAI** | An [Azure OpenAI Service resource](/azure/ai-services/openai/overview) with a deployed [Azure OpenAI Service model](/azure/ai-services/openai/concepts/models). <br><br>You need the resource name when you connect from the agent in your workflow to the deployed AI model in Azure OpenAI Service. <br><br>For more information, see: <br>- [Create and deploy an Azure OpenAI Service resource](/azure/ai-services/openai/how-to/create-resource?pivots=web-portal) <br>- [Deploy a model](/azure/ai-services/openai/how-to/create-resource?pivots=web-portal#deploy-a-model) |
  | **APIM Gen AI Gateway** | An [Azure API Management account](/azure/api-management/genai-gateway-capabilities) with the LLM API to use. <br><br>For more information, see: <br>- [AI gateway in Azure API Management](/azure/api-management/genai-gateway-capabilities) <br>- [Import an Azure AI Foundry API](/azure/api-management/azure-ai-foundry-api) <br>- [Import an Azure OpenAI API](/azure/api-management/azure-openai-api-from-specification) |
 
- The authentication to use when you connect your agent to your AI model.

  - Managed identity authentication

    This connection supports authentication using Microsoft Entra ID with a [managed identity](/entra/identity/managed-identities-azure-resources/overview). In production scenarios, Microsoft strongly recommends that you use a managed identity when possible. This option provides optimal and superior security at no extra cost. Azure manages this identity for you, so you don't have to provide or manage sensitive information such as credentials or secrets. This information isn't even accessible to individual users. You can use managed identities to authenticate access for any resource that supports Microsoft Entra authentication.

    To use managed identity authentication, your Standard logic app resource must enable the system-assigned managed identity. By default, the system-assigned managed identity is enabled on a Standard logic app. This release currently doesn't support using the user-assigned managed identity.

    > [!NOTE]
    >
    > If the system-assigned identity is disabled, [reenable the identity](/azure/logic-apps/authenticate-with-managed-identity?tabs=standard#enable-system-assigned-identity-in-the-azure-portal). 

    The system-assigned identity requires one of the following roles for Microsoft Entra role-based access control (RBAC), based on the [principle of least privilege](/entra/identity-platform/secure-least-privileged-access):

    | Model source | Role |
    |--------------|------|
    | Azure OpenAI Service resource | - **Cognitive Services OpenAI User** (least privileged) <br>- **Cognitive Services OpenAI Contributor** |

    For more information about managed identity setup, see:

    - [Authenticate access and connections with managed identities in Azure Logic Apps](/azure/logic-apps/authenticate-with-managed-identity?tabs=standard)
    - [Role-based access control for Azure OpenAI Service](/azure/ai-services/openai/how-to/role-based-access-control)
    - [Best practices for Microsoft Entra roles](/entra/identity/role-based-access-control/best-practices)

  - URL and key-based authentication

    This connection supports authentication by using the endpoint URL and API key for your AI model. However, you don't have to manually find these values before you create the connection. The values automatically appear when you select your model source.

    > [!IMPORTANT]
    >
    > Use this authentication option only for the examples in this guide, exploratory scenarios, nonproduction scenarios, or if your organization's policy specifies that you can't use managed identity authentication.
    >
    > In general, make sure that you secure and protect sensitive data and personal data, such as credentials, secrets, access keys, connection strings, certificates, thumbprints, and similar information with the highest available or supported level of security. Don't hardcode sensitive data, share with other users, or save in plain text anywhere that others can access. Set up a plan to rotate or revoke secrets in the case they become compromised.
    >
    > For more information, see:
    >
    > - [Best practices for protecting secrets](/azure/security/fundamentals/secrets-best-practices)
    > - [Secrets in Azure Key Vault](/azure/key-vault/secrets/) 
    > - [Automate secrets rotation in Azure Key Vault](/azure/key-vault/secrets/tutorial-rotation)

---

- To follow along with the examples, you need an email account to send email.

  The examples in this guide use an Outlook.com account. For your own scenarios, you can use any supported email service or messaging app in Azure Logic Apps, such as Office 365 Outlook, Microsoft Teams, Slack, and so on. The setup for other email services or apps are similar to the examples, but have minor differences.

## Limitations and known issues

The following table describes the current limitations and any known issues in this release.

| Logic app | Limitations or known issues |
|-----------|-----------------------------|
| Both | To create tools for your agent, the following limitations apply: <br><br>- You can add only actions, not triggers. <br>- A tool must start with an action and always contains at least one action. <br>- A tool works only inside the agent where that tool exists. <br>- Control flow actions are unsupported. |
| Consumption | - You can create Consumption agent workflows only in the Azure portal, not Visual Studio Code. <br>- The AI model that your agent uses can originate from any region, so data residency for a specific region isn't guaranteed for data that the model handles. <br>- The **Agent** action is throttled based on the number of tokens used. |
| Standard | - Unsupported workflow types: **Stateless** <br><br>For general limits in Azure OpenAI Service and Azure Logic Apps, see: <br><br>- [Azure OpenAI Service quotas and limits](/azure/ai-services/openai/quotas-limits) <br>- [Azure Logic Apps limits and configuration](/azure/logic-apps/logic-apps-limits-and-config) |

[!INCLUDE [supported-models](includes/supported-models.md)]

[!INCLUDE [billing-agent-workflows](includes/billing-agent-workflows.md)]

## Create a conversational agent workflow

The following section shows how to start creating your conversational agent workflow.

### [Consumption (preview)](#tab/consumption)

The **Conversational Agents** workflow type creates a partial workflow that starts with the required trigger named **When a new chat session starts**. The workflow also includes an empty **Default Agent** action.

To open this partial workflow, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app resource.

1. On the resource sidebar, under **Development Tools**, select the designer to open the partial agentic workflow.

   The designer shows a partial workflow that starts with the required trigger named **When a new chat session starts**. Under the trigger, an empty **Agent** action named **Default Agent** appears. For this scenario, you don't need any other trigger setup.

   :::image type="content" source="media/create-conversational-agent-workflows/workflow-start-consumption.png" alt-text="Screenshot shows Consumption workflow designer with required chat conversation trigger and an empty Default Agent action." lightbox="media/create-conversational-agent-workflows/workflow-start-consumption.png":::

1. Continue to the next section to set up your agent.

### [Standard](#tab/standard)

Based on the development experience that you use, start by creating a new workflow.

#### Create agent workflow in Azure portal

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the resource sidebar, under **Workflows**, select **Workflows**.

1. On the **Workflows** page toolbar, select **Create** > **Create**.

1. On the **Create workflow** pane, complete the following steps:

   1. For **Workflow name**, provide a name for your workflow to use.

   1. Select **Conversational Agents** > **Create**.

      :::image type="content" source="media/create-conversational-agent-workflows/select-conversational-agents.png" alt-text="Screenshot shows Standard logic app resource with open Workflows page and Create workflow pane with workflow name, selected Conversational Agents option, and Create button." lightbox="media/create-conversational-agent-workflows/select-conversational-agents.png":::

      The designer opens and shows a partial workflow that starts with the required trigger named **When a new chat session starts** and an empty **Agent** action that you need to set up later. 

      :::image type="content" source="media/create-conversational-agent-workflows/workflow-start-standard-portal.png" alt-text="Screenshot shows Standard workflow designer with required chat conversation trigger and an empty Agent action." lightbox="media/create-conversational-agent-workflows/workflow-start-standard-portal.png":::

   Before you can save your workflow, you must complete the following setup tasks for the **Agent** action:

   - Connect your agent to your AI model. You complete this task in a later section.

   - Provide agent instructions that use natural language to describe the roles that the agent plays, the tasks that the agent can perform, and other information to help the agent better understand how to operate. You also complete this task in a later section.

1. Continue to the next section to set up your agent.

#### Create agent workflow in Visual Studio Code

1. In Visual Studio Code, open the workspace for your Standard logic app project.

1. On the Activity Bar, select the files icon, which opens the Explorer window to show your project.

1. In the Explorer window, from your project folder shortcut menu, select **Create workflow**.

1. Select the workflow template named **Conversational agent**.

1. Provide a name for your workflow, and press Enter.

   A new workflow folder now appears in your project. This folder contains a *workflow.json* file, which contains the workflow's underlying JSON definition.

1. From the *workflow.json* file's shortcut menu, select **Open designer**.

   The designer opens and shows a partial workflow that starts with the required trigger named **When a new chat session starts** and an empty **Default Agent** action that you need to set up later. 

   :::image type="content" source="media/create-conversational-agent-workflows/workflow-start-standard-visual-studio-code.png" alt-text="Screenshot shows workflow designer with required chat conversation trigger and an empty Default Agent action." lightbox="media/create-conversational-agent-workflows/workflow-start-standard-visual-studio-code.png":::

1. Continue to the next section to set up your agent.

---

> [!NOTE]
>
> If you try to save the workflow now, the designer toolbar shows a red dot on the **Errors** 
> button. The designer alerts you to this error condition because the agent requires setup 
> before you can save any changes. However, you don't have to set up the agent now. You can 
> continue to create your workflow. Just remember to set up the agent before you save your workflow.
>
> :::image type="content" source="media/create-conversational-agent-workflows/error-missing-agent-settings.png" alt-text="Screenshot shows workflow designer toolbar and Errors button with red dot and error in the agent action information pane." lightbox="media/create-conversational-agent-workflows/error-missing-agent-settings.png":::

<a name="agent-model"></a>

## Set up or view the AI model

To set up or view the AI model for your agent, follow the steps based on your logic app type:

### [Consumption (preview)](#tab/consumption)

By default, your agent automatically uses the Azure OpenAI model available in your logic app's region. Some regions support **gpt-4o-mini**, while others support **gpt-5o-mini**.

To view the model that your agent uses, follow these steps:

1. On the designer, select the title bar on the **Default Agent** action to open the information pane.

1. On the **Parameters** tab, the **Model Id** parameter shows the Azure OpenAI model that the workflow uses, for example:

   :::image type="content" source="media/create-conversational-agent-workflows/connected-model-consumption.png" alt-text="Screenshot shows Consumption agent with Azure OpenAI model." lightbox="media/create-conversational-agent-workflows/connected-model-consumption.png":::

1. Continue to the next section to rename the agent.

### [Standard](#tab/standard)

1. On the designer, select the title bar on the **Agent** action to open the **Create connection** pane.

   This pane opens only if you don't have an existing working connection.

1. In the **Create a new connection** section, provide the following information:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Connection Name** | Yes | <*connection-name*> | The name to use for the connection to your AI model. <br><br>This example uses `fabrikam-azure-ai-connection`. |
   | **Agent Model Source** | Yes | - **Azure OpenAI** <br>- **APIM Gen AI Gateway** | The source for the AI model in your Azure OpenAI Service resource or your LLM API in your Azure API Management account. |
   | **Authentication Type** | Yes | - **Managed identity** <br><br>- **URL and key-based authentication** | The authentication type to use for validating and authorizing an identity's access to your AI model. <br><br>- **Managed identity** requires that your Standard logic app have a managed identity enabled and set up with the required roles for role-based access. For more information, see [Prerequisites](#prerequisites). <br><br>- **URL and key-based authentication** requires the endpoint URL and API key for your AI model. These values automatically appear when you select your model source. <br><br>**Important**: For the examples and exploration only, you can use **URL and key-based authentication**. For production scenarios, use **Managed identity**. |
   | **Subscription** | Yes | <*Azure-subscription*> | Select the Azure subscription for your Azure OpenAI Service resource or Azure API Management account. |
   | **Azure OpenAI Resource** | Yes, only when **Agent Model Source** is **Azure OpenAI** | <*Azure-OpenAI-Service-resource-name*> | Select your Azure OpenAI Service resource. |
   | **Azure API Management Service** (preview) | Yes, only when **Agent Model Source** is **APIM Gen AI Gateway**. | <*API-Management-account*> | Select your Azure API Management account. |
   | **Azure API Management Service APIs** | Yes, only when **Agent Model Source** is **APIM Gen AI Gateway**. | <*API-Management-LLM-API*> | Select your LLM API in Azure API Management. |
   | **API Endpoint** | Yes | Automatically populated | The endpoint URL for your AI model in Azure OpenAI Service or LLM API in Azure API Management. <br><br>This example uses `https://fabrikam-azureopenai.openai.azure.com/`. |
   | **API Key** | Yes, only when **Authentication Type** is **URL and key-based authentication** | Automatically populated | The API key for your AI model in Azure OpenAI Service or your LLM API in Azure API Management. |

   For example, if you select **Azure OpenAI** as your model source and **Managed identity** for authentication, your connection information looks like the following sample:

   :::image type="content" source="media/create-conversational-agent-workflows/connection-azure-openai.png" alt-text="Screenshot shows example connection details for a deployed model in Azure OpenAI Service." lightbox="media/create-autonomous-agent-workflows/connection-azure-openai.png":::

1. When you're done, select **Create new**.

   If you want to create a different connection, on the **Parameters** tab, scroll down to the bottom, and select **Change connection**.

   > [!NOTE]
   >
   > If the connection to your model is incorrect, the **AI Model** list appears unavailable.

1. Continue to the next section to rename the agent.

---

## Rename the agent

Update the agent name to clearly identify the agent's purpose by following these steps:

1. On the designer, select the agent title bar to open the agent information pane.

1. On the information pane, select the agent name, and enter the new name, for example, `Weather agent`.

   :::image type="content" source="media/create-conversational-agent-workflows/rename-agent.png" alt-text="Screenshot shows workflow designer, workflow trigger, and renamed agent." lightbox="media/create-conversational-agent-workflows/rename-agent.png":::

1. Continue to the next section to provide instructions for the agent.

## Set up agent instructions

The agent requires instructions that describe the roles that the agent can play and the tasks that the agent can perform. To help the agent learn and understand these responsibilities, you can also include the following information:

- Workflow structure
- Available actions
- Any restrictions or limitations
- Interactions for specific scenarios or special cases

For the best results, provide prescriptive instructions and be prepared to iteratively refine your instructions.

1. In the **Instructions for agent** box, enter the instructions that the agent needs to understand its role and tasks.

   For this example, the weather agent example uses the following sample instructions where you later ask questions and provide your own email address for testing:

   ```
   You're an AI agent that answers questions about the weather for a specified location. You can also send a weather report in email if you're provided email address. If no address is provided, ask for an email address.

   Format the weather report with bullet lists where appropriate. Make your response concise and useful, but use a conversational and friendly tone. You can include suggestions like "Carry an umbrella" or "Dress in layers".
   ```

   Here's an example:

   :::image type="content" source="media/create-conversational-agent-workflows/weather-agent-instructions.png" alt-text="Screenshot shows workflow designer and agent instructions." lightbox="media/create-conversational-agent-workflows/weather-agent-instructions.png":::

1. Now, you can save your workflow. On the designer toolbar, select **Save**.

## Check for errors

To make sure your workflow doesn't have errors at this stage, follow these steps, based on your logic app and development environment.

### [Consumption (preview)](#tab/consumption)

1. On the designer toolbar, select **Chat**.

1. In the chat client interface, ask the following question: `What is the current weather in Seattle?`

1. Check that the response is what you expect, for example:

   :::image type="content" source="media/create-conversational-agent-workflows/test-chat-portal-consumption.png" alt-text="Screenshot shows the portal-integrated chat interface for a Consumption agent workflow." lightbox="media/create-conversational-agent-workflows/test-chat-portal-consumption.png":::

1. Return to your workflow in the designer.

1. On the workflow sidebar, under **Development Tools**, select **Run history**.

1. On the **Run history** page, in the runs table, select the latest workflow run.

   > [!NOTE]
   >
   > If the page doesn't show any runs, on the toolbar, select **Refresh**.
   >
   > If the **Status** column shows a **Running** status, the agent workflow is still working.

   The monitoring view opens and shows the workflow operations with their status. The **Agent log** pane is open and shows the agent instructions that you provided earlier. The pane also shows the agent's response.

   :::image type="content" source="media/create-conversational-agent-workflows/agent-only-run-history-consumption.png" alt-text="Screenshot shows monitoring view for Consumption workflow, operation status, and agent log." lightbox="media/create-conversational-agent-workflows/agent-only-run-history-consumption.png":::

   The agent doesn't have any tools to use at this time, which means that the agent can't actually take any specific actions, such as send email to a subscriber list, until you create tools that the agent needs to complete tasks.

1. Return to the designer. On the monitoring view toolbar, select **Edit**.

### [Standard](#tab/standard)

#### Check for errors in Azure portal

1. On the designer toolbar, select **Chat**.

1. In the chat client interface, ask the following question: `What is the current weather in Seattle?`

1. Check that the response is what you expect, for example:

   :::image type="content" source="media/create-conversational-agent-workflows/test-chat-portal-standard.png" alt-text="Screenshot shows the portal-integrated chat interface for a Standard agent workflow." lightbox="media/create-conversational-agent-workflows/test-chat-portal-standard.png":::

1. Return to your workflow in the designer.

1. On the workflow sidebar, under **Tools**, select **Run history**.

1. On the **Run history** page, on the **Run history** tab, select the latest workflow run.

   > [!NOTE]
   >
   > If the page doesn't show any runs, on the toolbar, select **Refresh**.
   >
   > If the **Status** column shows a **Running** status, the agent workflow is still working.

   The monitoring view opens and shows the workflow operations with their status. The **Agent log** pane is open and shows the agent instructions that you provided earlier. The pane also shows the agent's response.

   :::image type="content" source="media/create-conversational-agent-workflows/agent-only-run-history-standard.png" alt-text="Screenshot shows monitoring view, operation status, and agent log." lightbox="media/create-conversational-agent-workflows/agent-only-run-history-standard.png":::

   However, the agent doesn't have any tools to use at this time, which means that the agent can't actually take any specific actions, such as send email, until you create tools that the agent needs to complete their tasks. You might even get an email that your email server rejected the message.

1. Return to the designer. On the monitoring view toolbar, select **Edit**.

#### Check for errors in Visual Studio Code

1. In the Explorer window for your logic app project, expand the folder that has the workflow name, and go to the *workflow.json* file.

1. From the file shortcut menu, select **Overview**, which starts a debugging session.

1. On the **Overview** page, select **Chat**.

1. In the chat client interface, ask the following question: `What is the current weather in Seattle?`

1. Check that the response is what you expect, for example:

   :::image type="content" source="media/create-conversational-agent-workflows/test-chat-visual-studio-code.png" alt-text="Screenshot shows the Visual Studio Code integrated chat interface for a Standard agent workflow." lightbox="media/create-conversational-agent-workflows/test-chat-visual-studio-code.png":::

1. Return to the **Overview** page.

1. Under **Run history**, select the latest workflow run.

   > [!NOTE]
   >
   > If the page doesn't show any runs, on the toolbar, select **Refresh**.
   >
   > If the **Status** column shows a **Running** status, the agent workflow is still working.

   The monitoring view opens and shows the workflow operations with their status. The **Agent log** pane is open and shows the agent instructions that you provided earlier. The pane also shows the agent's response.

   However, the agent doesn't have any tools to use at this time, which means that the agent can't actually take any specific actions, such as send email, until you create tools that the agent needs to complete their tasks. You might even get an email that your email server rejected the message.

1. On the debugging toolbar, select **Stop** to close the debug session.

1. Return to the designer.

---

<a name="create-tool-weather"></a>

## Create a 'Get weather' tool

For an agent to run prebuilt actions available in Azure Logic Apps, you must create one or more tools for the agent to use. A tool must contain at least one action and only actions. The agent calls the tool by using specific arguments.

In this example, the agent needs a tool that gets the weather forecast. You can build this tool by following these steps:

1. On the designer, inside the agent and under **Add tool**, select the plus sign (**+**) to open the pane where you can browse available actions.

1. On the **Add an action** pane, follow the [general steps](/azure/logic-apps/create-workflow-with-trigger-or-action#add-action) for your logic app to add an action that's best for your scenario.

   This example uses the **MSN Weather** action named **Get current weather**.

   After you select the action, both the **Tool** container and the selected action appear in the agent on the designer. Both information panes also open at the same time.

   :::image type="content" source="media/create-conversational-agent-workflows/added-tool-get-current-weather.png" alt-text="Screenshot shows workflow designer with the renamed agent, which contains a tool that includes the action named Get current weather." lightbox="media/create-conversational-agent-workflows/added-tool-get-current-weather.png":::

1. On the tool information pane, rename the tool to describe its purpose. For this example, use `Get weather`.

1. On the **Details** tab, for **Description**, enter the tool description. For this example, use `Get the weather for the specified location.`

   :::image type="content" source="media/create-conversational-agent-workflows/get-weather-tool.png" alt-text="Screenshot shows completed Get weather tool with description." lightbox="media/create-conversational-agent-workflows/get-weather-tool.png":::

   Under **Description**, the **Agent Parameters** section applies only for specific use cases. For more information, see [Create agent parameters](#create-agent-parameters-get-weather).

1. Continue to the next section to learn more about agent parameters, their use cases, and how to create them, based on these use cases.

<a name="create-agent-parameters-get-weather"></a>

## Create agent parameters for 'Get current weather' action

Actions usually have parameters that require you to specify the values to use. Actions in tools are almost the same except for one difference. You can create agent parameters that the agent uses to specify the parameter values for actions in tools. You can specify model-generated outputs, values from nonmodel sources, or a combination. For more information, see [Agent parameters](agent-workflows-concepts.md#key-concepts).

The following table describes the use cases for creating agent parameters and where to create them, based on the use case:

| To | Where to create agent parameter |
|----|---------------------------------|
| Use model-generated outputs only. <br>Share with other actions in the same tool. | Start from the action parameter. For detailed steps, see [Use model-generated outputs only](#use-model-generated-outputs-only). |
| Use nonmodel values. | No agent parameters needed. <br><br>This experience is the same as the usual action setup experience in Azure Logic Apps but is repeated for convenience in [Use values from nonmodel sources](#use-values-from-nonmodel-sources). |
| Use model-generated outputs with nonmodel values. <br>Share with other actions in the same tool. | Start from the tool, in the **Agent Parameters** section. For detailed steps, see [Use model outputs and nonmodel values](#use-model-outputs-and-nonmodel-values).|

##### Use model-generated outputs only

For an action parameter that uses only model-generated outputs, create an agent parameter by following these steps:

1. In the tool, select the action to open the information pane.

   For this example, the action is **Get current weather**.

1. On the **Parameters** tab, select inside the parameter box to show the parameter options.

1. On the right edge of the **Location** box, select the stars button.

   This button has the following tooltip: **Select to generate the agent parameter**.

   :::image type="content" source="media/create-conversational-agent-workflows/generate-agent-parameter.png" alt-text="Screenshot shows an action with the mouse cursor inside a parameter box, parameter options, and the selected option to generate an agent parameter." lightbox="media/create-conversational-agent-workflows/generate-agent-parameter.png":::

   The **Create agent parameter** window shows the **Name**, **Type**, and **Description** fields, which are prepopulated from the source action parameter.

   The following table describes the fields that define the agent parameter:

   | Parameter | Value | Description |
   |-----------|-------|-------------|
   | **Name** | <*agent-parameter-name*> | The agent parameter name. |
   | **Type** | <*agent-parameter-data-type*> | The agent parameter data type. |
   | **Description** | <*agent-parameter-description*> | The agent parameter description that easily identifies the parameter's purpose. |

   > [!NOTE]
   >
   > Microsoft recommends that you follow the action's Swagger definition. For example, for the **Get current weather** action, which is from the **MSN Weather** "shared" connector hosted and managed by global, multitenant Azure, see the [**MSN Weather** connector technical reference article](/connectors/msnweather/#get-current-weather).

1. When you're ready, select **Create**.

   The following example shows the **Get current weather** action with the **Location** agent parameter:

   :::image type="content" source="media/create-conversational-agent-workflows/get-current-weather-action.png" alt-text="Screenshot shows the Weather agent, Get weather tool, and selected action named Get current weather. The Location action parameter includes the created agent parameter." lightbox="media/create-conversational-agent-workflows/get-current-weather-action.png":::

1. Save your workflow.

##### Use values from nonmodel sources

For an action parameter value that uses only nonmodel values, choose the option that best fits your use case:

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

##### Use model outputs and nonmodel values

Some scenarios might need to specify an action parameter value that uses both model-generated outputs with nonmodel values. For example, you might want to create an email body that uses static text, nonmodel outputs from earlier operations in the workflow, and model-generated outputs.

For these scenarios, create the agent parameter on the tool by following these steps:

1. On the designer, select the tool where you want to create the agent parameter.

1. On the **Details** tab, under **Agent Parameters**, select **Create Parameter**.

1. Expand **New agent parameter**, and provide the following information, but match the action parameter details.

   For this example, the example action is **Get current weather**.

   > [!NOTE]
   >
   > Microsoft recommends that you follow the action's Swagger definition. For example, to find this information for the **Get current weather** action, see the [**MSN Weather** connector technical reference article](/connectors/msnweather/#get-current-weather). The example action is provided by the **MSN Weather** managed connector, which is hosted and run in a shared cluster on multitenant Azure.
  
   | Parameter | Value | Description |
   |-----------|-------|-------------|
   | **Name** | <*agent-parameter-name*> | The agent parameter name. |
   | **Type** | <*agent-parameter-data-type*> | The agent parameter data type. |
   | **Description** | <*agent-parameter-description*> | The agent parameter description that easily identifies the parameter's purpose. You can choose from the following options or combine them to provide a description: <br><br>- Plain literal text with details such as the parameter's purpose, permitted values, restrictions, or limits. <br><br>- Outputs from earlier operations in the workflow. To browse and choose these outputs, select inside the **Description** box, and then select the lightning icon to open the dynamic content list. From the list, select the output that you want. <br><br>- Results from expressions. To create an expression, select inside the **Description** box, and then select the function icon to open the expression editor. Select from available functions to create the expression. |

   When you're done, under **Agent Parameters**, the new agent parameter appears.

1. On the designer, in the tool, select the action to open the action information pane.

1. On the **Parameters** tab, select inside the parameter box to show the parameter options, and then select the robot icon.

1. From the **Agent parameters** list, select the agent parameter that you defined earlier.

   The finished **Get current weather** tool looks like the following example:

   :::image type="content" source="media/create-conversational-agent-workflows/get-current-weather-tool.png" alt-text="Screenshot shows agent and finished Get weather tool." lightbox="media/create-conversational-agent-workflows/get-current-weather-tool.png":::

1. Save your workflow.

## Create a 'Send email' tool

For many scenarios, an agent usually needs more than one tool. In this example, the agent needs a tool that sends the weather report in email.

To build this tool, follow these steps:

1. On the designer, in the agent, next to the existing tool, select the plus sign (**+**) to add an action.

1. On the **Add an action** pane, follow these [general steps](/azure/logic-apps/create-workflow-with-trigger-or-action#add-action) to select another action for your new tool.

   The examples use the **Outlook.com** action named **Send an email (V2)**.

   Like before, after you select the action, both the new **Tool** and action appear inside the agent on the designer at the same time. Both information panes open at the same time.

   :::image type="content" source="media/create-conversational-agent-workflows/added-tool-send-email.png" alt-text="Screenshot shows workflow designer with Weather agent, Get weather tool, and new tool with action named Send an email (V2)." lightbox="media/create-conversational-agent-workflows/added-tool-send-email.png":::

1. On the tool information pane, rename the tool to describe its purpose. For this example, use `Send email`.

1. On the **Details** tab, for **Description**, enter the tool description. For this example, use `Send current weather by email.`

   :::image type="content" source="media/create-conversational-agent-workflows/send-email-tool.png" alt-text="Screenshot shows completed Send email tool with description." lightbox="media/create-conversational-agent-workflows/send-email-tool.png":::

## Create agent parameters for 'Send an email (V2)' action

Except for the different agent parameters to set up for the **Send an email (V2)** action, the steps in this section are nearly the same as [Create agent parameters for the 'Get current weather' action](#create-agent-parameters-get-weather).

- Follow the earlier general steps to create agent parameters for the parameter values in the **Send an email (V2)** action.

   The action needs three agent parameters named **To**, **Subject**, and **Body**. For the action's Swagger definition, see [**Send an email (V2)**](/connectors/outlook/#send-an-email-(v2)).

   When you're done, the example action uses the previously defined agent parameters as shown here:

   :::image type="content" source="media/create-conversational-agent-workflows/send-email-action.png" alt-text="Screenshot shows the information pane for the action named Send an email V2, plus the previously defined agent parameters named To, Subject, and Body." lightbox="media/create-conversational-agent-workflows/send-email-action.png":::

   The finished **Send email** tool looks like the following example:

   :::image type="content" source="media/create-conversational-agent-workflows/send-email-tool-complete.png" alt-text="Screenshot shows the agent and finished Send email tool." lightbox="media/create-conversational-agent-workflows/send-email-tool-complete.png":::

[!INCLUDE [best-practices-agent-workflows](includes/best-practices-agent-workflows.md)]

## Trigger or run the workflow

You can trigger or run conversational agent workflows in the following ways, based on the deployment environment:

| Environment | Description |
|-------------|-------------|
| Nonproduction | On the workflow designer toolbar, select **Chat** to manually start a chat session with the conversational agent in the Azure portal. <br><br>**Important**: This method is intended only for test activities. Portal-based testing uses a temprary developer key. External users or production systems can't use this key. For more information, see [Authentication and authorization](#authentication-and-authorization). |
| Production | Requires that you set up authentication for external users or clients such as websites, mobile apps, bots, or other Azure services to access the conversational agent. They can then trigger the workflow by using the chat client URL. |

The following table describes how chat users or clients use the chat client URL to run the workflow in production:

| Workflow type | Chat client URL usage | Required authentication |
|---------------|-----------------------|-------------------------|
| **Consumption** | Open the URL in a browser or embed the URL in an *iFrame* HTML element. | OAuth 2.0 with Microsoft Entra ID |
| **Standard** | Open the URL in a browser, embed the URL in an *iFrame* element, or if you use the **Request** trigger, call the trigger's HTTP URL. | Managed identity or Easy Auth |

To embed the chat client URL in an [*iFrame* HTML element](https://developer.mozilla.org/docs/Web/HTML/Reference/Elements/iframe), use the following format:

| Workflow type | iFrame HTML element |
|---------------|---------------------|
| Consumption | `<iframe src="https://agents.<region>.logic.azure.com/scaleunits/<scale-unit-ID>/flows/<workflow-ID>/agentChat/IFrame" title="<chat-client-name>"></iframe>` |
| Standard | `<iframe src="https://<logic-app-name>.azurewebsites.net/api/agentsChat/<workflow-name>/IFrame" title="<chat-client-name>"></iframe>` |

## Authentication and authorization

For nonproduction activities, such as design, development, and quick testing, the Azure portal provides, manages, and uses a *developer key* to run your workflow and execute actions on your behalf. The following list recommends some best practices for handling this developer key:

- Treat the developer key strictly and only as a design-time convenience for authentication and authorization.

- Before you expose your conversational agent to other agents, automation, or wider user populations, migrate to signed SAS with network restrictions or the following authentication and authorization methods for external chat, based on your conversational agent workflow type:

  | Workflow | Authentication |
  |----------|----------------|
  | Consumption | [OAuth 2.0 with Microsoft Entra ID](/entra/architecture/auth-oauth2) |
  | Standard | Managed identity, [Easy Auth (App Service Authentication)](set-up-authentication-agent-workflows.md) |

  Basically, if anyone or anything outside your Azure portal session needs to call or interact with your workflow, the developer key is no longer appropriate.

When you're ready to release your agent workflow into production, make sure to follow the [migration steps to prepare for production authentication and authorization](#migrate-to-production-authentication). For more information, see [Authentication and authorization](agent-workflows-concepts.md#authentication-and-authorization).

<a name="production-authentication"></a>

## Migrate to production authentication

1. On your logic app resource, set up the following authentication, based on your workflow type:

   | Workflow | Authentication |
   |----------|----------------|
   | Consumption | [OAuth 2.0 with Microsoft Entra ID](/entra/architecture/auth-oauth2) by creating an agent authorization policy on your logic app resource. <br><br>To create this policy, follow these steps: <br>1. Follow the [general steps to create the policy](logic-apps-securing-a-logic-app.md?tabs=azure-portal#enable-azure-ad-inbound), but with these next steps instead. <br>2. Select **Azure Active Directory (AAD)**. <br>3. Select **Agent Authorization Rule (For Conversational Agents)**. <br>4. Under **Object IDs**, enter the object ID for each user, app, or enterprise app that can access the agent. <br>5. When you're done, on the toolbar, select **Save**. <br><br>For more information, see: <br>- [Locate important IDs for a user](/partner-center/account-settings/find-ids-and-domain-names) <br>- [Application and service principal objects in Microsoft Entra ID](/entra/identity-platform/app-objects-and-service-principals) |
   | Standard | Managed identity, [Easy Auth (App Service Authentication)](set-up-authentication-agent-workflows.md) |

1. Enforce any authentication required access patterns.

1. Optionally, lock down any trigger endpoint URLs by disabling or regenerating any unused SAS URLs.

1. To include the external chat client interface on a website or anywhere else to support human interactions, get the chat client URL and embed the URL in an [*iFrame* HTML element](https://developer.mozilla.org/docs/Web/HTML/Reference/Elements/iframe) by following these steps:

   1. On the designer toolbar or workflow sidebar, select **Chat**.

   1. In the **Essentials** section, copy or select the **Chat Client URL** link, which opens in new browser tab.

   1. Embed the chat client URL in an [*iFrame* HTML element](https://developer.mozilla.org/docs/Web/HTML/Reference/Elements/iframe), which uses the following format:

      | Workflow | iFrame HTML element |
      |----------|---------------------|
      | Consumption | `<iframe src="https://agents.<region>.logic.azure.com/scaleunits/<scale-unit-ID>/flows/<workflow-ID>/agentChat/IFrame" title="<chat-client-name>"></iframe>` |
      | Standard | `<iframe src="https://<logic-app-name>.azurewebsites.net/api/agentsChat/<workflow-name>/IFrame" title="<chat-client-name>"></iframe>` |

### Troubleshoot authentication migration

The following table describes common problems you might encounter when you try to migrate from a developer key to Easy Auth, their possible causes, and actions you can take:

| Symptom | Likely cause | Action |
|---------|--------------|--------|
| Portal tests work, but external calls get **401** response. | External calls don't have a valid signed SAS token or Easy Auth access token (Standard workflows only). | Use a workflow trigger URL with a signed SAS or Set up Easy Auth (Standard workflows only). |
| Designer tests work, but Azure API Management calls fail. | API Management calls are missing expected header information. | Add OAuth 2.0 token acquisition in API Management policy or use managed identity authentication where supported. |
| Access is inconsistent after a role changes. | Cached session in the Azure portal | - Sign out and sign back in. <br><br>- Get a fresh token. |

[!INCLUDE [troubleshoot-agent-workflows](includes/troubleshoot-agent-workflows.md)]

[!INCLUDE [clean-up-resources](includes/clean-up-resources.md)]

## Related content

- [AI agent workflows in Azure Logic Apps](/azure/logic-apps/agent-workflows-concepts)
- [Lab: Build your first conversational agent workflow in Azure Logic Apps](https://azure.github.io/logicapps-labs/docs/logicapps-ai-course/build_conversational_agents/create-first-conversational-agent)
- [Azure Logic Apps limits and configuration](/azure/logic-apps/logic-apps-limits-and-config)
- [Azure OpenAI Service quotas and limits](/azure/ai-services/openai/quotas-limits)
