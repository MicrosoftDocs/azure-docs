---
title: Connect a generic Node.js client application to Azure IoT Central | Microsoft Docs
description: As an device developer, how to connect a generic Node.js device to your Azure IoT Central application.
author: tbhagwat3
ms.author: tanmayb
ms.date: 04/16/2018
ms.topic: conceptual
ms.service: iot-central
services: iot-central
manager: peterpr
---

# Connect a generic client application to your Azure IoT Central application (Node.js)

This article describes how, as a device developer, to connect a generic Node.js application representing a physical device to your Microsoft Azure IoT Central application.

## Before you begin

To complete the steps in this article, you need the following:

1. An Azure IoT Central application. For more information, see [Create your Azure IoT Central Application](howto-create-application.md).
1. A development machine with [Node.js](https://nodejs.org/) version 4.0.0 or later installed. You can run `node --version` in the command line to check your version. Node.js is available for a wide variety of operating systems.

## Create a Device Template

In your Azure IoT Central application, you need a device template with the following measurements and device properties defined:

### Telemetry measurements

Add the following telemetry in the **Measurements** page:

| Display Name | Field Name  | Units | Min | Max | Decimal Places |
| ------------ | ----------- | ----- | --- | --- | -------------- |
| Temperature  | temperature | F     | 60  | 110 | 0              |
| Humidity     | humidity    | %     | 0   | 100 | 0              |
| Pressure     | pressure    | kPa   | 80  | 110 | 0              |

> [!NOTE]
  The datatype of the telemetry measurement is double.

Enter field names exactly as shown in the table into the device template. If the field names do not match, the telemetry cannot be displayed in the application.

### State measurements

Add the following state in the **Measurements** page:

| Display Name | Field Name  | Value 1 | Display Name | Value 2 | Display Name |
| ------------ | ----------- | --------| ------------ | ------- | ------------ | 
| Fan Mode     | fanmode     | 1       | Running      | 0       | Stopped      |

> [!NOTE]
  The datatype of the State measurement is string.

Enter field names exactly as shown in the table into the device template. If the field names do not match, the state cannot be displayed in the application.

### Event measurements

Add the following event in the **Measurements** page:

| Display Name | Field Name  | Severity |
| ------------ | ----------- | -------- |
| Overheating  | overheat    | Error    |

> [!NOTE]
  The datatype of the Event measurement is string.

### Device properties

Add the following device properties in the **properties page**:

| Display Name        | Field Name        | Data type |
| ------------------- | ----------------- | --------- |
| Serial Number       | serialNumber      | text      |
| Device Manufacturer | manufacturer      | text      |

Enter the field names exactly as shown in the table into the device template. If the field names do not match, the application cannot show the property value.

### Settings

Add the following **number** settings in the **settings page**:

| Display Name    | Field Name     | Units | Decimals | Min | Max  | Initial |
| --------------- | -------------- | ----- | -------- | --- | ---- | ------- |
| Fan Speed       | fanSpeed       | rpm   | 0        | 0   | 3000 | 0       |
| Set Temperature | setTemperature | F     | 0        | 20  | 200  | 80      |

Enter field name exactly as shown in the table into the device template. If the field names do not match, the device cannot receive the setting value.

## Add a real device

In your Azure IoT Central application, add a real device from the device template you create and make a note of the device connection string. For more information, see [Add a real device to your Azure IoT Central application](tutorial-add-device.md)

### Create a Node.js application

The following steps show how to create a client application that implements the real device you added to the application.

1. Create a folder called `connected-air-conditioner-adv` on your machine. Navigate to that folder in your command-line environment.

1. To initialize your Node.js project, run the following commands:

    ```cmd/sh
    npm init
    npm install azure-iot-device azure-iot-device-mqtt --save
    ```

1. Create a file called **connectedAirConditionerAdv.js** in the `connected-air-conditioner-adv` folder.

1. Add the following `require` statements at the start of the **connectedAirConditionerAdv.js** file:

    ```javascript
    "use strict";

    // Use the Azure IoT device SDK for devices that connect to Azure IoT Central.
    var clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString;
    var Message = require('azure-iot-device').Message;
    var ConnectionString = require('azure-iot-device').ConnectionString;
    ```

1. Add the following variable declarations to the file:

    ```javascript
    var connectionString = '{your device connection string}';
    var targetTemperature = 0;
    var client = clientFromConnectionString(connectionString);
    ```

  > [!NOTE]
   > Azure IoT Central has transitioned to using Azure IoT Hub Device Provisioning service (DPS) for all device connections, follow these instrustions to [get the device connection string](concepts-connectivity.md#getting-device-connection-string) and continue with the rest of the tutorial.


    Update the placeholder `{your device connection string}` with the device connection string. In this sample, we initialize `targetTemperature` to zero, you can optionally take the current reading from the device or value from the device twin. 

1. To send telemetry, state and event measurements to your Azure IoT Central application, add the following function to the file:

    ```javascript
    // Send device measurements.
    function sendTelemetry() {
      var temperature = targetTemperature + (Math.random() * 15);
      var humidity = 70 + (Math.random() * 10);
      var pressure = 90 + (Math.random() * 5);
      var fanmode = 0;
      var data = JSON.stringify({ 
        temperature: temperature, 
        humidity: humidity, 
        pressure: pressure,
        fanmode: (temperature > 25) ? "1" : "0",
        overheat: (temperature > 35) ? "ER123" : undefined });
      var message = new Message(data);
      client.sendEvent(message, (err, res) => console.log(`Sent message: ${message.getData()}` +
        (err ? `; error: ${err.toString()}` : '') +
        (res ? `; status: ${res.constructor.name}` : '')));
    }
    ```

    1. To send device properties to your Azure IoT Central application, add the following function to your file:

    ```javascript
    // Send device properties.
    function sendDeviceProperties(twin) {
      var properties = {
        serialNumber: '123-ABC',
        manufacturer: 'Contoso'
      };
      twin.properties.reported.update(properties, (err) => console.log(`Sent device properties; ` +
        (err ? `error: ${err.toString()}` : `status: success`)));
    }
    ```

1. To define the settings your device responds to, add the following definition:

    ```javascript
    // Add any settings your device supports,
    // mapped to a function that is called when the setting is changed.
    var settings = {
      'fanSpeed': (newValue, callback) => {
          // Simulate it taking 1 second to set the fan speed.
          setTimeout(() => {
            callback(newValue, 'completed');
          }, 1000);
      },
      'setTemperature': (newValue, callback) => {
        // Simulate the temperature setting taking two steps.
        setTimeout(() => {
          targetTemperature = targetTemperature + (newValue - targetTemperature) / 2;
          callback(targetTemperature, 'pending');
          setTimeout(() => {
            targetTemperature = newValue;
            callback(targetTemperature, 'completed');
          }, 5000);
        }, 5000);
      }
    };
    ```

1. To handle updated settings from your Azure IoT Central application, add the following to the file:

    ```javascript
    // Handle settings changes that come from Azure IoT Central via the device twin.
    function handleSettings(twin) {
      twin.on('properties.desired', function (desiredChange) {
        for (let setting in desiredChange) {
          if (settings[setting]) {
            console.log(`Received setting: ${setting}: ${desiredChange[setting].value}`);
            settings[setting](desiredChange[setting].value, (newValue, status, message) => {
              var patch = {
                [setting]: {
                  value: newValue,
                  status: status,
                  desiredVersion: desiredChange.$version,
                  message: message
                }
              }
              twin.properties.reported.update(patch, (err) => console.log(`Sent setting update for ${setting}; ` +
                (err ? `error: ${err.toString()}` : `status: success`)));
            });
          }
        }
      });
    }
    ```

1. Add the following to complete the connection to Azure IoT Central and hook up the functions in the client code:

    ```javascript
    // Handle device connection to Azure IoT Central.
    var connectCallback = (err) => {
      if (err) {
        console.log(`Device could not connect to Azure IoT Central: ${err.toString()}`);
      } else {
        console.log('Device successfully connected to Azure IoT Central');

        // Send telemetry measurements to Azure IoT Central every 1 second.
        setInterval(sendTelemetry, 1000);

        // Get device twin from Azure IoT Central.
        client.getTwin((err, twin) => {
          if (err) {
            console.log(`Error getting device twin: ${err.toString()}`);
          } else {
            // Send device properties once on device start up.
            sendDeviceProperties(twin);
            // Apply device settings and handle changes to device settings.
            handleSettings(twin);
          }
        });
      }
    };

    // Start the device (connect it to Azure IoT Central).
    client.open(connectCallback);
    ```

## Run your Node.js application

Run the following command in your command-line environment:

```cmd/sh
node connectedAirConditionerAdv.js
```

As an operator in your Azure IoT Central application, for your real device you can:

* View the telemetry on the **Measurements** page:

    ![View telemetry](media/howto-connect-nodejs/viewtelemetry.png)

* View the device property values sent from your device on the **Properties** page.

    ![View device properties](media/howto-connect-nodejs/viewproperties.png)

* Set the fan speed and target temperature from the **Settings** page.

    ![Set fan speed](media/howto-connect-nodejs/setfanspeed.png)

## Next steps

Now that you have learned how to connect a generic Node.js client to your Azure IoT Central application, here are the suggested next steps:
* [Prepare and connect a Raspberry Pi](howto-connect-raspberry-pi-python.md)
<!-- Next how-tos in the sequence -->
