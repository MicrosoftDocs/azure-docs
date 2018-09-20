---
title: Azure Analysis Services resource and object limits | Microsoft Docs
description: Describes Azure Analysis Services resource and object limits.
author: minewiskan
manager: kfile
ms.service: azure-analysis-services
ms.topic: conceptual
ms.date: 09/12/2018
ms.author: owend
ms.reviewer: minewiskan

---
# Analysis Services resource and object limits

This article describes resource and model object limits.

## Tier limits

### Developer tier

This tier is recommended for evaluation, development, and test scenarios. A single plan includes the same functionality of the standard tier, but is limited in processing power, QPUs, and memory size. Query replica scale out *is not available* for this tier. This tier doesn't offer an SLA.

|Plan  |QPUs  |Memory (GB)  |
|---------|---------|---------|
|D1    |    20     |    3     |


### Basic tier

The tier is recommended for production solutions with smaller tabular models, limited user concurrency, and simple data refresh requirements. Query replica scale out *is not available* for this tier. Perspectives, multiple partitions, and DirectQuery tabular model features *are not supported* in this tier.  

|Plan  |QPUs  |Memory (GB)  |
|---------|---------|---------|
|B1    |    40     |    10     |
|B2    |    80     |    20     |

### Standard tier

This tier is for mission-critical production applications that require elastic user-concurrency, and have rapidly growing data models. It supports advanced data refresh for near real-time data model updates, and supports all tabular modeling features.

|Plan  |QPUs  |Memory (GB)  |
|---------|---------|---------|
|S1    |    40     |    10     |
|S2    |    100     |    25     |
|S3    |    200     |    50     |
|S4    |    400     |    100     |
|S8*    |    320     |    200     |
|S9*    |    640    |    400     |

\* Not available in all regions.  

## Object limits

These are theoretical limits. Performance will be diminished at lower numbers.

|Object|Maximum sizes/numbers|  
|------------|----------------------------|  
|Databases in an instance|16,000|  
|Combined number of tables and columns in a database|16,000|  
|Rows in a table|Unlimited<br /><br /> **Warning:** With the restriction that no single column in the table can have more than 1,999,999,997 distinct values.|  
|Hierarchies in a table|15,999|  
|Levels in a hierarchy|15,999|  
|Relationships|8,000|  
|Key Columns in all table|15,999|  
|Measures in a tables|2^31-1 = 2,147,483,647|  
|Cells returned by a query|2^31-1 = 2,147,483,647|  
|Record size of the source query|64K|  
|Length of object names|512 characters|  


