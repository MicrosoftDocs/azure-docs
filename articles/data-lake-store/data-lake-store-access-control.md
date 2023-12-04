---
title: Overview of access control in Data Lake Storage Gen1 | Microsoft Docs
description: Learn about the basics of the access control model of Azure Data Lake Storage Gen1, which derives from HDFS.

author: normesta
ms.service: data-lake-store
ms.topic: conceptual
ms.date: 03/26/2018
ms.author: normesta

---
# Access control in Azure Data Lake Storage Gen1

Azure Data Lake Storage Gen1 implements an access control model that derives from HDFS, which in turn derives from the POSIX access control model. This article summarizes the basics of the access control model for Data Lake Storage Gen1. 

## Access control lists on files and folders

There are two kinds of access control lists (ACLs), **Access ACLs** and **Default ACLs**.

* **Access ACLs**: These control access to an object. Files and folders both have Access ACLs.

* **Default ACLs**: A "template" of ACLs associated with a folder that determine the Access ACLs for any child items that are created under that folder. Files do not have Default ACLs.


Both Access ACLs and Default ACLs have the same structure.

> [!NOTE]
> Changing the Default ACL on a parent does not affect the Access ACL or Default ACL of child items that already exist.
>
>

## Permissions

The permissions on a filesystem object are **Read**, **Write**, and **Execute**, and they can be used on files and folders as shown in the following table:

|            |    File     |   Folder |
|------------|-------------|----------|
| **Read (R)** | Can read the contents of a file | Requires **Read** and **Execute** to list the contents of the folder|
| **Write (W)** | Can write or append to a file | Requires **Write** and **Execute** to create child items in a folder |
| **Execute (X)** | Does not mean anything in the context of Data Lake Storage Gen1 | Required to traverse the child items of a folder |

### Short forms for permissions

**RWX** is used to indicate **Read + Write + Execute**. A more condensed numeric form exists in which **Read=4**, **Write=2**, and **Execute=1**, the sum of which represents the permissions. Following are some examples.

| Numeric form | Short form |      What it means     |
|--------------|------------|------------------------|
| 7            | `RWX`        | Read + Write + Execute |
| 5            | `R-X`        | Read + Execute         |
| 4            | `R--`        | Read                   |
| 0            | `---`        | No permissions         |


### Permissions do not inherit

In the POSIX-style model that's used by Data Lake Storage Gen1, permissions for an item are stored on the item itself. In other words, permissions for an item cannot be inherited from the parent items.

## Common scenarios related to permissions

Following are some common scenarios to help you understand which permissions are needed to perform certain operations on a Data Lake Storage Gen1 account.

| Operation | Object              |    /      | Seattle/   | Portland/   | Data.txt       |
|-----------|---------------------|-----------|------------|-------------|----------------|
| Read      | Data.txt            |   `--X`   |   `--X`    |  `--X`      | `R--`          |
| Append to | Data.txt            |   `--X`   |   `--X`    |  `--X`      | `-W-`          |
| Delete    | Data.txt            |   `--X`   |   `--X`    |  `-WX`      | `---`          |
| Create    | Data.txt            |   `--X`   |   `--X`    |  `-WX`      | `---`          |
| List      | /                   |   `R-X`   |   `---`    |  `---`      | `---`          |
| List      | /Seattle/           |   `--X`   |   `R-X`    |  `---`      | `---`          |
| List      | /Seattle/Portland/  |   `--X`   |   `--X`    |  `R-X`      | `---`          |


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

The identities of users and groups are Microsoft Entra identities. So unless otherwise noted, a "user," in the context of Data Lake Storage Gen1, can either mean a Microsoft Entra user or a Microsoft Entra security group.

### The super-user

A super-user has the most rights of all the users in the Data Lake Storage Gen1 account. A super-user:

* Has RWX Permissions to **all** files and folders.
* Can change the permissions on any file or folder.
* Can change the owning user or owning group of any file or folder.

All users that are part of the **Owners** role for a Data Lake Storage Gen1 account are automatically a super-user.

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

Because there is no “primary group” associated to users in Data Lake Storage Gen1, the owning group is assigned as below.

**Assigning the owning group for a new file or folder**

* **Case 1**: The root folder "/". This folder is created when a Data Lake Storage Gen1 account is created. In this case, the owning group is set to an all-zero GUID.  This value does not permit any access.  It is a placeholder until such time a group is assigned.
* **Case 2** (Every other case): When a new item is created, the owning group is copied from the parent folder.

**Changing the owning group**

The owning group can be changed by:
* Any super-users.
* The owning user, if the owning user is also a member of the target group.

> [!NOTE]
> The owning group *cannot* change the ACLs of a file or folder.
>
> For accounts created on or before September 2018, the owning group was set to the user who created the account in the case of the root folder for **Case 1**, above.  A single user account is not valid for providing permissions via the owning group, thus no permissions are granted by this default setting. You can assign this permission to a valid user group.


## Access check algorithm

The following pseudocode represents the access check algorithm for Data Lake Storage Gen1 accounts.

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
      return ( (desired_perms & entry.permissions) == desired_perms )

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
> For a new Data Lake Storage Gen1 account, the mask for the Access ACL of the root folder ("/") defaults to RWX.
>
>

### The sticky bit

The sticky bit is a more advanced feature of a POSIX filesystem. In the context of Data Lake Storage Gen1, it is unlikely that the sticky bit will be needed. In summary, if the sticky bit is enabled on a folder,  a child item can only be deleted or renamed by the child item's owning user.

The sticky bit is not shown in the Azure portal.

## Default permissions on new files and folders

When a new file or folder is created under an existing folder, the Default ACL on the parent folder determines:

- A child folder’s Default ACL and Access ACL.
- A child file's Access ACL (files do not have a Default ACL).

### umask

When creating a file or folder, umask is used to modify how the default ACLs are set on the child item. umask is a 9-bit value on parent folders that contains an RWX value for **owning user**, **owning group**, and **other**.

The umask for Azure Data Lake Storage Gen1 is a constant value set to 007. This value translates to

| umask component     | Numeric form | Short form | Meaning |
|---------------------|--------------|------------|---------|
| umask.owning_user   |    0         |   `---`      | For owning user, copy the parent's Default ACL to the child's Access ACL | 
| umask.owning_group  |    0         |   `---`      | For owning group, copy the parent's Default ACL to the child's Access ACL | 
| umask.other         |    7         |   `RWX`      | For other, remove all permissions on the child's Access ACL |

The umask value used by Azure Data Lake Storage Gen1 effectively means that the value for other is never transmitted by default on new children - regardless of what the Default ACL indicates. 

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

## Common questions about ACLs in Data Lake Storage Gen1

### Do I have to enable support for ACLs?

No. Access control via ACLs is always on for a Data Lake Storage Gen1 account.

### Which permissions are required to recursively delete a folder and its contents?

* The parent folder must have **Write + Execute** permissions.
* The folder to be deleted, and every folder within it, requires **Read + Write + Execute** permissions.

> [!NOTE]
> You do not need Write permissions to delete files in folders. Also, the root folder "/" can **never** be deleted.
>
>

### Who is the owner of a file or folder?

The creator of a file or folder becomes the owner.

### Which group is set as the owning group of a file or folder at creation?

The owning group is copied from the owning group of the parent folder under which the new file or folder is created.

### I am the owning user of a file but I don’t have the RWX permissions I need. What do I do?

The owning user can change the permissions of the file to give themselves any RWX permissions they need.

### When I look at ACLs in the Azure portal I see user names but through APIs, I see GUIDs, why is that?

Entries in the ACLs are stored as GUIDs that correspond to users in Microsoft Entra ID. The APIs return the GUIDs as is. The Azure portal tries to make ACLs easier to use by translating the GUIDs into friendly names when possible.

### Why do I sometimes see GUIDs in the ACLs when I'm using the Azure portal?

A GUID is shown when the user doesn't exist in Microsoft Entra anymore. Usually this happens when the user has left the company or if their account has been deleted in Microsoft Entra ID. Also, ensure that you're using the right ID for setting ACLs (details in question below).

### When using service principal, what ID should I use to set ACLs?

On the Azure Portal, go to **Microsoft Entra ID -> Enterprise applications** and select your application. The **Overview** tab should display an Object ID and this is what should be used when adding ACLs for data access (and not Application Id).

### Does Data Lake Storage Gen1 support inheritance of ACLs?

No, but Default ACLs can be used to set ACLs for child files and folder newly created under the parent folder.

### What are the limits for ACL entries on files and folders?

32 ACLs can be set per file and per directory. Access and default ACLs each have their own 32 ACL entry limit. Use security groups for ACL assignments if possible. By using groups, you're less likely to exceed the maximum number of ACL entries per file or directory.

### Where can I learn more about POSIX access control model?

* [POSIX Access Control Lists on Linux](https://www.linux.com/news/posix-acls-linux)
* [HDFS permission guide](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/HdfsPermissionsGuide.html)
* [POSIX FAQ](https://www.opengroup.org/austin/papers/posix_faq.html)
* [POSIX 1003.1 2008](https://standards.ieee.org/wp-content/uploads/import/documents/interpretations/1003.1-2008_interp.pdf)
* [POSIX 1003.1 2013](https://pubs.opengroup.org/onlinepubs/9699919799.2013edition/)
* [POSIX 1003.1 2016](https://pubs.opengroup.org/onlinepubs/9699919799.2016edition/)
* [POSIX ACL on Ubuntu](https://help.ubuntu.com/community/FilePermissionsACLs)
* [ACL using access control lists on Linux](https://bencane.com/2012/05/27/acl-using-access-control-lists-on-linux/)

## See also

* [Overview of Azure Data Lake Storage Gen1](data-lake-store-overview.md)
