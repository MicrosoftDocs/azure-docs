---
title: Test WASM modules
description: Learn how to test WebAssembly (WASM) modules with unit tests, output inspection, and end-to-end testing in Azure IoT Operations data flow graphs.
author: dominicbetts
ms.author: dobett
ms.topic: how-to
ms.date: 03/30/2026
ms.service: azure-iot-operations
ai-usage: ai-assisted

# CustomerIntent: As a developer, I want to test my WASM modules so that I can validate my processing logic before deploying to production.
---

# Test WASM modules

Testing your WASM modules at multiple levels helps you catch issues early and validate your processing logic before deploying to production. This article describes how to unit test your modules, inspect WASM output, and run local and end-to-end tests for Azure IoT Operations data flow graphs.

Before you complete the steps in this article, set up your local development environment and build and run a graph application locally. For more information, see [Build WASM modules for data flows](howto-build-wasm-modules.md).

## Prerequisites

Complete the prerequisites listed in [Build WASM modules for data flows](howto-build-wasm-modules.md#prerequisites).

## Unit testing

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

## Inspect WASM output

Verify your module exports the expected interfaces before pushing to a registry:

```bash
wasm-tools component wit your-module.wasm
```

This shows the WIT interfaces your module implements. Verify you see the expected `map`, `filter`, or `branch` export.

## Local testing with the aio-dataflow CLI

The `aio-dataflow` CLI lets you test your WASM modules locally against a graph definition without deploying to a cluster. The CLI uses Docker containers to simulate the dataflow runtime.

To create a test case, create a directory with the following structure:

```
my-test/
  my-test.test.yaml     # Test descriptor
  input/                 # Input data files
    temperature.json
  expected/              # Expected output
    expected.json
```

Define the test in the `.test.yaml` file:

```yaml
name: "Temperature F to C conversion"
graph: "../graph-simple.yaml"
input: "./input"
expected: "./expected/expected.json"
timeout: 90000
select: ["payload"]
```

The `graph` field points to the graph definition, `input` contains the test data, and `expected` has the output to compare against. The `select` field specifies which fields of the output to compare.

Run the test:

```bash
aio-dataflow run start
aio-dataflow build --app .
aio-dataflow test --app . my-test
aio-dataflow run stop
```

For a complete set of test examples, see the [test-runner/tests](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm/test-runner/tests) directory in the samples repository.

## End-to-end testing on a cluster

For integration testing, deploy your module to a development cluster and use MQTT to send test data:

1. Push the module to a test registry.
2. Deploy a DataflowGraph pointing at the test registry.
3. Subscribe to the output topic: `mosquitto_sub -h localhost -t "output/topic" -v`
4. Publish test messages: `mosquitto_pub -h localhost -t "input/topic" -m '{"temperature": {"value": 72}}'`
5. Verify the output matches expectations.
6. Check pod logs for errors: `kubectl logs -l app=aio-dataflow -n azure-iot-operations --tail=50`

For more information, see [Deploy modules and graph definitions](howto-deploy-wasm-graph-definitions.md) and [Configure registry endpoints](howto-configure-registry-endpoint.md).

## Related content

- [Build WASM modules for data flows](howto-build-wasm-modules.md)
- [Debug WASM modules](howto-debug-wasm-modules.md)
- [Create stateful WASM graphs with the state store](howto-wasm-state-store.md)
- [Use schema registry with WASM modules](howto-wasm-schema-registry.md)
- [Understand WebAssembly (WASM) modules and graph definitions for data flow graphs](concepts-wasm-modules.md)
