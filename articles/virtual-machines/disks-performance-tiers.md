---
title: Create an incremental snapshot - Azure portal 
description: Learn about incremental snapshots for managed disks, including how to create them using the Azure portal.
author: roygara
ms.service: virtual-machines
ms.topic: how-to
ms.date: 08/13/2020
ms.author: rogarana
ms.subservice: disks
---

# Performance tiers for premium SSDs (preview)

Azure Disk Storage currently offers built-in bursting capabilities to achieve higher performance for handling short-term unexpected traffic. For an event like Black Friday, performance testing, running a training environment, you need to achieve consistently higher performance for a few days or hours and then return to the normal performance levels. On Premium SSDs, you now have the flexibility to temporarily increase the disk performance without increasing the disk size, allowing you to match workload performance needs and reduce costs.

A baseline performance tier is set based on your provisioned disk size. You can set a higher performance tier when your application requires this to meet higher demand and return to the initial baseline performance tier once this period is complete. For example, if you provision a P10 disk (128 GiB), your baseline performance tier is set as P10 (500 IOPS and 100 MB/s). You can update the tier to match the performance of P50 (7500 IOPS and 250 MB/s) without increasing the disk size and return to P10 when higher performance is no longer needed. 

| Disk size | Baseline performance tier | Can be upgraded to |
|----------------|-----|-------------------------------------|
| 4 GiB | P1 | P2, P3, P4, P6, P10, P15, P20, P30, P40, P50 |
| 8 GiB | P2 | P3, P4, P6, P10, P15, P20, P30, P40, P50 |
| 16 GiB | P3 | P4, P6, P10, P15, P20, P30, P40, P50 | 
| 32 GiB | P4 | P6, P10, P15, P20, P30, P40, P50 |
| 64 GiB | P6 | P10, P15, P20, P30, P40, P50 |
| 128 GiB | P10 | P15, P20, P30, P40, P50 |
| 256 GiB | P15 | P20, P30, P40, P50 |
| 512 GiB | P20 | P30, P40, P50 |
| 1 TiB | P30 | P40, P50 |
| 2 TiB | P40 | P50 |
| 4 TiB | P50 | None |
| 8 TiB | P60 |  P70, P80 |
| 16 TiB | P70 | P80 |
| 32 TiB | P80 | None |

## Prerequisite

You must get the feature enabled for your subscriptions before you can use performance tier. Please [sign up](https://aka.ms/perftiersignup) for access to our private preview.

## Regions supported

- West Central US 
- East 2 US 
- Europe West
- East Australia 
- South East Australia 
- South India

## Restrictions

- Disks should not be attached to running VMs while changing tier.
- You have to resize a disk to size greater than 4096 GiB to use P60, P70, P80 tiers. 

## Create/update a data disk with a tier higher than the baseline tier

1. Create an empty data disk with a tier higher than the baseline tier or update the tier of a disk higher than the baseline tier using the sample template [CreateUpdateDataDiskWithTier.json](https://github.com/Azure/azure-managed-disks-performance-tiers/blob/main/CreateUpdateDataDiskWithTier.json)

     ```cli
     subscriptionId=dd80b94e-0463-4a65-8d04-c94f403879dc
     resourceGroupName=perftiertesting
     diskName=myDataDiskwithperftier1
     diskSize=128
     performanceTier=P50
     region=EastUS2EUAP
    
     az login
    
     az account set --subscription $subscriptionId
    
     az group deployment create -g $resourceGroupName \
     --template-uri "https://raw.githubusercontent.com/Azure/azure-managed-disks-performance-tiers/main/CreateUpdateDataDiskWithTier.json" \
     --parameters "region=$region" "diskName=$diskName" "performanceTier=$performanceTier" "dataDiskSizeInGb=$diskSize"
     ```

1. Confirm the tier of the disk

    ```cli
    az resource show -n $diskName -g $resourceGroupName --namespace Microsoft.Compute --resource-type disks --api-version 2020-06-30 --query [properties.tier] -o tsv
     ```

## Create/update a OS disk with a tier higher than the baseline tier

1. Create an OS disk from a marketplace image or update the tier of a OS disk higher than the baseline tier using the sample template [CreateUpdateOSDiskWithTier.json](https://github.com/Azure/azure-managed-disks-performance-tiers/blob/main/CreateUpdateOSDiskWithTier.json)

     ```cli
     resourceGroupName=perftiertesting
     diskName=myOSdiskwithperftier1
     performanceTier=P30
     region=EastUS2EUAP
    
     az group deployment create -g $resourceGroupName \
     --template-uri "https://raw.githubusercontent.com/Azure/azure-managed-disks-performance-tiers/main/CreateUpdateOSDiskWithTier.json" \
     --parameters "region=$region" "diskName=$diskName" "performanceTier=$performanceTier"
     ```
 
 1. Confirm the tier of the disk
 
     ```cli
     az resource show -n $diskName -g $resourceGroupName --namespace Microsoft.Compute --resource-type disks --api-version 2020-06-30 --query [properties.tier] -o tsv
     ```