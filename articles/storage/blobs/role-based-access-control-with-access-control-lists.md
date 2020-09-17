---
title: Using RBAC with ACLs in Azure Data Lake Storage Gen2 | Microsoft Docs
description: Learn how to configure container, directory, and file-level access in accounts that have a hierarchical namespace. 
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 09/16/2020
ms.author: normesta
---

# Using role-based access control (RBAC) with access control lists (ACLs) in Azure Data Lake Storage Gen2

Introduction goes here

## The scope of permissions for RBAC and ACLs

RBACs let you assign roles to security principals (user, group, service principal or managed identity in AAD) and these roles are associated with sets of permissions to the data in your container. RBACs can help manage roles related to control plane operations (such as adding other users and assigning roles, manage encryption settings, firewall rules etc) or for data plane operations (such as creating containers, reading and writing data etc). Fore more information on RBACs, you can read this article.
RBACs are essentially scoped to top-level resources – either storage accounts or containers in ADLS Gen2. You can also apply RBACs across resources at a resource group or subscription level. ACLs let you manage a specific set of permissions for a security principal to a much narrower scope – a file or a directory in ADLS Gen2.

While using Azure role assignments is a powerful mechanism to control access permissions, it is a very coarsely grained mechanism relative to ACLs. The smallest granularity for RBAC is at the container level and this will be evaluated at a higher priority than ACLs. Therefore, if you assign a role to a security principal in the scope of a container, that security principal has the authorization level associated with that role for ALL directories and files in that container, regardless of ACL assignments.

## Understanding the built-in RBAC roles

Azure Storage has two layers of access: management and data. Subscriptions and storage accounts are accessed through the management layer. Containers, blobs, and other data resources are accessed through the data layer. For example, if you want to get a list of your storage accounts from Azure, you send a request to the management endpoint. If you want a list of blob containers in an account, you send a request to the appropriate service endpoint.

RBAC roles can contain permissions for management or data layer access. The Reader role, for example, grants read-only access to management layer resources.

Only roles explicitly defined for data access permit a [security principal](https://docs.microsoft.com/azure/role-based-access-control/overview#security-principal) to access blob or queue data. Roles such as Owner, Contributor, Reader and Storage Account Contributor permit a security principal to manage a storage account, but do not provide access to the blob or queue data within that account. However, these roles (excluding Reader) can obtain access to the storage keys which can be used in various client tools to access the data.

### Built-in management roles

|Role|Description|
|--|--|
| Owner | Manage everything, including access to resources. This role will give you key access. |
| Contributor | Manage everything, excluding access to resources. This role will give you key access. |
| Reader | Read and list resources. |
| Storage Account Contributor | Full management of storage accounts. Note: this role will give you key access. |

### Built-in data roles

|Role|Description|
|--|--|
| Storage Blob Data Owner | Full access to Azure Storage blob containers and data including setting of ownership and managing POSIX access control (ACLs) |
| Storage Blob Data Contributor | Read, write, and delete Azure Storage containers and blobs. |
| Storage Blob Data Reader | Read and list Azure Storage containers and blobs. |

Storage Blob Data Owner is considered a super-user and is granted full access to all mutating operations, including setting the owner of a directory or file as well as ACLs for directories and files for which they are not the owner. Super-user access is the only authorized manner to change the owner of a resource.

## How access to data is evaluated

During security principal-based authorization, permissions are evaluated in the following order as depicted in the diagram below and described in the documentation:

1. RBAC is evaluated first and takes priority over any ACL assignments.

2. If the operation is fully authorized based on RBAC then ACLs are not evaluated at all.

3. If the operation is not fully authorized then ACLs are evaluated.

> [!NOTE]
> This description excludes Shared Key and SAS authentication methods in which no identity is associated with the operation and assumes that the storage account is accessible via appropriate networking configuration. It also excludes scenarios in which the security principal has been assigned the Storage Blob Data Owner built-in role which provides super-user access. 

Image goes here.

## Limits on RBAC and ACL

When using RBAC at the container level as the only mechanism for data access control, be cautious of the 2000 limit, particularly if you are likely to have a large number of containers. You can view the number of role assignments per subscription in any of the access control (IAM) blades in the portal.

32 ACLs (effectively 28 ACLs) per file, 32 ACLs (effectively 28 ACLs) per folder, default and access ACLs each.

## Example scenarios

Here's a few scenarios

•	See containers in ASE
•	List containers in a storage account
•	List contents of directory but no access to files
•	Read access to a specific file

Scenario: You want to give access for users to use Storage Explorer to look through files

Because of the way that ASE mounts containers, you must provide read access to the root folder of the container. From there, you can provide either execute only (if you want the user to be able to traverse the hierarchy to the desired file or B) Read access to directories if you want them to see files in directories but not read files or C) Read access to all items in directories.
Good tip from James:
"Regarding how the R permission is propagated to child directories, you need to consider the role of ‘default’ permissions (described in the same doc). 

In this particular case, you may not want defaults to propagate from the root to top-level directories. You may want to manually set permissions (and defaults) on the top-level directories & not apply a default to the root. This will allow you, for instance, to grant Chris the ability to see all of the top-level directories, but not see any of the contents (except folder1) and as he clicks down the directory structure, he will only be able to click down where he has R permission (the other top-level directories he won’t have R)"

Scenario: You want to enumerate the containers in a storage account

List all containers in the account. You need to have either super user access or Blob Data Reader. If you don’t want folks to have read access of directories and files, you can give them “reader” access. Then use ACLs to control which directories and files they can see (if you want them to see any)
ACL only – won’t work because it won’t grant access to view containers in the account.
Option A: Grant “Reader” role if you just want folks to see containers.  Then grant ACLs beyond that for whatever read or list permission you want them to have.
Option B: Grant “Data Reader” role and they can list and also read any file in the hierarchy. You can then give ACLs to provide write permissions wherever you want.

Scenario: You want to provide the ability to list contents of a container without allowing read on blob data
Read on root folder of container. 

Scenario: You want to set the ACL of a file.

Scenario: You want users to traverse through system but only see files in one folder

Execute on all folders but not read on any of the folders that you don't want folks to see the files. Apply read only to the folder that you want users to see the files. Read on a folder lets you list files. Read on a file lets you read the file.


## See also

* [Overview of Azure Data Lake Storage Gen2](../blobs/data-lake-storage-introduction.md)
