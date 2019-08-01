---
title: include file
description: include file
services: media-services
author: Juliako
ms.service: media-services
ms.topic: include
ms.date: 05/01/2019
ms.author: juliako
ms.custom: include file
---

## Access the Media Services API

To connect to Azure Media Services APIs, you use the Azure AD service principal authentication. The following command creates an Azure AD application and attaches a service principal to the account. You should use the returned values to configure your application.

Before running the script, you should replace the `amsaccount` and `amsResourceGroup` with the names you chose when creating these resources. `amsaccount` is the name of the Azure Media Services account where to attach the service principal.

The following command returns a `json` output:

```azurecli
az ams account sp create --account-name amsaccount --resource-group amsResourceGroup
```

This command produces a response similar to this:

```json
{
  "AadClientId": "00000000-0000-0000-0000-000000000000",
  "AadEndpoint": "https://login.microsoftonline.com",
  "AadSecret": "00000000-0000-0000-0000-000000000000",
  "AadTenantId": "00000000-0000-0000-0000-000000000000",
  "AccountName": "amsaccount",
  "ArmAadAudience": "https://management.core.windows.net/",
  "ArmEndpoint": "https://management.azure.com/",
  "Region": "West US 2",
  "ResourceGroup": "amsResourceGroup",
  "SubscriptionId": "00000000-0000-0000-0000-000000000000"
}
```

If you would like to get an `xml` in the response, use the following command:

```azurecli
az ams account sp create --account-name amsaccount --resource-group amsResourceGroup --xml
```
