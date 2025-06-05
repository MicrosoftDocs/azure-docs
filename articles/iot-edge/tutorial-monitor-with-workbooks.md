---
title: Tutorial - Azure Monitor workbooks for IoT Edge
description: Learn how to monitor IoT Edge modules and devices using Azure Monitor Workbooks for IoT. Monitor the health and performance of your IoT Edge deployments.
author: PatAltimore
ms.author: patricka
ms.date: 06/04/2025
ms.topic: tutorial
ms.service: azure-iot-edge
services: iot-edge
ms.custom: mvc
---

# Tutorial: Monitor IoT Edge devices

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

Use Azure Monitor workbooks to monitor the health and performance of your Azure IoT Edge deployments.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Learn what metrics IoT Edge devices share and how the metrics collector module handles them.
> * Deploy the metrics collector module to an IoT Edge device.
> * View curated visualizations of the metrics collected from the device.

## Prerequisites

You need an IoT Edge device with the simulated temperature sensor module deployed. If you don't have a device ready, follow the steps in [Deploy your first IoT Edge module to a virtual Linux device](quickstart-linux.md) to create one using a virtual machine.

## Understand IoT Edge metrics

Every IoT Edge device relies on two modules, called the *runtime modules*, that manage the lifecycle and communication of all other modules on a device. These modules are the **IoT Edge agent** and the **IoT Edge hub**. To learn more about these modules, see [Understand the Azure IoT Edge runtime and its architecture](iot-edge-runtime.md).

Both runtime modules create metrics that let you remotely monitor how an IoT Edge device or its individual modules perform. The IoT Edge agent reports on the state of individual modules and the host device, so it creates metrics like how long a module runs correctly, or the amount of RAM and percent of CPU used on the device. The IoT Edge hub reports on communications on the device, so it creates metrics like the total number of messages sent and received, or the time it takes to resolve a direct method. For the full list of available metrics, see [Access built-in metrics](how-to-access-built-in-metrics.md).

Both modules automatically expose these metrics, so you can create your own solutions to access and report on them. To make this process easier, Microsoft provides the [azureiotedge-metrics-collector module](https://mcr.microsoft.com/artifact/mar/azureiotedge-metrics-collector?tab=overview), which handles this process if you don't have or want a custom solution. The metrics collector module collects metrics from the two runtime modules and any other modules you want to monitor, and sends them off the device.

The metrics collector module sends your metrics to the cloud in one of two ways. The first option, used in this tutorial, sends the metrics directly to Log Analytics. The second option is recommended only if your networking policies require it. It sends the metrics through IoT Hub and then sets up a route to pass the metric messages to Log Analytics. Either way, once the metrics are in your Log Analytics workspace, you can view them through Azure Monitor workbooks.

## Create a Log Analytics workspace

A Log Analytics workspace is necessary collect metrics data, use a query language, and integrate with Azure Monitor so you can monitor your devices.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for **Log Analytics workspaces**, and then select it.

1. Select **Create**, and then follow the prompts to create a new workspace.

1. When your workspace is ready, select **Go to resource**.

1. In the main menu under **Settings**, select **Agents**.

1. Copy the values for **Workspace ID** and **Primary key** under *Log Analytics agent instructions*. You use these values later in the tutorial to configure the metrics collector module to send metrics to this workspace.

## Retrieve your IoT hub resource ID

When you configure the metrics collector module, you enter the Azure Resource Manager resource ID for your IoT hub. Get that ID now.

1. In the Azure portal, go to your IoT hub.

1. Under **Settings**, select **Properties**.

1. Copy the value of **Resource ID**. The format is `/subscriptions/<subscription_id>/resourceGroups/<resource_group_name>/providers/Microsoft.Devices/IoTHubs/<iot_hub_name>`.

## Deploy the metrics collector module

Deploy the metrics collector module to each device you want to monitor. It runs on the device like any other module and watches its assigned endpoints for metrics to collect and send to the cloud.

Follow these steps to deploy and configure the collector module:

1. Sign in to the [Azure portal](https://portal.azure.com), then go to your IoT hub.

1.Under **Device management**, select **Devices**.

1. Select the device ID of the target device in the list of IoT Edge devices to open the device details page.

1. In the menu bar, select **Set Modules**.

1. The first step of deploying modules from the portal is to declare which **Modules** are on a device. If you're using the same device you created in the quickstart, you already see **SimulatedTemperatureSensor** listed. If not, add it now:

    1. In the **IoT Edge modules** section, select **Add**, then choose **IoT Edge Module**.
    1. Update the following module settings:

        | Setting            | Value                                                                |
        |--------------------|----------------------------------------------------------------------|
        | IoT Module name    | `SimulatedTemperatureSensor`                                         |
        | Image URI          | `mcr.microsoft.com/azureiotedge-simulated-temperature-sensor:latest` |
        | Restart policy     | always                                                               |
        | Desired status     | running                                                              |
    
    1. Select **Next: Routes** to continue to configure routes.
    
    1. Add a route that sends all messages from the simulated temperature module to IoT Hub.

       | Setting                          | Value                                      |
       |----------------------------------|--------------------------------------------|
       | Name                             | `SimulatedTemperatureSensorToIoTHub`       |
       | Value                            | `FROM /messages/modules/SimulatedTemperatureSensor/* INTO $upstream` |

1. Add and configure the metrics collector module:

   1. Select **Add**, then choose **IoT Edge Module**.
   1. Search for and select **IoT Edge Metrics Collector**.
   1. Update the following module settings:

        | Setting            | Value                                                                |
        |--------------------|----------------------------------------------------------------------|
        | IoT Module name    | `IoTEdgeMetricsCollector`                                         |
        | Image URI          | `mcr.microsoft.com/azureiotedge-metrics-collector:latest` |
        | Restart policy     | always                                                               |
        | Desired status     | running                                                              |

   To use a different version or architecture of the metrics collector module, find available images in the [Microsoft Artifact Registry](https://mcr.microsoft.com/product/azureiotedge-metrics-collector).

   1. Go to the **Environment Variables** tab.
   1. Add the following text-type environment variables:

      | Name | Value |
      | ---- | ----- |
      | **ResourceId** | Your IoT hub resource ID that you retrieved in a previous section. |
      | **UploadTarget** | `AzureMonitor` |
      | **LogAnalyticsWorkspaceId** | Your Log Analytics workspace ID that you retrieved in a previous section. |
      | **LogAnalyticsSharedKey** | Your Log Analytics key that you retrieved in a previous section. |

      For more information about environment variable settings, see [Metrics collector configuration](https://aka.ms/edgemon-config).

   1. Select **Apply** to save your changes.

    > [!NOTE]
    > To send metrics through IoT Hub, add a route to upstream similar to `FROM /messages/modules/< FROM_MODULE_NAME >/* INTO $upstream`. In this tutorial, metrics are sent directly to Log Analytics, so this route isn't needed.

1. Select **Review + create** to continue to the final step of deploying modules.

1. Select **Create** to finish the deployment.

After you finish deploying the modules, return to the device details page, where you see four modules listed as **Specified in Deployment**. It can take a few moments for all four modules to be listed as **Reported by Device**, which means they've started and reported their status to IoT Hub. Refresh the page to see the latest status.

## Monitor device health

It can take up to 15 minutes for your device monitoring workbooks to be ready to view. After you deploy the metrics collector module, it starts sending metrics messages to Log Analytics, where they're organized in a table. The IoT Hub resource ID you provide links the ingested metrics to the correct hub. As a result, the curated IoT Edge workbooks retrieve metrics by querying the metrics table with the resource ID.

Azure Monitor provides three default workbook templates for IoT:

* The **Fleet View** workbook shows the health of devices across multiple IoT resources. The view lets you set thresholds for device health and shows aggregations of primary metrics per device.
* The **Device Details** workbook shows visualizations for messaging, modules, and host. The messaging view visualizes the message routes for a device and reports on the overall health of the messaging system. The modules view shows how the individual modules on a device perform. The host view shows information about the host device, including version information for host components and resource use.
* The **Alerts** workbook view shows alerts for devices across multiple IoT resources.

### Explore the fleet view and health snapshot workbooks

The fleet view workbook shows all your devices and lets you select specific devices to view their health snapshots. Follow these steps to explore the workbook visualizations:

1. Go to your IoT hub page in the Azure portal.

1. In the main menu, scroll down to the **Monitoring** section, and select **Workbooks**.

   :::image type="content" source="./media/tutorial-monitor-with-workbooks/workbooks-gallery.png" alt-text="Select workbooks to open the Azure Monitor workbooks gallery.":::

1. Select the **Fleet View** workbook.

1. You see your device that's running the metrics collector module. The device is listed as either **healthy** or **unhealthy**.

1. Select the device name to view detailed metrics.

1. On any time chart, use the arrow icons under the X-axis or select the chart and drag your cursor to change the time range.

   :::image type="content" source="./media/tutorial-monitor-with-workbooks/health-snapshot-custom-time-range.png" alt-text="Screenshot showing to select and drag or use the arrow icons on any chart to change the time range.":::

1. Close the health snapshot workbook. In the fleet view workbook, select **Workbooks** to return to the workbooks gallery.

### Explore the device details workbook

The device details workbook shows performance details for an individual device. Follow these steps to explore the workbook visualizations:

1. In the workbooks gallery, select the **IoT Edge device details** workbook.

1. The first page in the device details workbook is the **messaging** view with the **routing** tab selected.

   On the left, a table shows the routes on the device, organized by endpoint. For this device, the **upstream** endpoint, which is the term for routing to IoT Hub, receives messages from the **temperatureOutput** output of the simulated temperature sensor module.

   On the right, a graph shows the number of connected clients over time. Select and drag the graph to change the time range.

   :::image type="content" source="./media/tutorial-monitor-with-workbooks/device-details-messaging-routing.png" alt-text="Select the messaging view to see the status of communications on the device.":::

1. Select the **graph** tab to see a different visualization of the routes. On the graph page, drag and drop the endpoints to rearrange the graph. This feature helps when you have many routes to visualize.

   :::image type="content" source="./media/tutorial-monitor-with-workbooks/device-details-messaging-graph.png" alt-text="Select the graph view to see an interactive graph of the device routes.":::

1. The **health** tab shows any issues with messaging, like dropped messages or disconnected clients.

1. Select the **modules** view to see the status of all modules deployed on the device. Select a module to see details about its CPU and memory use.

   :::image type="content" source="./media/tutorial-monitor-with-workbooks/device-details-modules-availability.png" alt-text="Select the modules view to see the status of each module deployed to the device.":::

1. Select the **host** view to see information about the host device, including its operating system, IoT Edge daemon version, and resource use.

## View module logs

After you view the metrics for a device, you might want to dive in further and inspect the individual modules. IoT Edge provides troubleshooting support in the Azure portal with a live module log feature.

1. In the device details workbook, select **Troubleshoot live**.

   :::image type="content" source="./media/tutorial-monitor-with-workbooks/device-details-troubleshoot-live.png" alt-text="Select the troubleshoot live button from the top-right of the device details workbook.":::

1. The troubleshooting page opens to the **edgeAgent** logs from your IoT Edge device. If you select a specific time range in the device details workbook, that setting passes through to the troubleshooting page.

1. Use the dropdown menu to switch to the logs of other modules running on the device, and use the **Restart** button to restart a module.

   :::image type="content" source="./media/tutorial-monitor-with-workbooks/troubleshoot-device.png" alt-text="Use the dropdown menu to view the logs of different modules and use the restart button to restart modules.":::

You can also access the troubleshoot page from an IoT Edge device's details page. For more information, see [Troubleshoot IoT Edge devices from the Azure portal](troubleshoot-in-portal.md).

## Next steps

As you go through the rest of the tutorials, keep the metrics collector module on your devices, and return to these workbooks to see how the information changes when you add more complex modules and routing.

Go to the next tutorial to set up your developer environment and start deploying custom modules to your devices.

> [!div class="nextstepaction"]
> [Develop Azure IoT Edge modules using Visual Studio Code](tutorial-develop-for-linux.md)
