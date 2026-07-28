---
title: Data exfiltration protection for Azure Synapse Analytics
description: Learn how to use data exfiltration protection in Azure Synapse Analytics workspaces.
author: meenalsri
ms.service: azure-synapse-analytics
ms.topic: concept-article
ms.subservice: security 
ms.date: 02/10/2025
ms.author: mesrivas
---

# Data exfiltration protection for Azure Synapse Analytics workspaces

Azure Synapse Analytics workspaces support data exfiltration protection for workspaces. With exfiltration protection, you can guard against malicious insiders accessing your Azure resources and exfiltrating sensitive data to locations outside of your organization's scope.

## Secure data egress from Synapse workspaces

At the time of workspace creation, you can choose to configure the workspace with a managed virtual network and additional protection against data exfiltration. When a workspace is created with a [managed virtual network](./synapse-workspace-managed-vnet.md), data integration and Spark resources are deployed in the managed virtual network. The workspace's dedicated SQL pools and serverless SQL pools have multitenant capabilities and as such, need to exist outside the managed virtual network.

For workspaces with data exfiltration protection, resources within the managed virtual network always communicate over [managed private endpoints](./synapse-workspace-managed-private-endpoints.md). When data exfiltration protection is enabled, Synapse SQL resources can connect to and query any authorized Azure Storage using OPENROWSETS or EXTERNAL TABLE. Data exfiltration protection doesn't control ingress traffic.

However, data exfiltration protection does control egress traffic. For example, [CREATE EXTERNAL TABLE AS SELECT](/sql/t-sql/statements/create-external-table-as-select-transact-sql?view=azure-sqldw-latest&preserve-view=true) or using ERRORFILE argument in [COPY INTO](/sql/t-sql/statements/copy-into-transact-sql?view=azure-sqldw-latest&preserve-view=true) command to output data to the external storage account are blocked. Therefore, you need to create a managed private endpoint for the target storage account to unblock the egress traffic to it.

> [!NOTE]
> You can't change the workspace configuration for managed virtual network and data exfiltration protection after the workspace is created.

## Manage Synapse workspace data egress to approved targets

After the workspace is created with data exfiltration protection enabled, the owners of the workspace resource can manage the list of approved Microsoft Entra tenants for the workspace. Users with the [right permissions](./synapse-workspace-access-control-overview.md) on the workspace can use the Synapse Studio to create managed private endpoint connection requests to resources in the workspace’s approved Microsoft Entra tenants. Managed private endpoint creation is blocked if the user attempts to create a private endpoint connection to a resource in an unapproved tenant.

## Sample workspace with data exfiltration protection enabled

Consider the following example that illustrates data exfiltration protection for Synapse workspaces. A company called Contoso has Azure resources in Tenant A and Tenant B, and there's a need for these resources to connect securely. A Synapse workspace has been created in Tenant A with Tenant B added as an approved Microsoft Entra tenant.

The following diagram shows private endpoint connections to Azure Storage accounts in Tenant A and Tenant B that are approved by the storage account owners. The diagram also shows blocked private endpoint creation. The creation of this private endpoint was blocked as it targeted an Azure Storage account in the Fabrikam Microsoft Entra tenant, which isn't an approved Microsoft Entra tenant for Contoso's workspace.

:::image type="content" source="media/workspace-data-exfiltration-protection/workspace-data-exfiltration-protection-diagram.png" alt-text="Diagram showing how data exfiltration protection is implemented for Synapse workspaces." lightbox="./media/workspace-data-exfiltration-protection/workspace-data-exfiltration-protection-diagram.png":::

>[!IMPORTANT]
> Resources in tenants other than the workspace's tenant must not have firewall rules that block connection to the SQL pools. Resources within the workspace's managed virtual network, such as Spark clusters, can connect over managed private links to firewall-protected resources.

## Related content

- [Create a workspace with data exfiltration protection enabled](./how-to-create-a-workspace-with-data-exfiltration-protection.md)
- [Azure Synapse Analytics Managed Virtual Network](./synapse-workspace-managed-vnet.md)
- [Azure Synapse Analytics managed private endpoints](./synapse-workspace-managed-private-endpoints.md)
- [Create a Managed private endpoint to your data source](./how-to-create-managed-private-endpoints.md)
