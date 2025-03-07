---
title: Automate VNet IP Address Management with Azure IPAM Pools
description: 
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: concept-article
ms.date: 03/10/2023
ms.custom: template-concept
---

# Automate VNet IP Address Management with Azure IPAM Pools

Below sample script shows how you can create a script that allows you to run bulk creation of Virtual Networks using IpamPools reference, associate existing Virtual Networks using IpamPool reference, and disassociate existing Virtual Networks using IpamPool reference. The script is written in a synchronous manner to ensure that no API calls fail such that they need to be retried.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Azure PowerShell](https://docs.microsoft.com/powershell/azure/new-azureps-module-az?view=azps-7.4.0) installed locally or use [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview).
- A virtual network manager instance with an IPAM pool created. For more information, see [Create a virtual network manager](./create-virtual-network-manager-powershell.md) and [Create an IPAM pool](./how-to-manage-ip-addresses-network-manager.md).

## Sign in to your Azure account and select your subscription

To begin your configuration, sign in to your Azure account:

```powershell
# Sign in to your Azure account
Connect-AzAccount

# Select your subscription
Set-AzContext -Subscription $sub
```

## Bulk VNet Creation

Use the following code snippet to create multiple VNets using existing IPAM pools.

```powershell
# Create 100 VNets using ipamPool
Write-Output "Starting creation of new VNets with IpamPool reference at: " (Get-Date).ToString("HH:mm:ss")
$ipamPoolPrefixAllocation = [PSCustomObject]@{
    Id = "<your ipam pool reference arm id>"
    NumberOfIpAddresses = "8"
}
for ($i = 0; $i -lt 100; $i++) {
    $subnetName = "defaultSubnet"
    $vnetName = "bulk-ipam-vnet-$i"
    $subnet = New-AzVirtualNetworkSubnetConfig -Name $subnetName -IpamPoolPrefixAllocation $ipamPoolPrefixAllocation -DefaultOutboundAccess $false
    $job = New-AzVirtualNetwork -Name $vnetName -ResourceGroupName $rgname -Location $location -IpamPoolPrefixAllocation $ipamPoolPrefixAllocation -Subnet $subnet -AsJob
    $job | Wait-Job
    $actual = $job | Receive-Job
}
Write-Output "Starting creation of new VNets with IpamPool reference at: " (Get-Date).ToString("HH:mm:ss")
```
## Disassociate existing VNets
Use the following code snippet to disassociate existing VNets using IpamPools reference.

```powershell

# bulk disassociation update
Write-Output "Starting bulk disassociation for existing VNets at: " (Get-Date).ToString("HH:mm:ss")
$ipamPoolPrefixAllocation = $null
for ($i = 0; $i -lt @($vnetList).Count; $i++) {
    $vnetList[$i].AddressSpace.IpamPoolPrefixAllocations = $ipamPoolPrefixAllocation
    foreach ($subnet in $vnetList[$i].Subnets) {
        $subnet.IpamPoolPrefixAllocations = $ipamPoolPrefixAllocation
    }
    $job = Set-AzVirtualNetwork -VirtualNetwork $vnetList[$i] -AsJob
    $job | Wait-Job
    $actual = $job | Receive-Job
}
Write-Output "Starting bulk disassociation for existing VNets at: " (Get-Date).ToString("HH:mm:ss")

```
$location = "<your resource location>"
$rgname = "<your resource group>" # use RG name as "*" to fetch all VNets from all RGs within subscription
$sub = "<your subscription id>"

# select subscription
Set-AzContext -Subscription $sub

# Create 100 VNets using ipamPool
Write-Output "Starting creation of new VNets with IpamPool reference at: " (Get-Date).ToString("HH:mm:ss")
$ipamPoolPrefixAllocation = [PSCustomObject]@{
    Id = "<your ipam pool reference arm id>"
    NumberOfIpAddresses = "8"
}
for ($i = 0; $i -lt 100; $i++) {
    $subnetName = "defaultSubnet"
    $vnetName = "bulk-ipam-vnet-$i"
    $subnet = New-AzVirtualNetworkSubnetConfig -Name $subnetName -IpamPoolPrefixAllocation $ipamPoolPrefixAllocation -DefaultOutboundAccess $false
    $job = New-AzVirtualNetwork -Name $vnetName -ResourceGroupName $rgname -Location $location -IpamPoolPrefixAllocation $ipamPoolPrefixAllocation -Subnet $subnet -AsJob
    $job | Wait-Job
    $actual = $job | Receive-Job
}
Write-Output "Starting creation of new VNets with IpamPool reference at: " (Get-Date).ToString("HH:mm:ss")

# fetch all virtual networks from a resource group
$vnetList = Get-AzVirtualNetwork -ResourceGroupName $rgname

# bulk disassociation update
Write-Output "Starting bulk disassociation for existing VNets at: " (Get-Date).ToString("HH:mm:ss")
$ipamPoolPrefixAllocation = $null
for ($i = 0; $i -lt @($vnetList).Count; $i++) {
    $vnetList[$i].AddressSpace.IpamPoolPrefixAllocations = $ipamPoolPrefixAllocation
    foreach ($subnet in $vnetList[$i].Subnets) {
        $subnet.IpamPoolPrefixAllocations = $ipamPoolPrefixAllocation
    }
    $job = Set-AzVirtualNetwork -VirtualNetwork $vnetList[$i] -AsJob
    $job | Wait-Job
    $actual = $job | Receive-Job
}
Write-Output "Starting bulk disassociation for existing VNets at: " (Get-Date).ToString("HH:mm:ss")

# bulk association update
Write-Output "Starting bulk association for existing VNets at: " (Get-Date).ToString("HH:mm:ss")
$ipamPoolPrefixAllocation = [PSCustomObject]@{
    Id = "<your ipam pool reference arm id>"
    NumberOfIpAddresses = "8"
}
for ($i = 0; $i -lt @($vnetList).Count; $i++) {
    $vnetList[$i].AddressSpace.IpamPoolPrefixAllocations = $ipamPoolPrefixAllocation
    foreach ($subnet in $vnetList[$i].Subnets) {
        $subnet.IpamPoolPrefixAllocations = $ipamPoolPrefixAllocation
    }
    $job = Set-AzVirtualNetwork -VirtualNetwork $vnetList[$i] -AsJob
    $job | Wait-Job
    $actual = $job | Receive-Job
}
Write-Output "Finished bulk association for existing VNets at: " (Get-Date).ToString("HH:mm:ss")


