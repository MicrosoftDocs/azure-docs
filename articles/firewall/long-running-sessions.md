---
title: TCP Idle Timeout Behavior and Long-Running TCP Sessions in Azure Firewall
description: TCP Idle Timeout Behavior and there are few scenarios where Azure Firewall can potentially drop long running TCP sessions.
services: firewall
author: sujamiya
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 02/14/2025
ms.author: duau
---

# TCP idle timeout behavior and long-running TCP sessions in Azure Firewall

This document outlines the TCP idle timeout settings and the behavior of long-running sessions in Azure Firewall. Understanding these concepts is crucial for maintaining network security, optimizing firewall resources, and ensuring uninterrupted connectivity for critical applications.

## TCP Idle Timeout

### What is TCP Idle Timeout?

TCP (Transmission Control Protocol) idle timeout determines how long a connection can remain inactive before the firewall terminates it. This setting helps ensure firewall resources aren't wasted on inactive connections and maintains overall network performance. 

### Why is TCP Idle Timeout Important?

Proper idle timeout configuration can:

- **Optimize Azure Firewall usage**: Frees memory and CPU by closing inactive connections.
- **Mitigate DDoS risks**: Reduces vulnerability to attacks exploiting persistent idle connections.
- **Enhance network performance**: Reduces latency and improves throughput by managing idle connections effectively.

### TCP Idle Timeout Settings in Azure Firewall

**Default Behavior**:

- **North-South Traffic (Internet-bound traffic)**: The default TCP idle timeout is **4 minutes** designed to balance resource efficiency and the need to maintain active connections.
- **East-West Traffic (Internal traffic such as spoke-to-spoke or on-premise connections)**: No idle timeout is enforced.

**Customizing Idle Timeout**:

- **For North-South traffic**, the TCP idle timeout can be configured between 4 and 15 minutes.
- **For East-West traffic**, the TCP idle timeout can't be customized. However, customization options for the East-West traffic idle timeout are planned in a future release.

To customize the TCP idle timeout, customers must submit a support request via Azure Support, since direct configuration through the Azure portal isn't available.

## Long-Running TCP Sessions in Azure Firewall

### What are Long-Running TCP Sessions?

Long-running sessions refer to TCP connections that persist over an extended period, often used in applications like SSH, RDP, VPN tunnels, or database connections. These sessions need specific configurations to prevent premature disconnection.

Azure Firewall is designed to be available and redundant. Every effort is made to avoid service disruptions. However, there are few scenarios where Azure Firewall can potentially drop long running TCP sessions.

### Scenarios that affect long running TCP sessions

The following scenarios can potentially drop long running TCP sessions:

- Scale in
- Firewall maintenance
- Idle timeout
- Autorecovery

### Scale-in

Azure Firewall scales in/out based on throughput and CPU usage. Scale-in is performed by putting the underlying Azure Firewall instance in drain mode for 90 seconds before recycling the instance. Any long running connections remaining on the instance after 90 seconds are disconnected.

### Firewall maintenance

The Azure Firewall engineering team updates the firewall on an as-needed basis (usually every month), generally during night time hours in the local time-zone for that region. Updates include security patches, bug fixes, and new feature roll outs that are applied by configuring the firewall in a [rolling update mode](https://blog.itaysk.com/2017/11/20/deployment-strategies-defined#rolling-upgrade). The firewall instances are put in a drain mode before reimaging them to give short-lived sessions time to drain. Long running sessions remaining on an instance after the drain period are dropped during the restart.

### Idle timeout

An idle timer is in place to recycle idle sessions. As shared in the Customizing TCP Idle Timeout section, you can configure the TCP idle timeout for North-South traffic via a support request. Ensuring proper keep-alive mechanisms are in place can help maintain long-running connections.

### Autorecovery

Azure Firewall constantly monitors the underlying instances and recovers them automatically in case any instance goes unresponsive. In general, there's a one in 100 chance for a firewall instance to be autorecovered over a 30 day period.

## Applications sensitive to TCP session reset

Session disconnection isn’t an issue for resilient applications that can handle session reset gracefully. However, there are a few applications (like traditional SAP GUI and SAP RFC(Remote Function Call) based apps) which are sensitive to sessions resets. Secure sensitive applications with Network Security Groups (NSGs).

### Network security groups

You can deploy [network security groups (NSGs)](../virtual-network/virtual-network-vnet-plan-design-arm.md#security) to protect against unsolicited traffic into Azure subnets. 

Network security groups are simple, stateful packet inspection devices that use the five-tuple approach to create allow/deny rules for network traffic. 

You can:

- Allow or deny traffic to and from a single IP address, multiple IP addresses, or entire subnets.
- Use NSG flow logs to audit IP traffic flowing through an NSG.

To learn more about NSG flow logging, see [Introduction to flow logging for network security groups](../network-watcher/network-watcher-nsg-flow-logging-overview.md).

## Next steps

To learn more about Azure Firewall performance, see [Azure Firewall performance](firewall-performance.md).
