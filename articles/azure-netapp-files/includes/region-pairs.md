---
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: include
ms.date: 11/12/2025
ms.author: anfdocs
ms.custom: include file, references_regions

# azure-netapp-files/replication.md
# Customer intent: As a cloud architect, I want to understand Azure NetApp Files volume replication across different regional pairs, so that I can plan and implement resilient data storage solutions for multi-region applications.
---
Azure NetApp Files volume replication is supported between various [Azure regional pairs](../../reliability/cross-region-replication-azure.md#paired-regions) and nonstandard pairs. Azure NetApp Files volume replication is currently available between the following regions. You can replicate Azure NetApp Files volumes from Regional Pair A to Regional Pair B and from Regional Pair B to Regional Pair A.

### Azure regional pairs

| Geography | Regional Pair A | Regional Pair B  |
|:--- |:--- |:--- |
| Australia | Australia Central | Australia Central 2 |
| Australia | Australia East | Australia Southeast |
| Asia-Pacific | East Asia | Southeast Asia | 
| Brazil | Brazil South | Brazil Southeast |
| Brazil/North America | Brazil South | South Central US |
| Canada | Canada Central | Canada East |
| Europe | North Europe | West Europe |
| Germany | Germany West Central | Germany North |
| India | Central India |South India |
| Japan | Japan East | Japan West |
| Korea | Korea Central | Korea South |
| North America | Central US | West US 3 |
| North America | East US | West US |
| North America | East US 2 | Central US |
| North America | North Central US | South Central US|
| North America | West US 3 | East US |
| Norway | Norway East | Norway West |
| Switzerland | Switzerland North | Switzerland West |
| UK | UK South | UK West |
| United Arab Emirates | UAE North | UAE Central |
| US Government | US Gov Arizona | US Gov Texas |
| US Government | US Gov Virginia | US Gov Texas |

### Azure regional nonstandard pairs

| Geography | Regional Pair A | Regional Pair B  |
|:--- |:--- |:--- |
| Australia/Southeast Asia | Australia East | Southeast Asia |
| New Zealand/Australia | New Zealand North | Australia East |
| Israel/Sweden | Israel Central | Sweden Central | 
| Qatar/Europe | Qatar Central | West Europe |
| France/Europe | France Central | West Europe |
| France/Europe | France Central | North Europe |
| Germany/UK | Germany West Central | UK South |
| Germany/Europe | Germany West Central | West Europe | 
| Germany/France | Germany West Central | France Central |
| Italy/Sweden | Italy North | Sweden Central | 
| Sweden/Germany | Sweden Central | Germany West Central |
| Spain/Sweden | Spain Central | Sweden Central |
| North America | Central US | East US |
| North America | East US | East US 2 |
| North America | East US | North Central US |
| North America | East US 2| West US 2 |
| North America | East US 2 | West US 3 |
| North America | North Central US | East US 2|
| North America | South Central US | East US |
| North America | South Central US | East US 2 |
| North America | South Central US | Central US |
| North America | West US 2 | East US |
| North America | West US 2 | West US 3 |
| Sweden/Europe | Sweden Central | North Europe |
| Sweden/Europe | Sweden Central | West Europe |
| UK/Europe | UK South | North Europe |
| US Government | US Gov Arizona | US Gov Virginia |

> [!NOTE]
> There can be a discrepancy in the size and number of snapshots between the source and the destination. This discrepancy is expected. Snapshot policies and replication schedules influence the number of snapshots. Snapshot policies and replication schedules, combined with the amount of data that changes between snapshots, influence the size of snapshots. For more information, see [How Azure NetApp Files snapshots work](../snapshots-introduction.md).
