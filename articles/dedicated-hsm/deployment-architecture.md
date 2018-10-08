---
title: Azure Dedicated HSM deciding deployment architecture | Microsoft Docs
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

# Azure Dedicated HSM deciding deployment architecture

The Azure Dedicated HSM service provides a cryptographic key storage capability within Microsoft’s Azure Cloud that meets the most stringent security requirements. For customers requiring FIPS 140-2 Level 3 certification and sole access to, and complete control of the HSM devices, this would be the ideal solution.  
The HSM devices are distributed globally across Microsoft’s datacenters and can be easily provisioned as a single device, or devices distributed across regions for a highly available solution.
The regions with Dedicated HSM available currently are:

* East US
* East US 2
* West US
* South Central US
* South East Asia
* East Asia
* North Europe
* West Europe

Each of these regions has 2 independent datacenter deployments with the exception of South East Asia which has 3. That gives a total of 17 datacenters across Europe, Asia and the USA that offer the Dedicated HSM service. For more information on Azure regions please refer to the official [Azure regions information](https://azure.microsoft.com/global-infrastructure/regions/).
Deployment architecture factors for any Dedicated HSM based solution are location, which is a significant factor for application latency, high availability and support for other distributed applications,

## Device location

Optimal HSM device location is in closest proximity to the applications performing cryptographic operations.

## High availability

It is always recommended to use 2 HSM devices in a region as a high availability pair. This ensures availability of keys when a single device has an issue that impacts its ability to process key operations and significantly reduces risk when performing break/fix maintenance such as power supply replacement. In a similar way, any kind of regional level failure which could occur in the event of natural disasters such as hurricanes, flood or earthquakes, should be mitigated with HSM Devices being provisioned in another region and paired in that region. This result in a minimum deployment for a high availability solution being 4 HDM devices across 2 regions. The architectural implications of this can be used as a baseline to add any further HSM device deployments to support latency, capacity or other application specific requirements.

## Distributed application support

Dedicated HSM devices are typically deployed in support of other business applications that have need for cryptographic operations in relation to key storage and retrieval. The Dedicated HSM devices in use have available 10 partitions for independent application support and hence device location should be based on a holistic view of all applications that need support for keys.

## Next steps

Once deployment architecture is determined, most configuration activities to implement that architecture will be provided by Gemalto guidance. This includes device configuration as well as application integration scenarios. For further information please use the [Gemalto customer support](https://supportportal.gemalto.com/csm/) portal and download administration and configuration guides or the [partner site for Microsoft](https://safenet.gemalto.com/partners/microsoft/) which has a variety of integration guides.
It is recommended that all key concepts of the service, such as high availability and security for example, are well understood before and device provisioning and application design or deployment.
Further concept level topics:

* [High Availability](high-availability.md)
* [Physical Security](physical-security.md)
* [Networking](networking.md)
* [Supportability](supportability.md)
