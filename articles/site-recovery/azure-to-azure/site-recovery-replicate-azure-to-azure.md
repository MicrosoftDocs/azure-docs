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
ms.date: 11/21/2017
ms.author: asgang

---


# Replicate Azure virtual machines to another Azure region


This article describes how to set up replication of virtual machines running in one Azure region to another Azure region, using the Azure Site Recovery service.

>[!NOTE]
>
> Azure VM replication with Site Recovery is currently in preview.

## Prerequisites

* You should have a Recovery Services vault in place. We recommend that you create the vault in the target region to which you want your VMs to replicate.
* If you are using Network Security Groups (NSG) rules or a firewall proxy to control access to outbound internet connectivity on the Azure VMs, make sure that you allow the required URLs or IPs. [Learn more](./site-recovery-azure-to-azure-networking-guidance.md).
* If you have an ExpressRoute or a VPN connection between on-premises and the source location in Azure, [learn how to set them up](site-recovery-azure-to-azure-networking-guidance.md#guidelines-for-existing-azure-to-on-premises-expressroutevpn-configuration).
* Your Azure user account needs [specific permissions](../site-recovery-role-based-linked-access-control.md#permissions-required-to-enable-replication-for-new-virtual-machines), to enable replication of an Azure VM.
Your Azure subscription should be enabled to create VMs in the target location that you want to use as a disaster recovery region. Contact support to enable the required quota.

## Enable replication

In this procedure, we use East Asia as the source location, and South East Asia as the target.

1. Click **+Replicate** in the vault to enable replication for the virtual machines.
2. Verify that **Source:** is set to **Azure**.
3. Set **Source location** to East Asia.
4. In **Deployment model**, select **classic** or **Resource Manager**.
5. In **Resource Group**, select the group to which your source VMs belong. All the VMs under the selected resource group will be listed.

	![Enable replication](./media/site-recovery-replicate-azure-to-azure/enabledrwizard1.png)

6. In **Virtual Machines > Select virtual machines**, click and select each VM you want to replicate. You can only select machines for which replication can be enabled. Then click **OK**.

	![Enable replication](./media/site-recovery-replicate-azure-to-azure/virtualmachine_selection.png)
	
7. Under **Settings** > **Target Location**, specify where source VM data will be replicated. Site Recovery provides a list of suitable target regions, depending of the region of the selected VMs.
8. Site Recovery sets default target settings. These can be modified as required.

	- **Target resource group**. By default, Site Recovery creates a new resource group in the target region with the "asr" suffix. If the created resource group already exists, it will be reused.
	- **Target Virtual Network**. By default, Site Recovery creates a new virtual network in the target region, with the "asr" suffix. This network is mapped to your source network. [Learn more](site-recovery-network-mapping-azure-to-azure.md) about network mapping.
	- **Target Storage accounts**. By default, Site Recovery creates a new target storage account that matches the source VM storage configuration. If the created account already exists, it will be reused.
	- **Cache Storage accounts**. Azure Site Recovery creates an extra cache storage account, the source region. All changes on the source VMs are tracked and sent to cache storage account before replication to the target location.
	- **Availability set**. By default, Site Recovery creates a new availability set in the target region, with an "asr" suffix. If the created set already exists, it will be reused.
	- **Replication Policy**. Site Recovery defines the settings for recovery point retention history, and app-consistent snapshot frequency. By default, Site Recovery creates a new replication policy with default settings of 24 hours for recovery point retention, and 60 minutes for app-consistent snapshot frequency.

	![Enable replication](./media/site-recovery-replicate-azure-to-azure/enabledrwizard3.PNG)
9. Click **Enable Replication**

## Customize target resources

1. Modify any of these target defaults:

- **Target resource group:**. Select any resource group from the list of all the resource groups in the target location, within the subscription.
- **Target Virtual Network**. Select from the list of all the virtual networks in the target location.
- **Availability set** You can only add availability sets settings to VMs which are a part of the set in source region.
- **Target Storage accounts:**: Add any account that's available.

	![Enable replication](./media/site-recovery-replicate-azure-to-azure/customize.PNG)

2. Click on **Create target resource** > **Enable Replication**. During initial replication, VM status might take some time to refresh. Click **Refresh** to get the latest status.

	
	![Enable replication](./media/site-recovery-replicate-azure-to-azure/replicateditems.PNG)
3. After VMs are protected, check VM health in **Replicated items**.



## Next steps
[Learn](../azure-to-azure-tutorial-dr-drill.md) how to run a test failover.

