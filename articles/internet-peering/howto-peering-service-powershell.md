---
title: Enable Peering Service on a Direct peering using PowerShell
titleSuffix: Azure
description: Enable Peering Service on a Direct peering using PowerShell
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: article
ms.date: 11/27/2019
ms.author: prmitiki
---

# Enable Peering Service on a Direct peering using PowerShell

This article describes how to enable [Peering Service](overview-peering-service.md) on a Direct peering by using PowerShell cmdlets and the Resource Manager deployment model.

If you prefer, you can complete this guide using the [portal](howto-peering-service-portal.md).

## Before you begin
* Review [prerequisites](prerequisites.md) before you begin configuration.
* Choose a Direct peering in your subscription you want to enable Peering Service on. If you do not have one, either convert a legacy Direct peering or create a new Direct peering.
    * To convert a legacy Direct peering, follow the instructions in [Convert a legacy Direct peering to Azure resource using PowerShell](howto-legacy-direct-powershell.md).
    * To create a new Direct peering, follow the instructions in [Create or modify a Direct peering using PowerShell](howto-direct-powershell.md).

### Working with Azure PowerShell
[!INCLUDE [CloudShell](./includes/cloudshell-powershell-about.md)]

## Enable Peering Service on a Direct peering

### <a name= get></a>View Direct peering
[!INCLUDE [peering-direct-get](./includes/direct-powershell-get.md)]

### <a name= get></a>Enable the Direct peering for Peering Service

After getting Direct peering in the previous step, enable it for Peering Service.
[!INCLUDE [peering-direct-modify](./includes/peering-service-direct-powershell.md)]

## Modify a Direct peering connection

If you need to modify connection settings, refer to **Modify a Direct peering** section in [Create or modify a Direct peering using PowerShell](howto-direct-powershell.md)

## Next steps

* [Create or modify Exchange peering using PowerShell](howto-exchange-powershell.md)
* [Convert a legacy Exchange peering to Azure resource using PowerShell](howto-legacy-exchange-powershell.md)

## Additional resources
You can get detailed descriptions of all the parameters by running the following command:

```powershell
Get-Help Get-AzPeering -detailed
```

For frequently asked questions, see [Peering Service FAQ](service-faqs.md).