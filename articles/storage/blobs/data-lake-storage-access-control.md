---
title: Overview of access control in Azure Data Lake Storage Gen2 | Microsoft Docs
description: Understand how access control works in Azure Data Lake Storage Gen2
services: storage
author: nitinme

ms.component: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 11/30/2018
ms.author: nitinme
---

# Access control in Azure Data Lake Storage Gen2

Azure Data Lake Storage Gen2 implements an access control model that supports both Azure Role Based Access Control (RBAC) and POSIX-compliant access control lists (ACLs). This article summarizes the basics of the access control model for Data Lake Storage Gen2. 

## Azure Role-based Access Control (RBAC)

Azure Role-based Access Control (RBAC) uses role assignments to effectively apply sets of permissions to users, groups, and service principals for Azure resources. Typically, those Azure resources are constrained to top-level resources (*e.g.*, Azure Storage accounts). In the case of Azure Storage, and consequently Azure Data Lake Storage Gen2, this mechanism has been extended to the sub-resource of filesystems. 

While using RBAC role assignments is a very powerful mechanism to control user permissions, it is a very coarsely grained mechanism relative to ACLs. The smallest granularity for RBAC is at the filesystem level and this will be evaluated at a higher priority than ACLs. Therefore, if you assign RBAC permissions on a filesystem, that user or service principal will have that authorization for ALL directories and files in that filesystem, regardless of ACL assignments.

Azure Storage provides three built-in RBAC roles: 

- [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner-preview)
- [Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor-preview)
- [Storage Blob Data Reader](../../role-based-access-control/built-in-roles.md#storage-blob-data-reader-preview)

When a user or service principal is granted RBAC data permissions either through one of these built-in roles, or through a custom role, these permissions will be evaluated first when a request is authorized. If the request type (read, write, or super-user) is satisfied by the caller’s RBAC assignments then authorization is immediately resolved and no additional ACL checks are performed. Alternatively, if the caller does not have an RBAC assignment or the request’s operation does not match the assigned permission, then ACL checks are performed to determine if the caller is authorized to perform the requested operation.

A special note should be made of the Storage Blob Data Owner built-in role. If the caller has this RBAC assignment, then the user is considered a *super-user* and is granted full access to all mutating operations, including setting the owner of a directory or file as well as ACLs for directories and files for which they are not the owner. Super-user access is the only authorized manner to change the owner of a resource.

## Shared Key and Shared Access Signature Authentication

Azure Data Lake Storage Gen2 supports Shared Key and Shared Access Signature methods for authentication. A characteristic of these authentication methods is that no identity is associated with the caller and therefore permission-based authorization cannot be performed.
 
In the case of Shared Key, the caller effectively gains ‘super-user’ access, meaning full access to all operations on all resources, including setting owner and changing ACLs.

SAS tokens include allowed permissions as part of the token. The permissions included in the SAS token are effectively applied to all authorization decisions, but no additional ACL checks are performed.

## Access control lists on files and folders

There are two kinds of access control lists (ACLs): access ACLs and default ACLs.

* **Access ACLs**: Access ACLs control access to an object. Files and folders both have access ACLs.

* **Default ACLs**: A template of ACLs associated with a folder that determine the access ACLs for any child items that are created under that folder. Files do not have default ACLs.

Both access ACLs and default ACLs have the same structure.

> [!NOTE]
> Changing the default ACL on a parent does not affect the access ACL or default ACL of child items that already exist.
>
>

## Permissions

The permissions on a filesystem object are **Read**, **Write**, and **Execute**, and they can be used on files and folders as shown in the following table:

|            |    File     |   Folder |
|------------|-------------|----------|
| **Read (R)** | Can read the contents of a file | Requires **Read** and **Execute** to list the contents of the folder |
| **Write (W)** | Can write or append to a file | Requires **Write** and **Execute** to create child items in a folder |
| **Execute (X)** | Does not mean anything in the context of Data Lake Storage Gen2 | Required to traverse the child items of a folder |

### Short forms for permissions

**RWX** is used to indicate **Read + Write + Execute**. A more condensed numeric form exists in which **Read=4**, **Write=2**, and **Execute=1**, the sum of which represents the permissions. Following are some examples.

| Numeric form | Short form |      What it means     |
|--------------|------------|------------------------|
| 7            | `RWX`        | Read + Write + Execute |
| 5            | `R-X`        | Read + Execute         |
| 4            | `R--`        | Read                   |
| 0            | `---`        | No permissions         |


### Permissions do not inherit

In the POSIX-style model that's used by Data Lake Storage Gen2, permissions for an item are stored on the item itself. In other words, permissions for an item cannot be inherited from the parent items.

## Common scenarios related to permissions

Following are some common scenarios to help you understand which permissions are needed to perform certain operations on a Data Lake Storage Gen2 account.

|    Operation             |    /    | Seattle/ | Portland/ | Data.txt     |
|--------------------------|---------|----------|-----------|--------------|
| Read Data.txt            |   `--X`   |   `--X`    |  `--X`      | `R--`          |
| Append to Data.txt       |   `--X`   |   `--X`    |  `--X`      | `RW-`          |
| Delete Data.txt          |   `--X`   |   `--X`    |  `-WX`      | `---`          |
| Create Data.txt          |   `--X`   |   `--X`    |  `-WX`      | `---`          |
| List /                   |   `R-X`   |   `---`    |  `---`      | `---`          |
| List /Seattle/           |   `--X`   |   `R-X`    |  `---`      | `---`          |
| List /Seattle/Portland/  |   `--X`   |   `--X`    |  `R-X`      | `---`          |


> [!NOTE]
> Write permissions on the file are not required to delete it as long as the previous two conditions are true.
>
>


## Users and identities

Every file and folder has distinct permissions for these identities:

* The owning user
* The owning group
* Named users
* Named groups
* All other users

The identities of users and groups are Azure Active Directory (Azure AD) identities. So unless otherwise noted, a "user," in the context of Data Lake Storage Gen2, can either mean an Azure AD user or an Azure AD security group.

### The super-user

A super-user has the most rights of all the users in the Data Lake Storage Gen2 account. A super-user:

* Has RWX Permissions to **all** files and folders.
* Can change the permissions on any file or folder.
* Can change the owning user or owning group of any file or folder.

All users that are part of the **Owners** role for a Data Lake Storage Gen2 account are automatically a super-user.

### The owning user

The user who created the item is automatically the owning user of the item. An owning user can:

* Change the permissions of a file that is owned.
* Change the owning group of a file that is owned, as long as the owning user is also a member of the target group.

> [!NOTE]
> The owning user *cannot* change the owning user of a file or folder. Only super-users can change the owning user of a file or folder.
>
>

### The owning group

**Background**

In the POSIX ACLs, every user is associated with a "primary group." For example, user "alice" might belong to the "finance" group. Alice might also belong to multiple groups, but one group is always designated as her primary group. In POSIX, when Alice creates a file, the owning group of that file is set to her primary group, which in this case is "finance." The owning group otherwise behaves similarly to assigned permissions for other users/groups.

**Assiging the owning group for a new file or folder**

* **Case 1**: The root folder "/". This folder is created when a Data Lake Storage Gen2 account is created. In this case, the owning group is set to the user who created the account.
* **Case 2** (Every other case): When a new item is created, the owning group is copied from the parent folder.

**Changing the owning group**

The owning group can be changed by:
* Any super-users.
* The owning user, if the owning user is also a member of the target group.

> [!NOTE]
> The owning group *cannot* change the ACLs of a file or folder.  While the owning group is set to the user who created the account in the case of the root folder, **Case 1** above, a single user account is not valid for providing permissions via the owning group.  You can assign this permission to a valid user group if applicable.

## Access check algorithm

The following pseudocode represents the access check algorithm for Data Lake Storage Gen2 accounts.

```
def access_check( user, desired_perms, path ) : 
  # access_check returns true if user has the desired permissions on the path, false otherwise
  # user is the identity that wants to perform an operation on path
  # desired_perms is a simple integer with values from 0 to 7 ( R=4, W=2, X=1). User desires these permissions
  # path is the file or folder
  # Note: the "sticky bit" is not illustrated in this algorithm
  
# Handle super users.
  if (is_superuser(user)) :
    return True

  # Handle the owning user. Note that mask IS NOT used.
  entry = get_acl_entry( path, OWNER )
  if (user == entry.identity)
      return ( (desired_perms & e.permissions) == desired_perms )

  # Handle the named users. Note that mask IS used.
  entries = get_acl_entries( path, NAMED_USER )
  for entry in entries:
      if (user == entry.identity ) :
          mask = get_mask( path )
          return ( (desired_perms & entry.permmissions & mask) == desired_perms)

  # Handle named groups and owning group
  member_count = 0
  perms = 0
  entries = get_acl_entries( path, NAMED_GROUP | OWNING_GROUP )
  for entry in entries:
    if (user_is_member_of_group(user, entry.identity)) :
      member_count += 1
      perms | =  entry.permissions
  if (member_count>0) :
    return ((desired_perms & perms & mask ) == desired_perms)
 
  # Handle other
  perms = get_perms_for_other(path)
  mask = get_mask( path )
  return ( (desired_perms & perms & mask ) == desired_perms)
```

### The mask

As illustrated in the Access Check Algorithm, the mask limits access for **named users**, the **owning group**, and **named groups**.  

> [!NOTE]
> For a new Data Lake Storage Gen2 account, the mask for the access ACL of the root folder ("/") defaults to RWX.

### The sticky bit

The sticky bit is a more advanced feature of a POSIX filesystem. In the context of Data Lake Storage Gen2, it is unlikely that the sticky bit will be needed. In summary, if the sticky bit is enabled on a folder,  a child item can only be deleted or renamed by the child item's owning user.

The sticky bit is not shown in the Azure portal.

## Default permissions on new files and folders

When a new file or folder is created under an existing folder, the default ACL on the parent folder determines:

- A child folder’s default ACL and access ACL.
- A child file's access ACL (files do not have a default ACL).

### umask

When creating a file or folder, umask is used to modify how the default ACLs are set on the child item. umask is a 9 bit a 9-bit value on parent folders that contains an RWX value for **owning user**, **owning group**, and **other**.

The umask for Azure Data Lake Storage Gen2 a constant value that is set to 007. This value translates to

| umask component     | Numeric form | Short form | Meaning |
|---------------------|--------------|------------|---------|
| umask.owning_user   |    0         |   `---`      | For owning user, copy the parent's default ACL to the child's access ACL | 
| umask.owning_group  |    0         |   `---`      | For owning group, copy the parent's default ACL to the child's access ACL | 
| umask.other         |    7         |   `RWX`      | For other, remove all permissions on the child's access ACL |

The umask value used by Azure Data Lake Storage Gen2 effectively means that the value for other is never transmitted by default on new children - regardless of what the default ACL indicates. 

The following pseudocode shows how the umask is applied when creating the ACLs for a child item.

```
def set_default_acls_for_new_child(parent, child):
    child.acls = []
    for entry in parent.acls :
        new_entry = None
        if (entry.type == OWNING_USER) :
            new_entry = entry.clone(perms = entry.perms & (~umask.owning_user))
        elif (entry.type == OWNING_GROUP) :
            new_entry = entry.clone(perms = entry.perms & (~umask.owning_group))
        elif (entry.type == OTHER) :
            new_entry = entry.clone(perms = entry.perms & (~umask.other))
        else :
            new_entry = entry.clone(perms = entry.perms )
        child_acls.add( new_entry )
```

## Common questions about ACLs in Data Lake Storage Gen2

### Do I have to enable support for ACLs?

No. Access control via ACLs is always on for a Data Lake Storage Gen2 account.

### Which permissions are required to recursively delete a folder and its contents?

* The parent folder must have **Write + Execute** permissions.
* The folder to be deleted, and every folder within it, requires **Read + Write + Execute** permissions.

> [!NOTE]
> You do not need Write permissions to delete files in folders. Also, the root folder "/" can **never** be deleted.

### Who is the owner of a file or folder?

The creator of a file or folder becomes the owner.

### Which group is set as the owning group of a file or folder at creation?

The owning group is copied from the owning group of the parent folder under which the new file or folder is created.

### I am the owning user of a file but I don’t have the RWX permissions I need. What do I do?

The owning user can change the permissions of the file to give themselves any RWX permissions they need.

### When I look at ACLs in the Azure portal I see user names but through APIs, I see GUIDs, why is that?

Entries in the ACLs are stored as GUIDs that correspond to users in Azure AD. The APIs return the GUIDs as is. The Azure portal tries to make ACLs easier to use by translating the GUIDs into friendly names when possible.

### Why do I sometimes see GUIDs in the ACLs when I'm using the Azure portal?

A GUID is shown when the user doesn't exist in Azure AD anymore. Usually this happens when the user has left the company or if their account has been deleted in Azure AD.

### Does Data Lake Storage Gen2 support inheritance of ACLs?

No, but default ACLs can be used to set ACLs for child files and folder newly created under the parent folder.  

### Where can I learn more about POSIX access control model?

* [POSIX Access Control Lists on Linux](https://www.linux.com/news/posix-acls-linux)
* [HDFS permission guide](http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/HdfsPermissionsGuide.html)
* [POSIX FAQ](http://www.opengroup.org/austin/papers/posix_faq.html)
* [POSIX 1003.1 2008](http://standards.ieee.org/findstds/standard/1003.1-2008.html)
* [POSIX 1003.1 2013](http://pubs.opengroup.org/onlinepubs/9699919799.2013edition/)
* [POSIX 1003.1 2016](http://pubs.opengroup.org/onlinepubs/9699919799.2016edition/)
* [POSIX ACL on Ubuntu](https://help.ubuntu.com/community/FilePermissionsACLs)
* [ACL using access control lists on Linux](http://bencane.com/2012/05/27/acl-using-access-control-lists-on-linux/)

## See also

* [Overview of Azure Data Lake Storage Gen2](../blobs/data-lake-storage-introduction.md)
