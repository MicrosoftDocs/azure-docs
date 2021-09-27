---
author: fvneerden
ms.service: azure-video-analyzer
ms.topic: include
ms.date: 05/05/2021
ms.author: faneerde
---

You'll use the Video Analyzer edge module to detect motion in the incoming live video stream and send events to IoT Hub. To see these events, follow these steps:

1. Open the Explorer pane in Visual Studio Code and look for Azure IoT Hub in the lower-left corner.
1. Expand the **Devices** node.
1. Right-click **avasample-iot-edge-device** and select **Start Monitoring Built-in Event Endpoint**.

   ![Start monitoring a built-in event endpoint](../../../media/vscode-common-screenshots/start-monitoring.png)

    [!INCLUDE [provide-builtin-endpoint](../../common-includes/provide-builtin-endpoint.md)]
