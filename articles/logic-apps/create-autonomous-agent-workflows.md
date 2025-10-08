---
title: Create Autonomous AI Agent Workflows
description: Build AI agent workflows that complete tasks without human interactions in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewers: estfan, divswa, krmitta, azla
ms.topic: how-to
ms.collection: ce-skilling-ai-copilot
ms.date: 09/14/2025
ms.update-cycle: 180-days
# Customer intent: As an AI developer, I want to build workflows that complete tasks by using AI agents and other AI capabilities without human interactions for my integration solutions with Azure Logic Apps.
---

# Create autonomous agent workflows that don't use human interactions in Azure Logic Apps (Preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!IMPORTANT]
>
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

When your scenario requires workflows that support natural language and use agents connected to large language models (LLMs) to make decisions and complete tasks without human interactions, create an *autonomous* agent workflow in Azure Logic Apps. This workflow type is the best option for scenarios where agents must work without human intervention, might need to run for a long time, and require stronger governance, isolation, and automated rollback or compensation strategies.

All agent workflows perform tasks by using an agent connected to an LLM. The agent uses an iterative looped process to solve complex, multistep problems. An LLM is a trained program that recognizes patterns and performs jobs without human interaction. An agent workflow lets you separate an agent's decision logic, which includes the LLM, prompts, and orchestration, from the integration and task execution components.

An agent provides the following capabilities and benefits when connected to a model:

- Accepts instructions about the agent's role, how to operate, and how to respond.
- Receives and responds to requests or *prompts*.
- Processes inputs, analyze data, and make choices, based on available information.
- Chooses tools to complete the tasks necessary to fulfill requests. A *tool* is a sequence with one or more actions that complete a task.
- Adapts to environments that require flexibility and are fluid, dynamic, unpredictable, or unstable.

With [1,400+ connectors](/connectors/connector-reference/connector-reference-logicapps-connectors) that provide actions that you can use to create tools for an agent to use, autonomous agent workflows support a vast range of scenarios that can greatly benefit from AI capabilities.

The following screenshot shows an example autonomous agent workflow that you create in this guide. The workflow uses an agent to get the weather forecast and send that forecast in email. The diagram shows the agent information pane where you set up the agent and provide instructions that don't require human interaction for the agent to follow:

:::image type="content" source="media/create-autonomous-agent-workflows/weather-example.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, and example autonomous agent." lightbox="media/create-autonomous-agent-workflows/weather-example.png":::

For the high-level steps that describe how the agent works and more overview information about agent workflows, see [AI agent workflows in Azure Logic Apps](/azure/logic-apps/agent-workflows-concepts).

This guide shows how to create an example Standard logic app workflow with the **Autonomous Agents** type, which works without human interaction or inputs, and how to update an existing stateful workflow to include an agent. To fulfill requests, the agent uses tools that you build to complete the necessary tasks in real-world services and systems.

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- A new or existing Standard logic app resource or project. You can work in either development environment:

  - Azure portal: A Standard logic app resource.

    If you don't have this resource, see [Create an example Standard workflow in the Azure portal](/azure/logic-apps/create-single-tenant-workflows-azure-portal).

  - Visual Studio Code: A Standard logic app project.

    Make sure that you have the latest **Azure Logic Apps (Standard) extension for Visual Studio Code**. If you don't have this project, see [Create Standard workflows in Visual Studio Code](/azure/logic-apps/create-standard-workflows-visual-studio-code).

  The examples in this guide use the Azure portal. However, after you open the workflow designer, the steps to use the designer are mostly similar between the portal and Visual Studio Code. Some interactions have minor differences.

- For your model source, you need one of the following sources:

  | Model source | Description |
  |--------------|-------------|
  | [Azure OpenAI Service resource](/azure/ai-services/openai/overview) with a deployed [Azure OpenAI Service model](/azure/ai-services/openai/concepts/models) | You need the resource name when you create a connection to your deployed model in Azure OpenAI Service from an agent in your workflow. If you don't have this resource and model, see the following articles: <br><br>- [Create and deploy an Azure OpenAI Service resource](/azure/ai-services/openai/how-to/create-resource?pivots=web-portal) <br><br>- [Deploy a model](/azure/ai-services/openai/how-to/create-resource?pivots=web-portal#deploy-a-model) <br><br>Agent workflows support only specific models. For more information, see [Supported models](#supported-models-for-agent-workflows). |
  | [Azure OpenAI Service resource](/azure/ai-services/openai/overview) connected to an [Azure AI Foundry project](/azure/ai-foundry/what-is-azure-ai-foundry) and a deployed [Azure OpenAI model in Azure AI Foundry](/azure/ai-foundry/openai/concepts/models) | Make sure that you have a Foundry project, not a Hub based project. If you don't have this project, resource, and model, see the following articles: <br><br>- [Create and deploy an Azure OpenAI Service resource](/azure/ai-services/openai/how-to/create-resource?pivots=web-portal)<br><br>- [Create a project for Azure AI Foundry](/azure/ai-foundry/how-to/create-projects?tabs=ai-foundry) <br><br>- [Connect Azure AI services after you create a project](/azure/ai-services/connect-services-ai-foundry-portal#connect-azure-ai-services-after-you-create-a-project) or [Create a new connection in Azure AI Foundry portal](/azure/ai-foundry/how-to/connections-add?tabs=aoai%2Cblob%2Cserp&pivots=fdp-project#create-a-new-connection) <br><br>- [Deploy a model](/azure/ai-services/openai/how-to/create-resource?pivots=web-portal#deploy-a-model) <br><br>Agent workflows support only specific models. For more information, see [Supported models](#supported-models-for-agent-workflows). |

  > [!IMPORTANT]
  >
  > Although agent workflows don't incur extra charges in Azure Logic Apps, 
  > model usage incurs charges. For more information, see the Azure 
  > [Pricing calculator](https://azure.microsoft.com/pricing/calculator/).

- The authentication to use when you create a new connection between an agent and your deployed model.

  > [!NOTE]
  >
  > For Azure AI Foundry projects, you must use managed identity authentication.

  - Managed identity authentication

    This connection supports authentication by using Microsoft Entra ID with a [managed identity](/entra/identity/managed-identities-azure-resources/overview). In production scenarios, Microsoft strongly recommends that you use a managed identity when possible because this option provides optimal and superior security at no extra cost. Azure manages this identity for you, so you don't have to provide or manage sensitive information such as credentials or secrets. This information isn't even accessible to individual users. You can use managed identities to authenticate access for any resource that supports Microsoft Entra authentication.

    To use managed identity authentication, your Standard logic app resource must enable the system-assigned managed identity. By default, the system-assigned managed identity is enabled on a Standard logic app. This release currently doesn't support using the user-assigned managed identity.

    > [!NOTE]
    >
    > If the system-assigned identity is disabled, [reenable the identity](/azure/logic-apps/authenticate-with-managed-identity?tabs=standard#enable-system-assigned-identity-in-the-azure-portal). 

    The system-assigned identity requires one of the following roles for Microsoft Entra role-based access control (RBAC), based on the [principle of least privilege](/entra/identity-platform/secure-least-privileged-access):

    | Model source | Role |
    |--------------|------|
    | Azure OpenAI Service resource | - **Cognitive Services OpenAI User** (least privileged) <br>- **Cognitive Services OpenAI Contributor** |
    | Azure AI Foundry project | **Azure AI User** |

    For more information about managed identity setup, see the following resources:

    - [Authenticate access and connections with managed identities in Azure Logic Apps](/azure/logic-apps/authenticate-with-managed-identity?tabs=standard)
    - [Role-based access control for Azure OpenAI Service](/azure/ai-services/openai/how-to/role-based-access-control)
    - [Role-based access control for Azure AI Foundry](/azure/ai-foundry/concepts/rbac-azure-ai-foundry)
    - [Best practices for Microsoft Entra roles](/entra/identity/role-based-access-control/best-practices)

  - URL and key-based authentication

    This connection supports authentication by using the endpoint URL and API key for your deployed model. However, you don't have to manually find these values before you create the connection. The values automatically appear when you select your model source.

    > [!IMPORTANT]
    >
    > Use this authentication option only for the examples in this guide, exploratory scenarios, 
    > nonproduction scenarios, or if your organization's policy specifies that you can't use 
    > managed identity authentication.
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

- To follow along with the examples, you need an email account to send email.

  The examples in this guide use an Outlook.com account. For your own scenarios, you can use any supported email service or messaging app in Azure Logic Apps, such as Office 365 Outlook, Microsoft Teams, Slack, and so on. The setup for other email services or apps are similar to the examples, but have minor differences.

[!INCLUDE [supported-models](includes/supported-models.md)]

## Limitations and known issues

The following table describes the current limitations and any known issues in this release.

| Limitation | Description |
|------------|-------------|
| Supported workflow types | To create an autonomous agent workflow, select the **Autonomous Agents** workflow type or add an **Agent** action to an existing **Stateful** workflow. You can't use the **Stateless** workflow type, and then add an agent. |
| Authentication | For managed identity authentication, you can use only the system-assigned managed identity at this time. Support is currently unavailable for the user-assigned managed identity. <br><br>**Note**: For Azure AI Foundry projects, you must use managed identity authentication. |
| Agent tools | - To create tools, you can use only actions, not triggers. <br><br>- A tool starts with action and always contains at least one action. <br><br>- A tool works only inside the agent where that tool exists. <br><br>- Control flow actions are unsupported. |
| Documentation | This guide covers the basic steps to create an autonomous agent workflow. Documentation for advanced features is in progress. |
| General limits | For general information about the limits in Azure OpenAI Service, Azure AI Foundry, and Azure Logic Apps, see the following articles: <br><br>- [Azure OpenAI Service quotas and limits](/azure/ai-services/openai/quotas-limits) <br>- [Azure OpenAI in Azure AI Foundry Models quotas and limits](/azure/ai-foundry/openai/quotas-limits) <br>- [Azure Logic Apps limits and configuration](/azure/logic-apps/logic-apps-limits-and-config) |

## Create an autonomous agent workflow

You can start with either a new workflow or [add an agent to a nonagent **Stateful** workflow](#add-agent-nonagent-workflow).

### Create a new workflow

To create a partial workflow with an empty **Agent**, follow these steps:

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the logic app menu, under **Workflows**, select **Workflows**.

1. On the **Workflows** page toolbar, select **Add** > **Add**.

1. On the **Create workflow** pane, complete the following steps:

   1. For **Workflow name**, provide a name for your workflow to use.

   1. Select **Autonomous Agents** > **Create**.

      :::image type="content" source="media/create-autonomous-agent-workflows/select-autonomous-agents.png" alt-text="Screenshot shows Standard logic app resource with open Workflows page and Create workflow pane with workflow name, selected Autonomous Agents option, and Create button." lightbox="media/create-autonomous-agent-workflows/select-autonomous-agents.png":::

      The designer opens and shows a partial workflow, which includes an empty **Agent** action that you need to set up later. 

      :::image type="content" source="media/create-autonomous-agent-workflows/agent-workflow-start.png" alt-text="Screenshot shows workflow designer with Add a trigger and empty Agent." lightbox="media/create-autonomous-agent-workflows/agent-workflow-start.png":::

   Before you can save your workflow, you must complete the following setup tasks for the **Agent** action:

   - Create a connection to your deployed model. You complete this task in a later section.

   - Provide system instructions that describe the roles that the agent plays, the tasks that the agent can perform, and other information to help the agent better understand how to operate. You also complete this task in a later section.

1. Add a trigger to your workflow.

   Your workflow requires a trigger to control when the workflow starts running. You can use any trigger that fits your scenario. For more information, see [Triggers](/azure/connectors/introduction#triggers).

   1. On the designer, select **Add trigger**.

   1. On the **Add a trigger** pane, follow these [general steps](/azure/logic-apps/create-workflow-with-trigger-or-action?tabs=standard#add-trigger) to add the best trigger for your scenario.

      This example uses the **Request** trigger named **When a HTTP request is received**. For this article, you don't need any other trigger setup.

      :::image type="content" source="media/create-autonomous-agent-workflows/request-trigger.png" alt-text="Screenshot shows workflow designer with Request trigger and Agent action." lightbox="media/create-autonomous-agent-workflows/request-trigger.png":::

   1. Continue to the next section so you can set up the connection between your agent and your model.

      > [!NOTE]
      >
      > If you try to save the workflow now, the designer toolbar shows a red dot on the **Errors** 
      > button. The designer alerts you to this error condition because the agent requires setup 
      > before you can save any changes. However, you don't have to set up the agent now. You can 
      > continue to create your workflow. Just remember to set up the agent before you save your workflow.
      >
      > :::image type="content" source="media/create-autonomous-agent-workflows/error-missing-agent-settings.png" alt-text="Screenshot shows workflow designer toolbar with Errors button with red dot and error in the agent action information pane." lightbox="media/create-autonomous-agent-workflows/error-missing-agent-settings.png":::

<a name="add-agent-nonagent-workflow"></a>

### Add an agent to a nonagent workflow

For an existing **Stateful** workflow, you can add an **Agent** action to include autonomous agent and LLM capabilities by following these steps:

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the logic app menu, under **Workflows**, select **Workflows**.

1. On the **Workflows** page, select the **Stateful** workflow where you want to add an agent.

1. After the designer opens, follow the [general steps to add an action named **Agent** to your workflow](add-trigger-action-workflow.md?tabs=standard#add-action), for example:

   :::image type="content" source="media/create-autonomous-agent-workflows/add-agent.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, existing workflow, and option to add an agent." lightbox="media/create-autonomous-agent-workflows/add-agent.png":::

1. Continue with the next section to connect the agent to your model.

<a name="connect-agent-to-model"></a>

## Connect the agent to your model

Now, create a connection between the agent and your deployed model by following these steps:

1. On the designer, select the title bar on the **Agent** action to open the **Create connection** pane.

   This pane opens only if you don't have an existing working connection.

1. In the **Create a new connection** section, provide the following information:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Connection Name** | Yes | <*connection-name*> | The name to use for the connection to your deployed model. <br><br>This example uses **fabrikam-azure-ai-connection**. |
   | **Agent Model Source** | Yes | - **Azure OpenAI** <br>- **Foundry Agent Service** | The source for the deployed model. |
   | **Authentication Type** | Yes | - **Managed identity** <br><br>- **URL and key-based authentication** | The authentication type to use for validating and authorizing an identity's access to your deployed model. <br><br>**Note**: For Azure AI Foundry projects, you must use managed identity authentication. <br><br>- **Managed identity** requires that your Standard logic app have a managed identity enabled and set up with the required roles for role-based access. For more information, see [Prerequisites](#prerequisites). <br><br>- **URL and key-based authentication** requires the endpoint URL and API key for your deployed model. These values automatically appear when you select your model source. <br><br>**Important**: For the examples and exploration only, you can use **URL and key-based authentication**. For production scenarios, use **Managed identity**. |
   | **Subscription** | Yes | <*Azure-subscripton*> | Select the Azure subscription associated with your Azure OpenAI Service resource. |
   | **Azure OpenAI Resource** | Yes, only when **Agent Model Source** is **Azure OpenAI** | <*Azure-OpenAI-Service-resource-name*> | Select your Azure OpenAI Service resource. |
   | **AI Foundry Project** | Yes, only when **Agent Model Source** is **Foundry Agent Service** | <*Azure-AI-Foundry-project-name*> | Select your project in Azure AI Foundry. <br><br>**Note**: If you recently assigned the necessary role on your project, you might experience a delay before role permissions take effect. Meanwhile, an error message appears that you don't have correct permissions on the project. |
   | **API Endpoint** | Yes | Automatically populated | The endpoint URL for your deployed model in Azure OpenAI Service. <br><br>This example uses **`https://fabrikam-azureopenai.openai.azure.com/`**. |
   | **API Key** | Yes, only when **Authentication Type** is **URL and key-based authentication** | Automatically populated | The API key for your deployed model in Azure OpenAI Service. |

   For example, if you select **Azure OpenAI** as your model source and **Managed identity** for authentication, your connection information looks like the following sample:

   :::image type="content" source="media/create-autonomous-agent-workflows/connection-azure-openai.png" alt-text="Screenshot shows example connection details for a deployed model in Azure OpenAI Service." lightbox="media/create-autonomous-agent-workflows/connection-azure-openai.png":::

   If you select **Foundry Agent Service** as your model source with **Managed identity** for authentication, your connection information looks like the following sample:

   :::image type="content" source="media/create-autonomous-agent-workflows/connection-ai-foundry.png" alt-text="Screenshot shows example connection details for a deployed model in Azure AI Foundry." lightbox="media/create-autonomous-agent-workflows/connection-ai-foundry.png":::

1. When you're done, select **Create new**.

   If you want to create another connection, on the **Parameters** tab, scroll down to the bottom, and select **Change connection**.

1. Continue to the next section.

## Rename the agent

Clearly identify the agent's purpose by updating the agent name in following steps:

1. If the agent information pane isn't open, on the designer, select the agent title bar to open the pane.

1. On the agent information pane, select the agent name, and enter the new name, for example, **Weather agent**.

   :::image type="content" source="media/create-autonomous-agent-workflows/rename-agent.png" alt-text="Screenshot shows workflow designer, workflow trigger, and renamed agent." lightbox="media/create-autonomous-agent-workflows/rename-agent.png":::

   > [!NOTE]
   >
   > If the connection to your model is incorrect, the **Deployment Model Name** list appears unavailable.

1. Continue to the next section to provide system instructions for the agent.

## Set up system instructions for the agent

The agent requires *system instructions* that describe the roles that the agent can play and the tasks that the agent can perform. To help the agent learn and understand these responsibilities, you can also include the following information:

- Workflow structure
- Available actions
- Any restrictions or limitations
- Interactions for specific scenarios or special cases

To get the best results, make sure that your system instructions are prescriptive and that you're willing to refine these instructions over multiple iterations.

1. Under **Instructions for Agent**, in the **System instructions** box, enter all the information that the agent needs to understand its role and tasks.

   > [!NOTE]
   >
   > Autonomous agents don't accept input through the chat interface at runtime.

   For this example, the weather agent example uses the following sample instructions where you later provide a subscriber list with your own email address for testing:

   **You're an AI agent that generates a weather report, which you send in email to each subscriber on a list. This list includes each subscriber's name, location, and email address to use.**

   **Format the weather report with bullet lists where appropriate. Make your response concise and useful, but use a conversational and friendly tone. You can include suggestions like "Carry an umbrella" or "Dress in layers".**

   Here's how the example looks with the system instructions for the agent:

   :::image type="content" source="media/create-autonomous-agent-workflows/system-instructions-weather-agent.png" alt-text="Screenshot shows workflow designer, and agent with system instructions." lightbox="media/create-autonomous-agent-workflows/system-instructions-weather-agent.png":::

1. Optionally, on the agent, you can provide user instructions that the agent can use as prompts or questions.

   For better results, make each user instruction focus on a specific task, for example:

   1. On the agent information pane, in the **User instructions** section, select **Add new item**.

   1. In the **User instructions Item - 1** box, enter the question to ask the agent.

   1. To add another instruction, select **Add new item** again.

   1. In the **User instructions item - 2** box, enter another question to ask the agent.

   1. Repeat until you finish adding all the questions to ask the agent.

1. Now, you can save your workflow. On the designer toolbar, select **Save**.

1. To make sure your workflow doesn't have errors at this stage, follow these steps:

   1. On the designer toolbar, select **Run** > **Run**.

   1. On the workflow menu, under **Tools**, select **Run history**.

   1. On the **Run history** page, on the **Run history** tab, in the **Identifier** column, select the latest workflow run.

      > [!NOTE]
      >
      > If the page doesn't show any runs, on the toolbar, select **Refresh**.
      >
      > If the **Status** column shows a **Running** status, the agent workflow 
      > is either still working or waiting. The latter behavior happens if you 
      > enabled chat channels on your agent in an earlier release. The current 
      > release no longer includes chat channels.

      The monitoring view opens and shows the workflow operations with their status. The **Agent log** pane is open and shows the system instructions that you provided earlier. The pane also shows the agent's response. For autonomous agent workflows, the chat box is unavailable and in ready-only mode.

      :::image type="content" source="media/create-autonomous-agent-workflows/agent-only-test.png" alt-text="Screenshot shows monitoring view, operation status, and agent log." lightbox="media/create-autonomous-agent-workflows/agent-only-test.png":::

      However, the agent doesn't have any tools to use at this time, which means that the agent can't actually take any specific actions, such as send email to a subscriber list, until you create tools that the agent needs to complete their tasks. You might even get an email that your email server rejected the message.

1. Return to the designer. On the monitoring view toolbar, select **Edit**.

<a name="create-tool-weather"></a>

## Create a tool to get weather forecast

For an agent to run prebuilt actions available in Azure Logic Apps, you must create one or more tools for the agent to use. A tool must contain at least one action and only actions. The agent calls the tool by using specific arguments.

In this example, the agent needs a tool that gets the weather forecast. You can build this tool by following these steps:

1. On the designer, inside the agent and under **Add tool**, select the plus sign (**+**) to open the pane where you can browse available actions.

1. On the **Add an action** pane, follow these [general steps](/azure/logic-apps/create-workflow-with-trigger-or-action?tabs=standard#add-action) to add an action for your scenario.

   This example uses the **MSN Weather** action named **Get forecast for today**.

   After you select the action, both the **Tool** and the action appear inside the agent on the designer at the same time. Both information panes also open at the same time.

   :::image type="content" source="media/create-autonomous-agent-workflows/added-tool-get-forecast.png" alt-text="Screenshot shows workflow designer with the renamed agent, which contains a tool that includes the action named Get forecast for today." lightbox="media/create-autonomous-agent-workflows/added-tool-get-forecast.png":::

1. On the tool information pane, rename the tool to describe its purpose.

   This example uses **Get weather**.

1. On the **Details** tab, for **Description**, enter the tool description.

   This example uses **Get the weather for the specified location.**

   Under **Description**, the **Agent Parameters** section applies only for specific use cases. For more information, see [Create agent parameters](#create-agent-parameters-for-the-get-forecast-action).

1. Continue to the next section to learn more about agent parameters, their use cases, and how to create them, based on these use cases.

<a name="create-agent-parameters-get-weather"></a>

## Create agent parameters for the 'Get forecast' action

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

   For this example, the action is **Get forecast for today**.

1. On the **Parameters** tab, select inside the parameter box to show the parameter options.

1. On the right edge of the **Location** box, select the stars button.

   This button has the following tooltip: **Select to generate the agent parameter**.

   :::image type="content" source="media/create-autonomous-agent-workflows/generate-agent-parameter.png" alt-text="Screenshot shows an action with the mouse cursor inside a parameter box, parameter options, and the selected option to generate an agent parameter." lightbox="media/create-autonomous-agent-workflows/generate-agent-parameter.png":::

   The **Create agent parameter** window shows the **Name**, **Type**, and **Description** fields, which are prepopulated from the source action parameter.

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

   :::image type="content" source="media/create-autonomous-agent-workflows/get-forecast-today-action.png" alt-text="Screenshot shows the Weather agent, Get weather tool, and selected action named Get forecast for today. The Location action parameter includes the created agent parameter." lightbox="media/create-autonomous-agent-workflows/get-forecast-today-action.png":::

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

   :::image type="content" source="media/create-autonomous-agent-workflows/get-weather-tool.png" alt-text="Screenshot shows workflow designer with the agent and selected tool now named Get weather." lightbox="media/create-autonomous-agent-workflows/get-weather-tool.png":::

1. Save your workflow.

## Create a tool to send email

For many scenarios, an agent usually needs more than one tool. In this example, the agent needs a tool that sends the weather report in email.

To build this tool, follow these steps:

1. On the designer, inside the agent, next to the existing tool, select the plus sign (**+**) to add an action.

1. On the **Add an action** pane, follow these [general steps](/azure/logic-apps/create-workflow-with-trigger-or-action?tabs=standard#add-action) to select another action for your new tool.

   The examples use the **Outlook.com** action named **Send an email (V2)**.

   Like before, after you select the action, both the new **Tool** and action appear inside the agent on the designer at the same time. Both information panes open at the same time.

   :::image type="content" source="media/create-autonomous-agent-workflows/added-tool-send-email.png" alt-text="Screenshot shows workflow designer with Weather agent, Get weather tool, and new tool with action named Send an email (V2)." lightbox="media/create-autonomous-agent-workflows/added-tool-send-email.png":::

1. On the tool information pane, make the tool's purpose obvious by updating the tool name.

   The examples use **Send email**.

1. On the **Details** tab, provide the following information:

   1. For **Description**, enter the tool description.

      This example uses **Send weather forecast in email.**

## Create agent parameters for the 'Send an email (V2)' action

The steps in this section are nearly the same as [Create agent parameters for the 'Get forecast' action](#create-agent-parameters-for-the-get-forecast-action), except for the different parameters in the **Send an email (V2)** action. 

1. Follow the earlier steps to create the following agent parameters for the action parameter values in the action named **Send an email (V2)**.

   The action needs three agent parameters named **To**, **Subject**, and **Body**. For the action's Swagger definition, see [**Send an email (V2)**](/connectors/outlook/#send-an-email-(v2)).

   For example, the **Send an email (V2)** action looks like the following example:

   When you're done, the example action uses the previously defined agent parameters as shown here:

   :::image type="content" source="media/create-autonomous-agent-workflows/send-email-action.png" alt-text="Screenshot shows the information pane for the action named Send an email V2, plus the previously defined agent parameters named To, Subject, and Body." lightbox="media/create-autonomous-agent-workflows/send-email-action.png":::

   The second example tool is now complete and looks like the following example:

   :::image type="content" source="media/create-autonomous-agent-workflows/send-email-tool-complete.png" alt-text="Screenshot shows the finished second tool inside the agent." lightbox="media/create-autonomous-agent-workflows/send-email-tool-complete.png":::

## Create a tool to provide subscriber list

Finally, for this example, create a tool named **Get subscribers** to provide a subscriber list for the agent parameter values to use. This tool uses the **Compose** action to supply the subscriber name, email address, and location. Or, you might source these inputs from blob storage or a database. Azure Logic Apps offers many options that you can use as data sources.

The following example shows how the **Get subscribers** tool might look:

:::image type="content" source="media/create-autonomous-agent-workflows/add-tool-get-subscribers.png" alt-text="Screenshot shows agent with new tool named Get subscribers that contains a Compose action with subscriber information." lightbox="media/create-autonomous-agent-workflows/add-tool-get-subscribers.png":::

[!INCLUDE [best-practices-agent-workflows](includes/best-practices-agent-workflows.md)]

[!INCLUDE [troubleshoot-agent-workflows](includes/troubleshoot-agent-workflows.md)]

[!INCLUDE [clean-up-resources](includes/clean-up-resources.md)]

## Related content

- [AI agent workflows in Azure Logic Apps](/azure/logic-apps/agent-workflows-concepts)
- [Lab: Build your first autonomous agent workflow in Azure Logic Apps](https://azure.github.io/logicapps-labs/docs/logicapps-ai-course/build_autonomous_agents/create-first-autonomous-agent)
- [Azure Logic Apps limits and configuration](/azure/logic-apps/logic-apps-limits-and-config)
- [Azure OpenAI Service quotas and limits](/azure/ai-services/openai/quotas-limits)
