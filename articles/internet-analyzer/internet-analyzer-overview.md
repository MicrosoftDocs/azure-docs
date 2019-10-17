---
title: 'Azure Internet Analyzer | Microsoft Docs'
description: Learn about Azure Internet Analyzer
services: internet-analyzer
author: megan-beatty
# Customer intent: As someone with a basic network background, but is new to Azure, I want to understand the capabilities of Azure Internet analyzer so that I can test app and content delivery architectures in Azure. 

ms.service: internet-analyzer
ms.topic: overview
ms.date: 10/16/2019
ms.author: mebeatty

---
# What is Internet Analyzer? (Preview)

Internet Analyzer is a client-side measurement platform that enables you to test how networking infrastructure changes will impact your customers’ performance. Whether you’re migrating from on-premises to Azure or evaluating a new Azure service, Internet Analyzer allows you to learn from your users’ data and Microsoft’s rich analytics to better understand and optimize your network architecture with Azure—before you migrate.

Internet Analyzer uses a small JavaScript client embedded in your web-based application to measure the latency from your end-users to your selected set of network destinations. Internet Analyzer allows you to set up multiple dual-endpoint tests, allowing you to evaluate a variety of scenarios as your infrastructure and customer needs evolves. Internet Analyzer provides custom and preconfigured endpoints, providing you both the convenience and flexibility to make trusted performance decisions for your end users. 


> [!IMPORTANT]
> This public preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.
>

## Quick & customizable tests

Internet Analyzer is designed to address performance-related questions related to cloud migration, deploying to a new or additional Azure regions, or testing new app and content deliver architectures in Azure, such as Azure Front door and Azure CDN from Microsoft. 

Each test you create in Internet Analyzer is composed of two endpoints—Endpoint A and Endpoint B. Endpoint B is measured relative to what you select as Endpoint A. 

You can either configure your own custom endpoint or select from a variety of preconfigured Azure endpoints. Custom endpoints should be used to evaluate on-premises workloads, other cloud providers, or your custom Azure configurations. Experiments may be composed of two custom endpoints; however, at least one custom endpoint must reference an Azure backend. Preconfigured Azure endpoints are a quick and easy way to evaluate the performance of popular Azure, Azure Front Door, Azure Traffic Manager, and Azure CDN from Microsoft configurations. 

During preview, the following preconfigured endpoints are available: 

* **Azure regions**
    * West US 
    * West US 2
    * East US
    * Central US
    * Brazil South
    * West Europe
    * North Europe 
    * UK West 
    * Japan West
    * Southeast Asia
    * Central India
    * UAE North
    * South Africa North
* **Multiple Azure region combinations** 
    * West US, West Europe 
    * East US, East Asia 
    * West US, East US 
    * West US, UAE North
    * East US, Brazil South 
    * West Europe, Southeast Asia 
    * West Europe, Brazil South
    * West Europe, UAE North
    * West US, West Europe, East Asia
    * West Europe, UAE North, Southeast Asia
    * West US, North Europe, Southeast Asia, UAE North, South Africa North 
* **Azure + Azure Front Door** - deployed on top any single or multiple Azure region combinations listed above
* **Azure + Azure CDN from Microsoft** - deployed on top any single Azure region combination listed above
* **Azure + Azure Traffic Manager** - deployed on any Multiple Azure region combination listed above

## Suggested test scenarios 

To help you make the best performance decisions for your end users, Internet Analyzer allows you to evaluate two endpoints for a given population of end users. While Internet Analyzer can answer a multitude of questions, some of the most common are: 
* What is the impact of migrating to the cloud? 
    * *Suggested Test: Custom (your current on-premises infrastructure) vs. Azure (any preconfigured endpoint)*
* What is the best cloud for your end-user population in each region? 
    *  *Suggested Test: Custom (other cloud service) vs. Azure (any preconfigured endpoint)*
* What is the value of putting my data at the edge vs. in a data center? 
    *  *Suggested Test: Azure vs. Azure Front Door, Azure vs. Azure CDN from Microsoft*
* What is the performance benefit of Azure Front Door?
    *  *Suggested Test: Custom/ Azure/ CDN vs. Azure Front Door*
* What is the performance benefit of Azure CDN from Microsoft? 
    *  *Suggested Test: Custom/ Azure/ AFD vs. Azure CDN from Microsoft*
* How does Azure CDN from Microsoft stack up? 
    *  *Suggested Test: Custom (other CDN endpoint) vs. Azure CDN from Microsoft*

## How it works

To use Internet Analyzer, set up an Internet Analyzer resource in the Microsoft Azure portal and install a small JavaScript client in your application. The client measures the latency from your end-user population to your selected network destinations (endpoints) by downloading a one-pixel image over HTTPS. The client sends the telemetry data to Internet Analyzer. 
For the sampled end-user population, cold and warm latency measurements are conducted. Only warm latency measurements are used for analysis. Telemetry data is always aggregated and anonymized. 

![architecture](./media/ia-overview/architecture.png)


## Scorecards 

Once you begin a test, telemetry data can be viewed in your Internet Analyzer resource under the Scorecard tab. Use the following filters to change which view of the data you see: 

* **Test:** Select the test that you’d like to view results for. Test data appears once there is enough data to complete the analysis – in most cases, within 24 hours. 
* **Time period & end date:** Internet Analyzer generates three scorecards daily – each scorecard reflects a different aggregation time period – that day, the seven days prior (week), and the 30 days prior (month). Use the “End Date” filter to select the time period you want to see. 
* **Country:** Use this filter to view data specific to end users residing in a country. The global filter shows data across all geographies.  

More information scorecards can be found on the [Interpreting your scorecard](internet-analyzer-scorecard.md) page. 


## Next steps

* Learn how to [create your first Internet Analyzer resource](internet-analyzer-create-test-portal.md).
* Checkout the [Internet Analyzer FAQ](internet-analyzer-faq.md). 
