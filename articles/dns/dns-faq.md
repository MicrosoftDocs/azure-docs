---
title: Azure DNS FAQ | Microsoft Docs
description: Frequently Asked Questions about Azure DNS
services: dns
documentationcenter: na
author: jtuliani
manager: timlt
editor: ''

ms.service: dns
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/21/2017
ms.author: jonatul
---

# Azure DNS FAQ

## About Azure DNS

### What is Azure DNS?

The Domain Name System, or DNS, is responsible for translating (or resolving) a website or service name to its IP address. Azure DNS is a hosting service for DNS domains, providing name resolution using Microsoft Azure infrastructure. By hosting your domains in Azure, you can manage your DNS records using the same credentials, APIs, tools, and billing as your other Azure services.

DNS domains in Azure DNS are hosted on Azure's global network of DNS name servers. We use Anycast networking so that each DNS query is answered by the closest available DNS server. This provides both fast performance and high availability for your domain.

The Azure DNS service is based on Azure Resource Manager. As such, it benefits from Resource Manager features such as role-based access control, audit logs, and resource locking. Your domains and records can be managed via the Azure portal, Azure PowerShell cmdlets, and the cross-platform Azure CLI. Applications requiring automatic DNS management can integrate with the service via the REST API and SDKs.

### How much does Azure DNS cost?

The Azure DNS billing model is based on the number of DNS zones hosted in Azure DNS and the number of DNS queries they receive. Discounts are provided based on usage.

For more information, see the [Azure DNS pricing page](https://azure.microsoft.com/pricing/details/dns/).

### What is the SLA for Azure DNS?

We guarantee that valid DNS requests will receive a response from at least one Azure DNS name server at least 99.99% of the time.

For more information, see the [Azure DNS SLA page](https://azure.microsoft.com/support/legal/sla/dns).

### What is a ‘DNS zone’? Is it the same as a DNS domain? 

A domain is a unique name in the domain name system, for example ‘contoso.com’.

A DNS zone is used to host the DNS records for a particular domain. For example, the domain ‘contoso.com’ may contain several DNS records, such as ‘mail.contoso.com’ (for a mail server) and ‘www.contoso.com’ (for a web site). These would be hosted in the DNS zone 'contoso.com'.

A domain name is *just a name*, whereas a DNS zone is a data resource containing the DNS records for a domain name. Azure DNS allows you to host a DNS zone and manage the DNS records for a domain in Azure. It also provides DNS name servers to answer DNS queries from the Internet.

### Do I need to purchase a DNS domain name to use Azure DNS? 

Not necessarily.

You do not need to purchase a domain to host a DNS zone in Azure DNS. You can create a DNS zone at any time without owning the domain name. DNS queries for this zone will only resolve if they are directed to the Azure DNS name servers assigned to the zone.

You need to purchase the domain name if you want to link your DNS zone into the global DNS hierarchy – this enables DNS queries from anywhere in the world to find your DNS zone and be answered with your DNS records.

## Azure DNS Features

### Does Azure DNS support DNS-based traffic routing or endpoint failover?

DNS-based traffic routing and endpoint failover are provided by Azure Traffic Manager. This is a separate Azure service that can be used together with Azure DNS. For more information, see the [Traffic Manager overview](../traffic-manager/traffic-manager-overview.md).

Azure DNS only supports hosting 'static' DNS domains, where each DNS query for a given DNS record always receives the same DNS response.

### Does Azure DNS support domain name registration?

No. Azure DNS does not currently support purchasing of domain names. If you want to purchase domains, you need to use a third-party domain name registrar. The registrar typically charges a small annual fee. The domains can then be hosted in Azure DNS for management of DNS records. See [Delegate a Domain to Azure DNS](dns-domain-delegation.md) for details.

This is a feature we are tracking on our backlog. You can use our feedback site to [register your support for this feature](https://feedback.azure.com/forums/217313-networking/suggestions/4996615-azure-should-be-its-own-domain-registrar).

### Does Azure DNS support 'private' domains?

No. Azure DNS currently only supports Internet-facing domains.

This is a feature we are tracking on our backlog. You can use our feedback site to [register your support for this feature](https://feedback.azure.com/forums/217313-networking/suggestions/10737696-enable-split-dns-for-providing-both-public-and-int).

For information on internal DNS options in Azure, see [Name Resolution for VMs and Role Instances](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md).

### Does Azure DNS support DNSSEC?

No. Azure DNS does not currently support DNSSEC.

This is a feature we are tracking on our backlog. You can use our feedback site to [register your support for this feature](https://feedback.azure.com/forums/217313-networking/suggestions/13284393-azure-dns-needs-dnssec-support).

### Does Azure DNS support zone transfers (AXFR/IXFR)?

No. Azure DNS does not currently support zone transfers. DNS zones can be [imported into Azure DNS using the Azure CLI](dns-import-export.md). DNS records can then be managed via the [Azure DNS management portal](dns-operations-recordsets-portal.md), our [REST API](https://docs.microsoft.com/powershell/module/azurerm.dns), [SDK](dns-sdk.md), [PowerShell cmdlets](dns-operations-recordsets.md), or [CLI tool](dns-operations-recordsets-cli.md).

This is a feature we are tracking on our backlog. You can use our feedback site to [register your support for this feature](https://feedback.azure.com/forums/217313-networking/suggestions/12925503-extend-azure-dns-to-support-zone-transfers-so-it-c).

### Does Azure DNS support URL redirects?

No. URL redirect services are not actually a DNS service - they work at the HTTP level, rather than the DNS level. Some DNS providers to bundle a URL redirect service as part of their overall offering. This is not currently supported by Azure DNS.

This feature is tracked on our backlog. You can use our feedback site to [register your support for this feature](https://feedback.azure.com/forums/217313-networking/suggestions/10109736-provide-a-301-permanent-redirect-service-for-ape).

## Using Azure DNS

### Can I co-host a domain using Azure DNS and another DNS provider?

Yes. Azure DNS supports co-hosting domains with other DNS services.

To do so, you need to modify the NS records for the domain (which control which providers receive DNS queries for the domain) to point to the name servers of both providers. These NS records need to be modified in 3 places: in Azure DNS, in the other provider, and in the parent zone (typically configured via the domain name registrar). For more information on DNS delegation, see [DNS domain delegation](dns-domain-delegation.md).

In addition, you need to ensure that the DNS records for the domain are in sync between both DNS providers. Azure DNS does not currently support DNS zone transfers. You need to synchronize DNS records using either the [Azure DNS management portal](dns-operations-recordsets-portal.md), our [REST API](https://docs.microsoft.com/powershell/module/azurerm.dns), [SDK](dns-sdk.md), [PowerShell cmdlets](dns-operations-recordsets.md), or [CLI tool](dns-operations-recordsets-cli.md).

### Do I have to delegate my domain to all 4 Azure DNS name servers?

Yes. Azure DNS assigns 4 name servers to each DNS zone, for fault isolation and increased resilience. To qualify for the Azure DNS SLA, you need to delegate your domain to all 4 name servers.

### What are the usage limits for Azure DNS?

The following default limits apply when using Azure DNS:

[!INCLUDE [dns-limits](../../includes/dns-limits.md)]

### Can I move an Azure DNS zone between resource groups or between subscriptions?

Yes. DNS zones can be moved between resource groups, or between subscriptions.

There is no impact on DNS queries when moving a DNS zone. The name servers assigned to the zone remain the same, and DNS queries are processed as normal throughout.

For more information and instructions on how to move DNS zones, see [Move resources to a new resource group or subscription](../azure-resource-manager/resource-group-move-resources.md).

### How long does it take for DNS changes to take effect?

New DNS zones and DNS records are typically reflected on the Azure DNS name servers quickly, within a few seconds.

Changes to existing DNS records can take a little longer, but should still be reflected on the Azure DNS name servers within 60 seconds. In this case, DNS caching outside of Azure DNS (by DNS clients and DNS recursive resolvers) can also impact the time taken for a DNS change to be effective. This cache duration can be controlled using the Time-To-Live (TTL) property of each record set.

### How can I protect my DNS zones against accidental deletion?

Azure DNS is managed using Azure Resource Manager, and benefits from the access control features that Azure Resource Manager provides. Role-based access control can be used to control which users have read or write access to DNS zones and record sets. Resource locks can be applied to prevent accidental modification or deletion of DNS zones and record sets.

For more information, see [Protecting DNS Zones and Records](dns-protect-zones-recordsets.md).

### How do I set up SPF records in Azure DNS?

[!INCLUDE [dns-spf-include](../../includes/dns-spf-include.md)]

### How do I set up an International Domain Name (IDN) in Azure DNS?

International Domain Names (IDNs) work by encoding each DNS name using '[punycode](https://en.wikipedia.org/wiki/Punycode)'. DNS queries are made using these punycode-encoded names.

You can configure International Domain Names (IDNs) in Azure DNS by first converting the zone name or record set name to punycode. Azure DNS does not currently support built-in conversion to/from punycode.

## Next steps

[Learn more about Azure DNS](dns-overview.md)
<br>
[Learn more about DNS zones and records](dns-zones-records.md)
<br>
[Get started with Azure DNS](dns-getstarted-portal.md)

