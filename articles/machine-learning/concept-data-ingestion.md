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
ms.date: 02/16/2020

---

# Data ingestion in Azure Machine Learning

In this article, you learn the advantages and disadvantages of the available data ingestion integrations for Azure Machine Learning. This article assumes your machine learning model is in production and you need a way to ingest data programmatically.

## What is data ingestion?

Data ingestion is the process in which large, at times unstructured, data is extracted from multiple sources, prepared and eventually transferred for use in production-ready machine learning models. 

## Trigger data ingestion

Trigger data ingestion to ensure your machine learning models use the most recent and prepared data for predictions and resulting analysis. 

In Azure Machine Learning, data ingestion pipelines are triggered and supported via integrations with 

1. [Azure Data Factory](https://docs.microsoft.com/azure/data-factory/introduction) and [Azure DevOps](https://docs.microsoft.com/azure/devops/pipelines/get-started/what-is-azure-pipelines?view=azure-devops)
2. [Azure Machine Learning Python SDK](https://docs.microsoft.com/python/api/overview/azureml-sdk/?view=azure-ml-py) and Azure DevOps.

### Common data ingestion scenarios

The following are common data ingestion triggering scenarios 

* Data change 

* Scheduled

* Code change

### Azure Data Factory and Azure DevOps

If you need to trigger the data ingestion processes based on an event in any of your data sources like when new data is added, choose [Azure Data Factory](https://docs.microsoft.com/azure/data-factory/introduction) as the tool for monitoring the sources and triggering the whole pipeline.

You may rely on different tools throughout the process, for example:

* Invoking Azure DevOps pipelines to orchestrate specific tasks as Build Pipelines.
* Leverage Azure DevOps pipelines to run Python scripts that prepare your data.
* Invoking Azure Machine Learning Service Pipelines/Experiments to train, register or deploy a model.

### Pros

* Azure Data Factory is the de facto Data Pipeline orchestrator Azure offers. It is supposed to be the next generation ETL tool on the cloud
* Data preparation and model training processes are separated
* Azure Data Factory has the ability to trigger a pipeline based on new data coming to any of the data sources
* A lot of various connectors for Azure services and Data sources
* Embedded data lineage capabilty for Data Flows
* The UI ADF offers is more friendly for non-scripting approaches

### Cons

* The set of pipeline tasks Azure Data Factory has to offer is still limited.
* If invoking external Web APIs - like the Web Activity to trigger an AzDO pipeline, there's no out-of-the-box approach for making the task wait for some result to move forward with the flow

### Python, Azure Machine Learning and Azure DevOps

The main reasons for you to choose Azure Machine Learning's Python SDK with Azure DevOps for data ingestion:

* You currently have simple data transformations which can be implemented with Python

* Data preparation is a part of every model training execution

* You don't need to trigger your ingestion processes based on data source events

If your scenario meets these aspects, take advantage of the scheduling features Azure DevOps offers, along with the power of Python scripts and the flexibility of YAML pipelines.

### Pros
* Simple

### Cons

* Does not support data source change triggering
* Requires development skills to create a data ingestion script
* Requires engineering practices on top of it to guarantee code quality and ensure it's working and effective
* Does not provide a user interface for creating the ingestion mechanism

## Next steps

* Learn more about [DevOps for data ingestion](how-to-cicd-data-ingestion.md).
