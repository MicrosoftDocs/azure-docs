---
title: Azure IoT MQ state store
# titleSuffix: Azure IoT MQ
description: Learn about the Azure IoT MQ state store and MQTT5 protocol
author: PatAltimore
ms.author: patricka
ms.topic: concept-article
ms.date: 10/02/2023

#CustomerIntent: As an operator, I want understand how the state store works so that I can use it to store data in Azure IoT MQ.
---

# Azure IoT MQ state store

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

E4K provides a distributed (and can be configured to be highly available) State Store for clients to use. Compared to MQTT retained messages - which only saves the latest message per topic - the key-value store is a built-in date store that is closer to a general purpose database.

It provides the ability to set, get, and delete key/value pairs. The State Store includes declarative security - analogous to MQTT topic security - so clients can be granted fine grained access to keys.

## What’s supported

| Feature | Supported |
|---|:---:|
| Set | ✅ |
| Get | ✅ |
| Delete | ✅ |
| Get Keys | 🔜 |
| Observe | 🔜 |
| Unobserve | 🔜 |

## Using the State Store

The State Store SDK is available as a C# SDK and can be used by an application running both internal and external to the K8S Cluster.

The main functions of the client are:

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

Set a Key/Value pair in the State Store:

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

Get the specific Key from the State Store into the `StateStoreGetResponse` object:

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

Once you're finished, Dispose the `StateStoreClient` object:


```csharp
await stateStoreClient.DisposeAsync().ConfigureAwait(false);
```

## Running the sample

The following sample code connects to the State Store via the MQTT broker and will set, get and then delete a value using the functions defined ealier.

{{< button text="GitHub source" link="https://github.com/microsoft/e4k-playground/tree/main/samples/dss-client-sample" color="secondary" >}}


### Prerequisites

1. An [E4K deployment](/docs/mqtt-broker/deploy/).
1. The [.NET 7.0](https://dotnet.microsoft.com/en-us/download) compiler.

### Steps

1. Configure the sample:

    Edit `Program.cs` and update the `connectionSettings` with the E4K MQTT broker hostname and port.

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

