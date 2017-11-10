---
title: Install Azure IoT Edge - Linux | Microsoft Docs 
description: Install the Azure IoT Edge runtime on a simulated device in Linux, and deploy your first module
services: iot-edge
keywords: 
author: kgremban
manager: timlt

ms.author: kgremban
ms.reviewer: elioda
ms.date: 10/05/2017
ms.topic: article
ms.service: iot-edge

---

# Deploy Azure IoT Edge on a simulated device in Linux

Azure IoT Edge enables you to perform analytics and data processing on your devices, instead of having to push all the data to the cloud. The IoT Edge tutorials demonstrate how to deploy different types of modules, built from Azure services or custom code, but first you need a device to test. 

This tutorial walks you through creating a simulated IoT Edge device, then deploying a module that generates sensor data. You learn how to:

> [!div class="checklist"]
> * Create an IoT hub
> * Register an IoT Edge device
> * Start the IoT Edge runtime
> * Deploy a module

The simulated device that you create in this tutorial is a monitor that generates temperature, humidity, and pressure data. The other Azure IoT Edge tutorials build upon the work you do here by deploying modules that analyze the data for business insights. 

## Prerequisites

This tutorial assumes that you're using a computer or virtual machine running Linux to simulate an Internet of Things device. The following services are required to successfully deploy an IoT Edge device:

- [Install Docker for Linux][lnk-docker-ubuntu] and make sure it's running. 
- Most Linux distributions, including Ubuntu, already have Python 2.7 installed. Use the following command to make sure that pip is installed: `sudo apt-get install python-pip`.

## Create an IoT hub

[!INCLUDE [iot-hub-create-hub](../../includes/iot-hub-create-hub.md)]

## Register an IoT Edge device

[!INCLUDE [iot-edge-register-device](../../includes/iot-edge-register-device.md)]

## Install and start the IoT Edge runtime

The IoT Edge runtime is deployed on all IoT Edge devices. It comprises two modules. First, the IoT Edge agent facilitates deployment and monitoring of modules on the IoT Edge device. Second, the IoT Edge hub manages communications between modules on the IoT Edge device, and between the device and IoT Hub. 

Use the following steps to install and start the IoT Edge runtime:

> [!NOTE]
> Remove before merging. During bug bash: Instead of step 1, run the following code:
>
> `wget https://azureiotedgepreview.blob.core.windows.net/shared/azure-iot-edge-ctl.tar.gz`
> `tar xvzf azure-iot-edge-ctl-1.0.0rc6.dev6995193.tar.gz`
> `cd azure-iot-edge-ctl-1.0.0rc6.dev6995193`
> `sudo pip install -U .`

1. On the machine where you'll run the IoT Edge device, download the IoT Edge control script.

   ```
   sudo pip install -U azure-iot-edge-runtime-ctl
   ```

1. Configure the runtime with your IoT Edge device connection string from the previous section.

   ```
   sudo iotedgectl setup --connection-string "{device connection string}" --auto-cert-gen-force-no-passwords
   ```

1. Start the runtime.

   ```
   sudo iotedgectl start
   ```

1. Check Docker to see that the IoT Edge agent is running as a module.

   ```
   sudo docker ps
   ```

## Deploy a module

[!INCLUDE [iot-edge-deploy-module](../../includes/iot-edge-deploy-module.md)]

## View generated data

You can monitor your new IoT Edge device's status by clicking on it in IoT Edge Explorer page of your IoT hub. 

You can view the telemetry the device is sending by using the [IoT Hub explorer tool][lnk-iothub-explorer].

## Next steps

In this tutorial, you created a new IoT Edge device and used the Azure IoT Edge cloud interface to deploy code onto the device. Now, you have a simulated device generating raw data about its environment. 

This tutorial is the prerequisite for all of the other IoT Edge tutorials. You can continue on to any of the other tutorials to learn how Azure IoT Edge can help you turn this data into business insights at the edge.

> [!div class="nextstepaction"]
> [Deploy your own code as a module](tutorial-csharp-module.md)
> [Deploy Azure Stream Analytics as a module](tutorial-deploy-stream-analytics.md)


<!-- Images -->
[1]: ./media/tutorial-install-iot-edge/view-module.png

<!-- Links -->
[lnk-docker-ubuntu]: https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/ 
[lnk-iothub-explorer]: https://github.com/azure/iothub-explorer
