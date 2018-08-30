---
title: Build machine learning pipelines with Azure Machine Learning service
description: Learn about ML pipelines and Azure Machine Learning service. 
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.author: sanpil
author: sanpil
ms.date: 09/24/2018
---

# ML Pipelines with Azure Machine Learning

Machine learning pipelines are great for building and managing machine learning workflows. A typical machine learning workflow will have multiple tasks to prepare data, train model, and deploy and evaluate models. ML Pipelines enable data scientists to model and visualize such workflows. Tasks involved in the workflow are represented as nodes in a directed acyclic graph (DAG) in ML Pipelines. Therefore, ML Pipeline is a dataflow graph for building, training, validating, and deploying machine learning models with individual nodes in the pipeline can make use of diverse compute clusters (for e.g.: CPU for data preparation, GPU for training, and FPGA for deployment), toolkits (TensorFlow, CNTK) and programming languages (Python, C#).

(Add a graphic. It should include a pipeline layer over the  pillars (data prep, experimentation/training pillar, and the deployment/model management.)

## Python Pipeline SDK
In Azure, you can create ML Pipelines in Python using the Azure Machine Learning SDK. The SDK offers imperative constructs for sequencing and parallelizing steps. With the use of declarative data dependencies, optimized execution of the tasks can be achieved. The SDK can be easily used from Jupyter Notebook or any other preferred IDE. The SDK includes a framework of pre-built modules for common tasks such as data transfer, provisioning, and model publishing. The framework can be extended by users to model their own conventions. A pipeline can be saved as a template for scheduled runs for batch-scoring or retraining.

## Why build pipelines?

Pipelines allow you to optimize for simplicity, speed, portability, and reuse. When building them with Azure Machine Learning, you can focus on machine learning rather than infrastructure.

AML Pipelines offer platform and toolkit agnostic options for data preparation, training, and deployment for end-to-end machine learning scenarios. Data and module reuse enable machine learning inner loop agile as AML Pipelines infrastructure can identify to upload only updated datasources and run modified compute steps in the workflow. AML Pipelines takes care of intermediate data management of making the output of a preceding step available as the input of the subsequent steps regardless of the compute clusters used for the steps.

The key advantages to building pipelines for your machine learning workflows is:

|Advantage|Description|
|:-------:|-----------|
|**Unattended&nbsp;execution**|Schedule a few scripts to run in parallel or in sequence in a reliable and unattended manner. Since the tasks for preparing data and modeling can last days or even weeks, you can focus on other tasks while you run your pipeline. |
|**Agility**|Use Python methods to build and run your pipelines, even automatically retrying after errors.|
|**Mixed and diverse compute**|You can have multiple pipelines that can be reliably orchestrated across heterogeneous and scalable computes and storages. Individual pipeline steps can be run on different compute targets (for example, HDInsights, GPU Data Science VMs, Databricks, and so on) to efficiently use of available compute options.|
|**Reusability**|Pipelines can be templatized for scenarios such as retraining and batch scoring so they can be triggered from external systems via a simple REST call.|
|**Tracking**|Instead of manually keeping track of data and result paths as you iterate, you can use the SDK to explicit named data sources, inputs, and outputs to version and manage scripts and data separately resulting in increased productivity.|
|**Collaboration**|Share experiments you've run so other data scientists can reuse components that worked well.|



## Next steps

Download [this Jupyter notebook](https://aka.ms/aml-notebook-train) to try out a pipeline for yourself. 
