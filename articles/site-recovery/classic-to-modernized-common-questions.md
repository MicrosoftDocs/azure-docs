---
title: Common questions about move from classic to modernized VMware disaster recovery.
description: This article answers common questions about transitioning from classic to modernized VMware disaster recovery using Azure Site Recovery.
ms.author: jsuri
author: jyothisuri
ms.topic: faq
ms.date: 03/31/2025
ms.service: azure-site-recovery

---
# Common questions about classic to modernized VMware disaster recovery

This article provides answers to common questions about transitioning from classic to modernized VMware disaster recovery using Azure Site Recovery.

## Frequently asked questions

### Why should I migrate my machines to the modernized architecture?

It is important to note that the classic architecture for disaster recovery will be phased out, so users should make sure to switch to the latest and modernized version. The following table provides a comparison of the two architectures to help you choose the right option for securing your machines in the event of a disaster.


|**Classic architecture** | **Modernized architecture [New]**
|---------------------|-----------------------------
|Multiple setups required for discovering on-premises data.|**Central discovery** of on-premises data center using discovery service. 
|Extensive number of steps required for initial onboarding.|**Simplified the onboarding experience** by automating artifact creation and introduced defaults to reduce required inputs.
|Utilizes a manually downloaded file to obtain cloud context.|**Introduced replication key** for obtaining cloud context when setting up the appliance.
|Extensive number of steps required for a simple enable replication process.|**Simplified the enable replication experience** by reducing the number of required inputs and redefining each blade.
|Configuration server continues to be an on-premises infrastructure with extensive setup for various components.|Enhanced the appliance by converting all components into Azure hosted microservices. This **simplifies appliance scaling, monitoring, and troubleshooting.**
|Need for scale-out process server and master target server in Azure for Linux machines is a hindering requirement.|**Removed** the need to maintain separate **process server and master target server**.
|Used a static passphrase for authentication, which interfered with customer’s business requirements of periodic password rotation.|Introduced **certificate-based authentication**, which is more secure and resolves customer’s security concerns.
|Upgrading to an updated version should be done manually and is a cumbersome process.|Introduced **automatic upgrades** for both appliance components and Mobility service.
|The configuration server doesn't have high availability and might be at the risk of collapsing.|Implemented **high availability of appliance** to ensure resiliency.
|Root credentials should be regularly updated to ensure an error-free upgrade experience.|**Eliminated the requirement to maintain machine’s root credentials** for performing automatic upgrades.
|Static IP address should be assigned to configuration server to maintain connectivity.|Introduced **FQDN based connectivity** between appliance and on-premises machines.
|Only that virtual network, which has Site-to-Site VPN or Express Route enabled, should be used.|Removed the need to maintain a Site-to-Site VPN or Express Route for reverse replication.
| Third party tool, MySQL, also needs to be set up. |Removed the dependency on any third party tools.

### What machines should be migrated to the modernized architecture?

All VMware or physical machines that are replicated using a configuration server should be migrated to the modernized architecture. 

### Where should my modernized Recovery Services vault be created?

The modernized Recovery Services vault should be located in the same region and tenant as the classic vault. It can be a part of any subscription or resource group. 

### Will my replication continue while the migration is happening?

No, the replication breaks for some time while the migration is in progress. During this time, the last created recovery point, in the classic Recovery Services vault, is available for you to failover to. Once the migration is complete, a new recovery point is generated in the modernized Recovery Services vault.  

### When will my migration operation be marked as complete?

Migration operation is only be marked complete once the first recovery point has been successfully created in the modernized Recovery Services vault.  

### What operations can be performed from my classic Recovery Services vault, after migration is done?  

You can perform failover from your classic vault after the migration. The failover operation continues to be available in the classic vault until the recovery points expire.

For example, if the retention period for a replicated item is 72 hours (three days), the latest recovery point on the classic vault continues to be available for 72 hours (three days), after a successful migration. After the stipulated time, Azure Site Recovery automatically triggers a purge replication operation on the replicated item and perform the cleanup of all associated storage and billing-causing items.   

### What if a disaster strikes my machine while the migration operation is in progress?

Any replicated item that is undergoing migration can still support the failover operation through the classic Recovery Services vault until the retention period for the final recovery point has ended. If you try to execute a failover operation, it will take precedence over the migration operation and the migration job is aborted. To ensure that your replicated item is migrated, you'll need to trigger the migration operation again at a later time.

>[!Note]
> The Compute and Network properties of replicated items can be updated while the migration is in progress. However, the changes may not get replicated in the modernized Recovery Services vault. 

### How many machines can I migrate in one go from classic to modernized vault?

You can migrate up to 10 machines via the portal, in one go.   

### Should I recreate the virtual networks, storage accounts, and replication policy to be used in the new vault?

No, the same resources, which were being used previously will be defaulted to in the modernized vault also. You can always change those from the **Compute** and **Network** blade of your replicated item. You must ensure that the resources continue to have the required access.

### How will my replication policies be moved to the modernized vault?

As a prerequisite, Site Recovery creates replication policies in the modernized vault with the same configuration as in the classic vault. So, before a replicated item is moved, the associated policy is created in the modernized vault. We recommend that you avoid making changes to the configuration of replication policies in the classic vault after the migration has been triggered, as these changes won't be reflected in the modernized vault. It's best to make these changes before starting the migration process.
 
The replication policy created in the modernized vault has its name changed in the modernized vault. It is prefixed with resource group name and vault name of the modernized Recovery Services vault. So, if the policy name was `default replication policy` in the classic vault, then in the modernized vault, this policy’s name is `default replication policy contoso-modern-vault_contoso-rg`, given the vault’s name is contoso-modern-vault and the vault’s resource group is contoso-rg.  

### Can I edit my replication policy during migration or post migration in the classic vault?

If the replica of a replication policy has already been created in the modernized vault, then any changes to the policy in the classic vault won't be propagated to the modernized vault. 

So, if there are 10 replicated items, that are replicated using a policy and you decide to move 5 of those to the modernized experience, then a copy of the policy is created before migration starts. Now, before performing migration of the remaining five items, if any changes are made in the policy in classic vault, the policy from modernized vault won't be updated. You'll need to make those configuration changes in the modernized vault too.  

### How do I migrate replicated items, which are present in a replication group, also known as multi-vm consistency groups?

All replicated items that are part of a replication group are migrated together. You can select all of them by selecting the replication group or skip them all. If the migration process fails for some machines in a replication group but succeeds for others, a rollback to the classic experience is performed for the failed replicated items and the migration process can be triggered again for those items.

### Can I migrate my classic setup with public endpoint to modernized setup with private endpoint?

No, you can only move classic disaster recovery setup with public endpoint to modernized public endpoint setup. 
Note that, nonprivate endpoint to private endpoint migration is not supported, but private endpoint to private endpoint migration is supported.


## Next steps

- Learn [how to move from classic to modernized VMware disaster recovery](how-to-move-from-classic-to-modernized-vmware-disaster-recovery.md).
- Learn more about [classic to modernized architecture](./move-from-classic-to-modernized-vmware-disaster-recovery.md).
