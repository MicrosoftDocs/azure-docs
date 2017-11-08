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

# Deploy your first IoT Edge module from the Azure portal - Public preview

Azure IoT Edge moves the power of the cloud to your Internet of Things devices. In this topic, learn how to use the cloud interface to deploy prebuilt code remotely to an IoT Edge device.

## Prerequisites

To accomplish this task, use your computer or a virtual machine to simulate an Internet of Things device. The following services are required to successfully deploy an IoT Edge device:

- Docker
   - [Install Docker on Windows][lnk-docker-windows] and make sure it's running.
   - [Install Docker on Linux][lnk-docker-ubuntu] and make sure it's running. 
- Python 2.7
   - [Install Python 2.7 on Windows][lnk-python-windows].
   - Most Linux distributions, including Ubuntu, already have Python 2.7 installed. Use the following command to make sure that pip is installed: `sudo apt-get install python-pip`.

To register your IoT Edge device and manage it from the cloud interface, you need an active Azure subscription. If you don't have a subscription, create a [free account][lnk-account] before you begin.

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

Create a device identity for your simulated device so that it can communicate with your IoT hub. Since IoT Edge devices behave and can be managed differently than typical IoT devices, you declare this to be an IoT Edge device from the beginning. 

1. In the Azure portal, navigate to your IoT hub.
1. Select **IoT Edge Explorer**.
1. Select **Add Edge device**.
1. Give your simulated device a unique device ID.
1. Confirm that the value of **Azure IoT Edge device** is set to **Yes**.
1. Select **Save** to add your device.
1. Select your new device from the list of devices. 
1. Copy the value for **Connection string--primary key** and save it. You'll use this value to configure the IoT Edge runtime in the next section. 

## Install and start the IoT Edge runtime

The IoT Edge runtime is deployed on all IoT Edge devices. It comprises two modules. First, the IoT Edge agent facilitates deployment and monitoring of modules on the IoT Edge device. Second, the IoT Edge hub manages communications between modules on the IoT Edge device, and between the device and IoT Hub. 

>[!TIP]
>This section gives the Python 2.7 commands for Windows. If you're running this tutorial on Linux, add `sudo` in front of each command. 

Use the following steps to install and start the IoT Edge runtime:

1. On the machine where you'll run the IoT Edge device, download the IoT Edge control script.

   ```
   pip install -U azure-iot-edge-runtime-ctl
   ```

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

One of the key capabilities of Azure IoT Edge is being able to deploy modules to your IoT Edge devices from the cloud. An IoT Edge module is an executable package implemented as a container. In this section, you deploy a module that generates telemetry for your simulated device. 

1. In the Azure portal, navigate to your IoT hub.
1. Go to **IoT Edge Explorer** and select your IoT Edge device.
1. Select **Deploy modules**.
1. Select **Add custom IoT Edge module**.
1. In the **Name** field, enter `tempSensor`. 
1. In the **Image** field, enter `edgepreview.azurecr.io/azureiotedge/simulated-temperature-sensor:1.0-preview`. 
1. Leave the other settings unchanged, and select **Save**.
1. Back in the **Add modules** step, select **Next**.
1. In the **Specify routes** step, select **Next**.
1. In the **Review template** step, select **Submit**.
1. Return to the device details page and select **Refresh**. You should see the new tempSensor module running along the IoT Edge runtime. 

   ![View tempSensor in list of deployed modules][2]

## View generated data

You can monitor your new IoT Edge device's status by clicking on it in IoT Edge Explorer page of your IoT hub. 

You can view the telemetry the device is sending by using the [IoT Hub explorer tool][lnk-iothub-explorer].

## Next steps

You learned how to deploy an IoT Edge module to an IoT Edge device. Now try deploying different types of Azure services as modules, so that you can analyze data at the edge. 

* [Deploy Azure Function as a module](tutorial-deploy-function.md)
* [Deploy Azure Stream Analytics as a module](tutorial-deploy-stream-analytics.md)
* [Deploy your own code as a module](tutorial-create-custom-module.md)


<!-- Images -->
[1]: ./media/quickstart/cloud-shell.png
[2]: ./media/tutorial-install-iot-edge/view-module.png

<!-- Links -->
[lnk-docker-windows]: https://docs.docker.com/docker-for-windows/install/ 
[lnk-docker-ubuntu]: https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/ 
[lnk-python-windows]: https://www.python.org/downloads/
[lnk-iothub-explorer]: https://github.com/azure/iothub-explorer
[lnk-account]: https://azure.microsoft.com/free
[lnk-portal]: https://portal.azure.com

<!-- Anchor links -->
[anchor-register]: #register-an-iot-edge-device
