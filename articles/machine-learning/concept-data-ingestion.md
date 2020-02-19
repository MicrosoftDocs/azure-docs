---
title: Data in Azure Machine Learning
titleSuffix: Azure Machine Learning
description: Learn how to ingest data into your machine learning models in production.
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

Data ingestion is the process in which unstructured data is extracted from one or multiple sources and prepared for training machine learning models. Like many aspects of the model building process, data ingestion is time intensive, especially if done manually, have large amounts of data or need to pull from multiple data sources. Automating this effort frees up resources and ensures your models use the most recent and applicable data.

Azure Machine Learning offers two solutions to automate data ingestion. 

1. [Azure Data Factory](https://docs.microsoft.com/azure/data-factory/introduction)
2. [Azure Machine Learning Python SDK](https://docs.microsoft.com/python/api/overview/azureml-sdk/?view=azure-ml-py) with [Azure DevOps](https://docs.microsoft.com/azure/devops/pipelines/get-started/what-is-azure-pipelines?view=azure-devops).

Azure Machine Learning, data ingestion is accomplished using pipelines that automatically run based on triggers such as, 

* Source data changes 
* Scheduled data pulls
* Code or script changes

## Option 1: Azure Data Factory 

If you need to trigger the data ingestion processes based on an event in any of your data sources, like when new data is added, choose [Azure Data Factory](https://docs.microsoft.com/azure/data-factory/introduction) to monitor your data sources and trigger the data ingestion pipeline.

The following steps and diagram illustrate Azure Data Factory's data ingestion workflow.

1. Pull the data from its sources
1. Store the training data in a container, like Azure blob storage. 
1. Fetch the data from that input blob container
1. Transform and save the data to an output blob container. This container serves as a data storage for Azure Machine Learning.
1. With prepared data stored, the Azure Data Factory pipeline invokes a training Machine Learning pipeline that receives the prepared data for model training. 

![ADF Data ingestion](media/concept-data-ingestion/data-ingest-option-one.png)

You can also rely on different tools throughout the process, for example:

* Invoking Azure DevOps pipelines to orchestrate specific tasks as build pipelines.
* Leverage Azure DevOps pipelines to run Python scripts that prepare your data.
* Invoking Azure Machine Learning pipelines/experiments to train, register, or deploy a model.

### Pros 

Benefits to Azure Data Factory for data ingestion,

* Azure Data Factory is the de facto data pipeline orchestrator Azure offers.
* Data preparation and model training processes are separate.
* Trigger a pipeline based on new data coming to any of the monitored data sources
* Integrations with various data sources and other Azure tools, such as Azure Databricks.
* Embedded data lineage capability for dataflows
* Provides a user interface that is friendly for non-scripting approaches and low code experience customers

### Cons

The disadvantages to Azure Data Factory for data ingestion,

* Currently offers a limited set of pipeline tasks 
* If invoking external Web APIs - like the Web Activity to trigger an AzDevOps pipeline, there's no out-of-the-box approach for making the task wait for some result to move forward with the flow

## Option 2: Python SDK with Azure DevOps

With the Python SDK and Azure DevOps, incorporate the tasks of data ingestion into a step or multiple steps of an Azure Machine Learning pipeline. Orchestrate your Azure Machine Learning pipeline using Azure DevOps to leverage its scheduling features and flexibility.

In the following diagram, the Azure DevOps build pipeline creates an Azure Machine Learning pipeline that contains two steps: data ingestion (pull and prepare data) and model training. Once the ML pipeline is created, the next step of the Azure DevOps build pipeline is to trigger the created ML pipeline to run. This step is asynchronous, meaning that the Azure DevOps build pipeline finishes once it triggers the ML pipeline to run. 

![ADF Data ingestion](media/concept-data-ingestion/data-ingest-option-two.png)

This workflow is recommended if, 

* You currently have simple data transformations, which can be implemented with Python
* Want data preparation as part of every model training execution
* You don't need to trigger your ingestion processes based on data source events

### Pros

Benefits to the Python SDK, 

* Configure your own Python scripts 
* Leverage the scheduling features of Azure DevOps
* Integration with flexible YAML pipelines

### Cons

* Does not support data source change triggering
* Requires development skills to create a data ingestion script
* Requires engineering practices to guarantee code quality and effectiveness
* Does not provide a user interface for creating the ingestion mechanism

## Next steps

* Learn about continuous development of your models with [DevOps for data ingestion](how-to-cicd-data-ingestion.md).