Best practices and troubleshooting guide for node applications on Azure Web Apps
================================================================================

This blog describes best practices and troubleshooting steps for node applications running on Azure Webapps (with [iisnode](https://github.com/azure/iisnode)).

Sections
--------

1.  IISNODE configuration (details and recommendations)

2.  Scenarios and recommendations/troubleshooting.

    1.  Too many outbound calls

    2.  Too much CPU

        1.  Profiling node applications

    3.  Too much memory

        1.  Leak detection and heap diffs

    4.  Node.exe gets killed randomly

    5.  Node.exe does not start

    6.  Node application crashed.

    7.  Node application startup is slow (cold start)

3.  What do IISNODE http status and substatus mean?

*NOTE:* Use Caution when using troubleshooting steps on your PRODUCTION site. Recommendation is to troubleshoot your app on a non-production setup for example your staging slot and when the issue is fixed, swap your staging slot with your production slot.

IISNODE Configuration
---------------------

<https://github.com/Azure/iisnode/blob/master/src/config/iisnode_schema_x64.xml> shows all the settings that can be configured for iisnode. Some of the settings that will be useful for your application are:

1.  ####nodeProcessCountPerApplication

    This setting controls the number of node processes that are launched per IIS application. Default value is 1. You can launch as many node.exe’s as your VM core count by setting this to 0. Recommended value is 0 for most application so you can utilize all of the cores on your machine. Node.exe is single threaded so one node.exe will consume a maximum of 1 core and to get maximum performance out of your node application you would want to utilize all cores.

2.  ####nodeProcessCommandLine

    This setting controls the path to the node.exe. You can set this value to point to your node.exe version.

3.  ####maxConcurrentRequestsPerProcess

    This setting controls the maximum number of concurrent requests sent by iisnode to each node.exe. On azure webapps, the default value for this is Infinite. You will not have to worry about this setting. Outside azure webapps, the default value is 1024. You might want to configure this depending on how many requests your application gets and how fast your application processes each request.

4.  ####maxNamedPipeConnectionRetry

    This setting controls the maximum number of times iisnode will retry making connection on the named pipe to send the request over to node.exe. This setting in combination with namedPipeConnectionRetryDelay determines the total timeout of each request within iisnode. Default value is 200 on Azure Webapps. Total Timeout in seconds = (maxNamedPipeConnectionRetry \* namedPipeConnectionRetryDelay) / 1000

5.  ####namedPipeConnectionRetryDelay

    This setting controls the amount of time (in ms) iisnode will wait for between each retry to send request to node.exe over the named pipe. Default value is 250ms.
    Total Timeout in seconds = (maxNamedPipeConnectionRetry \* namedPipeConnectionRetryDelay) / 1000

    By default the total timeout in iisnode on azure webapps is 200 \* 250ms = 50 seconds.

6.  ####logDirectory

    This setting controls the directory where iisnode will log stdout/stderr. Default value is iisnode which is relative to the main script directory (directory where main server.js is present)

7.  ####debuggingEnabled (do not enable on live production site)

    This setting controls debugging feature. Iisnode is integrated with node-inspector. By enabling this setting, you enable debugging of your node application. Once this setting is enabled, iisnode will layout the necessary node-inspector files in ‘debuggerVirtualDir’ directory on the first debug request to your node application. You can load the node-inspector by sending a request to <http://yoursite/server.js/debug>. You can control the debug URL segment with ‘debuggerPathSegment’ setting. By default debuggerPathSegment=’debug’. You can set this to a GUID for example so that it is more difficult to be discovered by others.

    Check this link for more details on debugging - <https://tomasz.janczuk.org/2011/11/debug-nodejs-applications-on-windows.html>

8.  ####debuggerExtensionDll

    This setting controls what version of node-inspector iisnode will use when debugging your node application. Currently iisnode-inspector-0.7.3.dll and iisnode-inspector.dll are the only 2 valid values for this setting. Default value is iisnode-inspector-0.7.3.dll. iisnode-inspector-0.7.3.dll version uses node-inspector-0.7.3 and uses websockets, so you will need to enable websockets on your azure webapp to use this version. See <http://www.ranjithr.com/?p=98> for more details on how to configure iisnode to use the new node-inspector.

9.  ####debugHeaderEnabled (do not enable on live production site)

    The default value is false. If set to true, iisnode will add an HTTP response header iisnode-debug to every HTTP response it sends the iisnode-debug header value is a URL. Individual pieces of diagnostic information can be gleaned by looking at the URL fragment, but a much better visualization is achieved by opening the URL in the browser.

10. ####loggingEnabled (try not to enable on live production site)

    This setting controls the logging of stdout and stderr by iisnode. Iisnode will capture stdout/stderr from node processes it launches and write to the directory specified in the ‘logDirectory’ setting.

11. ####devErrorsEnabled (do not enable on live production site)

    Default value is false. When set to true, iisnode will display the HTTP status code and Win32 error code on your browser. The win32 code will be helpful in debugging certain types of issues.

12. ####flushResponse

    The default behavior of IIS is that it buffers response data up to 4MB before flushing, or until the end of the response, whichever comes first. iisnode offers a configuration setting to override this behavior: to flush a fragment of the response entity body as soon as iisnode receives it from node.exe, you need to set the iisnode/@flushResponse attribute in web.config to 'true':
    
    <code>
    &lt;configuration&gt;
    
    &nbsp;&nbsp;&nbsp;&nbsp;&lt;system.webServer&gt;

    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;!-- ... --&gt;

    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;iisnode flushResponse="true" /&gt;

    &nbsp;&nbsp;&nbsp;&nbsp;&lt;/system.webServer&gt;

    &lt;/configuration&gt;
    </code>

    Enabling flushing of every fragment of the response entity body adds performance overhead that reduces the throughput of the system by ~5% (as of v0.1.13), so it is best to scope this setting only to endpoints that require response streaming (e.g. using the &lt;location&gt; element in the web.config)

    In addition to this, for streaming applications, you will need to also set responseBufferLimit of your iisnode handler to 0.
    
    <code>
    
    &lt;handlers&gt;

    &nbsp;&nbsp;&nbsp;&nbsp;&lt;add name="iisnode" path="app.js" verb="\*" modules="iisnode" responseBufferLimit="0"/&gt;

    &lt;/handlers&gt;
    </code>

13. ####watchedFiles

    This is a semi-colon separated list of files that will be watched for changes. A change to a file causes the application to recycle. Each entry consists of an optional directory name plus required file name which are relative to the directory where the main application entry point is located. Wild cards are allowed in the file name portion only. Default value is “\*.js;web.config”

14. ####recycleSignalEnabled

    Default value is false. If enabled, your node application can connect to a named pipe (environment variable IISNODE\_CONTROL\_PIPE) and send a “recycle” message. This will cause the w3wp to recycle gracefully.

15. ####idlePageOutTimePeriod

    Default value is 0 which means this feature is disabled. When set to some value greater than 0, iisnode will page out all its child processes every ‘idlePageOutTimePeriod’ milliseconds. To understand what page out means, please refer to <https://msdn.microsoft.com/en-us/library/windows/desktop/ms682606(v=vs.85).aspx>. This setting will be useful for applications that consume a lot of memory and want to pageout memory to disk occasionally to free up some RAM.

Scenarios
=========

1. My node application is making too many outbound calls.
------------------------------------------------------

Many applications would want to make outbound connections as part of their regular operation. For example, when a request comes in, your node app would want to contact a REST API elsewhere and get some information to process the request. You would want to use a keep alive agent when making http or https calls. For example, you could use the agentkeepalive module as your keep alive agent when making these outbound calls. This makes sure that the sockets are reused on your azure webapp VM and reducing the overhead of creating new sockets for every outbound request. Also, this makes sure that you are using less number of sockets to make many outbound requests and therefore you don’t exceed the maxSockets that are allocated per VM. Recommendation on Azure Webapps would be to set the agentKeepAlive maxSockets value to a total of 160 sockets per VM. This means that if you have 4 node.exe running on the VM, you would want to set the agentKeepAlive maxSockets to 40 per node.exe which is 160 total per VM.

Example agentKeepALive configuration:

<code>
var keepaliveAgent = new Agent({

&nbsp;&nbsp;&nbsp;&nbsp;maxSockets: 40,

&nbsp;&nbsp;&nbsp;&nbsp;maxFreeSockets: 10,

&nbsp;&nbsp;&nbsp;&nbsp;timeout: 60000,

&nbsp;&nbsp;&nbsp;&nbsp;keepAliveTimeout: 300000

});
</code>

This example assumes you have 4 node.exe running on your VM. If you have a different number of node.exe running on the VM, you will have to modify the maxSockets setting accordingly.

2. My node application is consuming too much CPU.
----------------------------------------------

You will probably get a recommendation from Azure Webapps on your portal about high cpu consumption. You can also setup monitors to watch for certain metrics - <https://azure.microsoft.com/en-us/documentation/articles/web-sites-monitor/>. When checking the CPU usage on the Azure Portal Dashboard as shown here <https://azure.microsoft.com/en-us/documentation/articles/app-insights-web-monitor-performance/>, please check the MAX values for CPU so you don’t miss out the peak values.
In cases where you think your application is consuming too much CPU and you cannot explain why, you will need to profile your node application.

### 

### Profiling your node application on azure webapps with V8-Profiler

For example, lets say you have a hello world app that you want to profile as shown below:

<code>
var http = require('http');

function WriteConsoleLog()
{

&nbsp;&nbsp;&nbsp;&nbsp;for(var i=0;i&lt;99999;++i) {

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log('hello world');

&nbsp;&nbsp;&nbsp;&nbsp;}

}

function HandleRequest() {

&nbsp;&nbsp;&nbsp;&nbsp;WriteConsoleLog();

}

http.createServer(function (req, res) {

&nbsp;&nbsp;&nbsp;&nbsp;res.writeHead(200, {'Content-Type': 'text/html'});

&nbsp;&nbsp;&nbsp;&nbsp;HandleRequest();

&nbsp;&nbsp;&nbsp;&nbsp;res.end('Hello world!');

}).listen(process.env.PORT);
</code>

Go to your scm site – <https://&lt;yoursite&gt;.scm.azurewebsites.net/DebugConsole>

You will see a command prompt as shown below. Go into your site/wwwroot directory

![](./media/app-service-web-nodejs-best-practices-and-troubleshoot-guide/scm_install_v8.png)

Run the command “npm install v8-profiler”

This should install v8-profiler under node\_modules directory and all of its dependencies.
Now, edit your server.js to profile your application.

<code>
var http = require('http');

var profiler = require('v8-profiler');

var fs = require('fs');

function WriteConsoleLog() {

&nbsp;&nbsp;&nbsp;&nbsp;for(var i=0;i&lt;99999;++i) {

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log('hello world');

&nbsp;&nbsp;&nbsp;&nbsp;}

}

function HandleRequest() {

&nbsp;&nbsp;&nbsp;&nbsp;profiler.startProfiling('HandleRequest');

&nbsp;&nbsp;&nbsp;&nbsp;WriteConsoleLog();

&nbsp;&nbsp;&nbsp;&nbsp;fs.writeFileSync('profile.cpuprofile', JSON.stringify(profiler.stopProfiling('HandleRequest')));

}

http.createServer(function (req, res) {

&nbsp;&nbsp;&nbsp;&nbsp;res.writeHead(200, {'Content-Type': 'text/html'});

&nbsp;&nbsp;&nbsp;&nbsp;HandleRequest();

&nbsp;&nbsp;&nbsp;&nbsp;res.end('Hello world!');

}).listen(process.env.PORT);
</code>

The above changes will profile the WriteConsoleLog function and then write the profile output to ‘profile.cpuprofile’ file under your site wwwroot. Send a request to your application. You will see a ‘profile.cpuprofile’ file created under your site wwwroot.

![](./media/app-service-web-nodejs-best-practices-and-troubleshoot-guide/scm_profile.cpuprofile.png)

Download this file and you will need to open this file with Chrome F12 Tools. Hit F12 on chrome, then click on the “Profiles Tab”. Click on “Load” Button. Select your profile.cpuprofile file that you just downloaded. Click on the profile you just loaded.

![](./media/app-service-web-nodejs-best-practices-and-troubleshoot-guide/chrome_tools_view.png)

You will see that 95% of the time was consumed by WriteConsoleLog function as shown below. This also shows you the exact line numbers and source files that cause the issue.

3. My node application is consuming too much memory.
-------------------------------------------------

You will probably get a recommendation from Azure Webapps on your portal about high memory consumption. You can also setup monitors to watch for certain metrics - <https://azure.microsoft.com/en-us/documentation/articles/web-sites-monitor/>. When checking the memory usage on the Azure Portal Dashboard as shown here <https://azure.microsoft.com/en-us/documentation/articles/app-insights-web-monitor-performance/>, please check the MAX values for memory so you don’t miss out the peak values.

### Leak detection and Heap Diffing for node.js 

You could use <https://github.com/lloyd/node-memwatch> to help you identify memory leaks.
You can install memwatch just like v8-profiler and edit your code to capture and diff heaps to identify the memory leaks in your application.

4. My node.exe’s are getting killed randomly 
------------------------------------------

There are a few reasons why this could be happening:

1.  Your application is throwing uncaught exceptions – Please check d:\\home\\LogFiles\\Application\\logging-errors.txt file for the details on the exception thrown. This file has the stack trace so you can fix your application based on this.

2.  Your application is consuming too much memory which is affecting other processes from getting started. If the total VM memory is close to 100%, your node.exe’s could be killed by the process manager to let other processes get a chance to do some work. To fix this, either make sure your application is not leaking memory OR if you application really needs to use a lot of memory, please scale up to a larger VM with a lot more RAM.

5. My node application does not start
----------------------------------

If your application is returning 500 Errors at startup, there could be a few reasons:

1.  Node.exe is not present at the correct location. Check nodeProcessCommandLine setting.

2.  Main script file is not present at the correct location. Check web.config and make sure the name of the main script file in the handlers section matches the main script file.

3.  Web.config configuration is not correct – check the settings names/values.

4.  Cold Start – Your application is taking too long to startup. If your application takes longer than (maxNamedPipeConnectionRetry \* namedPipeConnectionRetryDelay) / 1000 seconds, iisnode will return 500 error. Increase the values of these settings to match your application start time to prevent iisnode from timing out and returning the 500 error.

6. My node application crashed
---------------------------

Your application is throwing uncaught exceptions – Please check d:\\home\\LogFiles\\Application\\logging-errors.txt file for the details on the exception thrown. This file has the stack trace so you can fix your application based on this.

7. My node application takes too much time to startup (Cold Start)
---------------------------------------------------------------

Most common reason for this is that the application has a lot of files in the node\_modules and the application tries to load most of these files during startup. By default, since your files reside on the network share on Azure Webapps, loading so many files can take some time.
Some solutions to make this faster are:

1.  Make sure you have a flat dependency structure and no duplicate dependencies by using npm3 to install your modules.

2.  Try to lazy load your node\_modules and not load all of the modules at startup. This means that the call to require(‘module’) should be done when you actually need it within the function you try to use the module.

3.  Azure Webapps offers a feature called local cache. This feature copies your content from the network share to the local disk on the VM. Since the files are local, the load time of node\_modules is much faster. - <https://azure.microsoft.com/en-us/documentation/articles/app-service-local-cache/> explains how to use Local Cache in more detail.

IISNODE http status and substatus
=================================

<https://github.com/Azure/iisnode/blob/master/src/iisnode/cnodeconstants.h> lists all the possible status/substatus combination iisnode can return in case of error.

Enable FREB for your application to see the win32 error code (please make sure you enable FREB only on non-production sites for performance reasons).

| Http Status | Http SubStatus | Possible Reason?                                                                                                                                                                                            
|-------------|----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------
| 500         | 1000           | There was some issue dispatching the request to IISNODE – check if node.exe was started up. Node.exe could have crashed on startup. Check your web.config configuration for errors.                                                                                                                                                                                                                                                                                     |
| 500         | 1001           | - Win32Error 0x2 - App is not responding to the URL. Check URL rewrite rules or if your express app has the correct routes defined. - Win32Error 0x6d – named pipe is busy – Node.exe is not accepting requests because the pipe is busy. Check high cpu usage. - Other errors – check if node.exe crashed.
| 500         | 1002           | Node.exe crashed – check d:\\home\\LogFiles\\logging-errors.txt for stack trace.                                                                                                                                                                                                                                                                                                                                                                                        |
| 500         | 1003           | Pipe configuration Issue – You should never see this but if you do, the named pipe configuration is incorrect.                                                                                                                                                                                                                                                                                                                                                          |
| 500         | 1004-1018      | There was some error while sending the request or processing the response to/from node.exe. Check if node.exe crashed. check d:\\home\\LogFiles\\logging-errors.txt for stack trace.                                                                                                                                                                                                                                                                                    |
| 503         | 1000           | Not enough memory to allocate more named pipe connections. Check why your app is consuming so much memory. Check maxConcurrentRequestsPerProcess setting value. If its not infinite and you have a lot of requests, increase this value to prevent this error.                                                                                                                                                                                                                                                                                                                  |
| 503         | 1001           | Request could not be dispatched to node.exe because the application is recycling. After the application has recycled, requests should be served normally.                                                                                                                                                                                                                                                                                                               |
| 503         | 1002           | Check win32 error code for actual reason – Request could not be dispatched to a node.exe.                                                                                                                                                                                                                                                                                                                                                                               |
| 503         | 1003           | Named pipe is too Busy – Check if node is consuming a lot of CPU                                                                                                                                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
There is a setting within NODE.exe called NODE\_PENDING\_PIPE\_INSTANCES. By default outside of azure webapps this value is 4. This means that node.exe can only accept 4 requests at a time on the named pipe. On Azure Webapps, this value is set to 5000 and this value should be good enough for most node applications running on azure webapps. You should not see 503.1003 on azure webapps because we have a high value for the NODE\_PENDING\_PIPE\_INSTANCES.  |
