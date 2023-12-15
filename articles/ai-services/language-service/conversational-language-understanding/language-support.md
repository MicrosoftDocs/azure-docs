---
title: Conversational language understanding language support
titleSuffix: Azure AI services
description: This article explains which natural languages are supported by the conversational language understanding feature of Azure AI Language.
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 05/12/2022
ms.author: aahi
ms.custom: language-service-clu, ignite-fall-2021
---

# Language support for conversational language understanding

Use this article to learn about the languages currently supported by CLU feature.

## Multi-lingual option

> [!TIP]
> See [How to train a model](how-to/train-model.md#training-modes) for information on which training mode you should use for multilingual projects. 

With conversational language understanding, you can train a model in one language and use to predict intents and entities from utterances in another language. This feature is powerful because it helps save time and effort. Instead of building separate projects for every language, you can handle multi-lingual dataset in one project. Your dataset doesn't have to be entirely in the same language but you should enable the multi-lingual option for your project while creating or later in project settings. If you notice your model performing poorly in certain languages during the evaluation process, consider adding more data in these languages to your training set.

You can train your project entirely with English utterances, and query it in: French, German, Mandarin, Japanese, Korean, and others. Conversational language understanding makes it easy for you to scale your projects to multiple languages by using multilingual technology to train your models.

Whenever you identify that a particular language is not performing as well as other languages, you can add utterances for that language in your project. In the tag utterances page in Language Studio, you can select the language of the utterance you're adding. When you introduce examples for that language to the model, it is introduced to more of the syntax of that language, and learns to predict it better.

You aren't expected to add the same number of utterances for every language. You should build the majority of your project in one language, and only add a few utterances in languages you observe aren't performing well. If you create a project that is primarily in English, and start testing it in French, German, and Spanish, you might observe that German doesn't perform as well as the other two languages. In that case, consider adding 5% of your original English examples in German, train a new model and test in German again. You should see better results for German queries. The more utterances you add, the more likely the results are going to get better. 

When you add data in another language, you shouldn't expect it to negatively affect other languages. 

### List and prebuilt components in multiple languages

Projects with multiple languages enabled will allow you to specify synonyms **per language** for every list key. Depending on the language you query your project with, you will only get matches for the list component with synonyms of that language. When you query your project, you can specify the language in the request body:

```json
"query": "{query}"
"language": "{language code}"
```

If you do not provide a language, it will fall back to the default language of your project.

Prebuilt components are similar, where you should expect to get predictions for prebuilt components that are available in specific languages. The request's language again determines which components are attempting to be predicted. <!--See the [prebuilt components](../prebuilt-component-reference.md) reference article for the language support of each prebuilt component.-->



## Languages supported by conversational language understanding

Conversational language understanding supports utterances in the following languages:

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
| German | `de` |
| Greek | `el` |
| English (US) | `en-us` |
| English (UK) | `en-gb` |
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
| Chinese (Traditional) | `zh-hant` |
| Zulu | `zu` |



## Next steps

* [Conversational language understanding overview](overview.md)
* [Service limits](service-limits.md)
