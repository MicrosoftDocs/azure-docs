---
title: What is the inference connector (preview)?
description: Learn how the Azure IoT Operations inference connector runs machine learning inference on edge data by calling Foundry Local and Azure Machine Learning models.
author: jkarangula
ms.author: jkarangula
ms.service: azure-iot-operations
ms.subservice: azure-akri
ms.topic: overview
ms.date: 10/08/2026
ai-usage: ai-assisted

#CustomerIntent: As a solution architect, I want to understand how the inference connector works so that I can decide how to add machine learning inference to my Azure IoT Operations data pipelines.
---

# What is the inference connector (preview)?

The *inference connector* runs predictive machine learning (ML) inference on the data in your Azure IoT Operations solution. It receives requests through the MQTT broker, calls a model that Foundry Local or Azure Machine Learning hosts, and returns the result through the broker. Use it to add capabilities like image classification, object detection, and anomaly detection to your data pipelines, without writing code that calls model APIs.

[!INCLUDE [inference-connector-preview-note](../../includes/inference-connector-preview-note.md)]

## How the inference connector works

The following diagram shows the components that take part in an inference request:

:::image type="content" source="media/inference-connector-architecture.svg" alt-text="Architecture diagram of an application and a data flow graph sending inference requests through the MQTT broker to the inference connector, which calls Foundry Local or Azure Machine Learning over HTTPS and can use a shared volume." lightbox="media/inference-connector-architecture.svg" border="false":::

1. A request reaches the connector through the MQTT broker. Either an MQTT client publishes a message to a *source topic* of a model, or the *inference transform* in a data flow graph sends a `predict` command.
1. The connector gets the input data from the request payload, or from a file on a shared volume that the payload names.
1. The connector calls the model endpoint with the credential that you configure for the model.
1. The connector publishes the result to the model's *target topic*, or returns it to the data flow graph.

One connector serves one or more models, each with its own endpoint, credential, and request settings. You deploy the connector as an Azure IoT Operations application by using Bicep. To get started, see [Deploy the inference connector](howto-deploy-inference-connector.md).

## Supported model backends

| Backend | `inference-provider` value | What the connector calls | Authentication |
|--|--|--|--|
| [Foundry Local](/azure/azure-sovereign-clouds/private/foundry-local/overview) | `FoundryLocal` | The predictive inference (`/v1/predict`) and model information (`/v1/model`) APIs of a model deployment. | Kubernetes service account token or API key |
| [Azure Machine Learning online endpoint](/azure/machine-learning/concept-endpoints-online) | `AmlStudio` | The scoring URI, with the input data as the request body. | Endpoint key or Azure Machine Learning token |

The connector works with predictive models, such as ONNX image classification and object detection models. It doesn't call generative APIs such as chat completions. Foundry Local preprocesses image inputs and returns the raw output of the model, such as a tensor, so plan to postprocess results in your application or data flow graph.

## Ways to send inference requests

| Aspect | MQTT topics | Data flow graphs |
|--|--|--|
| Best for | Applications that publish input data and consume results themselves. | Inference as one step of a data pipeline, with transforms before and after it. |
| How requests arrive | An MQTT client publishes a message to a source topic of the model. | The inference transform sends a `predict` command for each message. |
| Where results go | The connector publishes each result to the model's target topic. | The transform replaces the message payload with the result. |
| Model setting | `pub-sub` | `mrpc` |
| Learn more | [Send inference requests over MQTT](howto-inference-connector-mqtt.md) | [Run inference in a data flow graph](howto-inference-connector-dataflow-graph.md) |

To prepare the input and use the result in your own code in a data flow graph, write a WebAssembly (WASM) module that sends the commands. See [Call the inference connector from a WASM module](howto-inference-connector-webassembly-module.md).

Either way, a request carries its input data *inline* in the message payload, or the relative path of an input *file* on a persistent volume that the connector mounts. File-based requests keep large inputs, such as high-resolution images, out of the MQTT broker. A model can also write its results to files.

## Security

- **MQTT broker**: The connector connects to the default listener of the MQTT broker with TLS and Kubernetes service account token (SAT) authentication. Azure IoT Operations configures this connection.
- **Model endpoints**: For Foundry Local models, the connector authenticates with a service account token that Azure IoT Operations provides. For Azure Machine Learning models, it reads the key or token from a Kubernetes secret that you provide. The connector validates the endpoint's TLS certificate with a trust bundle, and uses rotated credentials without a restart.
- **Files**: The connector reads request files only from the folder that you configure for the model. It rejects absolute paths, `..` segments, and symbolic links that point outside that folder.

## Related content

- [Deploy the inference connector](howto-deploy-inference-connector.md)
- [Send inference requests over MQTT](howto-inference-connector-mqtt.md)
- [Run inference in a data flow graph](howto-inference-connector-dataflow-graph.md)
- [Run inference on camera images captured by the media connector](howto-media-connector-inference.md)
- [Inference connector configuration reference](reference-inference-connector-configuration.md)
