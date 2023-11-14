---
title: Send and receive messages between Azure IoT MQ and Azure Event Hubs or Kafka
# titleSuffix: Azure IoT MQ
description: Learn how to send and receive messages between Azure IoT MQ and Azure Event Hubs or Kafka.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 10/31/2023

#CustomerIntent: As an operator, I want to understand how to configure Azure IoT MQ to send and receive messages between Azure IoT MQ and Kafka.
---

# Send and receive messages between Azure IoT MQ and Kafka

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

The Kafka connector pushes messages from Azure IoT MQ's MQTT broker to a Kafka endpoint, and similarly pulls messages the other way. Since [Azure Event Hubs supports Kafka API](/azure/event-hubs/event-hubs-for-kafka-ecosystem-overview), the connector works out-of-the-box with Event Hubs.


## Configure Event Hubs connector via Kafka endpoint

By default, the connector isn't installed with Azure IoT MQ. It must be explicitly enabled with topic mapping and authentication credentials specified. Follow these steps to enable bidirectional communication between IoT MQ and Azure Event Hubs through its Kafka endpoint.


1. [Create an Event Hubs namespace](/azure/event-hubs/event-hubs-create#create-an-event-hubs-namespace).

1. [Create an event hub](/azure/event-hubs/event-hubs-create#create-an-event-hub) for each Kafka topic.


## Grant the connector access to the Event Hubs namespace

Granting IoT MQ Arc extension access to an Event Hubs namespace is the most convenient way to establish a secure connection from IoT MQ's Kakfa connector to Event Hubs. 

Save the following Bicep template to a file and apply it with the Azure CLI after setting the valid parameters for your environment:

> [!NOTE]
> The Bicep template assumes the Arc connnected cluster and the Event Hubs namespace are in the same resource group, adjust the template if your environment is different. 

```bicep
@description('Location for cloud resources')
param mqExtensionName string = 'mq'
param clusterName string = 'clusterName'
param eventHubNamespaceName string = 'default'

resource connectedCluster 'Microsoft.Kubernetes/connectedClusters@2021-10-01' existing = {
  name: clusterName
}

resource mqExtension 'Microsoft.KubernetesConfiguration/extensions@2022-11-01' existing = {
  name: mqExtensionName
  scope: connectedCluster
}

resource ehNamespace 'Microsoft.EventHub/namespaces@2021-11-01' existing = {
  name: eventHubNamespaceName
}

// Role assignment for Event Hubs Data Receiver role
resource roleAssignmentDataReceiver 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(ehNamespace.id, mqExtension.id, '7f951dda-4ed3-4680-a7ca-43fe172d538d')
  scope: ehNamespace
  properties: {
     // ID for Event Hubs Data Receiver role is a638d3c7-ab3a-418d-83e6-5f17a39d4fde
    roleDefinitionId: resourceId('Microsoft.Authorization/roleDefinitions', 'a638d3c7-ab3a-418d-83e6-5f17a39d4fde') 
    principalId: mqExtension.identity.principalId
    principalType: 'ServicePrincipal'
  }
}

// Role assignment for Event Hubs Data Sender role
resource roleAssignmentDataSender 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(ehNamespace.id, mqExtension.id, '69b88ce2-a752-421f-bd8b-e230189e1d63')
  scope: ehNamespace
  properties: {
    // ID for Event Hubs Data Sender role is 2b629674-e913-4c01-ae53-ef4638d8f975
    roleDefinitionId: resourceId('Microsoft.Authorization/roleDefinitions', '2b629674-e913-4c01-ae53-ef4638d8f975') 
    principalId: mqExtension.identity.principalId
    principalType: 'ServicePrincipal'
  }
}
```

```azcli
# Set the required environment variables

# Resource group for resources
RESOURCE_GROUP=xxx

# Bicep template files name
TEMPLATE_FILE_NAME=xxx

# MQ Arc extension name
MQ_EXTENSION_NAME=xxx

# Arc connected cluster name
CLUSTER_NAME=xxx

# Event Hubs namespace name
EVENTHUB_NAMESPACE=xxx


az deployment group create \
      --name assign-RBAC-roles \
      --resource-group $RESOURCE_GROUP \
      --template-file $TEMPLATE_FILE_NAME \
      --parameters mqExtensionName=$MQ_EXTENSION_NAME \
      --parameters clusterName=$CLUSTER_NAME \
      --parameters eventHubNamespaceName=$EVENTHUB_NAMESPACE
```


## KafkaConnector

The *KafkaConnector* custom resource (CR) allows you to configure a Kafka connector that can communicate a Kafka host and Event Hubs. The Kafka connector can transfer data between MQTT topics and Kafka topics, using the Event Hubs as a Kafka-compatible endpoint.

The following example shows a *KafkaConnector* CR that connects to an Event Hubs endpoint using IoT MQ's Azure identity, it assumes other MQ resources were installed using the quickstart:

```yaml
apiVersion: mq.iotoperations.azure.com/v1beta1
kind: KafkaConnector
metadata:
  name: my-eh-connector
  namespace: azure-iot-operations # same as one used for other MQ resources
spec:
  image:
    pullPolicy: IfNotPresent
    repository: mcr.microsoft.com/azureiotoperations/kafka
    tag: 0.1.0-preview
  instances: 2
  clientIdPrefix: my-prefix
  kafkaConnection:
    # Port 9093 is Event Hubs' Kakfa endpoint
    # Plug in your Event Hubs namespace name
    endpoint: <NAMESPACE>.servicebus.windows.net:9093
    tls:
      tlsEnabled: true
    authentication:
      enabled: true
      authType:
        systemAssignedManagedIdentity:
          # plugin in your Event Hubs namespace name
          audience: "https://<EVENTHUBS_NAMESPACE>.servicebus.windows.net" 
  localBrokerConnection:
    endpoint: "aio-mq-dmqtt-frontend:8883"
    tls:
      tlsEnabled: true
      trustedCaCertificateConfigMap: "aio-ca-trust-bundle-test-only"
    authentication:
      kubernetes: {}
```

The following table describes the fields in the KafkaConnector CR:

| Field | Description | Required |
| ----- | ----------- | -------- |
| image | The image of the Kafka connector. You can specify the `pullPolicy`, `repository`, and `tag` of the image. Default values are shown in the prior example. | Yes |
| instances | The number of instances of the Kafka connector to run. | Yes |
| clientIdPrefix | The string to prepend to a client ID used by the connector. | No |
| kafkaConnection | The connection details of the Event Hubs endpoint. See [Kafka Connection](#kafka-connection). | Yes |
| localBrokerConnection | The connection details of the local broker that overrides the default broker connection. See [Manage local broker connection](#manage-local-broker-connection). | No |
| logLevel | The log level of the Kafka connector. Possible values are: *trace*, *debug*, *info*, *warn*, *error*, or *fatal*. Default is *warn*. | No |

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
| caConfigMap | The name of the config map that contains the CA certificate for verifying the server's identity. This field isn't required for Event Hubs communication, as Event Hubs uses well-known CAs that are trusted by default. However, you can use this field if you want to use a custom CA certificate. | No |

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
| sasl | The configuration for SASL authentication. Specify the `saslType`, which can be *plain*, *scram-sha-256*, or *scram-sha-512*, and the `secretName` to reference the Kubernetes secret containing the username and password. | Yes, if using SASL authentication |
| x509 | The configuration for X509 authentication. Specify the `secretName` field. The `secretName` field is the name of the secret that contains the client certificate and the client key in PEM format, stored as a TLS secret. | Yes, if using X509 authentication |
| systemAssignedManagedIdentity | The configuration for managed identity authentication. Specify the audience for the token request, which must match the Event Hubs namespace (`https://<NAMESPACE>.servicebus.windows.net`) [because the connector is a Kafka client](/azure/event-hubs/authenticate-application). A system-assigned managed identity is automatically created and assigned to the connector when it's enabled. | Yes, if using managed identity authentication |

You can use Azure Key Vault to manage secrets for Azure IoT MQ instead of Kubernetes secrets. To learn more, see [Manage secrets using Azure Key Vault or Kubernetes secrets](../manage-mqtt-connectivity/howto-manage-secrets.md).

For Event Hubs, use plain SASL and `$ConnectionString` as the username and the full connection string as the password.

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

To use managed identity, specify it as the only method under authentication. You also need to assign a role to the managed identity that grants permission to send and receive messages from Event Hubs, such as Azure Event Hubs Data Owner or Azure Event Hubs Data Sender/Receiver. To learn more, see [Authenticate an application with Microsoft Entra ID to access Event Hubs resources](/azure/event-hubs/authenticate-application#built-in-roles-for-azure-event-hubs).

```yaml
authentication:
  enabled: true
  authType:
    systemAssignedManagedIdentity:
      audience: https://<NAMESPACE>.servicebus.windows.net
```

### Manage local broker connection

Like MQTT bridge, the Event Hubs connector acts as a client to the IoT MQ MQTT broker. If you've customized the listener port and/or authentication of your IoT MQ MQTT broker, override the local MQTT connection configuration for the Event Hubs connector as well. To learn more, see [MQTT bridge local broker connection](howto-configure-mqtt-bridge.md).

## KafkaConnectorTopicMap

The KafkaConnectorTopicMap custom resource (CR) allows you to define the mapping between MQTT topics and Kafka topics for bi-directional data transfer. Specify a reference to a KafkaConnector CR and a list of routes. Each route can be either an MQTT to Kafka route or a Kafka to MQTT route. For example:

```yaml
apiVersion: mq.iotoperations.azure.com/v1beta1
kind: KafkaConnectorTopicMap
metadata:
  name: my-eh-topic-map
  namespace: <SAME NAMESPACE AS BROKER> # For example "default"
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
        consumerGroupId: mqConnector
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

The compression field enables compression for the messages sent to Kafka topics. Compression helps to reduce the network bandwidth and storage space required for data transfer. However, compression also adds some overhead and latency to the process. The supported compression types are listed in the following table.

| Value | Description |
| ----- | ----------- |
| none | No compression or batching is applied. *none* is the default value if no compression is specified. |
| gzip | GZIP compression and batching are applied. GZIP is a general-purpose compression algorithm that offers a good balance between compression ratio and speed. |
| snappy | Snappy compression and batching are applied. Snappy is a fast compression algorithm that offers moderate compression ratio and speed. |
| lz4 | LZ4 compression and batching are applied. LZ4 is a fast compression algorithm that offers low compression ratio and high speed. |

### Batching

Aside from compression, you can also configure batching for messages before sending them to Kafka topics. Batching allows you to group multiple messages together and compress them as a single unit, which can improve the compression efficiency and reduce the network overhead.

| Field | Description | Required |
| ----- | ----------- | -------- |
| enabled | A boolean value that indicates whether batching is enabled or not. If not set, the default value is false. | Yes |
| latencyMs | The maximum time interval in milliseconds that messages can be buffered before being sent. If this interval is reached, then all buffered messages are sent as a batch, regardless of how many or how large they are. If not set, the default value is 5. | No |
| maxMessages | The maximum number of messages that can be buffered before being sent. If this number is reached, then all buffered messages are sent as a batch, regardless of how large they are or how long they are buffered. If not set, the default value is 100000.  | No |
| maxBytes | The maximum size in bytes that can be buffered before being sent. If this size is reached, then all buffered messages are sent as a batch, regardless of how many they are or how long they are buffered. The default value is 1000000 (1 MB). | No |

An example of using batching is:

```yaml
batching:
  enabled: true
  latencyMs: 1000
  maxMessages: 100
  maxBytes: 1024
```

This means that messages are sent either when there are 100 messages in the buffer, or when there are 1024 bytes in the buffer, or when 1000 milliseconds elapses since the last send, whichever comes first.

### Partition handling strategy

The partition handling strategy is a feature that allows you to control how messages are assigned to Kafka partitions when sending them to Kafka topics. Kafka partitions are logical segments of a Kafka topic that enable parallel processing and fault tolerance. Each message in a Kafka topic has a partition and an offset that are used to identify and order the messages.

By default, the Kafka connector assigns messages to random partitions, using a round-robin algorithm. However, you can use different strategies to assign messages to partitions based on some criteria, such as the MQTT topic name or an MQTT message property. This can help you to achieve better load balancing, data locality, or message ordering.

| Value | Description |
| ----- | ----------- |
| default | Assigns messages to random partitions, using a round-robin algorithm. It's the default value if no strategy is specified. |
| static | Assigns messages to a fixed partition number that's derived from the instance ID of the connector. This means that each connector instance sends messages to a different partition. This can help to achieve better load balancing and data locality. |
| topic | Uses the MQTT topic name as the key for partitioning. This means that messages with the same MQTT topic name are sent to the same partition. This can help to achieve better message ordering and data locality. |
| property | Uses an MQTT message property as the key for partitioning. Specify the name of the property in the `partitionKeyProperty` field. This means that messages with the same property value are sent to the same partition. This can help to achieve better message ordering and data locality based on a custom criterion. |

An example of using partition handling strategy is:

```yaml
partitionStrategy: property
partitionKeyProperty: device-id
```

This means that messages with the same device-id property are sent to the same partition.

### Routes

The routes field defines a list of routes for data transfer between MQTT topics and Kafka topics. Each route can have either a `mqttToKafka` or a `kafkaToMqtt` field, depending on the direction of data transfer.

#### MQTT to Kafka

The `mqttToKafka` field defines a route that transfers data from an MQTT topic to a Kafka topic.

| Field | Description | Required |
| ----- | ----------- | -------- |
| name | Unique name for the route. | Yes |
| mqttTopic | The MQTT topic to subscribe from. You can use wildcard characters (`#` and `+`) to match multiple topics. | Yes |
| kafkaTopic | The Kafka topic to send to. | Yes |
| kafkaAcks | The number of acknowledgments the connector requires from the Kafka endpoint. Possible values are: `zero` , `one`, or `all`. | No |
| qos | The quality of service (QoS) level for the MQTT topic subscription. Possible values are: 0 or 1 (default). QoS 2 is currently not supported. | Yes |
| sharedSubscription | The configuration for using shared subscriptions for MQTT topics. Specify the `groupName`, which is a unique identifier for a group of subscribers, and the `groupMinimumShareNumber`, which is the number of subscribers in a group that receive messages from a topic. For example, if groupName is "group1" and groupMinimumShareNumber is 3, then the connector creates three subscribers with the same group name to receive messages from a topic. This feature allows you to distribute messages among multiple subscribers without losing any messages or creating duplicates. | No |

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

In this example, messages from MQTT topics that match *temperature-alerts/#* are sent to Kafka topic *receiving-event-hub* with QoS equivalent 1 and shared subscription group "group1" with share number 3.

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

In this example, messages from Kafka topic *sending-event-hub** are published to MQTT topic *heater-commands* with QoS level 0.

### Event hub name must match Kafka topic

Each individual event hub not the namespace must be named exactly the same as the intended Kafka topic specified in the routes. Also, the connection string `EntityPath` must match if connection string is scoped to one event hub. This requirement is because [Event Hubs namespace is analogous to the Kafka cluster and event hub name is analogous to a Kafka topic](/azure/event-hubs/event-hubs-for-kafka-ecosystem-overview#kafka-and-event-hubs-conceptual-mapping), so the Kafka topic name must match the event hub name.

### Kafka consumer group offsets

If the connector disconnects or is removed and reinstalled with same Kafka consumer group ID, the consumer group offset (the last position from where Kafka consumer read messages) is stored in Azure Event Hubs. To learn more, see [Event Hubs consumer group vs. Kafka consumer group](/azure/event-hubs/apache-kafka-frequently-asked-questions#event-hubs-consumer-group-vs--kafka-consumer-group).

### MQTT version

This connector only uses MQTT v5.

## Related content

[Publish and subscribe MQTT messages using Azure IoT MQ](../manage-mqtt-connectivity/overview-iot-mq.md)
