---
title: Set the scope for VMware VM discovery with Azure Migrate
description: Describes how to set the discovery scope for VMware VM assessment and migration with Azure Migrate.
ms.topic: how-to
ms.date: 03/23/2020

---

# Set discovery scope for VMware VMs

This article describes how to limit the scope of discovery for VMware VMs that are discovered by the [Azure Migrate appliance](migrate-appliance-architecture.md).

The Azure Migrate appliance discovers on-premises VMware VMs when you: 

- Use the [Azure Migrate:Server Assessment](migrate-services-overview.md#azure-migrate-server-assessment-tool) tool to assess VMware VMs for migration to Azure.
- Use the [Azure Migrate:Server Migration](migrate-services-overview.md#azure-migrate-server-migration-tool) tool for [agentless migration](server-migrate-overview.md) of VMware VMs to Azure.

## Set discovery scope


After you set up the Azure Migrate appliance for VMware VMs assessment or migration, the appliance starts discovering VMs, and sending VM metadata to Azure. Before you connect the appliance to vCenter Server for discovery, you can set the discovery scope to limit discovery to  vCenter Server datacenters, clusters, a folder of clusters, hosts, a folder of hosts, or individual VMs.

To set the scope, you assign permissions on the account that Azure Migrate is using to access the vCenter Server.

## Create a vCenter user account

If you haven't already set up a vCenter user account that the Azure Migrate appliance uses to discover, assess, and migrate VMware VMs, do that first.

1.    Log in to vSphere Web Client as the vCenter Server administrator.
2.    Select **Administration** > **SSO users and Groups**, and click the **Users** tab.
3.    Select the **New User** icon.
4.    Fill in the new user information > **OK**.

The account permissions depend on what you're deploying.

**Feature** | **Account permissions**
--- | ---
[Assess](tutorial-assess-vmware.md)| The account needs read-only access.
[Discover apps/roles/features](how-to-discover-applications.md) | The account needs read-only access, with privileges enabled for Virtual machines > Guest Operations.
[Analyze dependencies (agentless)](how-to-create-group-machine-dependencies-agentless.md) | The account needs read-only access, with privileges enabled for Virtual machines > Guest Operations.
[Migrate (agentless)](tutorial-migrate-vmware.md) | You need a role that's assigned the right permissions.<br/><br/> To create a role, log in to vSphere Web Client as the vCenter Server administrator. Select the vCenter Server instance >  **Create role**. Specify a role name, for example <em>Azure_Migrate</em>, and assign the [required permissions](migrate-support-matrix-vmware-migration.md#agentless-vmware-servers) to the role.


## Assign permissions on vCenter objects

You can assign permissions on inventory objects using one of two methods:

- Assign a role with the required permissions, to the account you're using, for all parent objects that host VMs you want to discover/migrate.
- Alternatively, you can assign the role and user account at the datacenter level, and propagate them to the child objects. Then give the account a **No access** role, for every object that you don't want to discover/migrate. We don't recommend this approach since it's cumbersome, and might expose access controls, because every new child object is automatically granted access inherited from the parent.

To assign a role to the account you're using for all relevant objects, do the following:

- **For assessment**: For VM assessment, apply the **Read-only** role to the vCenter user account for all parent objects hosting VMs you want to discover. Parent objects included: host, folder of hosts, cluster, and folder of clusters in the hierarchy, up to the datacenter. Propagate these permissions  to child objects in the hierarchy.

    ![Assign permissions](./media/tutorial-assess-vmware/assign-perms.png)

- **For agentless migration**: For agentless migration, apply a user-defined role with [required permissions](migrate-support-matrix-vmware-migration.md#agentless-vmware-servers) to the user account, for all parent objects hosting VMs you want to discover. You can name the role <em>Azure_Migrate</em>.

### Scope support

Currently, the Server Assessment tool can't discover VMs if the vCenter account has access granted at the vCenter VM folder level. Folders of hosts and clusters are supported.

If you want to scope your discovery by VM folders, complete the next procedure to ensure that the vCenter account has read-only access assigned at a VM level.

1. Assign read-only permissions on all VMs in the VM folders you want to scope for discovery.
2. Grant read-only access to all the parent objects that host VMs.
    - All parent objects (host, folder of hosts, cluster, folder of clusters) in the hierarchy up to the datacenter are included.
    - You don't need to propagate the permissions to all child objects.
3. Use the credentials for discovery by selecting the datacenter as **Collection Scope**. The role-based access control setup ensures that the corresponding vCenter user account has access to only tenant-specific VMs.


## Next steps

[Set up the appliance](how-to-set-up-appliance-vmware.md) and [start continuous discovery](how-to-set-up-appliance-vmware.md#start-continuous-discovery-by-providing-vcenter-server-and-vm-credential).
