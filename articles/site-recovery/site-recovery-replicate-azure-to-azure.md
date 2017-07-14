---
title: Replicate applications (Azure to Azure) | Microsoft Docs
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


# Replicate Azure virtual machines to another Azure region



>[!NOTE]
>
> Site Recovery replication for Azure virtual machines is currently in preview.

This article describes how to set up replication of virtual machines running in one Azure region to another Azure region.

## Prerequisites

* The article assumes that you already know about Site Recovery and Recovery Services Vault. You need to have a 'Recovery services vault' pre created.

    >[!NOTE]
    >
    > It is recommended that you create the 'Recovery services vault' in the location where you want your VMs to replicate. For example, if your target location is 'Central US', create vault in 'Central US'.

* If you are using Network Security Groups (NSG) rules or firewall proxy to control access to outbound internet connectivity on the Azure VMs, ensure that you whitelist the required URLs or IPs. Refer to [Networking guidance document](./site-recovery-azure-to-azure-networking-guidance.md) for more details.

* If you have an ExpressRoute or a VPN connection between on-premises and the source location in Azure, follow [Site Recovery Considerations for Azure to on-premises ExpressRoute / VPN configuration](site-recovery-azure-to-azure-networking-guidance.md#considerations-if-you-already-have-azure-to-on-premises-expressroute--vpn-configuration) document.

* Your Azure user account needs to have certain [permissions](site-recovery-role-based-linked-access-control.md#permissions-required-to-enable-replication-for-new-virtual-machines) to enable replication of an Azure virtual machine.

* Your Azure subscription should be enabled to create VMs in the target location you want to use as DR region. You can contact support to enable the required quota.

## Enable replication from Azure Site Recovery vault
For this illustration, we will replicate VMs running  in the ‘East Asia’ Azure location to the ‘South East Asia’ location. The steps are as follows:

 Click **+Replicate** in the vault to enable replication for the virtual machines.

1. **Source:** It refers to the point of origin of the machines which in this case is **Azure**.

2. **Source location:** It is the Azure region from where you want to protect your virtual machines. For this illustration, the source location will be 'East Asia'

3. **Deployment model:** It refers to the Azure deployment model of the source machines. You can select either classic or resource manager and machines belonging to the specific model will be listed for protection in the next step.

      >[!NOTE]
      >
      > You can only replicate a classic virtual machine and recover it as a classic virtual machine. You cannot recover it as a Resource Manager virtual machine.

4. **Resource Group:** It’s the resource group to which your source virtual machines belong. All the VMs under the selected resource group will be listed for protection in the next step.

    ![Enable replication](./media/site-recovery-replicate-azure-to-azure/enabledrwizard1.png)

In **Virtual Machines > Select virtual machines**, click and select each machine you want to replicate. You can only select machines for which replication can be enabled. Then click OK.
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

5. **Cache Storage accounts:** ASR needs extra storage account called cache storage in the source region. All the changes happening on the source VMs are tracked and sent to cache storage account before replicating those to the target location.

6. **Availability set :** By default, ASR will create a new availability set in the target region with name having "asr" suffix. In case availability set created by ASR already exist, it will be reused.

7.	**Replication Policy:** It defines the settings for recovery point retention history and app consistent snapshot frequency. By default, ASR will create a new replication policy with default settings of ‘24 hours’ for recovery point retention and ’60 minutes’ for app consistent snapshot frequency.

	![Enable replication](./media/site-recovery-replicate-azure-to-azure/enabledrwizard3.PNG)

## Customize target resources

In case you want to change the defaults used by ASR, you can change the settings based on your needs.

1. **Customize:** Click it to change the defaults used by ASR.

2. **Target resource group :**  You can select the resource group from the list of all the resource groups existing in the target location within the subscription.

3. **Target Virtual Network:** You can find the list of all the virtual network in the target location.

4. **Availability set :** You can only add availability sets settings to the virtual machines which are a part of availability in source region.

5. **Target Storage accounts:**

![Enable replication](./media/site-recovery-replicate-azure-to-azure/customize.PNG)
Click on **Create target resource** and Enable Replication


Once virtual machines are protected you can check the status of VMs health under **Replicated items**

>[!NOTE]
>During the time of initial replication there could a possibility that status takes time to refresh and you don't see progress for some time. You can click the Refresh button on the top of the blade to get the latest status.
>

![Enable replication](./media/site-recovery-replicate-azure-to-azure/replicateditems.PNG)


## Next steps
- [Learn more](site-recovery-test-failover-to-azure.md) about running a test failover.
- [Learn more](site-recovery-failover.md) about different types of failovers, and how to run them.
- Learn more about [using recovery plans](site-recovery-create-recovery-plans.md) to reduce RTO.
- Learn more about [reprotecting Azure  VMs](site-recovery-how-to-reprotect.md) after failover.
