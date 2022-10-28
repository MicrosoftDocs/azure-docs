---
title: Azure Application Insights for JavaScript web apps
description: Get page view and session counts, web client data, and single-page applications and track usage patterns. Detect exceptions and performance issues in JavaScript webpages.
ms.topic: conceptual
ms.date: 08/06/2020
ms.devlang: javascript
ms.custom: devx-track-js
ms.reviewer: mmcc
---

# Application Insights for webpages

> [!NOTE]
> We continue to assess the viability of OpenTelemetry for browser scenarios. We recommend the Application Insights JavaScript SDK for the forseeable future. It's fully compatible with OpenTelemetry distributed tracing.

Find out about the performance and usage of your webpage or app. If you add [Application Insights](app-insights-overview.md) to your page script, you get timings of page loads and AJAX calls, counts, and details of browser exceptions and AJAX failures. You also get user and session counts. All this telemetry can be segmented by page, client OS and browser version, geo location, and other dimensions. You can set alerts on failure counts or slow page loading. By inserting trace calls in your JavaScript code, you can track how the different features of your webpage application are used.

Application Insights can be used with any webpages by adding a short piece of JavaScript. Node.js has a [standalone SDK](nodejs.md). If your web service is [Java](java-in-process-agent.md) or [ASP.NET](asp-net.md), you can use the server-side SDKs with the client-side JavaScript SDK to get an end-to-end understanding of your app's performance.

## Add the JavaScript SDK

1. First you need an Application Insights resource. If you don't already have a resource and connection string, follow the instructions to [create a new resource](create-new-resource.md).
1. Copy the [connection string](#connection-string-setup) for the resource where you want your JavaScript telemetry to be sent (from step 1). You'll add it to the `connectionString` setting of the Application Insights JavaScript SDK.
1. Add the Application Insights JavaScript SDK to your webpage or app via one of the following two options:
    * [Node Package Manager (npm) setup](#npm-based-setup)
    * [JavaScript snippet](#snippet-based-setup)

> [!WARNING]
> `@microsoft/applicationinsights-web-basic - AISKULight` doesn't support the use of connection strings.

Only use one method to add the JavaScript SDK to your application. If you use the npm setup, don't use the snippet and vice versa.

> [!NOTE]
> The npm setup installs the JavaScript SDK as a dependency to your project and enables IntelliSense. The snippet fetches the SDK at runtime. Both support the same features. Developers who want more custom events and configuration generally opt for the npm setup. Users who are looking for quick enablement of out-of-the-box web analytics opt for the snippet.

### npm-based setup

Install via npm.

```sh
npm i --save @microsoft/applicationinsights-web
```

> [!Note]
> *Typings are included with this package*, so you do *not* need to install a separate typings package.
    
```js
import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const appInsights = new ApplicationInsights({ config: {
  connectionString: 'Copy connection string from Application Insights Resource Overview'
  /* ...Other Configuration Options... */
} });
appInsights.loadAppInsights();
appInsights.trackPageView(); // Manually call trackPageView to establish the current user/session/pageview
```

### Snippet-based setup

If your app doesn't use npm, you can directly instrument your webpages with Application Insights by pasting this snippet at the top of each of your pages. Preferably, it should be the first script in your `<head>` section. That way it can monitor any potential issues with all your dependencies and optionally any JavaScript errors. If you're using Blazor Server App, add the snippet at the top of the file `_Host.cshtml` in the `<head>` section.

Starting from version 2.5.5, the page view event will include the new tag "ai.internal.snippet" that contains the identified snippet version. This feature assists with tracking which version of the snippet your application is using.

The current snippet that follows is version "5." The version is encoded in the snippet as `sv:"#"`. The [current version is also available on GitHub](https://go.microsoft.com/fwlink/?linkid=2156318).

```html
<script type="text/javascript">
!function(T,l,y){var S=T.location,k="script",D="connectionString",C="ingestionendpoint",I="disableExceptionTracking",E="ai.device.",b="toLowerCase",w="crossOrigin",N="POST",e="appInsightsSDK",t=y.name||"appInsights";(y.name||T[e])&&(T[e]=t);var n=T[t]||function(d){var g=!1,f=!1,m={initialize:!0,queue:[],sv:"5",version:2,config:d};function v(e,t){var n={},a="Browser";return n[E+"id"]=a[b](),n[E+"type"]=a,n["ai.operation.name"]=S&&S.pathname||"_unknown_",n["ai.internal.sdkVersion"]="javascript:snippet_"+(m.sv||m.version),{time:function(){var e=new Date;function t(e){var t=""+e;return 1===t.length&&(t="0"+t),t}return e.getUTCFullYear()+"-"+t(1+e.getUTCMonth())+"-"+t(e.getUTCDate())+"T"+t(e.getUTCHours())+":"+t(e.getUTCMinutes())+":"+t(e.getUTCSeconds())+"."+((e.getUTCMilliseconds()/1e3).toFixed(3)+"").slice(2,5)+"Z"}(),name:"Microsoft.ApplicationInsights."+e.replace(/-/g,"")+"."+t,sampleRate:100,tags:n,data:{baseData:{ver:2}}}}var h=d.url||y.src;if(h){function a(e){var t,n,a,i,r,o,s,c,u,p,l;g=!0,m.queue=[],f||(f=!0,t=h,s=function(){var e={},t=d.connectionString;if(t)for(var n=t.split(";"),a=0;a<n.length;a++){var i=n[a].split("=");2===i.length&&(e[i[0][b]()]=i[1])}if(!e[C]){var r=e.endpointsuffix,o=r?e.location:null;e[C]="https://"+(o?o+".":"")+"dc."+(r||"services.visualstudio.com")}return e}(),c=s[D]||d[D]||"",u=s[C],p=u?u+"/v2/track":d.endpointUrl,(l=[]).push((n="SDK LOAD Failure: Failed to load Application Insights SDK script (See stack for details)",a=t,i=p,(o=(r=v(c,"Exception")).data).baseType="ExceptionData",o.baseData.exceptions=[{typeName:"SDKLoadFailed",message:n.replace(/\./g,"-"),hasFullStack:!1,stack:n+"\nSnippet failed to load ["+a+"] -- Telemetry is disabled\nHelp Link: https://go.microsoft.com/fwlink/?linkid=2128109\nHost: "+(S&&S.pathname||"_unknown_")+"\nEndpoint: "+i,parsedStack:[]}],r)),l.push(function(e,t,n,a){var i=v(c,"Message"),r=i.data;r.baseType="MessageData";var o=r.baseData;return o.message='AI (Internal): 99 message:"'+("SDK LOAD Failure: Failed to load Application Insights SDK script (See stack for details) ("+n+")").replace(/\"/g,"")+'"',o.properties={endpoint:a},i}(0,0,t,p)),function(e,t){if(JSON){var n=T.fetch;if(n&&!y.useXhr)n(t,{method:N,body:JSON.stringify(e),mode:"cors"});else if(XMLHttpRequest){var a=new XMLHttpRequest;a.open(N,t),a.setRequestHeader("Content-type","application/json"),a.send(JSON.stringify(e))}}}(l,p))}function i(e,t){f||setTimeout(function(){!t&&m.core||a()},500)}var e=function(){var n=l.createElement(k);n.src=h;var e=y[w];return!e&&""!==e||"undefined"==n[w]||(n[w]=e),n.onload=i,n.onerror=a,n.onreadystatechange=function(e,t){"loaded"!==n.readyState&&"complete"!==n.readyState||i(0,t)},n}();y.ld<0?l.getElementsByTagName("head")[0].appendChild(e):setTimeout(function(){l.getElementsByTagName(k)[0].parentNode.appendChild(e)},y.ld||0)}try{m.cookie=l.cookie}catch(p){}function t(e){for(;e.length;)!function(t){m[t]=function(){var e=arguments;g||m.queue.push(function(){m[t].apply(m,e)})}}(e.pop())}var n="track",r="TrackPage",o="TrackEvent";t([n+"Event",n+"PageView",n+"Exception",n+"Trace",n+"DependencyData",n+"Metric",n+"PageViewPerformance","start"+r,"stop"+r,"start"+o,"stop"+o,"addTelemetryInitializer","setAuthenticatedUserContext","clearAuthenticatedUserContext","flush"]),m.SeverityLevel={Verbose:0,Information:1,Warning:2,Error:3,Critical:4};var s=(d.extensionConfig||{}).ApplicationInsightsAnalytics||{};if(!0!==d[I]&&!0!==s[I]){var c="onerror";t(["_"+c]);var u=T[c];T[c]=function(e,t,n,a,i){var r=u&&u(e,t,n,a,i);return!0!==r&&m["_"+c]({message:e,url:t,lineNumber:n,columnNumber:a,error:i}),r},d.autoExceptionInstrumented=!0}return m}(y.cfg);function a(){y.onInit&&y.onInit(n)}(T[t]=n).queue&&0===n.queue.length?(n.queue.push(a),n.trackPageView({})):a()}(window,document,{
src: "https://js.monitor.azure.com/scripts/b/ai.2.min.js", // The SDK URL Source
// name: "appInsights", // Global SDK Instance name defaults to "appInsights" when not supplied
// ld: 0, // Defines the load delay (in ms) before attempting to load the sdk. -1 = block page load and add to head. (default) = 0ms load after timeout,
// useXhr: 1, // Use XHR instead of fetch to report failures (if available),
crossOrigin: "anonymous", // When supplied this will add the provided value as the cross origin attribute on the script tag
// onInit: null, // Once the application insights instance has loaded and initialized this callback function will be called with 1 argument -- the sdk instance (DO NOT ADD anything to the sdk.queue -- As they won't get called)
cfg: { // Application Insights Configuration
    connectionString: "Copy connection string from Application Insights Resource Overview"
    /* ...Other Configuration Options... */
}});
</script>
```

> [!NOTE]
> For readability and to reduce possible JavaScript errors, all the possible configuration options are listed on a new line in the preceding snippet code. If you don't want to change the value of a commented line, it can be removed.

#### Report script load failures

This version of the snippet detects and reports failures when the SDK is loaded from the CDN as an exception to the Azure Monitor portal (under the failures &gt; exceptions &gt; browser). The exception provides visibility into failures of this type so that you're aware your application isn't reporting telemetry (or other exceptions) as expected. This signal is an important measurement in understanding that you've lost telemetry because the SDK didn't load or initialize, which can lead to:

- Underreporting of how users are using or trying to use your site.
- Missing telemetry on how your users are using your site.
- Missing JavaScript errors that could potentially be blocking your users from successfully using your site.

For information on this exception, see the [SDK load failure](javascript-sdk-load-failure.md) troubleshooting page.

Reporting of this failure as an exception to the portal doesn't use the configuration option ```disableExceptionTracking``` from the Application Insights configuration. For this reason, if this failure occurs, it will always be reported by the snippet, even when `window.onerror` support is disabled.

Reporting of SDK load failures isn't supported on Internet Explorer 8 or earlier. This behavior reduces the minified size of the snippet by assuming that most environments aren't exclusively Internet Explorer 8 or less. If you have this requirement and you want to receive these exceptions, you'll need to either include a fetch poly fill or create your own snippet version that uses ```XDomainRequest``` instead of ```XMLHttpRequest```. Use the [provided snippet source code](https://github.com/microsoft/ApplicationInsights-JS/blob/master/AISKU/snippet/snippet.js) as a starting point.

> [!NOTE]
> If you're using a previous version of the snippet, update to the latest version so that you'll receive these previously unreported issues.

#### Snippet configuration options

All configuration options have been moved toward the end of the script. This placement avoids accidentally introducing JavaScript errors that wouldn't just cause the SDK to fail to load, but also it would disable the reporting of the failure.

Each configuration option is shown above on a new line. If you don't want to override the default value of an item listed as [optional], you can remove that line to minimize the resulting size of your returned page.

The available configuration options are listed in this table.

| Name | Type | Description
|------|------|----------------
| src | string *[required]* | The full URL for where to load the SDK from. This value is used for the "src" attribute of a dynamically added &lt;script /&gt; tag. You can use the public CDN location or your own privately hosted one.
| name | string *[optional]* | The global name for the initialized SDK, defaults to `appInsights`. So ```window.appInsights``` will be a reference to the initialized instance. If you provide a name value or a previous instance appears to be assigned (via the global name appInsightsSDK), this name value will also be defined in the global namespace as ```window.appInsightsSDK=<name value>```. The SDK initialization code uses this reference to ensure it's initializing and updating the correct snippet skeleton and proxy methods.
| ld | number in ms *[optional]* | Defines the load delay to wait before attempting to load the SDK. Default value is 0ms. Any negative value will immediately add a script tag to the &lt;head&gt; region of the page. The page load event is then blocked until the script is loaded or fails.
| useXhr | boolean *[optional]* | This setting is used only for reporting SDK load failures. Reporting will first attempt to use fetch() if available and then fall back to XHR. Setting this value to true just bypasses the fetch check. Use of this value is only required if your application is being used in an environment where fetch would fail to send the failure events.
| crossOrigin | string *[optional]* | By including this setting, the script tag added to download the SDK will include the crossOrigin attribute with this string value. When not defined (the default), no crossOrigin attribute is added. Recommended values aren't defined (the default); ""; or "anonymous." For all valid values, see [HTML attribute: `crossorigin`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) documentation.
| cfg | object *[required]* | The configuration passed to the Application Insights SDK during initialization.

### Connection string setup

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

```js
import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const appInsights = new ApplicationInsights({ config: {
  connectionString: 'YOUR_CONNECTION_STRING_GOES_HERE'
  /* ...Other Configuration Options... */
} });
appInsights.loadAppInsights();
appInsights.trackPageView();
```

### Send telemetry to the Azure portal

By default, the Application Insights JavaScript SDK autocollects many telemetry items that are helpful in determining the health of your application and the underlying user experience.

This telemetry includes:

- **Uncaught exceptions** in your app, including information on the:
    - Stack trace.
    - Exception details and message accompanying the error.
    - Line and column number of the error.
    - URL where the error was raised.
- **Network Dependency Requests** made by your app **XHR** and **Fetch** (fetch collection is disabled by default) requests include information on the:
    - URL of dependency source.
    - Command and method used to request the dependency.
    - Duration of the request.
    - Result code and success status of the request.
    - ID (if any) of the user making the request.
    - Correlation context (if any) where the request is made.
- **User information** (for example, location, network, IP)
- **Device information** (for example, browser, OS, version, language, model)
- **Session information**

### Telemetry initializers

Telemetry initializers are used to modify the contents of collected telemetry before being sent from the user's browser. They can also be used to prevent certain telemetry from being sent by returning `false`. Multiple telemetry initializers can be added to your Application Insights instance. They're executed in the order of adding them.

The input argument to `addTelemetryInitializer` is a callback that takes a [`ITelemetryItem`](https://github.com/microsoft/ApplicationInsights-JS/blob/master/API-reference.md#addTelemetryInitializer) as an argument and returns `boolean` or `void`. If `false` is returned, the telemetry item isn't sent, or else it proceeds to the next telemetry initializer, if any, or is sent to the telemetry collection endpoint.

An example of using telemetry initializers:

```ts
var telemetryInitializer = (envelope) => {
  envelope.data.someField = 'This item passed through my telemetry initializer';
};
appInsights.addTelemetryInitializer(telemetryInitializer);
appInsights.trackTrace({message: 'This message will use a telemetry initializer'});

appInsights.addTelemetryInitializer(() => false); // Nothing is sent after this is executed
appInsights.trackTrace({message: 'this message will not be sent'}); // Not sent
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
| ~~isCookieUseDisabled~~<br>disableCookiesUsage | If true, the SDK won't store or read any data from cookies. Disables the User and Session cookies and renders the usage blades and experiences useless. `isCookieUseDisable` is deprecated in favor of `disableCookiesUsage`. When both are provided, `disableCookiesUsage` takes precedence.<br>(Since v2.6.0) And if `cookieCfg.enabled` is also defined, it will take precedence over these values. Cookie usage can be re-enabled after initialization via `core.getCookieMgr().setEnabled(true)`. | Alias for [`cookieCfg.enabled`](#icookiemgrconfig)<br>false |
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
| maxAjaxPerf&#8203;LookupAttempts | The maximum number of times to look for the window.performance timings, if available. This option is sometimes required because not all browsers populate the window.performance before reporting the end of the XHR request. For fetch requests, this is added after it's complete.| numeric<br/> 3 |
| ajaxPerfLookupDelay | The amount of time to wait before reattempting to find the window.performance timings for an `ajax` request. Time is in milliseconds and is passed directly to setTimeout(). | numeric<br/> 25 ms |
| enableUnhandled&#8203;PromiseRejection&#8203;Tracking | If true, unhandled promise rejections will be autocollected and reported as a JavaScript error. When `disableExceptionTracking` is true (don't track exceptions), the config value will be ignored, and unhandled promise rejections won't be reported. | boolean<br/> false |
| enablePerfMgr | When enabled (true), this will create local perfEvents for code that has been instrumented to emit perfEvents (via the doPerf() helper). This option can be used to identify performance issues within the SDK based on your usage or optionally within your own instrumented code. [More information is available in the basic documentation](https://github.com/microsoft/ApplicationInsights-JS/blob/master/docs/PerformanceMonitoring.md). Since v2.5.7 | boolean<br/>false |
| perfEvtsSendAll | When _enablePerfMgr_ is enabled and the [IPerfManager](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/IPerfManager.ts) fires a [INotificationManager](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/INotificationManager.ts).perfEvent(), this flag determines whether an event is fired (and sent to all listeners) for all events (true) or only for parent events (false &lt;default&gt;).<br />A parent [IPerfEvent](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/IPerfEvent.ts) is an event where no other IPerfEvent is still running at the point of this event being created, and its _parent_ property isn't null or undefined. Since v2.5.7 |  boolean<br />false |
| idLength | The default length used to generate new random session and user ID values. Defaults to 22. The previous default value was 5 (v2.5.8 or less). If you need to keep the previous maximum length, you should set this value to 5. |  numeric<br />22 |

## Cookie handling

From version 2.6.0, cookie management is now available directly from the instance and can be disabled and re-enabled after initialization.

If disabled during initialization via the `disableCookiesUsage` or `cookieCfg.enabled` configurations, you can now re-enable via the [ICookieMgr](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/ICookieMgr.ts) `setEnabled` function.

The instance-based cookie management also replaces the previous CoreUtils global functions of `disableCookies()`, `setCookie(...)`, `getCookie(...)` and `deleteCookie(...)`. To benefit from the tree-shaking enhancements also introduced as part of version 2.6.0, you should no longer use the global functions.

### ICookieMgrConfig

Cookie configuration for instance-based cookie management added in version 2.6.0.

| Name | Description | Type and default |
|------|-------------|------------------|
| enabled | A boolean that indicates whether the use of cookies by the SDK is enabled by the current instance. If false, the instance of the SDK initialized by this configuration won't store or read any data from cookies. | boolean<br/> true |
| domain | Custom cookie domain, which is helpful if you want to share Application Insights cookies across subdomains. If not provided, uses the value from root `cookieDomain` value. | string<br/>null |
| path | Specifies the path to use for the cookie. If not provided, it will use any value from the root `cookiePath` value. | string <br/> / |
| getCookie | Function to fetch the named cookie value. If not provided, it will use the internal cookie parsing/caching. | `(name: string) => string` <br/> null |
| setCookie | Function to set the named cookie with the specified value. Only called when adding or updating a cookie. | `(name: string, value: string) => void` <br/> null |
| delCookie | Function to delete the named cookie with the specified value, separated from setCookie to avoid the need to parse the value to determine whether the cookie is being added or removed. If not provided, it will use the internal cookie parsing/caching. | `(name: string, value: string) => void` <br/> null |

### Simplified usage of new instance Cookie Manager

- appInsights.[getCookieMgr()](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/ICookieMgr.ts).setEnabled(true/false);
- appInsights.[getCookieMgr()](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/ICookieMgr.ts).set("MyCookie", "the%20encoded%20value");
- appInsights.[getCookieMgr()](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/ICookieMgr.ts).get("MyCookie");
- appInsights.[getCookieMgr()](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/ICookieMgr.ts).del("MyCookie");

## Enable time-on-page tracking

By setting `autoTrackPageVisitTime: true`, the time in milliseconds a user spends on each page is tracked. On each new page view, the duration the user spent on the *previous* page is sent as a [custom metric](../essentials/metrics-custom-overview.md) named `PageVisitTime`. This custom metric is viewable in the [Metrics Explorer](../essentials/metrics-getting-started.md) as a log-based metric.

## Enable distributed tracing

Correlation generates and sends data that enables distributed tracing and powers the [application map](../app/app-map.md), [end-to-end transaction view](../app/app-map.md#go-to-details), and other diagnostic tools.

In JavaScript, correlation is turned off by default to minimize the telemetry we send by default. The following examples show standard configuration options for enabling correlation.

The following sample code shows the configurations required to enable correlation.

# [Snippet](#tab/snippet)

```javascript
// excerpt of the config section of the JavaScript SDK snippet with correlation
// between client-side AJAX and server requests enabled.
cfg: { // Application Insights Configuration
    instrumentationKey: "YOUR_INSTRUMENTATION_KEY_GOES_HERE"
    connectionString: "Copy connection string from Application Insights Resource Overview"
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
    correlationHeaderExcludedDomains: ['*.queue.core.windows.net']
    /* ...Other Configuration Options... */
}});
</script>
``` 

# [npm](#tab/npm)

```javascript
// excerpt of the config section of the JavaScript SDK snippet with correlation
// between client-side AJAX and server requests enabled.
const appInsights = new ApplicationInsights({ config: { // Application Insights Configuration
  instrumentationKey: 'YOUR_INSTRUMENTATION_KEY_GOES_HERE'
  connectionString: "Copy connection string from Application Insights Resource Overview"
  enableCorsCorrelation: true,
  enableRequestHeaderTracking: true,
  enableResponseHeaderTracking: true,
  correlationHeaderExcludedDomains: ['*.queue.core.windows.net']
  /* ...Other Configuration Options... */
} });
``` 

---

> [!NOTE]
> There are two distributed tracing modes/protocols: AI (Classic) and [W3C TraceContext](https://www.w3.org/TR/trace-context/) (New). In version 2.6.0 and later, they are _both_ enabled by default. For older versions, users need to [explicitly opt in to W3C mode](../app/correlation.md#enable-w3c-distributed-tracing-support-for-web-apps).

### Route tracking

By default, this SDK will *not* handle state-based route changing that occurs in single page applications. To enable automatic route change tracking for your single page application, you can add `enableAutoRouteTracking: true` to your setup configuration.

### Single-page applications

For single-page applications, reference plug-in documentation for guidance specific to plug-ins.

| Plug-ins |
|---------------|
| [React](javascript-react-plugin.md#enable-correlation)|
| [React Native](javascript-react-native-plugin.md#enable-correlation)|
| [Angular](javascript-angular-plugin.md#enable-correlation)|
| [Click Analytics Auto-collection](javascript-click-analytics-plugin.md#enable-correlation)|

### Advanced correlation

When a page is first loading and the SDK hasn't fully initialized, we're unable to generate the operation ID for the first request. As a result, distributed tracing is incomplete until the SDK fully initializes.
To remedy this problem, you can include dynamic JavaScript on the returned HTML page. The SDK will use a callback function during initialization to retroactively pull the operation ID from the `serverside` and populate the `clientside` with it.

# [Snippet](#tab/snippet)

Here's a sample of how to create a dynamic JavaScript using Razor.

```C#
<script>
!function(T,l,y){<removed snippet code>,{
    src: "https://js.monitor.azure.com/scripts/b/ai.2.min.js", // The SDK URL Source
    onInit: function(appInsights) {
        var serverId = "@this.Context.GetRequestTelemetry().Context.Operation.Id";
        appInsights.context.telemetryTrace.parentID = serverId;
    },
    cfg: { // Application Insights Configuration
        instrumentationKey: "YOUR_INSTRUMENTATION_KEY_GOES_HERE"
    }});
</script>
```

# [npm](#tab/npm)

```js
import { ApplicationInsights } from '@microsoft/applicationinsights-web'
const appInsights = new ApplicationInsights({ config: {
  instrumentationKey: 'YOUR_INSTRUMENTATION_KEY_GOES_HERE'
  /* ...Other Configuration Options... */
} });
appInsights.context.telemetryContext.parentID = serverId;
appInsights.loadAppInsights();
```

When you use an npm-based configuration, a location must be determined to store the operation ID to enable access for the SDK initialization bundle to `appInsights.context.telemetryContext.parentID` so it can populate it before the first page view event is sent.

--- 

> [!CAUTION]
>The application UX is not yet optimized to show these "first hop" advanced distributed tracing scenarios. The data will be available in the requests table for query and diagnostics.

## Extensions

| Extensions |
|---------------|
| [React](javascript-react-plugin.md)|
| [React Native](javascript-react-native-plugin.md)|
| [Angular](javascript-angular-plugin.md)|
| [Click Analytics Auto-collection](javascript-click-analytics-plugin.md)|

## Explore browser/client-side data

Browser/client-side data can be viewed by going to **Metrics** and adding individual metrics you're interested in.

![Screenshot that shows the Metrics page in Application Insights showing graphic displays of metrics data for a web application.](./media/javascript/page-view-load-time.png)

You can also view your data from the JavaScript SDK via the browser experience in the portal.

Select **Browser**, and then select **Failures** or **Performance**.

![Screenshot that shows the Browser page in Application Insights showing how to add Browser Failures or Browser Performance to the metrics that you can view for your web application.](./media/javascript/browser.png)

### Performance

![Screenshot that shows the Performance page in Application Insights showing graphic displays of Operations metrics for a web application.](./media/javascript/performance-operations.png)

### Dependencies

![Screenshot that shows the Performance page in Application Insights showing graphic displays of Dependency metrics for a web application.](./media/javascript/performance-dependencies.png)

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

### Source map support

The minified callstack of your exception telemetry can be unminified in the Azure portal. All existing integrations on the Exception Details panel will work with the newly unminified callstack.

#### Link to Blob Storage account

You can link your Application Insights resource to your own Azure Blob Storage container to automatically unminify call stacks. To get started, see [Automatic source map support](./source-map-support.md).

### Drag and drop

1. Select an Exception Telemetry item in the Azure portal to view its "end-to-end transaction details."
1. Identify which source maps correspond to this call stack. The source map must match a stack frame's source file but be suffixed with `.map`.
1. Drag the source maps onto the call stack in the Azure portal.

   ![An animated image showing how to drag source map files from a build folder into the Call Stack window in the Azure portal.](https://i.imgur.com/Efue9nU.gif)

### Application Insights web basic

For a lightweight experience, you can instead install the basic version of Application Insights:

```
npm i --save @microsoft/applicationinsights-web-basic
```

This version comes with the bare minimum number of features and functionalities and relies on you to build it up as you see fit. For example, it performs no autocollection like uncaught exceptions and AJAX. The APIs to send certain telemetry types, like `trackTrace` and `trackException`, aren't included in this version. For this reason, you'll need to provide your own wrapper. The only API that's available is `track`. A [sample](https://github.com/Azure-Samples/applicationinsights-web-sample1/blob/master/testlightsku.html) is located here.

## Examples

For runnable examples, see [Application Insights JavaScript SDK samples](https://github.com/Azure-Samples?q=applicationinsights-js-demo).

## Upgrade from the old version of Application Insights

Breaking changes in the SDK V2 version:

- To allow for better API signatures, some of the API calls, such as trackPageView and trackException, have been updated. Running in Internet Explorer 8 and earlier versions of the browser isn't supported.
- The telemetry envelope has field name and structure changes due to data schema updates.
- Moved `context.operation` to `context.telemetryTrace`. Some fields were also changed (`operation.id` --> `telemetryTrace.traceID`).
  
  To manually refresh the current pageview ID, for example, in single-page applications, use `appInsights.properties.context.telemetryTrace.traceID = Microsoft.ApplicationInsights.Telemetry.Util.generateW3CId()`.

  > [!NOTE]
  > To keep the trace ID unique, where you previously used `Util.newId()`, now use `Util.generateW3CId()`. Both ultimately end up being the operation ID.

If you're using the current application insights PRODUCTION SDK (1.0.20) and want to see if the new SDK works in runtime, update the URL depending on your current SDK loading scenario.

- Download via CDN scenario: Update the code snippet that you currently use to point to the following URL:
   ```
   "https://js.monitor.azure.com/scripts/b/ai.2.min.js"
   ```

- npm scenario: Call `downloadAndSetup` to download the full ApplicationInsights script from CDN and initialize it with a connection string:

   ```ts
   appInsights.downloadAndSetup({
     connectionString: "Copy connection string from Application Insights Resource Overview",
     url: "https://js.monitor.azure.com/scripts/b/ai.2.min.jss"
     });
   ```

Test in an internal environment to verify the monitoring telemetry is working as expected. If all works, update your API signatures appropriately to SDK v2 and deploy in your production environments.

## SDK performance/overhead

At just 36 KB gzipped, and taking only ~15 ms to initialize, Application Insights adds a negligible amount of load time to your website. Minimal components of the library are quickly loaded when you use this snippet. In the meantime, the full script is downloaded in the background.

While the script is downloading from the CDN, all tracking of your page is queued. After the downloaded script finishes asynchronously initializing, all events that were queued are tracked. As a result, you won't lose any telemetry during the entire life cycle of your page. This setup process provides your page with a seamless analytics system that's invisible to your users.

> Summary:
> - ![npm version](https://badge.fury.io/js/%40microsoft%2Fapplicationinsights-web.svg)
> - ![gzip compressed size](https://img.badgesize.io/https://js.monitor.azure.com/scripts/b/ai.2.min.js.svg?compression=gzip)
> - **15 ms** overall initialization time
> - **Zero** tracking missed during life cycle of page

## Browser support

![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![IE](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Opera](https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png)
--- | --- | --- | --- | --- |
Chrome Latest ✔ |  Firefox Latest ✔ | IE 9+ & Microsoft Edge ✔<br>IE 8- Compatible | Opera Latest ✔ | Safari Latest ✔ |

## ES3/Internet Explorer 8 compatibility

We need to ensure that this SDK continues to "work" and doesn't break the JavaScript execution when it's loaded by an older browser. It would be ideal to not support older browsers, but numerous large customers can't control which browser their users choose to use.

This statement does *not* mean that we'll only support the lowest common set of features. We need to maintain ES3 code compatibility. New features will need to be added in a manner that wouldn't break ES3 JavaScript parsing and added as an optional feature.

See GitHub for full details on [Internet Explorer 8 support](https://github.com/Microsoft/ApplicationInsights-JS#es3ie8-compatibility).

## Open-source SDK

The Application Insights JavaScript SDK is open source. To view the source code or to contribute to the project, see the [official GitHub repository](https://github.com/Microsoft/ApplicationInsights-JS).

For the latest updates and bug fixes, [consult the release notes](./release-notes.md).

## Troubleshooting

This section helps you troubleshoot common issues.

### I'm getting an error message of Failed to get Request-Context correlation header as it may be not included in the response or not accessible

The `correlationHeaderExcludedDomains` configuration property is an exclude list that disables correlation headers for specific domains. This option is useful when including those headers would cause the request to fail or not be sent because of third-party server configuration. This property supports wildcards.
An example would be `*.queue.core.windows.net`, as seen in the preceding code sample.
Adding the application domain to this property should be avoided because it stops the SDK from including the required distributed tracing `Request-Id`, `Request-Context`, and `traceparent` headers as part of the request.

### I'm not sure how to update my third-party server configuration

The server side needs to be able to accept connections with those headers present. Depending on the `Access-Control-Allow-Headers` configuration on the server side, it's often necessary to extend the server-side list by manually adding `Request-Id`, `Request-Context`, and `traceparent` (W3C distributed header).

Access-Control-Allow-Headers: `Request-Id`, `traceparent`, `Request-Context`, `<your header>`

### I'm receiving duplicate telemetry data from the Application Insights JavaScript SDK

If the SDK reports correlation recursively, enable the configuration setting of `excludeRequestFromAutoTrackingPatterns` to exclude the duplicate data. This scenario can occur when you use connection strings. The syntax for the configuration setting is `excludeRequestFromAutoTrackingPatterns: [<endpointUrl>]`.

[!INCLUDE [azure-monitor-app-insights-test-connectivity](../../../includes/azure-monitor-app-insights-test-connectivity.md)]

## Next steps

* [Source map for JavaScript](source-map-support.md)
* [Track usage](usage-overview.md)
* [Custom events and metrics](api-custom-events-metrics.md)
* [Build-measure-learn](usage-overview.md)
* [Troubleshoot SDK load failure](javascript-sdk-load-failure.md)
