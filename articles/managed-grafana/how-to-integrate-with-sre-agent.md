---
title: Integrate Azure SRE Agent (preview) with Azure Managed Grafana
description: Learn how to integrate Azure SRE Agent with Azure Managed Grafana. This guide covers enabling the integration, granting users access to the agent, and using the agent from Grafana dashboards.
keywords: Azure Managed Grafana, Azure SRE Agent, SRE Agent integration
author: shawncx
ms.topic: how-to
ms.date: 10/28/2026
ms.author: xichen
ms.reviewer: malev
ms.service: azure-managed-grafana
ai-usage: ai-assisted
---

# Integrate Azure SRE Agent (preview) with Azure Managed Grafana

Azure Managed Grafana offers an Azure SRE Agent integration in preview that connects an [Azure SRE Agent](/azure/sre-agent/overview) to your Grafana workspace. After you enable the integration, users can open the SRE agent directly from a Grafana dashboard and ask it to investigate issues and create dashboards without switching between Grafana and the SRE Agent portal.

The Azure SRE Agent integration enables you to:

- Pair an existing SRE agent with your Azure Managed Grafana workspace
- Open the SRE agent from your Grafana dashboards
- Analyze existing dashboards and create new dashboards with the SRE agent
- Investigate anomalies, diagnose issues, and run root cause analysis while you view your dashboards
- Combine your Grafana observability data with the agent's connectors, knowledge, and memory

This article walks you through enabling the Azure SRE Agent integration, granting users access to the agent, and using the agent from Grafana dashboards.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An Azure Managed Grafana workspace in the Standard tier. [Create a new workspace](./quickstart-managed-grafana-portal.md) if you don't have one.
- An Azure SRE Agent. [Create and set up an agent](/azure/sre-agent/create-and-set-up) if you don't have one.
- The SRE agent must be connected to your Azure Managed Grafana workspace through one of the following connectors:

    - An Azure Managed Grafana connector. For more information, see [Connectors in Azure SRE Agent](/azure/sre-agent/connectors).
    - An MCP connector that points to the workspace's [remote MCP server endpoint](./grafana-mcp-server.md), `https://<grafana-endpoint>/api/azure-mcp`. For more information, see [MCP connectors and tools in Azure SRE Agent](/azure/sre-agent/mcp-connectors).

- Users who want to use the SRE agent from Grafana must have the **SRE Agent Standard User** role on the target SRE agent. For more information, see [Grant users access to the SRE agent](#grant-users-access-to-the-sre-agent).

## Select an SRE agent to enable the Azure SRE Agent integration (preview)

Complete the following steps to connect your Grafana workspace to an SRE agent and enable the Azure SRE Agent integration (preview):

1. Open your Azure Managed Grafana workspace and in the left menu select **Integrations** > **Azure SRE Agent (Preview)**.

    :::image type="content" source="media/integrate-with-sre-agent/select-sre-agent.png" alt-text="Screenshot of the Azure portal showing the Azure SRE Agent (Preview) pane in Azure Managed Grafana with an SRE agent selected." lightbox="media/integrate-with-sre-agent/select-sre-agent.png":::

1. In the dropdown menu, select an SRE agent. The portal checks whether the selected agent has an Azure Managed Grafana connector or an MCP connector that targets this Grafana workspace. If it does, the message **SRE Agent has connected to Grafana** is displayed. If it doesn't, configure one of the connectors described in [Prerequisites](#prerequisites) on the SRE agent, and then select the agent again.
1. Select **Save**. After enablement completes, the selected SRE agent appears in the dropdown menu.
1. To switch to a different SRE agent in the future, repeat steps 2 and 3.

> [!IMPORTANT]
> Enabling the integration doesn't create any connectors or role assignments on the SRE agent. Configure them manually on the SRE agent side: connect the agent to your Grafana workspace as described in [Prerequisites](#prerequisites), and assign roles to users as described in [Grant users access to the SRE agent](#grant-users-access-to-the-sre-agent).

## Grant users access to the SRE agent

To use the SRE agent from Grafana, each user needs the **SRE Agent Standard User** role on the target SRE agent. This role lets users chat with the agent and run diagnostics. For a full comparison of roles, see [User roles and permissions in Azure SRE Agent](/azure/sre-agent/user-roles).

Users also need a Grafana role on the Azure Managed Grafana workspace to view dashboards. For more information, see [Manage access and permissions for users and identities](./how-to-manage-access-permissions-users-identities.md).

### [Portal](#tab/azure-portal)

1. In the Azure portal, open your SRE agent resource.
1. Select **Access control (IAM)** > **Add** > **Add role assignment**.
1. Select the **SRE Agent Standard User** role, and then select **Next**.
1. Select **User, group, or service principal** > **Select members**, and then select the users or groups that need access.
1. Select **Review + assign**.

### [Azure CLI](#tab/azure-cli)

Run the following command to assign the **SRE Agent Standard User** role on the SRE agent:

```azurecli
az role assignment create \
    --assignee <user-or-group-object-id> \
    --role "SRE Agent Standard User" \
    --scope /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.App/agents/<agent-name>
```

---

> [!TIP]
> Assign the role to a Microsoft Entra group instead of individual users to simplify access management. Role assignments can take a few minutes to propagate.

## Use Azure SRE Agent from a Grafana dashboard

After you enable the integration, you can open the SRE agent from your Grafana dashboards:

1. In the Grafana UI, open a dashboard.
1. In the dashboard toolbar, select the **Azure SRE Agent** icon. The **Azure SRE Agent** pane opens next to the dashboard.

    :::image type="content" source="media/integrate-with-sre-agent/sre-agent-dashboard-pane.png" alt-text="Screenshot of a Grafana dashboard with the Azure SRE Agent icon highlighted in the toolbar and the Azure SRE Agent pane open, showing a message box, suggested prompts, and My chats." lightbox="media/integrate-with-sre-agent/sre-agent-dashboard-pane.png":::

1. Enter a message, or select one of the suggested prompts. For example:

    - `Summarize this dashboard and highlight anything unusual`
    - `Which panels show spikes or anomalies in the current time range?`
    - `Recommend ways to optimize my system based on this dashboard`

1. To return to a previous conversation, go to **My chats** in the pane and select **See all**.

The SRE agent uses the dashboard you're viewing as context. It can also use its other connectors, including the connector to your Grafana workspace, to query data and investigate issues. For more information about running investigations, see [Run your first investigation](/azure/sre-agent/first-investigation).

> [!TIP]
> If you don't see the Azure SRE Agent icon on your dashboard, check that the integration is enabled on your Azure Managed Grafana workspace. If the agent returns an authorization error, check that you have the **SRE Agent Standard User** role on the SRE agent.

## Disable the Azure SRE Agent integration (preview)

If you no longer need the Azure SRE Agent integration (preview), you can disable it from your Azure Managed Grafana workspace:

1. In your Azure Managed Grafana workspace, select **Integrations** > **Azure SRE Agent (Preview)** from the left menu.
1. Select **Disable** > **Yes** to confirm.
1. Optionally remove the role assignments that you added on the SRE agent:
   1. In the SRE agent resource, select **Access control (IAM)** > **Role assignments**.
   1. Under **SRE Agent Standard User**, select the users or groups that no longer need access. Select **Delete** > **OK**.
1. Optionally remove the Azure Managed Grafana connector or MCP connector from the SRE agent. In the [SRE Agent portal](https://sre.azure.com), select your agent, go to **Builder** > **Connectors**, and delete the connector to your Azure Managed Grafana workspace.

    > [!NOTE]
    > Disabling the Azure SRE Agent integration only removes the integration from your Grafana workspace. It doesn't affect your SRE agent, including its connectors, role assignments, and data.

## Related content

- [What is Azure SRE Agent?](/azure/sre-agent/overview)
- [Connectors in Azure SRE Agent](/azure/sre-agent/connectors)
- [Configure an Azure Managed Grafana remote MCP server](./grafana-mcp-server.md)
- [User roles and permissions in Azure SRE Agent](/azure/sre-agent/user-roles)
