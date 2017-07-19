---
title: Use infrastructure automation tools for Linux VMs in Azure | Microsoft Docs
description: Learn how to use infrastructure automation tools such as Ansible, Chef, Puppet, Terraform, and Packer to create and manage Linux virtual machines in Azure
services: virtual-machines-linux
documentationcenter: virtual-machines
author: iainfoulds
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 07/18/2017
ms.author: iainfou
---

# Use infrastructure automation tools with your Linux virtual machines in Azure
To create and manage virtual machines (VMs) in a consistent manner at scale, some form of automation is typically desired. 


## Ansible
Ansible uses an agent-less model that leans on SSH keys to authenticate and manage target machines. Configuration tasks are defined in runbooks, with a number of Ansible modules available to carry out specific tasks. An Azure module exists for Ansible that allows you to build out a complete infrastructure, and then configure VMs to as desired.

Learn how to:
- [Install and configure Ansible for use with Azure](ansible-install-configure.md)
- [Create a basic VM](ansible-create-vm.md)
- [Create a complete VM environment including supporting resources](ansible-create-complete-vm.md).


## Chef
Chef clients are installed on a machine to allow Chef Server to run cookbooks that define the desired configuration of the Azure infrastructure and VMs. With Chef, you can define and build an entire Azure infrastructure, the configure your VMs.

Learn how to:

- [Chef Automate in the Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/chef-software.chef-automate?tab=Overview)
- [Install Chef and create Azure VMs](../windows/chef-automation.md).


## Puppet


## Packer
Packer automates the build process to create a custom VM image in Azure. You use Packer to define the OS and run post-configuration scripts that customize the VM for your specific needs. Once configured, the VM is then captured as a Managed Disk image. Packer automates the process to create the source VM, network and storage resources, run configuration scripts, and then create the VM image.

Learn how to:

- [Use Packer to create a VM image in Azure](build-image-with-packer.md).


## Terraform
Terraform is an automation tool that allows you to define and create an entire Azure infrastructure with a single template format - HashiCorp Configuration Language (HCL). With Terraform, you can define templates that automate the process to deploy network, storage, and VM resources for a given application solution.

Learn how to:
- [Install and configure Terraform with Azure](../terraform-install-configure.md) 
- [Create an Azure infrastructure with Terraform](../terraform-create-complete-vm.md).


## Cloud-init
[Cloud-init](https://cloudinit.readthedocs.io) is a widely used approach to customize a Linux VM as it boots for the first time. You can use cloud-init to install packages and write files, or to configure users and security. As cloud-init runs during the initial boot process, there are no additional steps or required agents to apply your configuration.

Cloud-init also works across distributions. For example, you don't use **apt-get install** or **yum install** to install a package. Instead you can define a list of packages to install and cloud-init automatically uses the native package management tool for the distro you select.

We are working with our partners to get cloud-init included and working in the images that they provide to Azure. The following table outlines the current cloud-init availability on Azure platform images:

| Alias | Publisher | Offer | SKU | Version |
|:--- |:--- |:--- |:--- |:--- |:--- |
| UbuntuLTS |Canonical |UbuntuServer |14.04.5-LTS |latest |
| UbuntuLTS |Canonical |UbuntuServer |16.04-LTS |latest |
| CoreOS |CoreOS |CoreOS |Stable |latest |

Learn how to:

- [Customize a Linux VM with cloud-init](tutorial-automate-vm-deployment.md)


## Azure Automation
Built in to Azure is the Automation service. As with other infrastructure automation tools, Azure Automation uses runbooks to process a set of tasks on the VMs you target. Unlike some of the other tools, Azure Automation targets existing resources rather than create an infrastructure. Azure Automation can run across both Linux and Windows VMs, as well as on-prem virtual or physical machines with a hybrid runbook worker. Runbooks can be stored in a source control repository, such as GitHub, and can be run manually or on a defined schedule.

Azure Automation also provides a Desired State Configuration (DSC) service that allows you to create definitions for how a given set of VMs should be configured, then ensure that configuration is applied and stays consistent. DSC runs on both Windows and Linux machines.

Learn how to:

- [Create a PowerShell runbook](../../automation/automation-first-runbook-textual-powershell.md)
- [Use Hybrid Runbook Worker to manage on-prem resources](../../automation/automation-hybrid-runbook-worker.md)
- [Use Azure Automation DSC](../../automation/automation-dsc-getting-started.md)

## Next steps