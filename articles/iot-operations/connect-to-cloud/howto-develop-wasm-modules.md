---
title: Develop WebAssembly Modules and Graph Definitions for Data Flow Graphs (Preview)
description: Learn how to develop WebAssembly modules and graph definitions in Rust and Python for custom data processing in Azure IoT Operations data flow graphs.
author: PatAltimore
ms.author: patricka
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 07/22/2025
ai-usage: ai-assisted

---

# Develop WebAssembly modules and graph definitions for data flow graphs (preview)

> [!IMPORTANT]
> WebAssembly (WASM) development for data flow graphs is in **preview**. This feature has limitations and isn't for production workloads.
>
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or not yet released into general availability.

This article shows you how to develop custom WebAssembly (WASM) modules and graph definitions for Azure IoT Operations data flow graphs. Create modules in Rust or Python to implement custom processing logic. Define graph configurations that specify how your modules connect into complete processing workflows.

## Overview

Azure IoT Operations data flow graphs process streaming data through configurable operators implemented as WebAssembly modules. Each operator processes timestamped data while maintaining temporal ordering, enabling real-time analytics with deterministic results.

### Key benefits

- **Real-time processing**: Handle streaming data with consistent low latency
- **Event-time semantics**: Process data based on when events occurred, not when they're processed
- **Fault tolerance**: Built-in support for handling failures and ensuring data consistency
- **Scalability**: Distribute processing across multiple nodes while maintaining order guarantees
- **Multi-language support**: Develop in Rust or Python with consistent interfaces

### Architecture foundation

Data flow graphs build on the [Timely dataflow](https://docs.rs/timely/latest/timely/dataflow/operators/index.html) computational model, which originated from Microsoft Research's Naiad project. This approach ensures:

- **Deterministic processing**: Same input always produces the same output
- **Progress tracking**: The system knows when computations are complete
- **Distributed coordination**: Multiple processing nodes stay synchronized

### Why timely dataflow?

Traditional stream processing systems have several challenges. Out-of-order data means events can arrive later than expected. Partial results make it hard to know when computations finish. Coordination issues happen when synchronizing distributed processing.

Timely dataflow solves these problems through:

#### Timestamps and progress tracking

Every data item carries a timestamp representing its logical time. The system tracks progress through timestamps, enabling several key capabilities:

- **Deterministic processing**: Same input always produces same output
- **Exactly once semantics**: No duplicate or missed processing  
- **Watermarks**: Know when no more data will arrive for a given time

#### Hybrid logical clock

The timestamp mechanism uses a hybrid approach:
```rust
pub struct HybridLogicalClock {
    pub physical_time: u64,  // Wall-clock time when event occurred
    pub logical_time: u64,   // Logical ordering for events at same physical time
}
```

The hybrid logical clock approach ensures several capabilities:

- **Causal ordering**: Effects follow causes
- **Progress guarantees**: The system knows when processing is complete  
- **Distributed coordination**: Multiple nodes stay synchronized

## Understand operators and modules

Understanding the distinction between operators and modules is essential for WASM development:

### Operators

Operators are the fundamental processing units based on [Timely dataflow operators](https://docs.rs/timely/latest/timely/dataflow/operators/index.html). Each operator type serves a specific purpose:

- **[Map](https://docs.rs/timely/latest/timely/dataflow/operators/map/trait.Map.html)**: Transform each data item (such as converting temperature units)
- **[Filter](https://docs.rs/timely/latest/timely/dataflow/operators/filter/trait.Filter.html)**: Allow only certain data items to pass through based on conditions (such as removing invalid readings)
- **[Branch](https://docs.rs/timely/latest/timely/dataflow/operators/branch/trait.Branch.html)**: Route data to different paths based on conditions (such as separating temperature and humidity data)
- **[Accumulate](https://docs.rs/timely/latest/timely/dataflow/operators/count/trait.Accumulate.html)**: Collect and aggregate data within time windows (such as computing statistical summaries)
- **[Concatenate](https://docs.rs/timely/latest/timely/dataflow/operators/core/concat/trait.Concatenate.html)**: Merge multiple data streams while preserving temporal order
- **[Delay](https://docs.rs/timely/latest/timely/dataflow/operators/delay/trait.Delay.html)**: Control timing by advancing timestamps

### Modules

Modules are the implementation of operator logic as WASM code. A single module can implement multiple operator types. For example, a temperature module might provide:

- A map operator for unit conversion.
- A filter operator for threshold checking.
- A branch operator for routing decisions.
- An accumulate operator for statistical aggregation.

### The relationship

The relationship between graph definitions, modules, and operators follows a specific pattern:

```
Graph Definition → References Module → Provides Operator → Processes Data
     ↓                    ↓               ↓              ↓
"temperature:1.0.0" → temperature.wasm → map function → °F to °C
```

The separation allows you to:
- **Module reuse**: Deploy the same WASM module in different graph configurations
- **Independent versioning**: Update graph definitions without rebuilding modules
- **Dynamic configuration**: Pass different parameters to the same module for different behaviors

### WebAssembly Interface Types (WIT)

All operators implement standardized interfaces defined using [WebAssembly Interface Types (WIT)](https://github.com/WebAssembly/component-model/blob/main/design/mvp/WIT.md). WIT provides language-agnostic interface definitions that ensure compatibility between WASM modules and the host runtime.

## Data model and interfaces

All WASM operators work with standardized data models defined using WebAssembly Interface Types (WIT):

### Core data model

```wit
// Core timestamp structure using hybrid logical clock
record timestamp {
    timestamp: timespec,     // Physical time (seconds + nanoseconds)
    node-id: buffer-or-string,  // Logical node identifier
}

// Union type supporting multiple data formats
variant data-model {
    buffer-or-bytes(buffer-or-bytes),    // Raw byte data
    message(message),                    // Structured messages with metadata
    snapshot(snapshot),                  // Video/image frames with timestamps
}

// Structured message format
record message {
    timestamp: timestamp,
    content_type: buffer-or-string,
    payload: message-payload,
}
```

### WIT interface definitions

Each operator type implements a specific WIT interface:

```wit
// Core operator interfaces
interface map {
    use types.{data-model};
    process: func(message: data-model) -> data-model;
}

interface filter {
    use types.{data-model};
    process: func(message: data-model) -> bool;
}

interface branch {
    use types.{data-model, hybrid-logical-clock};
    process: func(timestamp: hybrid-logical-clock, message: data-model) -> bool;
}

interface accumulate {
    use types.{data-model};
    process: func(staged: data-model, message: list<data-model>) -> data-model;
}
```

## Prerequisites

Choose your development language and set up the required tools:

# [Rust](#tab/rust)

- Rust toolchain: Install with `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y`
- WASM target: Add with `rustup target add wasm32-wasip2`
- Build tools: Install with `cargo install wasm-tools --version '=1.201.0' --locked`

# [Python](#tab/python)

- Python 3.8 or later
- componentize-py: Install with `pip install "componentize-py==0.14"`

---

## Configure development environment

# [Rust](#tab/rust)

The WASM Rust SDK is available through a custom Azure DevOps registry. Configure access by setting these environment variables:

```bash
export CARGO_REGISTRIES_AZURE_VSCODE_TINYKUBE_INDEX="sparse+https://pkgs.dev.azure.com/azure-iot-sdks/iot-operations/_packaging/preview/Cargo/index/"
export CARGO_NET_GIT_FETCH_WITH_CLI=true
```

Add the following environment variables to your shell profile for persistent access:

```bash
echo 'export CARGO_REGISTRIES_AZURE_VSCODE_TINYKUBE_INDEX="sparse+https://pkgs.dev.azure.com/azure-iot-sdks/iot-operations/_packaging/preview/Cargo/index/"' >> ~/.bashrc
echo 'export CARGO_NET_GIT_FETCH_WITH_CLI=true' >> ~/.bashrc
source ~/.bashrc
```

# [Python](#tab/python)

Python development uses componentize-py with WebAssembly Interface Types (WIT) for code generation. You don't need any other environment configuration beyond installing the prerequisites.

---

## Create your project

# [Rust](#tab/rust)

```bash
cargo new --lib temperature-converter
cd temperature-converter
```

### Configure Cargo.toml

```toml
[package]
name = "temperature-converter"
version = "0.1.0"
edition = "2021"

[dependencies]
wit-bindgen = "0.22"
tinykube_wasm_sdk = { version = "0.2.0", registry = "azure-vscode-tinykube" }
serde = { version = "1", default-features = false, features = ["derive"] }
serde_json = { version = "1", default-features = false, features = ["alloc"] }

[lib]
crate-type = ["cdylib"]
```

# [Python](#tab/python)

Create a Python file for your operator. The filename should match your module name:

```bash
# Create your operator file
touch temperature_converter.py
```

Python WASM modules don't require other project configuration files. The Python class that implements the operator interface defines the module structure.

---

## Implement your operator

# [Rust](#tab/rust)

```rust
// src/lib.rs
use tinykube_wasm_sdk::logger::{self, Level};
use tinykube_wasm_sdk::macros::map_operator;
use serde_json::{json, Value};

// Import the generated types from wit-bindgen
use crate::tinykube_graph::processor::types::{DataModel, ModuleConfiguration, BufferOrBytes};

fn temperature_converter_init(_configuration: ModuleConfiguration) -> bool {
    logger::log(Level::Info, "temperature-converter", "Init invoked");
    true
}

#[map_operator(init = "temperature_converter_init")]
fn temperature_converter(input: DataModel) -> DataModel {
    let DataModel::Message(mut result) = input else {
        return input;
    };

    let payload = &result.payload.read();
    if let Ok(data_str) = std::str::from_utf8(payload) {
        if let Ok(mut data) = serde_json::from_str::<Value>(data_str) {
            if let Some(temp) = data["value"]["temperature"].as_f64() {
                let fahrenheit = (temp * 9.0 / 5.0) + 32.0;
                data["value"] = json!({
                    "temperature_fahrenheit": fahrenheit,
                    "original_celsius": temp
                });
                
                if let Ok(output_str) = serde_json::to_string(&data) {
                    result.payload = BufferOrBytes::Bytes(output_str.into_bytes());
                }
            }
        }
    }

    DataModel::Message(result)
}
```

# [Python](#tab/python)

```python
# temperature_converter.py
import json
from map_impl import exports
from map_impl import imports
from map_impl.imports import types

class Map(exports.Map):
    def init(self, configuration) -> bool:
        imports.logger.log(imports.logger.Level.INFO, "temperature-converter", "Init invoked")
        return True

    def process(self, message: types.DataModel) -> types.DataModel:
        # Ensure the input is of the expected type  
        if not isinstance(message, types.DataModel_Message):
            imports.logger.log(imports.logger.Level.ERROR, "temperature-converter", "Unexpected input type")
            return message

        # Extract and decode the payload
        buffer = message.value.payload.value
        payload = buffer.read()
        data_str = payload.decode('utf-8')
        
        try:
            data = json.loads(data_str) 
            # Process temperature conversion logic
            if 'value' in data and 'temperature' in data['value']:
                celsius = float(data['value']['temperature'])
                fahrenheit = (celsius * 9/5) + 32
                
                output = {
                    'value': {
                        'temperature_fahrenheit': fahrenheit,
                        'original_celsius': celsius
                    }
                }
                
                output_str = json.dumps(output)
                output_bytes = output_str.encode('utf-8')
                
                # Update the message payload
                message.value.payload = types.BufferOrBytes_Bytes(value=output_bytes)
            
            return message  # Return the modified message
            
        except Exception as e:
            imports.logger.log(imports.logger.Level.ERROR, "temperature-converter", f"Error: {e}")
            return message
```

---

## SDK reference and APIs

# [Rust](#tab/rust)

The WASM Rust SDK provides comprehensive development tools:

#### Operator macros

```rust
use tinykube_wasm_sdk::macros::{map_operator, filter_operator, branch_operator};
use tinykube_wasm_sdk::{DataModel, HybridLogicalClock};

// Map operator - transforms each data item
#[map_operator(init = "my_init_function")]
fn my_map(input: DataModel) -> DataModel {
    // Transform logic here
}

// Filter operator - allows/rejects data based on predicate  
#[filter_operator(init = "my_init_function")]
fn my_filter(input: DataModel) -> bool {
    // Return true to pass data through, false to filter out
}

// Branch operator - routes data to different arms
#[branch_operator(init = "my_init_function")]
fn my_branch(input: DataModel, timestamp: HybridLogicalClock) -> bool {
    // Return true for "True" arm, false for "False" arm
}
```

#### Host APIs

Use the SDK to work with distributed services:

State store for persistent data:

```rust
use tinykube_wasm_sdk::state_store;

// Set value
state_store::set(key.as_bytes(), value.as_bytes(), None, None, options)?;

// Get value  
let response = state_store::get(key.as_bytes(), None)?;

// Delete key
state_store::del(key.as_bytes(), None, None)?;
```

Structured logging:

```rust
use tinykube_wasm_sdk::logger::{self, Level};

logger::log(Level::Info, "my-operator", "Processing started");
logger::log(Level::Error, "my-operator", &format!("Error: {}", error));
```

OpenTelemetry-compatible metrics:

```rust
use tinykube_wasm_sdk::metrics;

// Increment counter
metrics::add_to_counter("requests_total", 1.0, Some(labels))?;

// Record histogram value
metrics::record_to_histogram("processing_duration", duration_ms, Some(labels))?;
```

# [Python](#tab/python)

Python WASM development doesn't use a traditional SDK. Instead, you use generated bindings from WebAssembly Interface Types (WIT). These bindings give you:

Typed interfaces for operators:
```python
from map_impl import exports, imports
from map_impl.imports import types

# Implement the operator interface
class Map(exports.Map):
    def process(self, message: types.DataModel) -> types.DataModel:
        # Your processing logic here
        return message
```

Logging through imports:
```python
# Access to structured logging
imports.logger.log(imports.logger.Level.INFO, "my-operator", "Processing started")
imports.logger.log(imports.logger.Level.ERROR, "my-operator", f"Error: {error}")
```

Error handling:
```python
try:
    # Processing logic
    pass
except Exception as e:
    imports.logger.log(imports.logger.Level.ERROR, "my-operator", f"Error: {e}")
    return message  # Return original message on error
```

---

## Build your module

# [Rust](#tab/rust)

Choose between local development builds or containerized builds:

### Local build

Build directly on your development machine:

```bash
# Build WASM module
cargo build --release --target wasm32-wasip2

# Find your module  
ls target/wasm32-wasip2/release/*.wasm
```

Use local builds for fastest iteration during development and when you need full control over the build environment.

### Docker build

Build using a containerized environment with all dependencies preinstalled:

```bash
# Build release version (default)
docker run --rm -v "$(pwd):/workspace" ghcr.io/azure-samples/explore-iot-operations/rust-wasm-builder --app-name temperature-converter

# Build debug version with symbols  
docker run --rm -v "$(pwd):/workspace" ghcr.io/azure-samples/explore-iot-operations/rust-wasm-builder --app-name temperature-converter --build-mode debug
```

Use Docker builds for consistent builds across different environments and CI/CD pipelines.

# [Python](#tab/python)

Choose between local development builds or containerized builds:

### Local build

Build directly on your development machine:

```bash
# Generate Python bindings from schema
componentize-py -d /path/to/schema/ -w map-impl bindings ./

# Build WASM module
componentize-py -d /path/to/schema/ -w map-impl componentize temperature_converter -o temperature_converter.wasm

# Verify build
file temperature_converter.wasm  # Should show: WebAssembly (wasm) binary module
```

Replace `/path/to/schema/` with the actual path to the WIT schema directory in your development environment.

Use local builds for fastest iteration during development and when you need to debug Python code or binding generation.

### Docker build

Build using a containerized environment with schema paths preconfigured:

```bash
# Build release version (app-name should match your Python filename without .py extension)
docker run --rm -v "$(pwd):/workspace" ghcr.io/azure-samples/explore-iot-operations/python-wasm-builder --app-name temperature_converter --app-type map

# Build debug version with symbols
docker run --rm -v "$(pwd):/workspace" ghcr.io/azure-samples/explore-iot-operations/python-wasm-builder --app-name temperature_converter --app-type map --build-mode debug
```

Use Docker builds for consistent builds across different environments and automatic schema path resolution.

---

## Implement operators

# [Rust](#tab/rust)

For comprehensive examples of map, filter, branch, accumulate, and delay operators, see the [Rust examples](https://github.com/Azure-Samples/explore-iot-operations/tree/wasm/samples/wasm/rust/examples) in the samples repository. Complete implementations include:

- **Map operators**: Data transformation and conversion logic
- **Filter operators**: Conditional data processing and validation
- **Branch operators**: Multi-path routing based on data content
- **Accumulate operators**: Time-windowed aggregation and statistical processing
- **Delay operators**: Time-based processing control
- **Complex workflows**: Multi-operator configurations with state management

For a complete implementation example, see the [branch module](https://github.com/Azure-Samples/explore-iot-operations/tree/wasm/samples/wasm/rust/examples/branch), which demonstrates parameter usage for conditional routing logic.

# [Python](#tab/python)

For comprehensive examples of map, filter, branch, accumulate, and delay operators, see the [Python examples](https://github.com/Azure-Samples/explore-iot-operations/tree/wasm/samples/wasm/python/examples) in the samples repository. Complete implementations include:

- **Map operators**: Data transformation and conversion logic
- **Filter operators**: Conditional data processing and validation
- **Branch operators**: Multi-path routing based on data content
- **Accumulate operators**: Time-windowed aggregation and statistical processing
- **Delay operators**: Time-based processing control
- **Complex workflows**: Multi-operator configurations with state management

The Python examples demonstrate working implementations that show the complete structure for each operator type, including proper error handling and logging patterns.

---

## Graph definitions and WASM integration

Graph definitions are central to WASM development because they define how your modules connect to processing workflows. Understanding the relationship between graph definitions and data flow graphs helps you develop effectively.

### Graph definition structure

Graph definitions follow a formal [JSON schema](https://github.com/Azure-Samples/explore-iot-operations/blob/wasm/samples/wasm/ConfigGraph.json) that validates structure and ensures compatibility. The configuration includes:

- Module requirements: API and host library version compatibility
- Module configurations: Runtime parameters for operator customization  
- Operations: Processing nodes in your workflow
- Connections: Data flow routing between operations
- Schemas (optional): Data validation schemas

### Basic graph structure

```yaml
moduleRequirements:
  apiVersion: "0.2.0"
  hostlibVersion: "0.2.0"

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

### Version compatibility

The `moduleRequirements` section ensures compatibility using semantic versioning:

```yaml
moduleRequirements:
  apiVersion: "0.2.0"          # WASI API version for interface compatibility
  hostlibVersion: "0.2.0"     # Host library version providing runtime support
  features:                    # Optional features required by modules
    - name: "wasi-nn"
```

For working examples, see:
- Simple workflow: [graph-simple.yaml](https://github.com/Azure-Samples/explore-iot-operations/blob/wasm/samples/wasm/graph-simple.yaml) - Basic source → map → sink flow
- Complex processing: [graph-complex.yaml](https://github.com/Azure-Samples/explore-iot-operations/blob/wasm/samples/wasm/graph-complex.yaml) - Multi-operator workflow with branching and aggregation

### How graph definitions become data flows

Here's how graph definitions and Azure IoT Operations data flow graphs relate:

- **Graph definition artifact**: Your YAML file defines the internal processing logic with source/sink operations as abstract endpoints
- **WASM modules**: Referenced modules implement the actual processing operators  
- **Registry storage**: Both graph definitions and WASM modules are uploaded to a container registry (such as Azure Container Registry) as OCI artifacts
- **Data flow graph resource**: The Azure Resource Manager or Kubernetes resource "wraps" the graph definition and connects it to real endpoints
- **Runtime deployment**: The data flow engine pulls the artifacts from the registry and deploys them
- **Endpoint mapping**: The abstract source/sink operations in your graph connect to actual MQTT topics, Azure Event Hubs, or other data sources

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

### Registry deployment

Both graph definitions and WASM modules must upload to a container registry as Open Container Initiative (OCI) artifacts before data flow graphs can reference them:

- **Graph definitions**: Packaged as OCI artifacts with media type `application/vnd.oci.image.config.v1+json`
- **WASM modules**: Packaged as OCI artifacts containing the compiled WebAssembly binary
- **Versioning**: Use semantic versioning (such as `my-graph:1.0.0`, `temperature-converter:2.1.0`) for proper dependency management
- **Registry support**: Compatible with Azure Container Registry, Docker Hub, and other OCI-compliant registries

The separation enables reusable logic where the same graph definition deploys with different endpoints. It provides environment independence where development, staging, and production use different data sources. It also supports modular deployment where you update endpoint configurations without changing processing logic.

For detailed instructions on uploading graph definitions and WASM modules to registries, see [Use WebAssembly with data flow graphs](howto-dataflow-graph-wasm.md).

### Module configuration parameters

Module configurations define runtime parameters that your WASM operators can access:

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

### Consume parameters in code

Parameters are accessed through the `ModuleConfiguration` struct passed to your operator's `init` function:

# [Rust](#tab/rust)

```rust
use tinykube_wasm_sdk::logger::{self, Level};
use tinykube_wasm_sdk::ModuleConfiguration;

fn branch_init(configuration: ModuleConfiguration) -> bool {
    // Access required parameters
    if let Some(threshold_param) = configuration.parameters.get("temperature_threshold") {
        let threshold: f64 = threshold_param.parse().unwrap_or(25.0);
        logger::log(Level::Info, "branch", &format!("Using threshold: {}", threshold));
    }
    
    // Access optional parameters with defaults
    let unit = configuration.parameters
        .get("output_unit")
        .map(|s| s.as_str())
        .unwrap_or("celsius");
    
    true
}
```

# [Python](#tab/python)

```python
def temperature_converter_init(configuration):
    # Access configuration parameters
    threshold = configuration.get_parameter("temperature_threshold")
    unit = configuration.get_parameter("output_unit", default="celsius")
    
    imports.logger.log(imports.logger.Level.INFO, "temperature-converter", 
                      f"Initialized with threshold={threshold}, unit={unit}")
    return True
```

---

For a complete implementation example, see the [branch module](https://github.com/Azure-Samples/explore-iot-operations/tree/wasm/samples/wasm/rust/examples/branch), which demonstrates parameter usage for conditional routing logic.

## Next steps

- See complete examples and advanced patterns in the [Azure IoT Operations WASM samples](https://github.com/Azure-Samples/explore-iot-operations/tree/wasm/samples/wasm) repository.
- Learn how to deploy your modules in [Use WebAssembly with data flow graphs](howto-dataflow-graph-wasm.md).
- Configure your data flow endpoints in [Configure data flow endpoints](howto-configure-dataflow-endpoint.md).

## Related content

- [Use WebAssembly with data flow graphs](howto-dataflow-graph-wasm.md)
- [Configure registry endpoints](howto-configure-registry-endpoint.md)
- [Configure MQTT data flow endpoints](howto-configure-mqtt-endpoint.md)
