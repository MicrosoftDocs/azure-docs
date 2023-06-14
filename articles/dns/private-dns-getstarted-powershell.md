---
title: Quickstart - Create an Azure private DNS zone using Azure PowerShell
description: In this quickstart, you learn how to create and manage your first private DNS zone and record using Azure PowerShell.
services: dns
author: greg-lindsay
ms.author: greglin
ms.date: 09/27/2022
ms.topic: quickstart
ms.service: dns
ms.custom: devx-track-azurepowershell, mode-api
#Customer intent: As an experienced network administrator, I want to create an  Azure private DNS zone, so I can resolve host names on my private virtual networks.
---

# Quickstart: Create an Azure private DNS zone using Azure PowerShell

This article walks you through the steps to create your first private DNS zone and record using Azure PowerShell.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

A DNS zone is used to host the DNS records for a particular domain. To start hosting your domain in Azure DNS, you need to create a DNS zone for that domain name. Each DNS record for your domain is then created inside this DNS zone. To publish a private DNS zone to your virtual network, you specify the list of virtual networks that are allowed to resolve records within the zone.  These are called *linked* virtual networks. When autoregistration is enabled, Azure DNS also updates the zone records whenever a virtual machine is created, changes its' IP address, or is deleted.

## Prerequisites

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

If you prefer, you can complete this quickstart using [Azure CLI](private-dns-getstarted-cli.md).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Create the resource group

First, create a resource group to contain the DNS zone: 

```azurepowershell-interactive
New-AzResourceGroup -name MyAzureResourceGroup -location "eastus"
```

## Create a private DNS zone

A DNS zone is created by using the `New-AzPrivateDnsZone` cmdlet.

The following example creates a virtual network named **myAzureVNet**. Then it creates a DNS zone named **private.contoso.com** in the **MyAzureResourceGroup** resource group, links the DNS zone to the **MyAzureVnet** virtual network, and enables automatic registration.

```azurepowershell-interactive
Install-Module -Name Az.PrivateDns -force

$backendSubnet = New-AzVirtualNetworkSubnetConfig -Name backendSubnet -AddressPrefix "10.2.0.0/24"
$vnet = New-AzVirtualNetwork `
  -ResourceGroupName MyAzureResourceGroup `
  -Location eastus `
  -Name myAzureVNet `
  -AddressPrefix 10.2.0.0/16 `
  -Subnet $backendSubnet

$zone = New-AzPrivateDnsZone -Name private.contoso.com -ResourceGroupName MyAzureResourceGroup

$link = New-AzPrivateDnsVirtualNetworkLink -ZoneName private.contoso.com `
  -ResourceGroupName MyAzureResourceGroup -Name "mylink" `
  -VirtualNetworkId $vnet.id -EnableRegistration
```

If you want to create a zone just for name resolution (no automatic hostname registration), you can omit the `-EnableRegistration` parameter.

### List DNS private zones

By omitting the zone name from `Get-AzPrivateDnsZone`, you can enumerate all zones in a resource group. This operation returns an array of zone objects.

```azurepowershell-interactive
$zones = Get-AzPrivateDnsZone -ResourceGroupName MyAzureResourceGroup
$zones
```

By omitting both the zone name and the resource group name from `Get-AzPrivateDnsZone`, you can enumerate all zones in the Azure subscription.

```azurepowershell-interactive
$zones = Get-AzPrivateDnsZone
$zones
```

## Create the test virtual machines

Now, create two virtual machines so you can test your private DNS zone:

```azurepowershell-interactive
New-AzVm `
    -ResourceGroupName "myAzureResourceGroup" `
    -Name "myVM01" `
    -Location "East US" `
    -subnetname backendSubnet `
    -VirtualNetworkName "myAzureVnet" `
    -addressprefix 10.2.0.0/24 `
    -OpenPorts 3389

New-AzVm `
    -ResourceGroupName "myAzureResourceGroup" `
    -Name "myVM02" `
    -Location "East US" `
    -subnetname backendSubnet `
    -VirtualNetworkName "myAzureVnet" `
    -addressprefix 10.2.0.0/24 `
    -OpenPorts 3389
```

Creating a virtual machine will take a few minutes to complete.

## Create an additional DNS record

You create record sets by using the `New-AzPrivateDnsRecordSet` cmdlet. The following example creates a record with the relative name **db** in the DNS Zone **private.contoso.com**, in resource group **MyAzureResourceGroup**. The fully qualified name of the record set is **db.private.contoso.com**. The record type is "A", with IP address "10.2.0.4", and the TTL is 3600 seconds.

```azurepowershell-interactive
New-AzPrivateDnsRecordSet -Name db -RecordType A -ZoneName private.contoso.com `
   -ResourceGroupName MyAzureResourceGroup -Ttl 3600 `
   -PrivateDnsRecords (New-AzPrivateDnsRecordConfig -IPv4Address "10.2.0.4")
```

### View DNS records

To list the DNS records in your zone, run:

```azurepowershell-interactive
Get-AzPrivateDnsRecordSet -ZoneName private.contoso.com -ResourceGroupName MyAzureResourceGroup
```

## Test the private zone

Now you can test the name resolution for your **private.contoso.com** private zone.

### Configure VMs to allow inbound ICMP

You can use the ping command to test name resolution. So, configure the firewall on both virtual machines to allow inbound ICMP packets.

1. Connect to myVM01 using the username and password you used when creating the VM.
1. Open a Windows PowerShell window with administrator privileges.
1. Run the following command:

   ```powershell
   New-NetFirewallRule –DisplayName "Allow ICMPv4-In" –Protocol ICMPv4
   ```

Repeat for myVM02.

### Ping the VMs by name

1. From the myVM02 Windows PowerShell command prompt, ping myVM01 using the automatically registered host name:

   ```
   ping myVM01.private.contoso.com
   ```

   You should see an output that looks similar to what is shown below:

   ```
   PS C:\> ping myvm01.private.contoso.com

   Pinging myvm01.private.contoso.com [10.2.0.4] with 32 bytes of data:
   Reply from 10.2.0.4: bytes=32 time<1ms TTL=128
   Reply from 10.2.0.4: bytes=32 time=1ms TTL=128
   Reply from 10.2.0.4: bytes=32 time<1ms TTL=128
   Reply from 10.2.0.4: bytes=32 time<1ms TTL=128

   Ping statistics for 10.2.0.4:
       Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
   Approximate round trip times in milli-seconds:
       Minimum = 0ms, Maximum = 1ms, Average = 0ms
   PS C:\>
   ```

2. Now ping the **db** name you created previously:

   ```
   ping db.private.contoso.com
   ```

   You should see an output that looks similar to what is shown below:

   ```
   PS C:\> ping db.private.contoso.com

   Pinging db.private.contoso.com [10.2.0.4] with 32 bytes of data:
   Reply from 10.2.0.4: bytes=32 time<1ms TTL=128
   Reply from 10.2.0.4: bytes=32 time<1ms TTL=128
   Reply from 10.2.0.4: bytes=32 time<1ms TTL=128
   Reply from 10.2.0.4: bytes=32 time<1ms TTL=128

   Ping statistics for 10.2.0.4:
       Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
   Approximate round trip times in milliseconds:
       Minimum = 0ms, Maximum = 0ms, Average = 0ms
   PS C:\>
   ```

## Clean up resources

When no longer needed, delete the **MyAzureResourceGroup** resource group to delete the resources created in this article.

```azurepowershell-interactive
Remove-AzResourceGroup -Name MyAzureResourceGroup
```

## Next steps

> [!div class="nextstepaction"]
> [Azure DNS Private Zones scenarios](private-dns-scenarios.md)
