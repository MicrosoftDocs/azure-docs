---
title: Microsoft Azure Monitor Application Insights JavaScript SDK advanced topics
description: Microsoft Azure Monitor Application Insights JavaScript SDK advanced topics.
ms.topic: conceptual
ms.date: 02/28/2023
ms.devlang: javascript
ms.custom: devx-track-js
ms.reviewer: mmcc
---

# Microsoft Azure Monitor Application Insights JavaScript SDK advanced topics

The Azure Application Insights JavaScript SDK provides advanced features for tracking, monitoring, and debugging your web applications.

> [!div class="checklist"]
> - [npm setup](#npm-setup)
> - [Cookie configuration and management](#cookies)
> - [Source map un-minify support](#source-map)
> - [Tree shaking optimized code](#tree-shaking)

## npm setup

The npm setup installs the JavaScript SDK as a dependency to your project and enables IntelliSense.

This option is only needed for developers who require more custom events and configuration.

### Getting started with npm

Install via npm.

```sh
npm i --save @microsoft/applicationinsights-web
```

> [!Note]
> *Typings are included with this package*, so you do *not* need to install a separate typings package.
    
```js
import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const appInsights = new ApplicationInsights({ config: {
  connectionString: 'YOUR_CONNECTION_STRING_GOES_HERE'
  /* ...Other Configuration Options... */
} });
appInsights.loadAppInsights();
appInsights.trackPageView();
```
Replace the placeholder 'YOUR_CONNECTION_STRING_GOES_HERE' with your actual connection string found in the Azure portal.

1. Navigate to the **Overview** pane of your Application Insights resource.
1. Locate the **Connection String**.
1. Select the button to copy the connection string to the clipboard.

:::image type="content" source="media/migrate-from-instrumentation-keys-to-connection-strings/migrate-from-instrumentation-keys-to-connection-strings.png" alt-text="Screenshot that shows Application Insights overview and connection string." lightbox="media/migrate-from-instrumentation-keys-to-connection-strings/migrate-from-instrumentation-keys-to-connection-strings.png":::

### Configuration

These configuration fields are optional and default to false unless otherwise stated.

| Name | Type | Default | Description |
|------|------|---------|-------------|
| accountId | string | null | An optional account ID, if your app groups users into accounts. No spaces, commas, semicolons, equals, or vertical bars |
| sessionRenewalMs | numeric | 1800000 | A session is logged if the user is inactive for this amount of time in milliseconds. Default is 30 minutes |
| sessionExpirationMs | numeric | 86400000 | A session is logged if it has continued for this amount of time in milliseconds. Default is 24 hours |
| maxBatchSizeInBytes | numeric | 10000 | Max size of telemetry batch. If a batch exceeds this limit, it's immediately sent and a new batch is started |
| maxBatchInterval | numeric | 15000 | How long to batch telemetry for before sending (milliseconds) |
| disableExceptionTracking | boolean | false | If true, exceptions aren't autocollected. Default is false. |
| disableTelemetry | boolean | false | If true, telemetry isn't collected or sent. Default is false. |
| enableDebug | boolean | false | If true, **internal** debugging data is thrown as an exception **instead** of being logged, regardless of SDK logging settings. Default is false. <br>***Note:*** Enabling this setting results in dropped telemetry whenever an internal error occurs. It can be useful for quickly identifying issues with your configuration or usage of the SDK. If you don't want to lose telemetry while debugging, consider using `loggingLevelConsole` or `loggingLevelTelemetry` instead of `enableDebug`. |
| loggingLevelConsole | numeric | 0 | Logs **internal** Application Insights errors to console. <br>0: off, <br>1: Critical errors only, <br>2: Everything (errors & warnings) |
| loggingLevelTelemetry | numeric | 1 | Sends **internal** Application Insights errors as telemetry. <br>0: off, <br>1: Critical errors only, <br>2: Everything (errors & warnings) |
| diagnosticLogInterval | numeric | 10000 | (internal) Polling interval (in ms) for internal logging queue |
| samplingPercentage | numeric | 100 | Percentage of events that is sent. Default is 100, meaning all events are sent. Set it if you wish to preserve your data cap for large-scale applications. |
| autoTrackPageVisitTime | boolean | false | If true, on a pageview, the _previous_ instrumented page's view time is tracked and sent as telemetry and a new timer is started for the current pageview. It's sent as a custom metric named `PageVisitTime` in `milliseconds` and is calculated via the Date [now()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date/now) function (if available) and falls back to (new Date()).[getTime()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime) if now() is unavailable (IE8 or less). Default is false. |
| disableAjaxTracking | boolean | false | If true, Ajax calls aren't autocollected. Default is false. |
| disableFetchTracking | boolean | false | The default setting for `disableFetchTracking` is `false`, meaning it's enabled. However, in versions prior to 2.8.10, it was disabled by default. When set to `true`, Fetch requests aren't automatically collected. The default setting changed from `true` to `false` in version 2.8.0. |
| excludeRequestFromAutoTrackingPatterns | string[] \| RegExp[] | undefined | Provide a way to exclude specific route from automatic tracking for XMLHttpRequest or Fetch request. If defined, for an Ajax / fetch request that the request url matches with the regex patterns, auto tracking is turned off. Default is undefined. |
| addRequestContext | (requestContext: IRequestionContext) => {[key: string]: any} | undefined | Provide a way to enrich dependencies logs with context at the beginning of api call. Default is undefined. You need to check if `xhr` exists if you configure `xhr` related context. You need to check if `fetch request` and `fetch response` exist if you configure `fetch` related context. Otherwise you may not get the data you need. |
| overridePageViewDuration | boolean | false | If true, default behavior of trackPageView is changed to record end of page view duration interval when trackPageView is called. If false and no custom duration is provided to trackPageView, the page view performance is calculated using the navigation timing API. Default is false. |
| maxAjaxCallsPerView | numeric | 500 | Default 500 - controls how many Ajax calls are monitored per page view. Set to -1 to monitor all (unlimited) Ajax calls on the page. |
| disableDataLossAnalysis | boolean | true | If false, internal telemetry sender buffers are checked at startup for items not yet sent. |
| disableCorrelationHeaders | boolean | false | If false, the SDK adds two headers ('Request-Id' and 'Request-Context') to all dependency requests to correlate them with corresponding requests on the server side. Default is false. |
| correlationHeaderExcludedDomains | string[] | undefined | Disable correlation headers for specific domains |
| correlationHeaderExcludePatterns | regex[] | undefined | Disable correlation headers using regular expressions |
| correlationHeaderDomains | string[] | undefined | Enable correlation headers for specific domains |
| disableFlushOnBeforeUnload | boolean | false | Default false. If true, flush method isn't called when onBeforeUnload event triggers |
| enableSessionStorageBuffer | boolean | true | Default true. If true, the buffer with all unsent telemetry is stored in session storage. The buffer is restored on page load |
| cookieCfg | [ICookieCfgConfig](javascript-sdk-advanced.md#cookies)<br>[Optional]<br>(Since 2.6.0) | undefined | Defaults to cookie usage enabled see [ICookieCfgConfig](javascript-sdk-advanced.md#cookies) settings for full defaults. |
| disableCookiesUsage | alias for [`cookieCfg.enabled`](javascript-sdk-advanced.md#cookies)<br>[Optional] | false | Default false. A boolean that indicates whether to disable the use of cookies by the SDK. If true, the SDK doesn't store or read any data from cookies.<br>(Since v2.6.0) If `cookieCfg.enabled` is defined it takes precedence. Cookie usage can be re-enabled after initialization via the core.getCookieMgr().setEnabled(true). |
| cookieDomain | alias for [`cookieCfg.domain`](javascript-sdk-advanced.md#cookies)<br>[Optional] | null | Custom cookie domain. It's helpful if you want to share Application Insights cookies across subdomains.<br>(Since v2.6.0) If `cookieCfg.domain` is defined it takes precedence over this value. |
| cookiePath | alias for [`cookieCfg.path`](javascript-sdk-advanced.md#cookies)<br>[Optional]<br>(Since 2.6.0) | null | Custom cookie path. It's helpful if you want to share Application Insights cookies behind an application gateway.<br>If `cookieCfg.path` is defined, it takes precedence. |
| isRetryDisabled | boolean | false | Default false. If false, retry on 206 (partial success), 408 (timeout), 429 (too many requests), 500 (internal server error), 503 (service unavailable), and 0 (offline, only if detected) |
| isStorageUseDisabled | boolean | false | If true, the SDK doesn't store or read any data from local and session storage. Default is false. |
| isBeaconApiDisabled | boolean | true | If false, the SDK sends all telemetry using the [Beacon API](https://www.w3.org/TR/beacon) |
| disableXhr | boolean | false | Don't use XMLHttpRequest or XDomainRequest (for IE < 9) by default instead attempt to use fetch() or sendBeacon. If no other transport is available, it uses XMLHttpRequest |
| onunloadDisableBeacon | boolean | false | Default false. when tab is closed, the SDK sends all remaining telemetry using the [Beacon API](https://www.w3.org/TR/beacon) |
| onunloadDisableFetch | boolean | false | If fetch keepalive is supported don't use it for sending events during unload, it may still fall back to fetch() without keepalive |
| sdkExtension | string | null | Sets the sdk extension name. Only alphabetic characters are allowed. The extension name is added as a prefix to the 'ai.internal.sdkVersion' tag (for example, 'ext_javascript:2.0.0'). Default is null. |
| isBrowserLinkTrackingEnabled | boolean | false | Default is false. If true, the SDK tracks all [Browser Link](/aspnet/core/client-side/using-browserlink) requests. |
| appId | string | null | AppId is used for the correlation between AJAX dependencies happening on the client-side with the server-side requests. When Beacon API is enabled, it can't be used automatically, but can be set manually in the configuration. Default is null |
| enableCorsCorrelation | boolean | false | If true, the SDK adds two headers ('Request-Id' and 'Request-Context') to all CORS requests to correlate outgoing AJAX dependencies with corresponding requests on the server side. Default is false |
| namePrefix | string | undefined | An optional value that is used as name postfix for localStorage and session cookie name.
| sessionCookiePostfix | string | undefined | An optional value that is used as name postfix for session cookie name. If undefined, namePrefix is used as name postfix for session cookie name.
| userCookiePostfix | string | undefined | An optional value that is used as name postfix for user cookie name. If undefined, no postfix is added on user cookie name.
| enableAutoRouteTracking | boolean | false | Automatically track route changes in Single Page Applications (SPA). If true, each route change sends a new Pageview to Application Insights. Hash route changes (`example.com/foo#bar`) are also recorded as new page views.
| enableRequestHeaderTracking | boolean | false | If true, AJAX & Fetch request headers is tracked, default is false. If ignoreHeaders isn't configured, Authorization and X-API-Key headers aren't logged.
| enableResponseHeaderTracking | boolean | false | If true, AJAX & Fetch request's response headers is tracked, default is false. If ignoreHeaders isn't configured, WWW-Authenticate header isn't logged.
| ignoreHeaders | string[] | ["Authorization", "X-API-Key", "WWW-Authenticate"] | AJAX & Fetch request and response headers to be ignored in log data. To override or discard the default, add an array with all headers to be excluded or an empty array to the configuration.
| enableAjaxErrorStatusText | boolean | false | Default false. If true, include response error data text boolean in dependency event on failed AJAX requests. |
| enableAjaxPerfTracking | boolean | false | Default false. Flag to enable looking up and including extra browser window.performance timings in the reported Ajax (XHR and fetch) reported metrics.
| maxAjaxPerfLookupAttempts | numeric | 3 | Defaults to 3. The maximum number of times to look for the window.performance timings (if available) is required. Not all browsers populate the window.performance before reporting the end of the XHR request. For fetch requests, it's added after it's complete.
| ajaxPerfLookupDelay | numeric | 25 | Defaults to 25 ms. The amount of time to wait before reattempting to find the windows.performance timings for an Ajax request, time is in milliseconds and is passed directly to setTimeout().
| distributedTracingMode | numeric or `DistributedTracingModes` | `DistributedTracingModes.AI_AND_W3C` | Sets the distributed tracing mode. If AI_AND_W3C mode or W3C mode is set, W3C trace context headers (traceparent/tracestate) are generated and included in all outgoing requests. AI_AND_W3C is provided for back-compatibility with any legacy Application Insights instrumented services.
| enableUnhandledPromiseRejectionTracking | boolean | false | If true, unhandled promise rejections are autocollected as a JavaScript error. When disableExceptionTracking is true (don't track exceptions), the config value is ignored and unhandled promise rejections aren't reported.
| disableInstrumentationKeyValidation | boolean | false | If true, instrumentation key validation check is bypassed. Default value is false.
| enablePerfMgr | boolean | false | [Optional] When enabled (true) it creates local perfEvents for code that has been instrumented to emit perfEvents (via the doPerf() helper). It can be used to identify performance issues within the SDK based on your usage or optionally within your own instrumented code.
| perfEvtsSendAll | boolean | false | [Optional] When _enablePerfMgr_ is enabled and the [IPerfManager](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/IPerfManager.ts) fires a [INotificationManager](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/INotificationManager.ts).perfEvent() this flag determines whether an event is fired (and sent to all listeners) for all events (true) or only for 'parent' events (false &lt;default&gt;).<br />A parent [IPerfEvent](https://github.com/microsoft/ApplicationInsights-JS/blob/master/shared/AppInsightsCore/src/JavaScriptSDK.Interfaces/IPerfEvent.ts) is an event where no other IPerfEvent is still running at the point of the event being created and its _parent_ property isn't null or undefined. Since v2.5.7
| createPerfMgr | (core: IAppInsightsCore, notificationManager: INotificationManager) => IPerfManager | undefined | Callback function that will be called to create a IPerfManager instance when required and ```enablePerfMgr``` is enabled, it enables you to override the default creation of a PerfManager() without needing to ```setPerfMgr()``` after initialization.
| idLength | numeric | 22 | [Optional] Identifies the default length used to generate new random session and user IDs. Defaults to 22, previous default value was 5 (v2.5.8 or less), if you need to keep the previous maximum length you should set the value to 5.
| customHeaders | `[{header: string, value: string}]` | undefined | [Optional] The ability for the user to provide extra headers when using a custom endpoint. customHeaders aren't added on browser shutdown moment when beacon sender is used. And adding custom headers isn't supported on IE9 or earlier.
| convertUndefined | `any` | undefined | [Optional] Provide user an option to convert undefined field to user defined value.
| eventsLimitInMem | number | 10000 | [Optional] The number of events that can be kept in memory before the SDK starts to drop events when not using Session Storage (the default).
| disableIkeyDeprecationMessage | boolean | true | [Optional]  Disable instrumentation Key deprecation error message. If true, error messages are NOT sent.

## Cookies

The Azure Application Insights JavaScript SDK provides instance-based cookie management that allows you to control the use of cookies.

You can control cookies by enabling or disabling them, setting custom domains and paths, and customizing the functions for managing cookies.

### Cookie configuration

ICookieMgrConfig is a cookie configuration for instance-based cookie management added in 2.6.0. The options provided allow you to enable or disable the use of cookies by the SDK. You can also set custom cookie domains and paths and customize the functions for fetching, setting, and deleting cookies.

The ICookieMgrConfig options are defined in the following table.

| Name | Type | Default | Description |
|------|------|---------|-------------|
| enabled | boolean | true | The current instance of the SDK uses this boolean to indicate whether the use of cookies is enabled. If false, the instance of the SDK initialized by this configuration doesn't store or read any data from cookies. |
| domain | string | null | Custom cookie domain. It's helpful if you want to share Application Insights cookies across subdomains. If not provided uses the value from root `cookieDomain` value. |
| path | string | / | Specifies the path to use for the cookie, if not provided it uses any value from the root `cookiePath` value. |
| ignoreCookies | string[] | undefined | Specify the cookie name(s) to be ignored, it causes any matching cookie name to never be read or written. They may still be explicitly purged or deleted. You don't need to repeat the name in the `blockedCookies` configuration. (since v2.8.8)
| blockedCookies | string[] | undefined | Specify the cookie name(s) to never write. It prevents creating or updating any cookie name, but they can still be read unless also included in the ignoreCookies. They may still be purged or deleted explicitly. If not provided, it defaults to the same list in ignoreCookies. (Since v2.8.8)
| getCookie | `(name: string) => string` | null | Function to fetch the named cookie value, if not provided it uses the internal cookie parsing / caching. |
| setCookie | `(name: string, value: string) => void` | null | Function to set the named cookie with the specified value, only called when adding or updating a cookie. |
| delCookie | `(name: string, value: string) => void` | null | Function to delete the named cookie with the specified value, separated from setCookie to avoid the need to parse the value to determine whether the cookie is being added or removed. If not provided it uses the internal cookie parsing / caching. |

### Cookie management

Starting from version 2.6.0, the Azure Application Insights JavaScript SDK provides instance-based cookie management that can be disabled and re-enabled after initialization.

If you disabled cookies during initialization using the `disableCookiesUsage` or `cookieCfg.enabled` configurations, you can re-enable them using the `setEnabled` function of the ICookieMgr object.

The instance-based cookie management replaces the previous CoreUtils global functions of `disableCookies()`, `setCookie()`, `getCookie()`, and `deleteCookie()`.

To take advantage of the tree-shaking enhancements introduced in version 2.6.0, it's recommended to no longer use the global functions

## Source map

Source map support helps you debug minified JavaScript code with the ability to unminify the minified callstack of your exception telemetry.

> [!div class="checklist"]
> - Compatible with all current integrations on the **Exception Details** panel
> - Supports all current and future JavaScript SDKs, including Node.JS, without the need for an SDK upgrade
 
To view the unminified callstack, select an Exception Telemetry item in the Azure portal, find the source maps that match the call stack, and drag and drop the source maps onto the call stack in the Azure portal. The source map must have the same name as the source file of a stack frame, but with a `map` extension.

:::image type="content" source="media/javascript-sdk-advanced/javascript-sdk-advanced-unminify.gif" alt-text="Animation demonstrating unminify feature.":::

## Tree shaking

Tree shaking eliminates unused code from the final JavaScript bundle.

To take advantage of tree shaking, import only the necessary components of the SDK into your code. By doing so, unused code isn't included in the final bundle, reducing its size and improving performance.

### Tree shaking enhancements and recommendations

In version 2.6.0, we deprecated and removed the internal usage of these static helper classes to improve support for tree-shaking algorithms. It lets npm packages safely drop unused code.

- `CoreUtils`
- `EventHelper`
- `Util`
- `UrlHelper`
- `DateTimeUtils`
- `ConnectionStringParser`

 The functions are now exported as top-level roots from the modules, making it easier to refactor your code for better tree-shaking.

The static classes were changed to const objects that reference the new exported functions, and future changes are planned to further refactor the references.

### Tree shaking deprecated functions and replacements

| Existing | Replacement |
|----------|-------------|
| **CoreUtils** | **@microsoft/applicationinsights-core-js** |
| CoreUtils._canUseCookies | None. Don't use as it causes all of CoreUtils reference to be included in your final code.<br> Refactor your cookie handling to use the `appInsights.getCookieMgr().setEnabled(true/false)` to set the value and `appInsights.getCookieMgr().isEnabled()` to check the value. |
| CoreUtils.isTypeof | isTypeof |
| CoreUtils.isUndefined | isUndefined |
| CoreUtils.isNullOrUndefined | isNullOrUndefined |
| CoreUtils.hasOwnProperty | hasOwnProperty |
| CoreUtils.isFunction | isFunction |
| CoreUtils.isObject | isObject |
| CoreUtils.isDate | isDate |
| CoreUtils.isArray | isArray |
| CoreUtils.isError | isError |
| CoreUtils.isString | isString |
| CoreUtils.isNumber | isNumber |
| CoreUtils.isBoolean | isBoolean |
| CoreUtils.toISOString | toISOString or getISOString |
| CoreUtils.arrForEach | arrForEach |
| CoreUtils.arrIndexOf | arrIndexOf |
| CoreUtils.arrMap | arrMap |
| CoreUtils.arrReduce | arrReduce |
| CoreUtils.strTrim | strTrim |
| CoreUtils.objCreate | objCreateFn |
| CoreUtils.objKeys | objKeys |
| CoreUtils.objDefineAccessors | objDefineAccessors |
| CoreUtils.addEventHandler | addEventHandler |
| CoreUtils.dateNow | dateNow |
| CoreUtils.isIE | isIE |
| CoreUtils.disableCookies | disableCookies<br>Referencing either causes CoreUtils to be referenced for backward compatibility.<br> Refactor your cookie handling to use the `appInsights.getCookieMgr().setEnabled(false)` |
| CoreUtils.newGuid | newGuid |
| CoreUtils.perfNow | perfNow |
| CoreUtils.newId | newId |
| CoreUtils.randomValue | randomValue |
| CoreUtils.random32 | random32 |
| CoreUtils.mwcRandomSeed | mwcRandomSeed |
| CoreUtils.mwcRandom32 | mwcRandom32 |
| CoreUtils.generateW3CId | generateW3CId |
| **EventHelper** | **@microsoft/applicationinsights-core-js** |
| EventHelper.Attach | attachEvent |
| EventHelper.AttachEvent | attachEvent |
| EventHelper.Detach | detachEvent |
| EventHelper.DetachEvent |  detachEvent |
| **Util** | **@microsoft/applicationinsights-common-js** |
| Util.NotSpecified | strNotSpecified |
| Util.createDomEvent | createDomEvent |
| Util.disableStorage | utlDisableStorage |
| Util.isInternalApplicationInsightsEndpoint | isInternalApplicationInsightsEndpoint |
| Util.canUseLocalStorage | utlCanUseLocalStorage |
| Util.getStorage | utlGetLocalStorage |
| Util.setStorage | utlSetLocalStorage |
| Util.removeStorage | utlRemoveStorage |
| Util.canUseSessionStorage | utlCanUseSessionStorage |
| Util.getSessionStorageKeys | utlGetSessionStorageKeys |
| Util.getSessionStorage | utlGetSessionStorage |
| Util.setSessionStorage | utlSetSessionStorage |
| Util.removeSessionStorage | utlRemoveSessionStorage |
| Util.disableCookies | disableCookies<br>Referencing either causes CoreUtils to be referenced for backward compatibility.<br> Refactor your cookie handling to use the `appInsights.getCookieMgr().setEnabled(false)` |
| Util.canUseCookies | canUseCookies<br>Referencing either causes CoreUtils to be referenced for backward compatibility.<br>Refactor your cookie handling to use the `appInsights.getCookieMgr().isEnabled()` |
| Util.disallowsSameSiteNone | uaDisallowsSameSiteNone |
| Util.setCookie | coreSetCookie<br>Referencing causes CoreUtils to be referenced for backward compatibility.<br>Refactor your cookie handling to use the `appInsights.getCookieMgr().set(name: string, value: string)` |
| Util.stringToBoolOrDefault | stringToBoolOrDefault |
| Util.getCookie | coreGetCookie<br>Referencing causes CoreUtils to be referenced for backward compatibility.<br>Refactor your cookie handling to use the `appInsights.getCookieMgr().get(name: string)` |
| Util.deleteCookie | coreDeleteCookie<br>Referencing causes CoreUtils to be referenced for backward compatibility.<br>Refactor your cookie handling to use the `appInsights.getCookieMgr().del(name: string, path?: string)` |
| Util.trim | strTrim |
| Util.newId | newId |
| Util.random32 | ---<br>No replacement, refactor your code to use the core random32(true) |
| Util.generateW3CId | generateW3CId |
| Util.isArray | isArray |
| Util.isError | isError |
| Util.isDate | isDate |
| Util.toISOStringForIE8 | toISOString |
| Util.getIEVersion | getIEVersion |
| Util.msToTimeSpan | msToTimeSpan |
| Util.isCrossOriginError | isCrossOriginError |
| Util.dump | dumpObj |
| Util.getExceptionName | getExceptionName |
| Util.addEventHandler | attachEvent |
| Util.IsBeaconApiSupported | isBeaconApiSupported |
| Util.getExtension | getExtensionByName
| **UrlHelper** | **@microsoft/applicationinsights-common-js** |
| UrlHelper.parseUrl | urlParseUrl |
| UrlHelper.getAbsoluteUrl | urlGetAbsoluteUrl |
| UrlHelper.getPathName | urlGetPathName |
| UrlHelper.getCompeteUrl | urlGetCompleteUrl |
| UrlHelper.parseHost | urlParseHost |
| UrlHelper.parseFullHost | urlParseFullHost
| **DateTimeUtils** | **@microsoft/applicationinsights-common-js** |
| DateTimeUtils.Now | dateTimeUtilsNow |
| DateTimeUtils.GetDuration | dateTimeUtilsDuration |
| **ConnectionStringParser** | **@microsoft/applicationinsights-common-js** |
| ConnectionStringParser.parse | parseConnectionString |

## Troubleshooting

See the dedicated [troubleshooting article](/troubleshoot/azure/azure-monitor/app-insights/javascript-sdk-troubleshooting).

## Next steps

* [Track usage](usage-overview.md)
* [Custom events and metrics](api-custom-events-metrics.md)
* [Build-measure-learn](usage-overview.md)
* [JavaScript SDK advanced topics](javascript-sdk-advanced.md)