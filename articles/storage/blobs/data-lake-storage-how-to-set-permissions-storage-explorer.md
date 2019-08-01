---
title: "Set permissions for Data Lake Storage Gen2 with Azure Storage Explorer"
description: In this how to, you learn how to set permissions with Azure Storage Explorer on files and directories inside your Azure Data Lake Storage Gen2 capable storage account.
services: storage
author: normesta

ms.custom: mvc
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: quickstart
ms.date: 12/11/2018
ms.author: normesta
---

# Set file and directory level permissions using Azure Storage Explorer with Azure Data Lake Storage Gen2

Files stored in Azure Data Lake Storage Gen2 support fine grained permissions and access control list (ACL) management. Together, fine grained permissions and ACL management allow you to manage access to your data at a very granular level.

In this article, you learn how to use Azure Storage Explorer to:

> [!div class="checklist"]
> * Set file level permissions
> * Set directory level permissions
> * Add users or groups to an access control list

## Prerequisites

In order to best depict the process, we require that you complete our [Azure Storage Explorer quickstart](data-lake-storage-Explorer.md). This ensures your storage account will be in the most appropriate state (file system created and data uploaded to it).

## Managing access

You can set permissions at the root of your file system. To do so, you must be logged into Azure Storage Explorer with your individual account with rights to do so (as opposed to with a connection string). Right-click your file system and select **Manage Permissions**, bringing up the **Manage Permission** dialog box.

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

In this how-to, you learned how to set permissions on files and directories using **Azure Storage Explorer**. To learn more about ACLs, including default ACLs, access ACLs, their behavior, and their corresponding permissions, continue to our conceptual article on the subject.

> [!div class="nextstepaction"]
> [Access control in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md)
