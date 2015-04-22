<properties 
	pageTitle="Create a Windows virtual machine with a Resource Manager template and PowerShell" 
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
	ms.date="04/29/2015" 
	ms.author="josephd"/>

# Create a Windows virtual machine with a Resource Manager template and PowerShell

You can easily create a new Windows-based Azure virtual machine (VM) using a Resource Manager template with Azure PowerShell. This template creates a single virtual machine running Windows in a new virtual network with a single subnet in a new resource group.

![](./media/virtual-machines-create-windows-powershell-rm-template-simple/windowsvm.png)
 
Before you dive in, make sure you have Azure and PowerShell configured and ready to go.

[AZURE.INCLUDE [arm-getting-setup-powershell](../includes/arm-getting-setup-powershell.md)]


Follow these steps to create a Windows VM using a Resource Manager template in the Github template repository with Azure PowerShell.

## Step 1: Download the JSON file for the template.
Designate a local folder as the location for the JSON template file and create it (for example, C:\Azure\Templates\WindowsVM). Fill in the folder name and run these commands.

	$folderName="<folder name, such as C:\Azure\Templates\WindowsVM>"
	$webclient = New-Object System.Net.WebClient
	$url = "https://raw.githubusercontent.com/azurermtemplates/azurermtemplates/master/101-simple-vm-from-image/azuredeploy.json"
	$filePath = $folderName + "\azuredeploy.json"
	$webclient.DownloadFile($url,$filePath) 

When you create a VM with a template, you must specify a set of configuration parameters. To see the parameters that you need to specify for the template in a local JSON file before running the command to create the virtual machine, open the JSON file in a tool or text editor of your choice. 

## Step 2: Obtain the image file name.

If you already know the image name for the virtual machine that you are going to create, such as **a699494373c04fc0bc8f2bb1389d6106__Windows-Server-2012-R2-201503.01-en.us-127GB.vhd**, skip this step. Otherwise, to obtain the image name for the virtual machine that you want to create, use these commands at the Azure PowerShell command prompt to see a list of image family names.

	Switch-AzureMode AzureServiceManagement
	Get-AzureVMImage | select ImageFamily –Unique

Here are some examples of ImageFamily values for Windows-based computers:

- Windows Server 2012 R2 Datacenter 
- Windows Server 2008 R2 SP1 
- Windows Server Technical Preview 
- SQL Server 2012 SP1 Enterprise on Windows Server 2012 

Replace your chosen ImageFamily value in these commands and run them.

	$family="<ImageFamily value>"
	$imagename=Get-AzureVMImage | where { $_.ImageFamily -eq $family } | sort PublishedDate -Descending | select -ExpandProperty ImageName -First 1
	Write-Host $imagename

Copy the display of the **Write-Host** command to the clipboard or a text file. 

Next, switch Azure PowerShell back to the Resource Manager module. 

	Switch-AzureMode AzureResourceManager

## Step 3: Create the virtual machine with the template.

Fill in an Azure deployment name, Resource Group name, Azure location, the folder for your saved JSON file, and then run these commands.

	$deployName="<deployment name>"
	$RGName="<resource group name>"
	$locName="<Azure location, such as West US>"
	$folderName="<folder name, such as C:\Azure\Templates\WindowsVM>" 
	$templateFile= $folderName + "\azuredeploy.json"
	New-AzureResourceGroup –Name $RGName –Location $locName
	New-AzureResourceGroupDeployment -Name $deployName -ResourceGroupName $RGName -TemplateFile $templateFile

When you run the **New-AzureResourceGroupDeployment** command, you will be prompted to supply the values of parameters in the "parameters" section of the JSON file. When you have specified all the parameter values, the command creates the resource group and the virtual machine. 

> [AZURE.NOTE] For the vmSourceImageName parameter, paste in the image name you copied from Step 3.
Here is an example of the PowerShell command set for the azuredeploy.json template.

	$deployName="TestDeployment"
	$RGName="TestRG"
	$locname="West US"
	$folderName="C:\Azure\Templates\WindowsVM"
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

## Additional Resources

[Virtual machines documentation](http://azure.microsoft.com/documentation/services/virtual-machines/)

[Azure virtual machines FAQ](http://msdn.microsoft.com/library/azure/dn683781.aspx)

[Overview of Azure Virtual Machines](http://msdn.microsoft.com/library/azure/jj156143.aspx)

[How to install and configure Azure PowerShell](install-configure-powershell.md)

[Use Azure PowerShell to create and preconfigure Windows-based Virtual Machines](virtual-machines-ps-create-preconfigure-windows-vms.md)

