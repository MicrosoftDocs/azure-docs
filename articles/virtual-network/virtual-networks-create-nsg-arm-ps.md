---
title: Create network security groups - Azure PowerShell | Microsoft Docs
description: Learn how to create and deploy network security groups using PowerShell.
services: virtual-network
documentationcenter: na
author: jimdial
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 9cef62b8-d889-4d16-b4d0-58639539a418
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/23/2016
ms.author: jdial
ms.custom: H1Hack27Feb2017

---
# Create network security groups using PowerShell

[!INCLUDE [virtual-networks-create-nsg-selectors-arm-include](../../includes/virtual-networks-create-nsg-selectors-arm-include.md)]

[!INCLUDE [virtual-networks-create-nsg-intro-include](../../includes/virtual-networks-create-nsg-intro-include.md)]

Azure has two deployment models: Azure Resource Manager and classic. Microsoft recommends creating resources through the Resource Manager deployment model. To learn more about the differences between the two models, read the [Understand Azure deployment models](../azure-resource-manager/resource-manager-deployment-model.md) article. This article covers the Resource Manager deployment model. You can also [create NSGs in the classic deployment model](virtual-networks-create-nsg-classic-ps.md).

[!INCLUDE [virtual-networks-create-nsg-scenario-include](../../includes/virtual-networks-create-nsg-scenario-include.md)]

The sample PowerShell commands below expect a simple environment already created based on the scenario above. If you want to run the commands as they are displayed in this document, first build the test environment by deploying [this template](http://github.com/telmosampaio/azure-templates/tree/master/201-IaaS-WebFrontEnd-SQLBackEnd), click **Deploy to Azure**, replace the default parameter values if necessary, and follow the instructions in the portal.

## How to create the NSG for the front end subnet
To create an NSG named *NSG-FrontEnd* based on the scenario, complete the following steps:

1. If you have never used Azure PowerShell, see [How to Install and Configure Azure PowerShell](/powershell/azure/overview) and follow the instructions all the way to the end to sign into Azure and select your subscription.
2. Create a security rule allowing access from the Internet to port 3389.

	```powershell
	$rule1 = New-AzureRmNetworkSecurityRuleConfig -Name rdp-rule -Description "Allow RDP" `
	-Access Allow -Protocol Tcp -Direction Inbound -Priority 100 `
	-SourceAddressPrefix Internet -SourcePortRange * `
	-DestinationAddressPrefix * -DestinationPortRange 3389
	```

3. Create a security rule allowing access from the Internet to port 80.

	```powershell
	$rule2 = New-AzureRmNetworkSecurityRuleConfig -Name web-rule -Description "Allow HTTP" `
	-Access Allow -Protocol Tcp -Direction Inbound -Priority 101 `
	-SourceAddressPrefix Internet -SourcePortRange * -DestinationAddressPrefix * `
	-DestinationPortRange 80
	```

4. Add the rules created above to a new NSG named **NSG-FrontEnd**.

	```powershell
	$nsg = New-AzureRmNetworkSecurityGroup -ResourceGroupName TestRG -Location westus `
	-Name "NSG-FrontEnd" -SecurityRules $rule1,$rule2
	```

5. Check the rules created in the NSG by typing the following:

	```powershell
	$nsg
	```
   
    Output showing just the security rules:
   
        SecurityRules        : [
                                 {
                                   "Name": "rdp-rule",
                                   "Etag": "W/\"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\"",
                                   "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/networkSecurityGroups/NSG-FrontEnd/securityRules/rdp-rule",
                                   "Description": "Allow RDP",
                                   "Protocol": "Tcp",
                                   "SourcePortRange": "*",
                                   "DestinationPortRange": "3389",
                                   "SourceAddressPrefix": "Internet",
                                   "DestinationAddressPrefix": "*",
                                   "Access": "Allow",
                                   "Priority": 100,
                                   "Direction": "Inbound",
                                   "ProvisioningState": "Succeeded"
                                 },
                                 {
                                   "Name": "web-rule",
                                   "Etag": "W/\"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\"",
                                   "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/networkSecurityGroups/NSG-FrontEnd/securityRules/web-rule",
                                   "Description": "Allow HTTP",
                                   "Protocol": "Tcp",
                                   "SourcePortRange": "*",
                                   "DestinationPortRange": "80",
                                   "SourceAddressPrefix": "Internet",
                                   "DestinationAddressPrefix": "*",
                                   "Access": "Allow",
                                   "Priority": 101,
                                   "Direction": "Inbound",
                                   "ProvisioningState": "Succeeded"
                                 }
                               ]
6. Associate the NSG created above to the *FrontEnd* subnet.

	```powershell
	$vnet = Get-AzureRmVirtualNetwork -ResourceGroupName TestRG -Name TestVNet
	Set-AzureRmVirtualNetworkSubnetConfig -VirtualNetwork $vnet -Name FrontEnd `
	-AddressPrefix 192.168.1.0/24 -NetworkSecurityGroup $nsg
	```

	Output showing only the *FrontEnd* subnet settings, notice the value for the **NetworkSecurityGroup** property:
   
                    Subnets           : [
                                          {
                                            "Name": "FrontEnd",
                                            "Etag": "W/\"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\"",
                                            "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/FrontEnd",
                                            "AddressPrefix": "192.168.1.0/24",
                                            "IpConfigurations": [
                                              {
                                                "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/TestNICWeb2/ipConfigurations/ipconfig1"
                                              },
                                              {
                                                "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/TestNICWeb1/ipConfigurations/ipconfig1"
                                              }
                                            ],
                                            "NetworkSecurityGroup": {
                                              "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/networkSecurityGroups/NSG-FrontEnd"
                                            },
                                            "RouteTable": null,
                                            "ProvisioningState": "Succeeded"
                                          }
   
   > [!WARNING]
   > The output for the command above shows the content for the virtual network configuration object, which only exists on the computer where you are running PowerShell. You need to run the `Set-AzureRmVirtualNetwork` cmdlet to save these settings to Azure.
   > 
   > 
7. Save the new VNet settings to Azure.

	```powershell
	Set-AzureRmVirtualNetwork -VirtualNetwork $vnet
	```

    Output showing just the NSG portion:
   
        "NetworkSecurityGroup": {
          "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/networkSecurityGroups/NSG-FrontEnd"
        }

## How to create the NSG for the back-end subnet
To create an NSG named *NSG-BackEnd* based on the scenario above, complete the following steps:

1. Create a security rule allowing access from the front-end subnet to port 1433 (default port used by SQL Server).

	```powershell
	$rule1 = New-AzureRmNetworkSecurityRuleConfig -Name frontend-rule `
	-Description "Allow FE subnet" `
	-Access Allow -Protocol Tcp -Direction Inbound -Priority 100 `
	-SourceAddressPrefix 192.168.1.0/24 -SourcePortRange * `
	-DestinationAddressPrefix * -DestinationPortRange 1433
	```

2. Create a security rule blocking access to the Internet.

	```powershell
	$rule2 = New-AzureRmNetworkSecurityRuleConfig -Name web-rule `
	-Description "Block Internet" `
	-Access Deny -Protocol * -Direction Outbound -Priority 200 `
	-SourceAddressPrefix * -SourcePortRange * `
	-DestinationAddressPrefix Internet -DestinationPortRange *
	```

3. Add the rules created above to a new NSG named **NSG-BackEnd**.

	```powershell
	$nsg = New-AzureRmNetworkSecurityGroup -ResourceGroupName TestRG `
	-Location westus -Name "NSG-BackEnd" `
	-SecurityRules $rule1,$rule2
	```

4. Associate the NSG created above to the *BackEnd* subnet.

	```powershell
	Set-AzureRmVirtualNetworkSubnetConfig -VirtualNetwork $vnet -Name BackEnd ` 
	-AddressPrefix 192.168.2.0/24 -NetworkSecurityGroup $nsg
	```

    Output showing only the *BackEnd* subnet settings, notice the value for the **NetworkSecurityGroup** property:
   
        Subnets           : [
                      {
                        "Name": "BackEnd",
                        "Etag": "W/\"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\"",
                        "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/BackEnd",
                        "AddressPrefix": "192.168.2.0/24",
                        "IpConfigurations": [...],
                        "NetworkSecurityGroup": {
                          "Id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/networkSecurityGroups/NSG-BackEnd"
                        },
                        "RouteTable": null,
                        "ProvisioningState": "Succeeded"
                      }
5. Save the new VNet settings to Azure.

	```powershell
	Set-AzureRmVirtualNetwork -VirtualNetwork $vnet
	```

## How to remove an NSG
To delete an existing NSG, called *NSG-Frontend* in this case, follow the step below:

Run the **Remove-AzureRmNetworkSecurityGroup** shown below and be sure to include the resource group the NSG is in.

```powershell
Remove-AzureRmNetworkSecurityGroup -Name "NSG-FrontEnd" -ResourceGroupName "TestRG"
```

