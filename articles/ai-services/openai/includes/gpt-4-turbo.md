---
title: GPT-4 Turbo general availability
titleSuffix: Azure OpenAI Service
description: Information on GPT-4 Turbo model behavior and limitations
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
ms.date: 04/29/2024
---

The latest GA release of GPT-4 Turbo is:

- `gpt-4` **Version:** `turbo-2024-04-09`

This is the replacement for the following preview models:

- `gpt-4` **Version:** `1106-Preview`
- `gpt-4` **Version:** `0125-Preview`
- `gpt-4` **Version:** `vision-preview`

### Differences between OpenAI and Azure OpenAI GPT-4 Turbo GA Models

- OpenAI's version of the latest `0409` turbo model supports JSON mode and function calling for all inference requests.
- Azure OpenAI's version of the latest `turbo-2024-04-09` currently doesn't support the use of JSON mode and function calling when making inference requests with image (vision) input. Text based input requests (requests without `image_url` and inline images) do support JSON mode and function calling.

### Differences from gpt-4 vision-preview

- Azure AI specific Vision enhancements integration with GPT-4 Turbo with Vision aren't supported for `gpt-4` **Version:** `turbo-2024-04-09`. This includes Optical Character Recognition (OCR), object grounding, video prompts, and improved handling of your data with images.

### GPT-4 Turbo provisioned managed availability

- `gpt-4` **Version:** `turbo-2024-04-09` is available for both standard and provisioned deployments. Currently the provisioned version of this model **doesn't support image/vision inference requests**. Provisioned deployments of this model only accept text input. Standard model deployments accept both text and image/vision inference requests.

### Region availability

For information on model regional availability consult the model matrix for [standard](../concepts/models.md#gpt-4-and-gpt-4-turbo-model-availability), and [provisioned deployments](../concepts/models.md#provisioned-deployment-model-availability).

### Deploying GPT-4 Turbo with Vision GA

To deploy the GA model from the Studio UI, select `GPT-4` and then choose the `turbo-2024-04-09` version from the dropdown menu. The default quota for the `gpt-4-turbo-2024-04-09` model will be the same as current quota for GPT-4-Turbo. See the [regional quota limits.](../concepts/models.md#standard-deployment-model-quota)
