---
title: Scaling Media Reserved Units - Azure | Microsoft Docs
description: This topic is an overview of scaling Media Processing with Azure Media Services.
services: media-services
documentationcenter: ''
author: juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/11/2018
ms.author: juliako

---
# Scaling media processing

Azure Media Services enables you to scale media processing in your account by managing Media Reserved Units (MRUs). For detailed overview, see [Scaling media processing](../previous/media-services-scale-media-processing-overview.md). 

This article shows how to use [Media Services v3 CLI](https://aka.ms/ams-v3-cli-ref) to scale MRUs.

> [!NOTE]
> For the Audio Analysis and Video Analysis Jobs that are triggered by Media Services v3 or Video Indexer, it is highly recommended to provision your account with 10 S3 MRUs. <br/>If you need more than 10 S3 MRUs, open a support ticket using the [Azure portal](https://portal.azure.com/).

## Prerequisites 

- Install and use the CLI locally, this article requires the Azure CLI version 2.0 or later. Run `az --version` to find the version you have. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli). 

    Currently, not all [Media Services v3 CLI](https://aka.ms/ams-v3-cli-ref) commands work in the Azure Cloud Shell. It is recommended to use the CLI locally.

- [Create a Media Services account](create-account-cli-how-to.md).

## Scale Media Reserved Units with CLI

The following [az ams account mru](https://docs.microsoft.com/cli/azure/ams/account/mru?view=azure-cli-latest) command sets Media Reserved Units on the "amsaccount" account using the **count** and **type** parameters.

```azurecli
az account set mru -n amsaccount -g amsResourceGroup --count 10 --type S3
```

## Billing

You are charged  based on the number, type, and amount of time that MRUs are provisioned in your account. Charges apply whether or not you run any jobs. For a detailed explanation, see the FAQ section of the [Media Services pricing](https://azure.microsoft.com/pricing/details/media-services/) page.   

## Next step

[Analyze videos](analyze-videos-tutorial-with-api.md) 

## See also

[Azure CLI](https://docs.microsoft.com/cli/azure/ams?view=azure-cli-latest)
