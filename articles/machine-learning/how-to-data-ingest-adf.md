---
title: Data ingestion with Azure Data Factory
titleSuffix: Azure Machine Learning
description: Learn the available options for building a data ingestion pipeline with Azure Data Factory and the benefits of each.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: iefedore
author: eedorenko
manager: davete
ms.reviewer: larryfr
ms.date: 01/26/2021
ms.topic: how-to
ms.custom: devx-track-python, data4ml

# Customer intent: As an experienced data engineer, I need to create a production data ingestion pipeline for the data used to train my models.

---

# Data ingestion with Azure Data Factory

In this article, you learn about the available options for building a data ingestion pipeline with [Azure Data Factory](../data-factory/introduction.md). This Azure Data Factory pipeline is used to ingest data for use with [Azure Machine Learning](overview-what-is-azure-ml.md). Data Factory allows you to easily extract, transform, and load (ETL) data. Once the data has been transformed and loaded into storage, it can be used to train your machine learning models in Azure Machine Learning.

Simple data transformation can be handled with native Data Factory activities and instruments such as [data flow](../data-factory/control-flow-execute-data-flow-activity.md). When it comes to more complicated scenarios, the data can be processed with some custom code. For example, Python or R code.

## Compare Azure Data Factory data ingestion pipelines 
There are several common techniques of using Data Factory to transform data during ingestion. Each technique has advantages and disadvantages that help determine if it is a good fit for a specific use case:

| Technique | Advantages | Disadvantages |
| ----- | ----- | ----- |
| Data Factory + Azure Functions | <li> Low latency, serverless compute<li>Stateful functions<li>Reusable functions | Only good for short running processing |
| Data Factory + custom component | <li>Large-scale parallel computing<li>Suited for heavy algorithms | <li>Requires wrapping code into an executable<li>Complexity of handling dependencies and IO |
| Data Factory + Azure Databricks notebook |<li> Apache Spark<li>Native Python environment |<li>Can be expensive<li>Creating clusters initially takes time and adds latency

## Azure Data Factory with Azure functions

Azure Functions allows you to run small pieces of code (functions) without worrying about application infrastructure. In this option, the data is processed with custom Python code wrapped into an Azure Function. 

The function is invoked with the [Azure Data Factory Azure Function activity](../data-factory/control-flow-azure-function-activity.md). This approach is a good option for lightweight data transformations. 

![Diagram shows an Azure Data Factory pipeline, with Azure Function and Run ML Pipeline, and an Azure Machine Learning pipeline, with Train Model, and how they interact with raw data and prepared data.](media/how-to-data-ingest-adf/adf-function.png)



* Advantages:
    * The data is processed on a serverless compute with a relatively low latency
    * Data Factory pipeline can invoke a [Durable Azure Function](../azure-functions/durable/durable-functions-overview.md) that may implement a sophisticated data transformation flow 
    * The details of the data transformation are abstracted away by the Azure Function that can be reused and invoked from other places
* Disadvantages :
    * The Azure Functions must be created before use with ADF
    * Azure Functions is good only for short running data processing

## Azure Data Factory with Custom Component activity

In this option, the data is processed with custom Python code wrapped into an executable. It is invoked with an [ Azure Data Factory Custom Component activity](../data-factory/transform-data-using-dotnet-custom-activity.md). This approach is a better fit for large data than the previous technique.

![Diagram shows an Azure Data Factory pipeline, with a custom component and Run M L Pipeline, and an Azure Machine Learning pipeline, with Train Model, and how they interact with raw data and prepared data.](media/how-to-data-ingest-adf/adf-customcomponent.png)

* Advantages:
    * The data is processed on [Azure Batch](../batch/batch-technical-overview.md) pool, which provides large-scale parallel and high-performance computing
    * Can be used to run heavy algorithms and process significant amounts of data
* Disadvantages:
    * Azure Batch pool must be created before use with Data Factory
    * Over engineering related to wrapping Python code into an executable. Complexity of handling dependencies and input/output parameters

## Azure Data Factory with Azure Databricks Python notebook

[Azure Databricks](https://azure.microsoft.com/services/databricks/) is an Apache Spark-based analytics platform in the Microsoft cloud.

In this technique, the data transformation is performed by a [Python notebook](../data-factory/transform-data-using-databricks-notebook.md), running on an Azure Databricks cluster. This is probably, the most common approach that leverages the full power of an Azure Databricks service. It is designed for distributed data processing at scale.

![Diagram shows an Azure Data Factory pipeline, with Azure Databricks Python and Run M L Pipeline, and an Azure Machine Learning pipeline, with Train Model, and how they interact with raw data and prepared data.](media/how-to-data-ingest-adf/adf-databricks.png)

* Advantages:
    * The data is transformed on the most powerful data processing Azure service, which is backed up by Apache Spark environment
    * Native support of Python along with data science frameworks and libraries including TensorFlow, PyTorch, and scikit-learn
    * There is no need to wrap the Python code into functions or executable modules. The code works as is.
* Disadvantages:
    * Azure Databricks infrastructure must be created before use with Data Factory
    * Can be expensive depending on Azure Databricks configuration
    * Spinning up compute clusters from "cold" mode takes some time that brings high latency to the solution 
    

## Consume data in Azure Machine Learning 

The Data Factory pipeline saves the prepared data to your cloud storage (such as Azure Blob or Azure Datalake). <br>
Consume your prepared data in Azure Machine Learning by, 

* Invoking an Azure Machine Learning pipeline from your Data Factory pipeline.<br>**OR**
* Creating an [Azure Machine Learning datastore](how-to-access-data.md#create-and-register-datastores) and [Azure Machine Learning dataset](how-to-create-register-datasets.md) for use at a later time.

### Invoke Azure Machine Learning pipeline from Data Factory

This method is recommended for [Machine Learning Operations (MLOps) workflows](concept-model-management-and-deployment.md#what-is-mlops). If you don't want to set up an Azure Machine Learning pipeline, see [Read data directly from storage](#read-data-directly-from-storage).

Each time the Data Factory pipeline runs, 

1. The data is saved to a different location in storage. 
1. To pass the location to Azure Machine Learning, the Data Factory pipeline calls an [Azure Machine Learning pipeline](concept-ml-pipelines.md). When calling the ML pipeline, the data location and run ID are sent as parameters. 
1. The ML pipeline can then create an Azure Machine Learning datastore and dataset with the data location. Learn more in [Execute Azure Machine Learning pipelines in Data Factory](../data-factory/transform-data-machine-learning-service.md).

![Diagram shows an Azure Data Factory pipeline and an Azure Machine Learning pipeline and how they interact with raw data and prepared data. The Data Factory pipeline feeds data to the Prepared Data database, which feeds a data store, which feeds datasets in the Machine Learning workspace.](media/how-to-data-ingest-adf/aml-dataset.png)

> [!TIP]
> Datasets [support versioning](./how-to-version-track-datasets.md), so the ML pipeline can register a new version of the dataset that points to the most recent data from the ADF pipeline.

Once the data is accessible through a datastore or dataset, you can use it to train an ML model. The training process might be part of the same ML pipeline that is called from ADF. Or it might be a separate process such as experimentation in a Jupyter notebook.

Since datasets support versioning, and each run from the pipeline creates a new version, it's easy to understand which version of the data was used to train a model.

### Read data directly from storage

If you don't want to create a ML pipeline, you can access the data directly from the storage account where your prepared data is saved with an Azure Machine Learning datastore and dataset. 

The following Python code demonstrates how to create a datastore that connects to Azure DataLake Generation 2 storage. [Learn more about datastores and where to find service principal permissions](how-to-access-data.md#create-and-register-datastores).

```python
ws = Workspace.from_config()
adlsgen2_datastore_name = '<ADLS gen2 storage account alias>'  #set ADLS Gen2 storage account alias in AML

subscription_id=os.getenv("ADL_SUBSCRIPTION", "<ADLS account subscription ID>") # subscription id of ADLS account
resource_group=os.getenv("ADL_RESOURCE_GROUP", "<ADLS account resource group>") # resource group of ADLS account

account_name=os.getenv("ADLSGEN2_ACCOUNTNAME", "<ADLS account name>") # ADLS Gen2 account name
tenant_id=os.getenv("ADLSGEN2_TENANT", "<tenant id of service principal>") # tenant id of service principal
client_id=os.getenv("ADLSGEN2_CLIENTID", "<client id of service principal>") # client id of service principal
client_secret=os.getenv("ADLSGEN2_CLIENT_SECRET", "<secret of service principal>") # the secret of service principal

adlsgen2_datastore = Datastore.register_azure_data_lake_gen2(
    workspace=ws,
    datastore_name=adlsgen2_datastore_name,
    account_name=account_name, # ADLS Gen2 account name
    filesystem='<filesystem name>', # ADLS Gen2 filesystem
    tenant_id=tenant_id, # tenant id of service principal
    client_id=client_id, # client id of service principal
```

Next, create a dataset to reference the file(s) you want to use in your machine learning task. 

The following code creates a TabularDataset from a csv file, `prepared-data.csv`. Learn more about [dataset types and accepted file formats](how-to-create-register-datasets.md#dataset-types). 

```python
from azureml.core import Workspace, Datastore, Dataset
from azureml.core.experiment import Experiment
from azureml.train.automl import AutoMLConfig

# retrieve data via AML datastore
datastore = Datastore.get(ws, adlsgen2_datastore)
datastore_path = [(datastore, '/data/prepared-data.csv')]
        
prepared_dataset = Dataset.Tabular.from_delimited_files(path=datastore_path)
```

From here, use `prepared_dataset` to reference your prepared data, like in your training scripts. Learn how to [Train models with datasets in Azure Machine Learning](./how-to-train-with-datasets.md).

## Next steps

* [Run a Databricks notebook in Azure Data Factory](../data-factory/transform-data-using-databricks-notebook.md)
* [Access data in Azure storage services](./how-to-access-data.md#create-and-register-datastores)
* [Train models with datasets in Azure Machine Learning](./how-to-train-with-datasets.md).
* [DevOps for a data ingestion pipeline](./how-to-cicd-data-ingestion.md)