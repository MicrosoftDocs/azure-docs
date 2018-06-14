---
title: Azure Data Source Wizard for Azure Machine Learning | Microsoft Docs
description: Explains the data source wizard of AML workbench
services: machine-learning
author: cforbe
ms.author: cforbe
manager: mwinkle
ms.reviewer: jmartens, jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.topic: article
ms.date: 09/07/2017

ROBOTS: NOINDEX
---

# Data Source Wizard #

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)] 



The Data Source Wizard is a quick and easy way to bring a dataset into Azure ML Workbench without code. It is where you can also select a sample strategy for the dataset and data types for each column. 

## Step 1: Trigger the Data Source Wizard ## 

To bring data into a project using the data source wizard. Select the **+** button next to the search box in the data view and choose Add Data Source. 

![add data source](media/data-source-wizard/add-data-source.png)

## Step 2: Select where data is stored ##
First, specify how your data is currently in. It could be stored in a flat file or a directory, a parquet file, an Excel file, or a database. For more information, see [Supported Data Sources](data-prep-appendix2-supported-data-sources.md).

![step 1](media/data-source-wizard/step1.png)

## Step 3: Select data file ##
For a file/directory, specify the file path. Choose from the dropdown the location of the data – it could be a local file path or Azure Blob Storage. 

Specify the path by typing it in or clicking on the **Browse…** button to browse for it. You can browse for a directory, or one or more files.

Click **Finish** to accept the defaults for the rest of steps or Next to proceed to the next step.


![step 4](media/data-source-wizard/step2.png)

## Step 4: Choose file parameters ##

The Data Source Wizard can automatically detect the file type, separators, and encoding. It would also show an example of what the data will look like. You can also change any of these parameters manually. 

![step 5](media/data-source-wizard/step3.png)

## Step 5: Set data types for columns ##

The Data Source Wizard automatically detects the data types of the dataset's columns. If it misses one, or you wish to enforce a data type, you can manually change the data type. The **SAMPLE OUTPUT DATA** column shows you examples of what the data look like.

For columns that Data Prep infers to contain dates, you may be prompted to select the order of month and day in the date format. For example, 1/2/2013 could represent January 2nd (for this, select *Day-Month*) or Feburary 1st (select *Month-Day*).

![step 6](media/data-source-wizard/step4.png)

## Step 6: Choose sampling strategy for data ##

You can specify one or more sampling strategies for the dataset, and choose one as the active strategy. The default is to load the Top 10000 rows. You can edit this sample by clicking on the **Edit** button in the toolbar or add a new strategy by clicking on +New. The strategies that are currently support are

-     Top number of rows
-     Random number of rows
-     Random percentage of rows
-     Full file

You can specify as many sampling strategies as you want, but there is only one that can be set to active when preparing your data. You can set any strategy to be the active by selecting the strategy and click Set as Active  in the toolbar.

Depending on where the data comes from, some sample strategies may not be supported. For more information about sampling, look at the sampling section in [this document](data-prep-user-guide.md) 

![step 6](media/data-source-wizard/step5.png)

## Step 7: Path column handling ##

If the file path includes important data, you can choose to include it as the first column in the dataset. This option would be helpful if you are bringing in multiple files. Otherwise, you can choose to not include it.

![step 7](media/data-source-wizard/step6.png)

After clicking Finish, a new data source will be added to the project. You can find it under the Data Sources group in the Data View, or as a dsource file in the **File View**.
