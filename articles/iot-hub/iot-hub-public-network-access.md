---
title: Managing public network access for Azure IoT hub
description: Documentation on how to disable and enable public network access for IoT hub
author: jlian
ms.author: jlian
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 03/12/2021
---

# Managing public network access for your IoT hub

To restrict access to only [private endpoint for your IoT hub in your VNet](virtual-network-support.md), disable public network access. To do so, use Azure portal or the `publicNetworkAccess` API. 

## Turn off public network access using Azure portal

1. Visit [Azure portal](https://portal.azure.com)
2. Navigate to your IoT hub.
3. Select **Networking** from the left-side menu.
4. Under “Allow public network access to”, select **Disabled**
5. Select **Save**.

:::image type="content" source="media/iot-hub-publicnetworkaccess/turn-off-public-network-access.png" alt-text="Image showing Azure portal where to turn off public network access" lightbox="media/iot-hub-publicnetworkaccess/turn-off-public-network-access.png":::

To turn on public network access, selected **All networks**, then **Save**.

## Accessing the IoT Hub after disabling public network access

After public network access is disabled, the IoT Hub is only accessible through [its VNet private endpoint using Azure private link](virtual-network-support.md).

## IoT Hub endpoint, IP address, and ports after disabling public network access

IoT Hub is a multi-tenant Platform-as-a-Service (PaaS), so different customers share the same pool of compute, networking, and storage hardware resources. IoT Hub's hostnames map to a public endpoint with a publicly routable IP address over the internet. Different customers share this IoT Hub public endpoint, and IoT devices in over wide-area networks and on-premises networks can all access it. 

Disabling public network access is enforced on a specific IoT hub resource, ensuring isolation. To keep the service active for other customer resources using the public path, its public endpoint remains resolvable, IP addresses discoverable, and ports remain open. This is not a cause for concern as Microsoft integrates multiple layers of security to ensure complete isolation between tenants. To learn more, see [Isolation in the Azure Public Cloud](../security/fundamentals/isolation-choices.md#tenant-level-isolation).

## IP Filter 

If public network access is disabled, all [IP Filter](iot-hub-ip-filtering.md) rules are ignored. This is because all IPs from the public internet are blocked. To use IP Filter, use the **Selected IP ranges** option.

## Bug fix with built-in Event Hub compatible endpoint

There is a bug with IoT Hub where the [built-in Event Hub compatible endpoint](iot-hub-devguide-messages-read-builtin.md) continues to be accessible via public internet when public network access to the IoT Hub is disabled. To learn more and contact us about this bug, see [Disabling public network access for IoT Hub disables access to built-in Event Hub endpoint](https://azure.microsoft.com/updates/iot-hub-public-network-access-bug-fix).
