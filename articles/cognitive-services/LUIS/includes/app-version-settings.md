---
title: include file
ms.topic: include
ms.custom: include file
ms.date: 5/04/2020
---

|Level|UI setting|API setting|Information|
|--|--|--|--|
|App|Make endpoints public|`Public`|Anyone can access your public app if they have a prediction key and know your app ID. |
|Version|Use non-deterministic training|`UseAllTrainingData`|Training uses a small percentage of negative sampling. If you want to use all data instead of the small negative sampling, set to `true`. |
|Version|Normalize diacritics|`NormalizeDiacritics`|Normalizing diacritics replaces the characters with diacritics in utterances with regular characters.|
|Version|Normalize punctuation|`NormalizePunctuation`|Normalizing punctuation means that before your models get trained and before your endpoint queries get predicted, punctuation will be removed from the utterances.|
|Version|Normalize word forms|`NormalizeWordForm`|Ignore word stemming.|

Learn [concepts](luis-concept-utterance.md#utterance-normalization-for-diacritics-and-punctuation) of diacritics, punctuation, and word stems.

Use [app](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/58aeface39e2bb03dcd5909e) and [version](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/versions-update-application-version-settings) APIs to update these settings or use the LUIS portal's **Manage** section, **Application Settings** page.