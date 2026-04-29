---
title: Deploy WebAssembly modules and graph definitions
description: Learn how to deploy and configure WebAssembly modules and graph definitions that define data processing capabilities for Azure IoT Operations data flow graphs and the HTTP/REST connector.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 03/24/2026
ai-usage: ai-assisted

---

# Deploy WebAssembly (WASM) modules and graph definitions

Azure IoT Operations data flow graphs support WebAssembly (WASM) modules for custom data processing at the edge. You can deploy custom business logic and data transformations as part of your data flow pipelines.

> [!IMPORTANT]
> Data flow graphs currently only support MQTT, Kafka, and OpenTelemetry endpoints. Other endpoint types like Data Lake, Microsoft Fabric OneLake, Azure Data Explorer, and Local Storage are not supported. For more information, see [Known issues](../troubleshoot/known-issues.md#data-flow-graphs-only-support-specific-endpoint-types).

> [!IMPORTANT]
> Currently the only connector that supports graph definitions for custom processing is the HTTP/REST connector.

## Prerequisites

- Deploy an Azure IoT Operations instance on an Arc-enabled Kubernetes cluster. For more information, see [Deploy Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md).
- Configure a registry endpoint to enable your Azure IoT Operations instance to access a container registry. For more information, see [Configure registry endpoints](howto-configure-registry-endpoint.md).

If you want to use a private registry like Azure Container Registry (ACR), you also need:

- Access to a container registry like ACR to store WASM modules and graphs.
- Install the OCI Registry As Storage (ORAS) CLI to push WASM modules to the registry.

> [!TIP]
> For a quick start without setting up a private registry, you can use the prebuilt sample modules directly from the public GitHub Container Registry (ghcr.io). See [Use prebuilt modules from a public registry](#use-prebuilt-modules-from-a-public-registry) for instructions.

## Overview

WASM modules in Azure IoT Operations data flow graphs and connectors let you process data at the edge with high performance and security. WASM runs in a sandboxed environment and supports Rust and Python.

## Use prebuilt modules from a public registry

The fastest way to get started is to use the prebuilt sample WASM modules and graph definitions directly from the public GitHub Container Registry. This approach doesn't require setting up a private registry, ORAS CLI, or any pull/push steps.

### Create a registry endpoint for the public registry

Create a registry endpoint that points to the public registry where the sample modules are hosted:

# [Bicep](#tab/bicep)

```bicep
resource publicRegistryEndpoint 'Microsoft.IoTOperations/instances/registryEndpoints@2025-10-01-preview' = {
  parent: aioInstance
  name: 'public-ghcr'
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    host: 'ghcr.io/azure-samples/explore-iot-operations'
    authentication: {
      method: 'Anonymous'
      anonymousSettings: {}
    }
  }
}
```

# [Kubernetes](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: RegistryEndpoint
metadata:
  name: public-ghcr
  namespace: azure-iot-operations
spec:
  host: ghcr.io/azure-samples/explore-iot-operations
  authentication:
    method: Anonymous
    anonymousSettings: {}
```

Apply the manifest:

```bash
kubectl apply -f registry-endpoint.yaml
```

---

After you create this registry endpoint, you can reference it in your data flow graphs by using `registryEndpointRef: public-ghcr`. The following sample modules and graph definitions are available:

| Artifact | Description |
|----------|-------------|
| `graph-simple:1.0.0` | Simple temperature conversion graph definition |
| `graph-complex:1.0.0` | Multi-sensor processing graph definition |
| `temperature:1.0.0` | Temperature conversion module (Fahrenheit to Celsius) |
| `window:1.0.0` | Time-based windowing module |
| `snapshot:1.0.0` | Image processing and object detection module |
| `format:1.0.0` | Image format conversion module |
| `humidity:1.0.0` | Humidity data processing module |
| `collection:1.0.0` | Multi-sensor data aggregation module |
| `enrichment:1.0.0` | Metadata enrichment module |
| `filter:1.0.0` | Data filtering module |

To use the simple graph with the public registry, see [Example 1: Basic deployment with one WASM module](../connect-to-cloud/howto-dataflow-graph-wasm.md#example-1-basic-deployment-with-one-wasm-module) and use `public-ghcr` as the registry endpoint name.

## Use a private registry

If you need to use custom modules or want to host your own copies of the sample modules, set up a private container registry like Azure Container Registry (ACR).

### Set up container registry

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

Once you have the sample modules and graphs, push them to your container registry. Replace `<YOUR_ACR_NAME>` with the name of your Azure Container Registry.

> [!IMPORTANT]
> The operations experience discovers artifacts by their OCI **config** media type, not the layer media type. When you push artifacts to a registry, you must set the correct media types or the artifacts won't appear in the operations experience UI:
>
> | Artifact type | Required OCI config media type | Required layer media type |
> |---|---|---|
> | Graph definition | `application/vnd.microsoft.aio.graph.v1+yaml` | `application/yaml` |
> | WASM module | `application/vnd.module.wasm.content.layer.v1+wasm` | `application/wasm` |
>
> If you use a CI/CD pipeline or other tooling to copy artifacts between registries, verify that it preserves these media types. Some tools strip or replace artifact metadata during transfer, which causes the artifacts to silently disappear from the operations experience. For more information, see [Registry artifact requirements](#registry-artifact-requirements).

To ensure the graphs and modules are visible in the operations experience web UI, add the `--config` and `--artifact-type` flags as shown in the following example:

```bash
# Log in to your ACR
az acr login --name <YOUR_ACR_NAME>

# Push modules to your registry
oras push <YOUR_ACR_NAME>.azurecr.io/graph-simple:1.0.0 --config /dev/null:application/vnd.microsoft.aio.graph.v1+yaml graph-simple.yaml:application/yaml --disable-path-validation
oras push <YOUR_ACR_NAME>.azurecr.io/graph-complex:1.0.0 --config /dev/null:application/vnd.microsoft.aio.graph.v1+yaml graph-complex.yaml:application/yaml --disable-path-validation
oras push <YOUR_ACR_NAME>.azurecr.io/temperature:1.0.0 --artifact-type application/vnd.module.wasm.content.layer.v1+wasm temperature.wasm:application/wasm
oras push <YOUR_ACR_NAME>.azurecr.io/window:1.0.0 --artifact-type application/vnd.module.wasm.content.layer.v1+wasm window.wasm:application/wasm
oras push <YOUR_ACR_NAME>.azurecr.io/snapshot:1.0.0 --artifact-type application/vnd.module.wasm.content.layer.v1+wasm snapshot.wasm:application/wasm
oras push <YOUR_ACR_NAME>.azurecr.io/format:1.0.0 --artifact-type application/vnd.module.wasm.content.layer.v1+wasm format.wasm:application/wasm
oras push <YOUR_ACR_NAME>.azurecr.io/humidity:1.0.0 --artifact-type application/vnd.module.wasm.content.layer.v1+wasm humidity.wasm:application/wasm
oras push <YOUR_ACR_NAME>.azurecr.io/collection:1.0.0 --artifact-type application/vnd.module.wasm.content.layer.v1+wasm collection.wasm:application/wasm
oras push <YOUR_ACR_NAME>.azurecr.io/enrichment:1.0.0 --artifact-type application/vnd.module.wasm.content.layer.v1+wasm enrichment.wasm:application/wasm
oras push <YOUR_ACR_NAME>.azurecr.io/filter:1.0.0 --artifact-type application/vnd.module.wasm.content.layer.v1+wasm filter.wasm:application/wasm
```

> [!TIP]
> You can also push your own modules and create custom graphs, see [Configuration of custom data flow graphs](howto-configure-wasm-graph-definitions.md).

## Update a module in a running graph

You can update a WASM module in a running graph without stopping the graph. This is useful when you want to update the logic of an operator without stopping the dataflow. For example, to update the temperature conversion module from version `1.0.0` to `2.0.0`, upload the new version as follows:

```bash
oras push <YOUR_ACR_NAME>.azurecr.io/temperature:2.0.0 --artifact-type application/vnd.module.wasm.content.layer.v1+wasm temperature.wasm:application/wasm
```

> [!NOTE]
> If you push new content to the **same tag** (for example, overwriting `temperature:1.0.0`), the data flow graph automatically picks up the updated module without additional configuration. However, if you push to a **new tag** (for example, `temperature:2.0.0`), you must also update the graph definition YAML to reference the new version and re-push the graph artifact.

## Develop custom WASM modules

To create custom data processing logic for your data flow graphs, develop WebAssembly modules in Rust or Python. Custom modules enable you to implement specialized business logic, data transformations, and analytics that aren't available in the built-in operators.

For comprehensive development guidance including:
- Setting up your development environment
- Creating operators in Rust and Python
- Understanding the data model and interfaces
- Building and testing your modules

See [Develop WebAssembly modules for data flow graphs](../develop-edge-apps/howto-build-wasm-modules.md).

For detailed information about creating and configuring the YAML graph definitions that define your data processing workflows, see [Configure WebAssembly graph definitions](../develop-edge-apps/howto-configure-wasm-graph-definitions.md).


## Registry artifact requirements

The operations experience uses OCI artifact metadata to discover and display graphs and modules. Understanding these requirements is important when you build custom CI/CD pipelines, copy artifacts between registries, or troubleshoot missing artifacts in the UI.

### How artifact discovery works

When you push an artifact to a registry with ORAS, the OCI manifest includes two relevant fields:

- **Config media type**: Identifies what kind of artifact this is. The operations experience filters on this field to find graphs and modules.
- **Layer media type**: Describes the content format of the actual file (YAML or WASM).

The operations experience uses the config media type for discovery, not the layer media type. If the config media type is missing or incorrect, the artifact exists in the registry but doesn't appear in the UI.

### Required media types

| Artifact type | Config media type (`--config` or `--artifact-type`) | Layer media type |
|---|---|---|
| Graph definition | `application/vnd.microsoft.aio.graph.v1+yaml` | `application/yaml` |
| WASM module | `application/vnd.module.wasm.content.layer.v1+wasm` | `application/wasm` |

For graph definitions, pass the config media type with the `--config` flag:

```bash
oras push <REGISTRY>/my-graph:1.0.0 \
  --config /dev/null:application/vnd.microsoft.aio.graph.v1+yaml \
  graph.yaml:application/yaml \
  --disable-path-validation
```

For WASM modules, pass it with the `--artifact-type` flag:

```bash
oras push <REGISTRY>/my-module:1.0.0 \
  --artifact-type application/vnd.module.wasm.content.layer.v1+wasm \
  module.wasm:application/wasm
```

### CI/CD pipeline considerations

If you use automated pipelines to copy or promote artifacts between registries (for example, from a staging registry to a production registry), verify that the pipeline preserves OCI artifact metadata. Some tools strip or replace the config media type during transfer, which causes artifacts to silently disappear from the operations experience.

To verify that an artifact has the correct metadata after transfer, inspect its manifest:

```bash
oras manifest fetch <REGISTRY>/my-graph:1.0.0 | jq '{mediaType, configMediaType: .config.mediaType}'
```

The output should show:

```json
{
  "mediaType": "application/vnd.oci.image.manifest.v1+json",
  "configMediaType": "application/vnd.microsoft.aio.graph.v1+yaml"
}
```

If `configMediaType` shows a generic value like `application/vnd.oci.empty.v1+json`, the metadata was stripped and the artifact needs to be re-pushed with the correct flags.

## Related content

- [Develop WebAssembly modules](howto-build-wasm-modules.md) for writing operators in Rust and Python (includes end-to-end quickstart)
- [Configure WebAssembly graph definitions](howto-configure-wasm-graph-definitions.md) for graph YAML structure and configuration parameters
- [Use WebAssembly with data flow graphs](../connect-to-cloud/howto-dataflow-graph-wasm.md) for DataflowGraph resource configuration and examples
- [Build WASM modules with VS Code extension](howto-build-wasm-modules.md) for IDE-based development
- [Configure registry endpoints](howto-configure-registry-endpoint.md)