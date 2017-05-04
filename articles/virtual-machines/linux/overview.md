---
title: Overview of Linux VMs in Azure | Microsoft Docs
description: Describes Azure Compute, Storage, and Networking services with Linux virtual machines.
services: virtual-machines-linux
documentationcenter: virtual-machines-linux
author: rickstercdn
manager: timlt
editor: ''

ms.assetid: 7965a80f-ea24-4cc2-bc43-60b574101902
ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 09/14/2016
ms.author: rclaus
ms.custom: H1Hack27Feb2017
---
# Azure and Linux
Microsoft Azure is a growing collection of integrated public cloud services including analytics, Virtual Machines, databases, mobile, networking, storage, and web&mdash;ideal for hosting your solutions.  Microsoft Azure provides a scalable computing platform that allows you to only pay for what you use, when you want it - without having to invest in on-premises hardware.  Azure is ready when you are to scale your solutions up and out to whatever scale you require to service the needs of your clients.

If you are familiar with the various features of Amazon's AWS, you can examine the Azure vs AWS [definition mapping document](https://azure.microsoft.com/campaigns/azure-vs-aws/mapping/).

## Regions
Microsoft Azure resources are distributed across multiple geographical regions around the world.  A "region" represents multiple data centers in a single geographical area.  We have 34 regions generally available around the world with an additional 4 regions announced. Because we are continuing to expand our global coverage - we maintain an updated list of existing and newly announced regions.

* [Azure Regions](https://azure.microsoft.com/regions/)

## Availability
We announced an industry leading single instance virtual machine Service Level Agreement of 99.9% provided you deploy the VM with premium storage for all disks.  In order for your deployment to qualify for our standard 99.95% VM Service Level Agreement, you still need to deploy two or more VMs running your workload inside of an availability set. This will ensure your VMs are distributed across multiple fault domains in our data centers as well as deployed onto hosts with different maintenance windows. The full [Azure SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_0/) explains the guaranteed availability of Azure as a whole.

## Managed Disks

Managed Disks handles Azure Storage account creation and management in the background for you, and ensures that you do not have to worry about the scalability limits of the storage account. You simply specify the disk size and the performance tier (Standard or Premium), and Azure creates and manages the disk for you. Even as you add disks or scale the VM up and down, you don't have to worry about the storage being used. If you're creating new VMs, [use the Azure CLI 2.0](quick-create-cli.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) or the Azure portal to create VMs with Managed OS and data disks. If you have VMs with unmanaged disks, you can [convert your VMs to be backed with Managed Disks](convert-unmanaged-to-managed-disks.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

You can also manage your custom images in one storage account per Azure region, and use them to create hundreds of VMs in the same subscription. For more information about Managed Disks, please see the [Managed Disks Overview](../../storage/storage-managed-disks-overview.md).

## Azure Virtual Machines & Instances
Microsoft Azure supports running a number of popular Linux distributions provided and maintained by a number of partners.  You will find distributions such as Red Hat Enterprise, CentOS, Debian, Ubuntu, CoreOS, RancherOS, FreeBSD, and more in the Azure Marketplace. We actively work with various Linux communities to add even more flavors to the [Azure endorsed Linux Distros](endorsed-distros.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) list.

If your preferred Linux distro of choice is not currently present in the gallery, you can "Bring your own Linux" VM by [creating and uploading a Linux VHD in Azure](create-upload-generic.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

Azure virtual machines allow you to deploy a wide range of computing solutions in an agile way. You can deploy virtually any workload and any language on nearly any operating system - Windows, Linux, or a custom created one from any one of our growing list of partners. Still don't see what you are looking for?  Don't worry - you can also bring your own images from on-premises.

## VM Sizes
When you deploy a VM in Azure, you are going to select a VM size within one of our series of sizes that is suitable to your workload. The size also affects the processing power, memory, and storage capacity of the virtual machine. You are billed based on the amount of time the VM is running and consuming its allocated resources. A complete list of [sizes of Virtual Machines](sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

Here are some basic guidelines for selecting a VM size from one of our series (A, D, DS, G and GS).

* A-series VMs are our value priced entry-level VMs for light workloads and Dev/Test scenarios. They are widely available in all regions and can connect and use all standard resources available to virtual machines.
* A-series sizes (A8 - A11) are special compute intensive configurations suitable for high-performance computing cluster applications.
* D-series VMs are designed to run applications that demand higher compute power and temporary disk performance. D-series VMs provide faster processors, a higher memory-to-core ratio, and a solid-state drive (SSD) for the temporary disk.
* Dv2-series, is the latest version of our D-series, features a more powerful CPU. The Dv2-series CPU is about 35% faster than the D-series CPU. It is based on the latest generation 2.4 GHz Intel Xeon® E5-2673 v3 (Haskell) processor, and with the Intel Turbo Boost Technology 2.0, can go up to 3.2 GHz. The Dv2-series has the same memory and disk configurations as the D-series.
* G-series VMs offer the most memory and run on hosts that have Intel Xeon E5 V3 family processors.

Note: DS-series and GS-series VMs have access to Premium Storage - our SSD backed high-performance, low-latency storage for I/O intensive workloads. Premium Storage is available in certain regions. For details, see:

* [Premium Storage: High-performance storage for Azure virtual machine workloads](../../storage/storage-premium-storage.md)

## Automation
To achieve a proper DevOps culture, all infrastructure must be code.  When all the infrastructure lives in code it can easily be recreated (Phoenix Servers).  Azure works with all the major automation tooling like Ansible, Chef, SaltStack, and Puppet.  Azure also has its own tooling for automation:

* [Azure Templates](create-ssh-secured-vm-from-template.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Azure VMAccess](using-vmaccess-extension.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

Azure is rolling out support for [cloud-init](http://cloud-init.io/) across most Linux Distros that support it.  Currently Canonical's Ubuntu VMs are deployed with cloud-init enabled by default.  RedHats RHEL, CentOS, and Fedora support cloud-init, however the Azure images maintained by RedHat do not have cloud-init installed.  To use cloud-init on a RedHat family OS, you must create a custom image with cloud-init installed.

* [Using cloud-init on Azure Linux VMs](using-cloud-init.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

## Quotas
Each Azure Subscription has default quota limits in place that could impact the deployment of a large number of VMs for your project. The current limit on a per subscription basis is 20 VMs per region.  Quota limits can be raised quickly and easily by filing a support ticket requesting a limit increase.  For more details on quota limits:

* [Azure Subscription Service Limits](../../azure-subscription-service-limits.md)

## Partners
Microsoft works closely with our partners to ensure the images available are updated and optimized for an Azure runtime.  For more information on our partners check their marketplace pages below.

* Linux on Azure - [Endorsed Distributions](endorsed-distros.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* SUSE - [Azure Marketplace - SUSE Linux Enterprise Server](https://azuremarketplace.microsoft.com/en-us/marketplace/apps?search=%27SUSE%27)
* Redhat - [Azure Marketplace - RedHat Enterprise Linux 7.2](https://azure.microsoft.com/marketplace/partners/redhat/redhatenterpriselinux72/)
* Canonical - [Azure Marketplace - Ubuntu Server 16.04 LTS](https://azure.microsoft.com/marketplace/partners/canonical/ubuntuserver1604lts/)
* Debian - [Azure Marketplace - Debian 8 "Jessie"](https://azure.microsoft.com/marketplace/partners/credativ/debian8/)
* FreeBSD - [Azure Marketplace - FreeBSD 10.3](https://azure.microsoft.com/marketplace/partners/microsoft/freebsd103/)
* CoreOS - [Azure Marketplace - CoreOS (Stable)](https://azure.microsoft.com/marketplace/partners/coreos/coreosstable/)
* RancherOS - [Azure Marketplace - RancherOS](https://azure.microsoft.com/marketplace/partners/rancher/rancheros/)
* Bitnami - [Bitnami Library for Azure](https://azure.bitnami.com/)
* Mesosphere - [Azure Marketplace - Mesosphere DC/OS on Azure](https://azure.microsoft.com/marketplace/partners/mesosphere/dcosdcos/)
* Docker - [Azure Marketplace - Azure Container Service with Docker Swarm](https://azure.microsoft.com/marketplace/partners/microsoft/acsswarms/)
* Jenkins - [Azure Marketplace - CloudBees Jenkins Platform](https://azure.microsoft.com/marketplace/partners/cloudbees/jenkins-platformjenkins-platform/)

## Getting Setup on Azure
To begin using Azure you need an Azure account, the Azure CLI installed, and a pair of SSH public and private keys.

### Sign up for an account
The first step in using the Azure Cloud is to sign up for an Azure account.  Go to the [Azure Account Signup](https://azure.microsoft.com/pricing/free-trial/) page to get started.

### Install the CLI
With your new Azure account, you can get started immediately using the Azure portal, which is a web-based admin panel.  To manage the Azure Cloud via the command-line, you install the `azure-cli`.  Install the [Azure CLI 2.0](/cli/azure/install)on your Mac or Linux workstation.

### Create an SSH key pair
Now you have an Azure account, the Azure web portal, and the Azure CLI.  The next step is to create an SSH key pair that is used to SSH into Linux without using a password.  [Create SSH keys on Linux and Mac](mac-create-ssh-keys.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) to enable password-less logins and better security.

### Create a VM using the CLI
Creating a Linux VM using the CLI is a quick way to deploy a VM without leaving the terminal you are working in.  Everything you can specify on the web portal is available via a command-line flag or switch.  

* [Create a Linux VM using the CLI](quick-create-cli.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

### Create a VM in the portal
Creating a Linux VM in the Azure web portal is a way to easily point and click through the various options to get to a deployment.  Instead of using command-line flags or switches, you are able to view a nice web layout of various options and settings.  Everything available via the command-line interface is also available in the portal.

* [Create a Linux VM using the Portal](quick-create-portal.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

### Login using SSH without a password
The VM is now running on Azure and you are ready to log in.  Using passwords to log in via SSH is insecure and time consuming.  Using SSH keys is the most secure way and also the quickest way to login.  When you create you Linux VM via the portal or the CLI, you have two authentication choices.  If you choose a password for SSH, Azure configures the VM to allow logins via passwords.  If you chose to use an SSH public key, Azure configures the VM to only allow logins via SSH keys and disables password logins. To secure your Linux VM by only allowing SSH key logins, use the SSH public key option during the VM creation in the portal or CLI.

* [Disable SSH passwords on your Linux VM by configuring SSHD](mac-disable-ssh-password-usage.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

## Related Azure components
## Storage
* [Introduction to Microsoft Azure Storage](../../storage/storage-introduction.md)
* [Add a disk to a Linux VM using the azure-cli](add-disk.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [How to attach a data disk to a Linux VM in the Azure portal](attach-disk-portal.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

## Networking
* [Virtual Network Overview](../../virtual-network/virtual-networks-overview.md)
* [IP addresses in Azure](../../virtual-network/virtual-network-ip-addresses-overview-arm.md)
* [Opening ports to a Linux VM in Azure](nsg-quickstart.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Create a Fully Qualified Domain Name in the Azure portal](portal-create-fqdn.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

## Containers
* [Virtual Machines and Containers in Azure](containers.md)
* [Azure Container Service introduction](../../container-service/container-service-intro.md)
* [Deploy an Azure Container Service cluster](../../container-service/container-service-deployment.md)

## Next steps
You now have an overview of Linux on Azure.  The next step is to dive in and create a few VMs!

* [Explore our growing list of Sample Scripts for common tasks via AzureCLI](cli-samples.md)
