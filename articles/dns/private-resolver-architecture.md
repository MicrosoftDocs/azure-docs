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

This article discusses architectural design options that are available to resolve private DNS zones across your network using an Azure DNS Private Resolver. Example configurations are provided with design recommendations for centralized vs distributed DNS resolution in a [hub and spoke VNet topology](/azure/cloud-adoption-framework/ready/azure-best-practices/hub-spoke-network-topology).

- For an overview of the Azure DNS Private Resolver, see [What is Azure DNS Private Resolver](dns-private-resolver-overview.md). 
- For more information about components of the private resolver, see Azure DNS Private Resolver [endpoints and rulesets](private-resolver-endpoints-rulesets.md).

## Options for DNS resolution

A private zone [virtual network link](private-dns-virtual-network-links.md) enables DNS resolution of the private zone in the linked VNet. However, this method has some limitations. For example, you might wish to resolve some names differently in different VNets, or need to resolve on-premises domains in a spoke VNet. This can be accomplished by using an Azure DNS Private Resolver.

The Azure DNS Private Resolver provides two components that you can use to resolve records in your private DNS zone and other namespaces. The determination of which of these methods to use depends on your network design. 
- **Forwarding rulesets** can be linked to a VNet to provide DNS forwarding capabilities. A ruleset containing a rule to forward queries to the private resolver inbound endpoint enables resolution of the private zone in any VNet that is linked to the ruleset.
    - To use this option, you must not link the forwarding ruleset to the same VNet where the inbound endpoint is provisioned. This configuration can result in a DNS resolution loop.
    - The ruleset link design scenario is best suited to a [distributed DNS architecture](#distributed-dns-architecture) where network traffic is spread across your Azure network, and might be unique in some locations. 
- **Inbound endpoints** can be configured as custom DNS for a VNet.
    - To resolve a private DNS zone from a spoke VNet using this method, the VNet where the inbound endpoint exists must be linked to the private zone.
    - The custom DNS design scenario is best suited to a [centralized DNS architecture](#centralized-dns-architecture) where DNS resolution and network traffic flow is mostly to a hub VNet, and is controlled from a central location. 
    
These two scenarios are discussed in more detail in the next sections.

## Distributed DNS architecture 

Consider the following hub and spoke VNet topology in Azure with a private resolver located in the hub and a ruleset link to the spoke VNet:

![Hub and spoke with ruleset diagram](./media/private-resolver-architecture/hub-and-spoke-ruleset.png)

**Figure 1**: Distributed DNS architecture using ruleset links

- A hub VNet is configured with address space 10.10.0.0/16.
- A spoke VNet is configured with address space 10.11.0.0/16.
- A private DNS zone **azure.contoso.com** is linked to the hub VNet.
- A private resolver is provisioned in the hub VNet.
    - The private resolver has one inbound endpoint with an IP address of **10.10.0.4**.
    - The private resolver has one outbound endpoint and an associated DNS forwarding ruleset.
        - The DNS forwarding ruleset is linked to the spoke VNet.
        - A ruleset rule is configured to forward queries for the private zone to the inbound endpoint.

**DNS resolution in the hub VNet**: The virtual network link from the private zone to the Hub VNet enables resources inside the hub VNet to automatically resolve DNS records in **azure.contoso.com** using Azure-provided DNS ([168.63.129.16](../virtual-network/what-is-ip-address-168-63-129-16.md)). All other namespaces are also resolved using Azure-provided DNS. The hub VNet doesn't use ruleset rules to resolve DNS names because it is not linked to the ruleset. To use forwarding rules in the hub VNet, create and link another ruleset to the Hub VNet.
<br>**DNS resolution in the spoke VNet**: The virtual network link from the ruleset to the spoke VNet enables the spoke VNet to resolve **azure.contoso.com** using the configured forwarding rule. A link from the private zone to the spoke VNet is not required here. The spoke VNet sends queries for **azure.contoso.com**, and any other namespaces that have been configured in the ruleset, to the hub VNet. DNS queries that don't match a ruleset rule use Azure-provided DNS. 

> [!IMPORTANT]
> In this example configuration, the hub VNet must be linked to the private zone, but must **not** be linked to the forwarding ruleset. Linking a forwarding ruleset that contains a rule with the inbound endpoint as a destination to the same VNet where the inbound endpoint is provisioned can cause DNS resolution loops.

## Centralized DNS architecture

Consider the following hub and spoke VNet topology with an inbound endpoint provisioned as custom DNS in the spoke VNet:

![Hub and spoke with custom DNS diagram](./media/private-resolver-architecture/hub-and-spoke-custom-dns.png)

**Figure 2**: Centralized DNS architecture using custom DNS

- A hub VNet is configured with address space 10.10.0.0/16.
- A spoke VNet is configured with address space 10.11.0.0/16.
- A private DNS zone **azure.contoso.com** is linked to the hub VNet.
- A private resolver is located in the hub VNet.
    - The private resolver has one inbound endpoint with an IP address of **10.10.0.4**.
    - The private resolver has one outbound endpoint and an associated DNS forwarding ruleset.
        - The DNS forwarding ruleset is linked to the hub VNet.
        - A ruleset rule **is not configured** to forward queries for the private zone to the inbound endpoint.

**DNS resolution in the hub VNet**: The virtual network link from the private zone to the Hub VNet enables resources inside the hub VNet to automatically resolve DNS records in **azure.contoso.com** using Azure-provided DNS ([168.63.129.16](../virtual-network/what-is-ip-address-168-63-129-16.md)). If configured, ruleset rules determine how DNS names are resolved.  Namespaces that don't match a ruleset rule are resolved using Azure-provided DNS. 
<br>**DNS resolution in the spoke VNet**: In this example, the spoke VNet sends all of its DNS traffic to the inbound endpoint in the Hub VNet. Since **azure.contoso.com** has a virtual network link to the Hub VNet, all resources in the Hub can resolve **azure.contoso.com**, including the inbound endpoint (10.10.0.4). The spoke VNet also resolves all DNS names using rules provisioned in the forwarding ruleset that is linked to the hub VNet.

> [!NOTE]
> In this scenario, both the hub and the spoke VNets use the hub-linked ruleset to resolve DNS names. This is because all DNS traffic from the spoke VNet is being sent to the hub due to the custom DNS configuration setting. The hub VNet doesn't require an outbound endpoint or ruleset here, but if one is provisioned and linked to the hub, both the hub and spoke VNets will use the forwarding rules. As mentioned previously, it is important that a forwarding rule for the private zone is not present because this configuration can create a DNS resolution loop.

## Next steps

* Review components, benefits, and requirements for [Azure DNS Private Resolver](dns-private-resolver-overview.md).
* Learn how to create an Azure DNS Private Resolver by using [Azure PowerShell](./dns-private-resolver-get-started-powershell.md) or [Azure portal](./dns-private-resolver-get-started-portal.md).
* Understand how to [Resolve Azure and on-premises domains](private-resolver-hybrid-dns.md) using the Azure DNS Private Resolver.
* Learn about [Azure DNS Private Resolver endpoints and rulesets](private-resolver-endpoints-rulesets.md).
* Learn how to [Set up DNS failover using private resolvers](tutorial-dns-private-resolver-failover.md)
* Learn about some of the other key [networking capabilities](../networking/fundamentals/networking-overview.md) of Azure.
* [Learn module: Introduction to Azure DNS](/training/modules/intro-to-azure-dns).
