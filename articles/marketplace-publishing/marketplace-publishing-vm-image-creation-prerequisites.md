---
title: Technical prerequisites for creating a virtual machine image for the Azure Marketplace | Microsoft Docs
description: Understand the requirements for creating and deploying a virtual machine image to the Azure Marketplace for others to purchase.
services: marketplace-publishing
documentationcenter: ''
author: HannibalSII
manager: hascipio
editor: ''

ms.assetid: 63c16966-0304-4b17-a715-368a0a5ccb2c
ms.service: marketplace
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: Azure
ms.workload: na
ms.date: 04/29/2016
ms.author: hascipio; v-divte

---
# Technical prerequisites for creating a virtual machine image for the Azure Marketplace
Read the process thoroughly before beginning and understand where and why each step is performed. As much as possible, you should prepare your company information and other data, download necessary tools, and/or create technical components before beginning the offer creation process. These items should be clear from reviewing this article.  

## Download needed tools & applications
You should have the following items ready before beginning the process:

* Depending on which operating system you are targeting, install the [Azure PowerShell cmdlets](https://www.microsoft.com/web/handlers/webpi.ashx/getinstaller/WindowsAzurePowershellGet.3f.3f.3fnew.appids) or [Linux command-line interface tool](https://go.microsoft.com/fwlink/?LinkId=253472&clcid=0x409) from the [Azure Downloads](https://azure.microsoft.com/downloads/) page.
* Install Azure Storage Explorer from CodePlex.
* Download and install the Certification Test Tool for Azure Certified:
  * [http://go.microsoft.com/fwlink/?LinkID=526913](http://go.microsoft.com/fwlink/?LinkID=526913). You need a Windows-based computer to run the certification tool. If you do not have a Windows-based computer available, you can run the tool using a Windows-based VM in Azure.

## Platforms supported
You can develop Azure-based VMs on Windows or Linux. Some elements of the publishing process--such as creating an Azure-compatible virtual hard disk (VHD)--use different tools and steps depending on which operating system you are using:  

* If you are using Linux, refer to the “Create an Azure-compatible VHD (Linux-based)” section of the [Virtual machine image publishing guide](marketplace-publishing-vm-image-creation.md).
* If you are using Windows, refer to the “Create an Azure-compatible VHD (Windows-based)” section of the [Virtual machine image publishing guide](marketplace-publishing-vm-image-creation.md).

> [!NOTE]
> You need access to a Windows-based machine to:
> 
> * Run the certification validation tool.
> * Create the VHD shared access signature URL for the VHD certification submission.
> 
> 

## Develop your VHD
You can develop Azure VHDs in the cloud or on-premises:

* Cloud-based development means all development steps are performed remotely on a VHD resident on Azure.
* On-premises development requires downloading a VHD and developing it using on-premises infrastructure. Although this is possible, we do not recommend it. Note that developing for Windows or SQL on-premises requires you to have the relevant on-premises license keys. You cannot include or install SQL Server after creating a VM. You must also base your offer on an approved SQL image from the Azure portal. If you decide to develop on-premises, you must perform some steps differently than if you were developing in the cloud. You can find relevant information in [Create an on-premises VM image](marketplace-publishing-vm-image-creation-on-premise.md).

[link-acct-creation]:marketplace-publishing-accounts-creation-registration.md
