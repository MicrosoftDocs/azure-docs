---
title: Azure Virtual Machines disaster recovery - High Churn support
description: Describes how to protect your Azure Virtual Machines having high churning workloads.
services: site-recovery
author: ankitaduttaMSFT
ms.service: site-recovery
ms.topic: conceptual
ms.date: 05/23/2024
ms.author: ankitadutta
---

# Azure Virtual Machines disaster recovery - High Churn support 

Azure Site Recovery supports churn (data change rate) up to 100 MB/s per virtual machine. You'll  be able to protect your Azure virtual machines having high churning workloads (like databases) using the *High Churn* option in Azure Site Recovery, which supports churn up to 100 MB/s per virtual machine. You may be able to achieve better Recovery Point Objective performance for your high churning workloads. With the default Normal Churn option, you can [support churn only up to 54 MB/s per virtual machine](./azure-to-azure-support-matrix.md#limits-and-data-change-rates). 

## Limitations

- Available only for disaster recovery of Azure virtual machines. 
- Virtual machine SKUs with RAM of min 32 GB are recommended. 
- Source disks must be Managed Disks.

> [!NOTE]
> This feature is available in all [public regions](./azure-to-azure-support-matrix.md#region-support) where Azure Site Recovery is supported and premium block blobs are available. However, this feature is not yet available in any Government cloud regions.
> When using High Churn with any other regions outside the supported regions, replication and/or reprotection may fail.

## Data change limits

- These limits are based on our tests and don't cover all possible application I/O combinations. 
- Actual results may vary based on your app I/O mix. 
- There are two limits to consider:
    - per disk data, churn
    - per virtual machine data churn. 
- Limit per virtual machine data churn - 100 MB/s. 

The following table summarizes Site Recovery limits: 

|Target Disk Type|Avg I/O Size|Avg Churn Supported|
|---|---|---|
|Standard or P10 or P15 |8 KB|2 MB/s|
|Standard or P10 or P15|16 KB|4 MB/s|
|Standard or P10 or P15|24 KB|6 MB/s|
|Standard or P10 or P15|32 KB and later |10 MB/s|
|P20|8 KB|10 MB/s|
|P20 |16 KB|20 MB/s|
|P20|24 KB and later|30 MB/s|
|P30 and later|8 KB|20 MB/s|
|P30 and later|16 KB|35 MB/s|
|P30 and later|24 KB and later|50 MB/s|

## How to enable High Churn support

### From Recovery Service Vault 

1. Select source virtual machines on which you want to enable replication. To enable replication, follow the steps [here](./azure-to-azure-how-to-enable-replication.md).

2. Under **Replication Settings** > **Storage**, select **View/edit storage configuration**. The **Customize target settings** page opens.
  
   :::image type="Replication settings" source="media/concepts-azure-to-azure-high-churn-support/replication-settings-storages.png" alt-text="Screenshot of Replication settings storage." lightbox="media/concepts-azure-to-azure-high-churn-support/replication-settings-storages.png":::

3. Under **Churn for the VM**, there are two options: 

   - **Normal Churn** (this is the default option) - You can get up to 54 MB/s per virtual machine. Select Normal Churn to use *Standard* storage accounts only for Cache Storage. Hence, Cache storage dropdown lists only *Standard* storage accounts. 

   - **High Churn** - You can get up to 100 MB/s per virtual machine. Select High Churn to use *Premium Block Blob* storage accounts only for Cache Storage. Hence, Cache storage dropdown lists only *Premium Block blob* storage accounts. 
   
      :::image type="Churn" source="media/concepts-azure-to-azure-high-churn-support/churns.png" alt-text="Screenshot of churn.":::


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

## Cost Implications  

- **High Churn** uses *Premium Block Blob* storage accounts, which may have higher cost implications as compared to **Normal Churn** which uses *Standard* storage accounts. For more information, see [pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).
- For High churn virtual machines, more data changes may get replicated to target for **High churn** compared to **Normal churn**. This may lead to more network cost.

## Next steps

[Set up disaster recovery for Azure virtual machines](azure-to-azure-tutorial-enable-replication.md).