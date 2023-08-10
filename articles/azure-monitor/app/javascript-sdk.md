---
title: Microsoft Azure Monitor Application Insights JavaScript SDK
description: Microsoft Azure Monitor Application Insights JavaScript SDK is a powerful tool for monitoring and analyzing web application performance.
ms.topic: conceptual
ms.date: 07/10/2023
ms.devlang: javascript
ms.custom: devx-track-js
ms.reviewer: mmcc
---

# Enable Azure Monitor Application Insights Real User Monitoring

The Microsoft Azure Monitor Application Insights JavaScript SDK collects usage data which allows you to monitor and analyze the performance of JavaScript web applications. This is commonly referred to as Real User Monitoring or RUM.

We collect page views by default. But if you want to also collect clicks by default, consider adding the [Click Analytics Auto-Collection plug-in](./javascript-feature-extensions.md): 

- If you're adding a [framework extension](./javascript-framework-extensions.md), which you can [add](#optional-add-advanced-sdk-configuration) after you follow the steps to get started below, you'll have the option to add Click Analytics when you add the framework extension. 
- If you're not adding a framework extension, [add the Click Analytics plug-in](./javascript-feature-extensions.md) after you follow the steps to get started.

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

   Preferably, you should add it as the first script in your <head> section so that it can monitor any potential issues with all of your dependencies.

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

1. (Optional) Add or update optional [JavaScript (Web) SDK Loader Script configuration](#javascript-web-sdk-loader-script-configuration), depending on if you need to optimize the loading of your web page or resolve loading errors.

   :::image type="content" source="media/javascript-sdk/sdk-loader-script-configuration.png" alt-text="Screenshot of the JavaScript (Web) SDK Loader Script. The parameters for configuring the JavaScript (Web) SDK Loader Script are highlighted." lightbox="media/javascript-sdk/sdk-loader-script-configuration.png":::

#### JavaScript (Web) SDK Loader Script configuration

   | Name | Type | Required? | Description
   |------|------|-----------|------------
   | src | string | Required | The full URL for where to load the SDK from. This value is used for the "src" attribute of a dynamically added &lt;script /&gt; tag. You can use the public CDN location or your own privately hosted one.
   | name | string | Optional | The global name for the initialized SDK. Use this setting if you need to initialize two different SDKs at the same time.<br><br>The default value is appInsights, so ```window.appInsights``` is a reference to the initialized instance.<br><br> Note: If you assign a name value or if a previous instance has been assigned to the global name appInsightsSDK, the SDK initialization code requires it to be in the global namespace as `window.appInsightsSDK=<name value>` to ensure the correct JavaScript (Web) SDK Loader Script skeleton, and proxy methods are initialized and updated.
   | ld | number in ms | Optional | Defines the load delay to wait before attempting to load the SDK. Use this setting when the HTML page is failing to load because the JavaScript (Web) SDK Loader Script is loading at the wrong time.<br><br>The default value is 0ms after timeout. If you use a negative value, the script tag is immediately added to the <head> region of the page and blocks the page load event until the script is loaded or fails.
   | useXhr | boolean | Optional | This setting is used only for reporting SDK load failures. For example, this setting is useful when the JavaScript (Web) SDK Loader Script is preventing the HTML page from loading, causing fetch() to be unavailable.<br><br>Reporting first attempts to use fetch() if available and then fallback to XHR. Set this setting to `true` to bypass the fetch check. This setting is only required if your application is being used in an environment where fetch would fail to send the failure events such as if the JavaScript (Web) SDK Loader Script isn't loading successfully.
   | crossOrigin | string  | Optional | By including this setting, the script tag added to download the SDK includes the crossOrigin attribute with this string value. Use this setting when you need to provide support for CORS. When not defined (the default), no crossOrigin attribute is added. Recommended values are not defined (the default), "", or "anonymous". For all valid values, see the [cross origin HTML attribute](https://developer.mozilla.org/docs/Web/HTML/Attributes/crossorigin) documentation.
   | onInit | function(aiSdk) { ... } | Optional | This callback function is called after the main SDK script has been successfully loaded and initialized from the CDN (based on the src value). This callback function is useful when you need to insert a telemetry initializer. It's passed one argument, which is a reference to the SDK instance that's being called for and is also called before the first initial page view. If the SDK has already been loaded and initialized, this callback is still called. NOTE: During the processing of the sdk.queue array, this callback is called. You CANNOT add any more items to the queue because they're ignored and dropped. (Added as part of JavaScript (Web) SDK Loader Script version 5--the sv:"5" value within the script). |

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

      The connection string isn't considered a security token or key. For more information, see [Do new Azure regions require the use of connection strings?](../faq.yml#do-new-azure-regions-require-the-use-of-connection-strings-).

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

   It might take a few minutes for data to show up in the portal.

   :::image type="content" source="media/javascript-sdk/confirm-data-flowing.png" alt-text="Screenshot of the Application Insights Transaction search pane in the Azure portal with the Page View option selected. The page views are highlighted." lightbox="media/javascript-sdk/confirm-data-flowing.png":::

1. If you want to query data to confirm data is flowing:

   1. Select **Logs** in the left pane. 

      When you select Logs, the [Queries dialog](../logs/queries.md#queries-dialog) opens, which contains sample queries relevant to your data. 
      
   1. Select **Run** for the sample query you want to run.
   
   1. If needed, you can update the sample query or write a new query by using [Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/).
   
      For essential KQL operators, see [Learn common KQL operators](/azure/data-explorer/kusto/query/tutorials/learn-common-operators). 

## Support

- If you can't run the application or you aren't getting data as expected, see the dedicated [troubleshooting article](/troubleshoot/azure/azure-monitor/app-insights/javascript-sdk-troubleshooting).
- For common question about the JavaScript SDK, see the [FAQ](/azure/azure-monitor/faq#can-i-filter-out-or-modify-some-telemetry-).
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
