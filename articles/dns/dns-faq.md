---
title: Azure DNS FAQ
description: Frequently asked questions about Azure DNS
services: dns
author: vhorne
ms.service: dns
ms.topic: article
ms.date: 6/15/2019
ms.author: victorh
---

# Azure DNS FAQ

## About Azure DNS

### What is Azure DNS?

The Domain Name System (DNS) translates, or resolves, a website or service name to its IP address. Azure DNS is a hosting service for DNS domains. It provides name resolution by using Microsoft Azure infrastructure. By hosting your domains in Azure, you can manage your DNS records by using the same credentials, APIs, tools, and billing as your other Azure services.

DNS domains in Azure DNS are hosted on the Azure global network of DNS name servers. This system uses Anycast networking so that each DNS query is answered by the closest available DNS server. Azure DNS provides fast performance and high availability for your domain.

Azure DNS is based on Azure Resource Manager. Azure DNS benefits from Resource Manager features such as role-based access control, audit logs, and resource locking. You can manage domains and records via the Azure portal, Azure PowerShell cmdlets, and the cross-platform Azure CLI. Applications that require automatic DNS management can integrate with the service via the REST API and SDKs.

### How much does Azure DNS cost?

The Azure DNS billing model is based on the number of DNS zones hosted in Azure DNS. It's also based on the number of DNS queries they receive. Discounts are provided based on usage.

For more information, see the [Azure DNS pricing page](https://azure.microsoft.com/pricing/details/dns/).

### What is the SLA for Azure DNS?

Azure guarantees that valid DNS requests receive a response from at least one Azure DNS name server 100% of the time.

For more information, see the [Azure DNS SLA page](https://azure.microsoft.com/support/legal/sla/dns).

### What is a DNS zone? Is it the same as a DNS domain? 

A domain is a unique name in the domain name system. An example is contoso.com.

A DNS zone is used to host the DNS records for a particular domain. For example, the domain contoso.com might contain several DNS records. The records might include mail.contoso.com for a mail server and www\.contoso.com for a website. These records are hosted in the DNS zone contoso.com.

A domain name is *just a name*. A DNS zone is a data resource that contains the DNS records for a domain name. You can use Azure DNS to host a DNS zone and manage the DNS records for a domain in Azure. It also provides DNS name servers to answer DNS queries from the Internet.

### Do I need to buy a DNS domain name to use Azure DNS? 

Not necessarily.

You don't need to buy a domain to host a DNS zone in Azure DNS. You can create a DNS zone at any time without owning the domain name. DNS queries for this zone resolve only if they're directed to the Azure DNS name servers assigned to the zone.

To link your DNS zone into the global DNS hierarchy, you must buy the domain name. Then, DNS queries from anywhere in the world find your DNS zone and answer with your DNS records.

## Azure DNS features

### Are there any restrictions when using alias records for a domain name apex with Traffic Manager?

Yes. You must use static public IP addresses with Azure Traffic Manager. Configure the **External endpoint** target by using a static IP address. 

### Does Azure DNS support DNS-based traffic routing or endpoint failover?

DNS-based traffic routing and endpoint failover are provided by Traffic Manager. Traffic Manager is a separate Azure service that can be used with Azure DNS. For more information, see the [Traffic Manager overview](../traffic-manager/traffic-manager-overview.md).

Azure DNS only supports hosting static DNS domains, where each DNS query for a given DNS record always receives the same DNS response.

### Does Azure DNS support domain name registration?

No. Azure DNS doesn't currently support the option to buy domain names. To buy domains, you must use a third-party domain name registrar. The registrar typically charges a small annual fee. The domains then can be hosted in Azure DNS for management of DNS records. For more information, see [Delegate a domain to Azure DNS](dns-domain-delegation.md).

The feature to buy domain names is tracked in the Azure backlog. Use the feedback site to [register your support for this feature](https://feedback.azure.com/forums/217313-networking/suggestions/4996615-azure-should-be-its-own-domain-registrar).

### Does Azure DNS support DNSSEC?

No. Azure DNS doesn't currently support the Domain Name System Security Extensions (DNSSEC).

The DNSSEC feature is tracked in the Azure DNS backlog. Use the feedback site to [register your support for this feature](https://feedback.azure.com/forums/217313-networking/suggestions/13284393-azure-dns-needs-dnssec-support).

### Does Azure DNS support zone transfers (AXFR/IXFR)?

No. Azure DNS doesn't currently support zone transfers. DNS zones can be [imported into Azure DNS by using the Azure CLI](dns-import-export.md). DNS records are managed via the [Azure DNS management portal](dns-operations-recordsets-portal.md), [REST API](https://docs.microsoft.com/powershell/module/az.dns), [SDK](dns-sdk.md), [PowerShell cmdlets](dns-operations-recordsets.md), or the [CLI tool](dns-operations-recordsets-cli.md).

The zone transfer feature is tracked in the Azure DNS backlog. Use the feedback site to [register your support for this feature](https://feedback.azure.com/forums/217313-networking/suggestions/12925503-extend-azure-dns-to-support-zone-transfers-so-it-c).

### Does Azure DNS support URL redirects?

No. URL redirect services aren't a DNS service. They work at the HTTP level rather than the DNS level. Some DNS providers bundle a URL redirect service as part of their overall offering. This service isn't currently supported by Azure DNS.

The URL redirect feature is tracked in the Azure DNS backlog. Use the feedback site to [register your support for this feature](https://feedback.azure.com/forums/217313-networking/suggestions/10109736-provide-a-301-permanent-redirect-service-for-ape).

### Does Azure DNS support the extended ASCII encoding (8-bit) set for TXT record sets?

Yes. Azure DNS supports the extended ASCII encoding set for TXT record sets. But you must use the latest version of the Azure REST APIs, SDKs, PowerShell, and the CLI. Versions older than October 1, 2017, or SDK 2.1 don't support the extended ASCII set. 

For example, you might provide a string as the value for a TXT record that has the extended ASCII character \128. An example is "abcd\128efgh." Azure DNS uses the byte value of this character, which is 128, in internal representation. At the time of DNS resolution, this byte value is returned in the response. Also note that "abc" and "\097\098\099" are interchangeable as far as resolution is concerned. 

We follow [RFC 1035](https://www.ietf.org/rfc/rfc1035.txt) zone file master format escape rules for TXT records. For example, `\` now actually escapes everything per the RFC. If you specify `A\B` as the TXT record value, it's represented and resolved as just `AB`. If you really want the TXT record to have `A\B` at resolution, you need to escape the `\` again. As an example, specify `A\\B`.

This support currently isn't available for TXT records created from the Azure portal.

## Alias records

### What are some scenarios where alias records are useful?

See the scenarios section in the [Azure DNS alias records overview](dns-alias.md).

### What record types are supported for alias record sets?

Alias record sets are supported for the following record types in an Azure DNS zone:
 
- A 
- AAAA
- CNAME 

### What resources are supported as targets for alias record sets?

- **Point to a public IP resource from a DNS A/AAAA record set.** You can create an A/AAAA record set and make it an alias record set to point to a public IP resource.
- **Point to a Traffic Manager profile from a DNS A/AAAA/CNAME record set.** You can point to the CNAME of a Traffic Manager profile from a DNS CNAME record set. An example is contoso.trafficmanager.net. Now, you also can point to a Traffic Manager profile that has external endpoints from an A or AAAA record set in your DNS zone.
- **Point to an Azure Content Delivery Network (CDN) endpoint**. This is useful when you create static websites using Azure storage and Azure CDN.
- **Point to another DNS record set within the same zone.** Alias records can reference to other record sets of the same type. For example, you can have a DNS CNAME record set be an alias to another CNAME record set of the same type. This arrangement is useful if you want some record sets to be aliases and some non-aliases.

### Can I create and update alias records from the Azure portal?

Yes. You can create or manage alias records in the Azure portal along with the Azure REST APIs, PowerShell, the CLI, and SDKs.

### Will alias records help to make sure my DNS record set is deleted when the underlying public IP is deleted?

Yes. This feature is one of the core capabilities of alias records. It helps you avoid potential outages for users of your application.

### Will alias records help to make sure my DNS record set is updated to the correct IP address when the underlying public IP address changes?

Yes. This feature is one of the core capabilities of alias records. It helps you avoid potential outages or security risks for your application.

### Are there any restrictions when using alias record sets for A or AAAA records to point to Traffic Manager?

Yes. To point to a Traffic Manager profile as an alias from an A or AAAA record set, the Traffic Manager profile must use only external endpoints. When you create the external endpoints in Traffic Manager, provide the actual IP addresses of the endpoints.

### Is there an additional charge to use alias records?

Alias records are a qualification on a valid DNS record set. There's no additional billing for alias records.

## Use Azure DNS

### Can I co-host a domain by using Azure DNS and another DNS provider?

Yes. Azure DNS supports co-hosting domains with other DNS services.

To set up co-hosting, modify the NS records for the domain to point to the name servers of both providers. The name server (NS) records control which providers receive DNS queries for the domain. You can modify these NS records in Azure DNS, in the other provider, and in the parent zone. The parent zone is typically configured via the domain name registrar. For more information on DNS delegation, see [DNS domain delegation](dns-domain-delegation.md).

Also, make sure that the DNS records for the domain are in sync between both DNS providers. Azure DNS doesn't currently support DNS zone transfers. DNS records must be synchronized by using either the [Azure DNS management portal](dns-operations-recordsets-portal.md), [REST API](https://docs.microsoft.com/powershell/module/az.dns), [SDK](dns-sdk.md), [PowerShell cmdlets](dns-operations-recordsets.md), or the [CLI tool](dns-operations-recordsets-cli.md).

### Do I have to delegate my domain to all four Azure DNS name servers?

Yes. Azure DNS assigns four name servers to each DNS zone. This arrangement is for fault isolation and increased resilience. To qualify for the Azure DNS SLA, delegate your domain to all four name servers.

### What are the usage limits for Azure DNS?

The following default limits apply when you use Azure DNS.

[!INCLUDE [dns-limits](../../includes/dns-limits.md)]

### Can I move an Azure DNS zone between resource groups or between subscriptions?

Yes. DNS zones can be moved between resource groups or between subscriptions.

There's no effect on DNS queries when you move a DNS zone. The name servers assigned to the zone stay the same. DNS queries are processed as normal throughout.

For more information and instructions on how to move DNS zones, see [Move resources to a new resource group or subscription](../azure-resource-manager/resource-group-move-resources.md).

### How long does it take for DNS changes to take effect?

New DNS zones and DNS records typically appear in the Azure DNS name servers quickly. The timing is a few seconds.

Changes to existing DNS records can take a little longer. They typically appear in the Azure DNS name servers within 60 seconds. DNS caching by DNS clients and DNS recursive resolvers outside of Azure DNS also can affect timing. To control this cache duration, use the Time-To-Live (TTL) property of each record set.

### How can I protect my DNS zones against accidental deletion?

Azure DNS is managed by using Azure Resource Manager. Azure DNS benefits from the access control features that Azure Resource Manager provides. Role-based access control controls which users have read or write access to DNS zones and record sets. Resource locks prevent accidental modification or deletion of DNS zones and record sets.

For more information, see [Protect DNS zones and records](dns-protect-zones-recordsets.md).

### How do I set up SPF records in Azure DNS?

[!INCLUDE [dns-spf-include](../../includes/dns-spf-include.md)]

### Do Azure DNS name servers resolve over IPv6? 

Yes. Azure DNS name servers are dual stack. Dual stack means they have IPv4 and IPv6 addresses. To find the IPv6 address for the Azure DNS name servers assigned to your DNS zone, use a tool such as nslookup. An example is `nslookup -q=aaaa <Azure DNS Nameserver>`.

### How do I set up an IDN in Azure DNS?

Internationalized domain names (IDNs) encode each DNS name by using [punycode](https://en.wikipedia.org/wiki/Punycode). DNS queries are made by using these punycode-encoded names.

To configure IDNs in Azure DNS, convert the zone name or record set name to punycode. Azure DNS doesn't currently support built-in conversion to or from punycode.

## Next steps

- [Learn more about Azure DNS](dns-overview.md).

- [Learn more about how to use Azure DNS for private domains](private-dns-overview.md).

- [Learn more about DNS zones and records](dns-zones-records.md).

- [Get started with Azure DNS](dns-getstarted-portal.md).
