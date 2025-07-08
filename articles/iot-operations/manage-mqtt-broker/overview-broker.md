---
title: Publish and Subscribe MQTT Messages Using Azure MQTT Broker
description: Use MQTT broker to publish and subscribe to messages. Destinations include other MQTT brokers, data flows, and Azure cloud services.
#customer intent: As a solution architect, I want to learn about the architecture of the Azure MQTT Broker so that I can design fault-tolerant and scalable IoT solutions.  
author: PatAltimore
ms.author: patricka
ms.subservice: azure-mqtt-broker
ms.topic: concept-article
ms.custom:
  - ignite-2023
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:05/07/2025
ms.date: 06/06/2025
ms.service: azure-iot-operations
---

# Azure IoT Operations built-in local MQTT broker

[!INCLUDE [kubernetes-management-preview-note](../includes/kubernetes-management-preview-note.md)]

Azure IoT Operations includes an MQTT broker that's enterprise grade and standards compliant. The MQTT broker is scalable, highly available, and Kubernetes native. It provides the messaging plane for IoT Operations, enables bidirectional edge-to-cloud communication, and supports [event-driven applications](/azure/architecture/guide/architecture-styles/event-driven) at the edge.

## MQTT compliance

MQTT is a common protocol in the IoT space. Its simple design lets a single broker serve thousands of clients simultaneously with lightweight publish-subscribe topic creation and management. Many IoT devices natively support MQTT. Downstream translation gateways convert various IoT protocols into MQTT.

The MQTT broker supports the messaging layer in IoT Operations and is compatible with MQTT v3.1.1 and MQTT v5. For more information about supported MQTT features, see [MQTT feature support in MQTT broker](../reference/mqtt-support.md).

## Architecture

The MQTT broker has two major layers:

- Stateless frontend layer
- Stateful and sharded backend layer

The frontend layer handles client connections and requests, and it routes them to the backend. The backend layer partitions data by keys, like a client ID for client sessions and a topic name for topic messages. The backend layer uses chain replication to copy data within each partition.

The goals of the architecture are:

- **Fault tolerance and isolation**: Message publishing continues if backend pods fail, and failures don't propagate to the rest of the system.
- **Failure recovery**: Automatic failure recovery without operator intervention.
- **No message loss**: Messages are delivered if at least one frontend pod and one backend pod in a partition are running.
- **Elastic scaling**: Horizontal scaling of publishing and subscribing throughput supports edge and cloud deployments.
- **Consistent performance at scale**: Limits message latency overhead due to chain replication.
- **Operational simplicity**: Reduces dependency on external components to simplify maintenance and complexity.

## Configuration

For configuration, the MQTT broker uses several Kubernetes custom resources to define different aspects of the broker's behavior and functionality:

- The main resource is [Broker](/rest/api/iotoperations/broker), which defines the global settings like cardinality, memory usage profile, and diagnostic settings.
- A Broker resource can have up to three [BrokerListeners](/rest/api/iotoperations/broker-listener), each of which listens for incoming MQTT connections on the specified service type (`NodePort`, `LoadBalancer`, or `ClusterIP`). Each BrokerListener resource can have multiple ports.
- Each port within a BrokerListener resource can be associated with a [BrokerAuthentication](/rest/api/iotoperations/broker-authentication) resource and a [BrokerAuthorization](/rest/api/iotoperations/broker-authorization) resource. These authentication and authorization policies determine which clients can connect to the port and what actions they can perform on the broker.

The relationship between Broker and BrokerListener is *one-to-many*, while the relationship between BrokerListener and BrokerAuthentication/BrokerAuthorization is *many-to-many*. The entity relationship diagram for these resources is:

<!-- ```mermaid
erDiagram
    Broker ||--|{ BrokerListener : "exposes"
    BrokerListener ||--|{ Port : "contains"
    Port }|..o{ BrokerAuthentication : "uses" 
    Port }|..o{ BrokerAuthorization : "uses"
``` -->

:::image type="content" source="media/overview-broker/broker-resources.svg" alt-text="Diagram that shows the broker resource model.":::

By default, IoT Operations deploys a [default Broker](#default-broker-resource), a [default BrokerListener](howto-configure-brokerlistener.md#default-brokerlistener), and a [default BrokerAuthentication](howto-configure-authentication.md#default-brokerauthentication-resource). All of these resources are named *default*. Together, these resources provide a basic MQTT broker setup required for IoT Operations to function. The default setup is:

<!-- ```mermaid
erDiagram
    Broker ||--|| BrokerListener : "exposes"
    Broker {
           name default
    }
    BrokerListener ||--|| Port : "contains"
    BrokerListener {
           name default
           serviceType ClusterIP
    }
    Port ||..|| BrokerAuthentication : "uses" 
    Port {
           port *18883
    }
    BrokerAuthentication {
           name default
           method ServiceAccountToken
    }
``` -->

:::image type="content" source="media/overview-broker/default-broker-resources.svg" alt-text="Diagram that shows the default broker resources and relationships between them.":::

> [!IMPORTANT]
> To avoid disrupting communication between IoT Operations internal components, don't modify any default configuration.
> 
> To customize the MQTT broker deployment, add new resources such as BrokerListeners, BrokerAuthentication, and BrokerAuthorization to the default Broker.
> 
> The Broker resource is immutable and can't be modified after deployment, but it requires customization only in advanced scenarios. To learn more about customizing the Broker resource, see [Customize default Broker](#customize-default-broker).

In a full deployment, you could have multiple BrokerListeners, each with multiple ports, and each port could have different BrokerAuthentication and BrokerAuthorization resources associated with it.

For example, starting from the default setup, you add:

- A LoadBalancer BrokerListener named *example-lb-listener*, with the two ports 1883 and 8883.
- A NodePort BrokerListener named *example-nodeport-listener*, with the single port 1884 (`nodePort` 31884).
- A BrokerAuthentication resource named *example-authn*, with a custom authentication method.
- A BrokerAuthorization resource named *example-authz*, with your custom authorization settings.

If you configure all the new ports with the same BrokerAuthentication and BrokerAuthorization resources, the setup looks like this:

<!-- ```mermaid
erDiagram
    Broker ||--|| BrokerListener : "exposes"
    Broker {
           name default
    }
    BrokerListener ||--|| Port : "contains"
    BrokerListener {
           name default
           serviceType ClusterIP
    }
    Broker ||--|| BrokerListener1 : "exposes"
    Broker ||--|| BrokerListener2 : "exposes"
    BrokerListener1 ||--|| Port1 : "contains"
    BrokerListener1 {
           name example-lb-listener
           serviceType LoadBalancer
    }
    Port ||..|| BrokerAuthentication : "uses" 
    Port {
           port *18883
    }
    BrokerListener1 ||--|| Port2 : "contains"
    Port2 {
           port *1883
    }
    Port2 ||..|| BrokerAuthentication1 : "uses"
    BrokerAuthentication {
           name default
           method ServiceAccountToken
    }
    Port1 ||..|| BrokerAuthentication1 : "uses"
    Port1 {
           port *8883
    }
    BrokerAuthentication1 {
           name example-authn
           method Custom
    }
    Port1 ||..|| BrokerAuthorization1 : "uses"
    Port2 ||..|| BrokerAuthorization1 : "uses"
    BrokerAuthorization1 {
           name example-authz
    }
    BrokerListener2 ||--|| Port3 : "contains"
    BrokerListener2 {
           name example-nodeport-listener
           serviceType NodePort
    }
    Port3 {
           port *1884
           nodePort *31884
    }
    Port3 ||..|| BrokerAuthentication1 : "uses"
    Port3 ||..|| BrokerAuthorization1 : "uses"
``` -->

:::image type="content" source="media/overview-broker/full-broker-deployment-resources.svg" alt-text="Diagram that shows a full custom broker deployment and relationships between each.":::

This approach keeps the default setup intact and lets you add new resources to customize the MQTT broker deployment.

## Default Broker resource

Each IoT Operations deployment can have only one broker, and it must be named *default*. The default broker resource is required for IoT Operations to function. It's immutable and can't be modified after deployment.

> [!CAUTION]
> Don't delete the default broker resource. Doing so disrupts communication between IoT Operations internal components, and the deployment stops functioning.

### Customize default Broker

Customizing the default broker resource isn't required for most setups. The settings that require customization include:

- [Cardinality](./howto-configure-availability-scale.md#configure-scaling-settings): Determines the broker's capacity to handle more connections and messages, and it enhances high availability if there are pod or node failures.
- [Memory profile](./howto-configure-availability-scale.md#configure-memory-profile): Sets the maximum memory usage of the broker and how to handle memory usage as the broker scales up.
- [Disk-backed message buffer](./howto-disk-backed-message-buffer.md): Configuration for buffering messages to disk as RAM fills up.
- [Diagnostics settings](./howto-broker-diagnostics.md): Configuration for diagnostic settings like log level and metrics endpoint.
- [Advanced MQTT client options](./howto-broker-mqtt-client-options.md): Configuration for advanced MQTT client options like session expiry, message expiry, and keep-alive settings.
- [Encryption of internal traffic](./howto-encrypt-internal-traffic.md): Configuration for encrypting internal traffic between broker frontend and backend pods.

You can customize the default broker only during the initial deployment, by using the Azure CLI or the Azure portal. A new deployment is required if you need different broker configuration settings.

To customize the default Broker during deployment:

# [Portal](#tab/portal)

When you follow the guide to [deploy IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md), in the **Configuration** section, look under **MQTT broker configuration**. Here, you can [customize cardinality and memory profile settings](./howto-configure-availability-scale.md). To configure other settings, including disk-backed message buffer, and advanced MQTT client options, use the Azure CLI.

# [Azure CLI](#tab/azure-cli)

To configure settings like the disk-backed message buffer and advanced MQTT client options, use the `--broker-config-file` flag during `az iot ops create`. To learn more, see [Azure CLI support for advanced MQTT broker configuration](https://aka.ms/aziotops-broker-config).

# [Bicep](#tab/bicep)

Use the Azure portal or the Azure CLI to customize the default Broker resource.

# [Kubernetes (preview)](#tab/kubernetes)

Use the Azure portal or the Azure CLI to customize the default Broker resource.

---

> [!IMPORTANT] 
> You can't update the broker resource after the initial deployment. Configuration changes to cardinality, memory profile, or the disk buffer aren't allowed post-deployment.
>
> As a workaround, when deploying Azure IoT Operations with the [az iot ops init](/cli/azure/iot/ops#az-iot-ops-init) command, you can include the `--broker-config-file` parameter with a JSON configuration file for the MQTT broker. For more information, see [Advanced MQTT broker config](https://github.com/Azure/azure-iot-ops-cli-extension/wiki/Advanced-Mqtt-Broker-Config) and [Configure core MQTT broker settings](../manage-mqtt-broker/howto-configure-availability-scale.md).

### View default Broker settings

To view the settings for the default broker:

# [Portal](#tab/portal)

1. In the Azure portal, go to your IoT Operations instance.
1. Under **Components**, select **MQTT Broker**.
1. Under **Broker details**, select **JSON view**.

# [Azure CLI](#tab/azure-cli)

```azurecli
az iot ops broker show --name default --instance <INSTANCE_NAME> --resource-group <RESOURCE_GROUP>
```

# [Bicep](#tab/bicep)

Use the Azure portal, the Azure CLI, or Kubernetes to view the default Broker resource.

# [Kubernetes (preview)](#tab/kubernetes)

```bash
kubectl get broker default -n azure-iot-operations -o yaml
```

---

## Related content

- [Deploy IoT Operations to an Azure Arc-enabled Kubernetes cluster](../deploy-iot-ops/howto-deploy-iot-operations.md)
