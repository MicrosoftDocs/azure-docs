---
title: Managed private endpoints
description: An article that explains Managed private endpoints in Azure Synapse Analytics
author: ashinMSFT
ms.service: synapse-analytics 
ms.topic: overview
ms.subservice: security
ms.date: 01/12/2020
ms.author: seshin
ms.reviewer: sngun
---

# Synapse Managed private endpoints

This article will explain Managed private endpoints in Azure Synapse Analytics.

## Managed private endpoints

Managed private endpoints are private endpoints created in a Managed Virtual Network associated with your Azure Synapse workspace. Managed private endpoints establish a private link to Azure resources. Azure Synapse manages these private endpoints on your behalf. You can create Managed private endpoints from your Azure Synapse workspace to access Azure services (such as Azure Storage or Azure Cosmos DB) and Azure hosted customer/partner services.

When you use Managed private endpoints, traffic between your Azure Synapse workspace and other Azure resources traverse entirely over the Microsoft backbone network. Managed private endpoints protect against data exfiltration. A Managed private endpoint uses private IP address from your Managed Virtual Network to effectively bring the Azure service that your Azure Synapse workspace is communicating into your Virtual Network. Managed private endpoints are mapped to a specific resource in Azure and not the entire service. Customers can limit connectivity to a specific resource approved by their organization. 

Learn more about [private links and private endpoints](../../private-link/index.yml).

>[!IMPORTANT]
>Managed private endpoints are only supported in Azure Synapse workspaces with a Managed workspace Virtual Network.

>[!NOTE]
>When creating an Azure Synapse workspace, you can choose to associate a Managed Virtual Network to it. If you choose to have a Managed Virtual Network associated to your workspace, you can also choose to limit outbound traffic from your workspace to only approved targets. You must create Managed private endpoints to these targets. 


A private endpoint connection is created in a "Pending" state when you create a Managed private endpoint in Azure Synapse. An approval workflow is started. The private link resource owner is responsible to approve or reject the connection. If the owner approves the connection, the private link is established. But, if the owner doesn't approve the connection, then the private link won't be established. In either case, the Managed private endpoint will be updated with the status of the connection. Only a Managed private endpoint in an approved state can be used to send traffic to the private link resource that is linked to the Managed private endpoint.

## Managed private endpoints for dedicated SQL pool and serverless SQL pool

Dedicated SQL pool and serverless SQL pool are analytic capabilities in your Azure Synapse workspace. These capabilities use multi-tenant infrastructure that isn't deployed into the [Managed workspace Virtual Network](./synapse-workspace-managed-vnet.md).

When a workspace is created, Azure Synapse creates two Managed private endpoints in the workspace, one for dedicated SQL pool and one for serverless SQL pool. 

These two Managed private endpoints are listed in Synapse Studio. Select **Manage** in the left navigation, then select **Managed private endpoints** to see them in the Studio.

The Managed private endpoint that targets SQL pool is called *synapse-ws-sql--\<workspacename\>* and the one that targets serverless SQL pool is called *synapse-ws-sqlOnDemand--\<workspacename\>*.

![Managed private endpoints for dedicated SQL pool and serverless SQL pool](./media/synapse-workspace-managed-private-endpoints/managed-pe-for-sql-1.png)

These two Managed private endpoints are automatically created for you when you create your Azure Synapse workspace. You aren't charged for these two Managed private endpoints.

## Next steps

To learn more, advance to the [Create Managed private endpoints to your data sources](./how-to-create-managed-private-endpoints.md) article.