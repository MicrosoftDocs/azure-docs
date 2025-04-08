---
title: Understanding Azure Firewall TCP (Transmission Control Protocol) session management and idle timeout behavior
description: Learn about the behavior of long-running sessions and TCP idle timeout for Azure Firewall.
services: firewall
author: sujamiya
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 03/25/2025
ms.author: duau
---

# Understanding Azure Firewall TCP session management and idle timeout behavior

This article explains the behavior of long-running sessions and the TCP idle timeout for Azure Firewall. Understanding these concepts is crucial for maintaining network security, optimizing firewall resources, and ensuring uninterrupted connectivity for critical applications.

## Long-running TCP sessions

Long-running sessions refer to TCP connections that stay active for extended durations. These long-running sessions are often utilized in applications like SSH, RDP, VPN tunnels, and database connections. To prevent unexpected disconnections, it's essential to configure these sessions appropriately. Understanding the factors that influence their stability is key to ensuring uninterrupted connectivity.

Certain scenarios can lead to the dropping of long-running TCP sessions. Azure Firewall is designed to handle a large number of concurrent connections, but it might not be able to maintain long-running sessions under certain conditions.

The following scenarios in Azure Firewall can result in the termination of long-running TCP sessions:

- **Scale-in**: When Azure Firewall scales in, it enters a drain mode for 90 seconds before recycling the instance. Any long-running connections still active after this period gets disconnected.

- **Firewall maintenance**: During maintenance updates, Azure Firewall allows short-lived sessions to complete. However, long-running sessions that persist beyond the drain period are terminated during the restart process.

- **Autorecovery**: If an Azure Firewall instance becomes unresponsive, it undergoes an automatic recovery process. This recovery can lead to the disconnection of long-running sessions.

- **Idle timeout**: Connections that remain inactive for a duration exceeding the TCP idle timeout gets closed by the Azure Firewall.

## Idle timeout settings

The TCP idle timeout specifies the duration a connection can stay inactive before the Azure Firewall terminates the connection. This setting helps optimize the Azure Firewall by closing inactive connections and maintaining overall network performance.

The TCP idle timeout provides several benefits:

- **Efficient resource utilization**: By terminating inactive connections, the Azure Firewall conserves memory and compute resources, ensuring optimal performance.
- **DDoS risk mitigation**: Helps protect against Distributed Denial-of-Service (DDoS) attacks that exploit idle, persistent connections.
- **Improved network performance**: Enhances overall throughput and reduces latency by managing idle connections effectively.

### Timeout behavior

In the context of Azure Firewall, **north-south traffic** refers to traffic between the Azure Firewall and the Internet, while **east-west traffic** refers to internal traffic between Azure resources within the same region, across regions, and on-premises networks connected through Azure VPN, Azure ExpressRoute, or Virtual Network Peering going through the Azure Firewall. 

The TCP idle timeout behavior differs for north-south and east-west traffic:

- **North-south traffic**: The default TCP idle timeout is **4 minutes**. You can extend this timeout to a maximum of **15 minutes** by submitting a support request through the Azure portal.
- **East-west traffic**: The TCP idle timeout is fixed at **5 minutes** and can't be modified.

### TCP reset packets (RST)

When a TCP connection is terminated due to an idle timeout, the Azure Firewall sends a TCP reset packet (RST) to both the client and server. This packet notifies both parties that the connection closed. The behavior of TCP reset packets differs for north-south and east-west traffic.

- **North-south traffic**: The Azure Firewall notifies both the client and server when an idle timeout occurs by sending a TCP reset packet (RST).
- **East-west traffic**: Azure Firewall doesn't send a reset packet (RST) when an idle timeout occurs. This behavior can cause unexpected issues in applications. Configure a keep-alive mechanism within your application to keep long-running sessions active and prevent disruptions during scale-in, maintenance, or autorecovery events.

Certain applications, such as traditional SAP GUI and SAP Remote Function Call (RFC)-based applications, are sensitive to session resets and can experience connectivity issues when sessions are terminated unexpectedly. To avoid these issues, you can implement a retry logic in your application to handle session resets gracefully. This mechanism should include logic to re-establish connections and resume operations seamlessly.

## Next steps

To learn more about Azure Firewall performance, see [Azure Firewall performance](firewall-performance.md).
