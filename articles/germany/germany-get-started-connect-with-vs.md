---
title: Connect to Azure Germany by using Visual Studio | Microsoft Docs
description: Information on managing your subscription in Azure Germany by using Visual Studio
services: germany
cloud: na
documentationcenter: na
author: gitralf
manager: rainerst

ms.assetid: na
ms.service: germany
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/01/2019
ms.author: ralfwi
ms.custom: has-adal-ref
---

# Connect to Azure Germany by using Visual Studio

> [!IMPORTANT]
> Since [August 2018](https://news.microsoft.com/europe/2018/08/31/microsoft-to-deliver-cloud-services-from-new-datacentres-in-germany-in-2019-to-meet-evolving-customer-needs/), we have not been accepting new customers or deploying any new features and services into the original Microsoft Cloud Germany locations.
>
> Based on the evolution in customers’ needs, we recently [launched](https://azure.microsoft.com/blog/microsoft-azure-available-from-new-cloud-regions-in-germany/) two new datacenter regions in Germany, offering customer data residency, full connectivity to Microsoft’s global cloud network, as well as market competitive pricing.
>
> Take advantage of the breadth of functionality, enterprise-grade security, and comprehensive features available in our new German datacenter regions by [migrating](germany-migration-main.md) today.

Developers use Visual Studio to easily manage their Azure subscriptions while building solutions. Currently, in the Visual Studio user interface, you can't configure a connection to Azure Germany.

## Visual Studio 2017 and Visual Studio 2019

Visual Studio requires a configuration file to connect to Azure Germany. With this file in place, Visual Studio connects to Azure Germany instead of global Azure.

### Create a configuration file for Azure Germany

Create a file named *AadProvider.Configuration.json* with the following content:

```json
{
  "AuthenticationQueryParameters":null,
  "AsmEndPoint":"https://management.microsoftazure.de/",
  "Authority":"https://login.microsoftonline.de/",
  "AzureResourceManagementEndpoint":"https://management.microsoftazure.de/",
  "AzureResourceManagementAudienceEndpoints":["https://management.core.cloudapi.de/"],
  "ClientIdentifier":"872cd9fa-d31f-45e0-9eab-6e460a02d1f1",
  "EnvironmentName":"BlackForest",
  "GraphEndpoint":"https://graph.cloudapi.de",
  "MsaHomeTenantId":"f577cd82-810c-43f9-a1f6-0cc532871050",
  "NativeClientRedirect":"urn:ietf:wg:oauth:2.0:oob",
  "PortalEndpoint":"https://portal.core.cloudapi.de/",
  "ResourceEndpoint":"https://management.microsoftazure.de/",
  "ValidateAuthority":true,
  "VisualStudioOnlineEndpoint":"https://app.vssps.visualstudio.com/",
  "VisualStudioOnlineAudience":"499b84ac-1321-427f-aa17-267ca6975798"
}
```

### Update Visual Studio for Azure Germany

1. Close Visual Studio.
1. Place *AadProvider.Configuration.json* in *%localappdata%\\.IdentityService\AadConfigurations*. Create this folder if it isn't present.
1. Start Visual Studio and begin using your Azure Germany account.

> [!NOTE]
> With the configuration file, only Azure Germany subscriptions are accessible. You still see subscriptions that you configured previously, but they don't work because Visual Studio is now connected to Azure Germany instead of global Azure. To connect to global Azure, remove the file.
>

### Revert a Visual Studio connection to Azure Germany

To enable Visual Studio to connect to global Azure, you need to remove the configuration file that enables the connection to Azure Germany.

1. Close Visual Studio.
1. Delete or rename the *%localappdata%\.IdentityService\AadConfigurations* folder.
1. Restart Visual Studio and begin using your global Azure account.

> [!NOTE]
> After you revert this configuration, your Azure Germany subscriptions are no longer accessible.
>

## Visual Studio 2015

Visual Studio 2015 requires a registry change to connect to Azure Germany. After you set this registry key, Visual Studio connects to Azure Germany instead of global Azure.

### Update Visual Studio 2015 for Azure Germany

To enable Visual Studio to connect to Azure Germany, you need to update the registry.

1. Close Visual Studio.
1. Create a text file named *VisualStudioForAzureGermany.reg*.
1. Copy and paste the following text into *VisualStudioForAzureGermany.reg*:

```
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\Software\Microsoft\VSCommon\ConnectedUser]
"AadInstance"="https://login.microsoftonline.de/"
"adaluri"="https://management.microsoftazure.de"
"AzureRMEndpoint"="https://management.microsoftazure.de"
"AzureRMAudienceEndpoint"="https://management.core.cloudapi.de"
"EnableAzureRMIdentity"="true"
"GraphUrl"="graph.cloudapi.de"
"AadApplicationTenant"="f577cd82-810c-43f9-a1f6-0cc532871050"
```

1. Save and then run the file by double-clicking it. You're prompted to merge the file into your registry.
1. Start Visual Studio and begin using [Cloud Explorer](../vs-azure-tools-resources-managing-with-cloud-explorer.md) with your Azure Germany account.

> [!NOTE]
> After this registry key is set, only Azure Germany subscriptions are accessible. You still see subscriptions that you configured previously, but they don't work because Visual Studio is now connected to Azure Germany instead of global Azure. To connect to global Azure, revert the changes.
>

### Revert a Visual Studio 2015 connection to Azure Germany

To enable Visual Studio to connect to global Azure, you need to remove the registry settings that enable the connection to Azure Germany.

1. Close Visual Studio.
1. Create a text file named *VisualStudioForAzureGermany_Remove.reg*.
1. Copy and paste the following text into *VisualStudioForAzureGermany_Remove.reg*:

```
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\Software\Microsoft\VSCommon\ConnectedUser]
"AadInstance"=-
"adaluri"=-
"AzureRMEndpoint"=-
"AzureRMAudienceEndpoint"=-
"EnableAzureRMIdentity"=-
"GraphUrl"=-
```

1. Save and then run the file by double-clicking it. You're prompted to merge the file into your registry.
1. Start Visual Studio.

> [!NOTE]
> After you revert this registry key, your Azure Germany subscriptions appear but are not accessible. You can safely remove them.
>

## Next steps

For more information about connecting to Azure Germany, see the following resources:

* [Connect to Azure Germany by using PowerShell](./germany-get-started-connect-with-ps.md)
* [Connect to Azure Germany by using Azure CLI](./germany-get-started-connect-with-cli.md)
* [Connect to Azure Germany by using the Azure portal](./germany-get-started-connect-with-portal.md)
