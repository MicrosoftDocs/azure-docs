---
title: Create an expiration policy for shared access signatures 
titleSuffix: Azure Storage
description: Create a policy on the storage account that defines the length of time that a shared access signature (SAS) should be valid. Learn how to monitor policy violations to remediate security risks. 
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 09/14/2021
ms.author: tamram
ms.reviewer: dineshm
ms.subservice: common

---

# Create an expiration policy for shared access signatures

You can use a shared access signature (SAS) to delegate access to resources in your Azure Storage account. A SAS token includes the targeted resource, the permissions granted, and the interval over which access is permitted. Best practices recommend that you limit the interval for a SAS in case it is compromised. By setting a SAS expiration policy for your storage accounts, you can provide a recommended upper expiration limit when a user creates a SAS.

A SAS expiration policy does not prevent a user from creating a SAS with an expiration that exceeds the limit recommended by the policy. When a user creates a SAS that violates the policy, they'll see a warning, together with the recommended maximum interval. If you have configured a diagnostic setting for logging with Azure Monitor, then Azure Storage writes to a property in the logs whenever a user creates a SAS that expires after the recommended interval.

For more information about shared access signatures, see [Grant limited access to Azure Storage resources using shared access signatures (SAS)](storage-sas-overview.md).

## Create a SAS expiration policy

When you create a SAS expiration policy on a storage account, the policy applies to each type of SAS that you can create on that storage account, including a service SAS, user delegation SAS, or account SAS.

To configure a SAS expiration policy for a storage account, use the Azure portal, PowerShell, or Azure CLI.

### [Azure portal](#tab/azure-portal)

To create a SAS expiration policy in the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. Under **Settings**, select **Configuration**.
1. Locate the setting for **Allow recommended upper limit for shared access signature (SAS) expiry interval**, and set it to **Enabled**.
1. Specify the recommended interval for any new shared access signatures that are created on resources in this storage account.

    :::image type="content" source="media/sas-expiration-policy/configure-sas-expiration-policy-portal.png" alt-text="Screenshot showing how to configure a SAS expiration policy in the Azure portal":::

1. Select the **Save** button to save your changes.

### [PowerShell](#tab/azure-powershell)

To create a SAS expiration policy, use the [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount) command, and then set the `-SasExpirationPeriod` parameter to the number of days, hours, minutes, and seconds that a SAS token can be active from the time that a SAS is signed. The string that you provide the `-SasExpirationPeriod` parameter uses the following format: `<days>.<hours>:<minutes>:<seconds>`. For example, if you wanted the SAS to expire 1 day, 12 hours, 5 minutes, and 6 seconds after it is signed, then you would use the string `1.12:05:06`.

```powershell
$account = Set-AzStorageAccount -ResourceGroupName <resource-group> `
    -Name <storage-account-name> `
    -SasExpirationPeriod <days>.<hours>:<minutes>:<seconds>
```

> [!TIP]
> You can also set the SAS expiration policy as you create a storage account by setting the `-SasExpirationPeriod` parameter of the [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) command.

To verify that the policy has been applied, use the `SasPolicy` property of the [PSStorageAccount](/dotnet/api/microsoft.azure.commands.management.storage.models.psstorageaccount) returned to the `$account` variable in the previous command. 
  
```powershell
$account.SasPolicy
```

The SAS expiration period appears in the console output.

> [!div class="mx-imgBorder"]
> ![SAS expiration period](./media/storage-sas-expiration-policy/sas-policy-console-output.png)

### [Azure CLI](#tab/azure-cli)

To create a SAS expiration policy, use the [az storage account update](/cli/azure/storage/account#az_storage_account_update) command, and then set the `--key-exp-days` parameter to the number of days, hours, minutes, and seconds that a SAS token can be active from the time that a SAS is signed. The string that you provide the `--key-exp-days` parameter uses the following format: `<days>.<hours>:<minutes>:<seconds>`. For example, if you wanted the SAS to expire 1 day, 12 hours, 5 minutes, and 6 seconds after it is signed, then you would use the string `1.12:05:06`.

```azurecli-interactive
az storage account update \
  --name <storage-account> \
  --resource-group <resource-group> \
  --sas-exp <days>.<hours>:<minutes>:<seconds>
```

> [!TIP]
> You can also set the SAS expiration policy as you create a storage account by setting the `--key-exp-days` parameter of the [az storage account create](/cli/azure/storage/account#az_storage_account_create) command.

To verify that the policy has been applied, call the [az storage account show](/cli/azure/storage/account#az_storage_account_show) command, and use the string `{SasPolicy:sasPolicy}` for the `-query` parameter.
  
```azurecli-interactive
az storage account show \
  --name <storage-account> \
  --resource-group <resource-group> \
  --query "{SasPolicy:sasPolicy}"
```

The SAS expiration period appears in the console output.

```json
{
  "SasPolicy": {
    "expirationAction": "Log",
    "sasExpirationPeriod": "1.12:05:06"
  }
}
```

---

## Query logs for policy violations

To log the creation of a SAS that is valid over a longer interval than the SAS expiration policy recommends, first create a diagnostic setting that sends logs to an Azure Log Analytics workspace. For more information, see [Send logs to Azure Log Analytics](../blobs/monitor-blob-storage.md#send-logs-to-azure-log-analytics).

Next, use an Azure Monitor log query to determine whether a SAS has expired. Create a new query in your Log Analytics workspace, add the following query text, and press **Run**.

```kusto
StorageBlobLogs | where SasExpiryStatus startswith "Policy Violated" 
```

## See also

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](storage-sas-overview.md)
- [Create a service SAS](/rest/api/storageservices/create-service-sas)
- [Create a user delegation SAS](/rest/api/storageservices/create-user-delegation-sas)
- [Create an account SAS](/rest/api/storageservices/create-account-sas)