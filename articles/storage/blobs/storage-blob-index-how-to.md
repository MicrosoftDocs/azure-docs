---
title: Use blob index tags to manage and find data on Azure Blob Storage
description: See examples of how to use blob index tags to categorize, manage, and query for blob objects.
titleSuffix: Azure Storage
author: normesta
ms.author: normesta
ms.date: 07/21/2022
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-azurepowershell, devx-track-azurecli
---

# Use blob index tags to manage and find data on Azure Blob Storage

Blob index tags categorize data in your storage account using key-value tag attributes. These tags are automatically indexed and exposed as a searchable multi-dimensional index to easily find data. This article shows you how to set, get, and find data using blob index tags.

To learn more about this feature along with known issues and limitations, see [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md).

## Upload a new blob with index tags

This task can be performed by a [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) or a security principal that has been given permission to the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write` [Azure resource provider operation](../../role-based-access-control/resource-provider-operations.md#microsoftstorage) via a custom Azure role.

### [Portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com/), select your storage account.

2. Navigate to the **Containers** option under **Data storage**, and select your container.

3. Select the **Upload** button and browse your local file system to find a file to upload as a block blob.

4. Expand the **Advanced** dropdown and go to the **Blob Index Tags** section.

5. Input the key/value blob index tags that you want applied to your data.

6. Select the **Upload** button to upload the blob.

   :::image type="content" source="media/storage-blob-index-concepts/blob-index-upload-data-with-tags.png" alt-text="Screenshot of the Azure portal showing how to upload a blob with index tags.":::

### [PowerShell](#tab/azure-powershell)

1. Sign in to your Azure subscription with the `Connect-AzAccount` command and follow the on-screen directions.

   ```powershell
   Connect-AzAccount
   ```

2. If your identity is associated with more than one subscription, then set your active subscription. Then, get the storage account context.

   ```powershell
   $context = Get-AzSubscription -SubscriptionId <subscription-id>
   Set-AzContext $context
   $storageAccount = Get-AzStorageAccount -ResourceGroupName "<resource-group-name>" -AccountName "<storage-account-name>"
   $ctx = $storageAccount.Context   
   ```

3. Upload a blob by using the `Set-AzStorageBlobContent` command. Set tags by using the `-Tag` parameter.

    ```powershell
    $containerName = "myContainer"
    $file = "C:\demo-file.txt"

    Set-AzStorageBlobContent -File $file -Container $containerName -Context $ctx -Tag @{"tag1" = "value1"; "tag2" = "value2" }
    ```

### [Azure CLI](#tab/azure-cli)

1. Open the [Azure Cloud Shell](../../cloud-shell/overview.md), or if you've [installed](/cli/azure/install-azure-cli) the Azure CLI locally, open a command console application such as Windows PowerShell.

2. Install the `storage-preview` extension.

   ```azurecli
   az extension add -n storage-preview
   ```

2. If you're using Azure CLI locally, run the login command.

   ```azurecli
   az login
   ```

3. If your identity is associated with more than one subscription, then set your active subscription to subscription of the storage account.

   ```azurecli
   az account set --subscription <subscription-id>
   ```

   Replace the `<subscription-id>` placeholder value with the ID of your subscription.

3. Upload a blob by using the `az storage blob upload` command. Set tags by using the `--tags` parameter.

   ```azurecli
   az storage blob upload --account-name mystorageaccount --container-name myContainer --name demo-file.txt --file C:\demo-file.txt --tags tag1=value1 tag2=value2 --auth-mode login
   ```

### [AzCopy](#tab/azcopy)

See [Upload with index tags](../common/storage-use-azcopy-blobs-upload.md#upload-with-index-tags).

---

## Get, set, and update blob index tags

Getting blob index tags can be performed by a [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) or a security principal that has been given permission to the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read` [Azure resource provider operation](../../role-based-access-control/resource-provider-operations.md#microsoftstorage) via a custom Azure role.

Setting and updating blob index tags can be performed by a [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) or a security principal that has been given permission to the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write` [Azure resource provider operation](../../role-based-access-control/resource-provider-operations.md#microsoftstorage) via a custom Azure role.

### [Portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com/), select your storage account.

2. Navigate to the **Containers** option under **Data storage**, select your container.

3. Select your blob from the list of blobs within the selected container.

4. The blob overview tab will display your blob's properties including any **Blob Index Tags**.

5. You can get, set, modify, or delete any of the key/value index tags for your blob.

6. Select the **Save** button to confirm any updates to your blob.

   :::image type="content" source="media/storage-blob-index-concepts/blob-index-get-set-tags.png" alt-text="Screenshot of the Azure portal showing how to get, set, update, and delete index tags on blobs.":::

### [PowerShell](#tab/azure-powershell)

1. Sign in to your Azure subscription with the `Connect-AzAccount` command and follow the on-screen directions.

   ```powershell
   Connect-AzAccount
   ```

2. If your identity is associated with more than one subscription, then set your active subscription. Then, get the storage account context.

   ```powershell
   $context = Get-AzSubscription -SubscriptionId <subscription-id>
   Set-AzContext $context
   $storageAccount = Get-AzStorageAccount -ResourceGroupName "<resource-group-name>" -AccountName "<storage-account-name>"
   $ctx = $storageAccount.Context   
   ```

3. To get the tags of a blob, use the `Get-AzStorageBlobTag` command and set the `-Blob` parameter to the name of the blob.

    ```powershell
    $containerName = "myContainer"
    $blobName = "myBlob" 
    Get-AzStorageBlobTag -Context $ctx -Container $containerName -Blob $blobName
    ```

4. To set the tags of a blob, use the `Set-AzStorageBlobTag` command. Set the `-Blob` parameter to the name of the blob, and set the `-Tag` parameter to a collection of name and value pairs.

    ```powershell
    $containerName = "myContainer"
    $blobName = "myBlob" 
    $tags = @{"tag1" = "value1"; "tag2" = "value2" }
    Set-AzStorageBlobTag -Context $ctx -Container $containerName -Blob $blobName -Tag $tags
    ```

### [Azure CLI](#tab/azure-cli)

1. Open the [Azure Cloud Shell](../../cloud-shell/overview.md), or if you've [installed](/cli/azure/install-azure-cli) the Azure CLI locally, open a command console application such as Windows PowerShell.

2. Install the `storage-preview` extension.

   ```azurecli
   az extension add -n storage-preview
   ```

2. If you're using Azure CLI locally, run the login command.

   ```azurecli
   az login
   ```

3. If your identity is associated with more than one subscription, then set your active subscription to subscription of the storage account.

   ```azurecli
   az account set --subscription <subscription-id>
   ```

   Replace the `<subscription-id>` placeholder value with the ID of your subscription.


3. To get the tags of a blob, use the `az storage blob tag list` command and set the `--name` parameter to the name of the blob.

   ```azurecli
   az storage blob tag list --account-name mystorageaccount --container-name myContainer --name demo-file.txt --auth-mode login
   ```

4. To set the tags of a blob, use the `az storage blob tag set` command. Set the `--name` parameter to the name of the blob, and set the `--tags` parameter to a collection of name and value pairs.

   ```azurecli
   az storage blob tag set --account-name mystorageaccount --container-name myContainer --name demo-file.txt --tags tag1=value1 tag2=value2 --auth-mode login
   ```

### [AzCopy](#tab/azcopy)

See [Replace index tags](../common/storage-use-azcopy-blobs-properties-metadata.md#replace-index-tags)

---

## Filter and find data with blob index tags

This task can be performed by a [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) or a security principal that has been given permission to the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/filter/action` [Azure resource provider operation](../../role-based-access-control/resource-provider-operations.md#microsoftstorage) via a custom Azure role.

> [!NOTE]
> You can't use index tags to retrieve previous versions. Tags for previous versions aren't passed to the blob index engine. For more information, see [Conditions and known issues](storage-manage-find-blobs.md#conditions-and-known-issues).

### [Portal](#tab/azure-portal)

Within the Azure portal, the blob index tags filter automatically applies the `@container` parameter to scope your selected container. If you wish to filter and find tagged data across your entire storage account, use our REST API, SDKs, or tools.

1. In the [Azure portal](https://portal.azure.com/), select your storage account.

2. Navigate to the **Containers** option under **Data storage**, select your container.

3. Select the **Blob Index tags filter** button to filter within the selected container.

4. Enter a blob index tag key and tag value.

5. Select the **Blob Index tags filter** button to add additional tag filters (up to 10).

   :::image type="content" source="media/storage-blob-index-concepts/blob-index-tag-filter-within-container.png" alt-text="Screenshot of the Azure portal showing how to Filter and find tagged blobs using index tags":::

### [PowerShell](#tab/azure-powershell)

1. Sign in to your Azure subscription with the `Connect-AzAccount` command and follow the on-screen directions.

   ```powershell
   Connect-AzAccount
   ```

2. If your identity is associated with more than one subscription, then set your active subscription. Then, get the storage account context.

   ```powershell
   $context = Get-AzSubscription -SubscriptionId <subscription-id>
   Set-AzContext $context
   $storageAccount = Get-AzStorageAccount -ResourceGroupName "<resource-group-name>" -AccountName "<storage-account-name>"
   $ctx = $storageAccount.Context   
   ```

3. To find all blobs that match a specific blob tag, use the `Get-AzStorageBlobByTag` command. 

    ```powershell
    $filterExpression = """tag1""='value1'"
    Get-AzStorageBlobByTag -TagFilterSqlExpression $filterExpression -Context $ctx
    ```

4. To find blobs only in a specific container, include the container name in the `-TagFilterSqlExpression`.

    ```powershell
    $filterExpression = "@container='myContainer' AND ""tag1""='value1'"
    Get-AzStorageBlobByTag -TagFilterSqlExpression $filterExpression -Context $ctx
    ``` 

### [Azure CLI](#tab/azure-cli)

1. Open the [Azure Cloud Shell](../../cloud-shell/overview.md), or if you've [installed](/cli/azure/install-azure-cli) the Azure CLI locally, open a command console application such as Windows PowerShell.

2. Install the `storage-preview` extension.

   ```azurecli
   az extension add -n storage-preview
   ```

2. If you're using Azure CLI locally, run the login command.

   ```azurecli
   az login
   ```

3. If your identity is associated with more than one subscription, then set your active subscription to subscription of the storage account.

   ```azurecli
   az account set --subscription <subscription-id>
   ```

   Replace the `<subscription-id>` placeholder value with the ID of your subscription.


3. To find all blobs that match a specific blob tag, use the `az storage blob filter` command. 

   ```azurecli
   az storage blob filter --account-name mystorageaccount --tag-filter """tag1""='value1' and ""tag2""='value2'" --auth-mode login
   ```

4. To find blobs only in a specific container, include the container name in the `--tag-filter` parameter.

   ```azurecli
   az storage blob filter --account-name mystorageaccount --tag-filter """@container""='myContainer' and ""tag1""='value1' and ""tag2""='value2'" --auth-mode login
   ```

### [AzCopy](#tab/azcopy)

N/A

---

## Next steps

- Learn more about blob index tags, see [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md)
- Learn more about lifecycle management, see [Manage the Azure Blob Storage lifecycle](./lifecycle-management-overview.md)
