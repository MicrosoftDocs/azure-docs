---
title: Manage public network access for Azure IoT Device Provisioning Service (DPS)
description: Documentation on how to disable and enable public network access for Azure IoT Device Provisioning Service (DPS)
ms.author: wesmc
author: wesmc7777
ms.service: iot-dps
services: iot-dps
ms.topic: conceptual
ms.date: 10/18/2021
---

# Manage public network access for your IoT Device Provisioning Service

To restrict access to [a private endpoint for DPS in your VNet](virtual-network-support.md), disable public network access. To do so, use the Azure portal or the `publicNetworkAccess` API. You can also allow public access by using the portal or the `publicNetworkAccess` API.

## Turn off public network access using the Azure portal

To turn off public network access:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the left-hand menu or on the portal page, select **All resources**.
3. Select your Device Provisioning Service.
4. In the **Settings** menu on the left-side, select *Networking*.
5. Under **Public network access**, select *Disabled*
6. Select **Save**.

    :::image type="content" source="media/iot-dps-public-network-access/disable-public-access.png" alt-text="Image showing Azure portal where to turn off public network access" :::

To turn on public network access:

1. Select **All networks**.
2. Select **Save**.

## Access the DPS after disabling the public network access

After public network access is disabled, the DPS instance is accessible only through [its VNet private endpoint using Azure private link](virtual-network-support.md). This restriction includes accessing through the Azure portal.

## DPS endpoint, IP address, and ports after disabling public network access

DPS is a multi-tenant Platform-as-a-Service (PaaS), where different customers share the same pool of compute, networking, and storage hardware resources. DPS's hostnames map to a public endpoint with a publicly routable IP address over the internet. Different customers share this DPS public endpoint, and IoT devices in wide-area networks and on-premises networks can all access it. 

Disabling public network access is enforced on a specific DPS resource, ensuring isolation. To keep the service active for other customer resources using the public path, its public endpoint remains resolvable, IP addresses discoverable, and ports remain open. This is not a cause for concern as Microsoft integrates multiple layers of security to ensure complete isolation between tenants. To learn more, see [Isolation in the Azure Public Cloud](../security/fundamentals/isolation-choices.md#tenant-level-isolation).

## IP Filter

If public network access is disabled, all [IP Filter](../iot-dps/iot-dps-ip-filtering.md) rules are ignored. This is because all IPs from the public internet are blocked. To use IP Filter, use the **Selected IP ranges** option.

### Turn on all network ranges

To turn on all network ranges:

1. Go to the [Azure portal](https://portal.azure.com).
2. On the left-hand menu or on the portal page, select **All resources**.
3. Select your Device Provisioning Service.
4. In the **Settings** menu on the left-side, select *Networking*.
5. Under **Public network access**, select *All networks*
6. Select **Save**.
