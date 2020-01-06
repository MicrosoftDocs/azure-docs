---
title: Enable Peering Service on a Direct Peering using PowerShell
description: Enable Peering Service on a Direct Peering using PowerShell
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: article
ms.date: 11/27/2019
ms.author: prmitiki
---

# Enable Peering Service on a Direct Peering using PowerShell

This article describes how to enable Peering Service [Peering Service](overview-peering-service.md) on a Direct Peering by using PowerShell cmdlets and the Resource Manager deployment model.

If you prefer, you can complete this guide using the [portal](howto-peering-service-portal.md).

## Before you begin
* Review [prerequisites](prerequisites.md) before you begin configuration.
* Choose a Direct Peering in your subscription you want to enable Peering Service on. If you do not have one, either convert a legacy Direct Peering or create a new Direct Peering.
    * To convert a legacy Direct Peering, follow the instructions in [Convert a legacy Direct Peering to Azure resource using PowerShell](howto-legacy-direct-powershell.md).
    * To create a new Direct Peering, follow the instructions in [Create or modify a Direct Peering using PowerShell](howto-direct-powershell.md).

### Working with Azure PowerShell
[!INCLUDE [CloudShell](./includes/cloudshell-powershell-about.md)]

## Enable Peering Service on a Direct Peering

### <a name= get></a>View Direct Peering
[!INCLUDE [peering-direct-get](./includes/direct-powershell-get.md)]

### <a name= get></a>Enable the Direct Peering for Peering Service

After getting Direct Peering in the previous step, enable it for Peering Service.
[!INCLUDE [peering-direct-modify](./includes/peering-service-direct-powershell.md)]

## Modify a Direct Peering connection

If you need to modify connection settings, refer to **Modify a Direct Peering** section in [Create or modify a Direct Peering using PowerShell](howto-direct-powershell.md)

## Next steps

* [Create or modify Exchange Peering using PowerShell](howto-exchange-powershell.md)
* [Convert a legacy Exchange Peering to Azure resource using PowerShell](howto-legacy-exchange-powershell.md)

## Additional resources
You can get detailed descriptions of all the parameters by running the following command:

```powershell
Get-Help Get-AzPeering -detailed
```

For frequently asked questions, see [Peering Service FAQ](service-faqs.md).