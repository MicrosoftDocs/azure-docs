---
title: BMP Log Streaming in Azure Operator Nexus Network Fabric 
description: An overview of BGP Monitoring Protocol (BMP), its importance, and key components for effective log monitoring.
author: sushantjrao
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 04/01/2025
ms.custom: template-concept
---

# Introduction to BMP

The BGP Monitoring Protocol (BMP) is designed to monitor Border Gateway Protocol (BGP) sessions. BMP provides a standardized method for collecting information about BGP sessions. You can use this information for analysis, troubleshooting, and helping to ensure the stability and security of the network.

BMP allows a monitoring station to connect to a router and collect all the BGP announcements received from the router's BGP peers. The announcements are sent to the station in the form of BMP route monitoring messages formed from path information in the router's BGP Adj-Rib-In tables. A BMP speaker might choose to send either prepolicy routes, post-policy routes, or both.

BMP is unidirectional. BMP sends messages only from the router to the monitoring station, never the other way around. The router's configuration controls the information that gets sent. Besides route monitoring messages, BMP also sends these messages:

- **Initiation**: Sent at the beginning of a session and used to identify the router.
- **Termination**: Optionally sent at the end of a session to indicate why the session is being closed.
- **Peer Up**: Used to indicate if a BGP peer is in an **Established** state.
- **Peer Down**: Used to indicate that a BGP peer is no longer in an **Established** state.

Connections between the router and BMP stations use the Transmission Control Protocol. The router can passively listen for incoming connections from a station or actively initiate them, configurable per station. Only one connection per BMP station is allowed at a time. If a station reconnects, the router closes the old session and starts a new BMP session with the new connection.

## Importance of BMP log monitoring

BMP log monitoring is crucial for maintaining the health and performance of BGP sessions. By continuously monitoring BMP logs, network administrators can detect anomalies, identify potential issues, and take proactive measures to prevent network disruptions. Effective BMP log monitoring helps to:

- Ensure the stability and reliability of BGP sessions.
- Detect and mitigate security threats.
- Analyze network performance and identifying optimization opportunities.
- Troubleshoot and resolve BGP-related issues promptly.

## Key components of BMP log monitoring

### Data collection

BMP logs provide detailed information about BGP sessions, including route updates, peer status, and error messages. Collecting this data is the first step in effective BMP log monitoring.

### Data storage

Storing BMP logs in a centralized and secure location is essential for easy access and analysis. You can use log management systems or databases.

### Data analysis

Analyzing BMP logs helps to identify patterns, trends, and anomalies. You can use advanced analytics tools and techniques like machine learning to gain deeper insights into the network's behavior.

### Alerting and reporting

Setting up alerts for specific events or thresholds in BMP logs ensures that network administrators are promptly notified of any issues. Regular reports provide a comprehensive overview of the network's health and performance.

## Restrictions and limitations of BMP log streaming

### Azure Operator Nexus Network Fabric restrictions

Azure Operator Nexus Network Fabric doesn't enable BMP log streaming for the following BGP neighbors:

- `INTERCEGLOBAL`
- `INTERCEEVPN`
- `INTERCEOPTION-A`
- `CETORUNDERLAY`
- `EVPN_OVERLAY`

Azure Operator Nexus Network Fabric doesn't support BMP log streaming for `RT-Membership` and `EVPN Address-family`.

Azure Operator Nexus Network Fabric doesn't support monitoring address families at the station level, even though Azure Operator Nexus Network Fabric provides the Azure Resource Manager API at the station level by facilitating the address family. This limitation exists because Arista supports the BGP global level rather than the BMP station level.

### L3ISD requirements

- Layer 3 isolation domain (L3ISD) must be enabled before the L3ISDs are associated as monitored networks of Network Monitor.
- L3ISD must be enabled before the L3ISDs internal/external networks are associated as the station networks of Network Monitor.
- L3ISD must not be disabled if the respective L3ISD internal/external network is associated under the station network of Network Monitor.

### Unsupported features

Azure Operator Nexus doesn't support the following features:

- BMP support for virtual routing and forwarding (VRF) filtering.
- BMP support for local rib virtual private network imported routes.
- BMP support for exporting Adj-Rib-Out.

### Peer-address monitoring

Azure Operator Nexus Network Fabric doesn't support excluding the monitoring of peer addresses of neighbor groups where the neighbor group is configured with a BGP listen range. Arista doesn't support excluding the monitoring of certain addresses of neighbors that are configured with a BGP listen range.

### Network Monitor

Azure Operator Nexus supports a maximum of four instances of Network Monitor (BMP stations).

## Related content

- [Enable or disable BMP log streaming](./howto-enable-log-streaming.md)