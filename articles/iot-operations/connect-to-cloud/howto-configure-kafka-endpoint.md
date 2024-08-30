---
title: Configure Kafka dataflow endpoints in Azure IoT Operations
description: Learn how to configure dataflow endpoints for Kafka in Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 08/29/2024

#CustomerIntent: As an operator, I want to understand how to
---

# Configure Kafka dataflow endpoints

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Kafka endpoints are used in dataflows to setup bi-directional communication between Azure IoT Operations and Apache Kafka brokers. You can configure the endpoint, Transport Layer Security (TLS), authentication, and other settings.

## Prerequisites

- **Azure IoT Operations**. See [Deploy Azure IoT Operations Preview](../deploy-iot-ops/howto-deploy-iot-operations.md)
- **Dataflow profile**. See [Configure dataflow profile](howto-configure-dataflow-profile.md)

## How to create a Kafka dataflow endpoint

To create a dataflow endpoint for Kafka, you need to specify the Kafka broker host, authentication method, TLS settings, and other settings. You can use the endpoint as a source or destination in a dataflow. When used with Azure Event Hubs, you can use managed identity for authentication which eliminates the need to manage secrets.

### Azure Event Hubs

[Azure Event Hubs is compatible with the Kafka protocol](../../event-hubs/azure-event-hubs-kafka-overview.md) and can be used with dataflows with some limitations.

To configure an Azure Event Hubs, we recommend that you use managed identity for authentication.

1. Create an Azure Event Hubs namespace and a Kafka-enabled Event Hub (one for each Kafka topic).

1. Get the managed identity of the Azure IoT Operations Arc extension.

1. Assign the managed identity to the Event Hubs namespace with the `Azure Event Hubs Data Sender` or `Azure Event Hubs Data Receiver` role.

1. Create the DataflowEndpoint resource. For example:

    ```yaml
    apiVersion: connectivity.iotoperations.azure.com/v1beta1
    kind: DataflowEndpoint
    metadata:
      name: kafka
      namespace: azure-iot-operations
    spec:
      endpointType: Kafka
      kafkaSettings:
        host: <NAMESPACE>.servicebus.windows.net:9093
        authentication:
          method: SystemAssignedManagedIdentity
          systemAssignedManagedIdentitySettings: {}
        tls:
          mode: Enabled
        consumerGroupId: mqConnector
    ```

The Kafka topic, or individual event hub, is configured later when you create the dataflow. The Kafka topic is the destination for the dataflow messages.

#### Use connection string for authentication to Event Hubs

To use connection string for authentication to Event Hubs, update the `authentication` section of the Kafka settings to use the `Sasl` method and configure the `saslSettings` with the `saslType` as `Plain` and the `secretRef` with the name of the secret that contains the connection string.

```yaml
spec:
  kafkaSettings:
    authentication:
      method: Sasl
      saslSettings:
        saslType: Plain
        secretRef: <your token secret name>
    tls:
      mode: Enabled
```

Here, the `secretRef` is the name of the secret that contains the connection string. The secret must be in the same namespace as the Kafka dataflow resource. The secret must have both the username and password as key-value pairs. For example:

```bash
kubectl create secret generic cs-secret -n azure-iot-operations \
  --from-literal=username='$ConnectionString' \
  --from-literal=password='Endpoint=sb://<NAMESPACE>.servicebus.windows.net/;SharedAccessKeyName=<KEY_NAME>;SharedAccessKey=<KEY>'
```
> [!TIP]
> Scoping the connection string to the namespace (as opposed to individual event hubs) allows a dataflow to send and receive messages from multiple different event hubs (thus Kafka topics).

#### Limitations

Azure Event Hubs [doesn't support all the compression types that Kafka supports](../../event-hubs/azure-event-hubs-kafka-overview.md#compression). The following compression types are supported:

- Gzip

Using other compression types might result in errors.

### Other Kafka brokers

To configure a dataflow endpoint for non-Event-Hub Kafka brokers, set the host, TLS, authentication, and other settings as needed. For example:

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: DataflowEndpoint
metadata:
  name: kafka
  namespace: azure-iot-operations
spec:
  endpointType: Kafka
  kafkaSettings:
    host: example.kafka.com:9093
    authentication:
      method: Sasl
      saslSettings:
        saslType: ScramSha256
        secretRef: <your token secret name>
    tls:
      mode: Enabled
    consumerGroupId: mqConnector
```

### Use the endpoint in a dataflow source or destination

Now that you have created the endpoint, you can use it in a dataflow by specifying the endpoint name in the dataflow's source or destination settings. To learn more, see [Create a dataflow](howto-create-dataflow.md).

To customize the Kafka endpoint, you can configure additional settings such as TLS, authentication, and Kafka messaging settings. The following sections describe these settings in detail.

## Available authentication methods

Under `kafkaSettings.authentication`, you can configure the authentication method for the Kafka broker. Supported methods include SASL, X.509, system-assigned managed identity, user-assigned managed identity, and anonymous.

```yaml
kafkaSettings:
  host: example.kafka.com:9093
  authentication:
    method: Sasl
    saslSettings:
      saslType: Plain
      secretRef: <your token secret name>
  # OR
  authentication:
    method: X509Certificate
    x509CertificateSettings:
      secretRef: <your x509 secret name>
  # OR
  authentication:
    method: SystemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings:
      audience: https://<your Event Hubs namespace>.servicebus.windows.net
  # OR
  authentication:
    method: UserAssignedManagedIdentity
    userAssignedManagedIdentitySettings:
      clientId: <id>
      tenantId: <id>
  # OR
  authentication:
    method: Anonymous
    anonymousSettings:
      {}
```

### SASL

To use SASL for authentication, update the `authentication` section of the Kafka settings to use the `Sasl` method and configure the `saslSettings` with the `saslType and the `secretRef` with the name of the secret that contains the SASL token.

```yaml
kafkaSettings:
  authentication:
    method: Sasl
    saslSettings:
      saslType: Plain
      secretRef: <your token secret name>
```

The supported SASL types are:

- `Plain`
- `ScramSha256`
- `ScramSha512`

The secret must be in the same namespace as the Kafka dataflow resource. The secret must have the SASL token as a key-value pair. For example:

```bash
kubectl create secret generic sasl-secret -n azure-iot-operations \
  --from-literal=token='your-sasl-token'
```

### X.509

To use X.509 for authentication, update the `authentication` section of the Kafka settings to use the `X509Certificate` method and configure the `x509CertificateSettings` with the `secretRef` with the name of the secret that contains the X.509 certificate.

```yaml
kafkaSettings:
  authentication:
    method: X509Certificate
    x509CertificateSettings:
      secretRef: <your x509 secret name>
```

The secret must be in the same namespace as the Kafka dataflow resource. use Kubernetes TLS secret containing the public certificate and private key. For example:

```bash
kubectl create secret tls my-tls-secret -n azure-iot-operations \
  --cert=path/to/cert/file \
  --key=path/to/key/file
```

### System-assigned managed identity

To use system-assigned managed identity for authentication, first assign a role to the Azure IoT Operation managed identity that grants permission to send and receive messages from Event Hubs, such as Azure Event Hubs Data Owner or Azure Event Hubs Data Sender/Receiver. To learn more, see [Authenticate an application with Azure Active Directory to access Event Hubs resources](../../event-hubs/authenticate-application.md#built-in-roles-for-azure-event-hubs).

Then, update the `authentication` section of the DataflowEndpoint Kafka settings to use the `SystemAssignedManagedIdentity` method. In most cases, you can set the `systemAssignedManagedIdentitySettings` with an empty object.

```yaml
kafkaSettings:
  authentication:
    method: SystemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings:
      {}
```

This sets the audience to the default value, which is the same as the Event Hubs namespace host value in the form of `https://<NAMESPACE>.servicebus.windows.net`. However, if you need to override the default audience, you can set the `audience` field to the desired value. The audience is the resource that the managed identity is requesting access to. For example:

```yaml
kafkaSettings:
  authentication:
    method: SystemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings:
      audience: <your audience override value>
```

### User-assigned managed identity

TBD

<!-- TODO: Add link to WLIF docs -->

### Anonymous

To use anonymous authentication, update the `authentication` section of the Kafka settings to use the `Anonymous` method.

```yaml
kafkaSettings:
  authentication:
    method: Anonymous
    anonymousSettings:
      {}
```

## TLS settings

Under `kafkaSettings.tls`, you can configure additional settings for the TLS connection to the Kafka broker.

### TLS mode

To enable or disable TLS for the Kafka endpoint, update the `mode` setting in the TLS settings. For example:

```yaml
kafkaSettings:
  tls:
    mode: Enabled
```

The TLS mode can be set to `Enabled` or `Disabled`. If the mode is set to `Enabled`, the dataflow uses a secure connection to the Kafka broker. If the mode is set to `Disabled`, the dataflow uses an insecure connection to the Kafka broker.

### Trusted CA certificate

To configure the trusted CA certificate for the Kafka endpoint, update the `trustedCaCertificateConfigMapRef` setting in the TLS settings. For example:

```yaml
kafkaSettings:
  tls:
    trustedCaCertificateConfigMapRef: <your CA certificate>
```

This ConfigMap should contain the CA certificate in PEM format. The ConfigMap must be in the same namespace as the Kafka dataflow resource. For example:

```bash
kubectl create configmap client-ca-configmap --from-file root_ca.crt -n azure-iot-operations
```

This setting is important if the Kafka broker uses a self-signed certificate or a certificate signed by a custom CA that is not trusted by default.

however, in the case of Azure Event Hubs, the CA certificate is not required because the Event Hubs service uses a certificate signed by a public CA that is trusted by default.

## Kafka messaging settings

Under `kafkaSettings`, you can configure additional settings for the Kafka endpoint.

### Consumer group ID

To configure the consumer group ID for the Kafka endpoint, update the `consumerGroupId` setting in the Kafka settings. For example:

```yaml
spec:
  kafkaSettings:
    consumerGroupId: fromMq
```

The consumer group ID is used to identify the consumer group that the dataflow uses to read messages from the Kafka topic. The consumer group ID must be unique within the Kafka broker.

<!-- TODO: check for accuracy -->

This setting takes effect only if the endpoint is used as a source (i.e. the dataflow is a consumer).

### Compression

To configure the compression type for the Kafka endpoint, update the `compression` setting in the Kafka settings. For example:

```yaml
kafkaSettings:
  compression: Gzip
```

The compression field enables compression for the messages sent to Kafka topics. Compression helps to reduce the network bandwidth and storage space required for data transfer. However, compression also adds some overhead and latency to the process. The supported compression types are listed in table below.

| Value | Description |
| ----- | ----------- |
| `None` | No compression or batching is applied. This is the default value if no compression is specified. |
| `Gzip` | GZIP compression and batching is applied. GZIP is a general-purpose compression algorithm that offers a good balance between compression ratio and speed. This is the only compression method supported by Azure Event Hubs. |
| `Snappy` | Snappy compression and batching is applied. Snappy is a fast compression algorithm that offers moderate compression ratio and speed. |
| `Lz4` | LZ4 compression and batching is applied. LZ4 is a very fast compression algorithm that offers low compression ratio and high speed. |

This setting takes effect only if the endpoint is used as a destination (i.e. the dataflow is a producer).

### Batching

Aside from compression, you can also configure batching for messages before sending them to Kafka topics. Batching allows you to group multiple messages together and compress them as a single unit, which can improve the compression efficiency and reduce the network overhead.

| Field | Description | Required |
| ----- | ----------- | -------- |
| `mode` | Enable batching or not. If not set, the default value is Enabled because Kafka doesn't have a notion of *unbatched* messaging. If set to Disabled, the batching is minimized to create a batch with a single message each time. | No |
| `latencyMs` | The maximum time interval in milliseconds that messages can be buffered before being sent. If this interval is reached, then all buffered messages will be sent as a batch, regardless of how many or how large they are. If not set, the default value is 5. | No |
| `maxMessages` | The maximum number of messages that can be buffered before being sent. If this number is reached, then all buffered messages will be sent as a batch, regardless of how large they are or how long they have been buffered. If not set, the default value is 100000.  | No |
| `maxBytes` | The maximum size in bytes that can be buffered before being sent. If this size is reached, then all buffered messages will be sent as a batch, regardless of how many they are or how long they have been buffered. The default value is 1000000 (1 MB). | No |

An example of using batching is:

```yaml
kafkaSettings:
  batching:
    enabled: true
    latencyMs: 1000
    maxMessages: 100
    maxBytes: 1024
```

This means that messages will be sent either when there are 100 messages in the buffer, or when there are 1024 bytes in the buffer, or when 1000 milliseconds have elapsed since the last send, whichever comes first.

This setting takes effect only if the endpoint is used as a destination (i.e. the dataflow is a producer).

### Partition handling strategy

The partition handling strategy controls how messages are assigned to Kafka partitions when sending them to Kafka topics. Kafka partitions are logical segments of a Kafka topic that enable parallel processing and fault tolerance. Each message in a Kafka topic has a partition and an offset, which are used to identify and order the messages.

This setting takes effect only if the endpoint is used as a destination (i.e. the dataflow is a producer).

<!-- TODO: double check for accuracy -->

By default, a dataflow assigns messages to random partitions, using a round-robin algorithm . However, you can use different strategies to assign messages to partitions based on some criteria, such as the MQTT topic name or an MQTT message property. This can help you to achieve better load balancing, data locality, or message ordering.

| Value | Description |
| ----- | ----------- |
| `Default` | Assigns messages to random partitions, using a round-robin algorithm. This is the default value if no strategy is specified. |
| `Static` | Assigns messages to a fixed partition number that is derived from the instance ID of the dataflow. This means that each dataflow instance sends messages to a different partition. This can help to achieve better load balancing and data locality. |
| `Topic` | Uses the MQTT topic name from the dataflow source as the key for partitioning. This means that messages with the same MQTT topic name will be sent to the same partition. This can help to achieve better message ordering and data locality. |
| `Property` | Uses an MQTT message property from the dataflow source as the key for partitioning. Specify the name of the property in the `partitionKeyProperty` field. This means that messages with the same property value will be sent to the same partition. This can help to achieve better message ordering and data locality based on a custom criterion. |

An example of using partition handling strategy is:

```yaml
kafkaSettings:
  partitionStrategy: Property
  partitionKeyProperty: device-id
```

This means that messages with the same "device-id" property will be sent to the same partition.

### Kafka acknowledgements

Kafka acknowledgements (acks) are used to control the durability and consistency of messages sent to Kafka topics. When a producer sends a message to a Kafka topic, it can request different levels of acknowledgements from the Kafka broker to ensure that the message is successfully written to the topic and replicated across the Kafka cluster.

This setting takes effect only if the endpoint is used as a destination (i.e. the dataflow is a producer).

| Value | Description |
| ----- | ----------- |
| `None` | The dataflow doesn't wait for any acknowledgements from the Kafka broker. This is the fastest but least durable option. |
| `All` | The dataflow waits for the message to be written to the leader partition and all follower partitions. This is the slowest but most durable option. This is also the default option|
| `One` | The dataflow waits for the message to be written to the leader partition and at least one follower partition. |
| `Zero` | The dataflow waits for the message to be written to the leader partition but doesn't wait for any acknowledgements from the followers. This is faster than `One` but less durable. |

<!-- TODO: double check for accuracy -->

An example of using Kafka acknowledgements is:

```yaml
kafkaSettings:
  kafkaAcks: All
```

This means that the dataflow waits for the message to be written to the leader partition and all follower partitions.

### Copy MQTT properties

By default, the copy MQTT properties setting is enabled. These user properties include values such as `subject` that stores the name of the asset sending the message. 

```yaml
kafkaSettings:
  copyMqttProperties: Enabled
```

To disable copying MQTT properties, set the value to `Disabled`.

The following sections describe how MQTT properties are translated to Kafka user headers and vice versa when the setting is enabled.

#### Kafka endpoint is a destination

When a Kafka endpoint as a dataflow destination, all MQTT v5 specification defined properties are translated Kafka user headers. For example, an MQTT v5 message with "Content Type" being forwarded to Kafka translates into the Kafka **user header** `"Content Type":{specifiedValue}`. Similar rules apply to other built-in MQTT properties, defined in the table below.

| MQTT Property | Translated Behavior |
|---------------|----------|
| Payload Format Indicator  | Key: "Payload Format Indicator" <BR> Value: "0" (Payload is bytes) or "1" (Payload is UTF-8)
| Response Topic | Key: "Response Topic" <BR> Value: Copy of Response Topic from original message.
| Message Expiry Interval | Key: "Message Expiry Interval" <BR> Value: UTF-8 representation of number of seconds before message expires. See [Message Expiry Interval property](#the-message-expiry-interval-property) for more details.
| Correlation Data: | Key: "Correlation Data" <BR> Value: Copy of Correlation Data from original message. Note that unlike many of MQTT v5 properties, which are UTF-8 encoded, Correlation Data can be arbitrary data.
| Content Type: | Key: "Content Type" <BR> Value: Copy of Content Type from original message.

MQTT v5 user property key/value pairs ae directly translated to Kafka user headers. If a user header in a message has the same name as a built-in MQTT property (for example, a user header named "Correlation Data") then whether the MQTT v5 specification property value or the user property is forwarded is undefined.

Dataflows never receive these properties from an MQTT Broker. Thus, a dataflow never forwards them:

* Topic Alias
* Subscription Identifiers

##### The Message Expiry Interval property

The [Message Expiry Interval](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901112) specifies how long a message can remain in an MQTT broker before being discarded.

When a dataflow receives an MQTT message with the Message Expiry Interval specified, it:

* Records the time the message was received by .
* Before the message is emitted to the destination, time is subtracted from the message has been queued from the original expiry interval time.
 * If the message has not yet expired (the operation above is > 0), then the message is emitted to the destination and contains the updated Message Expiry Time.
 * If the message has expired (the operation above is <= 0), then the message isn't emitted by the Target.

Examples:

* A dataflow receives an MQTT message with Message Expiry Interval = 3600 seconds. The corresponding destination is temporarily disconnected but is able to reconnect. 1000 seconds pass before this MQTT Message is sent to the Target. In this case, the destination's message has its Message Expiry Interval set as 2600 (3600 - 1000) seconds.
* The dataflow receives an MQTT message with Message Expiry Interval = 3600 seconds. The corresponding destination is temporarily disconnected but is able to reconnect. In this case, however, it takes 4000 seconds to reconnect. The message has expired, and dataflow doesn't forward this message to the destination.

#### Kafka endpoint is a dataflow source

> [!NOTE]
> There's a known issue when using Event Hubs endpoint as a dataflow source where Kafka header gets corrupted as its translated to MQTT. This only happens if using Event Hub though the Event Hub client which uses AMQP under the covers. For for instance "foo"="bar", the "foo" is translated, but the value becomes"\xa1\x03bar".

When a Kafka endpoint is a dataflow source, Kafka user headers are translated to MQTT v5 properties. The following table describes how Kafka user headers are translated to MQTT v5 properties.


| Kafka Header | Translated Behavior |
|---------------|----------|
| Key | Key: "Key" <BR> Value: Copy of the Key from original message. |
| Timestamp | Key: "Timestamp" <BR> Value: UTF-8 encoding of Kafka Timestamp, which is number of milliseconds since Unix epoch.

Kafka user header key/value pairs - provided they are all encoded in UTF-8 - are directly translated into MQTT user key/value properties.

##### UTF-8 / Binary Mismatches

MQTT v5 can only support UTF-8 based properties. If dataflow receives a Kafka message that contains one or more non-UTF-8 headers, dataflow will:

* Remove the offending property or properties.
* Forward the rest of the message on, following the rules described above.

Applications that require binary transfer in Kafka Source headers => MQTT Target properties must first UTF-8 encode them - e.g. via Base64.

##### >=64KB property mismatches

MQTT v5 properties must be smaller than 64 KB. If dataflow receives a Kafka message that contains one or more headers that is >= 64KB, dataflow will:

* Remove the offending property or properties.
* Forward the rest of the message on, following the rules described above.