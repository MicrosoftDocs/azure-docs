---
ms.service: azure-monitor
ms.topic: include
ms.date: 04/01/2023
ms.author: edbaynash
author: EdB-MSFT
---

## Case sensitivity
Azure managed Prometheus is a case insensitive system. If one time series differs from another only by a difference in the case of a string (metric name, label name, label value, etc), it's treated as the same time series. This behavior is different from native open source Prometheus, which is a case sensitive system.

In Azure managed Prometheus the following time series are considered the same: 

  `diskSize(cluster="eastus", node="node1", filesystem="usr_mnt")`  
  `diskSize(cluster="eastus", node="node1", filesystem="usr_MNT")` 

The above examples are a single time series in a time series database.
-	Any samples ingested against them are stored as if they're scraped/ingested against a single time series.
-	If the examples above are ingested with the same timestamp, one of them is randomly dropped.
-	The casing that's stored in the time series database and returned by a query is unpredictable. Different casing may be returned at different times for the same time series.
-	Any metric name or label name/value matcher present in the query is retrieved from time series database by making a case-insensitive comparison. If there's a case sensitive matcher in a query, it's automatically treated as a case-insensitive matcher when making string comparisons.

It is best practice to ensure that a time series is produced or scraped using a single consistent case.

In OSS Prometheus, the above time series are treated as two different time series. Any samples scraped/ingested against them are stored separately.