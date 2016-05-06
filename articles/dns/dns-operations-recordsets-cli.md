<properties 
   pageTitle="Manage DNS record sets and records on Azure DNS using Azure CLI | Microsoft Azure" 
   description="Managing DNS record sets and records on Azure DNS when hosting your domain on Azure DNS. All CLI commands for operations on record sets and records." 
   services="dns" 
   documentationCenter="na" 
   authors="joaoma" 
   manager="carmonm" 
   editor=""/>

<tags
   ms.service="dns"
   ms.devlang="en"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="03/04/2016"
   ms.author="joaoma"/>

# How to manage DNS records using CLI

> [AZURE.SELECTOR]
- [Azure CLI](dns-operations-recordsets-cli.md)
- [PowerShell](dns-operations-recordsets.md)

This guide will show how to manage record sets and records for your DNS zone using the cross-platform Azure CLI.

>[AZURE.NOTE] Azure DNS is an Azure Resource Manager-only service.  It does not have an ASM API.  You will therefore need to ensure the Azure CLI is configured to use Resource Manager mode, using the 'azure config mode arm' command.

>If you see "error: 'dns' is not an azure command" it is most likely because you are using Azure CLI in ASM mode, not Resource Manager mode.

It is important to understand the distinction between DNS record sets and individual DNS records.  A record set is the collection of records in a zone with the same name and the same type.  For more details, see [Understanding record sets and records](dns-getstarted-create-recordset.md#Understanding-record-sets-and-records).

## Create a record set

Record sets are created using the `azure network dns record-set create` command .  You need to specify the record set name, the zone, the Time-to-Live (TTL) and the record type.

The record set name must be a relative name, excluding the zone name.  For example, the record set name ‘www’ in zone ‘contoso.com’ will create a record set with the fully-qualified name ‘www.contoso.com’.

For a record set at the zone apex, use "@" as the record set name, including quotation marks.  The fully-qualified name of the record set is then equal to the zone name, in this case "contoso.com".

Azure DNS supports the following record types: A, AAAA, CNAME, MX, NS, SOA, SRV, TXT.  Record sets of type SOA are created automatically with each zone, they cannot be created separately.  Note that [the SPF record type has been deprecated by the DNS standards in favour of creating SPF records using the TXT record type](http://tools.ietf.org/html/rfc7208#section-3.1).

	azure network dns record-set create myresourcegroup contoso.com  www  A --ttl 300


>[AZURE.IMPORTANT] CNAME record sets cannot co-exist with other record sets with the same name.  For example, you cannot create a CNAME with the relative name ‘www’ and an A record with the relative name ‘www’ at the same time.  Since the zone apex (name = ‘@’) always contains the NS and SOA record sets created when the zone is created, this means you cannot create a CNAME record set at the zone apex.  These constraints arise from the DNS standards, they are not limitations of Azure DNS.

### Wildcard records

Azure DNS supports [wildcard records](https://en.wikipedia.org/wiki/Wildcard_DNS_record).  These are returned for any query with a matching name (unless there is a closer match from a non-wildcard record set).
 To create a wildcard record set, use the record set name "\*", or a name whose first label is "\*", e.g. "\*.foo".

Wildcard record sets are supported for all record types except NS and SOA.  

## Get a record set
To retrieve an existing record set, use `azure network dns record-set show`, specifying resource group, zone name, record set relative name and the record type:

	azure network dns record-set show myresourcegroup contoso.com www A


## List record sets

You can list all records in a DNS Zone using `azure network dns record-set list` command:

### Option 1 
List all record sets.  This will return all record sets, regardless of name or record type:

	azure network dns record-set list myresourcegroup contoso.com

### Option 2 

List record sets of a given record type.  This will return all record sets matching the given record type (in this case, A records):


	azure network dns record-set list myresourcegroup contoso.com A 

In both cases you will specify the resource group name and zone name.

## Add a record to a record set

Records are added to record sets using the `azure network dns record-set add-record`.

The parameters for adding records to a record set vary depending on the type of the record set. For example, when using a record set of type 'A' you will only be able to specify records with the parameter "-a `<IPv4 address>`".

The following examples show how to create a record set of each record type containing a single record.

### Create A record set with single record

To create record set, use `azure network dns record-set create`, specifying resource group, zone name, record set relative name, the record type and time to live (TTL):
	
	azure network dns record-set create myresourcegroup  contoso.com "test-a"  A --ttl 300

>[AZURE.NOTE] If --ttl parameter is not defined, the value defaults to 4 (in seconds).


After creating the A record set, add IPv4 address to record set with `azure network dns record-set add-record`:

	azure network dns record-set add-record myresourcegroup contoso.com "test-a" A -a 192.168.1.1 

### Create AAAA record set with single record

	azure network dns record-set create myresourcegroup contoso.com "test-aaaa" AAAA --ttl 300

	azure network dns record-set add-record myresourcegroup contoso.com "test-aaaa" AAAA -b "2607:f8b0:4009:1803::1005"

### Create CNAME record set with single record

	azure network dns record-set create -g myresourcegroup contoso.com  "test-cname" CNAME --ttl 300
	
	azure network dns record-set add-record  myresourcegroup contoso.com  test-cname CNAME -c "www.contoso.com"

>[AZURE.NOTE] CNAME records only allows one single string value. 

### Create MX record set with single record

In this example, we use the record set name "@" to create the MX record at the zone apex (e.g. "contoso.com").  This is common for MX records.

	azure network dns record-set create myresourcegroup contoso.com  "@"  MX --ttl 300

	azure network dns record-set add-record -g myresourcegroup contoso.com  "@" MX -e "mail.contoso.com" -f 5


### Create NS record set with single record

	azure network dns record-set create myresourcegroup contoso.com test-ns  NS --ttl 300
	
	azure network dns record-set add-record myresourcegroup  contoso.com  "test-ns" NS -d "ns1.contoso.com" 
	
### Create SRV record set with single record

If creating an SRV record in root of zone, just specify _service and _protocol in the record name—there is no need to also include ‘.@’ in the record name

	
	azure network dns record-set create myresourcegroup contoso.com "_sip._tls" SRV --ttl 300 

	azure network dns record-set add-record myresourcegroup contoso.com  "_sip._tls" SRV -p 0 - w 5 -o 8080 -u "sip.contoso.com" 

### Create TXT record set with single record

	azure network dns record-set create myresourcegroup contoso.com "test-TXT" TXT --ttl 300

	azure network dns record-set add-record myresourcegroup contoso.com "test-txt" TXT -x "this is a TXT record" 


## Modifying existing record sets


This is shown by the following examples:

### Update a record in an existing record set

For this example we will add another IP address (1.2.3.4) to an existing A record set (www): 

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


You will use `azure network dns record-set delete-record` to remove an existing value from a record set:
 
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
	data:        IPv4 address                : 192.168.1.1
	data:
	info:    network dns record-set delete-record command OK



## Remove a record from an existing record set

Records can be removed from a record set using `azure network dns record-set delete-record` Note that the record being removed must be an exact match with an existing record, across all parameters.

Removing the last record from a record set does not delete the record set.  See [Delete a record set](#delete-a-record-set) below for more.


	azure network dns record-set delete-record myresourcegroup contoso.com www A -a 192.168.1.1

	azure network dns record-set delete myresourcegroup contoso.com www A

### Remove AAAA record from a record set

	azure network dns record-set delete-record myresourcegroup contoso.com test-aaaa  AAAA -b "2607:f8b0:4009:1803::1005"

### Remove CNAME record from a record set

	azure network dns record-set delete-record myresourcegroup contoso.com test-cname CNAME -c www.contoso.com
	

### Remove MX record from a record set

	azure network dns record-set delete-record myresourcegroup contoso.com "@" MX -e "mail.contoso.com" -f 5

### Remove NS record from record set
	
	azure network dns record-set delete-record myresourcegroup contoso.com  "test-ns" NS -d "ns1.contoso.com"

### Remove SRV record from a record set

	azure network dns record-set delete-record myresourcegroup contoso.com  "_sip._tls" SRV -p 0 -w 5 -o 8080 -u "sip.contoso.com" 

### Remove TXT record from a record set

	azure network dns record-set delete-record myresourcegroup contoso.com  "test-TXT" TXT -x "this is a TXT record"

## Delete a record set
Record sets can be deleted using the Remove-AzureDnsRecordSet cmdlet.

>[AZURE.NOTE] You cannot delete the SOA and NS record sets at the zone apex (name = ‘@’) that are created automatically when the zone is created.  They will be deleted automatically when deleting the zone.

In the example below, the A record set "test-a" will be removed from contoso.com DNS zone:

	azure network dns record-set delete myresourcegroup contoso.com  "test-a" A 

The optional ‘-q’ switch can be used to suppress the confirmation prompt.


## Next steps

After creating the DNS zone and records, you can [delegate your domain to Azure DNS](dns-domain-delegation.md).<BR>
Learn how to [manage DNS zones](dns-operations-dnszones-cli.md) using CLI.<BR>
You can also [automate operations using .NET SDK](dns-sdk.md) to code Azure DNS opearations into your application.

 
