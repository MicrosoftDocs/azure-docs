---
title: Read and write files from WASM data flow graphs with the file store (preview)
description: Learn how to read and write files backed by persistent volume claims from WebAssembly modules by using the file store host API in Azure IoT Operations data flow graphs.
author: dominicbetts
ms.author: dobett
ms.topic: how-to
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.date: 10/20/2026
ai-usage: ai-assisted

# CustomerIntent: As a developer, I want to read and write files from a WASM module so that I can process data that is too large to carry in a message payload.
---

# Read and write files from WASM data flow graphs with the file store (preview)

The file store host API lets a WebAssembly (WASM) module read and write files on persistent cluster storage without granting the module general filesystem access. Use it when a file, such as an image, model input, or inference result, is larger than the broker's [maximum message size](../deployment-plan/deployment-planning.md#choose-your-memory-profile), or when you don't want to send large binary files through the broker. Files must still fit within the [current file size limits](#current-file-size-limits) and available memory.

> [!IMPORTANT]
> The file store is in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this article, you build a module whose map operator reads the file named in each message from a read-only store, writes a copy to a writable store, and outputs the name of the copy. You:

1. Prepare a persistent volume claim with input and output directories.
1. Write the module and its graph definition.
1. Build the module, and publish it and the graph definition to your container registry.
1. Deploy a data flow profile and a data flow graph that give the module two file stores.
1. Publish a file name to the graph and verify that the copy appears in the output directory.

## File stores

A *file store* maps a store ID to one directory on cluster storage. Every WASM module in the data flow graph can use the store ID to access that directory. Each store has these properties:

- **Store ID**. The module passes this identifier to the host API.
- **Storage location**. A backing PersistentVolumeClaim (PVC) and an optional subpath identify the directory.
- **Access mode**. The store provides read-only or read/write access. Stores are read-only by default.

Within a store, a module identifies a file by its *reference ID*. A reference ID is one file name, without a directory path. The host reads or writes the entire file as bytes:

```text
get("model-input", "frame-0042.png") -> <image bytes>
set("results", "frame-0042.json", <result bytes>)
```

### Current file size limits

The current preview doesn't have a configurable per-store file size limit. Reads and writes have different runtime constraints:

| Operation | Current limit |
| --------- | ------------- |
| `get` | The host doesn't enforce a file size cap before reading. The entire file must fit in host and WASM module memory. With the Rust SDK, a single wasm32 buffer must be smaller than 2 GiB, and available memory can impose a much lower limit. |
| `set` | The runtime allows 128 MiB (134,217,728 bytes) of data per guest-to-host call. This limit includes the file contents, store ID, and reference ID, so the file contents must be smaller than 128 MiB. |

The 128 MiB write-call budget doesn't apply to file contents returned by `get`. However, reading a larger file doesn't mean that the module can write it back with `set`.

Exceeding the write-call budget causes a runtime trap before the host processes the `set` call, rather than returning a `FileStoreError`. Running out of memory can also fail the module instead of returning a `FileStoreError`.

> [!CAUTION]
> Don't assume that processing resumes automatically after a runtime trap. Stop submitting inputs that exceed these limits. Before resuming traffic, check the data flow logs and verify that the graph produces output for a known-good input. If processing doesn't resume, contact [Azure support](https://azure.microsoft.com/support/options/) for recovery guidance.

Check file sizes in the application that produces them, before sending their names to the graph. Keep output files within the write-call budget, including the store ID and reference ID. These limits aren't memory-use guarantees: size the data flow profile's memory for the file and any copies used during processing.

## When to use the file store

Use the file store when a module needs to exchange large files with another application through shared cluster storage. Common patterns include:

- **Inference input**. An MQTT message carries a file name instead of the file itself. The module reads the file and runs [ONNX inference](howto-wasm-onnx-inference.md) on it.
- **Persisting results**. A module writes an inference result or a processed artifact to a directory that another system reads.
- **Sharing files with another service**. A module uses the [command invoker](howto-webassembly-command-invoker.md) to ask a service to create a file, and then reads the file from shared storage.

Don't use the file store in these cases:

- You need durable key-value state across messages. Use the [state store](howto-wasm-state-store.md).
- The data already fits in the message payload. Process it directly in an operator.
- You need streaming or partial reads. The file store transfers each file as a single byte array. It has no streaming or seek API.

A [Local Storage data flow endpoint](../connect-to-cloud/howto-configure-local-storage-endpoint.md) is a different capability: it writes a data flow's output messages to a PVC. Use a Local Storage endpoint to persist data flow output, and use a file store when your WASM code needs to read or write specific named files. You can use both in the same Azure IoT Operations instance, but a file store and a Local Storage endpoint can't use the same PVC in the same data flow profile.

> [!IMPORTANT]
> Every WASM module in a data flow graph can use every store that the graph configures. Read-only applies per store, not per module, so don't use file stores to isolate modules in the same graph from each other.

## Architecture

The following diagram shows how a file store connects a WASM module to cluster storage:

:::image type="content" source="media/webassembly-file-store/file-store-architecture.svg" alt-text="Diagram that shows a WASM module using the data flow host to access a directory backed by a persistent volume claim." border="false":::

<!--
```mermaid
flowchart LR
Module[WASM module] - ->|get or set with store ID| Host[Data flow host]
Host - ->|restricted directory access| Dir[Store directory]
PVC[(PersistentVolumeClaim)] - -> Dir
Config[fileStores configuration] - -> Host
```
-->

The data flow controller mounts each referenced PVC into the data flow profile pod. The host limits each store ID to the configured directory and serves the module's `get` and `set` calls. A `set` call fails when the selected store is read-only.

## Prerequisites

Ensure you have:

- An Azure IoT Operations instance and permission to create data flow graphs in its resource group. See [Deploy Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md). You need a cluster to test file store calls, because the Azure IoT Operations Data Flow extension for Visual Studio Code and the `dataflow-dev` CLI don't map local directories to file stores. For a development loop, you can use a single-node cluster, such as K3s. See [Prepare your Azure Arc-enabled Kubernetes cluster](../deploy-iot-ops/howto-prepare-cluster.md).
- `kubectl` access to the Kubernetes cluster that runs Azure IoT Operations.
- The prerequisites listed in [Build WASM modules for data flows](howto-build-wasm-modules.md#prerequisites).
- An Azure container registry, a [registry endpoint](howto-configure-registry-endpoint.md) that points to it, and the ORAS CLI. See [Deploy WASM modules and graph definitions](howto-deploy-wasm-graph-definitions.md).

Set the following variables, which the commands in this article use:

```bash
RESOURCE_GROUP=<RESOURCE_GROUP>
AIO_INSTANCE_NAME=<AIO_INSTANCE_NAME>
ACR_NAME=<ACR_NAME>
GRAPH_NAME=file-copy
```

Use an existing Kubernetes PersistentVolumeClaim (PVC) in the same namespace as the `DataflowGraph` resource. To learn about provisioning a PVC with Azure Container Storage enabled by Azure Arc, see [Configure data flow endpoints for local storage](../connect-to-cloud/howto-configure-local-storage-endpoint.md#use-azure-container-storage-enabled-by-azure-arc). The following examples use the `azure-iot-operations` namespace.

## Prepare persistent storage

Choose an existing PVC or ask your Kubernetes storage administrator to provision one.

This article uses a claim named `inference-data` with the following directories:

```text
inference-data
|-- inputs
|-- outputs
```

The `inputs` directory contains files for the module to read. The `outputs` directory receives files that the module writes. Create both directories on the volume before you start the graph. If a configured directory doesn't exist, the data flow host can't open the file store and the graph doesn't become ready.

Data flow pods run as user and group ID 65532. Ensure that this user can read the store directories and their files, and can write to the directories of writable stores.

Use your storage management process or a Kubernetes pod that mounts the claim to create the directories. Place input files in `inputs`. For this file-copy example, each input file must fit within the [`set` write-call budget](#current-file-size-limits), including space for the `results` store ID and the output file's reference ID. To mount a claim in a pod, see [Configure a pod to use a PersistentVolume for storage](https://kubernetes.io/docs/tutorials/configuration/configure-persistent-volume-storage/).

If the claim uses `ReadWriteOnce` or `ReadWriteOncePod` access, delete the helper pod after preparing the directories and input files, before deploying the graph. Leaving it mounted in a helper pod can prevent the data flow pod from attaching the volume. Release the volume from the data flow pods before mounting it in a helper pod again.

Verify that the PVC exists and its status is `Bound`:

```bash
kubectl get pvc inference-data -n azure-iot-operations
```

If the claim's storage class uses the `WaitForFirstConsumer` binding mode, the claim stays `Pending` until a pod mounts it.

## Use a dedicated data flow profile

The controller validates file store claims when it deploys a data flow profile. A missing claim, an incompatible access mode, or a Local Storage collision blocks configuration updates for every data flow and data flow graph in that profile, not only the graph that uses the file store. During preview, run graphs that use file stores in a dedicated data flow profile so that a file store problem doesn't affect existing workloads. A dedicated profile runs its own data flow pods, which use more cluster resources.

The examples in this article create a profile named `file-store` with one instance. Before you run more than one instance, review the access mode requirements in [File store behavior](#file-store-behavior). For other profile settings, see [Configure data flow profiles](../connect-to-cloud/howto-configure-dataflow-profile.md).

## Write the module

Create a Rust library project named `file-copy`:

```bash
cargo new --lib file-copy
cd file-copy
```

Configure the SDK registry in `.cargo/config.toml` and set `[lib] crate-type = ["cdylib"]` in `Cargo.toml` by following the **Standard tools** tab of [Build WASM modules for data flows](howto-build-wasm-modules.md#create-a-new-graph-with-custom-wasm-modules).

Use `wasm_graph_sdk` 1.7 with these dependencies in your module's `Cargo.toml`:

```toml
[dependencies]
wit-bindgen = "0.38"
wasm_graph_sdk = { version = "~1.7", registry = "aio-wg" }
```

`~1.7` allows 1.7.x patch updates but not 1.8.

Replace `src/lib.rs` with the following code. The map operator reads the file named in the message payload from the `model-input` store, writes a copy to the `results` store, and outputs the name of the copy.

```rust
use wasm_graph_sdk::file_store::{self, FileStoreError};
use wasm_graph_sdk::macros::map_operator;

const INPUT_STORE: &str = "model-input";
const RESULTS_STORE: &str = "results";

fn process_file(reference_id: &str) -> Result<String, String> {
    let bytes = match file_store::get(INPUT_STORE, reference_id) {
        Ok(bytes) => bytes,
        Err(FileStoreError::NotFound(message)) => {
            return Err(format!("input file not found: {message}"));
        }
        Err(error) => return Err(format!("read failed: {error:?}")),
    };

    // Replace this copy with your file-processing logic.
    let result = bytes;

    let output_name = format!("{reference_id}.processed");
    file_store::set(RESULTS_STORE, &output_name, &result)
        .map_err(|error| format!("write failed: {error:?}"))?;

    Ok(output_name)
}

#[map_operator]
fn process_request(input: DataModel) -> Result<DataModel, Error> {
    let DataModel::Message(mut message) = input else {
        return Err(Error {
            message: "expected a message input".to_string(),
        });
    };

    let payload = message.payload.read();
    let reference_id = std::str::from_utf8(&payload).map_err(|error| Error {
        message: format!("payload isn't a UTF-8 file name: {error}"),
    })?;

    let output_name = process_file(reference_id).map_err(|message| Error { message })?;

    message.content_type = Some(BufferOrString::String("text/plain".to_string()));
    message.schema = None;
    message.payload = BufferOrBytes::Bytes(output_name.into_bytes());
    Ok(DataModel::Message(message))
}
```

For example, if the payload is `frame-0042.png`, the module reads `inputs/frame-0042.png` through the `model-input` store. It writes `outputs/frame-0042.png.processed` through the `results` store and sends `frame-0042.png.processed` as the output payload.

A `set` call creates the file if it doesn't exist and replaces its contents if it does. The write isn't atomic: readers can see partial contents, and concurrent writes to the same file, such as from multiple instances, can corrupt it. Notify other applications only after `set` returns, as this example does. Likewise, have other applications finish writing a file, for example by writing to a temporary name and then renaming it, before they send its name to the graph.

The host returns a `FileStoreError` for validation and filesystem failures. Handle these variants in your module. Runtime traps and memory failures described in [Current file size limits](#current-file-size-limits) aren't returned as `FileStoreError` values.

| Variant             | Meaning |
| ------------------- | ------- |
| `AccessDenied`      | The store ID is empty or isn't configured on the graph, a `set` targeted a read-only store, or the filesystem denied access. |
| `NotFound`          | The reference ID doesn't exist in the store directory. |
| `InvalidReference`  | The reference ID isn't a single file name. For example, it's empty, it's `..`, or it contains a directory path such as `inputs/frame.png`. |
| `Other`             | Another host or filesystem error occurred. |

> [!NOTE]
> Within a store, the host doesn't follow symbolic links that point outside the store directory. If the `subPath` directory is itself a symbolic link, the host follows it when the graph starts, even if it points outside the claim. Only let trusted workloads write to the claim.

## Create the graph definition

The file store is a host import that your module requires. Declare the API version that provides it in the `moduleRequirements` section of your graph definition. For `moduleRequirements` details, see [Version compatibility](howto-configure-wasm-graph-definitions.md#version-compatibility).

Save the following graph definition as `graph.yaml` in the project directory. The graph passes each message from the source through the `file-copy` map operator to the sink:

```yaml
metadata:
  $schema: "https://www.schemastore.org/aio-wasm-graph-config-1.1.0.json"
  name: "File copy graph"
  version: "1.0.0"

moduleRequirements:
  apiVersion: "1.7.0"
  runtimeVersion: "1.1.0"

operations:
  - operationType: "source"
    name: "input"
  - operationType: "map"
    name: "file-copy/map"
    module: "file-copy:1.0.0"
  - operationType: "sink"
    name: "output"

connections:
  - from: { name: "input" }
    to: { name: "file-copy/map" }
  - from: { name: "file-copy/map" }
    to: { name: "output" }
```

## Build and publish the module

Build the module, and then push the module and the graph definition to your container registry:

```bash
cargo build --release --target wasm32-wasip2
cp target/wasm32-wasip2/release/file_copy.wasm .

az acr login --name $ACR_NAME
oras push $ACR_NAME.azurecr.io/file-copy:1.0.0 --artifact-type application/vnd.module.wasm.content.layer.v1+wasm file_copy.wasm:application/wasm
oras push $ACR_NAME.azurecr.io/file-copy-graph:1.0.0 --config /dev/null:application/vnd.microsoft.aio.graph.v1+yaml graph.yaml:application/yaml --disable-path-validation
```

The module reference `file-copy:1.0.0` in `graph.yaml` matches the module artifact name in the registry. The data flow graph in the next section references the graph definition as `file-copy-graph:1.0.0`. For other registry layouts, see [Choose an artifact layout](howto-deploy-wasm-graph-definitions.md#choose-an-artifact-layout).

## Configure the data flow graph

Create the `file-store` data flow profile and a data flow graph that uses it. The graph's `fileStores` list gives the module two stores backed by the same claim: a read-only `model-input` store and a writable `results` store.

# [Bicep](#tab/bicep)

File stores require the `2026-11-01-preview` API version of the `dataflowGraphs` resource. Save the following file as `main.bicep`, and replace the placeholders with your values:

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'
param registryEndpointName string = '<REGISTRY_ENDPOINT_NAME>'

resource aioInstance 'Microsoft.IoTOperations/instances@2026-07-01' existing = {
  name: aioInstanceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource fileStoreProfile 'Microsoft.IoTOperations/instances/dataflowProfiles@2026-07-01' = {
  parent: aioInstance
  name: 'file-store'
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    instanceCount: 1
  }
}

resource dataflowGraph 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflowGraphs@2026-11-01-preview' = {
  parent: fileStoreProfile
  name: 'file-copy'
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    mode: 'Enabled'
    requestDiskPersistence: 'Disabled'
    fileStores: [
      {
        id: 'model-input'
        persistentVolumeClaimRef: 'inference-data'
        subPath: 'inputs'
        readOnly: true
      }
      {
        id: 'results'
        persistentVolumeClaimRef: 'inference-data'
        subPath: 'outputs'
        readOnly: false
      }
    ]
    nodes: [
      {
        nodeType: 'Source'
        name: 'source'
        sourceSettings: {
          endpointRef: 'default'
          dataSources: [
            'inference/requests'
          ]
        }
      }
      {
        nodeType: 'Graph'
        name: 'file-copy'
        graphSettings: {
          registryEndpointRef: registryEndpointName
          artifact: 'file-copy-graph:1.0.0'
        }
      }
      {
        nodeType: 'Destination'
        name: 'destination'
        destinationSettings: {
          endpointRef: 'default'
          dataDestination: 'inference/results'
        }
      }
    ]
    nodeConnections: [
      {
        from: {
          name: 'source'
        }
        to: {
          name: 'file-copy'
        }
      }
      {
        from: {
          name: 'file-copy'
        }
        to: {
          name: 'destination'
        }
      }
    ]
  }
}
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

Save the following configuration as `dataflow-graph.yaml`, and replace `<REGISTRY_ENDPOINT_NAME>` with the name of your registry endpoint:

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowProfile
metadata:
  name: file-store
  namespace: azure-iot-operations
spec:
  instanceCount: 1
---
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowGraph
metadata:
  name: file-copy
  namespace: azure-iot-operations
spec:
  profileRef: file-store
  fileStores:
    - id: model-input
      persistentVolumeClaimRef: inference-data
      subPath: inputs
      readOnly: true
    - id: results
      persistentVolumeClaimRef: inference-data
      subPath: outputs
      readOnly: false
  nodes:
    - nodeType: Source
      name: source
      sourceSettings:
        endpointRef: default
        dataSources:
          - inference/requests
    - nodeType: Graph
      name: file-copy
      graphSettings:
        registryEndpointRef: <REGISTRY_ENDPOINT_NAME>
        artifact: file-copy-graph:1.0.0
    - nodeType: Destination
      name: destination
      destinationSettings:
        endpointRef: default
        dataDestination: inference/results
  nodeConnections:
    - from:
        name: source
      to:
        name: file-copy
    - from:
        name: file-copy
      to:
        name: destination
```

---

### File store fields

| Field                      | Required | Default | Description |
| -------------------------- | -------- | ------- | ----------- |
| `id`                       | Yes      | None    | The store identifier that your module passes to `get` and `set`. Must be non-empty and unique within the data flow graph. |
| `persistentVolumeClaimRef` | Yes      | None    | The name of an existing `PersistentVolumeClaim` in the same namespace. Must be 1–63 characters using lowercase letters, digits, and hyphens, and start and end with an alphanumeric character. |
| `subPath`                  | No       | `""`    | A relative directory within the claim to expose, such as `outputs` or `media/outputs`. Omit the field or use an empty string to expose the claim root. Absolute paths and parent-directory (`..`) segments aren't allowed. The directory must exist before the graph starts. |
| `readOnly`                 | No       | `true`  | When `true`, the store allows reads only. Set to `false` to allow reads and writes. |

### File store behavior

- **Existing claim only.** The data flow graph references the claim but doesn't create it.
- **Writable stores need a writable claim.** A store with `readOnly: false` requires a claim that requests `ReadWriteOnce`, `ReadWriteMany`, or `ReadWriteOncePod` access.
- **Multiple stores per claim.** Several stores can reference the same claim to expose different subdirectories or permissions. The controller mounts the claim once. If any store that references a claim is writable, the underlying mount is writable, and the host enforces read-only stores per store ID.
- **No sharing with Local Storage.** A file store and a Local Storage data flow endpoint can't use the same claim in the same data flow profile. Use a separate claim for each.
- **Multiple instances.** When the data flow profile's `instanceCount` is greater than 1, replicas can run on different nodes and every replica mounts each referenced claim. The controller requires `ReadOnlyMany` or `ReadWriteMany` access for read-only stores, and `ReadWriteMany` access for writable stores. Whether mounting succeeds still depends on the storage driver.
- **Whole files in memory.** Each `get` or `set` call transfers the entire file through host and module memory. Follow the [current file size limits](#current-file-size-limits), including the write-call budget and memory requirements.
- **No deletion or retention.** The file store API can only read and write files. Clean up files and monitor storage capacity outside the graph.

## Deploy and verify the graph

# [Bicep](#tab/bicep)

Deploy the Bicep file:

```azurecli
az deployment group create --resource-group $RESOURCE_GROUP --template-file main.bicep
```

Check the graph's health. The status is `Available` when the graph is running:

```azurecli
az iot ops dataflowgraph show \
  --name $GRAPH_NAME \
  --profile file-store \
  --instance $AIO_INSTANCE_NAME \
  --resource-group $RESOURCE_GROUP \
  --query properties.status.healthState.status \
  --output tsv
```

# [Kubernetes (debug only)](#tab/kubernetes)

[!INCLUDE [kubernetes-debug-only-note](../includes/kubernetes-debug-only-note.md)]

Apply the configuration:

```bash
kubectl apply -f dataflow-graph.yaml
```

Check the graph's health. The status is `Available` when the graph is running:

```bash
kubectl get dataflowgraph $GRAPH_NAME -n azure-iot-operations -o jsonpath='{.status.healthState.status}{"\n"}'
```

---

Subscribe to the `inference/results` MQTT topic, and then publish a message to the `inference/requests` topic with a payload that contains the name of a file in the `inputs` directory. For example, use `frame-0042.png` as the payload. To connect an MQTT client, see [Test connectivity to the MQTT broker](../manage-mqtt-broker/howto-test-connection.md).

Verify that you receive `frame-0042.png.processed` on `inference/results`. Use your storage management process to verify that the module created `frame-0042.png.processed` in the `outputs` directory.

If the graph doesn't become `Available`, check the health message, the `file-store` data flow profile status, and the data flow pod logs. Common causes include a PVC that doesn't exist or can't be mounted, a configured directory that doesn't exist, file permissions that don't allow user 65532, a writable store on a claim that doesn't request write access, and a PVC access mode that doesn't support the data flow profile's instance count.

## Related content

- [Build WASM modules for data flows](howto-build-wasm-modules.md)
- [Create stateful WASM graphs with the state store](howto-wasm-state-store.md)
- [Run ONNX inference in WASM data flow graphs](howto-wasm-onnx-inference.md)
- [Understand WebAssembly (WASM) modules and graph definitions for data flow graphs](concepts-wasm-modules.md)
