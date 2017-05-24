---
title: 'Replicate applications (Azure to Azure) | Microsoft Docs'
description: This article describes how to set up replication of virtual machines running in one Azure region  to  another region in Azure.
services: site-recovery
documentationcenter: ''
author: asgang
manager: rochakm
editor: ''

ms.assetid:
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 5/22/2017
ms.author: asgang

---


# Replicate Azure virtual machines


This article describes how to set up replication of virtual machines running in one Azure region to another Azure region.

## Prerequisites

* The article assumes that you know about Recovery Services Vault.
* If you are using Network Security Groups (NSG) rules to control access to outbound internet connectivity on the Azure VMs, ensure that you [whitelist the mentioned Azure data center IP ranges](site-recovery-azure-to-azure-networking-guidance.md#network-security-group-configuration)
* If you are using any firewall proxy to control outbound internet connectivity, ensure that you [whitelist all URLS  required by Azure Site recovery service](site-recovery-azure-to-azure-networking-guidance.md#outbound-connectivity-for-azure-site-recovery-urls-or-ip-ranges)
* If you have an ExpressRoute connection between on-premises and source location in Azure, follow the [ExpressRoute configuration guidance](site-recovery-azure-to-azure-networking-guidance.md#azure-to-on-premises-expressroute-configuration)

## Enable replication

Azure virtual machines can be protected either directly from the VM setting blades or through Site Recovery Vault.
In this article we will go through both the flows.

##Flow 1: Enabling replication from Azure VM Settings

You can enable replication of an Azure virtual machine through settings section in the portal.

1. Click on **Site Recovery** under ‘Settings’
2. **Target Region:**  This is the location where your source virtual machine data will be replicated. Depending upon your source machine location, Site Recovery will provide you the list of suitable target regions. You can also visually see these regions on the map shown in the blade.  
3. **VM resource group :** It is the resource group to which your replicated virtual machine will belong. By default ASR will create a new resource group in the target region with name having "-asr" suffix. In case resource group created by ASR already exist, it will be reused. Alternatively, you can also select a resource group available in the given target region.    
4. **Availability set :** By default, ASR will create a new availability set in the target region with name having "-asr" suffix. In case availability set created by ASR already exist, it will be reused. Alternatively, you can also select an availability set available in the given target region.
5. **Virtual Network:** By default, ASR will create a new virtual network in the target region with name having "-asr" suffix. This will be mapped to your source network and will be used for any future protection.

	> [!NOTE]
	> [Check networking details](site-recovery-network-mapping-azure-to-azure.md) to know more about network mapping and guidance.
	>

6. **Storage Settings:** By default, ASR will create the new target storage account mimicking your source VM storage configuration. In case storage account created by ASR already exist, it will be reused.
	> [!NOTE]
	> ASR needs extra storage account called cache storage in the source region. All the changes happening on the source VMs are tracked and sent to cache storage account before replicating those to the target location.  
	>
7.	**Recovery services vault:** It contains target VM configuration settings and orchestrates replication. In an event of a disruption you do fail-over from recovery services vault. In case there is no recovery services vault in the subscription, ASR will create a default vault with name "Site-Recovery-Vault". If there is at least one vault in the given subscription, you will see the option to select that.
	> [!NOTE]
	>It is recommended that you create “Recovery services vault” in the location where you want to replicate your machines to i.e. the target Azure region. You cannot have your vault in source region as in the event of region wide disruption, your vault will also be not available
8.	**Recovery service vault resource group:** It is a resource group of recovery services vault.
9.	**Replication Policy:** It defines the settings for recovery point retention history and app consistent snapshot frequency. By default, ASR will create a new replication policy with default settings of ‘24 hours’ for recovery point retention and ’60 minutes’ for app consistent snapshot frequency.
10.	Click on Enable replication and ASR will start the job after validating the resource.
   ![Enable replication](./media/site-recovery-replicate-azure-to-azure/vmsettings_protection.png)


##Flow 2: Enabling replication from Azure Site Recovery vault
For this illustration, we will replicate VMs running  in the ‘East Asia’ Azure location  to the ‘South East Asia’ location. The steps are as follows:

 Click **+Replicate** in the vault to enable replication for  machines.

1. **Source:** It refers to the point of origin of the machines which in this case is Azure.
2. **Source location:** It is the Azure region from where you want to protect your virtual machines.
3. **Deployment model:** It refers to the azure deployment model of the source machines. You can select either classic or resource manager and machines belonging to the specific model will be listed for protection.
4. **Resource Group:** It’s the resource group to which your source virtual machines belong. ASR will use this as a reference to show you the list of machines which can be protected

    ![Enable replication](./media/site-recovery-replicate-azure-to-azure/enabledrwizard1.png)

In **Virtual Machines** > Select virtual machines, click and select each machine you want to replicate. You can only select machines for which replication can be enabled. Then click OK.
   	![Enable replication](./media/site-recovery-replicate-azure-to-azure/virtualmachine_selection.png)


Under Settings section you can configure target site properties

1. **Target Location:**  This is the location where your source virtual machine data will be replicated. Depending upon your selected machines location, Site Recovery will provide you the list of suitable target regions.
	> [!TIP]
	> It is recommended to keep target location same as of your recovery services vault.
2. **Target resource group :** It is the resource group to which all your replicated virtual machines will belong.By default ASR will create a new resource group in the target region with name having "asr" suffix. In case resource group created by ASR already exist, it will be reused.You can also choose to customize it as shown in the section below.    
3. **Target Virtual Network:** By default, ASR will create a new virtual network in the target region with name having "asr" suffix. This will be mapped to your source network and will be used for any future protection.
	> [!NOTE]
	> [Check networking details](site-recovery-network-mapping-azure-to-azure.md) to know more about network mapping.
4. **Target Storage accounts:** By default, ASR will create the new target storage account mimicking your source VM storage configuration. In case storage account created by ASR already exist, it will be reused.
	> [!NOTE]
	> Source VMs which are having more than one storage account can only replicate to a single storage account  >currently
5. **Cache Storage accounts:** ASR needs extra storage account called cache storage in the source region. All the changes happening on the source VMs are tracked and sent to cache storage account before replicating those to the target location.  
6. **Availability set :** By default, ASR will create a new availability set in the target region with name having "asr" suffix. In case availability set created by ASR already exist, it will be reused.
7.	**Replication Policy:** It defines the settings for recovery point retention history and app consistent snapshot frequency. By default, ASR will create a new replication policy with default settings of ‘24 hours’ for recovery point retention and ’60 minutes’ for app consistent snapshot frequency.
	> [!NOTE]
	> [Check replication policy details](site-recovery-replication-policy.md) to know more about policy.

	![Enable replication](./media/site-recovery-replicate-azure-to-azure/enabledrwizard3.PNG)
#### Customize  Resource Group, Network, Storage and Availability sets

In case you want to change the defaults used by ASR, you can change the settings based on your needs.

1. **Customize:** Click it to change the defaults used by ASR.
2. **Target resource group :**  You can select the resource group from the list of all the resource groups existing in the target location within the subscription.
3. **Target Virtual Network:** You can find the list of all the virtual network in the target location.
4. **Availability set :** You can only add availability sets settings to the virtual machines which are a part of availability in source region.
5. **Target Storage accounts:**

![Enable replication](./media/site-recovery-replicate-azure-to-azure/customize.PNG)
Click on **Create target resource** and Enable Replication


Once virtual machines are protected you can check the status of VMs health under **replicated items**

>[!NOTE]
>[ During the time of initial replication there could a a possibility that status takes time to refresh and you don't see progress for some time. You can click the Refresh button on the top of the blade to get the latest status.
>
![Enable replication](./media/site-recovery-replicate-azure-to-azure/replicateditems.PNG)


## Next steps
Once the protection is completed, you can try [fail over](site-recovery-failover.md) to check whether your application comes up in Azure or not.

In case you want to disable protection, check how to [clean registration and protection settings](site-recovery-manage-registration-and-protection.md)
