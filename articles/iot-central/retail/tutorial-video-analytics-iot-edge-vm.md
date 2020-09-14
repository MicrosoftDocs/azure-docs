---
title: 'Tutorial - Create a video analytics IoT Edge instance in Azure IoT Central (Linux VM)'
description: This tutorial shows how to create a video analytics IoT Edge instance to use with the video analytics - object and motion detection application template.
services: iot-central
ms.service: iot-central
ms.subservice: iot-central-retail
ms.topic: tutorial
ms.author: nandab
author: KishorIoT
ms.date: 07/31/2020
---
# Tutorial: Create an IoT Edge instance for video analytics (Linux VM)

Azure IoT Edge is a fully managed service that delivers cloud intelligence locally by deploying and running:

* Custom logic
* Azure services
* Artificial intelligence

In IoT Edge, these services run directly on cross-platform IoT devices, enabling you to run your IoT solution securely and at scale in the cloud or offline.

This tutorial shows you how to prepare an IoT Edge device in an Azure VM. The IoT Edge instance runs the live video analytics modules that the Azure IoT Central video analytics - object and motion detection application template uses.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Create an Azure VM with the Azure IoT Edge runtime installed
> * Prepare the IoT Edge installation to host the live video analytics module and connect to IoT Central

## Prerequisites

Before you start, you should complete the previous [Create a video analytics application in Azure IoT Central](./tutorial-video-analytics-create-app.md) tutorial.

You also need an Azure subscription. If you don't have an Azure subscription, you can create one for free on the [Azure sign-up page](https://aka.ms/createazuresubscription).

## Deploy Azure IoT Edge

To create an Azure VM with the latest IoT Edge runtime and live video analytics modules installed, select the following button:

[![Deploy to Azure Button for iotedge-vm-deploy](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Flive-video-analytics%2Fmaster%2Fref-apps%2Flva-edge-iot-central-gateway%2Fvm_deploy%2FedgeModuleVMDeploy.json)

Use the information in the following table to complete the **Custom deployment** form:

| Field | Value |
| ----- | ----- |
| Subscription | Select your Azure subscription. |
| Resource group | *lva-rg* - the resource group you created in the previous tutorial. |
| Region       | *East US* |
| DNS Label Prefix | Choose a unique DNS prefix for the VM. |
| Admin Username | *AzureUser* |
| Admin Password | Enter a password. Make a note of the password in the *scratchpad.txt* file, you use it later. |
| Scope ID | The **Scope ID** you made a note of in the *scratchpad.txt* file in the previous tutorial when you added the gateway device. |
| Device ID | *lva-gateway-001* - the gateway device you created in the previous tutorial. |
| Device Key | The device primary key you made a note of in the *scratchpad.txt* file in the previous tutorial when you added the gateway device. |
| Iot Central App Host | The **Application URL** you made a note of in the *scratchpad.txt* file in the previous tutorial. For example, *traders.azureiotcentral.com*. |
| Iot Central App Api Token | The operator API token you made a note of in the previous tutorial. |
| Iot Central Device Provisioning Key | The primary group shared access signature token you made a note of in the *scratchpad.txt* file in the previous tutorial. |
| VM Size | *Standard_DS1_v2* |
| Ubuntu OS Version | *18.04-LTS* |
| Location | *[resourceGroup().location]* |

Select **Review + create**. When the validation is complete, select **Create**. It typically takes about three minutes for the deployment to complete. When the deployment is complete, navigate to the **lva-rg** resource group in the Azure portal.

## Ensure the IoT Edge runtime loads the modules

In the Azure portal, navigate to the **lva-rg** resource group and select the virtual machine. Then, in the **Support + troubleshooting** section, select **Serial console**.

Press **Enter** to get a `login:` prompt. Use *AzureUser* as the username and the password you chose when you created the VM.

Run the following command to check the version of the IoT Edge runtime. At the time of writing, the version is 1.0.9:

```bash
sudo iotedge --version
```

List your IoT Edge modules using the command:

```bash
sudo iotedge list
```

The deployment configured the following five IoT Edge modules to run:

* LvaEdgeGatewayModule
* edgeAgent
* edgeHub
* lvaEdge
* lvaYolov3

The deployment created a custom IoT Edge environment with the required modules for live video analytics. The deployment updated the default **config.yaml** to ensure the IoT Edge runtime used the IoT Device Provisioning Service to connect to IoT Central. The deployment also created a file called **state.json** in the **/data/storage** folder to provide additional configuration data to the modules. For more information, see the [Create an IoT Edge instance for video analytics (Intel NUC)](./tutorial-video-analytics-iot-edge-nuc.md) tutorial.

To troubleshoot the IoT Edge device, see [Troubleshoot your IoT Edge device](https://docs.microsoft.com/azure/iot-edge/troubleshoot)

## Use the RTSP simulator

If you don't have real camera devices to connect to your IoT Edge device, you can use the two simulated camera devices in the video analytics application template. This section shows you how to use a simulated video stream in your IoT Edge device.

These instructions use the [Live555 Media Server](http://www.live555.com/mediaServer/) as an RTSP simulator in a docker container.

> [!NOTE]
> References to third-party software in this repo are for informational and convenience purposes only. Microsoft does not endorse nor provide rights for the third-party software. For more information, see [Live555 Media Server](http://www.live555.com/mediaServer/).

Use the following command to run the **rtspvideo** utility in a docker container on your IoT Edge VM. The docker container creates a background RTSP stream:

```bash
sudo docker run -d --name live555 --rm -p 554:554 mcr.microsoft.com/lva-utilities/rtspsim-live555:1.2
```

Use the following command to list the docker containers:

```bash
sudo docker ps
```

The list includes a container called **live555**.

## Next steps

You've now deployed the IoT Edge runtime, the LVA modules, and the Live555 simulation stream in a Linux VM running on Azure.

To manage the cameras, follow the next tutorial

> [!div class="nextstepaction"]
> [Monitor and manage a video analytics - object and motion detection application](./tutorial-video-analytics-manage.md)
