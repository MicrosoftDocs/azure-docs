---
title: 'How to set up alerts on Azure VPN Gateway metrics'
description: Steps to configure alerts on VPN Gateway metrics
services: vpn-gateway
author: anzaman

ms.service: vpn-gateway
ms.topic: conceptional
ms.date: 04/22/2019
ms.author: alzam

---
# Setting up alerts on VPN Gateway metrics

This article helps you set up alerts for VPN Gateway metrics. Azure monitor provides the ability to set up alerts for Azure resources. Alerts can be set up for virtual network gateways of "VPN" type.


|**Metric**   | **Unit** | **Granularity** | **Description** | 
|---       | ---        | ---       | ---            | ---       |
|**AverageBandwidth**| Bytes/s  | 5 minutes| Average combined bandwidth utilization of all site-to-site connections on gateway.     |
|**P2SBandwidth**| Bytes/s  | 1 minute  | Average combined bandwidth utilization of all point-to-site connections on gateway.    |
|**P2SConnectionCount**| Count  | 1 minute  | Count of P2S connections on gateway.   |
|**TunnelAverageBandwidth** | Bytes/s    | 5 minutes  | Average bandwidth utilization of tunnels created on the gateway. |
|**TunnelEgressBytes** | Bytes | 5 minutes | Outgoing traffic on tunnels created on the gateway.   |
|**TunnelEgressPackets** | Count | 5 minutes | Count of outgoing packets on tunnels created on the gateway.   |
|**TunnelEgressPacketDropTSMismatch** | Count | 5 minutes | Count of outgoing packets dropped on tunnels caused by TS mismatch. |
|**TunnelIngressBytes** | Bytes | 5 minutes | Incoming traffic on tunnels created on the gateway.   |
|**TunnelIngressPackets** | Count | 5 minutes | Count of incoming packets on tunnels created on the gateway.   |
|**TunnelIngressPacketDropTSMismatch** | Count | 5 minutes | Count of incoming packets dropped on tunnels caused by TS mismatch. |


## <a name="setup"></a>Setup Azure Monitor alerts based on metrics using the portal

The example steps below will create an alert on a gateway for: <br>

**Metric:** Tunnel Average Bandwidth <br>
**Condition:** bandwidth > 10 Bytes/second <br>
**Window:** 5 minutes <br>
**Alert action:** Email <br>



1. Navigate to the virtual network gateway resource and select "Alerts" from the Monitoring tab, then create a new alert rule or edit an existing alert rule.

![point-to-site](./media/vpn-gateway-howto-setup-alerts-virtual-network-gateway-metric/metric-alert1.png "Create")

2. Select your VPN gateway as the resource.

![point-to-site](./media/vpn-gateway-howto-setup-alerts-virtual-network-gateway-metric/metric-alert2.png "Select")

3. Select a metric to configure for the alert
![point-to-site](./media/vpn-gateway-howto-setup-alerts-virtual-network-gateway-metric/metric-alert3.png "Select")
4. Configure the signal logic. There are three components to signal logic:

    a. Dimensions: If the metric has dimensions, specific dimension values can be selected so that the alert only evaluates data of that dimension. These are optional.<br>
    b. Condition: The operation to evaluate the metric value.<br>
    c. Time: Specify the granularity of metric data, and the period of time to evaluate the alert on.<br>

![point-to-site](./media/vpn-gateway-howto-setup-alerts-virtual-network-gateway-metric/metric-alert4.png "Select")

5. To view the configured rules, click on "Manage alert rules"
![point-to-site](./media/vpn-gateway-howto-setup-alerts-virtual-network-gateway-metric/metric-alert8.png "Select")

## Next steps

To configure alerts on tunnel diagnostics logs, see [How to setup alerts on VPN Gateway diagnostic logs](vpn-gateway-howto-setup-alerts-virtual-network-gateway-log.md).
