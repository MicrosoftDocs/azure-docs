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
## What is collected automatically?

When you enable the App Insights JavaScript SDK, the following data classes are collected automatically:

- Uncaught exceptions in your app, including information on
    - Stack trace
    - Exception details and message accompanying the error
    - Line & column number of error
    - URL where error was raised
- Network Dependency Requests made by your app XHR and Fetch (fetch collection is disabled by default) requests, include information on
    - Url of dependency source
    - Command & Method used to request the dependency
    - Duration of the request
    - Result code and success status of the request
    - ID (if any) of user making the request
    - Correlation context (if any) where request is made
- User information (e.g. Location, network, IP)
- Device information (e.g. Browser, OS, version, language, model)
- Session information

For more information, refer to the following link: https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/azure-monitor/app/data-retention-privacy.md

## [Snippet setup](#tab/snippet)

## Get started

The Application Insights JavaScript SDK is implemented with a runtime snippet for out-of-the-box web analytics.

### Enable Application Insights SDK for JavaScript

Only two steps are required to enable the Application Insights SDK for JavaScript.

#### Add the code snippet

Add the following code snippet to beginning of every <head> tag for each HTML page you want to monitor.

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

### Example using the snippet onInit callback

```html
<script type="text/javascript">
!function(T,l,y){<!-- Removed the Snippet code for brevity -->}(window,document,{
src: "https://js.monitor.azure.com/scripts/b/ai.2.min.js",
crossOrigin: "anonymous",
onInit: function (sdk) {
  sdk.addTelemetryInitializer(function (envelope) {
    envelope.data.someField = 'This item passed through my telemetry initializer';
  });
}, // Once the application insights instance has loaded and initialized this method will be called
cfg: { // Application Insights Configuration
    connectionString: "YOUR_CONNECTION_STRING"
}});
</script>
```

## [npm setup](#tab/npm)

## Get started

The npm setup installs the JavaScript SDK as a dependency to your project and enables IntelliSense.

This option is only needed for developers who require more custom events and configuration.

### Enable Application Insights SDK for JavaScript

Install via npm.

```sh
npm i --save @microsoft/applicationinsights-web
```

> [!Note]
> *Typings are included with this package*, so you do *not* need to install a separate typings package.
    
```js
import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const appInsights = new ApplicationInsights({ config: {
  instrumentationKey: 'YOUR_INSTRUMENTATION_KEY_GOES_HERE'
  /* ...Other Configuration Options... */
} });
appInsights.loadAppInsights();
appInsights.trackPageView(); // Manually call trackPageView to establish the current user/session/pageview
```

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

## [More information](#tab/npm)

This section covers advanced configuration information, cookie handling, source map support and tree shaking.

## Configuration

Most configuration fields are named such that they can be defaulted to falsey. All fields are optional except for `instrumentationKey` or a `connectionString` containing the instrumentation key.

| Name | Type | Default | Description |
|------|------|---------|-------------|
| instrumentationKey | string<br>[**Required if `connectionString` not supplied**]| null | Instrumentation key that you obtained from the Azure Portal. |
| connectionString | string<br>[**Require if `instrumentationKey` not supplied**] | null | The Connection string that you obtained from the Azure portal |
| accountId | string | null | An optional account id, if your app groups users into accounts. No spaces, commas, semicolons, equals, or vertical bars |
| sessionRenewalMs | numeric | 1800000 | A session is logged if the user is inactive for this amount of time in milliseconds. Default is 30 minutes |
| sessionExpirationMs | numeric | 86400000 | A session is logged if it has continued for this amount of time in milliseconds. Default is 24 hours |
| maxBatchSizeInBytes | numberic | 10000 | Max size of telemetry batch. If a batch exceeds this limit, it is immediately sent and a new batch is started |
| maxBatchInterval | numeric | 15000 | How long to batch telemetry for before sending (milliseconds) |
| disableExceptionTracking | boolean || false | If true, exceptions are not autocollected. Default is false. |
| disableTelemetry | boolean | false | If true, telemetry is not collected or sent. Default is false. |
| enableDebug | boolean | false | If true, **internal** debugging data is thrown as an exception **instead** of being logged, regardless of SDK logging settings. Default is false. <br>***Note:*** Enabling this setting will result in dropped telemetry whenever an internal error occurs. This can be useful for quickly identifying issues with your configuration or usage of the SDK. If you do not want to lose telemetry while debugging, consider using `loggingLevelConsole` or `loggingLevelTelemetry` instead of `enableDebug`. |
| loggingLevelConsole | numeric | 0 | Logs **internal** Application Insights errors to console. <br>0: off, <br>1: Critical errors only, <br>2: Everything (errors & warnings) |
| loggingLevelTelemetry | numeric | 1 | Sends **internal** Application Insights errors as telemetry. <br>0: off, <br>1: Critical errors only, <br>2: Everything (errors & warnings) |
| diagnosticLogInterval | numeric | 10000 | (internal) Polling interval (in ms) for internal logging queue |
| samplingPercentage | numeric | 100 | Percentage of events that will be sent. Default is 100, meaning all events are sent. Set this if you wish to preserve your datacap for large-scale applications. |
| autoTrackPageVisitTime | boolean | false | If true, on a pageview, the _previous_ instrumented page's view time is tracked and sent as telemetry and a new timer is started for the current pageview. It is sent as a custom metric named `PageVisitTime` in `milliseconds` and is calculated via the Date [now()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now) function (if available) and falls back to (new Date()).[getTime()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime) if now() is unavailable (IE8 or less). Default is false. |
| disableAjaxTracking | boolean | false | If true, Ajax calls are not autocollected. Default is false. |
| disableFetchTracking | boolean | false | If true, Fetch requests are not autocollected. Default is false (Since v2.8.0, previously true) |
| excludeRequestFromAutoTrackingPatterns | string[] \| RegExp[] | undefined | Provide a way to exclude specific route from automatic tracking for XMLHttpRequest or Fetch request. If defined, for an ajax / fetch request that the request url matches with the regex patterns, auto tracking is turned off. Default is undefined. |
| addRequestContext | (requestContext: IRequestionContext) => {[key: string]: any} | undefined | Provide a way to enrich dependencies logs with context at the beginning of api call. Default is undefined. You will need to check if `xhr` exists if you configure `xhr` related conetext. You will need to check if `fetch request` and `fetch response` exist if you configure `fetch` related context. Otherwise you may not get the data you need. |
| overridePageViewDuration | boolean | false | If true, default behavior of trackPageView is changed to record end of page view duration interval when trackPageView is called. If false and no custom duration is provided to trackPageView, the page view performance is calculated using the navigation timing API. Default is false. |
| maxAjaxCallsPerView | numeric | 500 | Default 500 - controls how many ajax calls will be monitored per page view. Set to -1 to monitor all (unlimited) ajax calls on the page. |
| disableDataLossAnalysis | boolean | true | If false, internal telemetry sender buffers will be checked at startup for items not yet sent. |
| disableCorrelationHeaders | boolean | false | If false, the SDK will add two headers ('Request-Id' and 'Request-Context') to all dependency requests to correlate them with corresponding requests on the server side. Default is false. |
| correlationHeaderExcludedDomains | string[] | undefined | Disable correlation headers for specific domains |
| correlationHeaderExcludePatterns | regex[] | undefined | Disable correlation headers using regular expressions |
| correlationHeaderDomains | string[] | undefined | Enable correlation headers for specific domains |
| disableFlushOnBeforeUnload | boolean | false | Default false. If true, flush method will not be called when onBeforeUnload event triggers |
| enableSessionStorageBuffer | boolean | true | Default true. If true, the buffer with all unsent telemetry is stored in session storage. The buffer is restored on page load |
| cookieCfg | [ICookieCfgConfig](#ICookieMgrConfig)<br>[Optional]<br>(Since 2.6.0) | undefined | Defaults to cookie usage enabled see [ICookieCfgConfig](#ICookieMgrConfig) settings for full defaults. |
| ~~isCookieUseDisabled~~<br>disableCookiesUsage | alias for [`cookieCfg.enabled`](#ICookieMgrConfig)<br>[Optional] | false | Default false. A boolean that indicates whether to disable the use of cookies by the SDK. If true, the SDK will not store or read any data from cookies. isCookieUseDisable is deprecated in favor of disableCookiesUsage, when both are provided disableCookiesUsage take precedence.<br>(Since v2.6.0) If `cookieCfg.enabled` is defined it will take precedence over these values, Cookie usage can be re-enabled after initialization via the core.getCookieMgr().setEnabled(true). |
| cookieDomain | alias for [`cookieCfg.domain`](#ICookieMgrConfig)<br>[Optional] | null | Custom cookie domain. This is helpful if you want to share Application Insights cookies across subdomains.<br>(Since v2.6.0) If `cookieCfg.domain` is defined it will take precedence over this value. |
| cookiePath | alias for [`cookieCfg.path`](#ICookieMgrConfig)<br>[Optional]<br>(Since 2.6.0) | null | Custom cookie path. This is helpful if you want to share Application Insights cookies behind an application gateway.<br>If `cookieCfg.path` is defined it will take precedence over this value.  |
| isRetryDisabled | boolean | false | Default false. If false, retry on 206 (partial success), 408 (timeout), 429 (too many requests), 500 (internal server error), 503 (service unavailable), and 0 (offline, only if detected) |
| isStorageUseDisabled | boolean | false | If true, the SDK will not store or read any data from local and session storage. Default is false. |
| isBeaconApiDisabled | boolean | true | If false, the SDK will send all telemetry using the [Beacon API](https://www.w3.org/TR/beacon) |
| disableXhr | boolean | false | Don't use XMLHttpRequest or XDomainRequest (for IE < 9) by default instead attempt to use fetch() or sendBeacon. If no other transport is available it will still use XMLHttpRequest |
| onunloadDisableBeacon | boolean | false | Default false. when tab is closed, the SDK will send all remaining telemetry using the [Beacon API](https://www.w3.org/TR/beacon) |
| onunloadDisableFetch | boolean | false | If fetch keepalive is supported do not use it for sending events during unload, it may still fallback to fetch() without keepalive |
| sdkExtension | string | null | Sets the sdk extension name. Only alphabetic characters are allowed. The extension name is added as a prefix to the 'ai.internal.sdkVersion' tag (e.g. 'ext_javascript:2.0.0'). Default is null. |
| isBrowserLinkTrackingEnabled | boolean | false | Default is false. If true, the SDK will track all [Browser Link](https://docs.microsoft.com/en-us/aspnet/core/client-side/using-browserlink) requests. |
| appId | string | null | AppId is used for the correlation between AJAX dependencies happening on the client-side with the server-side requests. When Beacon API is enabled, it cannot be used automatically, but can be set manually in the configuration. Default is null |
| enableCorsCorrelation | boolean | false | If true, the SDK will add two headers ('Request-Id' and 'Request-Context') to all CORS requests to correlate outgoing AJAX dependencies with corresponding requests on the server side. Default is false |
| namePrefix | string | undefined | An optional value that will be used as name postfix for localStorage and session cookie name.
| sessionCookiePostfix | string | undefined | An optional value that will be used as name postfix for session cookie name. If undefined, namePrefix is used as name postfix for session cookie name.
| userCookiePostfix | string | undefined | An optional value that will be used as name postfix for user cookie name. If undefined, no postfix is added on user cookie name.
| enableAutoRouteTracking | boolean | false | Automatically track route changes in Single Page Applications (SPA). If true, each route change will send a new Pageview to Application Insights. Hash route changes changes (`example.com/foo#bar`) are also recorded as new page views.
| enableRequestHeaderTracking | boolean | false | If true, AJAX & Fetch request headers is tracked, default is false. If ignoreHeaders is not configured, Authorization and X-API-Key headers are not logged.
| enableResponseHeaderTracking | boolean | false | If true, AJAX & Fetch request's response headers is tracked, default is false. If ignoreHeaders is not configured, WWW-Authenticate header is not logged.
| ignoreHeaders | string[] | ["Authorization", "X-API-Key", "WWW-Authenticate"] | AJAX & Fetch request and response headers to be ignored in log data. To override or discard the default, add an array with all headers to be excluded or an empty array to the configuration.
| enableAjaxErrorStatusText | boolean | false | Default false. If true, include response error data text | boolean in dependency event on failed AJAX requests.
| enableAjaxPerfTracking | boolean | false | Default false. Flag to enable looking up and including additional browser window.performance timings in the reported ajax (XHR and fetch) reported metrics.
| maxAjaxPerfLookupAttempts | numeric | 3 | Defaults to 3. The maximum number of times to look for the window.performance timings (if available), this is required as not all browsers populate the window.performance before reporting the end of the XHR request and for fetch requests this is added after its complete.
| ajaxPerfLookupDelay | numeric | 25 | Defaults to 25ms. The amount of time to wait before re-attempting to find the windows.performance timings for an ajax request, time is in milliseconds and is passed directly to setTimeout().
| distributedTracingMode | numeric or `DistributedTracingModes` | `DistributedTracingModes.AI_AND_W3C` | Sets the distributed tracing mode. If AI_AND_W3C mode or W3C mode is set, W3C trace context headers (traceparent/tracestate) will be generated and included in all outgoing requests. AI_AND_W3C is provided for back-compatibility with any legacy Application Insights instrumented services.
| enableUnhandledPromiseRejectionTracking | boolean | false | If true, unhandled promise rejections will be autocollected and reported as a javascript error. When disableExceptionTracking is true (dont track exceptions) the config value will be ignored and unhandled promise rejections will not be reported.
| disableInstrumentationKeyValidation | boolean | false | If true, instrumentation key validation check is bypassed. Default value is false.
| enablePerfMgr | boolean | false | [Optional] When enabled (true) this will create local perfEvents for code that has been instrumented to emit perfEvents (via the doPerf() helper). This can be used to identify performance issues within the SDK based on your usage or optionally within your own instrumented code. [More details are available by the basic documentation](./docs/PerformanceMonitoring.md). Since v2.5.7
| perfEvtsSendAll | boolean | false | [Optional] When _enablePerfMgr_ is enabled and the [IPerfManager](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/IPerfManager.ts) fires a [INotificationManager](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/INotificationManager.ts).perfEvent() this flag determines whether an event is fired (and sent to all listeners) for all events (true) or only for 'parent' events (false &lt;default&gt;).<br />A parent [IPerfEvent](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/IPerfEvent.ts) is an event where no other IPerfEvent is still running at the point of this event being created and it's _parent_ property is not null or undefined. Since v2.5.7
| createPerfMgr | (core: IAppInsightsCore, notificationManager: INotificationManager) => IPerfManager | undefined | Callback function that will be called to create a the IPerfManager instance when required and ```enablePerfMgr``` is enabled, this enables you to override the default creation of a PerfManager() without needing to ```setPerfMgr()``` after initialization.
| idLength | numeric | 22 | [Optional] Identifies the default length used to generate new random session and user id's. Defaults to 22, previous default value was 5 (v2.5.8 or less), if you need to keep the previous maximum length you should set this value to 5.
| customHeaders | `[{header: string, value: string}]` | undefined | [Optional] The ability for the user to provide extra headers when using a custom endpoint. customHeaders will not be added on browser shutdown moment when beacon sender is used. And adding custom headers is not supported on IE9 or earlier.
| convertUndefined | `any` | undefined | [Optional] Provide user an option to convert undefined field to user defined value.
| eventsLimitInMem | number | 10000 | [Optional] The number of events that can be kept in memory before the SDK starts to drop events when not using Session Storage (the default).
| disableIkeyDeprecationMessage | boolean | true | [Optional]  Disable instrumentation Key deprecation error message. If true, error message will NOT be sent. **Note: instrumentation key support will end soon**, see aka.ms/IkeyMigrate for more details.

### ICookieMgrConfig

Cookie Configuration for instance based cookie management added in version 2.6.0.

| Name | Type | Default | Description |
|------|------|---------|-------------|
| enabled | boolean | true | A boolean that indicates whether the use of cookies by  the SDK is enabled by the current instance. If false, the instance of the SDK initialized by this configuration will not store or read any data from cookies |
| domain | string | null | Custom cookie domain. This is helpful if you want to share Application Insights cookies across subdomains. If not provided uses the value from root `cookieDomain` value. |
| path | string | / | Specifies the path to use for the cookie, if not provided it will use any value from the root `cookiePath` value. |
| ignoreCookies | string[] | undefined | Specify the cookie name(s) to be ignored, this will cause any matching cookie name to never be read or written. They may still be explicitly purged or deleted. You do not need to repeat the name in the `blockedCookies` configuration.(Since v2.8.8)
| blockedCookies | string[] | undefined | Specify the cookie name(s) to never be written, this will cause any cookie name to never be created or updated, they will still be read unless also included in the ignoreCookies and may still be explicitly purged or deleted. If not provided defaults to the same list provided in ignoreCookies. (Since v2.8.8)
| getCookie | `(name: string) => string` | null | Function to fetch the named cookie value, if not provided it will use the internal cookie parsing / caching. |
| setCookie | `(name: string, value: string) => void` | null | Function to set the named cookie with the specified value, only called when adding or updating a cookie. |
| delCookie | `(name: string, value: string) => void` | null | Function to delete the named cookie with the specified value, separated from setCookie to avoid the need to parse the value to determine whether the cookie is being added or removed.if not provided it will use the internal cookie parsing / caching. |

## Cookie Handling

From version 2.6.0, cookie management is now available directly from the instance and can be disabled and re-enabled after initialization.

If disabled during initialization via the `disableCookiesUsage` or `cookieCfg.enabled` configurations, you can now re-enable via the [ICookieMgr](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/ICookieMgr.ts) `setEnabled` function.

The instance based cookie management also replaces the previous CoreUtils global functions of `disableCookies()`, `setCookie(...)`, `getCookie(...)` and `deleteCookie(...)`. And to benefit from the tree-shaking enhancements also introduced as part of version 2.6.0 you should no longer uses the global functions.

### Simplified Usage of new instance Cookie Manager

**General Guidance**

When calling `getCookieMgr()` before the SDK has successfully initialized will return a temporary `ICookieMgr` instance that will have cookie support fully enabled, thus allowing the getting, setting and deleting of cookies. So unless you know that your configuration WILL ALLOW cookie usage you should delay accessing or using the cookie manager until after initialization.

- appInsights.[getCookieMgr()](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/ICookieMgr.ts).setEnabled(true/false)
- appInsights.[getCookieMgr()](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/ICookieMgr.ts).set("MyCookie", "thevalue");
- appInsights.[getCookieMgr()](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/ICookieMgr.ts).get("MyCookie");
- appInsights.[getCookieMgr()](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/ICookieMgr.ts).del("MyCookie");

> In v2.6.0 the `getCookieMgr()` is not directly available on the main entry points documented above for the snippet, NPM (`ApplicationInsights`) or React Plugin usages. As a workaround for this version you will need to access it via the `core` or `appInsights` properties as below (the `getCookieMgr()` will be available in later versions)
>
>- appInsights.**core.**[getCookieMgr()](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/ICookieMgr.ts).xxxxx
>- appInsights.**appInsights.**[getCookieMgr()](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/ICookieMgr.ts).xxxxx

**Snippet usage notes**

The `getCookieMgr()` method, `core` and `appInsights` properties are only available AFTER the SDK has been successfully loaded and initialized.

So you will need to only call or access the manager from within the onInit() callback function (available in snippet (v5) or above) or after you know that the SDK has been loaded and initialized, otherwise you will cause an exception, unless you also perform an existence check of the property or function.

>**Additional Legacy snippet users for v2.6.0**
>
>If you are using a legacy snippet for your application (it is suggested that you upgrade), you will need to use the following options
>
>- appInsights.**core.**[getCookieMgr()](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/ICookieMgr.ts).xxxxx
>- appInsights.**appInsights.core.**[getCookieMgr()](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/ICookieMgr.ts).xxxxx
>- appInsights.**appInsightsNew.**[getCookieMgr()](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/ICookieMgr.ts).xxxxx

## Tree-Shaking Support and enhancements

As part of changes being introduced in version 2.6.0 we are deprecating and removing the *internal* usages of the static helper classes `CoreUtils`, `EventHelper`, `Util`, `UrlHelper`, `DateTimeUtils` and `ConnectionStringParser` to provide better support for tree-shaking algorithms so that unused code can be safely dropped when using NPM packages.

[See Tree-Shaking Recommendations](TreeShakingRecommendations.md)

## Single Page Applications

By default, this SDK will **not** handle state based route changing that occurs in single page applications. To enable automatic route change tracking for your single page application, you can add `enableAutoRouteTracking: true` to your setup configuration.

Currently, we support a separate [React plugin](#available-extensions-for-the-sdk) which you can initialize with this SDK. It will also accomplish route change tracking for you, as well as collect [other React specific telemetry](https://github.com/microsoft/applicationinsights-react-js).

## Source Map Support

The minified callstack of your exception telemetry can be unminified in the Azure Portal. All existing integrations on the Exception Details panel will work with the newly unminified callstack. Drag and drop source map unminifying supports all existing and future JS SDKs (+Node.JS), so you do not need to upgrade your SDK version. To view your unminified callstack,
1. Select an Exception Telemetry item in the Azure Portal to view its "End-to-end transaction details"
2. Identify which source maps correspond to this call stack. The source map must match a stack frame's source file, but suffixed with `.map`
3. Drag and drop the source maps onto the call stack in the Azure Portal
![](https://i.imgur.com/Efue9nU.gif)

## Examples

For runnable examples, see [Application Insights Javascript SDK Samples](https://github.com/topics/applicationinsights-js-demo)

## Application Insights Web Basic

For a lightweight experience, you can instead install the basic version of Application Insights
```
npm i --save @microsoft/applicationinsights-web-basic
```
This version comes with the bare minimum amount of features and functionalities and relies on you to build it up as you see fit. For example, it performs no auto-collection (uncaught exceptions, ajax, etc). The APIs to send certain telemetry types, like `trackTrace`, `trackException`, etc, are not included in this version, so you will need to provide your own wrapper. The only api that is available is `track`. A [sample](https://github.com/Azure-Samples/applicationinsights-web-sample1/blob/master/testlightsku.html) is located here.


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