---
title: Auditing Using Managed Identity
titleSuffix: Azure Synapse Analytics
description: Configure a system-assigned managed identity for Azure Synapse Analytics auditing to Azure Storage.
author: sravanisaluru
ms.author: srsaluru
ms.reviewer: vanto
ms.date: 10/05/2026
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: how-to
---

# Auditing by using managed identity in Azure Synapse Analytics

[!INCLUDE [synapse-fabric-migration](../includes/synapse-fabric-migration.md)]

Configure auditing to use a **Storage account** with two authentication methods:

- Managed Identity
- Storage Access Keys

**Managed Identity** can be a system-assigned managed identity (SMI) or user-assigned managed identity (UMI).

To configure writing audit logs to a storage account, go to the [Azure portal](https://portal.azure.com), and select your server. Select **Storage** in the **Auditing** menu. Select the Azure storage account where logs are saved.

By default, the identity used is the primary user identity assigned to the server. If there's no user identity, the server creates a system-assigned managed identity and uses it for authentication.

Select the retention period by opening the **Advanced properties**. Then select **Save**. Logs older than the retention period are deleted.

> [!NOTE]  
> To set up managed identity-based auditing on Azure Synapse Analytics, see the [Configure system-assigned managed identity for Azure Synapse Analytics auditing](#configure-system-assigned-managed-identity-for-azure-synapse-analytics-auditing) section later in this article.

## User-assigned managed identity

UMI gives you flexibility to create and maintain your own UMI for a given tenant. You manage UMI, compared to a system-assigned managed identity, which identity is uniquely defined per server, and assigned by the system.

## Configure user-assigned managed identity for auditing

Before you can set up auditing to send logs to your storage account, the managed identity assigned to the server needs the [Storage Blob Data Contributor](/azure/role-based-access-control/built-in-roles#storage-blob-data-contributor) role assignment. This assignment is required if you're configuring auditing by using PowerShell, the Azure CLI, REST API, or ARM templates. The Azure portal automatically assigns the role when you configure auditing through the portal, so you don't need to follow these steps if you're using the portal.

1. Go to the [Azure portal](https://portal.azure.com).
1. Create a user-assigned managed identity if you don't already have one. For more information, see [creating user assigned identity](authentication-azure-ad-user-assigned-managed-identity.md#create-a-user-assigned-managed-identity).
1. Go to your storage account that you want to configure for auditing.
1. Select the **Access Control (IAM)** menu.
1. Select **Add** > **Add role assignment**.
1. In the **Role** tab, search for and select **Storage Blob Data Contributor**. Select **Next**.
1. In the **Members** tab, select **Managed identity** in the **Assign access to** section, and then **Select members**. You can select the **Managed identity** that you created for your server.
1. Select **Review + assign**.

For more information, see [Assign Azure roles using portal](/azure/role-based-access-control/role-assignments-portal).

Use the following instructions to configure auditing by using a user-assigned managed identity.

# [Portal](#tab/azure-portal)

1. Go to the **Identity** menu for your server. Under the **User assigned managed identity** section, **Add** the managed identity.
1. Select the added managed identity as the **Primary identity** for your server.
1. Go to the **Auditing** menu for the server. Select **Managed Identity** as the **Storage Authentication Type** when configuring the **Storage** for your server.

# [The Azure CLI](#tab/azure-cli)

To use a managed identity, pass the `--storage-key` parameter as an empty string to use the primary managed identity assigned to the server when configuring auditing. Here's a sample command:

```azurecli 
az SQL server audit-policy update -g "sampleresourcegroup" -n "sampleauditingtestserver" --state Enabled --bsts Enabled --storage-endpoint https://<storageaccountname>.blob.core.windows.net --storage-key '""'
```

For more information, see [az sql server audit-policy](/cli/azure/sql/server/audit-policy).

# [PowerShell](#tab/azure-powershell)

To use a managed identity, pass the `UseIdentity` parameter as `True` to use the primary managed identity assigned to the server. Here's a sample command:

```powershell
Set-AzSqlServerAudit -ResourceGroupName "sampleresourcegroup" -ServerName "sampleauditingtestserver" -BlobStorageTargetState Enabled -StorageAccountResourceId "/subscriptions/<SubscriptionID>/resourcegroups/sampleresourcegroup/providers/Microsoft.Storage/storageAccounts/auditingteststorageacc" -UseIdentity True
```

For more information, see [Set-AzSqlServerAudit](/powershell/module/az.sql/set-azsqlserveraudit).

# [REST API](#tab/rest-api)

To use the primary managed identity, skip passing the parameter `storageAccountAccessKey` in the request:

```rest
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Sql/servers/{serverName}/auditingSettings/default?api-version=2017-03-01-preview

{
  "properties": {
    "state": "Enabled",
    "storageEndpoint": "https://mystorage.blob.core.windows.net"
  }
}
```

For more information, see [Server Auditing Settings - Create Or Update](/rest/api/sql/server-blob-auditing-policies/create-or-update).

---

> [!NOTE] 
> When you configure auditing by using a managed identity, copying the database to a new server or creating a geo-replica might break audit logging. This condition occurs because the new server has a different managed identity, which might not have access to the audit storage account. Ensure the new server's identity has appropriate permissions to maintain audit continuity.

## Configure system-assigned managed identity for Azure Synapse Analytics auditing

You can't use UMI-based authentication to a storage account for auditing. Only system-assigned managed identity (SMI) can be used for Azure Synapse Analytics. For SMI authentication to work, the managed identity must have the **Storage Blob Data Contributor** role assigned to it in the storage account's **Access Control** settings. This role is automatically added if you use the Azure portal to configure auditing.

In the Azure portal for Azure Synapse Analytics, there's no option to explicitly choose SAS key or SMI authentication.

- If the storage account is behind a VNet or firewall, the system automatically configures auditing by using SMI authentication.

- If the storage account isn't behind a VNet or firewall, the system automatically configures auditing by using SAS key-based authentication. However, you can't use managed identity if the storage account isn't behind a VNet or firewall.

To force the use of SMI authentication, regardless of whether the storage account is behind a VNet or firewall, use REST API or PowerShell, as follows:

- If you're using the REST API, omit the `StorageAccountAccessKey` field explicitly in the request body.

  For more information, see:

  - [Server Blob Auditing Policies - Create Or Update - REST API (Azure SQL Database)](/rest/api/sql/server-blob-auditing-policies/create-or-update)
  - [Database Blob Auditing Policies - Create Or Update - REST API (Azure SQL Database)](/rest/api/sql/database-blob-auditing-policies/create-or-update)

- If you're using PowerShell, pass the `UseIdentity` parameter as `true`.

  For more information, see:

  - [Set-AzSqlServerAudit (Az.Sql)](/powershell/module/az.sql/set-azsqlserveraudit)
  - [Set-AzSqlDatabaseAudit (Az.Sql)](/powershell/module/az.sql/set-azsqldatabaseaudit)

## Related content

- [Auditing in Azure Synapse Analytics](auditing-overview.md)
- [Write audit logs to a storage account behind a virtual network and firewall](audit-write-storage-account-behind-vnet-firewall.md)
- [Set up auditing for Azure Synapse Analytics](auditing-setup.md)
