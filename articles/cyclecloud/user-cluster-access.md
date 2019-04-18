---
title: Azure CycleCloud Cluster User Management | Microsoft Docs
description: Manage user login access to cluster nodes
author: jermth
ms.date: 04/15/2019
ms.author: jechia
---

# Cluster User Management

There are primarily two mechanisms for enabling login access to cluster nodes -- through the CycleCloud built-in user management feature, or integrating the nodes with a third-party directory service such as Active Directory or an LDAP server.

## The VM Agent User

Every Azure VM started and managed through CycleCloud has an admin user that is created by the [VM agent](https://docs.microsoft.com/en-us/azure/virtual-machines/extensions/agent-linux)). This user's username is `cyclecloud` and the SSH private key for this user can be found at __/opt/cycle_server/.ssh/cyclecloud.pem__ in the CycleCloud application server. This key is generated during the installation process and is unique to each site.

This user account exists locally on each VM and should be treated as a service user with admin access. However, this user account may come in useful for troubleshooting purposes.

To connect to a cluster node with this user:

    $ ssh -i /opt/cycle_server/.ssh/cyclecloud.pem cyclecloud@${NODE-IP-Address}

## Built-In User Management

CycleCloud comes with a built-in user management system that creates local user accounts on every VM as part of the boot-up phase of each cluster node. These local user accounts are created for the cluster owner, cluster admins, and any CycleCloud user account that was provided access via the cluster share feature [CycleCloud User Management](user-management.md). Additionally, the cluster owner and cluster admins are added to the local unix group `cyclecloud-admin` and users in this group have `sudoer` privileges on each VM of the cluster.

User authentication is SSH-key based. The public key for each user with login access is obtained from the corresponding user record in CycleCloud and staged into each VM. If the user record does not contain a public key, the local user account is still created but the user will not be able to login until a key is staged manually.

For clusters with an NFS server, the home directory for each user is available on the NAS with the base home directory __/shared/home__. For clusters without an NFS server, the base home directory is __/home__ and that is local to each VM of the cluster.

New users can be added to a running cluster through the share menu on the cluster page in the CycleCloud UI. It takes a couple of minutes for these new user accounts to propagate across the cluster nodes.

[TODO: add screenshot]

### Revoking Access

Simply remove users from the cluster share list to revoke access to a cluster. These user accounts are not deleted on each cluster node; instead the login shell for these revoked user accounts is changed to __/sbin/nologin__.

## Disabling the Built-In User Management System

The built-in user management system is enabled by default on every CycleCloud installation and is an installation-wide setting -- all clusters managed by the CycleCloud server will have this enabled. To disable, navigate to the **CycleCloud** section of the **Settings** page. The pop-up box contains an option for **Node Authentication** and selecting **Disabled"** from the drop down will ensure that no local user accounts aside from the VM agent user will be created.

## Third-Party User Management Systems

For enterprise production clusters, it is recommended that user access be managed through a directory service such as LDAP, Active Directory, or NIS. This integration can be implemented by configuring PAM and NSS in the VM images used on each node, or creating CycleCloud project specs that are executed during the software installation phase of each node. 

The [Azure Active Directory Domain Service](https://azure.microsoft.com/en-us/services/active-directory-ds/) provides a managed service for Active Directory servers, and instructions for joining a Linux domain can be found [here](https://docs.microsoft.com/en-us/azure/active-directory-domain-services/active-directory-ds-join-rhel-linux-vm).

