---
title: Metrics and alerts for Azure Virtual Network NAT
titleSuffix: Azure Virtual Network
description: Understand Azure Monitor metrics and alerts available for Virtual Network NAT.
services: virtual-network
documentationcenter: na
author: asudbring
manager: KumudD
ms.service: virtual-network
ms.subservice: nat
# Customer intent: As an IT administrator, I want to understand available Azure Monitor metrics and alerts for Virtual Network NAT.
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/04/2020
ms.author: allensu
---

# Azure Virtual Network NAT metrics

This article provides an overview of all NAT gateway metrics and diagnostic capabilities and provides general guidance on how to use metrics and alerts to monitor, manage, and [troubleshoot](troubleshoot-nat.md) your NAT gateway resource(s). 

Azure Virtual Network NAT gateway provides the following diagnostic capabilities:  
- Multi-dimensional metrics and alerts through Azure Monitor. You can use these metrics to monitor and manage your NAT gateway and to assist you in troubleshooting issues. 
- Network Insights: Azure Monitor Insights provides you with visual tools to view, monitor, and assist you in diagnosing issues with your NAT gateway resource. Insights provides you with a topological map of your Azure setup as well as health and metrics dashboards. 

:::image type="content" source="./media/nat-overview/flow-direction1.png" alt-text="Diagram depicts a NAT gateway resource that consumes all IP addresses for a public IP prefix and directs traffic to and from two subnets of VMs and a virtual machine scale set.":::

*Figure: Virtual Network NAT for outbound to Internet*

## Metrics Overview

NAT gateway resources provide the following multi-dimensional metrics in Azure Monitor:

| Metric | Description | Recommended aggregation | Dimensions |
|---|---|---|---|
| Bytes | Bytes processed inbound and outbound | Sum | Direction (In; Out), Protocol (6 TCP; 17 UDP) |
| Packets | Packets processed inbound and outbound | Sum | Direction (In; Out), Protocol (6 TCP; 17 UDP) |
| Dropped packets | Packets dropped by the NAT gateway | Sum | / |
| SNAT Connection Count | Number of SNAT connections / State transitions per interval of time | Sum | Connection State, Protocol (6 TCP; 17 UDP) |
| Total SNAT connection count | Current active SNAT connections (~ SNAT ports currently in use by NAT gateway) | Sum | Protocol (6 TCP; 17 UDP) |
| Datapath availability (Preview) | Availability of the data path of the NAT gateway. Used to determine whether the NAT gateway endpoints are available for outbound traffic flow. | Avg | Availability (0, 100) |

## Where to find my NAT gateway metrics

NAT gateway metrics can be found in the following locations in the Azure portal.
1. **Metrics** page under **Monitoring** from a NAT gateway's resource page.
2. **Insights** page under **Monitoring** from a NAT gateway's resource page.
3. Azure Monitor page under **Metrics**

To view any one of your metrics for a given NAT gateway resource:
1. Select the NAT gateway resource you would like to monitor.
2. In the **Metric** drop down menu, select one of the provided metrics.
3. In the **Aggregation** drop down menu, select the recommended aggregation listed in the [metrics overview](#metrics-overview) table. 
4. To adjust the timeframe over which the chosen metric is presented on the metrics graph or to adjust how frequently the chosen metric is measured, select the **Time** window in the top right corner of the metrics page and make your adjustments. 

## How to use NAT gateway metrics

### Bytes

The Bytes metric informs you on the amount of data going outbound through NAT gateway and that returns inbound through NAT gateway in response to an outbound connection. Use this metric to: 
- Assess the amount of data being processed through NAT gateway to connect outbound or return inbound. 

To view the amount of data sent in one or both directions when connecting outbound through NAT gateway, follow these steps: 
1. Select the NAT gateway resource you would like to monitor. 
2. In the **Metric** drop down menu, select the **Bytes** metric. 
3. In the **Aggregation** drop down menu, select **Sum**.
4.  Select to **Add filter**.
5.  In the **Property** drop down menu, select **Direction (Out | In)**.
6.  In the **Values** drop down menu, select **Out**, **In**, or both. 
7.  To see data processed inbound or outbound as their own individual lines in the metric graph, select **Apply splitting**. 
8.  In the **Values** drop down menu, select **Direction (Out | In)**.

### Packets

The packets metric informs you of the amount of data packets being transmitted outbound through NAT gateway and that returns inbound through NAT gateway in response to an outbound connection. Use this metric to:  
- To confirm that traffic is being sent through your NAT gateway to go outbound to the internet or return inbound. 
- To assess the amount of traffic being directed through your NAT gateway resource outbound or inbound (when in response to an outbound directed flow). 

To view the amount of packets sent in one or both directions when connecting outbound through NAT gateway, follow the same steps in the [Bytes](#bytes) section. 

### Dropped Packets

The dropped packets metric informs you of the amount of data packets that have been dropped by NAT gateway when directing traffic outbound or inbound in response to an outbound connection. Use this metric to: 
- Assess whether or not you are nearing or possibly experiencing SNAT exhaustion with a given NAT gateway resource. This assessment can be done when evaluating if periods of dropped packets coincide with the periods of failed SNAT connections with the [Total SNAT Connection Count](#total-snat-connection-count) metric. 
- Help assess if you are experiencing a pattern of failed outbound connections. 

Reasons for why you may see dropped packets: 
- If you are experiencing a high rate of dropped packets, you may be experiencing outbound connectivity issues for a variety of reasons. See the NAT gateway [troubleshooting guide](/azure/virtual-network/nat-gateway/troubleshoot-nat) to help you further diagnose. 

### SNAT Connection Count

The SNAT connection count metric informs you on the transition state for the number of newly used SNAT ports within a specified timeframe. Use this metric to: 
- Evaluate the number of successful and failed attempts to make outbound connections.
- Help assess if you are experiencing a pattern of failed outbound connections. 

To view the number of attempted and failed connections, follow these steps: 
1. Select the NAT gateway resource you would like to monitor. 
2. In the **Metric** drop down menu, select the **SNAT Connection Count** metric.
3. In the **Aggregation** drop down menu, select **Sum**. 
4. Select to **Add filter**.
5. In the **Property** drop down menu, select **Connection State**.
6. In the **Values** drop down menu, select **Attempted**, **Failed**, or both.
7. To see attempted and failed connections as their own individual lines in the metric graph, select **Apply splitting**.
8. In the Values drop down menu, select Connection State.

Reasons for why you may see failed connections: 
- If you are seeing a pattern of failed connections for your NAT gateway resource, there could be multiple possible reasons. See the NAT gateway [troubleshooting guide](/azure/virtual-network/nat-gateway/troubleshoot-nat) to help you further diagnose.  

### Total SNAT Connection Count

The Total SNAT connection count metric shows you the total number of active SNAT connections over a set period of time. You can use this metric to: 
- Monitor SNAT port utilization on a given NAT gateway resource. 
- Analyze over a given time interval to provide insight on whether or not NAT gateway connectivity should be scaled out further by adding more public IPs. 
- Assess whether or not you are nearing or possibly experiencing SNAT exhaustion with a given NAT gateway resource.

### Datapath availability (Preview)

The NAT gateway datapath availability metric measures the availability of the NAT gateway resource over a set interval of time. This metric informs on whether or not NAT gateway is available for directing outbound traffic to the internet. This metric is a reflection of the health of the Azure infrastructure. You can use this metric to: 
- Monitor the availability of your NAT gateway resource.
- Investigate the platform where your NAT gateway is deployed and determine if it’s healthy. 
- Isolate whether an event is related to your NAT gateway or to the underlying data plane. 

Reasons for why you may see a drop in datapath availability include: 
- An infrastructure outage has occurred. 
- There are no healthy VMs available in your NAT gateway configured subnet. To further investigate, refer to the NAT gateway [troubleshooting guide](/azure/virtual-network/nat-gateway/troubleshoot-nat) for more information. 

## Alerts

Alerts can be configured in Azure Monitor for each of the preceding metrics. These alerts proactively notify you when important conditions are found in your monitoring data. They allow you to identify and address potential issues with your NAT gateway resource.  For more information about how metric alerts work, see [Azure Monitor Metric Alerts](/azure/azure-monitor/alerts/alerts-metric-overview). See guidance below on how to configure some common and recommended types of alerts for your NAT gateway. 

### Alerts for SNAT port usage

Set up an alert with the Total SNAT connection count metric in order to be alerted to when the number of active SNAT ports in use is nearing the limit of available SNAT ports for a given NAT gateway resource. To set up an alert for nearing SNAT exhaustion, follow these steps: 
1. From the NAT gateway resource page, select **Alerts**. 
2. Select **Create alert rule**. 
3. From the signal list, select **Total SNAT Connection Count**. 
4. From the **Operator** drop down menu, select **Less than or equal to**. 
5. From the **Aggregation type** drop down menu, select **Total**. 
6. In the **Threshold value** box, enter a percentage value that the Total SNAT connection count must drop below before an alert is fired. When deciding what threshold value to use, keep in mind how much you have scaled out your NAT gateway outbound connectivity with public IP addresses. See [scale NAT gateway](/azure/virtual-network/nat-gateway/nat-gateway-resource#scale-nat-gateway) for more information. 
7. From the **Unit** drop down menu, select **Count**. 
8. From the **Aggregation granularity (Period)** drop down menu, select a time period over which you would like the SNAT connection count to be measured. 
9. Create an **Action** for your alert by providing a name, notification type, and type of action that is performed when the alert is triggered.
10. Before deploying your action, **test the action group**.
11. Select **Create** to create the alert rule.

[!NOTE]
SNAT exhaustion on your NAT gateway resource is uncommon. If you do see SNAT exhaustion, it is likely the result of NAT gateway’s idle timeout timer configurations holding on to SNAT ports too long or your NAT gateway needing to be scaled out further with additional public IPs. To troubleshoot these kinds of issues, refer to the NAT gateway troubleshooting guide. 

## Network Insights

[Azure Monitor Network Insights](/azure/azure-monitor/insights/network-insights-overview) allows you to visualize your Azure infrastructure set up and to review all metrics for your NAT gateway resource from a pre-configured metrics dashboard. These visual tools are provided to help inform and help you in diagnosing and troubleshooting any issues with your NAT gateway resource when they arise. 

### View the topology of your Azure architectural setup

To view a topological map of your setup in Azure, follow these steps:
1. From your NAT gateway’s resource page, select **Insights** from the **Monitoring** section.  
2. On the landing page for Insights, you will see a topology map of your NAT gateway setup. This map will show you the relationship between the different components of your network (ie subnets, virtual machines, public IP addresses). 
3. You can hover over any component in the topology map to view configuration information.  

### View all NAT gateway metrics in a dashboard

The metrics dashboard can be used to better understand the performance and health of your NAT gateway resource by providing you with a view of all metrics for the NAT gateway on a single page.  
1. All NAT gateway metrics can be viewed in a dashboard that slides out as a blade when selecting **Show Metrics Pane**.
2. A full page view of all NAT gateway metrics can be viewed when selecting **View Detailed Metrics**.

For more information on what each metric is showing you and how to analyze these metrics, see [How to use NAT gateway metrics](#how-to-use-nat-gateway-metrics).

## Limitations

Resource health isn't supported.

## Next steps

* Learn about [Virtual Network NAT](nat-overview.md)
* Learn about [NAT gateway resource](nat-gateway-resource.md)
* Learn about [Azure Monitor](../../azure-monitor/overview.md)
* Learn about [troubleshooting NAT gateway resources](troubleshoot-nat.md).
