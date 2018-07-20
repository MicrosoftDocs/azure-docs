---
title: Get started with Azure DNS private zones using PowerShell | Microsoft Docs
description: Learn how to create a private DNS zone and record in Azure DNS. This is a step-by-step guide to create and manage your first private DNS zone and record using PowerShell.
services: dns
documentationcenter: na
author: vhorne
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: ''
ms.service: dns
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/20/2017
ms.author: victorh
---

# Get started with Azure DNS private zones using PowerShell

This article walks you through the steps to create your first private DNS zone and record using Azure PowerShell.

[!INCLUDE [private-dns-public-preview-notice](../../includes/private-dns-public-preview-notice.md)]

A DNS zone is used to host the DNS records for a particular domain. To start hosting your domain in Azure DNS, you need to create a DNS zone for that domain name. Each DNS record for your domain is then created inside this DNS zone. To publish a private DNS zone to your virtual network, you specify the list of virtual networks that are allowed to resolve records within the zone.  We call these 'resolution virtual networks'.  You may also specify a virtual network for which Azure DNS maintains hostname records whenever a VM is created, changes IP, or is destroyed.  We call this a 'registration virtual network'.

# Get the Preview PowerShell modules
These instructions assume you have already installed and signed in to Azure PowerShell, including ensuring you have the required modules for Private Zone feature. 

[!INCLUDE [dns-powershell-setup](../../includes/dns-powershell-setup-include.md)]

## Create the resource group

Before creating the DNS zone, a resource group is created to contain the DNS zone. The following example shows the command.

```powershell
New-AzureRMResourceGroup -name MyAzureResourceGroup -location "westus"
```

## Create a DNS private zone

A DNS zone is created by using the `New-AzureRmDnsZone` cmdlet together with a value of "Private" for the ZoneType parameter. The following example creates a DNS zone called *contoso.local* in the resource group called *MyAzureResourceGroup* and makes the DNS zone available to the virtual network called *MyAzureVnet*. Use the example to create a DNS zone, substituting the values for your own.

Note that if the ZoneType parameter is omitted, the Zone will be created as a Public zone, so it is required if you need to create a Private Zone. 

```powershell
$vnet = Get-AzureRmVirtualNetwork -Name MyAzureVnet -ResourceGroupName MyAzureResourceGroup
New-AzureRmDnsZone -Name contoso.local -ResourceGroupName MyAzureResourceGroup -ZoneType Private -ResolutionVirtualNetworkId @($vnet.Id)
```

If you need Azure to automatically create hostname records in the zone, use the *RegistrationVirtualNetworkId* parameter instead of *ResolutionVirtualNetworkId*.  Registration virtual networks are automatically enabled for resolution.

```powershell
$vnet = Get-AzureRmVirtualNetwork -Name MyAzureVnet -ResourceGroupName MyAzureResourceGroup
New-AzureRmDnsZone -Name contoso.local -ResourceGroupName MyAzureResourceGroup -ZoneType Private -RegistrationVirtualNetworkId @($vnet.Id)
```

## Create a DNS record

You create record sets by using the `New-AzureRmDnsRecordSet` cmdlet. The following example creates a record with the relative name "db" in the DNS Zone "contoso.local", in resource group "MyAzureResourceGroup". The fully-qualified name of the record set is "db.contoso.local". The record type is "A", with IP address "10.0.0.4", and the TTL is 3600 seconds.

```powershell
New-AzureRmDnsRecordSet -Name db -RecordType A -ZoneName contoso.local -ResourceGroupName MyAzureResourceGroup -Ttl 3600 -DnsRecords (New-AzureRmDnsRecordConfig -IPv4Address "10.0.0.4")
```

For other record types, for record sets with more than one record, and to modify existing records, see [Manage DNS records and record sets using Azure PowerShell](dns-operations-recordsets.md). 

## View records

To list the DNS records in your zone, use:

```powershell
Get-AzureRmDnsRecordSet -ZoneName contoso.local -ResourceGroupName MyAzureResourceGroup
```

# List DNS private zones

By omitting the zone name from `Get-AzureRmDnsZone`, you can enumerate all zones in a resource group. This operation returns an array of zone objects.

```powershell
$zoneList = Get-AzureRmDnsZone -ResourceGroupName MyAzureResourceGroup
```

By omitting both the zone name and the resource group name from `Get-AzureRmDnsZone`, you can enumerate all zones in the Azure subscription.

```powershell
$zoneList = Get-AzureRmDnsZone
```

## Update a DNS private zone

Changes to a DNS zone resource can be made by using `Set-AzureRmDnsZone`. This cmdlet does not update any of the DNS record sets within the zone (see [How to Manage DNS records](dns-operations-recordsets.md)). It's only used to update properties of the zone resource itself. The writable zone properties are currently limited to [Azure Resource Manager ‘tags’ for the zone resource](dns-zones-records.md#tags) as well as the 'RegistrationVirtualNetworkId' and 'ResolutionVirtualNetworkId' parameters for Private Zones.

The below example replaces the Registration Virtual Network linked to a zone, to a new one MyNewAzureVnet.

Please note that you must not specify the ZoneType parameter for update, unlike for create. 

```powershell
$vnet = Get-AzureRmVirtualNetwork -Name MyNewAzureVnet -ResourceGroupName MyAzureResourceGroup
Set-AzureRmDnsZone -Name contoso.local -ResourceGroupName MyAzureResourceGroup -RegistrationVirtualNetworkId @($vnet.Id)
```

The below example replaces the Resolution Virtual Network linked to a zone, to a new one named "MyNewAzureVnet".

```powershell
$vnet = Get-AzureRmVirtualNetwork -Name MyNewAzureVnet -ResourceGroupName MyAzureResourceGroup
Set-AzureRmDnsZone -Name contoso.local -ResourceGroupName MyAzureResourceGroup -ResolutionVirtualNetworkId @($vnet.Id)
```

## Delete a DNS private zone

DNS private zones can be deleted using the `Remove-AzureRmDnsZone` cmdlet just like public zones.

> [!NOTE]
> Deleting a DNS zone also deletes all DNS records within the zone. This operation cannot be undone. If the DNS zone is in use, services using the zone will fail when the zone is deleted.
>
>To protect against accidental zone deletion, see [How to protect DNS zones and records](dns-protect-zones-recordsets.md).

Use one of the following two ways to delete a DNS zone:

### Specify the zone using the zone name and resource group name

```powershell
Remove-AzureRmDnsZone -Name contoso.local -ResourceGroupName MyAzureResourceGroup
```

### Specify the zone using a $zone object

You can specify the zone to be deleted using a `$zone` object returned by `Get-AzureRmDnsZone`.

```powershell
$zone = Get-AzureRmDnsZone -Name contoso.local -ResourceGroupName MyAzureResourceGroup
Remove-AzureRmDnsZone -Zone $zone
```

The zone object can also be piped instead of being passed as a parameter:

```powershell
Get-AzureRmDnsZone -Name contoso.local -ResourceGroupName MyAzureResourceGroup | Remove-AzureRmDnsZone

```

## Confirmation prompts

The `New-AzureRmDnsZone`, `Set-AzureRmDnsZone`, and `Remove-AzureRmDnsZone` cmdlets all support confirmation prompts.

Both `New-AzureRmDnsZone` and `Set-AzureRmDnsZone` prompt for confirmation if the `$ConfirmPreference` PowerShell preference variable has a value of `Medium` or lower. Due to the potentially high impact of deleting a DNS zone, the `Remove-AzureRmDnsZone` cmdlet prompts for confirmation if the `$ConfirmPreference` PowerShell variable has any value other than `None`.

Since the default value for `$ConfirmPreference` is `High`, only `Remove-AzureRmDnsZone` prompts for confirmation by default.

You can override the current `$ConfirmPreference` setting using the `-Confirm` parameter. If you specify `-Confirm` or `-Confirm:$True` , the cmdlet prompts you for confirmation before it runs. If you specify `-Confirm:$False` , the cmdlet does not prompt you for confirmation.

For more information about `-Confirm` and `$ConfirmPreference`, see [About Preference Variables](https://msdn.microsoft.com/powershell/reference/5.1/Microsoft.PowerShell.Core/about/about_Preference_Variables).


## Delete all resources

To delete all resources created in this article, take the following step:

```powershell
Remove-AzureRMResourceGroup -Name MyAzureResourceGroup
```

## Next steps

To learn more about private DNS zones, see [Using Azure DNS for private domains](private-dns-overview.md).

Read up on some common scenarios [Private Zone scenarios](./private-dns-scenarios.md) that can be realized with Private Zones in Azure DNS.

To learn more about managing DNS records in Azure DNS, see [Manage DNS records and record sets in Azure DNS using PowerShell](dns-operations-recordsets.md).

