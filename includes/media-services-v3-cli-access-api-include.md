---
title: include file
description: include file
services: media-services
author: Juliako
ms.service: media-services
ms.topic: include
ms.date: 04/13/2018
ms.author: juliako
ms.custom: include file
---

## Access the Media Services API

To connect to Azure Media Services APIs, you use the Azure AD service principal authentication. The following command creates an Azure AD application and attaches a service principal to the account. You should use the returned values to configure your app.

If you are developing in Visual Studio Code or Visual Studio, you would normally add these values to your App.config. If you are using Postman, you might want to create environment variables and set them to the values you got after executing the following script.  

Before running the script, you can replace the `amsaccount` and `amsResourceGroup` with the names you chose when creating these resources. `amsaccount` is the name of the Azure Media Services account where to attach the service principal. <br/>The command that follows uses the `xml` option that returns an xml that you can paste in your app.config. If you omit the `xml` option, the response will be in `json`.

```azurecli-interactive
az ams account sp create --account-name amsaccount --resource-group amsResourceGroup --xml
```

This command will produce a response similar to this:

```xml
<add key="Region" value="West US 2" />
<add key="ResourceGroup" value="amsResourceGroup" />
<add key="AadEndpoint" value="https://login.microsoftonline.com" />
<add key="AccountName" value="amsaccount" />
<add key="SubscriptionId" value="111111111-0000-2222-3333-55555555555" />
<add key="ArmAadAudience" value="https://management.core.windows.net/" />
<add key="AadTenantId" value="2222222222-0000-2222-3333-6666666666666" />
<add key="AadSecret" value="33333333-0000-2222-3333-55555555555" />
<add key="AadClientId" value="44444444-0000-2222-3333-55555555555" />
<add key="ArmEndpoint" value="https://management.azure.com/" />
```
 
