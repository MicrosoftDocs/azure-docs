<properties 
	pageTitle="Deploying Virtual Machines using Azure Resource Manager with PowerShell or xplat-cli" 
	description="." 
	services="virtual-machines" 
	documentationCenter="" 
	authors="JoeDavies-MSFT" 
	manager="timlt" 
	editor=""/>

<tags 
	ms.service="virtual-machines" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="4/16/2015" 
	ms.author="josephd"/>

# Deploying Virtual Machines using Azure Resource Manager with PowerShell or xplat-cli

All of the tasks you perform to deploy Azure Virtual Machines can be fully automated. This article provides guidance on how to automate common tasks for deploying Azure Virtual Machines using Azure Resource Manager along with Azure PowerShell or our Cross-Platform Command-Line Interface (xplat cli), as well as links to more documentation on using Azure Resource Manager for Virtual Machines. These tasks include:

- Deploying a VM to Azure
- Create a Custom VM Image
- Deploy a Multi-VM App that uses a Virtual Network + Load Balancer
- Deploy a Multi-VM App using Chef 
- Deploy a Multi-VM App using Puppet 
- Updating an Already Deployed VM
- Adding an additional VM to an Already Deployed Resource Group
- Enable Auto-Scaling with VMs

## Understanding Azure Resource Templates and Resource Groups

Most applications that are deployed and run in Microsoft Azure are built out of a combination of different cloud resource types (such as one or more VMs and Storage accounts, a SQL database, a Virtual Network, or a CDN).  Azure Resource Manager Templates make it possible for you to deploy and manage these different resources together by using a JSON description of the resources and associated configuration and deployment parameters.  

Once you have defined a JSON based resource template, you can execute it and have the resources defined within it deployed in Azure using a PowerShell or xplat-cli command.  You can run these commands either standalone within the PowerShell or xplat-cli command shells, or integrate it within a script that contains additional automation logic.

The resources you create using Azure Resource Manager Templates will be deployed to either a new or existing Azure Resource Group.  An Azure Resource Group allows you to manage multiple deployed resources together as a logical group. A typical Resource Group contains resources related to a specific application.  Azure Resource Groups provide a way to manage the overall lifecycle of the group/application and provide management APIs that allow you to:

- Stop, start, or delete all of the resources within the group at once.
- Apply Role-Based Access Control (RBAC) rules to lock down security permissions on them.
- Audit operations.
- Tag resources with additional meta-data for better tracking.  

You can learn more about Azure Resource Groups here [link TBD].

The following automation examples demonstrate how to use Azure Resource Manager Templates and Resource Groups to deploy Azure Virtual Machines using PowerShell or xplat-cli.

Before you dive in, make sure you have Azure, PowerShell, and XPLAT-CLI configured and ready to go.

[AZURE.INCLUDE [arm-getting-setup-powershell](../includes/arm-getting-setup-powershell.md)]

[AZURE.INCLUDE [xplat-getting-set-up](../includes/xplat-getting-set-up.md)]

## Common Task: Deploy a VM in Azure

Use the instructions in these sections to deploy a new Azure VM using Azure PowerShell or the xplat-cli.

## Deploy a VM with a Resource Manager template using Azure PowerShell

Follow these steps to deploy a VM using a Resource Manager template in the Template Gallery using Azure PowerShell commands.

**Step 1: Choose the template.**

To view the list of templates in the gallery, run this command.

	Get-AzureResourceGroupGalleryTemplate

This list is from all publishers of templates. You can scope the list to a specific publisher and show only the template name with this command, replacing <publisher name> with the publisher's name.

	Get-AzureResourceGroupGalleryTemplate -Publisher <publisher name> | select Identity –Unique

For example, to view the list of Microsoft-published templates in the gallery, run this command.

	Get-AzureResourceGroupGalleryTemplate -Publisher Microsoft | select Identity –Unique

Here is an example.

	Identity
	--------
	Microsoft.ApacheTomcat7.0.2.3-preview
	Microsoft.AppInsights.0.2.3-preview
	Microsoft.ASPNETEmptySite.0.3.4-preview
	Microsoft.ASPNETStarterSite.0.3.4-preview
	Microsoft.AzureADConnectHealth.1.0.0
	Microsoft.Bakery.0.3.3-preview
	Microsoft.BgInfo.1.0.13
	Microsoft.BizTalkServer2013Developer.0.2.49-preview
	Microsoft.BizTalkServer2013Enterprise.0.2.52-preview
	Microsoft.BizTalkServer2013Standard.0.2.52-preview
	…

**Step 2: (optional) View the details of the template.**

From the display of your Get-AzureResourceGroupGalleryTemplate command, copy the identity string of the template for the VM that you want to create, replace <template identity string> in the following PowerShell commands, and then run them to see details on the template.

	$tempIdentity="<template identity string>"
	Get-AzureResourceGroupGalleryTemplate -Identity $tempIdentity

Here is an example for the Windows Server 2012 R2 template.

	PS C:\> $tempIdentity="Microsoft.WindowsServer2012R2Datacenter.0.2.57-preview"
	PS C:\> Get-AzureResourceGroupGalleryTemplate -Identity $tempIdentity
	
	
	Identity             : Microsoft.WindowsServer2012R2Datacenter.0.2.57-preview
	Publisher            : Microsoft
	Name                 : WindowsServer2012R2Datacenter
	Version              : 0.2.57-preview
	CategoryIds          : {virtualMachine, microsoftServer, azure, windows...}
	PublisherDisplayName : Microsoft
	DisplayName          : Windows Server 2012 R2 Datacenter
	DefinitionTemplates  : https://gallerystoreprodch.blob.core.windows.net/prod-microsoft-windowsazure-gallery/Microsoft.WindowsServer2012R2Datacenter.0.2.57-preview/DeploymentTemplates/DefaultTemplate.json
	Summary              : Enterprise-class solutions that are simple to deploy, cost-effective, application-focused, and user-centric.
	Description          : At the heart of the Microsoft Cloud OS vision, Windows Server 2012 R2 brings Microsoft's experience delivering global-scale cloud services into your infrastructure. It offers enterprise-class performance, flexibility for your applications and excellent economics for your datacenter and hybrid cloud environment. This image includes Windows Server 2012 R2 Update (KB2919355).

**Step 3: (optional) View the parameters of the template.**

When you create a VM with a template, you must specify a set of configuration parameters. To see the parameters that you need to specify for the template in a local JSON file before running the command to create the virtual machine, fill in a file name and path and run these commands.

	$fileName="<name of the local JSON file, without the extension>"
	$filePath="<a local path on your computer, example c:\temp >"
	$jsonName = $filePath + "\" + $fileName + ".json"
	Save-AzureResourceGroupGalleryTemplate -Identity $tempIdentity -Path $jsonName

Here is an example for the Windows Server 2012 R2 template.

	PS C:\> $fileName="Windows"
	PS C:\> $filePath="C:\Azure\Templates"
	PS C:\> $jsonName = $filePath + "\" + $fileName + ".json"
	PS C:\> Save-AzureResourceGroupGalleryTemplate -Identity $tempIdentity -Path $jsonName
	
	Path
	----
	C:\Azure\Templates\Windows.json

Open the local JSON file in a tool or text editor of your choice. Look for the **"parameters"** section at the top of the file, which lists the set of parameters that are needed by the template to configure the virtual machine.

Here is an example for the Microsoft.WindowsServer2012R2Datacenter.0.2.57-preview template:

	"parameters": {
	    "newStorageAccountName": {
	      "type": "String"
	    },
	    "newDomainName": {
	      "type": "String"
	    },
	    "newVirtualNetworkName": {
	      "type": "String"
	    },
	    "vnetAddressSpace": {
	      "type": "String"
	    },
	    "hostName": {
	      "type": "String"
	    },
	    "userName": {
	      "type": "String"
	    },
	    "password": {
	      "type": "SecureString"
	    },
	    "location": {
	      "type": "String"
	    },
	    "hardwareSize": {
	      "type": "String"
	    }

**Step 4: Create the virtual machine with the template.**

You can run the command to create the virtual machine using the following methods:

1.	Prompted
2.	Cycling through the parameters on the command line
3.	Specifying all the parameters in the command line

For the details of methods 2 and 3, see [Create a resource group](powershell-azure-resource-manager.md#create-a-resource-group).

For method 1, fill in an Azure location and the name of your new resource group and run these commands.

	$locName="<Azure location, such as West US>"
	$rgName="<name of your new resource group for the virtual machine>"
	New-AzureResourceGroup -Name $rgName -Location $locName -GalleryTemplateIdentity $tempIdentity

When you run the New-AzureResourceGroup command, you will be prompted to supply the values of each parameter in the "parameters" section of the JSON file, in the same order. When you have specified all the parameter values, the command creates the resource group and the virtual machine.
Here is an example for the Windows Server 2012 R2 template.

	$locName="West US"
	$rgName="TestRG1"
	New-AzureResourceGroup -Name $rgName -Location $locName -GalleryTemplateIdentity Microsoft.WindowsServer2012R2Datacenter.0.2.57-preview

You would see something like this.

	cmdlet New-AzureResourceGroup at command pipeline position 1
	Supply values for the following parameters:
	(Type !? for Help.)
	newStorageAccountName: saWindowsVM
	newDomainName: contoso.com
	newVirtualNetworkName: WEB07
	vnetAddressSpace: 10.0.0.0/16
	...

To remove this resource group and all of its resources (the storage account, virtual machine, and virtual network), use this command.

	Remove-AzureResourceGroup –Name "<resource group name>"

## Deploy a VM with a Resource Manager template using xplat-cli

Follow these steps to deploy a VM using a Resource Manager template in the Template Gallery using xplat-cli commands.

## Additional Resources

To learn more about Azure Resource Manager, click here [link TBD]

To get real-world tips and tricks from the Windows PowerShell community, see the [“Hey, Scripting Guy!” blog](http://blogs.technet.com/b/heyscriptingguy/).

To see a list of PowerShell cmdlets available for Virtual Machines, see our [PowerShell reference on MSDN](https://msdn.microsoft.com/library/azure/jj554330.aspx).


