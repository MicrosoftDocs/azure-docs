---
title: Troubleshoot NoHostAvailableException and NoNodeAvailableException
description: This article discusses the various reasons for having a NoHostException and ways to handle it.
author: IriaOsara
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.topic: troubleshooting
ms.date: 12/02/2021
ms.author: IriaOsara
ms.devlang: csharp, java
ms.custom: ignite-2022
---

# Troubleshoot NoHostAvailableException and NoNodeAvailableException
NoHostAvailableException is a top-level wrapper exception with many possible causes and inner exceptions, many of which can be client-related. This exception tends to occur if there are some issues with the cluster or connection settings, or if one or more Cassandra nodes are unavailable.

This article explores possible reasons for this exception, and it discusses specific details about the client driver that's being used.

## Driver settings
One of the most common causes of NoHostAvailableException is the default driver settings. We recommend that you use the [settings](#code-sample) listed at the end of this article. Here is some explanatory information:

- The default value of the connections per host is 1, which we don't recommend for Azure Cosmos DB. We do recommend a minimum value of 10. Although more aggregated Request Units (RU) are provided, increase the connection count. The general guideline is 10 connections per 200,000 RU.
- Use the Azure Cosmos DB retry policy to handle intermittent throttling responses. For more information, see the Azure Cosmos DB extension libraries:
   - [Driver 3 extension library](https://github.com/Azure/azure-cosmos-cassandra-extensions)
   - [Driver 4 extension library](https://github.com/Azure/azure-cosmos-cassandra-extensions/tree/release/java-driver-4/1.0.1)
- For multi-region accounts, use the Azure Cosmos DB load-balancing policy in the extension.
- The read request timeout should be set at greater than 1 minute. We recommend 90 seconds.

## Exception messages
If the exception persists after you've made the recommended changes, review the exception messages in the next three sections. If your error log contains any of these exception messages, follow the recommendation for that exception.

### BusyPoolException
This client-side error indicates that the maximum number of request connections for a host has been reached. If you're unable to remove the request from the queue, you might see this error. If the connection per host has been set to minimum of 10, the exception could be caused by high server-side latency.

```
Java driver v3 exception:
All host(s) tried for query failed (tried: :10350 (com.datastax.driver.core.exceptions.BusyPoolException: [:10350] Pool is busy (no available connection and the queue has reached its max size 256)))
All host(s) tried for query failed (tried: :10350 (com.datastax.driver.core.exceptions.BusyPoolException: [:10350] Pool is busy (no available connection and timed out after 5000 MILLISECONDS)))
```
```dotnetcli
C# driver 3:
All hosts tried for query failed (tried :10350: BusyPoolException 'All connections to host :10350 are busy, 2048 requests are in-flight on each 10 connection(s)')
```
#### Recommendation
Instead of tuning `max requests per connection`, make sure that `connections per host` is set to a minimum of 10. See the [code sample section](#code-sample).

### TooManyRequest(429)
OverloadException is thrown when the request rate is too great, which might happen when insufficient throughput is provisioned for the table and the RU budget is exceeded. For more information, see [large request](../sql/troubleshoot-request-rate-too-large.md#request-rate-is-large) and [server-side retry](prevent-rate-limiting-errors.md).
#### Recommendation
Apply one of the following options:
- If throttling is persistent, increase the provisioned RU.
- If throttling is intermittent, use the Azure Cosmos DB retry policy.
- If the extension library can't be referenced, [enable server-side retry](prevent-rate-limiting-errors.md).

### All hosts tried for query failed
When the client is set to connect to a region other than the primary contact point region, during the initial few seconds at startup, you'll get one of the following exception messages:

- For Java driver 3: `Exception in thread "main" com.datastax.driver.core.exceptions.NoHostAvailableException: All host(s) tried for query failed (no host was tried)at cassandra.driver.core@3.10.2/com.datastax.driver.core.exceptions.NoHostAvailableException.copy(NoHostAvailableException.java:83)`

- For Java driver 4: `No node was available to execute the query`

- For C# driver 3: `System.ArgumentException: Datacenter West US does not match any of the nodes, available datacenters: West US 2`

#### Recommendation
Use CosmosLoadBalancingPolicy in [Java driver 3](https://github.com/Azure/azure-cosmos-cassandra-extensions) and [Java driver 4](https://github.com/Azure/azure-cosmos-cassandra-extensions/tree/release/java-driver-4/1.0.1). This policy falls back to the contact point of the primary write region where the specified local data is unavailable.

> [!NOTE]
> If the preceding recommendations don't help resolve your issue, contact Azure Cosmos DB support. Be sure to provide the following details: exception message, exception stacktrace, datastax driver log, universal time of failure, consistent or intermittent failures, failing keyspace and table, request type that failed, and SDK version.


## Code sample

#### Java driver 3 settings
``` java
   // socket options with default values
    // https://docs.datastax.com/en/developer/java-driver/3.6/manual/socket_options/
    SocketOptions socketOptions = new SocketOptions()
        .setReadTimeoutMillis(90000); // default 12000

    // connection pooling options (default values are 1s)
    // https://docs.datastax.com/en/developer/java-driver/3.6/manual/pooling/
    PoolingOptions poolingOptions = new PoolingOptions()
        .setCoreConnectionsPerHost(HostDistance.LOCAL, 10) // default 1
        .setMaxConnectionsPerHost(HostDistance.LOCAL, 10) // default 1
        .setCoreConnectionsPerHost(HostDistance.REMOTE, 10) // default 1
        .setMaxConnectionsPerHost(HostDistance.REMOTE, 10); //default 1

    // Azure Cosmos DB load balancing policy
    String Region = "West US";
    CosmosLoadBalancingPolicy cosmosLoadBalancingPolicy = CosmosLoadBalancingPolicy.builder()
        .withWriteDC(Region)
        .withReadDC(Region)
        .build();

    // Azure Cosmos DB retry policy
    CosmosRetryPolicy retryPolicy = CosmosRetryPolicy.builder()
        .withFixedBackOffTimeInMillis(5000)
        .withGrowingBackOffTimeInMillis(1000)
        .withMaxRetryCount(5)
        .build();

    Cluster cluster = Cluster.builder()
        .addContactPoint(EndPoint).withPort(10350)
        .withCredentials(UserName, Password)
        .withSSL(sslOptions)
        .withSocketOptions(socketOptions)
        .withPoolingOptions(poolingOptions)
        .withLoadBalancingPolicy(cosmosLoadBalancingPolicy)
        .withRetryPolicy(retryPolicy)
        .build();
```

#### Java driver 4 settings
```java
    // driver configurations
    // https://docs.datastax.com/en/developer/java-driver/4.6/manual/core/configuration/
    ProgrammaticDriverConfigLoaderBuilder configBuilder = DriverConfigLoader.programmaticBuilder();

    // connection settings
    // https://docs.datastax.com/en/developer/java-driver/4.6/manual/core/pooling/
    configBuilder
        .withInt(DefaultDriverOption.CONNECTION_POOL_LOCAL_SIZE, 10) // default 1
        .withInt(DefaultDriverOption.CONNECTION_POOL_REMOTE_SIZE, 10) // default 1
        .withDuration(DefaultDriverOption.REQUEST_TIMEOUT, Duration.ofSeconds(90)) // default 2
        .withClass(DefaultDriverOption.RECONNECTION_POLICY_CLASS, ConstantReconnectionPolicy.class) // default ExponentialReconnectionPolicy
        .withBoolean(DefaultDriverOption.METADATA_TOKEN_MAP_ENABLED, false); // default true

    // load balancing settings
    // https://docs.datastax.com/en/developer/java-driver/4.6/manual/core/load_balancing/
    String Region = "West US";
    List<String> preferredRegions = new ArrayList<String>();
    preferredRegions.add(Region);
    configBuilder
        .withClass(DefaultDriverOption.LOAD_BALANCING_POLICY_CLASS, CosmosLoadBalancingPolicy.class)
        .withBoolean(CosmosLoadBalancingPolicyOption.MULTI_REGION_WRITES, false)
        .withStringList(CosmosLoadBalancingPolicyOption.PREFERRED_REGIONS, preferredRegions);

    // retry policy
    // https://docs.datastax.com/en/developer/java-driver/4.6/manual/core/retries/
    configBuilder
        .withClass(DefaultDriverOption.RETRY_POLICY_CLASS, CosmosRetryPolicy.class)
        .withInt(CosmosRetryPolicyOption.FIXED_BACKOFF_TIME, 5000)
        .withInt(CosmosRetryPolicyOption.GROWING_BACKOFF_TIME, 1000)
        .withInt(CosmosRetryPolicyOption.MAX_RETRIES, 5);

    CqlSession session = CqlSession.builder()
        .withSslContext(sc)
        .addContactPoint(new InetSocketAddress(EndPoint, Port))
        .withAuthCredentials(UserName, Password)
        .withLocalDatacenter(Region)
        .withConfigLoader(configBuilder.build())
        .build();
```

#### C# v3 driver settings
```dotnetcli
    PoolingOptions poolingOptions = PoolingOptions.Create()
        .SetCoreConnectionsPerHost(HostDistance.Local, 10) // default 2
        .SetMaxConnectionsPerHost(HostDistance.Local, 10) // default 8
        .SetCoreConnectionsPerHost(HostDistance.Remote, 10) // default 1
        .SetMaxConnectionsPerHost(HostDistance.Remote, 10); // default 2

    SocketOptions socketOptions = new SocketOptions()
        .SetReadTimeoutMillis(90000); // default 12000

    buildCluster = Cluster.Builder()
        .AddContactPoint(Program.ContactPoint)
        .WithPort(Program.CosmosCassandraPort)
        .WithCredentials(Program.UserName, Program.Password)
        .WithPoolingOptions(poolingOptions)
        .WithSocketOptions(socketOptions)
        .WithReconnectionPolicy(new ConstantReconnectionPolicy(1000)) // default ExponentialReconnectionPolicy
        .WithSSL(sslOptions);
```

## Next steps
* To understand the various error codes and their meaning, see [Server-side diagnostics](error-codes-solution.md).
* See [Diagnose and troubleshoot issues with the Azure Cosmos DB .NET SDK](../nosql/troubleshoot-dotnet-sdk.md).
* Learn about performance guidelines for [.NET v3](../nosql/performance-tips-dotnet-sdk-v3.md) and [.NET v2](../nosql/performance-tips.md).
* See [Troubleshoot issues with the Azure Cosmos DB Java SDK v4 with API for NoSQL accounts](../nosql/troubleshoot-java-sdk-v4.md).
* See [Performance tips for the Azure Cosmos DB Java SDK v4](../nosql/performance-tips-java-sdk-v4.md).
