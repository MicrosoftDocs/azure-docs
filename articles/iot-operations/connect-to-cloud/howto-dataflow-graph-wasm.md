---
title: Use WebAssembly With Data Flow Graphs 
description: Learn how to deploy and use WebAssembly modules with data flow graphs in Azure IoT Operations to process data at the edge.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 12/17/2025
ai-usage: ai-assisted

---

# Use WebAssembly (WASM) with data flow graphs

[!INCLUDE [kubernetes-management-preview-note](../includes/kubernetes-management-preview-note.md)]

Azure IoT Operations data flow graphs support WebAssembly (WASM) modules for custom data processing at the edge. You can deploy custom business logic and data transformations as part of your data flow pipelines.

WebAssembly (WASM) with data flow graphs is generally available.

> [!TIP]
> Want to run AI in-band? See [Run ONNX inference in WebAssembly data flow graphs](../develop-edge-apps/howto-wasm-onnx-inference.md) to package and execute small ONNX models inside your WASM operators.

> [!IMPORTANT]
> Data flow graphs currently only support MQTT, Kafka, and OpenTelemetry endpoints. Other endpoint types like Data Lake, Microsoft Fabric OneLake, Azure Data Explorer, and Local Storage are not supported. For more information, see [Known issues](../troubleshoot/known-issues.md#data-flow-graphs-only-support-specific-endpoint-types).

## Prerequisites

- Deploy an Azure IoT Operations instance on an Arc-enabled Kubernetes cluster. For more information, see [Deploy Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md).
- Use Azure Container Registry (ACR) to store WASM modules and graphs.
- Install the OCI Registry As Storage (ORAS) CLI to push WASM modules to the registry.
- Develop custom WASM modules by following guidance in [Develop WebAssembly modules for data flow graphs](../develop-edge-apps/howto-develop-wasm-modules.md).

## Overview

WebAssembly (WASM) modules in Azure IoT Operations data flow graphs let you process data at the edge with high performance and security. WASM runs in a sandboxed environment and supports Rust and Python.

### How WASM data flow graphs work

The WASM data flow implementation follows this workflow:

1. **Develop WASM modules**: Write custom processing logic in a supported language and compile it to the WebAssembly Component Model format.
1. **Develop graph definition**: Define how data moves through the modules by using YAML configuration files. For detailed information, see [Configure WebAssembly graph definitions](howto-configure-wasm-graph-definitions.md).
1. **Store artifacts in registry**: Push the compiled WASM modules to a container registry by using OCI-compatible tools such as ORAS.
1. **Configure registry endpoints**: Set up authentication and connection details so Azure IoT Operations can access the container registry.
1. **Create data flow graph**: Define data sources, the artifact name, and destinations.
1. **Deploy and execute**: Azure IoT Operations pulls WASM modules from the registry and runs them based on the graph definition.

<!-- TODO: Add general system architecture content -->

The following examples show how to set up and deploy WASM data flow graphs for common scenarios. The examples use hardcoded values and simplified configurations so you can get started quickly.

## Set up container registry

Azure IoT Operations needs a container registry to pull WASM modules and graph definitions. You can use Azure Container Registry (ACR) or another OCI-compatible registry.

To create and configure an Azure Container Registry, see [Deploy Azure Container Registry](/azure/container-registry/container-registry-get-started-portal).

## Install ORAS CLI

Use the ORAS CLI to push WASM modules and graph definitions to your container registry. For installation instructions, see [Install ORAS](https://oras.land/docs/installation).

## Pull sample modules from public registry

Use prebuilt sample modules:

```bash
# Pull sample modules and graphs
oras pull ghcr.io/azure-samples/explore-iot-operations/graph-simple:1.0.0
oras pull ghcr.io/azure-samples/explore-iot-operations/graph-complex:1.0.0
oras pull ghcr.io/azure-samples/explore-iot-operations/temperature:1.0.0
oras pull ghcr.io/azure-samples/explore-iot-operations/window:1.0.0
oras pull ghcr.io/azure-samples/explore-iot-operations/snapshot:1.0.0
oras pull ghcr.io/azure-samples/explore-iot-operations/format:1.0.0
oras pull ghcr.io/azure-samples/explore-iot-operations/humidity:1.0.0
oras pull ghcr.io/azure-samples/explore-iot-operations/collection:1.0.0
oras pull ghcr.io/azure-samples/explore-iot-operations/enrichment:1.0.0
oras pull ghcr.io/azure-samples/explore-iot-operations/filter:1.0.0
```

## Push modules to your registry

Once you have the sample modules and graphs, push them to your container registry. Replace `<YOUR_ACR_NAME>` with the name of your Azure Container Registry. To ensure the graphs and modules are visible in the operations experience web UI, add the `--config` and `--artifact-type` flags as shown in the following example:

```bash
# Log in to your ACR
az acr login --name <YOUR_ACR_NAME>

# Push modules to your registry
oras push <YOUR_ACR_NAME>.azurecr.io/graph-simple:1.0.0 --config /dev/null:application/vnd.microsoft.aio.graph.v1+yaml graph-simple.yaml:application/yaml --disable-path-validation
oras push <YOUR_ACR_NAME>.azurecr.io/graph-complex:1.0.0 --config /dev/null:application/vnd.microsoft.aio.graph.v1+yaml graph-complex.yaml:application/yaml --disable-path-validation
oras push <YOUR_ACR_NAME>.azurecr.io/temperature:1.0.0 --artifact-type application/vnd.module.wasm.content.layer.v1+wasm temperature-1.0.0.wasm:application/wasm
oras push <YOUR_ACR_NAME>.azurecr.io/window:1.0.0 --artifact-type application/vnd.module.wasm.content.layer.v1+wasm window-1.0.0.wasm:application/wasm
oras push <YOUR_ACR_NAME>.azurecr.io/snapshot:1.0.0 --artifact-type application/vnd.module.wasm.content.layer.v1+wasm snapshot-1.0.0.wasm:application/wasm
oras push <YOUR_ACR_NAME>.azurecr.io/format:1.0.0 --artifact-type application/vnd.module.wasm.content.layer.v1+wasm format-1.0.0.wasm:application/wasm
oras push <YOUR_ACR_NAME>.azurecr.io/humidity:1.0.0 --artifact-type application/vnd.module.wasm.content.layer.v1+wasm humidity-1.0.0.wasm:application/wasm
oras push <YOUR_ACR_NAME>.azurecr.io/collection:1.0.0 --artifact-type application/vnd.module.wasm.content.layer.v1+wasm collection-1.0.0.wasm:application/wasm
oras push <YOUR_ACR_NAME>.azurecr.io/enrichment:1.0.0 --artifact-type application/vnd.module.wasm.content.layer.v1+wasm enrichment-1.0.0.wasm:application/wasm
oras push <YOUR_ACR_NAME>.azurecr.io/filter:1.0.0 --artifact-type application/vnd.module.wasm.content.layer.v1+wasm filter-1.0.0.wasm:application/wasm
```

> [!TIP]
> You can also push your own modules and create custom graphs, see [Configuration of custom data flow graphs](#configuration-of-custom-data-flow-graphs).

## Create a registry endpoint

A registry endpoint defines the connection to your container registry. Data flow graphs use registry endpoints to pull WASM modules and graph definitions from container registries. For detailed information about configuring registry endpoints with different authentication methods and registry types, see [Configure registry endpoints](howto-configure-registry-endpoint.md).

To create registry endpoints, you can use the Azure portal, Bicep, or Kubernetes manifests. After you create a registry endpoint, the graphs you [pushed to your container registry](#push-modules-to-your-registry) are ready to be used in operations experience in data flow graphs.

For quick setup with Azure Container Registry, create a registry endpoint with system-assigned managed identity authentication:

# [Azure portal](#tab/portal)

You can use the Azure portal to create registry endpoints. The portal experience allows you to specify and provide host details of an ACR, and optionally provide credentials. Before you begin, ensure that you have the following information:

- Registry endpoint name.
- A host name for the ACR.
- Four types of authentication are supported:
  - Anonymous
  - System managed identity
  - User managed identity
  - Artifact secret


To create a registry endpoint in the Azure portal, follow these steps.

### Create registry endpoints with anonymous authentication

You can create a new registry endpoint by specifying the host details of an Azure Container Registry (ACR), enable anonymous access for public image retrieval, and store the configuration for reuse. First, select the type of authentication you want to use. In this example, we use anonymous authentication:

:::image type="content" source="media/howto-create-dataflow-graph/select-authentication.png" alt-text="Screenshot of the select authentication form." lightbox="media/howto-create-dataflow-graph/select-authentication.png":::

:::image type="content" source="media/howto-create-dataflow-graph/authentication-anonymous.png" alt-text="Screenshot of the completed anonymous authentication configuration for registry endpoint." lightbox="media/howto-create-dataflow-graph/authentication-anonymous.png":::

### Create registry endpoints with system managed identity authentication

You can create a new registry endpoint by specifying the host details of an ACR, authenticate using a system-assigned managed identity for secure access, and store the configuration for reuse.

:::image type="content" source="media/howto-create-dataflow-graph/system-managed-identity.png" alt-text="Screenshot of the completed system managed identity authentication configuration for registry endpoint." lightbox="media/howto-create-dataflow-graph/system-managed-identity.png":::

### Create registry endpoints with user managed identity

You can create a new registry endpoint by specifying the host details of an ACR, authenticate using a user-assigned managed identity for secure access, and store the configuration for reuse.

> [!NOTE]
> The client and tenant IDs are required to enable user managed identity. 

:::image type="content" source="media/howto-create-dataflow-graph/user-managed-identity.png" alt-text="Screenshot of the completed user managed identity authentication configuration for registry endpoint." lightbox="media/howto-create-dataflow-graph/user-managed-identity.png":::

### Create registry endpoints with artifact secrets

Artifact secrets are used to authenticate with private container registries like ACR, Docker Hub, or MCR, when pulling container images. Secrets are essential when the registry requires credentials, and the image is not publicly accessible. This scenario enables you to manage data flow graphs across Azure IoT Operations and the operations experience. You can set up artifact secrets from Azure Key Vault by selecting existing secrets.

You can create a new registry endpoint by specifying the host details of an ACR, authenticate using artifact secrets for secure access, and store the configuration for reuse:

:::image type="content" source="media/howto-create-dataflow-graph/secrets.png" alt-text="Screenshot of the Azure Key Vault secret selection interface for artifact secrets." lightbox="media/howto-create-dataflow-graph/secrets.png":::

You set up artifact secrets from Azure Key Vault by creating new secrets and storing them in Azure Key Vault:

:::image type="content" source="media/howto-create-dataflow-graph/secret-form.png" alt-text="Screenshot of the create new secret form in Azure Key Vault for artifact secrets." lightbox="media/howto-create-dataflow-graph/secret-form.png":::

# [Bicep](#tab/bicep)

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'
param registryEndpointName string = '<REGISTRY_ENDPOINT_NAME>'
param acrName string = '<YOUR_ACR_NAME>'

resource aioInstance 'Microsoft.IoTOperations/instances@2025-10-01' existing = {
  name: aioInstanceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-15' existing = {
  name: customLocationName
}

resource registryEndpoint 'Microsoft.IoTOperations/instances/registryEndpoints@2025-10-01' = {
  parent: aioInstance
  name: registryEndpointName
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    host: '${acrName}.azurecr.io'
    authentication: {
      method: 'SystemAssignedManagedIdentity'
      systemAssignedManagedIdentitySettings: {
        audience: 'https://management.azure.com/'
      }
    }
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: RegistryEndpoint
metadata:
  name: <REGISTRY_ENDPOINT_NAME>
  namespace: azure-iot-operations
spec:
  host: <YOUR_ACR_NAME>.azurecr.io
  authentication:
    method: SystemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings:
      audience: https://management.azure.com/
```

---

> [!NOTE]
> You can reuse registry endpoints across multiple data flow graphs and other Azure IoT Operations components, like Akri connectors.

## Get extension name

```azurecli
# Get extension name
az k8s-extension list \
  --resource-group <RESOURCE_GROUP> \
  --cluster-name <CLUSTER_NAME> \
  --cluster-type connectedClusters \
  --query "[?extensionType=='microsoft.iotoperations'].name" \
  --output tsv
```

The first command returns the extension name (for example, `azure-iot-operations-4gh3y`).

## Configure managed identity permissions

To let Azure IoT Operations pull WASM modules from your container registry, give the managed identity the right permissions. The IoT Operations extension uses a system-assigned managed identity that needs the `AcrPull` role on your Azure Container Registry. Make sure you have the following prerequisites:

- Owner permissions on the Azure Container Registry.
- The container registry can be in a different resource group or subscription, but it must be in the same tenant as your IoT Operations deployment.

Run these commands to assign the `AcrPull` role to the IoT Operations managed identity:

```bash
# Get the IoT Operations extension managed identity
export EXTENSION_OBJ_ID=$(az k8s-extension list --cluster-name $CLUSTER_NAME -g $RESOURCE_GROUP --cluster-type connectedClusters --query "[?extensionType=='microsoft.iotoperations'].identity.principalId" -o tsv)

# Get the application ID for the managed identity
export SYSTEM_ASSIGNED_MAN_ID=$(az ad sp show --id $EXTENSION_OBJ_ID --query "appId" -o tsv)

# Assign the AcrPull role to the managed identity
az role assignment create --role "AcrPull" --assignee $SYSTEM_ASSIGNED_MAN_ID --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.ContainerRegistry/registries/$ACR_NAME"
```

For more information about container registry roles, see [Azure Container Registry roles and permissions](/azure/container-registry/container-registry-roles).

If you get authentication errors with the Azure CLI, assign permissions in the Azure portal:

1. Go to your Azure Container Registry in the Azure portal.
1. Select **Access control (IAM)** from the menu.
1. Select **Add** > **Add role assignment**.
1. Choose the **AcrPull** built-in role.
1. Select **User, group, or service principal** as the assign access to option.
1. Search for and select your IoT Operations extension name (for example, `azure-iot-operations-4gh3y`).
1. Select **Save** to finish the role assignment.

For detailed instructions, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

## Example 1: Basic deployment with one WASM module

This example converts temperature data from Fahrenheit to Celsius by using a WASM module. The [temperature module source code](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm/operators/temperature) is available on GitHub. Use the precompiled version `graph-simple:1.0.0` that you pushed to your container registry.

### How it works

The [graph definition](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/wasm/graph-simple.yaml) creates a simple, three-stage pipeline:

1. **Source**: Receives temperature data from MQTT
2. **Map**: Processes data with the temperature WASM module
3. **Sink**: Sends converted data back to MQTT

For detailed information about how the simple graph definition works and its structure, see [Example 1: Simple graph definition](howto-configure-wasm-graph-definitions.md#example-1-simple-graph-definition).

Input format:
```json
{"temperature": {"value": 100.0, "unit": "F"}}
```

Output format:
```json
{"temperature": {"value": 37.8, "unit": "C"}}
```

The following configuration creates a data flow graph that uses this temperature conversion pipeline. The graph references the `graph-simple:1.0.0` artifact, which contains the YAML definition and pulls the temperature module from your container registry.

### Configure the data flow graph

This configuration defines three nodes that implement the temperature conversion workflow: a source node that subscribes to incoming temperature data, a graph processing node that runs the WASM module, and a destination node that publishes the converted results.

The data flow graph resource "wraps" the graph definition artifact and connects its abstract source/sink operations to concrete endpoints:

- The graph definition's `source` operation connects to the data flow's source node (MQTT topic)
- The graph definition's `sink` operation connects to the data flow's destination node (MQTT topic)
- The graph definition's processing operations run within the graph processing node

This separation lets you deploy the same graph definition with different endpoints across environments while keeping the processing logic unchanged.

# [Operations experience](#tab/portal)

1. To create a data flow graph in [operations experience](https://iotoperations.azure.com/), go to **Data flow** tab.
1. Select the drop-down menu next to **+ Create** and select **Create a data flow graph**

    :::image type="content" source="media/howto-create-dataflow-graph/create-data-flow-graph.png" alt-text="Screenshot of the operations experience interface showing how to create a data flow graph." lightbox="media/howto-create-dataflow-graph/create-data-flow-graph.png":::

1. Select the placeholder name **new-data-flow** to set the data flow properties. Enter the name of the data flow graph and choose the data flow profile to use.
1. In the data flow diagram, select **Source** to configure the source node. Under **Source details**, select **Asset** or **Data flow Endpoint**.

    :::image type="content" source="media/howto-create-dataflow-graph/select-source-simple.png" alt-text="Screenshot of the operations experience interface showing how to select a source for the data flow graph." lightbox="media/howto-create-dataflow-graph/select-source-simple.png":::

    1. If you select **Asset**, choose the asset to pull data from and click **Apply**.
    1. If you select **Data flow Endpoint**, enter the following details and click **Apply**.

        | Setting              | Description                                                                                       |
        | -------------------- | ------------------------------------------------------------------------------------------------- |
        | Data flow endpoint    | Select *default* to use the default MQTT message broker endpoint. |
        | Topic                | The topic filter to subscribe to for incoming messages. Use **Topic(s)** > **Add row** to add multiple topics. |
        | Message schema       | The schema to use to deserialize the incoming messages. |

1. In the data flow diagram, select **Add graph transform (optional)** to add a graph processing node. In the **Graph selection** pane, select **graph-simple:1** and click **Apply**.

    :::image type="content" source="media/howto-create-dataflow-graph/create-simple-graph.png" alt-text="Screenshot of the operations experience interface showing how to create a simple data flow graph." lightbox="media/howto-create-dataflow-graph/create-simple-graph.png":::

    > [!IMPORTANT]
    > This example uses the `graph-simple:1.0.0` artifact that you [pushed to your container registry](#push-modules-to-your-registry). You can create your custom graphs by [developing your own WASM modules](#develop-custom-wasm-modules) and pushing them to your container registry. The graphs you push to your container registry are available in the **Graph selection** pane.

1. You can configure some graph operator settings by selecting the graph node in the diagram. For example, you can select **module-temperature/map** operator and enter in `key2` the value `example-value-2`. Click **Apply** to save the changes.

    :::image type="content" source="media/howto-create-dataflow-graph/configure-simple-graph.png" alt-text="Screenshot of the operations experience interface showing how to configure a simple data flow graph." lightbox="media/howto-create-dataflow-graph/configure-simple-graph.png":::

1. In the data flow diagram, select **Destination** to configure the destination node.
1. Select **Save** under the data flow graph name to save the data flow graph.

# [Bicep](#tab/bicep)

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'
param dataflowGraphName string = '<GRAPH_NAME>'
param registryEndpointName string = '<REGISTRY_ENDPOINT_NAME>'

resource aioInstance 'Microsoft.IoTOperations/instances@2025-10-01' existing = {
  name: aioInstanceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-15' existing = {
  name: customLocationName
}

resource defaultDataflowProfile 'Microsoft.IoTOperations/instances/dataflowProfiles@2025-10-01' existing = {
  parent: aioInstance
  name: 'default'
}

resource dataflowGraph 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflowGraphs@2025-10-01' = {
  parent: defaultDataflowProfile
  name: dataflowGraphName
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    mode: 'Enabled'
    requestDiskPersistence: 'Disabled'
    nodes: [
      {
        nodeType: 'Source'
        name: 'temperature-source'
        sourceSettings: {
          endpointRef: 'default'
          dataSources: [
            'sensor/temperature/raw'
          ]
        }
      }
      {
        nodeType: 'Graph'
        name: 'temperature-processor'
        graphSettings: {
          registryEndpointRef: registryEndpointName
          artifact: 'graph-simple:1.0.0'
          configuration: [
            {
              key: 'key1'
              value: 'example-value'
            }
          ]
        }
      }
      {
        nodeType: 'Destination'
        name: 'temperature-destination'
        destinationSettings: {
          endpointRef: 'default'
          dataDestination: 'sensor/temperature/processed'
        }
      }
    ]
    nodeConnections: [
      {
        from: {
          name: 'temperature-source'
        }
        to: {
          name: 'temperature-processor'
        }
      }
      {
        from: {
          name: 'temperature-processor'
        }
        to: {
          name: 'temperature-destination'
        }
      }
    ]
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

Create a YAML file with the following configuration:

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowGraph
metadata:
  name: <GRAPH_NAME>
  namespace: azure-iot-operations
spec:
  requestDiskPersistence: Disabled
  profileRef: default

  nodes:
    - nodeType: Source
      name: temperature-source
      sourceSettings:
        endpointRef: default
        dataSources:
          - sensor/temperature/raw

    - nodeType: Graph
      name: temperature-processor
      graphSettings:
        registryEndpointRef: <REGISTRY_ENDPOINT_NAME>
        artifact: graph-simple:1.0.0
        configuration:
          - key: key1
            value: example-value

    - nodeType: Destination
      name: temperature-destination
      destinationSettings:
        endpointRef: default
        dataDestination: sensor/temperature/processed

  nodeConnections:
    - from:
        name: temperature-source
      to:
        name: temperature-processor

    - from:
        name: temperature-processor
      to:
        name: temperature-destination
```

Save the configuration as `dataflow-graph.yaml`, and then apply it to your cluster:

```bash
kubectl apply -f dataflow-graph.yaml
```

---

### Test the data flow

To test the data flow, send MQTT messages from within the cluster. First, deploy the MQTT client pod by following the instructions in [Test connectivity to MQTT broker with MQTT clients](../manage-mqtt-broker/howto-test-connection.md). The MQTT client provides the authentication tokens and certificates to connect to the broker. To deploy the MQTT client, run the following command:

```bash
kubectl apply -f https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/quickstarts/mqtt-client.yaml
```

#### Send temperature messages

In the first terminal session, create and run a script to send temperature data in Fahrenheit:

```bash
# Connect to the MQTT client pod
kubectl exec --stdin --tty mqtt-client -n azure-iot-operations -- sh -c '
# Create and run temperature.sh from within the MQTT client pod
while true; do
  # Generate a random temperature value between 0 and 6000 Fahrenheit
  random_value=$(shuf -i 0-6000 -n 1)
  payload="{\"temperature\":{\"value\":$random_value,\"unit\":\"F\"}}"

  echo "Publishing temperature: $payload"

  # Publish to the input topic
  mosquitto_pub -h aio-broker -p 18883 \
    -m "$payload" \
    -t "sensor/temperature/raw" \
    -d \
    --cafile /var/run/certs/ca.crt \
    -D PUBLISH user-property __ts $(date +%s)000:0:df \
    -D CONNECT authentication-method 'K8S-SAT' \
    -D CONNECT authentication-data $(cat /var/run/secrets/tokens/broker-sat)

  sleep 1
done'
```

> [!NOTE]
> The MQTT user property `__ts` is used to add a timestamp to the messages to ensure the timely processing of messages using the Hybrid Logical Clock (HLC). Having the timestamp helps the data flow to decide whether to accept or drop the message. The format of the property is `<timestamp>:<counter>:<nodeid>`. It makes the data flow processing more accurate, but isn't mandatory.

The script publishes random temperature data to the `sensor/temperature/raw` topic every second. It should look like this:

```output
Publishing temperature: {"temperature":{"value":1234,"unit":"F"}}
Publishing temperature: {"temperature":{"value":5678,"unit":"F"}}
```

Leave the script running to continue publishing temperature data.

#### Subscribe to processed messages

In the second terminal session (also connected to the MQTT client pod), subscribe to the output topic to see the converted temperature values:

```bash
# Connect to the MQTT client pod
kubectl exec --stdin --tty mqtt-client -n azure-iot-operations -- sh -c '
mosquitto_sub -h aio-broker -p 18883 -t "sensor/temperature/processed" --cafile /var/run/certs/ca.crt \
-D CONNECT authentication-method "K8S-SAT" \
-D CONNECT authentication-data "$(cat /var/run/secrets/tokens/broker-sat)"'
```

You see the temperature data converted from Fahrenheit to Celsius by the WASM module.

```output
{"temperature":{"value":1292.2222222222222,"count":0,"max":0.0,"min":0.0,"average":0.0,"last":0.0,"unit":"C","overtemp":false}}
{"temperature":{"value":203.33333333333334,"count":0,"max":0.0,"min":0.0,"average":0.0,"last":0.0,"unit":"C","overtemp":false}}
```

## Example 2: Deploy a complex graph

This example demonstrates a sophisticated data processing workflow that handles multiple data types including temperature, humidity, and image data. The [complex graph definition](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/wasm/graph-complex.yaml) orchestrates multiple WASM modules to perform advanced analytics and object detection.

### How it works

The complex graph processes three data streams and combines them into enriched sensor analytics:

- Temperature processing: Converts Fahrenheit to Celsius, filters invalid readings, and calculates statistics
- Humidity processing: Accumulates humidity measurements over time intervals  
- Image processing: Performs object detection on camera snapshots and formats results

For detailed information about how the complex graph definition works, its structure, and the data flow through multiple processing stages, see [Example 2: Complex graph definition](howto-configure-wasm-graph-definitions.md#example-2-complex-graph-definition).

The graph uses specialized modules from the [Rust operators](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm/operators).

### Configure the complex data flow graph

This configuration implements the multi-sensor processing workflow using the `graph-complex:1.0.0` artifact. Notice how the data flow graph deployment is similar to Example 1 - both use the same three-node pattern (source, graph processor, destination) even though the processing logic is different.

This similarity occurs because the data flow graph resource acts as a host environment that loads and executes graph definitions. The actual processing logic resides in the graph definition artifact (`graph-simple:1.0.0` vs `graph-complex:1.0.0`), which contains the YAML specification of operations and connections between WASM modules. The data flow graph resource provides the runtime infrastructure to pull the artifact, instantiate the modules, and route data through the defined workflow.

# [Operations experience](#tab/portal)

1. To create a data flow graph in [operations experience](https://iotoperations.azure.com/), go to **Data flow** tab.
1. Select the drop-down menu next to **+ Create** and select **Create a data flow graph**

    :::image type="content" source="media/howto-create-dataflow-graph/create-data-flow-graph.png" alt-text="Screenshot of the operations experience interface showing how to create a data flow complex graph." lightbox="media/howto-create-dataflow-graph/create-data-flow-graph.png":::

1. Select the placeholder name **new-data-flow** to set the data flow properties. Enter the name of the data flow graph and choose the data flow profile to use. 
1. In the data flow diagram, select **Source** to configure the source node. Under **Source details**, select **Asset** or **Data flow Endpoint**.

    :::image type="content" source="media/howto-create-dataflow-graph/select-source-simple.png" alt-text="Screenshot of the operations experience interface showing how to select a source for the data flow graph." lightbox="media/howto-create-dataflow-graph/select-source-simple.png":::

    1. If you select **Asset**, choose the asset to pull data from and click **Apply**.
    1. If you select **Data flow Endpoint**, enter the following details and click **Apply**.

        | Setting              | Description                                                                                       |
        | -------------------- | ------------------------------------------------------------------------------------------------- |
        | Data flow endpoint    | Select *default* to use the default MQTT message broker endpoint. |
        | Topic                | The topic filter to subscribe to for incoming messages. Use **Topic(s)** > **Add row** to add multiple topics.|
        | Message schema       | The schema to use to deserialize the incoming messages. |

1. In the data flow diagram, select **Add graph transform (optional)** to add a graph processing node. In the **Graph selection** pane, select **graph-complex:1** and click **Apply**.

    :::image type="content" source="media/howto-create-dataflow-graph/create-complex-graph.png" alt-text="Screenshot of the operations experience interface showing how to create a complex data flow graph." lightbox="media/howto-create-dataflow-graph/create-complex-graph.png":::

    > [!IMPORTANT]
    > This example uses the `graph-complex:1.0.0` artifact that you [pushed to your container registry](#push-modules-to-your-registry). You can create your custom graphs by [developing your own WASM modules](#develop-custom-wasm-modules) and pushing them to your container registry. The graphs you push to your container registry are available in the **Graph selection** pane.

1. You can configure some graph operator settings by selecting the graph node in the diagram. 

    :::image type="content" source="media/howto-create-dataflow-graph/configure-complex-graph.png" alt-text="Screenshot of the operations experience interface showing how to configure a complex data flow graph." lightbox="media/howto-create-dataflow-graph/configure-complex-graph.png":::

      |Operator|Description|
      |--------|-----------|
      |module-snapshot/branch|Configures the `snapshot` module to perform object detection on images. You can set the `snapshot_topic` configuration key to specify the input topic for image data.|
      |module-temperature/map|Transforms `key2` temperature values to a different scale.|

1. Click **Apply** to save the changes.
1. In the data flow diagram, select **Destination** to configure the destination node.
1. Select **Save** under the data flow graph name to save the data flow graph.

# [Bicep](#tab/bicep)

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'
param dataflowGraphName string = '<COMPLEX_GRAPH_NAME>'
param registryEndpointName string = '<REGISTRY_ENDPOINT_NAME>'

resource aioInstance 'Microsoft.IoTOperations/instances@2025-10-01' existing = {
  name: aioInstanceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-15' existing = {
  name: customLocationName
}

resource defaultDataflowProfile 'Microsoft.IoTOperations/instances/dataflowProfiles@2025-10-01' existing = {
  parent: aioInstance
  name: 'default'
}

resource complexDataflowGraph 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflowGraphs@2025-10-01' = {
  parent: defaultDataflowProfile
  name: dataflowGraphName
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    mode: 'Enabled'
    requestDiskPersistence: 'Disabled'
    nodes: [
      {
        nodeType: 'Source'
        name: 'sensor-source'
        sourceSettings: {
          endpointRef: 'default'
          dataSources: [
            'sensor/temperature/raw'
            'sensor/humidity/raw'
            'sensor/images/raw'
          ]
        }
      }
      {
        nodeType: 'Graph'
        name: 'sensor-processor'
        graphSettings: {
          registryEndpointRef: registryEndpointName
          artifact: 'graph-complex:1.0.0'
          configuration: [
            {
              key: 'snapshot_topic'
              value: 'sensor/images/raw'
            }
            {
              key: 'key1'
              value: 'example-value'
            }
          ]
        }
      }
      {
        nodeType: 'Destination'
        name: 'analytics-destination'
        destinationSettings: {
          endpointRef: 'default'
          dataDestination: 'analytics/sensor/processed'
        }
      }
    ]
    nodeConnections: [
      {
        from: {
          name: 'sensor-source'
        }
        to: {
          name: 'sensor-processor'
        }
      }
      {
        from: {
          name: 'sensor-processor'
        }
        to: {
          name: 'analytics-destination'
        }
      }
    ]
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowGraph
metadata:
  name: <COMPLEX_GRAPH_NAME>
  namespace: azure-iot-operations
spec:
  requestDiskPersistence: Disabled
  profileRef: default

  nodes:
    - nodeType: Source
      name: sensor-source
      sourceSettings:
        endpointRef: default
        dataSources:
          - sensor/temperature/raw
          - sensor/humidity/raw
          - sensor/images/raw

    - nodeType: Graph
      name: sensor-processor
      graphSettings:
        registryEndpointRef: <REGISTRY_ENDPOINT_NAME>
        artifact: graph-complex:1.0.0
        configuration:
          - key: snapshot_topic
            value: sensor/images/raw
          - key: key1
            value: example-value

    - nodeType: Destination
      name: analytics-destination
      destinationSettings:
        endpointRef: default
        dataDestination: analytics/sensor/processed

  nodeConnections:
    - from:
        name: sensor-source
      to:
        name: sensor-processor

    - from:
        name: sensor-processor
      to:
        name: analytics-destination
```

---

### Test the complex data flow

Before we can see the output, we need to get the source data setup.

#### Upload RAW image files to the mqtt-client pod

The image files are for the `snapshot` module to detect objects in the images. They're located in the [images](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm/images) folder on GitHub.

First, clone the repository to get access to the image files:

```bash
git clone https://github.com/Azure-Samples/explore-iot-operations.git
cd explore-iot-operations
```

To upload RAW image files from the `./samples/wasm/images` folder to the `mqtt-client` pod, you can use the following command:

```bash
kubectl cp ./samples/wasm/images azure-iot-operations/mqtt-client:/tmp
```

Check the files are uploaded:

```bash
kubectl exec -it mqtt-client -n azure-iot-operations -- ls /tmp/images
```

You should see the list of files in the `/tmp/images` folder.

```output
beaker.raw          laptop.raw          sunny2.raw
binoculars.raw      lawnmower.raw       sunny4.raw
broom.raw           milkcan.raw         thimble.raw
camera.raw          photocopier.raw     tripod.raw
computer_mouse.raw  radiator.raw        typewriter.raw
daisy3.raw          screwdriver.raw     vacuum_cleaner.raw
digital_clock.raw   sewing_machine.raw
hammer.raw          sliding_door.raw
```

### Publish simulated temperature, humidity data, and send images

You can combine the commands for publishing temperature, humidity data, and sending images into a single script. Use the following command:

```bash
# Connect to the MQTT client pod and run the script
kubectl exec --stdin --tty mqtt-client -n azure-iot-operations -- sh -c '
while true; do 
  # Generate a random temperature value between 0 and 6000
  temp_value=$(shuf -i 0-6000 -n 1)
  temp_payload="{\"temperature\":{\"value\":$temp_value,\"unit\":\"F\"}}"
  echo "Publishing temperature: $temp_payload"
  mosquitto_pub -h aio-broker -p 18883 \
    -m "$temp_payload" \
    -t "sensor/temperature/raw" \
    --cafile /var/run/certs/ca.crt \
    -D CONNECT authentication-method "K8S-SAT" \
    -D CONNECT authentication-data "$(cat /var/run/secrets/tokens/broker-sat)" \
    -D PUBLISH user-property __ts $(date +%s)000:0:df

  # Generate a random humidity value between 30 and 90
  humidity_value=$(shuf -i 30-90 -n 1)
  humidity_payload="{\"humidity\":{\"value\":$humidity_value}}"
  echo "Publishing humidity: $humidity_payload"
  mosquitto_pub -h aio-broker -p 18883 \
    -m "$humidity_payload" \
    -t "sensor/humidity/raw" \
    --cafile /var/run/certs/ca.crt \
    -D CONNECT authentication-method "K8S-SAT" \
    -D CONNECT authentication-data "$(cat /var/run/secrets/tokens/broker-sat)" \
    -D PUBLISH user-property __ts $(date +%s)000:0:df

  # Send an image every 2 seconds
  if [ $(( $(date +%s) % 2 )) -eq 0 ]; then
    file=$(ls /tmp/images/*.raw | shuf -n 1)
    echo "Sending file: $file"
    mosquitto_pub -h aio-broker -p 18883 \
      -f $file \
      -t "sensor/images/raw" \
      --cafile /var/run/certs/ca.crt \
      -D CONNECT authentication-method "K8S-SAT" \
      -D CONNECT authentication-data "$(cat /var/run/secrets/tokens/broker-sat)" \
      -D PUBLISH user-property __ts $(date +%s)000:0:df
  fi

  # Wait for 1 second before the next iteration
  sleep 1
done'
```

### Check the output

In a new terminal, subscribe to the output topic:

```bash
kubectl exec --stdin --tty mqtt-client -n azure-iot-operations -- sh -c '
mosquitto_sub -h aio-broker -p 18883 -t "analytics/sensor/processed" --cafile /var/run/certs/ca.crt \
-D CONNECT authentication-method "K8S-SAT" \
-D CONNECT authentication-data "$(cat /var/run/secrets/tokens/broker-sat)"'
```

The output should look like this

```output
{"temperature":[{"count":9,"max":2984.4444444444443,"min":248.33333333333337,"average":1849.6296296296296,"last":2612.222222222222,"unit":"C","overtemp":true}],"humidity":[{"count":10,"max":76.0,"min":30.0,"average":49.7,"last":38.0}],"object":[{"result":"milk can; broom; screwdriver; binoculars, field glasses, opera glasses; toy terrier"}]}
{"temperature":[{"count":10,"max":2490.5555555555557,"min":430.55555555555554,"average":1442.6666666666667,"last":1270.5555555555557,"unit":"C","overtemp":true}],"humidity":[{"count":9,"max":87.0,"min":34.0,"average":57.666666666666664,"last":42.0}],"object":[{"result":"broom; Saint Bernard, St Bernard; radiator"}]}
```

Here, the output contains the temperature and humidity data, as well as the detected objects in the images.

## Update a module in a running graph

You can update a WASM module in a running graph without stopping the graph. This is useful when you want to update the logic of an operator without stopping the dataflow. For example, to update the temperature conversion module from version `1.0.0` to `2.0.0`, upload the new version as follows:

```bash
oras push <YOUR_ACR_NAME>.azurecr.io/temperature:2.0.0 --artifact-type application/vnd.module.wasm.content.layer.v1+wasm temperature-2.0.0.wasm:application/wasm
```

The data flow graph automatically picks up the new version of the module without any additional configuration. The graph continues to run without interruption, and the new module version is used for subsequent data processing.

## Develop custom WASM modules

To create custom data processing logic for your data flow graphs, develop WebAssembly modules in Rust or Python. Custom modules enable you to implement specialized business logic, data transformations, and analytics that aren't available in the built-in operators.

For comprehensive development guidance including:
- Setting up your development environment
- Creating operators in Rust and Python
- Understanding the data model and interfaces
- Building and testing your modules

See [Develop WebAssembly modules for data flow graphs](../develop-edge-apps/howto-develop-wasm-modules.md).

For detailed information about creating and configuring the YAML graph definitions that define your data processing workflows, see [Configure WebAssembly graph definitions](howto-configure-wasm-graph-definitions.md).

## Configuration of custom data flow graphs

This section provides detailed information about configuring data flow graphs with WASM modules. It covers all configuration options, data flow endpoints, and advanced settings.

### Data flow graph overview

A data flow graph defines how data flows through WebAssembly modules for processing. Each graph consists of:

- Mode that controls whether the graph is enabled or disabled
- Profile reference that links to a data flow profile defining scaling and resource settings
- Disk persistence that optionally enables persistent storage for graph state
- Nodes that define the source, processing, and destination components
- Node connections that specify how data flows between nodes

### Mode configuration

The mode property determines whether the data flow graph is actively processing data. You can set the mode to `Enabled` or `Disabled` (case-insensitive). When disabled, the graph stops processing data but retains its configuration.

# [Operations experience](#tab/portal)

When creating or editing a data flow graph, in the **Data flow properties** pane, you can check **Enable data flow** to **Yes** to set the mode to `Enabled`. If you leave it unchecked, the mode is set to `Disabled`.

:::image type="content" source="media/howto-create-dataflow-graph/select-mode.png" alt-text="Screenshot of the operations experience interface showing how to enable or disable mode configuration." lightbox="media/howto-create-dataflow-graph/select-mode.png":::

# [Bicep](#tab/bicep)

```bicep
resource dataflowGraph 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflowGraphs@2025-10-01' = {
  // ... other properties
  properties: {
    mode: 'Enabled'  // or 'Disabled'
    // ... other properties
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowGraph
metadata:
  name: my-dataflow-graph
  namespace: azure-iot-operations
spec:
  mode: Enabled  # or Disabled
  # ... other properties
```

---

### Profile reference

The profile reference connects your data flow graph to a data flow profile, which defines scaling settings, instance counts, and resource limits. If you don't specify a profile reference, you must use a Kubernetes owner reference instead. Most scenarios use the default profile provided by Azure IoT Operations.

# [Operations experience](#tab/portal)

When creating or editing a data flow graph, in the **Data flow properties** pane, select the data flow profile. The default data flow profile is selected by default. For more information on data flow profiles, see [Configure data flow profile](howto-configure-dataflow-profile.md).

> [!IMPORTANT] 
> You can only choose the data flow profile when creating a data flow graph. You can't change the data flow profile after the data flow graph is created.
> If you want to change the data flow profile of an existing data flow graph, delete the original data flow graph and create a new one with the new data flow profile.

# [Bicep](#tab/bicep)

In Bicep, you specify the profile by creating the data flow graph as a child resource of the profile:

```bicep
resource defaultDataflowProfile 'Microsoft.IoTOperations/instances/dataflowProfiles@2025-10-01' existing = {
  parent: aioInstance
  name: 'default'
}

resource dataflowGraph 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflowGraphs@2025-10-01' = {
  parent: defaultDataflowProfile  // This establishes the profile relationship
  // ... other properties
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowGraph
metadata:
  name: my-dataflow-graph
  namespace: azure-iot-operations
spec:
  profileRef: default  # Reference to the profile name
  # ... other properties
```

---

### Request disk persistence

> [!IMPORTANT]
> There is a known issue with disk persistence for data flow graphs. This feature is currently not working as expected. For more information, see [Known issues](../troubleshoot/known-issues.md).

Request disk persistence allows data flow graphs to maintain state across restarts. When you enable this feature, the graph can recover processing state if connected broker restarts. This feature is useful for stateful processing scenarios where losing intermediate data would be problematic. When you enable request disk persistence, the broker persists the MQTT data, like messages in the subscriber queue, to disk. This approach ensures that your data flow's data source won't experience data loss during power outages or broker restarts. The broker maintains optimal performance because persistence is configured per data flow, so only the data flows that need persistence use this feature.

The data flow graph makes this persistence request during subscription using an MQTTv5 user property. This feature only works when:

- The data flow uses the MQTT broker as a source (source node with MQTT endpoint)
- The MQTT broker has persistence enabled with dynamic persistence mode set to `Enabled` for the data type, like subscriber queues

This configuration allows MQTT clients like data flow graphs to request disk persistence for their subscriptions using MQTTv5 user properties. For detailed MQTT broker persistence configuration, see [Configure MQTT broker persistence](../manage-mqtt-broker/howto-broker-persistence.md).

The setting accepts `Enabled` or `Disabled`, with `Disabled` as the default.

# [Operations experience](#tab/portal)

When creating or editing a data flow graph, in the **Data flow properties** pane, you can check **Request data persistence** to **Yes** to set the request disk persistence to `Enabled`. If you leave it unchecked, the setting is `Disabled`.

# [Bicep](#tab/bicep)

```bicep
resource dataflowGraph 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflowGraphs@2025-10-01' = {
  // ... other properties
  properties: {
    requestDiskPersistence: 'Enabled'
    // ... other properties
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowGraph
metadata:
  name: my-dataflow-graph
  namespace: azure-iot-operations
spec:
  requestDiskPersistence: Enabled
  # ... other properties
```

---

### Node configuration

Nodes are the building blocks of a data flow graph. Each node has a unique name within the graph and performs a specific function. There are three types of nodes:

#### Source nodes

Source nodes define where data enters the graph. They connect to data flow endpoints that receive data from MQTT brokers or Kafka topics. Each source node must specify:

- Endpoint reference that points to a configured data flow endpoint
- Data sources as a list of MQTT topics or Kafka topics to subscribe to
- Asset reference (optional) that links to an Azure Device Registry asset for schema inference

The data sources array allows you to subscribe to multiple topics without modifying the endpoint configuration. This flexibility enables endpoint reuse across different data flows.

> [!NOTE]
> Currently, only MQTT and Kafka endpoints are supported as data sources for data flow graphs. For more information, see [Configure data flow endpoints](howto-configure-dataflow-endpoint.md).

# [Operations experience](#tab/portal)

In the data flow diagram, select **Source** to configure the source node. Under **Source details**, select **Data flow Endpoint**, then use the **Topic(s)** field to specify the MQTT topic filters to subscribe to for incoming messages. You can add multiple MQTT topics by selecting **Add row** and entering a new topic.

# [Bicep](#tab/bicep)

```bicep
{
  nodeType: 'Source'
  name: 'sensor-data-source'
  sourceSettings: {
    endpointRef: 'default'  // References a data flow endpoint
    dataSources: [
      'sensor/+/temperature'  // MQTT topic with wildcard
      'sensor/+/humidity'
    ]
    assetRef: 'weather-station-asset'  // Optional asset reference
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
- nodeType: Source
  name: sensor-data-source
  sourceSettings:
    endpointRef: default  # References a data flow endpoint
    dataSources:
      - sensor/+/temperature  # MQTT topic with wildcard
      - sensor/+/humidity
    assetRef: weather-station-asset  # Optional asset reference
```

---

#### Graph processing nodes

Graph processing nodes contain the WebAssembly modules that transform data. These nodes pull WASM artifacts from container registries and execute them with specified configuration parameters. Each graph node requires:

- Registry endpoint reference that points to a registry endpoint for pulling artifacts
- Artifact specification that defines the module name and version to pull
- Configuration parameters as key-value pairs passed to the WASM module

The configuration array allows you to customize module behavior without rebuilding the WASM artifact. Common configuration options include processing parameters, thresholds, conversion settings, and feature flags.

# [Operations experience](#tab/portal)

In the data flow diagram, select **Add graph transform (optional)** to add a graph processing node. In the **Graph selection** pane, select the desired graph artifact, either simple or complex graph, and click **Apply**. You can configure some graph operator settings by selecting the graph node in the diagram.

# [Bicep](#tab/bicep)

```bicep
{
  nodeType: 'Graph'
  name: 'temperature-processor'
  graphSettings: {
    registryEndpointRef: 'my-acr-endpoint'
    artifact: 'temperature-converter:2.1.0'
    configuration: [
      {
        key: 'input-unit'
        value: 'fahrenheit'
      }
      {
        key: 'output-unit' 
        value: 'celsius'
      }
      {
        key: 'precision'
        value: '2'
      }
      {
        key: 'enable-filtering'
        value: 'true'
      }
    ]
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
- nodeType: Graph
  name: temperature-processor
  graphSettings:
    registryEndpointRef: my-acr-endpoint
    artifact: temperature-converter:2.1.0
    configuration:
      - key: input-unit
        value: fahrenheit
      - key: output-unit
        value: celsius
      - key: precision
        value: "2"
      - key: enable-filtering
        value: "true"
```

---

The configuration key-value pairs are passed to the WASM module at runtime. The module can access these values to customize its behavior. This approach allows you to:

- Deploy the same WASM module with different configurations
- Adjust processing parameters without rebuilding modules
- Enable or disable features based on deployment requirements
- Set environment-specific values like thresholds or endpoints

#### Destination nodes

Destination nodes define where processed data is sent. They connect to data flow endpoints that send data to MQTT brokers, cloud storage, or other systems. Each destination node specifies:

- Endpoint reference that points to a configured data flow endpoint
- Data destination as the specific topic, path, or location for output data
- Output schema settings (optional) that define serialization format and schema validation

For storage destinations like Azure Data Lake or Fabric OneLake, you can specify output schema settings to control how data is serialized and validated.

> [!NOTE]
> Currently, only MQTT, Kafka, and OpenTelemetry endpoints are supported as data destinations for data flow graphs. For more information, see [Configure data flow endpoints](howto-configure-dataflow-endpoint.md).

# [Operations experience](#tab/portal)

1. In the data flow diagram, select the **Destination** node.
1. Select the desired data flow endpoint from the **Data flow endpoint details** dropdown. 
1. Select **Proceed** to configure the destination.
1. Enter the **required settings** for the destination, including the topic or table to send the data to. The data destination field is automatically interpreted based on the endpoint type. For example, if the data flow endpoint is an MQTT endpoint, the destination details page prompts you to enter the topic.

# [Bicep](#tab/bicep)

```bicep
{
  nodeType: 'Destination'
  name: 'cloud-storage-destination'
  destinationSettings: {
    endpointRef: 'azure-storage-endpoint'
    dataDestination: 'processed-data/temperature'
    outputSchemaSettings: {
      serializationFormat: 'Parquet'
      schemaRef: 'temperature-output-schema:1'
    }
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
- nodeType: Destination
  name: cloud-storage-destination
  destinationSettings:
    endpointRef: azure-storage-endpoint
    dataDestination: processed-data/temperature
    outputSchemaSettings:
      serializationFormat: Parquet
      schemaRef: temperature-output-schema:1
```

---

### Node connections

Node connections define the data flow path between nodes. Each connection specifies a source node and destination node, creating the processing pipeline. Connections can optionally include schema validation to ensure data integrity between processing stages.

When you specify schema validation, the system validates data format and structure as it flows between nodes. The validation helps catch data inconsistencies early and ensures WASM modules receive data in the expected format.

# [Operations experience](#tab/portal)

The operations experience automatically creates node connections when you select the graph processing node. You can't modify the connections after the graph is created.

# [Bicep](#tab/bicep)

```bicep
nodeConnections: [
  {
    from: {
      name: 'sensor-data-source'
      schema: {
        schemaRef: 'sensor-input-schema:1'
        serializationFormat: 'Json'
      }
    }
    to: {
      name: 'temperature-processor'
    }
  }
  {
    from: {
      name: 'temperature-processor'
    }
    to: {
      name: 'cloud-storage-destination'
    }
  }
]
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
nodeConnections:
  - from:
      name: sensor-data-source
      schema:
        schemaRef: sensor-input-schema:1
        serializationFormat: Json
    to:
      name: temperature-processor
  - from:
      name: temperature-processor
    to:
      name: cloud-storage-destination
```

---

### Data flow endpoints

Data flow graphs connect to external systems through data flow endpoints. The type of endpoint determines whether it can be used as a source, destination, or both:

#### MQTT endpoints

MQTT endpoints can serve as both sources and destinations. They connect to MQTT brokers including:

- **Azure IoT Operations local MQTT broker** (required in every data flow)
- **Azure Event Grid MQTT**
- **Custom MQTT brokers**

For detailed configuration information, see [Configure MQTT data flow endpoints](howto-configure-mqtt-endpoint.md).

#### Kafka endpoints  

Kafka endpoints can serve as both sources and destinations. They connect to Kafka-compatible systems including:

- **Azure Event Hubs** (Kafka-compatible)
- **Apache Kafka clusters**
- **Confluent Cloud**

For detailed configuration information, see [Configure Azure Event Hubs and Kafka data flow endpoints](howto-configure-kafka-endpoint.md).

#### Storage endpoints

Storage endpoints can only serve as destinations. They connect to cloud storage systems for long-term data retention and analytics:

- **Azure Data Lake Storage**
- **Microsoft Fabric OneLake** 
- **Local storage**

Storage endpoints typically require output schema settings to define data serialization format.

#### Registry endpoints

Registry endpoints provide access to container registries for pulling WASM modules and graph definitions. They're not used directly in data flow but graph processing nodes reference them.

For detailed configuration information, see [Configure registry endpoints](howto-configure-registry-endpoint.md).


## Related content

- [Configure WebAssembly graph definitions](howto-configure-wasm-graph-definitions.md)
- [Develop WebAssembly modules for data flow graphs](../develop-edge-apps/howto-develop-wasm-modules.md)
- [Configure registry endpoints](howto-configure-registry-endpoint.md)
- [Configure MQTT data flow endpoints](howto-configure-mqtt-endpoint.md)
- [Configure Azure Event Hubs and Kafka data flow endpoints](howto-configure-kafka-endpoint.md)
- [Configure Azure Data Lake Storage data flow endpoints](howto-configure-adlsv2-endpoint.md)
- [Configure Microsoft Fabric OneLake data flow endpoints](howto-configure-fabric-endpoint.md)