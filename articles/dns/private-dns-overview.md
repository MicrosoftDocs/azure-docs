---
title: Using Azure DNS for private domains | Microsoft Docs
description: Overview of private DNS hosting service on Microsoft Azure.
services: dns
documentationcenter: na
author: KumudD
manager: jennoc
editor: ''

ms.assetid: 
ms.service: dns
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/15/2018
ms.author: kumud
---

# Using Azure DNS for private domains
The Domain Name System, or DNS, is responsible for translating (or resolving) a service name to its IP address. Azure DNS is a hosting service for DNS domains, providing name resolution using the Microsoft Azure infrastructure.  In addition to internet-facing DNS domains, Azure DNS now also supports private DNS domains as a preview feature.  
 
Azure DNS provides a reliable, secure DNS service to manage and resolve domain names in a virtual network without the need to add a custom DNS solution. Private DNS zones allow you to use your own custom domain names rather than the Azure-provided names available today.  Using custom domain names helps you to tailor your virtual network architecture to best suit your organization's needs. It provides name resolution for VMs within a virtual network and between virtual networks. Additionally, you can configure zones names with a split-horizon view - allowing a private and a public DNS zone to share the same name.

![DNS overview](./media/private-dns-overview/scenario.png)

[!INCLUDE [private-dns-public-preview-notice](../../includes/private-dns-public-preview-notice.md)]

## Benefits

* **Removes the need for custom DNS solutions.** Previously, many customers created custom DNS solutions to manage DNS zones in their virtual network.  DNS zone management can now be done using Azure's native infrastructure, which removes the burden of creating & managing custom DNS solutions.

* **Use all common DNS records types.**  Azure DNS supports A, AAAA, CNAME, MX, NS, PTR, SOA, SRV, and TXT records.

* **Automatic hostname record management.** Along with hosting your custom DNS records, Azure automatically maintains hostname records for the VMs in the specified virtual networks.  This allows you to optimize the domain names you use without needing to create custom DNS solutions or modify application.

* **Hostname resolution between virtual networks.** Unlike Azure-provided host names, private DNS zones can be shared between virtual networks.  This capability simplifies cross-network and service discovery scenarios such as virtual network peering.

* **Familiar tools and user experience.** To reduce the learning curve, this new offering uses the already well-established Azure DNS tools (PowerShell, Resource Manager templates, REST API).

* **Split-horizon DNS support.** Azure DNS allows you to create zones with the same name that resolve to different answers from within a virtual network and from the public Internet.  A typical scenario for split-horizon DNS is to provide a dedicated version of a service for use inside your virtual network.

* **Available in all Azure regions.** Azure DNS Private Zones is available in all Azure regions in the Azure Public cloud. 


## Capabilities 
* Automatic registration of virtual machines from a single virtual network linked to a private zone as a Registration virtual network. The virtual machines will be registered (added) to the private zone as A records pointing to their Private IPs. Furthermore, when a virtual machine in a Registration virtual network gets deleted, Azure will also automatically remove the corresponding DNS record from the linked private zone. Note that Registration virtual networks also by default act as Resolution virtual networks in that DNS resolution against the zone will work from any of the virtual machines within the Registration virtual network. 
* Forward DNS resolution supported across virtual networks that are linked to the private zone as Resolution virtual networks. For cross-virtual network DNS resolution, there is no explicit dependency that the virtual networks be peered with each other. However, customers may want to peer virtual networks for other scenarios (eg: HTTP traffic).
* Reverse DNS lookup supported within the VNET scope. Reverse DNS lookup for a Private IP within the virtual network assigned to a Private Zone will return the FQDN that includes the host/record name as well as the zone name as the suffix. 


## Limitations
* 1 Registration virtual network per Private Zone
* Upto 10 Resolution virtual networks per Private Zone
* A given virtual network can only be linked to one Private Zone as a Registration virtual network
* A given virtual network can be linked to up to 10 Private Zones as a Resolution virtual network
* If a Registration virtual network is specified, the DNS records for the VMs from that virtual network that are registered to the Private Zone will not be viewable or retrievable from the Powershell/CLI/APIs, but the VM records are indeed registered and will resolve successfully
* Reverse DNS will only work for Private IP space in the Registration virtual network
* Reverse DNS for a Private IP that is not registered in the Private Zone (eg: Private IP for a virtual machine in a virtual network that is linked as a Resolution virtual network to a private zone) will return "internal.cloudapp.net" as the DNS suffix, however this suffix will not be resolvable.   
* Virtual network needs to be empty (i.e no VM records) when initially (i.e for the first time) linking to a Private Zone as Registration or Resolution virtual network. However, the virtual network can then be non-empty for future linking as a Registration or Resolution virtual network, to other private zones. 
* At this time, conditional forwarding is not supported, for example for enabling resolution between Azure and OnPrem networks. For documentation on how customers can realize this scenario via other mechanisms, please see [Name Resolution for VMs and Role Instances](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md)

We also recommend you also read up on the [FAQ](./dns-faq.md#private-dns) for some common questions and answers on Private Zones in Azure DNS, including specific DNS registration and resolution behavior you can expect for certain kinds of operations. 


## Pricing

Private DNS zones is free of charge during the public preview. During general availability, this feature will use a usage-based pricing model similar to the existing Azure DNS offering. 


## Next steps

Learn how to create a private zone in Azure DNS using the [PowerShell](./private-dns-getstarted-powershell.md) or [CLI](./private-dns-getstarted-cli.md).

Read up on some common scenarios [Private Zone scenarios](./private-dns-scenarios.md) that can be realized with Private Zones in Azure DNS.

Read up on the [FAQ](./dns-faq.md#private-dns) for some common questions and answers on Private Zones in Azure DNS, including specific behavior you can expect for certain kinds of operations. 

Learn about DNS zones and records by visiting: [DNS zones and records overview](dns-zones-records.md).

Learn about some of the other key [networking capabilities](../networking/networking-overview.md) of Azure.

