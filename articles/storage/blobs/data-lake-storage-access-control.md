---
title: Access control lists in Azure Data Lake Storage Gen2
titleSuffix: Azure Storage
description: Understand how POSIX-like ACLs access control lists work in Azure Data Lake Storage Gen2.
author: normesta

ms.service: azure-data-lake-storage
ms.topic: conceptual
ms.date: 08/30/2023
ms.author: normesta
ms.reviewer: jamesbak
ms.devlang: python
ms.custom: engagement-fy23
---

# Access control lists (ACLs) in Azure Data Lake Storage Gen2

Azure Data Lake Storage Gen2 implements an access control model that supports both Azure role-based access control (Azure RBAC) and POSIX-like access control lists (ACLs). This article describes access control lists in Data Lake Storage Gen2. To learn about how to incorporate Azure RBAC together with ACLs, and how system evaluates them to make authorization decisions, see [Access control model in Azure Data Lake Storage Gen2](data-lake-storage-access-control-model.md).

<a id="access-control-lists-on-files-and-directories"></a>

## About ACLs

You can associate a [security principal](../../role-based-access-control/overview.md#security-principal) with an access level for files and directories. Each association is captured as an entry in an *access control list (ACL)*. Each file and directory in your storage account has an access control list. When a security principal attempts an operation on a file or directory, an ACL check determines whether that security principal (user, group, service principal, or managed identity) has the correct permission level to perform the operation.

> [!NOTE]
> ACLs apply only to security principals in the same tenant, and they don't apply to users who use Shared Key or shared access signature (SAS) token authentication. That's because no identity is associated with the caller and therefore security principal permission-based authorization cannot be performed.

<a id="set-access-control-lists"></a>

## How to set ACLs

To set file and directory level permissions, see any of the following articles:

| Environment | Article |
|--------|-----------|
|Azure Storage Explorer |[Use Azure Storage Explorer to manage ACLs in Azure Data Lake Storage Gen2](data-lake-storage-explorer-acl.md)|
|Azure portal |[Use the Azure portal to manage ACLs in Azure Data Lake Storage Gen2](data-lake-storage-acl-azure-portal.md)|
|.NET |[Use .NET to manage ACLs in Azure Data Lake Storage Gen2](data-lake-storage-acl-dotnet.md)|
|Java|[Use Java to manage ACLs in Azure Data Lake Storage Gen2](data-lake-storage-acl-java.md)|
|Python|[Use Python to manage ACLs in Azure Data Lake Storage Gen2](data-lake-storage-acl-python.md)|
|JavaScript (Node.js)|[Use the JavaScript SDK in Node.js to manage ACLs in Azure Data Lake Storage Gen2](data-lake-storage-directory-file-acl-javascript.md)|
|PowerShell|[Use PowerShell to manage ACLs in Azure Data Lake Storage Gen2](data-lake-storage-acl-powershell.md)|
|Azure CLI|[Use Azure CLI to manage ACLs in Azure Data Lake Storage Gen2](data-lake-storage-acl-cli.md)|
|REST API |[Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update)|

> [!IMPORTANT]
> If the security principal is a *service* principal, it's important to use the object ID of the service principal and not the object ID of the related app registration. To get the object ID of the service principal open the Azure CLI, and then use this command: `az ad sp show --id <Your App ID> --query objectId`. Make sure to replace the `<Your App ID>` placeholder with the App ID of your app registration. The service principal is treated as a named user. You'll add this ID to the ACL as you would any named user. Named users are described later in this article.

## Types of ACLs

There are two kinds of access control lists: *access ACLs* and *default ACLs*.

Access ACLs control access to an object. Files and directories both have access ACLs.

Default ACLs are templates of ACLs associated with a directory that determine the access ACLs for any child items that are created under that directory. Files do not have default ACLs.

Both access ACLs and default ACLs have the same structure.

> [!NOTE]
> Changing the default ACL on a parent does not affect the access ACL or default ACL of child items that already exist.

## Levels of permission

The permissions on directories and files in a container, are **Read**, **Write**, and **Execute**, and they can be used on files and directories as shown in the following table:

|            |    File     |   Directory |
|------------|-------------|----------|
| **Read (R)** | Can read the contents of a file | Requires **Read** and **Execute** to list the contents of the directory |
| **Write (W)** | Can write or append to a file | Requires **Write** and **Execute** to create child items in a directory |
| **Execute (X)** | Does not mean anything in the context of Data Lake Storage Gen2 | Required to traverse the child items of a directory |

> [!NOTE]
> If you are granting permissions by using only ACLs (no Azure RBAC), then to grant a security principal read or write access to a file, you'll need to give the security principal **Execute** permissions to the root folder of the container, and to each folder in the hierarchy of folders that lead to the file.

### Short forms for permissions

**RWX** is used to indicate **Read + Write + Execute**. A more condensed numeric form exists in which **Read=4**, **Write=2**, and **Execute=1**, the sum of which represents the permissions. Following are some examples.

| Numeric form | Short form |      What it means     |
|--------------|------------|------------------------|
| 7            | `RWX`        | Read + Write + Execute |
| 5            | `R-X`        | Read + Execute         |
| 4            | `R--`        | Read                   |
| 0            | `---`        | No permissions         |

### Permissions inheritance

In the POSIX-style model that's used by Data Lake Storage Gen2, permissions for an item are stored on the item itself. In other words, permissions for an item cannot be inherited from the parent items if the permissions are set after the child item has already been created. Permissions are only inherited if default permissions have been set on the parent items before the child items have been created.

## Common scenarios related to ACL permissions

The following table shows you the ACL entries required to enable a security principal to perform the operations listed in the **Operation** column.

This table shows a column that represents each level of a fictitious directory hierarchy. There's a column for the root directory of the container (`/`), a subdirectory named **Oregon**, a subdirectory of the Oregon directory named **Portland**, and a text file in the Portland directory named **Data.txt**.

> [!IMPORTANT]
> This table assumes that you are using **only** ACLs without any Azure role assignments. To see a similar table that combines Azure RBAC together with ACLs, see [Permissions table: Combining Azure RBAC, ABAC, and ACLs](data-lake-storage-access-control-model.md#permissions-table-combining-azure-rbac-abac-and-acls).

|    Operation             |    /    | Oregon/ | Portland/ | Data.txt     |
|--------------------------|---------|----------|-----------|--------------|
| Read Data.txt            |   `--X`   |   `--X`    |  `--X`      | `R--`          |
| Append to Data.txt       |   `--X`   |   `--X`    |  `--X`      | `RW-`          |
| Delete Data.txt          |   `--X`   |   `--X`    |  `-WX`      | `---`          |
| Create Data.txt          |   `--X`   |   `--X`    |  `-WX`      | `---`          |
| List /                   |   `R-X`   |   `---`    |  `---`      | `---`          |
| List /Oregon/           |   `--X`   |   `R-X`    |  `---`      | `---`          |
| List /Oregon/Portland/  |   `--X`   |   `--X`    |  `R-X`      | `---`          |

> [!NOTE]
> Write permissions on the file are not required to delete it, so long as the previous two conditions are true.

## Users and identities

Every file and directory has distinct permissions for these identities:

- The owning user
- The owning group
- Named users
- Named groups
- Named service principals
- Named managed identities
- All other users

The identities of users and groups are Azure Active Directory (Azure AD) identities. So unless otherwise noted, a *user*, in the context of Data Lake Storage Gen2, can refer to an Azure AD user, service principal, managed identity, or security group.

### The super-user

A super-user has the most rights of all the users. A super-user:

- Has RWX Permissions to **all** files and folders.

- Can change the permissions on any file or folder.

- Can change the owning user or owning group of any file or folder.

If a container, file, or directory is created using Shared Key, an Account SAS, or a Service SAS, then the owner and owning group are set to `$superuser`.

### The owning user

The user who created the item is automatically the owning user of the item. An owning user can:

- Change the permissions of a file that is owned.
- Change the owning group of a file that is owned, as long as the owning user is also a member of the target group.

> [!NOTE]
> The owning user *cannot* change the owning user of a file or directory. Only super-users can change the owning user of a file or directory.

### The owning group

In the POSIX ACLs, every user is associated with a *primary group*. For example, user "Alice" might belong to the "finance" group. Alice might also belong to multiple groups, but one group is always designated as their primary group. In POSIX, when Alice creates a file, the owning group of that file is set to her primary group, which in this case is "finance." The owning group otherwise behaves similarly to assigned permissions for other users/groups.

#### Assigning the owning group for a new file or directory

- **Case 1:** The root directory `/`. This directory is created when a Data Lake Storage Gen2 container is created. In this case, the owning group is set to the user who created the container if it was done using OAuth. If the container is created using Shared Key, an Account SAS, or a Service SAS, then the owner and owning group are set to `$superuser`.
- **Case 2 (every other case):** When a new item is created, the owning group is copied from the parent directory.

#### Changing the owning group

The owning group can be changed by:

- Any super-users.
- The owning user, if the owning user is also a member of the target group.

> [!NOTE]
> The owning group cannot change the ACLs of a file or directory. While the owning group is set to the user who created the account in the case of the root directory, **Case 1** above, a single user account isn't valid for providing permissions via the owning group. You can assign this permission to a valid user group if applicable.

## How permissions are evaluated

Identities are evaluated in the following order:

1. Superuser
2. Owning user
3. Named user, service principal or managed identity
4. Owning group or named group
5. All other users

If more than one of these identities applies to a security principal, then the permission level associated with the first identity is granted. For example, if a security principal is both the owning user and a named user, then the permission level associated with the owning user applies. 

Named groups are all considered together. If a security principal is a member of more than one named group, then the system evaluates each group until the desired permission is granted. If none of the named groups provide the desired permission, then the system moves on to evaluate a request against the permission associated with all other users.

The following pseudocode represents the access check algorithm for storage accounts. This algorithm shows the order in which identities are evaluated.

```python
def access_check( user, desired_perms, path ) :
  # access_check returns true if user has the desired permissions on the path, false otherwise
  # user is the identity that wants to perform an operation on path
  # desired_perms is a simple integer with values from 0 to 7 ( R=4, W=2, X=1). User desires these permissions
  # path is the file or directory
  # Note: the "sticky bit" isn't illustrated in this algorithm

  # Handle super users.
  if (is_superuser(user)) :
    return True

  # Handle the owning user. Note that mask isn't used.
  entry = get_acl_entry( path, OWNER )
  if (user == entry.identity)
      return ( (desired_perms & entry.permissions) == desired_perms )

  # Handle the named users. Note that mask IS used.
  entries = get_acl_entries( path, NAMED_USER )
  for entry in entries:
      if (user == entry.identity ) :
          mask = get_mask( path )
          return ( (desired_perms & entry.permissions & mask) == desired_perms)

  # Handle named groups and owning group
  member_count = 0
  perms = 0
  entries = get_acl_entries( path, NAMED_GROUP | OWNING_GROUP )
  mask = get_mask( path )
  for entry in entries:
    if (user_is_member_of_group(user, entry.identity)) :
        if ((desired_perms & entry.permissions & mask) == desired_perms)
            return True

  # Handle other
  perms = get_perms_for_other(path)
  mask = get_mask( path )
  return ( (desired_perms & perms & mask ) == desired_perms)
```

### The mask

As illustrated in the Access Check Algorithm, the mask limits access for named users, the owning group, and named groups.

For a new Data Lake Storage Gen2 container, the mask for the access ACL of the root directory ("/") defaults to **750** for directories and **640** for files. The following table shows the symbolic notation of these permission levels.

|Entity|Directories|Files|
|--|--|--|
|Owning user|`rwx`|`rw-`|
|Owning group|`r-x`|`r--`|
|Other|`---`|`---`|

Files do not receive the X bit as it is irrelevant to files in a store-only system.

The mask may be specified on a per-call basis. This allows different consuming systems, such as clusters, to have different effective masks for their file operations. If a mask is specified on a given request, it completely overrides the default mask.

### The sticky bit

The sticky bit is a more advanced feature of a POSIX container. In the context of Data Lake Storage Gen2, it is unlikely that the sticky bit will be needed. In summary, if the sticky bit is enabled on a directory,  a child item can only be deleted or renamed by the child item's owning user, the directory's owner, or the Superuser ($superuser).

The sticky bit isn't shown in the Azure portal.

## Default permissions on new files and directories

When a new file or directory is created under an existing directory, the default ACL on the parent directory determines:

- A child directory's default ACL and access ACL.
- A child file's access ACL (files do not have a default ACL).

### umask

When creating a default ACL, the umask is applied to the access ACL to determine the initial permissions of a default ACL. If a default ACL is defined on the parent directory, the umask is effectively ignored and the default ACL of the parent directory is used to define these initial values instead.  

The umask is a 9-bit value on parent directories that contains an RWX value for **owning user**, **owning group**, and **other**.

The umask for Azure Data Lake Storage Gen2 a constant value that is set to 007. This value translates to:

| umask component     | Numeric form | Short form | Meaning |
|---------------------|--------------|------------|---------|
| umask.owning_user   |    0         |   `---`      | For owning user, copy the parent's access ACL to the child's default ACL |
| umask.owning_group  |    0         |   `---`      | For owning group, copy the parent's access ACL to the child's default ACL |
| umask.other         |    7         |   `RWX`      | For other, remove all permissions on the child's access ACL |

## FAQ

### Do I have to enable support for ACLs?

No. Access control via ACLs is enabled for a storage account as long as the Hierarchical Namespace (HNS) feature is turned ON.

If HNS is turned OFF, the Azure RBAC authorization rules still apply.

### What is the best way to apply ACLs?

[!INCLUDE [Security groups](../../../includes/azure-storage-data-lake-groups.md)]

### How are Azure RBAC and ACL permissions evaluated?

To learn how the system evaluates Azure RBAC and ACLs together to make authorization decisions for storage account resources, see [How permissions are evaluated](data-lake-storage-access-control-model.md#how-permissions-are-evaluated).

### What are the limits for Azure role assignments and ACL entries?

The following table provides a summary view of the limits to consider while using Azure RBAC to manage "coarse-grained" permissions (permissions that apply to storage accounts or containers) and using ACLs to manage "fine-grained" permissions (permissions that apply to files and directories). Use security groups for ACL assignments. By using groups, you're less likely to exceed the maximum number of role assignments per subscription and the maximum number of ACL entries per file or directory.

[!INCLUDE [Security groups](../../../includes/azure-storage-data-lake-rbac-acl-limits.md)]

### Does Data Lake Storage Gen2 support inheritance of Azure RBAC?

Azure role assignments do inherit. Assignments flow from subscription, resource group, and storage account resources down to the container resource.

### Does Data Lake Storage Gen2 support inheritance of ACLs?

Default ACLs can be used to set ACLs for new child subdirectories and files created under the parent directory. To update ACLs for existing child items, you will need to add, update, or remove ACLs recursively for the desired directory hierarchy. For guidance, see the [How to set ACLs](#set-access-control-lists) section of this article.

### Which permissions are required to recursively delete a directory and its contents?

- The caller has 'super-user' permissions,

Or

- The parent directory must have Write + Execute permissions.
- The directory to be deleted, and every directory within it, requires Read + Write + Execute permissions.

> [!NOTE]
> You do not need Write permissions to delete files in directories. Also, the root directory "/" can never be deleted.

### Who is the owner of a file or directory?

The creator of a file or directory becomes the owner. In the case of the root directory, this is the identity of the user who created the container.

### Which group is set as the owning group of a file or directory at creation?

The owning group is copied from the owning group of the parent directory under which the new file or directory is created.

### I am the owning user of a file but I don't have the RWX permissions I need. What do I do?

The owning user can change the permissions of the file to give themselves any RWX permissions they need.

### Why do I sometimes see GUIDs in ACLs?

A GUID is shown if the entry represents a user and that user doesn't exist in Azure AD anymore. Usually this happens when the user has left the company or if their account has been deleted in Azure AD. Additionally, service principals and security groups do not have a User Principal Name (UPN) to identify them and so they are represented by their OID attribute (a guid). To clean up the ACLs, manually delete these GUID entries. 

### How do I set ACLs correctly for a service principal?

When you define ACLs for service principals, it's important to use the Object ID (OID) of the *service principal* for the app registration that you created. It's important to note that registered apps have a separate service principal in the specific Azure AD tenant. Registered apps have an OID that's visible in the Azure portal, but the *service principal* has another (different) OID.
Article	
To get the OID for the service principal that corresponds to an app registration, you can use the `az ad sp show` command. Specify the Application ID as the parameter. Here's an example of obtaining the OID for the service principal that corresponds to an app registration with App ID = 18218b12-1895-43e9-ad80-6e8fc1ea88ce. Run the following command in the Azure CLI:

```azurecli
az ad sp show --id 18218b12-1895-43e9-ad80-6e8fc1ea88ce --query objectId
```

OID will be displayed.

When you have the correct OID for the service principal, go to the Storage Explorer **Manage Access** page to add the OID and assign appropriate permissions for the OID. Make sure you select **Save**

### Can I set the ACL of a container?

No. A container does not have an ACL. However, you can set the ACL of the container's root directory. Every container has a root directory, and it shares the same name as the container. For example, if the container is named `my-container`, then the root directory is named `my-container/`.

The Azure Storage REST API does contain an operation named [Set Container ACL](/rest/api/storageservices/set-container-acl), but that operation cannot be used to set the ACL of a container or the root directory of a container. Instead, that operation is used to indicate whether blobs in a container may be accessed with an anonymous request. We recommend requiring authorization for all requests to blob data. For more information, see [Overview: Remediating anonymous read access for blob data](anonymous-read-access-overview.md).

### Where can I learn more about POSIX access control model?

- [POSIX Access Control Lists on Linux](https://www.linux.com/news/posix-acls-linux)
- [HDFS permission guide](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/HdfsPermissionsGuide.html)
- [POSIX FAQ](https://www.opengroup.org/austin/papers/posix_faq.html)
- [POSIX 1003.1 2008](https://standards.ieee.org/wp-content/uploads/import/documents/interpretations/1003.1-2008_interp.pdf)
- [POSIX 1003.1 2013](https://pubs.opengroup.org/onlinepubs/9699919799.2013edition/)
- [POSIX 1003.1 2016](https://pubs.opengroup.org/onlinepubs/9699919799.2016edition/)
- [POSIX ACL on Ubuntu](https://help.ubuntu.com/community/FilePermissionsACLs)
- [ACL using access control lists on Linux](https://bencane.com/2012/05/27/acl-using-access-control-lists-on-linux/)

## See also

- [Access control model in Azure Data Lake Storage Gen2](data-lake-storage-access-control-model.md)
