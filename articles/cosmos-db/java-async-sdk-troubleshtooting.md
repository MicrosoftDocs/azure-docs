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
This article covers common issues you may encounter, workarounds, diagnosing and troubleshooting approaches when working with [Azure Cosmos DB Java Async SDK for SQL API](sql-api-sdk-async-java.md).

## <a name="introduction"></a>Introduction

Java Async SDK provides client-side logical representation for accessing Azure Cosmos DB SQL API. We provide a few different tools and approaches for helping you if you face any problem.

Start with this list:
    1. Take a look at the [Common Issues and Workarounds] in this article.
    2. Our SDK is [open-source on github](https://github.com/Azure/azure-cosmosdb-java) and we have [issues section](https://github.com/Azure/azure-cosmosdb-java/issues) that we actively monitor. Check if there is any similar issue already filed and if there is a workaround.
    3. Review [Performance Tips](performance-tips-async-java.md) and follow the suggested practices.
    4. Follow the rest of this article, if you didn't find a solution, file a [GitHub issue](https://github.com/Azure/azure-cosmosdb-java/issues).

## <a name="common-issues-workarounds"></a>Common Issues and Workarounds

### Network Issues, Netty Read Timeout Failure, Low Throughput, High Latency

#### General Suggestion
* Make sure the app is running on the same region as your Cosmos DB Endpoint. 
* Check the CPU usage on the app Host. If it is 90% or more maybe, it is time to run your app on a host with higher spec or distribute the load on more machines.

#### Connection Throttling
Connection throttling can be done either due to [Connection Limit on Host Machine], or due to [Managing SNAT (PAT) Port Exhaustion]:

##### <a name="connection-limit-on-host"></a>Connection Limit on Host Machine
Some Linux systems (like 'Red Hat') have an upper limit on the total number of open files and as sockets in Linux are implemented as files, so this number limits the total number of connections too.
Run the following command
```bash
ulimit -a
```
The number of open files ("nofile") needs to be large enough (at least as double as your connection pool size) to have enough room for your configured connection pool size and other open files by the OS. Read more detail  in [Performance Tips](performance-tips-async-java.md).

##### <a name="managing-snat"></a>Managing SNAT (PAT) Port Exhaustion

If your app is deployed on Azure VM, you should ensure that Cosmos DB Service Endpoint is added to your VM's VNET. Otherwise the number of connections Azure allows to be made from the VM to the Cosmos DB endpoint will be upper bounded by the [Azure SNAT configuration](https://docs.microsoft.com/en-us/azure/load-balancer/load-balancer-outbound-connections#preallocatedports).
There are two workarounds to avoid Azure SNAT limitation:
    1.  Add your Azure Cosmos DB endpoint to the VNET of your Azure VM as explained [Enabling VNET Service Endpoint](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-service-endpoints-overview).
    2. As Azure SNAT limitation is only applicable when your Azure VM has a private IP address, the other workaround is to assign a public IP to your Azure VM.

#### Http Proxy

If you are using an HttpProxy, make sure your HttpProxy is capable of supporting the number of connections configured in the SDK `ConnectionPolicy`.
If your HttpProxy fails to serve the required number of connections, you will face connection issues.

#### Invalid Coding Pattern: Blocking Netty IO Thread

The SDK uses [netty](https://netty.io/) IO library for communicating to Azure Cosmos DB Service. We have async API and we use non-blocking IO APIs of netty. The SDK's IO work is performed on IO netty threads. The number of IO netty threads is configured to be the same as the number of the CPU cores of the app machine. The netty IO threads are only meant to be used for non blocking netty IO work. The SDK returns the API invocation result on one of the netty IO threads to the apps's code. If the app after receiving results on the netty thread performs a long lasting operation on the netty thread that may result in SDK to not have enough number of IO threads for performing its internal IO work. Such app coding may result in low throughput, high latency, and `io.netty.handler.timeout.ReadTimeoutException` failures. The workaround is to switch the thread when you know the operation will take time.

   For example, the following code snippet shows that if you perform long lasting work (which takes more than a few milliseconds) on the netty thread, you eventually can get into a state where no netty IO thread is present to process IO work, and as a result you will get ReadTimeoutException:
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
   The workaround is to change the thread on which you are doing time taking work. Define a singleton instance of Scheduler for your app:
   ```java
// have a singleton instance of executor and scheduler
ExecutorService ex  = Executors.newFixedThreadPool(30);
Scheduler customScheduler = rx.schedulers.Schedulers.from(ex);
   ```
   Whenever you need to do time taking work (for example, computationally heavy work, blocking IO), switch the thread to a worker provided by your `customScheduler` using `.observeOn(customScheduler)` API.
```java
Observable<ResourceResponse<Document>> createObservable = client
        .createDocument(getCollectionLink(), docDefinition, null, false);

createObservable
        .observeOn(customScheduler) // switches the thread.
        .subscribe(
            // ...
        );
```
By using `observeOn(customScheduler)`, you are releasing the netty IO thread and switching the thread to your own custom thread provided by customScheduler. 
This modification will solve the problem in the above, and you won't get `io.netty.handler.timeout.ReadTimeoutException` failure anymore.

### Connection Pool Exhausted Issue

Getting `PoolExhaustedException` is a client-side failure. If you get this failure often, that's indication that your app workload is higher than what the SDK connection pool can serve. Trying to increase connection pool size or distributing the load on multiple apps may help.

### Request Rate Too Large.
This failure is a service side failure indicating that you consumed your provisioned throughput and should retry later. If you get this failure often, it is an indication that you should increase the collection throughput.

### Failure in Connecting to Cosmos DB Emulator

Cosmos DB emulator HTTPS certificate is self-signed. For SDK to work with emulator you should import the emulator certificate to Java TrustStore. As explained [here](https://docs.microsoft.com/en-us/azure/cosmos-db/local-emulator-export-ssl-certificates).


## <a name="enable-client-sice-logging"></a>Enable Client SDK Logging

The async Java SDK uses SLF4j as the logging facade. SFL4J is the logging interface, which makes logging into popular logging frameworks (log4j, logback, etc.) possible.

For example, if you want to use log4j as the logging framework, add the following libs in your Java classpath:

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

In addition to the log4j libs, you also need to put a log4j config in place:
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

Review [sfl4j logging manual](https://www.slf4j.org/manual.html) for more information.

## <a name="netstats"></a>OS Network Statistics
Run netstat command to get a sense of how many connections are in `Established` state, `CLOSE_WAIT`, etc.

On Linux you can run the following command:
```bash
netstat -nap
```

You should filter the result to only connections to Cosmos DB endpoint.

Apparantly, the number of connections to Cosmos DB endpoint in `Established` state should be not greater than your configured connection pool size.

If there are many connections to Cosmos DB endpoint in `CLOSE_WAIT` state (more than 1000 connections), that's an indication of connections are established and teared down very quickly which may potentially cause problems. Review [Common Issues and Workarounds] section for more detail.

 <!--Anchors-->
[Introduction]: #introduction
[Common Issues and Workarounds]: #common-issues-workarounds
[Enable Client SDK Logging]: #enable-client-sice-logging
[Connection Limit on Host Machine]: #connection-limit-on-host
[Managing SNAT (PAT) Port Exhaustion]: #managing-snat


