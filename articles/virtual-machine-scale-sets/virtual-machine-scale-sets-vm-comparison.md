---
title: Azure virtual machine scale sets vs. virtual machines | Microsoft Docs
description: Learn about the difference between Azure virtual machine scale sets and virtual machines
services: virtual-machine-scale-sets
documentationcenter: ''
author: gatneil
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: na
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/06/2017
ms.author: negat
ms.custom: na

---
# How do virtual machine scale sets differ from virtual machines in Azure?
Virtual machine scale sets have similar configuration and behavior to VMs. However, some features are only available in scale sets while other features are only available in VMs. Let's take a look at features that are available in scale sets but not VMs:

## Scale set specific features

- Once you specify the scale set configuration, you can simply update the "capacity" property to deploy more VMs in parallel. This is much simpler than writing a script to orchestrate deploying lots of individual VMs in parallel.
- You can [use Azure Autoscale to automatically scale VM scale sets](./virtual-machine-scale-sets-autoscale-overview.md) but not individual VMs.
- You can [reimage scale set VMs](https://docs.microsoft.com/rest/api/virtualmachinescalesets/manage-a-vm) but [not individual VMs](https://docs.microsoft.com/rest/api/compute/virtualmachines).
- You can [overprovision](./virtual-machine-scale-sets-design-overview.md) scale set VMs for increase reliability and quicker deployment times. You cannot do this with individual VMs unless you write custom code to do this.
- You can specify an [upgrade policy](./virtual-machine-scale-sets-upgrade-scale-set.md) to make it easy to roll out upgrades across VMs in your scale set. With individual VMs, you must worry about orchestrating updates yourself.

## VM specific features

On the other hand, some features are only available in VMs (at least for the time being):

- You can attach data disks to specific individual VMs but not specific VMs in a scale set.
- You can attach non-empty data disks to individual VMs but not VMs in a scale set.
- You can snapshot an individual VM but not a VM in a scale set.
- You can capture an image from an individual VM but not from a VM in a scale set.
- You can migrate an individual VM from native disks to managed disks, but you cannot do this for VMs in a scale set.
- You can assign IPv6 public IP addresses to individual VM nics but cannot do so for VMs in a scale set.