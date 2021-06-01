---
title: include file
ms.topic: include
ms.custom: include file
ms.date: 5/17/2020
---

Learn [concepts](../luis-concept-utterance.md#utterance-normalization-for-diacritics-and-punctuation) of normalization and how to use [version](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/versions-update-application-version-settings) APIs to update these settings or use the LUIS portal's **Manage** section, **Settings** page.


|UI setting|API setting|Information|
|--|--|--|
|Use non-deterministic training|`UseAllTrainingData`|Training uses a small percentage of negative sampling. If you want to use all data instead of the small negative sampling, set to `true`. |
|Normalize diacritics|`NormalizeDiacritics`|Normalizing diacritics replaces the characters with diacritics in utterances with regular characters. This setting is only available on [languages](../luis-reference-application-settings.md#diacritics-normalization) that support diacritics.|
|Normalize punctuation|`NormalizePunctuation`|Normalizing punctuation means that before your models get trained and before your endpoint queries get predicted, punctuation will be removed from the utterances.|
|Normalize word forms|`NormalizeWordForm`|Ignore word forms beyond root.|
