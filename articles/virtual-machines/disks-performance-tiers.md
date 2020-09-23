---
title: Boost Azure managed disk performance
description: Learn about performance tiers for managed disks, as well as how to upgrade performance tiers for your managed disks.
author: roygara
ms.service: virtual-machines
ms.topic: how-to
ms.date: 09/22/2020
ms.author: rogarana
ms.subservice: disks
ms.custom: references_regions
---

# Performance tiers for managed disks (preview)

Azure Disk Storage currently offers built-in bursting capabilities to achieve higher performance for handling short-term unexpected traffic. Premium SSDs have the flexibility to increase disk performance without increasing the actual disk size, allowing you to match your workload performance needs and reduce costs, this feature is currently in preview. This is ideal for events that temporarily require a consistently higher level of performance, such as holiday shopping, performance testing, or running a training environment. To handle these events, you can select a higher performance tier as long as necessary, and return to the original tier when the additional performance is no longer necessary.

## How it works

When you first deploy or provision a disk, the baseline performance tier for that disk is set based on the provisioned disk size. A higher performance tier can be selected to meet higher demand and, when that performance is no longer required, you can return to the initial baseline performance tier. For example, if you provision a P10 disk (128 GiB), your baseline performance tier is set as P10 (500 IOPS and 100 MB/s). You can update the tier to match the performance of P50 (7500 IOPS and 250 MB/s) without increasing the disk size and return to P10 when the higher performance is no longer needed.

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

## Restrictions

- Currently only supported for premium SSDs.
- Disks must be detached from a running VM before changing tiers.
- Use of the P60, P70, and P80 performance tiers is restricted to disks of 4096 GiB or greater.

## Regional availability

Adjusting the performance tier of a managed disk is currently only available to premium SSDs in the following regions:

- West Central US 

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

If you must resize a disk in order to take advantage of the larger performance tiers, see our articles on the subject:

- [Expand virtual hard disks on a Linux VM with the Azure CLI](linux/expand-disks.md)
- [Expand a managed disk attached to a Windows virtual machine](windows/expand-os-disk.md)
