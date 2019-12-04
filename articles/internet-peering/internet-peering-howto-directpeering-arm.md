---
title: Create or modify a Direct Peering using PowerShell
description: Create or modify a Direct Peering using PowerShell
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: article
ms.date: 11/27/2019
ms.author: prmitiki
---

# Create or modify a Direct Peering using PowerShell

This article describes how to create a Microsoft Direct Peering by using PowerShell cmdlets and the Azure resource Manager deployment model. This article also shows you how to check the status of the resource, update it, or delete and deprovision it.

If you prefer, you can complete this guide using the [Azure portal](internet-peering-howto-directpeering-arm-portal.md).

## Before you begin
* Review [Prerequisites](internet-peering-prerequisites.md) and [Direct Peering walkthrough](internet-peering-workflows-direct.md) before you begin configuration.
* In case you have Direct Peering with Microsoft already, which are not converted to Azure resources, please refer to [Convert a legacy Direct Peering to Azure resource using PowerShell](internet-peering-howto-legacydirect-arm.md)

### Working with Azure PowerShell
[!INCLUDE [CloudShell](./includes/internet-peering-cloudshell-powershell-about.md)]

## Create and provision a Direct Peering

### 1. Sign in to your Azure account and select your subscription
[!INCLUDE [Account](./includes/internet-peering-account.md)]

### <a name=direct-location></a> 2. Get the list of supported peering locations for Direct Peering
[!INCLUDE [direct-location](./includes/internet-peering-direct-location.md)]

### <a name=create></a> 3. Create a Direct Peering
[!INCLUDE [direct-peering](./includes/internet-peering-direct.md)]

### <a name=get></a> 4. Verify Direct Peering
[!INCLUDE [peering-direct-get](./includes/internet-peering-direct-get.md)]

## <a name="modify"></a>Modify a Direct Peering
[!INCLUDE [peering-direct-modify](./includes/internet-peering-direct-modify.md)]

## <a name="delete"></a> Deprovision a Direct Peering
[!INCLUDE [peering-direct-delete](./includes/internet-peering-direct-delete.md)]

## Next steps

* [Create or modify Exchange Peering using PowerShell](internet-peering-howto-exchangepeering-arm.md).
* [Convert a legacy Exchange Peering to Azure resource using PowerShell](internet-peering-howto-legacyexchange-arm.md).

## Additional Resources
You can get detailed descriptions of all the parameters by running the following command:

```powershell
Get-Help Get-AzPeering -detailed
```

For more information, please visit [Peering FAQs](internet-peering-faqs.md)

[!INCLUDE [peering-feedback](./includes/internet-peering-feedback.md)]

