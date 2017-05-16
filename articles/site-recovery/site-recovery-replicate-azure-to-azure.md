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
ms.date: 5/16/2017
ms.author: asgang

---


# Replicate applications


This article describes how to set up replication of virtual machines running in one Azure region to another Azure region.

## Prerequisites

The article assumes that you know about the recovery services vault. 


	
## Enable replication
#### Before you start

*Add link of NSG and URLS here for below*



###Now enable replication as follows:

Azure virtual machines can be protected either directly from the VM setting blades or through Site Recovery Vault.
In this article we will go through both the flows.
 
##Flow 1. Enabling replication from Azure VM Settings

You can enable replication of an Azure virtual machine through settings section in the portal.

1. Click on **Site recovery** under ‘Settings’
2. **Target Region:**  This is the location where your source virtual machine data will be replicated. Depending upon your source machine location, Site Recovery will provide you the list of suitable target regions. You can also visually see these regions on the map shown in the blade.  
3. **VM resource group :** By default ASR will create a new resource group in the target region with name having "-asr" suffix. In case resource group created by ASR already exist, it will be reused. Alternatively, you can also select a resource group available in the given target region.    
4. **Availability set :** By default, ASR will create a new availability set in the target region with name having "-asr" suffix. In case availability set created by ASR already exist, it will be reused. Alternatively, you can also select an availability set available in the given target region.
5. **Virtual Network:** By default, ASR will create a new virtual network in the target region with name having "-asr" suffix. This will be mapped to your source network and will be used for any future protection.

	> [!NOTE]
	> [Check networking details](site-recovery-azure-network.md) to know more about network mapping.
	>

6. **Storage Settings:** By default, ASR will create the new target storage account mimicking your source VM storage configuration. In case storage account created by ASR already exist, it will be reused. 
	> [!NOTE]
	> ASR needs extra storage account called cache storage in the source region. All the changes happening on the source VMs are tracked and sent to cache storage account before replicating those to the target location.  
	>
7.	**Recovery services vault:** It contains target VM configuration settings and orchestrates replication. In an event of a disruption you do fail-over from recovery services vault. In case there is no recovery services vault in the subscription, ASR will create a default vault with name "Site-Recovery-Vault". If there is at least one vault in the given subscription, you will see the option to select that. 
	> [!NOTE] 
	>It is recommended that you create “Recovery services vault” in the location where you want to replicate your machines to i.e. the target Azure region. You cannot have your vault in source region as in the event of region wide disruption, your vault will also be not available
8.	**Recovery Service vault resource group:** It is a resource group of recovery services vault.
9.	**Replication Policy:** It defines the settings for recovery point retention history and app consistent snapshot frequency. By default, ASR will create a new replication policy with default settings of ‘24 hours’ for recovery point retention and ’60 minutes’ for app consistent snapshot frequency. 
10.	Click on Enable replication and ASR will start the job after validating the resource. 

   ![Enable replication](./media/site-recovery-replicate-azure-to-azure/vmsettings_protection.png)




##Flow 2: Enabling replication from Azure Site recovery vault 
For this illustration, we will replicate VMs running  in the ‘East Asia’ Azure location a to the ‘South East Asia’ location. The steps are as follows:


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
	>
2. **Target resource group :** It is the resource group to which all your replicated virtual machine will belong.By default ASR will create a new resource group in the target region with name having "asr" suffix. In case resource group created by ASR already exist, it will be reused.You can also choose to customize it as shown in the section below.    

3. **Target Virtual Network:** By default, ASR will create a new virtual network in the target region with name having "asr" suffix. This will be mapped to your source network and will be used for any future protection.

	> [!NOTE]
	> [Check networking details](site-recovery-azure-network.md) to know more about network mapping.

4. **Target Storage accounts:** By default, ASR will create the new target storage account mimicking your source VM storage configuration. In case storage account created by ASR already exist, it will be reused. 
	> [!NOTE]
	> Source VMs which are having more than one storage account can only replicate to a single storage account  >currently
5. **Cache Storage accounts:** ASR needs extra storage account called cache storage in the source region. All the changes happening on the source VMs are tracked and sent to cache storage account before replicating those to the target location.  
6. **Availability set :** By default, ASR will create a new availability set in the target region with name having "asr" suffix. In case availability set created by ASR already exist, it will be reused. 
7.	**Replication Policy:** It defines the settings for recovery point retention history and app consistent snapshot frequency. By default, ASR will create a new replication policy with default settings of ‘24 hours’ for recovery point retention and ’60 minutes’ for app consistent snapshot frequency.


 	![Enable replication](./media/site-recovery-replicate-azure-to-azure/enabledrwizard3.png)
 


> [!NOTE]
> By default all disks on a machine are replicated. You can [exclude disks from replication](site-recovery-exclude-disk.md). For example you 
might not want to replicate disks with temporary data, or data that's refreshed each time a machine or application restarts (for example pagefile.sys or SQL Server tempdb).
>



11. In **Replication settings** > **Configure replication settings**, verify that the correct replication policy is selected. You can modify replication policy settings in **Settings** > **Replication policies** > policy name > **Edit Settings**. Changes you apply to a policy will be applied to replicating and new machines.
12. Enable **Multi-VM consistency** if you want to gather machines into a replication group, and specify a name for the group. Then click **OK**. Note that:

    * Machines in replication group replicate together and have shared crash-consistent and app-consistent recovery points when they fail over.
    * We recommend that you gather VMs and physical servers together so that they mirror your workloads. Enabling multi-VM consistency can impact workload performance and should only be used if machines are running the same workload and you need consistency.

    ![Enable replication](./media/site-recovery-vmware-to-azure/enable-replication7.png)
13. Click **Enable Replication**. You can track progress of the **Enable Protection** job in **Settings** > **Jobs** > **Site Recovery Jobs**. After the **Finalize Protection** job runs the machine is ready for failover.

> [!NOTE]
> If the machine is prepared for push installation the Mobility service component will be installed when protection is enabled. After the component is installed on the machine a protection job starts and fails. After the failure you need to manually restart each machine. After the restart the protection job begins again and initial replication occurs.
>
>

## View and manage VM properties
We recommend that you verify the properties of the source machine. Remember that the Azure VM name should conform with [Azure virtual machine requirements](site-recovery-support-matrix-to-azure.md#failed-over-azure-vm-requirements).

1. Click **Settings** > **Replicated items** >, and select the machine. The **Essentials** blade shows information about machines settings and status.
2. In **Properties**, you can view replication and failover information for the VM.
3. In **Compute and Network** > **Compute properties**, you can specify the Azure VM name and target size. Modify the name to comply with Azure requirements if you need to.
![Enable replication](./media/site-recovery-vmware-to-azure/VMProperties_AVSET.png)

*Resource Group*
   
  * You can select a [resource group](https://docs.microsoft.com/azure/virtual-machines/windows/infrastructure-resource-groups-guidelines) of which machine will become part of  post fail over. You can change this setting any time before fail over. 
  
> [!NOTE]
> Post fail over, if you migrate the machine to a different resource group then protection settings of a machine will break.
 
*Availability Sets*

You can select an [availability set](https://docs.microsoft.com/azure/virtual-machines/windows/infrastructure-availability-sets-guidelines) if your machine required to be be a part of one post fail over. 
While selecting availability set, please keep in mind that:

* Only availability sets belonging to the specified resource group will be listed  
* Machines with different virtual networks cannot be a part of same availability set 
* Only virtual machines of same size can be a part of same availability set 

*Network Properties*

You can also view and add information about the target network, subnet, and IP address that will be assigned to the Azure VM. Note the following:

   * You can set the target IP address. If you don't provide an address, the failed over machine will use DHCP. If you set an address that isn't available at failover, the failover won't work. The same target IP address can be used for test failover if the address is available in the test failover network.
   * The number of network adapters is dictated by the size you specify for the target virtual machine, as follows:

     * If the number of network adapters on the source machine is less than or equal to the number of adapters allowed for the target machine size, then the target will have the same number of adapters as the source.
     * If the number of adapters for the source virtual machine exceeds the number allowed for the target size then the target size maximum will be used.
     * For example if a source machine has two network adapters and the target machine size supports four, the target machine will have two adapters. If the source machine has two adapters but the supported target size only supports one then the target machine will have only one adapter.     
   * If the virtual machine has multiple network adapters they will all connect to the same network.
   * If the virtual machine has multiple network adapters then the first one shown in the list becomes the *Default* network adapter in the Azure virtual machine.

4. In **Disks**, you can see the operating system and data disks on the VM that will be replicated.


## Common issues

* Each disk should be less than 1TB in size.
* The OS disk should be a basic disk and not dynamic disk
* For generation 2/UEFI enabled virtual machines, the operating system family should be Windows and boot disk should be less than 300GB

## Next steps

Once the protection is completed, you can try [fail over](site-recovery-failover.md) to check whether your application comes up in Azure or not.

In case you want to disable protection, check how to [clean registration and protection settings](site-recovery-manage-registration-and-protection.md)
