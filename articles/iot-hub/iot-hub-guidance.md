<properties
 pageTitle="Azure IoT Hub Guidance | Microsoft Azure"
 description="A collection of guidance topics for solutions using Azure IoT Hub."
 services="iot-hub"
 documentationCenter=".net"
 authors="fsautomata"
 manager="kevinmil"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="tbd"
 ms.date="09/29/2015"
 ms.author="elioda"/>

# Azure IoT Hub - Guidance

## Comparison: IoT Hub and Event Hubs
One of the main use cases for Azure IoT Hub is to gather telemetry from devices. For this reason, IoT Hub is often compared to [Event Hubs], which is an event processing service that provides event and telemetry ingress to the cloud at massive scale, with low latency and high reliability.

The services, however, have many differences, that are detailed in the following sections.

| Area | IoT Hub | Event Hubs |
| ---- | ------- | ---------- |
| Communication patterns | Device-to-cloud event ingress and cloud-to-device messaging. | Only event ingress (usually considered for device-to-cloud scenarios). |
| Security | Per-device identity and revocable access control. Refer to [IoT Hub Developer Guide - Security]. | Event Hub-wide [Shared Access Policies][Event Hub - security], with limited revocation support using [publisher's policies][Event Hub publisher policies]. In the context of IoT solutions, it is often required to implement custom solution to support per-device credentials, and anti-spoofing measures. |
| Scale | IoT Hubs is optimized to support millions of simultaneously connected devices. | Event Hubs can support a more limited number of simultaneous connections: up to 5.000 AMQP connection, as per [Service Bus Quotas]. On the other hand, Event Hubs lets users specify the partition for each message sent. |
| Device SDKs | IoT Hub provides [device SDKs][Azure IoT Hub SDKs] for a large variety of platforms and languages | Event Hubs is supported on .NET, C, and provides AMQP and HTTP send interfaces. |

In conclusion, even if the only use case is device-to-cloud telemetry ingress, IoT Hub provides a service that is specifically designed for IoT device connectivity, and will continue to expand the value propositions for these scenarios with IoT-specific features. Event Hubs is designed for event ingress at massive scale, both in the context of inter and intra-data center scenarios.
It is not uncommon to use IoT Hub and Event Hubs in conjunction, letting the former handle the device-to-cloud communication, and the latter later-stage event ingress into real-time processing engines.

## Device provisioning <a id="provisioning"></a>
IoT solutions maintain device information in many different systems and stores, the [IoT Hub's identity registry][IoT Hub Developer Guide - identity registry] is one of them, among other stores which maintain application-specific device information. We call *provisioning* the process of creating the required device information in all of these systems.

There are many requirements and strategies for device provisioning (refer to [IoT Hub device management guidance] for more information). The [IoT Hub identity registry][IoT Hub Developer Guide - identity registry] provides the APIs you need for integrating IoT Hub in your provisioning process.

## Field gateways <a id="fieldgateways"></a>
A field gateway is a specialized device-appliance or general-purpose software that acts as a communication enabler and potentially, as a local device control system and device data processing hub. A field gateway, can perform local processing and control functions towards the devices; on the other side it can filter or aggregate the device telemetry and thus reduce the amount of data being transferred to the backend.

A field gateway’s scope includes the field gateway itself and all devices that are attached to it. As the name implies, field gateways act outside dedicated data processing facilities and are usually location bound.
A field gateway is different from a mere traffic router in that it has an active role in managing access and information flow. This means it is an application-addressed entity and network connection or session terminal (for example, gateways in this context may assist in device provisioning, data transformation, protocol translation and event rules processing). NAT devices or firewalls, in contrast, do not qualify as field gateways since they are not explicit connection or session terminals, but rather route (or deny) connections or sessions made through them.

### Transparent vs opaque field gateways
With respect to device identities, field gateway are called *transparent* if other devices in its scope have device identity entries in the IoT hub's identity registry. They are called *opaque* in case the only identity in the IoT hub's identity registry is the identity of the field gateway.

It is important to note that using *opaque* gateways prevents IoT Hub from providing [device identity anti-spoofing][IoT Hub Developer Guide - Anti-spoofing]. Moreover, since all the devices in the field gateway's scope are represented as a single device in the IoT hub, they will be subject to throttles and quotas as a single device.

### Other considerations

When implementing a field gateway you can use the Azure IoT device SDKs. Some SDKs provide field gateway-specific functionality such as the ability to multiplex multiple devices communication on the same connection to IoT Hub. As explained in [IoT Hub Developer Guide - Choosing your communication protocol], you should avoid using HTTP/1 as a transport protocol for field gateways.

## Using custom device authentication schemes/services. <a id="customauth"></a>
Azure IoT Hub allows to configure per-device security credentials and access control through the use of the [device identity registry][IoT Hub Developer Guide - identity registry].
If an IoT solution, already has significant investment in a custom device identity registry and/or authentication scheme, it can still take advantage of other IoT Hub's features by creating a *token service* for IoT Hub.

The token service, is a self-deployed cloud service, which uses an IoT Hub Shared Access Policy with **DeviceConnect** permissions to create *device-scoped* tokens.

  ![][img-tokenservice]

Here are the main steps of the token service pattern.

1. Create an [IoT Hub Shared Access Policy][IoT Hub Developer Guide - Security] with **DeviceConnect** permissions for your IoT hub. This policy will be used by the token service to sign the tokens.
2. When a device wants to access the IoT hub, it requests your token service a signed token. The device can use your custom device identity registry/authentication scheme.
3. The token service returns a token, created as per [IoT Hub Developer Guide - Security], using `/devices/{deviceId}` as `resourceURI`, with `deviceId` being the device being authenticated.
4. The device uses the token directly with the IoT hub.

The token service can set the token expiration as desired. At expiration the IoT hub will server the connection, and the device will have to request a new token to the token service. Clearly a short expiration time will increase the load on both the device and the token service.

It is worth specifying that the device identity still has to be created in the IoT hub, for the device to be able to connect. This also means that per-device access control (by disabling device identities as per [IoT Hub Developer Guide - identity registry], is still functional, even if the device authenticates with a token. This mitigates the existence of long lasting tokens.

### Comparison with a custom gateway
The token service pattern is the recommended way to implement a custom identity registry/authentication scheme with IoT Hub, as it lets IoT Hub handle most of the solution traffic. There are cases, though, where the custom authentication scheme is so intertwined with the protocol (e.g. [TLS-PSK]) that a service processing all the traffic (*custom gateway*) is required. Refer to the [Protocol Gateway] article for more information.

## Scaling IoT Hub
IoT Hub can support up to a million simultaneously connected devices by increasing the number of IoT Hub S1 or S2 units to 2.000. Refer to [IoT Hub Pricing][lnk-pricing] for more information.

Each IoT Hub unit allows a certain number of device identities in the registry, which can all be simultaneously connected, and a number of daily messages.

In order to properly scale your solution you have to consider your particular use of IoT Hub. In particular, consider the required peak throughput for the following categories of operations:

* Device to cloud messages
* Cloud to device messages
* Identity registry operations

In addition to this throughput information, please remember to refer to the [IoT Hub Quotas and Throttles] and design your solution accordingly.

### Device to cloud and cloud-to-device message throughput
The best way to size an IoT Hub solution is to evaluate the traffic on a per-device basis.

Device-to-cloud messages follow these sustained throughput guidelines.

| Tier | Sustained throughput | Sustained send rate |
| ---- | -------------------- | ------------------- |
| S1 | up to 8kb/hour per device | average of 4 messages/hour per device |
| S2 | up to 4kb/min per device | average of 2 messages/min per device |

When receiving device-to-cloud messages the application back-end can expect the following maximum throughput (across all readers).

| Tier | Sustained throughput |
| ---- | -------------------- |
| S1 | up to 120 Kb/min per unit, with 2 Mb/s minimum. |
| S2 | up to 4 Mb/min per unit, with 2 Mb/s minimum |

Cloud to device messages performance scales per device, with each device receiving up to 5 messages per minute.

### Identity registry operation throughput
IoT Hub identity registry operations are not supposed to be runtime operations, as they are mostly related to device provisioning.
Refer to [IoT Hub Quotas and Throttles] for specific burst performance numbers.

### Sharding
While a single IoT hub can scale to millions of devices, sometimes your solution requires specific performance characteristics that a single IoT Hub cannot guarantee. In that case, it is recommended to partition your devices in multiple IoT hubs, in order to smooth traffic bursts, and obtain the required throughput or operation rates required.

## High availability and disaster recovery
As an Azure service, IoT Hub provides high availability (HA) using redundancies at the Azure region level, without any additional work required by the solution. In addition, Azure offers a number of features that help to build solutions with disaster recovery (DR) capabilities or cross-region availability if required. Solutions need to be designed and prepared to take advantage of those features in order to provide global, cross-region high availability to devices or user. The article [Azure Business Continuity Technical Guidance] describes Azure built-in features for business continuity and DR. The paper [Disaster Recovery and High Availability for Azure Applications] provides architecture guidance on strategies for Azure applications to achieve HADR.

## Regional failover with IoT Hub
A complete treatment of deployment topologies in IoT solutions is outside the scope of this section, but, for the purpose of high availability and disaster recovery we will consider the *regional failover* deployment model.

In a regional failover model, the solution backend will be running primarily in one datacenter location, but an additional IoT hub and backend will be deployed in an additional datacenter region for failover purposes, in case the IoT hub in the primary datacenter suffers an outage or should the network connectivity from the device to the primary datacenter be somehow interrupted. Devices use a secondary service endpoint whenever the primary gateway cannot be reached. With a cross-region failover capability, the solution availability can be improved beyond the high availability of a single region.

At a high level, in order to implement a regional failover model with IoT Hub, you will need the following.

* **A secondary IoT hub and device routing logic** - In case of a service disruption in your primary region, devices need to start connecting to your secondary region. Given the statefulness of most services involved, it is common for solution administrators to trigger the inter-region failover process. The best way to communicate the new endpoint to devices, while maintaining control of the process, is have them regularly check a *concierge* service for the current active endpoint. The concierge service can be a simple web application that is replicated and kept reachable using DNS-redirection techniques (e.g. using [Azure Traffic Manager]).
* **Identity registry replication** - In order to be usable, the secondary IoT hub will need to contain all device identities that have to be able to connect to the solution. The solution should keep geo-replicated backups of devcies identities, and upload them to the secondary IoT hub before switching the active endpoint for the devices. The device identity export functionality of IoT Hub is very useful in this context, [IoT Hub Developer Guide - identity registry].
* **Merging logic** - When the primary region becomes available again, all the state and data that has been created in the secondary site has to be migrated back to the primary region. This mostly relates to device identities and application meta-data, which will have to be merged with the primary IoT hub and likely other application-specific stores in the primary region. To simplify this step, it is usually recommended to use idempotent operations. This minimizes side-effects not only from eventual consistent distribution of events, but also from duplicates or out-of-order delivery of events. In addition, the application logic should be design to be able to tolerate potential inconsistencies or “slightly” out of date-state, because of the additional time it takes for the system to “heal” or based on recovery point objectives (RPO). The following article provides more guidance on this topic: [Failsafe: Guidance for Resilient Cloud Architectures].




[img-tokenservice]: media/iot-hub-guidance/tokenservice.png

[IoT Hub Developer Guide - identity registry]: iot-hub-devguide.md#identityregistry
[IoT Hub Developer Guide - Choosing your communication protocol]: iot-hub-devguide.md#amqpvshttp
[IoT Hub Developer Guide - Security]: iot-hub-devguide.md#security
[IoT Hub Developer Guide - Anti-spoofing]: iot-hub-devguide.md#antispoofing
[Protocol Gateway]: iot-hub-protocol-gateway.md
[IoT Hub Quotas and Throttles]: iot-hub-devguide.md#throttling

[IoT Hub device management guidance]: iot-hub-device-management.md
[Event Hubs]: ../event-hubs/event-hubs-what-is-event-hubs/
[Azure Traffic Manager]: https://azure.microsoft.com/documentation/services/traffic-manager/
[Event Hub - security]: ../event-hubs/event-hubs-authentication-and-security-model-overview/
[Event Hub publisher policies]: ../event-hubs-overview/#common-publisher-tasks
[Service Bus Quotas]: ../service-bus/service-bus-quotas/
[Azure IoT Hub SDKs]: https://github.com/Azure/azure-iot-sdks/blob/master/readme.md

[TLS-PSK]: https://tools.ietf.org/html/rfc4279

[Azure Business Continuity Technical Guidance]: https://msdn.microsoft.com/library/azure/hh873027.aspx
[Disaster Recovery and High Availability for Azure Applications]: https://msdn.microsoft.com/library/azure/dn251004.aspx
[Failsafe: Guidance for Resilient Cloud Architectures]: https://msdn.microsoft.com/library/azure/jj853352.aspx

[lnk-pricing]: https://azure.microsoft.com/pricing/details/iot-hub
