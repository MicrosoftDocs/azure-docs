---
title: Azure CLI Samples | Microsoft Docs
description: Azure CLI Samples
services: virtual-machine-scale-sets
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machine-scale-sets
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/27/2018
ms.author: cynthn
ms.custom: mvc

---
# Azure CLI samples for virtual machine scale sets

The following table includes links to bash scripts built using the Azure CLI.

| | |
|---|---|
|**Create and manage a scale set**||
| [Create a virtual machine scale set](scripts/cli-sample-create-simple-scale-set.md?toc=%2fcli%2fazure%2ftoc.json) | Creates a virtual machine scale set with minimal configuration. |
| [Create a scale set from a custom VM image](scripts/cli-sample-create-scale-set-from-custom-image.md?toc=%2fcli%2fmodule%2ftoc.json) | Creates a virtual machine scale set that uses a custom VM image. |
| [Install applications to a scale set](scripts/cli-sample-install-apps.md?toc=%2fcli%2fmodule%2ftoc.json) | Use the Azure Custom Script Extension to install a basic web application into a scale set. |
|**Manage storage**||
| [Create and attach disks to a scale set](scripts/cli-sample-attach-disks.md?toc=%2fcli%2fmodule%2ftoc.json) | Creates a virtual machine scale set with attached data disks. |
|**Manage scale and redundancy**||
| [Enable host-based autoscale](scripts/cli-sample-enable-autoscale.md?toc=%2fcli%2fazure%2ftoc.json) | Creates a virtual machine scale that is configured to automatically scale based on CPU usage. |
| [Create a single-zone scale set](scripts/cli-sample-single-availability-zone-scale-set.md?toc=%2fcli%2fazure%2ftoc.json) | Creates a virtual machine scale that uses a single Availability Zone. |
| [Create a zone-redundant scale set](scripts/cli-sample-zone-redundant-scale-set.md?toc=%2fcli%2fazure%2ftoc.json) | Creates a virtual machine scale across multiple Availability Zones. |
| | |