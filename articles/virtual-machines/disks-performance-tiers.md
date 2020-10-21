---
title: Change the performance of Azure managed disks
description: Learn about performance tiers for managed disks, and learn how to change performance tiers for existing managed disks.
author: roygara
ms.service: virtual-machines
ms.topic: how-to
ms.date: 09/24/2020
ms.author: rogarana
ms.subservice: disks
ms.custom: references_regions
---

# Performance tiers for managed disks (preview)

Azure Disk Storage currently offers built-in bursting capabilities to provide higher performance for handling short-term unexpected traffic. Premium SSDs have the flexibility to increase disk performance without increasing the actual disk size. This capability allows you to match your workload performance needs and reduce costs. 

> [!NOTE]
> This feature is currently in preview. 

This feature is ideal for events that temporarily require a consistently higher level of performance, like holiday shopping, performance testing, or running a training environment. To handle these events, you can use a higher performance tier for as long as you need it. You can then return to the original tier when you no longer need the additional performance.

## How it works

When you first deploy or provision a disk, the baseline performance tier for that disk is set based on the provisioned disk size. You can use a higher performance tier to meet higher demand. When you no longer need that performance level, you can return to the initial baseline performance tier.

Your billing changes as your tier changes. For example, if you provision a P10 disk (128 GiB), your baseline performance tier is set as P10 (500 IOPS and 100 MBps). You'll be billed at the P10 rate. You can upgrade the tier to match the performance of P50 (7,500 IOPS and 250 MBps) without increasing the disk size. During the time of the upgrade, you'll be billed at the P50 rate. When you no longer need the higher performance, you can return to the P10 tier. The disk will once again be billed at the P10 rate.

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

For billing information, see [Managed disk pricing](https://azure.microsoft.com/pricing/details/managed-disks/).

## Restrictions

- This feature is currently supported only for premium SSDs.
- You must detach your disk from a running VM before you can change the disk's tier.
- Use of the P60, P70, and P80 performance tiers is restricted to disks of 4,096 GiB or higher.
- A disk's performance tier can be changed only once every 24 hours.

## Regional availability

The ability to adjust the performance tier of a managed disk is currently available only on premium SSDs in the East US 2, South Central US, West Central US, Australia South East regions.

## Create an empty data disk with a tier higher than the baseline tier

```azurecli
subscriptionId=<yourSubscriptionIDHere>
resourceGroupName=<yourResourceGroupNameHere>
diskName=<yourDiskNameHere>
diskSize=<yourDiskSizeHere>
performanceTier=<yourDesiredPerformanceTier>
region=westcentralus

az login

az account set --subscription $subscriptionId

az disk create -n $diskName -g $resourceGroupName -l $region --sku Premium_LRS --size-gb $diskSize --tier $performanceTier
```
## Create an OS disk with a tier higher than the baseline tier from an Azure Marketplace image

```azurecli
resourceGroupName=<yourResourceGroupNameHere>
diskName=<yourDiskNameHere>
performanceTier=<yourDesiredPerformanceTier>
region=westcentralus
image=Canonical:UbuntuServer:18.04-LTS:18.04.202002180

az disk create -n $diskName -g $resourceGroupName -l $region --image-reference $image --sku Premium_LRS --tier $performanceTier
```
     
## Update the tier of a disk

```azurecli
resourceGroupName=<yourResourceGroupNameHere>
diskName=<yourDiskNameHere>
performanceTier=<yourDesiredPerformanceTier>

az disk update -n $diskName -g $resourceGroupName --set tier=$performanceTier
```
## Show the tier of a disk

```azurecli
az disk show -n $diskName -g $resourceGroupName --query [tier] -o tsv
```

## Next steps

If you need to resize a disk to take advantage of the higher performance tiers, see these articles:

- [Expand virtual hard disks on a Linux VM with the Azure CLI](linux/expand-disks.md)
- [Expand a managed disk attached to a Windows virtual machine](windows/expand-os-disk.md)
