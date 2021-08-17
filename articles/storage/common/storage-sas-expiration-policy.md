---
title: Create an expiration policy for SAS in Azure Storage (preview)
titleSuffix: Azure Storage
description: Create a policy that defines the length of time that a Shared access signature (SAS) can be valid. Monitor policy violations to better secure SAS. 
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 08/16/2021
ms.author: tamram
ms.reviewer: ozgun
ms.subservice: common

---

# Create an expiration policy for shared access signatures (SAS) in Azure Storage (preview)

You can better monitor, and then govern the use of a SAS by creating a SAS expiration policy. This policy specifies how long a SAS should be active. In the current release, you can set the expiration policy, and then monitor for policy violations by using Azure Monitor log queries. Use [SAS best practices](storage-sas-overview.md#best-practices-when-using-sas) to help bring your SAS into compliance with your policy.

> [!IMPORTANT]
> SAS expiration policies are currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

### Create a SAS expiry policy

#### [PowerShell](#tab/azure-powershell)

To create a SAS expiration policy, use the [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount) command, and then set the `-SasExpirationPeriod` parameter to the number of days, hours, minutes, and seconds that a SAS token can be active from the time that a SAS is signed. The string that you provide the `-SasExpirationPeriod` parameter uses the following format `<days>.<hours>:<minutes>:<seconds>`. For example, if you wanted the SAS to expire 1 day, 12 hours, 5 minutes, and 6 seconds after it is signed, then you would use the string `1.12:05:06`.


```powershell
$account = Set-AzStorageAccount -ResourceGroupName <resource-group> -Name `
    <storage-account-name>  -SasExpirationPeriod <days>.<hours>:<minutes>:<seconds>
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


#### [Azure CLI](#tab/azure-cli)

To create a SAS expiration policy, use the [az storage account update](/cli/azure/storage/account#az_storage_account_update) command, and then set the `--key-exp-days` parameter to the number of days, hours, minutes, and seconds that a SAS token can be active from the time that a SAS is signed. The string that you provide the `--key-exp-days` parameter uses the following format `<days>.<hours>:<minutes>:<seconds>`. For example, if you wanted the SAS to expire 1 day, 12 hours, 5 minutes, and 6 seconds after it is signed, then you would use the string `1.12:05:06`.


```azurecli-interactive
az storage account update \
  -n <storage-account-name> \
  -g <resource-group> --sas-exp <days>.<hours>:<minutes>:<seconds>
```

> [!TIP]
> You can also set the SAS expiration policy as you create a storage account by setting the `--key-exp-days` parameter of the [az storage account create](/cli/azure/storage/account#az_storage_account_create) command.

To verify that the policy has been applied, call the [az storage account show](/cli/azure/storage/account#az_storage_account_show) command, and use the string `{SasPolicy:sasPolicy}` for the `-query` parameter.
  
```azurecli-interactive
az storage account show \
  -n <storage-account-name> \
  -g <resource-group-name> \
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

### Query for policy violations

If you create a diagnostic setting that [sends logs to Azure Log Analytics](../blobs/monitor-blob-storage.md#send-logs-to-azure-log-analytics) workspace, then you can use an Azure Monitor log query to determine whether a SAS has expired. 

To determine if a SAS has expired, enter the following query in the **Log search** bar.

```Kusto
StorageBlobLogs | where KeyExpiryStatus startsWith "Policy Violated" 
```

## See also

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](storage-sas-overview.md)
- [Define a stored access policy](/rest/api/storageservices/define-stored-access-policy)
- [Configure Azure Storage connection strings](storage-configure-connection-string.md)