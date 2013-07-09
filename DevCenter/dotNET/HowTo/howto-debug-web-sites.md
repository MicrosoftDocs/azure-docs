<properties linkid="dotnet-how-to-debug-web-sites" urlDisplayName="How to debug" pageTitle="How to debug web sites - Windows Azure Web Sites" metaKeywords="Azure diagnostics web sites, Azure Management Portal diagnostics, Azure diagnostics, web site diagnostics, web site debug" metaDescription="Learn how to debug Windows Azure web sites by using the diagnostics settings in the Management Portal." metaCanonical="" disqusComments="1" umbracoNaviHide="0" writer="larryfr" />

<div chunk="../chunks/article-left-menu.md" />

#How to debug an application in Windows Azure Web Sites

Windows Azure provides built-in diagnostics to assist with debugging an application hosted in Windows Azure Web Sites. In this article you will learn how to enable diagnostic logging and add instrumentation to your application, as well as how to access the information logged by Windows Azure.

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

<div class="dev-callout"> 
	<b>Note</b> 
	<p>All information logged for <b>site diagnostics</b> is stored on the web site file system.</p> </div>


###Application diagnostics

Application diagnostics allows you to capture information produced by a web application. ASP.NET applications can use the [System.Diagnostics.Trace](http://msdn.microsoft.com/en-us/library/36hhw2t6.aspx) class to log information to the application diagnostics log. For example:

	System.Diagnostics.Trace.TraceError("If you're seeing this, something bad happened");

Windows Azure Web Sites also logs deployment information when you publish an application to a web site. This happens automatically and there are no configuration settings for deployment logging.

<div class="dev-callout"> 
	<b>Note</b> 
	<p>Unlike changing the web.config file, enabling Application diagnostics or changing diagnostic log levels does not recycle the app domain that the application runs within.</p> </div>

<a name="enablediag"></a><h2>How to: Enable diagnostics</h2>

Diagnostics can be enabled by visiting the **Configure** page of your Windows Azure Web Site in the [Windows Azure Management Portal](https://manage.microsoft.com). On the **Configure** page, use the **application diagnostics** and **site diagnostics** sections to enable or disable logging. When enabling **application diagnostics** you must also select the **logging level** and whether to enable logging to the **file system** or **storage**:

* **logging level** - allows you to filter the information captured to  only **informational**, **warning** or **error** information. Setting this to **verbose** will log all types (informational, warning, and error) of information produced by the application.
* **file system** - stores the application diagnostics information to the web site file system. These files can be accessed by FTP, or downloaded as a Zip archive by using the Windows Azure PowerShell or Windows Azure Command-Line Tools.
* **storage** - stores the application diagnostics information in the specified Windows Azure Storage Account. The information will be placed in a table named **WAWSAppLogTable**.

For most scenarios, logging **application diagnostics** to the **file system** will be sufficient; information stored in **storage** can only be accessed using a storage client.

<div class="dev-callout"> 
	<b>Note</b> 
	<p>Both <b>Application diagnostics (file system)</b> and <b>Application diagnostics (storage)</b> can be enabled at the same time, and have individual log level configurations. For example, you may wish to log errors and warnings to storage as a long-term logging solution, while enabling file system logging with a level of verbose after instrumenting the application code in order to troubleshoot a problem.</p> </div>

<div class="dev-callout"> 
	<b>Note</b> 
	<p>Diagnostics can also be enabled from Windows Azure PowerShell using the <b>Set-AzureWebsite</b> cmdlet.</p><p>If you have not installed Windows Azure PowerShell, or have not configured it to use your Windows Azure Subscription, see <a href="http://www.windowsazure.com/en-us/develop/nodejs/how-to-guides/powershell-cmdlets/">How to Use Windows Azure PowerShell</a>.</p></div>

<a name="download"></a><h2>How to: Download logs</h2>

Diagnostic information stored to the web site file system can be accessed directly using FTP. It can also be downloaded as a Zip archive using Windows Azure PowerShell or the Windows Azure Command-Line Tools.

The directory structure that the logs are stored in is as follows:

* **Application logs** - /LogFiles/Application/. This folder contains one or more text files containing information produced by application logging. The information logged includes the date and time, the Process ID (PID) of the application, and the value produced by the application instrumentation.

* **Failed Request Traces** - /LogFiles/W3SVC#########/. This folder contains an XSL file and one or more XML files. Ensure that you download the XSL file into the same directory as the XML file(s) because the XSL file provides functionality for formatting and filtering the contents of the XML file(s) when viewed in Internet Explorer.

* **Detailed Error Logs** - /LogFiles/DetailedErrors/. This folder contains one or more .htm files that provide extensive information for any HTTP errors that have occurred. 

* **Web Server Logs** - /LogFiles/http/RawLogs. This folder contains one or more text files formatted using the [W3C extended log file format](http://go.microsoft.com/fwlink/?LinkID=90561). These can be viewed using a text editor, or parsed with a utility such as [Log Parser](http://go.microsoft.com/fwlink/?LinkId=246619)

* **Deployment logs** - /LogFiles/Git. This folder contains logs generated by the internal deployment processes used by Windows Azure Web Sites, as well as logs for Git deployments.

###FTP

To access diagnostic information using FTP, visit the **Dashboard** of your web site in the Windows Azure Management Portal. In the **quick glance** section, use the **FTP Diagnostic Logs** link to access the log files using FTP. The **Deployment/FTP User** entry lists the user name that should be used to access the FTP site.

<div class="dev-callout"> 
	<b>Note</b> 
	<p>If the <b>Deployment/FTP User</b> entry is not set, or you have forgotten the password for this user, you can create a new user and password by using the <b>Reset deployment credentials</b> link in the <b>quick glance</b> section of the <b>Dashboard</b>.</p> </div>

###Download with Windows Azure PowerShell

To download the log files, start a new instance of Windows Azure PowerShell and use the following command:

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

<div class="dev-callout"> 
	<b>Note</b> 
	<p>Log streaming will also stream information written to any text file stored in the <b>D:\home\LogFiles\</b> folder.</p></div>

###Streaming with Windows Azure PowerShell

To stream logging information, start a new of Windows Azure PowerShell and use the following command:

	Get-AzureWebSiteLog -Name websitename -Tail

This will connect to the web site specified by the **-Name** parameter and begin streaming information to the PowerShell window as log events occur on the web site.

To filter specific events, such as errors, use the **-Message** parameter. For example:

	Get-AzureWebSiteLog -Name websitename -Tail -Message Error

To filter specific log types, such as HTTP, use the **-Path** parameter. For exmaple:

	Get-AzureWebSiteLog -Name websitename -Tail -Path http

To see a list of available paths, use the -ListPath parameter.

<div class="dev-callout"> 
	<b>Note</b> 
	<p>If you have not installed Windows Azure PowerShell, or have not configured it to use your Windows Azure Subscription, see <a href="http://www.windowsazure.com/en-us/develop/nodejs/how-to-guides/powershell-cmdlets/">How to Use Windows Azure PowerShell</a>.</p></div>

###Streaming with Windows Azure Command-Line Tools

To stream logging information, open a new command prompt, PowerShell, Bash, or Terminal session and enter the following command:

	azure site log tail websitename

This will connect to the web site named 'websitename' and begin streaming information to the window as log events occur on the web site.

To filter specific events, such as errors, use the **--Filter** parameter. For example:

	azure site log tail websitename --filter Error

To filter specific log types, such as HTTP, use the **--Path** parameter. For example:

	azure site log tail websitename --path http

<div class="dev-callout"> 
	<b>Note</b> 
	<p>If you have not installed the Windows Azure Command-Line Tools, or have not configured it to use your Windows Azure Subscription, see <a href="http://www.windowsazure.com/en-us/develop/nodejs/how-to-guides/command-line-tools/">How to Use Windows Azure Command-Line Tools</a>.</p></div>

<a name="nextsteps"></a><h2>Next steps</h2>

- [How to Monitor Web Sites](/en-us/manage/services/web-sites/how-to-monitor-websites/)
- [Tutorial - Troubleshooting Web Sites](/en-us/develop/net/best-practices/troubleshooting-web-sites/)