---
title: Microsoft Defender for IoT private link architectures
description: Learn about the architecture models available for private link connections to Microsoft Defender for IoT.
ms.topic: conceptual
ms.date: 03/07/2022
---

# Private link connection architectures

Use private link connections between your sensor machines and Microsoft Defender for IoT to ensure industry-grade encryption and security.

With private link connections, the Azure global cloud data centers provide reliable, redundant service endpoints.

Private link connections provide:

- **Simple deployment**, requiring no additional installations in your private Azure environment

- **Improved security**, without needing to configure or lock down any resource security settings in the Azure VNET

- **Scalability** for new features supported only in the cloud

- **Flexible connectivity** using any of the connection methods described in this article

For more information, see [Choose a private link connection method](private-link.md#choose-a-private-link-connection-method).

## ExpressRoute connections with Microsoft Peering

The following image shows how you can use ExpressRoute to connect your sensors directly to Microsoft cloud services and establish a private and secure connection to the Azure portal.

With this method, use Microsoft Peering to connect your sensors directly to Azure without having to cross through other networks.

:::image type="content" source="media/architecture-private/expressroute-peering.png" alt-text="Diagram of the ExpressRoute connection with Microsoft Peering." border="false":::

For more information, see [Connect via ExpressRoute with Microsoft Peering](private-link.md#connect-via-expressroute-with-microsoft-peering).

## Proxy connections with an Azure proxy

The following image shows how you can connect your sensors to Microsoft cloud services through a proxy in the Azure VNET, ensuring confidentiality for all communications between your sensor and Azure.

:::image type="content" source="media/architecture-private/proxy.png" alt-text="Diagram of a proxy connection using an Azure proxy." border="false":::

Depending on your network configuration, you can access the VNET via a VPN connection or an ExpressRoute connection.

This method uses a proxy server hosted within Azure. To handle load balancing and failover, the proxy is configured to scale automatically behind a load balancer.

For more information, see [Connect via an Azure proxy](private-link.md#connect-via-an-azure-proxy).

## Proxy connections with proxy chaining

The following image shows how you can connect your sensors to Microsoft cloud services through multiple proxies, using different levels of the Purdue model and the enterprise network hierarchy.

:::image type="content" source="media/architecture-private/proxy-chaining.png" alt-text="Diagram of a proxy connection using proxy chaining." border="false":::

This method supports connecting your sensors without direct internet access, using an SSL-encrypted tunnel to transfer data from the sensor to the service endpoint via proxy servers. The proxy server does not perform any data inspection, analysis, or caching.

With a proxy chaining method, Defender for IoT does not support your proxy service. It's the customer's responsibility to set up and maintain the proxy service.

For more information, see [Connect via proxy chaining](private-link.md#connect-via-proxy-chaining).

## Direct connections

The following image shows how you can connect your sensors to Microsoft cloud services directly over the internet from remote sites, without transversing the enterprise network.

:::image type="content" source="media/architecture-private/direct.png" alt-text="Diagram of a direct connection to Azure.":::

With direct connections:

- Any sensors connected to Azure data centers directly over the internet have a secure and encrypted connection to the Azure data centers. Transport Layer Security (TLS) provides constant communication between the sensor and Azure resources.

- The sensor initiates all connections to the Azure portal. Initiating connections only from the sensor protects internal network devices from unsolicited inbound connections, but also means that you don't need to configure any inbound firewall rules.

For more information, see [Connect directly](private-link.md#connect-directly).

## Multi-cloud connections

You can connect your sensors to Microsoft cloud services from other public clouds for OT/IoT management process monitoring.

Depending on your environment configuration, you might connect using one of the following methods:

- ExpressRoute with customer-managed routing

- ExpressRoute with a cloud exchange provider

- A site-to-site VPN over the internet.

For more information, see [Connect via multi-cloud vendors](private-link.md#connect-via-multi-cloud-vendors).

## FAQs

#	Question	Answer
1	For existing customers with production deployments, what is the recommended upgrade process?	It is recommended that you follow the guide outlined above <link>

If you want to ensure that your network is ready, we recommend performing your first deployment in a lab or testing environment to make sure the Azure service is properly configured
2	How can I obtain the 22.1 update package?
You can download the update file from the "updates" page. (link to update)

After the software update, the sensor must be activated again after upgrading to 22.1

3	May I continue to deploy sites with version 10.5.x?
	It is safe to continue deploying sites with version 10.5.x in parallel.

It will be necessary to migrate to the new connectivity model when the current architecture is deprecated (9 months from GA)

4	How long will the 10.5.x architecture be supported?
	10.5.x will be supported until July 2022, for more info refer to <link>
5	Is my pricing going to change with the new model?
	Pricing does not change with the new connectivity model.
6	I would like to provide feedback on the new user interface in Sensor version 22.1
	Welcome! Please reach out to the engineering team at <email>
7	Are there implications for data residency?
	
8	Do I need to keep my IoT hubs if they were only used for MD4IoT?
	You may remove all unused IoT hubs from your subscription once all sensors have been migrated.
		


## Next steps

For more information, see [Configure private link connections](private-link.md).