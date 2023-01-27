---
ms.topic: include
ms.date: 11/02/2021
author: shsagir
ms.author: shsagir
ms.service: synapse-analytics
ms.subservice: data-explorer
---
- An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).

- Create a Data Explorer pool using [Synapse Studio](../data-explorer-create-pool-studio.md) or [the Azure portal](../data-explorer-create-pool-portal.md)
- Create a Data Explorer database.
    1. In Synapse Studio, on the left-side pane, select **Data**.
    1. Select **&plus;** (Add new resource) > **Data Explorer pool**, and use the following information:

        | Setting | Suggested value | Description |
        |--|--|--|
        | Pool name | *contosodataexplorer* | The name of the Data Explorer pool to use |
        | Name | *TestDatabase* | The database name must be unique within the cluster. |
        | Default retention period | *365* | The time span (in days) for which it's guaranteed that the data is kept available to query. The time span is measured from the time that data is ingested. |
        | Default cache period | *31* | The time span (in days) for which to keep frequently queried data available in SSD storage or RAM, rather than in longer-term storage. |

    1. Select **Create** to create the database. Creation typically takes less than a minute.
