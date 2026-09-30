---
title: Create MCP Connectors for Agents and Azure Integration
titleSuffix: Connector Namespace
description: Create MCP server connectors from prebuilt connectors for services, systems, MCP servers, and other components by using connector namespaces. Call your MCP server tools from agents and Azure service integrations.
ms.service: connector-namespace
author: wsilveiranz
ms.author: wsilveira
ms.topic: how-to
ai-usage: ai-assisted
ms.update-cycle: 180-days
ms.date: 08/10/2026
# Customer intent: As an AI automation and integration developer, I want to create MCP server connectors in connector namespaces to use with agents and Azure services so I can manage my integrations centrally and more effectively.
---

# Create MCP server connectors in connector namespaces for agents and Azure integrations (preview)

> [!IMPORTANT]
>
> This preview capability is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). During preview, this capability is only available in Azure public regions.

For automation and integration, AI agents need tools that can securely call other services and systems. However, building and maintaining separately managed Model Context Protocol (MCP) servers, defining tools, and managing credentials for each integration adds significant overhead and complexity. Connector Namespace addresses this problem by centrally hosting and managing MCP servers as connectors for you. In a connector namespace resource, you can create an MCP server connector by choosing a prebuilt connector, which provides actions as tools that agents and Azure services can securely call - without needing custom server code or other infrastructure.

In a connector namespace, you can create the following kinds of MCP server connectors:

| Type | Description |
|---|---|
| *Managed* | This MCP server connector automatically includes all actions from your selected prebuilt connector for agents to call as tools. Needs minimal setup. |
| *Configurable* | This MCP server connector includes only the actions you choose from your selected prebuilt connector for agents to call as tools. You can also control whether agents or humans provide tool inputs. |

This guide shows how to create both managed and configurable MCP server connectors in a connector namespace and validate your new connectors in the playground. For configurable MCP server connectors, you also learn how to choose specific actions to include as tools and specify whether agents or humans provide tool inputs.

For more information, see [What is Connector Namespace](connector-namespace-overview.md).

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Access to the [Azure portal](https://portal.azure.com) with permissions to create connector namespaces and reusable connections.
- Credentials for the service or system for which you want to create a reusable connection in the connector namespace.
- An [existing connector namespace resource](create-connector-namespace.md) in the Azure portal.
- Access to the [Connector Namespaces portal](https://connectors.azure.com).
- The capability to [create reusable connections](create-connector-namespace-connection.md) for the services you want during the connector creation process, or you have existing connections to use when creating your MCP server connectors.

## Limitations and known issues

This release supports choosing only one connector to create your MCP server connector.

## Create an MCP server connector

1. In the [Azure portal](https://portal.azure.com) search box, enter `connector namespaces`, and select **Connector Namespaces**.

1. Find and select your connector namespace resource.

   The [**Connector Namespaces** portal](https://connectors.azure.com) opens and shows your connector namespace overview page.

1. On the namespace overview page, in the **MCP connectors** section, select **+ Create**.

   For example:

   :::image type="content" source="media/create-mcp-server-connectors/create-mcp-connectors.png" alt-text="Screenshot shows the Connector Namespaces portal with the open Overview page, MCP Connectors section, and the selected Create button." lightbox="media/create-mcp-server-connectors/create-mcp-connectors.png":::

   The following window opens and shows prebuilt connectors where you can choose one to create your MCP server:

   :::image type="content" source="media/create-mcp-server-connectors/choose-connector-window.png" alt-text="Screenshot shows the Choose connector window where you choose a connector to use." lightbox="media/create-mcp-server-connectors/choose-connector-window.png":::

1. Continue with the steps for a managed or configurable connector. 

### [Managed](#tab/managed-connector)

The following steps create an MCP server connector from a selected prebuilt connector that includes all its actions for agents to use as tools:

1. In the **MCP Connector - Choose Connector** window, under the search box, select **Managed** to view Azure-managed connectors.

   :::image type="content" source="media/create-mcp-server-connectors/managed-connectors.png" alt-text="Screenshot shows the MCP Connector - Choose Connector window with selected Managed filter to show only managed connectors." lightbox="media/create-mcp-server-connectors/managed-connectors.png":::

1. Find and select the managed connector you want, such as **Office 365 Outlook**.

1. Follow the prompt to authenticate the connection with your credentials.

1. After the portal creates your connector, select **Create another** or **Done**.

1. Continue to [Test your MCP server connector](#test-your-mcp-server-connector).

### [Configurable](#tab/configurable)

The following steps create an MCP server connector from a connector and include only the selected actions for agents to use as tools:

1. In the **MCP connector - Choose connector** window, under the search box, select **Configurable**.

   :::image type="content" source="media/create-mcp-server-connectors/configurable-connectors.png" alt-text="Screenshot shows the MCP Connector - Choose Connector window with selected Configurable filter to show only configurable connectors." lightbox="media/create-mcp-server-connectors/configurable-connectors.png":::

1. Find and select the connector you want, such as **Azure Blob Storage**.

1. Follow the prompt to authenticate the connection with your credentials.

1. After the portal creates your connector, choose a path:

   - Optionally, continue to the next section to filter out actions that you don't want to expose in your MCP server.

     By default, the MCP server connector you create automatically includes all the actions in your selected connector.

   - Select **Create another** to create another MCP server connector.

   - Select **Done** so you can test your MCP server.

   :::image type="content" source="media/create-mcp-server-connectors/configurable-mcp-server-created.png" alt-text="Screenshot shows the completed configurable MCP server." lightbox="media/create-mcp-server-connectors/configurable-mcp-server-created.png":::

#### Hide or filter tools in configurable MCP server connectors

The following steps hide and filter tools that you don't want to include in your MCP server connector:

1. On the confirmation page for your newly created MCP server connector, select **Configure tools**.

   > [!TIP]
   >
   > To change the tool availability in an existing configurable MCP server connector, open that connector, and select **Edit**.

1. On the **Tools** tab, select **Deselect all** to clear all action selections.

1. Select only the actions you want to include in your MCP server connector. When you finish, select **Update**.

   The following example shows an MCP server connector, which is based on the Azure Table Storage connector. To provide read-only access, select only the **Get a table**, **Get entities**, **Get entity**, and **List tables** actions.

   :::image type="content" source="media/create-mcp-server-connectors/select-tools.png" alt-text="Screenshot shows the Quick Create MCP Connector - Choose Connector window with selected Azure Table Storage actions as tools and highlighted Update button." lightbox="media/create-mcp-server-connectors/select-tools.png":::

1. Next to the **Tools** tab, select **Configure inputs** so you can choose how to provide inputs for the selected actions.

1. For each action parameter, select **User** or **Agent**. For automatic provisioning, select **Agent** for all inputs.

   | Option | Description |
   |---|---|
   | **User** | Humans provide the input values at runtime. |
   | **Agent** | Agents infer and provide the input values from context at runtime. |

   > [!NOTE]
   >
   > Not all actions offer the option to specify the input provider. 

1. To save your changes, select **Update**.

1. Continue to [Test your MCP server connector](#test-your-mcp-server-connector).

---

## Test your MCP server connector

You don't need a separate MCP client to test your MCP server connector and tools. Instead, use the built-in playground to initialize the MCP server, view the enabled tools, run tool calls, and review the request and response results.

1. In the [Connector Namespaces portal](https://connectors.azure.com), go to your MCP server connector.

1. Before you start testing, allow access to the playground:

   1. On the **Settings** tab, in the **Authentication** section, find the **API key** setting.
   
   1. Change **API key** from **Disabled** to **Enabled**.

1. Next to your MCP server connector name, select the now enabled **Playground** button. 

1. To interact with the connector tools, run the following commands:

   | Command | Action |
   |---|---|
   | **Initialize** | Start the MCP server. |
   | **List tools** | List the enabled tools. |
   | **Call tool** | Under the command bar, on the **Tools** tab, expand each tool, select **Call tool**, and provide the required parameter inputs. | 

1. To confirm that your MCP server connector works the way you expect, review the request and response data in the tool results.

   For example:

   :::image type="content" source="media/create-mcp-server-connectors/test-playground.png" alt-text="Screenshot shows the Playground page with the Office 365 Outlook MCP server connector and the open request and response panes." lightbox="media/create-mcp-server-connectors/test-playground.png":::

## Related content

- [Create connector namespace connections](create-connector-namespace-connection.md)
- [Create hosted MCP servers](hosted-mcp-quickstart.md)
