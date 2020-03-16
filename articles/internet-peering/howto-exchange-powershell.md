---
title: Create or modify an Exchange peering using PowerShell
titleSuffix: Azure
description: Create or modify an Exchange peering using PowerShell
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: article
ms.date: 11/27/2019
ms.author: prmitiki
---

# Create or modify an Exchange peering using PowerShell

This article describes how to create a Microsoft Exchange peering by using PowerShell cmdlets and the Resource Manager deployment model. This article also shows you how to check the status of the resource, update it, or delete and deprovision it.

If you prefer, you can complete this guide using the [portal](howto-exchange-portal.md).

## Before you begin
* Review [Prerequisites](prerequisites.md) and [Exchange peering walkthrough](walkthrough-exchange-all.md) before you begin configuration.
* In case you have Exchange peerings with Microsoft already, which are not converted to Azure resources, refer to [Convert a legacy Exchange peering to Azure resource using PowerShell](howto-legacy-exchange-powershell.md)

### Working with Azure PowerShell
[!INCLUDE [CloudShell](./includes/cloudshell-powershell-about.md)]

## Create and provision an Exchange peering

### Sign in to your Azure account and select your subscription
[!INCLUDE [Account](./includes/account-powershell.md)]

### <a name=exchange-location></a>Get the list of supported peering locations for Exchange peering
[!INCLUDE [exchange-location](./includes/exchange-powershell-create-location.md)]

### <a name=create></a>Create an Exchange peering
[!INCLUDE [exchange-peering](./includes/exchange-powershell-create-connection.md)]

### <a name=get></a>Get Exchange peering
[!INCLUDE [peering-exchange-get](./includes/exchange-powershell-get.md)]

## <a name="modify"></a>Modify an Exchange peering
[!INCLUDE [peering-exchange-modify](./includes/exchange-powershell-modify.md)]

## <a name=delete></a>Deprovision an Exchange peering

[!INCLUDE [peering-exchange-delete](./includes/delete.md)]

## Next steps

* [Create or modify a Direct peering using PowerShell](howto-direct-powershell.md)
* [Convert a legacy Direct peering to Azure resource using PowerShell](howto-legacy-direct-powershell.md)

## Additional resources
You can get detailed descriptions of all the parameters by running the following command:

```powershell
Get-Help Get-AzPeering -detailed
```

For more information, visit [Internet peering FAQs](faqs.md)
