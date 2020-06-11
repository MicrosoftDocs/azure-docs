---
title: Create or modify an Exchange peering by using PowerShell
titleSuffix: Azure
description: Create or modify an Exchange peering by using PowerShell
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: how-to
ms.date: 11/27/2019
ms.author: prmitiki
---

# Create or modify an Exchange peering by using PowerShell

This article describes how to create a Microsoft Exchange peering by using PowerShell cmdlets and the Resource Manager deployment model. This article also shows you how to check the status of the resource, update it, or delete and deprovision it.

If you prefer, you can complete this guide by using the Azure [portal](howto-exchange-portal.md).

## Before you begin
* Review the [prerequisites](prerequisites.md) and the [Exchange peering walkthrough](walkthrough-exchange-all.md) before you begin configuration.
* If you already have Exchange peerings with Microsoft that aren't converted to Azure resources, see [Convert a legacy Exchange peering to an Azure resource by using PowerShell](howto-legacy-exchange-powershell.md).

### Work with Azure PowerShell
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

* [Create or modify a Direct peering by using PowerShell](howto-direct-powershell.md)
* [Convert a legacy Direct peering to an Azure resource by using PowerShell](howto-legacy-direct-powershell.md)

## Additional resources
You can get detailed descriptions of all the parameters by running the following command:

```powershell
Get-Help Get-AzPeering -detailed
```

For more information, see [Internet peering FAQs](faqs.md).
