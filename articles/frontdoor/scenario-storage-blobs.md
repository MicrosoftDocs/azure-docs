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

Arch diagram

In this reference architecture, you deploy a storage account and Front Door profile with a single origin.

## Scenarios

- Static content delivery, such as images, files, and non-streaming video

## Key considerations

- Traffic acceleration
- Custom domains
- Enable caching
- Security
  - Private Link is a good idea
  - Origin configuration
    - Private Link is a good idea
    - You can use public IP address, but storage account firewall can't easily restrict traffic to only that which flows through your Front Door profile
- HA and DR
  - Multi-region storage

## Next steps

TODO
