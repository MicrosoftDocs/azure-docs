---
title: Deploy WebAssembly modules and graph definitions
description: Learn how to deploy and configure WebAssembly modules and graph definitions that define data processing capabilities for Azure IoT Operations data flow graphs and the HTTP/REST connector.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 12/16/2025
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
- Use a container registry like Azure Container Registry (ACR) to store WASM modules and graphs.
- Configure a registry endpoint to enable your Azure IoT Operations instance to access your container registry. For more information, see [Configure registry endpoints](howto-configure-registry-endpoint.md).
- Install the OCI Registry As Storage (ORAS) CLI to push WASM modules to the registry.
- Develop custom WASM modules by following guidance in [Build WASM modules for data flows in VS Code](howto-build-wasm-modules-vscode.md) or [Develop WebAssembly (WASM) modules and graph definitions for data flow graphs](howto-develop-wasm-modules.md).

## Overview

WASM modules in Azure IoT Operations data flow graphs and connectors let you process data at the edge with high performance and security. WASM runs in a sandboxed environment and supports Rust and Python.

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
> You can also push your own modules and create custom graphs, see [Configuration of custom data flow graphs](howto-configure-wasm-graph-definitions.md).

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

For detailed information about creating and configuring the YAML graph definitions that define your data processing workflows, see [Configure WebAssembly graph definitions](../develop-edge-apps/howto-configure-wasm-graph-definitions.md).


## Related content

- [Configure WebAssembly graph definitions](../develop-edge-apps/howto-configure-wasm-graph-definitions.md)
- [Develop WebAssembly modules for data flow graphs](../develop-edge-apps/howto-develop-wasm-modules.md)
- [Configure registry endpoints](howto-configure-registry-endpoint.md)