---
title: Azure Cosmos DB Extension Driver Recommended settings
description: Learn about Azure Cosmos DB Cassandra API extension driver and the recommended settings. 
author: iriaosara
ms.author: iriaosara
ms.topic: how-to
ms.date: 01/27/2022
ms.custom: how-to 
---

# Azure Cosmos DB Cassandra API Driver Extension
[!INCLUDE[appliesto-cassandra-api](../includes/appliesto-cassandra-api.md)]

Azure Cosmos DB offers a driver extension for Azure Cosmos DB Cassandra API for Java SDK. 
This driver extension provides developers with different features to help improve the performance of your application and optimize your workload on Azure Cosmos DB.

In this article, the focus will be on Java v4 of the Cassandra client driver for java. The extension created can be implemented without any changes to your code but an update to the `pom.xml` and `application.conf` files. In this article, we share the recommended setting based when using the Cassandra API extension and in what cases you may override them.


## Recommended Settings for Java SDK
The following settings are specifically for Cassandra client driver java version 4. 

### Authentication 
PlainTextAuthProvider is used by default. This is because the Cosmos DB Cassandra API requires authentication and uses plain text authentication. 

```java
    auth-provider { 
      class = PlainTextAuthProvider 
    } 
```

### Connection 
Cosmos DB load-balances requests against many backend nodes. 
The default settings in the extension for local and remote node sizes work well in development, test, and low-volume production or staging environments. 
```java
    connection { 
      pool { 
        local { 
          size = 10 
        } 
        remote { 
          size = 10 
        } 
      } 
    } 
```

### Token map 
We recommend disabling token maps because they are not relevant to routing when accessing Cosmos DB Cassandra instance using Java driver v4. 
```java
    metadata { 
      token-map { 
        enabled = false 
      } 
    } 
```

### Reconnection Policy 
We recommend using the `ConstantReconnectionPolicy` for Cassandra API, with a `base-delay` of 2 seconds. 

```java
    reconnection-policy { 
      class = ConstantReconnectionPolicy 
      base-delay = 2 second 
    } 
```

### Retry Policy 
The default retry policy in the Java Driver does not handle the `OverLoadedException`. We have created a custom policy for Cassandra API to help handle this exception.  

The parameters for the retry policy are defined within the [reference.conf](https://github.com/Azure/azure-cosmos-cassandra-extensions/blob/release/java-driver-4/0.1.0-beta.1/package/src/main/resources/reference.conf) of the Azure Cosmos DB extension.  

```java
    retry-policy { 
      class = com.azure.cosmos.cassandra.CosmosRetryPolicy 
      max-retries = 5               
      fixed-backoff-time = 5000     
      growing-backoff-time = 1000   
    } 
```

### balancing policy and Preferred regions 
The default load balancing policy in the v4 driver restricts application-level failover and specifying a single local datacenter for the CqlSession object is required by the policy. Azure Cosmos DB provides an out-of-box ability to configure either single master, or multi-master regions for writes. One of the advantages of having a single master region for writes is the avoidance of cross-region conflicts, and the option of maintaining strong consistency. In addition to setting the load balancing policy, you can configure failover to specified regions in a multi-region deployment, if there is regional outages using the `preferred-regions` parameter. 

```java
    load-balancing-policy {
        multi-region-writes=false 
        global-endpoint="" 
        read-datacenter="Australia East" 
        write-datacenter="UK South" 
        preferred-regions=["Australia East","UK West"] 
} 
```

### SSL Connection and Timeouts 
The DefaultSslEngineFactory is used by default. This is because Cosmos Cassandra API requires SSL: 
```java
    ssl-engine-factory { 
        class = DefaultSslEngineFactory 
    } 
```
A request timeout of 60 seconds provides a better out-of-box experience than the default value of 2 seconds. Adjust this value up or down based on workload and Cosmos Cassandra throughput provisioning. The more throughput you provide, the lower you might set this value. 
``` java
    request { 
      timeout = "60 seconds" 
    } 
```


## Next steps
- [Create a Cosmos DB Cassandra API Account](create-account-java.md)
- [Implement Azure Cosmos DB Cassandra API Extensions](https://github.com/Azure-Samples/azure-cosmos-cassandra-extensions-java-sample-v4)