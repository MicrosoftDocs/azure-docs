---
title: "Release notes - Custom Translator"
titleSuffix: Azure Cognitive Services
description: Custom Translator releases, improvements, bug fixes, and known issues.
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.date: 11/04/2022
ms.author: lajanuar
ms.topic: reference
ms.custom: cogserv-non-critical-translator
---
# Custom Translator release notes

This page has the latest release notes for features, improvements, bug fixes, and known issues for the Custom Translator service.

## 2022-November release

Custom Translator version v2.0.0 is generally available and ready for use in your production applications!

### November 2022 improvements and fixes

#### Custom Translator stable GA v2.0 release

* Custom Translator version v2.0 is generally available and ready for use in your production applications!

* Upload history has been added to the workspace, next to Projects and Document sets.

#### Language model updates

* Language pairs are listed in the table below. We encourage you to retrain your models accordingly for higher quality.

|Source Language|Target Language|
|:----|:----|
|Chinese Simplified (zh-Hans)|English (en-us)|
|Chinese Traditional (zh-Hant)|English (en-us)|
|Czech (cs)|English (en-us)|
|Dutch (nl)|English (en-us)|
|English (en-us)|Chinese Simplified (zh-Hans)|
|English (en-us)|Chinese Traditional (zh-Hant)|
|English (en-us)|Czech (cs)|
|English (en-us)|Dutch (nl)|
|English (en-us)|French (fr)|
|English (en-us)|German (de)|
|English (en-us)|Italian (it)|
|English (en-us)|Polish (pl)|
|English (en-us)|Romanian (ro)|
|English (en-us)|Russian (ru)|
|English (en-us)|Spanish (es)|
|English (en-us)|Swedish (sv)|
|German (de)|English (en-us)|
|Italian (it)|English (en-us)|
|Russian (ru)|English (en-us)|
|Spanish (es)|English (en-us)|

#### Security update

* Custom Translator API calls now require User Access Token to authenticate.

* Visit our GitHub repo for a [C# code sample](https://github.com/MicrosoftTranslator/CustomTranslator-API-CSharp).

#### Fixes

* Resolved document upload error that caused a blank page in the browser.

* Applied functional modifications.

## 2021-May release

### May 2021 improvements and fixes

* We added new training pipeline to improve the custom model generalization and capacity to retain more customer terminology (words and phrases).

* Refreshed Custom Translator baselines to fix word alignment bug. See list of impacted language pair*.

### Language pair list

| Source Language   | Target Language |
|-------------------|-----------------|
| Arabic (`ar`) | English (`en-us`)|
| Brazilian Portuguese (`pt`)    | English (`en-us`)|
| Bulgarian (`bg`)    | English (`en-us`)|
| Chinese Simplified (`zh-Hans`)    | English (`en-us`)|
| Chinese Traditional (`zh-Hant`)    | English (`en-us`)|
| Croatian (`hr`)    | English (`en-us`)|
| Czech (`cs`)    | English (`en-us`)|
| Danish (`da`)    | English (`en-us`)|
| Dutch (nl)    | English (`en-us`)|
| English (`en-us`)    | Arabic (`ar`)|
| English (`en-us`)    | Bulgarian (`bg`)|
| English (`en-us`)    | Chinese Simplified (`zh-Hans`|
| English (`en-us`)    | Chinese Traditional (`zh-Hant`|
| English (`en-us`)    | Czech (`cs)`|
| English (`en-us`)    | Danish (`da`)|
| English (`en-us`)    | Dutch (`nl`)|
| English (`en-us`)    | Estonian (`et`)|
| English (`en-us`)    | Fijian (`fj`)|
| English (`en-us`)    | Finnish (`fi`)|
| English (`en-us`)    | French (`fr`)|
| English (`en-us`)    | Greek (`el`)|
| English (`en-us`)    | Hindi (`hi`) |
| English (`en-us`)    | Hungarian (`hu`)|
| English (`en-us`)    | Icelandic (`is`)|
| English (`en-us`)    | Indonesian (`id`)|
| English (`en-us`)    | Inuktitut (`iu`)|
| English (`en-us`)    | Irish (`ga`)|
| English (`en-us`)    | Italian (`it`)|
| English (`en-us`)    | Japanese (`ja`)|
| English (`en-us`)    | Korean (`ko`)|
| English (`en-us`)    | Lithuanian (`lt`)|
| English (`en-us`)    | Norwegian (`nb`)|
| English (`en-us`)    | Polish (`pl`)|
| English (`en-us`)    | Romanian (`ro`)|
| English (`en-us`)    | Samoan (`sm`)|
| English (`en-us`)    | Slovak (`sk`)|
| English (`en-us`)    | Spanish (`es`)|
| English (`en-us`)    | Swedish (`sv`)|
| English (`en-us`)    | Tahitian (`ty`)|
| English (`en-us`)    | Thai (`th`)|
| English (`en-us`)    | Tongan (`to`)|
| English (`en-us`)    | Turkish (`tr`)|
| English (`en-us`)    | Ukrainian (`uk`) |
| English (`en-us`)    | Welsh (`cy`)|
| Estonian (`et`)    | English (`en-us`)|
| Fijian (`fj`)   | English (`en-us`)|
| Finnish (`fi`)    | English (`en-us`)|
| German (`de`)    | English (`en-us`)|
| Greek (`el`)    | English (`en-us`)|
| Hungarian (`hu`)    | English (`en-us`)|
| Icelandic (`is`)    | English (`en-us`)|
| Indonesian (`id`)    | English (`en-us`)
| Inuktitut (`iu`)    | English (`en-us`)|
| Irish (`ga`)    | English (`en-us`)|
| Italian (`it`)    | English (`en-us`)|
| Japanese (`ja`)    | English (`en-us`)|
| Kazakh (`kk`)    | English (`en-us`)|
| Korean (`ko`)    | English (`en-us`)|
| Lithuanian (`lt`)    | English (`en-us`)|
| Malagasy (`mg`)    | English (`en-us`)|
| Maori (`mi`)    | English (`en-us`)|
| Norwegian (`nb`)    | English (`en-us`)|
| Persian (`fa`)    | English (`en-us`)|
|  Polish (`pl`)    | English (`en-us`)|
| Romanian (`ro`)    | English (`en-us`)|
| Russian (`ru`)    | English (`en-us`)|
| Slovak (`sk`)    | English (`en-us`)|
| Spanish (`es`)    | English (`en-us`)|
| Swedish (`sv`)    | English (`en-us`)|
| Tahitian (`ty`)    | English (`en-us`)|
| Thai (`th`)    | English (`en-us`)|
| Tongan (`to`)    | English (`en-us`)|
| Turkish (`tr`)    | English (`en-us`)|
| Vietnamese (`vi`)    | English (`en-us`)|
| Welsh (`cy`)    | English (`en-us`)|
