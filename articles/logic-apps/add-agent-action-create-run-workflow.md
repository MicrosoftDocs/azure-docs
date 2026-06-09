---
title: Run Automated Workflows from Foundry Agents
description: Run integration workflows in Azure Logic Apps from Foundry agents to automate business tasks with 1,400+ connectors.
services: azure-logic-apps, cognitive-services, azure-ai-foundry
author: ecfan
ms.suite: integration
ms.reviewers: estfan, divswa, psamband, aahi, azla
ms.topic: how-to
ai-usage: ai-assisted
zone_pivot_groups: azure-logic-apps
ms.date: 03/23/2026
ms.update-cycle: 180-days
# Customer intent: As an AI integration developer who works with Azure Logic Apps and Microsoft Foundry, I want to run workflows to perform tasks as actions from agents with Foundry Agent Service (classic).
ms.custom:
  - build-2025
  - azure-ai-agents
---

# Run workflows in Azure Logic Apps from agents in Foundry Agent Service (preview)

[!INCLUDE [logic-apps-sku-consumption](includes/logic-apps-sku-consumption.md)]

> [!NOTE]
>
> This feature is in preview, might incur charges, and is subject to the
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Agents often need to work with external systems, such as calling APIs, updating systems, or coordinating multiple steps. However, if you mix agent and integration logic, or if you directly embed integration logic in agent code, your solutions become harder to maintain, test, update, and evolve. Agents can adeptly choose actions to take or tools to use. However, they're not designed to manage retry attempts, long‑running steps, or external system failures.

In Foundry, add workflows from Azure Logic Apps to agents as *actions*. Your agents can then run multistep business tasks across Microsoft and non-Microsoft services and products - often without code. Your solutions gain and benefit from agentic capabilities with reusable integration logic.

The following diagram shows how agent actions in Foundry (classic) relate to workflows in Azure Logic Apps:

:::image type="content" source="media/add-agent-action-create-run-workflow/foundry-logic-apps-arch-full.png" alt-text="Architecture diagram that shows relationship between an agent action in Foundry and workflow in Azure Logic Apps that can integrate Microsoft and non-Microsoft services, systems, and APIs." border="false" lightbox="media/add-agent-action-create-run-workflow/foundry-logic-apps-arch-full.png":::

The agent focuses on choosing the correct action to call the integration workflow, while the workflow handles the orchestration and integration tasks.

Azure Logic Apps supports 1,400+ connectors and native, built-in data operations, so agents can integrate with many Microsoft and non-Microsoft services or products. If a prebuilt connector or operation doesn't exist, create a custom connector.

This article shows how to a workflow from Azure Logic Apps as an agent action tool in Foundry. A wizard guides you through how to set up the action. You can then edit the workflow or extend the workflow in the workflow designer for Azure Logic Apps.

For more information, see:

- [What is Azure Logic Apps?](/azure/logic-apps/logic-apps-overview)
- [Consumption logic app workflow - Hosting options](/azure/logic-apps/logic-apps-overview#create-and-deploy-to-different-environments)

> [!NOTE]
>
> This article refers to the [Microsoft Foundry (classic)](/azure/foundry-classic/what-is-foundry#microsoft-foundry-portals) portal. For more information about the new portal, see the new [Microsoft Foundry portal](/azure/foundry/what-is-foundry)

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- A [Microsoft Foundry project](/azure/foundry-classic/how-to/create-projects?tabs=foundry).

  This project organizes your work and saves the state while you build your AI apps and solutions.

  To [create a hub project](/azure/foundry-classic/how-to/hub-create-projects?tabs=portal) so you can host your project and set up a team collaboration environment, you need one of the following roles for Microsoft Entra role-based access control (RBAC), based on the [principle of least privilege](/entra/identity-platform/secure-least-privileged-access):

  - **Contributor** (least privilege)
  - **Owner**

  If you have any other role, you need to have the hub created for you. For more information, see:

  - [Role-based access control for Microsoft Foundry](/azure/foundry/concepts/rbac-foundry)
  - [Role-based access control for Microsoft Foundry (hub-focused)(classic)](/azure/foundry-classic/concepts/hub-rbac-foundry)

- An [Azure OpenAI model version gpt-4.1 or earlier](/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure?tabs=global-standard-aoai%2Cglobal-standard&pivots=azure-openai) deployed for your Foundry project.

  If you don't have this model, see [Deploy a model](/azure/foundry-classic/openai/how-to/create-resource?pivots=web-portal#deploy-a-model).

- An [agent for your Foundry project](/azure/foundry-classic/agents/quickstart?context=%2Fazure%2Fai-foundry%2Fcontext%2Fcontext&pivots=ai-foundry-portal).

- A [Consumption logic app resource and workflow](/azure/logic-apps/quickstart-create-example-consumption-workflow) that meets the following requirements:

  | Requirement | Description |
  |-------------|-------------|
  | Hosting option | Uses the **Consumption** hosting option. |
  | Azure subscription | Uses the same subscription as your Foundry project. |
  | Azure resource group | Uses the same resource group as your Foundry project. |
  | [**Request** trigger](/azure/connectors/connectors-native-reqres?tabs=consumption#add-request-trigger) | The operation that specifies the conditions to meet before running any subsequent actions in the workflow. The default trigger name is **When an HTTP request is received**. <br><br>Agent action calling requires a REST-based API. The **Request** trigger provides a REST endpoint that a service or system can call to run the workflow. So, for action calling, you can use only workflows that start with the **Request** trigger. |
  | Trigger description | This description, which you provide with the trigger information in Azure Logic Apps, helps the agent choose the correct action in Foundry. |
  | Trigger schema | A JSON schema that describes the expected inputs for the trigger. <br><br>Foundry automatically imports the schema with the action definition. For more information, see [**Request** trigger](/azure/connectors/connectors-native-reqres?tabs=consumption#add-request-trigger). |
  | [**Response** action](/azure/connectors/connectors-native-reqres?tabs=consumption#add-a-response-action) | The workflow must always end with this action, which returns the response to Foundry when the workflow completes. |

  To implement your business logic or use case, your workflow can contain any other actions from the [connectors gallery](/azure/connectors/introduction), including runtime-native, built-in operations, that implement the logic for your business scenario.

  For example, the following diagram shows an example action named `Get-weather-forecast-today` that's added as a tool for an agent named `WeatherAgent` in Foundry. This action runs a workflow named `Get-weather-forecast-today` in Azure Logic Apps:

  :::image type="content" source="media/add-agent-action-create-run-workflow/foundry-logic-apps-arch.png" alt-text="Architecture diagram that shows relationship between example agent in Foundry and example logic app workflow in multitenant Azure Logic Apps." border="false" lightbox="media/add-agent-action-create-run-workflow/foundry-logic-apps-arch.png":::

  For more information, see:

  - [Quickstart: Create an example Consumption logic app workflow using the Azure portal](/azure/logic-apps/quickstart-create-example-consumption-workflow)
  - [What are connectors in Azure Logic Apps](/azure/connectors/introduction)

- Set up the following environment variables with information from your Foundry project:

  ```bash
  export PROJECT_ENDPOINT="<your_project_endpoint>"
  export MODEL_DEPLOYMENT_NAME="<your_model_deployment_name>"
  export SUBSCRIPTION_ID="<your_Azure_subscription_ID>"
  export resource_group_name="<your_resource_group_name>"
  ```

  For sample code, see the [AzureLogicAppTool utility on GitHub](https://github.com/azure-ai-foundry/foundry-samples/blob/main/samples-classic/python/getting-started-agents/logic_apps/user_logic_apps.py).

## Limitations

This release has the following limitations:

| Limitation | Description |
|------------|-------------|
| Logic app workflow support | Agent actions currently support only Consumption logic app workflows that run in multitenant Azure Logic Apps. A Consumption logic app resource can have only one workflow. <br><br>Agent actions currently don't support Standard logic app workflows in single-tenant Azure Logic Apps, App Service Environments, or hybrid deployments. A Standard logic app resource can have multiple workflows. |

For more information, see [Hosting options for logic app deployments](/azure/logic-apps/logic-apps-overview#create-and-deploy-to-different-environments).

:::zone pivot="portal"

## 1: Add an action to your agent

To set up an action for your agent to run a logic app workflow, follow these steps:

1. In the [Foundry (classic) portal](https://ai.azure.com/), open your project.

1. On the project sidebar, under **Build and customize**, select **Agents**.

   If you didn't deploy a model for your agent, a wizard opens for you to complete this task before you continue. Make sure to select a model that supports actions on agents. For more information, see [Deploy a model](/azure/foundry-classic/openai/how-to/create-resource?pivots=web-portal#deploy-a-model).

1. On the **Create and debug your agents** page, under **My agents**, select your agent.

   :::image type="content" source="media/add-agent-action-create-run-workflow/select-agent.png" alt-text="Screenshot shows Foundry portal, sidebar with selected Agents item, and a selected agent." lightbox="media/add-agent-action-create-run-workflow/select-agent.png":::

1. Next to the agents list, in the **Setup** section, scroll down to the **Actions** section, and select **Add**.

   :::image type="content" source="media/add-agent-action-create-run-workflow/add-action.png" alt-text="Screenshot shows Foundry portal, agent's Setup section, Actions subsection, and selected option for Add action." lightbox="media/add-agent-action-create-run-workflow/add-action.png":::

   > [!NOTE]
   >
   > Not all models support agent actions. If the **Actions** section appears unavailable, you need to deploy a GPT-4.1 model or earlier.

1. In the **Add action** wizard, select **Azure Logic Apps**.

   :::image type="content" source="media/add-agent-action-create-run-workflow/azure-logic-apps.png" alt-text="Screenshot shows the Add action wizard." lightbox="media/add-agent-action-create-run-workflow/azure-logic-apps.png":::

1. Under **Select an action**, select a predefined action with one of the following labels:

   | Action label | Description |
   |--------------|-------------|
   | **Microsoft Authored** | This action uses a Microsoft authored template to create the workflow for the action. |
   | **Workflow** | This action uses an eligible logic app workflow in your Azure subscription as a template to create the workflow for the action. <br><br>**Note**: If you select this option, skip to the section named [Confirm action details](#3-confirm-action-details). If your workflows don't appear as expected in the actions gallery, [check the prerequisites](#prerequisites)#. |

   The following example uses the Microsoft authored action named **Get Weather forecast for today via MSN Weather**:

   :::image type="content" source="media/add-agent-action-create-run-workflow/get-weather-forecast-action.png" alt-text="Screenshot shows the Add Logic App action wizard with the selected action named Get Weather forecast." lightbox="media/add-agent-action-create-run-workflow/get-weather-forecast-action.png":::

1. In the **Add Logic App action** wizard, under the **Enter some basic information**, provide the following information:

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Your action name** | Yes | <*action-name*> | A friendly, but task-focused, verb-first, concise name for the action. This name is also used for the logic app resource and workflow in Azure Logic Apps. <br><br>**Note**: Review the following: <br><br>- The action name can use only letters, numbers, and the following special characters: **-**, **(**, **)**, **_**, or **'**. <br><br>- You can't use whitespace or other special characters. <br><br>- A Consumption logic app resource and workflow are combined and have a 1:1 relationship, so they use the same name. By comparison, a Standard logic app resource can have multiple workflows that use different names. <br><br>This example uses **Get-weather-forecast-today**. |
   | **Your action description** | Yes | <*action-description*> | A description that clearly describes the purpose for the action. <br><br>This example uses **This action creates a callable Consumption logic app workflow that gets the weather forecast for today and runs in global, multitenant Azure Logic Apps.** |
   | **Subscription** | Yes | <*Azure-subscription*> | The Azure subscription to use, presumably the same as your project and model. |
   | **Resource group** | Yes | <*Azure-resource-group*> | The Azure resource group to use. |
   | **Location** | Yes | <*Azure-region*> | The Azure region where to host the logic app resource and workflow. |

   The following screenshot shows the example details for the sample action **Get-weather-forecast-today**:

   :::image type="content" source="media/add-agent-action-create-run-workflow/action-details.png" alt-text="Screenshot shows Add Logic App action wizard with details about the selected action, such as name, description, subscription, resource group, and location." lightbox="media/add-agent-action-create-run-workflow/action-details.png":::

1. When you finish, select **Next**.

## 2: Create and authenticate connections

To create connections that the action needs and to authenticate access to the required services, systems, apps, or data sources, follow these steps. The underlying template specifies the connectors to use for this action and in the corresponding logic app workflow.

1. In the **Add Logic App action** wizard, under **Authenticate**, authenticate any connections that you need to create for the action.

1. In the **Connection** column, select **Connect** for the related service or data source.

   The following screenshot shows the example connection to create and authenticate for the MSN Weather service:

   :::image type="content" source="media/add-agent-action-create-run-workflow/authenticate-connections.png" alt-text="Screenshot shows the Add action wizard with Authenticate section, and Connect link selected for the MSN Weather." lightbox="media/add-agent-action-create-run-workflow/authenticate-connections.png":::

   Some connections require more details, so follow the prompts to provide the requested information.

1. Repeat these steps for each required connection.

1. When you finish, select **Next**.

## 3: Confirm action details

Check that all the action information appears correct. If you selected a Microsoft authored action, review and consent to the acknowledgment statement.

1. In the **Add Logic App action** wizard, under **Resource**, check all the provided action information.

1. For a selected Microsoft authored action, complete the following steps:

   1. Review the statement that you acknowledge and understand the following events after you leave the **Resource** section by selecting **Next**:

      - You can't return to the previous steps.

      - The action creates a Consumption logic app resource.

      - Connecting to Azure Logic Apps incurs charges in your Azure account.

        For more information about the billing model for Consumption logic app workflows, see:

        - [Usage metering, billing, and pricing](/azure/logic-apps/logic-apps-pricing#consumption-multitenant)
        - [Azure Logic Apps pricing (Consumption Plan - Multitenant)](https://azure.microsoft.com/pricing/details/logic-apps/)

   1. To consent, select the confirmation box, for example:

      :::image type="content" source="media/add-agent-action-create-run-workflow/resource-create.png" alt-text="Screenshot shows the Add Logic App action wizard with the Resource section and selected confirmation box to create a logic app resource." lightbox="media/add-agent-action-create-run-workflow/resource-create.png":::

1. When you finish, select **Next**.

## 4: Finish creating the action as a tool

Review the information that the portal generates about the action as a tool. The agent uses this information to run the action (tool) and authenticate access to any relevant Azure, Microsoft, and non-Microsoft services or resources.

1. In the **Add Logic App action** wizard, in the **Schema** section, review the following information, and make sure to provide a description about the scenario for calling the tool:

   | Parameter | Description |
   |-----------|-------------|
   | **Tool name** | The editable name for the tool that the agent uses to run your action and access Azure, Microsoft, external services, data sources, or specialized AI models so that the agent can get data, run tasks, and interact with other platforms. <br><br>**Note**: <br><br>- The tool name can use only letters, numbers, and the underscore (**_**) character. <br><br>- You can't use whitespace or other special characters. |
   | **Connection for authentication** | The read-only name for the connection that the tool uses to access Azure, Microsoft, and external resources without having to ask for credentials every time. For more information, see [Connections in Foundry portal](/azure/ai-foundry/concepts/connections). |
   | **Describe how to invoke the tool** | The description that specifies when the agent calls the tool. |
   | **Schema** | The schema for the logic app workflow in JavaScript Object Notation (JSON) format. |

   :::image type="content" source="media/add-agent-action-create-run-workflow/finish-create-action.png" alt-text="Screenshot shows Add Logic App action wizard with Schema section and the highlighted description about when the agent calls the tool." lightbox="media/add-agent-action-create-run-workflow/finish-create-action.png":::

1. When you finish, select **Create**.

   The wizard returns you to the **Agents** page for your agent. In the **Setup** section, the **Actions** section now shows the tool name and icon for Azure Logic Apps, for example:

   :::image type="content" source="media/add-agent-action-create-run-workflow/add-action-finish.png" alt-text="Screenshot shows the Agents page, selected agent, and Setup section with the Actions subsection and tool name." lightbox="media/add-agent-action-create-run-workflow/add-action-finish.png":::

## 5: Test the agent action

To try the new agent action by using the **Agents playground**, follow these steps:

1. On the **Agents** page, in the **Setup** section, select **Try in playground**.

1. On the **Agents playground** page, in the user query chat box, ask a question about the weather, for example:

   **What is the weather in London? Show the results in bullet list format.**

   The agent returns a response similar to the following example:

   :::image type="content" source="media/add-agent-action-create-run-workflow/test-action.png" alt-text="Screenshot shows Foundry window with Agents playground page, test prompt about London weather with format instructions, and response." lightbox="media/add-agent-action-create-run-workflow/test-action.png":::

## 6: Delete resources

If you don't need the resources that you created for this guide, delete them so you don't continue getting charged. You can either follow these steps to delete the resource group that contains these resources, or you can delete each resource individually.

1. In the Foundry portal, to remove the action from the agent, next to the action name, select the ellipses (**...**) button, and then select **Remove**.

1. In the [Azure portal](https://portal.azure.com) title bar search box, enter **resource groups**, and select **Resource groups**.

1. Find the resource group that contains your deployed hub resources.

1. On the **Overview** page toolbar, select **Delete resource group**.

1. When the confirmation pane appears, enter the resource group name, and select **Delete**.

:::zone-end

:::zone pivot="python"

## 1: Set the environment variables

On your system, set the following environment variables:

| Environment variable | Description |
|----------------------|-------------|
| `PROJECT_ENDPOINT` | The endpoint for your Microsoft Foundry project. To find this value, in the Foundry portal, on the project sidebar, select **Overview**. Find the property named **Microsoft Foundry project endpoint**. |
| `MODEL_DEPLOYMENT_NAME` | The deployment name for the AI model.  To find this value, in the Foundry portal, on the project sidebar menu, in the **My assets** section, select **Models + endpoints**, and look in the **Name** column. |
| `SUBSCRIPTION_ID` | The ID for your Azure subscription. |
| `resource_group_name` | The name for your resource group. |

For sample code, see:

- [AzureLogicAppTool utility on GitHub](https://github.com/azure-ai-foundry/foundry-samples/blob/main/samples-classic/python/getting-started-agents/logic_apps/user_logic_apps.py)

- [Full sample for Azure Logic Apps integration with Foundry agent](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/ai/azure-ai-agents/samples/agents_tools/sample_agents_logic_apps.py)

  This sample shows how to integrate an agent in Foundry (classic) with a Consumption logic app in the Azure portal.

## 2: Create a project client

To connect to your Foundry project and other resources, follow these steps to create a client object:

```python
import os
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

# Initialize the AIProjectClient
project_client = AIProjectClient(
   endpoint=os.environ["PROJECT_ENDPOINT"],
   credential=DefaultAzureCredential()
)
```

## 3: Register your logic app

Register your Consumption logic app resource by providing the trigger name and information. To find the `AzureLogicAppTool` utility code, visit the [full sample on GitHub](https://github.com/azure-ai-foundry/foundry-samples/blob/main/samples-classic/python/getting-started-agents/logic_apps/user_logic_apps.py).

```python
from user_logic_apps import AzureLogicAppTool

# Logic app details
LOGIC_APP_NAME = "your_logic_app_name"
TRIGGER_NAME = "your_trigger_name"

# Register the logic app name with the agent tool utility by extracting the following values from environment variables
subscription_id = os.environ["SUBSCRIPTION_ID"]
resource_group = os.environ["resource_group_name"]

# Create and initialize AzureLogicAppTool utility
logic_app_tool = AzureLogicAppTool(subscription_id, resource_group)
logic_app_tool.register_logic_app(LOGIC_APP_NAME, TRIGGER_NAME)
print(f"Registered logic app '{LOGIC_APP_NAME}' with trigger '{TRIGGER_NAME}'.")
```

## 4: Create an agent with a workflow as an action (tool)

The following code creates an agent and attaches the logic app as an agent action or tool. In this example, the logic app workflow sends an email.

```python
from azure.ai.agents.models import ToolSet, FunctionTool
from user_functions import fetch_current_datetime
from user_logic_apps import create_send_email_function

# Create the logic app action for the agent
send_email_func = create_send_email_function(
    logic_app_tool, logic_app_name
)

# Prepare the action tool for the agent
functions_to_use = {fetch_current_datetime, send_email_func}

# Create an agent and assign the toolset
functions = FunctionTool(functions=functions_to_use)
toolset = ToolSet()
toolset.add(functions)

agent = project_client.agents.create_agent(
    model=os.environ["MODEL_DEPLOYMENT_NAME"],
    name="SendEmailAgent",
    instructions="You're a specialized agent for sending emails.",
    toolset=toolset,
)
print(f"Created agent, ID: {agent.id}")
```

## 5: Create a thread for communication

The following code creates a thread and adds a user message to start the conversation between the project client and your agent.

```python
# Create a thread for communication
thread = project_client.agents.threads.create()
print(f"Created thread, ID: {thread.id}")

# Create a message in the thread
message = project_client.agents.messages.create(
    thread_id=thread.id,
    role="user",
    content="Hello, send an email to <RECIPIENT_EMAIL> with the date and time in '%Y-%m-%d %H:%M:%S' format.",
)
print(f"Created message, ID: {message['id']}")
```

## 6: Test your agent and the action

To test how well the agent performs the task, run the agent, observe how the model uses the logic app tool, and check the output.

```python
# Create and run the agent on the thread
run = project_client.agents.runs.create_and_process(
    thread_id=thread.id, agent_id=agent.id
)
print(f"Run finished with status: {run.status}")

if run.status == "failed":
    print(f"Run failed: {run.last_error}")

# Fetch, log, and display all messages
messages = project_client.agents.messages.list(thread_id=thread.id)
for message in messages:
    if msg.txt = msg.text_messages[-1]
    print(f"Role: {msg.role}: {last_text.text.value}")
```

## 7: Clean up resources

Delete the agent when you finish to clean up resources so you don't continue getting charged.

```python
# Delete the agent
project_client.agents.delete_agent(agent.id)
print("Deleted agent.")
```

:::zone-end

## Optional: Review underlying logic app and workflow

After the action runs, you can view the underlying logic app resource and workflow in the Azure portal. You can review the workflow's run history to debug or troubleshoot problems that the workflow might encounter.

1. In the [Azure portal](https://portal.azure.com) title bar search box, enter the name for the action you created.

1. From the results list, under **Resources**, select the logic app resource.

   :::image type="content" source="media/add-agent-action-create-run-workflow/find-logic-app-azure-portal.png" alt-text="Screenshot shows the Azure portal, title bar search box with action name, and selected logic app name." lightbox="media/add-agent-action-create-run-workflow/find-logic-app-azure-portal.png":::

1. To view the workflow's run history, inputs, outputs, and other information, on the logic app sidebar, under **Development Tools**, select **Run history**.

1. In the **Run history** list, select the latest workflow run, for example:

   :::image type="content" source="media/add-agent-action-create-run-workflow/select-workflow-run.png" alt-text="Screenshot shows Azure portal, Run history page, and selected most recent workflow run." lightbox="media/add-agent-action-create-run-workflow/select-workflow-run.png":::

1. After the monitoring view opens and shows the status for each operation in the workflow, select an operation to open the information pane and review the operation's inputs and outputs.

   This example selects the action named **Get forecast for today**, for example:

   :::image type="content" source="media/add-agent-action-create-run-workflow/view-inputs-outputs.png" alt-text="Screenshot shows Azure portal, monitoring view for workflow run, selected operation, and information pane with operation inputs and outputs." lightbox="media/add-agent-action-create-run-workflow/view-inputs-outputs.png":::

   For more information, see [View workflow status and run history](/azure/logic-apps/view-workflow-status-run-history?tabs=consumption).

## Optional: Open workflow in the designer

To review the workflow definition and operations or to edit the workflow, open the designer.

1. On the logic app sidebar, under **Development Tools**, select the designer. If you're still in monitoring view, on the monitoring view toolbar, select **Edit**.

   You can now review the workflow's operations, which include the trigger and actions, for example:

   :::image type="content" source="media/add-agent-action-create-run-workflow/open-workflow-designer.png" alt-text="Screenshot shows the Azure portal, workflow designer, and workflow definition created by the agent action." lightbox="media/add-agent-action-create-run-workflow/open-workflow-designer.png":::

1. To view an operation's parameters and settings, on the designer, select the operation, for example:

   :::image type="content" source="media/add-agent-action-create-run-workflow/view-parameters.png" alt-text="Screenshot shows Azure portal, workflow designer, selected operation, and information pane with operation parameters and other settings." lightbox="media/add-agent-action-create-run-workflow/view-parameters.png":::

1. To expand the workflow's behavior, add more actions.

   For any workflow to appear through the agent's **Add a Logic app action** gallery in Foundry and to run as an agent tool, make sure any changes you make to the workflow still meet [specific requirements](#prerequisites).

   > [!CAUTION]
   >
   > Although you can edit the workflow, don't remove or change the **Request** trigger and existing actions in the workflow. Otherwise, you risk breaking the relationship between the agent and the corresponding action in Foundry and the workflow in the Azure portal. These items have set up parameters that work together, so changes to these operations risk breaking the action in the agent.
   >
   > Instead, consider creating a custom version or a different workflow that you can add as an action to an agent. For example, the trigger uses the following parameters, which are necessary to call the trigger:
   >
   > | Parameter | Description |
   > |-----------|-------------|
   > | **Name** | This name is part of the trigger's HTTPS URL. External callers, such as other services, outside the workflow send an HTTPS request to this URL, which fires the trigger and starts the workflow. The trigger is always the first step in a workflow and specifies the condition to meet for the trigger to run. |
   > | **HTTPS URL** | When you save the workflow for the first time, this URL is generated and used for calling an endpoint that the trigger creates for the workflow. |
   > | **Method** | This setting specifies whether the trigger accepts all or only specific HTTPS methods. |
   > | **Request Body JSON Schema** | If you want to validate the input that the trigger expects to receive in the HTTPS request, include a JSON schema that specifies and validates the input that external callers include in their request. |

   For more information, see [Build a workflow with a trigger or action](add-trigger-action-workflow.md?tabs=consumption#add-action).

1. To save any changes, on the designer toolbar, select **Save**.

## Optional: Test an updated workflow in the designer

If you make changes to the weather workflow or want to test a different workflow, follow these steps:

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

1. When you finish, select **Run**.

   On the **Output** tab, the **Response Body** contains the results and response from the workflow.

1. If your workflow run produces errors or requires troubleshooting, open the workflow's run history. Examine each operation's inputs and outputs by using the relevant steps in [View workflow run history](view-workflow-status-run-history.md).

## Billing and pricing

You incur charges for Consumption logic app workflows based on the pay-for-use billing model.

For Azure Logic Apps, see:

- [Usage metering, billing, and pricing](/azure/logic-apps/logic-apps-pricing#consumption-multitenant)
- [Azure Logic Apps pricing (Consumption Plan - Multitenant)](https://azure.microsoft.com/pricing/details/logic-apps/)

For Foundry, see the following resources:

- [Plan and manage costs for Microsoft Foundry (classic)](/azure/foundry-classic/concepts/manage-costs)
- [Microsoft Foundry pricing](https://azure.microsoft.com/pricing/details/microsoft-foundry/)

## FAQ

### How does authentication work for calls from Foundry to Azure Logic Apps?

Azure Logic Apps supports the following types of authentication for inbound calls from Foundry to the **Request** trigger in a logic app workflow:

- Shared Access Signature (SAS) based authentication

  When an agent calls an action that runs a logic app workflow, Foundry sends a request to the *callback URL* in the workflow's **Request** trigger. You can get this callback URL, which includes an SAS, by using [Workflows - List callback Url](/rest/api/logic/workflows/list-callback-url) from the REST API for Azure Logic Apps.

  For SAS authentication, Azure Logic Apps also supports the following tasks:

  - Create SAS URLs with a specified validity period.
  - Use multiple keys and rotate them as needed.

  For more information, see [Generate a Shared Access Signature (SAS) key or token](/azure/logic-apps/logic-apps-securing-a-logic-app#generate-shared-access-signatures-sas).

- Microsoft Entra ID-based OAuth authentication policy

  Azure Logic Apps supports authentication for calls to request triggers by using OAuth with Microsoft Entra ID. You can specify authentication policies to use when validating OAuth tokens. For more information, see [Enable OAuth 2.0 with Microsoft Entra ID in Azure Logic Apps](/azure/logic-apps/logic-apps-securing-a-logic-app?tabs=azure-portal#enable-oauth-20-with-microsoft-entra-id).

For more information about securing inbound calls in Azure Logic Apps, see [Access for inbound calls to request-based triggers](/azure/logic-apps/logic-apps-securing-a-logic-app?tabs=azure-portal#access-for-inbound-calls-to-request-based-triggers).

## Related content

- [Full sample for Azure Logic Apps integration with Foundry agent](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/ai/azure-ai-agents/samples/agents_tools/sample_agents_logic_apps.py)
- [Learn more about Microsoft Foundry](/azure/foundry/what-is-foundry)
- [Learn more about Azure Logic Apps](/azure/logic-apps/logic-apps-overview)
