---
title: Grant permissions to managed identity in Synapse workspace
description: Learn how to configure permissions for managed identity in Azure Synapse workspace.
author: meenalsri
ms.author: mesrivas
ms.reviewer: whhender
ms.date: 02/11/2025
ms.service: azure-synapse-analytics
ms.subservice: security
ms.topic: how-to
ms.custom: subject-rbac-steps
---

# Grant permissions to workspace managed identity

This article teaches you how to grant permissions to the managed identity in Azure Synapse workspace. Permissions, in turn, allow access to dedicated SQL pools in the workspace and Azure Data Lake Storage Gen2 account through the Azure portal.

> [!NOTE]
> This workspace managed identity is referred to as managed identity through the rest of this document.

## Grant the managed identity permissions to Data Lake Storage account

A Data Lake Storage Gen2 account is required to create an Azure Synapse workspace. To successfully launch Spark pools in Azure Synapse workspace, the Azure Synapse managed identity needs the *Storage Blob Data Contributor* role on this storage account. Pipeline orchestration in Azure Synapse also benefits from this role.

### Grant permissions to managed identity during workspace creation

Azure Synapse attempts to grant the *Storage Blob Data Contributor* role to the managed identity after you create the Azure Synapse workspace using the Azure portal. You provide the Data Lake Storage account details in the **Basics** tab.

:::image type="content" source="./media/how-to-grant-workspace-managed-identity-permissions/configure-workspace-managed-identity-1.png" alt-text="Screenshot of the Basics tab in workspace creation flow.":::

Choose the Data Lake Storage Gen2 account and filesystem in **Account name** and **File system name**.

:::image type="content" source="./media/how-to-grant-workspace-managed-identity-permissions/configure-workspace-managed-identity-2.png" alt-text="Screenshot of providing the Data Lake Storage Gen2 account details.":::

If the workspace creator is also *Owner* of the Data Lake Storage account, then Azure Synapse assigns the *Storage Blob Data Contributor* role to the managed identity. The following message appears.

:::image type="content" source="./media/how-to-grant-workspace-managed-identity-permissions/configure-workspace-managed-identity-3.png" alt-text="Screenshot of the successful storage blob data contributor assignment.":::

If the workspace creator isn't the owner of the Data Lake Storage account, then Azure Synapse doesn't assign the *Storage Blob Data Contributor* role to the managed identity. The following message notifies the workspace creator that they don't have sufficient permissions to grant the *Storage Blob Data Contributor* role to the managed identity.

:::image type="content" source="./media/how-to-grant-workspace-managed-identity-permissions/configure-workspace-managed-identity-4.png" alt-text="Screenshot of an unsuccessful storage blob data contributor assignment, with the error box highlighted.":::

You can't create Spark pools unless the *Storage Blob Data Contributor* is assigned to the managed identity.

### Grant permissions to managed identity after workspace creation

During workspace creation, if you don't assign the *Storage Blob Data contributor* to the managed identity, then the *Owner* of the Data Lake Storage Gen2 account manually assigns that role to the identity. The following steps help you to accomplish manual assignment.

#### Step 1: Navigate to the Data Lake Storage Gen2 account

In the Azure portal, open the Data Lake Storage Gen2 storage account and select **Containers** from the left navigation. You only need to assign the *Storage Blob Data Contributor* role at the container or filesystem level.

:::image type="content" source="./media/how-to-grant-workspace-managed-identity-permissions/configure-workspace-managed-identity-5.png" alt-text="Screenshot of the Azure portal, of the Overview of the Data Lake Storage Gen2 account.":::

#### Step 2: Select the container

The managed identity should have data access to the container (file system) that was provided when the workspace was created. You can find this container or file system in the Azure portal. Open the Azure Synapse workspace in the Azure portal and select the **Overview** tab from the left navigation.

:::image type="content" source="./media/how-to-grant-workspace-managed-identity-permissions/configure-workspace-managed-identity-7.png" alt-text="Screenshot of the Azure portal showing the name of the Data Lake Storage Gen2 file 'contosocontainer'.":::

Select that same container or file system to grant the *Storage Blob Data Contributor* role to the managed identity.

:::image type="content" source="./media/how-to-grant-workspace-managed-identity-permissions/configure-workspace-managed-identity-6.png" alt-text="Screenshot that shows the container or file system that you should select.":::

#### Step 3: Open Access control and add role assignment

1. Select **Access control (IAM)** from the resource menu.

1. Select **Add** > **Add role assignment** to open the **Add role assignment** page.

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.yml).

    | Setting | Value |
    | --- | --- |
    | Role | Storage Blob Data Contributor |
    | Assign access to | MANAGEDIDENTITY |
    | Members | managed identity name  |

    > [!NOTE]  
    > The managed identity name is also the workspace name.

    :::image type="content" source="~/reusable-content/ce-skilling/azure/media/role-based-access-control/add-role-assignment-page.png" alt-text="Screenshot of the add role assignment page in the Azure portal.":::

1. Select **Save** to add the role assignment.

#### Step 4: Verify that the Storage Blob Data Contributor role is assigned to the managed identity

Select **Access Control (IAM)** and then select **Role assignments**.

:::image type="content" source="./media/how-to-grant-workspace-managed-identity-permissions/configure-workspace-managed-identity-14.png" alt-text="Screenshot of the Role Assignments button in the Azure portal, used to verify role assignment.":::

You should see your managed identity listed under the **Storage Blob Data Contributor** section with the *Storage Blob Data Contributor* role assigned to it.

:::image type="content" source="./media/how-to-grant-workspace-managed-identity-permissions/configure-workspace-managed-identity-15.png" alt-text="Screenshot of the Azure portal, showing Data Lake Storage Gen2 account container selection.":::

#### Alternative to Storage Blob Data Contributor role

Instead of granting yourself a *Storage Blob Data Contributor* role, you can also grant more granular permissions on a subset of files.

All users who need access to some data in this container also must have EXECUTE permission on all parent folders up to the root (the container).

To learn more, see [Use Azure Storage Explorer to manage ACLs in Azure Data Lake Storage](../../storage/blobs/data-lake-storage-explorer-acl.md).

> [!NOTE]  
> Execute permission on the container level must be set within Data Lake Storage Gen2.
> Permissions on the folder can be set within Azure Synapse.

If you want to query *data2.csv* in this example, the following permissions are needed:

- Execute permission on container
- Execute permission on folder1
- Read permission on data2.csv

:::image type="content" source="../sql/media/resources-self-help-sql-on-demand/folder-structure-data-lake.png" alt-text="Diagram that shows permission structure on data lake.":::

1. Sign in to Azure Synapse with an admin user that has full permissions on the data you want to access.

1. In the data pane, right-click the file and select **Manage access**.

   :::image type="content" source="../sql/media/resources-self-help-sql-on-demand/manage-access.png" alt-text="Screenshot that shows the manage access option.":::

1. Select at least **Read** permission. Enter the user's UPN or object ID, for example, `user@contoso.com`. Select **Add**.

1. Grant read permission for this user.

   :::image type="content" source="../sql/media/resources-self-help-sql-on-demand/grant-permission.png" alt-text="Screenshot that shows granting read permissions.":::

> [!NOTE]  
> For guest users, this step needs to be done directly with Azure Data Lake because it can't be done directly through Azure Synapse.

## Related content

- [Managed identity for Azure Data Factory](../../data-factory/data-factory-service-identity.md?context=/azure/synapse-analytics/context/context&tabs=synapse-analytics)
- [Best practices for dedicated SQL pools](../sql/best-practices-dedicated-sql-pool.md)
- [Troubleshoot serverless SQL pool in Azure Synapse Analytics](../sql/resources-self-help-sql-on-demand.md)
- [Azure Synapse Analytics frequently asked questions](../overview-faq.yml)
