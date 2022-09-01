---
title: Grant permissions to managed identity in Synapse workspace 
description: An article that explains how to configure permissions for managed identity in Azure Synapse workspace. 
author: meenalsri
ms.service: synapse-analytics 
ms.topic: how-to
ms.subservice: security 
ms.date: 09/01/2022
ms.author: mesrivas
ms.reviewer: sngun
ms.custom: subject-rbac-steps
---


# Grant permissions to workspace managed identity

This article teaches you how to grant permissions to the managed identity in Azure synapse workspace. Permissions, in turn, allow access to dedicated SQL pools in the workspace and ADLS Gen2 storage account through the Azure portal.

>[!NOTE]
>This workspace managed identity will be referred to as managed identity through the rest of this document.

## Grant the managed identity permissions to ADLS Gen2 storage account

An ADLS Gen2 storage account is required to create an Azure Synapse workspace. To successfully launch Spark pools in Azure Synapse workspace, the Azure Synapse managed identity needs the *Storage Blob Data Contributor* role on this storage account. Pipeline orchestration in Azure Synapse also benefits from this role.

### Grant permissions to managed identity during workspace creation

Azure Synapse will attempt to grant the Storage Blob Data Contributor role to the managed identity after you create the Azure Synapse workspace using Azure portal. You provide the ADLS Gen2 storage account details in the **Basics** tab.

![Basics tab in workspace creation flow](./media/how-to-grant-workspace-managed-identity-permissions/configure-workspace-managed-identity-1.png)

Choose the ADLS Gen2 storage account and filesystem in **Account name** and **File system name**.

![Providing an ADLS Gen2 storage account details](./media/how-to-grant-workspace-managed-identity-permissions/configure-workspace-managed-identity-2.png)

If the workspace creator is also **Owner** of the ADLS Gen2 storage account, then Azure Synapse will assign the *Storage Blob Data Contributor* role to the managed identity. You'll see the following message below the storage account details that you entered.

![Successful Storage Blob Data Contributor assignment](./media/how-to-grant-workspace-managed-identity-permissions/configure-workspace-managed-identity-3.png)

If the workspace creator isn't the owner of the ADLS Gen2 storage account, then Azure Synapse doesn't assign the *Storage Blob Data Contributor* role to the managed identity. The message appearing below the storage account details notifies the workspace creator that they don't have sufficient permissions to grant the *Storage Blob Data Contributor* role to the managed identity.

![Unsuccessful Storage Blob Data Contributor assignment](./media/how-to-grant-workspace-managed-identity-permissions/configure-workspace-managed-identity-4.png)

As the message states, you can't create Spark pools unless the *Storage Blob Data Contributor* is assigned to the managed identity.

### Grant permissions to managed identity after workspace creation

During workspace creation, if you don't assign the *Storage Blob Data contributor* to the managed identity, then the **Owner** of the ADLS Gen2 storage account manually assigns that role to the identity. The following steps will help you to accomplish manual assignment.

#### Step 1: Navigate to the ADLS Gen2 storage account in Azure portal

In Azure portal, open the ADLS Gen2 storage account and select **Overview** from the left navigation. You'll only need to assign The *Storage Blob Data Contributor* role at the container or filesystem level. Select **Containers**.  
![ADLS Gen2 storage account overview](./media/how-to-grant-workspace-managed-identity-permissions/configure-workspace-managed-identity-5.png)

#### Step 2: Select the container

The managed identity should have data access to the container (file system) that was provided when the workspace was created. You can find this container or file system in Azure portal. Open the Azure Synapse workspace in Azure portal and select the **Overview** tab from the left navigation.
![ADLS Gen2 storage account container](./media/how-to-grant-workspace-managed-identity-permissions/configure-workspace-managed-identity-7.png)


Select that same container or file system to grant the *Storage Blob Data Contributor* role to the managed identity.
![Screenshot that shows the container or file system that you should select.](./media/how-to-grant-workspace-managed-identity-permissions/configure-workspace-managed-identity-6.png)

#### Step 3: Open Access control and add role assignment

1. Select **Access control (IAM)**.

1. Select **Add** > **Add role assignment** to open the Add role assignment page.

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).
    
    | Setting | Value |
    | --- | --- |
    | Role | Storage Blob Data Contributor |
    | Assign access to | MANAGEDIDENTITY |
    | Members | managed identity name  |

    > [!NOTE]
    > The managed identity name is also the workspace name.

    ![Add role assignment page in Azure portal.](../../../includes/role-based-access-control/media/add-role-assignment-page.png)

1. Select **Save** to add the role assignment.

#### Step 4: Verify that the Storage Blob Data Contributor role is assigned to the managed identity

Select **Access Control(IAM)** and then select **Role assignments**.

![Verify role assignment](./media/how-to-grant-workspace-managed-identity-permissions/configure-workspace-managed-identity-14.png)

You should see your managed identity listed under the **Storage Blob Data Contributor** section with the *Storage Blob Data Contributor* role assigned to it. 
![ADLS Gen2 storage account container selection](./media/how-to-grant-workspace-managed-identity-permissions/configure-workspace-managed-identity-15.png)


#### Alternative to Storage Blob Data Contributor role

Instead of granting yourself a Storage Blob Data Contributor role, you can also grant more granular permissions on a subset of files.

All users who need access to some data in this container also must have EXECUTE permission on all parent folders up to the root (the container).

Learn more about how to [set ACLs in Azure Data Lake Storage Gen2](../../storage/blobs/data-lake-storage-explorer-acl.md).

> [!NOTE]
> Execute permission on the container level must be set within Data Lake Storage Gen2.
> Permissions on the folder can be set within Azure Synapse.

If you want to query data2.csv in this example, the following permissions are needed:

   - Execute permission on container
   - Execute permission on folder1
   - Read permission on data2.csv

![Diagram that shows permission structure on data lake.](../sql/media/resources-self-help-sql-on-demand/folder-structure-data-lake.png)

1. Sign in to Azure Synapse with an admin user that has full permissions on the data you want to access.
1. In the data pane, right-click the file and select **Manage access**.

   ![Screenshot that shows the Manage access option.](../sql/media/resources-self-help-sql-on-demand/manage-access.png)

1. Select at least **Read** permission. Enter the user's UPN or object ID, for example, user@contoso.com. Select **Add**.
1. Grant read permission for this user.

   ![Screenshot that shows granting read permissions.](../sql/media/resources-self-help-sql-on-demand/grant-permission.png)

> [!NOTE]
> For guest users, this step needs to be done directly with Azure Data Lake because it can't be done directly through Azure Synapse.


## Next steps

Learn more about [Workspace managed identity](../../data-factory/data-factory-service-identity.md?context=/azure/synapse-analytics/context/context&tabs=synapse-analytics)
