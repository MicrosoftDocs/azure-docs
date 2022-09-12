---
title: Azure DNS Private Resolver endpoints and rulesets
description: In this article, understand the Azure DNS Private Resolver endpoints and rulesets
services: dns
author: greg-lindsay
ms.service: dns
ms.topic: conceptual
ms.date: 09/09/2022
ms.author: greglin
#Customer intent: As an administrator, I want to understand components of the Azure DNS Private Resolver.
---

# Azure DNS Private Resolver endpoints and rulesets

In this article, you'll learn about components of the [Azure DNS Private Resolver](dns-private-resolver-overview.md). Inbound endpoints, outbound endpoints, and DNS forwarding rulesets are discussed. Properties and settings of these components are described, and examples are provided for how to use them. 

> [!IMPORTANT]
> Azure DNS Private Resolver is currently in [public preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). 

The architecture for Azure DNS Private Resolver is summarized in the following figure. In this example network, a DNS resolver is deployed in a hub vnet that peers with a spoke vnet. [Ruleset links](#ruleset-links) are provisioned in the [DNS forwarding ruleset](#dns-forwarding-rulesets) to both the hub and spoke vnets, enabling resources in both vnets to resolve custom DNS namespaces using DNS forwarding rules. A private DNS zone is also deployed and linked to the hub vnet, enabling resources in the hub vnet to resolve records in the zone. The spoke vnet resolves records in the private zone by using a DNS forwarding [rule](#rules) that forwards private zone queries to the inbound endpoint VIP in the hub vnet. 

[ ![Diagram that shows private resolver architecture](./media/private-resolver-endpoints-rulesets/ruleset.png) ](./media/private-resolver-endpoints-rulesets/ruleset-high.png#lightbox)

An ExpressRoute-connected on-premises network is also shown in the figure, with DNS servers configured to forward queries for the Azure private zone to the inbound endpoint VIP. For more information about enabling hybrid DNS resolution using the Azure DNS Private Resolver, see [Resolve Azure and on-premises domains](private-resolver-hybrid-dns.md).

## Inbound endpoints

As the name suggests, inbound endpoints will ingress to Azure. Inbound endpoints provide an IP address to forward DNS queries from on-premises and other locations outside your virtual network. DNS queries sent to the inbound endpoint are resolved using Azure DNS. Private DNS zones that are linked to the virtual network where the inbound endpoint is provisioned are resolved by the inbound endpoint. 

The IP address associated with an inbound endpoint is always part of the private virtual network address space where the private resolver is deployed.  No other resources can exist in the same subnet with the inbound endpoint. The following screenshot shows an inbound endpoint with a virtual IP address (VIP) of **10.10.0.4** inside the subnet `snet-E-inbound` provisioned within a virtual network with address space of 10.10.0.0/16.

![View inbound endpoints](./media/private-resolver-endpoints-rulesets/east-inbound-endpoint.png)

## Outbound endpoints

Outbound endpoints egress from Azure and can be linked to [DNS Forwarding Rulesets](#dns-forwarding-rulesets).

Outbound endpoints are also part of the private virtual network address space where the private resolver is deployed. An outbound endpoint is associated with a subnet, but isn't provisioned with an IP address like the inbound endpoint.  No other resources can exist in the same subnet with the outbound endpoint. The following screenshot shows an outbound endpoint inside the subnet `snet-E-outbound`.

![View outbound endpoints](./media/private-resolver-endpoints-rulesets/east-outbound-endpoint.png)

## DNS forwarding rulesets

DNS forwarding rulesets enable you to specify one or more custom DNS servers to answer queries for specific DNS namespaces. The individual [rules](#rules) in a ruleset determine how these DNS names are resolved. Rulesets can also be linked one or more virtual networks, enabling resources in the vnets to use the forwarding rules that you configure.

Rulesets have the following associations: 
- A single ruleset can be associated with multiple outbound endpoints. 
- A ruleset can have up to 1000 DNS forwarding rules. 
- A ruleset can be linked to any number of virtual networks in the same region

A ruleset can't be linked to a virtual network in another region. 

### Ruleset links

When you link a ruleset to a virtual network, resources within that virtual network will use the DNS forwarding rules enabled in the ruleset. The linked virtual network must peer with the virtual network where the outbound endpoint exists. This configuration is typically used in a hub and spoke design, with spoke vnets peered to a hub vnet that has one or more private resolver endpoints. In this hub and spoke scenario, the spoke vnet doesn't need to be linked to the private DNS zone in order to resolve resource records in the zone. In this case, the forwarding ruleset rule for the private zone sends queries to the hub vnet's inbound endpoint. For example: **azure.contoso.com** to **10.10.0.4**.

The following screenshot shows a DNS forwarding ruleset linked to two virtual networks: a hub vnet: **myeastvnet**, and a spoke vnet: **myeastspoke**.

![View ruleset links](./media/private-resolver-endpoints-rulesets/ruleset-links.png)

Virtual network links for DNS forwarding rulesets enable resources in vnets to use forwarding rules when resolving DNS names. Vnets that are linked from a ruleset, but don't have their own private resolver, must have a peering connection to the vnet that contains the private resolver. The vnet with the private resolver must also be linked from any private DNS zones for which there are ruleset rules.

For example, resources in the vnet `myeastspoke` can resolve records in the private DNS zone `azure.contoso.com` if:
- The vnet `myeastspoke` peers with `myeastvnet` 
- The ruleset provisioned in `myeastvnet` is linked to `myeastspoke` and `myeastvnet`
- A ruleset rule is configured and enabled in the linked ruleset to resolve `azure.contoso.com` using the inbound endpoint in `myeastvnet`

### Rules

DNS forwarding rules (ruleset rules) have the following properties:

| Property | Description |
| --- | --- |
| Rule name | The name of your rule. The name must begin with a letter, and can contain only letters, numbers, underscores, and dashes. |
| Domain name | The dot-terminated DNS namespace where your rule applies. The namespace must have either zero labels (for wildcard) or between 2 and 34 labels. For example, `contoso.com.` has two labels. |
| Destination IP:Port | The forwarding destination. One or more IP addresses and ports of DNS servers that will be used to resolve DNS queries in the specified namespace. |
| Rule state | The rule state: Enabled or disabled. If a rule is disabled, it's ignored. |

If multiple rules are matched, the longest prefix match is used.  

For example, if you have the following rules:

| Rule name | Domain name | Destination IP:Port | Rule state |
| --- | --- | --- | --- |
| Contoso | contoso.com. | 10.100.0.2:53 | Enabled  |
| AzurePrivate | azure.contoso.com. | 10.10.0.4:53 | Enabled  |
| Wildcard | . | 10.100.0.2:53 | Enabled  |

A query for `secure.store.azure.contoso.com` will match the **AzurePrivate** rule for `azure.contoso.com` and also the **Contoso** rule for `contoso.com`, but the **AzurePrivate** rule takes precedence because the prefix `azure.contoso` is longer than `contoso`. 

## Next steps

* Review components, benefits, and requirements for [Azure DNS Private Resolver](dns-private-resolver-overview.md).
* Learn how to create an Azure DNS Private Resolver by using [Azure PowerShell](./dns-private-resolver-get-started-powershell.md) or [Azure portal](./dns-private-resolver-get-started-portal.md).
* Understand how to [Resolve Azure and on-premises domains](private-resolver-hybrid-dns.md) using the Azure DNS Private Resolver.
* Learn how to [Set up DNS failover using private resolvers](tutorial-dns-private-resolver-failover.md)
* Learn how to [configure hybrid DNS](private-resolver-hybrid-dns.md) using private resolvers.
* Learn about some of the other key [networking capabilities](../networking/fundamentals/networking-overview.md) of Azure.
* [Learn module: Introduction to Azure DNS](/learn/modules/intro-to-azure-dns).