---
title: Azure Application Insights for JavaScript web apps
description: Get page view and session counts, web client data, Single Page Applications (SPA), and track usage patterns. Detect exceptions and performance issues in JavaScript web pages.
ms.topic: conceptual
ms.date: 08/06/2020
ms.custom: devx-track-js
---

# Application Insights for web pages

Find out about the performance and usage of your web page or app. If you add [Application Insights](app-insights-overview.md) to your page script, you get timings of page loads and AJAX calls, counts, and details of browser exceptions and AJAX failures, as well as users and session counts. All these can be segmented by page, client OS and browser version, geo location, and other dimensions. You can set alerts on failure counts or slow page loading. And by inserting trace calls in your JavaScript code, you can track how the different features of your web page application are used.

Application Insights can be used with any web pages - you just add a short piece of JavaScript. If your web service is [Java](java-get-started.md) or [ASP.NET](asp-net.md), you can use the server-side SDKs in conjunction with the client-side JavaScript SDK to get an end-to-end understanding of your app's performance.

## Adding the JavaScript SDK

> [!IMPORTANT]
> New Azure regions **require** the use of connection strings instead of instrumentation keys. [Connection string](./sdk-connection-string.md?tabs=js) identifies the resource that you want to associate your telemetry data with. It also allows you to modify the endpoints your resource will use as a destination for your telemetry. You will need to copy the connection string and add it to your application's code or to an environment variable.

1. First you need an Application Insights resource. If you don't already have a resource and instrumentation key, follow the [create a new resource instructions](create-new-resource.md).
2. Copy the _instrumentation key_ (also known as "iKey") or [connection string](#connection-string-setup) for the resource where you want your JavaScript telemetry to be sent (from step 1.) You will add it to the `instrumentationKey` or `connectionString` setting of the Application Insights JavaScript SDK.
3. Add the Application Insights JavaScript SDK to your web page or app via one of the following two options:
    * [npm Setup](#npm-based-setup)
    * [JavaScript Snippet](#snippet-based-setup)

> [!IMPORTANT]
> Only use one method to add the JavaScript SDK to your application. If you use the NPM Setup, don't use the Snippet and vice versa.

> [!NOTE]
> NPM Setup installs the JavaScript SDK as a dependency to your project, enabling IntelliSense, whereas the Snippet fetches the SDK at runtime. Both support the same features. However, developers who desire more custom events and configuration generally opt for NPM Setup whereas users looking for quick enablement of out-of-the-box web analytics opt for the Snippet.

### npm based setup

Install via NPM.

```sh
npm i --save @microsoft/applicationinsights-web
```

> [!Note]
> **Typings are included with this package**, so you do **not** need to install a separate typings package.
    
```js
import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const appInsights = new ApplicationInsights({ config: {
  instrumentationKey: 'YOUR_INSTRUMENTATION_KEY_GOES_HERE'
  /* ...Other Configuration Options... */
} });
appInsights.loadAppInsights();
appInsights.trackPageView(); // Manually call trackPageView to establish the current user/session/pageview
```

### Snippet based setup

If your app does not use npm, you can directly instrument your webpages with Application Insights by pasting this snippet at the top of each your pages. Preferably, it should be the first script in your `<head>` section so that it can monitor any potential issues with all of your dependencies and optionally any JavaScript errors. If you are using Blazor Server App, add the snippet at the top of the file `_Host.cshtml` in the `<head>` section.

To assist with tracking which version of the snippet your application is using, starting from version 2.5.5 the page view event will include a new tag "ai.internal.snippet" that will contain the identified snippet version.

The current Snippet (listed below) is version "5", the version is encoded in the snippet as sv:"#" and the [current version is also available on GitHub](https://go.microsoft.com/fwlink/?linkid=2156318).

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
    instrumentationKey: "YOUR_INSTRUMENTATION_KEY_GOES_HERE"
    /* ...Other Configuration Options... */
}});
</script>
```

> [!NOTE]
> For readability and to reduce possible JavaScript errors, all of the possible configuration options are listed on a new line in snippet code above, if you don't want to change the value of a commented line it can be removed.


#### Reporting Script load failures

This version of the snippet detects and reports failures when loading the SDK from the CDN as an exception to the Azure Monitor portal (under the failures &gt; exceptions &gt; browser), this exception provides visibility into failures of this type so that you are aware that your application is not reporting telemetry (or other exceptions) as expected. This signal is an important measurement in understanding that you have lost telemetry because the SDK did not load or initialize which can lead to:
- Under-reporting of how users are using (or trying to use) your site;
- Missing telemetry on how your end users are using your site;
- Missing JavaScript errors that could potentially be blocking your end users from successfully using your site.

For details on this exception see the [SDK load failure](javascript-sdk-load-failure.md) troubleshooting page.

Reporting of this failure as an exception to the portal does not use the configuration option ```disableExceptionTracking``` from the application insights configuration and therefore if this failure occurs it will always be reported by the snippet, even when the window.onerror support is disabled.

Reporting of SDK load failures is specifically NOT supported on IE 8 (or less). This assists with reducing the minified size of the snippet by assuming that most environments are not exclusively IE 8 or less. If you have this requirement and you wish to receive these exceptions, you will need to either include a fetch poly fill or create you own snippet version that uses ```XDomainRequest``` instead of ```XMLHttpRequest```, it is recommended that you use the [provided snippet source code](https://github.com/microsoft/ApplicationInsights-JS/blob/master/AISKU/snippet/snippet.js) as a starting point.

> [!NOTE]
> If you are using a previous version of the snippet, it is highly recommended that you update to the latest version so that you will receive these previously unreported issues.

#### Snippet configuration options

All configuration options have now been move towards the end of the script to help avoid accidentally introducing JavaScript errors that would not just cause the SDK to fail to load, but also it would disable the reporting of the failure.

Each configuration option is shown above on a new line, if you don't wish to override the default value of an item listed as [optional] you can  remove that line to minimize the resulting size of your returned page.

The available configuration options are
 
| Name | Type | Description
|------|------|----------------
| src | string **[required]** | The full URL for where to load the SDK from. This value is used for the "src" attribute of a dynamically added &lt;script /&gt; tag. You can use the public CDN location or your own privately hosted one.
| name | string *[optional]* | The global name for the initialized SDK, defaults to `appInsights`. So ```window.appInsights``` will be a reference to the initialized instance. Note: if you provide a name value or a previous instance appears to be assigned (via the global name appInsightsSDK) then this name value will also be defined in the global namespace as ```window.appInsightsSDK=<name value>```, this is required by the SDK initialization code to ensure it's initializing and updating the correct snippet skeleton and proxy methods.
| ld | number in ms *[optional]* | Defines the load delay to wait before attempting to load the SDK. Default value is 0ms and any negative value will immediately add a script tag to the &lt;head&gt; region of the page, which will then block the page load event until to script is loaded (or fails).
| useXhr | boolean *[optional]* | This setting is used only for reporting SDK load failures. Reporting will first attempt to use fetch() if available and then fallback to XHR, setting this value to true just bypasses the fetch check. Use of this value is only be required if your application is being used in an environment where fetch would fail to send the failure events.
| crossOrigin | string *[optional]* | By including this setting, the script tag added to download the SDK will include the crossOrigin attribute with this string value. When not defined (the default) no crossOrigin attribute is added. Recommended values are not defined (the default); ""; or "anonymous" (For all valid values see [HTML attribute: `crossorigin`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) documentation)
| cfg | object **[required]** | The configuration passed to the Application Insights SDK during initialization.

### Connection String Setup

For either the NPM or Snippet setup, you can also configure your instance of Application Insights using a Connection String. Simply replace the `instrumentationKey` field with the `connectionString` field.
```js
import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const appInsights = new ApplicationInsights({ config: {
  connectionString: 'YOUR_CONNECTION_STRING_GOES_HERE'
  /* ...Other Configuration Options... */
} });
appInsights.loadAppInsights();
appInsights.trackPageView();
```

### Sending telemetry to the Azure portal

By default the Application Insights JavaScript SDK autocollects a number of telemetry items that are helpful in determining the health of your application and the underlying user experience. These include:

- **Uncaught exceptions** in your app, including information on
    - Stack trace
    - Exception details and message accompanying the error
    - Line & column number of error
    - URL where error was raised
- **Network Dependency Requests** made by your app **XHR** and **Fetch** (fetch collection is disabled by default) requests, include information on
    - Url of dependency source
    - Command & Method used to request the dependency
    - Duration of the request
    - Result code and success status of the request
    - ID (if any) of user making the request
    - Correlation context (if any) where request is made
- **User information** (for example, Location, network, IP)
- **Device information** (for example, Browser, OS, version, language, model)
- **Session information**

### Telemetry initializers
Telemetry initializers are used to modify the contents of collected telemetry before being sent from the user's browser. They can also be used to prevent certain telemetry from being sent, by returning `false`. Multiple telemetry initializers can be added to your Application Insights instance, and they are executed in order of adding them.

The input argument to `addTelemetryInitializer` is a callback that takes a [`ITelemetryItem`](https://github.com/microsoft/ApplicationInsights-JS/blob/master/API-reference.md#addTelemetryInitializer) as an argument and returns a `boolean` or `void`. If returning `false`, the telemetry item is not sent, else it proceeds to the next telemetry initializer, if any, or is sent to the telemetry collection endpoint.

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
Most configuration fields are named such that they can be defaulted to false. All fields are optional except for `instrumentationKey`.

| Name | Description | Default |
|------|-------------|---------|
| instrumentationKey | **Required**<br>Instrumentation key that you obtained from the Azure portal. | string<br/>null |
| accountId | An optional account ID, if your app groups users into accounts. No spaces, commas, semicolons, equals, or vertical bars | string<br/>null |
| sessionRenewalMs | A session is logged if the user is inactive for this amount of time in milliseconds. | numeric<br/>1800000<br/>(30 mins) |
| sessionExpirationMs | A session is logged if it has continued for this amount of time in milliseconds. | numeric<br/>86400000<br/>(24 hours) |
| maxBatchSizeInBytes | Max size of telemetry batch. If a batch exceeds this limit, it is immediately sent and a new batch is started | numeric<br/>10000 |
| maxBatchInterval | How long to batch telemetry for before sending (milliseconds) | numeric<br/>15000 |
| disable&#8203;ExceptionTracking | If true, exceptions are not autocollected. | boolean<br/> false |
| disableTelemetry | If true, telemetry is not collected or sent. | boolean<br/>false |
| enableDebug | If true, **internal** debugging data is thrown as an exception **instead** of being logged, regardless of SDK logging settings. Default is false. <br>***Note:*** Enabling this setting will result in dropped telemetry whenever an internal error occurs. This can be useful for quickly identifying issues with your configuration or usage of the SDK. If you do not want to lose telemetry while debugging, consider using `consoleLoggingLevel` or `telemetryLoggingLevel` instead of `enableDebug`. | boolean<br/>false |
| loggingLevelConsole | Logs **internal** Application Insights errors to console. <br>0: off, <br>1: Critical errors only, <br>2: Everything (errors & warnings) | numeric<br/> 0 |
| loggingLevelTelemetry | Sends **internal** Application Insights errors as telemetry. <br>0: off, <br>1: Critical errors only, <br>2: Everything (errors & warnings) | numeric<br/> 1 |
| diagnosticLogInterval | (internal) Polling interval (in ms) for internal logging queue | numeric<br/> 10000 |
| samplingPercentage | Percentage of events that will be sent. Default is 100, meaning all events are sent. Set this if you wish to preserve your data cap for large-scale applications. | numeric<br/>100 |
| autoTrackPageVisitTime | If true, on a pageview, the previous instrumented page's view time is tracked and sent as telemetry and a new timer is started for the current pageview. | boolean<br/>false |
| disableAjaxTracking | If true, Ajax calls are not autocollected. | boolean<br/> false |
| disableFetchTracking | If true, Fetch requests are not autocollected.|boolean<br/>true |
| overridePageViewDuration | If true, default behavior of trackPageView is changed to record end of page view duration interval when trackPageView is called. If false and no custom duration is provided to trackPageView, the page view performance is calculated using the navigation timing API. |boolean<br/>
| maxAjaxCallsPerView | Default 500 - controls how many Ajax calls will be monitored per page view. Set to -1 to monitor all (unlimited) Ajax calls on the page. | numeric<br/> 500 |
| disableDataLossAnalysis | If false, internal telemetry sender buffers will be checked at startup for items not yet sent. | boolean<br/> true |
| disable&#8203;CorrelationHeaders | If false, the SDK will add two headers ('Request-Id' and 'Request-Context') to all dependency requests to correlate them with corresponding requests on the server side. | boolean<br/> false |
| correlationHeader&#8203;ExcludedDomains | Disable correlation headers for specific domains | string[]<br/>undefined |
| correlationHeader&#8203;ExcludePatterns | Disable correlation headers using regular expressions | regex[]<br/>undefined |
| correlationHeader&#8203;Domains | Enable correlation headers for specific domains | string[]<br/>undefined |
| disableFlush&#8203;OnBeforeUnload | If true, flush method will not be called when onBeforeUnload event triggers | boolean<br/> false |
| enableSessionStorageBuffer | If true, the buffer with all unsent telemetry is stored in session storage. The buffer is restored on page load | boolean<br />true |
| cookieCfg | Defaults to cookie usage enabled see [ICookieCfgConfig](#icookiemgrconfig) settings for full defaults. | [ICookieCfgConfig](#icookiemgrconfig)<br>(Since 2.6.0)<br/>undefined |
| ~~isCookieUseDisabled~~<br>disableCookiesUsage | If true, the SDK will not store or read any data from cookies. Note that this disables the User and Session cookies and renders the usage blades and experiences useless. isCookieUseDisable is deprecated in favor of disableCookiesUsage, when both are provided disableCookiesUsage takes precedence.<br>(Since v2.6.0) And if `cookieCfg.enabled` is also defined it will take precedence over these values, Cookie usage can be re-enabled after initialization via the core.getCookieMgr().setEnabled(true). | alias for [`cookieCfg.enabled`](#icookiemgrconfig)<br>false |
| cookieDomain | Custom cookie domain. This is helpful if you want to share Application Insights cookies across subdomains.<br>(Since v2.6.0) If `cookieCfg.domain` is defined it will take precedence over this value. | alias for [`cookieCfg.domain`](#icookiemgrconfig)<br>null |
| cookiePath | Custom cookie path. This is helpful if you want to share Application Insights cookies behind an application gateway.<br>If `cookieCfg.path` is defined it will take precedence over this value. | alias for [`cookieCfg.path`](#icookiemgrconfig)<br>(Since 2.6.0)<br/>null |
| isRetryDisabled | If false, retry on 206 (partial success), 408 (timeout), 429 (too many requests), 500 (internal server error), 503 (service unavailable), and 0 (offline, only if detected) | boolean<br/>false |
| isStorageUseDisabled | If true, the SDK will not store or read any data from local and session storage. | boolean<br/> false |
| isBeaconApiDisabled | If false, the SDK will send all telemetry using the [Beacon API](https://www.w3.org/TR/beacon) | boolean<br/>true |
| onunloadDisableBeacon | When tab is closed, the SDK will send all remaining telemetry using the [Beacon API](https://www.w3.org/TR/beacon) | boolean<br/> false |
| sdkExtension | Sets the sdk extension name. Only alphabetic characters are allowed. The extension name is added as a prefix to the 'ai.internal.sdkVersion' tag (for example, 'ext_javascript:2.0.0'). | string<br/> null |
| isBrowserLink&#8203;TrackingEnabled | If true, the SDK will track all [Browser Link](/aspnet/core/client-side/using-browserlink) requests. | boolean<br/>false |
| appId | AppId is used for the correlation between AJAX dependencies happening on the client-side with the server-side requests. When Beacon API is enabled, it cannot be used automatically, but can be set manually in the configuration. |string<br/> null |
| enable&#8203;CorsCorrelation | If true, the SDK will add two headers ('Request-Id' and 'Request-Context') to all CORS requests to correlate outgoing AJAX dependencies with corresponding requests on the server side. | boolean<br/>false |
| namePrefix | An optional value that will be used as name postfix for localStorage and cookie name. | string<br/>undefined |
| enable&#8203;AutoRoute&#8203;Tracking | Automatically track route changes in Single Page Applications (SPA). If true, each route change will send a new Pageview to Application Insights. Hash route changes (`example.com/foo#bar`) are also recorded as new page views.| boolean<br/>false |
| enableRequest&#8203;HeaderTracking | If true, AJAX & Fetch request headers is tracked. | boolean<br/> false |
| enableResponse&#8203;HeaderTracking | If true, AJAX & Fetch request's response headers is tracked. | boolean<br/> false |
| distributedTracingMode | Sets the distributed tracing mode. If AI_AND_W3C mode or W3C mode is set, W3C trace context headers (traceparent/tracestate) will be generated and included in all outgoing requests. AI_AND_W3C is provided for back-compatibility with any legacy Application Insights instrumented services. See example [here](./correlation.md#enable-w3c-distributed-tracing-support-for-web-apps).| `DistributedTracingModes`or<br/>numeric<br/>(Since v2.6.0) `DistributedTracingModes.AI_AND_W3C`<br />(v2.5.11 or earlier) `DistributedTracingModes.AI` |
| enable&#8203;AjaxErrorStatusText | If true, include response error data text in dependency event on failed AJAX requests. | boolean<br/> false |
| enable&#8203;AjaxPerfTracking |Flag to enable looking up and including additional browser window.performance timings in the reported `ajax` (XHR and fetch) reported metrics. | boolean<br/> false |
| maxAjaxPerf&#8203;LookupAttempts | The maximum number of times to look for the window.performance timings (if available), this is required as not all browsers populate the window.performance before reporting the end of the XHR request and for fetch requests this is added after its complete.| numeric<br/> 3 |
| ajaxPerfLookupDelay | The amount of time to wait before re-attempting to find the windows.performance timings for an `ajax` request, time is in milliseconds and is passed directly to setTimeout(). | numeric<br/> 25 ms |
| enableUnhandled&#8203;PromiseRejection&#8203;Tracking | If true, unhandled promise rejections will be autocollected and reported as a JavaScript error. When disableExceptionTracking is true (don't track exceptions), the config value will be ignored and unhandled promise rejections will not be reported. | boolean<br/> false |
| disable&#8203;InstrumentationKey&#8203;Validation | If true, instrumentation key validation check is bypassed. | boolean<br/>false |
| enablePerfMgr | When enabled (true) this will create local perfEvents for code that has been instrumented to emit perfEvents (via the doPerf() helper). This can be used to identify performance issues within the SDK based on your usage or optionally within your own instrumented code. [More details are available by the basic documentation](https://github.com/microsoft/ApplicationInsights-JS/blob/master/docs/PerformanceMonitoring.md). Since v2.5.7 | boolean<br/>false |
| perfEvtsSendAll | When _enablePerfMgr_ is enabled and the [IPerfManager](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/IPerfManager.ts) fires a [INotificationManager](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/INotificationManager.ts).perfEvent() this flag determines whether an event is fired (and sent to all listeners) for all events (true) or only for 'parent' events (false &lt;default&gt;).<br />A parent [IPerfEvent](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/IPerfEvent.ts) is an event where no other IPerfEvent is still running at the point of this event being created and it's _parent_ property is not null or undefined. Since v2.5.7 |  boolean<br />false |
| idLength | Identifies the default length used to generate new random session and user id values. Defaults to 22, previous default value was 5 (v2.5.8 or less), if you need to keep the previous maximum length you should set this value to 5. |  numeric<br />22 |

## Cookie Handling

From version 2.6.0, cookie management is now available directly from the instance and can be disabled and re-enabled after initialization.

If disabled during initialization via the `disableCookiesUsage` or `cookieCfg.enabled` configurations, you can now re-enable via the [ICookieMgr](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/ICookieMgr.ts) `setEnabled` function.

The instance based cookie management also replaces the previous CoreUtils global functions of `disableCookies()`, `setCookie(...)`, `getCookie(...)` and `deleteCookie(...)`. And to benefit from the tree-shaking enhancements also introduced as part of version 2.6.0 you should no longer uses the global functions.

### ICookieMgrConfig

Cookie Configuration for instance based cookie management added in version 2.6.0.

| Name | Description | Type and Default |
|------|-------------|------------------|
| enabled | A boolean that indicates whether the use of cookies by  the SDK is enabled by the current instance. If false, the instance of the SDK initialized by this configuration will not store or read any data from cookies | boolean<br/> true |
| domain | Custom cookie domain. This is helpful if you want to share Application Insights cookies across subdomains. If not provided uses the value from root `cookieDomain` value. | string<br/>null |
| path | Specifies the path to use for the cookie, if not provided it will use any value from the root `cookiePath` value. | string <br/> / |
| getCookie | Function to fetch the named cookie value, if not provided it will use the internal cookie parsing / caching. | `(name: string) => string` <br/> null |
| setCookie | Function to set the named cookie with the specified value, only called when adding or updating a cookie. | `(name: string, value: string) => void` <br/> null |
| delCookie | Function to delete the named cookie with the specified value, separated from setCookie to avoid the need to parse the value to determine whether the cookie is being added or removed. If not provided it will use the internal cookie parsing / caching. | `(name: string, value: string) => void` <br/> null |

### Simplified Usage of new instance Cookie Manager

- appInsights.[getCookieMgr()](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/ICookieMgr.ts).setEnabled(true/false);
- appInsights.[getCookieMgr()](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/ICookieMgr.ts).set("MyCookie", "the%20encoded%20value");
- appInsights.[getCookieMgr()](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/ICookieMgr.ts).get("MyCookie");
- appInsights.[getCookieMgr()](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/ICookieMgr.ts).del("MyCookie");

## Enable time-on-page tracking

By setting `autoTrackPageVisitTime: true`, the time a user spends on each page is tracked. On each new PageView, the duration the user spent on the *previous* page is sent as a [custom metric](../essentials/metrics-custom-overview.md) named `PageVisitTime`. This custom metric is viewable in the [Metrics Explorer](../essentials/metrics-getting-started.md) as a "log-based metric".

## Enable Correlation

Correlation generates and sends data that enables distributed tracing and powers the [application map](../app/app-map.md), [end-to-end transaction view](../app/app-map.md#go-to-details), and other diagnostic tools.

The following example shows all possible configurations required to enable correlation, with scenario-specific notes below:

```javascript
// excerpt of the config section of the JavaScript SDK snippet with correlation
// between client-side AJAX and server requests enabled.
cfg: { // Application Insights Configuration
    instrumentationKey: "YOUR_INSTRUMENTATION_KEY_GOES_HERE"
    disableFetchTracking: false,
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
    correlationHeaderExcludedDomains: ['myapp.azurewebsites.net', '*.queue.core.windows.net']
    /* ...Other Configuration Options... */
}});
</script>

``` 

If any of your third-party servers that the client communicates with cannot accept the `Request-Id` and `Request-Context` headers, and you cannot update their configuration, then you'll need to put them into an exclude list via the `correlationHeaderExcludeDomains` configuration property. This property supports wildcards.

The server-side needs to be able to accept connections with those headers present. Depending on the `Access-Control-Allow-Headers` configuration on the server-side it is often necessary to extend the server-side list by manually adding `Request-Id` and `Request-Context`.

Access-Control-Allow-Headers: `Request-Id`, `Request-Context`, `<your header>`

> [!NOTE]
> If you are using OpenTelemtry or Application Insights SDKs released in 2020 or later, we recommend using [WC3 TraceContext](https://www.w3.org/TR/trace-context/). See configuration guidance [here](../app/correlation.md#enable-w3c-distributed-tracing-support-for-web-apps).

## Single Page Applications

By default, this SDK will **not** handle state-based route changing that occurs in single page applications. To enable automatic route change tracking for your single page application, you can add `enableAutoRouteTracking: true` to your setup configuration.

Currently, we offer a separate [React plugin](javascript-react-plugin.md), which you can initialize with this SDK. It will also accomplish route change tracking for you, as well as collect other React specific telemetry.
> [!NOTE]
> Use `enableAutoRouteTracking: true` only if you are **not** using the React plugin. Both are capable of sending new PageViews when the route changes. If both are enabled, duplicate PageViews may be sent.

## Extensions

| Extensions |
|---------------|
| [React](javascript-react-plugin.md)|
| [React Native](javascript-react-native-plugin.md)|
| [Angular](javascript-angular-plugin.md)|
| [Click Analytics Auto-collection](javascript-click-analytics-plugin.md)|

## Explore browser/client-side data

Browser/client-side data can be viewed by going to **Metrics** and adding individual metrics you are interested in:

![Screenshot of the Metrics page in Application Insights showing graphic displays of metrics data for a web application.](./media/javascript/page-view-load-time.png)

You can also view your data from the JavaScript SDK via the Browser experience in the portal.

Select **Browser** and then choose **Failures** or **Performance**.

![Screenshot of the Browser page in Application Insights showing how to add Browser Failures or Browser Performance to the metrics that you can view for your web application.](./media/javascript/browser.png)

### Performance

![Screenshot of the Performance page in Application Insights showing graphic displays of Operations metrics for a web application.](./media/javascript/performance-operations.png)

### Dependencies

![Screenshot of the Performance page in Application Insights showing graphic displays of Dependency metrics for a web application.](./media/javascript/performance-dependencies.png)

### Analytics

To query your telemetry collected by the JavaScript SDK, select the **View in Logs (Analytics)** button. By adding a `where` statement of `client_Type == "Browser"`, you will only see data from the JavaScript SDK and any server-side telemetry collected by other SDKs will be excluded.
 
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

### Source Map Support

The minified callstack of your exception telemetry can be unminified in the Azure portal. All existing integrations on the Exception Details panel will work with the newly unminified callstack.

#### Link to Blob storage account

You can link your Application Insights resource to your own Azure Blob Storage container to automatically unminify call stacks. To get started, see [automatic source map support](./source-map-support.md).

### Drag and drop

1. Select an Exception Telemetry item in the Azure portal to view its "End-to-end transaction details"
2. Identify which source maps correspond to this call stack. The source map must match a stack frame's source file, but suffixed with `.map`
3. Drag and drop the source maps onto the call stack in the Azure portal
![An animated image showing how to drag and drop source map files from a build folder into the Call Stack window in the Azure portal.](https://i.imgur.com/Efue9nU.gif)

### Application Insights Web Basic

For a lightweight experience, you can instead install the basic version of Application Insights
```
npm i --save @microsoft/applicationinsights-web-basic
```
This version comes with the bare minimum number of features and functionalities and relies on you to build it up as you see fit. For example, it performs no autocollection (uncaught exceptions, AJAX, etc.). The APIs to send certain telemetry types, like `trackTrace`, `trackException`, etc., are not included in this version, so you will need to provide your own wrapper. The only API that is available is `track`. A [sample](https://github.com/Azure-Samples/applicationinsights-web-sample1/blob/master/testlightsku.html) is located here.

## Examples

For runnable examples, see [Application Insights JavaScript SDK Samples](https://github.com/Azure-Samples?q=applicationinsights-js-demo).

## Upgrading from the old version of Application Insights

Breaking changes in the SDK V2 version:
- To allow for better API signatures, some of the API calls, such as trackPageView and trackException, have been updated. Running in Internet Explorer 8 and earlier versions of the browser is not supported.
- The telemetry envelope has field name and structure changes due to data schema updates.
- Moved `context.operation` to `context.telemetryTrace`. Some fields were also changed (`operation.id` --> `telemetryTrace.traceID`).
  - To manually refresh the current pageview ID (for example, in SPA apps), use `appInsights.properties.context.telemetryTrace.traceID = Microsoft.ApplicationInsights.Telemetry.Util.generateW3CId()`.
    > [!NOTE]
    > To keep the trace ID unique, where you previously used `Util.newId()`, now use `Util.generateW3CId()`. Both ultimately end up being the operation ID.

If you're using the current application insights PRODUCTION SDK (1.0.20) and want to see if the new SDK works in runtime, update the URL depending on your current SDK loading scenario.

- Download via CDN scenario: Update the code snippet that you currently use to point to the following URL:
   ```
   "https://js.monitor.azure.com/scripts/b/ai.2.min.js"
   ```

- npm scenario: Call `downloadAndSetup` to download the full ApplicationInsights script from CDN and initialize it with instrumentation key:

   ```ts
   appInsights.downloadAndSetup({
     instrumentationKey: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx",
     url: "https://js.monitor.azure.com/scripts/b/ai.2.min.jss"
     });
   ```

Test in internal environment to verify monitoring telemetry is working as expected. If all works, update your API signatures appropriately to SDK V2 version and deploy in your production environments.

## SDK performance/overhead

At just 36 KB gzipped, and taking only ~15 ms to initialize, Application Insights adds a negligible amount of loadtime to your website. By using the snippet, minimal components of the library are quickly loaded. In the meantime, the full script is downloaded in the background.

While the script is downloading from the CDN, all tracking of your page is queued. Once the downloaded script finishes asynchronously initializing, all events that were queued are tracked. As a result, you will not lose any telemetry during the entire life cycle of your page. This setup process provides your page with a seamless analytics system, invisible to your users.

> Summary:
> - ![npm version](https://badge.fury.io/js/%40microsoft%2Fapplicationinsights-web.svg)
> - ![gzip compressed size](https://img.badgesize.io/https://js.monitor.azure.com/scripts/b/ai.2.min.js.svg?compression=gzip)
> - **15 ms** overall initialization time
> - **Zero** tracking missed during life cycle of page

## Browser support

![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![IE](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Opera](https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png)
--- | --- | --- | --- | --- |
Chrome Latest ✔ |  Firefox Latest ✔ | IE 9+ & Edge ✔<br>IE 8- Compatible | Opera Latest ✔ | Safari Latest ✔ |

## ES3/IE8 Compatibility

As an SDK there are numerous users that cannot control the browsers that their customers use. As such we need to ensure that this SDK continues to "work" and does not break the JS execution when loaded by an older browser. While it would be ideal to not support IE8 and older generation (ES3) browsers, there are numerous large customers/users that continue to require pages to "work" and as noted they may or cannot control which browser that their end users choose to use.

This does NOT mean that we will only support the lowest common set of features, just that we need to maintain ES3 code compatibility and when adding new features they will need to be added in a manner that would not break ES3 JavaScript parsing and added as an optional feature.

[See GitHub for full details on IE8 support](https://github.com/Microsoft/ApplicationInsights-JS#es3ie8-compatibility)

## Open-source SDK

The Application Insights JavaScript SDK is open-source to view the source code or to contribute to the project visit the [official GitHub repository](https://github.com/Microsoft/ApplicationInsights-JS). 

For the latest updates and bug fixes [consult the release notes](./release-notes.md).

## <a name="next"></a> Next steps
* [Track usage](usage-overview.md)
* [Custom events and metrics](api-custom-events-metrics.md)
* [Build-measure-learn](usage-overview.md)
* [Troubleshoot SDK load failure](javascript-sdk-load-failure.md)
