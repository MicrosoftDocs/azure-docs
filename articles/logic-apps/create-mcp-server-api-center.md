---
title: Create MCP servers to automate tasks
description: Learn how to create a Model Context Protocol (MCP) server driven by Azure Logic Apps for AI agents and models to automate tasks. Build tools powered by connector actions for large language models (LLMs) and agents to perform these tasks.
services: logic-apps, azure-api-center
ms.suite: integration
ms.reviewers: estfan, azla
ms.topic: how-to
ms.collection: ce-skilling-ai-copilot
ms.date: 09/05/2025
ms.update-cycle: 180-days
#Customer intent: I want to create an MCP server that provides tools that I build from connector actions in Azure Logic Apps. AI agents and models can then use these tools to run automated tasks.
---

# Build MCP servers in API Center that automate tasks with tools backed by Azure Logic Apps (Preview)

> [!NOTE]
>
> The following capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To make a large language model (LLM) fulfill requests by running actions that work with external services, systems, apps, or data, you can create a *Model Context Protocol (MCP)* server that provides *tools* for your agent or model to automate tasks. For example, these tools can read, update, or delete files, query databases, send emails, interact with APIs, perform computations, or even trigger workflows.

In Azure API Center, you can create an MCP server with tools that are backed by the prebuilt connector actions available in Azure Logic Apps. Usually, you use these connector actions and triggers in Azure Logic Apps to create workflows for automation and integration solutions. With access to [over 1,400 connectors](/connectors/connector-reference/connector-reference-logicapps-connectors) that interact and integrate a vast range of cloud services, on-premises systems, apps, and data, you can build diverse toolsets that specifically work with your enterprise resources and assets.

This guide shows how to create an MCP server powered by a Standard logic app and build tools that the server makes available for agents and models.

## Learn about MCP and API Center

The following diagram shows the relationship between the MCP server and tools that you create in API Center and the connector actions in Azure Logic Apps that you use to build the tools that your MCP server provides:

:::image type="content" source="media/create-mcp-server-api-center/mcp-server-api-center-portal-arch.png" alt-text="Diagram shows relationship between MCP server and tools in Azure API Center portal, agent, and MCP client.":::

MCP is an open standard that lets AI components such as LLMs, agents, and MCP clients use tools to work with external services and systems in a secure, discoverable, and structured way. This standard defines how to describe, run, and authenticate access to tools so that AI components can interact with real-world services, systems, databases, APIs, and business workflows. An MCP server acts like a bridge between AI components and the tools that they can use.

API Center provides centralized API discovery and design-time API governance so you can track all your APIs in a consolidated location. You can develop and maintain an organized structured inventory for your organization's APIs with information such as version details, API definition files, and common metadata, regardless of API type, lifecycle stage, or deployment location. Stakeholders across your organization, such as API program managers, IT administrators, app developers, and API developers, can design, discover, reuse, and govern these APIs.

For more information, see the following articles:

- [MCP server concepts](https://modelcontextprotocol.io/docs/learn/server-concepts)
- [What is Azure API Center?](../api-center/overview.md)
- [What is Azure Logic Apps?](logic-apps-overview.md)
- [What are connectors in Azure Logic Apps](../connectors/introduction.md)

## Prerequisites

| Prerequisite | Description or notes |
|--------------|----------------------|
| Azure account with an active subscription | If you don't have a subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). <br><br>**Important**: Make sure to use the same Azure subscription for the resources required in this scenario. |
| An API center resource | For more information, see [Quickstart: Create your API center - portal](../api-center/set-up-api-center.md). |
| Access to the API Center portal | To find and view the MCP server that you create, you must set up the API Center portal so you have access. <br><br>This portal is an Azure-managed website that developers and other stakeholders in your organization use to discover the APIs in your API center. After you sign in, you can browse and filter APIs and view API details such as API definitions and documentation. User access to API information is based on Microsoft Entra ID and Azure role-based access control. <br><br>For more information, see the following articles: <br><br>- [Set up your API Center portal](../api-center/set-up-api-center-portal.md) <br>- [Access the API Center portal](../api-center/set-up-api-center-portal.md#access-the-portal) |
| Empty Standard logic app resource | For creating your MCP server, this logic app doesn't contain any workflows. <br><br>- The MCP capability applies to Standard logic app resources that use any hosting option, such as the Workflow Service Plan. <br><br>- Your logic app resource and API center resource must use the same subscription. <br><br>- Your logic app resource must be running. <br><br>For more information, see [Create an example Standard logic app using the Azure portal](create-single-tenant-workflows-azure-portal.md). |
| MCP client to test access to your MCP server | This guide uses [Visual Studio Code installed with the Azure Logic Apps (Standard) extension](create-standard-workflows-visual-studio-code.md#prerequisites). <br><br>**Important**: Make sure to use the latest version of Visual Studio Code for MCP server testing. Visual Studio Code includes generally available MCP support in versions after 1.102. For more information, see [MCP servers in Visual Studio Code](https://code.visualstudio.com/docs/copilot/chat/mcp-servers). <br><br>For the example in this guide, you also need the [GitHub Copilot extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot). For more information, see the following articles: <br><br>- [Use extensions in Visual Studio Code](https://code.visualstudio.com/docs/getstarted/extensions) <br>- [Set up Copilot in Visual Studio Code](https://code.visualstudio.com/docs/copilot/setup#_set-up-copilot-in-vs-code) <br>- [Get started with GitHub Copilot in Visual Studio Code](https://code.visualstudio.com/docs/copilot/getting-started) |
| Access to the service, system, app, or data source from which to create your MCP server | You need any required credentials for the resource that you use to create the MCP server and tools. <br><br>The example in this guide uses the **Office 365 Outlook** connector. If you don't have a work or school account, you can use the **Outlook.com** connector or another supported email connector. The general steps are the same, but your UX might slightly differ. |

## Limitations and known issues

For this release, the following list describes restrictions or issues that apply:

- You must currently start with an empty Standard logic app resource to create your MCP server resource.

- You can select only connector for your MCP server.

- Each tool can have only one action.

## Create an MCP server resource and tools

For example, suppose you want to create an MCP server with tools that manage contacts and sends emails.

1. In the [Azure portal](https://portal.azure.com), open your API center resource.

1. On the resource sidebar, under **Discovery**, select **MCP**.

1. On the **MCP** page, find the **Azure Logic Apps** tile, and select **Register**.

   :::image type="content" source="media/create-mcp-server-api-center/register-mcp-server.png" alt-text="Screenshot shows Azure portal, selected API Center, and selected Register button on Azure Logic Apps tile." lightbox="media/create-mcp-server-api-center/register-mcp-server.png":::

1. On the **Model Context Protocol servers** page, follow these steps:

   1. Under **Resources**, from the **Logic app** list, select your empty Standard logic app resource.

      :::image type="content" source="media/create-mcp-server-api-center/select-empty-logic-app.png" alt-text="Screenshot shows Model Context Protocol servers page with selected empty Standard logic app." lightbox="media/create-mcp-server-api-center/select-empty-logic-app.png":::

   1. Under **Tools**, in the **Connectors** section, select **Add connector** or **Add**.

      :::image type="content" source="media/create-mcp-server-api-center/add-connector.png" alt-text="Screenshot shows Model Context Protocol servers page with selected empty Standard logic app." lightbox="media/create-mcp-server-api-center/add-connector.png":::

   1. On the **Add connector** pane and the **Choose connector** tab, find and select the connector for which you want to create a tool, for example:

      :::image type="content" source="media/create-mcp-server-api-center/choose-connector.png" alt-text="Screenshot shows Add connector pane with selected Office 365 Outlook connector." lightbox="media/create-mcp-server-api-center/choose-connector.png":::

   1. On the **Select actions** tab, select each action that you want to create as a tool. When you're done, select **Next**.

      You can select multiple actions, but you can create only one tool for each selected action.

      :::image type="content" source="media/create-mcp-server-api-center/select-actions.png" alt-text="Screenshot shows Add connector pane with selected Office 365 Outlook connector." lightbox="media/create-mcp-server-api-center/select-actions.png":::

   1. On the **Create connection** tab, provide any connection information or sign in and authenticate your credentials, if required.

      If you must create a different connection, select **Add new**.

   1. When you're done, select **Save**, which returns you to the **Model Context Protocol servers** page.

      The **Connectors** section now shows your selected connector. The **Actions** section shows the selected actions that power the tools that your MCP server now provides. By default, any parameters for these actions use an LLM as the input source. You can change this input source to user-provided, based on your scenario's needs.

  1. To help an agent or LLM choose the correct tool and pass correctly-sourced inputs to tool parameters, review and update each tool's setup by following these steps:

     1. In the **Actions** section, select either the tool name or the edit (pencil) button for that tool.

     1. On the **Edit: <*tool-name*>** pane, provide the following information:

        | Section | Description |
        |---------|-------------|
        | **Description** | Describes the purpose for the action-backed tool to help an agent or LLM determine when to use the tool. A default description exists, but you can customize the text for your needs. <br><br>The default text comes from the [connector's API Swagger description](/connectors/connector-reference/connector-reference-logicapps-connectors), for example, [Actions - Office 365 Outlook](https://learn.microsoft.com/connectors/office365/). |
        | **Default parameters** | Lists any parameters required to run the tool. For each parameter, the input source options are **Model** and **User**. By default, the model (LLM) provides the inputs. If you select **User**, the appropriate UX appears for you to provide the input source. |
        | **Optional parameters** | Select any other parameters that you want to include for the tool. |

        The following example shows the description and parameters for the **Send email (V2)** tool:

        :::image type="content" source="media/create-mcp-server-api-center/tool-parameters.png" alt-text="Screenshot shows Edit pane for an example tool." lightbox="media/create-mcp-server-api-center/tool-parameters.png":::

     1. When you're done, select **Save changes**.

1. When you're done reviewing or updating each tool, select **Register**.

1. Wait for the notifications that Azure successfully registered your MCP server.

   By default, your MCP server uses the name for the connector that you selected.

## Find and view your MCP server

For this task, make sure you completed the requirement to set the API Center portal.

1. On your API Center resource sidebar, under **API Center portal**, select **Settings**.

1. On the **Settings** toolbar, select **View API Center portal**.

   Your browser opens the API portal for your API Center resource at the following URL:

   **https://\<*API-Center-resource-name*\>.\<*region*\>.azure-apicenter.ms**.

   For more information, see [Access the API Center portal](../api-center/set-up-api-center-portal.md#access-the-portal).

1. Sign in with your Azure account.

   The API portal shows the available MCP servers.

1. Find and select the MCP server that you created.

1. On your MCP server information pane, on the **Options** tab, find the **Endpoint URL** section, and select **Copy URL** so you can test access from an MCP client.

## Test access to your MCP server

1. In Visual Studio Code, from the **View** menu, select **Command Palette**. Find and select **MCP: Add Server**.

   :::image type="content" source="media/create-mcp-server-api-center/visual-studio-code-mcp-add-server.png" alt-text="Screenshot shows Visual Studio Code, Command Palette, and command to add MCP server." lightbox="media/create-mcp-server-api-center/visual-studio-code-mcp-add-server.png":::

1. Select **HTTP (HTTP or Server-Sent Events)**. For **Enter Server URL**, provide the URL for your MCP server.

1. For **Enter Server ID**, provide a meaningful name for your MCP server.

   When you add an MCP server for the first time, you must choose where to store your MCP configuration. You get the following options, so choose the best option for your scenario:

   | Option | Description |
   |--------|-------------|
   | **Global** | Your user configuration, which is the directory at **c:\users\<your-username>\AppData\Roaming\Code\User** and is available across all workspaces. |
   | **Workspace** | Your current workspace in Visual Studio Code. |

   This example selects **Global** to store the MCP server information in the user configuration. As a result, Visual Studio Code creates and opens an **mcp.json** file, which shows your MCP server information.

1. In the **mcp.json** file that opens, select the **Start** or **Restart** link to establish connectivity for your MCP server, for example:

   :::image type="content" source="media/create-mcp-server-api-center/start-server-mcp-json-file.png" alt-text="Screenshot shows mcp.json file with Start link selected." lightbox="media/create-mcp-server-api-center/start-server-mcp-json-file.png":::

1. When the authentication prompt appears, select **Allow**, and then select the account to use for authentication.

1. Sign in and give consent to call your MCP server.

   After authentication completes, the **mcp.sjon** file shows **Running** as the MCP server status.

   :::image type="content" source="media/create-mcp-server-api-center/running-mcp-json-file.png" alt-text="Screenshot shows mcp.json file with Running status selected." lightbox="media/create-mcp-server-api-center/running-mcp-json-file.png":::

1. As a test, try calling your MCP server from GitHub Copilot:

   1. On the Visual Studio Code title bar, open the **Copilot** list, and select **Open Chat**.

   1. Under the chat input box, from the **Built-in** modes list, and select **Agent**.

   1. From the LLM list, select the LLM to use.

   1. To browse the tools available in your MCP server, select **Configure Tools**.

   1. In the tools list, select or clear tools as appropriate, but make sure that your new MCP server is selected.

Now you can interact with your MCP server through the Copilot chat interface.

## Related content

- [Set up Standard logic apps as remote MCP servers](set-up-model-context-protocol-server-standard.md)