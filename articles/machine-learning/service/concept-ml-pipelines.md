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

Machine learning (ML) pipelines are used by data scientists to build and manage ML workflows. A typical ML pipeline has multiple steps covering data preparation, model training and validation, deployment, and finally model evaluation.  

When you visualize a pipeline, you might start with a set of data sources, apply compute steps on the source data, and produce intermediate data. It is referred to as intermediate since it becomes input for the next step. This happens from one step to the next, and so on, throughout the pipeline.  Once the flow is designed, you might optimize a training script by testing and validating it. Pipelines help make this process easier.

![png](./media/concept-ml-pipelines/pipelines.png)

## Why build pipelines?

With pipelines, you can optimize your workflow with simplicity, speed, portability, and reuse in mind. When building pipelines with Azure Machine Learning, data scientists can focus on what they know best -- machine learning -- rather than infrastructure.

Often, the pipeline starts with several data preparation steps and ends with some deployment steps and the training is in-between them. Using distinct steps makes it possible to rerun only those you need when tweaking or testing. When you rerun a pipeline, Azure recognizes the steps that didn't change, and saves time by skipping them. Instead, the execution jumps directly to the steps that need to be run again, for example, the training script you updated. The same paradigm applies to module reuse as well. If the script and the associated metadata remain the same, the files associated with a given step are not reloaded.

With Azure Machine Learning, your ML pipelines can benefit from platform and toolkit agnostic options for  end-to-end machine learning scenarios. Azure automatically orchestrates between the various compute targets you use so that your intermediate data can be shared with the downstream compute targets. Now, each step in your pipeline can use the best toolkit, programming language, or framework for the task. 

The key advantages to building pipelines for your machine learning workflows is:

|Key advantage|Description|
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
