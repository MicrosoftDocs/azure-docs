---
title: Create or modify an Exchange Peering using PowerShell
description: Create or modify an Exchange Peering using PowerShell
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: article
ms.date: 11/27/2019
ms.author: prmitiki
---

# Create or modify an Exchange Peering using PowerShell

This article describes how to create a Microsoft Exchange Peering by using PowerShell cmdlets and the Resource Manager deployment model. This article also shows you how to check the status of the resource, update it, or delete and deprovision it.

If you prefer, you can complete this guide using the [portal](howto-exchange-portal.md).

## Before you begin
* Review [Prerequisites](prerequisites.md) and [Exchange Peering walkthrough](walkthrough-exchange-all.md) before you begin configuration.
* In case you have Exchange Peerings with Microsoft already, which are not converted to Azure resources, refer to [Convert a legacy Exchange Peering to Azure resource using PowerShell](howto-legacy-exchange-powershell.md)

### Working with Azure PowerShell
[!INCLUDE [CloudShell](./includes/cloudshell-powershell-about.md)]

## Create and provision an Exchange Peering

### Sign in to your Azure account and select your subscription
[!INCLUDE [Account](./includes/account-powershell.md)]

### <a name=exchange-location></a>Get the list of supported peering locations for Exchange Peering
[!INCLUDE [exchange-location](./includes/exchange-powershell-create-location.md)]

### <a name=create></a>Create an Exchange Peering
[!INCLUDE [exchange-peering](./includes/exchange-powershell-create-connection.md)]

### <a name=get></a>Get Exchange Peering
[!INCLUDE [peering-exchange-get](./includes/exchange-powershell-get.md)]

## <a name="modify"></a>Modify an Exchange Peering
[!INCLUDE [peering-exchange-modify](./includes/exchange-powershell-modify.md)]

## <a name=delete></a>Deprovision an Exchange Peering

[!INCLUDE [peering-exchange-delete](./includes/delete.md)]

## Next steps

* [Create or modify a Direct Peering using PowerShell](howto-direct-powershell.md)
* [Convert a legacy Direct Peering to Azure resource using PowerShell](howto-legacy-direct-powershell.md)

## Additional resources
You can get detailed descriptions of all the parameters by running the following command:

```powershell
Get-Help Get-AzPeering -detailed
```

For more information, visit [Internet Peering FAQs](faqs.md)
