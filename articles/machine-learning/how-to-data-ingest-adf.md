---
title: Data ingestion with Azure Data Factory
titleSuffix: Azure Machine Learning
description: Learn how to build a data ingestion pipeline with Azure Data Factory.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: iefedore
author: eedorenko
manager: davete
ms.reviewer: larryfr
ms.date: 03/01/2020

# Customer intent: As an experienced data engineer, I need to create a production data ingestion pipeline for the data used to train my models.

---

# Data ingestion with Azure Data Factory

Azure Data Factory (ADF) is considered as a natural ETL service for the data ingestion for Machine Learning. In this article, you learn various options of building a data ingestion pipeline with ADF in conjunction with other Azure services.

Simple data transformation can be perfectly handled with native ADF activities and instruments such as [data flow]. When it comes to more complicated scenarios, the data, in most cases, is processed with some custom code, written, for example, in Python or R.
There are several common techniques of how that custom data processing may be performed with ADF. Each of them has pros and cons that determine if the technique is a good fit for a specific use case.

## Data is processed by ADF with Azure functions

![adf-function](media/how-to-data-ingest-adf/adf-function.png)

In this option the data is processed with custom Python code wrapped into an Azure Function which is invoked with [ADF Azure Function activity]. This approach is a good option for lightweight data transformations. 

* Pros:
    * The data is processed on a serverless compute with a relatively low latency
    * ADF pipeline can invoke a [Durable Azure Function] that may implement a sophisticated data transformation flow 
    * The details of the data transformation is abstracted away by the Azure Function that can be reused and invoked from other places
* Cons:
    * Azure Functions infrastructure should be provisioned
    * Azure Functions are good only for short running data processing

## Data is processed by ADF with Custom Component Activity

![adf-customcomponent](media/how-to-data-ingest-adf/adf-customcomponent.png)

In this option the data is processed with custom Python code wrapped into an executable which is invoked with an [ADF Custom Component] activity. This approach is a better fit for large data than the previous technique.

* Pros:
    * The data is processed on [Azure Batch] pool which provides large-scale parallel and high-performance computing
    * Can be used to run heavy algorithms and process significant amounts of data
* Cons:
    * Azure Batch pool should be provisioned
    * Over engineering related to wrapping Python code into an executable along with the complexity of handling dependencies and input/output parameters

## Data is processed by ADF with Azure Databricks Python notebook

![adf-databricks](media/how-to-data-ingest-adf/adf-databricks.png)

In this technique the data transformation is performed by a Python notebook, running on an Azure Databricks cluster. This is, probably, the most common approach that leverages the full power of an Azure Databricks service which is designed for distributed data processing at scale.

* Pros:
    * The data is transformed on the most powerful data processing Azure service which is backed up by Apache Spark environment
    * Native support of Python along with data science frameworks and libraries including TensorFlow, PyTorch, and scikit-learn
    * There is no need to wrap the Python code into functions or executable modules. The code works as is.
* Cons:
    * Azure Databricks infrastructure should be provisioned
    * Could be an expensive option
    * Spinning up compute clusters from "cold" mode takes some time that brings high latency to the solution 
    

## Consuming data in Azure Machine Learning pipelines

![aml-dataset](media/how-to-data-ingest-adf/aml-dataset.png)

An Azure Machine Learning (AML) pipeline consumes the prepared data from a data storage via [datastores] and [datatsets]. A dataset of specific version is referring to the exact location in the data storage. On each execution an ADF pipeline saves the processed data to a new location. It invokes an Azure Machine Learning (AML) pipeline passing the location of the data as a parameter along with ADF pipeline run id. The AML pipeline registers a new version of a dataset pointing to the passed location. So each training pipeline execution is linked to a specific dataset version which makes it possible to track what data was used to train the model and which ADF pipeline execution prepared it.

## Next steps

* [DevOps for a data ingestion pipeline](https://docs.microsoft.com/azure/machine-learning/how-to-cicd-data-ingestion)
