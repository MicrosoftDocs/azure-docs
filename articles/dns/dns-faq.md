---
title: Azure DNS FAQ | Microsoft Docs
description: Frequently Asked Questions about Azure DNS
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

The Domain Name System, or DNS, is responsible for translating (or resolving) a website or service name to its IP address. Azure DNS is a hosting service for DNS domains, providing name resolution using Microsoft Azure infrastructure. By hosting your domains in Azure, you can manage your DNS records using the same credentials, APIs, tools, and billing as your other Azure services.

DNS domains in Azure DNS are hosted on Azure's global network of DNS name servers. This uses Anycast networking so that each DNS query is answered by the closest available DNS server. Azure DNS provides both fast performance and high availability for your domain.

The Azure DNS service is based on Azure Resource Manager. As such, it benefits from Resource Manager features such as role-based access control, audit logs, and resource locking. Your domains and records can be managed via the Azure portal, Azure PowerShell cmdlets, and the cross-platform Azure CLI. Applications requiring automatic DNS management can integrate with the service via the REST API and SDKs.

### How much does Azure DNS cost?

The Azure DNS billing model is based on the number of DNS zones hosted in Azure DNS and the number of DNS queries they receive. Discounts are provided based on usage.

For more information, see the [Azure DNS pricing page](https://azure.microsoft.com/pricing/details/dns/).

### What is the SLA for Azure DNS?

Azure guarantees that valid DNS requests will receive a response from at least one Azure DNS name server at least 99.99% of the time.

For more information, see the [Azure DNS SLA page](https://azure.microsoft.com/support/legal/sla/dns).

### What is a ‘DNS zone’? Is it the same as a DNS domain? 

A domain is a unique name in the domain name system, for example ‘contoso.com’.


A DNS zone is used to host the DNS records for a particular domain. For example, the domain ‘contoso.com’ may contain several DNS records, such as ‘mail.contoso.com’ (for a mail server) and ‘www.contoso.com’ (for a web site). These records would be hosted in the DNS zone 'contoso.com'.

A domain name is *just a name*, whereas a DNS zone is a data resource containing the DNS records for a domain name. Azure DNS allows you to host a DNS zone and manage the DNS records for a domain in Azure. It also provides DNS name servers to answer DNS queries from the Internet.

### Do I need to purchase a DNS domain name to use Azure DNS? 

Not necessarily.

You do not need to purchase a domain to host a DNS zone in Azure DNS. You can create a DNS zone at any time without owning the domain name. DNS queries for this zone will only resolve if they are directed to the Azure DNS name servers assigned to the zone.

You need to purchase the domain name if you want to link your DNS zone into the global DNS hierarchy – this linking enables DNS queries from anywhere in the world to find your DNS zone and be answered with your DNS records.

## Azure DNS Features

### Are there any restrictions when using alias records for a domain name apex with Traffic Manager?

Yes. You must use static public IP addresses with Traffic Manager. Configure the **External endpoint** target using a static IP address. 

### Does Azure DNS support DNS-based traffic routing or endpoint failover?

DNS-based traffic routing and endpoint failover are provided by Azure Traffic Manager. Azure Traffic Manager is a separate Azure service that can be used together with Azure DNS. For more information, see the [Traffic Manager overview](../traffic-manager/traffic-manager-overview.md).

Azure DNS only supports hosting 'static' DNS domains, where each DNS query for a given DNS record always receives the same DNS response.

### Does Azure DNS support domain name registration?

No. Azure DNS does not currently support purchasing of domain names. If you want to purchase domains, you need to use a third-party domain name registrar. The registrar typically charges a small annual fee. The domains can then be hosted in Azure DNS for management of DNS records. See [Delegate a Domain to Azure DNS](dns-domain-delegation.md) for details.

Domain Purchase is a feature being tracked in Azure backlog. You can use the feedback site to [register your support for this feature](https://feedback.azure.com/forums/217313-networking/suggestions/4996615-azure-should-be-its-own-domain-registrar).

### Does Azure DNS support DNSSEC?

No. Azure DNS does not currently support DNSSEC.

DNSSEC is a feature being tracked on Azure DNS backlog. You can use the feedback site to [register your support for this feature](https://feedback.azure.com/forums/217313-networking/suggestions/13284393-azure-dns-needs-dnssec-support).

### Does Azure DNS support zone transfers (AXFR/IXFR)?

No. Azure DNS does not currently support zone transfers. DNS zones can be [imported into Azure DNS using the Azure CLI](dns-import-export.md). DNS records can then be managed via the [Azure DNS management portal](dns-operations-recordsets-portal.md), our [REST API](https://docs.microsoft.com/powershell/module/azurerm.dns), [SDK](dns-sdk.md), [PowerShell cmdlets](dns-operations-recordsets.md), or [CLI tool](dns-operations-recordsets-cli.md).

Zone Transfer is a feature being tracked on Azure DNS backlog. You can use the feedback site to [register your support for this feature](https://feedback.azure.com/forums/217313-networking/suggestions/12925503-extend-azure-dns-to-support-zone-transfers-so-it-c).

### Does Azure DNS support URL redirects?

No. URL redirect services are not actually a DNS service - they work at the HTTP level, rather than the DNS level. Some DNS providers to bundle a URL redirect service as part of their overall offering. This is not currently supported by Azure DNS.

URL Redirect feature is tracked on Azure DNS backlog. You can use the feedback site to [register your support for this feature](https://feedback.azure.com/forums/217313-networking/suggestions/10109736-provide-a-301-permanent-redirect-service-for-ape).

### Does Azure DNS support extended ASCII encoding (8-bit) set for TXT Recordset?

Yes. Azure DNS supports the extended ASCII encoding set for TXT Recordsets, if you use the latest version of the Azure REST APIs, SDKs, PowerShell, and CLI (versions older than 2017-10-01 or SDK 2.1 do not support the extended ASCII set). For example, if the user provides a string as the value for a TXT record that has the extended ASCII character \128 (for example: "abcd\128efgh"), Azure DNS will use the byte value of this character (which is 128) in internal representation. At the time of DNS resolution as well this byte value will be returned in the response. Also note that "abc" and "\097\098\099" are interchangeable as far as resolution is concerned. 

We follow [RFC 1035](https://www.ietf.org/rfc/rfc1035.txt) zone file master format escape rules for TXT records. For example, ‘\’ now actually escapes everything per the RFC. If you specify "A\B" as the TXT record value, it will be represented and resolve as just "AB". If you really want the TXT record to have "A\B" at resolution, you need to escape the "\" again, i.e specify as "A\\B". 

This support is currently not available for TXT records created from the Azure portal. 

## Alias records

### What are some scenarios where alias records are useful?
See the scenarios section in [Azure DNS alias records overview](dns-alias.md).

### What record types are supported for alias record sets?
Alias records sets are supported for the following record types in an Azure DNS zone: A, AAAA, and CNAME. 

### What resources are supported as targets for alias record sets?
- **Point to a Public IP resource from a DNS A/AAAA record set**. You can create an A/AAAA record set, and make it an alias record set to point to a Public IP resource.
- **Point to a Traffic Manager profile from a DNS A/AAAA/CNAME record set**. In addition to the ability to point to the CNAME of a Traffic Manager profile (for example: contoso.trafficmanager.net) from a DNS CNAME recordset, you can now also point to a Traffic Manager profile that has external endpoints, from an A or AAAA recordset in your DNS zone.
- **Point to another DNS recordset within the same zone**. Alias records can reference to other record sets of the same type. For example, you can have a DNS CNAME record set be an alias to another CNAME recordset of the same type. This is useful if you want to have some record sets be aliases and some as non-aliases in terms of behavior.

### Can I create and update alias records from the Azure portal?
Yes. Alias records can be created or managed in the Azure portal in addition to the Azure REST APIs, Azure PowerShell, CLI, and SDKs.

### Will alias records help ensure my DNS record set is deleted when the underlying Public IP is deleted?
Yes. In fact, this is one of the core capabilities of alias records. They help you avoid potential outages for end users of your application.

### Will Alias records help ensure my DNS record set is updated to the correct IP address when the underlying Public IP address changes?
Yes. As in the previous question, this is one of the core capabilities of alias records, and helps you avoid potential outages or security risks for your application.

### Are there any restrictions when using alias record sets for an A or AAAA records to point to Traffic Manager?
Yes. If you want to point to a Traffic Manager profile as an alias from an A or AAAA record set, you must ensure the Traffic Manager profile only uses External Endpoints. When you create the external endpoints in Traffic Manager, ensure you provide the actual IP addresses of the endpoints.

### Is there an additional charge for using alias records?
Alias records are a qualification on a valid DNS recordset, and there is no additional billing for alias records.

## Using Azure DNS

### Can I co-host a domain using Azure DNS and another DNS provider?

Yes. Azure DNS supports co-hosting domains with other DNS services.

To do so, you need to modify the NS records for the domain (which control which providers receive DNS queries for the domain) to point to the name servers of both providers. You can modify these NS records in three places: in Azure DNS, in the other provider, and in the parent zone (typically configured via the domain name registrar). For more information on DNS delegation, see [DNS domain delegation](dns-domain-delegation.md).

In addition, you need to ensure that the DNS records for the domain are in sync between both DNS providers. Azure DNS does not currently support DNS zone transfers. DNS records need to be synchronized using either the [Azure DNS management portal](dns-operations-recordsets-portal.md), [REST API](https://docs.microsoft.com/powershell/module/azurerm.dns), [SDK](dns-sdk.md), [PowerShell cmdlets](dns-operations-recordsets.md), or [CLI tool](dns-operations-recordsets-cli.md).

### Do I have to delegate my domain to all four Azure DNS name servers?

Yes. Azure DNS assigns four name servers to each DNS zone, for fault isolation and increased resilience. To qualify for the Azure DNS SLA, you need to delegate your domain to all four name servers.

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

### Do Azure DNS Nameservers resolve over IPv6? 

Yes. Azure DNS Nameservers are dual-stack (have both IPv4 and IPv6 addresses). To find the IPv6 address for the Azure DNS nameservers assigned to your DNS zone, you can use a tool such as nslookup (for example, `nslookup -q=aaaa <Azure DNS Nameserver>`).

### How do I set up an International Domain Name (IDN) in Azure DNS?

International Domain Names (IDNs) work by encoding each DNS name using '[punycode](https://en.wikipedia.org/wiki/Punycode)'. DNS queries are made using these punycode-encoded names.

You can configure International Domain Names (IDNs) in Azure DNS by first converting the zone name or record set name to punycode. Azure DNS does not currently support built-in conversion to/from punycode.

## Private DNS

[!INCLUDE [private-dns-public-preview-notice](../../includes/private-dns-public-preview-notice.md)]

### Does Azure DNS support 'private' domains?
Support for 'private' domains  is implemented using Private Zones feature.  This feature is currently available in public preview.  Private zones are managed using the same tools as internet-facing Azure DNS zones but they are only resolvable from within your specified virtual networks.  See the [overview](private-dns-overview.md) for details.

At this time Private Zones are not supported on the Azure portal. 

For information on other internal DNS options in Azure, see [Name Resolution for VMs and Role Instances](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md).

### What is the difference between Registration virtual network and Resolution virtual network in the context of private zones? 
You can link virtual networks to a DNS private zone in two ways - as a Registration virtual network, or as a Resolution virtual network. In either case, virtual machines in the virtual network will be able to successfully resolve against records in the private zone. However, if you specify a virtual network as a Registration virtual network, Azure will automatically register (dynamic registration) DNS records into the zone for the virtual machines in the virtual network. Furthermore, when a virtual machine in a Registration virtual network gets deleted, Azure will also automatically remove the corresponding DNS record from the linked private zone. 

### Will Azure DNS Private Zones work across Azure regions?
Yes. Private Zones is supported for DNS resolution between virtual networks across Azure regions, even without explicitly peering the virtual networks, as long as the virtual networks are all specified as Resolution virtual networks for the private zone. Customers may need the virtual networks to be peered for TCP/HTTP traffic to flow from one region to another. 

### Is connectivity to the Internet from virtual networks required for Private Zones?
No. Private Zones work in conjunction with virtual networks and let customers manage domains for Virtual Machines or other resources within and across virtual networks. No internet connectivity is required for name resolution. 

### Can the same Private Zone be used for multiple virtual networks for resolution? 
Yes. Customers can associate up to 10 Resolution virtual networks with a single private zone.

### Can a virtual network that belongs to a different subscription be added as a resolution virtual network to a Private Zone? 
Yes, as long as the User has Write operation permission on both the virtual networks as well as the Private DNS zone. The Write permission may be allocated to multiple RBAC roles. For example, the Classic Network Contributor RBAC role has write permissions to virtual networks. For more information on RBAC roles, see [Role Based Access Control](../role-based-access-control/overview.md)

### Will the automatically registered virtual machine DNS records in a private zone be automatically deleted when the virtual machines are deleted by the customer?
Yes. If you delete a virtual machine within a Registration virtual network, we will automatically delete the DNS records that were registered into the zone due to this being a Registration virtual network. 

### Can an automatically registered virtual machine record in a private zone (from a Registration virtual network) be deleted manually? 
No. At this time, the virtual machine DNS records that are automatically registered in a private zone from a Registration virtual network are not visible or editable by customers. You can however, replace (overwrite) such automatically registered DNS records with a manually created DNS record in the zone. See the following question and answer that addresses this.

### What happens when we attempt to manually create a new DNS record into a private zone that has the same hostname as an (automatically registered) existing virtual machine in a Registration virtual network? 
If you attempt to manually create a new DNS record into a private zone that has the same hostname as an existing (automatically registered) virtual machine in a Registration virtual network, we will allow the new DNS record to overwrite the automatically registered virtual machine record. Furthermore, if you subsequently attempt to delete this manually created DNS record from the zone, the delete will succeed, and the automatic registration will happen again (the DNS record will be re-created automatically in the zone) so long as the virtual machine still exists and has a Private IP attached to it. 

### What happens when we unlink a Registration virtual network from a private zone? Would the automatically registered virtual machine records from the virtual network be removed from the zone as well?
Yes. If you unlink a Registration virtual network (update the DNS zone to remove the associated Registration virtual network) from a private zone, Azure will remove any automatically registered virtual machine records from the zone. 

### What happens when we delete a Registration (or Resolution) virtual network that is linked to a private zone? Do we have to manually update the private zone to unlink the virtual network as a Registration (or Resolution)  virtual network from the zone?
Yes. When you delete a Registration (or Resolution) virtual network without unlinking it from a private zone first, Azure will let your deletion operation to succeed, but the virtual network is not automatically unlinked from your private zone if any. You need to manually unlink the virtual network from the private zone. For this reason, it is advised to first unlink your virtual network from your private zone before deleting it.

### Would DNS resolution using the default FQDN (internal.cloudapp.net) still work even when a Private Zone (for example: contoso.local) is linked to a virtual network? 
Yes. Private Zones feature does not replace the default DNS resolutions using the Azure-provided internal.cloudapp.net zone, and is offered as an additional capability or enhancement. For both cases (whether relying on Azure-provided internal.cloudapp.net or on your own Private Zone), it is advised to use the FQDN of the zone you want to resolve against. 

### Would the DNS suffix on virtual machines within a linked virtual network be changed to that of the Private Zone? 
No. At this time, the DNS suffix on the virtual machines in your linked virtual network will remain as the default Azure-provided suffix ("*.internal.cloudapp.net"). You can however manually change this DNS suffix on your virtual machines to that of the private zone. 

### Are there any limitations for Private Zones during this preview?
Yes. During Public Preview, the following limitations exist:
* One Registration virtual networks per Private Zone
* Upto 10 Resolution virtual networks per Private Zone
* A given virtual network can only be linked to one Private Zone as a Registration virtual network
* A given virtual network can be linked to up to 10 Private Zones as a Resolution virtual network
* If a Registration virtual network is specified, the DNS records for the VMs from that virtual network that are registered to the Private Zone will not be viewable or retrievable from the Powershell/CLI/APIs, but the VM records are indeed registered and will resolve successfully
* Reverse DNS will only work for Private IP space in the Registration virtual network
* Reverse DNS for a Private IP that is not registered in the Private Zone (for example: Private IP for a virtual machine in a virtual network that is linked as a Resolution virtual network to a private zone) will return "internal.cloudapp.net" as the DNS suffix, however this suffix will not be resolvable.   
* Virtual network needs to be empty (i.e no virtual machines with a NIC attached) when initially (i.e for the first time) linking to a Private Zone as Registration or Resolution virtual network. However, the virtual network can then be non-empty for future linking as a Registration or Resolution virtual network, to other private zones. 
* At this time, conditional forwarding is not supported, for example for enabling resolution between Azure and OnPrem networks. For documentation on how customers can realize this scenario via other mechanisms, see [Name Resolution for VMs and Role Instances](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md)

### Are there any quotas or limits on Zones or Records for Private Zones?
There are no separate limits on number of Zones allowed per subscription, or number of record sets per Zone, for Private Zones. Both Public and Private Zones count toward the overall DNS limits as documented [here](../azure-subscription-service-limits.md#dns-limits)

### Is there Portal support for Private Zones?
Private Zones that are already created via non-Portal mechanisms (API/PowerShell/CLI/SDKs) will be visible on the Azure portal, but customers will not able to create new private zones or manage associations with virtual networks. In addition, for virtual networks associated as Registration virtual networks, the automatically registered VM records will not be visible from the Portal. 

## Next steps

[Learn more about Azure DNS](dns-overview.md)
<br>
[Learn more about using Azure DNS for private domains](private-dns-overview.md)
<br>
[Learn more about DNS zones and records](dns-zones-records.md)
<br>
[Get started with Azure DNS](dns-getstarted-portal.md)

