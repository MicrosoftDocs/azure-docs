---
title: Configure immutability policies for blob versions
titleSuffix: Azure Storage
description: Learn how to configure an immutability policy that is scoped to a blob version. Immutability policies provide WORM (Write Once, Read Many) support for Blob Storage by storing data in a non-erasable, non-modifiable state.
services: storage
author: normesta

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 09/14/2022
ms.author: normesta
ms.devlang: powershell, azurecli
ms.custom: devx-track-azurepowershell, devx-track-azurecli 
---

# Configure immutability policies for blob versions

Immutable storage for Azure Blob Storage enables users to store business-critical data in a WORM (Write Once, Read Many) state. While in a WORM state, data can't be modified or deleted for a user-specified interval. By configuring immutability policies for blob data, you can protect your data from overwrites and deletes. Immutability policies include time-based retention policies and legal holds. For more information about immutability policies for Blob Storage, see [Store business-critical blob data with immutable storage](immutable-storage-overview.md).

An immutability policy may be scoped either to an individual blob version or to a container. This article describes how to configure a version-level immutability policy. To learn how to configure container-level immutability policies, see [Configure immutability policies for containers](immutable-policy-configure-container-scope.md).

> [!NOTE]
> Immutability policies are not supported in accounts that have the Network File System (NFS) 3.0 protocol or the SSH File Transfer Protocol (SFTP) enabled on them.

Configuring a version-level immutability policy is a two-step process:

1. First, enable support for version-level immutability on a new storage account or on a new or existing container. See [Enable support for version-level immutability](#enable-support-for-version-level-immutability) for details.
1. Next, configure a time-based retention policy or legal hold that applies to one or more blob versions in that container.

## Prerequisites

To configure version-level time-based retention policies, blob versioning must be enabled for the storage account. Keep in mind that enabling blob versioning may have a billing impact. To learn how to enable blob versioning, see [Enable and manage blob versioning](versioning-enable.md).

For information about supported storage account configurations for version-level immutability policies, see [Supported account configurations](immutable-storage-overview.md#supported-account-configurations).

## Enable support for version-level immutability

Before you can apply a time-based retention policy to a blob version, you must enable support for version-level immutability. You can enable support for version-level immutability on a new storage account, or on a new or existing container.

### Enable version-level immutability support on a storage account

You can enable support for version-level immutability only when you create a new storage account.

##### [Portal](#tab/azure-portal)

To enable support for version-level immutability when you create a storage account in the Azure portal, follow these steps:

1. Navigate to the **Storage accounts** page in the Azure portal.
1. Select the **Create** button to create a new account.
1. Fill out the **Basics** tab.
1. On the **Data protection** tab, under Access control, select **Enable version-level immutability support**. When you check this box, the box for **Enable versioning for blobs** is also automatically checked.
1. Select **Review + Create** to validate your account parameters and create the storage account.

    :::image type="content" source="media/immutable-policy-configure-version-scope/create-account-version-level-immutability.png" alt-text="Screenshot showing how to create a storage account with version-level immutability support":::

After the storage account is created, you can configure a default version-level policy for the account. For more information, see [Configure a default time-based retention policy](#configure-a-default-time-based-retention-policy).

##### [PowerShell](#tab/azure-powershell)

N/A

##### [Azure CLI](#tab/azure-cli)

To enable support for version-level immutability when you create a storage account with Azure CLI, call the [az storage account create](/cli/azure/storage/account#az-storage-account-create) command with the `--enable-alw` parameter specified. You can optionally specify a default policy for the storage account at the same time, as shown in the following example. Remember to replace placeholders in angle brackets with your own values:

```azurecli
az storage account create \
    --name <storage-account> \
    --resource-group <resource-group> \
    --enable-alw \
    --immutability-period-in-days 90 \
    --immutability-state unlocked \
    --allow-protected-append-writes true
```

---

If version-level immutability support is enabled for the storage account and the account contains one or more containers, then you must delete all containers before you delete the storage account, even if there are no immutability policies in effect for the account or containers.

> [!NOTE]
> Version-level immutability cannot be disabled after it is enabled on the storage account, although locked policies can be deleted.

### Enable version-level immutability support on a container

Both new and existing containers can be configured to support version-level immutability. However, an existing container must undergo a migration process in order to enable support.

Keep in mind that enabling version-level immutability support for a container doesn't make data in that container immutable. You must also either configure a default immutability policy for the container, or an immutability policy on a specific blob version. If you enabled version-level immutability for the storage account when it was created, you can also configure a default immutability policy for the account.

#### Enable version-level immutability for a new container

To use a version-level immutability policy, you must first explicitly enable support for version-level WORM on the container. You can enable support for version-level WORM either when you create the container, or when you add a version-level immutability policy to an existing container.

##### [Portal](#tab/azure-portal)

To create a container that supports version-level immutability in the Azure portal, follow these steps:

1. Navigate to the **Containers** page for your storage account in the Azure portal, and select **Add**.
1. In the **New container** dialog, provide a name for your container, then expand the **Advanced** section.
1. Select **Enable version-level immutability support** to enable version-level immutability for the container.

    :::image type="content" source="media/immutable-policy-configure-version-scope/create-container-version-level-immutability.png" alt-text="Screenshot showing how to create a container with version-level immutability enabled":::

##### [PowerShell](#tab/azure-powershell)

To create a container that supports version-level immutability with PowerShell, first install the [Az.Storage module](https://www.powershellgallery.com/packages/Az.Storage), version 3.12.0 or later.

Next, call the **New-AzRmStorageContainer** command with the `-EnableImmutableStorageWithVersioning` parameter, as shown in the following example. Remember to replace placeholders in angle brackets with your own values:

```azurepowershell
# Create a container with version-level immutability support.
$container = New-AzRmStorageContainer -ResourceGroupName <resource-group> `
    -StorageAccountName <storage-account> `
    -Name <container> `
    -EnableImmutableStorageWithVersioning

# Verify that version-level immutability support is enabled for the container
$container.ImmutableStorageWithVersioning
```

##### [Azure CLI](#tab/azure-cli)

To create a container that supports version-level immutability with Azure CLI, first install Azure CLI version 2.27 or later. For more information about installing Azure CLI, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

Next, call the [az storage container-rm create](/cli/azure/storage/container-rm#az-storage-container-rm-create) command, specifying the `--enable-vlw` parameter. Remember to replace placeholders in angle brackets with your own values:

```azurecli
# Create a container with version-level immutability support.
az storage container-rm create \
    --name <container> \
    --storage-account <storage-account> \
    --resource-group <resource-group> \
    --enable-vlw

# Verify that version-level immutability support is enabled for the container
az storage container-rm show \
    --storage-account <storage-account> \
    --name <container> \
    --query '[immutableStorageWithVersioning.enabled]' \
    --output tsv
```

---

If version-level immutability support is enabled for a container and the container contains one or more blobs, then you must delete all blobs in the container before you can delete the container, even if there are no immutability policies in effect for the container or its blobs.

#### Migrate an existing container to support version-level immutability

To configure version-level immutability policies for an existing container, you must migrate the container to support version-level immutable storage. Container migration may take some time and can't be reversed. You can migrate 10 containers at a time per storage account.

To migrate an existing container to support version-level immutability policies, the container must have a container-level time-based retention policy configured. The migration fails unless the container has an existing policy. The retention interval for the container-level policy is maintained as the retention interval for the default version-level policy on the container.

If the container has an existing container-level legal hold, then it can't be migrated until the legal hold is removed.

##### [Portal](#tab/azure-portal)

To migrate a container to support version-level immutability policies in the Azure portal, follow these steps:

1. Navigate to the desired container.
1. Select the **More** button on the right, then select **Access policy**.
1. Under **Immutable blob storage**, select **Add policy**.
1. For the **Policy type** field, choose *Time-based retention*, and specify the retention interval.
1. Select **Enable version-level immutability**.
1. Select **OK** to create a container-level policy with the specified retention interval and then begin the migration to version-level immutability support.

    :::image type="content" source="media/immutable-policy-configure-version-scope/migrate-existing-container.png" alt-text="Screenshot showing how to migrate an existing container to support version-level immutability":::

While the migration operation is underway, the scope of the policy on the container shows as *Container*. Any operations related to managing version-level immutability policies aren't permitted while the container migration is in progress. Other operations on blob data will proceed normally during migration.

:::image type="content" source="media/immutable-policy-configure-version-scope/container-migration-in-process.png" alt-text="Screenshot showing container migration in process":::

After the migration is complete, the scope of the policy on the container shows as *Version*. The policy shown is a default policy on the container that automatically applies to all blob versions subsequently created in the container. The default policy can be overridden on any version by specifying a custom policy for that version.

:::image type="content" source="media/immutable-policy-configure-version-scope/container-migration-complete.png" alt-text="Screenshot showing completed container migration":::

##### [PowerShell](#tab/azure-powershell)

To migrate a container to support version-level immutable storage with PowerShell, first make sure that a container-level time-based retention policy exists for the container. To create one, call [Set-AzRmStorageContainerImmutabilityPolicy](/powershell/module/az.storage/set-azrmstoragecontainerimmutabilitypolicy).

```azurepowershell
Set-AzRmStorageContainerImmutabilityPolicy -ResourceGroupName <resource-group> `
   -StorageAccountName <storage-account> `
   -ContainerName <container> `
   -ImmutabilityPeriod <retention-interval-in-days>
```

Next, call the **Invoke-AzRmStorageContainerImmutableStorageWithVersioningMigration** command to migrate the container. Include the `-AsJob` parameter to run the command asynchronously. Running the operation asynchronously is recommended, as the migration may take some time to complete.

```azurepowershell
$migrationOperation = Invoke-AzRmStorageContainerImmutableStorageWithVersioningMigration `
    -ResourceGroupName <resource-group> `
    -StorageAccountName <storage-account> `
    -Name <container> `
    -AsJob
```

To check the status of the long-running operation, read the operation's **JobStateInfo.State** property.

```azurepowershell
$migrationOperation.JobStateInfo.State
```

If the container doesn't have an existing time-based retention policy when you attempt to migrate to version-level immutability, then the operation fails. The following example checks the value of the **JobStateInfo.State** property and displays the error message if the operation failed because the container-level policy doesn't exist.

```azurepowershell
if ($migrationOperation.JobStateInfo.State -eq "Failed") {
Write-Host $migrationOperation.Error
}
The container <container-name> must have an immutability policy set as a default policy
before initiating container migration to support object level immutability with versioning.
```

After the migration is complete, check the **Output** property of the operation to see that support for version-level immutability is enabled.

```azurepowershell
$migrationOperation.Output
```

For more information about PowerShell jobs, see [Run Azure PowerShell cmdlets in PowerShell Jobs](/powershell/azure/using-psjobs).

##### [Azure CLI](#tab/azure-cli)

To migrate a container to support version-level immutable storage with Azure CLI, first make sure that a container-level time-based retention policy exists for the container. To create one, call [az storage container immutability-policy create](/cli/azure/storage/container/immutability-policy#az-storage-container-immutability-policy-create).

```azurecli
az storage container immutability-policy create \
    --resource-group <resource-group> \
    --account-name <storage-account> \
    --container-name <container> \
    --period <retention-interval-in-days>
```

Next, call the [az storage container-rm migrate-vlw](/cli/azure/storage/container-rm#az-storage-container-rm-migrate-vlw) command to migrate the container. Include the `--no-wait` parameter to run the command asynchronously. Running the operation asynchronously is recommended, as the migration may take some time to complete.

```azurecli
az storage container-rm migrate-vlw \
    --resource-group <resource-group> \
    --storage-account <storage-account> \
    --name <container> \
    --no-wait
```

To check the status of the long-running operation, read the value of the **migrationState** property.

```azurecli
az storage container-rm show \
    --storage-account <storage-account> \
    --name <container> \
    --query '[immutableStorageWithVersioning.migrationState]' \
    --output tsv
```

---

## Configure a default time-based retention policy

After you have enabled version-level immutability support for a storage account or for an individual container, you can specify a default version-level time-based retention policy for the account or container. When you specify a default policy for an account or container, that policy applies by default to all new blob versions that are created in the account or container. You can override the default policy for any individual blob version in the account or container.

The default policy isn't automatically applied to blob versions that existed before the default policy was configured.

If you migrated an existing container to support version-level immutability, then the container-level policy that was in effect before the migration is migrated to a default version-level policy for the container.

To configure a default version-level immutability policy for a storage account or container, use the Azure portal, PowerShell, Azure CLI, or one of the Azure Storage SDKs. Make sure that you have enabled support for version-level immutability for the storage account or container, as described in [Enable support for version-level immutability](#enable-support-for-version-level-immutability).

#### [Portal](#tab/azure-portal)

To configure a default version-level immutability policy for a storage account in the Azure portal, follow these steps:

1. In the Azure portal, navigate to your storage account.
1. Under **Data management**, select **Data protection**.
1. On the **Data protection** page, locate the **Access control** section. If the storage account was created with support for version-level immutability, then the **Manage policy** button appears in the **Access control** section.

    :::image type="content" source="media/immutable-policy-configure-version-scope/manage-default-policy-account.png" alt-text="Screenshot showing how to manage the default version-level immutability policy for a storage account ":::

1. Select the **Manage policy** button to display the **Manage version-level immutability policy** dialog.
1. Add a default time-based retention policy for the storage account.

    :::image type="content" source="media/immutable-policy-configure-version-scope/configure-default-retention-policy-account.png" alt-text="Screenshot showing how to configure a default version-level retention policy for a storage account":::

To configure a default version-level immutability policy for a container in the Azure portal, follow these steps:

1. In the Azure portal, navigate to the **Containers** page, and locate the container to which you want to apply the policy.
2. Select the **More** button to the right of the container name, and choose **Access policy**.
3. In the **Access policy** dialog, under the **Immutable blob storage** section, choose **Add policy**.
4. Select **Time-based retention policy** and specify the retention interval.
5. Choose whether to allow protected append writes. 

   The **Append blobs** option enables your workloads to add new blocks of data to the end of an append blob by using the [Append Block](/rest/api/storageservices/append-block) operation.

   The **Block and append blobs** option extends this support by adding the ability to write new blocks to a block blob.  The Blob Storage API does not provide a way for applications to do this directly. However, applications can accomplish this by using append and flush methods that are available in the Data Lake Storage Gen2 API. Also, this property enables Microsoft applications such as Azure Data Factory to append blocks of data by using internal APIs. If your workloads depend on any of these tools, then you can use this property to avoid errors that can appear when those tools attempt to append data to blobs.

   To learn more about these options, see [Allow protected append blobs writes](immutable-time-based-retention-policy-overview.md#allow-protected-append-blobs-writes).

    :::image type="content" source="media/immutable-policy-configure-version-scope/configure-retention-policy-container-scope.png" alt-text="Screenshot showing how to configure immutability policy scoped to container.":::

#### [PowerShell](#tab/azure-powershell)

To configure a default version-level immutability policy for a container with PowerShell, call the [Set-AzRmStorageContainerImmutabilityPolicy](/powershell/module/az.storage/set-azrmstoragecontainerimmutabilitypolicy) command.

```azurepowershell
Set-AzRmStorageContainerImmutabilityPolicy -ResourceGroupName <resource-group> `
   -StorageAccountName <storage-account> `
   -ContainerName <container> `
   -ImmutabilityPeriod <retention-interval-in-days> `
   -AllowProtectedAppendWrite $true
```

#### [Azure CLI](#tab/azure-cli)

To configure a default version-level immutability policy for a container with Azure CLI, call the [az storage container immutability-policy create](/cli/azure/storage/container/immutability-policy#az-storage-container-immutability-policy-create) command.

```azurecli
az storage container immutability-policy create \
    --account-name <storage-account> \
    --container-name <container> \
    --period <retention-interval-in-days> \
    --allow-protected-append-writes true
```

---

### Determine the scope of a retention policy on a container

To determine the scope of a time-based retention policy in the Azure portal, follow these steps:

1. Navigate to the desired container.
1. Select the **More** button on the right, then select **Access policy**.
1. Under **Immutable blob storage**, locate the **Scope** field. If the container is configured with a default version-level retention policy, then the scope is set to *Version*, as shown in the following image:

    :::image type="content" source="media/immutable-policy-configure-version-scope/version-scoped-retention-policy.png" alt-text="Screenshot showing default version-level retention policy configured for container":::

1. If the container is configured with a container-level retention policy, then the scope is set to *Container*, as shown in the following image:

    :::image type="content" source="media/immutable-policy-configure-version-scope/container-scoped-retention-policy.png" alt-text="Screenshot showing container-level retention policy configured for container":::

## Configure a time-based retention policy on an existing version

Time-based retention policies maintain blob data in a WORM state for a specified interval. For more information about time-based retention policies, see [Time-based retention policies for immutable blob data](immutable-time-based-retention-policy-overview.md).

You have three options for configuring a time-based retention policy for a blob version:

- Option 1: You can configure a default policy on the storage account or container that applies to all objects in the account or container. Objects in the account or container will inherit the default policy unless you explicitly override it by configuring a policy on an individual blob version. For more information, see [Configure a default time-based retention policy](#configure-a-default-time-based-retention-policy).
- Option 2: You can configure a policy on the current version of the blob. This policy can override a default policy configured on the storage account or container, if a default policy exists and it's unlocked. By default, any previous versions that are created after the policy is configured will inherit the policy on the current version of the blob. For more information, see [Configure a retention policy on the current version of a blob](#configure-a-retention-policy-on-the-current-version-of-a-blob).
- Option 3: You can configure a policy on a previous version of a blob. This policy can override a default policy configured on the current version, if one exists and it's unlocked. For more information, see [Configure a retention policy on a previous version of a blob](#configure-a-retention-policy-on-a-previous-version-of-a-blob).

For more information on blob versioning, see [Blob versioning](versioning-overview.md).

### [Portal](#tab/azure-portal)

The Azure portal displays a list of blobs when you navigate to a container. Each blob displayed represents the current version of the blob. You can access a list of previous versions by selecting the **More** button for a blob and choosing **View previous versions**.

### Configure a retention policy on the current version of a blob

To configure a time-based retention policy on the current version of a blob, follow these steps:

1. Navigate to the container that contains the target blob.
1. Select the **More** button to the right of the blob name, and choose **Access policy**. If a time-based retention policy has already been configured for the previous version, it appears in the **Access policy** dialog.
1. In the **Access policy** dialog, under the **Immutable blob versions** section, choose **Add policy**.
1. Select **Time-based retention policy** and specify the retention interval.
1. Select **OK** to apply the policy to the current version of the blob.

    :::image type="content" source="media/immutable-policy-configure-version-scope/configure-retention-policy-version.png" alt-text="Screenshot showing how to configure a retention policy for the current version of a blob":::

You can view the properties for a blob to see whether a policy is enabled on the current version. Select the blob, then navigate to the **Overview** tab and locate the **Version-level immutability policy** property. If a policy is enabled, the **Retention period** property will display the expiry date and time for the policy. Keep in mind that a policy may either be configured for the current version, or may be inherited from the blob's parent container if a default policy is in effect.

:::image type="content" source="media/immutable-policy-configure-version-scope/view-version-level-retention-policy-portal.png" alt-text="Screenshot showing immutability policy properties on blob version in Azure portal":::

### Configure a retention policy on a previous version of a blob

You can also configure a time-based retention policy on a previous version of a blob. A previous version is always immutable in that it can't be modified. However, a previous version can be deleted. A time-based retention policy protects against deletion while it is in effect.

To configure a time-based retention policy on a previous version of a blob, follow these steps:

1. Navigate to the container that contains the target blob.
1. Select the blob, then navigate to the **Versions** tab.
1. Locate the target version, then select the **More** button and choose **Access policy**. If a time-based retention policy has already been configured for the previous version, it appears in the **Access policy** dialog.
1. In the **Access policy** dialog, under the **Immutable blob versions** section, choose **Add policy**.
1. Select **Time-based retention policy** and specify the retention interval.
1. Select **OK** to apply the policy to the current version of the blob.

    :::image type="content" source="media/immutable-policy-configure-version-scope/configure-retention-policy-previous-version.png" alt-text="Screenshot showing how to configure retention policy for a previous blob version in Azure portal":::

### [PowerShell](#tab/azure-powershell)

To configure a time-based retention policy on a blob version with PowerShell, call the **Set-AzStorageBlobImmutabilityPolicy** command.

The following example shows how to configure an unlocked policy on the current version of a blob. Remember to replace placeholders in angle brackets with your own values:

```azurepowershell
# Get the storage account context
$ctx = (Get-AzStorageAccount `
        -ResourceGroupName <resource-group> `
        -Name <storage-account>).Context

Set-AzStorageBlobImmutabilityPolicy -Container <container> `
    -Blob <blob-version> `
    -Context $ctx `
    -ExpiresOn "2021-09-01T12:00:00Z" `
    -PolicyMode Unlocked
```

### [Azure CLI](#tab/azure-cli)

To configure a time-based retention policy on a blob version with Azure CLI, first install the Azure CLI, version 2.29.0 or later.

Next, call the **az storage blob immutability-policy set** command to configure the time-based retention policy. The following example shows how to configure an unlocked policy on the current version of a blob. Remember to replace placeholders in angle brackets with your own values:

```azurecli
az storage blob immutability-policy set \
    --expiry-time 2021-09-20T08:00:00Z \
    --policy-mode Unlocked \
    --container <container> \
    --name <blob-version> \
    --account-name <storage-account> \
    --auth-mode login
```

---

## Configure a time-based retention policy when uploading a blob

When you use the Azure portal to upload a blob to a container that supports version-level immutability, you have several options for configuring a time-based retention policy for the new blob:

- Option 1: If a default retention policy is configured for the container, you can upload the blob with the container's policy. This option is selected by default when there's a retention policy on the container.
- Option 2: If a default retention policy is configured for the container, you can choose to override the default policy, either by defining a custom retention policy for the new blob, or by uploading the blob with no policy.
- Option 3: If no default policy is configured for the container, then you can upload the blob with a custom policy, or with no policy.

To configure a time-based retention policy when you upload a blob, follow these steps:

1. Navigate to the desired container, and select **Upload**.
1. In the **Upload** blob dialog, expand the **Advanced** section.
1. Configure the time-based retention policy for the new blob in the **Retention policy** field. If there's a default policy configured for the container, that policy is selected by default. You can also specify a custom policy for the blob.

    :::image type="content" source="media/immutable-policy-configure-version-scope/configure-retention-policy-blob-upload.png" alt-text="Screenshot showing options for configuring retention policy on blob upload in Azure portal":::

## Modify or delete an unlocked retention policy

You can modify an unlocked time-based retention policy to shorten or lengthen the retention interval. You can also delete an unlocked policy. Editing or deleting an unlocked time-based retention policy for a blob version doesn't affect policies in effect for any other versions. If there's a default time-based retention policy in effect for the container, then the blob version with the modified or deleted policy will no longer inherit from the container.

### [Portal](#tab/azure-portal)

To modify an unlocked time-based retention policy in the Azure portal, follow these steps:

1. Locate the target container or version. Select the **More** button and choose **Access policy**.
1. Locate the existing unlocked immutability policy. Select the **More** button, then select **Edit** from the menu.

    :::image type="content" source="media/immutable-policy-configure-version-scope/edit-existing-version-policy.png" alt-text="Screenshot showing how to edit an existing version-level time-based retention policy in Azure portal":::

1. Provide the new date and time for the policy expiration.

To delete the unlocked policy, select **Delete** from the **More** menu.

### [PowerShell](#tab/azure-powershell)

To modify an unlocked time-based retention policy with PowerShell, call the **Set-AzStorageBlobImmutabilityPolicy** command on the blob version with the new date and time for the policy expiration. Remember to replace placeholders in angle brackets with your own values:

```azurepowershell
$containerName = "<container>"
$blobName = "<blob>"

# Get the previous blob version.
$blobVersion = Get-AzStorageBlob -Container $containerName `
    -Blob $blobName `
    -VersionId "2021-08-31T00:26:41.2273852Z" `
    -Context $ctx

# Extend the retention interval by five days.
$blobVersion = $blobVersion |
    Set-AzStorageBlobImmutabilityPolicy -ExpiresOn (Get-Date).AddDays(5) `

# View the new policy parameters.
$blobVersion.BlobProperties.ImmutabilityPolicy
```

To delete an unlocked retention policy, call the **Remove-AzStorageBlobImmutabilityPolicy** command.

```azurepowershell
$blobVersion = $blobVersion | Remove-AzStorageBlobImmutabilityPolicy
```

#### [Azure CLI](#tab/azure-cli)

To modify an unlocked time-based retention policy with PowerShell, call the **az storage blob immutability-policy set** command on the blob version with the new date and time for the policy expiration. Remember to replace placeholders in angle brackets with your own values:

```azurecli
az storage blob immutability-policy set \
    --expiry-time 2021-10-0T18:00:00Z \
    --policy-mode Unlocked \
    --container <container> \
    --name <blob-version> \
    --account-name <storage-account> \
    --auth-mode login
```

To delete an unlocked retention policy, call the **az storage blob immutability-policy delete** command.

```azurecli
az storage blob immutability-policy delete \
    --container <container> \
    --name <blob-version> \
    --account-name <storage-account> \
    --auth-mode login
```

---

## Lock a time-based retention policy

When you have finished testing a time-based retention policy, you can lock the policy. A locked policy is compliant with SEC 17a-4(f) and other regulatory compliance. You can lengthen the retention interval for a locked policy up to five times, but you can't shorten it.

After a policy is locked, you can't delete it. However, you can delete the blob after the retention interval has expired.

### [Portal](#tab/azure-portal)

To lock a policy in the Azure portal, follow these steps:

1. Locate the target container or version. Select the **More** button and choose **Access policy**.
1. Under the **Immutable blob versions** section, locate the existing unlocked policy. Select the **More** button, then select **Lock policy** from the menu.
1. Confirm that you want to lock the policy.

    :::image type="content" source="media/immutable-policy-configure-version-scope/lock-policy-portal.png" alt-text="Screenshot showing how to lock a time-based retention policy in Azure portal":::

### [PowerShell](#tab/azure-powershell)

To lock a policy with PowerShell, call the **Set-AzStorageBlobImmutabilityPolicy** command and set the **PolicyMode** parameter to *Locked*.

The following example shows how to lock a policy by specifying the same retention interval that was in effect for the unlocked policy. You can also change the expiry at the time that you lock the policy.

```azurepowershell
# Get the previous blob version.
$blobVersion = Get-AzStorageBlob -Container $containerName `
    -Blob $blobName `
    -VersionId "2021-08-31T00:26:41.2273852Z" `
    -Context $ctx

$blobVersion = $blobVersion |
    Set-AzStorageBlobImmutabilityPolicy `
        -ExpiresOn $blobVersion.BlobProperties.ImmutabilityPolicy.ExpiresOn `
        -PolicyMode Locked
```

### [Azure CLI](#tab/azure-cli)

To lock a policy with PowerShell, call the **az storage blob immutability-policy set** command and set the `--policy-mode` parameter to *Locked*. You can also change the expiry at the time that you lock the policy.

```azurecli
az storage blob immutability-policy set \
    --expiry-time 2021-10-0T18:00:00Z \
    --policy-mode Locked \
    --container <container> \
    --name <blob-version> \
    --account-name <storage-account> \
    --auth-mode login
```

---

## Configure or clear a legal hold

A legal hold stores immutable data until the legal hold is explicitly cleared. To learn more about legal hold policies, see [Legal holds for immutable blob data](immutable-legal-hold-overview.md).

To configure a legal hold on a blob version, you must first enable version-level immutability support on the storage account or container. For more information, see [Enable support for version-level immutability](#enable-support-for-version-level-immutability).

#### [Portal](#tab/azure-portal)

To configure a legal hold on a blob version with the Azure portal, follow these steps:

1. Locate the target version, which may be the current version or a previous version of a blob. Select the **More** button and choose **Access policy**.

2. Under the **Immutable blob versions** section, select **Add policy**.

3. Choose **Legal hold** as the policy type, and select **OK** to apply it.

The following image shows a current version of a blob with both a time-based retention policy and legal hold configured.

:::image type="content" source="media/immutable-policy-configure-version-scope/configure-legal-hold-blob-version.png" alt-text="Screenshot showing legal hold configured for blob version":::

To clear a legal hold, navigate to the **Access policy** dialog, select the **More** button, and choose **Delete**.

#### [PowerShell](#tab/azure-powershell)

To configure or clear a legal hold on a blob version with PowerShell, call the **Set-AzStorageBlobLegalHold** command.

```azurepowershell
# Set a legal hold
Set-AzStorageBlobLegalHold -Container <container> `
    -Blob <blob-version> `
    -Context $ctx `
    -EnableLegalHold

# Clear a legal hold
Set-AzStorageBlobLegalHold -Container <container> `
    -Blob <blob-version> `
    -Context $ctx `
    -DisableLegalHold
```

#### [Azure CLI](#tab/azure-cli)

To configure or clear a legal hold on a blob version with Azure CLI, call the **az storage blob set-legal-hold** command.

```azurecli
# Set a legal hold
az storage blob set-legal-hold \
    --legal-hold \
    --container <container> \
    --name <blob-version> \
    --account-name <account-name> \
    --auth-mode login

# Clear a legal hold
az storage blob set-legal-hold \
    --legal-hold false \
    --container <container> \
    --name <blob-version> \
    --account-name <account-name> \
    --auth-mode login
```

---

## Next steps

- [Store business-critical blob data with immutable storage](immutable-storage-overview.md)
- [Time-based retention policies for immutable blob data](immutable-time-based-retention-policy-overview.md)
- [Legal holds for immutable blob data](immutable-legal-hold-overview.md)
