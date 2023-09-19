---
title: Data schema requirements
titleSuffix: Azure AI services
author: mrbullwinkle
manager: nitinme
ms.service: applied-ai-services
ms.subservice: metrics-advisor
ms.topic: include
ms.date: 09/10/2020
ms.author: mbullwin
---

Azure AI Metrics Advisor is a service for time series anomaly detection, diagnostics, and analysis. As an AI-powered service, it uses your data to train the model used. The service accepts tables of aggregated data with the following columns:

* **Measure** (required): A measure is a fundamental or unit-specific term and a quantifiable value of the metric. It means one or more columns containing numeric values.
* **Timestamp** (optional): Zero or one column, with type of `DateTime` or `String`. When this column isn't set, the timestamp is set as the start time of each ingestion period. Format the timestamp as follows: `yyyy-MM-ddTHH:mm:ssZ`. 
* **Dimension** (optional): A dimension is one or more categorical values. The combination of those values identifies a particular univariate time series (for example, country/region, language, and tenant). The dimension columns can be of any data type. Be cautious when working with large volumes of columns and values, to prevent excessive numbers of dimensions from being processed.

If you're using data sources such as Azure Data Lake Storage or Azure Blob Storage, you can aggregate your data to align with your expected metrics schema. This is because these data sources use a file as metrics input.

If you're using data sources such as Azure SQL or Azure Data Explorer, you can use aggregation functions to aggregate data into your expected schema. This is because these data sources support running a query to get metrics data from sources.

