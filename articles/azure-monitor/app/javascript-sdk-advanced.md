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
> - [Cookie configuration and management](#cookies)
> - [Source map un-minify support](#source-map)
> - [Tree shaking optimized code](#tree-shaking)

## Cookies

The Azure Application Insights JavaScript SDK provides instance-based cookie management that allows you to control the use of cookies.

You can enable or disable the use of cookies, set custom cookie domains and paths, and customize the functions for fetching, setting, and deleting cookies.

### Cookie configuration

ICookieMgrConfig is a cookie configuration for instance-based cookie management added in 2.6.0. It provides options for enabling or disabling the use of cookies by the SDK, setting custom cookie domains and paths, and customizing the functions for fetching, setting, and deleting cookies.

The ICookieMgrConfig options are defined in the following table.

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

### Cookie management

Starting from version 2.6.0, the Azure Application Insights JavaScript SDK provides instance-based cookie management that can be disabled and re-enabled after initialization.

If you disabled cookies during initialization using the `disableCookiesUsage` or `cookieCfg.enabled` configurations, you can re-enable them using the `setEnabled` function of the ICookieMgr object.

The instance-based cookie management replaces the previous CoreUtils global functions of `disableCookies()`, `setCookie()`, `getCookie()`, and `deleteCookie()`.

To take advantage of the tree-shaking enhancements introduced in version 2.6.0, it is recommended to no longer use the global functions

## Source map

Source map support helps you debug minified JavaScript code with the ability to unminify the minified callstack of your exception telemetry.

> [!div class="checklist"]
> - Compatible with all current integrations on the **Exception Details** panel
> - Supports all current and future JavaScript SDKs, including Node.JS, without the need for an SDK upgrade
 
To view the unminified callstack, select an Exception Telemetry item in the Azure Portal, find the source maps that match the call stack, and drag and drop the source maps onto the call stack in the Azure Portal. The source map must have the same name as the source file of a stack frame, but with a .map extension.

:::image type="content" source="media/javascript-sdk-advanced/javascript-sdk-advanced-unminify.gif" alt-text="Animation demonstrating unminify feature.":::

## Tree shaking

Tree shaking eliminates unused code from the final JavaScript bundle.

To use tree shaking, you should import only the necessary components of the SDK into your code. This way, the unused code will not be included in the final bundle, reducing its size and improving performance.

For example, if you only need to track page views and exceptions, you can import only the required components of the SDK as follows:

```javascript
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { PageView, Exception } from "@microsoft/applicationinsights-web/dist/classes/Telemetry/PageView";

const appInsights = new ApplicationInsights({
  config: {
    connectionString: "YOUR_CONNECTION_STRING",
    extensions: [
      new PageView(),
      new Exception()
    ],
    ...
  }
});
appInsights.loadAppInsights();
```

In this example, only the PageView and Exception components of the SDK are imported, and the rest of the SDK components are not included in the final bundle.

### Tree shaking enhancements and recommendations

In version 2.6.0, the internal usage of the following static helper classes have been deprecated and removed to improve support for tree-shaking algorithms. This allows unused code to be safely dropped when using npm packages.

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
| CoreUtils._canUseCookies | None - Do not use as this will cause all of CoreUtils reference to be included in your final code.<br> Refactor your cookie handling to use the `appInsights.getCookieMgr().setEnabled(true/false)` to set the value and `appInsights.getCookieMgr().isEnabled()` to check the value. |
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
| CoreUtils.disableCookies | disableCookies<br>Referencing either will cause CoreUtils to be referenced for backward compatibility.<br> Refactor your cookie handling to use the `appInsights.getCookieMgr().setEnabled(false)` |
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
| Util.disableCookies | disableCookies<br>Referencing either will cause CoreUtils to be referenced for backward compatibility.<br> Refactor your cookie handling to use the `appInsights.getCookieMgr().setEnabled(false)` |
| Util.canUseCookies | canUseCookies<br>Referencing either will cause CoreUtils to be referenced for backward compatibility.<br>Refactor your cookie handling to use the `appInsights.getCookieMgr().isEnabled()` |
| Util.disallowsSameSiteNone | uaDisallowsSameSiteNone |
| Util.setCookie | coreSetCookie<br>Referencing will cause CoreUtils to be referenced for backward compatibility.<br>Refactor your cookie handling to use the `appInsights.getCookieMgr().set(name: string, value: string)` |
| Util.stringToBoolOrDefault | stringToBoolOrDefault |
| Util.getCookie | coreGetCookie<br>Referencing will cause CoreUtils to be referenced for backward compatibility.<br>Refactor your cookie handling to use the `appInsights.getCookieMgr().get(name: string)` |
| Util.deleteCookie | coreDeleteCookie<br>Referencing will cause CoreUtils to be referenced for backward compatibility.<br>Refactor your cookie handling to use the `appInsights.getCookieMgr().del(name: string, path?: string)` |
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

See the dedicated [troubleshooting article](https://learn.microsoft.com/troubleshoot/azure/azure-monitor/app-insights/javascript-sdk-troubleshooting).

## Next steps

* [Track usage](usage-overview.md)
* [Custom events and metrics](api-custom-events-metrics.md)
* [Build-measure-learn](usage-overview.md)
* [JavaScript SDK advanced topics](javascript-sdk-advanced.md)