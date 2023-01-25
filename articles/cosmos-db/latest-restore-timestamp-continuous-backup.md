---
title: Latest restorable timestamp, use cases, examples for an Azure Cosmos DB container
description: The latest restorable timestamp API provides the latest restorable timestamp for containers on accounts with continuous mode backup. Using this API, you can get the restorable timestamp to trigger live account restore or monitor the data that is being backed up.
author: kanshiG
ms.author: govindk
ms.service: cosmos-db
ms.subservice: nosql
ms.custom: ignite-2022
ms.date: 04/08/2022
ms.topic: how-to
ms.reviewer: mjbrown
---

# Latest restorable timestamp for Azure Cosmos DB accounts with continuous backup mode
[!INCLUDE[NoSQL, MongoDB, Gremlin, Table](includes/appliesto-nosql-mongodb-gremlin-table.md)]

Azure Cosmos DB offers an API to get the latest restorable timestamp of a container. This API is available for accounts that have continuous backup mode enabled. Latest restorable timestamp represents the latest timestamp in UTC format up to which your data has been successfully backed up. Using this API, you can get the restorable timestamp to trigger the live account restore or monitor that your data is being backed up on time.

This API also takes the account location as an input parameter and returns the latest restorable timestamp for the given container in this location. If an account exists in multiple locations, then the latest restorable timestamp for a container in different locations could be different because the backups in each location are taken independently.

By default, the API only works at the container level, but it can be easily extended to work at the database or account level. This article helps you understand the semantics of latest restorable timestamp api, how it gets calculated and use cases for it. To learn more, see [how to get the latest restore timestamp](get-latest-restore-timestamp.md) for API for NoSQL, MongoDB, Table, and Gremlin accounts.

## Use cases

You can use latest restorable timestamp in the following use cases:

* You can get the latest restorable timestamp for a container, database, or an account and use it to trigger the restore. This is the latest timestamp up to which all the data of the specified resource or all its underlying resources has been successfully backed up.

* You can use this API to identify that your data has been successfully backed up before deleting the account. If the timestamp returned by this API is less than the last write timestamp, then it means that there's some data that hasn't been backed up yet. In such case, you must call this API until the timestamp becomes equal to or greater than the last write timestamp. If an account exists in multiple locations, you must get the latest restorable timestamp in all the locations to make sure that data has been backed up in all regions before deleting the account.

* You can use this API to monitor that your data is being backed up on time. This timestamp is generally within a few hundred seconds of the current timestamp, although sometimes it can differ by more.

## Semantics

The latest restorable timestamp for a container is the minimum timestamp upto, which all its partitions have taken backup successfully in the given location. This Api calculates the latest restorable timestamp by retrieving the latest backup timestamp for each partition of the given container in given location and returns the minimum of all these timestamps. If the data for all its partitions is backed up and there was no new data written to those partitions, then it will return the maximum of current timestamp and the last data backup timestamp.

If a partition hasn't taken any backup yet but it has some data to be backed up, then it will return the minimum Unix (epoch) timestamp that is, January 1, 1970, midnight UTC (Coordinated Universal Time). In such cases, user must retry until it gives a timestamp greater than epoch timestamp.

## Latest restorable timestamp calculation

The following example describes the expected outcome of latest restorable timestamp Api in different scenarios. In each scenario, we'll discuss about the current log backup state of partition, pending data to be backed up and how it affects the overall latest restorable timestamp calculation for a container.

Let's say, we have an account, which exists in two regions (East US and West US). We have a container "cont1", which has two partitions (Partition1 and Partition2). If we send a request to get the latest restorable timestamp for this container at timestamp 't3', the overall latest restorable timestamp for this container will be calculated as follows:

##### Case1: Data for all the partitions hasn't been backed up yet

*East US Region:*

* Partition 1: Last backup time = t2, but it has some more data to be backed up after t2.
* Partition 2: Last backup time = t3, and all its data is backed up.
* Latest restorable timestamp = min (t2, t3) = t2

*West US Region:*

* Partition 1: Last backup time = t1, but it has some more data to be backed up after t1.
* Partition 2: Last backup time = t2, but it has some more data to be backed up after t2.
* Latest restorable timestamp = min (t1, t2) = t1

##### Case2: Data for all the partitions is backed up

*East US Region:*

* Partition 1: Last backup time = t2, and all its data is backed up.
* Partition 2: Last backup time = t3, and all its data is backed up.
* Latest restorable timestamp = max (current timestamp, t2, t3)

*West US Region:*

* Partition 1: Last backup time = t3, and all its data is backed up.
* Partition 2: Last backup time = t3, and all its data is backed up.
* Latest restorable timestamp = max (current timestamp, t3, t3)

##### Case3: When one or more partitions hasn't taken any backup yet

*East US Region:*

* Partition 1: No log backup has been taken for this partition yet.
* Partition 2: Last backup time = t3
* Latest Restorable Timestamp = 1/1/1970 12:00:00 AM

## Frequently asked questions

#### Can I use this API for accounts with periodic backup?
No. This API can only be used for accounts with continuous backup mode.

#### Can I use this API for accounts migrated to continuous mode?
Yes. This API can be used for account provisioned with continuous backup mode or successfully migrated to continuous backup mode.

#### What is the typical delay between the latest write timestamp and the latest restorable timestamp?
The log backup data is backed up every 100 seconds. However, in some exceptional cases, backups could be delayed for more than 100 seconds.

#### Will restorable timestamp work for deleted accounts?
No. It applies only to live accounts. You can get the restorable timestamp to trigger the live account restore or monitor that your data is being backed up on time.

## Next steps

* [Introduction to continuous backup mode with point-in-time restore](continuous-backup-restore-introduction.md)

* [Continuous backup mode resource model](continuous-backup-restore-resource-model.md)

* [Configure and manage continuous backup mode](continuous-backup-restore-portal.md) using Azure portal.
