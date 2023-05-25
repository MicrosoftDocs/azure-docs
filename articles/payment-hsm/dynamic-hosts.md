---
title: Create a payment HSM with dynamic hosts
description: Create a payment HSM with dynamic hosts
services: payment-hsm
ms.service: payment-hsm
author: msmbaldwin
ms.author: mbaldwin
ms.topic: quickstart
ms.devlang: azurecli
ms.custom: devx-track-arm-template, devx-track-azurepowershell
ms.date: 05/08/2023
---

# Create a payment HSM with dynamic hosts

Once Payment HSM second host interface is enabled, 2 host interfaces will be created by default.

## Create PHSM with Dynamic Hosts in same VNET

When creating a PHSM with Dynamic IP the command remains the same and 2 Host Network Interfaces will be created by default.

```powershell-interactive
New-AzDedicatedHsm -Name "myPaymentHSM" -ResourceGroupName "rgPHSM" -Location "Eastus2euap" -Sku "payShield10K_LMK1_CPS60" -StampId "stamp1" -SubnetId <subnetId>
```
Output:
The CLI output shows the status of the PHSM, and in the portal we can see that 2 Host Network Interfaces are created.
 

 
Host 2 Network Interface Properties:
A Network Interface with a Dynamic IP address is created for the second host interface.
 
Create PHSM with Static Hosts in Same VNET
Provide static IP address for host network Interfaces.
PS Command:
New-AzDedicatedHsm -Name "myPaymentHSMStaticHosts" -ResourceGroupName "rgPHSM" -Location "Eastus2euap" -Sku "payShield10K_LMK1_CPS60" -StampId stamp1 -SubnetId <subnetId> -NetworkInterface (@{PrivateIPAddress = '10.0.0.5'}, @{PrivateIPAddress = '10.0.0.6'})

PS Command for creating PHSM with Management Static IP.
New-AzDedicatedHsm -Name "myPaymentHSMStaticHosts" -ResourceGroupName "rgPHSM" -Location "Eastus2euap" -Sku "payShield10K_LMK1_CPS60" -StampId stamp1 -SubnetId <subnetId> -NetworkInterface (@{PrivateIPAddress = '10.0.0.5'}, @{PrivateIPAddress = '10.0.0.6'})
-ManagementNetworkInterface @{PrivateIPAddress = '10.0.07'} -ManagementSubnetId  <subnetId>

Output: 
The CLI output shows the status of the PHSM, and in the portal we can see that 2 host network interfaces with static IP addresses are created. 
 
 

Host 2 Network Interface Properties:
The network interfaces are created with a Static IP address.
         

Create PHSM with Host and Management in different VNET
Create 2 different VNETs with their own subnets 
VNET Creation
Host VNET: 
$VNetAddressPrefix = @("10.0.0.0/16")
$SubnetAddressPrefix = "10.0.0.0/24"
$tags = @{fastpathenabled="true"}
$myDelegation = New-AzDelegation -Name "myHSMDelegation" -ServiceName "Microsoft.HardwareSecurityModules/dedicatedHSMs"
$myPHSMSubnetConfig = New-AzVirtualNetworkSubnetConfig -Name "myPHSMSubnet" -AddressPrefix $SubnetAddressPrefix -Delegation $myDelegation

New-AzVirtualNetwork -Name "myVNet" -ResourceGroupName $rgname -Location $location -Tag $tags -AddressPrefix $VNetAddressPrefix -Subnet $myPHSMSubnetConfig

Management VNET
$VNetAddressPrefix = @("10.1.0.0/16")
$SubnetAddressPrefix = "10.1.0.0/24"
$myPHSMSubnetConfig = New-AzVirtualNetworkSubnetConfig -Name "myPHSMSubnet" -AddressPrefix $SubnetAddressPrefix -Delegation $myDelegation

New-AzVirtualNetwork -Name "myVNetManagement" -ResourceGroupName $rgname -Location $location -Tag $tags -AddressPrefix $VNetAddressPrefix -Subnet $myPHSMSubnetConfig

VNET Output
 
Host VNET and Subnet 

Management VNET and Subnet
 

PS Command for creating PHSM with Host and Management in different VNET and Static IPs
New-AzDedicatedHsm -Name "myPaymentHSM" -ResourceGroupName $rgname -Location $location -Sku "payShield10K_LMK1_CPS60" -StampId stamp1 -SubnetId <subnetId> -NetworkInterface (@{PrivateIPAddress = '10.0.0.5'}, @{PrivateIPAddress = '10.0.0.6'}) -ManagementNetworkInterface @{PrivateIPAddress = '10.1.0.5'} -ManagementSubnetId <ManagementSubnetId>

Output
 
 
Network Interface Properties:
      
 
PS Command for creating PHSM with Host and Management in different VNET and Dynamic IPs
New-AzDedicatedHsm -Name "myPaymentHSM" -ResourceGroupName $rgname -Location $location -Sku "payShield10K_LMK1_CPS60" -StampId stamp1 -SubnetId <subnetId> -ManagementSubnetId <ManagementSubnetId>

Output
 
Create PHSM with ARM Template Static Hosts
To create a PHSM with 2 hosts using ARM template update azuredeploy.json parameters property to include new string properties that represent host1 and host 2 IP address variables. Also, update the resources.properties.networkProfile to include NetworkInterfaces. 
Update azuredeploy.parameters.json to include the new properties added for host 1 and host 2 Private IP addresses.
PS Command: 
$deploymentName = "myPHSMDeployment"
$resourceGroupName = "rgPHSMARM"
$templateFilePath = " azuredeploy.json" 
$templateParametersPath = "azuredeploy.parameters.json" 
$resourceName = "myPaymentHSMARM"
$vnetName = "myVNet" 
$vnetAddressPrefix = "10.0.0.0/16" 
$subnetName = "mySubnet" 
$subnetPrefix = "10.0.0.0/24"

New-AzResourceGroupDeployment -Name $deploymentName -ResourceGroupName $resourceGroupName -TemplateFile $templateFilePath -TemplateParameterFile $templateParametersPath -resourceName $resourceName -vnetName $vnetName -vnetAddressPrefix $vnetAddressPrefix -hsmSubnetName $subnetName -hsmSubnetPrefix $subnetPrefix


 
 

 

Output: 
 
 
