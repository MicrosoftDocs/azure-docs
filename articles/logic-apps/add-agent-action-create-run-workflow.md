---
title: Run Workflows as Actions on Agents in Azure AI Foundry
description: Learn how to create and run automation workflows as actions in agents by using Azure AI Foundry and Azure Logic Apps.
services: logic-apps, azure-ai-foundry
author: ecfan
ms.suite: integration
ms.reviewers: estfan, divswa, psamband, aahi, azla
ms.topic: how-to
ms.collection: ce-skilling-ai-copilot
ms.date: 05/19/2025
ms.update-cycle: 180-days
# Customer intent: As an integration solutions developer, I want to add an action to an agent in Azure AI Foundry so that the agent creates and runs a logic app workflow in Azure Logic Apps.
ms.custom:
  - build-2025
---

# Run automation workflows from actions in agents with Azure AI Foundry and Azure Logic Apps (Preview)

[!INCLUDE [logic-apps-sku-consumption](includes/logic-apps-sku-consumption.md)]

> [!NOTE]
>
> This capability is in preview, might incur charges, and is subject to the
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

When you have an AI app in Azure AI Foundry that needs to automate multi-step processes or integrate with various services, systems, apps, and data sources, you can add *actions* in *agents* to run automation workflows in Azure Logic Apps.

In Azure AI Foundry, an agent uses an action and an AI model to autonomously or interactively complete a task. For example, agents use actions to answer questions, get information, and perform other jobs by using AI models.

In Azure Logic Apps, a logic app workflow automates processes and can integrate Azure, Microsoft, and services, systems, apps, and data sources in other ecosystems - usually without any extra code. The workflow uses a prebuilt trigger and actions from a gallery with [1,400+ connectors](/connectors/) along with runtime-native or "built-in" operations.

The following diagram shows how an action on an agent in Azure AI Foundry relates to a logic app workflow in Azure Logic Apps:

:::image type="content" source="media/add-agent-action-create-run-workflow/azure-ai-foundry-logic-apps-arch.png" alt-text="Architecture diagram shows Azure AI Foundry portal with example AI agent and action connected to Azure portal with multitenant Azure Logic Apps and example logic app workflow that accesses external APIs." border="false" lightbox="media/add-agent-action-create-run-workflow/azure-ai-foundry-logic-apps-arch.png":::

This guide shows how to add an action to an agent in Azure AI Foundry so that the agent creates a Consumption logic app workflow that runs in multitenant Azure Logic Apps. A wizard guides you through the steps to set up this action with a predefined logic app workflow. After you finish adding the action, you can extend this workflow, based on your scenario's needs, by using the graphical designer in Azure Logic Apps.

For more information, see the following documentation:

- [What is Azure AI Foundry?](/azure/ai-foundry/what-is-azure-ai-foundry)
- [What is Azure Logic Apps?](/azure/logic-apps/logic-apps-overview)
- [Consumption logic app workflow - Hosting options](/azure/logic-apps/logic-apps-overview#create-and-deploy-to-different-environments)

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An [Azure AI Foundry project](/azure/ai-foundry/how-to/create-projects?tabs=ai-studio), which is created with a default [hub](/azure/ai-foundry/how-to/create-azure-ai-resource?tabs=portal).

  This project organizes your work and saves the state while you build your AI apps. The hub hosts your project and provides a team collaboration environment.

  To create a project with a hub, you need one of the following roles for Microsoft Entra role-based access control (RBAC), based on the [principle of least privilege](/entra/identity-platform/secure-least-privileged-access):

  - **Contributor** (least privilege)

  - **Owner**

  If you have any other role, you need to have the hub created for you. For more information, see the following documentation:

  - [Default roles for projects](/azure/ai-foundry/concepts/rbac-azure-ai-foundry#default-roles-for-projects)

  - [Default roles for hubs](/azure/ai-foundry/concepts/rbac-azure-ai-foundry#default-roles-for-the-hub)

- A deployed Azure OpenAI Service [model for your project](/azure/ai-services/openai/concepts/models).

  If you don't have a deployed model, see [Deploy a model](/azure/ai-services/openai/how-to/create-resource?pivots=web-portal#deploy-a-model).

- An [agent in your project](/azure/ai-services/agents/quickstart?context=%2Fazure%2Fai-foundry%2Fcontext%2Fcontext&pivots=ai-foundry-portal).

  This requirement includes deploying a model in Azure OpenAI Service for the agent to use while the workflow runs.

#### Can I create and use my own workflows as actions?

Yes, to make your own logic app workflows available through the actions gallery in the Azure AI Foundry portal, your workflows need to meet the following requirements:

- The logic app resource that contains the workflow uses the **Consumption** hosting option.

- The logic app resource uses the same Azure subscription that you use with Azure AI Foundry.

- The workflow starts with the [trigger named **When a HTTP request is received** trigger](/azure/connectors/connectors-native-reqres#add-request-trigger).

- The trigger includes a description, which you provide on the trigger information pane in the workflow designer.

- The workflow ends with the [**Response** action](/azure/connectors/connectors-native-reqres#add-a-response-action).

Your AI app has almost endless options for running workflows that interact with Azure, Microsoft, and other services or products, plus operations that help you manage, shape, convert, and transform data. If no prebuilt connector exists for what you want to do, you can also create your own.

:::image type="content" source="media/add-agent-action-create-run-workflow/azure-ai-foundry-logic-apps-arch-full.png" alt-text="Architecture diagram shows Azure AI Foundry portal with example AI agent and action connected to Azure portal with multitenant Azure Logic Apps and example logic app workflow that can access Azure, Microsoft, and REST APIs for other services and systems." border="false" lightbox="media/add-agent-action-create-run-workflow/azure-ai-foundry-logic-apps-arch-full.png":::

For more information, see the following documentation:

- [Quickstart: Create an example Consumption logic app workflow using the Azure portal](/azure/logic-apps/quickstart-create-example-consumption-workflow)
- [What are connectors in Azure Logic Apps](/azure/connectors/introduction)
- [Managed connectors that run in global, multitenant Azure](/azure/connectors/managed)
- [Managed connectors technical reference for Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
- [Built-in operations that run with Azure Logic Apps runtime](/azure/connectors/built-in)
- [Custom connectors in Azure Logic Apps](/azure/logic-apps/custom-connector-overview)

## Limitations and known issues

This release has the following limitations or known issues:

| Limitation | Description |
|------------|-------------|
| Logic app workflow support | Agent actions currently support only Consumption logic app workflows in multitenant Azure Logic Apps. A Consumption logic app resource can have only one workflow. For more information, see [Hosting options for deployments](/azure/logic-apps/logic-apps-overview#create-and-deploy-to-different-environments). <br><br>Agent actions currently don't support Standard logic app workflows in single-tenant Azure Logic Apps, App Service Environments, or hybrid deployments. A Standard logic app can have multiple workflows. For more information, see [Hosting options for deployments](/azure/logic-apps/logic-apps-overview#create-and-deploy-to-different-environments). |

## Add an action to your agent

Follow these steps to set up an action for your agent to create and run a logic app workflow.

1. Sign in to the [Azure AI Foundry portal](https://ai.azure.com/), and open your project.

1. From your project overview, on the portal navigation menu, under **Build and customize**, select **Agents**. On the **Agents** page, under **My agents**, select your agent.

   :::image type="content" source="media/add-agent-action-create-run-workflow/select-agent.png" alt-text="Screenshot shows Azure AI Foundry portal, navigation menu with selected Agents option, and a selected agent." lightbox="media/add-agent-action-create-run-workflow/select-agent.png":::

1. In the **Setup** section next to the agents list, scroll down to the **Actions** section, and select **Add**.

   :::image type="content" source="media/add-agent-action-create-run-workflow/add-action.png" alt-text="Screenshot shows Azure AI Foundry portal, agent's Setup sidebar, and selected option for Add action." lightbox="media/add-agent-action-create-run-workflow/add-action.png":::

1. In the **Add action** window, select **Azure Logic Apps**.

   :::image type="content" source="media/add-agent-action-create-run-workflow/azure-logic-apps.png" alt-text="Screenshot shows Azure AI Foundry window named Add action." lightbox="media/add-agent-action-create-run-workflow/azure-logic-apps.png":::

1. Under **Select an action**, select a predefined action with one of the following labels:

   | Action label | Description |
   |--------------|-------------|
   | **Microsoft Authored** | This action uses a Microsoft authored template to create the workflow for the action. |
   | **Workflow** | This action uses an eligible logic app workflow in your Azure subscription as a template to create the workflow for the action. <br><br>**Note**: If you select this option, skip to the section named [Confirm action details](#confirm-action-details). If your workflows don't appear as expected in the actions gallery, [check the requirements](#can-i-create-and-use-my-own-workflows-as-actions). |

   The following example uses the Microsoft authored action named **Get Weather forecast for today via MSN Weather**:

   :::image type="content" source="media/add-agent-action-create-run-workflow/get-weather-forecast-action.png" alt-text="Screenshot shows Azure AI Foundry window named Add Logic App action with selected action named Get Weather forecast." lightbox="media/add-agent-action-create-run-workflow/get-weather-forecast-action.png":::

1. In the **Add Logic App action** window, under the **Enter some basic information**, provide the following information:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Your action name** | Yes | <*action-name*> | A friendly, but task-focused, verb-first, concise name for the action. This name is also used for the logic app resource and workflow in Azure Logic Apps. <br><br>**Note**: <br><br>- The action name can use only letters, numbers, and the following special characters: **-**, **(**, **)**, **_**, or **'**. <br><br>- You can't use whitespace or other special characters. <br><br>- A Consumption logic app resource and workflow are combined and have a 1:1 relationship, so they use the same name. By comparison, a Standard logic app resource can have multiple workflows that use different names. <br><br>This example uses **Get-weather-forecast-today**. |
   | **Your action description** | Yes | <*action-description*> | A description that clearly describes the purpose for the action. <br><br>This example uses **This action creates a callable Consumption logic app workflow that gets the weather forecast for today and runs in global, multitenant Azure Logic Apps.** |
   | **Subscription** | Yes | <*Azure-subscription*> | The Azure subscription to use, presumably the same as your project and model. |
   | **Resource group** | Yes | <*Azure-resource-group*> | The Azure resource group to use. |
   | **Location** | Yes | <*Azure-region*> | The Azure region where to host the logic app resource and workflow. |

   The following screenshot shows the example details for the sample action **Get-weather-forecast-today**:

   :::image type="content" source="media/add-agent-action-create-run-workflow/action-details.png" alt-text="Screenshot shows Azure AI Foundry window details about the action to create based on the previously selected action, such as action name, description, subscription, resource group, and location." lightbox="media/add-agent-action-create-run-workflow/action-details.png":::

1. When you're done, select **Next**.

## Create and authenticate connections

Follow these steps to create any connections that the action needs and authenticate access to the relevant services, systems, apps, or data sources. The underlying template specifies the connectors to use for this action and the logic app workflow.

1. In the **Add Logic App action** window, under **Authenticate**, review any connections that you need to create and authenticate.

1. In the **Connection** column, select **Connect** for the related service or data source.

   The following screenshot shows the example connection to create and authenticate for the MSN Weather service:

   :::image type="content" source="media/add-agent-action-create-run-workflow/authenticate-connections.png" alt-text="Screenshot shows Azure AI Foundry window, Authenticate page, and selected option for Connect to authenticate access for MSN Weather service." lightbox="media/add-agent-action-create-run-workflow/authenticate-connections.png":::

   Some connections require more details, so follow the prompts to provide the requested information.

1. For each required connection, repeat these steps.

1. When you're done, select **Next**.

## Confirm action details

Review and check that all the action information appears correct. If you selected a Microsoft authored action, review and consent to the acknowledgment statement.

1. In the **Add Logic App action** window, under **Resource**, check all the provided action information.

1. For a selected Microsoft authored action, complete the following steps:

   1. Review the statement that you acknowledge and understand the following events that happen after you leave **Resource** page by selecting **Next**:

      - You can't return to the previous steps.

      - The action creates a Consumption logic app resource.

      - Connecting to Azure Logic Apps incurs charges in your Azure account.

        For more information about the billing model for Consumption logic app workflows, see the following documentation:

        - [Usage metering, billing, and pricing](/azure/logic-apps/logic-apps-pricing#consumption-multitenant)

        - [Azure Logic Apps pricing (Consumption Plan - Multitenant)](https://azure.microsoft.com/pricing/details/logic-apps/)

   1. To consent, select the confirmation box, for example:

      :::image type="content" source="media/add-agent-action-create-run-workflow/resource-create.png" alt-text="Screenshot shows Azure AI Foundry window with Resource page and selected confirmation box to create a logic app resource." lightbox="media/add-agent-action-create-run-workflow/resource-create.png":::

1. When you're ready, select **Next**

## Finish creating the action

For the final step, review the information that the portal generates about the tool used by the agent to run your action and authenticate access to any relevant Azure, Microsoft, and non-Microsoft services or resources.

1. In the **Add Logic App action** window, on the **Schema** page, review the following information, and make sure to provide a description about the circumstances for calling the tool:

   | Parameter | Description |
   |-----------|-------------|
   | **Tool name** | The editable name for the tool that the agent uses to run your action and access Azure, Microsoft, external services, data sources, or specialized AI models so that the agent can get data, run tasks, and interact with other platforms. <br><br>**Note**: <br><br>- The action name can use only letters, numbers, and the underscore (**_**) character. <br><br>- You can't use whitespace or other special characters. |
   | **Connection for authentication** | The read-only name for the the connection that the agent uses to access Azure, Microsoft, and external resources without having to ask for credentials every time. For more information, see [Connections in Azure AI Foundry portal](/azure/ai-foundry/concepts/connections). |
   | **Describe how to invoke the tool** | The description that specifies the circumstances for when the agent calls the tool. |
   | **Schema** | The schema for the logic app workflow in JavaScript Object Notation (JSON) format. |

   :::image type="content" source="media/add-agent-action-create-run-workflow/finish-create-action.png" alt-text="Screenshot shows Azure AI Foundry window with Schema page and description about the circumstances to invoke the tool." lightbox="media/add-agent-action-create-run-workflow/finish-create-action.png":::

1. When you're ready, select **Create**.

   The portal returns you to the **Agents** page for your selected agent. In the **Setup** section, the **Actions** section now shows the name for the tool that runs your action and displays the icon for Azure Logic Apps next to the tool name, for example:

   :::image type="content" source="media/add-agent-action-create-run-workflow/add-action-finish.png" alt-text="Screenshot shows Azure AI Foundry window with Agents page, selected agent, and Setup section with Actions section, showing tool that runs your new action." lightbox="media/add-agent-action-create-run-workflow/add-action-finish.png":::

## Test the agent action

To try the new action for your agent by using the **Agents playground**, follow these steps:

1. On the **Agents** page, at the top of the **Setup** section, select **Try in playground**.

1. On the **Agents playground** page, in the user query chat box, ask a question about the weather, for example:

   **What is the weather in London? Show the results in bullet list format.**

   The agent returns a response similar to the following example:

   :::image type="content" source="media/add-agent-action-create-run-workflow/test-action.png" alt-text="Screenshot shows Azure AI Foundry window with Agents playground page, test prompt about London weather with format instructions, and response." lightbox="media/add-agent-action-create-run-workflow/test-action.png":::

## Review underlying logic app and workflow

After the action runs, you can view the underlying logic app resource and workflow in the Azure portal. You can review the workflow's run history, which you can use to debug or troubleshoot problems that the workflow might experience.

1. Sign in to the [Azure portal](https://portal.azure.com). In the portal title bar search box, enter the name for the action you created.

1. In the results list, under **Resources**, select the logic app resource.

   :::image type="content" source="media/add-agent-action-create-run-workflow/find-logic-app-azure-portal.png" alt-text="Screenshot shows Azure portal, title bar search box with logic app resource name, and selected result with logic app workflow name." lightbox="media/add-agent-action-create-run-workflow/find-logic-app-azure-portal.png":::

1. To view the workflow's run history, inputs, outputs, and other information, on the logic app menu, under **Development Tools**, select **Run history**.

1. In the **Run history** list, select the latest workflow run, for example:

   :::image type="content" source="media/add-agent-action-create-run-workflow/select-workflow-run.png" alt-text="Screenshot shows Azure portal, Run history page, and selected most recent workflow run." lightbox="media/add-agent-action-create-run-workflow/select-workflow-run.png":::

1. After the monitoring view opens and shows the status for each operation in the workflow, select an operation to open the information pane and review the operation's inputs and outputs.

   This example selects the action named **Get forecast for today**, for example:

   :::image type="content" source="media/add-agent-action-create-run-workflow/view-inputs-outputs.png" alt-text="Screenshot shows Azure portal, monitoring view for workflow run, selected operation, and information pane with operation inputs and outputs." lightbox="media/add-agent-action-create-run-workflow/view-inputs-outputs.png":::

   For more information about workflow run history, see [View workflow status and run history](/azure/logic-apps/view-workflow-status-run-history?tabs=consumption).

## Open workflow in the designer

Follow these steps to review the workflow definition and operations, or edit the workflow by opening the workflow designer.

1. On the logic app menu, under **Development Tools**, select the designer.

   The workflow opens in the designer. You can now review the workflow's operations, which refer to the trigger and actions, for example:

   :::image type="content" source="media/add-agent-action-create-run-workflow/open-workflow-designer.png" alt-text="Screenshot shows Azure portal, workflow designer, and workflow definition created by the agent action." lightbox="media/add-agent-action-create-run-workflow/open-workflow-designer.png":::

1. To view an operation's parameters and settings, on the designer, select the operation, for example:

   :::image type="content" source="media/add-agent-action-create-run-workflow/view-parameters.png" alt-text="Screenshot shows Azure portal, workflow designer, selected operation, and information pane with operation parameters and other settings." lightbox="media/add-agent-action-create-run-workflow/view-parameters.png":::

1. To expand the workflow's behavior, you can add more actions by following the steps in [Build a workflow with a trigger or action](create-workflow-with-trigger-or-action.md?tabs=consumption#add-action).

   For this workflow or any other workflow to appear in the actions gallery and run as an action in an agent, the workflow must always meet the following requirements:

   - The logic app resource that contains the workflow must use the Consumption hosting option.

   - The logic app resource must use the same Azure subscription that you use with Azure AI Foundry.

   - The workflow must start with the [**When a HTTP request is received** trigger](/azure/connectors/connectors-native-reqres#add-request-trigger).

   - The trigger requires a description, which you can find on the trigger information pane in the designer.

   - The workflow must end with the [**Response** action](/azure/connectors/connectors-native-reqres#add-a-response-action).

   > [!CAUTION]
   >
   > Although you can add actions and change the workflow, don't edit the original trigger 
   > and actions to avoid breaking the relationship between the workflow, agent, and action. 
   > Their parameters are set up to work together, so changes to these operations bear the 
   > risk of breaking the action in the agent. Instead, consider creating a custom version 
   > or a different workflow that you can add as an action to an agent.
   >
   > For example, the trigger uses the following parameters, which are necessary to call the trigger:
   >
   > | Parameter | Description |
   > |-----------|-------------|
   > | **Name** | This name is part of the trigger's HTTPS URL. External callers, such as other services, outside the workflow send an HTTPS request to this URL, which fires the trigger and starts the workflow. The trigger is always the first step in a workflow and specifies the condition to meet for the trigger to run. |
   > | **HTTPS URL** | When the workflow is saved for the first time, this URL is generated and used for calling an endpoint that the trigger creates for the workflow. |
   > | **Method** | This setting specifies whether the trigger accepts all or only specific HTTPS methods. |
   > | **Request Body JSON Schema** | If you want to validate the input that the trigger expects to receive in the HTTPS request sent from external callers, this schema specifies the JSON schema to use for validating that input. |

1. To save any changes that you make, on the designer toolbar, select **Save**.

## Test a workflow in the designer

If you made changes to the weather workflow or to test a different workflow, follow these steps:

1. On the designer toolbar, select **Run** > **Run with payload**.

1. After the **Run with payload** pane opens, in the **Body** field, provide the expected trigger inputs in JSON format, for example:

   ```json
   {
       "location": {
           "type": "London",
           "description": "Location for the weather"
       }
   }
   ```

1. When you're ready, select **Run**.

   On the **Output** tab, the **Response Body** contains the results and response from the workflow.

1. If your workflow run produces errors or requires troubleshooting, open to the workflow's run history so that you can examine each operation's inputs and outputs by using the relevant steps in [Review underlying logic app and workflow](#review-underlying-logic-app-and-workflow).

## Billing and pricing

Consumption logic app workflows incur charges based the "pay-for-use" billing model. For more information about this model, see the following resources:

- [Usage metering, billing, and pricing](/azure/logic-apps/logic-apps-pricing#consumption-multitenant)
- [Azure Logic Apps pricing (Consumption Plan - Multitenant)](https://azure.microsoft.com/pricing/details/logic-apps/)

For Azure AI Foundry, see the following resources:

- [Plan and manage costs for Azure AI Foundry](/azure/ai-foundry/how-to/costs-plan-manage)
- [Azure AI Foundry pricing](https://azure.microsoft.com/pricing/details/ai-foundry/)

## Clean up resources

If you don't need the resources that you created for this guide, delete the resources so that you don't continue getting charged. You can either follow these steps to delete the resource group that contains these resources, or you can delete each resource individually.

1. In the Azure AI Foundry portal, to remove the action from the agent, next to the action name, select the ellipses (**...**) button, and then select **Remove**.

1. In the [Azure portal](https://portal.azure.com) title bar search box, enter **resource groups**, and select **Resource groups**.

1. Find the resource group that contains your deployed hub resources.

1. On the **Overview** page toolbar, select **Delete resource group**.

1. When the confirmation pane appears, enter the resource group name, and select **Delete**.

## Related content

- [What are connectors in Azure Logic Apps?](/azure/connectors/introduction)
- [What is Azure AI Foundry?](/azure/ai-foundry/what-is-azure-ai-foundry)
- [What is Azure Logic Apps?](/azure/logic-apps/logic-apps-overview)
