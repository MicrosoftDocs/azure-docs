---
title: Azure CycleCloud Role-Based Access Control | Microsoft Docs
description: Access control and custom roles for Azure CycleCloud.
author: KimliW
ms.date: 08/01/2018
ms.author: adjohnso
---

# Create Custom Roles

## Role Based Access Control

Users can be assigned roles to control the level of access they have. A user can be assigned multiple roles for greater flexibility. To modify a user's roles, access the user list through the **User Management** page. Select the desired user and click **Edit**.

The default roles are:

| Role               | Permission                                                                  |
| ------------------ | --------------------------------------------------------------------------- |
| Administrator      | Permission to view and change nearly all data.                              |
| Auditor            | Read-only access to all data.                                               |
| Cluster Admin      | Permission to manage all clusters and configure cluster-related options.    |
| Cluster Creator    | Permission to create new clusters.                                          |
| cyclecloud_access  | Specific access control for the Azure CycleCloud application.               |
| Data Admin         | Permission to manage all data endpoints and configure data-related options. |
| Job Admin          | Permission to manage all jobs and configure job-related options.            |
| User               | Normal users with GUI access and permission to manage owner resources.      |

These default roles are read-only and cannot be changed. You can, however, create new roles with custom permissions to allow users to perform functions outside the predefined role.

## Creating Custom Roles

Every user in the system is assigned one or more **roles** for authorization control. These roles consist of a set of **permissions** specifying what the user can do and cannot do, with each permission being a list of discrete **operations** that the server can perform, grouped for convenience. Operations are very granular, to support precise authorization rules. For example, starting, stopping, and rebooting a virtual machine are separate operations. It is possible to create a permission that only allows the rebooting a machine.

Within the **User Management** page, click on the **Roles** tab. Click **Create** to add a new role. Give the new role a name and description, then select the site-wide permissions for the new role. If the Role is related to a Group, check the **Group Role** box to enable the role within the Groups page. You can also specify permissions on a resource level, should the need arise.

> [!NOTE]
>The predefined roles within CycleCloud provide appropriate access for the majority of users. You may not need to create custom roles at all.

## Sharing Resources

Resources can be shared directly with a user or a group. They can also be shared with multiple users/groups, with each user/group having separate associated permissions.

> [!NOTE]
> The sharing of resources is currently limited to a superuser.

To share a resource, click on the **Clusters** tab within CycleCloud. Select the resource to
share from the list on the left. In the main window, click **Share**:

![Share Resource screen](~/images/share.png)

**Change Resource Owner**: Select a new owner from the dropdown menu and click **Save**. The user will
now have access to manage the resource.

**Share Resource**: Click **Add User**. From the dropdown menu, select the user you wish to share
the resource with. Select the appropriate Permissions for the user, and click **Save**. Repeat as
needed to share the resource with additional users.

**Edit Shared Resource**: Click **Share** to see the current owner and list of users with access
to the resource. To modify or delete a user's access, click their name in the Share Cluster window.
Make the required changes and click **Save**, or click **Delete** to remove the user's access from
the selected resource.
