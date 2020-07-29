---
title: User Management
description: Learn about user management in Azure CycleCloud. Add new users, edit users, assign user roles, manage groups of users, and more.
author: jermth
ms.date: 04/15/2019
ms.author: jechia
---

# User Management

CycleCloud may be used to manage two separate but related types of user: CycleCloud users and cluster users. CycleCloud users exist on CycleCloud's application server and grant access to the web interface, command line and various APIs. Cluster users exist on the operating system of each node managed by CycleCloud. By default, these users are kept in sync by CycleCloud's built-in node authentication. However, this may be disabled in order to administer cluster users separately.

For more information on managing cluster users, please refer to [Cluster User Access](~/how-to/user-access.md).

## Adding New Users to CycleCloud

The user management page in CycleCloud can be accessed through the **Settings** link on the sidebar.  The **Users** tab will display a list of all users. Click on the **Create** button to add a new user.

![Create User Dialog](~/images/create_user_dialog.png)

A dialog will appear for adding a new user account. Select the **Password Reset** box to force the user to change their password on first login.

The **Superuser** checkbox grants the user access to all the data and Azure account information that is stored in CycleCloud, but does not grant log in access to any nodes.

Select the appropriate roles to assign privileges to the user. The [Roles](#user-roles) section below lists the privileges for each of the built-in roles.

The **Node Settings** section contains settings for providing login access to nodes. To allow CycleCloud to create and manage this user on nodes, select **Enable node access for this user** and optionally supply the SSH public key that corresponds to the private key that the user will use to connect. Enabling node access will not grant login access to nodes, it simply indicates that CycleCloud should create and manage the user when login access is granted. See the [Cluster User Management](~/how-to/user-access.md) page for more information.

## Edit User

The **Edit** button on the user management page allows an administrator to modify roles and user properties. The administrator can also set the Unix **UID** for the user's local account on the cluster nodes. By default, CycleCloud will reserve UIDs 20000 and above for node users. Note that changing the UID here will not affect running nodes or change any existing file permissions on persistent storage. See [Cluster User Management](~/how-to/user-access.md) for details.

## User Roles

Each user can be assigned to one or more of the following roles that are built-in to the CycleCloud application server:

| Role              | Privileges |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------|
| User              | Log in to the CycleCloud web interface, view and manage own clusters. Does not grant permission to create new clusters.   |
| Cluster Creator   | Grant all of the permissions of the `User` role, plus the ability to create new clusters.                           |
| Administrator     | Create and edit all clusters and manage CycleCloud application settings.                                                  |
| Global Node User  | Log in to every node managed by this CycleCloud installation.                                                     |
| Global Node Admin | Log in with administrator privileges (sudo access) to every node managed by this CycleCloud installation.         |


> [!NOTE]
> The **Superuser** checkbox described above supersedes all roles assigned to a user (except that it does not grant login access to nodes). All `Superusers` are `Administrators` with additional privileges to view and edit all data in the system.

## Groups

The **Settings** page also includes a tab for managing groups of users. Groups allow administrators to assign node login access and cluster permissions to more than one user at once.

Create a new group using the **Create** button. Use the **Add User** button to add users to the group. The **Add User** dialog box includes checkboxes for assigning the `Group Administrator` and `Group User` roles to assign cluster permissions. `Group Administrators` have permissions to view and manage all clusters assigned to the group, while `Group Users` have read-only access to the group's clusters.

Each user in a group may also be assigned the `Group Node Admin` or `Group Node User` roles to grant login access. `Group Node Admins` have login and administrator access to every node in each of the group's clusters, while `Group Node Users` have login access but no administrator access.

## Cluster Access, Ownership, and Sharing

While viewing a cluster, select the **Access** button to see a list of every user with permissions to the cluster.

![Cluster Access Dialog](~/images/cluster_access_dialog.png)

This dialog shows a comprehensive list of every CycleCloud user with access to the cluster. By default, the owner is the user who created the cluster and has full permission to manage and log in to all nodes with administrator (sudo) privileges. Shared permissions grant explicit access to only the current cluster and may be modified by selecting each row. To share permissions with a new user, use the **Add User** button at the bottom of the list and select the permissions to share.

See [Cluster User Management](~/how-to/user-access.md) for more information about managing cluster node access.

## User Authentication

User authentication is provided by either the built-in authentication system or by integrating with a third-party authentication service. [See User Authentication](~/how-to/user-authentication.md) for more information.
