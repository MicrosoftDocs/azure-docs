---
title: Diagnose and troubleshoot Azure Cosmos DB Java Async SDK| Microsoft Docs
description: Use features like client-side logging and other third-party tools to identify, diagnose, and troubleshoot Azure Cosmos DB issues.
services: cosmos-db
author: moderakh

ms.service: cosmos-db
ms.topic: article
ms.date: 10/28/2018
ms.author: moderakh
ms.devlang: java
ms.component: cosmosdb-sql
ms.topic: troubleshooting
---

# Troubleshoot issues when you use the Java Async SDK with Azure Cosmos DB SQL API accounts
This article covers common issues, workarounds, diagnostic steps, and tools when you use the [Java Async SDK](sql-api-sdk-async-java.md) with Azure Cosmos DB SQL API accounts.
The Java Async SDK provides client-side logical representation to access the Cosmos DB SQL API. This article describes tools and approaches to help you if you run into any issues.

Start with this list:

* Take a look at the [Common issues and workarounds] section in this article.
* Look at our SDK, which is available [open source on GitHub](https://github.com/Azure/azure-cosmosdb-java). We have an [issues section](https://github.com/Azure/azure-cosmosdb-java/issues) that we actively monitor. Check to see if any similar issue with a workaround is already filed.
* Review the [performance tips](performance-tips-async-java.md), and follow the suggested practices.
* Read the rest of this article, if you didn't find a solution. Then file a [GitHub issue](https://github.com/Azure/azure-cosmosdb-java/issues).

## <a name="common-issues-workarounds"></a>Common issues and workarounds

### Network issues, Netty read timeout failure, low throughput, high latency

#### General suggestions
* Make sure the app is running on the same region as your Cosmos DB account. 
* Check the CPU usage on the host where the app is running. If CPU usage is 90% or more, run your app on a host with a higher configuration. Or you can distribute the load on more machines.

#### Connection throttling
Connection throttling can happen due to either a [connection limit on host machine] or [Azure SNAT (PAT) port exhaustion].

##### <a name="connection-limit-on-host"></a>Connection limit on host machine
Some Linux systems, such as Red Hat, have an upper limit on the total number of open files. Sockets in Linux are implemented as files, so this number limits the total number of connections, too.
Run the following command.

```bash
ulimit -a
```
The number of open files ("nofile") needs to be large enough. It needs to be at least double your connection pool size. For more information, see [Performance tips](performance-tips-async-java.md).

##### <a name="snat"></a>Azure SNAT (PAT) port exhaustion

If your app is deployed on Azure Virtual Machines without a public IP address, by default [Azure SNAT ports](https://docs.microsoft.com/azure/load-balancer/load-balancer-outbound-connections#preallocatedports) establish connections to any endpoint outside of your VM. The number of connections allowed from the VM to the Cosmos DB endpoint is limited by the [Azure SNAT configuration](https://docs.microsoft.com/azure/load-balancer/load-balancer-outbound-connections#preallocatedports).

The Azure SNAT ports are used only when your Azure VM has a private IP address and a process from the VM attempts to establish a connection to a public IP address. There are two workarounds to avoid Azure SNAT limitation:

* Add your Azure Cosmos DB service endpoint to the subnet of your Azure VM virtual network. For more information, see [Virtual Network service endpoints](https://docs.microsoft.com/azure/virtual-network/virtual-network-service-endpoints-overview). When the service endpoint is enabled, the requests are no longer sent from a public IP to Cosmos DB. Instead, the virtual network and subnet identity are sent. This change might result in firewall drops if only public IPs are allowed. If you use a firewall, when you enable the service endpoint, add a subnet to the firewall by using [Virtual Network ACLs](https://docs.microsoft.com/azure/virtual-network/virtual-networks-acl).
* Assign a public IP to your Azure VM.

#### HTTP proxy

If you use an HTTP Proxy, make sure your HTTP Proxy can support the number of connections configured in the SDK `ConnectionPolicy`.
Otherwise, you face connection issues.

#### Invalid coding pattern: Blocking Netty IO thread

The SDK uses the [Netty](https://netty.io/) IO library to communicate with Azure Cosmos DB. We have Async API and we use non-blocking IO APIs of Netty. The SDK's IO work is performed on IO Netty threads. The number of IO netty threads is configured to be the same as the number of the CPU cores of the app machine. The Netty IO threads are meant to be used only for non-blocking Netty IO work. The SDK returns the API invocation result on one of the Netty IO threads to the app's code. If the app after receiving results on the Netty thread performs a long-lasting operation on the Netty thread, that might result in the SDK not having enough number of IO threads to perform its internal IO work. Such app coding might result in low throughput, high latency, and `io.netty.handler.timeout.ReadTimeoutException` failures. The workaround is to switch the thread when you know the operation takes time.

   For example, the following code snippet shows that if you perform long-lasting work, which takes more than a few milliseconds, on the netty thread, you eventually can get into a state where no netty IO thread is present to process IO work. As a result you get a ReadTimeoutException.
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
                        // time consuming work. For example:
                        // writing to a file, computationally heavy work, or just sleep
                        // basically anything which takes more than a few milliseconds
                        // doing such operation on the IO netty thread
                        // without a proper scheduler, will cause problems.
                        // The subscriber will get ReadTimeoutException failure.
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
   The workaround is to change the thread on which you perform work that takes time. Define a singleton instance of Scheduler for your app.
   ```java
// have a singleton instance of executor and scheduler
ExecutorService ex  = Executors.newFixedThreadPool(30);
Scheduler customScheduler = rx.schedulers.Schedulers.from(ex);
   ```
   Whenever you need to do work that takes time, for example, computationally heavy work or blocking IO, switch the thread to a worker provided by your `customScheduler` by using the `.observeOn(customScheduler)` API.
```java
Observable<ResourceResponse<Document>> createObservable = client
        .createDocument(getCollectionLink(), docDefinition, null, false);

createObservable
        .observeOn(customScheduler) // switches the thread.
        .subscribe(
            // ...
        );
```
By using `observeOn(customScheduler)`, you release the Netty IO thread and switch to your own custom thread provided by customScheduler. 
This modification solves the problem. You won't get a `io.netty.handler.timeout.ReadTimeoutException` failure anymore.

### Connection pool exhausted issue

`PoolExhaustedException` is a client-side failure. If you get this failure often, that's an indication that your app workload is higher than what the SDK connection pool can serve. Increase the connection pool size or distribute the load on multiple apps.

### Request rate too large
This failure is a server-side failure. It indicates that you consumed your provisioned throughput. Retry later. If you get this failure often, consider an increase in the collection throughput.

### Failure connecting to Azure Cosmos DB emulator

The Cosmos DB emulator HTTPS certificate is self-signed. For the SDK to work with the emulator, import the emulator certificate to Java TrustStore. For more information, see [Export Azure Cosmos DB emulator certificates](local-emulator-export-ssl-certificates.md).


## <a name="enable-client-sice-logging"></a>Enable client SDK logging

The Async Java SDK uses SLF4j as the logging facade that supports logging into popular logging frameworks, such as log4j and logback.

For example, if you want to use log4j as the logging framework, add the following libs in your Java classpath.

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

Also add a log4j config.
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

For more information, see the [sfl4j logging manual](https://www.slf4j.org/manual.html).

## <a name="netstats"></a>OS network statistics
Run the netstat command to get a sense of how many connections are in states such as the `Established` state and the `CLOSE_WAIT` state.

On Linux, you can run the following command.
```bash
netstat -nap
```
Filter the result to only connections to the Cosmos DB endpoint.

The number of connections to the Cosmos DB endpoint in the `Established` state can't be greater than your configured connection pool size.

If there are many connections to the Cosmos DB endpoint in the `CLOSE_WAIT` state, for example, more than 1,000 connections, that's an indication of connections that are established and torn down quickly. This process might potentially cause problems. For more information, see the [Common issues and workarounds] section.

 <!--Anchors-->
[Common issues and workarounds]: #common-issues-workarounds
[Enable client SDK logging]: #enable-client-sice-logging
[Connection limit on host machine]: #connection-limit-on-host
[Azure SNAT (PAT) port exhaustion]: #snat


