---
title: Understanding the IP address of your IoT hub | Microsoft Docs
description: Understand how to query your IoT hub IP address and its properties. The IP address of your IoT hub can change during certain scenarios such as disaster recovery or regional failover.
author: philmea
ms.author: philmea
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 11/21/2019
---

# IoT Hub IP addresses

The IP address prefixes of IoT Hub public endpoints are published periodically under the _AzureIoTHub_ [service tag](../virtual-network/service-tags-overview.md). You may use these IP address prefixes to control connectivity between IoT Hub and your devices or network assets in order to implement a variety of network isolation goals:

| Goal | Applicable scenarios | Approach |
|------|-----------|----------|
| Ensure your devices communicate with IoT Hub endpoints only | [Device-to-cloud](./iot-hub-devguide-messaging.md), and [cloud-to-device](./iot-hub-devguide-messages-c2d.md) messaging, [direct methods](./iot-hub-devguide-direct-methods.md), [device/module twins](./iot-hub-devguide-device-twins.md) and [device streams](./iot-hub-device-streams-overview.md) | Use _AzureIoTHub_ service tags to discover IoT Hub IP address prefixes and add ALLOW rules on your devices' firewall for those IP prefixes accordingly; drop traffic to other destination IP's you do not want the device to communicate with. |
| Ensure your IoT Hub device endpoint receives connections only from your devices and network assets | [Device-to-cloud](./iot-hub-devguide-messaging.md), and [cloud-to-device](./iot-hub-devguide-messages-c2d.md) messaging, [direct methods](./iot-hub-devguide-direct-methods.md), [device/module twins](./iot-hub-devguide-device-twins.md) and [device streams](./iot-hub-device-streams-overview.md) | Use IoT Hub [IP filter feature](iot-hub-ip-filtering.md) to allow connections from your devices and networks asset IP's (see [limitations](#limitations-and-workarounds) section). |
| Ensure your routes' custom endpoint resources (storage accounts, service bus or event hubs) are reachable from your network assets only | [Message routing](./iot-hub-devguide-messages-d2c.md) | Follow your resource's guidance on restrict connectivity (for example via [firewall rules](../storage/common/storage-network-security.md), [private links](../private-link/private-endpoint-overview.md), or [service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md)); use _AzureIoTHub_ service tags to discover IoT Hub IP address prefixes and add ALLOW rules for those IP prefixes on your resource's firewall configuration (see [limitations](#limitations-and-workarounds) section). |



## Best practices

* When adding ALLOW rules in your devices' firewall, it is best to provide specific [ports used by each protocol](./iot-hub-devguide-protocols.md#port-numbers).

* The IP address prefixes of IoT hub are subject to change. These changes are published periodically via service tags before taking effect. It is therefore important that you develop processes to regularly retrieve and use the latest service tags. This process can be automated via the [service tags discovery API](../virtual-network/service-tags-overview.md#service-tags-in-on-premises).

* Use the *AzureIoTHub.[region name]* tag to identify IP prefixes used by IoT hub endpoints in a specific region. To account for datacenter disaster recovery, or [regional failover](iot-hub-ha-dr.md) ensure connectivity to IP prefixes of your IoT Hub's geo-pair region is also enabled.


## Limitations and workarounds

* IoT Hub firewall has a limit of 10 rules. This limit and can be raised via requests through Azure Customer Support. 

* IP filtering rules are only enforced on your IoT Hub endpoint, and not your hub's built-in Event Hub. If you intend to enforce IP filtering on the event hub as well, you may do so only by provisioning your own event hub and setting up IP filtering rules on your event hub resource directly. In that case, ensure that you also allow connectivity from IP address prefixes of IoT Hub in your region (and its region-pair) to your event hub resource.

* When routing to a storage account, allowing traffic from IoT Hub's IP address prefixes is only possible when the storage account is in a different region as your IoT Hub.

## Support for IPv6 

IPv6 is currently not supported on IoT Hub.