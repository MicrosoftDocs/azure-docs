---
title: Deploy Azure dedicated hosts using the Azure PowerShell | Microsoft Docs
description: Deploy VMs to dedicated hosts using Azure PowerShell.
services: virtual-machines-windows
author: cynthn
manager: jeconnoc
editor: tysonn
tags: azure-resource-manager
ms.service: virtual-machines-windows
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 07/25/2019
ms.author: cynthn

#Customer intent: As an IT administrator, I want to learn about more about using a dedicated host for my Azure virtual machines
---

# Preview: Deploy VMs to dedicated hosts using the Azure PowerShell

This article guides you through how to create an Azure dedicated host to host your virtual machines (VMs). 

Make sure that you have installed the latest Azure PowerShell module installed and you are signed in to an Azure account in with `Connect-AzAccount`. 

> [!IMPORTANT]
> Azure Dedicated Hosts is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
>
> **Known preview limitations**
> - Virtual machine scale sets are not currently supported on dedicated hosts.
> - The preview initial release supports the following VM series: DSv3, ESv3, FSv2. 



## Create a host group

A **host group** is a resource that represents a collection of dedicated hosts. You create a host group in a region and an availability zone, and add hosts to it. When planning for high availability, there are additional options. You can use one or both of the following with your dedicated hosts: 
- Span across multiple availability zones. In this case, you are required to have a host group in each of the zones you wish to use.
- Span across multiple fault domains which are mapped to physical racks. 
 
In either case, you are need to provide the fault domain count for your host group. If you do not want to span fault domains in your group, use a fault domain count of 1. 

You can also decide to use both availability zones and fault domains. This example create a a host group in zone 1 and 2 fault domains. 


```powershell
$rgName = "myPSDHRG"
$location = "East US"

New-AzResourceGroup -Location $location -Name $rgName
$hostGroup = New-AzHostGroup `
   -Location $location `
   -Name myHostGroup `
   -PlatformFaultDomain 2 `
   -ResourceGroupName $rgName `
   -Zone 1
```

## Create a host

Now let's create a dedicated host in the host group. In addition to a name for the host, you are required to provide the SKU for the host. Host SKU capture the supported VM series as well as the hardware generation for your dedicated host.  During the preview, we will support the following host SKU values:

- DSv3_Type1
- ESv3_Type1
- FSv2_Type2

For more information about the host SKUs and pricing, see [Azure Dedicated Host pricing](https://aka.ms/ADHPricing).

If you set a fault domain count for your host group, you will be asked to specify the fault domain for your host. In this example, we set the fault domain for the host to 1.


```powershell
$dHost = New-AzHost `
   -HostGroupName $hostGroup.Name `
   -Location $location -Name myHost `
   -ResourceGroupName $rgName `
   -Sku DSv3-Type1 `
   -AutoReplaceOnFailure 1 `
   -PlatformFaultDomain 1
```

## Create a VM

Create a virtual machine on the dedicated host. 

If you specified an availability zone when creating your host group, you are required to use the same zone when creating the virtual machine. There is no such requirement for fault domains. For this example, because our host group is in zone 1, we need to create the VM in zone 1, and make sure the `-Sku` for the public IP address is `Standard`.  

```powershell
$vmName = "myVMonmyHost"

# Create user object
$cred = Get-Credential -Message "Enter a username and password for the virtual machine."

# Network pieces
$subnetConfig = New-AzVirtualNetworkSubnetConfig -Name mySubnet -AddressPrefix 192.168.1.0/24
$vnet = New-AzVirtualNetwork -ResourceGroupName $rgName -Location $location `
  -Name MYvNET -AddressPrefix 192.168.0.0/16 -Subnet $subnetConfig
$pip = New-AzPublicIpAddress -ResourceGroupName $rgName -Location $location -Sku Standard -Zone 1 `
  -Name "mypublicdns$(Get-Random)" -AllocationMethod Static -IdleTimeoutInMinutes 4
$nsgRuleRDP = New-AzNetworkSecurityRuleConfig -Name myNetworkSecurityGroupRuleRDP  -Protocol Tcp `
  -Direction Inbound -Priority 1000 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * `
  -DestinationPortRange 3389 -Access Allow
$nsg = New-AzNetworkSecurityGroup -ResourceGroupName $rgName -Location $location `
  -Name myNetworkSecurityGroup -SecurityRules $nsgRuleRDP
$nic = New-AzNetworkInterface -Name myNic -ResourceGroupName $rgName -Location $location `
  -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id -NetworkSecurityGroupId $nsg.Id

# Create a virtual machine configuration using $imageVersion.Id to specify the shared image
$vmConfig = New-AzVMConfig -VMName $vmName -VMSize Standard_D4s_v3 -HostId $dHost.Id -Zone 1  | `
Set-AzVMOperatingSystem -Windows -ComputerName $vmName -Credential $cred | `
Set-AzVMSourceImage -PublisherName MicrosoftWindowsServer -Offer WindowsServer -Skus 2016-Datacenter -Version latest | `
Add-AzVMNetworkInterface -Id $nic.Id

# Create a virtual machine
New-AzVM -ResourceGroupName $rgName -Location $location -VM $vmConfig
```

## Next steps

You can also deploy dedicated hosts using the [Azure portal](dedicated-hosts-portal.md).