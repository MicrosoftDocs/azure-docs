---
title: Access the Azure Media Services API - CLI 2.0 | Microsoft Docs
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

# Access Azure Media Services API with CLI 2.0
 
You should use the Azure AD service principal authentication to connect to the Azure Media Services API. Your application needs to request an Azure AD token that has the following parameters:

* Azure AD tenant endpoint
* Media Services resource URI
* Resource URI for REST Media Services
* Azure AD application values: the client ID and client secret

This article shows you how to use CLI 2.0 to create an Azure AD application and service principal and get the values that are needed to access Azure Media Services resources.

## Prerequisites 

Create a new Azure Media Services account, as described in [this quickstart](create-account-cli-quickstart.md).

## Log in to Azure

Log in to the [Azure portal](http://portal.azure.com) and launch **CloudShell** to execute CLI commands, as shown in the next steps.

[!INCLUDE [cloud-shell-powershell.md](../../../includes/cloud-shell-powershell.md)]

## Create an Azure AD application and service principal

Before running the script, please replace the following placeholder:

* *amsaccountname*: This is the name of the Azure Media Services account where to attach the service principal
* *myresourcegroup* 

```azurecli-interactive
az ams  sp create -a <amsaccountname> -g <myresourcegroup>
```

This command will produce a response similar to this:

``` 
{
  "AadClientId": "00000000-0000-0000-0000-000000000000",
  "AadEndpoint": "https://login.microsoftonline.com",
  "AadSecret": "00000000-0000-0000-0000-000000000000",
  "AadTenantId": "00000000-0000-0000-0000-000000000000",
  "AccountName": "amsname",
  "ArmAadAudience": "https://management.core.windows.net/",
  "ArmEndpoint": "https://management.azure.com/",
  "Region": "West US",
  "ResourceGroup": "myresourcegroup",
  "SubscriptionId": "00000000-0000-0000-0000-000000000000"
}
```

## Next steps

> [!div class="nextstepaction"]
> [Stream a file](stream-files-dotnet-quickstart.md)
