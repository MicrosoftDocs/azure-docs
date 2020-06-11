---
title: Overview of Linux VMs in Azure 
description: Overview of Linux virtual machines in Azure.
author: cynthn
ms.service: virtual-machines-linux
ms.topic: overview
ms.workload: infrastructure
ms.date: 11/14/2019
ms.author: cynthn
ms.custom: mvc
---

# Linux virtual machines in Azure

Azure Virtual Machines (VM) is one of several types of [on-demand, scalable computing resources](/azure/architecture/guide/technology-choices/compute-decision-tree) that Azure offers. Typically, you choose a VM when you need more control over the computing environment than the other choices offer. This article gives you information about what you should consider before you create a VM, how you create it, and how you manage it.

An Azure VM gives you the flexibility of virtualization without having to buy and maintain the physical hardware that runs it. However, you still need to maintain the VM by performing tasks, such as configuring, patching, and installing the software that runs on it.

Azure virtual machines can be used in various ways. Some examples are:

* **Development and test** – Azure VMs offer a quick and easy way to create a computer with specific configurations required to code and test an application.
* **Applications in the cloud** – Because demand for your application can fluctuate, it might make economic sense to run it on a VM in Azure. You pay for extra VMs when you need them and shut them down when you don’t.
* **Extended datacenter** – Virtual machines in an Azure virtual network can easily be connected to your organization’s network.

The number of VMs that your application uses can scale up and out to whatever is required to meet your needs.

## What do I need to think about before creating a VM?
There are always a multitude of [design considerations](https://docs.microsoft.com/azure/architecture/reference-architectures/n-tier/windows-vm) when you build out an application infrastructure in Azure. These aspects of a VM are important to think about before you start:

* The names of your application resources
* The location where the resources are stored
* The size of the VM
* The maximum number of VMs that can be created
* The operating system that the VM runs
* The configuration of the VM after it starts
* The related resources that the VM needs

### Locations
All resources created in Azure are distributed across multiple [geographical regions](https://azure.microsoft.com/regions/) around the world. Usually, the region is called **location** when you create a VM. For a VM, the location specifies where the virtual hard disks are stored.

This table shows some of the ways you can get a list of available locations.

| Method | Description |
| --- | --- |
| Azure portal |Select a location from the list when you create a VM. |
| Azure PowerShell |Use the [Get-AzLocation](https://docs.microsoft.com/powershell/module/az.resources/get-azlocation) command. |
| REST API |Use the [List locations](https://docs.microsoft.com/rest/api/resources/subscriptions) operation. |
| Azure CLI |Use the [az account list-locations](https://docs.microsoft.com/cli/azure/account?view=azure-cli-latest) operation. |

## Availability
Azure announced an industry leading single instance virtual machine Service Level Agreement of 99.9% provided you deploy the VM with premium storage for all disks.  In order for your deployment to qualify for the standard 99.95% VM Service Level Agreement, you still need to deploy two or more VMs running your workload inside of an availability set. An availability set ensures that your VMs are distributed across multiple fault domains in the Azure data centers as well as deployed onto hosts with different maintenance windows. The full [Azure SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/) explains the guaranteed availability of Azure as a whole.

## VM Size
The [size](sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) of the VM that you use is determined by the workload that you want to run. The size that you choose then determines factors such as processing power, memory, and storage capacity. Azure offers a wide variety of sizes to support many types of uses.

Azure charges an [hourly price](https://azure.microsoft.com/pricing/details/virtual-machines/linux/) based on the VM’s size and operating system. For partial hours, Azure charges only for the minutes used. Storage is priced and charged separately.

## VM Limits
Your subscription has default [quota limits](../../azure-resource-manager/management/azure-subscription-service-limits.md) in place that could impact the deployment of many VMs for your project. The current limit on a per subscription basis is 20 VMs per region. Limits can be raised by [filing a support ticket requesting an increase](../../azure-portal/supportability/resource-manager-core-quotas-request.md)

## Managed Disks

Managed Disks handles Azure Storage account creation and management in the background for you, and ensures that you do not have to worry about the scalability limits of the storage account. You specify the disk size and the performance tier (Standard or Premium), and Azure creates and manages the disk. As you add disks or scale the VM up and down, you don't have to worry about the storage being used. If you're creating new VMs, [use the Azure CLI](quick-create-cli.md) or the Azure portal to create VMs with Managed OS and data disks. If you have VMs with unmanaged disks, you can [convert your VMs to be backed with Managed Disks](convert-unmanaged-to-managed-disks.md).

You can also manage your custom images in one storage account per Azure region, and use them to create hundreds of VMs in the same subscription. For more information about Managed Disks, see the [Managed Disks Overview](../linux/managed-disks-overview.md).

## Distributions 
Microsoft Azure supports running a number of popular Linux distributions provided and maintained by a number of partners.  You can find distributions such as Red Hat Enterprise, CentOS, SUSE Linux Enterprise, Debian, Ubuntu, CoreOS, RancherOS, FreeBSD, and more in the Azure Marketplace. Microsoft actively works with various Linux communities to add even more flavors to the [Azure endorsed Linux Distros](endorsed-distros.md) list.

If your preferred Linux distro of choice is not currently present in the gallery, you can "Bring your own Linux" VM by [creating and uploading a Linux VHD in Azure](create-upload-generic.md).

Microsoft works closely with partners to ensure the images available are updated and optimized for an Azure runtime.  For more information on Azure partners, see the following links:

* Linux on Azure - [Endorsed Distributions](endorsed-distros.md)
* SUSE - [Azure Marketplace - SUSE Linux Enterprise Server](https://azuremarketplace.microsoft.com/marketplace/apps?search=suse%20sles&page=1)
* Red Hat - [Azure Marketplace - Red Hat Enterprise Linux 8.1](https://azuremarketplace.microsoft.com/marketplace/apps/RedHat.RedHatEnterpriseLinux81-ARM)
* Canonical - [Azure Marketplace - Ubuntu Server](https://azuremarketplace.microsoft.com/marketplace/apps/Canonical.UbuntuServer)
* Debian - [Azure Marketplace - Debian 8 "Jessie"](https://azuremarketplace.microsoft.com/marketplace/apps/credativ.debian)
* FreeBSD - [Azure Marketplace - FreeBSD 10.4](https://azuremarketplace.microsoft.com/marketplace/apps/Microsoft.FreeBSD104)
* CoreOS - [Azure Marketplace - Container Linux by CoreOS](https://azuremarketplace.microsoft.com/marketplace/apps/CoreOS.CoreOS)
* RancherOS - [Azure Marketplace - RancherOS](https://azuremarketplace.microsoft.com/marketplace/apps/rancher.rancheros)
* Bitnami - [Bitnami Library for Azure](https://azure.bitnami.com/)
* Mesosphere - [Azure Marketplace - Mesosphere DC/OS on Azure](https://azure.microsoft.com/services/kubernetes-service/mesosphere/)
* Docker - [Azure Marketplace - Docker images](https://azuremarketplace.microsoft.com/marketplace/apps?search=docker&page=1&filters=virtual-machine-images)
* Jenkins - [Azure Marketplace - CloudBees Jenkins Platform](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/cloudbees.cloudbees-core-contact)


## Cloud-init 

To achieve a proper DevOps culture, all infrastructure must be code.  When all the infrastructure lives in code it can easily be recreated.  Azure works with all the major automation tooling like Ansible, Chef, SaltStack, and Puppet.  Azure also has its own tooling for automation:

* [Azure Templates](create-ssh-secured-vm-from-template.md)
* [Azure VMAccess](using-vmaccess-extension.md)

Azure supports for [cloud-init](https://cloud-init.io/) across most Linux Distros that support it.  We are actively working with our endorsed Linux distro partners in order to have cloud-init enabled images available in the Azure marketplace. These images will make your cloud-init deployments and configurations work seamlessly with VMs and virtual machine scale sets.

* [Using cloud-init on Azure Linux VMs](using-cloud-init.md)

## Storage
* [Introduction to Microsoft Azure Storage](../../storage/common/storage-introduction.md)
* [Add a disk to a Linux VM using the azure-cli](add-disk.md)
* [How to attach a data disk to a Linux VM in the Azure portal](attach-disk-portal.md)

## Networking
* [Virtual Network Overview](../../virtual-network/virtual-networks-overview.md)
* [IP addresses in Azure](../../virtual-network/public-ip-addresses.md)
* [Opening ports to a Linux VM in Azure](nsg-quickstart.md)
* [Create a Fully Qualified Domain Name in the Azure portal](portal-create-fqdn.md)


## Next steps

Create your first VM!

- [Portal](quick-create-portal.md)
- [Azure CLI](quick-create-cli.md)
- [PowerShell](quick-create-powershell.md)

