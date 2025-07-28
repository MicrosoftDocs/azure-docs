---
title: Use WebAssembly (WASM) with data flow graphs (preview)
description: Learn how to deploy and use WebAssembly modules with data flow graphs in Azure IoT Operations to process data at the edge.
author: PatAltimore
ms.author: patricka
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 07/22/2025
ai-usage: ai-assisted

---

# Use WebAssembly (WASM) with data flow graphs (preview)

> [!IMPORTANT]
> WebAssembly (WASM) with data flow graphs is in **preview**. This feature has limitations and isn't for production workloads.
>
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or not yet released into general availability.

Azure IoT Operations data flow graphs support WebAssembly (WASM) modules for custom data processing at the edge. You can deploy custom business logic and data transformations as part of your data flow pipelines.

## Prerequisites

- Deploy an Azure IoT Operations instance on an Arc-enabled Kubernetes cluster. For more information, see [Deploy Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md).
- Use Azure Container Registry (ACR) to store WASM modules and graphs.
- Install the ORAS CLI to push WASM modules to the registry.

## Overview

WebAssembly (WASM) modules in Azure IoT Operations data flow graphs let you process data at the edge with high performance and security. WASM runs in a sandboxed environment and supports programming languages such as Rust, C++, and AssemblyScript.

### How WASM data flow graphs work

The WASM data flow implementation follows this workflow:

1. **Develop WASM modules**: Write custom processing logic in a supported language and compile it to the WebAssembly Component Model format.
1. **Develop graph definition**: Define how data moves through the modules by using YAML configuration files.
1. **Store artifacts in registry**: Push the compiled WASM modules to a container registry by using OCI-compatible tools such as ORAS.
1. **Configure registry endpoints**: Set up authentication and connection details so Azure IoT Operations can access the container registry.
1. **Create data flow**: Define data sources, the artifact name, and destinations.
1. **Deploy and execute**: Azure IoT Operations pulls WASM modules from the registry and runs them based on the graph definition.

<!-- TODO: Add general system architecture content -->

## Get started with examples

These examples show how to set up and deploy WASM data flow graphs for common scenarios. The examples use hardcoded values and simplified configurations so you can get started quickly.

### Set up container registry

Azure IoT Operations needs a container registry to pull WASM modules and graph definitions. You can use Azure Container Registry (ACR) or another OCI-compatible registry.

To create and configure an Azure Container Registry, see [Deploy Azure Container Registry](). <!-- TODO -->

### Install ORAS CLI

Use the ORAS CLI to push WASM modules and graph definitions to your container registry. For installation instructions, see [Install ORAS](https://oras.land/docs/installation).

### Pull sample modules from public registry

For this preview, use prebuilt sample modules:

```bash
# Pull sample modules and graphs
oras pull tkmodules.azurecr.io/graph-simple:1.0.0
oras pull tkmodules.azurecr.io/graph-complex:1.0.0
oras pull tkmodules.azurecr.io/temperature:1.0.0
oras pull tkmodules.azurecr.io/window:1.0.0
oras pull tkmodules.azurecr.io/snapshot:1.0.0
oras pull tkmodules.azurecr.io/format:1.0.0
oras pull tkmodules.azurecr.io/humidity:1.0.0
oras pull tkmodules.azurecr.io/collection:1.0.0
oras pull tkmodules.azurecr.io/enrichment:1.0.0
oras pull tkmodules.azurecr.io/filter:1.0.0
```

### Push modules to your registry

```bash
# Log in to your ACR
az acr login --name <your-acr-name>

# Push modules to your registry
oras push <your-acr-name>.azurecr.io/graph-simple:1.0.0 graph-simple.yaml
oras push <your-acr-name>.azurecr.io/graph-complex:1.0.0 graph-complex.yaml
oras push <your-acr-name>.azurecr.io/temperature:1.0.0 temperature-1.0.0.wasm
oras push <your-acr-name>.azurecr.io/window:1.0.0 window-1.0.0.wasm
oras push <your-acr-name>.azurecr.io/snapshot:1.0.0 snapshot-1.0.0.wasm
oras push <your-acr-name>.azurecr.io/format:1.0.0 format-1.0.0.wasm
oras push <your-acr-name>.azurecr.io/humidity:1.0.0 humidity-1.0.0.wasm
oras push <your-acr-name>.azurecr.io/collection:1.0.0 collection-1.0.0.wasm
oras push <your-acr-name>.azurecr.io/enrichment:1.0.0 enrichment-1.0.0.wasm
oras push <your-acr-name>.azurecr.io/filter:1.0.0 filter-1.0.0.wasm
```

> [!IMPORTANT]
> Update the ACR references in your data flow deployments if you use a different registry from the sample modules.

### Create a registry endpoint

A registry endpoint defines the connection to your container registry. Data flow graphs use registry endpoints to pull WASM modules and graph definitions from container registries. For detailed information about configuring registry endpoints with different authentication methods and registry types, see [Configure registry endpoints](howto-configure-registry-endpoint.md).

For quick setup with Azure Container Registry, create a registry endpoint with system-assigned managed identity authentication:

# [Bicep](#tab/bicep)

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'
param registryEndpointName string = '<REGISTRY_ENDPOINT_NAME>'
param acrName string = '<YOUR_ACR_NAME>'

resource aioInstance 'Microsoft.IoTOperations/instances@2024-11-01' existing = {
  name: aioInstanceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource registryEndpoint 'Microsoft.IoTOperations/instances/registryEndpoints@2024-11-01' = {
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

# [Kubernetes](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
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

### Get extension name and tenant ID

```azurecli
# Get extension name
az k8s-extension list \
  --resource-group <RESOURCE_GROUP> \
  --cluster-name <CLUSTER_NAME> \
  --cluster-type connectedClusters \
  --query "[?extensionType=='microsoft.iotoperations'].name" \
  --output tsv

# Get tenant ID  
az account show --query tenantId --output tsv
```

The first command returns the extension name (for example, `azure-iot-operations-4gh3y`). The second command returns your tenant ID.

### Configure managed identity permissions

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

This scenario shows a simple data flow that uses a WASM module to convert temperature data from Fahrenheit to Celsius. The source code for this module is available [here](). <!--PLACEHOLDER--> Instead of building the module yourself, use the precompiled version that's already pushed to the ACR as `graph-simple:1.0.0` in earlier steps.

<!-- TODO: Add simple graph YAML definition and explanation -->

### Configure the data flow graph

# [Bicep](#tab/bicep)

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'
param dataflowGraphName string = '<GRAPH_NAME>'
param registryEndpointName string = '<REGISTRY_ENDPOINT_NAME>'

resource aioInstance 'Microsoft.IoTOperations/instances@2024-11-01' existing = {
  name: aioInstanceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource defaultDataflowProfile 'Microsoft.IoTOperations/instances/dataflowProfiles@2024-11-01' existing = {
  parent: aioInstance
  name: 'default'
}

resource dataflowGraph 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflowGraphs@2024-11-01' = {
  parent: defaultDataflowProfile
  name: dataflowGraphName
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    mode: 'Enabled'
    requestDiskPersistence: 'Enabled'
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
              key: 'conversion'
              value: 'fahrenheit-to-celsius'
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

# [Kubernetes](#tab/kubernetes)

Create a YAML file with the following configuration:

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: DataflowGraph
metadata:
  name: <GRAPH_NAME>
  namespace: azure-iot-operations
spec:
  requestDiskPersistence: Enabled
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
          - key: conversion
            value: fahrenheit-to-celsius

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

To test the data flow, send MQTT messages from within the cluster. First, deploy the MQTT client pod by following the instructions in [Test connectivity to MQTT broker with MQTT clients](../manage-mqtt-broker/howto-test-connection.md). The MQTT client provides the authentication tokens and certificates to connect to the broker.

After you deploy the MQTT client pod, open two terminal sessions, and connect to the pod:

```bash
# Connect to the MQTT client pod
kubectl exec -it mqtt-client -n azure-iot-operations -- bash
```

#### Send temperature messages

In the first terminal session, create and run a script to send temperature data in Fahrenheit:

```bash
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
    -D CONNECT authentication-method 'K8S-SAT' \
    -D CONNECT authentication-data $(cat /var/run/secrets/tokens/broker-sat)

  sleep 1
done
```

#### Subscribe to processed messages

In the second terminal session (also connected to the MQTT client pod), subscribe to the output topic to see the converted temperature values:

```bash
# Run from within the MQTT client pod
mosquitto_sub -h aio-broker -p 18883 \
  -t "sensor/temperature/processed" \
  -d \
  --cafile /var/run/certs/ca.crt \
  -D CONNECT authentication-method 'K8S-SAT' \
  -D CONNECT authentication-data $(cat /var/run/secrets/tokens/broker-sat)
```

You see the temperature data converted from Fahrenheit to Celsius by the WASM module.

#### Adding timestamps

Messages can include a timestamp property `__ts` for ordering. The format is `<timestamp>:<counter>:<nodeid>`.

```bash
mosquitto_pub -h aio-broker -p 18883 \
  -m "$payload" \
  -t "sensor/temperature/raw" \
  -d \
  --cafile /var/run/certs/ca.crt \
  -D CONNECT authentication-method 'K8S-SAT' \
  -D CONNECT authentication-data $(cat /var/run/secrets/tokens/broker-sat) \
  -D PUBLISH user-property __ts $(date +%s)000:0:df
```

## Example 2: Deploy a complex graph

This scenario shows a more complex data flow graph that processes multiple data sources and includes advanced processing modules.

<!-- TODO: Add complex graph YAML definition and explanation -->

### Configure the complex data flow graph

# [Bicep](#tab/bicep)

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'
param dataflowGraphName string = '<COMPLEX_GRAPH_NAME>'
param registryEndpointName string = '<REGISTRY_ENDPOINT_NAME>'

resource aioInstance 'Microsoft.IoTOperations/instances@2024-11-01' existing = {
  name: aioInstanceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource defaultDataflowProfile 'Microsoft.IoTOperations/instances/dataflowProfiles@2024-11-01' existing = {
  parent: aioInstance
  name: 'default'
}

resource complexDataflowGraph 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflowGraphs@2024-11-01' = {
  parent: defaultDataflowProfile
  name: dataflowGraphName
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    mode: 'Enabled'
    requestDiskPersistence: 'Enabled'
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
              key: 'processing-mode'
              value: 'enhanced'
            }
            {
              key: 'snapshot_topic'
              value: 'sensor/images/raw'
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

# [Kubernetes](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: DataflowGraph
metadata:
  name: <COMPLEX_GRAPH_NAME>
  namespace: azure-iot-operations
spec:
  requestDiskPersistence: Enabled
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
          - key: processing-mode
            value: enhanced
          - key: snapshot_topic
            value: sensor/images/raw

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

Use the same MQTT client pod setup from the previous example. Connect to the pod and run the following commands from within it.

#### Send humidity messages

In addition to temperature data, send humidity messages from within the MQTT client pod:

```bash
# Run from within the MQTT client pod
while true; do
  # Generate a random humidity value between 30 and 90
  random_value=$(shuf -i 30-90 -n 1)
  payload="{\"humidity\":{\"value\":$random_value}}"

  echo "Publishing humidity: $payload"

  mosquitto_pub -h aio-broker -p 18883 \
    -m "$payload" \
    -t "sensor/humidity/raw" \
    -d \
    --cafile /var/run/certs/ca.crt \
    -D CONNECT authentication-method 'K8S-SAT' \
    -D CONNECT authentication-data $(cat /var/run/secrets/tokens/broker-sat)

  sleep 1
done
```

#### Simulate image data

<!-- TODO: Link to test images -->

For scenarios involving image processing, first copy test images to the MQTT client pod from your local machine:

```bash
# Copy images to the client pod (replace with your image files)
kubectl cp ./images azure-iot-operations/mqtt-client:/tmp
```

Then connect to the pod and send image data:

```bash
# Connect to the MQTT client pod and run from within it
kubectl exec -it mqtt-client -n azure-iot-operations -- bash

# Send image data from within the pod
while true; do
  # Select a random image file
  file=$(ls /tmp/images/*.raw | shuf -n 1)

  echo "Sending file: $file"

  mosquitto_pub -h aio-broker -p 18883 \
    -f "$file" \
    -t "sensor/images/raw" \
    -d \
    --cafile /var/run/certs/ca.crt \
    -D CONNECT authentication-method 'K8S-SAT' \
    -D CONNECT authentication-data $(cat /var/run/secrets/tokens/broker-sat)

  sleep 2
done
```

## Develop WASM modules

> [!NOTE]
> The VS Code extension for WASM module development is currently in private preview. Contact your Microsoft representative for access.

<!-- TODO: Add WASM module development overview -->

### Use WASM operators

<!-- TODO: Add WASM operators documentation content -->

## Develop graph definition

<!-- TODO: Add graph definition development overview -->

## Configuration reference

This section provides detailed information about configuring data flow graphs with WASM modules. It covers all configuration options, data flow endpoints, and advanced settings.

### Data flow graph overview

A data flow graph defines how data flows through WebAssembly modules for processing. Each graph consists of:

- **Mode**: Controls whether the graph is enabled or disabled
- **Profile reference**: Links to a data flow profile that defines scaling and resource settings
- **Disk persistence**: Optionally enables persistent storage for graph state
- **Nodes**: Define the source, processing, and destination components
- **Node connections**: Specify how data flows between nodes

### Mode configuration

The mode property determines whether the data flow graph is actively processing data. You can set the mode to `Enabled` or `Disabled` (case-insensitive). When disabled, the graph stops processing data but retains its configuration.

# [Bicep](#tab/bicep)

```bicep
resource dataflowGraph 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflowGraphs@2024-11-01' = {
  // ... other properties
  properties: {
    mode: 'Enabled'  // or 'Disabled'
    // ... other properties
  }
}
```

# [Kubernetes](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
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

# [Bicep](#tab/bicep)

In Bicep, you specify the profile by creating the data flow graph as a child resource of the profile:

```bicep
resource defaultDataflowProfile 'Microsoft.IoTOperations/instances/dataflowProfiles@2024-11-01' existing = {
  parent: aioInstance
  name: 'default'
}

resource dataflowGraph 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflowGraphs@2024-11-01' = {
  parent: defaultDataflowProfile  // This establishes the profile relationship
  // ... other properties
}
```

# [Kubernetes](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: DataflowGraph
metadata:
  name: my-dataflow-graph
  namespace: azure-iot-operations
spec:
  profileRef: default  # Reference to the profile name
  # ... other properties
```

---

### Disk persistence

Disk persistence allows data flow graphs to maintain state across restarts. When enabled, the graph can recover processing state if pods are restarted. This is useful for stateful processing scenarios where losing intermediate data would be problematic.

The setting accepts `Enabled` or `Disabled` (case-insensitive), with `Disabled` as the default.

# [Bicep](#tab/bicep)

```bicep
resource dataflowGraph 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflowGraphs@2024-11-01' = {
  // ... other properties
  properties: {
    requestDiskPersistence: 'Enabled'
    // ... other properties
  }
}
```

# [Kubernetes](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
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

Source nodes define where data enters the graph. They connect to data flow endpoints that receive data from MQTT brokers, Kafka topics, or other messaging systems. Each source node must specify:

- **Endpoint reference**: Points to a configured data flow endpoint
- **Data sources**: List of MQTT topics or Kafka topics to subscribe to
- **Asset reference** (optional): Links to an Azure Device Registry asset for schema inference

The data sources array allows you to subscribe to multiple topics without modifying the endpoint configuration. This flexibility enables endpoint reuse across different data flows.

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

# [Kubernetes](#tab/kubernetes)

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

- **Registry endpoint reference**: Points to a registry endpoint for pulling artifacts
- **Artifact specification**: Defines the module name and version to pull
- **Configuration parameters**: Key-value pairs passed to the WASM module

The configuration array allows you to customize module behavior without rebuilding the WASM artifact. Common configuration options include processing parameters, thresholds, conversion settings, and feature flags.

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

# [Kubernetes](#tab/kubernetes)

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

- **Endpoint reference**: Points to a configured data flow endpoint
- **Data destination**: The specific topic, path, or location for output data
- **Output schema settings** (optional): Defines serialization format and schema validation

For storage destinations like Azure Data Lake or Fabric OneLake, you can specify output schema settings to control how data is serialized and validated.

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

# [Kubernetes](#tab/kubernetes)

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

When you specify schema validation, the system validates data format and structure as it flows between nodes. This helps catch data inconsistencies early and ensures WASM modules receive data in the expected format.

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

# [Kubernetes](#tab/kubernetes)

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

Registry endpoints provide access to container registries for pulling WASM modules and graph definitions. They're not used directly in data flow but are referenced by graph processing nodes.

For detailed configuration information, see [Configure registry endpoints](howto-configure-registry-endpoint.md).


## Related content

- [Configure registry endpoints](howto-configure-registry-endpoint.md)
- [Configure MQTT data flow endpoints](howto-configure-mqtt-endpoint.md)
- [Configure Azure Event Hubs and Kafka data flow endpoints](howto-configure-kafka-endpoint.md)
- [Configure Azure Data Lake Storage data flow endpoints](howto-configure-adlsv2-endpoint.md)
- [Configure Microsoft Fabric OneLake data flow endpoints](howto-configure-fabric-endpoint.md)