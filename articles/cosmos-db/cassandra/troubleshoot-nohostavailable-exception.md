---
title: Troubleshooting NoHostAvailableException and NoNodeAvailableException
description: This article discusses the different possible reasons for having a NoHostException and ways to handle it.
author: IriaOsara
ms.service: cosmos-db
ms.subservice: cosmosdb-cassandra
ms.topic: troubleshooting
ms.date: 12/02/2021
ms.author: IriaOsara
ms.devlang: csharp, java
---

# Troubleshooting NoHostAvailableException and NoNodeAvailableException
The NoHostAvailableException is a top-level wrapper exception with many possible causes and inner exceptions, many of which can be client-related. This exception tends to occur if there are some issues with cluster, connection settings or one or more Cassandra nodes is unavailable. Here we explore possible reasons for this exception along with details specific to the client driver being used.

## Driver Settings
One of the most common causes of a NoHostAvailableException is because of the default driver settings. We advised the following [settings](#code-sample).

- The default value of the connections per host is 1, which is not recommended for CosmosDB, a minimum value of 10 is advised. While more aggregated RUs are provisioned, increase connection count. The general guideline is 10 connections per 200k RU.
- Use cosmos retry policy to handle intermittent throttling responses, please reference [cosmosdb extension library](https://github.com/Azure/azure-cosmos-cassandra-extensions)(https://github.com/Azure/azure-cosmos-cassandra-extensions/tree/release/java-driver-4/1.0.1)
- For multi-region account, CosmosDB load-balancing policy in the extension should be used.
- Read request timeout should be set greater than 1 minute. We recommend 90 seconds.

## Exception Messages
If exception still persists after the recommended settings, review the exception messages below. Follow the recommendation, if your error log contains any of these messages.

### BusyPoolException
This client-side error indicates that the maximum number of request connections for a host has been reached. If unable to remove, request from the queue, you might see this error. If the connection per host has been set to minimum of 10, this could be caused by high server-side latency.

```
Java driver v3  exception:
All host(s) tried for query failed (tried: :10350 (com.datastax.driver.core.exceptions.BusyPoolException: [:10350] Pool is busy (no available connection and the queue has reached its max size 256)))
All host(s) tried for query failed (tried: :10350 (com.datastax.driver.core.exceptions.BusyPoolException: [:10350] Pool is busy (no available connection and timed out after 5000 MILLISECONDS)))
```
```dotnetcli
C# driver 3:
All hosts tried for query failed (tried :10350: BusyPoolException 'All connections to host :10350 are busy, 2048 requests are in-flight on each 10 connection(s)')
```
#### Recommendation
Instead of tuning the `max requests per connection`, we advise making sure the `connections per host` is set to a minimum of 10. See the [code sample section](#code-sample).

### TooManyRequest(429)
OverloadException is thrown when the request rate is too large. Which may be because of insufficient throughput being provisioned for the table and the RU budget being exceeded. Learn more about [large request](../sql/troubleshoot-request-rate-too-large.md#request-rate-is-large) and [server-side retry](prevent-rate-limiting-errors.md)
#### Recommendation
We recommend using either of the following options:
- If throttling is persistent, increase provisioned RU.
- If throttling is intermittent, use the CosmosRetryPolicy.
- If the extension library cannot be referenced [enable server side retry](prevent-rate-limiting-errors.md).

### All hosts tried for query failed
When the client is set to connect to a different region other than the primary contact point region, you will get below exception during the initial a few seconds upon start-up.
 
Exception message with a Java driver 3: `Exception in thread "main" com.datastax.driver.core.exceptions.NoHostAvailableException: All host(s) tried for query failed (no host was tried)at cassandra.driver.core@3.10.2/com.datastax.driver.core.exceptions.NoHostAvailableException.copy(NoHostAvailableException.java:83)`

Exception message with a Java driver 4: `No node was available to execute the query`

Exception message with a C# driver 3: `System.ArgumentException: Datacenter West US does not match any of the nodes, available datacenters: West US 2`

#### Recommendation
We advise using the CosmosLoadBalancingPolicy in [Java driver 3](https://github.com/Azure/azure-cosmos-cassandra-extensions) and [Java driver 4](https://github.com/Azure/azure-cosmos-cassandra-extensions/tree/release/java-driver-4/1.0.1). This policy falls back to the ContactPoint of the primary write region where the specified local data is unavailable.

> [!NOTE]
> Please reach out to Azure Cosmos DB support with details around - exception message, exception stacktrace, datastax driver log, universal time of failure, consistent or intermittent failures, failing keyspace and table, request type that failed, SDK version if none of the above recommendations help resolve your issue.


## Code Sample

#### Java Driver 3 Settings
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
    
    // cosmos load balancing policy
    String Region = "West US";
    CosmosLoadBalancingPolicy cosmosLoadBalancingPolicy = CosmosLoadBalancingPolicy.builder()
        .withWriteDC(Region)
        .withReadDC(Region)
        .build();
    
    // cosmos retry policy
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

#### Java Driver 4 Settings
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

#### C# v3 Driver Settings
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
* [Server-side diagnostics](error-codes-solution.md) to understand different error codes and their meaning.
* [Diagnose and troubleshoot](../sql/troubleshoot-dot-net-sdk.md) issues when you use the Azure Cosmos DB .NET SDK.
* Learn about performance guidelines for [.NET v3](../sql/performance-tips-dotnet-sdk-v3-sql.md) and [.NET v2](../sql/performance-tips.md).
* [Diagnose and troubleshoot](../sql/troubleshoot-java-sdk-v4-sql.md) issues when you use the Azure Cosmos DB Java v4 SDK.
* Learn about performance guidelines for [Java v4 SDK](../sql/performance-tips-java-sdk-v4-sql.md).