---
title: Configure WebAssembly Graph Definitions For Data Flow Graphs
description: Learn how to create and configure WebAssembly graph definitions that define data processing workflows for Azure IoT Operations data flow graphs.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 12/17/2025
ai-usage: ai-assisted

---

# Configure WebAssembly (WASM) graph definitions for data flow graphs

Graph definitions are central to WASM development because they define how your modules connect to processing workflows. Understanding the relationship between graph definitions and data flow graphs helps you develop effectively.

WebAssembly (WASM) graph definitions for data flow graphs are generally available.

This article focuses on creating and configuring the YAML graph definitions. For information about deploying and testing WASM data flow graphs, see [Use WebAssembly with data flow graphs](howto-dataflow-graph-wasm.md).

> [!IMPORTANT]
> Data flow graphs currently only support MQTT, Kafka, and OpenTelemetry endpoints. Other endpoint types like Data Lake, Microsoft Fabric OneLake, Azure Data Explorer, and Local Storage are not supported. For more information, see [Known issues](../troubleshoot/known-issues.md#data-flow-graphs-only-support-specific-endpoint-types).

## Graph definition structure

Graph definitions follow a formal [JSON schema](https://www.schemastore.org/aio-wasm-graph-config-1.0.0.json) that validates structure and ensures compatibility. The configuration includes:

- Module requirements for API and host library version compatibility
- Module configurations for runtime parameters and operator customization  
- Operations that define processing nodes in your workflow
- Connections that specify data flow routing between operations
- Schemas for optional data validation

## Basic graph structure

```yaml
metadata:
  $schema: "https://www.schemastore.org/aio-wasm-graph-config-1.0.0.json"
  name: "Simple graph"
  description: "A simple graph with a source, a map module, and a sink"
  version: "1.0.0"
  vendor: "Microsoft"

moduleRequirements:
  apiVersion: "1.1.0"
  runtimeVersion: "1.1.0"

operations:
  - operationType: "source"
    name: "data-source"
  - operationType: "map"
    name: "my-operator/map"
    module: "my-operator:1.0.0"
  - operationType: "sink"
    name: "data-sink"

connections:
  - from: { name: "data-source" }
    to: { name: "my-operator/map" }
  - from: { name: "my-operator/map" }
    to: { name: "data-sink" }
```

## Version compatibility

The `moduleRequirements` section ensures compatibility using semantic versioning:

```yaml
moduleRequirements:
  apiVersion: "1.1.0"          # WASI API version for interface compatibility
  runtimeVersion: "1.1.0"     # Runtime version providing runtime support
  features:                    # Optional features required by modules
    - name: "wasi-nn"
```

> [!TIP]
> For guidance on enabling in-band ONNX inference with the `wasi-nn` feature, see [Run ONNX inference in WebAssembly data flow graphs](../develop-edge-apps/howto-wasm-onnx-inference.md).

## Example 1: Simple graph definition

The [simple graph definition](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm/graph-simple.yaml) demonstrates a basic three-stage pipeline that converts temperature data from Fahrenheit to Celsius:

:::code language="yaml" source="~/azure-iot-operations-samples/samples/wasm/graph-simple.yaml":::

For step-by-step deployment instructions and testing guidance for this example, see [Example 1: Basic deployment with one WASM module](howto-dataflow-graph-wasm.md#example-1-basic-deployment-with-one-wasm-module).

### How the simple graph works

This graph creates a straightforward data processing pipeline:

1. **Source operation**: Receives temperature data from the data flow's source endpoint
2. **Map operation**: Processes data with the temperature WASM module (`temperature:1.0.0`)
3. **Sink operation**: Sends converted data to the data flow's destination endpoint

The [temperature module](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/wasm/operators/temperature/src/lib.rs) converts Fahrenheit to Celsius using the standard formula `(F - 32) × 5/9 = C`.

**Input format:**
```json
{"temperature": {"value": 100.0, "unit": "F"}}
```

**Output format:**
```json
{"temperature": {"value": 37.8, "unit": "C"}}
```

## Example 2: Complex graph definition

The [complex graph definition](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm/graph-complex.yaml) demonstrates a sophisticated multi-sensor processing workflow that handles temperature, humidity, and image data with advanced analytics:

:::code language="yaml" source="~/azure-iot-operations-samples/samples/wasm/graph-complex.yaml":::

For step-by-step deployment instructions and testing guidance for this example, see [Example 2: Deploy a complex graph](howto-dataflow-graph-wasm.md#example-2-deploy-a-complex-graph).

### How the complex graph works

The complex graph processes three data streams and combines them into enriched sensor analytics:

<!-- 
```mermaid
graph TD
  source["source"]
  delay["module-window/delay"]
  branch_snapshot["module-snapshot/branch"]
  branch_temp["module-temperature/branch"]
  map_temp["module-temperature/map (F -> C)"]
  filter_temp["module-temperature/filter (valid)"]
  accumulate_temp["module-temperature/accumulate (max, min, avg, last)"]
  accumulate_humidity["module-humidity/accumulate (max, min, avg, last)"]
  map_format["module-format/map (image, snapshot)"]
  map_snapshot["module-snapshot/map (object detection)"]
  accumulate_snapshot["module-snapshot/accumulate (collection)"]
  concatenate["concatenate"]
  accumulate_collection["module-collection/accumulate"]
  map_enrichment["module-enrichment/map (overtemp, topic)"]
  sink["sink"]
  source - -> delay
  delay - -> branch_snapshot
  branch_snapshot - ->|sensor data| branch_temp
  branch_snapshot - ->|snapshot| map_format
  map_format - -> map_snapshot
  map_snapshot - -> accumulate_snapshot
  accumulate_snapshot - -> concatenate
  branch_temp - ->|temp| map_temp
  branch_temp - ->|humidity| accumulate_humidity
  map_temp - -> filter_temp
  filter_temp - -> accumulate_temp
  accumulate_temp - -> concatenate
  accumulate_humidity - -> concatenate
  concatenate - -> accumulate_collection
  accumulate_collection - -> map_enrichment
  map_enrichment - -> sink
``` 
-->

:::image type="content" source="media/howto-configure-wasm-graph-definitions/wasm-dataflow-graph-complex.svg" alt-text="Diagram showing a complex data flow graph example with multiple modules." border="false":::

As shown in the diagram, data flows from a single source through multiple processing stages:

1. **Window module**: Delays incoming data for time-based processing
2. **Branch operation**: Routes data based on content type (sensor data vs. snapshots)
3. **Temperature processing path**:
   - Converts Fahrenheit to Celsius
   - Filters invalid readings  
   - Calculates statistical summaries over time windows
4. **Humidity processing path**:
   - Accumulates humidity measurements with statistical analysis
5. **Image processing path**:
   - Formats image data for processing
   - Performs object detection on camera snapshots
6. **Final aggregation**:
   - Concatenates all processed data streams
   - Aggregates multi-sensor results
   - Adds metadata and overtemperature alerts

The graph uses specialized modules from the [Rust examples](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm/operators):

- Window module for time-based processing delays
- Temperature modules for conversion, filtering, and statistical analysis
- Humidity module for environmental data processing
- Snapshot modules for image data routing and object detection
- Format module for image preparation for processing
- Collection module for multi-sensor data aggregation
- Enrichment module for metadata addition and alert generation

Branch operations enable parallel processing of different sensor inputs, allowing the graph to handle multiple data types efficiently within a single workflow.

## How graph definitions become data flows

Here's how graph definitions and Azure IoT Operations data flow graphs relate:

Your YAML file defines the internal processing logic with source/sink operations as abstract endpoints. This becomes the graph definition artifact. Referenced modules implement the actual processing operators as WASM modules. Both graph definitions and WASM modules are uploaded to a container registry (such as Azure Container Registry) as OCI artifacts for registry storage.

The Azure Resource Manager or Kubernetes resource "wraps" the graph definition and connects it to real endpoints as the data flow graph resource. During runtime deployment, the data flow engine pulls the artifacts from the registry and deploys them. For endpoint mapping, the abstract source/sink operations in your graph connect to actual MQTT topics, Azure Event Hubs, or other data sources.

For example, this diagram illustrates the relationship between graph definitions, WASM modules, and data flow graphs:

:::image type="content" source="media/howto-develop-wasm-modules/wasm-dataflow-overall-architecture.svg" alt-text="Diagram showing the relationship between graph definitions, WASM modules, and data flow graphs." border="false":::

<!--
```mermaid
graph LR
    subgraph "Development"
        YML[Graph Definition YAML] 
        WASM1[Temperature Module]
        WASM2[Filter Module]
        WASM3[Analytics Module]
    end
    
    subgraph "Registry (ACR)"
        OCI1[Graph:1.1.0]
        OCI2[Temperature:1.0.0]
        OCI3[Filter:2.1.0]
        OCI4[Analytics:1.5.0]
    end
    
    subgraph "Data Flow Graph"
        MQTT[Source Endpoint] 
        subgraph GDE["Graph Execution"]
            S[source] - -> M1[temperature operator]
            M1 - -> M2[filter operator]
            M2 - -> M3[analytics operator]
            M3 - -> K[sink]
        end
        DEST[Destination Endpoint]
        
        MQTT - -> S
        K - -> DEST
    end
    
    YML -.-> OCI1
    WASM1 -.-> OCI2
    WASM2 -.-> OCI3
    WASM3 -.-> OCI4
    OCI1 -.-> GDE
    OCI2 -.-> M1
    OCI3 -.-> M2
    OCI4 -.-> M3
```
-->

## Registry deployment

Both graph definitions and WASM modules must be uploaded to a container registry as Open Container Initiative (OCI) artifacts before data flow graphs can reference them:

- Graph definitions are packaged as OCI artifacts with media type `application/vnd.oci.image.config.v1+json`
- WASM modules are packaged as OCI artifacts containing the compiled WebAssembly binary
- Use semantic versioning (such as `my-graph:1.0.0`, `temperature-converter:2.1.0`) for proper dependency management
- Registry support is compatible with Azure Container Registry, Docker Hub, and other OCI-compliant registries

The separation enables reusable logic where the same graph definition deploys with different endpoints. It provides environment independence where development, staging, and production use different data sources. It also supports modular deployment where you update endpoint configurations without changing processing logic.

For detailed instructions on uploading graph definitions and WASM modules to registries, see [Use WebAssembly with data flow graphs](howto-dataflow-graph-wasm.md). For complete deployment workflows including registry setup, authentication, and testing, see the examples in that guide.

## Module configuration parameters

Graph definitions can specify runtime parameters for WASM operators through module configurations:

```yaml
moduleConfigurations:
  - name: my-operator/map
    parameters:
      threshold:
        name: temperature_threshold
        description: "Temperature threshold for filtering"
        required: true
      unit:
        name: output_unit
        description: "Output temperature unit"
        required: false
```

These parameters are passed to your WASM operator's `init` function at runtime, enabling dynamic configuration without rebuilding modules. For detailed examples of how to access and use these parameters in your Rust and Python code, see [Module configuration parameters](howto-develop-wasm-modules.md#module-configuration-parameters).

For a complete implementation example, see the [branch module](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm-python/operators/branch), which demonstrates parameter usage for conditional routing logic.

## Next steps

- [Develop WebAssembly modules for data flow graphs](howto-develop-wasm-modules.md)
- [Use WebAssembly with data flow graphs](howto-dataflow-graph-wasm.md)
- [Configure data flow endpoints](howto-configure-dataflow-endpoint.md)
- [Configure registry endpoints](howto-configure-registry-endpoint.md)
- [Configure MQTT data flow endpoints](howto-configure-mqtt-endpoint.md)
