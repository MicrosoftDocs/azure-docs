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

# ML pipelines with Azure Machine Learning

Machine learning (ML) pipelines are great for building and managing ML workflows. A typical ML workflow has multiple tasks covering data preparation, model training and validation, deployment, and finally model evaluation.  

ML Pipeline is a dataflow graph for the machine learning models workflow. Individual nodes in the pipeline can use different compute targets that can best handle the job. For example, the data preparation node can use CPU, training can use GPU, and deployment could be with FPGAs. Nodes can also use the best toolkit, programming language or framework for the task. 

(Add a graphic. It should include a pipeline layer over the  pillars (data prep, experimentation/training pillar, and the deployment/model management.)

![png](./media/concept-ml-pipelines/pipelines.png)

## Why build pipelines?

With pipelines, you can optimize your workflow with simplicity, speed, portability, and reuse in mind. When building pipelines with Azure Machine Learning, data scientists can focus on what they know best -- machine learning -- rather than infrastructure.

With Azure Machine Learning, your ML pipelines can benefit from platform and toolkit agnostic options for  end-to-end machine learning scenarios. Data and module reuse enable machine learning inner loop agile as AML Pipelines infrastructure can identify to upload only updated data sources and run modified compute steps in the workflow. AML Pipelines take care of intermediate data management of making the output of a preceding step available as the input of the subsequent steps regardless of the compute clusters used for the steps.

The key advantages to building pipelines for your machine learning workflows is:

|Advantage|Description|
|:-------:|-----------|
|**Unattended&nbsp;execution**|Schedule a few scripts to run in parallel or in sequence in a reliable and unattended manner. Since data prep and modeling can last days or weeks, you can now focus on other tasks while your pipeline is running. |
|**Agility**|Use Python methods to build and run your pipelines, even automatically retrying after errors.|
|**Mixed and diverse compute**|Use multiple pipelines that are reliably orchestrated across heterogeneous and scalable computes and storages. Individual pipeline steps can be run on different compute targets (for example, HDInsights, GPU Data Science VMs, Databricks, and so on) to make efficient use of available compute options.|
|**Reusability**|Pipelines can be templatized for scenarios such as retraining and batch scoring so they can be triggered from external systems via simple REST calls.|
|**Tracking**|Instead of manually tracking data and result paths as you iterate, use the pipelines SDK to explicitly name and version your data sources, inputs, and outputs as well as manage scripts and data separately for increased productivity.|
|**Collaboration**|Share experiments you've run so other data scientists can reuse components that worked well.|

## Python SDK for pipelines
In Azure, you can create ML pipelines in Python using the Azure Machine Learning SDK. The SDK offers imperative constructs for sequencing and parallelizing steps. 

With the use of declarative data dependencies, you can optimize the execution of your ML tasks. Work comfortably in Jupyter notebooks or in any other preferred IDE. The SDK includes a framework of pre-built modules for common tasks such as data transfer, provisioning, and model publishing. The framework can be extended to model your own conventions.

Pipelines can be saved as templates so you can schedule batch-scoring or retraining jobs.

Check out the Python reference docs for pipelines:
+ https://docs.microsoft.com/python/api/azureml_pipeline_core/?view=azure-ml-py
+ https://docs.microsoft.com/python/api/azureml_pipeline_steps/?view=azure-ml-py
+ https://docs.microsoft.com/python/api/azureml_pipeline_viz/?view=azure-ml-py

## Next steps

Download [this Jupyter notebook](https://aka.ms/aml-notebook-train) to try out a pipeline for yourself. 
