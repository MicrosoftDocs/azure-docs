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

## Enable Application Insights

Two methods are available to manually enable Application Insights via the Application Insights JavaScript SDK.

> [!TIP] 
> Good news! We're making it even easier to enable JavaScript. Check out where [SDK Loader Script injection by configuration is available](./codeless-overview.md#sdk-loader-script-injection-by-configuration)!

### [SDK Loader Script](#tab/sdkloaderscript)

Use this method if you want to:

- Load the SDK from the CDN instead of including the Application Insights code with your application code.
- Have control over which pages you add the Application Insights JavaScript SDK to. 

To use this method, you must manually paste the SDK Loader Script at the top of each applicable page.

Use the following steps to enable Application Insights:

1. Paste the SDK Loader Script at the top of each page for which you want to enable Application Insights. 

   > [!NOTE]
   > Preferably, you should add it as the first script in your <head> section so that it can monitor any potential issues with all of your dependencies.

   ```html
   <script type="text/javascript">
   !function(v,y,T){var S=v.location,k="script",D="instrumentationKey",C="ingestionendpoint",I="disableExceptionTracking",E="ai.device.",b="toLowerCase",w=(D[b](),"crossOrigin"),N="POST",e="appInsightsSDK",t=T.name||"appInsights",n=((T.name||v[e])&&(v[e]=t),v[t]||function(l){var u=!1,d=!1,g={initialize:!0,queue:[],sv:"6",version:2,config:l};function m(e,t){var n={},a="Browser";return n[E+"id"]=a[b](),n[E+"type"]=a,n["ai.operation.name"]=S&&S.pathname||"_unknown_",n["ai.internal.sdkVersion"]="javascript:snippet_"+(g.sv||g.version),{time:(a=new Date).getUTCFullYear()+"-"+i(1+a.getUTCMonth())+"-"+i(a.getUTCDate())+"T"+i(a.getUTCHours())+":"+i(a.getUTCMinutes())+":"+i(a.getUTCSeconds())+"."+(a.getUTCMilliseconds()/1e3).toFixed(3).slice(2,5)+"Z",iKey:e,name:"Microsoft.ApplicationInsights."+e.replace(/-/g,"")+"."+t,sampleRate:100,tags:n,data:{baseData:{ver:2}}};function i(e){e=""+e;return 1===e.length?"0"+e:e}}var e,n,f=l.url||T.src;function a(e){var t,n,a,i,o,s,r,c,p;u=!0,g.queue=[],d||(d=!0,i=f,r=(c=function(){var e,t={},n=l.connectionString;if(n)for(var a=n.split(";"),i=0;i<a.length;i++){var o=a[i].split("=");2===o.length&&(t[o[0][b]()]=o[1])}return t[C]||(t[C]="https://"+((e=(n=t.endpointsuffix)?t.location:null)?e+".":"")+"dc."+(n||"services.visualstudio.com")),t}()).instrumentationkey||l[D]||"",c=(c=c[C])?c+"/v2/track":l.endpointUrl,(p=[]).push((t="SDK LOAD Failure: Failed to load Application Insights SDK script (See stack for details)",n=i,o=c,(s=(a=m(r,"Exception")).data).baseType="ExceptionData",s.baseData.exceptions=[{typeName:"SDKLoadFailed",message:t.replace(/\./g,"-"),hasFullStack:!1,stack:t+"\nSnippet failed to load ["+n+"] -- Telemetry is disabled\nHelp Link: https://go.microsoft.com/fwlink/?linkid=2128109\nHost: "+(S&&S.pathname||"_unknown_")+"\nEndpoint: "+o,parsedStack:[]}],a)),p.push((s=i,t=c,(o=(n=m(r,"Message")).data).baseType="MessageData",(a=o.baseData).message='AI (Internal): 99 message:"'+("SDK LOAD Failure: Failed to load Application Insights SDK script (See stack for details) ("+s+")").replace(/\"/g,"")+'"',a.properties={endpoint:t},n)),i=p,r=c,JSON&&((o=v.fetch)&&!T.useXhr?o(r,{method:N,body:JSON.stringify(i),mode:"cors"}):XMLHttpRequest&&((s=new XMLHttpRequest).open(N,r),s.setRequestHeader("Content-type","application/json"),s.send(JSON.stringify(i)))))}function i(e,t){d||setTimeout(function(){!t&&g.core||a()},500)}f&&((n=y.createElement(k)).src=f,!(o=T[w])&&""!==o||"undefined"==n[w]||(n[w]=o),n.onload=i,n.onerror=a,n.onreadystatechange=function(e,t){"loaded"!==n.readyState&&"complete"!==n.readyState||i(0,t)},e=n,T.ld<0?y.getElementsByTagName("head")[0].appendChild(e):setTimeout(function(){y.getElementsByTagName(k)[0].parentNode.appendChild(e)},T.ld||0));try{g.cookie=y.cookie}catch(h){}function t(e){for(;e.length;)!function(t){g[t]=function(){var e=arguments;u||g.queue.push(function(){g[t].apply(g,e)})}}(e.pop())}var s,r,o="track",c="TrackPage",p="TrackEvent",o=(t([o+"Event",o+"PageView",o+"Exception",o+"Trace",o+"DependencyData",o+"Metric",o+"PageViewPerformance","start"+c,"stop"+c,"start"+p,"stop"+p,"addTelemetryInitializer","setAuthenticatedUserContext","clearAuthenticatedUserContext","flush"]),g.SeverityLevel={Verbose:0,Information:1,Warning:2,Error:3,Critical:4},(l.extensionConfig||{}).ApplicationInsightsAnalytics||{});return!0!==l[I]&&!0!==o[I]&&(t(["_"+(s="onerror")]),r=v[s],v[s]=function(e,t,n,a,i){var o=r&&r(e,t,n,a,i);return!0!==o&&g["_"+s]({message:e,url:t,lineNumber:n,columnNumber:a,error:i,evt:v.event}),o},l.autoExceptionInstrumented=!0),g}(T.cfg));function a(){T.onInit&&T.onInit(n)}(v[t]=n).queue&&0===n.queue.length?(n.queue.push(a),n.trackPageView({})):a()}(window,document,{
   src: "https://js.monitor.azure.com/scripts/b/ai.2.min.js",
   // name: "appInsights",
   // ld: 0,
   // useXhr: 1,
   crossOrigin: "anonymous",
   // onInit: null,
   cfg: { // Application Insights Configuration
    connectionString: "YOUR_CONNECTION_STRING"
   }});
   </script>
   ```

1. (Optional) Add or update optional [SDK Loader Script configuration](#sdk-loader-script-configuration), depending on if you need to optimize the loading of your web page or resolve loading errors.

   :::image type="content" source="media/javascript-sdk/sdk-loader-script-configuration.png" alt-text="Screenshot of the SDK Loader Script. The parameters for configuring the SDK Loader Script are highlighted." lightbox="media/javascript-sdk/sdk-loader-script-configuration.png":::

1. (Optional) Add optional [SDK configuration](#sdk-configuration), which is passed to the Application Insights JavaScript SDK during initialization.

   :::image type="content" source="media/javascript-sdk/sdk-loader-script-sdk-configuration.png" alt-text="Screenshot of the SDK Loader Script. The cfg object, which is used to configure the Application Insights JavaScript SDK, is highlighted." lightbox="media/javascript-sdk/sdk-loader-script-sdk-configuration.png":::

1. Add your connection string:

   1. Navigate to the **Overview** pane of your Application Insights resource.
   1. Locate the **Connection String**.
   1. Select the **Copy to clipboard** icon to copy the connection string to the clipboard.

      :::image type="content" source="media/migrate-from-instrumentation-keys-to-connection-strings/migrate-from-instrumentation-keys-to-connection-strings.png" alt-text="Screenshot that shows Application Insights overview and connection string." lightbox="media/migrate-from-instrumentation-keys-to-connection-strings/migrate-from-instrumentation-keys-to-connection-strings.png":::

   1. Replace the placeholder `"YOUR_CONNECTION_STRING"` in the SDK Loader Script with your connection string copied to the clipboard.

      > [!NOTE]
      > An Application Insights [connection string](sdk-connection-string.md) contains information to connect to the Azure cloud and associate telemetry data with a specific Application Insights resource. The connection string includes the Instrumentation Key (a unique identifier), the endpoint suffix (to specify the Azure cloud), and optional explicit endpoints for individual services. The connection string isn't considered a security token or key.

### SDK Loader Script configuration

   | Name | Type | Required? | Description
   |------|------|-----------|------------
   | src | string | Required | The full URL for where to load the SDK from. This value is used for the "src" attribute of a dynamically added &lt;script /&gt; tag. You can use the public CDN location or your own privately hosted one.
   | name | string | Optional | The global name for the initialized SDK. Use this setting if you need to initialize two different SDKs at the same time.<br><br>The default value is appInsights, so ```window.appInsights``` is a reference to the initialized instance.<br><br> Note: If you assign a name value or if a previous instance has been assigned to the global name appInsightsSDK, the SDK initialization code requires it to be in the global namespace as `window.appInsightsSDK=<name value>` to ensure the correct SDK Loader Script skeleton, and proxy methods are initialized and updated.
   | ld | number in ms | Optional | Defines the load delay to wait before attempting to load the SDK. Use this setting when the HTML page is failing to load because the SDK Loader Script is loading at the wrong time.<br><br>The default value is 0ms after timeout. If you use a negative value, the script tag is immediately added to the <head> region of the page and blocks the page load event until the script is loaded or fails.
   | useXhr | boolean | Optional | This setting is used only for reporting SDK load failures. For example, this setting is useful when the SDK Loader Script is preventing the HTML page from loading, causing fetch() to be unavailable.<br><br>Reporting first attempts to use fetch() if available and then fallback to XHR. Set this setting to `true` to bypass the fetch check. This setting is only required if your application is being used in an environment where fetch would fail to send the failure events such as if the SDK Loader Script isn't loading successfully.
   | crossOrigin | string  | Optional | By including this setting, the script tag added to download the SDK includes the crossOrigin attribute with this string value. Use this setting when you need to provide support for CORS. When not defined (the default), no crossOrigin attribute is added. Recommended values are not defined (the default), "", or "anonymous". For all valid values, see the [cross origin HTML attribute](https://developer.mozilla.org/docs/Web/HTML/Attributes/crossorigin) documentation.
   | onInit | function(aiSdk) { ... } | Optional | This callback function is called after the main SDK script has been successfully loaded and initialized from the CDN (based on the src value). This callback function is useful when you need to insert a telemetry initializer. It's passed one argument, which is a reference to the SDK instance that's being called for and is also called before the first initial page view. If the SDK has already been loaded and initialized, this callback is still called. NOTE: During the processing of the sdk.queue array, this callback is called. You CANNOT add any more items to the queue because they're ignored and dropped. (Added as part of SDK Loader Script version 5--the sv:"5" value within the script). |

#### JavaScript telemetry initializers

See [JavaScript telemetry initializers](./api-filtering-sampling.md#javascript-telemetry-initializers).

### SDK configuration

   | Name | Type | Required? | Description
   |------|------|-----------|------------
   | cfg | object | Required | The required connection string and optional [SDK configuration](./javascript-sdk-advanced.md#sdk-configuration) passed to the Application Insights JavaScript SDK during initialization.

### [npm Package](#tab/npmpackage)

Use this method if you're creating your own bundles and you want to include the Application Insights code in your own bundle. 

The npm setup installs the JavaScript SDK as a dependency to your project and enables IntelliSense.

This option is only needed for developers who require more custom events and configuration.

1. Use the following command to install the Microsoft Application Insights JavaScript SDK - Web package.

   ```sh
   npm i --save @microsoft/applicationinsights-web
   ```

   > [!Note]
   > *Typings are included with this package*, so you do *not* need to install a separate typings package.

1. Add the following JavaScript to your application's code.

   > [!NOTE]
   > Where and also how you add this JavaScript code depends on your application code. For example, you might be able to add it exactly as it appears below or you may need to create wrappers around it.
    
   ```js
   import { ApplicationInsights } from '@microsoft/applicationinsights-web'

   const appInsights = new ApplicationInsights({ config: {
     connectionString: 'YOUR_CONNECTION_STRING_GOES_HERE'
     /* ...Other Configuration Options... */
   } });
   appInsights.loadAppInsights();
   appInsights.trackPageView();
   ```

1. Add your connection string:

   1. Navigate to the **Overview** pane of your Application Insights resource.
   1. Locate the **Connection String**.
   1. Select the **Copy to clipboard** icon to copy the connection string to the clipboard.

      :::image type="content" source="media/migrate-from-instrumentation-keys-to-connection-strings/migrate-from-instrumentation-keys-to-connection-strings.png" alt-text="Screenshot that shows Application Insights overview and connection string." lightbox="media/migrate-from-instrumentation-keys-to-connection-strings/migrate-from-instrumentation-keys-to-connection-strings.png":::

   1. Replace the placeholder `'YOUR_CONNECTION_STRING_GOES_HERE'` in the JavaScript code with your connection string pasted to the clipboard.
  
      > [!NOTE]
      > An Application Insights [connection string](sdk-connection-string.md) contains information to connect to the Azure cloud and associate telemetry data with a specific Application Insights resource. The connection string includes the Instrumentation Key (a unique identifier), the endpoint suffix (to specify the Azure cloud), and optional explicit endpoints for individual services. The connection string isn't considered a security token or key.

1. (Optional) Add [SDK configuration](./javascript-sdk-advanced.md#sdk-configuration).

---

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
