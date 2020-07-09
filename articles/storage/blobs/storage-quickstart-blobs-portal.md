---
title: Quickstart - Create a blob with the Azure portal
titleSuffix: Azure Storage
description: In this quickstart, you use the Azure portal in object (Blob) storage. Then you use the Azure portal to upload a blob to Azure Storage, download a blob, and list the blobs in a container.
services: storage
author: tamram

ms.service: storage
ms.subservice: blobs
ms.topic: quickstart
ms.date: 04/16/2020
ms.author: tamram
---

# Quickstart: Upload, download, and list blobs with the Azure portal

In this quickstart, you learn how to use the [Azure portal](https://portal.azure.com/) to create a container in Azure Storage, and to upload and download block blobs in that container.

## Prerequisites

[!INCLUDE [storage-quickstart-prereq-include](../../../includes/storage-quickstart-prereq-include.md)]

## Create a container

To create a container in the Azure portal, follow these steps:

1. Navigate to your new storage account in the Azure portal.
2. In the left menu for the storage account, scroll to the **Blob service** section, then select **Containers**.
3. Select the **+ Container** button.
4. Type a name for your new container. The container name must be lowercase, must start with a letter or number, and can include only letters, numbers, and the dash (-) character. For more information about container and blob names, see [Naming and referencing containers, blobs, and metadata](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).
5. Set the level of public access to the container. The default level is **Private (no anonymous access)**.
6. Select **OK** to create the container.

    ![Screenshot showing how to create a container in the Azure portal](media/storage-quickstart-blobs-portal/create-container.png)

## Upload a block blob

Block blobs consist of blocks of data assembled to make a blob. Most scenarios using Blob storage employ block blobs. Block blobs are ideal for storing text and binary data in the cloud, like files, images, and videos. This quickstart shows how to work with block blobs.

To upload a block blob to your new container in the Azure portal, follow these steps:

1. In the Azure portal, navigate to the container you created in the previous section.
1. Select the container to show a list of blobs it contains. This container is new, so it won't yet contain any blobs.
1. Select the **Upload** button to open the upload blade and browse your local file system to find a file to upload as a block blob. You can optionally expand the advanced section to configure other settings for the upload operation.

    ![Screenshot showing how to upload a blob from your local drive](media/storage-quickstart-blobs-portal/upload-blob.png)

1. Select the **Upload** button to upload the blob.
1. Upload as many blobs as you like in this way. You'll see that the new blobs are now listed within the container.

## Download a block blob

You can download a block blob to display in the browser or save to your local file system. To download a block blob, follow these steps:

1. Navigate to the list of blobs that you uploaded in the previous section.
1. Right-click the blob you want to download, and select **Download**.

## Clean up resources

To remove the resources you created in this quickstart, you can delete the container. All blobs in the container will also be deleted.

To delete the container:

1. In the Azure portal, navigate to the list of containers in your storage account.
1. Select the container to delete.
1. Select the **More** button (**...**), and select **Delete**.
1. Confirm that you want to delete the container.

## Next steps

In this quickstart, you learned how to transfer files between a local disk and Azure Blob storage with Azure portal. To learn more about working with Blob storage, continue to the Blob storage How-to.

> [!div class="nextstepaction"]
> [Blob Storage Operations How-To](storage-dotnet-how-to-use-blobs.md)
