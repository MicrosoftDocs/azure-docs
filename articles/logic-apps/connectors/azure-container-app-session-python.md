---
title: Process Files in Agent Workflows with Python Code
description: Learn how to process files by running Python code from AI agent workflows Azure Logic Apps.
services: logic-apps
ms.suite: integration
author: ecfan
ms.reviewer: estfan, azla
ms.topic: how-to
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
ms.date: 08/01/2025
---

# Process files by running Python code from AI agent workflows in Azure Logic Apps (Preview)

[!INCLUDE [logic-apps-sku-standard](../../../includes/logic-apps-sku-standard.md)]

> [!NOTE]
> This capability is in preview and is subject to the
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In Standard logic apps, not only can agent workflows handle natural language requests through chat interfaces, they can also process files when you create tools with **Code Interpreter (Python Container Apps session)** built-in connector operations. The agent workflow can then run Python code, upload, download, and delete files. From an end-to-end perspective, the agent workflow receives instructions, accepts files, runs code in an isolated environment, and returns usable results, such as summaries, forecasts, or other requested data transformations - all within the same workflow.

> [!NOTE]
>
> You can also use the **Code Interpreter (Python Container Apps session)** operations in non-agent 
> workflows in a Standard logic app. However, these workflows don't include the same capabilities 
> for working with agents and natural language interactions that agent workflows support.

Your agent workflow can process files that contain diverse or fragmented data and have formats such as CSV, Excel, or JSON, which can include thousands to millions of rows. However, raw data often needs extra work before you can extract useful information and insights, for example:

- Cleaning and transformation
- Custom logic to extract insights
- Visualizations or summaries that make the data actionable

These tasks often require manually performed steps that are error-prone and time consuming, especially for people who don't have data science or engineering expertise. Your workflow uses the **Code Interpreter (Python Container Apps session)** operations to automate these tasks and bring code interpreter capabilities natively and directly to the Azure Logic Apps runtime. The operation that executes Python code is powered by Azure Container Apps (ACA) session pool. Dynamic sessions in Azure Container Apps provide fast and scalable access to a code interpreter. Each code interpreter session is fully isolated by a Hyper-V boundary and is designed to run untrusted code. When you enable network isolation on your app container, your data never leaves the defined network boundaries.

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
    > To upload files, you need the **Azure Container Apps Session Executor** role on the session pool.

    To upload the file through Azure portal, follow these steps:

    1. In the [Azure portal](https://portal.azure.com), open your code interpreter session pool resource.

    1. On the resource sidebar, select **Playground**.

    1. On the **Playground** toolbar, select **Manage files**.

    1. On the **Manage Files** pane, select **Upload File**.

- A Standard logic app resource and an agent workflow.

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

1. On the designer, follow the [general steps to add the **Code Interpreter (Python Container Apps session)** action named **Upload file**](../add-trigger-action-workflow.md?tabs=standard#add-action) to your workflow.

1. If you're prompted to create a connection, on the **Create connection** pane, provide the [connection information](#connection-information) for the session pool.

1. In the action information pane, expand **Input files to upload**, and provide the following values:

   | Parameter | Value | Description |
   |-----------|-------|-------------|
   | **Input file name** | <*file-name*> | The name for the file to upload. |
   | **Input file content** | <*file-content*> | The path to the file to upload. |

   If you have more files to upload, select **Add new item**.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

## Run Python code

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the resource sidebar, under **Workflows**, select **Workflows**, and then select your agent workflow.

1. On the workflow sidebar, under **Tools**, select the designer to open the workflow.

1. On the designer, follow the [general steps to add the **Code Interpreter (Python Container Apps session)** action named **Execute Python code**](../add-trigger-action-workflow.md?tabs=standard#add-action) to your workflow.

1. If you're prompted to create a connection, on the **Create connection** pane, provide the [connection information](#connection-information) for the session pool.

1. To provide your own Python code, in the **Python code** box, enter your code.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

## Connection information

The following table describes the information required to connect to your session in Azure Container Apps:

| Parameter| Required | Value | Description |
|----------|----------|-------|-------------|
| **Connection Name** | Yes | <*connection-name*> | A name to identify the connection. |
| **Connection Type** | Yes | **Managed identity** | The authentication to use for the connection. <br><br>For **Managed identity**, you must set up the managed identity for your Standard logic app to access the resources you want. On the session pool resource, the managed identity requires the role named **Azure Container Apps Session Executor**. For more information, see [Authenticate access and connections to Azure resources with managed identities in Azure Logic Apps](../authenticate-with-managed-identity.md?tabs=standard). |
| **Subscription** | Yes | <*Azure-subscription*> | The Azure subscription to use. |
| **Session Pool** | Yes | <*session-pool*> | The session pool in Azure Container Apps, for example, **`fabrikam-session-pool (/fabrikam-session-pool)`**. |

## Related content

- [AI agent workflows in Azure Logic Apps](../agent-workflows-concepts.md)
