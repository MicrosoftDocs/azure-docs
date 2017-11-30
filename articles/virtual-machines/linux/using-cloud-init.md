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
This article shows you how to use [cloud-init](https://cloudinit.readthedocs.io) to configure on a virtual machine (VM) or virtual machine scale sets (VMSS) at provisioning time in Azure. These cloud-init scripts run on first boot once the resources have been provisioned by Azure. 

## Cloud-init overview
[Cloud-init](https://cloudinit.readthedocs.io) is a widely used approach to customize a Linux VM as it boots for the first time. You can use cloud-init to install packages and write files, or to configure users and security. Because cloud-init is called during the initial boot process, there are no additional steps or required agents to apply your configuration.  Please see the [cloud-init documentation site](http://cloudinit.readthedocs.io/en/latest/topics/format.html#cloud-config-data) for more details on how to properly format your `#cloud-config` files. 

Cloud-init also works across distributions. For example, you don't use **apt-get install** or **yum install** to install a package. Instead you can define a list of packages to install. Cloud-init automatically uses the native package management tool for the distro you select.

 We are actively working with our endorsed Linux distro partners in order to have cloud-init enabled images available in the Azure marketplace. This will make your cloud-init deployments and configurations work seamlessly with VMs and VM Scale Sets (VMSS). The following table outlines the current cloud-init availability on Azure platform images:

| Publisher | Offer | SKU | Version | cloud-init ready
|:--- |:--- |:--- |:--- |:--- |:--- |
|Canonical |UbuntuServer |16.04-LTS |latest |yes | 
|Canonical |UbuntuServer |14.04.5-LTS |latest |yes |
|CoreOS |CoreOS |Stable |latest |yes |
|OpenLogic |CentOS |7.4 |latest |preview |
|RedHat |RHEL |7.4 |latest |preview |

## What is the difference between cloud-init and the Linux Agent (WALA)?
WALA is an Azure platform specific agent used to provision and configure VMs, and handle Azure extensions. We are enhancing the task of configuring VMs to use cloud-init instead of the Linux Agent in order to allow existing cloud-init customers to leverage their current cloud-init scripts.  If you have existing investments in cloud-init scripts for configuring Linux systems, there are **no additional settings required** to enable them. 

If you do not include the AzureCLI command line switch `--custom-data` at provisioning time, WALA will take the minimal VM provisioning parameters required to provision the VM and complete the deployment with the defaults.  If you reference the cloud-init `--custom-data` switch, whatever is contained contained in your custom data (individual settings or full script) will override the WALA defined defaults. 

WALA configurations of VMs are time constrained to work within the maximum VM provisioning time.  Cloud-init configurations applied to VMs do not have time constraints and will not cause a deployment to fail by timing out. 

## Troubleshooting cloud-init
Once the VM has been provisioned, Cloud-init will run through all the modules and script defined in `--custom-data` in order to configure the VM.  If you need to troubleshoot any errors or omissions from the configuration, you will need to search for the module name (disk_setup or runcmd for example) in the cloud-init log - located in **/var/log/cloud-init.log**.

Please note: not every module failure results in a fatal cloud-init overall configuration failure. For example, using the 'runcmd' module, if the script fails, cloud-init will still report provisioning succeeded because the runcmd module executed.

For more details of cloud-init logging, please refer to the [cloud-init documentation](http://cloudinit.readthedocs.io/en/latest/topics/logging.html) 

## Next steps
For cloud-init examples of configuration changes, see the following:
 
- [Add an additional Linux user to a VM](cloudinit-add-user.md)
- [Run a package manager to update existing packages on first boot](cloudinit-update-vm.md)
- [Change VM local hostname](cloudinit-update-vm-hostname.md) 
- [Install an application package, update configuration files and inject keys](tutorial-automate-vm-deployment.md)