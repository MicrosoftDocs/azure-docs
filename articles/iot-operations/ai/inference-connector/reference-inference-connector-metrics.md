---
title: Metrics for the inference connector (preview)
description: Available observability metrics for the Azure IoT Operations inference connector to monitor the health and performance of your inference workloads.
author: jkarangula
ms.author: jkarangula
ms.service: azure-iot-operations
ms.subservice: azure-akri
ms.topic: reference
ms.date: 09/30/2026
ai-usage: ai-assisted

#CustomerIntent: As an IT admin or operator, I want to monitor the inference connector so that I can track the health and performance of my inference workloads.
---

# Metrics for the inference connector (preview)

The inference connector emits the following metrics to help you monitor the health and performance of your inference workloads. It exports them through the Azure IoT Operations observability configuration. To collect them, see [Deploy observability resources and set up logs](../../deploy-iot-ops/howto-configure-observability.md).

[!INCLUDE [inference-connector-preview-note](../../includes/inference-connector-preview-note.md)]

## Inference connector metrics

| Metric | Type | Description | Dimensions |
|--------|------|-------------|------------|
| aio_inference_heartbeat | Counter | Liveness counter that the connector increments every 30 seconds. | [`version`](#version) |
| aio_inference_request_received | Counter | Incremented once when a request arrives, and once more if the request fails. Only failure increments carry the [`error_code`](#error_code) dimension, so filter on `error_code` instead of adding up all series. | [`model`](#model), [`ingress`](#ingress), [`error_code`](#error_code) on failures |
| aio_inference_request_latency | Histogram | End-to-end latency in milliseconds of successful requests, from arrival until the connector publishes or returns the result. The histogram count is the number of completed requests. | [`model`](#model), [`ingress`](#ingress) |
| aio_inference_predict_latency | Histogram | Latency in milliseconds of calls to the model endpoint, including retries and the backoff between them. | [`model`](#model), [`success`](#success) |

To count successful requests, use the count of `aio_inference_request_latency`. There's no separate counter for completed requests.

Arrivals can exceed the sum of completed and failed requests:

- If the connector can't publish the result of an MQTT request, for example during a broker outage, it doesn't count a failure. The broker delivers the request again, and the connector counts another arrival.
- Successful `getModelInfo` commands count as arrivals, but don't appear in `aio_inference_request_latency`. Failed ones count as failures with the `model_info` error code.

## Dimensions

Dimensions listed as links in the table are described in this section.

### Model

The name of the model that the metric applies to, as set in the `name` setting of the model in the inference connector configuration.

### Ingress

The path that an inference request arrived on. Possible values:

- `pubsub`: An MQTT message on one of the model's source topics.
- `mrpc`: A `predict` or `getModelInfo` command, for example from a data flow graph.

### error_code

The stage of processing that failed. The connector sets this dimension only on the failure series of `aio_inference_request_received`. Possible values:

- `disk_read`: The connector couldn't read the input file of a request from the mounted volume.
- `predict`: The call to the model endpoint failed.
- `disk_write`: The connector couldn't write the result to the mounted volume.
- `response`: The model endpoint returned a result, but the connector couldn't use it or couldn't return it to the requester.
- `model_info`: The connector couldn't get information about the model from the model endpoint. This value applies only to `getModelInfo` commands.

### Success

A Boolean string, `"true"` or `"false"`, that indicates whether the call to the model endpoint succeeded.

### Version

The version of the inference connector.

## Related content

- [What is the inference connector?](overview-inference-connector.md)
- [Troubleshoot the inference connector](troubleshoot-inference-connector.md)
- [Deploy observability resources and set up logs](../../deploy-iot-ops/howto-configure-observability.md)
