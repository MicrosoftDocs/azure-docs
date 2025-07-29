---
title: Monitor module twins - Azure IoT Edge
description: How to interpret device twins and module twins to determine connectivity and health.
author: PatAltimore

ms.author: patricka
ms.date: 06/09/2025
ms.topic: how-to
ms.service: azure-iot-edge
services: iot-edge
---
# Monitor module twins

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

Module twins in Azure IoT Hub let you monitor the connectivity and health of your IoT Edge deployments. Module twins store information in your IoT hub about the performance of your running modules. The [IoT Edge agent](iot-edge-runtime.md#iot-edge-agent) and the [IoT Edge hub](iot-edge-runtime.md#iot-edge-hub) runtime modules each maintain their own module twins: `$edgeAgent` and `$edgeHub`.

* `$edgeAgent` has health and connectivity data about the IoT Edge agent, IoT Edge hub runtime modules, and your custom modules. The IoT Edge agent deploys the modules, monitors them, and reports connection status to your Azure IoT hub.
* `$edgeHub` has data about communications between the IoT Edge hub running on a device and your Azure IoT hub. This includes processing incoming messages from downstream devices. The IoT Edge hub processes communications between Azure IoT Hub and IoT Edge devices and modules.

The data is organized into metadata, tags, and desired and reported property sets in the module twins' JSON structures. The desired properties you specify in your deployment.json file are copied to the module twins. The IoT Edge agent and the IoT Edge hub each update the reported properties for their modules.

Similarly, the desired properties you specify for your custom modules in the deployment.json file are copied to its module twin, but your solution provides its reported property values.

This article shows how to review the module twins in the Azure portal, Azure CLI, and Visual Studio Code. For information on monitoring how your devices receive the deployments, see [Monitor IoT Edge deployments](how-to-monitor-iot-edge-deployments.md). For an overview of module twins, see [Understand and use module twins in IoT Hub](../iot-hub/iot-hub-devguide-module-twins.md).

> [!TIP]
> The reported properties of a runtime module can be stale if an IoT Edge device gets disconnected from its IoT hub. [Ping](how-to-edgeagent-direct-method.md#ping) the `$edgeAgent` module to check if the connection was lost.

## Monitor runtime module twins

To troubleshoot deployment connectivity issues, review the IoT Edge agent and IoT Edge hub runtime module twins and then drill down into other modules.

### Monitor IoT Edge agent module twin

This JSON shows the `$edgeAgent` module twin in Visual Studio Code with most sections collapsed.

```json
{
  "deviceId": "Windows109",
  "moduleId": "$edgeAgent",
  "etag": "AAAAAAAAAAU=",
  "deviceEtag": "NzgwNjA1MDUz",
  "status": "enabled",
  "statusUpdateTime": "0001-01-01T00:00:00Z",
  "connectionState": "Disconnected",
  "lastActivityTime": "0001-01-01T00:00:00Z",
  "cloudToDeviceMessageCount": 0,
  "authenticationType": "sas",
  "x509Thumbprint": {
    "primaryThumbprint": null,
    "secondaryThumbprint": null
  },
  "version": 53,
  "properties": {
    "desired": { "···" },
    "reported": {
      "schemaVersion": "1.0",
      "version": { "···" },
      "lastDesiredStatus": { "···" },
      "runtime": { "···" },
      "systemModules": {
        "edgeAgent": { "···" },
        "edgeHub": { "···" }
      },
      "lastDesiredVersion": 5,
      "modules": {
        "SimulatedTemperatureSensor": { "···" }
      },
      "$metadata": { "···" },
      "$version": 48
    }
  }
}
```

This JSON has these sections:

* Metadata - Has connectivity data. The connection state for the IoT Edge agent is always `"Disconnected"` because it applies to device-to-cloud (D2C) messages, and the IoT Edge agent doesn't send D2C messages.
* Properties - Has the `desired` and `reported` subsections.
* Properties.desired - (shown collapsed) Expected property values set in the deployment.json file.
* Properties.reported - Latest property values reported by the IoT Edge agent.

Both the `properties.desired` and `properties.reported` sections have a similar structure and include metadata for schema, version, and runtime information. They also have a `modules` section for custom modules like `SimulatedTemperatureSensor`, and a `systemModules` section for `$edgeAgent` and `$edgeHub` runtime modules.

Compare the reported property values to the desired values to find discrepancies and identify disconnections that help you troubleshoot issues. When you compare values, check the `$lastUpdated` reported value in the `metadata` section for the property you're investigating.

Check these properties when you troubleshoot:

* **exitcode** - Any value other than zero means the module stopped with a failure. Error codes 137 or 143 are used if a module is intentionally set to a stopped status.

* **lastStartTimeUtc** - Shows the **DateTime** when the container last started. This value is 0001-01-01T00:00:00Z if the container isn't started.

* **lastExitTimeUtc** - Shows the **DateTime** when the container last finished. This value is 0001-01-01T00:00:00Z if the container is running and was never stopped.

* **runtimeStatus** - Has one of these values:

    | Value | Description |
    | --- | --- |
    | unknown | Default state until deployment is created. |
    | backoff | The module is scheduled to start but isn't running. This value is useful for a module that's restarting. When a failing module is awaiting restart during the cool-off period, the module is in a backoff state. |
    | running | The module is running. |
    | unhealthy | A health-probe check failed or timed out. |
    | stopped | The module exited successfully (with a zero exit code). |
    | failed | The module exited with a failure exit code (non-zero). The module can go back to backoff from this state depending on the restart policy. This state means the module has an unrecoverable error. Failure happens when the Microsoft Monitoring Agent (MMA) can't restart the module, requiring a new deployment. |

For details, see [EdgeAgent reported properties](module-edgeagent-edgehub.md#edgeagent-reported-properties).

### Monitor IoT Edge hub module twin

The following JSON shows the `$edgeHub` module twin in Visual Studio Code with most sections collapsed.

```json
{
  "deviceId": "Windows109",
  "moduleId": "$edgeHub",
  "etag": "AAAAAAAAAAU=",
  "deviceEtag": "NzgwNjA1MDU2",
  "status": "enabled",
  "statusUpdateTime": "0001-01-01T00:00:00Z",
  "connectionState": "Connected",
  "lastActivityTime": "0001-01-01T00:00:00Z",
  "cloudToDeviceMessageCount": 0,
  "authenticationType": "sas",
  "x509Thumbprint": {
    "primaryThumbprint": null,
    "secondaryThumbprint": null
  },
  "version": 102,
    "properties": {
      "desired": { "···" },
      "reported": {
        "schemaVersion": "1.0",
        "version": { "···" },
      "lastDesiredVersion": 5,
      "lastDesiredStatus": { "···" },
      "clients": {
        "Windows109/SimulatedTemperatureSensor": {
          "status": "Disconnected",
          "lastConnectedTimeUtc": "2020-04-08T21:42:42.1743956Z",
          "lastDisconnectedTimeUtc": "2020-04-09T07:02:42.1398325Z"
        }
      },
      "$metadata": { "···" },
      "$version": 97
    }
  }
}

```

The JSON can be described in the following sections, starting from the top:

* Metadata - Contains connectivity data.

* Properties - Contains the `desired` and `reported` subsections.
* Properties.desired - (shown collapsed) Expected property values set by the operator in the deployment.json file.
* Properties.reported - Latest property values reported by the IoT Edge hub.

If you're having issues with downstream devices, start by checking this data.

## Monitor custom module twins

The IoT Edge agent module twin keeps information about the connectivity of your custom modules. The module twin for your custom module mainly stores data for your solution. The desired properties you define in your deployment.json file appear in the module twin, and your module can update reported property values as needed.

Use your preferred programming language with the [Azure IoT Hub Device SDKs](../iot-hub/iot-hub-devguide-sdks.md#azure-iot-hub-device-sdks) to update reported property values in the module twin based on your module's application code. The following procedure uses the Azure SDK for .NET and code from the [SimulatedTemperatureSensor](https://github.com/Azure/iotedge/blob/main/edge-modules/SimulatedTemperatureSensor/src/Program.cs) module:

1. Create an instance of the [ModuleClient](/dotnet/api/microsoft.azure.devices.client.moduleclient) by using the [CreateFromEnvironmentAsync](/dotnet/api/microsoft.azure.devices.client.moduleclient.createfromenvironmentasync) method.

1. Get the module twin's properties by using the [GetTwinAsync](/dotnet/api/microsoft.azure.devices.client.moduleclient.gettwinasync) method.

1. Create a listener with a callback to catch changes to desired properties by using the [SetDesiredPropertyUpdateCallbackAsync](/dotnet/api/microsoft.azure.devices.client.deviceclient.setdesiredpropertyupdatecallbackasync) method.

1. In the callback method, update the reported properties in the module twin by using the [UpdateReportedPropertiesAsync](/dotnet/api/microsoft.azure.devices.client.moduleclient) method, and pass a [TwinCollection](/dotnet/api/microsoft.azure.devices.shared.twincollection) of the property values to set.

## Access the module twins

Review the JSON for module twins in Azure IoT Hub, Visual Studio Code, or Azure CLI.

### Monitor in Azure IoT Hub

View the JSON for the module twin:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your IoT hub.
1. Select **Devices** under the **Device management** menu.
1. Select the **Device ID** of the IoT Edge device with the modules you want to monitor.
1. Select the module name from the **Modules** tab and then select **Module Identity Twin** from the upper menu bar.

   :::image type="content" source="./media/how-to-monitor-module-twins/select-module-twin.png" alt-text="Screenshot showing how to select a module twin to view in the Azure portal.":::

If you see the message "A module identity doesn't exist for this module", this error means the back-end solution that originally created the identity isn't available.

### Monitor module twins in Visual Studio Code

Review and edit a module twin:

1. Install the [Azure IoT Edge](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge) and [Azure IoT Hub](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) extensions if they aren't already installed. The *Azure IoT Edge tools for Visual Studio Code* extension is in [maintenance mode](https://github.com/microsoft/vscode-azure-iot-edge/issues/639).
1. In the **Explorer**, expand **Azure IoT Hub**, then expand the device with the module you want to monitor.
1. Select the module, then select **Edit Module Twin**. A temporary file of the module twin downloads to your computer and opens in Visual Studio Code.

   :::image type="content" source="./media/how-to-monitor-module-twins/edit-module-twin-vscode.png" alt-text="Screenshot showing how to get a module twin to edit in Visual Studio Code.":::

After making changes, select **Update Module Twin** above the code in the editor to save them to your IoT hub.

   :::image type="content" source="./media/how-to-monitor-module-twins/update-module-twin-vscode.png" alt-text="Screenshot showing how to update a module twin in Visual Studio Code.":::

### Monitor module twins in Azure CLI

Check if IoT Edge is running by using the [az iot hub invoke-module-method](how-to-edgeagent-direct-method.md#ping) command to ping the IoT Edge agent.

The [az iot hub module-twin](/cli/azure/iot/hub/module-twin) structure provides these commands:

* **az iot hub module-twin show** - Show a module twin definition.
* **az iot hub module-twin update** - Update a module twin definition.
* **az iot hub module-twin replace** - Replace a module twin definition with a target JSON.

>[!TIP]
>To target the runtime modules with CLI commands, you might need to escape the `$` character in the module ID. For example:
>
>```azurecli
>az iot hub module-twin show -m '$edgeAgent' -n <hub name> -d <device name>
>```
>
>Or:
>
>```azurecli
>az iot hub module-twin show -m \$edgeAgent -n <hub name> -d <device name>
>```

## Next steps

Learn how to [communicate with EdgeAgent by using built-in direct methods](how-to-edgeagent-direct-method.md).
