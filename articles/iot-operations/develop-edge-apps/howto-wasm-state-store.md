---
title: Create stateful WASM graphs with the state store
description: Learn how to create stateful data flow graphs that persist and retrieve data across message processing by using the state store with WASM operators in Azure IoT Operations.
author: dominicbetts
ms.author: dobett
ms.topic: how-to
ms.date: 03/30/2026
ms.service: azure-iot-operations
ai-usage: ai-assisted

# CustomerIntent: As a developer, I want to use the state store with WASM operators so that I can maintain state across message processing in my data flow graphs.
---

# Create stateful WASM graphs with the state store

The state store lets operators persist and retrieve data across message processing and enables stateful operations in your data flow graphs. This article shows how to use the state store with WASM operators in the Azure IoT Operations local development environment.

Before you complete the steps in this article, set up your local development environment and build and run a graph application locally. For more information, see [Build WASM modules for data flows](howto-build-wasm-modules.md).

## Prerequisites

Complete the prerequisites listed in [Build WASM modules for data flows](howto-build-wasm-modules.md#prerequisites).

## Open the state store sample workspace

Clone the [Explore IoT Operations](https://github.com/Azure-Samples/explore-iot-operations) repository if you haven't already.

Open the `explore-iot-operations/samples/wasm/statestore-scenario` folder. This folder contains the following resources:

- `graph.dataflow.yaml` - The data flow graph configuration with a state store enabled operator.
- `statestore.json` - State store configuration with key-value pairs.
- `data/` - Sample input data for testing.
- `operators/` - Source code for the otel-enrich and filter operators.

## Configure the state store

1. Open the `statestore.json` file to view the current state store configuration.

1. You can modify the values of `factoryId` or `machineId` for testing. The enrichment parameter references these keys.

1. Open `graph.dataflow.yaml` and review the enrichment configuration. The significant sections of this file are shown in the following snippet:

    ```yaml
    moduleConfigurations:
      - name: module-otel-enrich/map
        parameters:
          enrichKeys:
            name: enrichKeys
            description: Comma separated list of DSS keys which will be fetched and added as attributes
            default: factoryId,machineId
    operations:
      - operationType: "source"
        name: "source"
      - operationType: "map"
        name: "module-otel-enrich/map"
        module: "otel-enrich"
      - operationType: "sink"
        name: "sink"
    ```

    The `enrichKeys` parameter's default value (`factoryId,machineId`) determines which keys are fetched from the state store and added as attributes.

1. Ensure each key listed in `enrichKeys` exists in `statestore.json`. If you add or remove keys in `statestore.json`, update the `default` value or override it by using the `TK_CONFIGURATION_PARAMETERS` environment variable.

## Update test data (optional)

You can modify the test data in the `data/` folder to experiment with different input values. The sample data includes temperature readings.

## Build and run the state store scenario

# [VS Code extension](#tab/vscode)

If you previously stopped the local execution environment, press `Ctrl+Shift+P` to open the command palette and search for **Azure IoT Operations: Start Development Environment**. Select **release** as the run mode.

1. Press `Ctrl+Shift+P` to open the command palette and search for **Azure IoT Operations: Build All Data Flow Operators**. Select **release** as the build mode. Wait for the build to complete.

1. Press `Ctrl+Shift+P` again and search for **Azure IoT Operations: Run Application Graph**. Select **release** as the run mode.

1. Select the `data` folder in your VS Code workspace for your input data. The DevX container launches to run the graph with the sample input.

## Verify state store functionality

After the graph execution completes:

1. View the results in the `data/output/` folder.

1. Open the generated `.txt` file to see the processed data. The `user properties` section of the output messages includes the `factoryId` and `machineId` values retrieved from the state store.

1. Check the logs in `data/output/logs/host-app.log` to verify that the `otel-enrich` operator retrieved values from the state store and added them as user properties to the messages.

# [dataflow-dev CLI](#tab/cli)

Review the test run configuration file: `explore-iot-operations/samples/wasm/test-runner/tests/t11-statestore-enrichment/t11-statestore-enrichment.test.yaml`.

If you previously stopped the local execution environment, run the following command to start it again:

```bash
dataflow-dev run start
```

Then, build and run the state store test with the following commands:

```bash
dataflow-dev build --app ./statestore-scenario
dataflow-dev test --app . test-runner/tests/t11-statestore-enrichment/t11-statestore-enrichment.test.yaml
```

Check the command output shows that the tests passed.

If you've finished using the local execution environment, stop it with the following command:

```bash
dataflow-dev run stop
```

Verify the test outputs and logs to confirm that state store enrichment is working as expected, with messages being enriched with values from the state store based on the specified keys.

---

## Related content

- [Build WASM modules for data flows](howto-build-wasm-modules.md)
- [Use schema registry with WASM modules](howto-wasm-schema-registry.md)
- [Debug WASM modules](howto-debug-wasm-modules.md)
- [Test WASM modules](howto-test-wasm-modules.md)
- [Understand WebAssembly (WASM) modules and graph definitions for data flow graphs](concepts-wasm-modules.md)
