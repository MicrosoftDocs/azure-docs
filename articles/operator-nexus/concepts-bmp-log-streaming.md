---
title: BMP log streaming in Azure Operator Nexus Network Fabric 
description: An overview of BGP Monitoring Protocol (BMP), its importance, and key components for effective log monitoring.
author: sushantjrao
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 04/01/2025
ms.custom: template-concept
---

# Introduction to BMP

The **BGP Monitoring Protocol (BMP)** is a protocol designed to monitor BGP sessions. It provides a standardized method for collecting information about BGP sessions, which can be used for analysis, troubleshooting, and ensuring the stability and security of the network.

The BGP Monitoring Protocol (BMP) allows a monitoring station to connect to a router and collect all the BGP announcements received from the router's BGP peers. The announcements are sent to the station in the form of **BMP Route Monitoring messages** formed from path information in the router's **BGP Adj-Rib-In tables**. A BMP speaker may choose to send either **pre-policy routes, post-policy routes, or both**.

BMP is **unidirectional**: BMP sends messages only from the router to the monitoring station, never the other way around. The router's configuration controls the information sent. Besides Route Monitoring messages, BMP also sends these messages:

- **Initiation**: Sent at the beginning of a session and used to identify the router.
- **Termination**: Optionally sent at the end of a session to indicate why the session is being closed.
- **Peer Up**: Used to indicate if a BGP peer is in **Established** state.
- **Peer Down**: Used to indicate that a BGP peer has gone out of **Established** state.

Connections between the router and BMP stations use **TCP**. The router can either passively listen for incoming connections from a station or actively initiate them, configurable per station. Only **one connection per BMP station** is allowed at a time. If a station reconnects, the router closes the old session and starts a new BMP session with the new connection.

## Importance of BMP log monitoring

BMP log monitoring is crucial for maintaining the **health and performance** of BGP sessions. By continuously monitoring BMP logs, network administrators can detect anomalies, identify potential issues, and take proactive measures to prevent network disruptions. Effective BMP log monitoring helps in:

- Ensuring the **stability and reliability** of BGP sessions.
- Detecting and mitigating **security threats**.
- Analyzing **network performance** and identifying optimization opportunities.
- Troubleshooting and resolving **BGP-related issues** promptly.

## Key Components of BMP log monitoring

### **1. Data collection**
BMP logs provide detailed information about BGP sessions, including **route updates, peer status, and error messages**. Collecting this data is the first step in effective BMP log monitoring.

### **2. Data storage**
Storing BMP logs in a **centralized and secure location** is essential for easy access and analysis. This can be achieved using **log management systems** or **databases**.

### **3. Data analysis**
Analyzing BMP logs helps in identifying **patterns, trends, and anomalies**. Advanced analytics tools and techniques, such as **machine learning**, can be used to gain deeper insights into the network's behavior.

### **4. Alerting and reporting**
Setting up **alerts** for specific events or thresholds in BMP logs ensures that network administrators are **promptly notified** of any issues. **Regular reports** provide a comprehensive overview of the network's health and performance.

## Restrictions and limitations of BMP log streaming

### Nexus Network Fabric (NF) restrictions

Nexus NF shall not enable BMP Log streaming for the following BGP neighbors:

- INTERCEGLOBAL
- INTERCEEVPN
- INTERCEOPTION-A
- CETORUNDERLAY
- EVPN_OVERLAY

Nexus NF shall not support BMP Log streaming for RT-Membership and EVPN Address-family.

Nexus NF shall not support monitoring address-families at the station level, even though Nexus NF provides ARM API at the station level by facilitating the address-family. This limitation exists because Arista supports BGP Global level rather than BMP Station level.

### L3ISD requirements

- L3ISD must be enabled prior to associating the L3ISDs as Monitored Networks of any Network Monitors.
- L3ISD must be enabled prior to associating the L3ISDs Internal/External Network as Station Network of any Network Monitors.
- L3ISD shall not be disabled if the respective L3ISD internal/external network is associated under Station Network of any Network Monitors.

### Unsupported features

Nexus shall not support the following features:

- BMP support for VRF Filtering.
- BMP support for local rib VPN imported routes.
- BMP support for exporting Adj-Rib-Out.

### Peer-Address monitoring

Nexus NF shall not support excluding the monitoring of peer-address of neighbor groups where the neighbor group is configured with BGP listen range. This limitation is due to Arista's inability to support excluding the monitoring of certain addresses of neighbors configured with BGP listen-range.

### Network monitors

Nexus shall support a maximum of four Network Monitors (BMP Stations).

## Next steps
[How to enable / disable BMP log streaming](./howto-enable-log-streaming.md)