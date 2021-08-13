---
title: Explore curated visualizations - Azure IoT Edge
description: Use Azure workbooks to visualize and explore IoT Edge built-in metrics
author: veyalla
manager: philmea
ms.author: veyalla
ms.date: 06/08/2021
ms.topic: conceptual
ms.reviewer: kgremban
ms.service: iot-edge 
services: iot-edge
---

# Explore curated visualizations (Preview)

[!INCLUDE [iot-edge-version-all-supported](../../includes/iot-edge-version-all-supported.md)]

You can visualize and explore metrics collected from the IoT Edge device right in the Azure portal using Azure Monitor Workbooks. Curated monitoring workbooks for IoT Edge devices are provided in the form of public templates you can access in the **IoT Hub** blade from **Workbooks** page (under Monitoring section).

The curated workbooks use [built-in metrics](how-to-access-built-in-metrics.md) from the IoT Edge runtime. These views don't need any metrics instrumentation from the workload modules.

## Access curated workbooks

Azure Monitor workbooks for IoT are a set of templates that you can use to start visualizing your metrics right away, or that you can customize to fit your solution.

To access the curated workbooks, use the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your IoT hub.

1. Select **Workbooks** from the **Monitoring** section of the menu.

1. Choose the workbook that you want to explore from the list of public templates:

   * **IoT Edge fleet view**: Monitor your fleet of devices, and drill into specific devices for a health snapshot.
   * **IoT Edge device details**: Visualize device details around messaging, modules, and host components on an IoT Edge device.
   * **IoT Edge health snapshot**: View a device's health based on six common performance metrics. To access the health snapshot workbook, start in the fleet view workbook and select the specific device that you want to view. The fleet view workbook passes some required parameters to the health snapshot view.

You can explore the workbooks on your own, or use the following sections to get a preview of the kind of data and visualizations that each workbook offers.

## IoT Edge fleet view workbook

The fleet view workbook has two views that you can use:

* The **Devices** view shows an overview of active devices.
* The **Alerts** view shows alerts generated from [pre-configured alert rules](how-to-create-alerts.md).

You can switch between the views using the tabs at the top of the workbook.

# [Devices](#tab/devices)

:::image type="content" source="./media/how-to-explore-curated-visualizations/how-to-explore-fleet-view.gif" alt-text="The devices section of the fleet view workbook." lightbox="./media/how-to-explore-curated-visualizations/how-to-explore-fleet-view.gif":::

See the overview of active devices sending metrics in the **Devices** view. This view shows devices associated with the current IoT Hub.

On the right, there's the device list with composite bars showing local and upstream messages sent. You can filter the list by device name and click on the device name link to see its detailed metrics.

On the left, the hive cell visualization shows which devices are healthy or unhealthy. It also shows when the device last sent metrics. Devices that haven't sent metrics for more than 30 minutes are shown in Blue. Click on the device name in the hive cell to see its health snapshot. Only the last 3 measurements from the device are considered when determining health. Using only recent data accounts for temporary spikes in the reported metrics.

# [Alerts](#tab/alerts)

:::image type="content" source="./media/how-to-explore-curated-visualizations/how-to-explore-alerts.gif" alt-text="The alerts section of the fleet view workbook." lightbox="./media/how-to-explore-curated-visualizations/how-to-explore-alerts.gif":::

See the generated alerts from [pre-created alert rules](how-to-create-alerts.md) in the **Alerts** view. This view lets you see alerts from multiple IoT Hubs.

On the left, there's a list of alert severities with their count. On the right, there's map with total alerts per region.

Click on a severity row to see alerts details. The **Alert rule** link takes you to the alert context and the **Device** link opens the detailed metrics workbook. When opened from this view, the device details workbook is automatically adjusted to the time range around when the alert fired.

---

## IoT Edge device details workbook

The device details workbook has three views that you can use:

* The **Messaging** view visualizes the message routes for the device and reports on the overall health of the messaging system.
* The **Modules** view shows how the individual modules on a device are performing.
* The **Host** view shows information about the host device including version information for host components and resource use.

You can switch between the views using the tabs at the top of the workbook.

The device details workbook also integrates with the IoT Edge portal-based troubleshooting experience so that you can view **Live logs** coming in from your device. You can access this experience by selecting the **Troubleshoot \<device name> live** button above the workbook.

# [Messaging](#tab/messaging)

:::image type="content" source="./media/how-to-explore-curated-visualizations/how-to-explore-messaging-details.gif" alt-text="The messaging section of the device details workbook." lightbox="./media/how-to-explore-curated-visualizations/how-to-explore-messaging-details.gif":::

The **Messaging** view includes three subsections: routing details, a routing graph, and messaging health. Drag and let go on any time chart to adjust the global time range to the selected range.

The **Routing** section shows message flow between sending modules and receiving modules. It presents information such as message count, rate, and number of connected clients. Click on a sender or receiver to drill in further. Clicking a sender shows the latency trend chart experienced by the sender and number of messages it sent. Clicking a receiver shows the queue length trend for the receiver and number of messages it received.

The **Graph** section shows a visual representation of message flow between modules. You can drag and zoom to adjust the graph.

The **Health** section presents various metrics related to overall health of the messaging subsystem. You can progressively drill-in to details if any errors are noted.

# [Modules](#tab/modules)

:::image type="content" source="./media/how-to-explore-curated-visualizations/how-to-explore-module-details.gif" alt-text="The modules section of the device details workbook." lightbox="./media/how-to-explore-curated-visualizations/how-to-explore-module-details.gif":::

The **Modules** view presents metrics collected from the edgeAgent module, which reports on the status of all running modules on the device. It includes information such as:

* Module availability
* Per-module CPU and memory use
* CPU and memory use across all modules
* Modules restart count and restart timeline.

# [Host](#tab/host)

:::image type="content" source="./media/how-to-explore-curated-visualizations/how-to-explore-host-details.gif" alt-text="The host section of the device details workbook." lightbox="./media/how-to-explore-curated-visualizations/how-to-explore-host-details.gif":::

The **Host** view presents metrics from the edgeAgent module. It includes information such as:

* Host component version information
* Uptime
* CPU, memory, and disk space use at the host-level

# [Live logs](#tab/livelogs)

:::image type="content" source="./media/how-to-explore-curated-visualizations/how-to-troubleshoot-live.gif" alt-text="Access live logs through the device details workbook." lightbox="./media/how-to-explore-curated-visualizations/how-to-troubleshoot-live.gif":::

This workbook integrates directly with the portal-based troubleshooting experience. Click on the **Troubleshoot live** button to go to the troubleshoot screen. Here, you can easily view module logs pulled from the device, on-demand. The time range is automatically set to the workbook's time range, so you're immediately in temporal context. You can also restart any module from this experience.

---

## IoT Edge health snapshot workbook

The health snapshot workbook can be accessed from within the fleet view workbook. The fleet view workbook passes in some parameters required to initialize the health snapshot view. Select a device name in the hive cell to see the health snapshot of that device.

:::image type="content" source="./media/how-to-explore-curated-visualizations/how-to-access-health-snapshot.png" alt-text="Access the health snapshot workbook by selecting a device in the fleet view workbook." lightbox="./media/how-to-explore-curated-visualizations/how-to-access-health-snapshot.png":::

Out of the box, the health snapshot is made up of six signals:

* Upstream messages
* Local messages
* Queue length
* Disk usage
* Host-level CPU utilization
* Host-level memory utilization

These signals are measured against configurable thresholds to determine if a device is healthy or not. The thresholds can be adjusted or new signals can be added by editing the workbook. See the next section to learn about workbook customizations.

:::image type="content" source="./media/how-to-explore-curated-visualizations/how-to-explore-health-snapshot.gif" alt-text="View the health snapshot workbook." lightbox="./media/how-to-explore-curated-visualizations/how-to-explore-health-snapshot.gif":::

## Customize workbooks

[Azure Monitor workbooks](../azure-monitor/visualize/workbooks-overview.md) are very customizable. You can edit the public templates to suit your requirements. All the visualizations are driven by resource-centric [KQL](/azure/data-explorer/kusto/query/) queries on the [InsightsMetrics](/azure/azure-monitor/reference/tables/insightsmetrics) table. See the example below that edits the health thresholds.

To begin customizing a workbook, first enter editing mode. Select the **Edit** button in the menu bar of the workbook.

:::image type="content" source="./media/how-to-explore-curated-visualizations/how-to-access-edit-mode.png" alt-text="Enter the editing mode of a workbook." lightbox="./media/how-to-explore-curated-visualizations/how-to-access-edit-mode.png":::

Curated workbooks make extensive use of workbook groups. You may need to click **Edit** on several nested groups before being able to view a visualization query.

Save your changes as a new workbook. You can [share](../azure-monitor/visualize/workbooks-access-control.md) the saved workbook with your team or [deploy them programmatically](../azure-monitor/visualize/workbooks-automate.md) as part of your organization's resource deployments.

For example, you may want to change the thresholds for when a device is considered healthy or unhealthy. You could do so by drilling into the fleet view workbook template until you get to the **device-health-graph** query item which includes all the metric thresholds that this workbook compares a device against.

:::image type="content" source="./media/how-to-explore-curated-visualizations/how-to-edit-thresholds.gif" alt-text="Continue opening the edit mode of nested components until you reach the query item." lightbox="./media/how-to-explore-curated-visualizations/how-to-edit-thresholds.gif":::

## Next steps

Customize your monitoring solution with [alert rules](how-to-create-alerts.md) and [metrics from custom modules](how-to-add-custom-metrics.md).