---
title: What is a virtual network link subresource of Azure DNS private zones
description: Overview of virtual network link sub resource an Azure DNS private zone
services: dns
author: greg-lindsay
ms.service: dns
ms.topic: article
ms.date: 09/27/2022
ms.author: greglin
---

# What is a virtual network link?

After you create a private DNS zone in Azure, you'll need to link a virtual network to it. Once linked, VMs hosted in that virtual network can access the private DNS zone. Every private DNS zone has a collection of virtual network link child resources. Each one of these resources represents a connection to a virtual network. A virtual network can be linked to private DNS zone as a registration or as a resolution virtual network.

## Registration virtual network

When [creating a link](./private-dns-getstarted-portal.md#link-the-virtual-network) between a private DNS zone and a virtual network. You have the option to enable [autoregistration](./private-dns-autoregistration.md). With this setting enabled, the virtual network becomes a registration virtual network for the private DNS zone. A DNS record gets automatically created for any virtual machines you deploy in the virtual network. DNS records will also be created for virtual machines already deployed in the virtual network.

From the virtual network perspective, private DNS zone becomes the registration zone for that virtual network. A private DNS zone can have multiple registration virtual networks. However, every virtual network can only have one registration zone associated with it.

## Resolution virtual network

If you choose to link your virtual network with the private DNS zone without autoregistration, the virtual network is treated as a resolution virtual network only. DNS records for virtual machines deployed this virtual network won't be created automatically in the private zone. However, virtual machines deployed in the virtual network can successfully query for DNS records in the private zone. These records include manually created and auto registered records from other virtual networks linked to the private DNS zone.

One private DNS zone can have multiple resolution virtual networks and a virtual network can have multiple resolution zones associated to it.

## Limits

To understand how many registration and resolution networks, you can link to private DNS zones see [Azure DNS Limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-dns-limits)

## Other considerations

* Virtual networks deployed using classic deployment model isn't supported.

* You can create only one link between a private DNS zone and a virtual network.

* Each virtual network link under a private DNS zone must have unique name within the context of the private DNS zone. You can have links with same name in different private DNS zones.

* After creating a virtual network link, check the "Link Status" field of the virtual network link resource. Depending on the size of the virtual network, it can take a few minutes before the link is operation and the Link Status changes to *Completed*.

* When you delete a virtual network, all the virtual network links and autoregistered DNS records associated with it in different private DNS zones are automatically deleted.

## Next steps

* Learn how to link a virtual network to a private DNS zone using [Azure portal](./private-dns-getstarted-portal.md#link-the-virtual-network)

* Learn how to create a private zone in Azure DNS by using [Azure PowerShell](./private-dns-getstarted-powershell.md) or [Azure CLI](./private-dns-getstarted-cli.md).

* Read about some common [private zone scenarios](./private-dns-scenarios.md) that can be realized with private zones in Azure DNS.

* For common questions and answers about private zones in Azure DNS, including specific behavior you can expect for certain kinds of operations, see [Private DNS FAQ](./dns-faq-private.yml).
