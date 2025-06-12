---
title: Retrieve the current POP IP list for Azure Content Delivery Network| Microsoft Docs
description: Learn how to get POP servers by using the REST API. POP servers make requests to origin servers associated with Azure Content Delivery Network endpoints.
services: cdn
author: halkazwini
ms.author: halkazwini
manager: kumudd
ms.service: azure-cdn
ms.topic: how-to
ms.date: 03/31/2025
ROBOTS: NOINDEX
---

# Retrieve the current POP IP list for Azure Content Delivery Network

[!INCLUDE [Azure CDN from Microsoft (classic) retirement notice](../../includes/cdn-classic-retirement.md)]

<a name='retrieve-the-current-microsoft-pop-ip-list-for-azure-cdn'></a>

## Retrieve the current Microsoft POP IP list for Azure Content Delivery Network

To lock down your application to accept traffic only from point of presence (POP) servers utilized by Microsoft's content delivery network (CDN) offerings (**Azure Front Door**, **Azure Front Door Classic**, or **Azure CDN from Microsoft**), you need to set up IP access control lists (ACLs) for your backend. You might also restrict the set of accepted values for the header 'X-Forwarded-Host' sent by Azure Content Delivery Network from Microsoft. These steps are detailed as followed:

Configure IP ACLing for your backends to accept traffic from Azure Content Delivery Network from Microsoft's backend IP address space and Azure's infrastructure services only.

To configure Microsoft's backend IP ranges with Azure Content Delivery Network from Microsoft, use the AzureFrontDoor.Backend [service tag](../virtual-network/service-tags-overview.md). For a complete list, see [IP Ranges and Service tags](https://www.microsoft.com/en-us/download/details.aspx?id=56519) for Microsoft services.

## Typical use case

For security purposes, you can use this IP list to enforce that requests to your origin server are made only from a valid Azure CDN POP. For example, if someone discovered the hostname or IP address for a content delivery network endpoint's origin server, one could make requests directly to the origin server, therefore bypassing the scaling and security capabilities provided by Azure Content Delivery Network. By setting the IPs in the returned list as the only allowed IPs on an origin server, this scenario can be prevented. To ensure that you have the latest POP list, retrieve it at least once a day.

## Next steps

For information about the REST API, see [Azure Content Delivery Network REST API](/rest/api/cdn/).
