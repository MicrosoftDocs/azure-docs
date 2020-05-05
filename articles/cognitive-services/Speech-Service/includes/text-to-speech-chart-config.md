---
title: Install Speech containers
titleSuffix: Azure Cognitive Services
description: Details the text-to-speech helm chart configuration options.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 04/01/2020
ms.author: aahi
---

### Text-to-Speech (sub-chart: charts/textToSpeech)

To override the "umbrella" chart, add the prefix `textToSpeech.` on any parameter to make it more specific. For example, it will override the corresponding parameter for example, `textToSpeech.numberOfConcurrentRequest` overrides `numberOfConcurrentRequest`.

|Parameter|Description|Default|
| -- | -- | -- |
| `enabled` | Whether the **text-to-speech** service is enabled. | `false` |
| `numberOfConcurrentRequest` | The number of concurrent requests for the **text-to-speech** service. This chart automatically calculates CPU and memory resources, based on this value. | `2` |
| `optimizeForTurboMode`| Whether the service needs to optimize for text input via text files. If `true`, this chart will allocate more CPU resource to service. | `false` |
| `image.registry`| The **text-to-speech** docker image registry. | `containerpreview.azurecr.io` |
| `image.repository` | The **text-to-speech** docker image repository. | `microsoft/cognitive-services-text-to-speech` |
| `image.tag` | The **text-to-speech** docker image tag. | `latest` |
| `image.pullSecrets` | The image secrets for pulling the **text-to-speech** docker image. | |
| `image.pullByHash`| Whether the docker image is pulled by hash. If `true`, `image.hash` is required. | `false` |
| `image.hash`| The **text-to-speech** docker image hash. Only used when `image.pullByHash: true`.  | |
| `image.args.eula` (required) | Indicates you've accepted the license. The only valid value is `accept` | |
| `image.args.billing` (required) | The billing endpoint URI value is available on the Azure portal's Speech Overview page. | |
| `image.args.apikey` (required) | Used to track billing information. ||
| `service.type` | The Kubernetes service type of the **text-to-speech** service. See the [Kubernetes service types instructions](https://kubernetes.io/docs/concepts/services-networking/service/) for more details and verify cloud provider support. | `LoadBalancer` |
| `service.port`|  The port of the **text-to-speech** service. | `80` |
| `service.annotations` | The **text-to-speech** annotations for the service metadata. Annotations are key value pairs. <br>`annotations:`<br>&nbsp;&nbsp;`some/annotation1: value1`<br>&nbsp;&nbsp;`some/annotation2: value2` | |
| `service.autoScaler.enabled` | Whether the [Horizontal Pod Autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) is enabled. If `true`, the `text-to-speech-autoscaler` will be deployed in the Kubernetes cluster. | `true` |
| `service.podDisruption.enabled` | Whether the [Pod Disruption Budget](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/) is enabled. If `true`, the `text-to-speech-poddisruptionbudget` will be deployed in the Kubernetes cluster. | `true` |