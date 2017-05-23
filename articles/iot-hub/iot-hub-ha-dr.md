---
title: Azure IoT Hub high availability and disaster recovery | Microsoft Docs
description: Describes the Azure and IoT Hub features that help you to build highly available Azure IoT solutions with disaster recovery capabilities.
services: iot-hub
documentationcenter: ''
author: fsautomata
manager: timlt
editor: ''

ms.assetid: ae320e58-aa20-45b9-abdc-fa4faae8e6dd
ms.service: iot-hub
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/16/2016
ms.author: elioda

---
# IoT Hub high availability and disaster recovery
As an Azure service, IoT Hub provides high availability (HA) using redundancies at the Azure region level, without any additional work required by the solution. The Microsoft Azure platform also includes features to help you build solutions with disaster recovery (DR) capabilities or cross-region availability. If you want to provide global, cross-region high availability for devices or users, design and prepare your solutions to take advantage of these Azure DR features. The article [Azure Business Continuity Technical Guidance](../resiliency/resiliency-technical-guidance.md) describes the built-in features in Azure for business continuity and DR. The [Disaster recovery and high availability for Azure applications][Disaster recovery and high availability for Azure applications] paper provides architecture guidance on strategies for Azure applications to achieve HA and DR.

## Azure IoT Hub DR
In addition to intra-region HA, IoT Hub implements failover mechanisms for disaster recovery that require no intervention from the user. IoT Hub DR is self-initiated and has a recovery time objective (RTO) of 2-26 hours, and the following recovery point objectives (RPOs).

| Functionality | RPO |
| --- | --- |
| Service availability for registry and communication operations |Possible CName loss |
| Identity data in identity registry |0-5 mins data loss |
| Device-to-cloud messages |All unread messages are lost |
| Operations monitoring messages |All unread messages are lost |
| Cloud-to-device messages |0-5 mins data loss |
| Cloud-to-device feedback queue |All unread messages are lost |

## Regional failover with IoT Hub
A complete treatment of deployment topologies in IoT solutions is outside the scope of this article. The article discusses the *regional failover* deployment model for the purpose of high availability and disaster recovery.

In a regional failover model, the solution back end runs primarily in one datacenter location, and a secondary IoT hub and back end are deployed in another datacenter location. If the IoT hub in the primary datacenter suffers an outage or the network connectivity from the device to the primary datacenter is interrupted. Devices use a secondary service endpoint whenever the primary gateway cannot be reached. With a cross-region failover capability, the solution availability can be improved beyond the high availability of a single region.

At a high level, to implement a regional failover model with IoT Hub, you need the following:

* **A secondary IoT hub and device routing logic**: In the case of a service disruption in your primary region, devices must start connecting to your secondary region. Given the state-aware nature of most services involved, it is common for solution administrators to trigger the inter-region failover process. The best way to communicate the new endpoint to devices, while maintaining control of the process, is to have them regularly check a *concierge* service for the current active endpoint. The concierge service can be a web application that is replicated and kept reachable using DNS-redirection techniques (for example, using [Azure Traffic Manager][Azure Traffic Manager]).
* **Identity registry replication** - To be usable, the secondary IoT hub must contain all device identities that can connect to the solution. The solution should keep geo-replicated backups of device identities, and upload them to the secondary IoT hub before switching the active endpoint for the devices. The device identity export functionality of IoT Hub is useful in this context. For more information, see [IoT Hub developer guide - identity registry][IoT Hub developer guide - identity registry].
* **Merging logic** - When the primary region becomes available again, all the state and data that have been created in the secondary site must be migrated back to the primary region. This state and data mostly relates to device identities and application metadata, which must be merged with the primary IoT hub and any other application-specific stores in the primary region. To simplify this step, you should use idempotent operations. Idempotent operations minimize the side-effects from the eventual consistent distribution of events, and from duplicates or out-of-order delivery of events. In addition, the application logic should be designed to tolerate potential inconsistencies or "slightly" out of date-state. This situation can occur due to the additional time it takes for the system to "heal" based on recovery point objectives (RPO).

## Next steps
Follow these links to learn more about Azure IoT Hub:

* [Get started with IoT Hubs (Tutorial)][lnk-get-started]
* [What is Azure IoT Hub?][What is Azure IoT Hub?]

[Disaster recovery and high availability for Azure applications]: ../resiliency/resiliency-disaster-recovery-high-availability-azure-applications.md
[Azure Business Continuity Technical Guidance]: https://azure.microsoft.com/documentation/articles/resiliency-technical-guidance/
[Azure Traffic Manager]: https://azure.microsoft.com/documentation/services/traffic-manager/
[IoT Hub developer guide - identity registry]: iot-hub-devguide-identity-registry.md

[lnk-get-started]: iot-hub-csharp-csharp-getstarted.md
[What is Azure IoT Hub?]: iot-hub-what-is-iot-hub.md
