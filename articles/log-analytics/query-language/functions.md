---
title: Functions Azure Log Analytics | Microsoft Docs
description: This article provides a tutorial for using the Analytics portal to write queries in Log Analytics.
services: log-analytics
documentationcenter: ''
author: bwren
manager: carmonm
editor: ''
ms.assetid: 
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 08/16/2018
ms.author: bwren
ms.component: na
---


# Using functions in Azure Monitor Log Analytics

> [!NOTE]
> You should complete [Get started with the Analytics portal](get-started-analytics-portal.md) and [Getting started with queries](get-started-queries.md) before completing this lesson.

[!INCLUDE [log-analytics-demo-environment](../../../includes/log-analytics-demo-environment.md)]

## Functions
You can save a query with a function alias so it can be referenced by other queries. For example, the following standard query returns all missing security updates reported in the last day:

```Kusto
Update
| where TimeGenerated > ago(1d) 
| where Classification == "Security Updates" 
| where UpdateState == "Needed"
```

You can save this query as a function and give it an alias such as _security_updates_last_day_. Then you can use it in another query to search for SQL-related needed security updates:

```Kusto
security_updates_last_day | where Title contains "SQL"
```

To save a query as a function, select the **Save** button in the portal and change **Save as** to _Function_. The function alias can contain letters, digits, or underscores but must start with a letter or an underscore.

> [!NOTE]
> Saving a function is possible in Log Analytics queries, but currently not for Application Insights queries.


## Next steps
See other lessons for using the Log Analytics query language:

- [String operations](string-operations.md)
- [Date and time operations](datetime-operations.md)
- [Aggregation functions](aggregations.md)
- [Advanced aggregations](advanced-aggregations.md)
- [JSON and data structures](json-data-structures.md)
- [Joins](joins.md)
- [Charts](charts.md)