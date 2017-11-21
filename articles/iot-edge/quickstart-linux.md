---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Quickstart Azure IoT Edge + Linux | Microsoft Docs 
description: Try out Azure IoT Edge by running analytics on a simulated edge device
services: iot-edge
keywords: 
author: kgremban
manager: timlt

ms.author: kgremban
ms.date: 11/16/2017
ms.topic: article
ms.service: iot-edge

---

# Quickstart: Deploy your first IoT Edge module from the Azure portal to a Linux device - preview

Azure IoT Edge moves the power of the cloud to your Internet of Things devices. In this topic, learn how to use the cloud interface to deploy prebuilt code remotely to an IoT Edge device.

If you don't have an active Azure subscription, create a [free account][lnk-account] before you begin.

## Prerequisites

To accomplish this task, use your computer or a virtual machine to simulate an Internet of Things device. The following services are required to successfully deploy an IoT Edge device:

- [Install Docker on Linux][lnk-docker-ubuntu] and make sure it's running. 
- Most Linux distributions, including Ubuntu, already have Python 2.7 installed. Use the following command to make sure that pip is installed: `sudo apt-get install python-pip`.

## Create an IoT hub with Azure CLI

Create an IoT hub in your Azure subscription. The free level of IoT Hub works for this quickstart. If you've used IoT Hub in the past and already have a free hub created, you can skip this section and go on to [Register an IoT Edge device][anchor-register]. Each subscription can only have one free IoT hub. 

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

## Register an IoT Edge device

Create a device identity for your simulated device so that it can communicate with your IoT hub. Since IoT Edge devices behave and can be managed differently than typical IoT devices, you declare this to be an IoT Edge device from the beginning. 

1. In the Azure portal, navigate to your IoT hub.
1. Select **IoT Edge (preview)**.
1. Select **Add IoT Edge device**.
1. Give your simulated device a unique device ID.
1. Select **Save** to add your device.
1. Select your new device from the list of devices. 
1. Copy the value for **Connection string--primary key** and save it. You'll use this value to configure the IoT Edge runtime in the next section. 

## Install and start the IoT Edge runtime

The IoT Edge runtime is deployed on all IoT Edge devices. It comprises two modules. First, the IoT Edge agent facilitates deployment and monitoring of modules on the IoT Edge device. Second, the IoT Edge hub manages communications between modules on the IoT Edge device, and between the device and IoT Hub. 

On the machine where you'll run the IoT Edge device, download the IoT Edge control script:
```cmd
sudo pip install -U azure-iot-edge-runtime-ctl
```

Configure the runtime with your IoT Edge device connection string from the previous section:
```cmd
sudo iotedgectl setup --connection-string "{device connection string}" --auto-cert-gen-force-no-passwords
```

Start the runtime:
```cmd
sudo iotedgectl start
```

Check Docker to see that the IoT Edge agent is running as a module:
```cmd
sudo docker ps
```

![See edgeAgent in Docker](./media/tutorial-simulate-device-linux/docker-ps.png)

## Deploy a module

[!INCLUDE [iot-edge-deploy-module](../../includes/iot-edge-deploy-module.md)]

## View generated data

In this quickstart, you created a new IoT Edge device and installed the IoT Edge runtime on it. Then, you used the Azure portal to push an IoT Edge module to run on the device without having to make changes to the device itself. In this case, the module that you pushed creates environmental data that you can use for the tutorials. 

Open the command prompt on the computer running your simulated device again. Confirm that the module deployed from the cloud is running on your IoT Edge device:

```cmd
sudo docker ps
```

![View three modules on your device](./media/tutorial-simulate-device-linux/docker-ps2.png)

View the messages being sent from the tempSensor module to the cloud:

```cmd
sudo docker logs -f tempSensor
```

![View the data from your module](./media/tutorial-simulate-device-linux/docker-logs.png)

You can also view the telemetry the device is sending by using the [IoT Hub explorer tool][lnk-iothub-explorer]. 

## Clean up resources

When you no longer need the IoT Hub you created, you can use the [az iot hub delete][lnk-delete] command to remove the resource and any devices associated with it:

```azurecli
az iot hub delete --name {your iot hub name} --resource-group {your resource group name}
```

## Next steps

You learned how to deploy an IoT Edge module to an IoT Edge device. Now try deploying different types of Azure services as modules, so that you can analyze data at the edge. 

* [Deploy your own code as a module](tutorial-csharp-module.md)
* [Deploy Azure Function as a module](tutorial-deploy-function.md)
* [Deploy Azure Stream Analytics as a module](tutorial-deploy-stream-analytics.md)


<!-- Images -->
[1]: ./media/quickstart/cloud-shell.png

<!-- Links -->
[lnk-docker-ubuntu]: https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/ 
[lnk-iothub-explorer]: https://github.com/azure/iothub-explorer
[lnk-account]: https://azure.microsoft.com/free
[lnk-portal]: https://portal.azure.com
[lnk-delete]: https://docs.microsoft.com/cli/azure/iot/hub?view=azure-cli-latest#az_iot_hub_delete

<!-- Anchor links -->
[anchor-register]: #register-an-iot-edge-device
