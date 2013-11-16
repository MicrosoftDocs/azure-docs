<properties linkid="dotnet-how-to-debug-web-sites" urlDisplayName="How to enable diagnostics" pageTitle="How to enable diagnostics - Windows Azure Web Sites" metaKeywords="Azure diagnostics web sites, Azure Management Portal diagnostics, Azure diagnostics, web site diagnostics, web site debug" metaDescription="Learn how to debug Windows Azure web sites by using the diagnostics settings in the Management Portal." metaCanonical="" disqusComments="1" umbracoNaviHide="0" writer="larryfr" />



#Enable diagnostic logging for Windows Azure Web Sites

Windows Azure provides built-in diagnostics to assist with debugging  an application hosted in Windows Azure Web Sites. In this article you will learn how to enable diagnostic logging and add instrumentation to your application, as well as how to access the information logged by Windows Azure.

<div class="dev-callout"> 
<b>Note</b> 
<p>This article describes using the Windows Azure Management Portal, Windows Azure PowerShell, and the Windows Azure Cross-Platform Command-Line Interface to work with diagnostic logs. For information on working with diagnostic logs using Visual Studio, see <a href="/en-us/develop/net/tutorials/troubleshoot-web-sites-in-visual-studio/">Troubleshooting Windows Azure Web Sites in Visual Studio</a>.</p></div>

##Table of Contents##

- [What is: Web Site diagnostics?](#whatisdiag)
- [How to: Enable diagnostics](#enablediag)
- [How to: Download logs](#download)
- [How to: Stream logs](#streamlogs)
- [Next Steps](#nextsteps)

<a name="whatisdiag"></a><h2>What is Web Site diagnostics?</h2>

Windows Azure Web Sites provide diagnostic functionality for logging information from both the web server as well as the web application. These are logically separated into **site diagnostics** and **application diagnostics**.

###Site diagnostics
Site diagnostics allow to you enable or disable the following:

- **Detailed Error Logging** - Logs detailed error information for HTTP status codes that indicate a failure (status code 400 or greater).
- **Failed Request Tracing** - Logs detailed information on failed requests, including a trace of the components used to process the request and the time taken in each component.
- **Web Server Logging** - Logs all HTTP transactions on a web site using the [W3C extended log file format](http://go.microsoft.com/fwlink/?LinkID=90561).


###Application diagnostics

Application diagnostics logs information produced by the web application. ASP.NET applications can use the [System.Diagnostics.Trace](http://msdn.microsoft.com/en-us/library/36hhw2t6.aspx) class to log information to the application diagnostics log. For example:

	System.Diagnostics.Trace.TraceError("If you're seeing this, something bad happened");

For information on Application Diagnostics, see [Troubleshooting Windows Azure Web Sites in Visual Studio](http://www.windowsazure.com/en-us/develop/net/tutorials/troubleshoot-web-sites-in-visual-studio/).

Windows Azure Web Sites also logs deployment information when you publish an application to a web site. This happens automatically and there are no configuration settings for deployment logging.

<a name="enablediag"></a><h2>How to: Enable diagnostics</h2>

Diagnostics can be enabled by visiting the **Configure** page of your Windows Azure Web Site in the [Windows Azure Management Portal](https://manage.microsoft.com). On the **Configure** page, use the **application diagnostics** and **site diagnostics** sections to enable or disable logging. When enabling **application diagnostics** you must also select the **logging level** and whether to enable logging to the **file system**, **table storage**, or **blob storage**:

* **Logging level** - allows you to filter the information captured to **informational**, **warning** or **error** information. Setting this to **verbose** will log all information produced by the application. **Logging level** can be set differently for **file system**, **table storage**, and **blob storage** logging.
* **File system** - stores the application diagnostics information to the web site file system. These files can be accessed by FTP, or downloaded as a Zip archive by using the Windows Azure PowerShell or Windows Azure Command-Line Tools.
* **Table storage** - stores the application diagnostics information in the specified Windows Azure Storage Account and table name.
* **Blob storage** - stores the application diagnostics information in the specified Windows Azure Storage Account and blob container.
* **Retention period** - by default, logs are not automatically deleted from **blob storage**. Select **set retention** and enter the number of days to keep logs if you wish to automatically delete logs.

For most scenarios, logging **application diagnostics** to the **file system** will be sufficient; information stored in **storage** can only be accessed using a storage client.

<a name="download"></a><h2>How to: Download logs</h2>

Diagnostic information stored to the web site file system can be accessed directly using FTP. It can also be downloaded as a Zip archive using Windows Azure PowerShell or the Windows Azure Command-Line Tools.

The directory structure that the logs are stored in is as follows:

* **Application logs** - /LogFiles/Application/. This folder contains one or more text files containing information produced by application logging. The information logged includes the date and time, the Process ID (PID) of the application, and the value produced by the application instrumentation.

* **Failed Request Traces** - /LogFiles/W3SVC#########/. This folder contains an XSL file and one or more XML files. Ensure that you download the XSL file into the same directory as the XML file(s) because the XSL file provides functionality for formatting and filtering the contents of the XML file(s) when viewed in Internet Explorer.

* **Detailed Error Logs** - /LogFiles/DetailedErrors/. This folder contains one or more .htm files that provide extensive information for any HTTP errors that have occurred. 

* **Web Server Logs** - /LogFiles/http/RawLogs. This folder contains one or more text files formatted using the [W3C extended log file format](http://msdn.microsoft.com/en-us/library/windows/desktop/aa814385(v=vs.85).aspx). These can be viewed using a text editor, or parsed with a utility such as [Log Parser](http://go.microsoft.com/fwlink/?LinkId=246619). Windows Azure Web Sites do not support the s-computername, s-ip and cs-version fields for W3C logging.

* **Deployment logs** - /LogFiles/[deployment method]. The deployment logs are located in a folder named after the deployment method. For example, /LogFiles/Git.

###FTP

To access diagnostic information using FTP, visit the **Dashboard** of your web site in the Windows Azure Management Portal. In the **quick glance** section, use the **FTP Diagnostic Logs** link to access the log files using FTP. The **Deployment/FTP User** entry lists the user name that should be used to access the FTP site.

<div class="dev-callout"> 
	<b>Note</b> 
	<p>If the <b>Deployment/FTP User</b> entry is not set, or you have forgotten the password for this user, you can create a new user and password by using the <b>Reset deployment credentials</b> link in the <b>quick glance</b> section of the <b>Dashboard</b>.</p> </div>

###Download with Windows Azure PowerShell

To download the log files, start a new instance of the Windows Azure PowerShell and use the following command:

	Save-AzureWebSiteLog -Name websitename

This will save the logs for the web site specified by the **-Name** parameter to a file named **logs.zip** in the current directory.

<div class="dev-callout"> 
	<b>Note</b> 
	<p>If you have not installed Windows Azure PowerShell, or have not configured it to use your Windows Azure Subscription, see <a href="http://www.windowsazure.com/en-us/develop/nodejs/how-to-guides/powershell-cmdlets/">How to Use Windows Azure PowerShell</a>.</p></div>

###Download with Windows Azure Command-Line Tools

To download the log files using the Windows Azure Command Line Tools, open a new command prompt, PowerShell, Bash, or Terminal session and enter the following command:

	azure site log download websitename

This will save the logs for the web site named 'websitename' to a file named **diagnostics.zip** in the current directory.

<div class="dev-callout"> 
	<b>Note</b> 
	<p>If you have not installed the Windows Azure Command-Line Tools, or have not configured it to use your Windows Azure Subscription, see <a href="http://www.windowsazure.com/en-us/develop/nodejs/how-to-guides/command-line-tools/">How to Use Windows Azure Command-Line Tools</a>.</p></div>

<a name="streamlogs"></a><h2>How to: Stream logs</h2>

While developing an application, it is often useful to see logging information in near-real time. This can be accomplished by streaming logging information to your development environment using either Windows Azure PowerShell or the Windows Azure Command-Line Tools.

<div class="dev-callout"> 
	<b>Note</b> 
	<p>Some types of logging buffer writes to the log file, which can result in out of order events in the stream. For example, an application log entry that occurs when a user visits a page may be displayed in the stream before the corresponding HTTP log entry for the page request.</p></div>

###Streaming with Windows Azure PowerShell

To stream logging information, start a new of Windows Azure PowerShell and use the following command:

	Get-AzureWebSiteLog -Name websitename -Tail

This will connect to the web site specified by the **-Name** parameter and begin streaming information to the PowerShell window as log events occur on the web site. Any information written to files ending in .txt, .log, or .htm that are stored in the /LogFiles directory (d:/home/logfiles) will be streamed to the local console.

To filter specific events, such as errors, use the **-Message** parameter.

To filter specific log types, such as HTTP, use the **-Path** parameter.

<div class="dev-callout"> 
	<b>Note</b> 
	<p>If you have not installed Windows Azure PowerShell, or have not configured it to use your Windows Azure Subscription, see <a href="http://www.windowsazure.com/en-us/develop/nodejs/how-to-guides/powershell-cmdlets/">How to Use Windows Azure PowerShell</a>.</p></div>

###Streaming with Windows Azure Command-Line Tools

To stream logging information, open a new command prompt, PowerShell, Bash, or Terminal session and enter the following command:

	azure site log tail websitename

This will connect to the web site named 'websitename' and begin streaming information to the window as log events occur on the web site. Any information written to files ending in .txt, .log, or .htm that are stored in the /LogFiles directory (d:/home/logfiles) will be streamed to the local console.

To filter specific events, such as errors, use the **-Filter** parameter.

To filter specific log types, such as HTTP, use the **-Path** parameter.

<div class="dev-callout"> 
	<b>Note</b> 
	<p>If you have not installed the Windows Azure Command-Line Tools, or have not configured it to use your Windows Azure Subscription, see <a href="http://www.windowsazure.com/en-us/develop/nodejs/how-to-guides/command-line-tools/">How to Use Windows Azure Command-Line Tools</a>.</p></div>

<a name="understandlogs"></a><h2>How to: Understand application diagnostics logs</h2>

Application diagnostics stores information in a specific format for .NET applications, depending on whether you store logs to the file system, table storage, or blob storage.

###File system

Each line logged to the file system or received using streaming will be in the following format:

	{Date}  PID[{process id}] {event type/level} {message}

###Table storage

When logging to table storage, the following properties (columns) are used for each entity (row) stored in the table.

<table style="max-width:620px;border-collapse:collapse">
<thead>
<tr>
<th style="width:45%;border:1px solid black;background-color:#0099dd">Property name</th>
<th style="border:1px solid black;vertical-align:top;background-color:#0099dd">Value/format</th>
</tr>
<tr>
<td style="border:1px solid black;vertical-align:top">PartitionKey</td>
<td style="border:1px solid black;vertical-align:top">Date/time of the event in yyyyMMddHH format</td>
</tr>
</thead>
<tr>
<td style="border:1px solid black;vertical-align:top;background-color:#8ddaf6">RowKey</td>
<td style="border:1px solid black;vertical-align:top;background-color:#8ddaf6">Unique GUID value</td>
</tr>
<tr>
<td style="border:1px solid black;vertical-align:top">Timestamp</td>
<td style="border:1px solid black;vertical-align:top">Timestamp of this entity</td>
</tr>
<tr>
<td style="border:1px solid black;vertical-align:top;background-color:#8ddaf6">EventTickCount</td>
<td style="border:1px solid black;vertical-align:top;background-color:#8ddaf6">Date/time of the event in Tick format</td>
</tr>
<tr>
<td style="border:1px solid black;vertical-align:top">ApplicationName</td>
<td style="border:1px solid black;vertical-align:top">Web site name</td>
</tr>
<tr>
<td style="border:1px solid black;vertical-align:top;background-color:#8ddaf6">Level</td>
<td style="border:1px solid black;vertical-align:top;background-color:#8ddaf6">Event level (e.g. error, warning, information)</td>
</tr>
<tr>
<td style="border:1px solid black;vertical-align:top">EventId</td>
<td style="border:1px solid black;vertical-align:top">Event ID</td>
</tr>
<tr>
<td style="border:1px solid black;vertical-align:top;background-color:#8ddaf6">InstanceId</td>
<td style="border:1px solid black;vertical-align:top;background-color:#8ddaf6">Instance of the web site that the even occured on</td>
</tr>
<tr>
<td style="border:1px solid black;vertical-align:top">Pid</td>
<td style="border:1px solid black;vertical-align:top">Process ID</td>
</tr>
<tr>
<td style="border:1px solid black;vertical-align:top;background-color:#8ddaf6">Tid</td>
<td style="border:1px solid black;vertical-align:top;background-color:#8ddaf6">Thread ID</td>
</tr>
<tr>
<td style="border:1px solid black;vertical-align:top">Message</td>
<td style="border:1px solid black;vertical-align:top">Event detail message</td>
</tr>
</table>

###Blob storage

When logging to blob storage, data is stored in comma-separated values (CSV) format as follows:

	Timestamp(DateTime), Level, ApplicationName, InstanceID, Timestamp(ticks), EventID , ProcessID , ThreadID , Message

<a name="nextsteps"></a><h2>Next steps</h2>

- [How to Monitor Web Sites](/en-us/manage/services/web-sites/how-to-monitor-websites/)
- [Tutorial - Troubleshooting Web Sites](/en-us/develop/net/best-practices/troubleshooting-web-sites/)
- [Troubleshooting Windows Azure Web Sites in Visual Studio](/en-us/develop/net/tutorials/troubleshoot-web-sites-in-visual-studio/)

