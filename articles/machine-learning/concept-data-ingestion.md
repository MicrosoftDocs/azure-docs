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
ms.date: 02/25/2020

---

# Data ingestion in Azure Machine Learning

In this article, you learn about the pros and cons of the following data ingestion options available with Azure Machine Learning. Depending on your data and data ingestion needs, you can use these options separately, or together as part of your overall data ingestion workflow.

1. [Azure Data Factory](#use-azure-data-factory) pipelines
2. [Azure Machine Learning Python SDK](#use-the-python-sdk)


Data ingestion is the process in which unstructured data is extracted from one or multiple sources and then prepared for training machine learning models. It's also time intensive, especially if done manually, and if you have large amounts of data from multiple sources. Automating this effort frees up resources and ensures your models use the most recent and applicable data.

## Use Azure Data Factory

[Azure Data Factory](https://docs.microsoft.com/azure/data-factory/introduction) offers native support for data source monitoring and triggers for data ingestion pipelines.  

The following table summarizes the pros and cons for using Azure Data Factory for your data ingestion workflows.

|Pros|Cons
---|---
Specifically built to extract, load, and transform data.|Currently offers a limited set of Azure Data Factory pipeline tasks 
Allows you to create data-driven workflows for orchestrating data movement and transformations at scale.|If invoking external Web APIs, like the web activity to trigger an Azure Pipeline, there's no out-of-the-box approach for making the task wait for a result to move forward with the flow
Natively supports data source triggered data ingestion| Expensive to construct and maintain
Integrated with various Azure tools like [Azure Databricks](https://docs.microsoft.com/azure/data-factory/transform-data-using-databricks-notebook) and [Azure Functions](https://docs.microsoft.com/azure/data-factory/control-flow-azure-function-activity) | Doesn't natively run scripts, instead relies on separate compute for script runs 
Data preparation and model training processes are separate.|
Embedded data lineage capability for Azure Data Factory dataflows|
Provides a low code experience [user interface](https://docs.microsoft.com/azure/data-factory/quickstart-create-data-factory-portal) for non-scripting approaches |

These steps and the following diagram illustrate Azure Data Factory's data ingestion workflow.

1. Pull the data from its sources
1. Transform and save the data to an output blob container, which serves as data storage for Azure Machine Learning
1. With prepared data stored, the Azure Data Factory pipeline invokes a training Machine Learning pipeline that receives the prepared data for model training


    ![ADF Data ingestion](media/concept-data-ingestion/data-ingest-option-one.svg)

## Use the Python SDK 

With the [Python SDK](https://docs.microsoft.com/python/api/overview/azureml-sdk/?view=azure-ml-py), you can incorporate data ingestion tasks into an [Azure Machine Learning pipeline](how-to-create-your-first-pipeline.md) step.

The following table summarizes the pros and con for using the SDK and an ML pipelines step for data ingestion tasks.

Pros| Cons
---|---
Configure your own Python scripts | Does not natively support data source change triggering. Requires Logic App or Azure Function implementations
Data preparation as part of every model training execution|Requires development skills to create a data ingestion script
||Requires engineering practices to guarantee code quality and effectiveness
||Does not provide a user interface for creating the ingestion mechanism

In the following diagram, the Azure Machine Learning pipeline consists of two steps: data ingestion and model training. The data ingestion step encompasses tasks that can be accomplished using Python libraries and the SDK, such as extracting the data from local/web sources, and  basic data transformations, like missing value imputation. The training step then uses the prepared data as input to train your machine learning model. 

![Azure pipeline + SDK data ingestion](media/concept-data-ingestion/data-ingest-option-two.png)

## Next steps

* Automate and schedule data ingestion updates using [Azure Pipelines for data ingestion](how-to-cicd-data-ingestion.md).