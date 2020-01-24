---
title: How to build a CICD data ingestion pipeline
titleSuffix: Azure Machine Learning
description: Learn how to use Azure Pipelines to automate the ingestion of data used to train your models. Add more info here that describes what the document talks about
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: csteegz
author: MayMSFT
manager: cgronlun
ms.reviewer: larryfr
ms.date: 01/15/2020

# Customer intent: As an experienced data scientist, I need to create a production data ingestion pipeline for the data used to train my models.

---

# DevOps for a Data Ingestion pipeline

In most scenarios a Data Ingestion solution is a composition of scripts, service invocations and a pipeline orchestrating all the activities. In this article, you learn how to apply DevOps practices to the development lifecycle of a common data ingestion pipeline taking care of the data preparation for the ML model training.

<!-- ## Prerequisites

* Bulleted list of things you need to be successful -->

## The solution

Consider the following data ingestion workflow:

In this approach, the training data is stored in a blob storage. An Azure Data Factory pipeline fetches the data from an input blob container, transforms it and saves the data to the output blob container serving as a data storage [LINK] for the Azure Machine Learning service. Having the data prepared, the Data Factory pipeline invokes a training Machine Learning pipeline to train a model. In this specific example the data fetching, transforming and saving to the output blob container is performed by a Python notebook, running on an Azure Databricks cluster.

## What we are building

As with any software solution, there is a team (e.g. Data Engineers) working on it. 

[Diagram]

They collaborate and share the same Azure resources such as Azure Data Factory workspace, Azure Databricks workspace, Azure Storage account, etc. The collection of these resources is a Development environment. The data engineers contribute to the same source code base. The Continuous Integration process assembles the code, checks it with the numerous code quality tests, unit tests and produces artifacts (tested code, ARM templates) ready to be deployed to the downstream environments by the Continuous Delivery process.

## Source Control Management



## Next steps

* Links to documents that are logical next steps. Just a couple, maybe 3 or 4.
