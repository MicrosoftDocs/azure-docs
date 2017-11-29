---
title: Use cloud-init to customize a Linux VM | Microsoft Docs
description: How to use cloud-init to customize a Linux VM during creation
services: virtual-machines-linux
documentationcenter: ''
author: rickstercdn
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 195c22cd-4629-4582-9ee3-9749493f1d72
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: azurecli
ms.topic: article
ms.date: 11/29/2017
ms.author: rclaus

---
# Use cloud-init to customize a Linux VM in Azure
This article shows you how to use [cloud-init](https://cloudinit.readthedocs.io) to set the hostname, update packages, and manage user accounts on a virtual machine (VM) in Azure. These cloud-init scripts run on boot when you create a VM with the Azure CLI 2.0. 

## Cloud-init overview
[Cloud-init](https://cloudinit.readthedocs.io) is a widely used approach to customize a Linux VM as it boots for the first time. You can use cloud-init to install packages and write files, or to configure users and security. As cloud-init runs during the initial boot process, there are no additional steps or required agents to apply your configuration.

Cloud-init also works across distributions. For example, you don't use **apt-get install** or **yum install** to install a package. Instead you can define a list of packages to install. Cloud-init automatically uses the native package management tool for the distro you select.

 We are actively working with our endorsed Linux distro partners in order to have cloud-init enabled images available in the Azure marketplace. This will make your cloud-init deployments and configurations work seamlessly with VMs and VM Scale Sets (VMSS). The following table outlines the current cloud-init availability on Azure platform images:

| Publisher | Offer | SKU | Version |
|:--- |:--- |:--- |:--- |:--- |
|Canonical |UbuntuServer |16.04-LTS |latest |
|Canonical |UbuntuServer |14.04.5-LTS |latest |
|CoreOS |CoreOS |Stable |latest |
|OpenLogic |CentOS |7.4 |latest |
|RedHat |RHEL |7.4 |latest |
|Oracle |Oracle-Linux |7.4 |latest |

## Next steps
Cloud-init is one of standard ways to modify your Linux VMs on boot. For a more in-depth overview on how to install applications, write configuration files, and inject keys from Key Vault, see [this tutorial](tutorial-automate-vm-deployment.md). 


