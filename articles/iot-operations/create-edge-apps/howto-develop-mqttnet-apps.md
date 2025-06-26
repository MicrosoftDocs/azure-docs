---
title: Develop distributed application workloads with MQTTnet
description: Learn how to develop distributed applications using MQTTnet to connect with MQTT broker.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-mqtt-broker
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 05/07/2025

#CustomerIntent: As an developer, I want to understand how to use MQTTnet to develop distributed apps that talk with MQTT broker.
ms.service: azure-iot-operations
---

# Develop distributed application workloads with MQTTnet

[MQTTnet](https://dotnet.github.io/MQTTnet/) is an open-source, high performance .NET library for MQTT based communication. This article explains how to use a Kubernetes service account token and MQTTnet to connect to MQTT broker. Use service account tokens to connect in-cluster applications.

## Sample code

The [sample code](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/mqtt-client-dotnet/Program.cs) does the following:

1. Creates an MQTT client using the `MqttFactory` class:

    ```csharp
    var mqttFactory = new MqttFactory();
    var mqttClient = mqttFactory.CreateMqttClient();
    ```

1. The [Kubernetes pod specification](#pod-specification) mounts the service account on the container file system, and the file contents are read. The mounted token is used as the password with the well known username `K8S-SAT`:

    ```csharp
    static string sat_auth_file = "/var/run/secrets/tokens/mqtt-client-token";
    ...
    var satToken = File.ReadAllBytes(sat_auth_file);
    ```

1. The MQTT client options are configured using the `MqttClientOptions` class. The `MqttClientOptionsBuilder`, as recommended in the [client](https://github.com/dotnet/MQTTnet/wiki/Client) documentation, is the preferred way to set the options:

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

1. Create MQTT messages using properties directly or with `MqttApplicationMessageBuilder`. This class provides overloads for handling different payload formats. The builder API uses a fluent design. The following code shows how to compose an application message and publish it to a topic called *sampletopic*:

    ```csharp
    var applicationMessage = new MqttApplicationMessageBuilder()
        .WithTopic("sampletopic")
        .WithPayload("samplepayload" + counter++)
        .Build();

    await mqttClient.PublishAsync(applicationMessage, CancellationToken.None);
    ```

## Pod specification

The `serviceAccountName` field in the pod configuration must match the service account associated with the token being used. Also, note that the `serviceAccountToken.expirationSeconds` is set to **86400 seconds**, and when it expires, you need to reload the token from disk. This logic isn't implemented in this sample.

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

  # The SAT token authenticates the application with the MQTT broker  
  - name: mqtt-client-token
    projected:
      sources:
      - serviceAccountToken:
          path: mqtt-client-token
          audience: aio-internal
          expirationSeconds: 86400

  # Certificate chain for the application to validate the MQTT broker              
  - name: aio-ca-trust-bundle
    configMap:
      name: azure-iot-operations-aio-ca-trust-bundle

  containers:
  - name: mqtt-client-dotnet
    image: ghcr.io/azure-samples/explore-iot-operations/mqtt-client-dotnet:latest
    volumeMounts:
    - name: mqtt-client-token
      mountPath: /var/run/secrets/tokens/
    - name: aio-ca-trust-bundle
      mountPath: /var/run/certs/aio-internal-ca-cert/
    env:
    - name: hostname
      value: "aio-broker"
    - name: tcpPort
      value: "18883"
    - name: useTls
      value: "true"
    - name: caFile
      value: "/var/run/certs/aio-internal-ca-cert/ca.crt"
    - name: satAuthFile
      value: "/var/run/secrets/tokens/mqtt-client-token"
```

Run the sample by following the instructions in its [README](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/mqtt-client-dotnet).

## Related content

- [Publish and subscribe MQTT messages using MQTT broker](../manage-mqtt-broker/overview-broker.md)
- [Develop highly available distributed applications](edge-apps-overview.md)
