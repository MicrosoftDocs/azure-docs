---
title: ETL template for retail industry data model
description: This tutorial provides steps for using the industry data model template for retail using the Adventure Works sample data
author: kromerm
ms.author: aamerril
ms.service: synapse-analytics
ms.subservice: tutorials
ms.topic: conceptual
ms.custom: seo-lt-2021
ms.date: 10/14/2021
---

# AdventureWorks Template Documentation

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-asa-md.md)]

This document explains how to setup and use Microsoft's AdventureWorks pipeline template to jump start the exploration of the AdventureWorks dataset using Azure Synapse Analytics and the Retail database template.

## Overview
AdventureWorks is a fictional sports equipment retailer that is used to demo Microsoft applications. In this case, they are being used as an example for how to use Synapse Pipelines to map retail data to the Retail database template for further analysis within Azure Synapse.

Many times, when processing data for ETL jobs, you will need to change the column names before writing the results. Sometimes this is needed to align column names to a well-known target schema. Other times, you may need to set column names at runtime based on evolving schemas. In this tutorial, you'll learn how to use data flows to set column names for your destination files and database tables dynamically using external configuration files and parameters.

If you're new to Azure Data Factory, see [Introduction to Azure Data Factory](introduction.md).

## Prerequisites
* **Azure subscription**. If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* **Azure storage account**. You use ADLS storage as a *source* and *sink* data stores. If you don't have a storage account, see [Create an Azure storage account](../storage/common/storage-account-create.md) for steps to create one.



## Prerequisites

1. [Create an Azure subscription](https://docs.microsoft.com/en-us/azure/cost-management-billing/manage/create-subscription#:~:text=Create%20Subscription%20Azure%201%20Sign%20in%20to%20the,for%20each%20type%20of%20billing%20account.%20See%20More.) if you don't have one already.
2. [Create an Azure Synapse Workspace](https://docs.microsoft.com/en-us/azure/synapse-analytics/quickstart-create-workspace#:~:text=%20Create%20a%20Synapse%20workspace%20%201%20Open,choice%20is%20to%20create%20a%20new...%20More%20) if you don't have one already.

## Finding the Template
Navigate to your Synapse workspace. From the home page, click "Learn" and then select "Browse gallery". This will open the Synapse gallery where you can search for datasets, scripts, pipelines and more to install in your workspace. 

Click "Pipelines" and filter the results with the keyword "AdventureWorks".

Click the AdventureWorks template, and then "Continue".

This will open the template overview page.

## Configuring the Template
The template is designed to require minimal configuration. From the template overview page you can see a preview of the initial starting configuration of the pipeline, and click **Open pipeline** to create the resources in your own workspace. You will get a notification that all 31 resources in the template have been created, and can review these before committing or publishing them. You will find the below components of the template:

- 17 pipelines: These are scheduled to ensure the data loads into the target tables correctly, and include one pipeline per source table plus the scheduling ones.
- 14 data flows: These contain the logic to load from the source system and land the data into the target database.

If you have the AdventureWorks dataset loaded into a different database, you can update the dataflow sources to point to that dataset. Otherwise, follow the steps below to create a source and target DB to match the schema defined in the template.


## Dataset and source/target models
The AdventureWorks dataset in Excel format can be downloaded from [here.]() In addition, you can access the schema definition for both the source and target databases [here](). Using the database designer in Synapse, recreate the source and target databases using the schema in the Excel you downloaded earlier. [See here for more details on the database designer.](https://aka.ms/SynapseDatabaseDesignerDocumentation) 

With the databases created, ensure the dataflows are pointing to the correct tables by editing the dropdowns in the Workspace DB source and sink settings. You can load the data into the source model by placing the CSV files provided in the example dataset in the correct folders specified by the tables. Once that is done, all that's required is to run the pipelines.

## Troubleshooting the pipelines
If the pipeline fails to run successfully, there's a few main things to check for errors.
    - Dataset schema. Make sure the data settings for the CSV files are accurate. If you included row headers, make sure the how headers option is checked on the database table.
    - Data flow sources. If you used different column or table names than what were provided in the example schema, you will need to step through the data flows to verify that the columns are mapped correctly.
    - Data flow sink. The schema and data format configurations on the target database will need to match the data flow template. Like above, if any changes were made you those items will need to be aligned.

## Next steps

* Learn more about [mapping data flows](data-flow-overview.md).
