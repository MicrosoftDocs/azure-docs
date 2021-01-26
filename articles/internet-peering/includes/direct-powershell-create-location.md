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

The PowerShell cmdlet **Get-AzPeeringLocation** returns a list of peering locations with the mandatory parameter `Kind`, which you'll use in later steps.

```powershell
Get-AzPeeringLocation -Kind Direct
```

Direct peering locations contain the following fields:
* PeeringLocation 
* Country
* PeeringDBFacilityId
* PeeringDBFacilityLink
* BandwidthOffers

Validate that you're present at the desired peering facility by referring to [PeeringDB](https://wwww.peeringdb.com).

This example shows how to use Seattle as the peering location to create a Direct peering.

```powershell
$peeringLocations = Get-AzPeeringLocation -Kind Direct
$peeringLocation = $peeringLocations | where {$_.PeeringLocation -contains "Seattle"}
$peeringLocation

PeeringLocation       : Seattle
Address               : 2001 Sixth Avenue
Country               : US
PeeringDBFacilityId   : 71
PeeringDBFacilityLink : https://www.peeringdb.com/fac/71
BandwidthOffers       : {10Gbps, 100Gbps}
```