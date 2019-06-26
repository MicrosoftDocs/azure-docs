---
title: Install Speech containers
titleSuffix: Azure Cognitive Services
description: Details the text-to-speech helm chart configuration options.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 06/26/2019
ms.author: dapine
---

### Text-to-Speech (sub-chart: charts/textToSpeech)

> [!TIP]
> To override the "umbrella" chart, add the prefix `textToSpeech.` on any parameter to make it more specific. For example, it will override the corresponding parameter e.g. `textToSpeech.numberOfConcurrentRequest` overrides `numberOfConcurrentRequest`.

|Parameter|Description|Values|Default|
| --- | --- | --- | --- |
|`enabled`| Specifies whether enable **text-to-speech** service| true/false| `false`|
|`numberOfConcurrentRequest`| Specifies how many concurrent requests for **text-to-speech** service.<br/> This chart automatically calculate CPU and memory resources, based on this value.| int | `2` |
|`image.registry`| Specifies the **text-to-speech** docker image registry| valid docker image registry| `containerpreview.azurecr.io`|
|`image.repository`| Specifies the **text-to-speech** docker image repository| valid docker image repository| `microsoft/cognitive-services-text-to-speech`|
|`image.tag`| Specifies the **text-to-speech** docker image tag| valid docker image tag| `latest`|
|`image.pullSecrets`| Specifies the image secrets for pulling **text-to-speech** docker image| valid secrets name||
|`image.pullByHash`| Specifies if pulling docker image by hash.<br/> If `yes`, `image.hash` is required to have as well.<br/> If `no`, set it as 'false'. Default is `false`.| true/false| `false`|
|`image.hash`| Specifies **text-to-speech** docker image hash. Only use it when `image.pullByHash:true`.| valid docker image hash | |
|`image.args.eula`| One of the required arguments by **text-to-speech** container, which indicates you've accepted the license.<br/> The value of this option must be: accept| `accept`, if you want to use the container | |
|`image.args.billing`| One of the required arguments by **text-to-speech** container, which specifies the billing endpoint URI<br/> The billing endpoint URI value is available on the Azure portal's Speech Overview page.|valid billing endpoint URI||
|`image.args.apikey`| One of the required arguments by **text-to-speech** container, which is used to track billing information.| valid apikey||
|`service.type`| Specifies the type of **text-to-speech** service in Kubernetes. <br/> [Kubernetes Service Types Instruction](https://kubernetes.io/docs/concepts/services-networking/service/)<br/> Default is `LoadBalancer` (please make sure you cloud provider supports) | valid Kuberntes service type | `LoadBalancer`|
|`service.port`| Specifies the port of **text-to-speech** service| int| `80`|
|`service.autoScaler.enabled`| Specifies if enable [Horizontal Pod Autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)<br/> If enabled, `text-to-speech-autoscaler` will be deployed in the Kubernetes cluster | true/false| `true`|
|`service.podDisruption.enabled`| Specifies if enable [Pod Disruption Budget](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/)<br/> If enabled, `text-to-speech-poddisruptionbudget` will be deployed in the Kubernetes cluster| true/false| `true`|