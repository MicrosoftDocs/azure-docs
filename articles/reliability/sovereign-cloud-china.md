---
title: Availability of services for Microsoft Azure operated by 21Vianet
description: Learn how services are supported for Microsoft Azure operated by 21Vianet
author: anaharris-ms
ms.service: azure
ms.topic: conceptual
ms.date: 10/27/2022
ms.author: anaharris
ms.reviewer: cynthn
ms.custom: references_regions, subject-reliability
---

# Availability of services for Microsoft Azure operated by 21Vianet

Azure operated by 21Vianet is a physically separated instance of cloud services located in China. It's independently operated and transacted by Shanghai Blue Cloud Technology Co., Ltd. ("21Vianet"), a wholly owned subsidiary of Beijing 21Vianet Broadband Data Center Co., Ltd..


## Service availability

Microsoft's goal for Azure in China is to match service availability in Azure. For service availability for Azure in China, see [Products available by China regions](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=all&regions=china-non-regional,china-east,china-east-2,china-east-3,china-north,china-north-2,china-north-3&rar=true). 

### AI + machine learning

This section outlines variations and considerations when using Azure Bot Service, Azure Machine Learning, and Azure AI services.

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
|Azure Machine Learning| See [Azure Machine Learning feature availability across Azure in China cloud regions](../machine-learning/reference-machine-learning-cloud-parity.md#azure-operated-by-21vianet). | |
| Azure AI Speech| See [Azure AI services: Azure in China - Speech service](../ai-services/speech-service/sovereign-clouds.md?tabs=c-sharp.md#microsoft-azure-operated-by-21vianet)  ||
| Azure AI Speech|For feature variations and limitations, including API endpoints, see [Translator in sovereign clouds](../ai-services/translator/sovereign-clouds.md?tabs=china).|

### Azure AD External Identities

This section outlines variations and considerations when using Azure AD External Identities B2B collaboration.  

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
| Azure AD External Identities | For Azure AD External Identities B2B feature variations in Microsoft Azure for customers in China, see [Azure AD B2B in national clouds](../active-directory/external-identities/b2b-government-national-clouds.md) and [Microsoft cloud settings (Preview)](../active-directory/external-identities/cross-cloud-settings.md).  |

### Media

This section outlines variations and considerations when using Media services.

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
| Azure Media Services | For Azure Media Services v3 feature variations in Microsoft Azure for customers in China, see [Azure Media Services v3 clouds and regions availability](/azure/media-services/latest/azure-clouds-regions#china).  | 

### Microsoft Authentication Library (MSAL) 

This section outlines variations and considerations when using Microsoft Authentication Library (MSAL) services. 

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
| Microsoft Authentication Library (MSAL)  | For feature variations and limitations, see [National clouds and MSAL](../active-directory/develop/msal-national-cloud.md).  |  

### Networking

This section outlines variations and considerations when using Networking services. 

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
| Private Link| <li>For Private Link services availability, see [Azure Private Link availability](../private-link/availability.md).<li>For Private DNS zone names, see [Azure Private Endpoint DNS configuration](../private-link/private-endpoint-dns.md#government). |

### Security

This section outlines variations and considerations when using Security services. 

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
| Microsoft Sentinel| For Microsoft Sentinel availability, see [Microsoft Sentinel availability](../sentinel/feature-availability.md). |

### Azure Container Apps

This section outlines variations and considerations when using Azure Container Apps services. 

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
| Azure Monitor| The Azure Monitor integration is not supported in Azure China |

### Azure China Commercial Marketplace operated by 21Vianet
 
To learn which commercial marketplace features are available in Azure China Commercial Marketplace operated by 21Vianet, as compared to the Azure global commercial marketplace, see [Feature availability for Azure China Commercial Marketplace operated by 21Vianet](/partner-center/marketplace/azure-in-china-feature-availability).
### Microsoft Cost Management + Billing

This section outlines variations and considerations when using Microsoft Cost Management + Billing features and APIs.


#### Azure Retail Rates API for China

The [Azure Retail Prices API for China](/rest/api/cost-management/retail-prices/azure-retail-prices-china) article is applicable only to Azure in China and isn't available in Azure Global.

#### Markup - China

The [Markup - China](../cost-management-billing/manage/markup-china.md) article is applicable only to Azure operated by 21Vianet and isn't available in Azure Global.

## Azure in China Account Sign in

The table below lists ways to connect to your Azure account in Azure Global vs. Azure in China.


| Sign in description | Azure Global | Azure in China |
|--------------|-----------|------| 
| Sign into Azure with an authenticated account for use with Azure Resource Manager| Connect-AzureAccount | Connect-AzureAccount -Environment AzureChinaCloud|
| Sign into Azure Active Directory with Microsoft Graph PowerShell | Connect-MgGraph | Connect-MgGraph -AzureEnvironment China|
| Sign into your Azure classic portal account | Add-AzureAccount | Add-AzureAccount -Environment AzureChinaCloud |

## Azure in China REST endpoints

The table below lists API endpoints in Azure Global vs. Azure in China for accessing and managing some of the more common services. 

For IP rangers for Azure in China, download [Azure Datacenter IP Ranges in China](https://www.microsoft.com/download/confirmation.aspx?id=57062).

| Service category | Azure Global | Azure in China |
|-|-|-|
| Azure (in general) | \*.windows.net | \*.chinacloudapi.cn |
| Azure Active Directory	| `https://login.microsoftonline.com`	 | `https://login.chinacloudapi.cn` |
| Azure App Configuration | \*.azconfig.io | \*.azconfig.azure.cn |
| Azure compute | \*.cloudapp.net | \*.chinacloudapp.cn |
| Azure data  |	`https://{location}.experiments.azureml.net`	| `https://{location}.experiments.ml.azure`.cn |
| Azure storage | \*.blob.core.windows.net \*.queue.core.windows.net \*.table.core.windows.net  \*.dfs.core.windows.net | \*.blob.core.chinacloudapi.cn \*.queue.core.chinacloudapi.cn \*.table.core.chinacloudapi.cn   \*.dfs.core.chinacloudapi.cn|
| Azure management|	`https://management.azure.com/` |	`https://management.chinacloudapi.cn/` |
| Azure service management | https://management.core.windows.net | [https://management.core.chinacloudapi.cn](https://management.core.chinacloudapi.cn/) |
| Azure Resource Manager | [https://management.azure.com](https://management.azure.com/) | [https://management.chinacloudapi.cn](https://management.chinacloudapi.cn/) |
| Azure portal | [https://portal.azure.com](https://portal.azure.com/) | [https://portal.azure.cn](https://portal.azure.cn/) |
| SQL Database | \*.database.windows.net | \*.database.chinacloudapi.cn |
| SQL Azure DB management API | `https://management.database.windows.net` | `https://management.database.chinacloudapi.cn` |
| Azure Service Bus | \*.servicebus.windows.net | \*.servicebus.chinacloudapi.cn |
| Azure SignalR Service| \*.service.signalr.net | \*.signalr.azure.cn |
| Azure Time Series Insights | \*.timeseries.azure.com \*.insights.timeseries.azure.cn | \*.timeseries.azure.cn \*.insights.timeseries.azure.cn |
| Azure Access Control Service | \*.accesscontrol.windows.net | \*.accesscontrol.chinacloudapi.cn |
| Azure HDInsight | \*.azurehdinsight.net | \*.azurehdinsight.cn |
| SQL DB import/export service endpoint | |  1. China East `https://sh1prod-dacsvc.chinacloudapp.cn/dacwebservice.svc` <br>2. China North `https://bj1prod-dacsvc.chinacloudapp.cn/dacwebservice.svc` |
| MySQL PaaS | | \*.mysqldb.chinacloudapi.cn |
| Azure Service Fabric cluster | \*.cloudapp.azure.com | \*.chinaeast.chinacloudapp.cn |
| Azure Spring Cloud| \*.azuremicroservices.io | \*.microservices.azure.cn |
| Azure Active Directory (Azure AD) | \*.onmicrosoft.com | \*.partner.onmschina.cn |
| Azure AD logon | [https://login.microsoftonline.com](https://login.windows.net/) | [https://login.partner.microsoftonline.cn](https://login.chinacloudapi.cn/) |
| Microsoft Graph | [https://graph.microsoft.com](https://graph.microsoft.com/) | [https://microsoftgraph.chinacloudapi.cn](https://microsoftgraph.chinacloudapi.cn/) |
| Azure AI services | `https://api.projectoxford.ai/face/v1.0` | `https://api.cognitive.azure.cn/face/v1.0` |
| Azure Bot Services | <\*.botframework.com> | <\*.botframework.azure.cn> |
| Azure Key Vault API | \*.vault.azure.net | \*.vault.azure.cn |
| Azure Container Apps Default Domain | \*.azurecontainerapps.io | No default domain is provided for external environment. The [custom domain](/azure/container-apps/custom-domains-certificates) is required.  |
| Azure Container Apps Event Stream Endpoint | \<region\>.azurecontainerapps.dev | \<region\>.chinanorth3.azurecontainerapps-dev.cn  |

### Application Insights

> [!NOTE]
> Codeless agent/extension based monitoring for Azure App Services is **currently not supported**. Snapshot Debugger is also not currently available. 

### SDK endpoint modifications

In order to send data from Application Insights in this region, you will need to modify the default endpoint addresses that are used by the Application Insights SDKs. Each SDK requires slightly different modifications.

### .NET with applicationinsights.config

```xml
<ApplicationInsights>
  ...
  <TelemetryModules>
    <Add Type="Microsoft.ApplicationInsights.Extensibility.PerfCounterCollector.QuickPulse.QuickPulseTelemetryModule, Microsoft.AI.PerfCounterCollector">
      <QuickPulseServiceEndpoint>https://quickpulse.applicationinsights.azure.cn/QuickPulseService.svc</QuickPulseServiceEndpoint>
    </Add>
  </TelemetryModules>
    ...
  <TelemetryChannel>
     <EndpointAddress>https://dc.applicationinsights.azure.cn/v2/track</EndpointAddress>
  </TelemetryChannel>
  ...
  <ApplicationIdProvider Type="Microsoft.ApplicationInsights.Extensibility.Implementation.ApplicationId.ApplicationInsightsApplicationIdProvider, Microsoft.ApplicationInsights">
    <ProfileQueryEndpoint>https://dc.applicationinsights.azure.cn/api/profiles/{0}/appId</ProfileQueryEndpoint>
  </ApplicationIdProvider>
  ...
</ApplicationInsights>
```

### .NET Core

Modify the appsettings.json file in your project as follows to adjust the main endpoint:

```json
"ApplicationInsights": {
    "InstrumentationKey": "instrumentationkey",
    "TelemetryChannel": {
      "EndpointAddress": "https://dc.applicationinsights.azure.cn/v2/track"
    }
  }
```

The values for Live Metrics and the Profile Query Endpoint can only be set via code. To override the default values for all endpoint values via code, make the following changes in the `ConfigureServices` method of the `Startup.cs` file:

```csharp
using Microsoft.ApplicationInsights.Extensibility.Implementation.ApplicationId;
using Microsoft.ApplicationInsights.Extensibility.PerfCounterCollector.QuickPulse; //place at top of Startup.cs file

   services.ConfigureTelemetryModule<QuickPulseTelemetryModule>((module, o) => module.QuickPulseServiceEndpoint="https://quickpulse.applicationinsights.azure.cn/QuickPulseService.svc");

   services.AddSingleton(new ApplicationInsightsApplicationIdProvider() { ProfileQueryEndpoint = "https://dc.applicationinsights.azure.cn/api/profiles/{0}/appId" }); 

   services.AddSingleton<ITelemetryChannel>(new ServerTelemetryChannel() { EndpointAddress = "https://dc.applicationinsights.azure.cn/v2/track" });

    //place in ConfigureServices method. If present, place this prior to   services.AddApplicationInsightsTelemetry("instrumentation key");
```

### Java

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
  <EndpointAddress>https://dc.applicationinsights.azure.cn/v2/track</EndpointAddress>
  </Channel>
</ApplicationInsights>
```

### Spring Boot

Modify the `application.properties` file and add:

```yaml
azure.application-insights.channel.in-process.endpoint-address= https://dc.applicationinsights.azure.cn/v2/track
```

### Node.js

```javascript
var appInsights = require("applicationinsights");
appInsights.setup('INSTRUMENTATION_KEY');
appInsights.defaultClient.config.endpointUrl = "https://dc.applicationinsights.azure.cn/v2/track"; // ingestion
appInsights.defaultClient.config.profileQueryEndpoint = "https://dc.applicationinsights.azure.cn/api/profiles/{0}/appId"; // appid/profile lookup
appInsights.defaultClient.config.quickPulseHost = "https://quickpulse.applicationinsights.azure.cn/QuickPulseService.svc"; //live metrics
appInsights.Configuration.start();
```

The endpoints can also be configured through environment variables:

```
Instrumentation Key: “APPINSIGHTS_INSTRUMENTATIONKEY”
Profile Endpoint: “https://dc.applicationinsights.azure.cn/api/profiles/{0}/appId”
Live Metrics Endpoint: "https://quickpulse.applicationinsights.azure.cn/QuickPulseService.svc"
```

### JavaScript

```javascript
<script type="text/javascript">
var sdkInstance="appInsightsSDK";window[sdkInstance]="appInsights";var aiName=window[sdkInstance],aisdk=window[aiName]||function(e){function n(e){i[e]=function(){var n=arguments;i.queue.push(function(){i[e].apply(i,n)})}}var i={config:e};i.initialize=!0;var a=document,t=window;setTimeout(function(){var n=a.createElement("script");n.src=e.url||"https://az416426.vo.msecnd.net/next/ai.2.min.js",a.getElementsByTagName("script")[0].parentNode.appendChild(n)});try{i.cookie=a.cookie}catch(e){}i.queue=[],i.version=2;for(var r=["Event","PageView","Exception","Trace","DependencyData","Metric","PageViewPerformance"];r.length;)n("track"+r.pop());n("startTrackPage"),n("stopTrackPage");var o="Track"+r[0];if(n("start"+o),n("stop"+o),!(!0===e.disableExceptionTracking||e.extensionConfig&&e.extensionConfig.ApplicationInsightsAnalytics&&!0===e.extensionConfig.ApplicationInsightsAnalytics.disableExceptionTracking)){n("_"+(r="onerror"));var s=t[r];t[r]=function(e,n,a,t,o){var c=s&&s(e,n,a,t,o);return!0!==c&&i["_"+r]({message:e,url:n,lineNumber:a,columnNumber:t,error:o}),c},e.autoExceptionInstrumented=!0}return i}
(
	{
	instrumentationKey:"INSTRUMENTATION_KEY",
	endpointUrl: "https://dc.applicationinsights.azure.cn/v2/track"
  }
);
window[aiName]=aisdk,aisdk.queue&&0===aisdk.queue.length&&aisdk.trackPageView({});
</script>

```

## Remote Management

### Azure portal

You can sign in to the [Azure portal](https://portal.azure.cn/?l=en.en-us) to manage workloads in Azure operated by 21Vianet anywhere globally.

### Work with administrator roles

One account administrator role is created per Azure account, typically the person who signed up for or bought the Azure subscription. This role is authorized to use the [Account Center](https://account.windowsazure.cn/Home/Index/en-us) to perform management tasks.

To sign in, the account administrator uses the organization ID (Org ID) created when the subscription was purchased.

### Create a service administrator to manage the service deployment

One service administrator role is created per Azure account, and is authorized to manage services in the Azure portal. With a new subscription, the account administrator is also the service administrator.

### Create a co-administrator

Account administrators can create up to 199 co-administrator roles per subscription. This role has the same access privileges as the service administrator, but can't change the association of subscriptions to Azure directories.
