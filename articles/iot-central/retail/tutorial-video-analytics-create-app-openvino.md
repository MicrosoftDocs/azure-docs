---
title: 'Tutorial - Create a video analytics - object and motion detection application in Azure IoT Central (OpenVINO)'
description: This tutorial shows how to create a video analytics application in IoT Central. You create it, customize it, and connect it to other Azure services. This tutorial uses the Intel OpenVINO&trade; toolkit for real-time object detection.
services: iot-central
ms.service: iot-central
ms.subservice: iot-central-retail
ms.topic: tutorial
author: KishorIoT
ms.author: nandab
ms.date: 10/06/2020
---
# Tutorial: Create a video analytics - object and motion detection application in Azure IoT Central (OpenVINO&trade;)

As a solution builder, learn how to create a video analytics application with the IoT Central *video analytics - object and motion detection* application template, Azure IoT Edge devices, Azure Media Services, and Intel's hardware-optimized OpenVINO&trade; for object and motion detection. The solution uses a retail store to show how to meet the common business need to monitor security cameras. The solution uses automatic object detection in a video feed to quickly identify and locate interesting events.

> [!TIP]
> To use YOLO v3 instead of OpenVINO&trade; for object an motion detection, see [Tutorial: Create a video analytics - object and motion detection application in Azure IoT Central (YOLO v3)](tutorial-video-analytics-create-app-yolo-v3.md).

[!INCLUDE [iot-central-video-analytics-part1](../../../includes/iot-central-video-analytics-part1.md)]

- [Scratchpad.txt](https://raw.githubusercontent.com/Azure/live-video-analytics/master/ref-apps/lva-edge-iot-central-gateway/setup/Scratchpad.txt)
- [deployment.openvino.amd64.json](https://raw.githubusercontent.com/Azure/live-video-analytics/master/ref-apps/lva-edge-iot-central-gateway/setup/deployment.openvino.amd64.json)
- [LvaEdgeGatewayDcm.json](https://raw.githubusercontent.com/Azure/live-video-analytics/master/ref-apps/lva-edge-iot-central-gateway/setup/LvaEdgeGatewayDcm.json)
- [state.json](https://raw.githubusercontent.com/Azure/live-video-analytics/master/ref-apps/lva-edge-iot-central-gateway/setup/state.json)

[!INCLUDE [iot-central-video-analytics-part2](../../../includes/iot-central-video-analytics-part2.md)]

## Edit the deployment manifest

You deploy an IoT Edge module using a deployment manifest. In IoT Central you can import the manifest as a device template, and then let IoT Central manage the module deployment.

To prepare the deployment manifest:

1. Open the *deployment.openvino.amd64.json* file, which you saved in the *lva-configuration* folder, using a text editor.

1. Find the `LvaEdgeGatewayModule` settings and change the image name as shown in the following snippet:

    ```json
    "LvaEdgeGatewayModule": {
        "settings": {
            "image": "mcr.microsoft.com/lva-utilities/lva-edge-iotc-gateway:1.0-amd64",
    ```

1. Add the name of your Media Services account in the `env` node in the `LvaEdgeGatewayModule` section. You made a note of this account name in the *scratchpad.txt* file:

    ```json
    "env": {
        "lvaEdgeModuleId": {
            "value": "lvaEdge"
        },
        "amsAccountName": {
            "value": "<YOUR_AZURE_MEDIA_ACCOUNT_NAME>"
        }
    }
    ```

1. The template doesn't expose these properties in IoT Central, so you need to add the Media Services configuration values to the deployment manifest. Locate the `lvaEdge` module and replace the placeholders with the values you made a note of in the *scratchpad.txt* file when you created your Media Services account.

    The `azureMediaServicesArmId` is the **Resource ID** you made a note of in the *scratchpad.txt* file when you created the Media Services account.

    You made a note of the `aadTenantId`, `aadServicePrincipalAppId`, and `aadServicePrincipalSecret` in the *scratchpad.txt* file when you created the service principal for your Media Services account:

    ```json
    {
        "lvaEdge":{
        "properties.desired": {
            "applicationDataDirectory": "/var/lib/azuremediaservices",
            "azureMediaServicesArmId": "[Resource ID from scratchpad]",
            "aadTenantId": "[AADTenantID from scratchpad]",
            "aadServicePrincipalAppId": "[AadClientId from scratchpad]",
            "aadServicePrincipalSecret": "[AadSecret from scratchpad]",
            "aadEndpoint": "https://login.microsoftonline.com",
            "aadResourceId": "https://management.core.windows.net/",
            "armEndpoint": "https://management.azure.com/",
            "diagnosticsEventsOutputName": "AmsDiagnostics",
            "operationalMetricsOutputName": "AmsOperational",
            "logCategories": "Application,Event",
            "AllowUnsecuredEndpoints": "true",
            "TelemetryOptOut": false
            }
        }
    }
    ```

1. Save the changes.

This tutorial configures your solution to use the OpenVINO&trade; module for object and motion detection. The following snippet shows the configuration of the module:

```json
"OpenVINOModelServerEdgeAIExtensionModule": {
    "settings": {
        "image": "marketplace.azurecr.io/intel_corporation/open_vino",
        "createOptions": "{\"HostConfig\":{\"PortBindings\":{\"4000/tcp\":[{\"HostPort\":\"4000\"}]}},\"Cmd\":[\"/ams_wrapper/start_ams.py\",\"--ams_port=4000\",\"--ovms_port=9000\"]}"
    },
    "type": "docker",
    "version": "1.0",
    "status": "running",
    "restartPolicy": "always"
}
```

[!INCLUDE [iot-central-video-analytics-part3](../../../includes/iot-central-video-analytics-part3.md)]

### Replace the manifest

On the **LVA Edge Gateway v2** page, select **+ Replace manifest**.

:::image type="content" source="./media/tutorial-video-analytics-create-app-openvino/replace-manifest.png" alt-text="Replace Manifest":::

Navigate to the *lva-configuration* folder and select the *deployment.openvino.amd64.json* manifest file you edited previously. Select **Upload**. When the validation is complete, select **Replace**.

[!INCLUDE [iot-central-video-analytics-part4](../../../includes/iot-central-video-analytics-part4.md)]
