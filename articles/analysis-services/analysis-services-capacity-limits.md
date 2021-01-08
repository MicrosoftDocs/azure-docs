---
title: Azure Analysis Services resource and object limits | Microsoft Docs
description: This article describes resource and object limits for an Azure Analysis Services server.
author: minewiskan
ms.service: azure-analysis-services
ms.topic: conceptual
ms.date: 05/19/2020
ms.author: owend
ms.reviewer: minewiskan

---
# Analysis Services resource and object limits

This article describes resource and model object limits.

## Tier limits

For QPU and Memory limits for developer, basic, and standard tiers, see the [Azure Analysis Services pricing page](https://azure.microsoft.com/pricing/details/analysis-services/).

## Object limits

These limits are theoretical. Performance will be diminished at lower numbers.

|Object|Maximum sizes/numbers|  
|------------|----------------------------|  
|Databases in an instance|16,000|  
|Combined number of tables and columns in a database|16,000|  
|Rows in a table|Unlimited<br /><br /> **Warning:** With the restriction that no single column in the table can have more than 1,999,999,997 distinct values.|  
|Hierarchies in a table|15,999|  
|Levels in a hierarchy|15,999|  
|Relationships|8,000|  
|Key Columns in all table|15,999|  
|Measures in tables|2^31-1 = 2,147,483,647|  
|Cells returned by a query|2^31-1 = 2,147,483,647|  
|Record size of the source query|64 K|  
|Length of object names|512 characters|  


