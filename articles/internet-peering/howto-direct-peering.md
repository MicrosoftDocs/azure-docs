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

This article describes how to create a Microsoft Direct Peering by using PowerShell cmdlets and the Resource Manager deployment model. This article also shows you how to check the status of the resource, update it, or delete and deprovision it.

If you prefer, you can complete this guide using the [portal](howto-direct-peering-portal.md).

## Before you begin
* Review [Prerequisites](prerequisites.md) and [Direct Peering walkthrough](workflows-direct.md) before you begin configuration.
* In case you have Direct Peering with Microsoft already, which are not converted to Azure resources, refer to [Convert a legacy Direct Peering to Azure resource using PowerShell](howto-legacy-direct.md)

### Working with Azure PowerShell
[!INCLUDE [CloudShell](./includes/cloudshell-powershell-about.md)]

## Create and provision a Direct Peering

### Sign in to your Azure account and select your subscription
[!INCLUDE [Account](./includes/account.md)]

### <a name=direct-location></a>Get the list of supported peering locations for Direct Peering
[!INCLUDE [direct-location](./includes/direct-location.md)]

### <a name=create></a>Create a Direct Peering
[!INCLUDE [direct-peering](./includes/direct.md)]

### <a name=get></a>Verify Direct Peering
[!INCLUDE [peering-direct-get](./includes/direct-get.md)]

## <a name="modify"></a>Modify a Direct Peering
[!INCLUDE [peering-direct-modify](./includes/direct-modify.md)]

## <a name="delete"></a>Deprovision a Direct Peering
[!INCLUDE [peering-direct-delete](./includes/delete.md)]

## Next steps

* [Create or modify Exchange Peering using PowerShell](howto-exchange-peering.md).
* [Convert a legacy Exchange Peering to Azure resource using PowerShell](howto-legacy-exchange.md).

## Additional resources
You can get detailed descriptions of all the parameters by running the following command:

```powershell
Get-Help Get-AzPeering -detailed
```

For more information, visit [Internet Peering FAQs](faqs.md)
