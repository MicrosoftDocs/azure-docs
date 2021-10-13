---
title: How to find your Azure subscription
description: Find your Azure subscription so you can set up your environment.
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
ms.date: 08/31/2020
ms.author: inhenkel
ms.custom: portal

---
# Find your Azure subscription

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## [Portal](#tab/portal/)

## Use the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Under the Azure services heading, select Subscriptions. (If no subscriptions are listed, you may need to switch Azure AD tenants.) Your Subscription IDs are listed in the second column.
1. Copy the Subscription ID and paste it into a text document of your choice for use later.

## [CLI](#tab/cli/)

## Use the Azure CLI

<!-- NOTE: The following are in the includes file and are reused in other How To articles. All task based content should be in the includes folder with the "task-" prepended to the file name. -->

### List your Azure subscriptions with CLI

[!INCLUDE [List your Azure subscriptions with CLI](./includes/task-list-set-subscription-cli.md)]

### See also

* [Azure CLI](/cli/azure/ams)

---

## Next steps

[Stream a file](stream-files-dotnet-quickstart.md)
