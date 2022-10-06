---
title: OT sensor cloud connection methods - Microsoft Defender for IoT
description: Learn about the architecture models available for connecting your sensors to Microsoft Defender for IoT.
ms.topic: conceptual
ms.date: 09/11/2022
---

# OT sensor cloud connection methods

This article describes the architectures and methods supported for connecting your Microsoft Defender for IoT OT sensors to the cloud. An integral part of the Microsoft Defender for IoT service is the managed cloud service in Azure that acts as the central security monitoring portal for aggregating security information collected from network monitoring sensors and security agents. In order to ensure the security of IoT/OT at a global scale, the service supports millions of concurrent telemetry sources securely and reliably. 



The cloud connection methods described in this article are supported only for OT sensor version 22.x and later. All methods provide:

- **Simple deployment**, requiring no extra installations in your private Azure environment, such as for an IoT Hub

- **Improved security**, without needing to configure or lock down any resource security settings in the Azure VNET

- **Encryption**, Transport Layer Security (TLS1.2/AES-256) provides encrypted communication between the sensor and Azure resources.

- **Scalability** for new features supported only in the cloud

- **Flexible connectivity** using any of the connection methods described in this article

For more information, see [Choose a sensor connection method](connect-sensors.md#choose-a-sensor-connection-method).


> [!IMPORTANT]
> To ensure that your network is ready, we recommend that you first run the migration in a lab or testing environment so that you can safely validate your Azure service configurations.
>

## Proxy connections with an Azure proxy

The following image shows how you can connect your sensors to the Defender for IoT portal in Azure through a proxy in the Azure VNET. This configuration ensures confidentiality for all communications between your sensor and Azure.

:::image type="content" source="media/architecture-connections/proxy.png" alt-text="Diagram of a proxy connection using an Azure proxy." border="false":::

Depending on your network configuration, you can access the VNET via a VPN connection or an ExpressRoute connection.

This method uses a proxy server hosted within Azure. To handle load balancing and failover, the proxy is configured to scale automatically behind a load balancer.

For more information, see [Connect via an Azure proxy](connect-sensors.md#connect-via-an-azure-proxy).

## Proxy connections with proxy chaining

The following image shows how you can connect your sensors to the Defender for IoT portal in Azure through multiple proxies, using different levels of the Purdue model and the enterprise network hierarchy.

:::image type="content" source="media/architecture-connections/proxy-chaining.png" alt-text="Diagram of a proxy connection using proxy chaining." border="false":::

This method supports connecting your sensors without direct internet access, using an SSL-encrypted tunnel to transfer data from the sensor to the service endpoint via proxy servers. The proxy server doesn't perform any data inspection, analysis, or caching.

With a proxy chaining method, Defender for IoT doesn't support your proxy service. It's the customer's responsibility to set up and maintain the proxy service.

For more information, see [Connect via proxy chaining](connect-sensors.md#connect-via-proxy-chaining).

## Direct connections

The following image shows how you can connect your sensors to the Defender for IoT portal in Azure directly over the internet from remote sites, without transversing the enterprise network.

:::image type="content" source="media/architecture-connections/direct.png" alt-text="Diagram of a direct connection to Azure.":::

With direct connections

- Any sensors connected to Azure data centers directly over the internet have a secure and encrypted connection to the Azure data centers. Transport Layer Security (TLS1.2/AES-256) provides *always-on* communication between the sensor and Azure resources.

- The sensor initiates all connections to the Azure portal. Initiating connections only from the sensor protects internal network devices from unsolicited inbound connections, but also means that you don't need to configure any inbound firewall rules.

For more information, see [Connect directly](connect-sensors.md#connect-directly).

## Multicloud connections

You can connect your sensors to the Defender for IoT portal in Azure from other public clouds for OT/IoT management process monitoring.

Depending on your environment configuration, you might connect using one of the following methods:

- ExpressRoute with customer-managed routing

- ExpressRoute with a cloud exchange provider

- A site-to-site VPN over the internet.

For more information, see [Connect via multicloud vendors](connect-sensors.md#connect-via-multicloud-vendors).

## Working with a mixture of sensor software versions

If you're a customer with an existing production deployment, we recommend that upgrade any legacy sensor versions to version 22.1.x.

While you'll need to migrate your connections before the [legacy version reaches end of support](release-notes.md#versioning-and-support-for-on-premises-software-versions), you can currently deploy a hybrid network of sensors, including legacy software versions with their IoT Hub connections, and sensors with the connection methods described in this article.

After migrating, you can remove any relevant IoT Hubs from your subscription as they'll no longer be required for your sensor connections.

For more information, see [Update OT system software](update-ot-software.md) and [Migration for existing customers](connect-sensors.md#migration-for-existing-customers).

## Next steps

For more information, see [Connect your sensors to Microsoft Defender for IoT](connect-sensors.md).

