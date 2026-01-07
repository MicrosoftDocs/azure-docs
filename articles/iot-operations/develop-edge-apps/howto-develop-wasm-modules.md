---
title: Develop WebAssembly Modules and Graph Definitions for Data Flow Graphs
description: Learn how to develop WebAssembly modules and graph definitions in Rust and Python for custom data processing in Azure IoT Operations data flow graphs.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 12/08/2025
ai-usage: ai-assisted
---

# Develop WebAssembly (WASM) modules and graph definitions for data flow graphs

This article shows you how to develop custom WebAssembly (WASM) modules and graph definitions for Azure IoT Operations data flow graphs. Create modules in Rust or Python to implement custom processing logic. Define graph configurations that specify how your modules connect into complete processing workflows.

> [!IMPORTANT]
> Data flow graphs currently only support MQTT, Kafka, and OpenTelemetry endpoints. Other endpoint types like Azure Data Lake, Microsoft Fabric OneLake, Azure Data Explorer, and local storage aren't supported. For more information, see [Known issues](../troubleshoot/known-issues.md#data-flow-graphs-only-support-specific-endpoint-types).

To learn how to develop WASM modules by using the VS Code extension, see [Build WASM modules with VS Code extension](howto-build-wasm-modules-vscode.md).

To learn more about graphs and WASM in Azure IoT Operations, see:

- [Use a data flow graph with WebAssembly modules](../connect-to-cloud/howto-dataflow-graph-wasm.md)
- [Transform incoming data with WebAssembly modules](../discover-manage-assets/howto-use-http-connector.md#transform-incoming-data)

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

### Why use timely dataflow?

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

- [Map](https://docs.rs/timely/latest/timely/dataflow/operators/map/trait.Map.html): Transform each data item (such as converting temperature units)
- [Filter](https://docs.rs/timely/latest/timely/dataflow/operators/filter/trait.Filter.html): Allow only certain data items to pass through based on conditions (such as removing invalid readings)
- [Branch](https://docs.rs/timely/latest/timely/dataflow/operators/branch/trait.Branch.html): Route data to different paths based on conditions (such as separating temperature and humidity data)
- [Accumulate](https://docs.rs/timely/latest/timely/dataflow/operators/count/trait.Accumulate.html): Collect and aggregate data within time windows (such as computing statistical summaries)
- [Concatenate](https://docs.rs/timely/latest/timely/dataflow/operators/core/concat/trait.Concatenate.html): Merge multiple data streams while preserving temporal order
- [Delay](https://docs.rs/timely/latest/timely/dataflow/operators/delay/trait.Delay.html): Control timing by advancing timestamps

### Modules

Modules are the implementation of operator logic as WASM code. A single module can implement multiple operator types. For example, a temperature module might provide:

- A map operator for unit conversion
- A filter operator for threshold checking
- A branch operator for routing decisions
- An accumulate operator for statistical aggregation

### The relationship

The relationship between graph definitions, modules, and operators follows a specific pattern:

```
Graph Definition → References Module → Provides Operator → Processes Data
     ↓                    ↓               ↓              ↓
"temperature:1.0.0" → temperature.wasm → map function → °F to °C
```

This separation enables:

- **Module reuse**: Deploy the same WASM module in different graph configurations
- **Independent versioning**: Update graph definitions without rebuilding modules
- **Dynamic configuration**: Pass different parameters to the same module for different behaviors

## Prerequisites

Choose your development language and set up the required tools:

# [Rust](#tab/rust)

- Rust toolchain provides `cargo`, `rustc`, and the standard library needed to compile operators. Install with:

  ```bash
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
  ```

- WASM `wasm32-wasip2` target required to build Azure IoT Operations WASM components. Add with:

  ```bash
  rustup target add wasm32-wasip2
  ```

- Build tools provide utilities used by the builders and CI to validate and package WASM artifacts. Install with:

  ```bash
  cargo install wasm-tools --version '=1.201.0' --locked
  ```

# [Python](#tab/python)

- Python 3.8 or later
- `componentize-py` generates bindings and produces WASM components from Python sources that match the Azure IoT Operations WIT schemas. Install with:

  ```bash
  pip install "componentize-py==0.14"
  ```

---

## Configure development environment

# [Rust](#tab/rust)

You can access the WASM Rust SDK through a custom Microsoft Azure DevOps registry. Instead of using environment variables, configure access with a workspace config file:

```toml
# .cargo/config.toml (at your workspace root)
[registries]
aio-wg = { index = "sparse+https://pkgs.dev.azure.com/azure-iot-sdks/iot-operations/_packaging/preview/Cargo/index/" }

[net]
git-fetch-with-cli = true
```

This setup mirrors the sample layout at `samples/wasm/.cargo/config.toml` and keeps registry settings in version control.

# [Python](#tab/python)

Python development uses componentize-py with WebAssembly Interface Types (WIT) for code generation. The WIT schemas define the interfaces between your Python code and the WASM runtime.

**Get the WIT schemas**: You can find the required schemas in the [Azure IoT Operations samples repository](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm-python/schema). Clone or download these schemas to your development environment:

```bash
# Clone the repository to access WIT schemas
git clone https://github.com/Azure-Samples/explore-iot-operations.git
```

The schemas are located at `explore-iot-operations/samples/wasm-python/schema/` and include interface definitions for all supported operator types such as map, filter, and branch.

You don't need any other environment configuration beyond installing the prerequisites and obtaining the WIT schemas.

---

## Create project

Start by creating a new project directory for your operator module. The project structure depends on your chosen language.

# [Rust](#tab/rust)

```bash
cargo new --lib temperature-converter
cd temperature-converter
```

### Configure Cargo.toml

Edit the `Cargo.toml` file to include dependencies for the WASM SDK and other libraries:

```toml
[package]
name = "temperature-converter"
version = "0.1.0"
edition = "2021"

[dependencies]
# WebAssembly Interface Types (WIT) code generation
wit-bindgen = "0.22"

# Azure IoT Operations WASM SDK - provides operator macros and host APIs
wasm_graph_sdk = { version = "=1.1.3", registry = "aio-wg" }

# JSON serialization/deserialization for data processing
serde = { version = "1", default-features = false, features = ["derive"] }
serde_json = { version = "1", default-features = false, features = ["alloc"] }

[lib]
# Required for WASM module compilation
crate-type = ["cdylib"]
```

Notes on versions and registry:
- The SDK version (`=1.1.3`) aligns with the current samples; keeping it pinned avoids breaking changes.
- `registry = "aio-wg"` matches the registry entry defined in `.cargo/config.toml`.

Key dependencies explained:

- `wit-bindgen`: Generates Rust bindings from WebAssembly Interface Types (WIT) definitions, enabling your code to interface with the WASM runtime.
- `wasm_graph_sdk`: Azure IoT Operations SDK providing operator macros, such as `#[map_operator]` and `#[filter_operator]`, and host APIs for logging, metrics, and state management.
- `serde` + `serde_json`: JSON processing libraries for parsing and generating data payloads. `default-features = false` optimizes for WASM size constraints.
- `crate-type = ["cdylib"]`: Compiles the Rust library as a C-compatible dynamic library, which is required for WASM module generation.

# [Python](#tab/python)

Create a Python file for your operator. The filename should match your module name:

```bash
# Create your operator file
touch temperature_converter.py
```

Python WASM modules don't require other project configuration files. The Python class that implements the operator interface defines the module structure.

---

## Create a simple module

Create a simple module that converts temperature from Celsius to Fahrenheit. This example demonstrates the basic structure and processing logic for both Rust and Python implementations.

# [Rust](#tab/rust)

```rust
use serde_json::{json, Value};

use wasm_graph_sdk::logger::{self, Level};
use wasm_graph_sdk::macros::map_operator;

fn fahrenheit_to_celsius_init(_configuration: ModuleConfiguration) -> bool {
    logger::log(Level::Info, "temperature-converter", "Init invoked"); // one-time module init
    true
}

#[map_operator(init = "fahrenheit_to_celsius_init")]
fn fahrenheit_to_celsius(input: DataModel) -> Result<DataModel, Error> {
    let DataModel::Message(mut result) = input else {
        return Err(Error {
            message: "Unexpected input type".to_string(),
        });
    };

    let payload = &result.payload.read(); // payload bytes from inbound message
    if let Ok(data_str) = std::str::from_utf8(payload) {
        if let Ok(mut data) = serde_json::from_str::<Value>(data_str) {
            if let Some(temp) = data["temperature"]["value"].as_f64() {
                let fahrenheit = (temp * 9.0 / 5.0) + 32.0; // Celsius -> Fahrenheit
                data["temperature"] = json!({
                    "value_fahrenheit": fahrenheit,
                    "original_celsius": temp
                });

                if let Ok(output_str) = serde_json::to_string(&data) {
                    // Replace payload with owned bytes so the host receives the updated JSON
                    result.payload = BufferOrBytes::Bytes(output_str.into_bytes());
                }
            }
        }
    }

    Ok(DataModel::Message(result))
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
        # Expect a typed message
        if not isinstance(message, types.DataModel_Message):
            raise ValueError("Unexpected input type: Expected DataModel_Message")

        # Extract payload (Buffer from host or Bytes inline)
        payload_variant = message.value.payload
        if isinstance(payload_variant, types.BufferOrBytes_Buffer):
            payload = payload_variant.value.read()
        elif isinstance(payload_variant, types.BufferOrBytes_Bytes):
            payload = payload_variant.value
        else:
            raise ValueError("Unexpected payload type")

        decoded = payload.decode("utf-8")
        data = json.loads(decoded)

        # Convert Fahrenheit to Celsius if present
        if "temperature" in data and "value" in data["temperature"]:
            temp_f = data["temperature"]["value"]
            if isinstance(temp_f, (int, float)):
                temp_c = (temp_f - 32) * 5.0 / 9.0
                data["temperature"]["value"] = temp_c
                data["temperature"]["unit"] = "C"

                updated_payload = json.dumps(data).encode("utf-8")
                message.value.payload = types.BufferOrBytes_Bytes(value=updated_payload)

        return message
```

---

## Build module

Choose between local development builds or containerized builds based on your development workflow and environment requirements.

### Local build

Build directly on your development machine for fastest iteration during development and when you need full control over the build environment.

# [Rust](#tab/rust)

```bash
# Build WASM module
cargo build --release --target wasm32-wasip2  # target required for Azure IoT Operations WASM components

# Find your module  
ls target/wasm32-wasip2/release/*.wasm
```

# [Python](#tab/python)

```bash
# Navigate to the map operator directory (schema lives in ../../schema)
cd explore-iot-operations/samples/wasm-python/operators/map

# Generate Python bindings from schema
componentize-py -d ../../schema -w map-impl bindings ./

# Build WASM module
componentize-py -d ../../schema -w map-impl componentize temperature_converter -o temperature_converter.wasm

# Verify build
file temperature_converter.wasm  # Should show: WebAssembly (wasm) binary module
```

> [!NOTE]
> To access the WIT schemas, make sure you already cloned the repository as described in the [Configure development environment](#configure-development-environment) section.

---

### Docker build

Build using containerized environments with all dependencies and schemas preconfigured. These Docker images provide consistent builds across different environments and are ideal for CI/CD pipelines.

# [Rust](#tab/rust)

The Azure IoT Operations samples repository maintains the Rust Docker builder and includes all necessary dependencies. For detailed documentation, see [Rust Docker builder usage](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/wasm/README.md#rust-builds-docker-builder).

```bash
# Build release version (optimized for production)
docker run --rm -v "$(pwd):/workspace" ghcr.io/azure-samples/explore-iot-operations/rust-wasm-builder --app-name temperature-converter

# Build debug version (includes debugging symbols and less optimization)
docker run --rm -v "$(pwd):/workspace" ghcr.io/azure-samples/explore-iot-operations/rust-wasm-builder --app-name temperature-converter --build-mode debug
```

**Docker build options:**
- `--app-name`: Must match your Rust crate name from `Cargo.toml`
- `--build-mode`: Choose `release` (default) for optimized builds or `debug` for development builds with symbols

# [Python](#tab/python)

The Azure IoT Operations samples repository maintains the Python Docker builder and includes all necessary dependencies and schemas. For detailed documentation, see [Python Docker builder usage](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/wasm-python/README.md#using-the-streamlined-docker-builder).

```bash
# Build release version (optimized for production)
docker run --rm -v "$(pwd):/workspace" ghcr.io/azure-samples/explore-iot-operations/python-wasm-builder --app-name temperature_converter --app-type map

# Build debug version (includes debugging symbols and less optimization)
docker run --rm -v "$(pwd):/workspace" ghcr.io/azure-samples/explore-iot-operations/python-wasm-builder --app-name temperature_converter --app-type map --build-mode debug
```

**Docker build options:**
- `--app-name`: Must match your Python filename without the `.py` extension
- `--app-type`: Specify the operator type (`map`, `filter`, `branch`, etc.)
- `--build-mode`: Choose `release` (default) for optimized builds or `debug` for development builds with symbols

---

## More examples

# [Rust](#tab/rust)

For comprehensive examples, see the [Rust examples](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm/operators) in the samples repository. Complete implementations include:

- **Map operators**: Data transformation and conversion logic
- **Filter operators**: Conditional data processing and validation
- **Branch operators**: Multi-path routing based on data content
- **Accumulate operators**: Time-windowed aggregation and statistical processing
- **Delay operators**: Time-based processing control

The examples demonstrate working implementations that show the complete structure for each operator type, including proper error handling and logging patterns.

# [Python](#tab/python)

For comprehensive examples, see the [Python examples](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm-python/operators) in the samples repository. Complete implementations include:

- **Map operators**: Data transformation and conversion logic
- **Filter operators**: Conditional data processing and validation
- **Branch operators**: Multi-path routing based on data content

---

## SDK reference and APIs

# [Rust](#tab/rust)

The WASM Rust SDK provides comprehensive development tools:

#### Operator macros

```rust
use wasm_graph_sdk::macros::{map_operator, filter_operator, branch_operator};
use wasm_graph_sdk::{DataModel, HybridLogicalClock};

// Map operator - transforms each data item
#[map_operator(init = "my_init_function")]
fn my_map(input: DataModel) -> Result<DataModel, Error> {
    // Transform logic here
}

// Filter operator - allows/rejects data based on predicate  
#[filter_operator(init = "my_init_function")]
fn my_filter(input: DataModel) -> Result<bool, Error> {
    // Return true to pass data through, false to filter out
}

// Branch operator - routes data to different arms
#[branch_operator(init = "my_init_function")]
fn my_branch(input: DataModel, timestamp: HybridLogicalClock) -> Result<bool, Error> {
    // Return true for "True" arm, false for "False" arm
}
```

#### Module configuration parameters

Your WASM operators can receive runtime configuration parameters through the `ModuleConfiguration` struct passed to the `init` function. You define these parameters in the graph definition, which lets you customize the runtime without rebuilding modules.

```rust
use wasm_graph_sdk::logger::{self, Level};
use wasm_graph_sdk::ModuleConfiguration;

fn my_operator_init(configuration: ModuleConfiguration) -> bool {
    // Access required parameters
    if let Some(threshold_param) = configuration.parameters.get("temperature_threshold") {
        let threshold: f64 = threshold_param.parse().unwrap_or(25.0);
        logger::log(Level::Info, "my-operator", &format!("Using threshold: {}", threshold));
    }
    
    // Access optional parameters with defaults
    let unit = configuration.parameters
        .get("output_unit")
        .map(|s| s.as_str())
        .unwrap_or("celsius");
    
    logger::log(Level::Info, "my-operator", &format!("Output unit: {}", unit));
    true
}
```

For detailed information about defining configuration parameters in graph definitions, see [Module configuration parameters](./howto-configure-wasm-graph-definitions.md#module-configuration-parameters).

#### Host APIs

Use the SDK to work with distributed services:

State store for persistent data:

```rust
use wasm_graph_sdk::state_store;

// Set value
state_store::set(key.as_bytes(), value.as_bytes(), None, None, options)?;

// Get value  
let response = state_store::get(key.as_bytes(), None)?;

// Delete key
state_store::del(key.as_bytes(), None, None)?;
```

Structured logging:

```rust
use wasm_graph_sdk::logger::{self, Level};

logger::log(Level::Info, "my-operator", "Processing started");
logger::log(Level::Error, "my-operator", &format!("Error: {}", error));
```

OpenTelemetry-compatible metrics:

```rust
use wasm_graph_sdk::metrics;

// Increment counter
metrics::add_to_counter("requests_total", 1.0, Some(labels))?;

// Record histogram value
metrics::record_to_histogram("processing_duration", duration_ms, Some(labels))?;
```

# [Python](#tab/python)

Python WASM development doesn't use a traditional SDK. Instead, you use generated bindings from WebAssembly Interface Types (WIT). You can find the WIT schemas in the [Azure IoT Operations samples repository](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm-python/schema).

These bindings provide:

Typed interfaces for operators:

```python
from map_impl import exports, imports
from map_impl.imports import types

# Implement the operator interface
class Map(exports.Map):
    def init(self, configuration) -> bool:
        # Access configuration parameters
        threshold = configuration.get_parameter("temperature_threshold")
        unit = configuration.get_parameter("output_unit", default="celsius")
        
        imports.logger.log(imports.logger.Level.INFO, "my-operator", 
                          f"Initialized with threshold={threshold}, unit={unit}")
        return True
    
    def process(self, message: types.DataModel) -> types.DataModel:
        # Your processing logic here
        return message
```

For detailed information about defining configuration parameters in graph definitions, see [Module configuration parameters](./howto-configure-wasm-graph-definitions.md#module-configuration-parameters).

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

### ONNX inference with WASM

To embed and run small ONNX models inside your modules for in-band inference, see [Run ONNX inference in WebAssembly data flow graphs](./howto-wasm-onnx-inference.md). That article covers packaging models with modules, enabling the wasi-nn feature in graph definitions, and limitations.

### WebAssembly Interface Types (WIT)

All operators implement standardized interfaces defined using [WebAssembly Interface Types (WIT)](https://github.com/WebAssembly/component-model/blob/main/design/mvp/WIT.md). WIT provides language-agnostic interface definitions that ensure compatibility between WASM modules and the host runtime.

You can find the complete WIT schemas for Azure IoT Operations in the [samples repository](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm-python/schema). These schemas define all the interfaces, types, and data structures you work with when developing WASM modules.

### Data model and interfaces

All WASM operators work with standardized data models defined by using WebAssembly Interface Types (WIT):

#### Core data model

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

#### WIT interface definitions

Each operator type implements a specific WIT interface:

```wit
// Core operator interfaces
interface map {
    use types.{data-model};
    process: func(message: data-model) -> result<data-model, error>;
}

interface filter {
    use types.{data-model};
    process: func(message: data-model) -> result<bool, error>;
}

interface branch {
    use types.{data-model, hybrid-logical-clock};
    process: func(timestamp: hybrid-logical-clock, message: data-model) -> result<bool, error>;
}

interface accumulate {
    use types.{data-model};
    process: func(staged: data-model, message: list<data-model>) -> result<data-model, error>;
}
```

## Graph definitions and WASM integration

Graph definitions show how your WASM modules connect to processing workflows. They specify the operations, connections, and parameters that create complete data processing pipelines.

For comprehensive information about creating and configuring graph definitions, including detailed examples of simple and complex workflows, see [Configure WebAssembly graph definitions for data flow graphs](./howto-configure-wasm-graph-definitions.md).

Key topics covered in the graph definitions guide:

- **Graph definition structure**: Understanding the YAML schema and required components
- **Simple graph example**: Basic three-stage temperature conversion pipeline
- **Complex graph example**: Multi-sensor processing with branching and aggregation
- **Module configuration parameters**: Runtime customization of WASM operators
- **Registry deployment**: Packaging and storing graph definitions as OCI artifacts

## Next steps

- See complete examples and advanced patterns in the [Azure IoT Operations WASM samples](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm) repository.
- Learn how to deploy your modules in [Use WebAssembly with data flow graphs](../connect-to-cloud/howto-dataflow-graph-wasm.md).
- Configure your data flow endpoints in [Configure data flow endpoints](../connect-to-cloud/howto-configure-dataflow-endpoint.md).
