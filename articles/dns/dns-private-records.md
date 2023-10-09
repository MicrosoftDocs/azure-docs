---
title: Private DNS Records Overview - Azure Private DNS
description: Overview of suppoort for DNS records in Azure Private DNS.
author: greg-lindsay
ms.service: dns
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 10/09/2023
ms.author: greglin
---

# Overview of private DNS records

This article provides information about support for DNS records in Azure Private DNS zones. For an overiew of private DNS zones, see: [What is an Azure Private DNS zone?](private-dns-privatednszone.md)

## DNS records

### Record names

Records are specified by using relative names. A *fully qualified* domain name (FQDN) includes the zone name, whereas a *relative* name does not. For example, the relative record name `www` in the zone `contoso.com` gives the fully qualified record name `www.contoso.com`.

An *apex* record is a DNS record at the root (or *apex*) of a DNS zone. For example, in the DNS zone `contoso.com`, an apex record also has the fully qualified name `contoso.com` (this is sometimes called a *naked* domain).  By convention, the relative name '\@' is used to represent apex records.

### Record types

Each DNS record has a name and a type. Records are organized into various types according to the data they contain. The most common type is an 'A' record, which maps a name to an IPv4 address. Another common type is an 'MX' record, which maps a name to a mail server.

Azure Private DNS supports the following common DNS record types: A, AAAA, CNAME, MX, NS, PTR, SOA, SRV, and TXT.

### Record sets

Sometimes you need to create more than one DNS record with a given name and type. For example, suppose the 'www.contoso.com' web site is hosted on two different IP addresses. The website requires two different A records, one for each IP address. Here is an example of a record set:

```dns
www.contoso.com.        3600    IN    A    10.10.1.5
www.contoso.com.        3600    IN    A    10.10.1.10
```

Azure DNS manages all DNS records using *record sets*. A record set (also known as a *resource* record set) is the collection of DNS records in a zone that have the same name and are of the same type. Most record sets contain a single record. However, examples like the one above, in which a record set contains more than one record, are not uncommon.

For example, suppose you have already created an A record 'www' in the zone 'contoso.com', pointing to the IP address '10.10.1.5' (the first record shown previously).  To create the second record you would add that record to the existing record set, rather than create an additional record set.

The SOA and CNAME record types are exceptions. The DNS standards don't permit multiple records with the same name for these types, therefore these record sets can only contain a single record.

### Time-to-live

The time to live, or TTL, specifies how long each record is cached by clients before being queried. In the above example, the TTL is 3600 seconds or 1 hour.

In Azure DNS, the TTL gets specified for the record set, not for each record, so the same value is used for all records within that record set.  You can specify any TTL value between 1 and 2,147,483,647 seconds.

### Wildcard records

Azure DNS supports [wildcard records](https://en.wikipedia.org/wiki/Wildcard_DNS_record). Wildcard records get returned in response to any query with a matching name, unless there's a closer match from a non-wildcard record set. Azure DNS supports wildcard record sets for all record types except NS and SOA.

To create a wildcard record set, use the record set name '\*'. You can also use a name with '\*' as its left-most label, for example, '\*.foo'.

### CNAME records

CNAME record sets can't coexist with other record sets with the same name. For example, you can't create a CNAME record set with the relative name `www` and an A record with the relative name `www` at the same time.

Since the zone apex (name = '\@') always contains the NS and SOA record sets during the creation of the zone, you can't create a CNAME record set at the zone apex.

These constraints arise from the DNS standards and aren't limitations of Azure DNS.

### SOA records

A SOA record set gets created automatically at the apex of each zone (name = '\@'), and gets deleted automatically when the zone gets deleted. SOA records can't be created or deleted separately.

You can modify all properties of the SOA record except for the `host` property. This property gets preconfigured to refer to the primary name server name provided by Azure DNS.

The zone serial number in the SOA record isn't updated automatically when changes are made to the records in the zone. It can be updated manually by editing the SOA record, if necessary.

### SRV records

[SRV records](https://en.wikipedia.org/wiki/SRV_record) are used by various services to specify server locations. When specifying an SRV record in Azure DNS:

* The *service* and *protocol* must be specified as part of the record set name, prefixed with underscores, such as '\_sip.\_tcp.name'. For a record at the zone apex, there's no need to specify '\@' in the record name, simply use the service and protocol, such as '\_sip.\_tcp'.
* The *priority*, *weight*, *port*, and *target* are specified as parameters of each record in the record set.

### TXT records

TXT records are used to map domain names to arbitrary text strings. They're used in multiple applications.

The DNS standards permit a single TXT record to contain multiple strings, each of which can be up to 255 characters in length. Where multiple strings are used, they're concatenated by clients and treated as a single string.

When calling the Azure DNS REST API, you need to specify each TXT string separately.  When you use the Azure portal, PowerShell, or CLI interfaces, you should specify a single string per record. This string is automatically divided into 255-character segments if necessary.

The multiple strings in a DNS record shouldn't be confused with the multiple TXT records in a TXT record set.  A TXT record set can contain multiple records, *each of which* can contain multiple strings.  Azure DNS supports a total string length of up to 4096 characters`*` in each TXT record set (across all records combined).

`*` 4096 character support is currently only available in the Azure Public Cloud. National clouds are limited to 1024 characters until 4k support rollout is complete.

## Tags and metadata

### Tags

Tags are a list of name-value pairs and are used by Azure Resource Manager to label resources. Azure Resource Manager uses tags to enable filtered views of your Azure bill and also enables you to set a policy for certain tags. For more information about tags, see [Using tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md).

Azure DNS supports using Azure Resource Manager tags on DNS zone resources.  It doesn't support tags on DNS record sets, although as an alternative, metadata is supported on DNS record sets as explained below.

### Metadata

As an alternative to record set tags, Azure DNS supports annotating record sets using *metadata*.  Similar to tags, metadata enables you to associate name-value pairs with each record set.  This feature can be useful, for example to record the purpose of each record set. Unlike tags, metadata can't be used to provide a filtered view of your Azure bill and can't be specified in an Azure Resource Manager policy.

## Etags

Suppose two people or two processes try to modify a DNS record at the same time. Which one wins? And does the winner know that they have overwritten changes created by someone else?

Azure DNS uses Etags to handle concurrent changes to the same resource safely. Etags are separate from [Azure Resource Manager 'Tags'](#tags). Each DNS resource (zone or record set) has an Etag associated with it. Whenever a resource is retrieved, its Etag is also retrieved. When updating a resource, you can choose to pass back the Etag so Azure DNS can verify the Etag on the server matches. Since each update to a resource results in the Etag being regenerated, an Etag mismatch indicates a concurrent change has occurred. Etags can also be used when creating a new resource to ensure the resource doesn't already exist.

By default, Azure DNS PowerShell uses Etags to block concurrent changes to zones and record sets. The optional *-Overwrite* switch can be used to suppress Etag checks, in which case any concurrent changes that have occurred are overwritten.

At the level of the Azure DNS REST API, Etags are specified using HTTP headers. Their behavior is given in the following table:

| Header | Behavior |
| --- | --- |
| None |PUT always succeeds (no Etag checks) |
| If-match \<etag> |PUT only succeeds if resource exists and Etag matches |
| If-match * |PUT only succeeds if resource exists |
| If-none-match * |PUT only succeeds if resource doesn't exist |


## Limits

The following default limits apply when using Azure Private DNS:

[!INCLUDE [dns-limits-private-zones](../../includes/dns-limits-private-zones.md)]

## Next steps

- [What is a private Azure DNS zone](private-dns-privatednszone.md)
- [Quickstart: Create an Azure private DNS zone using the Azure portal](private-dns-getstarted-portal.md)
