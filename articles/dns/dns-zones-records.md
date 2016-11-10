---
title: DNS Zones and Records | Microsoft Docs
description: Overview of support for hosting DNS zones and records in Microsoft Azure DNS.
services: dns
documentationcenter: na
author: jtuliani
manager: carmonm
editor: ''

ms.assetid: be4580d7-aa1b-4b6b-89a3-0991c0cda897
ms.service: dns
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/17/2016
ms.author: jtuliani

---
# DNS zones and records
This page explains the key concepts of domains, DNS zones, and DNS records and record sets, and how they are supported in Azure DNS.

## Domain names
The Domain Name System is a hierarchy of domains. The hierarchy starts from the ‘root’ domain, whose name is simply ‘**.**’.  Below this come top-level domains, such as ‘com’, ‘net’, ‘org’, ‘uk’ or ‘jp’.  Below these are second-level domains, such as ‘org.uk’ or ‘co.jp’. The domains in the DNS hierarchy are globally distributed, hosted by DNS name servers around the world.

A domain name registrar is an organization that allows you to purchase a domain name, such as ‘contoso.com’.  Purchasing a domain name gives you the right to control the DNS hierarchy under that name, for example allowing you to direct the name ‘www.contoso.com’ to your company web site. The registrar may host the domain in its own name servers on your behalf, or alternatively you can specify alternative name servers.

Azure DNS provides a globally distributed, high-availability name server infrastructure, which you can use to host your domain. By hosting your domains in Azure DNS, you can manage your DNS records with the same credentials, APIs, tools, billing, and support as your other Azure services.

Azure DNS does not currently support purchasing of domain names. If you want to purchase a domain name, you need to use a third-party domain name registrar. The registrar will typically charge a small annual fee. The domains can then be hosted in Azure DNS for management of DNS records. See [Delegate a Domain to Azure DNS](dns-domain-delegation.md) for details.

## DNS zones
A DNS zone is used to host the DNS records for a particular domain. To start hosting your domain in Azure DNS, you need to create a DNS zone for that domain name. Each DNS record for your domain is then created inside this DNS zone. 

For example, the domain ‘contoso.com’ may contain several DNS records, such as ‘mail.contoso.com’ (for a mail server) and ‘www.contoso.com’ (for a web site).

When creating a DNS zone in Azure DNS, the name of the zone must be unique within the resource group. The same zone name can be reused in a different resource group or a different Azure subscription. Where multiple zones share the same name, each instance is assigned different name server addresses. Only one set of addresses can be configured with the domain name registrar.

> [!NOTE]
> You do not have to own a domain name to create a DNS zone with that domain name in Azure DNS. However, you do need to own the domain to configure the Azure DNS name servers as the correct name servers for the domain name with the domain name registrar.
> 
> 

For more information, see [Delegate a domain to Azure DNS](dns-domain-delegation.md).

## DNS records
### Record types
Each DNS record has a name and a type. Records are organized into various types according to the data they contain. The most common type is an ‘A’ record, which maps a name to an IPv4 address. Another common type is an ‘MX’ record, which maps a name to a mail server.

Azure DNS supports all common DNS record types: A, AAAA, CNAME, MX, NS, PTR, SOA, SRV, and TXT.

### Record names
In Azure DNS, records are specified by using relative names. A *fully qualified* domain name (FQDN) includes the zone name, whereas a *relative* name does not. For example, the relative record name ‘www’ in the zone ‘contoso.com’ gives the fully qualified record name ‘www.contoso.com’.

An *apex* record is a DNS record at the root (or *apex*) of a DNS zone. For example, in the DNS zone 'contoso.com', an apex record also has the fully qualified name 'contoso.com' (this is sometimes called a *naked* domain).  By convention, the relative name '@' is used to create apex records.

### Record sets
Sometimes you need to create more than one DNS record with a given name and type. For example, suppose the ‘www.contoso.com’ web site is hosted on two different IP addresses. The website requires two different A records, one for each IP address. This is an example of a record set:

    www.contoso.com.        3600    IN    A    134.170.185.46
    www.contoso.com.        3600    IN    A    134.170.188.221

Azure DNS manages DNS records using *record sets*. A record set (also known as a *resource* record set) is the collection of DNS records in a zone that have the same name and are of the same type. Most record sets contain a single record, but examples like this one, in which a record set contains more than one record, are not uncommon.

For example, suppose you have already created an A record ‘www’ in the zone ‘contoso.com’, pointing to the IP address ‘134.170.185.46’ (the first record above).  To create the second record you would add that record to the existing record set, rather than create a new record set.

The SOA and CNAME record types are exceptions. The DNS standards don't permit multiple records with the same name for these types, thus these record sets can only contain a single record.

### Time-to-live
The time to live, or TTL, specifies how long each record is cached by clients before being re-queried. In the above example, the TTL is 3600 seconds or 1 hour.

In Azure DNS, the TTL is specified for the record set, not for each record, so the same value is used for all records within that record set.  You can specify any TTL value between 1 and 2,147,483,647 seconds.

### Wildcard records
Azure DNS supports [wildcard records](https://en.wikipedia.org/wiki/Wildcard_DNS_record). Wildcard records are returned in response to any query with a matching name (unless there is a closer match from a non-wildcard record set). Wildcard record sets are supported for all record types except NS and SOA.  

To create a wildcard record set, use the record set name ‘\*’. Alternatively, you can also use a name with ‘\*’ as its left-most label, for example, ‘\*.foo’.

### CNAME records
CNAME record sets cannot coexist with other record sets with the same name. For example, you cannot create a CNAME record set with the relative name ‘www’ and an A record with the relative name ‘www’ at the same time.

Because the zone apex (name = ‘@’) always contains the NS and SOA record sets that were created when the zone was created, you can't create a CNAME record set at the zone apex.

These constraints arise from the DNS standards and are not limitations of Azure DNS.

### NS records
An NS record set is created automatically at the apex of each zone (name = ‘@’), and is deleted automatically when the zone is deleted (it cannot be deleted separately).  You can modify the TTL of this record set, but you cannot modify the records, which are pre-configured to refer to the Azure DNS name servers assigned to the zone.

You can create and delete other NS records within the zone, not at the zone apex.  This allows you to configure child zones (see [Delegating sub-domains in Azure DNS](dns-domain-delegation.md#delegating-sub-domains-in-azure-dns).)

### SOA records
A SOA record set is created automatically at the apex of each zone (name = ‘@’), and is deleted automatically when the zone is deleted.  SOA records cannot be created or deleted separately. 

You can modify all properties of the SOA record except for the 'host' property, which is pre-configured to refer to the primary name server name provided by Azure DNS.

### SPF records
Sender Policy Framework (SPF) records are used to specifying which email servers are permitted to send email on behalf of a given domain name.  Correct configuration of SPF records is important to prevent recipients marking your email as 'junk'.

The DNS RFCs originally introduced a new 'SPF' record type to support this scenario. To support older name servers, they also permitted the use of the TXT record type to specify SPF records.  This ambiguity led to confusion, which was resolved by [RFC 7208](http://tools.ietf.org/html/rfc7208#section-3.1).  This stated that SPF records should only be created using the TXT record type, and deprecated the SPF record type. 

**SPF records are supported by Azure DNS and should be created using the TXT record type.** The obsolete SPF record type is not supported. When [importing a DNS zone file](dns-import-export.md), any SPF records using the SPF record type are converted to the TXT record type. 

### SRV records
[SRV records](https://en.wikipedia.org/wiki/SRV_record) are used by various services to specify server locations. When specifying an SRV record in Azure DNS:

* The *service* and *protocol* must be specified as part of the record set name, prefixed with underscores.  For example, '\_sip.\_tcp.name'.  For a record at the zone apex, there is no need to specify '@' in the record name, simply use the service and protocol, e.g. '\_sip.\_tcp'.
* The *priority*, *weight*, *port*, and *target* are specified as parameters of each record in the record set. 

## Tags and metadata
### Tags
Tags are a list of name-value pairs and are used by Azure Resource Manager to label resources.  Azure Resource Manager uses tags to enable filtered views of your Azure bill, and also enables you to set a policy on which tags are required. For more information about tags, see [Using tags to organize your Azure resources](../resource-group-using-tags.md).

Azure DNS supports using Azure Resource Manager tags on DNS zone resources.  It does not support tags on DNS record sets.

### Metadata
As an alternative to record set tags, Azure DNS supports annotating record sets using 'metadata'.  Similar to tags, metadata enables you to associate name-value pairs with each record set.  This can be useful, for example to record the purpose of each record set.  Unlike tags, metadata cannot be used to provide a filtered view of your Azure bill and cannot be specified in an Azure Resource Manager policy.

## Limits
The following default limits apply when using Azure DNS:

[!INCLUDE [dns-limits](../../includes/dns-limits.md)]

## Next steps
* To start using Azure DNS, learn how to [create a DNS zone](dns-getstarted-create-dnszone-portal.md) and [create DNS records](dns-getstarted-create-recordset-portal.md).
* To migrate an existing DNS zone, learn how to [import and DNS zone file](dns-import-export.md).

