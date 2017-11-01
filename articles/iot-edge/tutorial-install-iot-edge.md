---
title: Install Azure IoT Edge | Microsoft Docs 
description: Install the Azure IoT Edge runtime and deploy your first module to an edge device
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

# Deploy Azure IoT Edge on a simulated device

Azure IoT Edge moves the power of the cloud to your Internet of Things (IoT) devices. This tutorial walks you through creating a simulated IoT Edge device that generates sensor data. You learn how to:

> [!div class="checklist"]
> * Create an IoT hub
> * Register an IoT Edge device
> * Start the IoT Edge runtime
> * Deploy a module
> * View generated data

The simulated device that you create in this tutorial is a monitor on a wind turbine that generates temperature, humidity, and pressure data. You're interested in this data, because your turbines perform at different levels of efficiency depending on the weather conditions. The other Azure IoT Edge tutorials build upon the work you do here by deploying modules that analyze the data for business insights. 

## Prerequisites

This tutorial assumes that you're using a computer or virtual machine to simulate an Internet of Things device. The following services are required to successfully deploy an IoT Edge device:

- Docker
   - [Install Docker on Windows][lnk-docker-windows]
   - [Install Docker on Linux][lnk-docker-ubuntu]
- .NET Core
   - [Install .NET on Windows][lnk-dotnet-windows]
   - [Install .NET on Linux][lnk-dotnet-ubuntu]

## Create an IoT hub

[!INCLUDE [iot-hub-create-hub](../../includes/iot-hub-create-hub.md)]

## Register an IoT Edge device

Create a device identity for your simulated device so that it can communicate with your IoT hub. Since IoT Edge devices behave and can be managed differently than typical IoT devices, you declare this to be an IoT Edge device from the beginning. 

1. In the Azure portal, navigate to your IoT hub.
1. Select **IoT Edge Explorer**.
1. Select **Add Edge Device**.
1. Give your simulated device a unique device ID.
1. Set the value of **Azure IoT Edge Device** to **Yes**.
1. Select **Save** to add your device.
1. Select your new device from the list of devices. 
1. Copy the value for **Connection string--primary key** and save it. You'll use this value to configure the IoT Edge runtime in the next section. 

## Start the IoT Edge runtime

The IoT Edge runtime is deployed on all IoT Edge devices. It comprises two modules. First, the IoT Edge agent facilitates deployment and monitoring of modules on the IoT Edge device. Second, the IoT Edge hub manages communications between modules on the IoT Edge device, and between the device and IoT Hub. 

Use the following steps to install and start the IoT Edge runtime:

1. On the machine where you'll run the IoT Edge device, download the IoT Edge control script.
1. Configure the runtime with your IoT Edge device connection string from the previous section.
1. Start the runtime.
1. Check Docker to see that both the IoT Edge agent and the IoT Edge hub are running as modules.

## Deploy a module

One of the key capabilities of Azure IoT Edge is being able to deploy modules to your IoT Edge devices from the cloud. An IoT Edge module is an executable package implemented as a container. In this tutorial, the module generates telemetry for your simulated device. 

1. In the Azure portal, navigate to your IoT hub.
1. Go to **IoT Edge Explorer** and select your IoT Edge device.
1. Select **Deploy modules**.
1. Select **Custom module**.
1. Copy the following code into the text box:

   ``` json
   "tempSensor": { 
        "version": "1.0", 
        "type": "docker", 
        "status": "running", 
        "restartPolicy": "always", 
        "settings": { 
        "image": "edgepreview.azurecr.io/azedge-simulated-temperature-sensor-x64:6407819", 
        "createOptions": "" 
        } 
   } 
   ```

1. Select **Start**.
1. Return to the device details page and refresh the data. You should see the new module running along the IoT Edge runtime. 

## View generated data

You can use the hub explorer to view telemetry from your new IoT Edge device and monitor its status. 

## Next steps

In this tutorial, you created a new IoT Edge device, and used the cloud interface to deploy code onto the device. Now, you have a device generating raw data about its environment. You can continue on to any of the other tutorials to learn how Azure IoT Edge can help you turn this data into business insights at the edge.

> [!div class="nextstepaction"]
> [Deploy Azure Function as a module](tutorial-deploy-function.md)<br>
> [Deploy Azure Stream Analytics as a module](tutorial-deploy-stream-analytics.md)<br>
> [Create a custom module](tutorial-create-custom-module.md)

[lnk-docker-windows]: https://docs.docker.com/docker-for-windows/install/ 
[lnk-docker-ubuntu]: https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/ 
[lnk-dotnet-windows]: https://docs.microsoft.com/dotnet/core/windows-prerequisites?tabs=netcore2x
[lnk-dotnet-ubuntu]: https://docs.microsoft.com/dotnet/core/linux-prerequisites?tabs=netcore2x