---
title: Tutorial - Azure Monitor workbooks for IoT Edge
description: Learn how to monitor IoT Edge modules and devices using Azure Monitor Workbooks for IoT. Monitor the health and performance of your IoT Edge deployments.
author: sethmanheim
ms.author: sethm
ms.date: 09/15/2026
ms.topic: tutorial
ms.service: azure-iot-edge
services: iot-edge
ms.custom:
  - mvc
  - sfi-image-nochange
---

# Tutorial: Monitor IoT Edge devices

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

Use Azure Monitor workbooks to monitor the health and performance of your Azure IoT Edge deployments.

This tutorial uses Metrics Collector `2.0.0`, a Log Analytics custom table, a DCR, and Microsoft Entra authentication. For an existing collector 1.x deployment, use [Migrate the metrics collector](migrate-metrics-collector.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Learn what metrics IoT Edge devices share and how the metrics collector module handles them.
> * Deploy the metrics collector module to an IoT Edge device.
> * View curated visualizations of the metrics collected from the device.

## Prerequisites

You need an IoT Edge device with the simulated temperature sensor module deployed. If you don't have a device ready, follow the steps in [Deploy your first IoT Edge module to a virtual Linux device](quickstart-linux.md) to create one using a virtual machine.

You also need:

- Permission to update the device's deployment.
- A Log Analytics workspace, a DCR, and a custom metrics table (default `IoTEdgeMetrics_CL`).
- Permission to register an application in the Microsoft Entra tenant that contains the DCR.
- Permission to assign an Azure role on the DCR.
- Permission to query the workspace and open workbooks for your IoT Hub.

Use [Prepare Azure Monitor resources](migrate-metrics-collector.md#prepare-azure-monitor-resources) for the platform setup links and collector-specific schema.

## Understand IoT Edge metrics

Every IoT Edge device relies on two modules, called the *runtime modules*, that manage the lifecycle and communication of all other modules on a device. These modules are the **IoT Edge agent** and the **IoT Edge hub**. To learn more about these modules, see [Understand the Azure IoT Edge runtime and its architecture](iot-edge-runtime.md).

Both runtime modules create metrics that let you remotely monitor how an IoT Edge device or its individual modules perform. The IoT Edge agent reports on the state of individual modules and the host device, so it creates metrics like how long a module runs correctly, or the amount of RAM and percent of CPU used on the device. The IoT Edge hub reports on communications on the device, so it creates metrics like the total number of messages sent and received, or the time it takes to resolve a direct method. For the full list of available metrics, see [Access built-in metrics](how-to-access-built-in-metrics.md).

Both modules automatically expose these metrics, so you can create your own solutions to access and report on them. To make this process easier, Microsoft provides the [azureiotedge-metrics-collector module](https://mcr.microsoft.com/artifact/mar/azureiotedge-metrics-collector/tags), which handles this process if you don't have or want a custom solution. The metrics collector module collects metrics from the two runtime modules and any other modules you want to monitor, and sends them off the device.

This tutorial sends metrics directly to the custom table. The alternative `IotMessage` path sends metrics through IoT Hub and needs a separate cloud workflow for Log Analytics ingestion.

## Record your ingestion configuration

Record the HTTPS logs-ingestion endpoint, DCR immutable ID, and input-stream name from your Azure Monitor configuration. The immutable ID starts with `dcr-`.

The collector uses Microsoft Entra authentication. It doesn't use the workspace ID or shared key.

## Create a tutorial identity

For this tutorial, register a single-tenant Microsoft Entra application and use a short-lived client secret.

> [!IMPORTANT]
> Use a client secret only to learn and test this tutorial. Don't use this authentication method for a production deployment. The secret becomes part of the IoT Edge module deployment configuration and is delivered to the device. Anyone or any service that can read that configuration can recover the secret, even if the portal masks it on screen. Secrets also require secure distribution, rotation, revocation, and cleanup on every device where they're deployed.
>
> For production, choose an authentication method that your host and credential-delivery process support. An Azure virtual machine can use its managed identity when the identity endpoint is available to the container. Workload identity federation requires a supported OIDC issuer, a matching federated credential, and a refreshed token file available to the container. Don't treat an untested custom token refresher as a supported configuration. You can also use a securely delivered and rotated certificate. See [Configure authentication](migrate-metrics-collector.md#configure-authentication).

1. In the [Azure portal](https://portal.azure.com), go to **Microsoft Entra ID** > **App registrations**, and then select **New registration**.
1. Enter a name, such as `iot-edge-metrics-tutorial`.
1. For **Supported account types**, select **Accounts in this organizational directory only**. Leave **Redirect URI** empty, and then select **Register**.
1. On the application's **Overview** page, copy these values:

   - **Application (client) ID**. You use this value for `AZURE_CLIENT_ID`.
   - **Directory (tenant) ID**. You use this value for `AZURE_TENANT_ID`.

1. Select **Certificates & secrets** > **Client secrets** > **New client secret**.
1. Enter a description, select the shortest expiration that gives you enough time to complete the tutorial, and then select **Add**.
1. Copy the new secret's **Value** immediately and store it securely until you configure the module. The value is shown only once. Don't copy the **Secret ID**.
1. In the Azure portal, open the DCR that sends data to your custom metrics table.
1. Select **Access control (IAM)** > **Add** > **Add role assignment**.
1. On the **Role** tab, select **Monitoring Metrics Publisher**, and then select **Next**.
1. On the **Members** tab, select **User, group, or service principal** > **Select members**. Find the application that you registered, select it, and then select **Select**.
1. Select **Review + assign**, review the DCR-scoped assignment, and then select **Review + assign** again.

No Microsoft Graph API permission is required. The DCR-scoped Azure role assignment authorizes ingestion. Allow up to 30 minutes for the assignment to take effect. An upload attempted before propagation can return HTTP 403.

## Retrieve your IoT hub resource ID

When you configure the metrics collector module, you enter the Azure Resource Manager resource ID for your IoT hub. Get that ID now.

1. In the Azure portal, go to your IoT hub.

1. Under **Settings**, select **Properties**.

1. Copy the value of **Resource ID**. The format is `/subscriptions/<subscription_id>/resourceGroups/<resource_group_name>/providers/Microsoft.Devices/IoTHubs/<iot_hub_name>`.

## Deploy the metrics collector module

Deploy the metrics collector module to each device you want to monitor. It runs on the device like any other module and watches its assigned endpoints for metrics to collect and send to the cloud.

Follow these steps to deploy and configure the collector module:

1. Sign in to the [Azure portal](https://portal.azure.com), then go to your IoT hub.

1. Under **Device management**, select **Devices**.

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
   1. Update the following module settings:

      | Setting            | Value                                                                |
      |--------------------|----------------------------------------------------------------------|
      | IoT Module name    | `IoTEdgeMetricsCollector`                                         |
      | Image URI          | `mcr.microsoft.com/azureiotedge-metrics-collector:2.0.0` |
      | Restart policy     | always                                                               |
      | Desired status     | running                                                              |

   To use a different version or architecture of the metrics collector module, find available images in the [Microsoft Artifact Registry](https://mcr.microsoft.com/artifact/mar/azureiotedge-metrics-collector/tags).

   1. Go to the **Environment Variables** tab.
   1. Add the following text-type environment variables:

      | Name | Value |
      | ---- | ----- |
      | **ResourceId** | Your IoT hub resource ID that you retrieved in a previous section. |
      | **UploadTarget** | `AzureMonitor` |
      | **DataCollectionEndpoint** | Your HTTPS logs-ingestion base endpoint. |
      | **DataCollectionRuleId** | Your DCR immutable ID. |
      | **DataCollectionStreamName** | Your DCR input-stream name, such as `Custom-IoTEdgeMetrics`. |
      | **AZURE_TENANT_ID** | The **Directory (tenant) ID** that you copied from the app registration. |
      | **AZURE_CLIENT_ID** | The **Application (client) ID** that you copied from the app registration. |
      | **AZURE_CLIENT_SECRET** | The client secret **Value** that you copied. Don't use the **Secret ID**. |

      Treat any masked display of `AZURE_CLIENT_SECRET` in the portal as visual masking only. The value is still stored in the deployment configuration. Don't put it in source control, screenshots, support bundles, or logs.

      The default endpoints are `http://edgeHub:9600/metrics,http://edgeAgent:9600/metrics`. The default collection interval is 300 seconds.

      For all environment variables and production authentication options, see [Metrics collector configuration](how-to-collect-and-transport-metrics.md#metrics-collector-configuration) and [Configure authentication](migrate-metrics-collector.md#configure-authentication).

   1. Select **Apply** to save your changes.

    > [!NOTE]
    > To send metrics through IoT Hub, add a route to upstream similar to `FROM /messages/modules/< FROM_MODULE_NAME >/* INTO $upstream`. In this tutorial, metrics are sent directly to Log Analytics, so this route isn't needed.

1. Select **Review + create** to continue to the final step of deploying modules.

1. Select **Create** to finish the deployment.

After you finish deploying the modules, return to the device details page, where you see four modules listed as **Specified in Deployment**. It can take a few moments for all four modules to be listed as **Reported by Device**, which means they've started and reported their status to IoT Hub. Refresh the page to see the latest status.

## Monitor device health

Allow time for a collection cycle and ingestion. In the destination workspace, use [Check new ingestion](migrate-metrics-collector.md#check-new-ingestion) to check for recent rows.

Metrics are in your custom table (default `IoTEdgeMetrics_CL`), using the [pass-through schema](migrate-metrics-collector.md#understand-resource-matching-and-query-scope). These workbooks query the workspace and filter for your IoT Hub.

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

1. Select your **Metrics Log Analytics workspace**.

1. Select your IoT Hub and a time range that contains recent uploads.

1. Confirm that **Metrics source** is **New only**.

   The updated gallery template defaults to **New only**, which reads the selected custom table and doesn't require a cutover time. An existing saved copy keeps its saved setting and might still open in **Legacy only**.

1. Set `MetricsTableName` to your custom table name, or keep the default `IoTEdgeMetrics_CL`.

1. Select **Details** to open the device list.

1. Find your device in the list.

   Health depends on the configured thresholds and metric freshness. Older samples can produce an **Unknown** status.

1. Select the status icon to open **Health Snapshot**.

   The device-name link opens **Device Details** instead.

1. On any time chart, use the arrow icons under the X-axis or select the chart and drag your cursor to change the time range.

   :::image type="content" source="./media/tutorial-monitor-with-workbooks/health-snapshot-custom-time-range.png" alt-text="Screenshot showing to select and drag or use the arrow icons on any chart to change the time range.":::

1. Close the health snapshot workbook. In the fleet view workbook, select **Workbooks** to return to the workbooks gallery.

### Explore the device details workbook

The device details workbook shows performance details for an individual device. Follow these steps to explore the workbook visualizations:

1. In the workbooks gallery, select the **IoT Edge device details** workbook.

1. Select the workspace, IoT Hub, **New only**, and your device.

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

As you go through the rest of the tutorials, keep the metrics collector module on your test devices, and return to these workbooks to see how the information changes when you add more complex modules and routing.

Before you use the collector in production, replace the tutorial client secret with a [production authentication method](migrate-metrics-collector.md#configure-authentication). Then delete the client secret. If you no longer need the tutorial application, also remove its DCR role assignment and delete the application registration.

To compare old and new history, use [Migrate the metrics collector](migrate-metrics-collector.md#switch-workbooks-to-the-new-data).

To retain custom views, [save a workbook copy](how-to-explore-curated-visualizations.md#customize-workbooks). Configure [alert rules](how-to-create-alerts.md) separately.

Go to the next tutorial to set up your developer environment and start deploying custom modules to your devices.

> [!div class="nextstepaction"]
> [Develop Azure IoT Edge modules using Visual Studio Code](tutorial-develop-for-linux.md)
