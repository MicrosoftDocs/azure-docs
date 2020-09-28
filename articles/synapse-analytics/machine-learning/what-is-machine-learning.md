---
title:  Machine Learning in Azure Synapse Analytics 
description: An Overview of machine learning capabilities in Azure Synapse Analytics.

services: synapse-analytics 
ms.service: synapse-analytics 
ms.subservice: machine-learning
ms.topic: overview 
ms.reviewer: jrasnick, garye

ms.date: 09/25/2020   # mm/dd/yyyy
author: nelgson   # Your GitHub account name 
ms.author: negust      # Your microsoft.com email alias
---

# Machine Learning capabilities in Azure Synapse Analytics (workspaces preview)

[!INCLUDE [preview](../includes/note-preview.md)]

Azure Synapse Analytics offers various machine learning capabilities and this article provides an overview of how you can apply Machine Learning in the context of Azure Synapse.

This overview covers the different capabilities in Synapse related to machine learning, from a data science process perspective.

You may be familiar with how a typical data science process looks. It's well known process which most machine learning projects follow.

At a high level, the process contains the following steps:
* (Business understanding)
* Data aquisition and understanding
* Modeling
* Model deployment and scoring

In this article, we will describe the Azure Synapse machine learning capabilities in different analytics engines, from data science process perspective. For each step in the data science process we have summarized the Azure Synapse capabilities that can help.

## Azure Synapse machine learning capabilities

### Data aquisition and understanding

Most machine learning projects involve well established steps, and one of these steps is to access and understand the data.

#### Data source and pipelines
Thanks to [Azure Data Factory](/azure/data-factory/introduction.md) being a natively integrated part of Azure Synapse, there is a powerful set of tools available for data ingestion and data orchestration pipelines. This allows you to easily build data pipelines to access and transform the data into a format that can be consumed for machine learning. [Learn more about data pipelines](/azure/data-factory/concepts-pipelines-activities.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json) in Synapse. 

#### Data preparation and exploration/visualization
An important part of the machine learning process is to understand the data by exploration and visualizations.

Depending on where the data is stored, Synapse offers a set of different tools to explore and prepare it for analytics and machine learning. One of the quickest ways to get started with data exploration is using Apache Spark or Synapse SQL serverless pools directly over data in the data lake.

* [Apache Spark for Azure Synapse](../spark/apache-spark-overview.md) offers capabilities to transform, prepare and explore your data at scale. These spark pools offer tools like PySpark/Python, Scala and .NET for data processing at scale. Using powerful visualization libraries, the data exploration experience can be enhanced to help understand the data better. [Learn more about how to explore and visualize data in Synapse using Spark](../get-started-analyze-spark.md).

* [Synapse SQL serverless pools](https://docs.microsoft.com/en-us/azure/synapse-analytics/sql/on-demand-workspace-overview) offer a way to explore data using TSQL directly over the data lake. Synapse SQL serverless pools also offer some built-in visualizations in Synapse Studio. [Learn more about how to explore data with Synapse SQL serverless pools](https://docs.microsoft.com/en-us/azure/synapse-analytics/get-started-analyze-sql-on-demand).

### Modeling

In Azure Synapse, training machine learning models can be performed on the Apache Spark Pools with tools like PySpark/Python, Scala or .NET.

#### Train models on Spark Pools with MLlib
ML models can be trained with help from various algorithms and libraries. [Spark MLlib](http://spark.apache.org/docs/latest/ml-guide.html) offers scalable ML algorithms that can help solving most classical ML problems. [This tutorial](../spark/apache-spark-machine-learning-mllib-notebook.md) covers how to train a model using MLlib in Synapse.

In addition to MLib, popular libraries such as [Scikit Learn](https://scikit-learn.org/stable/) can also be used to develop models. [The following article](../spark/apache-spark-azure-portal-add-libraries.md) covers how to install libraries on Synapse Spark Pools.

#### Train models on Spark Pools Azure ML Auto ML
Another way to train ML models, that does not require much prior familiarity with machine learning, is to use Auto ML. [Auto ML](/azure/machine-learning/concept-automated-mls.md) is a feature that automatically trains a set of machine learning models and allows the user to select the best model based on specific metrics. Thanks to a seamless integration with Azure ML from Azure Synapse Notebooks, users can easily leverage Auto ML in Synapse with passthrough AAD authentication.  This means that you only need to point to your Azure ML workspace and do not need to enter any credentials. Here is an [Auto ML tutorial](../spark/apache-spark-azure-machine-learning-tutorial.md) that describes how to train models using Azure ML Auto ML on Synapse Spark Pools.

### Model deployment and scoring

Models that have been trained either in Azure Synapse or outside Azure Synapse can easily be used for batch scoring. Currently in Synapse, there are two ways in which you can run batch scoring.

* You can use the [TSQL PREDICT function](../sql-data-warehouse/sql-data-warehouse-predict.md) in Synapse SQL pools to run your predictions right where your data lives. This powerful and scalable function allows you to enrich your data without moving any data out of your data warehouse. We recently introduced a [new guided ML model experience in Synapse Studio](https://aka.ms/synapse-ml-ui), where you can deploy an ONNX model from the Azure ML model registry in Synapse SQL Pools for batch scoring using PREDICT.

* Another option for batch scoring ML models in Azure Synapse is to leverage the Apache Spark Pools for Azure Synapse. Depending on the libraries used to train the models, you can use a code experience to run your batch scoring.

## Next steps

* [Get started with Azure Synapse Analytics](get-started.md)
* [Create a workspace](quickstart-create-workspace.md)
