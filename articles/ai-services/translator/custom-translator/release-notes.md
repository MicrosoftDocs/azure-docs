---
title: "Release notes - Custom Translator"
titleSuffix: Azure AI services
description: Custom Translator releases, improvements, bug fixes, and known issues.
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.custom:
  - ignite-2023
ms.date: 12/06/2023
ms.author: lajanuar
ms.topic: release-notes
---
# Custom Translator release notes

This page presents the latest feature, improvement, bug fix, and known issue release notes for Custom Translator service.

## 2023-December release

### December 2023 model updates

* Added [neural dictionary](../neural-dictionary.md) support for improved translation quality when phrase dictionary is used.

* Current supported **neural dictionary** language pairs are listed in the following table:

|Source|Target|
|:----|:----|
|Chinese Simplified (`zh-cn`)|English (`en-us`)|
|English (`en-us`)|Chinese Simplified (`zh-cn`)|
|English (`en-us`)|French (`fr-fr`)|
|English (`en-us`)|German (`de-de`)|
|English (`en-us`)|Italian (`it-it`)|
|English (`en-us`)|Japanese (`ja-jp`)|
|English (`en-us`)|Korean (`ko-kr`)|
|English (`en-us`)|Polish (`pl-pl`)|
|English (`en-us`)|Russian (`ru-ru`)|
|English (`en-us`)|Spanish (`es-es`)|
|English (`en-us`)|Swedish (`sv-se`)|
|French (`fr-fr`)|English (`en-us`)|
|German (`de-de`)|English (`en-us`)|
|Italian (`it-it`)|English (`en-us`)|
|Japanese (`ja-jp`)|English (`en-us`)|
|Korean (`ko-kr`)|English (`en-us`)|
|Polish (`pl-pl`)|English (`en-us`)|
|Russian (`ru-ru`)|English (`en-us`)|
|Spanish (`es-es`)|English (`en-us`)|
|Swedish (`sv-se`)|English (`en-us`)|

## 2023-November release

### November 2023 model updates

* The current supported language pairs, including direct language models, are listed in the following tables.

#### Direct language models

|Source Direct|Target Direct|
|:----|:----|
|Chinese Simplified (`zh-hans`)|German (`de-de`)|
|Chinese Simplified (`zh-hans`)|Korean (`ko-kr`)|
|Dutch (`nl-nl`)|French (`fr-fr`)|
|French (`fr-fr`)|Dutch (`nl-nl`)|
|French (`fr-fr`)|German (`de-de`)|
|French (`fr-fr`)|Italian (`it-it`)|
|German (`de-de`)|Chinese Simplified (`zh-hans`)|
|German (`de-de`)|French (`fr-fr`)|
|German (`de-de`)|Italian (`it-it`)|
|German (`de-de`)|Portuguese Portugal (`pt-pt`)|
|German (`de-de`)|Spanish (`es-es`)|
|Italian (`it-it`)|French (`fr-fr`)|
|Italian (`it-it`)|German (`de-de`)|
|Korean (`ko-kr`)|Chinese Simplified (`zh-hans`)|
|Spanish (`es-es`)|German (`de-de`)|

#### To/From English language models

|Source |Target|
|:----|:----|
|Amharic (`am-et`)|English (`en-us`)|
|Arabic (`ar-sa`)|English (`en-us`)|
|Catalan (`ca-es`)|English (`en-us`)|
|Chinese Traditional (`zh-hant`)|English (`en-us`)|
|English (`en-us`)|Bulgarian (`bg-bg`)|
|English (`en-us`)|Catalan (`ca-es`)|
|English (`en-us`)|Chinese Traditional (`zh-hant`)|
|English (`en-us`)|Dutch (`nl-nl`)|
|English (`en-us`)|Estonian (`et-ee`)|
|English (`en-us`)|Finnish (`fi-fi`)|
|English (`en-us`)|Icelandic (`is-is`)|
|English (`en-us`)|Kannada (`kn-in`)|
|English (`en-us`)|Lingala (`ln`)|
|English (`en-us`)|Marathi (`mr-in`)|
|English (`en-us`)|Punjabi (`pa-in`)|
|English (`en-us`)|Romanian (`ro-ro`)|
|English (`en-us`)|Shona (`sn-latn-zw`)|
|English (`en-us`)|Slovenian (`sl-si`)|
|English (`en-us`)|Turkish (`tr-tr`)|
|Finnish (`fi-fi`)|English (`en-us`)|
|Hebrew (`he-il`)|English (`en-us`)|
|Icelandic (`is-is`)|English (`en-us`)|
|Kannada (`kn-in`)|English (`en-us`)|
|Lingala (`ln`)|English (`en-us`)|
|Nyanja (`nya`)|English (`en-us`)|
|Punjabi (`pa-in`)|English (`en-us`)|
|Romanian (`ro-ro`)|English (`en-us`)|
|Shona (`sn-latn-zw`)|English (`en-us`)|
|Slovak (`sk-sk`)|English (`en-us`)|
|Slovenian (`sl-si`)|English (`en-us`)|
|Ukrainian (`uk-ua`)|English (`en-us`)|


## 2023-June release

### June 2023 new features and model updates

#### Custom Translator platform upgrade

&emsp; 🆕 ***Model Upgrade Wizard*** is now available in **Workspace settings** to help guide customers through the V1-model-upgrade-to-new-platform process. For more information, *see* [Custom Translator platform upgrade](platform-upgrade.md).

#### Custom Translator copy model

&emsp; 🆕 ***Copy Model*** is now available in **Model details** to enable the copying of models from one workspace to another. This feature enables model lifecycle management (development → testing → production) and/or scaling. For more information, *see* [Copy a custom model](how-to/copy-model.md).

#### Restrict access to published models

 &emsp; Published model security is now enhanced and restricted access is now enabled within **Workspace settings** to allow only linked Translator resources to request translation.

#### June language model updates

&emsp; Current supported language pairs are listed in the following table. For higher quality, we encourage you to retrain your models accordingly. For more information, *see* [Language support](../language-support.md).

|Source Language|Target Language|
|:----|:----|
| Czech (`cs-cz`)     | English (`en-us`) |
| Danish (`da-dk`)     | English (`en-us`) |
| German (de-&#8203;de)     | English (`en-us`) |
| Greek (`el-gr`)     | English (`en-us`) |
| English (`en-us`)     | Arabic (`ar-sa`) |
| English (`en-us`)     | Czech (`cs-cz`) |
| English (`en-us`)     | Danish (`da-dk`) |
| English (`en-us`)     | German (de-&#8203;de) |
| English (`en-us`)     | Greek (`el-gr`) |
| English (`en-us`)     | Spanish (`es-es`) |
| English (`en-us`)     | French (`fr-fr`) |
| English (`en-us`)     | Hebrew (`he-il`) |
| English (`en-us`)     | Hindi (`hi-in`) |
| English (`en-us`)     | Croatian (`hr-hr`) |
| English (`en-us`)     | Hungarian (`hu-hu`) |
| English (`en-us`)     | Indonesian (`id-id`) |
| English (`en-us`)     | Italian (`it-it`) |
| English (`en-us`)     | Japanese (`ja-jp`) |
| English (`en-us`)     | Korean (`ko-kr`) |
| English (`en-us`)     | Lithuanian (`lt-lt`) |
| English (`en-us`)     | Latvian (`lv-lv`) |
| English (`en-us`)     | Norwegian (`nb-no`) |
| English (`en-us`)     | Polish (`pl-pl`) |
| English (`en-us`)     | Portuguese (`pt-pt`) |
| English (`en-us`)     | Russian (`ru-ru`) |
| English (`en-us`)     | Slovak (`sk-sk`) |
| English (`en-us`)     | Swedish (`sv-se`) |
| English (`en-us`)     | Ukrainian (`uk-ua`) |
| English (`en-us`)     | Vietnamese (`vi-vn`) |
| English (`en-us`)     | Chinese Simplified (`zh-cn`) |
| Spanish (`es-es`)     | English (`en-us`) |
| French (`fr-fr`)     | English (`en-us`) |
| Hindi (`hi-in`)     | English (`en-us`) |
| Hungarian (`hu-hu`)     | English (`en-us`) |
| Indonesian (`id-id`)     | English (`en-us`) |
| Italian (`it-it`)     | English (`en-us`) |
| Japanese (`ja-jp`)     | English (`en-us`) |
| Korean (`ko-kr`)     | English (`en-us`) |
| Norwegian (`nb-no`)     | English (`en-us`) |
| Dutch (`nl-nl`)     | English (`en-us`) |
| Polish (`pl-pl`)     | English (`en-us`) |
| Portuguese (`pt-br`)     | English (`en-us`) |
| Russian (`ru-ru`)     | English (`en-us`) |
| Swedish (`sv-se`)     | English (`en-us`) |
| Thai (`th-th`)     | English (`en-us`) |
| Turkish (`tr-tr`)     | English (`en-us`) |
| Vietnamese (`vi-vn`)     | English (`en-us`) |
| Chinese Simplified (`zh-cn`)     | English (`en-us`) |

## 2022-November release

### November 2022 improvements and fixes

#### Custom Translator stable GA v2.0 release

* Custom Translator version v2.0 is generally available and ready for use in your production applications.

* Upload history is added to the workspace, next to Projects and Documents tabs.

#### November language model updates

* Language pairs are listed in the following table. We encourage you to retrain your models accordingly for higher quality.

|Source Language|Target Language|
|:----|:----|
|Chinese Simplified (`zh-hans`)|English (`en-us`)|
|Chinese Traditional (zh-Hant)|English (`en-us`)|
|Czech (cs)|English (`en-us`)|
|Dutch (nl)|English (`en-us`)|
|English (`en-us`)|Chinese Simplified (`zh-hans`)|
|English (`en-us`)|Chinese Traditional (zh-Hant)|
|English (`en-us`)|Czech (cs)|
|English (`en-us`)|Dutch (nl)|
|English (`en-us`)|French (fr)|
|English (`en-us`)|German (de)|
|English (`en-us`)|Italian (it)|
|English (`en-us`)|Polish (pl)|
|English (`en-us`)|Romanian (ro)|
|English (`en-us`)|Russian (ru)|
|English (`en-us`)|Spanish (es)|
|English (`en-us`)|Swedish (sv)|
|German (de)|English (`en-us`)|
|Italian (it)|English (`en-us`)|
|Russian (ru)|English (`en-us`)|
|Spanish (es)|English (`en-us`)|

#### Security update

* Custom Translator API preview REST API calls now require User Access Token to authenticate.

* Visit our GitHub repo for a [C# code sample](https://github.com/MicrosoftTranslator/CustomTranslator-API-CSharp).

#### Fixes

* Resolved document upload error that caused a blank page in the browser.

* Applied functional modifications.

## 2021-May release

### **May** 2021 improvements and fixes

* We added new training pipeline to improve the custom model generalization and capacity to retain more customer terminology (words and phrases).

* Refreshed Custom Translator baselines to fix word alignment bug. See list of impacted language pair*.

### Language pair list

| Source Language   | Target Language |
|-------------------|-----------------|
| Arabic (`ar`) | English (``en-us``)|
| Brazilian Portuguese (`pt`)    | English (``en-us``)|
| Bulgarian (`bg`)    | English (``en-us``)|
| Chinese Simplified (``zh-hans``)    | English (``en-us``)|
| Chinese Traditional (`zh-Hant`)    | English (``en-us``)|
| Croatian (`hr`)    | English (``en-us``)|
| Czech (`cs`)    | English (``en-us``)|
| Danish (`da`)    | English (``en-us``)|
| Dutch (nl)    | English (``en-us``)|
| English (``en-us``)    | Arabic (`ar`)|
| English (``en-us``)    | Bulgarian (`bg`)|
| English (``en-us``)    | Chinese Simplified (``zh-hans``|
| English (``en-us``)    | Chinese Traditional (`zh-Hant`|
| English (``en-us``)    | Czech (`cs)`|
| English (``en-us``)    | Danish (`da`)|
| English (``en-us``)    | Dutch (`nl`)|
| English (``en-us``)    | Estonian (`et`)|
| English (``en-us``)    | Fijian (`fj`)|
| English (``en-us``)    | Finnish (`fi`)|
| English (``en-us``)    | French (`fr`)|
| English (``en-us``)    | Greek (`el`)|
| English (``en-us``)    | Hindi (`hi`) |
| English (``en-us``)    | Hungarian (`hu`)|
| English (``en-us``)    | Icelandic (`is`)|
| English (``en-us``)    | Indonesian (`id`)|
| English (``en-us``)    | Inuktitut (`iu`)|
| English (``en-us``)    | Irish (`ga`)|
| English (``en-us``)    | Italian (`it`)|
| English (``en-us``)    | Japanese (`ja`)|
| English (``en-us``)    | Korean (`ko`)|
| English (``en-us``)    | Lithuanian (`lt`)|
| English (``en-us``)    | Norwegian (`nb`)|
| English (``en-us``)    | Polish (`pl`)|
| English (``en-us``)    | Romanian (`ro`)|
| English (``en-us``)    | Samoan (`sm`)|
| English (``en-us``)    | Slovak (`sk`)|
| English (``en-us``)    | Spanish (`es`)|
| English (``en-us``)    | Swedish (`sv`)|
| English (``en-us``)    | Tahitian (`ty`)|
| English (``en-us``)    | Thai (`th`)|
| English (``en-us``)    | Tongan (`to`)|
| English (``en-us``)    | Turkish (`tr`)|
| English (``en-us``)    | Ukrainian (`uk`) |
| English (``en-us``)    | Welsh (`cy`)|
| Estonian (`et`)    | English (``en-us``)|
| Fijian (`fj`)   | English (``en-us``)|
| Finnish (`fi`)    | English (``en-us``)|
| German (`de`)    | English (``en-us``)|
| Greek (`el`)    | English (``en-us``)|
| Hungarian (`hu`)    | English (``en-us``)|
| Icelandic (`is`)    | English (``en-us``)|
| Indonesian (`id`)    | English (``en-us``)
| Inuktitut (`iu`)    | English (``en-us``)|
| Irish (`ga`)    | English (``en-us``)|
| Italian (`it`)    | English (``en-us``)|
| Japanese (`ja`)    | English (``en-us``)|
| Kazakh (`kk`)    | English (``en-us``)|
| Korean (`ko`)    | English (``en-us``)|
| Lithuanian (`lt`)    | English (``en-us``)|
| Malagasy (`mg`)    | English (``en-us``)|
| Maori (`mi`)    | English (``en-us``)|
| Norwegian (`nb`)    | English (``en-us``)|
| Persian (`fa`)    | English (``en-us``)|
|  Polish (`pl`)    | English (``en-us``)|
| Romanian (`ro`)    | English (``en-us``)|
| Russian (`ru`)    | English (``en-us``)|
| Slovak (`sk`)    | English (``en-us``)|
| Spanish (`es`)    | English (``en-us``)|
| Swedish (`sv`)    | English (``en-us``)|
| Tahitian (`ty`)    | English (``en-us``)|
| Thai (`th`)    | English (``en-us``)|
| Tongan (`to`)    | English (``en-us``)|
| Turkish (`tr`)    | English (``en-us``)|
| Vietnamese (`vi`)    | English (``en-us``)|
| Welsh (`cy`)    | English (``en-us``)|
