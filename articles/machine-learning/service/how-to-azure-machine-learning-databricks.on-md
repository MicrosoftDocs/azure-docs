---
title: Use the Azure Machine Learning SDK on Databricks
description: Learn how to train and deploy models with the Azure Machine Learning SDK on Apache Spark. This article shows end to end custom machine learning on Databricks. 
services: machine-learning
author: pasha
ms.author: pasha
manager:  cgronlun
ms.service: machine-learning
ms.component: core
ms.reviewer: sgilley
manager: cgronlun
ms.topic: conceptual
ms.date: 12/04/2018
---

# Use the Azure Machine Learning SDK on Databricks

Use the Azure Machine Learning SDK for end to end custom machine learning on Azure Databricks. This article shows how to train an income prediction model to predict the income of an individual. The model will predict if income is >50 K or <50 K based on demographic data from the US census.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

1. Create a [Databricks cluster](https://docs.microsoft.com/azure/azure-databricks/quickstart-create-databricks-workspace-portal). Create your Azure Databricks cluster as v4.x (high concurrency preferred) with **Python 3**. 
1. Create a library to [install and attach](https://docs.databricks.com/user-guide/libraries.html#create-a-library) the `azureml-sdk[databricks]` PyPi package to your cluster. 

Be aware of these [common Databricks issues](resource-known-issues#databricks).

## Get the notebooks

Download the [Azure Databricks AML SDK notebooks](https://github.com/Azure/MachineLearningNotebooks/blob/master/databricks/Databricks_AMLSDK_github.dbc) to import all the example notebooks in your Databricks cluster.

This set of notebooks shows an income prediction experiment based on this [census dataset](https://archive.ics.uci.edu/ml/datasets/adult).  These notebooks demonstrate how to prepare data, train, and deploy a Spark ML model from within Azure Databricks using the Azure ML Python SDK.

## Install and configure

Run the [Installation and Configuration](https://github.com/Azure/MachineLearningNotebooks/blob/master/databricks/01.Installation_and_Configuration.ipynb
) notebook to:

* Install the Azure ML Python SDK
* Create an Azure ML workspace
* Save the ML workspace configuration

## Prepare data

Run the [Ingest data](https://github.com/Azure/MachineLearningNotebooks/blob/master/databricks/02.Ingest_data.ipynb) notebook to download the Adult Census Income data and split it into train and test sets.

## Build and train models

Run the [Build model with Run History](https://github.com/Azure/MachineLearningNotebooks/blob/master/databricks/03b.Build_model_runHistory.ipynb) notebook to:

* Prepare data using Pandas
* Split data into train and test sets
* Log training metrics into your machine learning workspace
* Manually train different models with Spark Mllib
* Find the best model from your runs

## Deploy and predict

Deploy your model from within Azure Databricks or using VS code with Azure ML SDK.  

### Deploy to ACI

Run the [Deploy to ACI](https://github.com/Azure/MachineLearningNotebooks/blob/master/databricks/04.Deploy_to_ACI.ipynb) notebook to:

* Register your best model in the machine learning workspace
* Provide a scoring file and a conda config file
* Deploy the model to  [Azure Container Instances](https://azure.microsoft.com/services/container-instances/) (ACI) and test the webservice

### Deploy to AKS

Run the [Deploy to AKS](https://github.com/Azure/MachineLearningNotebooks/blob/master/databricks/04.Deploy_to_AKS_existingImage.ipynb) notebook to:

* Deploy to [Azure Kubernetes Service](https://azure.microsoft.com/services/kubernetes-service/) (AKS) as a scalable webservice, using the image created in the ACI notebook
* Monitor the deployed webservice and model in Azure portal
