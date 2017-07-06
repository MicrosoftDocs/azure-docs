---
title: Multi-tenant support for VMware VM replication to Azure (CSP program) | Microsoft Docs
description: Describes how to deploy Azure Site Recovery in a multi-tenant environment to orchestrate replication, failover, and recovery of on-premises VMware virtual machines (VMs) to Azure through the CSP program by using the Azure portal
services: site-recovery
documentationcenter: ''
author: mayanknayar
manager: rochakm
editor: ''

ms.assetid: ''
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/23/2017
ms.author: manayar

---
# Multi-tenant support in Azure Site Recovery for replicating VMware virtual machines to Azure through CSP

Azure Site Recovery supports multi-tenant environments for tenant subscriptions. It also supports multi-tenancy for tenant subscriptions that are created and managed through the Microsoft Cloud Solution Provider (CSP) program. This article details the guidance for implementing and managing multi-tenant VMware-to-Azure scenarios. It also covers creating and managing tenant subscriptions through CSP.

This guidance draws heavily from the existing documentation for replicating VMware virtual machines to Azure. For more information, see [Replicate VMware virtual machines to Azure with Site Recovery](site-recovery-vmware-to-azure.md).

## Multi-tenant environments
There are three major multi-tenant models:

* **Shared Hosting Services Provider (HSP)**: The partner owns the physical infrastructure and uses shared resources (vCenter, datacenters, physical storage, and so on) to host multiple tenants’ VMs on the same infrastructure. The partner can provide disaster-recovery management as a managed service, or the tenant can own disaster recovery as a self-service solution.

* **Dedicated Hosting Services Provider**: The partner owns the physical infrastructure but uses dedicated resources (multiple vCenters, physical datastores, and so on) to host each tenant’s VMs on a separate infrastructure. The partner can provide disaster-recovery management as a managed service, or the tenant can own it as a self-service solution.

* **Managed Services Provider (MSP)**: The customer owns the physical infrastructure that hosts the VMs, and the partner provides disaster-recovery enablement and management.

## Shared-hosting multi-tenant guidance
This section covers the shared-hosting scenario in detail. The other two scenarios are subsets of the shared-hosting scenario, and they use the same principles. The differences are described at the end of the shared-hosting guidance.

The basic requirement in a multi-tenant scenario is to isolate the various tenants. One tenant should not be able to observe what another tenant has hosted. In a partner-managed environment, this requirement is not as important as it is in a self-service environment, where it can be critical. This guidance assumes that tenant isolation is required.

The architecture is presented in the following diagram:

![Shared HSP with one vCenter](./media/site-recovery-multi-tenant-support-vmware-using-csp/shared-hosting-scenario.png)  
**Shared-hosting scenario with one vCenter**

As seen in the preceding diagram, each customer has a separate management server. This configuration limits tenant access to tenant-specific VMs and enables tenant isolation. A VMware virtual-machine replication scenario uses the configuration server to manage accounts to discover VMs and install agents. We follow the same principles for multi-tenant environments, with the addition of restricting VM discovery through vCenter access control.

The data-isolation requirement necessitates that all sensitive infrastructure information (such as access credentials) remain undisclosed to tenants. For this reason, we recommend that all components of the management server remain under the exclusive control of the partner. The management server components are:
* Configuration server (CS)
* Process server (PS)
* Master target server (MT) 

A scale-out PS is also under the partner's control.

### Every CS in the multi-tenant scenario uses two accounts

- **vCenter access account**: Use this account to discover tenant VMs. It has vCenter access permissions assigned to it (as described in the next section). To help avoid accidental access leaks, we recommend that partners enter these credentials themselves in the configuration tool.

- **Virtual machine access account**: Use this account to install the mobility agent on the tenant VMs through an automatic push. It is usually a domain account that a tenant might provide to a partner or that, alternatively, the partner might manage directly. If a tenant doesn't want to share the details with the partner directly, he or she can be allowed to enter the credentials through limited-time access to the CS or, with the partner's assistance, install mobility agents manually.

### Requirements for a vCenter access account

As mentioned in the preceding section, you must configure the CS with an account that has a special role assigned to it. The role assignment must be applied to the vCenter access account for each vCenter object and not propagated to the child objects. This configuration ensures tenant isolation, because access propagation can result in accidental access to other objects.

![The Propagate to Child Objects option](./media/site-recovery-multi-tenant-support-vmware-using-csp/assign-permissions-without-propagation.png)

The alternative is to assign the user account and role at the datacenter object and propagate them to the child objects. Then give the account a *No access* role for every object (such as other tenants’ VMs) that should be inaccessible to a particular tenant. This configuration is cumbersome, and it exposes accidental access controls, because every new child object is also automatically granted access that's inherited from the parent. Therefore, we recommend that you use the first approach.

The vCenter account-access procedure is as follows:

1. Create a new role by cloning the pre-defined *Read-only* role, and then give it a convenient name (such as Azure_Site_Recovery, as shown in this example).

2. Assign the following permissions to this role:

    * **Datastore**: Allocate space, Browse datastore, Low-level file operations, Remove file, Update virtual machine files

    * **Network**: Network assign

    * **Resource**: Assign VM to resource pool, Migrate powered off VM, Migrate powered on VM

    * **Tasks**: Create task, Update task

    * **Virtual machine**: 
        * Configuration > all
        * Interaction > Answer question, Device connection, Configure CD media, Configure floppy media, Power off, Power on, VMware tools install
        * Inventory > Create from existing, Create new, Register, Unregister
        * Provisioning > Allow virtual machine download, Allow virtual machine files upload
        * Snapshot management > Remove snapshots

	![The Edit Role dialog box](./media/site-recovery-multi-tenant-support-vmware-using-csp/edit-role-permissions.png)

3. Assign access levels to the vCenter account (used in the tenant CS) for various objects, as follows:

>| Object | Role | Remarks |
>| --- | --- | --- |
>| vCenter | Read-Only | Needed only to allow vCenter access for managing different objects. You can remove this permission if the account is never going to be provided to a tenant or used for any management operations on the vCenter. |
>| Datacenter | Azure_Site_Recovery |  |
>| Host and host cluster | Azure_Site_Recovery | Re-ensures that access is at the object level, so that only accessible hosts have tenant VMs before failover and after failback. |
>| Datastore and datastore cluster | Azure_Site_Recovery | Same as preceding. |
>| Network | Azure_Site_Recovery |  |
>| Management server | Azure_Site_Recovery | Includes access to all components (CS, PS, and MT) if any are outside the CS machine. |
>| Tenant VMs | Azure_Site_Recovery | Ensures that any new tenant VMs of a particular tenant also get this access, or they will not be discoverable through the Azure portal. |

The vCenter account access is now complete. This step fulfills the minimum permissions requirement to complete failback operations. You can also use these access permissions with your existing policies. Just modify your existing permissions set to include role permissions from step 2, detailed previously.

To restrict disaster-recovery operations until the failover state (that is, without failback capabilities), follow the preceding  procedure, with an exception: instead of assigning the *Azure_Site_Recovery* role to the vCenter access account, assign only a *Read-Only* role to that account. This permission set allows VM replication and failover, and it does not allow failback. Everything else in the preceding process remains as is. To ensure tenant isolation and restrict VM discovery, every permission is still assigned at the object level only and not propagated to child objects.

## Other multi-tenant environments

The preceding section described how to set up a multi-tenant environment for a shared hosting solution. The other two major solutions are dedicated hosting and managed service. The architecture for these solutions is described in the following sections:

### Dedicated hosting solution

As shown in the following diagram, the architectural difference in a dedicated hosting solution is that each tenant’s infrastructure is set up for that tenant only. Because tenants are isolated through separate vCenters, the hosting provider must still follow the CSP steps provided for shared hosting but does not need to worry about tenant isolation. CSP setup remains unchanged.

![architecture-shared-hsp](./media/site-recovery-multi-tenant-support-vmware-using-csp/dedicated-hosting-scenario.png)  
**Dedicated hosting scenario with multiple vCenters**

### Managed service solution

As shown in the following diagram, the architectural difference in a managed service solution is that each tenant’s infrastructure is also physically separate from other tenants' infrastructure. This scenario usually exists when the tenant owns the infrastructure and wants a solution provider to manage disaster recovery. Again, because tenants are physically isolated through different infrastructures, the partner needs to follow the CSP steps provided for shared hosting but does not need to worry about tenant isolation. CSP provisioning remains unchanged.

![architecture-shared-hsp](./media/site-recovery-multi-tenant-support-vmware-using-csp/managed-service-scenario.png)  
**Managed service scenario with multiple vCenters**

## CSP program overview
The [CSP program](https://partner.microsoft.com/en-US/cloud-solution-provider) fosters better-together stories that offer partners all Microsoft cloud services, including Office 365, Enterprise Mobility Suite, and Microsoft Azure. With CSP, our partners own the end-to-end relationship with customers and become the primary relationship contact point. Partners can deploy Azure subscriptions for customers and combine the subscriptions with their own value-added, customized offerings.

With Azure Site Recovery, partners can manage the complete Disaster Recovery solution for customers directly through CSP. Or they can use CSP to set up Site Recovery environments and let customers manage their own disaster-recovery needs in a self-service manner. In both scenarios, partners are the liaison between Site Recovery and their customers. Partners service the customer relationship and bill customers for Site Recovery usage.

## Create and manage tenant accounts

### Step 0: Prerequisite check

The VM prerequisites are the same as described in the [Azure Site Recovery documentation](site-recovery-vmware-to-azure.md). In addition to those prerequisites, you should have the previously mentioned access controls in place before you proceed with tenant management through CSP. For each tenant, create a separate management server that can communicate with the tenant VMs and partner’s vCenter. Only the partner has access rights to this server.

### Step 1: Create a tenant account

1. Through [Microsoft Partner Center](https://partnercenter.microsoft.com/), sign in to your CSP account. 
 
2. On the **Dashboard** menu, select **Customers**.

	![The Microsoft Partner Center Customers link](./media/site-recovery-multi-tenant-support-vmware-using-csp/csp-dashboard-display.png)

3. On the page that opens, click the **Add customer** button.

	![The Add Customer button](./media/site-recovery-multi-tenant-support-vmware-using-csp/add-new-customer.png)

4. On the **New Customer** page, fill in the account information details for the tenant, and then click **Next: Subscriptions**.

	![The Account Info page](./media/site-recovery-multi-tenant-support-vmware-using-csp/customer-add-filled.png)

5. On the subscriptions selection page, select the **Microsoft Azure** check box. You can add other subscriptions now or at any other time.

	![The Microsoft Azure subscription check box](./media/site-recovery-multi-tenant-support-vmware-using-csp/azure-subscription-selection.png)

6. On the **Review** page, confirm the tenant details, and then click **Submit**.

	![The Review page](./media/site-recovery-multi-tenant-support-vmware-using-csp/customer-summary-page.png)  

    After you've created the tenant account, a confirmation page appears, displaying the details of the default account and the password for that subscription. 

7. Save the information, and change the password later as necessary through the Azure portal sign-in page.  
 
    You can share this information with the tenant as is, or you can create and share a separate account if necessary.

### Step 2: Access the tenant account

You can access the tenant’s subscription through the Microsoft Partner Center Dashboard, as described in "Step 1: Create a tenant account." 

1. Go to the **Customers** page, and then click the name of the tenant account.

2. On the **Subscriptions** page of the tenant account, you can monitor the existing account subscriptions and add more subscriptions, as required. To manage the tenant’s disaster-recovery operations, select **All resources (Azure portal)**.

	![The All Resources link](./media/site-recovery-multi-tenant-support-vmware-using-csp/all-resources-select.png)  
    
    Clicking **All resources** grants you access to the tenant’s Azure subscriptions. You can verify access by clicking the Azure Active Directory link at the top right of the Azure portal.

	![Azure Active Directory link](./media/site-recovery-multi-tenant-support-vmware-using-csp/aad-admin-display.png)

You can now perform all site-recovery operations for the tenant through the Azure portal and manage the disaster-recovery operations. To access the tenant subscription through CSP for managed disaster recovery, follow the previously described process.

### Step 3: Deploy resources to the tenant subscription
1. On the Azure portal, create a resource group, and then deploy a Recovery Services vault per the usual process. 
 
2. Download the vault registration key.

3. Register the CS for the tenant by using the vault registration key.

4. Enter the credentials for the two access accounts: vCenter access account and VM access account.

	![Manager configuration server accounts](./media/site-recovery-multi-tenant-support-vmware-using-csp/config-server-account-display.png)

### Step 4: Register Site Recovery infrastructure to the Recovery Services vault
1. In the Azure portal, on the vault that you created earlier, register the vCenter server to the CS that you registered in "Step 3: Deploy resources to the tenant subscription." Use the vCenter access account for this purpose.
2. Finish the "Prepare infrastructure" process for Site Recovery per the usual process.
3. The VMs are now ready to be replicated. Verify that only the tenant’s VMs are displayed on the **Select virtual machines** blade under the **Replicate** option.

	![Tenant VMs list on the Select virtual machines blade](./media/site-recovery-multi-tenant-support-vmware-using-csp/tenant-vm-display.png)

### Step 5: Assign tenant access to the subscription

For self-service disaster recovery, provide to the tenant the account details, as mentioned in step 6 of the "Step 1: Create a tenant account" section. Perform this action after the partner sets up the disaster-recovery infrastructure. Whether the disaster-recovery type is managed or self-service, partners must access tenant subscriptions through the CSP portal. They set up the partner-owned vault and register infrastructure to the tenant subscriptions.

Partners can also add a new user to the tenant subscription through the CSP portal by doing the following:

1. Go to the tenant’s CSP subscription page, and then select the **Users and licenses** option.

	![The tenant's CSP subscription page](./media/site-recovery-multi-tenant-support-vmware-using-csp/users-and-licences.png)

	You can now create a new user by entering the relevant details and selecting permissions or by uploading the list of users in a CSV file.

2. After you've created a new user, go back to the Azure portal, and then, on the **Subscription** blade, select the relevant subscription.

3. On the blade that opens, select **Access Control (IAM)**, and then click **Add** to add a user with the relevant access level.      
    The users that were created through the CSP portal are automatically displayed on the blade that opens after you click an access level.

	![Add a user](./media/site-recovery-multi-tenant-support-vmware-using-csp/add-user-subscription.png)

	For most management operations, the *Contributor* role is sufficient. Users with this access level can do everything on a subscription except change access levels (for which *Owner*-level access is required). You can also fine-tune the access levels as required.
