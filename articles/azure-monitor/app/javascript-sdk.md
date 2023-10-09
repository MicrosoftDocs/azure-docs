---
title: Microsoft Azure Monitor Application Insights JavaScript SDK
description: Microsoft Azure Monitor Application Insights JavaScript SDK is a powerful tool for monitoring and analyzing web application performance.
ms.topic: conceptual
ms.date: 09/12/2023
ms.devlang: javascript
ms.custom: devx-track-js
ms.reviewer: mmcc
---

# Enable Azure Monitor Application Insights Real User Monitoring

The Microsoft Azure Monitor Application Insights JavaScript SDK collects usage data, which allows you to monitor and analyze the performance of JavaScript web applications. This is commonly referred to as Real User Monitoring or RUM.

The Application Insights JavaScript SDK has a base SDK and several plugins for more capabilities.

:::image type="content" source="media/javascript-sdk/conceptual-diagram-javascript-sdk.png" alt-text="Conceptual diagram that shows the Application Insights JavaScript SDK, its plugins/extensions, and their relationship to each other." lightbox="media/javascript-sdk/conceptual-diagram-javascript-sdk.png":::

We collect page views by default. But if you want to also collect clicks by default, consider adding the [Click Analytics Auto-Collection plug-in](./javascript-feature-extensions.md): 

- If you're adding a [framework extension](./javascript-framework-extensions.md), which you can [add](#optional-add-advanced-sdk-configuration) after you follow the steps to get started below, you can optionally add Click Analytics when you add the framework extension. 
- If you're not adding a framework extension, [add the Click Analytics plug-in](./javascript-feature-extensions.md) after you follow the steps to get started.

We provide the [Debug plugin](https://github.com/microsoft/ApplicationInsights-JS/blob/main/extensions/applicationinsights-debugplugin-js/README.md) and [Performance plugin](https://github.com/microsoft/ApplicationInsights-JS/blob/main/extensions/applicationinsights-perfmarkmeasure-js/README.md) for debugging/testing. In rare cases, it's possible to build your own extension by adding a [custom plugin](https://github.com/microsoft/ApplicationInsights-JS/blob/e4be62c0aa9318b540157118b729bb0c4d8b6c6e/API-reference.md#custom-extension).

## Prerequisites

- Azure subscription: [Create an Azure subscription for free](https://azure.microsoft.com/free/)
- Application Insights resource: [Create an Application Insights resource](create-workspace-resource.md#create-a-workspace-based-resource)
- An application that uses [JavaScript](/visualstudio/javascript)

## Get started

Follow the steps in this section to instrument your application with the Application Insights JavaScript SDK.

> [!TIP] 
> Good news! We're making it even easier to enable JavaScript. Check out where [JavaScript (Web) SDK Loader Script injection by configuration is available](./codeless-overview.md#javascript-web-sdk-loader-script-injection-by-configuration)!

### Add the JavaScript code

Two methods are available to add the code to enable Application Insights via the Application Insights JavaScript SDK:

| Method | When would I use this method? |
|:-------|:------------------------------|
| JavaScript (Web) SDK Loader Script | For most customers, we recommend the JavaScript (Web) SDK Loader Script because you never have to update the SDK and you get the latest updates automatically. Also, you have control over which pages you add the Application Insights JavaScript SDK to. |
| npm package | You want to bring the SDK into your code and enable IntelliSense. This option is only needed for developers who require more custom events and configuration. |

#### [JavaScript (Web) SDK Loader Script](#tab/javascriptwebsdkloaderscript)

1. Paste the JavaScript (Web) SDK Loader Script at the top of each page for which you want to enable Application Insights.

   Preferably, you should add it as the first script in your `<head>` section so that it can monitor any potential issues with all of your dependencies.

   If Internet Explorer 8 is detected, JavaScript SDK v2.x is automatically loaded.

   ```html
   <script type="text/javascript">
   !(function (cfg){function e(){cfg.onInit&&cfg.onInit(i)}var S,u,D,t,n,i,C=window,x=document,w=C.location,I="script",b="ingestionendpoint",E="disableExceptionTracking",A="ai.device.";"instrumentationKey"[S="toLowerCase"](),u="crossOrigin",D="POST",t="appInsightsSDK",n=cfg.name||"appInsights",(cfg.name||C[t])&&(C[t]=n),i=C[n]||function(l){var d=!1,g=!1,f={initialize:!0,queue:[],sv:"7",version:2,config:l};function m(e,t){var n={},i="Browser";function a(e){e=""+e;return 1===e.length?"0"+e:e}return n[A+"id"]=i[S](),n[A+"type"]=i,n["ai.operation.name"]=w&&w.pathname||"_unknown_",n["ai.internal.sdkVersion"]="javascript:snippet_"+(f.sv||f.version),{time:(i=new Date).getUTCFullYear()+"-"+a(1+i.getUTCMonth())+"-"+a(i.getUTCDate())+"T"+a(i.getUTCHours())+":"+a(i.getUTCMinutes())+":"+a(i.getUTCSeconds())+"."+(i.getUTCMilliseconds()/1e3).toFixed(3).slice(2,5)+"Z",iKey:e,name:"Microsoft.ApplicationInsights."+e.replace(/-/g,"")+"."+t,sampleRate:100,tags:n,data:{baseData:{ver:2}},ver:4,seq:"1",aiDataContract:undefined}}var h=-1,v=0,y=["js.monitor.azure.com","js.cdn.applicationinsights.io","js.cdn.monitor.azure.com","js0.cdn.applicationinsights.io","js0.cdn.monitor.azure.com","js2.cdn.applicationinsights.io","js2.cdn.monitor.azure.com","az416426.vo.msecnd.net"],k=l.url||cfg.src;if(k){if((n=navigator)&&(~(n=(n.userAgent||"").toLowerCase()).indexOf("msie")||~n.indexOf("trident/"))&&~k.indexOf("ai.3")&&(k=k.replace(/(\/)(ai\.3\.)([^\d]*)$/,function(e,t,n){return t+"ai.2"+n})),!1!==cfg.cr)for(var e=0;e<y.length;e++)if(0<k.indexOf(y[e])){h=e;break}var i=function(e){var a,t,n,i,o,r,s,c,p,u;f.queue=[],g||(0<=h&&v+1<y.length?(a=(h+v+1)%y.length,T(k.replace(/^(.*\/\/)([\w\.]*)(\/.*)$/,function(e,t,n,i){return t+y[a]+i})),v+=1):(d=g=!0,o=k,c=(p=function(){var e,t={},n=l.connectionString;if(n)for(var i=n.split(";"),a=0;a<i.length;a++){var o=i[a].split("=");2===o.length&&(t[o[0][S]()]=o[1])}return t[b]||(e=(n=t.endpointsuffix)?t.location:null,t[b]="https://"+(e?e+".":"")+"dc."+(n||"services.visualstudio.com")),t}()).instrumentationkey||l.instrumentationKey||"",p=(p=p[b])?p+"/v2/track":l.endpointUrl,(u=[]).push((t="SDK LOAD Failure: Failed to load Application Insights SDK script (See stack for details)",n=o,r=p,(s=(i=m(c,"Exception")).data).baseType="ExceptionData",s.baseData.exceptions=[{typeName:"SDKLoadFailed",message:t.replace(/\./g,"-"),hasFullStack:!1,stack:t+"\nSnippet failed to load ["+n+"] -- Telemetry is disabled\nHelp Link: https://go.microsoft.com/fwlink/?linkid=2128109\nHost: "+(w&&w.pathname||"_unknown_")+"\nEndpoint: "+r,parsedStack:[]}],i)),u.push((s=o,t=p,(r=(n=m(c,"Message")).data).baseType="MessageData",(i=r.baseData).message='AI (Internal): 99 message:"'+("SDK LOAD Failure: Failed to load Application Insights SDK script (See stack for details) ("+s+")").replace(/\"/g,"")+'"',i.properties={endpoint:t},n)),o=u,c=p,JSON&&((r=C.fetch)&&!cfg.useXhr?r(c,{method:D,body:JSON.stringify(o),mode:"cors"}):XMLHttpRequest&&((s=new XMLHttpRequest).open(D,c),s.setRequestHeader("Content-type","application/json"),s.send(JSON.stringify(o))))))},a=function(e,t){g||setTimeout(function(){!t&&f.core||i()},500),d=!1},T=function(e){var n=x.createElement(I),e=(n.src=e,cfg[u]);return!e&&""!==e||"undefined"==n[u]||(n[u]=e),n.onload=a,n.onerror=i,n.onreadystatechange=function(e,t){"loaded"!==n.readyState&&"complete"!==n.readyState||a(0,t)},cfg.ld&&cfg.ld<0?x.getElementsByTagName("head")[0].appendChild(n):setTimeout(function(){x.getElementsByTagName(I)[0].parentNode.appendChild(n)},cfg.ld||0),n};T(k)}try{f.cookie=x.cookie}catch(p){}function t(e){for(;e.length;)!function(t){f[t]=function(){var e=arguments;d||f.queue.push(function(){f[t].apply(f,e)})}}(e.pop())}var r,s,n="track",o="TrackPage",c="TrackEvent",n=(t([n+"Event",n+"PageView",n+"Exception",n+"Trace",n+"DependencyData",n+"Metric",n+"PageViewPerformance","start"+o,"stop"+o,"start"+c,"stop"+c,"addTelemetryInitializer","setAuthenticatedUserContext","clearAuthenticatedUserContext","flush"]),f.SeverityLevel={Verbose:0,Information:1,Warning:2,Error:3,Critical:4},(l.extensionConfig||{}).ApplicationInsightsAnalytics||{});return!0!==l[E]&&!0!==n[E]&&(t(["_"+(r="onerror")]),s=C[r],C[r]=function(e,t,n,i,a){var o=s&&s(e,t,n,i,a);return!0!==o&&f["_"+r]({message:e,url:t,lineNumber:n,columnNumber:i,error:a,evt:C.event}),o},l.autoExceptionInstrumented=!0),f}(cfg.cfg),(C[n]=i).queue&&0===i.queue.length?(i.queue.push(e),i.trackPageView({})):e();})({
   src: "https://js.monitor.azure.com/scripts/b/ai.3.gbl.min.js",
   // name: "appInsights",
   // ld: 0,
   // useXhr: 1,
   crossOrigin: "anonymous",
   // onInit: null,
   // cr: 0,
   cfg: { // Application Insights Configuration
    connectionString: "YOUR_CONNECTION_STRING"
   }});
   </script>
   ```

1. (Optional) Add or update optional [JavaScript (Web) SDK Loader Script configuration](#javascript-web-sdk-loader-script-configuration), depending on if you need to optimize the loading of your web page or resolve loading errors.

   :::image type="content" source="media/javascript-sdk/sdk-loader-script-configuration.png" alt-text="Screenshot of the JavaScript (Web) SDK Loader Script. The parameters for configuring the JavaScript (Web) SDK Loader Script are highlighted." lightbox="media/javascript-sdk/sdk-loader-script-configuration.png":::

#### JavaScript (Web) SDK Loader Script configuration

   | Name | Type | Required? | Description
   |------|------|-----------|------------
   | src | string | Required | The full URL for where to load the SDK from. This value is used for the "src" attribute of a dynamically added &lt;script /&gt; tag. You can use the public CDN location or your own privately hosted one.
   | name | string | Optional | The global name for the initialized SDK. Use this setting if you need to initialize two different SDKs at the same time.<br><br>The default value is appInsights, so ```window.appInsights``` is a reference to the initialized instance.<br><br> Note: If you assign a name value or if a previous instance has been assigned to the global name appInsightsSDK, the SDK initialization code requires it to be in the global namespace as `window.appInsightsSDK=<name value>` to ensure the correct JavaScript (Web) SDK Loader Script skeleton, and proxy methods are initialized and updated.
   | ld | number in ms | Optional | Defines the load delay to wait before attempting to load the SDK. Use this setting when the HTML page is failing to load because the JavaScript (Web) SDK Loader Script is loading at the wrong time.<br><br>The default value is 0ms after timeout. If you use a negative value, the script tag is immediately added to the `<head>` region of the page and blocks the page load event until the script is loaded or fails.
   | useXhr | boolean | Optional | This setting is used only for reporting SDK load failures. For example, this setting is useful when the JavaScript (Web) SDK Loader Script is preventing the HTML page from loading, causing fetch() to be unavailable.<br><br>Reporting first attempts to use fetch() if available and then fallback to XHR. Set this setting to `true` to bypass the fetch check. This setting is only required if your application is being used in an environment where fetch would fail to send the failure events such as if the JavaScript (Web) SDK Loader Script isn't loading successfully.
   | crossOrigin | string  | Optional | By including this setting, the script tag added to download the SDK includes the crossOrigin attribute with this string value. Use this setting when you need to provide support for CORS. When not defined (the default), no crossOrigin attribute is added. Recommended values are not defined (the default), "", or "anonymous". For all valid values, see the [cross origin HTML attribute](https://developer.mozilla.org/docs/Web/HTML/Attributes/crossorigin) documentation.
   | onInit | function(aiSdk) { ... } | Optional | This callback function is called after the main SDK script has been successfully loaded and initialized from the CDN (based on the src value). This callback function is useful when you need to insert a telemetry initializer. It's passed one argument, which is a reference to the SDK instance that's being called for and is also called before the first initial page view. If the SDK has already been loaded and initialized, this callback is still called. NOTE: During the processing of the sdk.queue array, this callback is called. You CANNOT add any more items to the queue because they're ignored and dropped. (Added as part of JavaScript (Web) SDK Loader Script version 5--the sv:"5" value within the script). |
   | cr | boolean | Optional | If the SDK fails to load and the endpoint value defined for `src` is the public CDN location, this configuration option attempts to immediately load the SDK from one of the following backup CDN endpoints:<ul><li>js.monitor.azure.com</li><li>js.cdn.applicationinsights.io</li><li>js.cdn.monitor.azure.com</li><li>js0.cdn.applicationinsights.io</li><li>js0.cdn.monitor.azure.com</li><li>js2.cdn.applicationinsights.io</li><li>js2.cdn.monitor.azure.com</li><li>az416426.vo.msecnd.net</li></ul>NOTE: az416426.vo.msecnd.net is partially supported, so it's not recommended.<br><br>If the SDK successfully loads from a backup CDN endpoint, it loads from the first available one, which is determined when the server performs a successful load check. If the SDK fails to load from any of the backup CDN endpoints, the SDK Failure error message appears.<br><br>When not defined, the default value is `true`. If you don’t want to load the SDK from the backup CDN endpoints, set this configuration option to `false`.<br><br>If you’re loading the SDK from your own privately hosted CDN endpoint, this configuration option is not applicable.

#### [npm package](#tab/npmpackage)

1. Use the following command to install the Microsoft Application Insights JavaScript SDK - Web package.

   ```sh
   npm i --save @microsoft/applicationinsights-web
   ```

    *Typings are included with this package*, so you do *not* need to install a separate typings package.

1. Add the following JavaScript to your application's code.

   Where and also how you add this JavaScript code depends on your application code. For example, you might be able to add it exactly as it appears below or you may need to create wrappers around it.
    
   ```js
   import { ApplicationInsights } from '@microsoft/applicationinsights-web'

   const appInsights = new ApplicationInsights({ config: {
     connectionString: 'YOUR_CONNECTION_STRING'
     /* ...Other Configuration Options... */
   } });
   appInsights.loadAppInsights();
   appInsights.trackPageView();
   ```

---

### Paste the connection string in your environment

To paste the connection string in your environment, follow these steps:

   1. Navigate to the **Overview** pane of your Application Insights resource.
   1. Locate the **Connection String**.
   1. Select the **Copy to clipboard** icon to copy the connection string to the clipboard.

      :::image type="content" source="media/migrate-from-instrumentation-keys-to-connection-strings/migrate-from-instrumentation-keys-to-connection-strings.png" alt-text="Screenshot that shows Application Insights overview and connection string." lightbox="media/migrate-from-instrumentation-keys-to-connection-strings/migrate-from-instrumentation-keys-to-connection-strings.png":::

   1. Replace the placeholder `"YOUR_CONNECTION_STRING"` in the JavaScript code with your [connection string](./sdk-connection-string.md) copied to the clipboard.

      The `connectionString` format must follow "InstrumentationKey=xxxx;....". If the string provided does not meet this format, the SDK load process fails.

      The connection string isn't considered a security token or key. For more information, see [Do new Azure regions require the use of connection strings?](./sdk-connection-string.md#do-new-azure-regions-require-the-use-of-connection-strings).

### (Optional) Add SDK configuration

The optional [SDK configuration](./javascript-sdk-configuration.md#sdk-configuration) is passed to the Application Insights JavaScript SDK during initialization.

To add SDK configuration, add each configuration option directly under `connectionString`. For example:

:::image type="content" source="media/javascript-sdk/example-sdk-configuration.png" alt-text="Screenshot of JavaScript code with SDK configuration options added and highlighted." lightbox="media/javascript-sdk/example-sdk-configuration.png":::

### (Optional) Add advanced SDK configuration

If you want to use the extra features provided by plugins for specific frameworks and optionally enable the Click Analytics plug-in, see:

- [React plugin](javascript-framework-extensions.md?tabs=react)
- [React native plugin](javascript-framework-extensions.md?tabs=reactnative)
- [Angular plugin](javascript-framework-extensions.md?tabs=reactnative)

### Confirm data is flowing

1. Go to your Application Insights resource that you've enabled the SDK for. 
1. In the Application Insights resource menu on the left, under **Investigate**, select the **Transaction search** pane.
1. Open the **Event types** dropdown menu and select **Select all** to clear the checkboxes in the menu. 
1. From the **Event types** dropdown menu, select:

   - **Page View** for Azure Monitor Application Insights Real User Monitoring
   - **Custom Event** for the Click Analytics Auto-Collection plug-in.

   It might take a few minutes for data to show up in the portal. If the only data you see showing up is a load failure exception, see [Troubleshoot SDK load failure for JavaScript web apps](/troubleshoot/azure/azure-monitor/app-insights/javascript-sdk-troubleshooting#troubleshoot-sdk-load-failure-for-javascript-web-apps).

   In some cases, if multiple instances of different versions of Application Insights are running on the same page, errors can occur during initialization. For these cases and the error message that appears, see [Running multiple versions of the Application Insights JavaScript SDK in one session](https://github.com/microsoft/ApplicationInsights-JS/blob/main/versionConflict.md). If you've encountered one of these errors, try changing the namespace by using the `name` setting. For more information, see [JavaScript (Web) SDK Loader Script configuration](#javascript-web-sdk-loader-script-configuration).

   :::image type="content" source="media/javascript-sdk/confirm-data-flowing.png" alt-text="Screenshot of the Application Insights Transaction search pane in the Azure portal with the Page View option selected. The page views are highlighted." lightbox="media/javascript-sdk/confirm-data-flowing.png":::

1. If you want to query data to confirm data is flowing:

   1. Select **Logs** in the left pane. 

      When you select Logs, the [Queries dialog](../logs/queries.md#queries-dialog) opens, which contains sample queries relevant to your data. 
      
   1. Select **Run** for the sample query you want to run.
   
   1. If needed, you can update the sample query or write a new query by using [Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/).
   
      For essential KQL operators, see [Learn common KQL operators](/azure/data-explorer/kusto/query/tutorials/learn-common-operators). 

## Frequently asked questions

This section provides answers to common questions.

### What are the user and session counts?

* The JavaScript SDK sets a user cookie on the web client, to identify returning users, and a session cookie to group activities.
* If there's no client-side script, you can [set cookies at the server](https://apmtips.com/posts/2016-07-09-tracking-users-in-api-apps/).
* If one real user uses your site in different browsers, or by using in-private/incognito browsing, or different machines, they're counted more than once.
* To identify a signed-in user across machines and browsers, add a call to [setAuthenticatedUserContext()](./api-custom-events-metrics.md#authenticated-users).

### What is the JavaScript SDK performance/overhead?

The Application Insights JavaScript SDK has a minimal overhead on your website. At just 36 KB gzipped, and taking only ~15 ms to initialize, the SDK adds a negligible amount of load time to your website. The minimal components of the library are quickly loaded when you use the SDK, and the full script is downloaded in the background.

Additionally, while the script is downloading from the CDN, all tracking of your page is queued, so you don't lose any telemetry during the entire life cycle of your page. This setup process provides your page with a seamless analytics system that's invisible to your users.

### What browsers are supported by the JavaScript SDK?

![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![IE](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Opera](https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png)
--- | --- | --- | --- | --- |
Chrome Latest ✔ |  Firefox Latest ✔ | v3.x: IE 9+ & Microsoft Edge ✔<br>v2.x: IE 8+ Compatible & Microsoft Edge ✔ | Opera Latest ✔ | Safari Latest ✔ |

### Where can I find code examples for the JavaScript SDK?

For runnable examples, see [Application Insights JavaScript SDK samples](https://github.com/microsoft/ApplicationInsights-JS/tree/master/examples).

### What is the ES3/Internet Explorer 8 compatibility with the JavaScript SDK?

We need to take necessary measures to ensure that this SDK continues to "work" and doesn't break the JavaScript execution when loaded by an older browser. It would be ideal to not support older browsers, but numerous large customers can't control which browser their users choose to use.

This statement doesn't mean that we only support the lowest common set of features. We need to maintain ES3 code compatibility. New features need to be added in a manner that wouldn't break ES3 JavaScript parsing and added as an optional feature.

See GitHub for full details on [Internet Explorer 8 support](https://github.com/Microsoft/ApplicationInsights-JS#es3ie8-compatibility).
      
### Is the JavaScript SDK open-source?

Yes, the Application Insights JavaScript SDK is open source. To view the source code or to contribute to the project, see the [official GitHub repository](https://github.com/Microsoft/ApplicationInsights-JS).
      

## Support

- If you can't run the application or you aren't getting data as expected, see the dedicated [troubleshooting article](/troubleshoot/azure/azure-monitor/app-insights/javascript-sdk-troubleshooting).
- For common question about the JavaScript SDK, see the [FAQ](#frequently-asked-questions).
- For Azure support issues, open an [Azure support ticket](https://azure.microsoft.com/support/create-ticket/).
- For a list of open issues related to the Application Insights JavaScript SDK, see the [GitHub Issues Page](https://github.com/microsoft/ApplicationInsights-JS/issues).
- Use the [Telemetry Viewer extension](https://github.com/microsoft/ApplicationInsights-JS/tree/master/tools/chrome-debug-extension) to list out the individual events in the network payload and monitor the internal calls within Application Insights.

## Next steps

* [Explore Application Insights usage experiences](usage-overview.md)
* [Track page views](api-custom-events-metrics.md#page-views)
* [Track custom events and metrics](api-custom-events-metrics.md)
* [Insert a JavaScript telemetry initializer](api-filtering-sampling.md#javascript-telemetry-initializers)
* [Add JavaScript SDK configuration](javascript-sdk-configuration.md)
* See the detailed [release notes](https://github.com/microsoft/ApplicationInsights-JS/releases) on GitHub for updates and bug fixes.
* [Query data in Log Analytics](../../azure-monitor/logs/log-query-overview.md).
