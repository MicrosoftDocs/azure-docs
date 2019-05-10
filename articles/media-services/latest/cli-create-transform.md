---
title: Azure CLI Script Example - Create a transform | Microsoft Docs
description: Use the Azure CLI script to create a Transform.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: 

ms.assetid:
ms.service: media-services
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 05/01/2019
ms.author: juliako
---

# CLI example: Create a Transform

The Azure CLI script in this article shows how to create a transform. Transforms describe a simple workflow of tasks for processing your video or audio files (often referred to as a "recipe"). You should always check if a Transform with desired name and "recipe" already exist. If it does, you should reuse it.

## Prerequisites 

[Create a Media Services account](create-account-cli-how-to.md).

[!INCLUDE [media-services-cli-instructions.md](../../../includes/media-services-cli-instructions.md)]

## Example script

[!code-azurecli-interactive[main](../../../cli_scripts/media-services/create-transform/Create-Transform.sh "Create a transform")]

## Next steps

[Media Services overview](media-services-overview.md)
