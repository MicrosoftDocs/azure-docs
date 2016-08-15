<properties
	pageTitle="Tools and PaaS services for Azure Stack | Microsoft Azure"
	description="Learn how to get started with PaaS services in Azure Stack."
	services="azure-stack"
	documentationCenter=""
	authors="ErikjeMS"
	manager="byronr"
	editor=""/>

<tags
	ms.service="multiple"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/25/2016"
	ms.author="erikje"/>

# Tools and PaaS services for Azure Stack

Azure Stack enables deploying [Platform as a Service](https://azure.microsoft.com/overview/what-is-paas/) (PaaS) services from Microsoft and other 3rd party providers. You can also download the tools described below. If you want to be notified of new services and tools, follow #AzureStack on Twitter.

## Additional PaaS services
In Technical Preview 1, three PaaS resource providers are now available.

[Add a SQL Server resource provider to Azure Stack](azure-stack-sql-rp-deploy-short.md)

[Add a MySQL resource provider to Azure Stack](azure-stack-mysql-rp-deploy-short.md)

[Add a Web Apps resource provider to Azure Stack](azure-stack-webapps-deploy.md)

## Template tools


### Azure Stack Github templates
Explore the growing collection of [Azure Stack GitHub Templates](https://github.com/Azure/AzureStack-QuickStart-Templates). Just like [Azure](https://github.com/Azure/azure-quickstart-templates), these “Quick Start” Azure Resource Manager templates aim to get you started with simple building blocks and examples, ready to deploy on the Microsoft Azure Stack Technical Preview Proof of Concept Environment. Included are first party workload examples for [ad-non-ha](https://github.com/Azure/AzureStack-QuickStart-Templates/tree/master/ad-non-ha), [sql-2014-non-ha](https://github.com/Azure/AzureStack-QuickStart-Templates/tree/master/sql-2014-non-ha), [sharepoint-2013-non-ha](https://github.com/Azure/AzureStack-QuickStart-Templates/tree/master/sharepoint-2013-non-ha), as well as several simple 101 templates like [101-simple-windows-vm](https://github.com/Azure/AzureStack-QuickStart-Templates/tree/master/101-simple-windows-vm).


### Marketplace item packaging tool and sample
[Download and use the Packaging tool](http://www.aka.ms/azurestackmarketplaceitem) to create marketplace items for your own custom templates to add to the Azure Stack marketplace. Instructions on how to create a marketplace item and make it available to your tenants can be found in [Create Marketplace item](azure-stack-create-marketplace-item.md).

## Developer tools

### Visual Studio Cloud Tools
Use the Visual Studio Cloud Tools to quickly build new applications or deploy existing applications to Azure Stack.
[Download for Visual Studio 2015](http://go.microsoft.com/fwlink/?linkid=518003)

### Azure PowerShell SDK
Azure PowerShell is a module that provides cmdlets to manage Azure and Azure Stack with Windows PowerShell. You can use the cmdlets to create, test, deploy, and manage solutions and services delivered through the Azure Stack platform.
[Download Azure PowerShell SDK](http://aka.ms/azStackPsh)

> [AZURE.NOTE] If you work on the Client VM, you’ll need to first **uninstall** the existing Azure PowerShell module and then [download](http://aka.ms/azStackPsh) the latest Azure PowerShell SDK.

### Azure cross platform command line interfaces
Quickly install the Azure Command-Line Interface (Azure CLI) to use a set of open-source shell-based commands for creating and managing resources in Microsoft Azure Stack.

[Download the Windows CLI](http://aka.ms/azstack-windows-cli)

[Download the Mac CLI](http://aka.ms/azstack-linux-cli)

[Download the Linux CLI](http://aka.ms/azstack-mac-cli)

>[AZURE.NOTE]
>
> + If you’re on a Mac or Linux machine, you can also get the CLI by using the command `npm install -g azure-cli@0.9.11`</br>
> + If you're getting certificate validation issues, run the command `set NODE_TLS_REJECT_UNAUTHORIZED=0`
