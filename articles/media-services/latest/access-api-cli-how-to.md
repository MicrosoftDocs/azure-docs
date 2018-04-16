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

To connect to the Azure Media Services APIs, you use the Azure AD service principal authentication. The following command creates an Azure AD application and attaches a service principal to the account. You are going to use the returned values to configure you .NET app, as shown in the following step.

Before running the script, replace the `amsresourcegroup` and `amsaccountname` placeholders. `amsaccountname` is the name of the Azure Media Services account where to attach the service principal. <br/>The command that follows uses the `xml` option that returns an xml that you can paste in your app.config. If you omit the `xml` option, the response will be in `json`.

```azurecli-interactive
az ams account sp create --account-name "amsaccountname"  --resource-group "amsresourcegroup" --xml
```

This command will produce a response similar to this:

``` 
<add key="Region" value="value" />
<add key="ResourceGroup" value="value" />
<add key="AadEndpoint" value="value" />
<add key="AccountName" value="value" />
<add key="SubscriptionId" value="value" />
<add key="ArmAadAudience" value="value" />
<add key="AadTenantId" value="value" />
<add key="AadSecret" value="value" />
<add key="AadClientId" value="value" />
<add key="ArmEndpoint" value="value" />
```

## Next steps

> [!div class="nextstepaction"]
> [Stream a file](stream-files-dotnet-quickstart.md)
