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
ms.date: 04/13/2017
ms.author: ralfwi
---


# Connect to Azure Germany by using Visual Studio
Developers use Visual Studio to easily manage their Azure subscriptions while building solutions. Currently, you can't configure a connection to Azure Germany in the Visual Studio user interface.  

## Visual Studio 2017
Visual Studio 2017 requires a configuration file for Visual Studio to connect to Azure Germany. With this file in place, Visual Studio connects to Azure Germany instead of global Azure.

### Create a configuration file for Azure Germany
Create a file named **AadProvider.Configuration.json** with the following content:

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

### Update Visual Studio for Azure Germany

1.	Close Visual Studio.
2.	Place **AadProvider.Configuration.json** in **%localappdata%\\.IdentityService\AadConfigurations**. Create this folder if it isn't present.
3.	Start Visual Studio and begin using your Azure Germany account.

> [!NOTE]
> With the configuration file, only Azure Germany subscriptions are accessible. You still see subscriptions that you configured previously, but they don't work because Visual Studio is now connected to Azure Germany instead of global Azure. To connect to global Azure, remove the file.
> 
> 

### Revert a Visual Studio connection to Azure Germany
To enable Visual Studio to connect to global Azure, you need to remove the configuration file that enables the connection to Azure Germany.

1.	Close Visual Studio.
2.	Delete or rename the **%localappdata%\.IdentityService\AadConfigurations** folder.
3.	Restart Visual Studio and begin using your global Azure account.

> [!NOTE]
> After this configuration is reverted, your Azure Germany subscriptions are no longer accessible.
> 
>

## Visual Studio 2015
Visual Studio 2015 requires a registry change for Visual Studio to connect to Azure Germany. After this registry key is set, Visual Studio connects to Azure Germany instead of global Azure.

### Update Visual Studio for Azure Germany
To enable Visual Studio to connect to Azure Germany, you need to update the registry.

1. Close Visual Studio.
2. Create a text file named **VisualStudioForAzureGermany.reg**.
3. Copy and paste the following text into **VisualStudioForAzureGermany.reg**:
   
        Windows Registry Editor Version 5.00
 
        [HKEY_CURRENT_USER\Software\Microsoft\VSCommon\ConnectedUser]
        "AadInstance"="https://login.microsoftonline.de/"
        "adaluri"="https://management.microsoftazure.de"
        "AzureRMEndpoint"="https://management.microsoftazure.de"
        "AzureRMAudienceEndpoint"="https://management.core.cloudapi.de"
        "EnableAzureRMIdentity"="true"
        "GraphUrl"="graph.cloudapi.de"
        "AadApplicationTenant"="f577cd82-810c-43f9-a1f6-0cc532871050"

4. Save and then run the file by double-clicking it. You are prompted to merge the file into your registry.
5. Start Visual Studio and begin using [Cloud Explorer](../vs-azure-tools-resources-managing-with-cloud-explorer.md) with your Azure Germany account.

> [!NOTE]
> After this registry key is set, only Azure Germany subscriptions are accessible. You still see subscriptions that you configured previously, but they don't work because Visual Studio is now connected to Azure Germany instead of global Azure. To connect to global Azure, revert the changes.
> 
> 

### Revert a Visual Studio connection to Azure Germany
To enable Visual Studio to connect to global Azure, you need to remove the registry settings that enable the connection to Azure Germany.

1. Close Visual Studio.
2. Create a text file named **VisualStudioForAzureGermany_Remove.reg**.
3. Copy and paste the following text into **VisualStudioForAzureGermany_Remove.reg**:
   
        Windows Registry Editor Version 5.00
   
        [HKEY_CURRENT_USER\Software\Microsoft\VSCommon\ConnectedUser]
        "AadInstance"=-
        "adaluri"=-
        "AzureRMEndpoint"=-
        "AzureRMAudienceEndpoint"=-
        "EnableAzureRMIdentity"=-
        "GraphUrl"=-
        
4. Save and then run the file by double-clicking it. You are prompted to merge the file into your registry.
5. Start Visual Studio.

> [!NOTE]
> After this registry key is reverted, your Azure Germany subscriptions appear but are not accessible. You can safely remove them.
> 
> 

## Next steps
For more information about connecting to Azure Germany, see the following resources:

* [Connect to Azure Germany by using PowerShell](./germany-get-started-connect-with-ps.md)
* [Connect to Azure Germany by using Azure CLI](./germany-get-started-connect-with-cli.md)
* [Connect to Azure Germany by using the Azure portal](./germany-get-started-connect-with-portal.md)





