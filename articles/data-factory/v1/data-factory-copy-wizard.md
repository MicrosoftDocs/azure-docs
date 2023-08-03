---
title: Copy data easily with Copy Wizard - Azure 
description: Learn about how to use the Data Factory Copy Wizard to copy data from supported data sources to sinks.
author: jianleishen
ms.service: data-factory
ms.subservice: v1
ms.topic: conceptual
ms.date: 04/12/2023
ms.author: jianleishen
robots: noindex
---
# Copy or move data easily with Azure Data Factory Copy Wizard
> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [copy activity tutorial](../quickstart-create-data-factory-dot-net.md). 


The Azure Data Factory Copy Wizard is to ease the process of ingesting data, which is usually a first step in an end-to-end data integration scenario. When going through the Azure Data Factory Copy Wizard, you do not need to understand any JSON definitions for linked services, datasets, and pipelines. However, after you complete all the steps in the wizard, the wizard automatically creates a pipeline to copy data from the selected data source to the selected destination. In addition, the Copy Wizard helps you to validate the data being ingested at the time of authoring, which saves much of your time, especially when you are ingesting data for the first time from the data source. To start the Copy Wizard, click the **Copy data** tile on the home page of your data factory.

:::image type="content" source="./media/data-factory-copy-wizard/copy-data-wizard.png" alt-text="Copy Wizard":::

## An intuitive wizard for copying data
This wizard allows you to easily move data from a wide variety of sources to destinations in minutes. After going through the wizard, a pipeline with a copy activity is automatically created for you along with dependent Data Factory entities (linked services and datasets). No additional steps are required to create the pipeline.   

:::image type="content" source="./media/data-factory-copy-wizard/select-data-source-page.png" alt-text="Select data source":::

> [!NOTE]
> See [Copy Wizard tutorial](data-factory-copy-data-wizard-tutorial.md) article for step-by-step instructions to create a sample pipeline to copy data from an Azure blob to an Azure SQL Database table. 
> 
> 

The wizard is designed with big data in mind from the start. It is simple and efficient to author Data Factory pipelines that move hundreds of folders, files, or tables using the Copy Data wizard. The wizard supports the following three features: Automatic data preview, schema capture and mapping, and filtering data. 

## Automatic data preview
The copy wizard allows you to review part of the data from the selected data source for you to validate whether the data it is the right data you want to copy. In addition, if the source data is in a text file, the copy wizard parses the text file to learn row and column delimiters, and schema automatically. 

:::image type="content" source="./media/data-factory-copy-wizard/file-format-settings.png" alt-text="File format settings":::

## Schema capture and mapping
The schema of input data may not match the schema of output data in some cases. In this scenario, you need to map columns from the source schema to columns from the destination schema. 

The copy wizard automatically maps columns in the source schema to columns in the destination schema. You can override the mappings by using the drop-down lists (or) specify whether a column needs to be skipped while copying the data.   

:::image type="content" source="./media/data-factory-copy-wizard/schema-mapping.png" alt-text="Schema mapping":::

## Filtering data
The wizard allows you to filter source data to select only the data that needs to be copied to the destination/sink data store. Filtering reduces the volume of the data to be copied to the sink data store and therefore enhances the throughput of the copy operation. It provides a flexible way to filter data in a relational database by using SQL query language (or) files in an Azure blob folder by using [Data Factory functions and variables](data-factory-functions-variables.md).   

### Filtering of data in a database
In the example, the SQL query uses the `Text.Format` function and `WindowStart` variable. 

:::image type="content" source="./media/data-factory-copy-wizard/validate-expressions.png" alt-text="Validate expressions":::

### Filtering of data in an Azure blob folder
You can use variables in the folder path to copy data from a folder that is determined at runtime based on [system variables](data-factory-functions-variables.md#data-factory-system-variables). The supported variables are: **{year}**, **{month}**, **{day}**, **{hour}**, **{minute}**, and **{custom}**. Example: inputfolder/{year}/{month}/{day}.

Suppose that you have input folders in the following format:

```text
2016/03/01/01
2016/03/01/02
2016/03/01/03
...
```

Click the **Browse** button for **File or folder**, browse to one of these folders (for example, 2016->03->01->02), and click **Choose**. You should see `2016/03/01/02` in the text box. Now, replace **2016** with **{year}**, **03** with **{month}**, **01** with **{day}**, and **02** with **{hour}**, and press Tab. You should see drop-down lists to select the format for these four variables:

:::image type="content" source="./media/data-factory-copy-wizard/blob-standard-variables-in-folder-path.png" alt-text="Using system variables":::   

As shown in the following screenshot, you can also use a **custom** variable and any [supported format strings](/dotnet/standard/base-types/custom-date-and-time-format-strings). To select a folder with that structure, use the **Browse** button first. Then replace a value with **{custom}**, and press Tab to see the text box where you can type the format string.     

:::image type="content" source="./media/data-factory-copy-wizard/blob-custom-variables-in-folder-path.png" alt-text="Using custom variable":::

## Support for diverse data and object types
By using the Copy Wizard, you can efficiently move hundreds of folders, files, or tables.

:::image type="content" source="./media/data-factory-copy-wizard/select-tables-to-copy-data.png" alt-text="Select tables from which to copy data":::

## Scheduling options
You can run the copy operation once or on a schedule (hourly, daily, and so on). Both of these options can be used for the breadth of the connectors across on-premises, cloud, and local desktop copy.

A one-time copy operation enables data movement from a source to a destination only once. It applies to data of any size and any supported format. The scheduled copy allows you to copy data on a prescribed recurrence. You can use rich settings (like retry, timeout, and alerts) to configure the scheduled copy.

:::image type="content" source="./media/data-factory-copy-wizard/scheduling-properties.png" alt-text="Scheduling properties":::

## Next steps
For a quick walkthrough of using the Data Factory Copy Wizard to create a pipeline with Copy Activity, see [Tutorial: Create a pipeline using the Copy Wizard](data-factory-copy-data-wizard-tutorial.md).