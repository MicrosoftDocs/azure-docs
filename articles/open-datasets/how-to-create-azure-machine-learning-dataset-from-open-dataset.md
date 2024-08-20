---
title: Create datasets with Azure Open Datasets
description: Learn how to create an Azure Machine Learning dataset from Azure Open Datasets.
ms.service: azure-open-datasets
ms.topic: conceptual
ms.author: franksolomon
author: fbsolo-ms1
ms.date: 07/31/2024
ms.custom: how-to, tracking-python
---

# Create Azure Machine Learning datasets from Azure Open Datasets

> [!CAUTION]
> This article references CentOS, a Linux distribution that has reached End Of Life (EOL) status. Please plan accordingly. For more information, visit [CentOS End Of Life guidance](/azure/virtual-machines/workloads/centos/centos-end-of-life).

In this article, you learn how to bring curated enrichment data into your local or remote machine learning experiments, with [Azure Machine Learning](../machine-learning/overview-what-is-azure-machine-learning.md) datasets and [Azure Open Datasets](./index.yml).

With an [Azure Machine Learning dataset](../machine-learning/v1/how-to-create-register-datasets.md), you create a reference to the data source location, along with a copy of its metadata. Because datasets are lazily evaluated, and because the data remains in its existing location, you

- Don't risk unintentionally changes to your original data sources
- Incur no extra storage cost
- Improve ML workflow performance speeds

For more information about where datasets fit in the overall Azure Machine Learning data access workflow, visit the [Securely access data](../machine-learning/v1/concept-data.md#data-workflow) article.

Azure Open Datasets are curated public datasets that add scenario-specific features to enrich your predictive solutions and improve the accuracy of those solutions. Visit the [Open Datasets catalog](./dataset-catalog.md) resource for public-domain data that can help you train machine learning models - for example:

- [Health and genomics](./dataset-catalog.md#health-and-genomics)
- [Labor and economics](./dataset-catalog.md#labor-and-economics)
- [Population and safety](./dataset-catalog.md#population-and-safety)
- [Supplemental and common datasets](./dataset-catalog.md#supplemental-and-common-datasets)
- [Transportation](./dataset-catalog.md#transportation)

Open Datasets are hosted in the cloud on Microsoft Azure. Both [Azure Machine Learning Python SDK](#create-datasets-with-the-sdk) and [Azure Machine Learning studio](#create-datasets-with-the-studio) include them.

## Prerequisites

You need:

- An Azure subscription. If you don't have one, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree).

- An [Azure Machine Learning workspace](../machine-learning/how-to-manage-workspace.md).

- The [Azure Machine Learning SDK for Python](/python/api/overview/azure/ml/install) installed, which includes the `azureml-datasets` package.

    - Create an [Azure Machine Learning compute instance](../machine-learning/how-to-create-compute-instance.md) - a fully configured and managed development environment that includes integrated notebooks and the SDK already installed.

    **OR**

    - Work in your own Python environment, and install the SDK yourself with [these instructions](/python/api/overview/azure/ml/install).

> [!NOTE]
> Some dataset classes have dependencies on the **azureml-dataprep** package. This package is only compatible with 64-bit Python. For Linux users, these classes are supported only on these Linux distributions:

- Debian (8, 9)
- CentOS (7)
- Fedora (27, 28)
- Red Hat Enterprise Linux (7, 8)
- Ubuntu (14.04, 16.04, 18.04)

## Create datasets with the SDK

To create Azure Machine Learning datasets via Azure Open Datasets classes, in the Python SDK, make sure you installed the package with `pip install azureml-opendatasets`. In the SDK, the class of each discrete data set represents that class, and certain classes are available as either an Azure Machine Learning [`FileDataset`](../machine-learning/v1/how-to-create-register-datasets.md#filedataset) datatype, an Azure Machine Learning [`TabularDataset`](../machine-learning/v1/how-to-create-register-datasets.md#tabulardataset) datatype, or both. Visit the [reference documentation](/python/api/azureml-opendatasets/azureml.opendatasets) for a full list of `opendatasets` classes.

You can retrieve certain `opendatasets` classes as either `TabularDataset` or `FileDataset` resources. You can then manipulate and/or download the files directly. Other classes can retrieve dataset **only** with use of the `get_tabular_dataset()` or `get_file_dataset()` functions from the `Dataset`class in the Python SDK.

This code shows that the MNIST `opendatasets` class can return either a `TabularDataset` or `FileDataset`:

```python
from azureml.core import Dataset
from azureml.opendatasets import MNIST

# MNIST class can return either TabularDataset or FileDataset
tabular_dataset = MNIST.get_tabular_dataset()
file_dataset = MNIST.get_file_dataset()
```

In this example, the Diabetes `opendatasets` class is only available as a `TabularDataset`. This requires the use of `get_tabular_dataset()`.

```python

from azureml.opendatasets import Diabetes
from azureml.core import Dataset

# Diabetes class can return ONLY TabularDataset and must be called from the static function
diabetes_tabular = Diabetes.get_tabular_dataset()
```

## Register datasets

Register an Azure Machine Learning dataset with your workspace, so you can share the dataset with others and reuse it across experiments in your workspace. When you register an Azure Machine Learning dataset created from Open Datasets, no data is immediately downloaded, but the data becomes accessible later (during training, for example) when requested from a central storage location.

To register your datasets with a workspace, use the [`register()`](/python/api/azureml-core/azureml.data.abstract_dataset.abstractdataset#azureml-data-abstract-dataset-abstractdataset-register) method.

```Python
titanic_ds = titanic_ds.register(workspace=workspace,
                                 name='titanic_ds',
                                 description='titanic training data')
```

## Create datasets with the studio

You can also create Azure Machine Learning datasets from Azure Open Datasets with [Azure Machine Learning studio](https://ml.azure.com). This consolidated web interface includes machine learning tools to perform data science scenarios for data science practitioners of all skill levels.

> [!Note]
> Datasets created through Azure Machine Learning studio are automatically registered to the workspace.

1. In your workspace, select the **Data** in the left nav. At the **Data assets** tab, select **Create**, as show in this screenshot:

   :::image type="content" source="./media/how-to-create-dataset-from-open-dataset/data-assets-tab.png" lightbox="./media/how-to-create-dataset-from-open-dataset/data-assets-tab.png" alt-text="Screenshot showing the Create control on the Data Assets tab.":::

1. At the next screen, add a name and an optional description for the new data asset. Then, select **Tabular** in the **Type** dropdown, as shown in this screenshot:

   :::image type="content" source="./media/how-to-create-dataset-from-open-dataset/select-tabular-dropdown-option.png" lightbox="./media/how-to-create-dataset-from-open-dataset/select-tabular-dropdown-option.png" alt-text="Screenshot showing selection of the Tabular option in the Type dropdown.":::

1. At the next screen, select **From Azure Open Datasets**, and then select **Next**, as shown in this screenshot:

   :::image type="content" source="./media/how-to-create-dataset-from-open-dataset/select-from-azure-open-datasets.png" lightbox="./media/how-to-create-dataset-from-open-dataset/select-from-azure-open-datasets.png" alt-text="Screenshot showing selection of the From Azure Open Datasets option.":::

1. At the next screen, select an available Azure Open Dataset. In this screenshot, we selected the **San Francisco Safety Data** Dataset:

   :::image type="content" source="./media/how-to-create-dataset-from-open-dataset/choose-an-azure-open-dataset.png" lightbox="./media/how-to-create-dataset-from-open-dataset/choose-an-azure-open-dataset.png" alt-text="Screenshot showing selection of the US Labor Force Statistics dataset.":::

1. Scroll down if necessary, and select **Next**, as shown in this screenshot:

   :::image type="content" source="./media/how-to-create-dataset-from-open-dataset/select-next.png" lightbox="./media/how-to-create-dataset-from-open-dataset/select-next.png" alt-text="Screenshot showing selection of the Next button.":::

1. Optionally, filter the data with the available filters, appropriate for the chosen dataset. For the **San Francisco Safety Data** dataset, we set the filtered date range between a start date of **July 1, 2024** and **July 17, 2024**. Select **Next**, as shown in this screenshot:

   :::image type="content" source="./media/how-to-create-dataset-from-open-dataset/data-asset-filter-example.png" lightbox="./media/how-to-create-dataset-from-open-dataset/data-asset-filter-example.png" alt-text="Screenshot showing selection of filter values and selection of the Next button.":::

1. At the next screen, review the settings for the new data asset, and make any necessary changes. When it seems good, select **Create** as shown in this screenshot:

   :::image type="content" source="./media/how-to-create-dataset-from-open-dataset/create-the-data-asset.png" lightbox="./media/how-to-create-dataset-from-open-dataset/create-the-data-asset.png" alt-text="Screenshot showing review of the chosen settings, and selection of the Next button.":::

1. For more information about the field descriptions and date ranges for the **San Francisco Safety Data** dataset, visit the [San Francisco Safety Data](./dataset-san-francisco-safety.md) resource. For more information about the other datasets, visit the [Azure Open Datasets Catalog](./dataset-catalog.md) resource.

The dataset is now available in your workspace under **Datasets**. You can use it in the same way as the other datasets you created.

## Access datasets for your experiments

Use your datasets in your machine learning experiments for training ML models. For more information, visit [Learn more about how to train with datasets](../machine-learning/v1/how-to-train-with-datasets.md).

## Example notebooks

For examples and demonstrations of Open Datasets functionality, review [these sample notebooks](samples.md).

## Next steps

- [Train your first ML model](../machine-learning/tutorial-1st-experiment-sdk-train.md).
- [Train with datasets](../machine-learning/v1/how-to-train-with-datasets.md).
- [Create an Azure Machine Learning dataset](../machine-learning/v1/how-to-create-register-datasets.md).
