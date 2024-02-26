---
title: Azure Maps Creator service geographic scope
description: Learn about Azure Maps Creator service's geographic mappings in Azure Maps
author: brendansco
ms.author: Brendanc
ms.date: 05/18/2021
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
ms.custom: mvc, references_regions
---

# Creator service geographic scope

Azure Maps Creator is a geographically scoped service. Creator offers a resource provider API that, given an Azure region, creates an instance of Creator data deployed at the geographical level. The mapping from an Azure region to geography happens behind the scenes as described in the following table. For more information on Azure regions and geographies, see [Azure geographies].

## Data locations

For disaster recovery and high availability, Microsoft may replicate customer data to other regions only within the same geographic area. For example, data in West Europe may be replicated to North Europe, but not to the United States.  Regardless, no matter which geography the customer selected, Microsoft doesn’t control or limit the locations from which the customers, or their end users, may access customer data via Azure Maps API.  

## Geographic and regional mapping

The following table describes the mapping between geography and supported Azure regions, and the respective geographic API endpoint. For example, if a Creator account is provisioned in the West US 2 region that falls within the United States geography, all API calls to the Conversion service must be made to `us.atlas.microsoft.com/conversion/convert`.

| Azure Geographic areas (geos) | Azure datacenters (regions) | API geographic endpoint |
|------------------------|----------------------|-------------|
| Europe| West Europe, North Europe | eu.atlas.microsoft.com |
|United States | West US 2, East US 2 | us.atlas.microsoft.com |

## Next steps

> [!div class="nextstepaction"]
> [What is Azure Maps Creator?]

[Azure geographies]: https://azure.microsoft.com/global-infrastructure/geographies
[What is Azure Maps Creator?]: about-creator.md
