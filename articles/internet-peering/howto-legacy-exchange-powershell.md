---
title: Convert a legacy Exchange peering to an Azure resource - PowerShell
description: Convert a legacy Exchange peering to an Azure resource using PowerShell.
services: internet-peering
author: halkazwini
ms.service: internet-peering
ms.topic: how-to
ms.date: 01/23/2023
ms.author: halkazwini 
ms.custom: template-how-to, devx-track-azurepowershell, engagement-fy23
---

# Convert a legacy Exchange peering to an Azure resource using PowerShell

> [!div class="op_single_selector"]
> - [Azure portal](howto-legacy-exchange-portal.md)
> - [PowerShell](howto-legacy-exchange-powershell.md)

This article describes how to convert an existing legacy Exchange peering to an Azure resource by using PowerShell cmdlets.

If you prefer, you can complete this guide by using the [Azure portal](howto-legacy-exchange-portal.md).

## Before you begin
* Review the [prerequisites](prerequisites.md) and the [Exchange peering walkthrough](walkthrough-exchange-all.md) before you begin configuration.

### Work with Azure PowerShell
[!INCLUDE [CloudShell](./includes/cloudshell-powershell-about.md)]

## Convert a legacy Exchange peering to an Azure resource

### Sign in to your Azure account and select your subscription
[!INCLUDE [Account](./includes/account-powershell.md)]

### <a name= get></a>Get legacy Exchange peering for conversion
This example shows how to get legacy Exchange peering at the Seattle peering location:

```powershell
$legacyPeering = Get-AzLegacyPeering -Kind Exchange -PeeringLocation "Seattle"
$legacyPeering
```

The response looks similar to the following example:
```powershell
    Kind                     : Exchange
    PeeringLocation          : Seattle
    PeerAsn                  : 65000
    Connection               : ------------------------
    PeerSessionIPv4Address   : 10.21.31.100
    MicrosoftIPv4Address     : 10.21.31.50
    SessionStateV4           : Established
    MaxPrefixesAdvertisedV4  : 20000
    PeerSessionIPv6Address   : fe01::3e:100
    MicrosoftIPv6Address     : fe01::3e:50
    SessionStateV6           : Established
    MaxPrefixesAdvertisedV6  : 2000
    ConnectionState          : Active
```

### Convert legacy peering
This command can be used to convert legacy Exchange peering to an Azure resource:

```powershell
$legacyPeering[0] | New-AzPeering `
    -Name "SeattleExchangePeering" `
    -ResourceGroupName "PeeringResourceGroup"

```

&nbsp;
> [!IMPORTANT] 
> When you convert legacy peering to an Azure resource, modifications aren't supported.
&nbsp;

This example response shows when the end-to-end provisioning was successfully completed:

```powershell
    Name                     : SeattleExchangePeering
    Kind                     : Exchange
    Sku                      : Basic_Exchange_Free
    PeeringLocation          : Seattle
    PeerAsn                  : 65000
    Connection               : ------------------------
    PeerSessionIPv4Address   : 10.21.31.100
    MicrosoftIPv4Address     : 10.21.31.50
    SessionStateV4           : Established
    MaxPrefixesAdvertisedV4  : 20000
    PeerSessionIPv6Address   : fe01::3e:100
    MicrosoftIPv6Address     : fe01::3e:50
    SessionStateV6           : Established
    MaxPrefixesAdvertisedV6  : 2000
    ConnectionState          : Active
```
## Additional resources
You can get detailed descriptions of all the parameters by running the following command:

```powershell
Get-Help Get-AzPeering -detailed
```

## Next steps

- [Create or modify an Exchange peering by using PowerShell](howto-exchange-powershell.md).
- [Internet peering frequently asked questions (FAQ)](faqs.md).