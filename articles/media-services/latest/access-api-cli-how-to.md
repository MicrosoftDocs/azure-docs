---
title: Access the Azure Media Services API - Azure CLI | Microsoft Docs
description: Follow the steps of this how-to to access the Azure Media Services API.
services: media-services
documentationcenter: ''
author: Juliako
manager: cflower
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.custom: mvc
ms.date: 03/19/2018
ms.author: juliako
---

# Access Azure Media Services API with the Azure CLI
 
You should use the Azure AD service principal authentication to connect to the Azure Media Services API. Your application needs to request an Azure AD token that has the following parameters:

* Azure AD tenant endpoint
* Media Services resource URI
* Resource URI for REST Media Services
* Azure AD application values: the client ID and client secret

This article shows you how to use the Azure CLI to create an Azure AD application and service principal and get the values that are needed to access Azure Media Services resources.

## Prerequisites 

Create a new Azure Media Services account, as described in [this quickstart](create-account-cli-quickstart.md).

## Log in to Azure

Log in to the [Azure portal](http://portal.azure.com) and launch **CloudShell** to execute CLI commands, as shown in the next steps.

[!INCLUDE [cloud-shell-powershell.md](../../../includes/cloud-shell-powershell.md)]

If you choose to install and use the CLI locally, this topic requires the Azure CLI version 2.0 or later. Run `az --version` to find the version you have. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli). 

[!INCLUDE [media-services-v3-cli-access-api-include](../../../includes/media-services-v3-cli-access-api-include.md)]

## Next steps

> [!div class="nextstepaction"]
> [Stream a file](stream-files-dotnet-quickstart.md)

## See also

[Azure CLI](https://docs.microsoft.com/en-us/cli/azure/ams?view=azure-cli-latest)
