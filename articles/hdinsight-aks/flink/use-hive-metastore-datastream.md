---
title: Use Hive Metastore with Apache Flink® DataStream API
description: Use Hive Metastore with Apache Flink® DataStream API
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 10/30/2023
---

# Use Hive Metastore with Apache Flink® DataStream API

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

Over the years, Hive Metastore has evolved into a de facto metadata center in the Hadoop ecosystem. Many companies have a separate Hive Metastore service instance in their production environments to manage all their metadata (Hive or non-Hive metadata). For users who have both Hive and Flink deployments, HiveCatalog enables them to use Hive Metastore to manage Flink’s metadata.


## Supported Hive versions for Apache Flink clusters on HDInsight on AKS

Supported Hive Version:
- 3.1
  - 3.1.0
  - 3.1.1
  - 3.1.2
  - 3.1.3

If you're building your own program, you need the following dependencies in your mvn file. It’s **not recommended** to include these dependencies in the resulting jar file. You’re supposed to add dependencies at runtime.

```
<dependency>
  <groupId>org.apache.flink</groupId>
  <artifactId> flink-sql-connector-hive-3.1.2_2.12</artifactId>
  <version>1.16.0</version>
  <scope>provided</scope>
</dependency>

<dependency>
  <groupId>org.apache.flink</groupId>
  <artifactId>flink-table-api-java-bridge_2.12</artifactId>
  <version>1.16.0</version>
  <scope>provided</scope>
</dependency>
```

## Connect to Hive

This example illustrates various snippets of connecting to hive, using Apache Flink on HDInsight on AKS, you're required to use `/opt/hive-conf` as hive configuration directory to connect with Hive metastore

```
public static void main(String[] args) throws Exception
    {
        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
        // start Table Environment
        StreamTableEnvironment tableEnv = 
        StreamTableEnvironment.create(env);
        env.setStreamTimeCharacteristic(TimeCharacteristic.EventTime);
        String catalogName            = "myhive"; 
        String defaultDatabase = HiveCatalog.DEFAULT_DB;
        String hiveConfDir     = "/opt/hive-conf";
        HiveCatalog hive = new HiveCatalog(catalogName, defaultDatabase, hiveConfDir);
// register HiveCatalog in the tableEnv
        tableEnv.registerCatalog("myhive", hive);
// set the HiveCatalog as the current catalog of the session
        tableEnv.useCatalog("myhive");
// Create a table in hive catalog
        tableEnv.executeSql("create table MyTable (a int, b bigint, c varchar(32)) with ('connector' = 'filesystem', 'path' = '/non', 'format' = 'csv')\"");
// Create a view in hive catalog
        tableEnv.executeSql("create view MyView as select * from MyTable");
```

## References
- [Hive read & write](https://nightlies.apache.org/flink/flink-docs-release-1.16/docs/connectors/table/hive/hive_read_write/)
- Apache, Apache Hive, Hive, Apache Flink, Flink, and associated open source project names are [trademarks](../trademarks.md) of the [Apache Software Foundation](https://www.apache.org/) (ASF).
