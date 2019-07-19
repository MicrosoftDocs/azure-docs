---
title: Create technical assets for a virtual machine offer for the Azure Marketplace 
description: Explains how to create the technical assets for a virtual machine offer in the Azure Marketplace.
services: Azure, Marketplace, Cloud Partner Portal, 
author: pbutlerm
ms.service: marketplace
ms.topic: article
ms.date: 08/20/2018
ms.author: pabutler
---

# Create technical assets for a virtual machine offer

This section walks you through creating and configuring the technical assets for a virtual machine (VM) offer for the Azure Marketplace.  A VM contains two components: the solution virtual hard disk (VHD) and optional associated data disks.  

- *Virtual hard disks (VHDs)*, containing the operating system and your solution, that you will deploy with your Azure Marketplace offer. The process of preparing the VHD differs depending on whether it is a Linux-based,  Windows-based, or a custom-based VM.
- *Data disks* represent dedicated, persistent storage for a virtual machine. Do *not* use the solution VHD (for example, the `C:` drive) to store persistent information.

A VM image contains one operating system disk and zero or more data disks. One VHD is needed per disk. Even blank data disks require a VHD to be created.
You must configure the VM OS, the VM size, ports to open, and up to 15 attached data disks.

> [!TIP] 
> Regardless of which operating system you use, add only the minimum number of data disks needed by the SKU. Customers cannot remove disks that are part of an image at the time of deployment but they can always add disks during or after deployment. 

> [!IMPORTANT]
> *Do not change disk count in a new image version.* If you must reconfigure Data disks in the image, define a new SKU. Publishing a new image version with different disk counts will have the potential of breaking new deployment based on the new image version in cases of auto-scaling, automatic deployments of solutions through Azure Resource Manager templates and other scenarios.

[!INCLUDE [updated-for-az](../../../../includes/updated-for-az.md)]

## Fundamental technical knowledge

Designing, building, and testing these assets take time and requires technical knowledge of both the Azure platform and the technologies used to build the offer. In addition to your solution domain, your engineering team should have knowledge on the following Microsoft technologies: 
-	Basic understanding of [Azure Services](https://azure.microsoft.com/services/) 
-	How to [design and architect Azure applications](https://azure.microsoft.com/solutions/architecture/)
-	Working knowledge of [Azure Virtual Machines](https://azure.microsoft.com/services/virtual-machines/), [Azure Storage](https://azure.microsoft.com/services/?filter=storage) and [Azure Networking](https://azure.microsoft.com/services/?filter=networking)
-	Working knowledge of [Azure Resource Manager](https://azure.microsoft.com/features/resource-manager/)
-	Working Knowledge of [JSON](https://www.json.org/)


## Suggested tools 

Choose one or both of the following scripting environments to help manage VHDs and VMs:
-	[Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview)
-	[Azure CLI](https://docs.microsoft.com/cli/azure)

In addition, we recommend adding the following tools to your development environment: 

-	[Azure Storage Explorer](https://docs.microsoft.com/azure/vs-azure-tools-storage-manage-with-storage-explorer)
-	[Visual Studio Code](https://code.visualstudio.com/)
    *	Extension: [Azure Resource Manager Tools](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools)
    *	Extension: [Beautify](https://marketplace.visualstudio.com/items?itemName=HookyQR.beautify)
    *	Extension: [Prettify JSON](https://marketplace.visualstudio.com/items?itemName=mohsen1.prettify-json)

We also suggest reviewing the available tools in the [Azure Developer Tools](https://azure.microsoft.com/tools/) page and, if you are using Visual Studio, the [Visual Studio Marketplace](https://marketplace.visualstudio.com/).


## Next steps

The subsequent articles in this section walk you through the steps of creating and registering these VM assets:

1. [Create an Azure-compatible virtual hard disk](./cpp-create-vhd.md) explains how to create either a Linux- or Windows-based VHD that is compatible with Azure.  It includes best practices, such as sizing, patching, and preparing the VM for uploading.

2. [Connect to the virtual machine](./cpp-connect-vm.md) explains how to remotely connect to your newly created VM and sign into it.  This article also explains how to stop the VM to save on usage costs.

3. [Configure the virtual machine](./cpp-configure-vm.md) explains how to choose the correct VHD size, generalize your image, apply recent updates (patches), and schedule custom configurations.

4. [Deploy a virtual machine from a virtual hard disk](./cpp-deploy-vm-vhd.md) explains how to register a VM from an Azure-deployed VHD.  It lists the tools required, and how to use them to create a user VM image, then deploy it to Azure using either the [Microsoft Azure portal](https://ms.portal.azure.com/) or PowerShell scripts. 

5. [Certify a virtual machine image](./cpp-certify-vm.md) explains how to test and submit a VM image for Azure Marketplace certification. It explains where to get the *Certification Test Tool for Azure Certified* tool, and how to use this tool to certify your VM image. 

6. [Get SAS URI](./cpp-get-sas-uri.md) explains how to get the shared access signature (SAS) URI for your VM image(s).
 
As a supporting article, [Common shared access signature URL issues](./cpp-common-sas-url-issues.md) lists some common problems you may encounter using SAS URIs and the corresponding possible solutions.

After you have completed all these steps, you will be ready to [publish your VM offer](./cpp-publish-offer.md) to the Azure Marketplace.
