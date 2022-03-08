---
title: Managed virtual network
description: An article that explains Managed virtual network in Azure Synapse Analytics
author: ashinMSFT
ms.service: synapse-analytics 
ms.topic: overview
ms.subservice: security
ms.date: 08/16/2021
ms.author: seshin
ms.reviewer: wiassaf
---

# Azure Synapse Analytics Managed Virtual Network

This article will explain Managed Virtual Network in Azure Synapse Analytics.

## Managed workspace Virtual Network

When you create your Azure Synapse workspace, you can choose to associate it to a Microsoft Azure Virtual Network. The Virtual Network associated with your workspace is managed by Azure Synapse. This Virtual Network is called a *Managed workspace Virtual Network*.

Managed workspace Virtual Network provides you value in four ways:

- With a Managed workspace Virtual Network you can offload the burden of managing the Virtual Network to Azure Synapse.
- You don't have to configure inbound NSG rules on your own Virtual Networks to allow Azure Synapse management traffic to enter your Virtual Network. Misconfiguration of these NSG rules causes service disruption for customers.
- You don't need to create a subnet for your Spark clusters based on peak load.
- Managed workspace Virtual Network along with Managed private endpoints protects against data exfiltration. You can only create Managed private endpoints in a workspace that has a Managed workspace Virtual Network associated with it.

Creating a workspace with a Managed workspace Virtual Network associated with it ensures that your workspace is network isolated from other workspaces. Azure Synapse provides various analytic capabilities in a workspace: Data integration,serverless Apache Spark pool, dedicated SQL pool, and serverless SQL pool.

If your workspace has a Managed workspace Virtual Network, Data integration and Spark resources are deployed in it. A Managed workspace Virtual Network also provides user-level isolation for Spark activities because each Spark cluster is in its own subnet.

Dedicated SQL pool and serverless SQL pool are multi-tenant capabilities and therefore reside outside of the Managed workspace Virtual Network. Intra-workspace communication to dedicated SQL pool and serverless SQL pool use Azure private links. These private links are automatically created for you when you create a workspace with a Managed workspace Virtual Network associated to it.

>[!IMPORTANT]
>You cannot change this workspace configuration after the workspace is created. For example, you cannot reconfigure a workspace that does not have a Managed workspace Virtual Network associated with it and associate a Virtual Network to it. Similarly, you cannot reconfigure a workspace with a Managed workspace Virtual Network associated to it and disassociate the Virtual Network from it.

## Create an Azure Synapse workspace with a Managed workspace Virtual Network

If you have not already done so, register the Network resource provider. Registering a resource provider configures your subscription to work with the resource provider. Choose *Microsoft.Network* from the list of resource providers when you [register](../../azure-resource-manager/management/resource-providers-and-types.md).

To create an Azure Synapse workspace that has a Managed workspace Virtual Network associated with it, select the **Networking** tab in Azure portal and check the **Enable managed virtual network** checkbox.

If you leave the checkbox unchecked, then your workspace won't have a Virtual Network associated with it.

>[!IMPORTANT]
>You can only use private links in a workspace that has a Managed workspace Virtual Network.

:::image type="content" source="./media/synpase-workspace-ip-firewall/azure-synapse-analytics-networking-managed-virtual-network-outbound-traffic.png" lightbox="./media/synpase-workspace-ip-firewall/azure-synapse-analytics-networking-managed-virtual-network-outbound-traffic.png" alt-text="Screenshot of the Create Synapse workspace networking page, with the Managed virtual network option Enabled and the Allow outbound data traffic only to approved targets option to Yes.":::

After you choose to associate a Managed workspace Virtual Network with your workspace, you can protect against data exfiltration by allowing outbound connectivity from the Managed workspace Virtual Network only to approved targets using [Managed private endpoints](./synapse-workspace-managed-private-endpoints.md). Select **Yes** to limit outbound traffic from the Managed workspace Virtual Network to targets through Managed private endpoints. 



:::image type="content" source="./media/synpase-workspace-ip-firewall/azure-synapse-workspace-managed-virtual-network-allow-outbound-traffic.png" lightbox="./media/synpase-workspace-ip-firewall/azure-synapse-workspace-managed-virtual-network-allow-outbound-traffic.png" alt-text="Screenshot of the Managed virtual network page, with the Allow outbound data traffic only to approved targets option to Yes.":::

Select **No** to allow outbound traffic from the workspace to any target.

You can also control the targets to which Managed private endpoints are created from your Azure Synapse workspace. By default, Managed private endpoints to resources in the same AAD tenant that your subscription belongs to are allowed. If you want to create a Managed private endpoint to a resource in an AAD tenant that is different from the one that your subscription belongs to, then you can add that AAD tenant by selecting **+ Add**. You can either select the AAD tenant from the dropdown or manually enter the AAD tenant ID.

:::image type="content" source="./media/synpase-workspace-ip-firewall/azure-synapse-workspace-managed-virtual-network-private-endpoints-azure-ad.png" lightbox="./media/synpase-workspace-ip-firewall/azure-synapse-workspace-managed-virtual-network-private-endpoints-azure-ad.png" alt-text="Screenshot of the Managed virtual network page, with the Add button for Azure Tenant Tenants highlighted.":::

After the workspace is created, you can check whether your Azure Synapse workspace is associated to a Managed workspace Virtual Network by selecting **Overview** from Azure portal.

:::image type="content" source="./media/synpase-workspace-ip-firewall/azure-synapse-analytics-overview-managed-virtual-network-enabled.png" lightbox="./media/synpase-workspace-ip-firewall/azure-synapse-analytics-overview-managed-virtual-network-enabled.png" alt-text="Screenshot of the Azure Synapse workspace overview page indicating that a managed virtual network is enabled.":::

## Next steps

Create an [Azure Synapse Workspace](../quickstart-create-workspace.md)

Learn more about [Managed private endpoints](./synapse-workspace-managed-private-endpoints.md)

[Create Managed private endpoints to your data sources](./how-to-create-managed-private-endpoints.md)
