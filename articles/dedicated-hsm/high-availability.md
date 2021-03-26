---
title: High availability - Azure Dedicated HSM | Microsoft Docs
description: Learn about basic considerations for Azure Dedicated HSM high availability. This article includes an example.
services: dedicated-hsm
author: msmbaldwin
manager: rkarlin
ms.custom: "mvc, seodec18"
ms.service: key-vault
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
<<<<<<< HEAD
ms.date: 03/25/2021
ms.author: keithp
=======
ms.date: 01/15/2021
ms.author: mbaldwin
>>>>>>> df4a6bd2135429d57fac83f03cea91eeeb43fd4d

---
# Azure Dedicated HSM high availability

Azure Dedicated HSM is underpinned by Microsoft’s highly available datacenters. However, any highly available datacenter is vulnerable to localized failures and in extreme circumstances, regional level failures. Microsoft deploys HSM devices in different datacenters within a region to ensure provisioning multiple devices does not lead to those devices sharing a single rack. A further level of high availability can be achieved by pairing these HSMs across the datacenters in a region using the Thales HA Group feature. It is also possible to pair devices across regions to address regional failover in a disaster recovery situation. With this multi-layered high availability configuration, any device failure will be automatically addressed to keep applications working. All datacenters also have spare devices and components on-site so any failed device can be replaced in a timely fashion.

## High availability example

<<<<<<< HEAD
Information on how to configure HSM devices for high availability at the software level is in the 'Thales Luna 7 HSM Administration Guide'. This document is available at the  [Thales HSM Page](https://cpl.thalesgroup.com/encryption/hardware-security-modules/network-hsms).
=======
Information on how to configure HSM devices for high availability at the software level is in the 'Thales Luna 7 HSM Administration Guide'. This document is available at the  [Thales HSM Page](https://thalesdocs.com/gphsm/Content/luna/network/luna_network_releases.htm).
>>>>>>> df4a6bd2135429d57fac83f03cea91eeeb43fd4d

The following diagram shows a highly available architecture. It uses multiple devices in region and multiple devices paired in a separate region. This architecture uses a minimum of four HSM devices and virtual networking components.

![High availability diagram](media/high-availability/high-availability.png)

## Next steps

It is recommended that all key concepts of the service, such as high availability and security, are well understood before device provisioning and application design or deployment.
Further concept level topics:

* [Deployment Architecture](deployment-architecture.md)
* [Physical Security](physical-security.md)
* [Networking](networking.md)
* [Supportability](supportability.md)
* [Monitoring](monitoring.md)

<<<<<<< HEAD
For specific details on configuring HSM devices for high availability, please refer to the [Thales customer support portal](https://supportportal.thalesgroup.com/csm) for the Administrator Guides and see section 6.
=======
For specific details on configuring HSM devices for high availability, please refer to the Thales Customer Support Portal for the Administrator Guides and see section 6.
>>>>>>> df4a6bd2135429d57fac83f03cea91eeeb43fd4d
