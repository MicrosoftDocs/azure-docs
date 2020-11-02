---
title: Permission denied error with Apache Hive table in Azure HDInsight
description: Permission denied error when trying to create an Apache Hive table in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.date: 08/09/2019
---

# Scenario: Permission denied error when trying to create an Apache Hive table in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when using Interactive Query components in Azure HDInsight clusters.

## Issue

You will see the following error when attempting to create a table:

```
java.sql.SQLException: Error while compiling statement: FAILED: HiveAccessControlException Permission denied: user [hdiuser] does not have [ALL] privilege on [wasbs://data@xxxxx.blob.core.windows.net/path/table]
```

You will see a similar error message if you run the following HDFS storage command:

```
hdfs dfs -mkdir wasbs://data@xxxxx.blob.core.windows.net/path/table
```

## Cause

The ability to create a table in Apache Hive is decided by the permissions applied to the cluster’s storage account. If the cluster storage account permissions are incorrect, you will not be able to create tables. This means that you could have the correct Ranger policies for table creation, and still see "Permission Denied" errors.

## Resolution

This is caused by a lack of sufficient permissions on the storage container being used. The user creating the Hive table needs read, write, and execute permissions against the container. For more information, please see [Best Practices for Hive Authorization Using Apache Ranger in HDP 2.2](https://hortonworks.com/blog/best-practices-for-hive-authorization-using-apache-ranger-in-hdp-2-2/).

## Next steps

[!INCLUDE [troubleshooting next steps](../../includes/hdinsight-troubleshooting-next-steps.md)]