<properties 
	pageTitle="Deploying Virtual Machines using Azure Resource Manager Templates and PowerShell" 
	description="Easily deploy the most common set of configurations for Azure virtual machines using Resource Manager Templates and PowerShell." 
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

# Deploying Virtual Machines using Azure Resource Manager Templates and PowerShell

All of the tasks you perform to deploy Azure Virtual Machines can be fully automated. This article provides guidance on how to automate common tasks for deploying and managing Azure Virtual Machines using Azure Resource Manager templates and Azure PowerShell as well as links to more documentation on automation for Virtual Machines. These tasks include:

- Deploy a VM in Azure 
- Create a custom VM image 


> [AZURE.NOTE] If you have not installed and configured Azure PowerShell, click [here](powershell-install-configure.md) for instructions

## Getting Ready

Before you can use Azure PowerShell with Resource Manager you will need to have right Windows PowerShell and Azure PowerShell versions.

### Step 1: Verify PowerShell versions

Verify you have Windows PowerShell Version 3.0 or 4.0. To find the version of Windows PowerShell, type this command at a Windows PowerShell command prompt.

	$PSVersionTable

You will receive the following type of information:

	Name                           Value
	----                           -----
	PSVersion                      3.0
	WSManStackVersion              3.0
	SerializationVersion           1.1.0.1
	CLRVersion                     4.0.30319.18444
	BuildVersion                   6.2.9200.16481
	PSCompatibleVersions           {1.0, 2.0, 3.0}
	PSRemotingProtocolVersion      2.2


Verify that the value of **PSVersion** is 3.0 or 4.0. If not, see [Windows Management Framework 3.0](http://www.microsoft.com/download/details.aspx?id=34595) or [Windows Management Framework 4.0](http://www.microsoft.com/download/details.aspx?id=40855).

You must also have Azure PowerShell version 0.8.0 or later. You can check the version of Azure PowerShell that you have installed with this command at the Azure PowerShell command prompt.

	Get-Module azure | format-table version

You will receive the following type of information:

	Version
	-------
	0.8.16.1

If you do not have 0.8.0 or later, see [How to Install and Configure Azure PowerShell](powershell-install-configure.md).

### Step 2: Set your Azure account and subscription

If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](http://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free trial](http://azure.microsoft.com/pricing/free-trial/).

You can list your Azure subscriptions with this command.

	Get-AzureSubscription

You will receive the following type of information:

	SubscriptionId            : fd22919d-eaca-4f2b-841a-e4ac6770g92e
	SubscriptionName          : Visual Studio Ultimate with MSDN
	Environment               : AzureCloud
	SupportedModes            : AzureServiceManagement,AzureResourceManager
	DefaultAccount            : johndoe@contoso.com
	Accounts                  : {johndoe@contoso.com}
	IsDefault                 : False
	IsCurrent                 : False
	CurrentStorageAccountName : 
	TenantId                  : 32fa88b4-86f1-419f-93ab-2d7ce016dba7

For the subscription into which you want to deploy new resources, note the **Accounts** property. Run this command to login to Azure using an account listed in the **Accounts** property.

	Add-AzureAccount

Specify the email address of the account and its password in the Microsoft Azure sign-in dialog.

Set your Azure subscription by running these commands at the Azure PowerShell command prompt. Replace everything within the quotes, including the < and > characters, with the correct name.

	$subscr="<subscription name>"
	Select-AzureSubscription -SubscriptionName $subscr –Current
	Set-AzureSubscription -SubscriptionName $subscr

You can get the correct subscription name from the **SubscriptionName** property of the display of the **Get-AzureSubscription** command.

For more information about Azure subscriptions and accounts, see [How to: Connect to your subscription](powershell-install-configure.md#Connect).

### Step 3: Switch to the Azure Resource Manager module

In order to use the Azure Resource Manager module you will need to switch from the default set of Azure commands to the Azure Resource Manager set of commands. Run this command.

	Switch-AzureMode AzureResourceManager

> [AZURE.NOTE] You can switch back to the default set of commands with the **Switch-AzureMode AzureServiceManagement** command.

## Understanding Azure Resource Templates and Resource Groups

Most applications that are deployed and run in Microsoft Azure are built out of a combination of different cloud resource types (such as one or more VMs and Storage accounts, a SQL database, a Virtual Network, or a CDN). *Azure Resource Manager Templates* make it possible for you to deploy and manage these different resources together by using a JSON description of the resources and associated configuration and deployment parameters. 

Once you have defined a JSON-based resource template, you can execute it and have the resources defined within it deployed in Azure using a PowerShell command. You can run these commands either standalone within the PowerShell command shell, or integrate it within a script that contains additional automation logic.

The resources you create using Azure Resource Manager Templates will be deployed to either a new or existing Azure Resource Group. An *Azure Resource Group* allows you to manage multiple deployed resources together as a logical group; this allows you to manage the overall lifecycle of the group/application and provide management APIs that allow you to:

- Stop, start, or delete all of the resources within the group at once. 
- Apply Role-Based Access Control (RBAC) rules to lock down security permissions on them. 
- Audit operations. 
- Tag resources with additional meta-data for better tracking. 

You can learn more about Azure Resource Groups here [[link to main ARM content]].

## Common Task: Deploy a VM in Azure

Use the instructions in these sections to deploy a new Azure VM using a Resource Manager Template and Azure PowerShell. This template creates a single virtual machine in a new virtual network with a single subnet.

![](./media/virtual-machines-deploy-rmtemplates-powershell/new-vm.png)
 
Follow these steps to deploy a VM using a Resource Manager template with Azure PowerShell commands.

### Step 1: Create the JSON file for the template.

Here are the contents of the JSON file for the template.

	{
	    "$schema": "http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json",
	    "contentVersion": "1.0.0.0",
	    "parameters" : {
	        "newStorageAccountName": {
	            "type": "string",
	            "defaultValue" : "uniqueStorageAccountName"
	        },
	        "dnsNameForPublicIP" : {
	            "type" : "string",
	            "defaultValue": "uniqueDnsNameForPublicIP"
	        },
	        "adminUserName": {
	            "type": "string"
	        },
	        "adminPassword": {
	            "type": "securestring"
	        },
	        "vmSourceImageName": {
	            "type": "string",
	            "defaultValue": "a699494373c04fc0bc8f2bb1389d6106__Windows-Server-2012-Datacenter-201503.01-en.us-127GB.vhd"
	        },
	        "location": {
	            "type": "String",
	            "defaultValue" : "West US"
	        },
	        "vmSize": {
	            "type": "string",
	            "defaultValue": "Standard_A2"
	        },
	        "publicIPAddressName": {
	            "type": "string",
	            "defaultValue" : "myPublicIP"
	        },
	        "vmName": {
	            "type": "string",
	            "defaultValue" : "myVM"
	        },
	        "virtualNetworkName":{
	            "type" : "string",
	            "defaultValue" : "myVNET"
	        },
	        "nicName":{
	            "type" : "string",
	            "defaultValue":"myNIC"
	        },
	        "vmExtensionName":{
	            "type" : "string",
	            "defaultValue":"myExtension"
	        },
	        "vmDiagnosticsStorageAccountResourceGroup":{
	            "type" : "string"
	        },
	        "vmDiagnosticsStorageAccountName":{
	            "type" : "string"
	        }
    	},
	    "variables": {
	        "addressPrefix":"10.0.0.0/16",
	        "subnet1Name": "Subnet-1",
	        "subnet2Name": "Subnet-2",
	        "subnet1Prefix" : "10.0.0.0/24",
	        "subnet2Prefix" : "10.0.1.0/24",
	        "vmStorageAccountContainerName": "vhds",
	        "publicIPAddressType" : "Dynamic",
	        "storageAccountType": "Standard_LRS",
	        "sourceImageName" : "[concat('/',subscription().subscriptionId,'/services/images/',parameters('vmSourceImageName'))]",
	        "vnetID":"[resourceId('Microsoft.Network/virtualNetworks',parameters('virtualNetworkName'))]",
	        "subnet1Ref" : "[concat(variables('vnetID'),'/subnets/',variables('subnet1Name'))]",
	        "dataDisk1VhdName" : "[concat('http://',parameters('newStorageAccountName'),'.blob.core.windows.net/',variables('vmStorageAccountContainerName'),'/',parameters('vmName'),'dataDisk1.vhd')]",
	        "accountid": "[concat('/subscriptions/',subscription().subscriptionId,'/resourceGroups/',parameters('vmDiagnosticsStorageAccountResourceGroup'),'/providers/','Microsoft.Storage/storageAccounts/', parameters('vmDiagnosticsStorageAccountName'))]"
	    },
	    "resources": [
	    {
	      "type": "Microsoft.Storage/storageAccounts",
	      "name": "[parameters('newStorageAccountName')]",
	      "apiVersion": "2014-12-01-preview",
	      "location": "[parameters('location')]",
	      "properties": {
	        "accountType": "[variables('storageAccountType')]"
	      }
    	},
	    {
	        "apiVersion": "2014-12-01-preview",
	        "type": "Microsoft.Network/publicIPAddresses",
	        "name": "[parameters('publicIPAddressName')]",
	        "location": "[parameters('location')]",
	        "properties": {
	            "publicIPAllocationMethod": "[variables('publicIPAddressType')]",
	            "dnsSettings": {
	                "domainNameLabel": "[parameters('dnsNameForPublicIP')]"
	            }
	        }
	    },
	    {
	      "apiVersion": "2014-12-01-preview",
	      "type": "Microsoft.Network/virtualNetworks",
	      "name": "[parameters('virtualNetworkName')]",
	      "location": "[parameters('location')]",
	      "properties": {
	        "addressSpace": {
	          "addressPrefixes": [
	            "[variables('addressPrefix')]"
	          ]
	        },
	        "subnets": [
	          {
	            "name": "[variables('subnet1Name')]",
	            "properties" : {
	                "addressPrefix": "[variables('subnet1Prefix')]"
	            }
	          },
	          {
	            "name": "[variables('subnet2Name')]",
	            "properties" : {
	                "addressPrefix": "[variables('subnet2Prefix')]"
	            }
	          }
	        ]
	      }
    	},
	    {
	        "apiVersion": "2014-12-01-preview",
	        "type": "Microsoft.Network/networkInterfaces",
	        "name": "[parameters('nicName')]",
	        "location": "[parameters('location')]",
	        "dependsOn": [
	            "[concat('Microsoft.Network/publicIPAddresses/', parameters('publicIPAddressName'))]",
	            "[concat('Microsoft.Network/virtualNetworks/', parameters('virtualNetworkName'))]"
	        ],
	        "properties": {
	            "ipConfigurations": [
	            {
	                "name": "ipconfig1",
	                "properties": {
	                    "privateIPAllocationMethod": "Dynamic",
	                    "publicIPAddress": {
	                        "id": "[resourceId('Microsoft.Network/publicIPAddresses',parameters('publicIPAddressName'))]"
	                    },
	                    "subnet": {
	                        "id": "[variables('subnet1Ref')]"
	                    }
	                }
	            }
	            ]
	        }
	    },
	    {
	        "apiVersion": "2014-12-01-preview",
	        "type": "Microsoft.Compute/virtualMachines",
	        "name": "[parameters('vmName')]",
	        "location": "[parameters('location')]",
	        "dependsOn": [
	            "[concat('Microsoft.Storage/storageAccounts/', parameters('newStorageAccountName'))]",
	            "[concat('Microsoft.Network/networkInterfaces/', parameters('nicName'))]"
	        ],
	        "properties": {
	            "hardwareProfile": {
	                "vmSize": "[parameters('vmSize')]"
	            },
	            "osProfile": {
	                "computername": "[parameters('vmName')]",
	                "adminUsername": "[parameters('adminUsername')]",
	                "adminPassword": "[parameters('adminPassword')]"
	            },
	            "storageProfile": {
	                "sourceImage": {
	                    "id": "[variables('sourceImageName')]"
	                },
	
	                "dataDisks" : [
	                    {
	                        "name" : "datadisk1",
	                        "diskSizeGB" : "100",
	                        "lun" : 0,
	                        "vhd":{
	                            "Uri" : "[variables('dataDisk1VhdName')]"
	                        }
	                    }
	                ],
	                "destinationVhdsContainer" : "[concat('http://',parameters('newStorageAccountName'),'.blob.core.windows.net/',variables('vmStorageAccountContainerName'),'/')]"
	            },
	            "networkProfile": {
	                "networkInterfaces" : [
	                {
	                    "id": "[resourceId('Microsoft.Network/networkInterfaces',parameters('nicName'))]"
	                }
	                ]
	            }
	        }
	    },
	    {
	        "type": "Microsoft.Compute/virtualMachines/extensions",
	        "name": "[concat(parameters('vmName'),'/', parameters('vmExtensionName'))]",
	        "apiVersion": "2014-12-01-preview",
	        "location": "[parameters('location')]",
	        "dependsOn": [
	            "[concat('Microsoft.Compute/virtualMachines/', parameters('vmName'))]"
	        ],
	        "properties": {
	            "publisher": "Microsoft.Azure.Diagnostics",
	            "type": "IaaSDiagnostics",
	            "typeHandlerVersion": "1.2",
	            "settings": {
	                	"xmlCfg":"PFdhZENmZz4NCiAgICAgICAgPERpYWdub3N0aWNNb25pdG9yQ29uZmlndXJhdGlvbiBvdmVyYWxsUXVvdGFJbk1CPSIyNTAwMCI+DQogICAgICAgIDxQZXJmb3JtYW5jZUNvdW50ZXJzIHNjaGVkdWxlZFRyYW5zZmVyUGVyaW9kPSJQVDFNIj4NCiAgICAgICAgICAgIDxQZXJmb3JtYW5jZUNvdW50ZXJDb25maWd1cmF0aW9uIGNvdW50ZXJTcGVjaWZpZXI9IlxQcm9jZXNzb3IoX1RvdGFsKVwlIFByb2Nlc3NvciBUaW1lIiBzYW1wbGVSYXRlPSJQVDFNIiB1bml0PSJwZXJjZW50IiAvPg0KICAgICAgICAgICAgPFBlcmZvcm1hbmNlQ291bnRlckNvbmZpZ3VyYXRpb24gY291bnRlclNwZWNpZmllcj0iXE1lbW9yeVxDb21taXR0ZWQgQnl0ZXMiIHNhbXBsZVJhdGU9IlBUMU0iIHVuaXQ9ImJ5dGVzIi8+DQogICAgICAgICAgICA8L1BlcmZvcm1hbmNlQ291bnRlcnM+DQogICAgICAgICAgICA8RXR3UHJvdmlkZXJzPg0KICAgICAgICAgICAgICAgIDxFdHdFdmVudFNvdXJjZVByb3ZpZGVyQ29uZmlndXJhdGlvbiBwcm92aWRlcj0iU2FtcGxlRXZlbnRTb3VyY2VXcml0ZXIiIHNjaGVkdWxlZFRyYW5zZmVyUGVyaW9kPSJQVDVNIj4NCiAgICAgICAgICAgICAgICAgICAgPEV2ZW50IGlkPSIxIiBldmVudERlc3RpbmF0aW9uPSJFbnVtc1RhYmxlIi8+DQogICAgICAgICAgICAgICAgICAgIDxFdmVudCBpZD0iMiIgZXZlbnREZXN0aW5hdGlvbj0iTWVzc2FnZVRhYmxlIi8+DQogICAgICAgICAgICAgICAgICAgIDxFdmVudCBpZD0iMyIgZXZlbnREZXN0aW5hdGlvbj0iU2V0T3RoZXJUYWJsZSIvPg0KICAgICAgICAgICAgICAgICAgICA8RXZlbnQgaWQ9IjQiIGV2ZW50RGVzdGluYXRpb249IkhpZ2hGcmVxVGFibGUiLz4NCiAgICAgICAgICAgICAgICAgICAgPERlZmF1bHRFdmVudHMgZXZlbnREZXN0aW5hdGlvbj0iRGVmYXVsdFRhYmxlIiAvPg0KICAgICAgICAgICAgICAgIDwvRXR3RXZlbnRTb3VyY2VQcm92aWRlckNvbmZpZ3VyYXRpb24+DQogICAgICAgICAgICA8L0V0d1Byb3ZpZGVycz4NCiAgICAgICAgPC9EaWFnbm9zdGljTW9uaXRvckNvbmZpZ3VyYXRpb24+DQogICAgPC9XYWRDZmc+",
	                "StorageAccount":"[parameters('vmDiagnosticsStorageAccountName')]"
	            },
	            "protectedSettings": {
	                "storageAccountName": "[parameters('vmDiagnosticsStorageAccountName')]",
	                "storageAccountKey": "[listKeys(variables('accountid'),'2014-12-01-preview').key1]",
	                "storageAccountEndPoint": "https://core.windows.net/"
	            }
	        }
	    }
	  ]
	}

Copy the contents into a text editor of your choice and save it to a local folder with the name **azuredeploy.json**. 

We are also building a repository of templates in GitHub that customers can use and contribute to.  

## Step 2: Obtain the image file name.

If you already know the image name for the virtual machine that you are going to create, such as **a699494373c04fc0bc8f2bb1389d6106__Windows-Server-2012-R2-201503.01-en.us-127GB.vhd**, skip this step. 

Otherwise, to obtain the image name for the virtual machine that you want to create, use these commands at the Azure PowerShell command prompt to see a list of image family names.

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

You will receive the following type of information:

	PS C:\> $family="Windows Server 2012 R2 Datacenter"
	PS C:\> $imagename=Get-AzureVMImage | where { $_.ImageFamily -eq $family } | sort PublishedDate -Descending | select -ExpandProperty ImageName -First 1
	VERBOSE: 8:07:54 AM - Begin Operation: Get-AzureVMImage
	VERBOSE: 8:07:58 AM - Completed Operation: Get-AzureVMImage
	VERBOSE: 8:07:58 AM - Begin Operation: Get-AzureVMImage
	VERBOSE: 8:07:59 AM - Completed Operation: Get-AzureVMImage
	PS C:\> Write-Host $imagename
	a699494373c04fc0bc8f2bb1389d6106__Windows-Server-2012-R2-201503.01-en.us-127GB.vhd

Copy the display of the Write-Host command to the clipboard or a text file. This will be the vmSourceImageName you will use below in Step 3 to create the VM.

Next, switch Azure PowerShell back to the Resource Manager module using the Switch-AzureMode command. 

	Switch-AzureMode AzureResourceManager

### Step 3: Create the virtual machine with the template.

To create the virtual machine, replace the elements within the “< >” with your specific information and run these commands:

	$deployName="<deployment name>"
	$RGName="<resource group name>"
	$locName="<Azure location, such as West US>"
	$folderName="<folder name containing the azuredeploy.json file>" 
	$templateFile= $folderName + "\azuredeploy.json"
	New-AzureResourceGroup –Name $RGName –Location $locName
	New-AzureResourceGroupDeployment -Name $deployName -ResourceGroupName $RGName -TemplateFile $templateFile

You will be prompted to supply the values of parameters in the **"parameters"** section of the JSON file. When you have specified all the parameter values, Azure Resource Manager creates the resource group and the virtual machine. 

Here is an example:

	$deployName="TestDeployment"
	$RGName="TestRG"
	$locname="West US"
	$folderName="C:\Azure\Templates\WindowsVM"
	$templateFile= $folderName + "\azuredeploy.json"
	New-AzureResourceGroup –Name $RGName –Location $locName
	New-AzureResourceGroupDeployment -Name $deployName -ResourceGroupName $RGName -TemplateFile $templateFile

You will receive the following type of information:

	cmdlet New-AzureResourceGroup at command pipeline position 1
	Supply values for the following parameters:
	(Type !? for Help.)
	newStorageAccountName: saTest
	dnsNameForPublicIP: 131.107.89.211
	adminUserName: WebAdmin1
	adminPassword: *******
	vmSourceImageName: a699494373c04fc0bc8f2bb1389d6106__Windows-Server-2012-R2-201503.01-en.us-127GB.vhd
	...

## Common Task: Create a custom VM image

Use the instructions in these sections to create a custom VM image in Azure with a Resource Manager template using Azure PowerShell. This template creates a single virtual machine from a specified virtual hard disk (VHD).

### Step 1: Create the JSON file for the template.

Here are the contents of the JSON file for the template.

	{
	    "$schema": "http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json",
	    "contentVersion": "1.0.0.0",
	    "parameters": {
	        "osDiskVhdUri": {
	            "type": "string",
	            "metadata": {
	                "Description": "Uri of the existing VHD"
	            }
	        },
	        "osType": {
	            "type": "string",
	            "allowedValues": [
	                "windows",
	                "linux"
	            ],
	            "metadata": {
	                "Description": "Type of OS on the existing vhd"
	            }
	        },
	        "location": {
	            "type": "String",
	            "defaultValue": "West US",
	            "metadata": {
	                "Description": "Location to create the VM in"
	            }
	        },
	        "vmSize": {
	            "type": "string",
	            "defaultValue": "Standard_A2",
	            "metadata": {
	                "Description": "Size of the VM"
	            }
	        },
	        "vmName": {
	            "type": "string",
	            "defaultValue": "myVM",
	            "metadata": {
	                "Description": "Name of the VM"
	            }
	        },
	        "nicName": {
	            "type": "string",
	            "defaultValue": "myNIC",
	            "metadata": {
	                "Description": "NIC to attach the new VM to"
	            }
	        }
	    },
	    "resources": [{
	        "apiVersion": "2014-12-01-preview",
	        "type": "Microsoft.Compute/virtualMachines",
	        "name": "[parameters('vmName')]",
	        "location": "[parameters('location')]",
	        "properties": {
	            "hardwareProfile": {
	                "vmSize": "[parameters('vmSize')]"
	            },
	            "storageProfile": {
	                "osDisk": {
	                    "name": "[concat(parameters('vmName'),'-osDisk')]",
	                    "osType": "[parameters('osType')]",
	                    "caching": "ReadWrite",
	                    "vhd": {
	                        "uri": "[parameters('osDiskVhdUri')]"
	                    }
	                }
	            },
	            "networkProfile": {
	                "networkInterfaces": [{
	                    "id": "[resourceId('Microsoft.Network/networkInterfaces',parameters('nicName'))]"
	                }]
	            }
	        }
	    }]
	}

Copy the contents into a text editor of your choice and save it to a local folder with the name **azuredeploy.json**. 

## Step 2: Obtain the VHD.

For a Windows-based virtual machine, see [Create and upload a Windows Server VHD to Azure](virtual-machines-create-upload-vhd-windows-server.md).

For a Linux-based virtual machine, see [Create and upload a Linux VHD in Azure](virtual-machines-linux-create-upload-vhd.md).

### Step 3: Create the virtual machine with the template.

To create an new virtual machine based on the VHD, replace the elements within the “< >” with your specific information and run these commands:

	$deployName="<deployment name>"
	$RGName="<resource group name>"
	$locName="<Azure location, such as West US>"
	$folderName="<folder name containing the azuredeploy.json file>" 
	$templateFile= $folderName + "\azuredeploy.json"
	New-AzureResourceGroup –Name $RGName –Location $locName
	New-AzureResourceGroupDeployment -Name $deployName -ResourceGroupName $RGName -TemplateFile $templateFile

You will be prompted to supply the values of parameters in the "parameters" section of the JSON file. When you have specified all the parameter values, Azure Resource Manager creates the resource group and the virtual machine.

Here is an example:

	$deployName="TestDeployment"
	$RGName="TestRG"
	$locname="West US"
	$folderName="C:\Azure\Templates\CustomVM"
	$templateFile= $folderName + "\azuredeploy.json"
	New-AzureResourceGroup –Name $RGName –Location $locName
	New-AzureResourceGroupDeployment -Name $deployName -ResourceGroupName $RGName -TemplateFile $templateFile

You will receive the following type of information:

	cmdlet New-AzureResourceGroup at command pipeline position 1
	Supply values for the following parameters:
	(Type !? for Help.)
	osDiskVhdUri: [[need to add here]]
	osType: windows
	location: West US
	vmSize: Standard_A3
	...




## Additional Resources

[Virtual machines documentation](http://azure.microsoft.com/documentation/services/virtual-machines/)

[Azure virtual machines FAQ](http://msdn.microsoft.com/library/azure/dn683781.aspx)

[Overview of Azure Virtual Machines](http://msdn.microsoft.com/library/azure/jj156143.aspx)

[How to install and configure Azure PowerShell](install-configure-powershell.md)


