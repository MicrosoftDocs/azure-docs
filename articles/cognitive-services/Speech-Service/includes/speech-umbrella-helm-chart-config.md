---
title: Install Speech containers
titleSuffix: Azure Cognitive Services
description: Details the speech umbrella helm chart configuration options.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 04/01/2020
ms.author: aahi
---

### Speech (umbrella chart)

Values in the top-level "umbrella" chart override the corresponding sub-chart values. Therefore, all on-premises customized values should be added here.

|Parameter|Description|Default|
| -- | -- | -- | -- |
| `speechToText.enabled` | Whether the **speech-to-text** service is enabled. | `true` |
| `speechToText.verification.enabled` | Whether the `helm test` capability for **speech-to-text** service is enabled. | `true` |
| `speechToText.verification.image.registry` | The docker image repository that `helm test` uses to test **speech-to-text** service. Helm creates separate pod inside the cluster for testing and pulls the *test-use* image from this registry. | `docker.io` |
| `speechToText.verification.image.repository` | The docker image repository that `helm test` uses to test **speech-to-text** service. Helm test pod uses this repository to pull *test-use* image. | `antsu/on-prem-client` |
| `speechToText.verification.image.tag` | The docker image tag used with `helm test` for **speech-to-text** service. Helm test pod uses this tag to pull *test-use* image. | `latest` |
| `speechToText.verification.image.pullByHash` | Whether the *test-use* docker image is pulled by hash. If `true`, `speechToText.verification.image.hash` should be added, with valid image hash value. | `false` |
| `speechToText.verification.image.arguments` | The arguments used to execute the *test-use* docker image. Helm test pod passes these arguments to the container when running `helm test`. | `"./speech-to-text-client"`<br/> `"./audio/whatstheweatherlike.wav"` <br/> `"--expect=What's the weather like"`<br/>`"--host=$(SPEECH_TO_TEXT_HOST)"`<br/>`"--port=$(SPEECH_TO_TEXT_PORT)"` |
| `textToSpeech.enabled` | Whether the **text-to-speech** service is enabled. | `true` |
| `textToSpeech.verification.enabled` | Whether the `helm test` capability for **speech-to-text** service is enabled. | `true` |
| `textToSpeech.verification.image.registry` | The docker image repository that `helm test` uses to test **speech-to-text** service. Helm creates separate pod inside the cluster for testing and pulls the *test-use* image from this registry. | `docker.io` |
| `textToSpeech.verification.image.repository` | The docker image repository that `helm test` uses to test **speech-to-text** service. Helm test pod uses this repository to pull *test-use* image. | `antsu/on-prem-client` |
| `textToSpeech.verification.image.tag` | The docker image tag used with `helm test` for **speech-to-text** service. Helm test pod uses this tag to pull *test-use* image. | `latest` |
| `textToSpeech.verification.image.pullByHash` | Whether the *test-use* docker image is pulled by hash. If `true`, `textToSpeech.verification.image.hash` should be added, with valid image hash value. | `false` |
| `textToSpeech.verification.image.arguments` | The arguments to execute with the *test-use* docker image. The helm test pod passes these arguments to container when running `helm test`. | `"./text-to-speech-client"`<br/> `"--input='What's the weather like'"` <br/> `"--host=$(TEXT_TO_SPEECH_HOST)"`<br/>`"--port=$(TEXT_TO_SPEECH_PORT)"` |