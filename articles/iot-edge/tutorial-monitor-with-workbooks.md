---
title: Tutorial - Azure Monitor workbooks for IoT Edge
description: Learn how to monitor IoT Edge modules and devices using Azure Monitor Workbooks for IoT
author: PatAltimore
manager: lizross
ms.author: patricka
ms.date: 9/22/2022
ms.topic: tutorial
ms.service: iot-edge
services: iot-edge
ms.custom: mvc
---

# Tutorial: Monitor IoT Edge devices

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

Use Azure Monitor workbooks to monitor the health and performance of your Azure IoT Edge deployments.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Understand what metrics are shared by IoT Edge devices and how the metrics collector module handles them.
> * Deploy the metrics collector module to an IoT Edge device.
> * View curated visualizations of the metrics collected from the device.

## Prerequisites

An IoT Edge device with the simulated temperature sensor module deployed to it. If you don't have a device ready, follow the steps in [Deploy your first IoT Edge module to a virtual Linux device](quickstart-linux.md) to create one using a virtual machine.

## Understand IoT Edge metrics

Every IoT Edge device relies on two modules, the *runtime modules*, which manage the lifecycle and communication of all the other modules on a device. These modules are called the **IoT Edge agent** and the **IoT Edge hub**. To learn more about these modules, see [Understand the Azure IoT Edge runtime and its architecture](iot-edge-runtime.md).

Both of the runtime modules create metrics that allow you to remotely monitor how an IoT Edge device or its individual modules are performing. The IoT Edge agent reports on the state of individual modules and the host device, so creates metrics like how long a module has been running correctly, or the amount of RAM and percent of CPU being used on the device. The IoT Edge hub reports on communications on the device, so creates metrics like the total number of messages sent and received, or the time it takes to resolve a direct method. For the full list of available metrics, see [Access built-in metrics](how-to-access-built-in-metrics.md).

These metrics are exposed automatically by both modules so that you can create your own solutions to access and report on these metrics. To make this process easier, Microsoft provides the [azureiotedge-metrics-collector module](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft_iot_edge.metrics-collector?tab=overview) that handles this process for those who don't have or want a custom solution. The metrics collector module collects metrics from the two runtime modules and any other modules you may want to monitor, and transports them off-device.

The metrics collector module works one of two ways to send your metrics to the cloud. The first option, which we'll use in this tutorial, is to send the metrics directly to Log Analytics. The second option, which is only recommended if your networking policies require it, is to send the metrics through IoT Hub and then set up a route to pass the metric messages to Log Analytics. Either way, once the metrics are in your Log Analytics workspace, they are available to view through Azure Monitor workbooks.

## Create a Log Analytics workspace

A Log Analytics workspace is necessary to collect the metrics data and provides a query language and integration with Azure Monitor to enable you to monitor your devices.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Log Analytics workspaces**.

1. Select **Create** and then follow the prompts to create a new workspace.

1. Once your workspace is created, select **Go to resource**.

1. From the main menu under **Settings**, select **Agents management**.

1. Copy the values of **Workspace ID** and **Primary key**. You'll use these two values later in the tutorial to configure the metrics collector module to send the metrics to this workspace.

## Retrieve your IoT hub resource ID

When you configure the metrics collector module, you give it the Azure Resource Manager resource ID for your IoT hub. Retrieve that ID now.

1. From the Azure portal, navigate to your IoT hub.

1. From the menu on the left, under **Settings**, select **Properties**.

1. Copy the value of **Resource ID**. It should have the format `/subscriptions/<subscription_id>/resourceGroups/<resource_group_name>/providers/Microsoft.Devices/IoTHubs/<iot_hub_name>`.

## Deploy the metrics collector module

Deploy the metrics collector module to every device that you want to monitor. It runs on the device like any other module, and watches its assigned endpoints for metrics to collect and send to the cloud.

Follow these steps to deploy and configure the collector module:

1. Sign in to the [Azure portal](https://portal.azure.com) and go to your IoT hub.

1. From the menu on the left, select **Devices** under the **Device management** menu.

1. Select the device ID of the target device from the list of IoT Edge devices to open the device details page.

1. On the upper menu bar, select **Set Modules** to open the three-step module deployment page.

1. The first step of deploying modules from the portal is to declare which **Modules** should be on a device. If you are using the same device that you created in the quickstart, you should already see **SimulatedTemperatureSensor** listed. If not, add it now:

   1. Select **Add** then choose **Marketplace Module** from the drop-down menu.

   1. Search for and select **SimulatedTemperatureSensor**.

1. Add and configure the metrics collector module:

   1. Select **Add** then choose **Marketplace Module** from the drop-down menu.
   1. Search for and select **IoT Edge Metrics Collector**.
   1. Select the metrics collector module from the list of modules to open its configuration details page.
   1. Navigate to the **Environment Variables** tab.
   1. Update the following values:

      | Name | Value |
      | ---- | ----- |
      | **ResourceId** | Your IoT hub resource ID that you retrieved in a previous section. |
      | **UploadTarget** | `AzureMonitor` |
      | **LogAnalyticsWorkspaceId** | Your Log Analytics workspace ID that you retrieved in a previous section. |
      | **LogAnalyticsSharedKey** | Your Log Analytics key that you retrieved in a previous section. |

   1. Delete the **OtherConfig** environment variable, which is a placeholder for extra configuration options you may want to add in the future. It's not necessary for this tutorial.
   1. Select **Update** to save your changes.

1. Select **Next: Routes** to continue to the second step for deploying modules.

1. The portal automatically adds a route for the metrics collector. You would use this route if you configured the collector module to send the metrics through IoT Hub, but in this tutorial we're sending the metrics directly to Log Analytics so don't need it. Delete the **FromMetricsCollectorToUpstream** route.

1. Select **Review + create** to continue to the final step for deploying modules.

1. Select **Create** to finish the deployment.

After completing the module deployment, you return to the device details page where you can see four modules listed as **Specified in Deployment**. It may take a few moments for all four modules to be listed as **Reported by Device**, which means that they've been successfully started and reported their status to IoT Hub. Refresh the page to see the latest status.

## Monitor device health

It may take up to fifteen minutes for your device monitoring workbooks to be ready to view. Once you deploy the metrics collector module, it starts sending metrics messages to Log Analytics where they're organized within a table. The IoT Hub resource ID that you provided links the metrics that are ingested to the hub that they belong to. As a result, the curated IoT Edge workbooks can retrieve metrics by querying against the metrics table using the resource ID.

Azure Monitor provides three default workbook templates for IoT:

* The **Fleet View** workbook shows the health of devices across multiple IoT resources. The view allows configuring thresholds for determining device health and presents aggregations of primary metrics, per-device.
* The **Device Details** workbook provides visualizations around three categories: messaging, modules, and host. The messaging view visualizes the message routes for a device and reports on the overall health of the messaging system. The modules view shows how the individual modules on a device are performing. The host view shows information about the host device including version information for host components and resource use.
* The **Alerts** workbook View presents alerts for devices across multiple IoT resources.

### Explore the fleet view and health snapshot workbooks

The fleet view workbook shows all of your devices, and lets you select specific devices to view their health snapshots. Use the following steps to explore the workbook visualizations:

1. Return to your IoT hub page in the Azure portal.

1. Scroll down in the main menu to find the **Monitoring** section, and select **Workbooks**.

   :::image type="content" source="./media/tutorial-monitor-with-workbooks/workbooks-gallery.png" alt-text="Select workbooks to open the Azure Monitor workbooks gallery.":::

1. Select the **Fleet View** workbook.

1. You should see your device that's running the metrics collector module. The device is listed as either **healthy** or **unhealthy**.

1. Select the device name to view detailed metrics from the device.

1. On any of the time charts, use the arrow icons under the X-axis or click on the chart and drag your cursor to change the time range.

   :::image type="content" source="./media/tutorial-monitor-with-workbooks/health-snapshot-custom-time-range.png" alt-text="Click and drag or use the arrow icons on any chart to change the time range.":::

1. Close the health snapshot workbook. Select **Workbooks** from the fleet view workbook to return to the workbooks gallery.

### Explore the device details workbook

The device details workbook shows performance
details for an individual device. Use the following steps to explore the workbook visualizations:

1. From the workbooks gallery, select the **IoT Edge device details** workbook.

1. The first page you see in the device details workbook is the **messaging** view with the **routing** tab selected.

   On the left, a table displays the routes on the device, organized by endpoint. For our device, we see that the **upstream** endpoint, which is the special term used for routing to IoT Hub, is receiving messages from the **temperatureOutput** output of the simulated temperature sensor module.

   On the right, a graph keeps track of the number of connected clients over time. You can click and drag the graph to change the time range.

   :::image type="content" source="./media/tutorial-monitor-with-workbooks/device-details-messaging-routing.png" alt-text="Select the messaging view to see the status of communications on the device.":::

1. Select the **graph** tab to see a different visualization of the routes. On the graph page, you can drag and drop the different endpoints to rearrange the graph. This feature is helpful when you have many routes to visualize.

   :::image type="content" source="./media/tutorial-monitor-with-workbooks/device-details-messaging-graph.png" alt-text="Select the graph view to see an interactive graph of the device routes.":::

1. The **health** tab reports any issues with messaging, like dropped messages or disconnected clients.

1. Select the **modules** view to see the status of all the modules deployed on the device. You can select each of the modules to see details about how much CPU and memory they use.

   :::image type="content" source="./media/tutorial-monitor-with-workbooks/device-details-modules-availability.png" alt-text="Select the modules view to see the status of each module deployed to the device.":::

1. Select the **host** view to see information about the host device, including its operating system, the IoT Edge daemon version, and resource use.

## View module logs

After viewing the metrics for a device, you might want to dive in further and inspect the individual modules. IoT Edge provides troubleshooting support in the Azure portal with a live module log feature.

1. From the device details workbook, select **Troubleshoot live**.

   :::image type="content" source="./media/tutorial-monitor-with-workbooks/device-details-troubleshoot-live.png" alt-text="Select the troubleshoot live button from the top-right of the device details workbook.":::

1. The troubleshooting page opens to the **edgeAgent** logs from your IoT Edge device. If you selected a specific time range in the device details workbook, that setting is passed through to the troubleshooting page.

1. Use the dropdown menu to switch to the logs of other modules running on the device. Use the **Restart** button to restart a module.

   :::image type="content" source="./media/tutorial-monitor-with-workbooks/troubleshoot-device.png" alt-text="Use the dropdown menu to view the logs of different modules and use the restart button to restart modules.":::

The troubleshoot page can also be accessed from an IoT Edge device's details page. For more information, see [Troubleshoot IoT Edge devices from the Azure portal](troubleshoot-in-portal.md).

## Next steps

As you continue through the rest of the tutorials, keep the metrics collector module on your devices and return to these workbooks to see how the information changes as you add more complex modules and routing.

Continue to the next tutorial where you set up your developer environment to start deploying custom modules to your devices.

> [!div class="nextstepaction"]
> [Develop Azure IoT Edge modules using Visual Studio Code](tutorial-develop-for-linux.md)
