---
title: Azure Media Player Localization
description: Multiple language support for users of non-English locales.
author: IngridAtMicrosoft
ms.author: inhenkel
ms.service: media-services
ms.topic: reference
ms.date: 04/20/2020
---

# Localization #

Multiple language support allows for users of non-English locales to natively interact with the player. Azure Media Player will instantiate with a global dictionary of languages, which will localize the error messages based on the page language. A developer can also create a player instance with a forced set language. The default language is English (en).

> [!NOTE]
> This feature is still going through some testing and as such is subject to bugs.

```html
    <video id="vid1" class="azuremediaplayer amp-default-skin" data-setup='{"language":"es"}'>...</video>
```

Azure Media Player currently supports the following languages with their corresponding language codes:

| Language            | Code | Language                | Code   | Language                | Code         |
|---------------------|------|-------------------------|--------|-------------------------|--------------|
| English {default}   | en   | Croatian                | hr     | Romanian                | ro           |
| Arabic              | ar   | Hungarian               | hu     | Slovak                  | sk           |
| Bulgarian           | bg   | Indonesian              | id     | Slovene                 | sl           |
| Catalan             | ca   | Icelandic               | is     | Serbian - Cyrillic      | sr-cyrl-cs   |
| Czech               | cs   | Italian                 | it     | Serbian - Latin         | sr-latn-rs   |
| Danish              | da   | Japanese                | ja     | Russian                 | ru           |
| German              | de   | Kazakh                  | kk     | Swedish                 | sv           |
| Greek               | el   | Korean                  | ko     | Thai                    | th           |
| Spanish             | es   | Lithuanian              | lt     | Tagalog                 | tl           |
| Estonian            | et   | Latvian                 | lv     | Turkish                 | tr           |
| Basque              | eu   | Malaysian               | ms     | Ukrainian               | uk           |
| Farsi               | fa   | Norwegian - BokmÃ¥l     | nb     | Urdu                    | ur           |
| Finnish             | fi   | Dutch                   | nl     | Vietnamese              | vi           |
| French              | fr   | Norwegian - Nynorsk     | nn     | Chinese - simplified    | zh-hans      |
| Galician            | gl   | Polish                  | pl     | Chinese - traditional   | zh-hant      |
| Hebrew              | he   | Portuguese - Brazil     | pt-br  |                         |              |
| Hindi               | hi   | Portuguese - Portugal   | pt-pt  |                         |              |


> [!NOTE]
> If you do not want any localization to occur you must force the language to English

## Next steps ##

- [Azure Media Player Quickstart](azure-media-player-quickstart.md)
