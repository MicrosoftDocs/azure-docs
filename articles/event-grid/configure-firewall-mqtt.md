---
title: Configure IP firewall for Azure Event Grid namespaces
description: This article describes how to configure firewall settings for Azure Event Grid namespaces that have MQTT enabled. 
ms.topic: how-to
ms.date: 10/04/2023
---

# Configure IP firewall for Azure Event Grid namespaces
By default, Event Grid namespaces and entities in them such as MQTT topic spaces are accessible from internet as long as the request comes with valid authentication (access key) and authorization. With IP firewall, you can restrict it further to only a set of IPv4 addresses or IPv4 address ranges in [CIDR (Classless Inter-Domain Routing)](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation. Publishers originating from any other IP address will be rejected and will receive a 403 (Forbidden) response. For more information about network security features supported by Event Grid, see [Network security for Event Grid](network-security.md).

This article describes how to configure IP firewall settings for an Event Grid namespace. For complete steps for creating a namespace, see [Create and manage namespaces](create-view-manage-namespaces.md).

## Create a namespace with IP firewall settings

1. On the **Networking** page, if you want to allow clients to connect to the namespace endpoint via a public IP address, select **Public access** for **Connectivity method** if it's not already selected. 
2. You can restrict access to the topic from specific IP addresses by specifying values for the **Address range** field. Specify a single IPv4 address or a range of IP addresses in Classless inter-domain routing (CIDR) notation. 

    :::image type="content" source="./media/configure-firewall-mqtt/ip-firewall-settings.png" alt-text="Screenshot that shows IP firewall settings on the Networking page of the Create namespace wizard.":::

## Update a namespace with IP firewall settings

1. Navigate to your Event Grid namespace in the Azure portal. 
1. On the **Event Grid namespace** page, select **Networking** on the left menu. 
1. Specify values for the **Address range** field. Specify a single IPv4 address or a range of IP addresses in Classless inter-domain routing (CIDR) notation. 

    :::image type="content" source="./media/configure-firewall-mqtt/namespace-ip-firewall-settings.png" alt-text="Screenshot that shows IP firewall settings on the Networking page of an existing namespace.":::

## Next steps
See [Allow access via private endpoints](configure-private-endpoints-mqtt.md).
