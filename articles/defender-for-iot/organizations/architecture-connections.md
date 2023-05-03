---
title: Methods for connecting sensors to Azure - Microsoft Defender for IoT
description: Learn about the architecture models available for connecting your sensors to Microsoft Defender for IoT.
ms.topic: concept-article
ms.date: 02/23/2023
---

# Methods for connecting sensors to Azure

This article is one in a series of articles describing the [deployment path](ot-deploy/ot-deploy-path.md) for OT monitoring with Microsoft Defender for IoT.

Use the content below to learn about the architectures and methods supported for connecting Defender for IoT sensors to the Azure portal in the cloud.

:::image type="content" source="media/deployment-paths/progress-plan-and-prepare.png" alt-text="Diagram of a progress bar with Plan and prepare highlighted." border="false" lightbox="media/deployment-paths/progress-plan-and-prepare.png":::

Network sensors connect to Azure to provide data about detected devices, alerts, and sensor health, to access threat intelligence packages, and more. For example, connected Azure services include IoT Hub, Blob Storage, Event Hubs, Aria, the Microsoft Download Center.

All connection methods provide:

- **Improved security**, without additional security configurations. [Connect to Azure using specific and secure endpoints](networking-requirements.md#sensor-access-to-azure-portal), without the need for any wildcards.

- **Encryption**, Transport Layer Security (TLS1.2/AES-256) provides encrypted communication between the sensor and Azure resources.

- **Scalability** for new features supported only in the cloud

> [!IMPORTANT]
> To ensure that your network is ready, we recommend that you first run your connections in a lab or testing environment so that you can safely validate your Azure service configurations.
>

## Choose a sensor connection method

Use this section to help determine which connection method is right for your cloud-connected Defender for IoT sensor.

|If ...  |... Then use  |
|---------|---------|
|- You require private connectivity between your sensor and Azure,  <br>- Your site is connected to Azure via ExpressRoute, or  <br>- Your site is connected to Azure over a VPN  | **[Proxy connections with an Azure proxy](#proxy-connections-with-an-azure-proxy)**        |
|- Your sensor needs a proxy to reach from the OT network to the cloud, or <br>- You want multiple sensors to connect to Azure through a single point    | **[Proxy connections with proxy chaining](#proxy-connections-with-proxy-chaining)**        |
|- You want to connect your sensor to Azure directly    | **[Direct connections](#direct-connections)**        |
|- You have sensors hosted in multiple public clouds | **[Multicloud connections](#multicloud-connections)** |

> [!NOTE]
> While most connection methods are relevant for OT sensors only, [Direct connections](#direct-connections) are also used for [Enterprise IoT sensors](eiot-sensor.md).

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

The following image shows how you can connect your sensors to the Defender for IoT portal in Azure directly over the internet from remote sites, without traversing the enterprise network.

:::image type="content" source="media/architecture-connections/direct.png" alt-text="Diagram of a direct connection to Azure." border="false":::

With direct connections:

- Any sensors connected to Azure data centers directly over the internet have a secure and encrypted connection to the Azure data centers. Transport Layer Security (TLS1.2/AES-256) provides *always-on* communication between the sensor and Azure resources.

- The sensor initiates all connections to the Azure portal. Initiating connections only from the sensor protects internal network devices from unsolicited inbound connections, but also means that you don't need to configure any inbound firewall rules.

For more information, see [Provision sensors for cloud management](ot-deploy/provision-cloud-management.md).

## Multicloud connections

You can connect your sensors to the Defender for IoT portal in Azure from other public clouds for OT/IoT management process monitoring.

Depending on your environment configuration, you might connect using one of the following methods:

- ExpressRoute with customer-managed routing

- ExpressRoute with a cloud exchange provider

- A site-to-site VPN over the internet.

For more information, see [Connect via multicloud vendors](connect-sensors.md#connect-via-multicloud-vendors).

## Next steps

> [!div class="step-by-step"]
> [« Plan your OT monitoring system](best-practices/plan-corporate-monitoring.md)
