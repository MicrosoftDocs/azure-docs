---
title: Run ONNX inference in WebAssembly data flow graphs (Preview)
description: Learn how to package and run ONNX models inside WebAssembly modules for real-time inference in Azure IoT Operations data flow graphs.
author: SoniaLopezBravo
ms.author: sonialopez
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 09/03/2025
ai-usage: ai-assisted

---

# Run ONNX inference in WebAssembly (WASM) data flow graphs (preview)

> [!IMPORTANT]
> ONNX inference in WASM data flow graphs is in preview and isn't intended for production workloads.
>
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or not yet released into general availability.

This article shows how to embed and run small ONNX models inside your WebAssembly modules to perform in-band inference as part of Azure IoT Operations data flow graphs. Use this approach for low‑latency enrichment and classification directly on streaming data—without calling external prediction services.

> [!IMPORTANT]
> Data flow graphs currently only support MQTT, Kafka, and OpenTelemetry endpoints. Other endpoint types like Data Lake, Microsoft Fabric OneLake, Azure Data Explorer, and Local Storage are not supported. For more information, see [Known issues](../troubleshoot/known-issues.md#data-flow-graphs-only-support-specific-endpoint-types).

## When to use in-band ONNX inference

Use in-band inference when:

- You need low latency: enrich or classify messages inline at ingestion time.
- Models are small and efficient: MobileNet‑class vision or similar compact models.
- The inference needs to align with event-time processing and the same timestamps as other operators.
- You prefer simple updates: ship a new module version with an updated model.

Avoid in-band inference when:

- You require large transformer models, GPU/TPU acceleration, or sophisticated A/B rollouts.
- Models require multiple tensor inputs, key-value caching, or unsupported ONNX operators.

## What's supported

- Model format: ONNX via the [wasi-nn](https://github.com/WebAssembly/wasi-nn) interface in the WASM runtime.
- Execution target: CPU (default). GPU/TPU acceleration isn't supported in this preview.
- Packaging: embed model bytes in the WASM component (recommended for simplicity). You can also embed a small label map or provide it as a configuration parameter.
- Scaling: inference scales with your data flow graph—additional workers load-balance processing automatically.

> [!NOTE]
> Keep modules and embedded models small. Large models and memory-heavy workloads aren't supported. Favor compact architectures and modest input sizes (for example, 224×224 for image classification).

## Architecture pattern

The common pattern for ONNX inference in data flow graphs:

1. Preprocess data (for example, image decode/resize) to match model requirements.
2. Convert inputs to tensors and run inference using wasi-nn with the ONNX backend.
3. Postprocess outputs (for example, softmax, top‑K, thresholding) and emit results.

Public samples demonstrate this pattern:

- `format` module: decodes and resizes images to RGB24 224×224.
- `snapshot` module: embeds a MobileNet v2 ONNX model, runs CPU inference, and computes softmax.

Sample code:

- [Format operator (Rust)](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm/rust/examples/format)
- [Snapshot operator with ONNX (Rust)](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm/rust/examples/snapshot)

## Graph definition requirements

Add the wasi-nn feature to your graph definition and reference your operators:

```yaml
moduleRequirements:
  apiVersion: "0.2.0"
  hostlibVersion: "0.2.0"
  features:
    - name: "wasi-nn"

operations:
  - operationType: "source"
    name: "camera-input"
  - operationType: "map"
    name: "module-format/map"
    module: "format:1.0.0"
  - operationType: "map"
    name: "module-snapshot/map"
    module: "snapshot:1.0.0"
  - operationType: "sink"
    name: "results-output"

connections:
  - from: { name: "camera-input" }
    to: { name: "module-format/map" }
  - from: { name: "module-format/map" }
    to: { name: "module-snapshot/map" }
  - from: { name: "module-snapshot/map" }
    to: { name: "results-output" }
```

### Optional module configuration parameters

Pass runtime parameters to fine‑tune preprocessing and postprocessing:

```yaml
moduleConfigurations:
  - name: module-format/map
    parameters:
      width:
        name: width
        description: "Resize width"
        required: false
      height:
        name: height
        description: "Resize height"
        required: false
      pixelFormat:
        name: pixel_format
        description: "Target pixel format (e.g., rgb24)"
        required: false

  - name: module-snapshot/map
    parameters:
      executionTarget:
        name: execution_target
        description: "Inference target (cpu)"
        required: false
      labelMap:
        name: label_map
        description: "Label map name or embedded selector"
        required: false
      scoreThreshold:
        name: score_threshold
        description: "Minimum score to emit a label"
        required: false
```

Your operator `init` can read these values through the module configuration interface. For details, see [Module configuration parameters](howto-configure-wasm-graph-definitions.md#module-configuration-parameters).

## Package the model inside the WASM module

Embed the model in your WASM component. For example, in Rust include the ONNX bytes and label map at compile time and load them with wasi‑nn:

> [!TIP]
> Embedding keeps the model and operator logic versioned together. To update a model, publish a new module version and update your graph definition to reference it.

High-level steps:

1. Place the `.onnx` model and optional `labels.txt` in your source tree (for example, `models/`).
2. Embed them in your code (for example, use Rust `include_bytes!` / `include_str!`).
3. In your operator `init`, create a wasi‑nn graph from the embedded bytes, choosing the CPU backend.
4. For each message, preprocess inputs, set tensors, execute, and postprocess outputs.

Refer to the `snapshot` sample linked above for a complete implementation pattern.

Example file layout (from the public snapshot sample):

- [Labels](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm/rust/examples/snapshot/src/fixture/labels)
- [Models](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm/rust/examples/snapshot/src/fixture/models)

Minimal Rust embedding example (paths are relative to the source file that contains the macro):

```rust
// src/lib.rs (example)
// Embed ONNX model and label map into the component
static MODEL: &[u8] = include_bytes!("fixture/models/mobilenet.onnx");
static LABEL_MAP: &[u8] = include_bytes!("fixture/labels/synset.txt");

fn init_model() -> Result<(), anyhow::Error> {
  // Create wasi-nn graph from embedded ONNX bytes using the CPU backend
  // Pseudocode – refer to the snapshot sample for the full implementation
  // use wasi_nn::{graph::{load, GraphEncoding, ExecutionTarget}, Graph};
  // let graph = load(&[MODEL.to_vec()], GraphEncoding::Onnx, ExecutionTarget::Cpu)?;
  // let exec_ctx = Graph::init_execution_context(&graph)?;
  Ok(())
}
```

Performance tip: Reuse the execution context

To avoid recreating the ONNX graph and execution context for every message, initialize it once and reuse it. The public sample uses a static `LazyLock`:

```rust
use std::sync::LazyLock;
use wasi_nn::{graph::{load, Graph, GraphEncoding, ExecutionTarget}, GraphExecutionContext};

static mut CONTEXT: LazyLock<GraphExecutionContext> = LazyLock::new(|| {
  let graph = load(&[MODEL.to_vec()], GraphEncoding::Onnx, ExecutionTarget::Cpu).unwrap();
  Graph::init_execution_context(&graph).unwrap()
});

fn run_inference(/* input tensors, etc. */) {
  unsafe {
    // (*CONTEXT).set_input(...)?; (*CONTEXT).compute()?; (*CONTEXT).get_output(...)?;
  }
}
```

## Build and deploy

Reuse the streamlined sample builders or build locally:

- [Rust Docker builder](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm/rust#using-the-streamlined-docker-builder)
- General deployment and registry steps: [Use WebAssembly with data flow graphs](howto-dataflow-graph-wasm.md)

Typical flow:

1. Build your WASM module (release) and produce `<module-name>-<version>.wasm`.
2. Push the module and (optionally) a graph definition to your registry with ORAS.
3. Create or reuse a registry endpoint in Azure IoT Operations.
4. Create a data flow graph resource that references your graph definition artifact.

## Example: MobileNet image classification

The public samples provide two modules wired into a graph for image classification:

- `format:1.0.0` – image decode/resize
- `snapshot:1.0.0` – ONNX inference and softmax

Pull the artifacts from the public registry, push them to your registry, and deploy a data flow graph as shown in [Example 2: Deploy a complex graph](howto-dataflow-graph-wasm.md#example-2-deploy-a-complex-graph). The complex graph uses these modules to process image snapshots and emit classification results.

## Limitations

- ONNX only in this preview. Other formats (such as TFLite) aren't supported by data flow graphs.
- CPU execution target only. No GPU/TPU acceleration.
- Small models recommended. Very large models and memory-intensive inference aren't supported.
- Single-tensor input models are supported. Multi-input models, key-value caching, and advanced sequence/generative scenarios aren't supported.
- Ensure your model's operators are supported by the ONNX backend in the WASM runtime. If an operator isn't supported, inference will fail at load or execution time.

## See also

- [Develop WebAssembly modules](howto-develop-wasm-modules.md)
- [Configure WebAssembly graph definitions](howto-configure-wasm-graph-definitions.md)
- [Use WebAssembly with data flow graphs](howto-dataflow-graph-wasm.md)
