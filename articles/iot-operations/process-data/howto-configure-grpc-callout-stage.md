---
title: Call a gRPC endpoint from a pipeline
description: Configure a gRPC call out pipeline stage to make an HTTP request from a pipeline to incorporate custom processing logic.
author: dominicbetts
ms.author: dobett
# ms.subservice: data-processor
ms.topic: how-to
ms.date: 10/09/2023

#CustomerIntent: As an operator, I want to call a gRPC endpoint from within a pipeline stage so that I can incorporate custom processing logic.
---

# Call out to a gRPC endpoint from a pipeline

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Use the _gRPC call out_ stage to call an external [gRPC](https://grpc.io/docs/what-is-grpc/) with an optional request body and receive an optional response. The call out stage lets you incorporate custom data processing logic, such as running machine learning models, into the pipeline processing.

- Each partition in a pipeline independently executes the API calls in parallel.
- API calls are synchronous, the stage waits for the call to return before continuing with further pipeline processing.
- Currently, the stage only supports the [Unary RPC type](https://grpc.io/docs/what-is-grpc/core-concepts/#unary-rpc).
- gRPC call out can only be used with the [Protobuf](concept-supported-formats.md#protocol-buffers-data-format) format. You must use the [Protobuf](concept-supported-formats.md#protocol-buffers-data-format) with the gRPC call out stage.
- Currently, you can't authenticate gRPC calls.

## Prerequisites

To configure and use a gRPC cal lout pipeline stage, you need:

- A deployed instance of Data Processor Preview.
- A [gRPC](https://grpc.io/docs/what-is-grpc/) server that's accessible from the Data Processor Preview instance.
- The `protoc` tool to generate the descriptor.

## Configure a gRPC call out stage

The gRPC call out stage JSON configuration defines the details of the stage. To author the stage, you can either interact with the form-based UI, or provide the JSON configuration on the **Advanced** tab.

| Name | Type | Description | Required | Default | Example |
| ---- | ---- | ----------- | -------- | ------- | ------- |
| Name           | string | A name to show in the data processor UI.  | Yes | -  | `MLCall2` |
| Description    | string | A user-friendly description of what the call out stage does.  | No |   | `Call ML endpoint 2` |
| Server address | String | The gRPC server address. | Yes | - | `https://localhost:1313` |
| RPC name       | string | The RPC name to call| Yes | - | `GetInsights` |
| Descriptor<sup>1</sup>            | string | The base 64 encoded descriptor.  | Yes | - | `CuIFChxnb29nb` |
| API request&nbsp;>&nbsp;Body path | [Path](concept-configuration-patterns.md#path) | The path to the portion of the data processor message that should be serialized and set as the request body. Leave empty if you don't need to send a request body. | No | - | `.payload.gRPCRequest` |
| API request&nbsp;>&nbsp;Metadata&nbsp;>&nbsp;Key<sup>2</sup> | [Static/Dynamic field](concept-configuration-patterns.md#static-and-dynamic-fields) | The metadata key to set in the request. | No |  | [Static/Dynamic field](concept-configuration-patterns.md#static-and-dynamic-fields) |
| API request&nbsp;>&nbsp;Metadata&nbsp;>&nbsp;Value<sup>2</sup> | [Static/Dynamic field](concept-configuration-patterns.md#static-and-dynamic-fields) | The metadata value to set in the request. | No |  | [Static/Dynamic field](concept-configuration-patterns.md#static-and-dynamic-fields) |
| API response&nbsp;>&nbsp;Body path | [Path](concept-configuration-patterns.md#path) | The [Path](concept-configuration-patterns.md#path) to the property in the outgoing message to store the response in. Leave empty if you don't need the response body. | No | - | `.payload.gRPCResponse` |
| API Response&nbsp;>&nbsp;Metadata | Path | The [Path](concept-configuration-patterns.md#path) to the property in the outgoing message to store the response metadata in. Leave empty if you don't need the response metadata. | No | - | `.payload.gRPCResponseHeader` |
| API Response&nbsp;>&nbsp;Status | Path | The [Path](concept-configuration-patterns.md#path) to the property in the outgoing message to store the response status in. Leave empty if you don't need the response status. | No | - | `.payload.gRPCResponseStatus` |

**Descriptor<sup>1</sup>**: Because the gRPC call out stage only supports the protobuf format, you use the same format definitions for both request and response. To serialize the request body and deserialize the response body, you need a base 64 encoded descriptor of the .proto file.

Use the following command to generate the descriptor, replace `<proto-file>` with the name of your .proto file:

```bash
protoc --descriptor_set_out=/dev/stdout --include_imports <proto-file> | base64 | tr '\n' ' ' | sed 's/[[:space:]]//g'
```

Use the output from the previous command as the `descriptor` in the configuration.

**API request&nbsp;>&nbsp;Metadata<sup>2</sup>**: Each element in the metadata array is a key value pair. You can set the key or value dynamically based on the content of the incoming message or as a static string.

## Related content

- [Aggregate data in a pipeline](howto-configure-aggregate-stage.md)
- [Enrich data in a pipeline](howto-configure-enrich-stage.md)
- [Filter data in a pipeline](howto-configure-filter-stage.md)
- [Call out to an HTTP endpoint from a pipeline](howto-configure-http-callout-stage.md)
- [Use last known values in a pipeline](howto-configure-lkv-stage.md)
- [Transform data in a pipeline](howto-configure-transform-stage.md)
