---
title: What is autoregistration feature in Azure DNS private zones?
description: Overview of autoregistration feature in Azure DNS private zones.
services: dns
author: greg-lindsay
ms.service: azure-dns
ms.topic: concept-article
ms.date: 01/31/2025
ms.author: greglin
---

# What is the autoregistration feature in Azure DNS private zones?

The Azure DNS private zones autoregistration feature manages DNS records for virtual machines deployed in a virtual network. When you [link a virtual network](./private-dns-virtual-network-links.md) with a private DNS zone with this setting enabled, a DNS record gets created for each virtual machine deployed in the virtual network. 

For each virtual machine, an address (A) record is created. DNS records for newly deployed virtual machines are also automatically created in the linked private DNS zone. When a virtual machine gets deleted, any associated DNS records also get deleted from the private DNS zone.

To enable autoregistration, select the checkbox for "Enable auto registration" when you create the virtual network link.

:::image type="content" source="./media/privatedns-concepts/enable-autoregistration.png" alt-text="Screenshot of enable auto registration on add virtual network link page.":::

## Restrictions

* Autoregistration works only for virtual machines. For all other resources like internal load balancers, you can create DNS records manually in the private DNS zone linked to the virtual network.
* DNS records are created automatically only for the primary virtual machine NIC. If your virtual machines have more than one NIC, you can manually create the DNS records for other network interfaces.
* A specific virtual network can be linked to only one private DNS zone when automatic registration is enabled. You can, however, link multiple virtual networks to a single DNS zone.
* Autoregistration doesn't support reverse DNS pointer (PTR) records.

## Next steps

* Learn how to create a private zone in Azure DNS using [Azure PowerShell](./private-dns-getstarted-powershell.md) or [Azure CLI](./private-dns-getstarted-cli.md).

* Read about some common [private zone scenarios](./private-dns-scenarios.md) that can be realized with private zones in Azure DNS.

* For common questions and answers about private zones in Azure DNS, including specific behavior you can expect for certain kinds of operations, see [Private DNS FAQ](./dns-faq-private.yml).
