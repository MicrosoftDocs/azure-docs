<properties
	pageTitle="Create a VM with a Resource Manager template | Microsoft Azure"
	description="Use a Resource Manager template and PowerShell to easily create a new Windows virtual machine."
	services="virtual-machines-windows"
	documentationCenter=""
	authors="davidmu1"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="na"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/06/2016"
	ms.author="davidmu"/>

# Create a Windows virtual machine with a Resource Manager template

This article introduces you to an Azure Resource Manager template and shows you how to use PowerShell to deploy it. The template deploys a single virtual machine running Windows Server in a new virtual network with a single subnet.

It should take about 20 minutes to do the steps in this article.

> [AZURE.IMPORTANT] If you want your VM to be part of an availability set, add it to the set when you create the VM. There currently isn't a way to add a VM to an availability set after it has been created.

## Step 1: Create the template file

You can create your own template using the information found in [Authoring Azure Resource Manager templates](../resource-group-authoring-templates.md). You can also deploy templates that have been created for you from [Azure Quickstarts Templates](https://azure.microsoft.com/documentation/templates/).

1. Open your favorite text editor and add the required schema element and the required contentVersion element:

        {
          "$schema": "http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
        }
2. [Parameters](../resource-group-authoring-templates.md#parameters) are not always required, but they provide a way to input values when the template is deployed. Add the parameters element and its child elements after the contentVersion element:

        {
          "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
          "contentVersion": "1.0.0.0",
          "parameters": {
            "adminUserName": { "type": "string" },
            "adminPassword": { "type": "securestring" }
          },
        }

3. [Variables](../resource-group-authoring-templates.md#variables) can be used in a template to specify values that may change frequently or values that need to be created from a combination of parameter values. Add the variables element after the parameters section:

        {
          "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
          "contentVersion": "1.0.0.0",
          "parameters": {
            "adminUsername": { "type": "string" },
            "adminPassword": { "type": "securestring" }
          },
          "variables": {
            "vnetID":"[resourceId('Microsoft.Network/virtualNetworks','myvn1')]",
            "subnetRef": "[concat(variables('vnetID'),'/subnets/mysn1')]"  
          },
        }
        
4. [Resources](../resource-group-authoring-templates.md#resources) such as the virtual machine, the virtual network, and the storage account are defined next in the template. Add the resources section after the variables section:

        {
          "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
          "contentVersion": "1.0.0.0",
          "parameters": {
            "adminUsername": { "type": "string" },
            "adminPassword": { "type": "securestring" }
          },
          "variables": {
            "vnetID":"[resourceId('Microsoft.Network/virtualNetworks','myvn1')]",
            "subnetRef": "[concat(variables('vnetID'),'/subnets/mysn1')]"
          },
          "resources": [
            {
              "type": "Microsoft.Storage/storageAccounts",
              "name": "mystorage1",
              "apiVersion": "2015-06-15",
              "location": "[resourceGroup().location]",
              "properties": { "accountType": "Standard_LRS" }
            },
            {
              "apiVersion": "2016-03-30",
              "type": "Microsoft.Network/publicIPAddresses",
              "name": "myip1",
              "location": "[resourceGroup().location]",
              "properties": {
                "publicIPAllocationMethod": "Dynamic",
                "dnsSettings": { "domainNameLabel": "mydns1" }
              }
            },
            {
              "apiVersion": "2016-03-30",
              "type": "Microsoft.Network/virtualNetworks",
              "name": "myvnet1",
              "location": "[resourceGroup().location]",
              "properties": {
                "addressSpace": { "addressPrefixes": [ "10.0.0.0/16" ] },
                "subnets": [ {
                  "name": "mysn1",
                  "properties": { "addressPrefix": "10.0.0.0/24" }
                } ]
              }
            },
            {
              "apiVersion": "2016-03-30",
              "type": "Microsoft.Network/networkInterfaces",
              "name": "mync1",
              "location": "[resourceGroup().location]",
              "dependsOn": [
                "Microsoft.Network/publicIPAddresses/myip1",
                "Microsoft.Network/virtualNetworks/myvn1"
              ],
              "properties": {
                "ipConfigurations": [ {
                  "name": "ipconfig1",
                  "properties": {
                    "privateIPAllocationMethod": "Dynamic",
                    "publicIPAddress": {
                      "id": "[resourceId('Microsoft.Network/publicIPAddresses', 'myip1')]"
                    },
                    "subnet": { "id": "[variables('subnetRef')]" }
                  }
                } ]
              }
            },
            {
              "apiVersion": "2016-03-30",
              "type": "Microsoft.Compute/virtualMachines",
              "name": "myvm1",
              "location": "[resourceGroup().location]",
              "dependsOn": [
                "Microsoft.Network/networkInterfaces/mync1",
                "Microsoft.Storage/storageAccounts/mystorage1"
              ],
              "properties": {
                "hardwareProfile": { "vmSize": "Standard_A1" },
                "osProfile": {
                  "computerName": "myvm1",
                  "adminUsername": "[parameters('adminUsername')]",
                  "adminPassword": "[parameters('adminPassword')]"
                },
                "storageProfile": {
                  "imageReference": {
                    "publisher": "MicrosoftWindowsServer",
                    "offer": "WindowsServer",
                    "sku": "2012-R2-Datacenter",
                    "version" : "latest"
                  },
                  "osDisk": {
                    "name": "myosdisk1",
                    "vhd": {
                      "uri": "https://mystorage1.blob.core.windows.net/vhds/myosdisk1.vhd"
                    },
                    "caching": "ReadWrite",
                    "createOption": "FromImage"
                  }
                },
                "networkProfile": {
                  "networkInterfaces" : [ {
                    "id": "[resourceId('Microsoft.Network/networkInterfaces','mync1')]"
                  } ]
                }
              }
            } ]
          }
          
    >[AZURE.NOTE] This article creates a virtual machine running a version of the Windows Server operating system. To learn more about selecting other images, see [Navigate and select Azure virtual machine images with Windows PowerShell and the Azure CLI](virtual-machines-linux-cli-ps-findimage.md).  
            
2. Save the template file as *VirtualMachineTemplate.json*.

## Step 2: Create the parameters file

To specify values for the resource parameters that were defined in the template, create a parameters file that contains the values that are used when the template is deployed.

1. In the text editor, copy this JSON content to a new file called *Parameters.json*:

        {
          "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
          "contentVersion": "1.0.0.0",
          "parameters": {
            "adminUserName": { "value": "mytestacct1" },
            "adminPassword": { "value": "mytestpass1" }
          }
        }

    >[AZURE.NOTE] See more about [username and password requirements](virtual-machines-windows-faq.md#what-are-the-username-requirements-when-creating-a-vm).

2. Save the parameters file.

## Step 3: Install Azure PowerShell

See [How to install and configure Azure PowerShell](../powershell-install-configure.md) for information about installing the latest version of Azure PowerShell, selecting your subscription, and signing in to your account.

## Step 4: Create a resource group

All resources must be deployed in a [resource group](../resource-group-overview.md).

1. Get a list of available locations where resources can be created.

	    Get-AzureRmLocation | sort DisplayName | Select DisplayName

2. Replace the value of **$locName** with a location from the list, for example **Central US**. Create the variable.

        $locName = "location name"
        
3. Replace the value of **$rgName** with the name of the new resource group. Create the variable and the resource group.

        $rgName = "resource group name"
        New-AzureRmResourceGroup -Name $rgName -Location $locName
        
    You should see something like this example:
    
        ResourceGroupName : myrg1
        Location          : centralus
        ProvisioningState : Succeeded
        Tags              :
        ResourceId        : /subscriptions/{subscription-id}/resourceGroups/myrg1

## Step 5: Create the resources with the template and parameters

Replace the value of **$templateFile** with the path and name of the template file. Replace the value of **$parameterFile** with the path and name of the parameters file. Create the variables and then deploy the template. 

        $templateFile = "template file"
        $parameterFile = "parameter file"
        New-AzureRmResourceGroupDeployment -ResourceGroupName $rgName -TemplateFile $templateFile -TemplateParameterFile $parameterFile

    You will see something like this:

        DeploymentName    : VirtualMachineTemplate
        ResourceGroupName : myrg1
        ProvisioningState : Succeeded
        Timestamp         : 4/14/2016 8:11:37 PM
        Mode              : Incremental
        TemplateLink      :
        Parameters        :
                            Name             Type                       Value
                            ===============  =========================  ==========
                            adminUsername    String                     mytestacct1
                            adminPassword    SecureString

        Outputs           :

>[AZURE.NOTE] You can also deploy templates and parameters from an Azure storage account. To learn more, see [Using Azure PowerShell with Azure Storage](../storage/storage-powershell-guide-full.md).

## Next Steps

- If there were issues with the deployment, a next step would be to look at [Troubleshooting resource group deployments with Azure portal](../resource-manager-troubleshoot-deployments-portal.md)
- Learn how to manage the virtual machine that you created by reviewing [Manage virtual machines using Azure Resource Manager and PowerShell](virtual-machines-windows-ps-manage.md).
