---
title: Use Azure DNS for private domains | Microsoft Docs
description: An overview of the private DNS hosting service on Microsoft Azure.
services: dns
documentationcenter: na
author: vhorne
manager: jeconnoc
editor: ''

ms.assetid: 
ms.service: dns
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/15/2018
ms.author: victorh
---

# Use Azure DNS for private domains
The Domain Name System, or DNS, is responsible for translating (or resolving) a service name to its IP address. A hosting service for DNS domains, Azure DNS provides name resolution by using the Microsoft Azure infrastructure. In addition to supporting internet-facing DNS domains, Azure DNS now also supports private DNS domains as a preview feature. 
 
Azure DNS provides a reliable, secure DNS service to manage and resolve domain names in a virtual network without your needing to add a custom DNS solution. By using private DNS zones, you can use your own custom domain names rather than the Azure-provided names available today. Using custom domain names helps you to tailor your virtual network architecture to best suit your organization's needs. It provides name resolution for virtual machines (VMs) within a virtual network and between virtual networks. Additionally, you can configure zones names with a split-horizon view, which allows a private and a public DNS zone to share the same name.

![DNS overview](./media/private-dns-overview/scenario.png)

[!INCLUDE [private-dns-public-preview-notice](../../includes/private-dns-public-preview-notice.md)]

## Benefits

Azure DNS provides the following benefits:

* **Removes the need for custom DNS solutions**. Previously, many customers created custom DNS solutions to manage DNS zones in their virtual network. You can now perform DNS zone management by using the native Azure infrastructure, which removes the burden of creating and managing custom DNS solutions.

* **Use all common DNS records types**. Azure DNS supports A, AAAA, CNAME, MX, NS, PTR, SOA, SRV, and TXT records.

* **Automatic hostname record management**. Along with hosting your custom DNS records, Azure automatically maintains hostname records for the VMs in the specified virtual networks. In this scenario, you can optimize the domain names you use without needing to create custom DNS solutions or modify applications.

* **Hostname resolution between virtual networks**. Unlike Azure-provided host names, private DNS zones can be shared between virtual networks. This capability simplifies cross-network and service-discovery scenarios, such as virtual network peering.

* **Familiar tools and user experience**. To reduce the learning curve, this new offering uses well-established Azure DNS tools (PowerShell, Azure Resource Manager templates, and the REST API).

* **Split-horizon DNS support**. With Azure DNS, you can create zones with the same name that resolve to different answers from within a virtual network and from the public internet. A typical scenario for split-horizon DNS is to provide a dedicated version of a service for use inside your virtual network.

* **Available in all Azure regions**. The Azure DNS private zones feature is available in all Azure regions in the Azure public cloud. 


## Capabilities

Azure DNS provides the following capabilities:
 
* **Automatic registration of virtual machines from a single virtual network that's linked to a private zone as a registration virtual network**. The virtual machines are registered (added) to the private zone as A records pointing to their private IPs. When a virtual machine in a registration virtual network is deleted, Azure also automatically removes the corresponding DNS record from the linked private zone. 

  > [!NOTE]
  > By default, registration virtual networks also act as resolution virtual networks, in the sense that DNS resolution against the zone works from any of the virtual machines within the registration virtual network. 

* **Forward DNS resolution is supported across virtual networks that are linked to the private zone as resolution virtual networks**. For cross-virtual network DNS resolution, there is no explicit dependency such that the virtual networks are peered with each other. However, customers might want to peer virtual networks for other scenarios (for example, HTTP traffic).

* **Reverse DNS lookup is supported within the virtual-network scope**. Reverse DNS lookup for a private IP within the virtual network assigned to a private zone will return the FQDN that includes the host/record name as well as the zone name as the suffix. 


## Limitations

Azure DNS is subject to the following limitations:

* Only one registration virtual network is allowed per private zone.
* Up to 10 resolution virtual networks are allowed per private zone.
* A specific virtual network can be linked to only one private zone as a registration virtual network.
* A specific virtual network can be linked to up to 10 private zones as a resolution virtual network.
* If a registration virtual network is specified, the DNS records for the VMs from that virtual network that are registered to the private zone are not viewable or retrievable from the Azure Powershell and Azure CLI APIs, but the VM records are indeed registered and will resolve successfully.
* Reverse DNS works only for private IP space in the registration virtual network.
* Reverse DNS for a private IP that is not registered in the private zone (for example, a private IP for a virtual machine in a virtual network that is linked as a resolution virtual network to a private zone) returns *internal.cloudapp.net* as the DNS suffix. However, this suffix is not resolvable. 
* The virtual network needs to be empty (that is, no VM records exist) when it initially (that is, for the first time) links to a private zone as a registration or resolution virtual network. However, the virtual network can then be non-empty for future linking as a registration or resolution virtual network, to other private zones. 
* At this time, conditional forwarding is not supported (for example, for enabling resolution between Azure and OnPrem networks). For information about how customers can realize this scenario via other mechanisms, see [Name resolution for VMs and role instances](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md).

For common questions and answers about private zones in Azure DNS, including specific DNS registration and resolution behavior you can expect for certain kinds of operations, see [FAQ](./dns-faq.md#private-dns).  


## Pricing

The private DNS zones feature is free of charge during the public preview. During general availability, the feature will offer a usage-based pricing model similar to that of the existing Azure DNS offering. 


## Next steps

Learn how to create a private zone in Azure DNS by using [Azure PowerShell](./private-dns-getstarted-powershell.md) or [Azure CLI](./private-dns-getstarted-cli.md).

Read about some common [private zone scenarios](./private-dns-scenarios.md) that can be realized with private zones in Azure DNS.

For common questions and answers about private zones in Azure DNS, including specific behavior you can expect for certain kinds of operations, see [FAQ](./dns-faq.md#private-dns). 

Learn about DNS zones and records by visiting [DNS zones and records overview](dns-zones-records.md).

Learn about some of the other key [networking capabilities](../networking/networking-overview.md) of Azure. 

