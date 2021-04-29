---
title: 'Storage Explorer: Set ACLs in Azure Data Lake Storage Gen2'
description: Use the Azure Storage Explorer to manage access control lists (ACLs) in storage accounts that has hierarchical namespace (HNS) enabled.
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: how-to
ms.date: 02/17/2021
ms.author: normesta
ms.reviewer: stewu
---

# Use Azure Storage Explorer to manage ACLs in Azure Data Lake Storage Gen2

This article shows you how to use [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) to manage access control lists (ACLs) in storage accounts that has hierarchical namespace (HNS) enabled.

You can use Storage Explorer to view, and then update the ACLs of directories and files. ACL inheritance is already available for new child items that are created under a parent directory. But you can also apply ACL settings recursively on the existing child items of a parent directory without having to make these changes individually for each child item. 

This article shows you how to modify the ACL of file or directory and how to apply ACL settings recursively to child directories.

## Prerequisites

- An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

- A storage account that has hierarchical namespace (HNS) enabled. Follow [these](../common/storage-account-create.md) instructions to create one.

- Azure Storage Explorer installed on your local computer. To install Azure Storage Explorer for Windows, Macintosh, or Linux, see [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/).

> [!NOTE]
> Storage Explorer makes use of both the Blob (blob) & Data Lake Storage Gen2 (dfs) [endpoints](../common/storage-private-endpoints.md#private-endpoints-for-azure-storage) when working with Azure Data Lake Storage Gen2. If access to Azure Data Lake Storage Gen2 is configured using private endpoints, ensure that two private endpoints are created for the storage account: one with the target sub-resource `blob` and the other with the target sub-resource `dfs`.

## Sign in to Storage Explorer

When you first start Storage Explorer, the **Microsoft Azure Storage Explorer - Connect** window appears. While Storage Explorer provides several ways to connect to storage accounts, only one way is currently supported for managing ACLs.

|Task|Purpose|
|---|---|
|Add an Azure Account | Redirects you to your organization's sign-in page to authenticate you to Azure. Currently this is the only supported authentication method if you want to manage and set ACLs.|
|Use a connection string or shared access signature URI | Can be used to directly access a container or storage account with a SAS token or a shared connection string. |
|Use a storage account name and key| Use the storage account name and key of your storage account to connect to Azure storage.|

Select **Add an Azure Account** and click **Sign in..**. Follow the on-screen prompts to sign into your Azure account.

![Screenshot that shows Microsoft Azure Storage Explorer, and highlights the Add an Azure Account option and the Sign in button.](media/storage-quickstart-blobs-storage-explorer/connect.png)

When it completes connecting, Azure Storage Explorer loads with the **Explorer** tab shown. This view gives you insight to all of your Azure storage accounts as well as local storage configured through the [Azurite storage emulator](../common/storage-use-azurite.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json), [Cosmos DB](../../cosmos-db/storage-explorer.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) accounts, or [Azure Stack](/azure-stack/user/azure-stack-storage-connect-se?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) environments.

![Microsoft Azure Storage Explorer - Connect window](media/storage-quickstart-blobs-storage-explorer/mainpage.png)

## Manage an ACL

Right-click the container, a directory, or a file, and then click **Manage Access Control Lists**.  The following screenshot shows the menu as it appears when you right-click a directory.

> [!div class="mx-imgBorder"]
> ![Right-clicking a directory in Azure Storage Explorer](./media/data-lake-storage-explorer-acl/manage-access-control-list-option.png)

The **Manage Access** dialog box allows you to manage permissions for owner and the owners group. It also allows you to add new users and groups to the access control list for whom you can then manage permissions.

> [!div class="mx-imgBorder"]
> ![Manage Access dialog box](./media/data-lake-storage-explorer-acl/manage-access-dialog-box.png)

To add a new user or group to the access control list, select the **Add** button. Then, enter the corresponding Azure Active Directory (Azure AD) entry you wish to add to the list and then select **Add**.  The user or group will now appear in the **Users and groups:** field, allowing you to begin managing their permissions.

> [!NOTE]
> It is a best practice, and recommended, to create a security group in Azure AD and maintain permissions on the group rather than individual users. For details on this recommendation, as well as other best practices, see [Access control model in Azure Data Lake Storage Gen2](data-lake-storage-explorer-acl.md).

Use the check box controls to set access and default ACLs. To learn more about the difference between these types of ACLs, see [Types of ACLs](data-lake-storage-access-control.md#types-of-acls).

## Apply ACLs recursively

You can apply ACL entries recursively on the existing child items of a parent directory without having to make these changes individually for each child item.

To apply ACL entries recursively, Right-click the container or a directory, and then click **Propagate Access Control Lists**.  The following screenshot shows the menu as it appears when you right-click a directory.

> [!div class="mx-imgBorder"]
> ![Right-clicking a directory and choosing the propagate access control setting](./media/data-lake-storage-explorer-acl/propagate-access-control-list-option.png)

## Next steps

Learn about the Data Lake Storage Gen2 permission model.

> [!div class="nextstepaction"]
> [Access control model in Azure Data Lake Storage Gen2](./data-lake-storage-access-control-model.md)
