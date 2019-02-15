---
title: Azure Data Factory Mapping Data Flow Datasets
description: Azure Data Factory Mapping Data Flow has sepecific dataset compatability
author: kromerm
ms.author: makromer
ms.reviewer: douglasl
ms.service: data-factory
ms.topic: conceptual
ms.date: 02/14/2019
--- 

# Mapping Data Flow Datasets

[!INCLUDE [notes](../../includes/data-factory-data-flow-preview.md)]

Datasets are a Data Factory construct that define the shape of the data you are working with in your pipeline. In Data Flow, row & column level data requires a much more finely-grained definition than is required by Datasets within pipeline control flow.

Use Datasets in Data Flow Source and Sink transforms to define the basic data schema. If you do not have schema in your data, you can set Schema Drift on for your Source and Sink. With schema defined from the dataset, you will have the related data types, data formats, file location, and connection information from the associated Linked Service.

Currently in data flow, you will find four datasets:

* Azure SQL DB
* Azure SQL DW
* Parquet
* Delimited Text

Data flow datasets separate the source *type* from the Linked Service connection type. Typically in Data Factory, you choose the connection type (Blob, ADLS, etc.) and then define the type of file in the Dataset. Inside Data Flow, you will pick the source types, which can be associated with different Linked Service connection types.

![Source Transformation options](media/data-flow/dataset1.png "sources")

When creating a new Dataset, there is a checkbox labeled "Data Flow Compatible" on the top right of the panel. Clicking that button will filter only the datasets that can be used with Data Flows. 

Import Schemas

When importing the schema of Data Flow datasets, you will see an Import Schema button. Clicking that button will present you with two options: Import from the source or import from a local file. In most cases, you will import the schema directly from the source. However, if you have an existing schema file, you can point to that local file and Data Factory will define the schema based upon that schema file.

