---
title: Migrate from prebuilt standard voice to prebuilt neural voice - Speech service
titleSuffix: Azure Cognitive Services
description: This document helps users migrate from prebuilt standard voice to prebuilt neural voice.
services: cognitive-services
author: sally-baolian
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 11/12/2021
ms.author: v-baolianzou
---

# Migrate from prebuilt standard voice to prebuilt neural voice

> [!IMPORTANT]
> We are retiring the standard voices from September 1, 2021 through August 31, 2024. If you used a standard voice with your Speech resource prior to September 1, 2021 then you can continue to do so until August 31, 2024. All other Speech resources can only use prebuilt neural voices. You can choose from the supported [neural voice names](language-support.md#prebuilt-neural-voices). After August 31, the standard voices won't be supported with any Speech resource.

The prebuilt neural voice provides more natural sounding speech output, and thus, a better end-user experience. 

|Prebuilt standard voice  | Prebuilt neural voice | 
|--|--|
| Noticeably robotic  | Natural sounding, closer to human-parity|
| Limited capabilities in voice tuning<sup>1</sup> |Advanced capabilities in voice tuning   |
| No new investment in future voice fonts  |On-going investment in future voice fonts |

<sup>1</sup> For voice tuning, volume and pitch changes can be applied to standard voices at the word or sentence-level, whereas they can only be applied to neural voices at the sentence level. Duration supports standard voices only. To learn more about details on prosody elements, see [Improve synthesis with SSML](speech-synthesis-markup.md).

## Action required

> [!TIP]
> Even without an Azure account, you can listen to voice samples at this [Azure website](https://azure.microsoft.com/services/cognitive-services/text-to-speech/#overview) and determine the right voice for your business needs.

1. Review the [price](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) structure and listen to the neural voice [samples](https://azure.microsoft.com/services/cognitive-services/text-to-speech/#overview) at the bottom of that page to determine the right voice for your business needs.
2. To make the change, [follow the sample code](speech-synthesis-markup.md#choose-a-voice-for-text-to-speech) to update the voice name in your speech synthesis request to the supported neural voice names in chosen languages. Please use neural voices for your speech synthesis request, on cloud or on prem. For on-prem container, please use the [neural voice containers](../containers/container-image-tags.md) and follow the [instructions](speech-container-howto.md).

## Standard voice details (retired)

Read the following sections for details on standard voice.

### Language support

More than 75 prebuilt standard voices are available in over 45 languages and locales, which allow you to convert text into synthesized speech.

> [!NOTE]
> With two exceptions, standard voices are created from samples that use a 16 khz sample rate.
> **The en-US-AriaRUS** and **en-US-GuyRUS** voices are also created from samples that use a 24 khz sample rate.
> All voices can upsample or downsample to other sample rates when synthesizing.

| Language | Locale (BCP-47) | Gender | Voice name |
|--|--|--|--|
| Arabic (Arabic ) | `ar-EG` | Female | `ar-EG-Hoda`|
| Arabic (Saudi Arabia) | `ar-SA` | Male | `ar-SA-Naayf`|
| Bulgarian (Bulgaria) | `bg-BG` | Male | `bg-BG-Ivan`|
| Catalan (Spain) | `ca-ES` | Female | `ca-ES-HerenaRUS`|
| Chinese (Cantonese, Traditional) | `zh-HK` | Male | `zh-HK-Danny`|
| Chinese (Cantonese, Traditional) | `zh-HK` | Female | `zh-HK-TracyRUS`|
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-HuihuiRUS`|
| Chinese (Mandarin, Simplified) | `zh-CN` | Male | `zh-CN-Kangkang`|
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-Yaoyao`|
| Chinese (Taiwanese Mandarin) |  `zh-TW` | Female | `zh-TW-HanHanRUS`|
| Chinese (Taiwanese Mandarin) |  `zh-TW` | Female | `zh-TW-Yating`|
| Chinese (Taiwanese Mandarin) |  `zh-TW` | Male | `zh-TW-Zhiwei`|
| Croatian (Croatia) | `hr-HR` | Male | `hr-HR-Matej`|
| Czech (Czech Republic) | `cs-CZ` | Male | `cs-CZ-Jakub`|
| Danish (Denmark) | `da-DK` | Female | `da-DK-HelleRUS`|
| Dutch (Netherlands) | `nl-NL` | Female | `nl-NL-HannaRUS`|
| English (Australia) | `en-AU` | Female | `en-AU-Catherine`|
| English (Australia) | `en-AU` | Female | `en-AU-HayleyRUS`|
| English (Canada) | `en-CA` | Female | `en-CA-HeatherRUS`|
| English (Canada) | `en-CA` | Female | `en-CA-Linda`|
| English (India) | `en-IN` | Female | `en-IN-Heera`|
| English (India) | `en-IN` | Female | `en-IN-PriyaRUS`|
| English (India) | `en-IN` | Male | `en-IN-Ravi`|
| English (Ireland) | `en-IE` | Male | `en-IE-Sean`|
| English (United Kingdom) | `en-GB` | Male | `en-GB-George`|
| English (United Kingdom) | `en-GB` | Female | `en-GB-HazelRUS`|
| English (United Kingdom) | `en-GB` | Female | `en-GB-Susan`|
| English (United States) | `en-US` | Male | `en-US-BenjaminRUS`|
| English (United States) | `en-US` | Male | `en-US-GuyRUS`|
| English (United States) | `en-US` | Female | `en-US-AriaRUS`|
| English (United States) | `en-US` | Female | `en-US-ZiraRUS`|
| Finnish (Finland) | `fi-FI` | Female | `fi-FI-HeidiRUS`|
| French (Canada) | `fr-CA` | Female | `fr-CA-Caroline`|
| French (Canada) | `fr-CA` | Female | `fr-CA-HarmonieRUS`|
| French (France) | `fr-FR` | Female | `fr-FR-HortenseRUS`|
| French (France) | `fr-FR` | Female | `fr-FR-Julie`|
| French (France) | `fr-FR` | Male | `fr-FR-Paul`|
| French (Switzerland) | `fr-CH` | Male | `fr-CH-Guillaume`|
| German (Austria) | `de-AT` | Male | `de-AT-Michael`|
| German (Germany) | `de-DE` | Female | `de-DE-HeddaRUS`|
| German (Germany) | `de-DE` | Male | `de-DE-Stefan`|
| German (Switzerland) | `de-CH` | Male | `de-CH-Karsten`|
| Greek (Greece) | `el-GR` | Male | `el-GR-Stefanos`|
| Hebrew (Israel) | `he-IL` | Male | `he-IL-Asaf`|
| Hindi (India) | `hi-IN` | Male | `hi-IN-Hemant`|
| Hindi (India) | `hi-IN` | Female | `hi-IN-Kalpana`|
| Hungarian (Hungary) | `hu-HU` | Male | `hu-HU-Szabolcs`|
| Indonesian (Indonesia) | `id-ID` | Male | `id-ID-Andika`|
| Italian (Italy) | `it-IT` | Male | `it-IT-Cosimo`|
| Italian (Italy) | `it-IT` | Female | `it-IT-LuciaRUS`|
| Japanese (Japan) | `ja-JP` | Female | `ja-JP-Ayumi`|
| Japanese (Japan) | `ja-JP` | Female | `ja-JP-HarukaRUS`|
| Japanese (Japan) | `ja-JP` | Male | `ja-JP-Ichiro`|
| Korean (Korea) | `ko-KR` | Female | `ko-KR-HeamiRUS`|
| Malay (Malaysia) | `ms-MY` | Male | `ms-MY-Rizwan`|
| Norwegian (Bokmål, Norway) | `nb-NO` | Female | `nb-NO-HuldaRUS`|
| Polish (Poland) | `pl-PL` | Female | `pl-PL-PaulinaRUS`|
| Portuguese (Brazil) | `pt-BR` | Male | `pt-BR-Daniel`|
| Portuguese (Brazil) | `pt-BR` | Female | `pt-BR-HeloisaRUS`|
| Portuguese (Portugal) | `pt-PT` | Female | `pt-PT-HeliaRUS`|
| Romanian (Romania) | `ro-RO` | Male | `ro-RO-Andrei`|
| Russian (Russia) | `ru-RU` | Female | `ru-RU-EkaterinaRUS`|
| Russian (Russia) | `ru-RU` | Female | `ru-RU-Irina`|
| Russian (Russia) | `ru-RU` | Male | `ru-RU-Pavel`|
| Slovak (Slovakia) | `sk-SK` | Male | `sk-SK-Filip`|
| Slovenian (Slovenia) | `sl-SI` | Male | `sl-SI-Lado`|
| Spanish (Mexico) | `es-MX` | Female | `es-MX-HildaRUS`|
| Spanish (Mexico) | `es-MX` | Male | `es-MX-Raul`|
| Spanish (Spain) | `es-ES` | Female | `es-ES-HelenaRUS`|
| Spanish (Spain) | `es-ES` | Female | `es-ES-Laura`|
| Spanish (Spain) | `es-ES` | Male | `es-ES-Pablo`|
| Swedish (Sweden) | `sv-SE` | Female | `sv-SE-HedvigRUS`|
| Tamil (India) | `ta-IN` | Male | `ta-IN-Valluvar`|
| Telugu (India) | `te-IN` | Female | `te-IN-Chitra`|
| Thai (Thailand) | `th-TH` | Male | `th-TH-Pattara`|
| Turkish (Turkey) | `tr-TR` | Female | `tr-TR-SedaRUS`|
| Vietnamese (Vietnam) | `vi-VN` | Male | `vi-VN-An` |

> [!IMPORTANT]
> The `en-US-Jessa` voice has changed to `en-US-Aria`. If you were using "Jessa" before, convert over to "Aria".
> 
> You can continue to use the full service name mapping like "Microsoft Server Speech Text to Speech Voice (en-US, AriaRUS)" in your speech synthesis requests.

### Regional support 

Use this table to determine **availability of standard voices** by region/endpoint:

| Region | Endpoint |
|--------|----------|
| Australia East | `https://australiaeast.tts.speech.microsoft.com/cognitiveservices/v1` |
| Brazil South | `https://brazilsouth.tts.speech.microsoft.com/cognitiveservices/v1` |
| Canada Central | `https://canadacentral.tts.speech.microsoft.com/cognitiveservices/v1` |
| Central US | `https://centralus.tts.speech.microsoft.com/cognitiveservices/v1` |
| East Asia | `https://eastasia.tts.speech.microsoft.com/cognitiveservices/v1` |
| East US | `https://eastus.tts.speech.microsoft.com/cognitiveservices/v1` |
| East US 2 | `https://eastus2.tts.speech.microsoft.com/cognitiveservices/v1` |
| France Central | `https://francecentral.tts.speech.microsoft.com/cognitiveservices/v1` |
| India Central | `https://centralindia.tts.speech.microsoft.com/cognitiveservices/v1` |
| Japan East | `https://japaneast.tts.speech.microsoft.com/cognitiveservices/v1` |
| Japan West | `https://japanwest.tts.speech.microsoft.com/cognitiveservices/v1` |
| Korea Central | `https://koreacentral.tts.speech.microsoft.com/cognitiveservices/v1` |
| North Central US | `https://northcentralus.tts.speech.microsoft.com/cognitiveservices/v1` |
| North Europe | `https://northeurope.tts.speech.microsoft.com/cognitiveservices/v1` |
| South Central US | `https://southcentralus.tts.speech.microsoft.com/cognitiveservices/v1` |
| Southeast Asia | `https://southeastasia.tts.speech.microsoft.com/cognitiveservices/v1` |
| UK South | `https://uksouth.tts.speech.microsoft.com/cognitiveservices/v1` |
| West Central US | `https://westcentralus.tts.speech.microsoft.com/cognitiveservices/v1` |
| West Europe | `https://westeurope.tts.speech.microsoft.com/cognitiveservices/v1` |
| West US | `https://westus.tts.speech.microsoft.com/cognitiveservices/v1` |
| West US 2 | `https://westus2.tts.speech.microsoft.com/cognitiveservices/v1` |

## Standard Text-to-Speech container (retired)

Read the following sections for details on standard Text-to-Speech container.

> [!IMPORTANT]
> We retired the standard speech synthesis voices and Text-to-Speech container on August 31st 2021. Consider migrating your applications to use the neural Text-to-Speech container instead. [Follow these steps](./how-to-migrate-to-prebuilt-neural-voice.md) for more information on updating your application.

 ### Install and run standard Text-to-Speech container

The following table lists the standard container.

| Container | Features | Latest | Release status |
|--|--|--|--|
| Text-to-speech | Converts text to natural-sounding speech with plain text input or Speech Synthesis Markup Language (SSML). | 1.15.0 | Generally Available |

You must meet the [prerequisites](speech-container-howto.md#prerequisites) before using the standard container. For the required parameters and host computer requirements, you need to read [Gather required parameters](speech-container-howto.md#gather-required-parameters) and [Host computer requirements](speech-container-howto.md#host-computer-requirements-and-recommendations).

The following table describes the minimum and recommended allocation of resources for Text-to-Speech container.

| Container | Minimum | Recommended |
|-----------|---------|-------------|
| Text-to-speech | 1 core, 2-GB memory | 2 core, 3-GB memory |

* The core must be at least 2.6 gigahertz (GHz) or faster.
* Core and memory correspond to the `--cpus` and `--memory` settings, which are used as part of the `docker run` command.

#### Request approval to run the container

Fill out and submit the [request form](https://aka.ms/csgate) to request access to the container.

[!INCLUDE [Request access to public preview](../../../includes/cognitive-services-containers-request-access.md)]

#### Get the container image with `docker pull`

Container image for Text-to-Speech is available in the following Container Registry.

| Container | Repository |
|-----------|------------|
| Text-to-speech | `mcr.microsoft.com/azure-cognitive-services/speechservices/text-to-speech:latest` |

#### Docker pull for the Text-to-speech container

Use the [docker pull](https://docs.docker.com/engine/reference/commandline/pull/) command to download a container image from Microsoft Container registry.

```Docker
docker pull mcr.microsoft.com/azure-cognitive-services/speechservices/text-to-speech:latest
```

> [!IMPORTANT]
> The `latest` tag pulls the `en-US` locale and `ariarus` voice. For additional locales see [Text-to-speech locales](#text-to-speech-locales).

#### Text-to-speech locales

All tags, except for `latest` are in the following format and are case-sensitive:

```
<major>.<minor>.<patch>-<platform>-<locale>-<voice>-<prerelease>
```

The following tag is an example of the format:

```
1.8.0-amd64-en-us-ariarus
```

For all of the supported locales and corresponding voices of the Text-to-Speech container, see [Text-to-speech image tags](../containers/container-image-tags.md#text-to-speech).

> [!IMPORTANT]
> When constructing a *Text-to-speech* HTTP POST, the [Speech Synthesis Markup Language (SSML)](speech-synthesis-markup.md) message requires a `voice` element with a `name` attribute. The value is the corresponding container locale and voice, also known as the ["short name"](how-to-migrate-to-prebuilt-neural-voice.md). For example, the `latest` tag would have a voice name of `en-US-AriaRUS`.

#### Use the container

After the container is on the host computer, use the following process to work with the container.

1. Run the container with the required billing settings. More examples of the `docker run` command are available.
1. Query the container's prediction endpoint.

#### Run the Text-to-Speech container with `docker run`

Use the [docker run](https://docs.docker.com/engine/reference/commandline/run/) command to run the container. For details on how to get the `{Endpoint_URI}` and `{API_Key}` values, refer to [gathering required parameters](speech-container-howto.md#gather-required-parameters). More [examples](speech-container-configuration.md#example-docker-run-commands) of the `docker run` command are also available.

To run the standard text-to-speech container, execute the following `docker run` command.

```bash
docker run --rm -it -p 5000:5000 --memory 2g --cpus 1 \
mcr.microsoft.com/azure-cognitive-services/speechservices/text-to-speech \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

This command:

* Runs a Standard *Text-to-speech* container from the container image.
* Allocates 1 CPU core and 2 gigabytes (GB) of memory.
* Exposes TCP port 5000 and allocates a pseudo-TTY for the container.
* Automatically removes the container after it exits. The container image is still available on the host computer.

> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container. Otherwise, the container won't start. For more information, see [Billing](speech-container-howto.md#billing).

#### Query the Text-to-Speech container's prediction endpoint

> [!NOTE]
> Use a unique port number if you're running multiple containers.

| Containers | SDK Host URL | Protocol |
|--|--|--|
| Text-to-Speech (including standard and neural) | `http://localhost:5000` | HTTP |

The container provides [REST-based endpoint APIs](rest-text-to-speech.md). Many [sample source code projects](https://github.com/Azure-Samples/Cognitive-Speech-TTS) for platform, framework, and language variations are available. For more details, see [the instructions](speech-container-howto.md#query-the-containers-prediction-endpoint).

To learn more concepts and workflow for downloading, installing, and running the Speech container,  refer to [Install and run Docker containers for the Speech service APIs](speech-container-howto.md).

### Standard Text-to-Speech container image tags 

Azure Cognitive Services offers many container images. The container registries and corresponding repositories vary between container images. Each container image name offers multiple tags. A container image tag is a mechanism of versioning the container image. This section is intended to be used as a comprehensive reference for listing all the Standard Text-to-Speech container images and their available tags.

The Text-to-speech container image can be found on the `mcr.microsoft.com` container registry syndicate. It resides within the `azure-cognitive-services/speechservices/` repository and is named `text-to-speech`. The fully qualified container image name is, `mcr.microsoft.com/azure-cognitive-services/speechservices/text-to-speech`.

This container image has the following tags available. You can also find a full list of [tags on the MCR](https://mcr.microsoft.com/v2/azure-cognitive-services/speechservices/text-to-speech/tags/list).


# [Latest version](#tab/current)

Release note for `1.15.0-amd64-<locale-and-voice>`:

**Feature**
* Upgrade to latest models.

| Locales for v1.15.0                         | Notes                                                                      | Digest                         |
|---------------------------------------------|:---------------------------------------------------------------------------|:-------------------------------|
| `ar-eg-hoda`                                | Container image with the `ar-EG` locale and `ar-EG-Hoda` voice.            | `sha256:61a154451bfef9766235f85fc7ca3698151244b04bf32cfc5a47a04b9c08f8e4` |
| `ar-sa-naayf`                               | Container image with the `ar-SA` locale and `ar-SA-Naayf` voice.           | `sha256:13cf045d959ce9362adfad114d8997e628f5e0d08e6e86a86e733967372e5e2d` |
| `bg-bg-ivan`                                | Container image with the `bg-BG` locale and `bg-BG-Ivan` voice.            | `sha256:19f8c32f6723470c14c4b1731ff256853ee5c441a95a89faff767c2c4e4447a9` |
| `ca-es-herenarus`                           | Container image with the `ca-ES` locale and `ca-ES-HerenaRUS` voice.       | `sha256:16835388036906af8b35238f05b7f17308b8fae92bf4c89199dcc0b35bb289d6` |
| `cs-cz-jakub`                               | Container image with the `cs-CZ` locale and `cs-CZ-Jakub` voice.           | `sha256:06af13ede8234c14f8a48b956017cd7858a1c0d984042a9a60309ae9f8f6a25b` |
| `da-dk-hellerus`                            | Container image with the `da-DK` locale and `da-DK-HelleRUS` voice.        | `sha256:1c6375ee05948ec9a9b2554e2423e2c2d68e7595f58d401bd2f9fc25bd512bde` |
| `de-at-michael`                             | Container image with the `de-AT` locale and `de-AT-Michael` voice.         | `sha256:27e88c817ab91b2a4dbb5df1f88828708445993c1d657d974b6253f1820e280f` |
| `de-ch-karsten`                             | Container image with the `de-CH` locale and `de-CH-Karsten` voice.         | `sha256:6b8ce6192783c1b158410a43a8fd9517cfe63c8b4a3cd0f1118acd891e7ebea5` |
| `de-de-heddarus`                            | Container image with the `de-DE` locale and `de-DE-Hedda` voice.           | `sha256:28e1a6f0860165a4f3750b059334117240e0613ddf44d1e3c41615093bd3e226` |
| `de-de-hedda`                               | Container image with the `de-DE` locale and `de-DE-Hedda` voice.           | `sha256:28e1a6f0860165a4f3750b059334117240e0613ddf44d1e3c41615093bd3e226` |
| `de-de-stefan-apollo`                       | Container image with the `de-DE` locale and `de-DE-Stefan-Apollo` voice.   | `sha256:3730dfefb60f3a74df523e790738595b29e3dc694a16506a6deccffec264aa2a` |
| `el-gr-stefanos`                            | Container image with the `el-GR` locale and `el-GR-Stefanos` voice.        | `sha256:dfce427d7c08bd26d38513fd4b5c85662fe4feeddefa75e1245c37bb5b245b45` |
| `en-au-catherine`                           | Container image with the `en-AU` locale and `en-AU-Catherine` voice.       | `sha256:71a9a64adc48044e2ce81119bc118056a906db284311fc3761b3cdfe21c6ad18` |
| `en-au-hayleyrus`                           | Container image with the `en-AU` locale and `en-AU-HayleyRUS` voice.       | `sha256:a42624ebf51afff052a0ed8518f474855d70b4a9245cd8e81492b449e6b765d1` |
| `en-ca-heatherrus`                          | Container image with the `en-CA` locale and `en-CA-HeatherRUS` voice.      | `sha256:b5f745bbf9de83f57ac4e6e2760049e10a8eaae362018c4d5a4ace02a50710dc` |
| `en-ca-linda`                               | Container image with the `en-CA` locale and `en-CA-Linda` voice.           | `sha256:6638a92b495c76ca16331c652b123fa52163242cfbd8f8298c9118a0f1261719` |
| `en-gb-george-apollo`                       | Container image with the `en-GB` locale and `en-GB-George-Apollo` voice.   | `sha256:748c7042dfa3107f387c34ee29269fc2bd96f27af525f2dc7b50275dae106bd1` |
| `en-gb-hazelrus`                            | Container image with the `en-GB` locale and `en-GB-HazelRUS` voice.        | `sha256:8a439470579f95645bf5831ee5f0643b872d6bdbd7426cf57264bb5a13c12624` |
| `en-gb-susan-apollo`                        | Container image with the `en-GB` locale and `en-GB-Susan-Apollo` voice.    | `sha256:ad9c5741a2b19fc936ec740fa0bbd2700e09e361d7ce9df0bb5fb204f6c31ec5` |
| `en-ie-sean`                                | Container image with the `en-IE` locale and `en-IE-Sean` voice.            | `sha256:45d1d07f67c81b11f7b239f0e46bd229694d0e795b01e72e583b2aecf671af3e` |
| `en-in-heera-apollo`                        | Container image with the `en-IN` locale and `en-IN-Heera-Apollo` voice.    | `sha256:f4cd71fac26b0d1f0693ce91535a0fd14ac90e323c6f9d8239f3eb7a196ff454` |
| `en-in-priyarus`                            | Container image with the `en-IN` locale and `en-IN-PriyaRUS` voice.        | `sha256:5a228190a5fe62aaa5f8443ab4041d2a7af381e30236333a44c364e990eeaba4` |
| `en-in-ravi-apollo`                         | Container image with the `en-IN` locale and `en-IN-Ravi-Apollo` voice.     | `sha256:3f477ad93ff643f90adf268775c9b8cd8fb3b2cadf347b3663317184c4e462c6` |
| `en-us-aria24krus`                          | Container image with the `en-US` locale and `en-US-Aria24kRUS` voice.      | `sha256:d4ece3a336171cd46068831b3203460c86e5cd7f053b56a8a7017a0547580030` |
| `en-us-ariarus`                             | Container image with the `en-US` locale and `en-US-AriaRUS` voice.         | `sha256:d4ece3a336171cd46068831b3203460c86e5cd7f053b56a8a7017a0547580030` |
| `en-us-benjaminrus`                         | Container image with the `en-US` locale and `en-US-BenjaminRUS` voice.     | `sha256:f668eb749ee51c01bcadf0df8e1a0b6fc000fb64a93bd12458bcff4e817bd4cf` |
| `en-us-guy24krus`                           | Container image with the `en-US` locale and `en-US-Guy24kRUS` voice.       | `sha256:50900ece25a078bc4e0a0fec845cc9516e975a7b90621e4fdea135c16b593752` |
| `en-us-zirarus`                             | Container image with the `en-US` locale and `en-US-ZiraRUS` voice.         | `sha256:772bdc81780a05f7400a88b1cddcef6ef0be153ce873df23918986f72920aa41` |
| `es-es-helenarus`                           | Container image with the `es-ES` locale and `es-ES-HelenaRUS` voice.       | `sha256:ab25fc60c8a8e095fcf63fe953bd2acf1f0569e6aafb02e90da916f7ef1905ce` |
| `es-es-laura-apollo`                        | Container image with the `es-ES` locale and `es-ES-Laura-Apollo` voice.    | `sha256:11c144693d62b28e1444378638295e801c07888fd6ff70903bdbb775a8cd4c7a` |
| `es-es-pablo-apollo`                        | Container image with the `es-ES` locale and `es-ES-Pablo-Apollo` voice.    | `sha256:56db18adc44ee4412fd64f2d9303960525627ecf9b6cd6c201d5260af5340378` |
| `es-mx-hildarus`                            | Container image with the `es-MX` locale and `es-MX-HildaRUS` voice.        | `sha256:80ad68c2ca58380ca3d88e509ad32a21f70ecc41fab701f629e2de509162bf61` |
| `es-mx-raul-apollo`                         | Container image with the `es-MX` locale and `es-MX-Raul-Apollo` voice.     | `sha256:fd51cdcc46ac5c81949d7ff3ceeacf7144fb6e516089fff645b64b9159269488` |
| `fi-fi-heidirus`                            | Container image with the `fi-FI` locale and `fi-FI-HeidiRUS` voice.        | `sha256:0ba17a99d35d4963110316d6bb7742082d0362f23490790bb8a8142f459ed143` |
| `fr-ca-caroline`                            | Container image with the `fr-CA` locale and `fr-CA-Caroline` voice.        | `sha256:67304f764165b34c051104d8ef51202dcbaafcf3b88d5568ac41b54ecf820563` |
| `fr-ca-harmonierus`                         | Container image with the `fr-CA` locale and `fr-CA-HarmonieRUS` voice.     | `sha256:9b428ec672b60e8e6f9642cc5f23741e84df5e68477bb5fd4fdee4222e401d47` |
| `fr-ch-guillaume`                           | Container image with the `fr-CH` locale and `fr-CH-Guillaume` voice.       | `sha256:d3fedebf0321f9135335be369fec84be42a3653977f0834c6b5fda3fefeab81e` |
| `fr-fr-hortenserus`                         | Container image with the `fr-FR` locale and `fr-FR-HortenseRUS` voice.     | `sha256:2d33762773d299ffd37a3103b3c32ce8d1b7f3f107daf6514be4006cfbc8fd47` |
| `fr-fr-julie-apollo`                        | Container image with the `fr-FR` locale and `fr-FR-Julie-Apollo` voice.    | `sha256:54f762a2d68cc8a33049b18085fac44f5bad1750a1d85347d5174550fe2c2798` |
| `fr-fr-paul-apollo`                         | Container image with the `fr-FR` locale and `fr-FR-Paul-Apollo` voice.     | `sha256:7d3e4a75495be2c503f55596d39a5bdfe75538b453a5fb7edb7d17e0c036f3f0` |
| `he-il-asaf`                                | Container image with the `he-IL` locale and `he-IL-Asaf` voice.            | `sha256:729bd1c6128ee059e89d04e2e2fd5cd925e59550014b901bf5ac0b7cd44e9fa4` |
| `hi-in-hemant`                              | Container image with the `hi-IN` locale and `hi-IN-Hemant` voice.          | `sha256:9ed035183c7c2a0debe44dc6bae67d097334b0be8f5bec643b7e320c534b7cb2` |
| `hi-in-kalpana-apollo`                      | Container image with the `hi-IN` locale and `hi-IN-Kalpana-Apollo` voice.  | `sha256:f043d625788fd61bba7454a64502572a2e4fed310775c371c71db3c0fcf6aa01` |
| `hi-in-kalpana`                             | Container image with the `hi-IN` locale and `hi-IN-Kalpana` voice.         | `sha256:f043d625788fd61bba7454a64502572a2e4fed310775c371c71db3c0fcf6aa01` |
| `hr-hr-matej`                               | Container image with the `hr-HR` locale and `hr-HR-Matej` voice.           | `sha256:a320245b93af76b125386f4566383ec6e13a21c951a8468d1f0f87e800b79bb6` |
| `hu-hu-szabolcs`                            | Container image with the `hu-HU` locale and `hu-HU-Szabolcs` voice.        | `sha256:94d86ae188bb08df0192de4221404132d631cae6aa6d4fc4bfc0ffcce8f68d89` |
| `id-id-andika`                              | Container image with the `id-ID` locale and `id-ID-Andika` voice.          | `sha256:8fee6f6d8552fae0ce050765ea5c842497a699f5feb700f705c506dab3bac4a6` |
| `it-it-cosimo-apollo`                       | Container image with the `it-IT` locale and `it-IT-Cosimo-Apollo` voice.   | `sha256:1d99f0f538e0d61b527fbc77f9281e0f932bac7e6ba513b13ecfc734bd95f44d` |
| `it-it-luciarus`                            | Container image with the `it-IT` locale and `it-IT-LuciaRUS` voice.        | `sha256:99db33a668e298c58be1c50b9d4b84aeb0949f0334187b02167cfa3044997993` |
| `ja-jp-ayumi-apollo`                        | Container image with the `ja-JP` locale and `ja-JP-Ayumi-Apollo` voice.    | `sha256:50d1e986d318692917968654008466fc3cca4911c3bcd36af67f37e91de18fe2` |
| `ja-jp-harukarus`                           | Container image with the `ja-JP` locale and `ja-JP-HarukaRUS` voice.       | `sha256:7736a87dcf3595056bb558c6cb38094d1732bb164406a99d87c0ac09c8eee271` |
| `ja-jp-ichiro-apollo`                       | Container image with the `ja-JP` locale and `ja-JP-Ichiro-Apollo` voice.   | `sha256:6ce704a51150e0ee092f2197ba7cf4bcbf8473e5cd56a9a0839ad81d87b2dfe2` |
| `ko-kr-heamirus`                            | Container image with the `ko-KR` locale and `ko-KR-HeamiRUS` voice.        | `sha256:ec5d75470dbae50cb5bc2f93ed642e40446b099cb2302499b3a83b3a27358bd0` |
| `ms-my-rizwan`                              | Container image with the `ms-MY` locale and `ms-MY-Rizwan` voice.          | `sha256:e572b62f0b4153382318266dcd59d6e92daf8acc6f323e461d517d34f9be45dd` |
| `nb-no-huldarus`                            | Container image with the `nb-NO` locale and `nb-NO-HuldaRUS` voice.        | `sha256:691ef2ead95a0d4703cd6064bac9355e86a361fcffe5ad36a78e9f1e1c78739c` |
| `nl-nl-hannarus`                            | Container image with the `nl-NL` locale and `nl-NL-HannaRUS` voice.        | `sha256:f52a717d4d8b7db39b18c9a9e448e2e6d6e19600093518002a6fc03f0b2a57c9` |
| `pl-pl-paulinarus`                          | Container image with the `pl-PL` locale and `pl-PL-PaulinaRUS` voice.      | `sha256:1927ff28b40b7c37ee1b8d5f4efb2fd7d905affd35c27983940c7e5795763c70` |
| `pt-br-daniel-apollo`                       | Container image with the `pt-BR` locale and `pt-BR-Daniel-Apollo` voice.   | `sha256:ebce3b7b51fb28fce4c446fbbf3607f4307b1cec3f9fa7abdd046839a259e91d` |
| `pt-br-heloisarus`                          | Container image with the `pt-BR` locale and `pt-BR-HeloisaRUS` voice.      | `sha256:195e719735768fdf6ea2f1fc829a40cae5af4d35b62e52d1c798e680f915dd12` |
| `pt-pt-heliarus`                            | Container image with the `pt-PT` locale and `pt-PT-HeliaRUS` voice.        | `sha256:f0ea6ec57615a55b13f491e6f96b3cc0e29092f63a981fd29771bcfa2b26c0e1` |
| `ro-ro-andrei`                              | Container image with the `ro-RO` locale and `ro-RO-Andrei` voice.          | `sha256:deee319f2b6d8145f3ed567cfcdfa2ca718cd1b408f8d9fbf15f90d02d5b6b35` |
| `ru-ru-ekaterinarus`                        | Container image with the `ru-RU` locale and `ru-RU-EkaterinaRUS` voice.    | `sha256:d0005c1363e197c0f85180a07d650655b473117de12170a631f3049d99f86581` |
| `ru-ru-irina-apollo`                        | Container image with the `ru-RU` locale and `ru-RU-Irina-Apollo` voice.    | `sha256:53731218ed6e2bed2227c25a2a2e1d528a19dbc078e2af55aa959d191df50487` |
| `ru-ru-pavel-apollo`                        | Container image with the `ru-RU` locale and `ru-RU-Pavel-Apollo` voice.    | `sha256:81b2a56f72460a780466337136729b011ef1eac4689b1ec9edbbd980b53ba6c3` |
| `sk-sk-filip`                               | Container image with the `sk-SK` locale and `sk-SK-Filip` voice.           | `sha256:e3d44c7ac30b1b9b186eaf1761ccadd89b17fcb4d4f63e1dab246a80093967f3` |
| `sl-si-lado`                                | Container image with the `sl-SI` locale and `sl-SI-Lado` voice.            | `sha256:8ecb2b3d0c60f4c88522090d24e55d84a6132b751d71b41a3d1ebbae78fc3b2b` |
| `sv-se-hedvigrus`                           | Container image with the `sv-SE` locale and `sv-SE-HedvigRUS` voice.       | `sha256:5b61e4ebe696e7cee23403ec4aed299cbf4874c0eeb5a163a82ba0ba752b78a8` |
| `ta-in-valluvar`                            | Container image with the `ta-IN` locale and `ta-IN-Valluvar` voice.        | `sha256:adf3c421feb6385ba3acb241750d909a42f41d09b5ebbc66dbb50dac84ef5638` |
| `te-in-chitra`                              | Container image with the `te-IN` locale and `te-IN-Chitra` voice.          | `sha256:e9fc71faf37ca890a82e29bec29b6cfd94299e2d78aaed8c98bc09add2522e2d` |
| `th-th-pattara`                             | Container image with the `th-TH` locale and `th-TH-Pattara` voice.         | `sha256:b02cc2b23a7d1ec2f3f2d3917a51316fb009597d5d9606b5f129968c35c365f6` |
| `tr-tr-sedarus`                             | Container image with the `tr-TR` locale and `tr-TR-SedaRUS` voice.         | `sha256:961773f7f544cc0643590f4ed44d40f12e3fa23e44834afd199e261651b702ae` |
| `vi-vn-an`                                  | Container image with the `vi-VN` locale and `vi-VN-An` voice.              | `sha256:f1fdda1c758a4361d2fb594f02d47be7cf88571e5a51fb845b1b00bf0b89d20e` |
| `zh-cn-huihuirus`                           | Container image with the `zh-CN` locale and `zh-CN-HuihuiRUS` voice.       | `sha256:183125591097ab157bf57088fae3a8ab0af4472cabd3d1c7bdaba51748e73342` |
| `zh-cn-kangkang-apollo`                     | Container image with the `zh-CN` locale and `zh-CN-Kangkang-Apollo` voice. | `sha256:72a77502eb91ebf407bfbfb068b442e1c281da33814e042b026973af2d8d42e0` |
| `zh-cn-yaoyao-apollo`                       | Container image with the `zh-CN` locale and `zh-CN-Yaoyao-Apollo` voice.   | `sha256:9a202b3172def1a35553d7adf5298af71b44dde10ee261752b057b3dcc39ddea` |
| `zh-hk-danny-apollo`                        | Container image with the `zh-HK` locale and `zh-HK-Danny-Apollo` voice.    | `sha256:9bbba04f272231084b9c87d668e5a71ab7f61d464eeaab50d44a3f2121874524` |
| `zh-hk-tracy-apollo`                        | Container image with the `zh-HK` locale and `zh-HK-Tracy-Apollo` voice.    | `sha256:048d335ea90493fde6ccce8715925e472fddb405c3208bba5ac751bfdf85b254` |
| `zh-hk-tracyrus`                            | Container image with the `zh-HK` locale and `zh-HK-TracyRUS` voice.        | `sha256:048d335ea90493fde6ccce8715925e472fddb405c3208bba5ac751bfdf85b254` |
| `zh-tw-hanhanrus`                           | Container image with the `zh-TW` locale and `zh-TW-HanHanRUS` voice.       | `sha256:fe30bb665c416d0a6cc3547425e1736802d7527eebdd919ee4ed66989ebc368b` |
| `zh-tw-yating-apollo`                       | Container image with the `zh-TW` locale and `zh-TW-Yating-Apollo` voice.   | `sha256:6308d4e4302d02bbb4043ec6cceb6e574b7e156a5d774bef095be6c34af7194c` |
| `zh-tw-zhiwei-apollo`                       | Container image with the `zh-TW` locale and `zh-TW-Zhiwei-Apollo` voice.   | `sha256:e40dda8b5e9313a5962c260c1e9eb410b19e60fa74062ad0691455dc8442a4d9` |


# [Previous version](#tab/previous)

Release note for `1.14.1-amd64-<locale-and-voice>`:

**Feature**
* Upgrade to latest models.

Release note for `1.13.0-amd64-<locale-and-voice>`:

**Feature**
* Upgrade to latest models.

Release note for `1.12.0-amd64-<locale-and-voice>`:

**Feature**
* Upgrade to latest models.

Release note for `1.11.0-amd64-<locale-and-voice>`:

**Feature**
* More error details for issues when fetching custom models by ID.

Release note for `1.9.0-amd64-<locale-and-voice>`:

* Regular monthly release

Release note for `1.8.0-amd64-<locale-and-voice>`:

**Feature**

* Fully migrated to .NET 3.1

Release note for `1.7.0-amd64-<locale-and-voice>`:

**Feature**

* Upgraded components to .NET 3.1

| Image Tags                                  | Notes                                                                                                         |
|---------------------------------------------|:--------------------------------------------------------------------------------------------------------------|
| `1.13.0-amd64-<locale-and-voice>`           | Replace `<locale>` with one of the available locales, listed below. For example `1.13.0-amd64-en-us-ariarus`. |
| `1.12.0-amd64-<locale-and-voice>`           | Replace `<locale>` with one of the available locales, listed below. For example `1.12.0-amd64-en-us-ariarus`. |
| `1.11.0-amd64-<locale-and-voice>`           | Replace `<locale>` with one of the available locales, listed below. For example `1.11.0-amd64-en-us-ariarus`. |
| `1.9.0-amd64-<locale-and-voice>`            | Replace `<locale>` with one of the available locales, listed below. For example `1.9.0-amd64-en-us-ariarus`.  |
| `1.8.0-amd64-<locale-and-voice>`            | Replace `<locale>` with one of the available locales, listed below. For example `1.8.0-amd64-en-us-ariarus`.  |
| `1.7.0-amd64-<locale-and-voice>`            | 1st GA version. Replace `<locale>` with one of the available locales, listed below. For example `1.7.0-amd64-en-us-ariarus`.  |

| Locales for v1.13.0                         | Notes                                                                      | Digest                         |
|---------------------------------------------|:---------------------------------------------------------------------------|:-------------------------------|
| `ar-eg-hoda`                                | Container image with the `ar-EG` locale and `ar-EG-Hoda` voice.            | `sha256:8ff6360ba584d81b987582ce1c2cb6bb624cf68e4d71544805b9afc0401542dd` |
| `ar-sa-naayf`                               | Container image with the `ar-SA` locale and `ar-SA-Naayf` voice.           | `sha256:da5037de95c00362cb1871374735778c3eb68640ae4cb6a260659e7e0a67c37e` |
| `bg-bg-ivan`                                | Container image with the `bg-BG` locale and `bg-BG-Ivan` voice.            | `sha256:871140e57c126ac79c92c69572b86587150d1f14447c91152de3d4b10b3ef9f6` |
| `ca-es-herenarus`                           | Container image with the `ca-ES` locale and `ca-ES-HerenaRUS` voice.       | `sha256:7291ca9c579b1967cca941ce11321daa06ed6a9a1f0922d425d39f70a4aa8acd` |
| `cs-cz-jakub`                               | Container image with the `cs-CZ` locale and `cs-CZ-Jakub` voice.           | `sha256:c8f34c3a7fc5af5141da5439b520614e039d133b6180e8157f12ec7279e9163a` |
| `da-dk-hellerus`                            | Container image with the `da-DK` locale and `da-DK-HelleRUS` voice.        | `sha256:694eb294595700266355f8d57530ec3cccd4e04aa74dd630b96558bf2b481e71` |
| `de-at-michael`                             | Container image with the `de-AT` locale and `de-AT-Michael` voice.         | `sha256:f875435d8fadb56df2123d5aa1ceca34990d00f4c75678eb2526b83058972717` |
| `de-ch-karsten`                             | Container image with the `de-CH` locale and `de-CH-Karsten` voice.         | `sha256:c58359bd6e6676e23dda181a86caee1771366b0329a44fae0f363bbd381058ad` |
| `de-de-heddarus`                            | Container image with the `de-DE` locale and `de-DE-Hedda` voice.           | `sha256:c8e615d40c6e96216b90e329bf7185060de646db1e92fd1fdcd344a52bd86b55` |
| `de-de-hedda`                               | Container image with the `de-DE` locale and `de-DE-Hedda` voice.           | `sha256:c8e615d40c6e96216b90e329bf7185060de646db1e92fd1fdcd344a52bd86b55` |
| `de-de-stefan-apollo`                       | Container image with the `de-DE` locale and `de-DE-Stefan-Apollo` voice.   | `sha256:e8e3f04f0ee74d4247ffb7c69e54559f0cc6db66a121406e06ceb9dcdc3c4379` |
| `el-gr-stefanos`                            | Container image with the `el-GR` locale and `el-GR-Stefanos` voice.        | `sha256:15112a55bc7ccb6c29ee0a1de464fa6352a0e9953399032e5c8a0d29ec064af0` |
| `en-au-catherine`                           | Container image with the `en-AU` locale and `en-AU-Catherine` voice.       | `sha256:9a77bb5451889f62b8a146bfcc4a412c1cef95fd2102650528ccee84a08b25b8` |
| `en-au-hayleyrus`                           | Container image with the `en-AU` locale and `en-AU-HayleyRUS` voice.       | `sha256:90ee1094fbb8e739788545b3b9f4fabad5b4dffb5b7087cfd01c3b21ba1b2473` |
| `en-ca-heatherrus`                          | Container image with the `en-CA` locale and `en-CA-HeatherRUS` voice.      | `sha256:43b7d3c87162129253fd5c150307a5d9dc6ea28b8fa19776b66f4aa7a546f43b` |
| `en-ca-linda`                               | Container image with the `en-CA` locale and `en-CA-Linda` voice.           | `sha256:75a4423d5b24136efdc5de28a7a5b50a3a09b65b3824f86dd50a95eefea7ead6` |
| `en-gb-george-apollo`                       | Container image with the `en-GB` locale and `en-GB-George-Apollo` voice.   | `sha256:87e926f7db4a27870c735c80ad801bc5480fb2665594727ae760c8c287677088` |
| `en-gb-hazelrus`                            | Container image with the `en-GB` locale and `en-GB-HazelRUS` voice.        | `sha256:3fbd6a824831f158762036aa41c0397f7c1148150a4dc045db5f19ba840e74b6` |
| `en-gb-susan-apollo`                        | Container image with the `en-GB` locale and `en-GB-Susan-Apollo` voice.    | `sha256:646810c4129f8919ff56d91701b488e229bd12b3dd9c89a1635868f9340e00b8` |
| `en-ie-sean`                                | Container image with the `en-IE` locale and `en-IE-Sean` voice.            | `sha256:641abfa96380f142d4b2f9145cd02886d44f01bce68614094b48c1e01b50ed59` |
| `en-in-heera-apollo`                        | Container image with the `en-IN` locale and `en-IN-Heera-Apollo` voice.    | `sha256:c0acfffceae9c1ff5ad305d8b98929d9c65eca25f49ddcb8999d7de6118392d2` |
| `en-in-priyarus`                            | Container image with the `en-IN` locale and `en-IN-PriyaRUS` voice.        | `sha256:fbdc9ef0b4308ffce87d6ff6854814804b3cafacad6c4dc5cdac6a47c6de7975` |
| `en-in-ravi-apollo`                         | Container image with the `en-IN` locale and `en-IN-Ravi-Apollo` voice.     | `sha256:f31c40c9db2f1e826686649e748d0b2be0c00abcac62c2aae5b8981b0d8c681d` |
| `en-us-aria24krus`                          | Container image with the `en-US` locale and `en-US-Aria24kRUS` voice.      | `sha256:1232b798aae3ce68d1e555a5b35142bde5b4c871488f8c82c3d7c0767925afd8` |
| `en-us-ariarus`                             | Container image with the `en-US` locale and `en-US-AriaRUS` voice.         | `sha256:1232b798aae3ce68d1e555a5b35142bde5b4c871488f8c82c3d7c0767925afd8` |
| `en-us-benjaminrus`                         | Container image with the `en-US` locale and `en-US-BenjaminRUS` voice.     | `sha256:5fd7e9fbcc84ab467d04e95b18f5411579ce2d9a153b7f6e396f2412d08898dc` |
| `en-us-guy24krus`                           | Container image with the `en-US` locale and `en-US-Guy24kRUS` voice.       | `sha256:5fbbd16ab58b7f2440778b258bb0cd966286de0dbb3ce7f5e54d0f244f63dd3f` |
| `en-us-zirarus`                             | Container image with the `en-US` locale and `en-US-ZiraRUS` voice.         | `sha256:806b92916b2fe1e7855023a009742033a48cb7eddde84ddf7c93be93b9621026` |
| `es-es-helenarus`                           | Container image with the `es-ES` locale and `es-ES-HelenaRUS` voice.       | `sha256:507d9f40dcb846a5d1511a5e9e1cf94b360b1d9922f4b1143c3146d1b3bc69a2` |
| `es-es-laura-apollo`                        | Container image with the `es-ES` locale and `es-ES-Laura-Apollo` voice.    | `sha256:594add691d03d02fa5925f817e6a25c091fac1a924e0ea4b626e0fce858a78cb` |
| `es-es-pablo-apollo`                        | Container image with the `es-ES` locale and `es-ES-Pablo-Apollo` voice.    | `sha256:09d288b58fea080689471618227d1cb3ccc467f2edc9477eaaffffb09b3d6d8b` |
| `es-mx-hildarus`                            | Container image with the `es-MX` locale and `es-MX-HildaRUS` voice.        | `sha256:7019c80c88444a60bf1016eb66284745dc8184b051685df4a1b3c40d32c8ad7f` |
| `es-mx-raul-apollo`                         | Container image with the `es-MX` locale and `es-MX-Raul-Apollo` voice.     | `sha256:eed46588733b884c330fff1ff7f4e3e3fd6416cb340ebd80e44c4b3d1e085e55` |
| `fi-fi-heidirus`                            | Container image with the `fi-FI` locale and `fi-FI-HeidiRUS` voice.        | `sha256:00f7a854c4a01bdbef88e0b138c97f732f1c6008a8b2c1722fc8da3a91fa79a4` |
| `fr-ca-caroline`                            | Container image with the `fr-CA` locale and `fr-CA-Caroline` voice.        | `sha256:5f32e838a0925c560d2961a42487b99dd7e79e04661a7711f905d36c55973fd6` |
| `fr-ca-harmonierus`                         | Container image with the `fr-CA` locale and `fr-CA-HarmonieRUS` voice.     | `sha256:6f3d3237c990f8f04d4c8f488746f74fa94edd2c5f1def758af90b2be251900e` |
| `fr-ch-guillaume`                           | Container image with the `fr-CH` locale and `fr-CH-Guillaume` voice.       | `sha256:282e2e48c1147b74d927e801534be52b1301a081ff881994e85bb9d85b6e85fb` |
| `fr-fr-hortenserus`                         | Container image with the `fr-FR` locale and `fr-FR-HortenseRUS` voice.     | `sha256:16370c22530c93fc6c5ebeaf10663de7c3d45db58eccc716abd5274b5bee56d3` |
| `fr-fr-julie-apollo`                        | Container image with the `fr-FR` locale and `fr-FR-Julie-Apollo` voice.    | `sha256:e6541e82b8555f748f1feb5eef1c0ebf884245c5448f0ced46e6f25dabb925a2` |
| `fr-fr-paul-apollo`                         | Container image with the `fr-FR` locale and `fr-FR-Paul-Apollo` voice.     | `sha256:a4cf0bab208a31da3e796bf353969dfd98184b30e0cf713df49cb4fb07ff568b` |
| `he-il-asaf`                                | Container image with the `he-IL` locale and `he-IL-Asaf` voice.            | `sha256:4417d0a14098b564eb4ba91772eb7ad5976ac52b0b59ae484fc3a88017e0776b` |
| `hi-in-hemant`                              | Container image with the `hi-IN` locale and `hi-IN-Hemant` voice.          | `sha256:da086a3e2bc3e17f4e44165055fc61679e9356688d3735ee8cfd81e6265b8622` |
| `hi-in-kalpana-apollo`                      | Container image with the `hi-IN` locale and `hi-IN-Kalpana-Apollo` voice.  | `sha256:0c9915bf34e3045e39aa245c597aa7223fbf6100d7e20cbcc1bf131f89ee785e` |
| `hi-in-kalpana`                             | Container image with the `hi-IN` locale and `hi-IN-Kalpana` voice.         | `sha256:0c9915bf34e3045e39aa245c597aa7223fbf6100d7e20cbcc1bf131f89ee785e` |
| `hr-hr-matej`                               | Container image with the `hr-HR` locale and `hr-HR-Matej` voice.           | `sha256:fc08c968efe882ed11ad0ee0755a9d43eff88b96da8ec19e7a5c071810c84d8c` |
| `hu-hu-szabolcs`                            | Container image with the `hu-HU` locale and `hu-HU-Szabolcs` voice.        | `sha256:b6ad73f07efd1576e166b4d7e54a4ff419bfedc513a175fbb968389eb289a4ee` |
| `id-id-andika`                              | Container image with the `id-ID` locale and `id-ID-Andika` voice.          | `sha256:3aad5ccf0c155593934c29a3e50502bc80b0370fa29626e67cda141d4bf5ac89` |
| `it-it-cosimo-apollo`                       | Container image with the `it-IT` locale and `it-IT-Cosimo-Apollo` voice.   | `sha256:01502f274bad378e6e99bed5f80fdb476880ce04e8775ca56d338de2f2d43e8c` |
| `it-it-luciarus`                            | Container image with the `it-IT` locale and `it-IT-LuciaRUS` voice.        | `sha256:fdc20724194612d99e8339d25c72c7fe937ad741abe46d86def6c62880913c2a` |
| `ja-jp-ayumi-apollo`                        | Container image with the `ja-JP` locale and `ja-JP-Ayumi-Apollo` voice.    | `sha256:abf0e442ec972e25743a8af55da49a6fd5bf2ffd6ca09619d68e4dc9f9db779a` |
| `ja-jp-harukarus`                           | Container image with the `ja-JP` locale and `ja-JP-HarukaRUS` voice.       | `sha256:9eff152cd4bea6f9de3b101c0704f37c8a061e060287e3f9f8fc2eb28d7dcec7` |
| `ja-jp-ichiro-apollo`                       | Container image with the `ja-JP` locale and `ja-JP-Ichiro-Apollo` voice.   | `sha256:83aa3c569f7598843d4957f075915ac2635d3aaf577ac1158c12a1238dd7e148` |
| `ko-kr-heamirus`                            | Container image with the `ko-KR` locale and `ko-KR-HeamiRUS` voice.        | `sha256:ea404c7857f9df0a23cbf3fac12ae00f11c32a6822d91078a321302f09f01082` |
| `ms-my-rizwan`                              | Container image with the `ms-MY` locale and `ms-MY-Rizwan` voice.          | `sha256:d4c15f7da8e03650395489b6cb6975d59322b1bbd2c59957617f0c0a297409ee` |
| `nb-no-huldarus`                            | Container image with the `nb-NO` locale and `nb-NO-HuldaRUS` voice.        | `sha256:cb2c0fb57513c66e00bd6b8cbb44882d5bb7d483c19784d2b1e09511d58842bc` |
| `nl-nl-hannarus`                            | Container image with the `nl-NL` locale and `nl-NL-HannaRUS` voice.        | `sha256:7b9a92ab8a9856f422e65b428b845571a059c0923dc1c348134f271ed7a4abe0` |
| `pl-pl-paulinarus`                          | Container image with the `pl-PL` locale and `pl-PL-PaulinaRUS` voice.      | `sha256:cface74973368a78d75a2a079214aa748574c5f037b0c4189888269b6016f230` |
| `pt-br-daniel-apollo`                       | Container image with the `pt-BR` locale and `pt-BR-Daniel-Apollo` voice.   | `sha256:cc3e74228002b8d4e7dc487ff6f930316ac5d7a93f97937942a23f41b484ba8c` |
| `pt-br-heloisarus`                          | Container image with the `pt-BR` locale and `pt-BR-HeloisaRUS` voice.      | `sha256:dca613867e2f559d9485f9ba553ecea3de6d4b2779d4eed0ce1e53e7f7939773` |
| `pt-pt-heliarus`                            | Container image with the `pt-PT` locale and `pt-PT-HeliaRUS` voice.        | `sha256:791ac2b3100725f909cfeceb17fc0d5fd1022242db45ba455d7ea088d76ac033` |
| `ro-ro-andrei`                              | Container image with the `ro-RO` locale and `ro-RO-Andrei` voice.          | `sha256:3b93df188bcbdf9416d203a7e30ade8908728316666cd3451a5f0320cdf219a9` |
| `ru-ru-ekaterinarus`                        | Container image with the `ru-RU` locale and `ru-RU-EkaterinaRUS` voice.    | `sha256:d2f636e35e67be196a4ad79f168e4df74d2f00d5b5c6123bd61f9aec72bfd1a7` |
| `ru-ru-irina-apollo`                        | Container image with the `ru-RU` locale and `ru-RU-Irina-Apollo` voice.    | `sha256:247a4c6025faced1be1738d816c1bb74b23bbc5d49458f9afe95dc32ab3ea71c` |
| `ru-ru-pavel-apollo`                        | Container image with the `ru-RU` locale and `ru-RU-Pavel-Apollo` voice.    | `sha256:355c3a0f64f003d0a041a757b8ddcdea8130b6a56a7c4003a68ba0412400c446` |
| `sk-sk-filip`                               | Container image with the `sk-SK` locale and `sk-SK-Filip` voice.           | `sha256:55fff1cde012a7791c756104ba68a360e609a765bd776024a9f5f00199f568e5` |
| `sl-si-lado`                                | Container image with the `sl-SI` locale and `sl-SI-Lado` voice.            | `sha256:7f80965dde85e3a5aae9f69561c296d073289f0b6aa37e95ff0aa5192a5b7f90` |
| `sv-se-hedvigrus`                           | Container image with the `sv-SE` locale and `sv-SE-HedvigRUS` voice.       | `sha256:1bd43f513a5b2752c44a107e1898459cdda5d7267ec21f379679d411700e5189` |
| `ta-in-valluvar`                            | Container image with the `ta-IN` locale and `ta-IN-Valluvar` voice.        | `sha256:8062e2479a6a3dc17b8342c07a94a39dd1e1f788c1def0a1ab55a885b491bbab` |
| `te-in-chitra`                              | Container image with the `te-IN` locale and `te-IN-Chitra` voice.          | `sha256:6ce345df654bd1db213c16c866b608037dcefb1d056fc14727db3b9e21437762` |
| `th-th-pattara`                             | Container image with the `th-TH` locale and `th-TH-Pattara` voice.         | `sha256:9b9c8ad7f8621f887f3e9fda26f43995855dba76831fdf2598ef383cf3d20f39` |
| `tr-tr-sedarus`                             | Container image with the `tr-TR` locale and `tr-TR-SedaRUS` voice.         | `sha256:2e45f019df702d8788c1d9c20ff75cfd94aecaaf6facb9f41b642ef1bfe7d318` |
| `vi-vn-an`                                  | Container image with the `vi-VN` locale and `vi-VN-An` voice.              | `sha256:3b142a414ff9f30ebef144e22bf979589600f226442d2f882384695795739178` |
| `zh-cn-huihuirus`                           | Container image with the `zh-CN` locale and `zh-CN-HuihuiRUS` voice.       | `sha256:23b76501492c9b60e8888eda2f6b0258859f68ed6ff7fb49bacbb18cd5f542ed` |
| `zh-cn-kangkang-apollo`                     | Container image with the `zh-CN` locale and `zh-CN-Kangkang-Apollo` voice. | `sha256:e9acc58168f6800d9dd11cbc569c9d279ecf28f3d17c702528d25f67edd447c9` |
| `zh-cn-yaoyao-apollo`                       | Container image with the `zh-CN` locale and `zh-CN-Yaoyao-Apollo` voice.   | `sha256:85e7d7ae77d41195de5102b772621ef34564d40fad224a0ed21a8fe8daf98b0f` |
| `zh-hk-danny-apollo`                        | Container image with the `zh-HK` locale and `zh-HK-Danny-Apollo` voice.    | `sha256:1fcba05138c0e5bf36447530311800e2d4044824b5d893439a12f3ebc6380135` |
| `zh-hk-tracy-apollo`                        | Container image with the `zh-HK` locale and `zh-HK-Tracy-Apollo` voice.    | `sha256:d02bd8759e085abbc95725aa4f70f124c4505aa0856a17696a1555b2cf64512e` |
| `zh-hk-tracyrus`                            | Container image with the `zh-HK` locale and `zh-HK-TracyRUS` voice.        | `sha256:d02bd8759e085abbc95725aa4f70f124c4505aa0856a17696a1555b2cf64512e` |
| `zh-tw-hanhanrus`                           | Container image with the `zh-TW` locale and `zh-TW-HanHanRUS` voice.       | `sha256:a3f68538088b5b07f4dc27239fa3a6308d949c2643638634c74f3ee132bca911` |
| `zh-tw-yating-apollo`                       | Container image with the `zh-TW` locale and `zh-TW-Yating-Apollo` voice.   | `sha256:bb0696685f3a90fe6898ff1487cb0c5957e02f3c63cdb7d02394b5c061339bf3` |
| `zh-tw-zhiwei-apollo`                       | Container image with the `zh-TW` locale and `zh-TW-Zhiwei-Apollo` voice.   | `sha256:1772b3bc8b166f429356b00d07ca438202c75d578b6d1655351b9c1e06ae1424` |

| Locales for v1.12.0                         | Notes                                                                      | Digest                         |
|---------------------------------------------|:---------------------------------------------------------------------------|:-------------------------------|
| `ar-eg-hoda`                                | Container image with the `ar-EG` locale and `ar-EG-Hoda` voice.            | `sha256:987e6b3e9e13570eb29117e87829a4905b35c712a0f36429dd6404793af31627` |
| `ar-sa-naayf`                               | Container image with the `ar-SA` locale and `ar-SA-Naayf` voice.           | `sha256:7d1d3c337b7e3bdc6ae2b3e074828ffc3c64ffc0ab94abcb89896e623148d963` |
| `bg-bg-ivan`                                | Container image with the `bg-BG` locale and `bg-BG-Ivan` voice.            | `sha256:cf01bea4f1f6b7112871da84fd82fb7e6de106c11cc933f21131385173f1da09` |
| `ca-es-herenarus`                           | Container image with the `ca-ES` locale and `ca-ES-HerenaRUS` voice.       | `sha256:d6060a1e16cbe40990677b3c46f14dc619ee6887d39a4af1cac51fba2baca9a9` |
| `cs-cz-jakub`                               | Container image with the `cs-CZ` locale and `cs-CZ-Jakub` voice.           | `sha256:5033185bd60257033989fc4ff124c69b1dd02d5b99b79ff5c52ae84572095693` |
| `da-dk-hellerus`                            | Container image with the `da-DK` locale and `da-DK-HelleRUS` voice.        | `sha256:ac9655166f8181db2d0e6684cc3a5b6e089da788f17c78067af2cf061c8db660` |
| `de-at-michael`                             | Container image with the `de-AT` locale and `de-AT-Michael` voice.         | `sha256:90d222aa43c3efac04b9bc3e746b9ebea446cc16c3bdbb471b81065edfbc3023` |
| `de-ch-karsten`                             | Container image with the `de-CH` locale and `de-CH-Karsten` voice.         | `sha256:0c08c10f559c97eda9a0a3f8527f8b05810a53e8a3fd2b8e9f2ab35f587d6c46` |
| `de-de-heddarus`                            | Container image with the `de-DE` locale and `de-DE-Hedda` voice.           | `sha256:bf54713a1691f2378cf701a1f68ed0f4d32adeab25b2cbd9493f753d56d13e39` |
| `de-de-hedda`                               | Container image with the `de-DE` locale and `de-DE-Hedda` voice.           | `sha256:bf54713a1691f2378cf701a1f68ed0f4d32adeab25b2cbd9493f753d56d13e39` |
| `de-de-stefan-apollo`                       | Container image with the `de-DE` locale and `de-DE-Stefan-Apollo` voice.   | `sha256:b94c79ace4b33bad944f88259da4dab5f52da7e78af85a8b6eee0e99ed05a387` |
| `el-gr-stefanos`                            | Container image with the `el-GR` locale and `el-GR-Stefanos` voice.        | `sha256:3b331be0a6eb32b12d5c6244691bd51ee1d6b218bd3dc066c0f9cb5b78864e14` |
| `en-au-catherine`                           | Container image with the `en-AU` locale and `en-AU-Catherine` voice.       | `sha256:1bbbd1214119d2e02539f7bef8eeba48e86f17b968f2532a7d96e96ef40ecbe3` |
| `en-au-hayleyrus`                           | Container image with the `en-AU` locale and `en-AU-HayleyRUS` voice.       | `sha256:aa0a38fd20cabcf33baa97b3a88f354d01055f57ed9376bf98b7ea0993333ffa` |
| `en-ca-heatherrus`                          | Container image with the `en-CA` locale and `en-CA-HeatherRUS` voice.      | `sha256:57966c65522862572e07ba474fba7e2c6038091cc1b8a35861645dffc2fc5f5b` |
| `en-ca-linda`                               | Container image with the `en-CA` locale and `en-CA-Linda` voice.           | `sha256:57c6ff08057f199a8eb75668f8ddce26b92c87a7e01e9003b74339b98ea438c4` |
| `en-gb-george-apollo`                       | Container image with the `en-GB` locale and `en-GB-George-Apollo` voice.   | `sha256:89a8b8b8e900e6dbda665d245fd8a911d6e3286ee16a92e46f1993dc3667b631` |
| `en-gb-hazelrus`                            | Container image with the `en-GB` locale and `en-GB-HazelRUS` voice.        | `sha256:18347ce1c4e4e21180f64c27bb4bcbebbf52597e25db7e24dbeb57edcea56109` |
| `en-gb-susan-apollo`                        | Container image with the `en-GB` locale and `en-GB-Susan-Apollo` voice.    | `sha256:015905bd42f8fb4ec575d971ff2d710ac5f904da2b84909270d3a7e51f5e3029` |
| `en-ie-sean`                                | Container image with the `en-IE` locale and `en-IE-Sean` voice.            | `sha256:4a490dcc6be935178761f14edbdd0c6e4036626046dbfeda002336d871c36fdc` |
| `en-in-heera-apollo`                        | Container image with the `en-IN` locale and `en-IN-Heera-Apollo` voice.    | `sha256:f26fb9b32ca82aa00c40f8824ed5d3d95ba1be5a10343e8649946d9468f9f74f` |
| `en-in-priyarus`                            | Container image with the `en-IN` locale and `en-IN-PriyaRUS` voice.        | `sha256:43f5fffad77d3446bc08922df36e244115ecf6090e7c48c42281c2fa62d23b90` |
| `en-in-ravi-apollo`                         | Container image with the `en-IN` locale and `en-IN-Ravi-Apollo` voice.     | `sha256:0ca4a07585a61a6e15c7fd951b77bab6b5cf8934ecff65fe4ca6cfe8e47f351b` |
| `en-us-aria24krus`                          | Container image with the `en-US` locale and `en-US-Aria24kRUS` voice.      | `sha256:00857cb570528dee93f7c9c7f96bb2e11763ff6aa9cc7405a05bcbad3d85b08d` |
| `en-us-ariarus`                             | Container image with the `en-US` locale and `en-US-AriaRUS` voice.         | `sha256:00857cb570528dee93f7c9c7f96bb2e11763ff6aa9cc7405a05bcbad3d85b08d` |
| `en-us-benjaminrus`                         | Container image with the `en-US` locale and `en-US-BenjaminRUS` voice.     | `sha256:3d7c911788bda58225a7100ba1a9afbb61e0a9f8b7633b383fe6e9faa48471d0` |
| `en-us-guy24krus`                           | Container image with the `en-US` locale and `en-US-Guy24kRUS` voice.       | `sha256:251841a8399bd168644460e3ebf6d92f093dc8ea60f9defdc663a7e1f60515fa` |
| `en-us-zirarus`                             | Container image with the `en-US` locale and `en-US-ZiraRUS` voice.         | `sha256:dbc6bb44b283902755907d9cee5694f880c95c6cf939f328059d826fefe53dfa` |
| `es-es-helenarus`                           | Container image with the `es-ES` locale and `es-ES-HelenaRUS` voice.       | `sha256:9f11111e24b554d907d36516d130324d64a477b512cbd7faffa0b7d3895aa538` |
| `es-es-laura-apollo`                        | Container image with the `es-ES` locale and `es-ES-Laura-Apollo` voice.    | `sha256:04add8f669539cb2522237a1b01d263b30ed609332cd2ff6dcf2c88fcd24764a` |
| `es-es-pablo-apollo`                        | Container image with the `es-ES` locale and `es-ES-Pablo-Apollo` voice.    | `sha256:d375f7eea3592e041943a56ba18bec9ebc4bba1c99dea4d583f2012aee31cff7` |
| `es-mx-hildarus`                            | Container image with the `es-MX` locale and `es-MX-HildaRUS` voice.        | `sha256:437e38d9cb97d2cee27890529eccc1d0b96622749c83844b89c50dc119176b61` |
| `es-mx-raul-apollo`                         | Container image with the `es-MX` locale and `es-MX-Raul-Apollo` voice.     | `sha256:b6c0937fddd2e4d39a7cd96628a3d7d6004936f356cb553942e4f7dd48824b52` |
| `fi-fi-heidirus`                            | Container image with the `fi-FI` locale and `fi-FI-HeidiRUS` voice.        | `sha256:5a359ab047d811996cccb9f3f95a59a7e023ee5be72ff0f509e7ebfeb0d3a07a` |
| `fr-ca-caroline`                            | Container image with the `fr-CA` locale and `fr-CA-Caroline` voice.        | `sha256:439bab9f2933c73e52e78f1683a027e81a251c32fb8aa49b6cd8e7c9b2451f15` |
| `fr-ca-harmonierus`                         | Container image with the `fr-CA` locale and `fr-CA-HarmonieRUS` voice.     | `sha256:ca798c5d25454b60cafca44f7f7e32896146966a8de94d00cced06235e38bf00` |
| `fr-ch-guillaume`                           | Container image with the `fr-CH` locale and `fr-CH-Guillaume` voice.       | `sha256:e696a65a7c40209a8dd8d9ff59ca5334811e993f5b454f6d741ce0fc59258e07` |
| `fr-fr-hortenserus`                         | Container image with the `fr-FR` locale and `fr-FR-HortenseRUS` voice.     | `sha256:ab6e7c023ee6cef95f8dc4eeb3c804ea1b8af937cadb17efcc12e5b18adcfc69` |
| `fr-fr-julie-apollo`                        | Container image with the `fr-FR` locale and `fr-FR-Julie-Apollo` voice.    | `sha256:cb8f51f75a0b93baf6efb1624d7d01cd736926769922d61a63773eb3a1097399` |
| `fr-fr-paul-apollo`                         | Container image with the `fr-FR` locale and `fr-FR-Paul-Apollo` voice.     | `sha256:482aa2eb44f41294780cf299e6105a1a3105a2d8065233b34ef1837879f95b7f` |
| `he-il-asaf`                                | Container image with the `he-IL` locale and `he-IL-Asaf` voice.            | `sha256:2f24ef0e620eeec3ea14262302d22cbb539a8afa85d356ffa446ca9cfd723b31` |
| `hi-in-hemant`                              | Container image with the `hi-IN` locale and `hi-IN-Hemant` voice.          | `sha256:0338f8e24eddb819c45909ec3a92c430b1d5ec1567a71495cc19c9a74382b224` |
| `hi-in-kalpana-apollo`                      | Container image with the `hi-IN` locale and `hi-IN-Kalpana-Apollo` voice.  | `sha256:5d7e10ab0fd18d1d163c31341765b6f65bb198048424aa622b854172e845726d` |
| `hi-in-kalpana`                             | Container image with the `hi-IN` locale and `hi-IN-Kalpana` voice.         | `sha256:5d7e10ab0fd18d1d163c31341765b6f65bb198048424aa622b854172e845726d` |
| `hr-hr-matej`                               | Container image with the `hr-HR` locale and `hr-HR-Matej` voice.           | `sha256:08d606969abd0165a798a8e0061e6439d4a33ad6af71aa58a1228e98018e7da9` |
| `hu-hu-szabolcs`                            | Container image with the `hu-HU` locale and `hu-HU-Szabolcs` voice.        | `sha256:9613dbf91878054e2ab79d5d9c8f3686d5fe80b16c40d38db9aec3a2c3816555` |
| `id-id-andika`                              | Container image with the `id-ID` locale and `id-ID-Andika` voice.          | `sha256:037ca355d8dcf9bff5fda9b9a4a9c2a54a03f3a48c378693c11437a36a245836` |
| `it-it-cosimo-apollo`                       | Container image with the `it-IT` locale and `it-IT-Cosimo-Apollo` voice.   | `sha256:647b92d1591501ed032d67cf2cfd719e95c24ffb624143d301c2b6dc5eed7397` |
| `it-it-luciarus`                            | Container image with the `it-IT` locale and `it-IT-LuciaRUS` voice.        | `sha256:c35e40ffe1352870b9f177dcf70c1cd9eec9f22f92d35080fb5baa1fa65eac8d` |
| `ja-jp-ayumi-apollo`                        | Container image with the `ja-JP` locale and `ja-JP-Ayumi-Apollo` voice.    | `sha256:4fa1436d83439cc9672fe82e35f57a366d2c1a6eb1df1f9f9175d3a588b09610` |
| `ja-jp-harukarus`                           | Container image with the `ja-JP` locale and `ja-JP-HarukaRUS` voice.       | `sha256:82f13a16e7812857143d311b5443cecfd7c199a88235728f437ba03e7cd92342` |
| `ja-jp-ichiro-apollo`                       | Container image with the `ja-JP` locale and `ja-JP-Ichiro-Apollo` voice.   | `sha256:565bfa8bab3a11608fd5fecae1a0cd655b4508404c354d5574af0e88ff1aec76` |
| `ko-kr-heamirus`                            | Container image with the `ko-KR` locale and `ko-KR-HeamiRUS` voice.        | `sha256:2b9ab2e9d946e152b46a634ae291fedd220c76a7ba133346e80b4b19bcaa1422` |
| `ms-my-rizwan`                              | Container image with the `ms-MY` locale and `ms-MY-Rizwan` voice.          | `sha256:3a05e09241b43c149132b42079f486f0a076d493d4e4c7e4a56b8a030c5b55c7` |
| `nb-no-huldarus`                            | Container image with the `nb-NO` locale and `nb-NO-HuldaRUS` voice.        | `sha256:bb018c3c7d65c825c1755c510aca7f73f058ac4dce236dc114131c5699a1cb61` |
| `nl-nl-hannarus`                            | Container image with the `nl-NL` locale and `nl-NL-HannaRUS` voice.        | `sha256:eb2f7dc4db0981717b5fdd16c290ecb8135bd5ae409e0b569e3de34a9fb9f071` |
| `pl-pl-paulinarus`                          | Container image with the `pl-PL` locale and `pl-PL-PaulinaRUS` voice.      | `sha256:098fabd9284caabafd4af526d52d5fa70ccbd0dc0e0c658753d7c644ab3bf813` |
| `pt-br-daniel-apollo`                       | Container image with the `pt-BR` locale and `pt-BR-Daniel-Apollo` voice.   | `sha256:c7c033ef39c3da6c82ed1870e6796f501654403605268bcc8136cedd37c5ad1f` |
| `pt-br-heloisarus`                          | Container image with the `pt-BR` locale and `pt-BR-HeloisaRUS` voice.      | `sha256:2da1e4c972b47efd82a28b4a8324637d878b100bc730f90e9c9d16a6ccec75e9` |
| `pt-pt-heliarus`                            | Container image with the `pt-PT` locale and `pt-PT-HeliaRUS` voice.        | `sha256:2f0ba437a2f7fbce9923a4da986aec53ec0ad3d52858e6aa12a7464cfa190240` |
| `ro-ro-andrei`                              | Container image with the `ro-RO` locale and `ro-RO-Andrei` voice.          | `sha256:847e60ea915697dd038319a071757e095229ca0001bf05f1d922d4c52ff4b22a` |
| `ru-ru-ekaterinarus`                        | Container image with the `ru-RU` locale and `ru-RU-EkaterinaRUS` voice.    | `sha256:37914d4ed1a12d3999385592d5dc0c0ed11148f71f09e11a1bb4c9394691e3b7` |
| `ru-ru-irina-apollo`                        | Container image with the `ru-RU` locale and `ru-RU-Irina-Apollo` voice.    | `sha256:3a800cee6d1520a1c0502d9b682a7e0f98ef01de58bb39ea31573a9711ef1271` |
| `ru-ru-pavel-apollo`                        | Container image with the `ru-RU` locale and `ru-RU-Pavel-Apollo` voice.    | `sha256:70ad01c5cf6da459e0938c1da17348624e38d94b3ce4f22e181b9516262e961c` |
| `sk-sk-filip`                               | Container image with the `sk-SK` locale and `sk-SK-Filip` voice.           | `sha256:8920e7acd70d6d550b66eb3c23878d070dc98219bd59fa8fce1abaf622da4c2f` |
| `sl-si-lado`                                | Container image with the `sl-SI` locale and `sl-SI-Lado` voice.            | `sha256:c17313ddab7e7d9c2777d4a19df65b34da4e30e52b4a21f81e5c59bacdfce979` |
| `sv-se-hedvigrus`                           | Container image with the `sv-SE` locale and `sv-SE-HedvigRUS` voice.       | `sha256:91315b4a62bbf69e117cdb4ef88facb02d3ee3d436a1e313af94ba6cb0b8608d` |
| `ta-in-valluvar`                            | Container image with the `ta-IN` locale and `ta-IN-Valluvar` voice.        | `sha256:d04761de48003062617397de4c4c5f448cd9b4bf57262587d245277d4e408431` |
| `te-in-chitra`                              | Container image with the `te-IN` locale and `te-IN-Chitra` voice.          | `sha256:e41002cf7f56d948d2737adc23c0750b430d553d78abb2ac53c42427de971299` |
| `th-th-pattara`                             | Container image with the `th-TH` locale and `th-TH-Pattara` voice.         | `sha256:5f556a0c113750d8780c09be8af7db28bc29784056d22389aec61c256ab9cbcb` |
| `tr-tr-sedarus`                             | Container image with the `tr-TR` locale and `tr-TR-SedaRUS` voice.         | `sha256:c893b27edd98c0760b7e510c365018e333aa0976ef742f7714ad59c92950a8e2` |
| `vi-vn-an`                                  | Container image with the `vi-VN` locale and `vi-VN-An` voice.              | `sha256:bc34adc094183bbbc461e0350d7aa8e5140ece5e89cd9e77c60f2c96276037b2` |
| `zh-cn-huihuirus`                           | Container image with the `zh-CN` locale and `zh-CN-HuihuiRUS` voice.       | `sha256:20b23d368f83d4b2926b6d8529d23c4dd84727bb063593d549fb959ce3ace8d2` |
| `zh-cn-kangkang-apollo`                     | Container image with the `zh-CN` locale and `zh-CN-Kangkang-Apollo` voice. | `sha256:cb638e72c8966204ab9142810b94cf4c2da54f3fd5917ae0e12a11d28a4253bb` |
| `zh-cn-yaoyao-apollo`                       | Container image with the `zh-CN` locale and `zh-CN-Yaoyao-Apollo` voice.   | `sha256:041a22b054b0acf494ff3085cdb2cd2eb4faeb7b692027f1723d27c341a8ee33` |
| `zh-hk-danny-apollo`                        | Container image with the `zh-HK` locale and `zh-HK-Danny-Apollo` voice.    | `sha256:7d9d2766713507b04c0bf3332367e867524ff392b693f4eb8a8c003a4dfc3bac` |
| `zh-hk-tracy-apollo`                        | Container image with the `zh-HK` locale and `zh-HK-Tracy-Apollo` voice.    | `sha256:b6dfbdbc5ef0d91812d96c88393c0ae4835eea42dbba4c3d36ab9c5e806bb772` |
| `zh-hk-tracyrus`                            | Container image with the `zh-HK` locale and `zh-HK-TracyRUS` voice.        | `sha256:b6dfbdbc5ef0d91812d96c88393c0ae4835eea42dbba4c3d36ab9c5e806bb772` |
| `zh-tw-hanhanrus`                           | Container image with the `zh-TW` locale and `zh-TW-HanHanRUS` voice.       | `sha256:9802fc4a9656063cb9f215ca757db5289960d323244272ce280db0395ddd46ac` |
| `zh-tw-yating-apollo`                       | Container image with the `zh-TW` locale and `zh-TW-Yating-Apollo` voice.   | `sha256:05f50dffbeb17e4215a5a53cc0791d825b63bc1e2b007b00797e5d0e1b1d6d1e` |
| `zh-tw-zhiwei-apollo`                       | Container image with the `zh-TW` locale and `zh-TW-Zhiwei-Apollo` voice.   | `sha256:e96f4aecba6e3c0741218f3e1aec35e53147b12543be9fdcd76ff98d4c34cf84` |

| Locales for v1.11.0                         | Notes                                                                      | Digest                         |
|---------------------------------------------|:---------------------------------------------------------------------------|:-------------------------------|
| `ar-eg-hoda`                                | Container image with the `ar-EG` locale and `ar-EG-Hoda` voice.            | `sha256:7ba558f444ea482eca87b3e850e9b416c71391282b26a590d1ee3d9a81350188` |
| `ar-sa-naayf`                               | Container image with the `ar-SA` locale and `ar-SA-Naayf` voice.           | `sha256:7f0afcc205340dea7ffd959812dcba6a11448f6c5c1ab55c1422a360bd876137` |
| `bg-bg-ivan`                                | Container image with the `bg-BG` locale and `bg-BG-Ivan` voice.            | `sha256:fde80af0e2e8e49b49ddec5f1502a246cf308328738d6f572f0043e625673782` |
| `ca-es-herenarus`                           | Container image with the `ca-ES` locale and `ca-ES-HerenaRUS` voice.       | `sha256:fb2b50b128aa84ad0cd05db2462337d316ff2d2d78f393c5a9dece588a80654e` |
| `cs-cz-jakub`                               | Container image with the `cs-CZ` locale and `cs-CZ-Jakub` voice.           | `sha256:9dde22e5e2164bee77aaf9fe4e8fc141d9dfbe3c92c4b07da969d34aa14f7fd0` |
| `da-dk-hellerus`                            | Container image with the `da-DK` locale and `da-DK-HelleRUS` voice.        | `sha256:4a756cd10ad21dcc2b1c7006ec961f7e267f6d2204d9ad4efd6d4730d67a4ccc` |
| `de-at-michael`                             | Container image with the `de-AT` locale and `de-AT-Michael` voice.         | `sha256:9d531c162c4279830f99ef0d44a506a023a0137723aab3adff7a663043a1c576` |
| `de-ch-karsten`                             | Container image with the `de-CH` locale and `de-CH-Karsten` voice.         | `sha256:353d07168b4a44fcc12a0239f5bf20e2d29365b9abe26b9b844fb6194e7c9bcc` |
| `de-de-heddarus`                            | Container image with the `de-DE` locale and `de-DE-Hedda` voice.           | `sha256:d76ff817fc154ba0f5ce1abb93c5a0269fe5bf7b4feb3b3fe9fe8ffe6fd4fee4` |
| `de-de-hedda`                               | Container image with the `de-DE` locale and `de-DE-Hedda` voice.           | `sha256:d76ff817fc154ba0f5ce1abb93c5a0269fe5bf7b4feb3b3fe9fe8ffe6fd4fee4` |
| `de-de-stefan-apollo`                       | Container image with the `de-DE` locale and `de-DE-Stefan-Apollo` voice.   | `sha256:8e22964dc4b77c05f602f72b0e706a534a89a271c4d17b5117af122c34df9a18` |
| `el-gr-stefanos`                            | Container image with the `el-GR` locale and `el-GR-Stefanos` voice.        | `sha256:fcd6288d5fd4ddfe3d3e65e860895f6f7a7e81216c7113f71e7b1b01eb501150` |
| `en-au-catherine`                           | Container image with the `en-AU` locale and `en-AU-Catherine` voice.       | `sha256:e49a5ec17b696a3a73d10383d369a2ff88ccddb812898a2eedefe6e6a009ce5a` |
| `en-au-hayleyrus`                           | Container image with the `en-AU` locale and `en-AU-HayleyRUS` voice.       | `sha256:b7fb06bd992982c7e2e71da217898da45b742aab08e901bfcef9c43acf546bc0` |
| `en-ca-heatherrus`                          | Container image with the `en-CA` locale and `en-CA-HeatherRUS` voice.      | `sha256:efd7d85845ca597937b8cbea7724cf31797855e0de5f30d66984ab9bac688152` |
| `en-ca-linda`                               | Container image with the `en-CA` locale and `en-CA-Linda` voice.           | `sha256:8211077d55b440dbb26e42db6322b35ef6ec88e8c2ec6647831e0046668ed8a4` |
| `en-gb-george-apollo`                       | Container image with the `en-GB` locale and `en-GB-George-Apollo` voice.   | `sha256:f6e924720b71d8f9a1edd4f5f2280e9054263eb79ce5364e03c9b802ad92f2dd` |
| `en-gb-hazelrus`                            | Container image with the `en-GB` locale and `en-GB-HazelRUS` voice.        | `sha256:de702f70c53e4c1647e5fdd3432d37dc8972e069fcc103a1fc2b0be70f0d6d71` |
| `en-gb-susan-apollo`                        | Container image with the `en-GB` locale and `en-GB-Susan-Apollo` voice.    | `sha256:5077cb575ffeb64e3d70184a68259438821891f6c9865350d2f887ea43ee99c1` |
| `en-ie-sean`                                | Container image with the `en-IE` locale and `en-IE-Sean` voice.            | `sha256:c6f734cc12f04697a4d9b2003c46c5a4efd8c68da90838debb5628d9f8e70104` |
| `en-in-heera-apollo`                        | Container image with the `en-IN` locale and `en-IN-Heera-Apollo` voice.    | `sha256:f5a78e857bc1563cbcd74f7b856bc2e4bd981675b397aeccfa134137f1cd3392` |
| `en-in-priyarus`                            | Container image with the `en-IN` locale and `en-IN-PriyaRUS` voice.        | `sha256:667729cafd6bf5afe071a0a2989f836943e3bb6d3d1ebe35b7fab9bb311bfebc` |
| `en-in-ravi-apollo`                         | Container image with the `en-IN` locale and `en-IN-Ravi-Apollo` voice.     | `sha256:e46533f972235f297dd31fd338638f5117e3f04fa4a434d678d1cecc76db023b` |
| `en-us-aria24krus`                          | Container image with the `en-US` locale and `en-US-Aria24kRUS` voice.      | `sha256:a8f881b60021468dbd96d9733606bd00f7f889ccb523d1773492a8301128e596` |
| `en-us-ariarus`                             | Container image with the `en-US` locale and `en-US-AriaRUS` voice.         | `sha256:a8f881b60021468dbd96d9733606bd00f7f889ccb523d1773492a8301128e596` |
| `en-us-benjaminrus`                         | Container image with the `en-US` locale and `en-US-BenjaminRUS` voice.     | `sha256:53ee105977b6440f1a7fe5088255a9c6e437c39b7c66e5cd4aba984a1667b25c` |
| `en-us-guy24krus`                           | Container image with the `en-US` locale and `en-US-Guy24kRUS` voice.       | `sha256:537d2018f414b825aa9995d2e15e0bdb0119e45f2c6fc10d326e3df6f49ef713` |
| `en-us-zirarus`                             | Container image with the `en-US` locale and `en-US-ZiraRUS` voice.         | `sha256:05da3347d457ca040cbe9b3e3d586d298a844f906b34ef7b6d768c247274ff1f` |
| `es-es-helenarus`                           | Container image with the `es-ES` locale and `es-ES-HelenaRUS` voice.       | `sha256:481cc43ba896a0d3291903af84120fa618130e2a2c8dce9b0ef23172b66858a8` |
| `es-es-laura-apollo`                        | Container image with the `es-ES` locale and `es-ES-Laura-Apollo` voice.    | `sha256:8cb9d071a1e01dc3e63d5f1b1c040aa6fee94488a5bbd60f2c91704abfd921cc` |
| `es-es-pablo-apollo`                        | Container image with the `es-ES` locale and `es-ES-Pablo-Apollo` voice.    | `sha256:da293ff5c49435c020044614962382040f41b6339ec83677301921a6dabbafb7` |
| `es-mx-hildarus`                            | Container image with the `es-MX` locale and `es-MX-HildaRUS` voice.        | `sha256:9677d5bbbbe0c73df93948d4ecf3f367830ef9e7cfb3b42557cf94ec514b6c68` |
| `es-mx-raul-apollo`                         | Container image with the `es-MX` locale and `es-MX-Raul-Apollo` voice.     | `sha256:a5109a6a659aa321892d4c6844e102ac72990fc2d58f32e45a072b291849fee8` |
| `fi-fi-heidirus`                            | Container image with the `fi-FI` locale and `fi-FI-HeidiRUS` voice.        | `sha256:f8f1aa8168660ee1c21dfa4a92530bcba6f1aeb765cee9087a6cc29d7c332a8a` |
| `fr-ca-caroline`                            | Container image with the `fr-CA` locale and `fr-CA-Caroline` voice.        | `sha256:450f0f75f26299a89a80efc3ce93b42d6447a32022aaf4f88edc935e56100191` |
| `fr-ca-harmonierus`                         | Container image with the `fr-CA` locale and `fr-CA-HarmonieRUS` voice.     | `sha256:7b18adf90e6db8f8e2c5955f38aa0adfbdbd10a9a95e2cf13035b9c5416000e8` |
| `fr-ch-guillaume`                           | Container image with the `fr-CH` locale and `fr-CH-Guillaume` voice.       | `sha256:ec3c238d0bfc3d26f20349ade1c4e19805b796f4bb3d5bf1fe4a9801b1ea1471` |
| `fr-fr-hortenserus`                         | Container image with the `fr-FR` locale and `fr-FR-HortenseRUS` voice.     | `sha256:7b13613a9c5260e03ed831c79e5538633b4201867068ca0e1624b2c39fa8cf39` |
| `fr-fr-julie-apollo`                        | Container image with the `fr-FR` locale and `fr-FR-Julie-Apollo` voice.    | `sha256:162c777447e3077438865332ac34df956be43c0429ce9962bcf5df9b210dbf01` |
| `fr-fr-paul-apollo`                         | Container image with the `fr-FR` locale and `fr-FR-Paul-Apollo` voice.     | `sha256:8cdf28dc31d40a69eb6720fd42b8c19792f973c4e58760abbb6573c6129c81c1` |
| `he-il-asaf`                                | Container image with the `he-IL` locale and `he-IL-Asaf` voice.            | `sha256:3f9ec9201deca21f5e3e561d6dd673ee6fb2a7f13b4cae2985ffb69622994b99` |
| `hi-in-hemant`                              | Container image with the `hi-IN` locale and `hi-IN-Hemant` voice.          | `sha256:c6de645816587116384ada93c02257f257a13a4b696e1bd8aeecebb9a9668f15` |
| `hi-in-kalpana-apollo`                      | Container image with the `hi-IN` locale and `hi-IN-Kalpana-Apollo` voice.  | `sha256:455ab4c9bc7c2457e2e48265065789a54513e07a1dc9e4bc108651f118f1570d` |
| `hi-in-kalpana`                             | Container image with the `hi-IN` locale and `hi-IN-Kalpana` voice.         | `sha256:455ab4c9bc7c2457e2e48265065789a54513e07a1dc9e4bc108651f118f1570d` |
| `hr-hr-matej`                               | Container image with the `hr-HR` locale and `hr-HR-Matej` voice.           | `sha256:6ac24252194f91cd815736bd8be03fb95e0b965fabed5de4c631e99cd917da97` |
| `hu-hu-szabolcs`                            | Container image with the `hu-HU` locale and `hu-HU-Szabolcs` voice.        | `sha256:bf20ea91d922beb682e321a31cabb11ebec474f47edcf4e3787882e2a204b3b5` |
| `id-id-andika`                              | Container image with the `id-ID` locale and `id-ID-Andika` voice.          | `sha256:859bef31e5d882b508154ec00632e5e1e95bc8ea2dde6198f157703d759746c7` |
| `it-it-cosimo-apollo`                       | Container image with the `it-IT` locale and `it-IT-Cosimo-Apollo` voice.   | `sha256:b6c81ab4bd0aba217977b0bd83a8a65f7c09b5954cda0870dea15aec0dbbe1ed` |
| `it-it-luciarus`                            | Container image with the `it-IT` locale and `it-IT-LuciaRUS` voice.        | `sha256:e216a1390a0d4d9f111c56c1d655f36614947eea18d6ec91a9f6d050048b1ad4` |
| `ja-jp-ayumi-apollo`                        | Container image with the `ja-JP` locale and `ja-JP-Ayumi-Apollo` voice.    | `sha256:ba2042523ea1fff9d2c8b805ac36075169c3aecce0c965d09e326c06eab5a36f` |
| `ja-jp-harukarus`                           | Container image with the `ja-JP` locale and `ja-JP-HarukaRUS` voice.       | `sha256:fdbc8f59fc1c4b52c11d248ee9a5d7fe4e58343f036e558fbb33282e24d5b71f` |
| `ja-jp-ichiro-apollo`                       | Container image with the `ja-JP` locale and `ja-JP-Ichiro-Apollo` voice.   | `sha256:08ea0ed61ac152dc5caea2d4cacc81175c272cb4a835eecaa7f8e7c5485740b7` |
| `ko-kr-heamirus`                            | Container image with the `ko-KR` locale and `ko-KR-HeamiRUS` voice.        | `sha256:40ff95e5fb92278e369b4f37d7dbb109431ecb115b1b9516aa887e6bb4fd030b` |
| `ms-my-rizwan`                              | Container image with the `ms-MY` locale and `ms-MY-Rizwan` voice.          | `sha256:70cfe68a81ee860136cfaed35909f522c28c20ef5514c2d9d96c283892f8b7f5` |
| `nb-no-huldarus`                            | Container image with the `nb-NO` locale and `nb-NO-HuldaRUS` voice.        | `sha256:9941cda0e65884900532e6a0ba68e475f373277105594bf09e67225450192d3c` |
| `nl-nl-hannarus`                            | Container image with the `nl-NL` locale and `nl-NL-HannaRUS` voice.        | `sha256:c71d980dfc70575421d1589c74e8b3e7cc036551412d0ad0f89dbc543252a405` |
| `pl-pl-paulinarus`                          | Container image with the `pl-PL` locale and `pl-PL-PaulinaRUS` voice.      | `sha256:e5fbd98a70eb1dcf80c446b48b8f17e47ac12853bb255f0aed174c78196de257` |
| `pt-br-daniel-apollo`                       | Container image with the `pt-BR` locale and `pt-BR-Daniel-Apollo` voice.   | `sha256:9f57f9847f2372fa341cf037410ac68ada1c3075ab9b77cffbcf01d199f7c1f5` |
| `pt-br-heloisarus`                          | Container image with the `pt-BR` locale and `pt-BR-HeloisaRUS` voice.      | `sha256:ef546532c582392e6ed47df55c0fbfa6dca6d3e523547089263b57354a4efb1a` |
| `pt-pt-heliarus`                            | Container image with the `pt-PT` locale and `pt-PT-HeliaRUS` voice.        | `sha256:116aefb76ddf39bed379c023c8260d2607314ad1b31ddef83ec2818ad9805a0b` |
| `ro-ro-andrei`                              | Container image with the `ro-RO` locale and `ro-RO-Andrei` voice.          | `sha256:6968fdefdd798adab48faeb40857c8cdca55712dbf4806703e11ccdfab874051` |
| `ru-ru-ekaterinarus`                        | Container image with the `ru-RU` locale and `ru-RU-EkaterinaRUS` voice.    | `sha256:48add20e3c147fb4be26c948841a12736c8b10d053aa7d25984df8e4016e939f` |
| `ru-ru-irina-apollo`                        | Container image with the `ru-RU` locale and `ru-RU-Irina-Apollo` voice.    | `sha256:ce5c055aedb3f9323f41a9de8d8f3dd23fb2ad0621d499f914f5cb3856e995f3` |
| `ru-ru-pavel-apollo`                        | Container image with the `ru-RU` locale and `ru-RU-Pavel-Apollo` voice.    | `sha256:badc02f9ccdee13ab7dbd4e178bd5c57d332cc3acd2d4a9a3f889d317e0517be` |
| `sk-sk-filip`                               | Container image with the `sk-SK` locale and `sk-SK-Filip` voice.           | `sha256:763d4fe74b6f04a976482880eed76175854f659bb5bfcb315dce8ef69acead2e` |
| `sl-si-lado`                                | Container image with the `sl-SI` locale and `sl-SI-Lado` voice.            | `sha256:73374363f9b69e03b8b9de34b319d7797876a3dae40bdce0830a67cf4bb4d4f2` |
| `sv-se-hedvigrus`                           | Container image with the `sv-SE` locale and `sv-SE-HedvigRUS` voice.       | `sha256:317d6b5d69f56c9087cd1e8004e60a48841b997937dcdccc97e7c0b2e2ffb631` |
| `ta-in-valluvar`                            | Container image with the `ta-IN` locale and `ta-IN-Valluvar` voice.        | `sha256:d1aaad1d5f32a910e245e6c117178c0703d39035e4053fe2dd2bb646fc02f7b8` |
| `te-in-chitra`                              | Container image with the `te-IN` locale and `te-IN-Chitra` voice.          | `sha256:0224ac3b2de11c4f6ef65ce0bdcd1b9c4112ea472b3bd5626fdff47a5185f54c` |
| `th-th-pattara`                             | Container image with the `th-TH` locale and `th-TH-Pattara` voice.         | `sha256:16c7384bfe210f30e09eae3542a58ff9bdbfa9253fdf4d380a53b37809f82c7d` |
| `tr-tr-sedarus`                             | Container image with the `tr-TR` locale and `tr-TR-SedaRUS` voice.         | `sha256:5c7786c00a66346438ee4065e3eaa03ef9f8323ba839068344492b8a3b6d997a` |
| `vi-vn-an`                                  | Container image with the `vi-VN` locale and `vi-VN-An` voice.              | `sha256:6925744597c45eed8761a9597f3525f435dd420b67ff775a73211fdef9cd9cb2` |
| `zh-cn-huihuirus`                           | Container image with the `zh-CN` locale and `zh-CN-HuihuiRUS` voice.       | `sha256:b38a3f465062853b171d2bce6c6d8afa14d223e24bfd5ea0827e34c26a09a2c8` |
| `zh-cn-kangkang-apollo`                     | Container image with the `zh-CN` locale and `zh-CN-Kangkang-Apollo` voice. | `sha256:fa9555e2f520340457d5cebe469af40516237fb9398a5f90046565655b2862f8` |
| `zh-cn-yaoyao-apollo`                       | Container image with the `zh-CN` locale and `zh-CN-Yaoyao-Apollo` voice.   | `sha256:d7eeca43e45d09a1c22611f865fb1f8b42673688a11a2acffd37a4e08a7fd8c4` |
| `zh-hk-danny-apollo`                        | Container image with the `zh-HK` locale and `zh-HK-Danny-Apollo` voice.    | `sha256:ee7257c0179fbe015324b4d29f16fe93964e5f1901906240477fb1d820a500f2` |
| `zh-hk-tracy-apollo`                        | Container image with the `zh-HK` locale and `zh-HK-Tracy-Apollo` voice.    | `sha256:dfa4effbf7d0ec6c9130c142241b3e247e226e13dc218fd44f986ca1c7fff2ed` |
| `zh-hk-tracyrus`                            | Container image with the `zh-HK` locale and `zh-HK-TracyRUS` voice.        | `sha256:dfa4effbf7d0ec6c9130c142241b3e247e226e13dc218fd44f986ca1c7fff2ed` |
| `zh-tw-hanhanrus`                           | Container image with the `zh-TW` locale and `zh-TW-HanHanRUS` voice.       | `sha256:263153fd6e05970e04af9a9bd95fb13591f0138ac030a632a6a78d95936afa4b` |
| `zh-tw-yating-apollo`                       | Container image with the `zh-TW` locale and `zh-TW-Yating-Apollo` voice.   | `sha256:b8289bb550b9328d83d6a7ec93bdf9524087222f537a55db0b2eb5402c2bf663` |
| `zh-tw-zhiwei-apollo`                       | Container image with the `zh-TW` locale and `zh-TW-Zhiwei-Apollo` voice.   | `sha256:af4bc0ef2211f69a92541bb14596341375e1003aef541aefcea7843192046b4c` |

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


## Next steps

> [!div class="nextstepaction"]
> [Try out prebuilt neural voice](text-to-speech.md)
> [Prebuilt neural voice containers](../containers/container-image-tags.md)
> [How to install and run Docker containers](speech-container-howto.md)
