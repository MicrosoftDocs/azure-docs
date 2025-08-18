---
title: Understanding the IP address of your IoT hub | Microsoft Docs
description: Understand how to query your IoT hub IP address and its properties. The IP address of your IoT hub can change during certain scenarios such as disaster recovery or regional failover.
author: SoniaLopezBravo
ms.author: sonialopez
ms.service: azure-iot-hub
services: iot-hub
ms.topic: concept-article
ms.date: 05/22/2025
---


# IoT Hub IP addresses

The IP address prefixes of IoT Hub public endpoints are published periodically under the _AzureIoTHub_ [service tag](../virtual-network/service-tags-overview.md).

> [!NOTE]
> For devices that are deployed inside of on-premises networks, Azure IoT Hub supports virtual network connectivity integration with private endpoints. For more information, see [IoT Hub support for virtual networks with Azure Private Link](./virtual-network-support.md).

You can use these IP address prefixes to control connectivity between IoT Hub and your devices or network assets in order to implement various network isolation goals:

| Goal | Applicable scenarios | Approach |
|------|-----------|----------|
| Ensure your devices and services communicate with IoT Hub endpoints only | [Device-to-cloud](./iot-hub-devguide-messaging.md) and [cloud-to-device](./iot-hub-devguide-messages-c2d.md) messaging, [direct methods](./iot-hub-devguide-direct-methods.md), [device and module twins](./iot-hub-devguide-device-twins.md), and [device streams](./iot-hub-device-streams-overview.md) | Use the _AzureIoTHub_ service tag to discover IoT Hub IP address prefixes, then configure ALLOW rules on the firewall setting of your devices and services for these IP address prefixes. Traffic to other destination IP addresses is dropped. |
| Ensure your IoT Hub device endpoint receives connections only from your devices and network assets | [Device-to-cloud](./iot-hub-devguide-messaging.md) and [cloud-to-device](./iot-hub-devguide-messages-c2d.md) messaging, [direct methods](./iot-hub-devguide-direct-methods.md), [device and module twins](./iot-hub-devguide-device-twins.md), and [device streams](./iot-hub-device-streams-overview.md) | Use IoT Hub [IP filter feature](iot-hub-ip-filtering.md) to allow connections from your devices and network asset IP addresses. For details on restrictions, see the [Limitations and workarounds](#limitations-and-workarounds) section. |
| Ensure your routes' custom endpoint resources (storage accounts, service bus, and event hubs) are reachable from your network assets only | [Message routing](./iot-hub-devguide-messages-d2c.md) | Follow your resource's guidance on restricting connectivity; for example, via [private links](../private-link/private-endpoint-overview.md), [service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md), or [firewall rules](../event-hubs/event-hubs-ip-filtering.md#trusted-microsoft-services). For details on firewall restrictions, see the [Limitations and workarounds](#limitations-and-workarounds) section. |

## Best practices

* The IP address of an IoT hub is subject to change without notice. To minimize disruption, use the IoT hub hostname (for example, myhub.azure-devices.net) for networking and firewall configuration whenever possible.

* For constrained IoT systems without domain name resolution (DNS), IoT Hub IP address ranges are published periodically via service tags before changes take effect. It’s therefore important that you develop processes to regularly retrieve and use the latest service tags. This process can be automated via the [service tags discovery API](../virtual-network/service-tags-overview.md#service-tags-on-premises) or by reviewing [service tags in downloadable JSON format](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files).

* Use the _AzureIoTHub.[region name]_ tag to identify IP prefixes used by IoT Hub endpoints in a specific region. To account for datacenter disaster recovery or regional failover, ensure connectivity to IP prefixes of your IoT hub's geo-pair region is also enabled. For more information, see [Reliability in Azure IoT Hub](/azure/reliability/reliability-iot-hub).

* Setting up firewall rules in IoT Hub might block off connectivity needed to run Azure CLI and PowerShell commands against your IoT hub. To avoid blocking connectivity, you can add ALLOW rules for your clients' IP address prefixes to re-enable CLI or PowerShell clients to communicate with your IoT hub.

* When adding ALLOW rules in your devices' firewall configuration, it’s best to provide specific [ports used by applicable protocols](./iot-hub-devguide-protocols.md#port-numbers).

## Limitations and workarounds

* IoT Hub IP filter feature has a limit of 100 rules. This limit and can be raised via requests through Azure Customer Support.

* By default, your configured [IP filtering rules](iot-hub-ip-filtering.md) are only applied on your IoT Hub IP endpoints and not on your IoT hub's built-in event hub endpoint. If you also require IP filtering to be applied on the event hub where your messages are stored, you can select the "Apply IP filters to the built-in endpoint?" option in the Networking settings for your IoT hub. You can do the same thing by using your own Event Hubs resource where you can configure your desired IP filtering rules directly. In this case, you need to provision your own Event Hubs resource and set up [message routing](./iot-hub-devguide-messages-d2c.md) to send your messages to that resource instead of your IoT hub's built-in event hub.

* IoT Hub service tags only contain IP ranges for inbound connections. To limit firewall access on other Azure services to data coming from IoT Hub message routing, choose the appropriate "Allow Trusted Microsoft Services" option for your service; for example, [Event Hubs](../event-hubs/event-hubs-ip-filtering.md#trusted-microsoft-services), [Service Bus](..//service-bus-messaging/service-bus-service-endpoints.md#trusted-microsoft-services), or [Azure Storage](../storage/common/storage-network-security.md#grant-access-to-trusted-azure-services).

## Support for IPv6

IPv6 is currently not supported on IoT Hub.
