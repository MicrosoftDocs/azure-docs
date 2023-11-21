---
title: Use MQTTnet to develop distributed application workloads
titleSuffix: Azure IoT MQ
description: Develop distributed applications that talk with Azure IoT MQ using MQTTnet.
author: PatAltimore
ms.author: patricka
ms.subservice: mq
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 11/15/2023

#CustomerIntent: As an developer, I want to understand how to use MQTTnet to develop distributed apps that talk with Azure IoT MQ.
---

# Use MQTTnet to develop distributed application workloads

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

[MQTTnet](https://dotnet.github.io/MQTTnet/) is an open-source, high performance .NET library for MQTT based communication. This article uses a Kubernetes service account token to connect to Azure IoT MQ's MQTT broker using MQTTnet. You should use service account tokens to connect to in-cluster clients.

## Sample code

The [sample code](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/mqtt-client-dotnet/Program.cs) performs the following steps:

1. Creates an MQTT client using the `MQTTFactory` class:

    ```csharp
    var mqttFactory = new MqttFactory();
    var mqttClient = mqttFactory.CreateMqttClient();
    ```

1. The following Kubernetes pod specification mounts the service account token to the specified path on the container file system. The mounted token is used as the password with well-known username `$sat`:

    ```csharp
    string token_path = "/var/run/secrets/tokens/mqtt-client-token";
    ...

    static async Task<int> MainAsync()
    {
        ...

        // Read SAT Token
        var satToken = File.ReadAllText(token_path);
    ```

1. All options for the MQTT client are bundled in the class named `MqttClientOptions`. It's possible to fill options manually in code via the properties but you should use the `MqttClientOptionsBuilder` as advised in the [client](https://github.com/dotnet/MQTTnet/wiki/Client) documentation. The following code shows how to use the builder with the following options:

    ```csharp
    # Create TCP based options using the builder amd connect to broker
    var mqttClientOptions = new MqttClientOptionsBuilder()
        .WithTcpServer(broker, 1883)
        .WithProtocolVersion(MqttProtocolVersion.V500)
        .WithClientId("sampleid")
        .WithCredentials("$sat", satToken)
        .Build();
    ```

1. After setting up the MQTT client options, a connection can be established. The following code shows how to connect with a server. You can replace the *CancellationToken.None* with a valid *CancellationToken*, if needed.

    ```csharp
    var response = await mqttClient.ConnectAsync(mqttClientOptions, CancellationToken.None);
    ```

1. MQTT messages can be created using the properties directly or via using `MqttApplicationMessageBuilder`. This class has some useful overloads that allow dealing with different payload formats. The API of the builder is a fluent API. The following code shows how to compose an application message and publish them to a topic called *sampletopic*:

    ```csharp
    var applicationMessage = new MqttApplicationMessageBuilder()
        .WithTopic("sampletopic")
        .WithPayload("samplepayload" + counter++)
        .Build();

    await mqttClient.PublishAsync(applicationMessage, CancellationToken.None);
    Console.WriteLine("The MQTT client published a message.");
    ```

## Pod specification

The `serviceAccountName` field in the pod configuration must match the service account associated with the token being used. Also, note the `serviceAccountToken.expirationSeconds` is set to **86400 seconds**, and once it expires, you need to reload the token from disk. This logic isn't currently implemented in the sample.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mqtt-client-dotnet
  labels:
    app: publisher
spec:
  serviceAccountName: mqtt-client

  volumes: 
    # SAT token used to authenticate between the application and the MQTT broker
    - name: mqtt-client-token
      projected:
        sources:
          - serviceAccountToken:
              path: mqtt-client-token
              audience: aio-mq-dmqtt
              expirationSeconds: 86400
    
    # Certificate chain for the application to validate the MQTT broker    
    - name: aio-mq-ca-cert-chain
      configMap:
        name: aio-mq-ca-cert-chain

  containers:
    - name: mqtt-client-dotnet
      image: ghcr.io/azure-samples/explore-iot-operations/mqtt-client-dotnet:latest
      imagePullPolicy: IfNotPresent
      volumeMounts:
        - name: mqtt-client-token
          mountPath: /var/run/secrets/tokens
        - name: aio-mq-ca-cert-chain
          mountPath: /certs/aio-mq-ca-cert/      
      env:
        - name: IOT_MQ_HOST_NAME
          value: "aio-mq-dmqtt-frontend"
        - name: IOT_MQ_PORT
          value: "8883"
        - name: IOT_MQ_TLS_ENABLED
          value: "true"
```

The token is mounted into the container at the path specified in `containers[].volumeMount.mountPath`

To run the sample, follow the instructions in its [README](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/mqtt-client-dotnet).

## Related content

- [Azure IoT MQ overview](../manage-mqtt-connectivity/overview-iot-mq.md)
- [Develop with Azure IoT MQ](concept-about-distributed-apps.md)
