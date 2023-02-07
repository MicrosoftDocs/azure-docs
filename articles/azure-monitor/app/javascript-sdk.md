---
title: Microsoft Azure Monitor Application Insights JavaScript SDK
description: Microsoft Azure Monitor Application Insights JavaScript SDK is a powerful tool for monitoring and analyzing web application performance.
ms.topic: conceptual
ms.date: 11/15/2022
ms.devlang: javascript
ms.custom: devx-track-js
ms.reviewer: mmcc
---

# Microsoft Azure Monitor Application Insights JavaScript SDK

[Microsoft Azure Monitor Application Insights](app-insights-overview.md) JavaScript SDK is a powerful tool that allows developers to monitor and analyze the performance of their JavaScript web applications. It enables developers to track page views, user sessions, and custom events, and configure other options to suit their needs. With the SDK, developers can gain valuable insights into how their web applications are being used and identify areas for improvement.

## Get started

You can add the Application Insights JavaScript SDK to your application by using one of the following two options:

- **Node Package Manager (npm) setup**

    The npm setup installs the JavaScript SDK as a dependency to your project and enables IntelliSense. This option is recommended for developers who want more custom events and configuration.

- **JavaScript snippet**

     The snippet fetches the SDK at runtime. This option is recommended for developers who desire quick enablement of out-of-the-box web analytics.

### Node Package Manager (npm) setup

To use the Node Package Manager (npm) setup, you'll need to have Node.js and npm installed on your machine.

Once you have those prerequisites, you can follow these steps:

1. Open a terminal or command prompt and navigate to the root directory of your project.
2. Run the command `npm install applicationinsights` to install the SDK as a dependency to your project.
3. Import the SDK in your JavaScript code by adding the following line at the top of your main JavaScript file: `import { ApplicationInsights } from 'applicationinsights';`
4. Initialize the SDK by adding the following code snippet in your main JavaScript file:

```javascript
const appInsights = new ApplicationInsights({
    config: {
        connectionString: 'YOUR_CONNECTION_STRING'
    }
});
appInsights.loadAppInsights();
```

5. Replace 'YOUR_CONNECTION_STRING' with the actual connection string for your Application Insights resource.

You can also use the `setConfig` method to set the connection string after the SDK has been initialized.

```javascript
appInsights.setConfig({
    connectionString: 'YOUR_CONNECTION_STRING'
});
```

This way you can change the connection string dynamically at runtime.

You can now use the SDK to track page views, user sessions, and custom events.

> [!NOTE]
> You can also use the package.json file to specify the top-level dependencies your application requires so that the hosting platform can install the dependencies, rather than requiring you to include the node_modules folder as part of the deployment. After the application has been deployed, the npm install command is used to parse the package.json file and install all the dependencies listed.

### JavaScript snippet

To use the JavaScript snippet to enable the Application Insights SDK for JavaScript, you'll need to add the following code to the head of your HTML file:

```html
<script type="text/javascript">
    var sdkInstance="appInsights";
    window[sdkInstance] = window[sdkInstance] || function (config) {
        function r(config){t[config]=function(){var i=arguments;t.queue.push(function(){t[config].apply(t,i)})}}var t={config:config},u=document,e=window,o="script",s="AuthenticatedUserContext",h="start",c="stop",l="Track",a=l+"Event",v=l+"Page",y=u.createElement(o),r("start"),r("stop"),r("TrackEvent"),r("TrackPage"),u.getElementsByTagName(o)[0].parentNode.appendChild(y);
        y.src=config.src;
        t.cookie=u.cookie;
        t.queue=[];
        return t;
    }({
        src: "https://az416426.vo.msecnd.net/scripts/a/ai.0.js",
        connectionString: 'YOUR_CONNECTION_STRING'
    });
    window[sdkInstance].queue.push(function () {
        window[sdkInstance].start();
    });
</script>
```

The configuration options available for the JavaScript snippet to enable the Application Insights SDK for JavaScript are:

- `src`: The URL of the SDK script. The default value is "https://az416426.vo.msecnd.net/scripts/a/ai.0.js".
- `connectionString`: The connection string for your Application Insights resource used to authenticate and authorize the SDK to send data to your resource.
- `cookie`: The cookie object for the current page used to track user sessions.
- `queue`: An array of functions that will be executed when the SDK is loaded.

### Confirm data is flowing

Check the data flow by going to the Azure portal and navigating to the Application Insights resource that you've enabled the SDK for. From there, you can view the data in the "Live Metrics Stream" or "Metrics" sections. 

Additionally, you can use the SDK's trackPageView() method to manually send a page view event and verify that it appears in the portal.

If you can't run the application or you aren't getting data as expected, see [Troubleshooting](#troubleshooting).

## Sampling

Enabling sampling can help reduce the amount of data that is sent to the Application Insights service, which can help lower costs and improve performance. Sampling is useful in situations where you have a high volume of telemetry data, such as when you have a large number of users or a high traffic website. By only sending a subset of the data, you can still get a good understanding of the overall performance and usage of your application without overwhelming the service. Additionally, sampling can also help you identify and troubleshoot issues more quickly by focusing on the most important data.

To enable sampling for the Application Insights JavaScript SDK, you'll need to update the configuration object that is passed to the SDK's initialization method. Specifically, you'll need to set the "sampling" property to an object with the "isEnabled" property set to true and the "maxTelemetryItemsPerSecond" property set to the desired threshold at which sampling should begin. Here's an example of how you would enable sampling with a threshold of five telemetry items per second:

```javascript
var appInsights = new ApplicationInsights({
  connectionString: "YOUR_CONNECTION_STRING",
  sampling: {
    isEnabled: true,
    maxTelemetryItemsPerSecond: 5
  }
});
appInsights.loadAppInsights();
```

For more information about sampling, see [Sampling in Application Insights](sampling.md).

## Distributed Tracing

To enable distributed tracing using the Application Insights JavaScript SDK, you'll need to update the configuration object that is passed to the SDK's initialization method. Specifically, you'll need to set the "distributedTracingMode" property to "AI_AND_W3C" or "W3C" depending on your requirements. Here's an example of how you would enable distributed tracing:

```javascript
var appInsights = new ApplicationInsights({
  connectionString: "YOUR_CONNECTION_STRING",
  distributedTracingMode: "AI_AND_W3C"
});
appInsights.loadAppInsights();
```
## Metrics

<!-- TODO ADD METRICS SECTION -->


## Custom telemetry

This section explains how to collect custom telemetry from your application.

### Spans

Spans are used to track the duration of a specific operation or activity within your application. You can use the SDK's startTrackEvent() and stopTrackEvent() methods to create and end spans, respectively. Here's an example of how you would use these methods to create a span for a specific operation:

```javascript
var appInsights = new ApplicationInsights({
  instrumentationKey: "YOUR_INSTRUMENTATION_KEY"
});
appInsights.loadAppInsights();

// Start the span
appInsights.startTrackEvent("my-operation");

// Perform the operation
// ...

// Stop the span
appInsights.stopTrackEvent("my-operation");
```

### Custom Metrics

To use custom metrics with the Application Insights JavaScript SDK, you can use the trackMetric() method to send a single metric value or the getMetric() method to send an aggregate metric value. Here's an example of how you would use the trackMetric() method to send a single metric value:

```javascript
var appInsights = new ApplicationInsights({
  connectionString: "YOUR_CONNECTION_STRING"
});
appInsights.loadAppInsights();
appInsights.trackMetric({name: "queueLength", average: 42});
```

Here's an example of how you would use the getMetric() method to send an aggregate metric value:

```javascript
var appInsights = new ApplicationInsights({
  connectionString: "YOUR_CONNECTION_STRING"
});
appInsights.loadAppInsights();
var metric = appInsights.getMetric("queueLength");
metric.trackValue(42);
```

### Custom Exceptions

To add custom exceptions using the Application Insights JavaScript SDK, you'll need to use the trackException() method and pass in the exception object as a parameter. Here's an example of how you would use the trackException() method with a connection string:

```javascript
var appInsights = new ApplicationInsights({
  connectionString: "YOUR_CONNECTION_STRING"
});
appInsights.loadAppInsights();

try {
  // Perform some operation that may throw an exception
  // ...
} catch (ex) {
  appInsights.trackException({exception: ex});
}
```

## Configuration

Most configuration fields are named so that they can default to false. All fields are optional except for `connectionString`.

| Name | Description | Default |
|------|-------------|---------|
| connectionString | *Required*<br>Connection string that you obtained from the Azure portal. | string<br/>null |
| accountId | An optional account ID if your app groups users into accounts. No spaces, commas, semicolons, equal signs, or vertical bars. | string<br/>null |
| sessionRenewalMs | A session is logged if the user is inactive for this amount of time in milliseconds. | numeric<br/>1800000<br/>(30 mins) |
| sessionExpirationMs | A session is logged if it has continued for this amount of time in milliseconds. | numeric<br/>86400000<br/>(24 hours) |
| maxBatchSizeInBytes | Maximum size of telemetry batch. If a batch exceeds this limit, it's immediately sent and a new batch is started. | numeric<br/>10000 |
| maxBatchInterval | How long to batch telemetry before sending (milliseconds). | numeric<br/>15000 |
| disable&#8203;ExceptionTracking | If true, exceptions aren't autocollected. | boolean<br/> false |
| disableTelemetry | If true, telemetry isn't collected or sent. | boolean<br/>false |
| enableDebug | If true, *internal* debugging data is thrown as an exception *instead* of being logged, regardless of SDK logging settings. Default is false. <br>*Note:* Enabling this setting will result in dropped telemetry whenever an internal error occurs. This setting can be useful for quickly identifying issues with your configuration or usage of the SDK. If you don't want to lose telemetry while debugging, consider using `loggingLevelConsole` or `loggingLevelTelemetry` instead of `enableDebug`. | boolean<br/>false |
| loggingLevelConsole | Logs *internal* Application Insights errors to console. <br>0: off, <br>1: Critical errors only, <br>2: Everything (errors & warnings) | numeric<br/> 0 |
| loggingLevelTelemetry | Sends *internal* Application Insights errors as telemetry. <br>0: off, <br>1: Critical errors only, <br>2: Everything (errors & warnings) | numeric<br/> 1 |
| diagnosticLogInterval | (internal) Polling interval (in ms) for internal logging queue. | numeric<br/> 10000 |
| samplingPercentage | Percentage of events that will be sent. Default is 100, meaning all events are sent. Set this option if you want to preserve your data cap for large-scale applications. | numeric<br/>100 |
| autoTrackPageVisitTime | If true, on a pageview, the _previous_ instrumented page's view time is tracked and sent as telemetry and a new timer is started for the current pageview. It's sent as a custom metric named `PageVisitTime` in `milliseconds` and is calculated via the Date [now()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now) function (if available) and falls back to (new Date()).[getTime()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime) if now() is unavailable (Internet Explorer 8 or less). Default is false. | boolean<br/>false |
| disableAjaxTracking | If true, Ajax calls aren't autocollected. | boolean<br/> false |
| disableFetchTracking | If true, Fetch requests aren't autocollected.|boolean<br/>false |
| overridePageViewDuration | If true, default behavior of trackPageView is changed to record end of page view duration interval when trackPageView is called. If false and no custom duration is provided to trackPageView, the page view performance is calculated by using the navigation timing API. |boolean<br/>
| maxAjaxCallsPerView | Default 500 controls how many Ajax calls will be monitored per page view. Set to -1 to monitor all (unlimited) Ajax calls on the page. | numeric<br/> 500 |
| disableDataLossAnalysis | If false, internal telemetry sender buffers will be checked at startup for items not yet sent. | boolean<br/> true |
| disable&#8203;CorrelationHeaders | If false, the SDK will add two headers (`Request-Id` and `Request-Context`) to all dependency requests to correlate them with corresponding requests on the server side. | boolean<br/> false |
| correlationHeader&#8203;ExcludedDomains | Disable correlation headers for specific domains. | string[]<br/>undefined |
| correlationHeader&#8203;ExcludePatterns | Disable correlation headers by using regular expressions. | regex[]<br/>undefined |
| correlationHeader&#8203;Domains | Enable correlation headers for specific domains. | string[]<br/>undefined |
| disableFlush&#8203;OnBeforeUnload | If true, flush method won't be called when `onBeforeUnload` event triggers. | boolean<br/> false |
| enableSessionStorageBuffer | If true, the buffer with all unsent telemetry is stored in session storage. The buffer is restored on page load. | boolean<br />true |
| cookieCfg | Defaults to cookie usage enabled. For full defaults, see [ICookieCfgConfig](#icookiemgrconfig) settings. | [ICookieCfgConfig](#icookiemgrconfig)<br>(Since 2.6.0)<br/>undefined |
| ~~isCookieUseDisabled~~<br>disableCookiesUsage | If true, the SDK won't store or read any data from cookies. Disables the User and Session cookies and renders the usage panes and experiences useless. `isCookieUseDisable` is deprecated in favor of `disableCookiesUsage`. When both are provided, `disableCookiesUsage` takes precedence.<br>(Since v2.6.0) And if `cookieCfg.enabled` is also defined, it will take precedence over these values. Cookie usage can be re-enabled after initialization via `core.getCookieMgr().setEnabled(true)`. | Alias for [`cookieCfg.enabled`](#icookiemgrconfig)<br>false |
| cookieDomain | Custom cookie domain. This option is helpful if you want to share Application Insights cookies across subdomains.<br>(Since v2.6.0) If `cookieCfg.domain` is defined, it will take precedence over this value. | Alias for [`cookieCfg.domain`](#icookiemgrconfig)<br>null |
| cookiePath | Custom cookie path. This option is helpful if you want to share Application Insights cookies behind an application gateway.<br>If `cookieCfg.path` is defined, it will take precedence over this value. | Alias for [`cookieCfg.path`](#icookiemgrconfig)<br>(Since 2.6.0)<br/>null |
| isRetryDisabled | If false, retry on 206 (partial success), 408 (timeout), 429 (too many requests), 500 (internal server error), 503 (service unavailable), and 0 (offline, only if detected). | boolean<br/>false |
| isStorageUseDisabled | If true, the SDK won't store or read any data from local and session storage. | boolean<br/> false |
| isBeaconApiDisabled | If false, the SDK will send all telemetry by using the [Beacon API](https://www.w3.org/TR/beacon). | boolean<br/>true |
| onunloadDisableBeacon | When tab is closed, the SDK will send all remaining telemetry by using the [Beacon API](https://www.w3.org/TR/beacon). | boolean<br/> false |
| sdkExtension | Sets the SDK extension name. Only alphabetic characters are allowed. The extension name is added as a prefix to the `ai.internal.sdkVersion` tag (for example, `ext_javascript:2.0.0`). | string<br/> null |
| isBrowserLink&#8203;TrackingEnabled | If true, the SDK will track all [browser link](/aspnet/core/client-side/using-browserlink) requests. | boolean<br/>false |
| appId | AppId is used for the correlation between AJAX dependencies happening on the client side with the server-side requests. When the Beacon API is enabled, it can’t be used automatically but can be set manually in the configuration. |string<br/> null |
| enable&#8203;CorsCorrelation | If true, the SDK will add two headers (`Request-Id` and `Request-Context`) to all CORS requests to correlate outgoing AJAX dependencies with corresponding requests on the server side. | boolean<br/>false |
| namePrefix | An optional value that will be used as name postfix for localStorage and cookie name. | string<br/>undefined |
| enable&#8203;AutoRoute&#8203;Tracking | Automatically track route changes in single-page applications. If true, each route change will send a new page view to Application Insights. Hash route changes (`example.com/foo#bar`) are also recorded as new page views.| boolean<br/>false |
| enableRequest&#8203;HeaderTracking | If true, AJAX and Fetch request headers are tracked. | boolean<br/> false |
| enableResponse&#8203;HeaderTracking | If true, AJAX and Fetch request response headers are tracked. | boolean<br/> false |
| distributedTracingMode | Sets the distributed tracing mode. If AI_AND_W3C mode or W3C mode is set, W3C trace context headers (traceparent/tracestate) will be generated and included in all outgoing requests. AI_AND_W3C is provided for backward compatibility with any legacy Application Insights instrumented services. See examples at [this website](./correlation.md#enable-w3c-distributed-tracing-support-for-web-apps).| `DistributedTracingModes`or<br/>numeric<br/>(Since v2.6.0) `DistributedTracingModes.AI_AND_W3C`<br />(v2.5.11 or earlier) `DistributedTracingModes.AI` |
| enable&#8203;AjaxErrorStatusText | If true, include response error data text in dependency event on failed AJAX requests. | boolean<br/> false |
| enable&#8203;AjaxPerfTracking |Flag to enable looking up and including more browser window.performance timings in the reported `ajax` (XHR and fetch) reported metrics. | boolean<br/> false |
| maxAjaxPerf&#8203;LookupAttempts | The maximum number of times to look for the window.performance timings, if available. An option that is sometimes necessary because not all browsers populate the window.performance before reporting the end of the XHR request. For fetch requests, it's added after completion.| numeric<br/> 3 |
| ajaxPerfLookupDelay | The amount of time to wait before reattempting to find the window.performance timings for an `ajax` request. Time is in milliseconds and is passed directly to setTimeout(). | numeric<br/> 25 ms |
| enableUnhandled&#8203;PromiseRejection&#8203;Tracking | If true, unhandled promise rejections will be autocollected and reported as a JavaScript error. When `disableExceptionTracking` is true (don't track exceptions), the config value will be ignored, and unhandled promise rejections won't be reported. | boolean<br/> false |
| enablePerfMgr | When enabled (true), it will create local perfEvents for code that has been instrumented to emit perfEvents (via the doPerf() helper). An option that can be used to identify performance issues within the SDK based on usage or optionally within instrumented code. [More information is available in the basic documentation](https://github.com/microsoft/ApplicationInsights-JS/blob/master/docs/PerformanceMonitoring.md). Since v2.5.7 | boolean<br/>false |
| perfEvtsSendAll | When _enablePerfMgr_ is enabled and the [IPerfManager](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/IPerfManager.ts) fires a [INotificationManager](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/INotificationManager.ts).perfEvent(), this flag determines whether an event is fired (and sent to all listeners) for all events (true) or only for parent events (false &lt;default&gt;).<br />A parent [IPerfEvent](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/IPerfEvent.ts) is an event where no other IPerfEvent is still running at the point of this event being created, and its _parent_ property isn't null or undefined. Since v2.5.7 |  boolean<br />false |
| idLength | The default length used to generate new random session and user ID values. Defaults to 22. The previous default value was 5 (v2.5.8 or less). If you need to keep the previous maximum length, you should set this value to 5. |  numeric<br />22 |

## Troubleshooting

See the dedicated [troubleshooting article](/troubleshoot/azure/azure-monitor/app-insights/TBD).

## Frequently asked questions

#### What is the SDK performance/overhead?

The Application Insights JavaScript SDK has a minimal overhead on your website. At just 36 KB gzipped, and taking only ~15 ms to initialize, the SDK adds a negligible amount of load time to your website. The minimal components of the library are quickly loaded when you use the SDK, and the full script is downloaded in the background.

Additionally, while the script is downloading from the CDN, all tracking of your page is queued, so you won't lose any telemetry during the entire life cycle of your page. This setup process provides your page with a seamless analytics system that's invisible to your users.

## Support

To get support:
- Review troubleshooting steps in this article.
- For Azure support issues, open an [Azure support ticket](https://azure.microsoft.com/support/create-ticket/).

### [.NET](#tab/net)

For OpenTelemetry issues, contact the [OpenTelemetry .NET community](https://github.com/open-telemetry/opentelemetry-dotnet) directly.

### [Node.js (JavaScript)](#tab/nodejs-javascript)

For OpenTelemetry issues, contact the [OpenTelemetry JavaScript community](https://github.com/open-telemetry/opentelemetry-js) directly.

### [Node.js (TypeScript)](#tab/nodejs-typescript)

For OpenTelemetry issues, contact the [OpenTelemetry JavaScript community](https://github.com/open-telemetry/opentelemetry-js) directly.

### [Python](#tab/python)

For OpenTelemetry issues, contact the [OpenTelemetry Python community](https://github.com/open-telemetry/opentelemetry-python) directly.

---

## OpenTelemetry feedback

To provide feedback:

- Fill out the OpenTelemetry community's [customer feedback survey](https://docs.google.com/forms/d/e/1FAIpQLScUt4reClurLi60xyHwGozgM9ZAz8pNAfBHhbTZ4gFWaaXIRQ/viewform).
- Tell Microsoft about yourself by joining the [OpenTelemetry Early Adopter Community](https://aka.ms/AzMonOTel/).
- Engage with other Azure Monitor users in the [Microsoft Tech Community](https://techcommunity.microsoft.com/t5/azure-monitor/bd-p/AzureMonitor).
- Make a feature request at the [Azure Feedback Forum](https://feedback.azure.com/d365community/forum/3887dc70-2025-ec11-b6e6-000d3a4f09d0).

## Next steps

### [.NET](#tab/net)

- To review the source code, see the [Azure Monitor Exporter GitHub repository](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/monitor/Azure.Monitor.OpenTelemetry.Exporter).
- To install the NuGet package, check for updates, or view release notes, see the [Azure Monitor Exporter NuGet Package](https://www.nuget.org/packages/Azure.Monitor.OpenTelemetry.Exporter/) page.
- To become more familiar with Azure Monitor Application Insights and OpenTelemetry, see the [Azure Monitor Example Application](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/monitor/Azure.Monitor.OpenTelemetry.Exporter/tests/Azure.Monitor.OpenTelemetry.Exporter.Demo).
- To learn more about OpenTelemetry and its community, see the [OpenTelemetry .NET GitHub repository](https://github.com/open-telemetry/opentelemetry-dotnet).
- To enable usage experiences, [enable web or browser user monitoring](javascript.md).

### [Node.js (JavaScript)](#tab/nodejs-javascript)

- To review the source code, see the [Azure Monitor Exporter GitHub repository](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/monitor/monitor-opentelemetry-exporter).
- To install the npm package, check for updates, or view release notes, see the [Azure Monitor Exporter npm Package](https://www.npmjs.com/package/@azure/monitor-opentelemetry-exporter) page.
- To become more familiar with Azure Monitor Application Insights and OpenTelemetry, see the [Azure Monitor Example Application](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/monitor/monitor-opentelemetry-exporter/samples).
- To learn more about OpenTelemetry and its community, see the [OpenTelemetry JavaScript GitHub repository](https://github.com/open-telemetry/opentelemetry-js).
- To enable usage experiences, [enable web or browser user monitoring](javascript.md).

### [Node.js (TypeScript)](#tab/nodejs-typescript)

- To review the source code, see the [Azure Monitor Exporter GitHub repository](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/monitor/monitor-opentelemetry-exporter).
- To install the npm package, check for updates, or view release notes, see the [Azure Monitor Exporter npm Package](https://www.npmjs.com/package/@azure/monitor-opentelemetry-exporter) page.
- To become more familiar with Azure Monitor Application Insights and OpenTelemetry, see the [Azure Monitor Example Application](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/monitor/monitor-opentelemetry-exporter/samples).
- To learn more about OpenTelemetry and its community, see the [OpenTelemetry JavaScript GitHub repository](https://github.com/open-telemetry/opentelemetry-js).
- To enable usage experiences, [enable web or browser user monitoring](javascript.md).

### [Python](#tab/python)

- To review the source code, see the [Azure Monitor Exporter GitHub repository](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/monitor/azure-monitor-opentelemetry-exporter/README.md).
- To install the PyPI package, check for updates, or view release notes, see the [Azure Monitor Exporter  PyPI Package](https://pypi.org/project/azure-monitor-opentelemetry-exporter/) page.
- To become more familiar with Azure Monitor Application Insights and OpenTelemetry, see the [Azure Monitor Example Application](https://github.com/Azure-Samples/azure-monitor-opentelemetry-python).
- To learn more about OpenTelemetry and its community, see the [OpenTelemetry Python GitHub repository](https://github.com/open-telemetry/opentelemetry-python).
- To enable usage experiences, [enable web or browser user monitoring](javascript.md).
