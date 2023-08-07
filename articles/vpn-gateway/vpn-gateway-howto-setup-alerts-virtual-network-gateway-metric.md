---
title: 'Set up alerts on Azure VPN Gateway metrics'
description: Learn about alerts based on metrics for virtual network VPN gateways.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 07/25/2022
ms.author: cherylmc

---
# Set up alerts on VPN Gateway metrics

Azure Monitor provides the ability to set up alerts for Azure resources. You can set up alerts for virtual network gateways of the "VPN" type.

For steps, see [Tutorial: Create a metric alert for an Azure resource](../azure-monitor/alerts/tutorial-metric-alert.md) and [Create, view, and manage metric alerts using Azure Monitor](../azure-monitor/alerts/alerts-metric.md).

## Metrics

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

## Next steps

* For more information about monitoring Azure VPN Gateway, see [Monitor VPN Gateway](monitor-vpn-gateway.md).
* For more information about alerts, see [What are Azure Monitor Alerts](../azure-monitor/alerts/alerts-overview.md).
* For more information about alert types, see [Alert types](../azure-monitor/alerts/alerts-types.md).
