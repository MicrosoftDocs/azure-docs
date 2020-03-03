---
title: Common issues during VHD creation (FAQ) for the Azure Marketplace 
description: Frequently asked questions about VHD creation and associated issues.
services: Azure Marketplace
author: MaggiePucciEvans
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
ms.date: 10/02/2018
ms.author: evansma
ms.reviewer: v-divte; v-miclar
---

# Common issues during VHD creation (FAQ)

The following frequently asked questions (FAQ) cover common issues encountered during virtual hard disk (VHD) and virtual machine (VM) creation for VM offers. 

## How do you create a VM from the Azure portal using the VHD that is uploaded to premium storage?

Azure Marketplace does not currently support creating VM offers from images residing on managed storage or from Azure Premium Storage.  For more information about these storage options, see [Azure Managed Disks Overview](https://docs.microsoft.com/azure/virtual-machines/windows/managed-disks-overview).


## Can you use generation 2 VMs for offers?

No, only generation 1 VHDs are supported.  However, we are currently working with the Microsoft Azure Platform Team to investigate support for generation 2 VMs.  For more information about the differences, see [Should I create a generation 1 or 2 virtual machine in Hyper-V?](https://docs.microsoft.com/windows-server/virtualization/hyper-v/plan/should-i-create-a-generation-1-or-2-virtual-machine-in-hyper-v)


## How do you change the name of the host?

You cannot.  Once VM is created, users (including owners) cannot update the name of the host.


## How do you reset the Remote Desktop service or its sign-in password?

The following articles explain how to perform RDS resets for Windows- and Linux-based VMs:   

- [How to reset the Remote Desktop service or its login password in a Windows VM](https://azure.microsoft.com/documentation/articles/virtual-machines-windows-reset-rdp/)
- [How to reset a Linux VM password or SSH key, fix the SSH configuration, and check disk consistency using the VMAccess extension](https://azure.microsoft.com/documentation/articles/virtual-machines-linux-classic-reset-access/)


## How do you generate new SSH certificates?

Generation of certificates is explained in the article [Get shared access signature URI for your VM image](./cpp-get-sas-uri.md) in the subsequent section [Create technical assets for a VM offer](./cpp-create-technical-assets.md).


## How do you configure a virtual private network (VPN) to work with my VMs?

If you are using the Azure Resource Manager deployment model, then you have three common options of setting up a VPN:
- [Create a route-based VPN gateway using the Azure portal](https://docs.microsoft.com/azure/vpn-gateway/create-routebased-vpn-gateway-portal)
- [Create a route-based VPN gateway using PowerShell](https://docs.microsoft.com/azure/vpn-gateway/create-routebased-vpn-gateway-powershell)
- [Create a route-based VPN gateway using CLI](https://docs.microsoft.com/azure/vpn-gateway/create-routebased-vpn-gateway-cli)


## What are Microsoft support policies for running Microsoft server software on Azure-based VMs?

These support policies are detailed in the article [Microsoft server software support for Microsoft Azure virtual machines](https://support.microsoft.com/help/2721672/microsoft-server-software-support-for-microsoft-azure-virtual-machines).


## Do virtual machines have unique identifiers associated with them?

Yes, if hosted on Azure.  Azure assigns a unique identifier, named the Azure Virtual Machine Unique ID to each new VM resource that is created.  For more information, read the blog post [Azure Virtual Machine Unique ID](https://blogs.msdn.microsoft.com/wasimbloch/2016/10/20/azure-virtual-machine-unique-id/).  You can also obtain this identifier programmatically through the [List API](https://docs.microsoft.com/rest/api/compute/virtualmachines/list).


## In a VM, how do you manage the custom script extension in the startup task?

The following article details how to use the Custom Script Extension using the Azure PowerShell module, Azure Resource Manager templates, and details troubleshooting steps on Windows systems: [Custom Script Extension for Windows](https://azure.microsoft.com/documentation/articles/virtual-machines-windows-extensions-customscript/)


## Are 32-bit applications or services supported in the Azure Marketplace?

In general, no.  The supported operating systems and standard services for Azure VMs are all 64-bit.  However, from a technical standpoint, most 64-bit operating systems support running 32-bit versions of applications for backward compatibility.  However, use of 32-bit applications as part of your VM solution is not supported and therefore is *highly discouraged*.  Instead, recompile your application as a 64-bit project.

For more information, see the following articles:
- [Running 32-bit applications](https://docs.microsoft.com/windows/desktop/WinProg64/running-32-bit-applications)
- [Support for 32-bit operating systems in Azure virtual machines](https://support.microsoft.com/help/4021388/support-for-32-bit-operating-systems-in-azure-virtual-machines)
- [Microsoft server software support for Microsoft Azure virtual machines](https://support.microsoft.com/help/2721672/microsoft-server-software-support-for-microsoft-azure-virtual-machines)


## Every time I try to create an image from my VHDs, I get the error `.VHD is already registered with image repository as the resource` in PowerShell. I did not create any image before nor did I find any image with this name in Azure. How do I resolve this issue?

This issue usually occurs if the user provisioned a VM from a VHD that has a lock on it.  Verify that there is no VM allocated from this VHD and then retry the operation.  If this issue persists, open a support ticket, as explained in [Support for Cloud Partner Portal](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal-orig/cloud-partner-portal-support-for-cloud-partner-portal). 

