---
title: Control routing and virtual appliances in Azure - template | Microsoft Docs
description: Learn how to control routing and virtual appliances using an Azure Resource Manager template.
services: virtual-network
documentationcenter: na
author: jimdial
manager: carmonm
editor: ''
tags: azure-resource-manager

ms.assetid: 832c7831-d0e9-449b-b39c-9a09ba051531
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/23/2016
ms.author: jdial

---
# Create User-Defined Routes (UDR) using a template

> [!div class="op_single_selector"]
> * [PowerShell](virtual-network-create-udr-arm-ps.md)
> * [Azure CLI](virtual-network-create-udr-arm-cli.md)
> * [Template](virtual-network-create-udr-arm-template.md)
> * [PowerShell (Classic)](virtual-network-create-udr-classic-ps.md)
> * [CLI (Classic)](virtual-network-create-udr-classic-cli.md)

> [!IMPORTANT]
> Before you work with Azure resources, it's important to understand that Azure currently has two deployment models: Azure Resource Manager and classic. Make sure you understand [deployment models and tools](../azure-resource-manager/resource-manager-deployment-model.md) before you work with any Azure resource. You can view the documentation for different tools by clicking the tabs at the top of this article. This article covers the Resource Manager deployment model. 

[!INCLUDE [virtual-network-create-udr-scenario-include.md](../../includes/virtual-network-create-udr-scenario-include.md)]

## UDR resources in a template file
You can view and download the [sample template](https://github.com/telmosampaio/azure-templates/tree/master/IaaS-NSG-UDR).

The following section shows the definition of the front-end UDR in the **azuredeploy-vnet-nsg-udr.json** file for the scenario:

	"apiVersion": "2015-06-15",
	"type": "Microsoft.Network/routeTables",
	"name": "[parameters('frontEndRouteTableName')]",
	"location": "[resourceGroup().location]",
	"tags": {
	  "displayName": "UDR - FrontEnd"	
	},
	"properties": {
	  "routes": [
	    {
	      "name": "RouteToBackEnd",
	      "properties": {
	        "addressPrefix": "[parameters('backEndSubnetPrefix')]",
	        "nextHopType": "VirtualAppliance",
	        "nextHopIpAddress": "[parameters('vmaIpAddress')]"
	      }
	    }
	  ]

To associate the UDR to the front-end subnet, you have to change the subnet definition in the template, and use the reference id for the UDR.

    "subnets": [
        "name": "[parameters('frontEndSubnetName')]",
        "properties": {
          "addressPrefix": "[parameters('frontEndSubnetPrefix')]",
          "networkSecurityGroup": {
            "id": "[resourceId('Microsoft.Network/networkSecurityGroups', parameters('frontEndNSGName'))]"
          },
          "routeTable": {
              "id": "[resourceId('Microsoft.Network/routeTables', parameters('frontEndRouteTableName'))]"
          }
        },

Notice the same being done for the back-end NSG and the back-end subnet in the template.

You also need to ensure that the **FW1** VM has the IP forwarding property enabled on the NIC that will be used to receive and forward packets. The section below shows the definition of the NIC for FW1 in the azuredeploy-nsg-udr.json file, based on the scenario above.

    "apiVersion": "2015-06-15",
    "type": "Microsoft.Network/networkInterfaces",
    "location": "[variables('location')]",
    "tags": {
      "displayName": "NetworkInterfaces - DMZ"
    },
    "name": "[concat(variables('fwVMSettings').nicName, copyindex(1))]",
    "dependsOn": [
      "[concat('Microsoft.Network/publicIPAddresses/', variables('fwVMSettings').pipName, copyindex(1))]",
      "[concat('Microsoft.Resources/deployments/', 'vnetTemplate')]"
    ],
    "properties": {
      "ipConfigurations": [
        {
          "name": "ipconfig1",
          "properties": {
            "enableIPForwarding": true,
            "privateIPAllocationMethod": "Static",
            "privateIPAddress": "[concat('192.168.0.',copyindex(4))]",
            "publicIPAddress": {
              "id": "[resourceId('Microsoft.Network/publicIPAddresses',concat(variables('fwVMSettings').pipName, copyindex(1)))]"
            },
            "subnet": {
              "id": "[variables('dmzSubnetRef')]"
            }
          }
        }
      ]
    },
    "copy": {
      "name": "fwniccount",
      "count": "[parameters('fwCount')]"
    }

## Deploy the template by using click to deploy
The sample template available in the public repository uses a parameter file containing the default values used to generate the scenario described above. To deploy this template using click to deploy, follow [this link](https://github.com/telmosampaio/azure-templates/tree/master/IaaS-NSG-UDR), click **Deploy to Azure**, replace the default parameter values if necessary, and follow the instructions in the portal.

1. If you have never used Azure PowerShell, see [How to Install and Configure Azure PowerShell](/powershell/azure/overview) and follow the instructions all the way to the end to sign into Azure and select your subscription.
2. Run the following command to create a resource group:

	```powershell
	New-AzureRmResourceGroup -Name TestRG -Location westus
	```

3. Run the following command to deploy the template:

	```powershell
    New-AzureRmResourceGroupDeployment -Name DeployUDR -ResourceGroupName TestRG `
		-TemplateUri https://raw.githubusercontent.com/telmosampaio/azure-templates/master/IaaS-NSG-UDR/azuredeploy.json `
		-TemplateParameterUri https://raw.githubusercontent.com/telmosampaio/azure-templates/master/IaaS-NSG-UDR/azuredeploy.parameters.json
	```

    Expected output:
   
        ResourceGroupName : TestRG
        Location          : westus
        ProvisioningState : Succeeded
        Tags              : 
        Permissions       : 
                            Actions  NotActions
                            =======  ==========
                            *                  
   
        Resources         : 
                            Name                Type                                     Location
                            ==================  =======================================  ========
                            ASFW                Microsoft.Compute/availabilitySets       westus  
                            ASSQL               Microsoft.Compute/availabilitySets       westus  
                            ASWEB               Microsoft.Compute/availabilitySets       westus  
                            FW1                 Microsoft.Compute/virtualMachines        westus  
                            SQL1                Microsoft.Compute/virtualMachines        westus  
                            SQL2                Microsoft.Compute/virtualMachines        westus  
                            WEB1                Microsoft.Compute/virtualMachines        westus  
                            WEB2                Microsoft.Compute/virtualMachines        westus  
                            NICFW1              Microsoft.Network/networkInterfaces      westus  
                            NICSQL1             Microsoft.Network/networkInterfaces      westus  
                            NICSQL2             Microsoft.Network/networkInterfaces      westus  
                            NICWEB1             Microsoft.Network/networkInterfaces      westus  
                            NICWEB2             Microsoft.Network/networkInterfaces      westus  
                            NSG-BackEnd         Microsoft.Network/networkSecurityGroups  westus  
                            NSG-FrontEnd        Microsoft.Network/networkSecurityGroups  westus  
                            PIPFW1              Microsoft.Network/publicIPAddresses      westus  
                            PIPSQL1             Microsoft.Network/publicIPAddresses      westus  
                            PIPSQL2             Microsoft.Network/publicIPAddresses      westus  
                            PIPWEB1             Microsoft.Network/publicIPAddresses      westus  
                            PIPWEB2             Microsoft.Network/publicIPAddresses      westus  
                            UDR-BackEnd         Microsoft.Network/routeTables            westus  
                            UDR-FrontEnd        Microsoft.Network/routeTables            westus  
                            TestVNet            Microsoft.Network/virtualNetworks        westus  
                            testvnetstorageprm  Microsoft.Storage/storageAccounts        westus  
                            testvnetstoragestd  Microsoft.Storage/storageAccounts        westus

        ResourceId        : /subscriptions/[Subscription Id]/resourceGroups/TestRG

## Deploy the template by using the Azure CLI

To deploy the ARM template by using the Azure CLI, complete the following steps:

1. If you have never used Azure CLI, see [Install and Configure the Azure CLI](../cli-install-nodejs.md) and follow the instructions up to the point where you select your Azure account and subscription.
2. Run the following command to switch to Resource Manager mode:

	```azurecli
	azure config mode arm
	```

	Here is the expected output for the command above:

		info:    New mode is arm

3. From your browser, navigate to **https://raw.githubusercontent.com/telmosampaio/azure-templates/master/IaaS-NSG-UDR/azuredeploy.parameters.json**, copy the contents of the json file, and paste into a new file in your computer. For this scenario, you would be copying the values below to a file named **c:\udr\azuredeploy.parameters.json**.

	```json
        {
          "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
          "contentVersion": "1.0.0.0",
          "parameters": {
            "fwCount": {
              "value": 1
            },
            "webCount": {
              "value": 2
            },
            "sqlCount": {
              "value": 2
            }
          }
        }
	```

4. Run the following command to deploy the new VNet by using the template and parameter files you downloaded and modified above:

	```azurecli
	azure group create -n TestRG -l westus --template-uri 'https://raw.githubusercontent.com/telmosampaio/azure-templates/master/IaaS-NSG-UDR/azuredeploy.json' -e 'c:\udr\azuredeploy.parameters.json'
	```

    Expected output:
   
        info:    Executing command group create
        info:    Getting resource group TestRG
        info:    Updating resource group TestRG
        info:    Updated resource group TestRG
        info:    Initializing template configurations and parameters
        info:    Creating a deployment
        info:    Created template deployment "azuredeploy"
        data:    Id:                  /subscriptions/[Subscription Id]/resourceGroups/TestRG
        data:    Name:                TestRG
        data:    Location:            westus
        data:    Provisioning State:  Succeeded
        data:    Tags: null
        data:    
        info:    group create command OK

5. Run the following command to view the resources created in the new resource group:

	```azurecli
	azure group show TestRG
	```

	Expected result:

	        info:    Executing command group show
	        info:    Listing resource groups
	        info:    Listing resources for the group
	        data:    Id:                  /subscriptions/[Subscription Id]/resourceGroups/TestRG
	        data:    Name:                TestRG
	        data:    Location:            westus
	        data:    Provisioning State:  Succeeded
	        data:    Tags: null
	        data:    Resources:
	        data:    
	        data:      Id      : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Compute/availabilitySets/ASFW
	        data:      Name    : ASFW
	        data:      Type    : availabilitySets
	        data:      Location: westus
	        data:      Tags    : displayName=AvailabilitySet - DMZ
	        data:    
	        data:      Id      : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Compute/availabilitySets/ASSQL
	        data:      Name    : ASSQL
	        data:      Type    : availabilitySets
	        data:      Location: westus
	        data:      Tags    : displayName=AvailabilitySet - SQL
	        data:    
	        data:      Id      : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Compute/availabilitySets/ASWEB
	        data:      Name    : ASWEB
	        data:      Type    : availabilitySets
	        data:      Location: westus
	        data:      Tags    : displayName=AvailabilitySet - Web
	        data:    
	        data:      Id      : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Compute/virtualMachines/FW1
	        data:      Name    : FW1
	        data:      Type    : virtualMachines
	        data:      Location: westus
	        data:      Tags    : displayName=VMs - DMZ
	        data:    
	        data:      Id      : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Compute/virtualMachines/SQL1
	        data:      Name    : SQL1
	        data:      Type    : virtualMachines
	        data:      Location: westus
	        data:      Tags    : displayName=VMs - SQL
	        data:    
	        data:      Id      : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Compute/virtualMachines/SQL2
	        data:      Name    : SQL2
	        data:      Type    : virtualMachines
	        data:      Location: westus
	        data:      Tags    : displayName=VMs - SQL
	        data:    
	        data:      Id      : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Compute/virtualMachines/WEB1
	        data:      Name    : WEB1
	        data:      Type    : virtualMachines
	        data:      Location: westus
	        data:      Tags    : displayName=VMs - Web
	        data:    
	        data:      Id      : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Compute/virtualMachines/WEB2
	        data:      Name    : WEB2
	        data:      Type    : virtualMachines
	        data:      Location: westus
	        data:      Tags    : displayName=VMs - Web
	        data:    
	        data:      Id      : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/NICFW1
		        data:      Name    : NICFW1
        data:      Type    : networkInterfaces
	        data:      Location: westus
	        data:      Tags    : displayName=NetworkInterfaces - DMZ
	        data:    
	        data:      Id      : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/NICSQL1
	        data:      Name    : NICSQL1
	        data:      Type    : networkInterfaces
	        data:      Location: westus
	        data:      Tags    : displayName=NetworkInterfaces - SQL
	        data:    
	        data:      Id      : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/NICSQL2
	        data:      Name    : NICSQL2
	        data:      Type    : networkInterfaces
	        data:      Location: westus
	        data:      Tags    : displayName=NetworkInterfaces - SQL
	        data:    
	        data:      Id      : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/NICWEB1
	        data:      Name    : NICWEB1
	        data:      Type    : networkInterfaces
	        data:      Location: westus
	        data:      Tags    : displayName=NetworkInterfaces - Web
	        data:    
	        data:      Id      : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/NICWEB2
	        data:      Name    : NICWEB2
	        data:      Type    : networkInterfaces
	        data:      Location: westus
	        data:      Tags    : displayName=NetworkInterfaces - Web
	        data:    
	        data:      Id      : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/networkSecurityGroups/NSG-BackEnd
	        data:      Name    : NSG-BackEnd
	        data:      Type    : networkSecurityGroups
	        data:      Location: westus
	        data:      Tags    : displayName=NSG - Front End
	        data:    
	        data:      Id      : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/networkSecurityGroups/NSG-FrontEnd
	        data:      Name    : NSG-FrontEnd
	        data:      Type    : networkSecurityGroups
	        data:      Location: westus
	        data:      Tags    : displayName=NSG - Remote Access
	        data:    
	        data:      Id      : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/publicIPAddresses/PIPFW1
	        data:      Name    : PIPFW1
	        data:      Type    : publicIPAddresses
	        data:      Location: westus
	        data:      Tags    : displayName=PublicIPAddresses - DMZ
	        data:    
	        data:      Id      : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/publicIPAddresses/PIPSQL1
	        data:      Name    : PIPSQL1
		        data:      Type    : publicIPAddresses
	        data:      Location: westus
	        data:      Tags    : displayName=PublicIPAddresses - SQL
	        data:    
	        data:      Id      : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/publicIPAddresses/PIPSQL2
	        data:      Name    : PIPSQL2
	        data:      Type    : publicIPAddresses
	        data:      Location: westus
	        data:      Tags    : displayName=PublicIPAddresses - SQL
	        data:    
	        data:      Id      : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/publicIPAddresses/PIPWEB1
	        data:      Name    : PIPWEB1
	        data:      Type    : publicIPAddresses
	        data:      Location: westus
	        data:      Tags    : displayName=PublicIPAddresses - Web
	        data:    
	        data:      Id      : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/publicIPAddresses/PIPWEB2
	        data:      Name    : PIPWEB2
	        data:      Type    : publicIPAddresses
	        data:      Location: westus
	        data:      Tags    : displayName=PublicIPAddresses - Web
	        data:    
	        data:      Id      : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/routeTables/UDR-BackEnd
	        data:      Name    : UDR-BackEnd
	        data:      Type    : routeTables
	        data:      Location: westus
	        data:      Tags    : displayName=Route Table - Back End
	        data:    
	        data:      Id      : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/routeTables/UDR-FrontEnd
	        data:      Name    : UDR-FrontEnd
	        data:      Type    : routeTables
	        data:      Location: westus
	        data:      Tags    : displayName=UDR - FrontEnd
	        data:    
	        data:      Id      : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet
	        data:      Name    : TestVNet
	        data:      Type    : virtualNetworks
	        data:      Location: westus
	        data:      Tags    : displayName=VNet
	        data:    
	        data:      Id      : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Storage/storageAccounts/testvnetstorageprm
	        data:      Name    : testvnetstorageprm
	        data:      Type    : storageAccounts
	        data:      Location: westus
	        data:      Tags    : displayName=Storage Account - Premium
	        data:    
	        data:      Id      : /subscriptions/[Subscription Id]/resourceGroups/TestRG/providers/Microsoft.Storage/storageAccounts/testvnetstoragestd
	        data:      Name    : testvnetstoragestd
	        data:      Type    : storageAccounts
	        data:      Location: westus
	        data:      Tags    : displayName=Storage Account - Simple
	        data:    
	        data:    Permissions:
	        data:      Actions: *
	        data:      NotActions: 
	        data:
	        info:    group show command OK

> [!TIP]
> If you do not see all the resources, run the `azure group deployment show` command to ensure the provisioning state of the deployment is *Succeded*.
> 
