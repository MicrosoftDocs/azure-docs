---
title: Configure object replication
titleSuffix: Azure Storage
description: Learn how to configure object replication to asynchronously copy block blobs from a container in one storage account to another.
services: storage
author: normesta

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 05/05/2022
ms.author: normesta
ms.custom: devx-track-azurecli, devx-track-azurepowershell
---

# Configure object replication for block blobs

Object replication asynchronously copies block blobs between a source storage account and a destination account. When you configure object replication, you create a replication policy that specifies the source storage account and the destination account. A replication policy includes one or more rules that specify a source container and a destination container and indicate which block blobs in the source container will be replicated. For more information about object replication, see [Object replication for block blobs](object-replication-overview.md).

This article describes how to configure an object replication policy by using the Azure portal, PowerShell, or Azure CLI. You can also use one of the Azure Storage resource provider client libraries to configure object replication.

## Prerequisites

Before you configure object replication, create the source and destination storage accounts if they don't already exist. The source and destination accounts can be either general-purpose v2 storage accounts or premium block blob accounts. For more information, see [Create an Azure Storage account](../common/storage-account-create.md).

Object replication requires that blob versioning is enabled for both the source and destination account, and that blob change feed is enabled for the source account. To learn more about blob versioning, see [Blob versioning](versioning-overview.md). To learn more about change feed, see [Change feed support in Azure Blob Storage](storage-blob-change-feed.md). Keep in mind that enabling these features can result in additional costs.

To configure an object replication policy for a storage account, you must be assigned the Azure Resource Manager **Contributor** role, scoped to the level of the storage account or higher. For more information, see [Azure built-in roles](../../role-based-access-control/built-in-roles.md) in the Azure role-based access control (Azure RBAC) documentation.

Object replication is not yet supported in accounts that have a hierarchical namespace enabled.

## Configure object replication with access to both storage accounts

If you have access to both the source and destination storage accounts, then you can configure the object replication policy on both accounts. The following examples show how to configure object replication with the Azure portal, PowerShell, or Azure CLI.

### [Azure portal](#tab/portal)

When you configure object replication in the Azure portal, you only need to configure the policy on the source account. The Azure portal automatically creates the policy on the destination account after you configure it for the source account.

To create a replication policy in the Azure portal, follow these steps:

1. Navigate to the source storage account in the Azure portal.
1. Under **Data management**, select **Object replication**.
1. Select **Set up replication rules**.
1. Select the destination subscription and storage account.
1. In the **Container pairs** section, select a source container from the source account, and a destination container from the destination account. You can create up to 10 container pairs per replication policy from the Azure portal. To configure more than 10 container pairs (up to 1000), see [Configure object replication using a JSON file](#configure-object-replication-using-a-json-file).

    The following image shows a set of replication rules.

    :::image type="content" source="media/object-replication-configure/configure-replication-policy.png" alt-text="Screenshot showing replication rules in Azure portal":::

1. If desired, specify one or more filters to copy only blobs that match a prefix pattern. For example, if you specify a prefix `b`, only blobs whose name begin with that letter are replicated. You can specify a virtual directory as part of the prefix. You can add a maximum of up to five prefix matches. The prefix string doesn't support wildcard characters.

    The following image shows filters that restrict which blobs are copied as part of a replication rule.

    :::image type="content" source="media/object-replication-configure/configure-replication-copy-prefix.png" alt-text="Screenshot showing filters for a replication rule":::

1. By default, the copy scope is set to copy only new objects. To copy all objects in the container or to copy objects starting from a custom date and time, select the **change** link and configure the copy scope for the container pair.

    The following image shows a custom copy scope that copies objects from a specified date and time onward.

    :::image type="content" source="media/object-replication-configure/configure-replication-copy-scope.png" alt-text="Screenshot showing custom copy scope for object replication":::

1. Select **Save and apply** to create the replication policy and start replicating data.

After you have configured object replication, the Azure portal displays the replication policy and rules, as shown in the following image.

:::image type="content" source="media/object-replication-configure/object-replication-policies-portal.png" alt-text="Screenshot showing object replication policy in Azure portal":::

### [PowerShell](#tab/powershell)

To create a replication policy with PowerShell, first install version [2.5.0](https://www.powershellgallery.com/packages/Az.Storage/2.5.0) or later of the Az.Storage PowerShell module. For more information about installing Azure PowerShell, see [Install Azure PowerShell with PowerShellGet](/powershell/azure/install-azure-powershell).

The following example shows how to create a replication policy first on the destination account, and then on the source account. Remember to replace values in angle brackets with your own values:

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
Update-AzStorageBlobServiceProperty -ResourceGroupName $rgName `
    -StorageAccountName $srcAccountName `
    -EnableChangeFeed $true `
    -IsVersioningEnabled $true

# Enable blob versioning on the destination account.
Update-AzStorageBlobServiceProperty -ResourceGroupName $rgName `
    -StorageAccountName $destAccountName `
    -IsVersioningEnabled $true

# List the service properties for both accounts.
Get-AzStorageBlobServiceProperty -ResourceGroupName $rgName `
    -StorageAccountName $srcAccountName
Get-AzStorageBlobServiceProperty -ResourceGroupName $rgName `
    -StorageAccountName $destAccountName

# Create containers in the source and destination accounts.
Get-AzStorageAccount -ResourceGroupName $rgName -StorageAccountName $srcAccountName |
    New-AzStorageContainer $srcContainerName1
Get-AzStorageAccount -ResourceGroupName $rgName -StorageAccountName $destAccountName |
    New-AzStorageContainer $destContainerName1
Get-AzStorageAccount -ResourceGroupName $rgName -StorageAccountName $srcAccountName |
    New-AzStorageContainer $srcContainerName2
Get-AzStorageAccount -ResourceGroupName $rgName -StorageAccountName $destAccountName |
    New-AzStorageContainer $destContainerName2

# Define replication rules for each container.
$rule1 = New-AzStorageObjectReplicationPolicyRule -SourceContainer $srcContainerName1 `
    -DestinationContainer $destContainerName1 `
    -PrefixMatch b
$rule2 = New-AzStorageObjectReplicationPolicyRule -SourceContainer $srcContainerName2 `
    -DestinationContainer $destContainerName2  `
    -MinCreationTime 2021-09-01T00:00:00Z

# Create the replication policy on the destination account.
$destPolicy = Set-AzStorageObjectReplicationPolicy -ResourceGroupName $rgName `
    -StorageAccountName $destAccountName `
    -PolicyId default `
    -SourceAccount $srcAccountName `
    -Rule $rule1,$rule2

# Create the same policy on the source account.
Set-AzStorageObjectReplicationPolicy -ResourceGroupName $rgName `
    -StorageAccountName $srcAccountName `
    -InputObject $destPolicy
```

### [Azure CLI](#tab/azure-cli)

To create a replication policy with Azure CLI, first install Azure CLI version 2.11.1 or later. For more information, see [Get started with Azure CLI](/cli/azure/get-started-with-azure-cli).

Next, enable blob versioning on the source and destination storage accounts, and enable change feed on the source account, by calling the [az storage account blob-service-properties update](/cli/azure/storage/account/blob-service-properties#az-storage-account-blob-service-properties-update) command. Remember to replace values in angle brackets with your own values:

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
    --name dest-container-2 \
    --auth-mode login
```

Create a new replication policy and an associated rule on the destination account by calling the [az storage account or-policy create](/cli/azure/storage/account/or-policy#az-storage-account-or-policy-create).

```azurecli
az storage account or-policy create \
    --account-name <dest-storage-account> \
    --resource-group <resource-group> \
    --source-account <source-storage-account> \
    --destination-account <dest-storage-account> \
    --source-container source-container-1 \
    --destination-container dest-container-1 \
    --min-creation-time '2021-09-01T00:00:00Z' \
    --prefix-match a

```

Azure Storage sets the policy ID for the new policy when it is created. To add additional rules to the policy, call the [az storage account or-policy rule add](/cli/azure/storage/account/or-policy/rule#az-storage-account-or-policy-rule-add) and provide the policy ID.

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

## Configure object replication using a JSON file

If you don't have permissions to the source storage account or if you want to use more than 10 container pairs, then you can configure object replication on the destination account and provide a JSON file that contains the policy definition to another user to create the same policy on the source account. For example, if the source account is in a different Microsoft Entra tenant from the destination account, then you can use this approach to configure object replication.

For information about how to author a JSON file that contains the policy definition, see [Policy definition file](object-replication-overview.md#policy-definition-file).

> [!NOTE]
> Cross-tenant object replication is permitted by default for a storage account. To prevent replication across tenants, you can set the **AllowCrossTenantReplication** property to disallow cross-tenant object replication for your storage accounts. For more information, see [Prevent object replication across Microsoft Entra tenants](object-replication-prevent-cross-tenant-policies.md).

The examples in this section show how to configure the object replication policy on the destination account, and then get the JSON file for that policy that another user can use to configure the policy on the source account.

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

Keep in mind that uploading a JSON file to create a replication policy for the destination account via the Azure portal doesn't automatically create the same policy in the source account. Another user must create the policy on the source account before Azure Storage begins replicating objects.

# [PowerShell](#tab/powershell)

To download a JSON file that contains the replication policy definition for the destination account from PowerShell, call the [Get-AzStorageObjectReplicationPolicy](/powershell/module/az.storage/get-azstorageobjectreplicationpolicy) command to return the policy. Then convert the policy to JSON and save it as a local file, as shown in the following example. Remember to replace values in angle brackets and the file path with your own values:

```powershell
$rgName = "<resource-group>"
$destAccountName = "<destination-storage-account>"

$destPolicy = Get-AzStorageObjectReplicationPolicy -ResourceGroupName $rgName `
    -StorageAccountName $destAccountName
$destPolicy | ConvertTo-Json -Depth 5 > c:\temp\json.txt
```

To use the JSON file to define the replication policy on the source account with PowerShell, retrieve the local file and convert from JSON to an object. Then call the [Set-AzStorageObjectReplicationPolicy](/powershell/module/az.storage/set-azstorageobjectreplicationpolicy) command to configure the policy on the source account, as shown in the following example.

When running the example, be sure to set the `-ResourceGroupName` parameter to the resource group for the source account, and the `-StorageAccountName` parameter to the name of the source account. Also, remember to replace values in angle brackets and the file path with your own values:

```powershell
$object = Get-Content -Path C:\temp\json.txt | ConvertFrom-Json
Set-AzStorageObjectReplicationPolicy -ResourceGroupName $rgName `
    -StorageAccountName $srcAccountName `
    -PolicyId $object.PolicyId `
    -SourceAccount $object.SourceAccount `
    -DestinationAccount $object.DestinationAccount `
    -Rule $object.Rules
```

# [Azure CLI](#tab/azure-cli)

To write the replication policy definition for the destination account to a JSON file from Azure CLI, call the [az storage account or-policy show](/cli/azure/storage/account/or-policy#az-storage-account-or-policy-show) command and output to a file.

The following example writes the policy definition to a JSON file named *policy.json*. Remember to replace values in angle brackets and the file path with your own values:

```azurecli
az storage account or-policy show \
    --account-name <dest-account-name> \
    --policy-id  <policy-id> > policy.json
```

To use the JSON file to configure the replication policy on the source account with Azure CLI, call the [az storage account or-policy create](/cli/azure/storage/account/or-policy#az-storage-account-or-policy-create) command and reference the *policy.json* file. Remember to replace values in angle brackets and the file path with your own values:

```azurecli
az storage account or-policy create \
    -resource-group <resource-group> \
    --source-account <source-account-name> \
    --policy @policy.json
```

---

## Check the replication status of a blob

You can check the replication status for a blob in the source account using the Azure portal, PowerShell, or Azure CLI. Object replication properties aren't populated until replication has either completed or failed.

# [Azure portal](#tab/portal)

To check the replication status for a blob in the source account in the Azure portal, follow these steps:

1. Navigate to the source account in the Azure portal.
1. Locate the container that includes the source blob.
1. Select the blob to display its properties. If the blob has been replicated successfully, you'll see in the **Object replication** section that the status is set to *Complete*. The replication policy ID and the ID for the rule governing object replication for this container are also listed.

:::image type="content" source="media/object-replication-configure/check-replication-status-source.png" alt-text="Screenshot showing replication status for a blob in the source account":::

# [PowerShell](#tab/powershell)

To check the replication status for a blob in the source account with PowerShell, get the value of the object replication **ReplicationStatus** property, as shown in the following example. Remember to replace values in angle brackets with your own values:

```powershell
$ctxSrc = (Get-AzStorageAccount -ResourceGroupName $rgName `
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
1. Select the **More** button next to the policy name.
1. Select **Delete Rules**.

# [PowerShell](#tab/powershell)

To remove a replication policy, delete the policy from both the source account and the destination account. Deleting the policy also deletes any rules associated with it.

```powershell
# Remove the policy from the destination account.
Remove-AzStorageObjectReplicationPolicy -ResourceGroupName $rgName `
    -StorageAccountName $destAccountName `
    -PolicyId $destPolicy.PolicyId

# Remove the policy from the source account.
Remove-AzStorageObjectReplicationPolicy -ResourceGroupName $rgName `
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

- [Object replication for block blobs](object-replication-overview.md)
- [Prevent object replication across Microsoft Entra tenants](object-replication-prevent-cross-tenant-policies.md)
- [Enable and manage blob versioning](versioning-enable.md)
- [Process change feed in Azure Blob storage](storage-blob-change-feed-how-to.md)
