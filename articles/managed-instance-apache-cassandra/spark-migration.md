---
title: Migrate to Azure Managed Instance for Apache Cassandra using Apache Spark
description: Learn how to migrate to Azure Managed Instance for Apache Cassandra using Apache Spark.
author: TheovanKraay
ms.author: thvankra
ms.service: managed-instance-apache-cassandra
ms.topic: overview
ms.date: 06/02/2021
---

# Migrate to Azure Managed Instance for Apache Cassandra using Apache Spark

> [!IMPORTANT]
> Azure Managed Instance for Apache Cassandra is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Where possible, we recommend using Apache Cassandra native capability to migrate data from your existing cluster into Azure Managed Instance for Apache Cassandra by configuring a [hybrid cluster](configure-hybrid-cluster.md). This will use Apache Cassandra's gossip protocol to replicate data from your source data-center into your new managed instance datacenter in a seamless way. However, there may be some scenarios where your source database version is not compatible, or a hybrid cluster setup is otherwise not feasible. This article describes how to migrate data to Migrate to Azure Managed Instance for Apache Cassandra in an offline fashion using the Cassandra Spark Connector, and Azure Databricks for Apache Spark.

## Prerequisites

* Provision an Azure Managed Instance for Apache Cassandra cluster using [Azure Portal](create-cluster-portal.md) or [Azure CLI](create-cluster-cli.md) and ensure you can [connect to your cluster with CQLSH](/azure/managed-instance-apache-cassandra/create-cluster-portal#connecting-to-your-cluster).

* [Provision an Azure Databricks account inside your Managed Cassandra VNet](deploy-cluster-databricks.md). Ensure it also has network access to your source Cassandra cluster.

* Ensure you've already migrated the keyspace/table scheme from your source Cassandra database to your target Cassandra Managed Instance database.


## Provision an Azure Databricks cluster

We recommend selecting Databricks runtime version 7.5, which supports Spark 3.0.

:::image type="content" source="../cosmos-db/media/cassandra-migrate-cosmos-db-databricks/databricks-runtime.png" alt-text="Screenshot that shows finding the Databricks runtime version.":::

## Add dependencies

You need to add the Apache Spark Cassandra Connector library to your cluster to connect to both native and Azure Cosmos DB Cassandra endpoints. In your cluster, select **Libraries** > **Install New** > **Maven**, and then add `com.datastax.spark:spark-cassandra-connector-assembly_2.12:3.0.0` in Maven coordinates.

:::image type="content" source="../cosmos-db/media/cassandra-migrate-cosmos-db-databricks/databricks-search-packages.png" alt-text="Screenshot that shows searching for Maven packages in Databricks.":::

Select **Install**, and then restart the cluster when installation is complete.

> [!NOTE]
> Make sure that you restart the Databricks cluster after the Cassandra Connector library has been installed.

## Create Scala Notebook for migration

Create a Scala Notebook in Databricks. Replace your source and target Cassandra configurations with the corresponding credentials, and source and target keyspaces and tables. Then run the following code:

```scala
import com.datastax.spark.connector._
import com.datastax.spark.connector.cql._
import org.apache.spark.SparkContext

// source cassandra configs
val sourceCassandra = Map( 
    "spark.cassandra.connection.host" -> "<Source Cassandra Host>",
    "spark.cassandra.connection.port" -> "9042",
    "spark.cassandra.auth.username" -> "<USERNAME>",
    "spark.cassandra.auth.password" -> "<PASSWORD>",
    "spark.cassandra.connection.ssl.enabled" -> "false",
    "keyspace" -> "<KEYSPACE>",
    "table" -> "<TABLE>"
)

//target cassandra configs
val targetCassandra = Map( 
    "spark.cassandra.connection.host" -> "<Source Cassandra Host>",
    "spark.cassandra.connection.port" -> "9042",
    "spark.cassandra.auth.username" -> "<USERNAME>",
    "spark.cassandra.auth.password" -> "<PASSWORD>",
    "spark.cassandra.connection.ssl.enabled" -> "true",
    "keyspace" -> "<KEYSPACE>",
    "table" -> "<TABLE>",
    //throughput related settings below - tweak these depending on data volumes. 
    "spark.cassandra.output.batch.size.rows"-> "1",
    "spark.cassandra.output.concurrent.writes" -> "1000",
    "spark.cassandra.connection.remoteConnectionsPerExecutor" -> "10",
    "spark.cassandra.concurrent.reads" -> "512",
    "spark.cassandra.output.batch.grouping.buffer.size" -> "1000",
    "spark.cassandra.connection.keep_alive_ms" -> "600000000"
)

//Read from native Cassandra
val DFfromSourceCassandra = sqlContext
  .read
  .format("org.apache.spark.sql.cassandra")
  .options(sourceCassandra)
  .load
  
//Write to CosmosCassandra
DFfromSourceCassandra
  .write
  .format("org.apache.spark.sql.cassandra")
  .options(targetCassandra)
  .mode(SaveMode.Append) // only required for Spark 3.x
  .save
```

## Troubleshoot

### Rate limiting (429 error)

You might see a 429 error code or "request rate is large" error text even if you reduced settings to their minimum values. The following scenarios can cause rate limiting:

* **Throughput allocated to the table is less than 6,000 [request units](./request-units.md)**. Even at minimum settings, Spark can write at a rate of around 6,000 request units or more. If you have provisioned a table in a keyspace with shared throughput, it's possible that this table has fewer than 6,000 RUs available at runtime.

    Ensure that the table you are migrating to has at least 6,000 RUs available when you run the migration. If necessary, allocate dedicated request units to that table.

* **Excessive data skew with large data volume**. If you have a large amount of data to migrate into a given table but have a significant skew in the data (that is, a large number of records being written for the same partition key value), then you might still experience rate limiting even if you have several [request units](./request-units.md) provisioned in your table. Request units are divided equally among physical partitions, and heavy data skew can cause a bottleneck of requests to a single partition.

    In this scenario, reduce to minimal throughput settings in Spark and force the migration to run slowly. This scenario can be more common when you're migrating reference or control tables, where access is less frequent and skew can be high. However, if a significant skew is present in any other type of table, you might want to review your data model to avoid hot partition issues for your workload during steady-state operations.

## Next steps

* [Provision throughput on containers and databases](set-throughput.md)
* [Partition key best practices](partitioning-overview.md#choose-partitionkey)
* [Estimate RU/s using the Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)
* [Elastic Scale in Azure Cosmos DB Cassandra API](manage-scale-cassandra.md)
