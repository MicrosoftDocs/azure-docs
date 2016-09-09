<properties
   pageTitle="Manage DNS record sets and records on Azure DNS using Azure CLI | Microsoft Azure"
   description="Managing DNS record sets and records on Azure DNS when hosting your domain on Azure DNS. All CLI commands for operations on record sets and records."
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
   ms.date="05/06/2016"
   ms.author="cherylmc"/>

# Manage DNS records and record sets by using CLI


> [AZURE.SELECTOR]
- [Azure Portal](dns-operations-recordsets-portal.md)
- [Azure CLI](dns-operations-recordsets-cli.md)
- [PowerShell](dns-operations-recordsets.md)


This article shows you how to manage record sets and records for your DNS zone by using the cross-platform Azure command-line interface (CLI).

It's important to understand the difference between DNS record sets and individual DNS records. A record set is a collection of records in a zone that have the same name and are the same type. For more information, see [Understanding record sets and records](dns-getstarted-create-recordset-cli.md).


## Configure the cross-platform Azure CLI

Azure DNS is an Azure Resource Manager-only service. It does not have an Azure Service Management API. Make sure that the Azure CLI is configured to use Resource Manager mode, by using the `azure config mode arm` command.

If you see **error: 'dns' is not an azure command**, it's most likely because you are using Azure CLI in Azure Service Management mode, not in Resource Manager mode.

## Create a new record set and record

To create a new record set in the Azure portal, see [Create a record set and records](dns-getstarted-create-recordset-cli.md).


## Retrieve a record set

To retrieve an existing record set, use `azure network dns record-set show`. Specify the resource group, zone name, record set relative name, and record type. Use the example below, replacing the values with your own.

	azure network dns record-set show myresourcegroup contoso.com www A


## List record sets

You can list all records in a DNS zone by using the `azure network dns record-set list` command. You need to specify the resource group name and zone name.

### To list all record sets

This example returns all record sets, regardless of name or record type:

	azure network dns record-set list myresourcegroup contoso.com

### To list record sets of a given type

This example returns all record sets that match the given record type (in this case, "A" records):

	azure network dns record-set list myresourcegroup contoso.com A


## Add a record to a record set

You add records to record sets by using the `azure network dns record-set add-record`command. The parameters for adding records to a record set vary depending on the type of the record that's being set. For example, when you use a record set of type "A", you can only specify records with the parameter `-a <IPv4 address>`.

To create a record set, use the `azure network dns record-set create`command. Specify the resource group, zone name, record set relative name, record type, and time to live (TTL). If the `--ttl` parameter is not defined, the value (in seconds) defaults to four.

	azure network dns record-set create myresourcegroup  contoso.com "test-a"  A --ttl 300


After you create the "A" record set, add the IPv4 address by using the `azure network dns record-set add-record`command.

	azure network dns record-set add-record myresourcegroup contoso.com "test-a" A -a 192.168.1.1


The following examples show how to create a record set of each record type. Each record set contains a single record.

[AZURE.INCLUDE [dns-add-record-cli-include](../../includes/dns-add-record-cli-include.md)]


## Update a record in a record set

### To add another IP address (1.2.3.4) to an existing "A" record set ("www"):

	azure network dns record-set add-record  myresourcegroup contoso.com  A
	-a 1.2.3.4
	info:    Executing command network dns record-set add-record
	Record set name: www
	+ Looking up the dns zone "contoso.com"
	+ Looking up the DNS record set "www"
	+ Updating DNS record set "www"
	data:    Id                              : /subscriptions/################################/resourceGroups/myresourcegroup/providers/Microsoft.Network/dnszones/contoso.com/a/www
	data:    Name                            : www
	data:    Type                            : Microsoft.Network/dnszones/a
	data:    Location                        : global
	data:    TTL                             : 4
	data:    A records:
	data:        IPv4 address                : 192.168.1.1
	data:        IPv4 address                : 1.2.3.4
	data:
	info:    network dns record-set add-record command OK

### To remove an existing value from a record set
Use `azure network dns record-set delete-record`.

	azure network dns record-set delete-record myresourcegroup contoso.com www A -a 1.2.3.4
	info:    Executing command network dns record-set delete-record
	+ Looking up the DNS record set "www"
	Delete DNS record? [y/n] y
	+ Updating DNS record set "www"
	data:    Id                              : /subscriptions/################################/resourceGroups/myresourcegroup/providers/Microsoft.Network/dnszones/contoso.com/A/www
	data:    Name                            : www
	data:    Type                            : Microsoft.Network/dnszones/A
	data:    Location                        : global
	data:    TTL                             : 4
	data:    A records:
	data:    IPv4 address                    : 192.168.1.1
	data:
	info:    network dns record-set delete-record command OK



## Remove a record from a record set

Records can be removed from a record set by using `azure network dns record-set delete-record`. The record that is being removed must be an exact match with an existing record across all parameters.

Removing the last record from a record set does not delete the record set. For more information, see the section of this article called [Delete a record set](#delete).

	azure network dns record-set delete-record myresourcegroup contoso.com www A -a 192.168.1.1

	azure network dns record-set delete myresourcegroup contoso.com www A

### Remove an AAAA record from a record set

	azure network dns record-set delete-record myresourcegroup contoso.com test-aaaa  AAAA -b "2607:f8b0:4009:1803::1005"

### Remove a CNAME record from a record set

	azure network dns record-set delete-record myresourcegroup contoso.com test-cname CNAME -c www.contoso.com


### Remove an MX record from a record set

	azure network dns record-set delete-record myresourcegroup contoso.com "@" MX -e "mail.contoso.com" -f 5

### Remove an NS record from record set

	azure network dns record-set delete-record myresourcegroup contoso.com  "test-ns" NS -d "ns1.contoso.com"

### Remove an SRV record from a record set

	azure network dns record-set delete-record myresourcegroup contoso.com  "_sip._tls" SRV -p 0 -w 5 -o 8080 -u "sip.contoso.com"

### Remove a TXT record from a record set

	azure network dns record-set delete-record myresourcegroup contoso.com  "test-TXT" TXT -x "this is a TXT record"

## <a name="delete"></a>Delete a record set

Record sets can be deleted by using the `Remove-AzureRmDnsRecordSet` cmdlet. You cannot delete the SOA and NS record sets at the zone apex (name = "@") that were created automatically when the zone was created. They will be deleted automatically if the zone is deleted.

In the following example, the "A" record set "test-a" will be removed from the "contoso.com" DNS zone:

	azure network dns record-set delete myresourcegroup contoso.com  "test-a" A

The optional *-q* switch can be used to suppress the confirmation prompt.


## Next steps

For more information about Azure DNS, see [Azure DNS overview](dns-overview.md). For information about automating DNS, see [Creating DNS zones and record sets using the .NET SDK](dns-sdk.md).

If you want to work with reverse DNS records, see [How to manage reverse DNS records for your services using the Azure CLI](dns-reverse-dns-record-operations-cli.md).
