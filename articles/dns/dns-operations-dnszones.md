---
title: Manage DNS zones in Azure DNS - PowerShell | Microsoft Docs
description: You can manage DNS zones using Azure PowerShell. This article describes how to update, delete, and create DNS zones on Azure DNS
services: dns
documentationcenter: na
author: greg-lindsay
ms.service: dns
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/27/2022
ms.author: greglin 
ms.custom: devx-track-azurepowershell
---

# How to manage DNS Zones using PowerShell

> [!div class="op_single_selector"]
> * [Portal](dns-operations-dnszones-portal.md)
> * [PowerShell](dns-operations-dnszones.md)
> * [Azure classic CLI](./dns-operations-dnszones-cli.md)
> * [Azure CLI](dns-operations-dnszones-cli.md)

This article shows you how to manage your DNS zones by using Azure PowerShell. You can also manage your DNS zones using the cross-platform [Azure CLI](dns-operations-dnszones-cli.md) or the Azure portal.

This guide specifically deals with Public DNS zones. For information on using Azure PowerShell to manage Private Zones in Azure DNS, see [Get started with Azure DNS Private Zones using Azure PowerShell](private-dns-getstarted-powershell.md).

[!INCLUDE [dns-create-zone-about](../../includes/dns-create-zone-about-include.md)]

[!INCLUDE [dns-powershell-setup](../../includes/dns-powershell-setup-include.md)]

## Create a DNS zone

A DNS zone is created by using the `New-AzDnsZone` cmdlet.

The following example creates a DNS zone called *contoso.com* in the resource group called *MyDNSResourceGroup*:

```azurepowershell-interactive
New-AzDnsZone -Name contoso.com -ResourceGroupName MyDNSResourceGroup
```

The following example shows how to create a DNS zone with two [Azure Resource Manager tags](dns-zones-records.md#tags), *project = demo* and *env = test*:

```azurepowershell-interactive
New-AzDnsZone -Name contoso.com -ResourceGroupName MyDNSResourceGroup -Tag @{ project="demo"; env="test" }
```

## Get a DNS zone

To retrieve a DNS zone, use the `Get-AzDnsZone` cmdlet. This operation returns a DNS zone object corresponding to an existing zone in Azure DNS. The object contains data about the zone (such as the number of record sets), but doesn't contain the record sets themselves (see `Get-AzDnsRecordSet`).

```azurepowershell-interactive
Get-AzDnsZone -Name contoso.com –ResourceGroupName MyDNSResourceGroup

Name                  : contoso.com
ResourceGroupName     : myresourcegroup
Etag                  : 00000003-0000-0000-8ec2-f4879750d201
Tags                  : {project, env}
NameServers           : {ns1-01.azure-dns.com., ns2-01.azure-dns.net., ns3-01.azure-dns.org.,
                        ns4-01.azure-dns.info.}
NumberOfRecordSets    : 2
MaxNumberOfRecordSets : 5000
```

## List DNS zones

By omitting the zone name from `Get-AzDnsZone`, you can enumerate all zones in a resource group. This operation returns an array of zone objects.

```azurepowershell-interactive
$zoneList = Get-AzDnsZone -ResourceGroupName MyDNSResourceGroup
$zoneList
```

By omitting both the zone name and the resource group name from `Get-AzDnsZone`, you can enumerate all zones in the Azure subscription.

```azurepowershell-interactive
$zoneList = Get-AzDnsZone
$zoneList
```

## Update a DNS zone

Changes to a DNS zone resource can be made by using `Set-AzDnsZone`. This cmdlet doesn't update any of the DNS record sets within the zone (see [How to Manage DNS records](dns-operations-recordsets.md)). It's only used to update properties of the zone resource itself. The writable zone properties are currently limited to the [Azure Resource Manager ‘tags’ for the zone resource](dns-zones-records.md#tags).

Use one of the following two ways to update a DNS zone:

### Specify the zone using the zone name and resource group

This approach replaces the existing zone tags with the values specified.

```azurepowershell-interactive
Set-AzDnsZone -Name contoso.com -ResourceGroupName MyDNSResourceGroup -Tag @{ project="demo"; env="test" }
```

### Specify the zone using a $zone object

This approach retrieves the existing zone object, modifies the tags, and then commits the changes. In this way, existing tags can be preserved.

```azurepowershell-interactive
# Get the zone object
$zone = Get-AzDnsZone -Name contoso.com -ResourceGroupName MyDNSResourceGroup

# Remove an existing tag
$zone.Tags.Remove("project")

# Add a new tag
$zone.Tags.Add("status","approved")

# Commit changes
Set-AzDnsZone -Zone $zone
```

When you use `Set-AzDnsZone` with a $zone object, [Etag checks](dns-zones-records.md#etags) are used to ensure concurrent changes aren't overwritten. You can use the optional `-Overwrite` switch to suppress these checks.

## Delete a DNS Zone

DNS zones can be deleted using the `Remove-AzDnsZone` cmdlet.

> [!NOTE]
> Deleting a DNS zone also deletes all DNS records within the zone. This operation cannot be undone. If the DNS zone is in use, services using the zone will fail when the zone is deleted.
>
>To protect against accidental zone deletion, see [How to protect DNS zones and records](dns-protect-zones-recordsets.md).


Use one of the following two ways to delete a DNS zone:

### Specify the zone using the zone name and resource group name

```azurepowershell-interactive
Remove-AzDnsZone -Name contoso.com -ResourceGroupName MyDNSResourceGroup
```

### Specify the zone using a $zone object

You can specify the zone to be deleted using a `$zone` object returned by `Get-AzDnsZone`.

```azurepowershell-interactive
$zone = Get-AzDnsZone -Name contoso.com -ResourceGroupName MyDNSResourceGroup
Remove-AzDnsZone -Zone $zone
```

The zone object can also be piped instead of being passed as a parameter:

```azurepowershell-interactive
Get-AzDnsZone -Name contoso.com -ResourceGroupName MyDNSResourceGroup | Remove-AzDnsZone

```

As with `Set-AzDnsZone`, specifying the zone using a `$zone` object enables Etag checks to ensure concurrent changes aren't deleted. Use the `-Overwrite` switch to suppress these checks.

## Confirmation prompts

The `New-AzDnsZone`, `Set-AzDnsZone`, and `Remove-AzDnsZone` cmdlets all support confirmation prompts.

Both `New-AzDnsZone` and `Set-AzDnsZone` prompt for confirmation if the `$ConfirmPreference` PowerShell preference variable has a value of `Medium` or lower. Since deleting a DNS zone can potentially cause unwanted conditions, the `Remove-AzDnsZone` cmdlet prompts for confirmation if the `$ConfirmPreference` PowerShell variable has any value other than `None`.

Since the default value for `$ConfirmPreference` is `High`, only `Remove-AzDnsZone` prompts for confirmation by default.

You can override the current `$ConfirmPreference` setting using the `-Confirm` parameter. If you specify `-Confirm` or `-Confirm:$True` , the cmdlet prompts you for confirmation before it runs. If you specify `-Confirm:$False` , the cmdlet doesn't prompt you for confirmation.

For more information about `-Confirm` and `$ConfirmPreference`, see [About Preference Variables](/powershell/module/microsoft.powershell.core/about/about_preference_variables).

## Next steps

Learn how to [manage record sets and records](dns-operations-recordsets.md) in your DNS zone.
<br>
Learn how to [delegate your domain to Azure DNS](dns-domain-delegation.md).
<br>
Review the [Azure DNS PowerShell reference documentation](/powershell/module/Az.dns).