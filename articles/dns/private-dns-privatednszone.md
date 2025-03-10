---
title: What is an Azure Private DNS zone?
description: Overview of Private DNS zones
services: dns
author: greg-lindsay
ms.service: azure-dns
ms.topic: concept-article
ms.date: 10/12/2023
ms.author: greglin
---

# What is an Azure Private DNS zone?

Azure Private DNS provides a reliable, secure DNS service to manage and resolve domain names in a virtual network without the need to add a custom DNS solution. By using private DNS zones, you can use your own custom domain names rather than the Azure-provided names available today. 

The records contained in a private DNS zone aren't resolvable from the Internet. DNS resolution against a private DNS zone works only from virtual networks that are linked to it.

You can link a private DNS zone to one or more virtual networks by creating [virtual network links](./private-dns-virtual-network-links.md).
You can also enable the [autoregistration](./private-dns-autoregistration.md) feature to automatically manage the life cycle of the DNS records for the virtual machines that get deployed in a virtual network.

## Private DNS zone resolution

Private DNS zones linked to a VNet are queried first when using the default DNS settings of a VNet. Azure provided DNS servers are queried next. However, if a [custom DNS server](../virtual-network/manage-virtual-network.yml#change-dns-servers) is defined in a VNet, then private DNS zones linked to that VNet are not automatically queried, because the custom settings override the name resolution order. 

To enable custom DNS to resolve the private zone, you can use an [Azure DNS Private Resolver](dns-private-resolver-overview.md) in a VNet linked to the private zone as described in [centralized DNS architecture](private-resolver-architecture.md#centralized-dns-architecture). If the custom DNS is a virtual machine, configure a conditional forwarder to Azure DNS (168.63.129.16) for the private zone.

## Limits

[!INCLUDE [dns-limits-private-zones](../../includes/dns-limits-private-zones.md)]

## Restrictions

* Single-label private DNS zones aren't supported. Your private DNS zone must have two or more labels. For example, contoso.com has two labels separated by a dot. A private DNS zone can have a maximum of 34 labels.
* You can't create zone delegations (NS records) in a private DNS zone. If you intend to use a child domain, you can directly create the domain as a private DNS zone. Then you can link it to the virtual network without setting up a nameserver delegation from the parent zone.
* The following list of reserved zone names are blocked from creation to prevent disruption of services:

    | Public | Azure Government | Microsoft Azure operated by 21Vianet |
    | --- | --- | --- |
    |azclient.ms	| azclient.us	| azclient.cn
    |azure.com |	azure.us	| azure.cn
    |cloudapp.net |	usgovcloudapp.net	| chinacloudapp.cn
    |core.windows.net |	core.usgovcloudapi.net	| core.chinacloudapi.cn
    |microsoft.com |	microsoft.us |	microsoft.cn
    |msidentity.com	| msidentity.us	| msidentity.cn
    |trafficmanager.net	| usgovtrafficmanager.net |	trafficmanager.cn
    |windows.net| 	usgovcloudapi.net	| chinacloudapi.cn

## Next steps

* Review and understand [Private DNS records](dns-private-records.md).
* Learn how to create a private zone in Azure DNS by using [Azure PowerShell](./private-dns-getstarted-powershell.md) or [Azure CLI](./private-dns-getstarted-cli.md).
* Read about some common [private zone scenarios](./private-dns-scenarios.md) that can be realized with private zones in Azure DNS.
* For common questions and answers about private zones in Azure DNS, see [Private DNS FAQ](./dns-faq-private.yml).
