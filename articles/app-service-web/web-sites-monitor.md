<properties
	pageTitle="Monitor Web Apps in Azure App Service"
	description="Learn how to monitor Web Apps in Azure App Service by using the Management Portal."
	services="app-service"
	documentationCenter=""
	authors="btardif"
	manager="wpickett"
	editor="mollybos"/>

<tags
	ms.service="app-service"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/22/2016"
	ms.author="byvinyal"/>

#<a name="howtomonitor"></a>Monitor Web Apps in Azure App Service

[App Service Web Apps](http://go.microsoft.com/fwlink/?LinkId=529714) provide monitoring functionality for Standard and Premium App Service plans via the Monitor management page. The Monitor management page provides performance statistics for a web app as described below.

[AZURE.INCLUDE [app-service-web-to-api-and-mobile](../../includes/app-service-web-to-api-and-mobile.md)]

##Metrics Retention Policy

>[AZURE.NOTE] The retention policy for app metrics varies by granularity.

- **Minute** granularity metrics are retained for **24 hours**
- **Hour** granularity metrics are retained for **7 days**
- **Day** granularity metrics are retained for **30 days**

##<a name="websitemetrics"></a>How to: Add web app metrics

1. In the [classic portal](https://manage.windowsazure.com), from the web app's page, click the **Monitor** tab to display the **Monitor** management page. By default the chart on the **Monitor** page displays the same metrics as the chart on the **Dashboard** page.

2. To view additional metrics for the web app, click **Add Metrics** at the bottom of the page to display the **Choose Metrics** dialog box.

3. Click to select additional metrics for display on the **Monitor** page.

4. After selecting the metrics that you want to add to the **Monitor** page, click the check mark at the bottom.

5. After adding metrics to the **Monitor** page, click to enable / disable the round checkbox next to each metric to add / remove the metric from the chart at the top of the page.

6. To remove metrics from the **Monitor** page, select the metric that you want to remove and then click the **Delete Metric** icon at the bottom of the page.



##<a name="howtoreceivealerts"></a>How to: Receive alerts from web app metrics

In **Standard** web app mode, you can receive alerts based on your web app monitoring metrics. The alert feature requires that you first configure a web endpoint for monitoring, which you can do in the **Monitoring** section of the **Configure** page. You can also choose to have email sent when a metric you choose reaches a value that you specify. For more information, see [How to: Receive Alert Notifications and Manage Alert Rules in Azure](http://go.microsoft.com/fwlink/?LinkId=309356).  

##<a name="howtoviewusage"></a>How to: View usage quotas for a web app

Web apps can be configured to run in either **Shared** or **Standard** mode from the web app's **Scale** management page in the [classic portal](https://manage.windowsazure.com). Each Azure subscription has access to a pool of resources provided for the purpose of running up to 100 web apps per region in **Shared** mode. The pool of resources available to each web app subscription for this purpose is shared by other web app in the same geo-region that are configured to run in **Shared** mode. Because these resources are shared for use by other web apps, all subscriptions are limited in their use of these resources. Limits applied to a subscription's use of these resources are expressed as usage quotas listed under the usage overview section of each web app's **Dashboard** management page.

>[AZURE.NOTE] When a web app is configured to run in **Standard** mode, it is allocated dedicated resources equivalent to the **Small** (default), **Medium** or **Large** virtual machine sizes in the table at [Virtual Machine and Cloud Service Sizes for Azure][vmsizes]. There are no limits to the resources a subscription can use for running web apps in **Standard** mode. However, the number of **Standard** mode web apps that can be created per region is 500.

### How to: View usage quotas for web apps configured for Shared mode ###
To determine the extent that a web app is impacting resource usage quotas, follow these steps:

1. Open the web app's **Dashboard** management page in the [classic portal](https://manage.windowsazure.com).
2. Under the **usage overview** section the usage quotas for your respective [App Service](http://go.microsoft.com/fwlink/?LinkId=529714) plan are displayed, which is a subset of the following:
	-	**Data Out**, **CPU Time**, and **Memory** - when the quota is exceeded, Azure stops the web app for the remainder of the current quota interval. Azure will start the web app at the beginning of the next quota interval.
	-	**File System Storage** - when this quota is reached, file system storage remains accessible for read operations, but all write operations, including those required for normal web app activity, are blocked. Write operations will resume when you reduce file usage or move the web app to an App Service plan with a higher quota.
	-	**Linked Resources** - quotas for any linked resources of the web app, such as database or storage, are displayed here as well.

	Some quotas can be applied per web hosting plan, while others can be applied per site. For detailed information on usage quotas for each Web hosting plan, see [Websites Limits](azure-subscription-service-limits.md#websiteslimits).

##<a name="resourceusage"></a> How to: Avoid exceeding your quotas

Quotas are not a matter of performance or cost, but it's the way Azure governs resource usage in a multitenant environment by preventing tenants from overusing shared resources. Since exceeding your quotas means downtime or reduced functionality for your web app, consider the following if you want to keep your site running when quotas are about to be reached:

- Move your web app(s) to a higher-tier App Service plan to take advantage of a larger quota. For example, the only quota for **Basic** and **Standard** plans is File System Storage.
- As the number of instances of a web app is increased, so is the likelihood of exceeding shared resource quotas. If appropriate, consider scaling back additional instances of a web app when shared resource quotas are being exceeded.

##<a name="howtoconfigdiagnostics"></a>How to: Configure diagnostics and download logs for a web app

Diagnostics are enabled on the **Configure** tab for the web app in the [classic portal](https://manage.windowsazure.com). There are two types of diagnostics: **application diagnostics** and **site diagnostics**.

#### Application Diagnostics ####

The **application diagnostics** section of the **Configure** management page controls the logging of information produced by the application, which is useful when logging events that occur within an application. For example, when an error occurs in your application, you may wish to present the user with a friendly error while writing more detailed error information to the log for later analysis.

You can enable or disable the following application diagnostics:

- **Application Logging (File System)** - Turns on logging of information produced by the application. The **Logging Level** field determines whether Error, Warning, or Information level information is logged. You may also select Verbose, which will log all information produced by the application.

	Logs produced by this setting are stored on the file system of your web app, and can be downloaded using the steps in the **Downloading log files for a web app** section below.

- **Application Logging (Table Storage)** - Turns on the logging of information produced by the application, similar to the Application Logging (File System) option. However, the log information is stored in an Azure Storage Account in a table.

	To specify the Azure Storage Account and table, choose **On**, select the **Logging Level**, and then choose **Manage Table Storage**. Specify the storage account and table to use, or create a new table.

	The log information stored in the table can be accessed using an Azure Storage client.

- **Application Logging (Blob storage)** - Turns on the logging of information produced by the application, similar to the Application Logging (Table Storage) option. However, the log information is stored in a blob in an Azure Storage Account.

	To specify the Azure Storage Account and blob, choose **On**, select the **Logging Level**, and then choose **Manage Blob Storage**. Specify the storage account, blob container, and blob name to use, or create a new container and blob.

For more information about Azure Storage Accounts, see [How to Manage Storage Accounts](/manage/services/storage/how-to-manage-a-storage-account/).

> [AZURE.NOTE] Application logging to table or blob storage is only supported for .NET applications.

Since application logging to storage requires using a storage client to view the log data, it is most useful when you plan on using a service or application that understands how to read and process the data directly from Azure Table or Blob Storage. Logging to the file system produces files that can be downloaded to your local computer using FTP or other utilities as described later in this section.

**Application diagnostics (file system)**, **Application diagnostics (table storage)**, and **Application diagnostics (blob storage)** can be enabled at the same time, and have individual log level configurations. For example, you may wish to log errors and warnings to storage as a long-term logging solution, while enabling file system logging with a level of verbose after instrumenting the application code in order to troubleshoot a problem.

Diagnostics can also be enabled from Azure PowerShell using the **Set-AzureWebsite** cmdlet. If you have not installed Azure PowerShell, or have not configured it to use your Azure Subscription, see [How to Use Azure PowerShell](/develop/nodejs/how-to-guides/powershell-cmdlets/).

> [AZURE.NOTE] Application logging relies on log information generated by your application. The method used to generate log information, as well as the format of the information is specific to the language your application is written in. For language-specific information on using application logging, see the following articles:
>
> - **.NET** - [Troubleshoot a web app in Azure App Service using Visual Studio](web-sites-dotnet-troubleshoot-visual-studio.md)
> - **Node.js** - [How to debug a Node.js application in Azure Websites](web-sites-nodejs-debug.md)
>
> Application logging to table or blob storage is only supported for .NET applications.

#### Site Diagnostics ####

The **site diagnostics** section of the **Configure** management page controls the logging performed by the web server, such as the logging of web requests, failure to serve pages, or how long it took to serve a page. You can enable or disable the following options:

- **Web Server Logging** - Turn on Web Server logging to save web app logs using the W3C extended log file format. Web server logging produces a record of all incoming requests to your web app, which contains information such as the client IP address, requested URI, HTTP status code of the response, and the user agent string of the client. You can save the logs to an Azure Storage Account or to the File System.

 To save web server logs to an Azure Storage Account, choose **Storage**, and then choose **manage storage** to specify a storage account and an Azure Blob Container where the logs will be kept. For more information about Azure Storage Accounts, see [How to Manage Storage Accounts](/manage/services/storage/how-to-manage-a-storage-account/).

   To save web server logs to the file system, choose **File System**. This enables the **Quota** box where you can set the maximum amount of disk space for the log files. The minimum size is 25MB and the maximum is 100MB. The default size is 35MB.

 By default, web server logs are never deleted. To specify a period of time after which the logs will be automatically deleted, select **Set Retention** and enter the number of days to keep the logs in the **Retention Period** box. This setting is available for both the Azure Storage and File System options.

- **Detailed Error Messages** - Turn on detailed error logging to log additional information about HTTP errors (status codes greater than 400).

- **Failed Request Tracing** - Turn on failed request tracing to capture information for failed client requests, such as a 400 series HTTP status code.  Failed request tracing produces an XML document that contains a trace of which modules the request passed through in IIS, details returned by the module, and the time the module was invoked. This information can be used to isolate which component the failure occurred in.


After enabling diagnostics for a web app, click the **Save** icon at the bottom of the **Configure** management page to apply the options that you have set.

> [AZURE.IMPORTANT] Detailed Error Messages and Failed Request Tracing place significant demands on a web app. We recommend turning off these features once you have reproduced the problem(s) that you are troubleshooting.

### Advanced configuration ###

Diagnostics can be further modified by adding key/value pairs to the **app settings** section of the **Configure** management page. The following settings can be configured from **app settings**:

**DIAGNOSTICS_TEXTTRACELOGDIRECTORY**

- The location in which application logs will be saved, relative to the web root.

- Default value: ..\\..\\LogFiles\\Application

**DIAGNOSTICS_TEXTTRACEMAXBUFFERSIZEBYTES**

- The maximum buffer size to use when capturing application logs. Information is initially written to the buffer before being flushed to file or storage. If new information is written to the buffer before it can be flushed, you may lose previously logged information. If your application produces large bursts of log information, consider increasing the size of the buffer.

- Default value: 10MB

**DIAGNOSTICS_TEXTTRACEMAXLOGFOLDERSIZEBYTES**

- The maximum size of the **Application** folder in which application diagnostics written to file are stored.

- Default value: 1MB

###Downloading log files for a web app

Log files can be downloaded using either FTP, Azure PowerShell, or the Azure CLI.

**FTP**

1. Open the web app's **Dashboard** management page in the [classic portal](https://manage.windowsazure.com) and make note of the FTP site listed under **Diagnostics Logs** and the account listed under **Deployment User**. The FTP site is where the log files are located and the account listed under Deployment User is used to authenticate to the FTP site.
2. If you have not yet created deployment credentials, the account listed under **Deployment User** is listed as **Not set**. In this case you must create deployment credentials as described in the Reset Deployment Credentials section of the Dashboard because these credentials must be used to authenticate to the FTP site where the log files are stored. Azure does not support authenticating to this FTP site using Live ID credentials.
3. Consider using an FTP client such as [FileZilla][fzilla] to connect to the FTP site. An FTP client provides greater ease of use for specifying credentials and viewing folders on an FTP site than is typically possible with a browser.
4. Copy the log files from the FTP site to your local computer.

**Azure PowerShell**

1. From the **Start Screen** or the **Start Menu**, search for **Windows PowerShell**. Right-click the **Windows PowerShell** entry and select **Run as Administrator**.

	> [AZURE.NOTE] If **Azure PowerShell** is not installed, see [Getting Started with Azure PowerShell Cmdlets](http://msdn.microsoft.com/library/windowsazure/jj554332.aspx) for installation and configuration information.

2. From the Azure PowerShell prompt, use the following command to download the log files:

		Save-AzureWebSiteLog -Name webappname

	This will download the log files for the web app specified by **webappname** and save them to a **log.zip** file in the current directory.

	You may also view a live stream of log events by using the following command:

		Get-AzureWebSiteLog -Name webappname -Tail

	This will display log information to the Azure PowerShell prompt as they occur.

**Azure CLI**

Open a new command prompt, PowerShell, bash, or terminal session, and use the following command to download the log files:

	azure site log download webappname

This will download the log files for the web app specified by **webappname** and save them to a **log.zip** file in the current directory.

You may also view a lie stream of log events by using the following command:

	azure site log tail webappname

This will display log information to the command prompt, PowerShell, bash or terminal session that the command is ran from.

> [AZURE.NOTE] If the **azure** command is not installed, see [Install the Azure CLI](../xplat-cli-install.md) for installation and configuration information.

### Reading log files ###

The log files that are generated after you have enabled logging and / or tracing for a web app vary depending on the level of logging / tracing that is set on the Configure management page for the web app. Following are the location of the log files and how the log files may be analyzed:

**Log File Type: Application Logging**

- Location /LogFiles/Application/. This folder contains one or more text files containing information produced by application logging. The information logged includes the date and time, the Process ID (PID) of the application, and the value produced by the application instrumentation.

- Read Files with: A text editor or parser that understands the values produced by your application

**Log File Type: Failed Request Tracing**

- Location: /LogFiles/W3SVC#########/. This folder contains an XSL file and one or more XML files. Ensure that you download the XSL file into the same directory as the XML file(s) because the XSL file provides functionality for formatting and filtering the contents of the XML file(s) when viewed in Internet Explorer.

- Read Files with: Internet Explorer

**Log File Type: Detailed Error Logging**

- Location: /LogFiles/DetailedErrors/. The /LogFiles/DetailedErrors/ folder contains one or more .htm files that provide extensive information for any HTTP errors that have occurred.

- Read Files with: Web browser

The .htm files include the following sections:

- **Detailed Error Information:** Includes information about the error such as <em>Module</em>, <em>Handler</em>, <em>Error Code</em>, and <em>Requested URL</em>.

- **Most likely causes:** Lists several possible causes of the error.

- **Things you can try:** Lists possible solutions for resolving the problem reported by the error.

- **Links and More Information**: Provides additional summary information about the error and may also include links to other resources such as Microsoft Knowledge Base articles.

**Log File Type: Web Server Logging**

- Location: /LogFiles/http/RawLogs. The information stored in the files is formatted using the [W3C extended log format](http://go.microsoft.com/fwlink/?LinkID=90561). The s-computername, s-ip and cs-version fields are not used by Azure web apps.

- Read Files with: Log Parser. Used to parse and query IIS log files. Log Parser 2.2 is available on the Microsoft Download Center at <a href="http://go.microsoft.com/fwlink/?LinkId=246619">http://go.microsoft.com/fwlink/?LinkId=246619</a>.


##<a name="webendpointstatus"></a> How to: Monitor web endpoint status

This feature, available in **Standard** mode, lets you monitor up to 2 endpoints from up to 3 geographic locations.

Endpoint monitoring configures web tests from geo-distributed locations that test response time and uptime of web URLs. The test performs an HTTP get operation on the web URL to determine the response time and uptime from each location. Each configured location runs a test every five minutes.

Uptime is monitored using HTTP response codes, and response time is measured in milliseconds. Uptime is considered 100% when the response time is less than 30 seconds and the HTTP status code is lower than 400. Uptime is 0% when the response time is greater than 30 seconds or the HTTP status code is greater than 400.

After you configure endpoint monitoring, you can drill down into the individual endpoints to view details response time and uptime status over the monitoring interval from each of the test locations. You can also set up an alert rule when the endpoint takes too long to respond, for example.

**To configure endpoint monitoring:**

1.	Open **Web Apps**. Click the name of the web app you want to configure.
2.	Click the **Configure** tab.
3.     Go to the **Monitoring** section to enter your endpoint settings.
4.	Enter a name for the endpoint.
5.	Enter the URL for a part of your web app that you want to monitor. For example, [http://contoso.azurewebsites.net/archive](http://contoso.azurewebsites.net/archive).
6.	Select one or more geographic locations from the list.
7.	Optionally, repeat the previous steps to create a second endpoint.
8.	Click **Save**. It may take some time for the web endpoint monitoring data to be available on the **Dashboard** and **Monitor** tabs.

To create an email rule, do the following:

9.	In the service bar at the far left, click **Management Services**.
10.	Click **Add Rule** at the bottom.
11.	In **Service Type**, select **Web App**, then select the web app for which you configured endpoint monitoring earlier. Click **Next**.
12.	In **Metric**, you can now select additional metrics for the endpoint you configured. For example: **Response Time (homepage/US: IL-Chicago)**. Select the Response Time metric and type 3 in **Threshold Value** to specify a 3-second threshold.
13.	Select **Send an email to the service administrator and co-administrators**. Click **Complete**.

	Azure will now actively monitor the endpoint and send an email alert when it takes more than 3 seconds to reply.

For more on web app endpoint monitoring, see the following videos:

- [Scott Guthrie introduces Azure Web Sites and sets up Endpoint Monitoring](/documentation/videos/websites-and-endpoint-monitoring-scottgu/)

- [Keeping Azure Web Sites up plus Endpoint Monitoring - with Stefan Schackow](/documentation/videos/azure-web-sites-endpoint-monitoring-and-staying-up/)

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)

[fzilla]:http://go.microsoft.com/fwlink/?LinkId=247914
[vmsizes]:http://go.microsoft.com/fwlink/?LinkID=309169
