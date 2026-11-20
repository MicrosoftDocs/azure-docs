---
title: Monitor device connectivity health in Azure IoT Hub
description: Learn how to tell expected device reconnections from real connectivity problems by using IoT Hub and DPS metrics, an Azure Monitor workbook, and metric alerts.
author: jesusbar
ms.author: jesusbar
ms.reviewer: jesusbar
ms.service: azure-iot-hub
ms.topic: how-to
ms.date: 11/20/2026
ms.custom:
  - 'Role: Cloud Development'
  - 'Role: Technical Support'
  - iot
ai-usage: ai-assisted
#customer intent: As an operator of a large device fleet, I want to know which metrics show a real connectivity problem so that I can tell expected reconnections apart from issues that need action.
---

# Monitor device connectivity health in Azure IoT Hub

Devices that connect to Azure IoT Hub disconnect and reconnect as part of normal operation. Across a large fleet, these reconnections appear as spikes in connection metrics, and a spike can look like an outage even when every device reconnects successfully.

This article shows you how to judge connectivity health by whether your devices stay connected and whether their operations succeed, instead of by how often they connect. You learn how to:

> [!div class="checklist"]
> * Read the **Successful connects** and **Connected devices** metrics together.
> * Recognize the patterns that need action and the patterns that don't.
> * Build an Azure Monitor workbook that shows connectivity health for one or many IoT hubs.
> * Create alerts for sustained connectivity loss instead of for connection activity.
> * Decide when to contact support and what information to include.

## Prerequisites

- An IoT hub with connected devices. If you provision devices with the IoT Hub Device Provisioning Service (DPS), the DPS instance that's linked to the hub.
- The **Monitoring Reader** role, or a role with equivalent read access, on the IoT hubs and DPS instances that you want to monitor.
- To save a shared workbook, the **Workbook Contributor** or **Monitoring Contributor** role on the resource group where you save it. To create alert rules, the **Monitoring Contributor** role.
- Optional: a diagnostic setting that sends the IoT Hub **Connections** resource log category to a Log Analytics workspace. You need it only for the optional connection errors section of the workbook. To create one, see [Tutorial: Set up and use metrics and logs with an IoT hub](tutorial-use-metrics-and-diags.md).

## Understand the two connectivity signals

IoT Hub emits two platform metrics that describe device connectivity. They measure different things, so always read them together.

| Metric | REST API name | What it measures | Aggregation |
|---|---|---|---|
| **Successful connects** | `connect.success` | Every successful device connection, including each reconnection. | **Sum** |
| **Connected devices** | `connectedDeviceCount` | The number of devices that are connected to the hub. | **Average** for the trend, and **Minimum** for the lowest value in each interval |

**Successful connects** measures connection *activity*. A spike means that many devices connected successfully in a short time, which is what happens when devices reconnect. It doesn't tell you whether any devices are still offline. It counts connections, not devices: a device that reconnects several times is counted each time, so don't compare its total with the number of devices in your fleet.

**Connected devices** measures connection *health*. If it stays near its usual level, your fleet is connected, even when **Successful connects** spikes.

**Connected devices** is a snapshot metric. It supports only the **Average**, **Minimum**, and **Maximum** aggregations, it has no dimensions, and you can't export it through diagnostic settings. Build charts and alerts for it from Azure Monitor metrics, not from a Log Analytics workspace. For details about both metrics and their dimensions, see [Azure IoT Hub monitoring data reference](monitor-iot-hub-reference.md).

### Example: a temporary connectivity event

The examples in this article use a fictional fleet of about 150,000 registered devices. Most of the devices connect to an IoT hub named *fabrikam-prod-hub-01*, where **Connected devices** usually stays between about 143,000 and 146,000. The devices are provisioned through a DPS instance named *fabrikam-prod-dps*, which is linked to *fabrikam-prod-hub-01*, *fabrikam-prod-hub-02*, and *fabrikam-prod-hub-03*. Except for the sustained connectivity loss example, the screenshots come from the same 24-hour period, which includes two routine reconnection waves overnight and a temporary connectivity event at about 10:24 AM. These values describe this fictional hub only. They aren't typical or expected values for IoT Hub.

> [!NOTE]
> The screenshots in this article use fictional resources and synthetic data. Azure Monitor metrics explorer, Azure Workbooks, Azure Service Health, and other Azure portal experiences change independently of Azure IoT Hub, so the controls and labels that you see in the portal might differ from these screenshots.

To view a metric for one hub, go to the hub in the [Azure portal](https://portal.azure.com), and under **Monitoring**, select **Metrics**. The following chart shows **Connected devices** with the **Average** aggregation over the last 24 hours. At about 1:50 AM and 3:40 AM, the value dips during two routine reconnection waves and returns to its usual level each time. At about 10:24 AM, it drops from about 145,000 to about 125,000, and then it returns to its usual level by about 11:45 AM.

:::image type="complex" source="media/how-to-monitor-device-connectivity-health/metrics-connected-devices.png" alt-text="Screenshot of metrics explorer that shows Connected devices dipping twice overnight and dropping to about 125,000 at 10:24 AM, recovering each time." lightbox="media/how-to-monitor-device-connectivity-health/metrics-connected-devices.png":::
   Metrics explorer for the IoT hub fabrikam-prod-hub-01, with the Average aggregation of Connected devices over the last 24 hours at a 5-minute granularity. The line stays between about 143,000 and 146,000 for most of the day. Two shorter dips, to about 140,000 at about 1:50 AM and to about 129,000 at about 3:40 AM, return to the usual level within about 20 and 45 minutes. At about 10:24 AM, it drops to about 125,000, and then it climbs back to its usual level by about 11:45 AM.
:::image-end:::

The following chart shows **Successful connects** with the **Sum** aggregation for the same hub and time range. While devices reconnect after 10:24 AM, connection activity rises to about 7,000 connections in a 5-minute interval and stays elevated until about noon. The smaller spikes at about 1:50 AM and 3:40 AM are the routine reconnection waves: **Connected devices** dips at those times and returns to its usual level. The legend total, about 301,000 for a hub with about 145,000 connected devices, shows why you shouldn't read **Successful connects** as a device count.

:::image type="complex" source="media/how-to-monitor-device-connectivity-health/metrics-successful-connects.png" alt-text="Screenshot of metrics explorer that shows Successful connects for the same IoT hub, with a large spike while devices reconnect after 10:24 AM." lightbox="media/how-to-monitor-device-connectivity-health/metrics-successful-connects.png":::
   Metrics explorer for fabrikam-prod-hub-01, with the Sum aggregation of Successful connects over the same 24 hours. The line stays below about 1,500 connections in each 5-minute interval for most of the day, with spikes to about 3,300 shortly after 1:50 AM and to about 4,000 shortly after 3:40 AM. After 10:24 AM, it rises to about 7,000 and stays elevated until about noon while devices reconnect. The legend total, about 301,000, counts connections, not distinct devices.
:::image-end:::

### Why devices reconnect

[Transient disconnects are normal and expected](concepts-manage-device-reconnections.md#what-causes-disconnections) in cloud-connected applications. Common reasons include:

- **Token renewal.** Some Azure IoT device SDKs disconnect and reconnect when they renew SAS tokens over MQTT. For details, see [MQTT device disconnect behavior with Azure IoT SDKs](iot-hub-troubleshoot-connectivity.md#mqtt-device-disconnect-behavior-with-azure-iot-sdks).
- **Device and network changes.** Device restarts, firmware updates, and changes in the device's network close connections.
- **Service operations.** Updates to the service and its underlying platform, and the balancing of connections across the service's infrastructure, close existing connections. These operations can affect a hub's connections in waves, so reconnection activity can recur over a period of time, and an individual device might reconnect more than once. Devices that follow the [recommended reconnection flow](concepts-manage-device-reconnections.md#hub-reconnection-flow) reconnect to the same hub without reprovisioning. For more information, see [Resilience to service maintenance](/azure/reliability/reliability-iot-hub#resilience-to-service-maintenance).

## Recognize the patterns that need action

Compare the two metrics for the same hub over the same time range. Then check whether device operations still succeed.

> [!IMPORTANT]
> The values in this article's examples, such as device counts, dips, recovery times, and alert thresholds, describe a fictional hub. They aren't typical or expected values for IoT Hub, and they aren't service-level targets or commitments. Base your own values on your hub's history.
>
> The metrics, patterns, and alerts in this article are for operational monitoring. They don't measure availability as defined in the IoT Hub service-level agreement (SLA). Don't use them to determine whether the SLA, or any contractual or compliance requirement, was met. For information about the SLA, see [Service-level agreement](/azure/reliability/reliability-iot-hub#service-level-agreement).

| What you see | What it means | What to do |
|---|---|---|
| **Successful connects** spikes, and **Connected devices** stays near its usual level. | Devices disconnected and reconnected successfully. | No action is needed. |
| **Successful connects** spikes, and **Connected devices** dips and then returns to its usual level within your usual recovery time. | Devices reconnected. The dip reflects the time between disconnecting and reconnecting. | No action is needed. |
| **Connected devices** drops and stays below its usual level. | Devices aren't reconnecting, or they can't stay connected. | Check device retry behavior, connection errors, and the hub's resource health. If the condition persists, [contact support](#check-before-you-contact-support). |
| Device operations fail while **Connected devices** is at its usual level. For example, **Telemetry messages sent** falls below **Telemetry message send attempts**, or failed direct methods or twin updates increase. | Something other than reconnection affects your solution. | Investigate the failing operation, starting with the throttling and quota metrics. |
| **Number of throttling errors** increases, or **Total number of messages used** approaches the daily quota. | The hub is reaching a capacity limit. | Reduce traffic or scale the hub. For limits, see [IoT Hub quotas and throttling](iot-hub-devguide-quotas-throttling.md). |
| DPS **Registration attempts** increase while devices reconnect to a hub, or registrations fail. | Devices might be reprovisioning instead of reconnecting, or DPS can't assign them to a hub. | Review your devices' [reconnection logic](concepts-manage-device-reconnections.md#hub-with-dps-reconnection-flow), and check failed registrations for each hub. |

The following example shows reconnections that need no action. During two reconnection waves, **Connected devices** dips and then returns to its usual level each time, while **Successful connects** rises as the devices reconnect. How far the count dips and how long it takes to recover depend on how many connections close and on when your devices retry, so compare a dip with your own hub's history, not with the values in this example:

:::image type="complex" source="media/how-to-monitor-device-connectivity-health/expected-reconnections.png" alt-text="Screenshot of workbook charts that show Connected devices dipping twice and returning to its usual level while Successful connects rises." lightbox="media/how-to-monitor-device-connectivity-health/expected-reconnections.png":::
   Two workbook charts for fabrikam-prod-hub-01 over the same four hours, from about 12:47 AM to 4:47 AM. In the top chart, Connected devices (connectedDeviceCount) stays at about 144,000 except during two dips. At about 1:50 AM, it dips to about 138,000 and returns to its usual level within about 20 minutes. At about 3:40 AM, it dips to about 129,000 and returns to its usual level within about 45 minutes. In the bottom chart, Successful connects (connect.success) rises from about 100 connections per minute to about 1,200 at about 1:53 AM, and stays between about 300 and 900 connections per minute from about 3:40 AM to 4:25 AM while devices reconnect. The devices reconnected and Connected devices recovered each time, so no action is needed.
:::image-end:::


The following example shows sustained connectivity loss that might need investigation:

:::image type="complex" source="media/how-to-monitor-device-connectivity-health/sustained-connectivity-loss.png" alt-text="Screenshot of workbook charts that show Connected devices dropping below its usual level and staying there before it recovers." lightbox="media/how-to-monitor-device-connectivity-health/sustained-connectivity-loss.png":::
   Two workbook charts for fabrikam-prod-hub-01 over four hours, from about 8:58 AM to 12:58 PM. In the top chart, Connected devices drops from about 145,000 to about 125,000 at about 10:24 AM, stays below 140,000 for about 55 minutes, and returns to its usual level at about 11:45 AM. The bottom chart shows several waves of Successful connects, up to about 1,700 connections per minute, while devices reconnect. Because many devices stayed disconnected for much longer than the usual recovery time, this pattern could need further investigation.
:::image-end:::

A reconnection wave can also cause throttling. When many devices reconnect at the same time, IoT Hub can throttle their connection attempts and the operations that they run right after they connect, such as twin reads. To see which throttles apply, chart **Number of throttled requests** with the **Sum** aggregation, select **Apply splitting**, and set **Values** to **Throttle Type**. In the following example, throttled requests appear only during the reconnection wave, mostly for **MqttConnect** and **TwinGet**, and fall back to near zero as **Connected devices** recovers.

:::image type="complex" source="media/how-to-monitor-device-connectivity-health/metrics-throttled-requests-by-throttle-type.png" alt-text="Screenshot of metrics explorer that shows Number of throttled requests split by Throttle Type, with a short rise in throttling during the reconnection wave." lightbox="media/how-to-monitor-device-connectivity-health/metrics-throttled-requests-by-throttle-type.png":::
   Metrics explorer for fabrikam-prod-hub-01, with the Sum aggregation of Number of throttled requests over the same 24 hours. The splitting editor shows Values set to Throttle Type, Limit set to 10, and Sort set to Descending. Throttled requests stay at zero for most of the day. After 10:24 AM, MqttConnect throttling rises to about 2,200 requests in a 5-minute interval, with smaller TwinGet and DeviceEvent series, and all three return to near zero by about noon.
:::image-end:::

Throttling that starts after devices disconnect and stops when they reconnect is more likely a consequence of the reconnection wave than its cause. Throttled devices retry according to their retry policy, which can lengthen the recovery. Investigate throttling that continues after devices reconnect, or that occurs while **Connected devices** is at its usual level.

### Establish your usual levels

The thresholds in this article depend on what's normal for each hub. Before you rely on the workbook or alerts, complete these steps for each hub:

1. Review at least two weeks of **Connected devices** data. Note its usual range, including daily or weekly patterns.
1. Find past spikes in **Successful connects**. Note how far **Connected devices** dipped during each spike and how long it took to return to its usual level.
1. Use the lowest value that **Connected devices** reached during those spikes as the starting point for your alert threshold, and use the longest return time as your usual recovery time.

For example, suppose that over two weeks, **Connected devices** for *fabrikam-prod-hub-01* usually stays between about 143,000 and 146,000, and that its routine reconnection waves, like the ones at about 1:50 AM and 3:40 AM in this article's example, dip as low as about 129,000 and return to the usual range within about 45 minutes. These values describe only this fictional hub. Your hub's values depend on your fleet, your devices' retry behavior, and your network.

> [!TIP]
> When you review a specific event, use a short time range, such as four hours. Charts over long time ranges use larger time intervals, which can hide short dips.

## Choose where to build your connectivity view

The IoT hub **Overview** page shows only a small amount of the monitoring data that's available, and only for one hub. To monitor connectivity health for a fleet, use a view that correlates metrics across hubs and explains how to read them.

| Option | Best for | Consideration |
|---|---|---|
| IoT hub **Overview** page | A quick check of one hub. | The charts are fixed. You can't add metrics, other hubs, or guidance. |
| **Metrics** in Azure Monitor | Ad hoc investigation. | Charts don't become a shared, guided view unless you save or pin them. |
| Azure dashboard | A single pane of glass across Azure services. | It's less interactive than a workbook. |
| **Azure Monitor workbook** (recommended) | A shared connectivity health view across IoT hubs and DPS instances. | It requires a one-time setup. |
| Grafana | Teams that already use Grafana dashboards. | Use Dashboards with Grafana (preview) in the Azure portal, or use Azure Managed Grafana for external data sources or private networking. |

Build one workbook for your fleet instead of a separate view for each hub. Workbooks combine text, metrics, log queries, and parameters in one interactive report, and they're designed for end-to-end monitoring views across multiple Azure resources. A single workbook with an IoT hub selector covers any number of hubs, gives everyone on your team the same charts and guidance, and you can deploy it to other subscriptions as a template. For a comparison of visualization options, see [Visualize data in Azure Monitor](/azure/azure-monitor/visualize/best-practices-visualize).

## Build a connectivity health workbook

The workbook in this section has a parameters bar and four sections: connection health, device operations, provisioning, and connection errors. The provisioning section applies only if you use DPS. The connection errors section is optional and requires **Connections** logs in a Log Analytics workspace.

### Create the workbook and its parameters

1. In the [Azure portal](https://portal.azure.com), go to **Monitor** > **Workbooks**, and then select **New**.
1. Select **Add** > **Add parameters**. In the parameters item, select **Add** to create each of the following parameters, and select **Save** after each one.

   :::image type="content" source="media/how-to-monitor-device-connectivity-health/workbook-add-menu.png" alt-text="Screenshot of the workbook Add menu, which includes Add text, Add parameters, Add data source + visualization, and Add Metric." lightbox="media/how-to-monitor-device-connectivity-health/workbook-add-menu.png":::

   | Parameter name | Parameter type | Settings |
   |---|---|---|
   | `TimeRange` | **Time range picker** | Select **Required**. Set the default value to **Last 24 hours**. |
   | `IoTHubs` | **Resource picker** | Select **Required** and **Allow multiple selections**. Set **Get data from** to **Query**, set **Data source** to **Azure Resource Graph**, and enter the IoT hub query that follows this table. |
   | `ProvisioningServices` | **Resource picker** | Set **Get data from** to **Query**, set **Data source** to **Azure Resource Graph**, and enter the DPS query that follows this table. Don't select **Allow multiple selections**, because the provisioning charts split by dimension, which requires a single resource. |

   IoT hub query:

   ```kusto
   where type == 'microsoft.devices/iothubs'
   | project value = id, label = id, selected = false, group = resourceGroup
   ```

   DPS query:

   ```kusto
   where type == 'microsoft.devices/provisioningservices'
   | project value = id, label = id, selected = false, group = resourceGroup
   ```

1. Select **Apply Changes**.

:::image type="content" source="media/how-to-monitor-device-connectivity-health/workbook-parameters.png" alt-text="Screenshot of the workbook parameters bar with a time range, an IoT hub, and a DPS instance selected." lightbox="media/how-to-monitor-device-connectivity-health/workbook-parameters.png":::

### Add the connection health section

This section answers the first question: are devices staying connected?

1. Select **Add** > **Add text**, enter the following text, and then select **Apply Changes**.

   ```markdown
   ## Connection health
   Read these charts together. Spikes in **Successful connects** while **Connected devices** stays near its usual level, or dips and returns to it within your usual recovery time, mean that devices reconnected successfully. Investigate when **Connected devices** stays below its usual level.
   ```

1. Select **Add** > **Add Metric**, and configure the chart:

   - **Resource type**: the IoT Hub resource type, which the list shows as **IoTHubs**.
   - **Resource**: the `IoTHubs` parameter.
   - **Time range**: the `TimeRange` parameter.
   - **Visualization**: **Line Chart**.

   Select **Add Metric**. In **Select Metric Settings**, check that **Namespace** is `microsoft.devices/iothubs`, set **Metric** to **Connected devices** and **Aggregation** to **Average**, and then select **Apply**. Select **Apply Changes**.

   When you select more than one hub, the chart shows one line for each hub.

1. Add a second metric chart with the same settings, except set **Metric** to **Successful connects** with the **Sum** aggregation.
1. Keep both charts at full width, with **Connected devices** directly above **Successful connects**, so that their time axes line up.
1. Optionally, add Azure Service Health information as context. Select **Add** > **Add data source + visualization**, set **Data source** to **Azure Service Health (Preview)**, use **Resource type** and **Resource** to scope the results, and set **Query type** to **Summary**. Select **Run Query**, and then select **Apply Changes**.

   :::image type="content" source="media/how-to-monitor-device-connectivity-health/workbook-service-health-summary.png" alt-text="Screenshot of a workbook item that uses the Azure Service Health (Preview) data source, with Query type set to Summary." lightbox="media/how-to-monitor-device-connectivity-health/workbook-service-health-summary.png":::

   Use Service Health information only as supporting context. A Service Health event during a connectivity change doesn't prove that the event caused the change, and the absence of an event doesn't prove that the cause is in your devices or network. Base your assessment on the connectivity metrics.

:::image type="complex" source="media/how-to-monitor-device-connectivity-health/workbook-connection-health.png" alt-text="Screenshot of the connection health section of the workbook, with the Connected devices chart above the Successful connects chart." lightbox="media/how-to-monitor-device-connectivity-health/workbook-connection-health.png":::
   The connection health section of the workbook for fabrikam-prod-hub-01 over the last 24 hours. Two full-width line charts share the same time axis. The top chart, Connected devices (connectedDeviceCount), stays near 145,000 except for two shorter dips overnight, at about 1:50 AM and 3:40 AM, and a drop to about 125,000 at about 10:24 AM, and it recovers each time. The bottom chart, Successful connects (connect.success), spikes at the same times, up to about 7,000 connections in a 5-minute interval after 10:24 AM.
:::image-end:::

### Add the device operations section

This section answers the second question: do device operations succeed? Select **Add** > **Add text**, and enter `## Device operations` as the heading. Then add a metric chart for each metric in the following table. Use the same **Resource type**, **Resource**, and **Time range** settings as the connection health section.

| Metric | Aggregation | What to look for |
|---|---|---|
| **Telemetry messages sent** | **Sum** | It follows your usual traffic pattern. A sustained drop while devices are connected needs investigation. |
| **Telemetry message send attempts** | **Sum** | A growing gap between attempts and messages sent means that sends are failing. |
| **Failed direct method invocations** | **Sum** | Short increases are expected while devices reconnect, because calls to a device that's offline fail. Failures that continue after devices reconnect need investigation. |
| **Failed twin updates from back end** | **Sum** | Back-end twin updates don't require the device to be connected, so reconnections don't explain failures here. |
| **Number of throttling errors** | **Sum** | A sustained value means that you're exceeding a device throughput throttle. |
| **Number of throttled requests** | **Sum**, split by **ThrottleType** | It shows which throttle applies. Short increases in connection-related throttle types, such as **MqttConnect**, are expected during large reconnection waves. |
| **Total number of messages used** | **Maximum** | Compare it with your hub's daily quota. The value resets at 00:00 UTC. |

If you use message routing, also add **Routing Delivery Latency (preview)** with the **Average** aggregation, split by **EndpointName**. When you compare hubs, use the same aggregation and time range for each one, because the **Maximum** aggregation reflects single outliers.

> [!NOTE]
> In a workbook metric chart, **Split by** is available only when the chart has one metric and one resource or location selected. Otherwise, **Split by** is unavailable, and the settings show this requirement. For a split chart, such as **Number of throttled requests** by **ThrottleType** or **Routing Delivery Latency (preview)** by **EndpointName**, add a separate chart that contains only that metric for a single hub. Metrics that have no dimensions, such as **Connected devices**, have no **Split by** values. In metrics explorer, the **ThrottleType** dimension appears as **Throttle Type**.

### Add the provisioning section

If you use DPS, select **Add** > **Add text**, and enter `## Provisioning` as the heading. Then add a metric chart for each metric in the following table. Set **Resource type** to the IoT Hub Device Provisioning Service resource type, and set **Resource** to the `ProvisioningServices` parameter. In **Select Metric Settings**, **Namespace** is `microsoft.devices/provisioningservices`.

| Metric | Aggregation | What to look for |
|---|---|---|
| **Registration attempts** | **Sum**, split by **Status** | Failed registrations need investigation, especially when they concentrate on one IoT hub. To check one hub, add a filter on **IotHubName**. A rise in registrations while devices reconnect to a hub suggests that devices reprovision instead of reconnecting. |
| **Devices assigned** | **Sum**, split by **IotHubName** | It shows how many assignments DPS made to each hub during the selected time range. It isn't the number of devices that are registered to each hub. |

As with IoT Hub metrics, **Split by** is available only when the chart has one metric and one DPS instance selected. **Registration attempts** can be split by **ProvisioningServiceName**, **IotHubName**, **Status**, or **ProvisioningType**, and **Devices assigned** can be split by **ProvisioningServiceName** or **IotHubName**.

:::image type="content" source="media/how-to-monitor-device-connectivity-health/workbook-provisioning-split-by-status.png" alt-text="Screenshot of Select Metric Settings for the Registration attempts metric, with Split by set to Status." lightbox="media/how-to-monitor-device-connectivity-health/workbook-provisioning-split-by-status.png":::

In the example, registration attempts rise from about 16 in a typical 5-minute interval to about 190 shortly after 10:24 AM, when some devices fall back to DPS instead of reconnecting to their hub. Failed attempts rise briefly to about 20 in an interval at the same time.

:::image type="complex" source="media/how-to-monitor-device-connectivity-health/workbook-provisioning-registration-attempts.png" alt-text="Screenshot of a workbook chart of DPS registration attempts split by status, with a short rise in successful and failed attempts during the event." lightbox="media/how-to-monitor-device-connectivity-health/workbook-provisioning-registration-attempts.png":::
   A workbook chart of Registration attempts for fabrikam-prod-dps over the last 24 hours, split by Status. Successful attempts stay between about 3 and 30 in each 5-minute interval for most of the day, and rise to about 190 shortly after 10:24 AM. Failed attempts stay near zero except for a short rise to about 20 in an interval at the same time. The legend shows about 5,030 successful attempts and 150 failed attempts.
:::image-end:::

**Devices assigned** shows assignment activity in the selected time range, not the size of your fleet. In the example, DPS made about 5,000 assignments in 24 hours across the three hubs, while about 145,000 devices stayed connected to *fabrikam-prod-hub-01* for most of the day.

:::image type="complex" source="media/how-to-monitor-device-connectivity-health/workbook-provisioning-devices-assigned.png" alt-text="Screenshot of a workbook chart of DPS devices assigned split by IoT hub name, with one line for each of three IoT hubs." lightbox="media/how-to-monitor-device-connectivity-health/workbook-provisioning-devices-assigned.png":::
   A workbook chart of Devices assigned for fabrikam-prod-dps over the last 24 hours, split by IotHubName, with one line each for fabrikam-prod-hub-01, fabrikam-prod-hub-02, and fabrikam-prod-hub-03. All three lines rise briefly after 10:24 AM, when some devices reprovision. The legend totals, about 2,890, 1,250, and 890, count assignments during the selected time range, not registered devices.
:::image-end:::

### Add the connection errors section (optional)

If you send the **Connections** log category to a Log Analytics workspace, add a chart of connection errors over time. Connection errors explain *why* devices disconnected.

1. Select **Add** > **Add data source + visualization**.
1. Set **Data source** to **Logs (Analytics)**, set **Resource type** to the IoT Hub resource type, and select the `IoTHubs` parameter as the resource.
1. Enter the following query, set **Visualization** to **Bar chart**, and then select **Run Query**.

   ```kusto
   AzureDiagnostics
   | where ResourceProvider == "MICROSOFT.DEVICES" and ResourceType == "IOTHUBS"
   | where Category == "Connections" and Level == "Error"
   | summarize Errors = count() by bin(TimeGenerated, 15m), ResultType
   ```

1. Select **Apply Changes**.

Use the following table to interpret the most common connection error codes. For all codes, see [Troubleshoot Azure IoT Hub error codes](troubleshoot-error-codes.md).

| Error codes | Typical meaning | What to do |
|---|---|---|
| 400029, 400030 | IoT Hub closed existing connections, or rejected new connections and immediate retries, during service or infrastructure operations such as maintenance, updates, or connection rebalancing. | Reconnect by using exponential backoff with jitter. Investigate disconnections that persist. |
| 401003 followed by 404104 | The device's SAS token expired, and the SDK reconnected with a new token. | No action is needed if devices reconnect. |
| 400027, 409002 | A new connection opened with the same device identity, so IoT Hub closed the previous connection. | Make sure that only one client uses each device identity. |
| 500001, 500008 | A transient server-side error occurred. | Retry. If the errors persist, check the hub's resource health and contact support. |

> [!IMPORTANT]
> Resource logs aren't guaranteed to be complete or ordered, and they aren't real time. Use them to explain why devices disconnected, not to count disconnects or to decide whether your fleet is healthy.

### Save and share the workbook

1. Select **Done Editing**, and then select **Save**.
1. Enter a title, such as *IoT connectivity health*, and select the subscription, resource group, and location for the workbook.
1. Assign the **Monitoring Reader** role to the people who use the workbook. Workbook access is based on each user's permissions on the resources that the workbook displays.
1. To use the same workbook in other subscriptions or environments, select **Edit**, and then select **Advanced Editor** to copy the workbook's JSON. You can also deploy it as a `Microsoft.Insights/workbooks` resource with an [Azure Resource Manager or Bicep template](/azure/templates/microsoft.insights/workbooks).

## Create alerts for sustained connectivity loss

Create alerts for conditions that need action: devices that stay disconnected, operations that fail, and capacity limits. Don't create alerts on **Successful connects** alone, because reconnection activity is expected.

| Alert | Signal and settings | Why |
|---|---|---|
| Sustained connectivity loss | **Connected devices**. Set **Threshold** to **Static**, **Aggregation type** to **Maximum**, **Operator** to **Less than**, **Check every** to **5 minutes**, and **Lookback period** to **15 minutes**. Set **Threshold value** below the lowest level that the hub reaches during normal reconnections. | The rule evaluates the maximum value in the lookback period, so it fires only when the count stays below the threshold for the whole period. Short dips during reconnections don't fire it. Dynamic thresholds aren't supported for this metric. |
| Daily quota | **Total number of messages used**. Set **Threshold** to **Static**, **Aggregation type** to **Maximum**, and **Operator** to **Greater than** a share of your daily quota that leaves time to react, such as 80 percent. | When the daily quota is exceeded, IoT Hub rejects requests until the quota resets at 00:00 UTC. |
| Throttling | **Number of throttling errors**. Set **Threshold** to **Static**, **Aggregation type** to **Total**, **Operator** to **Greater than**, **Threshold value** to **0**, and **Lookback period** to **15 minutes**. | Throttling slows down or rejects device operations. |
| Provisioning failures | DPS **Registration attempts**, filtered to the **Status** values that represent failures. Set **Threshold** to **Static**, **Aggregation type** to **Total**, and **Operator** to **Greater than** your usual level. | It detects devices that DPS can't assign to a hub. |
| Routing latency | **Routing Delivery Latency (preview)**. Set **Threshold** to **Dynamic**, **Aggregation type** to **Average**, **Operator** to **Greater than**, and **Threshold sensitivity** to **Medium** or **Low**. | It detects sustained delays in delivering messages to routing endpoints. |
| Resource health | A resource health alert for each hub. | It notifies you when Azure reports a health change for the hub. For steps, see [Check IoT Hub service and resource health](iot-hub-azure-service-health-integration.md). |

To create the sustained connectivity loss alert:

1. In the Azure portal, go to your IoT hub. Under **Monitoring**, select **Alerts**, and then select **Create** > **Alert rule**.
1. On the **Condition** tab, select **Connected devices** as the signal.
1. Set **Threshold** to **Static**, **Aggregation type** to **Maximum**, and **Operator** to **Less than**. Set **Threshold value** to the value that you chose when you established your usual levels.
1. Set **Check every** to **5 minutes** and **Lookback period** to **15 minutes**.
1. On the **Actions** tab, select or create an action group. On the **Details** tab, set the severity and the alert rule name, and then select **Review + create**.

For example, **Connected devices** for *fabrikam-prod-hub-01* usually stays between 143,000 and 146,000, and its routine reconnection waves dip as low as about 129,000. A threshold of 125,000 is below that lowest routine level, so the rule fires only when the count stays below 125,000 for 15 minutes. In this article's examples, the rule fires at about 3:40 PM in the sustained connectivity loss example. It doesn't fire during the routine reconnections at about 1:50 AM and 3:40 AM, or during the temporary event at 10:24 AM, when **Connected devices** falls to about 125,000 only briefly before it recovers. To be notified about smaller or shorter drops, use a higher threshold, and expect notifications for reconnections that recover on their own. These thresholds are operational values that you choose for your hub. They aren't service-level thresholds.

Metric alert rules that you create in the Azure portal are created in the same resource group as the target resource. To check whether one rule can monitor several hubs, see [Monitor multiple time series in a single metric alert rule](/azure/azure-monitor/alerts/alerts-metric-multiple-time-series-single-rule).

## Check before you contact support

Before you open a support request, check the following items:

1. In the workbook, check whether **Connected devices** returned to its usual level. If it did and device operations succeed, the reconnections were transient and no action is needed.
1. Check the hub's **Resource health** page, Azure Service Health, and the [Azure status page](https://azure.status.microsoft/status). Treat what you find there as context, not as proof of the cause.
1. Check the throttling and quota metrics.
1. If you use DPS, check **Registration attempts** by **Status**.
1. If you send **Connections** logs to a Log Analytics workspace, check the connection error codes for the period.

Contact support when **Connected devices** stays below its usual level, when device operations keep failing, or when provisioning keeps failing. Select a severity that matches the business impact, and include the following information:

- The names and regions of the affected IoT hubs and DPS instances.
- The start and end time of the problem, in UTC.
- Workbook screenshots that cover the period.
- A sample of affected device IDs, with each device's protocol, SDK, and SDK version.
- The connection error codes from your logs, if available.
- Whether devices reprovisioned through DPS during the period.

## Monitor critical devices individually

Metrics show the health of your fleet. When individual devices matter, such as devices that support critical business processes, also monitor those devices individually:

- Subscribe to the **DeviceConnected** and **DeviceDisconnected** events in Event Grid. For details, see [React to IoT Hub events by using Event Grid](iot-hub-event-grid.md).
- Event Grid checks connection state every 60 seconds and publishes the most recent state change, so a device that reconnects within that window might not generate events. For details, see [Event Grid limitations](monitor-device-connection-state.md#event-grid-limitations).
- Before you act on a disconnect event, wait for a matching connect event within a grace period that fits your scenario.
- At fleet scale, processing an event for every device adds cost and complexity. Use the workbook and metric alerts for fleet health, and use per-device monitoring only where individual connectivity matters. For other approaches, such as the device heartbeat pattern, see [Monitor device connection status](monitor-device-connection-state.md).

## Related content

- [Manage device reconnections to create resilient applications](concepts-manage-device-reconnections.md)
- [Monitor, diagnose, and troubleshoot Azure IoT Hub device connectivity](iot-hub-troubleshoot-connectivity.md)
- [Troubleshoot Azure IoT Hub error codes](troubleshoot-error-codes.md)
- [Monitor Azure IoT Hub](monitor-iot-hub.md)
- [Azure IoT Hub Device Provisioning Service monitoring data reference](../iot-dps/monitor-iot-dps-reference.md)
- [Analyze metrics with Azure Monitor metrics explorer](/azure/azure-monitor/metrics/analyze-metrics)
- [Azure Workbooks overview](/azure/azure-monitor/visualize/workbooks-overview)
- [Resilience to service maintenance](/azure/reliability/reliability-iot-hub#resilience-to-service-maintenance).
