 <properties
   pageTitle="Azure and Linux | Microsoft Azure"
   description="Describes Azure Compute, Storage, and Networking services with Linux virtual machines."
   services="virtual-machines-linux"
   documentationCenter="virtual-machines-linux"
   authors="vlivech"
   manager="timlt"
   editor=""/>

<tags
   ms.service="virtual-machines-linux"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="infrastructure"
   ms.date="09/14/2016"
   ms.author="v-livech"/>

# Azure and Linux

Microsoft Azure is a growing collection of integrated public cloud services including analytics, Virtual Machines, databases, mobile, networking, storage, and web — ideal for hosting your solutions.  Microsoft Azure provides a scalable computing platform that allows you to only pay for what you use, when you want it - without having to invest in on premises hardware.  Azure is ready when you are to scale your solutions up and out to whatever scale you require to service the needs of your clients.

If you are familiar with the various features of Amazon's AWS, you can examine the Azure vs AWS [definition mapping document](https://azure.microsoft.com/campaigns/azure-vs-aws/mapping/).


## Regions
Microsoft Azure resources are distributed across multiple geographical regions around the world.  A "region" represents multiple data centers in a single geographical area.  As of January 1, 2016, this includes: 8 in America, 2 in Europe, 6 in Asia Pacific, 2 in mainland China and 3 in India.  If you want a complete list of all Azure regions, we maintain a list of existing and newly announced regions.

- [Azure Regions](https://azure.microsoft.com/regions/)

## Availability
In order for your deployment to qualify for our 99.95 VM Service Level Agreement, you need to deploy two or more VMs running your workload inside of an availability set. This will ensure your VMs are distributed across multiple fault domains in our data centers as well as deployed onto hosts with different maintenance windows. The full [Azure SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_0/) explains the guaranteed availability of Azure as a whole.

## Azure Virtual Machines & Instances
Microsoft Azure supports running a number of popular Linux distributions provided and maintained by a number of partners.  You will find distributions such as Red Hat Enterprise, CentOS, Debian, Ubuntu, CoreOS, RancherOS, FreeBSD, and more in the Azure Marketplace. We actively work with various Linux communities to add even more flavors to the [Azure endorsed Linux Distros](virtual-machines-linux-endorsed-distros.md) list.

If your preferred Linux distro of choice is not currently present in the gallery, you can "Bring your own Linux" VM by [creating and uploading a Linux VHD in Azure](virtual-machines-linux-create-upload-generic.md).

Azure virtual machines allow you to deploy a wide range of computing solutions in an agile way. You can deploy virtually any workload and any language on nearly any operating system - Windows, Linux, or a custom created one from any one of our growing list of partners. Still don't see what you are looking for?  Don't worry - you can also bring your own images from on-premises.

## VM Sizes
When you deploy a VM in Azure, you are going to select a VM size within one of our series of sizes that is suitable to your workload. The size also affects the processing power, memory, and storage capacity of the virtual machine. You are billed based on the amount of time the VM is running and consuming its allocated resources. A complete list of [sizes of Virtual Machines](virtual-machines-linux-sizes.md).

Here are some basic guidelines for selecting a VM size from one of our series (A, D, DS, G and GS).

* A-series VMs are our value priced entry-level VMs for light workloads and Dev/Test scenarios. They are widely available in all regions and can connect and use all standard resources available to virtual machines.
* A-series sizes (A8 - A11) are special compute intensive configurations suitable for high-performance computing cluster applications.
* D-series VMs are designed to run applications that demand higher compute power and temporary disk performance. D-series VMs provide faster processors, a higher memory-to-core ratio, and a solid-state drive (SSD) for the temporary disk.
* Dv2-series, is the latest version of our D-series, features a more powerful CPU. The Dv2-series CPU is about 35% faster than the D-series CPU. It is based on the latest generation 2.4 GHz Intel Xeon® E5-2673 v3 (Haskell) processor, and with the Intel Turbo Boost Technology 2.0, can go up to 3.2 GHz. The Dv2-series has the same memory and disk configurations as the D-series.
* G-series VMs offer the most memory and run on hosts that have Intel Xeon E5 V3 family processors.

Note: DS-series and GS-series VMs have access to Premium Storage - our SSD backed high-performance, low-latency storage for I/O intensive workloads. Premium Storage is available in certain regions. For details, see:

- [Premium Storage: High-performance storage for Azure virtual machine workloads](../storage/storage-premium-storage.md)

## Automation
To achieve a proper DevOps culture, all infrastructure must be code.  When all the infrastructure lives in code it can easily be recreated (Phoenix Servers).  Azure works with all the major automation tooling like Ansible, Chef, SaltStack, and Puppet.  Azure also has its own tooling for automation:

- [Azure Templates](virtual-machines-linux-create-ssh-secured-vm-from-template.md)

- [Azure VMAccess](virtual-machines-linux-using-vmaccess-extension.md)

Azure is rolling out support for [cloud-init](http://cloud-init.io/) across most Linux Distros that support it.  Currently Canonical's Ubuntu VMs are deployed with cloud-init enabled by default.  RedHats RHEL, CentOS, and Fedora support cloud-init, however the Azure images maintained by RedHat do not have cloud-init installed.  To use cloud-init on a RedHat family OS, you must create a custom image with cloud-init installed.

- [Using cloud-init on Azure Linux VMs](virtual-machines-linux-using-cloud-init.md)

## Quotas
Each Azure Subscription has default quota limits in place that could impact the deployment of a large number of VMs for your project. The current limit on a per subscription basis is 20 VMs per region.  Quota limits can be raised by filing a support ticket requesting a limit increase.  For more details on quota limits:

- [Azure Subscription Service Limits](../azure-subscription-service-limits.md)


## Partners

Microsoft works closely with our partners to ensure the images available are updated and optimized for an Azure runtime.  For more information on our partners check their marketplace pages below.

- [Linux on Azure-Endorsed Distributions](virtual-machines-linux-endorsed-distros.md)

Redhat - [Azure Marketplace - RedHat Enterprise Linux 7.2](https://azure.microsoft.com/marketplace/partners/redhat/redhatenterpriselinux72/)

Canonical - [Azure Marketplace - Ubuntu Server 16.04 LTS](https://azure.microsoft.com/marketplace/partners/canonical/ubuntuserver1604lts/)

Debian - [Azure Marketplace - Debian 8 "Jessie"](https://azure.microsoft.com/marketplace/partners/credativ/debian8/)

FreeBSD - [Azure Marketplace - FreeBSD 10.3](https://azure.microsoft.com/marketplace/partners/microsoft/freebsd103/)

CoreOS - [Azure Marketplace - CoreOS (Stable)](https://azure.microsoft.com/marketplace/partners/coreos/coreosstable/)

RancherOS - [Azure Marketplace - RancherOS](https://azure.microsoft.com/marketplace/partners/rancher/rancheros/)

Bitnami - [Bitnami Library for Azure](https://azure.bitnami.com/)

Mesosphere - [Azure Marketplace - Mesosphere DC/OS on Azure](https://azure.microsoft.com/marketplace/partners/mesosphere/dcosdcos/)

Docker - [Azure Marketplace - Azure Container Service with Docker Swarm](https://azure.microsoft.com/marketplace/partners/microsoft/acsswarms/)

Jenkins - [Azure Marketplace - CloudBees Jenkins Platform](https://azure.microsoft.com/marketplace/partners/cloudbees/jenkins-platformjenkins-platform/)


## Getting Setup on Azure
To begin using Azure you need an Azure account, the Azure cli installed, and a pair of SSH public and private keys.

## Signup for an account
The first step in using the Azure Cloud is to signup for an Azure account.  Go to the [Azure Account Signup](https://azure.microsoft.com/pricing/free-trial/) page to get started.

## Install the CLI
With your new Azure account, you can get started immediately using the Azure portal, which is a web-based admin panel.  To manage the Azure Cloud via the command line, you install the `azure-cli`.  Install the [Azure CLI ](../xplat-cli-install.md)on your Mac or Linux workstation.

## Create an SSH key pair
Now you have an Azure account, the Azure web portal, and the Azure CLI.  The next step is to create an SSH key pair that is used to SSH into Linux without using a password.  [Create SSH keys on Linux and Mac](virtual-machines-linux-mac-create-ssh-keys.md) to enable password-less logins and better security.

## Getting Started with Linux on Microsoft Azure
With your Azure account setup, the Azure CLI installed and SSH keys created you are now ready to start building out an infrastructure in the Azure Cloud.  The first task is to create a couple VMs.

## Create a VM on the cli
Creating a Linux VM on the cli is a quick way to deploy a VM without leaving the terminal you are working in.  Everything you can specify on the web portal is available via a command line flag or switch.  

- [Create a Linux VM using the CLI](virtual-machines-linux-quick-create-cli.md)

## Create a VM in the portal
Creating a Linux VM on the Azure web portal is a way to easily point and click through the various options to get to a deployment.  Instead of using command line flags or switches, you are able to view a nice web layout of various options and settings.  Everything available via the command line interface is also available on the portal.

- [Create a Linux VM using the Portal](virtual-machines-linux-quick-create-portal.md)

## Login using SSH without a password
The VM is now running on Azure and you are ready to login.  Using passwords to login via SSH is insecure and time consuming.  Using SSH keys is the most secure way and also the quickest way to login.  When you create you Linux VM via the portal or the CLI, you have two authentication choices.  If you choose a password for SSH, Azure configures the VM to allow logins via passwords.  If you chose to use an SSH public key, Azure configures the VM to only allow logins via SSH keys and disables password logins. To secure your Linux VM by only allowing SSH key logins, use the SSH public key option during the VM creation on the portal or cli.

- [Disable SSH passwords on your Linux VM by configuring SSHD](virtual-machines-linux-mac-disable-ssh-password-usage.md)

## Related Azure Components

## Storage

- [Introduction to Microsoft Azure Storage](../storage/storage-introduction.md)

- [Add a disk to a Linux VM using the azure-cli](virtual-machines-linux-add-disk.md)

- [How to attach a data disk to a Linux VM in the Azure portal](virtual-machines-linux-attach-disk-portal.md)

## Networking

- [Virtual Network Overview](../virtual-network/virtual-networks-overview.md)

- [IP addresses in Azure](../virtual-network/virtual-network-ip-addresses-overview-arm.md)

- [Opening ports to a Linux VM in Azure](virtual-machines-linux-nsg-quickstart.md)

- [Create a Fully Qualified Domain Name in the Azure portal](virtual-machines-linux-portal-create-fqdn.md)


## Containers

- [Virtual Machines and Containers in Azure](virtual-machines-linux-containers.md)

- [Azure Container Service introduction](../container-service/container-service-intro.md)

- [Deploy an Azure Container Service cluster](../container-service/container-service-deployment.md)

## Next steps

You now have an overview of Linux on Azure.  The next step is to dive in and create a few VM'S!

- [Create a Linux VM on Azure using the Portal](virtual-machines-linux-quick-create-portal.md)

- [Create a Linux VM on Azure by using the CLI](virtual-machines-linux-quick-create-cli.md)
