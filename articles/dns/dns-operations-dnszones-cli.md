<properties 
   pageTitle="Manage DNS zones using CLI | Microsoft Azure" 
   description="You can manage DNS zones using Azure CLI. How to update, delete and create DNS zones on Azure DNS" 
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

# How to manage DNS Zones using CLI

> [AZURE.SELECTOR]
- [Azure CLI](dns-operations-dnszones-cli.md)
- [PowerShell](dns-operations-dnszones.md)


This guide will show how to manage your DNS zone resources using the cross-platform Azure CLI.

These instructions use Microsoft Azure CLI. Be sure to update to the latest Azure CLI (0.9.8 or later) to use the Azure DNS commands. Type `azure -v` to check which Azure CLI version is currently installed in your computer. You can install Azure CLI for Windows, Linux, or MAC. More information is available at [Install the Azure CLI](../xplat-cli-install.md). 

Azure DNS is an Azure Resource Manager-only service. It does not have an ASM API. You will need to make sure the Azure CLI is configured to use Resource Manager mode. You can do this by using the `azure config mode arm` command.<BR>
If you see the message "*error: 'dns' is not an azure command*", it's most likely because you are using Azure CLI in ASM mode, not Resource Manager mode.

## Create a new DNS zone

To create a new DNS zone to host your domain, see [Create an Azure DNS zone using CLI](dns-getstarted-create-dnszone-cli.md).

## Get a DNS zone

To retrieve a DNS zone, use `azure network dns zone show`:

	azure network dns zone show myresourcegroup contoso.com

The operation returns a DNS zone with its id, number of record sets and tags.


## List DNS zones

To retrieve DNS zones within a resource group, use `azure network dns zone list`.

	azure network dns zone list myresourcegroup

## Update a DNS zone

Changes to a DNS zone resource can be made using `azure network dns zone set`. This does not update any of the DNS record sets within the zone (see [How to Manage DNS records](dns-operations-recordsets.md)). It's only used to update properties of the zone resource itself. This is currently limited to the Azure Resource Manager ‘tags’ for the zone resource. See [Etags and Tags](dns-getstarted-create-dnszone.md#tagetag) for more information.

	azure network dns zone set myresourcegroup contoso.com -t prod=value2

## Delete a DNS Zone

DNS zones can be deleted using `azure network dns zone delete`. This operation has an optional *-q* switch which suppresses the prompt to confirm you want to remove the DNS zone.
 
Before deleting a DNS zone in Azure DNS, you will need to delete all records sets, except for the NS and SOA records at the root of the zone that were created automatically when the zone was created. 

	azure network dns zone delete myresourcegroup contoso.com 



## Next steps
After creating a DNS zone, create [record sets and records](dns-getstarted-create-recordset-cli.md) to start resolving names for your Internet domain.
