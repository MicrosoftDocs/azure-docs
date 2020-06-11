---
title: How to grant permissions to managed identity in Azure Synapse workspace 
description: An article that explains how to configure permissions for managed identity in Azure Synapse workspace. 
author: RonyMSFT 
ms.service: synapse-analytics 
ms.topic: how-to 
ms.date: 04/15/2020 
ms.author: ronytho 
ms.reviewer: jrasnick
---


# Grant permissions to workspace managed identity (preview)

This article teaches you how to grant permissions to the managed identity in Azure synapse workspace. Permissions, in turn, allow access to SQL pools in the workspace and ADLS Gen2 storage account through the Azure portal.

>[!NOTE]
>This workspace managed identity will be referred to as managed identity through the rest of this document.

## Grant the managed identity  permissions to the SQL pool

The managed identity grants permissions to the SQL pools in the workspace. With permissions granted, you can orchestrate pipelines that perform SQL pool-related activities. When you create an Azure Synapse workspace using Azure portal, you can grant the managed identity CONTROL permissions on SQL pools.

Select **Security + networking** when you're creating your Azure Synapse workspace. Then select **Grant CONTROL to the workspace's managed identity on SQL pools**.

![CONTROL permission on SQL pools](./media/how-to-grant-workspace-managed-identity-permissions/configure-workspace-managed-identity-16.png)

## Grant the managed identity permissions to ADLS Gen2 storage account

An ADLS Gen2 storage account is required to create an Azure Synapse workspace. To successfully launch Spark pools in Azure Synapse workspace, the Azure Synapse managed identity needs the *Storage Blob Data Contributor* role on this storage account . Pipeline orchestration in Azure Synapse also benefits from this role.

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
![ADLS Gen2 storage account container selection](./media/how-to-grant-workspace-managed-identity-permissions/configure-workspace-managed-identity-6.png)

#### Step 3: Navigate to Access control

Select **Access Control (IAM)**.

![Access control(IAM)](./media/how-to-grant-workspace-managed-identity-permissions/configure-workspace-managed-identity-8.png)

#### Step 4: Add a new role assignment

Select **+ Add**.

![Add new role assignment](./media/how-to-grant-workspace-managed-identity-permissions/configure-workspace-managed-identity-9.png)

#### Step 5: Select the RBAC role

Select the **Storage Blob Data Contributor** role.

![Select the RBAC role](./media/how-to-grant-workspace-managed-identity-permissions/configure-workspace-managed-identity-10.png)

#### Step 6: Select the Azure AD security principal

Select **Azure AD user, group, or service principal** from the **Assign access to** drop down.

![Select AAD security principal](./media/how-to-grant-workspace-managed-identity-permissions/configure-workspace-managed-identity-11.png)

#### Step 7: Search for the managed identity

The managed identity's name is also the workspace name. Search for your managed identity by entering you Azure Synapse workspace name in **Select**. You should see the managed identity listed.

![Find the managed identity](./media/how-to-grant-workspace-managed-identity-permissions/configure-workspace-managed-identity-12.png)

#### Step 8: Select the managed identity

Select the managed identity to the **Selected members**. Select **Save** to add the role assignment.

![Select the managed identity](./media/how-to-grant-workspace-managed-identity-permissions/configure-workspace-managed-identity-13.png)

#### Step 9: Verify that the Storage Blob Data Contributor role is assigned to the managed identity

Select **Access Control(IAM)** and then select **Role assignments**.

![Verify role assignment](./media/how-to-grant-workspace-managed-identity-permissions/configure-workspace-managed-identity-14.png)

You should see your managed identity listed under the **Storage Blob Data Contributor** section with the *Storage Blob Data Contributor* role assigned to it. 
![ADLS Gen2 storage account container selection](./media/how-to-grant-workspace-managed-identity-permissions/configure-workspace-managed-identity-15.png)

## Next steps

Learn more about [Workspace managed identity](./synapse-workspace-managed-identity.md)
