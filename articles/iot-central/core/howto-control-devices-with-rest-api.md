---
title: Use the REST API to manage devices in Azure IoT Central
description: How to use the IoT Central REST API to control devices in an application by using properties and commands.
author: dominicbetts
ms.author: dobett
ms.date: 06/14/2023
ms.topic: how-to
ms.service: iot-central
services: iot-central

---

# How to use the IoT Central REST API to control devices

The IoT Central REST API lets you develop client applications that integrate with IoT Central applications. You can use the REST API to control devices in your IoT Central application. The REST API lets you:

- Read the last known telemetry value from a device.
- Read property values from a device.
- Set writable properties on a device.
- Call commands on a device.

This article describes how to use the `/devices/{device_id}` API to control individual devices. You can also use jobs to control devices in bulk.

A device can group the properties, telemetry, and commands it supports into _components_ and _modules_.

Every IoT Central REST API call requires an authorization header. To learn more, see [How to authenticate and authorize IoT Central REST API calls](howto-authorize-rest-api.md).

For the reference documentation for the IoT Central REST API, see [Azure IoT Central REST API reference](/rest/api/iotcentral/).

[!INCLUDE [iot-central-postman-collection](../../../includes/iot-central-postman-collection.md)]

To learn how to control devices by using the IoT Central UI, see

- [Use properties in an Azure IoT Central solution](../core/howto-use-properties.md).
- [How to use commands in an Azure IoT Central solution()](../core/howto-use-commands.md).

## Components and modules

Components let you group and reuse device capabilities. To learn more about components and device models, see the [IoT Plug and Play modeling guide](../../iot-develop/concepts-modeling-guide.md).

Not all device templates use components. The following screenshot shows the device template for a simple [thermostat](https://github.com/Azure/iot-plugandplay-models/blob/main/dtmi/com/example/thermostat-2.json) where all the capabilities are defined in a single interface called the **Root component**:

:::image type="content" source="media/howto-control-devices-with-rest-api/thermostat-device.png" alt-text="Screenshot that shows a simple no component thermostat device." lightbox="media/howto-control-devices-with-rest-api/thermostat-device.png":::

The following screenshot shows a [temperature controller](https://github.com/Azure/iot-plugandplay-models/blob/main/dtmi/com/example/temperaturecontroller-2.json) device template that uses components. The temperature controller has two thermostat components and a device information component:

:::image type="content" source="media/howto-control-devices-with-rest-api/temperature-controller-device.png" alt-text="Screenshot that shows a temperature controller device with two thermostat components and a device information component." lightbox="media/howto-control-devices-with-rest-api/temperature-controller-device.png":::

In IoT Central, a module refers to an IoT Edge module running on a connected IoT Edge device. A module can have a simple model such as the thermostat that doesn't use components. A module can also use components to organize a more complex set of capabilities. The following screenshot shows an example of a device template that uses modules. The environmental sensor device has a module called `SimulatedTemperatureSensor` and an inherited interface called `management`:

:::image type="content" source="media/howto-control-devices-with-rest-api/environmental-sensor-device.png" alt-text="Screenshot that shows an environmental sensor device with a module." lightbox="media/howto-control-devices-with-rest-api/environmental-sensor-device.png":::

## Get a device component

Use the following request to retrieve the components from a device called `temperature-controller-01`:

```http
GET https://{your app subdomain}.azureiotcentral.com/api/devices/temperature-controller-01/components?api-version=2022-07-31
```

The response to this request looks like the following example. The `value` array contains details of each device component:

```json
{
  "value": [
    {
      "@type": "Component",
      "name": "thermostat1",
      "displayName": "Thermostat One",
      "description": "Thermostat One of Two."
    },
    {
      "@type": "Component",
      "name": "thermostat2",
      "displayName": "Thermostat Two",
      "description": "Thermostat Two of Two."
    },
    {
      "@type": "Component",
      "name": "deviceInformation",
      "displayName": "Device Information interface",
      "description": "Optional interface with basic device hardware information."
    }
  ]
}
```

## Get a device module

Use the following request to retrieve a list of modules running on a connected IoT Edge device called `environmental-sensor-01`:

```http
GET https://{your app subdomain}.azureiotcentral.com/api/devices/environmental-sensor-01/modules?api-version=2022-07-31
```

The response to this request looks like the following example. The array of modules only includes custom modules running on the IoT Edge device, not the built-in `$edgeAgent` and `$edgeHub` modules:

```json
{
  "value": [
    {
      "@type": [
        "Relationship",
        "EdgeModule"
      ],
      "name": "SimulatedTemperatureSensor",
      "displayName": "SimulatedTemperatureSensor"
    }
  ]
}
```

Use the following request to retrieve a list of the components in a module called `SimulatedTemperatureSensor`:

```http
GET https://{your app subdomain}.azureiotcentral.com/api/devices/environmental-sensor-01/modules?api-version=2022-07-31
```

## Read telemetry

Use the following request to retrieve the last known telemetry value from a device that doesn't use components. In this example, the device is called `thermostat-01` and the telemetry is called `temperature`:

```http
GET https://{your app subdomain}.azureiotcentral.com/api/devices/thermostat-01/telemetry/temperature?api-version=2022-07-31
```

The response to this request looks like the following example:

```json
{
  "timestamp": "2021-03-24T12:33:15.223Z",
  "value": 40.10993804456927
}
```

Use the following request to retrieve the last known telemetry value from a device that does use components. In this example, the device is called `temperature-controller-01`, the component is called `thermostat2`, and the telemetry is called `temperature`:

```http
GET https://{your app subdomain}.azureiotcentral.com/api/devices/temperature-controller-01/components/thermostat2/telemetry/temperature?api-version=2022-07-31
```

The response to this request looks like the following example:

```json
{
  "timestamp": "2021-03-24T12:43:44.968Z",
  "value": 70.29168040339141
}
```

If the device is an IoT Edge device, use the following request to retrieve the last known telemetry value from a module. This example uses a device called `environmental-sensor-01` with a module called `SimulatedTemperatureSensor` and telemetry called `ambient`. The `ambient` telemetry type has temperature and humidity values:

```http
GET https://{your app subdomain}.azureiotcentral.com/api/devices/environmental-sensor-01/modules/SimulatedTemperatureSensor/telemetry/ambient?api-version=2022-07-31
```

The response to this request looks like the following example:

```json
{
  "timestamp": "2021-03-25T15:44:34.955Z",
  "value": {
    "temperature": 21.18032378129676,
    "humidity": 25
  }
}
```

> [!TIP]
> To access the telemetry from a component in a module, use `/api/devices/{deviceId}/modules/{moduleName}/components/{componentName}/telemetry/{telemetryName}`.

## Read properties

Use the following request to retrieve the property values from a device that doesn't use components. In this example, the device is called `thermostat-01`:

```http
GET https://{your app subdomain}.azureiotcentral.com/api/devices/thermostat-01/properties?api-version=2022-07-31
```

The response to this request looks like the following example. It shows the device is reporting a single property value:

```json
{
  "maxTempSinceLastReboot": 93.95907131817654,
  "$metadata": {
    "maxTempSinceLastReboot": {
      "lastUpdateTime": "2021-03-24T12:47:46.7571438Z"
    }
  }
}
```

Use the following request to retrieve property values from all components. In this example, the device is called `temperature-controller-01`:

```http
GET https://{your app subdomain}.azureiotcentral.com/api/devices/temperature-controller-01/properties?api-version=2022-07-31
```

The response to this request looks like the following example:

```json
{
  "serialNumber": "Explicabo animi nihil qui facere sit explicabo nisi.",
  "$metadata": {
    "serialNumber": {
      "lastUpdateTime": "2021-03-24T13:58:52.5999859Z"
    }
  },
  "thermostat1": {
    "maxTempSinceLastReboot": 79.7290121339184,
    "$metadata": {
      "maxTempSinceLastReboot": {
        "lastUpdateTime": "2021-03-24T13:58:52.5999859Z"
      }
    }
  },
  "thermostat2": {
    "maxTempSinceLastReboot": 54.214860556320424,
    "$metadata": {
      "maxTempSinceLastReboot": {
        "lastUpdateTime": "2021-03-24T13:58:52.5999859Z"
      }
    }
  },
  "deviceInformation": {
    "manufacturer": "Eveniet culpa sed sit omnis.",
    "$metadata": {
      "manufacturer": {
        "lastUpdateTime": "2021-03-24T13:58:52.5999859Z"
      },
      "model": {
        "lastUpdateTime": "2021-03-24T13:58:52.5999859Z"
      },
      "swVersion": {
        "lastUpdateTime": "2021-03-24T13:58:52.5999859Z"
      },
      "osName": {
        "lastUpdateTime": "2021-03-24T13:58:52.5999859Z"
      },
      "processorArchitecture": {
        "lastUpdateTime": "2021-03-24T13:58:52.5999859Z"
      },
      "processorManufacturer": {
        "lastUpdateTime": "2021-03-24T13:58:52.5999859Z"
      },
      "totalStorage": {
        "lastUpdateTime": "2021-03-24T13:58:52.5999859Z"
      },
      "totalMemory": {
        "lastUpdateTime": "2021-03-24T13:58:52.5999859Z"
      }
    },
    "model": "Necessitatibus id ab dolores vel eligendi fuga.",
    "swVersion": "Ut minus ipsum ut omnis est asperiores harum.",
    "osName": "Atque sit omnis eum sapiente eum tenetur est dolor.",
    "processorArchitecture": "Ratione enim dolor iste iure.",
    "processorManufacturer": "Aliquam eligendi sit ipsa.",
    "totalStorage": 36.02825898541592,
    "totalMemory": 55.442695395750505
  }
}
```

Use the following request to retrieve a property value from an individual component. In this example, the device is called `temperature-controller-01` and the component is called `thermostat2`:

```http
GET https://{your app subdomain}.azureiotcentral.com/api/devices/temperature-controller-01/components/thermostat2/properties?api-version=2022-07-31
```

The response to this request looks like the following example:

```json
{
  "maxTempSinceLastReboot": 24.445128131004935,
  "$metadata": {
    "maxTempSinceLastReboot": {
      "lastUpdateTime": "2021-03-24T14:03:53.787491Z"
    }
  }
}
```

If the device is an IoT Edge device, use the following request to retrieve property values from a module. This example uses a device called `environmental-sensor-01` with a module called `SimulatedTemperatureSensor`:

```http
GET https://{your app subdomain}.azureiotcentral.com/api/devices/environmental-sensor-01/modules/SimulatedTemperatureSensor/properties?api-version=2022-07-31
```

The response to this request looks like the following example:

```json
{
  "$metadata": {
    "SendData": {
      "desiredValue": true,
      "desiredVersion": 1
    },
    "SendInterval": {
      "desiredValue": 10,
      "desiredVersion": 1
    }
  }
}
```

> [!TIP]
> To access the properties from a component in a module, use `/devices/{deviceId}/modules/{moduleName}/components/{componentName}/properties`.

## Write properties

Some properties are writable. In the example thermostat model, the `targetTemperature` property is a writable property.

Use the following request to write an individual property value to a device that doesn't use components. In this example, the device is called `thermostat-01`:

```http
PATCH https://{your app subdomain}.azureiotcentral.com/api/devices/thermostat-01/properties?api-version=2022-07-31
```

The request body looks like the following example:

```json
{
  "targetTemperature": 65.5
}
```

The response to this request looks like the following example:

```json
{
  "$metadata": {
    "targetTemperature": {
      "desiredValue": 65.5
    }
  }
}
```

> [!TIP]
> To update all the properties on a device, use `PUT` instead of `PATCH`.

Use the following request to write an individual property value to a device that does use components. In this example, the device is called `temperature-controller-01` and the component is called `thermostat2`:

```http
PATCH https://{your app subdomain}.azureiotcentral.com/api/devices/temperature-controller-01/components/thermostat2/properties?api-version=2022-07-31
```

The request body looks like the following example:

```json
{
  "targetTemperature": 65.5
}
```

The response to this request looks like the following example:

```json
{
  "$metadata": {
    "targetTemperature": {
      "desiredValue": 65.5
    }
  }
}
```

> [!TIP]
> To update all the properties on a component, use `PUT` instead of `PATCH`.

If the device is an IoT Edge device, use the following request to write an individual property value to a module. This example uses a device called `environmental-sensor-01`, a module called `SimulatedTemperatureSensor`, and a property called `SendInterval`:

```http
PUT https://{your app subdomain}.azureiotcentral.com/api/devices/environmental-sensor-01/modules/SimulatedTemperatureSensor/properties?api-version=2022-07-31
```

The request body looks like the following example:

```json
{
  "SendInterval": 20
}
```

The response to this request looks like the following example:

```json
{
  "$metadata": {
    "SendInterval": {
      "desiredValue": 20
    }
  }
}
```

> [!TIP]
> To update all the properties on a module, use `PUT` instead of `PATCH`.

### Update module properties

If you're using an IoT Edge device, use the following request to retrieve property values from a module:

```http
GET https://{your app subdomain}.azureiotcentral.com/api/devices/{deviceId}/modules/{moduleName}/properties?api-version=2022-07-31
```

If you're using an IoT Edge device, use the following request to retrieve property values from a component in a module:

```http
GET https://{your app subdomain}.azureiotcentral.com/api/devices/{deviceId}/modules/{moduleName}/components/{componentName}/properties?api-version=2022-07-31
```

## Call commands

You can use the REST API to call device commands and retrieve the command history.

Use the following request to call a command on device that doesn't use components. In this example, the device is called `thermostat-01` and the command is called `getMaxMinReport`:

```http
POST https://{your app subdomain}.azureiotcentral.com/api/devices/thermostat-01/commands/getMaxMinReport?api-version=2022-07-31
```

The request body looks like the following example:

```json
{
  "request": "2021-03-24T12:55:20.789Z"
}
```

The response to this request looks like the following example:

```json
{
  "response": {
    "maxTemp": 21.002000799562367,
    "minTemp": 73.09674605264892,
    "avgTemp": 59.54553991653756,
    "startTime": "2022-02-28T15:02:56.789Z",
    "endTime": "2021-05-05T03:50:56.412Z"
  },
  "responseCode": 200
}
```

To view the history for this command, use the following request:

```http
GET https://{your app subdomain}.azureiotcentral.com/api/devices/thermostat-01/commands/getMaxMinReport?api-version=2022-07-31
```

The response to this request looks like the following example:

```json
{
  "value": [
    {
      "response": {
        "maxTemp": 71.43744908819954,
        "minTemp": 51.29986610160005,
        "avgTemp": 39.577384387771744,
        "startTime": "2021-06-20T00:38:17.620Z",
        "endTime": "2022-01-07T22:30:41.104Z"
      },
      "responseCode": 200
    }
  ]
}
```

Use the following request to call a command on device that does use components. In this example, the device is called `temperature-controller-01`, the component is called `thermostat2`, and the command is called `getMaxMinReport`:

```http
POST https://{your app subdomain}.azureiotcentral.com/api/devices/temperature-controller-01/components/thermostat2/commands/getMaxMinReport?api-version=2022-07-31
```

The formats of the request payload and response are the same as for a device that doesn't use components.

To view the history for this command, use the following request:

```http
GET https://{your app subdomain}.azureiotcentral.com/api/devices/temperature-controller-01/components/thermostat2/commands/getMaxMinReport?api-version=2022-07-31
```

> [!TIP]
> To call commands in a component in a module, use `/devices/{deviceId}/modules/{moduleName}/components/{componentName}/commands/{commandName}`.

## Next steps

Now that you've learned how to control devices with the REST API, a suggested next step is to learn [How to use the IoT Central REST API to create and manage jobs](howto-manage-jobs-with-rest-api.md).
