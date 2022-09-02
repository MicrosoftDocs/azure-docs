---
title: Speech-to-text REST API - Speech service
titleSuffix: Azure Cognitive Services
description: Get reference documentation for Speech-to-text REST API.
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

# Speech-to-text REST API v3.1

Speech-to-text REST API v3.1 is used for [Batch transcription](batch-transcription.md) and [Custom Speech](custom-speech-overview.md). 

> [!IMPORTANT]
> Version 3.0 of the [Speech to Text REST API](rest-speech-to-text.md) will be retired. Please [migrate your applications](migrate-v3-0-to-v3-1.md) to the Speech-to-text REST API v3.1. If you're still using version 2.0, see [Migrate code from v2.0 to v3.0 of the REST API](migrate-v2-to-v3.md) for additional requirements.

> [!div class="nextstepaction"]
> [See the Speech to Text API v3.1 reference documentation](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/)

Use Speech-to-text REST API to:
- Copy models to other subscriptions if you want colleagues to have access to a model that you built, or if you want to deploy a model to more than one region.
- Transcribe data from a container (bulk transcription) and provide multiple URLs for audio files.
- Upload data from Azure storage accounts by using a shared access signature (SAS) URI.
- Get logs for each endpoint if logs have been requested for that endpoint.
- Request the manifest of the models that you create, to set up on-premises containers.

## Features

Speech-to-text REST API includes such features as:
- **Webhook notifications**: All running processes of the service support webhook notifications. You can register your webhooks where notifications are sent.
- **Updating models behind endpoints** 
- **Model adaptation with multiple datasets**: Adapt a model by using multiple dataset combinations of acoustic, language, and pronunciation data.
- **Bring your own storage**: Use your own storage accounts for logs, transcription files, and other data.

For examples of using the Speech-to-text REST API for batch transcription, see [How to use batch transcription](batch-transcription.md).

## Next steps

- [Customize acoustic models](./how-to-custom-speech-train-model.md)
- [Customize language models](./how-to-custom-speech-train-model.md)
- [Get familiar with batch transcription](batch-transcription.md)

