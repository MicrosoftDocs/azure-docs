---
title: "Manage ACLs in Azure Data Lake Storage using Azure portal"
titleSuffix: Azure Storage
description: "Learn to manage access control lists (ACLs) in Azure Data Lake Storage using the Azure portal. Control permissions and secure your data assets."
author: normesta

ms.service: azure-data-lake-storage
ms.topic: how-to
ms.date: 07/21/2026
ms.author: normesta
# Customer intent: "As a data administrator, I want to manage access control lists (ACLs) in Azure Data Lake Storage through the Azure portal, so that I can effectively control permissions and secure my data assets."
---

# Use the Azure portal to manage ACLs in Azure Data Lake Storage

This article shows you how to use [Azure portal](https://portal.azure.com/) to manage the access control list (ACL) of a directory or blob in storage accounts that have the hierarchical namespace feature enabled.

For information about the structure of the ACL, see [Access control lists (ACLs) in Azure Data Lake Storage](data-lake-storage-access-control.md).

To learn about how to use ACLs and Azure roles together, see [Access control model in Azure Data Lake Storage](data-lake-storage-access-control-model.md).

## Prerequisites

- An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

- A storage account that has the hierarchical namespace feature enabled. Follow [these instructions](create-data-lake-storage-account.md) to create one.

- You must have one of the following security permissions:

  - Your user identity is assigned the [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) role in the scope of either the target container, storage account, parent resource group, or subscription.

  - You're the owning user of the target container, directory, or blob to which you plan to apply ACL settings.

## Set access permissions

Use these steps to grant a user or group access to a specific directory.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Locate your storage account and display the account overview.

1. Under **Data storage**, select **Containers**.

   The containers in the storage account appear.

   :::image type="content" source="./media/data-lake-storage-acl-azure-portal/find-containers-in-azure-portal.png" alt-text="Screenshot showing storage account containers listed in the Azure portal.":::

1. Go to any container, directory, or blob. Right-click the object, and then select **Manage ACL**.

   :::image type="content" source="./media/data-lake-storage-acl-azure-portal/manage-acl-menu-item.png" alt-text="Screenshot showing the right-click context menu with the Manage ACL option.":::

   The **Access permissions** tab of the **Manage ACL** page appears. Use the controls in this tab to manage access to the object.

   :::image type="content" source="./media/data-lake-storage-acl-azure-portal/access-acl-page.png" alt-text="Screenshot showing the Access permissions tab of the Manage ACL page.":::

1. To add a *security principal* to the ACL, select the **Add principal** button.

   > [!TIP]
   > A security principal is an object that represents a user, group, service principal, or managed identity defined in Microsoft Entra ID.

   Find the security principal by using the search box, and then select the **Select** button.

   :::image type="content" source="./media/data-lake-storage-acl-azure-portal/get-security-principal.png" alt-text="Screenshot showing the search box for finding and adding a security principal.":::

   > [!NOTE]
   > Create a security group in Microsoft Entra ID, and maintain permissions on the group rather than for individual users. For details on this recommendation, as well as other best practices, see [Access control model in Azure Data Lake Storage](data-lake-storage-access-control-model.md).

   The security principal appears in the access control list with the permissions you assigned.

## Set default permissions

A default ACL is a template that determines the access permissions for child items created under a directory. Blobs don't have default ACLs.

To set default permissions on a directory, go to the directory in your storage account, right-click it, select **Manage ACL**, and then:

1. Select the **default permissions** tab, and then select the **Configure default permissions** checkbox.

   > [!TIP]
   > A blob doesn't have a default ACL, so this tab appears only for directories.

   :::image type="content" source="./media/data-lake-storage-acl-azure-portal/default-acl-page.png" alt-text="Screenshot showing the Default permissions tab of the Manage ACL page.":::

## Apply ACL entries recursively

You can apply ACL entries recursively on the existing child items of a parent directory without making these changes individually for each child item. However, you can't apply ACL entries recursively by using the Azure portal because the portal applies ACL entries to a single object at a time.

To apply ACLs recursively, use Azure Storage Explorer, PowerShell, or the Azure CLI. If you prefer to write code, you can also use the .NET, Java, Python, or Node.js APIs.

For the complete list of guides, see [How to set ACLs](data-lake-storage-access-control.md#how-to-set-acls).

## Next steps

Learn about the Data Lake Storage permission model.

> [!div class="nextstepaction"]
> [Access control model in Azure Data Lake Storage](./data-lake-storage-access-control-model.md)
