---
title: Call the inference connector from a WASM module (preview)
description: Learn how to build a WebAssembly (WASM) module that calls the Azure IoT Operations inference connector, and run the module in a data flow graph.
author: jkarangula
ms.author: jkarangula
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 10/08/2026
ai-usage: ai-assisted

#CustomerIntent: As a developer, I want to call the inference connector from my own WASM module so that I can prepare inference inputs and use the results in the same step of a data flow graph.
---

# Call the inference connector from a WASM module (preview)

The [inference transform](howto-inference-connector-dataflow-graph.md) sends each message to a model as it is, and replaces the message with the result. To prepare the input or use the result in your own code, for example to build the input from several fields or to convert a tensor into labels, write a WebAssembly (WASM) module that calls the inference connector. This article shows you how to build a Rust module that sends `predict` commands to the connector, and how to run the module in a data flow graph.

[!INCLUDE [inference-connector-preview-note](../../includes/inference-connector-preview-note.md)]

## Prerequisites

[!INCLUDE [prereq-deployed-instance](../../includes/prereq-deployed-instance.md)]

[!INCLUDE [prereq-azure-cli](../../includes/prereq-azure-cli.md)]

- An inference connector that serves at least one model with `mrpc` settings. To learn how to deploy the connector, see [Deploy the inference connector](howto-deploy-inference-connector.md). The examples in this article use a model named `object-detection`.
- A Rust development environment with the `wasm32-wasip2` target. To set one up, see [Build WASM modules for data flows](../../develop-edge-apps/howto-build-wasm-modules.md).
- A container registry for the module and the graph definition, the ORAS CLI, and a registry endpoint for the registry. To learn more, see [Deploy WebAssembly (WASM) modules and graph definitions](../../develop-edge-apps/howto-deploy-wasm-graph-definitions.md) and [Configure registry endpoints](../../develop-edge-apps/howto-configure-registry-endpoint.md).

[!INCLUDE [set-environment-variables](../../includes/set-environment-variables.md)]

Also set the following variables. `REGISTRY` is the host name of your container registry, for example `contoso.azurecr.io`. `REGISTRY_ENDPOINT_NAME` is the name of the registry endpoint for that registry.

```bash
REGISTRY=<registry-host-name>
REGISTRY_ENDPOINT_NAME=<registry-endpoint-name>
CUSTOM_LOCATION_NAME=$(az iot ops show --name $AIO_INSTANCE_NAME --resource-group $RESOURCE_GROUP --query "extendedLocation.name" --output tsv | awk -F'/' '{print $NF}')
```

## How a module calls the connector

The `command_invoker` module of the WASM SDK, `wasm_graph_sdk`, sends a command through the MQTT broker and waits for the response. To run inference on a message, a module:

1. Creates a `predict` request, which is a JSON document with one or more input items.
1. Sends the request to the command topic of the model, for example `aio/inference/command/predict/model_name/object-detection/fileRead/false`.
1. Reads the JSON response, which contains either the results or a `predictError` object.

For the topics, payloads, and errors of the commands, see [Inference connector command reference](reference-inference-connector-commands.md). To learn more about the command invoker, including its timeouts and errors, see [Call services from WASM data flow graphs with the command invoker](../../develop-edge-apps/howto-webassembly-command-invoker.md).

## Create the module

1. Create a Rust library project.

    ```bash
    cargo new --lib my-inference
    cd my-inference
    ```

1. Create a `.cargo/config.toml` file that configures the SDK registry and the WASM target.

    ```toml
    [registries]
    aio-wg = { index = "sparse+https://pkgs.dev.azure.com/azure-iot-sdks/iot-operations/_packaging/preview/Cargo/index/" }

    [build]
    target = "wasm32-wasip2"
    ```

1. Replace the contents of `Cargo.toml` with the following content. The example uses version 1.7.0 of `wasm_graph_sdk`, which includes the `command_invoker` module:

    ```toml
    [package]
    name = "my-inference"
    version = "0.1.0"
    edition = "2021"

    [dependencies]
    wit-bindgen = "0.38"
    wasm_graph_sdk = { version = "=1.7.0", registry = "aio-wg" }
    serde = { version = "1", features = ["derive"] }
    serde_json = "1"

    [lib]
    crate-type = ["cdylib"]
    ```

1. Replace the contents of `src/lib.rs` with the following code. The module reads the model name from its configuration, sends the payload and content type of each message to the model, and replaces them with the first result item:

    ```rust
    use std::sync::Mutex;

    use serde::{Deserialize, Serialize};
    use wasm_graph_sdk::command_invoker::{self, CommandRequest, FormatIndicator, SerializedPayload};
    use wasm_graph_sdk::logger::{self, Level};
    use wasm_graph_sdk::macros::map_operator;

    static MODEL_NAME: Mutex<String> = Mutex::new(String::new());

    #[derive(Serialize)]
    struct PredictRequest {
        items: Vec<PredictRequestItem>,
    }

    #[derive(Serialize)]
    struct PredictRequestItem {
        #[serde(skip_serializing_if = "Option::is_none")]
        content_type: Option<String>,
        data: Vec<u8>,
    }

    #[derive(Deserialize)]
    struct PredictResponse {
        items: Option<Vec<PredictResponseItem>>,
        #[serde(rename = "predictError")]
        predict_error: Option<serde_json::Value>,
    }

    #[derive(Deserialize)]
    struct PredictResponseItem {
        content_type: String,
        data: Vec<u8>,
    }

    fn predict(
        model_name: &str,
        content_type: Option<String>,
        data: Vec<u8>,
    ) -> Result<PredictResponseItem, String> {
        let request = PredictRequest {
            items: vec![PredictRequestItem { content_type, data }],
        };
        let response = command_invoker::invoke(&CommandRequest {
            topic: format!("aio/inference/command/predict/model_name/{model_name}/fileRead/false"),
            command_name: "predict".to_string(),
            payload: SerializedPayload {
                payload: serde_json::to_vec(&request).map_err(|e| e.to_string())?,
                content_type: "application/json".to_string(),
                format_indicator: FormatIndicator::Utf8EncodedCharacterData,
            },
            custom_user_data: Vec::new(),
            timeout_secs: 0,
        })
        .map_err(|e| format!("predict command failed: {e:?}"))?;

        let response: PredictResponse =
            serde_json::from_slice(&response.payload.payload).map_err(|e| e.to_string())?;
        if let Some(error) = response.predict_error {
            return Err(format!("predict failed: {error}"));
        }
        response
            .items
            .and_then(|items| items.into_iter().next())
            .ok_or_else(|| "the predict response has no items".to_string())
    }

    fn my_inference_init(configuration: ModuleConfiguration) -> bool {
        let model_name = configuration
            .properties
            .into_iter()
            .find_map(|(key, value)| (key == "model_name").then_some(value))
            .unwrap_or_default();
        // The model name is a level of the command topic.
        if model_name.is_empty() || model_name.contains(['/', '+', '#']) {
            logger::log(Level::Error, "my-inference", "Set model_name to a valid model name");
            return false;
        }
        *MODEL_NAME.lock().unwrap() = model_name;
        true
    }

    #[map_operator(init = "my_inference_init")]
    fn my_inference(input: DataModel) -> Result<DataModel, Error> {
        let DataModel::Message(message) = input else {
            return Err(Error {
                message: "Unexpected input type".to_string(),
            });
        };
        let content_type = match &message.content_type {
            Some(BufferOrString::String(value)) => Some(value.clone()),
            Some(BufferOrString::Buffer(buffer)) => String::from_utf8(buffer.read()).ok(),
            None => None,
        };
        let model_name = MODEL_NAME.lock().unwrap().clone();
        let result = predict(&model_name, content_type, message.payload.read())
            .map_err(|message| Error { message })?;

        Ok(DataModel::Message(Message {
            payload: BufferOrBytes::Bytes(result.data),
            content_type: Some(BufferOrString::String(result.content_type)),
            ..message
        }))
    }
    ```

    The code works as follows:

    - The `PredictRequest` and `PredictResponse` types match the JSON payloads of the [predict](reference-inference-connector-commands.md#predict) command. The response fields that the types don't include, such as `metadata`, are ignored.
    - The model name is a level of the command topic, so `my_inference_init` rejects a name that's empty or that contains the `/`, `+`, or `#` characters. Such a name would send the command to a different topic.
    - `command_invoker::invoke` waits until the response arrives or the timeout expires. A `timeout_secs` value of `0` applies the default timeout of the data flow.
    - If the connector can't complete the command, the response contains a `predictError` object instead of results. The operator then returns an error, so the graph drops the message and logs the error.

1. Build the module, and copy it to the project folder.

    ```bash
    cargo build --release
    cp target/wasm32-wasip2/release/my_inference.wasm .
    ```

To adapt the module to your scenario:

- To send the path of a file on the model's data volume instead of the data, use `fileRead/true` in the topic, and set `data` to the UTF-8 bytes of the path. To configure the data volume, see [Enable file-based payloads](howto-deploy-inference-connector.md#enable-file-based-payloads). To read or write files on the same volume from the module, for example a result file that the connector writes, use a file store. See [Read and write files from WASM data flow graphs with the file store](../../develop-edge-apps/howto-webassembly-file-store.md).
- To run inference on several inputs in one command, add an item for each input. Azure Machine Learning models accept only one item in each command.
- To get the outputs and labels of a Foundry Local model, for example to convert a tensor into labels, send a [getModelInfo](reference-inference-connector-commands.md#getmodelinfo) command with the payload `{}` to the `aio/inference/command/getModelInfo/model_name/<MODEL_NAME>` topic.

## Create the graph definition

Save the following graph definition as `my-inference-graph.yaml`. It runs the module as a map operation, and declares the `model_name` parameter that the module reads:

```yaml
metadata:
  $schema: "https://www.schemastore.org/aio-wasm-graph-config-1.1.0.json"
  name: "My inference"
  description: "Runs inference on each message by calling the inference connector."
  version: "1.0.0"
  vendor: "Contoso"

moduleRequirements:
  apiVersion: "1.2.99"
  runtimeVersion: "1.1.8"

moduleConfigurations:
  - name: my-inference
    parameters:
      model_name:
        name: model_name
        description: "The name of the model in the inference connector configuration."
        required: true

operations:
  - operationType: "source"
    name: "source"
  - operationType: "map"
    name: "my-inference"
    module: "my-inference:1.0.0"
  - operationType: "sink"
    name: "sink"

connections:
  - from: { name: "source" }
    to: { name: "my-inference" }
  - from: { name: "my-inference" }
    to: { name: "sink" }
```


To learn more about graph definitions, see [Configure WebAssembly (WASM) graph definitions](../../develop-edge-apps/howto-configure-wasm-graph-definitions.md).

## Push the module and the graph definition

Push the module and the graph definition to your registry. For Azure Container Registry, sign in first by running `az acr login --name <ACR_NAME>`.

```bash
oras push $REGISTRY/my-inference:1.0.0 \
  --artifact-type application/vnd.module.wasm.content.layer.v1+wasm \
  my_inference.wasm:application/wasm
oras push $REGISTRY/my-inference-graph:1.0.0 \
  --config /dev/null:application/vnd.microsoft.aio.graph.v1+yaml \
  my-inference-graph.yaml:application/yaml \
  --disable-path-validation
```

The `module` value in the graph definition, `my-inference:1.0.0`, must match the path and tag of the module in the registry.

## Deploy a data flow graph with the module

The following Bicep file creates a data flow graph in the default data flow profile. The graph reads images from the `camera/images` topic, runs the module with the `object-detection` model, and publishes the results to the `camera/inference-results` topic.

1. Save the following Bicep file as `my-inference-graph.bicep`:

    ```bicep
    param aioInstanceName string
    param customLocationName string
    param registryEndpointName string
    param graphName string = 'my-inference-graph'
    param modelName string = 'object-detection'

    resource aioInstance 'Microsoft.IoTOperations/instances@2026-09-03-preview' existing = {
      name: aioInstanceName
    }

    resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
      name: customLocationName
    }

    resource defaultDataflowProfile 'Microsoft.IoTOperations/instances/dataflowProfiles@2026-09-03-preview' existing = {
      parent: aioInstance
      name: 'default'
    }

    resource dataflowGraph 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflowGraphs@2026-09-03-preview' = {
      parent: defaultDataflowProfile
      name: graphName
      extendedLocation: {
        name: customLocation.id
        type: 'CustomLocation'
      }
      properties: {
        mode: 'Enabled'
        nodes: [
          {
            nodeType: 'Source'
            name: 'images'
            sourceSettings: {
              endpointRef: 'default'
              dataSources: [
                'camera/images'
              ]
            }
          }
          {
            nodeType: 'Graph'
            name: 'my-inference'
            graphSettings: {
              registryEndpointRef: registryEndpointName
              artifact: 'my-inference-graph:1.0.0'
              configuration: [
                {
                  key: 'model_name'
                  value: modelName
                }
              ]
            }
          }
          {
            nodeType: 'Destination'
            name: 'results'
            destinationSettings: {
              endpointRef: 'default'
              dataDestination: 'camera/inference-results'
            }
          }
        ]
        nodeConnections: [
          {
            from: { name: 'images' }
            to: { name: 'my-inference' }
          }
          {
            from: { name: 'my-inference' }
            to: { name: 'results' }
          }
        ]
      }
    }
    ```

1. Deploy the Bicep file:

    ```azurecli
    az deployment group create \
      --resource-group $RESOURCE_GROUP \
      --name my-inference-graph \
      --template-file my-inference-graph.bicep \
      --parameters aioInstanceName=$AIO_INSTANCE_NAME customLocationName=$CUSTOM_LOCATION_NAME registryEndpointName=$REGISTRY_ENDPOINT_NAME
    ```

To test the graph, publish an image to the `camera/images` topic, and subscribe to the `camera/inference-results` topic. For the commands, see [Test the data flow graph](howto-inference-connector-dataflow-graph.md#test-the-data-flow-graph).

## Troubleshoot the module

If the graph doesn't produce results, check the logs of the data flow graph for errors that the module returns:

| Error in the logs | Cause | Resolution |
|--|--|--|
| `predict command failed` with `Timeout` | No model with `mrpc` settings has the name in the topic, so the connector doesn't respond. Or the model didn't respond before the timeout expired. | Set `model_name` to the `name` of a model with `mrpc` settings. If the model needs more time, set `timeout_secs` to a longer timeout. |
| `predict failed` | The connector couldn't complete the command. The message contains the error object from the connector. | See [Errors](reference-inference-connector-commands.md#errors), and check the connector logs. To learn more, see [Troubleshoot the inference connector](troubleshoot-inference-connector.md). |

## Related content

- [Run inference in a data flow graph](howto-inference-connector-dataflow-graph.md)
- [Inference connector command reference](reference-inference-connector-commands.md)
- [Build WASM modules for data flows](../../develop-edge-apps/howto-build-wasm-modules.md)
- [Configure WebAssembly (WASM) graph definitions](../../develop-edge-apps/howto-configure-wasm-graph-definitions.md)
- [Call services from WASM data flow graphs with the command invoker](../../develop-edge-apps/howto-webassembly-command-invoker.md)
- [Read and write files from WASM data flow graphs with the file store](../../develop-edge-apps/howto-webassembly-file-store.md)
