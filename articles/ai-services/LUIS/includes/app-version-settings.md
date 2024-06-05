---
ms.topic: include
ms.custom: include file
ms.date: 01/19/2024
---

Learn [concepts](../concepts/utterances.md#utterance-normalization) of normalization and how to use [version](/rest/api/cognitiveservices-luis/authoring/versions?view=rest-cognitiveservices-luis-authoring-v3.0-preview&preserve-view=true) APIs to update these settings or use the LUIS portal's **Manage** section, **Settings** page.


|UI setting|API setting|Information|
|--|--|--|
|Use non-deterministic training|`UseAllTrainingData`|Training uses a small percentage of negative sampling. If you want to use all data instead of the small negative sampling, set to `true`. |
|Normalize diacritics|`NormalizeDiacritics`|Normalizing diacritics replaces the characters with diacritics in utterances with regular characters. This setting is only available on [languages](../luis-reference-application-settings.md#diacritics-normalization) that support diacritics.|
|Normalize punctuation|`NormalizePunctuation`|Normalizing punctuation means that before your models get trained and before your endpoint queries get predicted, punctuation will be removed from the utterances.|
|Normalize word forms|`NormalizeWordForm`|Ignore word forms beyond root.|
