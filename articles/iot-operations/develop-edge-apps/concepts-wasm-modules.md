---
title: Understand WebAssembly modules and graph definitions for data flow graphs
description: Understand WebAssembly module architecture, operator types, host APIs, and WIT schemas for Azure IoT Operations data flow graphs.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: concept-article
ms.date: 04/01/2026
ai-usage: ai-assisted
---

# Understand WebAssembly (WASM) modules and graph definitions for data flow graphs

Data flow graphs in Azure IoT Operations process telemetry data at the edge by routing it through a series of operators such as maps, filters, and branches. You package your custom processing logic as WebAssembly (WASM) modules and wire them together in a graph definition, so you can transform, filter, and enrich data without writing full services.

This article explains the operator types, the timely dataflow model, module configuration, host APIs, and the WIT schema that underpins WASM modules. To build, test, and debug modules locally with the VS Code extension or the `dataflow-dev` CLI, see [Build WASM modules for data flows](howto-build-wasm-modules.md).

## Operators and modules

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

## Timely dataflow model

Data flow graphs build on the [Timely dataflow](https://docs.rs/timely/latest/timely/dataflow/operators/index.html) computational model from Microsoft Research's Naiad project. Every data item carries a hybrid logical clock timestamp:

```wit
record hybrid-logical-clock {
    timestamp: timespec,  // Wall-clock time (secs + nanos)
    counter: u64,         // Logical ordering for same-time events
    node-id: string,      // Originating node
}
```

This gives you deterministic processing (same input always produces same output), exactly-once semantics, and distributed coordination across nodes. For the complete WIT schema, see the [samples repository](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/wasm-python/schema/hybrid_logical_clock.wit).

To learn how to develop WASM modules with the VS Code extension, see [Build WASM modules with VS Code extension](howto-build-wasm-modules.md).

## Write operators

### Map operator

A map operator transforms each data item and returns a modified copy. The [quickstart example](howto-build-wasm-modules.md#run-a-graph-application-locally) shows a basic map. Here's a more complex example that uses configuration parameters:

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

## Module size and performance

WASM modules run in a sandboxed environment with limited resources. Keep these guidelines in mind:

- **Minimize dependencies.** For Rust, use `default-features = false` on `serde` and `serde_json` to reduce binary size. Avoid pulling in large crates.
- **Module size matters.** Smaller modules load faster and use less memory. A typical temperature converter is ~2 MB (Rust release) or ~5 MB (Python). Use release builds for production.
- **Avoid blocking operations.** The `process` function should complete quickly. Heavy computation delays the entire dataflow pipeline.
- **Use `wasm-tools` to inspect.** Run `wasm-tools component wit your-module.wasm` to verify your module exports the expected interfaces before pushing to a registry.

## Versioning and CI/CD

Use semantic versioning for your modules and graph definitions. The dataflow graph references artifacts by name and tag (for example, `temperature:1.0.0`), so you can update modules without changing graph definitions by pushing a new version with the same tag.

For automated builds, a typical pipeline looks like:

1. Build the WASM module (use the Docker builder for consistency).
2. Run `wasm-tools component wit` to verify exported interfaces.
3. Run unit tests against your core logic. To learn more, see [Test WASM modules](howto-test-wasm-modules.md).
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

## Related content

- [Build WASM modules for data flows](howto-build-wasm-modules.md)
- [Create stateful WASM graphs with the state store](howto-wasm-state-store.md)
- [Use schema registry with WASM modules](howto-wasm-schema-registry.md)
- [Debug WASM modules](howto-debug-wasm-modules.md)
- [Test WASM modules](howto-test-wasm-modules.md)
- [Configure graph definitions](howto-configure-wasm-graph-definitions.md)
- [Deploy graph definitions](howto-deploy-wasm-graph-definitions.md)
- [ONNX inference in WASM modules](howto-wasm-onnx-inference.md)
- [Use WASM in dataflow graphs](../connect-to-cloud/howto-dataflow-graph-wasm.md)
