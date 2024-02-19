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

If you selected the [Neural](?tabs=neural) training type, you can train a voice to speak in multiple languages. The `zh-CN` and `zh-TW` locales both support bilingual training for the voice to speak both Chinese and English. Depending in part on your training data, the synthesized voice can speak English with an English native accent or English with the same accent as the training data.

> [!NOTE]
> To enable a voice in the zh-CN locale to speak English with the same accent as the sample data, you should choose `Chinese (Mandarin, Simplified), English bilingual` when creating a project or specify the `zh-CN (English bilingual)` locale for the training set data via REST API.

If you want the voice to speak English with the same accent as the sample data, then at least 10% of the training set data must be in English. Moreover, the 10% threshold is calculated based on the data accepted after successful uploading, not the data before uploading. If some uploaded English data is rejected due to defects and doesn't meet the 10% threshold, the synthesized voice will default to an English native accent.

The following table shows the differences between the two locales:

| Speech Studio locale | REST API locale | Bilingual support | 
|:------------- |:------- |:-------------------------- |
| `Chinese (Mandarin, Simplified)` | `zh-CN` |If your sample data includes English, the synthesized voice will speak English with a native accent, instead of the same accent as the sample data, regardless of the amount of English data. | 
| `Chinese (Mandarin, Simplified), English bilingual` | `zh-CN (English bilingual)` |This option requires providing over 10% English data in your training set to ensure the synthesized voice can speak English with the same accent as the sample data. Otherwise, if the English data is less than 10% in your sample data, the synthesized voice will default to an English native accent.  |
| `Chinese (Taiwanese Mandarin, Traditional)` | `zh-TW` | If you want to train a synthesized voice capable of speaking English with the same accent as your sample data, make sure to provide over 10% English data in your training set. Otherwise, it will default to an English native accent. | 


