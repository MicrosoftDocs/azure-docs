---
title: Send and receive messages between Azure IoT MQ and Kafka
# titleSuffix: Azure IoT MQ
description: 
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.date: 10/30/2023

#CustomerIntent: As an operator, I want to understand 
---


# Send and receive messages between Azure IoT MQ and Kafka

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]


Cloud connector pushes messages from local E4K's MQTT broker to a cloud endpoint, and similarly pulls messages the other way. Since [Azure Event Hub supports Kafka API](/azure/event-hubs/event-hubs-for-kafka-ecosystem-overview), it's compatible with some restrictions.

## What's supported

| Feature | Supported |
| --- | --- |
| Sink to Kafka deployment or Azure Event Hub's Kafka endpoint | Supported |
| Bidirectional communication | Supported |
| Checkpointing offset in Kafka | Supported |
| Stops sending messages when offline | Supported |
| High availability | Supported |
| Ability to preserve MQTT topic information | Supported |
| Wildcard subscription support on MQTT | Supported |
| Store and forward when reconnect | Supported |
| Kafka topic with >1 partitions | Supported |
| Managed identity auth for Event Hub | Supported |
| Support for payload > 1MB | Supported |

## Configure Event Hub connector via Kafka endpoint

By default, the connector isn't installed with E4k. It must be explicitly enabled with topic mapping and authentication credentials specified. Follow these steps to enable bidirectional communication between E4K and Azure Event Hub through its Kafka endpoint.

1. [Create an Event Hubs namespace](/azure/event-hubs/event-hubs-create#create-an-event-hubs-namespace).

1. [Create an event hub](/azure/event-hubs/event-hubs-create#create-an-event-hub) for each Kafka topic.

1. [Get the connection string to the namespace](/azure/event-hubs/event-hubs-get-connection-string#connection-string-for-a-namespace). Scoping the connection string to the namespace (as opposed to individual event hubs) allows E4K to send and receive messages from multiple different event hubs (thus Kafka topics).

1. Create a Kubernetes secret with the full connection string as the password.

    ```bash
    kubectl create secret generic cs-secret \
        --from-literal=username='$ConnectionString' \
        --from-literal=password='Endpoint=sb://<NAMESPACE>.servicebus.windows.net/;SharedAccessKeyName=<KEY_NAME>;SharedAccessKey=<KEY>'
    ```

1. Create a YAML file that defines the [KafkaConnector](#kafkaconnector) resource. You can use the YAML provided as an example, but make sure to change the `endpoint` to match your event hub.

1. Create a YAML file to define the [KafkaConnectorTopicMap](#kafkaconnectortopicmap) resource. 

1. Apply the KafkaConnector and KafkaConnectorTopicMap resources to your Kubernetes cluster using `kubectl apply -f kafka-connector.yaml`.

## KafkaConnector

The KafkaConnector custom resource (CR) allows you to configure a Kafka connector that can communicate a Kafka host and Event Hubs. The Kafka connector can transfer data between MQTT topics and Kafka topics, using the Event Hubs as a Kafka-compatible endpoint.

The following example shows a KafkaConnector CR that connects to an Event Hubs endpoint using SASL plain authentication:

```yaml
apiVersion: mq.iotoperations.azure.com/v1beta1
kind: KafkaConnector
metadata:
  name: my-eh-connector
  namespace: <SAME NAMESPACE AS BROKER> # For example "{{% namespace %}}"
spec:
  image:
    pullPolicy: IfNotPresent
    repository: e4kpreview.azurecr.io/kafka
    tag: {{% version %}}
  instances: 2
  clientIdPrefix: my-prefix
  kafkaConnection:
    # Port 9093 is Event Hub's Kakfa endpoint
    # Supports bootstrap server syntax
    endpoint: <NAMESPACE>.servicebus.windows.net:9093
    tls:
      tlsEnabled: true
      # caConfigMap: not-required-for-eh
    authentication:
      enabled: true
      authType:
        sasl:
          saslType: plain
          secretName: cs-secret
  ## Uncomment to customize local broker connection
  # localBrokerConnection:
  #   endpoint: "aio-mq-dmqtt-frontend:1883"
  #   tls:
  #     tlsEnabled: false
  #   authentication:
  #     kubernetes: {}
```

The following table describes the fields in the KafkaConnector CR:

| Field | Description | Required |
| ----- | ----------- | -------- |
| image | The image of the Kafka connector. You can specify the `pullPolicy`, `repository`, and `tag` of the image. Default values are shown in example above. | Yes |
| instances | The number of instances of the Kafka connector to run. | Yes |
| clientIdPrefix | The string to prepend to a client ID used by the connector. | No |
| kafkaConnection | The connection details of the Event Hubs endpoint. See [Kafka Connection](#kafka-connection). | Yes |
| localBrokerConnection | The connection details of the local broker that overrides the default broker connection. See [Manage local broker connection](#manage-local-broker-connection). | No |
| logLevel | The log level of the Kafka connector. Possible values are: "trace", "debug", "info", "warn", "error", or "fatal". Default is "warn". | No |

### Kafka connection

The `kafkaConnection` field defines the connection details of the Kafka endpoint.

| Field | Description | Required |
| ----- | ----------- | -------- |
| endpoint | The host and port of the Event Hubs endpoint. The port is typically 9093. You can specify multiple endpoints separated by commas to use [bootstrap servers](https://docs.confluent.io/platform/current/kafka-mqtt/configuration_options.html#stream) syntax. | Yes |
| tls | The configuration for TLS encryption. See [TLS](#tls). | Yes |
| authentication | The configuration for authentication. See [Authentication](#authentication). | No |

#### TLS

The `tls` field enables TLS encryption for the connection and optionally specifies a CA config map.

| Field | Description | Required |
| ----- | ----------- | -------- |
| tlsEnabled | A boolean value that indicates whether TLS encryption is enabled or not. It must be set to true for Event Hubs communication. | Yes |
| caConfigMap | The name of the config map that contains the CA certificate for verifying the server's identity. This field is not required for Event Hubs communication, as Event Hubs uses well-known CAs that are trusted by default. However, you can use this field if you want to use a custom CA certificate. | No |

When specifying a trusted CA is required, create a ConfigMap containing the public potion of the CA in PEM format, and specify the name in the `caConfigMap` property.

```bash
kubectl create configmap ca-pem --from-file path/to/ca.pem
```

#### Authentication

The authentication field supports different types of authentication methods, such as SASL, X509, or managed identity.

| Field | Description | Required |
| ----- | ----------- | -------- |
| enabled | A boolean value that indicates whether authentication is enabled or not. | Yes |
| authType | A field containing the authentication type used. See [Authentication Type](#authentication-type)

##### Authentication Type

| Field | Description | Required |
| ----- | ----------- | -------- |
| sasl | The configuration for SASL authentication. Specify the `saslType` which can be "plain", "scram-sha-256", or "scram-sha-512", as well as the `secretName` to reference the Kubernetes secret containing the username and password. | Yes, if using SASL authentication |
| x509 | The configuration for X509 authentication. Specify the `secretName` field. The `secretName` field is the name of the secret that contains the client certificate and the client key in PEM format, stored as a TLS secret. | Yes, if using X509 authentication |
| systemAssignedManagedIdentity | The configuration for managed identity authentication. Specify the audience for the token request, which must match the Event Hub namespace (`https://<NAMESPACE>.servicebus.windows.net`) [because the connector is a Kafka client](/azure/event-hubs/authenticate-application). A system-assigned managed identity is automatically created and assigned to the connector when it's enabled. | Yes, if using managed identity authentication |

For Event Hub, use plain SASL and `$ConnectionString` as the username and the full connection string as the password.

```bash
kubectl create secret generic cs-secret \
  --from-literal=username='$ConnectionString' \
  --from-literal=password='Endpoint=sb://<NAMESPACE>.servicebus.windows.net/;SharedAccessKeyName=<KEY_NAME>;SharedAccessKey=<KEY>'
```

For X.509, use Kubernetes TLS secret containing the public certificate and private key.

```bash
kubectl create secret tls my-tls-secret \
  --cert=path/to/cert/file \
  --key=path/to/key/file
```

To use managed identity, specify it as the only method under authentication. You also need to assign a role to the managed identity that grants permission to send and receive messages from Event Hubs, such as Azure Event Hubs Data Owner or Azure Event Hubs Data Sender/Receiver. To learn more, see [Authenticate an application with Azure Active Directory to access Event Hubs resources](/azure/event-hubs/authenticate-application#built-in-roles-for-azure-event-hubs).

```yaml
authentication:
  enabled: true
  authType:
    systemAssignedManagedIdentity:
      audience: https://<NAMESPACE>.servicebus.windows.net
```

### Manage local broker connection

Like MQTT bridge, the Event Hub connector acts as a client to the E4K MQTT broker. So if you've customized the listener port and/or authentication of your E4K MQTT broker, override the local MQTT connection configuration for the Event Hub connector as well. To learn more, see [MQTT bridge local broker connection](/docs/cloud-connectors/mqtt-bridge/#local-broker-connection).

## KafkaConnectorTopicMap

The KafkaConnectorTopicMap custom resource (CR) allows you to define the mapping between MQTT topics and Kafka topics for bi-directional data transfer. Specify a reference to a KafkaConnector CR and a list of routes. Each route can be either a MQTT to Kafka route or a Kafka to MQTT route. For example:

```yaml
apiVersion: mq.iotoperations.azure.com/v1beta1
kind: KafkaConnectorTopicMap
metadata:
  name: my-eh-topic-map
  namespace: <SAME NAMESPACE AS BROKER> # For example "{{% namespace %}}"
spec:
  kafkaConnectorRef: my-eh-connector
  compression: snappy
  batching:
    enabled: true
    latencyMs: 1000
    maxMessages: 100
    maxBytes: 1024
  partitionStrategy: property
  partitionKeyProperty: device-id
  copyMqttProperties: true
  routes:
    # Subscribe from MQTT topic "temperature-alerts/#" and send to Kafka topic "receiving-event-hub"
    - mqttToKafka:
        name: "route1"
        mqttTopic: temperature-alerts/#
        kafkaTopic: receiving-event-hub
        kafkaAcks: one
        qos: 1
        sharedSubscription:
          groupName: group1
          groupMinimumShareNumber: 3
    # Pull from kafka topic "sending-event-hub" and publish to MQTT topic "heater-commands"
    - kafkaToMqtt:
        name: "route2"
        consumerGroupId: e4kconnector
        kafkaTopic: sending-event-hub
        mqttTopic: heater-commands
        qos: 0

```

The following table describes the fields in the KafkaConnectorTopicMap CR:

| Field | Description | Required |
| ----- | ----------- | -------- |
| kafkaConnectorRef | The name of the KafkaConnector CR that this topic map belongs to. | Yes |
| compression | The configuration for compression for the messages sent to Kafka topics. See [Compression](#compression). | No |
| batching | The configuration for batching for the messages sent to Kafka topics. See [Batching](#batching). | No |
| partitionStrategy | The strategy for handling Kafka partitions when sending messages to Kafka topics. See [Partition handling strategy](#partition-handling-strategy). | No |
| copyMqttProperties | Boolean value to control if MQTT system and user properties are copied to the Kafka message header. User properties are copied as-is. Some transformation is done with system properties. Defaults to false. | No |
| routes | A list of routes for data transfer between MQTT topics and Kafka topics. Each route can have either a `mqttToKafka` or a `kafkaToMqtt` field, depending on the direction of data transfer. See [Routes](#routes). | Yes |

### Compression

The compression field enables compression for the messages sent to Kafka topics. Compression helps to reduce the network bandwidth and storage space required for data transfer. However, compression also adds some overhead and latency to the process. The supported compression types are listed in table below.

| Value | Description |
| ----- | ----------- |
| none | No compression or batching is applied. This is the default value if no compression is specified. |
| gzip | GZIP compression and batching is applied. GZIP is a general-purpose compression algorithm that offers a good balance between compression ratio and speed. |
| snappy | Snappy compression and batching is applied. Snappy is a fast compression algorithm that offers moderate compression ratio and speed. |
| lz4 | LZ4 compression and batching is applied. LZ4 is a very fast compression algorithm that offers low compression ratio and high speed. |

### Batching

Aside from compression, you can also configure batching for messages before sending them to Kafka topics. Batching allows you to group multiple messages together and compress them as a single unit, which can improve the compression efficiency and reduce the network overhead.

| Field | Description | Required |
| ----- | ----------- | -------- |
| enabled | A boolean value that indicates whether batching is enabled or not. If not set, the default value is false. | Yes |
| latencyMs | The maximum time interval in milliseconds that messages can be buffered before being sent. If this interval is reached, then all buffered messages will be sent as a batch, regardless of how many or how large they are. If not set, the default value is 5. | No |
| maxMessages | The maximum number of messages that can be buffered before being sent. If this number is reached, then all buffered messages are sent as a batch, regardless of how large they are or how long they have been buffered. If not set, the default value is 100000.  | No |
| maxBytes | The maximum size in bytes that can be buffered before being sent. If this size is reached, then all buffered messages are sent as a batch, regardless of how many they are or how long they have been buffered. The default value is 1000000 (1 MB). | No |

An example of using batching is:

```yaml
batching:
  enabled: true
  latencyMs: 1000
  maxMessages: 100
  maxBytes: 1024
```

This means that messages are sent either when there are 100 messages in the buffer, or when there are 1024 bytes in the buffer, or when 1000 milliseconds have elapsed since the last send, whichever comes first.

### Partition handling strategy

The partition handling strategy is a feature that allows you to control how messages are assigned to Kafka partitions when sending them to Kafka topics. Kafka partitions are logical segments of a Kafka topic that enable parallel processing and fault tolerance. Each message in a Kafka topic has a partition and an offset, which are used to identify and order the messages.

By default, the Kafka connector assigns messages to random partitions, using a round-robin (?)algorithm. However, you can use different strategies to assign messages to partitions based on some criteria, such as the MQTT topic name or an MQTT message property. This can help you to achieve better load balancing, data locality, or message ordering.

| Value | Description |
| ----- | ----------- |
| default | Assigns messages to random partitions, using a round-robin algorithm. This is the default value if no strategy is specified. |
| static | Assigns messages to a fixed partition number that is derived from the instance ID of the connector. This means that each connector instance will send messages to a different partition. This can help to achieve better load balancing and data locality. |
| topic | Uses the MQTT topic name as the key for partitioning. This means that messages with the same MQTT topic name will be sent to the same partition. This can help to achieve better message ordering and data locality. |
| property | Uses an MQTT message property as the key for partitioning. Specify the name of the property in the `partitionKeyProperty` field. This means that messages with the same property value will be sent to the same partition. This can help to achieve better message ordering and data locality based on a custom criterion. |

An example of using partition handling strategy is:

```yaml
partitionStrategy: property
partitionKeyProperty: device-id
```

This means that messages with the same "device-id" property will be sent to the same partition.

### Routes

The routes field defines a list of routes for data transfer between MQTT topics and Kafka topics. Each route can have either a `mqttToKafka` or a `kafkaToMqtt` field, depending on the direction of data transfer.

#### MQTT to Kafka

The `mqttToKafka` field defines a route that transfers data from an MQTT topic to a Kafka topic.

| Field | Description | Required |
| ----- | ----------- | -------- |
| name | Unique name for the route. | Yes |
| mqttTopic | The MQTT topic to subscribe from. You can use wildcard characters (`#` and `+`) to match multiple topics. | Yes |
| kafkaTopic | The Kafka topic to send to. | Yes |
| kafkaAcks | The number of acknowledgements the connector requires from the Kafka endpoint. Possible values are: `zero` , `one` (default), or `all`. | No |
| qos | The quality of service (QoS) level for the MQTT topic subscription. Possible values are: 0 or 1 (default). QoS 2 is currently not supported. | No |
| sharedSubscription | The configuration for using shared subscriptions for MQTT topics. Specify the `groupName`, which is a unique identifier for a group of subscribers, and the `groupMinimumShareNumber`, which is the number of subscribers in a group that will receive messages from a topic. For example, if groupName is "group1" and groupMinimumShareNumber is 3, then the connector creates 3 subscribers with the same group name to receive messages from a topic. This feature allows you to distribute messages among multiple subscribers without losing any messages or creating duplicates. | No |

An example of using `mqttToKafka` route:

```yaml
mqttToKafka:
  mqttTopic: temperature-alerts/#
  kafkaTopic: receiving-event-hub
  kafkaAcks: one
  qos: 1
  sharedSubscription:
    groupName: group1
    groupMinimumShareNumber: 3
```

This means that messages from MQTT topics that match "temperature-alerts/#" will be sent to Kafka topic "receiving-event-hub" with QoS equivalent 1 and shared subscription group "group1" with share number 3.

#### Kafka to MQTT

The `kafkaToMqtt` field defines a route that transfers data from a Kafka topic to an MQTT topic.

| Field | Description | Required |
| ----- | ----------- | -------- |
| name | Unique name for the route. | Yes |
| kafkaTopic | The Kafka topic to pull from. | Yes |
| mqttTopic | The MQTT topic to publish to. | Yes |
| consumerGroupId | The prefix of the consumer group ID for each Kafka to MQTT route. If not set, the consumer group ID is set to the same as the route name. | No |
| qos | The quality of service (QoS) level for the messages published to the MQTT topic. Possible values are 0 or 1 (default). QoS 2 is currently not supported. If QoS is set to 1, the connector publishes the message to the MQTT topic and then waits for the ack before commits the message back to Kafka. For QoS 0, the connector commits back immediately without MQTT ack. | No |

An example of using `kafkaToMqtt` route:

```yaml
kafkaToMqtt:
  kafkaTopic: sending-event-hub
  mqttTopic: heater-commands
  qos: 0
```

This means that messages from Kafka topic "sending-event-hub" will be published to MQTT topic "heater-commands" with QoS level 0.

### Event hub name must match Kafka topic

Each individual event hub (not the namespace) must be named exactly the same as the intended Kafka topic specified in the routes (and the connection string `EntityPath` if connection string is scoped to one event hub). This is because [Event Hubs namespace is analogous to the Kafka cluster and event hub name is analogous to a Kafka topic](/azure/event-hubs/event-hubs-for-kafka-ecosystem-overview#kafka-and-event-hubs-conceptual-mapping), so the Kafka topic name must match the event hub name.

### Kafka consumer group offsets

If the connector disconnects - or is removed and reinstalled - with same Kafka consumer group ID, the consumer group offset (the last position from where Kafka consumer read messages) is stored in Azure Event Hub. To learn more, see [Event Hubs consumer group vs. Kafka consumer group](/azure/event-hubs/apache-kafka-frequently-asked-questions#event-hubs-consumer-group-vs--kafka-consumer-group).

### MQTT version

This connector only uses MQTT v5.