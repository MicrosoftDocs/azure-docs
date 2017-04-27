---
title: Azure CLI Samples | Microsoft Docs
description: Azure CLI Samples
services: virtual-machines-linux
documentationcenter: virtual-machines
author: neilpeterson
manager: timlt
editor: tysonn
tags: azure-service-management

ms.assetid:
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 03/08/2017
ms.author: nepeters

---
# Azure CLI Samples for Linux virtual machines

The following table includes links to bash scripts built using the Azure CLI.

| | |
|---|---|
|**Create virtual machines**||
| [Create a virtual machine](./../scripts/virtual-machines-linux-cli-sample-create-vm-quick-create.md?toc=%2fcli%2fazure%2ftoc.json) | Creates a Linux virtual machine with minimal configuration. |
| [Create a fully configured virtual machine](./../scripts/virtual-machines-linux-cli-sample-create-vm.md?toc=%2fcli%2fazure%2ftoc.json) | Creates a resource group, virtual machine, and all related resources.|
| [Create highly available virtual machines](./../scripts/virtual-machines-linux-cli-sample-nlb.md?toc=%2fcli%2fazure%2ftoc.json) | Creates several virtual machines in a highly available and load balanced configuration. |
| [Create a VM with Docker enabled](./../scripts/virtual-machines-linux-cli-sample-create-docker-host.md?toc=%2fcli%2fazure%2ftoc.json) | Creates a virtual machine, configures this VM as a Docker host, and runs an NGINX container. |
| [Create a VM and run configuration script](./../scripts/virtual-machines-linux-cli-sample-create-vm-nginx.md?toc=%2fcli%2fazure%2ftoc.json) | Creates a virtual machine and uses the Azure Custom Script extension to install NGINX. |
| [Create a VM with WordPress installed](./../scripts/virtual-machines-linux-cli-sample-create-vm-wordpress.md?toc=%2fcli%2fazure%2ftoc.json) | Creates a virtual machine and uses the Azure Custom Script extension to install WordPress. |
|**Network virtual machines**||
| [Secure network traffic between virtual machines](./../scripts/virtual-machines-linux-cli-sample-create-vm-nsg.md?toc=%2fcli%2fazure%2ftoc.json) | Creates two virtual machines, all related resources, and an internal and external network security groups (NSG). |
|**Monitor virtual machines**||
| [Monitor a VM with Operations Management Suite](./../scripts/virtual-machines-linux-cli-sample-create-vm-oms.md?toc=%2fcli%2fazure%2ftoc.json) | Creates a virtual machine, installs the Operations Management Suite agent, and enrolls the VM in an OMS Workspace.  |
|**Troubleshoot virtual machines**||
| [Troubleshoot a VMs operating system disk](./../scripts/virtual-machines-linux-cli-sample-mount-os-disk.md?toc=%2fcli%2fazure%2ftoc.json) | Mounts the operating system disk from one VM as a data disk on a second VM. |
| | |
