---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 11/29/2022
ms.author: eur
---

With the [Speech CLI](~/articles/ai-services/speech-service/spx-overview.md) and [Speech to text REST API](~/articles/ai-services/speech-service/rest-speech-to-text.md), unlike the Speech Studio, you don't choose whether a dataset is for testing or training at the time of upload. You specify how a dataset is used when you [train a model](~/articles/ai-services/speech-service/how-to-custom-speech-train-model.md) or [run a test](~/articles/ai-services/speech-service/how-to-custom-speech-evaluate-data.md). 

Although you don't indicate whether the dataset is for testing or training, you must specify the dataset kind. The dataset kind is used to determine which type of dataset is created. In some cases, a dataset kind is only used for testing or training, but you shouldn't take a dependency on that. The Speech CLI and REST API `kind` values correspond to the options in the Speech Studio as described in the following table:

|CLI and API kind |Speech Studio options |
|---------|---------|
|Acoustic     |Training data: Audio + human-labeled transcript<br/>Testing data: Transcript (automatic audio synthesis)<br/>Testing data: Audio + human-labeled transcript         |
|AudioFiles     |Testing data: Audio         |
|Language     |Training data: Plain text         |
|LanguageMarkdown     |Training data: Structured text in markdown format         |
|Pronunciation     |Training data: Pronunciation         |

> [!NOTE]
> Structured text in markdown format training datasets are not supported by version 3.0 of the Speech to text REST API. You must use the [Speech to text REST API v3.1](~/articles/ai-services/speech-service/rest-speech-to-text.md). For more information, see [Migrate code from v3.0 to v3.1 of the REST API](~/articles/ai-services/speech-service/migrate-v3-0-to-v3-1.md).
