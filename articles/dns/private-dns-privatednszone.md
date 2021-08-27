---
title: What is an Azure DNS private zone
description: Overview of a private DNS zone
services: dns
author: rohinkoul
ms.service: dns
ms.topic: article
ms.date: 04/09/2021
ms.author: rohink
---

# What is a private Azure DNS zone

Azure Private DNS provides a reliable, secure DNS service to manage and resolve domain names in a virtual network without the need to add a custom DNS solution. By using private DNS zones, you can use your own custom domain names rather than the Azure-provided names available today. 

The records contained in a private DNS zone aren't resolvable from the Internet. DNS resolution against a private DNS zone works only from virtual networks that are linked to it.

You can link a private DNS zone to one or more virtual networks by creating [virtual network links](./private-dns-virtual-network-links.md).
You can also enable the [autoregistration](./private-dns-autoregistration.md) feature to automatically manage the life cycle of the DNS records for the virtual machines that get deployed in a virtual network.

## Limits

To understand how many private DNS zones you can create in a subscription and how many record sets are supported in a private DNS zone, see [Azure DNS limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-dns-limits)

## Restrictions

* Single-labeled private DNS zones aren't supported. Your private DNS zone must have two or more labels. For example contoso.com has two labels separated by a dot. A private DNS zone can have a maximum of 34 labels.
* You can't create zone delegations (NS records) in a private DNS zone. If you intend to use a child domain, you can directly create the domain as a private DNS zone. Then you can link it to the virtual network without setting up a nameserver delegation from the parent zone.

## Next steps

* Learn how to create a private zone in Azure DNS by using [Azure PowerShell](./private-dns-getstarted-powershell.md) or [Azure CLI](./private-dns-getstarted-cli.md).

* Read about some common [private zone scenarios](./private-dns-scenarios.md) that can be realized with private zones in Azure DNS.

* For common questions and answers about private zones in Azure DNS, see [Private DNS FAQ](./dns-faq-private.yml).
