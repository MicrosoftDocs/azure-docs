---
title: Data in Azure Machine Learning
titleSuffix: Azure Machine Learning
description: Learn how Azure Machine Learning interacts with your data and how it's utilized across your machine learning experiments.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.reviewer: nibaccam
author: nibaccam
ms.author: nibaccam
ms.date: 11/20/2019

---

# Data in Azure Machine Learning

In this article, learn how your data is accessed and utilized across your machine learning experiments in Azure Machine Learning. 



## Access data in Azure data storage services

When you save your data in [Azure storage services](https://docs.microsoft.com/azure/storage/common/storage-introduction), you are storing your data in a scalable and secure cloud storage location. To access your data in storage, Azure Machine Learning offers solutions like datastores and datasets that allow you to reference your data without compromising security and ease of reuse.

### Datastores

An Azure datastore is a storage abstraction over an Azure Machine Learning storage account. Datastores allow you to easily access your data in Azure storage services by storing connection information, like your subscription ID and token authorization, without you having to hard code that information in your scripts. 

+ [Register and create datastores](how-to-access-data.md)

### Datasets

Azure Machine Learning datasets aren't copies of your data. When you create a dataset, you create a reference point to the data in your storage service, so no extra storage cost is incurred.

Create an unregistered dataset in memory for your local experiments, or register it to your workspace to share and reuse it across different machine learning experiments without worrying about data ingestion complexities. 

+ [Create and register datasets](how-to-create-register-datasets.md)

#### What can we do with datasets?

With datasets, you can accomplish a number of machine learning tasks through seamless integration with Azure Machine Learning features. 

+ Consume datasets in [automated ML experiments](how-to-create-portal-experiments.md), [ML pipelines](how-to-create-your-first-pipeline.md) and the [designer](tutorial-designer-automobile-price-train-score.md#import-data)
+ Use datasets for a [data labeling project](how-to-create-labeling-projects.md)
+ [Train machine learning models with datasets](how-to-train-with-datasets.md).
+ [Version and track](how-to-track-version-datasets.md) dataset lineage.
+ [Set up a dataset monitor](#drift) for data drift detection.

#### Types of datasets

You can create a dataset from paths in datastores, pubic web urls, Azure Open Datasets and local files. Datasets provide you with the capability to do sampling, exploratory data analysis, and access data for machine learning experiments.  

There are two different types of datasets

* [TabularDataset](https://docs.microsoft.com/python/api/azureml-core/azureml.data.tabulardataset?view=azure-ml-py) represents data in a tabular format by parsing the provided file or list of files. This provides you with the ability to materialize the data into a Pandas or Spark DataFrame for further manipulation and cleansing.For a complete list of files you can create TabularDatasets from see the [TabularDatasetFactory class](https://aka.ms/tabulardataset-api-reference).

* [FileDataset](https://docs.microsoft.com/python/api/azureml-core/azureml.data.file_dataset.filedataset?view=azure-ml-py) references single or multiple files in your datastores or public URLs. By this method, you can download or mount files of your choosing to your compute as a FileDataset object.

## Azure Open Datasets

[Azure Open Datasets](https://docs.microsoft.com/azure/open-datasets/overview-what-are-open-datasets) are curated public datasets that you can use to add scenario-specific features to machine learning solutions for more accurate models. Open Datasets are in the cloud on Microsoft Azure and are integrated into Azure Machine Learning. You can also access the datasets through APIs and use them in other products, such as Power BI and Azure Data Factory.

Datasets include public-domain data for weather, census, holidays, public safety, and location that help you train machine learning models and enrich predictive solutions. You can also share your public datasets on Azure Open Datasets.

<a name="drift"></a>

## Data drift

In the context of machine learning, data drift is the change in model input data that leads to model performance degradation. It is one of the top reasons model accuracy degrades over time, thus monitoring data drift helps detect model performance issues.

+ [Create a dataset monitor](how-to-monitor-datasets.md) to detect and alert to data drift on new data in a dataset.

## Next steps 

* For dataset training examples, see [sample notebooks](https://aka.ms/dataset-tutorial).
* For data drift examples, see this [data drift tutorial](https://aka.ms/datadrift-notebook).