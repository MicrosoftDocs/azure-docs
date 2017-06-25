---
title: Data conversion on IoT gateway with Azure IoT Edge | Microsoft Docs
description: Use IoT gateway to convert the format of sensor data through a customized module from Azure IoT Edge.
services: iot-hub
documentationcenter: ''
author: shizn
manager: timtl
tags: ''
keywords: 'iot gateway data conversion, iot gateway data transformation'

ms.assetid: 75f2573d-500b-4405-bff7-61021c4c3500
ms.service: iot-hub
ms.devlang: c
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/07/2017
ms.author: xshi

---
# Use IoT gateway for sensor data transformation with Azure IoT Edge

> [!NOTE]
> Before you start this tutorial, make sure you’ve completed the following lessons in sequence:
> * [Set up Intel NUC as an IoT gateway](iot-hub-gateway-kit-c-lesson1-set-up-nuc.md)
> * [Use IoT gateway to connect things to the cloud - SensorTag to Azure IoT Hub](iot-hub-gateway-kit-c-iot-gateway-connect-device-to-cloud.md)

One purpose of an Iot gateway is to process collected data before sending it to the cloud. Azure IoT Edge introduces modules which can be created and assembled to form the data processing workflow. A module receives a message, performs some action on it, and then move it on for other modules to process.

## What you learn

You learn how to create a module to convert messages from the SensorTag into a different format.

## What you do

* Create a module to convert a received message into the .json format.
* Compile the module.
* Add the module to the BLE sample application from Azure IoT Edge.
* Run the sample application.

## What you need

* The following tutorials completed in sequence:
  * [Set up Intel NUC as an IoT gateway](iot-hub-gateway-kit-c-lesson1-set-up-nuc.md)
  * [Use IoT gateway to connect things to the cloud - SensorTag to Azure IoT Hub](iot-hub-gateway-kit-c-iot-gateway-connect-device-to-cloud.md)
* An SSH client that runs on your host computer. PuTTY is recommended on Windows. Linux and macOS already come with an SSH client.
* The IP address and the username and password to access the gateway from the SSH client.
* An Internet connection.

## Create a module

1. On the host computer, run the SSH client and connect to the IoT gateway.
1. Clone the source files of the conversion module from GitHub to the home directory of the IoT gateway by running the following commands:

   ```bash
   cd ~
   git clone https://github.com/Azure-Samples/iot-hub-c-intel-nuc-gateway-customized-module.git
   ```

   This is a native Azure Edge module written in the C programming language. The module converts the format of received messages into the following one:

   ```json
   {"deviceId": "Intel NUC Gateway", "messageId": 0, "temperature": 0.0}
   ```

## Compile the module

To compile the module, run the following commands:

```bash
cd iot-hub-c-intel-nuc-gateway-customized-module/my_module
# change the build script runnable
chmod 777 build.sh
# remove the invalid windows character
sed -i -e "s/\r$//" build.sh
# run the build shell script
./build.sh
```

You get a `libmy_module.so` file after the compile is completed. Make a note of the absolute path of this file.

## Add the module to the BLE sample application

1. Go to the samples folder by running the following command:

   ```bash
   cd /usr/share/azureiotgatewaysdk/samples
   ```

1. Open the configuration file by running the following command:

   ```bash
   vi ble_gateway.json
   ```

1. Add a module by inserting the following code to the `modules` section.

   ```json
   {
       "name": "MyModule",
       "loader": {
           "name": "native",
           "entrypoint":{
               "module.path": "[Your libmy_module.so path]"
               }
            },
        "args": null
    },
    ```

1. Replace `[Your libmy_module.so path]` in the code with the absolute path of the libmy_module.so` file.
1. Replace the code in the `links` section with the following one:

   ```json
   {
       "source": "SensorTag",
       "sink": "MyModule"
   },
   {
       "source": "MyModule",
       "sink": "mapping"
   }
   ```

1. Press `ESC`, and then type `:wq` to save the file.

## Run the sample application

1. Power on the SensorTag.
1. Set the SSL_CERT_FILE environment variable by running the following command:

   ```bash
   export SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt
   ```

1. Run the sample application with the added module by running the following command:

   ```bash
   ./ble_gateway ble_gateway.json
   ```

## Next steps

You’ve successfully use the IoT gateway to convert the message from SensorTag into the .json format.

[!INCLUDE [iot-hub-get-started-next-steps](../../includes/iot-hub-get-started-next-steps.md)]
