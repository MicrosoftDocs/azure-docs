---
title: Create datasets with Azure Open Datasets
titleSuffix: Azure Open Datasets
description: Learn how to create an Azure Machine Learning dataset from Azure Open Datasets.
ms.service: open-datasets
ms.topic: conceptual
ms.author: nibaccam
author: nibaccam
ms.date: 08/05/2020
ms.custom: how-to, tracking-python

# Customer intent: As an experienced Python developer, I want to use Azure Open Datasets in my ML workflows for improved model accuracy.
---

# Create Azure Machine Learning datasets from Azure Open Datasets
[!INCLUDE [aml-applies-to-basic-enterprise-sku](../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this article, you learn how to create an Azure Machine Learning dataset from [Azure Open Datasets](https://azure.microsoft.com/services/open-datasets/) to access data for your local or remote experiments. 

By creating an [Azure Machine Learning dataset](../machine-learning/how-to-create-register-datasets.md), you create a reference to the data source location, along with a copy of its metadata. Because the data remains in its existing location, you incur no extra storage cost, and don't risk unintentionally changing your original data sources. Also, datasets are lazily evaluated, which aids in workflow performance speeds.
 
To understand where datasets fit in Azure Machine Learning's overall data access workflow, see  the [Securely access data](../machine-learning/concept-data.md#data-workflow) article.


Open Datasets are in the cloud on Microsoft Azure and are included in both the [Azure Machine Learning Python SDK](#create-datasets-with-the-sdk) and the [Azure Machine Learning studio](#create-datasets-with-the-studio).

## Why use Azure Open Datasets? 

Azure Open Datasets are curated public datasets that you can use to add scenario-specific features to machine learning solutions for more accurate models. Datasets include public-domain data for weather, census, holidays, public safety, and location that help you train machine learning models and enrich predictive solutions. 

For more information, see [What are open datasets?](overview-what-are-open-datasets.md)

## Prerequisites

To create and work with datasets, you need:

* An Azure subscription. If you don't have one, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree).

* An [Azure Machine Learning workspace](../machine-learning/how-to-manage-workspace.md).

* The [Azure Machine Learning SDK for Python installed](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py), which includes the azureml-datasets package.

    * Create an [Azure Machine Learning compute instance](../machine-learning/concept-compute-instance.md#managing-a-compute-instance), which is a fully configured and managed development environment that includes integrated notebooks and the SDK already installed.

    **OR**

    * Work on your own Jupyter notebook and install the SDK yourself with [these instructions](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py).

> [!NOTE]
> Some dataset classes have dependencies on the [azureml-dataprep](https://docs.microsoft.com/python/api/azureml-dataprep/?view=azure-ml-py) package, which is only compatible with 64-bit Python. For Linux users, these classes are supported only on the following distributions:  Red Hat Enterprise Linux (7, 8), Ubuntu (14.04, 16.04, 18.04), Fedora (27, 28), Debian (8, 9), and CentOS (7).

## Create datasets with the SDK

To create datasets via Open Datasets classes in the Azure Machine Learning Python SDK, make sure you've installed the package with `pip install azureml-opendatasets`. Each discrete data set is represented by its own class in the SDK, and certain classes are available as either a `TabularDataset`, `FileDataset`, or both. See the [reference documentation](https://docs.microsoft.com/python/api/azureml-opendatasets/azureml.opendatasets?view=azure-ml-py) for a full list of classes.

You can retrieve certain classes as either a `TabularDataset` or `FileDataset`, which allows you to manipulate and/or download the files directly. Other classes can get a dataset **only** by using one of `get_tabular_dataset()` or `get_file_dataset()` functions. The following code sample shows a few examples of these types of classes.

```python
from azureml.opendatasets import MNIST

# MNIST class can return either TabularDataset or FileDataset
tabular_dataset = MNIST.get_tabular_dataset()
file_dataset = MNIST.get_file_dataset()

from azureml.opendatasets import Diabetes

# Diabetes class can return ONLY TabularDataset and must be called from the static function
diabetes_tabular = Diabetes.get_tabular_dataset()
```

When you register a dataset created from Open Datasets, no data is immediately downloaded, but the data will be accessed later when requested (during training, for example) from a central storage location.

## Create datasets with the studio

You can also create datasets from Open Datasets with the [Azure Machine Learning studio](https://ml.azure.com).

1. In your workspace, select the **Datasets** tab under **Assets**. On the **Create dataset** drop-down menu, select **From Open Datasets**.

    ![Open Dataset with the UI](./media/how-to-create-dataset-from-open-dataset/open-datasets-1.png)

1. Select a dataset by selecting its tile. (You have the option to filter by using the search bar.) Select **Next**.

    ![Choose dataset](./media/how-to-create-dataset-from-open-dataset/open-datasets-2.png)

1. Choose a name under which to register the dataset, and optionally filter the data by using the available filters. In this case, for the **public holidays** dataset, you filter the time period to one year and the country code to only the US. Select **Create**.

    ![Set dataset params and create dataset](./media/how-to-create-dataset-from-open-dataset/open-datasets-3.png)

    The dataset is now available in your workspace under **Datasets**. You can use it in the same way as other datasets you've created.


## Access datasets for your experiments

Use your datasets in your machine learning experiments for training ML models. [Learn more about how to train with datasets](../machine-learning/how-to-train-with-datasets.md).

## Example notebooks

For examples and demonstrations of Open Datasets functionality,  see these [notebooks](https://github.com/Azure/OpenDatasetsNotebooks/tree/master/tutorials).

## Next steps

* [Train a model with datasets](../machine-learning/how-to-train-with-datasets.md).

* [Create an Azure machine learning dataset](../machine-learning/how-to-create-register-datasets.md).



