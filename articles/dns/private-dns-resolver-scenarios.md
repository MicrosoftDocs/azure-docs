---
title: Scenarios for Private DNS resolver - Azure DNS
description: In this article, learn about common scenarios for using Azure DNS Private Resolver.
services: dns
author: greg-lindsay
ms.service: dns
ms.topic: article
ms.date: 04/25/2022
ms.author: greglin
---

# Azure DNS Private Resolver scenarios

Azure DNS Private resolver provides name resolution within a virtual network and between virtual networks. In this article, we'll look at some common scenarios that can benefit from this feature.

> [!NOTE] 
> The following scenarios assume that you have already created an Azure private DNS resolver. If you have not yet created the resolver, use the following guides to set up your environment:
> - [Quickstart: Create an Azure private DNS resolver using the Azure portal](private-dns-resolver-getstarted-portal.md)
> - [Quickstart: Create an Azure private DNS resolver using Azure PowerShell](private-dns-resolver-getstarted-powershell.md)

## Scenario: 1

In this scenario, you will simulate an on-prem DNS server that will use an Azure private DNS resolver to resolve names in an Azure private DNS zone. 






## Next steps
To learn more about private DNS zones, see [Using Azure DNS for private domains](private-dns-overview.md).

Learn how to [create a private DNS zone](./private-dns-getstarted-powershell.md) in Azure DNS.

Learn about DNS zones and records by visiting: [DNS zones and records overview](dns-zones-records.md).

Learn about some of the other key [networking capabilities](../networking/fundamentals/networking-overview.md) of Azure.
