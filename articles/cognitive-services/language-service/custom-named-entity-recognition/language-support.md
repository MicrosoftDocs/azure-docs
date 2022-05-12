---
title: Language and region support for Custom Named Entity Recognition (NER)
titleSuffix: Azure Cognitive Services
description: Learn about the languages and regions supported by Custom Named Entity Recognition (NER).
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 03/14/2022
ms.custom: references_regions, language-service-custom-ner, ignite-fall-2021
ms.author: aahi
---

# Language support for Custom Named Entity Recognition (NER)

Use this article to learn about the languages and regions currently supported by Custom Named Entity Recognition (NER).

## Multiple language support

With custom NER, you can train a model in one language and test in another language. This feature is very powerful because it helps you save time and effort, instead of building separate projects for every language, you can handle multi-lingual dataset in one project. Your dataset doesn't have to be entirely in the same language but you have to specify this option at project creation. If you notice your model performing poorly in certain languages during the evaluation process, consider adding more data in this language to your training set.

> [!NOTE]
> To enable support for multiple languages, you need to enable this option when [creating your project](how-to/create-project.md) or you can enable it later form the project settings page.

## Language support

Custom NER supports `.txt` files in the following languages:

| Language | Language code |
| --- | --- |
| Afrikaans | `af` |
| Amharic | `am` |
| Arabic | `ar` |
| Assamese | `as` |
| Azerbaijani | `az` |
| Belarusian | `be` |
| Bulgarian | `bg` |
| Bengali | `bn` |
| Breton | `br` |
| Bosnian | `bs` |
| Catalan | `ca` |
| Czech | `cs` |
| Welsh | `cy` |
| Danish | `da` |
| German | `de` 
| Greek | `el` |
| English (US) | `en-us` |
| Esperanto | `eo` |
| Spanish | `es` |
| Estonian | `et` |
| Basque | `eu` |
| Persian (Farsi) | `fa` |
| Finnish | `fi` |
| French | `fr` |
| Western Frisian | `fy` |
| Irish | `ga` |
| Scottish Gaelic | `gd` |
| Galician | `gl` |
| Gujarati | `gu` |
| Hausa | `ha` |
| Hebrew | `he` |
| Hindi | `hi` |
| Croatian | `hr` |
| Hungarian | `hu` |
| Armenian | `hy` |
| Indonesian | `id` |
| Italian | `it` |
| Japanese | `ja` |
| Javanese | `jv` |
| Georgian | `ka` |
| Kazakh | `kk` |
| Khmer | `km` |
| Kannada | `kn` |
| Korean | `ko` |
| Kurdish (Kurmanji) | `ku` |
| Kyrgyz | `ky` |
| Latin | `la` |
| Lao | `lo` |
| Lithuanian | `lt` |
| Latvian | `lv` |
| Malagasy | `mg` |
| Macedonian | `mk` |
| Malayalam | `ml` |
| Mongolian | `mn` |
| Marathi | `mr` |
| Malay | `ms` |
| Burmese | `my` |
| Nepali | `ne` |
| Dutch | `nl` |
| Norwegian (Bokmal) | `nb` |
| Oriya | `or` |
| Punjabi | `pa` |
| Polish | `pl` |
| Pashto | `ps` |
| Portuguese (Brazil) | `pt-br` |
| Portuguese (Portugal) | `pt-pt` |
| Romanian | `ro` |
| Russian | `ru` |
| Sanskrit | `sa` |
| Sindhi | `sd` |
| Sinhala | `si` |
| Slovak | `sk` |
| Slovenian | `sl` |
| Somali | `so` |
| Albanian | `sq` |
| Serbian | `sr` |
| Sundanese | `su` |
| Swedish | `sv` |
| Swahili | `sw` |
| Tamil | `ta` |
| Telugu | `te` |
| Thai | `th` |
| Filipino | `tl` |
| Turkish | `tr` |
| Uyghur | `ug` |
| Ukrainian | `uk` |
| Urdu | `ur` |
| Uzbek | `uz` |
| Vietnamese | `vi` |
| Xhosa | `xh` |
| Yiddish | `yi` |
| Chinese (Simplified) | `zh-hans` |
| Zulu | `zu` | 

## Next steps

[Custom NER overview](overview.md)
