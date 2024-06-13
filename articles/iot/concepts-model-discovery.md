---
title: Use IoT Plug and Play models in a solution | Microsoft Docs
description: As a solution builder, learn about how you can use IoT Plug and Play models in your IoT solution.
author: dominicbetts
ms.author: dobett
ms.date: 03/13/2024
ms.topic: conceptual
ms.service: iot
---

# Use IoT Plug and Play models in an IoT solution

This article describes how, in an IoT solution, you can identify model ID of an IoT Plug and Play device and then retrieve its model definition.

There are two broad categories of IoT solution:

- A *purpose-built solution* works with a known set of models for the IoT Plug and Play devices that connect to the solution. You use these models when you develop the solution.

- A *model-driven solution* works with the model of any IoT Plug and Play device. Building a model-driven solution is more complex, but the benefit is that your solution works with any devices that are added in the future. A model-driven IoT solution retrieves a model and uses it to determine the telemetry, properties, and commands the device implements.

To use an IoT Plug and Play model, an IoT solution:

1. Identifies the model ID of the model implemented by the IoT Plug and Play device, module, or IoT Edge module connected to the solution.

1. Uses the model ID to retrieve the model definition of the connected device from a model repository or custom store.

## Identify model ID

When an IoT Plug and Play device connects to IoT Hub, it registers the model ID of the model it implements with IoT Hub.

IoT Hub notifies the solution with the device model ID as part of the device connection flow.

A solution can get the model ID of the IoT Plug and Play device by using one of the following three methods:

### Get Device Twin API

The solution can use the [Get Device Twin](/java/api/com.microsoft.azure.sdk.iot.device.deviceclient.getdevicetwin) API to retrieve model ID of the IoT Plug and Play device.

> [!TIP]
> For modules and IoT Edge modules, use [ModuleClient.getTwin](/java/api/com.microsoft.azure.sdk.iot.device.moduleclient.gettwin).

In the following device twin response snippet, `modelId` contains the model ID of an IoT Plug and Play device:

```json
{
    "deviceId": "sample-device",
    "etag": "AAAAAAAAAAc=",
    "deviceEtag": "NTk0ODUyODgx",
    "status": "enabled",
    "statusUpdateTime": "0001-01-01T00:00:00Z",
    "connectionState": "Disconnected",
    "lastActivityTime": "2020-07-17T06:12:26.8402249Z",
    "cloudToDeviceMessageCount": 0,
    "authenticationType": "sas",
    "x509Thumbprint": {
        "primaryThumbprint": null,
        "secondaryThumbprint": null
    },
    "modelId": "dtmi:com:example:TemperatureController;1",
    "version": 15,
    "properties": {...}
    }
}
```

### Get Digital Twin API

The solution can use the [Get Digital Twin](/rest/api/iothub/service/digitaltwin/getdigitaltwin) API to retrieve the model ID of the model implemented by the IoT Plug and Play device.

In the following digital twin response snippet, `$metadata.$model` contains the model ID of an IoT Plug and Play device:

```json
{
    "$dtId": "sample-device",
    "$metadata": {
        "$model": "dtmi:com:example:TemperatureController;1",
        "serialNumber": {
            "lastUpdateTime": "2020-07-17T06:10:31.9609233Z"
        }
    }
}
```

### Digital twin change event notification

A device connection results in a [Digital Twin change event](concepts-digital-twin.md#digital-twin-change-events) notification. A solution needs to subscribe to this event notification. To learn how to enable routing for digital twin events, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](../iot-hub/iot-hub-devguide-messages-d2c.md#non-telemetry-events).

The solution can use the event shown in the following snippet to learn about the IoT Plug and Play device that's connecting and get its model ID:

```json
iothub-connection-device-id:sample-device
iothub-enqueuedtime:7/22/2020 8:02:27 PM
iothub-message-source:digitalTwinChangeEvents
correlation-id:100f322dc2c5
content-type:application/json-patch+json
content-encoding:utf-8
[
  {
    "op": "replace",
    "path": "/$metadata/$model",
    "value": "dtmi:com:example:TemperatureController;1"
  }
]
```

## Retrieve a model definition

A solution uses model ID identified above to retrieve the corresponding model definition.

A solution can get the model definition by using one of the following options:

### Model repository

Solutions can retrieve DTDL models from the device model repository (DMR). The DMR is a public repository, hosted by Microsoft, that contains a collection of curated DTDL models. The public device models stored in the DMR are available for everyone to consume and integrate in their applications from the public endpoint [https://devicemodels.azure.com](https://devicemodels.azure.com).

After you identify the model ID for a new device connection, follow these steps:

1. Retrieve the model definition using the model ID from the model repository. For more information, see [Resolve models](#resolve-models).

1. Using the model definition of the connected device, you can enumerate the capabilities of the device.

1. Using the enumerated capabilities of the device, you can enable users to [interact with the device](tutorial-service.md).

### Resolve models

The DMR conventions include other artifacts for simplifying consumption of hosted models. These features are *optional* for custom or private repositories.

- *Index*. All available DTMIs are exposed through an *index* composed by a sequence of json files, for example: [https://devicemodels.azure.com/index.page.2.json](https://devicemodels.azure.com/index.page.2.json)
- *Expanded*. A file with all the dependencies is available for each interface, for example: [https://devicemodels.azure.com/dtmi/com/example/temperaturecontroller-1.expanded.json](https://devicemodels.azure.com/dtmi/com/example/temperaturecontroller-1.expanded.json)
- *Metadata*. This file exposes key attributes of a repository and is refreshed periodically with the latest published models snapshot. It includes features that a repository implements such as whether the model index or expanded model files are available. You can access the DMR metadata at [https://devicemodels.azure.com/metadata.json](https://devicemodels.azure.com/metadata.json)

To programmatically access the public DTDL models in the DMR, you can use the `ModelsRepositoryClient` available in the NuGet package [Azure.IoT.ModelsRepository](https://www.nuget.org/packages/Azure.IoT.ModelsRepository). This client is configured by default to query the public DMR available at [devicemodels.azure.com](https://devicemodels.azure.com/) and can be configured to any custom repository.

The client accepts a `DTMI` as input and returns a dictionary with all required interfaces:

```cs
using Azure.IoT.ModelsRepository;

var client = new ModelsRepositoryClient();
ModelResult models = client.GetModel("dtmi:com:example:TemperatureController;1");
models.Content.Keys.ToList().ForEach(k => Console.WriteLine(k));
```

The expected output displays the `DTMI` of the three interfaces found in the dependency chain:

```txt
dtmi:com:example:TemperatureController;1
dtmi:com:example:Thermostat;1
dtmi:azure:DeviceManagement:DeviceInformation;1
```

The `ModelsRepositoryClient` can be configured to query a custom DMR -available through http(s)- and to specify the dependency resolution by using the `ModelDependencyResolution` flag:

- Disabled. Returns the specified interface only, without any dependency.
- Enabled. Returns all the interfaces in the dependency chain

> [!TIP]
> Custom repositories might not expose the `.expanded.json` file. When this file isn't available, the client will fallback to process each dependency locally.

The following sample code shows how to initialize the `ModelsRepositoryClient` by using a custom repository base URL, in this case using the `raw` URLs from the GitHub API without using the `expanded` form since it's not available in the `raw` endpoint. The `AzureEventSourceListener` is initialized to inspect the HTTP request performed by the client:

```cs
using AzureEventSourceListener listener = AzureEventSourceListener.CreateConsoleLogger();

var client = new ModelsRepositoryClient(
    new Uri("https://raw.githubusercontent.com/Azure/iot-plugandplay-models/main"));

ModelResult model = await client.GetModelAsync(
    "dtmi:com:example:TemperatureController;1", 
    dependencyResolution: ModelDependencyResolution.Enabled);

model.Content.Keys.ToList().ForEach(k => Console.WriteLine(k));
```

There are more samples available in the Azure SDK GitHub repository: [Azure.Iot.ModelsRepository/samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/modelsrepository/Azure.IoT.ModelsRepository/samples).

### Custom store

Solutions can store these model definitions in a local file system, in a public file store, or use a custom implementation.

After you identify the model ID for a new device connection, follow these steps:

1. Retrieve the model definition using the model ID from your custom store.

1. Using the model definition of the connected device, you can enumerate the capabilities of the device.

1. Using the enumerated capabilities of the device, you can enable users to [interact with the device](tutorial-service.md).  

## Next steps

Now that you've learned how to integrate IoT Plug and Play models in an IoT solution, some suggested next steps are:

- [Interact with a device from your solution](tutorial-service.md)
- [IoT Digital Twin REST API](/rest/api/iothub/service/digitaltwin)
- [Azure IoT explorer](../iot/howto-use-iot-explorer.md)
