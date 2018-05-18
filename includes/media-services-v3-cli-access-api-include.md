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

To connect to Azure Media Services APIs, you use the Azure AD service principal authentication. The following command creates an Azure AD application and attaches a service principal to the account. You are going to use the returned values to configure you .NET app, as shown in the following step.

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

### Configure the sample app

To run the app and access the Media Services APIs, you need to specify the correct access values in App.config. 

1. Open Visual Studio.
2. Browse to the solution that you cloned.
3. In the Solution Explorer, unfold the *EncodeAndStreamFiles* project.
4. Set this project as the start up project.
5. Open App.config.
6. Replace the appSettings values with the values that you got in the previous step.

 ```xml
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
 
7. Press Ctrl+Shift+B to build the solution.
