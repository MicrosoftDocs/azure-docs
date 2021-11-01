---
title: Reset your account credentials -CLI
description: Use the Azure CLI script to reset your account credentials and get the app.config settings back.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: 
ms.assetid: 
ms.service: media-services
ms.devlang: azurecli
ms.topic: troubleshooting
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 08/31/2020
ms.author: inhenkel
ms.custom: devx-track-azurecli
---

# Azure CLI example: Reset the account credentials

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

The Azure CLI script in this article shows how to reset your account credentials and get the app.config settings back.

## Prerequisites

[Create a Media Services account](./create-account-howto.md).

## Example script

```azurecli-interactive
# Update the following variables for your own settings:
resourceGroup=amsResourceGroup
amsAccountName=amsmediaaccountname

az ams account sp reset-credentials \
  --account-name $amsAccountName \
  --resource-group $resourceGroup
 ```

## Next steps

* [az ams](/cli/azure/ams)
* [Reset credentials](/cli/azure/ams/account/sp#az_ams_account_sp_reset_credentials)
