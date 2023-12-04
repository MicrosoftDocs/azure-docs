---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 10/2/2023
ms.author: eur
---

### 2023-November release

Add support for the latest model versions:
- Custom speech to text 4.5.0
- Speech to text 4.5.0
- Neural text to speech 2.19.0

Vulnerability issues

### 2023-October release

Add support for the latest model versions:
- Custom speech to text 4.4.0
- Speech to text 4.4.0
- Neural text to speech 2.18.0

Fix a bunch of high risk vulnerability issues.

Remove redundant logs in containers.

Upgrade internal media component to the latest.

Add support for voice `en-IN-NeerjaNeural`.

### 2023-September release

Add support for the latest model versions:
- Speech language identification 1.12.0
- Custom speech to text 4.3.0
- Speech to text 4.3.0
- Neural text to speech 2.17.0

Upgrade custom speech to text and speech to text to the latest framework.

Fix vulnerability issues.

Add support for voice `ar-AE-FatimaNeural`.

### 2023-July release

Add support for the latest model versions:
- Custom speech to text 4.1.0
- Speech to text 4.1.0
- Neural text to speech 2.15.0

Fix the issue of running speech to text container via `docker` mount options with local custom model files.

Fix the issue that in some cases the `RECOGNIZING` event does not show up in response through the Speech SDK.

Fix vulnerability issues.

### 2023-June release

Add support for the latest model versions:
- Custom speech to text 4.0.0
- Speech to text 4.0.0
- Neural text to speech 2.14.0

On-premises speech to text images are upgraded to .NET 6.0

Upgrade display models for locales including `en-us`, `ar-eg`, `ar-bh`, `ja-jp`, `ko-kr`, and more.

Upgrade the speech to text container component to address vulnerability issues.

Add support for locale voices `de-DE-AmalaNeural`,`de-AT-IngridNeural`,`de-AT-JonasNeural`, and `en-US-JennyMultilingualNeural`

### 2023-May release

Add support for the latest model versions:
- Custom speech to text 3.14.0
- Speech to text 3.14.0
- Neural text to speech 2.13.0

Fix the `he-IL` punctuation issue

Fix vulnerability issues

Add new locale voice `en-US-MichelleNeural`and `es-MX-CandelaNeural`

### 2023-April release

Security Updates

Fix vulnerability issues

### 2023-March release
	
Add support for the latest model versions:
- Custom speech to text 3.12.0
- Speech to text 3.12.0
- Speech language identification 1.11.0
- Neural text to speech 2.11.0

Fix vulnerability issues

Fix the `tr-TR` capitalization issue

Upgrade the speech to text `en-US` display models

Add support for prebuilt neural Neural text to speech locale voice `ar-AE-HamdanNeural`

### 2023-February release

#### New container versions

Add support for latest model versions:
- Custom speech to text 3.11.0
- Speech to text 3.11.0
- Neural text to speech 2.10.0

Fix vulnerability issues

Regular upgrade for speech models

Add new Abraic locales:
- ar-IL
- ar-PS

Upgrade Hebrew and Turkish display models

### 2023-January release

#### New container versions

Add support for latest model versions:
- Custom speech to text 3.10.0
- Speech to text 3.10.0
- Neural text to speech 2.9.0

Fix Hypothesis mode issue

Fix HTTP Proxy issue

Custom Speech to text container disconnected mode

Add CNV Disconnected container support to TTS Frontend

Add support for these locale-voices:
- da-DK-ChristelNeural
- da-DK-JeppeNeural
- en-IN-PrabhatNeural

### 2022-December release

#### New container versions

Add support for latest model versions:
- Custom speech to text 3.9.0
- Speech to text 3.9.0
- Neural text to speech 2.8.0

Fix ipv4/ipv6 issue

Fix vulnerability issue

### 2022-November release

#### New container versions

Add support for latest model versions:
- Custom speech to text 3.8.0
- Speech to text 3.8.0
- Neural text to speech 2.7.0

### 2022-October release

#### New container versions

Add support for latest model versions:
- Custom speech to text 3.7.0
- Speech to text 3.7.0
- Neural text to speech 2.6.0

### 2022-September release

#### Speech to text 3.6.0-amd64

Add support for latest model versions.

Add support for these locales:
  * az-az
  * bn-in
  * bs-ba
  * cy-gb
  * eu-es
  * fa-ir
  * gl-es
  * he-il
  * hy-am
  * it-ch
  * ka-ge
  * kk-kz
  * mk-mk
  * mn-mn
  * ne-np
  * ps-af
  * so-so
  * sq-al
  * wuu-cn
  * yue-cn
  * zh-cn-sichuan

Regular monthly updates including security upgrades and vulnerability fixes.

#### Custom Speech to text 3.6.0-amd64

Regular monthly updates including security upgrades and vulnerability fixes.

#### Neural Neural text to speech v2.5.0

Add support for these [prebuilt neural voices](../../language-support.md?tabs=tts):
   * `az-az-babekneural`
   * `az-az-banuneural`
   * `fa-ir-dilaraneural`
   * `fa-ir-faridneural`
   * `fil-ph-angeloneural`
   * `fil-ph-blessicaneural`
   * `he-il-avrineural`
   * `he-il-hilaneural`
   * `id-id-ardineural`
   * `id-id-gadisneural`
   * `ka-ge-ekaneural`
   * `ka-ge-giorgineural`

Regular monthly updates including security upgrades and vulnerability fixes.

### 2022-May release

#### Speech-language-detection Container v1.9.0-amd64-preview

Bug fixes for [speech-language-detection](~/articles/ai-services/speech-service/speech-container-howto.md).

### 2022-March release

#### Custom speech to text Container v3.1.0
Add support to [get display models](../../speech-container-cstt.md#display-model-download).

### 2022-January release

#### Speech to text Container v3.0.0
Add support for using containers in [disconnected environments](../../../containers/disconnected-containers.md).

#### Speech to text Container v2.18.0
Regular monthly updates including security upgrades and vulnerability fixes.

#### Neural-Neural text to speech Container v1.12.0
Add support for these prebuilt neural voices: `am-et-amehaneural`, `am-et-mekdesneural`, `so-so-muuseneural` and `so-so-ubaxneural`.

Regular monthly updates including security upgrades and vulnerability fixes.

