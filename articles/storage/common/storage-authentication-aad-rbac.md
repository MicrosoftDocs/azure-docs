---
title: Manage access rights to storage data with RBAC (Preview) | Microsoft Docs
description: Manage access rights to storage data with RBAC (Preview).  
services: storage
author: tamram
manager: jeconnoc

ms.service: storage
ms.topic: article
ms.date: 05/18/2018
ms.author: tamram
---

# Manage access rights to storage data with RBAC (Preview)

Azure AD handles the authorization of access to secured resources through RBAC. Using RBAC, you can assign roles to users, groups, or service principals. Each role encompasses a set of permissions for a container or queue. Once the role is assigned to the user, group, or service principal, that agent has access to that resource. You can assign access rights using the Azure portal, Azure command-line tools, and Azure Management APIs. 

For more information on RBAC, see [Get started with Role-Based Access Control](https://docs.microsoft.com/azure/role-based-access-control/overview).

## RBAC roles for Azure Storage

In Azure Storage, you can grant access to containers or queues in your storage account. Azure Storage offers these built-in RBAC roles for use with Azure AD:

- [Storage Blob Data Contributor (Preview)](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#storage-blob-data-contributor-preview)
- [Storage Blob Data Reader (Preview)](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#storage-blob-data-reader-preview)
- [Storage Queue Data Contributor (Preview)](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#storage-queue-data-contributor-preview)
- [Storage Queue Data Reader (Preview)](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#storage-queue-data-reader-preview)

For more information about how built-in roles are defined for Azure Storage, see [Understand role definitions](https://docs.microsoft.com/azure/role-based-access-control/role-definitions#management-and-data-operations-preview).

You can also define custom roles for use with Blob storage and Azure Queues. For more information, see [Create custom roles for Azure Role-Based Access Control](https://docs.microsoft.com/azure/role-based-access-control/custom-roles.md). 

## Assign a role to an Azure AD user, group, or service principal

Assign an RBAC role to a user, group, or application service principal to grant permissions to containers or queues in your storage account. You can scope the role assignment to the storage account, or to a specific container or queue. The following table summarizes the access rights granted by a role, depending on scope: 

|                                 |    Blob Data Contributor                                              |    Blob Data Reader                                                  |    Queue Data Contributor                               |    Queue Data Reader                                   |
|---------------------------------|-----------------------------------------------------------------------|----------------------------------------------------------------------|---------------------------------------------------------|--------------------------------------------------------|
|    Scoped to storage account    |    Write access to all containers and blobs in the storage account    |    Read access to all containers and blobs in the storage account    |    Write access to all queues in the storage account    |    Read access to all queues in the storage account    |
|    Scoped to container/queue    |    Write access to the specified container and its blobs              |    Read access to the specified container and its blobs              |    Write access to the specified queue                  |    Read access to the specified queue                  |

### Assign a role scoped to the storage account

To assign a built-in role granting access to all containers or queues in the storage account in the Azure portal:

1. In the [Azure portal](https://azure.portal.com/), navigate to your storage account. If you don't already have a storage account created with the Azure Resource Manager model, then create a new storage account. For guidance on creating an Azure Resource Manager storage account, see [Create a storage account](storage-quickstart-create-account.md).

2. Select your storage account, then select **Access Control (IAM)** to display access control settings for the account. Click the **Add** button to add a new role.

    ![Screen shot showing storage access control settings](media/storage-authentication-aad-rbac/portal-access-control.png)

3. In the **Add permissions** window, select the role that you want to assign to a user, group, or service principal. Then search to locate the user, group, or service principal to whom you want to assign that role. For example, the following image shows the **Storage Blob Data Reader (Preview)** role assigned to a user.

    ![Screen shot showing how to assign an RBAC role](media/storage-authentication-aad-rbac/add-rbac-role.png)

4. Click **Save**. The user, group, or service principal that you added appears listed under the role that you selected. For example, the following image shows that the user added now has read permissions to all blob data in the storage account.

    ![Screen shot showing list of users assigned to a role](media/storage-authentication-aad-rbac/list-users-rbac-role.png)

### Assign a role scoped to a container or queue

To 






- [Storage Account Contributor](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#storage-account-contributor)
- [Storage Account Key Operator Service Role](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#storage-account-key-operator-service-role)


## Next Steps

To learn more about RBAC, see [Get started with Role-Based Access Control in the Azure portal](../../role-based-access-control/overview.md).




