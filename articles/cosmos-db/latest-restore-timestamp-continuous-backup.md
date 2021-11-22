---
title: Get the latest restorable timestamp for a container in a continuous backup account
description: The latest restorable timestamp API provides the latest restorable timestamp for containers on accounts with continuous mode backup. Using this API, you can get the restorable timestamp to trigger live account restore or monitor the data that is being backed up.
author: SnehaGunda
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.date: 11/22/2021
ms.author: sngun
ms.topic: how-to
ms.reviewer: sngun
---

# Latest restorable timestamp for Azure Cosmos DB accounts with continuous backup mode
[!INCLUDE[appliesto-sql-mongodb-api](includes/appliesto-sql-mongodb-api.md)]

Azure Cosmos DB offers an API to get the latest restorable timestamp of a container. This API is available for accounts that have continuous backup enabled. Latest restorable timestamp represents the latest timestamp in UTC format up to which your data has been successfully backed up. Using this API, you can get the restorable timestamp to trigger live account restore or monitor the data that is being successfully backed up.

This API takes your account location as an input parameter and returns the latest restorable timestamps for a container in this location. If an account exists in multiple locations, the latest restorable timestamp for a container in different locations could be different. Because the backup in different account locations is taken independently.

By default, the API only works at the container level, but you can easily extend it for the entire database or an account. The latest restorable timestamp for a database or a container is the minimum timestamp at which all the partitions for a given database or an account has a backup in the location that’s passed as input. This article explains the use cases where latest restore timestamp is required and provides examples. To learn more, see [how to get the latest restore timestamp](get-latest-restore-timestamp.md) for SQL and MongoDB accounts.

## Use cases

You can use latest restorable timestamp in the following use cases:

* You can get the latest restorable timestamp for a container, database, or account and use it to trigger the restore. This is the latest timestamp up to which all the data of the specified resource or all its underlying resources has been successfully backed up.

* You can use this API to identify that your data has been successfully written before deleting the account. If the timestamp returned by this API is less than the last write timestamp, it means there is some data that has not been backed up yet. In such case, you must call this API until the timestamp becomes equal to or greater than the last write timestamp. If an account exists in multiple locations, you must get the latest restorable timestamp in all the locations to make sure that data has been backed up in all regions before deleting the account.

* You can use this API to monitor that your data is being backed up on time. This timestamp is within a few hundred seconds of the current timestamp. Although it can sometimes take a bit longer.

## Semantics

The latest restorable timestamp API gets the latest time for all the partitions of a container at which the data was last backed up and then returns the minimum of all these timestamps. If the data for all its partitions is backed up and there was no new data written to those partitions, in that case it will return the maximum of current timestamp and the last data backup timestamp. This API makes sure that at the returned timestamp, all the partitions of a particular container have been backed up.

If a partition has not yet taken any backup or it has some data to be backed up, in that case it will return the minimum Unix (epoch) timestamp that is, Jan 1, 1970, midnight UTC (Coordinated Universal Time). In this case, you must retry until it gives a timestamp greater than epoch timestamp.

## Examples

If a container “cont1” has two partitions in two regions: “East US” and “West US”. Assume that you send a request at timestamp t3 to get the latest restorable timestamp.

### Case1: Data for all the partitions has not yet been backed up

**East US:**

* Partition 1 (last backup time: t2)
* Partition 2 (last backup time: t3)
* Latest restorable timestamp = min (t2, t3) = t2

**West US:**

* Partition 1 (last backup time: t1)
* Partition 2 (last backup time: t3)
* Latest restorable timestamp = min (t1, t3) = t1

### Case2: Data for all partitions is backed up

**East US:**

* Partition 1 (last backup time: t2) (all the data for this partition was backed up at t2 and no new data written to it.)
* Partition 2 (last backup time: t3)
* Latest restorable timestamp = max (current timestamp, t2, t3)

**West US:**

* Partition 1 (last backup time: t3)
* Partition 2 (last backup time: t3)
* Latest restorable timestamp = max (current timestamp, t3, t3)

### Case3: When one of the partitions has not taken any backup yet

**East US:**

* Partition 1: (no backup taken yet)
* Partition 2: (last backup time: t3)
* Latest Restorable Timestamp = 1/1/1970 12:00:00 AM

## Frequently asked questions

### Can I use this API for accounts with periodic backup?

No. This API can only be used for accounts with continuous backup mode.

### Can I use this API for accounts migrated to continuous mode?

Yes.

## What is the typical delay between the latest write timestamp and the latest restorable timestamp?

Usually, your data is backed up within 100 seconds (i.e within 1 and a half minutes) after the data write operation. However, in some exceptional cases, backups could be delayed for more than 100 seconds.

## Next steps

* [Introduction to continuous backup mode with point-in-time restore](continuous-backup-restore-introduction.md)

* [Continuous backup mode resource model](continuous-backup-restore-resource-model.md)

* [Configure and manage continuous backup mode](continuous-backup-restore-portal.md) using Azure portal.