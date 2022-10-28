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

## Architecture

<!-- TODO Arch diagram -->

In this reference architecture, you deploy a storage account and Front Door profile with a single origin.

## Dataflow

- Client to Front Door
- Front Door serves from cache if available
- Front Door sends to storage account
- Storage account sends response to Front Door
- Front Door caches response
- Front Door returns response to client

## Components

- Storage account and blob container
- Front Door profile

## Scenario details

- Static content delivery, such as images, PDF files, JSON files, and non-streaming video
- Caching is important

## Considerations

### Scalability and performance
- Traffic acceleration
- Caching

### Security
- Custom domains
- Origin configuration
   - If security is important, Private Link is a good idea
  - You can use public IP address, but storage account firewall can't easily restrict traffic to only that which flows through your Front Door profile
- SAS tokens??
- For serving static content, managed WAF rules unlikely to be as important as for dynamic applications. However, you might want to use WAF for rate limiting or geofiltering.

### Resiliency
- Zone-redundant storage
- Multi-region storage

### Cost optimisation
- Caching helps
- Standard vs. premium

## Deploy this scenario

TODO ARM template, TF

## Next steps

TODO
