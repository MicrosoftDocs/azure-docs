---
title: Azure Virtual Machines disaster recovery - High Churn support
ms.reviewer: v-gajeronika
description: Describes how to protect your Azure Virtual Machines having high churning workloads.
author: Jeronika-MS
ms.service: azure-site-recovery
ms.topic: how-to
ms.date: 01/06/2026
ms.author: v-gajeronika
ms.custom: references_regions 
# Customer intent: As a cloud administrator, I want to enable High Churn support for Azure Virtual Machines, so that I can effectively protect high churning workloads and achieve better disaster recovery performance.
---

# Azure Virtual Machines disaster recovery - High Churn support 

Azure Site Recovery supports churn (data change rate) up to 100 MB/s per virtual machine. You'll  be able to protect your Azure virtual machines having high churning workloads (like databases) using the *High Churn* option in Azure Site Recovery, which supports churn up to 100 MB/s per virtual machine. You may be able to achieve better Recovery Point Objective performance for your high churning workloads. With the default Normal Churn option, you can [support churn only up to 54 MB/s per virtual machine](./azure-to-azure-support-matrix.md#limits-and-data-change-rates). 

>[!NOTE]
>Support beyond 100 MB/s is now in Preview, allowing data change up to 500 MB/s per VM in selected regions. [Learn more](#enhanced-churn-support-up-to-500-mbs-per-vm-preview). 

## Limitations 

- Available only for disaster recovery of Azure virtual machines. 
- Virtual machine SKUs with RAM of min 32 GB are recommended. 
- Source disks must be Managed Disks.

> [!NOTE]
> This feature is available in all [regions](azure-to-azure-support-matrix.md#region-support) where Azure Site Recovery is supported and [Premium Blob storage accounts](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=storage&regions=all&rar=true) are available. When using High Churn with any other regions outside the supported regions, replication and/or reprotection may fail.

## Data change limits

- These limits are based on our tests and don't cover all possible application I/O combinations. 
- Actual results may vary based on your app I/O mix. 
- There are two limits to consider:
    - per disk data, churn
    - per virtual machine data churn. 
- Limit per virtual machine data churn - 100 MB/s. 

The following table summarizes Site Recovery limits: 

|Replica Disk type  |Avg I/O Size|Avg Churn Supported|
|---|---|---|
|Standard  |8 KB|2 MB/s|
|Standard |16 KB|4 MB/s|
|Standard |24 KB|6 MB/s|
|Standard |32 KB and later |8 MB/s|
|Premium SSD with disk size 128 GiB or more |8 KB|10 MB/s|
|Premium SSD with disk size 128 GiB or more |16 KB|20 MB/s|
|Premium SSD with disk size 128 GiB or more |24 KB and later |30 MB/s|
|Premium SSD with disk size 512 GiB or more |8 KB|10 MB/s|
|Premium SSD with disk size 512 GiB or more |16 KB|20 MB/s|
|Premium SSD with disk size 512 GiB or more |24 KB and later |30 MB/s|
|Premium SSD with disk size 1TiB or more |8 KB|20 MB/s|
|Premium SSD with disk size 1TiB or more |16 KB|35 MB/s|
|Premium SSD with disk size 1TiB or more |24 KB and later |50 MB/s|

## Enable High Churn support

### From Recovery Service Vault 

1. Select source virtual machines on which you want to enable replication. To enable replication, follow the steps [here](./azure-to-azure-how-to-enable-replication.md).

2. Under **Replication Settings** > **Storage**, select **View/edit storage configuration**. The **Customize target settings** page opens.
  
   :::image type="Replication settings" source="media/concepts-azure-to-azure-high-churn-support/replication-settings-storages.png" alt-text="Screenshot of Replication settings storage." lightbox="media/concepts-azure-to-azure-high-churn-support/replication-settings-storages.png":::

3. Under **Churn for the VM**, there are two options: 

   - **Normal Churn** (this is the default option) - You can get up to 54 MB/s per virtual machine. Select Normal Churn to use *Standard* storage accounts only for Cache Storage. Hence, Cache storage dropdown lists only *Standard* storage accounts. 

   - **High Churn** - You can get up to 100 MB/s per virtual machine. Select High Churn to use *Premium Block Blob* storage accounts only for Cache Storage. Hence, Cache storage dropdown lists only *Premium Block blob* storage accounts. 
   
      :::image type="Churn" source="media/concepts-azure-to-azure-high-churn-support/vm-churn-settings.png" alt-text="Screenshot of churn.":::


4. Select **High Churn** from the dropdown option.

   :::image type="High churn" source="media/concepts-azure-to-azure-high-churn-support/high-churn-new.png" alt-text="Screenshot of high-churn.":::
   
   If you select multiple source virtual machines to configure Site Recovery and want to enable High Churn for all these virtual machines, select **High Churn** at the top level.

5. After you select High Churn for the virtual machine, you'll  see Premium Block Blob options only available for cache storage account. Select cache storage account and then select **Confirm Selection**. 

   :::image type="Cache storage" source="media/concepts-azure-to-azure-high-churn-support/cache-storages.png" alt-text="Screenshot of Cache storage.":::

6. Configure other settings and enable the replication. 

### From Azure virtual machine screen 

1. In the portal, go to **Virtual machines** and select the virtual machine. 

2. On the left pane, under **Operations**, select **Disaster recovery**.
   
   :::image type="Disaster recovery" source="media/concepts-azure-to-azure-high-churn-support/disaster-recovery.png" alt-text="Screenshot of Disaster recovery page.":::

3. Under **Basics**, select the **Target region** and then select **Next: Advanced settings**. 

4. Under **Advanced settings**, select **Subscription**, **VM resource group**, **Virtual network**, **Availability**, and **Proximity placement group** as required.

5. Under **Advanced settings** > **Storage settings**, select **[+] Show details**.

   :::image type="Storage" source="media/concepts-azure-to-azure-high-churn-support/storage-show-details.png" alt-text="Screenshot of Storage show details.":::

6. Under **Storage settings** > **Churn for the VM**, select **High Churn**. You are able to use Premium Block Blob type of storage accounts only for cache storage. 
   
     :::image type="High churn" source="media/concepts-azure-to-azure-high-churn-support/churn-for-vms.png" alt-text="Screenshot of Churn for virtual machine.":::


6. Select **Next: Review + Start replication**.

>[!Note]
>- You can only enable High Churn only when you enable replication while configuring Azure Site Recovery on a virtual machine.
>- If you want to enable High Churn support for virtual machines already protected by Azure Site Recovery, disable replication for those virtual machines and select **High Churn** while enabling replication again. Similarly, disable and enable replication again to switch back to **Normal Churn**.

## Cost implications  

- **High Churn** uses *Premium Block Blob* storage accounts, which may have higher cost implications as compared to **Normal Churn** which uses *Standard* storage accounts. For more information, see [pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).
- For High churn virtual machines, more data changes may get replicated to target for **High churn** compared to **Normal churn**. This may lead to more network cost.

## Enhanced Churn support up to 500 MB/s per VM (preview)

- **Enhanced Churn Support**: With Azure Site Recovery, you can now protect workloads with churn (data change) rates up to 250 MB/s per disk and up to 500 MB/s per VM. This allows increased flexibility, makes it easier to run high throughput, demanding workloads while ensuring their protection. 

- **Configuration**: Follows the [same process](/azure/site-recovery/concepts-azure-to-azure-high-churn-support#enable-high-churn-support) used to select the existing High Churn configuration. If your churn exceeds 100 MB/s, Azure Site Recovery can support it through this preview, provided it stays within 500 MB/s per VM. Premium Block Blob storage account is used for cache storage account. 

- **Updated Disk performance limits**: Based on the disk size of your replicated disks, the [supported churn](#updated-limits-by-source-disk-size-and-io-size) changes. 

### Support matrix 

- **Scenario**: This is only for Azure-to-Azure disaster recovery scenario. 
- **Region availability**: This capability is currently available in [selected Azure regions](#region-availability).
- **RAM**: Azure VM must have RAM of 256 GB or more to support churn up to 500 MB/s. If RAM is less than 256 GB, churn limit will be 100 MB/s. Site Recovery reserves up to 6.25% of RAM, maximum of 16 GB. 
- **Operating System**: Windows. Linux – RHEL 9, SLES 15, Ubuntu 24.04. 
- **Disk size**: Churn limit is based on [source disk type and size](#updated-limits-by-source-disk-size-and-io-size).
- **Networking and CPU** – Ensure there is enough networking and CPU on Azure VM for Site Recovery to be able to replicate data changes from the source.

>[!NOTE]
>If you already have an Azure VM protected using Azure Site Recovery High Churn option before this Preview, its churn limit will be 100 MB/s only even if it is meeting all support requirements. If you want to get churn support up to 500 MB/s (Preview), you need to disable Site Recovery and re-enable Site Recovery with **High Churn** option as documented [here](#enable-preview). 

#### Updated limits by Source disk size and IO size 

Source Disk must be of Premium v1 SSD or Premium v2 or Ultra disk type.

|**Source disk size (in GiB)**|**8 KB IO Size**|**16 KB IO Size**|**32 KB IO Size**|**64 KB IO Size**|**128KB IO Size**|**256 KB & More**|
|---|---|---|---|---|---|---|
|128|3.9 MB/s|7.8 MB/s|11.5 MB/s|33.1 MB/s|66.1 MB/s|100 MB/s|
|256|8.6 MB/s|17.2 MB/s|34.4 MB/s|68.8 MB/s|125 MB/s|125 MB/s|
|512|18.0 MB/s|35.9 MB/s|71.9 MB/s|143.8 MB/s|150 MB/s|150 MB/s|
|1,024|39.1 MB/s|78.1 MB/s|156.3 MB/s|200.0 MB/s|200 MB/s|200 MB/s|
|2,048|58.6 MB/s|117.2 MB/s|234.4 MB/s|250.0 MB/s|250 MB/s|250 MB/s|
|4,096|58.6 MB/s|117.2 MB/s|234.4 MB/s|250.0 MB/s|250 MB/s|250 MB/s|
|8,192|125.0 MB/s|250.0 MB/s|250 MB/s|250 MB/s|250 MB/s|250 MB/s|
|16,384|140.6 MB/s|250 MB/s|250 MB/s|250 MB/s|250 MB/s|250 MB/s|
|32,767|156.3 MB/s|250 MB/s|250 MB/s|250 MB/s|250 MB/s|250 MB/s|

>[!NOTE]
>The maximum churn supported in Public Preview is **500 MB/s per VM**, but actual limits depend on the disk size and type for the source disks. 

### Region availability

Source region and target region must be in the following regions only. 

Enhanced churn support for 500 MB/s is currently available in the following regions: 

- Australia East
- Australia Southeast
- Central India
- Central US
- East Asia
- East US 2
- France Central
- Germany North
- Japan East
- Japan West
- North Central US
- Norway East
- South Africa North
- South Central US
- Southeast Asia
- UAE Central
- UK South
- West Central US
- West US
- West US 2
- West US 3

### Enable preview 

Use the same configuration steps as documented [here](/azure/site-recovery/concepts-azure-to-azure-high-churn-support#enable-high-churn-support) and select High Churn. 

No additional setup is required for Preview; the feature is automatically enabled in the supported regions, if churn on Azure VM exceeds 100 MB/s and all support matrix requirements are met.  

The associated cost implications are detailed in [this section](#cost-implications).

## Next steps

[Set up disaster recovery for Azure virtual machines](azure-to-azure-tutorial-enable-replication.md).
