---
title: Azure Application Insights override default SDK endpoints
description: Modify default Azure Monitor Application Insights SDK endpoints for regions like Azure Government.
ms.topic: conceptual
ms.date: 07/26/2019
ms.custom: references_regions
---

# Application Insights overriding default endpoints

To send data from Application Insights to certain regions, you'll need to override the default endpoint addresses. Each SDK requires slightly different modifications, all of which are described in this article. These changes require adjusting the sample code and replacing the placeholder values for `QuickPulse_Endpoint_Address`, `TelemetryChannel_Endpoint_Address`, and `Profile_Query_Endpoint_address` with the actual endpoint addresses for your specific region. The end of this article contains links to the endpoint addresses for regions where this configuration is required.

> [!NOTE]
> [Connection strings](https://docs.microsoft.com/azure/azure-monitor/app/sdk-connection-string?tabs=net) are the new preferred method of setting custom endpoints within Application Insights.

---

## SDK code changes

# [.NET](#tab/net)

> [!NOTE]
> The applicationinsights.config file is automatically overwritten anytime a SDK upgrade is performed. After performing an SDK upgrade be sure to re-enter the region specific endpoint values.

```xml
<ApplicationInsights>
  ...
  <TelemetryModules>
    <Add Type="Microsoft.ApplicationInsights.Extensibility.PerfCounterCollector.QuickPulse.QuickPulseTelemetryModule, Microsoft.AI.PerfCounterCollector">
      <QuickPulseServiceEndpoint>Custom_QuickPulse_Endpoint_Address</QuickPulseServiceEndpoint>
    </Add>
  </TelemetryModules>
    ...
  <TelemetryChannel>
     <EndpointAddress>TelemetryChannel_Endpoint_Address</EndpointAddress>
  </TelemetryChannel>
  ...
  <ApplicationIdProvider Type="Microsoft.ApplicationInsights.Extensibility.Implementation.ApplicationId.ApplicationInsightsApplicationIdProvider, Microsoft.ApplicationInsights">
    <ProfileQueryEndpoint>Profile_Query_Endpoint_address</ProfileQueryEndpoint>
  </ApplicationIdProvider>
  ...
</ApplicationInsights>
```

# [.NET Core](#tab/netcore)

Modify the appsettings.json file in your project as follows to adjust the main endpoint:

```json
"ApplicationInsights": {
    "InstrumentationKey": "instrumentationkey",
    "TelemetryChannel": {
      "EndpointAddress": "TelemetryChannel_Endpoint_Address"
    }
  }
```

The values for Live Metrics and the Profile Query Endpoint can only be set via code. To override the default values for all endpoint values via code, make the following changes in the `ConfigureServices` method of the `Startup.cs` file:

```csharp
using Microsoft.ApplicationInsights.Extensibility.Implementation.ApplicationId;
using Microsoft.ApplicationInsights.Extensibility.PerfCounterCollector.QuickPulse; //Place at top of Startup.cs file

   services.ConfigureTelemetryModule<QuickPulseTelemetryModule>((module, o) => module.QuickPulseServiceEndpoint="QuickPulse_Endpoint_Address");

   services.AddSingleton<IApplicationIdProvider, ApplicationInsightsApplicationIdProvider>(_ => new ApplicationInsightsApplicationIdProvider() { ProfileQueryEndpoint = "Profile_Query_Endpoint_address" });

   services.AddSingleton<ITelemetryChannel>(_ => new ServerTelemetryChannel() { EndpointAddress = "TelemetryChannel_Endpoint_Address" });

    //Place in the ConfigureServices method. Place this before services.AddApplicationInsightsTelemetry("instrumentation key"); if it's present
```

# [Azure Functions](#tab/functions)

For Azure Functions it is now recommended to use [connection strings](https://docs.microsoft.com/azure/azure-monitor/app/sdk-connection-string?tabs=net) set in the Function's Application settings. To access Application settings for your function from within the functions pane select **Settings** > **Configuration** > **Application settings**. 

Name: `APPLICATIONINSIGHTS_CONNECTION_STRING`
Value: `Connection String Value`

# [Java](#tab/java)

Modify the applicationinsights.xml file to change the default endpoint address.

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
Instrumentation Key: "APPINSIGHTS_INSTRUMENTATIONKEY"
Profile Endpoint: "Profile_Query_Endpoint_address"
Live Metrics Endpoint: "QuickPulse_Endpoint_Address"
```

# [JavaScript](#tab/js)

```javascript
<script type="text/javascript">
    var sdkInstance="appInsightsSDK";window[sdkInstance]="appInsights";var aiName=window[sdkInstance],aisdk=window[aiName]||function(e){function n(e){t[e]=function(){var n=arguments;t.queue.push(function(){t[e].apply(t,n)})}}var t={config:e};t.initialize=!0;var i=document,a=window;setTimeout(function(){var n=i.createElement("script");n.src=e.url||"https://az416426.vo.msecnd.net/scripts/b/ai.2.min.js",i.getElementsByTagName("script")[0].parentNode.appendChild(n)});try{t.cookie=i.cookie}catch(e){}t.queue=[],t.version=2;for(var r=["Event","PageView","Exception","Trace","DependencyData","Metric","PageViewPerformance"];r.length;)n("track"+r.pop());n("startTrackPage"),n("stopTrackPage");var s="Track"+r[0];if(n("start"+s),n("stop"+s),n("setAuthenticatedUserContext"),n("clearAuthenticatedUserContext"),n("flush"),!(!0===e.disableExceptionTracking||e.extensionConfig&&e.extensionConfig.ApplicationInsightsAnalytics&&!0===e.extensionConfig.ApplicationInsightsAnalytics.disableExceptionTracking)){n("_"+(r="onerror"));var o=a[r];a[r]=function(e,n,i,a,s){var c=o&&o(e,n,i,a,s);return!0!==c&&t["_"+r]({message:e,url:n,lineNumber:i,columnNumber:a,error:s}),c},e.autoExceptionInstrumented=!0}return t}(
    {
      instrumentationKey:"INSTRUMENTATION_KEY",
      endpointUrl: "TelemetryChannel_Endpoint_Address"
    }
    );window[aiName]=aisdk,aisdk.queue&&0===aisdk.queue.length&&aisdk.trackPageView({});
</script>
```

# [Python](#tab/python)

For guidance on modifying the ingestion endpoint for the opencensus-python SDK consult the [opencensus-python repo.](https://github.com/census-instrumentation/opencensus-python/blob/af284a92b80bcbaf5db53e7e0813f96691b4c696/contrib/opencensus-ext-azure/opencensus/ext/azure/common/__init__.py)

---

## Regions that require endpoint modification

Currently the only regions that require endpoint modifications are [Azure Government](https://docs.microsoft.com/azure/azure-government/documentation-government-services-monitoringandmanagement#application-insights) and [Azure China](https://docs.microsoft.com/azure/china/resources-developer-guide).

|Region |  Endpoint Name | Value |
|-----------------|:------------|:-------------|
| Azure China | Telemetry Channel | `https://dc.applicationinsights.azure.cn/v2/track` |
| Azure China | QuickPulse (Live Metrics) |`https://live.applicationinsights.azure.cn/QuickPulseService.svc` |
| Azure China | Profile Query |`https://dc.applicationinsights.azure.cn/api/profiles/{0}/appId`  |
| Azure Government | Telemetry Channel |`https://dc.applicationinsights.us/v2/track` |
| Azure Government | QuickPulse (Live Metrics) |`https://quickpulse.applicationinsights.us/QuickPulseService.svc` |
| Azure Government | Profile Query |`https://dc.applicationinsights.us/api/profiles/{0}/appId` |

If you currently use the [Application Insights REST API](https://dev.applicationinsights.io/
) which is normally accessed via `api.applicationinsights.io' you will need to use an endpoint that is local to your region:

|Region |  Endpoint Name | Value |
|-----------------|:------------|:-------------|
| Azure China | REST API | `api.applicationinsights.azure.cn` |
| Azure Government | REST API | `api.applicationinsights.us`|

> [!NOTE]
> Codeless agent/extension based monitoring for Azure App Services is **currently not supported** in these regions. As soon as this functionality becomes available this article will be updated.

## Next steps

- To learn more about the custom modifications for Azure Government, consult the detailed guidance for [Azure monitoring and management](https://docs.microsoft.com/azure/azure-government/documentation-government-services-monitoringandmanagement#application-insights).
- To learn more about Azure China, consult the [Azure China Playbook](https://docs.microsoft.com/azure/china/).
