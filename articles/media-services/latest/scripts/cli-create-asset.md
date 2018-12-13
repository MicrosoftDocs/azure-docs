---
title: Azure CLI Script Example - Create an Azure Media Services asset | Microsoft Docs
description: The Azure CLI script in this topic shows how to create a Media Services Asset to upload content to.
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
ms.date: 11/11/2018
ms.author: juliako
---

# CLI example: Create an Asset

The Azure CLI script in this article shows how to create a Media Services Asset to upload content to.

## Prerequisites 

- Install and use the CLI locally, this article requires the Azure CLI version 2.0 or later. Run `az --version` to find the version you have. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli). 

    Currently, not all [Media Services v3 CLI](https://aka.ms/ams-v3-cli-ref) commands work in the Azure Cloud Shell. It is recommended to use the CLI locally.

- [Create a Media Services account](../create-account-cli-how-to.md).

## Example script

[!code-azurecli-interactive[main](../../../../cli_scripts/media-services/create-asset/Create-Asset.sh "Create an asset")]

## Next steps

For more examples, see [Azure CLI samples](../cli-samples.md).
