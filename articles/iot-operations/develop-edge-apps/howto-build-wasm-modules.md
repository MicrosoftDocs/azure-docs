---
title: Build WASM modules for data flows
description: Learn how to build WebAssembly (WASM) modules for data flows using the Azure IoT Operations Data Flow extension for VS Code or the dataflow-dev CLI.
author: dominicbetts 
ms.author: dobett 
ms.topic: how-to
ms.date: 04/10/2026
ms.service: azure-iot-operations
ai-usage: ai-assisted

# CustomerIntent: As a developer, I want to understand how to use the VS Code extension or the dataflow-dev CLI to build and test WASM modules to use in data flow graphs or the HTTP/REST connector.
---

# Build WASM modules for data flows

The custom WebAssembly (WASM) data processing feature in Azure IoT Operations enables real time telemetry data processing within your Azure IoT Operations cluster. By deploying custom WASM modules, you can define and execute data transformations as part of your data flow graph, the HTTP/REST connector, or the MQTT connector.

This article describes how to use the **Azure IoT Operations Data Flow** VS Code extension, the `dataflow-dev` CLI, or standard tools installed in your environment to develop and test your WASM modules locally before you deploy them to your Azure IoT Operations cluster. You'll learn how to:

- Run a graph application locally by executing a prebuilt graph with sample data to understand the basic workflow.
- Create custom WASM modules by building new operators in Python and Rust with map and filter functionality.

Use the VS Code extension for an inner development loop when you're actively creating operators and graphs, for example: write code, build, review errors, debug, make changes, update the graph, and publish.

Use the `dataflow-dev` CLI for CI/CD-focused graph quality workflows, for example: build existing code, run the graph, test output against known good results, and monitor quality over time.

Use standard tools installed in your environment for scenarios where you want more control over the build and test process, or when you need to integrate with other development tools and workflows.

This article describes how to build and test your WASM modules locally. To use them in Azure IoT Operations data flows and connectors, you must deploy them to your Azure IoT Operations cluster and reference them in your graph or connector configuration:

- [Configure WebAssembly (WASM) graph definitions for data flow graphs and connectors](howto-configure-wasm-graph-definitions.md)
- [Deploy WebAssembly (WASM) modules and graph definitions](howto-deploy-wasm-graph-definitions.md)

For more advanced scenarios, see [Create stateful WASM graphs with the state store](howto-wasm-state-store.md), [Use schema registry with WASM modules](howto-wasm-schema-registry.md), [Debug WASM modules](howto-debug-wasm-modules.md), and [Test WASM modules](howto-test-wasm-modules.md).

The extension and CLI tool are supported on the following platforms:

- Linux
- Windows Subsystem for Linux (WSL)
- Windows (be sure to use a Windows shell such as PowerShell or Command Prompt when you run the extension commands on Windows)

To learn more about graphs and WASM in Azure IoT Operations, see:

- [Use a data flow graph with WebAssembly modules](../connect-to-cloud/howto-dataflow-graph-wasm.md)
- [Transform incoming data with WebAssembly modules](../discover-manage-assets/howto-use-http-connector.md#transform-incoming-data)

## Prerequisites

# [VS Code extension](#tab/vscode)

Development environment:

- [Visual Studio Code](https://code.visualstudio.com/)
- (Optional) [RedHat YAML extension](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) for VS Code
- [Azure IoT Operations Data Flow extension](https://marketplace.visualstudio.com/items?itemName=ms-azureiotoperations.azure-iot-operations-data-flow-vscode) for VS Code.
- [CodeLLDB extension](https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb) for VS Code to enable debugging of WASM modules
- Docker

Docker images:

```bash
docker pull mcr.microsoft.com/azureiotoperations/processor-app:1.1.5
docker tag mcr.microsoft.com/azureiotoperations/processor-app:1.1.5 host-app

docker pull mcr.microsoft.com/azureiotoperations/devx-runtime:0.1.8
docker tag mcr.microsoft.com/azureiotoperations/devx-runtime:0.1.8 devx

docker pull mcr.microsoft.com/azureiotoperations/statestore-cli:0.0.2
docker tag mcr.microsoft.com/azureiotoperations/statestore-cli:0.0.2 statestore-cli

docker pull eclipse-mosquitto
```

# [dataflow-dev CLI](#tab/cli)

- `dataflow-dev` CLI. Install with `npx @azure-tools/dataflow-dev` or globally with `npm install -g @azure-tools/dataflow-dev`.
- [Azure CLI](/cli/azure/install-azure-cli)
- Docker

Docker images:

```bash
docker pull mcr.microsoft.com/azureiotoperations/processor-app:1.1.5
docker tag mcr.microsoft.com/azureiotoperations/processor-app:1.1.5 host-app

docker pull mcr.microsoft.com/azureiotoperations/devx-runtime:0.1.8
docker tag mcr.microsoft.com/azureiotoperations/devx-runtime:0.1.8 devx

docker pull mcr.microsoft.com/azureiotoperations/statestore-cli:0.0.2
docker tag mcr.microsoft.com/azureiotoperations/statestore-cli:0.0.2 statestore-cli

docker pull eclipse-mosquitto
```

# [Standard tools](#tab/tools)

If you're developing using Rust, install the Rust toolchain and add the WASI Preview 2 target:

```bash
# Install Rust toolchain
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# Add WASM target (required for Azure IoT Operations WASM components)
rustup target add wasm32-wasip2

# Install build tools for validating and packaging WASM artifacts
cargo install wasm-tools --version '=1.201.0' --locked
```

If you're developing using Python, ensure you have Python 3.8 or later installed, along with the `componentize-py` tool for packaging Python code as WASM modules:

```bash
# Install componentize-py for building Python WASM modules
pip install "componentize-py==0.14"

# Clone the samples repo (provides WIT schemas and project structure)
git clone https://github.com/Azure-Samples/explore-iot-operations.git
```

---

## Run a graph application locally

# [VS Code extension](#tab/vscode)

This example uses a sample workspace that contains all the necessary resources to build and run a graph application locally using the VS Code extension.

### Open the sample workspace in VS Code

Clone the [Explore IoT Operations](https://github.com/Azure-Samples/explore-iot-operations) repository if you haven't already.

Open the `samples/wasm` folder in Visual Studio Code by selecting **File > Open Folder** and navigating to the `samples/wasm` folder.

### Build the operators

Press `Ctrl+Shift+P` to open the command palette and search for **Azure IoT Operations: Build All Operators**. Select **release** as the build mode.

This command builds all the operators in the workspace and creates `.wasm` files in the `operators` folder. You use the `.wasm` files to run the graph application locally.

### Run the graph application locally

To start the local execution environment, press `Ctrl+Shift+P` to open the command palette and search for **Azure IoT Operations: Start Development Environment**. Select **release** as the run mode.

When the local execution environment is running, press `Ctrl+Shift+P` to open the command palette and search for **Azure IoT Operations: Run Application Graph**. Select **release** as the run mode. This command runs the graph application locally by using the local execution environment with the `graph.dataflow.yaml` file in the workspace.

It also reads from `hostapp.env.list` to set the environment variable `TK_CONFIGURATION_PARAMETERS` for data flow operator configuration parameters.

When you're prompted for input data, select the `data-and-images` folder in the workspace. This folder contains the input data files for the graph application including temperature and humidity data, and some images for the snapshot module.

Wait until you see a VS Code notification that the logs are ready: `Log files for the run can be found at ...\wasm\data-and-images\output\logs`.

The output is located in the `output` folder under the `data-and-images` folder. You can open the `output` folder in the workspace to see the output files. The `.txt` file with the date and time for filename contains the processed data, and it looks like the following example:

```output
{"tst":"2025-09-19T04:19:13.530381+0000","topic":"sensors","qos":0,"retain":0,"payloadlen":312,"properties":{"payload-format-indicator":1,"message-expiry-interval":10,"correlation-data":"...","user-properties":{"__ts":"001758255553528:00000:...","__protVer":"1.0","__srcId":"mqtt-source"},"content-type":"application/json"},"payload":{"temperature":[{"count":2,"max":653.888888888889,"min":204.44444444444449,"average":429.16666666666669,"last":204.44444444444449,"unit":"C","overtemp":true}],"humidity":[{"count":3,"max":85,"min":45,"average":69.666666666666671,"last":79}],"object":[{"result":"notebook, notebook computer; sliding door"}]}}
```

The output shows that the graph application processed the input data and generated the output. The output includes temperature and humidity data, and the objects detected in the images.

# [dataflow-dev CLI](#tab/cli)

Clone the [Explore IoT Operations](https://github.com/Azure-Samples/explore-iot-operations) repository if you haven't already:

```bash
git clone https://github.com/Azure-Samples/explore-iot-operations.git
```

### Build the operators

Navigate to your graph application directory and build all operators:

```bash
cd explore-iot-operations/samples/wasm
dataflow-dev build --app .
```

The `--app` flag specifies the directory that contains the `graph.dataflow.yaml` file and the `operators` folder. The CLI builds all operators in the workspace and creates `.wasm` files.

### Run the graph application locally

Start the local Docker execution environment, then run the graph:

```bash
dataflow-dev run start
dataflow-dev test --app . test-runner/tests/t03-complex-full-pipeline
dataflow-dev run stop
```

> [!TIP]
> If you plan to run multiple tests, you can start the environment once with `dataflow-dev run start`, then run multiple test commands, and stop the environment at the end with `dataflow-dev run stop`.

The `test` command runs the graph defined in the test case's `.test.yaml` file, feeds the input data, and compares the output against expected results. The sample repository includes multiple test scenarios such as:

| Test | Scenario | Description |
|---|---|---|
| `t01-simple-temp-conversion` | Simple | Basic Fahrenheit to Celsius map transform |
| `t02-complex-temp-pipeline` | Complex | Branch → map → filter → accumulate → enrichment |
| `t03-complex-full-pipeline` | Complex | Temperature, humidity, machine learning inference |
| `t08-schema-valid` | Schema | Valid payload passes through schema validation |
| `t11-statestore-enrichment` | State store | State store key-value lookup enrichment |

To run all tests:

```bash
dataflow-dev run start
dataflow-dev test --app . test-runner/tests
dataflow-dev run stop
```

# [Standard tools](#tab/tools)

If you're using the Rust or Python tools installed locally, there are no samples ready to run. You must create your own graph application and operators, then build and run them locally. Follow the instructions in the next section to create a new graph application with custom WASM modules.

---

## Create a new graph with custom WASM modules

This scenario shows you how to create a new graph application with custom WASM modules. The graph application consists of two operators: a `map` operator that converts temperature values from Fahrenheit to Celsius, and a `filter` operator that filters out messages with temperature values above 500°C.

Currently, don't use hyphens (`-`) or underscores (`_`) in operator names. The VS Code extension enforces this requirement, but if you create or rename modules manually it causes issues. Use simple alphanumeric names for modules like `filter`, `map`, `stateenrich`, or `schemafilter`.

# [VS Code extension](#tab/vscode)

Instead of using an existing sample workspace, you create a new workspace from scratch. This process lets you learn how to create a new graph application and program the operators in Python and Rust.

### Create a new graph application project in Python

Press `Ctrl+Shift+P` to open the VS Code command palette and search for **Azure IoT Operations: Create Application**:

1. For the folder, select a folder where you want to create the project. You can create a new folder for this project.
1. Enter `my-graph` as the name.
1. Select **Python** as the language.
1. Select **Map** as the type.
1. Enter `map` as the name.

You now have a new VS Code workspace with the basic project structure and starter files. The starter files include the `graph.dataflow.yaml` file and the map operator template source code.

> [!IMPORTANT]
> To use a Python module in a deployed Azure IoT Operations instance, you must deploy the instance with the broker memory profile set to **Medium** or **High**. If you set the memory profile to **Low** or **Tiny**, the instance can't pull the Python module.

### Add Python code for the map operator module

Open the `operators/map/map.py` file and replace the contents with the following code to convert an incoming temperature value from Fahrenheit to Celsius:

```python
import json
from map_impl import exports
from map_impl import imports
from map_impl.imports import types

class Map(exports.Map):
    def init(self, configuration) -> bool:
        imports.logger.log(imports.logger.Level.INFO, "module4/map", "Init invoked")
        return True

    def process(self, message: types.DataModel) -> types.DataModel:
        # TODO: implement custom logic for map operator
        imports.logger.log(imports.logger.Level.INFO, "module4/map", "processing from python")

        # Ensure the input is of the expected type
        if not isinstance(message, types.DataModel_Message):
            raise ValueError("Unexpected input type: Expected DataModel_Message")

        # Extract and decode the payload
        payload_variant = message.value.payload
        if isinstance(payload_variant, types.BufferOrBytes_Buffer):
            # It's a Buffer handle - read from host
            imports.logger.log(imports.logger.Level.INFO, "module4/map", "Reading payload from Buffer")
            payload = payload_variant.value.read()
        elif isinstance(payload_variant, types.BufferOrBytes_Bytes):
            # It's already bytes
            imports.logger.log(imports.logger.Level.INFO, "module4/map", "Reading payload from Bytes")
            payload = payload_variant.value
        else:
            raise ValueError("Unexpected payload type")

        decoded = payload.decode("utf-8")

        # Parse the JSON data
        json_data = json.loads(decoded)

        # Check and update the temperature value
        if "temperature" in json_data and "value" in json_data["temperature"]:
            temp_f = json_data["temperature"]["value"]
            if isinstance(temp_f, int):
                # Convert Fahrenheit to Celsius
                temp_c = round((temp_f - 32) * 5.0 / 9.0)

                # Update the JSON data
                json_data["temperature"]["value"] = temp_c
                json_data["temperature"]["unit"] = "C"

                # Serialize the updated JSON back to bytes
                updated_payload = json.dumps(json_data).encode("utf-8")

                # Update the message payload
                message.value.payload = types.BufferOrBytes_Bytes(value=updated_payload)

        return message
```

Make sure Docker is running. Then, press `Ctrl+Shift+P` to open the command palette and search for **Azure IoT Operations: Build All Operators**. Create a **release** module.

The build process places the `map.wasm` file for the `map` operator in the `operators/map/bin/release` folder.

### Add Rust code for the filter operator module

Create a new operator by pressing `Ctrl+Shift+P` to open the command palette and search for **Azure IoT Operations: Create Operator**:

1. Select **Rust** as the language.
1. Select **Filter** as the operator type.
1. Enter `filter` as the name.

Open the `operators/filter/src/lib.rs` file and replace the contents with the following code to filter out values where the temperature is above 500°C:

```rust
mod filter_operator {
    use wasm_graph_sdk::macros::filter_operator;
    use serde_json::Value;

    fn filter_init(_configuration: ModuleConfiguration) -> bool {
        // Add code here to process the module init properties and module schemas from the configuration

        true
    }

    #[filter_operator(init = "filter_init")]
    fn filter(input: DataModel) -> Result<bool, Error> {

        // Extract payload from input to process
        let payload = match input {
            DataModel::Message(Message {
                payload: BufferOrBytes::Buffer(buffer),
                ..
            }) => buffer.read(),
            DataModel::Message(Message {
                payload: BufferOrBytes::Bytes(bytes),
                ..
            }) => bytes,
            _ => return Err(Error { message: "Unexpected input type".to_string() }),
        };

        // ... perform filtering logic here and return boolean
        if let Ok(payload_str) = std::str::from_utf8(&payload) {
            if let Ok(json) = serde_json::from_str::<Value>(payload_str) {
                if let Some(temp_c) = json["temperature"]["value"].as_i64() {
                    // Return true if temperature is above 500°C
                    return Ok(temp_c > 500);
                }
            }
        }

        Ok(false)
   }
}
```

Open the `operators/filter/Cargo.toml` file and add the following dependencies:

```toml
[dependencies]
# ...
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
```

Make sure Docker is running. Then, press `Ctrl+Shift+P` to open the command palette and search for **Azure IoT Operations: Build All Operators**. Create a **release** module.

The build process places the `filter.wasm` file for the `filter` operator in the `operators/filter/bin/release` folder.

# [dataflow-dev CLI](#tab/cli)

To create and build new operators with the dataflow-dev CLI, use one of the sample projects as a template and create new operator source files in the `operators` folder. Then, use the `dataflow-dev build` command to build the operators and generate the `.wasm` files:

- For Rust projects, see the examples in the `explore-iot-operations/samples/wasm` folder. 
- For Python projects, see the examples in the `explore-iot-operations/samples/wasm-python` folder.

# [Standard tools](#tab/tools)

Create a temperature converter that transforms Fahrenheit to Celsius.

If you're using Rust:

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
> Adding `[build] target = "wasm32-wasip2"` to your `.cargo/config.toml` means you don't need to pass `--target wasm32-wasip2` on every `cargo build` command. The [Azure Samples dataflow graphs repository](https://github.com/Azure-Samples/azure-edge-extensions-dataflow-dev-graphs) uses this pattern.

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

To build the module, run:

```bash
cargo build --release --target wasm32-wasip2
cp target/wasm32-wasip2/release/temperature_converter.wasm .
```

You can use a containerized build for CI/CD or when you don't want to set up a local Rust toolchain:

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

If you're using Python:

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

To build the module, run:

```bash
# Generate Python bindings from WIT schemas
componentize-py -d ../../schema -w map-impl bindings ./

# Build the WASM module
componentize-py -d ../../schema -w map-impl componentize temperature_converter -o temperature_converter.wasm

# Verify build
file temperature_converter.wasm  # Should show: WebAssembly (wasm) binary module
```

You can use a containerized build for CI/CD or when you don't want to set up a local Python toolchain:

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

### Run the graph application locally with sample data

# [VS Code extension](#tab/vscode)

Open the `graph.dataflow.yaml` file and replace the contents with the following code:

```yaml
metadata:
    $schema: "https://www.schemastore.org/aio-wasm-graph-config-1.0.0.json"
    name: "Temperature Monitoring"
    description: "A graph that converts temperature from Fahrenheit to Celsius, if temperature is above 500°C, then sends the processed data to the sink."
    version: "1.0.0"
    vendor: "Microsoft"
moduleRequirements:
    apiVersion: "1.1.0"
    runtimeVersion: "1.1.0"
operations:
  - operationType: source
    name: source
  - operationType: map
    name: map
    module: map
  - operationType: filter
    name: filter
    module: filter
  - operationType: sink
    name: sink
connections:
  - from:
      name: source
    to:
      name: map
  - from:
      name: map
    to:
      name: filter
  - from:
      name: filter
    to:
      name: sink
```

Copy the `data` folder that contains the sample data from the cloned samples repository `explore-iot-operations\samples\wasm\data` to the current workspace. The `data` folder contains three JSON files with sample input temperature data.

If you previously stopped the local execution environment, press `Ctrl+Shift+P` to open the command palette and search for **Azure IoT Operations: Start Development Environment**. Select **release** as the run mode.

Press `Ctrl+Shift+P` to open the command palette and search for **Azure IoT Operations: Run Application Graph**:

1. Select the `graph.dataflow.yaml` graph file.
1. Select **release** as the run mode.
1. Select the `data` folder you copied to the workspace.

The DevX container launches to run the graph. The processed result is saved in the `data/output` folder. The text file in the `output` folder contains the processed data with the temperature converted to Celsius and filtered based on the threshold.

To learn how to deploy your custom WASM modules and graph to your Azure IoT Operations instance, see [Deploy WASM modules and data flow graphs](../connect-to-cloud/howto-dataflow-graph-wasm.md).

# [dataflow-dev CLI](#tab/cli)

To run your graph application locally with the dataflow-dev CLI, use the `dataflow-dev test` command with a test case that points to your graph configuration and input data. You can create a new test case YAML file in the `test-runner/tests` folder that references your `graph.dataflow.yaml` and input data files. Then, run the test with the following command:

```bash
dataflow-dev run start
dataflow-dev test --app . test-runner/tests/my-test-case
dataflow-dev run stop
```

Look at the example test case files in the `test-runner/tests` folder for reference on how to structure your test case YAML file. You can test both Python and Rust modules with the CLI tool by pointing to the appropriate graph configuration and input data in your test case file.

# [Standard tools](#tab/tools)

If you're using standard tools installed locally, there's no included tool for running the graph application with your custom WASM modules in your local environment.

---

When you have your WASM modules built and your graph application configured, you can deploy them to your Azure IoT Operations cluster and reference them in your graph or connector configuration:

- [Configure WebAssembly (WASM) graph definitions for data flow graphs and connectors](howto-configure-wasm-graph-definitions.md)
- [Deploy WebAssembly (WASM) modules and graph definitions](howto-deploy-wasm-graph-definitions.md)

## Troubleshoot

### Build errors

| Error | Cause | Fix |
|---|---|---|
| `error[E0463]: can't find crate for std` | Missing WASM target | Run `rustup target add wasm32-wasip2` |
| `error: no matching package found` for `wasm_graph_sdk` | Missing cargo registry | Add the `[registries]` block to `.cargo/config.toml` as shown in [Run a graph application locally](#run-a-graph-application-locally) |
| `componentize-py` can't find WIT files | Schema path wrong | Use `-d` flag with the full path to the schema directory. All `.wit` files must be present because they reference each other. |
| `componentize-py` version mismatch | Bindings generated with different version | Delete the generated bindings directory and regenerate with the same `componentize-py` version |
| `wasm-tools` component check fails | Wrong target or missing component adapter | Ensure you're using `wasm32-wasip2` (not `wasm32-wasi` or `wasm32-unknown-unknown`) |

### Runtime errors

| Symptom | Cause | Fix |
|---|---|---|
| Operator crashes with WASM backtrace | Missing or invalid configuration parameters | Add defensive parsing in `init` with defaults. See [Module configuration parameters](concepts-wasm-modules.md#module-configuration-parameters). |
| `init` returns `false`, dataflow won't start | Configuration validation failed | Check dataflow logs for error messages. Verify `moduleConfigurations` names match your code. |
| Module loads but produces no output | `process` returning errors or filter dropping everything | Add logging in `process` to trace data flow. |
| `Unexpected input type` | Module received wrong `data-model` variant | Add a type check at the start of `process` and handle unexpected variants. |
| Module works alone but crashes in complex graph | Missing config when reused across nodes | Each graph node needs its own `moduleConfigurations` entry. |

### Common pitfalls

- **Forgetting `--artifact-type` on ORAS push.** Without it, the operations experience UI won't display your module correctly.
- **Mismatched `name` in `moduleConfigurations`.** The name must be `<module>/<operator>` (for example, `module-temperature/filter`), matching the graph definition's `operations` section.
- **Using `wasm32-wasi` instead of `wasm32-wasip2`.** Azure IoT Operations requires the WASI Preview 2 target.
- **Python: working outside the samples repo without copying the schema directory.** All `.wit` files must be co-located because they reference each other.

### Known issues

- **Boolean values in YAML**: Boolean values must be quoted as strings to avoid validation errors. For example, use `"True"` and `"False"` instead of `true` and `false`.

  Example error when using unquoted booleans:

  ```output
  * spec.connections[2].from.arm: Invalid value: "boolean": spec.connections[2].from.arm in body must be of type string: "boolean"
  * spec.connections[2].from.arm: Unsupported value: false: supported values: "False", "True"
  ```

- **Python module requirements**: To use Python modules, Azure IoT Operations must be deployed with the MQTT broker configured to use the **Medium** or **High** memory profile. Python modules can't be pulled when the memory profile is set to **Low** or **Tiny**.

- **Module deployment timing**: Pulling and applying WASM modules might take some time, typically around a minute, depending on network conditions and module size.

- **Build error details**: When a build fails, the error message in the pop-up notification might not provide sufficient detail. Check the terminal output for more specific error information.

- **Windows compatibility**: On Windows, the first time you run a graph application, you might encounter an error "command failed with exit code 1." If this error occurs, retry the operation and it should work correctly.

- **Host app stability**: The local execution environment might occasionally stop working and require restarting to recover.

- **Remote debugging limitations**: Currently, you can't remotely debug WASM modules running in Azure Linux 3.0 due to incompatible LLDB versions.

### Recovery procedures

**VS Code extension reset**: If the VS Code extension behaves unexpectedly, try uninstalling and reinstalling it, then restart VS Code.

## Related content

- [Create stateful WASM graphs with the state store](howto-wasm-state-store.md)
- [Use schema registry with WASM modules](howto-wasm-schema-registry.md)
- [Debug WASM modules](howto-debug-wasm-modules.md)
- [Test WASM modules](howto-test-wasm-modules.md)
- [Understand WebAssembly (WASM) modules and graph definitions for data flow graphs](concepts-wasm-modules.md)
- [Configure graph definitions](howto-configure-wasm-graph-definitions.md)
- [Deploy graph definitions](howto-deploy-wasm-graph-definitions.md)
- [ONNX inference in WASM modules](howto-wasm-onnx-inference.md)
- [Use WASM in dataflow graphs](../connect-to-cloud/howto-dataflow-graph-wasm.md)
