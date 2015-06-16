<properties
   pageTitle="Cloud Cruiser and Microsoft Azure Billing API Integration"
   description="Provides a unique perspective from Microsoft Azure Billing partner Cloud Cruiser, on their experiences integrating the Azure Billing APIs into their product.  This is especially useful for Azure and Cloud Cruiser customers that are interested in using/trying Cloud Cruiser for Microsoft Azure Pack."
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
   ms.date="06/14/2015"
   ms.author="mobandyo;sirishap;bryanla"/>

# Cloud Cruiser and Microsoft Azure Billing API Integration 

This article describes how the information collected from the new Microsoft Azure Billing   APIs can be used in Cloud Cruiser for workflow cost simulation and analysis.

## Azure RateCard API
The RateCard API provides information on services and prices from Azure.  Below is a sample JSON response from the API showing the prices for the A0 (Windows) instance.

    {       
		"MeterId": "0e59ad56-03e5-4c3d-90d4-6670874d7e29",       
		"MeterName": "Compute Hours",       
		"MeterCategory": "Virtual Machines",       
		"MeterSubCategory": "A0 VM (Windows)",       
		"Unit": "Hours",       
		"MeterRates": 
		{         
			"0": 0.029       
		},       
		"EffectiveDate": "2014-08-01T00:00:00Z",       
		"IncludedQuantity": 0.0     
	}, 

The API provides metadata information for the services, along with the rates for a specific OfferID.

## Cloud Cruiser’s Interface to Azure RateCard API
Cloud Cruiser can leverage the RateCard API information in different ways. For this article, we will show how it can be used to make IaaS workload cost simulation and analysis.

To demonstrate this use case, imagine a workload of several instances running on Microsoft Azure Pack (WAP). The goal is to simulate this same workload on Azure, and estimate the costs of doing such migration. In order to create this simulation, there are two main tasks to be performed:

1. **Normalize WAP services and Azure services for IaaS** - By default, WAP services are based on individual resources (CPU, Memory Size, Disk Size, etc.) while Azure services are based on instance size (A0, A1, A2, etc.). This first task can be performed by Cloud Cruiser’s ETL engine, called workbooks, where these resources can be bundled on instance sizes, analogous to Azure instance services.

2. **Import and process the service information collected from the RateCard API** - This task is also performed on the workbooks, where the extract from the RateCard API is transformed and published to a new rate plan. This new rate plan will be used on the simulations to estimate the Azure prices.

## Import data from the RateCard API

This screenshot shows the data collected from the RateCard API, already parsed from the original JSON format.

![RateCard JSON Response][1]

## Associate the Rates to a New Plan

This feature allows you to publish the information from the RateCard API as new services, and associate the rates to a new rate plan.

![Associate Rates to New Plan][2]

## Verify Azure Services and Pricing

This screenshot shows the new rate plan with the services and rates imported from the Rate Card API.

![New Rate Plan][3]

## Create reports to make the workload cost simulation

The top graph on the screenshot shows a cost comparison based on services. The bottom graph shows a cost comparison broken out by department, and including the estimate savings.

![Cost Comparison][4]

## Next Steps

+ For detailed instructions on creating Cloud Cruiser workbooks and reports, please refer to Cloud Cruiser’s online [documentation](http://docs.cloudcruiser.com/) (valid login required).  For more information about Cloud Cruiser, please contact [info@cloudcruiser.com](mailto:info@cloudcruiser.com).
+ See [Gain insights into your Microsoft Azure resource consumption](billing-usage-rate-card-overview.md) for an overview of the Azure Resource Usage and RateCard APIs. 
+ Check out the [Azure Billing REST API Reference](https://msdn.microsoft.com/library/azure/1ea5b323-54bb-423d-916f-190de96c6a3c) for more information on both APIs, which are part of the set of APIs provided by the Azure Resource Manager.
+ If you would like to dive right into the sample code, check out our [Microsoft Azure Billing API Code Samples on Github](https://github.com/Azure/BillingCodeSamples).

## Learn More
+ See the [Azure Resource Manager Overview](resource-group-overview.md) article to learn more about the Azure Resource Manager.

<!--Image references-->
[1]: ./media/billing-usage-rate-card-partner-solution-cloudcruiser/Import-Data-From-RateCard.png
[2]: ./media/billing-usage-rate-card-partner-solution-cloudcruiser/Associate-Rates-To-New-Plan.png
[3]: ./media/billing-usage-rate-card-partner-solution-cloudcruiser/Verify-Azure-Services-And-Pricing.png
[4]: ./media/billing-usage-rate-card-partner-solution-cloudcruiser/Workload-Cost-Simulation-Report.png