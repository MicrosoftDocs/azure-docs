---
title: Troubleshooting NoHostAvailableException
description: This article discusses the different possible reasons for having a NoHostException and ways to handle it.
author: IriaOsara
ms.service: cosmos-db
ms.subservice: cosmosdb-cassandra
ms.topic: troubleshooting
ms.date: 12/02/2021
ms.author: IriaOsara

---

# Handling NoHostAvailableException
The NoHostAvailableException is a top-level wrapper exception with many possible causes and inner exceptions, many of which can be client-related. This exception tends to occur if there are some issues with cluster or connection settings, one or more Cassandra nodes is unavailable and depending on the replication factor and consistency level. Here we explore possible reasons for this exception along with details specific to the client driver being used.

## Exception Messages
Review the exception messages below, if your error log contains any of these messages and recommended ways to handle it.

### Connection has been closed
This TransportException message is common with using Datastax client Java v3 driver. The default number of connections per host is set to 1, with a single connection value, all requests get sent to a single node. 
#### Recommendation
We advise setting the `PoolingOptions` to a minimum of 10. See code reference section for guidance.

### BusyPoolException
This client-side error indicates that the maximum number of request connections for a host has been reached. If unable to remove, request from the queue, you might see this error if the current driver is  Datastax client Java v3 or C# v3 
#### Recommendation
Instead of tuning the `MaxQueueSize or PoolTimeoutMillis`, we advise making sure the `ConnectionsPerHost` is set to a minimum of 10. See the code section.

### TooManyRequest(429)
OverloadException is thrown when the request rate is too large, which may be because of insufficient throughput being provisioned for the table and the RU budget being exceeded. Learn more about [large request](../sql/troubleshoot-request-rate-too-large.md#request-rate-is-large)
#### Recommendation
We recommend using either of the following options:
1. Increase RU provisioned for the table or database if the throttling is consistent.
2. If throttling is persistent, we advise using CosmosRetryPolicy in our [Azure Cosmos Cassandra extensions]( https://github.com/Azure/azure-cosmos-cassandra-extensions)

### All hosts tried for query failed
Seen when using Datastax client Java v3, this error can be seen either because there is no live host in the cluster at the time the query request was sent or connection issues. However, with C# v3 driver one of the most common cause is that the default value of connections per host is 2.
#### Recommendation
Java v3: We advise using the CosmosLoadBalancingPolicy in [Azure Cosmos Cassandra extensions](https://github.com/Azure/azure-cosmos-cassandra-extensions). This policy falls back to the ContactPoint of the primary write region where the specified local data is unavailable.
C# v3:  The recommended value is 10. Refer to PoolingOptions in the sample codes below.

### AuthenticationException: Invalid Cosmos DB account or key
This AllNodesFailedException is thrown when the account name or key is incorrect. Another reason could be that the client is blocked by the firewall setting.
#### Recommendation
Review the connection string, [firewall](../how-to-configure-firewall.md), and private link settings.

### Could not reach any contact point or Failed to add contact point or No host name could be resolved
If the contact point also known as the global endpoint URL is unreachable an UnknownHostException or NoHostAvailableException is thrown depending on the Datastax driver, you are using.
#### Recommendation
We recommend the following steps:
-	Confirm you can access the account and carryout data operations via the Azure Cosmos DB portal. 
-	If you are unable to do this, appears the account may not have been provisioned correctly. 
-	If the account is brand new, recreate an account else open a support ticket.

### No node was available to execute the query
On each connection channel, the driver can execute X number of parallel requests, controlled by (advanced.connection.max-requests-per-connection) with default value of 1024. When all connection channels are full, NoNodeAvailableException will be thrown. This exception can be seen using Datastax client driver Java v4. 
#### Recommendation
1.	If this exception is consistent when local data center is set to the remote region, then we advise use CosmosLoadBalancingPolicy in our [Azure Cosmos Cassandra extensions library](https://github.com/Azure/azure-cosmos-cassandra-extensions/tree/release/java-driver-4/1.0.1). This policy falls back to the ContactPoint of the primary write region where the specified local data is unavailable.
2.	If this exception is intermittent during runtime, we advise increasing the value set for CONNECTION_POOL_LOCAL_SIZE and CONNECTION_POOL_REMOTE_SIZE. See sample code section.

### ArgumentException
If any of the Cassandra native load-balancing policies is used, an ArgumentException is raised during Cluster.Connect().
This is because the regional endpoint cache is asynchronous, the peers would not contain the remote regions during a cold restart. It usually takes a few seconds for the update. The C# drivers do not have a retry like the Java drivers hence the exception.
#### Recommendation
See code sample implementation below on how to use the CosmosLoadBalancingPolicy to route   the primary endpoint while the specified local data center is unavailable or reach out to our support team to enable RegionalEndpointsIsInitialRefreshBlocking


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