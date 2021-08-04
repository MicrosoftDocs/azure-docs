---
title: Tutorial - Azure Monitor workbooks for IoT Edge
description: Learn how to monitor IoT Edge modules and devices using Azure Monitor Workbooks for IoT
author: kgremban
manager: lizross
ms.author: kgremban
ms.date: 08/02/2021
ms.topic: tutorial
ms.service: iot-edge
services: iot-edge
ms.custom: mvc
---

# Tutorial: Monitor IoT Edge devices

[!INCLUDE [iot-edge-version-all-supported](../../includes/iot-edge-version-all-supported.md)]

Use Azure Monitor workbooks to monitor the health and performance of your Azure IoT Edge deployments.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Understand what metrics are shared by IoT Edge devices and how the metrics collector module handles them.
> * Deploy the metrics collector module to an IoT Edge device.
> * View curated visualizations of the metrics collected from the device.
> * Create a log alert rule to monitor your devices.

## Prerequisites

An IoT Edge device with the simulated temperature sensor module deployed to it. If you don't have a device ready, follow the steps in [Deploy your first IoT Edge module to a virtual Linux device](quickstart-linux.md) to create one using a virtual machine.

## Understand IoT Edge metrics

Every IoT Edge device relies on two modules, the *runtime modules*, which are tasked with managing the lifecycle and communication of all the other modules on a device. These modules are called the **IoT Edge agent** and the **IoT Edge hub**. To learn more about these modules, see [Understand the Azure IoT Edge runtime and its architecture](iot-edge-runtime.md).

Both of the runtime modules create metrics that allow you to remotely monitor how an IoT Edge device or its individual modules are performing. The IoT Edge agent reports on the state of individual modules and the host device, so creates metrics like how long a module has been running correctly, or the amount of RAM and percent of CPU being used on the device. The IoT Edge hub reports on communications on the device, so creates metrics like the total number of messages sent and received, or the time it takes to resolve a direct method. For the full list of available metrics, see [Access built-in metrics](how-to-access-built-in-metrics.md).

These metrics are exposed automatically by both modules so that you can create your own solutions to access and report on these metrics. To make this process easier, Microsoft provides the [azureiotedge-metrics-collector module](https://hub.docker.com/_/microsoft-azureiotedge-metrics-collector) that handles this process for those who don't have or want a custom solution. The metrics collector module collects metrics from the two runtime modules and any other modules you may want to monitor, and transports them off-device.

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

1. From the menu on the left, under **Automatic Device Management**, select **IoT Edge**.

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

