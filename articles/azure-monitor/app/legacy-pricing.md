---
title: Application Insights legacy enterprise (per node) pricing tier
description: Describes the legacy pricing tier for Application Insights.
ms.topic: conceptual
ms.date: 02/18/2022
ms.reviewer: dalek
---
 
# Application Insights legacy enterprise (per node) pricing tier
For early adopters of Azure Application Insights, there are still two possible pricing tiers: Basic and Enterprise. The Basic pricing tier is the same as described above and is the default tier. It includes all Enterprise tier features, at no extra cost. The Basic tier bills primarily on the volume of data that's ingested.

These legacy pricing tiers have been renamed. The Enterprise pricing tier is now called **Per Node** and the Basic pricing tier is now called **Per GB**. These new names are used below and in the Azure portal.  

The Per Node (formerly Enterprise) tier has a per-node charge, and each node receives a daily data allowance. In the Per Node pricing tier, you're charged for data ingested above the included allowance. If you're using Operations Management Suite, you should choose the Per Node tier. In April 2018, we [introduced](https://azure.microsoft.com/blog/introducing-a-new-way-to-purchase-azure-monitoring-services/) a new pricing model for Azure monitoring. This model adopts a simple "pay-as-you-go" model across the complete portfolio of monitoring services. Learn more about the [new pricing model](..//usage-estimated-costs.md).

For current prices in your currency and region, see [Application Insights pricing](https://azure.microsoft.com/pricing/details/application-insights/).

## Understanding billed usage on the legacy Enterprise (Per Node) tier 

As described below in more detail, the legacy Enterprise (Per Node) tier combines usage from across all Application Insights resources in a subscription to calculate the number of nodes and the data overage. Due to this combination process, **usage for all Application Insights resources in a subscription are reported against just one of the resources**.  This makes reconciling your billed usage with the usage you observe for each Application Insights resource complicated.

> [!WARNING]
> Because of the complexity of tracking and understanding usage of Application Insights resources in the legacy Enterprise (Per Node) tier we strongly recommend using the current Pay-As-You-Go pricing tier. 

## Per Node tier and Operations Management Suite subscription entitlements

Customers who purchase Operations Management Suite E1 and E2 can get Application Insights Per Node as an supplemental component at no extra cost as [previously announced](/archive/blogs/msoms/azure-application-insights-enterprise-as-part-of-operations-management-suite-subscription). Specifically, each unit of Operations Management Suite E1 and E2 includes an entitlement to one node of the Application Insights Per Node tier. Each Application Insights node includes up to 200 MB of data ingested per day (separate from Log Analytics data ingestion), with 90-day data retention at no extra cost. The tier is described in more detailed later in the article.

Because this tier is applicable only to customers with an Operations Management Suite subscription, customers who don't have an Operations Management Suite subscription don't see an option to select this tier.

> [!NOTE]
> To ensure that you get this entitlement, your Application Insights resources must be in the Per Node pricing tier. This entitlement applies only as nodes. Application Insights resources in the Per GB tier don't realize any benefit. 
> This entitlement isn't visible in the estimated costs shown in the **Usage and estimated cost** pane. Also, if you move a subscription to the new Azure monitoring pricing model in April 2018, the Per GB tier is the only tier available. Moving a subscription to the new Azure monitoring pricing model isn't advisable if you have an Operations Management Suite subscription.

## How the Per Node tier works

* You pay for each node that sends telemetry for any apps in the Per Node tier.
  * A *node* is a physical or virtual server machine or a platform-as-a-service role instance that hosts your app.
  * Development machines, client browsers, and mobile devices don't count as nodes.
  * If your app has several components that send telemetry, such as a web service and a back-end worker, the components are counted separately.
  * [Live Metrics Stream](../app/live-stream.md) data isn't counted for pricing purposes. In a subscription, your charges are per node, not per app. If you have five nodes that send telemetry for 12 apps, the charge is for five nodes.
* Although charges are quoted per month, you're charged only for any hour in which a node sends telemetry from an app. The hourly charge is the quoted monthly charge divided by 744 (the number of hours in a 31-day month).
* A data volume allocation of 200 MB per day is given for each node that's detected (with hourly granularity). Unused data allocation isn't carried over from one day to the next.
  * If you choose the Per Node pricing tier, each subscription gets a daily allowance of data based on the number of nodes that send telemetry to the Application Insights resources in that subscription. So, if you have five nodes that send data all day, you'll have a pooled allowance of 1 GB applied to all Application Insights resources in that subscription. It doesn't matter if certain nodes send more data than other nodes because the included data is shared across all nodes. If on a given day, the Application Insights resources receive more data than is included in the daily data allocation for this subscription, the per-GB overage data charges apply. 
  * The daily data allowance is calculated as the number of hours in the day (using UTC) that each node sends telemetry divided by 24 multiplied by 200 MB. So, if you have four nodes that send telemetry during 15 of the 24 hours in the day, the included data for that day would be ((4 &#215; 15) / 24) &#215; 200 MB = 500 MB. At the price of 2.30 USD per GB for data overage, the charge would be 1.15 USD if the nodes send 1 GB of data that day.
  * The Per Node tier daily allowance isn't shared with applications for which you have chosen the Per GB tier. Unused allowance isn't carried over from day-to-day.

## Examples of how to determine distinct node count

| Scenario                               | Total daily node count |
|:---------------------------------------|:----------------:|
| 1 application using 3 Azure App Service instances and 1 virtual server | 4 |
| 3 applications running on 2 VMs; the Application Insights resources for these applications are in the same subscription and in the Per Node tier | 2 | 
| 4 applications whose Applications Insights resources are in the same subscription; each application running 2 instances during 16 off-peak hours, and 4 instances during 8 peak hours | 13.33 |
| Cloud services with 1 Worker Role and 1 Web Role, each running 2 instances | 4 | 
| A 5-node Azure Service Fabric cluster running 50 microservices; each microservice running 3 instances | 5|

* The precise node counting depends on which Application Insights SDK your application is using. 
  * In SDK versions 2.2 and later, both the Application Insights [Core SDK](https://www.nuget.org/packages/Microsoft.ApplicationInsights/) and the [Web SDK](https://www.nuget.org/packages/Microsoft.ApplicationInsights.Web/) report each application host as a node. Examples are the computer name for physical server and VM hosts or the instance name for cloud services.  The only exception is an application that uses only the [.NET Core](https://dotnet.github.io/) and the Application Insights Core SDK. In that case, only one node is reported for all hosts because the host name isn't available.
  * For earlier versions of the SDK, the [Web SDK](https://www.nuget.org/packages/Microsoft.ApplicationInsights.Web/) behaves like the newer SDK versions, but the [Core SDK](https://www.nuget.org/packages/Microsoft.ApplicationInsights/) reports only one node, regardless of the number of application hosts.
  * If your application uses the SDK to set **roleInstance** to a custom value, by default, that same value is used to determine node count.
  * If you're using a new SDK version with an app that runs from client machines or mobile devices, the node count might return a number that's large (because of the large number of client machines or mobile devices).





## Next steps
