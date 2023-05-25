---
title: Microsoft Azure Monitor Application Insights JavaScript SDK
description: Microsoft Azure Monitor Application Insights JavaScript SDK is a powerful tool for monitoring and analyzing web application performance.
ms.topic: conceptual
ms.date: 03/07/2023
ms.devlang: javascript
ms.custom: devx-track-js
ms.reviewer: mmcc
---

# Microsoft Azure Monitor Application Insights JavaScript SDK

[Microsoft Azure Monitor Application Insights](app-insights-overview.md) JavaScript SDK allows you to monitor and analyze the performance of JavaScript web applications.

## Prerequisites

- Azure subscription: [Create an Azure subscription for free](https://azure.microsoft.com/free/)
- Application Insights resource: [Create an Application Insights resource](create-workspace-resource.md#create-a-workspace-based-resource)
- An application that uses [JavaScript](/visualstudio/javascript)

## Get started

The Application Insights JavaScript SDK is implemented with a runtime snippet for out-of-the-box web analytics.
The JavaScript snippet can be added to your webpages manually or via the automatic snippet injection.

### Enable Application Insights SDK for JavaScript automatically

The automatic Snippet injection feature available in the Application Insights .NET core SDK and the Application Insights Node.js SDK (preview)
allows you to automatically inject the Application Insights JavaScript SDK into every webpage of your web application. 
For more information, see [Application Insights .NET core SDK Snippet Injection](./asp-net-core.md?tabs=netcorenew%2Cnetcore6#enable-client-side-telemetry-for-web-applications)
and [Application Insights Node.js SDK Snippet Injection (preview)](./nodejs.md#automatic-web-instrumentationpreview).
However, if you want more control over which pages to add the Application Insights JavaScript SDK 
or if you're using a programming language other than .NET and Node.js, please follow the manual configuration steps below.

### Enable Application Insights SDK for JavaScript manually

Only two steps are required to enable the Application Insights SDK for JavaScript.

#### Add the code snippet

Directly instrument your webpages with Application Insights by pasting this snippet at the top of each your pages. Preferably, it should be the first script in your <head> section so that it can monitor any potential issues with all of your dependencies.

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

An Application Insights [connection string](sdk-connection-string.md) contains information to connect to the Azure cloud and associate telemetry data with a specific Application Insights resource. The connection string includes the Instrumentation Key (a unique identifier), the endpoint suffix (to specify the Azure cloud), and optional explicit endpoints for individual services. The connection string isn't considered a security token or key.

In the code snippet, replace the placeholder `"CONNECTION_STRING"` with your actual connection string found in the Azure portal.

1. Navigate to the **Overview** pane of your Application Insights resource.
1. Locate the **Connection String**.
1. Select the button to copy the connection string to the clipboard.

:::image type="content" source="media/migrate-from-instrumentation-keys-to-connection-strings/migrate-from-instrumentation-keys-to-connection-strings.png" alt-text="Screenshot that shows Application Insights overview and connection string." lightbox="media/migrate-from-instrumentation-keys-to-connection-strings/migrate-from-instrumentation-keys-to-connection-strings.png":::

## Snippet configuration

Other snippet configuration is optional.

| Name | Type | Description
|------|------|----------------
| src | string **[required]** | The full URL for where to load the SDK from. This value is used for the "src" attribute of a dynamically added &lt;script /&gt; tag. You can use the public CDN location or your own privately hosted one.
| name | string *[optional]* | The global name for the initialized SDK, defaults to appInsights. So ```window.appInsights``` is a reference to the initialized instance. Note: If you assign a name value or if a previous instance has been assigned to the global name appInsightsSDK, the SDK initialization code requires it to be in the global namespace as `window.appInsightsSDK=<name value>` to ensure the correct snippet skeleton, and proxy methods are initialized and updated.
| ld | number in ms *[optional]* | Defines the load delay to wait before attempting to load the SDK. The default value is 0ms. If you use a negative value, the script tag is immediately added to the <head> region of the page and blocks the page load event until the script is loaded or fails.
| useXhr | boolean *[optional]* | This setting is used only for reporting SDK load failures. Reporting first attempts to use fetch() if available and then fallback to XHR, setting this value to true just bypasses the fetch check. Use of this value is only be required if your application is being used in an environment where fetch would fail to send the failure events.
| crossOrigin | string *[optional]* | By including this setting, the script tag added to download the SDK includes the crossOrigin attribute with this string value. When not defined (the default) no crossOrigin attribute is added. Recommended values aren't defined (the default); ""; or "anonymous" (For all valid values see the [cross origin HTML attribute](https://developer.mozilla.org/docs/Web/HTML/Attributes/crossorigin) documentation)
| onInit | function(aiSdk) { ... } *[optional]* | This callback function is called after the main SDK script has been successfully loaded and initialized from the CDN (based on the src value). It's passed a reference to the sdk instance that it's being called for and is also called before the first initial page view. If the SDK has already been loaded and initialized, this callback is still called. NOTE: During the processing of the sdk.queue array, this callback is called. You CANNOT add any more items to the queue because they're ignored and dropped. (Added as part of snippet version 5--the sv:"5" value within the snippet script)
| cfg | object **[required]** | The configuration passed to the Application Insights SDK during initialization.

### Example using the snippet onInit callback

```html
<script type="text/javascript">
!function(T,l,y){<!-- Removed the Snippet code for brevity -->}(window,document,{
src: "https://js.monitor.azure.com/scripts/b/ai.2.min.js",
crossOrigin: "anonymous",
onInit: function (sdk) {
  sdk.addTelemetryInitializer(function (envelope) {
    envelope.data = envelope.data || {};
    envelope.data.someField = 'This item passed through my telemetry initializer';
  });
}, // Once the application insights instance has loaded and initialized this method will be called
cfg: { // Application Insights Configuration
    connectionString: "YOUR_CONNECTION_STRING"
}});
</script>
```

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
- User information (for example, Location, network, IP)
- Device information (for example, Browser, OS, version, language, model)
- Session information

> [!Note]
> For some applications, such as single-page applications (SPAs), the duration may not be recorded and will default to 0.

For more information, see the following link: https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/azure-monitor/app/data-retention-privacy.md

## Confirm data is flowing

Check the data flow by going to the Azure portal and navigating to the Application Insights resource that you've enabled the SDK for. From there, you can view the data in the "Transaction search" or "Metrics" sections. 

Additionally, you can use the SDK's trackPageView() method to manually send a page view event and verify that it appears in the portal.

If you can't run the application or you aren't getting data as expected, see the dedicated [troubleshooting article](/troubleshoot/azure/azure-monitor/app-insights/javascript-sdk-troubleshooting).

### Analytics

To query your telemetry collected by the JavaScript SDK, select the **View in Logs (Analytics)** button. By adding a `where` statement of `client_Type == "Browser"`, you only see data from the JavaScript SDK. Any server-side telemetry collected by other SDKs is excluded.

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

## Advanced SDK configuration

Additional information is available for the following advanced scenarios:

- [JavaScript SDK npm setup](javascript-sdk-advanced.md#npm-setup)
- [React plugin](javascript-framework-extensions.md?tabs=react)
- [React native plugin](javascript-framework-extensions.md?tabs=reactnative)
- [Angular plugin](javascript-framework-extensions.md?tabs=reactnative)
- [Click Analytics plugin](javascript-feature-extensions.md)

## Frequently asked questions

#### What is the SDK performance/overhead?

The Application Insights JavaScript SDK has a minimal overhead on your website. At just 36 KB gzipped, and taking only ~15 ms to initialize, the SDK adds a negligible amount of load time to your website. The minimal components of the library are quickly loaded when you use the SDK, and the full script is downloaded in the background.

Additionally, while the script is downloading from the CDN, all tracking of your page is queued, so you don't lose any telemetry during the entire life cycle of your page. This setup process provides your page with a seamless analytics system that's invisible to your users.

#### What browsers are supported?

![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![IE](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Opera](https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png)
--- | --- | --- | --- | --- |
Chrome Latest ✔ |  Firefox Latest ✔ | IE 9+ & Microsoft Edge ✔<br>IE 8- Compatible | Opera Latest ✔ | Safari Latest ✔ |

#### Where can I find code examples?

For runnable examples, see [Application Insights JavaScript SDK samples](https://github.com/microsoft/ApplicationInsights-JS/tree/master/examples).

#### How can I upgrade from the old version of Application Insights?

For more information, see [Upgrade from old versions of the Application Insights JavaScript SDK](javascript-sdk-upgrade.md).

#### What is the ES3/Internet Explorer 8 compatibility?

We need to take necessary measures to ensure that this SDK continues to "work" and doesn't break the JavaScript execution when loaded by an older browser. It would be ideal to not support older browsers, but numerous large customers can't control which browser their users choose to use.

This statement doesn't mean that we only support the lowest common set of features. We need to maintain ES3 code compatibility. New features need to be added in a manner that wouldn't break ES3 JavaScript parsing and added as an optional feature.

See GitHub for full details on [Internet Explorer 8 support](https://github.com/Microsoft/ApplicationInsights-JS#es3ie8-compatibility).

#### Is the Application Insights SDK open-source?

Yes, the Application Insights JavaScript SDK is open source. To view the source code or to contribute to the project, see the [official GitHub repository](https://github.com/Microsoft/ApplicationInsights-JS).

#### How can I update my third-party server configuration?

The server side needs to be able to accept connections with those headers present. Depending on the `Access-Control-Allow-Headers` configuration on the server side, it's often necessary to extend the server-side list by manually adding `Request-Id`, `Request-Context`, and `traceparent` (W3C distributed header).

Access-Control-Allow-Headers: `Request-Id`, `traceparent`, `Request-Context`, `<your header>`

#### How can I disable distributed tracing?

Distributed tracing can be disabled in configuration.

## Troubleshooting

See the dedicated [troubleshooting article](/troubleshoot/azure/azure-monitor/app-insights/javascript-sdk-troubleshooting).

## Release notes

Detailed release notes regarding updates and bug fixes can be found on [GitHub](https://github.com/microsoft/ApplicationInsights-JS/releases)

## Next steps

* [Track usage](usage-overview.md)
* [Custom events and metrics](api-custom-events-metrics.md)
* [Build-measure-learn](usage-overview.md)
* [JavaScript SDK advanced topics](javascript-sdk-advanced.md)
