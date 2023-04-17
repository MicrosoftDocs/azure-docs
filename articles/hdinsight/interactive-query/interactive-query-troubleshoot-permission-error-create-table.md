---
title: Permission denied error with Apache Hive table in Azure HDInsight
description: Permission denied error when trying to create an Apache Hive table in Azure HDInsight
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 12/08/2022
---

# Scenario: Permission denied error when trying to create an Apache Hive table in Azure HDInsight

This article describes troubleshooting steps and possible resolutions for issues when using Interactive Query components in Azure HDInsight clusters.

## Issue

You'll see the following error when attempting to create a table:

```
java.sql.SQLException: Error while compiling statement: FAILED: HiveAccessControlException Permission denied: user [hdiuser] does not have [ALL] privilege on [wasbs://data@xxxxx.blob.core.windows.net/path/table]
```

You'll see a similar error message if you run the following HDFS storage command:

```
hdfs dfs -mkdir wasbs://data@xxxxx.blob.core.windows.net/path/table
```

## Cause

The ability to create a table in Apache Hive is decided by the permissions applied to the cluster’s storage account. If the cluster storage account permissions are incorrect, you won't be able to create tables. This error denotes that you could have the correct Ranger policies for table creation, and still see "Permission Denied" errors.

## Resolution

This error is caused due to lack of sufficient permissions on the storage container being used. The user creating the Hive table needs read, write, and execute permissions against the container.

## Next steps

[!INCLUDE [troubleshooting next steps](../includes/hdinsight-troubleshooting-next-steps.md)]
