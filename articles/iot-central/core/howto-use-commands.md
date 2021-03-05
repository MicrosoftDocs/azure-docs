---
title: How to use device commands in an Azure IoT Central solution
description: How to use device commands in Azure IoT Central solution. This tutorial shows you how, as a device developer, to use device commands in client app to your Azure IoT Central application. 
author: dominicbetts
ms.author: dobett
ms.date: 01/07/2021 
ms.topic: how-to
ms.service: iot-central
services: iot-central
---

# How to use commands in an Azure IoT Central solution

This how-to guide shows you how, as a device developer, to use commands that are defined in a device template.

An operator can use the IoT Central UI to call a command on a device. Commands control the behavior of a device. For example, an operator might call a command to reboot a device or collect diagnostics data.

A device can:

* Respond to a command immediately.
* Respond to IoT Central when it receives the command and then later notify IoT Central when the *long-running command* is complete.

By default, commands expect a device to be connected and fail if the device can't be reached. If you select the **Queue if offline** option in the device template UI a command can be queued until a device comes online. These *offline commands* are described in a separate section later in this article.

## Define your commands

Standard commands are sent to a device to instruct the device to do something. A command can include parameters with additional information. For example, a command to open a valve on a device could have a parameter that specifies how much to open the valve. Commands can also receive a return value when the device completes the command. For example, a command that asks a device to run some diagnostics could receive a diagnostics report as a return value.

Commands are defined as part of a device template. The following screenshot shows the **Get Max-Min report** command definition in the **Thermostat** device template. This command has both request and response parameters: 

:::image type="content" source="media/howto-use-commands/command-definition.png" alt-text="Screenshot showing Get Max Min Report command in Thermostat device template":::

The following table shows the configuration settings for a command capability:

| Field             |Description|
|-------------------|-----------|
|Display Name       |The command value used on dashboards and forms.|
| Name            | The name of the command. IoT Central generates a value for this field from the display name, but you can choose your own value if necessary. This field needs to be alphanumeric. The device code uses this **Name** value.|
| Capability Type | Command.|
| Queue if offline | Whether to make this command an *offline* command. |
| Description     | A description of the command capability.|
| Comment     | Any comments about the command capability.|
| Request     | The payload for the device command.|
| Response     | The payload of the device command response.|

The following snippet shows the JSON representation of the command in the device model. In this example, the response value is a complex **Object** type with multiple fields:

```json
{
  "@type": "Command",
  "name": "getMaxMinReport",
  "displayName": "Get Max-Min report.",
  "description": "This command returns the max, min and average temperature from the specified time to the current time.",
  "request": {
    "name": "since",
    "displayName": "Since",
    "description": "Period to return the max-min report.",
    "schema": "dateTime"
  },
  "response": {
    "name" : "tempReport",
    "displayName": "Temperature Report",
    "schema": {
      "@type": "Object",
      "fields": [
        {
          "name": "maxTemp",
          "displayName": "Max temperature",
          "schema": "double"
        },
        {
          "name": "minTemp",
          "displayName": "Min temperature",
          "schema": "double"
        },
        {
          "name" : "avgTemp",
          "displayName": "Average Temperature",
          "schema": "double"
        },
        {
          "name" : "startTime",
          "displayName": "Start Time",
          "schema": "dateTime"
        },
        {
          "name" : "endTime",
          "displayName": "End Time",
          "schema": "dateTime"
        }
      ]
    }
  }
}
```

> [!TIP]
> You can export a device model from the device template page.

You can relate this command definition to the screenshot of the UI using the following fields:

* `@type` to specify the type of capability: `Command`
* `name` for the command value.

Optional fields, such as display name and description, let you add more details to the interface and capabilities.

## Standard commands

This section shows you how a device sends a response value as soon as it receives the command.

The following code snippet shows how a device can respond to a command immediately sending a success code:

> [!NOTE]
> This article uses Node.js for simplicity. For other language examples, see the [Create and connect a client application to your Azure IoT Central application](tutorial-connect-device.md) tutorial.

```javascript
client.onDeviceMethod('getMaxMinReport', commandHandler);

// ...

const commandHandler = async (request, response) => {
  switch (request.methodName) {
  case 'getMaxMinReport': {
    console.log('MaxMinReport ' + request.payload);
    await sendCommandResponse(request, response, 200, deviceTemperatureSensor.getMaxMinReportObject());
    break;
  }
  default:
    await sendCommandResponse(request, response, 404, 'unknown method');
    break;
  }
};

const sendCommandResponse = async (request, response, status, payload) => {
  try {
    await response.send(status, payload);
    console.log('Response to method \'' + request.methodName +
              '\' sent successfully.' );
  } catch (err) {
    console.error('An error ocurred when sending a method response:\n' +
              err.toString());
  }
};
```

The call to `onDeviceMethod` sets up the `commandHandler` method. This command handler:

1. Checks the name of the command.
1. For the `getMaxMinReport` command, it calls `getMaxMinReportObject` to retrieve the values to include in the return object.
1. Calls `sendCommandResponse` to send the response back to IoT Central. This response includes the `200` response code to indicate success.

The following screenshot shows how the successful command response displays in the IoT Central UI:

:::image type="content" source="media/howto-use-commands/simple-command-ui.png" alt-text="Screenshot showing how to view command payload for a standard command":::

## Long-running commands

This section shows you how a device can delay sending a confirmation that the command competed.

The following code snippet shows how a device can implement a long-running command:

> [!NOTE]
> This article uses Node.js for simplicity. For other language examples, see the [Create and connect a client application to your Azure IoT Central application](tutorial-connect-device.md) tutorial.

```javascript
client.onDeviceMethod('rundiagnostics', commandHandler);

// ...

const commandHandler = async (request, response) => {
  switch (request.methodName) {
  case 'rundiagnostics': {
    console.log('Starting long-running diagnostics run ' + request.payload);
    await sendCommandResponse(request, response, 202, 'Diagnostics run started');

    // Long-running operation here
    // ...

    const patch = {
      rundiagnostics: {
        value: 'Diagnostics run complete at ' + new Date().toLocaleString()
      }
    };

    deviceTwin.properties.reported.update(patch, function (err) {
      if (err) throw err;
      console.log('Properties have been reported for component');
    });
    break;
  }
  default:
    await sendCommandResponse(request, response, 404, 'unknown method');
    break;
  }
};
```

The call to `onDeviceMethod` sets up the `commandHandler` method. This command handler:

1. Checks the name of the command.
1. Calls `sendCommandResponse` to send the response back to IoT Central. This response includes the `202` response code to indicate pending results.
1. Completes the long-running operation.
1. Uses a reported property with the same name as the command to tell IoT Central that the command completed.

The following screenshot shows how the command response displays in the IoT Central UI when it receives the 202 response code:

:::image type="content" source="media/howto-use-commands/long-running-start.png" alt-text="Screenshot that shows immediate response from device":::

The following screenshot shows the IoT Central UI when it receives the property update that indicates the command is complete:

:::image type="content" source="media/howto-use-commands/long-running-finish.png" alt-text="Screenshot that shows long-running command finished":::

## Offline commands

This section shows you how a device handles an offline command. If a device is online, it can handle the offline command as soon it's received. If a device is offline, it handles the offline command when it next connects to IoT Central. Devices can't send a return value in response to an offline command.

> [!NOTE]
> This article uses Node.js for simplicity.

The following screenshot shows an offline command called **GenerateDiagnostics**. The request parameter is an object with datetime property called **StartTime** and an integer enumeration property called **Bank**:

:::image type="content" source="media/howto-use-commands/offline-command.png" alt-text="Screenshot that shows the UI for an offline command":::

The following code snippet shows how a client can listen for offline commands and display the message contents:

```javascript
client.on('message', function (msg) {
  console.log('Body: ' + msg.data);
  console.log('Properties: ' + JSON.stringify(msg.properties));
  client.complete(msg, function (err) {
    if (err) {
      console.error('complete error: ' + err.toString());
    } else {
      console.log('complete sent');
    }
  });
});
```

The output from the previous code snippet shows the payload with the **StartTime** and **Bank** values. The property list includes the command name in the **method-name** list item:

```output
Body: {"StartTime":"2021-01-06T06:00:00.000Z","Bank":2}
Properties: {"propertyList":[{"key":"iothub-ack","value":"none"},{"key":"method-name","value":"GenerateDiagnostics"}]}
```

> [!NOTE]
> The default time-to-live for offline commands is 24 hours, after which the message expires.

## Next steps

Now that you've learned how to use commands in your Azure IoT Central application, see [Payloads](concepts-telemetry-properties-commands.md) to learn more about command parameters and [Create and connect a client application to your Azure IoT Central application](tutorial-connect-device.md) to see complete code samples in different languages.
