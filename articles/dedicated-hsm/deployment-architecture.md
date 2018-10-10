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
ms.date: 10/10/2018
ms.author: barclayn

---

# Azure Dedicated HSM deciding deployment architecture

Dedicated HSM provides cryptographic key storage capabilities in Azure. It meets the most stringent security requirements. Customers who need:

* To meet FIPS 140-2 Level 3 certification
* to have exclusive access
* complete control of their devices

will benefit from using Azure Dedicated HSM.

The HSMs are distributed across Microsoft’s datacenters and can be easily provisioned as a single device. They may also be deployed across regions for a highly available solution.
The regions with Dedicated HSM available currently are:

* East US
* East US 2
* West US
* South Central US
* South East Asia
* East Asia
* North Europe
* West Europe

Each of these regions has two independent datacenters. One exception is South East Asia, which has 3. There are a total of 17 datacenters across Europe, Asia, and the USA that offer the Dedicated HSM service. For more information on Azure regions, see the official [Azure regions information](https://azure.microsoft.com/global-infrastructure/regions/).
Some design factors for any Dedicated HSM-based solution are location, high availability, and support for other distributed applications. Location is a significant factor for application latency,

## Device location

Choose an HSM location as close as possible to the applications performing cryptographic operations.

## High availability

It is always recommended to use two HSM devices in a region as a high availability pair. This ensures availability of keys when a single device has an issue that impacts its ability to process key operations. It also significantly reduces risk when performing break/fix maintenance such as power supply replacement. It is important for a design to account for any kind of regional level failure. Regional level failures may occur in the event of natural disasters such as hurricanes, flood, or earthquakes. These types of events should be mitigated by provisioning HSM Devices in another region. Devices deployed in another region may be paired together. This means that the minimum deployment for a highly available solution is four HDM devices across two regions. Local redundancy and redundancy across regions can be used as a baseline to add any further HSM device deployments to support latency, capacity or to meet other application-specific requirements.

## Distributed application support

Dedicated HSM devices are typically deployed in support of applications that need to perform key storage and key retrieval operations. Dedicated HSM devices have 10 partitions for independent application support. Device location should be based on a holistic view of all applications that need to use the service.

## Next steps

Once deployment architecture is determined, most configuration activities to implement that architecture will be provided by Gemalto guidance. This includes device configuration as well as application integration scenarios. For further information please use the [Gemalto customer support](https://supportportal.gemalto.com/csm/) portal and download administration and configuration guides or the [partner site for Microsoft](https://safenet.gemalto.com/partners/microsoft/) which has a variety of integration guides.
It is recommended that all key concepts of the service, such as high availability and security for example, are well understood before and device provisioning and application design or deployment.
Further concept level topics:

* [High Availability](high-availability.md)
* [Physical Security](physical-security.md)
* [Networking](networking.md)
* [Supportability](supportability.md)
