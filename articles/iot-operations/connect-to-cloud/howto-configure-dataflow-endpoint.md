---
title: Configure dataflow endpoints
description: Configure dataflow endpoints to create connection points for data sources.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-mqtt-broker
ms.topic: conceptual
ms.date: 07/23/2024

#CustomerIntent: As an operator, I want to understand how to I can use Dataflows to .
---

# Configure dataflow endpoints

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

To get started with dataflows, you need to configure endpoints. An endpoint is the connection point for the dataflow. You can use an endpoint as a source or destination for the dataflow. Some endpoint types can be used as [both sources and destinations](#endpoint-types-for-use-as-sources-and-destinations), while others are for [destinations only](#endpoint-types-for-destinations-only). A dataflow needs at least one source endpoint and one destination endpoint.

## Endpoint types for use as sources and destinations

### MQTT

MQTT endpoints are used for MQTT sources and destinations. You can configure the endpoint, TLS, authentication, and other settings.

#### IoT MQ

To configure an IoT MQ endpoint with default settings, you can omit the host field, along with other optional fields. This allows you to connect to the default IoT MQ broker without any additional configuration in a durable way, no matter how the broker changes.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: DataflowEndpoint
metadata:
  name: mq
spec:
  endpointType: mqtt
  authentication:
    method: serviceAccountToken
    serviceAccountTokenSettings:
      audience: aio-mq-internal
  mqttSettings:
    {}
```

> [!NOTE]
> Seems like we're maybe not able to implement this feature in the first version. We might need to have a host field.

#### Event Grid

To configure an Event Grid MQTT broker endpoint, use managed identity for authentication.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: DataflowEndpoint
metadata:
  name: eventgrid
spec:
  endpointType: mqtt
  authentication:
    method: systemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings:
      {}
  mqttSettings:
    host: example.westeurope-1.ts.eventgrid.azure.net:8883
    tls:
      mode: enabled
```

#### Other MQTT brokers

For other MQTT brokers, you can configure the endpoint, TLS, authentication, and other settings as needed.

```yaml
spec:
  endpointType: mqtt
  authentication:
    ...
  mqttSettings:
    host: example.mqttbroker.com:8883
    tls:
      mode: enabled
      trustedCaCertificateConfigMap: <your CA certificate config map>
```

Under `authentication` , you can configure the authentication method for the MQTT broker. Supported methods include X.509:

```yaml
authentication:
  method: x509Credentials
  x509CredentialsSettings:
    certificateSecretName: <your x509 secret name>
```

System-assigned managed identity:

```yaml
authentication:
  method: systemAssignedManagedIdentity
  systemAssignedManagedIdentitySettings:
    # Audience of the service to authenticate against
    # Optional; defaults to the audience for Event Grid MQTT Broker
    audience: https://eventgrid.azure.net
```

User-assigned managed identity:

```yaml
authentication:
  method: userAssignedManagedIdentity
  userAssignedManagedIdentitySettings:
    clientId: <id>
    tenantId: <id>
```

Kubernetes SAT:

```yaml
authentication:
  method: serviceAccountToken
  serviceAccountTokenSettings:
    audience: <your service account audience>
```

You can also configure shared subscriptions, QoS, MQTT version, client ID prefix, keep alive, clean session, session expiry, retain, and other settings.

```yaml
spec:
  endpointType: mqtt
  mqttSettings:
    sharedSubscription:
      groupMinimumShareNumber: 3
      groupName: group1
    qos: 1
    mqttVersion: v5
    clientIdPrefix: dataflow
    keepRetain: enabled
```

### Kafka

Kafka endpoints are used for Kafka sources and destinations. You can configure the endpoint, TLS, authentication, and other settings.

#### Azure Event Hubs

To configure an Azure Event Hubs Kafka, the recommended way is to use managed identity for authentication.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: DataflowEndpoint
metadata:
  name: kafka
spec:
  endpointType: kafka
  authentication:
    method: systemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings: {}
  kafkaSettings:
    host: <NAMESPACE>.servicebus.windows.net:9093
    tls:
      mode: enabled
    consumerGroupId: mqConnector
```

#### Other Kafka brokers

For example, to configure a Kafka endpoint set the host, TLS, authentication, and other settings as needed.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: DataflowEndpoint
metadata:
  name: kafka
spec:
  endpointType: kafka
  authentication:
    ...
  kafkaSettings:
    host: example.kafka.com:9093
    tls:
      mode: enabled
    consumerGroupId: mqConnector
```

Under `authentication` , you can configure the authentication method for the Kafka broker. Supported methods include SASL, X.509, system-assigned managed identity, and user-assigned managed identity.

```yaml
authentication:
  method: sasl
  saslSettings:
    saslType: PLAIN
    tokenSecretName: <your token secret name>
  # OR
  method: x509Credentials
  x509CredentialsSettings:
    certificateSecretName: <your x509 secret name>
  # OR
  method: systemAssignedManagedIdentity
  systemAssignedManagedIdentitySettings:
    audience: https://<your Event Hubs namespace>.servicebus.windows.net
  # OR
  method: userAssignedManagedIdentity
  userAssignedManagedIdentitySettings:
    clientId: <id>
    tenantId: <id>
```

### Configure settings specific to source endpoints

For Kafka endpoints, you can configure settings specific for using the endpoint as a source. These settings have no effect if the endpoint is used as a destination.

```yaml
spec:
  endpointType: kafka
  kafkaSettings:
    consumerGroupId: fromMq
```

### Configure settings specific to destination endpoints

For Kafka endpoints, you can configure settings specific for using the endpoint as a destination. These settings have no effect if the endpoint is used as a source.

```yaml
spec:
  endpointType: kafka
  kafkaSettings:
    compression: gzip
    batching:
      latencyMs: 100
      maxBytes: 1000000
      maxMessages: 1000
    partitionStrategy: static
    kafkaAcks: all
    copyMqttProperties: enabled
```

## Endpoint types for destinations only

### Azure Data Lake (ADLSv2)

Azure Data Lake endpoints are used for Azure Data Lake destinations. You can configure the endpoint, authentication, table, and other settings.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: DataflowEndpoint
metadata:
  name: adls
spec:
  endpointType: dataLakeStorage
  authentication:
    method: systemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings: {}
  datalakeStorageSettings:
    host: example.blob.core.windows.net
```

Other supported authentication method is SAS tokens or user-assigned managed identity.

```yaml
spec:
  authentication:
    method: accessToken
    accessTokenSecretRef: <your access token secret name>
    # OR
    userAssignedManagedIdentitySettings:
      clientId: <id>
      tenantId: <id>
```

You can also configure batching latency, max bytes, and max messages.

```yaml
spec:
  endpointType: dataLakeStorage
  datalakeStorageSettings:
    batching:
      latencyMs: 100
      maxBytes: 1000000
      maxMessages: 1000
```

### Azure Data Explorer (ADX)

Azure Data Explorer endpoints are used for Azure Data Explorer destinations. You can configure the endpoint, authentication, and other settings.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: DataflowEndpoint
metadata:
  name: adx
spec:
  endpointType: dataExplorer
  authentication:
    method: systemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings: {}
    # OR
    method: userAssignedManagedIdentity
    userAssignedManagedIdentitySettings:
      clientId: <id>
      tenantId: <id>
  dataExplorerSettings:
    host: example.westeurope.kusto.windows.net
    database: example-database
```

Again, you can configure batching latency, max bytes, and max messages.

```yaml
spec:
  endpointType: dataExplorer
  dataExplorerSettings:
    batching:
      latencyMs: 100
      maxBytes: 1000000
      maxMessages: 1000
```

### Local storage and Edge Storage Accelerator

Use the local storage option to send data to a locally available persistent volume, through which you can upload data via Edge Storage Accelerator (ESA) edge volumes. In this case, the format must be parquet.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: DataflowEndpoint
metadata:
  name: esa
spec:
  endpointType: localStorage
  localStorageSettings:
    persistentVolumeClaimName: <your PVC name>
```
