---
title: Troubleshoot Azure Cache for Redis client-side issues
description: Learn how to resolve common client-side issues with Azure Cache for Redis such as Redis client memory pressure, traffic burst, high CPU, limited bandwidth, large requests or large response size.
author: yegu-ms
ms.author: yegu
ms.service: cache
ms.topic: troubleshooting
ms.date: 10/18/2019
---
# Troubleshoot Azure Cache for Redis client-side issues

This section discusses troubleshooting issues that occur because of a condition on the Redis client that your application uses.

- [Memory pressure on Redis client](#memory-pressure-on-redis-client)
- [Traffic burst](#traffic-burst)
- [High client CPU usage](#high-client-cpu-usage)
- [Client-side bandwidth limitation](#client-side-bandwidth-limitation)
- [Large request or response size](#large-request-or-response-size)

## Memory pressure on Redis client

Memory pressure on the client machine leads to all kinds of performance problems that can delay processing of responses from the cache. When memory pressure hits, the system may page data to disk. This _page faulting_ causes the system to slow down significantly.

To detect memory pressure on the client:

- Monitor memory usage on machine to make sure that it doesn't exceed available memory.
- Monitor the client's `Page Faults/Sec` performance counter. During normal operation, most systems have some page faults. Spikes in page faults corresponding with request timeouts can indicate memory pressure.

High memory pressure on the client can be mitigated several ways:

- Dig into your memory usage patterns to reduce memory consumption on the client.
- Upgrade your client VM to a larger size with more memory.

## Traffic burst

Bursts of traffic combined with poor `ThreadPool` settings can result in delays in processing data already sent by the Redis Server but not yet consumed on the client side.

Monitor how your `ThreadPool` statistics change over time using [an example `ThreadPoolLogger`](https://github.com/JonCole/SampleCode/blob/master/ThreadPoolMonitor/ThreadPoolLogger.cs). You can use  `TimeoutException` messages from StackExchange.Redis like below to further investigate:

    System.TimeoutException: Timeout performing EVAL, inst: 8, mgr: Inactive, queue: 0, qu: 0, qs: 0, qc: 0, wr: 0, wq: 0, in: 64221, ar: 0,
    IOCP: (Busy=6,Free=999,Min=2,Max=1000), WORKER: (Busy=7,Free=8184,Min=2,Max=8191)

In the preceding exception, there are several issues that are interesting:

- Notice that in the `IOCP` section and the `WORKER` section you have a `Busy` value that is greater than the `Min` value. This difference means your `ThreadPool` settings need adjusting.
- You can also see `in: 64221`. This value indicates that 64,211 bytes have been received at the client's kernel socket layer but haven't been read by the application. This difference typically means that your application (for example, StackExchange.Redis) isn't reading data from the network as quickly as the server is sending it to you.

You can [configure your `ThreadPool` Settings](cache-faq.md#important-details-about-threadpool-growth) to make sure that your thread pool scales up quickly under burst scenarios.

## High client CPU usage

High client CPU usage indicates the system can't keep up with the work it's been asked to do. Even though the cache sent the response quickly, the client may fail to process the response in a timely fashion.

Monitor the client's system-wide CPU usage using metrics available in the Azure portal or through performance counters on the machine. Be careful not to monitor *process* CPU because a single process can have low CPU usage but the system-wide CPU can be high. Watch for spikes in CPU usage that correspond with timeouts. High CPU may also cause high `in: XXX` values in `TimeoutException` error messages as described in the [Traffic burst](#traffic-burst) section.

> [!NOTE]
> StackExchange.Redis 1.1.603 and later includes the `local-cpu` metric in `TimeoutException` error messages. Ensure you using the latest version of the [StackExchange.Redis NuGet package](https://www.nuget.org/packages/StackExchange.Redis/). There are bugs constantly being fixed in the code to make it more robust to timeouts so having the latest version is important.
>

To mitigate a client's high CPU usage:

- Investigate what is causing CPU spikes.
- Upgrade your client to a larger VM size with more CPU capacity.

## Client-side bandwidth limitation

Depending on the architecture of client machines, they may have limitations on how much network bandwidth they have available. If the client exceeds the available bandwidth by overloading network capacity, then data isn't processed on the client side as quickly as the server is sending it. This situation can lead to timeouts.

Monitor how your Bandwidth usage change over time using [an example `BandwidthLogger`](https://github.com/JonCole/SampleCode/blob/master/BandWidthMonitor/BandwidthLogger.cs). This code may not run successfully in some environments with restricted permissions (like Azure web sites).

To mitigate, reduce network bandwidth consumption or increase the client VM size to one with more network capacity.

## Large request or response Size

A large request/response can cause timeouts. As an example, suppose your timeout value configured on your client is 1 second. Your application requests two keys (for example, 'A' and 'B') at the same time (using the same physical network connection). Most clients support request "pipelining", where both requests 'A' and 'B' are sent one after the other without waiting for their responses. The server sends the responses back in the same order. If response 'A' is large, it can eat up most of the timeout for later requests.

In the following example, request 'A' and 'B' are sent quickly to the server. The server starts sending responses 'A' and 'B' quickly. Because of data transfer times, response 'B' must wait behind response 'A' times out even though the server responded quickly.

    |-------- 1 Second Timeout (A)----------|
    |-Request A-|
         |-------- 1 Second Timeout (B) ----------|
         |-Request B-|
                |- Read Response A --------|
                                           |- Read Response B-| (**TIMEOUT**)

This request/response is a difficult one to measure. You could instrument your client code to track large requests and responses.

Resolutions for large response sizes are varied but include:

1. Optimize your application for a large number of small values, rather than a few large values.
    - The preferred solution is to break up your data into related smaller values.
    - See the post [What is the ideal value size range for redis? Is 100 KB too large?](https://groups.google.com/forum/#!searchin/redis-db/size/redis-db/n7aa2A4DZDs/3OeEPHSQBAAJ) for details on why smaller values are recommended.
1. Increase the size of your VM to get higher bandwidth capabilities
    - More bandwidth on your client or server VM may reduce data transfer times for larger responses.
    - Compare your current network usage on both machines to the limits of your current VM size. More bandwidth on only the server or only on the client may not be enough.
1. Increase the number of connection objects your application uses.
    - Use a round-robin approach to make requests over different connection objects.

## Additional information

- [Troubleshoot Azure Cache for Redis server-side issues](cache-troubleshoot-server.md)
- [How can I benchmark and test the performance of my cache?](cache-faq.md#how-can-i-benchmark-and-test-the-performance-of-my-cache)
