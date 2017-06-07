---
title: Using Managed Disks With Azure Virtual Machine Scale Sets | Microsoft Docs
description: Learn why and how to use managed disks with virtual machine scale sets
services: virtual-machine-scale-sets
documentationcenter: ''
author: gatneil
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 76ac7fd7-2e05-4762-88ca-3b499e87906e
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 6/01/2017
ms.author: negat

---
# Azure VM scale sets and managed disks

Azure [virtual machine scale sets](/azure/virtual-machine-scale-sets/) now support virtual machines with managed disks. Using managed disks with scale sets has several benefits, including:

* You no longer need to pre-create and manage storage accounts to store the OS disks for the scale set VMs.

* You can attach managed data disks to the scale set.

* With managed disk, a scale set can have capacity as high as 1,000 VMs if based on a platform image or 100 VMs if based on a custom image.

## Get started

A simple way to get started with managed disk scale sets is to deploy one from the Azure portal. For more information, see [this article](./virtual-machine-scale-sets-portal-create.md). Another simple way to get started is to use [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-az-cli2) to deploy a scale set. The following example shows how to create an Ubuntu based scale set with 10 VMs, each with a 50-GB and 100-GB data disk:

```azurecli
az group create -l southcentralus -n dsktest
az vmss create -g dsktest -n dskvmss --image ubuntults --instance-count 10 --data-disk-sizes-gb 50 100
```

Alternatively, you could look in the [Azure Quickstart Templates GitHub repo](https://github.com/Azure/azure-quickstart-templates) for folders that contain `vmss` to see pre-built examples of templates that deploy scale sets. To tell which templates are already using managed disks, you can refer to [this list](https://github.com/Azure/azure-quickstart-templates/blob/master/managed-disk-support-list.md).

## API versions

Scale sets with managed disks requires a Microsoft.Compute APi version of `2016-04-30-preview` or later. Scale sets with unmanaged disks will continue to work as they currently do, even in new API versions that have support for managed disk. However, scale sets with unmanaged disks will not get the benefits of managed disks, even in these new api versions.

## Next steps

To find more information on managed disks in general, see [this article](../storage/storage-managed-disks-overview.md).

To see how to convert a Resource Manager template to provision scale sets with managed disks, see [this article](./virtual-machine-scale-sets-convert-template-to-md.md). The same modifications to the Resource Manager templates apply to the Azure REST API as well.

To learn more about using managed data disks with scale sets, see [this article](./virtual-machine-scale-sets-attached-disks.md).

To begin working with large scale sets, refer to [this article](./virtual-machine-scale-sets-placement-groups.md).


