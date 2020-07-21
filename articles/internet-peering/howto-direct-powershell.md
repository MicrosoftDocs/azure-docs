---
title: Create or modify a Direct peering by using PowerShell
titleSuffix: Azure
description: Create or modify a Direct peering by using PowerShell
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: how-to
ms.date: 11/27/2019
ms.author: prmitiki
---

# Create or modify a Direct peering by using PowerShell

This article describes how to create a Microsoft Direct peering by using PowerShell cmdlets and the Azure Resource Manager deployment model. This article also shows you how to check the status of the resource, update it, or delete and deprovision it.

If you prefer, you can complete this guide by using the Azure [portal](howto-direct-portal.md).

## Before you begin
* Review the [prerequisites](prerequisites.md) and the [Direct peering walkthrough](walkthrough-direct-all.md) before you begin configuration.
* If you already have Direct peering connections with Microsoft that aren't converted to Azure resources, see [Convert a legacy Direct peering to an Azure resource by using PowerShell](howto-legacy-direct-powershell.md).

### Work with Azure PowerShell
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

* [Create or modify Exchange peering by using PowerShell](howto-exchange-powershell.md)
* [Convert a legacy Exchange peering to an Azure resource by using PowerShell](howto-legacy-exchange-powershell.md)

## Additional resources
You can get detailed descriptions of all the parameters by running the following command:

```powershell
Get-Help Get-AzPeering -detailed
```

For more information, see [Internet peering FAQs](faqs.md).
