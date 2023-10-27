---
title: About Azure IoT MQ state store
# titleSuffix: Azure IoT MQ
description: Learn about the Azure IoT MQ state store capabilities and how to start using the state store. 
author: timlt
ms.author: timlt
# ms.subservice: mq
ms.topic: concept-article
ms.date: 10/26/2023

#CustomerIntent: As a developer or operator, I want understand how the state store works so that I can use it to store data in Azure IoT MQ.
---

# Azure IoT MQ state store

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this article, you learn the basic capabilities of Azure IoT MQ Preview state store, and you run a sample that shows how it works. Azure IoT MQ provides a distributed state store for clients to use. To compare the MQ state store to a related solution, MQTT retained messages only save the latest message per topic. In contrast, the MQ state store is a key-value store that has more capabilities, similar to a general purpose database. 

The MQ state store provides several core capabilities:

- The ability to set, get, and delete key/value pairs
- Declarative security that is similar to MQTT topic security. Declarative security lets you grant clients fine-grained access to keys.
- Can be configured to be highly available

## Prerequisites

1. An [MQ deployement](../deploy/overview-deploy-iot-operations.md).
1. The [.NET 7.0](https://dotnet.microsoft.com/en-us/download) compiler.

## Features supported
The following features are supported for the Azure IoT MQ Preview state store:

| Feature | Supported |
|---|:---:|
| Set | ✅ |
| Get | ✅ |
| Delete | ✅ |

## Using the state store

The MQ state store is available as a C# SDK and you use it as an application that runs internal or external to your K8S Cluster.

The main functions to call in the MQTT client are shown in the following sections.

### Create the MQTT client

Create the MQTT client using the `MQTTFactory`.

```csharp
IMqttClient mqttClient = new MqttFactory().CreateMqttClient();
var connectionSettings = new MqttClientOptionsBuilder()
        .WithTcpServer("localhost", 1883)
        .WithClientId("dss_sample")
        .WithProtocolVersion(MqttProtocolVersion.V500)
        .Build();
```

### Initialize

Initialize the `StateStoreClient` by passing in the MQTT client. 

```csharp
StateStoreClient stateStoreClient = new StateStoreClient(mqttClient);
await stateStoreClient.InitializeAsync().ConfigureAwait(false);
```

### Set

Set a key-value pair in the state store.

```csharp
var stateStoreKey = new StateStoreKey("someKey");
var stateStoreValue = new StateStoreValue("someValue");

StateStoreSetResponse setResponse = 
    await stateStoreClient.SetAsync(
        stateStoreKey, 
        stateStoreValue, 
        new HybridLogicalClock()).ConfigureAwait(false);
```

### Get

Get the specific key from the state store into the `StateStoreGetResponse` object. 

```csharp
StateStoreGetResponse getResponse = 
    await stateStoreClient.GetAsync(stateStoreKey).ConfigureAwait(false);
```

### Delete

Delete the specific Key/Value pair from the State Store:

```csharp
StateStoreDeleteResponse deleteResponse =
    await stateStoreClient.DeleteAsync(stateStoreKey).ConfigureAwait(false);
```

### Dispose

After you're finished, dispose of the `StateStoreClient` object. 


```csharp
await stateStoreClient.DisposeAsync().ConfigureAwait(false);
```

## Run the sample

The following sample code connects to the MQ state store via the MQTT broker. The sample uses the previously defined function to set a string value, get the value, and then deletes the value. 

https://github.com/microsoft/e4k-playground/tree/main/samples/quickstart-sample


### Steps

1. Configure the sample: 

    Edit the `Program.cs` file and update the `connectionSettings` with the E4K MQTT broker hostname and port.

1. Build the sample by running the following command: 

    ```bash
    dotnet build
    ```

1. Run the code and observe the output:

    ```bash
    dotnet run
    ```

    ```output
    Successfully set key someKey with value someValue
    Current value of key someKey in the state store is someValue
    Successfully deleted key someKey from the state store
    ```

## Related content

- [Azure IoT MQ overview](../manage-mqtt-connectivity/overview-iot-mq.md)
- [Develop with Azure IoT MQ](concept-about-distributed-apps.md)
