---
title: Simulate Azure IoT Edge on Linux | Microsoft Docs 
description: Install the Azure IoT Edge runtime on a simulated device in Linux, and deploy your first module
author: kgremban
manager: timlt
ms.author: kgremban
ms.reviewer: elioda
ms.date: 01/11/2018
ms.topic: tutorial
ms.service: iot-edge
services: iot-edge
ms.custom: mvc

experimental: false
experiment_id:
---

# Deploy Azure IoT Edge on a simulated device in Linux x64 - preview

Azure IoT Edge enables you to perform analytics and data processing on your devices, instead of having to push all the data to the cloud. The IoT Edge tutorials demonstrate how to deploy different types of modules, built from Azure services or custom code, but first you need a device to test. 

In this quickstart you learn how to:

1. Create an IoT Hub
2. Register an IoT Edge device
3. Start the IoT Edge runtime
4. Deploy a module

![Tutorial architecture][2]

The simulated device that you create in this quickstart is a monitor that generates temperature, humidity, and pressure data. The other Azure IoT Edge tutorials build upon the work you do here by deploying modules that analyze the data for business insights. 

## Prerequisites

This quickstart uses your computer or virtual machine like an Internet of Things device. To turn your machine into an IoT Edge device you need a container runtime. The following command installs one for you:

```cmd
curl https://conteng.blob.core.windows.net/mby/moby_0.1-0-ubuntu_amd64.deb -o moby_0.1.deb && sudo apt-get install ./moby_0.1.deb
``` 

## Create an IoT hub

Start the quickstart by creating your IoT Hub.
![Create IoT Hub][3]

[!INCLUDE [iot-hub-create-hub](../../includes/iot-hub-create-hub.md)]

## Register an IoT Edge device

Register an IoT Edge device with your newly created IoT Hub.
![Register a device][4]

[!INCLUDE [iot-edge-register-device](../../includes/iot-edge-register-device.md)]

## Install and start the IoT Edge runtime

Install and start the Azure IoT Edge runtime on your device. 
![Register a device][5]

The IoT Edge runtime is deployed on all IoT Edge devices. Its composed of three components. The **IoT Edge Security Daemon** starts each time an Edge device boots and bootstraps the device by starting the IoT Edge Agent. The **IoT Edge Agent** facilitates deployment and monitoring of modules on the IoT Edge device, including the IoT Edge Hub. The **IoT Edge Hub** manages communications between modules on the IoT Edge device, and between the device and IoT Hub. 

### HSMLIB
Download and install an implementation of hsmlib on the machine you want to be the IoT Edge device. hsmlib is a dependency of the Edge Security Daemon. It's primary responsibility is integrating the daemon with an Edge device's hardware securty module, allowing the IoT Edge runtime to provide enhanced security to the IoT device. For more information about the security framework, see [Securing Azure IoT Edge](security.md).

<!-- [IoT Edge Security Manager](TODO:get link). -->

The following command installs a version of hsmlib that implements the IoT Edge standard security promise.

<!-- [IoT Edge standard security promise](TODO:get link).-->

```cmd
 wget https://azureiotedgepreview.blob.core.windows.net/shared/edgelet-amd64-13893488/libiothsm-std_0.1.1-13893488_amd64.deb && sudo apt-get install ./libiothsm-std_0.1.1-13893488_amd64.deb
```

### IoT Edge Security Daemon 
1. Download and install the IoT Edge Security Daemon. The package installs the daemon as a system service so IoT Edge starts every time your device boots.
   ```cmd
   wget https://azureiotedgepreview.blob.core.windows.net/shared/edgelet-amd64-13893488/iotedge_0.1-13893488_amd64.deb && sudo apt-get install ./iotedge_0.1-13893488_amd64.deb
   ```

2. Open `/etc/iotedge/config.yaml`. It is a protected file so you may have to use elevated privilages to access it.
   ```cmd
   sudo nano /etc/iotedge/config.yaml
   ```

3. Add the IoT Edge device connection string that you copied when you registered your device. Replace the value of the variable **device_connection_string**.

4. Restart the Edge Security Daemon:

   ```cmd
   sudo systemctl restart iotedge
   ```

5. Check to see that the Edge Security Daemon is running as a system service:

   ```cmd
   sudo systemctl status iotedge
   ```

   ![See the Edge Daemon running as a system service][7]

You can also see logs from the Edge Security Daemon by running the command
   ```
   journalctl -u iotedge
   ```

## Deploy a module

Manage your Azure IoT Edge device from the cloud to deploy a module which will send telemetry data to IoT Hub.
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

The temperature sensor module my be waiting to connect to Edge Hub if the last line you see in the log is `Using transport Mqtt_Tcp_Only`. Try killing the module and letting the Edge Agent restart it. You can kill it with the command `sudo docker stop tempSensor`.

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
0
