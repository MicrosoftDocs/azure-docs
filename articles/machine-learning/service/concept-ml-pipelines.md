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

# Machine learning pipelines with Azure Machine Learning service

What are ML pipelines in general? 


Share an image of how there is a pipeline layer over the data prep, experimentation/training pillar, and the deployment/model management pillar.

## Python-based SDK for pipelines
In Azure, you can create ML pipelines in Python using the Azure Machine Learning SDK. The SDK offers imperative constructs for sequencing and parallelization of steps. With the use of declarative data dependencies, optimized execution of the tasks can be achieved. The SDK can be easily used from Jupyter Notebook or any other preferred IDE. The SDK includes a framework of pre-built modules for common tasks such as data transfer, provisioning, and model publishing. The framework can be extended by users to model their own conventions. A pipeline can be saved as a template for schedules runs for batch-scoring or retraining.


## Why build pipelines with Azure Machine Learning

Pipelines allow you to optimize for simplicity, speed, portability, and reuse. You can focus on machine learning rather than infrastructure.

Do AML piplelines offer anything over other ML pipeline offerings?

The key advantages to building pipelines for your machine learning workflows is:

|Advantage|Description|
|:-------:|-----------|
|**Unattended execution**|Schedule a few scripts to run in parallel or in sequence in a reliable and unattended manner. Since the tasks for preparing data and modeling can last days or even weeks, you can focus on other tasks while you run your pipeline. |
|**Agility**|Use Python methods to build and run your pipelines, even automatically retrying after errors.|
|**Mixed and diverse compute**|You can have multiple pipelines that can be reliably orchestrated across heterogeneous and scalable computes and storages. Individual pipeline steps can be run on different compute targets (for example, HDInsights, GPU Data Science VMs, Databricks, and so on) to efficiently use of available compute options.|
|**Reusability**|Pipelines can be templatized for scenarios such as retraining and batch scoring so they can be triggered from external systems via a simple REST call.|
|**Tracking**|Instead of manually keeping track of data and result paths as you iterate, you can use the SDK to explicit named data sources, inputs, and outputs to version and manage scripts and data separately resulting in increased productivity.|
|**Collaboration**|AML Pipeline can be used socialize and share experiments (pipeline runs) and the intermediate steps in a fashion that allows data scientists to reuse components that worked well for others, and thereby build a healthy community around experimentation. This results in cost savings in terms of skipped reruns, performance and agility improvements for the inner loop iteration, and increased collaboration among teams.|
|**Dynamic compute management**|Users will be able to set a compute definition and provisioning policy for compute creation and tear-down. Users will be able to automate setting up of compute definition that includes type of compute, scaling up and scaling down options, quotas, among other things. User can optimize for pre-provisioned compute or cost-effectiveness by carefully choosing the compute provisioning policy on a per-task basis.|

## Next steps

Download [this Jupyter notebook](https://aka.ms/aml-notebook-train) to try out a pipeline for yourself. 