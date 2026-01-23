---
title: VMware VM Multitenant Disaster Recovery with Azure Site Recovery
ms.reviewer: v-gajeronika
description: Provides an overview of Azure Site Recovery support for VMware disaster recovery to Azure in a multitenant environment Cloud Solution Provider program.
author: Jeronika-MS
ms.service: azure-site-recovery
ms.topic: how-to
ms.date: 11/17/2025
ms.author: v-gajeronika

# Customer intent: "As a cloud service provider, I want to implement multitenant disaster recovery for VMware VMs to Azure so that I can ensure tenant isolation and efficient resource management while providing reliable failover and failback support."
---
# Overview of multitenant support for VMware disaster recovery to Azure with CSP

[Azure Site Recovery](site-recovery-overview.md) supports multitenant environments for tenant subscriptions. It also supports multitenancy for tenant subscriptions that are created and managed through the Microsoft Cloud Solution Provider (CSP) program.

This article provides an overview of implementing and managing multitenant VMware to Azure replication.

## Multitenant environments

There are three major multitenant models:

* **Shared Hosting Services Provider (HSP)**: The partner owns the physical infrastructure and uses shared resources (such as vCenter, datacenters, and physical storage) to host multiple tenant virtual machines (VMs) on the same infrastructure. The partner can provide disaster-recovery management as a managed service, or the tenant can own disaster recovery as a self-service solution.
* **Dedicated Hosting Services Provider**: The partner owns the physical infrastructure but uses dedicated resources (such as multiple vCenters and physical datastores) to host each tenant's VMs on a separate infrastructure. The partner can provide disaster-recovery management as a managed service, or the tenant can own it as a self-service solution.
* **Managed Services Provider (MSP)**: The customer owns the physical infrastructure that hosts the VMs, and the partner provides disaster-recovery enablement and management.

## Shared-hosting scenario

The other two scenarios are subsets of the shared-hosting scenario, and they use the same principles. The differences are described at the end of the shared-hosting guidance.

The basic requirement in a multitenant scenario is that tenants must be isolated. One tenant shouldn't be able to observe what another tenant hosts. In a partner-managed environment, this requirement isn't as important as it is in a self-service environment, where it can be critical. This article assumes that tenant isolation is required.

The architecture is shown in the following diagram.

:::image type="content" source="./media/vmware-azure-multi-tenant-overview/shared-hosting-scenario.png" alt-text="Screenshot that shows a shared HSP with one vCenter.":::

### Shared-hosting with one vCenter server

In the diagram, each customer has a separate management server. This configuration limits tenant access to tenant-specific VMs and enables tenant isolation. VMware VM replication uses the configuration server to discover VMs and install agents. The same principles apply to multitenant environments, with the addition of restricting VM discovery by using vCenter access control.

The data isolation requirement means that all sensitive infrastructure information (such as access credentials) remains undisclosed to tenants. For this reason, we recommend that all components of the management server remain under the exclusive control of the partner. The management server components are:

* Configuration server
* Process server
* Master target server

A separate scaled-out process server is also under the partner's control.

## Configuration server accounts

Every configuration server in the multitenant scenario uses two accounts:

- **vCenter access account**: This account is used to discover tenant VMs. It has vCenter access permissions assigned to it. To help avoid access leaks, we recommend that partners enter these credentials themselves in the configuration tool.
- **Virtual machine access account**: This account is used to install the Mobility service agent on tenant VMs with an automatic push. It's usually a domain account that a tenant might provide to a partner or an account that the partner might manage directly. If a tenant doesn't want to share the details with the partner directly, they can enter the credentials through limited-time access to the configuration server. Or with the partner's assistance, they can install the Mobility service agent manually.

## vCenter account requirements

Configure the configuration server with an account that has a special role assigned to it.

- The role assignment must be applied to the vCenter access account for each vCenter object and not propagated to the child objects. This configuration ensures tenant isolation because access propagation can result in accidental access to other objects.

    :::image type="content" source="./media/vmware-azure-multi-tenant-overview/assign-permissions-without-propagation.png" alt-text="Screenshot that shows the Propagate to Child Objects option.":::

- The alternative approach is to assign the user account and role at the datacenter object and propagate them to the child objects. Then give the account a No access role for every object (such as VMs that belong to other tenants) that should be inaccessible to a particular tenant.

   This configuration is cumbersome. It exposes accidental access controls because every new child object is also automatically granted access that's inherited from the parent. We recommend that you use the first approach.

### Create a vCenter account

1. Create a new role by cloning the predefined read-only role, and then give it a convenient name. This example uses Azure_Site_Recovery.
1. Assign the following permissions to this role:

   * **Datastore**: Select **Allocate space**, **Browse datastore**, **Low-level file operations**, **Remove file**, and **Update virtual machine files**.
   * **Network**: Select **Network assign**.
   * **Resource**: Select **Assign virtual machine to resource pool**, **Migrate powered off virtual machine**, and **Migrate powered on virtual machine**.
   * **Tasks**: Select **Create task** and **Update task**.
   * **Virtual machine** > **Configuration**: Select **All**.
   * **Virtual machine** > **Interaction**: Select **Answer question**, **Device connection**, **Configure CD media**, **Configure floppy media**, **Power off**, **Power on**, and **VMware tools install**.
   * **Virtual machine** > **Inventory**: Select **Create from existing**, **Create new**, **Register**, and **Unregister**.
   * **Virtual machine** > **Provisioning**: Select **Allow virtual machine download** and **Allow virtual machine files upload**.
   * **Virtual machine** > **Snapshot management**: Select **Remove snapshots**.

       :::image type="content" source="./media/vmware-azure-multi-tenant-overview/edit-role-permissions.png" alt-text="Screenshot that shows the Edit Role dialog.":::

1. Assign access levels to the vCenter account (used in the tenant configuration server) for various objects.

| Object | Role | Remarks |
| --- | --- | --- |
| vCenter | Read-only |  |
| vCenter | Read-only | Needed only to allow vCenter access for managing different objects. You can remove this permission if the account is never going to be provided to a tenant or used for any management operations on the vCenter. |
| Datacenter | Azure_Site_Recovery |  |
| Host and host cluster | Azure_Site_Recovery | Ensures that access is at the object level so that only accessible hosts have tenant VMs before failover and after failback. |
| Datastore and datastore cluster | Azure_Site_Recovery | Same as preceding. |
| Network |Azure_Site_Recovery |  |
| Management server | Azure_Site_Recovery | Includes access to all components (configuration server, process server, and master target server) outside the configuration server machine. |
| Tenant VMs |Azure_Site_Recovery | Ensures that any new tenant VMs of a particular tenant also get this access, or they can't be discovered through the Azure portal. |

The vCenter account access is now finished. This step fulfills the minimum permissions requirement to complete failback operations. You can also use these access permissions with your existing policies. Just modify your existing permissions set to include role permissions from step 2, which was previously described.

### Failover only

To restrict disaster recovery operations up until failover only (that is, without failback capabilities), use the previous procedure, with these exceptions:

- Instead of assigning the Azure_Site_Recovery role to the vCenter access account, assign only a read-only role to that account. This permission set allows VM replication and failover, and it doesn't allow failback.
- Everything else in the preceding process remains as is. To ensure tenant isolation and restrict VM discovery, every permission is still assigned at the object-level only and not propagated to child objects.

### Deploy resources to the tenant subscription

1. In the Azure portal, create a resource group, and then deploy a Recovery Services vault according to the usual process.
1. Download the vault registration key.
1. Register the configuration server for the tenant by using the vault registration key.
1. Enter the credentials for the two access accounts: the account to access the vCenter server and the account to access the VM.

	:::image type="content" source="./media/vmware-azure-multi-tenant-overview/config-server-account-display.png" alt-text="Screenshot that shows Manager configuration server accounts.":::

### Register servers in the vault

1. In the Azure portal, in the vault that you created earlier, register the vCenter server to the configuration server by using the vCenter account that you created.
1. Finish the process to prepare the infrastructure for Site Recovery according to the usual process.
1. The VMs are now ready to be replicated. Verify that only the tenant's VMs appear in **Replicate** > **Select virtual machines**.

## Dedicated hosting solution

As shown in the following diagram, the architectural difference in a dedicated hosting solution is that each tenant's infrastructure is set up for that tenant only.

:::image type="content" source="./media/vmware-azure-multi-tenant-overview/dedicated-hosting-scenario.png" alt-text="Diagram shows that the architectural difference in a dedicated hosting solution is that each tenant's infrastructure is set up only for that tenant.":::

**Dedicated hosting scenario with multiple vCenters**

## Managed service solution

As shown in the following diagram, the architectural difference in a managed service solution is that each tenant's infrastructure is also physically separate from other tenants' infrastructure. This scenario usually exists when the tenant owns the infrastructure and wants a solution provider to manage disaster recovery.

:::image type="content" source="./media/vmware-azure-multi-tenant-overview/managed-service-scenario.png" alt-text="Diagram that shows architecture.":::

**Managed service scenario with multiple vCenters**

## Related content

- [Learn more](site-recovery-role-based-linked-access-control.md) about role-based access control in Site Recovery.
- Learn how to [set up disaster recovery of VMware VMs to Azure](vmware-azure-tutorial.md).
- Learn more about [multitenancy with CSP for VMware VMs](vmware-azure-multi-tenant-csp-disaster-recovery.md).
