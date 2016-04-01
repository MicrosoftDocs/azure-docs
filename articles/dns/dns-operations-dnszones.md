<properties 
   pageTitle="Operations on DNS zones | Microsoft Azure" 
   description="You can manage DNS zones using Azure Powershell. How to update, delete and create DNS zones on Azure DNS" 
   services="dns" 
   documentationCenter="na" 
   authors="joaoma" 
   manager="carmonm" 
   editor=""/>

<tags
   ms.service="dns"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="03/17/2016"
   ms.author="joaoma"/>

# How to manage DNS Zones using PowerShell

> [AZURE.SELECTOR]
- [Azure CLI](dns-operations-dnszones-cli.md)
- [PowerShell](dns-operations-dnszones.md)


This guide will show how to manage your DNS zone. It will help understanding the sequence of operations to be done in order to administer your DNS zone.


## Create a new DNS zone

To create a new DNS zone to host your domain, use the New-AzureRmDnsZone cmdlet:

		PS C:\> $zone = New-AzureRmDnsZone -Name contoso.com -ResourceGroupName MyAzureResourceGroup [–Tag $tags] 

The operation creates a new DNS zone in Azure DNS and returns a local object corresponding to that zone.  You can optionally specify an array of Azure Resource Manager tags, for more information see [Etags and Tags](../dns-getstarted-create-dnszone.md#Etags-and-tags).

The name of the zone must be unique within the resource group, and the zone must not exist already, otherwise the operation will fail.

The same zone name can be re-used in a different resource group or a different Azure subscription.  Where multiple zones share the same name, each instance will be assigned different name server addresses, and only one instance can be delegated from the parent domain. See [Delegate a Domain to Azure DNS](dns-domain-delegation.md) for more information.

## Get a DNS zone

To retrieve a DNS zone, use the Get-AzureRmDnsZone cmdlet:

		PS C:\> $zone = Get-AzureRmDnsZone -Name contoso.com –ResourceGroupName MyAzureResourceGroup

The operation returns a DNS zone object corresponding to an existing zone in Azure DNS.  This object contains data about the zone (such as the number of record sets), but does not contain the record sets themselves.

## List DNS zones

By omitting the zone name from Get-AzureRmDnsZone, you can enumerate all zones in a resource group:

	PS C:\> $zoneList = Get-AzureRmDnsZone -ResourceGroupName MyAzureResourceGroup

This operation returns an array of zone objects.

## Update a DNS zone

Changes to a DNS zone resource can be made using Set-AzureRmDnsZone.  This does not update any of the DNS record sets within the zone (see [How to Manage DNS records](dns-operations-recordsets.md)). It is only used to update properties of the zone resource itself. This is currently limited to the Azure Resource Manager ‘tags’ for the zone resource. See [Etags and Tags](dns-getstarted-create-dnszone.md#Etags-and-tags) for more information.

Use one of the following two ways to update DNS zone:

### Option 1
 
Specify the zone using the zone name and resource group.

	PS C:\> Set-AzureRmDnsZone -Name contoso.com -ResourceGroupName MyAzureResourceGroup [-Tag $tags]

### Option 2
Specify the zone using a $zone object from Get-AzureRmDnsZone:

	PS C:\> $zone = Get-AzureRmDnsZone -Name contoso.com -ResourceGroupName MyAzureResourceGroup
	PS C:\> <..modify $zone.Tags here...>
	PS C:\> Set-AzureRmDnsZone -Zone $zone [-Overwrite]

When using Set-AzureRmDnsZone with a $zone object, ‘Etag’ checks will be used to ensure concurrent changes are not overwritten.  You can use the optional ‘-Overwrite’ switch to suppress these checks.  See [Etags and Tags](dns-getstarted-create-dnszone.md#Etags-and-tags) for more information.

## Delete a DNS Zone

DNS zones can be deleted using the Remove-AzureRmDnsZone cmdlet.
 
Before deleting a DNS zone in Azure DNS, you will need to delete all records sets, except for the NS and SOA records at the root of the zone that were created automatically when the zone was created.  

Use one of the following two ways to remove a DNS zone:

### Option 1

Specify the zone using the zone name and resource group name:

	PS C:\> Remove-AzureRmDnsZone -Name contoso.com -ResourceGroupName MyAzureResourceGroup [-Force] 

This operation has an optional ‘-Force’ switch which suppresses the prompt to confirm you want to remove the DNS zone.

### Option 2

Specify the zone using a $zone object from Get-AzureRmDnsZone:

	PS C:\> $zone = Get-AzureRmDnsZone -Name contoso.com -ResourceGroupName MyAzureResourceGroup
	PS C:\> Remove-AzureRmDnsZone -Zone $zone [-Force] [-Overwrite]

The ‘-Force’ switch is the same as in Option 1.

As with ‘Set-AzureRmDnsZone’, specifying the zone using a $zone object enables ‘etag’ checks to ensure concurrent changes are not deleted. <BR>
The optional ‘-Overwrite’ flag suppresses these checks. See [Etags and Tags](dns-getstarted-create-dnszone.md#Etags-and-tags) for more information.

The zone object can also be piped instead of being passed as a parameter:

	PS C:\> Get-AzureRmDnsZone -Name contoso.com -ResourceGroupName MyAzureResourceGroup | Remove-AzureRmDnsZone [-Force] [-Overwrite]

## Next Steps


[Manage DNS records](dns-operations-recordsets.md)

[Automate operations using .NET SDK](dns-sdk.md) 