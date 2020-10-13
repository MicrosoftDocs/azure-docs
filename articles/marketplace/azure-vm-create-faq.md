---
title: VM FAQ for Azure Marketplace
description: Frequently asked questions when creating a virtual machine in Azure Marketplace.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: guide
author: iqshahmicrosoft
ms.author: iqshah
ms.date: 10/15/2020
---

# VM FAQ for Azure Marketplace

These frequently asked questions (FAQ) cover common issues you might encounter when creating a virtual machine (VM) offer in Azure Marketplace.

## How do I configure a virtual private network (VPN) to work with my VMs?

If you are using the Azure Resource Manager deployment model, you have three options:

- [Create a route-based VPN gateway using the Azure portal](../vpn-gateway/create-routebased-vpn-gateway-portal.md)
- [Create a route-based VPN gateway using Azure PowerShell](../vpn-gateway/create-routebased-vpn-gateway-powershell.md)
- [Create a route-based VPN gateway using CLI](../vpn-gateway/create-routebased-vpn-gateway-cli.md)

## What are Microsoft support policies for running Microsoft server software on Azure-based VMs?

You can find details at [Microsoft server software support for Microsoft Azure virtual machines](https://support.microsoft.com/help/2721672/microsoft-server-software-support-for-microsoft-azure-virtual-machines).

## In a VM, how do I manage the custom script extension in the startup task?

For details on using the Custom Script Extension using the Azure PowerShell module, Azure Resource Manager templates, and troubleshooting steps on Windows systems, see [Custom Script Extension for Windows](/azure/virtual-machines/extensions/custom-script-windows).

## Are 32-bit applications or services supported in Azure Marketplace?

No. The supported operating systems and standard services for Azure VMs are all 64-bit. Though most 64-bit operating systems support 32-bit versions of applications for backward compatibility, using 32-bit applications as part of your VM solution is unsupported and highly discouraged. Recreate your application as a 64-bit project.

For more information, see these articles:

- [Running 32-bit applications](https://docs.microsoft.com/windows/desktop/WinProg64/running-32-bit-applications)
- [Support for 32-bit operating systems in Azure virtual machines](https://support.microsoft.com/help/4021388/support-for-32-bit-operating-systems-in-azure-virtual-machines)
- [Microsoft server software support for Microsoft Azure virtual machines](https://support.microsoft.com/help/2721672/microsoft-server-software-support-for-microsoft-azure-virtual-machines)

## Error: VHD is already registered with image repository as the resource

Every time I try to create an image from my VHDs, I get the error "VHD is already registered with image repository as the resource" in Azure PowerShell. I didn't create any image before nor did I find any image with this name in Azure. How do I resolve this?

This issue usually appears if you created a VM from a VHD that has a lock on it. Confirm that there is no VM allocated from this VHD and then retry the operation. If this issue continues, open a support ticket. See [Support for Partner Center](support.md).

## Next steps

- [VM certification FAQ](azure-vm-create-certification-faq.md)
