---
title: Convert a legacy Exchange peering to Azure resource using PowerShell
titleSuffix: Azure
description: Convert a legacy Exchange peering to Azure resource using PowerShell
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: article
ms.date: 11/27/2019
ms.author: prmitiki
---

# Convert a legacy Exchange peering to Azure resource using PowerShell

This article describes how to convert an existing legacy Exchange peering to Azure resource using PowerShell cmdlets.

If you prefer, you can complete this guide using the [portal](howto-legacy-exchange-portal.md).

## Before you begin
* Review [Prerequisites](prerequisites.md) and [Exchange peering walkthrough](walkthrough-exchange-all.md) before you begin configuration.

### Working with Azure PowerShell
[!INCLUDE [CloudShell](./includes/cloudshell-powershell-about.md)]

## Convert a legacy Exchange peering to Azure resource

### Sign in to your Azure account and select your subscription
[!INCLUDE [Account](./includes/account-powershell.md)]

### <a name= get></a>Get legacy Exchange peering for Conversion
Below is the example to get legacy Exchange peering at Seattle peering location:

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
Below command can be used to convert legacy Exchange peering to Azure resource:

```powershell
$legacyPeering[0] | New-AzPeering `
    -Name "SeattleExchangePeering" `
    -ResourceGroupName "PeeringResourceGroup"

```

&nbsp;
> [!IMPORTANT] 
> Note that when converting legacy peering to azure resource, modifications are not supported 
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
## Additional resources
You can get detailed descriptions of all the parameters by running the following command:

```powershell
Get-Help Get-AzPeering -detailed
```
For more information, visit [Internet peering FAQs](faqs.md)

## Next steps

* [Create or modify an Exchange peering using PowerShell](howto-exchange-powershell.md)
