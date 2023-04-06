---
title: Create a new Application Insights resource | Microsoft Docs
description: Manually set up Application Insights monitoring for a new live application.
ms.topic: conceptual
ms.date: 02/28/2023
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.reviewer: dalek
---

# Create an Application Insights resource

> [!CAUTION]
> This article applies to Application Insights Classic resources, which are [no longer recommended](https://azure.microsoft.com/updates/we-re-retiring-classic-application-insights-on-29-february-2024).
>
> The information in this article is stale and won't be updated.
> 
> [Transition to workspace-based Application Insights](convert-classic-resource.md) to take advantage of [new capabilities](create-workspace-resource.md#new-capabilities).

Application Insights displays data about your application in an Azure resource. Creating a new resource is part of [setting up Application Insights to monitor a new application][start]. After you've created your new resource, you can get its instrumentation key and use it to configure the Application Insights SDK. The instrumentation key links your telemetry to the resource.

> [!IMPORTANT]
> On **February 29, 2024,** [support for classic Application Insights will end](https://azure.microsoft.com/updates/we-re-retiring-classic-application-insights-on-29-february-2024). [Transition to workspace-based Application Insights](convert-classic-resource.md) to take advantage of [new capabilities](create-workspace-resource.md#new-capabilities). Newer regions introduced after February 2021 don't support creating classic Application Insights resources.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

## Sign in to Azure

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Create an Application Insights resource

Sign in to the [Azure portal](https://portal.azure.com) and create an Application Insights resource.

![Screenshot that shows selecting the + sign in the upper-left corner, Developer Tools, and Application Insights.](./media/create-new-resource/new-app-insights.png)

   | Settings        |  Value           | Description  |
   | ------------- |:-------------|:-----|
   | **Name**      | `Unique value` | Name that identifies the app you're monitoring. |
   | **Resource group**     | `myResourceGroup`      | Name for the new or existing resource group to host Application Insights data. |
   | **Region** | `East US` | Select a location near you or near where your app is hosted. |
   | **Resource mode** | `Classic` or `Workspace-based` | Workspace-based resources allow you to send your Application Insights telemetry to a common Log Analytics workspace. For more information, see [Workspace-based Application Insights resources](create-workspace-resource.md).

> [!NOTE]
> You can use the same resource name across different resource groups, but it can be beneficial to use a globally unique name. If you plan to [perform cross-resource queries](../logs/cross-workspace-query.md#identify-an-application), using a globally unique name simplifies the required syntax.

Enter the appropriate values in the required fields. Select **Review + create**.

> [!div class="mx-imgBorder"]
> ![Screenshot that shows entering values in required fields and the Review + create button.](./media/create-new-resource/review-create.png)

After your app is created, a new pane displays performance and usage data about your monitored application.

## Copy the instrumentation key

The instrumentation key identifies the resource that you want to associate with your telemetry data. You need to copy the instrumentation key and add it to your application's code.

## Install the SDK in your app

Install the Application Insights SDK in your app. This step depends heavily on the type of your application.

Use the instrumentation key to configure [the SDK that you install in your application][start].

The SDK includes standard modules that send telemetry, so you don't have to write any more code. To track user actions or diagnose issues in more detail, [use the API][api] to send your own telemetry.

## Create a resource automatically

Use PowerShell or the Azure CLI to create a resource automatically.

### PowerShell

Create a new Application Insights resource.

```powershell
New-AzApplicationInsights [-ResourceGroupName] <String> [-Name] <String> [-Location] <String> [-Kind <String>]
 [-Tag <Hashtable>] [-DefaultProfile <IAzureContextContainer>] [-WhatIf] [-Confirm] [<CommonParameters>]
```

#### Example

```powershell
New-AzApplicationInsights -Kind java -ResourceGroupName testgroup -Name test1027 -location eastus
```

#### Results

```powershell
Id                 : /subscriptions/{subid}/resourceGroups/testgroup/providers/microsoft.insights/components/test1027
ResourceGroupName  : testgroup
Name               : test1027
Kind               : web
Location           : eastus
Type               : microsoft.insights/components
AppId              : 8323fb13-32aa-46af-b467-8355cf4f8f98
ApplicationType    : web
Tags               : {}
CreationDate       : 10/27/2017 4:56:40 PM
FlowType           :
HockeyAppId        :
HockeyAppToken     :
InstrumentationKey : 00000000-aaaa-bbbb-cccc-dddddddddddd
ProvisioningState  : Succeeded
RequestSource      : AzurePowerShell
SamplingPercentage :
TenantId           : {subid}
```

For the full PowerShell documentation for this cmdlet, and to learn how to retrieve the instrumentation key, see the [Azure PowerShell documentation](/powershell/module/az.applicationinsights/new-azapplicationinsights).

### Azure CLI (preview)

To access the preview Application Insights Azure CLI commands, you first need to run:

```azurecli
 az extension add -n application-insights
```

If you don't run the `az extension add` command, you see an error message that states: `az : ERROR: az monitor: 'app-insights' is not in the 'az monitor' command group. See 'az monitor --help'.`

Run the following command to create your Application Insights resource:

```azurecli
az monitor app-insights component create --app
                                         --location
                                         --resource-group
                                         [--application-type]
                                         [--kind]
                                         [--tags]
```

#### Example

```azurecli
az monitor app-insights component create --app demoApp --location westus2 --kind web --resource-group demoRg --application-type web
```

#### Results

```azurecli
az monitor app-insights component create --app demoApp --location eastus --kind web --resource-group demoApp --application-type web
{
  "appId": "87ba512c-e8c9-48d7-b6eb-118d4aee2697",
  "applicationId": "demoApp",
  "applicationType": "web",
  "creationDate": "2019-08-16T18:15:59.740014+00:00",
  "etag": "\"0300edb9-0000-0100-0000-5d56f2e00000\"",
  "flowType": "Bluefield",
  "hockeyAppId": null,
  "hockeyAppToken": null,
  "id": "/subscriptions/{subid}/resourceGroups/demoApp/providers/microsoft.insights/components/demoApp",
  "instrumentationKey": "00000000-aaaa-bbbb-cccc-dddddddddddd",
  "kind": "web",
  "location": "eastus",
  "name": "demoApp",
  "provisioningState": "Succeeded",
  "requestSource": "rest",
  "resourceGroup": "demoApp",
  "samplingPercentage": null,
  "tags": {},
  "tenantId": {tenantID},
  "type": "microsoft.insights/components"
}
```

For the full Azure CLI documentation for this command, and to learn how to retrieve the instrumentation key, see the [Azure CLI documentation](/cli/azure/monitor/app-insights/component#az-monitor-app-insights-component-create).

## Override default endpoints

> [!WARNING]
> Don't modify endpoints. [Transition to connection strings](migrate-from-instrumentation-keys-to-connection-strings.md#migrate-from-application-insights-instrumentation-keys-to-connection-strings) to simplify configuration and eliminate the need for endpoint modification.

To send data from Application Insights to certain regions, you need to override the default endpoint addresses. Each SDK requires slightly different modifications, all of which are described in this article.

These changes require you to adjust the sample code and replace the placeholder values for `QuickPulse_Endpoint_Address`, `TelemetryChannel_Endpoint_Address`, and `Profile_Query_Endpoint_address` with the actual endpoint addresses for your specific region. The end of this article contains links to the endpoint addresses for regions where this configuration is required.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

---

### SDK code changes

# [.NET](#tab/net)

> [!NOTE]
> The *applicationinsights.config* file is automatically overwritten anytime an SDK upgrade is performed. After you perform an SDK upgrade, be sure to reenter the region-specific endpoint values.

```xml
<ApplicationInsights>
  ...
  <TelemetryModules>
    <Add Type="Microsoft.ApplicationInsights.Extensibility.PerfCounterCollector.QuickPulse.QuickPulseTelemetryModule, Microsoft.AI.PerfCounterCollector">
      <QuickPulseServiceEndpoint>Custom_QuickPulse_Endpoint_Address</QuickPulseServiceEndpoint>
    </Add>
  </TelemetryModules>
   ...
  <TelemetrySinks>
    <Add Name = "default">
      <TelemetryChannel>
         <EndpointAddress>TelemetryChannel_Endpoint_Address</EndpointAddress>
      </TelemetryChannel>
    </Add>
  </TelemetrySinks>
  ...
  <ApplicationIdProvider Type="Microsoft.ApplicationInsights.Extensibility.Implementation.ApplicationId.ApplicationInsightsApplicationIdProvider, Microsoft.ApplicationInsights">
    <ProfileQueryEndpoint>Profile_Query_Endpoint_address</ProfileQueryEndpoint>
  </ApplicationIdProvider>
  ...
</ApplicationInsights>
```

# [.NET Core](#tab/netcore)

Modify the *appsettings.json* file in your project to adjust the main endpoint:

```json
"ApplicationInsights": {
    "InstrumentationKey": "instrumentationkey",
    "TelemetryChannel": {
      "EndpointAddress": "TelemetryChannel_Endpoint_Address"
    }
  }
```

The values for Live Metrics and the Profile Query endpoint can only be set via code. To override the default values for all endpoint values via code, make the following changes in the `ConfigureServices` method of the `Startup.cs` file:

```csharp
using Microsoft.ApplicationInsights.Extensibility.Implementation.ApplicationId;
using Microsoft.ApplicationInsights.Extensibility.PerfCounterCollector.QuickPulse; //Place at top of Startup.cs file

   services.ConfigureTelemetryModule<QuickPulseTelemetryModule>((module, o) => module.QuickPulseServiceEndpoint="QuickPulse_Endpoint_Address");

   services.AddSingleton<IApplicationIdProvider, ApplicationInsightsApplicationIdProvider>(_ => new ApplicationInsightsApplicationIdProvider() { ProfileQueryEndpoint = "Profile_Query_Endpoint_address" });

   services.AddSingleton<ITelemetryChannel>(_ => new ServerTelemetryChannel() { EndpointAddress = "TelemetryChannel_Endpoint_Address" });

    //Place in the ConfigureServices method. Place this before services.AddApplicationInsightsTelemetry("instrumentation key"); if it's present
```

# [Azure Functions](#tab/functions)

For Azure Functions, we recommend that you use [connection strings](./sdk-connection-string.md?tabs=net) set in the function's Application settings. To access Application settings for your function from within the functions pane, select **Settings** > **Configuration** > **Application settings**.

**Name**: `APPLICATIONINSIGHTS_CONNECTION_STRING`<br>
**Value**: `Connection String Value`

# [Java](#tab/java)

Modify the *applicationinsights.xml* file to change the default endpoint address:

```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationInsights xmlns="http://schemas.microsoft.com/ApplicationInsights/2013/Settings">
  <InstrumentationKey>ffffeeee-dddd-cccc-bbbb-aaaa99998888</InstrumentationKey>
  <TelemetryModules>
    <Add type="com.microsoft.applicationinsights.web.extensibility.modules.WebRequestTrackingTelemetryModule"/>
    <Add type="com.microsoft.applicationinsights.web.extensibility.modules.WebSessionTrackingTelemetryModule"/>
    <Add type="com.microsoft.applicationinsights.web.extensibility.modules.WebUserTrackingTelemetryModule"/>
  </TelemetryModules>
  <TelemetryInitializers>
    <Add type="com.microsoft.applicationinsights.web.extensibility.initializers.WebOperationIdTelemetryInitializer"/>
    <Add type="com.microsoft.applicationinsights.web.extensibility.initializers.WebOperationNameTelemetryInitializer"/>
    <Add type="com.microsoft.applicationinsights.web.extensibility.initializers.WebSessionTelemetryInitializer"/>
    <Add type="com.microsoft.applicationinsights.web.extensibility.initializers.WebUserTelemetryInitializer"/>
    <Add type="com.microsoft.applicationinsights.web.extensibility.initializers.WebUserAgentTelemetryInitializer"/>
  </TelemetryInitializers>
  <!--Add the following Channel value to modify the Endpoint address-->
  <Channel type="com.microsoft.applicationinsights.channel.concrete.inprocess.InProcessTelemetryChannel">
  <EndpointAddress>TelemetryChannel_Endpoint_Address</EndpointAddress>
  </Channel>
</ApplicationInsights>
```

### Spring Boot

Modify the `application.properties` file and add:

```yaml
azure.application-insights.channel.in-process.endpoint-address= TelemetryChannel_Endpoint_Address
```

# [Node.js](#tab/nodejs)

```javascript
var appInsights = require("applicationinsights");
appInsights.setup('INSTRUMENTATION_KEY');
appInsights.defaultClient.config.endpointUrl = "TelemetryChannel_Endpoint_Address"; // ingestion
appInsights.defaultClient.config.profileQueryEndpoint = "Profile_Query_Endpoint_address"; // appid/profile lookup
appInsights.defaultClient.config.quickPulseHost = "QuickPulse_Endpoint_Address"; //live metrics
appInsights.Configuration.start();
```

The endpoints can also be configured through environment variables:

```
**Instrumentation Key*: "APPINSIGHTS_INSTRUMENTATIONKEY"
*Profile endpoint*: "Profile_Query_Endpoint_address"
*Live Metrics endpoint*: "QuickPulse_Endpoint_Address"
```

# [JavaScript](#tab/js)

The current snippet listed here's version 5. The version is encoded in the snippet as `sv:"#"`. The [current version is also available on GitHub](https://go.microsoft.com/fwlink/?linkid=2156318).

```html
<script type="text/javascript">
!function(T,l,y){var S=T.location,k="script",D="instrumentationKey",C="ingestionendpoint",I="disableExceptionTracking",E="ai.device.",b="toLowerCase",w="crossOrigin",N="POST",e="appInsightsSDK",t=y.name||"appInsights";(y.name||T[e])&&(T[e]=t);var n=T[t]||function(d){var g=!1,f=!1,m={initialize:!0,queue:[],sv:"5",version:2,config:d};function v(e,t){var n={},a="Browser";return n[E+"id"]=a[b](),n[E+"type"]=a,n["ai.operation.name"]=S&&S.pathname||"_unknown_",n["ai.internal.sdkVersion"]="javascript:snippet_"+(m.sv||m.version),{time:function(){var e=new Date;function t(e){var t=""+e;return 1===t.length&&(t="0"+t),t}return e.getUTCFullYear()+"-"+t(1+e.getUTCMonth())+"-"+t(e.getUTCDate())+"T"+t(e.getUTCHours())+":"+t(e.getUTCMinutes())+":"+t(e.getUTCSeconds())+"."+((e.getUTCMilliseconds()/1e3).toFixed(3)+"").slice(2,5)+"Z"}(),iKey:e,name:"Microsoft.ApplicationInsights."+e.replace(/-/g,"")+"."+t,sampleRate:100,tags:n,data:{baseData:{ver:2}}}}var h=d.url||y.src;if(h){function a(e){var t,n,a,i,r,o,s,c,u,p,l;g=!0,m.queue=[],f||(f=!0,t=h,s=function(){var e={},t=d.connectionString;if(t)for(var n=t.split(";"),a=0;a<n.length;a++){var i=n[a].split("=");2===i.length&&(e[i[0][b]()]=i[1])}if(!e[C]){var r=e.endpointsuffix,o=r?e.location:null;e[C]="https://"+(o?o+".":"")+"dc."+(r||"services.visualstudio.com")}return e}(),c=s[D]||d[D]||"",u=s[C],p=u?u+"/v2/track":d.endpointUrl,(l=[]).push((n="SDK LOAD Failure: Failed to load Application Insights SDK script (See stack for details)",a=t,i=p,(o=(r=v(c,"Exception")).data).baseType="ExceptionData",o.baseData.exceptions=[{typeName:"SDKLoadFailed",message:n.replace(/\./g,"-"),hasFullStack:!1,stack:n+"\nSnippet failed to load ["+a+"] -- Telemetry is disabled\nHelp Link: https://go.microsoft.com/fwlink/?linkid=2128109\nHost: "+(S&&S.pathname||"_unknown_")+"\nEndpoint: "+i,parsedStack:[]}],r)),l.push(function(e,t,n,a){var i=v(c,"Message"),r=i.data;r.baseType="MessageData";var o=r.baseData;return o.message='AI (Internal): 99 message:"'+("SDK LOAD Failure: Failed to load Application Insights SDK script (See stack for details) ("+n+")").replace(/\"/g,"")+'"',o.properties={endpoint:a},i}(0,0,t,p)),function(e,t){if(JSON){var n=T.fetch;if(n&&!y.useXhr)n(t,{method:N,body:JSON.stringify(e),mode:"cors"});else if(XMLHttpRequest){var a=new XMLHttpRequest;a.open(N,t),a.setRequestHeader("Content-type","application/json"),a.send(JSON.stringify(e))}}}(l,p))}function i(e,t){f||setTimeout(function(){!t&&m.core||a()},500)}var e=function(){var n=l.createElement(k);n.src=h;var e=y[w];return!e&&""!==e||"undefined"==n[w]||(n[w]=e),n.onload=i,n.onerror=a,n.onreadystatechange=function(e,t){"loaded"!==n.readyState&&"complete"!==n.readyState||i(0,t)},n}();y.ld<0?l.getElementsByTagName("head")[0].appendChild(e):setTimeout(function(){l.getElementsByTagName(k)[0].parentNode.appendChild(e)},y.ld||0)}try{m.cookie=l.cookie}catch(p){}function t(e){for(;e.length;)!function(t){m[t]=function(){var e=arguments;g||m.queue.push(function(){m[t].apply(m,e)})}}(e.pop())}var n="track",r="TrackPage",o="TrackEvent";t([n+"Event",n+"PageView",n+"Exception",n+"Trace",n+"DependencyData",n+"Metric",n+"PageViewPerformance","start"+r,"stop"+r,"start"+o,"stop"+o,"addTelemetryInitializer","setAuthenticatedUserContext","clearAuthenticatedUserContext","flush"]),m.SeverityLevel={Verbose:0,Information:1,Warning:2,Error:3,Critical:4};var s=(d.extensionConfig||{}).ApplicationInsightsAnalytics||{};if(!0!==d[I]&&!0!==s[I]){var c="onerror";t(["_"+c]);var u=T[c];T[c]=function(e,t,n,a,i){var r=u&&u(e,t,n,a,i);return!0!==r&&m["_"+c]({message:e,url:t,lineNumber:n,columnNumber:a,error:i}),r},d.autoExceptionInstrumented=!0}return m}(y.cfg);function a(){y.onInit&&y.onInit(n)}(T[t]=n).queue&&0===n.queue.length?(n.queue.push(a),n.trackPageView({})):a()}(window,document,{
src: "https://js.monitor.azure.com/scripts/b/ai.2.min.js", // The SDK URL Source
// name: "appInsights", // Global SDK Instance name defaults to "appInsights" when not supplied.
// ld: 0, // Defines the load delay (in ms) before attempting to load the sdk. -1 = block page load and add to head (default) = 0ms load after timeout.
// useXhr: 1, // Use XHR instead of fetch to report failures (if available).
crossOrigin: "anonymous", // When supplied, this will add the provided value as the cross origin attribute on the script tag.
// onInit: null, // Once the Application Insights instance has loaded and initialized, this callback function will be called with 1 argument -- the sdk instance. (DO NOT ADD anything to the sdk.queue -- as they won't get called.)
cfg: { // Application Insights Configuration
    instrumentationKey:"INSTRUMENTATION_KEY",
    endpointUrl: "TelemetryChannel_Endpoint_Address"
}});
</script>
```

> [!NOTE]
> For readability and to reduce possible JavaScript errors, all the possible configuration options are listed on a new line in the preceding snippet code. If you don't want to change the value of a commented line, it can be removed.

# [Python](#tab/python)

For guidance on modifying the ingestion endpoint for the opencensus-python SDK, consult the [opencensus-python repo](https://github.com/census-instrumentation/opencensus-python/blob/af284a92b80bcbaf5db53e7e0813f96691b4c696/contrib/opencensus-ext-azure/opencensus/ext/azure/common/__init__.py).

---

### Regions that require endpoint modification

Currently, the only regions that require endpoint modifications are [Azure Government](../../azure-government/compare-azure-government-global-azure.md#application-insights) and [Azure China](/azure/china/resources-developer-guide).

|Region |  Endpoint name | Value |
|-----------------|:------------|:-------------|
| Azure China | Telemetry Channel | `https://dc.applicationinsights.azure.cn/v2/track` |
| Azure China | QuickPulse (Live Metrics) |`https://live.applicationinsights.azure.cn/QuickPulseService.svc` |
| Azure China | Profile Query |`https://dc.applicationinsights.azure.cn/api/profiles/{0}/appId`  |
| Azure Government | Telemetry Channel |`https://dc.applicationinsights.us/v2/track` |
| Azure Government | QuickPulse (Live Metrics) |`https://quickpulse.applicationinsights.us/QuickPulseService.svc` |
| Azure Government | Profile Query |`https://dc.applicationinsights.us/api/profiles/{0}/appId` |

If you currently use the [Application Insights REST API](/rest/api/application-insights/), which is normally accessed via `api.applicationinsights.io`, you need to use an endpoint that's local to your region.

|Region |  Endpoint name | Value |
|-----------------|:------------|:-------------|
| Azure China | REST API | `api.applicationinsights.azure.cn` |
| Azure Government | REST API | `api.applicationinsights.us`|

## Next steps
* Use [Diagnostic Search](./diagnostic-search.md).
* [Explore metrics](../essentials/metrics-charts.md).
* [Write Log Analytics queries](../logs/log-query-overview.md).
* To learn more about the custom modifications for Azure Government, see the detailed guidance for [Azure monitoring and management](../../azure-government/compare-azure-government-global-azure.md#application-insights).
* To learn more about Azure China, see the [Azure China Playbook](/azure/china/).

<!--Link references-->

[api]: ./api-custom-events-metrics.md
[diagnostic]: ./diagnostic-search.md
[metrics]: ../essentials/metrics-charts.md
[start]: ./app-insights-overview.md
