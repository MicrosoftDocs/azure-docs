---
title: Azure OpenAI Service API version retirement
description: Learn more about API version retirement in Azure OpenAI Services
services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: conceptual 
ms.date: 01/08/2024
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
ms.custom:
---

# Azure OpenAI API preview lifecycle

This article is to help you understand the support lifecycle for the Azure OpenAI API previews.

## Latest preview API release

Azure OpenAI API version 2023-12-01-preview is currently the latest preview release.

This version contains support for all the latest Azure OpenAI features including:

- [Fine-tuning](./how-to/fine-tuning.md) `gpt-35-turbo`, `babbage-002`, and `davinci-002` models.[**Added in 2023-10-01-preview**]
- [Whisper](./whisper-quickstart.md). [**Added in 2023-09-01-preview**]
- [Function calling](./how-to/function-calling.md)  [**Added in 2023-07-01-preview**]
- [DALL-E](./dall-e-quickstart.md)  [**Added in 2023-06-01-preview**]
- [Retrieval augmented generation with the on your data feature](./use-your-data-quickstart.md).  [**Added in 2023-06-01-preview**]

## Retiring soon

On April 2, 2024 the following API preview releases will be retired and will stop accepting API requests:

- 2023-03-15-preview
- 2023-06-01-preview
- 2023-07-01-preview
- 2023-08-01-preview

To avoid service disruptions, you must update to use the latest preview version prior to the retirement date.

## Updating API versions

We recommend first testing the upgrade to new API versions to confirm there is no impact to your application from the API update prior to making the change globally across your environment.

If you are using the OpenAI Python client library or the REST API, you will need to update your code directly to the latest preview API version.

If you are using one of the Azure OpenAI SDKs for C#, Go, Java, or JavaScript you will instead need to update to the latest version of the SDK. Each SDK release is hardcoded to work with specific versions of the Azure OpenAI API.

## Next steps

- [Learn more about Azure OpenAI](overview.md)
- [Learn about working with Azure OpenAI models](./how-to/working-with-models.md)