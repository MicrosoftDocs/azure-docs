---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Azure IoT Edge quickstart | Microsoft Docs 
description: Try out Azure IoT Edge by running analytics on a simulated edge device
services: iot-edge
keywords: 
author: kgremban
manager: timlt

ms.author: kgremban
ms.date: 10/05/2017
ms.topic: article
ms.service: iot-edge

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.devlang:devlang-from-white-list
# ms.suite: 
# ms.tgt_pltfrm:
# ms.reviewer:
---

# Deploy your first IoT Edge module from the Azure portal to a Windows device - Public preview

Azure IoT Edge moves the power of the cloud to your Internet of Things devices. In this topic, learn how to use the cloud interface to deploy prebuilt code remotely to an IoT Edge device.

## Prerequisites

To create an IoT hub and register your IoT Edge device, you need an active Azure subscription. If you don't have a subscription, create a [free account][lnk-account] before you begin.

This tutorial assumes that you're using a computer or virtual machine running Windows to simulate an Internet of Things device. 

>[!TIP]
>If you're running Windows in a virtual machine, enable [nested virtualization][lnk-nested] and allocate at least 2GB memory. 

Docker for Windows can run either Windows containers or Linux containers. The steps for the tutorial are the same regardless of which container type you use, but the software prerequisites are different. 

### Linux containers in Docker

1. Make sure you're using a supported Windows version:
   * Windows 10 
   * Windows Server
2. Install [Docker for Windows][lnk-docker] and make sure it's running.
3. Install [Python 2.7 on Windows][lnk-python] and make sure you can use the pip command.
4. Run the following command to download the IoT Edge control script.

   ```
   pip install -U azure-iot-edge-runtime-ctl
   ```

### Windows containers in Docker

1. Make sure you're using a supported Windows version:
   * Windows IoT Core (Build 16299) on a x64-based device
   * Windows 10 Fall Creators Update
   * Windows Server 1709 (Build 16299)
1. Run the following command in an Admin PowerShell console to install and configure the prerequisites:

   ```powershell
   Invoke-Expression (Invoke-WebRequest -useb https://aka.ms/iotedgewin)
   ```

   This script provides the following:
   * Docker, configured to use Windows containers. If you already have Docker on your machine, go through the steps to [switch to Windows containers][lnk-docker-containers]. 
   * Python 3.6
   * The IoT Edge control script (iotedgectl.exe)

## Create an IoT hub with Azure CLI

If you've used IoT Hub in the past and already have a hub created, you can skip this section and go on to [Register an IoT Edge device][anchor-register].

1. Sign in to the [Azure portal][lnk-portal]. 
1. Select the **Cloud Shell** button. 

   ![Cloud Shell button][1]

1. Create a resource group. The following code creates a resource group called **IoTEdge** in the **West US** region:

   ```azurecli
   az group create --name IoTEdge --location westus
   ```

1. Create an IoT hub in your new resource group. The following code creates a free **F1** hub called **MyIotHub** in the resource group **IoTEdge**:

   ```azurecli
   az iot hub create --resource-group IoTEdge --name MyIotHub --sku F1 
   ```

   >[!TIP]
   >You can only have one F1-level IoT hub in each subscription. If you get an error, try changing the sku to S1 instead. 



## Register an IoT Edge device

[!INCLUDE [iot-edge-register-device](../../includes/iot-edge-register-device.md)]

## Configure the IoT Edge runtime

The IoT Edge runtime is deployed on all IoT Edge devices. It comprises two modules. First, the IoT Edge agent facilitates deployment and monitoring of modules on the IoT Edge device. Second, the IoT Edge hub manages communications between modules on the IoT Edge device, and between the device and IoT Hub. 


Use the following steps to install and start the IoT Edge runtime:

1. Configure the runtime with your IoT Edge device connection string from the previous section.

   ```
   iotedgectl setup --connection-string "{device connection string}" --auto-cert-gen-force-no-passwords
   ```

1. Start the runtime.

   ```
   iotedgectl start
   ```

1. Check Docker to see that the IoT Edge agent is running as a module.

   ```
   docker ps
   ```

## Deploy a module

[!INCLUDE [iot-edge-deploy-module](../../includes/iot-edge-deploy-module.md)]

## View generated data

You can monitor your new IoT Edge device's status by clicking on it in IoT Edge Explorer page of your IoT hub. 

You can view the telemetry the device is sending by using the [IoT Hub explorer tool][lnk-iothub-explorer].

## Next steps

You learned how to deploy an IoT Edge module to an IoT Edge device. Now try deploying different types of Azure services as modules, so that you can analyze data at the edge. 

* [Deploy Azure Function as a module](tutorial-deploy-function.md)
* [Deploy Azure Stream Analytics as a module](tutorial-deploy-stream-analytics.md)
* [Deploy your own code as a module](tutorial-csharp-module.md)


<!-- Images -->
[1]: ./media/quickstart/cloud-shell.png
[2]: ./media/tutorial-install-iot-edge/view-module.png

<!-- Links -->
[lnk-docker]: https://docs.docker.com/docker-for-windows/install/ 
[lnk-python]: https://www.python.org/downloads/
[lnk-iothub-explorer]: https://github.com/azure/iothub-explorer
[lnk-account]: https://azure.microsoft.com/free
[lnk-portal]: https://portal.azure.com

<!-- Anchor links -->
[anchor-register]: #register-an-iot-edge-device
