---
title: Upload content to an Azure Media Services asset using Azure CLI
description: The Azure CLI script in this topic shows how to create a Media Services Asset to upload content to.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: 

ms.assetid:
ms.service: media-services
ms.devlang: azurecli
ms.topic: how-to
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 08/18/2020
ms.author: inhenkel
ms.custom: devx-track-azurecli
---

# Create an Asset

This article shows how to create a Media Services Asset to upload content to.

## Prerequisites

Follow the steps in [Create a Media Services account](./create-account-howto.md) to create the needed Media Services account and resource group to create an asset.

## [CLI](#tab/cli/)

[!INCLUDE [Create an asset with CLI](./includes/task-create-asset-cli.md)]

## [CLI Shell](#tab/clishell/)

[!INCLUDE [media-services-cli-instructions.md](../../../includes/media-services-cli-instructions.md)]

## Example script

[!code-azurecli-interactive[main](../../../cli_scripts/media-services/create-asset/Create-Asset.sh "Create an asset")]

## Next steps

[Media Services overview](media-services-overview.md)
