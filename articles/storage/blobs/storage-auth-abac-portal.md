---
title: "Tutorial: Add a role assignment condition to restrict access to blobs using the Azure portal (preview) - Azure ABAC"
titleSuffix: Azure Storage
description: Add a role assignment condition to restrict access to blobs using the Azure portal and Azure attribute-based access control (Azure ABAC).
services: storage
author: jimmart-dev
ms.service: storage
ms.topic: tutorial
ms.author: jammart
ms.reviewer: nachakra
ms.subservice: blobs
ms.date: 09/01/2022

#Customer intent:

---

# Tutorial: Add a role assignment condition to restrict access to blobs using the Azure portal (preview)

> [!IMPORTANT]
> Azure ABAC and Azure role assignment conditions are currently in preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In most cases, a role assignment will grant the permissions you need to Azure resources. However, in some cases you might want to provide more fine-grained access control by adding a role assignment condition.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Add a condition to a role assignment
> - Restrict access to blobs based on a blob index tag

## Prerequisites

For information about the prerequisites to add or edit role assignment conditions, see [Conditions prerequisites](../../role-based-access-control/conditions-prerequisites.md).

## Condition

In this tutorial, you restrict access to blobs with a specific tag. For example, you add a condition to a role assignment so that Chandra can only read files with the tag `Project=Cascade`.

![Diagram of role assignment with a condition.](./media/shared/condition-role-assignment-rg.png)

If Chandra tries to read a blob without the tag `Project=Cascade`, access is not allowed.

![Diagram showing read access to blobs with Project=Cascade tag.](./media/shared/condition-access.png)

Here is what the condition looks like in code:

```
(
    (
        !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'}
        AND NOT
        SubOperationMatches{'Blob.List'})
    )
    OR
    (
        @Resource[Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags:Project<$key_case_sensitive$>] StringEqualsIgnoreCase 'Cascade'
    )
)
```

## Step 1: Create a user

1. Sign in to the Azure portal as an Owner of a subscription.

1. Click **Azure Active Directory**.

1. Create a user or find an existing user. This tutorial uses Chandra as the example.

## Step 2: Set up storage

1. Create a storage account that is compatible with the blob index tags feature. For more information, see [Manage and find Azure Blob data with blob index tags](../blobs/storage-manage-find-blobs.md#regional-availability-and-storage-account-support).

1. Create a new container within the storage account and set the Public access level to **Private (no anonymous access)**.

1. In the container, click **Upload** to open the Upload blob pane.

1. Find a text file to upload.

1. Click **Advanced** to expand the pane.

1. In the **Blob index tags** section, add the following blob index tag to the text file.

    If you don't see the Blob index tags section and you just registered your subscription, you might need to wait a few minutes for changes to propagate. For more information, see [Use blob index tags to manage and find data on Azure Blob Storage](../blobs/storage-blob-index-how-to.md).

    > [!NOTE]
    > Blobs also support the ability to store arbitrary user-defined key-value metadata. Although metadata is similar to blob index tags, you must use blob index tags with conditions.

    | Key | Value |
    | --- | --- |
    | Project  | Cascade |

   ![Screenshot showing Upload blob pane with Blog index tags section.](./media/storage-auth-abac-portal/container-upload-blob.png)

1. Click the **Upload** button to upload the file.

1. Upload a second text file.

1. Add the following blob index tag to the second text file.

    | Key | Value |
    | --- | --- |
    | Project  | Baker |

## Step 3: Assign a storage blob data role

1. Open the resource group.

1. Click **Access control (IAM)**.

1. Click the **Role assignments** tab to view the role assignments at this scope.

1. Click **Add** > **Add role assignment**.

   ![Screenshot of Add > Add role assignment menu.](./media/storage-auth-abac-portal/add-role-assignment-menu.png)

    The Add role assignment page opens.

1. On the **Roles** tab, select the [Storage Blob Data Reader](../../role-based-access-control/built-in-roles.md#storage-blob-data-reader) role.

    ![Screenshot of Add role assignment page with Roles tab.](./media/storage-auth-abac-portal/roles.png)

1. On the **Members** tab, select the user you created earlier.

   ![Screenshot of Add role assignment page with Members tab.](./media/storage-auth-abac-portal/members.png)

1. (Optional) In the **Description** box, enter **Read access to blobs with the tag Project=Cascade**.

1. Click **Next**.

## Step 4: Add a condition

1. On the **Conditions (optional)** tab, click **Add condition**.

    ![Screenshot of Add role assignment condition page for a new condition.](./media/storage-auth-abac-portal/condition-add-new.png)

    The Add role assignment condition page appears.

1. In the Add action section, click **Add action**.

    The Select an action pane appears. This pane is a filtered list of data actions based on the role assignment that will be the target of your condition.

    ![Screenshot of Select an action pane with an action selected.](./media/storage-auth-abac-portal/condition-actions-select.png)

1. Check the box next to **Read a blob**, then click **Select**.

1. In the Build expression section, click **Add expression**.

    The Expression section expands.

1. Specify the following expression settings:

    | Setting | Value |
    | --- | --- |
    | Attribute source | Resource |
    | Attribute | Blob index tags [Values in key] |
    | Key | Project |
    | Operator | StringEqualsIgnoreCase |
    | Value | Cascade |

    ![Screenshot of Build expression section for blob index tags.](./media/storage-auth-abac-portal/condition-expressions.png)

1. Scroll up to **Editor type** and click **Code**.

    The condition is displayed as code. You can make changes to the condition in this code editor. To go back to the visual editor, click **Visual**.

    ![Screenshot of condition displayed in code editor.](./media/storage-auth-abac-portal/condition-code.png)

1. Click **Save** to add the condition and return the Add role assignment page.

1. Click **Next**.

1. On the **Review + assign** tab, click **Review + assign** to assign the role with a condition.

    After a few moments, the security principal is assigned the role at the selected scope.

    ![Screenshot of role assignment list after assigning role.](./media/storage-auth-abac-portal/rg-role-assignments-condition.png)

## Step 5: Assign Reader role

- Repeat the previous steps to assign the [Reader](../../role-based-access-control/built-in-roles.md#reader) role to the user you created earlier at resource group scope.

    > [!NOTE]
    > You typically don't need to assign the Reader role. However, this is done so that you can test the condition using the Azure portal.

## Step 6: Test the condition

1. In a new window, open the [Azure portal](https://portal.azure.com).

1. Sign in as the user you created earlier.

1. Open the storage account and container you created.

1. Ensure that the authentication method is set to **Azure AD User Account** and not **Access key**.

    ![Screenshot of storage container with test files.](./media/storage-auth-abac-portal/test-storage-container.png)

1. Click the Baker text file.

    You should **NOT** be able to view or download the blob and an authorization failed message should be displayed.
 
1. Click Cascade text file.

    You should be able to view and download the blob.

## Step 7: Clean up resources

1. Remove the role assignment you added.

1. Delete the test storage account you created.

1. Delete the user you created.

## Next steps

- [Example Azure role assignment conditions](storage-auth-abac-examples.md)
- [Actions and attributes for Azure role assignment conditions in Azure Storage (preview)](storage-auth-abac-attributes.md)
- [Azure role assignment condition format and syntax](../../role-based-access-control/conditions-format.md)
