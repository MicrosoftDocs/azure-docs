<properties
   pageTitle="Gain insights into your Microsoft Azure resource consumption | Microsoft Azure"
   description="Provides a conceptual overview of the Azure Billing Usage and RateCard APIs, which are used to provide insights into Azure resource consumption and trends."
   services=""
   documentationCenter=""
   authors="BryanLa"
   manager="mbaldwin"
   editor=""
   tags="billing"/>

<tags
   ms.service="billing"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="billing"
   ms.date="02/19/2016"
   ms.author="mobandyo;bryanla"/>

# Gain insights into your Microsoft Azure resource consumption 

Customers and partners require the ability to accurately predict and manage their Azure costs.  As they move from a Capex to an Opex model, they also need the ability to do showback vs. chargeback analysis, as well as provide mode fidelity in estimation and billing, especially for large cloud deployments. 

The Azure Resource Usage and Rate Card APIs discussed in this article address these needs, by enabling new insights into your consumption of Azure resources.  

## Introducing the Azure Resource Usage and RateCard APIs 

The Azure Resource Usage and RateCard APIs are implemented as a Resource Provider, as part of the family of APIs exposed by the Azure Resource Manager.  

### Azure Resource Usage API (Preview)
Customers and partners can use the Azure Resource Usage API to get their estimated Azure consumption data. The features include:
	
- **Azure Role-based Access Control** - Customers and partners can configure their access policies on the [Azure Preview Portal](https://portal.azure.com) or through [Azure PowerShell cmdlets](powershell-install-configure.md) to specify which users or applications can get access to the subscription’s usage data. Callers must use standard Azure Active Directory tokens for authentication. The caller must also be added to either the Reader, Owner or Contributor role to get access to the usage data for a particular Azure subscription.

- **Hourly or Daily Aggregations** - Callers can specify whether they want their Azure usage data in hourly buckets or daily buckets. The default is daily.

- **Instance metadata provided (includes resource tags)** – Instance-level details such as the fully qualified resource uri (/subscriptions/{subscription-id}/..), along with the resource group information and resource tags will be provided in the response. This will help customers deterministically and programmatically allocate usage by the tags, for use-cases like cross-charging.

- **Resource metadata provided** - Resource details such as the meter name, meter category, meter sub category, unit and region will also be passed in the response, to give the callers a better understanding of what was consumed. We are also working to align  resource metadata terminology across the Azure portal, Azure usage CSV, EA billing CSV and other public-facing experiences, to enable customers to correlate data across experiences.

- **Usage for all offer types** – Usage data will be accessible for all offer types including Pay-as-you-go, MSDN, Monetary commitment, Monetary credit, and EA among others.

### Azure Resource RateCard API (Preview)
Customers and partners can use the Azure Resource RateCard API to get the list of available Azure resources, along with estimated pricing information for each. The features include:

- **Azure Role-based Access Control** - Customers and partners can configure their access policies on the [Azure Preview Portal](https://portal.azure.com) or through [Azure PowerShell cmdlets](powershell-install-configure.md) to specify which users or applications can get access to the RateCard data. Callers must use standard Azure Active Directory tokens for authentication. The caller must also be added to either the Reader, Owner or Contributor role to get access to the usage data for a particular Azure subscription.
	
- **Support for Pay-as-you-go, MSDN, Monetary commitment, and Monetary credit offers (EA not supported)** - This API provides Azure offer-level rate information, vs. subscription-level.  The caller of this API must pass in the offer information to get resource details and rates.  As EA offers have customized rates per enrollment, we are unable to provide the EA rates at this time.

## Scenarios

Here are some of the scenarios that are made possible with the combination of the Usage and the RateCard APIs:

- **Azure spend during the month** - Customers can use the Usage and RateCard APIs in combination to get better insights into their cloud spend during the month, by analyzing the hourly and daily buckets of usage and charge estimates. 

- **Set up alerts** – Customers and partners can set up resource-based or monetary-based alerts on their cloud consumption by getting the estimated consumption and charge estimate using the Usage and the RateCard API.

- **Predict bill** – Customers and partners can get their estimated consumption and cloud spend and apply machine learning algorithms to predict what their bill would be at the end of the billing cycle.

- **Pre-consumption cost analysis** – Customers can also use the RateCard API to predict how much their bill would be if they were to move their workloads to Azure, by providing desired usage numbers. If customers have existing workloads in other clouds or private clouds, they can also map their usage with the Azure rates to get a better estimate of their estimated Azure spend. This provides an enhanced view of what can be obtained via the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/), as (for example) our Billing partners provide the ability to pivot on offer and compare/contrast between different offer types beyond Pay-As-You-Go, including Monetary commitment and Monetary credit. The APIs also provide the ability to do cost estimation changes by region, enabling the type of what-if analysis required to make deployment decisions, as deploying resources in different DCs around the world can have a direct impact on total cost.

- **What-if analysis** -

	- Customers and partners can determine whether it would be more cost-effective to run their workloads in another region, or on another configuration of the Azure resource. Azure resource costs may differ based on the Azure region in which they are running, and this allows customers and partners to get cost optimizations.

	- Customers and partners can also determine if another Azure offer type gives a better rate on an Azure resource.

## Partner solutions

[Microsoft Azure Usage and RateCard APIs Enable Cloudyn to Provide ITFM for Customers](billing-usage-rate-card-partner-solution-cloudyn.md) describes the integration experience offered by Azure Billing API partner [Cloudyn](https://www.cloudyn.com/microsoft-azure/).  This article provides detailed coverage of their experiences, including a short video which shows how an Azure customer can use Cloudyn and the Azure Billing APIs to gains insights from their Azure consumption data. 

[Cloud Cruiser and Microsoft Azure Billing API Integration](billing-usage-rate-card-partner-solution-cloudcruiser.md) describes how [Cloud Cruiser's Express for Azure Pack](http://www.cloudcruiser.com/partners/microsoft/) works directly from the  WAP portal, enabling customers to seamlessly manage both the operational and financial aspects of their Microsoft Azure private or hosted public cloud from a single user interface.   

## Next Steps
+ Check out the [Azure Billing REST API Reference](https://msdn.microsoft.com/library/azure/1ea5b323-54bb-423d-916f-190de96c6a3c) for more details on both APIs, which are part of the set of APIs provided by the Azure Resource Manager.
+ If you would like to dive right into the sample code, check out our Microsoft Azure Billing API Code Samples on [Azure Code Samples](https://azure.microsoft.com/documentation/samples/?term=billing).

## Learn more
+ See the [Azure Resource Manager Overview](resource-group-overview.md) article to learn more about the Azure Resource Manager.
+ For additional information on the suite of tools necessary to help in gaining an understanding of cloud spend, please refer to  Gartner article [Market Guide for IT Financial Management (ITFM) Tools](http://www.gartner.com/technology/reprints.do?id=1-212F7AL&ct=140909&st=sb).
