---
title: 'Set up alerts on Azure VPN Gateway metrics'
description: Learn how to use the Azure portal to set up Azure Monitor alerts based on metrics for virtual network VPN gateways.
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: how-to
ms.date: 09/03/2020
ms.author: alzam

---
# Set up alerts on VPN Gateway metrics

This article helps you set up alerts on Azure VPN Gateway metrics. Azure Monitor provides the ability to set up alerts for Azure resources. You can set up alerts for virtual network gateways of the "VPN" type.

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

## <a name="setup"></a>Set up Azure Monitor alerts based on metrics by using the Azure portal

The following example steps will create an alert on a gateway for:

- **Metric:** TunnelAverageBandwidth
- **Condition:** Bandwidth > 10 bytes/second
- **Window:** 5 minutes
- **Alert action:** Email



1. Go to the virtual network gateway resource and select **Alerts** from the **Monitoring** tab. Then create a new alert rule or edit an existing alert rule.

   ![Selections for creating an alert rule](./media/vpn-gateway-howto-setup-alerts-virtual-network-gateway-metric/metric-alert1.png "Create")

2. Select your VPN gateway as the resource.

   ![The Select button and the VPN gateway in the list of resources](./media/vpn-gateway-howto-setup-alerts-virtual-network-gateway-metric/metric-alert2.png "Select")

3. Select a metric to configure for the alert.

   ![Selected metric in the list of metrics](./media/vpn-gateway-howto-setup-alerts-virtual-network-gateway-metric/metric-alert3.png "Select")
4. Configure the signal logic. There are three components to it:

    a. **Dimensions**: If the metric has dimensions, you can select specific dimension values so that the alert evaluates only data of that dimension. These are optional.

    b. **Condition**: This is the operation to evaluate the metric value.

    c. **Time**: Specify the granularity of metric data, and the period of time to evaluate the alert.

   ![Details for configuring signal logic](./media/vpn-gateway-howto-setup-alerts-virtual-network-gateway-metric/metric-alert4.png "Select")

5. To view the configured rules, select **Manage alert rules**.

   ![Button for managing alert rules](./media/vpn-gateway-howto-setup-alerts-virtual-network-gateway-metric/metric-alert8.png "Select")

## Next steps

To configure alerts on tunnel resource logs, see [Set up alerts on VPN Gateway resource logs](vpn-gateway-howto-setup-alerts-virtual-network-gateway-log.md).
