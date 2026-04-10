---
title: Use schema registry with WASM modules
description: Learn how to use schema registry validation with WASM modules to validate message formats and ensure data consistency in Azure IoT Operations data flow graphs.
author: dominicbetts
ms.author: dobett
ms.topic: how-to
ms.date: 03/30/2026
ms.service: azure-iot-operations
ai-usage: ai-assisted

# CustomerIntent: As a developer, I want to use the schema registry with WASM modules so that I can validate message formats and ensure data consistency in my data flow processing.
---

# Use schema registry with WASM modules

The schema registry lets you validate message formats and ensure data consistency in your data flow processing. This article shows how to use the schema registry with WASM modules in the Azure IoT Operations local development environment.

Before you complete the steps in this article, set up your local development environment and build and run a graph application locally. For more information, see [Build WASM modules for data flows](howto-build-wasm-modules.md).

## Prerequisites

Complete the prerequisites listed in [Build WASM modules for data flows](howto-build-wasm-modules.md#prerequisites).

## Open the schema registry sample workspace

Clone the [Explore IoT Operations](https://github.com/Azure-Samples/explore-iot-operations) repository if you haven't already.

Open the `samples/wasm/schema-registry-scenario` folder. This folder contains the following resources:

- `graph.dataflow.yaml` - The data flow graph configuration.
- `tk_schema_config.json` - The JSON schema that the host app uses locally to validate incoming message payloads before they reach downstream operators. Keep this file in sync with any schema you publish to your Microsoft Azure environment.
- `data/` - Sample input data with different message formats for testing.
- `operators/filter/` - Source code for the filter operator.
- (Optional) `hostapp.env.list` - The VS Code extension autogenerates one at run time adding `TK_SCHEMA_CONFIG_PATH=tk_schema_config.json`. If you supply your own schema file, make sure that the variable points to it.

## Understand the schema configuration

Open the `tk_schema_config.json` file to view the schema definition:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "humidity": {
      "type": "integer"
    },
    "temperature": {
      "type": "number"
    }
  }
}
```

This schema defines a top-level JSON object that can contain two numeric properties: `humidity` (integer) and `temperature` (number). Add a `"required": ["humidity", "temperature"]` array if you need to make them both required, or extend the `properties` section as your payload format evolves.

The following limitations apply to the local schema file (`tk_schema_config.json`). The schema file:
- Uses standard JSON Schema draft-07 syntax, the same draft supported by the Azure IoT Operations schema registry.
- Is functionally the same content you register in the cloud schema registry. You can copy and paste between the two to stay consistent.
- Is referenced by the host app through the environment variable `TK_SCHEMA_CONFIG_PATH`.

Currently, the following limitations apply in the local development runtime:
- Only one schema config file is loaded. No multi-file include or directory scanning is supported.
- `$ref` to external files or URLs isn't supported locally. Keep the schema self‑contained. You can use internal JSON pointer references like `{"$ref":"#/components/..."}`.
- Commonly used draft-07 keywords like `type`, `properties`, `required`, `enum`, `minimum`, `maximum`, `allOf`, `anyOf`, `oneOf`, `not`, and `items` all work. The underlying validator might ignore less common or advanced features like `contentEncoding` and `contentMediaType`.
- Keep the size of your schemas to less than ~1 MB for fast cold starts.
- Versioning and schema evolution policies aren't enforced locally. You're responsible for staying aligned with the cloud registry.

If you rely on advanced constructs that fail validation locally, validate the same schema against the cloud registry after publishing to ensure parity.

To learn more, see [Azure IoT Operations schema registry concepts](../connect-to-cloud/concept-schema-registry.md).

## Review the test data

The `data/` folder contains three test files:

- `temperature_humidity_payload_1.json` - Contains both temperature and humidity data. However, the humidity value (175.1) isn't an integer as specified in the schema, so the data fails schema validation and is filtered out.
- `temperature_humidity_payload_2.json` - Contains only humidity data and is filtered out.
- `temperature_humidity_payload_3.json` - Contains both temperature and humidity data and passes validation.

## Build and run the schema registry scenario

# [VS Code extension](#tab/vscode)

If you previously stopped the local execution environment, press `Ctrl+Shift+P` to open the command palette and search for **Azure IoT Operations: Start Development Environment**. Select **release** as the run mode.

1. Press `Ctrl+Shift+P` to open the command palette and search for **Azure IoT Operations: Build All Data Flow Operators**.

1. Select **release** as the build mode. Wait for the build to complete.

1. Press `Ctrl+Shift+P` again and search for **Azure IoT Operations: Run Application Graph**.

1. Select the `graph.dataflow.yaml` graph file.

1. Select **release** as the run mode.

1. Select the `data` folder in your VS Code workspace for your input data. The DevX container launches to run the graph with the sample input.

## Verify schema validation

After processing completes:

1. Check the `data/output/` folder for the results.

1. The output contains only the processed version of the `temperature_humidity_payload_3.json` message because it conforms to the schema.

1. The `data/output/logs/host-app.log` file contains log entries indicating which messages are accepted or rejected based on schema validation.

This example shows how the schema registry validates incoming messages and filters out messages that don't conform to the defined schema.

Stop the local execution environment when you're done testing in release mode by pressing `Ctrl+Shift+P` and searching for **Azure IoT Operations: Stop Development Environment**.

# [aio-dataflow CLI](#tab/cli)

Review the test run configuration files:

- `explore-iot-operations/samples/wasm/test-runner/tests/t08-schema-valid/t08-schema-valid.test.yaml`.
- `explore-iot-operations/samples/wasm/test-runner/tests/t09-schema-invalid/t09-schema-invalid.test.yaml`.
- `explore-iot-operations/samples/wasm/test-runner/tests/t10-schema-mixed/t10-schema-mixed.test.yaml`.

If you previously stopped the local execution environment, run the following command to start it again:

```bash
aio-dataflow run start
```

Then, build and run the state store test with the following commands:

```bash
aio-dataflow build --app ./schema-registry-scenario
aio-dataflow test --app . test-runner/tests/t08-schema-valid/t08-schema-valid.test.yaml
aio-dataflow test --app . test-runner/tests/t09-schema-invalid/t09-schema-invalid.test.yaml
aio-dataflow test --app . test-runner/tests/t10-schema-mixed/t10-schema-mixed.test.yaml
```

If you've finished using the local execution environment, stop it with the following command:

```bash
aio-dataflow run stop
```

Verify the test outputs and logs to confirm that schema validation is working as expected, with valid messages being processed and invalid messages being filtered out.

---

## Related content

- [Build WASM modules for data flows](howto-build-wasm-modules.md)
- [Create stateful WASM graphs with the state store](howto-wasm-state-store.md)
- [Debug WASM modules](howto-debug-wasm-modules.md)
- [Test WASM modules](howto-test-wasm-modules.md)
- [Understand WebAssembly (WASM) modules and graph definitions for data flow graphs](concepts-wasm-modules.md)
- [Azure IoT Operations schema registry concepts](../connect-to-cloud/concept-schema-registry.md)
