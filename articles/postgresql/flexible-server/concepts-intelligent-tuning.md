---
title: Intelligent Tuning - Azure Database for PostgreSQL - Flexible Server
description: This article describes Intelligent Tuning features in Azure Database for PostgreSQL - Flexible Server.
author: nathanwisner
ms.author: nathanwinser
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

The Intelligent Tuning features in Azure Database for PostgreSQL Flexible Server provides a way to automatically improve your databases performance by enrolling in our service to automatically adjust your Checkpoint_completion_target, min_wal_size and max_wal_size based on usage patterns and values. Our service will query statistics around your database every 30 minutes and make constant adjustments to optimize your performance without any interaction from the user.

## Enabling Intelligent Tuning

Intelligent Tuning is an opt-in feature, so it isn't active by default on a server. The tuning is available for singular databases and is not global, so enabling it on one database does not enable it on all databases connected.

### Enable Intelligent Tuning using the Azure Portal

1. Sign in to the Azure portal and select your Azure Database for PostgreSQL server.
2. Select Server Parameters in the Settings section of the menu.
3. Search for the Intelligent Tuning parameter.
4. Set the value to True and Save.

Allow up to 35 minutes for the first batch of data to persist in the azure_sys database.

## Information about Intelligent Tuning

Intelligent tuning operates based around 3 main features and only those for the given time

1. Checkpoint_completion_target
2. Min_wal_size
3. Max_wal_size

These three variables mostly affect the following

• The duration of checkpoints
• The frequency of checkpoints
• The duration of synchronizations

Intelligent tuning operates these in both directions, it attempts to lower durations during important workloads while also increasing them when the system is considered more idle. These are the ways we attempt to optimize these features so users can get personalized optimizations during difficult time periods without manually attempting updates.

## Limitations and known issues

• Optimizations are only issued in specific ranges, there is the possibility that there may not be any changes made
• Intelligent Tuning functionality can be delayed by deleted databases in the query which can cause slight delays in the execution of improvements
  
Optimizations are only made in the storage sections as of now, expanding into other various categories is TBD
