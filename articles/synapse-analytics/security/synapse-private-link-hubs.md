---
title: Connect to a Synapse Studio using private links
description: This article will teach you how to connect to your Azure Synapse Studio using private links
author: WilliamDAssafMSFT 
ms.service: synapse-analytics 
ms.topic: conceptual
ms.subservice: security 
ms.date: 12/01/2020 
ms.author: wiassaf
ms.reviewer: sngun
---

# Connect to Azure Synapse Studio using Azure Private Link Hubs 

This article explains how Azure Synapse Analytics Private Link Hubs private links are used to securely connect to Synapse Studio. 

## Azure Private Link Hubs 
You can securely connect  to Azure Synapse Studio from your Azure virtual network using private links. Azure Synapse Analytics private link hubs are Azure resources which act as connectors between your secured network and the Synapse Studio web experience. 

There are two steps to connect to Synapse Studio using private links. First, you must create a private link hubs resource. Second, you must create a private endpoint from your Azure virtual network to this private link hub. You can then use private endpoints to securely communicate with Synapse Studio. You must integrate the private endpoints with your DNS solution, either your on-premises solution or Azure Private DNS. 

## Azure Private Links Hubs and Azure Synapse Studio
You can use a single Azure Synapse private link hub resource to privately connect to all your Azure Synapse Analytics workspaces using Azure Synapse Studio. The workspaces do not have to be in the same region as the Azure Synapse Private link hub. The Azure Synapse Private link hub resource can also be used for connections to Synapse workspaces in different subscriptions or Azure AD tenants.

You can create your private link hub by searching for *Synapse private link hubs* in the Azure portal and selecting **Azure Synapse Analytics (private link hubs)** from Services. Follow the steps in the guide for how to [connect to workspace resources from a restricted network](./how-to-connect-to-workspace-from-restricted-network.md) for details. Certain URLs must be accessible from the client browser after enabling Azure Synapse private link hub. For more information, see [Connect to workspace resources from a restricted network](how-to-connect-to-workspace-from-restricted-network.md).



>[!NOTE]
>Private link hubs are intended for securely loading the static content Synapse Studio over private links. You must create **separate, private endpoints** to the  resources you wish to connect to within the workspace, such as provisioned/dedicated SQL pools, or Spark pools. 

## Azure Private Links Hubs and Azure Virtual Network
You must connect your Azure virtual network to the Synapse private link hub resource to secure the end-to-end connection to Synapse Studio. For this, you must create a private endpoint from your virtual network to the private link hub you created. You can use the Azure portal for your private link hub and go to the Private endpoint section. Select "+ Private endpoint" to create a new private endpoint that connects to your private link hub.

:::image type="content" source="./media/synapse-private-link-hubs/synapse-private-links-private-endpoint.png" alt-text="Screenshot that shows the private endpoint connections page.":::

Make sure to choose the "Microsoft.Synapse/privateLinkHubs" Resource type on the "Resource" tab.

:::image type="content" source="./media/synapse-private-link-hubs/synapse-private-links-resource-type.png" alt-text="Screenshot that shows the 'Create a private endpoint' page with 'Resource type' highlighted.":::

On "Configuration" tab, select "privatelink.azuresynapse.net" for Private DNS Zones when integrating with your virtual network and private DNS zone.

:::image type="content" source="./media/synapse-private-link-hubs/synapse-private-links-dns-zones.png" alt-text="Create a private endpoint to private link hub":::

## Next steps

[Connect to workspace resources from a restricted network](./how-to-connect-to-workspace-from-restricted-network.md)

Learn more about [Managed workspace Virtual Network](./synapse-workspace-managed-vnet.md)

Learn more about [Managed private endpoints](./synapse-workspace-managed-private-endpoints.md)

[Create Managed private endpoints to your data sources](./how-to-create-managed-private-endpoints.md)

[Connect to Synapse workspace using private endpoints](./how-to-connect-to-workspace-with-private-links.md)

