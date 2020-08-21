---
title: Cluster User Management
description: Laern how to manage user access to cluster nodes in Azure CycleCloud. Enable sign-in access to cluster nodes through CycleCloud or a third-party user management system.
author: jermth
ms.date: 04/15/2019
ms.author: jechia
---

# Cluster User Management

There are primarily two mechanisms for enabling login access to cluster nodes -- through CycleCloud's built-in authentication, or by integrating nodes with a directory service such as Active Directory or LDAP.

## The VM Agent User

Every Azure VM started and managed through CycleCloud has an admin user named `cyclecloud` that is created by the [VM agent](https://docs.microsoft.com/azure/virtual-machines/extensions/agent-linux). The SSH private key for this user can be found at */opt/cycle_server/.ssh/cyclecloud.pem* in the CycleCloud application server. This key is generated during the install process and is unique to each installation.

This user exists locally on each VM and should be treated as a service user with admin access. However, this user account may be useful for troubleshooting purposes.

To connect to a node as `cyclecloud`, run the following command:

```bash
ssh -i /opt/cycle_server/.ssh/cyclecloud.pem cyclecloud@${NODE-IP-Address}
```

Alternatively, using the CycleCloud CLI:

```bash
cp /opt/cycle_server/.ssh/cyclecloud.pem ~/.ssh 
cyclecloud connect [node] -c [cluster] -u cyclecloud
```

## Built-In User Management

CycleCloud comes with a built-in user management system that creates local user accounts on every VM. These local user accounts are created for each user with login permissions to the cluster. Additionally, users with the node admin permission will have administrator (sudo) privileges for each VM in the cluster. These permissions may be granted through ownership of the cluster, by explicitly sharing permissions to the cluster, or by assigning users to a role which grants global login access. See [CycleCloud User Management](~/concepts/user-management.md) for more information on assigning roles to users.

The list of users with login access to nodes is visible on the cluster page under **Users**. Selecting the **show** link will open a dialog with more information.

![Cluster Users Dialog](~/images/cluster_users_dialog.png)

This dialog shows each individual user as well as the status of user management on each individual node in the cluster. Any errors or warnings when configuring users (such as a UID conflict or a disallowed user name) will be displayed here. Since users are managed via the `jetpackd` daemon on each node, it is possible to make changes to running clusters.

### Logging in to Nodes

User authentication is SSH-key based. The public key for each user with login access is obtained from the corresponding user in CycleCloud and staged into each VM. If the user does not have a public key, the local user account is still created but the user will not be able to log in until a key is manually staged.

For clusters with an NFS server, the home directory for each user is available on the NAS with the base home directory */shared/home*. For clusters without an NFS server, the base home directory is */home* and that is local to each VM of the cluster.

### Revoking Access

If the user was granted login access via a shared permission, simply remove those shared permissions using the **Access** link on the cluster page. If the user has the "Global Node Admin" or "Global Node User" role, an administrator must remove those roles on the users tab of the **Settings** page. 

> [!NOTE]
> User accounts are not deleted on running nodes. Instead, the login shell for these revoked user accounts is changed to */sbin/nologin*. This denies further login access without destroying any of the user's data.

## Disabling the Built-In User Management System

The built-in user management system is enabled by default on every CycleCloud installation and is an installation-wide setting -- all clusters managed by the CycleCloud server will have this enabled. To disable, navigate to the **CycleCloud** section of the **Settings** page. The pop-up box contains an option for **Node Authentication** and selecting **Disabled** from the drop down will ensure that no local user accounts aside from the VM agent user will be created.

![Disable Node Authentication](~/images/node_auth_disabled.png)

## Third-Party User Management Systems

For enterprise production clusters, it is recommended that user access be managed through a directory service such as LDAP, Active Directory, or NIS. This integration can be implemented by configuring PAM and NSS in the VM images used on each node, or creating CycleCloud projects that are executed during the software installation phase of each node.

The [Azure Active Directory Domain Service](https://azure.microsoft.com/services/active-directory-ds/) provides a managed service for Active Directory servers, and instructions for joining a Linux domain can be found [here](https://docs.microsoft.com/azure/active-directory-domain-services/active-directory-ds-join-rhel-linux-vm).
