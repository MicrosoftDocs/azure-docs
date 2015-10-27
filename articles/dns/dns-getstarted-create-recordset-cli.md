<properties
   pageTitle="Create a record set and records for a DNS Zone using CLI| Microsoft Azure"
   description="How to create host records for Azure DNS.Setting up record sets and records using CLI"
   services="dns"
   documentationCenter="na"
   authors="joaoma"
   manager="Adinah"
   editor=""/>

<tags
   ms.service="dns"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="09/22/2015"
   ms.author="joaoma"/>


# Create DNS records using CLI

> [AZURE.SELECTOR]
- [Azure CLI](dns-getstarted-create-recordset-cli.md)
- [Azure Powershell steps](dns-getstarted-create-recordset.md)



After creating your DNS Zone, you need to add the DNS records for your domain.  To do this, you first need to understand DNS records and record sets.


## Understanding record sets and records
Each DNS record has a name and a type.

A _fully qualified_ name includes the zone name, whereas a _relative_ name does not.  For example, the relative record name ‘www’ in the zone ‘contoso.com’ gives the fully qualified record name ‘www.contoso.com’.

>[AZURE.NOTE] In Azure DNS, records are specified using relative names.

Records come in various types according to the data they contain.  The most common type is an ‘A’ record, which maps a name to an IPv4 address.  Another type is an ‘MX’ record, which maps a name to a mail server.

Azure DNS supports all common DNS record types: A, AAAA, CNAME, MX, NS, SOA, SRV and TXT.  (Note that [SPF records should be created using the TXT record type](http://tools.ietf.org/html/rfc7208#section-3.1).)

Sometimes, you need to create more than one DNS record with a given name and type.  For example, suppose the www.contoso.com web site is hosted on two different IP addresses.  This requires two different A records, one for each IP address:

	www.contoso.com.		3600	IN	A	134.170.185.46
	www.contoso.com.		3600	IN	A	134.170.188.221

This is an example of a record set.  A record set is the collection of DNS records in a zone with the same name and the same type.  Most record sets contain a single record, but examples like the one above in which a record set contains more than one record are not uncommon.  (Records sets of type SOA and CNAME are an exception, the DNS standards do not permit multiple records with the same name for these types.)

The Time-to-Live, or TTL, specifies how long each record is cached by clients before being re-queried.  In the above example, the TTL is 3600 seconds or 1 hour.  The TTL is specified for the record set, not for each record, so the same value is used for all records within that record set.

>[AZURE.NOTE] Azure DNS manages DNS records using record sets.



## Create record sets and records 

In the following example we will show how to create a record set and records.  We'll use the DNS 'A' record type, for other record types see [How to manage DNS records](dns-operations-recordsets-cli.md)


### Step 1

Create record set:

	Usage: network dns record-set create <resource-group> <dns-zone-name> <name> <type> <ttl>

	azure network dns record-set create myresourcegroup  contoso.com  www A  60

The record set has relative name ‘www’ in the DNS Zone ‘contoso.com’, so the fully-qualified name of the records will be ‘www.contoso.com’.  The record type is ‘A’ and the TTL is 60 seconds.

>[AZURE.NOTE] To create a record set in the apex of the zone (in this case, 'contoso.com'), use the record name "@", including the quotation marks. This is a common DNS convention.

The record set is empty and we have to add records to be able to use the newly created "www" record set.<BR>

### Step 2

Add IPv4 A records to the "www" record set using the following command:

	Usage: network dns record-set add-record <resource-group> <dns-zone-name> <record-set-name> <type>

	azure network dns record-set add-record myresourcegroup contoso.com  www A  -a 134.170.185.46
	

The changes are complete.  You can retrieve the record set from Azure DNS using "azure network dns-record-set show" :


	azure network dns record-set show myresourcegroup "contoso.com" www A
	
	info:    Executing command network dns-record-set show
	+ Looking up the DNS record set "www"
	data:    Id                              : /subscriptions/########################/resourceGroups/myresourcegroup/providers/Microsoft.Network/dnszones/contoso.com/A/www
	data:    Name                            : www
	data:    Type                            : Microsoft.Network/dnszones/A
	data:    Location                        : global
	data:    TTL                             : 300
	data:    A records:
	data:        IPv4 address                : 134.170.185.46
	data:
	info:    network dns record-set show command OK


You can also use nslookup or other DNS tools to query the new record set.  

>[AZURE.NOTE] As when creating the zone, if you have not yet delegated the domain to the Azure DNS name servers you will need to specify the name server address for your zone explicitly.


	C:\> nslookup www.contoso.com ns1-01.azure-dns.com

	Server: ns1-01.azure-dns.com
	Address:  208.76.47.1

	Name:    www.contoso.com
	Addresses:  134.170.185.46
    	        



## Next Steps
[How to manage DNS zones](dns-operations-dnszones-cli.md)

[How to manage DNS records](dns-operations-recordsets-cli.md)<BR>

[Automate Azure Operations with .NET SDK](dns-sdk.md)
 
