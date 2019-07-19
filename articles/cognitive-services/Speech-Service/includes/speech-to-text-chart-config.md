---
title: Install Speech containers
titleSuffix: Azure Cognitive Services
description: Details the speech-to-text helm chart configuration options.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 06/26/2019
ms.author: dapine
---

### Speech-to-Text (sub-chart: charts/speechToText)

To override the "umbrella" chart, add the prefix `speechToText.` on any parameter to make it more specific. For example, it will override the corresponding parameter e.g. `speechToText.numberOfConcurrentRequest` overrides `numberOfConcurrentRequest`.

|Parameter|Description|Default|
| -- | -- | -- |
| `enabled` | Whether the **speech-to-text** service is enabled. | `false` |
| `numberOfConcurrentRequest` | The number of concurrent requests for the **speech-to-text** service. This chart automatically calculates CPU and memory resources, based on this value. | `2` |
| `optimizeForAudioFile`| Whether the service needs to optimize for audio input via audio files. If `true`, this chart will allocate more CPU resource to service. | `false` |
| `image.registry`| The **speech-to-text** docker image registry. | `containerpreview.azurecr.io` |
| `image.repository` | The **speech-to-text** docker image repository. | `microsoft/cognitive-services-speech-to-text` |
| `image.tag` | The **speech-to-text** docker image tag. | `latest` |
| `image.pullSecrets` | The image secrets for pulling the **speech-to-text** docker image. | |
| `image.pullByHash`| Whether the docker image is pulled by hash. If `true`, `image.hash` is required. | `false` |
| `image.hash`| The **speech-to-text** docker image hash. Only used when `image.pullByHash: true`.  | |
| `image.args.eula` (required) | Indicates you've accepted the license. The only valid value is `accept` | |
| `image.args.billing` (required) | The billing endpoint URI value is available on the Azure portal's Speech Overview page. | |
| `image.args.apikey` (required) | Used to track billing information. ||
| `service.type` | The Kubernetes service type of the **speech-to-text** service. See the [Kubernetes service types instructions](https://kubernetes.io/docs/concepts/services-networking/service/) for more details and verify cloud provider support. | `LoadBalancer` |
| `service.port`|  The port of the **speech-to-text** service. | `80` |
| `service.autoScaler.enabled` | Whether the [Horizontal Pod Autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) is enabled. If `true`, the `speech-to-text-autoscaler` will be deployed in the Kubernetes cluster. | `true` |
| `service.podDisruption.enabled` | Whether the [Pod Disruption Budget](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/) is enabled. If `true`, the `speech-to-text-poddisruptionbudget` will be deployed in the Kubernetes cluster. | `true` |