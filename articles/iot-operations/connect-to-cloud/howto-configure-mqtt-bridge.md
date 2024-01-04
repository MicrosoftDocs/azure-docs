---
title: Connect MQTT bridge cloud connector to other MQTT brokers
titleSuffix: Azure IoT MQ
description: Bridge Azure IoT MQ to another MQTT broker.
author: PatAltimore
ms.author: patricka
ms.subservice: mq
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 11/15/2023

#CustomerIntent: As an operator, I want to bridge Azure IoT MQ to another MQTT broker so that I can integrate Azure IoT MQ with other messaging systems.
---

# Connect MQTT bridge cloud connector to other MQTT brokers

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

You can use the Azure IoT MQ MQTT bridge to connect to Azure Event Grid or other MQTT brokers. MQTT bridging is the process of connecting two MQTT brokers together so that they can exchange messages.

- When two brokers are bridged, messages published on one broker are automatically forwarded to the other and vice versa.
- MQTT bridging helps to create a network of MQTT brokers that communicate with each other, and expand MQTT infrastructure by adding additional brokers as needed.
- MQTT bridging is useful for multiple physical locations, sharing MQTT messages and topics between edge and cloud, or when you want to integrate MQTT with other messaging systems.

To bridge to another broker, Azure IoT MQ must know the remote broker endpoint URL, what MQTT version, how to authenticate, and what topics to map. To maximize composability and flexibility in a Kubernetes-native fashion, these values are configured as custom Kubernetes resources ([CRDs](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)) called **MqttBridgeConnector** and **MqttBridgeTopicMap**. This guide walks through how to create the MQTT bridge connector using these resources.

1. Create a YAML file that defines [MqttBridgeConnector](#configure-mqttbridgeconnector) resource. You can use the example YAML, but make sure to change the `namespace` to match the one that has Azure IoT MQ deployed, and the `remoteBrokerConnection.endpoint` to match your remote broker endpoint URL.

1. Create a YAML file that defines [MqttBridgeTopicMap](#configure-mqttbridgetopicmap) resource. You can use example YAML, but make sure to change the `namespace` to match the one that has Azure IoT MQ deployed, and the `mqttBridgeConnectorRef` to match the name of the MqttBridgeConnector resource you created in the earlier step.

1. Deploy the MQTT bridge connector and topic map with `kubectl apply -f <filename>`.

   ```console
   $ kubectl apply -f my-mqtt-bridge.yaml 
   mqttbridgeconnectors.mq.iotoperations.azure.com my-mqtt-bridge created
   $ kubectl apply -f my-topic-map.yaml
   mqttbridgetopicmaps.mq.iotoperations.azure.com my-topic-map created
   ```

Once deployed, use `kubectl get pods` to verify messages start flowing to and from your endpoint.

## Configure MqttBridgeConnector

The MqttBridgeConnector resource defines the MQTT bridge connector that can communicate with a remote broker. It includes the following components:

- One or more MQTT bridge connector instances. Each instance is a container running the MQTT bridge connector.
- A remote broker connection.
- An optional local broker connection.

The following example shows an example configuration for bridging to an Azure Event Grid MQTT broker. It uses system-assigned managed identity for authentication and TLS encryption.

```yaml
apiVersion: mq.iotoperations.azure.com/v1beta1
kind: MqttBridgeConnector
metadata:
  name: my-mqtt-bridge
  namespace: azure-iot-operations
spec:
  image: 
    repository: mcr.microsoft.com/azureiotoperations/mqttbridge 
    tag: 0.1.0-preview
    pullPolicy: IfNotPresent
  protocol: v5
  bridgeInstances: 1
  clientIdPrefix: factory-gateway-
  logLevel: debug
  remoteBrokerConnection:
    endpoint: example.westeurope-1.ts.eventgrid.azure.net:8883
    tls:
      tlsEnabled: true
    authentication:
      systemAssignedManagedIdentity:
        audience: https://eventgrid.azure.net
  localBrokerConnection:
    endpoint: aio-mq-dmqtt-frontend:8883
    tls:
      tlsEnabled: true
      trustedCaCertificateConfigMap: aio-ca-trust-bundle-test-only
    authentication:
      kubernetes: {}
```

The following table describes the fields in the *MqttBridgeConnector* resource:

| Field | Required | Description |
| --- | --- | --- |
| image | Yes | The image of the Kafka connector. You can specify the `pullPolicy`, `repository`, and `tag` of the image. Proper values are shown in the preceding example. |
| protocol | Yes | MQTT protocol version. Can be `v5` or `v3`. See [MQTT v3.1.1 support](#mqtt-v311-support). |
| bridgeInstances | No | Number of instances for the bridge connector. Default is 1. See [Number of instances](#number-of-instances). |
| clientIdPrefix | No | The prefix for the dynamically generated client ID. Default is no prefix. See [Client ID configuration](#client-id-configuration). |
| logLevel | No | Log level. Can be `debug` or `info`. Default is `info`. |
| remoteBrokerConnection | Yes | Connection details of the remote broker to bridge to. See [Remote broker connection](#remote-broker-connection). |
| localBrokerConnection | No | Connection details of the local broker to bridge to. Defaults to shown value. See [Local broker connection](#local-broker-connection). |

### MQTT v3.1.1 support

The bridge connector can be configured to use MQTT v3.1.1 with both the local broker connection for Azure IoT MQ and remote broker connection. However, this breaks shared subscriptions if the remote broker doesn't support it. If you plan to use shared subscriptions, leave it as default *v5*.

### Number of instances

For high availability and scale, configure the MQTT bridge connector to use multiple instances. Message flow and routes are automatically balanced between different instances.

```yaml
spec:
  bridgeInstances: 2
```

### Client ID configuration

Azure IoT MQ generates a client ID for each MqttBridgeConnector client, using a prefix that you specify, in the format of `{clientIdPrefix}-{routeName}`. This client ID is important for Azure IoT MQ to mitigate message loss and avoid conflicts or collisions with existing client IDs since MQTT specification allows only one connection per client ID.

For example, if `clientIdPrefix: "client-"`, and there are two `routes` in the topic map, the client IDs are: *client-route1* and *client-route2*.

### Remote broker connection

The `remoteBrokerConnection` field defines the connection details to bridge to the remote broker. It includes the following fields:

| Field | Required | Description |
| --- | --- | --- |
| endpoint | Yes | Remote broker endpoint URL with port. For example, `example.westeurope-1.ts.eventgrid.azure.net:8883`. |
| tls | Yes | Specifies if connection is encrypted with TLS and trusted CA certificate. See [TLS support](#tls-support) |
| authentication | Yes | Authentication details for Azure IoT MQ to use with the broker. Must be one of the following values: system-assigned managed identity or X.509. See [Authentication](#authentication). |
| protocol | No | String value defining to use MQTT or MQTT over WebSockets. Can be `mqtt` or `webSocket`. Default is `mqtt`. |

#### Authentication

The authentication field defines the authentication method for Azure IoT MQ to use with the remote broker. It includes the following fields:

| Field | Required | Description |
| --- | --- | --- |
| systemAssignedManagedIdentity | No | Authenticate with system-assigned managed identity. See [Managed identity](#managed-identity). |
| x509 | No | Authentication details using X.509 certificates. See [X.509](#x509). |

#### Managed identity

The systemAssignedManagedIdentity field includes the following fields:

| Field | Required | Description |
| --- | --- | --- |
| audience | Yes | The audience for the token. Required if using managed identity. For Event Grid, it's `https://eventgrid.azure.net`. |

If Azure IoT MQ is deployed as an Azure Arc extension, it gets a [system-assignment managed identity](/azure/active-directory/managed-identities-azure-resources/overview) by default. You should use a managed identity for Azure IoT MQ to interact with Azure resources, including Event Grid MQTT broker, because it allows you to avoid credential management and retain high availability.

To use managed identity for authentication with Azure resources, first assign an appropriate Azure RBAC role like [EventGrid TopicSpaces Publisher](#azure-event-grid-mqtt-broker-support) to Azure IoT MQ's managed identity provided by Arc.

Then, specify and *MQTTBridgeConnector* with managed identity as the authentication method:

```yaml
spec:
  remoteBrokerConnection:
    authentication:
      systemAssignedManagedIdentity:
        audience: https://eventgrid.azure.net
```

When you use managed identity, the client ID isn't configurable, and equates to the Azure IoT MQ Azure Arc extension Azure Resource Manager resource ID within Azure.

The system-assigned managed identity is provided by Azure Arc. The certificate associated with the managed identity must be renewed at least every 90 days to avoid a manual recovery process. To learn more, see [How do I address expired Azure Arc-enabled Kubernetes resources?](/azure/azure-arc/kubernetes/faq#how-do-i-address-expired-azure-arc-enabled-kubernetes-resources)

#### X.509

The `x509` field includes the following fields:

| Field | Required | Description |
| --- | --- | --- |
| secretName | Yes | The Kubernetes secret containing the client certificate and private key. You can use Azure Key Vault to manage secrets for Azure IoT MQ instead of Kubernetes secrets. To learn more, see [Manage secrets using Azure Key Vault or Kubernetes secrets](../manage-mqtt-connectivity/howto-manage-secrets.md).|

Many MQTT brokers, like Event Grid, support X.509 authentication. Azure IoT MQ's MQTT bridge can present a client X.509 certificate and negotiate the TLS communication. Use a Kubernetes secret to store the X.509 client certificate, private key and intermediate CA.

```bash
kubectl create secret generic bridge-client-secret \
--from-file=client_cert.pem=mqttbridge.pem \
--from-file=client_key.pem=mqttbridge.key \
--from-file=client_intermediate_certs.pem=intermediate.pem
```

And reference it with  `secretName`:

```yaml
spec:
  remoteBrokerConnection:
    authentication:
      x509:
        secretName: bridge-client-cert
```

### Local broker connection

The `localBrokerConnection` field defines the connection details to bridge to the local broker. 

| Field | Required | Description |
| --- | --- | --- |
| endpoint | Yes | Remote broker endpoint URL with port. |
| tls | Yes | Specifies if connection is encrypted with TLS and trusted CA certificate. See [TLS support](#tls-support) |
| authentication | Yes | Authentication details for Azure IoT MQ to use with the broker. The only supported method is Kubernetes service account token (SAT). To use SAT, specify `kubernetes: {}`. |

By default, IoT MQ is deployed in the namespace `azure-iot-operations` with TLS enabled and SAT authentication.

Then MqttBridgeConnector local broker connection setting must be configured to match. The deployment YAML for the *MqttBridgeConnector* must have `localBrokerConnection` at the same level as `remoteBrokerConnection`. For example, to use TLS with SAT authentication in order to match the default IoT MQ deployment:

```yaml
spec:
  localBrokerConnection:
    endpoint: aio-mq-dmqtt-frontend:8883
    tls:
      tlsEnabled: true
      trustedCaCertificateConfigMap: aio-ca-trust-bundle-test-only
    authentication:
      kubernetes: {}
```

Here, `trustedCaCertifcateName` is the *ConfigMap* for the root CA of Azure IoT MQ, like the [ConfigMap for the root ca of the remote broker](#tls-support). The default root CA is stored in a ConfigMap named `aio-ca-trust-bundle-test-only`.

For more information on obtaining the root CA, see [Configure TLS with automatic certificate management to secure MQTT communication](../manage-mqtt-connectivity/howto-configure-tls-auto.md). 

### TLS support

The `tls` field defines the TLS configuration for the remote or local broker connection. It includes the following fields:

| Field | Required | Description |
| --- | --- | --- |
| tlsEnabled | Yes | Whether TLS is enabled or not. |
| trustedCaCertificateConfigMap | No | The CA certificate to trust when connecting to the broker. Required if TLS is enabled. |

TLS encryption support is available for both remote and local broker connections.

- For remote broker connection: if TLS is enabled, a trusted CA certificate should be specified as a Kubernetes *ConfigMap* reference. If not, the TLS handshake is likely to fail unless the remote endpoint is widely trusted A trusted CA certificate is already in the OS certificate store. For example, Event Grid uses widely trusted CA root so specifying isn't required.
- For local (Azure IoT MQ) broker connection: if TLS is enabled for Azure IoT MQ broker listener, CA certificate that issued the listener server certificate should be specified as a Kubernetes *ConfigMap* reference.

When specifying a trusted CA is required, create a *ConfigMap* containing the public potion of the CA and specify the configmap name in the `trustedCaCertificateConfigMap` property. For example:

```bash
kubectl create configmap client-ca-configmap --from-file ~/.step/certs/root_ca.crt
```

## Configure MqttBridgeTopicMap

The *MqttBridgeTopicMap* resource defines the topic mapping between the local and remote brokers. It must be used along with a *MqttBridgeConnector* resource. It includes the following components:

- The name of the *MqttBridgeConnector* resource to link to.
- A list of routes for bridging.
- An optional shared subscription configuration.

A *MqttBridgeConnector* can use multiple *MqttBridgeTopicMaps* linked with it. When a *MqttBridgeConnector* resource is deployed, Azure IoT MQ operator starts scanning the namespace for any *MqttBridgeTopicMaps* linked with it and automatically manage message flow among the *MqttBridgeConnector* instances. Then, once deployed, the *MqttBridgeTopicMap* is linked with the *MqttBridgeConnector*. Each *MqttBridgeTopicMap* can be linked with only one *MqttBridgeConnector*.

The following example shows a *MqttBridgeTopicMap* configuration for bridging messages from the remote topic `remote-topic` to the local topic `local-topic`:

```yaml
apiVersion: mq.iotoperations.azure.com/v1beta1
kind: MqttBridgeTopicMap
metadata:
  name: my-topic-map
  namespace: azure-iot-operations 
spec:
  mqttBridgeConnectorRef: my-mqtt-bridge
  routes:
    - direction: remote-to-local
      name: first-route
      qos: 0
      source: remote-topic
      target: local-topic
      sharedSubscription:
        groupMinimumShareNumber: 3
        groupName: group1
    - direction: local-to-remote
      name: second-route
      qos: 1
      source: local-topic
      target: remote-topic
```

The following table describes the fields in the MqttBridgeTopicMap resource:

| Fields | Required | Description |
| --- | --- | --- |
| mqttBridgeConnectorRef | Yes | Name of the `MqttBridgeConnector` resource to link to. |
| routes | Yes | A list of routes for bridging. For more information, see [Routes](#routes). |

### Routes

A *MqttBridgeTopicMap* can have multiple routes. The `routes` field defines the list of routes. It includes the following fields:

| Fields | Required | Description |
| --- | --- | --- |
| direction | Yes | Direction of message flow. It can be `remote-to-local` or `local-to-remote`. For more information, see [Direction](#direction). |
| name | Yes | Name of the route. |
| qos | No | MQTT quality of service (QoS). Defaults to 1. |
| source | Yes | Source MQTT topic. Can have wildcards like `#` and `+`. See [Wildcards in the source topic](#wildcards-in-the-source-topic). |
| target | No | Target MQTT topic. Can't have wildcards. If not specified, it would be the same as the source. See [Reference source topic in target](#reference-source-topic-in-target). |
| sharedSubscription | No | Shared subscription configuration. Activates a configured number of clients for additional scale. For more information, see [Shared subscriptions](#shared-subscriptions). |

### Direction

For example, if the direction is local-to-remote, Azure IoT MQ publishes all messages on the specified local topic to the remote topic:

```yaml
routes:
  - direction: local-to-remote
    name: "send-alerts"
    source: "alerts"
    target: "factory/alerts"
```

If the direction is reversed, Azure IoT MQ receives messages from a remote broker. Here, the target is omitted and all messages from the `commands/factory` topic on the remote broker is published on the same topic locally.

```yaml
routes:
  - direction: remote-to-local
    name: "receive-commands"
    source: "commands/factory"
```

### Wildcards in the source topic

To bridge from nonstatic topics, use wildcards to define how the topic patterns should be matched and the rule of the topic name translation. For example, to bridge all messages in all subtopics under `telemetry`, use the multi-level `#` wildcard:

```yaml
routes:
  - direction: local-to-remote
    name: "wildcard-source"
    source: "telemetry/#"
    target: "factory/telemetry"
```

In the example, if a message is published to *any* topic under `telemetry`, like `telemetry/furnace/temperature`, Azure IoT MQ publishes it to the remote bridged broker under the static `factory/telemetry` topic.

For single-level topic wildcard, use `+` instead, like `telemetry/+/temperature`.

The MQTT bridge connector must know the exact topic in the target broker either remote or Azure IoT MQ without any ambiguity. Wildcards are only available as part of `source` topic.

### Reference source topic in target

To reference the entire source topic, omit the target topic configuration in the route completely. Wildcards are supported.

For example, any message published under topic `my-topic/#`, like `my-topic/foo` or `my-topic/bar`, are bridged to the remote broker under the same topic:

```yaml
routes:
  - direction: local-to-remote
    name: "target-same-as-source"
    source: "my-topic/#"
    # No target
```

Other methods of source topic reference aren't supported.

### Shared subscriptions

The `sharedSubscription` field defines the shared subscription configuration for the route. It includes the following fields:

| Fields | Required | Description |
| --- | --- | --- |
| groupMinimumShareNumber | Yes | Number of clients to use for shared subscription. |
| groupName | Yes | Shared subscription group name. |

Shared subscriptions help Azure IoT MQ create more clients for the MQTT bridge. You can set up a different shared subscription for each route. Azure IoT MQ subscribes to messages from the source topic and sends them to one client at a time using round robin. Then, the client publishes the messages to the bridged broker.

For example, if you set up a route with shared subscription and set the `groupMinimumShareNumber` as *3*:

```yaml
routes:
    - direction: local-to-remote
      qos: 1
      source: "shared-sub-topic"
      target: "remote/topic"
      sharedSubscription:
        groupMinimumShareNumber: 3
        groupName: "sub-group"
```

Azure IoT MQ's MQTT bridge creates three subscriber clients no matter how many instances. Only one client gets each message from `$share/sub-group/shared-sub-topic`. Then, the same client publishes the message to the bridged remote broker under topic `remote/topic`. The next message goes to a next client.

This helps you balance the message traffic for the bridge between multiple clients with different IDs. This is useful if your bridged broker limits how many messages each client can send.

## Azure Event Grid MQTT broker support

To minimize credential management, using the system-assigned managed identity and Azure RBAC is the recommended way to bridge Azure IoT MQ with [Azure Event Grid's MQTT broker feature](../../event-grid/mqtt-overview.md).

For an end-to-end tutorial, see [Tutorial: Configure MQTT bridge between IoT MQ and Azure Event Grid](../send-view-analyze-data/tutorial-connect-event-grid.md).

### Connect to Event Grid MQTT broker with managed identity

First, using `az k8s-extension show`, find the principal ID for the Azure IoT MQ Arc extension. Take note of the output value for `identity.principalId`, which should look like `abcd1234-5678-90ab-cdef-1234567890ab`.

```azurecli
az k8s-extension show --resource-group <RESOURCE_GROUP> --cluster-name <CLUSTER_NAME> --name mq --cluster-type connectedClusters --query identity.principalId -o tsv
```

Then, use Azure CLI to [assign](/azure/role-based-access-control/role-assignments-portal) the roles to the Azure IoT MQ Arc extension managed identity. Replace `<MQ_ID>` with the principal ID you found in the previous step. For example, to assign the *EventGrid TopicSpaces Publisher* role:

```azurecli
az role assignment create --assignee <MQ_ID> --role 'EventGrid TopicSpaces Publisher' --scope /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.EventGrid/namespaces/<EVENT_GRID_NAMESPACE>
```

> [!TIP]
> To optimize for principle of least privilege, you can assign the role to a topic space instead of the entire Event Grid namespace. To learn more, see [Event Grid RBAC](../../event-grid/mqtt-client-azure-ad-token-and-rbac.md) and [Topic spaces](../../event-grid/mqtt-topic-spaces.md).

Finally, create an MQTTBridgeConnector and choose [managed identity](#managed-identity) as the authentication method. Create MqttBridgeTopicMaps and deploy the MQTT bridge with `kubectl`.

### Maximum client sessions per authentication name

If `bridgeInstances` is set higher than `1`, configure the Event Grid MQTT broker **Configuration** > **Maximum client sessions per authentication name** to match the number of instances. This configuration prevents issues like *error 151 quota exceeded*.

### Per-connection limit

If using managed identity isn't possible, keep the per-connection limits for Event Grid MQTT broker in mind when designing your setup. At the time of publishing, the limit is 100 messages/second each direction for a connection. To increase the MQTT bridge throughput, use shared subscriptions to increase the number of clients serving each route.

## Bridge from another broker to Azure IoT MQ

Azure IoT MQ is a compliant MQTT broker and other brokers can bridge to it with the appropriate authentication and authorization credentials. For example, see MQTT bridge documentation for [HiveMQ](https://www.hivemq.com/docs/bridge/4.8/enterprise-bridge-extension/bridge-extension.html), [VerneMQ](https://docs.vernemq.com/configuring-vernemq/bridge), [EMQX](https://www.emqx.io/docs/en/v5/data-integration/data-bridge-mqtt.html), and [Mosquitto](https://mosquitto.org/man/mosquitto-conf-5.html).

## Related content

- [Publish and subscribe MQTT messages using Azure IoT MQ](../manage-mqtt-connectivity/overview-iot-mq.md)
