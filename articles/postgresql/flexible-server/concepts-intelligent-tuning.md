---
title: Intelligent tuning - Azure Database for PostgreSQL - Flexible Server
description: This article describes the intelligent tuning feature in Azure Database for PostgreSQL - Flexible Server.
author: nathan-wisner-ms
ms.author: nathanwisner
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.date: 11/30/2021
---

# Perform intelligent tuning in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

**Applies to:** Azure Database for PostgreSQL - Flexible Server versions 11 and later.

The intelligent tuning feature in Azure Database for PostgreSQL - Flexible Server provides a way to automatically improve your database's performance. Intelligent tuning automatically adjusts your `checkpoint_completion_target`, `min_wal_size`, and `bgwriter_delay` parameters based on usage patterns and values. It queries statistics for your database every 30 minutes and makes constant adjustments to optimize performance without any interaction.

Intelligent tuning is an opt-in feature, so it isn't active by default on a server. It's available for singular databases and isn't global. Enabling it on one database doesn't enable it on all connected databases.

## Enable intelligent tuning by using the Azure portal

1. Sign in to the Azure portal and select your Azure Database for PostgreSQL server.
2. In the **Settings** section of the menu, select **Server Parameters**.
3. Search for the intelligent tuning parameter.
4. Set the value to **True**, and the select **Save**.

Allow up to 35 minutes for the first batch of data to persist in the *azure_sys* database.

## Information about intelligent tuning

Intelligent tuning operates around three main parameters for the given time: `checkpoint_completion_target`, `max_wal_size`, and `bgwriter_delay`.

These three parameters mostly affect: 

* The duration of checkpoints.
* The frequency of checkpoints.
* The duration of synchronizations.

Intelligent tuning operates in both directions. It tries to lower durations during high workloads and increase durations during idle segments. In this way, you can get personalized results during difficult time periods without manual updates.

## Limitations and known issues

* Intelligent tuning makes optimizations only in specific ranges. It's possible that the feature won't make any changes.
* Deleted databases in the query can cause slight delays in the feature's execution of improvements.
* At this time, the feature makes optimizations only in the storage sections.
