---
title: Service developer guide - IoT Plug and Play | Microsoft Docs
description: Description of IoT Plug and Play for service developers
author: dominicbetts
ms.author: dobett
ms.date: 09/24/2020
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
---

# IoT Plug and Play service developer guide

IoT Plug and Play lets you build smart devices that advertise their capabilities to Azure IoT applications. IoT Plug and Play devices don't require manual configuration when a customer connects them to IoT Plug and Play-enabled applications.

IoT Plug and Play lets you use devices that have announced their model ID with your IoT hub. For example, you can access the properties and commands of a device directly.

To use an IoT Plug and Play device that's connected to your IoT hub, use either one of the IoT service SDKs or the IoT Hub REST API:

## Service SDKs

Use the Azure IoT Service SDKs in your solution to interact with devices and modules. For example, you can use the service SDKs to read and update twin properties and invoke commands. Supported languages include C#, Java, Node.js, and Python.

The service SDKs let you access device information from a solution, such as a desktop or web application. The service SDKs include two namespaces and object models that you can use to retrieve the model ID:

- Iot Hub service client. This service exposes the model ID as a device twin property.

- Digital Twins service client. The new Digital Twins API operate on high-level constructs such as components, properties, and commands that are defined a Digital Twins Definition language model. The Digital Twin APIs make it easier for solution builders to create IoT Plug and Play solutions.

| Platform | IoT Hub service client | Digital Twins service client |
| -------- | ---------------------- | ---------------------------- |
| .NET     | [Documentation](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.shared.twin.modelid?view=azure-dotnet#Microsoft_Azure_Devices_Shared_Twin_ModelId&preserve-view=true) <br/> [Samples](https://github.com/Azure-Samples/azure-iot-samples-csharp/tree/master/iot-hub/Samples/service/PnpServiceSamples)| [Samples](https://github.com/Azure-Samples/azure-iot-samples-csharp/tree/master/iot-hub/Samples/service/DigitalTwinClientSamples) |
| Java     | [Documentation](https://docs.microsoft.com/java/api/com.microsoft.azure.sdk.iot.service.devicetwin.devicetwindevice?view=azure-java-stable&preserve-view=true) <br/> [Samples](https://github.com/Azure/azure-iot-sdk-java/blob/master/service/iot-service-samples/pnp-service-sample)| [Samples](https://github.com/Azure/azure-iot-sdk-java/tree/master/service/iot-service-samples/digitaltwin-service-samples) |
| Node.js  | [Documentation](https://docs.microsoft.com/javascript/api/azure-iothub/twin?view=azure-node-latest&preserve-view=true) <br/> [Sample](https://github.com/Azure/azure-iot-sdk-node/blob/master/service/samples/javascript/twin.js)| [Documentation](https://docs.microsoft.com/javascript/api/azure-iot-digitaltwins-service/?view=azure-node-latest&preserve-view=true) <br/> [Sample](https://github.com/Azure/azure-iot-sdk-node/blob/master/service/samples/javascript/get_digital_twin.js) |
| Python   | [Documentation](https://docs.microsoft.com/python/api/azure-iot-hub/azure.iot.hub.iothubregistrymanager?view=azure-python&preserve-view=true) <br/> [Sample](https://github.com/Azure/azure-iot-sdk-python/blob/master/azure-iot-hub/samples/iothub_registry_manager_method_sample.py)| [Documentation](https://docs.microsoft.com/python/api/azure-iot-hub/azure.iot.hub.iothubdigitaltwinmanager?view=azure-python&preserve-view=true) <br/> [Sample](https://github.com/Azure/azure-iot-sdk-python/blob/master/azure-iot-hub/samples/get_digital_twin_sample.py) |

## REST API

The following examples use the IoT Hub REST API to interact with a connected IoT Plug and Play device. The current version of the API is `2020-09-30`. Append `?api-version=2020-09-30` to your REST PI calls.

> [!NOTE]
> Module twins are not currently supported by the `digitalTwins` API.

If your thermostat device is called `t-123`, you get the all the properties on all the interfaces implemented by your device with a REST API GET call:

```REST
GET /digitalTwins/t-123
```

This call will include the Json property `$metadata.$model` with the model ID announced by the device.

All properties on all interfaces are accessed with the `GET /DigitalTwin/{device-id}` REST API template where `{device-id}` is the identifier for the device:

```REST
GET /digitalTwins/{device-id}
```

You can call IoT Plug and Play device commands directly. If the `Thermostat` component in the `t-123` device has a `restart` command, you can call it with a REST API POST call:

```REST
POST /digitalTwins/t-123/components/Thermostat/commands/restart
```

More generally, commands can be called through this REST API template:

- `device-id`: the identifier for the device.
- `component-name`: the name of the interface from the implements section in the device capability model.
- `command-name`: the name of the command.

```REST
/digitalTwins/{device-id}/components/{component-name}/commands/{command-name}
```

## Next steps

Now that you've learned about device modeling, here are some additional resources:

- [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl)
- [C device SDK](https://docs.microsoft.com/azure/iot-hub/iot-c-sdk-ref/)
- [IoT REST API](https://docs.microsoft.com/rest/api/iothub/device)
- [Model components](./concepts-components.md)
- [Install and use the DTDL authoring tools](howto-use-dtdl-authoring-tools.md)
