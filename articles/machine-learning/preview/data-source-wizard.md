title: <this Data Source Wizard > | Microsoft Docs
description: <this Explains the data source wizard of AML workbench>
author: <your cforbe>
ms.author: <your cforbe@microsoft.com>
ms.date: <today’s date: 9/7/2017>

# Data Source Wizard #

## Introduction ##

The Data Source Wizard is a quick and easy way to upload a dataset. It is where you can also select a sample strategy for the dataset.


### Using Data Source Wizard ###
To open the Data Source Wizard

#### Step 1: Select Where Data is Stored####

The first step is to specify what format your data is currently in. It could be stored in a flat file, parquet file, Excel file, or a database.

#### Step 2: Select Data File ####

The second step is to browse to the file's location. The different locations can be a local file path, Azure Blob Storage, or Azure Data Lake


#### Step 3: Choose File Parameters ####

The Data Source Wizard can automatically detect the file type, separators, and encoding. It then shows an example of what the data will look like. However, you can change any of these parameters manually.

#### Step 4: Set Data Types for Columns####

The Data Source Wizard can automatically changes the data types of the dataset's columns from the default string data type. If it misses one, or you wish to change the automatic type, you can manually change the data type. An example of what the data looks like is on the right-hand side of the grid.

#### Step 5: Choose Sampling Strategy for Data ####

For sampling, you can change the sampling strategy of the dataset. The default is to load the Top 10000 rows. However, you can either change it to load the full file, a random number of rows, or a random percentage of rows. You can have as many sampling strategies as you want, and switch between the active one when preparing your data. 

#### Step 6: Path Column Handling ####

If the file path includes important data, you can choose to keep it as the first column in the dataset. Otherwise, you can choose to not include it.