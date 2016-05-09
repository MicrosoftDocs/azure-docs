<properties 
	pageTitle="How to troubleshoot Azure Redis Cache | Microsoft Azure" 
	description="Learn how to resolve common issues with Azure Redis Cache." 
	services="redis-cache" 
	documentationCenter="" 
	authors="steved0x" 
	manager="douge" 
	editor=""/>

<tags 
	ms.service="cache" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="cache-redis" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/09/2016" 
	ms.author="sdanie"/>

# How to troubleshoot Azure Redis Cache

-	Convert the Blog post: https://azure.microsoft.com/en-us/blog/investigating-timeout-exceptions-in-stackexchange-redis-for-azure-redis-cache/
-	https://gist.github.com/JonCole/db0e90bedeb3fc4823c2
-	https://gist.github.com/JonCole/9225f783a40564c9879d
-	Copy the ones from FAQ
-	Include tools that a customer can run such as slowlog/ monitor.
-	Goal: Make it readable and actionable.

## Timeout exceptions


## Client side troubleshooting

Diagnosing Redis errors on the *client side*
---------------
Customers periodically ask "Why am I getting errors when talking to Redis".  The answer is complicated - it could be a client or server side problem.  In this article, I am going to talk about client side issues.  For server side issues, [see here](https://gist.github.com/JonCole/9225f783a40564c9879d)

Clients can see connectivity issues or timeouts for several reason, here are some of the common ones I see:

---------------

### Memory pressure on the client

`Problem:` Memory pressure on the client machine leads to all kinds of performance problems that can delay processing of data that was sent by the Redis instance without any delay.  When memory pressure hits, the system typically has to page data from physical memory to virtual memory which is on disk.  This *page faulting* causes the system to slow down significantly.

`Measurement:` 

 1. Monitory memory usage on machine to make sure that it does not exceed available memory.  
 2. Monitor the *Page Faults/Sec* perf counter.  Most systems will have some page faults even during normal operation, so watch for spikes in this page faults perf counter which correspond with timeouts.

`Resolution:` Upgrade to a larger client VM size with more memory or dig into your memory usage patterns to reduce memory consuption.

----------

### Burst of traffic

`Problem:` Bursts of traffic combined with poor ThreadPool settings can result in delays in processing data already sent by the Redis Server but not yet consumed on the client side.

`Measurement:` Monitor how your ThreadPool statistics change over time using code [like this](https://github.com/JonCole/SampleCode/blob/master/ThreadPoolMonitor/ThreadPoolLogger.cs).  You can also look at the TimeoutException message from StackExchange.Redis.  Here is an example :

    System.TimeoutException: Timeout performing EVAL, inst: 8, mgr: Inactive, queue: 0, qu: 0, qs: 0, qc: 0, wr: 0, wq: 0, in: 64221, ar: 0, 
    IOCP: (Busy=6,Free=999,Min=2,Max=1000), WORKER: (Busy=7,Free=8184,Min=2,Max=8191)

In the above message, there are several issues that are interesting:

 1. Notice that in the "IOCP" section and the "WORKER" section you have a "Busy" value that is greater than the "Min" value.  This means that your threadpool settings need adjusting.
 2. You can also see "in: 64221".  This indicates that 64211 bytes have been received at the kernel socket layer but haven't yet been read by the application (e.g. StackExchange.Redis).  This typically means that your application isn't reading data from the network as quickly as the server is sending it to you.

`Resolution:` Configure your [ThreadPool Settings](https://gist.github.com/JonCole/e65411214030f0d823cb) to make sure that your threadpool will scale up quickly under burst scenarios.

----------

### High CPU usage

`Problem:` High CPU usage on the client is an indication that the system cannot keep up with the work that it has been asked to perform.  This means that the client may fail to process a response from Redis in a timely fashion even though Redis sent the response very quickly.

`Measurement:` Monitor the System Wide CPU usage through the azure portal or through the associated perf counter.  Be careful not to monitor *process* CPU because a single process can have low CPU usage at the same time that overall system CPU can be high.  Watch for spikes in CPU usage that correspond with timeouts.  As a result of high CPU, you may also see high "in: XXX" values in TimeoutException error messages as described above in the "Burst of traffic" section.

`Resolution:` Upgrade to a larger VM size with more CPU capacity or investigate what is causing CPU spikes.  

----------

### Client Side Bandwidth Exceeded

`Problem:` Different sized client machines have limitations on how much network bandwidth they have available.  If the client exceeds the available bandwidth, then data will not be processed on the client side as quickly as the server is sending it.  This can lead to timeouts.

`Measurement:` Monitor how your Bandwidth usage change over time using code [like this](https://github.com/JonCole/SampleCode/blob/master/BandWidthMonitor/BandwidthLogger.cs).  Note that this code may not run successfully in some environments with restricted permissions (like Azure WebSites).

`Resolution:` Increase Client VM size or reduce network bandwidth consumption.

----------

### Large Request/Response Size

`Problem:` A large request/response can cause timeouts.  As an example, Suppose your timeout value configured on your client is 1 second.  Your application requests two keys (e.g. 'A' and 'B') at the same time (using the same physical network connection).  Most clients support "Pipelining" of requests, such that both requests 'A' and 'B' are sent on the wire to the server one after the other without waiting for the responses.  The server will send the responses back in the same order.  If response 'A' is large enough it can eat up most of the timeout for subsequent requests.  

Below, I will try to demonstrate this.  In this scenario, Request 'A' and 'B' are sent quickly, the server starts sending responses 'A' and 'B' quickly, but because of data transfer times, 'B' get stuck behind the other request and times out even though the server responded quickly.

    |-------- 1 Second Timeout (A)----------|
    |-Request A-|
         |-------- 1 Second Timeout (B) ----------|
         |-Request B-|
                |- Read Response A --------|
                                           |- Read Response B-| (**TIMEOUT**)



`Measurement:` This is a difficult one to measure.  You basically have to instrument your client code to track large requests and responses.  

`Resolution:` 

 1. Redis is optimized for a large number of small values, rather than a few large values.  The preferred solution is to break up your data into related smaller values.  [See here](https://groups.google.com/forum/#!searchin/redis-db/size/redis-db/n7aa2A4DZDs/3OeEPHSQBAAJ) for details around why smaller values are recommended.
 2. Increase the size of your VM (for client and Redis Cache Server), to get higher bandwidth capabilities, reducing data transfer times for larger responses. Note that getting more bandwidth on just the server or just on the client may not be enough.  Measure your bandwidth usage and compare it to the capabilities of the size of VM you currently have.
 3. Increase the number of ConnectionMultiplexer objects you use and round-robin requests over different connections.






## Server side troubleshooting

Diagnosing Redis errors on the *server side*
---------------
Customers periodically ask "Why am I getting errors when talking to Redis".  The answer is complicated - it could be a client or server side problem.  In this article, I am going to talk about server side issues.  For client side issues, [see here](https://gist.github.com/JonCole/db0e90bedeb3fc4823c2)

Server side delays can be caused by several things like:

### Memory Pressure on the server

`Problem:` Memory pressure on the server side leads to all kinds of performance problems that can delay processing of requests.  When memory pressure hits, the system typically has to page data from physical memory to virtual memory which is on disk.  This *page faulting* causes the system to slow down significantly.  There are several possible causes of this memory pressure: 

 1. You have filled the cache to full capacity with data.  
 2. Redis is seeing high memory fragmentation - most often caused by storing large objects (Redis is optimized for a small objects - [See here](https://groups.google.com/forum/#!searchin/redis-db/size/redis-db/n7aa2A4DZDs/3OeEPHSQBAAJ) for details).  

`Measurement:` Redis exposes two stats that can help you identify this issue.  The first is "used_memory" and the other is "used_memory_rss".  These stats are available through the Azure Portal or through the [Redis INFO](http://redis.io/commands/info) command.

`Resolution:` There are several possible changes that you can make to help keep memory usage healthy:

 1. [Configure a memory policy](https://azure.microsoft.com/en-us/documentation/articles/cache-configure/#maxmemory-policy-and-maxmemory-reserved) and set expiration times on your keys.  Note that this may not be sufficient if you have fragmentation.
 2. [Configure a maxmemory-reserved value](https://azure.microsoft.com/en-us/documentation/articles/cache-configure/#maxmemory-policy-and-maxmemory-reserved) that is large enough to compensate for memory fragmentation.
 3. Break up your large cached objects into smaller related objects.
 4. Upgrade to a larger cache size.

### High CPU usage / Server Load

`Problem:` High CPU usage can mean that the client side can fail to process a response from Redis in a timely fashion even though Redis sent the response very quickly.

`Measurement:` Monitor the System Wide CPU usage through the azure portal or through the associated perf counter.  Be careful not to monitor *process* CPU because a single process can have low CPU usage at the same time that overall system CPU can be high.  Watch for spikes in CPU usage that correspond with timeouts.

`Resolution:` Upgrade to a larger VM size with more CPU capacity or investigate what is causing CPU spikes.  

###Server Side Bandwidth Exceeded

`Problem:` Different sized cache instances have limitations on how much network bandwidth they have available.  If the server exceeds the available bandwidth, then data will not be sent to the client as quickly.  This can lead to timeouts.

`Measurement:` Coming soon...

`Resolution:` Coming soon...


###Running Expensive Operations/Scripts

`Problem:` [See SLOWLOG](http://redis.io/commands/slowlog).  More coming soon...

`Measurement:` coming soon...

`Resolution:` coming soon... 


