---
title: 'Azure Internet Analyzer | Microsoft Docs'
description: Learn about Azure Internet Analyzer
services: internet-analyzer
author: KumudD
# Customer intent: As someone with a basic network background, but is new to Azure, I want to understand the capabilities of Azure Internet analyzer so that I can test app and content delivery architectures in Azure. 

ms.service: internet-analyzer
ms.topic: overview
ms.date: 10/16/2019
ms.author: kumud

---
# What is Internet Analyzer? (Preview)

Internet Analyzer is a client-side measurement platform to test how networking infrastructure changes impact your customers’ performance. Whether you’re migrating from on-premises to Azure or evaluating a new Azure service, Internet Analyzer allows you to learn from your users’ data and Microsoft’s rich analytics to better understand and optimize your network architecture with Azure—before you migrate.

Internet Analyzer uses a small JavaScript client embedded in your Web application to measure the latency from your end users to your selected set of network destinations, we call _endpoints_. Internet Analyzer allows you to set up multiple side-by-side tests, allowing you to evaluate a variety of scenarios as your infrastructure and customer needs evolves. Internet Analyzer provides custom and preconfigured endpoints, providing you both the convenience and flexibility to make trusted performance decisions for your end users. 


> [!IMPORTANT]
> This public preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.
>

## Quick & customizable tests

Internet Analyzer addresses performance-related questions for cloud migration, deploying to a new or additional Azure regions, or testing new application and content delivery platforms in Azure, such as [Azure Front Door](https://azure.microsoft.com/services/frontdoor/) and [Microsoft Azure CDN](https://azure.microsoft.com/services/cdn/). 

Each test you create in Internet Analyzer is composed of two endpoints—Endpoint A and Endpoint B. Endpoint B's performance is analyzed relative to Endpoint A. 

You can either configure your own custom endpoint or select from a variety of preconfigured Azure endpoints. Custom endpoints should be used to evaluate on-premises workloads, your instances in other cloud providers, or your custom Azure configurations. Tests may be composed of two custom endpoints; however, at least one custom endpoint must be hosted in Azure. Preconfigured Azure endpoints are a quick and easy way to evaluate the performance of popular Azure networking platforms such as Azure Front Door, Azure Traffic Manager, and Azure CDN. 

During preview, the following preconfigured endpoints are available: 

* **Azure regions**
    * Brazil South
    * Central India
    * Central US
    * East Asia
    * East US
    * Japan West
    * North Europe
    * South Africa North
    * Southeast Asia 
    * UAE North
    * UK West  
    * West Europe
    * West US 
    * West US 2
* **Multiple Azure region combinations** 
    * East US, Brazil South 
    * East US, East Asia 
    * West Europe, Brazil South
    * West Europe, Southeast Asia
    * West Europe, UAE North
    * West US, East US 
    * West US, West Europe
    * West US, UAE North
    * West Europe, UAE North, Southeast Asia
    * West US, West Europe, East Asia
    * West US, North Europe, Southeast Asia, UAE North, South Africa North 
* **Azure + Azure Front Door** - deployed on any single or multiple Azure region combinations listed above
* **Azure + Azure CDN from Microsoft** - deployed on any single Azure region combination listed above
* **Azure + Azure Traffic Manager** - deployed on any multiple Azure region combination listed above

## Suggested test scenarios 

To help you make the best performance decisions for your customers, Internet Analyzer allows you to evaluate two endpoints for your specific population of end users. 

While Internet Analyzer can answer a multitude of questions, some of the most common are: 
* What is the performance impact of migrating to the cloud? 
    * *Suggested Test: Custom (your current on-premises infrastructure) vs. Azure (any preconfigured endpoint)*
* What is the value of putting my data at the edge vs. in a data center? 
    *  *Suggested Test: Azure vs. Azure Front Door, Azure vs. Azure CDN from Microsoft*
* What is the performance benefit of Azure Front Door?
    *  *Suggested Test: Custom/ Azure/ CDN vs. Azure Front Door*
* What is the performance benefit of Azure CDN from Microsoft? 
    *  *Suggested Test: Custom/ Azure/ AFD vs. Azure CDN from Microsoft*
* How does Azure CDN from Microsoft stack up? 
    *  *Suggested Test: Custom (other CDN endpoint) vs. Azure CDN from Microsoft*
* What is the best cloud for your end-user population in each region? 
    *  *Suggested Test: Custom (other cloud service) vs. Azure (any preconfigured endpoint)*

## How it works

To use Internet Analyzer, set up an Internet Analyzer resource in the Microsoft Azure portal and install the small JavaScript client in your application. The client measures the latency from your end users to your selected endpoints by downloading a one-pixel image over HTTPS. After collecting latency measurements, the client sends the measurement data to Internet Analyzer.

When a user visits the Web application, the JavaScript client selects two endpoints to measure across all configured tests. For each endpoint, the client performs a _cold_ and _warm_ measurement. The _cold_ measurement incurs additional latency beside the pure network latency between the user and endpoint such as DNS resolution, TCP connection handshake, and SSL/TLS negotiation. The _warm_ measurement follows just after the _cold_ measurement completes and takes advantage of modern browsers' persistent TCP connection management to get an accurate measure of end-to-end latency. When supported by the user's browser, the W3C resource timing API is used for accurate measurement timing. Currently, only warm latency measurements are used for analysis.

![Diagram shows an end user connecting to an application server with client embedded and to the two endpoints on the internet from several options. The user uploads measurements to Internet Analyzer.](./media/ia-overview/architecture.png)


## Scorecards 

Once a test starts, telemetry data is visible in your Internet Analyzer resource under the Scorecard tab. This data is always aggregated. Use the following filters to change which view of the data you see: 

* **Test:** Select the test that you’d like to view results for. Test data appears once there is enough data to complete the analysis – in most cases, within 24 hours. 
* **Time period & end date:** Internet Analyzer generates three scorecards daily – each scorecard reflects a different aggregation time period – the 24 hours prior (day), the seven days prior (week), and the 30 days prior (month). Use the “End Date” filter to select the time period you want to see. 
* **Country:** Use this filter to view data specific to end users residing in a country. The global filter shows data across all geographies.  

More information about scorecards can be found on the [Interpreting your scorecard](internet-analyzer-scorecard.md) page. 


## Next steps

* Learn how to [create your first Internet Analyzer resource](internet-analyzer-create-test-portal.md).
* Read the [Internet Analyzer FAQ](internet-analyzer-faq.md). 
