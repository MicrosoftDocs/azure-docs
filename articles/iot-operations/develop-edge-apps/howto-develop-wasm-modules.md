---
title: Develop WebAssembly Modules and Graph Definitions for Data Flow Graphs
description: Learn how to develop WebAssembly modules and graph definitions in Rust and Python for custom data processing in Azure IoT Operations data flow graphs.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 02/27/2026
ai-usage: ai-assisted
---

# Develop WebAssembly (WASM) modules and graph definitions for data flow graphs

This article shows you how to develop custom WebAssembly (WASM) modules for Azure IoT Operations data flow graphs. Build a module in Rust or Python, push it to a registry, deploy it on your cluster, and verify data flows through it end to end.

> [!IMPORTANT]
> Data flow graphs currently only support MQTT, Kafka, and OpenTelemetry endpoints. Other endpoint types like Azure Data Lake, Microsoft Fabric OneLake, Azure Data Explorer, and local storage aren't supported. For more information, see [Known issues](../troubleshoot/known-issues.md#data-flow-graphs-only-support-specific-endpoint-types).

## Quickstart: build, deploy, and verify a WASM module

This section walks you through the complete lifecycle: write a temperature converter, build it, push it to a registry, deploy a DataflowGraph that uses it, send test data, and confirm the output. If you want to skip building and use prebuilt modules instead, see [Deploy prebuilt modules from a public registry](howto-deploy-wasm-graph-definitions.md#use-prebuilt-modules-from-a-public-registry).

### Prerequisites

- An Azure IoT Operations instance deployed on an Arc-enabled Kubernetes cluster. See [Deploy Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md).
- A registry endpoint configured to point to a container registry. See [Configure registry endpoints](howto-configure-registry-endpoint.md).
- [ORAS CLI](https://oras.land/docs/installation) installed for pushing artifacts to the registry.
- `mosquitto_pub` and `mosquitto_sub` (or another MQTT client) for testing.

Choose your development language and install the required tools:

# [Rust](#tab/rust)

```bash
# Install Rust toolchain
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# Add WASM target (required for Azure IoT Operations WASM components)
rustup target add wasm32-wasip2

# Install build tools for validating and packaging WASM artifacts
cargo install wasm-tools --version '=1.201.0' --locked
```

# [Python](#tab/python)

- Python 3.8 or later

```bash
# Install componentize-py for building Python WASM modules
pip install "componentize-py==0.14"

# Clone the samples repo (provides WIT schemas and project structure)
git clone https://github.com/Azure-Samples/explore-iot-operations.git
```

---

### Step 1: Write the module

Create a temperature converter that transforms Fahrenheit to Celsius.

# [Rust](#tab/rust)

```bash
cargo new --lib temperature-converter
cd temperature-converter
```

Create `.cargo/config.toml` to configure the SDK registry:

```toml
[registries]
aio-wg = { index = "sparse+https://pkgs.dev.azure.com/azure-iot-sdks/iot-operations/_packaging/preview/Cargo/index/" }

[build]
target = "wasm32-wasip2"
```

> [!TIP]
> Adding `[build] target = "wasm32-wasip2"` to your `.cargo/config.toml` means you don't need to pass `--target wasm32-wasip2` on every `cargo build` command. The [Azure Samples dataflow graphs repository](https://github.com/Azure-Samples/azure-edge-extensions-aio-dataflow-graphs) uses this pattern.

Edit `Cargo.toml`:

```toml
[package]
name = "temperature-converter"
version = "0.1.0"
edition = "2021"

[dependencies]
wit-bindgen = "0.22"
wasm_graph_sdk = { version = "=1.1.3", registry = "aio-wg" }
serde = { version = "1", default-features = false, features = ["derive"] }
serde_json = { version = "1", default-features = false, features = ["alloc"] }

[lib]
crate-type = ["cdylib"]
```

Write `src/lib.rs`:

```rust
use serde_json::{json, Value};

use wasm_graph_sdk::logger::{self, Level};
use wasm_graph_sdk::macros::map_operator;

fn fahrenheit_to_celsius_init(_configuration: ModuleConfiguration) -> bool {
    logger::log(Level::Info, "temperature-converter", "Init invoked");
    true
}

#[map_operator(init = "fahrenheit_to_celsius_init")]
fn fahrenheit_to_celsius(input: DataModel) -> Result<DataModel, Error> {
    let DataModel::Message(mut result) = input else {
        return Err(Error {
            message: "Unexpected input type".to_string(),
        });
    };

    let payload = &result.payload.read();
    if let Ok(data_str) = std::str::from_utf8(payload) {
        if let Ok(mut data) = serde_json::from_str::<Value>(data_str) {
            if let Some(temp) = data["temperature"]["value"].as_f64() {
                let celsius = (temp - 32.0) * 5.0 / 9.0;
                data["temperature"] = json!({
                    "value_celsius": celsius,
                    "original_fahrenheit": temp
                });

                if let Ok(output_str) = serde_json::to_string(&data) {
                    result.payload = BufferOrBytes::Bytes(output_str.into_bytes());
                }
            }
        }
    }

    Ok(DataModel::Message(result))
}
```

# [Python](#tab/python)

```bash
cd explore-iot-operations/samples/wasm-python/operators/map
```

Create `temperature_converter.py`:

```python
import json
from map_impl import exports
from map_impl import imports
from map_impl.imports import types

class Map(exports.Map):
    def init(self, configuration) -> bool:
        imports.logger.log(imports.logger.Level.INFO, "temperature-converter", "Init invoked")
        return True

    def process(self, message: types.DataModel) -> types.DataModel:
        if not isinstance(message, types.DataModel_Message):
            raise ValueError("Unexpected input type: Expected DataModel_Message")

        payload_variant = message.value.payload
        if isinstance(payload_variant, types.BufferOrBytes_Buffer):
            payload = payload_variant.value.read()
        elif isinstance(payload_variant, types.BufferOrBytes_Bytes):
            payload = payload_variant.value
        else:
            raise ValueError("Unexpected payload type")

        decoded = payload.decode("utf-8")
        data = json.loads(decoded)

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

### Step 2: Build the WASM module

# [Rust](#tab/rust)

```bash
cargo build --release --target wasm32-wasip2
cp target/wasm32-wasip2/release/temperature_converter.wasm .
```

# [Python](#tab/python)

```bash
# Generate Python bindings from WIT schemas
componentize-py -d ../../schema -w map-impl bindings ./

# Build the WASM module
componentize-py -d ../../schema -w map-impl componentize temperature_converter -o temperature_converter.wasm

# Verify build
file temperature_converter.wasm  # Should show: WebAssembly (wasm) binary module
```

---

You can also use the Docker builders for reproducible builds in CI/CD. See [Docker builds](#docker-builds).

### Step 3: Push to a registry

Push your built module and a graph definition to a container registry.

First, create a graph definition file `graph-simple.yaml`:

```yaml
metadata:
  name: "Temperature converter"
  description: "Converts temperature from Fahrenheit to Celsius"
  version: "1.0.0"
  $schema: "https://www.schemastore.org/aio-wasm-graph-config-1.0.0.json"
  vendor: "Contoso"

moduleRequirements:
  apiVersion: "1.1.0"
  runtimeVersion: "1.1.0"

moduleConfigurations:
  - name: module-temperature/map
    parameters: {}

operations:
  - operationType: "source"
    name: "source"

  - operationType: "map"
    name: "module-temperature/map"
    module: "temperature:1.0.0"

  - operationType: "sink"
    name: "sink"

connections:
  - from:
      name: "source"
    to:
      name: "module-temperature/map"

  - from:
      name: "module-temperature/map"
    to:
      name: "sink"
```

Then push both artifacts:

```bash
# Push the WASM module (Rust output is in target/wasm32-wasip2/release/)
oras push <YOUR_REGISTRY>/temperature:1.0.0 \
  --artifact-type application/vnd.module.wasm.content.layer.v1+wasm \
  temperature_converter.wasm:application/wasm

# Push the graph definition
oras push <YOUR_REGISTRY>/graph-simple:1.0.0 \
  --config /dev/null:application/vnd.microsoft.aio.graph.v1+yaml \
  graph-simple.yaml:application/yaml \
  --disable-path-validation
```

Replace `<YOUR_REGISTRY>` with your registry (for example, `myacr.azurecr.io`).

> [!TIP]
> For a quick test without a private registry, you can use the prebuilt modules at `ghcr.io/azure-samples/explore-iot-operations`. See [Deploy prebuilt modules](howto-deploy-wasm-graph-definitions.md#use-prebuilt-modules-from-a-public-registry).

### Step 4: Deploy a DataflowGraph

Create and apply a DataflowGraph resource that reads from an MQTT topic, processes data through your module, and writes to another topic.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowGraph
metadata:
  name: temperature-graph
  namespace: azure-iot-operations
spec:
  profileRef: default
  nodes:
    - nodeType: Source
      name: mqtt-source
      sourceSettings:
        endpointRef: default
        dataSources:
          - thermostats/temperature
    - nodeType: Graph
      name: temperature-converter
      graphSettings:
        registryEndpointRef: my-registry-endpoint
        artifact: graph-simple:1.0.0
        configuration:
          - key: temperature_lower_bound
            value: "-40"
          - key: temperature_upper_bound
            value: "3422"
    - nodeType: Destination
      name: mqtt-destination
      destinationSettings:
        endpointRef: default
        dataDestination: thermostats/temperature/converted
  nodeConnections:
    - from:
        name: mqtt-source
      to:
        name: temperature-converter
    - from:
        name: temperature-converter
      to:
        name: mqtt-destination
```

```bash
kubectl apply -f temperature-graph.yaml
```

### Step 5: Test end to end

Open two terminals. In one, subscribe to the output topic:

```bash
mosquitto_sub -h localhost -t "thermostats/temperature/converted" -v
```

In the other, publish a test message:

```bash
mosquitto_pub -h localhost -t "thermostats/temperature" \
  -m '{"temperature": {"value": 72, "unit": "F"}}'
```

You should see converted output. The exact format depends on which language you used:

# [Rust](#tab/rust)

```json
{"temperature": {"value_celsius": 22.222222222222225, "original_fahrenheit": 72}}
```

# [Python](#tab/python)

```json
{"temperature": {"value": 22.222222222222225, "unit": "C"}}
```

---

If you don't see output, check the dataflow pod logs:

```bash
kubectl logs -l app=aio-dataflow -n azure-iot-operations --tail=50
```

---

Now that you've seen the full lifecycle, the rest of this article covers each step in depth.

## Concepts

### Operators and modules

Operators are the processing units in a data flow graph. Each type serves a specific purpose:

| Operator | Purpose | Return type |
|---|---|---|
| Map | Transform each data item (for example, convert temperature units) | `DataModel` |
| Filter | Pass or drop items based on a condition | `bool` |
| Branch | Route items to two different paths | `bool` |
| Accumulate | Aggregate items within time windows | `DataModel` |
| Concatenate | Merge multiple streams while preserving order | N/A |
| Delay | Advance timestamps to control timing | N/A |

A **module** is the WASM binary that implements one or more operators. For example, a single `temperature.wasm` module can provide both a `map` operator (for conversion) and a `filter` operator (for threshold checking).

```
Graph Definition → References Module → Provides Operator → Processes Data
     ↓                    ↓               ↓              ↓
"temperature:1.0.0" → temperature.wasm → map function → °F to °C
```

This separation lets you reuse the same module with different graph configurations, version modules independently, and change behavior through configuration parameters without rebuilding.

### Timely dataflow model

Data flow graphs build on the [Timely dataflow](https://docs.rs/timely/latest/timely/dataflow/operators/index.html) computational model from Microsoft Research's Naiad project. Every data item carries a hybrid logical clock timestamp:

```wit
record hybrid-logical-clock {
    timestamp: timespec,  // Wall-clock time (secs + nanos)
    counter: u64,         // Logical ordering for same-time events
    node-id: string,      // Originating node
}
```

This gives you deterministic processing (same input always produces same output), exactly-once semantics, and distributed coordination across nodes. For the complete WIT schema, see the [samples repository](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/wasm-python/schema/hybrid_logical_clock.wit).

To learn how to develop WASM modules with the VS Code extension, see [Build WASM modules with VS Code extension](howto-build-wasm-modules-vscode.md).

## Write operators

### Map operator

A map operator transforms each data item and returns a modified copy. The [quickstart example](#step-1-write-the-module) shows a basic map. Here's a more complex example that uses configuration parameters:

# [Rust](#tab/rust)

```rust
use std::sync::OnceLock;
use wasm_graph_sdk::logger::{self, Level};
use wasm_graph_sdk::macros::map_operator;

static OUTPUT_UNIT: OnceLock<String> = OnceLock::new();

fn unit_converter_init(configuration: ModuleConfiguration) -> bool {
    let unit = configuration.properties
        .iter()
        .find(|(k, _)| k == "output_unit")
        .map(|(_, v)| v.clone())
        .unwrap_or_else(|| "celsius".to_string());

    OUTPUT_UNIT.set(unit.clone()).unwrap();
    logger::log(Level::Info, "converter", &format!("Output unit: {unit}"));
    true
}

#[map_operator(init = "unit_converter_init")]
fn convert_temperature(input: DataModel) -> Result<DataModel, Error> {
    let DataModel::Message(mut msg) = input else {
        return Err(Error { message: "Expected Message variant".into() });
    };

    let payload = &msg.payload.read();
    let mut data: serde_json::Value = serde_json::from_slice(payload)
        .map_err(|e| Error { message: format!("JSON parse error: {e}") })?;

    if let Some(temp) = data["temperature"]["value"].as_f64() {
        let unit = OUTPUT_UNIT.get().map(|s| s.as_str()).unwrap_or("celsius");
        let converted = match unit {
            "kelvin" => (temp - 32.0) * 5.0 / 9.0 + 273.15,
            _ => (temp - 32.0) * 5.0 / 9.0, // celsius
        };
        data["temperature"]["value"] = serde_json::json!(converted);
        data["temperature"]["unit"] = serde_json::json!(unit);
        let out = serde_json::to_string(&data).unwrap();
        msg.payload = BufferOrBytes::Bytes(out.into_bytes());
    }

    Ok(DataModel::Message(msg))
}
```

# [Python](#tab/python)

```python
import json
from map_impl import exports, imports
from map_impl.imports import types

def to_bytes(payload_variant):
    if isinstance(payload_variant, types.BufferOrBytes_Buffer):
        return payload_variant.value.read()
    if isinstance(payload_variant, types.BufferOrBytes_Bytes):
        return payload_variant.value
    raise ValueError("Unexpected payload type")

class Map(exports.Map):
    def init(self, configuration) -> bool:
        self.output_unit = "celsius"
        for key, value in configuration.properties:
            if key == "output_unit":
                self.output_unit = value
        imports.logger.log(imports.logger.Level.INFO, "converter",
                          f"Output unit: {self.output_unit}")
        return True

    def process(self, message: types.DataModel) -> types.DataModel:
        if not isinstance(message, types.DataModel_Message):
            raise ValueError("Expected DataModel_Message")
        data = json.loads(to_bytes(message.value.payload).decode("utf-8"))
        if "temperature" in data and "value" in data["temperature"]:
            temp_f = data["temperature"]["value"]
            if self.output_unit == "kelvin":
                converted = (temp_f - 32) * 5.0 / 9.0 + 273.15
            else:
                converted = (temp_f - 32) * 5.0 / 9.0
            data["temperature"]["value"] = converted
            data["temperature"]["unit"] = self.output_unit
            message.value.payload = types.BufferOrBytes_Bytes(
                value=json.dumps(data).encode("utf-8"))
        return message
```

---

### Filter operator

A filter returns `true` to pass data through or `false` to drop it.

# [Rust](#tab/rust)

```rust
use std::sync::OnceLock;
use wasm_graph_sdk::macros::filter_operator;
use wasm_graph_sdk::logger::{self, Level};

const DEFAULT_LOWER: f64 = -40.0;
const DEFAULT_UPPER: f64 = 3422.0;

static LOWER_BOUND: OnceLock<f64> = OnceLock::new();
static UPPER_BOUND: OnceLock<f64> = OnceLock::new();

fn filter_init(configuration: ModuleConfiguration) -> bool {
    for (key, value) in &configuration.properties {
        match key.as_str() {
            "temperature_lower_bound" => {
                if let Ok(v) = value.parse::<f64>() { LOWER_BOUND.set(v).ok(); }
                else { logger::log(Level::Error, "filter", &format!("Invalid lower bound: {value}")); }
            }
            "temperature_upper_bound" => {
                if let Ok(v) = value.parse::<f64>() { UPPER_BOUND.set(v).ok(); }
                else { logger::log(Level::Error, "filter", &format!("Invalid upper bound: {value}")); }
            }
            _ => {}
        }
    }
    true
}

#[filter_operator(init = "filter_init")]
fn filter_temperature(input: DataModel) -> Result<bool, Error> {
    let lower = LOWER_BOUND.get().copied().unwrap_or(DEFAULT_LOWER);
    let upper = UPPER_BOUND.get().copied().unwrap_or(DEFAULT_UPPER);

    let DataModel::Message(msg) = &input else { return Ok(true); };
    let payload = &msg.payload.read();
    let data: serde_json::Value = serde_json::from_slice(payload)
        .map_err(|e| Error { message: format!("JSON parse error: {e}") })?;

    if let Some(temp) = data.get("temperature").and_then(|t| t.get("value")).and_then(|v| v.as_f64()) {
        Ok(temp >= lower && temp <= upper)
    } else {
        Ok(true) // Pass through non-temperature messages
    }
}
```

# [Python](#tab/python)

```python
import json
from filter_impl import exports, imports
from filter_impl.imports import types

def to_bytes(payload_variant):
    if isinstance(payload_variant, types.BufferOrBytes_Buffer):
        return payload_variant.value.read()
    if isinstance(payload_variant, types.BufferOrBytes_Bytes):
        return payload_variant.value
    raise ValueError("Unexpected payload type")

class Filter(exports.Filter):
    def init(self, configuration) -> bool:
        self.lower_bound = -40.0
        self.upper_bound = 3422.0
        for key, value in configuration.properties:
            try:
                if key == "temperature_lower_bound":
                    self.lower_bound = float(value)
                elif key == "temperature_upper_bound":
                    self.upper_bound = float(value)
            except ValueError:
                imports.logger.log(imports.logger.Level.ERROR, "filter",
                                  f"Invalid bound value: {key}={value}")
        imports.logger.log(imports.logger.Level.INFO, "filter",
                          f"Bounds: [{self.lower_bound}, {self.upper_bound}]")
        return True

    def process(self, message: types.DataModel) -> bool:
        if not isinstance(message, types.DataModel_Message):
            return True
        data = json.loads(to_bytes(message.value.payload).decode("utf-8"))
        if "temperature" in data and "value" in data["temperature"]:
            temp = data["temperature"]["value"]
            return self.lower_bound <= temp <= self.upper_bound
        return True
```

---

### Branch operator

A branch routes data to two paths. Return `false` for the first arm, `true` for the second.

# [Rust](#tab/rust)

```rust
use wasm_graph_sdk::macros::branch_operator;

fn branch_init(_configuration: ModuleConfiguration) -> bool { true }

#[branch_operator(init = "branch_init")]
fn branch_by_type(_timestamp: HybridLogicalClock, input: DataModel) -> Result<bool, Error> {
    let DataModel::Message(msg) = &input else { return Ok(true); };
    let payload = &msg.payload.read();
    let data: serde_json::Value = serde_json::from_slice(payload)
        .map_err(|e| Error { message: format!("JSON parse error: {e}") })?;

    // false = first arm (temperature data), true = second arm (everything else)
    Ok(data.get("temperature").is_none())
}
```

# [Python](#tab/python)

```python
import json
from branch_impl import exports, imports
from branch_impl.imports import types

def to_bytes(payload_variant):
    if isinstance(payload_variant, types.BufferOrBytes_Buffer):
        return payload_variant.value.read()
    if isinstance(payload_variant, types.BufferOrBytes_Bytes):
        return payload_variant.value
    raise ValueError("Unexpected payload type")

class Branch(exports.Branch):
    def init(self, configuration) -> bool:
        return True

    def process(self, timestamp: int, input: types.DataModel) -> bool:
        if not isinstance(input, types.DataModel_Message):
            return True
        data = json.loads(to_bytes(input.value.payload).decode("utf-8"))
        return "temperature" not in data
```

---

## Module configuration parameters

Your operators can receive runtime configuration parameters through the `init` function. This lets you customize behavior without rebuilding the module.

The `init` function receives a `ModuleConfiguration` struct:

```wit
record module-configuration {
    properties: list<tuple<string, string>>,   // Key-value pairs from graph definition
    module-schemas: list<module-schema>        // Schema definitions if configured
}
```

The `init` function is called **once** when the module loads. Return `true` to start processing, or `false` to signal a configuration error. If `init` returns `false`, the operator won't process any data and the dataflow logs an error.

> [!IMPORTANT]
> If your operator depends on configuration parameters (for example, filter bounds or threshold values), always handle the case where they aren't provided. Use sensible defaults or return `false` from `init`. Don't call `unwrap()` or panic on missing parameters, because this crashes the operator at runtime with no clear error message.

You define the parameters in the graph definition's `moduleConfigurations` section:

```yaml
moduleConfigurations:
  - name: module-temperature/filter
    parameters:
      temperature_lower_bound:
        name: temperature_lower_bound
        description: "Minimum valid temperature in Celsius"
      temperature_upper_bound:
        name: temperature_upper_bound
        description: "Maximum valid temperature in Celsius"
```

The `name` field must match the operator name in the graph's `operations` section. For more about graph definition structure, see [Configure WebAssembly graph definitions](./howto-configure-wasm-graph-definitions.md#module-configuration-parameters).

## Build options

### Docker builds

Use containerized builds for CI/CD or when you don't want to install the full toolchain locally. The Docker images include all dependencies and schemas.

# [Rust](#tab/rust)

```bash
# Release build
docker run --rm -v "$(pwd):/workspace" \
  ghcr.io/azure-samples/explore-iot-operations/rust-wasm-builder \
  --app-name temperature-converter

# Debug build (includes symbols)
docker run --rm -v "$(pwd):/workspace" \
  ghcr.io/azure-samples/explore-iot-operations/rust-wasm-builder \
  --app-name temperature-converter --build-mode debug
```

`--app-name` must match your crate name from `Cargo.toml`. See [Rust Docker builder docs](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/wasm/README.md#rust-builds-docker-builder) for more options.

# [Python](#tab/python)

```bash
# Release build
docker run --rm -v "$(pwd):/workspace" \
  ghcr.io/azure-samples/explore-iot-operations/python-wasm-builder \
  --app-name temperature_converter --app-type map

# Debug build (includes symbols)
docker run --rm -v "$(pwd):/workspace" \
  ghcr.io/azure-samples/explore-iot-operations/python-wasm-builder \
  --app-name temperature_converter --app-type map --build-mode debug
```

`--app-name` must match your Python filename (without `.py`). `--app-type` must match the operator type (`map`, `filter`, `branch`, etc.). See [Python Docker builder docs](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/wasm-python/README.md#using-the-streamlined-docker-builder) for more options.

---

### Module size and performance

WASM modules run in a sandboxed environment with limited resources. Keep these guidelines in mind:

- **Minimize dependencies.** For Rust, use `default-features = false` on `serde` and `serde_json` to reduce binary size. Avoid pulling in large crates.
- **Module size matters.** Smaller modules load faster and use less memory. A typical temperature converter is ~2 MB (Rust release) or ~5 MB (Python). Use release builds for production.
- **Avoid blocking operations.** The `process` function should complete quickly. Heavy computation delays the entire dataflow pipeline.
- **Use `wasm-tools` to inspect.** Run `wasm-tools component wit your-module.wasm` to verify your module exports the expected interfaces before pushing to a registry.

### Versioning and CI/CD

Use semantic versioning for your modules and graph definitions. The dataflow graph references artifacts by name and tag (for example, `temperature:1.0.0`), so you can update modules without changing graph definitions by pushing a new version with the same tag.

For automated builds, a typical pipeline looks like:

1. Build the WASM module (use the Docker builder for consistency).
2. Run `wasm-tools component wit` to verify exported interfaces.
3. Run unit tests against your core logic (see [Testing](#test-your-modules)).
4. Push to your registry with ORAS, tagging with the build version.
5. (Optional) Update the graph definition's artifact reference and push.

The dataflow graph automatically picks up new module versions pushed to the same tag without requiring a redeployment. See [Update a module in a running graph](howto-deploy-wasm-graph-definitions.md#update-a-module-in-a-running-graph).

## Host APIs

Your WASM modules can use host APIs for state management, logging, and metrics.

### State store

Persist data across `process` calls using the distributed state store:

# [Rust](#tab/rust)

```rust
use wasm_graph_sdk::state_store;

// Set value (fire-and-forget; state_store returns StateStoreError, not types::Error)
let options = state_store::SetOptions {
    conditions: state_store::SetConditions::Unconditional,
    expires: None,
};
let _ = state_store::set(key.as_bytes(), value.as_bytes(), None, None, options);

// Get value
let response = state_store::get(key.as_bytes(), None);

// Delete key
let _ = state_store::del(key.as_bytes(), None, None);
```

# [Python](#tab/python)

```python
# State store access through generated bindings
from map_impl.imports import state_store, state_store_types

options = state_store_types.SetOptions(
    conditions=state_store_types.SetConditions.UNCONDITIONAL,
    expires=None)
state_store.set(key_bytes, value_bytes, None, None, options)
result = state_store.get(key_bytes, None)
state_store.del_(key_bytes, None, None)
```

---

### Logging

Structured logging with severity levels:

# [Rust](#tab/rust)

```rust
use wasm_graph_sdk::logger::{self, Level};

logger::log(Level::Info, "my-operator", "Processing started");
logger::log(Level::Error, "my-operator", &format!("Error: {}", error));
```

# [Python](#tab/python)

```python
imports.logger.log(imports.logger.Level.INFO, "my-operator", "Processing started")
imports.logger.log(imports.logger.Level.ERROR, "my-operator", f"Error: {error}")
```

---

### Metrics

OpenTelemetry-compatible metrics:

# [Rust](#tab/rust)

```rust
use wasm_graph_sdk::metrics::{self, CounterValue, HistogramValue, Label};

let labels = vec![Label { key: "module".to_owned(), value: "my-operator".to_owned() }];
let _ = metrics::add_to_counter("requests_total", CounterValue::U64(1), Some(&labels));
let _ = metrics::record_to_histogram("processing_duration", HistogramValue::F64(duration_ms), Some(&labels));
```

# [Python](#tab/python)

```python
from map_impl.imports import metrics
from map_impl.imports.metrics import CounterValue_U64, HistogramValue_F64, Label

labels = [Label(key="module", value="my-operator")]
metrics.add_to_counter("requests_total", CounterValue_U64(1), labels)
metrics.record_to_histogram("processing_duration", HistogramValue_F64(duration_ms), labels)
```

---

## ONNX inference

To embed and run small ONNX models inside your modules for in-band inference, see [Run ONNX inference in WebAssembly data flow graphs](./howto-wasm-onnx-inference.md).

## WIT schema reference

All operators implement standardized interfaces defined using [WebAssembly Interface Types (WIT)](https://github.com/WebAssembly/component-model/blob/main/design/mvp/WIT.md). You can find the complete schemas in the [samples repository](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm-python/schema).

### Operator interfaces

Every operator has an `init` function for configuration and a `process` function for data handling:

```wit
interface map {
    use types.{data-model, error, module-configuration};
    init: func(configuration: module-configuration) -> bool;
    process: func(message: data-model) -> result<data-model, error>;
}

interface filter {
    use types.{data-model, error, module-configuration};
    init: func(configuration: module-configuration) -> bool;
    process: func(message: data-model) -> result<bool, error>;
}

interface branch {
    use types.{data-model, error, module-configuration};
    use hybrid-logical-clock.{hybrid-logical-clock};
    init: func(configuration: module-configuration) -> bool;
    process: func(timestamp: hybrid-logical-clock, message: data-model) -> result<bool, error>;
}

interface accumulate {
    use types.{data-model, error, module-configuration};
    init: func(configuration: module-configuration) -> bool;
    process: func(staged: data-model, message: list<data-model>) -> result<data-model, error>;
}
```

### Data model

From [processor.wit](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/wasm-python/schema/processor.wit) (`wasm-graph:processor@1.1.0`):

```wit
record timestamp {
    timestamp: timespec,        // Physical time (seconds + nanoseconds)
    counter: u64,               // Logical counter for ordering
    node-id: buffer-or-string,  // Originating node
}

record message {
    timestamp: timestamp,
    topic: buffer-or-bytes,
    content-type: option<buffer-or-string>,
    payload: buffer-or-bytes,
    properties: message-properties,
    schema: option<message-schema>,
}

variant data-model {
    buffer-or-bytes(buffer-or-bytes),  // Raw byte data
    message(message),                  // MQTT messages (most common)
    snapshot(snapshot),                // Video/image frames
}
```

> [!NOTE]
> Most operators work with the `message` variant. Check for this type at the start of your `process` function. The payload uses either a host buffer handle (`buffer`) for zero-copy reads or module-owned bytes (`bytes`). Call `buffer.read()` to copy host bytes into your module's memory.

## Test your modules

### Unit testing

Extract your core logic into plain functions that you can test without WASM:

# [Rust](#tab/rust)

```rust
// In src/lib.rs - extract the conversion logic
pub fn fahrenheit_to_celsius(f: f64) -> f64 {
    (f - 32.0) * 5.0 / 9.0
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_boiling_point() {
        assert!((fahrenheit_to_celsius(212.0) - 100.0).abs() < 0.001);
    }

    #[test]
    fn test_freezing_point() {
        assert!((fahrenheit_to_celsius(32.0) - 0.0).abs() < 0.001);
    }

    #[test]
    fn test_body_temperature() {
        assert!((fahrenheit_to_celsius(98.6) - 37.0).abs() < 0.001);
    }
}
```

```bash
cargo test  # Runs tests without WASM target
```

# [Python](#tab/python)

```python
# test_converter.py
def fahrenheit_to_celsius(f):
    return (f - 32) * 5.0 / 9.0

def test_boiling_point():
    assert abs(fahrenheit_to_celsius(212) - 100.0) < 0.001

def test_freezing_point():
    assert abs(fahrenheit_to_celsius(32) - 0.0) < 0.001

def test_body_temperature():
    assert abs(fahrenheit_to_celsius(98.6) - 37.0) < 0.001
```

```bash
pytest test_converter.py
```

---

### Inspect WASM output

Verify your module exports the expected interfaces before pushing to a registry:

```bash
wasm-tools component wit your-module.wasm
```

This shows the WIT interfaces your module implements. Verify you see the expected `map`, `filter`, or `branch` export.

### End-to-end testing on a cluster

For integration testing, deploy your module to a development cluster and use MQTT to send test data:

1. Push the module to a test registry.
2. Deploy a DataflowGraph pointing at the test registry.
3. Subscribe to the output topic: `mosquitto_sub -h localhost -t "output/topic" -v`
4. Publish test messages: `mosquitto_pub -h localhost -t "input/topic" -m '{"temperature": {"value": 72}}'`
5. Verify the output matches expectations.
6. Check pod logs for errors: `kubectl logs -l app=aio-dataflow -n azure-iot-operations --tail=50`

## Troubleshoot

### Build errors

| Error | Cause | Fix |
|---|---|---|
| `error[E0463]: can't find crate for std` | Missing WASM target | Run `rustup target add wasm32-wasip2` |
| `error: no matching package found` for `wasm_graph_sdk` | Missing cargo registry | Add the `[registries]` block to `.cargo/config.toml` as shown in [Quickstart step 1](#step-1-write-the-module) |
| `componentize-py` can't find WIT files | Schema path wrong | Use `-d` flag with the full path to the schema directory. All `.wit` files must be present because they reference each other. |
| `componentize-py` version mismatch | Bindings generated with different version | Delete the generated bindings directory and regenerate with the same `componentize-py` version |
| `wasm-tools` component check fails | Wrong target or missing component adapter | Ensure you're using `wasm32-wasip2` (not `wasm32-wasi` or `wasm32-unknown-unknown`) |

### Runtime errors

| Symptom | Cause | Fix |
|---|---|---|
| Operator crashes with WASM backtrace | Missing or invalid configuration parameters | Add defensive parsing in `init` with defaults. See [Module configuration parameters](#module-configuration-parameters). |
| `init` returns `false`, dataflow won't start | Configuration validation failed | Check dataflow logs for error messages. Verify `moduleConfigurations` names match your code. |
| Module loads but produces no output | `process` returning errors or filter dropping everything | Add logging in `process` to trace data flow. |
| `Unexpected input type` | Module received wrong `data-model` variant | Add a type check at the start of `process` and handle unexpected variants. |
| Module works alone but crashes in complex graph | Missing config when reused across nodes | Each graph node needs its own `moduleConfigurations` entry. |

### Common pitfalls

- **Forgetting `--artifact-type` on ORAS push.** Without it, the operations experience UI won't display your module correctly.
- **Mismatched `name` in `moduleConfigurations`.** The name must be `<module>/<operator>` (for example, `module-temperature/filter`), matching the graph definition's `operations` section.
- **Using `wasm32-wasi` instead of `wasm32-wasip2`.** Azure IoT Operations requires the WASI Preview 2 target.
- **Python: working outside the samples repo without copying the schema directory.** All `.wit` files must be co-located because they reference each other.

## Next steps

- [Configure WebAssembly graph definitions](./howto-configure-wasm-graph-definitions.md) for graph structure and configuration
- [Deploy WASM modules and graph definitions](howto-deploy-wasm-graph-definitions.md) for registry and deployment details
- [Use WebAssembly with data flow graphs](../connect-to-cloud/howto-dataflow-graph-wasm.md) for DataflowGraph resource configuration
- [Build WASM modules with VS Code extension](howto-build-wasm-modules-vscode.md) for IDE-based development
- [Run ONNX inference in WASM](./howto-wasm-onnx-inference.md) for ML model integration
- [Azure IoT Operations WASM samples](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm) on GitHub
- [Data flow graph samples with schema validation and WIT composition](https://github.com/Azure-Samples/azure-edge-extensions-aio-dataflow-graphs) on GitHub
