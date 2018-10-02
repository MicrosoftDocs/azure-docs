---
title: Overview of Linux VMs in Azure | Microsoft Docs
description: Describes Azure Compute, Storage, and Networking services with Linux virtual machines.
services: virtual-machines-linux
documentationcenter: virtual-machines-linux
author: rickstercdn
manager: jeconnoc
editor: ''

ms.assetid: 7965a80f-ea24-4cc2-bc43-60b574101902
ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: overview
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 11/29/2017
ms.author: rclaus
ms.custom: H1Hack27Feb2017, mvc
---

# Azure and Linux
Microsoft Azure is a growing collection of integrated public cloud services including analytics, virtual machines, databases, mobile, networking, storage, and web&mdash;ideal for hosting your solutions.  Microsoft Azure provides a scalable computing platform that allows you to only pay for what you use, when you want it - without having to invest in on-premises hardware.  Azure is ready when you are to scale your solutions up and out to whatever scale you require to service the needs of your clients.

If you are familiar with the various features of Amazon's AWS, you can examine the Azure vs AWS [definition mapping document](https://azure.microsoft.com/campaigns/azure-vs-aws/mapping/).

## Regions
Microsoft Azure resources are distributed across multiple geographical regions around the world.  A "region" represents multiple data centers in a single geographical area. Azure currently (as of August 2018) has 42 regions generally available around the world with an additional 12 regions announced - more global regions than any other cloud provider. An updated list of existing and newly announced regions can be found in the following page:

* [Azure Regions](https://azure.microsoft.com/regions/)

## Availability
Azure announced an industry leading single instance virtual machine Service Level Agreement of 99.9% provided you deploy the VM with premium storage for all disks.  In order for your deployment to qualify for the standard 99.95% VM Service Level Agreement, you still need to deploy two or more VMs running your workload inside of an availability set. An availability set ensures that your VMs are distributed across multiple fault domains in the Azure data centers as well as deployed onto hosts with different maintenance windows. The full [Azure SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/) explains the guaranteed availability of Azure as a whole.

## Managed Disks

Managed Disks handles Azure Storage account creation and management in the background for you, and ensures that you do not have to worry about the scalability limits of the storage account. You specify the disk size and the performance tier (Standard or Premium), and Azure creates and manages the disk. As you add disks or scale the VM up and down, you don't have to worry about the storage being used. If you're creating new VMs, [use the Azure CLI](quick-create-cli.md) or the Azure portal to create VMs with Managed OS and data disks. If you have VMs with unmanaged disks, you can [convert your VMs to be backed with Managed Disks](convert-unmanaged-to-managed-disks.md).

You can also manage your custom images in one storage account per Azure region, and use them to create hundreds of VMs in the same subscription. For more information about Managed Disks, see the [Managed Disks Overview](../linux/managed-disks-overview.md).

## Azure Virtual Machines & Instances
Microsoft Azure supports running a number of popular Linux distributions provided and maintained by a number of partners.  You can find distributions such as Red Hat Enterprise, CentOS, SUSE Linux Enterprise, Debian, Ubuntu, CoreOS, RancherOS, FreeBSD, and more in the Azure Marketplace. Microsoft actively works with various Linux communities to add even more flavors to the [Azure endorsed Linux Distros](endorsed-distros.md) list.

If your preferred Linux distro of choice is not currently present in the gallery, you can "Bring your own Linux" VM by [creating and uploading a Linux VHD in Azure](create-upload-generic.md).

Azure virtual machines allow you to deploy a wide range of computing solutions in an agile way. You can deploy virtually any workload and any language on nearly any operating system - Windows, Linux, or a custom created one from any one of the growing list of partners. Still don't see what you are looking for?  Don't worry - you can also bring your own images from on-premises.

## VM Sizes
The [size](sizes.md) of the VM that you use is determined by the workload that you want to run. The size that you choose then determines factors such as processing power, memory, and storage capacity. Azure offers a wide variety of sizes to support many types of uses.

Azure charges an [hourly price](https://azure.microsoft.com/pricing/details/virtual-machines/linux/) based on the VM’s size and operating system. For partial hours, Azure charges only for the minutes used. Storage is priced and charged separately.

## Automation
To achieve a proper DevOps culture, all infrastructure must be code.  When all the infrastructure lives in code it can easily be recreated (Phoenix Servers).  Azure works with all the major automation tooling like Ansible, Chef, SaltStack, and Puppet.  Azure also has its own tooling for automation:

* [Azure Templates](create-ssh-secured-vm-from-template.md)
* [Azure VMAccess](using-vmaccess-extension.md)

Azure is rolling out support for [cloud-init](http://cloud-init.io/) across most Linux Distros that support it.  Currently Canonical's Ubuntu VMs are deployed with cloud-init enabled by default.  Red Hat's RHEL, CentOS, and Fedora support cloud-init, however the Azure images maintained by Red Hat do not currently have cloud-init installed.  To use cloud-init on a Red Hat family OS, you must create a custom image with cloud-init installed.

* [Using cloud-init on Azure Linux VMs](using-cloud-init.md)

## Quotas
Each Azure Subscription has default quota limits in place that could impact the deployment of a large number of VMs for your project. The current limit on a per subscription basis is 20 VMs per region.  Quota limits can be raised quickly and easily by filing a support ticket requesting a limit increase.  For more details on quota limits:

* [Azure Subscription Service Limits](../../azure-subscription-service-limits.md)

## Partners
Microsoft works closely with partners to ensure the images available are updated and optimized for an Azure runtime.  For more information on Azure partners, see the following links:

* Linux on Azure - [Endorsed Distributions](endorsed-distros.md)
* SUSE - [Azure Marketplace - SUSE Linux Enterprise Server](https://azuremarketplace.microsoft.com/en-us/marketplace/apps?search=%27SUSE%27)
* Red Hat - [Azure Marketplace - Red Hat Enterprise Linux 7.2](https://azure.microsoft.com/marketplace/partners/redhat/redhatenterpriselinux72/)
* Canonical - [Azure Marketplace - Ubuntu Server 16.04 LTS](https://azure.microsoft.com/marketplace/partners/canonical/ubuntuserver1604lts/)
* Debian - [Azure Marketplace - Debian 8 "Jessie"](https://azure.microsoft.com/marketplace/partners/credativ/debian8/)
* FreeBSD - [Azure Marketplace - FreeBSD 10.3](https://azure.microsoft.com/marketplace/partners/microsoft/freebsd103/)
* CoreOS - [Azure Marketplace - CoreOS (Stable)](https://azure.microsoft.com/marketplace/partners/coreos/coreosstable/)
* RancherOS - [Azure Marketplace - RancherOS](https://azure.microsoft.com/marketplace/partners/rancher/rancheros/)
* Bitnami - [Bitnami Library for Azure](https://azure.bitnami.com/)
* Mesosphere - [Azure Marketplace - Mesosphere DC/OS on Azure](https://azure.microsoft.com/marketplace/partners/mesosphere/dcosdcos/)
* Docker - [Azure Marketplace - Azure Container Service with Docker Swarm](https://azure.microsoft.com/marketplace/partners/microsoft/acsswarms/)
* Jenkins - [Azure Marketplace - CloudBees Jenkins Platform](https://azure.microsoft.com/marketplace/partners/cloudbees/jenkins-platformjenkins-platform/)

## Getting started with Linux on Azure
To begin using Azure, you need an Azure account, the Azure CLI installed, and a pair of SSH public and private keys.

### Sign up for an account
The first step in using the Azure Cloud is to sign up for an Azure account.  Go to the [Azure Account Signup](https://azure.microsoft.com/pricing/free-trial/) page to get started.

### Install the CLI
With your new Azure account, you can get started immediately using the Azure portal, which is a web-based admin panel.  To manage the Azure Cloud via the command line, you install the `azure-cli`.  Install the [Azure CLI](/cli/azure/install-azure-cli) on your Mac or Linux workstation.

### Create an SSH key pair
Now you have an Azure account, the Azure web portal, and the Azure CLI.  The next step is to create an SSH key pair that is used to SSH into Linux without using a password.  [Create SSH keys on Linux and Mac](mac-create-ssh-keys.md) to enable password-less logins and better security.

### Create a VM using the CLI
Creating a Linux VM using the CLI is a quick way to deploy a VM without leaving the terminal you are working in.  Everything you can specify on the web portal is available via a command-line flag or switch.  

* [Create a Linux VM using the CLI](quick-create-cli.md)

### Create a VM in the portal
Creating a Linux VM in the Azure web portal is a way to easily point and click through the various options to get to a deployment.  Instead of using command-line flags or switches, you are able to view a nice web layout of various options and settings.  Everything available via the command-line interface is also available in the portal.

* [Create a Linux VM using the Portal](quick-create-portal.md)

### Log in using SSH without a password
The VM is now running on Azure and you are ready to log in.  Using passwords to log in via SSH is insecure and time consuming.  Using SSH keys is the most secure way and also the quickest way to log in.  When you create you Linux VM via the portal or the CLI, you have two authentication choices.  If you choose a password for SSH, Azure configures the VM to allow logins via passwords.  If you chose to use an SSH public key, Azure configures the VM to only allow logins via SSH keys and disables password logins. To secure your Linux VM by only allowing SSH key logins, use the SSH public key option during the VM creation in the portal or CLI.

## Related Azure components
## Storage
* [Introduction to Microsoft Azure Storage](../../storage/common/storage-introduction.md)
* [Add a disk to a Linux VM using the azure-cli](add-disk.md)
* [How to attach a data disk to a Linux VM in the Azure portal](attach-disk-portal.md)

## Networking
* [Virtual Network Overview](../../virtual-network/virtual-networks-overview.md)
* [IP addresses in Azure](../../virtual-network/virtual-network-ip-addresses-overview-arm.md)
* [Opening ports to a Linux VM in Azure](nsg-quickstart.md)
* [Create a Fully Qualified Domain Name in the Azure portal](portal-create-fqdn.md)

## Containers
* [Virtual Machines and Containers in Azure](containers.md)
* [Azure Container Service introduction](../../container-service/container-service-intro.md)
* [Deploy an Azure Container Service cluster](../../container-service/dcos-swarm/container-service-deployment.md)

## Next steps
You now have an overview of Linux on Azure.  The next step is to dive in and create a few VMs!

* [Explore the growing list of sample scripts for common tasks via AzureCLI](cli-samples.md)
