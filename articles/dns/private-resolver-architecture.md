---
title: Private resolver architecture
description: Configure the Azure DNS Private Resolver for a centralized or non-centralized architecture
services: dns
author: greg-lindsay
ms.service: dns
ms.topic: how-to
ms.date: 02/21/2023
ms.author: greglin
#Customer intent: As an administrator, I want to optimize the DNS resolver configuration in my network.
---

# Private resolver architecture

This article provides example configurations for centralized vs distributed DNS resolution in [hub and spoke VNets](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke) using the Azure DNS Private Resolver.

For an overview of the private resolver, see [What is Azure DNS Private Resolver?](dns-private-resolver-overview.md). For more information about components of the private resolver, see [Azure DNS Private Resolver endpoints and rulesets](private-resolver-endpoints-rulesets.md).

## Options for private zone resolution

You can use [virtual network links](private-dns-virtual-network-links.md) from a private DNS zone to a VNet to enable DNS resolution in the VNet. However, this method might not always be desired. For example, a VNet can only be linked to one private DNS zone. You might have more than one private zone, and wish to perform autoregistration in one zone but still be able to resolve records in another zone.

The Azure DNS Private Resolver solves this problem by providing two additional components and options that you can use to resolve records in a private zone:
- **Forwarding rulesets** can be linked to a VNet to provide DNS forwarding capabilities. For example, a ruleset can contain a rule that forwards queries for the private zone to a private resolver inbound endpoint.
    - To use this option, you must not link the forwarding ruleset to the same VNet where the inbound endpoint is provisioned. This configuration can result in a DNS resolution loop. 
- **Inbound endpoints**  can be configured as custom DNS for a VNet.
    - This option requires that the VNet where the inbound endpoint is provisioned is linked to the private zone.

### Forwarding ruleset example 

Consider the following hub and spoke VNet topology in Azure with a private resolver located in the hub and a ruleset link to the spoke VNet:

![Hub and spoke architecture diagram](./media/private-resolver-architecture/hub-and-spoke-ruleset.png)

**Figure 1**: Azure hub and spoke VNets with ruleset link

- A hub VNet is configured with address space 10.10.0.0/16.
- A spoke VNet is configured with address space 10.11.0.0/16.
- A private DNS zone **azure.contoso.com** is linked to the hub VNet.
- A private resolver is located in the hub VNet.
    - The private resolver has one inbound endpoint with an IP address of **10.10.0.4**.
    - The private resolver has one outbound endpoint and DNS forwarding ruleset.
        - The DNS forwarding ruleset is linked to the spoke VNet.
        - A ruleset rule is configured to forward queries for the private zone to the inbound endpoint.

The virtual network link from the private zone to the Hub VNet enables resources inside the hub VNet to automatically resolve DNS records in **azure.contoso.com** using Azure-provided DNS ([168.63.129.16](../virtual-network/what-is-ip-address-168-63-129-16.md)).

The hub VNet also uses Azure-provided DNS, but isn't linked to the private zone. The hub VNet resolves records in the private zone using the linked ruleset.

The ruleset link design scenario is best suited to a hub and spoke network where DNS resolution is distributed and can be unique in some locations.

### Custom DNS example

Consider the following hub and spoke VNet topology with an inbound endpoint provisioned as custom DNS in the spoke VNet:

![Hub and spoke architecture diagram](./media/private-resolver-architecture/hub-and-spoke-custom-dns.png)

**Figure 2**: Azure hub and spoke VNets with custom DNS

- A hub VNet is configured with address space 10.10.0.0/16.
- A spoke VNet is configured with address space 10.11.0.0/16.
- A private DNS zone **azure.contoso.com** is linked to the hub VNet.
- A private resolver is located in the hub VNet.
    - The private resolver has one inbound endpoint with an IP address of **10.10.0.4**.
    - The private resolver has one outbound endpoint and DNS forwarding ruleset.
        - In this scenario, the DNS forwarding ruleset doesn't need a rule to forward queries for the private zone to the inbound endpoint.

In this example, the spoke VNet sends all of its DNS traffic to the inbound endpoint - not just the private zone linked to the hub VNet. This design scenario is best suited to a hub and spoke architecture where DNS resolution is primarily centralized and uniform.

## Next steps

* Review components, benefits, and requirements for [Azure DNS Private Resolver](dns-private-resolver-overview.md).
* Learn how to create an Azure DNS Private Resolver by using [Azure PowerShell](./dns-private-resolver-get-started-powershell.md) or [Azure portal](./dns-private-resolver-get-started-portal.md).
* Understand how to [Resolve Azure and on-premises domains](private-resolver-hybrid-dns.md) using the Azure DNS Private Resolver.
* Learn about [Azure DNS Private Resolver endpoints and rulesets](private-resolver-endpoints-rulesets.md).
* Learn how to [Set up DNS failover using private resolvers](tutorial-dns-private-resolver-failover.md)
* Learn about some of the other key [networking capabilities](../networking/fundamentals/networking-overview.md) of Azure.
* [Learn module: Introduction to Azure DNS](/training/modules/intro-to-azure-dns).
