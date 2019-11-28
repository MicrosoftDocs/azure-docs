---
title: Convert a legacy Direct Peering to Azure Resource using PowerShell
description: Convert a legacy Direct Peering to Azure Resource using PowerShell
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: article
ms.date: 11/27/2019
ms.author: prmitiki
---

# Convert a legacy Direct Peering to Azure Resource using PowerShell
> [!div class="op_single_selector"]
> * [Portal](peering-howto-legacydirect-arm-portal.md)
> * [PowerShell](peering-howto-legacydirect-arm.md)
>

This article describes how to convert an existing legacy Direct Peering to Azure resource using PowerShell cmdlets.


## Before you begin
* Review [Prerequisites](peering-prerequisites.md) and [Direct Peering Walkthrough](peering-workflows-direct.md) before you begin configuration.

### Working with Azure PowerShell
[!INCLUDE [CloudShell](peering-cloudshell-powershell-about.md)]

## Convert legacy Direct Peering to Azure Resource

### 1. Sign in to your Azure account and select your subscription
[!INCLUDE [Account](peering-account.md)]

### <a name= get></a>2. Get legacy Direct Peering for Conversion
Below is an example to get legacy Direct Peering at Seattle peering location

```powershell
$legacyPeering = Get-AzLegacyPeering `
    -Kind Direct -PeeringLocation "Seattle"
$legacyPeering
```

Below is an example response:
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

### 3. Convert legacy Direct Peering

&nbsp;
> [!IMPORTANT]
> Please Note that when converting legacy peering to azure resource, modifications are not supported. 
&nbsp;

Use below command to convert legacy Direct Peering to Azure resource:

```powershell
$legacyPeering[0] | New-AzPeering `
    -Name "SeattleDirectPeering" `
    -ResourceGroupName "PeeringResourceGroup" `

```

Below is an example response:

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

## Additional Resources
You can get detailed descriptions of all the parameters by running the following command:

```powershell
Get-Help Get-AzPeering -detailed
```

For more information, please visit [Peering FAQs](peering-faqs.md)

[!INCLUDE [peering-feedback](peering-feedback.md)]

## Next steps

* [Create or modify a Direct Peering using PowerShell](peering-howto-directpeering-arm.md).

