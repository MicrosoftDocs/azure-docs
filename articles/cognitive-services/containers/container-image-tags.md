---
title: Cognitive Services container image tags
titleSuffix: Azure Cognitive Services
description: A comprehensive listing of all the Cognitive Service container image tags.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: reference
ms.date: 10/19/2020
ms.author: aahi
---

# Azure Cognitive Services container image tags

Azure Cognitive Services offers many container images. The container registries and corresponding repositories vary between container images. Each container image name offers multiple tags. A container image tag is a mechanism of versioning the container image. This article is intended to be used as a comprehensive reference for listing all the Cognitive Services container images and their available tags.

> [!TIP]
> When using [`docker pull`](https://docs.docker.com/engine/reference/commandline/pull/), pay close attention to the casing of the container registry, repository, container image name and corresponding tag - as they are **case sensitive**.

## Anomaly Detector

The [Anomaly Detector][ad-containers] container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services/decision` repository and is named `anomaly-detector`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/decision/anomaly-detector`.

This container image has the following tags available. You can also find a full list of [tags on the MCR](https://mcr.microsoft.com/v2/azure-cognitive-services/decision/anomaly-detector/tags/list).

# [Latest version](#tab/current)

| Image Tags                    | Notes |
|-------------------------------|:------|
| `latest`                      |       |
| `1.1.013560003-amd64-preview` |      |

# [Previous versions](#tab/previous)

| Image Tags                    | Notes |
|-------------------------------|:------|
| `1.1.012300001-amd64-preview` |       |

---

## Read OCR (Optical Character Recognition)

The [Computer Vision][cv-containers] Read OCR container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services` repository and is named `read`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/vision/read`.

This container image has the following tags available. You can also find a full list of [tags on the MCR](https://mcr.microsoft.com/v2/azure-cognitive-services/vision/read/tags/list).

# [Latest version](#tab/current)

Release notes for `v2.0.013250001-amd64-preview`:

* Further decrease memory usage for container.
* External cache is required for multi-pods setup. For example, set-up Redis for caching.
* Fixed missing results when Redis cache is set-up and `ResultExpirationPeriod` is set to 0.
* Remove request body size limitation of 26MB. Container can now accept >26MB files.
* Add time stamp and build version to console logging.

| Image Tags                    | Notes |
|-------------------------------|:------|
| `latest`                      |       |
| `2.0.013250001-amd64-preview` |  |

# [Previous versions](#tab/previous)

Release notes for `1.1.013050001-amd64-preview`

* Added `ReadEngineConfig:ResultExpirationPeriod` container initialization configuration to specify when the system should clean up recognition results. 
    * The setting is in hours, and the default value is 48 hours.
    * The setting can reduce memory usage for result storing, especially when container in-memory storage is used.
    * Example 1. ReadEngineConfig:ResultExpirationPeriod=1, the system will clear the recognition result 1hr after the process.
    * If this configuration is set to 0, the system will clear the recognition result after the result is retrieved.

* Fixed a 500 internal server error when an invalid image format is passed to the system. It will now return a 400 error:

    ```json
    {
        "error": {
        "code": "InvalidImageSize",
        "message": "Image must be between 1024 and 209715200 bytes."
        }
    }
    ```

| Image Tags                    | Notes |
|-------------------------------|:------|
| `1.1.013050001-amd64-preview` |       |
| `1.1.011580001-amd64-preview` |       |
| `1.1.009920003-amd64-preview` |       |
| `1.1.009910003-amd64-preview` |       |

---


## Form Recognizer

The [Form Recognizer][fr-containers] container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services/custom-form` repository and is named `labeltool`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/custom-form/labeltool`.

This container image has the following tags available. You can also find a full list of [tags on the MCR](https://mcr.microsoft.com/v2/azure-cognitive-services/custom-form/labeltool/tags/list).

# [Latest version](#tab/current)

| Image Tags                    | Notes |
|-------------------------------|:------|
| `latest`                      |       |
| `1.1.009301-amd64-preview`    |       |


# [Previous versions](#tab/previous)

| Image Tags                    | Notes |
|-------------------------------|:------|
| `1.1.008640001-amd64-preview` |       |
| `1.1.008510001-amd64-preview` |       |

---

## Language Understanding (LUIS)

The [LUIS][lu-containers] container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services/language` repository and is named `luis`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/language/luis`.

This container image has the following tags available. You can also find a full list of [tags on the MCR](https://mcr.microsoft.com/v2/azure-cognitive-services/language/luis/tags/list).

# [Latest version](#tab/current)

| Image Tags                    | Notes |
|-------------------------------|:------|
| `latest`                      |       |
| `1.1.012280003-amd64-preview` |       |


# [Latest version](#tab/current)

| Image Tags                    | Notes |
|-------------------------------|:------|
| `1.1.012130003-amd64-preview` |       |

---

## Custom Speech-to-text

The [Custom Speech-to-text][sp-cstt] container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services/speechservices/` repository and is named `custom-speech-to-text`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/speechservices/custom-speech-to-text`. You can also find a full list of [tags on the MCR](https://mcr.microsoft.com/v2/azure-cognitive-services/speechservices/custom-speech-to-text/tags/list).

This container image has the following tags available:

| Image Tags            | Notes |
|-----------------------|:------|
| `latest`              |       |
| `2.5.0-amd64`         |       |


## Custom Text-to-speech

The [Custom Text-to-speech][sp-ctts] container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services/speechservices/` repository and is named `custom-text-to-speech`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/speechservices/custom-text-to-speech`. You can also find a full list of [tags on the MCR](https://mcr.microsoft.com/v2/azure-cognitive-services/speechservices/custom-text-to-speech/tags/list).

This container image has the following tags available:

| Image Tags            | Notes |
|-----------------------|:------|
| `latest`              |       |
| `1.7.0-amd64`         |       |

## Speech-to-text

The [Speech-to-text][sp-stt] container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services/speechservices/` repository and is named `speech-to-text`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/speechservices/speech-to-text`.

Speech-to-text v2.5.0 images are supported in *US Government Virginia*. Please use *US Government Virginia* billing endpoint and api keys to try.

This container image has the following tags available. You can also find a full list of [tags on the MCR](https://mcr.microsoft.com/v2/azure-cognitive-services/speechservices/speech-to-text/tags/list).

| Image Tags                  | Notes                                    |
|-----------------------------|:-----------------------------------------|
| `latest`                    | Container image with the `en-US` locale. |
| `2.5.0-amd64-ar-ae`         | Container image with the `ar-AE` locale. |
| `2.5.0-amd64-ar-eg`         | Container image with the `ar-EG` locale. |
| `2.5.0-amd64-ar-kw`         | Container image with the `ar-KW` locale. |
| `2.5.0-amd64-ar-qa`         | Container image with the `ar-QA` locale. |
| `2.5.0-amd64-ar-sa`         | Container image with the `ar-SA` locale. |
| `2.5.0-amd64-ca-es`         | Container image with the `ca-ES` locale. |
| `2.5.0-amd64-da-dk`         | Container image with the `da-DK` locale. |
| `2.5.0-amd64-de-de`         | Container image with the `de-DE` locale. |
| `2.5.0-amd64-en-au`         | Container image with the `en-AU` locale. |
| `2.5.0-amd64-en-ca`         | Container image with the `en-CA` locale. |
| `2.5.0-amd64-en-gb`         | Container image with the `en-GB` locale. |
| `2.5.0-amd64-en-in`         | Container image with the `en-IN` locale. |
| `2.5.0-amd64-en-nz`         | Container image with the `en-NZ` locale. |
| `2.5.0-amd64-en-us`         | Container image with the `en-US` locale. |
| `2.5.0-amd64-es-es`         | Container image with the `es-ES` locale. |
| `2.5.0-amd64-es-mx`         | Container image with the `es-MX` locale. |
| `2.5.0-amd64-fi-fi`         | Container image with the `fi-FI` locale. |
| `2.5.0-amd64-fr-ca`         | Container image with the `fr-CA` locale. |
| `2.5.0-amd64-fr-fr`         | Container image with the `fr-FR` locale. |
| `2.5.0-amd64-gu-in`         | Container image with the `gu-IN` locale. |
| `2.5.0-amd64-hi-in`         | Container image with the `hi-IN` locale. |
| `2.5.0-amd64-it-it`         | Container image with the `it-IT` locale. |
| `2.5.0-amd64-ja-jp`         | Container image with the `ja-JP` locale. |
| `2.5.0-amd64-ko-kr`         | Container image with the `ko-KR` locale. |
| `2.5.0-amd64-mr-in`         | Container image with the `mr-IN` locale. |
| `2.5.0-amd64-nb-no`         | Container image with the `nb-NO` locale. |
| `2.5.0-amd64-nl-nl`         | Container image with the `nl-NL` locale. |
| `2.5.0-amd64-pl-pl`         | Container image with the `pl-PL` locale. |
| `2.5.0-amd64-pt-br`         | Container image with the `pt-BR` locale. |
| `2.5.0-amd64-pt-pt`         | Container image with the `pt-PT` locale. |
| `2.5.0-amd64-ru-ru`         | Container image with the `ru-RU` locale. |
| `2.5.0-amd64-sv-se`         | Container image with the `sv-SE` locale. |
| `2.5.0-amd64-ta-in`         | Container image with the `ta-IN` locale. |
| `2.5.0-amd64-te-in`         | Container image with the `te-IN` locale. |
| `2.5.0-amd64-th-th`         | Container image with the `th-TH` locale. |
| `2.5.0-amd64-tr-tr`         | Container image with the `tr-TR` locale. |
| `2.5.0-amd64-zh-cn`         | Container image with the `zh-CN` locale. |
| `2.5.0-amd64-zh-hk`         | Container image with the `zh-HK` locale. |
| `2.5.0-amd64-zh-tw`         | Container image with the `zh-TW` locale. |


## Text-to-speech

The [Text-to-speech][sp-tts] container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services/speechservices/` repository and is named `text-to-speech`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/speechservices/text-to-speech`.

This container image has the following tags available. You can also find a full list of [tags on the MCR](https://mcr.microsoft.com/v2/azure-cognitive-services/speechservices/text-to-speech/tags/list).

| Image Tags                                  | Notes                                                                      |
|---------------------------------------------|:---------------------------------------------------------------------------|
| `latest`                                    | Container image with the `en-US` locale and `en-US-AriaRUS` voice.         |
| `1.7.0-amd64-ar-eg-hoda`                    | Container image with the `ar-EG` locale and `ar-EG-Hoda` voice.            |
| `1.7.0-amd64-ar-sa-naayf`                   | Container image with the `ar-SA` locale and `ar-SA-Naayf` voice.           |
| `1.7.0-amd64-bg-bg-ivan`                    | Container image with the `bg-BG` locale and `bg-BG-Ivan` voice.            |
| `1.7.0-amd64-ca-es-herenarus`               | Container image with the `ca-ES` locale and `ca-ES-HerenaRUS` voice.       |
| `1.7.0-amd64-cs-cz-jakub`                   | Container image with the `cs-CZ` locale and `cs-CZ-Jakub` voice.           |
| `1.7.0-amd64-da-dk-hellerus`                | Container image with the `da-DK` locale and `da-DK-HelleRUS` voice.        |
| `1.7.0-amd64-de-at-michael`                 | Container image with the `de-AT` locale and `de-AT-Michael` voice.         |
| `1.7.0-amd64-de-ch-karsten`                 | Container image with the `de-CH` locale and `de-CH-Karsten` voice.         |
| `1.7.0-amd64-de-de-hedda`                   | Container image with the `de-DE` locale and `de-DE-Hedda` voice.           |
| `1.7.0-amd64-de-de-heddarus`                | Container image with the `de-DE` locale and `de-DE-Hedda` voice.           |
| `1.7.0-amd64-de-de-stefan-apollo`           | Container image with the `de-DE` locale and `de-DE-Stefan-Apollo` voice.   |
| `1.7.0-amd64-el-gr-stefanos`                | Container image with the `el-GR` locale and `el-GR-Stefanos` voice.        |
| `1.7.0-amd64-en-au-catherine`               | Container image with the `en-AU` locale and `en-AU-Catherine` voice.       |
| `1.7.0-amd64-en-au-hayleyrus`               | Container image with the `en-AU` locale and `en-AU-HayleyRUS` voice.       |
| `1.7.0-amd64-en-ca-heatherrus`              | Container image with the `en-CA` locale and `en-CA-HeatherRUS` voice.      |
| `1.7.0-amd64-en-ca-linda`                   | Container image with the `en-CA` locale and `en-CA-Linda` voice.           |
| `1.7.0-amd64-en-gb-george-apollo`           | Container image with the `en-GB` locale and `en-GB-George-Apollo` voice.   |
| `1.7.0-amd64-en-gb-hazelrus`                | Container image with the `en-GB` locale and `en-GB-HazelRUS` voice.        |
| `1.7.0-amd64-en-gb-susan-apollo`            | Container image with the `en-GB` locale and `en-GB-Susan-Apollo` voice.    |
| `1.7.0-amd64-en-ie-sean`                    | Container image with the `en-IE` locale and `en-IE-Sean` voice.            |
| `1.7.0-amd64-en-in-heera-apollo`            | Container image with the `en-IN` locale and `en-IN-Heera-Apollo` voice.    |
| `1.7.0-amd64-en-in-priyarus`                | Container image with the `en-IN` locale and `en-IN-PriyaRUS` voice.        |
| `1.7.0-amd64-en-in-ravi-apollo`             | Container image with the `en-IN` locale and `en-IN-Ravi-Apollo` voice.     |
| `1.7.0-amd64-en-us-benjaminrus`             | Container image with the `en-US` locale and `en-US-BenjaminRUS` voice.     |
| `1.7.0-amd64-en-us-guy24krus`               | Container image with the `en-US` locale and `en-US-Guy24kRUS` voice.       |
| `1.7.0-amd64-en-us-aria24krus`              | Container image with the `en-US` locale and `en-US-Aria24kRUS` voice.      |
| `1.7.0-amd64-en-us-ariarus`                 | Container image with the `en-US` locale and `en-US-AriaRUS` voice.         |
| `1.7.0-amd64-en-us-zirarus`                 | Container image with the `en-US` locale and `en-US-ZiraRUS` voice.         |
| `1.7.0-amd64-es-es-helenarus`               | Container image with the `es-ES` locale and `es-ES-HelenaRUS` voice.       |
| `1.7.0-amd64-es-es-laura-apollo`            | Container image with the `es-ES` locale and `es-ES-Laura-Apollo` voice.    |
| `1.7.0-amd64-es-es-pablo-apollo`            | Container image with the `es-ES` locale and `es-ES-Pablo-Apollo` voice.    |
| `1.7.0-amd64-es-mx-hildarus`                | Container image with the `es-MX` locale and `es-MX-HildaRUS` voice.        |
| `1.7.0-amd64-es-mx-raul-apollo`             | Container image with the `es-MX` locale and `es-MX-Raul-Apollo` voice.     |
| `1.7.0-amd64-fi-fi-heidirus`                | Container image with the `fi-FI` locale and `fi-FI-HeidiRUS` voice.        |
| `1.7.0-amd64-fr-ca-caroline`                | Container image with the `fr-CA` locale and `fr-CA-Caroline` voice.        |
| `1.7.0-amd64-fr-ca-harmonierus`             | Container image with the `fr-CA` locale and `fr-CA-HarmonieRUS` voice.     |
| `1.7.0-amd64-fr-ch-guillaume`               | Container image with the `fr-CH` locale and `fr-CH-Guillaume` voice.       |
| `1.7.0-amd64-fr-fr-hortenserus`             | Container image with the `fr-FR` locale and `fr-FR-HortenseRUS` voice.     |
| `1.7.0-amd64-fr-fr-julie-apollo`            | Container image with the `fr-FR` locale and `fr-FR-Julie-Apollo` voice.    |
| `1.7.0-amd64-fr-fr-paul-apollo`             | Container image with the `fr-FR` locale and `fr-FR-Paul-Apollo` voice.     |
| `1.7.0-amd64-he-il-asaf`                    | Container image with the `he-IL` locale and `he-IL-Asaf` voice.            |
| `1.7.0-amd64-hi-in-hemant`                  | Container image with the `hi-IN` locale and `hi-IN-Hemant` voice.          |
| `1.7.0-amd64-hi-in-kalpana-apollo`          | Container image with the `hi-IN` locale and `hi-IN-Kalpana-Apollo` voice.  |
| `1.7.0-amd64-hi-in-kalpana`                 | Container image with the `hi-IN` locale and `hi-IN-Kalpana` voice.         |
| `1.7.0-amd64-hr-hr-matej`                   | Container image with the `hr-HR` locale and `hr-HR-Matej` voice.           |
| `1.7.0-amd64-hu-hu-szabolcs`                | Container image with the `hu-HU` locale and `hu-HU-Szabolcs` voice.        |
| `1.7.0-amd64-id-id-andika`                  | Container image with the `id-ID` locale and `id-ID-Andika` voice.          |
| `1.7.0-amd64-it-it-cosimo-apollo`           | Container image with the `it-IT` locale and `it-IT-Cosimo-Apollo` voice.   |
| `1.7.0-amd64-it-it-luciarus`                | Container image with the `it-IT` locale and `it-IT-LuciaRUS` voice.        |
| `1.7.0-amd64-ja-jp-ayumi-apollo`            | Container image with the `ja-JP` locale and `ja-JP-Ayumi-Apollo` voice.    |
| `1.7.0-amd64-ja-jp-harukarus`               | Container image with the `ja-JP` locale and `ja-JP-HarukaRUS` voice.       |
| `1.7.0-amd64-ja-jp-ichiro-apollo`           | Container image with the `ja-JP` locale and `ja-JP-Ichiro-Apollo` voice.   |
| `1.7.0-amd64-ko-kr-heamirus`                | Container image with the `ko-KR` locale and `ko-KR-HeamiRUS` voice.        |
| `1.7.0-amd64-ms-my-rizwan`                  | Container image with the `ms-MY` locale and `ms-MY-Rizwan` voice.          |
| `1.7.0-amd64-nb-no-huldarus`                | Container image with the `nb-NO` locale and `nb-NO-HuldaRUS` voice.        |
| `1.7.0-amd64-nl-nl-hannarus`                | Container image with the `nl-NL` locale and `nl-NL-HannaRUS` voice.        |
| `1.7.0-amd64-pl-pl-paulinarus`              | Container image with the `pl-PL` locale and `pl-PL-PaulinaRUS` voice.      |
| `1.7.0-amd64-pt-br-daniel-apollo`           | Container image with the `pt-BR` locale and `pt-BR-Daniel-Apollo` voice.   |
| `1.7.0-amd64-pt-br-heloisarus`              | Container image with the `pt-BR` locale and `pt-BR-HeloisaRUS` voice.      |
| `1.7.0-amd64-pt-pt-heliarus`                | Container image with the `pt-PT` locale and `pt-PT-HeliaRUS` voice.        |
| `1.7.0-amd64-ro-ro-andrei`                  | Container image with the `ro-RO` locale and `ro-RO-Andrei` voice.          |
| `1.7.0-amd64-ru-ru-ekaterinarus`            | Container image with the `ru-RU` locale and `ru-RU-EkaterinaRUS` voice.    |
| `1.7.0-amd64-ru-ru-irina-apollo`            | Container image with the `ru-RU` locale and `ru-RU-Irina-Apollo` voice.    |
| `1.7.0-amd64-ru-ru-pavel-apollo`            | Container image with the `ru-RU` locale and `ru-RU-Pavel-Apollo` voice.    |
| `1.7.0-amd64-sk-sk-filip`                   | Container image with the `sk-SK` locale and `sk-SK-Filip` voice.           |
| `1.7.0-amd64-sl-si-lado`                    | Container image with the `sl-SI` locale and `sl-SI-Lado` voice.            |
| `1.7.0-amd64-sv-se-hedvigrus`               | Container image with the `sv-SE` locale and `sv-SE-HedvigRUS` voice.       |
| `1.7.0-amd64-ta-in-valluvar`                | Container image with the `ta-IN` locale and `ta-IN-Valluvar` voice.        |
| `1.7.0-amd64-te-in-chitra`                  | Container image with the `te-IN` locale and `te-IN-Chitra` voice.          |
| `1.7.0-amd64-th-th-pattara`                 | Container image with the `th-TH` locale and `th-TH-Pattara` voice.         |
| `1.7.0-amd64-tr-tr-sedarus`                 | Container image with the `tr-TR` locale and `tr-TR-SedaRUS` voice.         |
| `1.7.0-amd64-vi-vn-an`                      | Container image with the `vi-VN` locale and `vi-VN-An` voice.              |
| `1.7.0-amd64-zh-cn-huihuirus`               | Container image with the `zh-CN` locale and `zh-CN-HuihuiRUS` voice.       |
| `1.7.0-amd64-zh-cn-kangkang-apollo`         | Container image with the `zh-CN` locale and `zh-CN-Kangkang-Apollo` voice. |
| `1.7.0-amd64-zh-cn-yaoyao-apollo`           | Container image with the `zh-CN` locale and `zh-CN-Yaoyao-Apollo` voice.   |
| `1.7.0-amd64-zh-hk-danny-apollo`            | Container image with the `zh-HK` locale and `zh-HK-Danny-Apollo` voice.    |
| `1.7.0-amd64-zh-hk-tracy-apollo`            | Container image with the `zh-HK` locale and `zh-HK-Tracy-Apollo` voice.    |
| `1.7.0-amd64-zh-hk-tracyrus`                | Container image with the `zh-HK` locale and `zh-HK-TracyRUS` voice.        |
| `1.7.0-amd64-zh-tw-hanhanrus`               | Container image with the `zh-TW` locale and `zh-TW-HanHanRUS` voice.       |
| `1.7.0-amd64-zh-tw-yating-apollo`           | Container image with the `zh-TW` locale and `zh-TW-Yating-Apollo` voice.   |
| `1.7.0-amd64-zh-tw-zhiwei-apollo`           | Container image with the `zh-TW` locale and `zh-TW-Zhiwei-Apollo` voice.   |


## Neural Text-to-speech

The [Neural Text-to-speech][sp-ntts] container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services/speechservices/` repository and is named `neural-text-to-speech`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/speechservices/neural-text-to-speech`.

This container image has the following tags available. You can also find a full list of [tags on the MCR](https://mcr.microsoft.com/v2/azure-cognitive-services/speechservices/neural-text-to-speech/tags/list).

| Image Tags                                  | Notes                                                                      |
|---------------------------------------------|:---------------------------------------------------------------------------|
| `latest`                                    | Container image with the `en-US` locale and `en-US-AriaNeural` voice.      |
| `1.2.0-amd64-de-de-katjaneural-preview`     | Container image with the `de-DE` locale and `de-DE-KatjaNeural` voice.     |
| `1.2.0-amd64-en-au-natashaneural-preview`   | Container image with the `en-AU` locale and `en-AU-NatashaNeural` voice.   |
| `1.2.0-amd64-en-ca-claraneural-preview`     | Container image with the `en-CA` locale and `en-CA-ClaraNeural` voice.     |
| `1.2.0-amd64-en-gb-libbyneural-preview`     | Container image with the `en-GB` locale and `en-GB-LibbyNeural` voice.     |
| `1.2.0-amd64-en-gb-mianeural-preview`       | Container image with the `en-GB` locale and `en-GB-MiaNeural` voice.       |
| `1.2.0-amd64-en-us-arianeural-preview`      | Container image with the `en-US` locale and `en-US-AriaNeural` voice.      |
| `1.2.0-amd64-en-us-guyneural-preview`       | Container image with the `en-US` locale and `en-US-GuyNeural` voice.       |
| `1.2.0-amd64-es-es-elviraneural-preview`    | Container image with the `es-ES` locale and `es-ES-ElviraNeural` voice.    |
| `1.2.0-amd64-es-mx-dalianeural-preview`     | Container image with the `es-MX` locale and `es-MX-DaliaNeural` voice.     |
| `1.2.0-amd64-fr-ca-sylvieneural-preview`    | Container image with the `fr-CA` locale and `fr-CA-SylvieNeural` voice.    |
| `1.2.0-amd64-fr-fr-deniseneural-preview`    | Container image with the `fr-FR` locale and `fr-FR-DeniseNeural` voice.    |
| `1.2.0-amd64-it-it-elsaneural-preview`      | Container image with the `it-IT` locale and `it-IT-ElsaNeural` voice.      |
| `1.2.0-amd64-ja-jp-nanamineural-preview`    | Container image with the `ja-JP` locale and `ja-JP-NanamiNeural` voice.    |
| `1.2.0-amd64-ko-kr-sunhineural-preview`     | Container image with the `ko-KR` locale and `ko-KR-SunHiNeural` voice.     |
| `1.2.0-amd64-pt-br-franciscaneural-preview` | Container image with the `pt-BR` locale and `pt-BR-FranciscaNeural` voice. |
| `1.2.0-amd64-zh-cn-xiaoxiaoneural-preview`  | Container image with the `zh-CN` locale and `zh-CN-XiaoxiaoNeural` voice.  |

## Speech language detection

The [Speech language detection][sp-lid] container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services/speechservices/` repository and is named `language-detection`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/speechservices/language-detection`.

This container image has the following tags available. You can also find a full list of [tags on the MCR](https://mcr.microsoft.com/v2/azure-cognitive-services/speechservices/language-detection/tags/list).

| Image Tags                                  | Notes                                                                      |
|---------------------------------------------|:---------------------------------------------------------------------------|
| `latest`                       |      |
| `1.1.0-amd64-preview`                       |      |

## Key Phrase Extraction

container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services/textanalytics/` repository and is named `keyphrase`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/textanalytics/keyphrase`.

This container image has the following tags available. You can also find a full list of [tags on the MCR](https://mcr.microsoft.com/v2/azure-cognitive-services/textanalytics/keyphrase/tags/list).

# [Latest version](#tab/current)


| Image Tags                    | Notes |
|-------------------------------|:------|
| `latest`                      |       |
| `1.1.013570001-amd64` |       |

# [Previous versions](#tab/previous)

| Image Tags                    | Notes |
|-------------------------------|:------|
| `1.1.012840001-amd64` |       |
| `1.1.012830001-amd64`    |       |

---

## Text language detection

The [Language Detection][ta-la] container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services/textanalytics/` repository and is named `language`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/textanalytics/language`


This container image has the following tags available. You can also find a full list of [tags on the MCR](https://mcr.microsoft.com/v2/azure-cognitive-services/textanalytics/language/tags/list).

# [Latest versions](#tab/current)

| Image Tags                    | Notes |
|-------------------------------|:------|
| `latest`                      |       |
| `1.1.013570001-amd64` | |
   

# [Previous versions](#tab/previous)


| Image Tags                    | Notes |
|-------------------------------|:------|
| `latest`                      |       |
| `1.1.012840001-amd64` |   |
| `1.1.012830001-amd64` |   |

## Sentiment analysis

The [Sentiment Analysis][ta-se] container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services/textanalytics/` repository and is named `sentiment`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/textanalytics/sentiment`

This container image has the following tags available. You can also find a full list of [tags on the MCR](https://mcr.microsoft.com/v2/azure-cognitive-services/textanalytics/sentiment/tags/list).

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
| `2.1`    | Sentiment Analysis v2      |

[ad-containers]: ../anomaly-Detector/anomaly-detector-container-howto.md
[cv-containers]: ../computer-vision/computer-vision-how-to-install-containers.md
[fa-containers]: ../face/face-how-to-install-containers.md
[fr-containers]: ../form-recognizer/form-recognizer-container-howto.md
[lu-containers]: ../luis/luis-container-howto.md
[sp-stt]: ../speech-service/speech-container-howto.md?tabs=stt
[sp-cstt]: ../speech-service/speech-container-howto.md?tabs=cstt
[sp-tts]: ../speech-service/speech-container-howto.md?tabs=tts
[sp-ctts]: ../speech-service/speech-container-howto.md?tabs=ctts
[sp-ntts]: ../speech-service/speech-container-howto.md?tabs=ntts
[sp-lid]: ../speech-service/speech-container-howto.md?tabs=lid
[ta-kp]: ../text-analytics/how-tos/text-analytics-how-to-install-containers.md?tabs=keyphrase
[ta-la]: ../text-analytics/how-tos/text-analytics-how-to-install-containers.md?tabs=language
[ta-se]: ../text-analytics/how-tos/text-analytics-how-to-install-containers.md?tabs=sentiment
