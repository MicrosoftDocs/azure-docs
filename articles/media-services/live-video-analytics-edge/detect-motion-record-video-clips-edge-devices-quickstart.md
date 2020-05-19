---
title: Placeholder
description: Placeholder
ms.topic: quickstart
ms.date: 04/27/2020

---

# Quickstart: 

This article walks you through the steps to use Live Video Analytics on IoT Edge for event-based recording. It uses a Linux Azure VM as an IoT Edge device and a simulated live video stream. This video stream is analyzed for the presence of moving objects. When motion is detected, events are sent to Azure IoT Hub, and the relevant part of the video stream is recorded as an Asset in Azure Media Services.

This article builds on top of the [Getting Started quickstart](get-started-detect-motion-emit-events-quickstart.md).

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* [Visual Studio Code](https://code.visualstudio.com/) on your machine with [Azure IoT Tools extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools)
* Complete [Setting up Azure resources](https://github.com/Azure-Samples/lva-edge-rc3/blob/master/src/quick-start/quickstart.md#set-up-azure-resources), [Deploying modules](https://github.com/Azure-Samples/lva-edge-rc3/blob/master/src/quick-start/quickstart.md#deploy-modules-on-your-edge-device), and [Configuring Visual Studio Code](https://github.com/Azure-Samples/lva-edge-rc3/blob/master/src/quick-start/quickstart.md#configure-azure-iot-tools-extension-in-visual-studio-code).


## Clean up resources

If you're not going to continue to use this application, delete resources created in this quickstart.

## Next steps

* Learn how to invoke Live Video Analytics on IoT Edge Direct Methods programmatically.
* Learn more about diagnostic messages.    