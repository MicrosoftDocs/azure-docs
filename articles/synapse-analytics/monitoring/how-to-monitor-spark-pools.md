---
title: How to monitor Apache Spark pools in Synapse Studio
description: Learn how to monitor your Apache Spark pools by using Synapse Studio.
services: synapse-analytics 
author: matt1883
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: monitoring
ms.date: 11/30/2020
ms.author: mahi
ms.reviewer: mahi
---

# Use Synapse Studio to monitor your Apache Spark pools

With Azure Synapse Analytics, you can use Apache Spark to run notebooks, jobs, and other kinds of applications on Apache Spark pools in your workspace.

This article explains how to monitor your Apache Spark pools, allowing you to keep an eye on the status of your pools, including how many vCores are in use by different workspace users.

## Access Apache Spark pools list

To see the list of Apache Spark pools in your workspace, first [open the Synapse Studio](https://web.azuresynapse.net/) and select your workspace.

![Log in to workspace](./media/common/login-workspace.png)

Once you've opened your workspace, select the **Monitor** section on the left.

![Select Monitor hub](./media/common/left-nav.png)

Select **Apache Spark pools** to view the list of Apache Spark pools.

 ![Select Apache Spark pools](./media/how-to-monitor-spark-pools/monitor-hub-nav-spark-pools.png)

## Filter your Apache Spark pools

You can filter the list of Apache Spark pools to the ones that interest you. The filters at the top of the screen allow you to specify a field on which you'd like to filter.

For example, you can filter the view to see only the Apache Spark pools containing the name "dataprep":

![Sample filter](./media/how-to-monitor-spark-pools/filter-example.png)

## View details about a specific Apache Spark pool

To view the details about one of your Apache Spark pools, select the Apache Spark pool to view the details.

![Apache Spark pool details](./media/how-to-monitor-spark-pools/spark-pool-details.png)

## Next steps

For more information on monitoring pipeline runs, see the [Monitor pipeline runs in Synapse Studio](how-to-monitor-pipeline-runs.md) article. 

For more information on monitoring Apache Spark applications, see the [Monitor Apache Spark applications in Synapse Studio](how-to-monitor-spark-applications.md) article.
