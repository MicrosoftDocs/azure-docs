---
title: Send data to a gRPC endpoint from a pipeline
description: Configure a pipeline destination stage to send the pipeline output to a gRPC endpoint for further processing.
author: dominicbetts
ms.author: dobett
# ms.subservice: data-processor
ms.topic: how-to
ms.date: 10/09/2023

#CustomerIntent: As an operator, I want to send data from a pipeline to a gRPC endpoint so that I can run custom processing on the output from the pipeline.
---

# Send data to a gRPC endpoint

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Use the _gRPC_ destination to write processed and clean data to a gRPC endpoint for further processing.

When you send data to a gRPC endpoint from a destination stage:

- Currently, the stage only supports the [Unary RPC type](https://grpc.io/docs/what-is-grpc/core-concepts/#unary-rpc).
- You can only use the [Protobuf](concept-supported-formats.md#protocol-buffers-data-format) format. You must use the [Protobuf](concept-supported-formats.md#protocol-buffers-data-format) with the gRPC call out stage.
- Currently, you can't authenticate gRPC calls.
- Because this stage is a pipeline destination, the response is discarded.

## Prerequisites

To configure and use an aggregate pipeline stage, you need:

- A deployed instance of Data Processor Preview.
- A [gRPC](https://grpc.io/docs/what-is-grpc/) server that's accessible from the Data Processor Preview instance.
- The `protoc` tool to generate the descriptor.

## Configure the destination stage

The gRPC destination stage JSON configuration defines the details of the stage. To author the stage, you can either interact with the form-based UI, or provide the JSON configuration on the **Advanced** tab:

| Name | Type | Description | Required | Default | Example |
| --- | --- | --- | --- | --- | --- |
| Name  | string | A name to show in the data processor UI.  | Yes | -  | `MLCall2` |
| Description | string | A user-friendly description of the destination stage.  | No |   | `Call ML endpoint 2` |
| Server address | String | The gRPC server address | Yes | - | `https://localhost:1313` |
| RPC name | string | The RPC name to call| Yes | - | `GetInsights` |
| Descriptor<sup>1</sup> | String | The base 64 encoded descriptor | Yes | - | `CuIFChxnb29nb` |
| API request&nbsp;>&nbsp;Body path | [Path](concept-configuration-patterns.md#path) | The path to the portion of the data processor message that should be serialized and set as the request body. Leave empty if you don't need to send a request body. | No | - | `.payload.gRPCRequest` |
| API request&nbsp;>&nbsp;Metadata&nbsp;>&nbsp;Key<sup>2</sup> | [Static/Dynamic field](concept-configuration-patterns.md#static-and-dynamic-fields) | The metadata key to set in the request. | No |  | [Static/Dynamic field](concept-configuration-patterns.md#static-and-dynamic-fields) |
| API request&nbsp;>&nbsp;Metadata&nbsp;>&nbsp;Value<sup>2</sup> | [Static/Dynamic field](concept-configuration-patterns.md#static-and-dynamic-fields) | The metadata value to set in the request. | No |  | [Static/Dynamic field](concept-configuration-patterns.md#static-and-dynamic-fields) |

**Descriptor<sup>1</sup>**: To serialize the request body, you need a base 64 encoded descriptor of the .proto file.

Use the following command to generate the descriptor, replace `<proto-file>` with the name of your .proto file:

```bash
protoc --descriptor_set_out=/dev/stdout --include_imports <proto-file> | base64 | tr '\n' ' ' | sed 's/[[:space:]]//g'
```

Use the output from the previous command as the `descriptor` in the configuration.

**API request&nbsp;>&nbsp;Metadata<sup>2</sup>**: Each element in the metadata array is a key value pair. You can set the key or value dynamically based on the content of the incoming message or as a static string.

## Related content

- [Send data to Azure Data Explorer](../connect-to-cloud/howto-configure-destination-data-explorer.md)
- [Send data to Microsoft Fabric](../connect-to-cloud/howto-configure-destination-fabric.md)
- [Publish data to an MQTT broker](howto-configure-destination-mq-broker.md)
- [Send data to the reference data store](howto-configure-destination-reference-store.md)
