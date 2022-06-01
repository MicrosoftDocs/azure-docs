---
title: Map business problem to dataset
titleSuffix: Azure Cognitive Services
description: Learn how to do data preparation and map business problem to dataset
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: applied-ai-services
ms.subservice: metrics-advisor
ms.topic: how-to
ms.date: 06/01/2022
ms.author: qiyli
---

# How to: Do data preparation and map business problem to dataset

The first key to successfully solve your business problem is to format your dataset in a way that Azure Metrics Advisor (AMA) can digest. To help you get familiar with the data schema required for AMA to deliver multi-dimensional anomaly detection (AD) and root-cause analysis (RCA) for your business and service, let’\'s take an example.  

Contoso is an e-commerce company that sells a wide range of products on its e-commerce websites. It is important to continuously monitor the business and service health metrics to identify issues and take actions as early as possible. Specifically, Contoso monitors: 

- Metrics **'Revenue'** and **'Cost'**, which reflect the high-level business status. 

- Metric **'DAU (Daily Active Users)'**, which indicates customer engagement status 

- Metrics **'PLT (Page load time)'** and **'CHR (Cache Hit Rate)'**, which track their website service running status.  

Moreover, as a global company that delivers various products, Contoso needs to segment all their metrics by **'Product category'** and/or **'Region'** for more meaningful insights. Thus, Contoso's internal data science team mapped their metrics into a multi-dimensional dataset that can be split into thousands of time series, each representing a unique combination of 'Product category' and 'Region'.

| Timestamp | Product category | Region | Revenue | Cost |
| ----------| ------------| --------------| ------| ------|
| 2021-10-1 00:00 | Shoes Handbags & Sunglasses | New York | 68924662.8 | 1274467 |
| 2021-10-1 00:00 | Grocery & Gourmet Food | Beijing | 46445419.6 | 1030150.4 |
| … | | | | |
| 2021-10-2 00:00 | Electronics (Accessories) | Seoul | 8816131 |332083.2 |
| 2021-10-2 00:00 | Shoes Handbags & Sunglasses | Beijing | 10206942 |558040 |
| … | | | | |
| 2021-10-3 00:00 | Grocery & Gourmet Food | Mexico | 5810611 | 134650 |
| 2021-10-3 00:00 | Electronics (Accessories) | Istanbul | 7420199.8 |298517.6 |
| … | | | | |


Metrics **DAU**, **PLT** and **CHR** are more about website service health, so they are segmented by **'Region'** to indicate which regions the web service might have issues. With all the metrics data ready, the next step is to get them onboarded to Azure Metrics Advisor.  

Kindly note that it is not necessary to pre-process your data exactly like the schema above. If the data source is a **query-able database**, you can use a query to do the aggregation and make sure the **output** meets the above schema requirements.  