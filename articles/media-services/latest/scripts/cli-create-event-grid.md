---
title: Azure CLI Script Example - Create an Azure Event Grid subscription | Microsoft Docs
description: The Azure CLI script in this topic shows how to create an account level Event Grid subscription for Job State Changes.
services: media-services
documentationcenter: ''
author: Juliako
manager: cfowler
editor: 

ms.assetid:
ms.service: media-services
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 05/11/2018
ms.author: juliako
---

# CLI example: Create an Azure Event Grid subscription 

The Azure CLI script in this article shows how to create an account level Event Grid subscription for Job State Changes.

[!INCLUDE [cloud-shell-try-it.md](../../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0.20 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli). 

## Example script

[!code-azurecli-interactive[main](../../../../cli_scripts/media-services/create-event-grid/Create-EventGrid.sh "Create an EventGrid subscription")]

## Next steps

For more examples, see [Azure CLI samples](../cli-samples.md).
