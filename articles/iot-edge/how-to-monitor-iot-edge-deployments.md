---
title: Built-in edgeAgent direct methods - Azure IoT Edge
description: High-level monitoring including edgeHub and edgeAgent reported properties and automatic deployment metrics. 
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 04/9/2020
ms.topic: conceptual
ms.reviewer: veyalla
ms.service: iot-edge
services: iot-edge
---
# Monitor IoT Edge deployments

Azure IoT Edge provides metrics that let you monitor real-time information on the modules deployed to your IoT Edge devices. You can monitor these metrics in two ways:

* IoT Hub in the Azure portal

* Azure CLI

These metrics are obtained from the edgeAgent and edgeHub IoT Edge runtime modules. Specifically, real-time status values of deployed modules are read from the edgeHub reported properties by the device's or module's ID. A deployed module can set reported properties, and the solution backend can read and query them. Reported properties are used along with desired properties to synchronize module configuration or conditions. For details, see [Properties of the IoT Edge agent and IoT Edge hub module twins](module-edgeagent-edgehub.md).

## Monitor a deployment in the Azure portal

To view the details of a deployment and monitor the devices running it, use the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your IoT Hub.
1. Select **IoT Edge**.
1. Select the **IoT Edge deployments** tab.

   ![View IoT Edge deployments](./media/how-to-monitor-iot-edge-deployments/iot-edge-deployments.png)

1. Inspect the deployment list. For each deployment, you can view the following details:
   * **ID** - the name of the deployment.
   * **Type** - the type of deployment, either **Deployment** or **Layered Deployment**.
   * **Target Condition** - the tag used to define targeted devices.
   * **Priority** - the priority number assigned to the deployment.
   * **System metrics** - specifies the number of device twins in IoT Hub that match the targeting condition, and **Applied** specifies the number of devices that have had the deployment content applied to their module twins in IoT Hub.
   * **Device Metrics** - the number of IoT Edge devices in the deployment reporting success or errors from the IoT Edge client runtime.
   * **Custom Metrics** - the number of IoT Edge devices in the deployment reporting data for any metrics that you defined for the deployment.
   * **Creation Time** - the timestamp from when the deployment was created. This timestamp is used to break ties when two deployments have the same priority.
1. Select the deployment that you want to monitor.  
1. On the **Deployment Details** page, scroll down to the bottom section where you can review detailed metrics of the deployment. These metrics are provided in the following categories:

* **Targeted** shows the IoT Edge devices that match the Deployment targeting condition.
* **Applied** shows the targeted IoT Edge devices that are not targeted by another deployment of higher priority.
**Reporting Success** shows the IoT Edge devices that have reported that the modules have been deployed successfully.
**Reporting Failure** shows the IoT Edge devices that have reported that one or more modules haven't been deployed successfully. To further investigate the error, connect remotely to those devices and view the log files.
**Successfully Configured Devices** shows the number of devices that have a successful status.

   ![View IoT Edge deployment metrics](./media/how-to-monitor-iot-edge-deployments/deployment-metrics.png)

1. Select a metric and click **View Results** for a detailed report.

## Monitor a deployment with Azure CLI

Use the [az iot edge deployment show](https://docs.microsoft.com/cli/azure/ext/azure-cli-iot-ext/iot/edge/deployment?view=azure-cli-latest#ext-azure-cli-iot-ext-az-iot-edge-deployment-show) command to display the details of a single deployment:

```cli
az iot edge deployment show --deployment-id [deployment id] --hub-name [hub name]
```

The deployment show command takes the following parameters:

* **--deployment-id** - The name of the deployment that exists in the IoT hub. Required parameter.
* **--hub-name** - Name of the IoT hub in which the deployment exists. The hub must be in the current subscription. Switch to the desired subscription with the command `az account set -s [subscription name]`

Inspect the deployment in the command window. The **metrics** property lists a count for each metric that is evaluated by each hub:

* **targetedCount** - A system metric that specifies the number of device twins in IoT Hub that match the targeting condition.
* **appliedCount** - A system metric specifies the number of devices that have had the deployment content applied to their module twins in IoT Hub.
* **reportedSuccessfulCount** - A device metric that specifies the number of IoT Edge devices in the deployment reporting success from the IoT Edge client runtime.
* **reportedFailedCount** - A device metric that specifies the number of IoT Edge devices in the deployment reporting failure from the IoT Edge client runtime.

You can show a list of device IDs or objects for each of the metrics by using the [az iot edge deployment show-metric](https://docs.microsoft.com/cli/azure/ext/azure-cli-iot-ext/iot/edge/deployment?view=azure-cli-latest#ext-azure-cli-iot-ext-az-iot-edge-deployment-show-metric) command:

```cli
az iot edge deployment show-metric --deployment-id [deployment id] --metric-id [metric id] --hub-name [hub name]
```

The deployment show-metric command takes the following parameters:

* **--deployment-id** - The name of the deployment that exists in the IoT hub.
* **--metric-id** - The name of the metric for which you want to see the list of device IDs, for example `reportedFailedCount`.
* **--hub-name** - Name of the IoT hub in which the deployment exists. The hub must be in the current subscription. Switch to the desired subscription with the command `az account set -s [subscription name]`.

## Next steps

Learn how [communicate with edgeAgent using built-in direct methods](how-to-edgeagent-direct-method.md).
