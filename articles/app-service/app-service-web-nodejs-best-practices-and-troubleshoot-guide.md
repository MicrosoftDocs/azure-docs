---
title: Node.js Best Practices and Troubleshooting
description: Learn about best practices and troubleshooting steps for Node.js applications running in Azure App Service.
author: msangapu-msft

ms.assetid: 387ea217-7910-4468-8987-9a1022a99bef
ms.devlang: javascript
ms.topic: best-practice
ms.date: 12/01/2025
ms.author: msangapu
ms.custom: devx-track-js
ms.service: azure-app-service
# customer intent: As a developer, I want to learn best practices for Node.js applications that run in App Service so that I can use these apps more effectively.

---
# Best practices and troubleshooting for Node.js

In this article, you learn about best practices and troubleshooting for [Node.js applications](quickstart-nodejs.md) that run on Azure App Service with [iisnode](https://github.com/azure/iisnode).

> [!WARNING]
> Use caution when you troubleshoot problems your production site. We recommend that you troubleshoot your app on a nonproduction setup, such as your staging slot. When the issue is fixed, swap your staging slot with your production slot.
>

## iisnode configuration

This [schema file](https://github.com/Azure/iisnode/blob/master/src/config/iisnode_schema_x64.xml) shows all the settings that you can configure for iisnode. Some settings that are useful for your application include:

### nodeProcessCountPerApplication

This setting controls the number of node processes that are launched per IIS application. The default value is *1*. You can launch as many node.exe processes as your virtual machine vCPU count by changing the value to *0*. The recommended value is 0 for most applications so that you can use all of the vCPUs on your machine. Node.exe is single-threaded so one node.exe consumes a maximum of 1 vCPU. To get maximum performance out of your node application, use all vCPUs.

### nodeProcessCommandLine

This setting controls the path to the node.exe. You can set this value to point to your node.exe version.

### maxConcurrentRequestsPerProcess

This setting controls the maximum number of concurrent requests sent by iisnode to each node.exe. On Azure App Service, the default value is *Infinite*. You can configure the value depending on how many requests your application receives and how fast your application processes each request.

### maxNamedPipeConnectionRetry

This setting controls the maximum number of times iisnode retries making the connection on the named pipe to send the requests to node.exe. This setting in combination with namedPipeConnectionRetryDelay determines the total timeout of each request within iisnode. The default value is *200* on Azure App Service. `Total Timeout in seconds = (maxNamedPipeConnectionRetry * namedPipeConnectionRetryDelay) / 1000`

### namedPipeConnectionRetryDelay

This setting controls the amount of time (in ms) that iisnode waits between each retry to send the request to node.exe over the named pipe. The default value is *250* ms. `Total Timeout in seconds = (maxNamedPipeConnectionRetry * namedPipeConnectionRetryDelay) / 1000`

By default, the total timeout in iisnode on App Service is `200 * 250 ms = 50 seconds`.

### logDirectory

This setting controls the directory where iisnode logs stdout/stderr. The default value is *iisnode*, which is relative to the main script directory (where main *server.js* is present).

### debuggerExtensionDll

This setting controls what version of node-inspector that iisnode uses when debugging your node application. Currently, *iisnode-inspector-0.7.3.dll* and *iisnode-inspector.dll* are the only two valid values for this setting. The default value is *iisnode-inspector-0.7.3.dll*. The iisnode-inspector-0.7.3.dll version uses node-inspector-0.7.3 and uses web sockets. Enable web sockets on your Azure web app to use this version. 

### flushResponse

By default, IIS buffers response data up to 4 MB before flushing, or until the end of the response, whichever comes first. iisnode offers a configuration setting to override this behavior: to flush a fragment of the response entity body as soon as iisnode receives it from node.exe, you need to set the `iisnode/@flushResponse` attribute in *web.config* to *true*.

```xml
<configuration>
    <system.webServer>
        <!-- ... -->
        <iisnode flushResponse="true" />
    </system.webServer>
</configuration>
```

Enabling the flushing of every fragment of the response entity body adds performance overhead that reduces the throughput of the system by ~5% (as of v0.1.13). It's best to scope this setting only to endpoints that require response streaming (for example, using the `<location>` element in *web.config*).

In addition, for streaming applications, you must set `responseBufferLimit` of your iisnode handler to *0*.

```xml
<handlers>
    <add name="iisnode" path="app.js" verb="\*" modules="iisnode" responseBufferLimit="0"/>
</handlers>
```

### watchedFiles

A semi-colon separated list of files that are watched for changes. Any change to a file causes the application to recycle. Each entry consists of an optional directory name and a required file name, which are relative to the directory where the main application entry point is located. Wild cards are allowed in the file name portion only. The default value is `*.js;iisnode.yml`

### recycleSignalEnabled

The default value is *false*. If enabled, your node application can connect to a named pipe (environment variable `IISNODE_CONTROL_PIPE`) and send a *recycle* message. This causes the w3wp to recycle gracefully.

### idlePageOutTimePeriod

The default value is *0*, which means this feature is disabled. When set to some value greater than 0, iisnode pages out all its child processes every *idlePageOutTimePeriod* milliseconds. To understand what *page out* means, see [EmptyWorkingSet function](/windows/desktop/api/psapi/nf-psapi-emptyworkingset). This setting is useful for applications that consume a high amount of memory and want to page out memory to disk occasionally to free up RAM.

> [!WARNING]
> Use caution when enabling the following configuration settings on production applications. The recommendation is to not enable them on live production applications.
>

### debugHeaderEnabled

The default value is *false*. If set to *true*, iisnode adds an HTTP response header `iisnode-debug` to every HTTP response it sends the `iisnode-debug` header value is a URL. Individual pieces of diagnostic information can be obtained by looking at the URL fragment, however, a visualization is available by opening the URL in a browser.

### loggingEnabled

This setting controls the logging of stdout and stderr by iisnode. iisnode captures stdout/stderr from node processes it launches and writes to the directory specified in the *logDirectory* setting. Once this is enabled, your application writes logs to the file system and depending on the amount of logging done by the application, there could be performance implications.

### devErrorsEnabled

The default value is *false*. When set to *true*, iisnode displays the HTTP status code and Win32 error code on your browser. The Win32 code is helpful in debugging certain types of issues.

### debuggingEnabled

**Do not enable on live production site.**

This setting controls the debugging feature. iisnode is integrated with node-inspector. By enabling this setting, you enable debugging of your node application. Upon enabling this setting, iisnode creates node-inspector files in the *debuggerVirtualDir* directory on the first debug request to your node application. You can load the node-inspector by sending a request to `http://yoursite/server.js/debug`. You can control the debug URL segment with the `debuggerPathSegment` setting. By default, debuggerPathSegment='debug'. You can set `debuggerPathSegment` to a GUID, for example, so that it's more difficult to be discovered by others.

## Scenarios and recommendations/troubleshooting

### My node application is making excessive outbound calls

Many applications want to make outbound connections as part of their regular operation. For example, when a request comes in, your node app wants to contact a REST API elsewhere and get some information to process the request. You would want to use a keep alive agent when making HTTP or HTTPS calls. You could use the agentkeepalive module as your keep alive agent when making these outbound calls.

The agentkeepalive module ensures that sockets are reused on your Azure web app VM. Creating a new socket on each outbound request adds overhead to your application. Having your application reuse sockets for outbound requests ensures that your application doesn't exceed the maxSockets that are allocated per VM. The recommendation on Azure App Service is to set the agentKeepAlive maxSockets value to a total of `(four instances of node.exe * 32 maxSockets/instance) 128 sockets per VM`.

Example [agentKeepALive](https://www.npmjs.com/package/agentkeepalive) configuration:

```nodejs
let keepaliveAgent = new Agent({
    maxSockets: 32,
    maxFreeSockets: 10,
    timeout: 60000,
    freeSocketTimeout: 300000
});
```

> [!IMPORTANT]
> This example assumes you have four node.exe instances running on your VM. If you have a different number, you must modify the maxSockets setting accordingly.
>

#### My node application consumes too much CPU

You might receive a recommendation from Azure App Service on your portal about high CPU consumption. You can also set up monitors to watch for certain [metrics](web-sites-monitor.md). When checking the CPU usage on the [Azure portal dashboard](/azure/azure-monitor/metrics/analyze-metrics), check the MAX values for CPU so you don't miss the peak values. If you believe your application consumes too much CPU and you can't explain why, you can profile your node application to find out.

### My node application consumes too much memory

If your application consumes too much memory, you see a notice from Azure App Service on your portal about high memory consumption. You can set up monitors to watch for certain [metrics](web-sites-monitor.md). When checking the memory usage on the [Azure portal dashboard](/azure/azure-monitor/metrics/analyze-metrics), be sure to check the MAX values for memory so you don’t miss the peak values.

#### Leak detection and Heap Diff for Node.js

You could use [node-memwatch](https://github.com/lloyd/node-memwatch) to help you identify memory leaks. You can install `memwatch` just like v8-profiler and edit your code to capture and diff heaps to identify the memory leaks in your application.

### My node.exe instances are getting killed randomly

There are a few reasons why node.exe shuts down randomly:

- Your application is throwing uncaught exceptions. Check *d:\\home\\LogFiles\\Application\\logging-errors.txt* file for details on the exception thrown. This file has the stack trace to help debug and fix your application.
- Your application consumes too much memory, which affects other processes from getting started. If the total VM memory is close to 100%, your node.exe instances could be killed by the process manager. Process manager kills some processes to let other processes get a chance to do some work. To fix this issue, profile your application for memory leaks. If your application requires large amounts of memory, scale up to a larger VM (which increases the RAM available to the VM).

### My node application doesn't start

If your application is returning 500 errors when it starts, there could be a few reasons:

- Node.exe isn't present at the correct location. Check the `nodeProcessCommandLine` setting.
- Main script file isn't present at the correct location. Check *web.config* and make sure the name of the main script file in the handlers section matches the main script file.
- *Web.config* configuration isn't correct. Check the settings names and values.
- Cold start: Your application takes too long to start. If your application takes longer than `(maxNamedPipeConnectionRetry * namedPipeConnectionRetryDelay) / 1,000 seconds`, iisnode returns a 500 error. Increase the values of these settings to match your application start time to prevent iisnode from timing out and returning the 500 error.

### My node application crashed

Your application is throwing uncaught exceptions. Check *d:\\home\\LogFiles\\Application\\logging-errors.txt* for the details on the exception thrown. This file has the stack trace to help diagnose and fix your application.

### My node application takes too much time to start (cold start)

The common cause for long application start times is a high number of files in the node\_modules. The application tries to load most of these files when starting. By default, since your files are stored on the network share on Azure App Service, loading many files can take time. Some solutions to make this process faster are:

- Try to lazy load your node\_modules and not load all of the modules at application start. To Lazy load modules, the call to require('module') should be made when you actually need the module within the function before the first execution of module code.
- Azure App Service offers a feature called local cache. This feature copies your content from the network share to the local disk on the VM. Since the files are local, the load time of node\_modules is much faster.

## iisnode HTTP status and substatus

The [cnodeconstants](https://github.com/Azure/iisnode/blob/master/src/iisnode/cnodeconstants.h) source file lists all of the possible status or substatus combinations iisnode can return due to an error.

Enable FREB for your application to see the Win32 error code. Be sure you enable FREB only on non-production sites for performance reasons.

| HTTP status | HTTP substatus | Possible reason |
| --- | --- | --- |
| 500 |1000 |There was some issue dispatching the request to iisnode. Check if node.exe was started. Node.exe might have crashed when starting. Check your *web.config* configuration for errors. |
| 500 |1001 |- Win32Error 0x2: App isn't responding to the URL. Check the URL rewrite rules or check if your express app has the correct routes defined. <br> - Win32Error 0x6d: Named pipe is busy. Node.exe isn't accepting requests because the pipe is busy. Check high cpu usage. <br> - Other errors: Check if node.exe crashed. |
| 500 |1002 |Node.exe crashed. Check *d:\\home\\LogFiles\\logging-errors.txt* for stack trace. |
| 500 |1003 |Pipe configuration Issue. The named pipe configuration is incorrect. |
| 500 |1004-1018 |There was some error while sending the request or processing the response to/from node.exe. Check if node.exe crashed. Check *d:\\home\\LogFiles\\logging-errors.txt* for stack trace. |
| 503 |1000 |Not enough memory to allocate more named pipe connections. Check why your app is consuming so much memory. Check `maxConcurrentRequestsPerProcess` setting value. If it's not infinite and you have many requests, increase this value to prevent this error. |
| 503 |1001 |Request couldn't be dispatched to node.exe because the application is recycling. After the application is recycled, requests should be served normally. |
| 503 |1002 |Check Win32 error code for actual reason. Request couldn't be dispatched to a node.exe. |
| 503 |1003 |Named pipe is too busy. Verify if node.exe is consuming excessive CPU. |

Node.exe has a setting called `NODE_PENDING_PIPE_INSTANCES`. On Azure App Service, this value is set to *5000*, which means that node.exe can accept 5,000 requests at a time on the named pipe. This value should be good enough for most node applications running on Azure App Service. You shouldn't see 503.1003 on Azure App Service because of the high value for the `NODE_PENDING_PIPE_INSTANCES`.

## Related content

* [Deploy a Node.js web app in Azure](quickstart-nodejs.md)
* [Configure a Node.js app for Azure App Service](configure-language-nodejs.md)
* [Azure Remote Debugging for Node.js](https://code.visualstudio.com/docs/azure/remote-debugging)
