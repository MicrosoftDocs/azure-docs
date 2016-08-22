<properties
	pageTitle="Data Factory Copy Wizard | Microsoft Azure"
	description="Learn about how to use the Data Factory Copy Wizard to copy data from supported data sources to sinks."
	services="data-factory"
	documentationCenter=""
	authors="spelluru"
	manager="jhubbard"
	editor="monicar"/>

<tags
	ms.service="data-factory"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/27/2016"
	ms.author="spelluru"/>

# Data Factory Copy Wizard
The Azure Data Factory Copy Wizard allows you to create a pipeline to copy data from supported sources to destinations without writing JSON definitions for linked services, datasets, and pipelines. To start the Copy Wizard, click the **Copy data** tile on the home page of your data factory.

![Copy Wizard](./media/data-factory-copy-wizard/copy-data-wizard.png)

## Features

### An intuitive and seamless wizard for copying data
This wizard allows you to easily move data from a source to a destination in minutes with the following easy steps:

1.	Select the source.
2.	Select the destination.
3.	Configure the settings.

![Select data source](./media/data-factory-copy-wizard/select-data-source-page.png)

### Rich data exploration and schema mappings
You can browse tables and folders, preview data, map a schema, validate expressions, and perform simple data transformations within the wizard.

**Browse tables/folders**
![Browse tables and folders](./media/data-factory-copy-wizard/browse-tables-folders.png)

### Scalable experience for diverse data and object types
The experience is designed with big data in mind from the start. It is simple and efficient to author Data Factory pipelines that move hundreds of folders, files, or tables.

**Preview data**
![File format settings](./media/data-factory-copy-wizard/file-format-settings.png)

**Map a schema**
![Schema mapping](./media/data-factory-copy-wizard/schema-mapping.png)

**Perform simple transformations**
![Validate expressions](./media/data-factory-copy-wizard/validate-expressions.png)

### Scalable experience for diverse data and object types
By using the Copy Wizard, you can efficiently and simply move hundreds of folders, files, or tables.

![Select tables from which to copy data](./media/data-factory-copy-wizard/select-tables-to-copy-data.png)

### Richer scheduling options
You can run the copy operation once or on a schedule (hourly, daily, and so on). Both of these options can be used for the breadth of the connectors across on-premises, cloud, and local desktop copy.

A one-time copy operation enables data movement from a source to a destination only once. It applies to data of any size and any supported format. The scheduled copy allows you to copy data on a prescribed recurrence. You can use rich settings (like retry, timeout, and alerts) to configure the scheduled copy.

![Scheduling properties](./media/data-factory-copy-wizard/scheduling-properties.png)

## Variables in the Azure blob folder path
You can use variables in the folder path to copy data from a folder that is determined at runtime based on [WindowStart system variables](data-factory-functions-variables.md#data-factory-system-variables). The supported variables are: **{year}**, **{month}**, **{day}**, **{hour}**, **{minute}**, and **{custom}**. Example: inputfolder/{year}/{month}/{day}.

Suppose that you have input folders in the following format:

	2016/03/01/01
	2016/03/01/02
	2016/03/01/03
	...

Click the **Browse** button for **File or folder**, browse to one of these folders (for example, 2016->03->01->02), and click **Choose**. You should see **2016/03/01/02** in the text box. Now, replace **2016** with **{year}**, **03** with **{month}**, **01** with **{day}**, and **02** with **{hour}**, and press Tab. You should see drop-down lists to select the format for these four variables:

![Using system variables](./media/data-factory-copy-wizard/blob-standard-variables-in-folder-path.png)   

As shown in the following screenshot, you can also use a **custom** variable and any [supported format strings](https://msdn.microsoft.com/library/8kb3ddd4.aspx). To select a folder with that structure, use the **Browse** button first. Then replace a value with **{custom}**, and press Tab to see the text box where you can type the format string.     

![Using custom variable](./media/data-factory-copy-wizard/blob-custom-variables-in-folder-path.png)

## Next steps
For a quick walkthrough of using the Data Factory Copy Wizard to create a pipeline with Copy Activity, see [Tutorial: Create a pipeline using the Copy Wizard](data-factory-copy-data-wizard-tutorial.md).
