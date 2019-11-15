---
title: Cognitive Services container image tags
titleSuffix: Azure Cognitive Services
description: A comprehensive listing of all the Cognitive Service container image tags.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.topic: reference
ms.date: 11/15/2019
ms.author: dapine
---

# Azure Cognitive Services container image tags

Azure Cognitive Services offers many container images. The container registries and corresponding repositories vary between container images. Each container image name offers multiple tags. A container image tag is a mechanism of versioning the container image. This article is intended to be used as a comprehensive reference for listing all the Cognitive Services container images and their available tags.

> [!TIP]
> When using [`docker pull`](https://docs.docker.com/engine/reference/commandline/pull/), pay close attention to the casing of the container registry, repository, container image name and corresponding tag - as they are **case sensitive**.

## Anomaly Detector

The [Anomaly Detector][ad-containers] container image can be found on the `containerpreview.azurecr.io` container registry. It resides within the `microsoft` repository and is named `cognitive-services-anomaly-detector`. The fully qualified container image name is, `containerpreview.azurecr.io/microsoft/cognitive-services-anomaly-detector`.

This container image has the following tags available:

| Image Tags | Notes |
|------------|:------|
| `latest` | |
| `1.1.009301-amd64-preview` | |
| `1.1.008500001-amd64-preview` | |

## Computer Vision

The [Computer Vision][cv-containers] container image can be found on the `containerpreview.azurecr.io` container registry. It resides within the `microsoft` repository and is named `cognitive-services-read`. The fully qualified container image name is, `containerpreview.azurecr.io/microsoft/cognitive-services-read`.

This container image has the following tags available:

| Image Tags | Notes |
|------------|:------|
| `latest` | |
| `1.1.009920003-amd64-preview` | |
| `1.1.009910003-amd64-preview` | |

## Face

The [Face][fa-containers] container image can be found on the `containerpreview.azurecr.io` container registry. It resides within the `microsoft` repository and is named `cognitive-services-face`. The fully qualified container image name is, `containerpreview.azurecr.io/microsoft/cognitive-services-face`.

This container image has the following tags available:

| Image Tags | Notes |
|------------|:------|
| `latest` | |
| `1.1.009301-amd64-preview` | |
| `1.1.008710001-amd64-preview` | |
| `1.1.007750002-amd64-preview` | |
| `1.1.007360001-amd64-preview` | |
| `1.1.006770001-amd64-preview` | |
| `1.1.006490002-amd64-preview` | |
| `1.0.005940002-amd64-preview` | |
| `1.0.005550001-amd64-preview` | |

## Form Recognizer

The [Form Recognizer][fr-containers] container image can be found on the `containerpreview.azurecr.io` container registry. It resides within the `microsoft` repository and is named `cognitive-services-form-recognizer`. The fully qualified container image name is, `containerpreview.azurecr.io/microsoft/cognitive-services-form-recognizer`.

This container image has the following tags available:

| Image Tags | Notes |
|------------|:------|
| `latest` | |
| `1.1.009301-amd64-preview` | |
| `1.1.008640001-amd64-preview` | |
| `1.1.008510001-amd64-preview` | |

## Language Understanding (LUIS)

The [LUIS][lu-containers] container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services` repository and is named `luis`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/luis`.

This container image has the following tags available:

| Image Tags | Notes |
|------------|:------|
| `latest` | |
| `1.1.010330004-amd64-preview` | |
| `1.1.009301-amd64-preview` | |
| `1.1.008710001-amd64-preview` | |
| `1.1.008510001-amd64-preview` | |
| `1.1.008010002-amd64-preview` | |
| `1.1.007750002-amd64-preview` | |
| `1.1.007360001-amd64-preview` | |
| `1.1.007020001-amd64-preview` | |

## Custom Speech-to-text

The [Custom Speech-to-text][sp-cstt] container image can be found on the `containerpreview.azurecr.io` container registry. It resides within the `microsoft` repository and is named `cognitive-services-custom-speech-to-text`. The fully qualified container image name is, `containerpreview.azurecr.io/microsoft/cognitive-services-custom-speech-to-text`.

This container image has the following tags available:

| Image Tags | Notes |
|------------|:------|
| `latest` | |
| `2.0.0-amd64-preview` | |

## Custom Text-to-speech

The [Custom Text-to-speech][sp-ctts] container image can be found on the `containerpreview.azurecr.io` container registry. It resides within the `microsoft` repository and is named `cognitive-services-custom-text-to-speech`. The fully qualified container image name is, `containerpreview.azurecr.io/microsoft/cognitive-services-custom-text-to-speech`.

This container image has the following tags available:

| Image Tags | Notes |
|------------|:------|
| `latest` | |
| `1.3.0-amd64-preview` | |

## Speech-to-text

The [Speech-to-text][sp-stt] container image can be found on the `containerpreview.azurecr.io` container registry. It resides within the `microsoft` repository and is named `cognitive-services-speech-to-text`. The fully qualified container image name is, `containerpreview.azurecr.io/microsoft/cognitive-services-speech-to-text`.

This container image has the following tags available:

| Image Tags | Notes |
|------------|:------|
| `latest` | Container image with the `en-US` locale. |
| `2.0.0-amd64-zh-tw-preview` | |
| `2.0.0-amd64-zh-hk-preview` | |
| `2.0.0-amd64-zh-cn-preview` | |
| `2.0.0-amd64-tr-tr-preview` | |
| `2.0.0-amd64-th-th-preview` | |
| `2.0.0-amd64-sv-se-preview` | |
| `2.0.0-amd64-ru-ru-preview` | |
| `2.0.0-amd64-pt-pt-preview` | |
| `2.0.0-amd64-pt-br-preview` | |
| `2.0.0-amd64-pl-pl-preview` | |
| `2.0.0-amd64-nl-nl-preview` | |
| `2.0.0-amd64-nb-no-preview` | |
| `2.0.0-amd64-ko-kr-preview` | |
| `2.0.0-amd64-ja-jp-preview` | |
| `2.0.0-amd64-it-it-preview` | |
| `2.0.0-amd64-hi-in-preview` | |
| `2.0.0-amd64-fr-fr-preview` | |
| `2.0.0-amd64-fr-ca-preview` | |
| `2.0.0-amd64-fi-fi-preview` | |
| `2.0.0-amd64-es-mx-preview` | |
| `2.0.0-amd64-es-es-preview` | |
| `2.0.0-amd64-en-us-preview` | |
| `2.0.0-amd64-en-nz-preview` | |
| `2.0.0-amd64-en-in-preview` | |
| `2.0.0-amd64-en-gb-preview` | |
| `2.0.0-amd64-en-ca-preview` | |
| `2.0.0-amd64-en-au-preview` | |
| `2.0.0-amd64-de-de-preview` | |
| `2.0.0-amd64-da-dk-preview` | |
| `2.0.0-amd64-ca-es-preview` | |
| `2.0.0-amd64-ar-eg-preview` | |
| `1.2.0-amd64-zh-cn-preview` | |
| `1.2.0-amd64-pt-br-preview` | |
| `1.2.0-amd64-preview` | |
| `1.2.0-amd64-ja-jp-preview` | |
| `1.2.0-amd64-it-it-preview` | |
| `1.2.0-amd64-fr-fr-preview` | |
| `1.2.0-amd64-fr-ca-preview` | |
| `1.2.0-amd64-es-mx-preview` | |
| `1.2.0-amd64-es-es-preview` | |
| `1.2.0-amd64-en-us-preview` | |
| `1.2.0-amd64-en-in-preview` | |
| `1.2.0-amd64-en-gb-preview` | |
| `1.2.0-amd64-en-ca-preview` | |
| `1.2.0-amd64-en-au-preview` | |
| `1.2.0-amd64-de-de-preview` | |
| `1.1.3-amd64-zh-cn-preview` | |
| `1.1.3-amd64-pt-br-preview` | |
| `1.1.3-amd64-preview` | |
| `1.1.3-amd64-ja-jp-preview` | |
| `1.1.3-amd64-it-it-preview` | |
| `1.1.3-amd64-fr-fr-preview` | |
| `1.1.3-amd64-fr-ca-preview` | |
| `1.1.3-amd64-es-mx-preview` | |
| `1.1.3-amd64-es-es-preview` | |
| `1.1.3-amd64-en-us-preview` | |
| `1.1.3-amd64-en-in-preview` | |
| `1.1.3-amd64-en-gb-preview` | |
| `1.1.3-amd64-en-ca-preview` | |
| `1.1.3-amd64-en-au-preview` | |
| `1.1.3-amd64-de-de-preview` | |
| `1.1.2-amd64-zh-cn-preview` | |
| `1.1.2-amd64-pt-br-preview` | |
| `1.1.2-amd64-preview` | |
| `1.1.2-amd64-ja-jp-preview` | |
| `1.1.2-amd64-it-it-preview` | |
| `1.1.2-amd64-fr-fr-preview` | |
| `1.1.2-amd64-fr-ca-preview` | |
| `1.1.2-amd64-es-mx-preview` | |
| `1.1.2-amd64-es-es-preview` | |
| `1.1.2-amd64-en-us-preview` | |
| `1.1.2-amd64-en-in-preview` | |
| `1.1.2-amd64-en-gb-preview` | |
| `1.1.2-amd64-en-ca-preview` | |
| `1.1.2-amd64-en-au-preview` | |
| `1.1.2-amd64-de-de-preview` | |
| `1.1.1-amd64-zh-cn-preview` | |
| `1.1.1-amd64-pt-br-preview` | |
| `1.1.1-amd64-ja-jp-preview` | |
| `1.1.1-amd64-it-it-preview` | |
| `1.1.1-amd64-fr-fr-preview` | |
| `1.1.1-amd64-fr-ca-preview` | |
| `1.1.1-amd64-es-mx-preview` | |
| `1.1.1-amd64-es-es-preview` | |
| `1.1.1-amd64-en-us-preview` | |
| `1.1.1-amd64-en-in-preview` | |
| `1.1.1-amd64-en-gb-preview` | |
| `1.1.1-amd64-en-ca-preview` | |
| `1.1.1-amd64-en-au-preview` | |
| `1.1.1-amd64-de-de-preview` | |
| `1.1.0-amd64-zh-cn-preview` | |
| `1.1.0-amd64-pt-br-preview` | |
| `1.1.0-amd64-ja-jp-preview` | |
| `1.1.0-amd64-it-it-preview` | |
| `1.1.0-amd64-fr-fr-preview` | |
| `1.1.0-amd64-fr-ca-preview` | |
| `1.1.0-amd64-es-mx-preview` | |
| `1.1.0-amd64-es-es-preview` | |
| `1.1.0-amd64-en-us-preview` | |
| `1.1.0-amd64-en-in-preview` | |
| `1.1.0-amd64-en-gb-preview` | |
| `1.1.0-amd64-en-ca-preview` | |
| `1.1.0-amd64-en-au-preview` | |
| `1.1.0-amd64-de-de-preview` | |
| `1.0.0-amd64-zh-cn-preview` | |
| `1.0.0-amd64-pt-br-preview` | |
| `1.0.0-amd64-ja-jp-preview` | |
| `1.0.0-amd64-it-it-preview` | |
| `1.0.0-amd64-fr-fr-preview` | |
| `1.0.0-amd64-fr-ca-preview` | |
| `1.0.0-amd64-es-mx-preview` | |
| `1.0.0-amd64-es-es-preview` | |
| `1.0.0-amd64-en-us-preview` | |
| `1.0.0-amd64-en-in-preview` | |
| `1.0.0-amd64-en-gb-preview` | |
| `1.0.0-amd64-en-ca-preview` | |
| `1.0.0-amd64-en-au-preview` | |
| `1.0.0-amd64-de-de-preview` | |

## Text-to-speech

The [Text-to-speech][sp-tts] container image can be found on the `containerpreview.azurecr.io` container registry. It resides within the `microsoft` repository and is named `cognitive-services-text-to-speech`. The fully qualified container image name is, `containerpreview.azurecr.io/microsoft/cognitive-services-text-to-speech`.

This container image has the following tags available:

| Image Tags | Notes |
|------------|:------|
| `latest` | Container image with the `en-US` locale and `JessaRUS` voice. |
| `1.3.0-amd64-zh-tw-zhiwei-apollo-preview` | |
| `1.3.0-amd64-zh-tw-yating-apollo-preview` | |
| `1.3.0-amd64-zh-tw-hanhanrus-preview` | |
| `1.3.0-amd64-zh-hk-tracyrus-preview` | |
| `1.3.0-amd64-zh-hk-tracy-apollo-preview` | |
| `1.3.0-amd64-zh-hk-danny-apollo-preview` | |
| `1.3.0-amd64-zh-cn-yaoyao-apollo-preview` | |
| `1.3.0-amd64-zh-cn-kangkang-apollo-preview` | |
| `1.3.0-amd64-zh-cn-huihuirus-preview` | |
| `1.3.0-amd64-vi-vn-an-preview` | |
| `1.3.0-amd64-tr-tr-sedarus-preview` | |
| `1.3.0-amd64-th-th-pattara-preview` | |
| `1.3.0-amd64-te-in-chitra-preview` | |
| `1.3.0-amd64-ta-in-valluvar-preview` | |
| `1.3.0-amd64-sv-se-hedvigrus-preview` | |
| `1.3.0-amd64-sl-si-lado-preview` | |
| `1.3.0-amd64-sk-sk-filip-preview` | |
| `1.3.0-amd64-ru-ru-pavel-apollo-preview` | |
| `1.3.0-amd64-ru-ru-irina-apollo-preview` | |
| `1.3.0-amd64-ru-ru-ekaterinarus-preview` | |
| `1.3.0-amd64-ro-ro-andrei-preview` | |
| `1.3.0-amd64-pt-pt-heliarus-preview` | |
| `1.3.0-amd64-pt-br-heloisarus-preview` | |
| `1.3.0-amd64-pt-br-daniel-apollo-preview` | |
| `1.3.0-amd64-pl-pl-paulinarus-preview` | |
| `1.3.0-amd64-nl-nl-hannarus-preview` | |
| `1.3.0-amd64-nb-no-huldarus-preview` | |
| `1.3.0-amd64-ms-my-rizwan-preview` | |
| `1.3.0-amd64-ko-kr-heamirus-preview` | |
| `1.3.0-amd64-ja-jp-ichiro-apollo-preview` | |
| `1.3.0-amd64-ja-jp-harukarus-preview` | |
| `1.3.0-amd64-ja-jp-ayumi-apollo-preview` | |
| `1.3.0-amd64-it-it-luciarus-preview` | |
| `1.3.0-amd64-it-it-cosimo-apollo-preview` | |
| `1.3.0-amd64-id-id-andika-preview` | |
| `1.3.0-amd64-hu-hu-szabolcs-preview` | |
| `1.3.0-amd64-hr-hr-matej-preview` | |
| `1.3.0-amd64-hi-in-kalpana-preview` | |
| `1.3.0-amd64-hi-in-kalpana-apollo-preview` | |
| `1.3.0-amd64-hi-in-hemant-preview` | |
| `1.3.0-amd64-he-il-asaf-preview` | |
| `1.3.0-amd64-fr-fr-paul-apollo-preview` | |
| `1.3.0-amd64-fr-fr-julie-apollo-preview` | |
| `1.3.0-amd64-fr-fr-hortenserus-preview` | |
| `1.3.0-amd64-fr-ch-guillaume-preview` | |
| `1.3.0-amd64-fr-ca-harmonierus-preview` | |
| `1.3.0-amd64-fr-ca-caroline-preview` | |
| `1.3.0-amd64-fi-fi-heidirus-preview` | |
| `1.3.0-amd64-es-mx-raul-apollo-preview` | |
| `1.3.0-amd64-es-mx-hildarus-preview` | |
| `1.3.0-amd64-es-es-pablo-apollo-preview` | |
| `1.3.0-amd64-es-es-laura-apollo-preview` | |
| `1.3.0-amd64-es-es-helenarus-preview` | |
| `1.3.0-amd64-en-us-zirarus-preview` | |
| `1.3.0-amd64-en-us-jessarus-preview` | |
| `1.3.0-amd64-en-us-jessa24krus-preview` | |
| `1.3.0-amd64-en-us-guy24krus-preview` | |
| `1.3.0-amd64-en-us-benjaminrus-preview` | |
| `1.3.0-amd64-en-in-ravi-apollo-preview` | |
| `1.3.0-amd64-en-in-priyarus-preview` | |
| `1.3.0-amd64-en-in-heera-apollo-preview` | |
| `1.3.0-amd64-en-ie-sean-preview` | |
| `1.3.0-amd64-en-gb-susan-apollo-preview` | |
| `1.3.0-amd64-en-gb-hazelrus-preview` | |
| `1.3.0-amd64-en-gb-george-apollo-preview` | |
| `1.3.0-amd64-en-ca-linda-preview` | |
| `1.3.0-amd64-en-ca-heatherrus-preview` | |
| `1.3.0-amd64-en-au-hayleyrus-preview` | |
| `1.3.0-amd64-en-au-catherine-preview` | |
| `1.3.0-amd64-el-gr-stefanos-preview` | |
| `1.3.0-amd64-de-de-stefan-apollo-preview` | |
| `1.3.0-amd64-de-de-heddarus-preview` | |
| `1.3.0-amd64-de-de-hedda-preview` | |
| `1.3.0-amd64-de-ch-karsten-preview` | |
| `1.3.0-amd64-de-at-michael-preview` | |
| `1.3.0-amd64-da-dk-hellerus-preview` | |
| `1.3.0-amd64-cs-cz-jakub-preview` | |
| `1.3.0-amd64-ca-es-herenarus-preview` | |
| `1.3.0-amd64-bg-bg-ivan-preview` | |
| `1.3.0-amd64-ar-sa-naayf-preview` | |
| `1.3.0-amd64-ar-eg-hoda-preview` | |
| `1.2.0-amd64-zh-cn-yaoyao-apollo-preview` | |
| `1.2.0-amd64-zh-cn-kangkang-apollo-preview` | |
| `1.2.0-amd64-zh-cn-huihuirus-preview` | |
| `1.2.0-amd64-pt-br-heloisarus-preview` | |
| `1.2.0-amd64-pt-br-daniel-apollo-preview` | |
| `1.2.0-amd64-ko-kr-heamirus-preview` | |
| `1.2.0-amd64-ja-jp-ichiro-apollo-preview` | |
| `1.2.0-amd64-ja-jp-harukarus-preview` | |
| `1.2.0-amd64-ja-jp-ayumi-apollo-preview` | |
| `1.2.0-amd64-it-it-luciarus-preview` | |
| `1.2.0-amd64-it-it-cosimo-apollo-preview` | |
| `1.2.0-amd64-fr-fr-paul-apollo-preview` | |
| `1.2.0-amd64-fr-fr-julie-apollo-preview` | |
| `1.2.0-amd64-fr-fr-hortenserus-preview` | |
| `1.2.0-amd64-fr-ca-harmonierus-preview` | |
| `1.2.0-amd64-fr-ca-caroline-preview` | |
| `1.2.0-amd64-es-mx-raul-apollo-preview` | |
| `1.2.0-amd64-es-mx-hildarus-preview` | |
| `1.2.0-amd64-es-es-pablo-apollo-preview` | |
| `1.2.0-amd64-es-es-laura-apollo-preview` | |
| `1.2.0-amd64-es-es-helenarus-preview` | |
| `1.2.0-amd64-en-us-zirarus-preview` | |
| `1.2.0-amd64-en-us-jessarus-preview` | |
| `1.2.0-amd64-en-us-jessa24krus-preview` | |
| `1.2.0-amd64-en-us-guy24krus-preview` | |
| `1.2.0-amd64-en-us-benjaminrus-preview` | |
| `1.2.0-amd64-en-in-ravi-apollo-preview` | |
| `1.2.0-amd64-en-in-priyarus-preview` | |
| `1.2.0-amd64-en-in-heera-apollo-preview` | |
| `1.2.0-amd64-en-gb-susan-apollo-preview` | |
| `1.2.0-amd64-en-gb-hazelrus-preview` | |
| `1.2.0-amd64-en-gb-george-apollo-preview` | |
| `1.2.0-amd64-en-au-hayleyrus-preview` | |
| `1.2.0-amd64-en-au-catherine-preview` | |
| `1.2.0-amd64-de-de-stefan-apollo-preview` | |
| `1.2.0-amd64-de-de-heddarus-preview` | |
| `1.1.0-amd64-zh-cn-yaoyao-apollo-preview` | |
| `1.1.0-amd64-zh-cn-kangkang-apollo-preview` | |
| `1.1.0-amd64-zh-cn-huihuirus-preview` | |
| `1.1.0-amd64-pt-br-heloisarus-preview` | |
| `1.1.0-amd64-pt-br-daniel-apollo-preview` | |
| `1.1.0-amd64-ko-kr-heamirus-preview` | |
| `1.1.0-amd64-ja-jp-ichiro-apollo-preview` | |
| `1.1.0-amd64-ja-jp-harukarus-preview` | |
| `1.1.0-amd64-ja-jp-ayumi-apollo-preview` | |
| `1.1.0-amd64-it-it-luciarus-preview` | |
| `1.1.0-amd64-it-it-cosimo-apollo-preview` | |
| `1.1.0-amd64-fr-fr-paul-apollo-preview` | |
| `1.1.0-amd64-fr-fr-julie-apollo-preview` | |
| `1.1.0-amd64-fr-fr-hortenserus-preview` | |
| `1.1.0-amd64-fr-ca-harmonierus-preview` | |
| `1.1.0-amd64-fr-ca-caroline-preview` | |
| `1.1.0-amd64-es-mx-raul-apollo-preview` | |
| `1.1.0-amd64-es-mx-hildarus-preview` | |
| `1.1.0-amd64-es-es-pablo-apollo-preview` | |
| `1.1.0-amd64-es-es-laura-apollo-preview` | |
| `1.1.0-amd64-es-es-helenarus-preview` | |
| `1.1.0-amd64-en-us-zirarus-preview` | |
| `1.1.0-amd64-en-us-jessarus-preview` | |
| `1.1.0-amd64-en-us-jessa24krus-preview` | |
| `1.1.0-amd64-en-us-guy24krus-preview` | |
| `1.1.0-amd64-en-us-benjaminrus-preview` | |
| `1.1.0-amd64-en-in-ravi-apollo-preview` | |
| `1.1.0-amd64-en-in-priyarus-preview` | |
| `1.1.0-amd64-en-in-heera-apollo-preview` | |
| `1.1.0-amd64-en-gb-susan-apollo-preview` | |
| `1.1.0-amd64-en-gb-hazelrus-preview` | |
| `1.1.0-amd64-en-gb-george-apollo-preview` | |
| `1.1.0-amd64-en-au-hayleyrus-preview` | |
| `1.1.0-amd64-en-au-catherine-preview` | |
| `1.1.0-amd64-de-de-stefan-apollo-preview` | |
| `1.1.0-amd64-de-de-heddarus-preview` | |
| `1.1.0-amd64-de-de-hedda-preview` | |
| `1.0.0-amd64-zh-cn-yaoyao-apollo-preview` | |
| `1.0.0-amd64-zh-cn-kangkang-apollo-preview` | |
| `1.0.0-amd64-zh-cn-huihuirus-preview` | |
| `1.0.0-amd64-en-us-zirarus-preview` | |
| `1.0.0-amd64-en-us-jessarus-preview` | |
| `1.0.0-amd64-en-us-jessa24krus-preview` | |
| `1.0.0-amd64-en-us-guy24krus-preview` | |
| `1.0.0-amd64-en-us-benjaminrus-preview` | |

## Key Phrase Extraction

The [Key Phrase Extraction][ta-kp] container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services` repository and is named `keyphrase`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/keyphrase`.

This container image has the following tags available:

| Image Tags | Notes |
|------------|:------|
| `latest` | |
| `1.1.009301-amd64-preview` | |
| `1.1.008510001-amd64-preview` | |
| `1.1.007750002-amd64-preview` | |
| `1.1.007360001-amd64-preview` | |
| `1.1.006770001-amd64-preview` | |

## Language Detection

The [Language Detection][ta-la] container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services` repository and is named `language`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/language`.

This container image has the following tags available:

| Image Tags | Notes |
|------------|:------|
| `latest` | |
| `1.1.009301-amd64-preview` | |
| `1.1.008510001-amd64-preview` | |
| `1.1.007750002-amd64-preview` | |
| `1.1.007360001-amd64-preview` | |
| `1.1.006770001-amd64-preview` | |

## Sentiment Analysis

The [Sentiment Analysis][ta-se] container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services` repository and is named `sentiment`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/sentiment`.

This container image has the following tags available:

| Image Tags | Notes |
|------------|:------|
| `latest` | |
| `1.1.009301-amd64-preview` | |
| `1.1.008510001-amd64-preview` | |
| `1.1.007750002-amd64-preview` | |
| `1.1.007360001-amd64-preview` | |
| `1.1.006770001-amd64-preview` | |

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
