---
title: Intelligent Tuning - Azure Database for PostgreSQL - Flexible Server
description: This article describes Intelligent Tuning features in Azure Database for PostgreSQL - Flexible Server.
author: nathan-wisner-ms
ms.author: nathanwisner
ms.service: postgresql
ms.topic: conceptual
ms.date: 08/04/2021
---

# Perform Intelligent Tuning on your PostgreSQL Flex Server

> [!IMPORTANT]
> Azure Database for PostgreSQL - Flexible Server is in preview

> [!IMPORTANT]
> Intelligent Tuning is in preview

**Applies to:** Azure Database for PostgreSQL - Flex Server versions 11 and above

The Intelligent Tuning features in Azure Database for PostgreSQL Flexible Server provides a way to automatically improve your databases performance. With our service, Intelligent Tuning automatically adjusts your Checkpoint_completion_target, min_wal_size and max_wal_size based on usage patterns and values. Our service will query statistics around your database every 30 minutes and make constant adjustments to optimize your performance without any interaction from the user.

## Enabling Intelligent Tuning

Intelligent Tuning is an opt-in feature, so it isn't active by default on a server. The tuning is available for singular databases and isn't global, so enabling it on one database doesn't enable it on all databases connected.

### Enable Intelligent Tuning using the Azure portal

1. Sign in to the Azure portal and select your Azure Database for PostgreSQL server.
2. Select Server Parameters in the Settings section of the menu.
3. Search for the Intelligent Tuning parameter.
4. Set the value to True and Save.

Allow up to 35 minutes for the first batch of data to persist in the azure_sys database.

## Information about Intelligent Tuning

Intelligent tuning operates based around three main features for the given time

* Checkpoint_completion_target
* Min_wal_size
* Max_wal_size

These three variables mostly affect the following

* The duration of checkpoints
* The frequency of checkpoints
* The duration of synchronizations

Intelligent tuning operates in both directions, it attempts to lower durations during high workloads and increasing them during idle segments. These rules are the ways we attempt to optimize these features so users can get personalized results during difficult time periods without manual updates.

## Limitations and known issues

* Optimizations are only issued in specific ranges, there's the possibility that there may not be any changes made
* Intelligent Tuning functionality can be delayed by deleted databases in the query that can cause slight delays in the execution of improvements
  
Optimizations are only made in the storage sections as of now, expanding into other various categories is TBD
