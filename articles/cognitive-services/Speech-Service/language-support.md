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

| Locale (BCP-47) | Language | Speech-to-text | Custom Speech support | Text-to-speech voices | Custom Neural Voice |
| ----- | ----- | ----- | ----- | ----- | ----- |
| `af-ZA` | Afrikaans (South Africa) | `af-ZA` | Plain text | `af-ZA-AdriNeural` (Female)<br/>`af-ZA-WillemNeural` (Male) | Not supported | 
| `am-ET` | Amharic (Ethiopia) | `am-ET` | Plain text | `am-ET-AmehaNeural` (Male)<br/>`am-ET-MekdesNeural` (Female) | Not supported | 
| `ar-AE` | Arabic (United Arab Emirates)<sup>1</sup> | `ar-AE` | Plain text | `ar-AE-FatimaNeural`<sup>5,6</sup> (Female)<br/>`ar-AE-HamdanNeural`<sup>5,6</sup> (Male) | Not supported | 
| `ar-BH` | Arabic (Bahrain)<sup>1</sup> | `ar-BH` | Plain text | `ar-BH-AliNeural`<sup>5,6</sup> (Male)<br/>`ar-BH-LailaNeural`<sup>5,6</sup> (Female) | Not supported | 
| `ar-DZ` | Arabic (Algeria)<sup>1</sup> | `ar-DZ` | Plain text | `ar-DZ-AminaNeural`<sup>5,6</sup> (Female)<br/>`ar-DZ-IsmaelNeural`<sup>5,6</sup> (Male) | Not supported | 
| `ar-EG` | Arabic (Egypt)<sup>1</sup> | `ar-EG` | Plain text | `ar-EG-SalmaNeural`<sup>5,6</sup> (Female)<br/>`ar-EG-ShakirNeural`<sup>5,6</sup> (Male) | Custom Neural Voice Pro | 
| `ar-IL` | Arabic (Israel)<sup>1</sup> | `ar-IL` | Plain text | Not supported |Not supported | 
| `ar-IQ` | Arabic (Iraq)<sup>1</sup> | `ar-IQ` | Plain text | `ar-IQ-BasselNeural`<sup>5,6</sup> (Male)<br/>`ar-IQ-RanaNeural`<sup>5,6</sup> (Female) | Not supported | 
| `ar-JO` | Arabic (Jordan)<sup>1</sup> | `ar-JO` | Plain text | `ar-JO-SanaNeural`<sup>5,6</sup> (Female)<br/>`ar-JO-TaimNeural`<sup>5,6</sup> (Male) | Not supported | 
| `ar-KW` | Arabic (Kuwait)<sup>1</sup> | `ar-KW` | Plain text | `ar-KW-FahedNeural`<sup>5,6</sup> (Male)<br/>`ar-KW-NouraNeural`<sup>5,6</sup> (Female) | Not supported | 
| `ar-LB` | Arabic (Lebanon)<sup>1</sup> | `ar-LB` | Plain text | `ar-LB-LaylaNeural`<sup>5,6</sup> (Female)<br/>`ar-LB-RamiNeural`<sup>5,6</sup> (Male) | Not supported | 
| `ar-LY` | Arabic (Libya)<sup>1</sup> | `ar-LY` | Plain text | `ar-LY-ImanNeural`<sup>5,6</sup> (Female)<br/>`ar-LY-OmarNeural`<sup>5,6</sup> (Male) | Not supported | 
| `ar-MA` | Arabic (Morocco)<sup>1</sup> | `ar-MA` | Plain text | `ar-MA-JamalNeural`<sup>5,6</sup> (Male)<br/>`ar-MA-MounaNeural`<sup>5,6</sup> (Female) | Not supported | 
| `ar-OM` | Arabic (Oman)<sup>1</sup> | `ar-OM` | Plain text | `ar-OM-AbdullahNeural`<sup>5,6</sup> (Male)<br/>`ar-OM-AyshaNeural`<sup>5,6</sup> (Female) | Not supported | 
| `ar-PS` | Arabic (Palestinian Territories)<sup>1</sup> | `ar-PS` | Plain text | Not supported |Not supported | 
| `ar-QA` | Arabic (Qatar)<sup>1</sup> | `ar-QA` | Plain text | `ar-QA-AmalNeural`<sup>5,6</sup> (Female)<br/>`ar-QA-MoazNeural`<sup>5,6</sup> (Male) | Not supported | 
| `ar-SA` | Arabic (Saudi Arabia)<sup>1</sup> | `ar-SA` | Plain text | `ar-SA-HamedNeural`<sup>5,6</sup> (Male)<br/>`ar-SA-ZariyahNeural`<sup>5,6</sup> (Female) | Custom Neural Voice Pro | 
| `ar-SY` | Arabic (Syria)<sup>1</sup> | `ar-SY` | Plain text | `ar-SY-AmanyNeural`<sup>5,6</sup> (Female)<br/>`ar-SY-LaithNeural`<sup>5,6</sup> (Male) | Not supported | 
| `ar-TN` | Arabic (Tunisia)<sup>1</sup> | `ar-TN` | Plain text | `ar-TN-HediNeural`<sup>5,6</sup> (Male)<br/>`ar-TN-ReemNeural`<sup>5,6</sup> (Female) | Not supported | 
| `ar-YE` | Arabic (Yemen)<sup>1</sup> | `ar-YE` | Plain text | `ar-YE-MaryamNeural`<sup>5,6</sup> (Female)<br/>`ar-YE-SalehNeural`<sup>5,6</sup> (Male) | Not supported | 
| `az-AZ` | Azerbaijani (Azerbaijan) | `az-AZ` | Plain text | `az-AZ-BabekNeural` (Male)<br/>`az-AZ-BanuNeural` (Female) | Not supported | 
| `bg-BG` | Bulgarian (Bulgaria)<sup>1</sup> | `bg-BG` | Plain text | `bg-BG-BorislavNeural`<sup>5,6</sup> (Male)<br/>`bg-BG-KalinaNeural`<sup>5,6</sup> (Female) | Custom Neural Voice Pro | 
| `bn-BD` | Bangla (Bangladesh) | Not supported |Not supported |`bn-BD-NabanitaNeural` (Female)<br/>`bn-BD-PradeepNeural` (Male) | Not supported | 
| `bn-IN` | Bengali (India) | `bn-IN` | Plain text | `bn-IN-BashkarNeural` (Male)<br/>`bn-IN-TanishaaNeural` (Female) | Not supported | 
| `bs-BA` | Bosnian (Bosnia) | `bs-BA` | Plain text | `bs-BA-GoranNeural` (Male)<br/>`bs-BA-VesnaNeural` (Female) | Not supported | 
| `ca-ES` | Catalan (Spain)<sup>1</sup> | `ca-ES` | Plain text<br/><br/>Pronunciation | `ca-ES-AlbaNeural`<sup>5,6</sup> (Female)<br/>`ca-ES-EnricNeural`<sup>5,6</sup> (Male)<br/>`ca-ES-JoanaNeural`<sup>5,6</sup> (Female) | Custom Neural Voice Pro | 
| `cs-CZ` | Czech (Czech)<sup>1</sup> | `cs-CZ` | Plain text<br/><br/>Pronunciation | `cs-CZ-AntoninNeural`<sup>5,6</sup> (Male)<br/>`cs-CZ-VlastaNeural`<sup>5,6</sup> (Female) | Custom Neural Voice Pro | 
| `cy-GB` | Welsh (United Kingdom) | `cy-GB` | Plain text | `cy-GB-AledNeural` (Male)<br/>`cy-GB-NiaNeural` (Female) | Not supported | 
| `da-DK` | Danish (Denmark)<sup>1</sup> | `da-DK` | Plain text<br/><br/>Pronunciation | `da-DK-ChristelNeural`<sup>5,6</sup> (Female)<br/>`da-DK-JeppeNeural`<sup>5,6</sup> (Male) | Custom Neural Voice Pro | 
| `de-AT` | German (Austria)<sup>1</sup> | `de-AT` | Plain text<br/><br/>Pronunciation | `de-AT-IngridNeural`<sup>5,6</sup> (Female)<br/>`de-AT-JonasNeural`<sup>5,6</sup> (Male) | Custom Neural Voice Pro | 
| `de-CH` | German (Switzerland)<sup>1</sup> | `de-CH` | Audio + human-labeled transcript<br/><br/>Plain text<br/><br/>Pronunciation | `de-CH-JanNeural`<sup>5,6</sup> (Male)<br/>`de-CH-LeniNeural`<sup>5,6</sup> (Female) | Custom Neural Voice Pro | 
| `de-DE` | German (Germany)<sup>1</sup> | `de-DE` | Audio + human-labeled transcript<br/><br/>Plain text<br/><br/>Structured text<br/><br/>Pronunciation<br/><br/>Phrase list | `de-DE-AmalaNeural`<sup>5,6</sup> (Female)<br/>`de-DE-BerndNeural`<sup>5,6</sup> (Male)<br/>`de-DE-ChristophNeural`<sup>5,6</sup> (Male)<br/>`de-DE-ConradNeural`<sup>5,6</sup> (Male)<br/>`de-DE-ElkeNeural`<sup>5,6</sup> (Female)<br/>`de-DE-GiselaNeural`<sup>5,6,8</sup> (Female)<br/>`de-DE-KasperNeural`<sup>5,6</sup> (Male)<br/>`de-DE-KatjaNeural`<sup>5,6</sup> (Female)<br/>`de-DE-KillianNeural`<sup>5,6</sup> (Male)<br/>`de-DE-KlarissaNeural`<sup>5,6</sup> (Female)<br/>`de-DE-KlausNeural`<sup>5,6</sup> (Male)<br/>`de-DE-LouisaNeural`<sup>5,6</sup> (Female)<br/>`de-DE-MajaNeural`<sup>5,6</sup> (Female)<br/>`de-DE-RalfNeural`<sup>5,6</sup> (Male)<br/>`de-DE-TanjaNeural`<sup>5,6</sup> (Female) | Custom Neural Voice Pro<br/><br/>Custom Neural Voice Lite (Preview)<br/><br/>Cross-lingual voice (Preview) | 
| `el-GR` | Greek (Greece)<sup>1</sup> | `el-GR` | Plain text | `el-GR-AthinaNeural`<sup>5,6</sup> (Female)<br/>`el-GR-NestorasNeural`<sup>5,6</sup> (Male) | Custom Neural Voice Pro | 
| `en-AU` | English (Australia)<sup>1</sup> | `en-AU` | Audio + human-labeled transcript<br/><br/>Plain text<br/><br/>Structured text<br/><br/>Pronunciation<br/><br/>Phrase list | `en-AU-NatashaNeural`<sup>5,6</sup> (Female)<br/>`en-AU-WilliamNeural`<sup>5,6</sup> (Male) | Custom Neural Voice Pro<br/><br/>Custom Neural Voice Lite (Preview)<br/><br/>Cross-lingual voice (Preview) | 
| `en-CA` | English (Canada)<sup>1</sup> | `en-CA` | Audio + human-labeled transcript<br/><br/>Plain text<br/><br/>Structured text<br/><br/>Pronunciation<br/><br/>Phrase list | `en-CA-ClaraNeural`<sup>5,6</sup> (Female)<br/>`en-CA-LiamNeural`<sup>5,6</sup> (Male) | Custom Neural Voice Pro<br/><br/>Custom Neural Voice Lite (Preview) | 
| `en-GB` | English (United Kingdom)<sup>1</sup> | `en-GB` | Audio + human-labeled transcript<br/><br/>Plain text<br/><br/>Structured text<br/><br/>Pronunciation<br/><br/>Phrase list | `en-GB-AbbiNeural`<sup>5,6</sup> (Female)<br/>`en-GB-AlfieNeural`<sup>5,6</sup> (Male)<br/>`en-GB-BellaNeural`<sup>5,6</sup> (Female)<br/>`en-GB-ElliotNeural`<sup>5,6</sup> (Male)<br/>`en-GB-EthanNeural`<sup>5,6</sup> (Male)<br/>`en-GB-HollieNeural`<sup>5,6</sup> (Female)<br/>`en-GB-LibbyNeural`<sup>5,6</sup> (Female)<br/>`en-GB-MaisieNeural`<sup>5,6,8</sup> (Female)<br/>`en-GB-NoahNeural`<sup>5,6</sup> (Male)<br/>`en-GB-OliverNeural`<sup>5,6</sup> (Male)<br/>`en-GB-OliviaNeural`<sup>5,6</sup> (Female)<br/>`en-GB-RyanNeural`<sup>5,6</sup> (Male)<br/>`en-GB-SoniaNeural`<sup>5,6</sup> (Female)<br/>`en-GB-ThomasNeural`<sup>5,6</sup> (Male) | Custom Neural Voice Pro<br/><br/>Custom Neural Voice Lite (Preview)<br/><br/>Cross-lingual voice (Preview) | 
| `en-GH` | English (Ghana)<sup>1</sup> | `en-GH` | Plain text<br/><br/>Structured text<br/><br/>Pronunciation | Not supported |Not supported | 
| `en-HK` | English (Hongkong)<sup>1</sup> | `en-HK` | Plain text<br/><br/>Pronunciation | `en-HK-SamNeural`<sup>5,6</sup> (Male)<br/>`en-HK-YanNeural`<sup>5,6</sup> (Female) | Not supported | 
| `en-IE` | English (Ireland)<sup>1</sup> | `en-IE` | Plain text<br/><br/>Pronunciation | `en-IE-ConnorNeural`<sup>5,6</sup> (Male)<br/>`en-IE-EmilyNeural`<sup>5,6</sup> (Female) | Custom Neural Voice Pro | 
| `en-IN` | English (India)<sup>1</sup> | `en-IN` | Audio + human-labeled transcript<br/><br/>Plain text<br/><br/>Structured text<br/><br/>Pronunciation<br/><br/>Phrase list | `en-IN-NeerjaNeural`<sup>5,6</sup> (Female)<br/>`en-IN-PrabhatNeural`<sup>5,6</sup> (Male) | Custom Neural Voice Pro | 
| `en-KE` | English (Kenya)<sup>1</sup> | `en-KE` | Plain text<br/><br/>Structured text<br/><br/>Pronunciation | `en-KE-AsiliaNeural`<sup>5,6</sup> (Female)<br/>`en-KE-ChilembaNeural`<sup>5,6</sup> (Male) | Not supported | 
| `en-NG` | English (Nigeria)<sup>1</sup> | `en-NG` | Plain text<br/><br/>Pronunciation | `en-NG-AbeoNeural`<sup>5,6</sup> (Male)<br/>`en-NG-EzinneNeural`<sup>5,6</sup> (Female) | Not supported | 
| `en-NZ` | English (New Zealand)<sup>1</sup> | `en-NZ` | Audio + human-labeled transcript<br/><br/>Plain text<br/><br/>Pronunciation | `en-NZ-MitchellNeural`<sup>5,6</sup> (Male)<br/>`en-NZ-MollyNeural`<sup>5,6</sup> (Female) | Not supported | 
| `en-PH` | English (Philippines)<sup>1</sup> | `en-PH` | Plain text<br/><br/>Pronunciation | `en-PH-JamesNeural`<sup>5,6</sup> (Male)<br/>`en-PH-RosaNeural`<sup>5,6</sup> (Female) | Not supported | 
| `en-SG` | English (Singapore)<sup>1</sup> | `en-SG` | Plain text<br/><br/>Pronunciation | `en-SG-LunaNeural`<sup>5,6</sup> (Female)<br/>`en-SG-WayneNeural`<sup>5,6</sup> (Male) | Not supported | 
| `en-TZ` | English (Tanzania)<sup>1</sup> | `en-TZ` | Plain text<br/><br/>Structured text<br/><br/>Pronunciation | `en-TZ-ElimuNeural`<sup>5,6</sup> (Male)<br/>`en-TZ-ImaniNeural`<sup>5,6</sup> (Female) | Not supported | 
| `en-US` | English (United States)<sup>1</sup> | `en-US` | Audio + human-labeled transcript<br/><br/>Plain text<br/><br/>Structured text<br/><br/>Pronunciation<br/><br/>Phrase list | `en-US-AIGenerate1Neural`<sup>4,5,6</sup> (Male)<br/>`en-US-AIGenerate2Neural`<sup>4,5,6</sup> (Female)<br/>`en-US-AmberNeural`<sup>5,6</sup> (Female)<br/>`en-US-AnaNeural`<sup>5,6,8</sup> (Female)<br/>`en-US-AriaNeural`<sup>2,5,6</sup> (Female)<br/>`en-US-AshleyNeural`<sup>5,6</sup> (Female)<br/>`en-US-BrandonNeural`<sup>5,6</sup> (Male)<br/>`en-US-ChristopherNeural`<sup>5,6</sup> (Male)<br/>`en-US-CoraNeural`<sup>5,6</sup> (Female)<br/>`en-US-DavisNeural`<sup>2,4,5,6</sup> (Male)<br/>`en-US-ElizabethNeural`<sup>5,6</sup> (Female)<br/>`en-US-EricNeural`<sup>5,6</sup> (Male)<br/>`en-US-GuyNeural`<sup>2,5,6</sup> (Male)<br/>`en-US-JacobNeural`<sup>5,6</sup> (Male)<br/>`en-US-JaneNeural`<sup>2,4,5,6</sup> (Female)<br/>`en-US-JasonNeural`<sup>2,4,5,6</sup> (Male)<br/>`en-US-JennyMultilingualNeural`<sup>5,6,7</sup> (Female)<br/>`en-US-JennyNeural`<sup>2,5,6</sup> (Female)<br/>`en-US-MichelleNeural`<sup>5,6</sup> (Female)<br/>`en-US-MonicaNeural`<sup>5,6</sup> (Female)<br/>`en-US-NancyNeural`<sup>2,4,5,6</sup> (Female)<br/>`en-US-RogerNeural`<sup>4,5,6</sup> (Male)<br/>`en-US-SaraNeural`<sup>2,5,6</sup> (Female)<br/>`en-US-TonyNeural`<sup>2,4,5,6</sup> (Male) | Custom Neural Voice Pro<br/><br/>Custom Neural Voice Lite (Preview)<br/><br/>Cross-lingual voice (Preview) | 
| `en-ZA` | English (South Africa)<sup>1</sup> | `en-ZA` | Plain text<br/><br/>Pronunciation | `en-ZA-LeahNeural`<sup>5,6</sup> (Female)<br/>`en-ZA-LukeNeural`<sup>5,6</sup> (Male) | Not supported | 
| `es-AR` | Spanish (Argentina)<sup>1</sup> | `es-AR` | Plain text<br/><br/>Pronunciation | `es-AR-ElenaNeural`<sup>5,6</sup> (Female)<br/>`es-AR-TomasNeural`<sup>5,6</sup> (Male) | Not supported | 
| `es-BO` | Spanish (Bolivia)<sup>1</sup> | `es-BO` | Plain text<br/><br/>Pronunciation | `es-BO-MarceloNeural`<sup>5,6</sup> (Male)<br/>`es-BO-SofiaNeural`<sup>5,6</sup> (Female) | Not supported | 
| `es-CL` | Spanish (Chile)<sup>1</sup> | `es-CL` | Plain text<br/><br/>Pronunciation | `es-CL-CatalinaNeural`<sup>5,6</sup> (Female)<br/>`es-CL-LorenzoNeural`<sup>5,6</sup> (Male) | Not supported | 
| `es-CO` | Spanish (Colombia)<sup>1</sup> | `es-CO` | Plain text<br/><br/>Pronunciation | `es-CO-GonzaloNeural`<sup>5,6</sup> (Male)<br/>`es-CO-SalomeNeural`<sup>5,6</sup> (Female) | Not supported | 
| `es-CR` | Spanish (Costa Rica)<sup>1</sup> | `es-CR` | Plain text<br/><br/>Pronunciation | `es-CR-JuanNeural`<sup>5,6</sup> (Male)<br/>`es-CR-MariaNeural`<sup>5,6</sup> (Female) | Not supported | 
| `es-CU` | Spanish (Cuba)<sup>1</sup> | `es-CU` | Plain text<br/><br/>Pronunciation | `es-CU-BelkysNeural`<sup>5,6</sup> (Female)<br/>`es-CU-ManuelNeural`<sup>5,6</sup> (Male) | Not supported | 
| `es-DO` | Spanish (Dominican Republic)<sup>1</sup> | `es-DO` | Plain text<br/><br/>Pronunciation | `es-DO-EmilioNeural`<sup>5,6</sup> (Male)<br/>`es-DO-RamonaNeural`<sup>5,6</sup> (Female) | Not supported | 
| `es-EC` | Spanish (Ecuador)<sup>1</sup> | `es-EC` | Plain text<br/><br/>Pronunciation | `es-EC-AndreaNeural`<sup>5,6</sup> (Female)<br/>`es-EC-LuisNeural`<sup>5,6</sup> (Male) | Not supported | 
| `es-ES` | Spanish (Spain)<sup>1</sup> | `es-ES` | Audio + human-labeled transcript<br/><br/>Plain text<br/><br/>Structured text<br/><br/>Pronunciation<br/><br/>Phrase list | `es-ES-AlvaroNeural`<sup>5,6</sup> (Male)<br/>`es-ES-ElviraNeural`<sup>5,6</sup> (Female) | Custom Neural Voice Pro<br/><br/>Cross-lingual voice (Preview) | 
| `es-GQ` | Spanish (Equatorial Guinea)<sup>1</sup> | `es-GQ` | Plain text | `es-GQ-JavierNeural`<sup>5,6</sup> (Male)<br/>`es-GQ-TeresaNeural`<sup>5,6</sup> (Female) | Not supported | 
| `es-GT` | Spanish (Guatemala)<sup>1</sup> | `es-GT` | Plain text<br/><br/>Pronunciation | `es-GT-AndresNeural`<sup>5,6</sup> (Male)<br/>`es-GT-MartaNeural`<sup>5,6</sup> (Female) | Not supported | 
| `es-HN` | Spanish (Honduras)<sup>1</sup> | `es-HN` | Plain text<br/><br/>Pronunciation | `es-HN-CarlosNeural`<sup>5,6</sup> (Male)<br/>`es-HN-KarlaNeural`<sup>5,6</sup> (Female) | Not supported | 
| `es-MX` | Spanish (Mexico)<sup>1</sup> | `es-MX` | Audio + human-labeled transcript<br/><br/>Plain text<br/><br/>Structured text<br/><br/>Pronunciation<br/><br/>Phrase list | `es-MX-BeatrizNeural`<sup>4,5,6</sup> (Female)<br/>`es-MX-CandelaNeural`<sup>4,5,6</sup> (Female)<br/>`es-MX-CarlotaNeural`<sup>4,5,6</sup> (Female)<br/>`es-MX-CecilioNeural`<sup>4,5,6</sup> (Male)<br/>`es-MX-DaliaNeural`<sup>5,6</sup> (Female)<br/>`es-MX-GerardoNeural`<sup>4,5,6</sup> (Male)<br/>`es-MX-JorgeNeural`<sup>5,6</sup> (Male)<br/>`es-MX-LarissaNeural`<sup>4,5,6</sup> (Female)<br/>`es-MX-LibertoNeural`<sup>4,5,6</sup> (Male)<br/>`es-MX-LucianoNeural`<sup>4,5,6</sup> (Male)<br/>`es-MX-MarinaNeural`<sup>4,5,6</sup> (Female)<br/>`es-MX-NuriaNeural`<sup>4,5,6</sup> (Female)<br/>`es-MX-PelayoNeural`<sup>4,5,6</sup> (Male)<br/>`es-MX-RenataNeural`<sup>4,5,6</sup> (Female)<br/>`es-MX-YagoNeural`<sup>4,5,6</sup> (Male) | Custom Neural Voice Pro<br/><br/>Custom Neural Voice Lite (Preview)<br/><br/>Cross-lingual voice (Preview) | 
| `es-NI` | Spanish (Nicaragua)<sup>1</sup> | `es-NI` | Plain text<br/><br/>Pronunciation | `es-NI-FedericoNeural`<sup>5,6</sup> (Male)<br/>`es-NI-YolandaNeural`<sup>5,6</sup> (Female) | Not supported | 
| `es-PA` | Spanish (Panama)<sup>1</sup> | `es-PA` | Plain text<br/><br/>Pronunciation | `es-PA-MargaritaNeural`<sup>5,6</sup> (Female)<br/>`es-PA-RobertoNeural`<sup>5,6</sup> (Male) | Not supported | 
| `es-PE` | Spanish (Peru)<sup>1</sup> | `es-PE` | Plain text<br/><br/>Pronunciation | `es-PE-AlexNeural`<sup>5,6</sup> (Male)<br/>`es-PE-CamilaNeural`<sup>5,6</sup> (Female) | Not supported | 
| `es-PR` | Spanish (Puerto Rico)<sup>1</sup> | `es-PR` | Plain text<br/><br/>Pronunciation | `es-PR-KarinaNeural`<sup>5,6</sup> (Female)<br/>`es-PR-VictorNeural`<sup>5,6</sup> (Male) | Not supported | 
| `es-PY` | Spanish (Paraguay)<sup>1</sup> | `es-PY` | Plain text<br/><br/>Pronunciation | `es-PY-MarioNeural`<sup>5,6</sup> (Male)<br/>`es-PY-TaniaNeural`<sup>5,6</sup> (Female) | Not supported | 
| `es-SV` | Spanish (El Salvador)<sup>1</sup> | `es-SV` | Plain text<br/><br/>Pronunciation | `es-SV-LorenaNeural`<sup>5,6</sup> (Female)<br/>`es-SV-RodrigoNeural`<sup>5,6</sup> (Male) | Not supported | 
| `es-US` | Spanish (United States)<sup>1</sup> | `es-US` | Plain text<br/><br/>Pronunciation | `es-US-AlonsoNeural`<sup>5,6</sup> (Male)<br/>`es-US-PalomaNeural`<sup>5,6</sup> (Female) | Not supported | 
| `es-UY` | Spanish (Uruguay)<sup>1</sup> | `es-UY` | Plain text<br/><br/>Pronunciation | `es-UY-MateoNeural`<sup>5,6</sup> (Male)<br/>`es-UY-ValentinaNeural`<sup>5,6</sup> (Female) | Not supported | 
| `es-VE` | Spanish (Venezuela)<sup>1</sup> | `es-VE` | Plain text<br/><br/>Pronunciation | `es-VE-PaolaNeural`<sup>5,6</sup> (Female)<br/>`es-VE-SebastianNeural`<sup>5,6</sup> (Male) | Not supported | 
| `et-EE` | Estonian (Estonia)<sup>1</sup> | `et-EE` | Plain text<br/><br/>Pronunciation | `et-EE-AnuNeural` (Female)<br/>`et-EE-KertNeural` (Male) | Not supported | 
| `eu-ES` | Basque | `eu-ES` | Plain text | Not supported |Not supported | 
| `fa-IR` | Persian (Iran) | `fa-IR` | Plain text | `fa-IR-DilaraNeural` (Female)<br/>`fa-IR-FaridNeural` (Male) | Not supported | 
| `fi-FI` | Finnish (Finland)<sup>1</sup> | `fi-FI` | Plain text<br/><br/>Pronunciation | `fi-FI-HarriNeural`<sup>5,6</sup> (Male)<br/>`fi-FI-NooraNeural`<sup>5,6</sup> (Female)<br/>`fi-FI-SelmaNeural`<sup>5,6</sup> (Female) | Custom Neural Voice Pro | 
| `fil-PH` | Filipino (Philippines) | `fil-PH` | Plain text<br/><br/>Pronunciation | `fil-PH-AngeloNeural` (Male)<br/>`fil-PH-BlessicaNeural` (Female) | Not supported | 
| `fr-BE` | French (Belgium)<sup>1</sup> | `fr-BE` | Plain text | `fr-BE-CharlineNeural`<sup>5,6</sup> (Female)<br/>`fr-BE-GerardNeural`<sup>5,6</sup> (Male) | Not supported | 
| `fr-CA` | French (Canada)<sup>1</sup> | `fr-CA` | Plain text<br/><br/>Structured text<br/><br/>Pronunciation<br/><br/>Phrase list | `fr-CA-AntoineNeural`<sup>5,6</sup> (Male)<br/>`fr-CA-JeanNeural`<sup>5,6</sup> (Male)<br/>`fr-CA-SylvieNeural`<sup>5,6</sup> (Female) | Custom Neural Voice Pro<br/><br/>Cross-lingual voice (Preview) | 
| `fr-CH` | French (Switzerland)<sup>1</sup> | `fr-CH` | Plain text<br/><br/>Pronunciation | `fr-CH-ArianeNeural`<sup>5,6</sup> (Female)<br/>`fr-CH-FabriceNeural`<sup>5,6</sup> (Male) | Custom Neural Voice Pro | 
| `fr-FR` | French (France)<sup>1</sup> | `fr-FR` | Plain text<br/><br/>Structured text<br/><br/>Pronunciation<br/><br/>Phrase list | `fr-FR-AlainNeural`<sup>5,6</sup> (Male)<br/>`fr-FR-BrigitteNeural`<sup>5,6</sup> (Female)<br/>`fr-FR-CelesteNeural`<sup>5,6</sup> (Female)<br/>`fr-FR-ClaudeNeural`<sup>5,6</sup> (Male)<br/>`fr-FR-CoralieNeural`<sup>5,6</sup> (Female)<br/>`fr-FR-DeniseNeural`<sup>2,5,6</sup> (Female)<br/>`fr-FR-EloiseNeural`<sup>5,6,8</sup> (Female)<br/>`fr-FR-HenriNeural`<sup>5,6</sup> (Male)<br/>`fr-FR-JacquelineNeural`<sup>5,6</sup> (Female)<br/>`fr-FR-JeromeNeural`<sup>5,6</sup> (Male)<br/>`fr-FR-JosephineNeural`<sup>5,6</sup> (Female)<br/>`fr-FR-MauriceNeural`<sup>5,6</sup> (Male)<br/>`fr-FR-YvesNeural`<sup>5,6</sup> (Male)<br/>`fr-FR-YvetteNeural`<sup>5,6</sup> (Female) | Custom Neural Voice Pro<br/><br/>Custom Neural Voice Lite (Preview)<br/><br/>Cross-lingual voice (Preview) | 
| `ga-IE` | Irish (Ireland)<sup>1</sup> | `ga-IE` | Plain text<br/><br/>Pronunciation | `ga-IE-ColmNeural` (Male)<br/>`ga-IE-OrlaNeural` (Female) | Not supported | 
| `gl-ES` | Galician | `gl-ES` | Plain text | `gl-ES-RoiNeural` (Male)<br/>`gl-ES-SabelaNeural` (Female) | Not supported | 
| `gu-IN` | Gujarati (India)<sup>1</sup> | `gu-IN` | Plain text | `gu-IN-DhwaniNeural`<sup>5,6</sup> (Female)<br/>`gu-IN-NiranjanNeural`<sup>5,6</sup> (Male) | Not supported | 
| `he-IL` | Hebrew (Israel) | `he-IL` | Plain text | `he-IL-AvriNeural`<sup>5,6</sup> (Male)<br/>`he-IL-HilaNeural`<sup>5,6</sup> (Female) | Custom Neural Voice Pro | 
| `hi-IN` | Hindi (India)<sup>1</sup> | `hi-IN` | Plain text | `hi-IN-MadhurNeural`<sup>5,6</sup> (Male)<br/>`hi-IN-SwaraNeural`<sup>5,6</sup> (Female) | Custom Neural Voice Pro | 
| `hr-HR` | Croatian (Croatia)<sup>1</sup> | `hr-HR` | Plain text<br/><br/>Pronunciation | `hr-HR-GabrijelaNeural`<sup>5,6</sup> (Female)<br/>`hr-HR-SreckoNeural`<sup>5,6</sup> (Male) | Custom Neural Voice Pro | 
| `hu-HU` | Hungarian (Hungary)<sup>1</sup> | `hu-HU` | Plain text<br/><br/>Pronunciation | `hu-HU-NoemiNeural`<sup>5,6</sup> (Female)<br/>`hu-HU-TamasNeural`<sup>5,6</sup> (Male) | Custom Neural Voice Pro | 
| `hy-AM` | Armenian (Armenia) | `hy-AM` | Plain text | Not supported |Not supported | 
| `id-ID` | Indonesian (Indonesia)<sup>1</sup> | `id-ID` | Plain text<br/><br/>Pronunciation | `id-ID-ArdiNeural`<sup>5,6</sup> (Male)<br/>`id-ID-GadisNeural`<sup>5,6</sup> (Female) | Custom Neural Voice Pro | 
| `is-IS` | Icelandic (Iceland) | `is-IS` | Plain text | `is-IS-GudrunNeural` (Female)<br/>`is-IS-GunnarNeural` (Male) | Not supported | 
| `it-CH` | Italian (Switzerland)<sup>1</sup> | `it-CH` | Plain text | Not supported |Not supported | 
| `it-IT` | Italian (Italy)<sup>1</sup> | `it-IT` | Plain text<br/><br/>Structured text<br/><br/>Pronunciation<br/><br/>Phrase list | `it-IT-BenignoNeural`<sup>4,5,6</sup> (Male)<br/>`it-IT-CalimeroNeural`<sup>4,5,6</sup> (Male)<br/>`it-IT-CataldoNeural`<sup>4,5,6</sup> (Male)<br/>`it-IT-DiegoNeural`<sup>5,6</sup> (Male)<br/>`it-IT-ElsaNeural`<sup>5,6</sup> (Female)<br/>`it-IT-FabiolaNeural`<sup>4,5,6</sup> (Female)<br/>`it-IT-FiammaNeural`<sup>4,5,6</sup> (Female)<br/>`it-IT-GianniNeural`<sup>4,5,6</sup> (Male)<br/>`it-IT-ImeldaNeural`<sup>4,5,6</sup> (Female)<br/>`it-IT-IrmaNeural`<sup>4,5,6</sup> (Female)<br/>`it-IT-IsabellaNeural`<sup>5,6</sup> (Female)<br/>`it-IT-LisandroNeural`<sup>4,5,6</sup> (Male)<br/>`it-IT-PalmiraNeural`<sup>4,5,6</sup> (Female)<br/>`it-IT-PierinaNeural`<sup>4,5,6</sup> (Female)<br/>`it-IT-RinaldoNeural`<sup>4,5,6</sup> (Male) | Custom Neural Voice Pro<br/><br/>Custom Neural Voice Lite (Preview)<br/><br/>Cross-lingual voice (Preview) | 
| `ja-JP` | Japanese (Japan)<sup>1</sup> | `ja-JP` | Plain text<br/><br/>Structured text<br/><br/>Phrase list | `ja-JP-KeitaNeural`<sup>5,6</sup> (Male)<br/>`ja-JP-NanamiNeural`<sup>2,5,6</sup> (Female) | Custom Neural Voice Pro<br/><br/>Custom Neural Voice Lite (Preview)<br/><br/>Cross-lingual voice (Preview) | 
| `jv-ID` | Javanese (Indonesia) | `jv-ID` | Plain text | `jv-ID-DimasNeural` (Male)<br/>`jv-ID-SitiNeural` (Female) | Not supported | 
| `ka-GE` | Georgian (Georgia) | `ka-GE` | Plain text | `ka-GE-EkaNeural` (Female)<br/>`ka-GE-GiorgiNeural` (Male) | Not supported | 
| `kk-KZ` | Kazakh (Kazakhstan) | `kk-KZ` | Plain text | `kk-KZ-AigulNeural` (Female)<br/>`kk-KZ-DauletNeural` (Male) | Not supported | 
| `km-KH` | Khmer (Cambodia) | `km-KH` | Plain text | `km-KH-PisethNeural` (Male)<br/>`km-KH-SreymomNeural` (Female) | Not supported | 
| `kn-IN` | Kannada (India) | `kn-IN` | Plain text | `kn-IN-GaganNeural` (Male)<br/>`kn-IN-SapnaNeural` (Female) | Not supported | 
| `ko-KR` | Korean (Korea)<sup>1</sup> | `ko-KR` | Audio + human-labeled transcript<br/><br/>Plain text<br/><br/>Structured text<br/><br/>Phrase list | `ko-KR-InJoonNeural`<sup>5,6</sup> (Male)<br/>`ko-KR-SunHiNeural`<sup>5,6</sup> (Female) | Custom Neural Voice Pro<br/><br/>Custom Neural Voice Lite (Preview)<br/><br/>Cross-lingual voice (Preview) | 
| `lo-LA` | Lao (Laos) | `lo-LA` | Plain text | `lo-LA-ChanthavongNeural` (Male)<br/>`lo-LA-KeomanyNeural` (Female) | Not supported | 
| `lt-LT` | Lithuanian (Lithuania)<sup>1</sup> | `lt-LT` | Plain text<br/><br/>Pronunciation | `lt-LT-LeonasNeural` (Male)<br/>`lt-LT-OnaNeural` (Female) | Not supported | 
| `lv-LV` | Latvian (Latvia)<sup>1</sup> | `lv-LV` | Plain text<br/><br/>Pronunciation | `lv-LV-EveritaNeural` (Female)<br/>`lv-LV-NilsNeural` (Male) | Not supported | 
| `mk-MK` | Macedonian (Republic of North Macedonia) | `mk-MK` | Plain text | `mk-MK-AleksandarNeural` (Male)<br/>`mk-MK-MarijaNeural` (Female) | Not supported | 
| `ml-IN` | Malayalam (India) | Not supported |Not supported |`ml-IN-MidhunNeural` (Male)<br/>`ml-IN-SobhanaNeural` (Female) | Not supported | 
| `mn-MN` | Mongolian (Mongolia) | `mn-MN` | Plain text | `mn-MN-BataaNeural` (Male)<br/>`mn-MN-YesuiNeural` (Female) | Not supported | 
| `mr-IN` | Marathi (India)<sup>1</sup> | `mr-IN` | Plain text | `mr-IN-AarohiNeural`<sup>5,6</sup> (Female)<br/>`mr-IN-ManoharNeural`<sup>5,6</sup> (Male) | Not supported | 
| `ms-MY` | Malay (Malaysia) | `ms-MY` | Plain text | `ms-MY-OsmanNeural`<sup>5,6</sup> (Male)<br/>`ms-MY-YasminNeural`<sup>5,6</sup> (Female) | Custom Neural Voice Pro | 
| `mt-MT` | Maltese (Malta)<sup>1</sup> | `mt-MT` | Plain text | `mt-MT-GraceNeural` (Female)<br/>`mt-MT-JosephNeural` (Male) | Not supported | 
| `my-MM` | Burmese (Myanmar) | `my-MM` | Plain text | `my-MM-NilarNeural` (Female)<br/>`my-MM-ThihaNeural` (Male) | Not supported | 
| `nb-NO` | Norwegian (Bokmål, Norway)<sup>1</sup> | `nb-NO` | Plain text | `nb-NO-FinnNeural`<sup>5,6</sup> (Male)<br/>`nb-NO-IselinNeural`<sup>5,6</sup> (Female)<br/>`nb-NO-PernilleNeural`<sup>5,6</sup> (Female) | Custom Neural Voice Pro | 
| `ne-NP` | Nepali (Nepal) | `ne-NP` | Plain text | `ne-NP-HemkalaNeural` (Female)<br/>`ne-NP-SagarNeural` (Male) | Not supported | 
| `nl-BE` | Dutch (Belgium)<sup>1</sup> | `nl-BE` | Plain text | `nl-BE-ArnaudNeural`<sup>5,6</sup> (Male)<br/>`nl-BE-DenaNeural`<sup>5,6</sup> (Female) | Not supported | 
| `nl-NL` | Dutch (Netherlands)<sup>1</sup> | `nl-NL` | Audio + human-labeled transcript<br/><br/>Plain text<br/><br/>Pronunciation | `nl-NL-ColetteNeural`<sup>5,6</sup> (Female)<br/>`nl-NL-FennaNeural`<sup>5,6</sup> (Female)<br/>`nl-NL-MaartenNeural`<sup>5,6</sup> (Male) | Custom Neural Voice Pro | 
| `pl-PL` | Polish (Poland)<sup>1</sup> | `pl-PL` | Plain text<br/><br/>Pronunciation | `pl-PL-AgnieszkaNeural`<sup>5,6</sup> (Female)<br/>`pl-PL-MarekNeural`<sup>5,6</sup> (Male)<br/>`pl-PL-ZofiaNeural`<sup>5,6</sup> (Female) | Custom Neural Voice Pro | 
| `ps-AF` | Pashto (Afghanistan) | `ps-AF` | Plain text | `ps-AF-GulNawazNeural` (Male)<br/>`ps-AF-LatifaNeural` (Female) | Not supported | 
| `pt-BR` | Portuguese (Brazil)<sup>1</sup> | `pt-BR` | Audio + human-labeled transcript<br/><br/>Plain text<br/><br/>Structured text<br/><br/>Pronunciation<br/><br/>Phrase list | `pt-BR-AntonioNeural`<sup>5,6</sup> (Male)<br/>`pt-BR-BrendaNeural`<sup>4,5,6</sup> (Female)<br/>`pt-BR-DonatoNeural`<sup>4,5,6</sup> (Male)<br/>`pt-BR-ElzaNeural`<sup>4,5,6</sup> (Female)<br/>`pt-BR-FabioNeural`<sup>4,5,6</sup> (Male)<br/>`pt-BR-FranciscaNeural`<sup>2,5,6</sup> (Female)<br/>`pt-BR-GiovannaNeural`<sup>4,5,6</sup> (Female)<br/>`pt-BR-HumbertoNeural`<sup>4,5,6</sup> (Male)<br/>`pt-BR-JulioNeural`<sup>4,5,6</sup> (Male)<br/>`pt-BR-LeilaNeural`<sup>4,5,6</sup> (Female)<br/>`pt-BR-LeticiaNeural`<sup>4,5,6</sup> (Female)<br/>`pt-BR-ManuelaNeural`<sup>4,5,6</sup> (Female)<br/>`pt-BR-NicolauNeural`<sup>4,5,6</sup> (Male)<br/>`pt-BR-ValerioNeural`<sup>4,5,6</sup> (Male)<br/>`pt-BR-YaraNeural`<sup>4,5,6</sup> (Female) | Custom Neural Voice Pro<br/><br/>Custom Neural Voice Lite (Preview)<br/><br/>Cross-lingual voice (Preview) | 
| `pt-PT` | Portuguese (Portugal)<sup>1</sup> | `pt-PT` | Plain text<br/><br/>Pronunciation | `pt-PT-DuarteNeural`<sup>5,6</sup> (Male)<br/>`pt-PT-FernandaNeural`<sup>5,6</sup> (Female)<br/>`pt-PT-RaquelNeural`<sup>5,6</sup> (Female) | Custom Neural Voice Pro | 
| `ro-RO` | Romanian (Romania)<sup>1</sup> | `ro-RO` | Plain text<br/><br/>Pronunciation | `ro-RO-AlinaNeural`<sup>5,6</sup> (Female)<br/>`ro-RO-EmilNeural`<sup>5,6</sup> (Male) | Custom Neural Voice Pro | 
| `ru-RU` | Russian (Russia)<sup>1</sup> | `ru-RU` | Plain text | `ru-RU-DariyaNeural`<sup>5,6</sup> (Female)<br/>`ru-RU-DmitryNeural`<sup>5,6</sup> (Male)<br/>`ru-RU-SvetlanaNeural`<sup>5,6</sup> (Female) | Custom Neural Voice Pro<br/><br/>Cross-lingual voice (Preview) | 
| `si-LK` | Sinhala (Sri Lanka) | `si-LK` | Plain text | `si-LK-SameeraNeural` (Male)<br/>`si-LK-ThiliniNeural` (Female) | Not supported | 
| `sk-SK` | Slovak (Slovakia)<sup>1</sup> | `sk-SK` | Plain text<br/><br/>Pronunciation | `sk-SK-LukasNeural`<sup>5,6</sup> (Male)<br/>`sk-SK-ViktoriaNeural`<sup>5,6</sup> (Female) | Custom Neural Voice Pro | 
| `sl-SI` | Slovenian (Slovenia)<sup>1</sup> | `sl-SI` | Plain text<br/><br/>Pronunciation | `sl-SI-PetraNeural`<sup>5,6</sup> (Female)<br/>`sl-SI-RokNeural`<sup>5,6</sup> (Male) | Custom Neural Voice Pro | 
| `so-SO` | Somali (Somalia) | `so-SO` | Plain text | `so-SO-MuuseNeural` (Male)<br/>`so-SO-UbaxNeural` (Female) | Not supported | 
| `sq-AL` | Albanian (Albania) | `sq-AL` | Plain text | `sq-AL-AnilaNeural` (Female)<br/>`sq-AL-IlirNeural` (Male) | Not supported | 
| `sr-RS` | Serbian (Serbia) | `sr-RS` | Plain text | `sr-RS-NicholasNeural` (Male)<br/>`sr-RS-SophieNeural` (Female) | Not supported | 
| `su-ID` | Sundanese (Indonesia) | Not supported |Not supported |`su-ID-JajangNeural` (Male)<br/>`su-ID-TutiNeural` (Female) | Not supported | 
| `sv-SE` | Swedish (Sweden)<sup>1</sup> | `sv-SE` | Plain text<br/><br/>Pronunciation | `sv-SE-HilleviNeural`<sup>5,6</sup> (Female)<br/>`sv-SE-MattiasNeural`<sup>5,6</sup> (Male)<br/>`sv-SE-SofieNeural`<sup>5,6</sup> (Female) | Custom Neural Voice Pro | 
| `sw-KE` | Swahili (Kenya) | `sw-KE` | Plain text | `sw-KE-RafikiNeural` (Male)<br/>`sw-KE-ZuriNeural` (Female) | Not supported | 
| `sw-TZ` | Swahili (Tanzania) | `sw-TZ` | Plain text | `sw-TZ-DaudiNeural`<sup>5,6</sup> (Male)<br/>`sw-TZ-RehemaNeural`<sup>5,6</sup> (Female) | Not supported | 
| `ta-IN` | Tamil (India)<sup>1</sup> | `ta-IN` | Plain text | `ta-IN-PallaviNeural`<sup>5,6</sup> (Female)<br/>`ta-IN-ValluvarNeural`<sup>5,6</sup> (Male) | Custom Neural Voice Pro | 
| `ta-LK` | Tamil (Sri Lanka)<sup>1</sup> | Not supported |Not supported |`ta-LK-KumarNeural`<sup>5,6</sup> (Male)<br/>`ta-LK-SaranyaNeural`<sup>5,6</sup> (Female) | Not supported | 
| `ta-MY` | Tamil (Malaysia)<sup>1</sup> | Not supported |Not supported |`ta-MY-KaniNeural`<sup>5,6</sup> (Female)<br/>`ta-MY-SuryaNeural`<sup>5,6</sup> (Male) | Not supported | 
| `ta-SG` | Tamil (Singapore)<sup>1</sup> | Not supported |Not supported |`ta-SG-AnbuNeural`<sup>5,6</sup> (Male)<br/>`ta-SG-VenbaNeural`<sup>5,6</sup> (Female) | Not supported | 
| `te-IN` | Telugu (India)<sup>1</sup> | `te-IN` | Plain text | `te-IN-MohanNeural`<sup>5,6</sup> (Male)<br/>`te-IN-ShrutiNeural`<sup>5,6</sup> (Female) | Custom Neural Voice Pro | 
| `th-TH` | Thai (Thailand)<sup>1</sup> | `th-TH` | Plain text | `th-TH-AcharaNeural`<sup>5,6</sup> (Female)<br/>`th-TH-NiwatNeural`<sup>5,6</sup> (Male)<br/>`th-TH-PremwadeeNeural`<sup>5,6</sup> (Female) | Custom Neural Voice Pro | 
| `tr-TR` | Turkish (Turkey)<sup>1</sup> | `tr-TR` | Plain text | `tr-TR-AhmetNeural`<sup>5,6</sup> (Male)<br/>`tr-TR-EmelNeural`<sup>5,6</sup> (Female) | Custom Neural Voice Pro | 
| `uk-UA` | Ukrainian (Ukraine)<sup>1</sup> | `uk-UA` | Plain text | `uk-UA-OstapNeural`<sup>5,6</sup> (Male)<br/>`uk-UA-PolinaNeural`<sup>5,6</sup> (Female) | Not supported | 
| `ur-IN` | Urdu (India) | Not supported |Not supported |`ur-IN-GulNeural`<sup>5,6</sup> (Female)<br/>`ur-IN-SalmanNeural`<sup>5,6</sup> (Male) | Not supported | 
| `ur-PK` | Urdu (Pakistan) | Not supported |Not supported |`ur-PK-AsadNeural`<sup>5,6</sup> (Male)<br/>`ur-PK-UzmaNeural`<sup>5,6</sup> (Female) | Not supported | 
| `uz-UZ` | Uzbek (Uzbekistan) | `uz-UZ` | Plain text | `uz-UZ-MadinaNeural` (Female)<br/>`uz-UZ-SardorNeural` (Male) | Not supported | 
| `vi-VN` | Vietnamese (Vietnam) | `vi-VN` | Plain text | `vi-VN-HoaiMyNeural`<sup>5,6</sup> (Female)<br/>`vi-VN-NamMinhNeural`<sup>5,6</sup> (Male) | Custom Neural Voice Pro | 
| `wuu-CN` | Wu Chinese (China) | `wuu-CN` | Plain text | Not supported |Not supported | 
| `yue-CN` | Cantonese (China) | `yue-CN` | Plain text | Not supported |Not supported | 
| `zh-CN` | Chinese (Mandarin, Simplified)<sup>1</sup> | `zh-CN` | Audio + human-labeled transcript<br/><br/>Plain text<br/><br/>Structured text<br/><br/>Phrase list | `zh-CN-XiaochenNeural`<sup>5,6</sup> (Female)<br/>`zh-CN-XiaohanNeural`<sup>2,5,6</sup> (Female)<br/>`zh-CN-XiaomengNeural`<sup>2,4,5,6</sup> (Female)<br/>`zh-CN-XiaomoNeural`<sup>2,3,5,6</sup> (Female)<br/>`zh-CN-XiaoqiuNeural`<sup>5,6</sup> (Female)<br/>`zh-CN-XiaoruiNeural`<sup>2,5,6</sup> (Female)<br/>`zh-CN-XiaoshuangNeural`<sup>2,5,6,8</sup> (Female)<br/>`zh-CN-XiaoxiaoNeural`<sup>2,5,6</sup> (Female)<br/>`zh-CN-XiaoxuanNeural`<sup>2,3,5,6</sup> (Female)<br/>`zh-CN-XiaoyanNeural`<sup>5,6</sup> (Female)<br/>`zh-CN-XiaoyiNeural`<sup>2,4,5,6</sup> (Female)<br/>`zh-CN-XiaoyouNeural`<sup>5,6,8</sup> (Female)<br/>`zh-CN-XiaozhenNeural`<sup>2,4,5,6</sup> (Female)<br/>`zh-CN-YunfengNeural`<sup>2,4,5,6</sup> (Male)<br/>`zh-CN-YunhaoNeural`<sup>2,4,5,6</sup> (Male)<br/>`zh-CN-YunjianNeural`<sup>2,4,5,6</sup> (Male)<br/>`zh-CN-YunxiaNeural`<sup>2,4,5,6</sup> (Male)<br/>`zh-CN-YunxiNeural`<sup>2,3,5,6</sup> (Male)<br/>`zh-CN-YunyangNeural`<sup>2,5,6</sup> (Male)<br/>`zh-CN-YunyeNeural`<sup>2,3,5,6</sup> (Male)<br/>`zh-CN-YunzeNeural`<sup>2,3,4,5,6</sup> (Male) | Custom Neural Voice Pro<br/><br/>Custom Neural Voice Lite (Preview)<br/><br/>Cross-lingual voice (Preview) | 
| `zh-CN-LIAONING` | Chinese (Mandarin, Simplified)<sup>1</sup> | Not supported |Not supported |`zh-CN-liaoning-XiaobeiNeural`<sup>4</sup> (Female) | Not supported | 
| `zh-CN-SICHUAN` | Chinese (Mandarin, Simplified)<sup>1</sup> | `zh-CN-SICHUAN` | Plain text | `zh-CN-sichuan-YunxiNeural`<sup>4</sup> (Male) | Not supported | 
| `zh-HK` | Chinese (Cantonese, Traditional)<sup>1</sup> | `zh-HK` | Plain text | `zh-HK-HiuGaaiNeural`<sup>5,6</sup> (Female)<br/>`zh-HK-HiuMaanNeural`<sup>5,6</sup> (Female)<br/>`zh-HK-WanLungNeural`<sup>5,6</sup> (Male) | Custom Neural Voice Pro | 
| `zh-TW` | Chinese (Taiwanese Mandarin)<sup>1</sup> | `zh-TW` | Plain text | `zh-TW-HsiaoChenNeural`<sup>5,6</sup> (Female)<br/>`zh-TW-HsiaoYuNeural`<sup>5,6</sup> (Female)<br/>`zh-TW-YunJheNeural`<sup>5,6</sup> (Male) | Custom Neural Voice Pro | 
| `zu-ZA` | Zulu (South Africa) | `zu-ZA` | Plain text | `zu-ZA-ThandoNeural` (Female)<br/>`zu-ZA-ThembaNeural` (Male) | Not supported | 

<sup>1</sup> The locale supports [language identification](language-identification.md) at the language level, such as English and German. If you include multiple locales of the same language, for example, `en-IN` and `en-US`, we'll only compare English (`en`) with the other candidate languages.

<sup>2</sup> The neural voice supports speaking styles to express emotions such as cheerfulness, empathy, and calm. You can optimize the voice for different scenarios like customer service, newscast, and voice assistant. For a list of styles that are supported per neural voice, see the [Voice styles and roles](#voice-styles-and-roles) table below. To learn how you can configure and adjust neural voice styles, see [Speech Synthesis Markup Language](speech-synthesis-markup.md#adjust-speaking-styles).

<sup>3</sup> The neural voice supports role play. With roles, the same voice can act as a different age and gender. For a list of roles that are supported per neural voice, see the [Voice styles and roles](#voice-styles-and-roles) table below. To learn how you can configure and adjust neural voice roles, see [Speech Synthesis Markup Language](speech-synthesis-markup.md#adjust-speaking-styles).

<sup>4</sup> The neural voice is available in public preview. Voices and styles in public preview are only available in three service [regions](regions.md): East US, West Europe, and Southeast Asia. 

<sup>5</sup> Visemes are supported for the locale of the neural voice. However, SVG is only supported for neural voices in the `en-US` locale, and blend shapes is only supported for neural voices in the `en-US` and `zh-CN` locales. For more information, see [Get facial position with viseme](how-to-speech-synthesis-viseme.md). 

<sup>6</sup> Phonemes are supported for the locale of the neural voice. For more information, see [SSML phonetic alphabets](speech-ssml-phonetic-sets.md) and [Use phonemes to improve pronunciation](speech-synthesis-markup.md#use-phonemes-to-improve-pronunciation).

<sup>7</sup> For the multilingual voice the primary default locale is `en-US`. Additional locales are supported [using SSML](speech-synthesis-markup.md#adjust-speaking-languages).

<sup>8</sup> The voice is a child's voice.

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

To learn how you can configure and adjust neural voice styles and roles, see [Speech Synthesis Markup Language](speech-synthesis-markup.md#adjust-speaking-styles).

Use the following table to determine supported styles and roles for each neural voice.

| Voice | Styles |Roles |
| ----- | ----- | ----- |
|en-US-AriaNeural|`chat`, `customerservice`, `narration-professional`, `newscast-casual`, `newscast-formal`, `cheerful`, `empathetic`, `angry`, `sad`, `excited`, `friendly`, `terrified`, `shouting`, `unfriendly`, `whispering`, `hopeful`|Not supported|
|en-US-DavisNeural<sup>1,2</sup>|`chat`, `angry`, `cheerful`, `excited`, `friendly`, `hopeful`, `sad`, `shouting`, `terrified`, `unfriendly`, `whispering`|Not supported|
|en-US-GuyNeural|`newscast`, `angry`, `cheerful`, `sad`, `excited`, `friendly`, `terrified`, `shouting`, `unfriendly`, `whispering`, `hopeful`|Not supported|
|en-US-JaneNeural<sup>1,2</sup>|`angry`, `cheerful`, `excited`, `friendly`, `hopeful`, `sad`, `shouting`, `terrified`, `unfriendly`, `whispering`|Not supported|
|en-US-JasonNeural<sup>1,2</sup>|`angry`, `cheerful`, `excited`, `friendly`, `hopeful`, `sad`, `shouting`, `terrified`, `unfriendly`, `whispering`|Not supported|
|en-US-JennyNeural|`assistant`, `chat`, `customerservice`, `newscast`, `angry`, `cheerful`, `sad`, `excited`, `friendly`, `terrified`, `shouting`, `unfriendly`, `whispering`, `hopeful`|Not supported|
|en-US-NancyNeural<sup>1,2</sup>|`angry`, `cheerful`, `excited`, `friendly`, `hopeful`, `sad`, `shouting`, `terrified`, `unfriendly`, `whispering`|Not supported|
|en-US-SaraNeural|`angry`, `cheerful`, `excited`, `friendly`, `hopeful`, `sad`, `shouting`, `terrified`, `unfriendly`, `whispering`|Not supported|
|en-US-TonyNeural<sup>1,2</sup>|`angry`, `cheerful`, `excited`, `friendly`, `hopeful`, `sad`, `shouting`, `terrified`, `unfriendly`, `whispering`|Not supported|
|fr-FR-DeniseNeural|`cheerful`, `sad`|Not supported|
|ja-JP-NanamiNeural|`chat`, `customerservice`, `cheerful`|Not supported|
|pt-BR-FranciscaNeural|`calm`|Not supported|
|zh-CN-XiaohanNeural<sup>6</sup>|`calm`, `fearful`, `cheerful`, `disgruntled`, `serious`, `angry`, `sad`, `gentle`, `affectionate`, `embarrassed`|Not supported|
|zh-CN-XiaomengNeural<sup>1,6</sup>|`chat`|Not supported|
|zh-CN-XiaomoNeural<sup>6</sup>|`embarrassed`, `calm`, `fearful`, `cheerful`, `disgruntled`, `serious`, `angry`, `sad`, `depressed`, `affectionate`, `gentle`, `envious`|`YoungAdultFemale`, `YoungAdultMale`, `OlderAdultFemale`, `OlderAdultMale`, `SeniorFemale`, `SeniorMale`, `Girl`, `Boy`|
|zh-CN-XiaoruiNeural<sup>6</sup>|`calm`, `fearful`, `angry`, `sad`|Not supported|
|zh-CN-XiaoshuangNeural<sup>6</sup>|`chat`|Not supported|
|zh-CN-XiaoxiaoNeural<sup>6</sup>|`assistant`, `chat`, `customerservice`, `newscast`, `affectionate`, `angry`, `calm`, `cheerful`, `disgruntled`, `fearful`, `gentle`, `lyrical`, `sad`, `serious`, `poetry-reading`|Not supported|
|zh-CN-XiaoxuanNeural<sup>6</sup>|`calm`, `fearful`, `cheerful`, `disgruntled`, `serious`, `angry`, `gentle`, `depressed`|`YoungAdultFemale`, `YoungAdultMale`, `OlderAdultFemale`, `OlderAdultMale`, `SeniorFemale`, `SeniorMale`, `Girl`, `Boy`|
|zh-CN-XiaoyiNeural<sup>1,6</sup>|`angry`, `disgruntled`, `affectionate`, `cheerful`, `fearful`, `sad`, `embarrassed`, `serious`, `gentle`|Not supported|
|zh-CN-XiaozhenNeural<sup>1,6</sup>|`angry`, `disgruntled`, `cheerful`, `fearful`, `sad`, `serious`|Not supported|
|zh-CN-YunfengNeural<sup>1,6</sup>|`angry`, `disgruntled`, `cheerful`, `fearful`, `sad`, `serious`, `depressed`|Not supported|
|zh-CN-YunhaoNeural<sup>1,3,6</sup>|`Advertisement_upbeat`|Not supported|
|zh-CN-YunjianNeural<sup>1,4,5,6</sup>|`Narration-relaxed`, `Sports_commentary`, `Sports_commentary_excited`|Not supported|
|zh-CN-YunxiaNeural<sup>1,6</sup>|`calm`, `fearful`, `cheerful`, `angry`, `sad`|Not supported|
|zh-CN-YunxiNeural<sup>6</sup>|`narration-relaxed`, `embarrassed`, `fearful`, `cheerful`, `disgruntled`, `serious`, `angry`, `sad`, `depressed`, `chat`, `assistant`, `newscast`|`Narrator`, `YoungAdultMale`, `Boy`|
|zh-CN-YunyangNeural<sup>6</sup>|`customerservice`, `narration-professional`, `newscast-casual`|Not supported|
|zh-CN-YunyeNeural<sup>6</sup>|`embarrassed`, `calm`, `fearful`, `cheerful`, `disgruntled`, `serious`, `angry`, `sad`|`YoungAdultFemale`, `YoungAdultMale`, `OlderAdultFemale`, `OlderAdultMale`, `SeniorFemale`, `SeniorMale`, `Girl`, `Boy`|
|zh-CN-YunzeNeural<sup>1,6</sup>|`calm`, `fearful`, `cheerful`, `disgruntled`, `serious`, `angry`, `sad`, `depressed`, `documentary-narration`|`OlderAdultMale`, `SeniorMale`|

<sup>1</sup> The neural voice is available in public preview. Voices and styles in public preview are only available in three service [regions](regions.md): East US, West Europe, and Southeast Asia. 

<sup>2</sup> The `angry`, `cheerful`, `excited`, `friendly`, `hopeful`, `sad`, `shouting`, `terrified`, `unfriendly`, and `whispering` styles for this voice are only available in three service regions: East US, West Europe, and Southeast Asia.

<sup>3</sup> The `Advertisement_upbeat` style for this voice is in preview and only available in three service regions: East US, West Europe, and Southeast Asia.

<sup>4</sup> The `Sports_commentary` style for this voice is in preview and only available in three service regions: East US, West Europe, and Southeast Asia.

<sup>5</sup> The `Sports_commentary_excited` style for this voice is in preview and only available in three service regions: East US, West Europe, and Southeast Asia.

<sup>6</sup> The voice supports style degree for you to specify the intensity of the speaking style. 

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

### Translate from language

To set the input speech recognition language, specify the full locale with a dash (`-`) separator. See the [speech-to-text language table](#speech-to-text) above. The default language is `en-US` if you don't specify a language.

### Translate to text language

To set the translation target language, with few exceptions you only specify the language code that precedes the locale dash (`-`) separator. For example, use `es` for Spanish (Spain) instead of `es-ES`. See the speech translation target language table below. The default language is `en` if you don't specify a language.

| Translate to text language| Language code |
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
