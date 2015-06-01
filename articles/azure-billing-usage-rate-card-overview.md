<properties
   pageTitle="Azure Billing Usage and RateCard APIs"
   description="Provides a conceptual overview of the Azure Billing Usage and RateCard  APIs, which are provided by the Microsoft Azure Commerce Resource Provider."
   services="billing"
   documentationCenter=""
   authors="BryanLa"
   manager="mbaldwin"
   editor=""/>

<tags
   ms.service="billing"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="billing"
   ms.date="05/22/2015"
   ms.author="mobandyo;bryanla"/>

# Azure Billing Usage and RateCard APIs

Customers and partners struggle with the ability to accurately predict and manage their Azure costs using the tools provided by Microsoft.  As customers move from a Capex model to an Opex model and require the ability to do show-back or charge-back, the requirement to provide mode fidelity in estimation and billing is growing and becoming a basic requirement for large cloud deployments. 

The solutions provided by Microsoft today are limited, and customers have been requesting the ability to get better insights out of their consumption data.  The Azure Billing Usage and Rate Card APIs discussed in this article will dramatically improve the situation, by enabling new insights not previously available.  The suite of tools necessary to help customers understand their cloud spend are called IT Financial Management tools (for more details, refer to Gartner article [Market Guide for IT Financial Management Tools](http://www.gartner.com/technology/reprints.do?id=1-212F7AL&ct=140909&st=sb)).

## Get insights into your Azure consumption

### Azure Usage API (Preview)
This REST API is planned to be part of the Azure Resource Management REST API, which customers and partners can use to get programmatic access to their estimated Azure consumption data. Here are some features:
	
- **Supports Azure Role-based Access Control** - customers and partners can configure their access policies on the Azure Preview Portal or through PowerShell cmdlets to dictate what users or applications can get access to the subscription’s usage data. Callers will be required to use standard Azure Active Directory tokens for authentication. The caller will need to be added to either the Reader, Owner or Contributor role to be authorized to get access to the usage data for a particular Azure subscription.

- **Hourly or Daily Aggregations** - callers can specify whether they want their Azure usage data in hourly buckets or daily buckets. The default is daily.

- **Instance metadata provided (includes resource tags)** – The instance-level details like the fully qualified resource uri (/subscriptions/{subscription-id}/..), along with the resource group information and resource tags will be provided in the response. This will help customers deterministically and programmatically allocate usage by the tags, for use-cases like cross-charging.

- **Resource metadata provided** - The resource details like the meter name, meter category, meter sub category, unit and region will also be passed in the response, to give the callers a better understanding of what was consumed. We are also aligning what the resource metadata is called across the Azure portal, Azure usage CSV, EA billing CSV and other public-facing experiences, to enable customers to correlate data across experiences.

- **Usage for all offer types** – Usage data will be accessible for all offer types including Pay-as-you-go, MSDN, Monetary commitment, Monetary credit, EA among others.

### Azure RateCard API (Preview)
This REST API is also planned to be part of the Azure Resource Management REST API, which customers and partners can use to get programmatic access to the list of resources along with their estimated pricing information.

- **Supports Azure Role-based Access Control** - customers and partners can configure their access policies on the Azure Preview Portal or through PowerShell cmdlets to dictate what users or applications can get access to the RateCard information. Callers will be required to use standard Azure Active Directory tokens for authentication. The caller will need to be added to either the Reader, Owner or Contributor role to be authorized to get access to the usage data for a particular Azure subscription.
	
- **Support for Pay-as-you-go, MSDN, Monetary commitment, and Monetary credit offers (EA not supported)** - This API provides the rates at an offer-level, and not specific to an Azure subscription-level, and as EA offers have customized rates per enrollment, we are unable to provide the EA rates at this moment. The caller of this API would be required to pass in the offer information to get back the resource details and rates. 

## Scenarios

Here are some of the scenarios that are made possible with the combination of the Usage and the RateCard APIs:

- Azure spend during the month- customers can use the Usage API and the RateCard API in combination to get better insights into their cloud spend during the month, by looking into the hourly and daily buckets of usage and charge estimates. 

- Setup alerts – customers and partners can setup up resource-based or monetary-based alerts on their cloud consumption by getting the estimated consumption and charge estimate by calling the Usage and the RateCard API.

- Predict bill – customers and partners can get their estimated consumption and cloud spend and apply machine learning algorithms to predict what their bill would be at the end of the billing cycle.

- Pre-consumption cost analysis – before customers move their workloads to Azure, they can use the RateCard API to get an estimate of how much would their bill be if they were to move their workloads to Azure by providing desired usage numbers. If customers have existing workloads in other clods or private clouds, they can also map their usage with the Azure rates to get a better estimate of their estimated Azure spend.

- What-if analysis:

	- Customers and partners can determine whether it would be more cost-effective to run their workloads in another region or on another configuration of the azure resource. Azure resource costs can tend to differ based on the Azure region they are running in, so this can provide an opportunity for customers and partners to get cost optimizations.

	- Customers and partners can find out if another Azure offer type gives a better rate on an Azure resource.

## Next Steps

+ [TODO:Update link] Check out the [Azure Billing REST API Reference](https://msdn.microsoft.com/library/azure/dn948464.aspx) for more information on both APIs, which are part of a set of APIs provided by the Azure Resource Manager.
+ To learn more about Azure Resource Manager, see the [Azure Resource Manager Overview](/resource-group-overview/) article.
+ To learn more about  Azure Resource Management APIs, see [Azure Billing REST API Reference](https://msdn.microsoft.com/library/azure/dn948464.aspx)  

