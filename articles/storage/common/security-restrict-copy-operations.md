---
title: Permitted scope for copy operations (preview)
titleSuffix: Azure Storage
description: Learn how to use the "Permitted scope for copy operations (preview)" Azure storage account setting to limit the source accounts of copy operations to the same tenant or with private links to the same virtual network.
author: normesta
ms.author: normesta
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: how-to
ms.date: 01/10/2023
ms.reviewer: santoshc 
ms.custom: template-how-to, engagement-fy23
---

# Restrict the source of copy operations to a storage account

For security reasons, storage administrators might want to limit the environments from which data can be copied to secured accounts. Limiting the scope of permitted copy operations helps prevent the infiltration of unwanted data from untrusted tenants or virtual networks.

This article shows you how to limit the source accounts of copy operations to accounts within the same tenant as the destination account, or with private links to the same virtual network as the destination.

> [!IMPORTANT]
> **Permitted scope for copy operations** is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## About Permitted scope for copy operations (preview)

The **AllowedCopyScope** property of a storage account is used to specify the environments from which data can be copied to the destination account. It is displayed in the Azure portal as configuration setting **Permitted scope for copy operations (preview)**. The property is not set by default and does not return a value until you explicitly set it. It has three possible values:

- ***(null)*** (default): Allow copying from any storage account to the destination account.
- **Microsoft Entra ID**: Permits copying only from accounts within the same Microsoft Entra tenant as the destination account.
- **PrivateLink**:  Permits copying only from storage accounts that have private links to the same virtual network as the destination account.

The setting applies to [Copy Blob](/rest/api/storageservices/copy-blob) and [Copy Blob From URL](/rest/api/storageservices/copy-blob-from-url) operations. Examples of tools that use Copy Blob are AzCopy and Azure Storage Explorer.

When the source of a copy request does not meet the requirements specified by this setting, the request fails with HTTP status code 403 (Forbidden).

The **AllowedCopyScope** property is supported for storage accounts that use the Azure Resource Manager deployment model only. For information about which storage accounts use the Azure Resource Manager deployment model, see [Types of storage accounts](storage-account-overview.md#types-of-storage-accounts).

## Identify the source storage accounts of copy operations

Before changing the value of **AllowedCopyScope** for a storage account, identify users, applications or services that would be affected by the change. Depending on your findings, it might be necessary to adjust the setting to a scope that includes all of the desired copy sources, or to adjust the network or Microsoft Entra configuration for some of the source storage accounts.

Azure Storage logs capture details in Azure Monitor about requests made against the storage account, including the source and destination of copy operations. For more information, see [Monitor Azure Storage](../blobs/monitor-blob-storage.md). Enable and analyze the logs to identify copy operations that might be affected by changing **AllowedCopyScope** for the destination storage account.

### Create a diagnostic setting in the Azure portal

To log Azure Storage data with Azure Monitor and analyze it with Azure Log Analytics, you must first create a diagnostic setting that indicates the types of requests and for which storage services you want to log data. To create a diagnostic setting in the Azure portal, follow these steps:

1. Create a new Log Analytics workspace in the subscription that contains your Azure Storage account, or use an existing Log Analytics workspace. After you configure logging for your storage account, the logs will be available in the Log Analytics workspace. For more information, see [Create a Log Analytics workspace in the Azure portal](../../azure-monitor/logs/quick-create-workspace.md).
1. Navigate to your storage account in the Azure portal.
1. In the **Monitoring** section, select **Diagnostic settings**.
1. Select the Azure Storage service for which you want to log requests. For example, choose **blob** to log requests to Blob Storage.
1. Select **Add diagnostic setting**.
1. Provide a name for the diagnostic setting.
1. Under **Categories**, in the **Logs** section, choose **StorageRead**, **StorageWrite**, and **StorageDelete** to log all data requests to the selected service.
1. Under **Destination details**, select **Send to Log Analytics workspace**. Select your subscription and the Log Analytics workspace you created earlier, as shown in the following image, then select Save.

    :::image type="content" source="media\security-restrict-copy-operations\create-diagnostic-setting-logs.png" alt-text="Screenshot showing how to create a diagnostic setting for logging requests." lightbox="media\security-restrict-copy-operations\create-diagnostic-setting-logs.png":::

After you create the diagnostic setting, requests to the storage account are subsequently logged according to that setting. For more information, see [Create diagnostic setting to collect resource logs and metrics in Azure](../../azure-monitor/essentials/diagnostic-settings.md).

### Query logs for copy requests

Azure Storage logs include all requests to copy data to a storage account from another source. The log entries include the name of the destination storage account and the URI of the source object, along with information to help identify the client requesting the copy. For a complete reference of fields available in Azure Storage logs in Azure Monitor, see [Resource logs](../blobs/monitor-blob-storage-reference.md#resource-logs).

To retrieve logs for requests to copy blobs made in the last seven days, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. In the **Monitoring** section, select **Logs**.
1. Paste the following query into a new log query and run it. This query displays the source objects most frequently referenced in requests to copy data to the specified storage account. In the following example, replace the placeholder text *`<account-name>`* with your own storage account name.

    ```kusto
    StorageBlobLogs
    | where OperationName has "CopyBlobSource" and TimeGenerated > ago(7d) and AccountName == "<account-name>"
    | summarize count() by Uri, CallerIpAddress, UserAgentHeader
    ```

The results of the query should look similar to the following:

:::image type="content" source="media\security-restrict-copy-operations\log-query-results.png" alt-text="Screenshot showing how a Copy Blob Source log query might look." lightbox="media\security-restrict-copy-operations\log-query-results.png":::

The URI is the full path to the source object being copied, which includes the storage account name, the container name and the file name. From the list of URIs, determine whether the copy operations would be blocked if a specific **AllowedCopyScope** setting was applied.

You can also configure an alert rule based on this query to notify you about Copy Blob requests for the account. For more information, see [Create, view, and manage log alerts using Azure Monitor](../../azure-monitor/alerts/alerts-log.md).

## Restrict the Permitted scope for copy operations (preview)

When you are confident that you can safely restrict the sources of copy requests to a specific scope, you can set the **AllowedCopyScope** property for the storage account to that scope.

### Permissions for changing the Permitted scope for copy operations (preview)

To set the **AllowedCopyScope** property for the storage account, a user must have permissions to create and manage storage accounts. Azure role-based access control (Azure RBAC) roles that provide these permissions include the **Microsoft.Storage/storageAccounts/write** or **Microsoft.Storage/storageAccounts/\*** action. Built-in roles with this action include:

- The Azure Resource Manager [Owner](../../role-based-access-control/built-in-roles.md#owner) role
- The Azure Resource Manager [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role
- The [Storage Account Contributor](../../role-based-access-control/built-in-roles.md#storage-account-contributor) role

These roles do not provide access to data in a storage account via Microsoft Entra ID. However, they include the **Microsoft.Storage/storageAccounts/listkeys/action**, which grants access to the account access keys. With this permission, a user can use the account access keys to access all data in a storage account.

Role assignments must be scoped to the level of the storage account or higher to permit a user to restrict the scope of copy operations for the account. For more information about role scope, see [Understand scope for Azure RBAC](../../role-based-access-control/scope-overview.md).

Be careful to restrict assignment of these roles only to those who require the ability to create a storage account or update its properties. Use the principle of least privilege to ensure that users have the fewest permissions that they need to accomplish their tasks. For more information about managing access with Azure RBAC, see [Best practices for Azure RBAC](../../role-based-access-control/best-practices.md).

> [!NOTE]
> The classic subscription administrator roles Service Administrator and Co-Administrator include the equivalent of the Azure Resource Manager [Owner](../../role-based-access-control/built-in-roles.md#owner) role. The **Owner** role includes all actions, so a user with one of these administrative roles can also create and manage storage accounts. For more information, see [Azure roles, Microsoft Entra roles, and classic subscription administrator roles](../../role-based-access-control/rbac-and-directory-admin-roles.md#classic-subscription-administrator-roles).

### Configure the Permitted scope for copy operations (preview)

Using an account that has the necessary permissions, configure the permitted scope for copy operations in the Azure portal, with PowerShell or using the Azure CLI.

# [Azure portal](#tab/portal)

To configure the permitted scope for copy operations for an existing storage account in the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. Under **Settings**, select **Configuration**.
1. Set **Permitted scope for copy operations (preview)** to one of the following:

    - *From any storage account*
    - *From storage accounts in the same Microsoft Entra tenant*
    - *From storage accounts that have a private endpoint to the same virtual network*

    :::image type="content" source="media\security-restrict-copy-operations\portal-set-scope.png" alt-text="Screenshot showing how to disallow Shared Key access for a storage account." lightbox="media\security-restrict-copy-operations\portal-set-scope.png":::

1. Select **Save**.

# [PowerShell](#tab/azure-powershell)

To configure the permitted scope for copy operations for a new or existing storage account with PowerShell, install the [Az.Storage PowerShell module](https://www.powershellgallery.com/packages/Az.Storage), version 4.9.0 or later. Next, configure the **AllowedCopyScope** property for a new or existing storage account. The only supported values for the **allowedCopyScope** parameter are *Microsoft Entra ID* or *PrivateLink*. To set **AllowedCopyScope** to the default setting of *From any storage account*, you will need to change it in the Azure portal.

The following example shows how to set the **AllowedCopyScope** property for an existing storage account to allow copying data only from storage accounts within the same Microsoft Entra tenant. Replace the placeholder values in angle brackets (**\<\>**) with your own values:

```powershell
Set-AzStorageAccount -ResourceGroupName <resource-group> `
    -AccountName <storage-account> `
    -allowedCopyScope "AAD"
```

The following example shows how to set the **AllowedCopyScope** property for an existing storage account to allow copying data only from storage accounts with private links to the same virtual network. Replace the placeholder values in angle brackets (**\<\>**) with your own values:

```powershell
Set-AzStorageAccount -ResourceGroupName <resource-group> `
    -AccountName <storage-account> `
    -allowedCopyScope "PrivateLink"
```

# [Azure CLI](#tab/azure-cli)

To configure the permitted scope for copy operations for a new or existing storage account with the Azure CLI, perform the following steps:

1. Install the latest version of the Azure CLI. For more information, see [Install the Azure CLI](/cli/azure/install-azure-cli).
1. Install the Azure CLI storage preview extension using the command `az extension add -n storage-preview`.

    > [!IMPORTANT]
    > The Azure CLI storage preview extension adds support for features or arguments that are currently in PREVIEW.
    >
    > See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

1. Use the **allowed-copy-scope** argument of the `az storage account create` or `az storage account update` command to configure the **AllowedCopyScope** property for a new or existing storage account. The only supported values for the argument are *Microsoft Entra ID* or *PrivateLink*. To set **AllowedCopyScope** to the default setting of *From any storage account*, you will need to change it in the Azure portal.

The following example shows how to configure the **AllowedCopyScope** property for an existing storage account to allow copying data to the destination account only from storage accounts within the same Microsoft Entra tenant. Replace the placeholder values in angle brackets (**\<\>**) with your own values:

```azurecli
az storage account update \
    --name <storage-account> \
    --resource-group <resource-group> \
    --allowed-copy-scope "AAD"
```

The following example shows how to configure the permitted scope of copy operations for an existing storage account to allow copying data to the destination account only from storage accounts with private links to the same virtual network. Replace the placeholder values in angle brackets (**\<\>**) with your own values:

```azurecli
az storage account update \
    --name <storage-account> \
    --resource-group <resource-group> \
    --allowed-copy-scope "PrivateLink"
```

---

## Next steps

- [Require secure transfer to ensure secure connections](storage-require-secure-transfer.md)
- [Remediate anonymous read access to blob data (Azure Resource Manager deployments)](../blobs/anonymous-read-access-prevent.md)
- [Prevent Shared Key authorization for an Azure Storage account](shared-key-authorization-prevent.md)
