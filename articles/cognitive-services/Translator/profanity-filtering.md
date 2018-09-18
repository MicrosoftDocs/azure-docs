---
title: Profanity filtering - Translator Text API
titlesuffix: Azure Cognitive Services
description: Use profanity filtering in the Translator Text API.
services: cognitive-services
author: Jann-Skotdal
manager: cgronlun

ms.service: cognitive-services
ms.component: translator-text
ms.topic: conceptual
ms.date: 12/14/2017
ms.author: v-jansko
---

# Add profanity filtering with the Translator Text API

Normally the Translator service retains profanity that is present in the source in the translation. The degree of profanity and the context that makes words profane differ between cultures. As a result the degree of profanity in the target language may be amplified or reduced.

If you want to avoid seeing profanity in the translation (even if profanity is present in the source text), use the profanity filtering option in the Translate() method. This option allows you to choose whether you want to see profanity deleted or marked with appropriate tags, or no action taken.

The Translate() method takes an “options” parameter, which contains the new element “ProfanityAction”. The accepted values of ProfanityAction are “NoAction,” “Marked” and “Deleted.”

## Accepted values of ProfanityAction and examples
|ProfanityAction value | Action | Example: Source - Japanese | Example: Target - English|
| :---|:---|:---|:---|
| NoAction | Default. Same as not setting the option. Profanity passes from source to target. | 彼は変態です。 | He is a jerk. |
| Marked | Profane words are surrounded by XML tags \<profanity> … \</profanity>. | 彼は変態です。 | He is a \<profanity>jerk\</profanity>. |
| Deleted | Profane words are removed from the output without replacement. | 彼は。 | He is a. |

## Next steps
> [!div class="nextstepaction"]
> [Apply profanity filtering with your Translator API call](reference/v3-0-translate.md)

