---
title: Use MQTTnet to develop distributed application workloads
description: Develop distributed applications that talk with MQTT broker using MQTTnet.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-mqtt-broker
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 07/02/2024

#CustomerIntent: As an developer, I want to understand how to use MQTTnet to develop distributed apps that talk with MQTT broker.
---

# Use MQTTnet to develop distributed application workloads that connect to MQTT broker

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

[MQTTnet](https://dotnet.github.io/MQTTnet/) is an open-source, high performance .NET library for MQTT based communication. This article uses a Kubernetes service account token and MQTTnet to connect to MQTT broker. You should use service account tokens to connect in-cluster applications.

## Sample code

The [sample code](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/mqtt-client-dotnet/Program.cs) performs the following steps:

1. Creates an MQTT client using the `MqttFactory` class:

    ```csharp
    var mqttFactory = new MqttFactory();
    var mqttClient = mqttFactory.CreateMqttClient();
    ```

1. The [Kubernetes pod specification](#pod-specification) mounts the service account on the container file system. The contents of the file are read:
##3. The mounted token is used as the password with well-known username `K8S-SAT`:

    ```csharp
    static string sat_auth_file = "/var/run/secrets/tokens/mqtt-client-token";
    ...
    var satToken = File.ReadAllBytes(sat_auth_file);
    ```

1. The MQTT client options are configured using the `MqttClientOptions` class. Using the `MqttClientOptionsBuilder` as advised in the [client](https://github.com/dotnet/MQTTnet/wiki/Client) documentation is the advised way of setting the options:

    ```csharp
    var mqttClientOptions = new MqttClientOptionsBuilder()
        .WithTcpServer(hostname, tcp_port)
        .WithProtocolVersion(MqttProtocolVersion.V500)
        .WithClientId("mqtt-client-dotnet")
        .WithAuthentication("K8S-SAT", satToken);
    ```

5. After setting up the MQTT client options, a connection can be established. The following code shows how to connect with a server. You can replace the `CancellationToken.None` with a valid CancellationToken if needed.

    ```csharp
    var response = await mqttClient.ConnectAsync(mqttClientOptions.Build(), CancellationToken.None);
    ```

6. MQTT messages can be created using the properties directly or using `MqttApplicationMessageBuilder`. This class has overloads that allow dealing with different payload formats. The API of the builder is a fluent API. The following code shows how to compose an application message and publish them to an article called *sampletopic*:

    ```csharp
    var applicationMessage = new MqttApplicationMessageBuilder()
        .WithTopic("sampletopic")
        .WithPayload("samplepayload" + counter++)
        .Build();

    await mqttClient.PublishAsync(applicationMessage, CancellationToken.None);
    ```

## Pod specification

The `serviceAccountName` field in the pod configuration must match the service account associated with the token being used. Also, note the `serviceAccountToken.expirationSeconds` is set to **86400 seconds**, and once it expires, you need to reload the token from disk. This logic isn't implemented in this sample.

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: mqtt-client
  namespace: azure-iot-operations

---
apiVersion: v1
kind: Pod
metadata:
  name: mqtt-client-dotnet
  namespace: azure-iot-operations
spec:
  serviceAccountName: mqtt-client

  volumes:

  # SAT token used to authenticate between the application and the MQTT broker  
  - name: mqtt-client-token
    projected:
      sources:
      - serviceAccountToken:
          path: mqtt-client-token
          audience: aio-mq
          expirationSeconds: 86400

  # Certificate chain for the application to validate the MQTT broker              
  - name: aio-ca-trust-bundle
    configMap:
      name: aio-ca-trust-bundle-test-only

  containers:
  - name: mqtt-client-dotnet
    image: ghcr.io/azure-samples/explore-iot-operations/mqtt-client-dotnet:latest
    volumeMounts:
    - name: mqtt-client-token
      mountPath: /var/run/secrets/tokens/
    - name: aio-ca-trust-bundle
      mountPath: /var/run/certs/aio-mq-ca-cert/
    env:
    - name: hostname
      value: "aio-mq-dmqtt-frontend"
    - name: tcpPort
      value: "8883"
    - name: useTls
      value: "true"
    - name: caFile
      value: "/var/run/certs/aio-mq-ca-cert/ca.crt"
    - name: satAuthFile
      value: "/var/run/secrets/tokens/mqtt-client-token"
```

To run the sample, follow the instructions in its [README](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/mqtt-client-dotnet).

## Related content

- [Publish and subscribe MQTT messages using MQTT broker](../manage-mqtt-broker/overview-iot-mq.md)
- [Develop highly available distributed applications](edge-apps-overview.md)
