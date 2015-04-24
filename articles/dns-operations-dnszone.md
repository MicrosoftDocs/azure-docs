<properties 
   pageTitle="Manage DNS zones using Powershell" 
   description="Manage DNS zones using Powershell" 
   services="virtual-network" 
   documentationCenter="na" 
   authors="joaoma" 
   manager="Adinah" 
   editor=""/>

<tags
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="04/24/2015"
   ms.author="joaoma"/>

# Managing DNS Zones with PowerShell

Scope of DNS zone operations covers actions you take on your DNS Zone, not affecting record sets or resource records. 



## Etags and Tags##

###Etags###
Etags a mechanism to avoid concurrent operations in the same object. Each DNS object created will have an Etag associated to it. When an operation happens to an object already created, the Etag for the object the Etag has to be referenced when updating the object. You can override an Etag with the switch -IgnoreEtag.

In case of DNS Zones, all $zone objects will have Etag support.

Operations using zone names (-Name switch) and resource groups don't use Etags.

###Tags###

Tags are different from Etags. Tags are to aggregate items for billing or grouping purposes for Azure resources. For more information about Tags see [using tags to organize your Azure resources.](../azure-preview-portal-using-tags.md)

## Create a new DNS Zone

Here follows the description for all DNS Zone commands. Optional switches are shown in brackets:

**New-AzureDnsZone** is used to create a new DNS zone.The return value for the operation will be the new DNS Zone object.If the DNS Zone already exists for the subscription, the command will fail. New-AzureDnsZone command doesn't have an "-Overwrite" switch. 

	New-AzureDnsZone -Name "<zoneName>" -ResourceGroupName "<resourceGroupName>" [–Tag $tags] 

**Get-AzureDnsZone** is used to list the DNS Zone resources you have for your subscription.You have different options to list DNS zones. First  will be to query a specific DNS Zone and second will be to query all DNS Zones you have for a resource group.<BR>

	Get-AzureDnsZone -Name "<zoneName>" -ResourceGroupName "<resourceGroupName>"

Listing all DNS Zones for the resource group.

	Get-AzureDnsZone -ResourceGroupName ""<resourceGroupName>"

**Set-AzureDnsZone** selects the DNS Zone you will write updates to it.The purpose will be to update tags for the DNS zone.The command doesn't change any records in the DNS Zone.The return value for the command will be an object type "zone". The options to use the commands are


Use zone name and resource group:

	Set-AzureDnsZone -Name "zone name" -ResourceGroupName "resource group" [-Tag] 


or get object value $zone from Get-AzureDnsZone and then run Set-AzureDnsZone:

	$zone=Get-AzureDnsZone -Name "zone name" -ResourceGroupName "resource group"|Set-AzureDnsZone -Zone $zone [-IgnoreEtag]


**Remove-AzureDnsZone** will be used to remove a DNS Zone. You will need to remove all records sets for the DNS zones created besides NS and SOA records to remove a DNS Zone.The return value for the remove operation will be success for fail.Optional switch -force is used to avoid the confirmation prompt to remove the DNS Zone.

Use name for the zone and resource group:

	Remove-AzureDnsZone -Name "zone name" -ResourceGroupName "resource group" [-force]


or get object value $zone from Get-AzureDnsZone and then run Remove-AzureDnsZone:

	$zone=Get-AzureDnsZone -Name "zone name" -ResourceGroupName "resource group" |Remove-AzureDnsZone -Zone $zone [-force]
