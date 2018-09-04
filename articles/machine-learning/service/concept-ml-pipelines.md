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

Machine learning (ML) pipelines are used by data scientists to build, optimize, and manage their ML workflows. A typical pipeline involves multiple steps from data prep, model training, and validation, deployment, to model evaluation.  

![png](./media/concept-ml-pipelines/pipelines.png)

## Why build pipelines?

With pipelines, you can optimize your workflow with simplicity, speed, portability, and reuse in mind. When building pipelines with Azure Machine Learning, data scientists can focus on what they know best -- machine learning -- rather than infrastructure.

Each step in the pipeline has an input and output -- beginning with data preparation through deployment and the training inner loop. The data that gets output by a step is often referred to as intermediate data since it becomes input for the next step. 

Using distinct steps makes it possible to rerun only the steps you need as you tweak and test. Once the pipeline is designed, there is often more tweaking done around training loop of the pipeline. Each time you rerun a pipeline, Azure identifies the steps that haven't changed to save time and resources.  Instead, the execution jumps to the steps that need to be rerun, such as an updated training script. The same paradigm applies to module reuse as well so that unchanged scripts and metadata are not reloaded. 

With Azure Machine Learning, your ML pipelines can benefit from platform and toolkit agnostic options for machine learning scenarios. Azure coordinates between the various compute targets you use so that your intermediate data can be shared with the downstream compute targets easily. Now, each step in your pipeline can benefit from the best toolkit or framework for the task. 

## Key advantages

The key advantages to building pipelines for your machine learning workflows is:

|Key advantage|Description|
|:-------:|-----------|
|**Unattended&nbsp;execution**|Schedule a few scripts to run in parallel or in sequence in a reliable and unattended manner. Since data prep and modeling can last days or weeks, you can now focus on other tasks while your pipeline is running. |
|**Agility**|Use Python methods to build and run your pipelines, even automatically retrying after errors.|
|**Mixed and diverse compute**|Use multiple pipelines that are reliably orchestrated across heterogeneous and scalable computes and storages. Individual pipeline steps can be run on different compute targets (for example, HDInsights, GPU Data Science VMs, Databricks, and so on) to make efficient use of available compute options.|
|**Reusability**|Pipelines can be templatized for specific scenarios such as retraining and batch scoring.  They can be triggered from external systems via simple REST calls.|
|**Tracking**|Instead of manually tracking data and result paths as you iterate, use the pipelines SDK to explicitly name and version your data sources, inputs, and outputs as well as manage scripts and data separately for increased productivity.|
|**Collaboration**|Share experiments you've run so other data scientists can reuse components that worked well.|

## Python SDK for pipelines

Create your ML pipelines in Python using the Azure Machine Learning SDK. This SDK offers imperative constructs for sequencing and parallelizing the steps in your pipelines. You can interact with it in Jupyter notebooks or in another preferred IDE. 

Using declarative data dependencies, you can optimize your ML tasks. The SDK includes a framework of pre-built modules for common tasks such as data transfer, provisioning, and model publishing. The framework can be extended to model your own conventions.

Pipelines can be saved as templates so you can schedule batch-scoring or retraining jobs.

Check out the Python reference docs for pipelines:
+ https://docs.microsoft.com/python/api/azureml_pipeline_core/?view=azure-ml-py
+ https://docs.microsoft.com/python/api/azureml_pipeline_steps/?view=azure-ml-py
+ https://docs.microsoft.com/python/api/azureml_pipeline_viz/?view=azure-ml-py

## Next steps

Download [this Jupyter notebook](https://aka.ms/aml-notebook-train) to try out a pipeline for yourself. 
