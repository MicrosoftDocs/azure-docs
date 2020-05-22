---
title: Common issues during VHD creation (FAQ)
description: Frequently asked questions about common issues when creating a virtual hard disk (VHD).
author: emuench
ms.author: mingshen
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: guide
ms.date: 04/09/2020
---

# Common issues during VHD creation

These frequently asked questions (FAQ) cover common issues you might encounter when creating a virtual hard disk (VHD) for your Azure Virtual Machine offer.

## How do I create a VM from the Azure portal using a VHD in premium storage?

Azure Marketplace does not currently support creating VM offers from images on managed storage or from Azure Premium Storage. For details, see [Azure Managed Disks Overview](https://docs.microsoft.com/azure/virtual-machines/windows/managed-disks-overview).

## Can I use Generation 2 VMs for offers?

No, only Generation 1 VHDs are supported. However, we're currently working with the Microsoft Azure Platform Team to investigate support for Generation 2 VMs. For details, see [Should I create a generation 1 or 2 virtual machine in Hyper-V?](https://docs.microsoft.com/windows-server/virtualization/hyper-v/plan/should-i-create-a-generation-1-or-2-virtual-machine-in-hyper-v)

## How do I change the name of the host?

You can't. After a VM is created, users (including owners) can't update the host name.

## How do I reset the Remote Desktop service or its sign-in password?

These articles explain how to perform RDS resets for Windows- and Linux-based VMs:

* [How to reset the Remote Desktop service or its login password in a Windows VM](https://azure.microsoft.com/documentation/articles/virtual-machines-windows-reset-rdp/)
* [How to reset a Linux VM password or SSH key, fix the SSH configuration, and check disk consistency using the VMAccess extension](https://azure.microsoft.com/documentation/articles/virtual-machines-linux-classic-reset-access/)

## How do I generate new SSH certificates?

Generation of certificates is explained in [Azure VM image certification](https://aks.ms/CertifyVMimage).

## How do I configure a virtual private network (VPN) to work with my VMs?

If you are using the Azure Resource Manager deployment model, you have three options:

* [Create a route-based VPN gateway using the Azure portal](https://docs.microsoft.com/azure/vpn-gateway/create-routebased-vpn-gateway-portal)
* [Create a route-based VPN gateway using Azure PowerShell](https://docs.microsoft.com/azure/vpn-gateway/create-routebased-vpn-gateway-powershell)
* [Create a route-based VPN gateway using CLI](https://docs.microsoft.com/azure/vpn-gateway/create-routebased-vpn-gateway-cli)

## What are Microsoft support policies for running Microsoft server software on Azure-based VMs?

You can find details at [Microsoft server software support for Microsoft Azure virtual machines](https://support.microsoft.com/help/2721672/microsoft-server-software-support-for-microsoft-azure-virtual-machines).

## Do virtual machines have unique identifiers associated with them?

Yes, if hosted on Azure. Azure assigns a unique identifier, called the [Azure Virtual Machine Unique ID](https://blogs.msdn.microsoft.com/wasimbloch/2016/10/20/azure-virtual-machine-unique-id/), to each new VM resource created. For details, see Azure Virtual Machine Unique ID. You can also get this identifier through the [List API](https://docs.microsoft.com/rest/api/compute/virtualmachines/list).

## In a VM, how do I manage the custom script extension in the startup task?

For details on using the Custom Script Extension using the Azure PowerShell module, Azure Resource Manager templates, and troubleshooting steps on Windows systems, see [Custom Script Extension for Windows](https://azure.microsoft.com/documentation/articles/virtual-machines-windows-extensions-customscript/).

## Are 32-bit applications or services supported in Azure Marketplace?

In general, no. The supported operating systems and standard services for Azure VMs are all 64-bit. Though most 64-bit operating systems support 32-bit versions of applications for backward compatibility, using 32-bit applications as part of your VM solution is unsupported and highly discouraged. Recreate your application as a 64-bit project.

For more information, see these articles:

* [Running 32-bit applications](https://docs.microsoft.com/windows/desktop/WinProg64/running-32-bit-applications)
* [Support for 32-bit operating systems in Azure virtual machines](https://support.microsoft.com/help/4021388/support-for-32-bit-operating-systems-in-azure-virtual-machines)
* [Microsoft server software support for Microsoft Azure virtual machines](https://support.microsoft.com/help/2721672/microsoft-server-software-support-for-microsoft-azure-virtual-machines)

## Error: VHD is already registered with image repository as the resource

Every time I try to create an image from my VHDs, I get the error "VHD is already registered with image repository as the resource" in Azure PowerShell. I didn't create any image before nor did I find any image with this name in Azure. How do I resolve this?

This issue usually appears if you created a VM from a VHD that has a lock on it. Confirm that there is no VM allocated from this VHD and then retry the operation. If this issue continues, open a support ticket. See [Support for Partner Center](https://docs.microsoft.com/azure/marketplace/partner-center-portal/support).
