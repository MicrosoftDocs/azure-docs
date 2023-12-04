---
title: Call an HTTP endpoint from a pipeline
description: Configure an HTTP call out pipeline stage to make an HTTP request from a pipeline to incorporate custom processing logic.
author: dominicbetts
ms.author: dobett
# ms.subservice: data-processor
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 10/03/2023

#CustomerIntent: As an operator, I want to call an HTTP endpoint from within a pipeline stage so that I can incorporate custom processing logic.
---

# Call out to an HTTP endpoint from a pipeline

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Use the _HTTP call out_ stage to call an external HTTP endpoint  with an optional request body and receive an optional response. The call out stage lets you incorporate custom data processing logic, such as running machine learning models, into the pipeline processing.

- Each partition in a pipeline independently executes the HTTP calls in parallel.
- HTTP calls are synchronous, the stage waits for the call to return before continuing with further pipeline processing.

## Prerequisites

To configure and use an aggregate pipeline stage, you need a:

- Deployed instance of Azure IoT Data Processor (preview).
- An HTTP server that's accessible from the Data Processor instance.

## Configure an HTTP call out stage

The HTTP call out stage JSON configuration defines the details of the stage. To author the stage, you can either interact with the form-based UI, or provide the JSON configuration on the **Advanced** tab:

| Name | Type | Description | Required | Default | Example |
| --- | --- | --- | --- | --- | --- |
| Name  | string | A name to show in the Data Processor UI.  | Yes | -  | `MLCall1` |
| Description | string | A user-friendly description of what the call out stage does.  | No |   | `Call ML endpoint 1` |
| Method | string enum | The HTTP method.  | No | `POST` | `GET` |
| URL | string | The HTTP URL. | Yes | - | `http://localhost:8080` |
| Authentication | string | The authentication type to use. `None`/`Username/Password`/`Header`. | Yes | `None` | `None` |
| Username | string | The username to use when `Authentication` is set to `Username/Password`. | No | - | `myusername` |
| Secret | string | The [secret reference](../deploy-iot-ops/howto-manage-secrets.md) for the password to use when `Authentication` is set to `Username/Password`. | No | - | `mysecret` |
| Header key | string | The header key to use when `Authentication` is set to `Header`. The value must be `authorization`. | No | `authorization` | `authorization` |
| Secret | string | The [secret reference](../deploy-iot-ops/howto-manage-secrets.md) to use when `Authentication` is set to `Header`. | No | - | `mysecret` |
| API Request&nbsp;>&nbsp;Data Format | string | The format the request body should be in and any serialization details.  | No | - | `JSON` |
| API Request&nbsp;>&nbsp;Path | [Path](concept-configuration-patterns.md#path) | The [Path](concept-configuration-patterns.md#path) to the property in the incoming message to send as the request body. Leave empty if you don't need to send a request body. | No | - | `.payload.httpPayload` |
| API request&nbsp;>&nbsp;Header&nbsp;>&nbsp;Key<sup>1</sup> | [Static/Dynamic field](concept-configuration-patterns.md#static-and-dynamic-fields) | The header key to set in the request. | No |  | [Static/Dynamic field](concept-configuration-patterns.md#static-and-dynamic-fields) |
| API request&nbsp;>&nbsp;Header&nbsp;>&nbsp;Value<sup>1</sup> | [Static/Dynamic field](concept-configuration-patterns.md#static-and-dynamic-fields) | The header value to set in the request. | No |  | [Static/Dynamic field](concept-configuration-patterns.md#static-and-dynamic-fields) |
| API Response&nbsp;>&nbsp;Data Format | string | The format the response body is in and any deserialization details. | No | - | `JSON` |
| API Response&nbsp;>&nbsp;Path | [Path](concept-configuration-patterns.md#path) | The [Path](concept-configuration-patterns.md#path) to the property in the outgoing message to store the response in. Leave empty if you don't need the response body.  | No | - | `.payload.httpResponse` |
| API Response&nbsp;>&nbsp;Header | Path | The [Path](concept-configuration-patterns.md#path) to the property in the outgoing message to store the response header in. Leave empty if you don't need the response metadata. | No | - | `.payload.httpResponseHeader` |
| API Response&nbsp;>&nbsp;Status | Path | The [Path](concept-configuration-patterns.md#path) to the property in the outgoing message to store the response status in. Leave empty if you don't need the response status. | No | - | `.payload.httpResponseStatus` |

**API request&nbsp;>&nbsp;Header<sup>1</sup>**: Each element in the header array is a key value pair. You can set the key or value dynamically based on the content of the incoming message or as a static string.

### Message formats

You can use the HTTP call out stage with any data format. Use the built-in serializer and deserializer to serialize and deserialize the supported data [formats](concept-supported-formats.md). Use `Raw` to handle other data formats.

### Authentication

Currently, only header based authentication is supported.

## Related content

- [Aggregate data in a pipeline](howto-configure-aggregate-stage.md)
- [Enrich data in a pipeline](howto-configure-enrich-stage.md)
- [Filter data in a pipeline](howto-configure-filter-stage.md)
- [Call out to a gRPC endpoint from a pipeline](howto-configure-grpc-callout-stage.md)
- [Use last known values in a pipeline](howto-configure-lkv-stage.md)
- [Transform data in a pipeline](howto-configure-transform-stage.md)
