---
title: Azure VM Disaster Recovery - High Churn Support (Public Preview) 
description: Describes how to configure the failover of secondary IP configs for Azure VMs
services: site-recovery
author: v-pgaddala
manager: gaggupta
ms.service: site-recovery
ms.topic: conceptual
ms.date: 09/22/2022
ms.author: v-pgaddala

---

# Azure VM Disaster Recovery - High Churn Support (Public Preview) 

Azure Site Recovery now supports churn (data change rate) up to 100 MB/s per VM. This is currently in Public Preview. With this, you should be able to protect your Azure VMs having high churning workloads (like databases) using Azure Site Recovery which earlier could not be protected efficiently because Azure Site Recovery has churn limits up to 54 MB/s per VM. You may also be able to achieve better RPO performance as well for your high churning workloads. 

## Prerequisites 

- High Churn support is only available for DR of Azure VMs. 
- VM SKUs with RAM of min 32GB is recommended for this. 
- Source disks should be Managed Disks.
- This feature will only be available for source VMs in regions where Premium Blob storage accounts are available. Review supported regions for Premium Blob storage [here](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=storage&regions=all).

The following table summarizes Site Recovery limits. 

- These limits are based on our tests, but obviously don't cover all possible application I/O combinations. 
- Actual results can vary based on your app I/O mix. 
- There are two limits to consider, per disk data churn and per virtual machine data churn. 
- The current limit for per virtual machine data churn is 100 MB/s. 

|Target Disk Type|Avg I/O Size|Avg Churn Supported|
|---|---|---|
|Standard|8 KB|2 MB/s|
|Standard|16 KB|4 MB/s|
|Standard|24 KB|6 MB/s|
|Standard|32 KB and above|10 MB/s|
|P10 or P15|8 KB|2 MB/s|
|P10 or P15|16 KB|4 MB/s|
|P10 or P15|24 KB|6 MB/s|
|P10 or P15|32 KB and above|10 MB/s|
|P20|8 KB|10 MB/s|
|P20|16 KB|20 MB/s|
|P20|24 KB and above|30 MB/s|
|P30 and above|8 KB|20 MB/s|
|P30 and above|16 KB|35 MB/s|
|P30 and above|24 KB and above|50 MB/s|

## How to enable High Churn support 

### From Recovery Service Vault 

1. Select source VMs on which you want to enable replication. You can follow Enable Replication documentation to review the steps. 

2. Under **Replication Settings**, go to **Storage**, click on **View/edit storage configuration**. 

3. You will land up on **Customize target settings**.

4. Review **Churn for the VM** option. There are 2 options:  

**Normal Churn** (default option) - You can get up to 54 MB/s per VM. If you select Normal churn, you will be able to use Standard storage accounts only for Cache Storage.  Hence, Cache storage dropdown will only list down Standard storage accounts. 

**High Churn** - You can get up to 100 MB/s per VM. If you select this option, you will be able to use Premium Block Blob storage accounts only for Cache Storage. Hence, Cache storage dropdown will only list-down Premium Block blob storage accounts. 

5. Select **High Churn** option.

6. If you have selected multiple source VMs for configuring Site Recovery and want to enable High Churn for all these VMs in one step, you can select High Churn at the top level. This will select High Churn for all the VMs. 

7. Once you select **High Churn** for the VM, you will see Premium Block Blob options only available for cache storage account.  Select the cache storage account 

8. After selecting required target settings, click on **Confirm Selection**. 

9. Configure other settings and enable the replication. 

### From Azure VM screen 

1. In the portal, go to the virtual machine. 

2. On the left, under Operations, select Disaster Recovery 

3. From Basics, select the Target region. 

4. All the available Azure regions across the globe are displayed under the drop-down menu. Choose the target region as per your preference. 

5. Click Advanced Settings. 

6. Here you can select relevant **Target Subscription**, **Target Virtual Network**, **Target Availability**, **Target Proximity Placement Group**.

7. Go to **Storage** and click on **[+] Show Details**.

8. In **Churn of the VM** option, select High Churn. 

9. Once you select High Churn, You will be able to use Premium Block Blob type of of storage accounts only for cache storage. 

10. Click on **Review + Start Replication**.

>[!Note]
>High Churn can only be enabled during enable replication while configuring Azure Site Recovery on a VM. So, if you want to enable High Churn support for VMs already protected by Azure Site Recovery, you will need to disable replication for them and select **High Churn** while enabling replication again. Similarly, for switching back to **Normal Churn**, you will have to disable and enable replication again. 

## Cost Implications 

- When customers select **High Churn**, they may have cost implications because High Churn uses Premium Block Blob storage accounts as compared to Normal Churn option which uses Standard Page Blob storage accounts. Please review pricing [here](https://azure.microsoft.com/pricing/details/storage/blobs/).
- For High churning VMs, customers may see more data changes getting replicated to target with **High Churn** option as compared when they were using **Normal Churn** option. This may lead to more network egress cost.  

