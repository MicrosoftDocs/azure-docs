---
title: 'Use Azure Storage Explorer with Azure Data Lake Storage Gen2'
description: Use the Azure Storage Explorer to manage directories and file and directory access control lists (ACL) in storage accounts that has hierarchical namespace (HNS) enabled.
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: how-to
ms.date: 01/23/2019
ms.author: normesta
ms.reviewer: stewu
---

# Use Azure Storage Explorer to manage directories, files, and ACLs in Azure Data Lake Storage Gen2

This article shows you how to use [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) to create and manage directories, files, and permissions in storage accounts that has hierarchical namespace (HNS) enabled.

## Prerequisites

> [!div class="checklist"]
> * An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
> * A storage account that has hierarchical namespace (HNS) enabled. Follow [these](data-lake-storage-quickstart-create-account.md) instructions to create one.
> * Azure Storage Explorer installed on your local computer. To install Azure Storage Explorer for Windows, Macintosh, or Linux, see [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/).

## Sign in to Storage Explorer

When you first start Storage Explorer, the **Microsoft Azure Storage Explorer - Connect** window appears. While Storage Explorer provides several ways to connect to storage accounts, only one way is currently supported for managing ACLs.

|Task|Purpose|
|---|---|
|Add an Azure Account | Redirects you to your organization's sign-in page to authenticate you to Azure. Currently this is the only supported authentication method if you want to manage and set ACLs.|
|Use a connection string or shared access signature URI | Can be used to directly access a container or storage account with a SAS token or a shared connection string. |
|Use a storage account name and key| Use the storage account name and key of your storage account to connect to Azure storage.|

Select **Add an Azure Account** and click **Sign in..**. Follow the on-screen prompts to sign into your Azure account.

![Microsoft Azure Storage Explorer - Connect window](media/storage-quickstart-blobs-storage-explorer/connect.png)

When it completes connecting, Azure Storage Explorer loads with the **Explorer** tab shown. This view gives you insight to all of your Azure storage accounts as well as local storage configured through the [Azure Storage Emulator](../common/storage-use-emulator.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json), [Cosmos DB](../../cosmos-db/storage-explorer.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) accounts, or [Azure Stack](/azure-stack/user/azure-stack-storage-connect-se?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) environments.

![Microsoft Azure Storage Explorer - Connect window](media/storage-quickstart-blobs-storage-explorer/mainpage.png)

## Create a container

A container holds directories and files. To create one, expand the storage account you created in the proceeding step. Select **Blob Containers**, right-click and select **Create Blob Container**. Enter the name for your container. See the [Create a container](storage-quickstart-blobs-dotnet.md#create-a-container) section for a list of rules and restrictions on naming containers. When complete, press **Enter** to create the container. Once the container has been successfully created, it is displayed under the **Blob Containers** folder for the selected storage account.

![Microsoft Azure Storage Explorer - Creating a container](media/data-lake-storage-explorer/creating-a-filesystem.png)

## Create a directory

To create a directory, select the container that you created in the proceeding step. In the container ribbon, choose the **New Folder** button. Enter the name for your directory. When complete, press **Enter** to create the directory. Once the directory has been successfully created, it appears in the editor window.

![Microsoft Azure Storage Explorer - Creating a directory](media/data-lake-storage-explorer/creating-a-directory.png)

## Upload blobs to the directory

On the directory ribbon, chose the **Upload** button. This operation gives you the option to upload a folder or a file.

Choose the files or folder to upload.

![Microsoft Azure Storage Explorer - upload a blob](media/data-lake-storage-explorer/upload-file.png)

When you select **OK**, the files selected are queued to upload, each file is uploaded. When the upload is complete, the results are shown in the **Activities** window.

## View blobs in a directory

In the **Azure Storage Explorer** application, select a directory under a storage account. The main pane shows a list of the blobs in the selected directory.

![Microsoft Azure Storage Explorer - list blobs in a directory](media/data-lake-storage-explorer/list-files.png)

## Download blobs

To download files by using **Azure Storage Explorer**, with a file selected, select **Download** from the ribbon. A file dialog opens and provides you the ability to enter a file name. Select **Save** to start the download of a file to the local location.

## Managing access

You can set permissions at the root of your container. To do so, you must be logged into Azure Storage Explorer with your individual account with rights to do so (as opposed to with a connection string). Right-click your container and select **Manage Permissions**, bringing up the **Manage Permission** dialog box.

![Microsoft Azure Storage Explorer - Manage directory access](media/storage-quickstart-blobs-storage-Explorer/manageperms.png)

The **Manage Permission** dialog box allows you to manage permissions for owner and the owners group. It also allows you to add new users and groups to the access control list for whom you can then manage permissions.

To add a new user or group to the access control list, select the **Add user or group** field.

Enter the corresponding Azure Active Directory (AAD) entry you wish to add to the list and then select **Add**.

The user or group will now appear in the **Users and groups:** field, allowing you to begin managing their permissions.

> [!NOTE]
> It is a best practice, and recommended, to create a security group in AAD and maintain permissions on the group rather than individual users. For details on this recommendation, as well as other best practices, see [best practices for Data Lake Storage Gen2](data-lake-storage-best-practices.md).

There are two categories of permissions you can assign: access ACLs and default ACLs.

* **Access**: Access ACLs control access to an object. Files and directories both have access ACLs.

* **Default**: A template of ACLs associated with a directory that determines the access ACLs for any child items that are created under that directory. Files do not have default ACLs.

Within both of these categories, there are three permissions you can then assign on files or directories: **Read**, **Write**, and **Execute**.

>[!NOTE]
> Making selections here will not set permissions on any currently existing item inside the directory. You must go to each individual item and set the permissions manually, if the file already exists.

You can manage permissions on individual directories, as well as individual files, which are what allows you fine grained access control. The process for managing permissions for both directories and files is the same as described above. Right-click the file or directory you wish to manage permissions on and follow the same process.

## Next steps

Learn access control lists in Data Lake Storage Gen2.

> [!div class="nextstepaction"]
> [Access control in Azure Data Lake Storage Gen2](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-access-control)
