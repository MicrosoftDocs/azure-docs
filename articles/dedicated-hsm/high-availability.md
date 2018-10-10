---
title: Azure Dedicated HSM high availability | Microsoft Docs
description: Azure Dedicated HSM provides key storage capabilities within Azure that meets FIPS 140-2 Level 3 certification
services: key-vault
author: barclayn
manager: mbaldwin

ms.service: key-vault
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 10/10/2018
ms.author: barclayn

---
# Azure Dedicated HSM High Availability

Azure Dedicated HSM has redundant power, cooling, and network access. However, any highly available datacenter is vulnerable to localized and regional level failures. Microsoft deploys HSM devices in different availability zones within a region. It also makes available HSM devices in other regions. High availability can be achieved by pairing these HSMs across availability zones within a region. It is also possible to pair devices across regions. With this high-availability configuration, any device failure will be automatically addressed to keep applications working. All datacenters have spare devices and spare components on site so any failed device can be replaced in a timely fashion.

Information on how to configure HSM devices for high availability is in the 'Gemalto Luna network HSM Administration Guide'. This document is available on the [Gemalto Customer Support Portal](https://supportportal.gemalto.com/csm/).

The following diagram shows a highly available architecture. It uses multiple devices in region and multiple devices paired in a separate region. This architecture uses a minimum of four HSM devices and virtual networking components.

![High availability diagram](media/high-availability/high-availability.png)

## Next steps

It is recommended that all key concepts of the service, such as high availability and security, are well understood before device provisioning and application design or deployment.
Further concept level topics:

* [Deployment Architecture](deployment-architecture.md)
* [High Availability](high-availability.md)
* [Physical Security](physical-security.md)
* [Networking](networking.md)
* [Supportability](supportability.md)

For specific details on configuring HSM devices for high availability, please refer to the Gemalto Customer Support Portal for the Administrator Guides and see section 6.
