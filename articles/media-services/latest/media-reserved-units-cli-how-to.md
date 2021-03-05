---
title: Scale Media Reserved Units (MRUs) CLI
description: This topic shows how to use CLI to scale media processing with Azure Media Services.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 09/30/2020
ms.author: inhenkel
---
# How to scale media reserved units

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

This article shows you how to scale Media Reserved Units (MRSs) for faster encoding.

## Prerequisites

[Create a Media Services account](./create-account-howto.md).

Understand [Media Reserved Units](concept-media-reserved-units.md).

## Scale Media Reserved Units with CLI

Run the `mru` command.

The following [az ams account mru](/cli/azure/ams/account/mru) command sets Media Reserved Units on the "amsaccount" account using the **count** and **type** parameters.

```azurecli
az ams account mru set -n amsaccount -g amsResourceGroup --count 10 --type S3
```

## Billing

You are charged based on number of minutes the Media Reserved Units are provisioned in your account. This occurs independent of whether there are any Jobs running in your account. For a detailed explanation, see the FAQ section of the [Media Services pricing](https://azure.microsoft.com/pricing/details/media-services/) page.   

## Next step

[Analyze videos](analyze-videos-tutorial-with-api.md)

## See also

* [Quotas and limits](limits-quotas-constraints.md)
