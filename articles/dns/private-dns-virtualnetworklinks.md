---
title: What is a virtual network link
description: Overview of virtual network link sub resource a private DNS zone
services: dns
author: rohinkoul
ms.service: dns
ms.topic: article
ms.date: 9/24/2019
ms.author: rohink
---

# What is a virtual network link

Once you have creates a private DNS zones in Azure it is not immediately accessible from any virtual network. You must link it to specific virtual networks before VM hosted in these networks can access the private DNS zone.
To link a private DNS zone with a virtual network you must create a virtual network link under the private DNS zone. Ever private DNS zone has a collection of virtual network link child resources. Each one of these represents a connection to a specific virtual network.

You can link a virtual network to a private DNS zone as a registration virtual network or as a resolution virtual network.

## Registration virtual network

When you [create a link](./https://docs.microsoft.com/azure/dns/private-dns-getstarted-portal#link-the-virtual-network) between a private DNS zone and a virtual network you have a option of turning on [auto-registration](./private-dns-autoregistration.md) of DNS records for virtual machines. If you choose this option the virtual network becomes a registration virtual network for the private DNS zone. A DNS record will be automatically created for the virtual machines that you deploy in tis network. DNS records will also be created for the virtual machines that you have already deployed in the virtual network. From the virtual network perspective private DNS zone becomes the registration zone for that virtual network.
One private DNS zone can have multiple registration virtual networks however every virtual network can have exactly one registration zone associated with it.

## Resolution virtual network

When you create a virtual network link under a private DNS zone and choose not to enable auto-registration of DNS records the virtual network is treated as a resolution only virtual network. DNS records for virtual machines deployed in such networks will not be automatically created in the link private DNS zone. However the virtual machines deployed in such a network will be able to successfully query the DNS records from the private DNS zone. These records may be manually created by you or may be populated from other virtual networks that have been linked as registration networks with the private DNS zone.
One private DNS zone can have multiple resolution virtual network and a virtual network can have multiple resolution zones associated to it.

## Limits

To understand how many registration and resolution networks you can link to private DNS zones please refer to [Azure DNS Limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#azure-dns-limits)

## Other considerations

* Virtual networks deployed using classic deployment model are not supported.

* A virtual network can be linked to a private DNS zone either as registration virtual network or as a resolution virtual network. You can't link the virtual network to the private DNS zone in both modes simultaneously.

* Each virtual network link under a private DNS zone must have unique name within the context of the private DNS zone. You can have links with same name in different private DNS zones.

* After creating a virtual network link please check the "Link Status" field of the virtual network link resource. Depending on the size of the virtual network it can take a few minutes before link is operation and Link Status changes to completed.

* When you delete a virtual network all the virtual network links and auto-registered DNS records associated with it in different private DNS zones are automatically deleted.

## Next steps

* Learn how to link a virtual network to a private DNS zone using [Azure Portal](https://docs.microsoft.com/azure/dns/private-dns-getstarted-portal#link-the-virtual-network)

* Learn how to create a private zone in Azure DNS by using [Azure PowerShell](./private-dns-getstarted-powershell.md) or [Azure CLI](./private-dns-getstarted-cli.md).

* Read about some common [private zone scenarios](./private-dns-scenarios.md) that can be realized with private zones in Azure DNS.

* For common questions and answers about private zones in Azure DNS, including specific behavior you can expect for certain kinds of operations, see [Private DNS FAQ](./dns-faq-private.md).
