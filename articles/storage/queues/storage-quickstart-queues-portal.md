---
title: Azure Quickstart - Create a queue in Azure Storage using the Azure portal | Microsoft Docs
description: In this quickstart, you use the Azure portal to create a queue. Then you use the Azure portal to ???.
services: storage
author: tamram

ms.custom: mvc
ms.service: storage
ms.topic: quickstart
ms.date: 02/06/2018
ms.author: tamram
---

# Quickstart: Create a queue and add a message with the Azure portal

In this quickstart, you learn how to use the [Azure portal](https://portal.azure.com/) to create a queue in Azure Storage, and to add and dequeue messages.

## Prerequisites

[!INCLUDE [storage-quickstart-prereq-include](../../../includes/storage-quickstart-prereq-include.md)]

## Create a queue

To create a queue in the Azure portal, follow these steps:

1. Navigate to your new storage account in the Azure portal.
2. In the left menu for the storage account, scroll to the **Queue service** section, then select **Queues**.
3. Select the **+ Queue** button.
4. Type a name for your new queue. The queue name must be lowercase, must start with a letter or number, and can include only letters, numbers, and the dash (-) character.
6. Select **OK** to create the queue.

    ![Screenshot showing how to create a queue in the Azure portal](media/storage-quickstart-queues-portal/create-queue.png)

## Add a message

Next, add a message to the new queue. A message can be up to 64  in size and must be in UTF-8 format.

1. Select the new queue from the list of queues in the storage account.
1. Select the **+ Add message** button to add a message to the queue. Enter a message in the **Message text** field. 
1. Specify when the message expires. The maximum time that a message can remain the queue is 7 days.
1. Indicate whether to encode the message as Base64.
1. Select the **OK** button to add the message.

    ![Screenshot showing how to add a message to a queue](media/storage-quickstart-queues-portal/add-message.png)



## Upload a block blob

Block blobs consist of blocks of data assembled to make a blob. Most scenarios using Blob storage employ block blobs. Block blobs are ideal for storing text and binary data in the cloud, like files, images, and videos. This quickstart shows how to work with block blobs. 

To upload a block blob to your new container in the Azure portal, follow these steps:

1. In the Azure portal, navigate to the container you created in the previous section.
2. Select the container to show a list of blobs it contains. Since this container is new, it won't yet contain any blobs.
3. Select the **Upload** button to upload a blob to the container.
4. Browse your local file system to find a file to upload as a block blob, and select **Upload**.
     
    ![Screenshot showing how to upload a blob from your local drive](media/storage-quickstart-blobs-portal/upload-blob.png)

5. Select the **Authentication type**. The default is **SAS**.
6. Upload as many blobs as you like in this way. You'll see that the new blobs are now listed within the container.

## Download a block blob

You can download a block blob to display in the browser or save to your local file system. To download a block blob, follow these steps:

1. Navigate to the list of blobs that you uploaded in the previous section. 
2. Right-click the blob you want to download, and select **Download**. 

## Clean up resources

To remove the resources you created in this quickstart, you can delete the container. All blobs in the container will also be deleted.

To delete the container:

1. In the Azure portal, navigate to the list of containers in your storage account.
2. Select the container to delete.
3. Select the **More** button (**...**), and select **Delete**.
4. Confirm that you want to delete the container.

## Next steps

In this quickstart, you learned how to transfer files between a local disk and Azure Blob storage with Azure portal. To learn more about working with Blob storage, continue to the Blob storage How-to.

> [!div class="nextstepaction"]
> [Blob Storage Operations How-To](storage-dotnet-how-to-use-blobs.md)