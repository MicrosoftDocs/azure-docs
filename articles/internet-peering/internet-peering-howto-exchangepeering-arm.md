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

This article describes how to create a Microsoft Exchange Peering by using PowerShell cmdlets and the Azure resource Manager deployment model. This article also shows you how to check the status of the resource, update it, or delete and deprovision it.

If you prefer, you can complete this guide using the [Azure portal](internet-peering-howto-exchangepeering-arm-portal.md).

## Before you begin
* Review [Prerequisites](internet-peering-prerequisites.md) and [Exchange Peering walkthrough](internet-peering-workflows-exchange.md) before you begin configuration.
* In case you have Exchange Peerings with Microsoft already, which are not converted to Azure resources, please refer to [Convert a legacy Exchange Peering to Azure resource using PowerShell](internet-peering-howto-legacyexchange-arm.md)

### Working with Azure PowerShell
[!INCLUDE [CloudShell](./includes/internet-peering-cloudshell-powershell-about.md)]

## Create and provision an Exchange Peering

### 1. Sign in to your Azure account and select your subscription
[!INCLUDE [Account](./includes/internet-peering-account.md)]

### <a name=exchange-location></a> 2. Get the list of supported peering locations for Exchange Peering
[!INCLUDE [exchange-location](./includes/internet-peering-exchange-location.md)]

### <a name=create></a> 3. Create an Exchange Peering
[!INCLUDE [exchange-peering](./includes/internet-peering-exchange.md)]

### <a name=get></a> 4. Get Exchange Peering
[!INCLUDE [peering-exchange-get](./includes/internet-peering-exchange-get.md)]

## <a name="modify"></a>Modify an Exchange Peering
[!INCLUDE [peering-exchange-modify](./includes/internet-peering-exchange-modify.md)]

## <a name=delete></a>Deprovision an Exchange Peering

[!INCLUDE [peering-exchange-delete](./includes/internet-peering-exchange-delete.md)]

## Next steps

* [Create or modify a Direct Peering using PowerShell](internet-peering-howto-directpeering-arm.md)
* [Convert a legacy Direct Peering to Azure resource using PowerShell](internet-peering-howto-legacydirect-arm.md)

## Additional Resources
You can get detailed descriptions of all the parameters by running the following command:

```powershell
Get-Help Get-AzPeering -detailed
```

For more information, please visit [Peering FAQs](internet-peering-faqs.md)

[!INCLUDE [peering-feedback](./includes/internet-peering-feedback.md)]