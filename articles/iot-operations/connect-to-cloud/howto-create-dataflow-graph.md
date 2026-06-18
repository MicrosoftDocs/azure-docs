---
title: Create a data flow graph in Azure IoT Operations
description: Learn how to create a data flow graph to process data with composable transforms in Azure IoT Operations.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 06/17/2026
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to create a data flow graph to process data with transforms like map, filter, and window.
---

# Process data with data flow graphs

A data flow graph is a composable processing pipeline that transforms data as it moves between sources and destinations. A standard [data flow](howto-create-dataflow.md) follows a fixed enrich, filter, map sequence. A data flow graph lets you chain transforms in any order, branch into parallel paths, and aggregate data over time windows.

This article walks through creating a data flow graph step by step. For an overview of data flow graphs and the available transforms, see [Data flow graphs overview](concept-dataflow-graphs.md).

> [!IMPORTANT]
> Data flow graphs currently support only MQTT, Kafka, and OpenTelemetry endpoints. Other endpoint types like Data Lake, Microsoft Fabric OneLake, Azure Data Explorer, and Local Storage aren't supported. For more information, see [Known issues](../troubleshoot/known-issues.md#data-flow-graphs-only-support-specific-endpoint-types).

## Prerequisites

[!INCLUDE [prereq-deployed-instance](../includes/prereq-deployed-instance.md)]

[!INCLUDE [prereq-azure-cli](../includes/prereq-azure-cli.md)]

- Azure IoT Operations version 1.2 or later.

- A [data flow profile](howto-configure-dataflow-profile.md). You can use the default profile.

- A [data flow endpoint](howto-configure-dataflow-endpoint.md) for your source and destination. The default MQTT broker endpoint works for getting started.

## Create a data flow graph

A data flow graph contains three types of elements: **sources** that bring data in, **transforms** that process it, and **destinations** that send it out. Connect them in the order you want data to flow.

# [Operations experience](#tab/portal)

1. In the [Operations experience](https://iotoperations.azure.com/), go to your Azure IoT Operations instance.

1. Select **Data flow graph** > **Create data flow graph**.

    :::image type="content" source="media/howto-create-dataflow-graph/dataflow-graph-list.png" alt-text="Screenshot of operations experience showing data flow graph." lightbox="media/howto-create-dataflow-graph/dataflow-graph-list.png":::

1. Enter a name for the data flow graph and select a data flow profile. The default profile is selected by default.

    :::image type="content" source="media/howto-create-dataflow-graph/create-graph-dialog.png" alt-text="Screenshot of the operations experience create dialog showing the name field and profile dropdown." lightbox="media/howto-create-dataflow-graph/create-graph-dialog.png":::

1. Build your pipeline by adding elements to the canvas:

    1. **Add a source**: Select the source endpoint and configure the topics to subscribe to for incoming messages.

       :::image type="content" source="media/howto-create-dataflow-graph/source-configuration.png" alt-text="Screenshot of the operations experience source configuration panel showing endpoint dropdown and topic input." lightbox="media/howto-create-dataflow-graph/source-configuration.png":::

       1. **Add transforms**: Select one or more transforms to process the data. Available transforms include map, filter, branch, concatenate, and window. For details on each transform type, see [Data flow graphs overview](concept-dataflow-graphs.md#available-transforms).

       :::image type="content" source="media/howto-create-dataflow-graph/transform-selection.png" alt-text="Screenshot of the operations experience transform selection menu showing available transform types." lightbox="media/howto-create-dataflow-graph/transform-selection.png":::

       :::image type="content" source="media/howto-create-dataflow-graph/branch-transform-example.png" alt-text="Screenshot of the operations experience showing a branch transform configuration example.Screenshot of the operations experience showing a branch transform configuration example." lightbox="media/howto-create-dataflow-graph/branch-transform-example.png":::

    1. **Add a destination**: Select the destination endpoint and configure the topic or path to send processed data to.

        :::image type="content" source="media/howto-create-dataflow-graph/destination-configuration.png" alt-text="Screenshot of the operations experience showing a destination example." lightbox="media/howto-create-dataflow-graph/destination-configuration.png":::

1. Connect the elements in the order you want data to flow.

    :::image type="content" source="media/howto-create-dataflow-graph/connected-pipeline.png" alt-text="Screenshot of the operations experience canvas showing a connected source, transform, and destination pipeline." lightbox="media/howto-create-dataflow-graph/connected-pipeline.png":::

1. Select **Save** to deploy the data flow graph.

# [Azure CLI](#tab/cli)

The Azure CLI applies a data flow graph from a single JSON config file that contains all nodes and connections. Use [`az iot ops dataflowgraph apply`](/cli/azure/iot/ops/dataflowgraph#az-iot-ops-dataflowgraph-apply) to create or replace the graph. The example below reads temperature data, converts it to Fahrenheit, and sends it to a destination topic.

Create a `graph.json` file with the data flow graph properties. In the `graph.json` file, each transform's rules are stored in the `value` field as an escaped JSON string. For the readable form of each transform's rules, see the how-to for that transform type.

```json
{
  "mode": "Enabled",
  "nodes": [
    {
      "nodeType": "Source",
      "name": "sensors",
      "sourceSettings": {
        "endpointRef": "default",
        "dataSources": [
          "telemetry/temperature"
        ]
      }
    },
    {
      "nodeType": "Graph",
      "name": "convert",
      "graphSettings": {
        "registryEndpointRef": "default",
        "artifact": "azureiotoperations/graph-dataflow-map:1.0.0",
        "configuration": [
          {
            "key": "rules",
            "value": "{\"map\":[{\"inputs\":[\"*\"],\"output\":\"*\"},{\"inputs\":[\"temperature\"],\"output\":\"temperature_f\",\"expression\":\"cToF($1)\"}]}"
          }
        ]
      }
    },
    {
      "nodeType": "Destination",
      "name": "output",
      "destinationSettings": {
        "endpointRef": "default",
        "dataDestination": "telemetry/converted"
      }
    }
  ],
  "nodeConnections": [
    {
      "from": {
        "name": "sensors"
      },
      "to": {
        "name": "convert"
      }
    },
    {
      "from": {
        "name": "convert"
      },
      "to": {
        "name": "output"
      }
    }
  ]
}
```

Apply the config file. The `extendedLocation` is added automatically from the instance and resource group, so don't include it in the file.

```azurecli
az iot ops dataflowgraph apply \
  --name temperature-processing \
  --instance <INSTANCE_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --config-file graph.json
```

The graph is associated with the `default` data flow profile. To use a different profile, add `--profile <PROFILE_NAME>`.

# [Bicep](#tab/bicep)

Create a Bicep `.bicep` file with the following structure. This example creates a data flow graph that reads temperature data, converts it to Fahrenheit, and sends it to a destination topic.

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'

resource aioInstance 'Microsoft.IoTOperations/instances@2025-10-01' existing = {
  name: aioInstanceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource defaultDataflowProfile 'Microsoft.IoTOperations/instances/dataflowProfiles@2025-10-01' existing = {
  parent: aioInstance
  name: 'default'
}

resource dataflowGraph 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflowGraphs@2025-10-01' = {
  parent: defaultDataflowProfile
  name: 'temperature-processing'
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    profileRef: 'default'
    mode: 'Enabled'
    nodes: [
      {
        nodeType: 'Source'
        name: 'sensors'
        sourceSettings: {
          endpointRef: 'default'
          dataSources: [
            'telemetry/temperature'
          ]
        }
      }
      {
        nodeType: 'Graph'
        name: 'convert'
        graphSettings: {
          registryEndpointRef: 'default'
          artifact: 'azureiotoperations/graph-dataflow-map:1.0.0'
          configuration: [
            {
              key: 'rules'
              value: '{"map":[{"inputs":["*"],"output":"*"},{"inputs":["temperature"],"output":"temperature_f","expression":"cToF($1)"}]}'
            }
          ]
        }
      }
      {
        nodeType: 'Destination'
        name: 'output'
        destinationSettings: {
          endpointRef: 'default'
          dataDestination: 'telemetry/converted'
        }
      }
    ]
    nodeConnections: [
      {
        from: { name: 'sensors' }
        to: { name: 'convert' }
      }
      {
        from: { name: 'convert' }
        to: { name: 'output' }
      }
    ]
  }
}
```

Deploy the Bicep file:

```azurecli
az deployment group create --resource-group <RESOURCE_GROUP> --template-file <FILE>.bicep
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

Create a Kubernetes manifest `.yaml` file with the following structure. This example creates a data flow graph that reads temperature data, converts it to Fahrenheit, and sends it to a destination topic.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowGraph
metadata:
  name: temperature-processing
  namespace: azure-iot-operations
spec:
  profileRef: default
  nodes:
    - nodeType: Source
      name: sensors
      sourceSettings:
        endpointRef: default
        dataSources:
          - telemetry/temperature

    - nodeType: Graph
      name: convert
      graphSettings:
        registryEndpointRef: default
        artifact: azureiotoperations/graph-dataflow-map:1.0.0
        configuration:
          - key: rules
            value: |
              {
                "map": [
                  {
                    "inputs": ["*"],
                    "output": "*"
                  },
                  {
                    "inputs": ["temperature"],
                    "output": "temperature_f",
                    "expression": "cToF($1)"
                  }
                ]
              }

    - nodeType: Destination
      name: output
      destinationSettings:
        endpointRef: default
        dataDestination: telemetry/converted

  nodeConnections:
    - from:
        name: sensors
      to:
        name: convert
    - from:
        name: convert
      to:
        name: output
```

Apply the manifest:

```bash
kubectl apply -f <FILE>.yaml
```

---

## Configure the source

The source defines where data enters the pipeline. Specify an endpoint reference and one or more topics.

# [Operations experience](#tab/portal)

In the data flow graph editor, select the source element and configure:

| Setting | Description |
|---------|-------------|
| **Endpoint** | The data flow endpoint to use. Select *default* for the local MQTT broker. |
| **Topics** | One or more topics to subscribe to for incoming messages. |

# [Azure CLI](#tab/cli)

The CLI applies the whole graph at once, so configure the source as a `Source` node in your `graph.json` config file, then run [`az iot ops dataflowgraph apply`](/cli/azure/iot/ops/dataflowgraph#az-iot-ops-dataflowgraph-apply):

```json
{
  "nodeType": "Source",
  "name": "sensors",
  "sourceSettings": {
    "endpointRef": "default",
    "dataSources": [
      "telemetry/temperature",
      "telemetry/humidity"
    ]
  }
}
```

# [Bicep](#tab/bicep)

```bicep
{
  nodeType: 'Source'
  name: 'sensors'
  sourceSettings: {
    endpointRef: 'default'
    dataSources: [
      'telemetry/temperature'
      'telemetry/humidity'
    ]
  }
}
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```yaml
- nodeType: Source
  name: sensors
  sourceSettings:
    endpointRef: default
    dataSources:
      - telemetry/temperature
      - telemetry/humidity
```

---

## Add transforms

Transforms process data between the source and destination. Each transform references a built-in artifact and is configured with rules.

The available built-in transforms are:

| Transform | Artifact | Description |
|-----------|----------|-------------|
| Map | `azureiotoperations/graph-dataflow-map:1.0.0` | Rename, restructure, compute, and copy fields |
| Filter | `azureiotoperations/graph-dataflow-filter:1.0.0` | Drop messages that match a condition |
| Branch | `azureiotoperations/graph-dataflow-branch:1.0.0` | Route messages to a `true` or `false` path |
| Concatenate | `azureiotoperations/graph-dataflow-concatenate:1.0.0` | Merge branched paths back together |
| Window | `azureiotoperations/graph-dataflow-window:1.0.0` | Aggregate data over a time interval |

For detailed configuration of each transform type, see:

- [Transform data with map](howto-dataflow-graphs-map.md)
- [Filter and route data](howto-dataflow-graphs-filter-route.md)
- [Aggregate data over time](howto-dataflow-graphs-window.md)
- [Enrich with external data](howto-dataflow-graphs-enrich.md)

# [Operations experience](#tab/portal)

In the data flow graph editor, select **Add transform** and choose the transform type. Configure the rules in the visual editor.

# [Azure CLI](#tab/cli)

Each transform is a node with `nodeType` set to `Graph` in your `graph.json` config file. The transform's rules are a JSON object, like this map that converts temperature to Fahrenheit:

```json
{
  "map": [
    {
      "inputs": ["temperature"],
      "output": "temperature_f",
      "expression": "cToF($1)"
    }
  ]
}
```

The `configuration` property takes these rules as a string, so the rules JSON is escaped and placed in the `value` field. Apply the full graph with [`az iot ops dataflowgraph apply`](/cli/azure/iot/ops/dataflowgraph#az-iot-ops-dataflowgraph-apply):

```json
{
  "nodeType": "Graph",
  "name": "convert",
  "graphSettings": {
    "registryEndpointRef": "default",
    "artifact": "azureiotoperations/graph-dataflow-map:1.0.0",
    "configuration": [
      {
        "key": "rules",
        "value": "{\"map\":[{\"inputs\":[\"temperature\"],\"output\":\"temperature_f\",\"expression\":\"cToF($1)\"}]}"
      }
    ]
  }
}
```

> [!TIP]
> To generate the escaped string, save the rules to a file like `rules.json`, then run `jq -c . rules.json` and paste the single-line output into the `value` field.


# [Bicep](#tab/bicep)

Each transform is a node with `nodeType: 'Graph'`. The `configuration` property passes rules as a JSON string:

```bicep
{
  nodeType: 'Graph'
  name: 'convert'
  graphSettings: {
    registryEndpointRef: 'default'
    artifact: 'azureiotoperations/graph-dataflow-map:1.0.0'
    configuration: [
      {
        key: 'rules'
        value: '{"map":[{"inputs":["temperature"],"output":"temperature_f","expression":"cToF($1)"}]}'
      }
    ]
  }
}
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

Each transform is a node with `nodeType: Graph`. The `configuration` property passes rules as a JSON string:

```yaml
- nodeType: Graph
  name: convert
  graphSettings:
    registryEndpointRef: default
    artifact: azureiotoperations/graph-dataflow-map:1.0.0
    configuration:
      - key: rules
        value: |
          {
            "map": [
              {
                "inputs": ["temperature"],
                "output": "temperature_f",
                "expression": "cToF($1)"
              }
            ]
          }
```

---

### Chain multiple transforms

You can chain any number of transforms. Connect them in the `nodeConnections` section in the order you want data to flow:

# [Operations experience](#tab/portal)

Drag connections between transforms on the canvas to define the processing order.

# [Azure CLI](#tab/cli)

Define the processing order in the `nodeConnections` section of your `graph.json` config file:

```json
"nodeConnections": [
  {
    "from": {
      "name": "sensors"
    },
    "to": {
      "name": "remove-bad-data"
    }
  },
  {
    "from": {
      "name": "remove-bad-data"
    },
    "to": {
      "name": "convert"
    }
  },
  {
    "from": {
      "name": "convert"
    },
    "to": {
      "name": "output"
    }
  }
]
```

# [Bicep](#tab/bicep)

```bicep
nodeConnections: [
  { from: { name: 'sensors' }, to: { name: 'remove-bad-data' } }
  { from: { name: 'remove-bad-data' }, to: { name: 'convert' } }
  { from: { name: 'convert' }, to: { name: 'output' } }
]
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```yaml
nodeConnections:
  - from: { name: sensors }
    to: { name: remove-bad-data }
  - from: { name: remove-bad-data }
    to: { name: convert }
  - from: { name: convert }
    to: { name: output }
```

---

## Configure the destination

The destination defines where processed data is sent. Specify an endpoint reference and a topic or path.

# [Operations experience](#tab/portal)

Select the destination element and configure:

| Setting | Description |
|---------|-------------|
| **Endpoint** | The data flow endpoint to send data to. |
| **Topic** | The topic or path to publish processed data to. |

# [Azure CLI](#tab/cli)

Configure the destination as a `Destination` node in your `graph.json` config file, then apply the full graph with [`az iot ops dataflowgraph apply`](/cli/azure/iot/ops/dataflowgraph#az-iot-ops-dataflowgraph-apply):

```json
{
  "nodeType": "Destination",
  "name": "output",
  "destinationSettings": {
    "endpointRef": "default",
    "dataDestination": "telemetry/processed"
  }
}
```

# [Bicep](#tab/bicep)

```bicep
{
  nodeType: 'Destination'
  name: 'output'
  destinationSettings: {
    endpointRef: 'default'
    dataDestination: 'telemetry/processed'
  }
}
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```yaml
- nodeType: Destination
  name: output
  destinationSettings:
    endpointRef: default
    dataDestination: telemetry/processed
```

---

For dynamic topic routing based on message content, see [Route messages to different topics](howto-dataflow-graphs-topic-routing.md).

## Verify the data flow graph is working

After you deploy a data flow graph, verify it's running:

# [Operations experience](#tab/portal)

In the Operations experience, select your data flow graph to view its status. A healthy graph shows a **Running** state.

# [Azure CLI](#tab/cli)

Use [`az iot ops dataflowgraph show`](/cli/azure/iot/ops/dataflowgraph#az-iot-ops-dataflowgraph-show) to view a graph's details:

```azurecli
az iot ops dataflowgraph show \
  --name temperature-processing \
  --instance <INSTANCE_NAME> \
  --resource-group <RESOURCE_GROUP>
```

To list all data flow graphs associated with a profile, use [`az iot ops dataflowgraph list`](/cli/azure/iot/ops/dataflowgraph#az-iot-ops-dataflowgraph-list):

```azurecli
az iot ops dataflowgraph list \
  --instance <INSTANCE_NAME> \
  --resource-group <RESOURCE_GROUP>
```

# [Bicep](#tab/bicep)

Check the status of the `DataflowGraph` resource:

```azurecli
az resource show --resource-group <RESOURCE_GROUP> --resource-type Microsoft.IoTOperations/instances/dataflowProfiles/dataflowGraphs --name <GRAPH_NAME> --parent instances/<INSTANCE_NAME>/dataflowProfiles/<PROFILE_NAME>
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

```bash
kubectl get dataflowgraph temperature-processing -n azure-iot-operations
```

Check the pod logs for any errors:

```bash
kubectl logs -l app=dataflow -n azure-iot-operations --tail=50
```

---

## Next steps

- [Data flow graphs overview](concept-dataflow-graphs.md)
- [Configure a source](howto-configure-dataflow-source.md)
- [Configure a destination](howto-configure-dataflow-destination.md)
- [Transform data with map](howto-dataflow-graphs-map.md)
- [Filter and route data](howto-dataflow-graphs-filter-route.md)
- [Aggregate data over time](howto-dataflow-graphs-window.md)
- [Enrich with external data](howto-dataflow-graphs-enrich.md)
- [Expressions reference](concept-dataflow-graphs-expressions.md)
