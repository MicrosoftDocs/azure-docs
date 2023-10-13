---
title: Data exfiltration protection for Azure Synapse Analytics workspaces
description: This article will explain data exfiltration protection in Azure Synapse Analytics
author: WilliamDAssafMSFT 
ms.service: synapse-analytics 
ms.topic: conceptual
ms.subservice: security 
ms.date: 10/17/2022
ms.author: wiassaf
ms.reviewer: sngun
---
# Data exfiltration protection for Azure Synapse Analytics workspaces
This article will explain data exfiltration protection in Azure Synapse Analytics

## Securing data egress from Synapse workspaces
Azure Synapse Analytics workspaces support enabling data exfiltration protection for workspaces. With exfiltration protection, you can guard against malicious insiders accessing your Azure resources and exfiltrating sensitive data to locations outside of your organization’s scope. 
At the time of workspace creation, you can choose to configure the workspace with a managed virtual network and additional protection against data exfiltration. When a workspace is created with a [managed virtual network](./synapse-workspace-managed-vnet.md), Data integration and Spark resources are deployed in the managed virtual network. The workspace’s dedicated SQL pools and serverless SQL pools have multi-tenant capabilities and as such, need to exist outside the managed virtual network. For workspaces with data exfiltration protection, resources within the managed virtual network always communicate over [managed private endpoints](./synapse-workspace-managed-private-endpoints.md) and the Synapse SQL resources can only connect to authorized Azure resources (targets of approved managed private endpoint connections from the workspace). 

> [!Note]
> You cannot change the workspace configuration for managed virtual network and data exfiltration protection after the workspace is created.

## Managing Synapse workspace data egress to approved targets
After the workspace is created with data exfiltration protection enabled, the owners of the workspace resource can manage the list of approved Microsoft Entra tenants for the workspace. Users with the [right permissions](./synapse-workspace-access-control-overview.md) on the workspace can use the Synapse Studio to create managed private endpoint connection requests to resources in the workspace’s approved Microsoft Entra tenants. Managed private endpoint creation will be blocked if the user attempts to create a private endpoint connection to a resource in an unapproved tenant.

## Sample workspace with data exfiltration protection enabled
Let us use an example to illustrate data exfiltration protection for Synapse workspaces. Contoso has Azure resources in Tenant A and Tenant B and there is a need for these resources to connect securely. A Synapse workspace has been created in Tenant A with Tenant B added as an approved Microsoft Entra tenant. The diagram shows private endpoint connections to Azure Storage accounts in Tenant A and Tenant B that have been approved by the Storage account owners. The diagram also shows blocked private endpoint creation. The creation of this private endpoint was blocked as it targeted an Azure Storage account in the Fabrikam Microsoft Entra tenant, which is not an approved Microsoft Entra tenant for Contoso’s workspace.

:::image type="content" source="media/workspace-data-exfiltration-protection/workspace-data-exfiltration-protection-diagram.png" alt-text="This diagram shows how data exfiltration protection is implemented for Synapse workspaces" lightbox="./media/workspace-data-exfiltration-protection/workspace-data-exfiltration-protection-diagram.png":::

>[!IMPORTANT]
>
> Resources in tenants other than the workspace's tenant must not have blocking firewall rules in place for the SQL pools to connect to them. Resources within the workspace’s managed virtual network, such as Spark clusters, can connect over managed private links to firewall-protected resources.
> >

## Next Steps

Learn how to [create a workspace with data exfiltration protection enabled](./how-to-create-a-workspace-with-data-exfiltration-protection.md)

Learn more about [Managed workspace Virtual Network](./synapse-workspace-managed-vnet.md)

Learn more about [Managed private endpoints](./synapse-workspace-managed-private-endpoints.md)

[Create Managed private endpoints to your data sources](./how-to-create-managed-private-endpoints.md)
