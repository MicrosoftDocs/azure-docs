---
title: DNS Zones and Records overview - Azure DNS
description: Overview of support for hosting DNS zones and records in Microsoft Azure DNS.
author: greg-lindsay
ms.assetid: be4580d7-aa1b-4b6b-89a3-0991c0cda897
ms.service: dns
ms.topic: conceptual
ms.custom: H1Hack27Feb2017
ms.workload: infrastructure-services
ms.date: 09/06/2023
ms.author: greglin
---

# Overview of DNS zones and records

This article explains the key concepts of domains, DNS zones, DNS records, and record sets. You learn how they're supported in Azure DNS.

## Domain names

The Domain Name System is a hierarchy of domains. The hierarchy starts from the `root` domain, whose name is simply '**.**'.  Below this come top-level domains, such as `com`, `net`, `org`, `uk` or `jp`.  Below the top-level domains are second-level domains, such as `org.uk` or `co.jp`. The domains in the DNS hierarchy are globally distributed, hosted by DNS name servers around the world.

A domain name registrar is an organization that allows you to purchase a domain name, such as `contoso.com`. Purchasing a domain name gives you the right to control the DNS hierarchy under that name, for example allowing you to direct the name `www.contoso.com` to your company web site. The registrar may host the domain in its own name servers on your behalf or allow you to specify alternative name servers.

Azure DNS provides a globally distributed and high-availability name server infrastructure that you can use to host your domain. By hosting your domains in Azure DNS, you can manage your DNS records with the same credentials, APIs, tools, billing, and support as your other Azure services.

Azure DNS currently doesn't support purchasing of domain names. For an annual fee, you can buy a domain name by using [App Service domains](../app-service/manage-custom-dns-buy-domain.md#buy-and-map-an-app-service-domain) or a third-party domain name registrar. Your domains then can be hosted in Azure DNS for record management. For more information, see [Delegate a domain to Azure DNS](dns-domain-delegation.md).

## DNS zones

[!INCLUDE [dns-create-zone-about](../../includes/dns-create-zone-about-include.md)]

## DNS records

[!INCLUDE [dns-about-records-include](../../includes/dns-about-records-include.md)]

### Time-to-live

The time to live, or TTL, specifies how long each record is cached by clients before being queried. In the above example, the TTL is 3600 seconds or 1 hour.

In Azure DNS, the TTL gets specified for the record set, not for each record, so the same value is used for all records within that record set.  You can specify any TTL value between 1 and 2,147,483,647 seconds.

### Wildcard records

Azure DNS supports [wildcard records](https://en.wikipedia.org/wiki/Wildcard_DNS_record). Wildcard records get returned in response to any query with a matching name, unless there's a closer match from a non-wildcard record set. Azure DNS supports wildcard record sets for all record types except NS and SOA.

To create a wildcard record set, use the record set name '\*'. You can also use a name with '\*' as its left-most label, for example, '\*.foo'.

### CAA records

CAA records allow domain owners to specify which Certificate Authorities (CAs) are authorized to issue certificates for their domain. This record allows CAs to avoid mis-issuing certificates in some circumstances. CAA records have three properties:
* **Flags**: This field is an integer between 0 and 255, used to represent the critical flag that has special meaning per [RFC6844](https://tools.ietf.org/html/rfc6844#section-3)
* **Tag**: an ASCII string that can be one of the following:
    * **issue**: if you want to specify CAs that are permitted to issue certs (all types)
    * **issuewild**: if you want to specify CAs that are permitted to issue certs (wildcard certs only)
    * **iodef**: specify an email address or hostname to which CAs can notify for unauthorized cert issue requests
* **Value**: the value for the specific Tag chosen

### CNAME records

CNAME record sets can't coexist with other record sets with the same name. For example, you can't create a CNAME record set with the relative name `www` and an A record with the relative name `www` at the same time.

Since the zone apex (name = '\@') will always contain the NS and SOA record sets during the creation of the zone, you can't create a CNAME record set at the zone apex.

These constraints arise from the DNS standards and aren't limitations of Azure DNS.

### NS records

The NS record set at the zone apex (name '\@') gets created automatically with each DNS zone and gets deleted automatically when the zone gets deleted. It can't be deleted separately.

This record set contains the names of the Azure DNS name servers assigned to the zone. You can add more name servers to this NS record set, to support cohosting domains with more than one DNS provider. You can also modify the TTL and metadata for this record set. However, removing or modifying the prepopulated Azure DNS name servers isn't allowed. 

This restriction only applies to the NS record set at the zone apex. Other NS record sets in your zone (as used to delegate child zones) can be created, modified, and deleted without constraint.

### SOA records

A SOA record set gets created automatically at the apex of each zone (name = '\@'), and gets deleted automatically when the zone gets deleted. SOA records can't be created or deleted separately.

You can modify all properties of the SOA record except for the `host` property. This property gets preconfigured to refer to the primary name server name provided by Azure DNS.

The zone serial number in the SOA record isn't updated automatically when changes are made to the records in the zone. It can be updated manually by editing the SOA record, if necessary.

### SPF records

[!INCLUDE [dns-spf-include](../../includes/dns-spf-include.md)]

### SRV records

[SRV records](https://en.wikipedia.org/wiki/SRV_record) are used by various services to specify server locations. When specifying an SRV record in Azure DNS:

* The *service* and *protocol* must be specified as part of the record set name, prefixed with underscores, such as '\_sip.\_tcp.name'. For a record at the zone apex, there's no need to specify '\@' in the record name, simply use the service and protocol, such as '\_sip.\_tcp'.
* The *priority*, *weight*, *port*, and *target* are specified as parameters of each record in the record set.

### TXT records

TXT records are used to map domain names to arbitrary text strings. They're used in multiple applications, in particular related to email configuration, such as the [Sender Policy Framework (SPF)](https://en.wikipedia.org/wiki/Sender_Policy_Framework) and [DomainKeys Identified Mail (DKIM)](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail).

The DNS standards permit a single TXT record to contain multiple strings, each of which may be up to 255 characters in length. Where multiple strings are used, they're concatenated by clients and treated as a single string.

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

The following default limits apply when using Azure DNS:

[!INCLUDE [dns-limits](../../includes/dns-limits.md)]

## Next steps

* To start using Azure DNS, learn how to [create a DNS zone](./dns-getstarted-portal.md) and [create DNS records](./dns-getstarted-portal.md).
* To migrate an existing DNS zone, learn how to [import and export a DNS zone file](dns-import-export.md).
