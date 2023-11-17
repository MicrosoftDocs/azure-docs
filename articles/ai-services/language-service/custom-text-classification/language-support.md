---
title: Language support in custom text classification
titleSuffix: Azure AI services
description: Learn about which languages are supported by custom text classification.
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 05/06/2022
ms.author: aahi
ms.custom: language-service-custom-classification, ignite-fall-2021
---

# Language support for custom text classification

Use this article to learn about the languages currently supported by custom text classification feature.

## Multi-lingual option

With custom text classification, you can train a model in one language and use to classify documents in another language. This feature is useful because it helps save time and effort. Instead of building separate projects for every language, you can handle multi-lingual dataset in one project. Your dataset doesn't have to be entirely in the same language but you should enable the multi-lingual option for your project while creating or later in project settings. If you notice your model performing poorly in certain languages during the evaluation process, consider adding more data in these languages to your training set.

You can train your project entirely with English documents, and query it in: French, German, Mandarin, Japanese, Korean, and others. Custom text classification
makes it easy for you to scale your projects to multiple languages by using multilingual technology to train your models.

Whenever you identify that a particular language is not performing as well as other languages, you can add more documents for that language in your project. In the [data labeling](how-to/tag-data.md) page in Language Studio, you can select the language of the document you're adding. When you introduce more documents for that language to the model, it is introduced to more of the syntax of that language, and learns to predict it better.

You aren't expected to add the same number of documents for every language. You should build the majority of your project in one language, and only add a few documents in languages you observe aren't performing well. If you create a project that is primarily in English, and start testing it in French, German, and Spanish, you might observe that German doesn't perform as well as the other two languages. In that case, consider adding 5% of your original English documents in German, train a new model and test in German again. You should see better results for German queries. The more labeled documents you add, the more likely the results are going to get better. 

When you add data in another language, you shouldn't expect it to negatively affect other languages. 

## Languages supported by custom text classification

Custom text classification supports `.txt` files in the following languages:

| Language | Language Code |
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
| Persian | `fa` |
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
| Odia | `or` |
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

* [Custom text classification overview](overview.md)
* [Service limits](service-limits.md)
