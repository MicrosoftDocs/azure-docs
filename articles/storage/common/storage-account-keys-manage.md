---
title: Manage account access keys
titleSuffix: Azure Storage
description: Learn how to view, manage, and rotate your storage account access keys.
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.service: azure-storage
ms.topic: how-to
ms.date: 10/26/2023
ms.reviewer: nachakra 
ms.custom: engagement-fy23, devx-track-azurecli
---

# Manage storage account access keys

When you create a storage account, Azure generates two 512-bit storage account access keys for that account. These keys can be used to authorize access to data in your storage account via Shared Key authorization, or via SAS tokens that are signed with the shared key.

Microsoft recommends that you use Azure Key Vault to manage your access keys, and that you regularly rotate and regenerate your keys. Using Azure Key Vault makes it easy to rotate your keys without interruption to your applications. You can also manually rotate your keys.

[!INCLUDE [storage-account-key-note-include](../../../includes/storage-account-key-note-include.md)]

## View account access keys

You can view and copy your account access keys with the Azure portal, PowerShell, or Azure CLI. The Azure portal also provides a connection string for your storage account that you can copy.

### [Portal](#tab/azure-portal)

To view and copy your storage account access keys or connection string from the Azure portal:

1. In the [Azure portal](https://portal.azure.com), go to your storage account.

2. Under **Security + networking**, select **Access keys**. Your account access keys appear, as well as the complete connection string for each key.

3. Select **Show keys** to show your access keys and connection strings and to enable buttons to copy the values.

4. Under **key1**, find the **Key** value. Select the **Copy** button to copy the account key.

5. Alternately, you can copy the entire connection string. Under **key1**, find the **Connection string** value. Select the **Copy** button to copy the connection string.

    :::image type="content" source="./media/storage-account-keys-manage/portal-connection-string.png" alt-text="Screenshot showing how to view access keys in the Azure portal":::

### [PowerShell](#tab/azure-powershell)

To retrieve your account access keys with PowerShell, call the [Get-AzStorageAccountKey](/powershell/module/az.Storage/Get-azStorageAccountKey) command.

The following example retrieves the first key. To retrieve the second key, use `Value[1]` instead of `Value[0]`. Remember to replace the placeholder values in brackets with your own values.

```powershell
$storageAccountKey = `
    (Get-AzStorageAccountKey
    -ResourceGroupName <resource-group> `
    -Name <storage-account>).Value[0]
```

### [Azure CLI](#tab/azure-cli)

To list your account access keys with Azure CLI, call the [az storage account keys list](/cli/azure/storage/account/keys#az-storage-account-keys-list) command, as shown in the following example. Remember to replace the placeholder values in brackets with your own values.

```azurecli
az storage account keys list \
  --resource-group <resource-group> \
  --account-name <storage-account>
```

---

You can use either of the two keys to access Azure Storage, but in general it's a good practice to use the first key, and reserve the use of the second key for when you are rotating keys.

To view or read an account's access keys, the user must either be a Service Administrator, or must be assigned an Azure role that includes the **Microsoft.Storage/storageAccounts/listkeys/action**. Some Azure built-in roles that include this action are the **Owner**, **Contributor**, and **Storage Account Key Operator Service Role** roles. For more information about the Service Administrator role, see [Azure roles, Microsoft Entra roles, and classic subscription administrator roles](../../role-based-access-control/rbac-and-directory-admin-roles.md). For detailed information about built-in roles for Azure Storage, see the **Storage** section in [Azure built-in roles for Azure RBAC](../../role-based-access-control/built-in-roles.md#storage).

## Use Azure Key Vault to manage your access keys

Microsoft recommends using Azure Key Vault to manage and rotate your access keys. Your application can securely access your keys in Key Vault, so that you can avoid storing them with your application code. For more information about using Key Vault for key management, see the following articles:

- [Manage storage account keys with Azure Key Vault and PowerShell](../../key-vault/secrets/overview-storage-keys-powershell.md)
- [Manage storage account keys with Azure Key Vault and the Azure CLI](../../key-vault/secrets/overview-storage-keys.md)

## Manually rotate access keys

Microsoft recommends that you rotate your access keys periodically to help keep your storage account secure. If possible, use Azure Key Vault to manage your access keys. If you are not using Key Vault, you will need to rotate your keys manually.

Two access keys are assigned so that you can rotate your keys. Having two keys ensures that your application maintains access to Azure Storage throughout the process.

> [!WARNING]
> Regenerating your access keys can affect any applications or Azure services that are dependent on the storage account key. Any clients that use the account key to access the storage account must be updated to use the new key, including media services, cloud, desktop and mobile applications, and graphical user interface applications for Azure Storage, such as [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/).
>
> Additionally, rotating or regenerating access keys revokes shared access signatures (SAS) that are generated based on that key. After access key rotation, you must regenerate **account** and **service** SAS tokens to avoid disruptions to applications. Note that **user delegation** SAS tokens are secured with Microsoft Entra credentials and aren't affected by key rotation.

If you plan to manually rotate access keys, Microsoft recommends that you set a key expiration policy. For more information, see [Create a key expiration policy](#create-a-key-expiration-policy).

After you create the key expiration policy, you can use Azure Policy to monitor whether a storage account's keys have been rotated within the recommended interval. For details, see [Check for key expiration policy violations](#check-for-key-expiration-policy-violations).

### [Portal](#tab/azure-portal)

To rotate your storage account access keys in the Azure portal:

1. Update the connection strings in your application code to reference the secondary access key for the storage account.
1. Navigate to your storage account in the [Azure portal](https://portal.azure.com).
1. Under **Security + networking**, select **Access keys**.
1. To regenerate the primary access key for your storage account, select the **Regenerate** button next to the primary access key.
1. Update the connection strings in your code to reference the new primary access key.
1. Regenerate the secondary access key in the same manner.

### [PowerShell](#tab/azure-powershell)

To rotate your storage account access keys with PowerShell:

1. Update the connection strings in your application code to reference the secondary access key for the storage account.

2. Call the [New-AzStorageAccountKey](/powershell/module/az.storage/new-azstorageaccountkey) command to regenerate the primary access key, as shown in the following example:

    ```powershell
    New-AzStorageAccountKey -ResourceGroupName <resource-group> `
      -Name <storage-account> `
      -KeyName key1
    ```

3. Update the connection strings in your code to reference the new primary access key.

4. Regenerate the secondary access key in the same manner. To regenerate the secondary key, use `key2` as the key name instead of `key1`.

### [Azure CLI](#tab/azure-cli)

To rotate your storage account access keys with Azure CLI:

1. Update the connection strings in your application code to reference the secondary access key for the storage account.
1. Call the [az storage account keys renew](/cli/azure/storage/account/keys#az-storage-account-keys-renew) command to regenerate the primary access key, as shown in the following example:

    ```azurecli
    az storage account keys renew \
      --resource-group <resource-group> \
      --account-name <storage-account> \
      --key primary
    ```

1. Update the connection strings in your code to reference the new primary access key.
1. Regenerate the secondary access key in the same manner. To regenerate the secondary key, use `secondary` as the key name instead of `primary`.

---

> [!CAUTION]
> Microsoft recommends using only one of the keys in all of your applications at the same time. If you use Key 1 in some places and Key 2 in others, you will not be able to rotate your keys without some application losing access.

To rotate an account's access keys, the user must either be a Service Administrator, or must be assigned an Azure role that includes the **Microsoft.Storage/storageAccounts/regeneratekey/action**. Some Azure built-in roles that include this action are the **Owner**, **Contributor**, and **Storage Account Key Operator Service Role** roles. For more information about the Service Administrator role, see [Azure roles, Microsoft Entra roles, and classic subscription administrator roles](../../role-based-access-control/rbac-and-directory-admin-roles.md). For detailed information about Azure built-in roles for Azure Storage, see the **Storage** section in [Azure built-in roles for Azure RBAC](../../role-based-access-control/built-in-roles.md#storage).

## Create a key expiration policy

A key expiration policy enables you to set a reminder for the rotation of the account access keys. The reminder is displayed if the specified interval has elapsed and the keys have not yet been rotated. After you create a key expiration policy, you can monitor your storage accounts for compliance to ensure that the account access keys are rotated regularly.

> [!NOTE]
> Before you can create a key expiration policy, you may need to rotate each of your account access keys at least once.

### [Portal](#tab/azure-portal)

To create a key expiration policy in the Azure portal:

1. In the [Azure portal](https://portal.azure.com), go to your storage account.
1. Under **Security + networking**, select **Access keys**. Your account access keys appear, as well as the complete connection string for each key.
1. Select the **Set rotation reminder** button. If the **Set rotation reminder** button is grayed out, you will need to rotate each of your keys. Follow the steps described in [Manually rotate access keys](#manually-rotate-access-keys) to rotate the keys.
1. In **Set a reminder to rotate access keys**, select the **Enable key rotation reminders** checkbox and set a frequency for the reminder.
1. Select **Save**.

:::image type="content" source="media/storage-account-keys-manage/portal-key-expiration-policy.png" alt-text="Screenshot showing how to create a key expiration policy in the Azure portal":::

### [PowerShell](#tab/azure-powershell)

To create a key expiration policy with PowerShell, use the [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount) command and set the `-KeyExpirationPeriodInDay` parameter to the interval in days until the access key should be rotated.

The `KeyCreationTime` property indicates when the account access keys were created or last rotated. Older accounts may have a null value for the `KeyCreationTime` property because it has not yet been set. If the `KeyCreationTime` property is null, you cannot create a key expiration policy until you rotate the keys. For this reason, it's a good idea to check the `KeyCreationTime` property for the storage account before you attempt to set the key expiration policy.

The following example checks whether the `KeyCreationTime` property has been set for each key. If the `KeyCreationTime` property has a value, then a key expiration policy is created for the storage account. Remember to replace the placeholder values in brackets with your own values.

```azurepowershell
$rgName = "<resource-group>"
$accountName = "<account-name>"

$account = Get-AzStorageAccount -ResourceGroupName $rgName -Name $accountName

# Check whether the KeyCreationTime property has a value for each key 
# before creating the key expiration policy.
if ($account.KeyCreationTime.Key1 -eq $null -or $account.KeyCreationTime.Key2 -eq $null)
{
    Write-Host("You must regenerate both keys at least once before setting expiration policy")
}
else
{
    $account = Set-AzStorageAccount -ResourceGroupName $rgName -Name `
        $accountName  -KeyExpirationPeriodInDay 60
}
```

You can also set the key expiration policy as you create a storage account by setting the `-KeyExpirationPeriodInDay` parameter of the [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) command.

To verify that the policy has been applied, check the storage account's `KeyPolicy` property.

```powershell
$account.KeyPolicy
```

### [Azure CLI](#tab/azure-cli)

To create a key expiration policy with Azure CLI, use the [az storage account update](/cli/azure/storage/account#az-storage-account-update) command and set the `--key-exp-days` parameter to the interval in days until the access key should be rotated.

The `keyCreationTime` property indicates when the account access keys were created or last rotated. Older accounts may have a null value for the `keyCreationTime` property because it has not yet been set. If the `keyCreationTime` property is null, you cannot create a key expiration policy until you rotate the keys. For this reason, it's a good idea to check the `keyCreationTime` property for the storage account before you attempt to set the key expiration policy.

The following example checks whether the `keyCreationTime` property has been set for each key. If the `keyCreationTime` property has a value, then a key expiration policy is created for the storage account. Remember to replace the placeholder values in brackets with your own values.

```azurecli
key1_create_time=$(az storage account show \
    --name <storage-account> \
    --resource-group <resource-group> \
    --query 'keyCreationTime.key1' \
    --output tsv)
key2_create_time=$(az storage account show \
    --name <storage-account> \
    --resource-group <resource-group> \
    --query 'keyCreationTime.key2' \
    --output tsv)

if [ -z "$key1_create_time" ] || [ -z "$key2_create_time" ]; 
then
    echo "You must regenerate both keys at least once before setting expiration policy"
else
    az storage account update \
        --name <storage-account> \
        --resource-group <resource-group> \
        --key-exp-days 60
fi
```

You can also set the key expiration policy as you create a storage account by setting the `--key-exp-days` parameter of the [az storage account create](/cli/azure/storage/account#az-storage-account-create) command.

To verify that the policy has been applied, call the [az storage account show](/cli/azure/storage/account#az-storage-account-show) command, and use the string `{KeyPolicy:keyPolicy}` for the `-query` parameter.

```azurecli
az storage account show \
  -n <storage-account-name> \
  -g <resource-group-name> \
  --query "{KeyPolicy:keyPolicy}"
```

The key expiration period appears in the console output.

```json
{
  "KeyPolicy": {
    "enableAutoRotation": false,
    "keyExpirationPeriodInDays": 60
  }
}
```

---

## Check for key expiration policy violations

You can monitor your storage accounts with Azure Policy to ensure that account access keys have been rotated within the recommended period. Azure Storage provides a built-in policy for ensuring that storage account access keys are not expired. For more information about the built-in policy, see **Storage account keys should not be expired** in [List of built-in policy definitions](../../governance/policy/samples/built-in-policies.md#storage).

### Assign the built-in policy for a resource scope

Follow these steps to assign the built-in policy to the appropriate scope in the Azure portal:

1. In the Azure portal, search for *Policy* to display the Azure Policy dashboard.
1. In the **Authoring** section, select **Assignments**.
1. Choose **Assign policy**.
1. On the **Basics** tab of the **Assign policy** page, in the **Scope** section, specify the scope for the policy assignment. Select the **More** button to choose the subscription and optional resource group.
1. For the **Policy definition** field, select the **More** button, and enter *storage account keys* in the **Search** field. Select the policy definition named **Storage account keys should not be expired**.

    :::image type="content" source="media/storage-account-keys-manage/policy-definition-select-portal.png" alt-text="Screenshot showing how to select the built-in policy to monitor key rotation intervals for your storage accounts":::

1. Select **Review + create** to assign the policy definition to the specified scope.

    :::image type="content" source="media/storage-account-keys-manage/policy-assignment-create.png" alt-text="Screenshot showing how to create the policy assignment":::

### Monitor compliance with the key expiration policy

To monitor your storage accounts for compliance with the key expiration policy, follow these steps:

1. On the Azure Policy dashboard, locate the built-in policy definition for the scope that you specified in the policy assignment. You can search for *Storage account keys should not be expired* in the **Search** box to filter for the built-in policy.
1. Select the policy name with the desired scope.
1. On the **Policy assignment** page for the built-in policy, select **View compliance**. Any storage accounts in the specified subscription and resource group that do not meet the policy requirements appear in the compliance report.

    :::image type="content" source="media/storage-account-keys-manage/policy-compliance-report-portal.png" alt-text="Screenshot showing how to view the compliance report for the key expiration built-in policy":::

To bring a storage account into compliance, rotate the account access keys.

## Next steps

- [Azure storage account overview](storage-account-overview.md)
- [Create a storage account](storage-account-create.md)
- [Prevent Shared Key authorization for an Azure Storage account](shared-key-authorization-prevent.md)
