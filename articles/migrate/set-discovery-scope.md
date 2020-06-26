---
title: Set the scope for VMware VM discovery with Azure Migrate
description: Describes how to set the discovery scope for VMware VM assessment and migration with Azure Migrate.
ms.topic: how-to
ms.date: 06/09/2020

---

# Set discovery scope for VMware VMs

This article describes how to limit the scope of VMware VMs that you discover when you're:

- Discovering VMs with the [Azure Migrate appliance](migrate-appliance-architecture.md) when you're using the Azure Migrate:Server Assessment tool.
- Discovering VMs with the [Azure Migrate appliance](migrate-appliance-architecture.md) when you're using the Azure Migrate:Server Migration tool, for agentless migration of VMware VMs to Azure.

When you set up the appliance, it connects to vCenter Server and starts discovery. Before you connect the appliance to vCenter Server, you can limit discovery to vCenter Server datacenters, clusters, a folder of clusters, hosts, a folder of hosts, or individual VMs. To set the scope, you assign permissions on the account that the appliance uses to access the vCenter Server.

## Before you start

If you haven't set up a vCenter user account that Azure Migrate uses for discovery, do that now for [assessment](tutorial-prepare-vmware.md#set-up-permissions-for-assessment) or [agentless migration](tutorial-prepare-vmware.md#assign-permissions-to-an-account).


## Assign permissions and roles

You can assign permissions on VMware inventory objects using one of two methods:

- On the account used by the appliance, assign a role with the required permissions on the objects you want to scope.
- Alternatively, assign a role to the account at the datacenter level, and propagate to the child objects. Then give the account a **No access** role, for every object that you don't want in scope. We don't recommend this approach since it's cumbersome, and might expose access controls, because every new child object is automatically granted access inherited from the parent.

You can't scope inventory discovery at the vCenter VM folder level. If you need to scope discover to VMs in a VM folder, create a user and grant access individually to each required VM. Host and cluster folders are supported.


### Assign a role for assessment

1. On the appliance vCenter account you're using for discovery, apply the **Read-only** role for all parent objects that host VMs you want to discover and assess (host, cluster, hosts folder, clusters folder, up to datacenter).
2. Propagate these permissions  to child objects in the hierarchy.

    ![Assign permissions](./media/tutorial-assess-vmware/assign-perms.png)

### Assign a role for agentless migration

1. On the appliance vCenter account you're using for migration, apply a user-defined role that has the [permissions needed](migrate-support-matrix-vmware-migration.md#vmware-requirements-agentless), to all parent objects that host VMs you want to discover and migrate.
2. You can name the role with something that's easier to identify. For example, <em>Azure_Migrate</em>.

## Work around VM folder restriction

Currently, the Server Assessment tool can't discover VMs if access is granted at the vCenter VM folder level. If you do want to scope your discovery and assessment by VM folders, use this workaround.

1. Assign read-only permissions on all VMs located in the VM folders you want to scope for discovery and assessment.
2. Grant read-only access to all the parent objects that host the VMs host, cluster, hosts folder, clusters folder, up to datacenter). You don't need to propagate the permissions to all child objects.
3. To use the credentials for discovery, select the datacenter as **Collection Scope**.


The role-based access control setup ensures that the corresponding vCenter user account has access to only tenant-specific VMs.


## Next steps

[Set up the appliance](how-to-set-up-appliance-vmware.md), and [start continuous discovery](how-to-set-up-appliance-vmware.md#start-continuous-discovery-by-providing-vcenter-server-and-vm-credential).
