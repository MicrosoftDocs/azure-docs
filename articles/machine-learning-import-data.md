<properties
	pageTitle="Import your training data into Machine Learning Studio | Azure"
	description="How to import your training data Azure Machine Learning Studio from various data sources"
	services="machine-learning"
	documentationCenter=""
	authors="garyericson"
	manager="paulettm"
	editor="cgronlun"/>

<tags
	ms.service="machine-learning"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/21/2015"
	ms.author="garye" />


#Import your training data into Azure Machine Learning Studio

When you develop a predictive analytics solution in Azure Machine Learning Studio, you train your model using data representative of your problem space.
There are a number of sample datasets available in ML Studio that you can use for this purpose 
(see [Use the sample datasets in Azure Machine Learning Studio](machine-learning-use-sample-datasets.md)). But you can also import your own data into ML Studio for use in your experiments.

[AZURE.INCLUDE [machine-learning-free-trial](../includes/machine-learning-free-trial.md)]

To use your own data in ML Studio, you can upload a data file ahead of time from your local hard drive to create a dataset module in your workspace. 
Or you can access data from one of several online sources while your experiment is running using the [Reader][reader] module:

- Azure BLOB storage, table, or SQL database
- Hadoop using HiveQL
- A web URL using HTTP
- A data feed provider

ML Studio is designed to work with rectangular or tabular data, such as text data that's delimited or structured data from a database, though in some circumstances non-rectangular data may be used.

It's best if your data is relatively clean.
That is, you'll want to take care of issues such as unquoted strings before you upload the data into your experiment.
However, there are modules available in ML Studio that will let you do some manipulation of data within your experiment.
Depending on the machine learning algorithms you'll be using, you may need to decide how you'll handle data structural issues such as missing values and sparse data, and there are modules that can help with that. 
Look in the **Data Transformation** section of the module palette for modules that perform these functions. 

At any point in your experiment you can view or download the data that's produced by a module by right-clicking the output port.
Depending on the module there may be different download options available, or you may be able to view the data within your web browser in ML Studio.


## Data formats

You can import a number of data types into your experiment, depending on what mechanism you use to import the data and where it's coming from:

- Plain text (.txt)
- Comma-separated values (CSV) with a header (.csv) or without (.nh.csv)
- Tab-separated values (TSV) with a header (.tsv) or without (.nh.tsv)
- Hive table
- SQL database table
- OData values
- SVMLight data (.svmlight) (see the [SVMLight definition](http://svmlight.joachims.org/) for format information)
- Attribute Relation File Format (ARFF) data (.arff) (see the [ARFF definition](http://weka.wikispaces.com/ARFF) for format information)
- Zip file (.zip)
- R object or workspace file (.RData)

If you import data in a format such as ARFF that includes metadata, ML Studio uses this metadata to define the heading and data type of each column.
If you import data such as TSV or CSV format that doesn't include this metadata, ML Studio infers the data type for each column by sampling the data. If the data also doesn't have column headings, ML Studio provides default names.
You can explicitly specify or change the headings and data types for columns using the [Metadata Editor][metadata-editor].
 
The following data types are recognized by ML Studio:

- String
- Integer
- Double
- Boolean
- DateTime
- TimeSpan

ML Studio uses an internal data type called *Data Table* to pass data between modules. You can explicitly convert your data into Data Table format using the [Convert to Dataset][convert-to-dataset] module.
Any module that accepts formats other than Data Table will convert the data to Data Table silently before passing it to the next module.
If necessary, you can convert Data Table format back into CSV, TSV, ARFF, or SVMLight format using other conversion modules.
Look in the **Data Format Conversions** section of the module palette for modules that perform these functions.


## Importing a local data file

You can upload data from a local hard drive by doing the following:

1. Click **+NEW** at the bottom of the ML Studio window.
2. Select **DATASET** and **FROM LOCAL FILE**.
3. In the **Upload a new dataset** dialog, browse to the file you want to upload
4. Enter a name, identify the data type, and optionally enter a description. A description is recommended - it allows you to record any characteristics about the data that you will want to remember when using the data in the future.
5. The checkbox **This is the new version of an existing dataset** allows you to update an existing dataset with new data. Just click this checkbox and then enter the name of an existing dataset.

During upload, you will see a message that your file is being uploaded. Upload time will depend on the size of your data and the speed of your connection to the service. 
If you know the file will take a long time, you can do other things inside ML Studio while you wait. However, closing the browser will cause the data upload to fail. 

Once your data is uploaded, it's stored in a dataset module and is available to any experiment in your workspace.
You can find the dataset, along with all the pre-loaded sample datasets, in the **Saved Datasets** list in the module palette when you're editing an experiment.


## Accessing online data with the Reader module

Using the [Reader][reader] module in your experiment, you can access data from several online sources while your experiment is running.
Because this data is accessed while your experiment is running, it's only available in one experiment (as opposed to dataset modules which are available to any experiment in your workspace).

After adding the [Reader][reader] module to your experiment, you select the **Data source** and then provide access information using module parameters. 
For example, if you select **Web URL via HTTP**, you provide the source URL and data format.
If you're accessing your data from Azure storage or HDInsight (using a Hive query), you provide the appropriate account information and the location of the data.

> [AZURE.NOTE] This article provides general information about the [Reader][reader] module. For more detailed information about the types of data you can access, formats, parameters, and answers to common questions, see the module reference topic for the [Reader][reader] module.


### Getting data from Azure

You can import data from three Azure sources:

- **Azure BLOB Storage** - If you use the ARFF format for storage, columns are mapped by using the header metadata. If you use TSV or CSV formats, mappings are inferred by sampling column data. 
- **Azure Table Storage** - The [Reader][reader] module scans your data to identify column data types. If your data is fairly homogenous and predictable you can limit the number of rows that are scanned.
- **Azure SQL Database** - The [Reader][reader] module leverages the SQL Azure Transact client API to import data using a database query that you provide.

For BLOB and table storage you supply a Shared Access Signature URI (SAS URI) or Azure storage account information to provide access to the data. For an Azure SQL database you supply your database and account information, plus a database query that identifies the data you want to import.

### Getting data from the Web

You can use the [Reader][reader] module to read data from a web or FTP site. You need to provide:

- A complete HTTP URL address of a file
- The data format of the file (CSV, TSV, ARFF, or SvmLight)
- For CSV or TSV files, indicate if the first line in the file is a header

### Getting data from Hadoop

You can use the [Reader][reader] module to read data from distributed storage using the HiveQL query language.
You'll need to specify the Hive database query and provide user access information on the HCatalog server.
You also need to specify whether the data is stored in a Hadoop distributed file system (HDFS) or in Azure, and, if in Azure, the Azure account information  

### Getting data from a data feed provider

By specifying an OData URL, you can read directly from a data feed provider. You'll need to provide the source URL and the data content type.  


## Saving data from your experiment


There will be times when you'll want to take an intermediate result from an experiment and use it as part of another experiment. To do this:

1. Right-click the output of the module that you want to save as a dataset.

2. Click **Save as Dataset**. 

3. When prompted, enter a name and a description that would allow you to identify the dataset easily.

4. Click the **OK** checkmark.

When the save finishes, the dataset will be available for use within any experiment in your workspace. You can find it in the **Saved Datasets** list in the module palette.


<!-- Module References -->
[convert-to-dataset]: https://msdn.microsoft.com/library/azure/72bf58e0-fc87-4bb1-9704-f1805003b975/
[metadata-editor]: https://msdn.microsoft.com/library/azure/370b6676-c11c-486f-bf73-35349f842a66/
[reader]: https://msdn.microsoft.com/library/azure/4e1b0fe6-aded-4b3f-a36f-39b8862b9004/
