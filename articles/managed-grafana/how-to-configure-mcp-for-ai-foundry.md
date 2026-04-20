---
title: Configure Azure Managed Grafana MCP for Azure AI Foundry agents
description: Learn how to configure Azure Managed Grafana MCP in Azure AI Foundry so your agent can query Azure resources, metrics, and logs.
author: weng5e
ms.author: wuweng
ms.reviewer: malev
ms.date: 03/09/2026
ms.topic: how-to
ms.service: azure-managed-grafana
#customer intent: As an AI engineer, I want to connect my Azure AI Foundry agent to the Azure Managed Grafana MCP endpoint so that the agent can query Azure resources and observability data.
---

# Configure Azure Managed Grafana MCP for Azure AI Foundry agents

This article shows how to configure the Azure Managed Grafana MCP endpoint in an Azure AI Foundry agent. After configuration, your agent can use MCP tools to query Azure resources, metrics, logs, and dashboards through your Azure Managed Grafana workspace.

## Prerequisites

- An Azure subscription with permission to create and manage Azure resources.
- An Azure Managed Grafana workspace. If you need one, see [Quickstart: Create an Azure Managed Grafana workspace](./quickstart-managed-grafana-portal.md).
- An Azure AI Foundry project where you can create an agent.
- Permission to assign Azure role-based access control (RBAC) roles on the Azure Managed Grafana resource.
- A configured Grafana data source for the workloads you want the agent to query (for example, Azure Monitor for Resource Graph, metrics, and logs). For setup guidance, see [Configure data sources](./how-to-data-source-plugins-managed-identity.md).

## Get your Azure Managed Grafana endpoint

You use the endpoint hostname when you configure the tool in Foundry.

1. In the [Azure portal](https://portal.azure.com), open your Azure Managed Grafana resource.
1. On the **Overview** page, copy the **Endpoint** value. For example: `my-grafana-<id>.<region>.grafana.azure.com`.

    :::image type="content" source="media/how-to-configure-mcp-for-ai-foundry/1-find-grafana-endpoint.png" alt-text="Screenshot of Azure portal showing the Azure Managed Grafana endpoint on the Overview page." lightbox="media/how-to-configure-mcp-for-ai-foundry/1-find-grafana-endpoint-expanded.png":::

## Grant your Foundry project identity access to Azure Managed Grafana

Your Azure AI Foundry project uses a managed identity to access tools and data sources.

1. In the Azure portal, open your Azure Managed Grafana resource.
1. Select **Access control (IAM)** > **Add** > **Add role assignment**.
1. Assign one of these roles to the Foundry project managed identity:

   - **Grafana Admin**
   - **Grafana Editor**
   - **Grafana Viewer**

   Choose the least privileged role that satisfies your scenario.

To find the correct principal:

1. Open your Foundry project in Azure portal. 
1. Use the managed identity shown under **Identity**.

> [!NOTE]
> Role assignments can take a few minutes to propagate. If the first validation attempt fails with authorization errors, wait and try again.

:::image type="content" source="media/how-to-configure-mcp-for-ai-foundry/2-add-role-based-access-control.png" alt-text="Screenshot of Azure portal showing a role assignment being added to Azure Managed Grafana." lightbox="media/how-to-configure-mcp-for-ai-foundry/2-add-role-based-access-control-expanded.png":::

## Create an agent in Azure AI Foundry

1. Open [Azure AI Foundry](https://ai.azure.com) and go to your project.
1. Select **Agents** > **+ New agent**.
1. Select a model that supports tool calling. In this example, we use `gpt-5.1`.
1. Enter a name and description for the agent.

    :::image type="content" source="media/how-to-configure-mcp-for-ai-foundry/3-create-new-agent.png" alt-text="Screenshot of Azure AI Foundry showing the New agent creation flow." lightbox="media/how-to-configure-mcp-for-ai-foundry/3-create-new-agent-expanded.png":::

## Add the Azure Managed Grafana MCP tool

1. In the agent configuration, go to **Tools**.
1. Select **+ Add tool**.
1. Select **Catalog**, then select **Azure Managed Grafana**.

    :::image type="content" source="media/how-to-configure-mcp-for-ai-foundry/4-agent-add-mcp.png" alt-text="Screenshot of Azure AI Foundry agent tool catalog with Azure Managed Grafana selected." lightbox="media/how-to-configure-mcp-for-ai-foundry/4-agent-add-mcp-expanded.png":::

1. Configure the tool settings:

   | Setting | Value |
   | --- | --- |
   | **workspace-hostname** | Your Azure Managed Grafana endpoint hostname. Enter only the hostname. Don't include `https://` or `/api/azure-mcp`. |
   | **Authentication** | **Microsoft Entra** |
   | **Type** | **Project Managed Identity** |
   | **Audience** | The application ID for Azure Managed Grafana: `ce34e7e5-485f-4d76-964f-b3d2b16d1e4f` |


    :::image type="content" source="media/how-to-configure-mcp-for-ai-foundry/5-mcp-config.png" alt-text="Screenshot of Azure AI Foundry showing Azure Managed Grafana MCP tool configuration values." lightbox="media/how-to-configure-mcp-for-ai-foundry/5-mcp-config-expanded.png":::

## Validate the sample

After you save the tool configuration, validate the setup from the agent chat.

1. Open the chat panel for your agent.
1. Submit a connectivity prompt, like *List all Azure subscriptions available through Azure Managed Grafana MCP*.
1. Confirm that the response includes grounded tool output rather than a generic model-only answer.

    :::image type="content" source="media/how-to-configure-mcp-for-ai-foundry/6-agent-trigger-resource-graph.png" alt-text="Screenshot of Azure AI Foundry chat where the agent invokes Azure Managed Grafana MCP tools." lightbox="media/how-to-configure-mcp-for-ai-foundry/6-agent-trigger-resource-graph-expanded.png":::

### Sample prompts

You can use any of the following sample prompts:

- `List all Azure Managed Grafana instances in my subscriptions.`
- `Show me all virtual machines in resource group <resource-group-name>.`
- `Find all storage accounts with public access enabled.`

### Troubleshoot validation

If validation fails:

- Verify the managed identity has a Grafana role on the Azure Managed Grafana resource.
- Verify the **workspace-hostname** value is the Grafana hostname only.
- Verify the audience is `ce34e7e5-485f-4d76-964f-b3d2b16d1e4f`.
- Verify the Grafana data source required by the prompt exists and can access the target Azure scope.
- Check for RBAC propagation delay and retry after a few minutes.

## Clean up resources

If you created resources only for this test, remove access and resources to avoid ongoing charges.

1. Remove the test role assignment from your Azure Managed Grafana resource:

   1. Open **Access control (IAM)** on the Azure Managed Grafana resource.
   1. Select **Role assignments**.
   1. Find the Foundry project managed identity assignment and remove it.

1. In Azure AI Foundry, remove the Azure Managed Grafana tool from the agent, or delete the test agent.
1. Optionally delete test resources such as the Foundry project and Azure Managed Grafana workspace if they were created only for this walkthrough.

## Next steps

- Learn more about the remote MCP endpoint in [Configure an Azure Managed Grafana remote MCP server](./grafana-mcp-server.md).
- Explore dashboard examples in [Create dashboards for GenAI applications](./azure-ai-foundry-dashboard.md).
