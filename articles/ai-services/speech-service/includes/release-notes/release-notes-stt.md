---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 01/09/2023
ms.author: eur
---

### August 2023 release

#### Pronunciation Assessment

- Speech [Pronunciation Assessment](../../how-to-pronunciation-assessment.md) now supports 3 additional languages generally available in English (Canada), English (India), and French (Canada), with 3 additional languages available in preview. For more information, see the full [language list for Pronunciation Assessment](../../language-support.md?tabs=pronunciation-assessment).

  | Language | Locale (BCP-47) | 
  |--|--|
  |Arabic (Saudi Arabia)|`ar-SA`<sup>1</sup> |
  |Chinese (Mandarin, Simplified)|`zh-CN`|
  |English (Australia)|`en-AU`|
  |English (Canada)|`en-CA` |
  |English (India)|`en-IN` |
  |English (United Kingdom)|`en-GB`|
  |English (United States)|`en-US`|  
  |French (Canada)|`fr-CA`| 
  |French (France)|`fr-FR`|  
  |German (Germany)|`de-DE`|
  |Italian (Italy)|`it-IT`<sup>1</sup>|
  |Japanese (Japan)|`ja-JP`|
  |Korean (Korea)|`ko-KR`<sup>1</sup>|
  |Malay (Malaysia)|`ms-MY`<sup>1</sup>|
  |Norwegian Bokmål (Norway)|`nb-NO`<sup>1</sup>|
  |Portuguese (Brazil)|`pt-BR`<sup>1</sup>|
  |Russian (Russia)|`ru-RU`<sup>1</sup>|
  |Spanish (Mexico)|`es-MX` | 
  |Spanish (Spain)|`es-ES` | 
  |Tamil (India)|`ta-IN`<sup>1</sup> | 
  |Vietnamese (Vietnam)|`vi-VN`<sup>1</sup> |

  <sup>1</sup> The language is in public preview for pronunciation assessment.

### May 2023 release

#### Pronunciation Assessment

- Speech [Pronunciation Assessment](../../how-to-pronunciation-assessment.md) now supports 3 additional languages generally available in German (Germany), Japanese (Japan), and Spanish (Mexico), with 4 additional languages available in preview. For more information, see the full [language list for Pronunciation Assessment](../../language-support.md?tabs=pronunciation-assessment).
- You can now use the standard Speech to Text commitment tier for pronunciation assessment on all public regions. If you purchase a commitment tier for standard Speech to text, the spend for pronunciation assessment goes towards meeting the commitment. See [commitment tier pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services). 

### February 2023 release

#### Pronunciation Assessment

- Speech [Pronunciation Assessment](../../how-to-pronunciation-assessment.md) now supports 5 additional languages generally available in English (United Kingdom), English (Australia), French (France), Spanish (Spain), and Chinese (Mandarin, Simplified), with other languages available in preview. 
- Added sample codes showing how to use Pronunciation Assessment in streaming mode in your own application.
  - **C#**: See [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/csharp/sharedcontent/console/speech_recognition_samples.cs#:~:text=PronunciationAssessmentWithStream).
  - **C++**: See [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/cpp/windows/console/samples/speech_recognition_samples.cpp#:~:text=PronunciationAssessmentWithStream).
  - **java**: See [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/java/android/sdkdemo/app/src/main/java/com/microsoft/cognitiveservices/speech/samples/sdkdemo/MainActivity.java#L548).
  - **javascript**: See [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/js/node/pronunciationAssessment.js).
  - **Objective-C**: See [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/objective-c/ios/speech-samples/speech-samples/ViewController.m#L831).
  - **Python**: See [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/python/console/speech_sample.py#L915).
  - **Swift**: See [sample code](https://github.com/Azure-Samples/cognitive-services-speech-sdk/blob/master/samples/swift/ios/speech-samples/speech-samples/ViewController.swift#L191).

#### Custom Speech

Support for audio + human-labeled transcript is added for the `de-AT` locales.

### January 2023 release

#### Custom Speech

Support for audio + human-labeled transcript is added for additional locales: `ar-BH`, `ar-DZ`, `ar-EG`, `ar-MA`, `ar-SA`, `ar-TN`, `ar-YE`, and `ja-JP`.

Support for structured text adaptation is added for locale `de-AT`.

### December 2022 release

#### Speech to text REST API

The Speech to text REST API version 3.1 is generally available. Version 3.0 of the [Speech to text REST API](../../rest-speech-to-text.md) will be retired. For more information about how to migrate, see the [guide](../../migrate-v3-0-to-v3-1.md).

### October 2022 release

#### New speech to text locale

Added support for Malayalam (India) with the `ml-IN` locale. See the complete language list [here](../../language-support.md?tabs=stt).


### July 2022 release

#### New Speech to text-locales:

Added 7 new locales as shown in the following table. See the complete language list [here](../../language-support.md?tabs=stt).

| Locale  | Language                          |
|---------|-----------------------------------|
| `bs-BA`         | Bosnian (Bosnia and Herzegovina) |
| `yue-CN`        | Chinese (Cantonese, Simplified)  |
| `zh-CN-sichuan` | Chinese (Southwestern Mandarin, Simplified) |
| `wuu-CN`        | Chinese (Wu, Simplified)  |
| `ps-AF`         | Pashto (Afghanistan)      |
| `so-SO`         | Somali (Somalia)          |
| `cy-GB`         | Welsh (United Kingdom)    |


### June 2022 release

#### New Speech to text-locales:

Added 10 new locales as shown in the following table. See the complete language list [here](../../language-support.md?tabs=stt).

| Locale  | Language                          |
|---------|-----------------------------------|
| `sq-AL`         | Albanian (Albania)                |
|  `hy-AM`         | Armenian (Armenia)                |
|  `az-AZ`         | Azerbaijani (Azerbaijan)          |
|  `eu-ES`         | Basque (Spain)                    |
|  `gl-ES`         | Galician (Spain)                  |
| `ka-GE`         | Georgian (Georgia)                |
|  `it-CH`         | Italian (Switzerland)             |
|  `kk-KZ`         | Kazakh (Kazakhstan)               |
|  `mn-MN`         | Mongolian (Mongolia)              |
|  `ne-NP`         | Nepali (Nepal)                    |


### April 2022 release

#### New Speech to text-locales:

Below is a list of the new locales. See the complete language list [here](../../language-support.md?tabs=stt).

| Locale  | Language                          |
|---------|-----------------------------------|
| `bn-IN` | Bengali (India)                   |


### January 2022 release

#### New Speech to text-locales:

Below is a list of the new locales. See the complete language list [here](../../language-support.md?tabs=stt).

| Locale  | Language                          |
|---------|-----------------------------------|
| `af-ZA` | Afrikaans (South Africa)            |
| `am-ET` | Amharic (Ethiopia)            |
| `de-CH` | German (Switzerland)            |
| `fr-BE` | French (Belgium)            |
| `is-IS` | Icelandic (Iceland)            |
| `jv-ID` | Javanese (Indonesia)            |
| `km-KH` | Khmer (Cambodia)            |
| `kn-IN` | Kannada (India)            |
| `lo-LA` | Lao (Laos)            |
| `mk-MK` | Macedonian (North Macedonia)            |
| `my-MM` | Burmese (Myanmar)            |
| `nl-BE` | Dutch (Belgium)            |
| `si-LK` | Sinhala (Sri Lanka)            |
| `sr-RS` | Serbian (Serbia)            |
| `sw-TZ` | Swahili (Tanzania)            |
| `uk-UA` | Ukrainian (Ukraine)            |
| `uz-UZ` | Uzbek (Uzbekistan)            |
| `zu-ZA` | Zulu (South Africa)            |


### July 2021 release

#### New Speech to text-locales:

Below is a list of the new locales. See the complete language list [here](../../language-support.md?tabs=stt).

| Locale  | Language                          |
|---------|-----------------------------------|
| `ar-DZ` | Arabic (Algeria)            |
| `ar-LY` | Arabic (Libya)            |
| `ar-MA` | Arabic (Morocco)            |
| `ar-TN` | Arabic (Tunisia)            |
| `ar-YE` | Arabic (Yemen)            |
| `bg-BG` | Bulgarian (Bulgaria)            |
| `el-GR` | Greek (Greece)            |
| `et-EE` | Estonian (Estonia)            |
| `fa-IR` | Persian  (Iran)            |
| `ga-IE` | Irish (Ireland)            |
| `hr-HR` | Croatian (Croatia)            |
| `lt-LT` | Lithuanian (Lithuania)            |
| `lv-LV` | Latvian (Latvia)            |
| `mt-MT` | Maltese (Malta)            |
| `ro-RO` | Romanian (Romania)            |
| `sk-SK` | Slovak (Slovakia)            |
| `sl-SI` | Slovenian (Slovenia)            |
| `sw-KE` | Swahili  (Kenya)            |


### January 2021 release

#### New Speech to text-locales:

Below is a list of the new locales. See the complete language list [here](../../language-support.md?tabs=stt).

| Locale  | Language                          |
|---------|-----------------------------------|
| `ar-AE` | Arabic (United Arab Emirates)            |
| `ar-IL` | Arabic (Israel)            |
| `ar-IQ` | Arabic (Iraq)            |
| `ar-OM` | Arabic (Oman)            |
| `ar-PS` | Arabic (Palestinian Authority)            |
| `de-AT` | German (Austria)            |
| `en-GH` | English (Ghana)            |
| `en-KE` | English (Kenya)               |
| `en-NG` | English (Nigeria)            |
| `en-TZ` | English (Tanzania)            |
| `es-GQ` | Spanish (Equatorial Guinea)            |
| `fil-PH` | Filipino  (Philippines)            |
| `fr-CH` | French  (Switzerland)            |
| `he-IL` | Hebrew  (Israel)            |
| `id-ID` | Indonesian  (Indonesia)            |
| `ms-MY` | Malay  (Malaysia)            |
| `vi-VN` | Vietnamese  (Vietnam)            |

### August 2020 Release

#### New speech to text locales:
Speech to text released 26 new locales in August: 2 European languages `cs-CZ` and `hu-HU`, 5 English locales and 19 Spanish locales that cover most South American countries/regions. Below is a list of the new locales. See the complete language list [here](../../language-support.md?tabs=stt).

| Locale  | Language                          |
|---------|-----------------------------------|
| `cs-CZ` | Czech (Czech Republic)            |
| `en-HK` | English (Hong Kong Special Administrative Region)               |
| `en-IE` | English (Ireland)                 |
| `en-PH` | English (Philippines)             |
| `en-SG` | English (Singapore)               |
| `en-ZA` | English (South Africa)            |
| `es-AR` | Spanish (Argentina)               |
| `es-BO` | Spanish (Bolivia)                 |
| `es-CL` | Spanish (Chile)                   |
| `es-CO` | Spanish (Colombia)                |
| `es-CR` | Spanish (Costa Rica)              |
| `es-CU` | Spanish (Cuba)                    |
| `es-DO` | Spanish (Dominican Republic)      |
| `es-EC` | Spanish (Ecuador)                 |
| `es-GT` | Spanish (Guatemala)               |
| `es-HN` | Spanish (Honduras)                |
| `es-NI` | Spanish (Nicaragua)               |
| `es-PA` | Spanish (Panama)                  |
| `es-PE` | Spanish (Peru)                    |
| `es-PR` | Spanish (Puerto Rico)             |
| `es-PY` | Spanish (Paraguay)                |
| `es-SV` | Spanish (El Salvador)             |
| `es-US` | Spanish (USA)                     |
| `es-UY` | Spanish (Uruguay)                 |
| `es-VE` | Spanish (Venezuela)               |
| `hu-HU` | Hungarian (Hungary)               |

