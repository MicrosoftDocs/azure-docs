---
title: Simulate Azure IoT Edge on Linux | Microsoft Docs 
description: Install the Azure IoT Edge runtime on a simulated device in Linux, and deploy your first module
author: kgremban
manager: timlt
ms.author: kgremban
ms.date: 06/21/2018
ms.topic: tutorial
ms.service: iot-edge
services: iot-edge
ms.custom: mvc

experimental: false
experiment_id:
---

# Deploy Azure IoT Edge on a simulated device in Linux x64

Azure IoT Edge enables you to perform analytics and data processing on your devices, instead of having to push all the data to the cloud. The IoT Edge tutorials demonstrate how to deploy different types of modules, but first you need a device to test. 

In this quickstart you learn how to:

1. Create an IoT Hub
2. Register an IoT Edge device
3. Start the IoT Edge runtime
4. Deploy a module

![Tutorial architecture][2]

The simulated device that you create in this quickstart is a monitor that generates temperature, humidity, and pressure data. The other Azure IoT Edge tutorials build upon the work you do here by deploying modules that analyze the data for business insights. 

## Create an IoT hub

Start the quickstart by creating your IoT Hub.
![Create IoT Hub][3]

[!INCLUDE [iot-hub-create-hub](../../includes/iot-hub-create-hub.md)]

## Register an IoT Edge device

Register an IoT Edge device with your newly created IoT Hub.
![Register a device][4]

[!INCLUDE [iot-edge-register-device](../../includes/iot-edge-register-device.md)]


## Install and start the IoT Edge runtime

The IoT Edge runtime is deployed on all IoT Edge devices. It's composed of three components. The **IoT Edge security daemon** starts each time an Edge device boots and bootstraps the device by starting the IoT Edge agent. The **IoT Edge agent** facilitates deployment and monitoring of modules on the IoT Edge device, including the IoT Edge hub. The **IoT Edge hub** manages communications between modules on the IoT Edge device, and between the device and IoT Hub. 

### Register your device to use the software repository

The packages that you need to run the IoT Edge runtime are managed in a software repository. Configure your IoT Edge device to access this repository. 

The steps in this section are for devices running Ubuntu 18.04. <!-- add link to other versions -->

1. On the machine that you're using as an IoT Edge device, install the repository configuration.

   ```bash
   curl https://packages.microsoft.com/config/ubuntu/16.04/prod.list > ./microsoft-prod.list
   sudo cp ./microsoft-prod.list /etc/apt/sources.list.d/
   ```

2. Install a public key to access the repository.

   ```bash
   curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
   sudo cp ./microsoft.gpg /etc/apt/trusted.gpg.d/
   ```

### Install a container runtime

The IoT Edge runtime is a set of containers, and the logic that you deploy to your IoT Edge device is packaged as containers. Prepare your device for these components by installing a container runtime.

   ```bash
   sudo apt-get update
   sudo apt-get install moby-engine
   sudo apt-get install moby-cli   
   ```

### Install and configure the IoT Edge security daemon

The security daemon installs as a system service so that the IoT Edge runtime starts every time your device boots. The installation also includes a version of **hsmlib** that allows the security daemon to interact with the device's hardware security. 

1. Download and install the IoT Edge Security Daemon. 

   ```bash
   sudo apt-get update
   sudo apt-get install iotedge
   ```

2. Open the IoT Edge configuration file. It is a protected file so you may have to use elevated privileges to access it.
   
   ```bash
   sudo nano /etc/iotedge/config.yaml
   ```

3. Add the IoT Edge device connection string that you copied when you registered your device. Replace the value of the variable **device_connection_string** that you copied earlier in this quickstart.

4. Restart the Edge Security Daemon:

   ```bash
   sudo systemctl restart iotedge
   ```

5. Check to see that the Edge Security Daemon is running as a system service:

   ```bash
   sudo systemctl status iotedge
   ```

   ![See the Edge Daemon running as a system service](./media/tutorial-install-iot-edge/iotedged-running.png)

   You can also see logs from the Edge Security Daemon by running the following command:

   ```bash
   journalctl -u iotedge
   ```

6. View the modules running on your device: 

   ```bash
   sudo iotedge list
   ```

## Deploy a module

Manage your Azure IoT Edge device from the cloud to deploy a module that will send telemetry data to IoT Hub.
![Register a device][6]

[!INCLUDE [iot-edge-deploy-module](../../includes/iot-edge-deploy-module.md)]

## View generated data

In this quickstart, you created a new IoT Edge device and installed the IoT Edge runtime on it. Then, you used the Azure portal to push an IoT Edge module to run on the device without having to make changes to the device itself. In this case, the module that you pushed creates environmental data that you can use for the tutorials. 

Open the command prompt on the computer running your simulated device again. Confirm that the module deployed from the cloud is running on your IoT Edge device:

```cmd
sudo iotedge list
```

![View three modules on your device][8]

View the messages being sent from the tempSensor module to the cloud:

```cmd
sudo docker logs tempSensor -f 
```

![View the data from your module][9]

The temperature sensor module may be waiting to connect to Edge Hub if the last line you see in the log is `Using transport Mqtt_Tcp_Only`. Try killing the module and letting the Edge Agent restart it. You can kill it with the command `sudo docker stop tempSensor`.

You can also view the telemetry the device is sending by using the [IoT Hub explorer tool][lnk-iothub-explorer]. 

## Next steps

In this quickstart, you created a new IoT Edge device and used the Azure IoT Edge cloud interface to deploy code onto the device. Now, you have a simulated device generating raw data about its environment. 

This quickstart is the prerequisite for all of the IoT Edge tutorials. You can continue on to any of the tutorials to learn how Azure IoT Edge can help you turn this data into business insights at the edge.

> [!div class="nextstepaction"]
> [Filter sensor data using an Azure Function](tutorial-deploy-function.md)


<!-- Images -->
[1]: ./media/tutorial-install-iot-edge/view-module.png
[2]: ./media/tutorial-install-iot-edge/install-edge-full.png
[3]: ./media/tutorial-install-iot-edge/create-iot-hub.png
[4]: ./media/tutorial-install-iot-edge/register-device.png
[5]: ./media/tutorial-install-iot-edge/start-runtime.png
[6]: ./media/tutorial-install-iot-edge/deploy-module.png
[7]: ./media/tutorial-install-iot-edge/iotedged-running.png
[8]: ./media/tutorial-simulate-device-linux/running-modules.png
[9]: ./media/tutorial-simulate-device-linux/sensor-data.png

<!-- Links -->
[lnk-docker-ubuntu]: https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/ 
[lnk-docker-mac]: https://docs.docker.com/docker-for-mac/install/
[lnk-iothub-explorer]: https://github.com/azure/iothub-explorer
