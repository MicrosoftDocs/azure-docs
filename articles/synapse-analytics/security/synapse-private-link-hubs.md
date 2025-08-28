---
title: Connect to Azure Synapse Studio using private links
description: Learn how to connect securely to Azure Synapse Studio from your virtual network using Azure private link hubs.
author: meenalsri
ms.service: azure-synapse-analytics
ms.topic: concept-article
ms.subservice: security 
ms.date: 02/06/2025 
ms.author: mesrivas
---

# Connect to Azure Synapse Studio using Azure private link hubs

This article explains how you can securely connect to Azure Synapse Studio from your Azure virtual network using private links. Azure Synapse Analytics private link hubs are Azure resources that act as connectors between your secured network and the Synapse Studio web experience.

There are two steps for connecting to Synapse Studio using private links:

1. Create an Azure private link hubs resource.
1. Create a private endpoint from your Azure virtual network to this private link hub.

You can then use private endpoints to securely communicate with Synapse Studio. You must integrate the private endpoints with your DNS solution, either your on-premises solution or Azure Private DNS.

## Create an Azure private link hubs resource

>[!IMPORTANT]
>Create one—and only one—Azure Synapse private link hub for a given DNS domain ( *.web.azuresynapse.net ). Creating more than one hub causes DNS records for web.azuresynapse.net to resolve unpredictably, preventing Azure Synapse Studio from loading. Delete any extra hubs before you proceed.

You can use a single Azure Synapse private link hub resource to privately connect to all your Azure Synapse Analytics workspaces using Azure Synapse Studio. The workspaces don't have to be in the same region as the Azure Synapse private link hub. The Azure Synapse private link hub resource can also be used for connections to Synapse workspaces in different subscriptions or Microsoft Entra tenants.

Follow these steps to create an Azure private link hub:

1. Sign in to the Azure portal and enter *Synapse private link hubs* in the search field.

1. Select **Azure Synapse Analytics (private link hubs)** from the results under **Services**.

For a detailed guide, follow the steps in [Connect to workspace resources from a restricted network](./how-to-connect-to-workspace-from-restricted-network.md). Certain URLs must be accessible from the client browser after enabling Azure Synapse private link hub.

>[!NOTE]
>Private link hubs are intended for securely loading Synapse Studio static content over private links. You must create **separate, private endpoints** to the resources you wish to connect to within the workspace, such as provisioned/dedicated SQL pools, or Spark pools.

## Create a private endpoint from your Azure virtual network

You must connect your Azure virtual network to the Synapse private link hub resource to secure the end-to-end connection to Synapse Studio. For this, you must create a private endpoint from your virtual network to the private link hub you created.

1. In the Azure portal, select your private link hub and go to the private endpoint section.

1. Select **+ Private endpoint** to create a new private endpoint that connects to your private link hub.

    :::image type="content" source="./media/synapse-private-link-hubs/synapse-private-links-private-endpoint.png" alt-text="Screenshot that shows the private endpoint connections page." lightbox="./media/synapse-private-link-hubs/synapse-private-links-private-endpoint.png":::

1. Choose the *Microsoft.Synapse/privateLinkHubs* resource type on the **Resource** tab.

    :::image type="content" source="./media/synapse-private-link-hubs/synapse-private-links-resource-type.png" alt-text="Screenshot that shows the 'Create a private endpoint' page with 'Resource type' highlighted." lightbox="./media/synapse-private-link-hubs/synapse-private-links-resource-type.png":::

1. On the **Configuration** tab, select *privatelink.azuresynapse.net* for **Private DNS zones** when integrating with your virtual network and private DNS zone.

    :::image type="content" source="./media/synapse-private-link-hubs/synapse-private-links-dns-zones.png" alt-text="Screenshot that shows the page to create a private endpoint to private link hub." lightbox="./media/synapse-private-link-hubs/synapse-private-links-dns-zones.png":::

## Related content

- [Connect to workspace resources from a restricted network](./how-to-connect-to-workspace-from-restricted-network.md)
- [Azure Synapse Analytics Managed Virtual Network](./synapse-workspace-managed-vnet.md)
- [Azure Synapse Analytics managed private endpoints](./synapse-workspace-managed-private-endpoints.md)
- [Create a Managed private endpoint to your data source](./how-to-create-managed-private-endpoints.md)
- [Connect to your Azure Synapse workspace using private links](./how-to-connect-to-workspace-with-private-links.md)
