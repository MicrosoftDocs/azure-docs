---
title: How to monitor SQL pools in Synapse Studio
description: Learn how to monitor your SQL pools by using Synapse Studio.
services: synapse-analytics 
author: matt1883
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: monitoring
ms.date: 11/30/2020
ms.author: mahi
ms.reviewer: mahi
---

# Use Synapse Studio to monitor your SQL pools

With Synapse Studio, you can run SQL scripts on the SQL pools in your workspace.

This article explains how to monitor your SQL pools, allowing you to keep an eye on the status and activity of your pools.

## Access SQL pools list

To see the list of SQL pools in your workspace, first [open the Synapse Studio](https://web.azuresynapse.net/) and select your workspace.

![Log in to workspace](./media/common/login-workspace.png)

Once you've opened your workspace, select the **Monitor** section on the left.

![Select Monitor hub](./media/common/left-nav.png)

Select **SQL pools** to view the list of SQL pools.

 ![Select SQL pools](./media/how-to-monitor-sql-pools/monitor-hub-nav-sql-pools.png)

## Filter your SQL pools

You can filter the list of SQL pools to the ones that interest you. The filters at the top of the screen allow you to specify a field on which you'd like to filter.

For example, you can filter the view to see only the SQL pools containing the name "salesrecords":

![Sample filter](./media/how-to-monitor-sql-pools/filter-example.png)

## View details about a specific SQL pool

To view the details about one of your SQL pools, select the SQL pool to view the details.

![SQL pool details](./media/how-to-monitor-sql-pools/sql-pool-details.png)

## Next steps

For more information on monitoring pipeline runs, see the [Monitor pipeline runs in Synapse Studio](how-to-monitor-pipeline-runs.md) article. 

For more information on monitoring SQL requests, see the [Monitor SQL requests in Synapse Studio](how-to-monitor-sql-requests.md) article.