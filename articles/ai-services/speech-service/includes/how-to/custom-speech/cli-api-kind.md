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
|OutputFormatting |Training data: Output format |

> [!IMPORTANT]
> You don't use the Speech CLI or REST API to upload data files directly. First you store the training or testing dataset files at a URL that the Speech CLI or REST API can access. After you upload the data files, you can use the Speech CLI or REST API to create a dataset for custom speech testing or training.
