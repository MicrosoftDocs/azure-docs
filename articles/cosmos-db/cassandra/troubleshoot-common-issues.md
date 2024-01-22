---
title: Troubleshoot common errors in the Azure Cosmos DB for Apache Cassandra
description: This article discusses common issues in the Azure Cosmos DB for Apache Cassandra and how to troubleshoot them.
author: TheovanKraay
ms.service: cosmos-db
ms.subservice: mongodb
ms.topic: troubleshooting
ms.date: 03/02/2021
ms.author: thvankra
ms.devlang: java
ms.custom: ignite-2022, devx-track-extended-java
---

# Troubleshoot common issues in the Azure Cosmos DB for Apache Cassandra

[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

The API for Cassandra in [Azure Cosmos DB](../introduction.md) is a compatibility layer that provides [wire protocol support](support.md) for the open-source Apache Cassandra database.

This article describes common errors and solutions for applications that use the Azure Cosmos DB for Apache Cassandra. If your error isn't listed and you experience an error when you execute a [supported operation in Cassandra](support.md), but the error isn't present when using native Apache Cassandra, [create an Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md).

>[!NOTE]
>As a fully managed cloud-native service, Azure Cosmos DB provides [guarantees on availability, throughput, and consistency](https://azure.microsoft.com/support/legal/sla/cosmos-db/v1_3/) for the API for Cassandra. The API for Cassandra also facilitates zero-maintenance platform operations and zero-downtime patching.
>
>These guarantees aren't possible in previous implementations of Apache Cassandra, so many of the API for Cassandra back-end operations differ from Apache Cassandra. We recommend particular settings and approaches to help avoid common errors.

## NoNodeAvailableException

This error is a top-level wrapper exception with a large number of possible causes and inner exceptions, many of which can be client related.

Common causes and solutions:

- **Idle timeout of Azure LoadBalancers**: This issue might also manifest as `ClosedConnectionException`. To resolve the issue, set the keep-alive setting in the driver (see [Enable keep-alive for the Java driver](#enable-keep-alive-for-the-java-driver)) and increase keep-alive settings in your operating system, or [adjust idle timeout in Azure Load Balancer](../../load-balancer/load-balancer-tcp-idle-timeout.md?tabs=tcp-reset-idle-portal).

- **Client application resource exhaustion**: Ensure that client machines have sufficient resources to complete the request.

## Can't connect to a host

You might see this error: "Cannot connect to any host, scheduling retry in 600000 milliseconds."

This error might be caused by source network address translation (SNAT) exhaustion on the client side. Follow the steps at [SNAT for outbound connections](../../load-balancer/load-balancer-outbound-connections.md) to rule out this issue.

The error might also be an idle timeout issue where the Azure load balancer has four minutes of idle timeout by default. See [Load balancer idle timeout](../../load-balancer/load-balancer-tcp-idle-timeout.md?tabs=tcp-reset-idle-portal). [Enable keep-alive for the Java driver](#enable-keep-alive-for-the-java-driver) and set the `keepAlive` interval on the operating system to less than four minutes.

See [troubleshoot NoHostAvailableException](troubleshoot-nohostavailable-exception.md) for more ways of handling the exception.

## OverloadedException (Java)

Requests are throttled because the total number of request units consumed is higher than the number of request units that you provisioned on the keyspace or table.

Consider scaling the throughput assigned to a keyspace or table from the Azure portal (see [Elastically scale an Azure Cosmos DB for Apache Cassandra account](scale-account-throughput.md)) or implementing a retry policy.

For Java, see retry samples for the [v3.x driver](https://github.com/Azure-Samples/azure-cosmos-cassandra-java-retry-sample) and the [v4.x driver](https://github.com/Azure-Samples/azure-cosmos-cassandra-java-retry-sample-v4). See also [Azure Cosmos DB Cassandra Extensions for Java](https://github.com/Azure/azure-cosmos-cassandra-extensions).

### OverloadedException despite sufficient throughput

The system seems to be throttling requests even though enough throughput is provisioned for request volume or consumed request unit cost. There are two possible causes:

- **Schema level operations**: The API for Cassandra implements a system throughput budget for schema-level operations (CREATE TABLE, ALTER TABLE, DROP TABLE). This budget should be enough for schema operations in a production system. However, if you have a high number of schema-level operations, you might exceed this limit.

  Because the budget isn't user-controlled, consider lowering the number of schema operations that you run. If that action doesn't resolve the issue or it isn't feasible for your workload, [create an Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md).

- **Data skew**: When throughput is provisioned in the API for Cassandra, it's divided equally between physical partitions, and each physical partition has an upper limit. If you have a high amount of data being inserted or queried from one particular partition, it might be rate-limited even if you provision a large amount of overall throughput (request units) for that table.

  Review your data model and ensure you don't have excessive skew that might cause hot partitions.

## Intermittent connectivity errors (Java)

Connection drops or times out unexpectedly.

The Apache Cassandra drivers for Java provide two native reconnection policies: `ExponentialReconnectionPolicy` and `ConstantReconnectionPolicy`. The default is `ExponentialReconnectionPolicy`. However, for Azure Cosmos DB for Apache Cassandra, we recommend `ConstantReconnectionPolicy` with a two-second delay.

See the [documentation for the Java 4.x driver](https://docs.datastax.com/en/developer/java-driver/4.9/manual/core/reconnection/), the [documentation for the Java 3.x driver](https://docs.datastax.com/en/developer/java-driver/3.7/manual/reconnection/), or [Configuring ReconnectionPolicy for the Java driver](#configure-reconnectionpolicy-for-the-java-driver) examples.

## Error with load-balancing policy

You might have implemented a load-balancing policy in v3.x of the Java DataStax driver, with code similar to:

```java
cluster = Cluster.builder()
        .addContactPoint(cassandraHost)
        .withPort(cassandraPort)
        .withCredentials(cassandraUsername, cassandraPassword)
        .withPoolingOptions(new PoolingOptions() .setConnectionsPerHost(HostDistance.LOCAL, 1, 2)
                .setMaxRequestsPerConnection(HostDistance.LOCAL, 32000).setMaxQueueSize(Integer.MAX_VALUE))
        .withSSL(sslOptions)
        .withLoadBalancingPolicy(DCAwareRoundRobinPolicy.builder().withLocalDc("West US").build())
        .withQueryOptions(new QueryOptions().setConsistencyLevel(ConsistencyLevel.LOCAL_QUORUM))
        .withSocketOptions(getSocketOptions())
        .build();
```

If the value for `withLocalDc()` doesn't match the contact point datacenter, you might experience an intermittent error: `com.datastax.driver.core.exceptions.NoHostAvailableException: All host(s) tried for query failed (no host was tried)`.

Implement the [CosmosLoadBalancingPolicy](https://github.com/Azure/azure-cosmos-cassandra-extensions/blob/master/driver-3/src/main/java/com/azure/cosmos/cassandra/CosmosLoadBalancingPolicy.java). To make it work, you might need to upgrade DataStax by using the following code:

```java
LoadBalancingPolicy loadBalancingPolicy = new CosmosLoadBalancingPolicy.Builder().withWriteDC("West US").withReadDC("West US").build();
```

## The count fails on a large table

When you run `select count(*) from table` or similar for a large number of rows, the server times out.

If you're using a local CQLSH client, change the `--connect-timeout` or `--request-timeout` settings. See [cqlsh: the CQL shell](https://cassandra.apache.org/doc/latest/cassandra/tools/cqlsh.html).

If the count still times out, you can get a count of records from the Azure Cosmos DB back-end telemetry by going to the metrics tab in the Azure portal, selecting the metric `document count`, and then adding a filter for the database or collection (the analog of the table in Azure Cosmos DB). You can then hover over the resulting graph for the point in time at which you want a count of the number of records.

:::image type="content" source="./media/troubleshoot-common-issues/metrics.png" alt-text="metrics view":::

## Configure ReconnectionPolicy for the Java driver

### Version 3.x

For version 3.x of the Java driver, configure the reconnection policy when you create a cluster object:

```java
import com.datastax.driver.core.policies.ConstantReconnectionPolicy;

Cluster.builder()
  .withReconnectionPolicy(new ConstantReconnectionPolicy(2000))
  .build();
```

### Version 4.x

For version 4.x of the Java driver, configure the reconnection policy by overriding settings in the `reference.conf` file:

```xml
datastax-java-driver {
  advanced {
    reconnection-policy{
      # The driver provides two implementations out of the box: ExponentialReconnectionPolicy and
      # ConstantReconnectionPolicy. We recommend ConstantReconnectionPolicy for API for Cassandra, with 
      # base-delay of 2 seconds.
      class = ConstantReconnectionPolicy
      base-delay = 2 second
    }
}
```

## Enable keep-alive for the Java driver

### Version 3.x

For version 3.x of the Java driver, set keep-alive when you create a cluster object, and then ensure that keep-alive is [enabled in the operating system](https://knowledgebase.progress.com/articles/Article/configure-OS-TCP-KEEPALIVE-000080089):

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

For version 4.x of the Java driver, set keep-alive by overriding settings in `reference.conf`, and then ensure that keep-alive is [enabled in the operating system](https://knowledgebase.progress.com/articles/Article/configure-OS-TCP-KEEPALIVE-000080089):

```xml
datastax-java-driver {
  advanced {
    socket{
      keep-alive = true
    }
}
```

## Next steps

- Learn about [supported features](support.md) in the Azure Cosmos DB for Apache Cassandra.
- Learn how to [migrate from native Apache Cassandra to Azure Cosmos DB for Apache Cassandra](migrate-data-databricks.md).
