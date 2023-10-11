---
title: Hive dialect in Flink
description: Hive dialect in Flink HDInsight on AKS
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 09/18/2023
---

# Hive dialect in Flink

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

In this article, learn how to use Hive dialect in HDInsight on AKS - Flink.

## Introduction

The user cannot change the default `flink` dialect to hive dialect for their usage on HDInsight on AKS - Flink. All the SQL operations fail once changed to hive dialect with the following error.

```Caused by: 

*java.lang.ClassCastException: class jdk.internal.loader.ClassLoaders$AppClassLoader cannot be cast to class java.net.URLClassLoader*
```

The reason for this issue arises due to an open [Hive Jira](https://issues.apache.org/jira/browse/HIVE-21584). Currently, Hive assumes that the system class loader is an instance of URLClassLoader. In `Java 11`, this assumption is not the case.

## How to use Hive dialect in Flink

- Execute the following steps in [webssh](./flink-web-ssh-on-portal-to-flink-sql.md):

  1. Remove the existing flink-sql-connector-hive*jar in lib location
     ```command
     rm /opt/flink-webssh/lib/flink-sql-connector-hive*jar
     ```
  1. Download the below jar in `webssh` pod and add it under the /opt/flink-webssh/lib wget https://aka.ms/hdiflinkhivejdk11jar.
    (The above hive jar has the fix [https://issues.apache.org/jira/browse/HIVE-27508](https://issues.apache.org/jira/browse/HIVE-27508))

  1. ```
     mv $FLINK_HOME/opt/flink-table-planner_2.12-1.16.0-0.0.18.jar $FLINK_HOME/lib/flink-table-planner_2.12-1.16.0-0.0.18.jar
     ```

  1. ```
     mv $FLINK_HOME/lib/flink-table-planner-loader-1.16.0-0.0.18.jar $FLINK_HOME/opt/flink-table-planner-loader-1.16.0-0.0.18.jar
     ```

  1. Add the following keys in the `flink` configuration management under core-site.xml section:
     ```
     fs.azure.account.key.<STORAGE>.dfs.core.windows.net: <KEY>
     flink.hadoop.fs.azure.account.key.<STORAGE>.dfs.core.windows.net: <KEY>
     ```

- Here is an overview of [hive-dialect queries](https://nightlies.apache.org/flink/flink-docs-master/docs/dev/table/hive-compatibility/hive-dialect/queries/overview/)
  
  - Executing Hive dialect in Flink without partitioning
    
  ```sql
    root [ ~ ]# ./bin/sql-client.sh
    Flink SQL>
    Flink SQL> create catalog myhive with ('type' = 'hive', 'hive-conf-dir' = '/opt/hive-conf');
    [INFO] Execute statement succeed.

    Flink SQL> use catalog myhive;
    [INFO] Execute statement succeed.

    Flink SQL> load module hive;
    [INFO] Execute statement succeed.

    Flink SQL> use modules hive,core;
    [INFO] Execute statement succeed.

    Flink SQL> set table.sql-dialect=hive;
    [INFO] Session property has been set.

    Flink SQL> set sql-client.execution.result-mode=tableau;
    [INFO] Session property has been set.

    Flink SQL> select explode(array(1,2,3));Hive Session ID = 6ba45be2-360e-4bee-8842-2765c91581c8
 

  > [!WARNING]
  > An illegal reflective access operation has occurred

  > [!WARNING]
  > Illegal reflective access by org.apache.hadoop.hive.common.StringInternUtils (file:/opt/flink-webssh/lib/flink-sql-connector-hive-3.1.2_2.12-1.16-SNAPSHOT.jar) to field java.net.URI.string

  > [!WARNING]
  > Please consider reporting this to the maintainers of org.apache.hadoop.hive.common.StringInternUtils

  > [!WARNING]
  > `Use --illegal-access=warn` to enable warnings of further illegal reflective access operations

  > [!WARNING]
  >  All illegal access operations will be denied in a future release
  select explode(array(1,2,3));


  +----+-------------+
  | op |         col |
  +----+-------------+
  | +I |           1 |
  | +I |           2 |
  | +I |           3 |
  +----+-------------+

  Received a total of 3 rows

  Flink SQL> create table tttestHive Session ID = fb8b652a-8dad-4781-8384-0694dc16e837

  [INFO] Execute statement succeed.

  Flink SQL> insert into table tttestHive Session ID = f239dc6f-4b58-49f9-ad02-4c73673737d8),(3,'c'),(4,'d');

  [INFO] Submitting SQL update statement to the cluster...
  [INFO] SQL update statement has been successfully submitted to the cluster:
  Job ID: d0542da4c4252f9494298666ff4e9f8e

  Flink SQL> set execution.runtime-mode=batch;
  [INFO] Session property has been set.

  Flink SQL> select * from tttestHive Session ID = 61b6eb3b-90a6-499c-aced-0598366c5b31

  +-----+-------+
  | key | value |
  +-----+-------+
  |   1 |     a |
  |   1 |     a |
  |   2 |     b |
  |   3 |     c |
  |   3 |     c |
  |   3 |     c |
  |   4 |     d |
  |   5 |     e |
  +-----+-------+
  8 rows in set

  Flink SQL> QUIT;Hive Session ID = 2dadad92-436e-426e-a88c-66eafd740d98

  [INFO] Exiting Flink SQL CLI Client...

  Shutting down the session...
  done.
  root [ ~ ]# exit
  ```

  The data is written in the same container configured in the hive/warehouse directory.

  :::image type="content" source="./media/hive-dialect-flink/flink-container-table-1.png" alt-text="Screenshot shows container table 1." lightbox="./media/hive-dialect-flink/flink-container-table-1.png":::

  - Executing Hive dialect in Flink with partitions

```sql
  create table tblpart2 (key int, value string) PARTITIONED by ( part string ) tblproperties ('sink.partition-commit.delay'='1 s', 'sink.partition-commit.policy.kind'='metastore,success-file');

  insert into table tblpart2 Hive Session ID = 78fae85f-a451-4110-bea6-4aa1c172e282),(2,'b','d'),(3,'c','d'),(3,'c','a'),(4,'d','e');
```
  :::image type="content" source="./media/hive-dialect-flink/flink-container-table-2.png" alt-text="Screenshot shows container table 2." lightbox="./media/hive-dialect-flink/flink-container-table-2.png":::

  :::image type="content" source="./media/hive-dialect-flink/flink-container-table-3.png" alt-text="Screenshot shows container table 3." lightbox="./media/hive-dialect-flink/flink-container-table-3.png":::
