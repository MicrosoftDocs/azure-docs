---
title: Azure Cosmos DB Extension Driver Recommended settings
description: Learn about Azure Cosmos DB for Apache Cassandra extension driver and the recommended settings.
ms.service: cosmos-db
ms.subservice: apache-cassandra
author: iriaosara
ms.author: iriaosara
ms.topic: how-to
ms.date: 01/27/2022
ms.custom: how-to, ignite-2022, devx-track-extended-java
---

# Azure Cosmos DB for Apache Cassandra driver extension
[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

Azure Cosmos DB offers a driver extension for DataStax Java Driver 3 and 4. These driver extensions provide developers with different features to help improve the performance and reliability of your application and optimize your workloads on Azure Cosmos DB.

In this article, the focus will be on Java v4 of the DataStax Java Driver. The extension created can be implemented without any changes to your code but an update to the `pom.xml` and `application.conf` files. In this article, we share the default values for all configuration options set by the Azure Cosmos DB Cassandra extensions and in what cases you might wish to override them.


## Recommended settings for Java SDK
The following settings are specifically for Cassandra client driver Java version 4. 

### Authentication 
PlainTextAuthProvider is used by default. This is because the Azure Cosmos DB for Apache Cassandra requires authentication and uses plain text authentication. 

```java
    auth-provider { 
      class = PlainTextAuthProvider 
    } 
```

### Connection 
Azure Cosmos DB load-balances requests against a large number of backend nodes. The default settings in the extension for local and remote node sizes work well in development, test, and low-volume production or staging environments. In high-volume environments, you should consider increasing these values to 50 or 100.
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
The session token map is used internally by the driver to send requests to the optimal coordinator when token-aware routing is enabled. This is an effective optimization when you are connected to an Apache Cassandra instance. It is irrelevant and generates spurious error messages when you are connected to an Azure Cosmos DB Cassandra endpoint. Hence, we recommend disabling the session token map when you are connected to an Azure Cosmos DB for Apache Cassandra instance. 
```yml
    metadata { 
      token-map { 
        enabled = false 
      } 
    } 
```

### Reconnection policy 
We recommend using the `ConstantReconnectionPolicy` for API for Cassandra, with a `base-delay` of 2 seconds. 

```java
    reconnection-policy { 
      class = ConstantReconnectionPolicy 
      base-delay = 2 second 
    } 
```

### Retry policy 
The default retry policy in the Java Driver does not handle the `OverLoadedException`. We have created a custom policy for API for Cassandra to help handle this exception.  
The parameters for the retry policy are defined within the [reference.conf](https://github.com/Azure/azure-cosmos-cassandra-extensions/blob/release/java-driver-4/1.1.2/driver-4/src/main/resources/reference.conf) of the Azure Cosmos DB extension.  

```java
    retry-policy { 
      class = com.azure.cosmos.cassandra.CosmosRetryPolicy 
      max-retries = 5               
      fixed-backoff-time = 5000     
      growing-backoff-time = 1000   
    } 
```

### Balancing policy and preferred regions 
The default load balancing policy in the v4 driver restricts application-level failover and specifying a single local datacenter for the `CqlSession`, object is required by the policy. This provides a good out-of-box experience for communicating with Azure Cosmos DB Cassandra instances. In addition to setting the load balancing policy, you can configure failover to specified regions in a multi-region-writes deployment, if there are regional outages using the `preferred-regions` parameter.

```java
    load-balancing-policy {
        multi-region-writes=false 
        preferred-regions=["Australia East","UK West"] 
} 
```

### SSL connection and timeouts 
The `DefaultsslEngineFactory` is used by default. This is because Azure Cosmos DB Cassandra API requires SSL: 
```java
    ssl-engine-factory { 
        class = DefaultSslEngineFactory 
    } 
```
A request timeout of 60 seconds provides a better out-of-box experience than the default value of 2 seconds. Adjust this value up or down based on workload and Azure Cosmos DB Cassandra throughput provisioning. The more throughput you provide, the lower you might set this value. 
``` java
    request { 
      timeout = "60 seconds" 
    } 
```


## Next steps
- [Create an Azure Cosmos DB for Apache Cassandra Account](create-account-java.md)
- [Implement Azure Cosmos DB for Apache Cassandra Extensions](https://github.com/Azure-Samples/azure-cosmos-cassandra-extensions-java-sample-v4)
