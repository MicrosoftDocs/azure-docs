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

[Microsoft Azure Monitor Application Insights](app-insights-overview.md) JavaScript SDK allows you to monitor and analyze the performance of JavaScript web applications.

## Prerequisites

- Azure subscription: [Create an Azure subscription for free](https://azure.microsoft.com/free/)
- Application Insights resource: [Create an Application Insights resource](create-workspace-resource.md#create-a-workspace-based-resource)
- An application that uses [JavaScript](https://learn.microsoft.com/visualstudio/javascript)

## [Snippet](#tab/snippet)

## Get started

The Application Insights JavaScript SDK is implemented with a runtime snippet for out-of-the-box web analytics.

### Enable Application Insights SDK for JavaScript

Only two steps are required to enable the Application Insights SDK for JavaScript.

#### Add the following code snippet to the head of an HTML file.

```html
<script type="text/javascript">
!function(T,l,y){var S=T.location,k="script",D="instrumentationKey",C="ingestionendpoint",I="disableExceptionTracking",E="ai.device.",b="toLowerCase",w="crossOrigin",N="POST",e="appInsightsSDK",t=y.name||"appInsights";(y.name||T[e])&&(T[e]=t);var n=T[t]||function(d){var g=!1,f=!1,m={initialize:!0,queue:[],sv:"5",version:2,config:d};function v(e,t){var n={},a="Browser";return n[E+"id"]=a[b](),n[E+"type"]=a,n["ai.operation.name"]=S&&S.pathname||"_unknown_",n["ai.internal.sdkVersion"]="javascript:snippet_"+(m.sv||m.version),{time:function(){var e=new Date;function t(e){var t=""+e;return 1===t.length&&(t="0"+t),t}return e.getUTCFullYear()+"-"+t(1+e.getUTCMonth())+"-"+t(e.getUTCDate())+"T"+t(e.getUTCHours())+":"+t(e.getUTCMinutes())+":"+t(e.getUTCSeconds())+"."+((e.getUTCMilliseconds()/1e3).toFixed(3)+"").slice(2,5)+"Z"}(),iKey:e,name:"Microsoft.ApplicationInsights."+e.replace(/-/g,"")+"."+t,sampleRate:100,tags:n,data:{baseData:{ver:2}}}}var h=d.url||y.src;if(h){function a(e){var t,n,a,i,r,o,s,c,u,p,l;g=!0,m.queue=[],f||(f=!0,t=h,s=function(){var e={},t=d.connectionString;if(t)for(var n=t.split(";"),a=0;a<n.length;a++){var i=n[a].split("=");2===i.length&&(e[i[0][b]()]=i[1])}if(!e[C]){var r=e.endpointsuffix,o=r?e.location:null;e[C]="https://"+(o?o+".":"")+"dc."+(r||"services.visualstudio.com")}return e}(),c=s[D]||d[D]||"",u=s[C],p=u?u+"/v2/track":d.endpointUrl,(l=[]).push((n="SDK LOAD Failure: Failed to load Application Insights SDK script (See stack for details)",a=t,i=p,(o=(r=v(c,"Exception")).data).baseType="ExceptionData",o.baseData.exceptions=[{typeName:"SDKLoadFailed",message:n.replace(/\./g,"-"),hasFullStack:!1,stack:n+"\nSnippet failed to load ["+a+"] -- Telemetry is disabled\nHelp Link: https://go.microsoft.com/fwlink/?linkid=2128109\nHost: "+(S&&S.pathname||"_unknown_")+"\nEndpoint: "+i,parsedStack:[]}],r)),l.push(function(e,t,n,a){var i=v(c,"Message"),r=i.data;r.baseType="MessageData";var o=r.baseData;return o.message='AI (Internal): 99 message:"'+("SDK LOAD Failure: Failed to load Application Insights SDK script (See stack for details) ("+n+")").replace(/\"/g,"")+'"',o.properties={endpoint:a},i}(0,0,t,p)),function(e,t){if(JSON){var n=T.fetch;if(n&&!y.useXhr)n(t,{method:N,body:JSON.stringify(e),mode:"cors"});else if(XMLHttpRequest){var a=new XMLHttpRequest;a.open(N,t),a.setRequestHeader("Content-type","application/json"),a.send(JSON.stringify(e))}}}(l,p))}function i(e,t){f||setTimeout(function(){!t&&m.core||a()},500)}var e=function(){var n=l.createElement(k);n.src=h;var e=y[w];return!e&&""!==e||"undefined"==n[w]||(n[w]=e),n.onload=i,n.onerror=a,n.onreadystatechange=function(e,t){"loaded"!==n.readyState&&"complete"!==n.readyState||i(0,t)},n}();y.ld<0?l.getElementsByTagName("head")[0].appendChild(e):setTimeout(function(){l.getElementsByTagName(k)[0].parentNode.appendChild(e)},y.ld||0)}try{m.cookie=l.cookie}catch(p){}function t(e){for(;e.length;)!function(t){m[t]=function(){var e=arguments;g||m.queue.push(function(){m[t].apply(m,e)})}}(e.pop())}var n="track",r="TrackPage",o="TrackEvent";t([n+"Event",n+"PageView",n+"Exception",n+"Trace",n+"DependencyData",n+"Metric",n+"PageViewPerformance","start"+r,"stop"+r,"start"+o,"stop"+o,"addTelemetryInitializer","setAuthenticatedUserContext","clearAuthenticatedUserContext","flush"]),m.SeverityLevel={Verbose:0,Information:1,Warning:2,Error:3,Critical:4};var s=(d.extensionConfig||{}).ApplicationInsightsAnalytics||{};if(!0!==d[I]&&!0!==s[I]){var c="onerror";t(["_"+c]);var u=T[c];T[c]=function(e,t,n,a,i){var r=u&&u(e,t,n,a,i);return!0!==r&&m["_"+c]({message:e,url:t,lineNumber:n,columnNumber:a,error:i}),r},d.autoExceptionInstrumented=!0}return m}(y.cfg);function a(){y.onInit&&y.onInit(n)}(T[t]=n).queue&&0===n.queue.length?(n.queue.push(a),n.trackPageView({})):a()}(window,document,{
src: "https://js.monitor.azure.com/scripts/b/ai.2.min.js", // The SDK URL Source
// name: "appInsights", // Global SDK Instance name defaults to "appInsights" when not supplied
// ld: 0, // Defines the load delay (in ms) before attempting to load the sdk. -1 = block page load and add to head. (default) = 0ms load after timeout,
// useXhr: 1, // Use XHR instead of fetch to report failures (if available),
crossOrigin: "anonymous", // When supplied this will add the provided value as the cross origin attribute on the script tag
// onInit: null, // Once the application insights instance has loaded and initialized this callback function will be called with 1 argument -- the sdk instance (DO NOT ADD anything to the sdk.queue -- As they won't get called)
cfg: { // Application Insights Configuration
    connectionString: "CONNECTION_STRING"
}});
</script>
```

#### Define the connection string

An Application Insights [connection string](sdk-connection-string.md) contains information to connect to the Azure cloud and associate telemetry data with a specific Application Insights resource. The connection string includes the Instrumentation Key (a unique identifier), the endpoint suffix (to specify the Azure cloud), and optional explicit endpoints for individual services. The connection string is not considered a security token or key.

In the code snippet, replace the placeholder `"CONNECTION_STRING"` with your actual connection string found in the Azure portal.

    1. Navigate to the **Overview** pane of your Application Insights resource.
    1. Locate the **Connection String**.
    1. Select the button to copy the connection string to the clipboard.

    :::image type="content" source="media/migrate-from-instrumentation-keys-to-connection-strings/migrate-from-instrumentation-keys-to-connection-strings.png" alt-text="Screenshot that shows Application Insights overview and connection string." lightbox="media/migrate-from-instrumentation-keys-to-connection-strings/migrate-from-instrumentation-keys-to-connection-strings.png":::

## What is collected automatically?

When you enable the App Insights JavaScript SDK using a code snippet, the following data classes are collected automatically:

- ClientContext: OS, locale, language, network, window resolution
- Inferred: Geolocation from IP address, timestamp, OS, browser
- PageViews: URL and page name or screen name
- Client perf: URL/page name, browser load time
- Ajax: HTTP calls from webpage to server

For more information, refer to the following link: https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/azure-monitor/app/data-retention-privacy.md

## Confirm data is flowing

Check the data flow by going to the Azure portal and navigating to the Application Insights resource that you've enabled the SDK for. From there, you can view the data in the "Live Metrics Stream" or "Metrics" sections. 

Additionally, you can use the SDK's trackPageView() method to manually send a page view event and verify that it appears in the portal.

If you can't run the application or you aren't getting data as expected, see [Troubleshooting](#troubleshooting).

### Analytics

To query your telemetry collected by the JavaScript SDK, select the **View in Logs (Analytics)** button. By adding a `where` statement of `client_Type == "Browser"`, you'll only see data from the JavaScript SDK. Any server-side telemetry collected by other SDKs will be excluded.

```kusto
// average pageView duration by name
let timeGrain=5m;
let dataset=pageViews
// additional filters can be applied here
| where timestamp > ago(1d)
| where client_Type == "Browser" ;
// calculate average pageView duration for all pageViews
dataset
| summarize avg(duration) by bin(timestamp, timeGrain)
| extend pageView='Overall'
// render result in a chart
| render timechart
```

## Snippet configuration

Additional snippet configuration is optional.

| Name | Type | Description
|------|------|----------------
| src | string **[required]** | The full URL for where to load the SDK from. This value is used for the "src" attribute of a dynamically added &lt;script /&gt; tag. You can use the public CDN location or your own privately hosted one.
| name | string *[optional]* | The global name for the initialized SDK, defaults to appInsights. So ```window.appInsights``` will be a reference to the initialized instance. Note: if you provide a name value or a previous instance appears to be assigned (via the global name appInsightsSDK) then this name value will also be defined in the global namespace as ```window.appInsightsSDK=<name value>```, this is required by the SDK initialization code to ensure it's initializing and updating the correct snippet skeleton and proxy methods.
| ld | number in ms *[optional]* | Defines the load delay to wait before attempting to load the SDK. Default value is 0ms and any negative value will immediately add a script tag to the &lt;head&gt; region of the page, which will then block the page load event until to script is loaded (or fails).
| useXhr | boolean *[optional]* | This setting is used only for reporting SDK load failures. Reporting will first attempt to use fetch() if available and then fallback to XHR, setting this value to true just bypasses the fetch check. Use of this value is only be required if your application is being used in an environment where fetch would fail to send the failure events.
| crossOrigin | string *[optional]* | By including this setting, the script tag added to download the SDK will include the crossOrigin attribute with this string value. When not defined (the default) no crossOrigin attribute is added. Recommended values are not defined (the default); ""; or "anonymous" (For all valid values see [HTML attribute: crossorigin](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) documentation)
| onInit | function(aiSdk) { ... } *[optional]* | This callback function which is called after the main SDK script has been successfully loaded and initialized from the CDN (based on the src value), it is passed a reference to the sdk instance that it is being called for and it is also called _before_ the first initial page view. If the SDK has already been loaded and initialized this callback will still be called. NOTE: As this callback is called during the processing of the sdk.queue array you CANNOT add any additional items to the queue as they will be ignored and dropped. (Added as part of snippet version 5 -- the sv:"5" value within the snippet script)
| cfg | object **[required]** | The configuration passed to the Application Insights SDK during initialization.

## [npm](#tab/npm)

## Get started

The Application Insights JavaScript SDK is implemented with a runtime snippet for out-of-the-box web analytics.

### Enable Application Insights SDK for JavaScript

The npm setup installs the JavaScript SDK as a dependency to your project and enables IntelliSense.

This option is only needed for developers who require more custom events and configuration.

---

## Advanced SDK configuration

Additional information is available for the following advanced scenarios:

- [JavaScript SDK npm setup](javascript-sdk.md?tabs=npm)
- [React plugin](javascript-framework-extensions.md?tabs=react)
- [React native plugin](javascript-framework-extensions.md?tabs=reactnative)
- [Angular plugin](javascript-framework-extensions.md?tabs=reactnative)
- [Click Analytics plugin](javascript-feature-extensions.md)

## Frequently asked questions

#### What is the SDK performance/overhead?

The Application Insights JavaScript SDK has a minimal overhead on your website. At just 36 KB gzipped, and taking only ~15 ms to initialize, the SDK adds a negligible amount of load time to your website. The minimal components of the library are quickly loaded when you use the SDK, and the full script is downloaded in the background.

Additionally, while the script is downloading from the CDN, all tracking of your page is queued, so you won't lose any telemetry during the entire life cycle of your page. This setup process provides your page with a seamless analytics system that's invisible to your users.

#### What browsers are supported?

![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![IE](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Opera](https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png)
--- | --- | --- | --- | --- |
Chrome Latest ✔ |  Firefox Latest ✔ | IE 9+ & Microsoft Edge ✔<br>IE 8- Compatible | Opera Latest ✔ | Safari Latest ✔ |

#### Where can I find code examples?

For runnable examples, see [Application Insights JavaScript SDK samples](https://github.com/microsoft/ApplicationInsights-JS/tree/karlie/doc/samples).

#### How can I upgrade from the old version of Application Insights?

For more information, see [Upgrade from old versions of the Application Insights JavaScript SDK](javascript-sdk-upgrade.md).

#### What is the ES3/Internet Explorer 8 compatibility?

We need to ensure that this SDK continues to "work" and doesn't break the JavaScript execution when it's loaded by an older browser. It would be ideal to not support older browsers, but numerous large customers can't control which browser their users choose to use.

This statement does *not* mean that we'll only support the lowest common set of features. We need to maintain ES3 code compatibility. New features will need to be added in a manner that wouldn't break ES3 JavaScript parsing and added as an optional feature.

See GitHub for full details on [Internet Explorer 8 support](https://github.com/Microsoft/ApplicationInsights-JS#es3ie8-compatibility).

#### Is the Application Insights SDK open-source?

Yes, the Application Insights JavaScript SDK is open source. To view the source code or to contribute to the project, see the [official GitHub repository](https://github.com/Microsoft/ApplicationInsights-JS).

#### How can I update my third-party server configuration?

The server side needs to be able to accept connections with those headers present. Depending on the `Access-Control-Allow-Headers` configuration on the server side, it's often necessary to extend the server-side list by manually adding `Request-Id`, `Request-Context`, and `traceparent` (W3C distributed header).

Access-Control-Allow-Headers: `Request-Id`, `traceparent`, `Request-Context`, `<your header>`

#### How can I disable distributed tracing?

Distributed tracing can be disabled in configuration.

## Troubleshooting

See the dedicated [troubleshooting article](/troubleshoot/azure/azure-monitor/app-insights/TBD).

## Next steps

* [Source map for JavaScript](source-map-support.md)
* [Track usage](usage-overview.md)
* [Custom events and metrics](api-custom-events-metrics.md)
* [Build-measure-learn](usage-overview.md)



<!--- Removed information

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

-->