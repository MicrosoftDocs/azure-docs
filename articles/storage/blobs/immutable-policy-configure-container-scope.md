---
title: Configure immutability policies for containers
titleSuffix: Azure Storage
description: Learn how to configure an immutability policy that is scoped to a container. Immutability policies provide WORM (Write Once, Read Many) support for Blob Storage by storing data in a non-erasable, non-modifiable state.
services: storage
author: normesta

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 09/14/2022
ms.author: normesta
ms.devlang: powershell, azurecli
ms.custom: devx-track-azurepowershell, devx-track-azurecli 
---

# Configure immutability policies for containers

Immutable storage for Azure Blob Storage enables users to store business-critical data in a WORM (Write Once, Read Many) state. While in a WORM state, data cannot be modified or deleted for a user-specified interval. By configuring immutability policies for blob data, you can protect your data from overwrites and deletes. Immutability policies include time-based retention policies and legal holds. For more information about immutability policies for Blob Storage, see [Store business-critical blob data with immutable storage](immutable-storage-overview.md).

An immutability policy may be scoped either to an individual blob version or to a container. This article describes how to configure a container-level immutability policy. To learn how to configure version-level immutability policies, see [Configure immutability policies for blob versions](immutable-policy-configure-version-scope.md).

> [!NOTE]
> Immutability policies are not supported in accounts that have the Network File System (NFS) 3.0 protocol or the SSH File Transfer Protocol (SFTP) enabled on them.

## Configure a retention policy on a container

To configure a time-based retention policy on a container, use the Azure portal, PowerShell, or Azure CLI. You can configure a container-level retention policy for between 1 and 146000 days.

### [Portal](#tab/azure-portal)

To configure a time-based retention policy on a container with the Azure portal, follow these steps:

1. Navigate to the desired container.

2. Select the **More** button on the right, then select **Access policy**.

3. In the **Immutable blob storage** section, select **Add policy**.

4. In the **Policy type** field, select **Time-based retention**, and specify the retention period in days.

5. To create a policy with container scope, do not check the box for **Enable version-level immutability**.

6. Choose whether to allow protected append writes. 

   The **Append blobs** option enables your workloads to add new blocks of data to the end of an append blob by using the [Append Block](/rest/api/storageservices/append-block) operation.

   The **Block and append blobs** option provides you with the same permissions as the **Append blobs** option but adds the ability to write new blocks to a block blob.  The Blob Storage API does not provide a way for applications to do this directly. However, applications can accomplish this by using append and flush methods that are available in the Data Lake Storage Gen2 API. Also, some Microsoft applications use internal APIs to create block blobs and then append to them. If your workloads depend on any of these tools, then you can use this property to avoid errors that can appear when those tools attempt to append blocks to a block blob. 

   To learn more about these options, see [Allow protected append blobs writes](immutable-time-based-retention-policy-overview.md#allow-protected-append-blobs-writes).

    :::image type="content" source="media/immutable-policy-configure-container-scope/configure-retention-policy-container-scope.png" alt-text="Screenshot showing how to configure immutability policy scoped to container":::

After you've configured the immutability policy, you will see that it is scoped to the container:

:::image type="content" source="media/immutable-policy-configure-container-scope/view-retention-policy-container-scope.png" alt-text="Screenshot showing an existing immutability policy that is scoped to the container":::

### [PowerShell](#tab/azure-powershell)

To configure a time-based retention policy on a container with PowerShell, call the [Set-AzRmStorageContainerImmutabilityPolicy](/powershell/module/az.storage/set-azrmstoragecontainerimmutabilitypolicy) command, providing the retention interval in days. Remember to replace placeholder values in angle brackets with your own values:

```azurepowershell
Set-AzRmStorageContainerImmutabilityPolicy -ResourceGroupName <resource-group> `
    -StorageAccountName <storage-account> `
    -ContainerName <container> `
    -ImmutabilityPeriod 10
```

To allow protected append writes, set the `-AllowProtectedAppendWrite` or  `-AllowProtectedAppendWriteAll` parameter to `true`. 

The **AllowProtectedAppendWrite** option enables your workloads to add new blocks of data to the end of an append blob by using the [Append Block](/rest/api/storageservices/append-block) operation.

The **AllowProtectedAppendWriteAll** option provides you with the same permissions as the **AllowProtectedAppendWrite** option but adds the ability to write new blocks to a block blob.  The Blob Storage API does not provide a way for applications to do this directly. However, applications can accomplish this by using append and flush methods that are available in the Data Lake Storage Gen2 API. Also, some Microsoft applications use internal APIs to create block blobs and then append to them. If your workloads depend on any of these tools, then you can use this property to avoid errors that can appear when those tools attempt to append blocks to a block blob.

To learn more about these options, see [Allow protected append blobs writes](immutable-time-based-retention-policy-overview.md#allow-protected-append-blobs-writes).

### [Azure CLI](#tab/azure-cli)

To configure a time-based retention policy on a container with Azure CLI, call the [az storage container immutability-policy create](/cli/azure/storage/container/immutability-policy#az-storage-container-immutability-policy-create) command, providing the retention interval in days. Remember to replace placeholder values in angle brackets with your own values:

```azurecli
az storage container immutability-policy create \
    --resource-group <resource-group> \
    --account-name <storage-account> \
    --container-name <container> \
    --period 10
```

To allow protected append writes, set the `--allow-protected-append-writes` or  `--allow-protected-append-writes-all` parameter to `true`. 

The **--allow-protected-append-writes** option enables your workloads to add new blocks of data to the end of an append blob by using the [Append Block](/rest/api/storageservices/append-block) operation.

The **--allow-protected-append-writes-all** option provides you with the same permissions as the **--allow-protected-append-writes** option but adds the ability to write new blocks to a block blob.  The Blob Storage API does not provide a way for applications to do this directly. However, applications can accomplish this by using append and flush methods that are available in the Data Lake Storage Gen2 API. Also, some Microsoft applications use internal APIs to create block blobs and then append to them. If your workloads depend on any of these tools, then you can use this property to avoid errors that can appear when those tools attempt to append blocks to a block blob.

To learn more about these options, see [Allow protected append blobs writes](immutable-time-based-retention-policy-overview.md#allow-protected-append-blobs-writes).

---

## Modify an unlocked retention policy

You can modify an unlocked time-based retention policy to shorten or lengthen the retention interval and to allow additional writes to append blobs in the container. You can also delete an unlocked policy.

### [Portal](#tab/azure-portal)

To modify an unlocked time-based retention policy in the Azure portal, follow these steps:

1. Navigate to the desired container.
1. Select the **More** button and choose **Access policy**.
1. Under the **Immutable blob versions** section, locate the existing unlocked policy. Select the **More** button, then select **Edit** from the menu.
1. Provide a new retention interval for the policy. You can also select **Allow additional protected appends** to permit writes to protected append blobs.

    :::image type="content" source="media/immutable-policy-configure-container-scope/modify-retention-policy-container-scope.png" alt-text="Screenshot showing how to modify an unlocked time-based retention policy":::

To delete an unlocked policy, select the **More** button, then **Delete**.

> [!NOTE]
> You can enable version-level immutability policies by selecting the Enable version-level immutability checkbox. For more information about enabling version-level immutability policies, see [Configure immutability policies for blob versions](immutable-policy-configure-version-scope.md).

### [PowerShell](#tab/azure-powershell)

To modify an unlocked policy, first retrieve the policy by calling the [Get-AzRmStorageContainerImmutabilityPolicy](/powershell/module/az.storage/get-azrmstoragecontainerimmutabilitypolicy) command. Next, call the [Set-AzRmStorageContainerImmutabilityPolicy](/powershell/module/az.storage/set-azrmstoragecontainerimmutabilitypolicy) command to update the policy. Include the new retention interval in days and the `-ExtendPolicy` parameter. Remember to replace placeholder values in angle brackets with your own values:

```azurepowershell
$policy = Get-AzRmStorageContainerImmutabilityPolicy -ResourceGroupName <resource-group> `
    -AccountName <storage-account> `
    -ContainerName <container>

Set-AzRmStorageContainerImmutabilityPolicy -ResourceGroupName <resource-group> `
    -StorageAccountName <storage-account> `
    -ContainerName <container> `
    -ImmutabilityPeriod 21 `
    -AllowProtectedAppendWriteAll true `
    -Etag $policy.Etag `
    -ExtendPolicy
```

To delete an unlocked policy, call the [Remove-AzRmStorageContainerImmutabilityPolicy](/powershell/module/az.storage/remove-azrmstoragecontainerimmutabilitypolicy) command.

```azurepowershell
Remove-AzRmStorageContainerImmutabilityPolicy -ResourceGroupName <resource-group> `
    -AccountName <storage-account> `
    -ContainerName <container>
    -Etag $policy.Etag
```

### [Azure CLI](#tab/azure-cli)

To modify an unlocked time-based retention policy with Azure CLI, call the [az storage container immutability-policy extend](/cli/azure/storage/container/immutability-policy#az-storage-container-immutability-policy-extend) command, providing the new retention interval in days. Remember to replace placeholder values in angle brackets with your own values:

```azurecli
$etag=$(az storage container immutability-policy show \
        --account-name <storage-account> \
        --container-name <container> \
        --query etag \
        --output tsv)

az storage container immutability-policy extend \
    --resource-group <resource-group> \
    --account-name <storage-account> \
    --container-name <container> \
    --period 21 \
    --if-match $etag \
    --allow-protected-append-writes-all true
```

To delete an unlocked policy, call the [az storage container immutability-policy delete](/cli/azure/storage/container/immutability-policy#az-storage-container-immutability-policy-delete) command.

---

## Lock a time-based retention policy

When you have finished testing a time-based retention policy, you can lock the policy. A locked policy is compliant with SEC 17a-4(f) and other regulatory compliance. You can lengthen the retention interval for a locked policy up to five times, but you cannot shorten it.

After a policy is locked, you cannot delete it. However, you can delete the blob after the retention interval has expired.

### [Portal](#tab/azure-portal)

To lock a policy with the Azure portal, follow these steps:

1. Navigate to a container with an unlocked policy.
1. Under the **Immutable blob versions** section, locate the existing unlocked policy. Select the **More** button, then select **Lock policy** from the menu.
1. Confirm that you want to lock the policy.

:::image type="content" source="media/immutable-policy-configure-container-scope/lock-retention-policy.png" alt-text="Screenshot showing how to lock time-based retention policy in Azure portal":::

### [PowerShell](#tab/azure-powershell)

To lock a policy with PowerShell, first call the [Get-AzRmStorageContainerImmutabilityPolicy](/powershell/module/az.storage/get-azrmstoragecontainerimmutabilitypolicy) command to retrieve the policy's ETag. Next, call the [Lock-AzRmStorageContainerImmutabilityPolicy](/powershell/module/az.storage/lock-azrmstoragecontainerimmutabilitypolicy) command and pass in the ETag value to lock the policy. Remember to replace placeholder values in angle brackets with your own values:

```azurepowershell
$policy = Get-AzRmStorageContainerImmutabilityPolicy -ResourceGroupName <resource-group> `
    -AccountName <storage-account> `
    -ContainerName <container>

Lock-AzRmStorageContainerImmutabilityPolicy -ResourceGroupName <resource-group> `
    -AccountName <storage-account> `
    -ContainerName <container> `
    -Etag $policy.Etag
```

### [Azure CLI](#tab/azure-cli)

To lock a policy with Azure CLI, first call the [az storage container immutability-policy show](/cli/azure/storage/container/immutability-policy#az-storage-container-immutability-policy-show) command to retrieve the policy's ETag. Next, call the [az storage container immutability-policy lock](/cli/azure/storage/container/immutability-policy#az-storage-container-immutability-policy-lock) command and pass in the ETag value to lock the policy. Remember to replace placeholder values in angle brackets with your own values:

```azurecli
$etag=$(az storage container immutability-policy show \
        --account-name <storage-account> \
        --container-name <container> \
        --query etag \
        --output tsv)

az storage container immutability-policy lock \
    --resource-group <resource-group> \
    --account-name <storage-account> \
    --container-name <container> \
    --if-match $etag
```

---

## Configure or clear a legal hold

A legal hold stores immutable data until the legal hold is explicitly cleared. To learn more about legal hold policies, see [Legal holds for immutable blob data](immutable-legal-hold-overview.md).

### [Portal](#tab/azure-portal)

To configure a legal hold on a container with the Azure portal, follow these steps:

1. Navigate to the desired container.

2. Select the **More** button and choose **Access policy**.

3. Under the **Immutable blob versions** section, select **Add policy**.

4. Choose **Legal hold** as the policy type.

5. Add one or more legal hold tags.

6. Choose whether to allow protected append writes, and then select **Save**.

   The **Append blobs** option enables your workloads to add new blocks of data to the end of an append blob by using the [Append Block](/rest/api/storageservices/append-block) operation.

   This setting also adds the ability to write new blocks to a block blob. The Blob Storage API does not provide a way for applications to do this directly. However, applications can accomplish this by using append and flush methods that are available in the Data Lake Storage Gen2 API. Also, this property enables Microsoft applications such as Azure Data Factory to append blocks of data by using internal APIs. If your workloads depend on any of these tools, then you can use this property to avoid errors that can appear when those tools attempt to append data to blobs.

   To learn more about these options, see [Allow protected append blobs writes](immutable-legal-hold-overview.md#allow-protected-append-blobs-writes).

    :::image type="content" source="media/immutable-policy-configure-container-scope/configure-retention-policy-container-scope-legal-hold.png" alt-text="Screenshot showing how to configure legal hold policy scoped to container.":::

After you've configured the immutability policy, you will see that it is scoped to the container:

The following image shows a container with both a time-based retention policy and legal hold configured.

:::image type="content" source="media/immutable-policy-configure-container-scope/retention-policy-legal-hold-container-scope.png" alt-text="Screenshot showing a container with both a time-based retention policy and legal hold configured":::

To clear a legal hold, navigate to the **Access policy** dialog, select the **More** button, and choose **Delete**.

### [PowerShell](#tab/azure-powershell)

To configure a legal hold on a container with PowerShell, call the [Add-AzRmStorageContainerLegalHold](/powershell/module/az.storage/add-azrmstoragecontainerlegalhold) command. Remember to replace placeholder values in angle brackets with your own values:

```azurepowershell
Add-AzRmStorageContainerLegalHold -ResourceGroupName <resource-group> `
    -StorageAccountName <storage-account> `
    -Name <container> `
    -Tag <tag1>,<tag2>,...`
    -AllowProtectedAppendWriteAll true
```

To clear a legal hold, call the [Remove-AzRmStorageContainerLegalHold](/powershell/module/az.storage/remove-azrmstoragecontainerlegalhold) command:

```azurepowershell
Remove-AzRmStorageContainerLegalHold -ResourceGroupName <resource-group> `
    -StorageAccountName <storage-account> `
    -Name <container> `
    -Tag <tag1>,<tag2>,...
```

### [Azure CLI](#tab/azure-cli)

To configure a legal hold on a container with PowerShell, call the [az storage container legal-hold set](/cli/azure/storage/container/legal-hold#az-storage-container-legal-hold-set) command. Remember to replace placeholder values in angle brackets with your own values:

```azurecli
az storage container legal-hold set \
    --tags tag1 tag2 \
    --container-name <container> \
    --account-name <storage-account> \
    --resource-group <resource-group> \
    --allow-protected-append-writes-all true
```

To clear a legal hold, call the [az storage container legal-hold clear](/cli/azure/storage/container/legal-hold#az-storage-container-legal-hold-clear) command:

```azurecli
az storage container legal-hold clear \
    --tags tag1 tag2 \
    --container-name <container> \
    --account-name <storage-account> \
    --resource-group <resource-group> \ 
```

---

## Next steps

- [Store business-critical blob data with immutable storage](immutable-storage-overview.md)
- [Time-based retention policies for immutable blob data](immutable-time-based-retention-policy-overview.md)
- [Legal holds for immutable blob data](immutable-legal-hold-overview.md)
- [Configure immutability policies for blob versions](immutable-policy-configure-version-scope.md)
