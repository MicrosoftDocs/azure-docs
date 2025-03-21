---
title: TCP Idle timeout behavior and long-running TCP sessions in Azure Firewall
description: Understand TCP idle timeout behavior and scenarios where Azure Firewall can drop long-running TCP sessions.
services: firewall
author: sujamiya
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 03/21/2025
ms.author: duau
---

# TCP idle timeout behavior and long-running TCP sessions in Azure Firewall

This article explains the TCP idle timeout settings and the behavior of long-running sessions in Azure Firewall. Understanding these settings is essential for maintaining network security, optimizing Azure Firewall resources, and ensuring uninterrupted connectivity for critical applications.

## Idle timeout settings

The TCP (Transmission Control Protocol) idle timeout specifies the duration a connection can stay inactive before the Azure Firewall terminates the connection. This setting helps optimize the Azure Firewall by closing inactive connections and maintaining overall network performance.

Configuring the TCP idle timeout properly can:

- **Optimize Azure Firewall resources**: Frees up memory and compute resources by closing inactive connections.
- **Mitigate DDoS risks**: Reduces the risk of attacks that exploit persistent idle connections.
- **Enhance network performance**: Improves throughput and reduces latency by effectively managing idle connections.

### Timeout behavior

In the aspect of the Azure Firewall, **north-south** traffic refers to the traffic that flows between the Azure Firewall and the Internet, while **east-west** traffic refers to the traffic that flows between Azure resources within the same region or across regions. This also includes traffic between Azure resources and on-premises resources connected through Azure VPN, Azure ExpressRoute, and Virtual network peering. The TCP idle timeout behavior in Azure Firewall is different for north-south and east-west traffic. 

- **North-south**: The default TCP idle timeout is set to **4 minutes** to maintain active connections. You can increase the timeout to a maximum of **15 minutes** by submitting a support request through the Azure portal.
- **East-west**: There's a **5 minutes** TCP idle timeout on the Azure Firewall. This timeout isn't configurable. 

## Long-running TCP sessions

Azure Firewall is built for high availability and redundancy, aiming to minimize service disruptions. However, certain scenarios can still lead to the dropping of long-running TCP sessions. Long-running sessions are TCP connections that remain active for extended periods. These are commonly used in applications such as SSH, RDP, VPN tunnels, and database connections. To ensure these sessions remain connected, specific configurations are required.

The following scenarios can potentially drop long-running TCP sessions:

- **Scale-in**: When Azure Firewall scales in, it puts the instance in drain mode for 90 seconds before recycling. Any long-running connections still active after this period are disconnected.
- **Firewall maintenance**: During maintenance updates, the firewall enters drain mode to allow short-lived sessions to complete. Long-running sessions that remain after the drain period are dropped during the restart.
- **Idle timeout**: Idle sessions are recycled based on the TCP idle timeout settings. For north-south traffic, you can request an increase in the timeout. For east-west traffic, the timeout is fixed at 5 minutes.
- **Autorecovery**: If an Azure Firewall instance becomes unresponsive, it's automatically recovered. This process can result in the disconnection of long-running sessions.

> [!TIP]
> To avoid connectivity issues, configure a keep-alive mechanism within your application that communicates through the Azure Firewall for east-west traffic. This ensures that long-running sessions remain active and aren't affected by the idle timeout settings.

## Applications sensitive to TCP session reset

Some applications, such as traditional SAP GUI and SAP RFC (Remote Function Call) based apps, are sensitive to TCP session resets and may not handle them gracefully. To protect these sensitive applications, use network security groups (NSGs). 

For more information, see [How to secure a virtual network](../virtual-network/virtual-network-vnet-plan-design-arm.md#security) and [Network security groups](../virtual-network/network-security-groups-overview.md).

> [!IMPORTANT]
> - **North-south traffic**: The Azure Firewall sends a reset packet (RST) to both the source and destination when an idle timeout occurs.
> - **East-west traffic**: The Azure Firewall doesn't send a reset packet (RST) when an idle timeout occurs.

## Next steps

- To learn more about Azure Firewall performance, see [Azure Firewall performance](firewall-performance.md).
- To learn more about NSG flow logging, see [Introduction to flow logging for network security groups](../network-watcher/network-watcher-nsg-flow-logging-overview.md).