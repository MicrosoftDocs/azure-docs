---
title: Live migrate to Azure Managed Instance for Apache Cassandra using Apache Spark and a dual-write proxy.
description: Learn how to migrate to Azure Managed Instance for Apache Cassandra using Apache Spark and a dual-write proxy.
author: TheovanKraay
ms.author: thvankra
ms.service: managed-instance-apache-cassandra
ms.topic: overview
ms.date: 06/02/2021
---

# Live migration to Azure Managed Instance for Apache Cassandra using dual-write proxy

> [!IMPORTANT]
> Azure Managed Instance for Apache Cassandra is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Where possible, we recommend using Apache Cassandra native capability to migrate data from your existing cluster into Azure Managed Instance for Apache Cassandra by configuring a [hybrid cluster](configure-hybrid-cluster.md). This will use Apache Cassandra's gossip protocol to replicate data from your source data-center into your new managed instance datacenter in a seamless way. However, there may be some scenarios where your source database version is not compatible, or a hybrid cluster setup is otherwise not feasible. This article describes how to migrate data to Azure Managed Instance for Apache Cassandra in a live fashion using a [dual-write proxy](https://github.com/Azure-Samples/cassandra-proxy) and Apache Spark. The benefits of this approach are:

- **minimal application changes** - the proxy can accept connections from your application code with little or no configuration changes, and will route all requests to your source database, and asynchronously route writes to a secondary target. 
- **client wire protocol dependent** - since this approach is not dependent on backend resources or internal protocols, it can be used with any source or target Cassandra system that implements the Apache Cassandra wire protocol.

The image below illustrates the approach.


:::image type="content" source="./media/migration/live-migration.gif" alt-text="Azure Managed Instance for Apache Cassandra is a managed service for Apache Cassandra." border="false":::

## Prerequisites

* Provision an Azure Managed Instance for Apache Cassandra cluster using [Azure portal](create-cluster-portal.md) or [Azure CLI](create-cluster-cli.md) and ensure you can [connect to your cluster with CQLSH](./create-cluster-portal.md#connecting-to-your-cluster).

* [Provision an Azure Databricks account inside your Managed Cassandra VNet](deploy-cluster-databricks.md). Ensure it also has network access to your source Cassandra cluster. We will create a Spark cluster in this account for the historic data load.

* Ensure you've already migrated the keyspace/table scheme from your source Cassandra database to your target Cassandra Managed Instance database.


## Provision a Spark cluster

We recommend selecting Azure Databricks runtime version 7.5, which supports Spark 3.0.

:::image type="content" source="../cosmos-db/media/cassandra-migrate-cosmos-db-databricks/databricks-runtime.png" alt-text="Screenshot that shows finding the Databricks runtime version.":::

## Add Spark dependencies

You need to add the Apache Spark Cassandra Connector library to your cluster to connect to both native and Azure Cosmos DB Cassandra endpoints. In your cluster, select **Libraries** > **Install New** > **Maven**, and then add `com.datastax.spark:spark-cassandra-connector-assembly_2.12:3.0.0` in Maven coordinates.

:::image type="content" source="../cosmos-db/media/cassandra-migrate-cosmos-db-databricks/databricks-search-packages.png" alt-text="Screenshot that shows searching for Maven packages in Databricks.":::

Select **Install**, and then restart the cluster when installation is complete.

> [!NOTE]
> Make sure that you restart the Databricks cluster after the Cassandra Connector library has been installed.

## Install Dual-write proxy

For optimal performance during dual writes, we recommend installing the proxy on all nodes in your source Cassandra cluster.

```bash
#assuming you do not have git already installed
sudo apt-get install git 

#assuming you do not have maven already installed
sudo apt install maven

#clone repo for dual-write proxy
git clone https://github.com/Azure-Samples/cassandra-proxy.git

#change directory
cd cassandra-proxy

#compile the proxy
mvn package
```

## Start Dual-write proxy

It is recommended that you install the proxy on all nodes in your source Cassandra cluster. At minimum, you need to run the following command in order to start the proxy on each node. Replace `<target-server>` with an IP or server address from one of the nodes in the target cluster. Replace `<path to JKS file>` with path to a local jks file, and `<keystore password>` with the corresponding password:  

```bash
java -jar target/cassandra-proxy-1.0-SNAPSHOT-fat.jar localhost <target-server> --proxy-jks-file <path to JKS file> --proxy-jks-password <keystore password>
```

Starting the proxy in this way assumes the following are true:

- source and target endpoints have the same username and password
- source and target endpoints implement SSL

If your source and target endpoints cannot meet these criteria, read below for further configuration options. 

### Configure SSL

For SSL, you can either implement an existing keystore (for example the one used by your source cluster), or you can create self-signed certificate using keytool:

```bash
keytool -genkey -keyalg RSA -alias selfsigned -keystore keystore.jks -storepass password -validity 360 -keysize 2048
```
You can also disable SSL for source or target endpoints if they do not implement SSL. Use the `--disable-source-tls` or `--disable-target-tls` flags:

```bash
java -jar target/cassandra-proxy-1.0-SNAPSHOT-fat.jar localhost <target-server> --source-port 9042 --target-port 10350 --proxy-jks-file <path to JKS file> --proxy-jks-password <keystore password> --target-username <username> --target-password <password> --disable-source-tls true  --disable-target-tls true 
```

> [!NOTE]
> Make sure your client application uses the same keystore and password as the one used for the dual-write proxy when building SSL connections to the database via the proxy.


### Configure credentials and port

By default, the source credentials will be passed through from your client app, and used by the proxy for making connections to the source and target clusters. As mentioned above, this assumes that source and target credentials are the same. If necessary, you can specify a different username and password for the target Cassandra endpoint separately when starting the proxy:

```bash
java -jar target/cassandra-proxy-1.0-SNAPSHOT-fat.jar localhost <target-server> --proxy-jks-file <path to JKS file> --proxy-jks-password <keystore password> --target-username <username> --target-password <password>
```

The default source and target ports, when not specified, will be `9042`. If either the target or source Cassandra endpoints run on a different port, you can use `--source-port` or `--target-port` to specify a different port number. 

```bash
java -jar target/cassandra-proxy-1.0-SNAPSHOT-fat.jar localhost <target-server> --source-port 9042 --target-port 10350 --proxy-jks-file <path to JKS file> --proxy-jks-password <keystore password> --target-username <username> --target-password <password>
```

### Deploy proxy remotely

There may be circumstances in which you do not want to install the proxy on the cluster nodes themselves, and prefer to install it on a separate machine. In that scenario, you would need need to specify the IP of the `<source-server>`:

```bash
java -jar target/cassandra-proxy-1.0-SNAPSHOT-fat.jar <source-server> <destination-server>
```

> [!NOTE]
> If you do not install and run the proxy on all nodes in a native Apache Cassandra cluster, this will impact performance in your application as the client driver will no be able to open connections to all nodes within the cluster. 

### Allow zero application code changes

By default, the proxy listens on port `29042`. This requires the application code to be changed to point to this port. However, you can also change the port the proxy listens on. You may wish to do this if you want to eliminate application level code changes by having the source Cassandra server run on a different port, and have the proxy run on the standard Cassandra port `9042`:

```bash
java -jar target/cassandra-proxy-1.0-SNAPSHOT-fat.jar source-server destination-server --proxy-port 9042
```

> [!NOTE]
> Installing the proxy on cluster nodes does not require restart of the nodes. However, if you have many application clients and prefer to have the proxy running on the standard Cassandra port `9042` in order to eliminate any application level code changes, you would need to change the [Apache Cassandra default port](https://cassandra.apache.org/doc/latest/faq/#what-ports-does-cassandra-use). You would then need to restart the nodes in your cluster, and configure the source port to be the new port you have defined for your source Cassandra cluster. In the below example, we change the source Cassandra cluster to run on port 3074, and start the cluster on port 9042.
>```bash
>java -jar target/cassandra-proxy-1.0-SNAPSHOT-fat.jar source-server destination-server --proxy-port 9042 --source-port 3074
>``` 

### Force protocols

The proxy has functionality to force protocols which may be necessary if the source endpoint is more advanced then the target, or otherwise unsupported. In that case you can specify `--protocol-version` and `--cql-version` to force protocol to comply with the target:

```bash
java -jar target/cassandra-proxy-1.0-SNAPSHOT-fat.jar source-server destination-server --protocol-version 4 --cql-version 3.11
```

Once you have the dual-write proxy up and running, then you will need to change port on your application client and restart (or change Cassandra port and restart cluster if you have chosen this approach). The proxy will then start forwarding writes to the target endpoint. You can learn about [monitoring and metrics](https://github.com/Azure-Samples/cassandra-proxy#monitoring) available in the proxy tool. 


## Run the historic data load.

To load the data, create a Scala notebook in your Databricks account. Replace your source and target Cassandra configurations with the corresponding credentials, and source and target keyspaces and tables. Add more variables for each table as required to the below sample, then run. After your application has started sending requests to the dual-write proxy, you are ready to migrate historic data. 

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
    "spark.cassandra.connection.ssl.enabled" -> "true",
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
    "spark.cassandra.connection.remoteConnectionsPerExecutor" -> "1",
    "spark.cassandra.concurrent.reads" -> "512",
    "spark.cassandra.output.batch.grouping.buffer.size" -> "1000",
    "spark.cassandra.connection.keep_alive_ms" -> "600000000"
)

//set timestamp to ensure it is before read job starts
val timestamp: Long = System.currentTimeMillis / 1000

//Read from source Cassandra
val DFfromSourceCassandra = sqlContext
  .read
  .format("org.apache.spark.sql.cassandra")
  .options(sourceCassandra)
  .load
  
//Write to target Cassandra
DFfromSourceCassandra
  .write
  .format("org.apache.spark.sql.cassandra")
  .options(targetCassandra)
  .option("writetime", timestamp)
  .mode(SaveMode.Append)
  .save
```

> [!NOTE]
> In the above Scala sample, you will notice that `timestamp` is being set to the current time prior to reading all the data in the source table, and then `writetime` is being set to this backdated timestamp. This is to ensure that records that are written from the historic data load to the target endpoint cannot overwrite updates that come in with a later timestamp from the dual-write proxy while historic data is being read. If for any reason you need to preserve *exact* timestamps, you should take a historic data migration approach which preserves timestamps, such as [this](https://github.com/scylladb/scylla-migrator) sample. 

## Validation

Once the historic data load is complete, your databases should be in sync and ready for cutover. However, it is recommended that you carry out a validation of source and target to ensure that request results match before finally cutting over.


## Next steps

> [!div class="nextstepaction"]
> [Manage Azure Managed Instance for Apache Cassandra resources using Azure CLI](manage-resources-cli.md)