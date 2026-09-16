---
title: Explore curated visualizations in Azure IoT Edge
description: Use Azure workbooks to visualize and explore IoT Edge built-in metrics
author: sethmanheim
ms.author: sethm
ms.date: 09/15/2026
ms.topic: concept-article
ms.service: azure-iot-edge
services: iot-edge
---

# Explore curated visualizations in Azure IoT Edge

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

You can visually explore metrics collected from IoT Edge devices by using Azure Monitor workbooks. Curated monitoring workbooks for IoT Edge devices are available as public templates:

* For devices connected to IoT Hub, from the **IoT Hub** page in the Azure portal, go to the **Workbooks** page in the **Monitoring** section.
* For devices connected to IoT Central, from the **IoT Central** page in the Azure portal, go to the **Workbooks** page in the **Monitoring** section.

Curated workbooks use [built-in metrics](how-to-access-built-in-metrics.md) from the IoT Edge runtime. You must first [ingest](how-to-collect-and-transport-metrics.md) metrics into a Log Analytics workspace. These views don't require metrics instrumentation from workload modules.

The workbooks can read legacy `InsightsMetrics`, a new custom table (default `IoTEdgeMetrics_CL`), or both histories around a cutover. For collector configuration, use [Monitor IoT Edge devices](tutorial-monitor-with-workbooks.md).

## Access curated workbooks

Azure Monitor workbooks for IoT are templates that you use to visualize device metrics. You can customize them to fit your solution.

Follow these steps to access the curated workbooks:

1. Sign in to the [Azure portal](https://portal.azure.com), and go to your IoT Hub or IoT Central application.
1. Select **Workbooks** from the **Monitoring** section of the menu.
1. Choose a workbook to explore from the list of public templates:

   * **Fleet View**: Monitor your fleet of devices across multiple IoT Hubs or Central Apps, and drill into specific devices for a health snapshot.

   * **Device Details**: Visualize device details around messaging, modules, and host components on an IoT Edge device.

   * **Alerts**: View triggered [alerts](how-to-create-alerts.md) for devices across multiple IoT resources.

For a preview of the data and visualizations each workbook offers, see the following sections.

## Select the metrics source

1. Select your **Metrics Log Analytics workspace**.
1. Select the IoT Hub or IoT Central application that you want to monitor.
1. Select a time range that includes metric uploads.
1. Choose **Metrics source**:

   | Selection | Data |
   | --- | --- |
   | **Legacy only** | `InsightsMetrics` only. Existing saved copies keep their saved setting. |
   | **New only** (default in updated gallery templates) | The selected custom table only. No cutover time is required. |
   | **Combine legacy and new history** | Legacy data before the cutover, and new data at or after it. |

1. Set `MetricsTableName` to your custom table name, or keep the default `IoTEdgeMetrics_CL`.

   The table must use the [collector schema](migrate-metrics-collector.md#configure-the-collector-schema). An omitted or cleared value uses `IoTEdgeMetrics_CL`. An invalid name displays an error and also uses this default until you correct it. **Legacy only** always reads `InsightsMetrics`.

1. For **Combine legacy and new history**, enter **Cutover time (UTC)** in `YYYY-MM-DDTHH:mm:ssZ` format.

The cutover control appears only in Combine mode. Use the actual event-time boundary for your selected devices, not the current time.

The workbooks query the selected workspace and filter resource IDs without regard to case. Users need query access to that workspace. These workbooks use the [pass-through schema](migrate-metrics-collector.md#understand-resource-matching-and-query-scope) and don't rely on ingestion-time resource association.

Combine mode uses one boundary for the selection. For devices with different cutover times, use separate selections or customize the queries. For the full procedure, see [Preserve history in custom queries](migrate-metrics-collector.md#preserve-history-in-custom-queries).

## Fleet view workbook

The following animation focuses on the device list. It doesn't show the workspace or metrics-source controls described in [Select the metrics source](#select-the-metrics-source).

:::image type="content" source="./media/how-to-explore-curated-visualizations/how-to-explore-fleet-view.gif" alt-text="Animation of the devices section of the fleet view workbook." lightbox="./media/how-to-explore-curated-visualizations/how-to-explore-fleet-view.gif":::

This view shows device health for the selected IoT resources. Select multiple resources to view their devices together.

Health status depends on metric freshness and the configured thresholds. A device with old samples can have an **Unknown** status even when historical charts contain data.

Use the **Settings** tab to adjust thresholds to categorize devices as healthy or unhealthy.

Select the **Details** button to view the device list with a snapshot of aggregated primary metrics. Select the link in the **Status** column to view trends in an individual device's health metrics or select the device name to view its detailed metrics.

## Device details workbook

The device details workbook has three views:

* The **Messaging** view visualizes the message routes for the device and reports on the overall health of the messaging system.
* The **Modules** view shows how the individual modules on a device are performing.
* The **Host** view shows information about the host device including version information for host components and resource use.

Switch between views by selecting the tabs at the top of the workbook.

The device details workbook also integrates with the IoT Edge portal-based troubleshooting experience. You can pull **Live logs** from your device by using this feature. Access this experience by selecting the **Troubleshoot \<device name\> live** button above the workbook.

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

The **Host** view shows metrics from the **edgeAgent** module. It includes information like:

* Host component version information
* Uptime
* CPU, memory, and disk space use at the host level

# [Live logs](#tab/livelogs)

:::image type="content" source="./media/how-to-explore-curated-visualizations/how-to-troubleshoot-live.gif" alt-text="Access live logs through the device details workbook." lightbox="./media/how-to-explore-curated-visualizations/how-to-troubleshoot-live.gif":::

This workbook integrates directly with the portal-based troubleshooting experience. Select the **Troubleshoot live** button to go to the troubleshoot screen. Here, you can easily view module logs pulled from the device, on-demand. The time range is automatically set to the workbook's time range, so you're immediately in context. You can also restart any module from this experience.

---

## Alerts workbook

View generated alerts from [precreated alert rules](how-to-create-alerts.md) in the **Alerts** workbook. This view lets you see alerts from multiple IoT Hubs. Alert rules are separate Azure resources: updating a workbook doesn't update their queries, scopes, dimensions, or action groups.

:::image type="content" source="./media/how-to-explore-curated-visualizations/how-to-explore-alerts.gif" alt-text="Screenshot of the alerts section in the fleet view workbook." lightbox="./media/how-to-explore-curated-visualizations/how-to-explore-alerts.gif":::

The **Alerts** view reads alert records, not metric rows. Its workspace, metrics-source, and `MetricsTableName` controls provide context for links to **Device Details**.

Select a severity row to view alert details. The **Alert rule** link opens the alert context, and the **Device** link opens the detailed metrics workbook. When opened from this view, the device details workbook automatically adjusts to the time range around the alert firing.

## Customize workbooks

You can customize [Azure Monitor workbooks](/azure/azure-monitor/visualize/workbooks-overview). The templates use [Kusto Query Language](/kusto/query/) to normalize the selected metrics source before chart calculations.

To customize a workbook, enter editing mode. Select the **Edit** button in the workbook's menu bar. Curated workbooks use workbook groups extensively. You might need to select **Edit** on several nested groups to view a visualization query.

Save your changes as a new workbook. You can [share](/azure/azure-monitor/visualize/workbooks-overview#access-control) the saved workbook with your team or [deploy them programmatically](/azure/azure-monitor/visualize/workbooks-automate) as part of your organization's resource deployments.

> [!IMPORTANT]
> Updating a public template doesn't update workbooks that you previously saved or customized. Inventory and migrate those copies separately. Keep an unchanged backup until the migrated copy is reviewed and tested.

For existing saved copies, use [Update saved workbooks and alerts](migrate-metrics-collector.md#update-saved-workbooks-and-alerts). A table-name replacement alone isn't sufficient.

Preserve your custom metrics, dimensions, thresholds, and counter-reset logic. Update all metric queries, device-selection queries, no-data checks, and drill-through links.

Check that navigation retains the workspace, resource, device, time range, metrics source, table name, and cutover time. Check Legacy, New, and Combine modes before replacing your saved copy.

## Next steps

Customize your monitoring solution with [alert rules](how-to-create-alerts.md) and [metrics from custom modules](how-to-add-custom-metrics.md).
