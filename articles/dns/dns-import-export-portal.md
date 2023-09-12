---
title: Import and export a domain zone file - Azure portal
titleSuffix: Azure DNS
description: Learn how to import and export a DNS (Domain Name System) zone file to Azure DNS by using Azure portal 
services: dns
author: greg-lindsay
ms.service: dns
ms.custom: devx-track-azurecli
ms.date: 09/11/2023
ms.author: greglin
ms.topic: how-to
---

# Import and export a DNS zone file using the Azure portal

In this article, you learn how to  import and export a DNS zone file in Azure DNS using Azure portal.

## Introduction to DNS zone migration

A DNS zone file is a text file containing information about every DNS record in the zone. It follows a standard format, making it suitable for transferring DNS records between DNS systems. Using a zone file is a fast and convenient way to import DNS zones into Azure DNS. You can also export a zone file from Azure DNS to use with other DNS systems.

Azure DNS supports importing and exporting zone files via the Azure CLI and the Azure portal.

## Obtain your existing DNS zone file

Before you import a DNS zone file into Azure DNS, you need to obtain a copy of the zone file. The source of this file depends on where the DNS zone is hosted.

* If your DNS zone is hosted by a partner service, the service should provide a way for you to download the DNS zone file. Partner services include domain registrar, dedicated DNS hosting provider, or an alternative cloud provider.
* If your DNS zone is hosted on Windows DNS, the default folder for the zone files is **%systemroot%\system32\dns**. The full path to each zone file is also shown on the **General** tab of the DNS console.
* If your DNS zone is hosted using BIND, the location of the zone file for each zone gets specified in the BIND configuration file **named.conf**.

> [!IMPORTANT]
> If the zone file that you import contains CNAME entries that point to names in a private zone, Azure DNS resolution of the CNAME fails unless the other zone is also imported, or the CNAME entries are modified.

## Import a DNS zone file into Azure DNS

Importing a zone file creates a new zone in Azure DNS if the zone doesn't already exist. If the zone exists, then the record sets in the zone file are merged with the existing record sets.

### Merge behavior

* By default, the new record sets get merged with the existing record sets. Identical records within a merged record set aren't duplicated.
* When record sets are merged, the time to live (TTL) of pre-existing record sets is used.
* Start of Authority (SOA) parameters, except `host` are always taken from the imported zone file. The name server record set at the zone apex also always uses the TTL taken from the imported zone file.
* An imported CNAME record doesn't replace an existing CNAME record with the same name.  
* When a conflict happens between a CNAME record and another record with the same name of different type, the existing record gets used.

### Additional information about importing

The following notes provide more details about the zone import process.

* The `$TTL` directive is optional, and is supported. When no `$TTL` directive is given, records without an explicit TTL are imported set to a default TTL of 3600 seconds. When two records in the same record set specify different TTLs, the lower value is used.
* The `$ORIGIN` directive is optional, and is supported. When no `$ORIGIN` is set, the default value used is the zone name as specified on the command line, including the ending dot (.).
* The `$INCLUDE` and `$GENERATE` directives aren't supported.
* The following record types are supported: A, AAAA, CAA, CNAME, MX, NS, SOA, SRV, and TXT.
* The SOA record is created automatically by Azure DNS when a zone is created. When you import a zone file, all SOA parameters are taken from the zone file *except* the `host` parameter. This parameter uses the value provided by Azure DNS because it needs to refer to the primary name server provided by Azure DNS.
* The name server record set at the zone apex is also created automatically by Azure DNS when the zone is created. Only the TTL of this record set is imported. These records contain the name server names provided by Azure DNS. The record data isn't overwritten by the values contained in the imported zone file.
* During Public Preview, Azure DNS supports only single-string TXT records. Multistring TXT records are to be concatenated and truncated to 255 characters.


## Import a zone file

If you don't have a resource group in Azure, create a resource group using Azure portal or Azure CLI. For example: **myresourcegroup**. 

The following zone file and parameters are used in this example:

```text
$ORIGIN contoso.com. 
$TTL 86400 
@	IN	SOA	dns1.contoso.com.	hostmaster.contoso.com. (
			2001062501 ; serial                     
			21600      ; refresh after 6 hours                     
			3600       ; retry after 1 hour                     
			604800     ; expire after 1 week                     
			86400 )    ; minimum TTL of 1 day  	     
	           
	IN	NS	dns1.contoso.com.       
	IN	NS	dns2.contoso.com.        

	IN	MX	10	mail.contoso.com.       
	IN	MX	20	mail2.contoso.com.        

dns1	IN	A	5.4.3.2
dns2	IN	A	4.3.2.1		       
server1	IN	A	4.4.3.2        
server2	IN	A	5.5.4.3
ftp	IN	A	3.3.2.1
	IN	A	3.3.3.2
mail	IN	CNAME	server1
mail2	IN	CNAME	server2
www	IN	CNAME	server1
```

Origin zone name: **contoso.com** 
Zone filename: **contoso.com.txt** 
Destination zone name: **newzone.com** 
Resource group: **myresourcegroup** 

[Link to use](https://ms.portal.azure.com/?feature.zoneimportexport=true)

To import the zone file:

1. In the Azure portal, go to the DNS zones overview page.

## Next steps

* Learn how to [manage record sets and records](./dns-getstarted-cli.md) in your DNS zone.
* Learn how to [delegate your domain to Azure DNS](dns-domain-delegation.md).
