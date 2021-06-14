---
title: Manage and restore soft-deleted blobs
titleSuffix: Azure Storage 
description: Manage and restore soft-deleted blobs and snapshots with the Azure portal or with the Azure Storage client libraries.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 05/21/2021
ms.author: tamram
ms.subservice: blobs 
ms.custom: "devx-track-csharp"
---

# Manage and restore soft-deleted blobs

Blob soft delete protects an individual blob and its versions, snapshots, and metadata from accidental deletes or overwrites by maintaining the deleted data in the system for a specified period of time. During the retention period, you can restore the blob to its state at deletion. After the retention period has expired, the blob is permanently deleted. For more information about blob soft delete, see [Soft delete for blobs](soft-delete-blob-overview.md).

Blob soft delete is part of a comprehensive data protection strategy for blob data. To learn more about Microsoft's recommendations for data protection, see [Data protection overview](data-protection-overview.md).

## Manage soft-deleted blobs with the Azure portal

You can use the Azure portal to view and restore soft-deleted blobs and snapshots.

### View deleted blobs

When blobs are soft-deleted, they are invisible in the Azure portal by default. To view soft-deleted blobs, navigate to the **Overview** page for the container and toggle the **Show deleted blobs** setting. Soft-deleted blobs are displayed with a status of **Deleted**.

:::image type="content" source="media/soft-delete-blob-manage/soft-deleted-blobs-list-portal.png" alt-text="Screenshot showing how to list soft-deleted blobs in Azure portal":::

Next, select the deleted blob from the list of blobs to display its properties. Under the **Overview** tab, notice that the blob's status is set to **Deleted**. The portal also displays the number of days until the blob is permanently deleted.

:::image type="content" source="media/soft-delete-blob-manage/soft-deleted-blob-properties-portal.png" alt-text="Screenshot showing properties of soft-deleted blob in Azure portal":::

### View deleted snapshots

Deleting a blob also deletes any snapshots associated with the blob. If a soft-deleted blob has snapshots, the deleted snapshots can also be displayed in the portal. Display the soft-deleted blob's properties, then navigate to the **Snapshots** tab, and toggle **Show deleted snapshots**.

:::image type="content" source="media/soft-delete-blob-manage/soft-deleted-blob-snapshots-portal.png" alt-text="Screenshot showing ":::

### Restore soft-deleted objects when versioning is disabled

To restore a soft-deleted blob in the Azure portal when blob versioning is not enabled, first display the blob's properties, then select the **Undelete** button on the **Overview** tab. Restoring a blob also restores any snapshots that were deleted during the soft-delete retention period.

:::image type="content" source="media/soft-delete-blob-manage/undelete-soft-deleted-blob-portal.png" alt-text="Screenshot showing how to restore a soft-deleted blob in Azure portal":::

To promote a soft-deleted snapshot to the base blob, first make sure that the blob's soft-deleted snapshots have been restored. Select the **Undelete** button to restore the blob's soft-deleted snapshots, even if the base blob itself has not been soft-deleted. Next, select the snapshot to promote and use the **Promote snapshot** button to overwrite the base blob with the contents of the snapshot.

:::image type="content" source="media/soft-delete-blob-manage/promote-snapshot.png" alt-text="Screenshot showing how to promote a snapshot to the base blob":::

### Restore soft-deleted blobs when versioning is enabled

To restore a soft-deleted blob in the Azure portal when versioning is enabled, select the soft-deleted blob to display its properties, then select the **Versions** tab. Select the version that you want to promote to be the current version, then select **Make current version**.  

:::image type="content" source="media/soft-delete-blob-manage/soft-deleted-blob-promote-version-portal.png" alt-text="Screenshot showing how to promote a version to restore a blob in Azure portal":::

To restore deleted versions or snapshots when versioning is enabled, display the blob's properties, then select the **Undelete** button on the **Overview** tab.

> [!NOTE]
> When versioning is enabled, selecting the **Undelete** button on a deleted blob restores any soft-deleted versions or snapshots, but does not restore the base blob. To restore the base blob, you must promote a previous version.

## Manage soft-deleted blobs with code

You can use the Azure Storage client libraries to restore a soft-deleted blob or snapshot. The following examples show how to use the .NET client library.

### Restore soft-deleted objects when versioning is disabled

# [.NET v12 SDK](#tab/dotnet)

To restore deleted blobs when versioning is not enabled, call the [Undelete Blob](/rest/api/storageservices/undelete-blob) operation on those blobs. The **Undelete Blob** operation restores soft-deleted blobs and any deleted snapshots associated with those blobs.

Calling **Undelete Blob** on a blob that has not been deleted has no effect. The following example calls **Undelete Blob** on all blobs in a container, and restores the soft-deleted blobs and their snapshots:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/DataProtection.cs" id="Snippet_RecoverDeletedBlobs":::

To restore a specific soft-deleted snapshot, first call the **Undelete Blob** operation on the base blob, then copy the desired snapshot over the base blob. The following example restores a block blob to the most recently generated snapshot:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/DataProtection.cs" id="Snippet_RecoverSpecificBlobSnapshot":::

# [.NET v11 SDK](#tab/dotnet11)

To restore deleted blobs when versioning is not enabled, call the [Undelete Blob](/rest/api/storageservices/undelete-blob) operation on those blobs. The **Undelete Blob** operation restores soft-deleted blobs and any deleted snapshots associated with those blobs.

Calling **Undelete Blob** on a blob that has not been deleted has no effect. The following example calls **Undelete Blob** on all blobs in a container, and restores the soft-deleted blobs and their snapshots:

```csharp
// Restore all blobs in a container.
foreach (CloudBlob blob in container.ListBlobs(useFlatBlobListing: true, blobListingDetails: BlobListingDetails.Deleted))
{
       await blob.UndeleteAsync();
}
```

To restore a specific soft-deleted snapshot, first call the **Undelete Blob** operation on the base blob, then copy the desired snapshot over the base blob. The following example restores a block blob to its most recently generated snapshot:

```csharp
// Restore the block blob.
await blockBlob.UndeleteAsync();

// List all blobs and snapshots in the container, prefixed by the blob name.
IEnumerable<IListBlobItem> allBlobSnapshots = container.ListBlobs(
    prefix: blockBlob.Name, useFlatBlobListing: true, blobListingDetails: BlobListingDetails.Snapshots);

// Copy the most recently generated snapshot to the base blob.
CloudBlockBlob copySource = allBlobSnapshots.First(snapshot => ((CloudBlockBlob)version).IsSnapshot &&
    ((CloudBlockBlob)snapshot).Name == blockBlob.Name) as CloudBlockBlob;
blockBlob.StartCopy(copySource);
```  

---

### Restore soft-deleted blobs when versioning is enabled

To restore a soft-deleted blob when versioning is enabled, copy a previous version over the base blob with a [Copy Blob](/rest/api/storageservices/copy-blob) or [Copy Blob From URL](/rest/api/storageservices/copy-blob-from-url) operation.  

# [.NET v12 SDK](#tab/dotnet)

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/DataProtection.cs" id="Snippet_RestorePreviousVersion":::

# [.NET v11 SDK](#tab/dotnet11)

Not applicable. Blob versioning is supported only in the Azure Storage client libraries version 12.x and higher.

---

## Manage soft-deleted blobs and directories (hierarchical namespace)

You can restore or disable soft deleted blobs and directories in accounts that have a hierarchical namespace. You can use the PowerShell, Azure CLI, or with code by using an SDK.

> [!IMPORTANT]
> Soft delete in accounts that have the hierarchical namespace feature enabled is currently in public preview, and is available only in the East US 2 and West Europe region.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
>
> To enroll in the preview, see [this form](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fforms.office.com%2FPages%2FResponsePage.aspx%3Fid%3Dv4j5cvGGr0GRqy180BHbR4mEEwKhLjlBjU3ziDwLH-pUOUxPTkFSSjJDRlBZNlpZSjhGUktFVzFDRi4u&data=04%7C01%7CSachin.Sheth%40microsoft.com%7C6e6a6d56c2014cdf749308d90e915f1e%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C637556839790913940%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C1000&sdata=qnYxVDdI7whCqBW4johgutS3patACP6ubleUrMGFtf8%3D&reserved=0).

#### Restore soft deleted blobs and directories by using PowerShell

>[!IMPORTANT]
> This section section applies only to accounts that have a hierarchical namespace.

1. Ensure that you have the **Az.Storage** preview module installed. See [Enable blob soft delete by using PowerShell](soft-delete-blob-enable.md?tabs=azure-powershell#enable-blob-soft-delete-hierarchical-namespace).

2. Obtain storage account authorization by using either a storage account key, a connection string, or Azure Active Directory (Azure AD). See [Connect to the account](data-lake-storage-directory-file-acl-powershell.md#connect-to-the-account).

   The following example obtains authorization by using a storage account key.

   ```powershell
   $ctx = New-AzStorageContext -StorageAccountName '<storage-account-name>' -StorageAccountKey '<storage-account-key>'
   ```

3. To restore soft deleted item, use the `Restore-AzDataLakeGen2DeletedItem` command.

   ```powershell
   $filesystemName = "my-file-system"
   $dirName="my-directory"
   $deletedItems = Get-AzDataLakeGen2DeletedItem -Context $ctx -FileSystem $filesystemName -Path $dirName
   $deletedItems | Restore-AzDataLakeGen2DeletedItem
   ```


#### Restore soft deleted blobs and directories by using Azure CLI

>[!IMPORTANT]
> This section section applies only to accounts that have a hierarchical namespace.

1. Make sure that you have the `storage-preview` extension installed. See [Enable blob soft delete by using PowerShell](soft-delete-blob-enable.md?tabs=azure-CLI#enable-blob-soft-delete-hierarchical-namespace).

2. Get a list of deleted items.

   ```azurecli
   $filesystemName = "my-file-system"
   az storage fs list-deleted-path -f $filesystemName --auth-mode login
   ```

3. To restore an item, use the `az storage fs undelete-path` command.

   ```azurecli
   $dirName="my-directory"
   az storage fs undelete-path -f $filesystemName --deleted-path-name $dirName —deletion-id "<deletionId>" --auth-mode login
   ```

#### Restore soft deleted blobs and directories by using .NET

>[!IMPORTANT]
> This section section applies only to accounts that have a hierarchical namespace.

1. Make sure that you have installed the  `Azure.Storage.Files.DataLake -v 12.6.0-alpha.20201209.1` version of the [Azure.Storage.Files.DataLake](https://www.nuget.org/packages/Azure.Storage.Files.DataLake/) NuGet package, and that you've added the appropriate using statements to the top of your code file. See [Enable soft delete by using .NET](soft-delete-blob-enable.md#enable-soft-delete-by-using-net).

2. The following code deletes a directory, and then restores a soft deleted directory.

   This method assumes that you've created a [DataLakeServiceClient](/dotnet/api/azure.storage.files.datalake.datalakeserviceclient) instance. To learn how to create a [DataLakeServiceClient](/dotnet/api/azure.storage.files.datalake.datalakeserviceclient) instance, see [Connect to the account](data-lake-storage-directory-file-acl-dotnet.md#connect-to-the-account).

   ```csharp
      public void RestoreDirectory(DataLakeServiceClient serviceClient)
      {
          DataLakeFileSystemClient fileSystemClient = 
             serviceClient.GetFileSystemClient("my-container");

          DataLakeDirectoryClient directory = 
              fileSystem.GetDirectoryClient("my-directory");

          // Delete the Directory
          await directory.DeleteAsync();
 
          // List Deleted Paths
          List<PathHierarchyDeletedItem> deletedItems = new List<PathHierarchyDeletedItem>();
          await foreach (PathHierarchyDeletedItem deletedItem in fileSystemClient.GetDeletedPathsAsync())
          {
            deletedItems.Add(deletedItem);
          }
 
          Assert.AreEqual(1, deletedItems.Count);
          Assert.AreEqual("my-directory", deletedItems[0].Path.Name);
          Assert.IsTrue(deletedItems[0].IsPath);
 
          // Restore deleted directory.
          Response<DataLakePathClient> restoreResponse = await fileSystemClient.RestorePathAsync(
          deletedItems[0].Path.Name,
          deletedItems[0].Path.DeletionId);

      }

   ```

#### Restore soft deleted blobs and directories by using Java

>[!IMPORTANT]
> This section section applies only to accounts that have a hierarchical namespace.

1. Add the required dependencies to the *pom.xml* file of your project, and then add the appropriate import statements to your code file. See [Enable soft delete by using Java](soft-delete-blob-enable.md#enable-soft-delete-by-using-java).

2. The following snippet restores a soft deleted file named `my-file`. 

   This method assumes that you've created a **DataLakeServiceClient** instance. To learn how to create a **DataLakeServiceClient** instance, see [Connect to the account](data-lake-storage-directory-file-acl-java.md#connect-to-the-account).

   ```java

   public void RestoreFile(DataLakeServiceClient serviceClient){

       DataLakeFileSystemClient fileSystemClient = 
           serviceClient.getFileSystemClient("my-container");
       
       DataLakeFileClient fileClient = 
           fileSystemClient.getFileClient("my-file");

       String deletionId = null;

       for (PathDeletedItem item : fileSystemClient.listDeletedPaths()) {
    
           if (item.getName().equals(fileClient.getFilePath())) {
              deletionId = item.getDeletionId();
           }
       }

       fileSystemClient.restorePath(fileClient.getFilePath(), deletionId);
    }

   ```

#### Restore soft deleted blobs and directories by using Python

>[!IMPORTANT]
> This section section applies only to accounts that have a hierarchical namespace.

1. Make sure that you have installed the appropriate version of the Azure Data Lake Storage client library for Python. See [Enable soft delete by using Python](soft-delete-blob-enable.md#enable-soft-delete-by-using-python).

2. The following code deletes a directory, and then restores a soft deleted directory.

   The code example below contains an object named `service_client` of type **DataLakeServiceClient**. To see examples of how to create a **DataLakeServiceClient** instance, see [Connect to the account](data-lake-storage-directory-file-acl-python.md#connect-to-the-account).

    ```python
    def restoreDirectory():

        try:
            global file_system_client

            file_system_client = service_client.create_file_system(file_system="my-file-system")

            directory_path = 'my-directory'
            directory_client = file_system_client.create_directory(directory_path)
            resp = directory_client.delete_directory()
        
            restored_directory_client = file_system_client.undelete_path(directory_client, resp['deletion_id'])
            props = restored_directory_client.get_directory_properties()
        
            print(props)
   
        except Exception as e:
            print(e)

    ```

## Next steps

- [Soft delete for Blob storage](soft-delete-blob-overview.md)
- [Enable soft delete for blobs](soft-delete-blob-enable.md)
- [Blob versioning](versioning-overview.md)
