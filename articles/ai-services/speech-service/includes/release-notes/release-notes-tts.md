---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 02/28/2023
ms.author: eur
---

### November 2023 release

#### Personal voice

Personal voice is available in preview in the following regions: West Europe, East US, and South East Asia. With personal voice (preview), you can get AI generated replication of your voice (or users of your application) in a few seconds. You provide a one-minute speech sample as the audio prompt, and then use it to generate speech in any of the more than 90 languages supported across more than 100 locales.  

For more information, see [personal voice](../../personal-voice-overview.md).

#### Text to speech avatar

Text to speech avatar is available in preview in the following regions: West US 2, West Europe, and Southeast Asia. 

Text to speech avatar converts text into a digital video of a photorealistic human (either a prebuilt avatar or a [custom text to speech avatar](#custom-text-to-speech-avatar)) speaking with a natural-sounding voice. The text to speech avatar video can be synthesized asynchronously or in real time. Developers can build applications integrated with text to speech avatar through an API, or use a content creation tool on Speech Studio to create video content without coding.

For more information, see [text to speech avatar](../../text-to-speech-avatar/what-is-text-to-speech-avatar.md), [transparency notes](/legal/cognitive-services/speech-service/text-to-speech/transparency-note?context=/azure/ai-services/speech-service/context/context), and [disclosure for voice and avatar talent](/legal/cognitive-services/speech-service/disclosure-voice-talent?context=/azure/ai-services/speech-service/context/context).

#### Custom neural voice

- Added support for the 24 new locales for cross-lingual voice. See the [full language list](../../language-support.md?tabs=tts#custom-neural-voice) for more information.

### October 2023 release

#### Custom neural voice

- Added support for the 12 new locales with Custom Neural Voice Pro. See the [full language list](../../language-support.md?tabs=tts#custom-neural-voice) for more information.

### September 2023 release

#### Prebuilt neural voice
- Introducing new voices for public preview:

| Locale (BCP-47) | Language | Text to speech voices |
| ----- | ----- | ----- |
| `en-US` | English (United States) | `en-US-EmmaNeural` (Female) |
| `en-US` | English (United States) | `en-US-AndrewNeural` (Male) |
| `en-US` | English (United States) | `en-US-BrianNeural` (Male) |

See the [full language and voice list](../../language-support.md?tabs=tts#custom-neural-voice) for more information.

#### Embedded neural voice
- All 147 locales here (except fa-IR, Persian (Iran)) are available out of box with either 1 selected female and/or 1 selected male voices.

### August 2023 release

#### Custom neural voice

- The latest CNV Lite training recipe version has been released now. This release brings several enhancements on the quality of your language models. Try out [Speech Studio](https://aka.ms/speechstudio/customvoice).

### July 2023 release

#### Custom neural voice

- [Multi-style voice](../../how-to-custom-voice-create-voice.md?tabs=multistyle#train-your-custom-neural-voice-model) is generally available.
- Added two new locales in public preview for multi-style voice: `ja-JP` and `zh-CN`. See the [full language and voice list](../../language-support.md?tabs=tts#custom-neural-voice) for more information. Refer to [the preset style list for different languages](../../how-to-custom-voice-create-voice.md?tabs=multistyle#available-preset-styles-across-different-languages).
- [Cross-lingual voice](../../how-to-custom-voice-create-voice.md?tabs=crosslingual#train-your-custom-neural-voice-model) is generally available. 
- Added two new locales for cross-lingual voice: `id-ID` and `nl-NL`. See the [full language and voice list](../../language-support.md?tabs=tts#custom-neural-voice) for more information. 

#### Prebuilt Neural TTS Voices

Introducing new `en-US` gender neutral voice for public preview:

| Locale (BCP-47) | Language | Text to speech voices |
| ----- | ----- | ----- |
| `en-US` | English (United States) | `en-US-BlueNeural` (Neutral) |

Introducing new multilingual voices for public preview:

| Locale (BCP-47) | Language | Text to speech voices |
| ----- | ----- | ----- |
| `en-US` | English (United States) | `en-US-JennyMultilingualV2Neural` (Female) |
| `en-US` | English (United States) | `en-US-RyanMultilingualNeural` (Male) |

The multilingual voices `en-US-JennyMultilingualV2Neural` and `en-US-RyanMultilingualNeural` auto-detect the language of the input text. However, you can still use the `<lang>` element to adjust the speaking language for these voices.

These new multilingual voices can speak in 41 languages and accents: `Arabic (Egypt)`, `Arabic (Saudi Arabia)`, `Catalan`, `Czech (Czechia)`, `Danish (Denmark)`, `German (Austria)`, `German (Switzerland)`, `German (Germany)`, `English (Australia)`, `English (Canada)`, `English (United Kingdom)`, `English (Hong Kong SAR)`, `English (Ireland)`, `English (India)`, `English (United States)`, `Spanish (Spain)`, `Spanish (Mexico)`, `Finnish (Finland)`, `French (Belgium)`, `French (Canada)`, `French (Switzerland)`, `French (France)`, `Hindi (India)`, `Hungarian (Hungary)`, `Indonesian (Indonesia)`, `Italian (Italy)`, `Japanese (Japan)`, `Korean (Korea)`, `Norwegian Bokmål (Norway)`, `Dutch (Belgium)`, `Dutch (Netherlands)`, `Polish (Poland)`, `Portuguese (Brazil)`, `Portuguese (Portugal)`, `Russian (Russia)`, `Swedish (Sweden)`, `Thai (Thailand)`, `Turkish (Türkiye)`, `Chinese (Mandarin, Simplified)`, `Chinese (Cantonese, Traditional)`, `Chinese (Taiwanese Mandarin, Traditional)`.

These multilingual voices don't fully support certain SSML elements, such as break, emphasis, silence, and sub.

> [!IMPORTANT]
> The `en-US-JennyMultilingualV2Neural` voice is provided temporarily in public preview soley for evaluation purposes. It will be removed in the future. 
> 
> In order to speak in a language other than English, the current implementation of the `en-US-JennyMultilingualNeural` voice requires that you set the `<lang xml:lang>` element. We anticipate that during Q4 calendar year 2023, the `en-US-JennyMultilingualNeural` voice will be updated to speak in the language of the input text without the `<lang xml:lang>` element. This will be in parity with the `en-US-JennyMultilingualV2Neural` voice.

Introducing new features in public preview for below voices:
- Added Latin input for Serbian (Serbia) `sr-RS` voices: `sr-latn-RS-SophieNeural` and `sr-latn-RS-NicholasNeural`.
- Added English pronunciation support for Albanian (Albania) `sq-AL` voices: `sq-AL-AnilaNeural` and `sq-AL-IlirNeural`.


### May 2023 release

#### Audio Content Creation

- All prebuilt voices with speaking styles and multi-style custom voices support style degree adjustment.
- Now you can fix the pronunciation of a word by simply speaking the word and recording it. The phonemes can be automatically recognized from your recording. The **Recognize by speaking** feature is now in public previw.

### April 2023 release

#### Prebuilt Neural TTS Voices

- The following features of these voices moved from public preview to GA:

| Style | Text to speech voices |
| ----- | ----- |
| style="chat" | `en-GB-RyanNeural`, `es-MX-JorgeNeural`, and `it-IT-IsabellaNeural`|
| style="cheerful" | `en-GB-RyanNeural`, `en-GB-SoniaNeural`, `es-MX-JorgeNeural`, `fr-FR-DeniseNeural`, `fr-FR-HenriNeural`, and `it-IT-IsabellaNeural` |
| style="sad" | `en-GB-SoniaNeural`, `fr-FR-DeniseNeural` and `fr-FR-HenriNeural` |

- Improve the English pronunciation for `hi-IN`, `ta-IN` and `te-IN` voices, now is flighting in public preview regions

For more information, see the [language and voice list](../../language-support.md?tabs=tts).

### March 2023 release

#### New features

Speech Synthesis Markup Language (SSML) has been updated to support audio effect processor elements that optimize the quality of the synthesized speech output for specific scenarios on devices. Learn more at [speech synthesis markup](../../speech-synthesis-markup-voice.md#use-voice-elements).

#### Custom neural voice

Added support for the `nl-BE` locale with [Custom Neural Voice](../../custom-neural-voice.md) Pro. See the [full language and voice list](../../language-support.md?tabs=tts#custom-neural-voice) for more information.

#### Prebuilt Neural TTS Voices

The following voices are now generally available. See the [full language and voice list](../../language-support.md?tabs=tts) for more information.

| Locale (BCP-47) | Language | Text to speech voices |
| ----- | ----- | ----- |
| `en-AU` | English (Australia) | `en-AU-AnnetteNeural` (Female)<br/>`en-AU-CarlyNeural` (Female)<br/>`en-AU-DarrenNeural` (Male)<br/>`en-AU-DuncanNeural` (Male)<br/>`en-AU-ElsieNeural` (Female)<br/>`en-AU-FreyaNeural` (Female)<br/>`en-AU-JoanneNeural` (Female)<br/>`en-AU-KenNeural` (Male)<br/>`en-AU-KimNeural` (Female)<br/>`en-AU-NeilNeural` (Male)<br/>`en-AU-TimNeural` (Male)<br/>`en-AU-TinaNeural` (Female)<br/>`en-AU-WilliamNeural` (Male) |
| `en-GB` | English (United Kingdom) | `en-GB-RyanNeural` (Male)<br/>`en-GB-SoniaNeural` (Female) |
| `es-ES` | Spanish (Spain) | `es-ES-AbrilNeural` (Female)<br/>`es-ES-ArnauNeural` (Male)<br/>`es-ES-DarioNeural` (Male)<br/>`es-ES-EliasNeural` (Male)<br/>`es-ES-EstrellaNeural` (Female)<br/>`es-ES-IreneNeural` (Female)<br/>`es-ES-LaiaNeural` (Female)<br/>`es-ES-LiaNeural` (Female)<br/>`es-ES-NilNeural` (Male)<br/>`es-ES-SaulNeural` (Male)<br/>`es-ES-TeoNeural` (Male)<br/>`es-ES-TrianaNeural` (Female)<br/>`es-ES-VeraNeural` (Female) |
| `es-MX` | Spanish (Mexico) | `es-MX-JorgeNeural` (Male) |
| `fr-FR` | French (France) | `fr-FR-HenriNeural` (Male) |
| `it-IT` | Italian (Italy) | `it-IT-IsabellaNeural` (Female) |
| `ja-JP` | Japanese (Japan) | `ja-JP-AoiNeural` (Female)<br/>`ja-JP-DaichiNeural` (Male)<br/>`ja-JP-MayuNeural` (Female)<br/>`ja-JP-NaokiNeural` (Male)<br/>`ja-JP-ShioriNeural` (Female) |

Added support for the `cheerful` style with the `de-DE-ConradNeural` voice.

### February 2023 release

#### Prebuilt Neural TTS Voices

The following voices are now generally available. See the [full language and voice list](../../language-support.md?tabs=tts) for more information.

| Locale (BCP-47) | Language | Text to speech voices |
| ----- | ----- | ----- | 
| `zh-CN` | Chinese (Mandarin, Simplified) | `zh-CN-XiaomengNeural` (Female)<br/>`zh-CN-XiaoyiNeural` (Female)<br/>`zh-CN-XiaozhenNeural` (Female)<br/>`zh-CN-YunfengNeural` (Male)<br/>`zh-CN-YunhaoNeural` (Male)<br/>`zh-CN-YunjianNeural` (Male)<br/>`zh-CN-YunxiaNeural` (Male)<br/>`zh-CN-YunzeNeural` (Male) |
| `zh-CN-henan` | Chinese (Zhongyuan Mandarin Henan, Simplified) | `zh-CN-henan-YundengNeural` (Male) |

### December 2022 release

#### Batch synthesis REST API (Preview)

The Batch synthesis API is currently in public preview. Once it's generally available, the Long Audio API will be deprecated. For more information, see [Migrate to batch synthesis API](../../migrate-to-batch-synthesis.md).

### November 2022 release

#### Prebuilt Neural TTS Voices (GA)

The following voices are now generally available. See the [full language and voice list](../../language-support.md?tabs=tts) for more information.

| Locale (BCP-47) | Language | Text to speech voices |
| ----- | ----- | ----- |
| `es-MX` | Spanish (Mexico) | `es-MX-BeatrizNeural` (Female)<br/> `es-MX-CandelaNeural` (Female)<br/> `es-MX-CarlotaNeural` (Female)<br/>`es-MX-CecilioNeural` (Male)<br/>`es-MX-GerardoNeural` (Male)<br/>`es-MX-LarissaNeural` (Female)<br/>`es-MX-LibertoNeural` (Male)<br/>`es-MX-LucianoNeural` (Male)<br/>`es-MX-MarinaNeural` (Female)<br/>`es-MX-NuriaNeural` (Female)<br/>`es-MX-PelayoNeural` (Male)<br/>`es-MX-RenataNeural` (Female)<br/>`es-MX-YagoNeural` (Male) | 
| `it-IT` | Italian (Italy) | `it-IT-BenignoNeural` (Male)<br/>`it-IT-CalimeroNeural` (Male)<br/>`it-IT-CataldoNeural` (Male)<br/>`it-IT-FabiolaNeural` (Female)<br/>`it-IT-FiammaNeural` (Female)<br/>`it-IT-GianniNeural` (Male)<br/>`it-IT-ImeldaNeural` (Female)<br/>`it-IT-IrmaNeural` (Female)<br/>`it-IT-LisandroNeural` (Male)<br/>`it-IT-PalmiraNeural` (Female)<br/>`it-IT-PierinaNeural` (Female)<br/>`it-IT-RinaldoNeural` (Male) | 
| `pt-BR` | Portuguese (Brazil) | `pt-BR-BrendaNeural` (Female)<br/>`pt-BR-DonatoNeural` (Male)<br/>`pt-BR-ElzaNeural` (Female)<br/>`pt-BR-FabioNeural` (Male)<br/>`pt-BR-GiovannaNeural` (Female)<br/>`pt-BR-HumbertoNeural` (Male)<br/>`pt-BR-JulioNeural` (Male)<br/>`pt-BR-LeilaNeural` (Female)<br/>`pt-BR-LeticiaNeural` (Female)<br/>`pt-BR-ManuelaNeural` (Female)<br/>`pt-BR-NicolauNeural` (Male)<br/>`pt-BR-ValerioNeural` (Male)<br/>`pt-BR-YaraNeural` (Female) | 

#### Custom neural voice

The following locale support is added for [Custom Neural Voice](../../custom-neural-voice.md). See the [full language and voice list](../../language-support.md?tabs=tts) for more information.

- Added support for the `fr-BE` locale with Custom Neural Voice Pro. 
- Added support for the `es-ES` locale with Custom Neural Voice Lite.

### October 2022 release

#### Prebuilt Neural TTS Voices (GA)

The following voices are now generally available. See the [full language and voice list](../../language-support.md?tabs=tts) for more information.

| Locale (BCP-47) | Language | Text to speech voices |
| ----- | ----- | ----- | 
| `eu-ES` | Basque | `eu-ES-AinhoaNeural` (Female)<br/>`eu-ES-AnderNeural` (Male) | 
| `hy-AM` | Armenian (Armenia) | `hy-AM-AnahitNeural` (Female)<br/>`hy-AM-HaykNeural` (Male) | 

#### Prebuilt Neural TTS Voices (Preview)

The following voices are now available in public preview. See the [full language and voice list](../../language-support.md?tabs=tts) for more information.

| Locale (BCP-47) | Language | Text to speech voices |
| ----- | ----- | ----- |
| `en-AU` | English (Australia) | `en-AU-AnnetteNeural`(Female)<br/>`en-AU-CarlyNeural`(Female)<br/>`en-AU-DarrenNeural`(Male)<br/>`en-AU-DuncanNeural`(Male)<br/>`en-AU-ElsieNeural`(Female)<br/>`en-AU-FreyaNeural`(Female)<br/>`en-AU-JoanneNeural`(Female)<br/>`en-AU-KenNeural`(Male)<br/>`en-AU-KimNeural`(Female)<br/>`en-AU-NeilNeural`(Male)<br/>`en-AU-TimNeural`(Male)<br/>`en-AU-TinaNeural`(Female) | 
| `es-ES` | Spanish (Spain) | `es-ES-AbrilNeural`(Female)<br/>`es-ES-AlvaroNeural`(Male)<br/>`es-ES-ArnauNeural`(Male)<br/>`es-ES-DarioNeural`(Male)<br/>`es-ES-EliasNeural`(Male)<br/>`es-ES-EstrellaNeural`(Female)<br/>`es-ES-IreneNeural`(Female)<br/>`es-ES-LaiaNeural`(Female)<br/>`es-ES-LiaNeural`(Female)<br/>`es-ES-NilNeural`(Male)<br/>`es-ES-SaulNeural`(Male)<br/>`es-ES-TeoNeural`(Male)<br/>`es-ES-TrianaNeural`(Female)<br/>`es-ES-VeraNeural`(Female) | 
| `ja-JP` | Japanese (Japan) | `ja-JP-AoiNeural`(Female)<br/>`ja-JP-DaichiNeural`(Male)<br/>`ja-JP-MayuNeural`(Female)<br/>`ja-JP-NaokiNeural`(Male)<br/>`ja-JP-ShioriNeural`(Female) | 
| `ko-KR` | Korean (Korea) | `ko-KR-BongJinNeural`(Male)<br/>`ko-KR-GookMinNeural`(Male)<br/>`ko-KR-JiMinNeural`(Female)<br/>`ko-KR-SeoHyeonNeural`(Female)<br/>`ko-KR-SoonBokNeural`(Female)<br/>`ko-KR-YuJinNeural`(Female) | 
| `wuu-CN` | Chinese (Wu, Simplified) | `wuu-CN-XiaotongNeural` (Female)<br/>`wuu-CN-YunzheNeural` (Male) | 
| `yue-CN` | Chinese (Cantonese, Simplified) | `yue-CN-XiaoMinNeural` (Female)<br/>`yue-CN-YunSongNeural` (Male) | 

#### General TTS voice updates

- Improved quality for the `fil-PH-AngeloNeural` and `fil-PH-BlessicaNeural` voices.
- Text Normalization rules are updated for voices with the `es-CL` Spanish (Chile) and `uz-UZ` Uzbek (Uzbekistan) locales.
- Added English letters spelling for voices with the `sq-AL` Albanian (Albania) and `az-AZ` Azerbaijani (Azerbaijan) locales.
- Improved English pronunciation for the `zh-HK-WanLungNeural` voice.
- Improved question tone for the `nl-NL-MaartenNeural` and `pt-BR-AntonioNeural` voices.
- Added support for the `<lang ="en-US">` tag for better English pronunciation with the following voices: `de-DE-ConradNeural`, `de-DE-KatjaNeural`, `es-ES-AlvaroNeural`, `es-MX-DaliaNeural`, `es-MX-JorgeNeural`, `fr-CA-SylvieNeural`, `fr-FR-DeniseNeural`, `fr-FR-HenriNeural`, `it-IT-DiegoNeural`, and `it-IT-IsabellaNeural`.
- Added support for the `style="chat"` tag with the following voices: `en-GB-RyanNeural`, `es-MX-JorgeNeural`, and `it-IT-IsabellaNeural`.
- Added support for the `style="cheerful"` tag with the following voices: `en-GB-RyanNeural`, `en-GB-SoniaNeural`, `es-MX-JorgeNeural`, `fr-FR-DeniseNeural`, `fr-FR-HenriNeural`, and `it-IT-IsabellaNeural`.
- Added support for the `style="sad"` tag with the following voices: `en-GB-SoniaNeural`, `fr-FR-DeniseNeural` and `fr-FR-HenriNeural`.

### September 2022 release

#### Prebuilt Neural TTS Voice

* All the prebuilt neural voices have been upgraded to high-fidelity voices with 48kHz sample rate. 

### August 2022 release

#### Prebuilt Neural TTS Voice

Released new voices in public preview:
* Voices for English (United States): `en-US-AIGenerate1Neural` and `en-US-AIGenerate2Neural`.
* Voices for Chinese regional languages: `zh-CN-henan-YundengNeural`, `zh-CN-shaanxi-XiaoniNeural`, and `zh-CN-shandong-YunxiangNeural`. 

For more information, see the [language and voice list](../../language-support.md?tabs=tts).

### July 2022 release

#### Prebuilt Neural TTS Voice

* Added 5 new voices of `zh-CN` Chinese (Mandarin, Simplified) and 1 new voice of `en-US` English (United States) in Public Preview. See [full language and voice list](../../language-support.md?tabs=tts).

| Language | Locale  | Gender | Voice name| Style support|
|---|---|---|---|---|
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaomengNeural` <sup>New</sup> | General, multiple styles available [using SSML](../../speech-synthesis-markup-voice.md#use-speaking-styles-and-roles)  |
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaoyiNeural` <sup>New</sup> | General, multiple styles available [using SSML](../../speech-synthesis-markup-voice.md#use-speaking-styles-and-roles)  |
| Chinese (Mandarin, Simplified) | `zh-CN` | Female | `zh-CN-XiaozhenNeural` <sup>New</sup> | General, multiple styles available [using SSML](../../speech-synthesis-markup-voice.md#use-speaking-styles-and-roles)  |
| Chinese (Mandarin, Simplified) | `zh-CN` | Male | `zh-CN-YunxiaNeural` <sup>New</sup> | General, multiple styles available [using SSML](../../speech-synthesis-markup-voice.md#use-speaking-styles-and-roles)  |
| Chinese (Mandarin, Simplified) | `zh-CN` | Male | `zh-CN-YunzeNeural` <sup>New</sup> | General, multiple styles available [using SSML](../../speech-synthesis-markup-voice.md#use-speaking-styles-and-roles)  |
| English (United States) | `en-US` | Male | `en-US-RogerNeural` <sup>New</sup> | General|

*  Supported styles and roles for the added neural voices.

|Voice|Styles|Style degree|Roles|
|-----|-----|-----|-----|
|zh-CN-XiaomengNeural <sup>Public preview</sup>|`chat`|Supported||
|zh-CN-XiaoyiNeural <sup>Public preview</sup>|`affectionate`, `angry`, `cheerful`, `disgruntled`, `embarrassed`, `fearful`, `gentle`, `sad`, `serious`|Supported||
|zh-CN-XiaozhenNeural <sup>Public preview</sup>|`angry`, `cheerful`, `disgruntled`, `fearful`, `sad`, `serious`|Supported||
|zh-CN-YunxiaNeural <sup>Public preview</sup>|`angry`, `calm`, `cheerful`, `fearful`, `sad`|Supported||
|zh-CN-YunzeNeural <sup>Public preview</sup>|`angry`, `calm`, `cheerful`, `depressed`, `disgruntled`, `documentary-narration`, `fearful`, `sad`, `serious`|Supported|Supported|

#### Get facial position with viseme

* Added support for blend shapes to drive the facial movements of a 3D character that you designed. Learn more at [how to get facial position with viseme](../../how-to-speech-synthesis-viseme.md).
* SSML updated to support viseme element. See [speech synthesis markup](../../speech-synthesis-markup-structure.md#viseme-element).

### June 2022 release

#### Prebuilt Neural TTS Voice

* Added 9 new languages and variants for Neural text to speech:

| Language | Locale | Gender | Voice name | Style support |
|---|---|---|---|---|
| Arabic (Lebanon) | `ar-LB` | Female | `ar-LB-LaylaNeural` <sup>New</sup> | General |
| Arabic (Lebanon) | `ar-LB` | Male | `ar-LB-RamiNeural` <sup>New</sup> | General |
| Arabic (Oman) | `ar-OM` | Female | `ar-OM-AyshaNeural` <sup>New</sup> | General |
| Arabic (Oman) | `ar-OM` | Male | `ar-OM-AbdullahNeural` <sup>New</sup> | General |
| Azerbaijani (Azerbaijan) | `az-AZ` | Female | `az-AZ-BabekNeural` <sup>New</sup> | General |
| Azerbaijani (Azerbaijan) | `az-AZ` | Male | `az-AZ-BanuNeural` <sup>New</sup> | General |
| Bosnian (Bosnia and Herzegovina) | `bs-BA` | Female | `bs-BA-VesnaNeural` <sup>New</sup> | General |
| Bosnian (Bosnia and Herzegovina) | `bs-BA` | Male | `bs-BA-GoranNeural` <sup>New</sup> | General |
| Georgian (Georgia) | `ka-GE` | Female | `ka-GE-EkaNeural` <sup>New</sup> | General |
| Georgian (Georgia) | `ka-GE` | Male | `ka-GE-GiorgiNeural` <sup>New</sup> | General |
| Mongolian (Mongolia) | `mn-MN` | Female | `mn-MN-YesuiNeural` <sup>New</sup> | General |
| Mongolian (Mongolia) | `mn-MN` | Male | `mn-MN-BataaNeural` <sup>New</sup> | General |
| Nepali (Nepal) | `ne-NP` | Female | `ne-NP-HemkalaNeural` <sup>New</sup> | General |
| Nepali (Nepal) | `ne-NP` | Male | `ne-NP-SagarNeural` <sup>New</sup> | General |
| Albanian (Albania) | `sq-AL` | Female | `sq-AL-AnilaNeural` <sup>New</sup> | General |
| Albanian (Albania) | `sq-AL` | Male | `sq-AL-IlirNeural` <sup>New</sup> | General |
| Tamil (Malaysia) | `ta-MY` | Female | `ta-MY-KaniNeural` <sup>New</sup> | General |
| Tamil (Malaysia) | `ta-MY` | Male | `ta-MY-SuryaNeural` <sup>New</sup> | General |

* GA 36 voices from Public Preview for `en-GB` English (United Kingdom), `fr-FR` French (France) and `de-DE` German (Germany):

| Language | Locale | Gender | Voice name | Style support |
|---|---|---|---|---|
| English (United Kingdom) | `en-GB` | Female | `en-GB-AbbiNeural` | General |
| English (United Kingdom) | `en-GB` | Female | `en-GB-BellaNeural` | General |
| English (United Kingdom) | `en-GB` | Female | `en-GB-HollieNeural` | General |
| English (United Kingdom) | `en-GB` | Female | `en-GB-MaisieNeural` | General, child voice |
| English (United Kingdom) | `en-GB` | Female | `en-GB-OliviaNeural` | General |
| English (United Kingdom) | `en-GB` | Female | `en-GB-SoniaNeural` | General |
| English (United Kingdom) | `en-GB` | Male | `en-GB-AlfieNeural` | General |
| English (United Kingdom) | `en-GB` | Male | `en-GB-ElliotNeural` | General |
| English (United Kingdom) | `en-GB` | Male | `en-GB-EthanNeural` | General |
| English (United Kingdom) | `en-GB` | Male | `en-GB-NoahNeural` | General |
| English (United Kingdom) | `en-GB` | Male | `en-GB-OliverNeural` | General |
| English (United Kingdom) | `en-GB` | Male | `en-GB-ThomasNeural` | General |
| French (France) | `fr-FR` | Female | `fr-FR-BrigitteNeural` | General |
| French (France) | `fr-FR` | Female | `fr-FR-CelesteNeural`  | General |
| French (France) | `fr-FR` | Female | `fr-FR-CoralieNeural`  | General |
| French (France) | `fr-FR` | Female | `fr-FR-EloiseNeural`  | General, child voice |
| French (France) | `fr-FR` | Female | `fr-FR-JacquelineNeural`  | General |
| French (France) | `fr-FR` | Female | `fr-FR-JosephineNeural`  | General |
| French (France) | `fr-FR` | Female | `fr-FR-YvetteNeural`  | General |
| French (France) | `fr-FR` | Male | `fr-FR-AlainNeural` | General |
| French (France) | `fr-FR` | Male | `fr-FR-ClaudeNeural` | General |
| French (France) | `fr-FR` | Male | `fr-FR-JeromeNeural` | General |
| French (France) | `fr-FR` | Male | `fr-FR-MauriceNeural` | General |
| French (France) | `fr-FR` | Male | `fr-FR-YvesNeural` | General |
| German (Germany) | `de-DE` | Female | `de-DE-AmalaNeural` | General |
| German (Germany) | `de-DE` | Female | `de-DE-ElkeNeural` | General |
| German (Germany) | `de-DE` | Female | `de-DE-GiselaNeural` | General, child voice |
| German (Germany) | `de-DE` | Female | `de-DE-KlarissaNeural` | General |
| German (Germany) | `de-DE` | Female | `de-DE-LouisaNeural` | General |
| German (Germany) | `de-DE` | Female | `de-DE-MajaNeural` | General |
| German (Germany) | `de-DE` | Female | `de-DE-TanjaNeural` | General |
| German (Germany) | `de-DE` | Male | `de-DE-BerndNeural` | General |
| German (Germany) | `de-DE` | Male | `de-DE-ChristophNeural` | General |
| German (Germany) | `de-DE` | Male | `de-DE-KasperNeural` | General |
| German (Germany) | `de-DE` | Male | `de-DE-KillianNeural` | General |
| German (Germany) | `de-DE` | Male | `de-DE-KlausNeural` | General |
| German (Germany) | `de-DE` | Male | `de-DE-RalfNeural` | General |

* Added 40 new voices of `es-MX` Spanish (Mexico), `it-IT` Italian (Italy), `pt-BR` Portuguese (Brazil) and 2 accents for `zh-CN` Chinese (Mandarin, Simplified) in Public Preview:

| Language | Locale | Gender | Voice name | Style support |
|---|---|---|---|---|
| Spanish (Mexico) | `es-MX` | Female | `es-MX-BeatrizNeural` <sup>New</sup> | General |
| Spanish (Mexico) | `es-MX` | Female | `es-MX-CarlotaNeural` <sup>New</sup> | General |
| Spanish (Mexico) | `es-MX` | Female | `es-MX-NuriaNeural` <sup>New</sup> | General |
| Spanish (Mexico) | `es-MX` | Female | `es-MX-RenataNeural` <sup>New</sup> | General |
| Spanish (Mexico) | `es-MX` | Female | `es-MX-LarissaNeural` <sup>New</sup> | General |
| Spanish (Mexico) | `es-MX` | Female | `es-MX-CandelaNeural` <sup>New</sup> | General |
| Spanish (Mexico) | `es-MX` | Female | `es-MX-MarinaNeural` <sup>New</sup> | General |
| Italian (Italy) | `it-IT` | Female | `it-IT-FiammaNeural` <sup>New</sup> | General |
| Italian (Italy) | `it-IT` | Female | `it-IT-IrmaNeural` <sup>New</sup> | General |
| Italian (Italy) | `it-IT` | Female | `it-IT-FabiolaNeural` <sup>New</sup> | General |
| Italian (Italy) | `it-IT` | Female | `it-IT-PalmiraNeural` <sup>New</sup> | General |
| Italian (Italy) | `it-IT` | Female | `it-IT-ImeldaNeural` <sup>New</sup> | General |
| Italian (Italy) | `it-IT` | Female | `it-IT-PierinaNeural` <sup>New</sup> | General |
| Portuguese (Brazil) | `pt-BR` | Female | `pt-BR-ElzaNeural` <sup>New</sup> | General |
| Portuguese (Brazil) | `pt-BR` | Female | `pt-BR-ManuelaNeural` <sup>New</sup> | General |
| Portuguese (Brazil) | `pt-BR` | Female | `pt-BR-BrendaNeural` <sup>New</sup> | General |
| Portuguese (Brazil) | `pt-BR` | Female | `pt-BR-LeilaNeural` <sup>New</sup> | General |
| Portuguese (Brazil) | `pt-BR` | Female | `pt-BR-YaraNeural` <sup>New</sup> | General |
| Portuguese (Brazil) | `pt-BR` | Female | `pt-BR-GiovannaNeural` <sup>New</sup> | General |
| Portuguese (Brazil) | `pt-BR` | Female | `pt-BR-LeticiaNeural` <sup>New</sup> | General |
| Spanish (Mexico) | `es-MX` | Male | `es-MX-CecilioNeural` <sup>New</sup> | General |
| Spanish (Mexico) | `es-MX` | Male | `es-MX-LibertoNeural` <sup>New</sup> | General |
| Spanish (Mexico) | `es-MX` | Male | `es-MX-LucianoNeural` <sup>New</sup> | General |
| Spanish (Mexico) | `es-MX` | Male | `es-MX-PelayoNeural` <sup>New</sup> | General |
| Spanish (Mexico) | `es-MX` | Male | `es-MX-YagoNeural` <sup>New</sup> | General |
| Spanish (Mexico) | `es-MX` | Male | `es-MX-GerardoNeural` <sup>New</sup> | General |
| Italian (Italy) | `it-IT` | Male | `it-IT-BenignoNeural` <sup>New</sup> | General |
| Italian (Italy) | `it-IT` | Male | `it-IT-CataldoNeural` <sup>New</sup> | General |
| Italian (Italy) | `it-IT` | Male | `it-IT-LisandroNeural` <sup>New</sup> | General |
| Italian (Italy) | `it-IT` | Male | `it-IT-CalimeroNeural` <sup>New</sup> | General |
| Italian (Italy) | `it-IT` | Male | `it-IT-RinaldoNeural` <sup>New</sup> | General |
| Italian (Italy) | `it-IT` | Male | `it-IT-GianniNeural` <sup>New</sup> | General |
| Portuguese (Brazil) | `pt-BR` | Male | `pt-BR-DonatoNeural` <sup>New</sup> | General |
| Portuguese (Brazil) | `pt-BR` | Male | `pt-BR-HumbertoNeural` <sup>New</sup> | General |
| Portuguese (Brazil) | `pt-BR` | Male | `pt-BR-FabioNeural` <sup>New</sup> | General |
| Portuguese (Brazil) | `pt-BR` | Male | `pt-BR-JulioNeural` <sup>New</sup> | General |
| Portuguese (Brazil) | `pt-BR` | Male | `pt-BR-ValerioNeural` <sup>New</sup> | General |
| Portuguese (Brazil) | `pt-BR` | Male | `pt-BR-NicolauNeural` <sup>New</sup> | General |
| Chinese (Mandarin, Simplified) | `zh-CN-sichuan` | Male | `zh-CN-sichuan-YunxiSichuanNeural` <sup>New</sup> | General, Sichuan accent |
| Chinese (Mandarin, Simplified) | `zh-CN-liaoning` | Female | `zh-CN-liaoning-XiaobeiNeural` <sup>New</sup> | General, Liaoning accent |

* Improved quality for `en-SG-LunaNeural` and `en-SG-WayneNeural`
* 48kHz output support for Public Preview with en-US-JennyNeural, en-US-AriaNeural, and zh-CN-XiaoxiaoNeural

#### Custom Neural Voice

* Enabled to fix data issues online. Learn more on [how to resolve data issues in Speech Studio](../../how-to-custom-voice-prepare-data.md#resolve-data-issues-online).
* Added training recipe version. Learn more on [selecting the training recipe version for your voice model](../../how-to-custom-voice-create-voice.md#train-your-custom-neural-voice-model).

#### Audio Content Creation tool

* Supported pagination.
* Enabled to sort globally by name, file type, and update time on work file page.

### May 2022 release

#### Prebuilt Neural TTS Voice

* Released 5 new voices in public preview with multiple styles to enrich the variety in American English. See [full language and voice list](../../language-support.md?tabs=tts).
* Support these new styles `Angry`, `Excited`, `Friendly`, `Hopeful`, `Sad`, `Shouting`, `Unfriendly`, `Terrified` and `Whispering` in public preview for `en-US-AriaNeural`. 
* Support these new styles `Angry`, `Cheerful`, `Excited`, `Friendly`, `Hopeful`, `Sad`, `Shouting`, `Unfriendly`, `Terrified` and `Whispering` in public preview for `en-US-GuyNeural`, `en-US-JennyNeural`. 
* Support these new styles `Excited`, `Friendly`, `Hopeful`, `Shouting`, `Unfriendly`, `Terrified` and `Whispering` in public preview for `en-US-SaraNeural`. See [voice styles and roles](../../language-support.md?tabs=tts).
* Released new voices `zh-CN-YunjianNeural`, `zh-CN-YunhaoNeural`, and `zh-CN-YunfengNeural` in public preview. See [full language and voice list](../../language-support.md?tabs=tts).
* Support 2 new styles `sports-commentary`, `sports-commentary-excited` in public preview for `zh-CN-YunjianNeural`. See [voice styles and roles](../../language-support.md?tabs=tts).
* Support 1 new style `advertisement-upbeat` in public preview for `zh-CN-YunhaoNeural`. See [voice styles and roles](../../language-support.md?tabs=tts).
* The `cheerful` and `sad` styles for `fr-FR-DeniseNeural` are generally available in all regions.
* SSML updated to support MathML elements for en-US and en-AU voices. Learn more at [speech synthesis markup](../../speech-synthesis-markup-pronunciation.md#pronunciation-with-mathml).

#### Custom Neural Voice

* Enabled to cancel training during training voice model. Learn more on [how to cancel training](../../how-to-custom-voice-create-voice.md#train-your-custom-neural-voice-model).
* Enabled to clone model (rename voice model). Learn more on [how to rename your voice model](../../how-to-custom-voice-create-voice.md#rename-your-model).
* Enabled to test your voice model by adding your own test script. Learn more on [how to upload your test script](../../how-to-custom-voice-create-voice.md#test-your-voice-model).
* Enabled to update engine version for your voice model. Learn more on [how to update the model engine version](../../how-to-custom-voice-create-voice.md#update-engine-version-for-your-voice-model).
* Supported more training regions. See [region support](../../regions.md#speech-service).
* Supported 10 locales for Custom Neural Voice Lite (preview). See [language support](../../language-support.md?tabs=tts).

#### Audio Content Creation tool

* Enabled to try out Audio Content Creation tool without signing in.
* Improved layout for adjusting phonemes.
* Enhanced performance: Specified the maximum number (200) of files to be uploaded at one time.
* Enhanced performance: Specified the maximum directory depth level (5 levels).

### March 2022 release

#### Prebuilt Neural TTS Voice

* Added support in public preview for the `Cheerful` and `Sad` styles with `fr-FR-DeniseNeural`. See [voice styles and roles](../../language-support.md?tabs=tts).
* Released disconnected containers for prebuilt neural TTS voices in public preview. See [use Docker containers in disconnected environments](../../../containers/disconnected-containers.md).

#### Custom Neural Voice

* Supported role based access control. Learn more on [Azure role-based access control in Speech Studio](../../role-based-access-control.md)
* Supported private endpoints and virtual network service endpoints. Learn more on [how to use private endpoints with speech service](../../speech-services-private-link.md).

#### Audio Content Creation tool

* Updated the file size and concurrency limit for free-tier (F0) resources to make the experience consistent with the Speech SDK and APIs. See [speech service quotas and limits](../../speech-services-quotas-and-limits.md#audio-content-creation-tool).
 
### February 2022 release

#### Custom Neural Voice

* Released Custom Neural Voice Lite in public preview. Learn more about [what is Custom Neural Voice Lite](../../custom-neural-voice-lite.md).
* Extended language support to 49 locales. See [language support](../../language-support.md?tabs=tts).
* Supported more regions/datacenters. See [region support](../../regions.md#speech-service).

#### Audio Content Creation tool

* Removed the output length limit for downloading audios.

### January 2022 release

#### New languages and voices

Added 10 new languages and variants for Neural text to speech:

| Language | Locale | Gender | Voice name | Style support |
|---|---|---|---|---|
| Bengali (India) | `bn-IN` | Female | `bn-IN-TanishaaNeural` <sup>New</sup> | General |
| Bengali (India) | `bn-IN` | Male | `bn-IN-BashkarNeural` <sup>New</sup> | General |
| Icelandic (Iceland) | `is-IS` | Female | `is-IS-GudrunNeural` <sup>New</sup> | General |
| Icelandic (Iceland) | `is-IS` | Male | `is-IS-GunnarNeural` <sup>New</sup> | General |
| Kannada (India) | `kn-IN` | Female | `kn-IN-SapnaNeural` <sup>New</sup> | General |
| Kannada (India) | `kn-IN` | Male | `kn-IN-GaganNeural` <sup>New</sup> | General |
| Kazakh (Kazakhstan) | `kk-KZ` | Female | `kk-KZ-AigulNeural` <sup>New</sup> | General |
| Kazakh (Kazakhstan) | `kk-KZ` | Male | `kk-KZ-DauletNeural` <sup>New</sup> | General |
| Lao (Laos) | `lo-LA` | Female | `lo-LA-KeomanyNeural` <sup>New</sup> | General |
| Lao (Laos) | `lo-LA` | Male | `lo-LA-ChanthavongNeural` <sup>New</sup> | General |
| Macedonian (Republic of North Macedonia) | `mk-MK` | Female | `mk-MK-MarijaNeural` <sup>New</sup> | General |
| Macedonian (Republic of North Macedonia) | `mk-MK` | Male | `mk-MK-AleksandarNeural` <sup>New</sup> | General |
| Malayalam (India) | `ml-IN` | Female | `ml-IN-SobhanaNeural` <sup>New</sup> | General |
| Malayalam (India) | `ml-IN` | Male | `ml-IN-MidhunNeural` <sup>New</sup> | General |
| Pashto (Afghanistan) | `ps-AF` | Female | `ps-AF-LatifaNeural` <sup>New</sup> | General |
| Pashto (Afghanistan) | `ps-AF` | Male | `ps-AF-GulNawazNeural` <sup>New</sup> | General |
| Serbian (Serbia, Cyrillic) | `sr-RS` | Female | `sr-RS-SophieNeural` <sup>New</sup> | General |
| Serbian (Serbia, Cyrillic) | `sr-RS` | Male | `sr-RS-NicholasNeural` <sup>New</sup> | General |
| Sinhala (Sri Lanka) | `si-LK` | Female | `si-LK-ThiliniNeural` <sup>New</sup> | General |
| Sinhala (Sri Lanka) | `si-LK` | Male | `si-LK-SameeraNeural` <sup>New</sup> | General |

For the full list of available voices, see [Language support](../../language-support.md?tabs=tts).

#### New voices in preview

Added new voices for en-GB, fr-FR and de-DE in preview:

| Language | Locale | Gender | Voice name | Style support |
|---|---|---|---|---|
| English (United Kingdom) | `en-GB` | Female | `en-GB-AbbiNeural` <sup>New</sup> | General |
| English (United Kingdom) | `en-GB` | Female | `en-GB-BellaNeural` <sup>New</sup> | General |
| English (United Kingdom) | `en-GB` | Female | `en-GB-HollieNeural` <sup>New</sup> | General |
| English (United Kingdom) | `en-GB` | Female | `en-GB-OliviaNeural` <sup>New</sup> | General |
| English (United Kingdom) | `en-GB` | Girl | `en-GB-MaisieNeural` <sup>New</sup> | General |
| English (United Kingdom) | `en-GB` | Male | `en-GB-AlfieNeural` <sup>New</sup> | General |
| English (United Kingdom) | `en-GB` | Male | `en-GB-ElliotNeural` <sup>New</sup> | General |
| English (United Kingdom) | `en-GB` | Male | `en-GB-EthanNeural` <sup>New</sup> | General |
| English (United Kingdom) | `en-GB` | Male | `en-GB-NoahNeural` <sup>New</sup> | General |
| English (United Kingdom) | `en-GB` | Male | `en-GB-OliverNeural` <sup>New</sup> | General |
| English (United Kingdom) | `en-GB` | Male | `en-GB-ThomasNeural` <sup>New</sup> | General |
| French (France) | `fr-FR` | Female | `fr-FR-BrigitteNeural` <sup>New</sup> | General |
| French (France) | `fr-FR` | Female | `fr-FR-CelesteNeural` <sup>New</sup> | General |
| French (France) | `fr-FR` | Female | `fr-FR-CoralieNeural` <sup>New</sup> | General |
| French (France) | `fr-FR` | Female | `fr-FR-JacquelineNeural` <sup>New</sup> | General |
| French (France) | `fr-FR` | Female | `fr-FR-JosephineNeural` <sup>New</sup> | General |
| French (France) | `fr-FR` | Female | `fr-FR-YvetteNeural` <sup>New</sup> | General |
| French (France) | `fr-FR` | Girl | `fr-FR-EloiseNeural` <sup>New</sup> | General |
| French (France) | `fr-FR` | Male | `fr-FR-AlainNeural` <sup>New</sup> | General |
| French (France) | `fr-FR` | Male | `fr-FR-ClaudeNeural` <sup>New</sup> | General |
| French (France) | `fr-FR` | Male | `fr-FR-JeromeNeural` <sup>New</sup> | General |
| French (France) | `fr-FR` | Male | `fr-FR-MauriceNeural` <sup>New</sup> | General |
| French (France) | `fr-FR` | Male | `fr-FR-YvesNeural` <sup>New</sup> | General |
| German (Germany) | `de-DE` | Female | `de-DE-AmalaNeural` <sup>New</sup> | General |
| German (Germany) | `de-DE` | Female | `de-DE-ElkeNeural` <sup>New</sup> | General |
| German (Germany) | `de-DE` | Female | `de-DE-KlarissaNeural` <sup>New</sup> | General |
| German (Germany) | `de-DE` | Female | `de-DE-LouisaNeural` <sup>New</sup> | General |
| German (Germany) | `de-DE` | Female | `de-DE-MajaNeural` <sup>New</sup> | General |
| German (Germany) | `de-DE` | Female | `de-DE-TanjaNeural` <sup>New</sup> | General |
| German (Germany) | `de-DE` | Girl | `de-DE-GiselaNeural` <sup>New</sup> | General |
| German (Germany) | `de-DE` | Male | `de-DE-BerndNeural` <sup>New</sup> | General |
| German (Germany) | `de-DE` | Male | `de-DE-ChristophNeural` <sup>New</sup> | General |
| German (Germany) | `de-DE` | Male | `de-DE-KasperNeural` <sup>New</sup> | General |
| German (Germany) | `de-DE` | Male | `de-DE-KillianNeural` <sup>New</sup> | General |
| German (Germany) | `de-DE` | Male | `de-DE-KlausNeural` <sup>New</sup> | General |
| German (Germany) | `de-DE` | Male | `de-DE-RalfNeural` <sup>New</sup> | General |

For the full list of available voices, see [Language support](../../language-support.md?tabs=tts).

#### Pronunciation accuracy

- Improved English word pronunciation for all `he-IL` voices. 
- Improved word-level pronunciation accuracy for `cs-CZ` and `da-DK`.
- Improved Arabic diacritics and Hebrew Nikud handling.
- Improved entity reading for `ja-JP` 

#### Speech Studio
- Custom Neural Voice: enabled additional model testing using the batch API (long audio API)
- Audio Content Creation: enabled more output formats 

### October 2021 release

#### New languages and voices

Added 49 new languages and 98 voices for Neural text to speech:

Adri in `af-ZA` Afrikaans (South Africa), Willem in `af-ZA` Afrikaans (South Africa), Mekdes in `am-ET` Amharic (Ethiopia), Ameha in `am-ET` Amharic (Ethiopia), Fatima in `ar-AE` Arabic (United Arab Emirates), Hamdan in `ar-AE` Arabic (United Arab Emirates), Laila in `ar-BH` Arabic (Bahrain), Ali in `ar-BH` Arabic (Bahrain), Amina in `ar-DZ` Arabic (Algeria), Ismael in `ar-DZ` Arabic (Algeria), Rana in `ar-IQ` Arabic (Iraq), Bassel in `ar-IQ` Arabic (Iraq), Sana in `ar-JO` Arabic (Jordan), Taim in `ar-JO` Arabic (Jordan), Noura in `ar-KW` Arabic (Kuwait), Fahed in `ar-KW` Arabic (Kuwait), Iman in `ar-LY` Arabic (Libya), Omar in `ar-LY` Arabic (Libya), Mouna in `ar-MA` Arabic (Morocco), Jamal in `ar-MA` Arabic (Morocco), Amal in `ar-QA` Arabic (Qatar), Moaz in `ar-QA` Arabic (Qatar), Amany in `ar-SY` Arabic (Syria), Laith in `ar-SY` Arabic (Syria), Reem in `ar-TN` Arabic (Tunisia), Hedi in `ar-TN` Arabic (Tunisia), Maryam in `ar-YE` Arabic (Yemen), Saleh in `ar-YE` Arabic (Yemen), Nabanita in `bn-BD` Bangla (Bangladesh), Pradeep in `bn-BD` Bangla (Bangladesh), Asilia in `en-KE` English (Kenya), Chilemba in `en-KE` English (Kenya), Ezinne in `en-NG` English (Nigeria), Abeo in `en-NG` English (Nigeria), Imani in `en-TZ` English (Tanzania), Elimu in `en-TZ` English (Tanzania), Sofia in `es-BO` Spanish (Bolivia), Marcelo in `es-BO` Spanish (Bolivia), Catalina in `es-CL` Spanish (Chile), Lorenzo in `es-CL` Spanish (Chile), Maria in `es-CR` Spanish (Costa Rica), Juan in `es-CR` Spanish (Costa Rica), Belkys in `es-CU` Spanish (Cuba), Manuel in `es-CU` Spanish (Cuba), Ramona in `es-DO` Spanish (Dominican Republic), Emilio in `es-DO` Spanish (Dominican Republic), Andrea in `es-EC` Spanish (Ecuador), Luis in `es-EC` Spanish (Ecuador), Teresa in `es-GQ` Spanish (Equatorial Guinea), Javier in `es-GQ` Spanish (Equatorial Guinea), Marta in `es-GT` Spanish (Guatemala), Andres in `es-GT` Spanish (Guatemala), Karla in `es-HN` Spanish (Honduras), Carlos in `es-HN` Spanish (Honduras), Yolanda in `es-NI` Spanish (Nicaragua), Federico in `es-NI` Spanish (Nicaragua), Margarita in `es-PA` Spanish (Panama), Roberto in `es-PA` Spanish (Panama), Camila in `es-PE` Spanish (Peru), Alex in `es-PE` Spanish (Peru), Karina in `es-PR` Spanish (Puerto Rico), Victor in `es-PR` Spanish (Puerto Rico), Tania in `es-PY` Spanish (Paraguay), Mario in `es-PY` Spanish (Paraguay), Lorena in `es-SV` Spanish (El Salvador), Rodrigo in `es-SV` Spanish (El Salvador), Valentina in `es-UY` Spanish (Uruguay), Mateo in `es-UY` Spanish (Uruguay), Paola in `es-VE` Spanish (Venezuela), Sebastian in `es-VE` Spanish (Venezuela), Dilara in `fa-IR` Persian (Iran), Farid in `fa-IR` Persian (Iran), Blessica in `fil-PH` Filipino (Philippines), Angelo in `fil-PH` Filipino (Philippines), Sabela in `gl-ES` Galician, Roi in `gl-ES` Galician, Siti in `jv-ID` Javanese (Indonesia), Dimas in `jv-ID` Javanese (Indonesia), Sreymom in `km-KH` Khmer (Cambodia), Piseth in `km-KH` Khmer (Cambodia), Nilar in `my-MM` Burmese (Myanmar), Thiha in `my-MM` Burmese (Myanmar), Ubax in `so-SO` Somali (Somalia), Muuse in `so-SO` Somali (Somalia), Tuti in `su-ID` Sundanese (Indonesia), Jajang in `su-ID` Sundanese (Indonesia), Rehema in `sw-TZ` Swahili (Tanzania), Daudi in `sw-TZ` Swahili (Tanzania), Saranya in `ta-LK` Tamil (Sri Lanka), Kumar in `ta-LK` Tamil (Sri Lanka), Venba in `ta-SG` Tamil (Singapore), Anbu in `ta-SG` Tamil (Singapore), Gul in `ur-IN` Urdu (India), Salman in `ur-IN` Urdu (India), Madina in `uz-UZ` Uzbek (Uzbekistan), Sardor in `uz-UZ` Uzbek (Uzbekistan), Thando in `zu-ZA` Zulu (South Africa), Themba in `zu-ZA` Zulu (South Africa).

### September 2021 release
- **New chatbot voice in `en-US` English (US)**: Sara, represents a young female adult that talks more casually and fits best for the chatbot scenarios. 
- **New styles added for `ja-JP` Japanese voice Nanami**: Three new styles are now available with Nanami: chat, customer service, and cheerful.
- **Overall pronunciation improvement**: Ardi in `id-ID`, Premwadee in `th-TH`, Christel in `da-DK`, HoaiMy and NamMinh in `vi-VN`.
- **Two new voices in `zh-CN` Chinese (Mandarin, China) in preview**: Xiaochen & Xiaoyan, optimized for spontaneous speech and customer service scenarios.

### July 2021 release

**Neural text to speech updates**
- Reduced pronunciation errors in Hebrew by 20%.

**Speech Studio updates**
- **Custom Neural Voice**: Updated the training pipeline to UniTTSv3 with which the model quality is improved while training time is reduced by 50% for acoustic models. 
- **Audio Content Creation**: Fixed the "Export" performance issue and the bug on custom neural voice selection.  

### June 2021 release

#### Speech Studio updates

- **Custom Neural Voice**: Custom Neural Voice training extended to support South East Asia. New features released to support data uploading status checking. 
- **Audio Content Creation**: Released a new feature to support custom lexicon. With this feature, users can easily create their lexicon files and define the customized pronunciation for their audio output. 

### May 2021 release

**New languages and voices added for neural TTS**

- **Ten new languages introduced** - 20 new voices in 10 new locales are added into the neural TTS language list: Yan in `en-HK` English (Hongkong), Sam in `en-HK` English (Hongkong), Molly in `en-NZ` English (New Zealand), Mitchell in `en-NZ` English (New Zealand), Luna in `en-SG` English (Singapore), Wayne in `en-SG` English (Singapore), Leah in `en-ZA` English (South Africa), Luke in `en-ZA` English (South Africa), Dhwani in `gu-IN` Gujarati (India), Niranjan in `gu-IN` Gujarati (India), Aarohi in `mr-IN` Marathi (India), Manohar in `mr-IN` Marathi (India), Elena in `es-AR` Spanish (Argentina), Tomas in `es-AR` Spanish (Argentina), Salome in `es-CO` Spanish (Colombia), Gonzalo in `es-CO` Spanish (Colombia), Paloma in `es-US` Spanish (US), Alonso in `es-US` Spanish (US), Zuri in `sw-KE` Swahili (Kenya), Rafiki in `sw-KE` Swahili (Kenya).

- **Eleven new en-US voices in preview** - 11 new en-US voices in preview are added to American English, they are Ashley, Amber, Ana, Brandon, Christopher, Cora, Elizabeth, Eric, Michelle, Monica, Jacob.

- **Five `zh-CN` Chinese (Mandarin, Simplified) voices are generally available** - 5 Chinese (Mandarin, Simplified) voices are changed from preview to generally available. They are Yunxi, Xiaomo, Xiaoman, Xiaoxuan, Xiaorui. Now, these voices are available in all [regions](../../regions.md#speech-service). Yunxi is added with a new 'assistant' style, which is suitable for chat bot and voice agent. Xiaomo's voice styles are refined to be more natural and featured.

### April 2021 release

**Neural text to speech is available across 21 regions**

- **Twelve new regions added** - Neural text to speech is now available in these new 12 regions: `Japan East`, `Japan West`, `Korea Central`, `North Central US`, `North Europe`, `South Central US`, `Southeast Asia`, `UK South`, `west Central US`, `West Europe`, `West US`, `West US 2`. Check [here](../../regions.md#speech-service) for full list of 21 supported regions.

### March 2021 release

**New languages and voices added for neural TTS**

- **Six new languages introduced** - 12 new voices in 6 new locales are added into the neural TTS language list: Nia in `cy-GB` Welsh (United Kingdom), Aled in `cy-GB` Welsh (United Kingdom), Rosa in `en-PH` English (Philippines), James in `en-PH` English (Philippines), Charline in `fr-BE` French (Belgium), Gerard in `fr-BE` French (Belgium), Dena in `nl-BE` Dutch (Belgium), Arnaud in `nl-BE` Dutch (Belgium), Polina in `uk-UA` Ukrainian (Ukraine), Ostap in `uk-UA` Ukrainian (Ukraine), Uzma in `ur-PK` Urdu (Pakistan), Asad in `ur-PK` Urdu (Pakistan).

- **Five languages from preview to GA** - 10 voices in 5 locales introduced in November now are GA: Kert in `et-EE` Estonian (Estonia), Colm in `ga-IE` Irish (Ireland), Nils in `lv-LV` Latvian (Latvia), Leonas in `lt-LT` Lithuanian (Lithuania), Joseph in `mt-MT` Maltese (Malta).

- **New male voice added for French (Canada)** - A new voice Antoine is available for `fr-CA` French (Canada).

- **Quality improvement** - Pronunciation error rate reduction on `hu-HU` Hungarian - 48.17%, `nb-NO` Norwegian - 52.76%, `nl-NL` Dutch (Netherlands) - 22.11%.

With this release, we now support a total of 142 neural voices across 60 languages/locales. In addition, over 70 standard voices are available in 49 languages/locales. Visit [Language support](../../language-support.md?tabs=tts) for the full list.

**Get facial pose events to animate characters**

Neural Text to speech now includes the [viseme event](../../how-to-speech-synthesis-viseme.md). Viseme events allow users to get a sequence of facial poses along with synthesized speech. Visemes can be used to control the movement of 2D and 3D avatar models, matching mouth movements to synthesized speech. Viseme events are only available for `en-US-AriaNeural` voice at this time.

**Add the bookmark element in Speech Synthesis Markup Language (SSML)**

The [bookmark element](../../speech-synthesis-markup-structure.md#bookmark-element) allows you to insert custom markers in SSML to get the offset of each marker in the audio stream. It can be used to reference a specific location in the text or tag sequence.

### February 2021 release

**Custom Neural Voice GA**

Custom Neural Voice is GA in February in 13 languages: Chinese (Mandarin, Simplified), English (Australia), English (India), English (United Kingdom), English (United States), French (Canada), French (France), German (Germany), Italian (Italy), Japanese (Japan), Korean (Korea), Portuguese (Brazil), Spanish (Mexico), and Spanish (Spain). Learn more about [what is Custom Neural Voice](../../custom-neural-voice.md) and [how to use it responsibly](/legal/cognitive-services/speech-service/custom-neural-voice/concepts-guidelines-responsible-deployment-synthetic?context=~/articles/ai-services/speech-service/context/context).
Custom Neural Voice feature requires registration and Microsoft may limit access based on Microsoft's eligibility criteria. Learn more about the [limited access](/legal/cognitive-services/speech-service/custom-neural-voice/limited-access-custom-neural-voice?context=~/articles/ai-services/speech-service/context/context).


### December 2020 release

**New neural voices in GA and preview**

Released 51 new voices for a total of 129 neural voices across 54 languages/locales:

- **46 new voices in GA locales**: Shakir in `ar-EG` Arabic (Egypt), Hamed in `ar-SA` Arabic (Saudi Arabia), Borislav in `bg-BG` Bulgarian (Bulgaria), Joana in `ca-ES` Catalan, Antonin in `cs-CZ` Czech (Czech Republic), Jeppe in `da-DK` Danish (Denmark), Jonas in `de-AT` German (Austria), Jan in `de-CH` German (Switzerland), Nestoras in `el-GR` Greek (Greece), Liam in `en-CA` English (Canada), Connor in `en-IE` English (Ireland), Madhur in `en-IN` Hindi (India), Mohan in `en-IN` Telugu (India), Prabhat in `en-IN` English (India), Valluvar in `en-IN` Tamil (India), Enric in `es-ES` Catalan, Kert in `et-EE` Estonian (Estonia), Harri in `fi-FI` Finnish (Finland), Selma in `fi-FI` Finnish (Finland), Fabrice in `fr-CH` French (Switzerland), Colm in `ga-IE` Irish (Ireland), Avri in `he-IL` Hebrew (Israel), Srecko in `hr-HR` Croatian (Croatia), Tamas in `hu-HU` Hungarian (Hungary), Gadis in `id-ID` Indonesian (Indonesia), Leonas in `lt-LT` Lithuanian (Lithuania), Nils in `lv-LV` Latvian (Latvia), Osman in `ms-MY` Malay (Malaysia), Joseph in `mt-MT` Maltese (Malta), Finn in `nb-NO` Norwegian, Bokmål (Norway), Pernille in `nb-NO` Norwegian, Bokmål (Norway), Fenna in `nl-NL` Dutch (Netherlands), Maarten in `nl-NL` Dutch (Netherlands), Agnieszka in `pl-PL` Polish (Poland), Marek in `pl-PL` Polish (Poland), Duarte in `pt-BR` Portuguese (Brazil), Raquel in `pt-PT` Portuguese (Potugal), Emil in `ro-RO` Romanian (Romania), Dmitry in `ru-RU` Russian (Russia), Svetlana in `ru-RU` Russian (Russia), Lukas in `sk-SK` Slovak (Slovakia), Rok in `sl-SI` Slovenian (Slovenia), Mattias in `sv-SE` Swedish (Sweden), Sofie in `sv-SE` Swedish (Sweden), Niwat in `th-TH` Thai (Thailand), Ahmet in `tr-TR` Turkish (Türkiye), NamMinh in `vi-VN` Vietnamese (Vietnam), HsiaoChen in `zh-TW` Taiwanese Mandarin (Taiwan), YunJhe in `zh-TW` Taiwanese Mandarin (Taiwan), HiuMaan in `zh-HK` Chinese Cantonese (Hong Kong Special Administrative Region), WanLung in `zh-HK` Chinese Cantonese (Hong Kong SAR).

- **5 new voices in preview locales**: Kert in `et-EE` Estonian (Estonia), Colm in `ga-IE` Irish (Ireland), Nils in `lv-LV` Latvian (Latvia), Leonas in `lt-LT` Lithuanian (Lithuania), Joseph in `mt-MT` Maltese (Malta).

With this release, we now support a total of 129 neural voices across 54 languages/locales. In addition, over 70 standard voices are available in 49 languages/locales. Visit [Language support](../../language-support.md?tabs=tts) for the full list.

**Updates for Audio Content Creation**
- Improved voice selection UI with voice categories and detailed voice descriptions.
- Enabled intonation tuning for all neural voices across different languages.
- Automated the UI localization based on the language of the browser.
- Enabled `StyleDegree` controls for all `zh-CN` Neural voices.
Visit the [Audio Content Creation tool](https://speech.microsoft.com/audiocontentcreation) to check out the new features.

**Updates for zh-CN voices**
- Updated all `zh-CN` neural voices to support English speaking.
- Enabled all `zh-CN` neural voices to support intonation adjustment. SSML or Audio Content Creation tool can be used to adjust for the best intonation.
- Updated all `zh-CN` multi-style neural voices to support `StyleDegree` control. Emotion intensity (soft or strong) is adjustable.
- Updated `zh-CN-YunyeNeural` to support multiple styles which can perform different emotions.

### November 2020 release

**New locales and voices in preview**
- **Five new voices and languages** are introduced to the Neural text to speech portfolio. They are: Grace in Maltese (Malta), Ona in Lithuanian (Lithuania), Anu in Estonian (Estonia), Orla in Irish (Ireland) and Everita in Latvian (Latvia).
- **Five new `zh-CN` voices with multiple styles and roles support**: Xiaohan, Xiaomo, Xiaorui, Xiaoxuan and Yunxi.

> These voices are available in public preview in three Azure regions: EastUS, SouthEastAsia and WestEurope.

**Neural text to speech Container GA**
- With Neural text to speech Container, developers can run speech synthesis with the most natural digital voices in their own environment for specific security and data governance requirements. Check [how to install Speech Containers](../../speech-container-howto.md).

#### New features
- **Custom Voice**: enabled users to copy a voice model from one region to another; supported endpoint suspension and resuming. Go to the [portal](https://speech.microsoft.com/customvoice) here.
- [SSML silence tag](../../speech-synthesis-markup-structure.md#add-silence) support.
- General TTS voice quality improvements: Improved word-level pronunciation accuracy in nb-NO. Reduced 53% pronunciation error.

> Read more at [this tech blog](https://techcommunity.microsoft.com/t5/azure-ai/neural-text-to-speech-previews-five-new-languages-with/ba-p/1907604).

### October 2020 release

#### New features
- Jenny supports a new `newscast` style. See [how to use the speaking styles in SSML](../../speech-synthesis-markup-voice.md#use-speaking-styles-and-roles).
- **Neural voices upgraded to HiFiNet vocoder, with higher audio fidelity and faster synthesis speed**. This benefits customers whose scenario relies on hi-fi audio or long interactions, including video dubbing, audio books, or online education materials. [Read more about the story and hear the voice samples on our tech community blog](https://techcommunity.microsoft.com/t5/azure-ai/azure-neural-tts-upgraded-with-hifinet-achieving-higher-audio/ba-p/1847860)
- **[Custom Voice](https://speech.microsoft.com/customvoice) & [Audio Content Creation Studio](https://speech.microsoft.com/audiocontentcreation) localized to 17 locales**. Users can easily switch the UI to a local language for a more friendly experience.
- **Audio Content Creation**: Added style degree control for XiaoxiaoNeural; Refined the customized break feature to include incremental breaks of 50ms.

**General TTS voice quality improvements**
- Improved word-level pronunciation accuracy in `pl-PL` (error rate reduction: 51%) and `fi-FI` (error rate reduction: 58%)
- Improved `ja-JP` single word reading for the dictionary scenario. Reduced pronunciation error by 80%.
- `zh-CN-XiaoxiaoNeural`: Improved sentiment/CustomerService/Newscast/Cheerful/Angry style voice quality.
- `zh-CN`: Improved Erhua pronunciation and light tone and refined space prosody, which greatly improves intelligibility.

### September 2020 release

#### New features

* **Neural text to speech**
    * **Extended to support 18 new languages/locales.** They are Bulgarian, Czech, German (Austria),  German (Switzerland), Greek, English (Ireland), French (Switzerland), Hebrew, Croatian, Hungarian, Indonesian, Malay, Romanian, Slovak, Slovenian, Tamil, Telugu and Vietnamese.
    * **Released 14 new voices to enrich the variety in the existing languages.** See [full language and voice list](../../language-support.md?tabs=tts).
    * **New speaking styles for `en-US` and `zh-CN` voices.** Jenny, the new voice in English (US), supports chatbot, customer service, and assistant styles. 10 new speaking styles are available with our zh-CN voice, XiaoXiao. In addition, the XiaoXiao neural voice supports `StyleDegree` tuning. See [how to use the speaking styles in SSML](../../speech-synthesis-markup-voice.md#use-speaking-styles-and-roles).

* **Containers: Neural text to speech Container released in public preview with 16 voices available in 14 languages.** Learn more on [how to deploy Speech Containers for Neural text to speech](../../speech-container-howto.md)

Read the [full announcement of the TTS updates for Ignite 2020](https://techcommunity.microsoft.com/t5/azure-ai/ignite-neural-tts-updates-new-language-support-more-voices/ba-p/1698544)

### August 2020 release

#### New features

* **Neural text to speech: new speaking style for `en-US` Aria voice**. AriaNeural can sound like a news caster when reading news. The 'newscast-formal' style sounds more serious, while the 'newscast-casual' style is more relaxed and informal. See [how to use the speaking styles in SSML](../../speech-synthesis-markup.md).

* **Custom Voice: a new feature is released to automatically check training data quality**. When you upload your data, the system will examine various aspects of your audio and transcript data, and automatically fix or filter issues to improve the quality of the voice model. This covers the volume of your audio, the noise level, the pronunciation accuracy of speech, the alignment of speech with the normalized text, silence in the audio, in addition to the audio and script format.

* **Audio Content Creation: a set of new features to enable more powerful voice tuning and audio management capabilities**.

    * Pronunciation:  the pronunciation tuning feature is updated to the latest phoneme set. You can pick the right phoneme element from the library and refine the pronunciation of the words you have selected.

    * Download: The audio "Download"/"Export" feature is enhanced to support generating audio by paragraph. You can edit content in the same file/SSML, while generating multiple audio outputs. The file structure of "Download" is refined as well. Now, you can easily get all audio files in one folder.

    * Task status: The multi-file export experience is improved. When you export multiple files in the past, if one of the files has failed, the entire task will fail. But now, all other files will be successfully exported. The task report is enriched with more detailed and structured information. You can check the logs for all failed files and sentences now with the report.

    * SSML documentation: linked to SSML document to help you check the rules for how to use all tuning features.

* **The Voice List API is updated to include a user-friendly display name and the speaking styles supported for neural voices**.

#### General TTS voice quality improvements

* Reduced word-level pronunciation error % for `ru-RU` (errors reduced by 56%) and `sv-SE` (errors reduced by 49%)

* Improved polyphony word reading on `en-US` neural voices by 40%. Examples of polyphony words include "read", "live", "content", "record", "object", etc.

* Improved the naturalness of the question tone in `fr-FR`. MOS (Mean Opinion Score) gain: +0.28

* Updated the vocoders for the following voices, with fidelity improvements and overall performance speed-up by 40%.

    | Locale | Voice |
    |---|---|
    | `en-GB` | Mia |
    | `es-MX` | Dalia |
    | `fr-CA` | Sylvie |
    | `fr-FR` | Denise |
    | `ja-JP` | Nanami |
    | `ko-KR` | Sun-Hi |

#### Bug fixes

* Fixed a number of bugs with the Audio Content Creation tool
    * Fixed issue with auto refreshing.
    * Fixed issues with voice styles in zh-CN in the South East Asia region.
    * Fixed stability issue, including an export error with the 'break' tag, and errors in punctuation.
