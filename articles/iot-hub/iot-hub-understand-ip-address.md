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

The IP address prefixes of IoT hub are published periodically under the *AzureIoTHub* [service tag](../virtual-network/service-tags-overview.md). To ensure proper operation, your IoT devices must have outbound connectivity to address prefixes listed under *AzureIoTHub* service tag. Your IoT application services need to additionally have outbound connectivity to address prefixes listed under *EventHub* service tag.


## Best practices

* The IP address prefixes of IoT hub are subject to change. These changes are published periodically via service tags before taking effect. It is therefore important that you develop processes to regularly retrieve and use the latest service tags. This process can be automated via the [service tags discovery API](../virtual-network/service-tags-overview.md#service-tags-in-on-premises).
* Use the *AzureIoTHub.[region name]* tag to identify IP prefixes used by IoT hub endpoints in a specific region. To account for datacenter disaster recovery, or [regional failover](iot-hub-ha-dr.md) ensure connectivity to IP prefixes of your IoT Hub's geo-pair region is also enabled.


## Support for IPv6 

IPv6 is currently not supported on IoT Hub.