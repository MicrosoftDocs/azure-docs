---
title: Speech-to-text REST API v3.0 - Speech service
titleSuffix: Azure Cognitive Services
description: Get reference documentation for Speech-to-text REST API v3.0.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: reference
ms.date: 04/01/2022
ms.author: eur
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Speech-to-text REST API v3.0

Speech-to-text REST API v3.0 is used for [Batch transcription](batch-transcription.md) and [Custom Speech](custom-speech-overview.md). 

> See the [Speech to Text API v3.0](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/) reference documentation for details.

Use REST API v3.0 to:
- Copy models to other subscriptions if you want colleagues to have access to a model that you built, or if you want to deploy a model to more than one region.
- Transcribe data from a container (bulk transcription) and provide multiple URLs for audio files.
- Upload data from Azure storage accounts by using a shared access signature (SAS) URI.
- Get logs for each endpoint if logs have been requested for that endpoint.
- Request the manifest of the models that you create, to set up on-premises containers.

## Features

REST API v3.0 includes such features as:
- **Webhook notifications**: All running processes of the service support webhook notifications. REST API v3.0 provides the calls to enable you to register your webhooks where notifications are sent.
- **Updating models behind endpoints** 
- **Model adaptation with multiple datasets**: Adapt a model by using multiple dataset combinations of acoustic, language, and pronunciation data.
- **Bring your own storage**: Use your own storage accounts for logs, transcription files, and other data.

For examples of using REST API v3.0 with batch transcription, see [How to use batch transcription](batch-transcription.md).

For information about migrating to the latest version of the speech-to-text REST API, see [Migrate code from v2.0 to v3.0 of the REST API](./migrate-v2-to-v3.md).

## Next steps

- [Customize acoustic models](./how-to-custom-speech-train-model.md)
- [Customize language models](./how-to-custom-speech-train-model.md)
- [Get familiar with batch transcription](batch-transcription.md)

