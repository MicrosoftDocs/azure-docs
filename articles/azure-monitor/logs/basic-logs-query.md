---
title: Query data from Basic Logs in Azure Monitor (Preview)
description: Create a log query using tables configured for Basic logs in Azure Monitor.
author: bwren
ms.author: bwren
ms.subservice: logs
ms.topic: conceptual
ms.date: 01/13/2022

---

# Query Basic Logs in Azure Monitor (Preview)
Queries can be executed from the Log Analytics experience in the Azure portal, or from a dedicated REST API. 

## Run a query from the Portal
Open Log Analytics in the Azure portal and open the **Tables** tab. (see [Get started with Azure Monitor Log Analytics](./log-analytics-tutorial.md) for detailed instructions).
On selecting a table, Log Analytics identifies which type of table it is and the UI is aligned to support the query specifications per the table configuration. On a Basic Logs table, the query authoring experience is aligned to the query limitations as explained above. 
![Screenshot of Query on Basic Logs limitations.](./media/basic-logs-query/query-validator.png)

## Run a query from REST API
Queries on Basic Logs tables can be executed from the Log Analytics REST API: '/search'. 
'/search' API is based on '/query' API with the following changes:
- Query language is according to the limitation explained above
- Time span must be specified in the header


#### Sample Request
```http
https://api.loganalytics.io/v1/workspaces/testWS/search?timespan=P1D
```

Request body
```http
{
    "query": "ContainerLog | where LogEntry has \"some value\"\n",
}
```

## Next steps

- [Read more about Basic logs](basic-logs-overview.md)
- [Configure a table for Basic Logs.](basic-logs-query.md)