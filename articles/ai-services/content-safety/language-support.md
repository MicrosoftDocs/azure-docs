---
title: Language support - Azure AI Content Safety
titleSuffix: Azure AI services
description: This is a list of natural languages that the Azure AI Content Safety API supports.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.topic: conceptual
ms.date: 06/01/2024
ms.author: pafarley

---

# Language support for Azure AI Content Safety

> [!IMPORTANT]
> The Azure AI Content Safety models for protected material, groundedness detection, and custom categories (standard) work with English only.
>
> Other Azure AI Content Safety models have been specifically trained and tested on the following languages: Chinese, English, French, German, Italian, Japanese, Portuguese. However, these features can work in many other languages, but the quality might vary. In all cases, you should do your own testing to ensure that it works for your application.

> [!NOTE]
> **Language auto-detection**
>
> You don't need to specify a language code for text moderation or Prompt Shields. The service automatically detects your input language.

| Language name         | Language code | Supported | Specially trained|
|-----------------------|---------------|--------|--|
| Afrikaans             | `af`          | ✔️    |  |
| Albanian              | `sq`          | ✔️    |  |
| Amharic               | `am`          | ✔️    |  |
| Arabic                | `ar`          | ✔️    |  |
| Armenian              | `hy`          | ✔️    |  |
| Azerbaijani           | `az`          | ✔️    |  |
| Bangla                | `bn`          | ✔️    |  |
| Basque                | `eu`          | ✔️    |  |
| Belarusian            | `be`          | ✔️    |  |
| Bulgarian             | `bg`          | ✔️    |  |
| Bulgarian (Latin)     | `bg-Latn`     | ✔️    |  |
| Burmese               | `my`          | ✔️    |  |
| Catalan               | `ca`          | ✔️    |  |
| Cebuano               | `ceb`         | ✔️    |  |
| Chinese               | `zh`          | ✔️    | ✔️ |
| Chinese (Latin)       | `zh-Latn`     | ✔️    |  |
| Corsican              | `co`          | ✔️    |  |
| Croatian              | `hr`          | ✔️    |  |
| Czech                 | `cs`          | ✔️    |  |
| Danish                | `da`          | ✔️    |  |
| Dutch                 | `nl`          | ✔️    |  |
| English               | `en`          | ✔️    | ✔️ |
| Esperanto             | `eo`          | ✔️    |  |
| Estonian              | `et`          | ✔️    |  |
| Filipino              | `fil`         | ✔️    |  |
| Finnish               | `fi`          | ✔️    |  |
| French                | `fr`          | ✔️    | ✔️ |
| Galician              | `gl`          | ✔️    |  |
| Georgian              | `ka`          | ✔️    |  |
| German                | `de`          | ✔️    | ✔️ |
| Greek                 | `el`          | ✔️    |  |
| Greek (Latin)         | `el-Latn`     | ✔️    |  |
| Gujarati              | `gu`          | ✔️    |  |
| Haitian               | `ht`          | ✔️    |  |
| Hausa                 | `ha`          | ✔️    |  |
| Hawaiian              | `haw`         | ✔️    |  |
| Hebrew                | `iw`          | ✔️    |  |
| Hindi                 | `hi`          | ✔️    |  |
| Hindi (Latin script)  | `hi-Latn`     | ✔️    |  |
| Hmong, Mong           | `hmn`         | ✔️    |  |
| Hungarian             | `hu`          | ✔️    |  |
| Icelandic             | `is`          | ✔️    |  |
| Igbo                  | `ig`          | ✔️    |  |
| Indonesian            | `id`          | ✔️    |  |
| Irish                 | `ga`          | ✔️    |  |
| Italian               | `it`          | ✔️    | ✔️ |
| Japanese              | `ja`          | ✔️    | ✔️ |
| Japanese (Latin)      | `ja-Latn`     | ✔️    |  |
| Javanese              | `jv`          | ✔️    |  |
| Kazakh                | `kk`          | ✔️    |  |
| Khmer                 | `km`          | ✔️    |  |
| Korean                | `ko`          | ✔️    |  |
| Kurdish               | `ku`          | ✔️    |  |
| Kyrgyz                | `ky`          | ✔️    |  |
| Lao                   | `lo`          | ✔️    |  |
| Latin                 | `la`          | ✔️    |  |
| Latvian               | `lv`          | ✔️    |  |
| Lithuanian            | `lt`          | ✔️    |  |
| Luxembourgish         | `lb`          | ✔️    |  |
| Macedonian            | `mk`          | ✔️    |  |
| Malagasy              | `mg`          | ✔️    |  |
| Malay                 | `ms`          | ✔️    |  |
| Malayalam             | `ml`          | ✔️    |  |
| Maltese               | `mt`          | ✔️    |  |
| Maori                 | `mi`          | ✔️    |  |
| Marathi               | `mr`          | ✔️    |  |
| Mongolian             | `mn`          | ✔️    |  |
| Nepali                | `ne`          | ✔️    |  |
| Nyanja                | `ny`          | ✔️    |  |
| Norwegian             | `no`          | ✔️    |  |
| Pashto                | `ps`          | ✔️    |  |
| Persian               | `fa`          | ✔️    |  |
| Polish                | `pl`          | ✔️    |  |
| Portuguese            | `pt`          | ✔️    | ✔️ |
| Punjabi               | `pa`          | ✔️    |  |
| Romanian              | `ro`          | ✔️    |  |
| Russian               | `ru`          | ✔️    |  |
| Russian (Latin)       | `ru-Latn`     | ✔️    |  |
| Scottish Gaelic       | `gd`          | ✔️    |  |
| Serbian               | `sr`          | ✔️    |  |
| Shona                 | `sn`          | ✔️    |  |
| Sindhi                | `sd`          | ✔️    |  |
| Sinhala               | `si`          | ✔️    |  |
| Slovak                | `sk`          | ✔️    |  |
| Slovenian             | `sl`          | ✔️    |  |
| Somali                | `so`          | ✔️    |  |
| Southern Sotho        | `st`          | ✔️    |  |
| Spanish               | `es`          | ✔️    | ✔️ |
| Sundanese             | `su`          | ✔️    |  |
| Swahili               | `sw`          | ✔️    |  |
| Swedish               | `sv`          | ✔️    |  |
| Tajik                 | `tg`          | ✔️    |  |
| Tamil                 | `ta`          | ✔️    |  |
| Telugu                | `te`          | ✔️    |  |
| Thai                  | `th`          | ✔️    |  |
| Turkish               | `tr`          | ✔️    |  |
| Ukrainian             | `uk`          | ✔️    |  |
| Unknown language      | `und`         | ✔️    |  |
| Urdu                  | `ur`          | ✔️    |  |
| Uzbek                 | `uz`          | ✔️    |  |
| Vietnamese            | `vi`          | ✔️    |  |
| Welsh                 | `cy`          | ✔️    |  |
| Western Frisian       | `fy`          | ✔️    |  |
| Xhosa                 | `xh`          | ✔️    |  |
| Yiddish               | `yi`          | ✔️    |  |
| Yoruba                | `yo`          | ✔️    |  |
| Zulu                  | `zu`          | ✔️    |  |
