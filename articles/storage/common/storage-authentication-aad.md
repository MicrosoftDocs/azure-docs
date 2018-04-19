---
title: Authenticating requests to Azure Storage using Identity and Access Management (Preview) | Microsoft Docs
description: Authenticating requests to Azure Storage using Identity and Access Management (IAM).  
services: storage
author: tamram
manager: jeconnoc

ms.service: storage
ms.topic: overview
ms.date: 04/16/2018
ms.author: tamram
---

# Authenticating requests to Azure Storage using Identity and Access Management (Preview)



With IAM policies, you can grant users access to your Azure Storage resources using RBAC. For example, you can grant permissions to specific users, groups, or application that are scoped to the level of an individual container or queue. This capability seamlessly blends the unifying role-based access control (RBAC) framework used by Azure and leverages the authorization capabilities of Azure Active Directory (Azure AD).

Azure AD integration with Azure Storage is currently in preview for Azure Blob storage and Azure Queues. Azure AD integration with Azure Storage is available for both new and existing storage accounts created with the Azure Resource Manager model. Microsoft recommends using non-production workloads with this preview technology. 

## Assign a role to an Azure AD user, group, or application

Azure Storage offers four roles for use with Azure AD/IAM:

- [Storage Blob Data Contributor (Preview)](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor-preview) for read, write, and delete access to containers and blobs.
- [Storage Blob Data Reader (Preview)](../../role-based-access-control/built-in-roles.md#storage-blob-data-reader-preview) for read access to containers and blobs.
- [Storage Queue Data Contributor (Preview)](../../role-based-access-control/built-in-roles.md#storage-queue-data-contributor-preview) for read, write, and delete access to queues and messages.
- [Storage Queue Data Reader (Preview)](../../role-based-access-control/built-in-roles.md#storage-queue-data-reader-preview) for read access to queues and messages.

To grant access to X

1. In the [Azure portal](https://azure.portal.com/), navigate to your storage account. If you don't already have a storage account created with the Azure Resource Manager model, then create a new storage account. For guidance on creating an Azure Resource Manager storage account, see [Create a storage account](storage-quickstart-create-account.md).
2. Select your storage account, then select **Access Control (IAM)** to display access control settings for the account. Click the **Add** button to add a new role.

    ![Screen shot showing storage access control settings](media/storage-authentication-aad/portal-access-control.png)

3. In the **Add permissions** window, select the role that you want to assign to users, groups, or an application. Then locate the names of the users or groups to whom you want to assign that role. For example, the following image shows the **Storage Blob Data Reader (Preview)** role assigned to a user.

    ![Screen shot showing how to assign an RBAC role](media/storage-authentication-aad/add-rbac-role.png)

4. Click **Save**. The users or groups that you added appear listed under the role that you selected.

    ![Screen shot showing list of users assigned to a role](media/storage-authentication-aad/list-users-rbac-role.png)

To learn more about RBAC, see [Get started with Role-Based Access Control in the Azure portal](../../role-based-access-control/overview.md).

