---
title: Tools and PaaS services for Azure Stack | Microsoft Docs
description: Learn how to get started with PaaS services in Azure Stack.
services: azure-stack
documentationcenter: ''
author: ErikjeMS
manager: byronr
editor: ''

ms.assetid: 2ce8d7e3-bc5d-4d61-8ab8-e8f61df40675
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/16/2016
ms.author: erikje

---
# Tools and PaaS services for Azure Stack

You can deploy [Platform as a Service](https://azure.microsoft.com/overview/what-is-paas/) (PaaS) services for Azure Stack from Microsoft and other 3rd party providers. You can also download the tools described below. If you want to be notified of new services and tools, follow #AzureStack on Twitter.

## PaaS services

[Add an App Service resource provider to Azure Stack](https://docs.microsoft.com/azure/azure-stack/azure-stack-app-service-overview)

[Add a SQL Server resource provider to Azure Stack](https://docs.microsoft.com/azure/azure-stack/azure-stack-sql-resource-provider-deploy)

[Add a MySQL Server resource provider to Azure Stack](https://docs.microsoft.com/azure/azure-stack/azure-stack-mysql-resource-provider-deploy)


## Template tools
### Azure Stack GitHub templates
Explore the growing collection of [Azure Stack GitHub Templates](https://github.com/Azure/AzureStack-QuickStart-Templates). Just like [Azure](https://github.com/Azure/azure-quickstart-templates), these “Quick Start” Azure Resource Manager templates aim to get you started with simple building blocks and examples, ready to deploy on the Microsoft Azure Stack Technical Preview Proof of Concept Environment. Included are first party workload examples for [ad-non-ha](https://github.com/Azure/AzureStack-QuickStart-Templates/tree/master/ad-non-ha), [sql-2014-non-ha](https://github.com/Azure/AzureStack-QuickStart-Templates/tree/master/sql-2014-non-ha), [sharepoint-2013-non-ha](https://github.com/Azure/AzureStack-QuickStart-Templates/tree/master/sharepoint-2013-non-ha), as well as several simple 101 templates like [101-simple-windows-vm](https://github.com/Azure/AzureStack-QuickStart-Templates/tree/master/101-simple-windows-vm).

### Marketplace item packaging tool and sample
[Download and use the Packaging tool](http://www.aka.ms/azurestackmarketplaceitem) to create marketplace items for your own custom templates to add to the Azure Stack marketplace. Instructions on how to create a marketplace item and make it available to your tenants can be found in [Create Marketplace item](azure-stack-create-and-publish-marketplace-item.md).

## Developer tools
### Use Visual Studio and Azure Stack TP2 on the MAS-CON01 virtual machine
If you want to use Visual Studio on the console VM to work with Azure Stack templates, you must install the correct versions of the required tools. Use the following procedure to install the supported versions for TP2.

1. Use Remote Desktop Connection to log in to the MAS-CON01 virtual machine with the azurestack\azurestackadmin credentials.
2. Install and open Web Platform Installer.
3. Find and install **Visual Studio Community 2015 with Microsoft Azure SDK - 2.9.5**.
4. Using **Add/Remove Programs**, uninstall the **Microsoft Azure PowerShell (Sept)** that gets installed as part of the SDK.
5. Open the Web Platform Installer.
6. Find and install **Microsoft Azure PowerShell - Azure Stack Technical Preview 2**. 
7. Restart the MAS-CON01 virtual machine.
8. Use Remote Desktop Connection to log in to the MAS-CON01 virtual machine with the azurestack\azurestackadmin credentials.
9. Open Visual Studio and validate that you can connect to the Azure Stack environment, get templates, and so on. 

### Azure PowerShell SDK
Azure PowerShell is a module that provides cmdlets to manage Azure and Azure Stack with Windows PowerShell. You can use the cmdlets to create, test, deploy, and manage solutions and services delivered through the Azure Stack platform.
[Download Azure PowerShell SDK](http://aka.ms/azStackPsh) and [install PowerShell](azure-stack-connect-powershell.md).

### Azure cross platform command line interfaces
Quickly install the Azure Command-Line Interface (Azure CLI) to use a set of open-source shell-based commands for creating and managing resources in Microsoft Azure Stack.

[Download the Windows CLI](http://aka.ms/azstack-windows-cli)

[Download the Mac CLI](http://aka.ms/azstack-linux-cli)

[Download the Linux CLI](http://aka.ms/azstack-mac-cli)

> [!NOTE]
> * If you’re on a Mac or Linux machine, you can also get the CLI by using the command `npm install -g azure-cli@0.10.4`</br>
> * If you're getting certificate validation issues, run the command `set NODE_TLS_REJECT_UNAUTHORIZED=0`
> 
> 

