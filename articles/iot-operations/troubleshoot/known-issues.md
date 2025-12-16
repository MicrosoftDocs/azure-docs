---
title: Known Issues 
description: Known issues for the MQTT broker, connector for OPC UA, OPC PLC simulator, data flows, and operations experience web UI.
author: dominicbetts
ms.author: dobett
ms.topic: troubleshooting-known-issue
ms.custom: sfi-ropc-nochange
ms.date: 11/21/2025
---

# Known issues for Azure IoT Operations

This article lists the current known issues you might encounter when using Azure IoT Operations. The guidance helps you identify these issues and provides workarounds where available.

For general troubleshooting guidance, see [Troubleshoot Azure IoT Operations](troubleshoot.md).

## MQTT broker issues

This section lists current known issues for the MQTT broker.

### MQTT broker resources aren't visible in the Azure portal

---

Issue ID: 4257

---

Log signature: N/A

---

MQTT broker resources created in your cluster using Kubernetes aren't visible in the Azure portal. This result is expected because [managing Azure IoT Operations components using Kubernetes is in preview](../deploy-iot-ops/howto-manage-update-uninstall.md#manage-components-using-kubernetes-deployment-manifests-preview), and synchronizing resources from the edge to the cloud isn't currently supported.

There's currently no workaround for this issue.


## General connector issues

This section lists current known issues that affect all connectors.

### Connector doesn't detect updates to device credentials in Azure Key Vault

---

Issue ID: 6514

---

N/A

---

The connector doesn't receive a notification when device credentials stored in Azure Key Vault are updated. As a result, the connector continues to use the old credentials until it's restarted.

Workaround: Restart the connector to force it to retrieve the updated credentials from Azure Key Vault.

### For Akri connectors, the only supported authentication type for registry endpoints is `artifact pull secrets`

---

Issue ID: 4570

---

Log signature: N/A

---

When you specify the registry endpoint reference in a connector template, there are multiple supported authentication methods. Akri connectors only support `artifact pull secrets` authentication.

### Akri connectors don't work with registry endpoint resources

---

Issue ID: 7710

---

Fixed in version 1.2.154 (2512) and later

---

Log signature:

```output
[aio_akri_logs@311 tid="7"] - failed to generate StatefulSet payload for instance rest-connector-template-...
[aio_akri_logs@311 tid="7"] - reconciliation error for Connector resource... 
[aio_akri_logs@311 tid="7"] - reconciliation of Connector resource failed...
```

If you create a `RegistryEndpoint` resource using bicep and reference it in the `ConnectorTemplate` resource then when the Akri operator tries the reconcile the `ConnectorTemplate` it fails with the error shown previously.

Workaround: Don't use `RegistryEndpoint` resources with Akri connectors. Instead, specify the registry information in the `ContainerRegistry` settings in the `ConnectorTemplate` resource.

## Connector for OPC UA issues

This section lists current known issues for the connector for OPC UA.

### Can't use special characters in event names

---

Issue ID: 1532

---

Log signature: `2025-10-22T14:51:59.338Z aio-opc-opc.tcp-1-68ff6d4c59-nj2s4 - Updated schema information for Boiler#1Notifier skipped!`

---

Schema generation fails if event names contain special characters such as `#`, `%`, or `&`. Avoid using these characters in event names to prevent schema generation issues.

## Connector for media and connector for ONVIF issues

This section lists current known issues for the connector for media and the connector for ONVIF.

### Secret sync conflict

---

Issue ID: 0606

---

Log signature: N/A

---

When using secret sync, ensure that secret names are globally unique. If a local secret with the same name exists, connectors might fail to retrieve the intended secret.

### ONVIF asset event destination can only be configured on group or asset level

---

Issue ID: 9545

---

Fixed in version 1.2.154 (2512) and later

---

Log signature similar to:

`No matching event subscription for topic: "tns1:RuleEngine/CellMotionDetector/Motion"`

---

Currently, ONVIF asset event destinations are only recognized at the event group or asset level. Configuring destinations at the individual event level results in log entries similar to the example, and no event data is published to the MQTT broker.

As a workaround, configure the event destination at the event group or asset level instead of the individual event level. For example, using `defaultEventsDestinations` at the event group level:

```yaml
eventGroups:
  - dataSource: ""
    events:
    - dataSource: tns1:RuleEngine/CellMotionDetector/Motion
      destinations:
      - configuration:
          qos: Qos1
          retain: Never
          topic: azure-iot-operations/data/motion
          ttl: 5
        target: Mqtt
      name: Motion
    name: Default
    defaultEventsDestinations:
    - configuration:
        qos: Qos1
        retain: Never
        topic: azure-iot-operations/data/motion
        ttl: 5
      target: Mqtt
```

## Data flows issues

This section lists current known issues for data flows.

### Data flow resources aren't visible in the operations experience web UI

---

Issue ID: 8724

---

Log signature: N/A

---

Data flow custom resources created in your cluster using Kubernetes aren't visible in the operations experience web UI. This result is expected because [managing Azure IoT Operations components using Kubernetes is in preview](../deploy-iot-ops/howto-manage-update-uninstall.md#manage-components-using-kubernetes-deployment-manifests-preview), and synchronizing resources from the edge to the cloud isn't currently supported.

There's currently no workaround for this issue.

### A data flow profile can't exceed 70 data flows

---

Issue ID: 1028

---

Log signature:

`exec /bin/main: argument list too long`

---

If you create more than 70 data flows for a single data flow profile, deployments fail with the error `exec /bin/main: argument list too long`.

To work around this issue, create multiple data flow profiles and distribute the data flows across them. Don't exceed 70 data flows per profile.

### Data flow graphs only support specific endpoint types

---

Issue ID: 5693

---

Log signature: N/A

---

Data flow graphs (WASM) currently only support MQTT, Kafka, and OpenTelemetry (OTel) data flow endpoints. OpenTelemetry endpoints can only be used as destinations in data flow graphs. Other endpoint types like Data Lake, Microsoft Fabric OneLake, Azure Data Explorer, and Local Storage are not supported for data flow graphs.

To work around this issue, use one of the supported endpoint types:
- [MQTT endpoints](../connect-to-cloud/howto-configure-mqtt-endpoint.md) for bi-directional messaging with MQTT brokers
- [Kafka endpoints](../connect-to-cloud/howto-configure-kafka-endpoint.md) for bi-directional messaging with Kafka brokers, including Azure Event Hubs
- [OpenTelemetry endpoints](../connect-to-cloud/howto-configure-opentelemetry-endpoint.md) for sending metrics and logs to observability platforms (destination only)

For more information about data flow graphs, see [Use WebAssembly (WASM) with data flow graphs](../connect-to-cloud/howto-dataflow-graph-wasm.md).

### Can't use the same graph definition multiple times in a chained graph scenario

---

Issue ID: 1352

---

Failed to send config

---

You create a chained graph scenario by using the output of one data flow graph as the input to another data flow graph. However, if you try to use the same graph definition multiple times in this scenario, it currently doesn't work as expected. For example, the following code fails when using the same graph definition (`graph-passthrough:1.3.6`) for both `graph-1` and `graph-2`.

```bicep
      {
          nodeType: 'Graph'
          name: 'graph-1'
          graphSettings: {
            registryEndpointRef: dataflowRegistryEndpoint.name
            artifact: 'graph-passthrough:1.3.6'
            configuration: []
            }
      }
      {
          nodeType: 'Graph'
          name: 'graph-2'
          graphSettings: {
            registryEndpointRef: dataflowRegistryEndpoint.name
            artifact: 'graph-passthrough:1.3.6'
            configuration: graphConfiguration
            }
      }
  nodeConnections: [
      {
          from: {name: 'source'}
          to: {name: 'graph-1'}
      }
      {
          from: {name: 'graph-1'}
          to: {name: 'graph-2'}
      }
      {
          from: {name: 'graph-2'}
          to: {name: 'destination'}
      }
  ]
```

To solve this error, push the graph definition to the ACR as many times as needed with the scenario with a different name or tag each time. For example, in the scenario described, the graph definition need to be pushed twice with either a different name or a different tag, such as `graph-passthrough-one:1.3.6` and `graph-passthrough-two:1.3.6`.
