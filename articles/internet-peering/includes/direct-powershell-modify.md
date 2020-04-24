---
title: include file
titleSuffix: Azure
description: include file
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: include
ms.date: 11/27/2019
ms.author: prmitiki
---

This section describes how to perform the following modification operations for Direct peering:

* Add Direct peering connections.
* Remove Direct peering connections.
* Upgrade or downgrade bandwidth on Active connections.
* Add IPv4 or IPv6 sessions on Active connections.
* Remove IPv4 or IPv6 sessions on Active connections.

### Add Direct peering connections

This example describes how to add connections to existing Direct peering.

```powershell

$directPeering = Get-AzPeering -Name "SeattleDirectPeering" -ResourceGroupName "PeeringResourceGroup"

$connection = New-AzPeeringDirectConnection `
    -PeeringDBFacilityId $peeringLocation.PeeringDBFacilityId `
    -SessionPrefixV4 "10.22.31.0/31" `
    -SessionPrefixV6 "fe02::3e:0/127" `
    -MaxPrefixesAdvertisedIPv4 1000 `
    -MaxPrefixesAdvertisedIPv6 100 `
    -BandwidthInMbps 10000

$directPeering.Connections.Add($connection)

$directPeering | Update-AzPeering
```

### Remove Direct peering connections

Removing a connection isn't currently supported on PowerShell. For more information, contact [Microsoft peering](mailto:peeringexperience@microsoft.com).

<!--
```powershell
$directPeering.Connections.Remove($directPeering.Connections[0])

$directPeering | Update-AzPeering
```
-->

### Upgrade or downgrade bandwidth on Active connections

This example describes how to add 10 Gbps to an existing Direct connection.

```powershell

$directPeering = Get-AzPeering -Name "SeattleDirectPeering" -ResourceGroupName "PeeringResourceGroup"
$directPeering.Connections[0].BandwidthInMbps  = 20000
$directPeering | Update-AzPeering

```

### Add IPv4 or IPv6 sessions on Active connections

This example describes how to add an IPv6 session on an existing Direct connection with only an IPv4 session. 

```powershell

$directPeering = Get-AzPeering -Name "SeattleDirectPeering" -ResourceGroupName "PeeringResourceGroup"
$directPeering.Connections[0].BGPSession.SessionPrefixv6 = "fe01::3e:0/127"
$directPeering | Update-AzPeering

```

### Remove IPv4 or IPv6 sessions on Active connections

Removing an IPv4 or IPv6 session from an existing connection isn't currently supported on PowerShell. For more information, contact [Microsoft peering](mailto:peeringexperience@microsoft.com).