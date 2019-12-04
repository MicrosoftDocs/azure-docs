---
title: Convert a legacy Exchange Peering to Azure resource using PowerShell
description: Convert a legacy Exchange Peering to Azure resource using PowerShell
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: article
ms.date: 11/27/2019
ms.author: prmitiki
---

# Convert a legacy Exchange Peering to Azure resource using PowerShell
> [!div class="op_single_selector"]
> * [Portal](internet-peering-howto-legacyexchange-arm-portal.md)
> * [PowerShell](internet-peering-howto-legacyexchange-arm.md)
>

This article describes how to convert an existing legacy Exchange Peering to Azure resource using PowerShell cmdlets.

## Before you begin
* Review [Prerequisites](internet-peering-prerequisites.md) and [Exchange Peering Walkthrough](internet-peering-workflows-exchange.md) before you begin configuration.

### Working with Azure PowerShell
[!INCLUDE [CloudShell](./includes/internet-peering-cloudshell-powershell-about.md)]

## Convert a legacy Exchange Peering to Azure resource

### 1. Sign in to your Azure account and select your subscription
[!INCLUDE [Account](./includes/internet-peering-account.md)]

### <a name= get></a>3. Get legacy Exchange Peering for Conversion
Below is the example to get legacy Exchange Peering at Seattle peering location:

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

### 3. Convert legacy Peering
Below command can be used to convert legacy Exchange Peering to Azure resource:

```powershell
$legacyPeering[0] | New-AzPeering `
    -Name "SeattleExchangePeering" `
    -ResourceGroupName "PeeringResourceGroup"

```

&nbsp;
> [!IMPORTANT] 
> Please Note that when converting legacy peering to azure resource, modifications are not supported 
&nbsp;

Below is an example response when the end-to-end provisioning was successfully completed:

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
## Additional Resources
You can get detailed descriptions of all the parameters by running the following command:

```powershell
Get-Help Get-AzPeering -detailed
```
For more information, please visit [Peering FAQs](internet-peering-faqs.md)

[!INCLUDE [peering-feedback](./includes/internet-peering-feedback.md)]

## Next steps

* [Create or modify an Exchange Peering using PowerShell](internet-peering-howto-exchangepeering-arm.md)
