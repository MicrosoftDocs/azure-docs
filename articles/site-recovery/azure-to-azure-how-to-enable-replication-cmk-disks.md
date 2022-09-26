---
title: Enable replication of encrypted Azure VMs in Azure Site Recovery
description: This article describes how to configure replication for VMs with customer-managed key (CMK) enabled disks from one Azure region to another by using Site Recovery.
author: v-pgaddala
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 07/25/2021
ms.author: v-pgaddala

---

# Replicate machines with Customer-Managed Keys (CMK) enabled disks

This article describes how to replicate Azure VMs with Customer-Managed Keys (CMK) enabled managed disks, from one Azure region to another.

## Prerequisite
You must create the Disk Encryption set(s) in the target region for the target subscription before enabling replication for your virtual machines that have CMK-enabled managed disks.

## Enable replication

Use the following procedure to replicate machines with Customer-Managed Keys (CMK) enabled disks. 
As an example, the primary Azure region is East Asia, and the secondary region is South East Asia.

1. In the vault > **Site Recovery** page, under **Azure virtual machines**, select **Enable replication**.
1. In the **Enable replication** page, under **Source**, do the following:
   - **Region**: Select the Azure region from where you want to protect your VMs. 
   For example, the source location is *East Asia*.
   - **Subscription**: Select the subscription to which your source VMs belong. This can be any subscription within the same Azure Active Directory tenant where your recovery services vault exists.
   - **Resource group**: Select the resource group to which your source virtual machines belong. All the VMs in the selected resource group are listed for protection in the next step.
   - **Virtual machine deployment model**: Select Azure deployment model of the source machines.
   - **Disaster recovery between availability zones**: Select **Yes** if you want to perform zonal disaster recovery on virtual machines.

     :::image type="fields needed to configure replication" source="./media/azure-to-azure-how-to-enable-replication-cmk-disks/source.png" alt-text="Screenshot that highlights the fields needed to configure replication.":::
1. Select **Next**.
1. In **Virtual machines**, select each VM that you want to replicate. You can only select machines for which replication can be enabled. You can select up to ten VMs. Then select **Next**.

   ![Screenshot that highlights where you select virtual machines.](./media/azure-to-azure-how-to-enable-replication-cmk-disks/virtual-machine-selection.png)

1. In **Replication settings**, you can configure the following settings:
    1. Under **Location and Resource group**,
       - **Target location**: Select the location where your source virtual machine data must be replicated. Depending on the location of selected machines, Site Recovery will provide you the list of suitable target regions. We recommend that you keep the target location the same as the Recovery Services vault location.
       - **Target subscription**: Select the target subscription used for disaster recovery. By default, the target subscription will be same as the source subscription.
       - **Target resource group**: Select the resource group to which all your replicated virtual machines belong.
           - By default, Site Recovery creates a new resource group in the target region with an *asr* suffix in the name.
           - If the resource group created by Site Recovery already exists, it's reused.
           - You can customize the resource group settings.
           - The location of the target resource group can be any Azure region, except the region in which the source VMs are hosted.
           
            >[!Note]
            > You can also create a new target resource group by selecting **Create new**. 
        
    1. Under **Network**,
       - **Failover virtual network**: Select the failover virtual network.
         >[!Note]
         > You can also create a new failover virtual network by selecting **Create new**.
       - **Failover subnet**: Select the failover subnet.
    1. **Storage**: By default, Site Recovery creates a new target storage account by mimicking your source VM storage configuration. If a storage account already exists, it's reused.
    1. **Availability options**: By default, Site Recovery creates a new availability option in the target region. The name has the *asr* suffix. If an availability set that was created by Site Recovery already exists, it's reused.
        >[!NOTE]
        >- While configuring the target availability sets, configure different availability sets for differently sized VMs.
        >- You cannot change the availability type - single instance, availability set or availability zone, after you enable replication. You must disable and enable replication to change the availability type.     
    1. **Capacity reservation**: Capacity Reservation lets you purchase capacity in the recovery region, and then failover to that capacity. You can either create a new Capacity Reservation Group or use an existing one. For more information, see [how capacity reservation works](https://learn.microsoft.com/azure/virtual-machines/capacity-reservation-overview).
    
     :::image type="enable replication parameters" source="./media/azure-to-azure-how-to-enable-replication-cmk-disks/enable-vm-replication.png" alt-text="Screenshot that displays the enable replication parameters.":::

1. Select **Next**.
1. In **Manage**, do the following:
    1. Under **Replication policy**,
       - **Replication policy**: Select the replication policy. Defines the settings for recovery point retention history and app-consistent snapshot frequency. By default, Site Recovery creates a new replication policy with default settings of 24 hours for recovery point retention and 60 minutes for app-consistent snapshot frequency.
       - **Replication group**: Create replication group.
    1. Under **Extension settings**, 
       - Select **Update settings** and **Automation account**.
   
   :::image type="manage" source="./media/azure-to-azure-how-to-enable-replication-cmk-disks/manage.png" alt-text="Screenshot that displays the manage tab.":::

1. Select **Next**
1. In **Review**, review the VM settings and select **Enable replication**.

   :::image type="review" source="./media/azure-to-azure-how-to-enable-replication-cmk-disks/review.png" alt-text="Screenshot that displays the review tab.":::

## Customize target resources

Follow these steps to modify the Site Recovery default target settings.

1. Select **Customize** next to "Storage encryption settings" to select the target DES for every customer-managed key (CMK) enabled source managed disk. At the time of selection, you will also be able to see which target key vault the DES is associated with.

1. Select **Create target resource** > **Enable Replication**.
1. After the VMs are enabled for replication, you can check the VMs' health status under **Replicated items**.

![Screenshot that shows where to check the VMs' health status.](./media/azure-to-azure-how-to-enable-replication-cmk-disks/cmk-customize-target-disk-properties.png)

>[!NOTE]
>During initial replication, the status might take some time to refresh, without apparent progress. Click **Refresh**  to get the latest status.

## FAQs

* I have enabled CMK on an existing replicated item, how can I ensure that CMK is applied on the target region as well?

    You can find out the name of the replica managed disk (created by Azure Site Recovery in the target region) and attach DES to this replica disk. However, you will not be able to see the DES details in the Disks blade once you attach it. Alternatively, you can choose to disable the replication of the VM and enable it again. It will ensure you see DES and key vault details in the Disks blade for the replicated item.

* I have added a new CMK enabled disk to the replicated item. How can I replicate this disk with Azure Site Recovery?

    Addition of a new CMK enabled disk to an existing replicated item is not supported. Disable the replication and enable the replication again for the virtual machine.

* I have enabled both platform and customer managed keys, how can I protect my disks?

    Enabling double encryption with both platform and customer managed keys is supported by Site Recovery. Follow the instructions in this article to protect your machine. You need to create a double encryption enabled DES in the target region in advance. At the time of enabling the replication for such a VM, you can provide this DES to Site Recovery.

