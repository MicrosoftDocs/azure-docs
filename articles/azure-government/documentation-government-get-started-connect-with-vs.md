---
title: Connect to Azure Government with Visual Studio | Microsoft Docs
description: Information on managing your subscription in Azure Government by connecting with Visual Studio
services: azure-government
cloud: gov
documentationcenter: ''
author: zakramer
manager: liki

ms.assetid: faf269aa-e879-4b0e-a5ba-d4110684616a
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 02/13/2017
ms.author: zakramer

---


# Connecting via Visual Studio
Visual Studio is used by developers to easily manage their Azure subscriptions while building solutions.  Visual Studio does not currently allow you to configure a connection to Azure Government in the user interface.  

## Visual Studio 2017
Visual Studio 2017 requires a configuration file for Visual Studio to connect to Azure Government.  With this file inplace Visual Studio connects to Azure Government instead of Azure Public.

### Create a configuration file for Azure Government
Create a file named **AadProvider.Configuration.json** with the following content:

        {
          "AuthenticationQueryParameters": null,
          "AsmEndPoint": "https://management.core.usgovcloudapi.net/",
          "Authority": "https://login.microsoftonline.us/",
          "AzureResourceManagementEndpoint": "https://management.usgovcloudapi.net",
          "AzureResourceManagementAudienceEndpoints": [ "https://management.core.usgovcloudapi.net" ],
          "ClientIdentifier": "872cd9fa-d31f-45e0-9eab-6e460a02d1f1",
          "EnvironmentName": "AzureUSGovernment",
          "GraphEndpoint": "https://graph.windows.net",
          "MsaHomeTenantId": "f8cdef31-a31e-4b4a-93e4-5f571e91255a",
          "NativeClientRedirect": "urn:ietf:wg:oauth:2.0:oob",
          "PortalEndpoint": "https://portal.azure.us/",
          "ResourceEndpoint": "https://management.core.usgovcloudapi.net",
          "ValidateAuthority": true,
          "VisualStudioOnlineEndpoint": "https://app.vssps.visualstudio.com/",
          "VisualStudioOnlineAudience": "499b84ac-1321-427f-aa17-267ca6975798"
        }

### Updating Visual Studio for Azure Government

1.	Close Visual Studio
2.	Place **AadProvider.Configuration.json** created in the previous step into **%localappdata%\\.IdentityService\AadConfigurations**.  Create this folder if not present.
3.	Launch Visual Studio and begin using your Azure Government account.

> [!NOTE]
> With the configuration file, only Azure Government subscriptions are accessible.  You still see subscriptions that you configured previously but they do not work because Visual Studio is now connected to Azure Government instead of Azure Public.  Remove the file to connect to Azure Commercial.
> 
> 

### Reverting Visual Studio Connection to Azure Government
To enable Visual Studio to connect to Azure Public, you need to remove the configuration file settings that enables connection to Azure Government.

1.	Close Visual Studio
2.	Delete this folder: **%localappdata%\.IdentityService\AadConfigurations**
3.	Restart Visual Studio and begin using your Azure Public account.

> [!NOTE]
> Once this configuration has been reverted, your Azure Government subscriptions no longer accessible.
> 
>

## Visual Studio 2015
Visual Studio 2015 requires a registry change for Visual Studio to connect to Azure Government.  Once this registry key is set Visual Studio connects to Azure Government instead of Azure Public.

### Updating Visual Studio for Azure Government
To enable Visual Studio to connect to Azure Government, you need to update the registry.

1. Close Visual Studio
2. Create a text file named **VisualStudioForAzureGov.reg**
3. Copy and paste the following text into **VisualStudioForAzureGov.reg**:
   
        Windows Registry Editor Version 5.00
   
        [HKEY_CURRENT_USER\Software\Microsoft\VSCommon\ConnectedUser]
        "AadInstance"="https://login.microsoftonline.us/"
        "adaluri"="https://management.core.usgovcloudapi.net"
        "AzureRMEndpoint"="https://management.usgovcloudapi.net"
        "AzureRMAudienceEndpoint"="https://management.core.usgovcloudapi.net"
        "EnableAzureRMIdentity"="true"
        "GraphUrl"="graph.windows.net"
4. Save and then run the file by double-clicking it.  You are prompted to merge the file into your registry.
5. Launch Visual Studio and begin using [Cloud Explorer](../vs-azure-tools-resources-managing-with-cloud-explorer.md) with your Azure Government account.

> [!NOTE]
> Once this registry key is set, only Azure Government subscriptions are accessible.  You still see subscriptions that you configured previously but they do not work because Visual Studio is now connected to Azure Government instead of Azure Public.  See the following section for steps to revert the changes.
> 
> 

### Reverting Visual Studio Connection to Azure Government
To enable Visual Studio to connect to Azure Public, you need to remove the registry settings that enable connection to Azure Government.

1. Close Visual Studio
2. Create a text file named **VisualStudioForAzureGov_Remove.reg**
3. Copy and paste the following text into **VisualStudioForAzureGov_Remove.reg**:
   
        Windows Registry Editor Version 5.00
   
        [HKEY_CURRENT_USER\Software\Microsoft\VSCommon\ConnectedUser]
        "AadInstance"=-
        "adaluri"=-
        "AzureRMEndpoint"=-
        "AzureRMAudienceEndpoint"=-
        "EnableAzureRMIdentity"=-
        "GraphUrl"=-
4. Save and then run the file by double-clicking it.  You are prompted to merge the file into your registry.
5. Launch Visual Studio

> [!NOTE]
> Once this registry key has been reverted, your Azure Government subscriptions show but are not accessible.  They can safely be removed.
> 
> 
