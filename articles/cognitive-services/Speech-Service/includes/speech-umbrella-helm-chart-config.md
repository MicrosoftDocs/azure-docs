---
title: Install Speech containers
titleSuffix: Azure Cognitive Services
description: Details the speech umbrella helm chart configuration options.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 06/26/2019
ms.author: dapine
---

### Speech (umbrella chart)

> [!NOTE]
> Values in the top-level "umbrella" chart override the corresponding sub-chart values. Therefore, all on-premises customized values should be added here.

|Parameter|Description|Values|Default|
| --- | --- | --- | --- |
|`speechToText.enabled`|Specifies whether enable **speech-to-text** service| true/false| `true` |
|`speechToText.verification.enabled`| Specifies whether enable `helm test` capability for **speech-to-text** service | true/false | `true` |
|`speechToText.verification.image.registry`| Specifies docker image repository that `helm test` uses to test **speech-to-text** service. Helm creates separate pod inside the cluster for testing and pulls the test-use image from this registry| valid docker registry | `docker.io` (default test-use image is published here) |
|`speechToText.verification.image.repository`| Specifies docker image repository that `helm test` uses to test **speech-to-text** service. Helm test pod uses this repository to pull test-use image| valid docker image repository |`antsu/on-prem-client`|
|`speechToText.verification.image.tag`| Specifies docker image tag that used `helm test` for **speech-to-text** service. Helm test pod uses this tag to pull test-use image | valid docker image tag | `latest`|
|`speechToText.verification.image.pullByHash`| Specifies whether test-use docker image is pulled by hash.<br/> If `yes`, `speechToText.verification.image.hash` should be added, with valid image hash value. <br/> It's `false` by default.|true/false| `false`|
|`speechToText.verification.image.arguments`| Specifies the arguments to execute test-use docker image. Helm test pod passes these arguments to container when running `helm test`| valid arguments as the test docker image requires |`"./speech-to-text-client"`<br/> `"./audio/whatstheweatherlike.wav"` <br/> `"--expect=What's the weather like"`<br/>`"--host=$(SPEECH_TO_TEXT_HOST)"`<br/>`"--port=$(SPEECH_TO_TEXT_PORT)"`|
|`textToSpeech.enabled`|Specifies whether enable **text-to-speech** service| true/false| `true` |
|`textToSpeech.verification.enabled`| Specifies whether enable `helm test` capability for **text-to-speech** service | true/false | `true` |
|`textToSpeech.verification.image.registry`| Specifies docker image repository that `helm test` uses to test **text-to-speech** service. Helm creates separate pod inside the cluster for testing and pulls the test-use image from this registry| valid docker registry | `docker.io` (default test-use image is published here) |
|`textToSpeech.verification.image.repository`| Specifies docker image repository that `helm test` uses to test **text-to-speech** service. Helm test pod uses this repository to pull test-use image| valid docker image repository |*`antsu/on-prem-client`*|
|`textToSpeech.verification.image.tag`| Specifies docker image tag that used `helm test` for **text-to-speech** service. Helm test pod uses this tag to pull test-use image | valid docker image tag | `latest`|
|`textToSpeech.verification.image.pullByHash`| Specifies whether test-use docker image is pulled by hash.<br/> If `yes`, `textToSpeech.verification.image.hash` should be added, with valid image hash value. <br/> It's `false` by default.|true/false| `false`|
|`textToSpeech.verification.image.arguments`| Specifies the arguments to execute test-use docker image. Helm test pod passes these arguments to container when running `helm test`| valid arguments as the test docker image requires |`"./text-to-speech-client"`<br/> `"--input='What's the weather like'"` <br/> `"--host=$(TEXT_TO_SPEECH_HOST)"`<br/>`"--port=$(TEXT_TO_SPEECH_PORT)"`|