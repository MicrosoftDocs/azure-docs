---
title: Azure Cache for Redis management FAQs
description: Learn the answers to common questions that help you manage Azure Cache for Redis
author: yegu-ms
ms.author: yegu
ms.service: cache
ms.topic: conceptual
ms.custom: devx-track-csharp
ms.date: 08/06/2020
---
# Azure Cache for Redis management FAQs
This article provides answers to common questions about how to manage Azure Cache for Redis.

## Common questions and answers
This section covers the following FAQs:

* [When should I enable the non-TLS/SSL port for connecting to Redis?](#when-should-i-enable-the-non-tlsssl-port-for-connecting-to-redis)
* [What are some production best practices?](#what-are-some-production-best-practices)
* [What are some of the considerations when using common Redis commands?](#what-are-some-of-the-considerations-when-using-common-redis-commands)
* [How can I benchmark and test the performance of my cache?](#how-can-i-benchmark-and-test-the-performance-of-my-cache)
* [Important details about ThreadPool growth](#important-details-about-threadpool-growth)
* [Enable server GC to get more throughput on the client when using StackExchange.Redis](#enable-server-gc-to-get-more-throughput-on-the-client-when-using-stackexchangeredis)
* [Performance considerations around connections](#performance-considerations-around-connections)

### When should I enable the non-TLS/SSL port for connecting to Redis?
Redis server does not natively support TLS, but Azure Cache for Redis does. If you are connecting to Azure Cache for Redis and your client supports TLS, like StackExchange.Redis, then you should use TLS.

>[!NOTE]
>The non-TLS port is disabled by default for new Azure Cache for Redis instances. If your client does not support TLS, then you must enable the non-TLS port by following the directions in the [Access ports](cache-configure.md#access-ports) section of the [Configure a cache in Azure Cache for Redis](cache-configure.md) article.
>
>

Redis tools such as `redis-cli` do not work with the TLS port, but you can use a utility such as `stunnel` to securely connect the tools to the TLS port by following the directions in the [Announcing ASP.NET Session State Provider for Redis Preview Release](https://devblogs.microsoft.com/aspnet/announcing-asp-net-session-state-provider-for-redis-preview-release/) blog post.

For instructions on downloading the Redis tools, see the [How can I run Redis commands?](cache-development-faq.md#how-can-i-run-redis-commands) section.

### What are some production best practices?
* [StackExchange.Redis best practices](#stackexchangeredis-best-practices)
* [Configuration and concepts](#configuration-and-concepts)
* [Performance testing](#performance-testing)

#### StackExchange.Redis best practices
* Set `AbortConnect` to false, then let the ConnectionMultiplexer reconnect automatically. [See here for details](https://gist.github.com/JonCole/36ba6f60c274e89014dd#file-se-redis-setabortconnecttofalse-md).
* Reuse the ConnectionMultiplexer - do not create a new one for each request. The `Lazy<ConnectionMultiplexer>` pattern [shown here](cache-dotnet-how-to-use-azure-redis-cache.md#connect-to-the-cache) is recommended.
* Redis works best with smaller values, so consider chopping up bigger data into multiple keys. In [this Redis discussion](https://groups.google.com/forum/#!searchin/redis-db/size/redis-db/n7aa2A4DZDs/3OeEPHSQBAAJ), 100 kb is considered large. Read [this article](https://gist.github.com/JonCole/db0e90bedeb3fc4823c2#large-requestresponse-size) for an example problem that can be caused by large values.
* Configure your [ThreadPool settings](#important-details-about-threadpool-growth) to avoid timeouts.
* Use at least the default connectTimeout of 5 seconds. This interval gives StackExchange.Redis sufficient time to re-establish the connection in the event of a network blip.
* Be aware of the performance costs associated with different operations you are running. For instance, the `KEYS` command is an O(n) operation and should be avoided. The [redis.io site](https://redis.io/commands/) has details around the time complexity for each operation that it supports. Click each command to see the complexity for each operation.

#### Configuration and concepts
* Use Standard or Premium Tier for Production systems. The Basic Tier is a single node system with no data replication and no SLA. Also, use at least a C1 cache. C0 caches are typically used for simple dev/test scenarios.
* Remember that Redis is an **In-Memory** data store. Read [this article](https://gist.github.com/JonCole/b6354d92a2d51c141490f10142884ea4#file-whathappenedtomydatainredis-md) so that you are aware of scenarios where data loss can occur.
* Develop your system such that it can handle connection blips [due to patching and failover](https://gist.github.com/JonCole/317fe03805d5802e31cfa37e646e419d#file-azureredis-patchingexplained-md).

#### Performance testing
* Start by using `redis-benchmark.exe` to get a feel for possible throughput before writing your own perf tests. Because `redis-benchmark` does not support TLS, you must [enable the Non-TLS port through the Azure portal](cache-configure.md#access-ports) before you run the test. For examples, see [How can I benchmark and test the performance of my cache?](#how-can-i-benchmark-and-test-the-performance-of-my-cache)
* The client VM used for testing should be in the same region as your Azure Cache for Redis instance.
* We recommend using Dv2 VM Series for your client as they have better hardware and should give the best results.
* Make sure your client VM you choose has at least as much computing and bandwidth capability as the cache you are testing.
* Enable VRSS on the client machine if you are on Windows. [See here for details](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/dn383582(v=ws.11)).
* Premium tier Redis instances have better network latency and throughput because they are running on better hardware for both CPU and Network.

### What are some of the considerations when using common Redis commands?

* Avoid using certain Redis commands that take a long time to complete, unless you fully understand the impact of these commands. For example, do not run the [KEYS](https://redis.io/commands/keys) command in production. Depending on the number of keys, it could take a long time to return. Redis is a single-threaded server and it processes commands one at a time. If you have other commands issued after KEYS, they will not be processed until Redis processes the KEYS command. The [redis.io site](https://redis.io/commands/) has details around the time complexity for each operation that it supports. Click each command to see the complexity for each operation.
* Key sizes - should I use small key/values or large key/values? It depends on the scenario. If your scenario requires larger keys, you can adjust the ConnectionTimeout, then retry values and adjust your retry logic. From a Redis server perspective, smaller values give better performance.
* These considerations don't mean that you can't store larger values in Redis; you must be aware of the following considerations. Latencies will be higher. If you have one set of data that is larger and one that is smaller, you can use multiple ConnectionMultiplexer instances, each configured with a different set of timeout and retry values, as described in the previous [What do the StackExchange.Redis configuration options do](cache-development-faq.md#what-do-the-stackexchangeredis-configuration-options-do) section.

### How can I benchmark and test the performance of my cache?
* [Enable cache diagnostics](cache-how-to-monitor.md#enable-cache-diagnostics) so you can [monitor](cache-how-to-monitor.md) the health of your cache. You can view the metrics in the Azure portal and you can also [download and review](https://github.com/rustd/RedisSamples/tree/master/CustomMonitoring) them using the tools of your choice.
* You can use redis-benchmark.exe to load test your Redis server.
* Ensure that the load testing client and the Azure Cache for Redis are in the same region.
* Use redis-cli.exe and monitor the cache using the INFO command.
* If your load is causing high memory fragmentation, you should scale up to a larger cache size.
* For instructions on downloading the Redis tools, see the [How can I run Redis commands?](cache-development-faq.md#how-can-i-run-redis-commands) section.

The following commands provide an example of using redis-benchmark.exe. For accurate results, run these commands from a VM in the same region as your cache.

* Test Pipelined SET requests using a 1k payload

  `redis-benchmark.exe -h **yourcache**.redis.cache.windows.net -a **yourAccesskey** -t SET -n 1000000 -d 1024 -P 50`
* Test Pipelined GET requests using a 1k payload.

>[!NOTE]
> Run the SET test shown above first to populate cache
>

  `redis-benchmark.exe -h **yourcache**.redis.cache.windows.net -a **yourAccesskey** -t GET -n 1000000 -d 1024 -P 50`

### Important details about ThreadPool growth
The CLR ThreadPool has two types of threads - "Worker" and "I/O Completion Port" (IOCP) threads.

* Worker threads are used for things like processing the `Task.Run(…)`, or `ThreadPool.QueueUserWorkItem(…)` methods. These threads are also used by various components in the CLR when work needs to happen on a background thread.
* IOCP threads are used when asynchronous IO happens, such as when reading from the network.

The thread pool provides new worker threads or I/O completion threads on demand (without any throttling) until it reaches the "Minimum" setting for each type of thread. By default, the minimum number of threads is set to the number of processors on a system.

Once the number of existing (busy) threads hits the "minimum" number of threads, the ThreadPool will throttle the rate at which it injects new threads to one thread per 500 milliseconds. Typically, if your system gets a burst of work needing an IOCP thread, it will process that work quickly. However, if the burst of work is more than the configured "Minimum" setting, there will be some delay in processing some of the work as the ThreadPool waits for one of two things to happen.

* An existing thread becomes free to process the work.
* No existing thread becomes free for 500 ms, so a new thread is created.

Basically, it means that when the number of Busy threads is greater than Min threads, you are likely paying a 500-ms delay before network traffic is processed by the application. Also, it is important to note that when an existing thread stays idle for longer than 15 seconds (based on what I remember), it will be cleaned up and this cycle of growth and shrinkage can repeat.

If we look at an example error message from StackExchange.Redis (build 1.0.450 or later), you will see that it now prints ThreadPool statistics (see IOCP and WORKER details below).

```
System.TimeoutException: Timeout performing GET MyKey, inst: 2, mgr: Inactive,
queue: 6, qu: 0, qs: 6, qc: 0, wr: 0, wq: 0, in: 0, ar: 0,
IOCP: (Busy=6,Free=994,Min=4,Max=1000),
WORKER: (Busy=3,Free=997,Min=4,Max=1000)
```

In the previous example, you can see that for IOCP thread there are six busy threads and the system is configured to allow four minimum threads. In this case, the client would have likely seen two 500-ms delays, because 6 > 4.

Note that StackExchange.Redis can hit timeouts if growth of either IOCP or WORKER threads gets throttled.

#### Recommendation

Given this information, we strongly recommend that customers set the minimum configuration value for IOCP and WORKER threads to something larger than the default value. We can't give one-size-fits-all guidance on what this value should be because the right value for one application will likely be too high or low for another application. This setting can also impact the performance of other parts of complicated applications, so each customer needs to fine-tune this setting to their specific needs. A good starting place is 200 or 300, then test and tweak as needed.

How to configure this setting:

* We recommend changing this setting programmatically by using the [ThreadPool.SetMinThreads (...)](/dotnet/api/system.threading.threadpool.setminthreads#System_Threading_ThreadPool_SetMinThreads_System_Int32_System_Int32_) method in `global.asax.cs`. For example:

    ```csharp
    private readonly int minThreads = 200;
    void Application_Start(object sender, EventArgs e)
    {
        // Code that runs on application startup
        AreaRegistration.RegisterAllAreas();
        RouteConfig.RegisterRoutes(RouteTable.Routes);
        BundleConfig.RegisterBundles(BundleTable.Bundles);
        ThreadPool.SetMinThreads(minThreads, minThreads);
    }
    ```

    > [!NOTE]
    > The value specified by this method is a global setting, affecting the whole AppDomain. For example, if you have a 4-core machine and want to set *minWorkerThreads* and *minIoThreads* to 50 per CPU during run-time, you would use **ThreadPool.SetMinThreads(200, 200)**.

* It is also possible to specify the minimum threads setting by using the [*minIoThreads* or *minWorkerThreads* configuration setting](/previous-versions/dotnet/netframework-4.0/7w2sway1(v=vs.100)) under the `<processModel>` configuration element in `Machine.config`, usually located at `%SystemRoot%\Microsoft.NET\Framework\[versionNumber]\CONFIG\`. **Setting the number of minimum threads in this way is generally not recommended, because it is a System-wide setting.**

  > [!NOTE]
  > The value specified in this configuration element is a *per-core* setting. For example, if you have a 4-core machine and want your *minIoThreads* setting to be 200 at runtime, you would use `<processModel minIoThreads="50"/>`.
  >

### Enable server GC to get more throughput on the client when using StackExchange.Redis
Enabling server GC can optimize the client and provide better performance and throughput when using StackExchange.Redis. For more information on server GC and how to enable it, see the following articles:

* [To enable server GC](/dotnet/framework/configure-apps/file-schema/runtime/gcserver-element)
* [Fundamentals of Garbage Collection](/dotnet/standard/garbage-collection/fundamentals)
* [Garbage Collection and Performance](/dotnet/standard/garbage-collection/performance)

### Performance considerations around connections

Each pricing tier has different limits for client connections, memory, and bandwidth. While each size of cache allows *up to* a certain number of connections, each connection to Redis has overhead associated with it. An example of such overhead would be CPU and memory usage as a result of TLS/SSL encryption. The maximum connection limit for a given cache size assumes a lightly loaded cache. If load from connection overhead *plus* load from client operations exceeds capacity for the system, the cache can experience capacity issues even if you have not exceeded the connection limit for the current cache size.

For more information about the different connections limits for each tier, see [Azure Cache for Redis pricing](https://azure.microsoft.com/pricing/details/cache/). For more information about connections and other default configurations, see [Default Redis server configuration](cache-configure.md#default-redis-server-configuration).

## Next steps

Learn about other [Azure Cache for Redis FAQs](cache-faq.md).