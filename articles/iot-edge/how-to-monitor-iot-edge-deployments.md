---
title: Monitor IoT Edge deployments - Azure IoT Edge
description: High-level monitoring including edgeHub and edgeAgent reported properties and automatic deployment metrics. 
author: PatAltimore

ms.author: patricka
ms.date: 06/06/2025
ms.topic: concept-article
ms.service: azure-iot-edge
ms.custom: devx-track-azurecli
services: iot-edge
---
# Monitor IoT Edge deployments

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

Azure IoT Edge gives you real-time information about the modules deployed to your IoT Edge devices. The IoT Hub service gets status from the devices and shows it to you. Monitoring is also important for [deployments made at scale](module-deployment-monitoring.md) that include automatic deployments and layered deployments.

Devices and modules have similar data, like connectivity, so you get values based on the device ID or module ID.

The IoT Hub service collects data reported by device and module twins and gives you counts of the different states that devices can have. The IoT Hub service organizes this data into four groups of metrics:

| Type | Description |
| --- | ---|
| Targeted | Shows IoT Edge devices that match the deployment targeting condition. |
| Applied | Shows targeted IoT Edge devices that aren't targeted by another deployment with higher priority. |
| Reporting Success | Shows IoT Edge devices that report the modules are deployed successfully. |
| Reporting Failure | Shows IoT Edge devices that report one or more modules aren't deployed successfully. To investigate the error, connect remotely to those devices and view the log files. |

You can monitor this data in the Azure portal or use Azure CLI.

## Monitor a deployment in the Azure portal

To view deployment details and monitor the devices running it, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com), then go to your IoT Hub.
1. Select **Configurations + Deployments** under **Device management**.
1. Review the deployment list. For each deployment, you see the following details:

    | Column | Description |
    | --- | --- |
    | ID | The name of the deployment. |
    | Type | The type of deployment, either **Deployment** or **Layered Deployment**. |
    | Target Condition | The tag that defines targeted devices. |
    | Priority | The priority number assigned to the deployment. |
    | System metrics | The number of device twins in IoT Hub that match the targeting condition. **Applied** shows the number of devices that have the deployment content applied to their module twins in IoT Hub. |
    | Device Metrics | The number of IoT Edge devices reporting success or errors from the IoT Edge client runtime. |
    | Custom Metrics | The number of IoT Edge devices reporting data for any metrics that you define for the deployment. |
    | Created | The timestamp when the deployment is created. This timestamp is used to break ties when two deployments have the same priority. |

1. Select the deployment you want to monitor.
1. On the **Deployment Details** page, go to the **Target Condition** tab. Select **View** to list the devices that match the target condition. Change the condition or **Priority** as needed, then select **Save**.

   :::image type="content" source="./media/how-to-monitor-iot-edge-deployments/target-devices.png" alt-text="Screenshot showing targeted devices for a deployment.":::

1. Select the **Metrics** tab. When you choose a metric from the **Select Metric** drop-down, the **View** button appears so you can display the results. Select **Edit Metrics** to adjust the criteria for any custom metrics you define. Select **Save** if you make changes.

   :::image type="content" source="./media/how-to-monitor-iot-edge-deployments/deployment-metrics-tab.png" alt-text="Screenshot showing the metrics for a deployment.":::

To change your deployment, see [Modify a deployment](how-to-deploy-at-scale.md#modify-a-deployment).

## Monitor a deployment with Azure CLI

Use the [az iot edge deployment show](/cli/azure/iot/edge/deployment) command to show the details of a single deployment:

```azurecli
az iot edge deployment show --deployment-id [deployment id] --hub-name [hub name]
```

The `deployment show` command uses these parameters:

* **--deployment-id** - The name of the deployment in the IoT hub. Required parameter.
* **--hub-name** - The name of the IoT hub where the deployment exists. The hub must be in the current subscription. Switch to the subscription with `az account set -s [subscription name]`

Check the deployment in the command window. The `metrics` property lists a count for each metric that is evaluated by each hub:

* **targetedCount** - The number of device twins in IoT Hub that match the targeting condition.
* **appliedCount** - The number of devices that have the deployment content applied to their module twins in IoT Hub.
* **reportedSuccessfulCount** - The number of IoT Edge devices in the deployment reporting success from the IoT Edge client runtime.
* **reportedFailedCount** - The number of IoT Edge devices in the deployment reporting failure from the IoT Edge client runtime.

Show a list of device IDs or objects for each metric with the [az iot edge deployment show-metric](/cli/azure/iot/edge/deployment) command:

```azurecli
az iot edge deployment show-metric --deployment-id [deployment id] --metric-id [metric id] --hub-name [hub name]
```

The `deployment show-metric` command uses these parameters:

* **--deployment-id** - The name of the deployment in the IoT hub.
* **--metric-id** - The name of the metric to show the list of device IDs, for example `reportedFailedCount`.
* **--hub-name** - The name of the IoT hub where the deployment exists. The hub must be in the current subscription. Switch to the subscription with `az account set -s [subscription name]`.
To make changes to your deployment, see [Modify a deployment](how-to-deploy-cli-at-scale.md#modify-a-deployment).

## Next steps

Learn how to [monitor module twins](how-to-monitor-module-twins.md), primarily the IoT Edge Agent and IoT Edge Hub runtime modules, to check the connectivity and health of your IoT Edge deployments.
