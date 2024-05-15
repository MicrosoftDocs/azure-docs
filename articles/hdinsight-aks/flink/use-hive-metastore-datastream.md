---
title: Use Hive Metastore with Apache Flink® DataStream API
description: Use Hive Metastore with Apache Flink® DataStream API
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 03/29/2024
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
<!-- https://mvnrepository.com/artifact/org.apache.flink/flink-table-api-java-bridge -->
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-table-api-java-bridge</artifactId>
            <version>${flink.version}</version>
            <scope>provided</scope>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-connector-hive -->
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-connector-hive_2.12</artifactId>
            <version>${flink.version}</version>
            <scope>provided</scope>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-table-planner -->
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-table-planner_2.12</artifactId>
            <version>${flink.version}</version>
            <scope>provided</scope>
</dependency>
```

## Connect to Hive

This example illustrates various snippets of connecting to hive, using Apache Flink on HDInsight on AKS, you're required to use `/opt/hive-conf` as hive configuration directory to connect with Hive metastore

```
package contoso.example;

import org.apache.flink.streaming.api.TimeCharacteristic;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.table.api.bridge.java.StreamTableEnvironment;
import org.apache.flink.table.catalog.hive.HiveCatalog;

public class hiveDemo {
    public static void main(String[] args) throws Exception {
        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
        // start Table Environment
        StreamTableEnvironment tableEnv =
                StreamTableEnvironment.create(env);
        env.setStreamTimeCharacteristic(TimeCharacteristic.EventTime);
        String catalogName = "myhive";
        String defaultDatabase = HiveCatalog.DEFAULT_DB;
        String hiveConfDir = "/opt/hive-conf";
        HiveCatalog hive = new HiveCatalog(catalogName, defaultDatabase, hiveConfDir);
        // register HiveCatalog in the tableEnv
        tableEnv.registerCatalog("myhive", hive);
        // set the HiveCatalog as the current catalog of the session
        tableEnv.useCatalog("myhive");
        // Create a table in hive catalog
        tableEnv.executeSql("create table MyTable (name varchar(32), age int) with ('connector' = 'filesystem', 'path' = 'abfs://flink@contosogen2.dfs.core.windows.net/data/', 'format' = 'csv','csv.field-delimiter' = ',')");
        // Create a view in hive catalog
        tableEnv.executeSql("create view MyView as select * from MyTable");

        // Read from the table and print the results
        tableEnv.from("MyTable").execute().print();
        // 4. run stream
        env.execute("Hive Demo on Flink");
    }
}
```
On Webssh pod, move the planner jar

Move the jar `flink-table-planner-loader-1.17.0-*.*.*.jar` located in webssh pod's `/opt to /lib` and move out the jar `flink-table-planner-loader-1.17.0-*.*.*.jar` from `lib`. Refer to issue for more details. Perform the following steps to move the planner jar.

```
mv /opt/flink-webssh/lib/flink-table-planner-loader-1.17.0-1.1.8.jar /opt/flink-webssh/opt/
mv /opt/flink-webssh/opt/flink-table-planner_2.12-1.17.0-1.1.8.jar /opt/flink-webssh/lib/
```
> [!NOTE]
> An extra planner jar moving is only needed when using Hive dialect or HiveServer2 endpoint. However, this is the recommended setup for Hive integration.

For more information, see [How to use Hive Catalog with Apache Flink® on HDInsight on AKS](./use-hive-catalog.md)

## Package the jar and upload it into Webssh and run

```
user@sshnode-0 [ ~ ]$ bin/flink run -c contoso.example.hiveDemo -j FlinkSQLServerCDCDemo-1.0-SNAPSHOT.jar 
SLF4J: Class path contains multiple SLF4J bindings.
SLF4J: Found binding in [jar:file:/opt/flink-webssh/lib/log4j-slf4j-impl-2.17.1.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: Found binding in [jar:file:/opt/hadoop/flink-hadoop-dep-1.17.0-1.1.8.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
SLF4J: Actual binding is of type [org.apache.logging.slf4j.Log4jLoggerFactory]
Job has been submitted with JobID 5c887e1f8e1bfac501168c439a83788f
+----+--------------------------------+-------------+
| op |                           name |         age |
+----+--------------------------------+-------------+
| +I |                           Jack |          18 |
| +I |                           mike |          24 |
+----+--------------------------------+-------------+
2 rows in set
```

## Check JOB running on Flink UI

:::image type="content" source="./media/use-hive-metastore-datastream/check-the-job-status.png" alt-text="Screenshot showing how to check the job-status." lightbox="./media/use-hive-metastore-datastream/check-the-job-status.png":::

## Check table on Webssh UI via `sql-client.sh`

```
user@sshnode-0 [ ~ ]$ bin/sql-client.sh 
SLF4J: Class path contains multiple SLF4J bindings.
SLF4J: Found binding in [jar:file:/opt/flink-webssh/lib/log4j-slf4j-impl-2.17.1.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: Found binding in [jar:file:/opt/hadoop/flink-hadoop-dep-1.17.0-1.1.8.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
SLF4J: Actual binding is of type [org.apache.logging.slf4j.Log4jLoggerFactory]

                                   ????????
                               ????????????????
                            ???????        ???????  ?
                          ????   ?????????      ?????
                          ???         ???????    ?????
                            ???            ???   ?????
                              ??       ???????????????
                            ?? ?   ???       ?????? ?????
                            ?????   ????      ????? ?????
                         ???????       ???    ??????? ???
                   ????????? ??         ??    ??????????
                  ????????  ??           ?   ?? ???????
                ????  ???            ?  ?? ???????? ?????
               ???? ? ??          ? ?? ????????    ????  ??
              ???? ????          ??????????       ??? ?? ????
           ???? ?? ???       ???????????         ????  ? ?  ???
           ???  ?? ??? ?????????              ????           ???
           ??    ? ???????              ????????          ??? ??
           ???    ???    ????????????????????            ????  ?
          ????? ???   ??????   ????????                  ????  ??
          ????????  ???????????????                            ??
          ?? ????   ???????  ???       ??????    ??          ???
          ??? ???  ???  ???????            ????   ?????????????
           ??? ?????  ????  ??                ??      ????   ???
           ??   ???   ?     ??                ??              ??
            ??   ??         ??                 ??        ????????
             ?? ?????       ??                  ???????????    ??
              ??   ????      ?                    ???????      ??
               ???   ?????                         ?? ???????????
                ????    ????                     ??????? ????????
                  ?????                          ??  ????  ?????
                      ?????????????????????????????????  ?????
          
    ______ _ _       _       _____  ____  _         _____ _ _            _  BETA   
   |  ____| (_)     | |     / ____|/ __ \| |       / ____| (_)          | |  
   | |__  | |_ _ __ | | __ | (___ | |  | | |      | |    | |_  ___ _ __ | |_ 
   |  __| | | | '_ \| |/ /  \___ \| |  | | |      | |    | | |/ _ \ '_ \| __|
   | |    | | | | | |   <   ____) | |__| | |____  | |____| | |  __/ | | | |_ 
   |_|    |_|_|_| |_|_|\_\ |_____/ \___\_\______|  \_____|_|_|\___|_| |_|\__|
          
        Welcome! Enter 'HELP;' to list all available commands. 'QUIT;' to exit.

Command history file path: /home/xcao/.flink-sql-history


Flink SQL> CREATE CATALOG myhive WITH (
>     'type' = 'hive'
> );
[INFO] Execute statement succeed.

Flink SQL> USE CATALOG myhive;
[INFO] Execute statement succeed.

Flink SQL> show tables
> ;
+------------+
| table name |
+------------+
|    mytable |
|     myview |
+------------+
2 rows in set

Flink SQL> SET 'sql-client.execution.result-mode' = 'tableau';
[INFO] Execute statement succeed.

Flink SQL> select * from mytable;
+----+--------------------------------+-------------+
| op |                           name |         age |
+----+--------------------------------+-------------+
| +I |                           Jack |          18 |
| +I |                           mike |          24 |
+----+--------------------------------+-------------+
Received a total of 2 rows
```



## References
- [Hive read & write](https://nightlies.apache.org/flink/flink-docs-release-1.16/docs/connectors/table/hive/hive_read_write/)
- Apache, Apache Hive, Hive, Apache Flink, Flink, and associated open source project names are [trademarks](../trademarks.md) of the [Apache Software Foundation](https://www.apache.org/) (ASF).
