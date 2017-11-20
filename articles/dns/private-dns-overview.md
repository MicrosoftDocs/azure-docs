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
ms.date: 09/04/2017
ms.author: kumud
---


# Using Azure DNS for private domains
The Domain Name System, or DNS, is responsible for translating (or resolving) a service name to its IP address. Azure DNS is a hosting service for DNS domains, providing name resolution using the Microsoft Azure infrastructure.  In addition to internet-facing DNS domains, Azure DNS now also supports private DNS domains as a preview feature.  
 
Azure DNS provides a reliable, secure DNS service to manage and resolve domain names in a virtual network without the need to add a custom DNS solution. Private DNS zones allow you to use your own custom domain names rather than the Azure-provided names available today.  Using custom domain names helps you to tailor your virtual network architecture to best suit your organization's needs. It provides name resolution for VMs within a virtual network and between virtual networks. Additionally, you can configure zones names with a split-horizon view - allowing a private and a public DNS zone to share the same name.

![DNS overview](./media/private-dns-overview/scenario.png)

[!INCLUDE [private-dns-preview-notice](../../includes/private-dns-preview-notice.md)]

## Benefits

* **Removes the need for custom DNS solutions.** Previously, many customers created custom DNS solutions to manage DNS zones in their virtual network.  DNS zone management can now be done using Azure's native infrastructure, which removes the burden of creating & managing custom DNS solutions.

* **Use all common DNS records types.**  Azure DNS supports A, AAAA, CNAME, MX, NS, PTR, SOA, SRV, and TXT records.

* **Automatic hostname record management.** Along with hosting your custom DNS records, Azure automatically maintains hostname records for the VMs in the specified virtual networks.  This allows you to optimize the domain names you use without needing to create custom DNS solutions or modify application.

* **Hostname resolution between virtual networks.** Unlike Azure-provided host names, private DNS zones can be shared between virtual networks.  This capability simplifies cross-network and service discovery scenarios such as virtual network peering.

* **Familiar tools and user experience.** To reduce the learning curve, this new offering uses the already well-established Azure DNS tools (PowerShell, Resource Manager templates, REST API).

* **Split-horizon DNS support.** Azure DNS allows you to create zones with the same name that resolve to different answers from within a virtual network and from the public Internet.  A typical scenario for split-horizon DNS is to provide a dedicated version of a service for use inside your virtual network.


## Pricing

Private DNS zones is free of charge during the managed preview. During general availability, this feature will use a usage-based pricing model similar to the existing Azure DNS offering. 


## Next steps

Learn how to [create a private DNS zone](./private-dns-getstarted-powershell.md) in Azure DNS.

Learn about DNS zones and records by visiting: [DNS zones and records overview](dns-zones-records.md).

Learn about some of the other key [networking capabilities](../networking/networking-overview.md) of Azure.

