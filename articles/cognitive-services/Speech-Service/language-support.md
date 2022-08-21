---
title: Language support - Speech service
titleSuffix: Azure Cognitive Services
description: The Speech service supports numerous languages for speech-to-text and text-to-speech conversion, along with speech translation. This article provides a comprehensive list of language support by service feature.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 08/21/2022
ms.author: eur
ms.custom: references_regions, ignite-fall-2021
---

# Language and voice support for the Speech service

Language support varies by Speech service functionality. The following tables summarize language support for [speech-to-text](#speech-to-text-and-text-to-speech), [text-to-speech](#speech-to-text-and-text-to-speech), [pronunciation assessment](#pronunciation-assessment), [speech translation](#speech-translation), [speaker recognition](#speaker-recognition), and additional service features.

## Speech-to-text and Text-to-speech

The following table summarizes locale and voice support for Speech-to-text and Text-to-speech. Please see the table footnotes for additional information.

| Locale | Language | Speech-to-text | Custom Speech | Text-to-speech voices | Custom Neural Voice |
| ----- | ----- | ----- | ----- | ----- | ----- |
| `af-ZA` | Afrikaans (South Africa) | `af-ZA` | Plain text | `af-ZA-AdriNeural` (Female)<br/>`af-ZA-WillemNeural` (Male) | Not supported | 
| `am-ET` | Amharic (Ethiopia) | `am-ET` | Plain text | `am-ET-AmehaNeural` (Male)<br/>`am-ET-MekdesNeural` (Female) | Not supported | 
| `ar-AE` | Arabic (United Arab Emirates)<sup>1</sup> | `ar-AE` | Plain text | `ar-AE-FatimaNeural` (Female)<sup>5,6</sup><br/>`ar-AE-HamdanNeural` (Male)<sup>5,6</sup> | Not supported | 
| `ar-BH` | Arabic (Bahrain)<sup>1</sup> | `ar-BH` | Plain text | `ar-BH-AliNeural` (Male)<sup>5,6</sup><br/>`ar-BH-LailaNeural` (Female)<sup>5,6</sup> | Not supported | 
| `ar-DZ` | Arabic (Algeria)<sup>1</sup> | `ar-DZ` | Plain text | `ar-DZ-AminaNeural` (Female)<sup>5,6</sup><br/>`ar-DZ-IsmaelNeural` (Male)<sup>5,6</sup> | Not supported | 
| `ar-EG` | Arabic (Egypt)<sup>1</sup> | `ar-EG` | Plain text | `ar-EG-SalmaNeural` (Female)<sup>5,6</sup><br/>`ar-EG-ShakirNeural` (Male)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `ar-IL` | Arabic (Israel)<sup>1</sup> | `ar-IL` | Plain text | Not supported |Not supported | 
| `ar-IQ` | Arabic (Iraq)<sup>1</sup> | `ar-IQ` | Plain text | `ar-IQ-BasselNeural` (Male)<sup>5,6</sup><br/>`ar-IQ-RanaNeural` (Female)<sup>5,6</sup> | Not supported | 
| `ar-JO` | Arabic (Jordan)<sup>1</sup> | `ar-JO` | Plain text | `ar-JO-SanaNeural` (Female)<sup>5,6</sup><br/>`ar-JO-TaimNeural` (Male)<sup>5,6</sup> | Not supported | 
| `ar-KW` | Arabic (Kuwait)<sup>1</sup> | `ar-KW` | Plain text | `ar-KW-FahedNeural` (Male)<sup>5,6</sup><br/>`ar-KW-NouraNeural` (Female)<sup>5,6</sup> | Not supported | 
| `ar-LB` | Arabic (Lebanon)<sup>1</sup> | `ar-LB` | Plain text | `ar-LB-LaylaNeural` (Female)<sup>5,6</sup><br/>`ar-LB-RamiNeural` (Male)<sup>5,6</sup> | Not supported | 
| `ar-LY` | Arabic (Libya)<sup>1</sup> | `ar-LY` | Plain text | `ar-LY-ImanNeural` (Female)<sup>5,6</sup><br/>`ar-LY-OmarNeural` (Male)<sup>5,6</sup> | Not supported | 
| `ar-MA` | Arabic (Morocco)<sup>1</sup> | `ar-MA` | Plain text | `ar-MA-JamalNeural` (Male)<sup>5,6</sup><br/>`ar-MA-MounaNeural` (Female)<sup>5,6</sup> | Not supported | 
| `ar-OM` | Arabic (Oman)<sup>1</sup> | `ar-OM` | Plain text | `ar-OM-AbdullahNeural` (Male)<sup>5,6</sup><br/>`ar-OM-AyshaNeural` (Female)<sup>5,6</sup> | Not supported | 
| `ar-PS` | Arabic (Palestinian Territories)<sup>1</sup> | `ar-PS` | Plain text | Not supported |Not supported | 
| `ar-QA` | Arabic (Qatar)<sup>1</sup> | `ar-QA` | Plain text | `ar-QA-AmalNeural` (Female)<sup>5,6</sup><br/>`ar-QA-MoazNeural` (Male)<sup>5,6</sup> | Not supported | 
| `ar-SA` | Arabic (Saudi Arabia)<sup>1</sup> | `ar-SA` | Plain text | `ar-SA-HamedNeural` (Male)<sup>5,6</sup><br/>`ar-SA-ZariyahNeural` (Female)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `ar-SY` | Arabic (Syria)<sup>1</sup> | `ar-SY` | Plain text | `ar-SY-AmanyNeural` (Female)<sup>5,6</sup><br/>`ar-SY-LaithNeural` (Male)<sup>5,6</sup> | Not supported | 
| `ar-TN` | Arabic (Tunisia)<sup>1</sup> | `ar-TN` | Plain text | `ar-TN-HediNeural` (Male)<sup>5,6</sup><br/>`ar-TN-ReemNeural` (Female)<sup>5,6</sup> | Not supported | 
| `ar-YE` | Arabic (Yemen)<sup>1</sup> | `ar-YE` | Plain text | `ar-YE-MaryamNeural` (Female)<sup>5,6</sup><br/>`ar-YE-SalehNeural` (Male)<sup>5,6</sup> | Not supported | 
| `az-AZ` | Azerbaijani (Azerbaijan) | `az-AZ` | Plain text | `az-AZ-BabekNeural` (Male)<br/>`az-AZ-BanuNeural` (Female) | Not supported | 
| `bg-BG` | Bulgarian (Bulgaria)<sup>1</sup> | `bg-BG` | Plain text | `bg-BG-BorislavNeural` (Male)<sup>5,6</sup><br/>`bg-BG-KalinaNeural` (Female)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `bn-BD` | Bangla (Bangladesh) | Not supported |Not supported |`bn-BD-NabanitaNeural` (Female)<br/>`bn-BD-PradeepNeural` (Male) | Not supported | 
| `bn-IN` | Bengali (India) | `bn-IN` | Plain text | `bn-IN-BashkarNeural` (Male)<br/>`bn-IN-TanishaaNeural` (Female) | Not supported | 
| `bs-BA` | Bosnian (Bosnia) | `bs-BA` | Plain text | `bs-BA-GoranNeural` (Male)<br/>`bs-BA-VesnaNeural` (Female) | Not supported | 
| `ca-ES` | Catalan (Spain)<sup>1</sup> | `ca-ES` | Plain text<br/>Pronunciation | `ca-ES-AlbaNeural` (Female)<sup>5,6</sup><br/>`ca-ES-EnricNeural` (Male)<sup>5,6</sup><br/>`ca-ES-JoanaNeural` (Female)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `cs-CZ` | Czech (Czech)<sup>1</sup> | `cs-CZ` | Plain text<br/>Pronunciation | `cs-CZ-AntoninNeural` (Male)<sup>5,6</sup><br/>`cs-CZ-VlastaNeural` (Female)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `cy-GB` | Welsh (United Kingdom) | `cy-GB` | Plain text | `cy-GB-AledNeural` (Male)<br/>`cy-GB-NiaNeural` (Female) | Not supported | 
| `da-DK` | Danish (Denmark)<sup>1</sup> | `da-DK` | Plain text<br/>Pronunciation | `da-DK-ChristelNeural` (Female)<sup>5,6</sup><br/>`da-DK-JeppeNeural` (Male)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `de-AT` | German (Austria)<sup>1</sup> | `de-AT` | Plain text<br/>Pronunciation | `de-AT-IngridNeural` (Female)<sup>5,6</sup><br/>`de-AT-JonasNeural` (Male)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `de-CH` | German (Switzerland)<sup>1</sup> | `de-CH` | Audio + human-labeled transcript<br/>Plain text<br/>Pronunciation | `de-CH-JanNeural` (Male)<sup>5,6</sup><br/>`de-CH-LeniNeural` (Female)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `de-DE` | German (Germany)<sup>1</sup> | `de-DE` | Audio + human-labeled transcript<br/>Plain text<br/>Structured text<br/>Pronunciation<br/>Phrase list | `de-DE-AmalaNeural` (Female)<sup>5,6</sup><br/>`de-DE-BerndNeural` (Male)<sup>5,6</sup><br/>`de-DE-ChristophNeural` (Male)<sup>5,6</sup><br/>`de-DE-ConradNeural` (Male)<sup>5,6</sup><br/>`de-DE-ElkeNeural` (Female)<sup>5,6</sup><br/>`de-DE-GiselaNeural` (Female)<sup>5,6</sup><br/>`de-DE-KasperNeural` (Male)<sup>5,6</sup><br/>`de-DE-KatjaNeural` (Female)<sup>5,6</sup><br/>`de-DE-KillianNeural` (Male)<sup>5,6</sup><br/>`de-DE-KlarissaNeural` (Female)<sup>5,6</sup><br/>`de-DE-KlausNeural` (Male)<sup>5,6</sup><br/>`de-DE-LouisaNeural` (Female)<sup>5,6</sup><br/>`de-DE-MajaNeural` (Female)<sup>5,6</sup><br/>`de-DE-RalfNeural` (Male)<sup>5,6</sup><br/>`de-DE-TanjaNeural` (Female)<sup>5,6</sup> | Custom Neural Voice Pro<br/>Custom Neural Voice Lite<br/>Cross-lingual voice | 
| `el-GR` | Greek (Greece)<sup>1</sup> | `el-GR` | Plain text | `el-GR-AthinaNeural` (Female)<sup>5,6</sup><br/>`el-GR-NestorasNeural` (Male)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `en-AU` | English (Australia)<sup>1</sup> | `en-AU` | Audio + human-labeled transcript<br/>Plain text<br/>Structured text<br/>Pronunciation<br/>Phrase list | `en-AU-NatashaNeural` (Female)<sup>5,6</sup><br/>`en-AU-WilliamNeural` (Male)<sup>5,6</sup> | Custom Neural Voice Pro<br/>Custom Neural Voice Lite<br/>Cross-lingual voice | 
| `en-CA` | English (Canada)<sup>1</sup> | `en-CA` | Audio + human-labeled transcript<br/>Plain text<br/>Structured text<br/>Pronunciation<br/>Phrase list | `en-CA-ClaraNeural` (Female)<sup>5,6</sup><br/>`en-CA-LiamNeural` (Male)<sup>5,6</sup> | Custom Neural Voice Pro<br/>Custom Neural Voice Lite | 
| `en-GB` | English (United Kingdom)<sup>1</sup> | `en-GB` | Audio + human-labeled transcript<br/>Plain text<br/>Structured text<br/>Pronunciation<br/>Phrase list | `en-GB-AbbiNeural` (Female)<sup>5,6</sup><br/>`en-GB-AlfieNeural` (Male)<sup>5,6</sup><br/>`en-GB-BellaNeural` (Female)<sup>5,6</sup><br/>`en-GB-ElliotNeural` (Male)<sup>5,6</sup><br/>`en-GB-EthanNeural` (Male)<sup>5,6</sup><br/>`en-GB-HollieNeural` (Female)<sup>5,6</sup><br/>`en-GB-LibbyNeural` (Female)<sup>5,6</sup><br/>`en-GB-MaisieNeural` (Female)<sup>5,6</sup><br/>`en-GB-NoahNeural` (Male)<sup>5,6</sup><br/>`en-GB-OliverNeural` (Male)<sup>5,6</sup><br/>`en-GB-OliviaNeural` (Female)<sup>5,6</sup><br/>`en-GB-RyanNeural` (Male)<sup>5,6</sup><br/>`en-GB-SoniaNeural` (Female)<sup>5,6</sup><br/>`en-GB-ThomasNeural` (Male)<sup>5,6</sup> | Custom Neural Voice Pro<br/>Custom Neural Voice Lite<br/>Cross-lingual voice | 
| `en-GH` | English (Ghana)<sup>1</sup> | `en-GH` | Plain text<br/>Structured text<br/>Pronunciation | Not supported |Not supported | 
| `en-HK` | English (Hongkong)<sup>1</sup> | `en-HK` | Plain text<br/>Pronunciation | `en-HK-SamNeural` (Male)<sup>5,6</sup><br/>`en-HK-YanNeural` (Female)<sup>5,6</sup> | Not supported | 
| `en-IE` | English (Ireland)<sup>1</sup> | `en-IE` | Plain text<br/>Pronunciation | `en-IE-ConnorNeural` (Male)<sup>5,6</sup><br/>`en-IE-EmilyNeural` (Female)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `en-IN` | English (India)<sup>1</sup> | `en-IN` | Audio + human-labeled transcript<br/>Plain text<br/>Structured text<br/>Pronunciation<br/>Phrase list | `en-IN-NeerjaNeural` (Female)<sup>5,6</sup><br/>`en-IN-PrabhatNeural` (Male)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `en-KE` | English (Kenya)<sup>1</sup> | `en-KE` | Plain text<br/>Structured text<br/>Pronunciation | `en-KE-AsiliaNeural` (Female)<sup>5,6</sup><br/>`en-KE-ChilembaNeural` (Male)<sup>5,6</sup> | Not supported | 
| `en-NG` | English (Nigeria)<sup>1</sup> | `en-NG` | Plain text<br/>Pronunciation | `en-NG-AbeoNeural` (Male)<sup>5,6</sup><br/>`en-NG-EzinneNeural` (Female)<sup>5,6</sup> | Not supported | 
| `en-NZ` | English (New Zealand)<sup>1</sup> | `en-NZ` | Audio + human-labeled transcript<br/>Plain text<br/>Pronunciation | `en-NZ-MitchellNeural` (Male)<sup>5,6</sup><br/>`en-NZ-MollyNeural` (Female)<sup>5,6</sup> | Not supported | 
| `en-PH` | English (Philippines)<sup>1</sup> | `en-PH` | Plain text<br/>Pronunciation | `en-PH-JamesNeural` (Male)<sup>5,6</sup><br/>`en-PH-RosaNeural` (Female)<sup>5,6</sup> | Not supported | 
| `en-SG` | English (Singapore)<sup>1</sup> | `en-SG` | Plain text<br/>Pronunciation | `en-SG-LunaNeural` (Female)<sup>5,6</sup><br/>`en-SG-WayneNeural` (Male)<sup>5,6</sup> | Not supported | 
| `en-TZ` | English (Tanzania)<sup>1</sup> | `en-TZ` | Plain text<br/>Structured text<br/>Pronunciation | `en-TZ-ElimuNeural` (Male)<sup>5,6</sup><br/>`en-TZ-ImaniNeural` (Female)<sup>5,6</sup> | Not supported | 
| `en-US` | English (United States)<sup>1</sup> | `en-US` | Audio + human-labeled transcript<br/>Plain text<br/>Structured text<br/>Pronunciation<br/>Phrase list | `en-US-AIGenerate1Neural` (Male)<sup>4,5,6</sup><br/>`en-US-AIGenerate2Neural` (Female)<sup>4,5,6</sup><br/>`en-US-AmberNeural` (Female)<sup>5,6</sup><br/>`en-US-AnaNeural` (Female)<sup>5,6</sup><br/>`en-US-AriaNeural` (Female)<sup>2,5,6</sup><br/>`en-US-AshleyNeural` (Female)<sup>5,6</sup><br/>`en-US-BrandonNeural` (Male)<sup>5,6</sup><br/>`en-US-ChristopherNeural` (Male)<sup>5,6</sup><br/>`en-US-CoraNeural` (Female)<sup>5,6</sup><br/>`en-US-DavisNeural` (Male)<sup>2,4,5,6</sup><br/>`en-US-ElizabethNeural` (Female)<sup>5,6</sup><br/>`en-US-EricNeural` (Male)<sup>5,6</sup><br/>`en-US-GuyNeural` (Male)<sup>2,5,6</sup><br/>`en-US-JacobNeural` (Male)<sup>5,6</sup><br/>`en-US-JaneNeural` (Female)<sup>2,4,5,6</sup><br/>`en-US-JasonNeural` (Male)<sup>2,4,5,6</sup><br/>`en-US-JennyMultilingualNeural` (Female)<sup>5,6,7</sup><br/>`en-US-JennyNeural` (Female)<sup>2,5,6</sup><br/>`en-US-MichelleNeural` (Female)<sup>5,6</sup><br/>`en-US-MonicaNeural` (Female)<sup>5,6</sup><br/>`en-US-NancyNeural` (Female)<sup>2,4,5,6</sup><br/>`en-US-RogerNeural` (Male)<sup>4,5,6</sup><br/>`en-US-SaraNeural` (Female)<sup>2,5,6</sup><br/>`en-US-TonyNeural` (Male)<sup>2,4,5,6</sup> | Custom Neural Voice Pro<br/>Custom Neural Voice Lite<br/>Cross-lingual voice | 
| `en-ZA` | English (South Africa)<sup>1</sup> | `en-ZA` | Plain text<br/>Pronunciation | `en-ZA-LeahNeural` (Female)<sup>5,6</sup><br/>`en-ZA-LukeNeural` (Male)<sup>5,6</sup> | Not supported | 
| `es-AR` | Spanish (Argentina)<sup>1</sup> | `es-AR` | Plain text<br/>Pronunciation | `es-AR-ElenaNeural` (Female)<sup>5,6</sup><br/>`es-AR-TomasNeural` (Male)<sup>5,6</sup> | Not supported | 
| `es-BO` | Spanish (Bolivia)<sup>1</sup> | `es-BO` | Plain text<br/>Pronunciation | `es-BO-MarceloNeural` (Male)<sup>5,6</sup><br/>`es-BO-SofiaNeural` (Female)<sup>5,6</sup> | Not supported | 
| `es-CL` | Spanish (Chile)<sup>1</sup> | `es-CL` | Plain text<br/>Pronunciation | `es-CL-CatalinaNeural` (Female)<sup>5,6</sup><br/>`es-CL-LorenzoNeural` (Male)<sup>5,6</sup> | Not supported | 
| `es-CO` | Spanish (Colombia)<sup>1</sup> | `es-CO` | Plain text<br/>Pronunciation | `es-CO-GonzaloNeural` (Male)<sup>5,6</sup><br/>`es-CO-SalomeNeural` (Female)<sup>5,6</sup> | Not supported | 
| `es-CR` | Spanish (Costa Rica)<sup>1</sup> | `es-CR` | Plain text<br/>Pronunciation | `es-CR-JuanNeural` (Male)<sup>5,6</sup><br/>`es-CR-MariaNeural` (Female)<sup>5,6</sup> | Not supported | 
| `es-CU` | Spanish (Cuba)<sup>1</sup> | `es-CU` | Plain text<br/>Pronunciation | `es-CU-BelkysNeural` (Female)<sup>5,6</sup><br/>`es-CU-ManuelNeural` (Male)<sup>5,6</sup> | Not supported | 
| `es-DO` | Spanish (Dominican Republic)<sup>1</sup> | `es-DO` | Plain text<br/>Pronunciation | `es-DO-EmilioNeural` (Male)<sup>5,6</sup><br/>`es-DO-RamonaNeural` (Female)<sup>5,6</sup> | Not supported | 
| `es-EC` | Spanish (Ecuador)<sup>1</sup> | `es-EC` | Plain text<br/>Pronunciation | `es-EC-AndreaNeural` (Female)<sup>5,6</sup><br/>`es-EC-LuisNeural` (Male)<sup>5,6</sup> | Not supported | 
| `es-ES` | Spanish (Spain)<sup>1</sup> | `es-ES` | Audio + human-labeled transcript<br/>Plain text<br/>Structured text<br/>Pronunciation<br/>Phrase list | `es-ES-AlvaroNeural` (Male)<sup>5,6</sup><br/>`es-ES-ElviraNeural` (Female)<sup>5,6</sup> | Custom Neural Voice Pro<br/>Cross-lingual voice | 
| `es-GQ` | Spanish (Equatorial Guinea)<sup>1</sup> | `es-GQ` | Plain text | `es-GQ-JavierNeural` (Male)<sup>5,6</sup><br/>`es-GQ-TeresaNeural` (Female)<sup>5,6</sup> | Not supported | 
| `es-GT` | Spanish (Guatemala)<sup>1</sup> | `es-GT` | Plain text<br/>Pronunciation | `es-GT-AndresNeural` (Male)<sup>5,6</sup><br/>`es-GT-MartaNeural` (Female)<sup>5,6</sup> | Not supported | 
| `es-HN` | Spanish (Honduras)<sup>1</sup> | `es-HN` | Plain text<br/>Pronunciation | `es-HN-CarlosNeural` (Male)<sup>5,6</sup><br/>`es-HN-KarlaNeural` (Female)<sup>5,6</sup> | Not supported | 
| `es-MX` | Spanish (Mexico)<sup>1</sup> | `es-MX` | Audio + human-labeled transcript<br/>Plain text<br/>Structured text<br/>Pronunciation<br/>Phrase list | `es-MX-BeatrizNeural` (Female)<sup>4,5,6</sup><br/>`es-MX-CandelaNeural` (Female)<sup>4,5,6</sup><br/>`es-MX-CarlotaNeural` (Female)<sup>4,5,6</sup><br/>`es-MX-CecilioNeural` (Male)<sup>4,5,6</sup><br/>`es-MX-DaliaNeural` (Female)<sup>5,6</sup><br/>`es-MX-GerardoNeural` (Male)<sup>4,5,6</sup><br/>`es-MX-JorgeNeural` (Male)<sup>5,6</sup><br/>`es-MX-LarissaNeural` (Female)<sup>4,5,6</sup><br/>`es-MX-LibertoNeural` (Male)<sup>4,5,6</sup><br/>`es-MX-LucianoNeural` (Male)<sup>4,5,6</sup><br/>`es-MX-MarinaNeural` (Female)<sup>4,5,6</sup><br/>`es-MX-NuriaNeural` (Female)<sup>4,5,6</sup><br/>`es-MX-PelayoNeural` (Male)<sup>4,5,6</sup><br/>`es-MX-RenataNeural` (Female)<sup>4,5,6</sup><br/>`es-MX-YagoNeural` (Male)<sup>4,5,6</sup> | Custom Neural Voice Pro<br/>Custom Neural Voice Lite<br/>Cross-lingual voice | 
| `es-NI` | Spanish (Nicaragua)<sup>1</sup> | `es-NI` | Plain text<br/>Pronunciation | `es-NI-FedericoNeural` (Male)<sup>5,6</sup><br/>`es-NI-YolandaNeural` (Female)<sup>5,6</sup> | Not supported | 
| `es-PA` | Spanish (Panama)<sup>1</sup> | `es-PA` | Plain text<br/>Pronunciation | `es-PA-MargaritaNeural` (Female)<sup>5,6</sup><br/>`es-PA-RobertoNeural` (Male)<sup>5,6</sup> | Not supported | 
| `es-PE` | Spanish (Peru)<sup>1</sup> | `es-PE` | Plain text<br/>Pronunciation | `es-PE-AlexNeural` (Male)<sup>5,6</sup><br/>`es-PE-CamilaNeural` (Female)<sup>5,6</sup> | Not supported | 
| `es-PR` | Spanish (Puerto Rico)<sup>1</sup> | `es-PR` | Plain text<br/>Pronunciation | `es-PR-KarinaNeural` (Female)<sup>5,6</sup><br/>`es-PR-VictorNeural` (Male)<sup>5,6</sup> | Not supported | 
| `es-PY` | Spanish (Paraguay)<sup>1</sup> | `es-PY` | Plain text<br/>Pronunciation | `es-PY-MarioNeural` (Male)<sup>5,6</sup><br/>`es-PY-TaniaNeural` (Female)<sup>5,6</sup> | Not supported | 
| `es-SV` | Spanish (El Salvador)<sup>1</sup> | `es-SV` | Plain text<br/>Pronunciation | `es-SV-LorenaNeural` (Female)<sup>5,6</sup><br/>`es-SV-RodrigoNeural` (Male)<sup>5,6</sup> | Not supported | 
| `es-US` | Spanish (United States)<sup>1</sup> | `es-US` | Plain text<br/>Pronunciation | `es-US-AlonsoNeural` (Male)<sup>5,6</sup><br/>`es-US-PalomaNeural` (Female)<sup>5,6</sup> | Not supported | 
| `es-UY` | Spanish (Uruguay)<sup>1</sup> | `es-UY` | Plain text<br/>Pronunciation | `es-UY-MateoNeural` (Male)<sup>5,6</sup><br/>`es-UY-ValentinaNeural` (Female)<sup>5,6</sup> | Not supported | 
| `es-VE` | Spanish (Venezuela)<sup>1</sup> | `es-VE` | Plain text<br/>Pronunciation | `es-VE-PaolaNeural` (Female)<sup>5,6</sup><br/>`es-VE-SebastianNeural` (Male)<sup>5,6</sup> | Not supported | 
| `et-EE` | Estonian (Estonia)<sup>1</sup> | `et-EE` | Plain text<br/>Pronunciation | `et-EE-AnuNeural` (Female)<br/>`et-EE-KertNeural` (Male) | Not supported | 
| `eu-ES` | Basque | `eu-ES` | Plain text | Not supported |Not supported | 
| `fa-IR` | Persian (Iran) | `fa-IR` | Plain text | `fa-IR-DilaraNeural` (Female)<br/>`fa-IR-FaridNeural` (Male) | Not supported | 
| `fi-FI` | Finnish (Finland)<sup>1</sup> | `fi-FI` | Plain text<br/>Pronunciation | `fi-FI-HarriNeural` (Male)<sup>5,6</sup><br/>`fi-FI-NooraNeural` (Female)<sup>5,6</sup><br/>`fi-FI-SelmaNeural` (Female)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `fil-PH` | Filipino (Philippines) | `fil-PH` | Plain text<br/>Pronunciation | `fil-PH-AngeloNeural` (Male)<br/>`fil-PH-BlessicaNeural` (Female) | Not supported | 
| `fr-BE` | French (Belgium)<sup>1</sup> | `fr-BE` | Plain text | `fr-BE-CharlineNeural` (Female)<sup>5,6</sup><br/>`fr-BE-GerardNeural` (Male)<sup>5,6</sup> | Not supported | 
| `fr-CA` | French (Canada)<sup>1</sup> | `fr-CA` | Plain text<br/>Structured text<br/>Pronunciation<br/>Phrase list | `fr-CA-AntoineNeural` (Male)<sup>5,6</sup><br/>`fr-CA-JeanNeural` (Male)<sup>5,6</sup><br/>`fr-CA-SylvieNeural` (Female)<sup>5,6</sup> | Custom Neural Voice Pro<br/>Cross-lingual voice | 
| `fr-CH` | French (Switzerland)<sup>1</sup> | `fr-CH` | Plain text<br/>Pronunciation | `fr-CH-ArianeNeural` (Female)<sup>5,6</sup><br/>`fr-CH-FabriceNeural` (Male)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `fr-FR` | French (France)<sup>1</sup> | `fr-FR` | Plain text<br/>Structured text<br/>Pronunciation<br/>Phrase list | `fr-FR-AlainNeural` (Male)<sup>5,6</sup><br/>`fr-FR-BrigitteNeural` (Female)<sup>5,6</sup><br/>`fr-FR-CelesteNeural` (Female)<sup>5,6</sup><br/>`fr-FR-ClaudeNeural` (Male)<sup>5,6</sup><br/>`fr-FR-CoralieNeural` (Female)<sup>5,6</sup><br/>`fr-FR-DeniseNeural` (Female)<sup>2,5,6</sup><br/>`fr-FR-EloiseNeural` (Female)<sup>5,6</sup><br/>`fr-FR-HenriNeural` (Male)<sup>5,6</sup><br/>`fr-FR-JacquelineNeural` (Female)<sup>5,6</sup><br/>`fr-FR-JeromeNeural` (Male)<sup>5,6</sup><br/>`fr-FR-JosephineNeural` (Female)<sup>5,6</sup><br/>`fr-FR-MauriceNeural` (Male)<sup>5,6</sup><br/>`fr-FR-YvesNeural` (Male)<sup>5,6</sup><br/>`fr-FR-YvetteNeural` (Female)<sup>5,6</sup> | Custom Neural Voice Pro<br/>Custom Neural Voice Lite<br/>Cross-lingual voice | 
| `ga-IE` | Irish (Ireland)<sup>1</sup> | `ga-IE` | Plain text<br/>Pronunciation | `ga-IE-ColmNeural` (Male)<br/>`ga-IE-OrlaNeural` (Female) | Not supported | 
| `gl-ES` | Galician | `gl-ES` | Plain text | `gl-ES-RoiNeural` (Male)<br/>`gl-ES-SabelaNeural` (Female) | Not supported | 
| `gu-IN` | Gujarati (India)<sup>1</sup> | `gu-IN` | Plain text | `gu-IN-DhwaniNeural` (Female)<sup>5,6</sup><br/>`gu-IN-NiranjanNeural` (Male)<sup>5,6</sup> | Not supported | 
| `he-IL` | Hebrew (Israel) | `he-IL` | Plain text | `he-IL-AvriNeural` (Male)<sup>5,6</sup><br/>`he-IL-HilaNeural` (Female)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `hi-IN` | Hindi (India)<sup>1</sup> | `hi-IN` | Plain text | `hi-IN-MadhurNeural` (Male)<sup>5,6</sup><br/>`hi-IN-SwaraNeural` (Female)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `hr-HR` | Croatian (Croatia)<sup>1</sup> | `hr-HR` | Plain text<br/>Pronunciation | `hr-HR-GabrijelaNeural` (Female)<sup>5,6</sup><br/>`hr-HR-SreckoNeural` (Male)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `hu-HU` | Hungarian (Hungary)<sup>1</sup> | `hu-HU` | Plain text<br/>Pronunciation | `hu-HU-NoemiNeural` (Female)<sup>5,6</sup><br/>`hu-HU-TamasNeural` (Male)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `hy-AM` | Armenian (Armenia) | `hy-AM` | Plain text | Not supported |Not supported | 
| `id-ID` | Indonesian (Indonesia)<sup>1</sup> | `id-ID` | Plain text<br/>Pronunciation | `id-ID-ArdiNeural` (Male)<sup>5,6</sup><br/>`id-ID-GadisNeural` (Female)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `is-IS` | Icelandic (Iceland) | `is-IS` | Plain text | `is-IS-GudrunNeural` (Female)<br/>`is-IS-GunnarNeural` (Male) | Not supported | 
| `it-CH` | Italian (Switzerland)<sup>1</sup> | `it-CH` | Plain text | Not supported |Not supported | 
| `it-IT` | Italian (Italy)<sup>1</sup> | `it-IT` | Plain text<br/>Structured text<br/>Pronunciation<br/>Phrase list | `it-IT-BenignoNeural` (Male)<sup>4,5,6</sup><br/>`it-IT-CalimeroNeural` (Male)<sup>4,5,6</sup><br/>`it-IT-CataldoNeural` (Male)<sup>4,5,6</sup><br/>`it-IT-DiegoNeural` (Male)<sup>5,6</sup><br/>`it-IT-ElsaNeural` (Female)<sup>5,6</sup><br/>`it-IT-FabiolaNeural` (Female)<sup>4,5,6</sup><br/>`it-IT-FiammaNeural` (Female)<sup>4,5,6</sup><br/>`it-IT-GianniNeural` (Male)<sup>4,5,6</sup><br/>`it-IT-ImeldaNeural` (Female)<sup>4,5,6</sup><br/>`it-IT-IrmaNeural` (Female)<sup>4,5,6</sup><br/>`it-IT-IsabellaNeural` (Female)<sup>5,6</sup><br/>`it-IT-LisandroNeural` (Male)<sup>4,5,6</sup><br/>`it-IT-PalmiraNeural` (Female)<sup>4,5,6</sup><br/>`it-IT-PierinaNeural` (Female)<sup>4,5,6</sup><br/>`it-IT-RinaldoNeural` (Male)<sup>4,5,6</sup> | Custom Neural Voice Pro<br/>Custom Neural Voice Lite<br/>Cross-lingual voice | 
| `ja-JP` | Japanese (Japan)<sup>1</sup> | `ja-JP` | Plain text<br/>Structured text<br/>Phrase list | `ja-JP-KeitaNeural` (Male)<sup>5,6</sup><br/>`ja-JP-NanamiNeural` (Female)<sup>2,5,6</sup> | Custom Neural Voice Pro<br/>Custom Neural Voice Lite<br/>Cross-lingual voice | 
| `jv-ID` | Javanese (Indonesia) | `jv-ID` | Plain text | `jv-ID-DimasNeural` (Male)<br/>`jv-ID-SitiNeural` (Female) | Not supported | 
| `ka-GE` | Georgian (Georgia) | `ka-GE` | Plain text | `ka-GE-EkaNeural` (Female)<br/>`ka-GE-GiorgiNeural` (Male) | Not supported | 
| `kk-KZ` | Kazakh (Kazakhstan) | `kk-KZ` | Plain text | `kk-KZ-AigulNeural` (Female)<br/>`kk-KZ-DauletNeural` (Male) | Not supported | 
| `km-KH` | Khmer (Cambodia) | `km-KH` | Plain text | `km-KH-PisethNeural` (Male)<br/>`km-KH-SreymomNeural` (Female) | Not supported | 
| `kn-IN` | Kannada (India) | `kn-IN` | Plain text | `kn-IN-GaganNeural` (Male)<br/>`kn-IN-SapnaNeural` (Female) | Not supported | 
| `ko-KR` | Korean (Korea)<sup>1</sup> | `ko-KR` | Audio + human-labeled transcript<br/>Plain text<br/>Structured text<br/>Phrase list | `ko-KR-InJoonNeural` (Male)<sup>5,6</sup><br/>`ko-KR-SunHiNeural` (Female)<sup>5,6</sup> | Custom Neural Voice Pro<br/>Custom Neural Voice Lite<br/>Cross-lingual voice | 
| `lo-LA` | Lao (Laos) | `lo-LA` | Plain text | `lo-LA-ChanthavongNeural` (Male)<br/>`lo-LA-KeomanyNeural` (Female) | Not supported | 
| `lt-LT` | Lithuanian (Lithuania)<sup>1</sup> | `lt-LT` | Plain text<br/>Pronunciation | `lt-LT-LeonasNeural` (Male)<br/>`lt-LT-OnaNeural` (Female) | Not supported | 
| `lv-LV` | Latvian (Latvia)<sup>1</sup> | `lv-LV` | Plain text<br/>Pronunciation | `lv-LV-EveritaNeural` (Female)<br/>`lv-LV-NilsNeural` (Male) | Not supported | 
| `mk-MK` | Macedonian (Republic of North Macedonia) | `mk-MK` | Plain text | `mk-MK-AleksandarNeural` (Male)<br/>`mk-MK-MarijaNeural` (Female) | Not supported | 
| `ml-IN` | Malayalam (India) | Not supported |Not supported |`ml-IN-MidhunNeural` (Male)<br/>`ml-IN-SobhanaNeural` (Female) | Not supported | 
| `mn-MN` | Mongolian (Mongolia) | `mn-MN` | Plain text | `mn-MN-BataaNeural` (Male)<br/>`mn-MN-YesuiNeural` (Female) | Not supported | 
| `mr-IN` | Marathi (India)<sup>1</sup> | `mr-IN` | Plain text | `mr-IN-AarohiNeural` (Female)<sup>5,6</sup><br/>`mr-IN-ManoharNeural` (Male)<sup>5,6</sup> | Not supported | 
| `ms-MY` | Malay (Malaysia) | `ms-MY` | Plain text | `ms-MY-OsmanNeural` (Male)<sup>5,6</sup><br/>`ms-MY-YasminNeural` (Female)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `mt-MT` | Maltese (Malta)<sup>1</sup> | `mt-MT` | Plain text | `mt-MT-GraceNeural` (Female)<br/>`mt-MT-JosephNeural` (Male) | Not supported | 
| `my-MM` | Burmese (Myanmar) | `my-MM` | Plain text | `my-MM-NilarNeural` (Female)<br/>`my-MM-ThihaNeural` (Male) | Not supported | 
| `nb-NO` | Norwegian (Bokmål, Norway)<sup>1</sup> | `nb-NO` | Plain text | `nb-NO-FinnNeural` (Male)<sup>5,6</sup><br/>`nb-NO-IselinNeural` (Female)<sup>5,6</sup><br/>`nb-NO-PernilleNeural` (Female)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `ne-NP` | Nepali (Nepal) | `ne-NP` | Plain text | `ne-NP-HemkalaNeural` (Female)<br/>`ne-NP-SagarNeural` (Male) | Not supported | 
| `nl-BE` | Dutch (Belgium)<sup>1</sup> | `nl-BE` | Plain text | `nl-BE-ArnaudNeural` (Male)<sup>5,6</sup><br/>`nl-BE-DenaNeural` (Female)<sup>5,6</sup> | Not supported | 
| `nl-NL` | Dutch (Netherlands)<sup>1</sup> | `nl-NL` | Audio + human-labeled transcript<br/>Plain text<br/>Pronunciation | `nl-NL-ColetteNeural` (Female)<sup>5,6</sup><br/>`nl-NL-FennaNeural` (Female)<sup>5,6</sup><br/>`nl-NL-MaartenNeural` (Male)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `pl-PL` | Polish (Poland)<sup>1</sup> | `pl-PL` | Plain text<br/>Pronunciation | `pl-PL-AgnieszkaNeural` (Female)<sup>5,6</sup><br/>`pl-PL-MarekNeural` (Male)<sup>5,6</sup><br/>`pl-PL-ZofiaNeural` (Female)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `ps-AF` | Pashto (Afghanistan) | `ps-AF` | Plain text | `ps-AF-GulNawazNeural` (Male)<br/>`ps-AF-LatifaNeural` (Female) | Not supported | 
| `pt-BR` | Portuguese (Brazil)<sup>1</sup> | `pt-BR` | Audio + human-labeled transcript<br/>Plain text<br/>Structured text<br/>Pronunciation<br/>Phrase list | `pt-BR-AntonioNeural` (Male)<sup>5,6</sup><br/>`pt-BR-BrendaNeural` (Female)<sup>4,5,6</sup><br/>`pt-BR-DonatoNeural` (Male)<sup>4,5,6</sup><br/>`pt-BR-ElzaNeural` (Female)<sup>4,5,6</sup><br/>`pt-BR-FabioNeural` (Male)<sup>4,5,6</sup><br/>`pt-BR-FranciscaNeural` (Female)<sup>2,5,6</sup><br/>`pt-BR-GiovannaNeural` (Female)<sup>4,5,6</sup><br/>`pt-BR-HumbertoNeural` (Male)<sup>4,5,6</sup><br/>`pt-BR-JulioNeural` (Male)<sup>4,5,6</sup><br/>`pt-BR-LeilaNeural` (Female)<sup>4,5,6</sup><br/>`pt-BR-LeticiaNeural` (Female)<sup>4,5,6</sup><br/>`pt-BR-ManuelaNeural` (Female)<sup>4,5,6</sup><br/>`pt-BR-NicolauNeural` (Male)<sup>4,5,6</sup><br/>`pt-BR-ValerioNeural` (Male)<sup>4,5,6</sup><br/>`pt-BR-YaraNeural` (Female)<sup>4,5,6</sup> | Custom Neural Voice Pro<br/>Custom Neural Voice Lite<br/>Cross-lingual voice | 
| `pt-PT` | Portuguese (Portugal)<sup>1</sup> | `pt-PT` | Plain text<br/>Pronunciation | `pt-PT-DuarteNeural` (Male)<sup>5,6</sup><br/>`pt-PT-FernandaNeural` (Female)<sup>5,6</sup><br/>`pt-PT-RaquelNeural` (Female)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `ro-RO` | Romanian (Romania)<sup>1</sup> | `ro-RO` | Plain text<br/>Pronunciation | `ro-RO-AlinaNeural` (Female)<sup>5,6</sup><br/>`ro-RO-EmilNeural` (Male)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `ru-RU` | Russian (Russia)<sup>1</sup> | `ru-RU` | Plain text | `ru-RU-DariyaNeural` (Female)<sup>5,6</sup><br/>`ru-RU-DmitryNeural` (Male)<sup>5,6</sup><br/>`ru-RU-SvetlanaNeural` (Female)<sup>5,6</sup> | Custom Neural Voice Pro<br/>Cross-lingual voice | 
| `si-LK` | Sinhala (Sri Lanka) | `si-LK` | Plain text | `si-LK-SameeraNeural` (Male)<br/>`si-LK-ThiliniNeural` (Female) | Not supported | 
| `sk-SK` | Slovak (Slovakia)<sup>1</sup> | `sk-SK` | Plain text<br/>Pronunciation | `sk-SK-LukasNeural` (Male)<sup>5,6</sup><br/>`sk-SK-ViktoriaNeural` (Female)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `sl-SI` | Slovenian (Slovenia)<sup>1</sup> | `sl-SI` | Plain text<br/>Pronunciation | `sl-SI-PetraNeural` (Female)<sup>5,6</sup><br/>`sl-SI-RokNeural` (Male)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `so-SO` | Somali (Somalia) | `so-SO` | Plain text | `so-SO-MuuseNeural` (Male)<br/>`so-SO-UbaxNeural` (Female) | Not supported | 
| `sq-AL` | Albanian (Albania) | `sq-AL` | Plain text | `sq-AL-AnilaNeural` (Female)<br/>`sq-AL-IlirNeural` (Male) | Not supported | 
| `sr-RS` | Serbian (Serbia) | `sr-RS` | Plain text | `sr-RS-NicholasNeural` (Male)<br/>`sr-RS-SophieNeural` (Female) | Not supported | 
| `su-ID` | Sundanese (Indonesia) | Not supported |Not supported |`su-ID-JajangNeural` (Male)<br/>`su-ID-TutiNeural` (Female) | Not supported | 
| `sv-SE` | Swedish (Sweden)<sup>1</sup> | `sv-SE` | Plain text<br/>Pronunciation | `sv-SE-HilleviNeural` (Female)<sup>5,6</sup><br/>`sv-SE-MattiasNeural` (Male)<sup>5,6</sup><br/>`sv-SE-SofieNeural` (Female)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `sw-KE` | Swahili (Kenya) | `sw-KE` | Plain text | `sw-KE-RafikiNeural` (Male)<br/>`sw-KE-ZuriNeural` (Female) | Not supported | 
| `sw-TZ` | Swahili (Tanzania) | `sw-TZ` | Plain text | `sw-TZ-DaudiNeural` (Male)<sup>5,6</sup><br/>`sw-TZ-RehemaNeural` (Female)<sup>5,6</sup> | Not supported | 
| `ta-IN` | Tamil (India)<sup>1</sup> | `ta-IN` | Plain text | `ta-IN-PallaviNeural` (Female)<sup>5,6</sup><br/>`ta-IN-ValluvarNeural` (Male)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `ta-LK` | Tamil (Sri Lanka)<sup>1</sup> | Not supported |Not supported |`ta-LK-KumarNeural` (Male)<sup>5,6</sup><br/>`ta-LK-SaranyaNeural` (Female)<sup>5,6</sup> | Not supported | 
| `ta-MY` | Tamil (Malaysia)<sup>1</sup> | Not supported |Not supported |`ta-MY-KaniNeural` (Female)<sup>5,6</sup><br/>`ta-MY-SuryaNeural` (Male)<sup>5,6</sup> | Not supported | 
| `ta-SG` | Tamil (Singapore)<sup>1</sup> | Not supported |Not supported |`ta-SG-AnbuNeural` (Male)<sup>5,6</sup><br/>`ta-SG-VenbaNeural` (Female)<sup>5,6</sup> | Not supported | 
| `te-IN` | Telugu (India)<sup>1</sup> | `te-IN` | Plain text | `te-IN-MohanNeural` (Male)<sup>5,6</sup><br/>`te-IN-ShrutiNeural` (Female)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `th-TH` | Thai (Thailand)<sup>1</sup> | `th-TH` | Plain text | `th-TH-AcharaNeural` (Female)<sup>5,6</sup><br/>`th-TH-NiwatNeural` (Male)<sup>5,6</sup><br/>`th-TH-PremwadeeNeural` (Female)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `tr-TR` | Turkish (Turkey)<sup>1</sup> | `tr-TR` | Plain text | `tr-TR-AhmetNeural` (Male)<sup>5,6</sup><br/>`tr-TR-EmelNeural` (Female)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `uk-UA` | Ukrainian (Ukraine)<sup>1</sup> | `uk-UA` | Plain text | `uk-UA-OstapNeural` (Male)<sup>5,6</sup><br/>`uk-UA-PolinaNeural` (Female)<sup>5,6</sup> | Not supported | 
| `ur-IN` | Urdu (India) | Not supported |Not supported |`ur-IN-GulNeural` (Female)<sup>5,6</sup><br/>`ur-IN-SalmanNeural` (Male)<sup>5,6</sup> | Not supported | 
| `ur-PK` | Urdu (Pakistan) | Not supported |Not supported |`ur-PK-AsadNeural` (Male)<sup>5,6</sup><br/>`ur-PK-UzmaNeural` (Female)<sup>5,6</sup> | Not supported | 
| `uz-UZ` | Uzbek (Uzbekistan) | `uz-UZ` | Plain text | `uz-UZ-MadinaNeural` (Female)<br/>`uz-UZ-SardorNeural` (Male) | Not supported | 
| `vi-VN` | Vietnamese (Vietnam) | `vi-VN` | Plain text | `vi-VN-HoaiMyNeural` (Female)<sup>5,6</sup><br/>`vi-VN-NamMinhNeural` (Male)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `wuu-CN` | Wu Chinese (China) | `wuu-CN` | Plain text | Not supported |Not supported | 
| `yue-CN` | Cantonese (China) | `yue-CN` | Plain text | Not supported |Not supported | 
| `zh-CN` | Chinese (Mandarin, Simplified)<sup>1</sup> | `zh-CN` | Audio + human-labeled transcript<br/>Plain text<br/>Structured text<br/>Phrase list | `zh-CN-XiaochenNeural` (Female)<sup>5,6</sup><br/>`zh-CN-XiaohanNeural` (Female)<sup>2,5,6</sup><br/>`zh-CN-XiaomengNeural` (Female)<sup>2,4,5,6</sup><br/>`zh-CN-XiaomoNeural` (Female)<sup>2,3,5,6</sup><br/>`zh-CN-XiaoqiuNeural` (Female)<sup>5,6</sup><br/>`zh-CN-XiaoruiNeural` (Female)<sup>2,5,6</sup><br/>`zh-CN-XiaoshuangNeural` (Female)<sup>2,5,6</sup><br/>`zh-CN-XiaoxiaoNeural` (Female)<sup>2,5,6</sup><br/>`zh-CN-XiaoxuanNeural` (Female)<sup>2,3,5,6</sup><br/>`zh-CN-XiaoyanNeural` (Female)<sup>5,6</sup><br/>`zh-CN-XiaoyiNeural` (Female)<sup>2,4,5,6</sup><br/>`zh-CN-XiaoyouNeural` (Female)<sup>5,6</sup><br/>`zh-CN-XiaozhenNeural` (Female)<sup>2,4,5,6</sup><br/>`zh-CN-YunfengNeural` (Male)<sup>2,4,5,6</sup><br/>`zh-CN-YunhaoNeural` (Male)<sup>2,4,5,6</sup><br/>`zh-CN-YunjianNeural` (Male)<sup>2,4,5,6</sup><br/>`zh-CN-YunxiaNeural` (Male)<sup>2,4,5,6</sup><br/>`zh-CN-YunxiNeural` (Male)<sup>2,3,5,6</sup><br/>`zh-CN-YunyangNeural` (Male)<sup>2,5,6</sup><br/>`zh-CN-YunyeNeural` (Male)<sup>2,3,5,6</sup><br/>`zh-CN-YunzeNeural` (Male)<sup>2,3,4,5,6</sup> | Custom Neural Voice Pro<br/>Custom Neural Voice Lite<br/>Cross-lingual voice | 
| `zh-CN-LIAONING` | Chinese (Mandarin, Simplified)<sup>1</sup> | Not supported |Not supported |`zh-CN-liaoning-XiaobeiNeural` (Female)<sup>4</sup> | Not supported | 
| `zh-CN-SICHUAN` | Chinese (Mandarin, Simplified)<sup>1</sup> | `zh-CN-SICHUAN` | Plain text | `zh-CN-sichuan-YunxiNeural` (Male)<sup>4</sup> | Not supported | 
| `zh-HK` | Chinese (Cantonese, Traditional)<sup>1</sup> | `zh-HK` | Plain text | `zh-HK-HiuGaaiNeural` (Female)<sup>5,6</sup><br/>`zh-HK-HiuMaanNeural` (Female)<sup>5,6</sup><br/>`zh-HK-WanLungNeural` (Male)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `zh-TW` | Chinese (Taiwanese Mandarin)<sup>1</sup> | `zh-TW` | Plain text | `zh-TW-HsiaoChenNeural` (Female)<sup>5,6</sup><br/>`zh-TW-HsiaoYuNeural` (Female)<sup>5,6</sup><br/>`zh-TW-YunJheNeural` (Male)<sup>5,6</sup> | Custom Neural Voice Pro | 
| `zu-ZA` | Zulu (South Africa) | `zu-ZA` | Plain text | `zu-ZA-ThandoNeural` (Female)<br/>`zu-ZA-ThembaNeural` (Male) | Not supported | 

<sup>1</sup> The locale supports [language identification](language-identification.md) at the language level, such as English and German. If you include multiple locales of the same language, for example, `en-IN` and `en-US`, we'll only compare English (`en`) with the other candidate languages.

<sup>2</sup> The locale supports Style list

<sup>3</sup> The locale supports Role play list

<sup>4</sup> The neural voice is available in public preview. Voices and styles in public preview are only available in three service [regions](regions.md): East US, West Europe, and Southeast Asia. 

<sup>5</sup> The locale supports visemes. However, SVG is only supported for neural voices in the `en-US` locale, and blend shapes is only supported for neural voices in the `en-US` and `zh-CN` locales. For more information, see [Get facial position with viseme](how-to-speech-synthesis-viseme.md). 

<sup>6</sup> The locale supports phonemes. For more information, see [SSML phonetic alphabets](speech-ssml-phonetic-sets.md) and [Use phonemes to improve pronunciation](speech-synthesis-markup.md#use-phonemes-to-improve-pronunciation).

<sup>7</sup> For `en-US-JennyMultilingualNeural` the primary default locale is `en-US`. Additional locales are supported [using SSML](speech-synthesis-markup.md#adjust-speaking-languages).

### Speech-to-text

To improve accuracy, customization is available for some languages and base model versions by uploading audio + human-labeled transcripts, plain text, structured text, and pronunciation. By default, plain text customization is supported for all available base models. To learn more about customization, see [Custom Speech](./custom-speech-overview.md).

### Text-to-speech

Each prebuilt neural voice supports a specific language and dialect, identified by locale. You can try the demo and hear the voices on [this website](https://azure.microsoft.com/services/cognitive-services/text-to-speech/#features).

You can also get a full list of languages and voices supported for each specific region or endpoint through the [voices list API](rest-text-to-speech.md#get-a-list-of-voices). To learn how you can configure and adjust neural voices, such as Speaking Styles, see [Speech Synthesis Markup Language](speech-synthesis-markup.md#adjust-speaking-styles).

> [!IMPORTANT]
> Pricing varies for Prebuilt Neural Voice (referred to as *Neural* on the pricing page) and Custom Neural Voice (referred to as *Custom Neural* on the pricing page). For more information, see the [Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) page.

#### Prebuilt neural voices

Prebuilt neural voices are created from samples that use a 24-khz sample rate. All voices can upsample or downsample to other sample rates when synthesizing.

Please note that the following neural voices are retired.

- The English (United Kingdom) voice `en-GB-MiaNeural` retired on October 30, 2021. All service requests to `en-GB-MiaNeural` will be redirected to `en-GB-SoniaNeural` automatically as of October 30, 2021. If you're using container Neural TTS, [download](speech-container-howto.md#get-the-container-image-with-docker-pull) and deploy the latest version. Starting from October 30, 2021, all requests with previous versions will not succeed.
- The `en-US-JessaNeural` voice is retired and replaced by `en-US-AriaNeural`. If you were using "Jessa" before, convert  to "Aria." 

#### Custom Neural Voice

Custom Neural Voice lets you create synthetic voices that are rich in speaking styles. You can create a unique brand voice in multiple languages and styles by using a small set of recording data. There are two Custom Neural Voice (CNV) project types: CNV Pro and CNV Lite (preview). 

Select the right locale that matches your training data to train a custom neural voice model. For example, if the recording data is spoken in English with a British accent, select `en-GB`. 

With the cross-lingual feature (preview), you can transfer your custom neural voice model to speak a second language. For example, with the `zh-CN` data, you can create a voice that speaks `en-AU` or any of the languages with Cross-lingual support.  

#### Voice styles and roles

In some cases, you can adjust the speaking style to express different emotions like cheerfulness, empathy, and calm. You can optimize the voice for different scenarios like customer service, newscast, and voice assistant. With roles, the same voice can act as a different age and gender.

> [!NOTE]
> The angry, cheerful, excited, friendly, hopeful, sad, shouting, terrified, unfriendly, and whispering styles for en-US-DavisNeural, en-US-JaneNeural, en-US-JasonNeural, en-US-NancyNeural and en-US-TonyNeural are only available in three service regions: East US, West Europe, and Southeast Asia. 

To learn how you can configure and adjust neural voice styles and roles, see [Speech Synthesis Markup Language](speech-synthesis-markup.md#adjust-speaking-styles).

Use the following table to determine supported styles and roles for each neural voice.

|Voice|Styles|Style degree|Roles|
|-----|-----|-----|-----|
|en-US-AriaNeural|`angry`, `chat`, `cheerful`, `customerservice`, `empathetic`, `excited`, `friendly`, `hopeful`, `narration-professional`, `newscast-casual`, `newscast-formal`, `sad`, `shouting`, `terrified`, `unfriendly`, `whispering`|||
|en-US-DavisNeural <sup>Public preview</sup>|`angry`, `chat`, `cheerful`, `excited`, `friendly`, `hopeful`, `sad`, `shouting`, `terrified`, `unfriendly`, `whispering`|||
|en-US-GuyNeural|`angry`, `cheerful`, `excited`, `friendly`, `hopeful`, `newscast`, `sad`, `shouting`, `terrified`, `unfriendly`, `whispering`|||
|en-US-JaneNeural <sup>Public preview</sup>|`angry`, `cheerful`, `excited`, `friendly`, `hopeful`, `sad`, `shouting`, `terrified`, `unfriendly`, `whispering`|||
|en-US-JasonNeural <sup>Public preview</sup>|`angry`, `cheerful`, `excited`, `friendly`, `hopeful`, `sad`, `shouting`, `terrified`, `unfriendly`, `whispering`|||
|en-US-JennyNeural|`angry`, `assistant`, `chat`, `cheerful`,`customerservice`, `excited`, `friendly`, `hopeful`, `newscast`, `sad`, `shouting`, `terrified`, `unfriendly`, `whispering`|||
|en-US-NancyNeural <sup>Public preview</sup>|`angry`, `cheerful`, `excited`, `friendly`, `hopeful`, `sad`, `shouting`, `terrified`, `unfriendly`, `whispering`|||
|en-US-SaraNeural|`angry`, `cheerful`, `excited`, `friendly`, `hopeful`, `sad`, `shouting`, `terrified`, `unfriendly`, `whispering`|||
|en-US-TonyNeural <sup>Public preview</sup>|`angry`, `cheerful`, `excited`, `friendly`, `hopeful`, `sad`, `shouting`, `terrified`, `unfriendly`, `whispering`|||
|fr-FR-DeniseNeural |`cheerful`, `sad`||| 
|ja-JP-NanamiNeural|`chat`, `cheerful`, `customerservice`|||
|pt-BR-FranciscaNeural|`calm`|||
|zh-CN-XiaohanNeural|`affectionate`, `angry`, `calm`, `cheerful`, `disgruntled`, `embarrassed`, `fearful`, `gentle`, `sad`, `serious`|Supported||
|zh-CN-XiaomengNeural <sup>Public preview</sup>|`chat`|Supported||
|zh-CN-XiaomoNeural|`affectionate`, `angry`, `calm`, `cheerful`, `depressed`, `disgruntled`, `embarrassed`, `envious`, `fearful`, `gentle`, `sad`, `serious`|Supported|Supported|
|zh-CN-XiaoruiNeural|`angry`, `calm`, `fearful`, `sad`|Supported||
|zh-CN-XiaoshuangNeural|`chat`|Supported||
|zh-CN-XiaoxiaoNeural|`affectionate`, `angry`, `assistant`, `calm`, `chat`, `cheerful`, `customerservice`, `disgruntled`, `fearful`, `gentle`, `lyrical`, `newscast`, `poetry-reading`, `sad`, `serious`|Supported||
|zh-CN-XiaoxuanNeural|`angry`, `calm`, `cheerful`, `depressed`, `disgruntled`, `fearful`, `gentle`, `serious`|Supported|Supported|
|zh-CN-XiaoyiNeural <sup>Public preview</sup>|`affectionate`, `angry`, `cheerful`, `disgruntled`, `embarrassed`, `fearful`, `gentle`, `sad`, `serious`|Supported||
|zh-CN-XiaozhenNeural <sup>Public preview</sup>|`angry`, `cheerful`, `disgruntled`, `fearful`, `sad`, `serious`|Supported||
|zh-CN-YunfengNeural <sup>Public preview</sup>|`calm`, `angry`, ` disgruntled`, `cheerful`, `fearful`, `sad`, `serious`, `depressed`|Supported||
|zh-CN-YunhaoNeural <sup>Public preview</sup>|`general`, `advertisement-upbeat` <sup>Public preview</sup>|Supported||
|zh-CN-YunjianNeural <sup>Public preview</sup>|`narration-relaxed`, `sports-commentary`  <sup>Public preview</sup>, `sports-commentary-excited`  <sup>Public preview</sup>|Supported||
|zh-CN-YunxiNeural|`angry`, `assistant`, `cheerful`, `depressed`, `disgruntled`, `embarrassed`, `fearful`, `narration-relaxed`, `sad`, `serious`|Supported|Supported|
|zh-CN-YunxiaNeural <sup>Public preview</sup>|`angry`, `calm`, `cheerful`, `fearful`, `sad`|Supported||
|zh-CN-YunyangNeural|`customerservice`, `narration-professional`, `newscast-casual`|Supported||
|zh-CN-YunyeNeural|`angry`, `calm`, `cheerful`, `disgruntled`, `embarrassed`, `fearful`, `sad`, `serious`|Supported|Supported|
|zh-CN-YunzeNeural <sup>Public preview</sup>|`angry`, `calm`, `cheerful`, `depressed`, `disgruntled`, `documentary-narration`, `fearful`, `sad`, `serious`|Supported|Supported|

## Pronunciation assessment

The following table lists the released languages and public preview languages.

| Language | Locale |
|--|--|
|Chinese (Mandarin, Simplified)|`zh-CN`<sup>Public preview</sup> |
|English (Australia)|`en-AU`<sup>Public preview</sup> |
|English (United Kingdom)|`en-GB`<sup>Public preview</sup> |
|English (United States)|`en-US`<sup>General available</sup>|
|French (France)|`fr-FR`<sup>Public preview</sup> |
|German (Germany)|`de-DE`<sup>Public preview</sup> |
|Spanish (Spain)|`es-ES`<sup>Public preview</sup> |

> [!NOTE]
> For pronunciation assessment, `en-US` and `en-GB` are available in [all regions](regions.md#speech-service), `zh-CN` is available in East Asia and Southeast Asia regions, `de-DE`, `es-ES`, and `fr-FR` are available in West Europe region, and `en-AU` is available in Australia East region.

## Speech translation

Speech Translation supports different languages for speech-to-speech and speech-to-text translation. The available target languages depend on whether the translation target is speech or text. 

To set the input speech recognition language, specify the full locale with a dash (`-`) separator. See the [speech-to-text language table](#speech-to-text) above. The default language is `en-US` if you don't specify a language.

To set the translation target language, with few exceptions you only specify the language code that precedes the locale dash (`-`) separator. For example, use `es` for Spanish (Spain) instead of `es-ES`. See the speech translation target language table below. The default language is `en` if you don't specify a language.

### Text languages

| Text language           | Language code |
|:------------------------|:-------------:|
| Afrikaans | `af` |
| Albanian | `sq` |
| Amharic | `am` |
| Arabic | `ar` |
| Armenian | `hy` |
| Assamese | `as` |
| Azerbaijani | `az` |
| Bangla | `bn` |
| Bosnian (Latin) | `bs` |
| Bulgarian | `bg` |
| Cantonese (Traditional) | `yue` |
| Catalan | `ca` |
| Chinese (Literary) | `lzh` |
| Chinese Simplified | `zh-Hans` |
| Chinese Traditional | `zh-Hant` |
| Croatian | `hr` |
| Czech | `cs` |
| Danish | `da` |
| Dari | `prs` |
| Dutch | `nl` |
| English | `en` |
| Estonian | `et` |
| Fijian | `fj` |
| Filipino | `fil` |
| Finnish | `fi` |
| French | `fr` |
| French (Canada) | `fr-ca` |
| German | `de` |
| Greek | `el` |
| Gujarati | `gu` |
| Haitian Creole | `ht` |
| Hebrew | `he` |
| Hindi | `hi` |
| Hmong Daw | `mww` |
| Hungarian | `hu` |
| Icelandic | `is` |
| Indonesian | `id` |
| Inuktitut | `iu` |
| Irish | `ga` |
| Italian | `it` |
| Japanese | `ja` |
| Kannada | `kn` |
| Kazakh | `kk` |
| Khmer | `km` |
| Klingon | `tlh-Latn` |
| Klingon (plqaD) | `tlh-Piqd` |
| Korean | `ko` |
| Kurdish (Central) | `ku` |
| Kurdish (Northern) | `kmr` |
| Lao | `lo` |
| Latvian | `lv` |
| Lithuanian | `lt` |
| Malagasy | `mg` |
| Malay | `ms` |
| Malayalam | `ml` |
| Maltese | `mt` |
| Maori | `mi` |
| Marathi | `mr` |
| Myanmar | `my` |
| Nepali | `ne` |
| Norwegian | `nb` |
| Odia | `or` |
| Pashto | `ps` |
| Persian | `fa` |
| Polish | `pl` |
| Portuguese (Brazil) | `pt` |
| Portuguese (Portugal) | `pt-pt` |
| Punjabi | `pa` |
| Queretaro Otomi | `otq` |
| Romanian | `ro` |
| Russian | `ru` |
| Samoan | `sm` |
| Serbian (Cyrillic) | `sr-Cyrl` |
| Serbian (Latin) | `sr-Latn` |
| Slovak | `sk` |
| Slovenian | `sl` |
| Spanish | `es` |
| Swahili | `sw` |
| Swedish | `sv` |
| Tahitian | `ty` |
| Tamil | `ta` |
| Telugu | `te` |
| Thai | `th` |
| Tigrinya | `ti` |
| Tongan | `to` |
| Turkish | `tr` |
| Ukrainian | `uk` |
| Urdu | `ur` |
| Vietnamese | `vi` |
| Welsh | `cy` |
| Yucatec Maya | `yua` |

## Speaker recognition

Speaker recognition is mostly language agnostic. We built a universal model for text-independent speaker recognition by combining various data sources from multiple languages. We've tuned and evaluated the model on the languages and locales that appear in the following table. For more information on speaker recognition, see the [overview](speaker-recognition-overview.md).

| Language | Locale (BCP-47) | Text-dependent verification | Text-independent verification | Text-independent identification |
|----|----|----|----|----|
|English (US)  |  `en-US`  |  Yes  |  Yes  |  Yes |
|Chinese (Mandarin, simplified) | `zh-CN`     |     n/a |     Yes |     Yes|
|English (Australia)     | `en-AU`    | n/a     | Yes     | Yes|
|English (Canada)     | `en-CA`     | n/a |     Yes |     Yes|
|English (India)     | `en-IN`     | n/a |     Yes |     Yes|
|English (UK)     | `en-GB`     | n/a     | Yes     | Yes|
|French (Canada)     | `fr-CA`     | n/a     | Yes |     Yes|
|French (France)     | `fr-FR`     | n/a     | Yes     | Yes|
|German (Germany)     | `de-DE`     | n/a     | Yes     | Yes|
|Italian | `it-IT`     |     n/a     | Yes |     Yes|
|Japanese     | `ja-JP` | n/a     | Yes     | Yes|
|Portuguese (Brazil) | `pt-BR` |     n/a |     Yes |     Yes|
|Spanish (Mexico)     | `es-MX`     | n/a |     Yes |     Yes|
|Spanish (Spain)     | `es-ES` | n/a     | Yes |     Yes|

## Custom keyword and keyword verification

The following table outlines supported languages for custom keyword and keyword verification.

| Language | Locale (BCP-47) | Custom keyword | Keyword verification |
| -------- | --------------- | -------------- | -------------------- |
| Chinese (Mandarin, Simplified) | zh-CN | Yes | Yes |
| English (United States) | en-US | Yes | Yes |
| Japanese (Japan) | ja-JP | No | Yes |
| Portuguese (Brazil) | pt-BR | No | Yes |

## Intent Recognition Pattern Matcher

The Intent Recognizer Pattern Matcher supports the following locales:

| Locale                            | Locale (BCP-47) |
|-----------------------------------|-----------------|
| English (United States)           | `en-US`         |
| Chinese (Cantonese, Traditional)  | `zh-HK`         |
| Chinese (Mandarin, Simplified)    | `zh-CN`         |

## Next steps

* [Region support](regions.md)
