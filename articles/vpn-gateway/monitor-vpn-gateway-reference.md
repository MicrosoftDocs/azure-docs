---
title: 'Monitoring Azure VPN Gateway - Data reference'
description: Learn about Azure VPN Gateway logs and metrics using Azure Monitor.
author: cherylmc
ms.service: vpn-gateway
ms.topic: reference
ms.date: 07/25/2022
ms.author: cherylmc
ms.custom: subject-monitoring

---

# Monitoring VPN Gateway data reference

This article provides a reference of log and metric data collected to analyze the performance and availability of VPN Gateway. See [Monitoring VPN Gateway](monitor-vpn-gateway.md) for details on collecting and analyzing monitoring data for VPN Gateway.

## <a name="metrics"></a>Metrics

Metrics in Azure Monitor are numerical values that describe some aspect of a system at a particular time. Metrics are collected every minute, and are useful for alerting because they can be sampled frequently. An alert can be fired quickly with relatively simple logic.

| **Metric**                                 | **Unit**     | **Granularity**     | **Description**                                                                         |
| -------------------------------------------| ------------ | ------------------- | --------------------------------------------------------------------------------------- |
| **BGP Peer Status**                        | Count        | 5 minutes           | Average BGP connectivity status per peer and per instance.                              |
| **BGP Routes Advertised**                  | Count        | 5 minutes           | Number of routes advertised per peer and per instance.                                  |
| **BGP Routes Learned**                     | Count        | 5 minutes           | Number of routes learned per peer and per instance.                                     |
| **Gateway P2S Bandwidth**                  | Bytes/s      | 1 minute            | Average combined bandwidth utilization of all point-to-site connections on the gateway. |
| **Gateway S2S Bandwidth**                  | Bytes/s      | 5 minutes           | Average combined bandwidth utilization of all site-to-site connections on the gateway.  |
| **P2S Connection Count**                   | Count        | 1 minute            | Count of point-to-site connections on the gateway.                                      |
| **Tunnel Bandwidth**                       | Bytes/s      | 5 minutes           | Average bandwidth utilization of tunnels created on the gateway.                        |
| **Tunnel Egress Bytes**                    | Bytes        | 5 minutes           | Number of outgoing bytes from a tunnel.                                                 |
| **Tunnel Egress Packet Drop Count**        | Count        | 5 minutes           | Number of outgoing packets dropped by a tunnel.                                         |
| **Tunnel Egress Packets**                  | Count        | 5 minutes           | Number of outgoing packets from a tunnel.                                               |
| **Tunnel Egress TS Mismatch Packet Drop**  | Count        | 5 minutes           | Number of outgoing packets dropped by tunnels caused by traffic-selector mismatch.      |
| **Tunnel Ingress Bytes**                   | Bytes        | 5 minutes           | Number of incoming bytes to a tunnel.                                                   |
| **Tunnel Ingress Packet Drop Count**       | Count        | 5 minutes           | Number of incoming packets dropped by a tunnel.                                         |
| **Tunnel Ingress Packets**                 | Count        | 5 minutes           | Number of incoming packets to a tunnel.                                                 |
| **Tunnel Ingress TS Mismatch Packet Drop** | Count        | 5 minutes           | Number of incoming packets dropped by tunnels caused by traffic-selector mismatch.      |
| **Tunnel MMSA Count**                      | Count        | 5 minutes           | Number of main mode security associations present.                                      |
| **Tunnel Peak PPS**                        | Count        | 5 minutes           | Max number of packets per second per tunnel.                                            |
| **Tunnel QMSA Count**                      | Count        | 5 minutes           | Number of quick mode security associations present.                                     |
| **Tunnel Total Flow Count**                | Count        | 5 minutes           | Number of distinct flows created per tunnel.                                            |
| **User Vpn Route Count**                   | Count        | 5 minutes           | Number of user VPN routes configured on the VPN Gateway.                                |
| **VNet Address Prefix Count**              | Count        | 5 minutes           | Number of VNet address prefixes that are used/advertised by the gateway.                |

## Resource logs

The following resource logs are available in Azure:

|***Name*** | ***Description*** |
|--- | --- |
|GatewayDiagnosticLog | Contains resource logs for gateway configuration events, primary changes, and maintenance events |
|TunnelDiagnosticLog | Contains tunnel state change events. Tunnel connect/disconnect events have a summarized reason for the state change if applicable |
|RouteDiagnosticLog | Logs changes to static routes and BGP events that occur on the gateway |
|IKEDiagnosticLog | Logs IKE control messages and events on the gateway |
|P2SDiagnosticLog | Logs point-to-site control messages and events on the gateway. Connection source info is provided for IKEv2 and OpenVPN connections only |

## Next steps

* For additional information about VPN Gateway monitoring, see [Monitoring Azure VPN Gateway](monitor-vpn-gateway.md).
* To learn more about metrics in Azure Monitor, see [Metrics in Azure Monitor](../azure-monitor/essentials/data-platform-metrics.md).