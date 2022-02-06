---
title: Understanding the IP address of your IoT hub | Microsoft Docs
description: Understand how to query your IoT hub IP address and its properties. The IP address of your IoT hub can change during certain scenarios such as disaster recovery or regional failover.
author: eross-msft
ms.author: lizross
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 01/28/2022
---


# IoT Hub IP addresses

The IP address prefixes of IoT Hub public endpoints are published periodically under the _AzureIoTHub_ [service tag](../virtual-network/service-tags-overview.md).

> [!NOTE]
> For devices that are deployed inside of on-premises networks, Azure IoT Hub supports VNET connectivity integration with private endpoints. See [IoT Hub support for VNet](./virtual-network-support.md) for more information.


You may use these IP address prefixes to control connectivity between IoT Hub and your devices or network assets in order to implement a variety of network isolation goals:

| Goal | Applicable scenarios | Approach |
|------|-----------|----------|
| Ensure your devices and services communicate with IoT Hub endpoints only | [Device-to-cloud](./iot-hub-devguide-messaging.md), and [cloud-to-device](./iot-hub-devguide-messages-c2d.md) messaging, [direct methods](./iot-hub-devguide-direct-methods.md), [device and module twins](./iot-hub-devguide-device-twins.md) and [device streams](./iot-hub-device-streams-overview.md) | Use _AzureIoTHub_ and _EventHub_ service tags to discover IoT Hub, and Event Hub IP address prefixes and configure ALLOW rules on your devices' and services' firewall setting for those IP address prefixes accordingly; drop traffic to other destination IP addresses you do not want the devices or services to communicate with. |
| Ensure your IoT Hub device endpoint receives connections only from your devices and network assets | [Device-to-cloud](./iot-hub-devguide-messaging.md), and [cloud-to-device](./iot-hub-devguide-messages-c2d.md) messaging, [direct methods](./iot-hub-devguide-direct-methods.md), [device and module twins](./iot-hub-devguide-device-twins.md) and [device streams](./iot-hub-device-streams-overview.md) | Use IoT Hub [IP filter feature](iot-hub-ip-filtering.md) to allow connections from your devices and network asset IP addresses (see [limitations](#limitations-and-workarounds) section). | 
| Ensure your routes' custom endpoint resources (storage accounts, service bus and event hubs) are reachable from your network assets only | [Message routing](./iot-hub-devguide-messages-d2c.md) | Follow your resource's guidance on restricting connectivity (for example via [private links](../private-link/private-endpoint-overview.md), [service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md), or [firewall rules](../event-hubs/event-hubs-ip-filtering.md#trusted-microsoft-services)); For details on firewall restrictions see the [limitations](#limitations-and-workarounds) section). |

## Best practices

* The IP address of an IoT hub is subject to change without notice. To minimize disruption, use the IoT hub hostname (for example, myhub.azure-devices.net) for networking and firewall configuration whenever possible. 

* For constrained IoT systems without domain name resolution (DNS), IoT Hub IP address ranges are published periodically via service tags before changes taking effect. It is therefore important that you develop processes to regularly retrieve and use the latest service tags. This process can be automated via the [service tags discovery API](../virtual-network/service-tags-overview.md#service-tags-on-premises). Note that service tags discovery API is still in preview and in some cases may not produce the full list of tags and IP addresses. Until discovery API is generally available, consider using the [service tags in downloadable JSON format](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files). 


* Use the *AzureIoTHub.[region name]* tag to identify IP prefixes used by IoT Hub endpoints in a specific region. To account for datacenter disaster recovery, or [regional failover](iot-hub-ha-dr.md) ensure connectivity to IP prefixes of your IoT Hub's geo-pair region is also enabled.

* Setting up firewall rules in IoT Hub may block off connectivity needed to run Azure CLI and PowerShell commands against your IoT Hub. To avoid this, you can add ALLOW rules for your clients' IP address prefixes to re-enable CLI or PowerShell clients to communicate with your IoT Hub.

* When adding ALLOW rules in your devices' firewall configuration, it is best to provide specific [ports used by applicable protocols](./iot-hub-devguide-protocols.md#port-numbers).

## Limitations and workarounds

* IoT Hub IP filter feature has a limit of 100 rules. This limit and can be raised via requests through Azure Customer Support. 

* Your configured [IP filtering rules](iot-hub-ip-filtering.md) by default are only applied on your IoT Hub IP endpoints and not on your IoT hub's built-in Event Hub endpoint. If you also require IP filtering to be applied on the Event Hub where your messages are stored, you may do so by selecting the "Apply IP filters to the built-in endpoint" option in the IoT Hub Network settings. You may also do so by bringing your own Event Hub resource where you can configure your desired IP filtering rules directly. To do so, you need to provision your own Event Hub resource and set up [message routing](./iot-hub-devguide-messages-d2c.md) to send your messages to that resource instead of your IoT Hub's built-in Event Hub. 

* IoT Hub Service Tags only contain IP ranges for inbound connections. To limit firewall access on other Azure services to data coming from IoT Hub Message Routing, please choose the appropriate "Allow Trusted Microsoft Services" option for your service (e.g. [Event Hub](../event-hubs/event-hubs-ip-filtering.md#trusted-microsoft-services), [Service Bus](..//service-bus-messaging/service-bus-service-endpoints.md#trusted-microsoft-services), [Azure Storage](../storage/common/storage-network-security.md#grant-access-to-trusted-azure-services)).

## Support for IPv6 

IPv6 is currently not supported on IoT Hub.
