---
title: Provision Raspberry Pi to Remote Monitoring in Node.js - Azure | Microsoft Docs
description: Describes how to connect a Raspberry Pi device to the Azure IoT Suite preconfigured remote monitoring solution using an application written in Node.js.
services: iot-suite
suite: iot-suite
documentationcenter: na
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: fc50a33f-9fb9-42d7-b1b8-eb5cff19335e
ms.service: iot-suite
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/18/2017
ms.author: dobett

---
# Connect your Raspberry Pi device to the remote monitoring preconfigured solution (Node.js)

[!INCLUDE [iot-suite-selector-connecting](../../includes/iot-suite-selector-connecting.md)]

This tutorial shows you how to connect a physical device to the remote monitoring preconfigured solution. In this tutorial, you use Node.js, which is a good option for environments with minimal resource constraints.

### Required hardware

A desktop computer to enable you to connect remotely to the command line on the Raspberry Pi.

[Microsoft IoT Starter Kit for Raspberry Pi 3](https://azure.microsoft.com/develop/iot/starter-kits/) or equivalent components. This tutorial uses the following items from the kit:

- Raspberry Pi 3
- MicroSD Card (with NOOBS)
- A USB Mini cable
- An Ethernet cable

### Required desktop software

You need SSH client on your desktop machine to enable you to remotely access the command line on the Raspberry Pi.

- Windows does not include an SSH client. We recommend using [PuTTY](http://www.putty.org/).
- Most Linux distributions and Mac OS include the command-line SSH utility. For more information, see [SSH Using Linux or Mac OS](https://www.raspberrypi.org/documentation/remote-access/ssh/unix.md).

### Required Raspberry Pi software

If you haven't done so already, install Node.js version 4.0.0 or later on your Raspberry Pi. The following steps show you how to install Node.js v6.11.4 on your Raspberry Pi:

1. Connect to your Raspberry Pi using `ssh`. For more information, see [SSH (Secure Shell)](https://www.raspberrypi.org/documentation/remote-access/ssh/README.md) on the [Raspberry Pi website](https://www.raspberrypi.org/).

1. Use the following command to update your Raspberry Pi:

    ```sh
    sudo apt-get update
    ```

1. Use the following command to download the Node.js binaries to your Raspberry Pi:

    ```sh
    wget https://nodejs.org/dist/v6.11.4/node-v6.11.4-linux-armv7l.tar.gz
    ```

1. Use the following command to install the binaries:

    ```sh
    sudo tar -C /usr/local --strip-components 1 -xzf node-v6.11.4-linux-armv7l.tar.gz
    ```

1. Use the following command to verify you have installed Node.js v6.11.4 successfully:

    ```sh
    node --version
    ```

## Create a Node.js solution

Complete the following steps using the `ssh` connection to your Raspberry Pi:

1. Create a folder called `RemoteMonitoring` in your home folder on the Raspberry Pi. Navigate to this folder in your command line:

    ```sh
    cd ~
    mkdir RemoteMonitoring
    cd RemoteMonitoring
    ```

1. To download and install the packages you need to complete the sample app, run the following commands:

    ```sh
    npm init
    npm install azure-iot-device azure-iot-device-mqtt --save
    ```

1. In the `RemoteMonitoring` folder, create a file called **remote_monitoring.js**. Open this file in a text editor. On the Raspberry Pi, you can use the `nano` or `vi` text editors.

1. In the **remote_monitoring.js** file, add the following `require` statements:

    ```nodejs
    'use strict';

    var Protocol = require('azure-iot-device-mqtt').Mqtt;
    var Client = require('azure-iot-device').Client;
    var ConnectionString = require('azure-iot-device').ConnectionString;
    var Message = require('azure-iot-device').Message;
    ```

1. Add the following variable declarations after the `require` statements. Replace the placeholder values `{Device Id}` and `{Device Key}` with values you noted for the device you provisioned in the remote monitoring solution. Use the IoT Hub Hostname from the solution to replace `{IoTHub Name}`. For example, if your IoT Hub Hostname is `contoso.azure-devices.net`, replace `{IoTHub Name}` with `contoso`:

    ```nodejs
    var connectionString = 'HostName={IoTHub Name}.azure-devices.net;DeviceId={Device Id};SharedAccessKey={Device Key}';
    var deviceId = ConnectionString.parse(connectionString).DeviceId;
    ```

1. To define some base telemetry data, add the following variables:

    ```nodejs
    var temperature = 50;
    var temperatureUnit = 'F';
    var humidity = 50;
    var humidityUnit = '%';
    var pressure = 55;
    var pressureUnit = 'psig';
    ```

1. To define some property values, add the following variables:

    ```nodejs
    var temperatureSchema = 'chiller-temperature;v1';
    var humiditySchema = 'chiller-humidity;v1';
    var pressureSchema = 'chiller-pressure;v1';
    var interval = "00:00:05";
    var deviceType = "Chiller";
    var deviceFirmware = "1.0.0";
    var deviceFirmwareUpdateStatus = "";
    var deviceLocation = "Building 44";
    var deviceLatitude = 47.638928;
    var deviceLongitude = -122.13476;
    ```

1. Add the following variable to define the reported properties to send to the solution. These properties include metadata to describe the methods and telemetry the device uses:

    ```nodejs
    var reportedProperties = {
      "Protocol": "MQTT",
      "SupportedMethods": "Reboot,FirmwareUpdate,EmergencyValveRelease,IncreasePressure",
      "Telemetry": {
        "TemperatureSchema": {
          "Interval": interval,
          "MessageTemplate": "{\"temperature\":${temperature},\"temperature_unit\":\"${temperature_unit}\"}",
          "MessageSchema": {
            "Name": temperatureSchema,
            "Format": "JSON",
            "Fields": {
              "temperature": "Double",
              "temperature_unit": "Text"
            }
          }
        },
        "HumiditySchema": {
          "Interval": interval,
          "MessageTemplate": "{\"humidity\":${humidity},\"humidity_unit\":\"${humidity_unit}\"}",
          "MessageSchema": {
            "Name": humiditySchema,
            "Format": "JSON",
            "Fields": {
              "humidity": "Double",
              "humidity_unit": "Text"
            }
          }
        },
        "PressureSchema": {
          "Interval": interval,
          "MessageTemplate": "{\"pressure\":${pressure},\"pressure_unit\":\"${pressure_unit}\"}",
          "MessageSchema": {
            "Name": pressureSchema,
            "Format": "JSON",
            "Fields": {
              "pressure": "Double",
              "pressure_unit": "Text"
            }
          }
        }
      },
      "Type": deviceType,
      "Firmware": deviceFirmware,
      "FirmwareUpdateStatus": deviceFirmwareUpdateStatus,
      "Location": deviceLocation,
      "Latitude": deviceLatitude,
      "Longitude": deviceLongitude
    }
    ```

1. To print operation results, add the following helper function:

    ```nodejs
    function printErrorFor(op) {
        return function printError(err) {
            if (err) console.log(op + ' error: ' + err.toString());
        };
    }
    ```

1. Add the following helper function to use to randomize the telemetry values:

    ```nodejs
    function generateRandomIncrement() {
        return ((Math.random() * 2) - 1);
    }
    ```

1. Add the following function to handle direct method calls from the solution. The solution uses direct methods to act on devices:

    ```nodejs
    function onDirectMethod(request, response) {
      // Implement logic asynchronously here.
      console.log('Simulated ' + request.methodName);

      // Complete the response
      response.send(200, request.methodName + ' was called on the device', function (err) {
        if (!!err) {
          console.error('An error ocurred when sending a method response:\n' +
            err.toString());
        } else {
          console.log('Response to method \'' + request.methodName +
            '\' sent successfully.');
        }
      });
    }
    ```

1. Add the following code to send telemetry data to the solution. The client app adds properties to the message to identify the message schema:

    ```node.js
    function sendTelemetry(data, schema) {
      var d = new Date();
      var payload = JSON.stringify(data);
      var message = new Message(payload);
      message.properties.add('$$CreationTimeUtc', d.toISOString());
      message.properties.add('$$MessageSchema', schema);
      message.properties.add('$$ContentType', 'JSON');

      console.log('Sending device message data:\n' + payload);
      client.sendEvent(message, printErrorFor('send event'));
    }
    ```

1. Add the following code to create a client instance:

    ```nodejs
    var client = Client.fromConnectionString(connectionString, Protocol);
    ```

1. Add the following code to:

    - Open the connection.
    - Set up a handler for desired properties.
    - Send reported properties.
    - Register handlers for the direct methods.
    - Start sending telemetry.

    ```nodejs
    client.open(function (err) {
      if (err) {
        printErrorFor('open')(err);
      } else {
        // Create device Twin
        client.getTwin(function (err, twin) {
          if (err) {
            console.error('Could not get device twin');
          } else {
            console.log('Device twin created');

            twin.on('properties.desired', function (delta) {
              // Handle desired properties set by solution
              console.log('Received new desired properties:');
              console.log(JSON.stringify(delta));
            });

            // Send reported properties
            twin.properties.reported.update(reportedProperties, function (err) {
              if (err) throw err;
              console.log('twin state reported');
            });

            // Register handlers for all the method names we are interested in.
            // Consider separate handlers for each method.
            client.onDeviceMethod('Reboot', onDirectMethod);
            client.onDeviceMethod('FirmwareUpdate', onDirectMethod);
            client.onDeviceMethod('EmergencyValveRelease', onDirectMethod);
            client.onDeviceMethod('IncreasePressure', onDirectMethod);
          }
        });

        // Start sending telemetry
        var sendTemperatureInterval = setInterval(function () {
          temperature += generateRandomIncrement();
          var data = {
            'temperature': temperature,
            'temperature_unit': temperatureUnit
          };
          sendTelemetry(data, temperatureSchema)
        }, 5000);

        var sendHumidityInterval = setInterval(function () {
          humidity += generateRandomIncrement();
          var data = {
            'humidity': humidity,
            'humidity_unit': humidityUnit
          };
          sendTelemetry(data, humiditySchema)
        }, 5000);

        var sendPressureInterval = setInterval(function () {
          pressure += generateRandomIncrement();
          var data = {
            'pressure': pressure,
            'pressure_unit': pressureUnit
          };
          sendTelemetry(data, pressureSchema)
        }, 5000);

        client.on('error', function (err) {
          printErrorFor('client')(err);
          if (sendTemperatureInterval) clearInterval(sendTemperatureInterval);
          if (sendHumidityInterval) clearInterval(sendHumidityInterval);
          if (sendPressureInterval) clearInterval(sendPressureInterval);
          client.close(printErrorFor('client.close'));
        });
      }
    });
    ```

1. Save the changes to the **remote_monitoring.js** file.

1. To launch the sample application, run the following command at your command prompt on the Raspberry Pi:

    ```sh
    node remote_monitoring.js
    ```

[!INCLUDE [iot-suite-visualize-connecting](../../includes/iot-suite-visualize-connecting.md)]
