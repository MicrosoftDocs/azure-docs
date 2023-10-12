---
title: Manage Azure Blob Storage resources with Storage Explorer
description: Manage Azure Blob Storage resources with Storage Explorer. Create a blob container, view blob container contents, delete or copy a blob container, and more.
services: storage
author: cawaMS
manager: paulyuk
ms.assetid: 2f09e545-ec94-4d89-b96c-14783cc9d7a9
ms.service: azure-storage
ms.topic: article
ms.workload: na
ms.date: 05/21/2019
ms.author: cawa
---

# Manage Azure Blob Storage resources with Storage Explorer

## Overview

[Azure Blob Storage](./storage/blobs/storage-quickstart-blobs-dotnet.md) is a service for storing large amounts of unstructured data, such as text or binary data, that can be accessed from anywhere in the world via HTTP or HTTPS.
You can use Blob storage to expose data publicly to the world, or to store application data privately. In this article, you'll learn how to use Storage Explorer
to work with blob containers and blobs.

## Prerequisites

To complete the steps in this article, you'll need the following:

* [Download and install Storage Explorer](https://www.storageexplorer.com)
* [Connect to an Azure storage account or service](vs-azure-tools-storage-manage-with-storage-explorer.md#connect-to-a-storage-account-or-service)

## Create a blob container

All blobs must reside in a blob container, which is simply a logical grouping of blobs. An account can contain an unlimited number of containers, and each container can store an unlimited number of blobs.

The following steps illustrate how to create a blob container within Storage Explorer.

1. Open Storage Explorer.
2. In the left pane, expand the storage account within which you wish to create the blob container.
3. Right-click **Blob Containers**, and - from the context menu - select **Create Blob Container**.

   ![Create blob containers context menu][0]
4. A text box will appear below the **Blob Containers** folder. Enter the name for your blob container. See [Create a container](storage/blobs/storage-quickstart-blobs-dotnet.md#create-a-container) for information on rules and restrictions on naming blob containers.

   ![Create Blob Containers text box][1]
5. Press **Enter** when done to create the blob container, or **Esc** to cancel. Once the blob container has been successfully created, it will be displayed under the **Blob Containers** folder for the selected storage account.

   ![Blob Container created][2]

## View a blob container's contents

Blob containers contain blobs and virtual directories (that can also contain blobs).

The following steps illustrate how to view the contents of a blob container within Storage Explorer:

1. Open Storage Explorer.
2. In the left pane, expand the storage account containing the blob container you wish to view.
3. Expand the storage account's **Blob Containers**.
4. Right-click the blob container you wish to view, and - from the context menu - select **Open Blob Container Editor**.
   You can also double-click the blob container you wish to view.

   ![Open blob container editor context menu][19]
5. The main pane will display the blob container's contents.

   ![Blob container editor][3]

## Delete a blob container

Blob containers can be easily created and deleted as needed. (To see how to delete individual blobs,
refer to the section, [Managing blobs in a blob container](#managing-blobs-in-a-blob-container).)

The following steps illustrate how to delete a blob container within Storage Explorer:

1. Open Storage Explorer.
2. In the left pane, expand the storage account containing the blob container you wish to view.
3. Expand the storage account's **Blob Containers**.
4. Right-click the blob container you wish to delete, and - from the context menu - select **Delete**.
   You can also press **Delete** to delete the currently selected blob container.

   ![Delete blob container context menu][4]
5. Select **Yes** to the confirmation dialog.

   ![Delete blob Container confirmation][5]

## Copy a blob container

Storage Explorer enables you to copy a blob container to the clipboard, and then paste that blob container into another storage account. (To see how to copy individual blobs,
refer to the section, [Managing blobs in a blob container](#managing-blobs-in-a-blob-container).)

The following steps illustrate how to copy a blob container from one storage account to another.

1. Open Storage Explorer.
2. In the left pane, expand the storage account containing the blob container you wish to copy.
3. Expand the storage account's **Blob Containers**.
4. Right-click the blob container you wish to copy, and - from the context menu - select **Copy Blob Container**.

   ![Copy blob container context menu][6]
5. Right-click the desired "target" storage account into which you want to paste the blob container, and - from the context menu - select **Paste Blob Container**.

   ![Paste blob container context menu][7]

## Get the SAS for a blob container

A [shared access signature (SAS)](./storage/common/storage-sas-overview.md) provides delegated access to resources in your storage account.
This means that you can grant a client limited permissions to objects in your storage account for a specified period of time and with a specified set of permissions, without having to
share your account access keys.

The following steps illustrate how to create a SAS for a blob container:

1. Open Storage Explorer.
2. In the left pane, expand the storage account containing the blob container for which you wish to get a SAS.
3. Expand the storage account's **Blob Containers**.
4. Right-click the desired blob container, and - from the context menu - select **Get Shared Access Signature**.

   ![Get SAS context menu][8]
5. In the **Shared Access Signature** dialog, specify the policy, start and expiration dates, time zone, and access levels you want for the resource.

   ![Get SAS options][9]
6. When you're finished specifying the SAS options, select **Create**.
7. A second **Shared Access Signature** dialog will then display that lists the blob container along with the URL and QueryStrings you can use to access the storage resource.
   Select **Copy** next to the URL you wish to copy to the clipboard.

   ![Copy SAS URLs][10]
8. When done, select **Close**.

## Manage Access Policies for a blob container

The following steps illustrate how to manage (add and remove) access policies for a blob container:

1. Open Storage Explorer.
2. In the left pane, expand the storage account containing the blob container whose access policies you wish to manage.
3. Expand the storage account's **Blob Containers**.
4. Select the desired blob container, and - from the context menu - select **Manage Access Policies**.

   ![Manage access policies context menu][11]
5. The **Access Policies** dialog will list any access policies already created for the selected blob container.

   ![Access Policy options][12]
6. Follow these steps depending on the access policy management task:

   * **Add a new access policy** - Select **Add**. Once generated, the **Access Policies** dialog will display the newly added access policy (with default settings).
   * **Edit an access policy** -  Make any desired edits, and select **Save**.
   * **Remove an access policy** - Select **Remove** next to the access policy you wish to remove.

> [!NOTE]
> Modifying immutability policies is not supported from Storage Explorer. 

## Set the Public Access Level for a blob container

By default, every blob container is set to "No public access".

The following steps illustrate how to specify a public access level for a blob container.

1. Open Storage Explorer.
2. In the left pane, expand the storage account containing the blob container whose access policies you wish to manage.
3. Expand the storage account's **Blob Containers**.
4. Select the desired blob container, and - from the context menu - select **Set Public Access Level**.

   ![Set public access level context menu][13]
5. In the **Set Container Public Access Level** dialog, specify the desired access level.

   ![Set public access level options][14]
6. Select **Apply**.

## Managing blobs in a blob container

Once you've created a blob container, you can upload a blob to that blob container, download a blob to your local computer, open a blob on your local computer,
and much more.

The following steps illustrate how to manage the blobs (and virtual directories) within a blob container.

1. Open Storage Explorer.
2. In the left pane, expand the storage account containing the blob container you wish to manage.
3. Expand the storage account's **Blob Containers**.
4. Double-click the blob container you wish to view.
5. The main pane will display the blob container's contents.

   ![View blob container][3]
6. The main pane will display the blob container's contents.
7. Follow these steps depending on the task you wish to perform:

   * **Upload files to a blob container**

     1. On the main pane's toolbar, select **Upload**, and then **Upload Files** from the drop-down menu.

        ![Upload files menu][15]
     2. In the **Upload files** dialog, select the ellipsis (**…**) button on the right side of the **Files** text box to select the file(s) you wish to upload.

        ![Upload files options][16]
     3. Specify the type of **Blob type**. See [Create a container](storage/blobs/storage-quickstart-blobs-dotnet.md#create-a-container) for more information.
     4. Optionally, specify a target virtual directory into which the selected file(s) will be uploaded. If the target virtual directory doesn’t exist, it will be created.
     5. Select **Upload**.
   * **Upload a folder to a blob container**

     1. On the main pane's toolbar, select **Upload**, and then **Upload Folder** from the drop-down menu.

        ![Upload folder menu][17]
     2. In the **Upload folder** dialog, select the ellipsis (**…**) button on the right side of the **Folder** text box to select the folder whose contents you wish to upload.

        ![Upload folder options][18]
     3. Specify the type of **Blob type**. See [Create a container](storage/blobs/storage-quickstart-blobs-dotnet.md#create-a-container) for more information.
     4. Optionally, specify a target virtual directory into which the selected folder's contents will be uploaded. If the target virtual directory doesn’t exist, it will be created.
     5. Select **Upload**.
   * **Download a blob to your local computer**

     1. Select the blob you wish to download.
     2. On the main pane's toolbar, select **Download**.
     3. In the **Specify where to save the downloaded blob** dialog, specify the location where you want the blob downloaded, and the name you wish to give it.  
     4. Select **Save**.
   * **Open a blob on your local computer**

     1. Select the blob you wish to open.
     2. On the main pane's toolbar, select **Open**.
     3. The blob will be downloaded and opened using the application associated with the blob's underlying file type.
   * **Copy a blob to the clipboard**

     1. Select the blob you wish to copy.
     2. On the main pane's toolbar, select **Copy**.
     3. In the left pane, navigate to another blob container, and double-click it to view it in the main pane.
     4. On the main pane's toolbar, select **Paste** to create a copy of the blob.
   * **Delete a blob**

     1. Select the blob you wish to delete.
     2. On the main pane's toolbar, select **Delete**.
     3. Select **Yes** to the confirmation dialog.
   
   * **Delete a blob along with snapshots**
   
     1. Select the blob you wish to delete.
     2. On the main pane's toolbar, select **Delete**.
     3. Select **Yes** to the confirmation dialog.
     4. Under Activities the deletion of the blob will be skipped now click on retry.
     5. Retry Azcopy window will open and from Snapshot select Delete blobs with snapshots option from dropdown then 
        select Retry selected.

## Next steps

* View the [latest Storage Explorer release notes and videos](https://www.storageexplorer.com).
* Learn how to [create applications using Azure blobs, tables, queues, and files](./storage/index.yml).

[0]: ./media/vs-azure-tools-storage-explorer-blobs/blob-containers-create-context-menu.png
[1]: ./media/vs-azure-tools-storage-explorer-blobs/blob-container-create.png
[2]: ./media/vs-azure-tools-storage-explorer-blobs/blob-container-create-done.png
[3]: ./media/vs-azure-tools-storage-explorer-blobs/blob-container-editor.png
[4]: ./media/vs-azure-tools-storage-explorer-blobs/blob-container-delete-context-menu.png
[5]: ./media/vs-azure-tools-storage-explorer-blobs/blob-container-delete-confirmation.png
[6]: ./media/vs-azure-tools-storage-explorer-blobs/blob-container-copy-context-menu.png
[7]: ./media/vs-azure-tools-storage-explorer-blobs/blob-containers-paste-context-menu.png
[8]: ./media/vs-azure-tools-storage-explorer-blobs/blob-container-get-sas-context-menu.png
[9]: ./media/vs-azure-tools-storage-explorer-blobs/blob-container-get-sas-options.png
[10]: ./media/vs-azure-tools-storage-explorer-blobs/blob-container-get-sas-urls.png
[11]: ./media/vs-azure-tools-storage-explorer-blobs/blob-container-manage-access-policies-context-menu.png
[12]: ./media/vs-azure-tools-storage-explorer-blobs/blob-container-manage-access-policies-options.png
[13]: ./media/vs-azure-tools-storage-explorer-blobs/blob-container-set-public-access-level-context-menu.png
[14]: ./media/vs-azure-tools-storage-explorer-blobs/blob-container-set-public-access-level-options.png
[15]: ./media/vs-azure-tools-storage-explorer-blobs/blob-upload-files-menu.png
[16]: ./media/vs-azure-tools-storage-explorer-blobs/blob-upload-files-options.png
[17]: ./media/vs-azure-tools-storage-explorer-blobs/blob-upload-folder-menu.png
[18]: ./media/vs-azure-tools-storage-explorer-blobs/blob-upload-folder-options.png
[19]: ./media/vs-azure-tools-storage-explorer-blobs/blob-container-open-editor-context-menu.png
