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

### Updating Visual Studio for Azure Government
To enable Visual Studio to connect to Azure Government, you need to update the registry.

1. Close Visual Studio
2. Create a text file named **VisualStudioForAzureGov.reg**
3. Copy and paste the following text into **VisualStudioForAzureGov.reg**:
   
        Windows Registry Editor Version 5.00
   
        [HKEY_CURRENT_USER\Software\Microsoft\VSCommon\ConnectedUser]
        "AadInstance"="https://login-us.microsoftonline.com/"
        "adaluri"="https://management.core.usgovcloudapi.net"
        "AzureRMEndpoint"="https://management.usgovcloudapi.net"
        "AzureRMAudienceEndpoint"="https://management.core.usgovcloudapi.net"
        "EnableAzureRMIdentity"="true"
        "GraphUrl"="graph.windows.net"
4. Save and then run the file by double-clicking it.  You are prompted to merge the file into your registry.
5. Launch Visual Studio and begin using [Cloud Explorer](../vs-azure-tools-resources-managing-with-cloud-explorer.md)

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
