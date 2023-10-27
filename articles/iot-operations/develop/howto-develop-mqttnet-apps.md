---
title: Use MQTTnet to develop distributed application workloads
# titleSuffix: Azure IoT MQ
description: Develop distributed applications that talk with Azure IoT MQ using MQTTnet.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.date: 10/26/2023

#CustomerIntent: As an developer, I want to understand how to use MQTTnet to develop distributed apps that talk with Azure IoT MQ.
---


# Use MQTTnet to develop distributed application workloads

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

[MQTTnet](https://dotnet.github.io/MQTTnet/) is an open-source, high performance .NET library for MQTT based communication. This article uses a Kubernetes service account token to connect to Azure IoT MQ's MQTT broker using MQTTnet. You should use service account tokens to connect to in-cluster clients.

## Sample

The [sample code](https://github.com/microsoft/e4k-playground/blob/dot-net/samples/dotnet-client/Program.cs) does the following -

Creates an MQTT client using the `MQTTFactory` class:

```csharp
# Create a new MQTT client.
var mqttFactory = new MqttFactory();
var mqttClient = mqttFactory.CreateMqttClient();
```

The following Kubernetes pod specification mounts the service account token to the specified path on the container file system. The mounted token is used as the password with well-known username `$sat`:

```csharp
...
    string token_path = "/var/run/secrets/tokens/mqtt-client-token";
    ...

    static async Task<int> MainAsync()
    {
        ...

        //Read SAT Token
        var satToken = File.ReadAllText(token_path);
...
```

All options for the MQTT client are bundled in the class named `MqttClientOptions`. It's possible to fill options manually in code via the properties but you should use the `MqttClientOptionsBuilder` as advised in the [client](https://github.com/dotnet/MQTTnet/wiki/Client) documentation. The following code shows how to use the builder with the following options:

```csharp
# Create TCP based options using the builder amd connect to broker
 var mqttClientOptions = new MqttClientOptionsBuilder()
                .WithTcpServer(broker, 1883)
                .WithProtocolVersion(MqttProtocolVersion.V500)
                .WithClientId("sampleid")
                .WithCredentials("$sat", satToken )
                .Build();
```

After setting up the MQTT client options, a connection can be established. The following code shows how to connect with a server. The *CancellationToken.None* can be replaced by a valid *CancellationToken*, if needed.

```csharp
 var response = await mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);
```

MQTT messages can be created using the properties directly or via using `MqttApplicationMessageBuilder`. This class has some useful overloads that allow dealing with different payload formats easily. The API of the builder is a fluent API. The following code shows how to compose an application message and publish them to a topic called `sampletopic`:

```csharp
 var applicationMessage = new MqttApplicationMessageBuilder()
                    .WithTopic("sampletopic")
                    .WithPayload("samplepayload" + counter)
                    .Build();

                    await mqttClient.PublishAsync(applicationMessage, CancellationToken.None);
                    Console.WriteLine("The MQTT client published a message.");
```

### Pod specification

The full pod specification is available in the [sample](https://github.com/microsoft/e4k-playground/blob/main/samples/dotnet-client/deploy/pod.yaml). The important sections are highlighted in this section.

The `serviceAccountName` field in the pod configuration must match the service account associated with the token being used. Also, note the `serviceAccountToken.expirationSeconds` is set to **86400 seconds**, and once it expires, you need to reload the token from disk. This logic isn't currently implemented in the sample.

```yaml {hl_lines=[8,10,11,12,13,14,15,16,20,21,22]}
apiVersion: v1
kind: Pod
metadata:
  name: publisherclient
  labels:
    app: publisher
spec:
  serviceAccountName: mqtt-client
  volumes: 
    - name: mqtt-client-token
      projected:
        sources:
        - serviceAccountToken:
            path: mqtt-client-token
            audience: azedge-dmqtt
            expirationSeconds: 86400
  containers:
    - name: publisherclient
      image: alicesprings.azurecr.io/dotnetmqttsample
      volumeMounts:
        - name: mqtt-client-token
          mountPath: /var/run/secrets/tokens
      imagePullPolicy: IfNotPresent
  restartPolicy: Never
```

The token is mounted into the container at the path specified in `containers[].volumeMount.mountPath`

To run the sample, follow the instructions in its [README](https://github.com/microsoft/e4k-playground/blob/main/samples/dotnet-client/README.md).

## Related content

- [Azure IoT MQ overview](../manage-mqtt-connectivity/overview-iot-mq.md)
- [Develop with Azure IoT MQ](concept-about-distributed-apps.md)