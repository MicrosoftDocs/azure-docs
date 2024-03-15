---
title: Install Speech containers
titleSuffix: Azure AI services
description: Details the speech to text helm chart configuration options.
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: include
ms.date: 05/05/2020
ms.author: eur
---

### Speech to text (sub-chart: charts/speechToText)

To override the "umbrella" chart, add the prefix `speechToText.` on any parameter to make it more specific. For example, it will override the corresponding parameter for example, `speechToText.numberOfConcurrentRequest` overrides `numberOfConcurrentRequest`.

|Parameter|Description|Default|
| -- | -- | -- |
| `enabled` | Whether the **speech to text** service is enabled. | `false` |
| `numberOfConcurrentRequest` | The number of concurrent requests for the **speech to text** service. This chart automatically calculates CPU and memory resources, based on this value. | `2` |
| `optimizeForAudioFile`| Whether the service needs to optimize for audio input via audio files. If `true`, this chart will allocate more CPU resource to service. | `false` |
| `image.registry`| The **speech to text** docker image registry. | `containerpreview.azurecr.io` |
| `image.repository` | The **speech to text** docker image repository. | `microsoft/cognitive-services-speech-to-text` |
| `image.tag` | The **speech to text** docker image tag. | `latest` |
| `image.pullSecrets` | The image secrets for pulling the **speech to text** docker image. | |
| `image.pullByHash`| Whether the docker image is pulled by hash. If `true`, `image.hash` is required. | `false` |
| `image.hash`| The **speech to text** docker image hash. Only used when `image.pullByHash: true`.  | |
| `image.args.eula` (required) | Indicates you've accepted the license. The only valid value is `accept` | |
| `image.args.billing` (required) | The billing endpoint URI value is available on the Azure portal's Speech Overview page. | |
| `image.args.apikey` (required) | Used to track billing information. ||
| `service.type` | The Kubernetes service type of the **speech to text** service. See the [Kubernetes service types instructions](https://kubernetes.io/docs/concepts/services-networking/service/) for more details and verify cloud provider support. | `LoadBalancer` |
| `service.port`|  The port of the **speech to text** service. | `80` |
| `service.annotations` | The **speech to text** annotations for the service metadata. Annotations are key value pairs. <br>`annotations:`<br>&nbsp;&nbsp;`some/annotation1: value1`<br>&nbsp;&nbsp;`some/annotation2: value2` | |
| `service.autoScaler.enabled` | Whether the [Horizontal Pod Autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) is enabled. If `true`, the `speech-to-text-autoscaler` will be deployed in the Kubernetes cluster. | `true` |
| `service.podDisruption.enabled` | Whether the [Pod Disruption Budget](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/) is enabled. If `true`, the `speech-to-text-poddisruptionbudget` will be deployed in the Kubernetes cluster. | `true` |

#### Sentiment analysis (sub-chart: charts/speechToText)

Starting with v2.2.0 of the speech to text container and v0.2.0 of the Helm chart, the following parameters are used for sentiment analysis using the Language service API.

|Parameter|Description|Values|Default|
| --- | --- | --- | --- |
|`textanalytics.enabled`| Whether the **text-analytics** service is enabled| true/false| `false`|
|`textanalytics.image.registry`| The **text-analytics** docker image registry| valid docker image registry| |
|`textanalytics.image.repository`| The **text-analytics** docker image repository| valid docker image repository| |
|`textanalytics.image.tag`| The **text-analytics** docker image tag| valid docker image tag| |
|`textanalytics.image.pullSecrets`| The image secrets for pulling **text-analytics** docker image| valid secrets name| |
|`textanalytics.image.pullByHash`| Specifies if you are pulling docker image by hash.  If `yes`, `image.hash` is required to have as well. If `no`, set it as 'false'. Default is `false`.| true/false| `false`|
|`textanalytics.image.hash`| The **text-analytics** docker image hash. Only use it with `image.pullByHash:true`.| valid docker image hash | |
|`textanalytics.image.args.eula`| One of the required arguments by **text-analytics** container, which indicates you've accepted the license. The value of this option must be: `accept`.| `accept`, if you want to use the container | |
|`textanalytics.image.args.billing`| One of the required arguments by **text-analytics** container, which specifies the billing endpoint URI. The billing endpoint URI value is available on the Azure portal's Speech Overview page.|valid billing endpoint URI||
|`textanalytics.image.args.apikey`| One of the required arguments by **text-analytics** container, which is used to track billing information.| valid apikey||
|`textanalytics.cpuRequest`| The requested CPU for **text-analytics** container| int| `3000m`|
|`textanalytics.cpuLimit`| The limited CPU for **text-analytics** container| | `8000m`|
|`textanalytics.memoryRequest`| The requested memory for **text-analytics** container| | `3Gi`|
|`textanalytics.memoryLimit`| The limited memory for **text-analytics** container| | `8Gi`|
|`textanalytics.service.sentimentURISuffix`| The sentiment analysis URI suffix, the whole URI is in format "http://`<service>`:`<port>`/`<sentimentURISuffix>`". | | `text/analytics/v3.0-preview/sentiment`|
|`textanalytics.service.type`| The type of **text-analytics** service in Kubernetes. See [Kubernetes service types](https://kubernetes.io/docs/concepts/services-networking/service/) | valid Kubernetes service type | `LoadBalancer` |
|`textanalytics.service.port`| The port of the **text-analytics** service| int| `50085`|
|`textanalytics.service.annotations`| The annotations users can add to **text-analytics** service metadata. For instance:<br/> **annotations:**<br/>`   ` **some/annotation1: value1**<br/>`  ` **some/annotation2: value2** | annotations, one per each line| |
|`textanalytics.serivce.autoScaler.enabled`| Whether [Horizontal Pod Autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) is enabled. If enabled, `text-analytics-autoscaler` will be deployed in the Kubernetes cluster | true/false| `true`|
|`textanalytics.service.podDisruption.enabled`| Whether [Pod Disruption Budget](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/) is enabled. If enabled, `text-analytics-poddisruptionbudget` will be deployed in the Kubernetes cluster| true/false| `true`|
