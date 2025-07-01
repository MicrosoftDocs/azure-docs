---
title: Cluster User Management
description: Learn how to manage user access to cluster nodes in Azure CycleCloud. Enable sign-in access to cluster nodes through CycleCloud or a third-party user management system.
author: jermth
ms.date: 07/01/2025
ms.author: jechia
ms.topic: how-to
ms.service: azure-cyclecloud
ms.custom: compute-evergreen
---

# Cluster user management

You can enable authentication for cluster nodes in two ways: use CycleCloud's built-in authentication or integrate nodes with a directory service such as Active Directory or LDAP.

## The VM Agent User

Every Azure VM that CycleCloud starts and manages has an admin user named `cyclecloud`. The [VM agent](/azure/virtual-machines/extensions/agent-linux) creates this user. You can find the SSH private key for the `cyclecloud` user at */opt/cycle_server/.ssh/cyclecloud.pem* on the CycleCloud application server. This key is unique to each installation and is generated during the installation process.

The `cyclecloud` user exists locally on each VM. Treat it as a service user with admin access, but you might find it helpful for troubleshooting.

To connect to a node as `cyclecloud`, run the following command:

```bash
ssh -i /opt/cycle_server/.ssh/cyclecloud.pem cyclecloud@${NODE-IP-Address}
```

Alternatively, you can use the CycleCloud CLI:

```bash
cp /opt/cycle_server/.ssh/cyclecloud.pem ~/.ssh 
cyclecloud connect [node] -c [cluster] -u cyclecloud
```

## Built-in user management

CycleCloud includes a built-in user management system that creates local user accounts on every VM. The system creates these local user accounts for each user with authentication permissions to the cluster. Additionally, users with the node admin permission have administrator (sudo) privileges for each VM in the cluster. You can grant these permissions through ownership of the cluster, by explicitly sharing permissions to the cluster, or by assigning users to a role that grants global authentication access. For more information about assigning roles to users, see [CycleCloud User Management](~/articles/cyclecloud/concepts/user-management.md).

You can see the list of users with authentication access to nodes on the cluster page under **Users**. Selecting the **show** link opens a dialog with more information.

![Cluster Users Dialog](~/articles/cyclecloud/images/cluster-users-dialog.png)

This dialog shows each user and the status of user management on each node in the cluster. It displays any errors or warnings when configuring users, such as a UID conflict or a disallowed user name. Because the `jetpackd` daemon manages users on each node, you can make changes to running clusters.

### Sign in to nodes

User authentication uses SSH keys. Each user's public key comes from CycleCloud and is set up on each VM. If a user doesn't have a public key, the local user account is still created but the user can't sign in until a key is manually added.

For clusters with an NFS server, each user's home directory is on the NAS under the base directory `/shared/home`. For clusters without an NFS server, the base home directory is `/home` and it's local to each VM in the cluster.

### Revoking access

If you grant a user authentication access through a shared permission, remove that shared permission by using the **Access** link on the cluster page. If a user has the **Global Node Admin** or **Global Node User** role, an administrator must remove those roles on the **Settings** page users tab.

> [!NOTE]
> You don't delete user accounts on running nodes. Instead, you change the authentication shell for these revoked user accounts to */sbin/nologin*. This change denies further authentication access without destroying any of the user's data.

## Disable the built-in user management system

Every CycleCloud installation enables the built-in user management system by default. This setting applies to the entire installation. All clusters that the CycleCloud server manages have this setting enabled. To disable it, go to the **CycleCloud** section of the **Settings** page. The pop-up box has an option for **Node Authentication**. Select **Disabled** from the drop down to make sure the system doesn't create any local user accounts aside from the VM agent user.

![Disable Node Authentication](~/articles/cyclecloud/images/node-auth-disabled.png)

## Third-party user management systems

For enterprise production clusters, we recommend managing user access through a directory service such as LDAP, Active Directory, or NIS. You can implement this integration by configuring PAM and NSS in the VM images used on each node, or by creating CycleCloud projects that run during the software installation phase for each node.

The [Azure Active Directory Domain Service](/azure/active-directory-domain-services/) provides a managed service for Active Directory servers. You can find instructions for joining a Linux domain [here](/azure/active-directory-domain-services/active-directory-ds-join-rhel-linux-vm).
