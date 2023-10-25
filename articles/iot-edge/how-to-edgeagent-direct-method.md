---
title: Built-in edgeAgent direct methods - Azure IoT Edge
description: Monitor and manage an IoT Edge deployment using built-in direct methods in the IoT Edge agent runtime module
author: PatAltimore

ms.author: patricka
ms.date: 03/02/2020
ms.topic: conceptual
ms.reviewer: veyalla
ms.service: iot-edge
services: iot-edge
---

# Communicate with edgeAgent using built-in direct methods

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

Monitor and manage IoT Edge deployments by using the direct methods included in the IoT Edge agent module. Direct methods are implemented on the device, and then can be invoked from the cloud. The IoT Edge agent includes direct methods that help you monitor and manage your IoT Edge devices remotely.

For more information about direct methods, how to use them, and how to implement them in your own modules, see [Understand and invoke direct methods from IoT Hub](../iot-hub/iot-hub-devguide-direct-methods.md).

The names of these direct methods are handled case-insensitive.

## Ping

The **ping** method is useful for checking whether IoT Edge is running on a device, or whether the device has an open connection to IoT Hub. Use this direct method to ping the IoT Edge agent and get its status. A successful ping returns an empty payload and **"status": 200**.

For example:

```azurecli
az iot hub invoke-module-method --method-name 'ping' -n <hub name> -d <device name> -m '$edgeAgent'
```

In the Azure portal, invoke the method with the method name `ping` and an empty JSON payload `{}`.

:::image type="content" source="./media/how-to-edgeagent-direct-method/ping-direct-method.png" alt-text="Screenshot showing how to invoke the direct method ping in Azure portal.":::

## Restart module

The **RestartModule** method allows for remote management of modules running on an IoT Edge device. If a module is reporting a failed state or other unhealthy behavior, you can trigger the IoT Edge agent to restart it. A successful restart command returns an empty payload and **"status": 200**.

The RestartModule method is available in IoT Edge version 1.0.9 and later.

>[!TIP]
>The IoT Edge troubleshooting page in the Azure portal provides a simplified experience for restarting modules. For more information, see [Monitor and troubleshoot IoT Edge devices from the Azure portal](troubleshoot-in-portal.md).

You can use the RestartModule direct method on any module running on an IoT Edge device, including the edgeAgent module itself. However, if you use this direct method to shut down the edgeAgent, you won't receive a success result since the connection is disrupted while the module restarts.

For example:

```azurecli
az iot hub invoke-module-method --method-name 'RestartModule' -n <hub name> -d <device name> -m '$edgeAgent' --method-payload \
'
    {
        "schemaVersion": "1.0",
        "id": "<module name>"
    }
'
```

In the Azure portal, invoke the method with the method name `RestartModule` and the following JSON payload:

```json
{
    "schemaVersion": "1.0",
    "id": "<module name>"
}
```

:::image type="content" source="./media/how-to-edgeagent-direct-method/restartmodule-direct-method.png" alt-text="Screenshot showing how to invoke direct method RestartModule in the Azure portal.":::

## Diagnostic direct methods

* [GetModuleLogs](how-to-retrieve-iot-edge-logs.md#retrieve-module-logs): Retrieve module logs inline in the response of the direct method.
* [UploadModuleLogs](how-to-retrieve-iot-edge-logs.md#upload-module-logs): Retrieve module logs and upload them to Azure Blob Storage.
* [UploadSupportBundle](how-to-retrieve-iot-edge-logs.md#upload-support-bundle-diagnostics): Retrieve module logs using a support bundle and upload a zip file to Azure Blob Storage.
* [GetTaskStatus](how-to-retrieve-iot-edge-logs.md#get-upload-request-status): Check on the status of an upload logs or support bundle request.

These diagnostic direct methods are available as of the 1.0.10 release.

## Next steps

[Properties of the IoT Edge agent and IoT Edge hub module twins](module-edgeagent-edgehub.md)
