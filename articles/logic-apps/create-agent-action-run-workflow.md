---
title: Create Workflows for Agent Actions in Azure AI Foundry
description: Learn how to create agent actions that run automated workflows by using Azure AI Foundry and Azure Logic Apps.
services: logic-apps, azure-ai-foundry
author: ecfan
ms.suite: integration
ms.reviewers: estfan, divswa, psamband, aahi, miemonts, azla
ms.topic: how-to
ms.collection: ce-skilling-ai-copilot
ms.date: 05/19/2025
# Customer intent: As an integration solutions developer, I want to create actions for agents in Azure AI Foundry that run automated workflows in Azure Logic Apps.
---

# Create agent actions that run workflows by using Azure AI Foundry and Azure Logic Apps (Preview)

[!INCLUDE [logic-apps-sku-consumption](includes/logic-apps-sku-consumption.md)]

> [!NOTE]
>
> This capability is in preview, might incur charges, and is subject to the
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

When you have an AI app in Azure AI Foundry that you need to integrate with multiple services, systems, apps, and data sources, you can create *actions* for *agents* to run automated workflows in Azure Logic Apps.

In Azure AI Foundry, an agent uses an action to autonomously or interactively complete a task. For example, agents can answer questions, get information, and perform other jobs by using AI models.

In Azure Logic Apps, a workflow can automate tasks and processes that integrate Azure, Microsoft, and services, systems, apps, and data sources in other ecosystems - usually without any extra code. The workflow uses a trigger and actions from a connectors gallery that provides [1,400+ prebuilt connectors](/connectors/) along with built-in, runtime-native operations.

The following diagram shows how an agent with an action in Azure AI Foundry relates to a logic app workflow in Azure Logic Apps:

**[DIAGRAM]**

This guide shows how add an action to an agent in Azure AI Foundry where the action runs a logic app workflow in Azure Logic Apps. A wizard guides you through steps that create a logic app resource with a predefined workflow that you can edit based on your scenario's needs. To refine or expand this workflow, you can use the graphical designer in Azure Logic Apps.

For more information, see the following documentation:

- [What is Azure AI Foundry](/azure/ai-foundry/what-is-azure-ai-foundry)?
- [What is Azure Logic Apps](/azure/logic-apps/logic-apps-overview)?

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- To run an existing Consumption logic app workflow from an action in an agent, your workflow must meet the following requirements:

  - Start with the **Request** trigger named **When a HTTP request is received**.
  - The trigger requires a description.
  - The workflow must include a **Request** action named **Response**.

- An [Azure AI Foundry project](/azure/ai-foundry/how-to/create-projects?tabs=ai-studio) and [hub](/azure/ai-foundry/how-to/create-azure-ai-resource?tabs=portal).

  This project organizes your work and saves the state while you build your AI apps. The hub hosts your project and provides a team collaboration environment.

  To create a project and hub, you need one of the following roles for Microsoft Entra role-based access control (RBAC), based on the [principle of least privilege](/entra/identity-platform/secure-least-privileged-access):

  - **Contributor** (least privilege)

  - **Owner**

  If you have any other role, you need to have the hub created for you. For more information, see the following documentation:

  - [Default roles for projects](/azure/ai-foundry/concepts/rbac-azure-ai-foundry#default-roles-for-projects)

  - [Default roles for hubs](/azure/ai-foundry/concepts/rbac-azure-ai-foundry#default-roles-for-the-hub)

- A deployed [Azure OpenAI Service model](/azure/ai-services/openai/concepts/models).

  If you don't have a model, see [Deploy a model](/azure/ai-services/openai/how-to/create-resource?pivots=web-portal#deploy-a-model).

- An [agent in your project](/azure/ai-services/agents/quickstart?context=%2Fazure%2Fai-foundry%2Fcontext%2Fcontext&pivots=ai-foundry-portal).

  This requirement includes deploying a model in Azure OpenAI Service for the agent to use. The agent is where you create an action that can run a workflow.

## Limitations and known issues

- Actions currently support only [Consumption logic app workflows](/azure/logic-apps/logic-apps-overview#create-and-deploy-to-different-environments), which run in global, multitenant Azure Logic Apps. Standard logic app workflows currently aren't supported.


## Billing

Consumption logic app workflows are billed by using the "pay-for-use" model. For more information about this model, see the following resources:

- [Usage metering, billing, and pricing](/azure/logic-apps/logic-apps-pricing#consumption-multitenant)
- [Azure Logic Apps pricing (Consumption Plan - Multitenant)](https://azure.microsoft.com/pricing/details/logic-apps/)

For Azure AI Foundry, see the following resources:

- [Plan and manage costs for Azure AI Foundry](/azure/ai-foundry/how-to/costs-plan-manage)
- [Azure AI Foundry pricing](https://azure.microsoft.com/pricing/details/ai-foundry/)

## Create an action for your agent

Follow these steps to define an action that your agent can use to call a logic app workflow.

1. Sign in to the [Azure AI Foundry portal](https://ai.azure.com/), and open your project.

1. From your project overview, on the portal navigation menu, under **Build and customize**, select **Agents**. On the **Agents** page, under **My agents**, select your agent.

   :::image type="content" source="media/create-agent-action-run-workflow/select-agent.png" alt-text="Screenshot shows Azure AI Foundry portal, navigation menu with selected Agents option, and a selected agent." lightbox="media/create-agent-action-run-workflow/select-agent.png":::

1. In the **Setup** section next to the agents list, scroll down to the **Actions** section, and select **Add**.

   :::image type="content" source="media/create-agent-action-run-workflow/add-action.png" alt-text="Screenshot shows Azure AI Foundry portal, agent Setup sidebar, and selected option for Add action." lightbox="media/create-agent-action-run-workflow/add-action.png":::

1. In the **Add action** window, select **Azure Logic Apps**.

   :::image type="content" source="media/create-agent-action-run-workflow/azure-logic-apps.png" alt-text="Screenshot shows Azure AI Foundry window named Add action." lightbox="media/create-agent-action-run-workflow/azure-logic-apps.png":::

1. Under **Select an action**, select a predefined action to jump start your workflow.

   Many predefined actions include a data source or service to use, such as Microsoft Dataverse, SQL, Outlook, and so on.

   This example uses the action named **Get Weather forecast for today via MSN Weather**.

   :::image type="content" source="media/create-agent-action-run-workflow/get-weather-forecast-action.png" alt-text="Screenshot shows Azure AI Foundry window named Add Logic App action with selected action named Get Weather forecast." lightbox="media/create-agent-action-run-workflow/get-weather-forecast-action.png":::

1. In the **Add Logic App action** window, under the **Enter some basic information**, provide the following information:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Your action name** | Yes | <*action-name*> | A concise name for the task that the action. The name can use only letters, numbers and the following special characters: **-**, **(**, **)**, **_**, or **'**. You can't use whitespace or other special characters. This example uses **Get-weather-forecast-today**. |
   | **Your action description** | Yes | <*action-description*> | A description that clearly describes the purpose for the action. |
   | **Subscription** | Yes | <*Azure-subscription*> | The Azure subscription to use, presumably the same associated with your project and model. |
   | **Resource group** | Yes | <*Azure-resource-group*> | The Azure resource group to use. |
   | **Location** | Yes | <*Azure-region*> | The Azure region where to host the Consumption logic app resource and workflow. |

   The following screenshot shows example information for an action:

   **[SCREENSHOT]**

1. When you're done, select **Next**.

## Create and authenticate connections

Now, create connections and authenticate access to the related services or data sources.

1. In the **Add Logic App action** window, under **Authenticate**, review any connections that you need to create and authenticate.

1. In the **Connect** column, select **Connect** for the related service or data source.

   Some connections require more details, so follow the prompts to provide the requested information.

   **[SCREENSHOT]**

1. Repeat these steps for each required connection.

1. When you're done, select **Next**.

## Review action details

Before you finish creating the action, confirm that all the provided information appears correct, and provide your consent to create the logic app resource and workflow.

1. In the **Add Logic App action** window, under **Resource**, check all the action details.

1. Review the acknowledgment that you understand the following events after you select **Next**:

   - You can't return to the previous steps.

   - Created connections to Azure Logic Apps incur charges in your Azure account.

     For more information about the Consumption billing model, see [Usage metering, billing, and pricing](/azure/logic-apps/logic-apps-pricing#consumption-multitenant).

   - The action creates a (Consumption) logic app resource.

1. To consent, select the confirmation box, and then select **Next**.

## Finish creating the action

Review additional details Complete this task by creating the logic app resource.

1. In the **Add Logic App action** window, on the **Schema** page, review the following information and describe the conditions for calling the tool:

   | Item | Description |
   |------|-------------|
   | **Tool name** | The name for the component that an agent uses to connect with Azure, Microsoft, external services, data sources, or specialized AI models so that the agent can get data, run tasks, and interact with other platforms. |
   | **Connection for authentication** | The read-only name for the the connection that the agent uses to access Azure, Microsoft, and external resources without having to ask for credentials every time. For more information, see [Connections in Azure AI Foundry portal](/azure/ai-foundry/concepts/connections). |
   | **Describe how to invoke the tool** | The description that specifies the circumstances or conditions for when the agent calls the tool to run the action you want. |
   | **Schema** | The schema for the logic app workflow in JavaScript Object Notation (JSON) format. |

1. When you're ready, select **Create**.

   The new action now appears under **Actions** in the **Setup** section for your agent, for example:

   **[SCREENSHOT]**

## Test the agent action

To try out the agent in the **Agents playground**, follow these steps:

1. On the **Agents** page, at the top of the **Setup** section, select **Try in playground**

   **[SCREENSHOT]**

1. On the **Agents playground** page, in the user query chat box, ask a question about the weather, for example, "What is the weather in London?**.

   The agent returns a response similar to the following example:

   **[SCREENSHOT]**

## Review and edit the logic app workflow

1. Sign in to the [Azure portal](https://portal.azure.com). In the title bar search box, enter the name for the action you created.

1. From the results list, under **Resources**, select your action.

1. After the logic app resource opens, on the resource menu, under **Development Tools**, select the designer.

   The logic app workflow opens in the designer. You can now review the workflow's trigger and actions along with their parameters and settings. You might even want to add more actions to the workflow so that you can expand the workflow's functionality or behavior and functionality. For more information, see [Build a workflow with a trigger or action](create-workflow-with-trigger-or-action.md?tabs=consumption#add-action).

   > [!CAUTION]
   >
   > Don't edit the trigger name, which changes the *callback URL*.
   > External services outside the workflow use this URL to fire the
   > trigger and start the workflow. The trigger is always the first
   > step in a workflow and specifies the condition to meet for the
   > trigger to run.

1. To keep any updates that you made, on the designer toolbar, select **Save**.

1. To view the workflow's run history, inputs, outputs, and other information, see [View workflow status and run history](/azure/logic-apps/view-workflow-status-run-history?tabs=consumption).

## Clean up resources

If you don't need the resources that you created for this guide, delete the resources so that you don't continue getting charged. You can either follow these steps to delete the resource group that contains these resources, or you can delete each resource individually.

1. To remove the action from the agent in Azure AI Foundry portal, next to the action name, select the ellipses (**...**) button, and then select **Remove**.

1. Sign in to the [Azure portal](https://portal.azure.com). In the title bar search box, enter **resource groups**, and select **Resource groups**.

1. Find the resource group that contains your deployed hub resources.

1. On the **Overview** page toolbar, select **Delete resource group**.

1. When the confirmation pane appears, enter the resource group name, and select **Delete**.

## Related content

- [What are connectors in Azure Logic Apps?](/azure/connectors/introduction)
