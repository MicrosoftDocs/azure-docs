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
ms.date: 10/13/2017
ms.author: elioda

---
# IoT Hub high availability and disaster recovery
As a first step towards designing and implementing a resilient IoT solution, architects, developers and business owners must assess and define the desired uptime goals for the solutions being built, based on specific business objectives. In this context, the article [Azure Business Continuity Technical Guidance]( https://docs.microsoft.com/en-us/azure/architecture/resiliency/) describes a general framework to help you think about business continuity and disaster recovery. The [Disaster recovery and high availability for Azure applications][ https://msdn.microsoft.com/en-us/library/dn251004.aspx] paper provides architecture guidance on strategies for Azure applications to achieve High Availability (HA) and Disaster Recovery (DR). 
The current article discusses the HA and DR features offered by the IoT Hub service and it is strongly recommended that solution architects and developers go through the above-mentioned articles to formulate and operationalize the business continuity and disaster recovery strategy for the entire IoT solution that they are building involving multiple azure services. The broad areas discussed in this article are intra-region high availability, disaster recovery in the event of rare regional failures and an approach to achieve cross-region per-device high availability. Depending on the uptime goals you define for the solutions you are building, you should determine which of the options outlined below best suites your business objectives. Incorporating any of the below solutions into your overall business continuity and disaster recovery plans comes with a level of resiliency: operationalization cost: implementation and maintenance complexity trade-off and this needs to be carefully considered while evaluating each option.

## Intra-region HA
The IoT Hub service provides intra-region HA using redundancies within a datacenter. This is achieved using redundancies in almost all layers of the service. The SLA published by the IoT Hub service here [https://azure.microsoft.com/en-us/support/legal/sla/iot-hub/v1_2/] is achieved by leveraging these redundancies. There is no additional work required by the developers of an IoT solution to be able to take advantage of these HA features. Some azure services also provide additional layers of availability within a region (redundancies across datacenters) by integrating with availability zones [https://docs.microsoft.com/en-us/azure/availability-zones/az-overview] to further guard against power outages and networking failures in a single datacenter. There is currently no support in IoT Hub for availability zones. 
For those of you who are migrating their solutions from an on-premise solution to a cloud based solution, it is even more important to go through the articles listed at the start of this article. It is worthwhile to reiterate that migrating solutions to the cloud shifts the focus from optimizing “mean time between failures” to “mean time to recover”. Another way to say this is that transient failures are to be considered normal while operating with the cloud in the mix, and appropriate retry policies need to be built in to the components interacting with a cloud application. Heres a link to our recommendations around retries (https://channel9.msdn.com/Shows/Internet-of-Things-Show/Retry-logic-in-device-SDKs-for-Azure-IoT-Hub) 

## Cross region disaster recovery
There could be some rare situations when a datacenter experiences extended outages due to power failures or other failures involving physical assets. These are rare events during which the intra region HA mechanisms described above do not help. IoT Hub provides multiple solutions for recovering from such extended outages. 
The recovery options available to customers in such a situation are “Microsoft initiated failover” and “Manual failover”. The fundamental difference between the two is that the former is initiated by Microsoft and the latter is an option available to users to perform the failover by themselves in a self-serve manner. Manual failover also provides a lower Recovery Time Objective compared to the Microsoft initiated failover option as described in the sections below. 
The usage of any of these options to failover an IoT hub from its primary region results in the hub to become fully functional in the corresponding azure geo-paired region published in the following list [https://docs.microsoft.com/en-us/azure/best-practices-availability-paired-regions]. Both these failover options offer the following recovery point objectives (RPOs):

| Functionality | RPO |
| --- | --- |
| Service availability for registry and communication operations |The IP address of the hub changes|
| Identity data in identity registry |0-5 mins data loss |
| Device-to-cloud messages |All unread messages are lost |
| Operations monitoring messages |All unread messages are lost |
| Cloud-to-device messages |0-5 mins data loss |
| Cloud-to-device feedback queue |All unread messages are lost |
| Device twin data |0-5 mins data loss |
| Parent and device jobs |0-5 mins data loss |

## Microsoft initiated failover
This failover mechanism is exercised by Microsoft to failover all the IoT hubs from an affected region to the corresponding geo-paired region. This is a default option (no way for users to opt-out) and requires no intervention from the user where the failover process is initiated by Microsoft. This failover option has a recovery time objective (RTO) of 2-26 hours. The large RTO is because Microsoft must perform the failover operation for ALL the affected customers in that region. If you are running a less critical IoT solution which can sustain a downtime of roughly a day, it is ok for you to take a dependency on this option as a part of the overall disaster recovery goals for your IoT solution.

## Manual failover (preview)
If your business uptime goals are not satisfied by the RTO that Microsoft initiated failover provides, you should consider using “Manual failover” to trigger the failover process yourself. The RTO using this option could be anywhere between 10 minutes to a couple of hours. The RTO is currently a function of the number of devices registered against the IoT hub instance being failed over. You can expect the RTO for a hub hosting approximately 100K devices to be in the ballpark of 15 minutes.
The Manual failover option is always available for use irrespective of whether the primary region is experiencing downtime or not. Therefore, this option could potentially be used to perform planned failovers. One example usage of planned failovers is to perform periodic failover drills. A word of caution though is that a planned failover operation results in a downtime for the hub for the period defined by the RTO for this option, and also results in a guaranteed telemetry data loss. Therefore, it is recommended that you perform test drills on IoT hubs that are not being used in your production environments. You could consider setting up a test IoT hub instance to exercise the planned failover option periodically to gain confidence in your ability to get your end-to-end solutions up and running when a real disaster happens. We also DO NOT recommend Manual failover as a mechanism to permanently migrate your hub between the azure geo paired regions. Doing so would cause an increased latency for the operations being performed against the hub from devices homed in the old primary region. 

Note: Given that the underlying IP address of the IoT hub instance will change post failover, the overall time for the runtime operations interfacing with the IoT hub service to become fully operational after the failover process is triggered can be expressed using the following function

## Achieving automatic cross regional fast failover per device
If your business uptime goals are not satisfied by the RTO that either Microsoft initiated failover or Manual failover options provide, you should consider implementing a per-device automatic cross region failover mechanism. 
A complete treatment of deployment topologies in IoT solutions is outside the scope of this article. The article discusses the *regional failover* deployment model for the purpose of high availability and disaster recovery.

In a regional failover model, the solution back end runs primarily in one datacenter location. A secondary IoT hub and back end are deployed in another datacenter location. If the IoT hub in the primary datacenter suffers an outage or the network connectivity from the device to the primary datacenter is interrupted, devices use a secondary service endpoint. You can improve the solution availability by implementing a cross-region failover model instead of staying within a single region. 

At a high level, to implement a regional failover model with IoT Hub, you need the following:

* **A secondary IoT hub and device routing logic**: If service in your primary region is disrupted, devices must start connecting to your secondary region. Given the state-aware nature of most services involved, it is common for solution administrators to trigger the inter-region failover process. The best way to communicate the new endpoint to devices, while maintaining control of the process, is to have them regularly check a *concierge* service for the current active endpoint. The concierge service can be a web application that is replicated and kept reachable using DNS-redirection techniques (for example, using [Azure Traffic Manager][Azure Traffic Manager]).
* **Identity registry replication**: To be usable, the secondary IoT hub must contain all device identities that can connect to the solution. The solution should keep geo-replicated backups of device identities, and upload them to the secondary IoT hub before switching the active endpoint for the devices. The device identity export functionality of IoT Hub is useful in this context. For more information, see [IoT Hub developer guide - identity registry][IoT Hub developer guide - identity registry].
* **Merging logic**: When the primary region becomes available again, all the state and data that have been created in the secondary site must be migrated back to the primary region. This state and data mostly relate to device identities and application metadata, which must be merged with the primary IoT hub and any other application-specific stores in the primary region. To simplify this step, you should use idempotent operations. Idempotent operations minimize the side-effects from the eventual consistent distribution of events, and from duplicates or out-of-order delivery of events. In addition, the application logic should be designed to tolerate potential inconsistencies or "slightly" out-of-date state. This situation can occur due to the additional time it takes for the system to "heal" based on recovery point objectives (RPO).

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
