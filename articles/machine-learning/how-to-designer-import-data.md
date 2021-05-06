---
title: Import data into the designer
titleSuffix: Azure Machine Learning
description: Learn how to import data into Azure Machine Learning designer using Azure Machine Learning datasets and the Import Data module.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
author: likebupt
ms.author: keli19
ms.date: 11/13/2020
ms.topic: how-to
ms.custom: designer
---

# Import data into Azure Machine Learning designer

In this article, you learn how to import your own data in the designer to create custom solutions. There are two ways you can import data into the designer: 

* **Azure Machine Learning datasets** - Register [datasets](concept-data.md#datasets) in Azure Machine Learning to enable advanced features that help you manage your data.
* **Import Data module** - Use the [Import Data](algorithm-module-reference/import-data.md) module to directly access data from online datasources.

[!INCLUDE [machine-learning-missing-ui](../../includes/machine-learning-missing-ui.md)]

## Use Azure Machine Learning datasets

We recommend that you use [datasets](concept-data.md#datasets) to import data into the designer. When you register a dataset, you can take full advantage of advanced data features like [versioning and tracking](how-to-version-track-datasets.md) and [data monitoring](how-to-monitor-datasets.md).

### Register a dataset

You can register existing datasets [programatically with the SDK](how-to-create-register-datasets.md#datasets-sdk) or [visually in Azure Machine Learning studio](how-to-connect-data-ui.md#create-datasets).

You can also register the output for any designer module as a dataset.

1. Select the module that outputs the data you want to register.

1. In the properties pane, select **Outputs + logs** > **Register dataset**.

    ![Screenshot showing how to navigate to the Register Dataset option](media/how-to-designer-import-data/register-dataset-designer.png)

If the module output data is in a tabular format, you must choose to register the output as a **file dataset** or **tabular dataset**.

 - **File dataset** registers the module's output folder as a file dataset. The output folder contains a data file and meta files that the designer uses internally. Select this option if you want to continue to use the registered dataset in the designer. 

 - **Tabular dataset** registers only the module's the output data file as a tabular dataset. This format is easily consumed by other tools, for example in Automated Machine Learning or the Python SDK. Select this option if you plan to use the registered dataset outside of the designer.  
 

### Use a dataset

Your registered datasets can be found in the module palette, under **Datasets**. To use a dataset, drag and drop it onto the pipeline canvas. Then, connect the output port of the dataset to other modules in the canvas. 

If you register a file dataset, the output port type of the dataset is **AnyDirectory**. If you register a Tabular dataset, the output port type of the dataset if **DataFrameDirectory**. Note that if you connect the output port of the dataset to other modules in the designer, the port type of datasets and modules need to be aligned.

![Screenshot showing location of saved datasets in the designer palette](media/how-to-designer-import-data/use-datasets-designer.png)


> [!NOTE]
> The designer supports [dataset versioning](how-to-version-track-datasets.md). Specify the dataset version in the property panel of the dataset module.

### Limitations 

- Currently you can only visualize tabular dataset in the designer. If you register a file dataset outside designer, you cannot visualize it in the designer canvas.
- Your dataset is stored in virtual network (VNet). If you want to visualize, you need to enable workspace managed identity of the datastore.
    1. Go the the related datastore and click **Update Credentials**
    :::image type="content" source="./media/resource-known-issues/datastore-update-credential.png" alt-text="Update Credentials":::
    1. Select **Yes** to enable workspace managed identity.
    :::image type="content" source="./media/resource-known-issues/enable-workspace-managed-identity.png" alt-text="Enable Workspace Managed Identity":::

## Import data using the Import Data module

While we recommend that you use datasets to import data, you can also use the [Import Data](algorithm-module-reference/import-data.md) module. The Import Data module skips registering your dataset in Azure Machine Learning and imports data directly from a [datastore](concept-data.md#datastores) or HTTP URL.

For detailed information on how to use the Import Data module, see the [Import Data reference page](algorithm-module-reference/import-data.md).

> [!NOTE]
> If your dataset has too many columns, you may encounter the following error: "Validation failed due to size limitation". To avoid this, [register the dataset in the Datasets interface](how-to-connect-data-ui.md#create-datasets).

## Supported sources

This section lists the data sources supported by the designer. Data comes into the designer from either a datastore or from [tabular dataset](how-to-create-register-datasets.md#dataset-types).

### Datastore sources
For a list of supported datastore sources, see [Access data in Azure storage services](how-to-access-data.md#supported-data-storage-service-types).

### Tabular dataset sources

The designer supports tabular datasets created from the following sources:
 * Delimited files
 * JSON files
 * Parquet files
 * SQL queries

## Data types

The designer internally recognizes the following data types:

* String
* Integer
* Decimal
* Boolean
* Date

The designer uses an internal data type to pass data between modules. You can explicitly convert your data into data table format using the [Convert to Dataset](algorithm-module-reference/convert-to-dataset.md) module. Any module that accepts formats other than the internal format will convert the data silently before passing it to the next module.

## Data constraints

Modules in the designer are limited by the size of the compute target. For larger datasets, you should use a larger Azure Machine Learning compute resource. For more information on Azure Machine Learning compute, see [What are compute targets in Azure Machine Learning?](concept-compute-target.md#azure-machine-learning-compute-managed)

## Access data in a virtual network

If your workspace is in a virtual network, you must perform additional configuration steps to  visualize data in the designer. For more information on how to use datastores and datasets in a virtual network, see [Use Azure Machine Learning studio in an Azure virtual network](how-to-enable-studio-virtual-network.md).

## Next steps

Learn the designer fundamentals with this [Tutorial: Predict automobile price with the designer](tutorial-designer-automobile-price-train-score.md).
