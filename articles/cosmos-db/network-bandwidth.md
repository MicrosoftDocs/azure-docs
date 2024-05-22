---
title: Network bandwidth
titleSuffix: Azure Cosmos DB
description: Review how Azure Cosmos DB ingress and egress operations influence Azure network bandwidth consumption.
author: seesharprun
ms.author: sidandrews
ms.reviewer: garyhope
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 01/19/2024
---

# Azure Cosmos DB network bandwidth

Azure Cosmos DB is a globally distributed database system that allows you to read and write data from the local replicas of your database. Azure Cosmos DB transparently replicates the data to all the regions associated with your Azure Cosmos DB account.

Moving your database requests and responses between the Azure Cosmos DB account and the application that connects it requires Azure network bandwidth. Azure Cosmos DB also uses Azure network bandwidth to replicate data between Azure Cosmos DB regions when you select multiple regions for your Azure Cosmos DB account.  

Azure Cosmos DB bills for data that leaves the Azure cloud to any destination on the internet or that transits the Azure wide-area network (WAN) between Azure regions.  

| Data transfer in (ingress) | All GB / month |
| --- | --- |
| Data transfer into any region  | Not billed |
| Data transfer within any region | Not billed |
| Data transfer within an availability zone or between availability zones within any region  | Not billed |

| Data transfer out (egress)  | First 5 GB / month  | > 5 GB / month  |
| --- | --- | --- |
| Data transfer from any region in Europe or North America to any other regions or any destination on the internet | Not billed | Billed  |
| Data transfer from any region in Asia or Oceania or Middle East and Africa to any other region or any destination on the internet (excluding China) | Not billed | Billed  |
| Data transfer from any region in South America to any other region within the same continent or across continents or to any destination on the internet | Not billed | Billed  |
| Data transfer from any region in China to any other region within the same continent or across continents or to any destination on the internet | Not billed | Billed  |

## Billing meter details

The following table lists recently introduced billing meter details for Azure Cosmos DB bandwidth, along with the previous meter identifiers from which Azure Cosmos DB bandwidth moved.

| New meter name  | New meter type  | New meter ID | Previous meter ID |
| --- | --- | --- | --- |
| Inter Region Data Transfer In | Data transfer in (GB) | 415e7499-ea3b-5b45-8a9c-80a141aa262 | d8831a85-697a-4d43-acec-8e1599f58b5d  |
| Inter Region Data Transfer In | Data transfer in (GB) | ffa692fd-9d68-5f7c-a4b3-2644fe8ddb4 | 3a9d164b-d3c1-4350-9945-fa8056700299  |
| Inter Region Data Transfer In | Data transfer in (GB) | adae3632-6f0c-5bc0-b864-b6a7b437438 | 32c3ebec-1646-49e3-8127-2cafbd3a04d8  |
| Inter Region Data Transfer In | Data transfer in (GB) | b25ed7ec-9731-59f1-a0fb-d3327646847 | 42bb05e1-6f42-4de1-a6ba-7ffb976cb56  |
| Inter Region Data Transfer In | Data transfer in (GB) | 8f44fdc5-8992-5838-b309-8a101b97576 | e315c24e-2f54-4668-95ae-5aef18f93125  |
| Inter Region Data Transfer Out | Data transfer out (GB) | 475ec5dc-3ce0-526d-a38f-0868db1a8fb | 3730eb6d-75a1-4e4b-82a2-383264ebffd8  |
| Inter Region Data Transfer Out | Data transfer out (GB) | 08339433-af53-57f7-87ee-22a39c0f35c | 6c5c3140-e894-4ecf-aacc-60137b0bc93b  |
| Inter Region Data Transfer Out | Data transfer out (GB) | dffc0580-fe39-515f-86af-7a5cf75b74d | 9995d93a-7d35-4d3f-9c69-7a7fea447ef4  |
| Inter Region Data Transfer Out | Data transfer out (GB) | 722e5945-90e6-59b3-8ed2-412d73c3984 | fe167397-a38d-43c3-9bb3-8e2907e56a41  |
| Inter Region Data Transfer Out | Data transfer out (GB) | dc9930dd-f096-5af1-8467-ba15cf7232d | c089a13a-9dd0-44b5-aa9e-44a77bbd6788  |

## Frequently asked questions

Here's a list of commonly asked questions for this service:

- **Will the change to new meters cost me more for Azure Cosmos DB bandwidth?**

  No. Although the new meters are no longer tiered, the new meter billing rate is equal to or lower than the least expensive tier of the previous meters. Most Azure Cosmos DB accounts see a reduction in Azure Cosmos DB bandwidth costs.  

- **Do I get any network bandwidth every month at no cost?**

  Yes. Azure Cosmos DB includes 5 GB of network bandwidth per month per subscription.  

- **Will the previous meters still be on my bill after Azure Cosmos DB moves to the new meters?**

  It depends on your situation. You might continue to see previous meters on your Azure bill as the other Azure services continue to use them. Azure Cosmos DB bandwidth billing might be disabled for a short period during the transition. You aren't double charged during the transition.

- **Will a region failover affect my egress data?**

  It might affect your egress data. When your Azure Cosmos DB account is failed over to a new region, all traffic is automatically redirected to this new region. If this region is now different from where your Azure Cosmos DB client is located, it results in data egress between the regions.  

## Next step

> [!div class="nextstepaction"]
> [Send email if you have additional questions or feedback on Azure Cosmos DB networking](mailto:CosmosDBNetworking@Microsoft.com)  
