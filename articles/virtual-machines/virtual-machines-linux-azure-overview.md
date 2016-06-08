 <properties
   pageTitle="Azure and Linux | Microsoft Azure"
   description="Describes Azure Compute, Storage, and Networking services with Linux virtual machines."
   services="virtual-machines-linux"
   documentationCenter="virtual-machines-linux"
   authors="rickstercdn"
   manager="timlt"
   editor=""/>

<tags
   ms.service="virtual-machines-linux"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="infrastructure"
   ms.date="05/24/2016"
   ms.author="rclaus"/>

# Azure and Linux
Microsoft Azure is a growing collection of integrated public cloud services including analytics, Virtual Machines, databases, mobile, networking, storage, and web — ideal for hosting your solutions.  Microsoft Azure provides a scalable computing platform that allows you to only pay for what you use, when you want it - without having to invest in on premises hardware.  Azure is ready when you are to scale your solutions up and out to whatever scale you require to service the needs of your clients.
 
## Azure Virtual Machines
Azure virtual machines allow you to deploy a wide range of computing solutions in an agile way. You can deploy virtually any workload and any language on nearly any operating system - Windows, Linux, or a custom created one from any one of our growing list of partners. Still don't see what you are looking for?  Don't worry - you can also bring your own images from on-premises. 
 
## Getting Started with Linux in Microsoft Azure

Use Microsoft Azure Virtual Machines, Storage, and Networking together to provide "infrastructure-as-a-service" at Internet scale for your Linux computing needs. To get started using Linux on Azure, you're going to need:

1. A free trial account. [Go get one](https://azure.microsoft.com/pricing/free-trial/).
2. The Azure Command-line Interface for Linux, Mac, and Windows (the Azure CLI). [Install it](../xplat-cli-install.md).
3. A Linux VM. [Create it](virtual-machines-linux-quick-create-cli.md).
4. More information about Linux and Azure, including how to qualify for the [Service Level Agreement (SLA)](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_0/). **Read this document, even if you hate legal documents**.

## Logistics: Regions, Distributions, Availability, VM Sizes and Quotas
### Regions
Microsoft Azure resources are distributed across multiple geographical regions around the world.  A "region" represents multiple data centers in a single geographical area.  As of January 1, 2016, this includes: 8 in America, 2 in Europe, 6 in Asia Pacific, 2 in mainland China and 3 in India.  If you want a complete list of all Azure regions, we maintain a list of existing and newly announced regions **[here](https://azure.microsoft.com/regions/)**.  

### Distributions
Microsoft Azure supports running a number of popular Linux distributions provided and maintained by a number of partners.  You will find distributions such as CentOS, Debian, Red Hat Enterprise, Ubuntu, FreeBSD and more in the Azure Marketplace. We actively work with various Linux communities to add even more flavors to the Endorsed Distribution list. **[Check out Current Distros](virtual-machines-linux-endorsed-distros.md)** 
If your preferred Linux distro of choice is not currently present in the gallery, you can "Bring your own Linux" VM by following the guidelines **[on this page.](virtual-machines-linux-create-upload-generic.md)**

## Availability and the Microsoft Azure SLA
In order for your deployment to qualify for our 99.95 VM Service Level Agreement, you need to deploy two or more VMs running your workload inside of an availability set. This will ensure your VMs are distributed across multiple fault domains in our data centers as well as deployed onto hosts with different maintenance windows. For full details of our SLA you can view it **[online here](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_0/)**.  

## VM Sizes and Quotas
When you deploy a VM in Azure, you will select a VM size within one of our series of sizes that is suitable to your workload. The size also affects the processing power, memory and storage capacity of the virtual machine. You are billed based on the amount of time the VM is running and consuming its allocated resources. For a more complete list, see the following article on [Sizes of Virtual Machines](virtual-machines-linux-sizes.md).

Here are some basic guidelines for selecting a VM size from one of our series (A, D, DS, G and GS).

* A-series VMs are our value priced entry-level VMs for light workloads and Dev/Test scenarios. They are widely available in all regions and can connect and use all standard resources available to virtual machines.
* A-series sizes (A8 - A11) are special compute intensive configurations suitable for high-performance computing cluster applications.
* D-series VMs are designed to run applications that demand higher compute power and temporary disk performance. D-series VMs provide faster processors, a higher memory-to-core ratio, and a solid-state drive (SSD) for the temporary disk. 
* Dv2-series, is the latest version of our D-series, features a more powerful CPU. The Dv2-series CPU is about 35% faster than the D-series CPU. It is based on the latest generation 2.4 GHz Intel Xeon® E5-2673 v3 (Haswell) processor, and with the Intel Turbo Boost Technology 2.0, can go up to 3.2 GHz. The Dv2-series has the same memory and disk configurations as the D-series.
* G-series VMs offer the most memory and run on hosts that have Intel Xeon E5 V3 family processors.

Note: DS-series and GS-series VMs have access to Premium Storage - our SSD backed high-performance, low-latency storage for I/O intensive workloads. Premium Storage is available in certain regions. For details, see **[Premium Storage: High-performance storage for Azure virtual machine workloads](../storage/storage-premium-storage.md)**.

Each Azure Subscription has default quota limits in place that could impact the deployment of a large number of VMs for your project. The current limit on a per subscription basis is 20 VMs per region.  This quota limits can be raised by filing a support ticket requesting a limit increase.  For more details on quota limits, please see **[Azure Subscription Service Limits](../azure-subscription-service-limits.md)**

## Next steps

A free trial account. **[Go get one.](https://azure.microsoft.com/pricing/free-trial/)** If you already have one, to try it out, **[install the Azure CLI.](../xplat-cli-install.md)**. If you've done that, then [go create your Linux VM now](virtual-machines-linux-quick-create-cli.md).
