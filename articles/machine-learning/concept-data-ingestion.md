---
title: Data ingestion options 
titleSuffix: Azure Machine Learning
description: Learn about data ingestion options  for training your machine learning models.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.reviewer: nibaccam
author: nibaccam
ms.author: nibaccam
ms.date: 02/20/2020

---

# Data ingestion in Azure Machine Learning

In this article, you learn what data ingestion options are available with Azure Machine Learning, and their pros and cons. 

## What is data ingestion? 

Data ingestion is the process in which unstructured data is extracted from one or multiple sources and prepared for training machine learning models. Data ingestion is time intensive, especially if done manually, and you have large amounts of data from multiple sources. Automating this effort frees up resources and ensures your models use the most recent and applicable data.

Azure Machine Learning offers two solutions for automating data ingestion:

1. Use [Azure Data Factory](#use-azure-data-factory) pipelines for data ingestion based on source data changes
2. Perform data ingestion as part of an Azure Machine Learning pipeline step using the[Azure Machine Learning Python SDK ](#use-python-sdk) 
3. Use a combination of Azure Data Fac

You can also rely on different tools throughout the process, for example:


## Use Azure Data Factory

With [Azure Data Factory](https://docs.microsoft.com/azure/data-factory/introduction) you can monitor your data sources and trigger the data ingestion pipeline. The following table summarizes the pros and cons for using Azure Data Factory for your data ingestion workflows.

|Pros|Cons
---|---
Specifically built to extract, load, and transform data.|Currently offers a limited set of pipeline tasks 
Allows you to create data-driven workflows for orchestrating data movement and transforming data at scale.|If invoking external Web APIs, like the web activity to trigger an Azure Pipeline, there's no out-of-the-box approach for making the task wait for a result to move forward with the flow
Natively supports data source triggered data ingestion|
Data preparation and model training processes are separate.|
Integrated with various data sources and other Azure tools, such as Azure Databricks|
Embedded data lineage capability for dataflows|
Provides a low code experience user interface for non-scripting approaches |

The following steps and diagram illustrate Azure Data Factory's data ingestion workflow.

1. Pull the data from its sources
1. Store the training data in a container, like Azure blob storage
1. Fetch the data from that input blob container
1. Transform and save the data to an output blob container, which serves as data storage for Azure Machine Learning
1. With prepared data stored, the Azure Data Factory pipeline invokes a training Machine Learning pipeline that receives the prepared data for model training

![ADF Data ingestion](media/concept-data-ingestion/data-ingest-option-one.png)

## Use the Python SDK and Azure Pipelines 

With the [Python SDK](https://docs.microsoft.com/python/api/overview/azureml-sdk/?view=azure-ml-py) and [Azure Pipelines](https://docs.microsoft.com/azure/devops/pipelines/get-started/what-is-azure-pipelines?view=azure-devops), you can incorporate data ingestion tasks into an Azure Machine Learning pipeline step. Leverage the scheduling features and flexibility of Azure Pipelines to build and trigger your Azure Machine Learning pipeline.

Pros| Cons
---|---
Configure your own Python scripts | Does not natively support data source change triggering
Leverage the scheduling features of Azure Pipelines|Requires development skills to create a data ingestion script
Azure Pipelines integrates with flexible YAML pipelines|Requires engineering practices to guarantee code quality and effectiveness
||Does not provide a user interface for creating the ingestion mechanism

In the following diagram, Azure Pipeline's build pipeline creates an Azure Machine Learning pipeline that contains two steps: data ingestion (pull and prepare data) and model training. Once the ML pipeline is created, the next step of the build pipeline is to trigger the created ML pipeline to run. This step is asynchronous, meaning that the build pipeline finishes once it triggers the ML pipeline to run. 

![Azure pipeline + SDK data ingestion](media/concept-data-ingestion/data-ingest-option-two.png)

This workflow is recommended for the following scenarios:

* You currently have simple data transformations, that can be implemented with Python
* You want data preparation as part of every model training execution
* You don't need to trigger your ingestion processes based on data source events

## Next steps

* Learn about continuous development of your models with [DevOps for data ingestion](how-to-cicd-data-ingestion.md).