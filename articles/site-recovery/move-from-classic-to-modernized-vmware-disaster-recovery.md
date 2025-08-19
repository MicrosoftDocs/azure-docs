---
title: Move from classic to modernized VMware disaster recovery
description: Learn about the architecture, necessary infrastructure, and FAQs about moving your VMware or Physical machine replications from classic to modernized protection architecture.
ms.service: azure-site-recovery
ms.topic: concept-article
ms.date: 03/26/2025
author: jyothisuri
ms.author: jsuri
ms.custom: engagement-fy23
# Customer intent: "As an IT administrator managing VMware environments, I want to migrate existing machine replications from classic to modernized disaster recovery architecture, so that I can leverage improved protection and efficiency without the need for complete reinitialization of data."
---

# Move from classic to modernized VMware disaster recovery   

This article provides information about the architecture, necessary infrastructure, and FAQs about moving your VMware or Physical machine replications from [classic](./vmware-azure-architecture.md) to [modernized](./vmware-azure-architecture-modernized.md) protection architecture. With this capability to migrate, you can successfully transfer your replicated items from a configuration server to an Azure Site Recovery replication appliance. This migration is guided by a smart replication mechanism, which ensures that complete initial replication isn't performed again for noncritical replicated items, and only the differential data is transferred. 

> [!NOTE]
> Recovery plans won't be migrated and will need to be created again in the modernized Recovery Services vault.  

## Architecture  

The components involved in the migration of replicated items of a VMware or Physical machine are summarized in the following table:  

| **Component** | **Requirement**
|---------|-----------
|Replicated items in a classic Recovery Services vault| One or more replicated items that are protected using the classic architecture and a healthy configuration server.<br></br>The replicated item should be in a noncritical state and must be replicated from on-premises to Azure with the mobility agent running on version 9.50 or later.
|Configuration server used by the replicated items|The configuration server, used by the replicated items, should be in a noncritical state and its components should be upgraded to the latest version (9.50 or later).
|A Recovery Services vault with modernized experience|A Recovery Services vault with modernized experience.
|A healthy Azure Site Recovery replication appliance|A non-critical Azure Site Recovery replication appliance, which can discover on-premises machines, with all its components upgraded to the latest version (9.50 or later). The exact required versions are as follows:<br></br>Process server: 9.50<br>Proxy server: 1.35.8419.34591<br>Recovery services agent: 2.0.9249.0<br>Replication service: 1.35.8433.24227

## Required infrastructure  

Ensure the following for a successful movement of replicated item: 
- A Recovery Services vault using the modernized experience.   
  >[!Note] 
  >Any new Recovery Services vault created will have the modernized experience switched on by default. You can not switch to the classic experience, as its deprecation has already been [announced](./vmware-physical-azure-classic-deprecation.md).   
- An [Azure Site Recovery replication appliance](./deploy-vmware-azure-replication-appliance-modernized.md), which has been successfully registered to the vault, and all its components are in a noncritical state.   
- The version of the appliance must be 9.50 or later. For a detailed version description, check [here](#architecture). 
- The vCenter server or vSphere host’s details, where the existing replicated machines reside, are added to the appliance for the on-premises discovery to be successful.  


## Prerequisites  

### Prepare the infrastructure  

Ensure the following before you move from classic architecture to modernized architecture: 

- [Create a Recovery Services vault](./azure-to-azure-tutorial-enable-replication.md#create-a-recovery-services-vault) and ensure the experience [hasn't been switched to classic](./vmware-azure-common-questions.md#how-do-i-use-the-classic-experience-in-the-recovery-services-vault-rather-than-the-modernized-experience)
- [Deploy an Azure Site Recovery replication appliance](./deploy-vmware-azure-replication-appliance-modernized.md). 
- [Add the on-premises machine’s vCenter Server details](./deploy-vmware-azure-replication-appliance-modernized.md) to the appliance, so that it successfully performs discovery.   

### Prepare classic Recovery Services vault   

Ensure the following for the replicated items you're planning to move: 
 
- The replicated item is a VMware or Physical machine replicating via a configuration server. 
- Replication isn't happening to an un-managed storage account but rather to managed disk. 
- Replication is happening from on-premises to Azure and the replicated item isn't in a failed-over or in failed-back state. 
- The replicated item isn't replicating the data from Azure to on-premises.  
- The initial replication isn't under progress and has already been completed.   
- The replicated item isn't in the ‘resynchronization’ state.  
- The configuration server’s version is 9.50 or later and its health is in a noncritical state.  
- The configuration server has a healthy heartbeat.  
- The mobility service agent’s version, installed on the source machine, is 9.50 or later.  
- The Recovery Services vaults with MSI enabled are supported.  
- The Recovery Services vaults with Private Endpoints enabled are supported.   
- The replicated item’s health is in a noncritical state, or its recovery points are being created successfully.  

### Prepare modernized Recovery Services vault   

For the modernized architecture setup, ensure that:   

- The Recovery Services vault used for modernized architecture setup is in the same geographical location as the classic vault.   
- An Azure Site Recovery replication appliance is deployed on your on-premises with version 9.50 or later.  
- The appliance is successfully registered to the vault.   
- The appliance and all its components are in a noncritical state and the appliance has a healthy heartbeat.  
- The vCenter Server version is supported by the modernized architecture.  
- The vCenter Server details of the source machine are added to the appliance.  
- The Linux distro version is supported by the modernized architecture. [Learn more](./vmware-physical-azure-support-matrix.md#for-linux). 
- The Windows Server version is supported by the modernized architecture. [Learn more](./vmware-physical-azure-support-matrix.md#for-windows). 

## Calculate total time to move  

The total time required to move any replicated item from classic vault to modernized vault depends on the item’s replication status and the disk size.  

| State | Time to migrate to modernized vault |
|-------|---------------------|
| Replicated item’s protection status is **healthy** and the **last recovery point was created less than 50 minutes ago**|Migration is complete in **1-2 hours**|
| Replicated item’s protection status is **not healthy** or the **last recovery point was created more than 50 minutes ago**|Migration time will vary, and it will **depend on the disk size**|

If your machines protection status isn't healthy, then use the formula below to calculate the exact time for your machines: 

Time to migrate = 1 hour + 45 second/GiB  

| Machine configuration | Time to migrate |
|-----------------|------------|
| One machine with two disks, both of size 256 GiB|~ 4 hours 15 mins<br></br>*[Both the disks are migrated in parallel]*|
| 10 machines with two disks each, both of size 256 GiB|~ 4 hours 15 mins<br></br>*[All the VMs and their disks are migrated in parallel]*|
| One machine with four disks, all of size 512 GiB|~ 7 hours 30 mins<br></br>*[Both the disks are migrated in parallel]*|
| 10 machines with four disks each, all of size 512 GiB|~ 7 hours 30 mins<br></br>*[All the VMs and their disks are migrated in parallel]*|

The same formula is used to calculate time for migration and is shown on the portal.   

## How to define required infrastructure 

When migrating machines from classic to modernized architecture, you'll need to make sure that the required infrastructure has already been registered in the modernized Recovery Services vault. Refer to the replication appliance’s [sizing and capacity details](./replication-appliance-support-matrix.md#sizing-and-capacity) to help define the required infrastructure.  

As a rule, you should set up the same number of replication appliances, as the number of process servers in your classic Recovery Services vault. In the classic vault, if there was one configuration server and four process servers, then you should set up four replication appliances in the modernized Recovery Services vault.  

## Pricing 

Site Recovery license fee will continue to be charged on the classic vault till retention period of all recovery points has expired. Once all recovery points have been cleaned up, the pricing will also stop on the classic vault. Once the retention period of all the recovery points has expired, the replicated item will be automatically removed via a system triggered purge replication operation.  

Site Recovery will start charging license fee on replicated items in the modernized vault, only after the first recovery point has been generated and older vault has been cleaned up. If there are any free trial usage days pending on the classic vault, then the same information will be passed on to the modernized vault. Pricing will start on the modernized vault only after this trial period has passed. 

>[!Note]
> At one point in time, pricing will only happen using one vault, either the classic or modernized vault.  
 

## Next steps

- Learn [how to move from classic to modernized VMware disaster recovery](how-to-move-from-classic-to-modernized-vmware-disaster-recovery.md).
