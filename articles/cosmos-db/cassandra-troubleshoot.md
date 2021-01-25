---
title: Troubleshoot common errors in Azure Cosmos DB Cassandra API
description: This doc discusses the ways to troubleshoot common issues found in Azure Cosmos DB Cassandra API
author: TheovanKraay
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: troubleshooting
ms.date: 12/01/2020
ms.author: thvankra

---

# Troubleshoot common issues in Azure Cosmos DB Cassandra API
[!INCLUDE[appliesto-cassandra-api](includes/appliesto-cassandra-api.md)]

Cassandra API in Azure Cosmos DB is a compatibility layer, which provides [wire protocol support](cassandra-support.md) for the popular open-source Apache Cassandra database, and is powered by [Azure Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/introduction). As a fully managed cloud-native service, Azure Cosmos DB provides [guarantees on availability, throughput, and consistency](https://azure.microsoft.com/support/legal/sla/cosmos-db/v1_3/) for Cassandra API. These guarantees are not possible in legacy implementations of Apache Cassandra. Cassandra API also facilitates zero-maintenance platform operations, and zero-downtime patching. As such, many of it's backend operations are different from Apache Cassandra, so we recommend particular settings and approaches to avoid common errors. 

This article describes common errors and solutions for applications consuming Azure Cosmos DB Cassandra API. If your error is not listed below, and you are experiencing an error when executing a [supported operation in Cassandra API](cassandra-support.md), where the error is *not present when using native Apache Cassandra*, [create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md).

## NoNodeAvailableException
This is a top-level wrapper exception with a large number of possible causes and inner exceptions, many of which can be client-related. 
### Solution
Some popular causes and solutions are as follows: 
- Idle timeout of Azure LoadBalancers: This may also manifest as `ClosedConnectionException`. To resolve this, set keep alive setting in driver (see [below](#enable-keep-alive-for-java-driver)) and increase keep-alive settings in operating system, or [adjust idle timeout in Azure Load Balancer](../load-balancer/load-balancer-tcp-idle-timeout.md?tabs=tcp-reset-idle-portal). 
- Client application resource exhaustion: ensure that client machines have sufficient resources to complete the request.

## OverloadedException (Java)
The total number of request units consumed is more than the request-units provisioned on the keyspace or table. So the requests are throttled.
### Solution
Consider scaling the throughput assigned to a keyspace or table from the Azure portal (see [here](manage-scale-cassandra.md) for scaling operations in Cassandra API) or you can implement a retry policy. For Java, see retry samples for [v3.x driver](https://github.com/Azure-Samples/azure-cosmos-cassandra-java-retry-sample) and [v4.x driver](https://github.com/Azure-Samples/azure-cosmos-cassandra-java-retry-sample-v4). See also [Azure Cosmos Cassandra Extensions for Java](https://github.com/Azure/azure-cosmos-cassandra-extensions).

### OverloadedException even with sufficient throughput 
The system appears to be throttling requests despite sufficient throughput being provisioned for request volume and/or consumed request unit cost. There are two possible causes of unexpected rate limiting:
- Schema level operations: Cassandra API implements a system throughput budget for schema-level operations (CREATE TABLE, ALTER TABLE, DROP TABLE). This budget should be enough for schema operations in a production system. However, if you have a high number of schema-level operations, it is possible you are exceeding this limit. As this budget is not user controlled, you will need to consider lowering the number of schema operations being run. If taking this action does not resolve the issue, or it is not feasible for your workload, [create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md).
- Data skew: when throughput is provisioned in Cassandra API, it is divided equally among physical partitions, and each phsyical partition has an upper limit. If you have a high amount of data being inserted, or read from, one particular partition, it is possible to be rate limited despite provisioning a large amount of overall throughput (request units) for that table. Review your data model and ensure you do not have excessive skew that could be causing hot partitions. 

## Intermittent connectivity errors (Java) 
Connection drops or times out unexpectedly.

### Solution 
The Apache Cassandra drivers for Java provide two native reconnection policies: `ExponentialReconnectionPolicy` and `ConstantReconnectionPolicy`. The default is `ExponentialReconnectionPolicy`. However, for Azure Cosmos DB Cassandra API, we recommend `ConstantReconnectionPolicy` with a delay of 2 seconds. See the [driver documentation](https://docs.datastax.com/en/developer/java-driver/4.9/manual/core/reconnection/)  for Java v4.x driver, and [here](https://docs.datastax.com/en/developer/java-driver/3.7/manual/reconnection/) for Java 3.x guidance see also [Configuring ReconnectionPolicy for Java Driver](#configuring-reconnectionpolicy-for-java-driver) examples below.

## Count fails on large table
When running `select count(*) from table` or similar for a large number of rows, the server times out.

### Solution 
If using a local CQLSH client you can try to change the `--connect-timeout` or `--request-timeout` settings (see more details [here](https://cassandra.apache.org/doc/latest/tools/cqlsh.html)). If this is not sufficient and count still times out, you can get a count of records from the Azure Cosmos DB backend telemetry by going to metrics tab in Azure portal, selecting the metric `document count`, then adding a filter for the database or collection (the analogue of table in Azure Cosmos DB). You can then hover over the resulting graph for the point in time at which you want a count of the number of records.

:::image type="content" source="./media/cassandra-troubleshoot/metrics.png" alt-text="metrics view":::


## Configuring ReconnectionPolicy for Java Driver

### Version 3.x

For version 3.x of the Java driver, configure the reconnection policy when creating a cluster object:

```java
import com.datastax.driver.core.policies.ConstantReconnectionPolicy;

Cluster.builder()
  .withReconnectionPolicy(new ConstantReconnectionPolicy(2000))
  .build();
```

### Version 4.x

For version 4.x of the Java driver, configure the reconnection policy by overriding settings in `reference.conf` file:

```xml
datastax-java-driver {
  advanced {
    reconnection-policy{
      # The driver provides two implementations out of the box: ExponentialReconnectionPolicy and
      # ConstantReconnectionPolicy. We recommend ConstantReconnectionPolicy for Cassandra API, with 
      # base-delay of 2 seconds.
      class = ConstantReconnectionPolicy
      base-delay = 2 second
    }
}
```

## Enable keep-alive for Java Driver

### Version 3.x

For version 3.x of the Java driver, set keep-alive when creating a Cluster object, and ensure keep-alive is [enabled in the operating system](https://knowledgebase.progress.com/articles/Article/configure-OS-TCP-KEEPALIVE-000080089):

```java
import java.net.SocketOptions;
    
SocketOptions options = new SocketOptions();
options.setKeepAlive(true);
cluster = Cluster.builder().addContactPoints(contactPoints).withPort(port)
  .withCredentials(cassandraUsername, cassandraPassword)
  .withSocketOptions(options)
  .build();
```

### Version 4.x

For version 4.x of the Java driver, set keep-alive by overriding settings in `reference.conf` and ensure keep-alive is [enabled in the operating system](https://knowledgebase.progress.com/articles/Article/configure-OS-TCP-KEEPALIVE-000080089):

```xml
datastax-java-driver {
  advanced {
    socket{
      keep-alive = true
    }
}
```

## Next steps

- Learn about the [supported features](cassandra-support.md) in Azure Cosmos DB Cassandra API.
- Learn how to [migrate from native Apache Cassandra to Azure Cosmos DB Cassandra API](cassandra-migrate-cosmos-db-databricks.md)

