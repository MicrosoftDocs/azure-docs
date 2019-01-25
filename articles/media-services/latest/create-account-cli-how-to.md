---
title: Create a Media Services account with the Azure CLI - Azure | Microsoft Docs
description: Follow the steps of this quickstart to create an Azure Media Services account.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.custom: 
ms.date: 01/15/2019
ms.author: juliako
ms.custom: seodec18

---

# Create an Azure Media Services account

To start encrypting, encoding, analyzing, managing, and streaming media content in Azure, you need to create a Media Services account. At the time, you create a Media Services account, you also create an associated storage account (or use an existing one).  

The Media Services account and the storage account associated with it have to be part of the same datacenter and the same resource group.

This article describes steps for creating a new Azure Media Services account using the Azure CLI.  

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

- An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
- Install and use the CLI locally, this article requires the Azure CLI version 2.0 or later. Run `az --version` to find the version you have. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli). 

    Currently, not all [Media Services v3 CLI](https://aka.ms/ams-v3-cli-ref) commands work in the Azure Cloud Shell. It is recommended to use the CLI locally.

## Set the Azure subscription

In the following command, provide the Azure subscription ID that you want to use for the Media Services account. You can see a list of subscriptions that you have access to by navigating to [Subscriptions](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade).

```azurecli
az account set --subscription mySubscriptionId
```
 
[!INCLUDE [media-services-cli-create-v3-account-include](../../../includes/media-services-cli-create-v3-account-include.md)]
 
## Next steps

[Stream a file](stream-files-dotnet-quickstart.md)

## See also

[Azure CLI](https://docs.microsoft.com/cli/azure/ams?view=azure-cli-latest)

