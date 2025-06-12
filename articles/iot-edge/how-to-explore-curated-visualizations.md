---
title: Explore curated visualizations in Azure IoT Edge
description: Use Azure workbooks to visualize and explore IoT Edge built-in metrics
author: PatAltimore

ms.author: patricka
ms.date: 05/08/2025
ms.topic: concept-article
ms.service: azure-iot-edge
services: iot-edge
---

# Explore curated visualizations in Azure IoT Edge

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

Visually explore metrics collected from IoT Edge devices using Azure Monitor workbooks. Curated monitoring workbooks for IoT Edge devices are available as public templates:

* For devices connected to IoT Hub, from the **IoT Hub** page in the Azure portal, navigate to the **Workbooks** page in the **Monitoring** section.
* For devices connected to IoT Central, from the **IoT Central** page in the Azure portal, navigate to the **Workbooks** page in the **Monitoring** section.

Curated workbooks use [built-in metrics](how-to-access-built-in-metrics.md) from IoT Edge runtime. Metrics must first be [ingested](how-to-collect-and-transport-metrics.md) into a Log Analytics workspace. These views don't require metrics instrumentation from workload modules.

## Access curated workbooks

Azure Monitor workbooks for IoT are templates that let you visualize device metrics. You can customize them to fit your solution.

Follow these steps to access the curated workbooks:

1. Sign in to the [Azure portal](https://portal.azure.com), and go to your IoT Hub or IoT Central application.

1. Select **Workbooks** from the **Monitoring** section of the menu.

1. Choose a workbook to explore from the list of public templates:

  * **Fleet View**: Monitor your fleet of devices across multiple IoT Hubs or Central Apps, and drill into specific devices for a health snapshot.

  * **Device Details**: Visualize device details around messaging, modules, and host components on an IoT Edge device.

  * **Alerts**: View triggered [alerts](how-to-create-alerts.md) for devices across multiple IoT resources.

See the following sections for a preview of the data and visualizations each workbook offers.

>[!NOTE]
> The screen captures that follow may not reflect the latest workbook design.

## Fleet view workbook

:::image type="content" source="./media/how-to-explore-curated-visualizations/how-to-explore-fleet-view.gif" alt-text="Screenshot of the devices section of the fleet view workbook." lightbox="./media/how-to-explore-curated-visualizations/how-to-explore-fleet-view.gif":::

By default, this view shows the health of devices associated with the current IoT cloud resource. Select multiple IoT resources using the dropdown control at the top left. 

Use the **Settings** tab to adjust thresholds to categorize devices as healthy or unhealthy.

Select the **Details** button to view the device list with a snapshot of aggregated primary metrics. Select the link in the **Status** column to view trends in an individual device's health metrics or select the device name to view its detailed metrics.

## Device details workbook

The device details workbook has three views:

* The **Messaging** view visualizes the message routes for the device and reports on the overall health of the messaging system.
* The **Modules** view shows how the individual modules on a device are performing.
* The **Host** view shows information about the host device including version information for host components and resource use.

Switch between views by selecting the tabs at the top of the workbook.

The device details workbook also integrates with the IoT Edge portal-based troubleshooting experience. You can pull **Live logs** from your device using this feature. Access this experience by selecting the **Troubleshoot \<device name> live** button above the workbook.

# [Messaging](#tab/messaging)

:::image type="content" source="./media/how-to-explore-curated-visualizations/how-to-explore-messaging-details.gif" alt-text="The messaging section of the device details workbook." lightbox="./media/how-to-explore-curated-visualizations/how-to-explore-messaging-details.gif":::

The **Messaging** view includes three subsections: routing details, a routing graph, and messaging health. Drag any time chart and release it to adjust the global time range to the selected range.

The **Routing** section shows message flow between sending modules and receiving modules. It presents information such as message count, rate, and number of connected clients. Select a sender or receiver to drill in further. Selecting a sender shows the latency trend chart experienced by the sender and the number of messages it sent. Selecting a receiver shows the queue length trend for the receiver and the number of messages it received.

The **Graph** section shows a visual representation of message flow between modules. Drag and zoom to adjust the graph.

The **Health** section shows various metrics related to the overall health of the messaging subsystem. Drill into details if any errors are noted.

# [Modules](#tab/modules)

:::image type="content" source="./media/how-to-explore-curated-visualizations/how-to-explore-module-details.gif" alt-text="The modules section of the device details workbook." lightbox="./media/how-to-explore-curated-visualizations/how-to-explore-module-details.gif":::

The **Modules** view shows metrics collected from the edgeAgent module, which reports on the status of all running modules on the device. It includes information like:

* Module availability
* Per-module CPU and memory use
* CPU and memory use across all modules
* Modules restart count and restart timeline

# [Host](#tab/host)

:::image type="content" source="./media/how-to-explore-curated-visualizations/how-to-explore-host-details.gif" alt-text="The host section of the device details workbook." lightbox="./media/how-to-explore-curated-visualizations/how-to-explore-host-details.gif":::

The **Host** view shows metrics from the edgeAgent module. It includes information like:

* Host component version information
* Uptime
* CPU, memory, and disk space use at the host-level

# [Live logs](#tab/livelogs)

:::image type="content" source="./media/how-to-explore-curated-visualizations/how-to-troubleshoot-live.gif" alt-text="Access live logs through the device details workbook." lightbox="./media/how-to-explore-curated-visualizations/how-to-troubleshoot-live.gif":::

This workbook integrates directly with the portal-based troubleshooting experience. Select the **Troubleshoot live** button to go to the troubleshoot screen. Here, you can easily view module logs pulled from the device, on-demand. The time range is automatically set to the workbook's time range, so you're immediately in context. You can also restart any module from this experience.

---

## Alerts workbook

View the generated alerts from [pre-created alert rules](how-to-create-alerts.md) in the **Alerts** workbook. This view lets you see alerts from multiple IoT Hubs or IoT Central applications.

:::image type="content" source="./media/how-to-explore-curated-visualizations/how-to-explore-alerts.gif" alt-text="Screenshot of the alerts section in the fleet view workbook." lightbox="./media/how-to-explore-curated-visualizations/how-to-explore-alerts.gif":::

Select a severity row to view alert details. The **Alert rule** link opens the alert context, and the **Device** link opens the detailed metrics workbook. When opened from this view, the device details workbook automatically adjusts to the time range around the alert firing.

## Customize workbooks

[Azure Monitor workbooks](/azure/azure-monitor/visualize/workbooks-overview) are customizable. You can edit the public templates to suit your requirements. All the visualizations are driven by resource-centric [Kusto Query Language](/azure/data-explorer/kusto/query/) queries on the [InsightsMetrics](/azure/azure-monitor/reference/tables/insightsmetrics) table. 

To customize a workbook, enter editing mode. Select the **Edit** button in the workbook's menu bar. Curated workbooks use workbook groups extensively. You might need to select **Edit** on several nested groups to view a visualization query.

Save your changes as a new workbook. You can [share](/azure/azure-monitor/visualize/workbooks-overview#access-control) the saved workbook with your team or [deploy them programmatically](/azure/azure-monitor/visualize/workbooks-automate) as part of your organization's resource deployments.


## Next steps

Customize your monitoring solution with [alert rules](how-to-create-alerts.md) and [metrics from custom modules](how-to-add-custom-metrics.md).
