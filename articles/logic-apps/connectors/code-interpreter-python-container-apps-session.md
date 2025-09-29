---
title: Run Python Code in Agent Workflows
description: Learn to run Python code to process files in AI agent workflows with Azure Logic Apps.
services: logic-apps
ms.suite: integration
author: ecfan
ms.reviewers: estfan, azla
ms.topic: how-to
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
ms.date: 09/28/2025
#Customer intent: As an AI developer, I want to create a workflow that accepts and processes files using an agent that uploads a file and generates Python code that processes the file.
---

# Run Python code that processes files in agent workflows with Azure Logic Apps (Preview)

[!INCLUDE [logic-apps-sku-standard](../../../includes/logic-apps-sku-standard.md)]

> [!NOTE]
> This capability is in preview and is subject to the
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In Standard logic apps, not only can agent workflows handle natural language requests through chat interfaces by using agents, they can also process files when you create agent tools with the **Code Interpreter (Python Container Apps session)** built-in connector operations. These operations make it possible for the agent workflow to generate and run Python code, upload, download, and delete files. From a scenario perspective, the agent can receive instructions, accept files, generate and run code in an isolated environment, and return usable results, such as summaries, forecasts, or other requested data transformations - all within the same workflow.

> [!NOTE]
>
> This article assumes that you're working with an agent workflow and use the **Code Interpreter** 
> operations inside agent tools so that you can have the agent generate the necessary Python code.

The following example shows a workflow with an agent action named **Sales Report Agent**. The agent can use a tool named **Upload sales data** to run the **Code Interpreter** operations named **Upload file** and **Execute Python code**.

:::image type="content" source="media/code-interpreter-python-container-apps-session/overview.png" alt-text="Screenshot shows workflow with agent and tool, which uses Code Interpreter actions that upload files to Container Apps session pool and runs Python code for file processing." lightbox="media/code-interpreter-python-container-apps-session/overview.png":::

 When the workflow receives an HTTPS request for a specified file through the **Request** trigger, the **HTTP** action gets the requested file. The agent has instructions to upload the file to a Container Apps session pool, generate Python code to process the file, and return results based on the received instructions:

> [!NOTE]
>
> You can use the **Code Interpreter (Python Container Apps session)** operations outside an agent 
> action or in non-agent workflows in a Standard logic app. However, you must provide your own Python 
> code for the **Execute Python code** action. In these cases, the **Code Interpreter** operations 
> don't have access to agent capabilities provided by the agent-linked AI model, which include 
> natural language interactions and model-generated code.

Your agent workflow can process files that contain diverse or fragmented data and have formats such as CSV, Excel, or JSON, which can include thousands to millions of rows. However, raw data often needs extra work before you can extract useful information and insights, for example:

- Cleaning and transformation
- Custom logic to extract insights
- Visualizations or summaries that make the data actionable

These tasks often require manually performed steps that are error-prone and time consuming, especially for people who don't have data science or engineering expertise. Your workflow can use the **Code Interpreter (Python Container Apps session)** operations to automate these tasks and bring code interpreter capabilities natively and directly to the Azure Logic Apps runtime. The operation that executes Python code is powered by Azure Container Apps session pool. Dynamic sessions in Azure Container Apps provide fast and scalable access to a code interpreter. Each code interpreter session is fully isolated by a Hyper-V boundary and is designed to run untrusted code. When you enable network isolation on your app container, your data never leaves the defined network boundaries.

These capabilities make scenarios like the following examples possible:

| Scenario | Use case |
|----------|----------|
| Data exploration | Business users can ask questions about the data using natural language and without writing a single line of code or manually manipulating spreadsheets and use natural language, for example: <br><br>- "Find the top 5 products by revenue." <br>- "Forecast demand for the next quarter by region." <br>- "Highlight customer segments based on purchase patterns." |
| Operations | Clean large log files, surface exceptions, and generate insights to improve reliability. |
| Finance | Analyze expense reports, detect anomalies, or generate quarterly breakdowns from Excel exports. |
| Sales and marketing | Upload raw sales data and get on-demand summaries, forecasts, or regional comparisons. |

This article shows how to set up and use various **Code Interpreter (Python Container Apps session)** operations in your agent workflow.

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A container app and a code interpreter session pool in Azure Container Apps.

  - To create the app, see [Quickstart: Deploy your first container app using the Azure portal](../../container-apps/quickstart-portal.md). To make sure that your data never leaves your network, turn on network isolation on your container app.
  
    For more information, see the following articles:

    - [Azure Container Apps environments](../../container-apps/environment.md)
    - [Networking in Azure Container Apps environment](../../container-apps/networking.md)

  - To create the session pool, see [Create session pools in Azure Container Apps](../../container-apps/session-pool.md). You can use either the Azure portal or Azure CLI.

    > [!IMPORTANT]
    >
    > For the session pool type, make sure that you select **Python code interpreter**. 

  - Optional: You can upload the file to the session by using the Azure portal or sending an HTTPS request. You can then reference the file as a data source in Python code. For more information, see [Upload a file - Serverless code interpreter sessions in Azure Container Apps](../../container-apps/sessions-code-interpreter.md#upload-a-file). Otherwise, you can use the **Upload file** action from the **Code Interpreter (Python Container Apps session)** connector.

    > [!NOTE]
    >
    > To manage files or run code in the session pool, make sure that you have the Azure 
    > built-in role named **Azure ContainerApps Session Executor** on the session pool. 
    > For this task, see [Give identity access to resources](../authenticate-with-managed-identity.md?tabs=standard#give-identity-access-to-resources).

    To upload the file through Azure portal, follow these steps:

    1. In the [Azure portal](https://portal.azure.com), open your code interpreter session pool resource.

    1. On the resource sidebar, select **Playground**.

    1. On the **Playground** toolbar, select **Manage files**.

       The following example shows the **Manage files** command on the **Playground** toolbar:

       :::image type="content" source="media/code-interpreter-python-container-apps-session/manage-files-session-pool.png" alt-text="Screenshot shows a Container Apps session pool resource, sidebar menu with Playground selected, and Playground toolbar with the Manage files command selected." lightbox="media/code-interpreter-python-container-apps-session/manage-files-session-pool.png":::

    1. On the **Manage Files** pane, select **Upload File**, and provide the file to upload.

- A Standard logic app resource and an agent workflow. Make sure that you set up a connection between the **Default Agent** action and an AI model to use for code generation.

  To create this workflow, see [Create workflows that use AI agents and models to complete tasks in Azure Logic Apps](../create-agent-workflows.md).

  > [!NOTE]
  >
  > Agent workflows must start with the **Request** trigger. The **Code Interpreter (Python Container Apps session)** 
  > connector provides actions, but not triggers.

## Connector technical reference

For technical information about this connector's operations, see the [connector's reference documentation](/azure/logic-apps/connectors/built-in/reference/acasession/).

## Upload a file

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the resource sidebar, under **Workflows**, select **Workflows**, and then select your agent workflow.

1. On the workflow sidebar, under **Tools**, select the designer to open the workflow.

1. In the **Default Agent** action, follow the [general steps to create a tool and add the **Code Interpreter (Python Container Apps session)** action named **Upload file**](../create-agent-workflows.md#create-a-tool-to-get-weather-forecast).

1. If you're prompted to create a connection, on the **Create connection** pane, provide the [connection information](#connection-information) for the session pool.

1. In the action information pane, expand **Input files to upload**, and provide the following values:

   | Parameter | Value | Description |
   |-----------|-------|-------------|
   | **Input file name** | <*file-name*> | The name to assign for the file. |
   | **Input file content** | <*file-content*> | The path for the file content to upload. |

   In the following example, the workflow uses an **HTTP** action, which makes a REST call to get the file from its source location. The agent action has a tool that uses the **Upload file** action with the file name and content as parameters. The file name is manual input, while the file content references output from the preceding **HTTP** action:

   :::image type="content" source="media/code-interpreter-python-container-apps-session/upload-file-parameters.png" alt-text="Screenshot shows agent workflow with HTTP action that gets a file and Upload file action that adds file to session pool." lightbox="media/code-interpreter-python-container-apps-session/upload-file-parameters.png":::

1. If you have more files to upload, select **Add new item**.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

## Run Python code

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the resource sidebar, under **Workflows**, select **Workflows**, and then select your agent workflow.

1. On the workflow sidebar, under **Tools**, select the designer to open the workflow.

1. For the **Default Agent** action, rename the agent for your scenario, and follow these steps:

   1. Based on whether you created a tool with the **Upload file** action from the preceding section, choose either option:

      - If a tool with the **Upload file** action exists, directly under that action, follow the [general steps to add the **Code Interpreter (Python Container Apps session)** action named **Execute Python code**](../add-trigger-action-workflow.md?tabs=standard#add-action) to the tool.

      - If your workflow uploads the file in another way, follow the [general steps to create a tool by using the **Code Interpreter (Python Container Apps session)** action named **Execute Python code**](../create-agent-workflows.md#create-a-tool-to-get-weather-forecast).

   1. If you're prompted to create a connection, on the **Create connection** pane, provide the [connection information](#connection-information) for the session pool.

   1. On the new tool, follow the [general steps to create an agent parameter for model-generated outputs](../create-agent-workflows.md#create-agent-parameters-for-the-get-forecast-action).

      This agent parameter passes the Python code generated from the agent-linked AI model at runtime to the **Execute Python code** action.

      After you're done, the **Execute Python code** action now shows the following code reference in the **Python code** box: `@{agentParameters('python_code')}`

      :::image type="content" source="media/code-interpreter-python-container-apps-session/python-code-reference.png" alt-text="Screenshot shows agent workflow and code reference inside action for Execute Python Code." lightbox="media/code-interpreter-python-container-apps-session/python-code-reference.png":::

   1. For the **Execute Python code** action to use the file from the **Upload file** action, set the **Session ID** parameter value to the session ID for the **Upload file** action by following these steps:

      1. In the **Execute Python code** action, from the **Advanced parameters** list, select **Session ID** to add this parameter to the action.

      1. Select inside the **Session ID** parameter, which shows input options, and select the dynamic content option (lightning icon).

      1. From the dynamic content list, under **Upload file**, select **Session ID**.

      The following example shows the **Session ID** parameter set to the session ID for the **Upload file** action:

      :::image type="content" source="media/code-interpreter-python-container-apps-session/session-id.png" alt-text="Screenshot shows advanced parameters and session ID parameter for Execute Python Code action." lightbox="media/code-interpreter-python-container-apps-session/session-id.png":::

   1. Rename the tool to describe its purpose or task.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

## Connection information

The following table describes the information required to connect to your session in Azure Container Apps:

| Parameter| Required | Value | Description |
|----------|----------|-------|-------------|
| **Connection Name** | Yes | <*connection-name*> | A name to identify the connection. |
| **Connection Type** | Yes | **Managed identity** | The authentication to use for the connection. <br><br>**Note**: To use **Managed identity** authentication, you must set up the managed identity on your Standard logic app with access to the resources you want. On the session pool resource, make sure to set up the managed identity with the role named **Azure ContainerApps Session Executor**. For more information, see [Authenticate access and connections to Azure resources with managed identities in Azure Logic Apps](../authenticate-with-managed-identity.md?tabs=standard). |
| **Subscription** | Yes | <*Azure-subscription*> | The Azure subscription to use. |
| **Session Pool** | Yes | <*session-pool*> | The session pool in Azure Container Apps, for example, **`fabrikam-session-pool (/fabrikam-session-pool)`**. |

## Related content

- [AI agent workflows in Azure Logic Apps](../agent-workflows-concepts.md)
