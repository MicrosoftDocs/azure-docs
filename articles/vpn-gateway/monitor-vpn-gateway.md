---
title: 'Monitoring Azure VPN Gateway'
description: Learn how to view VPN Gateway metrics using Azure Monitor.
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: how-to
ms.date: 11/08/2021
ms.author: alzam

---
# Monitoring VPN Gateway

You can monitor Azure VPN gateways using Azure Monitor. This article discusses metrics that are available through the portal. Metrics are lightweight and can support near real-time scenarios, making them useful for alerting and fast issue detection.


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

## The following steps help you locate and view metrics

1. Navigate to the virtual network gateway resource in the Portal
2. Select **Overview** to see the Total tunnel ingress and egress metrics.

   ![Selections for creating an alert rule](./media/monitor-vpn-gateway/overview.png "View")

3. To view any of the other metrics listed above. Click on the **Metrics** section under your virtual network gateway resource and select the metric from the drop down list.

   ![The Select button and the VPN gateway in the list of resources](./media/monitor-vpn-gateway/metrics.png "Select")

## Next steps

To configure alerts on tunnel metrics, see [Set up alerts on VPN Gateway metrics](vpn-gateway-howto-setup-alerts-virtual-network-gateway-metric.md).

To configure alerts on tunnel resource logs, see [Set up alerts on VPN Gateway resource logs](vpn-gateway-howto-setup-alerts-virtual-network-gateway-log.md).
