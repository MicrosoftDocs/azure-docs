---
title: Cognitive Services container image tags
titleSuffix: Azure Cognitive Services
description: A comprehensive listing of all the Cognitive Service container image tags.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: reference
ms.date: 04/01/2020
ms.author: aahi
---

# Azure Cognitive Services container image tags

Azure Cognitive Services offers many container images. The container registries and corresponding repositories vary between container images. Each container image name offers multiple tags. A container image tag is a mechanism of versioning the container image. This article is intended to be used as a comprehensive reference for listing all the Cognitive Services container images and their available tags.

> [!TIP]
> When using [`docker pull`](https://docs.docker.com/engine/reference/commandline/pull/), pay close attention to the casing of the container registry, repository, container image name and corresponding tag - as they are **case sensitive**.

## Anomaly Detector

The [Anomaly Detector][ad-containers] container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services` repository and is named `anomaly-detector`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/anomaly-detector`.

This container image has the following tags available:

| Image Tags                    | Notes |
|-------------------------------|:------|
| `latest`                      |       |

## Computer Vision

The [Computer Vision][cv-containers] container image can be found on the `containerpreview.azurecr.io` container registry. It resides within the `microsoft` repository and is named `cognitive-services-read`. The fully qualified container image name is, `containerpreview.azurecr.io/microsoft/cognitive-services-read`.

This container image has the following tags available:

| Image Tags                    | Notes |
|-------------------------------|:------|
| `latest`                      |       |
| `1.1.011580001-amd64-preview` |       |
| `1.1.009920003-amd64-preview` |       |
| `1.1.009910003-amd64-preview` |       |

## Face

The [Face][fa-containers] container image can be found on the `containerpreview.azurecr.io` container registry. It resides within the `microsoft` repository and is named `cognitive-services-face`. The fully qualified container image name is, `containerpreview.azurecr.io/microsoft/cognitive-services-face`.

This container image has the following tags available:

| Image Tags                    | Notes |
|-------------------------------|:------|
| `latest`                      |       |
| `1.1.009301-amd64-preview`    |       |
| `1.1.008710001-amd64-preview` |       |
| `1.1.007750002-amd64-preview` |       |
| `1.1.007360001-amd64-preview` |       |
| `1.1.006770001-amd64-preview` |       |
| `1.1.006490002-amd64-preview` |       |
| `1.0.005940002-amd64-preview` |       |
| `1.0.005550001-amd64-preview` |       |

## Form Recognizer

The [Form Recognizer][fr-containers] container image can be found on the `containerpreview.azurecr.io` container registry. It resides within the `microsoft` repository and is named `cognitive-services-form-recognizer`. The fully qualified container image name is, `containerpreview.azurecr.io/microsoft/cognitive-services-form-recognizer`.

This container image has the following tags available:

| Image Tags                    | Notes |
|-------------------------------|:------|
| `latest`                      |       |
| `1.1.009301-amd64-preview`    |       |
| `1.1.008640001-amd64-preview` |       |
| `1.1.008510001-amd64-preview` |       |

## Language Understanding (LUIS)

The [LUIS][lu-containers] container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services` repository and is named `luis`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/luis`.

This container image has the following tags available:

| Image Tags                    | Notes |
|-------------------------------|:------|
| `latest`                      |       |
| `1.1.010330004-amd64-preview` |       |
| `1.1.009301-amd64-preview`    |       |
| `1.1.008710001-amd64-preview` |       |
| `1.1.008510001-amd64-preview` |       |
| `1.1.008010002-amd64-preview` |       |
| `1.1.007750002-amd64-preview` |       |
| `1.1.007360001-amd64-preview` |       |
| `1.1.007020001-amd64-preview` |       |

## Custom Speech-to-text

The [Custom Speech-to-text][sp-cstt] container image can be found on the `containerpreview.azurecr.io` container registry. It resides within the `microsoft` repository and is named `cognitive-services-custom-speech-to-text`. The fully qualified container image name is, `containerpreview.azurecr.io/microsoft/cognitive-services-custom-speech-to-text`.

This container image has the following tags available:

| Image Tags            | Notes |
|-----------------------|:------|
| `latest`              |       |
| `2.2.0-amd64-preview` |       |
| `2.1.1-amd64-preview` |       |
| `2.1.0-amd64-preview` |       |
| `2.0.2-amd64-preview` |       |
| `2.0.0-amd64-preview` |       |

## Custom Text-to-speech

The [Custom Text-to-speech][sp-ctts] container image can be found on the `containerpreview.azurecr.io` container registry. It resides within the `microsoft` repository and is named `cognitive-services-custom-text-to-speech`. The fully qualified container image name is, `containerpreview.azurecr.io/microsoft/cognitive-services-custom-text-to-speech`.

This container image has the following tags available:

| Image Tags            | Notes |
|-----------------------|:------|
| `latest`              |       |
| `1.3.0-amd64-preview` |       |

## Speech-to-text

The [Speech-to-text][sp-stt] container image can be found on the `containerpreview.azurecr.io` container registry. It resides within the `microsoft` repository and is named `cognitive-services-speech-to-text`. The fully qualified container image name is, `containerpreview.azurecr.io/microsoft/cognitive-services-speech-to-text`.

This container image has the following tags available:

| Image Tags                  | Notes                                    |
|-----------------------------|:-----------------------------------------|
| `latest`                    | Container image with the `en-US` locale. |
| `2.2.0-amd64-ar-ae-preview` | Container image with the `ar-AE` locale. |
| `2.2.0-amd64-ar-eg-preview` | Container image with the `ar-EG` locale. |
| `2.2.0-amd64-ar-kw-preview` | Container image with the `ar-KW` locale. |
| `2.2.0-amd64-ar-qa-preview` | Container image with the `ar-QA` locale. |
| `2.2.0-amd64-ar-sa-preview` | Container image with the `ar-SA` locale. |
| `2.2.0-amd64-ca-es-preview` | Container image with the `ca-ES` locale. |
| `2.2.0-amd64-da-dk-preview` | Container image with the `da-DK` locale. |
| `2.2.0-amd64-de-de-preview` | Container image with the `de-DE` locale. |
| `2.2.0-amd64-en-au-preview` | Container image with the `en-AU` locale. |
| `2.2.0-amd64-en-ca-preview` | Container image with the `en-CA` locale. |
| `2.2.0-amd64-en-gb-preview` | Container image with the `en-GB` locale. |
| `2.2.0-amd64-en-in-preview` | Container image with the `en-IN` locale. |
| `2.2.0-amd64-en-nz-preview` | Container image with the `en-NZ` locale. |
| `2.2.0-amd64-en-us-preview` | Container image with the `en-US` locale. |
| `2.2.0-amd64-es-es-preview` | Container image with the `es-ES` locale. |
| `2.2.0-amd64-es-mx-preview` | Container image with the `es-MX` locale. |
| `2.2.0-amd64-fi-fi-preview` | Container image with the `fi-FI` locale. |
| `2.2.0-amd64-fr-ca-preview` | Container image with the `fr-CA` locale. |
| `2.2.0-amd64-fr-fr-preview` | Container image with the `fr-FR` locale. |
| `2.2.0-amd64-gu-in-preview` | Container image with the `gu-IN` locale. |
| `2.2.0-amd64-hi-in-preview` | Container image with the `hi-IN` locale. |
| `2.2.0-amd64-it-it-preview` | Container image with the `it-IT` locale. |
| `2.2.0-amd64-ja-jp-preview` | Container image with the `ja-JP` locale. |
| `2.2.0-amd64-ko-kr-preview` | Container image with the `ko-KR` locale. |
| `2.2.0-amd64-mr-in-preview` | Container image with the `mr-IN` locale. |
| `2.2.0-amd64-nb-no-preview` | Container image with the `nb-NO` locale. |
| `2.2.0-amd64-nl-nl-preview` | Container image with the `nl-NL` locale. |
| `2.2.0-amd64-pl-pl-preview` | Container image with the `pl-PL` locale. |
| `2.2.0-amd64-pt-br-preview` | Container image with the `pt-BR` locale. |
| `2.2.0-amd64-pt-pt-preview` | Container image with the `pt-PT` locale. |
| `2.2.0-amd64-ru-ru-preview` | Container image with the `ru-RU` locale. |
| `2.2.0-amd64-sv-se-preview` | Container image with the `sv-SE` locale. |
| `2.2.0-amd64-ta-in-preview` | Container image with the `ta-IN` locale. |
| `2.2.0-amd64-te-in-preview` | Container image with the `te-IN` locale. |
| `2.2.0-amd64-th-th-preview` | Container image with the `th-TH` locale. |
| `2.2.0-amd64-tr-tr-preview` | Container image with the `tr-TR` locale. |
| `2.2.0-amd64-zh-cn-preview` | Container image with the `zh-CN` locale. |
| `2.2.0-amd64-zh-hk-preview` | Container image with the `zh-HK` locale. |
| `2.2.0-amd64-zh-tw-preview` | Container image with the `zh-TW` locale. |
| `2.1.1-amd64-en-us-preview` | Container image with the `en-US` locale. |
| `2.1.1-amd64-ar-ae-preview` | Container image with the `ar-AE` locale. |
| `2.1.1-amd64-ar-eg-preview` | Container image with the `ar-EG` locale. |
| `2.1.1-amd64-ar-kw-preview` | Container image with the `ar-KW` locale. |
| `2.1.1-amd64-ar-qa-preview` | Container image with the `ar-QA` locale. |
| `2.1.1-amd64-ar-sa-preview` | Container image with the `ar-SA` locale. |
| `2.1.1-amd64-ca-es-preview` | Container image with the `ca-ES` locale. |
| `2.1.1-amd64-da-dk-preview` | Container image with the `da-DK` locale. |
| `2.1.1-amd64-de-de-preview` | Container image with the `de-DE` locale. |
| `2.1.1-amd64-en-au-preview` | Container image with the `en-AU` locale. |
| `2.1.1-amd64-en-ca-preview` | Container image with the `en-CA` locale. |
| `2.1.1-amd64-en-gb-preview` | Container image with the `en-GB` locale. |
| `2.1.1-amd64-en-in-preview` | Container image with the `en-IN` locale. |
| `2.1.1-amd64-en-nz-preview` | Container image with the `en-NZ` locale. |
| `2.1.1-amd64-en-us-preview` | Container image with the `en-US` locale. |
| `2.1.1-amd64-es-es-preview` | Container image with the `es-ES` locale. |
| `2.1.1-amd64-es-mx-preview` | Container image with the `es-MX` locale. |
| `2.1.1-amd64-fi-fi-preview` | Container image with the `fi-FI` locale. |
| `2.1.1-amd64-fr-ca-preview` | Container image with the `fr-CA` locale. |
| `2.1.1-amd64-fr-fr-preview` | Container image with the `fr-FR` locale. |
| `2.1.1-amd64-gu-in-preview` | Container image with the `gu-IN` locale. |
| `2.1.1-amd64-hi-in-preview` | Container image with the `hi-IN` locale. |
| `2.1.1-amd64-it-it-preview` | Container image with the `it-IT` locale. |
| `2.1.1-amd64-ja-jp-preview` | Container image with the `ja-JP` locale. |
| `2.1.1-amd64-ko-kr-preview` | Container image with the `ko-KR` locale. |
| `2.1.1-amd64-mr-in-preview` | Container image with the `mr-IN` locale. |
| `2.1.1-amd64-nb-no-preview` | Container image with the `nb-NO` locale. |
| `2.1.1-amd64-nl-nl-preview` | Container image with the `nl-NL` locale. |
| `2.1.1-amd64-pl-pl-preview` | Container image with the `pl-PL` locale. |
| `2.1.1-amd64-pt-br-preview` | Container image with the `pt-BR` locale. |
| `2.1.1-amd64-pt-pt-preview` | Container image with the `pt-PT` locale. |
| `2.1.1-amd64-ru-ru-preview` | Container image with the `ru-RU` locale. |
| `2.1.1-amd64-sv-se-preview` | Container image with the `sv-SE` locale. |
| `2.1.1-amd64-ta-in-preview` | Container image with the `ta-IN` locale. |
| `2.1.1-amd64-te-in-preview` | Container image with the `te-IN` locale. |
| `2.1.1-amd64-th-th-preview` | Container image with the `th-TH` locale. |
| `2.1.1-amd64-tr-tr-preview` | Container image with the `tr-TR` locale. |
| `2.1.1-amd64-zh-cn-preview` | Container image with the `zh-CN` locale. |
| `2.1.1-amd64-zh-hk-preview` | Container image with the `zh-HK` locale. |
| `2.1.1-amd64-zh-tw-preview` | Container image with the `zh-TW` locale. |
| `2.1.0-amd64-ar-ae-preview` | Container image with the `ar-AE` locale. |
| `2.1.0-amd64-ar-eg-preview` | Container image with the `ar-EG` locale. |
| `2.1.0-amd64-ar-kw-preview` | Container image with the `ar-KW` locale. |
| `2.1.0-amd64-ar-qa-preview` | Container image with the `ar-QA` locale. |
| `2.1.0-amd64-ar-sa-preview` | Container image with the `ar-SA` locale. |
| `2.1.0-amd64-ca-es-preview` | Container image with the `ca-ES` locale. |
| `2.1.0-amd64-da-dk-preview` | Container image with the `da-DK` locale. |
| `2.1.0-amd64-de-de-preview` | Container image with the `de-DE` locale. |
| `2.1.0-amd64-en-au-preview` | Container image with the `en-AU` locale. |
| `2.1.0-amd64-en-ca-preview` | Container image with the `en-CA` locale. |
| `2.1.0-amd64-en-gb-preview` | Container image with the `en-GB` locale. |
| `2.1.0-amd64-en-in-preview` | Container image with the `en-IN` locale. |
| `2.1.0-amd64-en-nz-preview` | Container image with the `en-NZ` locale. |
| `2.1.0-amd64-en-us-preview` | Container image with the `en-US` locale. |
| `2.1.0-amd64-es-es-preview` | Container image with the `es-ES` locale. |
| `2.1.0-amd64-es-mx-preview` | Container image with the `es-MX` locale. |
| `2.1.0-amd64-fi-fi-preview` | Container image with the `fi-FI` locale. |
| `2.1.0-amd64-fr-ca-preview` | Container image with the `fr-CA` locale. |
| `2.1.0-amd64-fr-fr-preview` | Container image with the `fr-FR` locale. |
| `2.1.0-amd64-gu-in-preview` | Container image with the `gu-IN` locale. |
| `2.1.0-amd64-hi-in-preview` | Container image with the `hi-IN` locale. |
| `2.1.0-amd64-it-it-preview` | Container image with the `it-IT` locale. |
| `2.1.0-amd64-ja-jp-preview` | Container image with the `ja-JP` locale. |
| `2.1.0-amd64-ko-kr-preview` | Container image with the `ko-KR` locale. |
| `2.1.0-amd64-mr-in-preview` | Container image with the `mr-IN` locale. |
| `2.1.0-amd64-nb-no-preview` | Container image with the `nb-NO` locale. |
| `2.1.0-amd64-nl-nl-preview` | Container image with the `nl-NL` locale. |
| `2.1.0-amd64-pl-pl-preview` | Container image with the `pl-PL` locale. |
| `2.1.0-amd64-pt-br-preview` | Container image with the `pt-BR` locale. |
| `2.1.0-amd64-pt-pt-preview` | Container image with the `pt-PT` locale. |
| `2.1.0-amd64-ru-ru-preview` | Container image with the `ru-RU` locale. |
| `2.1.0-amd64-sv-se-preview` | Container image with the `sv-SE` locale. |
| `2.1.0-amd64-ta-in-preview` | Container image with the `ta-IN` locale. |
| `2.1.0-amd64-te-in-preview` | Container image with the `te-IN` locale. |
| `2.1.0-amd64-th-th-preview` | Container image with the `th-TH` locale. |
| `2.1.0-amd64-tr-tr-preview` | Container image with the `tr-TR` locale. |
| `2.1.0-amd64-zh-cn-preview` | Container image with the `zh-CN` locale. |
| `2.1.0-amd64-zh-hk-preview` | Container image with the `zh-HK` locale. |
| `2.1.0-amd64-zh-tw-preview` | Container image with the `zh-TW` locale. |
| `2.0.3-amd64-ja-jp-preview` | Container image with the `ja-JP` locale. |
| `2.0.2-amd64-ar-ae-preview` | Container image with the `ar-AE` locale. |
| `2.0.2-amd64-ar-eg-preview` | Container image with the `ar-EG` locale. |
| `2.0.2-amd64-ar-kw-preview` | Container image with the `ar-KW` locale. |
| `2.0.2-amd64-ar-qa-preview` | Container image with the `ar-QA` locale. |
| `2.0.2-amd64-ar-sa-preview` | Container image with the `ar-SA` locale. |
| `2.0.2-amd64-ca-es-preview` | Container image with the `ca-ES` locale. |
| `2.0.2-amd64-da-dk-preview` | Container image with the `da-DK` locale. |
| `2.0.2-amd64-de-de-preview` | Container image with the `de-DE` locale. |
| `2.0.2-amd64-en-au-preview` | Container image with the `en-AU` locale. |
| `2.0.2-amd64-en-ca-preview` | Container image with the `en-CA` locale. |
| `2.0.2-amd64-en-gb-preview` | Container image with the `en-GB` locale. |
| `2.0.2-amd64-en-in-preview` | Container image with the `en-IN` locale. |
| `2.0.2-amd64-en-nz-preview` | Container image with the `en-NZ` locale. |
| `2.0.2-amd64-en-us-preview` | Container image with the `en-US` locale. |
| `2.0.2-amd64-es-es-preview` | Container image with the `es-ES` locale. |
| `2.0.2-amd64-es-mx-preview` | Container image with the `es-MX` locale. |
| `2.0.2-amd64-fi-fi-preview` | Container image with the `fi-FI` locale. |
| `2.0.2-amd64-fr-ca-preview` | Container image with the `fr-CA` locale. |
| `2.0.2-amd64-fr-fr-preview` | Container image with the `fr-FR` locale. |
| `2.0.2-amd64-gu-in-preview` | Container image with the `gu-IN` locale. |
| `2.0.2-amd64-hi-in-preview` | Container image with the `hi-IN` locale. |
| `2.0.2-amd64-it-it-preview` | Container image with the `it-IT` locale. |
| `2.0.2-amd64-ja-jp-preview` | Container image with the `ja-JP` locale. |
| `2.0.2-amd64-ko-kr-preview` | Container image with the `ko-KR` locale. |
| `2.0.2-amd64-mr-in-preview` | Container image with the `mr-IN` locale. |
| `2.0.2-amd64-nb-no-preview` | Container image with the `nb-NO` locale. |
| `2.0.2-amd64-nl-nl-preview` | Container image with the `nl-NL` locale. |
| `2.0.2-amd64-pl-pl-preview` | Container image with the `pl-PL` locale. |
| `2.0.2-amd64-pt-br-preview` | Container image with the `pt-BR` locale. |
| `2.0.2-amd64-pt-pt-preview` | Container image with the `pt-PT` locale. |
| `2.0.2-amd64-ru-ru-preview` | Container image with the `ru-RU` locale. |
| `2.0.2-amd64-sv-se-preview` | Container image with the `sv-SE` locale. |
| `2.0.2-amd64-ta-in-preview` | Container image with the `ta-IN` locale. |
| `2.0.2-amd64-te-in-preview` | Container image with the `te-IN` locale. |
| `2.0.2-amd64-th-th-preview` | Container image with the `th-TH` locale. |
| `2.0.2-amd64-tr-tr-preview` | Container image with the `tr-TR` locale. |
| `2.0.2-amd64-zh-cn-preview` | Container image with the `zh-CN` locale. |
| `2.0.2-amd64-zh-hk-preview` | Container image with the `zh-HK` locale. |
| `2.0.2-amd64-zh-tw-preview` | Container image with the `zh-TW` locale. |
| `2.0.1-amd64-ar-ae-preview` | Container image with the `ar-AE` locale. |
| `2.0.1-amd64-ar-eg-preview` | Container image with the `ar-EG` locale. |
| `2.0.1-amd64-ar-kw-preview` | Container image with the `ar-KW` locale. |
| `2.0.1-amd64-ar-qa-preview` | Container image with the `ar-QA` locale. |
| `2.0.1-amd64-ar-sa-preview` | Container image with the `ar-SA` locale. |
| `2.0.1-amd64-ca-es-preview` | Container image with the `ca-ES` locale. |
| `2.0.1-amd64-da-dk-preview` | Container image with the `da-DK` locale. |
| `2.0.1-amd64-de-de-preview` | Container image with the `de-DE` locale. |
| `2.0.1-amd64-en-au-preview` | Container image with the `en-AU` locale. |
| `2.0.1-amd64-en-ca-preview` | Container image with the `en-CA` locale. |
| `2.0.1-amd64-en-gb-preview` | Container image with the `en-GB` locale. |
| `2.0.1-amd64-en-in-preview` | Container image with the `en-IN` locale. |
| `2.0.1-amd64-en-nz-preview` | Container image with the `en-NZ` locale. |
| `2.0.1-amd64-en-us-preview` | Container image with the `en-US` locale. |
| `2.0.1-amd64-es-es-preview` | Container image with the `es-ES` locale. |
| `2.0.1-amd64-es-mx-preview` | Container image with the `es-MX` locale. |
| `2.0.1-amd64-fi-fi-preview` | Container image with the `fi-FI` locale. |
| `2.0.1-amd64-fr-ca-preview` | Container image with the `fr-CA` locale. |
| `2.0.1-amd64-fr-fr-preview` | Container image with the `fr-FR` locale. |
| `2.0.1-amd64-gu-in-preview` | Container image with the `gu-IN` locale. |
| `2.0.1-amd64-hi-in-preview` | Container image with the `hi-IN` locale. |
| `2.0.1-amd64-it-it-preview` | Container image with the `it-IT` locale. |
| `2.0.1-amd64-ja-jp-preview` | Container image with the `ja-JP` locale. |
| `2.0.1-amd64-ko-kr-preview` | Container image with the `ko-KR` locale. |
| `2.0.1-amd64-mr-in-preview` | Container image with the `mr-IN` locale. |
| `2.0.1-amd64-nb-no-preview` | Container image with the `nb-NO` locale. |
| `2.0.1-amd64-nl-nl-preview` | Container image with the `nl-NL` locale. |
| `2.0.1-amd64-pl-pl-preview` | Container image with the `pl-PL` locale. |
| `2.0.1-amd64-pt-br-preview` | Container image with the `pt-BR` locale. |
| `2.0.1-amd64-pt-pt-preview` | Container image with the `pt-PT` locale. |
| `2.0.1-amd64-ru-ru-preview` | Container image with the `ru-RU` locale. |
| `2.0.1-amd64-sv-se-preview` | Container image with the `sv-SE` locale. |
| `2.0.1-amd64-ta-in-preview` | Container image with the `ta-IN` locale. |
| `2.0.1-amd64-te-in-preview` | Container image with the `te-IN` locale. |
| `2.0.1-amd64-th-th-preview` | Container image with the `th-TH` locale. |
| `2.0.1-amd64-tr-tr-preview` | Container image with the `tr-TR` locale. |
| `2.0.1-amd64-zh-cn-preview` | Container image with the `zh-CN` locale. |
| `2.0.1-amd64-zh-hk-preview` | Container image with the `zh-HK` locale. |
| `2.0.1-amd64-zh-tw-preview` | Container image with the `zh-TW` locale. |
| `2.0.0-amd64-ar-eg-preview` | Container image with the `ar-EG` locale. |
| `2.0.0-amd64-ca-es-preview` | Container image with the `ca-ES` locale. |
| `2.0.0-amd64-da-dk-preview` | Container image with the `da-DK` locale. |
| `2.0.0-amd64-de-de-preview` | Container image with the `de-DE` locale. |
| `2.0.0-amd64-en-au-preview` | Container image with the `en-AU` locale. |
| `2.0.0-amd64-en-ca-preview` | Container image with the `en-CA` locale. |
| `2.0.0-amd64-en-gb-preview` | Container image with the `en-GB` locale. |
| `2.0.0-amd64-en-in-preview` | Container image with the `en-IN` locale. |
| `2.0.0-amd64-en-nz-preview` | Container image with the `en-NZ` locale. |
| `2.0.0-amd64-en-us-preview` | Container image with the `en-US` locale. |
| `2.0.0-amd64-es-es-preview` | Container image with the `es-ES` locale. |
| `2.0.0-amd64-es-mx-preview` | Container image with the `es-MX` locale. |
| `2.0.0-amd64-fi-fi-preview` | Container image with the `fi-FI` locale. |
| `2.0.0-amd64-fr-ca-preview` | Container image with the `fr-CA` locale. |
| `2.0.0-amd64-fr-fr-preview` | Container image with the `fr-FR` locale. |
| `2.0.0-amd64-hi-in-preview` | Container image with the `hi-IN` locale. |
| `2.0.0-amd64-it-it-preview` | Container image with the `it-IT` locale. |
| `2.0.0-amd64-ja-jp-preview` | Container image with the `ja-JP` locale. |
| `2.0.0-amd64-ko-kr-preview` | Container image with the `ko-KR` locale. |
| `2.0.0-amd64-nb-no-preview` | Container image with the `nb-NO` locale. |
| `2.0.0-amd64-nl-nl-preview` | Container image with the `nl-NL` locale. |
| `2.0.0-amd64-pl-pl-preview` | Container image with the `pl-PL` locale. |
| `2.0.0-amd64-pt-br-preview` | Container image with the `pt-BR` locale. |
| `2.0.0-amd64-pt-pt-preview` | Container image with the `pt-PT` locale. |
| `2.0.0-amd64-ru-ru-preview` | Container image with the `ru-RU` locale. |
| `2.0.0-amd64-sv-se-preview` | Container image with the `sv-SE` locale. |
| `2.0.0-amd64-th-th-preview` | Container image with the `th-TH` locale. |
| `2.0.0-amd64-tr-tr-preview` | Container image with the `tr-TR` locale. |
| `2.0.0-amd64-zh-cn-preview` | Container image with the `zh-CN` locale. |
| `2.0.0-amd64-zh-hk-preview` | Container image with the `zh-HK` locale. |
| `2.0.0-amd64-zh-tw-preview` | Container image with the `zh-TW` locale. |
| `1.2.0-amd64-de-de-preview` | Container image with the `de-DE` locale. |
| `1.2.0-amd64-en-au-preview` | Container image with the `en-AU` locale. |
| `1.2.0-amd64-en-ca-preview` | Container image with the `en-CA` locale. |
| `1.2.0-amd64-en-gb-preview` | Container image with the `en-GB` locale. |
| `1.2.0-amd64-en-in-preview` | Container image with the `en-IN` locale. |
| `1.2.0-amd64-en-us-preview` | Container image with the `en-US` locale. |
| `1.2.0-amd64-es-es-preview` | Container image with the `es-ES` locale. |
| `1.2.0-amd64-es-mx-preview` | Container image with the `es-MX` locale. |
| `1.2.0-amd64-fr-ca-preview` | Container image with the `fr-CA` locale. |
| `1.2.0-amd64-fr-fr-preview` | Container image with the `fr-FR` locale. |
| `1.2.0-amd64-it-it-preview` | Container image with the `it-IT` locale. |
| `1.2.0-amd64-ja-jp-preview` | Container image with the `ja-JP` locale. |
| `1.2.0-amd64-pt-br-preview` | Container image with the `pt-BR` locale. |
| `1.2.0-amd64-zh-cn-preview` | Container image with the `zh-CN` locale. |
| `1.1.3-amd64-de-de-preview` | Container image with the `de-DE` locale. |
| `1.1.3-amd64-en-au-preview` | Container image with the `en-AU` locale. |
| `1.1.3-amd64-en-ca-preview` | Container image with the `en-CA` locale. |
| `1.1.3-amd64-en-gb-preview` | Container image with the `en-GB` locale. |
| `1.1.3-amd64-en-in-preview` | Container image with the `en-IN` locale. |
| `1.1.3-amd64-en-us-preview` | Container image with the `en-US` locale. |
| `1.1.3-amd64-es-es-preview` | Container image with the `es-ES` locale. |
| `1.1.3-amd64-es-mx-preview` | Container image with the `es-MX` locale. |
| `1.1.3-amd64-fr-ca-preview` | Container image with the `fr-CA` locale. |
| `1.1.3-amd64-fr-fr-preview` | Container image with the `fr-FR` locale. |
| `1.1.3-amd64-it-it-preview` | Container image with the `it-IT` locale. |
| `1.1.3-amd64-ja-jp-preview` | Container image with the `ja-JP` locale. |
| `1.1.3-amd64-pt-br-preview` | Container image with the `pt-BR` locale. |
| `1.1.3-amd64-zh-cn-preview` | Container image with the `zh-CN` locale. |
| `1.1.2-amd64-de-de-preview` | Container image with the `de-DE` locale. |
| `1.1.2-amd64-en-au-preview` | Container image with the `en-AU` locale. |
| `1.1.2-amd64-en-ca-preview` | Container image with the `en-CA` locale. |
| `1.1.2-amd64-en-gb-preview` | Container image with the `en-GB` locale. |
| `1.1.2-amd64-en-in-preview` | Container image with the `en-IN` locale. |
| `1.1.2-amd64-en-us-preview` | Container image with the `en-US` locale. |
| `1.1.2-amd64-es-es-preview` | Container image with the `es-ES` locale. |
| `1.1.2-amd64-es-mx-preview` | Container image with the `es-MX` locale. |
| `1.1.2-amd64-fr-ca-preview` | Container image with the `fr-CA` locale. |
| `1.1.2-amd64-fr-fr-preview` | Container image with the `fr-FR` locale. |
| `1.1.2-amd64-it-it-preview` | Container image with the `it-IT` locale. |
| `1.1.2-amd64-ja-jp-preview` | Container image with the `ja-JP` locale. |
| `1.1.2-amd64-pt-br-preview` | Container image with the `pt-BR` locale. |
| `1.1.2-amd64-zh-cn-preview` | Container image with the `zh-CN` locale. |
| `1.1.1-amd64-de-de-preview` | Container image with the `de-DE` locale. |
| `1.1.1-amd64-en-au-preview` | Container image with the `en-AU` locale. |
| `1.1.1-amd64-en-ca-preview` | Container image with the `en-CA` locale. |
| `1.1.1-amd64-en-gb-preview` | Container image with the `en-GB` locale. |
| `1.1.1-amd64-en-in-preview` | Container image with the `en-IN` locale. |
| `1.1.1-amd64-en-us-preview` | Container image with the `en-US` locale. |
| `1.1.1-amd64-es-es-preview` | Container image with the `es-ES` locale. |
| `1.1.1-amd64-es-mx-preview` | Container image with the `es-MX` locale. |
| `1.1.1-amd64-fr-ca-preview` | Container image with the `fr-CA` locale. |
| `1.1.1-amd64-fr-fr-preview` | Container image with the `fr-FR` locale. |
| `1.1.1-amd64-it-it-preview` | Container image with the `it-IT` locale. |
| `1.1.1-amd64-ja-jp-preview` | Container image with the `ja-JP` locale. |
| `1.1.1-amd64-pt-br-preview` | Container image with the `pt-BR` locale. |
| `1.1.1-amd64-zh-cn-preview` | Container image with the `zh-CN` locale. |
| `1.1.0-amd64-de-de-preview` | Container image with the `de-DE` locale. |
| `1.1.0-amd64-en-au-preview` | Container image with the `en-AU` locale. |
| `1.1.0-amd64-en-ca-preview` | Container image with the `en-CA` locale. |
| `1.1.0-amd64-en-gb-preview` | Container image with the `en-GB` locale. |
| `1.1.0-amd64-en-in-preview` | Container image with the `en-IN` locale. |
| `1.1.0-amd64-en-us-preview` | Container image with the `en-US` locale. |
| `1.1.0-amd64-es-es-preview` | Container image with the `es-ES` locale. |
| `1.1.0-amd64-es-mx-preview` | Container image with the `es-MX` locale. |
| `1.1.0-amd64-fr-ca-preview` | Container image with the `fr-CA` locale. |
| `1.1.0-amd64-fr-fr-preview` | Container image with the `fr-FR` locale. |
| `1.1.0-amd64-it-it-preview` | Container image with the `it-IT` locale. |
| `1.1.0-amd64-ja-jp-preview` | Container image with the `ja-JP` locale. |
| `1.1.0-amd64-pt-br-preview` | Container image with the `pt-BR` locale. |
| `1.1.0-amd64-zh-cn-preview` | Container image with the `zh-CN` locale. |
| `1.0.0-amd64-de-de-preview` | Container image with the `de-DE` locale. |
| `1.0.0-amd64-en-au-preview` | Container image with the `en-AU` locale. |
| `1.0.0-amd64-en-ca-preview` | Container image with the `en-CA` locale. |
| `1.0.0-amd64-en-gb-preview` | Container image with the `en-GB` locale. |
| `1.0.0-amd64-en-in-preview` | Container image with the `en-IN` locale. |
| `1.0.0-amd64-en-us-preview` | Container image with the `en-US` locale. |
| `1.0.0-amd64-es-es-preview` | Container image with the `es-ES` locale. |
| `1.0.0-amd64-es-mx-preview` | Container image with the `es-MX` locale. |
| `1.0.0-amd64-fr-ca-preview` | Container image with the `fr-CA` locale. |
| `1.0.0-amd64-fr-fr-preview` | Container image with the `fr-FR` locale. |
| `1.0.0-amd64-it-it-preview` | Container image with the `it-IT` locale. |
| `1.0.0-amd64-ja-jp-preview` | Container image with the `ja-JP` locale. |
| `1.0.0-amd64-pt-br-preview` | Container image with the `pt-BR` locale. |
| `1.0.0-amd64-zh-cn-preview` | Container image with the `zh-CN` locale. |

## Text-to-speech

The [Text-to-speech][sp-tts] container image can be found on the `containerpreview.azurecr.io` container registry. It resides within the `microsoft` repository and is named `cognitive-services-text-to-speech`. The fully qualified container image name is, `containerpreview.azurecr.io/microsoft/cognitive-services-text-to-speech`.

This container image has the following tags available:

| Image Tags                                  | Notes                                                                      |
|---------------------------------------------|:---------------------------------------------------------------------------|
| `latest`                                    | Container image with the `en-US` locale and `en-US-JessaRUS` voice.        |
| `1.3.0-amd64-ar-eg-hoda-preview`            | Container image with the `ar-EG` locale and `ar-EG-Hoda` voice.            |
| `1.3.0-amd64-ar-sa-naayf-preview`           | Container image with the `ar-SA` locale and `ar-SA-Naayf` voice.           |
| `1.3.0-amd64-bg-bg-ivan-preview`            | Container image with the `bg-BG` locale and `bg-BG-Ivan` voice.            |
| `1.3.0-amd64-ca-es-herenarus-preview`       | Container image with the `ca-ES` locale and `ca-ES-HerenaRUS` voice.       |
| `1.3.0-amd64-cs-cz-jakub-preview`           | Container image with the `cs-CZ` locale and `cs-CZ-Jakub` voice.           |
| `1.3.0-amd64-da-dk-hellerus-preview`        | Container image with the `da-DK` locale and `da-DK-HelleRUS` voice.        |
| `1.3.0-amd64-de-at-michael-preview`         | Container image with the `de-AT` locale and `de-AT-Michael` voice.         |
| `1.3.0-amd64-de-ch-karsten-preview`         | Container image with the `de-CH` locale and `de-CH-Karsten` voice.         |
| `1.3.0-amd64-de-de-hedda-preview`           | Container image with the `de-DE` locale and `de-DE-Hedda` voice.           |
| `1.3.0-amd64-de-de-heddarus-preview`        | Container image with the `de-DE` locale and `de-DE-Hedda` voice.           |
| `1.3.0-amd64-de-de-heddarus-preview`        | Container image with the `de-DE` locale and `de-DE-HeddaRUS` voice.        |
| `1.3.0-amd64-de-de-stefan-apollo-preview`   | Container image with the `de-DE` locale and `de-DE-Stefan-Apollo` voice.   |
| `1.3.0-amd64-el-gr-stefanos-preview`        | Container image with the `el-GR` locale and `el-GR-Stefanos` voice.        |
| `1.3.0-amd64-en-au-catherine-preview`       | Container image with the `en-AU` locale and `en-AU-Catherine` voice.       |
| `1.3.0-amd64-en-au-hayleyrus-preview`       | Container image with the `en-AU` locale and `en-AU-HayleyRUS` voice.       |
| `1.3.0-amd64-en-ca-heatherrus-preview`      | Container image with the `en-CA` locale and `en-CA-HeatherRUS` voice.      |
| `1.3.0-amd64-en-ca-linda-preview`           | Container image with the `en-CA` locale and `en-CA-Linda` voice.           |
| `1.3.0-amd64-en-gb-george-apollo-preview`   | Container image with the `en-GB` locale and `en-GB-George-Apollo` voice.   |
| `1.3.0-amd64-en-gb-hazelrus-preview`        | Container image with the `en-GB` locale and `en-GB-HazelRUS` voice.        |
| `1.3.0-amd64-en-gb-susan-apollo-preview`    | Container image with the `en-GB` locale and `en-GB-Susan-Apollo` voice.    |
| `1.3.0-amd64-en-ie-sean-preview`            | Container image with the `en-IE` locale and `en-IE-Sean` voice.            |
| `1.3.0-amd64-en-in-heera-apollo-preview`    | Container image with the `en-IN` locale and `en-IN-Heera-Apollo` voice.    |
| `1.3.0-amd64-en-in-priyarus-preview`        | Container image with the `en-IN` locale and `en-IN-PriyaRUS` voice.        |
| `1.3.0-amd64-en-in-ravi-apollo-preview`     | Container image with the `en-IN` locale and `en-IN-Ravi-Apollo` voice.     |
| `1.3.0-amd64-en-us-benjaminrus-preview`     | Container image with the `en-US` locale and `en-US-BenjaminRUS` voice.     |
| `1.3.0-amd64-en-us-guy24krus-preview`       | Container image with the `en-US` locale and `en-US-Guy24kRUS` voice.       |
| `1.3.0-amd64-en-us-jessa24krus-preview`     | Container image with the `en-US` locale and `en-US-Jessa24kRUS` voice.     |
| `1.3.0-amd64-en-us-jessarus-preview`        | Container image with the `en-US` locale and `en-US-JessaRUS` voice.        |
| `1.3.0-amd64-en-us-zirarus-preview`         | Container image with the `en-US` locale and `en-US-ZiraRUS` voice.         |
| `1.3.0-amd64-es-es-helenarus-preview`       | Container image with the `es-ES` locale and `es-ES-HelenaRUS` voice.       |
| `1.3.0-amd64-es-es-laura-apollo-preview`    | Container image with the `es-ES` locale and `es-ES-Laura-Apollo` voice.    |
| `1.3.0-amd64-es-es-pablo-apollo-preview`    | Container image with the `es-ES` locale and `es-ES-Pablo-Apollo` voice.    |
| `1.3.0-amd64-es-mx-hildarus-preview`        | Container image with the `es-MX` locale and `es-MX-HildaRUS` voice.        |
| `1.3.0-amd64-es-mx-raul-apollo-preview`     | Container image with the `es-MX` locale and `es-MX-Raul-Apollo` voice.     |
| `1.3.0-amd64-fi-fi-heidirus-preview`        | Container image with the `fi-FI` locale and `fi-FI-HeidiRUS` voice.        |
| `1.3.0-amd64-fr-ca-caroline-preview`        | Container image with the `fr-CA` locale and `fr-CA-Caroline` voice.        |
| `1.3.0-amd64-fr-ca-harmonierus-preview`     | Container image with the `fr-CA` locale and `fr-CA-HarmonieRUS` voice.     |
| `1.3.0-amd64-fr-ch-guillaume-preview`       | Container image with the `fr-CH` locale and `fr-CH-Guillaume` voice.       |
| `1.3.0-amd64-fr-fr-hortenserus-preview`     | Container image with the `fr-FR` locale and `fr-FR-HortenseRUS` voice.     |
| `1.3.0-amd64-fr-fr-julie-apollo-preview`    | Container image with the `fr-FR` locale and `fr-FR-Julie-Apollo` voice.    |
| `1.3.0-amd64-fr-fr-paul-apollo-preview`     | Container image with the `fr-FR` locale and `fr-FR-Paul-Apollo` voice.     |
| `1.3.0-amd64-he-il-asaf-preview`            | Container image with the `he-IL` locale and `he-IL-Asaf` voice.            |
| `1.3.0-amd64-hi-in-hemant-preview`          | Container image with the `hi-IN` locale and `hi-IN-Hemant` voice.          |
| `1.3.0-amd64-hi-in-kalpana-apollo-preview`  | Container image with the `hi-IN` locale and `hi-IN-Kalpana-Apollo` voice.  |
| `1.3.0-amd64-hi-in-kalpana-apollo-preview`  | Container image with the `hi-IN` locale and `hi-IN-Kalpana` voice.         |
| `1.3.0-amd64-hi-in-kalpana-preview`         | Container image with the `hi-IN` locale and `hi-IN-Kalpana` voice.         |
| `1.3.0-amd64-hr-hr-matej-preview`           | Container image with the `hr-HR` locale and `hr-HR-Matej` voice.           |
| `1.3.0-amd64-hu-hu-szabolcs-preview`        | Container image with the `hu-HU` locale and `hu-HU-Szabolcs` voice.        |
| `1.3.0-amd64-id-id-andika-preview`          | Container image with the `id-ID` locale and `id-ID-Andika` voice.          |
| `1.3.0-amd64-it-it-cosimo-apollo-preview`   | Container image with the `it-IT` locale and `it-IT-Cosimo-Apollo` voice.   |
| `1.3.0-amd64-it-it-luciarus-preview`        | Container image with the `it-IT` locale and `it-IT-LuciaRUS` voice.        |
| `1.3.0-amd64-ja-jp-ayumi-apollo-preview`    | Container image with the `ja-JP` locale and `ja-JP-Ayumi-Apollo` voice.    |
| `1.3.0-amd64-ja-jp-harukarus-preview`       | Container image with the `ja-JP` locale and `ja-JP-HarukaRUS` voice.       |
| `1.3.0-amd64-ja-jp-ichiro-apollo-preview`   | Container image with the `ja-JP` locale and `ja-JP-Ichiro-Apollo` voice.   |
| `1.3.0-amd64-ko-kr-heamirus-preview`        | Container image with the `ko-KR` locale and `ko-KR-HeamiRUS` voice.        |
| `1.3.0-amd64-ms-my-rizwan-preview`          | Container image with the `ms-MY` locale and `ms-MY-Rizwan` voice.          |
| `1.3.0-amd64-nb-no-huldarus-preview`        | Container image with the `nb-NO` locale and `nb-NO-HuldaRUS` voice.        |
| `1.3.0-amd64-nl-nl-hannarus-preview`        | Container image with the `nl-NL` locale and `nl-NL-HannaRUS` voice.        |
| `1.3.0-amd64-pl-pl-paulinarus-preview`      | Container image with the `pl-PL` locale and `pl-PL-PaulinaRUS` voice.      |
| `1.3.0-amd64-pt-br-daniel-apollo-preview`   | Container image with the `pt-BR` locale and `pt-BR-Daniel-Apollo` voice.   |
| `1.3.0-amd64-pt-br-heloisarus-preview`      | Container image with the `pt-BR` locale and `pt-BR-HeloisaRUS` voice.      |
| `1.3.0-amd64-pt-pt-heliarus-preview`        | Container image with the `pt-PT` locale and `pt-PT-HeliaRUS` voice.        |
| `1.3.0-amd64-ro-ro-andrei-preview`          | Container image with the `ro-RO` locale and `ro-RO-Andrei` voice.          |
| `1.3.0-amd64-ru-ru-ekaterinarus-preview`    | Container image with the `ru-RU` locale and `ru-RU-EkaterinaRUS` voice.    |
| `1.3.0-amd64-ru-ru-irina-apollo-preview`    | Container image with the `ru-RU` locale and `ru-RU-Irina-Apollo` voice.    |
| `1.3.0-amd64-ru-ru-pavel-apollo-preview`    | Container image with the `ru-RU` locale and `ru-RU-Pavel-Apollo` voice.    |
| `1.3.0-amd64-sk-sk-filip-preview`           | Container image with the `sk-SK` locale and `sk-SK-Filip` voice.           |
| `1.3.0-amd64-sl-si-lado-preview`            | Container image with the `sl-SI` locale and `sl-SI-Lado` voice.            |
| `1.3.0-amd64-sv-se-hedvigrus-preview`       | Container image with the `sv-SE` locale and `sv-SE-HedvigRUS` voice.       |
| `1.3.0-amd64-ta-in-valluvar-preview`        | Container image with the `ta-IN` locale and `ta-IN-Valluvar` voice.        |
| `1.3.0-amd64-te-in-chitra-preview`          | Container image with the `te-IN` locale and `te-IN-Chitra` voice.          |
| `1.3.0-amd64-th-th-pattara-preview`         | Container image with the `th-TH` locale and `th-TH-Pattara` voice.         |
| `1.3.0-amd64-tr-tr-sedarus-preview`         | Container image with the `tr-TR` locale and `tr-TR-SedaRUS` voice.         |
| `1.3.0-amd64-vi-vn-an-preview`              | Container image with the `vi-VN` locale and `vi-VN-An` voice.              |
| `1.3.0-amd64-zh-cn-huihuirus-preview`       | Container image with the `zh-CN` locale and `zh-CN-HuihuiRUS` voice.       |
| `1.3.0-amd64-zh-cn-kangkang-apollo-preview` | Container image with the `zh-CN` locale and `zh-CN-Kangkang-Apollo` voice. |
| `1.3.0-amd64-zh-cn-yaoyao-apollo-preview`   | Container image with the `zh-CN` locale and `zh-CN-Yaoyao-Apollo` voice.   |
| `1.3.0-amd64-zh-hk-danny-apollo-preview`    | Container image with the `zh-HK` locale and `zh-HK-Danny-Apollo` voice.    |
| `1.3.0-amd64-zh-hk-tracy-apollo-preview`    | Container image with the `zh-HK` locale and `zh-HK-Tracy-Apollo` voice.    |
| `1.3.0-amd64-zh-hk-tracyrus-preview`        | Container image with the `zh-HK` locale and `zh-HK-TracyRUS` voice.        |
| `1.3.0-amd64-zh-tw-hanhanrus-preview`       | Container image with the `zh-TW` locale and `zh-TW-HanHanRUS` voice.       |
| `1.3.0-amd64-zh-tw-yating-apollo-preview`   | Container image with the `zh-TW` locale and `zh-TW-Yating-Apollo` voice.   |
| `1.3.0-amd64-zh-tw-zhiwei-apollo-preview`   | Container image with the `zh-TW` locale and `zh-TW-Zhiwei-Apollo` voice.   |
| `1.2.0-amd64-de-de-heddarus-preview`        | Container image with the `de-DE` locale and `de-DE-Hedda` voice.           |
| `1.2.0-amd64-de-de-heddarus-preview`        | Container image with the `de-DE` locale and `de-DE-HeddaRUS` voice.        |
| `1.2.0-amd64-de-de-stefan-apollo-preview`   | Container image with the `de-DE` locale and `de-DE-Stefan-Apollo` voice.   |
| `1.2.0-amd64-en-au-catherine-preview`       | Container image with the `en-AU` locale and `en-AU-Catherine` voice.       |
| `1.2.0-amd64-en-au-hayleyrus-preview`       | Container image with the `en-AU` locale and `en-AU-HayleyRUS` voice.       |
| `1.2.0-amd64-en-gb-george-apollo-preview`   | Container image with the `en-GB` locale and `en-GB-George-Apollo` voice.   |
| `1.2.0-amd64-en-gb-hazelrus-preview`        | Container image with the `en-GB` locale and `en-GB-HazelRUS` voice.        |
| `1.2.0-amd64-en-gb-susan-apollo-preview`    | Container image with the `en-GB` locale and `en-GB-Susan-Apollo` voice.    |
| `1.2.0-amd64-en-in-heera-apollo-preview`    | Container image with the `en-IN` locale and `en-IN-Heera-Apollo` voice.    |
| `1.2.0-amd64-en-in-priyarus-preview`        | Container image with the `en-IN` locale and `en-IN-PriyaRUS` voice.        |
| `1.2.0-amd64-en-in-ravi-apollo-preview`     | Container image with the `en-IN` locale and `en-IN-Ravi-Apollo` voice.     |
| `1.2.0-amd64-en-us-benjaminrus-preview`     | Container image with the `en-US` locale and `en-US-BenjaminRUS` voice.     |
| `1.2.0-amd64-en-us-guy24krus-preview`       | Container image with the `en-US` locale and `en-US-Guy24kRUS` voice.       |
| `1.2.0-amd64-en-us-jessa24krus-preview`     | Container image with the `en-US` locale and `en-US-Jessa24kRUS` voice.     |
| `1.2.0-amd64-en-us-jessarus-preview`        | Container image with the `en-US` locale and `en-US-JessaRUS` voice.        |
| `1.2.0-amd64-en-us-zirarus-preview`         | Container image with the `en-US` locale and `en-US-ZiraRUS` voice.         |
| `1.2.0-amd64-es-es-helenarus-preview`       | Container image with the `es-ES` locale and `es-ES-HelenaRUS` voice.       |
| `1.2.0-amd64-es-es-laura-apollo-preview`    | Container image with the `es-ES` locale and `es-ES-Laura-Apollo` voice.    |
| `1.2.0-amd64-es-es-pablo-apollo-preview`    | Container image with the `es-ES` locale and `es-ES-Pablo-Apollo` voice.    |
| `1.2.0-amd64-es-mx-hildarus-preview`        | Container image with the `es-MX` locale and `es-MX-HildaRUS` voice.        |
| `1.2.0-amd64-es-mx-raul-apollo-preview`     | Container image with the `es-MX` locale and `es-MX-Raul-Apollo` voice.     |
| `1.2.0-amd64-fr-ca-caroline-preview`        | Container image with the `fr-CA` locale and `fr-CA-Caroline` voice.        |
| `1.2.0-amd64-fr-ca-harmonierus-preview`     | Container image with the `fr-CA` locale and `fr-CA-HarmonieRUS` voice.     |
| `1.2.0-amd64-fr-fr-hortenserus-preview`     | Container image with the `fr-FR` locale and `fr-FR-HortenseRUS` voice.     |
| `1.2.0-amd64-fr-fr-julie-apollo-preview`    | Container image with the `fr-FR` locale and `fr-FR-Julie-Apollo` voice.    |
| `1.2.0-amd64-fr-fr-paul-apollo-preview`     | Container image with the `fr-FR` locale and `fr-FR-Paul-Apollo` voice.     |
| `1.2.0-amd64-it-it-cosimo-apollo-preview`   | Container image with the `it-IT` locale and `it-IT-Cosimo-Apollo` voice.   |
| `1.2.0-amd64-it-it-luciarus-preview`        | Container image with the `it-IT` locale and `it-IT-LuciaRUS` voice.        |
| `1.2.0-amd64-ja-jp-ayumi-apollo-preview`    | Container image with the `ja-JP` locale and `ja-JP-Ayumi-Apollo` voice.    |
| `1.2.0-amd64-ja-jp-harukarus-preview`       | Container image with the `ja-JP` locale and `ja-JP-HarukaRUS` voice.       |
| `1.2.0-amd64-ja-jp-ichiro-apollo-preview`   | Container image with the `ja-JP` locale and `ja-JP-Ichiro-Apollo` voice.   |
| `1.2.0-amd64-ko-kr-heamirus-preview`        | Container image with the `ko-KR` locale and `ko-KR-HeamiRUS` voice.        |
| `1.2.0-amd64-pt-br-daniel-apollo-preview`   | Container image with the `pt-BR` locale and `pt-BR-Daniel-Apollo` voice.   |
| `1.2.0-amd64-pt-br-heloisarus-preview`      | Container image with the `pt-BR` locale and `pt-BR-HeloisaRUS` voice.      |
| `1.2.0-amd64-zh-cn-huihuirus-preview`       | Container image with the `zh-CN` locale and `zh-CN-HuihuiRUS` voice.       |
| `1.2.0-amd64-zh-cn-kangkang-apollo-preview` | Container image with the `zh-CN` locale and `zh-CN-Kangkang-Apollo` voice. |
| `1.2.0-amd64-zh-cn-yaoyao-apollo-preview`   | Container image with the `zh-CN` locale and `zh-CN-Yaoyao-Apollo` voice.   |
| `1.1.0-amd64-de-de-hedda-preview`           | Container image with the `de-DE` locale and `de-DE-Hedda` voice.           |
| `1.1.0-amd64-de-de-heddarus-preview`        | Container image with the `de-DE` locale and `de-DE-Hedda` voice.           |
| `1.1.0-amd64-de-de-heddarus-preview`        | Container image with the `de-DE` locale and `de-DE-HeddaRUS` voice.        |
| `1.1.0-amd64-de-de-stefan-apollo-preview`   | Container image with the `de-DE` locale and `de-DE-Stefan-Apollo` voice.   |
| `1.1.0-amd64-en-au-catherine-preview`       | Container image with the `en-AU` locale and `en-AU-Catherine` voice.       |
| `1.1.0-amd64-en-au-hayleyrus-preview`       | Container image with the `en-AU` locale and `en-AU-HayleyRUS` voice.       |
| `1.1.0-amd64-en-gb-george-apollo-preview`   | Container image with the `en-GB` locale and `en-GB-George-Apollo` voice.   |
| `1.1.0-amd64-en-gb-hazelrus-preview`        | Container image with the `en-GB` locale and `en-GB-HazelRUS` voice.        |
| `1.1.0-amd64-en-gb-susan-apollo-preview`    | Container image with the `en-GB` locale and `en-GB-Susan-Apollo` voice.    |
| `1.1.0-amd64-en-in-heera-apollo-preview`    | Container image with the `en-IN` locale and `en-IN-Heera-Apollo` voice.    |
| `1.1.0-amd64-en-in-priyarus-preview`        | Container image with the `en-IN` locale and `en-IN-PriyaRUS` voice.        |
| `1.1.0-amd64-en-in-ravi-apollo-preview`     | Container image with the `en-IN` locale and `en-IN-Ravi-Apollo` voice.     |
| `1.1.0-amd64-en-us-benjaminrus-preview`     | Container image with the `en-US` locale and `en-US-BenjaminRUS` voice.     |
| `1.1.0-amd64-en-us-guy24krus-preview`       | Container image with the `en-US` locale and `en-US-Guy24kRUS` voice.       |
| `1.1.0-amd64-en-us-jessa24krus-preview`     | Container image with the `en-US` locale and `en-US-Jessa24kRUS` voice.     |
| `1.1.0-amd64-en-us-jessarus-preview`        | Container image with the `en-US` locale and `en-US-JessaRUS` voice.        |
| `1.1.0-amd64-en-us-zirarus-preview`         | Container image with the `en-US` locale and `en-US-ZiraRUS` voice.         |
| `1.1.0-amd64-es-es-helenarus-preview`       | Container image with the `es-ES` locale and `es-ES-HelenaRUS` voice.       |
| `1.1.0-amd64-es-es-laura-apollo-preview`    | Container image with the `es-ES` locale and `es-ES-Laura-Apollo` voice.    |
| `1.1.0-amd64-es-es-pablo-apollo-preview`    | Container image with the `es-ES` locale and `es-ES-Pablo-Apollo` voice.    |
| `1.1.0-amd64-es-mx-hildarus-preview`        | Container image with the `es-MX` locale and `es-MX-HildaRUS` voice.        |
| `1.1.0-amd64-es-mx-raul-apollo-preview`     | Container image with the `es-MX` locale and `es-MX-Raul-Apollo` voice.     |
| `1.1.0-amd64-fr-ca-caroline-preview`        | Container image with the `fr-CA` locale and `fr-CA-Caroline` voice.        |
| `1.1.0-amd64-fr-ca-harmonierus-preview`     | Container image with the `fr-CA` locale and `fr-CA-HarmonieRUS` voice.     |
| `1.1.0-amd64-fr-fr-hortenserus-preview`     | Container image with the `fr-FR` locale and `fr-FR-HortenseRUS` voice.     |
| `1.1.0-amd64-fr-fr-julie-apollo-preview`    | Container image with the `fr-FR` locale and `fr-FR-Julie-Apollo` voice.    |
| `1.1.0-amd64-fr-fr-paul-apollo-preview`     | Container image with the `fr-FR` locale and `fr-FR-Paul-Apollo` voice.     |
| `1.1.0-amd64-it-it-cosimo-apollo-preview`   | Container image with the `it-IT` locale and `it-IT-Cosimo-Apollo` voice.   |
| `1.1.0-amd64-it-it-luciarus-preview`        | Container image with the `it-IT` locale and `it-IT-LuciaRUS` voice.        |
| `1.1.0-amd64-ja-jp-ayumi-apollo-preview`    | Container image with the `ja-JP` locale and `ja-JP-Ayumi-Apollo` voice.    |
| `1.1.0-amd64-ja-jp-harukarus-preview`       | Container image with the `ja-JP` locale and `ja-JP-HarukaRUS` voice.       |
| `1.1.0-amd64-ja-jp-ichiro-apollo-preview`   | Container image with the `ja-JP` locale and `ja-JP-Ichiro-Apollo` voice.   |
| `1.1.0-amd64-ko-kr-heamirus-preview`        | Container image with the `ko-KR` locale and `ko-KR-HeamiRUS` voice.        |
| `1.1.0-amd64-pt-br-daniel-apollo-preview`   | Container image with the `pt-BR` locale and `pt-BR-Daniel-Apollo` voice.   |
| `1.1.0-amd64-pt-br-heloisarus-preview`      | Container image with the `pt-BR` locale and `pt-BR-HeloisaRUS` voice.      |
| `1.1.0-amd64-zh-cn-huihuirus-preview`       | Container image with the `zh-CN` locale and `zh-CN-HuihuiRUS` voice.       |
| `1.1.0-amd64-zh-cn-kangkang-apollo-preview` | Container image with the `zh-CN` locale and `zh-CN-Kangkang-Apollo` voice. |
| `1.1.0-amd64-zh-cn-yaoyao-apollo-preview`   | Container image with the `zh-CN` locale and `zh-CN-Yaoyao-Apollo` voice.   |
| `1.0.0-amd64-en-us-benjaminrus-preview`     | Container image with the `en-US` locale and `en-US-BenjaminRUS` voice.     |
| `1.0.0-amd64-en-us-guy24krus-preview`       | Container image with the `en-US` locale and `en-US-Guy24kRUS` voice.       |
| `1.0.0-amd64-en-us-jessa24krus-preview`     | Container image with the `en-US` locale and `en-US-Jessa24kRUS` voice.     |
| `1.0.0-amd64-en-us-jessarus-preview`        | Container image with the `en-US` locale and `en-US-JessaRUS` voice.        |
| `1.0.0-amd64-en-us-zirarus-preview`         | Container image with the `en-US` locale and `en-US-ZiraRUS` voice.         |
| `1.0.0-amd64-zh-cn-huihuirus-preview`       | Container image with the `zh-CN` locale and `zh-CN-HuihuiRUS` voice.       |
| `1.0.0-amd64-zh-cn-kangkang-apollo-preview` | Container image with the `zh-CN` locale and `zh-CN-Kangkang-Apollo` voice. |
| `1.0.0-amd64-zh-cn-yaoyao-apollo-preview`   | Container image with the `zh-CN` locale and `zh-CN-Yaoyao-Apollo` voice.   |

## Key Phrase Extraction

The [Key Phrase Extraction][ta-kp] container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services` repository and is named `keyphrase`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/keyphrase`.

This container image has the following tags available:

| Image Tags                    | Notes |
|-------------------------------|:------|
| `latest`                      |       |
| `1.1.009301-amd64-preview`    |       |
| `1.1.008510001-amd64-preview` |       |
| `1.1.007750002-amd64-preview` |       |
| `1.1.007360001-amd64-preview` |       |
| `1.1.006770001-amd64-preview` |       |

## Language Detection

The [Language Detection][ta-la] container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services` repository and is named `language`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/language`.

This container image has the following tags available:

| Image Tags                    | Notes |
|-------------------------------|:------|
| `latest`                      |       |
| `1.1.009301-amd64-preview`    |       |
| `1.1.008510001-amd64-preview` |       |
| `1.1.007750002-amd64-preview` |       |
| `1.1.007360001-amd64-preview` |       |
| `1.1.006770001-amd64-preview` |       |

## Sentiment Analysis

The [Sentiment Analysis][ta-se] container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services` repository and is named `sentiment`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/sentiment`.

This container image has the following tags available:

| Image Tags | Notes                                         |
|------------|:----------------------------------------------|
| `latest`   |                                               |
| `3.0-en`   | Sentiment Analysis v3 (English)               |
| `3.0-es`   | Sentiment Analysis v3 (Spanish)               |
| `3.0-fr`   | Sentiment Analysis v3 (French)                |
| `3.0-it`   | Sentiment Analysis v3 (Italian)               |
| `3.0-de`   | Sentiment Analysis v3 (German)                |
| `3.0-zh`   | Sentiment Analysis v3 (Chinese - simplified)  |
| `3.0-zht`  | Sentiment Analysis v3 (Chinese - traditional) |
| `3.0-ja`   | Sentiment Analysis v3 (Japanese)              |
| `3.0-pt`   | Sentiment Analysis v3 (Portuguese)            |
| `3.0-nl`   | Sentiment Analysis v3 (Dutch)                 |
| `1.1.009301-amd64-preview`    | Sentiment Analysis v2      |
| `1.1.008510001-amd64-preview` |       |
| `1.1.007750002-amd64-preview` |       |
| `1.1.007360001-amd64-preview` |       |
| `1.1.006770001-amd64-preview` |       |

[ad-containers]: ../anomaly-Detector/anomaly-detector-container-howto.md
[cv-containers]: ../computer-vision/computer-vision-how-to-install-containers.md
[fa-containers]: ../face/face-how-to-install-containers.md
[fr-containers]: ../form-recognizer/form-recognizer-container-howto.md
[lu-containers]: ../luis/luis-container-howto.md
[sp-stt]: ../speech-service/speech-container-howto.md?tabs=stt
[sp-cstt]: ../speech-service/speech-container-howto.md?tabs=cstt
[sp-tts]: ../speech-service/speech-container-howto.md?tabs=tts
[sp-ctts]: ../speech-service/speech-container-howto.md?tabs=ctts
[ta-kp]: ../text-analytics/how-tos/text-analytics-how-to-install-containers.md?tabs=keyphrase
[ta-la]: ../text-analytics/how-tos/text-analytics-how-to-install-containers.md?tabs=language
[ta-se]: ../text-analytics/how-tos/text-analytics-how-to-install-containers.md?tabs=sentiment
