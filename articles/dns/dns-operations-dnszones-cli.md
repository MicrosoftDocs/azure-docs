<properties 
   pageTitle="Operations on DNS zones using CLI | Microsoft Azure" 
   description="You can manage DNS zones using Azure CLI. How to update, delete and create DNS zones on Azure DNS" 
   services="dns" 
   documentationCenter="na" 
   authors="joaoma" 
   manager="Adinah" 
   editor=""/>

<tags
   ms.service="dns"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="09/02/2015"
   ms.author="joaoma"/>

# How to manage DNS Zones using CLI

> [AZURE.SELECTOR]
- [Azure CLI](dns-operations-dnszones-cli.md)
- [Azure Powershell](dns-operations-dnszones.md)

This guide will show how to manage your DNS zone. It will help understanding the sequence of operations to be done in order to administer your DNS zone.

## Create a new DNS zone

To create a new DNS zone to host your domain, use the `azure network dns zone create`:

		Azure network dns zone create -n contoso.com -g myresourcegroup -t "project=demo";"env=test"

The operation creates a new DNS zone in Azure DNS. You can optionally specify an array of Azure Resource Manager tags, for more information see [Etags and Tags](dns-getstarted-create-dnszone.md#Etags-and-tags).

The name of the zone must be unique within the resource group, and the zone must not exist already, otherwise the operation will fail.

The same zone name can be re-used in a different resource group or a different Azure subscription.  Where multiple zones share the same name, each instance will be assigned different name server addresses, and only one instance can be delegated from the parent domain. See [Delegate a Domain to Azure DNS](dns-domain-delegation.md) for more information.

## Get a DNS zone

To retrieve a DNS zone, use the `azure network dns zone show`:

	azure network dns zone show myresourcegroup contoso.com

The operation returns a DNS zone with its id, number of record sets and tags.


## List DNS zones

To retrieve DNS zones within a resource group, use `azure network dns zone list`:

	azure network dns zone list myresourcegroup


## Update a DNS zone

Changes to a DNS zone resource can be made using `azure network dns zone set`.  This does not update any of the DNS record sets within the zone (see [How to Manage DNS records](dns-operations-recordsets.md)). It is only used to update properties of the zone resource itself. This is currently limited to the Azure Resource Manager ‘tags’ for the zone resource. See [Etags and Tags](dns-getstarted-create-dnszone.md#Etags-and-tags) for more information.

	azure network dns zone set myresourcegroup contoso.com -t prod=value2

## Delete a DNS Zone

DNS zones can be deleted using the `azure network dns zone delete`.
 
Before deleting a DNS zone in Azure DNS, you will need to delete all records sets, except for the NS and SOA records at the root of the zone that were created automatically when the zone was created.  

	azure network dns zone delete myresourcegroup contoso.com 

This operation has an optional ‘-q’ switch which suppresses the prompt to confirm you want to remove the DNS zone.


## Next Steps


[Manage DNS records](dns-operations-recordsets-cli.md)

[Automate operations using .NET SDK](dns-sdk.md) 