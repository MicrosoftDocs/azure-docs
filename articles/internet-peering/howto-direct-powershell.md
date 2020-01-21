---
title: Create or modify a Direct peering using PowerShell
titleSuffix: Azure
description: Create or modify a Direct peering using PowerShell
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: article
ms.date: 11/27/2019
ms.author: prmitiki
---

# Create or modify a Direct peering using PowerShell

This article describes how to create a Microsoft Direct peering by using PowerShell cmdlets and the Resource Manager deployment model. This article also shows you how to check the status of the resource, update it, or delete and deprovision it.

If you prefer, you can complete this guide using the [portal](howto-direct-portal.md).

## Before you begin
* Review [Prerequisites](prerequisites.md) and [Direct peering walkthrough](walkthrough-direct-all.md) before you begin configuration.
* In case you have Direct peering with Microsoft already, which are not converted to Azure resources, refer to [Convert a legacy Direct peering to Azure resource using PowerShell](howto-legacy-direct-powershell.md)

### Working with Azure PowerShell
[!INCLUDE [CloudShell](./includes/cloudshell-powershell-about.md)]

## Create and provision a Direct peering

### Sign in to your Azure account and select your subscription
[!INCLUDE [Account](./includes/account-powershell.md)]

### <a name=direct-location></a>Get the list of supported peering locations for Direct peering
[!INCLUDE [direct-location](./includes/direct-powershell-create-location.md)]

### <a name=create></a>Create a Direct peering
[!INCLUDE [direct-peering](./includes/direct-powershell-create-connection.md)]

### <a name=get></a>Verify Direct peering
[!INCLUDE [peering-direct-get](./includes/direct-powershell-get.md)]

## <a name="modify"></a>Modify a Direct peering
[!INCLUDE [peering-direct-modify](./includes/direct-powershell-modify.md)]

## <a name="delete"></a>Deprovision a Direct peering
[!INCLUDE [peering-direct-delete](./includes/delete.md)]

## Next steps

* [Create or modify Exchange peering using PowerShell](howto-exchange-powershell.md).
* [Convert a legacy Exchange peering to Azure resource using PowerShell](howto-legacy-exchange-powershell.md).

## Additional resources
You can get detailed descriptions of all the parameters by running the following command:

```powershell
Get-Help Get-AzPeering -detailed
```

For more information, visit [Internet peering FAQs](faqs.md)
