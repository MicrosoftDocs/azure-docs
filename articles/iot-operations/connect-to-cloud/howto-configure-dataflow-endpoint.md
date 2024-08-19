---
title: Configure dataflow endpoints in Azure IoT Operations
description: Configure dataflow endpoints to create connection points for data sources.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 08/19/2024

#CustomerIntent: As an operator, I want to understand how to configure source and destination endpoints so that I can create a dataflow.
---

# Configure dataflow endpoints

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

To get started with dataflows, you need to configure endpoints. An endpoint is the connection point for the dataflow. You can use an endpoint as a source or destination for the dataflow. Some endpoint types can be used as [both sources and destinations](#endpoint-types-for-use-as-sources-and-destinations), while others are for [destinations only](#endpoint-type-for-destinations-only). A dataflow needs at least one source endpoint and one destination endpoint.

The following example shows a custom resource definition with all of the configuration options. The required fields are dependent on the endpoint type. Review the sections for each endpoint type for configuration guidance.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: DataflowEndpoint
metadata:
  name: <endpoint-name>
spec:
  endpointType: <endpointType> # mqtt, kafka, or localStorage
  authentication:
    method: <method> # systemAssignedManagedIdentity, x509Credentials, userAssignedManagedIdentity, or serviceAccountToken
    systemAssignedManagedIdentitySettings: # Required if method is systemAssignedManagedIdentity
      audience: https://eventgrid.azure.net
    ### OR
    # x509CredentialsSettings: # Required if method is x509Credentials
    #  certificateSecretName: x509-certificate
    ### OR
    # userAssignedManagedIdentitySettings: # Required if method is userAssignedManagedIdentity
    #  clientId: <id>
    #  tenantId: <id>
    #  audience: https://eventgrid.azure.net
    ### OR
    # serviceAccountTokenSettings: # Required if method is serviceAccountToken
    #  audience: my-audience
  mqttSettings: # Required if endpoint type is mqtt
    host: example.westeurope-1.ts.eventgrid.azure.net:8883
    tls: # Omit for no TLS or MQTT.
      mode: <mode> # enabled or disabled
      trustedCaCertificateConfigMap: ca-certificates
    sharedSubscription: 
      groupMinimumShareNumber: 3 # Required if shared subscription is enabled.
      groupName: group1 # Required if shared subscription is enabled.
    clientIdPrefix: <prefix>
    retain: keep
    sessionExpirySeconds: 3600
    qos: 1
    protocol: mqtt
    maxInflightMessages: 100
```

| Name                                            | Description                                                                 |
|-------------------------------------------------|-----------------------------------------------------------------------------|
| `endpointType`                             | Type of the endpoint. Values: `mqtt`, `kafka`, `dataExplorer`, `dataLakeStorage`, `fabricOneLake`, or `localStorage`. |
| `authentication.method`                    | Method of authentication. Values: `systemAssignedManagedIdentity`, `x509Credentials`, `userAssignedManagedIdentity`, or `serviceAccountToken`. |
| `authentication.systemAssignedManagedIdentitySettings.audience` | Audience of the service to authenticate against. Defaults to `https://eventgrid.azure.net`. |
| `authentication.x509CredentialsSettings.certificateSecretName` | Secret name of the X.509 certificate. |
| `authentication.userAssignedManagedIdentitySettings.clientId` | Client ID for the user-assigned managed identity. |
| `authentication.userAssignedManagedIdentitySettings.tenantId` | Tenant ID. |
| `authentication.userAssignedManagedIdentitySettings.audience` | Audience of the service to authenticate against. Defaults to `https://eventgrid.azure.net`. |
| `authentication.serviceAccountTokenSettings.audience` | Audience of the service account. Optional, defaults to the broker internal service account audience. |
| `mqttSettings.host`                        | Host of the MQTT broker in the form of \<hostname\>:\<port\>. Connects to MQTT broker if omitted.|
| `mqttSettings.tls`                        | TLS configuration. Omit for no TLS or MQTT broker. |
| `mqttSettings.tls.mode`                    | Enable or disable TLS. Values: `enabled` or `disabled`. Defaults to `disabled`. |
| `mqttSettings.tls.trustedCaCertificateConfigMap` | Trusted certificate authority (CA) certificate config map. No CA certificate if omitted. No CA certificate works for public endpoints like Azure Event Grid.|
| `mqttSettings.sharedSubscription` | Shared subscription settings. No shared subscription if omitted. |
| `mqttSettings.sharedSubscription.groupMinimumShareNumber` | Number of clients to use for shared subscription. |
| `mqttSettings.sharedSubscription.groupName` | Shared subscription group name. |
| `mqttSettings.clientIdPrefix`              | Client ID prefix. Client ID generated by the dataflow is \<prefix\>-id. No prefix if omitted.|
| `mqttSettings.retain`                      | Whether or not to keep the retain setting. Values: `keep` or `never`. Defaults to `keep`. |
| `mqttSettings.sessionExpirySeconds`        | Session expiry in seconds. Defaults to `3600`.|
| `mqttSettings.qos`                         | Quality of service. Values: `0` or `1`. Defaults to `1`.|
| `mqttSettings.protocol`                    | Use MQTT or web sockets. Values: `mqtt` or `websockets`. Defaults to `mqtt`.|
| `mqttSettings.maxInflightMessages`         | The maximum number of messages to keep in flight. For subscribe, it's the receive maximum. For publish, it's the maximum number of messages to send before waiting for an acknowledgment. Default is `100`. |

## Endpoint types for use as sources and destinations

The following endpoint types are used as sources and destinations.

### MQTT

MQTT endpoints are used for MQTT sources and destinations. You can configure the endpoint, Transport Layer Security (TLS), authentication, and other settings.

#### MQTT broker

To configure an MQTT broker endpoint with default settings, you can omit the host field, along with other optional fields. This configuration allows you to connect to the default MQTT broker without any extra configuration in a durable way, no matter how the broker changes.

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
      audience: aio-mqtt
  mqttSettings:
    {}
```

#### Event Grid

To configure an Azure Event Grid MQTT broker endpoint, use managed identity for authentication.

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

Under `authentication`, you can configure the authentication method for the MQTT broker. Supported methods include X.509:

```yaml
authentication:
  method: x509Credentials
  x509CredentialsSettings:
    certificateSecretName: <your x509 secret name>
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

To configure an Azure Event Hubs Kafka, we recommend that you use managed identity for authentication.

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

For example, to configure a Kafka endpoint, set the host, TLS, authentication, and other settings as needed.

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

Under `authentication`, you can configure the authentication method for the Kafka broker. Supported methods include SASL, X.509, system-assigned managed identity, and user-assigned managed identity.

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

> [!IMPORTANT]
> By default, data flows don't send MQTT message user properties to Kafka destinations. These user properties include values such as `subject` that stores the name of the asset sending the message. To include user properties in the Kafka message, you must update the `DataflowEndpoint` configuration to include `copyMqttProperties: enabled`.

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
