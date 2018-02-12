---
title: Configure replication for Azure VMs in Azure Site Recovery | Microsoft Docs
description: This article describes how to configure replication for Azure VMs, from one Azure region to another using Site Recovery.
services: site-recovery
author: asgang
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 02/12/2017
ms.author: asgang

---


# Replicate Azure virtual machines to another Azure region


>[!NOTE]
>
> Site Recovery replication for Azure virtual machines is currently in preview.

This article describes how to set up replication of Azure VMs running in one Azure region, to another Azure region.

## Prerequisites

* The article assumes that you've already set up Site Recovery for this scenario, as described in the [Azure to Azure tutorial](azure-to-azure-tutorial-enable-replication.md). Make sure that you've prepared the prerequisites and created the Recovery Services vault.



## Enable replication

This procedure enable replication, assuming that the primary Azure region is East Asia, and the secondary region is South East Asia.

1. Click **+Replicate** in the vault to enable replication for the virtual machines.
2. Note the following fields:
    - **Source**: The point of origin of the VMs, which in this case is **Azure**.
    - **Source location**: The Azure region from where you want to protect your virtual machines. For this illustration, the source location is 'East Asia'
    - **Deployment model**: Azure deployment model of the source machines.
    - **Resource Group**: The resource group to which your source virtual machines belong. All the VMs under the selected resource group will be listed for protection in the next step.

    ![Enable replication](./media/site-recovery-replicate-azure-to-azure/enabledrwizard1.png)

3. In **Virtual Machines > Select virtual machines**, click and select each VM that you want to replicate. You can only select machines for which replication can be enabled. Then click **OK**.
   	![Enable replication](./media/site-recovery-replicate-azure-to-azure/virtualmachine_selection.png)

4. In **Settings**, you can configure target site properties

    - **Target Location**: The location where your source virtual machine data will be replicated. Depending upon your selected machines location, Site Recovery will provide you the list of suitable target regions. We recommend that you keep the target location the same as the Recovery Services vault location.
    - **Target resource group**: The resource group to which all your replicated virtual machines belong. By default Azure Site Recovery creates a new resource group in the target region with name having "asr" suffix. In case resource group created by Azure Site Recovery already exists, it will be reused. You can also choose to customize it as shown in the section below.
    - **Target Virtual Network**: By default, Site Recovery creates a new virtual network in the target region with name having "asr" suffix. This will be mapped to your source network and will be used for any future protection. [Learn more](site-recovery-network-mapping-azure-to-azure.md) about network mapping.
    - **Target Storage accounts**: By default, Site Recovery creates a new target storage account mimicking your source VM storage configuration. In case storage account already exists, it will be reused.
    - **Cache Storage accounts**: Site Recovery needs extra storage account called cache storage in the source region. All the changes happening on the source VMs are tracked and sent to cache storage account before replicating those to the target location.
    - **Availability set**: By default, Azure Site Recovery creates a new availability set in the target region with name having "asr" suffix. In case availability set created by Azure Site Recovery already exists, it is reused.
    - **Replication Policy**: It defines the settings for recovery point retention history and app consistent snapshot frequency. By default, Azure Site Recovery creates a new replication policy with default settings of ‘24 hours’ for recovery point retention and ’60 minutes’ for app consistent snapshot frequency.

	![Enable replication](./media/site-recovery-replicate-azure-to-azure/enabledrwizard3.PNG)

## Customize target resources

In case you want to change the defaults used by Site Recovery, you can change the settings based on your needs.

1. **Customize:** Click it to change the defaults used by Site Recovery.

2. **Target resource group:**  You can select the resource group from the list of all the resource groups existing in the target location within the subscription.

3. **Target Virtual Network:** You can find the list of all the virtual network in the target location.

4. **Availability set:** You can only add availability sets settings to the virtual machines that are a part of availability in source region.

5. **Target Storage accounts:**

![Enable replication](./media/site-recovery-replicate-azure-to-azure/customize.PNG)
Click on **Create target resource** and Enable Replication


Once virtual machines are protected, you can check the status of VMs health under **Replicated items**

>[!NOTE]
>During the time of initial replication there could be a possibility that status takes time to refresh and you don't see progress for some time. You can click the Refresh button on the top of the blade to get the latest status.
>

# Next steps

[Learn more](site-recovery-test-failover-to-azure.md) about running a test failover.

