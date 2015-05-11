<properties 
	pageTitle="Create an availability set using Azure Resource Manager templates" 
	description="Describes how to use the availability set template and includes template syntax" 
	services="virtual-machines" 
	documentationCenter="" 
	authors="KBDAzure" 
	manager="timlt" 
	editor=""/>

<tags 
	ms.service="virtual-machines" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/04/2015" 
	ms.author="kathydav"/>

# Create an availability set using Azure Resource Manager templates

You can easily create an availability set for a virtual machine by using Azure PowerShell or the Azure Command Line (CLI) and a Resource Manager template. This template creates an availability set.
 
Before you dive in, make sure you have Azure PowerShell and Azure CLI configured and ready to go.

[AZURE.INCLUDE [arm-getting-setup-powershell](../includes/arm-getting-setup-powershell.md)]

[AZURE.INCLUDE [xplat-getting-set-up](../includes/xplat-getting-set-up.md)]


## Create an availability set with a Resource Manager template

Follow these steps to create an availability set for a virtual machine using a Resource Manager template in the Github template repository with Azure PowerShell.

### Step 1: Download the JSON file

Designate a local folder as the location for the JSON template files and create it (for example, C:\Azure\Templates\availability).

Replace the folder name, then copy and run these commands.

	$folderName="<folder name, such as C:\Azure\Templates\availability>"
	$webclient = New-Object System.Net.WebClient
	$url = "https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/201-2-vms-2-FDs-no-resource-loops/azuredeploy.json"
	$filePath = $folderName + "\azuredeploy.json"
	$webclient.DownloadFile($url,$filePath) 

### Step 2: Gather the details for required parameters

When you use a template, you'll need to provide details such as location, set name, and so on. To find out what parameters are required for a template, do one of the following:

- Review the list of parameters [here](http://azure.microsoft.com/en-us/documentation/templates/201-2-vms-2-FDs-no-resource-loops/).
- Open the JSON file in a tool or text editor of your choice. Look for the "parameters" section at the top of the file, which lists the set of parameters that are needed by the template to configure the virtual machine. 

Gather the required information so you'll have it ready to enter. When you run the command to deploy the template, you'll be prompted for the information.

### Step 3: Create the availability set

The following sections show you how to use Azure PowerShell or Azure CLI to do this.

### Use Azure PowerShell

Fill in an Azure deployment name, Resource Group name, Azure location, the folder for your saved JSON file, and then run these commands.

	$deployName="<deployment name>"
	$RGName="<resource group name>"
	$locName="<Azure location, such as West US>"
	$folderName="<folder name, such as C:\Azure\Templates\availability>" 
	$templateFile= $folderName + "\azuredeploy.json"
	New-AzureResourceGroup –Name $RGName –Location $locName
	New-AzureResourceGroupDeployment -Name $deployName -ResourceGroupName $RGName -TemplateFile $templateFile

When you run the **New-AzureResourceGroupDeployment** command, you'll be prompted to supply the values for parameters in the **"parameters"** section of the JSON file. After you've done this, the command creates the resource group and the availability set. 

Here is an example of the PowerShell command set for the template.

	$deployName="TestDeployment"
	$RGName="TestRG"
	$locname="West US"
	$folderName="C:\Azure\Templates\[thing]"
	$templateFile= $folderName + "\azuredeploy.json"
	New-AzureResourceGroup –Name $RGName –Location $locName
	New-AzureResourceGroupDeployment -Name $deployName -ResourceGroupName $RGName -TemplateFile $templateFile

You would see something like this.

	cmdlet New-AzureResourceGroup at command pipeline position 1
	Supply values for the following parameters:
	(Type !? for Help.)
	newStorageAccountName: saTest
	dnsNameForPublicIP: 131.107.89.211
	adminUserName: WebAdmin1
	adminPassword: *******
	vmSourceImageName: a699494373c04fc0bc8f2bb1389d6106__Windows-Server-2012-R2-201503.01-en.us-127GB.vhd
	...

To remove this resource group and all of its resources (the storage account, virtual machine, and virtual network), use this command.

	Remove-AzureResourceGroup –Name "<resource group name>"


## Use Azure CLI

Follow these steps to create the availability set using a Resource Manager template in the Github template repository with an Azure CLI command.

	azure group deployment create <my-resource-group> <my-deployment-name> --template-uri https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/201-2-vms-2-FDs-no-resource-loops/azuredeploy.json





