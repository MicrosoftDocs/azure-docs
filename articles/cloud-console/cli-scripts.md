---
title: Azure Cloud Console sample scripts | Microsoft Docs
description: Listing of the samples for the Azure Cloud Console.
services: 
documentationcenter: ''
author: jluk
manager: timlt
tags: azure-resource-manager
 
ms.assetid: 
ms.service: 
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 03/09/2017
ms.author: juluk
---

# Linux CLI scripts

Our full repo of startup scripts for customization can be found here:

| | |
26
|---|---|
27
|**Create virtual machines**||
28
| [Create a virtual machine](../virtual-machines/scripts/virtual-machines-linux-cli-sample-create-vm-quick-create.md?toc=%2fazure%2fcloud-console%2ftoc.json) | Creates a Linux virtual machine with minimal configuration. |
29
| [Create a fully configured virtual machine](../virtual-machines/scripts/virtual-machines-linux-cli-sample-create-vm.md?toc=%2fazure%2fcloud-console%2ftoc.json) | Creates a resource group, virtual machine, and all related resources.|
30
| [Create highly available virtual machines](../virtual-machines/scripts/virtual-machines-linux-cli-sample-nlb.md?toc=%2fazure%2fcloud-console%2ftoc.json) | Creates several virtual machines in a highly available and load balanced configuration. |
31
| [Create a VM with Docker enabled](../virtual-machines/scripts/virtual-machines-linux-cli-sample-create-docker-host.md?toc=%2fazure%2fcloud-console%2ftoc.json) | Creates a virtual machine, configures this VM as a Docker host, and runs an NGINX container. |
32
| [Create a VM and run configuration script](../virtual-machines/scripts/virtual-machines-linux-cli-sample-create-vm-nginx.md?toc=%2fazure%2fcloud-console%2ftoc.json) | Creates a virtual machine and uses the Azure Custom Script extension to install NGINX. |
33
| [Create a VM with WordPress installed](../virtual-machines/scripts/virtual-machines-linux-cli-sample-create-vm-wordpress.md?toc=%2fazure%2fcloud-console%2ftoc.json) | Creates a virtual machine and uses the Azure Custom Script extension to install WordPress. |
34
|**Network virtual machines**||
35
| [Secure network traffic between virtual machines](../virtual-machines/scripts/virtual-machines-linux-cli-sample-create-vm-nsg.md?toc=%2fazure%2fcloud-console%2ftoc.json) | Creates two virtual machines, all related resources, and an internal and external network security groups (NSG). |
36
|**Monitor virtual machines**||
37
| [Monitor a VM with Operations Management Suite](../virtual-machines/scripts/virtual-machines-linux-cli-sample-create-vm-oms.md?toc=%2fazure%2fcloud-console%2ftoc.json) | Creates a virtual machine, installs the Operations Management Suite agent, and enrolls the VM in an OMS Workspace.  |
38
|**Troubleshoot virtual machines**||
39
| [Troubleshoot a VMs operating system disk](../virtual-machines/scripts/virtual-machines-linux-cli-sample-mount-os-disk.md?toc=%2fazure%2fcloud-console%2ftoc.json) | Mounts the operating system disk from one VM as a data disk on a second VM. |
40
| | |


## Next Steps
- [ACC Quickstart](acc-quickstart.md) 