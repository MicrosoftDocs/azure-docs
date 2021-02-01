---
title: Cognitive Services container image tags
titleSuffix: Azure Cognitive Services
description: A comprehensive listing of all the Cognitive Service container image tags.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: reference
ms.date: 11/17/2020
ms.author: aahi
---

# Azure Cognitive Services container image tags and release notes

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

Release notes for `3.2-preview.1`:

* New v3.2 container

| Image Tags                    | Notes |
|-------------------------------|:------|
| `latest`                      |       |
| `3.2-preview.1` |  |

# [Previous versions](#tab/previous)

Release notes for `v2.0.013250001-amd64-preview`:

* Further decrease memory usage for container.
* External cache is required for multi-pods setup. For example, set-up Redis for caching.
* Fixed missing results when Redis cache is set-up and `ResultExpirationPeriod` is set to 0.
* Remove request body size limitation of 26MB. Container can now accept >26MB files.
* Add time stamp and build version to console logging.

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
| `2.0.013250001-amd64-preview` |       |
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


# [Previous version](#tab/previous)

| Image Tags                    | Notes |
|-------------------------------|:------|
| `1.1.012130003-amd64-preview` |       |

---

## Custom Speech-to-text

The [Custom Speech-to-text][sp-cstt] container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services/speechservices/` repository and is named `custom-speech-to-text`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/speechservices/custom-speech-to-text`. You can also find a full list of [tags on the MCR](https://mcr.microsoft.com/v2/azure-cognitive-services/speechservices/custom-speech-to-text/tags/list).


# [Latest version](#tab/current)

Release note for `2.7.0-amd64`:

**Features**
* Punctuation is set as enabled by default.

Note that due to the included phrase lists, the size of this container image has increased.

| Image Tags                    | Notes | Digest                                                                  |
|-------------------------------|:------|:------------------------------------------------------------------------|
| `latest`                      |       | `sha256:d1573c2543cb7afedb0122da0995f345767b02f9c5f181950acf1509ca65726` |
| `2.7.0-amd64`                 |       | `sha256:d1573c2543cb7afedb0122da0995f345767b02f9c5f181950acf1509ca65726` |


# [Previous version](#tab/previous)
Release note for `2.6.0-amd64`:

**Features**
* Support for phraselist v2 
* Phrase lists are supported in the following locales:
    * en-au
    * en-ca
    * en-gb
    * en-in
    * en-us
    * zh-cn
* Support for custom base model download. 
    * Use `BaseModelLocale=<locale>` with the `docker run` command
* Fully migrated to .NET 3.1

**Fixes**
* Fixed an issue where the confidence score was always 1 in Diarization mode
* Migrated to the TextAnalytics 3.0 api

Note that due to the included phrase lists, the size of this container image has increased.

Release note for `2.5.0-amd64`:

**Features**
* Support custom pronunciation on custom models
* Support Azure and Azure US Government Cloud

**Fixes**
* Fix run as non-root user issue on Diarization mode

| Image Tags                    | Notes               |
|-------------------------------|:--------------------|
| `2.6.0-amd64`                 |                     |
| `2.5.0-amd64`                 |   1st GA version    |

---

## Custom Text-to-speech

The [Custom Text-to-speech][sp-ctts] container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services/speechservices/` repository and is named `custom-text-to-speech`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/speechservices/custom-text-to-speech`. You can also find a full list of [tags on the MCR](https://mcr.microsoft.com/v2/azure-cognitive-services/speechservices/custom-text-to-speech/tags/list).


# [Latest version](#tab/current)

Release note for `1.9.0-amd64`:

Regular monthly release

| Image Tags                    | Notes | Digest                                                                  |
|-------------------------------|:------|:------------------------------------------------------------------------|
| `latest`                      |       | `sha256:e0397cf12d1367b13dd258f782bb513c93afcd5ee4b897794fe533205336355` |
| `1.9.0-amd64`                 |       | `sha256:e0397cf12d1367b13dd258f782bb513c93afcd5ee4b897794fe533205336355` |


# [Previous version](#tab/previous)
Release note for `1.8.0-amd64`:

**Features**
* Fully migrated to .NET 3.1

Release note for `1.7.0-amd64`:

**Feature**
* Partially migrated to .NET 3.1

| Image Tags                    | Notes               |
|-------------------------------|:--------------------|
| `1.8.0-amd64`                 |                     |
| `1.7.0-amd64`                 |   1st GA version    |

---

## Speech-to-text

The [Speech-to-text][sp-stt] container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services/speechservices/` repository and is named `speech-to-text`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/speechservices/speech-to-text`. You can find a full list of [tags on the MCR](https://mcr.microsoft.com/v2/azure-cognitive-services/speechservices/speech-to-text/tags/list).

Since Speech-to-text v2.5.0, images are supported in the *US Government Virginia* region. Please use the *US Government Virginia* billing endpoint and API keys when using this region.

# [Latest version](#tab/current)

Release note for `2.7.0-amd64-<locale>`:

**Features**
* Support for the following new locales:
    * ar-bh, ar-iq, ar-jo, ar-lb, ar-om, ar-sy
    * bg-bg
    * el-gr
    * en-hk, en-ie, en-ph, en-sg, en-za
    * es-ar, es-bo, es-cl, es-co, es-cr, es-cu, es-do, es-ec, es-gt, es-pa, es-pe, es-pr, es-py, es-sv, es-us, es-uy, es-ve
    * et-ee
    * ga-ie
    * hr-hr
    * hu-hu
    * lt-lt
    * lv-lv
    * mt-mt
    * ro-ro
    * sk-sk
    * sl-sl
* Punctuation is enabled by default.

Note that due to the included phrase lists, the size of this container image has increased. 

| Image Tags                    | Notes                                                                                                |
|-------------------------------|:-----------------------------------------------------------------------------------------------------|
| `latest`                      | Container image with the `en-US` locale.                                                             |
| `2.7.0-amd64-<locale>`        | Replace `<locale>` with one of the available locales, listed below. For example `2.7.0-amd64-en-us`. |

This container has the following locales available.

| Locale for v2.7.0           | Notes                                    | Digest                                                                  |
|-----------------------------|:-----------------------------------------|:------------------------------------------------------------------------|
| `ar-ae`                     | Container image with the `ar-AE` locale. | `sha256:c8e99e71e6740cf671f3bf79de8b7dd890122cb674eedd2440e71e7cbc4c66b` |
| `ar-bh`                     | Container image with the `ar-BH` locale. | `sha256:5a2c140661f50d0c95587121ec1ab8895289f4dda5b3ad14074413e869e6bd4` |
| `ar-eg`                     | Container image with the `ar-EG` locale. | `sha256:783bb8321fcfb7890b0c99935099f7e84c85a698c2fe0031c661e265358d79c` |
| `ar-iq`                     | Container image with the `ar-IQ` locale. | `sha256:abd0101f73c1cf71f30da7b11b93d2a7ac8877dbfcfc2d34553d20705aca7a2` |
| `ar-jo`                     | Container image with the `ar-JO` locale. | `sha256:d4c7fd2a1637e163aa106c23b6a759e8c78366c60ece83b3aabfe93ebabae07` |
| `ar-kw`                     | Container image with the `ar-KW` locale. | `sha256:c8e99e71e6740cf671f3bf79de8b7dd890122cb674eedd2440e71e7cbc4c66b` |
| `ar-lb`                     | Container image with the `ar-LB` locale. | `sha256:20e5c9105e86625c72de54290a6eb07630d35c3760f729c4b855e3661583dfe` |
| `ar-om`                     | Container image with the `ar-OM` locale. | `sha256:97f1b44f2cbb837a2ef86441a0a52a07f706240edb6ef6618ee4db8cbbe1c19` |
| `ar-qa`                     | Container image with the `ar-QA` locale. | `sha256:c8e99e71e6740cf671f3bf79de8b7dd890122cb674eedd2440e71e7cbc4c66b` |
| `ar-sa`                     | Container image with the `ar-SA` locale. | `sha256:c8e99e71e6740cf671f3bf79de8b7dd890122cb674eedd2440e71e7cbc4c66b` |
| `ar-sy`                     | Container image with the `ar-SY` locale. | `sha256:51980a2e2c3dd3548deedcedaf5fc688db602a5eced1a4b7df7d10750393623` |
| `bg-bg`                     | Container image with the `bg-BG` locale. | `sha256:1c1acf0fbb353ebb04692f37eb4d4cdf0b4e309720dd7e709001dada0d1ea81` |
| `ca-es`                     | Container image with the `ca-ES` locale. | `sha256:c60baa0007f61c7652b97b49645215de63411125d627c974c09222e316df204` |
| `cs-cz`                     | Container image with the `cs-CZ` locale. | `sha256:3fa09fc3a6bde6b77df2444aae8fc78b5f25fb9010171d1682db116ea5801f5` |
| `da-dk`                     | Container image with the `da-DK` locale. | `sha256:4b26dbba50c2771943880b68e0e4ea0713d0e3bb8bad884454849bccc9e94a3` |
| `de-de`                     | Container image with the `de-DE` locale. | `sha256:5109ed80b1fecf4db0328adcd50528d0aa9e726b5fc84587c40aaea4e91256d` |
| `el-gr`                     | Container image with the `el-GR` locale. | `sha256:fc8b466c588bf097efac2b79454d5ac0df5c6990398f07ede9be7e1d536e4bd` |
| `en-au`                     | Container image with the `en-AU` locale. | `sha256:3461892a27fc3eb3f9610b2def00bc15f380c6b9797c90ceca19e6abb55f6a6` |
| `en-ca`                     | Container image with the `en-CA` locale. | `sha256:a0509be39785f1e869bd96ab10e7c07d3f4e61c9aa17ff5900076e7bd64ba11` |
| `en-gb`                     | Container image with the `en-GB` locale. | `sha256:1b976fc7ac109e61dcf74af3652c12535e3db92931d2d0bb2ea59bd46f9efed` |
| `en-hk`                     | Container image with the `en-HK` locale. | `sha256:0b1e1df101f978869c98f6e50632712016b8311fc89b334e7f44e968d64bf2f` |
| `en-ie`                     | Container image with the `en-IE` locale. | `sha256:c5ba0d3c7219ce39f0b918a51a7cae8a65c277f564279cad920e068725aa39f` |
| `en-in`                     | Container image with the `en-IN` locale. | `sha256:e907f07be498f024103f6fe6abffa23e242bf3585724741b29a2f3f41d0899c` |
| `en-nz`                     | Container image with the `en-NZ` locale. | `sha256:66845f6ce20ae71d609867c6eb4772366ce042499e4bcdce4c1b579daf7fad7` |
| `en-ph`                     | Container image with the `en-PH` locale. | `sha256:e7874653bf66b1a1ab344b3391eb8767be34260b7f11b62fd057cbe17b805b2` |
| `en-sg`                     | Container image with the `en-SG` locale. | `sha256:827cdb158280e6f4037f4815410c7aa78abf9c6467876c1504aecfef787bdd7` |
| `en-us`                     | Container image with the `en-US` locale. | `sha256:248d17340055e3e137219ddc234c605e6a53ceead136ea55c9697c352da6a8d` |
| `en-za`                     | Container image with the `en-ZA` locale. | `sha256:a8abc99f498db7088bb25acec47da81e90b6a5eaa1c6f78e0f9a314d839d0ae` |
| `es-ar`                     | Container image with the `es-AR` locale. | `sha256:edf78429630851b6eb01f54f8a8a1aeeda9971c6a834403a204662eda22b3b9` |
| `es-bo`                     | Container image with the `es-BO` locale. | `sha256:5832b44f1da2f6b9a097c99babfbc370d8d0eabe1ff8daabec2c3f482dc9d63` |
| `es-cl`                     | Container image with the `es-CL` locale. | `sha256:409a712b96235e154472134f96ff9272265f1e5b555e00ad03c2260b0781009` |
| `es-co`                     | Container image with the `es-CO` locale. | `sha256:99792bc083dc16e0edf15491e6a840d786c9140b747551563a8d98f66f0b415` |
| `es-cr`                     | Container image with the `es-CR` locale. | `sha256:21fe14a538e5b8b2d288b00b8f5a02d87469e285f32e725155042079f336ac9` |
| `es-cu`                     | Container image with the `es-CU` locale. | `sha256:05d40eae01cec4c42c4febd379cd61373eb43d0aacfd47b988bb95e6a6ad216` |
| `es-do`                     | Container image with the `es-DO` locale. | `sha256:73dd0e0d4f39a259563ee7cc18c2e72c9ab20c52905fe343e0413ca7c4b3f0d` |
| `es-ec`                     | Container image with the `es-EC` locale. | `sha256:c3e69139ef365fe9332b5b68b43458242c7dad9d9f2b557431272306e81cb9e` |
| `es-es`                     | Container image with the `es-ES` locale. | `sha256:bd83fcfc116ba645a0e12a7a93b6ada74a8f701172f826a91c5f223a1dbaa61` |
| `es-gt`                     | Container image with the `es-GT` locale. | `sha256:5bb9b18b91b74e123e3720893d88bfcb0a87dac31a1f7171d23c7cb1fa09fee` |
| `es-hn`                     | Container image with the `es-HN` locale. | `sha256:941d108a4b76eb554e8f13cf5090665a702de3ebf35b75e4350f0916dfccd72` |
| `es-mx`                     | Container image with the `es-MX` locale. | `sha256:cebea03732781b4425500d162ae6580bbd7ce9b5f4ede988c4570fe311d8567` |
| `es-ni`                     | Container image with the `es-NI` locale. | `sha256:8ba165f94ad840936ebd0af17a0a63aa08a6292e7ad9029f5b93eef41165eb9` |
| `es-pa`                     | Container image with the `es-PA` locale. | `sha256:c61b7f1b6801a03c3eab0dd1aede87017a86bc7368ded2f8bad8d9e5f60d0d3` |
| `es-pe`                     | Container image with the `es-PE` locale. | `sha256:447a3ab3f302aba24d201d9f5b2877ffcd64dfd5e9d6b88d9924847160b2de2` |
| `es-pr`                     | Container image with the `es-PR` locale. | `sha256:a53b3295c986e91ee8cf93ebe1057b997c76ef7f99913508b859311a194fdd4` |
| `es-py`                     | Container image with the `es-PY` locale. | `sha256:85b3f75e75e63e29521daf772ee68a59ac2428579512501aa81dc51a2315652` |
| `es-sv`                     | Container image with the `es-SV` locale. | `sha256:db5ece7ba536e38d5de59cd37807630ab76589dcf1c97e253f98d7f44d9424e` |
| `es-us`                     | Container image with the `es-US` locale. | `sha256:99f2743725bb71e25543484f49bcfde14584ccbbaaa912678938d69d965075a` |
| `es-uy`                     | Container image with the `es-UY` locale. | `sha256:a3e11c16a97a1ae76408d812b2fee1e4b3ba07160bbcb62a22814523568ee5d` |
| `es-ve`                     | Container image with the `es-VE` locale. | `sha256:8cb431aafd84263ead8de946377c1d3f2ddfa7e172b8a4c5aa7ba477c5b41f0` |
| `et-ee`                     | Container image with the `et-EE` locale. | `sha256:943e7cf894e9d75341a58993104824c1c8cd8da1322cc5a732e9d53882c6523` |
| `fi-fi`                     | Container image with the `fi-FI` locale. | `sha256:35658e9dce796cb96a1371f250398e86351ea1b5ada080da7ce8471b30c7cae` |
| `fr-ca`                     | Container image with the `fr-CA` locale. | `sha256:62256cad671e8baa03fdd4c5f4eca7d5c5effedd64cafd9020ba72c9c4210e0` |
| `fr-fr`                     | Container image with the `fr-FR` locale. | `sha256:b385993232d9daa327d1a7b067268927b17f36eed3e8d423748794544c62746` |
| `ga-ie`                     | Container image with the `ga-IE` locale. | `sha256:ab9abdb993b0f7487edda8200f1393ac44ba4888c0f444a02afb6c85ca3e393` |
| `gu-in`                     | Container image with the `gu-IN` locale. | `sha256:328e69488f2948722d7ccc97e266071f61a8c9f65cd671688490955806526de` |
| `hi-in`                     | Container image with the `hi-IN` locale. | `sha256:b9b0bfec80aa53d06ea2cbd9097f753ec5caaf00ac2f00321ae7ad916fd7fa6` |
| `hr-hr`                     | Container image with the `hr-HR` locale. | `sha256:ab849cd2eeea682f8958bba8986fe90f0f7bb3b447512a10cf464e8e1ce4ea5` |
| `hu-hu`                     | Container image with the `hu-HU` locale. | `sha256:30f239b155d91523442cf74a1f2732304fa2b50ae7b786833bb6a020b982621` |
| `it-it`                     | Container image with the `it-IT` locale. | `sha256:288f95413870eb9d33bf1dabfa6fbd6b55b0faa52e4d5face3171d1dd4ddbdd` |
| `ja-jp`                     | Container image with the `ja-JP` locale. | `sha256:e3ab37a80c215dec565eca212f57eb81887fc2894452868dff92e3bd42c4bb9` |
| `ko-kr`                     | Container image with the `ko-KR` locale. | `sha256:c1208b8459333b606af516cd7806e9d4d5e002247bb1225e1f246563b356890` |
| `lt-lt`                     | Container image with the `lt-LT` locale. | `sha256:8dec331161d3c29fc65ba6651fcc6cfe69fa314519f408b5f9f8eb27da09830` |
| `lv-lv`                     | Container image with the `lv-LV` locale. | `sha256:7cf31282910b339666bb2b0a555caa7fc6ae414eea4423a41f35c3527f83235` |
| `mr-in`                     | Container image with the `mr-IN` locale. | `sha256:9cb012bd58ef7723d4905d6fa3c1fde96e33c354b3d96d4e3ff69cf6e1bfe3a` |
| `mt-mt`                     | Container image with the `mt-MT` locale. | `sha256:a0094c032ea555b168ec5751ab3257337d902d526e9ae335671fb751a352378` |
| `nb-no`                     | Container image with the `nb-NO` locale. | `sha256:6bbc326e20a6a785b1ca33143b42a060858efb67b863a267d6efb7aebb48f87` |
| `nl-nl`                     | Container image with the `nl-NL` locale. | `sha256:94b4ddf4cc80fa666e422f8416aea3f98ebe4842dfe9b1f4bfea7c47eb61127` |
| `pl-pl`                     | Container image with the `pl-PL` locale. | `sha256:58e5f78bf772c3c8cbd5f0c5d6e67f5348e04e3f893d84738a2a3e964bab256` |
| `pt-br`                     | Container image with the `pt-BR` locale. | `sha256:f500ef956bd28807f40df1f9f0520e437c5084f61a3be6d1379e746887d5b7c` |
| `pt-pt`                     | Container image with the `pt-PT` locale. | `sha256:c841d2dbe5f40adf6039242c106985febb1a44212feb55d9769fe31134ec116` |
| `ro-ro`                     | Container image with the `ro-RO` locale. | `sha256:93271c39c0a134e987a069c2a65289acff9869ae0d90fdcb39928c9ef0fd86b` |
| `ru-ru`                     | Container image with the `ru-RU` locale. | `sha256:8d6b3c600e56cc96813b8c14b7916c5539a20ba561dc1c6d5bbef6285d6eef6` |
| `sk-sk`                     | Container image with the `sk-SK` locale. | `sha256:6d604092cc6c964663a1c97d91c8f1c8cf4b46d07427d03f7041c0cc55eb521` |
| `sl-si`                     | Container image with the `sl-SI` locale. | `sha256:f237ed58fedefcc749e74be1258cc70e5a690ee6c5a6b6388bd24075faa61da` |
| `sv-se`                     | Container image with the `sv-SE` locale. | `sha256:da4233e6658b00eefdadb9d4acd889c6550a5e2a4a7af7a9f915c878abd4c9c` |
| `ta-in`                     | Container image with the `ta-IN` locale. | `sha256:22b77606d25e9c2f52bf3cad6218782b4719f6a9dcfadc770468d266758a56c` |
| `te-in`                     | Container image with the `te-IN` locale. | `sha256:7f4d11372862ca1d65fc9b868e2d775701b8e6eabd786c90c4e9ab82ba86e88` |
| `th-th`                     | Container image with the `th-TH` locale. | `sha256:69033bcd7c0f59d31bafec6c2b7a9ff343928cdd58c16105415c291d555d37b` |
| `tr-tr`                     | Container image with the `tr-TR` locale. | `sha256:4b7d339846a0d371dfe25aa2e626f131003c01329c9a1da468eb3703ef176ea` |
| `zh-cn`                     | Container image with the `zh-CN` locale. | `sha256:a428459830fb766083212f71c5638a65ce30d8dd84f6c624ae22768e8a76976` |
| `zh-hk`                     | Container image with the `zh-HK` locale. | `sha256:7a2903462b67336a6ce4c8e2faac42052f0a4392d1d5eb3839758cc8d0429f1` |
| `zh-tw`                     | Container image with the `zh-TW` locale. | `sha256:30fd2b3660e047d24a46fbba14ba282f15bc0339ec93f49afd0d02ff4069146` |


# [Previous version](#tab/previous)

Release note for `2.6.0-amd64-<locale>`:

**Features**
* Upgraded to latest models and fully migrated to .NET 3.1
* Support for phraselist v2
* Phrase lists are supported in the following locales:
    * en-au
    * en-ca
    * en-gb
    * en-in
    * en-us
    * zh-cn
* Support for new locale `cs-CZ` 
    * Capitalization and punctuation are currently not supported.

**Fixes**
* Fixes an issue where confidence scores were always 1 in Diarization mode
* Migrated use the TextAnalytics 3.0 API

Note that due to the included phrase lists, the size of this container image has increased. 

Release note for `2.5.0-amd64-<locale>`:

**Features**
* Support for Azure US Government Cloud

**Fixes**
* Fixes an issue with running as a non-root user in Diarization mode

| Image Tags                  | Notes                                    |
|-----------------------------|:-----------------------------------------|
| `2.6.0-amd64-<locale>`      | Replace `<locale>` with one of the available locales, listed below. For example `2.6.0-amd64-en-us`. |
| `2.5.0-amd64-<locale>`      | Replace `<locale>` with one of the available locales, listed below. For example `2.5.0-amd64-en-us`. |


This container has the following locales available.

| Locale for v2.6.0           | Notes                                    |
|-----------------------------|:-----------------------------------------|
| `ar-ae`                     | Container image with the `ar-AE` locale. |
| `ar-eg`                     | Container image with the `ar-EG` locale. |
| `ar-kw`                     | Container image with the `ar-KW` locale. |
| `ar-qa`                     | Container image with the `ar-QA` locale. |
| `ar-sa`                     | Container image with the `ar-SA` locale. |
| `ca-es`                     | Container image with the `ca-ES` locale. |
| `cs-cz`                     | Container image with the `cs-CZ` locale. |
| `da-dk`                     | Container image with the `da-DK` locale. |
| `de-de`                     | Container image with the `de-DE` locale. |
| `en-au`                     | Container image with the `en-AU` locale. |
| `en-ca`                     | Container image with the `en-CA` locale. |
| `en-gb`                     | Container image with the `en-GB` locale. |
| `en-in`                     | Container image with the `en-IN` locale. |
| `en-nz`                     | Container image with the `en-NZ` locale. |
| `en-us`                     | Container image with the `en-US` locale. |
| `es-es`                     | Container image with the `es-ES` locale. |
| `es-mx`                     | Container image with the `es-MX` locale. |
| `fi-fi`                     | Container image with the `fi-FI` locale. |
| `fr-ca`                     | Container image with the `fr-CA` locale. |
| `fr-fr`                     | Container image with the `fr-FR` locale. |
| `gu-in`                     | Container image with the `gu-IN` locale. |
| `hi-in`                     | Container image with the `hi-IN` locale. |
| `it-it`                     | Container image with the `it-IT` locale. |
| `ja-jp`                     | Container image with the `ja-JP` locale. |
| `ko-kr`                     | Container image with the `ko-KR` locale. |
| `mr-in`                     | Container image with the `mr-IN` locale. |
| `nb-no`                     | Container image with the `nb-NO` locale. |
| `nl-nl`                     | Container image with the `nl-NL` locale. |
| `pl-pl`                     | Container image with the `pl-PL` locale. |
| `pt-br`                     | Container image with the `pt-BR` locale. |
| `pt-pt`                     | Container image with the `pt-PT` locale. |
| `ru-ru`                     | Container image with the `ru-RU` locale. |
| `sv-se`                     | Container image with the `sv-SE` locale. |
| `ta-in`                     | Container image with the `ta-IN` locale. |
| `te-in`                     | Container image with the `te-IN` locale. |
| `th-th`                     | Container image with the `th-TH` locale. |
| `tr-tr`                     | Container image with the `tr-TR` locale. |
| `zh-cn`                     | Container image with the `zh-CN` locale. |
| `zh-hk`                     | Container image with the `zh-HK` locale. |
| `zh-tw`                     | Container image with the `zh-TW` locale. |

| Locale for v2.5.0           | Notes                                    |
|-----------------------------|:-----------------------------------------|
| `ar-ae`                     | Container image with the `ar-AE` locale. |
| `ar-eg`                     | Container image with the `ar-EG` locale. |
| `ar-kw`                     | Container image with the `ar-KW` locale. |
| `ar-qa`                     | Container image with the `ar-QA` locale. |
| `ar-sa`                     | Container image with the `ar-SA` locale. |
| `ca-es`                     | Container image with the `ca-ES` locale. |
| `da-dk`                     | Container image with the `da-DK` locale. |
| `de-de`                     | Container image with the `de-DE` locale. |
| `en-au`                     | Container image with the `en-AU` locale. |
| `en-ca`                     | Container image with the `en-CA` locale. |
| `en-gb`                     | Container image with the `en-GB` locale. |
| `en-in`                     | Container image with the `en-IN` locale. |
| `en-nz`                     | Container image with the `en-NZ` locale. |
| `en-us`                     | Container image with the `en-US` locale. |
| `es-es`                     | Container image with the `es-ES` locale. |
| `es-mx`                     | Container image with the `es-MX` locale. |
| `fi-fi`                     | Container image with the `fi-FI` locale. |
| `fr-ca`                     | Container image with the `fr-CA` locale. |
| `fr-fr`                     | Container image with the `fr-FR` locale. |
| `gu-in`                     | Container image with the `gu-IN` locale. |
| `hi-in`                     | Container image with the `hi-IN` locale. |
| `it-it`                     | Container image with the `it-IT` locale. |
| `ja-jp`                     | Container image with the `ja-JP` locale. |
| `ko-kr`                     | Container image with the `ko-KR` locale. |
| `mr-in`                     | Container image with the `mr-IN` locale. |
| `nb-no`                     | Container image with the `nb-NO` locale. |
| `nl-nl`                     | Container image with the `nl-NL` locale. |
| `pl-pl`                     | Container image with the `pl-PL` locale. |
| `pt-br`                     | Container image with the `pt-BR` locale. |
| `pt-pt`                     | Container image with the `pt-PT` locale. |
| `ru-ru`                     | Container image with the `ru-RU` locale. |
| `sv-se`                     | Container image with the `sv-SE` locale. |
| `ta-in`                     | Container image with the `ta-IN` locale. |
| `te-in`                     | Container image with the `te-IN` locale. |
| `th-th`                     | Container image with the `th-TH` locale. |
| `tr-tr`                     | Container image with the `tr-TR` locale. |
| `zh-cn`                     | Container image with the `zh-CN` locale. |
| `zh-hk`                     | Container image with the `zh-HK` locale. |
| `zh-tw`                     | Container image with the `zh-TW` locale. |

---

## Text-to-speech

The [Text-to-speech][sp-tts] container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services/speechservices/` repository and is named `text-to-speech`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/speechservices/text-to-speech`.

This container image has the following tags available. You can also find a full list of [tags on the MCR](https://mcr.microsoft.com/v2/azure-cognitive-services/speechservices/text-to-speech/tags/list).


# [Latest version](#tab/current)

Release note for `1.9.0-amd64-<locale-and-voice>`:

* Regular monthly release

| Image Tags                                  | Notes                                                                                                         |
|---------------------------------------------|:--------------------------------------------------------------------------------------------------------------|
| `latest`                                    | Container image with the `en-US` locale and `en-US-AriaRUS` voice.                                            | 
| `1.9.0-amd64-<locale-and-voice>`            | Replace `<locale>` with one of the available locales, listed below. For example `1.9.0-amd64-en-us-ariarus`.  |


| Locales for v1.9.0                          | Notes                                                                      | Digest                         |
|---------------------------------------------|:---------------------------------------------------------------------------|:-------------------------------|
| `ar-eg-hoda`                                | Container image with the `ar-EG` locale and `ar-EG-Hoda` voice.            | `sha256:2b19cfd2212d6517b286aa18617d2f9d1dd1520078b559cbbf9240599270d10` | 
| `ar-sa-naayf`                               | Container image with the `ar-SA` locale and `ar-SA-Naayf` voice.           | `sha256:6063aae5fb15c62b234cf945220916516a06ca81354c5311dee02af4d8cb0d3` |
| `bg-bg-ivan`                                | Container image with the `bg-BG` locale and `bg-BG-Ivan` voice.            | `sha256:c6786916464755e64ffa64e69e8f3e7ef16115bac00bb6ea1e45368c42c58d1` |
| `ca-es-herenarus`                           | Container image with the `ca-ES` locale and `ca-ES-HerenaRUS` voice.       | `sha256:2a8a1accbf99e2746c9345b77e2f261e0111227312c402cc2e1cd8760cdc82a` |
| `cs-cz-jakub`                               | Container image with the `cs-CZ` locale and `cs-CZ-Jakub` voice.           | `sha256:3e464356bb08c9c966af2b28a88ccafd591aecd2e37a0fedb356bd443720e8d` |
| `da-dk-hellerus`                            | Container image with the `da-DK` locale and `da-DK-HelleRUS` voice.        | `sha256:b85c43080804103673ff99dddea644a516c4103e8b1f11fa3dd34857492cd40` |
| `de-at-michael`                             | Container image with the `de-AT` locale and `de-AT-Michael` voice.         | `sha256:87b57ee61f964e4d72e75d860c499fa3b3d8dbda6a96c97d696beb20aa8b2a9` |
| `de-ch-karsten`                             | Container image with the `de-CH` locale and `de-CH-Karsten` voice.         | `sha256:ab1385b9746f4f054204302b9d564a433ae03748021b8ed71b4a3a224af1e9b` |
| `de-de-heddarus`                            | Container image with the `de-DE` locale and `de-DE-Hedda` voice.           | `sha256:82185a710c87f9dde678d88036867559ab3bf5f08f234d60d1548d3e106db57` |
| `de-de-hedda`                               | Container image with the `de-DE` locale and `de-DE-Hedda` voice.           | `sha256:82185a710c87f9dde678d88036867559ab3bf5f08f234d60d1548d3e106db57` |
| `de-de-stefan-apollo`                       | Container image with the `de-DE` locale and `de-DE-Stefan-Apollo` voice.   | `sha256:56a1c63e7e6a0f5623ddc1f6a44ac6e51471d073e02e14e8c8b1e577930d816` |
| `el-gr-stefanos`                            | Container image with the `el-GR` locale and `el-GR-Stefanos` voice.        | `sha256:ccbbb09f29ff8f276e246037183c7a3e9a3eb5bf33a942b22205cce3c6857f2` |
| `en-au-catherine`                           | Container image with the `en-AU` locale and `en-AU-Catherine` voice.       | `sha256:0c7374890f963e1ae9507e89dc9965a94723bd57802826c0677cd5262189783` |
| `en-au-hayleyrus`                           | Container image with the `en-AU` locale and `en-AU-HayleyRUS` voice.       | `sha256:7430bf8eace8294ca085f36ea56399261b2b4f69027e86649e8f3868fc3d811` |
| `en-ca-heatherrus`                          | Container image with the `en-CA` locale and `en-CA-HeatherRUS` voice.      | `sha256:0166ce1de3d669ea4ad80738c63369b7032125a54ecabade07241d740a94cfe` |
| `en-ca-linda`                               | Container image with the `en-CA` locale and `en-CA-Linda` voice.           | `sha256:50bed6a7bde9b793d307bcc3ace4c0f28d4a33c7a4dad9b3a394dc39a3e1c28` |
| `en-gb-george-apollo`                       | Container image with the `en-GB` locale and `en-GB-George-Apollo` voice.   | `sha256:50b800c0018a39609ddb1cee1b10062bf38a907644c393d20786db7c3ade748` |
| `en-gb-hazelrus`                            | Container image with the `en-GB` locale and `en-GB-HazelRUS` voice.        | `sha256:2aa79394dfeac8cec0cc1704a5199949cfccf347fe61161d02c7000c4ffcfa6` |
| `en-gb-susan-apollo`                        | Container image with the `en-GB` locale and `en-GB-Susan-Apollo` voice.    | `sha256:7a3174b3aae5f10241e731d392b56f124808cdd506f881ced919ced73d836c0` |
| `en-ie-sean`                                | Container image with the `en-IE` locale and `en-IE-Sean` voice.            | `sha256:2457202fadb2354fc8d3666432096bd87c07760a4e3f4dbcc49853fff658577` |
| `en-in-heera-apollo`                        | Container image with the `en-IN` locale and `en-IN-Heera-Apollo` voice.    | `sha256:e4068cd7ca4272ea94819e2ba8743d2a76c8710b162db5e9ecbde6c92c12877` |
| `en-in-priyarus`                            | Container image with the `en-IN` locale and `en-IN-PriyaRUS` voice.        | `sha256:9d63a0ed53ac06178ab84588551421c0e1d04b8bad3321410ebb99c3ca2a9e8` |
| `en-in-ravi-apollo`                         | Container image with the `en-IN` locale and `en-IN-Ravi-Apollo` voice.     | `sha256:67049c9ce591336655943f5030afcfdaa150a8aace7b372425a69cc33a6b7b9` |
| `en-us-aria24krus`                          | Container image with the `en-US` locale and `en-US-Aria24kRUS` voice.      | `sha256:a95acf6874bf3df7ae8e96be779f80cb5405d21250227b0c4b3ddbcb3014082` |
| `en-us-ariarus`                             | Container image with the `en-US` locale and `en-US-AriaRUS` voice.         | `sha256:a95acf6874bf3df7ae8e96be779f80cb5405d21250227b0c4b3ddbcb3014082` |
| `en-us-benjaminrus`                         | Container image with the `en-US` locale and `en-US-BenjaminRUS` voice.     | `sha256:93cd49adaaa2a1bdfb06ab655be164ae66f206cb7c03a2cbd59e5fba70610ab` |
| `en-us-guy24krus`                           | Container image with the `en-US` locale and `en-US-Guy24kRUS` voice.       | `sha256:7b788bfcaae4c63c274ca15924bfd861cfcafd5fec13f685d80babc25b2949d` |
| `en-us-zirarus`                             | Container image with the `en-US` locale and `en-US-ZiraRUS` voice.         | `sha256:bfc87a77df5695ad43481348500fba8f6a7b495708fba200706049469b5ba97` |
| `es-es-helenarus`                           | Container image with the `es-ES` locale and `es-ES-HelenaRUS` voice.       | `sha256:0b6c17aca75efb64aa9bfc0d83303038fe58d4b2fb1fc94c9380a4335b80796` |
| `es-es-laura-apollo`                        | Container image with the `es-ES` locale and `es-ES-Laura-Apollo` voice.    | `sha256:d6fcffc944c37a2dd0de29c39b82f3f8cce3a95ad925d2814ed7538335d5d4f` |
| `es-es-pablo-apollo`                        | Container image with the `es-ES` locale and `es-ES-Pablo-Apollo` voice.    | `sha256:a460bc53d9083d3c3770129995cf96cc1069ae4e8101f1739d304fe210f0af0` |
| `es-mx-hildarus`                            | Container image with the `es-MX` locale and `es-MX-HildaRUS` voice.        | `sha256:5b7578fc5b00158dfa674d95a3f1d57f22eb285e8333b4006d1fe1808bda7ba` |
| `es-mx-raul-apollo`                         | Container image with the `es-MX` locale and `es-MX-Raul-Apollo` voice.     | `sha256:03922fb017783c86d788c72e01c7ede440f8f3c913c86cab19bad4dfc2e4a2b` |
| `fi-fi-heidirus`                            | Container image with the `fi-FI` locale and `fi-FI-HeidiRUS` voice.        | `sha256:146c1f98d6fa061016eba41db6e7b654eef222d37f35406d4b43477bb2ff897` |
| `fr-ca-caroline`                            | Container image with the `fr-CA` locale and `fr-CA-Caroline` voice.        | `sha256:1ee2e53f12ad1c72665d2aef64e9d4a7f9ea05670cad84dcae5e75409494f32` |
| `fr-ca-harmonierus`                         | Container image with the `fr-CA` locale and `fr-CA-HarmonieRUS` voice.     | `sha256:a21d25d3ac699af4e9ba9194aadd9b45f35fd9205224f3429a4c7da41fc38fe` |
| `fr-ch-guillaume`                           | Container image with the `fr-CH` locale and `fr-CH-Guillaume` voice.       | `sha256:216125a9bd89a95d3c4dc2d7e031398659427b3aa7d4663d23a65737972e42b` |
| `fr-fr-hortenserus`                         | Container image with the `fr-FR` locale and `fr-FR-HortenseRUS` voice.     | `sha256:795a698120eecbd80c48e738f73300739c1698ca859130ddb4236317bcdf70f` |
| `fr-fr-julie-apollo`                        | Container image with the `fr-FR` locale and `fr-FR-Julie-Apollo` voice.    | `sha256:f6eb70d523c435c2e3a713b32a8af4a781df7ec043caad2fc7f458ee341eb2f` |
| `fr-fr-paul-apollo`                         | Container image with the `fr-FR` locale and `fr-FR-Paul-Apollo` voice.     | `sha256:28864c662a20f459b3051b1da2967a605e06267e6408285f7c2552748cf4eed` |
| `he-il-asaf`                                | Container image with the `he-IL` locale and `he-IL-Asaf` voice.            | `sha256:eaa834bac6b69abef096b36a8baead741db78fe438af3d30f60abde3631d639` |
| `hi-in-hemant`                              | Container image with the `hi-IN` locale and `hi-IN-Hemant` voice.          | `sha256:cfea0fa7cce9cc512f2fbb8b76f1c00fe5c32fad853c90b15934cf4ee6262fa` |
| `hi-in-kalpana-apollo`                      | Container image with the `hi-IN` locale and `hi-IN-Kalpana-Apollo` voice.  | `sha256:afbd6cc0413f3a3c9f6df044b6df6d9dac9e8e888c2cb619fefbdc3e105c644` |
| `hi-in-kalpana`                             | Container image with the `hi-IN` locale and `hi-IN-Kalpana` voice.         | `sha256:afbd6cc0413f3a3c9f6df044b6df6d9dac9e8e888c2cb619fefbdc3e105c644` |
| `hr-hr-matej`                               | Container image with the `hr-HR` locale and `hr-HR-Matej` voice.           | `sha256:86683597c62752b4d769b69e5294979fafd4c277aaef1536e1cb19f9f06c0bf` |
| `hu-hu-szabolcs`                            | Container image with the `hu-HU` locale and `hu-HU-Szabolcs` voice.        | `sha256:aa64eed28ca2ad060e2e02188e0401bf34e4caf7e2182b70a30ce33b3c11c9c` |
| `id-id-andika`                              | Container image with the `id-ID` locale and `id-ID-Andika` voice.          | `sha256:0e1394d231a57a1df8163ccb634dc2ef2f8103b10608a40ab3efc5c0fbe9ded` |
| `it-it-cosimo-apollo`                       | Container image with the `it-IT` locale and `it-IT-Cosimo-Apollo` voice.   | `sha256:eef97f2817fc24405823a5fe4e825244db32279b44c0e6631e8ad9a5c1acf40` |
| `it-it-luciarus`                            | Container image with the `it-IT` locale and `it-IT-LuciaRUS` voice.        | `sha256:ebc331b0685f482d2f55619fa81fd451fd7c8f107f9cd7ad159bc6213ae4e33` |
| `ja-jp-ayumi-apollo`                        | Container image with the `ja-JP` locale and `ja-JP-Ayumi-Apollo` voice.    | `sha256:e9cb7dfd2eec154c8f3d530c16b66e8558c5955a2edaede69740067f00e43cf` |
| `ja-jp-harukarus`                           | Container image with the `ja-JP` locale and `ja-JP-HarukaRUS` voice.       | `sha256:93ce2ef6177c0d8ac70b61df8b11fcbcdfd3c0be0cc51cd8644f26679a741c2` |
| `ja-jp-ichiro-apollo`                       | Container image with the `ja-JP` locale and `ja-JP-Ichiro-Apollo` voice.   | `sha256:6a18bae69ac63b42ba992b8b74d8d31d91ca984d61b5f62f38be988cf38645e` |
| `ko-kr-heamirus`                            | Container image with the `ko-KR` locale and `ko-KR-HeamiRUS` voice.        | `sha256:7a48252d4ada2af43f9266a70113426d330bac192348cbdc929022295a0e727` |
| `ms-my-rizwan`                              | Container image with the `ms-MY` locale and `ms-MY-Rizwan` voice.          | `sha256:90e2ecac14f8e960934fd013d208fc2a0afe1bfff037d5648d422bda8d8a76e` |
| `nb-no-huldarus`                            | Container image with the `nb-NO` locale and `nb-NO-HuldaRUS` voice.        | `sha256:217b61bd6244b5effda8f12a2c563ce1b4572e9c5b8a08df143665f9ff754e4` |
| `nl-nl-hannarus`                            | Container image with the `nl-NL` locale and `nl-NL-HannaRUS` voice.        | `sha256:fbff48dfc9dfadadf377867b28f6e3a3bd605e59da20f77a531efcc7d85d16e` |
| `pl-pl-paulinarus`                          | Container image with the `pl-PL` locale and `pl-PL-PaulinaRUS` voice.      | `sha256:856a033a09925773fa4b4531e199ab7c03c537f366acecbda60f8d21735725e` |
| `pt-br-daniel-apollo`                       | Container image with the `pt-BR` locale and `pt-BR-Daniel-Apollo` voice.   | `sha256:2d1ec975f1aee56a6fc6039d154fb3f2fbeb4636f7078c5dfe99aeddb6a3634` |
| `pt-br-heloisarus`                          | Container image with the `pt-BR` locale and `pt-BR-HeloisaRUS` voice.      | `sha256:b7d629f37ab3305274764264dc08fab5236e60ef18d40e987618115db67ce44` |
| `pt-pt-heliarus`                            | Container image with the `pt-PT` locale and `pt-PT-HeliaRUS` voice.        | `sha256:8b380ae7e4aac9d4ada4d15fa9e667387bc9ca038796d9b6999953bfbc97259` |
| `ro-ro-andrei`                              | Container image with the `ro-RO` locale and `ro-RO-Andrei` voice.          | `sha256:b00ca7f1411169a5baf7263a8d7e5eed1a72084d9489eaf458429dfc338564a` |
| `ru-ru-ekaterinarus`                        | Container image with the `ru-RU` locale and `ru-RU-EkaterinaRUS` voice.    | `sha256:31c588c31e3ac67305af66091e7756dfc4ca454317d0228116ea0b2fedf5d71` |
| `ru-ru-irina-apollo`                        | Container image with the `ru-RU` locale and `ru-RU-Irina-Apollo` voice.    | `sha256:e76437f8da7c279b38d2643defc997a13b4a364e9a212895cdb33a9a3f6457f` |
| `ru-ru-pavel-apollo`                        | Container image with the `ru-RU` locale and `ru-RU-Pavel-Apollo` voice.    | `sha256:461c1efa6cce0b10a87f338bc637aca76aef8458061a688870fb3343d682da0` |
| `sk-sk-filip`                               | Container image with the `sk-SK` locale and `sk-SK-Filip` voice.           | `sha256:7fb0cfab4c0fe2913eb20f28a25c6663015d62f82e7e7864d9f7fac2d27697b` |
| `sl-si-lado`                                | Container image with the `sl-SI` locale and `sl-SI-Lado` voice.            | `sha256:5336173d410e10ffeb5dc211a583887e33754319c757914955057d398dfbb0a` |
| `sv-se-hedvigrus`                           | Container image with the `sv-SE` locale and `sv-SE-HedvigRUS` voice.       | `sha256:5dc8cdcc3054386bf69596707d9d261d4db5bfd09f1882ceb4e29238a34b24e` |
| `ta-in-valluvar`                            | Container image with the `ta-IN` locale and `ta-IN-Valluvar` voice.        | `sha256:74ea485f23e4c1fe0029e06894860aa0188c36c0e14ea3584a06d4216ccef56` |
| `te-in-chitra`                              | Container image with the `te-IN` locale and `te-IN-Chitra` voice.          | `sha256:ff2977a98ef691da543db08be9cfe04d7fc3bf8f78b29310c163e47303b2ddd` |
| `th-th-pattara`                             | Container image with the `th-TH` locale and `th-TH-Pattara` voice.         | `sha256:ba7e2c0e5e75d9f2b52aa50c97728616c43e81f48c15e24665e4c2ea5770a8f` |
| `tr-tr-sedarus`                             | Container image with the `tr-TR` locale and `tr-TR-SedaRUS` voice.         | `sha256:375a8ceae89ea1f0dda551feff30ae3679231189b527992edbc49988d042d66` |
| `vi-vn-an`                                  | Container image with the `vi-VN` locale and `vi-VN-An` voice.              | `sha256:b6f82148295b38b4039c45c48695ec50b4e97cd02b18d49c39bf9fca3bec958` |
| `zh-cn-huihuirus`                           | Container image with the `zh-CN` locale and `zh-CN-HuihuiRUS` voice.       | `sha256:3e773931f3adaac92cba43773a241692a2b471ebe73ec51c475df8ff63b7ee1` |
| `zh-cn-kangkang-apollo`                     | Container image with the `zh-CN` locale and `zh-CN-Kangkang-Apollo` voice. | `sha256:05fc0d5075a1094caf70d98b4a9469952be52cb6eb4d9f7b9ff4ae961100c7b` |
| `zh-cn-yaoyao-apollo`                       | Container image with the `zh-CN` locale and `zh-CN-Yaoyao-Apollo` voice.   | `sha256:d7613bcefc48e85b9d6f07c8cd223c16d4958bcf7f24087575250e97c593ac1` |
| `zh-hk-danny-apollo`                        | Container image with the `zh-HK` locale and `zh-HK-Danny-Apollo` voice.    | `sha256:efe22bc123dac9312dcaeb859a377d81f61fbb25ef46e4678d36ec6bebc5d32` |
| `zh-hk-tracy-apollo`                        | Container image with the `zh-HK` locale and `zh-HK-Tracy-Apollo` voice.    | `sha256:802c60bc65012c03ffe96268dca79b8c6dcd0c5cc6180ec271c50ef5c9ba132` |
| `zh-hk-tracyrus`                            | Container image with the `zh-HK` locale and `zh-HK-TracyRUS` voice.        | `sha256:802c60bc65012c03ffe96268dca79b8c6dcd0c5cc6180ec271c50ef5c9ba132` |
| `zh-tw-hanhanrus`                           | Container image with the `zh-TW` locale and `zh-TW-HanHanRUS` voice.       | `sha256:95d58922463d577d4c4722ab722a5768af35fb62236d47f6709717dea758909` |
| `zh-tw-yating-apollo`                       | Container image with the `zh-TW` locale and `zh-TW-Yating-Apollo` voice.   | `sha256:33eec6e3aaaedafaf3969746eeaf97a1760e763505decfe2abaa03f5054bfd2` |
| `zh-tw-zhiwei-apollo`                       | Container image with the `zh-TW` locale and `zh-TW-Zhiwei-Apollo` voice.   | `sha256:456db2898b2e5a9c30b7071ce6ea3f141438cbf1aa4899c7ffccfc2f0dde5bd` |


# [Previous version](#tab/previous)

Release note for `1.8.0-amd64-<locale-and-voice>`:

**Feature**

* Fully migrated to .NET 3.1

Release note for `1.7.0-amd64-<locale-and-voice>`:

**Feature**

* Upgraded components to .NET 3.1

| Image Tags                                  | Notes                                                                                                         |
|---------------------------------------------|:--------------------------------------------------------------------------------------------------------------|
| `1.8.0-amd64-<locale-and-voice>`            | Replace `<locale>` with one of the available locales, listed below. For example `1.8.0-amd64-en-us-ariarus`.  |
| `1.7.0-amd64-<locale-and-voice>`            | 1st GA version. Replace `<locale>` with one of the available locales, listed below. For example `1.7.0-amd64-en-us-ariarus`.  |


| Locales for v1.8.0                          | Notes                                                                      |
|---------------------------------------------|:---------------------------------------------------------------------------|
| `ar-eg-hoda`                                | Container image with the `ar-EG` locale and `ar-EG-Hoda` voice.            |
| `ar-sa-naayf`                               | Container image with the `ar-SA` locale and `ar-SA-Naayf` voice.           |
| `bg-bg-ivan`                                | Container image with the `bg-BG` locale and `bg-BG-Ivan` voice.            |
| `ca-es-herenarus`                           | Container image with the `ca-ES` locale and `ca-ES-HerenaRUS` voice.       |
| `cs-cz-jakub`                               | Container image with the `cs-CZ` locale and `cs-CZ-Jakub` voice.           |
| `da-dk-hellerus`                            | Container image with the `da-DK` locale and `da-DK-HelleRUS` voice.        |
| `de-at-michael`                             | Container image with the `de-AT` locale and `de-AT-Michael` voice.         |
| `de-ch-karsten`                             | Container image with the `de-CH` locale and `de-CH-Karsten` voice.         |
| `de-de-hedda`                               | Container image with the `de-DE` locale and `de-DE-Hedda` voice.           |
| `de-de-heddarus`                            | Container image with the `de-DE` locale and `de-DE-Hedda` voice.           |
| `de-de-stefan-apollo`                       | Container image with the `de-DE` locale and `de-DE-Stefan-Apollo` voice.   |
| `el-gr-stefanos`                            | Container image with the `el-GR` locale and `el-GR-Stefanos` voice.        |
| `en-au-catherine`                           | Container image with the `en-AU` locale and `en-AU-Catherine` voice.       |
| `en-au-hayleyrus`                           | Container image with the `en-AU` locale and `en-AU-HayleyRUS` voice.       |
| `en-ca-heatherrus`                          | Container image with the `en-CA` locale and `en-CA-HeatherRUS` voice.      |
| `en-ca-linda`                               | Container image with the `en-CA` locale and `en-CA-Linda` voice.           |
| `en-gb-george-apollo`                       | Container image with the `en-GB` locale and `en-GB-George-Apollo` voice.   |
| `en-gb-hazelrus`                            | Container image with the `en-GB` locale and `en-GB-HazelRUS` voice.        |
| `en-gb-susan-apollo`                        | Container image with the `en-GB` locale and `en-GB-Susan-Apollo` voice.    |
| `en-ie-sean`                                | Container image with the `en-IE` locale and `en-IE-Sean` voice.            |
| `en-in-heera-apollo`                        | Container image with the `en-IN` locale and `en-IN-Heera-Apollo` voice.    |
| `en-in-priyarus`                            | Container image with the `en-IN` locale and `en-IN-PriyaRUS` voice.        |
| `en-in-ravi-apollo`                         | Container image with the `en-IN` locale and `en-IN-Ravi-Apollo` voice.     |
| `en-us-benjaminrus`                         | Container image with the `en-US` locale and `en-US-BenjaminRUS` voice.     |
| `en-us-guy24krus`                           | Container image with the `en-US` locale and `en-US-Guy24kRUS` voice.       |
| `en-us-aria24krus`                          | Container image with the `en-US` locale and `en-US-Aria24kRUS` voice.      |
| `en-us-ariarus`                             | Container image with the `en-US` locale and `en-US-AriaRUS` voice.         |
| `en-us-zirarus`                             | Container image with the `en-US` locale and `en-US-ZiraRUS` voice.         |
| `es-es-helenarus`                           | Container image with the `es-ES` locale and `es-ES-HelenaRUS` voice.       |
| `es-es-laura-apollo`                        | Container image with the `es-ES` locale and `es-ES-Laura-Apollo` voice.    |
| `es-es-pablo-apollo`                        | Container image with the `es-ES` locale and `es-ES-Pablo-Apollo` voice.    |
| `es-mx-hildarus`                            | Container image with the `es-MX` locale and `es-MX-HildaRUS` voice.        |
| `es-mx-raul-apollo`                         | Container image with the `es-MX` locale and `es-MX-Raul-Apollo` voice.     |
| `fi-fi-heidirus`                            | Container image with the `fi-FI` locale and `fi-FI-HeidiRUS` voice.        |
| `fr-ca-caroline`                            | Container image with the `fr-CA` locale and `fr-CA-Caroline` voice.        |
| `fr-ca-harmonierus`                         | Container image with the `fr-CA` locale and `fr-CA-HarmonieRUS` voice.     |
| `fr-ch-guillaume`                           | Container image with the `fr-CH` locale and `fr-CH-Guillaume` voice.       |
| `fr-fr-hortenserus`                         | Container image with the `fr-FR` locale and `fr-FR-HortenseRUS` voice.     |
| `fr-fr-julie-apollo`                        | Container image with the `fr-FR` locale and `fr-FR-Julie-Apollo` voice.    |
| `fr-fr-paul-apollo`                         | Container image with the `fr-FR` locale and `fr-FR-Paul-Apollo` voice.     |
| `he-il-asaf`                                | Container image with the `he-IL` locale and `he-IL-Asaf` voice.            |
| `hi-in-hemant`                              | Container image with the `hi-IN` locale and `hi-IN-Hemant` voice.          |
| `hi-in-kalpana-apollo`                      | Container image with the `hi-IN` locale and `hi-IN-Kalpana-Apollo` voice.  |
| `hi-in-kalpana`                             | Container image with the `hi-IN` locale and `hi-IN-Kalpana` voice.         |
| `hr-hr-matej`                               | Container image with the `hr-HR` locale and `hr-HR-Matej` voice.           |
| `hu-hu-szabolcs`                            | Container image with the `hu-HU` locale and `hu-HU-Szabolcs` voice.        |
| `id-id-andika`                              | Container image with the `id-ID` locale and `id-ID-Andika` voice.          |
| `it-it-cosimo-apollo`                       | Container image with the `it-IT` locale and `it-IT-Cosimo-Apollo` voice.   |
| `it-it-luciarus`                            | Container image with the `it-IT` locale and `it-IT-LuciaRUS` voice.        |
| `ja-jp-ayumi-apollo`                        | Container image with the `ja-JP` locale and `ja-JP-Ayumi-Apollo` voice.    |
| `ja-jp-harukarus`                           | Container image with the `ja-JP` locale and `ja-JP-HarukaRUS` voice.       |
| `ja-jp-ichiro-apollo`                       | Container image with the `ja-JP` locale and `ja-JP-Ichiro-Apollo` voice.   |
| `ko-kr-heamirus`                            | Container image with the `ko-KR` locale and `ko-KR-HeamiRUS` voice.        |
| `ms-my-rizwan`                              | Container image with the `ms-MY` locale and `ms-MY-Rizwan` voice.          |
| `nb-no-huldarus`                            | Container image with the `nb-NO` locale and `nb-NO-HuldaRUS` voice.        |
| `nl-nl-hannarus`                            | Container image with the `nl-NL` locale and `nl-NL-HannaRUS` voice.        |
| `pl-pl-paulinarus`                          | Container image with the `pl-PL` locale and `pl-PL-PaulinaRUS` voice.      |
| `pt-br-daniel-apollo`                       | Container image with the `pt-BR` locale and `pt-BR-Daniel-Apollo` voice.   |
| `pt-br-heloisarus`                          | Container image with the `pt-BR` locale and `pt-BR-HeloisaRUS` voice.      |
| `pt-pt-heliarus`                            | Container image with the `pt-PT` locale and `pt-PT-HeliaRUS` voice.        |
| `ro-ro-andrei`                              | Container image with the `ro-RO` locale and `ro-RO-Andrei` voice.          |
| `ru-ru-ekaterinarus`                        | Container image with the `ru-RU` locale and `ru-RU-EkaterinaRUS` voice.    |
| `ru-ru-irina-apollo`                        | Container image with the `ru-RU` locale and `ru-RU-Irina-Apollo` voice.    |
| `ru-ru-pavel-apollo`                        | Container image with the `ru-RU` locale and `ru-RU-Pavel-Apollo` voice.    |
| `sk-sk-filip`                               | Container image with the `sk-SK` locale and `sk-SK-Filip` voice.           |
| `sl-si-lado`                                | Container image with the `sl-SI` locale and `sl-SI-Lado` voice.            |
| `sv-se-hedvigrus`                           | Container image with the `sv-SE` locale and `sv-SE-HedvigRUS` voice.       |
| `ta-in-valluvar`                            | Container image with the `ta-IN` locale and `ta-IN-Valluvar` voice.        |
| `te-in-chitra`                              | Container image with the `te-IN` locale and `te-IN-Chitra` voice.          |
| `th-th-pattara`                             | Container image with the `th-TH` locale and `th-TH-Pattara` voice.         |
| `tr-tr-sedarus`                             | Container image with the `tr-TR` locale and `tr-TR-SedaRUS` voice.         |
| `vi-vn-an`                                  | Container image with the `vi-VN` locale and `vi-VN-An` voice.              |
| `zh-cn-huihuirus`                           | Container image with the `zh-CN` locale and `zh-CN-HuihuiRUS` voice.       |
| `zh-cn-kangkang-apollo`                     | Container image with the `zh-CN` locale and `zh-CN-Kangkang-Apollo` voice. |
| `zh-cn-yaoyao-apollo`                       | Container image with the `zh-CN` locale and `zh-CN-Yaoyao-Apollo` voice.   |
| `zh-hk-danny-apollo`                        | Container image with the `zh-HK` locale and `zh-HK-Danny-Apollo` voice.    |
| `zh-hk-tracy-apollo`                        | Container image with the `zh-HK` locale and `zh-HK-Tracy-Apollo` voice.    |
| `zh-hk-tracyrus`                            | Container image with the `zh-HK` locale and `zh-HK-TracyRUS` voice.        |
| `zh-tw-hanhanrus`                           | Container image with the `zh-TW` locale and `zh-TW-HanHanRUS` voice.       |
| `zh-tw-yating-apollo`                       | Container image with the `zh-TW` locale and `zh-TW-Yating-Apollo` voice.   |
| `zh-tw-zhiwei-apollo`                       | Container image with the `zh-TW` locale and `zh-TW-Zhiwei-Apollo` voice.   |

| Locales for v1.7.0                          | Notes                                                                      |
|---------------------------------------------|:---------------------------------------------------------------------------|
| `ar-eg-hoda`                                | Container image with the `ar-EG` locale and `ar-EG-Hoda` voice.            |
| `ar-sa-naayf`                               | Container image with the `ar-SA` locale and `ar-SA-Naayf` voice.           |
| `bg-bg-ivan`                                | Container image with the `bg-BG` locale and `bg-BG-Ivan` voice.            |
| `ca-es-herenarus`                           | Container image with the `ca-ES` locale and `ca-ES-HerenaRUS` voice.       |
| `cs-cz-jakub`                               | Container image with the `cs-CZ` locale and `cs-CZ-Jakub` voice.           |
| `da-dk-hellerus`                            | Container image with the `da-DK` locale and `da-DK-HelleRUS` voice.        |
| `de-at-michael`                             | Container image with the `de-AT` locale and `de-AT-Michael` voice.         |
| `de-ch-karsten`                             | Container image with the `de-CH` locale and `de-CH-Karsten` voice.         |
| `de-de-hedda`                               | Container image with the `de-DE` locale and `de-DE-Hedda` voice.           |
| `de-de-heddarus`                            | Container image with the `de-DE` locale and `de-DE-Hedda` voice.           |
| `de-de-stefan-apollo`                       | Container image with the `de-DE` locale and `de-DE-Stefan-Apollo` voice.   |
| `el-gr-stefanos`                            | Container image with the `el-GR` locale and `el-GR-Stefanos` voice.        |
| `en-au-catherine`                           | Container image with the `en-AU` locale and `en-AU-Catherine` voice.       |
| `en-au-hayleyrus`                           | Container image with the `en-AU` locale and `en-AU-HayleyRUS` voice.       |
| `en-ca-heatherrus`                          | Container image with the `en-CA` locale and `en-CA-HeatherRUS` voice.      |
| `en-ca-linda`                               | Container image with the `en-CA` locale and `en-CA-Linda` voice.           |
| `en-gb-george-apollo`                       | Container image with the `en-GB` locale and `en-GB-George-Apollo` voice.   |
| `en-gb-hazelrus`                            | Container image with the `en-GB` locale and `en-GB-HazelRUS` voice.        |
| `en-gb-susan-apollo`                        | Container image with the `en-GB` locale and `en-GB-Susan-Apollo` voice.    |
| `en-ie-sean`                                | Container image with the `en-IE` locale and `en-IE-Sean` voice.            |
| `en-in-heera-apollo`                        | Container image with the `en-IN` locale and `en-IN-Heera-Apollo` voice.    |
| `en-in-priyarus`                            | Container image with the `en-IN` locale and `en-IN-PriyaRUS` voice.        |
| `en-in-ravi-apollo`                         | Container image with the `en-IN` locale and `en-IN-Ravi-Apollo` voice.     |
| `en-us-benjaminrus`                         | Container image with the `en-US` locale and `en-US-BenjaminRUS` voice.     |
| `en-us-guy24krus`                           | Container image with the `en-US` locale and `en-US-Guy24kRUS` voice.       |
| `en-us-aria24krus`                          | Container image with the `en-US` locale and `en-US-Aria24kRUS` voice.      |
| `en-us-ariarus`                             | Container image with the `en-US` locale and `en-US-AriaRUS` voice.         |
| `en-us-zirarus`                             | Container image with the `en-US` locale and `en-US-ZiraRUS` voice.         |
| `es-es-helenarus`                           | Container image with the `es-ES` locale and `es-ES-HelenaRUS` voice.       |
| `es-es-laura-apollo`                        | Container image with the `es-ES` locale and `es-ES-Laura-Apollo` voice.    |
| `es-es-pablo-apollo`                        | Container image with the `es-ES` locale and `es-ES-Pablo-Apollo` voice.    |
| `es-mx-hildarus`                            | Container image with the `es-MX` locale and `es-MX-HildaRUS` voice.        |
| `es-mx-raul-apollo`                         | Container image with the `es-MX` locale and `es-MX-Raul-Apollo` voice.     |
| `fi-fi-heidirus`                            | Container image with the `fi-FI` locale and `fi-FI-HeidiRUS` voice.        |
| `fr-ca-caroline`                            | Container image with the `fr-CA` locale and `fr-CA-Caroline` voice.        |
| `fr-ca-harmonierus`                         | Container image with the `fr-CA` locale and `fr-CA-HarmonieRUS` voice.     |
| `fr-ch-guillaume`                           | Container image with the `fr-CH` locale and `fr-CH-Guillaume` voice.       |
| `fr-fr-hortenserus`                         | Container image with the `fr-FR` locale and `fr-FR-HortenseRUS` voice.     |
| `fr-fr-julie-apollo`                        | Container image with the `fr-FR` locale and `fr-FR-Julie-Apollo` voice.    |
| `fr-fr-paul-apollo`                         | Container image with the `fr-FR` locale and `fr-FR-Paul-Apollo` voice.     |
| `he-il-asaf`                                | Container image with the `he-IL` locale and `he-IL-Asaf` voice.            |
| `hi-in-hemant`                              | Container image with the `hi-IN` locale and `hi-IN-Hemant` voice.          |
| `hi-in-kalpana-apollo`                      | Container image with the `hi-IN` locale and `hi-IN-Kalpana-Apollo` voice.  |
| `hi-in-kalpana`                             | Container image with the `hi-IN` locale and `hi-IN-Kalpana` voice.         |
| `hr-hr-matej`                               | Container image with the `hr-HR` locale and `hr-HR-Matej` voice.           |
| `hu-hu-szabolcs`                            | Container image with the `hu-HU` locale and `hu-HU-Szabolcs` voice.        |
| `id-id-andika`                              | Container image with the `id-ID` locale and `id-ID-Andika` voice.          |
| `it-it-cosimo-apollo`                       | Container image with the `it-IT` locale and `it-IT-Cosimo-Apollo` voice.   |
| `it-it-luciarus`                            | Container image with the `it-IT` locale and `it-IT-LuciaRUS` voice.        |
| `ja-jp-ayumi-apollo`                        | Container image with the `ja-JP` locale and `ja-JP-Ayumi-Apollo` voice.    |
| `ja-jp-harukarus`                           | Container image with the `ja-JP` locale and `ja-JP-HarukaRUS` voice.       |
| `ja-jp-ichiro-apollo`                       | Container image with the `ja-JP` locale and `ja-JP-Ichiro-Apollo` voice.   |
| `ko-kr-heamirus`                            | Container image with the `ko-KR` locale and `ko-KR-HeamiRUS` voice.        |
| `ms-my-rizwan`                              | Container image with the `ms-MY` locale and `ms-MY-Rizwan` voice.          |
| `nb-no-huldarus`                            | Container image with the `nb-NO` locale and `nb-NO-HuldaRUS` voice.        |
| `nl-nl-hannarus`                            | Container image with the `nl-NL` locale and `nl-NL-HannaRUS` voice.        |
| `pl-pl-paulinarus`                          | Container image with the `pl-PL` locale and `pl-PL-PaulinaRUS` voice.      |
| `pt-br-daniel-apollo`                       | Container image with the `pt-BR` locale and `pt-BR-Daniel-Apollo` voice.   |
| `pt-br-heloisarus`                          | Container image with the `pt-BR` locale and `pt-BR-HeloisaRUS` voice.      |
| `pt-pt-heliarus`                            | Container image with the `pt-PT` locale and `pt-PT-HeliaRUS` voice.        |
| `ro-ro-andrei`                              | Container image with the `ro-RO` locale and `ro-RO-Andrei` voice.          |
| `ru-ru-ekaterinarus`                        | Container image with the `ru-RU` locale and `ru-RU-EkaterinaRUS` voice.    |
| `ru-ru-irina-apollo`                        | Container image with the `ru-RU` locale and `ru-RU-Irina-Apollo` voice.    |
| `ru-ru-pavel-apollo`                        | Container image with the `ru-RU` locale and `ru-RU-Pavel-Apollo` voice.    |
| `sk-sk-filip`                               | Container image with the `sk-SK` locale and `sk-SK-Filip` voice.           |
| `sl-si-lado`                                | Container image with the `sl-SI` locale and `sl-SI-Lado` voice.            |
| `sv-se-hedvigrus`                           | Container image with the `sv-SE` locale and `sv-SE-HedvigRUS` voice.       |
| `ta-in-valluvar`                            | Container image with the `ta-IN` locale and `ta-IN-Valluvar` voice.        |
| `te-in-chitra`                              | Container image with the `te-IN` locale and `te-IN-Chitra` voice.          |
| `th-th-pattara`                             | Container image with the `th-TH` locale and `th-TH-Pattara` voice.         |
| `tr-tr-sedarus`                             | Container image with the `tr-TR` locale and `tr-TR-SedaRUS` voice.         |
| `vi-vn-an`                                  | Container image with the `vi-VN` locale and `vi-VN-An` voice.              |
| `zh-cn-huihuirus`                           | Container image with the `zh-CN` locale and `zh-CN-HuihuiRUS` voice.       |
| `zh-cn-kangkang-apollo`                     | Container image with the `zh-CN` locale and `zh-CN-Kangkang-Apollo` voice. |
| `zh-cn-yaoyao-apollo`                       | Container image with the `zh-CN` locale and `zh-CN-Yaoyao-Apollo` voice.   |
| `zh-hk-danny-apollo`                        | Container image with the `zh-HK` locale and `zh-HK-Danny-Apollo` voice.    |
| `zh-hk-tracy-apollo`                        | Container image with the `zh-HK` locale and `zh-HK-Tracy-Apollo` voice.    |
| `zh-hk-tracyrus`                            | Container image with the `zh-HK` locale and `zh-HK-TracyRUS` voice.        |
| `zh-tw-hanhanrus`                           | Container image with the `zh-TW` locale and `zh-TW-HanHanRUS` voice.       |
| `zh-tw-yating-apollo`                       | Container image with the `zh-TW` locale and `zh-TW-Yating-Apollo` voice.   |
| `zh-tw-zhiwei-apollo`                       | Container image with the `zh-TW` locale and `zh-TW-Zhiwei-Apollo` voice.   |

---

## Neural Text-to-speech

The [Neural Text-to-speech][sp-ntts] container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services/speechservices/` repository and is named `neural-text-to-speech`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/speechservices/neural-text-to-speech`.

This container image has the following tags available. You can also find a full list of [tags on the MCR](https://mcr.microsoft.com/v2/azure-cognitive-services/speechservices/neural-text-to-speech/tags/list).


# [Latest version](#tab/current)

Release notes for `v1.3.0`:
* The Neural Text-to-speech container is now generally available. 

| Image Tags                                  | Notes                                                                      |
|---------------------------------------------|:---------------------------------------------------------------------------|
| `latest`                                    | Container image with the `en-US` locale and `en-US-AriaNeural` voice.      |
| `1.3.0-amd64-<locale-and-voice>`    | Replace `<locale>` with one of the available locales, listed below. For example `1.3.0-amd64-en-us-arianeural`. |


| v1.3.0 Locales and voices           | Notes                                                                      |
|---------------------------------------------|:---------------------------------------------------------------------------|
| `de-de-katjaneural`                 | Container image with the `de-DE` locale and `de-DE-KatjaNeural` voice.     |
| `en-au-natashaneural`               | Container image with the `en-AU` locale and `en-AU-NatashaNeural` voice.   |
| `en-ca-claraneural`                 | Container image with the `en-CA` locale and `en-CA-ClaraNeural` voice.     |
| `en-gb-libbyneural`                 | Container image with the `en-GB` locale and `en-GB-LibbyNeural` voice.     |
| `en-gb-mianeural`                   | Container image with the `en-GB` locale and `en-GB-MiaNeural` voice.       |
| `en-us-arianeural`                  | Container image with the `en-US` locale and `en-US-AriaNeural` voice.      |
| `en-us-guyneural`                   | Container image with the `en-US` locale and `en-US-GuyNeural` voice.       |
| `es-es-elviraneural`                | Container image with the `es-ES` locale and `es-ES-ElviraNeural` voice.    |
| `es-mx-dalianeural`                 | Container image with the `es-MX` locale and `es-MX-DaliaNeural` voice.     |
| `fr-ca-sylvieneural`                | Container image with the `fr-CA` locale and `fr-CA-SylvieNeural` voice.    |
| `fr-fr-deniseneural`                | Container image with the `fr-FR` locale and `fr-FR-DeniseNeural` voice.    |
| `it-it-elsaneural`                  | Container image with the `it-IT` locale and `it-IT-ElsaNeural` voice.      |
| `ja-jp-nanamineural`                | Container image with the `ja-JP` locale and `ja-JP-NanamiNeural` voice.    |
| `ko-kr-sunhineural`                 | Container image with the `ko-KR` locale and `ko-KR-SunHiNeural` voice.     |
| `pt-br-franciscaneural`             | Container image with the `pt-BR` locale and `pt-BR-FranciscaNeural` voice. |
| `zh-cn-xiaoxiaoneural`              | Container image with the `zh-CN` locale and `zh-CN-XiaoxiaoNeural` voice.  |

# [Previous version](#tab/previous)

| Image Tags                                  | Notes                                                                      |
|---------------------------------------------|:---------------------------------------------------------------------------|
| `latest`                                    | Container image with the `en-US` locale and `en-US-AriaNeural` voice.      |
| `1.2.0-amd64-<locale-and-voice>-preview`    | Replace `<locale>` with one of the available locales, listed below. For example `1.2.0-amd64-en-us-arianeural-preview`. |


| v1.2.0 Preview Locales and voices           | Notes                                                                      |
|---------------------------------------------|:---------------------------------------------------------------------------|
| `latest`                                    | Container image with the `en-US` locale and `en-US-AriaNeural` voice.      |
| `de-de-katjaneural-preview`                 | Container image with the `de-DE` locale and `de-DE-KatjaNeural` voice.     |
| `en-au-natashaneural-preview`               | Container image with the `en-AU` locale and `en-AU-NatashaNeural` voice.   |
| `en-ca-claraneural-preview`                 | Container image with the `en-CA` locale and `en-CA-ClaraNeural` voice.     |
| `en-gb-libbyneural-preview`                 | Container image with the `en-GB` locale and `en-GB-LibbyNeural` voice.     |
| `en-gb-mianeural-preview`                   | Container image with the `en-GB` locale and `en-GB-MiaNeural` voice.       |
| `en-us-arianeural-preview`                  | Container image with the `en-US` locale and `en-US-AriaNeural` voice.      |
| `en-us-guyneural-preview`                   | Container image with the `en-US` locale and `en-US-GuyNeural` voice.       |
| `es-es-elviraneural-preview`                | Container image with the `es-ES` locale and `es-ES-ElviraNeural` voice.    |
| `es-mx-dalianeural-preview`                 | Container image with the `es-MX` locale and `es-MX-DaliaNeural` voice.     |
| `fr-ca-sylvieneural-preview`                | Container image with the `fr-CA` locale and `fr-CA-SylvieNeural` voice.    |
| `fr-fr-deniseneural-preview`                | Container image with the `fr-FR` locale and `fr-FR-DeniseNeural` voice.    |
| `it-it-elsaneural-preview`                  | Container image with the `it-IT` locale and `it-IT-ElsaNeural` voice.      |
| `ja-jp-nanamineural-preview`                | Container image with the `ja-JP` locale and `ja-JP-NanamiNeural` voice.    |
| `ko-kr-sunhineural-preview`                 | Container image with the `ko-KR` locale and `ko-KR-SunHiNeural` voice.     |
| `pt-br-franciscaneural-preview`             | Container image with the `pt-BR` locale and `pt-BR-FranciscaNeural` voice. |
| `zh-cn-xiaoxiaoneural-preview`              | Container image with the `zh-CN` locale and `zh-CN-XiaoxiaoNeural` voice.  |

---

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

---

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
