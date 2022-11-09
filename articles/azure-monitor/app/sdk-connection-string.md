---
title: Connection strings in Application Insights | Microsoft Docs
description: This article shows how to use connection strings.
ms.topic: conceptual
ms.date: 04/13/2022
ms.custom: "devx-track-js, devx-track-csharp"
ms.reviewer: cogoodson
---

# Connection strings

This article shows how to use connection strings.

## Overview

Connection strings define where to send telemetry data.

Key-value pairs provide an easy way for users to define a prefix suffix combination for each Application Insights service or product.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

Don't use a connection string and instrumentation key simultaneously. Whichever was set last will take precedence.

## Scenario overview

Scenarios most affected by this change:

- Firewall exceptions or proxy redirects:

    In cases where monitoring for intranet web server is required, our earlier solution asked you to add individual service endpoints to your configuration. For more information, see the [Azure Monitor FAQ](../faq.yml#can-i-monitor-an-intranet-web-server-). Connection strings offer a better alternative by reducing this effort to a single setting. A simple prefix, suffix amendment, allows automatic population and redirection of all endpoints to the right services.

- Sovereign or hybrid cloud environments:

    Users can send data to a defined [Azure Government region](../../azure-government/compare-azure-government-global-azure.md#application-insights). By using connection strings, you can define endpoint settings for your intranet servers or hybrid cloud settings.

## Get started

Review the following sections to get started.

### Find your connection string

Your connection string appears in the **Overview** section of your Application Insights resource.

:::image type="content" source="media/migrate-from-instrumentation-keys-to-connection-strings/migrate-from-instrumentation-keys-to-connection-strings.png" alt-text="Screenshot that shows the Application Insights overview and connection string." lightbox="media/migrate-from-instrumentation-keys-to-connection-strings/migrate-from-instrumentation-keys-to-connection-strings.png":::

### Schema

Schema elements are explained in the following sections.

#### Max length

The connection has a maximum supported length of 4,096 characters.

#### Key-value pairs

A connection string consists of a list of settings represented as key-value pairs separated by a semicolon:
`key1=value1;key2=value2;key3=value3`

#### Syntax

- `InstrumentationKey` (for example, 00000000-0000-0000-0000-000000000000).
   The connection string is a *required* field.
- `Authorization` (for example, ikey). This setting is optional because today we only support ikey authorization.
- `EndpointSuffix` (for example, applicationinsights.azure.cn).
   Setting the endpoint suffix will instruct the SDK on which Azure cloud to connect to. The SDK will assemble the rest of the endpoint for individual services.
- Explicit endpoints.
  Any service can be explicitly overridden in the connection string:
   - `IngestionEndpoint` (for example, `https://dc.applicationinsights.azure.com`)
   - `LiveEndpoint` (for example, `https://live.applicationinsights.azure.com`)
   - `ProfilerEndpoint` (for example, `https://profiler.monitor.azure.com`)
   - `SnapshotEndpoint` (for example, `https://snapshot.monitor.azure.com`)

#### Endpoint schema

`<prefix>.<suffix>`
- Prefix: Defines a service.
- Suffix: Defines the common domain name.

##### Valid suffixes

- applicationinsights.azure.cn
- applicationinsights.us

For more information, see [Regions that require endpoint modification](./custom-endpoints.md#regions-that-require-endpoint-modification).

##### Valid prefixes

- [Telemetry Ingestion](./app-insights-overview.md): `dc`
- [Live Metrics](./live-stream.md): `live`
- [Profiler](./profiler-overview.md): `profiler`
- [Snapshot](./snapshot-debugger.md): `snapshot`

#### Is the connection string a secret?

The connection string contains an ikey, which is a unique identifier used by the ingestion service to associate telemetry to a specific Application Insights resource. It's not considered a security token or key. If you want to protect your AI resource from misuse, the ingestion endpoint provides authenticated telemetry ingestion options based on Azure Active Directory (Azure AD).

> [!NOTE]
> The Application Insights JavaScript SDK requires the connection string to be passed in during initialization and configuration. It's viewable in plain text in client browsers. There's no easy way to use the Azure AD-based authentication for browser telemetry. We recommend that you consider creating a separate Application Insights resource for browser telemetry if you need to secure the service telemetry.

## Connection string examples

Here are some examples of connection strings.

### Connection string with an endpoint suffix

`InstrumentationKey=00000000-0000-0000-0000-000000000000;EndpointSuffix=ai.contoso.com;`

In this example, the connection string specifies the endpoint suffix and the SDK will construct service endpoints:

- Authorization scheme defaults to "ikey"
- Instrumentation key: 00000000-0000-0000-0000-000000000000
- The regional service URIs are based on the provided endpoint suffix:
   - Ingestion: `https://dc.ai.contoso.com`
   - Live metrics: `https://live.ai.contoso.com`
   - Profiler: `https://profiler.ai.contoso.com`
   - Debugger: `https://snapshot.ai.contoso.com`

### Connection string with explicit endpoint overrides

`InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://custom.com:111/;LiveEndpoint=https://custom.com:222/;ProfilerEndpoint=https://custom.com:333/;SnapshotEndpoint=https://custom.com:444/;`

In this example, the connection string specifies explicit overrides for every service. The SDK will use the exact endpoints provided without modification:

- Authorization scheme defaults to "ikey"
- Instrumentation key: 00000000-0000-0000-0000-000000000000
- The regional service URIs are based on the explicit override values:
   - Ingestion: `https://custom.com:111/`
   - Live metrics: `https://custom.com:222/`
   - Profiler: `https://custom.com:333/`
   - Debugger: `https://custom.com:444/`

### Connection string with an explicit region

`InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://southcentralus.in.applicationinsights.azure.com/`

In this example, the connection string specifies the South Central US region:

- Authorization scheme defaults to "ikey"
- Instrumentation key: 00000000-0000-0000-0000-000000000000
- The regional service URIs are based on the explicit override values:
   - Ingestion: `https://southcentralus.in.applicationinsights.azure.com/`

Run the following command in the [Azure CLI](/cli/azure/account?view=azure-cli-latest#az-account-list-locations&preserve-view=true) to list available regions:

`az account list-locations -o table`

## Set a connection string

Connection strings are supported in the following SDK versions:
- .NET v2.12.0
- Java v2.5.1 and Java 3.0
- JavaScript v2.3.0
- NodeJS v1.5.0
- Python v1.0.0

You can set a connection string in code or by using an environment variable or a configuration file.

### Environment variable

Connection string: `APPLICATIONINSIGHTS_CONNECTION_STRING`

### Code samples

# [.NET/.NetCore](#tab/net)

Set the property [TelemetryConfiguration.ConnectionString](https://github.com/microsoft/ApplicationInsights-dotnet/blob/add45ceed35a817dc7202ec07d3df1672d1f610d/BASE/src/Microsoft.ApplicationInsights/Extensibility/TelemetryConfiguration.cs#L271-L274) or [ApplicationInsightsServiceOptions.ConnectionString](https://github.com/microsoft/ApplicationInsights-dotnet/blob/81288f26921df1e8e713d31e7e9c2187ac9e6590/NETCORE/src/Shared/Extensions/ApplicationInsightsServiceOptions.cs#L66-L69).

.NET explicitly set:
```csharp
var configuration = new TelemetryConfiguration
{
    ConnectionString = "InstrumentationKey=00000000-0000-0000-0000-000000000000;"
};
```

.NET config file:

```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationInsights xmlns="http://schemas.microsoft.com/ApplicationInsights/2013/Settings">
    <ConnectionString>InstrumentationKey=00000000-0000-0000-0000-000000000000</ConnectionString>
</ApplicationInsights>
```

.NET Core explicitly set:
```csharp
public void ConfigureServices(IServiceCollection services)
{
    var options = new ApplicationInsightsServiceOptions { ConnectionString = "InstrumentationKey=00000000-0000-0000-0000-000000000000;" };
    services.AddApplicationInsightsTelemetry(options: options);
}
```

.NET Core config.json:

```json
{
  "ApplicationInsights": {
    "ConnectionString" : "InstrumentationKey=00000000-0000-0000-0000-000000000000;"
    }
  }
```

# [Java](#tab/java)

You can set the connection string in the `applicationinsights.json` configuration file:

```json
{
  "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000"
}
```

For more information, see [Connection string configuration](./java-standalone-config.md#connection-string).

# [JavaScript](#tab/js)

JavaScript doesn't support the use of environment variables.

Using the snippet:

The current snippet is version 5 and is shown here. The version is encoded in the snippet as sv:"#". The [current version is also available on GitHub](https://go.microsoft.com/fwlink/?linkid=2156318).

```html
<script type="text/javascript">
!function(T,l,y){var S=T.location,k="script",D="instrumentationKey",C="ingestionendpoint",I="disableExceptionTracking",E="ai.device.",b="toLowerCase",w="crossOrigin",N="POST",e="appInsightsSDK",t=y.name||"appInsights";(y.name||T[e])&&(T[e]=t);var n=T[t]||function(d){var g=!1,f=!1,m={initialize:!0,queue:[],sv:"5",version:2,config:d};function v(e,t){var n={},a="Browser";return n[E+"id"]=a[b](),n[E+"type"]=a,n["ai.operation.name"]=S&&S.pathname||"_unknown_",n["ai.internal.sdkVersion"]="javascript:snippet_"+(m.sv||m.version),{time:function(){var e=new Date;function t(e){var t=""+e;return 1===t.length&&(t="0"+t),t}return e.getUTCFullYear()+"-"+t(1+e.getUTCMonth())+"-"+t(e.getUTCDate())+"T"+t(e.getUTCHours())+":"+t(e.getUTCMinutes())+":"+t(e.getUTCSeconds())+"."+((e.getUTCMilliseconds()/1e3).toFixed(3)+"").slice(2,5)+"Z"}(),iKey:e,name:"Microsoft.ApplicationInsights."+e.replace(/-/g,"")+"."+t,sampleRate:100,tags:n,data:{baseData:{ver:2}}}}var h=d.url||y.src;if(h){function a(e){var t,n,a,i,r,o,s,c,u,p,l;g=!0,m.queue=[],f||(f=!0,t=h,s=function(){var e={},t=d.connectionString;if(t)for(var n=t.split(";"),a=0;a<n.length;a++){var i=n[a].split("=");2===i.length&&(e[i[0][b]()]=i[1])}if(!e[C]){var r=e.endpointsuffix,o=r?e.location:null;e[C]="https://"+(o?o+".":"")+"dc."+(r||"services.visualstudio.com")}return e}(),c=s[D]||d[D]||"",u=s[C],p=u?u+"/v2/track":d.endpointUrl,(l=[]).push((n="SDK LOAD Failure: Failed to load Application Insights SDK script (See stack for details)",a=t,i=p,(o=(r=v(c,"Exception")).data).baseType="ExceptionData",o.baseData.exceptions=[{typeName:"SDKLoadFailed",message:n.replace(/\./g,"-"),hasFullStack:!1,stack:n+"\nSnippet failed to load ["+a+"] -- Telemetry is disabled\nHelp Link: https://go.microsoft.com/fwlink/?linkid=2128109\nHost: "+(S&&S.pathname||"_unknown_")+"\nEndpoint: "+i,parsedStack:[]}],r)),l.push(function(e,t,n,a){var i=v(c,"Message"),r=i.data;r.baseType="MessageData";var o=r.baseData;return o.message='AI (Internal): 99 message:"'+("SDK LOAD Failure: Failed to load Application Insights SDK script (See stack for details) ("+n+")").replace(/\"/g,"")+'"',o.properties={endpoint:a},i}(0,0,t,p)),function(e,t){if(JSON){var n=T.fetch;if(n&&!y.useXhr)n(t,{method:N,body:JSON.stringify(e),mode:"cors"});else if(XMLHttpRequest){var a=new XMLHttpRequest;a.open(N,t),a.setRequestHeader("Content-type","application/json"),a.send(JSON.stringify(e))}}}(l,p))}function i(e,t){f||setTimeout(function(){!t&&m.core||a()},500)}var e=function(){var n=l.createElement(k);n.src=h;var e=y[w];return!e&&""!==e||"undefined"==n[w]||(n[w]=e),n.onload=i,n.onerror=a,n.onreadystatechange=function(e,t){"loaded"!==n.readyState&&"complete"!==n.readyState||i(0,t)},n}();y.ld<0?l.getElementsByTagName("head")[0].appendChild(e):setTimeout(function(){l.getElementsByTagName(k)[0].parentNode.appendChild(e)},y.ld||0)}try{m.cookie=l.cookie}catch(p){}function t(e){for(;e.length;)!function(t){m[t]=function(){var e=arguments;g||m.queue.push(function(){m[t].apply(m,e)})}}(e.pop())}var n="track",r="TrackPage",o="TrackEvent";t([n+"Event",n+"PageView",n+"Exception",n+"Trace",n+"DependencyData",n+"Metric",n+"PageViewPerformance","start"+r,"stop"+r,"start"+o,"stop"+o,"addTelemetryInitializer","setAuthenticatedUserContext","clearAuthenticatedUserContext","flush"]),m.SeverityLevel={Verbose:0,Information:1,Warning:2,Error:3,Critical:4};var s=(d.extensionConfig||{}).ApplicationInsightsAnalytics||{};if(!0!==d[I]&&!0!==s[I]){var c="onerror";t(["_"+c]);var u=T[c];T[c]=function(e,t,n,a,i){var r=u&&u(e,t,n,a,i);return!0!==r&&m["_"+c]({message:e,url:t,lineNumber:n,columnNumber:a,error:i}),r},d.autoExceptionInstrumented=!0}return m}(y.cfg);function a(){y.onInit&&y.onInit(n)}(T[t]=n).queue&&0===n.queue.length?(n.queue.push(a),n.trackPageView({})):a()}(window,document,{
src: "https://js.monitor.azure.com/scripts/b/ai.2.min.js", // The SDK URL Source
// name: "appInsights", // Global SDK Instance name defaults to "appInsights" when not supplied
// ld: 0, // Defines the load delay (in ms) before attempting to load the sdk. -1 = block page load and add to head. (default) = 0ms load after timeout,
// useXhr: 1, // Use XHR instead of fetch to report failures (if available),
crossOrigin: "anonymous", // When supplied this will add the provided value as the cross origin attribute on the script tag
// onInit: null, // Once the application insights instance has loaded and initialized this callback function will be called with 1 argument -- the sdk instance (DO NOT ADD anything to the sdk.queue -- as they won't get called)
cfg: { // Application Insights Configuration
  connectionString:"InstrumentationKey=00000000-0000-0000-0000-000000000000;"
}});
</script>
```

> [!NOTE]
> For readability and to reduce possible JavaScript errors, all the possible configuration options are listed on a new line in the preceding snippet code. If you don't want to change the value of a commented line, it can be removed.

Manual setup:
```javascript
import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const appInsights = new ApplicationInsights({ config: {
  connectionString: 'InstrumentationKey=00000000-0000-0000-0000-000000000000;'
  /* ...Other Configuration Options... */
} });
appInsights.loadAppInsights();
appInsights.trackPageView();
```

# [Node.js](#tab/nodejs)

```javascript
const appInsights = require("applicationinsights");
appInsights.setup("InstrumentationKey=00000000-0000-0000-0000-000000000000;");
appInsights.start();
```

# [Python](#tab/python)

We recommend that users set the environment variable.

To explicitly set the connection string:

```python
from opencensus.ext.azure.trace_exporter import AzureExporter
from opencensus.trace.samplers import ProbabilitySampler
from opencensus.trace.tracer import Tracer

tracer = Tracer(exporter=AzureExporter(connection_string='InstrumentationKey=00000000-0000-0000-0000-000000000000'), sampler=ProbabilitySampler(1.0))
```

---

## Next steps

Get started at runtime with:

* [Azure VM and Azure Virtual Machine Scale Sets IIS-hosted apps](./azure-vm-vmss-apps.md)
* [IIS server](./status-monitor-v2-overview.md)
* [Web Apps feature of Azure App Service](./azure-web-apps.md)

Get started at development time with:

* [ASP.NET](./asp-net.md)
* [ASP.NET Core](./asp-net-core.md)
* [Java](./java-in-process-agent.md)
* [Node.js](./nodejs.md)
* [Python](./opencensus-python.md)
