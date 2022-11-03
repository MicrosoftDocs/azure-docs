---
title: Move from classic to modernized VMware disaster recovery.
description: Learn about the architecture, necessary infrastructure, and FAQs about moving your VMware replications from classic to modernized protection architecture.
ms.service: site-recovery
ms.topic: conceptual
ms.date: 07/15/2022
---

# Move from classic to modernized VMware disaster recovery   

This article provides information about the architecture, necessary infrastructure, and FAQs about moving your VMware replications from [classic](./vmware-azure-architecture.md) to [modernized](./vmware-azure-architecture-modernized.md) protection architecture. With this capability to migrate, you can successfully transfer your replicated items from a configuration server to an Azure Site Recovery replication appliance. This migration is guided by a smart replication mechanism, which ensures that complete initial replication isn't performed again for non-critical replicated items, and only the differential data is transferred. 

> [!Note]
> - Movement of physical servers to modernized architecture is not yet supported.   
> - Movement of machines replicated in a Private Endpoint enabled Recovery Services vault is not supported yet.    
> - Recovery plans won't be migrated and will need to be created again in the modernized Recovery Services vault.  

## Architecture  

The components involved in the migration of replicated items of a VMware machine are summarized in the following table:  

|Component|Requirement|
|---------|-------------|
|Replicated items in a classic Recovery Services vault|One or more replicated items that are protected using the classic architecture and a healthy configuration server.<br></br>The replicated item should be in a non-critical state and must be replicated from on-premises to Azure with the mobility agent running on version 9.50 or later.|
|Configuration server used by the replicated items|The configuration server, used by the replicated items, should be in a non-critical state and its components should be upgraded to the latest version (9.50 or later).|  
|A Recovery Services vault with modernized experience|A Recovery Services vault with modernized experience.|
|A healthy Azure Site Recovery replication appliance|A non-critical Azure Site Recovery replication appliance, which can discover on-premises machines, with all its components upgraded to the latest version (9.50 or later). The exact required versions are as follows:<br></br>Process server: 9.50<br>Proxy server: 1.35.8419.34591<br>Recovery services agent: 2.0.9249.0<br>Replication service: 1.35.8433.24227|

## Required infrastructure  

Ensure the following for a successful movement of replicated item: 
- A Recovery Services vault using the modernized experience.   
  >[!Note] 
  >Any new Recovery Services vault created will always have the modernized experience as classic experience will be [deprecated](vmware-physical-azure-classic-deprecation.md) in Novemebr 2023 and is not recommended to be used.
- An [Azure Site Recovery replication appliance](./deploy-vmware-azure-replication-appliance-modernized.md), which has been successfully registered to the vault, and all its components are in a non-critical state.   
- The version of the appliance must be 9.50 or later. For a detailed version description, check [here](#architecture). 
- The vCenter server or vSphere host’s details, where the existing replicated machines reside, are added to the appliance for the on-premises discovery to be successful.   

## Prerequisites  

### Prepare the infrastructure  

Ensure the following before you move from classic architecture to modernized architecture: 

- [Create a Recovery Services vault](./azure-to-azure-tutorial-enable-replication.md#create-a-recovery-services-vault).md#how-do-i-use-the-classic-experience-in-the-recovery-services-vault-rather-than-the-modernized-experience). 
- [Deploy an Azure Site Recovery replication appliance](./deploy-vmware-azure-replication-appliance-modernized.md). 
- [Add the on-premises machine’s vCenter Server details](./deploy-vmware-azure-replication-appliance-modernized.md) to the appliance, so that it successfully performs discovery.   

### Prepare classic Recovery Services vault   

Ensure the following for the replicated items you are planning to move: 

- The Recovery Services vault does not have MSI enabled on it.   
- The replicated item is a VMware machine replicating via a configuration server. 
- Replication is not happening to an unmanaged storage account but rather to managed disk. 
- Replication is happening from on-premises to Azure and the replicated item is not in a failed-over or in failed-back state. 
- The replicated item is not replicating the data from Azure to on-premises.  
- The initial replication is not under progress and has already been completed.   
- The replicated item is not in the ‘resynchronization’ state.  
- The configuration server’s version is 9.50 or later and its health is in a non-critical state.  
- The configuration server has a healthy heartbeat.  
- The mobility service agent’s version, installed on the source machine, is 9.50 or later.  
- The replicated item does not use Private Endpoint.   
- The replicated item’s health is in a non-critical state, or its recovery points are being created successfully.  

### Prepare modernized Recovery Services vault   

For the modernized architecture setup, ensure that:   

- The Recovery Services vault used for modernized architecture setup is in the same geographical location as the classic vault.   
- An Azure Site Recovery replication appliance is deployed on your on-premises with version 9.50 or later.  
- The appliance is successfully registered to the vault.   
- The appliance and all its components are in a non-critical state and the appliance has a healthy heartbeat.  
- The vCenter Server version is supported by the modernized architecture.  
- The vCenter Server details of the source machine are added to the appliance.  
- The Linux distro version is supported by the modernized architecture. [Learn more](./vmware-physical-azure-support-matrix.md#for-linux). 
- The Windows Server version is supported by the modernized architecture. [Learn more](./vmware-physical-azure-support-matrix.md#for-windows). 

## Calculate total time to move  

The total time required to move any replicated item from classic vault to modernized vault depends on the item’s replication status and the disk size.  

| State | Time to migrate to modernized vault |
|-------|---------------------|
| Replicated item’s protection status is **healthy** and the **last recovery point was created less than 50 minutes ago**|Migration will be complete in **1-2 hours**|
| Replicated item’s protection status is **not healthy** or the **last recovery point was created more than 50 minutes ago**|Migration time will vary, and it will **depend on the disk size**|

If your machines protection status is not healthy, then use the formula below to calculate the exact time for your machines: 

Time to migrate = 1 hour + 45 second/GiB  

| Machine configuration | Time to migrate |
|-----------------|------------|
| 1 machine with 2 disks, both of size 256 GiB|~ 4 hours 15 mins<br></br>*[Both the disks will be migrated in parallel]*|
| 10 machines with 2 disks each, both of size 256 GiB|~ 4 hours 15 mins<br></br>*[All the VMs and their disks will be migrated in parallel]*|
| 1 machine with 4 disks, all of size 512 GiB|~ 7 hours 30 mins<br></br>*[Both the disks will be migrated in parallel]*|
| 10 machines with 4 disks each, all of size 512 GiB|~ 7 hours 30 mins<br></br>*[All the VMs and their disks will be migrated in parallel]*|

The same formula will be used to calculate time for migration and is shown on the portal.   

## How to define required infrastructure 

When migrating machines from classic to modernized architecture, you will need to make sure that the required infrastructure has already been registered in the modernized Recovery Services vault. Refer to the replication appliance’s [sizing and capacity details](./deploy-vmware-azure-replication-appliance-modernized.md#sizing-and-capacity) to help define the required infrastructure.  

As a rule, you should set up the same number of replication appliances, as the number of process servers in your classic Recovery Services vault. In the classic vault, if there was one configuration server and four process servers, then you should set up four replication appliances in the modernized Recovery Services vault.  

## Pricing 

Site Recovery license fee will continue to be charged on the classic vault till retention period of all recovery points has expired. Once all recovery points have been cleaned up, the pricing will also stop on the classic vault. Once the retention period of all the recovery points has expired, the replicated item will be automatically removed via a system triggered purge replication operation.  

Site Recovery will start charging license fee on replicated items in the modernized vault, only after the first recovery point has been generated and older vault has been cleaned up. If there are any free trial usage days pending on the classic vault, then the same information will be passed on to the modernized vault. Pricing will start on the modernized vault only after this trial period has passed.  

>[!Note]
> At one point in time, pricing will only happen using one vault, either the classic or modernized vault.  

## FAQs  

### Why should I migrate my machines to the modernized architecture?

Ultimately, the classic architecture will be deprecated, so one must ensure that they are using the latest modernized architecture. The table below shows a comparison of the two architectures to enable you to select the correct option for enabling disaster recovery for your machines:  

|Classic architecture|Modernized architecture [New]|
|---------------------|-----------------------------|
|Multiple setups required for discovering on-premises data.|**Central discovery** of on-premises data center using discovery service.| 
|Extensive number of steps required for initial onboarding.|**Simplified the onboarding experience** by automating artifact creation and introduced defaults to reduce required inputs.|  
|Utilizes a manually downloaded file to obtain cloud context.|**Introduced replication key** for obtaining cloud context when setting up the appliance.|
|Extensive number of steps required for a simple enable replication process.|**Simplified the enable replication experience** by reducing the number of required inputs and redefining each blade.|
|Configuration server continues to be an on-premises infrastructure with extensive setup for various components.|Enhanced the appliance by converting all components into Azure hosted microservices. This **simplifies appliance scaling, monitoring, and troubleshooting.**|
|Need for scale-out process server and master target server in Azure for Linux machines is a hindering requirement.|**Removed** the need to maintain separate **process server and master target server**.| 
|Used a static passphrase for authentication, which interfered with customer’s business requirements of periodic password rotation.|Introduced **certificate-based authentication**, which is more secure and resolves customer’s security concerns.|
|Upgrading to an updated version should be done manually and is a cumbersome process.|Introduced **automatic upgrades** for both appliance components and Mobility service.|
|The configuration server does not have high availability and might be at the risk of collapsing.|Implemented **high availability of appliance** to ensure resiliency.|
|Root credentials should be regularly updated to ensure an error-free upgrade experience.|**Eliminated the requirement to maintain machine’s root credentials** for performing automatic upgrades.|
|Static IP address should be assigned to configuration server to maintain connectivity.|Introduced **FQDN based connectivity** between appliance and on-premises machines.|
|Only that virtual network, which has Site-to-Site VPN or Express Route enabled, should be used.|Removed the need to maintain a Site-to-Site VPN or Express Route for reverse replication.|

### What machines should be migrated to the modernized architecture?

All VMware machines, which are replicated using a configuration server, should be migrated to the modernized architecture. As of now, we have released support for VMware machines.   

### Where should my modernized Recovery Services vault be created?

The modernized Recovery Services vault should be present in the same region and tenant as the classic vault. It can be a part of any subscription or resource group.   

### Will my replication continue while the migration is happening?

No, the replication will break for some time while the migration is in progress. During this time, the last created recovery point, in the classic Recovery Services vault, will be available for you to failover to. Once the migration is complete, a new recovery point will be generated in the modernized Recovery Services vault.   

### When will my migration operation be marked as complete?

Migration operation will only be marked complete once the first recovery point has been successfully created in the modernized Recovery Services vault.  

### What operations can be performed from my classic Recovery Services vault, after migration is done?  

You can only perform failover and disable replication from your classic vault after the migration. The failover operation is possible via the classic vault until the recovery points are available in the older vault.

For example, if the retention period for a replicated item is 72 hours (3 days), the latest recovery point on the classic vault will continue to be available for 72 hours (3 days), after a successful post migration. After the stipulated time, Azure Site Recovery will trigger a purge replication operation on the replicated item and perform the cleanup of all associated storage and billing causing items.   

### What if a disaster strikes my machine while the migration operation is in progress?

Any replicated item on which migration is being performed will continue to support failover operation via the classic Recovery Services vault, till the last recovery point’s retention period expires. In case you try to execute failover operation, it will take a higher priority than migration operation. The job for migration will be aborted. To ensure that your replicated item is migrated, you will need to trigger the migration operation again, at a later point in time.   

>[!Note]
> The Compute and Network properties of replicated items can be updated while the migration is in progress. However, the changes may not get replicated in the modernized Recovery Services vault. 

### How many machines can I migrate in one go from classic to modernized vault?

You can migrate up to 10 machines via the portal, in one go.   

### Should I recreate the virtual networks, storage accounts, and replication policy to be used in the new vault?

No, the same resources, which were being used previously will be defaulted to in the modernized vault also. You can always change those from the Compute and Network blade of your replicated item. You must ensure that the resources continue to have the required access.   

### How will my replication policies be moved to the modernized vault?

As a prerequisite, Site Recovery will first create replication policies in the modernized vault, with the same configuration as present in the classic vault. So, if a replicated item is being moved, then the policy associated with it will be first created in the modernized vault and then migration will happen. It is recommended that the configuration of replication policies not be changed in the classic vault after migration has been triggered, as the changed values won't be propagated to the modernized vault. This operation should happen before migration is triggered.  
 
The replication policy created in the modernized vault will have its name changed in the modernized vault. It will be prefixed with resource group name and vault name of the modernized Recovery Services vault. So, if the policy name was “default replication policy” in the classic vault, then in the modernized vault, this policy’s name will be “default replication policy contoso-modern-vault_contoso-rg”, given the vault’s name is contoso-modern-vault and the vault’s resource group is contoso-rg.  

### Can I edit my replication policy during migration or post migration in the classic vault?

If the replica of a replication policy has already been created in the modernized vault, then any changes to the policy in the classic vault won't be propagated to the modernized vault.  

So, if there are 10 replicated items, which are replicated using a policy and you decide to move 5 of those to the modernized experience, then a copy of the policy will be created before migration starts. Now, before performing migration of the remaining 5 items, if any changes are made in the policy in classic vault, the policy from modernized vault won't be updated. You will need to make those configuration changes in the modernized vault too.  

### How do I migrate replicated items, which are present in a replication group, also known as multi-vm consistency groups?

All replicated items, which are a part of a replication group will be migrated together. You can either select them all, by selecting the replication group, or skip them all. In case the migration fails for some machines in a replication group and succeeds for others, then a rollback to classic experience will be performed for failed replicated items and migration for failed items can be triggered again.

## Next steps

[How to move from classic to modernized VMware disaster recovery](how-to-move-from-classic-to-modernized-vmware-disaster-recovery.md)