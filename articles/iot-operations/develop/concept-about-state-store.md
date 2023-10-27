---
title: Azure IoT MQ state store
# titleSuffix: Azure IoT MQ
description: Learn about the Azure IoT MQ state store and MQTT5 protocol
author: PatAltimore
ms.author: patricka
ms.topic: concept-article
ms.date: 10/26/2023

#CustomerIntent: As an operator, I want understand how the state store works so that I can use it to store data in Azure IoT MQ.
---

# Azure IoT MQ state store

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Azure IoT MQ provides a distributed state store for clients to use. It can be configured to be highly available. The key-value store is a built-in date store that's closer to a general purpose database compared to MQTT retained messages that only save the latest message per topic.

It provides the ability to set, get, and delete key value pairs. The state store includes declarative security that's analogous to MQTT topic security. Clients can be granted fine grained access to keys.

Supported features include:

| Feature | Supported |
|---|:---:|
| Set | ✅ |
| Get | ✅ |
| Delete | ✅ |
<!--| Get Keys | 🔜 |
| Observe | 🔜 |
| Unobserve | 🔜 |-->

## Using the state store

The state store SDK is available as a C# SDK and can be used by an application running both internal and external to the Kubernetes cluster.

The following sections list the main functions of the client.

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

Initialize the `StateStoreClient` passing in the MQTT client:

```csharp
StateStoreClient stateStoreClient = new StateStoreClient(mqttClient);
await stateStoreClient.InitializeAsync().ConfigureAwait(false);
```

### Set

Set a Key/Value pair in the state store:

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

Get the specific Key from the state store into the `StateStoreGetResponse` object:

```csharp
StateStoreGetResponse getResponse = 
    await stateStoreClient.GetAsync(stateStoreKey).ConfigureAwait(false);
```

### Delete

Delete the specific Key/Value pair from the state store:

```csharp
StateStoreDeleteResponse deleteResponse =
    await stateStoreClient.DeleteAsync(stateStoreKey).ConfigureAwait(false);
```

### Dispose

Once you're finished, Dispose the `StateStoreClient` object:

```csharp
await stateStoreClient.DisposeAsync().ConfigureAwait(false);
```

## Sample

You can download a sample that demonstrates how to use the state store client from [GitHub](https://github.com/microsoft/e4k-playground/tree/main/samples/dss-client-sample).

The sample code connects to the state store via the MQTT broker and will set, get and then delete a value using the functions defined earlier.

### Prerequisites

1. An [IoT MQ deployment](../deploy/overview-deploy-iot-operations.md).
1. The [.NET 7.0](https://dotnet.microsoft.com/en-us/download) compiler.

### Test the sample

1. Configure the sample:

    Edit `Program.cs` and update the `connectionSettings` with the IoT MQ MQTT broker hostname and port.

1. Build the sample:

    ```bash
    dotnet build
    ```

1. Run and observe the output:

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
