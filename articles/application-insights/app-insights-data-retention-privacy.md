---
title: Data retention and storage in Azure Application Insights | Microsoft Docs
description: Retention and privacy policy statement
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm

ms.assetid: a6268811-c8df-42b5-8b1b-1d5a7e94cbca
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: conceptual
ms.date: 10/10/2018
ms.author: mbullwin

---
# Data collection, retention and storage in Application Insights

When you install [Azure Application Insights][start] SDK in your app, it sends telemetry about your app to the Cloud. Naturally, responsible developers want to know exactly what data is sent, what happens to the data, and how they can keep control of it. In particular, could sensitive data be sent, where is it stored, and how secure is it? 

First, the short answer:

* The standard telemetry modules that run "out of the box" are unlikely to send sensitive data to the service. The telemetry is concerned with load, performance and usage metrics, exception reports, and other diagnostic data. The main user data visible in the diagnostic reports are URLs; but your app shouldn't in any case put sensitive data in plain text in a URL.
* You can write code that sends additional custom telemetry to help you with diagnostics and monitoring usage. (This extensibility is a great feature of Application Insights.) It would be possible, by mistake, to write this code so that it includes personal and other sensitive data. If your application works with such data, you should apply a thorough review processes to all the code you write.
* While developing and testing your app, it's easy to inspect what's being sent by the SDK. The data appears in the debugging output windows of the IDE and browser. 
* The data is held in [Microsoft Azure](http://azure.com) servers in the USA or Europe. (But your app can run anywhere.) Azure has [strong security processes and meets a broad range of compliance standards](https://azure.microsoft.com/support/trust-center/). Only you and your designated team have access to your data. Microsoft staff can have restricted access to it only under specific limited circumstances with your knowledge. It's encrypted in transit, though not in the servers.

The rest of this article elaborates more fully on these answers. It's designed to be self-contained, so that you can show it to colleagues who aren't part of your immediate team.

## What is Application Insights?
[Azure Application Insights][start] is a service provided by Microsoft that helps you improve the performance and usability of your live application. It monitors your application all the time it's running, both during testing and after you've published or deployed it. Application Insights creates charts and tables that show you, for example, what times of day you get most users, how responsive the app is, and how well it is served by any external services that it depends on. If there are crashes, failures or performance issues, you can search through the telemetry data in detail to diagnose the cause. And the service will send you emails if there are any changes in the availability and performance of your app.

In order to get this functionality, you install an Application Insights SDK in your application, which becomes part of its code. When your app is running, the SDK monitors its operation and sends telemetry to the Application Insights service. This is a cloud service hosted by [Microsoft Azure](http://azure.com). (But Application Insights works for any applications, not just those that are hosted in Azure.)

![The SDK in your app sends telemetry to the Application Insights service.](./media/app-insights-data-retention-privacy/01-scheme.png)

The Application Insights service stores and analyzes the telemetry. To see the analysis or search through the stored telemetry, you sign in to your Azure account and open the Application Insights resource for your application. You can also share access to the data with other members of your team, or with specified Azure subscribers.

You can have data exported from the Application Insights service, for example to a database or to external tools. You provide each tool with a special key that you obtain from the service. The key can be revoked if necessary. 

Application Insights SDKs are available for a range of application types: web services hosted in your own J2EE or ASP.NET servers, or in Azure; web clients - that is, the code running in a web page; desktop apps and services; device apps such as Windows Phone, iOS, and Android. They all send telemetry to the same service.

## What data does it collect?
### How is the data is collected?
There are three sources of data:

* The SDK, which you integrate with your app either [in development](app-insights-asp-net.md) or [at run time](app-insights-monitor-performance-live-website-now.md). There are different SDKs for different application types. There's also an [SDK for web pages](app-insights-javascript.md), which loads into the end-user's browser along with the page.
  
  * Each SDK has a number of [modules](app-insights-configuration-with-applicationinsights-config.md), which use different techniques to collect different types of telemetry.
  * If you install the SDK in development, you can use its API to send your own telemetry, in addition to the standard modules. This custom telemetry can include any data you want to send.
* In some web servers, there are also agents that run alongside the app and send telemetry about CPU, memory, and network occupancy. For example, Azure VMs, Docker hosts, and [J2EE servers](app-insights-java-agent.md) can have such agents.
* [Availability tests](app-insights-monitor-web-app-availability.md) are processes run by Microsoft that send requests to your web app at regular intervals. The results are sent to the Application Insights service.

### What kinds of data are collected?
The main categories are:

* [Web server telemetry](app-insights-asp-net.md) - HTTP requests.  Uri, time taken to process the request, response code, client IP address. Session id.
* [Web pages](app-insights-javascript.md) - Page, user and session counts. Page load times. Exceptions. Ajax calls.
* Performance counters - Memory, CPU, IO, Network occupancy.
* Client and server context - OS, locale, device type, browser, screen resolution.
* [Exceptions](app-insights-asp-net-exceptions.md) and crashes - **stack dumps**, build id, CPU type. 
* [Dependencies](app-insights-asp-net-dependencies.md) - calls to external services such as REST, SQL, AJAX. URI or connection string, duration, success, command.
* [Availability tests](app-insights-monitor-web-app-availability.md) - duration of test and steps, responses.
* [Trace logs](app-insights-asp-net-trace-logs.md) and [custom telemetry](app-insights-api-custom-events-metrics.md) - **anything you code into your logs or telemetry**.

[More detail](#data-sent-by-application-insights).

## How can I verify what's being collected?
If you're developing the app using Visual Studio, run the app in debug mode (F5). The telemetry appears in the Output window. From there, you can copy it and format it as JSON for easy inspection. 

![](./media/app-insights-data-retention-privacy/06-vs.png)

There's also a more readable view in the Diagnostics window.

For web pages, open your browser's debugging window.

![Press F12 and open the Network tab.](./media/app-insights-data-retention-privacy/08-browser.png)

### Can I write code to filter the telemetry before it is sent?
This would be possible by writing a [telemetry processor plugin](app-insights-api-filtering-sampling.md).

## How long is the data kept?
Raw data points (that is, items that you can query in Analytics and inspect in Search) are kept for up to 90 days. If you need to keep data longer than that, you can use [continuous export](app-insights-export-telemetry.md) to copy it to a storage account.

Aggregated data (that is, counts, averages and other statistical data that you see in Metric Explorer) are retained at a grain of 1 minute for 90 days.

[Debug snapshots](app-insights-snapshot-debugger.md) are stored for seven days. This retention policy is set on a per-application basis. If you need to increase this value, you can request an increase by opening a support case in the Azure portal.

## Who can access the data?
The data is visible to you and, if you have an organization account, your team members. 

It can be exported by you and your team members and could be copied to other locations and passed on to other people.

#### What does Microsoft do with the information my app sends to Application Insights?
Microsoft uses the data only in order to provide the service to you.

## Where is the data held?
* In the USA, Europe or Southeast Asia. You can select the location when you create a new Application Insights resource. 


#### Does that mean my app has to be hosted in the USA, Europe or Southeast Asia?
* No. Your application can run anywhere, either in your own on-premises hosts or in the Cloud.

## How secure is my data?
Application Insights is an Azure Service. Security policies are described in the [Azure Security, Privacy, and Compliance white paper](http://go.microsoft.com/fwlink/?linkid=392408).

The data is stored in Microsoft Azure servers. For accounts in the Azure Portal, account restrictions are described in the [Azure Security, Privacy, and Compliance document](http://go.microsoft.com/fwlink/?linkid=392408).

Access to your data by Microsoft personnel is restricted. We access your data only with your permission and if it is necessary to support your use of Application Insights. 

Data in aggregate across all our customers' applications (such as data rates and average size of traces) is used to improve Application Insights.

#### Could someone else's telemetry interfere with my Application Insights data?
They could send additional telemetry to your account by using the instrumentation key, which can be found in the code of your web pages. With enough additional data, your metrics would not correctly represent your app's performance and usage.

If you share code with other projects, remember to remove your instrumentation key.

## Is the data encrypted?
Not inside the servers at present.

All data is encrypted as it moves between data centers.

#### Is the data encrypted in transit from my application to Application Insights servers?
Yes, we use https to send data to the portal from nearly all SDKs, including web servers, devices and HTTPS web pages. The only exception is data sent from plain HTTP web pages.

## Does the SDK create temporary local storage?

Yes, certain Telemetry Channels will persist data locally if an endpoint cannot be reached. Please review below to see which frameworks and telemetry channels are affected.


Telemetry channels that utilize local storage create temp files in the TEMP or APPDATA directories which are restricted to the specific account running your application. This may happen when an endpoint was temporarily unavailable or you hit the throttling limit. Once this issue is resolved, the telemetry channel will resume sending all the new and persisted data.


This persisted data is **not encrypted** and it is strongly recommended to restructure your data collection policy to disable the collection of private data. (See [How to export and delete private data](https://docs.microsoft.com/azure/application-insights/app-insights-customer-data#how-to-export-and-delete-private-data) for more information.)


If a customer needs to configure this directory with specific security requirements it can be configured per framework. Please make sure that the process running your application has write access to this directory, but also make sure this directory is protected to avoid telemetry being read by unintended users.

### Java

`C:\Users\username\AppData\Local\Temp` is used for persisting data. This location isn't configurable from the config directory and the permissions to access this folder are restricted to the specific user with required credentials. (See [implementation](https://github.com/Microsoft/ApplicationInsights-Java/blob/40809cb6857231e572309a5901e1227305c27c1a/core/src/main/java/com/microsoft/applicationinsights/internal/util/LocalFileSystemUtils.java#L48-L72) here.)

###  .Net

By default `ServerTelemetryChannel` uses the current user’s local app data folder `%localAppData%\Microsoft\ApplicationInsights` or temp folder `%TMP%`. (See [implementation](https://github.com/Microsoft/ApplicationInsights-dotnet/blob/91e9c91fcea979b1eec4e31ba8e0fc683bf86802/src/ServerTelemetryChannel/Implementation/ApplicationFolderProvider.cs#L54-L84) here.)


Via configuration file:
```
<TelemetryChannel Type="Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.ServerTelemetryChannel,   Microsoft.AI.ServerTelemetryChannel">
    <StorageFolder>D:\NewTestFolder</StorageFolder>
</TelemetryChannel>
```

Via code:

- Remove ServerTelemetryChannel from configuration file
- Add this snippet to your configuration:
```
ServerTelemetryChannel channel = new ServerTelemetryChannel();
channel.StorageFolder = @"D:\NewTestFolder";
channel.Initialize(TelemetryConfiguration.Active);
TelemetryConfiguration.Active.TelemetryChannel = channel;
```

### NetCore

By default `ServerTelemetryChannel` uses the current user’s local app data folder `%localAppData%\Microsoft\ApplicationInsights` or temp folder `%TMP%`. (See [implementation](https://github.com/Microsoft/ApplicationInsights-dotnet/blob/91e9c91fcea979b1eec4e31ba8e0fc683bf86802/src/ServerTelemetryChannel/Implementation/ApplicationFolderProvider.cs#L54-L84) here.) 
In a Linux environment, local storage will be disabled unless a storage folder is specified.

The following code snippet shows how to set `ServerTelemetryChannel.StorageFolder` in the `ConfigureServices()` method of your `Startup.cs` class:

```
services.AddSingleton(typeof(ITelemetryChannel), new ServerTelemetryChannel () {StorageFolder = "/tmp/myfolder"});
```

(See [AspNetCore Custom Configuration](https://github.com/Microsoft/ApplicationInsights-aspnetcore/wiki/Custom-Configuration) for more information. )

### Node.js

By default `%TEMP%/appInsights-node{INSTRUMENTATION KEY}` is used for persisting data. Permissions to access this folder are restricted to the current user and Administrators. (See [implementation](https://github.com/Microsoft/ApplicationInsights-node.js/blob/develop/Library/Sender.ts) here.)

The folder prefix `appInsights-node` can be overridden by changing the runtime value of the static variable `Sender.TEMPDIR_PREFIX` found in [Sender.ts](https://github.com/Microsoft/ApplicationInsights-node.js/blob/7a1ecb91da5ea0febf5ceab13d6a4bf01a63933d/Library/Sender.ts#L384).



## How do I send data to Application Insights using TLS 1.2?

To insure the security of data in transit to the Application Insights endpoints, we strongly encourage customers to configure their application to use at least Transport Layer Security (TLS) 1.2. Older versions of TLS/Secure Sockets Layer (SSL) have been found to be vulnerable and while they still currently work to allow backwards compatibility, they are **not recommended**, and the industry is quickly moving to abandon support for these older protocols. 

The [PCI Security Standards Council](https://www.pcisecuritystandards.org/) has set a [deadline of June 30th, 2018](https://www.pcisecuritystandards.org/pdfs/PCI_SSC_Migrating_from_SSL_and_Early_TLS_Resource_Guide.pdf) to disable older versions of TLS/SSL and upgrade to more secure protocols. Once Azure drops legacy support, if your application/clients cannot communicate over at least TLS 1.2 you would not be able to send data to Application Insights. The approach you take to test and validate your application's TLS support will vary depending on the operating system/platform as well as the language/framework your application uses.

We do not recommend explicitly setting your application to only use TLS 1.2 unless absolutely necessary as this can break platform level security features that allow you to automatically detect and take advantage of newer more secure protocols as they become available such as TLS 1.3. We recommend performing a thorough audit of your application's code to check for hardcoding of specific TLS/SSL versions.

### Platform/Language specific guidance

|Platform/Language | Support | More Information |
| --- | --- | --- |
| Azure App Services  | Supported, configuration may be required. | Support was announced in April 2018. Read the announcement for [configuration details](https://blogs.msdn.microsoft.com/appserviceteam/2018/04/17/app-service-and-functions-hosted-apps-can-now-update-tls-versions/).  |
| Azure Function Apps | Supported, configuration may be required. | Support was announced in April 2018. Read the announcement for [configuration details](https://blogs.msdn.microsoft.com/appserviceteam/2018/04/17/app-service-and-functions-hosted-apps-can-now-update-tls-versions/). |
|.NET | Supported, configuration varies by version. | For detailed configuration info for .NET 4.7 and earlier versions refer to [these instructions](https://docs.microsoft.com/dotnet/framework/network-programming/tls#support-for-tls-12).  |
|Status Monitor | Supported, configuration required | Status Monitor relies on [OS Configuration](https://docs.microsoft.com/windows-server/security/tls/tls-registry-settings) + [.NET Configuration](https://docs.microsoft.com/dotnet/framework/network-programming/tls#support-for-tls-12) to support TLS 1.2.
|Node.js |  Supported, in v10.5.0, configuration may be required. | Use the [official Node.js TLS/SSL documentation](https://nodejs.org/api/tls.html) for any application specific configuration. |
|Java | Supported, JDK support for TLS 1.2 was added in [JDK 6 update 121](http://www.oracle.com/technetwork/java/javase/overview-156328.html#R160_121) and [JDK 7](http://www.oracle.com/technetwork/java/javase/7u131-relnotes-3338543.html). | JDK 8 uses [TLS 1.2 by default](https://blogs.oracle.com/java-platform-group/jdk-8-will-use-tls-12-as-default).  |
|Linux | Linux distributions tend to rely on [OpenSSL](https://www.openssl.org) for TLS 1.2 support.  | Check the [OpenSSL Changelog](https://www.openssl.org/news/changelog.html) to confirm your version of OpenSSL is supported.|
| Windows 8.0 - 10 | Supported, and enabled by default. | To confirm that you are still using the [default settings](https://docs.microsoft.com/windows-server/security/tls/tls-registry-settings).  |
| Windows Server 2012 - 2016 | Supported, and enabled by default. | To confirm that you are still using the [default settings](https://docs.microsoft.com/windows-server/security/tls/tls-registry-settings) |
| Windows 7 SP1 and Windows Server 2008 R2 SP1 | Supported, but not enabled by default. | See the [Transport Layer Security (TLS) registry settings](https://docs.microsoft.com/windows-server/security/tls/tls-registry-settings) page for details on how to enable.  |
| Windows Server 2008 SP2 | Support for TLS 1.2 requires an update. | See [Update to add support for TLS 1.2](https://support.microsoft.com/help/4019276/update-to-add-support-for-tls-1-1-and-tls-1-2-in-windows-server-2008-s) in Windows Server 2008 SP2. |
|Windows Vista | Not Supported. | N/A

### Check what version of OpenSSL your Linux distribution is running

To check what version of OpenSSL you have installed, open the terminal and run:

```terminal
openssl version -a
```

### Run a test TLS 1.2 transaction on Linux

To run a basic preliminary test to see if your Linux system can communicate over TLS 1.2. Open the terminal and run:

```terminal
openssl s_client -connect bing.com:443 -tls1_2
```

## Personal data stored in Application Insights

Our [Application Insights personal data article](app-insights-customer-data.md) discusses this issue in-depth.

#### Can my users turn off Application Insights?
Not directly. We don't provide a switch that your users can operate to turn off Application Insights.

However, you can implement such a feature in your application. All the SDKs include an API setting that turns off telemetry collection. 

## Data sent by Application Insights
The SDKs vary between platforms, and there are several components that you can install. (Refer to [Application Insights - overview][start].) Each component sends different data.

#### Classes of data sent in different scenarios
| Your action | Data classes collected (see next table) |
| --- | --- |
| [Add Application Insights SDK to a .NET web project][greenbrown] |ServerContext<br/>Inferred<br/>Perf counters<br/>Requests<br/>**Exceptions**<br/>Session<br/>users |
| [Install Status Monitor on IIS][redfield] |Dependencies<br/>ServerContext<br/>Inferred<br/>Perf counters |
| [Add Application Insights SDK to a Java web app][java] |ServerContext<br/>Inferred<br/>Request<br/>Session<br/>users |
| [Add JavaScript SDK to web page][client] |ClientContext <br/>Inferred<br/>Page<br/>ClientPerf<br/>Ajax |
| [Define default properties][apiproperties] |**Properties** on all standard and custom events |
| [Call TrackMetric][api] |Numeric values<br/>**Properties** |
| [Call Track*][api] |Event name<br/>**Properties** |
| [Call TrackException][api] |**Exceptions**<br/>Stack dump<br/>**Properties** |
| SDK can't collect data. For example: <br/> - can't access perf counters<br/> -  exception in telemetry initializer |SDK diagnostics |

For [SDKs for other platforms][platforms], see their documents.

#### The classes of collected data
| Collected data class | Includes (not an exhaustive list) |
| --- | --- |
| **Properties** |**Any data - determined by your code** |
| DeviceContext |Id, IP, Locale, Device model, network, network type, OEM name, screen resolution, Role Instance, Role Name, Device Type |
| ClientContext |OS, locale, language, network, window resolution |
| Session |session id |
| ServerContext |Machine name, locale, OS, device, user session, user context, operation |
| Inferred |geo location from IP address, timestamp, OS, browser |
| Metrics |Metric name and value |
| Events |Event name and value |
| PageViews |URL and page name or screen name |
| Client perf |URL/page name, browser load time |
| Ajax |HTTP calls from web page to server |
| Requests |URL, duration, response code |
| Dependencies |Type(SQL, HTTP, ...), connection string or URI, sync/async, duration, success, SQL statement (with Status Monitor) |
| **Exceptions** |Type, **message**, call stacks, source file and line number, thread id |
| Crashes |Process id, parent process id, crash thread id; application patch, id, build;  exception type, address, reason; obfuscated symbols and registers, binary start and end addresses, binary name and path, cpu type |
| Trace |**Message** and severity level |
| Perf counters |Processor time, available memory, request rate, exception rate, process private bytes, IO rate, request duration, request queue length |
| Availability |Web test response code, duration of each test step, test name, timestamp, success, response time, test location |
| SDK diagnostics |Trace message or Exception |

You can [switch off some of the data by editing ApplicationInsights.config][config]

## Credits
This product includes GeoLite2 data created by MaxMind, available from [http://www.maxmind.com](http://www.maxmind.com).



<!--Link references-->

[api]: app-insights-api-custom-events-metrics.md
[apiproperties]: app-insights-api-custom-events-metrics.md#properties
[client]: app-insights-javascript.md
[config]: app-insights-configuration-with-applicationinsights-config.md
[greenbrown]: app-insights-asp-net.md
[java]: app-insights-java-get-started.md
[platforms]: app-insights-platforms.md
[pricing]: http://azure.microsoft.com/pricing/details/application-insights/
[redfield]: app-insights-monitor-performance-live-website-now.md
[start]: app-insights-overview.md

