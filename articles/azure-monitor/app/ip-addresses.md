---
title: IP addresses used by Azure Monitor | Microsoft Docs
description: This article discusses server firewall exceptions that are required by Azure Monitor
ms.topic: conceptual
ms.date: 08/11/2023
ms.reviewer: saars
---

# IP addresses used by Azure Monitor

[Azure Monitor](../overview.md) uses several IP addresses. Azure Monitor is made up of core platform metrics and logs in addition to Log Analytics and Application Insights. You might need to know IP addresses if the app or infrastructure that you're monitoring is hosted behind a firewall.

:::image type="content" source="https://learn.microsoft.com/troubleshoot/azure/azure-monitor/app-insights/media/investigate-missing-telemetry/telemetry-processing-pipeline.png" alt-text="A diagram illustrating the ingestion flow of telemetry" lightbox="https://learn.microsoft.com/troubleshoot/azure/azure-monitor/app-insights/media/investigate-missing-telemetry/telemetry-processing-pipeline.png":::

> [!NOTE]
> Although these addresses are static, it's possible that we'll need to change them from time to time. All Application Insights traffic represents outbound traffic with the exception of availability monitoring and webhook action groups, which also require inbound firewall rules.

You can use Azure [network service tags](../../virtual-network/service-tags-overview.md) to manage access if you're using Azure network security groups. If you're managing access for hybrid/on-premises resources, you can download the equivalent IP address lists as [JSON files](../../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files), which are updated each week. To cover all the exceptions in this article, use the service tags `ActionGroup`, `ApplicationInsightsAvailability`, and `AzureMonitor`.

Alternatively, you can subscribe to this page as an RSS feed by adding https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/azure-monitor/app/ip-addresses.md to your favorite RSS/ATOM reader to get notified of the latest changes.

## Outgoing ports

You need to open some outgoing ports in your server's firewall to allow the Application Insights SDK or Application Insights Agent to send data to the portal.

> [!NOTE]
> These addresses are listed by using Classless Interdomain Routing notation. As an example, an entry like `51.144.56.112/28` is equivalent to 16 IPs that start at `51.144.56.112` and end at `51.144.56.127`.

| Purpose | URL | Type | IP | Ports |
| --- | --- | --- | --- | --- |
| Telemetry | dc.applicationinsights.azure.com<br/>dc.applicationinsights.microsoft.com<br/>dc.services.visualstudio.com<br/>\*.in.applicationinsights.azure.com<br/><br/> |Global<br/>Global<br/>Global<br/>Regional<br/>|| 443 |
| Live Metrics | live.applicationinsights.azure.com<br/>rt.applicationinsights.microsoft.com<br/>rt.services.visualstudio.com<br/><br/>{region}.livediagnostics.monitor.azure.com<br/><br/>*Example for {region}: westus2<br/>Find all supported regions in [this table](#addresses-grouped-by-region-azure-public-cloud).*|Global<br/>Global<br/>Global<br/><br/>Regional<br/>|20.49.111.32/29<br/>13.73.253.112/29| 443 |

> [!NOTE]
> Application Insights ingestion endpoints are IPv4 only.

> [!IMPORTANT]
> For Live Metrics, it is *required* to add the list of [IPs for the respective region](#addresses-grouped-by-region-azure-public-cloud) aside from global IPs.

## Application Insights Agent

Application Insights Agent configuration is needed only when you're making changes.

| Purpose | URL | Ports |
| --- | --- | --- |
| Configuration |`management.core.windows.net` |`443` |
| Configuration |`management.azure.com` |`443` |
| Configuration |`login.windows.net` |`443` |
| Configuration |`login.microsoftonline.com` |`443` |
| Configuration |`secure.aadcdn.microsoftonline-p.com` |`443` |
| Configuration |`auth.gfx.ms` |`443` |
| Configuration |`login.live.com` |`443` |
| Installation | `globalcdn.nuget.org`, `packages.nuget.org` ,`api.nuget.org/v3/index.json` `nuget.org`, `api.nuget.org`, `dc.services.vsallin.net` |`443` |

## Availability tests

This is the list of addresses from which [availability web tests](./availability-overview.md) are run. If you want to run web tests on your app but your web server is restricted to serving specific clients, you'll have to permit incoming traffic from our availability test servers.

> [!NOTE]
> For resources located inside private virtual networks that can't allow direct inbound communication with the availability test agents in public Azure, the only option is to [create and host your own custom availability tests](availability-azure-functions.md).

### Service tag

If you're using Azure network security groups, add an *inbound port rule* to allow traffic from Application Insights availability tests. Select **Service Tag** as the **Source** and **ApplicationInsightsAvailability** as the **Source service tag**.

>[!div class="mx-imgBorder"]
>:::image type="content" source="./media/ip-addresses/add-inbound-security-rule.png" lightbox="./media/ip-addresses/add-inbound-security-rule.png" alt-text="Screenshot that shows selecting Inbound security rules and then selecting Add.":::

>[!div class="mx-imgBorder"]
>:::image type="content" source="./media/ip-addresses/add-inbound-security-rule2.png" lightbox="./media/ip-addresses/add-inbound-security-rule2.png" alt-text="Screenshot that shows the Add inbound security rule tab.":::

Open port 80 (HTTP) and port 443 (HTTPS) for incoming traffic from these addresses. IP addresses are grouped by location.

### IP addresses

If you're looking for the actual IP addresses so that you can add them to the list of allowed IPs in your firewall, download the JSON file that describes Azure IP ranges. These files contain the most up-to-date information. After you download the appropriate file, open it by using your favorite text editor. Search for **ApplicationInsightsAvailability** to go straight to the section of the file that describes the service tag for availability tests.

For Azure public cloud, you need to allow both the global IP ranges and the ones specific for the region of your Application Insights resource which receives live data. You can find the global IP ranges in the [Outgoing ports](#outgoing-ports) table at the top of this document, and the regional IP ranges in the [Addresses grouped by region](#addresses-grouped-by-region-azure-public-cloud) table below.

#### Azure public cloud

Download [public cloud IP addresses](https://www.microsoft.com/download/details.aspx?id=56519).

#### Azure US Government cloud

Download [US Government cloud IP addresses](https://www.microsoft.com/download/details.aspx?id=57063).

#### Microsoft Azure operated by 21Vianet cloud

Download [China cloud IP addresses](https://www.microsoft.com/download/details.aspx?id=57062).

#### Addresses grouped by region (Azure public cloud)

Add the subdomain of the corresponding region to the Live Metrics URL from the [Outgoing ports](#outgoing-ports) table.

> [!NOTE]
> As described in the [Azure TLS 1.2 migration announcement](https://azure.microsoft.com/updates/azuretls12/), Application Insights connection-string based regional telemetry endpoints only support TLS 1.2. Global telemetry endpoints continue to support TLS 1.0 and TLS 1.1.
>
> If you're using an older version of TLS, Application Insights will not ingest any telemetry. For applications based on .NET Framework see [Transport Layer Security (TLS) best practices with the .NET Framework](/dotnet/framework/network-programming/tls) to support the newer TLS version.

| Continent/Country | Region | Subdomain | IP |
| --- | --- | --- | --- |
|Asia|East Asia|eastasia|52.229.216.48/28<br/>20.189.111.16/29|
||Southeast Asia|southeastasia|52.139.250.96/28<br/>23.98.106.152/29|
|Australia|Australia Central|australiacentral|20.37.227.104/29<br/><br/>|
||Australia Central 2|australiacentral2|20.53.60.224/31<br/><br/>|
||Australia East|australiaeast|20.40.124.176/28<br/>20.37.198.232/29|
||Australia Southeast|australiasoutheast|20.42.230.224/29<br/><br/>|
|Brazil|Brazil South|brazilsouth|191.233.26.176/28<br/>191.234.137.40/29|
||Brazil Southeast|brazilsoutheast|20.206.0.196/31<br/><br/>|
|Canada|Canada Central|canadacentral|52.228.86.152/29<br/><br/>|
|Europe|North Europe|northeurope|52.158.28.64/28<br/>20.50.68.128/29|
||West Europe|westeurope|51.144.56.96/28<br/>40.113.178.32/29|
|France|France Central|francecentral|20.40.129.32/28<br/>20.43.44.216/29|
||France South|francesouth|20.40.129.96/28<br/>52.136.191.12/31|
|Germany|Germany West Central|germanywestcentral|20.52.95.50/31<br/><br/>|
|India|Central India|centralindia|52.140.108.216/29<br/><br/>|
||South India|southindia|20.192.153.106/31<br/><br/>|
|Japan|Japan East|japaneast|52.140.232.160/28<br/>20.43.70.224/29|
||Japan West|japanwest|20.189.194.102/31<br/><br/>|
|Korea|Korea Central|koreacentral|20.41.69.24/29<br/><br/>|
|Norway|Norway East|norwayeast|51.120.235.248/29<br/><br/>|
||Norway West|norwaywest|51.13.143.48/31<br/><br/>|
|Qatar|Qatar Central|qatarcentral|20.21.39.224/29<br/><br/>|
|South Africa|South Africa North|southafricanorth|102.133.219.136/29<br/><br/>|
|Switzerland|Switzerland North|switzerlandnorth|51.107.52.200/29<br/><br/>|
||Switzerland West|switzerlandwest|51.107.148.8/29<br/><br/>|
|United Arab Emirates|UAE North|uaenorth|20.38.143.44/31<br/>40.120.87.204/31|
|United Kingdom|UK South|uksouth|51.105.9.128/28<br/>51.104.30.160/29|
||UK West|ukwest|20.40.104.96/28<br/>51.137.164.200/29|
|United States|Central US|centralus|13.86.97.224/28<br/>20.40.206.232/29|
||East US|eastus|20.42.35.32/28<br/>20.49.111.32/29|
||East US 2|eastus2|20.49.102.24/29<br/><br/>|
||North Central US|northcentralus|23.100.224.16/28<br/>20.49.114.40/29|
||South Central US|southcentralus|20.45.5.160/28<br/>13.73.253.112/29|
||West US|westus|40.91.82.48/28<br/>52.250.228.8/29|
||West US 2|westus2|40.64.134.128/29<br/><br/>|
||West US 3|westus3|20.150.241.64/29<br/><br/>|

#### Upcoming regions (Azure public cloud)

> [!NOTE]
> The following regions are not supported yet, but will be added in the near future.

| Continent/Country | Region | Subdomain | IP |
| --- | --- | --- | --- |
|Canada|Canada East|TBD|52.242.40.208/31<br/><br/>|
|Germany|Germany North|TBD|51.116.75.92/31<br/><br/>|
|India|West India|TBD|20.192.84.164/31<br/><br/>|
||Jio India Central|TBD|20.192.50.200/29<br/><br/>|
||Jio India West|TBD|20.193.194.32/29<br/><br/>|
|Israel|Israel Central|TBD|20.217.44.250/31<br/><br/>|
|Poland|Poland Central|TBD|20.215.4.250/31<br/><br/>|
|South Africa|South Africa West|TBD|102.37.86.196/31<br/><br/>|
|Sweden|Sweden Central|TBD|51.12.25.192/29<br/><br/>|
||Sweden South|TBD|51.12.17.128/29<br/><br/>|
|Taiwan|Taiwan North|TBD|51.53.28.214/31<br/><br/>|
||Taiwan Northwest|TBD|51.53.172.214/31<br/><br/>|
|United Arab Emirates|UAE Central|TBD|20.45.95.68/31<br/><br/>|
|United States|West Central US|TBD|52.150.154.24/29<br/><br/>|

### Discovery API

You might also want to [programmatically retrieve](../../virtual-network/service-tags-overview.md#use-the-service-tag-discovery-api) the current list of service tags together with IP address range details.

## Application Insights and Log Analytics APIs

| Purpose | URI |  IP | Ports |
| --- | --- | --- | --- |
| API |`api.applicationinsights.io`<br/>`api1.applicationinsights.io`<br/>`api2.applicationinsights.io`<br/>`api3.applicationinsights.io`<br/>`api4.applicationinsights.io`<br/>`api5.applicationinsights.io`<br/>`dev.applicationinsights.io`<br/>`dev.applicationinsights.microsoft.com`<br/>`dev.aisvc.visualstudio.com`<br/>`www.applicationinsights.io`<br/>`www.applicationinsights.microsoft.com`<br/>`www.aisvc.visualstudio.com`<br/>`api.loganalytics.io`<br/>`*.api.loganalytics.io`<br/>`dev.loganalytics.io`<br>`docs.loganalytics.io`<br/>`www.loganalytics.io` |20.37.52.188 <br/> 20.37.53.231 <br/> 20.36.47.130 <br/> 20.40.124.0 <br/> 20.43.99.158 <br/> 20.43.98.234 <br/> 13.70.127.61 <br/> 40.81.58.225 <br/> 20.40.160.120 <br/> 23.101.225.155 <br/> 52.139.8.32 <br/> 13.88.230.43 <br/> 52.230.224.237 <br/> 52.242.230.209 <br/> 52.173.249.138 <br/> 52.229.218.221 <br/> 52.229.225.6 <br/> 23.100.94.221 <br/> 52.188.179.229 <br/> 52.226.151.250 <br/> 52.150.36.187 <br/> 40.121.135.131 <br/> 20.44.73.196 <br/> 20.41.49.208 <br/> 40.70.23.205 <br/> 20.40.137.91 <br/> 20.40.140.212 <br/> 40.89.189.61 <br/> 52.155.118.97 <br/> 52.156.40.142 <br/> 23.102.66.132 <br/> 52.231.111.52 <br/> 52.231.108.46 <br/> 52.231.64.72 <br/> 52.162.87.50 <br/> 23.100.228.32 <br/> 40.127.144.141 <br/> 52.155.162.238 <br/> 137.116.226.81 <br/> 52.185.215.171 <br/> 40.119.4.128 <br/> 52.171.56.178 <br/> 20.43.152.45 <br/> 20.44.192.217 <br/> 13.67.77.233 <br/> 51.104.255.249 <br/> 51.104.252.13 <br/> 51.143.165.22 <br/> 13.78.151.158 <br/> 51.105.248.23 <br/> 40.74.36.208 <br/> 40.74.59.40 <br/> 13.93.233.49 <br/> 52.247.202.90 |80,443 |
| Azure Pipeline annotations extension | aigs1.aisvc.visualstudio.com |dynamic|443 | 

## Application Insights analytics

| Purpose | URI | IP | Ports |
| --- | --- | --- | --- |
| Analytics portal | analytics.applicationinsights.io | dynamic | 80,443 |
| CDN | applicationanalytics.azureedge.net | dynamic | 80,443 |
| Media CDN | applicationanalyticsmedia.azureedge.net | dynamic | 80,443 |

The *.applicationinsights.io domain is owned by the Application Insights team.

## Log Analytics portal

| Purpose | URI | IP | Ports |
| --- | --- | --- | --- |
| Portal | portal.loganalytics.io | dynamic | 80,443 |
| CDN | applicationanalytics.azureedge.net | dynamic | 80,443 |

The *.loganalytics.io domain is owned by the Log Analytics team.

## Application Insights Azure portal extension

| Purpose | URI | IP | Ports |
| --- | --- | --- | --- |
| Application Insights extension | stamp2.app.insightsportal.visualstudio.com | dynamic | 80,443 |
| Application Insights extension CDN | insightsportal-prod2-cdn.aisvc.visualstudio.com<br/>insightsportal-prod2-asiae-cdn.aisvc.visualstudio.com<br/>insightsportal-cdn-aimon.applicationinsights.io | dynamic | 80,443 |

## Application Insights SDKs

| Purpose | URI | IP | Ports |
| --- | --- | --- | --- |
| Application Insights JS SDK CDN | az416426.vo.msecnd.net<br/>js.monitor.azure.com | dynamic | 80,443 |

## Action group webhooks

You can query the list of IP addresses used by action groups by using the [Get-AzNetworkServiceTag PowerShell command](/powershell/module/az.network/Get-AzNetworkServiceTag).

### Action group service tag

Managing changes to source IP addresses can be time consuming. Using *service tags* eliminates the need to update your configuration. A service tag represents a group of IP address prefixes from a specific Azure service. Microsoft manages the IP addresses and automatically updates the service tag as addresses change, which eliminates the need to update network security rules for an action group.

1. In the Azure portal under **Azure Services**, search for **Network Security Group**.
1. Select **Add** and create a network security group:

   1. Add the resource group name, and then enter **Instance details** information.
   1. Select **Review + Create**, and then select **Create**.
   
   :::image type="content" source="../alerts/media/action-groups/action-group-create-security-group.png" alt-text="Screenshot that shows how to create a network security group."border="true":::

1. Go to **Resource Group**, and then select the network security group you created:

    1. Select **Inbound security rules**.
    1. Select **Add**.
    
    :::image type="content" source="../alerts/media/action-groups/action-group-add-service-tag.png" alt-text="Screenshot that shows how to add inbound security rules." border="true":::

1. A new window opens in the right pane:

    1.  Under **Source**, enter **Service Tag**.
    1.  Under **Source service tag**, enter **ActionGroup**.
    1.  Select **Add**.
    
    :::image type="content" source="../alerts/media/action-groups/action-group-service-tag.png" alt-text="Screenshot that shows how to add a service tag." border="true":::

## Profiler

| Purpose | URI | IP | Ports |
| --- | --- | --- | --- |
| Agent | agent.azureserviceprofiler.net<br/>*.agent.azureserviceprofiler.net | 20.190.60.38<br/>20.190.60.32<br/>52.173.196.230<br/>52.173.196.209<br/>23.102.44.211<br/>23.102.45.216<br/>13.69.51.218<br/>13.69.51.175<br/>138.91.32.98<br/>138.91.37.93<br/>40.121.61.208<br/>40.121.57.2<br/>51.140.60.235<br/>51.140.180.52<br/>52.138.31.112<br/>52.138.31.127<br/>104.211.90.234<br/>104.211.91.254<br/>13.70.124.27<br/>13.75.195.15<br/>52.185.132.101<br/>52.185.132.170<br/>20.188.36.28<br/>40.89.153.171<br/>52.141.22.239<br/>52.141.22.149<br/>102.133.162.233<br/>102.133.161.73<br/>191.232.214.6<br/>191.232.213.239 | 443
| Portal | gateway.azureserviceprofiler.net | dynamic | 443
| Storage | *.core.windows.net | dynamic | 443

## Snapshot Debugger

> [!NOTE]
> Profiler and Snapshot Debugger share the same set of IP addresses.

| Purpose | URI | IP | Ports |
| --- | --- | --- | --- |
| Agent | agent.azureserviceprofiler.net<br/>*.agent.azureserviceprofiler.net | 20.190.60.38<br/>20.190.60.32<br/>52.173.196.230<br/>52.173.196.209<br/>23.102.44.211<br/>23.102.45.216<br/>13.69.51.218<br/>13.69.51.175<br/>138.91.32.98<br/>138.91.37.93<br/>40.121.61.208<br/>40.121.57.2<br/>51.140.60.235<br/>51.140.180.52<br/>52.138.31.112<br/>52.138.31.127<br/>104.211.90.234<br/>104.211.91.254<br/>13.70.124.27<br/>13.75.195.15<br/>52.185.132.101<br/>52.185.132.170<br/>20.188.36.28<br/>40.89.153.171<br/>52.141.22.239<br/>52.141.22.149<br/>102.133.162.233<br/>102.133.161.73<br/>191.232.214.6<br/>191.232.213.239 | 443
| Portal | gateway.azureserviceprofiler.net | dynamic | 443
| Storage | *.core.windows.net | dynamic | 443

## Frequently asked questions

This section provides answers to common questions.

### Can I monitor an intranet web server?

Yes, but you need to allow traffic to our services by either firewall exceptions or proxy redirects:

- QuickPulse `https://rt.services.visualstudio.com:443`
- ApplicationIdProvider `https://dc.services.visualstudio.com:443`
- TelemetryChannel `https://dc.services.visualstudio.com:443`
          
See [IP addresses used by Azure Monitor](./ip-addresses.md) to review our full list of services and IP addresses.
          
### How do I reroute traffic from my server to a gateway on my intranet?
          
Route traffic from your server to a gateway on your intranet by overwriting endpoints in your configuration. If the `Endpoint` properties aren't present in your config, these classes use the default values shown in the following ApplicationInsights.config example.
          
Your gateway should route traffic to our endpoint's base address. In your configuration, replace the default values with `http://<your.gateway.address>/<relative path>`.
          
#### Example ApplicationInsights.config with default endpoints:
          
```xml
<ApplicationInsights>
...
<TelemetryModules>
    <Add Type="Microsoft.ApplicationInsights.Extensibility.PerfCounterCollector.QuickPulse.QuickPulseTelemetryModule, Microsoft.AI.PerfCounterCollector">
    <QuickPulseServiceEndpoint>https://rt.services.visualstudio.com/QuickPulseService.svc</QuickPulseServiceEndpoint>
    </Add>
</TelemetryModules>
    ...
<TelemetryChannel>
    <EndpointAddress>https://dc.services.visualstudio.com/v2/track</EndpointAddress>
</TelemetryChannel>
...
<ApplicationIdProvider Type="Microsoft.ApplicationInsights.Extensibility.Implementation.ApplicationId.ApplicationInsightsApplicationIdProvider, Microsoft.ApplicationInsights">
    <ProfileQueryEndpoint>https://dc.services.visualstudio.com/api/profiles/{0}/appId</ProfileQueryEndpoint>
</ApplicationIdProvider>
...
</ApplicationInsights>
```

> [!NOTE]
> `ApplicationIdProvider` is available starting in v2.6.0.
