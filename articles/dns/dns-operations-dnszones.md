<properties 
   pageTitle="Manage DNS zones using PowerShell | Microsoft Azure" 
   description="You can manage DNS zones using Azure Powershell. How to update, delete and create DNS zones on Azure DNS" 
   services="dns" 
   documentationCenter="na" 
   authors="cherylmc" 
   manager="carmonm" 
   editor=""/>

<tags
   ms.service="dns"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="05/09/2016"
   ms.author="cherylmc"/>

# How to manage DNS Zones using PowerShell

> [AZURE.SELECTOR]
- [Azure CLI](dns-operations-dnszones-cli.md)
- [PowerShell](dns-operations-dnszones.md)



This article will show you how to manage your DNS zone by using PowerShell. In order to use these steps, you'll need to install the latest version of the Azure Resource Manager PowerShell cmdlets (1.0 or later). See [How to install and configure Azure PowerShell](../powershell-install-configure.md) for more information about installing the PowerShell cmdlets.


## Create a new DNS zone

To create a DNS zone, see [Create a DNS zone by using PowerShell](dns-getstarted-create-dnszone.md).

## Get a DNS zone

To retrieve a DNS zone, use the `Get-AzureRmDnsZone` cmdlet. This operation returns a DNS zone object corresponding to an existing zone in Azure DNS. The object contains data about the zone (such as the number of record sets), but does not contain the record sets themselves.

	$zone = Get-AzureRmDnsZone -Name contoso.com –ResourceGroupName MyAzureResourceGroup

## List DNS zones

By omitting the zone name from `Get-AzureRmDnsZone`, you can enumerate all zones in a resource group. This operation returns an array of zone objects.

	$zoneList = Get-AzureRmDnsZone -ResourceGroupName MyAzureResourceGroup

## Update a DNS zone

Changes to a DNS zone resource can be made by using `Set-AzureRmDnsZone`. This does not update any of the DNS record sets within the zone (see [How to Manage DNS records](dns-operations-recordsets.md)). It's only used to update properties of the zone resource itself. This is currently limited to the Azure Resource Manager ‘tags’ for the zone resource. See [Etags and Tags](dns-getstarted-create-dnszone.md#Etags-and-tags) for more information.

Use one of the following two ways to update DNS zone:

### Specify the zone using the zone name and resource group

	Set-AzureRmDnsZone -Name contoso.com -ResourceGroupName MyAzureResourceGroup [-Tag $tags]

### Specify the zone using a $zone object

Specify the zone using a $zone object from `Get-AzureRmDnsZone`. When using `Set-AzureRmDnsZone` with a $zone object, Etag checks will be used to ensure concurrent changes are not overwritten. You can use the optional *-Overwrite* switch to suppress these checks. See [Etags and Tags](dns-getstarted-create-dnszone.md#Etags-and-tags) for more information.


	$zone = Get-AzureRmDnsZone -Name contoso.com -ResourceGroupName MyAzureResourceGroup
	<..modify $zone.Tags here...>
	Set-AzureRmDnsZone -Zone $zone [-Overwrite]


## Delete a DNS Zone

DNS zones can be deleted using the Remove-AzureRmDnsZone cmdlet.
 
Before deleting a DNS zone in Azure DNS, you will need to delete all records sets, except for the NS and SOA records at the root of the zone that were created automatically when the zone was created.  

Use one of the following two ways to remove a DNS zone:

### Specify the zone using the zone name and resource group name

This operation has an optional *-Force* switch which suppresses the prompt to confirm you want to remove the DNS zone.

	Remove-AzureRmDnsZone -Name contoso.com -ResourceGroupName MyAzureResourceGroup [-Force] 

### Specify the zone using a $zone object 

Specify the zone using a $zone object from `Get-AzureRmDnsZone`. This operation has an optional *-Force* switch which suppresses the prompt to confirm you want to remove the DNS zone. As with `Set-AzureRmDnsZone`, specifying the zone using a $zone object enables Etag checks to ensure concurrent changes are not deleted. <BR>
The optional *-Overwrite* flag suppresses these checks. See [Etags and Tags](dns-getstarted-create-dnszone.md#Etags-and-tags) for more information.

	$zone = Get-AzureRmDnsZone -Name contoso.com -ResourceGroupName MyAzureResourceGroup
	Remove-AzureRmDnsZone -Zone $zone [-Force] [-Overwrite]



The zone object can also be piped instead of being passed as a parameter:

	Get-AzureRmDnsZone -Name contoso.com -ResourceGroupName MyAzureResourceGroup | Remove-AzureRmDnsZone [-Force] [-Overwrite]

## Next steps

After creating a DNS zone, create [record sets and records](dns-getstarted-create-recordset.md) to start resolving names for your Internet domain.