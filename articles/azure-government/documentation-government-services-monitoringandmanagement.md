---
title: Azure Government Monitoring + Management | Microsoft Docs
description: This provides a comparison of features and guidance on developing applications for Azure Government.
services: azure-government
cloud: gov
author: gsacavdm
ms.assetid: 4b7720c1-699e-432b-9246-6e49fb77f497
ms.service: azure-government
ms.topic: article
ms.workload: azure-government
ms.date: 04/22/2019
ms.author: gsacavdm

---
# Azure Government Monitoring + Management
This article outlines the monitoring and management services variations and considerations for the Azure Government environment.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Advisor
Advisor is generally available in Azure Government.

For more information, see [Advisor public documentation](../advisor/advisor-overview.md).

### Variations
The following Advisor recommendations are not currently available in Azure Government:

* High Availability
  * Configure your VPN gateway to active-active for connection resilience
  * Create Azure Service Health alerts to be notified when Azure issues affect you
  * Configure Traffic Manager endpoints for resiliency
  * Use soft delete for your Azure Storage Account
* Performance
  * Improve App Service performance and reliability
  * Reduce DNS time to live on your Traffic Manager profile to fail over to healthy endpoints faster
  * Improve SQL Data Warehouse performance
  * Use Premium Storage
  * Migrate your Storage Account to Azure Resource Manager
* Cost
  * Buy reserved virtual machines instances to save money over pay-as-you-go costs
  * Eliminate unprovisioned ExpressRoute circuits
  * Delete or reconfigure idle virtual network gateways

The calculation used to recommend that you should right-size or shut down underutilized virtual machines is as follows in Azure Government:

Advisor monitors your virtual machine usage for 7 days and identifies low-utilization virtual machines. Virtual machines are considered low-utilization if their CPU utilization is 5% or less and their network utilization is less than 2% or if the current workload can be accommodated by a smaller virtual machine size. If you want to be more aggressive at identifying underutilized virtual machines, you can adjust the CPU utilization rule on a per subscription basis.

## Automation
Automation is generally available in Azure Government.

For more information, see [Automation public documentation](../automation/automation-intro.md).

## Azure Migrate

Azure Migrate is generally available in Azure Government.

For more information, see [Azure Migrate documentation](../migrate/migrate-overview.md).

### Variations
The following Azure Migrate features are currently not available in Azure Government:

* Dependency visualization functionality is not available in Azure Government as Azure Migrate depends on Service Map for dependency visualization which is currently unavailable in Azure Government.
* You can only create assessments for Azure Government as target regions and using Azure Government offers.

## Backup
Backup is generally available in Azure Government.

For more information, see [Azure Government Backup](documentation-government-services-backup.md).

## Policy
Policy is generally available in Azure Government.

For more information, see [Azure Policy](../governance/policy/overview.md).

## Site Recovery
Azure Site Recovery is generally available in Azure Government.

For more information, see [Site Recovery commercial documentation](../site-recovery/site-recovery-overview.md).

### Variations
The following Site Recovery features are not currently available in Azure Government:
* Email notification

| Site Recovery | Classic | Resource Manager |
| --- | --- | --- |
| VMware/Physical  | GA | GA |
| Hyper-V | GA | GA |
| Site to Site | GA | GA |

The following URLs for Site Recovery are different in Azure Government:

| Azure Public | Azure Government | Notes |
| --- | --- | --- |
| \*.hypervrecoverymanager.windowsazure.com | \*.hypervrecoverymanager.windowsazure.us | Access to the Site Recovery Service |
| \*.backup.windowsazure.com  | \*.backup.windowsazure.us | Access to Protection Service |
| \*.blob.core.windows.net | \*.blob.core.usgovcloudapi.net | For storing the VM Snapshots |
| https://cdn.mysql.com/archives/mysql-5.5/mysql-5.5.37-win32.msi | https://cdn.mysql.com/archives/mysql-5.5/mysql-5.5.37-win32.msi | To download MySQL |

## Monitor
Azure Monitor is generally available in Azure Government.

For more information, see [Monitor commercial documentation](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview).

### Variations
The following sections detail differences and workarounds for features of Azure Monitor in Azure Government:

#### Action Groups
Action Groups are generally available in Azure Government with no differences from commercial Azure.   

#### Activity Log Alerts
Activity Log Alerts are generally available in Azure Government with no differences from commercial Azure.

#### Alerts Experience
The unified alerts UI experience is available for metric and log alerts in Azure Government.

#### Autoscale
Autoscale is generally available in Azure Government.

If you are using PowerShell/ARM/REST calls to specify settings, set the "Location" of the Autoscale to "USGov Virginia" or "USGov Iowa". The resource targeted by Autoscale can exist in any region. An example of the setting is below:

```powershell
$rule1 = New-AzAutoscaleRule -MetricName "Requests" -MetricResourceId "/subscriptions/S1/resourceGroups/RG1/providers/Microsoft.Web/sites/WebSite1" -Operator GreaterThan -MetricStatistic Average -Threshold 10 -TimeGrain 00:01:00 -ScaleActionCooldown 00:05:00 -ScaleActionDirection Increase -ScaleActionScaleType ChangeCount -ScaleActionValue "1"
$rule2 = New-AzAutoscaleRule -MetricName "Requests" -MetricResourceId "/subscriptions/S1/resourceGroups/RG1/providers/Microsoft.Web/sites/WebSite1" -Operator GreaterThan -MetricStatistic Average -Threshold 10 -TimeGrain 00:01:00 -ScaleActionCooldown 00:10:00 -ScaleActionDirection Increase -ScaleActionScaleType ChangeCount -ScaleActionValue "2"
$profile1 = New-AzAutoscaleProfile -DefaultCapacity 2 -MaximumCapacity 10 -MinimumCapacity 2 -Rules $rule1, $rule2 -Name "MyProfile"
$webhook_scale = New-AzAutoscaleWebhook -ServiceUri https://example.com?mytoken=mytokenvalue
$notification1= New-AzAutoscaleNotification -CustomEmails myname@company.com -SendEmailToSubscriptionAdministrator -SendEmailToSubscriptionCoAdministrators -Webhooks $webhook_scale
Add-AzAutoscaleSetting -Location "USGov Virginia" -Name "MyScaleVMSSSetting" -ResourceGroup sdubeys-usgv -TargetResourceId /subscriptions/s1/resourceGroups/rg1/providers/Microsoft.Web/serverFarms/ServerFarm1 -AutoscaleProfiles $profile1 -Notifications $notification1
```

If you are interested in implementing autoscale on your resources, use PowerShell/ARM/Rest calls to specify the settings.

For more information on using PowerShell, see [public documentation](https://docs.microsoft.com/azure/monitoring-and-diagnostics/insights-powershell-samples#create-and-manage-autoscale-settings).

#### Metrics
Metrics are generally available in Azure Government. However, multi-dimensional metrics are supported only via the REST API. The ability to [show multi-dimensional metrics](../azure-monitor/platform/metrics-charts.md) is in preview in the Azure Government portal.

#### Metric Alerts
The first generation of metrics alerts is generally available in both Azure Government and commercial Azure. The first generation is called *Alerts (Classic)*.  The second generation of metric alerts (also called the [unified alerts experience](../azure-monitor/platform/alerts-overview.md)) is now also available, but with a reduced set of resource providers [compared to the public cloud](../azure-monitor/platform/alerts-metric-near-real-time.md). More will be added over time. 

The resources currently supported in the second generation alerts experience are:
- Microsoft.Compute/virtualMachines
- Microsoft.OperationalInsights/workspaces
- Microsoft.PowerBIDedicated/capacities
- Microsoft.Storage/accounts

You can still use [classic alerts](../azure-monitor/platform/alerts-classic.overview.md) for resources not yet available in the second generation of alerts. 

When using PowerShell/ARM/Rest calls to create metric alerts, you will need to set the "Location" of the metric alert to "USGov Virginia" or "USGov Iowa". An example of the setting is below:

```powershell
$actionEmail = New-AzAlertRuleEmail -CustomEmail myname@company.com
$actionWebhook = New-AzAlertRuleWebhook -ServiceUri https://example.com?token=mytoken
Add-AzMetricAlertRule -Name vmcpu_gt_1 -Location "USGov Virginia" -ResourceGroup myrg1 -TargetResourceId /subscriptions/s1/resourceGroups/myrg1/providers/Microsoft.ClassicCompute/virtualMachines/my_vm1 -MetricName "Percentage CPU" -Operator GreaterThan -Threshold 1 -WindowSize 00:05:00 -TimeAggregationOperator Average -Actions $actionEmail, $actionWebhook -Description "alert on CPU > 1%"
```

For more information on using PowerShell, see [public documentation](../azure-monitor/platform/powershell-quickstart-samples.md).

## Application Insights

> [!NOTE]
> Codeless agent/extension based monitoring for Azure App Services is **currently not supported**. As soon as this functionality becomes available this article will be updated.

This section describes the supplemental configuration that is required to use Application Insights in Azure Government. To learn more about Azure Monitor and Application Insights checkout the [full documentation](https://docs.microsoft.com/azure/azure-monitor/overview).

### Enable Application Insights for ASP.NET & ASP.NET Core with Visual Studio

Currently for Azure Government customers, the only way to enable Application Insights via the traditional **Add Applications Insights Telemetry** button in Visual Studio requires a small manual workaround. Customers experiencing the associated issue may see error messages like _"There is no Azure subscription associated with this account_ or  _"The selected subscription does not support Application Insights_ even though the `microsoft.insights` resource provider has a status of registered for the subscription. To mitigate this issue, you must perform the following steps:

1. Switch Visual Studio to [target the Azure Government cloud](https://docs.microsoft.com/azure/azure-government/documentation-government-get-started-connect-with-vs).

2. Create (or if already existing set) the User Environment variable for AzureGraphApiVersion as follows: (To create a User Environment variable go to **Control Panel** > **System** > **Advanced system settings** > **Advanced** > **Environment Variables**.)

    `Variable name: AzureGraphApiVersion`
    `Variable value: 2014-04-01`

3. Make the appropriate Application Insights SDK endpoint modifications for either [ASP.NET](https://docs.microsoft.com/azure/azure-government/documentation-government-services-monitoringandmanagement#net-with-applicationinsightsconfig) or [ASP.NET Core](https://docs.microsoft.com/azure/azure-government/documentation-government-services-monitoringandmanagement#net-core) depending on your project type.

### Snapshot Debugger

Snapshot Debugger is now available for Azure Government customers. To use Snapshot Debugger the only additional prerequisite is to insure that you are using [Snapshot Collector version 1.3.5](https://www.nuget.org/packages/Microsoft.ApplicationInsights.SnapshotCollector/1.3.5-pre-1906.403) or later. Then simply follow the standard [Snapshot Debugger documentation](https://docs.microsoft.com/azure/azure-monitor/app/snapshot-debugger).

### SDK endpoint modifications

In order to send data from Application Insights to the Azure Government region, you will need to modify the default endpoint addresses that are used by the Application Insights SDKs. Each SDK requires slightly different modifications.

### .NET with applicationinsights.config

> [!NOTE]
> The applicationinsights.config file is automatically overwritten anytime a SDK upgrade is performed. After performing an SDK upgrade be sure to re-enter the region specific endpoint values.

```xml
<ApplicationInsights>
  ...
  <TelemetryModules>
    <Add Type="Microsoft.ApplicationInsights.Extensibility.PerfCounterCollector.QuickPulse.QuickPulseTelemetryModule, Microsoft.AI.PerfCounterCollector">
      <QuickPulseServiceEndpoint>https://quickpulse.applicationinsights.us/QuickPulseService.svc</QuickPulseServiceEndpoint>
    </Add>
  </TelemetryModules>
    ...
  <TelemetryChannel>
     <EndpointAddress>https://dc.applicationinsights.us/v2/track</EndpointAddress>
  </TelemetryChannel>
  ...
  <ApplicationIdProvider Type="Microsoft.ApplicationInsights.Extensibility.Implementation.ApplicationId.ApplicationInsightsApplicationIdProvider, Microsoft.ApplicationInsights">
    <ProfileQueryEndpoint>https://dc.applicationinsights.us/api/profiles/{0}/appId</ProfileQueryEndpoint>
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
      "EndpointAddress": "https://dc.applicationinsights.us/v2/track"
    }
  }
```

The values for Live Metrics and the Profile Query Endpoint can only be set via code. To override the default values for all endpoint values via code, make the following changes in the `ConfigureServices` method of the `Startup.cs` file:

```csharp
using Microsoft.ApplicationInsights.Extensibility.Implementation.ApplicationId;
using Microsoft.ApplicationInsights.Extensibility.PerfCounterCollector.QuickPulse; //place at top of Startup.cs file

   services.ConfigureTelemetryModule<QuickPulseTelemetryModule>((module, o) => module.QuickPulseServiceEndpoint="https://quickpulse.applicationinsights.us/QuickPulseService.svc");

   services.AddSingleton(new ApplicationInsightsApplicationIdProvider() { ProfileQueryEndpoint = "https://dc.applicationinsights.us/api/profiles/{0}/appId" }); 

   services.AddSingleton<ITelemetryChannel>(new ServerTelemetryChannel() { EndpointAddress = "https://dc.applicationinsights.us/v2/track" });

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
  <EndpointAddress>https://dc.applicationinsights.us/v2/track</EndpointAddress>
  </Channel>
</ApplicationInsights>
```

### Spring Boot

Modify the `application.properties` file and add:

```yaml
azure.application-insights.channel.in-process.endpoint-address= https://dc.applicationinsights.us/v2/track
```

### Node.js

```javascript
var appInsights = require("applicationinsights");
appInsights.setup('INSTRUMENTATION_KEY');
appInsights.defaultClient.config.endpointUrl = "https://dc.applicationinsights.us/v2/track"; // ingestion
appInsights.defaultClient.config.profileQueryEndpoint = "https://dc.applicationinsights.us/api/profiles/{0}/appId"; // appid/profile lookup
appInsights.defaultClient.config.quickPulseHost = "https://quickpulse.applicationinsights.us/QuickPulseService.svc"; //live metrics
appInsights.Configuration.start();
```

The endpoints can also be configured through environment variables:

```
Instrumentation Key: "APPINSIGHTS_INSTRUMENTATIONKEY"
Profile Endpoint: "https://dc.applicationinsights.us/api/profiles/{0}/appId"
Live Metrics Endpoint: "https://quickpulse.applicationinsights.us/QuickPulseService.svc"
```

### JavaScript

```javascript
<script type="text/javascript">
   var sdkInstance="appInsightsSDK";window[sdkInstance]="appInsights";var aiName=window[sdkInstance],aisdk=window[aiName]||function(e){
      function n(e){t[e]=function(){var n=arguments;t.queue.push(function(){t[e].apply(t,n)})}}var t={config:e};t.initialize=!0;var i=document,a=window;setTimeout(function(){var n=i.createElement("script");n.src=e.url||"https://az416426.vo.msecnd.net/next/ai.2.min.js",i.getElementsByTagName("script")[0].parentNode.appendChild(n)});try{t.cookie=i.cookie}catch(e){}t.queue=[],t.version=2;for(var r=["Event","PageView","Exception","Trace","DependencyData","Metric","PageViewPerformance"];r.length;)n("track"+r.pop());n("startTrackPage"),n("stopTrackPage");var s="Track"+r[0];if(n("start"+s),n("stop"+s),n("setAuthenticatedUserContext"),n("clearAuthenticatedUserContext"),n("flush"),!(!0===e.disableExceptionTracking||e.extensionConfig&&e.extensionConfig.ApplicationInsightsAnalytics&&!0===e.extensionConfig.ApplicationInsightsAnalytics.disableExceptionTracking)){n("_"+(r="onerror"));var o=a[r];a[r]=function(e,n,i,a,s){var c=o&&o(e,n,i,a,s);return!0!==c&&t["_"+r]({message:e,url:n,lineNumber:i,columnNumber:a,error:s}),c},e.autoExceptionInstrumented=!0}return t
   }({
      instrumentationKey:"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx"
      endpointUrl: "https://dc.applicationinsights.us/v2/track"
   });

   window[aiName]=aisdk,aisdk.queue&&0===aisdk.queue.length&&aisdk.trackPageView({});
</script>
```

### Firewall exceptions

The Azure Application Insights service uses a number of IP addresses. You might need to know these addresses if the app that you are monitoring is hosted behind a firewall.

> [!NOTE]
> Although these addresses are static, it's possible that we will need to change them from time to time. All Application Insights traffic represents outbound traffic with the exception of availability monitoring and webhooks, which require inbound firewall rules.

### Outgoing ports
You need to open some outgoing ports in your server's firewall to allow the Application Insights SDK and/or Status Monitor to send data to the portal:

| Purpose | URL | IP | Ports |
| --- | --- | --- | --- |
| Telemetry | dc.applicationinsights.us | 23.97.4.113 | 443 |

## Azure Monitor logs
Azure Monitor logs is generally available in Azure Government.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../includes/azure-monitor-log-analytics-rebrand.md)]

### Variations

* Solutions that are available in Azure Government include:
  * [Network Performance Monitor (NPM)](https://blogs.msdn.microsoft.com/azuregov/2017/09/05/network-performance-monitor-general-availability/) - NPM is a cloud-based network monitoring solution for public and hybrid cloud environments. Organizations use NPM to monitor network availability across on-premises and cloud environments.  Endpoint Monitor - a subcapability of NPM, monitors network connectivity to applications.

The following Azure Monitor logs features and solutions are not currently available in Azure Government.

* Solutions that are in preview in Microsoft Azure, including:
  * Service Map
  * Windows 10 Upgrade Analytics solution
  * Application Insights solution
  * Azure Networking Security Group Analytics solution
  * Azure Automation Analytics solution
  * Key Vault Analytics solution
* Solutions and features that require updates to on-premises software, including:
  * Surface Hub solution
* Features that are in preview in global Azure, including:
  * Export of data to Power BI
* Azure metrics and Azure diagnostics

The URLs for Azure Monitor logs are different in Azure Government:

| Azure Public | Azure Government | Notes |
| --- | --- | --- |
| mms.microsoft.com |oms.microsoft.us |Log Analytics workspaces portal |
| *workspaceId*.ods.opinsights.azure.com |*workspaceId*.ods.opinsights.azure.us |[Data collector API](../azure-monitor/platform/data-collector-api.md) |
| \*.ods.opinsights.azure.com |\*.ods.opinsights.azure.us |Agent communication - [configuring firewall settings](../log-analytics/log-analytics-proxy-firewall.md) |
| \*.oms.opinsights.azure.com |\*.oms.opinsights.azure.us |Agent communication - [configuring firewall settings](../log-analytics/log-analytics-proxy-firewall.md) |
| \*.blob.core.windows.net |\*.blob.core.usgovcloudapi.net |Agent communication - [configuring firewall settings](../log-analytics/log-analytics-proxy-firewall.md) |
| portal.loganalytics.io |portal.loganalytics.us |Advanced Analytics Portal - [configuring firewall settings](../azure-monitor/log-query/portals.md) |
| api.loganalytics.io |api.loganalytics.us |Advanced Analytics Portal - [configuring firewall settings](../azure-monitor/log-query/portals.md) |
| docs.loganalytics.io |docs.loganalytics.us |Advanced Analytics Portal - [configuring firewall settings](../azure-monitor/log-query/portals.md) |
| \*.azure-automation.net |\*.azure-automation.us |Azure Automation - [configuring firewall settings](../azure-monitor/platform/log-analytics-agent.md#network-firewall-requirements) |
| N/A | *.usgovtrafficmanager.net | Azure Traffic Manager - [configuring firewall settings](../azure-monitor/platform/log-analytics-agent.md#network-firewall-requirements) |

The following Azure Monitor logs features behave differently in Azure Government:

* To connect your System Center Operations Manager management group to Azure Monitor logs, you need to download and import updated management packs.
  + System Center Operations Manager 2016
    1. Install [Update Rollup 2 for System Center Operations Manager 2016](https://support.microsoft.com/help/3209591).
    2. Import the management packs included as part of Update Rollup 2 into Operations Manager. For information about how to import a management pack from a disk, see [How to Import an Operations Manager Management Pack](https://technet.microsoft.com/library/hh212691.aspx).
    3. To connect Operations Manager to Azure Monitor logs, follow the steps in [Connect Operations Manager to Azure Monitor logs](../azure-monitor/platform/om-agents.md).
  + System Center Operations Manager 2012 R2 UR3 (or later) / Operations Manager 2012 SP1 UR7 (or later)
    1. Download and save the [updated management packs](https://go.microsoft.com/fwlink/?LinkId=828749).
    2. Unzip the file that you downloaded.
    3. Import the management packs into Operations Manager. For information about how to import a management pack from a disk, see [How to Import an Operations Manager Management Pack](https://technet.microsoft.com/library/hh212691.aspx).
    4. To connect Operations Manager to Azure Monitor logs, follow the steps in [Connect Operations Manager to Azure Monitor logs](../azure-monitor/platform/om-agents.md).

* To use [computer groups from System Center Configuration Manager 2016](../azure-monitor/platform/collect-sccm.md), you need to be using [Technical Preview 1701](https://docs.microsoft.com/sccm/core/get-started/technical-preview) or later.

### Frequently asked questions
* Can I migrate data from Azure Monitor logs in Microsoft Azure to Azure Government?
  * No. It is not possible to move data or your workspace from Microsoft Azure to Azure Government.
* Can I switch between Microsoft Azure and Azure Government workspaces from the Operations Management Suite portal?
  * No. The portals for Microsoft Azure and Azure Government are separate and do not share information.

For more information, see [Azure Monitor logs public documentation](../log-analytics/log-analytics-overview.md).

## Scheduler
For information on this service and how to use it, see [Azure Scheduler Documentation](../scheduler/index.md).

## Azure portal
The Azure Government portal can be accessed [here](https://portal.azure.us).

## Azure Resource Manager
For information on this service and how to use it, see [Azure Resource Manager Documentation](../azure-resource-manager/resource-group-overview.md).

## Next steps
* Subscribe to the [Azure Government blog](https://blogs.msdn.microsoft.com/azuregov/)
* Get help on Stack Overflow by using the [azure-gov](https://stackoverflow.com/questions/tagged/azure-gov)
* Give feedback or request new features via the [Azure Government feedback forum](https://feedback.azure.com/forums/558487-azure-government)
