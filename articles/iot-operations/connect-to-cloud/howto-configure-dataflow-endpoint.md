---
title: Configure dataflow endpoints in Azure IoT Operations
description: Configure dataflow endpoints to create connection points for data sources.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 08/20/2024

#CustomerIntent: As an operator, I want to understand how to configure source and destination endpoints so that I can create a dataflow.
---

# Configure dataflow endpoints

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

To get started with dataflows, you need to configure endpoints. An endpoint is the connection point for the dataflow. You can use an endpoint as a source or destination for the dataflow. Some endpoint types can be used as [both sources and destinations](#endpoint-types-for-use-as-sources-and-destinations), while others are for [destinations only](#endpoint-type-for-destinations-only). A dataflow needs at least one source endpoint and one destination endpoint.

## Endpoint types for use as sources and destinations

The following endpoint types are used as sources and destinations.

### MQTT

MQTT endpoints are used for MQTT sources and destinations. You can configure the endpoint, Transport Layer Security (TLS), authentication, and other settings.

#### Azure IoT Operations built-in MQTT broker

To configure an MQTT broker endpoint with default settings, you can omit the host field, along with other optional fields. This configuration allows you to connect to the default MQTT broker without any extra configuration in a durable way, no matter how the broker changes.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: DataflowEndpoint
metadata:
  name: mq
spec:
  endpointType: Mqtt
  mqttSettings:
    {}
```

This in turn creates a connection to the default MQTT broker with the following settings:

- Host: `aio-mq-dmqtt-frontend:8883` through the [default MQTT broker listener](../manage-mqtt-broker/howto-configure-brokerlistener.md#default-brokerlistener)
- Authentication: service account token (SAT) through the [default BrokerAuthentication resource](../manage-mqtt-broker/howto-configure-authentication.md#default-brokerauthentication-resource)
- TLS: Enabled
- Trusted CA certificate: The default CA certificate `aio-ca-key-pair-test-only` from the [Default root CA](../manage-mqtt-broker/howto-configure-tls-auto.md#default-root-ca-and-issuer)

#### Event Grid

To configure an Azure Event Grid MQTT broker endpoint, use managed identity for authentication.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: DataflowEndpoint
metadata:
  name: eventgrid
spec:
  endpointType: Mqtt
  mqttSettings:
    host: example.westeurope-1.ts.eventgrid.azure.net:8883
    authentication:
      method: SystemAssignedManagedIdentity
      systemAssignedManagedIdentitySettings:
        {}
    tls:
      mode: Enabled
```

#### Other MQTT brokers

For other MQTT brokers, you can configure the endpoint, TLS, authentication, and other settings as needed.

```yaml
spec:
  endpointType: Mqtt
  mqttSettings:
    host: example.mqttbroker.com:8883
    authentication:
      ...
    tls:
      mode: Enabled
      trustedCaCertificateConfigMap: <your CA certificate config map>
```

#### Available authentication methods for MQTT endpoints

Under `mqttSettings.authentication`, you can configure the authentication method for the MQTT broker. Supported methods include X.509:

```yaml
mqttSettings:
  authentication:
    method: X509Certificate
    x509CertificateSettings:
      secretRef: <your x509 secret name>
```

> [!IMPORTANT]
> When you use X.509 authentication with an Event Grid MQTT broker, go to the Event Grid namespace > **Configuration** and check these settings:
> 
> - **Enable MQTT**: Select the checkbox.
> - **Enable alternative client authentication name sources**: Select the checkbox.
> - **Certificate Subject Name**: Select this option in the dropdown list.
> - **Maximum client sessions per authentication name**: Set to **3** or more.
> 
> The alternative client authentication and maximum client sessions options allow dataflows to use client certificate subject name for authentication instead of `MQTT CONNECT Username`. This capability is important so that dataflows can spawn multiple instances and still be able to connect. To learn more, see [Event Grid MQTT client certificate authentication](../../event-grid/mqtt-client-certificate-authentication.md) and [Multi-session support](../../event-grid/mqtt-establishing-multiple-sessions-per-client.md).

System-assigned managed identity:

```yaml
mqttSettings:
  authentication:
    method: SystemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings:
      # Audience of the service to authenticate against
      # Optional; defaults to the audience for Event Grid MQTT Broker
      audience: https://eventgrid.azure.net
```

User-assigned managed identity:

```yaml
mqttSettings:
  authentication:
    method: UserAssignedManagedIdentity
    userAssignedManagedIdentitySettings:
      clientId: <id>
      tenantId: <id>
```

Kubernetes SAT:

```yaml
mqttSettings:
  authentication:
    method: ServiceAccountToken
    serviceAccountTokenSettings:
      audience: <your service account audience>
```

Anonymous:

```yaml
mqttSettings:
  authentication:
    method: Anonymous
    anonymousSettings:
      {}
```

#### Additional MQTT settings

You can also configure QoS, MQTT version, client ID prefix, keep alive, clean session, session expiry, retain, and other settings.

```yaml
mqttSettings:
  qos: 1
  mqttVersion: v5
  clientIdPrefix: dataflow
  retain: Keep
```

### Kafka

Kafka endpoints are used for Kafka sources and destinations. You can configure the endpoint, TLS, authentication, and other settings.

#### Azure Event Hubs

To configure an Azure Event Hubs Kafka, we recommend that you use managed identity for authentication.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: DataflowEndpoint
metadata:
  name: kafka
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

#### Other Kafka brokers

For example, to configure a Kafka endpoint, set the host, TLS, authentication, and other settings as needed.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: DataflowEndpoint
metadata:
  name: kafka
spec:
  endpointType: Kafka
  kafkaSettings:
    host: example.kafka.com:9093
    authentication:
      ...
    tls:
      mode: Enabled
    consumerGroupId: mqConnector
```

#### Available authentication methods for Kafka endpoints

Under `kafkaSettings.authentication`, you can configure the authentication method for the Kafka broker. Supported methods include SASL, X.509, system-assigned managed identity, and user-assigned managed identity, and anonymous.

```yaml
kafkaSettings:
  host: example.kafka.com:9093
  authentication:
    method: Sasl
    saslSettings:
      saslType: PLAIN
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

#### Configure settings specific to source endpoints

For Kafka endpoints, you can configure settings specific for using the endpoint as a source. These settings have no effect if the endpoint is used as a destination.

```yaml
spec:
  kafkaSettings:
    consumerGroupId: fromMq
```

#### Configure settings specific to destination endpoints

For Kafka endpoints, you can configure settings specific for using the endpoint as a destination. These settings have no effect if the endpoint is used as a source.

```yaml
kafkaSettings:
  compression: Gzip
  batching:
    latencyMs: 100
    maxBytes: 1000000
    maxMessages: 1000
  partitionStrategy: Static
  kafkaAcks: All
  copyMqttProperties: Enabled
```

> [!IMPORTANT]
> By default, dataflows don't send MQTT message user properties to Kafka destinations. These user properties include values such as `subject` that stores the name of the asset sending the message. To include user properties in the Kafka message, you must update the `DataflowEndpoint` configuration to include `copyMqttProperties: enabled`.

## Endpoint type for destinations only

The following endpoint type is used for destinations only.

### Local storage and Edge Storage Accelerator

Use the local storage option to send data to a locally available persistent volume, through which you can upload data via Edge Storage Accelerator edge volumes. In this case, the format must be Parquet.

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
