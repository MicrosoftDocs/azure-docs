---
title: Communicate with IoT Edge Agent Using Direct Methods
description: Discover how to use IoT Edge agent direct methods to monitor device status, restart modules, and troubleshoot deployments remotely.
author: PatAltimore
ms.author: patricka
ms.date: 05/08/2025
ms.topic: concept-article
ms.service: azure-iot-edge
services: iot-edge
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:05/08/2025
  - ai-gen-description
---

# Communicate with edgeAgent using built-in direct methods

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

Monitor and manage IoT Edge deployments using the direct methods in the IoT Edge agent module. Direct methods are implemented on the device and can be invoked from the cloud. The IoT Edge agent includes direct methods to monitor and manage IoT Edge devices remotely.

For more information about direct methods, how to use them, and how to implement them in your own modules, see [Understand and invoke direct methods from IoT Hub](../iot-hub/iot-hub-devguide-direct-methods.md).

The names of these direct methods are case insensitive.

## Ping

The **ping** method checks if IoT Edge is running on a device or if the device has an open connection to IoT Hub. Use this method to ping the IoT Edge agent and check its status. A successful ping returns an empty payload and a **"status": 200**.

For example:

```azurecli
az iot hub invoke-module-method --method-name 'ping' -n <hub name> -d <device name> -m '$edgeAgent'
```

In the Azure portal, invoke the method using the method name `ping` and an empty JSON payload `{}`.

:::image type="content" source="./media/how-to-edgeagent-direct-method/ping-direct-method.png" alt-text="Screenshot of how to invoke the direct method ping in Azure portal.":::

## Restart module

The **RestartModule** method lets you remotely manage modules running on an IoT Edge device. If a module reports a failed state or unhealthy behavior, trigger the IoT Edge agent to restart it. A successful restart command returns an empty payload with **"status": 200**.

The RestartModule method is available starting with IoT Edge version 1.0.9.

>[!TIP]
>The IoT Edge troubleshooting page in the Azure portal simplifies restarting modules. For more information, see [Monitor and troubleshoot IoT Edge devices from the Azure portal](troubleshoot-in-portal.md).

Use the RestartModule direct method on any module running on an IoT Edge device, including the edgeAgent module. If you use this direct method to shut down the edgeAgent, you don't receive a success result because the connection is disrupted during the module restart.

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

In the Azure portal, use the method name `RestartModule` with the following JSON payload:

```json
{
    "schemaVersion": "1.0",
    "id": "<module name>"
}
```

:::image type="content" source="./media/how-to-edgeagent-direct-method/restartmodule-direct-method.png" alt-text="Screenshot of invoking the direct method RestartModule in the Azure portal.":::

## Diagnostic direct methods

* [GetModuleLogs](how-to-retrieve-iot-edge-logs.md#retrieve-module-logs): Retrieve module logs in the response of the direct method.
* [UploadModuleLogs](how-to-retrieve-iot-edge-logs.md#upload-module-logs): Retrieve module logs and upload to Azure Blob Storage.
* [UploadSupportBundle](how-to-retrieve-iot-edge-logs.md#upload-support-bundle-diagnostics): Retrieve module logs with a support bundle and upload a zip file to Azure Blob Storage.
* [GetTaskStatus](how-to-retrieve-iot-edge-logs.md#get-upload-request-status): Check the status of an upload logs or support bundle request.

These diagnostic direct methods are available as of the 1.0.10 release.

## Next steps

[Properties of the IoT Edge agent and IoT Edge hub module twins](module-edgeagent-edgehub.md)
