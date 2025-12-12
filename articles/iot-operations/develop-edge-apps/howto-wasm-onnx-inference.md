---
title: Run ONNX inference in WebAssembly data flow graphs
description: Learn how to package and run ONNX models inside WebAssembly modules for real-time inference in Azure IoT Operations data flow graphs.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 11/24/2025
ai-usage: ai-assisted

---

# Run ONNX inference in WebAssembly (WASM) data flow graphs

This article shows how to embed and run small Open Neural Network Exchange (ONNX) models inside your WebAssembly modules to perform in-band inference as part of Azure IoT Operations data flow graphs. Use this approach for low-latency enrichment and classification directly on streaming data without calling external prediction services.

> [!IMPORTANT]
> Data flow graphs currently only support MQTT (Message Queuing Telemetry Transport), Kafka, and OpenTelemetry endpoints. Other endpoint types like Data Lake, Microsoft Fabric OneLake, Azure Data Explorer, and Local Storage aren't supported. For more information, see [Known issues](../troubleshoot/known-issues.md#data-flow-graphs-only-support-specific-endpoint-types).

## Why use in-band ONNX interference

With Azure IoT Operations data flow graphs, you can embed small ONNX model inference directly in the pipeline instead of calling an external prediction service. This approach offers several practical advantages:

- **Low latency**: Perform real-time enrichment or classification in the same operator path where data arrives. Each message incurs only local CPU inference, avoiding network round trips.
- **Compact footprint**: Target compact models like MobileNet-class models. This capability isn't for large transformer models, GPU/TPU acceleration, or frequent A/B model rollouts.
- **Optimized for specific use cases**:
  - Inline with multi-source stream processing where features are already collocated in the graph
  - Aligned with event-time semantics so inference uses the same timestamps as other operators
  - Kept small enough to embed with the module without exceeding practical WASM size and memory constraints
- **Simple updates**: Ship a new module with WASM and embedded model, then update the graph definition reference. No need to have a separate model registry or external endpoint change.
- **Hardware constraints**: ONNX backend runs on CPU through WebAssembly System Interface (WASI) `wasi-nn`. No GPU/TPU targets; only supported ONNX operators run.
- **Horizontal scaling**: Inference scales as the data flow graph scales. When the runtime adds more workers for throughput, each worker loads the embedded model and participates in load balancing.

## When to use in-band ONNX inference

Use in-band inference when you have these requirements:

- Low latency needs to enrich or classify messages inline at ingestion time
- Small and efficient models, like MobileNet-class vision or similar compact models
- Inference that needs to align with event-time processing and the same timestamps as other operators
- Simple updates by shipping a new module version with an updated model

Avoid in-band inference when you have these requirements:

- Large transformer models, GPU/TPU acceleration, or sophisticated A/B rollouts
- Models that require multiple tensor inputs, key-value caching, or unsupported ONNX operators

> [!NOTE]
> You want to keep modules and embedded models small. Large models and memory-heavy workloads aren't supported. Use compact architectures and small input sizes like 224×224 for image classification.

## Prerequisites

Before you begin, ensure you have:

- An Azure IoT Operations deployment with data flow graphs capability.
- Access to a container registry like Azure Container Registry.
- Development environment set up for WebAssembly module development.

For detailed setup instructions, see [Develop WebAssembly modules](./howto-develop-wasm-modules.md).

## Architecture pattern

The common pattern for ONNX inference in data flow graphs includes:

1. **Preprocess data**: Transform raw input data to match your model's expected format. For image models, this process typically involves:
   - Decoding image bytes.
   - Resizing to a target dimension (for example, 224×224).
   - Converting the color space (for example, RGB to BGR).
   - Normalizing pixel values to the expected range (0–1 or -1 to 1).
   - Arranging data in the correct tensor layout: NCHW (batch, channels, height, width) or NHWC (batch, height, width, channels).
1. **Run inference**: Convert preprocessed data into tensors using the `wasi-nn` interface, load your embedded ONNX model with the CPU backend, set input tensors on the execution context, invoke the model's forward pass, and retrieve output tensors containing raw predictions.
1. **Postprocess outputs**: Transform raw model outputs into meaningful results. Common operations:
   - Apply softmax to produce classification probabilities.
   - Select top-K predictions.
   - Apply a confidence threshold to filter low-confidence results.
   - Map prediction indices to human-readable labels.
   - Format results for downstream consumption.

In the [IoT samples for Rust WASM operators](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm/operators/) you can find two samples that follow this pattern:

-  [Data transformation "format" sample](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm/operators/format): decodes and resizes images to RGB24 224×224. 
- [Image/Video processing "snapshot" sample](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm/operators/snapshot): embeds a MobileNet v2 ONNX model, runs CPU inference, and computes softmax.

## Configure graph definition

To enable ONNX inference in your data flow graph, you need to configure both the graph structure and module parameters. The graph definition specifies the pipeline flow, while module configurations allow runtime customization of preprocessing and inference behavior.

### Enable WASI-NN support

To enable WebAssembly Neural Network interface support, add the `wasi-nn` feature to your graph definition:

```yaml
moduleRequirements:
  apiVersion: "1.1.0"
  runtimeVersion: "1.1.0"
  features:
    - name: "wasi-nn"
```

### Define operations and data flow

Configure the operations that form your inference pipeline. This example shows a typical image classification workflow:

```yaml
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

This configuration creates a pipeline where:
- `camera-input` receives raw image data from a source
- `module-format/map` preprocesses images (decode, resize, format conversion)
- `module-snapshot/map` runs ONNX inference and postprocessing
- `results-output` emits classification results to a sink

### Configure module parameters

Define runtime parameters to customize module behavior without rebuilding. These parameters are passed to your WASM modules at initialization:

```yaml
moduleConfigurations:
  - name: module-format/map
    parameters:
      width:
        name: width
        description: "Target width for image resize (default: 224)"
        required: false
      height:
        name: height
        description: "Target height for image resize (default: 224)"
        required: false
      pixelFormat:
        name: pixel_format
        description: "Output pixel format (rgb24, bgr24, grayscale)"
        required: false

  - name: module-snapshot/map
    parameters:
      executionTarget:
        name: execution_target
        description: "Inference execution target (cpu, auto)"
        required: false
      labelMap:
        name: label_map
        description: "Label mapping strategy (embedded, imagenet, custom)"
        required: false
      scoreThreshold:
        name: score_threshold
        description: "Minimum confidence score to include in results (0.0-1.0)"
        required: false
      topK:
        name: top_k
        description: "Maximum number of predictions to return (default: 5)"
        required: false
```

Your operator `init` can read these values through the module configuration interface. For details, see [Module configuration parameters](../connect-to-cloud/howto-configure-wasm-graph-definitions.md#module-configuration-parameters).

## Package the model

Embedding ONNX models directly into your WASM component ensures atomic deployment and version consistency. This approach simplifies distribution and removes runtime dependencies on external model files or registries.

> [!TIP]
> Embedding keeps the model and operator logic versioned together. To update a model, publish a new module version and update your graph definition to reference it. This approach eliminates model drift and ensures reproducible deployments.

### Model preparation guidelines

Before embedding your model, ensure it meets the requirements for WASM deployment:

- Keep models under 50 MB for practical WASM loading times and memory constraints.
- Verify your model accepts a single tensor input in a common format (float32 or uint8).
- Verify that the WASM ONNX runtime backend supports every operator your model uses.
- Use ONNX optimization tools to reduce model size and improve inference speed.

### Embedding workflow

Follow these steps to embed your model and associated resources:

1. **Organize model assets**: Place the `.onnx` model file and optional `labels.txt` in your source tree. Use a dedicated directory structure such as `src/fixture/models/` and `src/fixture/labels/` for clear organization.
1. **Embed at compile time**: Use language-specific mechanisms to include model bytes in your binary. In Rust, use `include_bytes!` for binary data and `include_str!` for text files.
1. **Initialize WASI-NN graph**: In your operator's `init` function, create a `wasi-nn` graph from the embedded bytes, specifying the ONNX encoding and CPU execution target.
1. **Implement inference loop**: For each incoming message, preprocess inputs to match model requirements, set input tensors, execute inference, retrieve outputs, and apply postprocessing.
1. **Handle errors gracefully**: Implement proper error handling for model loading failures, unsupported operators, and runtime inference errors.

For a complete implementation pattern, see the ["snapshot" sample](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm/operators/snapshot).

### Recommended project structure

Organize your WASM module project with clear separation of concerns:

```
src/
├── lib.rs                 # Main module implementation
├── model/
│   ├── mod.rs            # Model management module
│   └── inference.rs      # Inference logic
└── fixture/
    ├── models/
    │   ├── mobilenet.onnx      # Primary model
    │   └── mobilenet_opt.onnx  # Optimized variant
    └── labels/
        ├── imagenet.txt        # ImageNet class labels
        └── custom.txt          # Custom label mappings
```

### Example file references

Use the following file layout from the "snapshot" sample as a reference:

- [Labels directory](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm/operators/snapshot/src/fixture/labels) - Contains various label mapping files
- [Models directory](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm/operators/snapshot/src/fixture/models) - Contains ONNX model files and metadata

### Minimal embedding example

The following example shows minimal Rust embedding. The paths are relative to the source file that contains the macro:

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

### Performance optimization

To avoid recreating the ONNX graph and execution context for every message, initialize it once and reuse it. The [public sample](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/wasm/operators/snapshot/src/lib.rs) uses a static `LazyLock`:

```rust
use crate::wasi::nn::{
     graph::{load, ExecutionTarget, Graph, GraphEncoding, GraphExecutionContext},
     tensor::{Tensor, TensorData, TensorDimensions, TensorType},
 };

 static mut CONTEXT: LazyLock<GraphExecutionContext> = LazyLock::new(|| {
     let graph = load(&[MODEL.to_vec()], GraphEncoding::Onnx, ExecutionTarget::Cpu).unwrap();
     Graph::init_execution_context(&graph).unwrap()
 });
    
fn run_inference(/* input tensors, etc. */) {
   unsafe {
     // (*CONTEXT).compute()?;
  }
}
```

## Deploy your modules

Reuse the streamlined sample builders or build locally:

- To use the streamlined Docker builder, see [Rust Docker builder sample](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/wasm/README.md#rust-builds-docker-builder)
- For a general WebAssembly deployment and registry steps, see [Use WebAssembly with data flow graphs](../connect-to-cloud/howto-dataflow-graph-wasm.md)

Follow this deployment process:

1. Build your WASM module in release mode and produce a `<module-name>-<version>.wasm` file.
1. Push the module and optionally a graph definition to your registry by using OCI Registry as Storage (ORAS).
1. Create or reuse a registry endpoint in Azure IoT Operations.
1. Create a data flow graph resource that references your graph definition artifact.

## Example: MobileNet image classification

The IoT public samples provide two samples wired into a graph for image classification:  the ["format" sample](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm/operators/format) provides image decode and resize functionality, and the ["snapshot" sample](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm/operators/snapshot) provides ONNX inference and softmax processing.


To deploy this example, pull the artifacts from the public registry, push them to your registry, and deploy a data flow graph as shown in [Example 2: Deploy a complex graph](../connect-to-cloud/howto-dataflow-graph-wasm.md#example-2-deploy-a-complex-graph). The complex graph uses these modules to process image snapshots and emit classification results.

## Limitations

Inference in WASM data flow graphs has the following limitations:

- ONNX only. Data flow graphs don't support other formats like TFLite.
- CPU only. No GPU/TPU acceleration.
- Small models recommended. Large models and memory-intensive inference aren't supported.
- Single-tensor input models are supported. Multi-input models, key-value caching, and advanced sequence or generative scenarios aren't supported.
- Ensure the ONNX backend in the WASM runtime supports your model's operators. If an operator isn't supported, inference fails at load or execution time.

## Next steps

- [Develop WebAssembly modules](./howto-develop-wasm-modules.md)
- [Configure WebAssembly graph definitions](../connect-to-cloud/howto-configure-wasm-graph-definitions.md)
- [Use WebAssembly with data flow graphs](../connect-to-cloud/howto-dataflow-graph-wasm.md)
