---
title: Configure IP firewall for Azure Event Grid namespaces (MQTT)
description: This article describes how to configure firewall settings for Azure Event Grid namespaces that have MQTT enabled.
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 10/13/2026
author: Connected-Seth
ms.author: seshanmugam
ms.subservice: mqtt
---

# Configure IP firewall for Azure Event Grid namespaces (MQTT)
By default, you can access Event Grid namespaces and entities such as Message Queuing Telemetry Transport (MQTT) topic spaces from the internet as long as the request has valid authentication and authorization. By using the IP firewall, you can restrict access to specified IP addresses or address ranges in [CIDR (Classless Inter-Domain Routing)](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation. Only MQTT clients in an allowed range can connect to publish and subscribe. Other clients are rejected and receive a 403 (Forbidden) response. For more information about network security features supported by Event Grid, see [Network security for Event Grid](network-security.md).

This article describes how to configure IP firewall settings for an Event Grid namespace. For complete steps for creating a namespace, see [Create and manage namespaces](create-view-manage-namespaces.md).

During preview, an IPv6 dual-stack namespace supports IPv4 and IPv6 firewall rules. Configure IPv4 and IPv6 address ranges independently. An IPv4 rule doesn't authorize an IPv6 MQTT client address, and an IPv6 rule doesn't authorize an IPv4 MQTT client address. For more information, see [Configure IPv6 dual-stack support (preview)](namespace-ipv6-dual-stack.md).

## Create a namespace with IP firewall settings

1. On the **Networking** page, if you want to allow clients to connect to the namespace endpoint via a public IP address, select **Public access** for **Connectivity method** if it's not already selected. 
1. To restrict access from specific IP addresses, specify an IPv4 or IPv6 address or CIDR range in **Address range**. Add a rule for each client protocol that you intend to permit.

    :::image type="content" source="./media/configure-firewall-mqtt/ip-firewall-settings.png" alt-text="Screenshot that shows IP firewall settings on the Networking page of the Create namespace wizard.":::

## Update a namespace with IP firewall settings

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the **search box**, enter **Event Grid Namespaces** and select **Event Grid Namespaces** from the results.

    :::image type="content" source="./media/create-view-manage-namespaces/portal-search-box-namespaces.png" alt-text="Screenshot showing Event Grid Namespaces in the search results.":::
1. Select your Event Grid namespace in the list to open the **Event Grid Namespace** page for your namespace.
1. On the **Event Grid Namespace** page, select **Networking** on the left menu. 
1. In **Address range**, specify each IPv4 or IPv6 address or CIDR range that you want to allow. Configure IPv4 and IPv6 rules independently.

    :::image type="content" source="./media/configure-firewall-mqtt/namespace-ip-firewall-settings.png" alt-text="Screenshot that shows IP firewall settings on the Networking page of an existing namespace.":::

## Next steps

- [Configure IPv6 dual-stack support (preview)](namespace-ipv6-dual-stack.md)
- [Allow access via private endpoints](mqtt-configure-private-endpoints.md)
