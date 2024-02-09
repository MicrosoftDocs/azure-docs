---
title: Sovereign Clouds - Speech service
titleSuffix: Azure AI services
description: Learn how to use Sovereign Clouds
author: alexeyo26
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.custom: references_regions
ms.date: 11/17/2023
ms.author: alexeyo
---

# Speech service in sovereign clouds

## Azure Government (United States)

Available to US government entities and their partners only. See more information about Azure Government [here](../../azure-government/documentation-government-welcome.md) and [here.](../../azure-government/compare-azure-government-global-azure.md)

- **Azure portal:**
  - [https://portal.azure.us/](https://portal.azure.us/)
- **Regions:**
  - US Gov Arizona
  - US Gov Virginia
- **Available pricing tiers:**
  - Free (F0) and Standard (S0). See more details [here](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/)
- **Supported features:**
  - Speech to text
    - Custom speech (Acoustic Model (AM) and Language Model (LM) adaptation)
      - [Speech Studio](https://speech.azure.us/)
  - Text to speech
    - Standard voice
    - Neural voice
  - Speech translation
- **Unsupported features:**
  - Custom commands
  - Custom neural voice
  - Personal voice
  - Text to speech avatar
- **Supported languages:**
  - See the list of supported languages [here](language-support.md)

### Endpoint information

This section contains Speech service endpoint information for the usage with [Speech SDK](speech-sdk.md), [Speech to text REST API](rest-speech-to-text.md), and [Text to speech REST API](rest-text-to-speech.md).

#### Speech service REST API

Speech service REST API endpoints in Azure Government have the following format:

|  REST API type / operation | Endpoint format |
|--|--|
| Access token | `https://<REGION_IDENTIFIER>.api.cognitive.microsoft.us/sts/v1.0/issueToken`
| [Speech to text REST API](rest-speech-to-text.md) | `https://<REGION_IDENTIFIER>.api.cognitive.microsoft.us/<URL_PATH>` |
| [Speech to text REST API for short audio](rest-speech-to-text-short.md) | `https://<REGION_IDENTIFIER>.stt.speech.azure.us/<URL_PATH>` |
| [Text to speech REST API](rest-text-to-speech.md) | `https://<REGION_IDENTIFIER>.tts.speech.azure.us/<URL_PATH>` |

Replace `<REGION_IDENTIFIER>` with the identifier matching the region of your subscription from this table:

|                     | Region identifier |
|--|--|
| **US Gov Arizona**  | `usgovarizona` |
| **US Gov Virginia** | `usgovvirginia` |

#### Speech SDK

For [Speech SDK](speech-sdk.md) in sovereign clouds you need to use "from host / with host" instantiation of `SpeechConfig` class or `--host` option of [Speech CLI](spx-overview.md). (You may also use "from endpoint / with endpoint" instantiation and `--endpoint` Speech CLI option).

`SpeechConfig` class should be instantiated like this:

# [C#](#tab/c-sharp)
```csharp
var config = SpeechConfig.FromHost(usGovHost, subscriptionKey);
```
# [C++](#tab/cpp)
```cpp
auto config = SpeechConfig::FromHost(usGovHost, subscriptionKey);
```
# [Java](#tab/java)
```java
SpeechConfig config = SpeechConfig.fromHost(usGovHost, subscriptionKey);
```
# [Python](#tab/python)
```python
import azure.cognitiveservices.speech as speechsdk
speech_config = speechsdk.SpeechConfig(host=usGovHost, subscription=subscriptionKey)
```
# [Objective-C](#tab/objective-c)
```objectivec
SPXSpeechConfiguration *speechConfig = [[SPXSpeechConfiguration alloc] initWithHost:usGovHost subscription:subscriptionKey];
```
***

Speech CLI should be used like this (note the `--host` option):
```dos
spx recognize --host "usGovHost" --file myaudio.wav
```
Replace `subscriptionKey` with your Speech resource key. Replace `usGovHost` with the expression matching the required service offering and the region of your subscription from this table:

|  Region / Service offering | Host expression |
|--|--|
| **US Gov Arizona** | |
| Speech to text | `wss://usgovarizona.stt.speech.azure.us` |
| Text to speech | `https://usgovarizona.tts.speech.azure.us` |
| **US Gov Virginia** | |
| Speech to text | `wss://usgovvirginia.stt.speech.azure.us` |
| Text to speech | `https://usgovvirginia.tts.speech.azure.us` |


## Microsoft Azure operated by 21Vianet

Available to organizations with a business presence in China. See more information about Microsoft Azure operated by 21Vianet [here](/azure/china/overview-operations). 

- **Azure portal:**
  - [https://portal.azure.cn/](https://portal.azure.cn/)
- **Regions:**
  - China East 2
  - China North 2
  - China North 3
- **Available pricing tiers:**
  - Free (F0) and Standard (S0). See more details [here](https://www.azure.cn/pricing/details/cognitive-services/index.html)
- **Supported features:**
  - Speech to text
    - Custom speech (Acoustic Model (AM) and Language Model (LM) adaptation)
      - [Speech Studio](https://speech.azure.cn/)
    - [Pronunciation assessment](how-to-pronunciation-assessment.md)
  - Text to speech
    - Standard voice
    - Neural voice
  - Speech translator
- **Unsupported features:**
  - Custom commands
  - Custom neural voice
  - Personal voice
  - Text to speech avatar
- **Supported languages:**
  - See the list of supported languages [here](language-support.md)

### Endpoint information

This section contains Speech service endpoint information for the usage with [Speech SDK](speech-sdk.md), [Speech to text REST API](rest-speech-to-text.md), and [Text to speech REST API](rest-text-to-speech.md).

#### Speech service REST API

Speech service REST API endpoints in Azure operated by 21Vianet have the following format:

|  REST API type / operation | Endpoint format |
|--|--|
| Access token | `https://<REGION_IDENTIFIER>.api.cognitive.azure.cn/sts/v1.0/issueToken`
| [Speech to text REST API](rest-speech-to-text.md) | `https://<REGION_IDENTIFIER>.api.cognitive.azure.cn/<URL_PATH>` |
| [Speech to text REST API for short audio](rest-speech-to-text-short.md) | `https://<REGION_IDENTIFIER>.stt.speech.azure.cn/<URL_PATH>` |
| [Text to speech REST API](rest-text-to-speech.md) | `https://<REGION_IDENTIFIER>.tts.speech.azure.cn/<URL_PATH>` |

Replace `<REGION_IDENTIFIER>` with the identifier matching the region of your subscription from this table:

|                     | Region identifier |
|--|--|
| **China East 2**  | `chinaeast2` |
| **China North 2**  | `chinanorth2` |
| **China North 3**  | `chinanorth3` |

#### Speech SDK

For [Speech SDK](speech-sdk.md) in sovereign clouds you need to use "from host / with host" instantiation of `SpeechConfig` class or `--host` option of [Speech CLI](spx-overview.md). (You may also use "from endpoint / with endpoint" instantiation and `--endpoint` Speech CLI option).

`SpeechConfig` class should be instantiated like this:

# [C#](#tab/c-sharp)
```csharp
var config = SpeechConfig.FromHost("azCnHost", subscriptionKey);
```
# [C++](#tab/cpp)
```cpp
auto config = SpeechConfig::FromHost("azCnHost", subscriptionKey);
```
# [Java](#tab/java)
```java
SpeechConfig config = SpeechConfig.fromHost("azCnHost", subscriptionKey);
```
# [Python](#tab/python)
```python
import azure.cognitiveservices.speech as speechsdk
speech_config = speechsdk.SpeechConfig(host="azCnHost", subscription=subscriptionKey)
```
# [Objective-C](#tab/objective-c)
```objectivec
SPXSpeechConfiguration *speechConfig = [[SPXSpeechConfiguration alloc] initWithHost:"azCnHost" subscription:subscriptionKey];
```
***

Speech CLI should be used like this (note the `--host` option):
```dos
spx recognize --host "azCnHost" --file myaudio.wav
```
Replace `subscriptionKey` with your Speech resource key. Replace `azCnHost` with the expression matching the required service offering and the region of your subscription from this table:

|  Region / Service offering | Host expression |
|--|--|
| **China East 2** | |
| Speech to text | `wss://chinaeast2.stt.speech.azure.cn` |
| Text to speech | `https://chinaeast2.tts.speech.azure.cn` |
| **China North 2** | |
| Speech to text | `wss://chinanorth2.stt.speech.azure.cn` |
| Text to speech | `https://chinanorth2.tts.speech.azure.cn` |
| **China North 3** | |
| Speech to text | `wss://chinanorth3.stt.speech.azure.cn` |
| Text to speech | `https://chinanorth3.tts.speech.azure.cn` |
