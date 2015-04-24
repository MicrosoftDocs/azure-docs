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
	ms.date="04/20/2015" 
	ms.author="kathydav"/>

# Create an availability set using Azure Resource Manager templates

You can easily create an availability set for a virtual machine by using Azure PowerShell or the xplat-cli and a Resource Manager template. This template creates an availability set.
 
Before you dive in, make sure you have Azure PowerShell and xplat-cli configured and ready to go.

[AZURE.INCLUDE [arm-getting-setup-powershell](../includes/arm-getting-setup-powershell.md)]

[AZURE.INCLUDE [xplat-getting-set-up](../includes/xplat-getting-set-up.md)]


## [do something] with a Resource Manager template using Azure PowerShell

Follow these steps to [do something] using a Resource Manager template in the Github template repository with Azure PowerShell.

### Step 1: Download the JSON file

Designate a local folder as the location for the JSON template files and create it (for example, C:\Azure\Templates\[thing]).

Replace the folder name, then copy and run these commands.

	$folderName="<folder name, such as C:\Azure\Templates\[thing]>"
	$webclient = New-Object System.Net.WebClient
	$url = "[Writers: add the URL to the RAW version of the target template in GitHub]"
	$filePath = $folderName + "\azuredeploy.json"
	$webclient.DownloadFile($url,$filePath) 

### Step 2: (optional) View the parameters

When you [do something] with a template, you must specify a set of configuration parameters. To see the parameters that you need to specify for the template in a local JSON file before running the command to create the virtual machine, open the JSON file in a tool or text editor of your choice. 
Look for the "parameters" section at the top of the file, which lists the set of parameters that are needed by the template to configure the virtual machine. Here is the **"parameters"** section for the azuredeploy.json template:

[Note to writers: Paste in the "parameters" section of the azuredeploy.json and format as code.]

### Step 3: Obtain [information needed to complete the template].

[Note to writers: optional section to gather parameter values if needed.]

### Step 4: [do the thing] with the template.

Fill in an Azure deployment name, Resource Group name, Azure location, the folder for your saved JSON file, and then run these commands.

	$deployName="<deployment name>"
	$RGName="<resource group name>"
	$locName="<Azure location, such as West US>"
	$folderName="<folder name, such as C:\Azure\Templates\[thing]>" 
	$templateFile= $folderName + "\azuredeploy.json"
	New-AzureResourceGroup –Name $RGName –Location $locName
	New-AzureResourceGroupDeployment -Name $deployName -ResourceGroupName $RGName -TemplateFile $templateFile

When you run the **New-AzureResourceGroupDeployment** command, you will be prompted to supply the values for parameters in the **"parameters"** section of the JSON file. After you've done this, the command creates the resource group and the availability set. 

Here is an example of the PowerShell command set for the template.

	$deployName="TestDeployment"
	$RGName="TestRG"
	$locname="West US"
	$folderName="C:\Azure\Templates\[thing]"
	$templateFile= $folderName + "\azuredeploy.json"
	New-AzureResourceGroup –Name $RGName –Location $locName
	New-AzureResourceGroupDeployment -Name $deployName -ResourceGroupName $RGName -TemplateFile $templateFile

You would see something like this.

[Note to writers: paste in the PowerShell display for the first few prompted parameters, replacing this:]

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


## [do a thing] with a Resource Manager template using xplat-cli

Follow these steps to [do something] using a Resource Manager template in the Github template repository with xplat-cli commands.

### Step 1: Download the JSON file for the template.

Designate a local folder as the location for the JSON template files and create it (for example, C:\Azure\Templates\[thing]).

Fill in the folder name and run these commands.

[xplat commands to download the template file]

### Step 2: (optional) View the parameters of the template.

When you [do something] with a template, you must specify a set of configuration parameters. To see the parameters that you need to specify for the template in a local JSON file before running the command to create the virtual machine, open the JSON file in a tool or text editor of your choice. 
Look for the "parameters" section at the top of the file, which lists the set of parameters that are needed by the template to configure the virtual machine. Here is the **"parameters"** section for the azuredeploy.json template:

[Note to writers: Paste in the "parameters" section of the azuredeploy.json and format as code.]

### Step 3: Obtain [information needed to complete the template].

[Note to writers: optional section to gather parameter values if needed.]

### Step 4: [do the thing] with the template.

Fill in [needed info} and then run these commands.

[xplat commands to run the template file]

[explanation of how xplat runs the template]


Here is an example of the xplat-cli command set for the template.

[xplat command example]

You would see something like this.

[Note to writers: paste in the xplat display for the first few prompted parameters]


To remove this resource group and all of its resources ([stuff in the resource group]), use this command.

[xplat command]



