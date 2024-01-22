---
title: Convert a legacy Direct peering to an Azure resource - PowerShell
description: Convert a legacy Direct peering to an Azure resource using PowerShell.
services: internet-peering
author: halkazwini
ms.service: internet-peering
ms.topic: how-to
ms.date: 01/23/2023
ms.author: halkazwini 
ms.custom: template-how-to, devx-track-azurepowershell, engagement-fy23
---

# Convert a legacy Direct peering to an Azure resource using PowerShell

> [!div class="op_single_selector"]
> - [Azure portal](howto-legacy-direct-portal.md)
> - [PowerShell](howto-legacy-direct-powershell.md)

This article describes how to convert an existing legacy Direct peering to an Azure resource by using PowerShell cmdlets.

If you prefer, you can complete this guide by using the [Azure portal](howto-legacy-direct-portal.md).

## Before you begin
* Review the [prerequisites](prerequisites.md) and the [Direct peering walkthrough](walkthrough-direct-all.md) before you begin configuration.

### Work with Azure PowerShell
[!INCLUDE [CloudShell](./includes/cloudshell-powershell-about.md)]

## Convert a legacy Direct peering to an Azure resource

### Sign in to your Azure account and select your subscription
[!INCLUDE [Account](./includes/account-powershell.md)]

### <a name= get></a>Get a legacy Direct peering for conversion
This example shows how to get a legacy Direct peering at the Seattle peering location.

```powershell
$legacyPeering = Get-AzLegacyPeering `
    -Kind Direct -PeeringLocation "Seattle"
$legacyPeering
```

Here's an example response:
```powershell
Name                       :
Sku                        : Basic_Direct_Free
Kind                       : Direct
PeeringLocation            : Seattle
UseForPeeringService       : False
PeerAsn.Id                 :
Connection                 : ------------------------
PeeringDBFacilityId        : 71
SessionPrefixIPv4          : 4.71.156.72/30
PeerSessionIPv4Address     : 4.71.156.73
MicrosoftIPv4Address       : 4.71.156.74
SessionStateV4             : Established
MaxPrefixesAdvertisedV4    : 20000
SessionPrefixIPv6          : 2001:1900:2100::1e10/126
MaxPrefixesAdvertisedV6    : 2000
ConnectionState            : Active
BandwidthInMbps            : 0
ProvisionedBandwidthInMbps : 20000
Connection                 : ------------------------
PeeringDBFacilityId        : 71
SessionPrefixIPv4          : 4.68.70.140/30
PeerSessionIPv4Address     : 4.68.70.141
MicrosoftIPv4Address       : 4.68.70.142
SessionStateV4             : Established
MaxPrefixesAdvertisedV4    : 20000
SessionPrefixIPv6          : 2001:1900:4:3::cc/126
PeerSessionIPv6Address     : 2001:1900:4:3::cd
MicrosoftIPv6Address       : 2001:1900:4:3::ce
SessionStateV6             : Established
MaxPrefixesAdvertisedV6    : 2000
ConnectionState            : Active
BandwidthInMbps            : 0
ProvisionedBandwidthInMbps : 20000
ProvisioningState          : Succeeded
```

### Convert a legacy Direct peering

&nbsp;
> [!IMPORTANT]
> When you convert a legacy peering to an Azure resource, modifications aren't supported. 
&nbsp;

Use this command to convert a legacy Direct peering to an Azure resource:

```powershell
$legacyPeering[0] | New-AzPeering `
    -Name "SeattleDirectPeering" `
    -ResourceGroupName "PeeringResourceGroup" `

```

Here's an example response:

```powershell
Name                 : SeattleDirectPeering
Sku.Name             : Basic_Direct_Free
Kind                 : Direct
Connections          : {11, 11}
PeerAsn.Id           : /subscriptions/{subscriptionId}/providers/Microsoft.Peering/peerAsns/{asnNumber}
UseForPeeringService : False
PeeringLocation      : Seattle
ProvisioningState    : Succeeded
Location             : centralus
Id                   : /subscriptions/{subscriptionId}/resourceGroups/PeeringResourceGroup/providers/Microsoft.Peering/peerings/SeattleDirectPeering
Type                 : Microsoft.Peering/peerings
Tags                 : {}
```

## Additional resources
You can get detailed descriptions of all the parameters by running this command:

```powershell
Get-Help Get-AzPeering -detailed
```

## Next steps

- [Create or modify a Direct peering by using PowerShell](howto-direct-powershell.md).
- [Internet peering frequently asked questions (FAQ)](faqs.md).