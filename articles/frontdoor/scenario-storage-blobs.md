---
title: Use Azure Front Door with Azure Storage blobs - Azure Front Door | Microsoft Docs
description: This article explains how to use Front Door with storage blobs for accelerating content delivery.
services: front-door
documentationcenter: ''
author: johndowns
ms.service: frontdoor
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/28/2022
ms.author: jodowns
---

# Use Azure Front Door with Azure Storage blobs

Static content delivery is useful for many scenarios. Azure Front Door accelerates the delivery of static content from Azure Storage blobs, and enables a secure and scalable architecture.

## Architecture

<!-- TODO Arch diagram -->

In this reference architecture, you deploy a storage account and Front Door profile with a single origin.

## Dataflow

This scenario covers... Data flows through the scenario as follows:

1. The client establishes a connection to Azure Front Door by using a custom domain name. The client's connection terminates at a nearby Front Door point of presence (PoP).
1. If the Front Door PoP's cache contains a valid response for this request, Front Door returns the response immediately.
1. Otherwise, the PoP sends the request to the origin storage account, wherever it is in the world, by using Microsoft's backbone network. The PoP connects to the storage account by using a separate, long-lived, TCP connection. In this scenario, Private Link is used to securely connect to the storage account.
1. The storage account sends a response to the Front Door PoP. When the PoP receives the response, it stores it in its cache for subsequent requests.
1. The PoP returns the response to the client.

## Components

- [Azure Storage](TODO) stores the static content to be served.
- [Azure Front Door](TODO) receives inbound connections from clients, securely forwards the request to the storage account, and caches responses.

## Scenario details

Static content delivery is useful in a number of situations, including:
- Delivering images, CSS files, and JavaScript files for a web application.
- Serving files, such as PDF files or JSON files.
- Delivering non-streaming video.

By its nature, static content doesn't change frequently. Static files might also be large in size. These characteristics make it a good candidate to be cached, which improves performance and reduces the cost to serve requests.

In a complex scenario, a single Front Door profile might serve static content as well as dynamic content. You can use separate origin groups for each type of origin, and use Front Door's routing capabilities to route incoming requests to the correct origin.

## Considerations

### Scalability and performance

Azure Front Door is particularly well suited to improving the performance of serving static content. As a content delivery network (CDN), Front Door caches the content at its PoPs. When a cached copy of a response is available at a PoP, Front Door can quickly respond with the cached response. If the PoP doesn't have a valid cached response, Front Door's traffic acceleration capabilities reduce the time to serve the content from the origin.

### Security

- Custom domains
- Origin configuration
   - If security is important, Private Link is a good idea
  - You can use public IP address, but storage account firewall can't easily restrict traffic to only that which flows through your Front Door profile
- SAS tokens??
- For serving static content, managed WAF rules unlikely to be as important as for dynamic applications. However, you might want to use WAF for rate limiting or geofiltering.

### Resiliency

By using the Front Door cache, you reduce the load on your storage account. If your storage account is unavailable, Front Door might be able to continue to serve cached responses until your application recovers.

You can further improve the resiliency of the overall solution by considering the resiliency of the storage account, such as by using one of the following approaches:

- Within a single region, use zone-redundant storage to ensure multiple replicas of your data are stored in separate physical locations.
- TODO GRS
- Alternatively, you can deploy multiple storage accounts

### Cost optimisation
- Caching helps
- Standard vs. premium

## Deploy this scenario

TODO ARM template, TF

## Next steps

TODO
