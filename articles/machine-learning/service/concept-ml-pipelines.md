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

Machine learning pipelines are great for reproducible machine learning tasks.
What are ML pipelines in general? 

(Add a graphic. It should include a pipeline layer over the  pillars (data prep, experimentation/training pillar, and the deployment/model management.)

## Python pipeline SDK
In Azure, you can create ML pipelines in Python using the Azure Machine Learning SDK. The SDK offers imperative constructs for sequencing and parallelizing steps. With the use of declarative data dependencies, optimized execution of the tasks can be achieved. The SDK can be easily used from Jupyter Notebook or any other preferred IDE. The SDK includes a framework of pre-built modules for common tasks such as data transfer, provisioning, and model publishing. The framework can be extended by users to model their own conventions. A pipeline can be saved as a template for schedules runs for batch-scoring or retraining.

## Why build pipelines?

Pipelines allow you to optimize for simplicity, speed, portability, and reuse. When building them with Azure Machine Learning, you can focus on machine learning rather than infrastructure.

Do AML pipelines offer anything over other ML pipeline offerings?
(Can we make this shorter... easier to scan)

The key advantages to building pipelines for your machine learning workflows is:

|Advantage|Description|
|:-------:|-----------|
|**Unattended&nbsp;execution**|Schedule a few scripts to run in parallel or in sequence in a reliable and unattended manner. Since the tasks for preparing data and modeling can last days or even weeks, you can focus on other tasks while you run your pipeline. |
|**Agility**|Use Python methods to build and run your pipelines, even automatically retrying after errors.|
|**Mixed and diverse compute**|You can have multiple pipelines that can be reliably orchestrated across heterogeneous and scalable computes and storages. Individual pipeline steps can be run on different compute targets (for example, HDInsights, GPU Data Science VMs, Databricks, and so on) to efficiently use of available compute options.|
|**Reusability**|Pipelines can be templatized for scenarios such as retraining and batch scoring so they can be triggered from external systems via a simple REST call.|
|**Tracking**|Instead of manually keeping track of data and result paths as you iterate, you can use the SDK to explicit named data sources, inputs, and outputs to version and manage scripts and data separately resulting in increased productivity.|
|**Collaboration**|Share experiments you've run so other data scientists can reuse components that worked well.|
|**Dynamic compute target management**|Define and automate policies for setting up, tearing down, and scaling compute targets on a per-task basis.|


## Next steps

Download [this Jupyter notebook](https://aka.ms/aml-notebook-train) to try out a pipeline for yourself. 