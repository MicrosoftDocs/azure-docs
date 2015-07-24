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
   ms.date="06/17/2015"
   ms.author="mobandyo;sirishap;bryanla"/>

# Cloud Cruiser and Microsoft Azure Billing API Integration 

This article describes how the information collected from the new Microsoft Azure Billing APIs can be used in Cloud Cruiser for workflow cost simulation and analysis.

## Azure RateCard API
The RateCard API provides rate information from Azure. After authenticating with the proper credentials, you can query the API to collect metadata about the services available on Azure, along with the rates associated with your Offer ID. 

Below is a sample response from the API showing the prices for the A0 (Windows) instance:

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

## Cloud Cruiser’s Interface to Azure RateCard API
Cloud Cruiser can leverage the RateCard API information in different ways. For this article, we will show how it can be used to make IaaS workload cost simulation and analysis.

To demonstrate this use case, imagine a workload of several instances running on Microsoft Azure Pack (WAP). The goal is to simulate this same workload on Azure, and estimate the costs of doing such migration. In order to create this simulation, there are two main tasks to be performed:

1. **Import and process the service information collected from the RateCard API** - This task is also performed on the workbooks, where the extract from the RateCard API is transformed and published to a new rate plan. This new rate plan will be used on the simulations to estimate the Azure prices.

2. **Normalize WAP services and Azure services for IaaS** - By default, WAP services are based on individual resources (CPU, Memory Size, Disk Size, etc.) while Azure services are based on instance size (A0, A1, A2, etc.). This first task can be performed by Cloud Cruiser’s ETL engine, called workbooks, where these resources can be bundled on instance sizes, analogous to Azure instance services.

## Import data from the RateCard API

Cloud Cruiser workbooks provide an automated way to collect and process information from the RateCard API.  ETL (extract-transform-load) workbooks allow you to configure the collection, transformation, and publishing of data into the Cloud Cruiser database.

Each workbook can have one or multiple collections. This allows you to correlate information from different sources to complement or augment the usage data. In the two screenshots below, we showing creating a new *collection* in an existing workbook, and importing information into the *collection* from the RateCard API:

![Figure 1 - Creating a new collection][1]

![Figure 2 - Import data from the new collection][2]

After importing the data into the workbook, it’s possible to create multiple steps and transformation processes, to modify and model the data. For this example, since we are only interested in infrastructure-as-a-Service (IaaS,) we can use the transformation steps to remove unnecessary rows, or records, related to services other than IaaS.

The screenshot below shows the transformation steps used to process the data collected from RateCard API:

![Figure 3 - Transformation steps to process collected data from RateCard API][3]

## Defining New Services and Rate Plans

There are different ways to define services on Cloud Cruiser. One of the options is to import the services from the usage data. This method is commonly used when working with public clouds, where the services are already defined by the provider. 

A Rate Plan is a set of rates or prices that can be applied to different services, based on effective dates, or group of customers, among other options. Rate Plans can also be used on Cloud Cruiser to create simulation or “What-if” scenarios, to understand how changes in services can affect the total cost of a workload. 

In this example, we will use the service information from the RateCard API to define new services in Cloud Cruiser. In the same way, we can use the rates associated to the services to create a new Rate Plan on Cloud Cruiser.

At the end of the transformation process, it is possible to create a new step and publish the data from the RateCard API as new services and rates.

![Figure 4 - Publishing the data from the RateCard API as new Services and Rates][4]

## Verify Azure Services and Rates

After publishing the services and rates, you can verify the list of imported services in Cloud Cruiser’s *Services* tab:

![Figure 5 - Verifying the new Services][5]

On the *Rate Plans* tab, you can check the new rate plan called “AzureSimulation” with the rates imported from the RateCard API.

![Figure 6 - Verifying the new Rate Plan and associated rates][6]

## Normalize WAP and Azure Services

By default, WAP provides usage information based on the use of compute, memory and network resources. In Cloud Cruiser, you can define your services based directly on the allocation or metered usage of these resources. For example, you can set a basic rate for each hour of CPU usage, or charge the GB of memory allocated to an instance.

For this example, in order to compare costs between WAP and Azure, we need to aggregate the resource usage on WAP into bundles, which can then be mapped to Azure services. This transformation can be implemented easily in the workbooks:

![Figure 7 - Transforming WAP data to normalize services][7]

The last step at the workbook is to publish the data into the Cloud Cruiser database. During this step, the usage data is now bundled into services (that map to the Azure Services) and tied to default rates to create the charges.

After finishing the workbook, you can automate the processing of the data, by adding a new task on the scheduler and specifying the frequency and time for the workbook to run.

![Figure 8 - Workbook scheduling][8]

## Create Reports for Workload Cost Simulation Analysis

As the usage is collected and the charges are loaded into the Cloud Cruiser database, we can then leverage the Cloud Cruiser Insights module – an advanced analytics reporting tool – to create the workload cost simulation that we desire. 

In order to demonstrate this scenario, we created the following report: 

![Cost Comparison][9]

The top graph shows a cost comparison broken by services and compares the price of running the workload for each specific service between WAP (dark blue color) and Azure (light blue color). 

The bottom graph shows the same data but broken down by department, demonstrating the costs for each department to run their workload on WAP and Azure, along with the difference between these two – Savings bar (green color).

## Next Steps

+ For detailed instructions on creating Cloud Cruiser workbooks and reports, please refer to Cloud Cruiser’s online [documentation](http://docs.cloudcruiser.com/) (valid login required).  For more information about Cloud Cruiser, please contact [info@cloudcruiser.com](mailto:info@cloudcruiser.com).
+ See [Gain insights into your Microsoft Azure resource consumption](billing-usage-rate-card-overview.md) for an overview of the Azure Resource Usage and RateCard APIs. 
+ Check out the [Azure Billing REST API Reference](https://msdn.microsoft.com/library/azure/1ea5b323-54bb-423d-916f-190de96c6a3c) for more information on both APIs, which are part of the set of APIs provided by the Azure Resource Manager.
+ If you would like to dive right into the sample code, check out our [Microsoft Azure Billing API Code Samples on Github](https://github.com/Azure/BillingCodeSamples).

## Learn More
+ See the [Azure Resource Manager Overview](resource-group-overview.md) article to learn more about the Azure Resource Manager.

<!--Image references-->
[1]: ./media/billing-usage-rate-card-partner-solution-cloudcruiser/Create-New-Workbook-Collection.png "Figure 1 - Creating a new collection"
[2]: ./media/billing-usage-rate-card-partner-solution-cloudcruiser/Import-Data-From-RateCard.png "Figure 2 - Import data from the new collection"
[3]: ./media/billing-usage-rate-card-partner-solution-cloudcruiser/Transformation-Steps-Process-RateCard-Data.png "Figure 3 - Transformation steps to process collected data from RateCard API"
[4]: ./media/billing-usage-rate-card-partner-solution-cloudcruiser/Publish-RateCard-Data-New-Services-Rates.png "Figure 4 - Publishing the data from the RateCard API as new Services and Rates"
[5]: ./media/billing-usage-rate-card-partner-solution-cloudcruiser/Verify-Azure-Services-And-Pricing1.png "Figure 5 - Verifying the new Services"
[6]: ./media/billing-usage-rate-card-partner-solution-cloudcruiser/Verify-Azure-Services-And-Pricing2.png "Figure 6 - Verifying the new Rate Plan and associated rates"
[7]: ./media/billing-usage-rate-card-partner-solution-cloudcruiser/Transforming-WAP-Normalize-Services.png "Figure 7 - Transforming WAP data to normalize services"
[8]: ./media/billing-usage-rate-card-partner-solution-cloudcruiser/Workbook-Scheduling.png "Figure 8 - Workbook scheduling"
[9]: ./media/billing-usage-rate-card-partner-solution-cloudcruiser/Workload-Cost-Simulation-Report.png "Figure 9 - Sample Report for the Workload cost comparison scenario"