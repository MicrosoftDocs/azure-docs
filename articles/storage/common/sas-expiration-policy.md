---
title: Configure an expiration policy for shared access signatures (SAS)
titleSuffix: Azure Storage
description: Configure a policy on the storage account that defines the length of time that a shared access signature (SAS) should be valid. Learn how to monitor policy violations to remediate security risks. 
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.service: azure-storage
ms.topic: how-to
ms.date: 07/29/2024
ms.reviewer: nachakra
ms.subservice: storage-common-concepts
ms.custom: engagement-fy23
# Customer intent: As a storage administrator, I want to configure an expiration policy for shared access signatures (SAS), so that I can enhance security by limiting the validity period and monitoring compliance with best practices.
---

# Configure an expiration policy for shared access signatures

You can use a shared access signature (SAS) to delegate access to resources in your Azure Storage account. A SAS token includes the targeted resource, the permissions granted, and the interval over which access is permitted. Best practices recommend that you limit the interval for a SAS in case it's compromised. By setting a SAS expiration policy for your storage accounts, you can recommend or enforce an upper expiration limit (maximum validity interval) when a user creates a user delegation SAS, a service SAS, or an account SAS.

For more information about shared access signatures, see [Grant limited access to Azure Storage resources using shared access signatures (SAS)](storage-sas-overview.md).

> [!IMPORTANT]
> For scenarios where shared access signatures are used, Microsoft recommends using a user delegation SAS. A user delegation SAS is secured with Microsoft Entra credentials instead of the account key, which provides superior security.

## About SAS expiration policies

You can configure a SAS expiration policy on the storage account. The SAS expiration policy specifies the upper limit for the validity interval on a user delegation SAS, a service SAS, or an account SAS. The upper limit is specified as a date/time value that is a combined number of days, hours, minutes, and seconds.

The validity interval for the SAS is calculated by subtracting the date/time value of the signed start field from the date/time value of the signed expiry field. If the resulting value is less than or equal to the recommended upper limit, then the SAS is in compliance with the SAS expiration policy.

When a SAS expiration policy is in effect for the storage account, the signed start field is required for every SAS. If the signed start field isn't included on the SAS, and you've configured a diagnostic setting for logging with Azure Monitor, then Azure Storage writes a message to the **SasExpiryStatus** property in the logs whenever a user *uses* a SAS without a value for the signed start field.

After you configure the SAS expiration policy, any user who creates a SAS with an interval that exceeds the recommended upper limit will see a warning, along with the recommended maximum interval.

## Define the SAS Expiration Action

SAS expiration policy supports two actions: 

- **[Default] Log:** Requests made with out-of-policy SAS are allowed. If you've configured a diagnostic setting for logging with Azure Monitor, then Azure Storage writes a message to the **SasExpiryStatus** property in the logs whenever a user *uses* a SAS that expires after the recommended interval. The message indicates that the validity interval of the SAS exceeds the recommended interval. This option is recommended for monitoring and auditing access without disrupting workflows. 

- **Block:** Requests made with out-of-policy SAS are denied. This is your strictest option for enforcing access controls in line with your organizational requirements. 

Out-of-policy SAS are those which do not have a signed start or have a validity interval larger than the upper limit. 

Start by reviewing your current SAS token usage and setting an appropriate expiration policy for your storage accounts. We recommend starting with ‘Log’ action to monitor your diagnostic logs for policy violations. We strongly recommend using Block action to ensure that if a SAS token has passed the validity of the expiration period set on the storage account, then access to storage must be blocked.

> [!IMPORTANT]
> SAS Expiration Action is not supported for user delegation shared access signatures through HDFS endpoint or service-level shared access signatures with a stored access policy.

## Configure a SAS expiration policy

When you configure a SAS expiration policy on a storage account, the policy applies to each type of SAS: user delegation SAS, service SAS, and account SAS. Service SAS and account SAS types are signed with the account key, while user delegation SAS is signed with Microsoft Entra credentials.

> [!NOTE]
> A user delegation SAS is signed with a user delegation key, which is obtained using Microsoft Entra credentials. The user delegation key has its own expiry interval which isn't subject to the SAS expiration policy. The SAS expiration policy applies only to the user delegation SAS, not the user delegation key it's signed with.
>
> A user delegation SAS has a maximum expiry interval of 7 days, regardless of the SAS expiration policy. If the SAS expiration policy is set to a value greater than 7 days, then the policy has no effect for a user delegation SAS. If the user delegation key expires, then any user delegation SAS signed with that key is invalid and any attempt to use the SAS returns an error.

### Do I need to rotate the account access keys first?

This section applies to service SAS and account SAS types, which are signed with the account key. Before you can configure a SAS expiration policy, you might need to rotate each of your account access keys at least once. If the **keyCreationTime** property of the storage account has a null value for either of the account access keys (key1 and key2), you'll need to rotate them. To determine whether the **keyCreationTime** property is null, see [Get the creation time of the account access keys for a storage account](storage-account-get-info.md#get-the-creation-time-of-the-account-access-keys-for-a-storage-account). If you attempt to configure a SAS expiration policy and the keys need to be rotated first, the operation fails.

### How to configure a SAS expiration policy

You can configure a SAS expiration policy using the Azure portal, PowerShell, or Azure CLI.

#### [Azure portal](#tab/azure-portal)

To configure a SAS expiration policy in the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. Under **Settings**, select **Configuration**.
1. Locate the setting for **Shared access signature (SAS) expiration policy**, and set it to **Enabled**.

   > [!NOTE]
   > If the setting is grayed out and you see the message shown in the image below, then [you will need to rotate both account access keys](#do-i-need-to-rotate-the-account-access-keys-first) before you can set an expiration policy.
   > 
   >:::image type="content" source="data:image/png;base64,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" alt-text="Screenshot showing the option to configure a SAS expiration policy is grayed out in the Azure portal." lightbox="media/sas-expiration-policy/configure-sas-expiration-policy-portal-grayed-out.png":::
   
1. Specify the time values under **Maximum SAS validity period** for the maximum interval for new shared access signatures that are created on resources in this storage account.

1. [Optional] Select your desired expiration action. The default **Log** action helps you detect trends and investigate access without disrupting users, while **Block** action lets you enforce zero-tolerance for out-of-policy SAS tokens.

1. Select **Save** to save your changes.

#### [PowerShell](#tab/azure-powershell)

To configure a SAS expiration policy, use the [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount) command, and then set the `-SasExpirationPeriod` parameter to the number of days, hours, minutes, and seconds that a SAS token can be active from the time that a SAS is signed. The string that you provide the `-SasExpirationPeriod` parameter uses the following format: `<days>.<hours>:<minutes>:<seconds>`. For example, if you wanted the SAS to expire 1 day, 12 hours, 5 minutes, and 6 seconds after it's signed, then you would use the string `1.12:05:06`.

[Optional] Set the `-SasExpirationAction` parameter to the desired action for out-of-policy SAS. Acceptable values include **Log** or **Block**.

```powershell
$account = Set-AzStorageAccount -ResourceGroupName <resource-group> `
    -Name <storage-account-name> `
    -SasExpirationPeriod <days>.<hours>:<minutes>:<seconds>
	-SasExpirationAction <action>
```

> [!TIP]
> You can also set the SAS expiration policy as you create a storage account by setting the `-SasExpirationPeriod` parameter of the [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) command.

> [!NOTE]
> If you get an error message indicating that the creation time for a key has not been set, [rotate the account access keys](#do-i-need-to-rotate-the-account-access-keys-first) and try again.

To verify that the policy has been applied, check the storage account's SasPolicy property.
  
```powershell
$account.SasPolicy
```

The SAS expiration period appears in the console output.

> [!div class="mx-imgBorder"]
> ![SAS expiration period](./media/storage-sas-expiration-policy/sas-policy-console-output.png)

#### [Azure CLI](#tab/azure-cli)

To configure a SAS expiration policy, use the [az storage account update](/cli/azure/storage/account#az-storage-account-update) command, and then set the `--key-exp-days` parameter to the number of days, hours, minutes, and seconds that a SAS token can be active from the time that a SAS is signed. The string that you provide the `--key-exp-days` parameter uses the following format: `<days>.<hours>:<minutes>:<seconds>`. For example, if you wanted the SAS to expire 1 day, 12 hours, 5 minutes, and 6 seconds after it's signed, then you would use the string `1.12:05:06`.

[Optional] Set the `--sas-expiration-action` parameter to the desired action for out-of-policy SAS. Acceptable values include **Log** or **Block**.

```azurecli-interactive
az storage account update \
  --name <storage-account> \
  --resource-group <resource-group> \
  --sas-exp <days>.<hours>:<minutes>:<seconds>
  --sas-expiration-action <action>
```

> [!TIP]
> You can also set the SAS expiration policy as you create a storage account by setting the `--key-exp-days` parameter of the [az storage account create](/cli/azure/storage/account#az-storage-account-create) command.

> [!NOTE]
> If you get an error message indicating that the creation time for a key has not been set, [rotate the account access keys](#do-i-need-to-rotate-the-account-access-keys-first) and try again.

To verify that the policy has been applied, call the [az storage account show](/cli/azure/storage/account#az-storage-account-show) command, and use the string `{SasPolicy:sasPolicy}` for the `-query` parameter.
  
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

To log the use of a SAS that is valid over a longer interval than the SAS expiration policy recommends, first create a diagnostic setting that sends logs to an Azure Log Analytics workspace. For more information, see [Send logs to Azure Log Analytics](/azure/azure-monitor/platform/diagnostic-settings).

Next, use an Azure Monitor log query to monitor whether policy has been violated. Create a new query in your Log Analytics workspace, add the following query text, and press **Run**.

```kusto
StorageBlobLogs 
| where SasExpiryStatus startswith "Policy violated"
| summarize count() by AccountName, SasExpiryStatus
```

## Use a built-in policy to monitor compliance

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

1. On the Azure Policy dashboard, locate the built-in policy definition for the scope that you specified in the policy assignment. You can search for `Storage accounts should have shared access signature (SAS) policies configured` in the **Search** box to filter for the built-in policy.
1. Select the policy name with the desired scope.
1. On the **Policy assignment** page for the built-in policy, select **View compliance**. Any storage accounts in the specified subscription and resource group that don't meet the policy requirements appear in the compliance report.

    :::image type="content" source="media/sas-expiration-policy/policy-compliance-report-portal-inline.png" alt-text="Screenshot showing how to view the compliance report for the SAS expiration built-in policy" lightbox="media/sas-expiration-policy/policy-compliance-report-portal-expanded.png":::

To bring a storage account into compliance, configure a SAS expiration policy for that account, as described in [Configure a SAS expiration policy](#configure-a-sas-expiration-policy).

## See also

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](storage-sas-overview.md)
- [Create a service SAS](/rest/api/storageservices/create-service-sas)
- [Create an account SAS](/rest/api/storageservices/create-account-sas)

