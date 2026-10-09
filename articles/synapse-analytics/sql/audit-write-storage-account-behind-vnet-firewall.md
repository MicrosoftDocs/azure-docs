---
title: Audit to a Storage Account Behind a Virtual Network and Firewall
titleSuffix: Azure Synapse Analytics
description: Configure Azure Synapse Analytics auditing to write database events to a storage account behind a virtual network or firewall.
author: sravanisaluru
ms.author: srsaluru
ms.reviewer: vanto
ms.date: 10/05/2026
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: how-to
ms.custom:
  - subject-rbac-steps
  - devx-track-arm-template
  - devx-track-azurepowershell
---

# Write audit logs to a storage account behind a virtual network and firewall in Azure Synapse Analytics

[!INCLUDE [synapse-fabric-migration](../includes/synapse-fabric-migration.md)]

Azure Synapse Analytics auditing supports writing database events to an [Azure Storage account](/azure/storage/common/storage-account-overview) behind a virtual network or firewall.

> [!IMPORTANT]
> When a storage account is behind a virtual network or firewall, you must use **managed identity** authentication (Storage Blob Data Contributor role), not storage access keys. The Azure portal configures this authentication automatically when you save your auditing settings. If you configure auditing by using REST API or PowerShell, don't specify a `storageAccountAccessKey`. The server's managed identity authenticates to the storage account instead.

## Background

[Azure Virtual Network (VNet)](/azure/virtual-network/virtual-networks-overview) is the fundamental building block for your private network in Azure. VNet enables many types of Azure resources, such as Azure Virtual Machines (VM), to securely communicate with each other, the internet, and on-premises networks. VNet is similar to a traditional network in your own data center, but it brings additional benefits of Azure infrastructure such as scale, availability, and isolation.

To learn more about the VNet concepts, best practices, and more, see [What is Azure Virtual Network](/azure/virtual-network/virtual-networks-overview).

To learn more about how to create a virtual network, see [Quickstart: Create a virtual network using the Azure portal](/azure/virtual-network/quick-create-portal).

## Prerequisites

- Use a general-purpose v2 storage account or a premium BlockBlobStorage account. To update an older account, see [Upgrade to a general-purpose v2 storage account](/azure/storage/common/storage-account-upgrade). 
- Premium storage with BlockBlobStorage is supported.
- Place the storage account in the same tenant and region as the Synapse SQL server.
- On the storage account networking page, enable **Allow Azure services on the trusted services list to access this storage account**.
- Grant the server's system-assigned managed identity the **Storage Blob Data Contributor** role on the storage account. You need `Microsoft.Authorization/roleAssignments/write` permission to create the role assignment.

If you enabled auditing before the storage account was behind a firewall, save the auditing settings again so that audit logs can resume writing to the account.

## Configure auditing in the Azure portal

1. In the [Azure portal](https://portal.azure.com), open the Synapse SQL server or SQL pool resource.
1. Under **Security**, select **Auditing**, and then enable auditing.
1. Select **Storage**, and choose the storage account that meets the prerequisites.
1. Open **Storage details** and verify that the portal indicates that managed identity authentication is used.

   > [!NOTE]
   > If the selected storage account is behind a virtual network, you see the following message:
   >
   >`You selected a storage account that's behind a firewall or in a virtual network. Using this storage requires to enable 'Allow trusted Microsoft services to access this storage account' on the storage account and creates a server managed identity with 'storage blob data contributor' RBAC.`
   >
   > If you don't see this message, the storage account isn't behind a virtual network.

1. Select a retention period, and then save the auditing settings.

When you save the settings, the portal grants the system-assigned identity the required storage role if you have permission to create role assignments.

## Configure auditing programmatically

When you configure auditing through PowerShell or the REST API, don't supply a storage account access key. Omitting the key causes the audit policy to use the server's system-assigned managed identity.

- PowerShell: [Set-AzSqlServerAudit](/powershell/module/az.sql/set-azsqlserveraudit) and [Set-AzSqlDatabaseAudit](/powershell/module/az.sql/set-azsqldatabaseaudit)
- REST API: [Server auditing settings - Create or update](/rest/api/sql/server-blob-auditing-policies/create-or-update) and [Database auditing settings - Create or update](/rest/api/sql/database-blob-auditing-policies/create-or-update)
- Azure Resource Manager: [Microsoft.Synapse workspaces/sqlPools/auditingSettings](/azure/templates/microsoft.synapse/workspaces/sqlpools/auditingsettings)

For details about identity behavior, see [Auditing using managed identity in Azure Synapse Analytics](auditing-managed-identity.md).

## Related content

- [Set up auditing for Azure Synapse Analytics](auditing-setup.md)
- [Auditing using managed identity in Azure Synapse Analytics](auditing-managed-identity.md)
- [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal)
