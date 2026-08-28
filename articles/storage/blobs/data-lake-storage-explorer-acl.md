---
title: 'Storage Explorer: Set ACLs in Azure Data Lake Storage'
titleSuffix: Azure Storage
description: "Learn how to use Azure Storage Explorer to manage access control lists (ACLs) in Azure Data Lake Storage. Set, update, and apply ACL permissions recursively."
author: normesta

ms.service: azure-data-lake-storage
ms.topic: how-to
ms.date: 07/09/2026
ms.author: normesta
# Customer intent: "As a data administrator, I want to manage access control lists in Azure Data Lake Storage using a graphical interface, so that I can efficiently configure permissions for directories and files, including recursive updates for child items."
---

# Use Azure Storage Explorer to manage ACLs in Azure Data Lake Storage

This article shows you how to use [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) to manage access control lists (ACLs) in storage accounts that have hierarchical namespace (HNS) enabled.

Use Storage Explorer to view and update the ACLs of directories and files. ACL inheritance is already available for new child items that you create under a parent directory. You can also apply ACL settings recursively on the existing child items of a parent directory without making these changes individually for each child item.

## Prerequisites

- An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

- A storage account that has hierarchical namespace (HNS) enabled. Follow [these instructions](../common/storage-account-create.md) to create one.

- Azure Storage Explorer installed on your local computer. To install Azure Storage Explorer for Windows, macOS, or Linux, see [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/).

- You must have one of the following security permissions:

  - Your user identity is assigned the [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) role in the scope of either the target container, storage account, parent resource group, or subscription.

  - You're the owning user of the target container, directory, or blob to which you plan to apply ACL settings.

> [!NOTE]
> Storage Explorer uses both the Blob (blob) and Data Lake Storage (dfs) [endpoints](../common/storage-private-endpoints.md#private-endpoints-for-azure-storage) when working with Azure Data Lake Storage. If you configure access to Azure Data Lake Storage by using private endpoints, make sure you create two private endpoints for the storage account: one with the target sub-resource `blob` and the other with the target sub-resource `dfs`.

## Sign in to Storage Explorer

When you first start Storage Explorer, the **Microsoft Azure Storage Explorer - Connect to Azure Storage** window appears. While Storage Explorer provides several ways to connect to storage accounts, only one way supports managing ACLs.

1. In the **Select Resource** pane, select **Subscription**.

   :::image type="content" source="./media/data-lake-storage-explorer-acl/storage-explorer-connect-sml.png" alt-text="Screenshot that shows the Microsoft Azure Storage Explorer - Select Resource pane." lightbox="./media/data-lake-storage-explorer-acl/storage-explorer-connect-lrg.png":::

1. In the **Select Azure Environment** pane, select an Azure environment to sign in to. You can sign in to global Azure, a national cloud, or an Azure Stack instance. Then select **Next**.

   :::image type="content" alt-text="Screenshot that shows Microsoft Azure Storage Explorer, and highlights the Select Azure Environment option." source="./media/data-lake-storage-explorer-acl/storage-explorer-select-sml.png" lightbox="./media/data-lake-storage-explorer-acl/storage-explorer-select-sml.png":::

1. Sign in with your Azure account on the sign-in webpage that Storage Explorer opens.

1. Under **ACCOUNT MANAGEMENT**, select the Azure subscriptions you want to work with, and then select **Open Explorer**.

   :::image type="content" alt-text="Screenshot that shows Microsoft Azure Storage Explorer, and highlights the Account Management pane and Open Explorer button." source="./media/data-lake-storage-explorer-acl/storage-explorer-account-panel-sml.png" lightbox="./media/data-lake-storage-explorer-acl/storage-explorer-account-panel-sml.png":::

   Azure Storage Explorer loads with the **Explorer** tab shown. This view gives you insight into all your Azure storage accounts as well as local storage configured through the [Azurite storage emulator](../common/storage-use-azurite.md?toc=/azure/storage/blobs/toc.json) or [Azure Stack](/azure-stack/user/azure-stack-storage-connect-se?toc=/azure/storage/blobs/toc.json) environments.

   :::image type="content" alt-text="Screenshot of Microsoft Azure Storage Explorer - Connect window." source="./media/data-lake-storage-explorer-acl/storage-explorer-main-page-sml.png" lightbox="./media/data-lake-storage-explorer-acl/storage-explorer-main-page-lrg.png":::

## Manage an ACL

Right-click the container, a directory, or a file, and then select **Manage Access Control Lists**.  The following screenshot shows the menu as it appears when you right-click a directory.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/data-lake-storage-explorer-acl/manage-access-control-list-option.png" alt-text="Screenshot of the right-click context menu in Azure Storage Explorer showing the Manage Access Control Lists option for a directory.":::

The **Manage Access** dialog box allows you to manage permissions for the owner and the owners group. It also allows you to add new users and groups to the access control list so you can manage their permissions.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/data-lake-storage-explorer-acl/manage-access-dialog-box.png" alt-text="Screenshot of the Manage Access dialog box in Azure Storage Explorer showing permissions for owner, owners group, and options to add users or groups.":::

To add a new user or group to the access control list, select **Add**. Then, enter the corresponding Microsoft Entra entry you want to add to the list, and then select **Add**. The user or group now appears in the **Users and groups:** field, so you can begin managing their permissions.

> [!NOTE]
> As a best practice, create a security group in Microsoft Entra ID and maintain permissions on the group rather than individual users. For details on this recommendation, as well as other best practices, see [Access control model in Azure Data Lake Storage](data-lake-storage-access-control-model.md).

Use the check box controls to set **access ACLs** (which control permissions for existing items) and **default ACLs** (which serve as a template for permissions inherited by new child items). To learn more, see [Types of ACLs](data-lake-storage-access-control.md#types-of-acls).

## Apply ACLs recursively

You can apply ACL entries recursively on the existing child items of a parent directory without having to make these changes individually for each child item.

To apply ACL entries recursively, right-click the container or a directory, and then select **Propagate Access Control Lists**. The following screenshot shows the menu as it appears when you right-click a directory.

> [!NOTE] 
> The **Propagate Access Control Lists** option is available only in Storage Explorer 1.28.1 or later versions.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/data-lake-storage-explorer-acl/propagate-access-control-list-option.png" alt-text="Screenshot of the right-click context menu in Azure Storage Explorer showing the Propagate Access Control Lists option for a directory.":::

## Next steps

Learn about the Data Lake Storage permission model.

> [!div class="nextstepaction"]
> [Access control model in Azure Data Lake Storage](./data-lake-storage-access-control-model.md)
