---
title: 'Cost estimate: Archive & retrieve data (Azure Blob Storage)' 
description: This article shows an example of what it costs to archive and then retrieve data in Azure Blob Storage.
services: storage
author: normesta

ms.service: azure-blob-storage
ms.date: 05/07/2025
ms.topic: concept-article
ms.author: normesta
---

# Cost estimate: Archive and retrieve data in Azure Blob Storage 

This scenario shows the cost to write data to the archive tier and then retrieve some portion of that data prior to the early deletion threshold.

This scenario is focused only on the cost to move data. The cost to store data is not included here for simplicity. You can read more about the cost to store data here. 

## Scenario

Move 10 TiB of data into the archive tier for long-term retention. After 3 months, retrieve 20% of the data for analysis.

## Cost meters

- Write operation (archive tier)
- Read operation (archive tier)
- Data retrieval fee
- Early deletion fee
- Write operation (hot tier)

## Cost estimate

Sample pricing disclaimer goes here.

| Cost meter  | Cost |
|----|----|
| Cost to write to archive tier | cost goes here |
| Cost to read data from the archive tier | cost goes here |
| Cost to retrieve data | cost goes here |
| Early deletion penalty | cost goes here |
| Cost to write to the hot tier | cost goes here |
| Total cost | cost goes here |

## Cost breakdown by meter

Here is a bit more detail about each estimate.

### Cost to write to the archive tier

| Price factor                                                    | Calculation      |
|-----------------------------------------------------------------|------------|
| Number of write operations to the archive tier (10 TiB / 8 MiB blocks)  |  1,310,720  |
| Cost to write 10 TB of data to the archive tier ($0.000011 * 1,310,720) | $14.42 |

### Cost to read data from the archive tier

Put something here

### Cost to retrieve

Put something here.

## Early deletion penalty

Put something here.

## Cost to write to the hot tier

Put something here.

## Other considerations

Put something here about modifying for Data Lake Storage Gen2 endpoints.

## See also

- [Estimate the cost of archiving data](archive-cost-estimation.md)
- [Plan and manage costs for Azure Blob Storage](../common/storage-plan-manage-costs.md)
