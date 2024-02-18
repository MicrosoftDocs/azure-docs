---
title: include file
description: include file
author: eric-urban
ms.author: eur
ms.service: azure-ai-speech
ms.topic: include
ms.date: 2/18/2024
ms.custom: include
---

If you selected the [Neural](?tabs=neural) training type, you can train a voice to speak in multiple languages. The `zh-CN` and `zh-TW` locales both support bilingual training for the voice to speak both Chinese and English. Depending in part on your training data, the synthesized voice can speak English with an English accent or English with the same native accent as the training data.

> [!NOTE]
> However, for a voice in the `zh-CN` locale to speak English with the native accent, you must select `Chinese (Mandarin, Simplified), English bilingual` (or ``zh-CN (English bilingual)` via REST API) when creating a project.

If you want the voice to speak English with native accent, then at least 10% of the training dataset must be in English. Moreover, the 10% threshold is calculated based on the data accepted after successful uploading, not the data before uploading. If some uploaded English data is rejected due to defects and doesn't meet the 10% threshold, the synthesized voice will default to an English native accent.

The following table shows the differences between the two locales:

| Speech Studio locale | REST API locale | Bilingual support | 
|:------------- |:------- |:-------------------------- |
| `Chinese (Mandarin, Simplified)` | `zh-CN` | English with English accent is the default.<br/><br/>English with native accent isn't available, regardless of your training data. | 
| `Chinese (Mandarin, Simplified), English bilingual` | `zh-CN (English bilingual)` | English with English accent is the default.<br/><br/>If you want the voice to speak English with native accent, then at least 10% of the training dataset must be in English.  |
| `Chinese (Taiwanese Mandarin, Traditional)` | `zh-TW` | English with English accent is the default.<br/><br/>If you want the voice to speak English with native accent, then at least 10% of the training dataset must be in English. | 


