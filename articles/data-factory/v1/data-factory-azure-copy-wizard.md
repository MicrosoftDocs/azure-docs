---
title: Data Factory Azure Copy Wizard 
description: Learn about how to use the Data Factory Azure Copy Wizard to copy data from supported data sources to sinks.
author: jianleishen
ms.service: data-factory
ms.subservice: v1
ms.topic: conceptual
ms.date: 04/12/2023
ms.author: jianleishen
robots: noindex
---

# Azure Data Factory Copy Wizard

> [!NOTE]
> This article applies to version 1 of Data Factory. 

The Azure Data Factory Copy Wizard eases the process of ingesting data, which is usually a first step in an end-to-end data integration scenario. When going through the Azure Data Factory Copy Wizard, you do not need to understand any JSON definitions for linked services, data sets, and pipelines. The wizard automatically creates a pipeline to copy data from the selected data source to the selected destination. In addition, the Copy Wizard helps you to validate the data being ingested at the time of authoring. This saves time, especially when you are ingesting data for the first time from the data source. To start the Copy Wizard, click the **Copy data** tile on the home page of your data factory.

:::image type="content" source="./media/data-factory-copy-wizard/copy-data-wizard.png" alt-text="Copy Wizard":::

## Designed for big data
This wizard allows you to easily move data from a wide variety of sources to destinations in minutes. After you go through the wizard, a pipeline with a copy activity is automatically created for you, along with dependent Data Factory entities (linked services and data sets). No additional steps are required to create the pipeline.   

:::image type="content" source="./media/data-factory-copy-wizard/select-data-source-page.png" alt-text="Select data source":::

> [!NOTE]
> For step-by-step instructions to create a sample pipeline to copy data from an Azure blob to an Azure SQL Database table, see the [Copy Wizard tutorial](data-factory-copy-data-wizard-tutorial.md).

The wizard is designed with big data in mind from the start, with support for diverse data and object types. You can author Data Factory pipelines that move hundreds of folders, files, or tables. The wizard supports automatic data preview, schema capture and mapping, and data filtering.

## Automatic data preview
You can preview part of the data from the selected data source in order to validate whether the data is what you want to copy. In addition, if the source data is in a text file, the Copy Wizard parses the text file to learn the row and column delimiters and schema automatically.

:::image type="content" source="./media/data-factory-copy-wizard/file-format-settings.png" alt-text="File format settings":::

## Schema capture and mapping
The schema of input data may not match the schema of output data in some cases. In this scenario, you need to map columns from the source schema to columns from the destination schema.

> [!TIP]
> When copying data from SQL Server or Azure SQL Database into Azure Synapse Analytics, if the table does not exist in the destination store, Data Factory support auto table creation using source's schema. Learn more from [Move data to and from Azure Synapse Analytics using Azure Data Factory](./data-factory-azure-sql-data-warehouse-connector.md).

Use a drop-down list to select a column from the source schema to map to a column in the destination schema. The Copy Wizard tries to understand your pattern for column mapping. It applies the same pattern to the rest of the columns, so that you do not need to select each of the columns individually to complete the schema mapping. If you prefer, you can override these mappings by using the drop-down lists to map the columns one by one. The pattern becomes more accurate as you map more columns. The Copy Wizard constantly updates the pattern, and ultimately reaches the right pattern for the column mapping you want to achieve.     

:::image type="content" source="./media/data-factory-copy-wizard/schema-mapping.png" alt-text="Schema mapping":::

## Filtering data
You can filter source data to select only the data that needs to be copied to the sink data store. Filtering reduces the volume of the data to be copied to the sink data store and therefore enhances the throughput of the copy operation. It provides a flexible way to filter data in a relational database by using the SQL query language, or files in an Azure blob folder by using [Data Factory functions and variables](data-factory-functions-variables.md).   

### Filtering of data in a database
The following screenshot shows a SQL query using the `Text.Format` function and `WindowStart` variable.

:::image type="content" source="./media/data-factory-copy-wizard/validate-expressions.png" alt-text="Validate expressions":::

### Filtering of data in an Azure blob folder
You can use variables in the folder path to copy data from a folder that is determined at runtime based on [system variables](data-factory-functions-variables.md#data-factory-system-variables). The supported variables are: **{year}**, **{month}**, **{day}**, **{hour}**, **{minute}**, and **{custom}**. For example: inputfolder/{year}/{month}/{day}.

Suppose that you have input folders in the following format:

```text
2016/03/01/01
2016/03/01/02
2016/03/01/03
...
```

Click the **Browse** button for **File or folder**, browse to one of these folders (for example, 2016->03->01->02), and click **Choose**. You should see `2016/03/01/02` in the text box. Now, replace **2016** with **{year}**, **03** with **{month}**, **01** with **{day}**, and **02** with **{hour}**, and press the **Tab** key. You should see drop-down lists to select the format for these four variables:

:::image type="content" source="./media/data-factory-copy-wizard/blob-standard-variables-in-folder-path.png" alt-text="Using system variables":::   

As shown in the following screenshot, you can also use a **custom** variable and any [supported format strings](/dotnet/standard/base-types/custom-date-and-time-format-strings). To select a folder with that structure, use the **Browse** button first. Then replace a value with **{custom}**, and press the **Tab** key to see the text box where you can type the format string.     

:::image type="content" source="./media/data-factory-copy-wizard/blob-custom-variables-in-folder-path.png" alt-text="Using custom variable":::

## Scheduling options
You can run the copy operation once or on a schedule (hourly, daily, and so on). Both of these options can be used for the breadth of the connectors across environments, including on-premises, cloud, and local desktop copy.

A one-time copy operation enables data movement from a source to a destination only once. It applies to data of any size and any supported format. The scheduled copy allows you to copy data on a prescribed recurrence. You can use rich settings (like retry, timeout, and alerts) to configure the scheduled copy.

:::image type="content" source="./media/data-factory-copy-wizard/scheduling-properties.png" alt-text="Scheduling properties":::

## Troubleshooting

This section explores common troubleshooting methods for Copy Wizard in Azure Data Factory.

> [!NOTE] 
> These troubleshooting tips apply to copy wizard in version 1 of Data Factory. For Data Factory v2, see troubleshooting guide at [Troubleshoot Azure Data Factory Studio](../data-factory-ux-troubleshoot-guide.md).

### Error code: Unable to validate in Copy Wizard

- **Symptoms**: In the first step of Copy Wizard, you encounter the warning message of "Unable to Validate".
- **Causes**: This could happen when all third-party cookies are disabled.
- **Resolution**: 
    - Use Internet Explorer or Microsoft Edge browser.
    - If you are using Chrome browser, follow instructions below to add Cookies exception for *microsoftonline.com* and *windows.net*.
        1.	Open the Chrome browser.
        2.	Click the wrench or three lines on the right (Customize and control Google Chrome).
        3.	Click **Settings**.
        4.	Search **Cookies** or go to **Privacy** under Advanced Settings.
        5.	Select **Content Settings**.	
        6.	Cookies should be set to **allow local data to be set (recommended)**.
        7.	Click **Manage exceptions**. Under **hostname pattern** enter the following, and make sure **Allow** is the behavior set.
            - login.microsoftonline.com
            - login.windows.net
        8.	Close the browser and relaunch.
    - If you are using Firefox browser, follow instructions below to add Cookies exception.
        1. From the Firefox menu, go to **Tools** > **Options**.
        2. Under **Privacy** > **History**, your may see that the current setting is **Use Custom settings for history**.
        3. In **Accept third-party cookies**, your current setting might be **Never**, then you should click **Exceptions** on the right to add the following sites.
            - https://login.microsoftonline.com
            - https://login.windows.net
        4.	Close the browser and relaunch. 


### Error code: Unable to open login page and enter password

- **Symptoms**: Copy Wizard redirects you to login page, but login page doesn't show up successfully.
- **Causes**: This issue could happen if you changed the network environment from office network to home network. There are some caches in browsers. 
- **Resolution**: 
    1.	Close the browser and try again. Go to the next step if the issue still exists.   
    2.	If you are using Internet Explorer browser, try to open it in private mode (Press "Ctrl" + "Shift" + "P"). If you are using Chrome browser, try to open it in incognito mode (Press "Ctrl" + "shift" + "N"). Go to the next step if the issue still exists. 
    3.	Try to use another browser. 


## Next steps
For a quick walkthrough of using the Data Factory Copy Wizard to create a pipeline with Copy Activity, see [Tutorial: Create a pipeline using the Copy Wizard](data-factory-copy-data-wizard-tutorial.md).