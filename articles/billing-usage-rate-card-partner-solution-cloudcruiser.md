<properties
   pageTitle="Cloud Cruiser and Microsoft Azure Billing API Integration | Microsoft Azure"
   description="Provides a unique perspective from Microsoft Azure Billing partner Cloud Cruiser, on their experiences integrating the Azure Billing APIs into their product.  This is especially useful for Azure and Cloud Cruiser customers that are interested in using/trying Cloud Cruiser for Microsoft Azure Pack."
   services=""
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
   ms.date="02/19/2016"
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

### Cloud Cruiser’s Interface to Azure RateCard API
Cloud Cruiser can leverage the RateCard API information in different ways. For this article, we will show how it can be used to make IaaS workload cost simulation and analysis.

To demonstrate this use case, imagine a workload of several instances running on Microsoft Azure Pack (WAP). The goal is to simulate this same workload on Azure, and estimate the costs of doing such migration. In order to create this simulation, there are two main tasks to be performed:

1. **Import and process the service information collected from the RateCard API** - This task is also performed on the workbooks, where the extract from the RateCard API is transformed and published to a new rate plan. This new rate plan will be used on the simulations to estimate the Azure prices.

2. **Normalize WAP services and Azure services for IaaS** - By default, WAP services are based on individual resources (CPU, Memory Size, Disk Size, etc.) while Azure services are based on instance size (A0, A1, A2, etc.). This first task can be performed by Cloud Cruiser’s ETL engine, called workbooks, where these resources can be bundled on instance sizes, analogous to Azure instance services.

### Import data from the RateCard API

Cloud Cruiser workbooks provide an automated way to collect and process information from the RateCard API.  ETL (extract-transform-load) workbooks allow you to configure the collection, transformation, and publishing of data into the Cloud Cruiser database.

Each workbook can have one or multiple collections. This allows you to correlate information from different sources to complement or augment the usage data. In the two screenshots below, we showing creating a new *collection* in an existing workbook, and importing information into the *collection* from the RateCard API:

![Figure 1 - Creating a new collection][1]

![Figure 2 - Import data from the new collection][2]

After importing the data into the workbook, it’s possible to create multiple steps and transformation processes, to modify and model the data. For this example, since we are only interested in infrastructure-as-a-Service (IaaS,) we can use the transformation steps to remove unnecessary rows, or records, related to services other than IaaS.

The screenshot below shows the transformation steps used to process the data collected from RateCard API:

![Figure 3 - Transformation steps to process collected data from RateCard API][3]

### Defining New Services and Rate Plans

There are different ways to define services on Cloud Cruiser. One of the options is to import the services from the usage data. This method is commonly used when working with public clouds, where the services are already defined by the provider.

A Rate Plan is a set of rates or prices that can be applied to different services, based on effective dates, or group of customers, among other options. Rate Plans can also be used on Cloud Cruiser to create simulation or “What-if” scenarios, to understand how changes in services can affect the total cost of a workload.

In this example, we will use the service information from the RateCard API to define new services in Cloud Cruiser. In the same way, we can use the rates associated to the services to create a new Rate Plan on Cloud Cruiser.

At the end of the transformation process, it is possible to create a new step and publish the data from the RateCard API as new services and rates.

![Figure 4 - Publishing the data from the RateCard API as new Services and Rates][4]

### Verify Azure Services and Rates

After publishing the services and rates, you can verify the list of imported services in Cloud Cruiser’s *Services* tab:

![Figure 5 - Verifying the new Services][5]

On the *Rate Plans* tab, you can check the new rate plan called “AzureSimulation” with the rates imported from the RateCard API.

![Figure 6 - Verifying the new Rate Plan and associated rates][6]

### Normalize WAP and Azure Services

By default, WAP provides usage information based on the use of compute, memory and network resources. In Cloud Cruiser, you can define your services based directly on the allocation or metered usage of these resources. For example, you can set a basic rate for each hour of CPU usage, or charge the GB of memory allocated to an instance.

For this example, in order to compare costs between WAP and Azure, we need to aggregate the resource usage on WAP into bundles, which can then be mapped to Azure services. This transformation can be implemented easily in the workbooks:

![Figure 7 - Transforming WAP data to normalize services][7]

The last step at the workbook is to publish the data into the Cloud Cruiser database. During this step, the usage data is now bundled into services (that map to the Azure Services) and tied to default rates to create the charges.

After finishing the workbook, you can automate the processing of the data, by adding a new task on the scheduler and specifying the frequency and time for the workbook to run.

![Figure 8 - Workbook scheduling][8]

### Create Reports for Workload Cost Simulation Analysis

As the usage is collected and the charges are loaded into the Cloud Cruiser database, we can then leverage the Cloud Cruiser Insights module – an advanced analytics reporting tool – to create the workload cost simulation that we desire.

In order to demonstrate this scenario, we created the following report:

![Cost Comparison][9]

The top graph shows a cost comparison broken by services and compares the price of running the workload for each specific service between WAP (dark blue color) and Azure (light blue color).

The bottom graph shows the same data but broken down by department, demonstrating the costs for each department to run their workload on WAP and Azure, along with the difference between these two – Savings bar (green color).

## Azure Usage API


### Introduction

Microsoft recently
introduced the Azure Usage API, allowing subscribers to programmatically pull
in usage data to gain insights into their consumption. This is great news for Cloud
Cruiser customers that can take advantage of the richer dataset available
through this API.

Cloud Cruiser can leverage the integration with the Usage API in several ways. The granularity
(hourly usage information) and resource metadata information available through
the API provides the necessary dataset to support flexible Showback or
Chargeback models. 

In this tutorial, we will
present one example of how Cloud Cruiser can benefit from the Usage API
information. More specifically, we will create a new Resource Group on Azure,
associate tags for the account structure, and then describe the process of
pulling and processing the tag information into Cloud Cruiser.
 
The final goal is to be able
to create reports like the one below, and be able to analyze cost and
consumption based on the account structure populated by the tags.

![Figure 10 - Report with breakdowns using tags][10]

### Microsoft Azure Tags

The data available through the Azure Usage API includes not only consumption information, but also resource metadata including any tags associated with it. Tags provide an easy way to organize your resources, but in order to be effective, you need to ensure that:

- Tags are correctly applied to the resources at provision time
- Tags are properly used on the Showback/Chargeback process to tie the usage to the organization’s account structure.

Both of these requirements can be challenging, especially when there is some sort of manual process on the provision or charging side. Mistyped, incorrect or even missing tags are common complaints from customers when using tags and these errors can make life on the charging side very difficult.

With the new Azure Usage API, Cloud Cruiser can pull resource tagging information, and through a very sophisticated ETL tool called workbooks, fix these common tagging errors. Through transformation steps leveraging regular expressions and data
correlation, Cloud Cruiser is able to identify incorrectly tagged resources and apply the correct tags, filling the gaps and ensuring the correct association of the resources with the consumer.

On the charging side,
Cloud Cruiser automates the Showback/Chargeback process, and can leverage the
tag information to tie the usage to the appropriate consumer (Department,
Division, Project, etc.). This automation provides a huge improvement and can
ensure a consistent and auditable charging process.
 

### Creating a Resource Group with tags on Microsoft Azure
The first step in this tutorial is to create a new Resource Group on the Azure Portal and then create new tags to associate to the resources. For this example, we will be creating
the following tags: Department, Environment, Owner, Project.

The screenshot below of the Azure Portal shows a sample Resource Group with the associated tags.

![Figure 11 - Resource Group with associated tags on Azure Portal][11]

The next step is to pull the information from the Usage API into Cloud Cruiser. The Usage API currently provides responses in JSON format. Here is a sample of the data retrieved:


    {
      "id": "/subscriptions/bb678b04-0e48-4b44-XXXX-XXXXXXX/providers/Microsoft.Commerce/UsageAggregates/Daily_BRSDT_20150623_0000",
      "name": "Daily_BRSDT_20150623_0000",
      "type": "Microsoft.Commerce/UsageAggregate",
      "properties":
      {
        "subscriptionId": "bb678b04-0e48-4b44-XXXX-XXXXXXXXX",
        "usageStartTime": "2015-06-22T00:00:00+00:00",
        "usageEndTime": "2015-06-23T00:00:00+00:00",
        "meterName": "Compute Hours",
        "meterRegion": "",
        "meterCategory": "Virtual Machines",
        "meterSubCategory": "Standard_D1 VM (Non-Windows)",
        "unit": "Hours",
        "instanceData": "{\"Microsoft.Resources\":{\"resourceUri\":\"/subscriptions/bb678b04-0e48-4b44-XXXX-XXXXXXXX/resourceGroups/DEMOUSAGEAPI/providers/Microsoft.Compute/virtualMachines/MyDockerVM\",\"location\":\"eastus\",\"tags\":{\"Department\":\"Sales\",\"Project\":\"Demo Usage API\",\"Environment\":\"Test\",\"Owner\":\"RSE\"},\"additionalInfo\":{\"ImageType\":\"Canonical\",\"ServiceType\":\"Standard_D1\"}}}",
        "meterId": "e60caf26-9ba0-413d-a422-6141f58081d6",
        "infoFields": {},
        "quantity": 8

      },
	},


### Import data from the Usage API into Cloud Cruiser

Cloud Cruiser workbooks provide an automated way to collect and process information from the Usage API. An ETL (extract-transform-load) workbook allows you to configure the
collection, transformation, and publishing of data into the Cloud Cruiser database.

Each workbook can have one or multiple collections. This allows you to correlate information from different sources to complement or augment the usage data. For this example, we will create a new sheet in the Azure template workbook (_UsageAPI)_ and set a new _collection_ to import information from the Usage API.

![Figure 3 - Usage API data imported into the UsageAPI sheet][12]

Notice that this workbook already has other sheets to import services from Azure (_ImportServices_), and process the consumption information from the Billing API (_PublishData_).

We are going to extract and process the information from the Usage API on the _UsageAPI_ sheet, and correlate the information with the consumption data from the Billing API on the _PublishData_ sheet.

### Processing the tag information from the Usage API

After importing the data into the workbook, we will create transformation steps in the _UsageAPI_ sheet in order to process the information from the API. First step is to use a “JSON split” processor to extract the tags from a single field (as they are imported from the API) and create new fields for each one of them (Department, Project, Owner and
Environment).

![Figure 4 - Create new fields for the tag information][13]

Notice that the “Networking” service is missing the tag information (yellow box), but we can tell that this service is part of the same Resource Group by looking at the _ResourceGroupName_ field. Since we have the tags for the other resources from this same Resource Group, we can use this information to apply the missing tags to this resource later in the process.

The next step is to create a lookup table associating the information from the tags to the _ResourceGroupName_. This lookup table will be used on the next step to enrich the consumption data with tag information.

### Adding the tag information to the consumption data

Now we can jump to the _PublishData_ sheet, which processes the consumption information from the Billing API, and add the fields extracted from the tags. This process is performed by looking at the lookup table created on the previous step, using the _ResourceGroupName_
as the key for the lookups.

![Figure 5 - Populating the account structure with the information from the lookups][14]

Notice that the appropriate account structure fields for the “Networking” service were applied, fixing the issue with the missing tags. We also populated the account structure
fields for resources other than our target Resource Group with “Other”, in order to differentiate them on the reports.

Now we just need to add another step to publish the usage data. During this step, the appropriate rates for each service defined on our Rate Plan will be applied to the usage
information, and the resulting charge is then loaded into the database.

The best part is that you only have to go through this process once. When the workbook is completed, you just need to add it to the scheduler and it will run hourly or daily at the
scheduled time. Then it’s just a matter of creating new reports, or customizing
existing ones, in order to visualize and analyze the data to get meaningful
insights from your cloud usage.

### Next Steps

+ For detailed instructions on creating Cloud Cruiser workbooks and reports, please refer to Cloud Cruiser’s online [documentation](http://docs.cloudcruiser.com/) (valid login required).  For more information about Cloud Cruiser, please contact [info@cloudcruiser.com](mailto:info@cloudcruiser.com).
+ See [Gain insights into your Microsoft Azure resource consumption](billing-usage-rate-card-overview.md) for an overview of the Azure Resource Usage and RateCard APIs.
+ Check out the [Azure Billing REST API Reference](https://msdn.microsoft.com/library/azure/1ea5b323-54bb-423d-916f-190de96c6a3c) for more information on both APIs, which are part of the set of APIs provided by the Azure Resource Manager.
+ If you would like to dive right into the sample code, check out our Microsoft Azure Billing API Code Samples on [Azure Code Samples](https://azure.microsoft.com/documentation/samples/?term=billing).

### Learn More
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
[10]: ./media/billing-usage-rate-card-partner-solution-cloudcruiser/1_ReportWithTags.png "Figure 10 - Report with breakdowns using tags"
[11]: ./media/billing-usage-rate-card-partner-solution-cloudcruiser/2_ResourceGroupsWithTags.png "Figure 11 - Resource Group with associated tags on Azure Portal"
[12]: ./media/billing-usage-rate-card-partner-solution-cloudcruiser/3_ImportIntoUsageAPISheet.png "Figure 12 - Usage API data imported into the UsageAPI sheet"
[13]: ./media/billing-usage-rate-card-partner-solution-cloudcruiser/4_NewTagField.png "Figure 13 - Create new fields for the tag information"
[14]: ./media/billing-usage-rate-card-partner-solution-cloudcruiser/5_PopulateAccountStructure.png "Figure 14 - Populating the account structure with the information from the lookups"
