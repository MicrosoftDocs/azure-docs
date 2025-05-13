---
title: User Management
description: Learn about user management in Azure CycleCloud. Add new users, edit users, assign user roles, manage groups of users, and more.
author: jermth
ms.date: 04/15/2019
ms.author: jechia
---

# User management

CycleCloud can manage two types of users: CycleCloud users and cluster users. CycleCloud users exist on CycleCloud's application server and grant access to the web interface, command line, and various APIs. Cluster users exist on the operating system of each node that CycleCloud manages. By default, CycleCloud's built-in node authentication keeps these users in sync. However, you can disable this feature to administer cluster users separately.

For more information on managing cluster users, see [Cluster user access](~/articles/cyclecloud/how-to/user-access.md).

## Add new users to CycleCloud

Access the user management page in CycleCloud through the **Settings** link on the sidebar. The **Users** tab displays a list of all users. Select **Create** to add a new user.

![Create User Dialog](~/articles/cyclecloud/images/create-user-dialog.png)

A dialog appears for adding a new user account. Select the **Password Reset** box to force the user to change their password on first sign in.

The **Superuser** checkbox grants the user access to all the data and Azure account information that CycleCloud stores, but it doesn't grant sign-in access to any nodes.

Select the appropriate roles to assign privileges to the user. The [Roles](#user-roles) section lists the privileges for each of the built-in roles.

The **Node Settings** section contains settings for providing sign-in access to nodes. To allow CycleCloud to create and manage this user on nodes, select **Enable node access for this user** and optionally supply the SSH public key that corresponds to the private key that the user uses to connect. Enabling node access doesn't grant sign-in access to nodes. It simply indicates that CycleCloud should create and manage the user when sign-in access is granted. For more information, see the [Cluster User Management](~/articles/cyclecloud/how-to/user-access.md) page.

## Edit User

Select **Edit** on the user management page to modify roles and user properties. You can also set the Unix **UID** for the user's local account on the cluster nodes. By default, CycleCloud reserves UIDs 20000 and higher for node users. Changing the UID doesn't affect running nodes or change any existing file permissions on persistent storage. For more information, see [Cluster User Management](~/articles/cyclecloud/how-to/user-access.md).

## User roles

Each user can be assigned to one or more of the following roles that are built-in to the CycleCloud application server:

| Role              | Privileges |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------|
| User              | Sign in to the CycleCloud web interface, view, and manage own clusters. Doesn't grant permission to create new clusters.   |
| Cluster Creator   | Grant all of the permissions of the `User` role, plus the ability to create new clusters.                           |
| Administrator     | Create and edit all clusters and manage CycleCloud application settings.                                                  |
| Global Node User  | Sign in to every node managed by this CycleCloud installation.                                                     |
| Global Node Admin | Sign in with administrator privileges (sudo access) to every node managed by this CycleCloud installation.         |


> [!NOTE]
> The preceding **Superuser** checkbox supersedes all roles assigned to a user (except that it doesn't grant sign-in access to nodes). All `Superusers` are `Administrators` with extra privileges to view and edit all data in the system.

## Groups

The **Settings** page also includes a tab for managing groups of users. Groups allow administrators to assign node sign-in access and cluster permissions to more than one user at once.

Select **Create** to create a new group. Select **Add User** to add users to the group. The **Add User** dialog box includes checkboxes for assigning the `Group Administrator` and `Group User` roles to assign cluster permissions. `Group Administrators` have permissions to view and manage all clusters assigned to the group, while `Group Users` have read-only access to the group's clusters.

Assign the `Group Node Admin` or `Group Node User` roles to grant sign-in access to each user in a group. `Group Node Admins` have sign-in and administrator access to every node in each of the group's clusters, while `Group Node Users` have sign-in access but no administrator access.

## Cluster access, ownership, and sharing

When you view a cluster, select the **Access** button to see a list of every user with permissions to the cluster.

![Cluster Access Dialog](~/articles/cyclecloud/images/cluster-access-dialog.png)

This dialog shows a comprehensive list of every CycleCloud user with access to the cluster. By default, the owner is the user who created the cluster. The owner has full permission to manage and sign in to all nodes with administrator (sudo) privileges. Shared permissions grant explicit access to only the current cluster. You can modify shared permissions by selecting each row. To share permissions with a new user, use the **Add User** button at the bottom of the list and select the permissions to share.

For more information about managing cluster node access, see [Cluster user management](~/articles/cyclecloud/how-to/user-access.md).

## User authentication

User authentication is provided by either the built-in authentication system or by integrating with a third-party authentication service. For more information, see [User authentication](~/articles/cyclecloud/how-to/user-authentication.md).
