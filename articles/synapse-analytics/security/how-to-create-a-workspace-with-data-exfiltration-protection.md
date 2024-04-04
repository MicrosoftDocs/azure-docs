---
title: Create a workspace with data exfiltration protection enabled
description: This article will explain how to create a workspace with data exfiltration protection in Azure Synapse Analytics
author: WilliamDAssafMSFT 
ms.service: synapse-analytics 
ms.topic: how-to
ms.subservice: security 
ms.date: 09/19/2022 
ms.author: wiassaf
ms.reviewer: sngun
---

# Create a workspace with data exfiltration protection enabled

This article describes how to create a workspace with data exfiltration protection enabled and how to manage the approved Microsoft Entra tenants for this workspace.

> [!Note]
> You cannot change the workspace configuration for managed virtual network and data exfiltration protection after the workspace is created.

## Prerequisites
- Permissions to create a workspace resource in Azure.
- Synapse workspace permissions to create managed private endpoints.
- Subscriptions registered for the Networking resource provider. [Learn more.](../../azure-resource-manager/management/resource-providers-and-types.md)

Follow the steps listed in [Quickstart: Create a Synapse workspace](../quickstart-create-workspace.md) to get started with creating your workspace. Before creating your workspace, use the information below to add data exfiltration protection to your workspace.

## Add data exfiltration protection when creating your workspace
1. On the Networking tab, select the “Enable managed virtual network” checkbox.
1. Select “Yes” for the “Allow outbound data traffic only to approved targets” option.
1. Choose the approved Microsoft Entra tenants for this workspace.
1. Review the configuration and create the workspace.
:::image type="content" source="./media/how-to-create-a-workspace-with-data-exfiltration-protection/workspace-creation-data-exfiltration-protection.png" alt-text="Screenshot that shows a Create Synapse workspace with 'Enable manage virtual network' selected.":::

<a name='manage-approved-azure-active-directory-tenants-for-the-workspace'></a>

## Manage approved Microsoft Entra tenants for the workspace
1. From the workspace’s Azure portal, navigate to “Approved Microsoft Entra tenants”. The list of approved Microsoft Entra tenants for the workspace will be listed here. The workspace’s tenant is included by default and is not listed.
1. Use “+Add” to include new tenants to the approved list.
1. To remove a Microsoft Entra tenant from the approved list, select the tenant and select on “Delete” and then “Save”.
:::image type="content" source="./media/how-to-create-a-workspace-with-data-exfiltration-protection/workspace-manage-aad-tenant-list.png" alt-text="Create a workspace with data exfiltration protection":::


<a name='connecting-to-azure-resources-in-approved-azure-ad-tenants'></a>

## Connecting to Azure resources in approved Microsoft Entra tenants

You can create managed private endpoints to connect to Azure resources that reside in Microsoft Entra tenants, which are approved for a workspace. Follow the steps listed in the guide for [creating managed private endpoints](./how-to-create-managed-private-endpoints.md).

> [!IMPORTANT]
> Resources in tenants other than the workspace's tenant must not have blocking firewall rules in place for the SQL pools to connect to them. Resources within the workspace’s managed virtual network, such as Spark clusters, can connect over managed private links to firewall-protected resources.

## Known limitations
Users can provide an environment configuration file to install Python packages from public repositories like PyPI. In data exfiltration protected workspaces, connections to outbound repositories are blocked. As a result, Python libraries installed from public repositories like PyPI are not supported. 

As an alternative, users can upload workspace packages or create a private channel within their primary Azure Data Lake Storage account. For more information, visit [Package management in Azure Synapse Analytics](./spark/../../spark/apache-spark-azure-portal-add-libraries.md) 

Ingesting data [from an Event Hub into Data Explorer pools](../data-explorer/ingest-data/data-explorer-ingest-event-hub-one-click.md) will not work if your Synapse workspace uses a managed virtual network with data exfiltration protection enabled.
  
## Next steps

 - Learn more about [data exfiltration protection in Synapse workspaces](./workspace-data-exfiltration-protection.md)
 - Learn more about [Managed workspace Virtual Network](./synapse-workspace-managed-vnet.md)
 - Learn more about [Managed private endpoints](./synapse-workspace-managed-private-endpoints.md)
 - [Create Managed private endpoints to your data sources](./how-to-create-managed-private-endpoints.md)
