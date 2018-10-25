---
title: Azure DNS FAQ | Microsoft Docs
description: Frequently asked questions about Azure DNS
services: dns
documentationcenter: na
author: vhorne
manager: jeconnoc
editor: ''

ms.service: dns
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 9/25/2018
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

Azure guarantees that valid DNS requests receive a response from at least one Azure DNS name server at least 99.99% of the time.

For more information, see the [Azure DNS SLA page](https://azure.microsoft.com/support/legal/sla/dns).

### What is a DNS zone? Is it the same as a DNS domain? 

A domain is a unique name in the domain name system. An example is contoso.com.

A DNS zone is used to host the DNS records for a particular domain. For example, the domain contoso.com might contain several DNS records. The records might include mail.contoso.com for a mail server and www.contoso.com for a website. These records are hosted in the DNS zone contoso.com.

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

No. Azure DNS doesn't currently support zone transfers. DNS zones can be [imported into Azure DNS by using the Azure CLI](dns-import-export.md). DNS records are managed via the [Azure DNS management portal](dns-operations-recordsets-portal.md), [REST API](https://docs.microsoft.com/powershell/module/azurerm.dns), [SDK](dns-sdk.md), [PowerShell cmdlets](dns-operations-recordsets.md), or the [CLI tool](dns-operations-recordsets-cli.md).

The zone transfer feature is tracked in the Azure DNS backlog. Use the feedback site to [register your support for this feature](https://feedback.azure.com/forums/217313-networking/suggestions/12925503-extend-azure-dns-to-support-zone-transfers-so-it-c).

### Does Azure DNS support URL redirects?

No. URL redirect services aren't a DNS service. They work at the HTTP level rather than the DNS level. Some DNS providers bundle a URL redirect service as part of their overall offering. This service isn't currently supported by Azure DNS.

The URL redirect feature is tracked in the Azure DNS backlog. Use the feedback site to [register your support for this feature](https://feedback.azure.com/forums/217313-networking/suggestions/10109736-provide-a-301-permanent-redirect-service-for-ape).

### Does Azure DNS support the extended ASCII encoding (8-bit) set for TXT record sets?

Yes. Azure DNS supports the extended ASCII encoding set for TXT record sets. But you must use the latest version of the Azure REST APIs, SDKs, PowerShell, and the CLI. Versions older than October 1, 2017, or SDK 2.1 don't support the extended ASCII set. 

For example, a user might provide a string as the value for a TXT record that has the extended ASCII character \128. An example is "abcd\128efgh." Azure DNS uses the byte value of this character, which is 128, in internal representation. At the time of DNS resolution, this byte value is returned in the response. Also note that "abc" and "\097\098\099" are interchangeable as far as resolution is concerned. 

We follow [RFC 1035](https://www.ietf.org/rfc/rfc1035.txt) zone file master format escape rules for TXT records. For example, "\" now actually escapes everything per the RFC. If you specify "A\B" as the TXT record value, it's represented and resolved as just "AB." If you really want the TXT record to have "A\B" at resolution, you need to escape the "\" again. As an example, specify "A\\B". 

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

### Can I cohost a domain by using Azure DNS and another DNS provider?

Yes. Azure DNS supports cohosting domains with other DNS services.

To set up cohosting, modify the NS records for the domain to point to the name servers of both providers. The name server (NS) records control which providers receive DNS queries for the domain. You can modify these NS records in Azure DNS, in the other provider, and in the parent zone. The parent zone is typically configured via the domain name registrar. For more information on DNS delegation, see [DNS domain delegation](dns-domain-delegation.md).

Also, make sure that the DNS records for the domain are in sync between both DNS providers. Azure DNS doesn't currently support DNS zone transfers. DNS records must be synchronized by using either the [Azure DNS management portal](dns-operations-recordsets-portal.md), [REST API](https://docs.microsoft.com/powershell/module/azurerm.dns), [SDK](dns-sdk.md), [PowerShell cmdlets](dns-operations-recordsets.md), or the [CLI tool](dns-operations-recordsets-cli.md).

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

## Private DNS

[!INCLUDE [private-dns-public-preview-notice](../../includes/private-dns-public-preview-notice.md)]

### Does Azure DNS support private domains?
Support for private domains is implemented by using the Private Zones feature. This feature is currently available in public preview. Private zones are managed by using the same tools as internet-facing Azure DNS zones. They're resolvable only from within your specified virtual networks. For more information, see the [overview](private-dns-overview.md).

At this time, private zones aren't supported on the Azure portal. 

For information on other internal DNS options in Azure, see [Name resolution for VMs and role instances](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md).

### What's the difference between Registration virtual network and Resolution virtual network in the context of private zones? 
You can link virtual networks to a DNS private zone as a Registration virtual network or as a Resolution virtual network. In either case, virtual machines in the virtual network successfully resolve against records in the private zone. With a Registration virtual network, DNS records are automatically registered into the zone for the virtual machines in the virtual network. When a virtual machine in a Registration virtual network is deleted, the corresponding DNS record from the linked private zone is automatically removed. 

### Will Azure DNS Private Zones work across Azure regions?
Yes. Private Zones is supported for DNS resolution between virtual networks across Azure regions. Private Zones works even without explicitly peering the virtual networks. All the virtual networks must be specified as Resolution virtual networks for the private zone. Customers might need the virtual networks to be peered for TCP/HTTP traffic to flow from one region to another.

### Is connectivity to the Internet from virtual networks required for private zones?
No. Private zones work along with virtual networks. Customers use them to manage domains for virtual machines or other resources within and across virtual networks. Internet connectivity isn't required for name resolution. 

### Can the same private zone be used for several virtual networks for resolution? 
Yes. Customers can associate up to 10 Resolution virtual networks with a single private zone.

### Can a virtual network that belongs to a different subscription be added as a Resolution virtual network to a private zone? 
Yes. The user must have write operation permission on the virtual networks and the private DNS zone. The write permission can be granted to several RBAC roles. For example, the Classic Network Contributor RBAC role has write permissions to virtual networks. For more information on RBAC roles, see [Role-based access control](../role-based-access-control/overview.md).

### Will the automatically registered virtual machine DNS records in a private zone be automatically deleted when the virtual machines are deleted by the customer?
Yes. If you delete a virtual machine within a Registration virtual network, the DNS records that were registered into the zone are automatically deleted. 

### Can an automatically registered virtual machine record in a private zone from a Registration virtual network be deleted manually? 
No. The virtual machine DNS records that are automatically registered in a private zone from a Registration virtual network aren't visible or editable by customers. You can overwrite the automatically registered DNS records with a manually created DNS record in the zone. The following question and answer address this topic.

### What happens when we try to manually create a new DNS record into a private zone that has the same hostname as an automatically registered existing virtual machine in a Registration virtual network? 
You try to manually create a new DNS record into a private zone that has the same hostname as an existing, automatically registered virtual machine in a Registration virtual network. When you do, the new DNS record overwrites the automatically registered virtual machine record. If you try to delete this manually created DNS record from the zone again, the delete succeeds. The automatic registration happens again as long as the virtual machine still exists and has a private IP attached to it. The DNS record is re-created automatically in the zone.

### What happens when we unlink a Registration virtual network from a private zone? Will the automatically registered virtual machine records from the virtual network be removed from the zone too?
Yes. To unlink a Registration virtual network from a private zone, you update the DNS zone to remove the associated Registration virtual network. In this process, virtual machine records that were automatically registered are removed from the zone. 

### What happens when we delete a Registration or Resolution virtual network that's linked to a private zone? Do we have to manually update the private zone to unlink the virtual network as a Registration or Resolution  virtual network from the zone?
Yes. When you delete a Registration or Resolution virtual network without unlinking it from a private zone first, your deletion operation succeeds. But the virtual network isn't automatically unlinked from your private zone, if any. You must manually unlink the virtual network from the private zone. For this reason,  unlink your virtual network from your private zone before you delete it.

### Will DNS resolution by using the default FQDN (internal.cloudapp.net) still work even when a private zone (for example, contoso.local) is linked to a virtual network? 
Yes. Private Zones doesn't replace the default DNS resolutions by using the Azure-provided internal.cloudapp.net zone. It's offered as an additional feature or enhancement. Whether you rely on the Azure-provided internal.cloudapp.net or on your own private zone, use the FQDN of the zone you want to resolve against. 

### Will the DNS suffix on virtual machines within a linked virtual network be changed to that of the private zone? 
No. The DNS suffix on the virtual machines in your linked virtual network stays as the default Azure-provided suffix ("*.internal.cloudapp.net"). You can manually change this DNS suffix on your virtual machines to that of the private zone. 

### Are there any limitations for private zones during this preview?
Yes. During the public preview, the following limitations exist.
* One Registration virtual network per private zone.
* Up to 10 Resolution virtual networks per private zone.
* A given virtual network links to only one private zone as a Registration virtual network.
* A given virtual network links to up to 10 private zones as a Resolution virtual network.
* If a Registration virtual network is specified, the DNS records for the VMs from that virtual network that are registered to the private zone can't be viewed or retrieved from PowerShell, the CLI, or APIs. The VM records are registered and resolve successfully.
* Reverse DNS works only for private IP space in the Registration virtual network.
* Reverse DNS for a private IP that's not registered in the private zone returns "internal.cloudapp.net" as the DNS suffix. This suffix can't be resolved. An example is a private IP for a virtual machine in a virtual network that's linked as a Resolution virtual network to a private zone.
* A virtual network can't have any virtual machines with a NIC attached when it links for the first time to a private zone as a Registration or Resolution virtual network. In other words, the virtual network must be empty. The virtual network then can be non-empty for future linking as a Registration or Resolution virtual network to other private zones. 
* Conditional forwarding isn't supported, for example, to enable resolution between Azure and on-premises networks. Learn how customers can realize this scenario via other mechanisms. See [Name resolution for VMs and role instances](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md)

### Are there any quotas or limits on zones or records for private zones?
There are no limits on the number of zones allowed per subscription for private zones. There are no limits on the number of record sets per zone for private zones. Both public and private zones count toward the overall DNS limits. For more information, see the [Azure subscription and service limits](../azure-subscription-service-limits.md#dns-limits)

### Is there portal support for private zones?
Private zones that are already created via APIs, PowerShell, the CLI, and SDKs are visible on the Azure portal. But customers can't create new private zones or manage associations with virtual networks. For virtual networks associated as Registration virtual networks, automatically registered VM records aren't visible from the portal. 

## Next steps

- [Learn more about Azure DNS](dns-overview.md).
<br>
- [Learn more about how to use Azure DNS for private domains](private-dns-overview.md).
<br>
- [Learn more about DNS zones and records](dns-zones-records.md).
<br>
- [Get started with Azure DNS](dns-getstarted-portal.md).

