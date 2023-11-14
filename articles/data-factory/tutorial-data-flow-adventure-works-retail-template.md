---
title: ETL template for retail industry data model
description: This tutorial provides steps for using the industry data model template for retail using the Adventure Works sample data
author: kromerm
ms.author: aamerril
ms.service: synapse-analytics
ms.topic: conceptual
ms.custom: seo-lt-2021
ms.date: 08/10/2023
---

# AdventureWorks template documentation

This document explains how to setup and use Microsoft's AdventureWorks pipeline template to jump start the exploration of the AdventureWorks dataset using Azure Synapse Analytics and the Retail database template.

## Overview
AdventureWorks is a fictional sports equipment retailer that is used to demo Microsoft applications. In this case, they're being used as an example for how to use Synapse Pipelines to map retail data to the Retail database template for further analysis within Azure Synapse.

## Prerequisites

* **Azure subscription**. If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* **Azure Synapse workspace**. [Create an Azure Synapse Workspace](../synapse-analytics/get-started-create-workspace.md) if you don't have one already.

## Find the template

Follow these steps to locate the template.

1. Navigate to your Synapse workspace. From the home page, select **Knowledge Center** and then select **Browse gallery**. The Synapse gallery opens. You can search for datasets, scripts, pipelines, and more to install in your workspace. 

1. Select **Pipelines**, and filter the results with the keyword "AdventureWorks."

1. Select the **AdventureWorks** template, and then select **Continue**.

These steps open the template overview page.

## Configure the template
The template is designed to require minimal configuration. From the template overview page you can see a preview of the initial starting configuration of the pipeline, and select **Open pipeline** to create the resources in your own workspace. You'll get a notification that all 31 resources in the template have been created, and can review these before committing or publishing them. You'll find the below components of the template:

* 17 pipelines: These are scheduled to ensure the data loads into the target tables correctly, and include one pipeline per source table plus the scheduling ones.
* 14 data flows: These contain the logic to load from the source system and land the data into the target database.

If you have the AdventureWorks dataset loaded into a different database, you can update the dataflow sources to point to that dataset. Otherwise, follow the steps below to create a source and target DB to match the schema defined in the template.


## Dataset and source/target models
The AdventureWorks dataset in Excel format can be downloaded from this [GitHub site](https://github.com/kromerm/adfdataflowdocs/blob/master/sampledata/AdventureWorks%20Data.zip). In addition, you can access the [schema definition for both the source and target databases](https://github.com/kromerm/adfdataflowdocs/blob/master/sampledata/AdventureWorksSchemas.xlsx). Using the database designer in Synapse, recreate the source and target databases with the schema in the Excel you downloaded earlier. For more information on the database designer, see this [documentation](../synapse-analytics/database-designer/concepts-database-templates.md).

With the databases created, ensure the dataflows are pointing to the correct tables by editing the dropdowns in the Workspace DB source and sink settings. You can load the data into the source model by placing the CSV files provided in the example dataset in the correct folders specified by the tables. Once that is done, all that's required is to run the pipelines.

## Troubleshoot the pipelines
If the pipeline fails to run successfully, there's a few main things to check for errors.

* Dataset schema. Make sure the data settings for the CSV files are accurate. If you included row headers, make sure the row headers option is checked on the database table.
* Data flow sources. If you used different column or table names than what were provided in the example schema, you'll need to step through the data flows to verify that the columns are mapped correctly.
* Data flow sink. The schema and data format configurations on the target database will need to match the data flow template. Like above, if any changes were made you those items will need to be aligned.

## Next steps

* Learn more about [mapping data flows](concepts-data-flow-overview.md).
* Learn more about [pipeline templates](solution-templates-introduction.md)
