---
title: Azure Private DNS zone resiliency
description: In this article, learn about resiliency in Azure Private DNS zones.
services: dns
author: greg-lindsay
ms.service: dns
ms.topic: article
ms.date: 06/01/2023
ms.author: greglin
---

# Azure Private DNS zone resiliency

Azure Private DNS is an [availability zone foundational, zone-reduntant service](/azure/reliability/availability-zones-service-support#azure-services-with-availability-zone-support). This means that DNS private zones are automatically replicated and made available across multiple regions. In the event of a regional failure, private DNS zone data is still available in other regions. 

See the following example.

Figure here

In this example:
- The private zone azure.contoso.com is linked to VNets in three different regions. Autoregistration enabled in two regions.
- A temporary outage occurs in region A.
- Regions B and C are still able to successfully query DNS names in the private zone, including those that are autoregistered in region A.

![Regional failure example showing three VNets with one red and two green](media/private-dns-resiliency/resiliency-example.png)

## Next steps
To learn more about Private DNS zones, see [Using Azure DNS for private domains](private-dns-overview.md).

Learn how to [create a Private DNS zone](./private-dns-getstarted-powershell.md) in Azure DNS.

Learn about DNS zones and records by visiting: [DNS zones and records overview](dns-zones-records.md).

Learn about some of the other key [networking capabilities](../networking/fundamentals/networking-overview.md) of Azure.
