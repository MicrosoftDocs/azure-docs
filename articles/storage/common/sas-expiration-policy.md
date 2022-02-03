---
title: Create an expiration policy for shared access signatures 
titleSuffix: Azure Storage
description: Create a policy on the storage account that defines the length of time that a shared access signature (SAS) should be valid. Learn how to monitor policy violations to remediate security risks. 
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 01/28/2022
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

## Check for SAS expiration policy violations

You can monitor your storage accounts with Azure Policy to ensure that storage accounts in your subscription have configured SAS expiration policies. Azure Storage provides a built-in policy for ensuring that accounts have this setting configured. For more information about the built-in policy, see **Storage accounts should have shared access signature (SAS) policies configured** in [List of built-in policy definitions](../../governance/policy/samples/built-in-policies.md#storage).

### Assign the built-in policy for a resource scope

Follow these steps to assign the built-in policy to the appropriate scope in the Azure portal:

1. In the Azure portal, search for *Policy* to display the Azure Policy dashboard.
1. In the **Authoring** section, select **Assignments**.
1. Choose **Assign policy**.
1. On the **Basics** tab of the **Assign policy** page, in the **Scope** section, specify the scope for the policy assignment. Select the **More** button to choose the subscription and optional resource group.
1. For the **Policy definition** field, select the **More** button, and enter *storage account keys* in the **Search** field. Select the policy definition named **Storage account keys should not be expired**.

    :::image type="content" source="media/sas-expiration-policy/policy-definition-select-portal.png" alt-text="Screenshot showing how to select the built-in policy to monitor validity intervals for shared access signatures for your storage accounts":::

1. Select **Review + create** to assign the policy definition to the specified scope.

    :::image type="content" source="media/sas-expiration-policy/policy-assignment-create.png" alt-text="Screenshot showing how to create the policy assignment":::

### Monitor compliance with the key expiration policy

To monitor your storage accounts for compliance with the key expiration policy, follow these steps:

1. On the Azure Policy dashboard, locate the built-in policy definition for the scope that you specified in the policy assignment. You can search for *Storage accounts should have shared access signature (SAS) policies configured* in the **Search** box to filter for the built-in policy.
1. Select the policy name with the desired scope.
1. On the **Policy assignment** page for the built-in policy, select **View compliance**. Any storage accounts in the specified subscription and resource group that do not meet the policy requirements appear in the compliance report.

    :::image type="content" source="media/sas-expiration-policy/policy-compliance-report-portal-inline.png" alt-text="Screenshot showing how to view the compliance report for the SAS expiration built-in policy" lightbox="media/sas-expiration-policy/policy-compliance-report-portal-expanded.png":::

To bring a storage account into compliance, configure a SAS expiration policy for that account, as described in [Create a SAS expiration policy](#create-a-sas-expiration-policy).

## See also

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](storage-sas-overview.md)
- [Create a service SAS](/rest/api/storageservices/create-service-sas)
- [Create a user delegation SAS](/rest/api/storageservices/create-user-delegation-sas)
- [Create an account SAS](/rest/api/storageservices/create-account-sas)
