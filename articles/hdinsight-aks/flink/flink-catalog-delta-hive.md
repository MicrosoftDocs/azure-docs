---
title: Table API and SQL - Use Delta Catalog type with Hive in HDInsight on AKS - Apache Flink
description: Learn about how to create Apache Flink-Delta Catalog in HDInsight on AKS - Apache Flink
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Create Apache Flink-Delta Catalog

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

[Delta Lake](https://docs.delta.io/latest/delta-intro.html) is an open source project that enables building a Lakehouse architecture on top of data lakes. Delta Lake provides ACID transactions, scalable metadata handling, and unifies streaming and batch data processing on top of existing data lakes.

In this article, we learn how Apache Flink SQL/TableAPI is used to implement a Delta catalog for Apache Flink, with Hive Catalog. Delta Catalog delegates all metastore communication to Hive Catalog. It uses the existing logic for Hive or In-Memory metastore communication that is already implemented in Flink.

### Prerequisites
- You're required to have an operational Flink cluster with secure shell, learn how to [create a cluster](./flink-create-cluster-portal.md)
- You can refer this article on how to use CLI from [Secure Shell](./flink-web-ssh-on-portal-to-flink-sql.md) on Azure portal.

### Add dependencies

Once you launch the Secure Shell (SSH), let us start downloading the dependencies required to the SSH node, to illustrate the Delta table managed in Hive catalog.

   ```
 wget https://repo1.maven.org/maven2/io/delta/delta-standalone_2.12/3.0.0rc1/delta-standalone_2.12-3.0.0rc1.jar -P $FLINK_HOME/lib
 wget https://repo1.maven.org/maven2/io/delta/delta-flink/3.0.0rc1/delta-flink-3.0.0rc1.jar -P $FLINK_HOME/lib
 wget https://repo1.maven.org/maven2/com/chuusai/shapeless_2.12/2.3.4/shapeless_2.12-2.3.4.jar -P $FLINK_HOME/lib
 wget https://repo1.maven.org/maven2/org/apache/flink/flink-parquet/1.16.0/flink-parquet-1.16.0.jar -P $FLINK_HOME/lib
 wget https://repo1.maven.org/maven2/org/apache/parquet/parquet-hadoop-bundle/1.12.2/parquet-hadoop-bundle-1.12.2.jar -P $FLINK_HOME/lib
   ```

### Start the Apache Flink SQL Client
A detailed explanation is given on how to get started with Flink SQL Client using [Secure Shell](./flink-web-ssh-on-portal-to-flink-sql.md) on Azure portal. You're required to start the SQL Client as described on the article by running the following command. 
```
./bin/sql-client.sh
```
#### Create Delta Catalog using Hive catalog 

```sql
     CREATE CATALOG delta_catalog WITH (
     'type' = 'delta-catalog',
     'catalog-type' = 'hive');
```
Using the delta catalog

```sql
    USE CATALOG delta_catalog;
```

#### Add dependencies to server classpath

```sql
  ADD JAR '/opt/flink-webssh/lib/delta-flink-3.0.0rc1.jar';
  ADD JAR '/opt/flink-webssh/lib/delta-standalone_2.12-3.0.0rc1.jar';
  ADD JAR '/opt/flink-webssh/lib/shapeless_2.12-2.3.4.jar';
  ADD JAR '/opt/flink-webssh/lib/parquet-hadoop-bundle-1.12.2.jar';
  ADD JAR '/opt/flink-webssh/lib/flink-parquet-1.16.0.jar';
```
#### Create Table

We use arrival data of flights from a sample data, you can choose a table of your choice.

```sql
    CREATE TABLE flightsintervaldata1 (arrivalAirportCandidatesCount INT, estArrivalHour INT) PARTITIONED BY (estArrivalHour) WITH ('connector' = 'delta', 'table-path' = 'abfs://container@storage_account.dfs.core.windows.net'/delta-output);
```
> [!NOTE]
> In the above step, the container and storage account *need not be same* as specified during the cluster creation. In case you want to specify another storage account, you can update `core-site.xml` with `fs.azure.account.key.<account_name>.dfs.core.windows.net: <azure_storage_key>` using configuration management.

#### Insert Data into the Delta Table

```sql
    INSERT INTO flightsintervaldata1 SELECT 76, 12;
```

> [!IMPORTANT]
>  - Delta-Flink Connector has an known [issue](https://github.com/delta-io/delta/issues/1931) with String DataType,  String DataType is not being consumed properly for delta-flink while partitioning or otherwise.
>  - Delta-Flink has a known [issue](https://github.com/delta-io/delta/issues/1971) on viewing the table schema in Trino for the table when registered in Hive metastore (HMS) from Flink. Read and Write operations using Trino with same Flink HMS are not operational due to this issue.

#### Output of the Delta Table

You can view the Delta Table output on the ABFS container

:::image type="content" source="media/flink-catalog-delta-hive/flink-catalog-delta-hive-output.png" alt-text="Screenshot showing output of the delta table in ABFS.":::
