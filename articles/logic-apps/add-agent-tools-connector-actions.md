---
title: Add Agent Tools Backed by Connector Actions
description: Learn to add tools for agents in Microsoft Foundry powered by connector actions in Azure Logic Apps by creating Model Context Protocol (MCP) servers.
services: logic-apps, azure-ai-foundry
author: ecfan
ms.suite: integration
ms.reviewers: estfan, divswa, azla
ms.topic: how-to
ms.collection: ce-skilling-ai-copilot
ms.date: 12/12/2025
ms.update-cycle: 180-days
# Customer intent: As an AI integration developer working in Microsoft Foundry, I want to add agent tools powered connector actions in Azure Logic Apps by creating MCP servers.
---

# Add agent tools in Foundry backed by connector actions in Azure Logic Apps (preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!NOTE]
>
> This capability is in preview, might incur charges, and is subject to the
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This guide shows how to add tools powered by Azure Logic Apps to your agents in Microsoft Foundry. These tools use connector actions that run in Azure Logic Apps and let you integrate agents with specific Microsoft and non-Microsoft services, systems, apps, and data sources so you don't have to write any code. Tools include single or multiple actions provided by the connector that you choose. You then package these tools by creating Model Content Protocol (MCP) servers as tool providers.

For more information, see:

- [What is Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro)?
- [What is Foundry](/azure/ai-foundry/what-is-azure-ai-foundry)?
- [What is Azure Logic Apps](/azure/logic-apps/logic-apps-overview)?

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- The following Foundry assets that you can create with the classic Foundry portal:

  - A [Foundry resource](/azure/ai-services/multi-service-resource?pivots=azportal)

    You need the **Owner** role in your subscription to create this resource.

  - A [Foundry project in your Foundry resource](/azure/ai-foundry/how-to/create-projects?tabs=ai-foundry)

  - An [agent in your project](/azure/ai-foundry/agents/quickstart?context=%2Fazure%2Fai-foundry%2Fcontext%2Fcontext&pivots=ai-foundry-portal)
  
  - A [Foundry model deployed for your agent](/azure/ai-foundry/foundry-models/how-to/create-model-deployments?pivots=ai-foundry-portal)

- To avoid potential problems returning to the Foundry portal from the Azure portal where you create an MCP server, allow pop-ups for the Azure portal by adding the URL `https://portal.azure.com:443` to your browser's or pop-up blocker's allow list.

## Limitations and known issues

- Foundry portal

  - The experience to add an agent tool powered by Azure Logic Apps is currently available only in the preview Foundry portal, not in classic Foundry portal.

  - You can select only one connector to use for your agent tool.

  - This release supports only managed connectors for Microsoft and non-Microsoft services and products that don't use OAuth 2.0 authentication.
  
    [*Managed* connectors](/azure/connectors/managed) are hosted and run on shared clusters in multitenant Azure.

  - In the **Select a tool** window, after you select one or multiple filters, you can't clear your selections. To clear the filters, return to the **Tools** page and start over with **Connect a tool**.

- Azure portal

  - Some connectors that you select might not show any available actions.

  - In the MCP server registration wizard, after you select a connector and the actions you want, you can't change or delete the selected connector to choose a different one.

## 1: Add tools for your agent

Follow these steps to add one or multiple tools for your agent in Microsoft Foundry. These tools are provided by an MCP server that you create.

1. In the classic [Foundry portal](https://ai.azure.com/), open your project, and go to your agent.

1. On the Foundry title bar, select **New Foundry**.

   :::image type="content" source="media/add-agent-tools-connector-actions/new-foundry.png" alt-text="Screenshot shows classic Foundry title bar with unselected New Foundry option." lightbox="media/add-agent-tools-connector-actions/new-foundry.png":::

   The classic Foundry portal changes to the preview Foundry portal.

   :::image type="content" source="media/add-agent-tools-connector-actions/preview-foundry.png" alt-text="Screenshot shows preview Foundry portal." lightbox="media/add-agent-tools-connector-actions/preview-foundry.png":::

1. Under **Your recent work**, select your agent.

   :::image type="content" source="media/add-agent-tools-connector-actions/my-agent.png" alt-text="Screenshot shows Your recent work section with selected agent." lightbox="media/add-agent-tools-connector-actions/my-agent.png":::

1. On the Foundry sidebar, select **Tools**.

   :::image type="content" source="media/add-agent-tools-connector-actions/foundry-sidebar-tools.png" alt-text="Screenshot shows Foundry sidebar with Tools selected." lightbox="media/add-agent-tools-connector-actions/foundry-sidebar-tools.png":::

1. On the **Tools** page, select **Connect a tool**.

1. In the **Select a tool** window, select **Catalog**.

   :::image type="content" source="media/add-agent-tools-connector-actions/select-catalog.png" alt-text="Screenshot shows Select a tool window with Catalog tab selected." lightbox="media/add-agent-tools-connector-actions/select-catalog.png":::

1. On the **Catalog** tab, select **Registry** > **Logic app connectors**.

   :::image type="content" source="media/add-agent-tools-connector-actions/registry-logic-app-connectors.png" alt-text="Screenshot shows Catalog tab with Registry list open and Logic app connectors selected." lightbox="media/add-agent-tools-connector-actions/registry-logic-app-connectors.png":::

1. Select the connector you want by following these steps:

   1. In the search box, enter the name for the connector with the actions you want.

      This example selects the **RSS** connector.

   1. From the results, select the matching connector, then select **Create**.

      For example:

      :::image type="content" source="media/add-agent-tools-connector-actions/select-connector.png" alt-text="Screenshot shows search box with rss entered with RSS connector and Create button selected." lightbox="media/add-agent-tools-connector-actions/select-connector.png":::

      This action opens Azure portal and shows the home page for the **Register an MCP server with Azure Logic Apps** wizard.

1. Continue to the next section so you can create your MCP server and set up your tools in the Azure portal.

## 2: Create the MCP server and tools for your agent

You can continue with these steps only after you finish the steps from the preceding section.

1. In the Azure portal, on the **Register an MCP server with Azure Logic Apps** wizard home page, in the **Project details** section, provide the following information:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **MCP server name** | Yes | <*mcp-server-name*> | The name to use for the MCP server. |
   | **Description** | Yes | <*mcp-server-description*> | The description about the MCP server's role, purpose, and tasks that the server can perform. This description helps your agent more accurately identify and choose the appropriate server and tools to use. |
   | **Logic app** | Yes* | <*Standard-logic-app-resource*> | *This property value depends on whether you have any Standard logic app resources linked to Foundry resources. <br><br>- **None**: The Azure portal creates a Standard logic app for your MCP server to use. <br><br>- **One**: The Azure portal automatically selects this Standard logic app for your MCP server to use. <br><br>- **Multiple**: Open the list, and select a logic app for your MCP server to use. |

   For example:

   :::image type="content" source="media/add-agent-tools-connector-actions/mcp-information.png" alt-text="Screenshot shows MCP server details section in wizard." lightbox="media/add-agent-tools-connector-actions/mcp-information.png":::

1. In the **Tools** section, set up the connection for your chosen connector:

   1. In the **Connectors** section, on the connector row, select the edit button (pencil icon).

      :::image type="content" source="media/add-agent-tools-connector-actions/create-connection.png" alt-text="Screenshot shows MCP wizard with Connectors section and edit button selected." lightbox="media/add-agent-tools-connector-actions/create-connection.png":::

   1. On the **Edit connection** pane, follow the prompt, which varies based on the connector, for example:

      1. For connectors that don't require authentication, select **Create new**.

      1. For connectors that require authentication, select **Sign in**.

      For the example RSS connector, you're prompted to select **Create new**.

1. If the **Add actions** pane doesn't appear, under **Tools**, in the **Actions** section, select **Add**.

   :::image type="content" source="media/add-agent-tools-connector-actions/add-actions.png" alt-text="Screenshot shows MCP wizard with Actions section and Add selected." lightbox="media/add-agent-tools-connector-actions/add-actions.png":::

1. On the **Add actions** pane, find and select one or more connector actions to include as tools in your MCP server.

   This example selects the **RSS** action named **List all RSS feed items**.

1. When you're ready, select **Save**.

   The **Actions** section shows the selected actions that power the tools that your MCP server provides. By default, any parameters for these actions use an LLM as the input source. You can change this input source to user-provided, based on your scenario's needs.

1. To help an agent, LLM, or MCP client choose the correct tool and pass correctly sourced inputs to tool parameters, review and update each tool's setup by following these steps:

   1. In the **Actions** section, select either the tool name or the edit button (pencil) for that tool.

   1. On the **Edit: <*tool-name*>** pane, provide the following information:

        | Section | Description |
        |---------|-------------|
        | **Description** | Describes the purpose for the action-backed tool to help an agent or LLM determine when to use the tool. A default description exists, but you can customize the text for your needs. <br><br>The default text comes from the [connector's API Swagger description](/connectors/connector-reference/connector-reference-logicapps-connectors), for example, [Actions - RSS](/connectors/rss/). |
        | **Default parameters** | Lists any parameters required to run the tool. For each parameter, the input source options are **Model** and **User**. By default, the model (LLM) provides the inputs. If you select **User**, the appropriate UX appears for you to provide the input source. For more information, see [Learn how parameter values resolve at runtime](#runtime-value-resolution). |
        | **Optional parameters** | Select any other parameters that you want to include for the tool. |

        The following example shows the description and parameters for the **List all RSS feed items** tool:

        :::image type="content" source="media/add-agent-tools-connector-actions/tool-parameters.png" alt-text="Screenshot shows Edit pane for an example tool." lightbox="media/add-agent-tools-connector-actions/tool-parameters.png":::

     1. When you're done, select **Save changes**.

1. When you're done reviewing or updating each tool, select **Register**.

   :::image type="content" source="media/add-agent-tools-connector-actions/register.png" alt-text="Screenshot shows finished Tools section and Register selected." lightbox="media/add-agent-tools-connector-actions/register.png":::

1. Wait for the notifications that Azure successfully registered your MCP server.

   After registration completes, the Azure portal returns to your agent in the Foundry portal. Try testing your agent tool using the chat window in your agent's playground.

[!INCLUDE [ai-action-parameter-values-runtime](includes/ai-action-parameter-values-runtime.md)]

## Related content

- [What is Azure AI Foundry](/azure/ai-foundry/what-is-azure-ai-foundry)?
- [What is Azure Logic Apps](/azure/logic-apps/logic-apps-overview)?
