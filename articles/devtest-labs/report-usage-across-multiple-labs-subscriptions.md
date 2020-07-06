---
title: Azure DevTest Labs usage across multiple labs and subscriptions
description: Learn how to report Azure DevTest Labs usage across multiple labs and subscriptions.
ms.topic: article
ms.date: 06/26/2020
---

# Report Azure DevTest Labs usage across multiple labs and subscriptions

Most large organizations want to track resource usage to be more effective with those resources by visualizing trends and outliers in the usage. Based on resource usage the lab owners or managers can customize the labs to [improve resource usage and costs](https://docs.microsoft.com/azure/billing/billing-getting-started). In Azure DevTest Labs, you can download resource usage per lab allowing a deeper historical look into the usage patterns. These usage patterns can help pinpoint changes to improve efficiency. Most enterprises want both individual lab usage and overall usage across [multiple labs and subscriptions](https://docs.microsoft.com/azure/architecture/cloud-adoption/decision-guides/subscriptions/). 

This article discusses how to handle resource usage information across multiple labs and subscriptions.

![Report usage](./media/report-usage-across-multiple-labs-subscriptions/report-usage.png)

## Individual lab usage

This section discusses how to export resource usage for a single lab.

Before you can export resource usage of DevTest Labs, you have to set up an Azure Storage account to allow the different files that contain the usage data to be stored. There are two common ways to execute the export of data:

* [DevTest Labs REST API](https://docs.microsoft.com/rest/api/dtl/labs/exportresourceusage) 
* The PowerShell Az.Resource module [Invoke-AzResourceAction](https://docs.microsoft.com/powershell/module/az.resources/invoke-azresourceaction?view=azps-2.5.0&viewFallbackFrom=azps-2.3.2) with the action of `exportResourceUsage`, the lab resource ID, and the necessary parameters. 

    The [export or delete personal data](personal-data-delete-export.md) article contains a sample PowerShell script with detailed information on the data that is exported. 

    > [!NOTE]
    > The date parameter doesn't include a time stamp so the data includes everything from midnight based on the time zone where the lab is located.

Once the export is complete, there will be multiple CSV files in the blob storage with the different resource information.
  
Currently there are two CSV files:

* *virtualmachines.csv* - contains information about the virtual machines in the lab
* *disks.csv* - contains information about the different disks in the lab 

These files are stored in the *labresourceusage* blob container under the lab name, Lab unique ID, date executed, and either full or the start date that was based into the export request. An example blob structure would be:

* `labresourceusage/labname/1111aaaa-bbbb-cccc-dddd-2222eeee/<End>DD26-MM6-2019YYYY/full/virtualmachines.csv`
* `labresourceusage/labname/1111aaaa-bbbb-cccc-dddd-2222eeee/<End>DD-MM-YYYY/26-6-2019/20-6-2019<Start>DD-MM-YYYY/virtualmachines.csv`

## Exporting usage for all labs

To export the usage information for multiple labs consider using 

* [Azure Functions](https://docs.microsoft.com/azure/azure-functions/), available in many languages, including PowerShell, or 
* [Azure Automation runbook](https://docs.microsoft.com/azure/automation/), use PowerShell, Python, or a custom graphical designer to write the export code.

Using these technologies, you can execute the individual lab exports on all the labs at a specific date and time. 

Your Azure function should push the data to the longer-term storage. When exporting data for multiple labs the export may take some time. To help with performance and reduce the possibility of duplication of information, we recommend to execute each lab in parallel. To accomplish parallelism, run Azure Functions asynchronously. Also take advantage of the timer trigger that Azure Functions offer.

## Using a long-term storage

A long-term storage consolidates the export information from different labs into a single data source. Another benefit of using the long-term storage is being able to remove the files from the storage account to reduce duplication and cost. 

The long-term storage can be used to do any text manipulation, for example: 

* adding friendly names
* creating complex groupings
* aggregating the data.

Some common storage solutions are: [SQL Server](https://azure.microsoft.com/services/sql-database/), [Azure Data Lake](https://azure.microsoft.com/services/storage/data-lake-storage/), and [Cosmos DB](https://azure.microsoft.com/services/cosmos-db/). Choosing which long-term storage solution you choose, depends on preference. You might consider choosing the tool depending what it offers in terms of interaction availability when visualizing the data.

## Visualizing data and gathering insights

Use a data visualization tool of your choice to connect to your long-term storage to display the usage data and gather insights to verify usage efficiency. For example, [Power BI](https://docs.microsoft.com/power-bi/power-bi-overview) can be used to organize and display the usage data. 

You can use [Azure Data Factory](https://azure.microsoft.com/services/data-factory/) to create, link, and manage your resources within a single location interface. If greater control is needed, the individual resource can be created within a single resource group and managed independently of the Data Factory service.  

## Next Steps

Once the system is set up and data is moving to the long-term storage, the next step is to come up with the questions that the data needs to answer. For example: 

-	What is the VM size usage?

    Are users selecting high performance (more expensive) VM sizes?
-	Which Marketplace images are being used?

    Are custom images the most common VM base, should a common Image store be built like [Shared Image Gallery](../virtual-machines/windows/shared-image-galleries.md) or [Image factory](image-factory-create.md).
-	Which custom images are being used, or not used?
