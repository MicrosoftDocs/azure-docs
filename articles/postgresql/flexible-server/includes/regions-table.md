---
author: akashraokm
ms.author: akashrao
ms.reviewer: maghan
ms.date: 06/28/2024
ms.service: azure-database-postgresql
ms.subservice: flexible-server
ms.topic: include
---
| Region | Intel V3/V4/V5/AMD Compute | Zone-Redundant HA | Same-Zone HA | Geo-Redundant backup | 
| ------ | -------------------------- | ----------------- | ------------ | -------------------- | 
| Australia Central | :heavy_check_mark: (v3/v4 only) | :x: | :heavy_check_mark: | :heavy_check_mark: | 
| Australia Central 2 * | :heavy_check_mark: (v3/v4 only) | :x: | :heavy_check_mark: | :x: | 
| Australia East | :heavy_check_mark: (all SKUs) | :heavy_check_mark: $ | :heavy_check_mark: | :heavy_check_mark: | 
| Australia Southeast | :heavy_check_mark: (v3/v4/v5 only) | :x: | :heavy_check_mark: | :heavy_check_mark: | 
| Brazil South | :heavy_check_mark: (v3/v4 only) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | 
| Brazil Southeast * | :heavy_check_mark: (v3/v4 only) | :x: | :heavy_check_mark: | :x: | 
| Canada Central | :heavy_check_mark: (all SKUs) | :heavy_check_mark: $ | :heavy_check_mark: | :heavy_check_mark: | 
| Canada East | :heavy_check_mark: (all SKUs) | :x: | :heavy_check_mark: | :heavy_check_mark: | 
| Central US | :heavy_check_mark: (v3/v4 only) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | 
| China East 2 | :heavy_check_mark: (v3/v4 only) | :x: | :heavy_check_mark: | :x: | 
| China East 3 | :heavy_check_mark: (v3/v4 only) | :x: | :heavy_check_mark: | :heavy_check_mark: | 
| China North 2 | :heavy_check_mark: (v3/v4 only) | :x: | :heavy_check_mark: | :x: | 
| China North 3 | :heavy_check_mark: (v3/v4/v5 only) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | 
| East Asia | :heavy_check_mark: (v3/v4/v5 only) | :heavy_check_mark: $ ** | :heavy_check_mark: | :heavy_check_mark: | 
| East US | :heavy_check_mark: (all SKUs) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | 
| East US 2 | :heavy_check_mark: (v3/v4 only) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | 
| France Central | :heavy_check_mark: (v3/v4/v5 only) | :heavy_check_mark: $ | :heavy_check_mark: | :heavy_check_mark: | 
| France South | :heavy_check_mark: (v3/v4 only) | :x: | :heavy_check_mark: | :heavy_check_mark: | 
| Germany North * | :heavy_check_mark: (v3/v4 only) | :x: | :heavy_check_mark: | :heavy_check_mark: | 
| Germany West Central | :heavy_check_mark: (v3/v4/v5 only) | :heavy_check_mark: $ | :heavy_check_mark: | :heavy_check_mark: | 
| India Central | :heavy_check_mark: (all SKUs) | :heavy_check_mark: $ | :heavy_check_mark: | :heavy_check_mark: | 
| India South | :heavy_check_mark: (v3/v4/v5 only) | :heavy_check_mark: $ | :heavy_check_mark: | :heavy_check_mark: | 
| Israel Central | :heavy_check_mark: (v3/v4 only) | :heavy_check_mark: $ | :heavy_check_mark: | :x: | 
| Italy North | :heavy_check_mark: (v3/v4 only) | :heavy_check_mark: $ | :heavy_check_mark: | :x: | 
| Japan East | :heavy_check_mark: (v3/v4 only) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | 
| Japan West | :heavy_check_mark: (v3/v4 only) | :x: | :heavy_check_mark: | :heavy_check_mark: | 
| Jio India Central | :heavy_check_mark: (v3 only) | :x: | :heavy_check_mark: | :heavy_check_mark: | 
| Jio India West | :heavy_check_mark: (v3 only) | :x: | :heavy_check_mark: | :heavy_check_mark: | 
| Korea Central | :heavy_check_mark: (v3/v4/v5 only) | :heavy_check_mark: ** | :heavy_check_mark: | :heavy_check_mark: | 
| Korea South | :heavy_check_mark: (v3/v4/v5 only) | :x: | :heavy_check_mark: | :heavy_check_mark: | 
| North Central US | :heavy_check_mark: (all SKUs) | :x: | :heavy_check_mark: | :heavy_check_mark: | 
| North Europe | :heavy_check_mark: (v3/v4/v5 only) | :heavy_check_mark: $ | :heavy_check_mark: | :heavy_check_mark: | 
| Norway East * | :heavy_check_mark: (all SKUs) | :heavy_check_mark: $ | :heavy_check_mark: | :heavy_check_mark: | 
| Norway West | :heavy_check_mark: (v3/v4 only) | :x: | :heavy_check_mark: | :heavy_check_mark: | 
| Poland Central | :heavy_check_mark: (v3/v4 only) | :heavy_check_mark: $ | :heavy_check_mark: | :x: | 
| Qatar Central | :heavy_check_mark: (v3/v4 only) | :heavy_check_mark: | :heavy_check_mark: | :x: | 
| South Africa North | :heavy_check_mark: (v3/v4/v5 only) | :heavy_check_mark: $ | :heavy_check_mark: | :heavy_check_mark: | 
| South Africa West * | :heavy_check_mark: (v3/v4 only) | :x: | :heavy_check_mark: | :heavy_check_mark: | 
| South Central US | :heavy_check_mark: (v3/v4 only) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | 
| Southeast Asia | :heavy_check_mark: (all SKUs) | :heavy_check_mark: $ | :heavy_check_mark: | :heavy_check_mark: | 
| Sweden Central | :heavy_check_mark: (v3/v4/v5 only) | :heavy_check_mark: $ | :heavy_check_mark: | :heavy_check_mark: | 
| Switzerland North | :heavy_check_mark: (v3/v4/v5 only) | :heavy_check_mark: $ | :heavy_check_mark: | :heavy_check_mark: | 
| Switzerland West * | :heavy_check_mark: (v3/v4/v5 only) | :x: | :heavy_check_mark: | :heavy_check_mark: | 
| UAE Central * | :heavy_check_mark: (v3 only) | :x: | :heavy_check_mark: | :heavy_check_mark: | 
| UAE North | :heavy_check_mark: (v3/v4/v5 only) | :heavy_check_mark: $ | :heavy_check_mark: | :heavy_check_mark: | 
| UK South | :heavy_check_mark: (all SKUs) | :heavy_check_mark: $ | :heavy_check_mark: | :heavy_check_mark: | 
| UK West | :heavy_check_mark: (all SKUs) | :x: | :heavy_check_mark: | :heavy_check_mark: | 
| US Gov Arizona | :heavy_check_mark: (v3/v4 only) | :x: | :heavy_check_mark: | :x: | 
| US Gov Texas | :heavy_check_mark: (v3/v4 only) | :x: | :heavy_check_mark: | :x: | 
| US Gov Virginia | :heavy_check_mark: (v3/v4 only) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | 
| West Central US | :heavy_check_mark: (v3/v4/v5 only) | :x: | :heavy_check_mark: | :heavy_check_mark: | 
| West Europe | :heavy_check_mark: (v3/v4/v5 only) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | 
| West US | :heavy_check_mark: (all SKUs) | :x: | :heavy_check_mark: | :heavy_check_mark: | 
| West US 2 | :heavy_check_mark: (v3/v4 only) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | 
| West US 3 | :heavy_check_mark: (all SKUs) | :heavy_check_mark: $ ** | :heavy_check_mark: | :x: | 
