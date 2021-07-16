---
title: Configure object replication
titleSuffix: Azure Storage
description: Learn how to configure object replication to asynchronously copy block blobs from a container in one storage account to another.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 05/11/2021
ms.author: tamram
ms.subservice: blobs 
ms.custom: devx-track-azurecli, devx-track-azurepowershell
---

# Configure object replication for block blobs

Object replication asynchronously copies block blobs between a source storage account and a destination account. For more information about object replication, see [Object replication](object-replication-overview.md).

When you configure object replication, you create a replication policy that specifies the source storage account and the destination account. A replication policy includes one or more rules that specify a source container and a destination container and indicate which block blobs in the source container will be replicated.

This article describes how to configure object replication for your storage account by using the Azure portal, PowerShell, or Azure CLI. You can also use one of the Azure Storage resource provider client libraries to configure object replication.

[!INCLUDE [storage-data-lake-gen2-support](../../../includes/storage-data-lake-gen2-support.md)]

## Create a replication policy and rules

Before you configure object replication, create the source and destination storage accounts if they do not already exist. Both accounts must be general-purpose v2 storage accounts. For more information, see [Create an Azure Storage account](../common/storage-account-create.md).

Object replication requires that blob versioning is enabled for both the source and destination account, and that blob change feed is enabled for the source account. To learn more about blob versioning, see [Blob versioning](versioning-overview.md). To learn more about change feed, see [Change feed support in Azure Blob Storage](storage-blob-change-feed.md). Keep in mind that enabling these features can result in additional costs.

A storage account can serve as the source account for up to two destination accounts. The source and destination accounts may be in the same region or in different regions. They may also reside in different subscriptions and in different Azure Active Directory (Azure AD) tenants. Only one replication policy may be created for each pair of accounts.

When you configure object replication, you create a replication policy on the destination account via the Azure Storage resource provider. After the replication policy is created, Azure Storage assigns it a policy ID. You must then associate that replication policy with the source account by using the policy ID. The policy ID on the source and destination accounts must be the same in order for replication to take place.

To configure an object replication policy for a storage account, you must be assigned the Azure Resource Manager **Contributor** role, scoped to the level of the storage account or higher. For more information, see [Azure built-in roles](../../role-based-access-control/built-in-roles.md) in the Azure role-based access control (Azure RBAC) documentation.

### Configure object replication when you have access to both storage accounts

If you have access to both the source and destination storage accounts, then you can configure the object replication policy on both accounts.

Before you configure object replication in the Azure portal, create the source and destination containers in their respective storage accounts, if they do not already exist. Also, enable blob versioning and change feed on the source account, and enable blob versioning on the destination account.

# [Azure portal](#tab/portal)

The Azure portal automatically creates the policy on the source account after you configure it for the destination account.

To create a replication policy in the Azure portal, follow these steps:

1. Navigate to the source storage account in the Azure portal.
1. Under **Blob service**, select **Object replication**.
1. Select **Set up replication rules**.
1. Select the destination subscription and storage account.
1. In the **Container pairs** section, select a source container from the source account, and a destination container from the destination account. You can create up to 10 container pairs per replication policy.

    The following image shows a set of replication rules.

    :::image type="content" source="media/object-replication-configure/configure-replication-policy.png" alt-text="Screenshot showing replication rules in Azure portal":::

1. If desired, specify one or more filters to copy only blobs that match a prefix pattern. For example, if you specify a prefix `b`, only blobs whose name begin with that letter are replicated. You can specify a virtual directory as part of the prefix. The prefix string does not support wildcard characters.

    The following image shows filters that restrict which blobs are copied as part of a replication rule.

    :::image type="content" source="media/object-replication-configure/configure-replication-copy-prefix.png" alt-text="Screenshot showing filters for a replication rule":::

1. By default, the copy scope is set to copy only new objects. To copy all objects in the container or to copy objects starting from a custom date and time, select the **change** link and configure the copy scope for the container pair.

    The following image shows a custom copy scope that copies objects from a specified date and time onward.

    :::image type="content" source="media/object-replication-configure/configure-replication-copy-scope.png" alt-text="Screenshot showing custom copy scope for object replication":::

1. Select **Save and apply** to create the replication policy and start replicating data.

After you have configured object replication, the Azure portal displays the replication policy and rules, as shown in the following image.

:::image type="content" source="media/object-replication-configure/object-replication-policies-portal.png" alt-text="Screenshot showing object replication policy in Azure portal":::

# [PowerShell](#tab/powershell)

To create a replication policy with PowerShell, first install version [2.5.0](https://www.powershellgallery.com/packages/Az.Storage/2.5.0) or later of the Az.Storage PowerShell module. For more information about installing Azure PowerShell, see [Install Azure PowerShell with PowerShellGet](/powershell/azure/install-az-ps).

The following example shows how to create a replication policy on the source and destination accounts. Remember to replace values in angle brackets with your own values:

```powershell
# Sign in to your Azure account.
Connect-AzAccount

# Set variables.
$rgName = "<resource-group>"
$srcAccountName = "<source-storage-account>"
$destAccountName = "<destination-storage-account>"
$srcContainerName1 = "source-container1"
$destContainerName1 = "dest-container1"
$srcContainerName2 = "source-container2"
$destContainerName2 = "dest-container2"

# Enable blob versioning and change feed on the source account.
Update-AzStorageBlobServiceProperty -ResourceGroupName $rgname `
    -StorageAccountName $srcAccountName `
    -EnableChangeFeed $true `
    -IsVersioningEnabled $true

# Enable blob versioning on the destination account.
Update-AzStorageBlobServiceProperty -ResourceGroupName $rgname `
    -StorageAccountName $destAccountName `
    -IsVersioningEnabled $true

# List the service properties for both accounts.
Get-AzStorageBlobServiceProperty -ResourceGroupName $rgname `
    -StorageAccountName $srcAccountName
Get-AzStorageBlobServiceProperty -ResourceGroupName $rgname `
    -StorageAccountName $destAccountName

# Create containers in the source and destination accounts.
Get-AzStorageAccount -ResourceGroupName $rgname -StorageAccountName $srcAccountName |
    New-AzStorageContainer $srcContainerName1
Get-AzStorageAccount -ResourceGroupName $rgname -StorageAccountName $destAccountName |
    New-AzStorageContainer $destContainerName1
Get-AzStorageAccount -ResourceGroupName $rgname -StorageAccountName $srcAccountName |
    New-AzStorageContainer $srcContainerName2
Get-AzStorageAccount -ResourceGroupName $rgname -StorageAccountName $destAccountName |
    New-AzStorageContainer $destContainerName2

# Define replication rules for each container.
$rule1 = New-AzStorageObjectReplicationPolicyRule -SourceContainer $srcContainerName1 `
    -DestinationContainer $destContainerName1 `
    -PrefixMatch b
$rule2 = New-AzStorageObjectReplicationPolicyRule -SourceContainer $srcContainerName2 `
    -DestinationContainer $destContainerName2  `
    -MinCreationTime 2020-05-10T00:00:00Z

# Create the replication policy on the destination account.
$destPolicy = Set-AzStorageObjectReplicationPolicy -ResourceGroupName $rgname `
    -StorageAccountName $destAccountName `
    -PolicyId default `
    -SourceAccount $srcAccountName `
    -Rule $rule1,$rule2

# Create the same policy on the source account.
Set-AzStorageObjectReplicationPolicy -ResourceGroupName $rgname `
    -StorageAccountName $srcAccountName `
    -InputObject $destPolicy
```

# [Azure CLI](#tab/azure-cli)

To create a replication policy with Azure CLI, first install Azure CLI version 2.11.1 or later. For more information, see [Get started with Azure CLI](/cli/azure/get-started-with-azure-cli).

Next, enable blob versioning on the source and destination storage accounts, and enable change feed on the source account, by calling the [az storage account blob-service-properties update](/cli/azure/storage/account/blob-service-properties#az_storage_account_blob_service_properties_update) command. Remember to replace values in angle brackets with your own values:

```azurecli
az login

az storage account blob-service-properties update \
    --resource-group <resource-group> \
    --account-name <source-storage-account> \
    --enable-versioning \
    --enable-change-feed

az storage account blob-service-properties update \
    --resource-group <resource-group> \
    --account-name <dest-storage-account> \
    --enable-versioning
```

Create the source and destination containers in their respective storage accounts.

```azurecli
az storage container create \
    --account-name <source-storage-account> \
    --name source-container-1 \
    --auth-mode login
az storage container create \
    --account-name <source-storage-account> \
    --name source-container-2 \
    --auth-mode login

az storage container create \
    --account-name <dest-storage-account> \
    --name dest-container-1 \
    --auth-mode login
az storage container create \
    --account-name <dest-storage-account> \
    --name dest-container-1 \
    --auth-mode login
```

Create a new replication policy and an associated rule on the destination account by calling the [az storage account or-policy create](/cli/azure/storage/account/or-policy#az_storage_account_or_policy_create).

```azurecli
az storage account or-policy create \
    --account-name <dest-storage-account> \
    --resource-group <resource-group> \
    --source-account <source-storage-account> \
    --destination-account <dest-storage-account> \
    --source-container source-container-1 \
    --destination-container dest-container-1 \
    --min-creation-time '2020-09-10T00:00:00Z' \
    --prefix-match a

```

Azure Storage sets the policy ID for the new policy when it is created. To add additional rules to the policy, call the [az storage account or-policy rule add](/cli/azure/storage/account/or-policy/rule#az_storage_account_or_policy_rule_add) and provide the policy ID.

```azurecli
az storage account or-policy rule add \
    --account-name <dest-storage-account> \
    --resource-group <resource-group> \
    --source-container source-container-2 \
    --destination-container dest-container-2 \
    --policy-id <policy-id> \
    --prefix-match b
```

Next, create the policy on the source account using the policy ID.

```azurecli
az storage account or-policy show \
    --resource-group <resource-group> \
    --account-name <dest-storage-account> \
    --policy-id <policy-id> |
    az storage account or-policy create --resource-group <resource-group> \
    --account-name <source-storage-account> \
    --policy "@-"
```

---

### Configure object replication when you have access only to the destination account

If you do not have permissions to the source storage account, then you can configure object replication on the destination account and provide a JSON file that contains the policy definition to another user to create the same policy on the source account. For example, if the source account is in a different Azure AD tenant from the destination account, then you can use this approach to configure object replication.

Keep in mind that you must be assigned the Azure Resource Manager **Contributor** role scoped to the level of the destination storage account or higher in order to create the policy. For more information, see [Azure built-in roles](../../role-based-access-control/built-in-roles.md) in the Azure role-based access control (Azure RBAC) documentation.

The following table summarizes which values to use for the policy ID and rule IDs in the JSON file in each scenario.

| When you are creating the JSON file for this account... | Set the policy ID to this value | Set rule IDs to this value |
|-|-|-|
| Destination account | The string value *default*. Azure Storage will create the policy ID value for you. | An empty string. Azure Storage will create the rule ID values for you. |
| Source account | The value of the policy ID returned when you download the policy defined on the destination account as a JSON file. | The values of the rule IDs returned when you download the policy defined on the destination account as a JSON file. |

The following example defines a replication policy on the destination account with a single rule that matches the prefix *b* and sets the minimum creation time for blobs that are to be replicated. Remember to replace values in angle brackets with your own values:

```json
{
  "properties": {
    "policyId": "default",
    "sourceAccount": "<source-account>",
    "destinationAccount": "<dest-account>",
    "rules": [
      {
        "ruleId": "",
        "sourceContainer": "<source-container>",
        "destinationContainer": "<destination-container>",
        "filters": {
          "prefixMatch": [
            "b"
          ],
          "minCreationTime": "2020-08-028T00:00:00Z"
        }
      }
    ]
  }
}
```

# [Azure portal](#tab/portal)

To configure object replication on the destination account with a JSON file in the Azure portal, follow these steps:

1. Create a local JSON file that defines the replication policy on the destination account. Set the **policyId** field to *default* so that Azure Storage will define the policy ID.

    An easy way to create a JSON file that defines a replication policy is to first create a test replication policy between two storage accounts in the Azure portal. You can then download the replication rules and modify the JSON file as needed.

1. Navigate to the **Object replication** settings for the destination account in the Azure portal.
1. Select **Upload replication rules**.
1. Upload the JSON file. The Azure portal displays the policy and rules that will be created, as shown in the following image.

    :::image type="content" source="media/object-replication-configure/replication-rules-upload-portal.png" alt-text="Screenshot showing how to upload a JSON file to define a replication policy":::

1. Select **Upload** to create the replication policy on the destination account.

You can then download a JSON file containing the policy definition that you can provide to another user to configure the source account. To download this JSON file, follow these steps:

1. Navigate to the **Object replication** settings for the destination account in the Azure portal.
1. Select the **More** button next to the policy that you wish to download, then select **Download rules**, as shown in the following image.

    :::image type="content" source="media/object-replication-configure/replication-rules-download-portal.png" alt-text="Screenshot showing how to download replication rules to a JSON file":::

1. Save the JSON file to your local computer to share with another user to configure the policy on the source account.

The downloaded JSON file includes the policy ID that Azure Storage created for the policy on the destination account. You must use the same policy ID to configure object replication on the source account.

Keep in mind that uploading a JSON file to create a replication policy for the destination account via the Azure portal does not automatically create the same policy in the source account. Another user must create the policy on the source account before Azure Storage begins replicating objects.

# [PowerShell](#tab/powershell)

To download a JSON file that contains the replication policy definition for the destination account from PowerShell, call the [Get-AzStorageObjectReplicationPolicy](/powershell/module/az.storage/get-azstorageobjectreplicationpolicy) command to return the policy. Then convert the policy to JSON and save it as a local file, as shown in the following example. Remember to replace values in angle brackets and the file path with your own values:

```powershell
$rgName = "<resource-group>"
$destAccountName = "<destination-storage-account>"

$destPolicy = Get-AzStorageObjectReplicationPolicy -ResourceGroupName $rgname `
    -StorageAccountName $destAccountName
$destPolicy | ConvertTo-Json -Depth 5 > c:\temp\json.txt
```

To use the JSON file to define the replication policy on the source account with PowerShell, retrieve the local file and convert from JSON to an object. Then call the [Set-AzStorageObjectReplicationPolicy](/powershell/module/az.storage/set-azstorageobjectreplicationpolicy) command to configure the policy on the source account, as shown in the following example. Remember to replace values in angle brackets and the file path with your own values:

```powershell
$object = Get-Content -Path C:\temp\json.txt | ConvertFrom-Json
Set-AzStorageObjectReplicationPolicy -ResourceGroupName $rgname `
    -StorageAccountName $srcAccountName `
    -PolicyId $object.PolicyId `
    -SourceAccount $object.SourceAccount `
    -DestinationAccount $object.DestinationAccount `
    -Rule $object.Rules
```

# [Azure CLI](#tab/azure-cli)

To write the replication policy definition for the destination account to a JSON file from Azure CLI, call the [az storage account or-policy show](/cli/azure/storage/account/or-policy#az_storage_account_or_policy_show) command and output to a file.

The following example writes the policy definition to a JSON file named *policy.json*. Remember to replace values in angle brackets and the file path with your own values:

```azurecli
az storage account or-policy show \
    --account-name <dest-account-name> \
    --policy-id  <policy-id> > policy.json
```

To use the JSON file to configure the replication policy on the source account with Azure CLI, call the [az storage account or-policy create](/cli/azure/storage/account/or-policy#az_storage_account_or_policy_create) command and reference the *policy.json* file. Remember to replace values in angle brackets and the file path with your own values:

```azurecli
az storage account or-policy create \
    -resource-group <resource-group> \
    --source-account <source-account-name> \
    --policy @policy.json
```

---

## Check the replication status of a blob

You can check the replication status for a blob in the source account using the Azure portal, PowerShell, or Azure CLI. Object replication properties are not populated until replication has either completed or failed.

# [Azure portal](#tab/portal)

To check the replication status for a blob in the source account in the Azure portal, follow these steps:

1. Navigate to the source account in the Azure portal.
1. Locate the container that includes the source blob.
1. Select the blob to display its properties. If the blob has been replicated successfully, you'll see in the **Object replication** section that the status is set to *Complete*. The replication policy ID and the ID for the rule governing object replication for this container are also listed.

:::image type="content" source="media/object-replication-configure/check-replication-status-source.png" alt-text="Screenshot showing replication status for a blob in the source account":::

# [PowerShell](#tab/powershell)

To check the replication status for a blob in the source account with PowerShell, get the value of the object replication **ReplicationStatus** property, as shown in the following example. Remember to replace values in angle brackets with your own values:

```powershell
$ctxSrc = (Get-AzStorageAccount -ResourceGroupName $rgname `
    -StorageAccountName $srcAccountName).Context
$blobSrc = Get-AzStorageBlob -Container $srcContainerName1 `
    -Context $ctxSrc `
    -Blob <blob-name>
$blobSrc.BlobProperties.ObjectReplicationSourceProperties[0].Rules[0].ReplicationStatus
```

# [Azure CLI](#tab/azure-cli)

To check the replication status for a blob in the source account with Azure CLI, get the value of the object replication **status** property, as shown in the following example:

```azurecli
az storage blob show \
    --account-name <source-account-name> \
    --container-name <source-container-name> \
    --name <source-blob-name> \
    --query 'objectReplicationSourceProperties[].rules[].status' \
    --output tsv \
    --auth-mode login
```

---

If the replication status for a blob in the source account indicates failure, then investigate the following possible causes:

- Make sure that the object replication policy is configured on the destination account.
- Verify that the destination container still exists.
- If the source blob has been encrypted with a customer-provided key as part of a write operation, then object replication will fail. For more information about customer-provided keys, see [Provide an encryption key on a request to Blob storage](encryption-customer-provided-keys.md).

## Remove a replication policy

To remove a replication policy and its associated rules, use Azure portal, PowerShell, or CLI.

# [Azure portal](#tab/portal)

To remove a replication policy in the Azure portal, follow these steps:

1. Navigate to the source storage account in the Azure portal.
1. Under **Settings**, select **Object replication**.
1. Click the **More** button next to the policy name.
1. Select **Delete Rules**.

# [PowerShell](#tab/powershell)

To remove a replication policy, delete the policy from both the source account and the destination account. Deleting the policy also deletes any rules associated with it.

```powershell
# Remove the policy from the destination account.
Remove-AzStorageObjectReplicationPolicy -ResourceGroupName $rgname `
    -StorageAccountName $destAccountName `
    -PolicyId $destPolicy.PolicyId

# Remove the policy from the source account.
Remove-AzStorageObjectReplicationPolicy -ResourceGroupName $rgname `
    -StorageAccountName $srcAccountName `
    -PolicyId $destPolicy.PolicyId
```

# [Azure CLI](#tab/azure-cli)

To remove a replication policy, delete the policy from both the source account and the destination account. Deleting the policy also deletes any rules associated with it.

```azurecli
az storage account or-policy delete \
    --policy-id <policy-id> \
    --account-name <source-storage-account> \
    --resource-group <resource-group>

az storage account or-policy delete \
    --policy-id <policy-id> \
    --account-name <dest-storage-account> \
    --resource-group <resource-group>
```

---

## Next steps

- [Object replication overview](object-replication-overview.md)
- [Enable and manage blob versioning](versioning-enable.md)
- [Process change feed in Azure Blob storage](storage-blob-change-feed-how-to.md)
