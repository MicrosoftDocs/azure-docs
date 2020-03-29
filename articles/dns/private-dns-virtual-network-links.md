---
title: What is a virtual network link subresource of Azure DNS private zones
description: Overview of virtual network link sub resource a Azure DNS private zone
services: dns
author: rohinkoul
ms.service: dns
ms.topic: article
ms.date: 9/24/2019
ms.author: rohink
---

# What is a virtual network link?

Once you create a private DNS zone in Azure, it is not immediately accessible from any virtual network. You must link it to a virtual network before a VM hosted in that network can access the private DNS zone.
To link a private DNS zone with a virtual network, you must create a virtual network link under the private DNS zone. Every private DNS zone has a collection of virtual network link child resources. Each one of these resources represents a connection to a virtual network.

You can link a virtual network to a private DNS zone as a registration virtual network or as a resolution virtual network.

## Registration virtual network

When you [create a link](https://docs.microsoft.com/azure/dns/private-dns-getstarted-portal#link-the-virtual-network) between a private DNS zone and a virtual network, you have an option to turn on [autoregistration](./private-dns-autoregistration.md) of DNS records for virtual machines. If you choose this option, the virtual network becomes a registration virtual network for the private DNS zone. A DNS record is automatically created for the virtual machines that you deploy in the network. DNS records are created for the virtual machines that you have already deployed in the virtual network. From the virtual network perspective, private DNS zone becomes the registration zone for that virtual network.
One private DNS zone can have multiple registration virtual networks, however every virtual network can have exactly one registration zone associated with it.

## Resolution virtual network

When you create a virtual network link under a private DNS zone and choose not to enable DNS record autoregistration, the virtual network is treated as a resolution only virtual network. DNS records for virtual machines deployed in such networks will not be automatically created in the linked private DNS zone. However, the virtual machines deployed in such a network can successfully query the DNS records from the private DNS zone. These records may be manually created by you or may be populated from other virtual networks that have been linked as registration networks with the private DNS zone.
One private DNS zone can have multiple resolution virtual networks and a virtual network can have multiple resolution zones associated to it.

## Limits

To understand how many registration and resolution networks, you can link to private DNS zones see [Azure DNS Limits](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits#azure-dns-limits)

## Other considerations

* Virtual networks deployed using classic deployment model are not supported.

* You can create only one link between a private DNS zone and a virtual network.

* Each virtual network link under a private DNS zone must have unique name within the context of the private DNS zone. You can have links with same name in different private DNS zones.

* After creating a virtual network link, check the "Link Status" field of the virtual network link resource. Depending on the size of the virtual network, it can take a few minutes before the link is operation and the Link Status changes to *Completed*.

* When you delete a virtual network, all the virtual network links and auto-registered DNS records associated with it in different private DNS zones are automatically deleted.

## Next steps

* Learn how to link a virtual network to a private DNS zone using [Azure portal](https://docs.microsoft.com/azure/dns/private-dns-getstarted-portal#link-the-virtual-network)

* Learn how to create a private zone in Azure DNS by using [Azure PowerShell](./private-dns-getstarted-powershell.md) or [Azure CLI](./private-dns-getstarted-cli.md).

* Read about some common [private zone scenarios](./private-dns-scenarios.md) that can be realized with private zones in Azure DNS.

* For common questions and answers about private zones in Azure DNS, including specific behavior you can expect for certain kinds of operations, see [Private DNS FAQ](./dns-faq-private.md).
