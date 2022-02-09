---
title: Scale Media Reserved Units (MRUs) CLI
description: This topic shows how to use CLI to scale media processing with Azure Media Services.
services: media-services
author: jiayali-ms
manager: femila
ms.service: media-services
ms.topic: how-to
ms.date: 08/25/2021
ms.author: inhenkel
---
# How to scale media reserved units (legacy)

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

This article shows you how to scale Media Reserved Units (MRUs) for faster encoding.

> [!WARNING]
> This command will no longer work for Media Services accounts that are created with the 2020-05-01 (or later) version of the API or later. For these accounts media reserved units are no longer needed as the system will automatically scale up and down based on load. If you don’t see the option to manage MRUs in the Azure portal, you’re using an account that was created with the 2020-05-01 API or later.
> The purpose of this article is to document the legacy process of using MRUs

## Prerequisites

[Create a Media Services account](./account-create-how-to.md).

Understand [Media Reserved Units](concept-media-reserved-units.md).

## Scale Media Reserved Units with CLI

Run the `mru` command.

The following [az ams account mru](/cli/azure/ams/account/mru) command sets Media Reserved Units on the "amsaccount" account using the **count** and **type** parameters.

```azurecli
az ams account mru set -n amsaccount -g amsResourceGroup --count 10 --type S3
```

## Billing

 While there were previously charges for Media Reserved Units, as of April 17, 2021 there are no longer any charges for accounts that have configuration for Media Reserved Units.

## See also

* [Migrate from Media Services v2 to v3](migrate-v-2-v-3-migration-introduction.md)
