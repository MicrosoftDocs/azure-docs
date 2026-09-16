---
title: Azure Virtual Machines disaster recovery - High Churn support
ms.reviewer: v-gajeronika
description: Describes how to protect your Azure Virtual Machines having high churning workloads.
author: Jeronika-MS
ms.service: azure-site-recovery
ms.topic: how-to
ms.date: 06/30/2026
ms.author: v-gajeronika
ms.custom: references_regions 
# Customer intent: As a cloud administrator, I want to enable High Churn support for Azure Virtual Machines, so that I can effectively protect high churning workloads and achieve better disaster recovery performance.
---

# Azure Virtual Machines disaster recovery - High Churn support 

Azure Site Recovery now supports churn (data change rate) up to 500 MB/s per virtual machine by using the High Churn option. Earlier, it was limited to 100 MB/s per virtual machine. This feature helps you protect Azure virtual machines that run high-churning workloads, such as databases, and can help you achieve a better Recovery Point Objective (RPO) for those workloads. 

By using the default Normal Churn option, you can support churn only up to 54 MB/s per virtual machine. By using High Churn, the maximum churn a virtual machine can achieve depends on the support matrix requirements described in the following section - primarily the VM memory, the source disk size and type, the I/O size, the region, and the Azure Site Recovery Mobility service version. 

> [!NOTE]
> High Churn uses Premium Block Blob storage accounts for the cache storage account. Earlier, the High Churn option supported churn up to 100 MB/s per VM. It now supports up to 500 MB/s per VM when the support matrix requirements are met. 

## Support matrix 

The following requirements determine whether a virtual machine is eligible for High Churn and which churn limit (up to 100 MB/s or up to 500 MB/s) it can achieve. 

### Scenario and disks 

- High Churn supports only disaster recovery of Azure virtual machines (Azure-to-Azure scenario). 
- Source disks must be managed disks. 
- To achieve churn up to 500 MB/s, source disks must be Premium SSD v1, Premium SSD v2, or Ultra Disk.  

### Memory (RAM) 

The churn limit a virtual machine can reach depends on its RAM. A minimum of 32 GB RAM is recommended to reach 100 MB/s, and a minimum of 256 GB RAM is required to reach 500 MB/s. If a VM has less than 256 GB RAM, its churn limit is capped at 100 MB/s. If it has less than 32 GB RAM, its churn limit is capped at 54 MB/s. 


|**VM RAM**|**Max churn per VM**|**Max churn per disk**|
|---|---|---|
|Less than 32 GB|54 MB/s|20 MB/s|
|32 GB to less than 256 GB|100 MB/s|50 MB/s|
|256 GB and above|500 MB/s|Up to 250 MB/s (see disk-size limits)|

>[!NOTE]
>Site Recovery reserves up to 6.25% of RAM for both Windows and Linux. However, for Windows this is capped to a maximum of 16 GB for High Churn and 4 GB for Normal Churn.

### Operating system 

- Windows. 
- Linux – Support up to 100 MB/s in all ASR supported Linux distros. However, support beyond 100 MB/s up to 500 MB/s is supported only for RHEL 9, SLES 15, and Ubuntu 24.04. 

### Disk size and I/O size 

The churn supported per disk is based on the source disk size and the application I/O size. For the per-disk limits that apply to the 100 MB/s and 500 MB/s configurations, see the churn limit tables in the following sections.

### Region availability 

- High churn (up to 100 MB/s) is available in all regions where Azure Site Recovery is supported and Premium Block Blob storage accounts are available. 
- Enhanced churn (up to 500 MB/s) is available in a limited set of regions. 

Enhanced churn support for 500 MB/s is supported for replications where both source and target regions are from the following regions: 
- Australia Central
- Australia Central 2
- Australia East
- Australia Southeast
- Brazil South
- Brazil Southeast
- Canada East
- Central India
- Central US
- East Asia
- East US 2
- France Central
- France South
- Germany North
- Germany West Central
- Israel Central
- Italy North
- Japan East
- Japan West
- Korea Central
- Korea South
- New Zealand North
- North Central US
- North Europe
- Norway East
- Qatar Central
- South Africa North
- South Africa West
- South Central US
- South Central US 2
- South India
- Southeast Asia
- Southeast US
- Southeast US 5
- Southwest US
- Switzerland West
- Taiwan North
- Taiwan Northwest
- UAE Central, UAE North
- UK South
- UK West
- West Central US
- West Europe
- West US
- West US 2
- West US 3

### Networking and CPU 

Ensure the source Azure VM has enough network bandwidth and CPU available for Site Recovery (peak CPU usage by ASR can be 18%) to replicate the data changes from the source. 

### Mobility service version 

Churn up to 500 MB/s requires the Azure Site Recovery Mobility service version to be 9.66.7640.1 or later, in addition to all other support matrix requirements. 

The way a virtual machine (with High Churn option and meeting all support matrix requirements of 500 MB/s) reaches the 500 MB/s limit depends on whether it is newly protected or already protected: 

- **Newly protected VMs**: Enabling Azure Site Recovery on a VM that meets all support matrix requirements applies the 500 MB/s limit automatically. 

- **Already-protected VMs**: After you upgrade the Mobility service to 9.66.7640.1 or later, reboot the VM (if advised on ASR agent upgrade task on portal) so that the compatible Azure Site Recovery kernel driver is loaded and the 500 MB/s limit takes effect.  

Prior to Mobility Service version 9.66.7640.1, the High Churn option supported a churn limit of up to 100 MB/s per VM. 

## Churn limits by disk size and I/O size 

These limits are based on tests and don't cover all possible application I/O combinations. Actual results might vary based on your app I/O mix. Two limits apply at the same time: the per-disk churn limit (in the tables below) and the per-VM churn limit (from the support matrix). A virtual machine is bound by whichever limit it reaches first. 

### When the configuration supports up to 100 MB/s per VM 

Applies when the VM has 32 GB to less than 256 GB of RAM and meets the other support requirements. Per-VM churn is capped at 100 MB/s; per-disk churn is capped at 50 MB/s. 

|**Source disk type / Write size**|**8 KB**|**16 KB**|**24 KB**|**32 KB and more**|
|---|---|---|---|---|
|**Standard**|2 MB/s|4 MB/s|6 MB/s|8 MB/s|
|**Premium SSD (128 GiB or more)**|10 MB/s|20 MB/s|30 MB/s|30 MB/s|
|**Premium SSD (512 GiB or more)**|10 MB/s|20 MB/s|30 MB/s|30 MB/s|
|**Premium SSD (1 TiB or more)**|20 MB/s|35 MB/s|50 MB/s|50 MB/s|

### When the configuration supports up to 500 MB/s per VM 

This support applies when the VM has 256 GB or more of RAM, uses Premium SSD v1 or v2, or Ultra Disk source disks, and meets the other support requirements. The per-VM churn caps at 500 MB/s, and the per-disk churn caps at 250 MB/s. 

|**Source disk size (GiB) / Write Sizes in KB**|**8 KB**|**16 KB**|**32 KB**|**64 KB**|**128 KB**|**256 KB and more**|
|---|---|---|---|---|---|---|
|**128**|3.9 MB/s|7.8 MB/s|11.5 MB/s|33.1 MB/s|66.1 MB/s|100 MB/s|
|**256**|8.6 MB/s|17.2 MB/s|34.4 MB/s|68.8 MB/s|125 MB/s|125 MB/s|
|**512**|18.0 MB/s|35.9 MB/s|71.9 MB/s|143.8 MB/s|150 MB/s|150 MB/s|
|**1,024**|39.1 MB/s|78.1 MB/s|156.3 MB/s|200.0 MB/s|200 MB/s|200 MB/s|
|**2,048**|58.6 MB/s|117.2 MB/s|234.4 MB/s|250.0 MB/s|250 MB/s|250 MB/s|
|**4,096**|58.6 MB/s|117.2 MB/s|234.4 MB/s|250.0 MB/s|250 MB/s|250 MB/s|
|**8,192**|125.0 MB/s|250.0 MB/s|250 MB/s|250 MB/s|250 MB/s|250 MB/s|
|**16,384**|140.6 MB/s|250 MB/s|250 MB/s|250 MB/s|250 MB/s|250 MB/s|
|**32,767**|156.3 MB/s|250 MB/s|250 MB/s|250 MB/s|250 MB/s|250 MB/s|

This limit applies only if the source disk is Premium, Premium v2, or Ultra. 

>[!NOTE]
>The maximum churn supported is 500 MB/s per VM, but the actual limit depends on the disk size and type of the source disks.  

## Enable High Churn support

### From Recovery Service Vault 

1. Select the source virtual machines on which you want to enable replication. To enable replication, follow the standard steps.

1. Under **Replication Settings** > **Storage**, select **View/edit storage configuration**. The **Customize target settings** page opens.
  
   :::image type="Replication settings" source="media/concepts-azure-to-azure-high-churn-support/replication-settings-storages.png" alt-text="Screenshot of Replication settings storage." lightbox="media/concepts-azure-to-azure-high-churn-support/replication-settings-storages.png":::

1. Under **Churn for the VM**, choose from two options: 

   - **Normal Churn** (this is the default option) - You get up to 54 MB/s per virtual machine. Normal Churn uses *Standard* storage accounts only for Cache Storage. Hence, the Cache storage dropdown lists only *Standard* storage accounts. 

   - **High Churn** - You get up to 500 MB/s per virtual machine (subject to the support matrix). High Churn uses *Premium Block Blob* storage accounts only for Cache Storage. Hence, the Cache storage dropdown lists only *Premium Block blob* storage accounts. 
   
      :::image type="Churn" source="media/concepts-azure-to-azure-high-churn-support/vm-churn-settings.png" alt-text="Screenshot of churn.":::


1. Select **High Churn** from the dropdown option.

   :::image type="High churn" source="media/concepts-azure-to-azure-high-churn-support/high-churn-new.png" alt-text="Screenshot of high-churn.":::
   
   If you select multiple source virtual machines and want to enable High Churn for all of them, select **High Churn** at the top level.

1. After you select High Churn, only *Premium Block Blob* options are available for the cache storage account. Select the cache storage account and then select **Confirm Selection**. 

   :::image type="Cache storage" source="media/concepts-azure-to-azure-high-churn-support/cache-storages.png" alt-text="Screenshot of Cache storage.":::

1. Configure other settings and enable the replication. 

### From Azure virtual machine screen 

1. In the portal, go to **Virtual machines** and select the virtual machine. 

1. On the left pane, under **Operations**, select **Disaster recovery**.
   
   :::image type="Disaster recovery" source="media/concepts-azure-to-azure-high-churn-support/disaster-recovery.png" alt-text="Screenshot of Disaster recovery page.":::

1. Under **Basics**, select the **Target region** and then select **Next: Advanced settings**. 

1. Under **Advanced settings**, select **Subscription**, **VM resource group**, **Virtual network**, **Availability**, and **Proximity placement group** as required.

1. Under **Advanced settings** > **Storage settings**, select **[+] Show details**.

   :::image type="Storage" source="media/concepts-azure-to-azure-high-churn-support/storage-show-details.png" alt-text="Screenshot of Storage show details.":::

1. Under **Storage settings** > **Churn for the VM**, select **High Churn**. You can use only Premium Block Blob storage accounts for cache storage. 
   
     :::image type="High churn" source="media/concepts-azure-to-azure-high-churn-support/churn-for-vms.png" alt-text="Screenshot of Churn for virtual machine.":::


1. Select **Next: Review + Start replication**.

>[!Note]
>- You can enable High Churn only when you enable replication while configuring Azure Site Recovery on a virtual machine. To switch an already-protected virtual machine between Normal Churn and High Churn, disable replication and enable it again with the required churn option.

## Cost implications  

- **High churn** uses *Premium Block Blob* storage accounts, which might cost more than the *Standard* storage accounts that **Normal churn** uses. For more information, see the [Azure Site Recovery pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).
- For high churn virtual machines, the replication process sends more data changes to the target compared to **Normal churn**. This might lead to higher network costs.

## Next steps

[Set up disaster recovery for Azure virtual machines](azure-to-azure-tutorial-enable-replication.md).
