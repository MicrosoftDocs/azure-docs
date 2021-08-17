---
title: Diagnose and troubleshoot Azure Cosmos DB Java SDK v4
description: Use features like client-side logging and other third-party tools to identify, diagnose, and troubleshoot Azure Cosmos DB issues in Java SDK v4.
author: anfeldma-ms
ms.service: cosmos-db
ms.date: 06/11/2020
ms.author: anfeldma
ms.devlang: java
ms.subservice: cosmosdb-sql
ms.topic: troubleshooting
ms.custom: devx-track-java
---

# Troubleshoot issues when you use Azure Cosmos DB Java SDK v4 with SQL API accounts
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

> [!div class="op_single_selector"]
> * [Java SDK v4](troubleshoot-java-sdk-v4-sql.md)
> * [Async Java SDK v2](troubleshoot-java-async-sdk.md)
> * [.NET](troubleshoot-dot-net-sdk.md)
> 

> [!IMPORTANT]
> This article covers troubleshooting for Azure Cosmos DB Java SDK v4 only. Please see the Azure Cosmos DB Java SDK v4 [Release notes](sql-api-sdk-java-v4.md), [Maven repository](https://mvnrepository.com/artifact/com.azure/azure-cosmos), and [performance tips](performance-tips-java-sdk-v4-sql.md) for more information. If you are currently using an older version than v4, see the [Migrate to Azure Cosmos DB Java SDK v4](migrate-java-v4-sdk.md) guide for help upgrading to v4.
>

This article covers common issues, workarounds, diagnostic steps, and tools when you use Azure Cosmos DB Java SDK v4 with Azure Cosmos DB SQL API accounts.
Azure Cosmos DB Java SDK v4 provides client-side logical representation to access the Azure Cosmos DB SQL API. This article describes tools and approaches to help you if you run into any issues.

Start with this list:

* Take a look at the [Common issues and workarounds] section in this article.
* Look at the Java SDK in the Azure Cosmos DB central repo, which is available [open source on GitHub](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/cosmos/azure-cosmos). It has an [issues section](https://github.com/Azure/azure-sdk-for-java/issues) that's actively monitored. Check to see if any similar issue with a workaround is already filed. One helpful tip is to filter issues by the *cosmos:v4-item* tag.
* Review the [performance tips](performance-tips-java-sdk-v4-sql.md) for Azure Cosmos DB Java SDK v4, and follow the suggested practices.
* Read the rest of this article, if you didn't find a solution. Then file a [GitHub issue](https://github.com/Azure/azure-sdk-for-java/issues). If there is an option to add tags to your GitHub issue, add a *cosmos:v4-item* tag.

### Retry Logic <a id="retry-logics"></a>
Cosmos DB SDK on any IO failure will attempt to retry the failed operation if retry in the SDK is feasible. Having a retry in place for any failure is a good practice but specifically handling/retrying write failures is a must. It's recommended to use the latest SDK as retry logic is continuously being improved.

1. Read and query IO failures will get retried by the SDK without surfacing them to the end user.
2. Writes (Create, Upsert, Replace, Delete) are "not" idempotent and hence SDK cannot always blindly retry the failed write operations. It is required that user's application logic to handle the failure and retry.
3. [Trouble shooting sdk availability](troubleshoot-sdk-availability.md) explains retries for multi-region Cosmos DB accounts.

### Retry design

The application should be designed to retry on any exception unless it is a known issue where retrying will not help. For example, the application should retry on 408 request timeouts, this timeout is possibly transient so a retry may result in success. The application should not retry on 400s, this typically means that there is an issue with the request that must first be resolved. Retrying on the 400 will not fix the issue and will result in the same failure if retried again. The table below shows known failures and which ones to retry on.

## Common error status codes <a id="error-codes"></a>

| Status Code | Retryable | Description | 
|----------|-------------|-------------|
| 400 | No | Bad request (i.e. invalid json, incorrect headers, incorrect partition key in header)| 
| 401 | No | [Not authorized](troubleshoot-unauthorized.md) | 
| 403 | No | [Forbidden](troubleshoot-forbidden.md) |
| 404 | No | [Resource is not found](troubleshoot-not-found.md) |
| 408 | Yes | [Request timed out](troubleshoot-request-timeout-java-sdk-v4-sql.md) |
| 409 | No | Conflict failure is when the ID provided for a resource on a write operation has been taken by an existing resource. Use another ID for the resource to resolve this issue as ID must be unique within all documents with the same partition key value. |
| 410 | Yes | Gone exceptions (transient failure that should not violate SLA) |
| 412 | No | Precondition failure is where the operation specified an eTag that is different from the version available at the server. It's an optimistic concurrency error. Retry the request after reading the latest version of the resource and updating the eTag on the request.
| 413 | No | [Request Entity Too Large](concepts-limits.md#per-item-limits) |
| 429 | Yes | It is safe to retry on a 429. This can be avoided by following the link for [too many requests](troubleshoot-request-rate-too-large.md).|
| 449 | Yes | Transient error that only occurs on write operations, and is safe to retry. This can point to a design issue where too many concurrent operations are trying to update the same object in Cosmos DB. |
| 500 | Yes | The operation failed due to an unexpected service error. Contact support by filing an [Azure support issue](https://aka.ms/azure-support). |
| 503 | Yes | [Service unavailable](troubleshoot-service-unavailable-java-sdk-v4-sql.md) |

## <a name="common-issues-workarounds"></a>Common issues and workarounds

### Network issues, Netty read timeout failure, low throughput, high latency

#### General suggestions
For best performance:
* Make sure the app is running on the same region as your Azure Cosmos DB account. 
* Check the CPU usage on the host where the app is running. If CPU usage is 50 percent or more, run your app on a host with a higher configuration. Or you can distribute the load on more machines.
    * If you are running your application on Azure Kubernetes Service, you can [use Azure Monitor to monitor CPU utilization](../azure-monitor/containers/container-insights-analyze.md).

#### Connection throttling
Connection throttling can happen because of either a [connection limit on a host machine] or [Azure SNAT (PAT) port exhaustion].

##### <a name="connection-limit-on-host"></a>Connection limit on a host machine
Some Linux systems, such as Red Hat, have an upper limit on the total number of open files. Sockets in Linux are implemented as files, so this number limits the total number of connections, too.
Run the following command.

```bash
ulimit -a
```
The number of max allowed open files, which are identified as "nofile," needs to be at least double your connection pool size. For more information, see the Azure Cosmos DB Java SDK v4 [performance tips](performance-tips-java-sdk-v4-sql.md).

##### <a name="snat"></a>Azure SNAT (PAT) port exhaustion

If your app is deployed on Azure Virtual Machines without a public IP address, by default [Azure SNAT ports](../load-balancer/load-balancer-outbound-connections.md#preallocatedports) establish connections to any endpoint outside of your VM. The number of connections allowed from the VM to the Azure Cosmos DB endpoint is limited by the [Azure SNAT configuration](../load-balancer/load-balancer-outbound-connections.md#preallocatedports).

 Azure SNAT ports are used only when your VM has a private IP address and a process from the VM tries to connect to a public IP address. There are two workarounds to avoid Azure SNAT limitation:

* Add your Azure Cosmos DB service endpoint to the subnet of your Azure Virtual Machines virtual network. For more information, see [Azure Virtual Network service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md). 

    When the service endpoint is enabled, the requests are no longer sent from a public IP to Azure Cosmos DB. Instead, the virtual network and subnet identity are sent. This change might result in firewall drops if only public IPs are allowed. If you use a firewall, when you enable the service endpoint, add a subnet to the firewall by using [Virtual Network ACLs](/previous-versions/azure/virtual-network/virtual-networks-acl).
* Assign a public IP to your Azure VM.

##### <a name="cant-connect"></a>Can't reach the Service - firewall
``ConnectTimeoutException`` indicates that the SDK cannot reach the service.
You may get a failure similar to the following when using the direct mode:
```
GoneException{error=null, resourceAddress='https://cdb-ms-prod-westus-fd4.documents.azure.com:14940/apps/e41242a5-2d71-5acb-2e00-5e5f744b12de/services/d8aa21a5-340b-21d4-b1a2-4a5333e7ed8a/partitions/ed028254-b613-4c2a-bf3c-14bd5eb64500/replicas/131298754052060051p//', statusCode=410, message=Message: The requested resource is no longer available at the server., getCauseInfo=[class: class io.netty.channel.ConnectTimeoutException, message: connection timed out: cdb-ms-prod-westus-fd4.documents.azure.com/101.13.12.5:14940]
```

If you have a firewall running on your app machine, open port range 10,000 to 20,000 which are used by the direct mode.
Also follow the [Connection limit on a host machine](#connection-limit-on-host).

#### HTTP proxy

If you use an HTTP proxy, make sure it can support the number of connections configured in the SDK `ConnectionPolicy`.
Otherwise, you face connection issues.

#### Invalid coding pattern: Blocking Netty IO thread

The SDK uses the [Netty](https://netty.io/) IO library to communicate with Azure Cosmos DB. The SDK has an Async API and uses non-blocking IO APIs of Netty. The SDK's IO work is performed on IO Netty threads. The number of IO Netty threads is configured to be the same as the number of CPU cores of the app machine. 

The Netty IO threads are meant to be used only for non-blocking Netty IO work. The SDK returns the API invocation result on one of the Netty IO threads to the app's code. If the app performs a long-lasting operation after it receives results on the Netty thread, the SDK might not have enough IO threads to perform its internal IO work. Such app coding might result in low throughput, high latency, and `io.netty.handler.timeout.ReadTimeoutException` failures. The workaround is to switch the thread when you know the operation takes time.

For example, take a look at the following code snippet which adds items to a container (look [here](create-sql-api-java.md) for guidance on setting up the database and container.) You might perform long-lasting work that takes more than a few milliseconds on the Netty thread. If so, you eventually can get into a state where no Netty IO thread is present to process IO work. As a result, you get a ReadTimeoutException failure.

### <a id="java4-readtimeout"></a>Java SDK V4 (Maven com.azure::azure-cosmos) Async API

[!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/documentationsnippets/async/SampleDocumentationSnippetsAsync.java?name=TroubleshootNeedsSchedulerAsync)]

The workaround is to change the thread on which you perform work that takes time. Define a singleton instance of the scheduler for your app.

### <a id="java4-scheduler"></a>Java SDK V4 (Maven com.azure::azure-cosmos) Async API

[!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/documentationsnippets/async/SampleDocumentationSnippetsAsync.java?name=TroubleshootCustomSchedulerAsync)]

You might need to do work that takes time, for example, computationally heavy work or blocking IO. In this case, switch the thread to a worker provided by your `customScheduler` by using the `.publishOn(customScheduler)` API.

### <a id="java4-apply-custom-scheduler"></a>Java SDK V4 (Maven com.azure::azure-cosmos) Async API

[!code-java[](~/azure-cosmos-java-sql-api-samples/src/main/java/com/azure/cosmos/examples/documentationsnippets/async/SampleDocumentationSnippetsAsync.java?name=TroubleshootPublishOnSchedulerAsync)]

By using `publishOn(customScheduler)`, you release the Netty IO thread and switch to your own custom thread provided by the custom scheduler. This modification solves the problem. You won't get a `io.netty.handler.timeout.ReadTimeoutException` failure anymore.

### Request rate too large
This failure is a server-side failure. It indicates that you consumed your provisioned throughput. Retry later. If you get this failure often, consider an increase in the collection throughput.

* **Implement backoff at getRetryAfterInMilliseconds intervals**

    During performance testing, you should increase load until a small rate of requests get throttled. If throttled, the client application should backoff for the server-specified retry interval. Respecting the backoff ensures that you spend minimal amount of time waiting between retries.

### Failure connecting to Azure Cosmos DB Emulator

The Azure Cosmos DB Emulator HTTPS certificate is self-signed. For the SDK to work with the emulator, import the emulator certificate to a Java TrustStore. For more information, see [Export Azure Cosmos DB Emulator certificates](local-emulator-export-ssl-certificates.md).

### Dependency Conflict Issues

The Azure Cosmos DB Java SDK pulls in a number of dependencies; generally speaking, if your project dependency tree includes an older version of an artifact that Azure Cosmos DB Java SDK depends on, this may result in unexpected errors being generated when you run your application. If you are debugging why your application unexpectedly throws an exception, it is a good idea to double-check that your dependency tree is not accidentally pulling in an older version of one or more of the Azure Cosmos DB Java SDK dependencies.

The workaround for such an issue is to identify which of your project dependencies brings in the old version and exclude the transitive dependency on that older version, and allow Azure Cosmos DB Java SDK to bring in the newer version.

To identify which of your project dependencies brings in an older version of something that Azure Cosmos DB Java SDK depends on, run the following command against your project pom.xml file:
```bash
mvn dependency:tree
```
For more information, see the [maven dependency tree guide](https://maven.apache.org/plugins-archives/maven-dependency-plugin-2.10/examples/resolving-conflicts-using-the-dependency-tree.html).

Once you know which dependency of your project depends on an older version, you can modify the dependency on that lib in your pom file and exclude the transitive dependency, following the example below (which assumes that *reactor-core* is the outdated dependency):

```xml
<dependency>
  <groupId>${groupid-of-lib-which-brings-in-reactor}</groupId>
  <artifactId>${artifactId-of-lib-which-brings-in-reactor}</artifactId>
  <version>${version-of-lib-which-brings-in-reactor}</version>
  <exclusions>
    <exclusion>
      <groupId>io.projectreactor</groupId>
      <artifactId>reactor-core</artifactId>
    </exclusion>
  </exclusions>
</dependency>
```

For more information, see the [exclude transitive dependency guide](https://maven.apache.org/guides/introduction/introduction-to-optional-and-excludes-dependencies.html).


## <a name="enable-client-sice-logging"></a>Enable client SDK logging

Azure Cosmos DB Java SDK v4 uses SLF4j as the logging facade that supports logging into popular logging frameworks such as log4j and logback.

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

# Set root logger level to INFO and its only appender to A1.
log4j.rootLogger=INFO, A1

log4j.category.com.azure.cosmos=INFO
#log4j.category.io.netty=OFF
#log4j.category.io.projectreactor=OFF
# A1 is set to be a ConsoleAppender.
log4j.appender.A1=org.apache.log4j.ConsoleAppender

# A1 uses PatternLayout.
log4j.appender.A1.layout=org.apache.log4j.PatternLayout
log4j.appender.A1.layout.ConversionPattern=%d %5X{pid} [%t] %-5p %c - %m%n
```

For more information, see the [sfl4j logging manual](https://www.slf4j.org/manual.html).

## <a name="netstats"></a>OS network statistics
Run the netstat command to get a sense of how many connections are in states such as `ESTABLISHED` and `CLOSE_WAIT`.

On Linux, you can run the following command.
```bash
netstat -nap
```

On Windows, you can run the same command with different argument flags:
```bash
netstat -abn
```

Filter the result to only connections to the Azure Cosmos DB endpoint.

The number of connections to the Azure Cosmos DB endpoint in the `ESTABLISHED` state can't be greater than your configured connection pool size.

Many connections to the Azure Cosmos DB endpoint might be in the `CLOSE_WAIT` state. There might be more than 1,000. A number that high indicates that connections are established and torn down quickly. This situation potentially causes problems. For more information, see the [Common issues and workarounds] section.

 <!--Anchors-->
[Common issues and workarounds]: #common-issues-workarounds
[Enable client SDK logging]: #enable-client-sice-logging
[Connection limit on a host machine]: #connection-limit-on-host
[Azure SNAT (PAT) port exhaustion]: #snat
