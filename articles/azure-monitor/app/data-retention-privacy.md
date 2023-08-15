---
title: Data retention and storage in Application Insights | Microsoft Docs
description: Retention and privacy policy statement for Application Insights.
ms.topic: conceptual
ms.date: 07/10/2023
ms.custom: devx-track-csharp
ms.reviewer: saars
---

# Data collection, retention, and storage in Application Insights

When you install the [Application Insights][start] SDK in your app, it sends telemetry about your app to the [cloud](create-workspace-resource.md). As a responsible developer, you want to know exactly what data is sent, what happens to the data, and how you can keep control of it. In particular, could sensitive data be sent, where is it stored, and how secure is it?

First, the short answer:

* The standard telemetry modules that run "out of the box" are unlikely to send sensitive data to the service. The telemetry is concerned with load, performance and usage metrics, exception reports, and other diagnostic data. The main user data visible in the diagnostic reports are URLs. But your app shouldn't, in any case, put sensitive data in plain text in a URL.
* You can write code that sends more custom telemetry to help you with diagnostics and monitoring usage. (This extensibility is a great feature of Application Insights.) It would be possible, by mistake, to write this code so that it includes personal and other sensitive data. If your application works with such data, you should apply a thorough review process to all the code you write.
* While you develop and test your app, it's easy to inspect what's being sent by the SDK. The data appears in the debugging output windows of the IDE and browser.
* You can select the location when you create a new Application Insights resource. For more information about Application Insights availability per region, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all).
*	Review the collected data because it might include data that's allowed in some circumstances but not others. A good example of this circumstance is device name. The device name from a server doesn't affect privacy and is useful. A device name from a phone or laptop might have privacy implications and be less useful. An SDK developed primarily to target servers would collect device name by default. This capability might need to be overwritten in both normal events and exceptions.

The rest of this article discusses these points more fully. The article is self-contained, so you can share it with colleagues who aren't part of your immediate team.

## What is Application Insights?

[Application Insights][start] is a service provided by Microsoft that helps you improve the performance and usability of your live application. It monitors your application all the time it's running, both during testing and after you've published or deployed it. Application Insights creates charts and tables that show you informative metrics. For example, you might see what times of day you get most users, how responsive the app is, and how well it's served by any external services that it depends on. If there are failures or performance issues, you can search through the telemetry data to diagnose the cause. The service sends you emails if there are any changes in the availability and performance of your app.

To get this functionality, you install an Application Insights SDK in your application, which becomes part of its code. When your app is running, the SDK monitors its operation and sends telemetry to an [Application Insights Log Analytics workspace](create-workspace-resource.md), which is a cloud service hosted by [Microsoft Azure](https://azure.com). Application Insights also works for any applications, not just applications that are hosted in Azure.

Application Insights stores and analyzes the telemetry. To see the analysis or search through the stored telemetry, you sign in to your Azure account and open the Application Insights resource for your application. You can also share access to the data with other members of your team, or with specified Azure subscribers.

You can have data exported from Application Insights, for example, to a database or to external tools. You provide each tool with a special key that you obtain from the service. The key can be revoked if necessary.

Application Insights SDKs are available for a range of application types:

- Web services hosted in your own Java EE or ASP.NET servers, or in Azure
- Web clients, that is, the code running in a webpage
- Desktop apps and services
- Device apps such as Windows Phone, iOS, and Android

They all send telemetry to the same service.
[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

## What data does it collect?

There are three sources of data:

* The SDK, which you integrate with your app either [in development](./asp-net.md) or [at runtime](./application-insights-asp-net-agent.md). There are different SDKs for different application types. There's also an [SDK for webpages](./javascript.md), which loads into the user's browser along with the page.
  
  * Each SDK has many [modules](./configuration-with-applicationinsights-config.md), which use different techniques to collect different types of telemetry.
  * If you install the SDK in development, you can use its API to send your own telemetry, in addition to the standard modules. This custom telemetry can include any data you want to send.
* In some web servers, there are also agents that run alongside the app and send telemetry about CPU, memory, and network occupancy. For example, Azure VMs, Docker hosts, and [Java application servers](./opentelemetry-enable.md?tabs=java) can have such agents.
* [Availability overview](availability-overview.md) are processes run by Microsoft that send requests to your web app at regular intervals. The results are sent to Application Insights.

### What kind of data is collected?

The main categories are:

* [Web server telemetry](./asp-net.md): HTTP requests. URI, time taken to process the request, response code, and client IP address. `Session id`.
* [Webpages](./javascript.md): Page, user, and session counts. Page load times. Exceptions. Ajax calls.
* Performance counters: Memory, CPU, IO, and network occupancy.
* Client and server context: OS, locale, device type, browser, and screen resolution.
* [Exceptions](./asp-net-exceptions.md) and crashes: Stack dumps, `build id`, and CPU type.
* [Dependencies](./asp-net-dependencies.md): Calls to external services such as REST, SQL, and AJAX. URI or connection string, duration, success, and command.
* [Availability tests](availability-overview.md): Duration of test and steps, and responses.
* [Trace logs](./asp-net-trace-logs.md) and [custom telemetry](./api-custom-events-metrics.md): Anything you code into your logs or telemetry.

For more information, see the section [Data sent by Application Insights](#data-sent-by-application-insights).

## How can I verify what's being collected?

If you're developing an app using Visual Studio, run the app in debug mode (F5). The telemetry appears in the **Output** window. From there, you can copy it and format it as JSON for easy inspection.

:::image type="content" source="./media/data-retention-privacy/06-vs.png" lightbox="./media/data-retention-privacy/06-vs.png" alt-text="Screenshot that shows running the app in debug mode in Visual Studio.":::

There's also a more readable view in the **Diagnostics** window.

For webpages, open your browser's debugging window. Select F12 and open the **Network** tab.

:::image type="content" source="./media/data-retention-privacy/08-browser.png" lightbox="./media/data-retention-privacy/08-browser.png" alt-text="Screenshot that shows the open Network tab.":::

### Can I write code to filter the telemetry before it's sent?

You'll need to write a [telemetry processor plug-in](./api-filtering-sampling.md).

## How long is the data kept?

Raw data points (that is, items that you can query in Analytics and inspect in Search) are kept for up to 730 days. You can [select a retention duration](../logs/data-retention-archive.md#configure-retention-and-archive-at-the-table-level) of 30, 60, 90, 120, 180, 270, 365, 550, or 730 days. If you need to keep data longer than 730 days, you can use [diagnostic settings](../essentials/diagnostic-settings.md#diagnostic-settings-in-azure-monitor).

Data kept longer than 90 days incurs extra charges. For more information about Application Insights pricing, see the [Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/).

Aggregated data (that is, counts, averages, and other statistical data that you see in metric explorer) are retained at a grain of 1 minute for 90 days.

[Debug snapshots](./snapshot-debugger.md) are stored for 15 days. This retention policy is set on a per-application basis. If you need to increase this value, you can request an increase by opening a support case in the Azure portal.

## Who can access the data?

The data is visible to you and, if you have an organization account, your team members.

It can be exported by you and your team members and could be copied to other locations and passed on to other people.

#### What does Microsoft do with the information my app sends to Application Insights?

Microsoft uses the data only to provide the service to you.

## Where is the data held?

You can select the location when you create a new Application Insights resource. For more information about Application Insights availability, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all).

## How secure is my data?

Application Insights is an Azure service. Security policies are described in the [Azure Security, Privacy, and Compliance white paper](https://go.microsoft.com/fwlink/?linkid=392408).

The data is stored in Microsoft Azure servers. For accounts in the Azure portal, account restrictions are described in the [Azure Security, Privacy, and Compliance document](https://go.microsoft.com/fwlink/?linkid=392408).

Access to your data by Microsoft personnel is restricted. We access your data only with your permission and if it's necessary to support your use of Application Insights.

Data in aggregate across all our customers' applications, such as data rates and average size of traces, is used to improve Application Insights.

#### Could someone else's telemetry interfere with my Application Insights data?

Someone could send more telemetry to your account by using the instrumentation key. This key can be found in the code of your webpages. With enough extra data, your metrics wouldn't correctly represent your app's performance and usage.

If you share code with other projects, remember to remove your instrumentation key.

## Is the data encrypted?

All data is encrypted at rest and as it moves between datacenters.

#### Is the data encrypted in transit from my application to Application Insights servers?

Yes. We use HTTPS to send data to the portal from nearly all SDKs, including web servers, devices, and HTTPS webpages.

## Does the SDK create temporary local storage?

Yes. Certain telemetry channels will persist data locally if an endpoint can't be reached. The following paragraphs describe which frameworks and telemetry channels are affected:

- Telemetry channels that utilize local storage create temp files in the TEMP or APPDATA directories, which are restricted to the specific account running your application. This situation might happen when an endpoint was temporarily unavailable or if you hit the throttling limit. After this issue is resolved, the telemetry channel will resume sending all the new and persisted data.
- This persisted data isn't encrypted locally. If this issue is a concern, review the data and restrict the collection of private data. For more information, see [Export and delete private data](../logs/personal-data-mgmt.md#exporting-and-deleting-personal-data).
- If a customer needs to configure this directory with specific security requirements, it can be configured per framework. Make sure that the process running your application has write access to this directory. Also make sure this directory is protected to avoid telemetry being read by unintended users.

### Java

The folder `C:\Users\username\AppData\Local\Temp` is used for persisting data. This location isn't configurable from the config directory, and the permissions to access this folder are restricted to the specific user with required credentials. For more information, see [implementation](https://github.com/Microsoft/ApplicationInsights-Java/blob/40809cb6857231e572309a5901e1227305c27c1a/core/src/main/java/com/microsoft/applicationinsights/internal/util/LocalFileSystemUtils.java#L48-L72).

### .NET

By default, `ServerTelemetryChannel` uses the current user's local app data folder `%localAppData%\Microsoft\ApplicationInsights` or temp folder `%TMP%`. For more information, see [implementation](https://github.com/Microsoft/ApplicationInsights-dotnet/blob/91e9c91fcea979b1eec4e31ba8e0fc683bf86802/src/ServerTelemetryChannel/Implementation/ApplicationFolderProvider.cs#L54-L84).

Via configuration file:
```xml
<TelemetryChannel Type="Microsoft.ApplicationInsights.WindowsServer.TelemetryChannel.ServerTelemetryChannel,   Microsoft.AI.ServerTelemetryChannel">
    <StorageFolder>D:\NewTestFolder</StorageFolder>
</TelemetryChannel>
```

Via code:

- Remove `ServerTelemetryChannel` from the configuration file.
- Add this snippet to your configuration:

  ```csharp
  ServerTelemetryChannel channel = new ServerTelemetryChannel();
  channel.StorageFolder = @"D:\NewTestFolder";
  channel.Initialize(TelemetryConfiguration.Active);
  TelemetryConfiguration.Active.TelemetryChannel = channel;
  ```

### NetCore

By default, `ServerTelemetryChannel` uses the current user's local app data folder `%localAppData%\Microsoft\ApplicationInsights` or temp folder `%TMP%`. For more information, see [implementation](https://github.com/Microsoft/ApplicationInsights-dotnet/blob/91e9c91fcea979b1eec4e31ba8e0fc683bf86802/src/ServerTelemetryChannel/Implementation/ApplicationFolderProvider.cs#L54-L84).

In a Linux environment, local storage will be disabled unless a storage folder is specified.

> [!NOTE]
> With the release 2.15.0-beta3 and greater, local storage is now automatically created for Linux, Mac, and Windows. For non-Windows systems, the SDK will automatically create a local storage folder based on the following logic:
>
> - `${TMPDIR}`: If `${TMPDIR}` environment variable is set, this location is used.
> - `/var/tmp`: If the previous location doesn't exist, we try `/var/tmp`.
> - `/tmp`: If both the previous locations don't exist, we try `tmp`.
> - If none of those locations exist, local storage isn't created and manual configuration is still required.
>
> For full implementation details, see [ServerTelemetryChannel stores telemetry data in default folder during transient errors in non-Windows environments](https://github.com/microsoft/ApplicationInsights-dotnet/pull/1860).

The following code snippet shows how to set `ServerTelemetryChannel.StorageFolder` in the `ConfigureServices()` method of your `Startup.cs` class:

```csharp
services.AddSingleton(typeof(ITelemetryChannel), new ServerTelemetryChannel () {StorageFolder = "/tmp/myfolder"});
```

For more information, see [AspNetCore custom configuration](https://github.com/Microsoft/ApplicationInsights-aspnetcore/wiki/Custom-Configuration).

### Node.js

By default, `%TEMP%/appInsights-node{INSTRUMENTATION KEY}` is used for persisting data. Permissions to access this folder are restricted to the current user and administrators. For more information, see the [implementation](https://github.com/Microsoft/ApplicationInsights-node.js/blob/develop/Library/Sender.ts).

The folder prefix `appInsights-node` can be overridden by changing the runtime value of the static variable `Sender.TEMPDIR_PREFIX` found in [Sender.ts](https://github.com/Microsoft/ApplicationInsights-node.js/blob/7a1ecb91da5ea0febf5ceab13d6a4bf01a63933d/Library/Sender.ts#L384).

### JavaScript (browser)

[HTML5 Session Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) is used to persist data. Two separate buffers are used: `AI_buffer` and `AI_sent_buffer`. Telemetry that's batched and waiting to be sent is stored in `AI_buffer`. Telemetry that was just sent is placed in `AI_sent_buffer` until the ingestion server responds that it was successfully received.

When telemetry is successfully received, it's removed from all buffers. On transient failures (for example, a user loses network connectivity), telemetry remains in `AI_buffer` until it's successfully received or the ingestion server responds that the telemetry is invalid (bad schema or too old, for example).

Telemetry buffers can be disabled by setting [`enableSessionStorageBuffer`](https://github.com/microsoft/ApplicationInsights-JS/blob/17ef50442f73fd02a758fbd74134933d92607ecf/legacy/JavaScript/JavaScriptSDK.Interfaces/IConfig.ts#L31) to `false`. When session storage is turned off, a local array is instead used as persistent storage. Because the JavaScript SDK runs on a client device, the user has access to this storage location via their browser's developer tools.

### OpenCensus Python

By default, OpenCensus Python SDK uses the current user folder `%username%/.opencensus/.azure/`. Permissions to access this folder are restricted to the current user and administrators. For more information, see the [implementation](https://github.com/census-instrumentation/opencensus-python/blob/master/contrib/opencensus-ext-azure/opencensus/ext/azure/common/storage.py). The folder with your persisted data will be named after the Python file that generated the telemetry.

You can change the location of your storage file by passing in the `storage_path` parameter in the constructor of the exporter you're using.

```python
AzureLogHandler(
  connection_string='InstrumentationKey=00000000-0000-0000-0000-000000000000',
  storage_path='<your-path-here>',
)
```

## How do I send data to Application Insights using TLS 1.2?

To ensure the security of data in transit to the Application Insights endpoints, we strongly encourage customers to configure their application to use at least Transport Layer Security (TLS) 1.2. Older versions of TLS/Secure Sockets Layer (SSL) have been found to be vulnerable. Although they still currently work to allow backward compatibility, they *aren't recommended*. The industry is quickly moving to abandon support for these older protocols.

The [PCI Security Standards Council](https://www.pcisecuritystandards.org/) has set a [deadline of June 30, 2018](https://www.pcisecuritystandards.org/pdfs/PCI_SSC_Migrating_from_SSL_and_Early_TLS_Resource_Guide.pdf) to disable older versions of TLS/SSL and upgrade to more secure protocols. After Azure drops legacy support, if your application or clients can't communicate over at least TLS 1.2, you wouldn't be able to send data to Application Insights. The approach you take to test and validate your application's TLS support will vary depending on the operating system or platform and the language or framework your application uses.

We do not recommend explicitly setting your application to only use TLS 1.2, unless necessary. This setting can break platform-level security features that allow you to automatically detect and take advantage of newer more secure protocols as they become available, such as TLS 1.3. We recommend that you perform a thorough audit of your application's code to check for hardcoding of specific TLS/SSL versions.

### Platform/Language-specific guidance

|Platform/Language | Support | More information |
| --- | --- | --- |
| Azure App Services  | Supported, configuration might be required. | Support was announced in April 2018. Read the announcement for [configuration details](https://azure.github.io/AppService/2018/04/17/App-Service-and-Functions-hosted-apps-can-now-update-TLS-versions!).  |
| Azure Function Apps | Supported, configuration might be required. | Support was announced in April 2018. Read the announcement for [configuration details](https://azure.github.io/AppService/2018/04/17/App-Service-and-Functions-hosted-apps-can-now-update-TLS-versions!). |
|.NET | Supported, Long Term Support (LTS). | For detailed configuration information, refer to [these instructions](/dotnet/framework/network-programming/tls). |
|Application Insights Agent| Supported, configuration required. | Application Insights Agent relies on [OS Configuration](/windows-server/security/tls/tls-registry-settings) + [.NET Configuration](/dotnet/framework/network-programming/tls#support-for-tls-12) to support TLS 1.2.
|Node.js |  Supported, in v10.5.0, configuration might be required. | Use the [official Node.js TLS/SSL documentation](https://nodejs.org/api/tls.html) for any application-specific configuration. |
|Java | Supported, JDK support for TLS 1.2 was added in [JDK 6 update 121](https://www.oracle.com/technetwork/java/javase/overview-156328.html#R160_121) and [JDK 7](https://www.oracle.com/technetwork/java/javase/7u131-relnotes-3338543.html). | JDK 8 uses [TLS 1.2 by default](https://blogs.oracle.com/java-platform-group/jdk-8-will-use-tls-12-as-default).  |
|Linux | Linux distributions tend to rely on [OpenSSL](https://www.openssl.org) for TLS 1.2 support.  | Check the [OpenSSL Changelog](https://www.openssl.org/news/changelog.html) to confirm your version of OpenSSL is supported.|
| Windows 8.0 - 10 | Supported, and enabled by default. | To confirm that you're still using the [default settings](/windows-server/security/tls/tls-registry-settings).  |
| Windows Server 2012 - 2016 | Supported, and enabled by default. | To confirm that you're still using the [default settings](/windows-server/security/tls/tls-registry-settings). |
| Windows 7 SP1 and Windows Server 2008 R2 SP1 | Supported, but not enabled by default. | See the [Transport Layer Security (TLS) registry settings](/windows-server/security/tls/tls-registry-settings) page for details on how to enable.  |
| Windows Server 2008 SP2 | Support for TLS 1.2 requires an update. | See [Update to add support for TLS 1.2](https://support.microsoft.com/help/4019276/update-to-add-support-for-tls-1-1-and-tls-1-2-in-windows-server-2008-s) in Windows Server 2008 SP2. |
|Windows Vista | Not supported. | N/A

### Check what version of OpenSSL your Linux distribution is running

To check what version of OpenSSL you have installed, open the terminal and run:

```terminal
openssl version -a
```

### Run a test TLS 1.2 transaction on Linux

To run a preliminary test to see if your Linux system can communicate over TLS 1.2, open the terminal and run:

```terminal
openssl s_client -connect bing.com:443 -tls1_2
```

## Personal data stored in Application Insights

For an in-depth discussion on this issue, see [Managing personal data in Log Analytics and Application Insights](../logs/personal-data-mgmt.md).

#### Can my users turn off Application Insights?

Not directly. We don't provide a switch that your users can operate to turn off Application Insights.

You can implement such a feature in your application. All the SDKs include an API setting that turns off telemetry collection.

## Data sent by Application Insights

The SDKs vary between platforms, and there are several components that you can install. For more information, see [Application Insights overview][start]. Each component sends different data.

#### Classes of data sent in different scenarios

| Your action | Data classes collected (see next table) |
| --- | --- |
| [Add Application Insights SDK to a .NET web project][greenbrown] |ServerContext<br/>Inferred<br/>Perf counters<br/>Requests<br/>**Exceptions**<br/>Session<br/>users |
| [Install Application Insights Agent on IIS][redfield] |Dependencies<br/>ServerContext<br/>Inferred<br/>Perf counters |
| [Add Application Insights SDK to a Java web app][java] |ServerContext<br/>Inferred<br/>Request<br/>Session<br/>users |
| [Add JavaScript SDK to webpage][client] |ClientContext <br/>Inferred<br/>Page<br/>ClientPerf<br/>Ajax |
| [Define default properties][apiproperties] |**Properties** on all standard and custom events |
| [Call TrackMetric][api] |Numeric values<br/>**Properties** |
| [Call Track*][api] |Event name<br/>**Properties** |
| [Call TrackException][api] |**Exceptions**<br/>Stack dump<br/>**Properties** |
| SDK can't collect data. For example: <br/> - Can't access perf counters<br/> - Exception in telemetry initializer |SDK diagnostics |

For [SDKs for other platforms][platforms], see their documents.

#### The classes of collected data

| Collected data class | Includes (not an exhaustive list) |
| --- | --- |
| **Properties** |**Any data - determined by your code** |
| DeviceContext |`Id`, IP, Locale, Device model, network, network type, OEM name, screen resolution, Role Instance, Role Name, Device Type |
| ClientContext |OS, locale, language, network, window resolution |
| Session |`session id` |
| ServerContext |Machine name, locale, OS, device, user session, user context, operation |
| Inferred |Geolocation from IP address, timestamp, OS, browser |
| Metrics |Metric name and value |
| Events |Event name and value |
| PageViews |URL and page name or screen name |
| Client perf |URL/page name, browser load time |
| Ajax |HTTP calls from webpage to server |
| Requests |URL, duration, response code |
| Dependencies |Type (SQL, HTTP, ...), connection string, or URI, sync/async, duration, success, SQL statement (with Application Insights Agent) |
| Exceptions |Type, message, call stacks, source file, line number, `thread id` |
| Crashes |`Process id`, `parent process id`, `crash thread id`; application patch, `id`, build; exception type, address, reason; obfuscated symbols and registers, binary start and end addresses, binary name and path, cpu type |
| Trace |Message and severity level |
| Perf counters |Processor time, available memory, request rate, exception rate, process private bytes, IO rate, request duration, request queue length |
| Availability |Web test response code, duration of each test step, test name, timestamp, success, response time, test location |
| SDK diagnostics |Trace message or exception |

You can [switch off some of the data by editing ApplicationInsights.config][config].

> [!NOTE]
> Client IP is used to infer geographic location, but by default IP data is no longer stored and all zeroes are written to the associated field. To understand more about personal data handling, see [Managing personal data in Log Analytics and Application Insights](../logs/personal-data-mgmt.md#application-data). If you need to store IP address data, [geolocation and IP address handling](./ip-collection.md) will walk you through your options.

## Can I modify or update data after it has been collected?

No. Data is read-only and can only be deleted via the purge functionality. To learn more, see [Guidance for personal data stored in Log Analytics and Application Insights](../logs/personal-data-mgmt.md#delete).

<!--Link references-->

[api]: ./api-custom-events-metrics.md
[apiproperties]: ./api-custom-events-metrics.md#properties
[client]: ./javascript.md
[config]: ./configuration-with-applicationinsights-config.md
[greenbrown]: ./asp-net.md
[java]: ./opentelemetry-enable.md?tabs=java
[platforms]: ./app-insights-overview.md#supported-languages
[pricing]: https://azure.microsoft.com/pricing/details/application-insights/
[redfield]: ./application-insights-asp-net-agent.md
[start]: ./app-insights-overview.md
