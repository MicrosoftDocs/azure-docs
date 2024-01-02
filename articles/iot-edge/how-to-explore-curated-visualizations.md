---
title: Explore curated visualizations - Azure IoT Edge
description: Use Azure workbooks to visualize and explore IoT Edge built-in metrics
author: veyalla

ms.author: veyalla
ms.date: 01/29/2022
ms.topic: conceptual
ms.reviewer: kgremban
ms.service: iot-edge 
services: iot-edge
---

# Explore curated visualizations

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

You can visually explore metrics collected from IoT Edge devices using Azure Monitor workbooks. Curated monitoring workbooks for IoT Edge devices are provided in the form of public templates:

* For devices connected to IoT Hub, from the **IoT Hub** page in the Azure portal, navigate to the **Workbooks** page in the **Monitoring** section.
* For devices connected to IoT Central, from the **IoT Central** page in the Azure portal, navigate to the **Workbooks** page in the **Monitoring** section.

Curated workbooks use [built-in metrics](how-to-access-built-in-metrics.md) from the IoT Edge runtime. They first need metrics to be [ingested](how-to-collect-and-transport-metrics.md) into a Log Analytics workspace. These views don't need any metrics instrumentation from the workload modules.

## Access curated workbooks

Azure Monitor workbooks for IoT are a set of templates that you can use to visualize your device metrics. They can be customized to fit your solution.

To access the curated workbooks, use the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your IoT Hub or IoT Central application.

1. Select **Workbooks** from the **Monitoring** section of the menu.

1. Choose the workbook that you want to explore from the list of public templates:

  * **Fleet View**: Monitor your fleet of devices across multiple IoT Hubs or Central Apps, and drill into specific devices for a health snapshot.

  * **Device Details**: Visualize device details around messaging, modules, and host components on an IoT Edge device.

  * **Alerts**: View triggered [alerts](how-to-create-alerts.md) for devices across multiple IoT resources.

Use the following sections to get a preview of the kind of data and visualizations that each workbook offers.

>[!NOTE]
> The screen captures that follow may not reflect the latest workbook design.

## Fleet view workbook

:::image type="content" source="./media/how-to-explore-curated-visualizations/how-to-explore-fleet-view.gif" alt-text="The devices section of the fleet view workbook." lightbox="./media/how-to-explore-curated-visualizations/how-to-explore-fleet-view.gif":::

By default, this view shows the health of devices associated with the current IoT cloud resource. You can select multiple IoT resources using the dropdown control on the top left. 

Use the **Settings** tab to adjust the various thresholds to categorize the device as Healthy or Unhealthy.

Click the **Details** button to see the device list with a snapshot of aggregated, primary metrics. Click the link in the **Status** column to view the trend of an individual device's health metrics or the device name to view its detailed metrics.

## Device details workbook

The device details workbook has three views:

* The **Messaging** view visualizes the message routes for the device and reports on the overall health of the messaging system.
* The **Modules** view shows how the individual modules on a device are performing.
* The **Host** view shows information about the host device including version information for host components and resource use.

Switch between the views using the tabs at the top of the workbook.

The device details workbook also integrates with the IoT Edge portal-based troubleshooting experience. You can pull **Live logs** from your device using this feature. Access this experience by selecting the **Troubleshoot \<device name> live** button above the workbook.

# [Messaging](#tab/messaging)

:::image type="content" source="./media/how-to-explore-curated-visualizations/how-to-explore-messaging-details.gif" alt-text="The messaging section of the device details workbook." lightbox="./media/how-to-explore-curated-visualizations/how-to-explore-messaging-details.gif":::

The **Messaging** view includes three subsections: routing details, a routing graph, and messaging health. Drag and let go on any time chart to adjust the global time range to the selected range.

The **Routing** section shows message flow between sending modules and receiving modules. It presents information such as message count, rate, and number of connected clients. Click on a sender or receiver to drill in further. Clicking a sender shows the latency trend chart experienced by the sender and number of messages it sent. Clicking a receiver shows the queue length trend for the receiver and number of messages it received.

The **Graph** section shows a visual representation of message flow between modules. Drag and zoom to adjust the graph.

The **Health** section presents various metrics related to overall health of the messaging subsystem. Progressively drill-in to details if any errors are noted.

# [Modules](#tab/modules)

:::image type="content" source="./media/how-to-explore-curated-visualizations/how-to-explore-module-details.gif" alt-text="The modules section of the device details workbook." lightbox="./media/how-to-explore-curated-visualizations/how-to-explore-module-details.gif":::

The **Modules** view presents metrics collected from the edgeAgent module, which reports on the status of all running modules on the device. It includes information such as:

* Module availability
* Per-module CPU and memory use
* CPU and memory use across all modules
* Modules restart count and restart timeline

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

## Alerts workbook

See the generated alerts from [pre-created alert rules](how-to-create-alerts.md) in the **Alerts** workbook. This view lets you see alerts from multiple IoT Hubs or IoT Central applications.

:::image type="content" source="./media/how-to-explore-curated-visualizations/how-to-explore-alerts.gif" alt-text="The alerts section of the fleet view workbook." lightbox="./media/how-to-explore-curated-visualizations/how-to-explore-alerts.gif":::

Click on a severity row to see alerts details. The **Alert rule** link takes you to the alert context and the **Device** link opens the detailed metrics workbook. When opened from this view, the device details workbook is automatically adjusted to the time range around when the alert fired.

## Customize workbooks

[Azure Monitor workbooks](../azure-monitor/visualize/workbooks-overview.md) are very customizable. You can edit the public templates to suit your requirements. All the visualizations are driven by resource-centric [Kusto Query Language](/azure/data-explorer/kusto/query/) queries on the [InsightsMetrics](/azure/azure-monitor/reference/tables/insightsmetrics) table. 

To begin customizing a workbook, first enter editing mode. Select the **Edit** button in the menu bar of the workbook. Curated workbooks make extensive use of workbook groups. You may need to select **Edit** on several nested groups before being able to view a visualization query.

Save your changes as a new workbook. You can [share](../azure-monitor/visualize/workbooks-overview.md#access-control) the saved workbook with your team or [deploy them programmatically](../azure-monitor/visualize/workbooks-automate.md) as part of your organization's resource deployments.


## Next steps

Customize your monitoring solution with [alert rules](how-to-create-alerts.md) and [metrics from custom modules](how-to-add-custom-metrics.md).
