---
title: Troubleshooting NoHostAvailableException and NoNodeAvailableException
description: This article discusses the different possible reasons for having a NoHostException and ways to handle it.
author: IriaOsara
ms.service: cosmos-db
ms.subservice: cosmosdb-cassandra
ms.topic: troubleshooting
ms.date: 12/02/2021
ms.author: IriaOsara

---

# Troubleshooting NoHostAvailableException and NoNodeAvailableException
The NoHostAvailableException is a top-level wrapper exception with many possible causes and inner exceptions, many of which can be client-related. This exception tends to occur if there are some issues with cluster, connection settings or one or more Cassandra nodes is unavailable. Here we explore possible reasons for this exception along with details specific to the client driver being used.

## Exception Messages
Review the exception messages below, if your error log contains any of these messages and follow the recommended ways to handle it.

### Connection has been closed
This message is common with using Datastax client Java v3 driver. The default number of connections per host is set to 1, with a single connection value, all requests get sent to a single node. Sample exception message below: 

`Exception in thread main [2021-05-20 11:24:14,083] ERROR - [Control connection] Cannot connect to any host, scheduling retry in 1000 milliseconds (com.datastax.driver.core.ControlConnection)
com.datastax.driver.core.exceptions.TransportException: [127.0.0.1:15350] Connection has been closed.`

If DataStax driver logs are collected, the error below:
`ERROR - [Control connection] Cannot connect to any host, scheduling retry in 1000 milliseconds (com.datastax.driver.core.ControlConnection)`

#### Recommendation
We advise setting the `PoolingOptions` to a minimum of 10. See code reference section for guidance.

### BusyPoolException
This client-side error indicates that the maximum number of request connections for a host has been reached. If unable to remove, request from the queue, you might see this error if the current driver is Datastax client Java v3 or C# v3.
#### Recommendation
Instead of tuning the `max requests per connection`, we advise making sure the `connections per host` is set to a minimum of 10. See the code section.

### TooManyRequest(429)
OverloadException is thrown when the request rate is too large. Which may be because of insufficient throughput being provisioned for the table and the RU budget being exceeded. Learn more about [large request](../sql/troubleshoot-request-rate-too-large.md#request-rate-is-large) and [server-side retry](prevent-rate-limiting-errors.md)
#### Recommendation
We recommend using either of the following options:
1. Increase RU provisioned for the table or database if the throttling is consistent.
2. If throttling is persistent, we advise using CosmosRetryPolicy in our [Azure Cosmos Cassandra extensions]( https://github.com/Azure/azure-cosmos-cassandra-extensions)
3. Where the extension cannot be referenced or the client sire retry policy cannot be used in any way, [enable server side retry](prevent-rate-limiting-errors.md).

### All hosts tried for query failed
If the primary contact point cannot be reached, client sees a different exception. This error is specific to when the client is set to connect to a different region other than what the primary contact point region. The error is seen during the initial a few seconds upon start-up.
#### Recommendation
- Java v3: We advise using the CosmosLoadBalancingPolicy in [Azure Cosmos Cassandra extensions](https://github.com/Azure/azure-cosmos-cassandra-extensions). This policy falls back to the ContactPoint of the primary write region where the specified local data is unavailable.

> [!NOTE]
> Currently, our C# extension does not include CosmosLoadBalancingPolicy. 


### IllegalArgumentException (driver 3) / AllNodesFailedException (driver 4)
1. If the contact point also known as the global endpoint URL is unreachable an UnknownHostException or NoHostAvailableException is thrown depending on the Datastax driver, you are using.
`Exception in thread "main" com.datastax.oss.driver.api.core.AllNodesFailedException: Could not reach any contact point, make sure you've provided valid addresses (showing first 1 nodes, use getAllErrors() for more)`
2. The account name or key is incorrect.
``Exception in thread "main" com.datastax.oss.driver.api.core.AllNodesFailedException: Could not reach any contact point, make sure you've provided valid addresses (showing first 1 nodes, use getAllErrors() for more)``
3. The account server's firewall setting has a blocked client.
4.  Account server's private link configuration has a blocked client.
#### Recommendation
We recommend the following steps:
-	Confirm you can access the account and carryout data operations via the Azure Cosmos DB portal. 
-	If you are unable to do this, it would appear the account may not have been provisioned correctly. 
-	If the account is brand new, recreate an account else open a support ticket.
- Review the connection string, [firewall](../how-to-configure-firewall.md) and private link settings.


> [!NOTE]
> Please reach out to Azure Cosmos DB support with details around - error observed, time of the failures, consistent/one-time failure, failing keyspace and table, request type that failed, SDK version if none of the above recommendations help resolve your issue."


## Code Sample

#### PoolingOptions
```dotnetcli
    PoolingOptions poolingOptions = PoolingOptions.Create()
        .SetCoreConnectionsPerHost(HostDistance.Local, 10) // default 2
        .SetMaxConnectionsPerHost(HostDistance.Local, 10) // default 8
        .SetCoreConnectionsPerHost(HostDistance.Remote, 10) // default 1
        .SetMaxConnectionsPerHost(HostDistance.Remote, 10); // default 2

    SocketOptions socketOptions = new SocketOptions()
        .SetConnectTimeoutMillis(5000)
        .SetReadTimeoutMillis(60000); // default 12000

    buildCluster = Cluster.Builder()
        .AddContactPoint(Program.ContactPoint)
        .WithPort(Program.CosmosCassandraPort)
        .WithCredentials(Program.UserName, Program.Password)
        .WithPoolingOptions(poolingOptions)
        .WithSocketOptions(socketOptions)
        .WithReconnectionPolicy(new ConstantReconnectionPolicy(1000)) // default ExponentialReconnectionPolicy
        .WithSSL(sslOptions);
```

#### CosmosRetryPolicy
```java
    // cosmos retry policy
    CosmosRetryPolicy retryPolicy = CosmosRetryPolicy.builder()
        .withFixedBackOffTimeInMillis(1000)
        .withGrowingBackOffTimeInMillis(1000)
        .withMaxRetryCount(10)
        .build();
```

#### CosmosDBLoadBalancingPolicy 
``` java
   // socket options with default values
    // https://docs.datastax.com/en/developer/java-driver/3.6/manual/socket_options/
    SocketOptions socketOptions = new SocketOptions()
        .setConnectTimeoutMillis(5000)
        .setReadTimeoutMillis(60000); // default 12000
    
    // connection pooling options (default values are 1s)
    // https://docs.datastax.com/en/developer/java-driver/3.6/manual/pooling/
    PoolingOptions poolingOptions = new PoolingOptions()
        .setCoreConnectionsPerHost(HostDistance.LOCAL, 10) // default 1
        .setMaxConnectionsPerHost(HostDistance.LOCAL, 10) // default 1
        .setCoreConnectionsPerHost(HostDistance.REMOTE, 10) // default 1
        .setMaxConnectionsPerHost(HostDistance.REMOTE, 10); //default 1
    
    // cosmos load balancing policy
    CosmosLoadBalancingPolicy cosmosLoadBalancingPolicy = CosmosLoadBalancingPolicy.builder()
        .withWriteDC(Region)
        .withReadDC(Region)
        .build();
    
    Cluster cluster = Cluster.builder()
        .addContactPoint(EndPoint).withPort(10350)
        .withCredentials(UserName, Password)
        .withSSL(sslOptions)
        .withSocketOptions(socketOptions)
        .withPoolingOptions(poolingOptions)
        //.withLoadBalancingPolicy(nativeLoadBalancingPolicy)
        .withLoadBalancingPolicy(cosmosLoadBalancingPolicy)
        .withRetryPolicy(retryPolicy)
        .build();
```


## Next steps
* [Server-side diagnostics](error-codes-solution.md) to understand different error codes and their meaning.
* [Diagnose and troubleshoot](../sql/troubleshoot-dot-net-sdk.md) issues when you use the Azure Cosmos DB .NET SDK.
* Learn about performance guidelines for [.NET v3](../sql/performance-tips-dotnet-sdk-v3-sql.md) and [.NET v2](../sql/performance-tips.md).
* [Diagnose and troubleshoot](../sql/troubleshoot-java-sdk-v4-sql.md) issues when you use the Azure Cosmos DB Java v4 SDK.
* Learn about performance guidelines for [Java v4 SDK](../sql/performance-tips-java-sdk-v4-sql.md).