<properties pageTitle="Enable diagnostic logging - Azure Websites" description="Learn how to enable diagnostic logging and add instrumentation to your application, as well as how to access the information logged by Azure." services="web-sites" documentationCenter=".net" authors="blackmist" manager="wpickett" editor=""/>

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="09/17/2014" ms.author="larryfr"/>





#Enable diagnostic logging for Azure Websites

Azure provides built-in diagnostics to assist with debugging an application hosted in Azure Websites. In this article you will learn how to enable diagnostic logging and add instrumentation to your application, as well as how to access the information logged by Azure.

> [AZURE.NOTE] This article describes using the Azure Management Portal, Azure PowerShell, and the Azure Cross-Platform Command-Line Interface to work with diagnostic logs. For information on working with diagnostic logs using Visual Studio, see [Troubleshooting Azure Web Sites in Visual Studio](/en-us/develop/net/tutorials/troubleshoot-web-sites-in-visual-studio/).

##Table of Contents##

- [What is: Web Site diagnostics?](#whatisdiag)
- [How to: Enable diagnostics](#enablediag)
- [How to: Download logs](#download)
- [How to: Stream logs](#streamlogs)
- [How to: Understand diagnostics logs](#understandlogs)
- [Next Steps](#nextsteps)

<a name="whatisdiag"></a><h2>What is Website diagnostics?</h2>

Azure Websites provide diagnostic functionality for logging information from both the web server as well as the web application. These are logically separated into **site diagnostics** and **application diagnostics**.

###Site diagnostics

Site diagnostics allow to you enable or disable the following:

- **Detailed Error Logging** - Logs detailed error information for HTTP status codes that indicate a failure (status code 400 or greater). This may contain information that can help determine why the server returned the error code.
- **Failed Request Tracing** - Logs detailed information on failed requests, including a trace of the IIS components used to process the request and the time taken in each component. This can be useful if you are attempting to increase site performance or isolate what is causing a specific HTTP error to be returned.
- **Web Server Logging** - Logs all HTTP transactions on a website using the [W3C extended log file format](http://msdn.microsoft.com/library/windows/desktop/aa814385.aspx). This report is useful when determining overall site metrics such as the number of requests handled or how many requests are from a specific IP address

###Application diagnostics

Application diagnostics allows you to capture information produced by a web application. ASP.NET applications can use the [System.Diagnostics.Trace](http://msdn.microsoft.com/en-us/library/36hhw2t6.aspx) class to log information to the application diagnostics log. For example:

	System.Diagnostics.Trace.TraceError("If you're seeing this, something bad happened");

Application diagnostics allows you to troubleshoot your running application by emitting information when certain pieces of code are used. This is most useful when you are trying to determine why a specific path is being taken by the code, usually when the path results in an error or other undesirable behavior.

For information on working with Application Diagnostics using Visual Studio, see [Troubleshooting Azure Web Sites in Visual Studio](http://www.windowsazure.com/en-us/develop/net/tutorials/troubleshoot-web-sites-in-visual-studio/).

> [AZURE.NOTE] Unlike changing the web.config file, enabling Application diagnostics or changing diagnostic log levels does not recycle the app domain that the application runs within.

Azure Websites also logs deployment information when you publish an application to a website. This happens automatically and there are no configuration settings for deployment logging. Deployment logging allows you to determine why a deployment failed. For example, if you are using a custom deployment script, you might use deployment logging to determine why the script is failing.

<a name="enablediag"></a><h2>How to: Enable diagnostics</h2>

Diagnostics can be enabled by visiting the **Configure** page of your Azure Website in the [Azure Management Portal](https://manage.microsoft.com). On the **Configure** page, use the **application diagnostics** and **site diagnostics** sections to enable logging.

When enabling **application diagnostics** you must also select the **logging level** and whether to enable logging to the **file system**, **table storage**, or **blob storage**. While all three storage locations provide the same basic information for logged events, **table storage** and **blob storage** log additional information such as the instance ID, thread ID, and a more granular timestamp (tick format) than logging to **file system**.

When enabling **site diagnostics**, you must select **storage** or **file system** for **web server logging**. Selecting **storage** allows you to select a storage account, and then a blob container that the logs will be written to. All other logs for **site diagnostics** are written to the file system only.

> [AZURE.NOTE] Information stored in **table storage** or **blob  storage** can only be accessed using a storage client or an application that can directly work with these storage systems. For example, Visual Studio 2013 contains a Storage Explorer that can be used to explore table or blob storage, and HDInsight can access data stored in blob storage. You can also write an application that accesses Azure Storage by using one of the [Azure SDKs](http://www.windowsazure.com/en-us/downloads/#).

The following are the settings available when enabling **application diagnostics**:

* **Logging level** - allows you to filter the information captured to **informational**, **warning** or **error** information. Setting this to **verbose** will log all information produced by the application. **Logging level** can be set differently for **file system**, **table storage**, and **blob storage** logging.
* **File system** - stores the application diagnostics information to the website file system. These files can be accessed by FTP, or downloaded as a Zip archive by using the Azure PowerShell or Azure Command-Line Tools.
* **Table storage** - stores the application diagnostics information in the specified Azure Storage Account and table name.
* **Blob storage** - stores the application diagnostics information in the specified Azure Storage Account and blob container.
* **Retention period** - by default, logs are not automatically deleted from **blob storage**. Select **set retention** and enter the number of days to keep logs if you wish to automatically delete logs.

> [AZURE.NOTE] Any combination of file system, table storage, or blob storage can be enabled at the same time, and have individual log level configurations. For example, you may wish to log errors and warnings to blob storage as a long-term logging solution, while enabling file system logging with a level of verbose.

> [AZURE.NOTE] Diagnostics can also be enabled from Azure PowerShell using the **Set-AzureWebsite** cmdlet. If you have not installed Azure PowerShell, or have not configured it to use your Azure Subscription, see [How to Use Azure PowerShell](http://www.windowsazure.com/en-us/develop/nodejs/how-to-guides/powershell-cmdlets/).

<a name="download"></a><h2>How to: Download logs</h2>

Diagnostic information stored to the website file system can be accessed directly using FTP. It can also be downloaded as a Zip archive using Azure PowerShell or the Azure Command-Line Tools.

The directory structure that the logs are stored in is as follows:

* **Application logs** - /LogFiles/Application/. This folder contains one or more text files containing information produced by application logging.

* **Failed Request Traces** - /LogFiles/W3SVC#########/. This folder contains an XSL file and one or more XML files. Ensure that you download the XSL file into the same directory as the XML file(s) because the XSL file provides functionality for formatting and filtering the contents of the XML file(s) when viewed in Internet Explorer.

* **Detailed Error Logs** - /LogFiles/DetailedErrors/. This folder contains one or more .htm files that provide extensive information for any HTTP errors that have occurred. 

* **Web Server Logs** - /LogFiles/http/RawLogs. This folder contains one or more text files formatted using the [W3C extended log file format](http://msdn.microsoft.com/library/windows/desktop/aa814385.aspx). 

* **Deployment logs** - /LogFiles/Git. This folder contains logs generated by the internal deployment processes used by Azure Websites, as well as logs for Git deployments.

###FTP

To access diagnostic information using FTP, visit the **Dashboard** of your website in the Azure Management Portal. In the **quick glance** section, use the **FTP Diagnostic Logs** link to access the log files using FTP. The **Deployment/FTP User** entry lists the user name that should be used to access the FTP site.

> [AZURE.NOTE] If the **Deployment/FTP User** entry is not set, or you have forgotten the password for this user, you can create a new user and password by using the **Reset deployment credentials** link in the **quick glance** section of the **Dashboard**.

###Download with Azure PowerShell

To download the log files, start a new instance of Azure PowerShell and use the following command:

	Save-AzureWebSiteLog -Name websitename

This will save the logs for the website specified by the **-Name** parameter to a file named **logs.zip** in the current directory.

> [AZURE.NOTE] If you have not installed Azure PowerShell, or have not configured it to use your Azure Subscription, see [How to Use Azure PowerShell](http://www.windowsazure.com/en-us/develop/nodejs/how-to-guides/powershell-cmdlets/).

###Download with Azure Command-Line Tools

To download the log files using the Azure Command Line Tools, open a new command prompt, PowerShell, Bash, or Terminal session and enter the following command:

	azure site log download websitename

This will save the logs for the website named 'websitename' to a file named **diagnostics.zip** in the current directory.

> [AZURE.NOTE] If you have not installed the Azure Command-Line Tools, or have not configured it to use your Azure Subscription, see [How to Use Azure Command-Line Tools](http://www.windowsazure.com/en-us/develop/nodejs/how-to-guides/command-line-tools/).

<a name="streamlogs"></a><h2>How to: Stream logs</h2>

While developing an application, it is often useful to see logging information in near-real time. This can be accomplished by streaming logging information to your development environment using either Azure PowerShell or the Azure Command-Line Tools.

> [AZURE.NOTE] Some types of logging buffer writes to the log file, which can result in out of order events in the stream. For example, an application log entry that occurs when a user visits a page may be displayed in the stream before the corresponding HTTP log entry for the page request.

> [AZURE.NOTE] Log streaming will also stream information written to any text file stored in the **D:\\home\\LogFiles\\** folder.

###Streaming with Azure PowerShell

To stream logging information, start a new of Azure PowerShell and use the following command:

	Get-AzureWebSiteLog -Name websitename -Tail

This will connect to the website specified by the **-Name** parameter and begin streaming information to the PowerShell window as log events occur on the website. Any information written to files ending in .txt, .log, or .htm that are stored in the /LogFiles directory (d:/home/logfiles) will be streamed to the local console.

To filter specific events, such as errors, use the **-Message** parameter. For example:

	Get-AzureWebSiteLog -Name websitename -Tail -Message Error

To filter specific log types, such as HTTP, use the **-Path** parameter. For example:

	Get-AzureWebSiteLog -Name websitename -Tail -Path http

To see a list of available paths, use the -ListPath parameter.

> [AZURE.NOTE] If you have not installed Azure PowerShell, or have not configured it to use your Azure Subscription, see [How to Use Azure PowerShell](http://www.windowsazure.com/en-us/develop/nodejs/how-to-guides/powershell-cmdlets/).

###Streaming with Azure Command-Line Tools

To stream logging information, open a new command prompt, PowerShell, Bash, or Terminal session and enter the following command:

	azure site log tail websitename

This will connect to the website named 'websitename' and begin streaming information to the window as log events occur on the website. Any information written to files ending in .txt, .log, or .htm that are stored in the /LogFiles directory (d:/home/logfiles) will be streamed to the local console.

To filter specific events, such as errors, use the **--Filter** parameter. For example:

	azure site log tail websitename --filter Error

To filter specific log types, such as HTTP, use the **--Path** parameter. For example:

	azure site log tail websitename --path http

> [AZURE.NOTE] If you have not installed the Azure Command-Line Tools, or have not configured it to use your Azure Subscription, see [How to Use Azure Command-Line Tools](http://www.windowsazure.com/en-us/develop/nodejs/how-to-guides/command-line-tools/).

<a name="understandlogs"></a><h2>How to: Understand diagnostics logs</h2>

###Application diagnostics logs

Application diagnostics stores information in a specific format for .NET applications, depending on whether you store logs to the file system, table storage, or blob storage. The base set of data stored is the same across all three storage types - the date and time the event occurred, the process ID that produced the event, the event type (information, warning, error,) and the event message.

__File system__

Each line logged to the file system or received using streaming will be in the following format:

	{Date}  PID[{process id}] {event type/level} {message}

For example, an error event would appear similar to the following:

	2014-01-30T16:36:59  PID[3096] Error       Fatal error on the page!

Logging to the file system provides the most basic information of the three available methods, providing only the time, process id, event level, and message.

__Table storage__

When logging to table storage, additional properties are used to facilitate searching the data stored in the table as well as more granular information on the event. The following properties (columns) are used for each entity (row) stored in the table.

<table style="width:100%;border-collapse:collapse">
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
<td style="border:1px solid black;vertical-align:top;background-color:#8ddaf6">A GUID value that uniquely identifies this entity</td>
</tr>
<tr>
<td style="border:1px solid black;vertical-align:top">Timestamp</td>
<td style="border:1px solid black;vertical-align:top">The date and time that the event occurred</td>
</tr>
<tr>
<td style="border:1px solid black;vertical-align:top;background-color:#8ddaf6">EventTickCount</td>
<td style="border:1px solid black;vertical-align:top;background-color:#8ddaf6">The date and time that the event occurred, in Tick format (greater precision)</td>
</tr>
<tr>
<td style="border:1px solid black;vertical-align:top">ApplicationName</td>
<td style="border:1px solid black;vertical-align:top">The website name</td>
</tr>
<tr>
<td style="border:1px solid black;vertical-align:top;background-color:#8ddaf6">Level</td>
<td style="border:1px solid black;vertical-align:top;background-color:#8ddaf6">Event level (e.g. error, warning, information)</td>
</tr>
<tr>
<td style="border:1px solid black;vertical-align:top">EventId</td>
<td style="border:1px solid black;vertical-align:top">The event ID of this event<br>Defaults to 0 if none specified</td>
</tr>
<tr>
<td style="border:1px solid black;vertical-align:top;background-color:#8ddaf6">InstanceId</td>
<td style="border:1px solid black;vertical-align:top;background-color:#8ddaf6">Instance of the website that the even occurred on</td>
</tr>
<tr>
<td style="border:1px solid black;vertical-align:top">Pid</td>
<td style="border:1px solid black;vertical-align:top">Process ID</td>
</tr>
<tr>
<td style="border:1px solid black;vertical-align:top;background-color:#8ddaf6">Tid</td>
<td style="border:1px solid black;vertical-align:top;background-color:#8ddaf6">The thread ID of the thread that produced the event</td>
</tr>
<tr>
<td style="border:1px solid black;vertical-align:top">Message</td>
<td style="border:1px solid black;vertical-align:top">Event detail message</td>
</tr>
</table>

__Blob storage__

When logging to blob storage, data is stored in comma-separated values (CSV) format. Similar to table storage, additional fields are logged to provide more granular information about the event. The following properties are used for each row in the CSV:

<table style="width:100%;border-collapse:collapse">
<thead>
<tr>
<th style="width:45%;border:1px solid black;background-color:#0099dd">Property name</th>
<th style="border:1px solid black;vertical-align:top;background-color:#0099dd">Value/format</th>
</tr>
</thead>
<tr>
<td style="border:1px solid black;vertical-align:top">Date</td>
<td style="border:1px solid black;vertical-align:top">The date and time that the event occurred</td>
</tr>
<tr>
<td style="border:1px solid black;vertical-align:top;background-color:#8ddaf6">Level</td>
<td style="border:1px solid black;vertical-align:top;background-color:#8ddaf6">Event level (e.g. error, warning, information)</td>
</tr>
<tr>
<td style="border:1px solid black;vertical-align:top">ApplicationName</td>
<td style="border:1px solid black;vertical-align:top">The website name</td>
</tr>
<tr>
<td style="border:1px solid black;vertical-align:top;background-color:#8ddaf6">InstanceId</td>
<td style="border:1px solid black;vertical-align:top;background-color:#8ddaf6">Instance of the website that the even occurred on</td>
</tr>
<tr>
<td style="border:1px solid black;vertical-align:top;background-color:#8ddaf6">EventTickCount</td>
<td style="border:1px solid black;vertical-align:top;background-color:#8ddaf6">The date and time that the event occurred, in Tick format (greater precision)</td>
</tr>
<tr>
<td style="border:1px solid black;vertical-align:top">EventId</td>
<td style="border:1px solid black;vertical-align:top">The event ID of this event<br>Defaults to 0 if none specified</td>
</tr>
<tr>
<td style="border:1px solid black;vertical-align:top">Pid</td>
<td style="border:1px solid black;vertical-align:top">Process ID</td>
</tr>
<tr>
<td style="border:1px solid black;vertical-align:top;background-color:#8ddaf6">Tid</td>
<td style="border:1px solid black;vertical-align:top;background-color:#8ddaf6">The thread ID of the thread that produced the event</td>
</tr>
<tr>
<td style="border:1px solid black;vertical-align:top">Message</td>
<td style="border:1px solid black;vertical-align:top">Event detail message</td>
</tr>
</table>

The data stored in a blob would similar to the following:

	date,level,applicationName,instanceId,eventTickCount,eventId,pid,tid,message
	2014-01-30T16:36:52,Error,mywebsite,6ee38a,635266966128818593,0,3096,9,An error occurred

> [AZURE.NOTE] The first line of the log will contain the column headers as represented in this example.

###Failed request traces

Failed request traces are stored in XML files named __fr######.xml__. To make it easier to view the logged information, an XSL stylesheet named __freb.xsl__ is provided in the same directory as the XML files. Opening one of the XML files in Internet Explorer will use the XSL stylesheet to provide a formatted display of the trace information. This will appear similar to the following:

![failed request viewed in the browser](./media/web-sites-enable-diagnostic-log/tws-failedrequestinbrowser.png)

###Detailed error logs

Detailed error logs are HTML documents that provide more detailed information on HTTP errors that have occurred. Since they are simply HTML documents, they can be viewed using a web browser.

###Web server logs

The web server logs are formatted using the [W3C extended log file format](http://msdn.microsoft.com/library/windows/desktop/aa814385.aspx). This information can be read using a text editor or parsed using utilities such as [Log Parser](http://go.microsoft.com/fwlink/?LinkId=246619).

> [AZURE.NOTE] The logs produced by Azure Websites do not support the __s-computername__, __s-ip__, or __cs-version__ fields.

<a name="nextsteps"></a><h2>Next steps</h2>

- [How to Monitor Web Sites](/en-us/manage/services/web-sites/how-to-monitor-websites/)
- [Tutorial - Troubleshooting Web Sites](/en-us/develop/net/best-practices/troubleshooting-web-sites/)
- [Troubleshooting Azure Web Sites in Visual Studio](/en-us/develop/net/tutorials/troubleshoot-web-sites-in-visual-studio/)
- [Analyze Web Site Logs in HDInsight](http://gallery.technet.microsoft.com/scriptcenter/Analyses-Windows-Azure-web-0b27d413)

