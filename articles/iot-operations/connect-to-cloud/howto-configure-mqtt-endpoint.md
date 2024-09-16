---
title: Configure MQTT dataflow endpoints in Azure IoT Operations
description: Learn how to configure dataflow endpoints for MQTT sources and destinations.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 09/09/2024
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to understand how to understand how to configure dataflow endpoints for MQTT sources and destinations in Azure IoT Operations so that I can send data to and from MQTT brokers.
---

# Configure MQTT dataflow endpoints

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

MQTT endpoints are used for MQTT sources and destinations. You can configure the endpoint, Transport Layer Security (TLS), authentication, and other settings.

## Prerequisites

- An instance of [Azure IoT Operations Preview](../deploy-iot-ops/howto-deploy-iot-operations.md)
- A [configured dataflow profile](howto-configure-dataflow-profile.md)

## How to configure a dataflow endpoint for MQTT brokers

To create a dataflow endpoint for MQTT brokers, you can configure the endpoint, authentication, TLS, and other settings. The endpoint is used as a connection point for dataflow sources and destinations.

### Azure IoT Operations built-in MQTT broker

Azure IoT Operations provides a built-in MQTT broker that you can use with dataflows.

# [Portal](#tab/portal)

:::image type="content" source="media/default-mqtt-endpoint.png" alt-text="Screenshot using operations portal to view default MQTT endpoint.":::

# [Kubernetes](#tab/kubernetes)

To configure an MQTT broker endpoint with default settings, you can omit the host field along with other optional fields.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: DataflowEndpoint
metadata:
  name: mq
  namespace: azure-iot-operations
spec:
  endpointType: Mqtt
  mqttSettings:
    authentication:
      method: ServiceAccountToken
      serviceAccountTokenSettings:
        audience: aio-internal
```

This configuration creates a connection to the default MQTT broker with the following settings:

- Host: `aio-broker:18883` through the [default MQTT broker listener](../manage-mqtt-broker/howto-configure-brokerlistener.md#default-brokerlistener)
- Authentication: service account token (SAT) through the [default BrokerAuthentication resource](../manage-mqtt-broker/howto-configure-authentication.md#default-brokerauthentication-resource)
- TLS: Enabled
- Trusted CA certificate: The default CA certificate `aio-ca-key-pair-test-only` from the [Default root CA](../manage-mqtt-broker/howto-configure-tls-auto.md#default-root-ca-and-issuer)

> [!IMPORTANT]
> If any of these default MQTT broker settings change, the dataflow endpoint must be updated to reflect the new settings. For example, if the default MQTT broker listener changes to use a different service name `my-mqtt-broker` and port 8885, you must update the endpoint to use the new host `host: my-mqtt-broker:8885`. Same applies to other settings like authentication and TLS.

---

### Azure Event Grid

[Azure Event Grid provides a fully managed MQTT broker](../../event-grid/mqtt-overview.md) that works with Azure IoT Operations dataflows.

To configure an Azure Event Grid MQTT broker endpoint, we recommend that you use managed identity for authentication.

# [Portal](#tab/portal)

:::image type="content" source="media/howto-configure-mqtt-endpoint/event-grid-endpoint.png" alt-text="Screenshot using operations portal to create an Azure Event Grid endpoint.":::

# [Kubernetes](#tab/kubernetes)

1. Create an Event Grid namespace and enable MQTT.

1. Get the managed identity of the Azure IoT Operations Arc extension.

1. Assign the managed identity to the Event Grid namespace or topic space with an appropriate role like `EventGrid TopicSpaces Publisher` or `EventGrid TopicSpaces Subscriber`.

1. Create the DataflowEndpoint resource. For example:

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: DataflowEndpoint
metadata:
  name: eventgrid
  namespace: azure-iot-operations
spec:
  endpointType: Mqtt
  mqttSettings:
    host: <NAMESPACE>.<REGION>-1.ts.eventgrid.azure.net:8883
    authentication:
      method: SystemAssignedManagedIdentity
      systemAssignedManagedIdentitySettings:
        {}
    tls:
      mode: Enabled
```

---

Once the endpoint is created, you can use it in a dataflow to connect to the Event Grid MQTT broker as a source or destination. The MQTT topics are configured in the dataflow.

#### Use X.509 certificate authentication with Event Grid

We recommended to use managed identity for authentication. You can also use X.509 certificate authentication with the Event Grid MQTT broker.

When you use X.509 authentication with an Event Grid MQTT broker, go to the Event Grid namespace > **Configuration** and check these settings:

- **Enable MQTT**: Select the checkbox.
- **Enable alternative client authentication name sources**: Select the checkbox.
- **Certificate Subject Name**: Select this option in the dropdown list.
- **Maximum client sessions per authentication name**: Set to **3** or more.

The alternative client authentication and maximum client sessions options allow dataflows to use client certificate subject name for authentication instead of `MQTT CONNECT Username`. This capability is important so that dataflows can spawn multiple instances and still be able to connect. To learn more, see [Event Grid MQTT client certificate authentication](../../event-grid/mqtt-client-certificate-authentication.md) and [Multi-session support](../../event-grid/mqtt-establishing-multiple-sessions-per-client.md).

#### Event Grid shared subscription limitation

Azure Event Grid MQTT broker doesn't support shared subscriptions, which means that you can't set the `instanceCount` to more than `1` in the dataflow profile. If you set `instanceCount` greater than `1`, the dataflow fails to start.

### Other MQTT brokers

For other MQTT brokers, you can configure the endpoint, TLS, authentication, and other settings as needed.

# [Portal](#tab/portal)

:::image type="content" source="media/howto-configure-mqtt-endpoint/custom-mqtt-broker.png" alt-text="Screenshot using operations portal to create a custom MQTT broker endpoint.":::

# [Kubernetes](#tab/kubernetes)

```yaml
spec:
  endpointType: Mqtt
  mqttSettings:
    host: <MQTT-BROKER-HOST>:8883
    authentication:
      ...
    tls:
      mode: Enabled
      trustedCaCertificateConfigMapRef: <YOUR CA CERTIFICATE CONFIG MAP>
```

---

### Use the endpoint in a dataflow source or destination

Once you've configured the endpoint, you can use it in a dataflow as both a source or a destination. The MQTT topics are configured in the dataflow source or destination settings, which allows you to reuse the same *DataflowEndpoint* resource with multiple dataflows and different MQTT topics. To learn more, see [Create a dataflow](howto-create-dataflow.md).

For information on how to customize the MQTT endpoint settings, see the next sections in the article.

## Available authentication methods

Under `mqttSettings.authentication`, you can configure the authentication method for the MQTT broker. 

### X.509 certificate

Many MQTT brokers, like Event Grid, support X.509 authentication. Dataflows can present a client X.509 certificate and negotiate the TLS communication. 

To use X.509 certificate authentication, you need to create a secret with the certificate and private key. The secret must be in the same namespace as the Kafka dataflow resource. use Kubernetes TLS secret containing the public certificate and private key. For example:

```bash
kubectl create secret tls my-tls-secret -n azure-iot-operations \
  --cert=path/to/cert/file \
  --key=path/to/key/file
```

Then, reference the secret in the DataflowEndpoint resource.

```yaml
mqttSettings:
  authentication:
    method: X509Certificate
    x509CertificateSettings:
      secretRef: <YOUR-X509-SECRET-NAME>
```

### System-assigned managed identity

To use system-assigned managed identity for authentication, you don't need to create a secret. The system-assigned managed identity is used to authenticate with the MQTT broker. 

Before you configure the endpoint, make sure that the Azure IoT Operations managed identity has the necessary permissions to connect to the MQTT broker. For example, with Azure Event Grid MQTT broker, assign the managed identity to the Event Grid namespace or topic space with [an appropriate role](../../event-grid/mqtt-client-microsoft-entra-token-and-rbac.md#authorization-to-grant-access-permissions).

Then, configure the endpoint with system-assigned managed identity settings. In most cases when using with Event Grid, you can leave the settings empty as shown below. This sets the managed identity audience to the Event Grid common audience `https://eventgrid.azure.net`.

```yaml
mqttSettings:
  authentication:
    method: SystemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings:
      {}
```

If you need to set a different audience, you can specify it in the settings.

```yaml
mqttSettings:
  authentication:
    method: SystemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings:
      audience: https://<AUDIENCE>
```

### User-assigned managed identity

To use a user-assigned managed identity, specify the `UserAssignedManagedIdentity` authentication method.

```yaml
mqttSettings:
  authentication:
    method: UserAssignedManagedIdentity
    userAssignedManagedIdentitySettings:
      clientId: <ID>
      tenantId: <ID>
```

### Kubernetes service account token (SAT)

To use Kubernetes service account token (SAT) for authentication, you don't need to create a secret. The SAT is used to authenticate with the MQTT broker.

```yaml
mqttSettings:
  authentication:
    method: ServiceAccountToken
    serviceAccountTokenSettings:
      audience: <YOUR-SERVICE-ACCOUNT-AUDIENCE>
```

If the audience is not specified, the default audience for the Azure IoT Operations MQTT broker is used.

### Anonymous

To use anonymous authentication, set the authentication method to `Anonymous`.

```yaml
mqttSettings:
  authentication:
    method: Anonymous
    anonymousSettings:
      {}
```

## TLS settings

Under `mqttSettings.tls`, you can configure the TLS settings for the MQTT broker.

### TLS mode

To enable or disable TLS, set the `mode` field to `Enabled` or `Disabled`.

```yaml
mqttSettings:
  tls:
    mode: Enabled
```

### Trusted CA certificate

To use a trusted CA certificate for the MQTT broker, you can create a Kubernetes ConfigMap with the CA certificate and reference it in the DataflowEndpoint resource.

```yaml
mqttSettings:
  tls:
    mode: Enabled
    trustedCaCertificateConfigMapRef: <your CA certificate config map>
```

This is useful when the MQTT broker uses a self-signed certificate or a certificate that's not trusted by default. The CA certificate is used to verify the MQTT broker's certificate. In the case of Event Grid, its CA certificate is already widely trusted and so you can omit this setting.

## MQTT messaging settings

Under `mqttSettings`, you can configure the MQTT messaging settings for the dataflow MQTT client used with the endpoint.

### Client ID prefix

You can set a client ID prefix for the MQTT client. The client ID is generated by appending the dataflow instance name to the prefix.

```yaml
mqttSettings:
  clientIdPrefix: dataflow
```

### QoS

You can set the Quality of Service (QoS) level for the MQTT messages to either 1 or 0. The default is 1.

```yaml
mqttSettings:
  qos: 1
```

### Retain

Use the `retain` setting to specify whether the dataflow should keep the retain flag on MQTT messages. The default is `Keep`.

```yaml
mqttSettings:
  retain: Keep
```

This setting is useful to ensure that the remote broker has the same message as the local broker, which can be  important for Unified Namespace scenarios.

If set to `Never`, the retain flag is removed from the MQTT messages. This can be useful when you don't want the remote broker to retain any messages or if the remote broker doesn't support retain.

The retain setting only takes effect if the dataflow uses MQTT endpoint as both source and destination. For example, in an MQTT bridge scenario.

### Session expiry

You can set the session expiry interval for the dataflow MQTT client. The session expiry interval is the maximum time that an MQTT session is maintained if the dataflow client disconnects. The default is 3600 seconds.

```yaml
mqttSettings:
  sessionExpirySeconds: 3600
```

### MQTT or WebSockets protocol

By default, WebSockets isn't enabled. To use MQTT over WebSockets, set the `protocol` field to `WebSockets`.

```yaml
mqttSettings:
  protocol: WebSockets
```

### Max inflight messages

You can set the maximum number of inflight messages that the dataflow MQTT client can have. The default is 100.

```yaml
mqttSettings:
  maxInflightMessages: 100
```

For subscribe - when the MQTT endpoint is used a source - this is the receive maximum. For publish - when the MQTT endpoint is used as a destination -  this is the maximum number of messages to send before waiting for an ack.

### Keep alive

You can set the keep alive interval for the dataflow MQTT client. The keep alive interval is the maximum time that the dataflow client can be idle before sending a PINGREQ message to the broker. The default is 60 seconds.

```yaml
mqttSettings:
  keepAliveSeconds: 60
```

### CloudEvents

[CloudEvents](https://cloudevents.io/) are a way to describe event data in a common way. The CloudEvents settings are used to send or receive messages in the CloudEvents format. You can use CloudEvents for event-driven architectures where different services need to communicate with each other in the same or different cloud providers.

The `CloudEventAttributes` options are `Propagate` or`CreateOrRemap`.

```yaml
mqttSettings:
  CloudEventAttributes: Propagate # or CreateOrRemap
```

#### Propagate setting

CloudEvent properties are passed through for messages that contain the required properties. If the message does not contain the required properties, the message is passed through as is. 

| Name              | Required | Sample value                                           | Output value                                                                                            |
| ----------------- | -------- | ------------------------------------------------------ |-------------------------------------------------------------------------------------------------------- |
| `specversion`     | Yes      | `1.0`                                                  | Passed through as is                                                                                    |
| `type`            | Yes      | `ms.aio.telemetry`                                     | Passed through as is                                                                                    |
| `source`          | Yes      | `aio://mycluster/myoven`                               | Passed through as is                                                                                    |
| `id`              | Yes      | `A234-1234-1234`                                       | Passed through as is                                                                                    |
| `subject`         | No       | `aio/myoven/telemetry/temperature`                     | Passed through as is                                                                                    |
| `time`            | No       | `2018-04-05T17:31:00Z`                                 | Passed through as is. It's not restamped. |
| `datacontenttype` | No       | `application/json`                                     | Changed to the output data content type after the optional transform stage.                             |
| `dataschema`      | No       | `sr://fabrikam-schemas/123123123234234234234234#1.0.0` | If an output data transformation schema is given in the transformation configuration, `dataschema` is changed to the output schema.         |

#### CreateOrRemap setting

CloudEvent properties are passed through for messages that contain the required properties. If the message does not contain the required properties, the properties are generated.

| Name              | Required | Generated value if missing                                                    |
| ----------------- | -------- | ------------------------------------------------------------------------------|
| `specversion`     | Yes      | `1.0`                                                                         |
| `type`            | Yes      | `ms.aio-dataflow.telemetry`                                                   |
| `source`          | Yes      | `aio://<target-name>`                                                         |
| `id`              | Yes      | Generated UUID in the target client                                           |
| `subject`         | No       | The output topic where the message is sent                                    |
| `time`            | No       | Generated as RFC 3339 in the target client                                    |
| `datacontenttype` | No       | Changed to the output data content type after the optional transform stage    |
| `dataschema`      | No       | Schema defined in the schema registry                                         |