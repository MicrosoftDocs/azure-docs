---
title: Limit the source accounts for Azure Storage Account copy operations to accounts in the same tenant or on the same virtual network
titleSuffix: Azure Storage
description: Learn how to use the "Permitted scope for copy operations (preview)" Azure storage account setting to limit the source accounts of copy operations to the same tenant or with private links to the same virtual network.
author: jimmart-dev
ms.author: jammart
ms.service: storage
ms.topic: how-to
ms.date: 11/28/2022
ms.reviewer: santoshc 
ms.custom: template-how-to
---

# Restrict the source tenant or virtual network of copy operations

For security reasons, storage administrators might want to limit the environments from which data can be copied to secured accounts. Limiting the scope of permitted copy operations helps prevent the infiltration of unwanted data from untrusted tenants or virtual networks.

The **allowedCopyScope** property of a storage account defines the environments from which data can be copied to the account. The property is not set by default and does not return a value until you explicitly set it. The property has three possible settings:

- ***(not defined)***: Defaults to allowing copying from any storage account.
- **AAD**: Permits copying only from accounts in the same Azure AD tenant as the destination account.
- **PrivateLink**:  Permits copying only from storage accounts that have private links to the same virtual network as the destination account.

When the source of a copy request does not meet the requirements you specify, the request fails with HTTP status code 403 and error message "This request is not authorized to perform this operation."

This article shows you how to limit the source accounts of copy operations to accounts in the same tenant as the destination account, or with private links to the same virtual network as the destination.

The **allowedCopyScope** property is supported for storage accounts that use the Azure Resource Manager deployment model only. For information about which storage accounts use the Azure Resource Manager deployment model, see [Types of storage accounts](storage-account-overview.md#types-of-storage-accounts).

> [!IMPORTANT]
> **Permitted scope for copy operations** is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Identify the source storage accounts of copy operations

Before changing the value of **allowedCopyScope** for a storage account, identify users, applications or services that would be affected by the change. Depending on your findings, it might be necessary to adjust the setting to a scope that includes all of the desired copy sources, or to adjust the network or Azure AD configuration for some of the source storage accounts.

Azure Storage logs capture details in Azure Monitor about requests made against the storage account, including the source and destination of copy operations. For more information, see [Monitor Azure Storage](../blobs/monitor-blob-storage.md). Enable and analyze the logs to identify copy operations that might be affected by changing **allowedCopyScope** for the destination storage account.

### Create a diagnostic setting in the Azure portal

To log Azure Storage data with Azure Monitor and analyze it with Azure Log Analytics, you must first create a diagnostic setting that indicates what types of requests and for which storage services you want to log data. To create a diagnostic setting in the Azure portal, follow these steps:

1. Create a new Log Analytics workspace in the subscription that contains your Azure Storage account, or use an existing Log Analytics workspace. After you configure logging for your storage account, the logs will be available in the Log Analytics workspace. For more information, see [Create a Log Analytics workspace in the Azure portal](../../azure-monitor/logs/quick-create-workspace.md).
1. Navigate to your storage account in the Azure portal.
1. In the Monitoring section, select **Diagnostic settings**.
1. Select the Azure Storage service for which you want to log requests. For example, choose **blob** to log requests to Blob storage.
1. Select **Add diagnostic setting**.
1. Provide a name for the diagnostic setting.
1. Under **Category details**, in the **log** section, choose **StorageRead**, **StorageWrite**, and **StorageDelete** to log all data requests to the selected service.
1. Under **Destination details**, select **Send to Log Analytics**. Select your subscription and the Log Analytics workspace you created earlier, as shown in the following image.

    :::image type="content" source="media\security-restrict-copy-operations\create-diagnostic-setting-logs.png" alt-text="Screenshot showing how to create a diagnostic setting for logging requests." lightbox="media\security-restrict-copy-operations\create-diagnostic-setting-logs.png":::

After you create the diagnostic setting, requests to the storage account are subsequently logged according to that setting. For more information, see [Create diagnostic setting to collect resource logs and metrics in Azure](../../azure-monitor/essentials/diagnostic-settings.md).

For a reference of fields available in Azure Storage logs in Azure Monitor, see [Resource logs](../blobs/monitor-blob-storage-reference.md#resource-logs).

### Query logs for copy requests

Azure Storage logs include all requests to copy data to a storage account from another source. The log entries include the name of the destination storage account and the URI of the source object. To retrieve logs for copy requests made in the last seven days that were authorized with Shared Key or SAS, open your Log Analytics workspace. Next, paste the following query into a new log query and run it. This query displays the ten IP addresses that most frequently sent requests that were authorized with Shared Key or SAS:

```kusto
StorageBlobLogs
| where OperationName has "CopyBlobSource"
| summarize count() by AccountName, Uri, CallerIpAddress, UserAgentHeader
```

The URI field is the full path to the source object being copied, which includes the storage account name, the container name and the file name. From the list of URIs, determine whether the copy operations would be blocked if an allowedCopyScope setting was applied.

You can also configure an alert rule based on this query to notify you about requests authorized with Shared Key or SAS. For more information, see [Create, view, and manage log alerts using Azure Monitor](../../azure-monitor/alerts/alerts-log.md).

## Restrict the permitted scope for copy operations

When you are confident that you can safely restrict the sources of copy requests to a specific scope, you can set the **allowedCopyScope** property for the storage account to that scope.

### Permissions for changing the permitted scope for copy operations

To set the **allowedCopyScope** property for the storage account, a user must have permissions to create and manage storage accounts. Azure role-based access control (Azure RBAC) roles that provide these permissions include the **Microsoft.Storage/storageAccounts/write** or **Microsoft.Storage/storageAccounts/\*** action. Built-in roles with this action include:

- The Azure Resource Manager [Owner](../../role-based-access-control/built-in-roles.md#owner) role
- The Azure Resource Manager [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role
- The [Storage Account Contributor](../../role-based-access-control/built-in-roles.md#storage-account-contributor) role

These roles do not provide access to data in a storage account via Azure Active Directory (Azure AD). However, they include the **Microsoft.Storage/storageAccounts/listkeys/action**, which grants access to the account access keys. With this permission, a user can use the account access keys to access all data in a storage account.

Role assignments must be scoped to the level of the storage account or higher to permit a user to allow or disallow Shared Key access for the account. For more information about role scope, see [Understand scope for Azure RBAC](../../role-based-access-control/scope-overview.md).

Be careful to restrict assignment of these roles only to those who require the ability to create a storage account or update its properties. Use the principle of least privilege to ensure that users have the fewest permissions that they need to accomplish their tasks. For more information about managing access with Azure RBAC, see [Best practices for Azure RBAC](../../role-based-access-control/best-practices.md).

> [!NOTE]
> The classic subscription administrator roles Service Administrator and Co-Administrator include the equivalent of the Azure Resource Manager [Owner](../../role-based-access-control/built-in-roles.md#owner) role. The **Owner** role includes all actions, so a user with one of these administrative roles can also create and manage storage accounts. For more information, see [Classic subscription administrator roles, Azure roles, and Azure AD administrator roles](../../role-based-access-control/rbac-and-directory-admin-roles.md#classic-subscription-administrator-roles).

### Configure the permitted scope for copy operations

Using an account that has the necessary permissions, configure the permitted scope for copy operations in the Azure portal, with PowerShell or using the Azure CLI.

# [Azure portal](#tab/portal)

To configure the permitted scope for copy operations for an existing storage account in the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. Under **Settings**, select **Configuration**.
1. Set **Permitted scope for copy operations (preview)** to one of the following:

    - ***From any storage account***
    - ***From storage accounts in the same Azure AD tenant***
    - ***From storage accounts that have a private link to the same virtual network***

    :::image type="content" source="media\security-restrict-copy-operations\portal-set-scope.png" alt-text="Screenshot showing how to disallow Shared Key access for a storage account." lightbox="media\security-restrict-copy-operations\portal-set-scope.png":::

# [PowerShell](#tab/azure-powershell)

To configure the permitted scope for copy operations for a new or existing storage account with PowerShell, install the [Az.Storage PowerShell module](https://www.powershellgallery.com/packages/Az.Storage), version 3.4.0 or later. Next, configure the **allowedCopyScope** property for a new or existing storage account.

The following example shows how to set the **allowedCopyScope** property for an existing storage account to allow copying data only from storage accounts with private links to the same virtual network. Remember to replace the placeholder values in brackets with your own values:

```powershell
Set-AzStorageAccount -ResourceGroupName <resource-group> `
    -AccountName <storage-account> `
    -allowedCopyScope "PrivateLink"
```

The following example shows how to set the **allowedCopyScope** property for an existing storage account to allow copying data only from storage accounts within the same Azure AD tenant. Remember to replace the placeholder values in brackets with your own values:

```powershell
Set-AzStorageAccount -ResourceGroupName <resource-group> `
    -AccountName <storage-account> `
    -allowedCopyScope "AAD"
```

# [Azure CLI](#tab/azure-cli)

To configure the permitted scope for copy operations for a new or existing storage account with Azure CLI, install Azure CLI version 2.20.0 or later. For more information, see [Install the Azure CLI](/cli/azure/install-azure-cli). Next, configure the **allowed-copy-scope** property for a new or existing storage account.

The following example shows how to configure the permitted scope of copy operations for an existing storage account to allow copying data only from storage accounts within the same Azure AD tenant. Remember to replace the placeholder values in brackets with your own values:

```azurecli-interactive
az storage account update \
    --name <storage-account> \
    --resource-group <resource-group> \
    --allowed-copy-scope "AAD"
```

---

The following example shows how to configure the permitted scope of copy operations for an existing storage account to allow copying data only from storage accounts with private links to the same virtual network. Remember to replace the placeholder values in brackets with your own values:

```azurecli-interactive
az storage account update \
    --name <storage-account> \
    --resource-group <resource-group> \
    --allowed-copy-scope "PrivateLink"
```

---

## Next steps
<!-- Add a context sentence for the following links 
- [Write how-to guides](contribute-how-to-write-howto.md)
- [Links](links-how-to.md)
-->
