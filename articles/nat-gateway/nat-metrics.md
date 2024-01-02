---
title: Metrics and alerts for Azure NAT Gateway
titleSuffix: Azure Virtual Network
description: Understand Azure Monitor metrics and alerts available for NAT gateway.
author: asudbring
ms.service: nat-gateway
# Customer intent: As an IT administrator, I want to understand available Azure Monitor metrics and alerts for Virtual Network NAT.
ms.topic: conceptual
ms.date: 04/12/2022
ms.author: allensu
---
# Azure NAT Gateway metrics and alerts

This article provides an overview of all NAT gateway metrics and diagnostic capabilities. This article provides general guidance on how to use metrics and alerts to monitor, manage, and [troubleshoot](troubleshoot-nat.md) your NAT gateway resource. 

Azure NAT Gateway provides the following diagnostic capabilities:  

- Multi-dimensional metrics and alerts through Azure Monitor. You can use these metrics to monitor and manage your NAT gateway and to assist you in troubleshooting issues. 

- Network Insights: Azure Monitor Insights provides you with visual tools to view, monitor, and assist you in diagnosing issues with your NAT gateway resource. Insights provide you with a topological map of your Azure setup and metrics dashboards. 

:::image type="content" source="./media/nat-overview/flow-direction1.png" alt-text="Diagram of a NAT gateway that consumes all IP addresses for a public IP prefix. The NAT gateway directs traffic to and from two subnets of VMs and a virtual machine scale set.":::

*Figure: Azure NAT Gateway for outbound to Internet*

## Metrics overview

NAT gateway provides the following multi-dimensional metrics in Azure Monitor:

| Metric | Description | Recommended aggregation | Dimensions |
|---|---|---|---|
| Bytes | Bytes processed inbound and outbound | Sum | Direction (In; Out), Protocol (6 TCP; 17 UDP) |
| Packets | Packets processed inbound and outbound | Sum | Direction (In; Out), Protocol (6 TCP; 17 UDP) |
| Dropped Packets | Packets dropped by the NAT gateway | Sum | / |
| SNAT Connection Count | Number of new SNAT connections over a given interval of time | Sum | Connection State (Attempted, Failed), Protocol (6 TCP; 17 UDP) |
| Total SNAT Connection Count | Total number of active SNAT connections | Sum | Protocol (6 TCP; 17 UDP) |
| Datapath Availability | Availability of the data path of the NAT gateway. Used to determine whether the NAT gateway endpoints are available for outbound traffic flow. | Avg | Availability (0, 100) |

>[!NOTE]
> Count aggregation is not recommended for any of the NAT gateway metrics. Count aggregation adds up the number of metric values and not the metric values themselves. Use Sum aggregation instead to get the best representation of data values for connection count, bytes, and packets metrics.
>
> Use average for best represented health data for the datapath availability metric.
>
> See [aggregation types](/azure/azure-monitor/essentials/metrics-aggregation-explained#aggregation-types) for more information.

## Where to find my NAT gateway metrics

NAT gateway metrics can be found in the following locations in the Azure portal.

- **Metrics** page under **Monitoring** from a NAT gateway's resource page.

- **Insights** page under **Monitoring** from a NAT gateway's resource page.

    :::image type="content" source="./media/nat-metrics/nat-insights-metrics.png" alt-text="Screenshot of the insights and metrics options in NAT gateway overview.":::

- Azure Monitor page under **Metrics**.

    :::image type="content" source="./media/nat-metrics/azure-monitor.png" alt-text="Screenshot of the metrics section of Azure Monitor.":::

To view any one of your metrics for a given NAT gateway resource:

1. Select the NAT gateway resource you would like to monitor.

2. In the **Metric** drop-down menu, select one of the provided metrics.

3. In the **Aggregation** drop-down menu, select the recommended aggregation listed in the [metrics overview](#metrics-overview) table.

    :::image type="content" source="./media/nat-metrics/nat-metrics-1.png" alt-text="Screenshot of the metrics set up in NAT gateway resource.":::

4. To adjust the time frame over which the chosen metric is presented on the metrics graph or to adjust how frequently the chosen metric is measured, select the **Time** window in the top right corner of the metrics page and make your adjustments.

    :::image type="content" source="./media/nat-metrics/nat-metrics-2.png" alt-text="Screenshot of the metrics time setup configuration in NAT gateway resource.":::

## How to use NAT gateway metrics

### Bytes

The **Bytes** metric shows you the amount of data going outbound through NAT gateway and returning inbound in response to an outbound connection. 

Use this metric to:

- View the amount of data being processed through NAT gateway to connect outbound or return inbound.

To view the amount of data passing through NAT gateway:

1. Select the NAT gateway resource you would like to monitor. 

2. In the **Metric** drop-down menu, select the **Bytes** metric. 

3. In the **Aggregation** drop-down menu, select **Sum**.

4. Select to **Add filter**.

5. In the **Property** drop-down menu, select **Direction (Out | In)**.

6. In the **Values** drop-down menu, select **Out**, **In**, or both. 

7. To see data processed inbound or outbound as their own individual lines in the metric graph, select **Apply splitting**. 

8.  In the **Values** drop-down menu, select **Direction (Out | In)**.

### Packets

The packets metric shows you the number of data packets passing through NAT gateway. 

Use this metric to:
  
- Verify that traffic is passing outbound or returning inbound through NAT gateway. 

- View the amount of traffic going outbound through NAT gateway or returning inbound. 

To view the number of packets sent in one or both directions through NAT gateway, follow the same steps in the [Bytes](#bytes) section. 

### Dropped packets

The dropped packets metric shows you the number of data packets dropped by NAT gateway when traffic goes outbound or returns inbound in response to an outbound connection. 

Use this metric to: 

- Check if periods of dropped packets coincide with periods of failed SNAT connections with the [SNAT Connection Count](#snat-connection-count) metric. 

- Help determine if you're experiencing a pattern of failed outbound connections or SNAT port exhaustion. 

Possible reasons for dropped packets: 

- Outbound connectivity failure can cause packets to drop. Connectivity failure can happen for various reasons. See the [NAT gateway connectivity troubleshooting guide](/azure/nat-gateway/troubleshoot-nat-connectivity) to help you further diagnose. 

### SNAT connection count

The SNAT connection count metric shows you the number of new SNAT connections within a specified time frame. This metric can be filtered by **Attempted** and **Failed** connection states. A failed connection volume greater than zero can indicate SNAT port exhaustion.

Use this metric to: 

- Evaluate the health of your outbound connections.

- Help diagnose if your NAT gateway is experiencing SNAT port exhaustion.

- Determine if you're experiencing a pattern of failed outbound connections. 

To view the connection state of your connections:

1. Select the NAT gateway resource you would like to monitor. 

2. In the **Metric** drop-down menu, select the **SNAT Connection Count** metric.

3. In the **Aggregation** drop-down menu, select **Sum**. 

4. Select to **Add filter**.

5. In the **Property** drop-down menu, select **Connection State**.

6. In the **Values** drop-down menu, select **Attempted**, **Failed**, or both.

7. To see attempted and failed connections as their own individual lines in the metric graph, select **Apply splitting**.

8. In the **Values** drop-down menu, select **Connection State**.

    :::image type="content" source="./media/nat-metrics/nat-metrics-3.png" alt-text="Screenshot of the metrics configuration.":::

### Total SNAT connection count

The **Total SNAT connection count** metric shows you the total number of active SNAT connections passing through NAT gateway. 

You can use this metric to:

- Evaluate the volume of connections passing through NAT gateway.
  
- Determine if you're nearing the connection limit of NAT gateway.

- Help assess if you're experiencing a pattern of failed outbound connections. 

Possible reasons for failed connections:

- A pattern of failed connections can happen for various reasons. See the [NAT gateway connectivity troubleshooting guide](/azure/nat-gateway/troubleshoot-nat-connectivity) to help you further diagnose.

>[!NOTE]
> When NAT gateway is attached to a subnet and public IP address, the Azure platform verifies NAT gateway is healthy by conducting health checks. These health checks may appear in NAT gateway’s SNAT connection metrics, but are negligible and don’t impact NAT gateway’s ability to connect outbound.

### Datapath availability

The datapath availability metric measures the health of the NAT gateway resource over time. This metric indicates if NAT gateway is available for directing outbound traffic to the internet. This metric is a reflection of the health of the Azure infrastructure. 

You can use this metric to: 

- Monitor the availability of NAT gateway.

- Investigate the platform where your NAT gateway is deployed and determine if it’s healthy. 

- Isolate whether an event is related to your NAT gateway or to the underlying data plane. 

Possible reasons for a drop in data path availability include: 

- An infrastructure outage has occurred. 

- There aren't healthy VMs available in your NAT gateway configured subnet. For more information, see the [NAT gateway connectivity troubleshooting guide](/azure/nat-gateway/troubleshoot-nat-connectivity). 

## Alerts

Alerts can be configured in Azure Monitor for all NAT gateway metrics. These alerts proactively notify you when important conditions are found in your monitoring data. They allow you to identify and address potential issues with NAT gateway. 

For more information about how metric alerts work, see [Azure Monitor Metric Alerts](../azure-monitor/alerts/alerts-metric-overview.md). The following guidance describes how to configure some common and recommended types of alerts for your NAT gateway. 

### Alerts for datapath availability degradation

Set up an alert on datapath availability to help you detect issues with the health of NAT gateway.

The recommended guidance is to alert on NAT gateway’s datapath availability when it drops below 90% over a 15-minute period. This configuration is indicative of a NAT gateway resource being in a degraded state.

To set up a datapath availability alert, follow these steps:

1. From the NAT gateway resource page, select **Alerts**. 

2. Select **Create alert rule**. 

3. From the signal list, select **Datapath Availability**. 

4. From the **Operator** drop-down menu, select **Less than**. 

5. From the **Aggregation type** drop-down menu, select **Average**. 

6. In the **Threshold value** box, enter **90%**.

7. From the **Unit** drop-down menu, select **Count**. 

8. From the **Aggregation granularity (Period)** drop-down menu, select **15 minutes**. 

9. Create an **Action** for your alert by providing a name, notification type, and type of action that is performed when the alert is triggered.

10. Before deploying your action, **test the action group**.

11. Select **Create** to create the alert rule.

>[!NOTE]
>Aggregation granularity is the period of time over which the datapath availability is measured to determine if it has dropped below the threshold value. 
Setting the aggregation granularity to less than 5 minutes may trigger false positive alerts that detect noise in the datapath.

### Alerts for SNAT port exhaustion 

Set up an alert on the **SNAT connection count** metric to notify you of connection failures on your NAT gateway. A failed connection volume greater than zero can indicate that either you have reached the connection limit on your NAT gateway or that you have hit SNAT port exhaustion. Investigate further to determine the root cause of these failures.

To create the alert, use the following steps:

1. From the NAT gateway resource page, select **Alerts**. 

2. Select **Create alert rule**. 

3. From the signal list, select **SNAT Connection Count**. 

4. From the **Aggregation type** drop-down menu, select **Total**. 

5. From the **Operator** drop-down menu, select **Greater than**. 

6. From the **Unit** drop-down menu, select **Count**. 

7. In the **Threshold value** box, enter 0.

8. In the Split by dimensions section, select **Connection State** under Dimension name.

9. Under Dimension values, select **Failed** connections. 

8. From the When to evaluate section, select **1 minute** under the **Check every** drop-down menu.

9. For the lookback period, select **5 minutes** from the drop-down menu options. 

9. Create an **Action** for your alert by providing a name, notification type, and type of action that is performed when the alert is triggered.

10. Before deploying your action, **test the action group**.

11. Select **Create** to create the alert rule.

>[!NOTE]
>SNAT port exhaustion on your NAT gateway resource is uncommon. If you see SNAT port exhaustion, check if NAT gateway's idle timeout timer is set higher than the default amount of 4 minutes. A long idle timeout timer seeting can cause SNAT ports too be in hold down for longer, which results in exhausting SNAT port inventory sooner. You can also scale your NAT gateway with additional public IPs to increase NAT gateway's overall SNAT port inventory. To troubleshoot these kinds of issues, refer to the [NAT gateway connectivity troubleshooting guide](/azure/nat-gateway/troubleshoot-nat-connectivity#snat-exhaustion-due-to-nat-gateway-configuration). 

## Network Insights

[Azure Monitor Network Insights](../network-watcher/network-insights-overview.md) allows you to visualize your Azure infrastructure setup and to review all metrics for your NAT gateway resource from a preconfigured metrics dashboard. These visual tools help you diagnose and troubleshoot any issues with your NAT gateway resource. 

### View the topology of your Azure architectural setup

To view a topological map of your setup in Azure:

1. From your NAT gateway’s resource page, select **Insights** from the **Monitoring** section.

2. On the landing page for **Insights**, there's a topology map of your NAT gateway setup. This map shows the relationship between the different components of your network (subnets, virtual machines, public IP addresses). 

3. Hover over any component in the topology map to view configuration information.

    :::image type="content" source="./media/nat-metrics/nat-insights.png" alt-text="Screenshot of the Insights section of NAT gateway."::: 

### View all NAT gateway metrics in a dashboard

The metrics dashboard can be used to better understand the performance and health of your NAT gateway resource. The metrics dashboard shows a view of all metrics for NAT gateway on a single page.  

- All NAT gateway metrics can be viewed in a dashboard when selecting **Show Metrics Pane**.

    :::image type="content" source="./media/nat-metrics/nat-metrics-pane.png" alt-text="Screenshot of the show metrics pane."::: 

- A full page view of all NAT gateway metrics can be viewed when selecting **View Detailed Metrics**.

    :::image type="content" source="./media/nat-metrics/detailed-metrics.png" alt-text="Screenshot of the view detailed metrics."::: 

For more information on what each metric is showing you and how to analyze these metrics, see [How to use NAT gateway metrics](#how-to-use-nat-gateway-metrics).

## Next steps

* Learn about [Azure NAT Gateway](nat-overview.md)
* Learn about [NAT gateway resource](nat-gateway-resource.md)
* Learn about [Azure Monitor](../azure-monitor/overview.md)
* Learn about [troubleshooting NAT gateway resources](troubleshoot-nat.md).
* Learn about [troubleshooting NAT gateway connectivity](/azure/nat-gateway/troubleshoot-nat-connectivity)
