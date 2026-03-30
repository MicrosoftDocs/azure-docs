---
title: Configure disk persistence for data flows
description: Enable disk persistence to keep data flow processing state across restarts in Azure IoT Operations.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 03/19/2026
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to enable disk persistence for my data flows to prevent data loss during restarts.
---

# Configure disk persistence for data flows in Azure IoT Operations

[!INCLUDE [kubernetes-management-preview-note](../includes/kubernetes-management-preview-note.md)]

Disk persistence lets data flows and data flow graphs keep processing state across restarts. When you enable this feature, the MQTT broker persists data (like messages in the subscriber queue) to disk. This approach makes sure your data flow's data source doesn't lose data during power outages or broker restarts. The broker maintains optimal performance because persistence is configured per data flow, so only the data flows that need it use this feature.

The data flow requests persistence during subscription by using an MQTTv5 user property. This feature works only when:

- The data flow uses the MQTT broker or asset as the source
- The MQTT broker has persistence enabled with dynamic persistence mode set to `Enabled` for the data type, like subscriber queues

For details about MQTT broker persistence configuration, see [Configure MQTT broker persistence](../manage-mqtt-broker/howto-broker-persistence.md).

The setting accepts `Enabled` or `Disabled`. `Disabled` is the default.

## Configure for a data flow

# [Operations experience](#tab/portal)

When you create or edit a data flow, select **Edit**, and then select **Yes** next to **Request data persistence**.

# [Azure CLI](#tab/cli)

Add the `requestDiskPersistence` property to your data flow configuration file:

```json
{
    "mode": "Enabled",
    "requestDiskPersistence": "Enabled",
    "operations": [
        // ... your data flow operations
    ]
}
```

# [Bicep](#tab/bicep)

Add the `requestDiskPersistence` property to your data flow resource. The API version is `2025-10-01` or later:

```bicep
resource dataflow 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflows@2025-10-01' = {
  parent: defaultDataflowProfile
  name: dataflowName
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    mode: 'Enabled'
    requestDiskPersistence: 'Enabled'
    operations: [
      // ... your data flow operations
    ]
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

Add the `requestDiskPersistence` property to your data flow spec:

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: Dataflow
metadata:
  name: <DATAFLOW_NAME>
  namespace: azure-iot-operations
spec:
  profileRef: default 
  mode: Enabled
  requestDiskPersistence: Enabled
  operations:
    # ... your data flow operations
```

---

## Configure for a data flow graph

# [Operations experience](#tab/portal)

When you create or edit a data flow graph, select **Edit**, and then select **Yes** next to **Request data persistence**.

# [Azure CLI](#tab/cli)

The API doesn't currently support disk persistence configuration for data flow graphs through the CLI.

# [Bicep](#tab/bicep)

Add the `requestDiskPersistence` property to your data flow graph resource:

```bicep
resource dataflowGraph 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflowGraphs@2026-03-01' = {
  parent: dataflowProfile
  name: 'my-graph'
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    requestDiskPersistence: 'Enabled'
    nodes: [
      // ... your graph nodes
    ]
    nodeConnections: [
      // ... your node connections
    ]
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

Add the `requestDiskPersistence` property to your data flow graph spec:

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowGraph
metadata:
  name: <GRAPH_NAME>
  namespace: azure-iot-operations
spec:
  profileRef: default
  requestDiskPersistence: Enabled
  nodes:
    # ... your graph nodes
  nodeConnections:
    # ... your node connections
```

---

## Related content

- [Create a data flow](howto-create-dataflow.md)
- [Data flow graphs overview](concept-dataflow-graphs.md)
- [Configure MQTT broker persistence](../manage-mqtt-broker/howto-broker-persistence.md)
