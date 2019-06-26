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

> [!TIP]
> To override the "umbrella" chart, add the prefix `speechToText.` on any parameter to make it more specific. For example, it will override the corresponding parameter e.g. `speechToText.numberOfConcurrentRequest` overrides `numberOfConcurrentRequest`.

|Parameter|Description|Values|Default|
| --- | --- | --- | --- |
|`enabled`| Specifies whether enable **speech-to-text** service| true/false| `false`|
|`numberOfConcurrentRequest`| Specifies how many concurrent requests for **speech-to-text** service.<br/> This chart automatically calculate CPU and memory resources, based on this value.| int | `2` |
|`optimizeForAudioFiles`| Specifies if service needs to optimize for audio input via audio files. <br/> If `yes`, this chart will allocate more CPU resource to service. <br/> Default is `false`| true/false |`false`|
|`image.registry`| Specifies the **speech-to-text** docker image registry| valid docker image registry| `containerpreview.azurecr.io`|
|`image.repository`| Specifies the **speech-to-text** docker image repository| valid docker image repository| `microsoft/cognitive-services-speech-to-text`|
|`image.tag`| Specifies the **speech-to-text** docker image tag| valid docker image tag| `latest`|
|`image.pullSecrets`| Specifies the image secrets for pulling **speech-to-text** docker image| valid secrets name| |
|`image.pullByHash`| Specifies if pulling docker image by hash.<br/> If `yes`, `image.hash` is required to have as well.<br/> If `no`, set it as 'false'. Default is `false`.| true/false| `false`|
|`image.hash`| Specifies **speech-to-text** docker image hash. Only use it when `image.pullByHash:true`.| valid docker image hash | |
|`image.args.eula`| One of the required arguments by **speech-to-text** container, which indicates you've accepted the license.<br/> The value of this option must be: accept| `accept`, if you want to use the container | |
|`image.args.billing`| One of the required arguments by **speech-to-text** container, which specifies the billing endpoint URI<br/> The billing endpoint URI value is available on the Azure portal's Speech Overview page.|valid billing endpoint URI||
|`image.args.apikey`| One of the required arguments by **speech-to-text** container, which is used to track billing information.| valid apikey||
|`service.type`| Specifies the type of **speech-to-text** service in Kubernetes. <br/> [Kubernetes Service Types Instruction](https://kubernetes.io/docs/concepts/services-networking/service/)<br/> Default is `LoadBalancer` (please make sure you cloud provider supports) | valid Kuberntes service type | `LoadBalancer`|
|`service.port`| Specifies the port of **speech-to-text** service| int| `80`|
|`service.autoScaler.enabled`| Specifies if enable [Horizontal Pod Autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)<br/> If enabled, `speech-to-text-autoscaler` will be deployed in the Kubernetes cluster | true/false| `true`|
|`service.podDisruption.enabled`| Specifies if enable [Pod Disruption Budget](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/)<br/> If enabled, `speech-to-text-poddisruptionbudget` will be deployed in the Kubernetes cluster| true/false| `true`|