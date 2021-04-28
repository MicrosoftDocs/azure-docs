---
title: Azure CLI Script Example - Create a transform 
description: Transforms describe a simple workflow of tasks for processing your video or audio files (often referred to as a "recipe"). The Azure CLI script in this article shows how to create a transform. 
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: 

ms.assetid:
ms.service: media-services
ms.devlang: multiple
ms.topic: how-to
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 11/18/2020
ms.author: inhenkel 
ms.custom: devx-track-azurecli
---


# Create a transform

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

The Azure CLI script in this article shows how to create a transform. Transforms describe a simple workflow of tasks for processing your video or audio files (often referred to as a "recipe"). You should always check if a Transform with desired name and "recipe" already exist. If it does, you should reuse it.

## Prerequisites

[Create a Media Services account](./account-create-how-to.md).

## [CLI](#tab/cli/)

> [!NOTE]
> You can only specify a path to a custom Standard Encoder preset JSON file for [StandardEncoderPreset](/rest/api/media/transforms/createorupdate#standardencoderpreset), see the [encode with a custom transform](transform-custom-preset-cli-how-to.md) example.
>
> You cannot pass a file name when using [BuiltInStandardEncoderPreset](/rest/api/media/transforms/createorupdate#builtinstandardencoderpreset).

## Example script

[!code-azurecli-interactive[main](../../../cli_scripts/media-services/create-transform/Create-Transform.sh "Create a transform")]

## [REST](#tab/rest/)

[!INCLUDE [task general transform creation](./includes/task-create-basic-audio-rest.md)]

---

## Next steps

[!INCLUDE [transforms next steps](./includes/transforms-next-steps.md)]
