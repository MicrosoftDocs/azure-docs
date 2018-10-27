---
title: Diagnose, and troubleshoot Azure Cosmos DB Java Async SDK| Microsoft Docs
description: Use features like client-side logging, and other third-party tools to identify, diagnose, and troubleshoot Azure Cosmos DB issues.
services: cosmos-db
author: moderakh

ms.service: cosmos-db
ms.topic: article
ms.date: 10/28/2018
ms.author: moderakh
ms.devlang: java
ms.component: cosmosdb-sql
ms.custom: troubleshoot java async sdk
ms.topic: troubleshoot
---

## Overview
This article covers commons problems, diagnosing and troubleshooting issues when working with Azure Cosmos DB Java Async SDK. [SQL Java API](sql-api-sdk-async-java.md).

Java Async SDK is provides access to Azure Cosmos DB SQL API.

## <a name="introduction"></a>Introduction

Java Async SDK provides client-side logical representation for accessing Azure Cosmos DB SQL API. We provide a few different tools and approaches for helping you if you face any problem.

Please start with this list:
    1. Take a look at the [commons issues](common-issues-workarounds) in this article.
    2. Our SDK is [open-source on github](https://github.com/Azure/azure-cosmosdb-java) and we have issues section that we actively monitor. Check if there is any similar issue already filed and if there is a workaround: [Our GitHub Issues](https://github.com/Azure/azure-cosmosdb-java/issues)
    3. Review [Performance Tips](performance-tips-async-java.md) and follow the suggested practices.
    4. Follow the rest of this article, if you didn't find a solution, file a [GitHub issue](https://github.com/Azure/azure-cosmosdb-java/issues).

## <a name="common-issues-workarounds"></a>Common Issues and Workarounds

### Network Issues, Netty Read Timeout Failure, Low throughput, High latency

1. Make sure the app is running on the same region as your Cosmos DB Endpoint. 
2. Check the CPU usage on the app Host. If it is 90% or more maybe it is time to run your app on a host with higher spec or distribute the load on more hosts.
3. Some Linux systems (like Red Hat) have an upper limit on the number of open files and as sockets in Linux are implemented as files, so this number controls the total number of connection.
run the following command

```bash
ulimit -a
```

The number of open files (nofile) needs to be large enough (at least as double as your connection pool size) to have enough room for your configured connection pool size and other open files by the OS. More explaination here in (perf tips)[performance-tips-async-java.md]

4. If your app is deployed on Azure VM, you should ensure that Cosmos DB Endpoit is added to your VM's VNET. Otherwise the number of connections Azure allows to be made from the sdk to the cosmos db endpoint will be upper bounded by the [Azure SNAT configuration](https://docs.microsoft.com/en-us/azure/load-balancer/load-balancer-outbound-connections#preallocatedports)

Two workarounds to avoid Azure SNAT limitation:
    1. As Azure SNAT limitation is only applicable when your Azure VM has a private IP address, if possible by assignign a public IP to your Azure VM you get get around this limitation.
    2. Second approach is to add your Azure Cosmos DB endpoint to the VNET of your Azure VM as explained [Enabling VNET Service Endpoint](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-service-endpoints-overview).

5. If you are on a private network and using a HttpProxy make sure your HttpProxy is capable of supporting the number of connections configured in the SDK `ConnectionPolicy`.

6. The SDK uses [netty](https://netty.io/) IO library for communicating to Azure Cosmos DB Service. We have async API and we use non-blocking IO APIs of netty. The SDK's IO work is perfomed on IO netty threads. The number of IO netty threads is configured to be the same as the number of the CPU cores of the app machine. The netty IO threads are only meant to be used for non blocking netty IO work. The SDK returns the API invocation result on the netty IO thread to the apps's code. If app's code which recieves results on the netty thread performs a long lasting operation on the thread which returns the result that may result in SDK to not have enough number of IO threads for performing its internal IO work. Such design may result in low throughput, high latency, and `io.netty.handler.timeout.ReadTimeoutException` failures. The workaround is to switch the thread when you know the operation will take time.

for example the following code snippet shows that if you some work on the netty thread which takes more than a few milliseconds you eventually can get into a state where no netty IO thread is present to process IO work, and as a result you will get ReadTimeoutException

```java
@Test
public void badCodeWithReadTimeoutException() throws Exception {
    int requestTimeoutInSeconds = 10;

    ConnectionPolicy policy = new ConnectionPolicy();
    policy.setRequestTimeoutInMillis(requestTimeoutInSeconds * 1000);

    AsyncDocumentClient testClient = new AsyncDocumentClient.Builder()
            .withServiceEndpoint(TestConfigurations.HOST)
            .withMasterKeyOrResourceToken(TestConfigurations.MASTER_KEY)
            .withConnectionPolicy(policy)
            .build();

    int numberOfCpuCores = Runtime.getRuntime().availableProcessors();
    int numberOfConcurrentWork = numberOfCpuCores + 1;
    CountDownLatch latch = new CountDownLatch(numberOfConcurrentWork);
    AtomicInteger failureCount = new AtomicInteger();

    for (int i = 0; i < numberOfConcurrentWork; i++) {
        Document docDefinition = getDocumentDefinition();
        Observable<ResourceResponse<Document>> createObservable = testClient
                .createDocument(getCollectionLink(), docDefinition, null, false);
        createObservable.subscribe(r -> {
                    try {
                        // time consuming work: e.g., writing to a file, computationally heavy work, or just sleep
                        // basically anything which takes more than a few milliseconds
                        // doing this on the IO netty thread without a proper scheduler,
                        // will cause problems.
                        // the subscriber will get ReadTimeoutException
                        TimeUnit.SECONDS.sleep(2 * requestTimeoutInSeconds);
                    } catch (Exception e) {
                    }
                },

                exception -> {
                    //will be io.netty.handler.timeout.ReadTimeoutException
                    exception.printStackTrace();
                    failureCount.incrementAndGet();
                    latch.countDown();
                },
                () -> {
                    latch.countDown();
                });
    }

    latch.await();
    assertThat(failureCount.get()).isGreaterThan(0);
}
```

The workaround is to change the thread on which you are doing time taking work.

Define a singleton instance of Scheduler for your app:

```java
//have a singleton instance of executor and scheduler
ExecutorService ex  = Executors.newFixedThreadPool(30);
Scheduler customScheduler = rx.schedulers.Schedulers.from(ex);
```

now whenever you need to do time taking work (e.g., computationally heavy work, blocking IO), switch the thread to a worker provided by your `customScheduler`.

```java
Observable<ResourceResponse<Document>> createObservable = client
        .createDocument(getCollectionLink(), docDefinition, null, false);

// by using observeOn(customScheduler) you are releasing the netty IO thread and switching the thread to your own custom thread provided by customScheduler. This will solve the problem in the above, and you won't get `io.netty.handler.timeout.ReadTimeoutException` failure.

createObservable
        .observeOn(customScheduler)
        .subscribe(r -> {
            try {
                // time consuming work: e.g., writing to a file, computationally heavy work, or just sleep
                // will be executed on the worker thread provided by the customScheduler
                TimeUnit.SECONDS.sleep(2 * requestTimeoutInSeconds);
            } catch (Exception e) {
            }
        },

        exception -> {
            failureCount.incrementAndGet();
            latch.countDown();
        },
        () -> {
            latch.countDown();
        });
```

### Connection Pool Exhausted Issue

Getting `PoolExhaustedException` a client side failure. If you get this failure often, that's indication that your app workload is higher than what the SDK connection pool can serve. Trying to increase connection pool size or distributing the load on multiple apps may help.


### Request Rate Too Large.
This is a service side failure indicating that you consumed your provisioned throughput and should retry later. If you get this failure often it is an indication that you should increase the collection throughput.

### Fialure in connecting to Cosmos DB Emulator

Cosmos DB emulator https certificate is self signed. For SDK to work with emulator you should import the emulator certificate to Java TrustStore. As explained [here](https://docs.microsoft.com/en-us/azure/cosmos-db/local-emulator-export-ssl-certificates).


## Enable Client SDK Logging

The async Java SDK uses slf4j as the logging facade as the logging framework. SFL4J is the logging facade which makes logging into popular logging frameworks (log4j, logback, etc) possible.

For example if you want to use log4j as the logging framework, you need to have the following libs in your Java classpath:

```xml
<dependency>
  <groupId>org.slf4j</groupId>
  <artifactId>slf4j-log4j12</artifactId>
  <version>${slf4j.version}</version>
</dependency>
<dependency>
  <groupId>log4j</groupId>
  <artifactId>log4j</artifactId>
  <version>${log4j.version}</version>
</dependency>
```

and have log4j config file in place:
```
# this is a sample log4j configuration

# Set root logger level to DEBUG and its only appender to A1.
log4j.rootLogger=INFO, A1

log4j.category.com.microsoft.azure.cosmosdb=DEBUG
#log4j.category.io.netty=INFO
#log4j.category.io.reactivex=INFO
# A1 is set to be a ConsoleAppender.
log4j.appender.A1=org.apache.log4j.ConsoleAppender

# A1 uses PatternLayout.
log4j.appender.A1.layout=org.apache.log4j.PatternLayout
log4j.appender.A1.layout.ConversionPattern=%d %5X{pid} [%t] %-5p %c - %m%n
```

Please follow [sfl4j logging manual](https://www.slf4j.org/manual.html) for more information.

 



