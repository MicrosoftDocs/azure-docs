---
title: Import data
titleSuffix: Azure Machine Learning
description: Learn how to import your data into Azure Machine Learning designer from various data sources.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to

author: peterclu
ms.author: peterlu
ms.date: 01/06/2020
---

# Import your data into Azure Machine Learning designer (preview)

You can use your own data in Azure Machine Learning designer to create predictive analytics solutions. You can import data into the designer in one of two ways: 

* **Azure Machine Learning datasets** - Register [datasets](concept-data.md#datasets) in Azure Machine Learning to help you manage datasets and use advanced features.
* **Import Data module** - Use the [Import Data](algorithm-module-reference/import-data.md) module to directly access data from online datasources.

To learn more about the differences between datasets and datastores, see [Data access in Azure Machine Learning](concept-data.md).

## Import data using datasets

We recommend that you use [Azure Machine Learning datasets](concept-data.md#datasets) when you import data into the designer. When you register a dataset in Azure Machine Learning, you can take full advantage of advanced features like [versioning and tracking](how-to-version-track-datasets.md) and [data monitoring](how-to-monitor-datasets.md) to accelerate your machine learning workflows.


### Register a dataset

Register a dataset [programatically with the SDK](how-to-create-register-datasets.md#use-the-sdk) or [visually in Azure Machine Learning studio](how-to-create-register-datasets.md#use-the-ui).

You can also register the output for any module as a dataset directly in the designer.

1. Select the module that outputs the data you want to register.

1. In the properties pane, select **Outputs** > **Register dataset**.

    ![Screenshot showing how to navigate to the Register Dataset option](media/how-to-designer-import-data/register-dataset-designer.png)

### Use datasets

Any dataset registered to your workspace will appear, you aren't limited to datasets created in the designer.

> [!NOTE]
> The designer currently only supports processing [tabular datasets](how-to-create-register-datasets.md#dataset-types). For other datasets which need [file datasets](how-to-create-register-datasets.md#dataset-types), use the Azure Machine Learning SDK available for Python or R.

Registered datasets can be found in the module palette, under **Datasets** > **My Datasets**. To use a dataset, drag and drop the dataset onto the pipeline canvas. Then, connect the output port of the dataset to other modules in the palette.

![Screenshot showing location of saved datasets in the designer palette](media/how-to-designer-import-data/use-datasets-designer.png)

## Import data using the Import Data module

You can also use the [Import Data](algorithm-module-reference/import-data.md) module to import data directly from Azure Machine Learning [datastores](concept-data.md#datastores) or HTTP URLs. However, we recommend you create a dataset first to take full advantage of features such as versioning and monitoring.

> [!NOTE]
> Pipelines converted from the visual interface will default to the **Import Data** module. If you are using a converted visual interface pipeline, we recommend creating a dataset and importing data via the dataset method.

### Create a new datastore

Creating a datastore can be done [programatically with the SDK](how-to-access-data.md#create-and-register-datastores) or [visually in Azure Machine Learning studio](how-to-access-data.md#azure-machine-learning-studio).

You can also create a datastore directly the designer through the **Import Data** module.

1. Drag and drop an **Import Data** module to the pipeline canvas. 
1. Select the **Import Data** module.
1. In the properties pane, select **New datastore**
1. Select the datastore type.
1. Provide valid authentication.

    > [!NOTE]
    > You may be asked for different authentication information depending on the type of datasource you are connecting to.

### Import Data

For more information on how to use the Import Data module, see its [algorithm module reference page](algorithm-module-reference/import-data.md).


## Supported data sources

The designer supports the following datasources:

* Azure Blob Container
* Azure File Share
* Azure Data Lake
* Azure Data Lake Gen2
* Azure SQL Database
* Azure Database for PostgreSQL
* Databricks File System
* Azure Database for MySQL
* Local file (TSV, CSV)
* Web file (TSV, CSV)

If you import data in a format such as ARFF that includes metadata, the designer uses this metadata to define the heading and data type of each column. If you import data such as TSV or CSV format that doesn't include this metadata, the designer infers the data type for each column by sampling the data.

You can explicitly specify or column headings and data types using the [Edit Metadata](algorithm-module-reference/edit-metadata.md) module.

## Supported data types

The designer recognizes the following data types:

* String
* Integer
* Decimal
* Boolean
* Date

The designer uses an internal data type called ***data table*** to pass data between modules. You can explicitly convert your data into data table format using the [Convert to Dataset][convert-to-dataset] module.

Any module that accepts formats other than data table will convert the data to data table silently before passing it to the next module.

## Data capacities

Modules in Azure Machine Learning designer are limited by the size of the compute target. For larger datasets, you should use a larger Azure Machine Learning compute resource. For more information on Azure Machine Learning compute, see [What are compute targets in Azure Machine Learning?](concept-compute-target.md#azure-machine-learning-compute-managed)

## Next steps