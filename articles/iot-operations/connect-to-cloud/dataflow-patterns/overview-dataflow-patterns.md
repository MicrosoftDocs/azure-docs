---
title: Common use cases and patterns for data flow graphs
description: Choose data flow graph patterns for enrichment, correlation, noise reduction, routing, prediction, and model updates.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: concept-article
ms.date: 10/21/2026
ai-usage: ai-assisted

#customer intent: As a solution developer, I want to choose a data flow graph pattern based on my inputs and required outputs so that I can implement the appropriate data processing pattern.
---

# Common use cases and patterns for data flow graphs

Choose a pattern based on the input you have and the output you need. All example values are synthetic.

| Goal | Operation | Implementation |
| --- | --- | --- |
| [Add context to readings](howto-add-context.md) | Look up the latest record by asset ID | Built-in enrichment; an application maintains the state store |
| [Align and correlate records](howto-align-correlate.md) | Match readings by timestamp or item ID | Custom stateful sample or an external service |
| [Noise reduction](howto-reduce-noise.md) | Average a nonoverlapping batch | Built-in tumbling window |
| [Route readings by severity](howto-route-by-severity.md) | Filter impossible readings and route by severity | Built-in filter, branch, map, and concatenate |
| [Route more than two message kinds](howto-route-message-kinds.md) | Select a path for each message kind, then merge paths | Built-in branch and concatenate |
| [Route invalid messages to a dead-letter queue](howto-route-invalid-messages.md) | Separate rejected payloads for a consumer to retain | Built-in branch, map, and concatenate |
| [Model prediction and updates](#model-prediction-and-updates) | Evaluate a model, manage its parameters, or deliver an update | Choose an independent pattern below |

## Model prediction and updates

Choose an independent pattern for prediction, fitting, or delivery. Combine them as needed.

| Pattern | Use when |
| --- | --- |
| [Calculate a prediction with known coefficients](howto-predict-known-coefficients.md) | You need to evaluate an existing formula, using parameters in the message or retrieved through enrichment |
| [Fit and activate an approved model](howto-adapt-models.md) | Your application needs to fit and approve new parameters, then persist the complete active-model record |
| [Deliver approved model updates through MQTT](howto-deliver-model-updates.md) | You need to send approved coefficients to a custom predictor for later readings |

## Prerequisites

Start with an existing Azure IoT Operations deployment, a data flow profile, and an MQTT endpoint with broker access. Follow [Create a data flow graph](../howto-create-dataflow-graph.md) to configure them.

The examples use profile `default` and MQTT endpoint `factory-mqtt` in namespace `azure-iot-operations`. Built-in transforms use the `default` registry endpoint.

For custom patterns, use the ready-to-apply manifests or Helm chart in the [Azure Samples deployment instructions](https://github.com/Azure-Samples/explore-iot-operations/blob/huguesBouvier/dataflow-pattern-samples/samples/wasm/README.md#data-flow-pattern-samples), including registry setup and single-instance deployment. To check for sensor silence, configure the [clock publisher](https://github.com/Azure-Samples/explore-iot-operations/blob/huguesBouvier/dataflow-pattern-samples/samples/wasm/README.md#supply-clock-events-during-sensor-silence) against your existing broker.
