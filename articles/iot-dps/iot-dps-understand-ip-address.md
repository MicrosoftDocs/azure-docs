---
title: Understanding the IP address of your DPS instance
titleSuffix: Azure IoT Hub Device Provisioning Service
description: Query your DPS IP address and its properties. The IP address of your DPS instance can change during scenarios like disaster recovery or regional failover.
author: cwatson-cat
ms.author: cwatson
ms.service: azure-iot-hub
ms.topic: concept-article
ms.date: 08/11/2025
ms.subservice: azure-iot-hub-dps
---

# Device Provisioning Service IP addresses

The IP address prefixes for the public endpoints of an IoT Hub Device Provisioning Service (DPS) are published periodically under the _AzureIoTHub_ [service tag](../virtual-network/service-tags-overview.md). You can use these IP address prefixes to control connectivity between an IoT DPS instance and devices or network assets to implement various network isolation goals:

| Goal | Approach |
|------|----------|
| Ensure your devices and services communicate with DPS endpoints only | Use the _AzureIoTHub_ service tag to discover DPS instances. Configure ALLOW rules on your devices' and services' firewall setting for those IP address prefixes accordingly. Configure rules to drop traffic to other destination IP addresses that you don't want devices or services to communicate with. |
| Ensure your DPS endpoint receives connections only from your devices and network assets | Use the IoT DPS [IP filter feature](iot-dps-ip-filtering.md) to create filter rules for the device and DPS service APIs. These filter rules can be used to allow connections only from your devices and network asset IP addresses. For more information, see [Limitations and workarounds](#limitations-and-workarounds). |

## Best practices

* When adding ALLOW rules in your devices' firewall configuration, it's best to provide specific [port numbers](../iot-hub/iot-hub-devguide-protocols.md#port-numbers) used by available protocols.

* The IP address prefixes of IoT DPS instances are subject to change. These changes are published periodically via service tags before taking effect. It's therefore important that you develop processes to regularly retrieve and use the latest service tags. This process can be automated via the [Service Tag Discovery API](../virtual-network/service-tags-overview.md#service-tags-on-premises). The Service Tag Discovery API is still in preview and in some cases might not produce the full list of tags and IP addresses. Until the Service Tag Discovery API is generally available, consider using the [service tags in downloadable JSON format](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files). 

* Use the *AzureIoTHub.[region name]* tag to identify IP prefixes used by DPS endpoints in a specific region. To account for datacenter disaster recovery, or [regional failover](iot-dps-ha-dr.md), ensure connectivity to IP prefixes of your DPS instance's geo-pair region is also enabled.

* Setting up firewall rules for a DPS instance might block off connectivity needed to run Azure CLI and PowerShell commands against it. To avoid these connectivity issues, you can add ALLOW rules for your clients' IP address prefixes to re-enable CLI or PowerShell clients to communicate with your DPS instance.  


## Limitations and workarounds

* The DPS IP filter feature has a limit of 100 rules.

* Your configured [IP filtering rules](iot-dps-ip-filtering.md) are only applied on your DPS endpoints and not on the linked IoT Hub endpoints. IP filtering for linked IoT hubs must be configured separately. For more information, see, [Use IP filters](../iot-hub/iot-hub-ip-filtering.md).

## Support for IPv6

IPv6 is currently not supported on IoT Hub or DPS.

## Next steps

To learn more about IP address configurations with DPS, see:

* [Use Azure IoT DPS IP connection filters](iot-dps-ip-filtering.md)
