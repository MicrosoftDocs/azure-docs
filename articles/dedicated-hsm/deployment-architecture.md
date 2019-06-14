---
title: Deployment architecture - Azure Dedicated HSM | Microsoft Docs
description: Basic design considerations when using Azure Dedicated HSM as part of an application architecture
services: dedicated-hsm
author: barclayn
manager: barbkess
ms.custom: "mvc, seodec18"
ms.service: key-vault
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 03/27/2019
ms.author: barclayn

---

# Azure Dedicated HSM deployment architecture

Azure Dedicated HSM provides cryptographic key storage in Azure. It meets stringent security requirements. Customers will benefit from using Azure Dedicated HSM if they:

* Must meet FIPS 140-2 Level 3 certification
* Require that they have exclusive access to the HSM
* should have complete control of their devices

The HSMs are distributed across Microsoft’s data centers and can be easily provisioned as a pair of devices as the basis of a highly available solution. They may also be deployed across regions for a disaster resilient solution. The regions with Dedicated HSM available currently are:

* East US
* East US 2
* West US
* South Central US
* Southeast Asia
* East Asia
* North Europe
* West Europe
* UK South
* UK West
* Canada Central
* Canada East
* Australia East
* Australia Southeast

Each of these regions has HSM racks deployed in either two independent data centers or at least two independent availability zones. South East Asia has three availability zones and East US 2 has two. There is a total of eight regions across Europe, Asia, and the USA that offer the Dedicated HSM service. For more information on Azure regions, see the official  [Azure regions information](https://azure.microsoft.com/global-infrastructure/regions/).
Some design factors for any Dedicated HSM-based solution are location/latency, high availability, and support for other distributed applications.

## Device location

Optimal HSM device location is in closest proximity to the applications performing cryptographic operations. In-region latency is expected to be single-digit milliseconds. Cross-region latency could be 5 to 10 times higher than this.

## High availability

To achieve high availability, a customer must use two HSM devices in a region that are configured using Gemalto software as a high availability pair. This type of deployment ensures the availability of keys if a single device experiences a problem preventing it from processing key operations. It also significantly reduces risk when performing break/fix maintenance such as power supply replacement. It is important for a design to account for any kind of regional level failure. Regional level failures can happen when there are natural disasters such as hurricanes, floods, or earthquakes. These types of events should be mitigated by provisioning HSM devices in another region. Devices deployed in another region may be paired together via Gemalto software configuration. This means that the minimum deployment for a highly available and disaster resilient solution is four HSM devices across two regions. Local redundancy and redundancy across regions can be used as a baseline to add any further HSM device deployments to support latency, capacity or to meet other application-specific requirements.

## Distributed application support

Dedicated HSM devices are typically deployed in support of applications that need to perform key storage and key retrieval operations. Dedicated HSM devices have 10 partitions for independent application support. Device location should be based on a holistic view of all applications that need to use the service.

## Next steps

Once deployment architecture is determined, most configuration activities to implement that architecture will be provided by Gemalto. This includes device configuration as well as application integration scenarios. For more information, use the [Gemalto customer support](https://supportportal.gemalto.com/csm/) portal and download administration and configuration guides. The Microsoft partner site has a variety of integration guides.
It is recommended that all key concepts of the service, such as high availability and security for example, are well understood before device provisioning or application design and deployment.
Further concept level topics:

* [High Availability](high-availability.md)
* [Physical Security](physical-security.md)
* [Networking](networking.md)
* [Supportability](supportability.md)
* [Monitoring](monitoring.md)
