---
title: Inference connector command reference (preview)
description: Reference for the predict and getModelInfo commands that the Azure IoT Operations inference connector serves over MQTT, including topics, payloads, and errors.
author: jkarangula
ms.author: jkarangula
ms.service: azure-iot-operations
ms.subservice: azure-akri
ms.topic: reference
ms.date: 10/08/2026
ai-usage: ai-assisted

#CustomerIntent: As a developer, I want a reference for the inference connector commands so that I can call a model from my own applications and data flow graph modules.
---

# Inference connector command reference (preview)

For each model that has `mrpc` settings, the inference connector serves two commands through the MQTT broker:

- `predict` runs inference on one or more input items.
- `getModelInfo` returns information about the model, such as its input shape, outputs, and labels.

The [inference transform](howto-inference-connector-dataflow-graph.md) for data flow graphs uses the `predict` command. You can also call both commands from your own applications and [WASM modules](howto-inference-connector-webassembly-module.md). This article describes the topics, payloads, and errors of the commands.

[!INCLUDE [inference-connector-preview-note](../../includes/inference-connector-preview-note.md)]

## Protocol

The commands use the remote procedure call (RPC) protocol of the Azure IoT Operations SDKs over MQTT 5. To call a command from an application, use a command invoker from the SDKs. The command invoker handles the request and response topics, correlation, and timeouts for you. To learn more, see [command invoker](https://github.com/Azure/iot-operations-sdks/blob/main/doc/components.md#command-invoker) in the SDKs documentation. To call a command from a WASM module in a data flow graph, see [Call the inference connector from a WASM module](howto-inference-connector-webassembly-module.md).

The request and response payloads of both commands are JSON documents with the content type `application/json`.

## Command topics

The name of the model and, for `predict`, the file read mode are levels of the request topic:

| Command | Request topic |
|--|--|
| `predict` | `aio/inference/command/predict/model_name/<MODEL_NAME>/fileRead/<FILE_READ>` |
| `getModelInfo` | `aio/inference/command/getModelInfo/model_name/<MODEL_NAME>` |

- `<MODEL_NAME>` is the `name` of the model in the inference connector configuration. Because the name is a topic level, it can't be empty or contain the `/`, `+`, or `#` characters.
- `<FILE_READ>` is `false` if the items of the request contain input data, or `true` if the items contain paths of input files.

For example, to run inference with inline data on the `object-detection` model, send a `predict` command to the `aio/inference/command/predict/model_name/object-detection/fileRead/false` topic.

The connector responds only to commands for the models that have `mrpc` settings. If no such model has the name in the topic, the command doesn't get a response, and the command invoker times out.

## predict

The `predict` command sends one or more input items to the model and returns the results.

### predict request

The request payload has the following fields:

| Field | Type | Required | Description |
|--|--|--|--|
| `items` | array | Yes | The input items. |
| `items[].data` | array of integers | Yes | The bytes of the input data, as integers from 0 to 255. If `<FILE_READ>` is `true`, the UTF-8 bytes of the path of an input file relative to the read folder of the model's data volume. |
| `items[].content_type` | string | No | The MIME type of the input data, for example `image/jpeg`. If you don't set it, the connector uses `application/json`. For a file path, the connector infers the content type from the file extension instead. |

The following example request contains one item with the JSON document `{"x":1}`:

```json
{
  "items": [
    {
      "content_type": "application/json",
      "data": [123, 34, 120, 34, 58, 49, 125]
    }
  ]
}
```

The following example request refers to the input file `images/board-01.jpg`, and is sent to a topic that ends in `fileRead/true`:

```json
{
  "items": [
    {
      "data": [105, 109, 97, 103, 101, 115, 47, 98, 111, 97, 114, 100, 45, 48, 49, 46, 106, 112, 103]
    }
  ]
}
```

How the connector sends the items to the model depends on the backend:

- **Foundry Local**: The connector sends all the items in a single `/v1/predict` request to the model deployment. The model must support the number of items in the request.
- **Azure Machine Learning**: The request must contain exactly one item. The connector sends the item's data as the body of an HTTP request to the scoring URI, with the item's content type.

File paths follow the rules in [File settings](reference-inference-connector-configuration.md#file-settings). If the model doesn't have a `data-volume`, commands with `<FILE_READ>` set to `true` fail.

### predict response

If the command succeeds, the response payload has the following fields:

| Field | Type | Description |
|--|--|--|
| `metadata.model_id` | string | The ID of the model. For a Foundry Local model, the model server reports this value. For an Azure Machine Learning model, the value is the `name` of the model in the connector configuration. |
| `metadata.batch_size` | integer | The number of items that the model processed. For an Azure Machine Learning model, the value is always `1`. |
| `metadata.inference_time_ms` | number | The inference time in milliseconds that the model server reports. For an Azure Machine Learning model, the value is always `0`. |
| `items` | array | The results. |
| `items[].content_type` | string | The MIME type of the result, for example `application/json`. |
| `items[].data` | array of integers | The bytes of the result, as integers from 0 to 255. |

If the model sets `write-response-to-disk` to `true`, the connector writes each result to a new file in the write folder of the model's data volume. In that case, the `data` field of each result item contains the UTF-8 bytes of the file name, and the content type is `text/plain`.

The following example response contains one result item with the JSON document `{"class":"cat"}`:

```json
{
  "metadata": {
    "model_id": "object-detection",
    "batch_size": 1,
    "inference_time_ms": 12.5
  },
  "items": [
    {
      "content_type": "application/json",
      "data": [123, 34, 99, 108, 97, 115, 115, 34, 58, 34, 99, 97, 116, 34, 125]
    }
  ]
}
```

If the command fails, the response payload contains a `predictError` object instead. See [Errors](#errors).

## getModelInfo

The `getModelInfo` command returns the information that the model server reports about the model. Only Foundry Local models support this command. The connector gets the information from the `/v1/model` API of the model deployment. For an Azure Machine Learning model, the command fails with the message `model info not available`.

### getModelInfo request

The request payload is an empty JSON object:

```json
{}
```

### getModelInfo response

If the command succeeds, the response payload has the following fields:

| Field | Type | Description |
|--|--|--|
| `id` | string | The ID of the model. |
| `name` | string | The name of the model. |
| `type` | string | The type of the model, for example `classification`. |
| `input_shape` | array | The dimensions of the input tensor. Each dimension has a `kind` of `Static` with a `value`, or a `kind` of `Dynamic` with a `name`, such as `batch`. |
| `outputs` | array | The outputs of the model. Each output has a `name`, a `shape` with dimensions in the same format as `input_shape`, and a `type`. |
| `batch_size` | integer | The batch size of the model. |
| `execution_provider` | string | The ONNX Runtime execution provider that runs the model, for example `CPUExecutionProvider`. |
| `status` | string | The status of the model, for example `loaded`. |
| `id2label` | object | Optional. A map from output class index, as a string, to label. |
| `label2id` | object | Optional. A map from label to output class index. |
| `preprocessor_config` | string | Optional. The preprocessing configuration of the model, serialized as a JSON string. |
| `server_capabilities` | string | Optional. The capabilities of the model server, serialized as a JSON string. |
| `validation_warnings` | array | Optional. Warnings that the model server reports about the model. Each warning is an object with string values. |
| `loading_mode` | string | Optional. The loading mode of the model. |
| `deployment_info` | object | Optional. Information about the deployment of the model, as string values. |

The following example shows a response for an image classification model:

```json
{
  "id": "resnet50",
  "name": "resnet50",
  "type": "classification",
  "input_shape": [
    { "kind": "Dynamic", "name": "batch" },
    { "kind": "Static", "value": 3 },
    { "kind": "Static", "value": 224 },
    { "kind": "Static", "value": 224 }
  ],
  "outputs": [
    {
      "name": "logits",
      "shape": [
        { "kind": "Dynamic", "name": "batch" },
        { "kind": "Static", "value": 1000 }
      ],
      "type": "tensor(float)"
    }
  ],
  "batch_size": 32,
  "execution_provider": "CPUExecutionProvider",
  "status": "loaded",
  "id2label": { "0": "cat", "1": "dog", "2": "bird" },
  "label2id": { "bird": 2, "cat": 0, "dog": 1 }
}
```

If the command fails, the response payload contains a `getModelInfoError` object instead. See [Errors](#errors).

## Errors

If a command fails, the response payload contains an error object in the `predictError` field for `predict`, or in the `getModelInfoError` field for `getModelInfo`. The error object has the following fields:

| Field | Type | Description |
|--|--|--|
| `code` | integer | The error code. The connector sets this value to `500`. |
| `message` | string | A summary of the error, for example `predict failed`. |
| `innerError.code` | string | The HTTP status code that the model endpoint returned, or `500` if the command failed for another reason. |
| `innerError.message` | string | Details about the error. If the model endpoint returned an error status, the message contains the body of the endpoint's response. |

The following example shows the response to a `predict` command that failed because the model endpoint rejected the credential:

```json
{
  "predictError": {
    "code": 500,
    "message": "predict failed",
    "innerError": {
      "code": "401",
      "message": "<RESPONSE_BODY>"
    }
  }
}
```

A command fails if the connector can't read an input file, if the model endpoint returns an error after all retries, if the connector can't write a result file, or if the model doesn't support the command. The connector retries HTTP requests to the model endpoint as described in [Retries and timeouts](reference-inference-connector-configuration.md#retries-and-timeouts).

## Concurrency and timeouts

The connector processes up to `worker-count` commands at the same time for each model, where `worker-count` is the setting in the `mrpc` settings of the model. The connector queues other commands for the model until a worker is available.

Each HTTP request to the model endpoint can take up to 30 seconds, and the connector can retry a failed request. When you set the timeout of a command invoker, allow for the inference time of your model, the time that commands wait in the queue, and the retries.

## Related content

- [Run inference in a data flow graph](howto-inference-connector-dataflow-graph.md)
- [Call the inference connector from a WASM module](howto-inference-connector-webassembly-module.md)
- [Inference connector configuration reference](reference-inference-connector-configuration.md)
- [What is the inference connector?](overview-inference-connector.md)
- [Quickstart: Start developing with the Azure IoT Operations SDKs](../../develop-edge-apps/quickstart-get-started-sdks.md)
