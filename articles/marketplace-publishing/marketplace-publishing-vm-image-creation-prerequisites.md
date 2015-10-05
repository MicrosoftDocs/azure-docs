<properties
   pageTitle="Technical pre-requisites for creating a virtual machine image for the Azure Marketplace | Microsoft Azure"
   description="Understand the requirements for creating and deploying a virtual machine image to the Azure Marketplace for others to purchase."
   services="marketplace-publishing"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

<tags
  ms.service="marketplace-publishing"
  ms.devlang="na"
  ms.topic="article"
  ms.tgt_pltfrm="Azure"
  ms.workload="na"
  ms.date="10/05/2015"
  ms.author="hascipio; v-divte"/>

# Technical Pre-requisites for creating a virtual machine image for the Azure Marketplace
Read the process thoroughly before beginning and understand where and why each step is performed. You should prepare as much of your company information and other data as possible before beginning the process. This should be clear from reviewing the process itself.  

## Download needed tools & applications
You should have the following items ready before beginning the process:
- Depending on which operating system you are targeting, install the Azure PowerShell cmdlets or Linux command line interface tool from the Azure Downloads Page.
- Install Azure Storage Explorer from CodePlex.
- Download and install “Certification Test Tool for Azure Certified”:
  - http://go.microsoft.com/fwlink/?LinkID=526913. You will need a Windows-based computer to run the certification tool. If you do not have a Windows-based computer available, you can run the tool using a Windows-based VM in Azure.

## Platforms supported
You can develop Azure-based VMs on Windows or Linux. Some elements of the publishing process—such as creating an Azure-compatible VHD—use different tools and steps depending on which operating system you are using.  
- If you are using Linux, refer to “Create an Azure-compatible VHD (Linux-based)” section of the [Virtual Machine Image Publishing Guide](marketplace-publishing-vm-image-creation.md).
- If you are using Windows, refer to “Create an Azure-compatible VHD (Windowsbased)” section of the [Virtual Machine Image Publishing Guide](marketplace-publishing-vm-image-creation.md).
> [AZURE.NOTE] You will need access to a Windows machine to
- Run the certification validation tool
- Create the VHD SASA URL for VHD Certification submission

## Developing your VHD
It is possible to develop Azure VHDs in the **cloud** or **on-premises**.
- Cloud-based development means all development steps are performed remotely on a VHD resident on Azure.
- On-premises development requires downloading a VHD and developing it using on-premises infrastructure. While this is possible, we do not recommend it. Note that developing for Windows or SQL on premises requires you to have the relevant on-premises license keys. You cannot include or install SQL Server after creating a VM, and you must base your offer on an approved SQL Image from the Azure Portal. If you decide to develop on-premises, you must perform some steps differently than if you were developing in the cloud. You can find relevant information in [Creating a VM image on-premise](marketplace-publishing-vm-image-creation-on-premise.md).

## Next Steps
Now that you reviewed the pre-requisites and completed the necessary task, you can move forward with the creating your Virtual Machine Image offer as detailed in the [Virtual Machine Image Publishing Guide](marketplace-publishing-vm-image-creation.md)

## See Also
- [Getting Started: How to publish an offer to the Azure Marketplace](marketplace-publishing-getting-started.md)


[link-acct-creation]:marketplace-publishing-accounts-creation-registration.md
