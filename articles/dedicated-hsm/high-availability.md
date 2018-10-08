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
ms.date: 10/08/2018
ms.author: barclayn

---
# Azure Dedicated HSM High Availability

The Azure Dedicated HSM service is inherently highly available in terms of power, cooling and network access as a result of being deployed across Microsoft’s global datacenters. However, any highly available datacenter is susceptible to localized and regional level failure. For this reason, Microsoft deploys HSM devices in different availability zones within a region, and also makes available HSM devices within other regions. Using Gemalto software, software level high availability can be achieved by pairing these HSM devices, firstly across availability zones within a region and secondly across regions. With this full high-availability configuration, any device failure will be automatically catered to in software in terms of continued operation of the application. All datacenters have spare device capacity in-rack and spare components on site therefore any failed device can be replaced in a timely fashion.

Please refer to the Gemalto Luna Network HSM Administration Guide section 6 for more details on configuring HSM devices for high availability. This document is available on the [Gemalto Customer Support Portal](https://supportportal.gemalto.com/csm/).

The following diagram depicts a typical high-availability architecture with multiple device in region and multiple devices pair in a separate region. The implication of the architecture is a minimum of 4 HSM devices in any customer solution as well as required virtual networking components.

![High availability diagram](media/high-availability/high-availability.png)

## Next steps

It is recommended that all key concepts of the service, such as high availability and security for example, are well understood before and device provisioning and application design or deployment.
Further concept level topics:

* [Deployment Architecture](deployment-architecture.md)
* [High Availability](high-availability.md)
* [Physical Security](physical-security.md)
* [Networking](networking.md)
* [Supportability](supportability.md)

For specific details on configuring HSM devices for high availability, please refer to the Gemalto Customer Support Portal for the Administrator Guides and see section 6.
