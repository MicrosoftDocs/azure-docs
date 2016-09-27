<properties
	pageTitle="Import data into Machine Learning Studio | Microsoft Azure"
	description="How to import your data into Azure Machine Learning Studio from various data sources. Learn what data types and data formats are supported."
	keywords="import data,data format,data types,data sources,training data"
	services="machine-learning"
	documentationCenter=""
	authors="bradsev"
	manager="paulettm"
	editor="cgronlun"/>

<tags
	ms.service="machine-learning"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/14/2016"
	ms.author="garye;bradsev" />


# Import your training data into Azure Machine Learning Studio from various data sources

To use your own data in Machine Learning Studio to develop and train a predictive analytics solution, you can: 

- upload data from a **local file** ahead of time from your hard drive to create a dataset module in your workspace.  
- access data from one of several **online data sources** while your experiment is running using the [Import Data][import-data] module. 
- use data from another Azure Machine learning experiment saved as a **dataset**. 

[AZURE.INCLUDE [import-data-into-aml-studio-selector](../../includes/machine-learning-import-data-into-aml-studio.md)]

Each of these options are described in one of the topics on the menu above. These topic shows you how to import data from these various data sources to use in Machine Learning Studio. 

> [AZURE.NOTE] There are a number of sample datasets available in Machine Learning Studio that you can use for this purpose. For information on these, see [Use the sample datasets in Azure Machine Learning Studio](machine-learning-use-sample-datasets.md)).

This introductory topic also shows how to get data ready for use in Machine Learning Studio and describes which data formats and data types are supported. 

> [AZURE.INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)]


## Get data ready for use in Azure Machine Learning Studio
Machine Learning Studio is designed to work with rectangular or tabular data, such as text data that's delimited or structured data from a database, though in some circumstances non-rectangular data may be used.

It is best if your data is relatively clean. That is, you'll want to take care of issues such as unquoted strings before you upload the data into your experiment.

However, there are modules available in Machine Learning Studio that enable some manipulation of data within your experiment. Depending on the machine learning algorithms you'll be using, you may need to decide how you'll handle data structural issues such as missing values and sparse data, and there are modules that can help with that. Look in the **Data Transformation** section of the module palette for modules that perform these functions.

At any point in your experiment you can view or download the data that's produced by a module by right-clicking the output port. Depending on the module there may be different download options available, or you may be able to view the data within your web browser in Machine Learning Studio.

## Data formats and data types supported

You can import a number of data types into your experiment, depending on what mechanism you use to import data and where it's coming from:

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

If you import data in a format such as ARFF that includes metadata, Machine Learning Studio uses this metadata to define the heading and data type of each column.

If you import data such as TSV or CSV format that doesn't include this metadata, Machine Learning Studio infers the data type for each column by sampling the data. If the data also doesn't have column headings, Machine Learning Studio provides default names.

You can explicitly specify or change the headings and data types for columns using the [Edit Metadata][edit-metadata].

The following **data types** are recognized by Machine Learning Studio:

- String
- Integer
- Double
- Boolean
- DateTime
- TimeSpan

Machine Learning Studio uses an internal data type called ***Data Table*** to pass data between modules. You can explicitly convert your data into Data Table format using the [Convert to Dataset][convert-to-dataset] module.

Any module that accepts formats other than Data Table will convert the data to Data Table silently before passing it to the next module.

If necessary, you can convert Data Table format back into CSV, TSV, ARFF, or SVMLight format using other conversion modules.
Look in the **Data Format Conversions** section of the module palette for modules that perform these functions.



<!-- Module References -->
[convert-to-dataset]: https://msdn.microsoft.com/library/azure/72bf58e0-fc87-4bb1-9704-f1805003b975/
[edit-metadata]: https://msdn.microsoft.com/library/azure/370b6676-c11c-486f-bf73-35349f842a66/
[import-data]: https://msdn.microsoft.com/library/azure/4e1b0fe6-aded-4b3f-a36f-39b8862b9004/
