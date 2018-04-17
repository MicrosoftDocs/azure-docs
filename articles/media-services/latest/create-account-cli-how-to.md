---
title:  Create an Azure Media Services account with CLI 2.0 | Microsoft Docs
description: Follow the steps of this quickstart to create an Azure Media Services account.
services: media-services
documentationcenter: ''
author: Juliako
manager: cflower
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.custom: 
ms.date: 03/27/2018
ms.author: juliako
---

# Create an Azure Media Services account

When creating a Media Services account, you need to supply the name of an Azure Storage account resource. The specified storage account is attached to your Media Services account. This storage account resource has to be located in the same geographic region as the Media Services account.  

This topic describes steps for creating a new Azure Media Services account using CLI 2.0.  

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Log in to Azure

Log in to the [Azure portal](http://portal.azure.com) and launch **CloudShell** to execute CLI commands, as shown in the next steps.

[!INCLUDE [cloud-shell-powershell.md](../../../includes/cloud-shell-powershell.md)]

If you choose to install and use the CLI locally, this topic requires the Azure CLI version 2.0 or later. Run `az --version` to find the version you have. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Set the Azure subscription

In the following command, provide the Azure subscription ID that you want to use for the Media Services account. You can see a list of subscriptions that you have access to by navigating to [Subscriptions](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade).

```azurecli-interactive
az account set --subscription mySubscriptionId
```
 
[!INCLUDE [media-services-cli-create-v3-account-include](../../../includes/media-services-cli-create-v3-account-include.md)]
 

## Next steps

> [!div class="nextstepaction"]
> [Stream a file](stream-files-dotnet-quickstart.md)
